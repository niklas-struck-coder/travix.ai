import { randomBytes } from "node:crypto";
import { handler, send, body } from "../lib/http.js";
import { HttpError, readGame, createGame, mutateGame } from "../lib/store.js";
import { addPlayer, login, checkPin, cleanName, newCode, ended, publicGame, berlinDay, MAX_PLAYERS } from "../lib/game.js";

const DAY = 864e5;

export default handler(async (req, res) => {
  if (req.method === "GET") {
    const g = await readGame(String(req.query.code || "").toUpperCase());
    if (!g) throw new HttpError(404, "Spiel nicht gefunden. Prüfe den Code.");
    return send(res, 200, publicGame(g.data));
  }
  const b = body(req);
  const playerName = cleanName(b.playerName, 24);
  if (!playerName) throw new HttpError(400, "Gib deinen Spielernamen ein.");
  const pin = checkPin(b.pin);

  if (b.action === "create") {
    const name = cleanName(b.name, 40);
    const startCash = Math.round(Number(b.startCash));
    const fee = Math.round(Number(b.fee) * 100) / 100;
    const endAt = Number(b.endAt);
    if (!name) throw new HttpError(400, "Gib dem Spiel einen Namen.");
    if (!(startCash >= 100 && startCash <= 10_000_000)) throw new HttpError(400, "Startguthaben: zwischen 100 € und 10 Mio. €.");
    if (!(fee >= 0 && fee <= 50)) throw new HttpError(400, "Ordergebühr: zwischen 0 € und 50 €.");
    if (!(endAt > Date.now() + DAY && endAt < Date.now() + 400 * DAY)) throw new HttpError(400, "Das Spielende muss zwischen morgen und in gut einem Jahr liegen.");
    for (let i = 0; i < 5; i++) {
      const code = newCode();
      if (await readGame(code)) continue;
      const game = { code, name, startCash, fee, endAt, createdAt: Date.now(), salt: randomBytes(12).toString("hex"), players: {}, feed: [], history: [] };
      const me = addPlayer(game, playerName, pin);
      game.createdBy = me.pid;
      game.history.push({ d: berlinDay(), v: { [me.pid]: startCash } });
      await createGame(code, game);
      return send(res, 200, { ...me, game: publicGame(game) });
    }
    throw new HttpError(500, "Konnte keinen freien Code finden. Bitte nochmal versuchen.");
  }

  if (b.action === "join") {
    const code = String(b.code || "").toUpperCase().trim();
    const { game, result } = await mutateGame(code, (game) => {
      const back = login(game, playerName, pin);
      if (back) return back;
      if (ended(game)) throw new HttpError(400, "Dieses Spiel ist schon vorbei.");
      if (Object.keys(game.players).length >= MAX_PLAYERS) throw new HttpError(400, `Das Spiel ist voll (${MAX_PLAYERS} Spieler).`);
      const me = addPlayer(game, playerName, pin);
      const today = berlinDay();
      const last = game.history[game.history.length - 1];
      if (last && last.d === today) last.v[me.pid] = game.startCash;
      else game.history.push({ d: today, v: { [me.pid]: game.startCash } });
      return me;
    });
    return send(res, 200, { ...result, game: publicGame(game) });
  }
  throw new HttpError(400, "Unbekannte Aktion.");
});
