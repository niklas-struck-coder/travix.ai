import { handler, send } from "../lib/http.js";
import { listGameCodes, mutateGame } from "../lib/store.js";
import { getQuotes } from "../lib/market.js";
import { berlinDay, portfolioValue } from "../lib/game.js";

// Täglicher Schnappschuss der Depotwerte für den Verlaufs-Chart der Rangliste
export default handler(async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) return send(res, 401, { error: "Nicht erlaubt." });
  const { quotes } = await getQuotes();
  const day = berlinDay();
  let done = 0;
  for (const code of await listGameCodes()) {
    try {
      await mutateGame(code, (game) => {
        if (Date.now() > game.endAt + 864e5) return;
        const v = {};
        for (const [pid, p] of Object.entries(game.players)) v[pid] = Math.round(portfolioValue(p, quotes) * 100) / 100;
        game.history = (game.history || []).filter((h) => h.d !== day);
        game.history.push({ d: day, v });
        game.history = game.history.slice(-400);
      });
      done++;
    } catch (e) {
      console.error(code, e);
    }
  }
  send(res, 200, { ok: true, games: done });
});
