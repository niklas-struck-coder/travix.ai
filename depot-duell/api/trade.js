import { handler, send, body } from "../lib/http.js";
import { HttpError, mutateGame } from "../lib/store.js";
import { authPlayer, ended, executeTrade, queueOrder, cancelPending, publicGame } from "../lib/game.js";
import { priceFor } from "../lib/market.js";
import { BY_ID } from "../lib/assets.js";

export default handler(async (req, res) => {
  const b = body(req);
  const code = String(b.code || "").toUpperCase();

  // Vorgemerkten Auftrag stornieren
  if (b.action === "cancelPending") {
    const { game } = await mutateGame(code, (game) => {
      authPlayer(game, b.pid, b.token);
      cancelPending(game, b.pid, Number(b.t));
    });
    return send(res, 200, { game: publicGame(game) });
  }

  const asset = BY_ID[b.id];
  if (!asset) throw new HttpError(400, "Diesen Wert gibt es nicht.");
  if (b.side !== "buy" && b.side !== "sell") throw new HttpError(400, "Kaufen oder verkaufen?");

  const q = await priceFor(asset.id);
  const tradable = q && q.p > 0 && q.open && !q.stale;

  // Börse zu (oder Kurs gerade nicht aktuell) -> vormerken oder ablehnen
  if (!tradable) {
    if (!b.queue) {
      const why = q && q.stale ? "Der Kurs ist gerade nicht aktuell." : `Die Börse für ${asset.name} ist gerade geschlossen.`;
      throw new HttpError(400, `${why} Du kannst die Order zum nächsten Börsenstart vormerken.`);
    }
    const { game, result } = await mutateGame(code, (game) => {
      authPlayer(game, b.pid, b.token);
      if (ended(game)) throw new HttpError(400, "Das Spiel ist beendet, der Handel ist geschlossen.");
      const o = { id: asset.id, side: b.side };
      if (b.all) o.all = true;
      else if (b.eur != null) o.eur = Number(b.eur);
      else o.qty = Number(b.qty);
      if (!o.all && !(o.eur > 0) && !(o.qty > 0)) throw new HttpError(400, "Gib an, wie viel du vormerken willst.");
      return queueOrder(game, b.pid, o);
    });
    return send(res, 200, { queued: result, game: publicGame(game) });
  }

  // Börse offen -> sofort ausführen
  const { game, result } = await mutateGame(code, (game) => {
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
