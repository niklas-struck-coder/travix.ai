import { handler, send, body } from "../lib/http.js";
import { HttpError, mutateGame } from "../lib/store.js";
import { authPlayer, ended, executeTrade, publicGame } from "../lib/game.js";
import { priceFor } from "../lib/market.js";
import { BY_ID } from "../lib/assets.js";

export default handler(async (req, res) => {
  const b = body(req);
  const asset = BY_ID[b.id];
  if (!asset) throw new HttpError(400, "Diesen Wert gibt es nicht.");
  if (b.side !== "buy" && b.side !== "sell") throw new HttpError(400, "Kaufen oder verkaufen?");
  const q = await priceFor(asset.id);
  if (!q || !(q.p > 0)) throw new HttpError(503, "Für diesen Wert gibt es gerade keinen Kurs. Versuch es gleich nochmal.");
  if (q.stale) throw new HttpError(503, "Der Kurs ist gerade nicht aktuell. Versuch es gleich nochmal.");
  if (!q.open) throw new HttpError(400, `Die Börse für ${asset.name} ist gerade geschlossen. Gehandelt wird nur während der Handelszeiten.`);

  const { game, result } = await mutateGame(String(b.code || "").toUpperCase(), (game) => {
    const p = authPlayer(game, b.pid, b.token);
    if (ended(game)) throw new HttpError(400, "Das Spiel ist beendet, der Handel ist geschlossen.");
    const fee = game.fee || 0;
    let qty;
    if (b.all && b.side === "sell") qty = p.holdings[asset.id]?.qty || 0;
    else if (b.all && b.side === "buy") qty = (p.cash - fee) / q.p;
    else if (b.eur != null) qty = b.side === "buy" ? (Number(b.eur) - fee) / q.p : Number(b.eur) / q.p;
    else qty = Number(b.qty);
    if (!Number.isFinite(qty) || qty <= 0) throw new HttpError(400, "Gib eine Menge größer 0 ein (Gebühr beachten).");
    return executeTrade(game, b.pid, { id: asset.id, side: b.side, qty, price: q.p });
  });
  send(res, 200, { trade: result, game: publicGame(game) });
});
