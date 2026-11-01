import { ASSETS, BY_ID } from "./assets.js";
import { readJson, writeJson } from "./store.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const QUOTE_TTL = 90_000;
const SNAPSHOT_EVERY = 10 * 60_000;
const CHUNK = 50;

async function fetchText(url, opts = {}, timeout = 9000) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json", ...(opts.headers || {}) }, signal: AbortSignal.timeout(timeout) });
  return r;
}
async function fetchJson(url, timeout = 9000) {
  const r = await fetchText(url, {}, timeout);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (i < items.length) {
      const n = i++;
      out[n] = await fn(items[n]).catch(() => null);
    }
  }));
  return out;
}

/* ---------- Stapel-Kurse über den offenen Spark-Endpunkt (ohne Login) ---------- */
// Liefert { symbol: {price, prev, chgPct} }
async function sparkChunk(symbols) {
  const qs = `symbols=${symbols.map(encodeURIComponent).join(",")}&range=1d&interval=1d`;
  for (const host of ["query1", "query2"]) {
    try {
      const r = await fetchText(`https://${host}.finance.yahoo.com/v8/finance/spark?${qs}`);
      if (!r.ok) continue;
      const j = await r.json();
      const out = {};
      for (const [sym, v] of Object.entries(j || {})) {
        if (!v || typeof v !== "object") continue;
        const price = v.fulldayPrice ?? (Array.isArray(v.close) ? v.close[v.close.length - 1] : null);
        if (!(price > 0)) continue;
        out[sym] = { price, prev: v.chartPreviousClose ?? null, chgPct: v.fulldayChangePercent ?? null };
      }
      if (Object.keys(out).length) return out;
    } catch {
      // nächster Host
    }
  }
  return {};
}

// Währung aus dem Yahoo-Symbol ableiten
function curOf(a) {
  if (a.cls === "krypto") return "EUR";
  const y = a.yahoo;
  if (y.endsWith("-EUR")) return "EUR";
  if (/\.(DE|F|PA|AS|MI|MC|BR|LS|HE|VI|IR)$/.test(y)) return "EUR";
  if (y.endsWith(".SW")) return "CHF";
  if (y.endsWith(".L")) return "GBp";
  return "USD"; // US-Aktien, ADRs, Rohstoff-Futures, US-ETFs
}

// Börsenöffnung aus der Zeit in Berlin ableiten
function berlinNow() {
  const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
  const g = (k) => p.find((x) => x.type === k)?.value;
  return { wd: g("weekday"), min: Number(g("hour")) * 60 + Number(g("minute")) };
}
function isOpen(a, bn) {
  if (a.cls === "krypto") return true;
  const weekend = bn.wd === "Sat" || bn.wd === "Sun";
  if (weekend) return false;
  if (a.yahoo.endsWith("=F")) return true; // Rohstoff-Futures fast durchgehend werktags
  const cur = curOf(a);
  if (cur === "USD") return bn.min >= 930 && bn.min < 1320; // US-Börse 15:30–22:00 Berlin
  return bn.min >= 540 && bn.min < 1050; // europäische Börsen 09:00–17:30
}

export async function yahooChart(symbol, range = "1d", interval = "5m") {
  const q = `v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
  for (const host of ["query1", "query2"]) {
    try {
      const j = await fetchJson(`https://${host}.finance.yahoo.com/${q}`);
      const res = j?.chart?.result?.[0];
      if (res?.meta?.regularMarketPrice != null) return res;
    } catch {
      // nächster Host
    }
  }
  return null;
}

/* ---------- Wechselkurse (Einheiten Fremdwährung je 1 Euro) ---------- */
async function fxRates(currencies) {
  const rates = { EUR: 1 };
  const need = [...new Set(currencies.map((c) => (c === "GBp" ? "GBP" : c)))].filter((c) => c && c !== "EUR");
  if (need.length) {
    const res = await sparkChunk(need.map((c) => `EUR${c}=X`));
    for (const [sym, v] of Object.entries(res)) {
      const cur = sym.slice(3, 6);
      if (v.price > 0) rates[cur] = v.price;
    }
  }
  if (rates.GBP) rates.GBp = rates.GBP * 100;
  return rates;
}

/* ---------- alle Kurse laden ---------- */
async function loadQuotes() {
  const chunks = [];
  for (let i = 0; i < ASSETS.length; i += CHUNK) chunks.push(ASSETS.slice(i, i + CHUNK));
  const results = await pool(chunks, 6, (c) => sparkChunk(c.map((a) => a.yahoo)));
  const raw = {};
  for (const map of results) if (map) Object.assign(raw, map);

  const rates = await fxRates(ASSETS.map(curOf));
  const bn = berlinNow();
  const quotes = {};
  for (const a of ASSETS) {
    const q = raw[a.yahoo];
    if (!q || !(q.price > 0)) continue;
    const rate = rates[curOf(a)];
    if (!rate) continue;
    quotes[a.id] = {
      p: q.price / rate,
      chg: q.chgPct != null ? q.chgPct / 100 : q.prev ? q.price / q.prev - 1 : null,
      open: isOpen(a, bn),
      t: Date.now(),
    };
  }
  return quotes;
}

let cache = null;
let inflight = null;
let lastSnapshot = 0;

export async function getQuotes() {
  if (cache && Date.now() - cache.at < QUOTE_TTL) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    let quotes = {};
    try {
      quotes = await loadQuotes();
    } catch {
      quotes = {};
    }
    const have = Object.keys(quotes).length;
    if (have < ASSETS.length * 0.5) {
      // zu wenig geladen: letzten Schnappschuss als Rückfall nehmen
      const snap = await readJson("market/last.json").catch(() => null);
      if (snap?.data?.quotes) {
        for (const [id, q] of Object.entries(snap.data.quotes)) if (!quotes[id]) quotes[id] = { ...q, stale: true };
      }
    } else if (Date.now() - lastSnapshot > SNAPSHOT_EVERY) {
      lastSnapshot = Date.now();
      writeJson("market/last.json", { at: Date.now(), quotes }).catch(() => {});
    }
    cache = { at: Date.now(), quotes };
    return cache;
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

// Frischer Kurs für eine Order (max. QUOTE_TTL alt)
export async function priceFor(id) {
  const a = BY_ID[id];
  if (!a) return null;
  const { quotes, at } = await getQuotes();
  const q = quotes[id];
  if (q && !q.stale && Date.now() - at < QUOTE_TTL) return q;
  const res = await sparkChunk([a.yahoo]);
  const one = res[a.yahoo];
  if (!one || !(one.price > 0)) return q || null;
  const cur = curOf(a);
  const rate = (await fxRates([cur]))[cur];
  if (!rate) return q || null;
  return { p: one.price / rate, chg: one.chgPct != null ? one.chgPct / 100 : null, open: isOpen(a, berlinNow()), t: Date.now() };
}

const RANGES = { "1d": "5m", "5d": "30m", "1mo": "1h", "6mo": "1d", "1y": "1d", "5y": "1wk" };

export async function chart(id, range) {
  const a = BY_ID[id];
  if (!a || !RANGES[range]) return null;
  const res = await yahooChart(a.yahoo, range, RANGES[range]);
  if (!res) return null;
  const rates = await fxRates([res.meta.currency]);
  const rate = rates[res.meta.currency];
  if (!rate) return null;
  const ts = res.timestamp || [];
  const closes = res.indicators?.quote?.[0]?.close || [];
  const points = [];
  ts.forEach((t, i) => {
    if (closes[i] != null) points.push([t * 1000, closes[i] / rate]);
  });
  return { id, range, points };
}
