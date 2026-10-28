import { ASSETS, BY_ID } from "./assets.js";
import { readJson, writeJson } from "./store.js";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
const QUOTE_TTL = 60_000;
const SNAPSHOT_EVERY = 10 * 60_000;

async function fetchJson(url, timeout = 8000) {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(timeout) });
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

export async function yahooChart(symbol, range = "1d", interval = "5m") {
  const q = `v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
  for (const host of ["query1", "query2"]) {
    try {
      const j = await fetchJson(`https://${host}.finance.yahoo.com/${q}`);
      const res = j?.chart?.result?.[0];
      if (res?.meta?.regularMarketPrice != null) return res;
    } catch {
      // nächsten Host versuchen
    }
  }
  return null;
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

// Einheiten der Fremdwährung pro 1 Euro, z. B. USD -> 1.08
async function fxRates(currencies) {
  const rates = { EUR: 1 };
  const need = [...new Set(currencies.map((c) => (c === "GBp" ? "GBP" : c)))].filter((c) => c && c !== "EUR");
  await pool(need, 6, async (c) => {
    const res = await yahooChart(`EUR${c}=X`);
    if (res) rates[c] = res.meta.regularMarketPrice;
  });
  if (rates.GBP) rates.GBp = rates.GBP * 100;
  return rates;
}

function marketOpen(meta) {
  const tp = meta.currentTradingPeriod?.regular;
  if (!tp) return true;
  const now = Date.now() / 1000;
  return now >= tp.start && now < tp.end;
}

async function geckoQuotes(ids) {
  if (!ids.length) return {};
  try {
    const j = await fetchJson(`https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=eur&include_24hr_change=true`);
    return j;
  } catch {
    return {};
  }
}

async function loadQuotes() {
  const metas = await pool(ASSETS, 16, (a) => yahooChart(a.yahoo).then((r) => r && r.meta));
  const rates = await fxRates(metas.filter(Boolean).map((m) => m.currency));
  const quotes = {};
  ASSETS.forEach((a, i) => {
    const m = metas[i];
    if (!m) return;
    const rate = rates[m.currency];
    if (!rate) return;
    const p = m.regularMarketPrice / rate;
    const prevRaw = a.cls === "krypto" ? null : m.chartPreviousClose ?? m.previousClose;
    const prev = prevRaw != null ? prevRaw / rate : null;
    quotes[a.id] = {
      p,
      chg: prev ? p / prev - 1 : null,
      open: a.cls === "krypto" ? true : marketOpen(m),
      t: (m.regularMarketTime || Date.now() / 1000) * 1000,
      tp: m.currentTradingPeriod?.regular ? [m.currentTradingPeriod.regular.start * 1000, m.currentTradingPeriod.regular.end * 1000] : null,
    };
  });

  // Krypto: 24h-Änderung und Lücken über CoinGecko
  const crypto = ASSETS.filter((a) => a.gecko);
  const g = await geckoQuotes(crypto.map((a) => a.gecko));
  for (const a of crypto) {
    const row = g[a.gecko];
    if (!row?.eur) continue;
    const q = quotes[a.id] || { open: true, t: Date.now() };
    if (!quotes[a.id]) q.p = row.eur;
    q.chg = row.eur_24h_change != null ? row.eur_24h_change / 100 : q.chg ?? null;
    quotes[a.id] = q;
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
    const missing = ASSETS.filter((a) => !quotes[a.id]);
    if (missing.length) {
      // Fehlende Werte mit dem letzten bekannten Kurs auffüllen
      const snap = await readJson("market/last.json").catch(() => null);
      for (const a of missing) if (snap?.data?.quotes?.[a.id]) quotes[a.id] = { ...snap.data.quotes[a.id], stale: true };
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

// Frischer Kurs für eine Order (max. 60 s alt)
export async function priceFor(id) {
  const a = BY_ID[id];
  if (!a) return null;
  const { quotes, at } = await getQuotes();
  const q = quotes[id];
  if (q && !q.stale && Date.now() - at < QUOTE_TTL) return q;
  const res = await yahooChart(a.yahoo);
  if (!res) return q || null;
  const rates = await fxRates([res.meta.currency]);
  const rate = rates[res.meta.currency];
  if (!rate) return q || null;
  return { p: res.meta.regularMarketPrice / rate, open: a.cls === "krypto" ? true : marketOpen(res.meta), t: Date.now() };
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
