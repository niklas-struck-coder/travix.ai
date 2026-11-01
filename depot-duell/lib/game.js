import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { HttpError } from "./store.js";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const MAX_PLAYERS = 30;
const MAX_TRADES = 300;
const MAX_FEED = 200;
const MAX_PENDING = 40;

export const newCode = () => Array.from({ length: 6 }, () => CODE_CHARS[randomInt(CODE_CHARS.length)]).join("");
export const newId = () => randomBytes(6).toString("hex");
export const newToken = () => randomBytes(24).toString("base64url");
const sha = (s) => createHash("sha256").update(s).digest("hex");
const same = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

export const hashPin = (game, pin) => sha(`${game.salt}:${pin}`);
export const hashToken = (token) => sha(token);
export const berlinDay = (ms = Date.now()) => new Date(ms).toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });

export function cleanName(s, max) {
  return String(s ?? "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max);
}

export function checkPin(pin) {
  if (!/^\d{4,8}$/.test(String(pin ?? ""))) throw new HttpError(400, "Die PIN muss aus 4 bis 8 Ziffern bestehen.");
  return String(pin);
}

export function addPlayer(game, name, pin) {
  const id = newId();
  const token = newToken();
  game.players[id] = {
    name,
    pin: hashPin(game, pin),
    tokens: [hashToken(token)],
    cash: game.startCash,
    holdings: {},
    trades: [],
    pending: [],
    joinedAt: Date.now(),
  };
  return { pid: id, token };
}

export function login(game, name, pin) {
  const entry = Object.entries(game.players).find(([, p]) => p.name.toLowerCase() === name.toLowerCase());
  if (!entry) return null;
  const [pid, p] = entry;
  if (!same(p.pin, hashPin(game, pin))) throw new HttpError(403, `Den Namen „${p.name}“ gibt es schon, und die PIN passt nicht.`);
  const token = newToken();
  p.tokens = [hashToken(token), ...(p.tokens || [])].slice(0, 6);
  return { pid, token };
}

export function authPlayer(game, pid, token) {
  const p = game.players[pid];
  if (!p || !token || !(p.tokens || []).some((t) => same(t, hashToken(String(token))))) {
    throw new HttpError(401, "Du bist in diesem Spiel nicht angemeldet. Tritt mit deinem Namen und deiner PIN erneut bei.");
  }
  return p;
}

export const ended = (game) => Date.now() >= game.endAt;

export function portfolioValue(p, quotes) {
  let v = p.cash;
  for (const [id, h] of Object.entries(p.holdings)) v += h.qty * (quotes[id]?.p ?? h.cost / h.qty);
  return v;
}

// Führt eine Order aus. Prüfung von Spielende/Marktzeiten passiert vorher.
export function executeTrade(game, pid, { id, side, qty, price }) {
  const p = game.players[pid];
  const fee = game.fee || 0;
  qty = Math.floor(qty * 1e8) / 1e8;
  if (!(qty > 0)) throw new HttpError(400, "Die Menge ist zu klein.");
  const h = p.holdings[id] || { qty: 0, cost: 0 };
  let total;
  if (side === "buy") {
    total = qty * price + fee;
    if (total > p.cash + 1e-6) throw new HttpError(400, "Nicht genug Bargeld für diese Order.");
    p.cash -= total;
    h.qty += qty;
    h.cost += qty * price;
    p.holdings[id] = h;
  } else {
    if (qty > h.qty + 1e-9) throw new HttpError(400, "So viele Anteile hast du nicht.");
    qty = Math.min(qty, h.qty);
    const avg = h.qty ? h.cost / h.qty : 0;
    total = qty * price - fee;
    p.cash += total;
    h.cost -= avg * qty;
    h.qty -= qty;
    if (h.qty < 1e-9) delete p.holdings[id];
    else p.holdings[id] = h;
  }
  p.cash = Math.round(p.cash * 1e6) / 1e6;
  const trade = { t: Date.now(), id, side, qty, p: price, fee };
  p.trades = [trade, ...p.trades].slice(0, MAX_TRADES);
  game.feed = [{ ...trade, pid }, ...(game.feed || [])].slice(0, MAX_FEED);
  return trade;
}

// Einen Auftrag vormerken (wird beim nächsten Börsenstart ausgeführt)
export function queueOrder(game, pid, o) {
  const p = game.players[pid];
  p.pending = p.pending || [];
  if (p.pending.length >= MAX_PENDING) throw new HttpError(400, "Du hast schon zu viele vorgemerkte Aufträge.");
  const entry = { t: Date.now(), id: o.id, side: o.side };
  if (o.all) entry.all = true;
  else if (o.eur != null) entry.eur = o.eur;
  else entry.qty = o.qty;
  p.pending.push(entry);
  return entry;
}

export function cancelPending(game, pid, t) {
  const p = game.players[pid];
  p.pending = (p.pending || []).filter((o) => o.t !== t);
}

// Vorgemerkte Aufträge ausführen, sobald die jeweilige Börse offen ist.
// quoteFor(id) -> {p, open} | undefined. Gibt die Anzahl ausgeführter Aufträge zurück.
export function processPending(game, quoteFor) {
  let done = 0;
  for (const [pid, p] of Object.entries(game.players)) {
    if (!p.pending || !p.pending.length) continue;
    if (ended(game)) { p.pending = []; continue; } // Spiel vorbei: Vormerkungen verfallen
    const keep = [];
    const fee = game.fee || 0;
    for (const o of p.pending) {
      const q = quoteFor(o.id);
      if (!q || !q.open || !(q.p > 0)) { keep.push(o); continue; } // Börse noch zu: warten
      let qty;
      if (o.all && o.side === "sell") qty = p.holdings[o.id]?.qty || 0;
      else if (o.all && o.side === "buy") qty = Math.max(0, (p.cash - fee) / q.p);
      else if (o.eur != null) qty = o.side === "buy" ? Math.max(0, (o.eur - fee) / q.p) : o.eur / q.p;
      else qty = o.qty;
      if (o.side === "buy") qty = Math.min(qty, Math.max(0, (p.cash - fee) / q.p)); // an Bargeld anpassen
      if (o.side === "sell") qty = Math.min(qty, p.holdings[o.id]?.qty || 0);
      if (!(qty > 0)) continue; // nicht mehr ausführbar (kein Geld / keine Stücke) -> verwerfen
      try {
        const t = executeTrade(game, pid, { id: o.id, side: o.side, qty, price: q.p });
        t.queued = true;
        if (game.feed && game.feed[0]) game.feed[0].queued = true;
        done++;
      } catch {
        // nicht ausführbar -> Auftrag verfällt
      }
    }
    p.pending = keep;
  }
  return done;
}

// Alle Symbole, für die es offene Vormerkungen gibt
export function pendingSymbols(game) {
  const s = new Set();
  for (const p of Object.values(game.players || {})) for (const o of p.pending || []) s.add(o.id);
  return [...s];
}

export function publicGame(game) {
  const players = {};
  for (const [pid, p] of Object.entries(game.players)) {
    players[pid] = { name: p.name, cash: p.cash, holdings: p.holdings, trades: p.trades.slice(0, 100), pending: p.pending || [], joinedAt: p.joinedAt };
  }
  return {
    code: game.code,
    name: game.name,
    startCash: game.startCash,
    fee: game.fee,
    createdAt: game.createdAt,
    endAt: game.endAt,
    createdBy: game.createdBy,
    players,
    feed: (game.feed || []).slice(0, 60),
    history: game.history || [],
  };
}
