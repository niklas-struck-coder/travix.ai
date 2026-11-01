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

/* ---------- Yahoo-Zugang: Cookie + Crumb ---------- */
let auth = null; // { cookie, crumb }
async function getAuth(force = false) {
  if (auth && !force) return auth;
  for (const host of ["fc.yahoo.com", "finance.yahoo.com"]) {
    try {
      const r = await fetchText(`https://${host}/`);
      const list = typeof r.headers.getSetCookie === "function" ? r.headers.getSetCookie() : (r.headers.get("set-cookie") ? [r.headers.get("set-cookie")] : []);
      const cookie = list.map((c) => c.split(";")[0]).filter(Boolean).join("; ");
      if (!cookie) continue;
      const cr = await fetchText("https://query1.finance.yahoo.com/v1/test/getcrumb", { headers: { Cookie: cookie } });
      const crumb = (await cr.text()).trim();
      if (crumb && crumb.length < 40 && !crumb.includes("<")) {
        auth = { cookie, crumb };
        return auth;
      }
    } catch {
      // nächsten Host versuchen
    }
  }
  auth = null;
  return null;
}

async function quoteChunk(symbols) {
  const a = await getAuth();
  if (!a) return [];
  const qs = `symbols=${symbols.map(encodeURIComponent).join(",")}&crumb=${encodeURIComponent(a.crumb)}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetchText(`https://query1.finance.yahoo.com/v7/finance/quote?${qs}`, { headers: { Cookie: (auth || a).cookie } });
      if (r.status === 401 || r.status === 403) {
        await getAuth(true);
        continue;
      }
      if (!r.ok) return [];
      const j = await r.json();
      return j?.quoteResponse?.result || [];
    } catch {
      return [];
    }
  }
  return [];
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
    const res = await quoteChunk(need.map((c) => `EUR${c}=X`));
    for (const q of res) {
      const cur = (q.symbol || "").slice(3, 6);
      if (q.regularMarketPrice > 0) rates[cur] = q.regularMarketPrice;
    }
  }
  if (rates.GBP) rates.GBp = rates.GBP * 100;
  return rates;
}

/* ---------- alle Kurse laden ---------- */
async function loadQuotes() {
  const chunks = [];
  for (let i = 0; i < ASSETS.length; i += CHUNK) chunks.push(ASSETS.slice(i, i + CHUNK));
  const results = await pool(chunks, 6, (c) => quoteChunk(c.map((a) => a.yahoo)));
  const raw = {};
  for (const arr of results) if (arr) for (const q of arr) if (q?.symbol) raw[q.symbol] = q;

  const rates = await fxRates(Object.values(raw).map((q) => q.currency));
  const quotes = {};
  for (const a of ASSETS) {
    const q = raw[a.yahoo];
    if (!q || !(q.regularMarketPrice > 0)) continue;
    const rate = rates[q.currency];
    if (!rate) continue;
    const open = a.cls === "krypto" ? true : q.marketState === "REGULAR";
    quotes[a.id] = {
      p: q.regularMarketPrice / rate,
      chg: q.regularMarketChangePercent != null ? q.regularMarketChangePercent / 100 : null,
      open,
      t: (q.regularMarketTime || Date.now() / 1000) * 1000,
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
  const res = await quoteChunk([a.yahoo]);
  const one = res[0];
  if (!one || !(one.regularMarketPrice > 0)) return q || null;
  const rates = await fxRates([one.currency]);
  const rate = rates[one.currency];
  if (!rate) return q || null;
  return { p: one.regularMarketPrice / rate, chg: one.regularMarketChangePercent != null ? one.regularMarketChangePercent / 100 : null, open: a.cls === "krypto" ? true : one.marketState === "REGULAR", t: Date.now() };
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
