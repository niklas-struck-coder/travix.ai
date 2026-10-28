/* Depot Duell – Oberfläche */
const CLS = {
  aktie: { n: "Aktien", one: "Aktie", c: "#2a46c9" },
  etf: { n: "ETFs", one: "ETF", c: "#0e8f86" },
  krypto: { n: "Krypto", one: "Krypto", c: "#c46a0c" },
  rohstoff: { n: "Rohstoffe", one: "Rohstoff", c: "#9a7b10" },
  anleihe: { n: "Anleihen", one: "Anleihe", c: "#7a4fb8" },
};
const LINE_COLORS = ["#2a46c9", "#d1373f", "#0e8f86", "#c46a0c", "#7a4fb8", "#0a7f53", "#b0397a", "#5b6276", "#9a7b10", "#2b8ac4"];
const DAY = 864e5;

/* ---------- Formatierung ---------- */
const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const N2 = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 });
function fmtPx(p) {
  if (p == null) return "–";
  if (p >= 1) return EUR.format(p);
  if (p >= 0.01) return p.toLocaleString("de-DE", { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + " €";
  return p.toLocaleString("de-DE", { maximumSignificantDigits: 4 }) + " €";
}
function fmtQty(q) {
  if (q >= 100) return N2.format(q);
  if (q >= 1) return q.toLocaleString("de-DE", { maximumFractionDigits: 4 });
  return q.toLocaleString("de-DE", { maximumSignificantDigits: 5 });
}
const fmtPct = (x) => (x == null ? "–" : (x >= 0 ? "+" : "−") + Math.abs(x * 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %");
const fmtSigned = (x) => (x >= 0 ? "+" : "−") + EUR.format(Math.abs(x));
const fmtTime = (ms) => new Date(ms).toLocaleString("de-DE", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
const fmtClock = (ms) => new Date(ms).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
const fmtDate = (ms) => new Date(ms).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric" });
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const ud = (x) => (x == null || x >= 0 ? "up" : "down");
const num = (s) => parseFloat(String(s).replace(/\./g, "").replace(",", "."));

/* ---------- Speicher im Browser ---------- */
function ls(k, v) {
  try {
    if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null");
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, JSON.stringify(v));
  } catch {
    return null;
  }
}
const sessions = () => ls("dd-sessions") || {};
function saveSession(code, s) {
  const all = sessions();
  all[code] = s;
  ls("dd-sessions", all);
}
function dropSession(code) {
  const all = sessions();
  delete all[code];
  ls("dd-sessions", all);
}

/* ---------- Zustand ---------- */
const S = {
  assets: [], by: {}, quotes: {}, quotesAt: 0,
  code: null, game: null, games: {},
  tab: "markt", filter: "alle", q: "", sort: "name",
  modal: null, startMode: null, quiz: {},
};

const params = new URLSearchParams(location.search);
const invited = (params.get("g") || "").toUpperCase();
S.code = invited && sessions()[invited] ? invited : ls("dd-active");
if (S.code && !sessions()[S.code]) S.code = null;
if (invited && !sessions()[invited]) S.startMode = "join";

const me = () => (S.code ? sessions()[S.code] : null);
const myPlayer = () => S.game?.players?.[me()?.pid];
const ended = (g) => g && Date.now() >= g.endAt;
const price = (id) => S.quotes[id]?.p;

/* ---------- API ---------- */
async function api(path, opts = {}) {
  const r = await fetch(path, {
    method: opts.body ? "POST" : "GET",
    headers: opts.body ? { "Content-Type": "application/json" } : {},
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let data = {};
  try {
    data = await r.json();
  } catch {
    data = {};
  }
  if (!r.ok) {
    const e = new Error(data.error || "Verbindung fehlgeschlagen. Bitte nochmal versuchen.");
    e.status = r.status;
    throw e;
  }
  return data;
}

async function loadQuotes() {
  try {
    const d = await api("/api/quotes");
    S.assets = d.assets;
    S.by = Object.fromEntries(d.assets.map((a) => [a.id, a]));
    S.quotes = d.quotes;
    S.quotesAt = d.at;
    render();
  } catch (e) {
    toast(e.message);
  }
}
async function loadGame(code = S.code) {
  if (!code) return;
  try {
    const g = await api(`/api/game?code=${encodeURIComponent(code)}`);
    S.games[code] = g;
    if (code === S.code) S.game = g;
    render();
  } catch (e) {
    if (e.status === 404) {
      dropSession(code);
      if (code === S.code) leaveView();
      toast("Dieses Spiel gibt es nicht mehr.");
    }
  }
}
function leaveView() {
  S.code = null;
  S.game = null;
  ls("dd-active", null);
  render();
}
function openGame(code) {
  S.code = code;
  S.game = S.games[code] || null;
  ls("dd-active", code);
  S.tab = "markt";
  history.replaceState(null, "", "/");
  render();
  loadGame(code);
}

function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.h);
  toast.h = setTimeout(() => (t.hidden = true), 3800);
}

/* ---------- Bewertung & Abzeichen ---------- */
function valueOf(p) {
  let v = p.cash;
  for (const [id, h] of Object.entries(p.holdings || {})) v += h.qty * (price(id) ?? h.cost / h.qty);
  return v;
}
function leaderboard(g = S.game) {
  if (!g) return [];
  return Object.entries(g.players)
    .map(([pid, p]) => {
      const v = valueOf(p);
      return { pid, p, v, perf: v / g.startCash - 1, me: pid === me()?.pid };
    })
    .sort((a, b) => b.v - a.v);
}
function badges(p, rank) {
  const out = [];
  const ids = Object.keys(p.holdings || {});
  const classes = new Set(ids.map((id) => S.by[id]?.cls).filter(Boolean));
  const val = valueOf(p);
  const cryptoVal = ids.filter((id) => S.by[id]?.cls === "krypto").reduce((t, id) => t + p.holdings[id].qty * (price(id) || 0), 0);
  if (rank === 0 && Object.keys(S.game.players).length > 1) out.push("Spitzenreiter");
  if (p.trades.length >= 1) out.push("Erster Trade");
  if (p.trades.length >= 25) out.push("Daytrader");
  if (classes.size >= 3) out.push("Streuer");
  if (ids.filter((id) => S.by[id]?.cls === "krypto").length >= 3) out.push("Krypto-Fan");
  if (val > 0 && cryptoVal / val > 0.7) out.push("Volles Risiko");
  if (ids.length >= 8) out.push("Sammler");
  return out;
}

/* ---------- Kopfbereich ---------- */
function renderHeader() {
  const codes = Object.keys(sessions());
  const gs = document.getElementById("groupsel");
  gs.innerHTML = S.code && codes.length
    ? `<label for="gpick" class="small muted">Spiel</label><select id="gpick">${codes.map((c) => `<option value="${c}" ${c === S.code ? "selected" : ""}>${esc(S.games[c]?.name || c)}</option>`).join("")}<option value="__new">+ Weiteres Spiel</option></select>`
    : "";
  const strip = document.getElementById("strip");
  const g = S.game, p = myPlayer();
  if (g && p && S.assets.length) {
    const v = valueOf(p), perf = v / g.startCash - 1;
    const lb = leaderboard(), rank = lb.findIndex((r) => r.me) + 1;
    const days = Math.max(0, Math.ceil((g.endAt - Date.now()) / DAY));
    strip.innerHTML = `<div class="tickerline">
      <div><span class="lbl">Dein Depotwert</span><span class="big">${EUR.format(v)}</span></div>
      <div><span class="lbl">Seit Start</span><span class="num ${ud(perf)}">${fmtPct(perf)} (${fmtSigned(v - g.startCash)})</span></div>
      <div><span class="lbl">Platz</span><span class="num">${rank} von ${lb.length}</span></div>
      <div><span class="lbl">Bargeld</span><span class="num">${EUR.format(p.cash)}</span></div>
      <div><span class="lbl">Spielende</span><span>${ended(g) ? "beendet" : `${fmtDate(g.endAt)} · noch ${days} ${days === 1 ? "Tag" : "Tage"}`}</span></div></div>`;
  } else strip.innerHTML = "";

  const tabs = S.code
    ? [["markt", "Markt"], ["depot", "Depot"], ["rangliste", "Rangliste"], ["spiel", "Einladen"], ["lernen", "Crashkurs"]]
    : [];
  document.getElementById("tabs").innerHTML = tabs.map(([id, l]) => `<button role="tab" data-tab="${id}" aria-selected="${S.tab === id}">${l}</button>`).join("");
  document.getElementById("tabs").hidden = !tabs.length;

  const b = [];
  if (g && ended(g)) {
    const w = leaderboard()[0];
    b.push(`<div class="banner">Das Spiel „${esc(g.name)}“ ist beendet. ${w ? `Gewonnen hat <b>${esc(w.p.name)}</b> mit ${EUR.format(w.v)} (${fmtPct(w.perf)}).` : ""}</div>`);
  }
  if (S.code && g && !p) b.push(`<div class="banner warn">Du bist in diesem Spiel nicht mehr angemeldet. <button class="btn" data-relogin="1">Neu anmelden</button></div>`);
  document.getElementById("banners").innerHTML = b.join("");
}

/* ---------- Startseite ---------- */
function viewStart() {
  const codes = Object.keys(sessions());
  const defEnd = new Date(Date.now() + 42 * DAY).toISOString().slice(0, 10);
  const mode = S.startMode;
  return `<section class="start">
    <h2 class="big">Wer macht aus Spielgeld am meisten?</h2>
    <p class="lead">Du und deine Freunde bekommt dasselbe Startguthaben und handelt mit echten Kursen: Aktien, ETFs, Krypto, Gold, Öl und Anleihen. Wer am Ende das größte Depot hat, gewinnt.</p>
    <div class="facts"><span>${S.assets.length || "90+"} Werte</span><span>echte Kurse</span><span>Gruppen mit Einladungslink</span><span>Rangliste mit Verlauf</span><span>kostenlos</span></div>
    <div style="display:flex;flex-wrap:wrap;gap:8px">
      <button class="btn primary" data-start="create">Neues Spiel erstellen</button>
      <button class="btn" data-start="join">Mit Code beitreten</button>
      <button class="btn" data-start="learn">Erst den Crashkurs</button>
    </div>
    ${codes.length ? `<div class="section"><h3>Deine Spiele</h3><div class="glist">${codes.map((c) => `<div class="gitem"><div class="info"><b>${esc(S.games[c]?.name || c)}</b><div class="small muted">Code ${c}</div></div><div class="acts"><button class="btn primary" data-opengame="${c}">Öffnen</button></div></div>`).join("")}</div></div>` : ""}
    ${mode === "create" ? `<form class="card formgrid" id="createform"><h3>Neues Spiel</h3>
      <div class="forms">
        <label>Name des Spiels<input type="text" id="c-name" maxlength="40" placeholder="z. B. Börsenhaie WG" required></label>
        <label>Startguthaben (€)<input type="number" id="c-cash" min="100" step="100" value="10000"></label>
        <label>Ordergebühr pro Kauf/Verkauf (€)<input type="number" id="c-fee" min="0" max="50" step="0.5" value="1"></label>
        <label>Spielende<input type="date" id="c-end" value="${defEnd}"></label>
      </div>
      <div class="presets">${[["2 Wochen", 14], ["4 Wochen", 28], ["6 Wochen (empfohlen)", 42], ["3 Monate", 91], ["Bis Silvester", "silvester"]].map(([l, d]) => `<button type="button" class="chip" data-preset="${d}">${l}</button>`).join("")}</div>
      <div class="forms">
        <label>Dein Spielername<input type="text" id="c-player" maxlength="24" required></label>
        <label>Deine PIN (4–8 Ziffern)<input type="password" inputmode="numeric" id="c-pin" maxlength="8" autocomplete="new-password" required></label>
      </div>
      <p class="small muted" style="margin:0">Mit Name und PIN meldest du dich auch auf einem anderen Gerät wieder an. Merk dir die PIN.</p>
      <div class="err" id="c-err"></div>
      <div><button class="btn primary" type="submit">Spiel erstellen</button></div></form>` : ""}
    ${mode === "join" ? `<form class="card formgrid" id="joinform"><h3>Spiel beitreten</h3>
      <div class="forms">
        <label>Spiel-Code<input type="text" id="j-code" maxlength="6" value="${esc(invited)}" placeholder="z. B. K7M2QX" style="text-transform:uppercase;font-family:var(--f-mono)" required></label>
        <label>Dein Spielername<input type="text" id="j-player" maxlength="24" required></label>
        <label>Deine PIN (4–8 Ziffern)<input type="password" inputmode="numeric" id="j-pin" maxlength="8" autocomplete="current-password" required></label>
      </div>
      <p class="small muted" style="margin:0">Schon dabei gewesen? Gleicher Name und gleiche PIN bringen dich zurück in dein Depot.</p>
      <div class="err" id="j-err"></div>
      <div><button class="btn primary" type="submit">Beitreten</button></div></form>` : ""}
  </section>
  ${mode === "learn" ? viewLernen() : ""}`;
}

/* ---------- Markt ---------- */
function viewMarkt() {
  if (!S.assets.length) return `<div class="card empty">Lade Kurse …</div>`;
  const q = S.q.trim().toLowerCase();
  let list = S.assets.filter((a) => S.quotes[a.id] && (S.filter === "alle" || a.cls === S.filter) && (!q || a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.sector.toLowerCase().includes(q)));
  const c = (a) => S.quotes[a.id]?.chg ?? 0;
  if (S.sort === "up") list.sort((a, b) => c(b) - c(a));
  else if (S.sort === "down") list.sort((a, b) => c(a) - c(b));
  else list.sort((a, b) => a.name.localeCompare(b.name, "de"));
  const chips = [["alle", "Alle"], ...Object.entries(CLS).map(([k, v]) => [k, v.n])].map(([id, l]) => `<button class="chip" data-filter="${id}" aria-pressed="${S.filter === id}">${l}</button>`).join("");
  const rows = list.map((a) => {
    const qq = S.quotes[a.id];
    return `<button class="row" data-asset="${a.id}"><span class="nm"><b><span class="cls">${CLS[a.cls].one}</span>${esc(a.name)}</b><span><i class="dot ${qq.open ? "" : "closed"}" title="${qq.open ? "Börse offen" : "Börse geschlossen"}"></i>${esc(a.sector)}</span></span><span class="px num">${fmtPx(qq.p)}</span><span class="pill ${ud(qq.chg)}">${fmtPct(qq.chg)}</span></button>`;
  }).join("");
  const all = S.assets.filter((a) => S.quotes[a.id]?.chg != null).sort((a, b) => c(b) - c(a));
  const mv = (a) => `<button class="row" style="grid-template-columns:minmax(0,1fr) auto;padding:7px 0" data-asset="${a.id}"><span class="nm"><b>${esc(a.name)}</b></span><span class="pill ${ud(c(a))}">${fmtPct(c(a))}</span></button>`;
  const feed = (S.game?.feed || []).slice(0, 6);
  return `<div class="grid2"><div>
    <div class="controls"><input type="text" id="q" placeholder="Suchen: Name, Kürzel oder Branche" value="${esc(S.q)}" aria-label="Suchen">
      <select id="sort" aria-label="Sortieren"><option value="name" ${S.sort === "name" ? "selected" : ""}>A–Z</option><option value="up" ${S.sort === "up" ? "selected" : ""}>Top-Gewinner heute</option><option value="down" ${S.sort === "down" ? "selected" : ""}>Top-Verlierer heute</option></select></div>
    <div class="chips" style="margin-bottom:12px">${chips}</div>
    <div class="list">${rows || `<div class="empty">Nichts gefunden für „${esc(S.q)}“.</div>`}</div>
    <p class="small muted">${list.length} Werte · Prozent = Veränderung heute (Krypto: 24 Stunden) · <i class="dot"></i>Börse offen <i class="dot closed" style="margin-left:8px"></i>geschlossen · Stand ${fmtClock(S.quotesAt)} Uhr</p>
  </div><aside class="side">
    <div class="card"><h3>Heute vorne & hinten</h3><div style="margin-top:6px">${all.slice(0, 4).map(mv).join("")}${all.slice(-4).reverse().map(mv).join("")}</div></div>
    ${feed.length ? `<div class="card"><h3>Was die anderen handeln</h3><div class="feed" style="margin-top:6px">${feed.map(feedRow).join("")}</div></div>` : ""}
  </aside></div>`;
}
function feedRow(f) {
  const who = S.game.players[f.pid]?.name || "Jemand";
  return `<div><span><b>${esc(who)}</b> ${f.side === "buy" ? "kauft" : "verkauft"} ${fmtQty(f.qty)} × ${esc(S.by[f.id]?.name || f.id)} <span class="muted">(${EUR.format(f.qty * f.p)})</span></span><time>${fmtTime(f.t)}</time></div>`;
}

/* ---------- Depot ---------- */
function viewDepot() {
  const g = S.game, p = myPlayer();
  if (!g || !p) return `<div class="card empty">Lade Depot …</div>`;
  const pos = Object.entries(p.holdings).map(([id, h]) => {
    const px = price(id) ?? h.cost / h.qty, v = h.qty * px;
    return { id, a: S.by[id] || { name: id, cls: "aktie" }, h, px, v, gl: v - h.cost, glp: h.cost ? v / h.cost - 1 : 0 };
  }).sort((x, y) => y.v - x.v);
  const inv = pos.reduce((t, x) => t + x.v, 0), total = p.cash + inv, perf = total / g.startCash - 1, open = pos.reduce((t, x) => t + x.gl, 0);
  const byCls = {};
  pos.forEach((x) => (byCls[x.a.cls] = (byCls[x.a.cls] || 0) + x.v));
  const alloc = Object.entries(byCls).map(([c, v]) => `<span style="width:${(v / total) * 100}%;background:${CLS[c].c}"></span>`).join("") + `<span style="width:${(p.cash / total) * 100}%;background:var(--line)"></span>`;
  const leg = Object.entries(byCls).map(([c, v]) => `<span><i style="background:${CLS[c].c}"></i>${CLS[c].n} ${((v / total) * 100).toFixed(0)} %</span>`).join("") + `<span><i style="background:var(--line)"></i>Bargeld ${((p.cash / total) * 100).toFixed(0)} %</span>`;
  const rows = pos.map((x) => `<tr data-asset="${x.id}"><td><b>${esc(x.a.name)}</b></td><td class="num">${fmtQty(x.h.qty)}</td><td class="num">${fmtPx(x.h.cost / x.h.qty)}</td><td class="num">${fmtPx(x.px)}</td><td class="num">${EUR.format(x.v)}</td><td class="num ${ud(x.gl)}">${fmtSigned(x.gl)}<br><span class="small">${fmtPct(x.glp)}</span></td></tr>`).join("");
  const tr = p.trades.slice(0, 50).map((t) => `<tr data-asset="${t.id}"><td>${fmtTime(t.t)}</td><td style="text-align:left">${t.side === "buy" ? `<span class="up">Kauf</span>` : `<span class="down">Verkauf</span>`}</td><td style="text-align:left">${esc(S.by[t.id]?.name || t.id)}</td><td class="num">${fmtQty(t.qty)}</td><td class="num">${fmtPx(t.p)}</td><td class="num">${EUR.format(t.qty * t.p)}</td></tr>`).join("");
  return `<div class="stats">
    <div class="stat"><span class="lbl">Gesamtwert</span><span class="v">${EUR.format(total)}</span></div>
    <div class="stat"><span class="lbl">Gewinn / Verlust</span><span class="v ${ud(perf)}">${fmtPct(perf)}</span><span class="small num ${ud(perf)}">${fmtSigned(total - g.startCash)}</span></div>
    <div class="stat"><span class="lbl">Investiert</span><span class="v">${EUR.format(inv)}</span><span class="small num ${ud(open)}">offen ${fmtSigned(open)}</span></div>
    <div class="stat"><span class="lbl">Bargeld</span><span class="v">${EUR.format(p.cash)}</span><span class="small muted">Start: ${EUR.format(g.startCash)}</span></div>
  </div>
  <div class="section"><div class="card"><h3>Aufteilung</h3><div class="alloc">${alloc}</div><div class="legend">${leg}</div></div></div>
  <div class="section"><h2>Deine Positionen</h2>${pos.length ? `<div class="tbl-wrap"><table><thead><tr><th>Wert</th><th>Stück</th><th>Ø Kaufkurs</th><th>Kurs</th><th>Wert</th><th>G/V</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="card empty">Noch nichts gekauft. <button class="btn" data-tab="markt">Zum Markt</button></div>`}</div>
  <div class="section"><h2>Deine Orders</h2>${tr ? `<div class="tbl-wrap"><table><thead><tr><th>Zeit</th><th style="text-align:left">Art</th><th style="text-align:left">Wert</th><th>Stück</th><th>Kurs</th><th>Betrag</th></tr></thead><tbody>${tr}</tbody></table></div>` : `<p class="muted">Noch keine Orders.</p>`}</div>`;
}

/* ---------- Rangliste ---------- */
function viewRang() {
  const g = S.game;
  if (!g) return `<div class="card empty">Lade …</div>`;
  const lb = leaderboard(), medal = ["🥇", "🥈", "🥉"];
  const colorOf = Object.fromEntries(Object.keys(g.players).map((pid, i) => [pid, LINE_COLORS[i % LINE_COLORS.length]]));
  return `<div class="section"><h2>${esc(g.name)}</h2><p class="muted" style="margin:0">Start mit ${EUR.format(g.startCash)} · Ordergebühr ${EUR.format(g.fee || 0)} · ${ended(g) ? "beendet am" : "endet am"} ${fmtDate(g.endAt)}</p></div>
  <div class="podium section">${lb.map((r, i) => `<div class="rank ${r.me ? "me" : ""}"><span class="pos">${medal[i] || i + 1}</span><span class="who"><b>${esc(r.p.name)}${r.me ? " (du)" : ""}</b><span class="small muted">${Object.keys(r.p.holdings).length} Positionen · ${r.p.trades.length} Orders</span><span class="badges">${badges(r.p, i).map((b) => `<span class="badge">${b}</span>`).join("")}</span></span><span class="val"><span class="num">${EUR.format(r.v)}</span><span class="num small ${ud(r.perf)}">${fmtPct(r.perf)}</span></span></div>`).join("")}</div>
  ${lb.length < 2 ? `<div class="card section"><b>Noch allein?</b> Lade deine Freunde ein: <button class="btn" data-tab="spiel">Einladungslink holen</button></div>` : ""}
  <div class="section card"><h3>Verlauf</h3><canvas id="histchart" height="220" style="height:220px"></canvas><div class="legend2">${lb.map((r) => `<span><i style="background:${colorOf[r.pid]}"></i>${esc(r.p.name)}</span>`).join("")}</div><p class="small muted" style="margin:4px 0 0">Ein Punkt pro Tag (Stand abends), dazu der Wert von jetzt.</p></div>
  <div class="section card"><h3>Letzte Orders aller Spieler</h3><div class="feed" style="margin-top:6px">${(g.feed || []).slice(0, 25).map(feedRow).join("") || `<p class="muted">Noch keine Orders.</p>`}</div></div>`;
}
function drawHistory() {
  const c = document.getElementById("histchart");
  if (!c || !S.game) return;
  const g = S.game, pids = Object.keys(g.players);
  const series = (g.history || []).map((h) => ({ t: new Date(h.d + "T21:00:00").getTime(), v: h.v }));
  const nowV = {};
  for (const pid of pids) nowV[pid] = valueOf(g.players[pid]);
  series.push({ t: Math.min(Date.now(), g.endAt), v: nowV });
  const dpr = devicePixelRatio || 1, W = c.clientWidth, H = 220;
  c.width = W * dpr; c.height = H * dpr;
  const x = c.getContext("2d");
  x.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement), col = (n) => cs.getPropertyValue(n).trim();
  const vals = series.flatMap((s) => Object.values(s.v)).concat(g.startCash);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.1 || g.startCash * 0.02;
  lo -= pad; hi += pad;
  const t0 = Math.min(g.createdAt, series[0].t), t1 = Math.max(series[series.length - 1].t, t0 + DAY);
  const L = 8, R = W - 78, T = 8, B = H - 22;
  const X = (t) => L + ((t - t0) / (t1 - t0)) * (R - L), Y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
  x.font = "11px " + col("--f-mono");
  x.fillStyle = col("--muted");
  x.strokeStyle = col("--line");
  x.lineWidth = 1;
  for (let j = 0; j <= 3; j++) {
    const v = lo + ((hi - lo) * j) / 3, yy = Y(v);
    x.beginPath(); x.moveTo(L, yy); x.lineTo(R, yy); x.stroke();
    x.fillText(Math.round(v).toLocaleString("de-DE") + " €", R + 6, yy + 4);
  }
  x.setLineDash([4, 4]);
  x.beginPath(); x.moveTo(L, Y(g.startCash)); x.lineTo(R, Y(g.startCash)); x.strokeStyle = col("--muted"); x.stroke();
  x.setLineDash([]);
  x.fillText(new Date(t0).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }), L, H - 5);
  x.fillText(new Date(t1).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" }), R - 36, H - 5);
  pids.forEach((pid, i) => {
    const pts = series.filter((s) => s.v[pid] != null).map((s) => [X(s.t), Y(s.v[pid])]);
    if (!pts.length) return;
    x.strokeStyle = LINE_COLORS[i % LINE_COLORS.length];
    x.lineWidth = pid === me()?.pid ? 2.6 : 1.6;
    x.beginPath();
    pts.forEach(([a, b], j) => (j ? x.lineTo(a, b) : x.moveTo(a, b)));
    x.stroke();
    const [ex, ey] = pts[pts.length - 1];
    x.beginPath(); x.arc(ex, ey, 3, 0, 7); x.fillStyle = LINE_COLORS[i % LINE_COLORS.length]; x.fill();
  });
}

/* ---------- Einladen ---------- */
function viewSpiel() {
  const g = S.game;
  if (!g) return `<div class="card empty">Lade …</div>`;
  const link = `${location.origin}/?g=${g.code}`;
  return `<div class="section card"><h2>Freunde einladen</h2>
    <p style="margin:0">Schick diesen Link in eure Gruppe. Jeder wählt einen Namen und eine PIN und bekommt ${EUR.format(g.startCash)} Startguthaben.</p>
    <div class="invite"><code>${g.code}</code><input type="text" id="invitelink" readonly value="${esc(link)}" aria-label="Einladungslink"><button class="btn primary" data-copy="1">Link kopieren</button>${navigator.share ? `<button class="btn" data-share="1">Teilen</button>` : ""}</div>
  </div>
  <div class="section card"><h3>Regeln dieses Spiels</h3><ul style="margin:0;padding-left:20px">
    <li>Startguthaben: ${EUR.format(g.startCash)}</li><li>Ordergebühr: ${EUR.format(g.fee || 0)} pro Kauf oder Verkauf</li>
    <li>Spielende: ${fmtDate(g.endAt)}, ${fmtClock(g.endAt)} Uhr</li><li>Spieler: ${Object.keys(g.players).length}</li></ul></div>
  <div class="section"><div style="display:flex;flex-wrap:wrap;gap:8px"><button class="btn" data-logout="1">Auf diesem Gerät abmelden</button></div>
  <p class="small muted">Abmelden löscht nur die Anmeldung auf diesem Gerät. Mit deinem Namen und deiner PIN kommst du jederzeit zurück.</p></div>`;
}

/* ---------- Crashkurs ---------- */
const LESSONS = [
  ["Was ist die Börse?", `<p>Die Börse ist ein Marktplatz für Anteile an Firmen und andere Wertpapiere. Aus Angebot und Nachfrage entsteht der <b>Kurs</b>, also der aktuelle Preis.</p><p>Wollen viele kaufen, steigt der Kurs. Wollen viele verkaufen, fällt er. Quartalszahlen, Zinsentscheidungen, Kriege oder ein Tweet können die Stimmung drehen.</p>`],
  ["Aktien", `<p>Eine <b>Aktie</b> ist ein kleiner Anteil an einem Unternehmen. Läuft die Firma gut, steigt meist der Kurs, und viele Firmen zahlen zusätzlich eine <b>Dividende</b>. Läuft es schlecht, kann der Kurs stark fallen.</p><div class="ex">Beispiel: Du kaufst 10 SAP-Aktien zu je 240 €. Steigt der Kurs auf 264 €, sind sie 2.640 € wert: 240 € Gewinn (+10 %).</div><p>Im Spiel: US-Tech (Apple, Nvidia, Tesla …), DAX-Firmen (SAP, Siemens, Rheinmetall …) und große Namen aus Europa und Asien.</p>`],
  ["ETFs", `<p>Ein <b>ETF</b> ist ein Korb aus vielen Aktien auf einmal. Ein MSCI-World-ETF enthält rund 1.400 Firmen aus 23 Ländern.</p><ul><li>Vorteil: automatisch gestreut, ruhigere Kurse.</li><li>Nachteil: riesige Sprünge sind selten.</li><li><b>Themen-ETFs</b> (Halbleiter, Rüstung, Clean Energy) schwanken deutlich stärker.</li></ul>`],
  ["Kryptowährungen", `<p><b>Krypto</b> sind digitale Währungen auf einer Blockchain: Bitcoin, Ethereum, Solana und viele mehr, bis hin zu <b>Meme-Coins</b> wie Dogecoin oder Pepe.</p><ul><li>10 % an einem Tag sind normal, bei Meme-Coins auch viel mehr.</li><li>Dahinter steht keine Firma mit Gewinnen, der Preis hängt an Nachfrage und Stimmung.</li><li>Krypto wird rund um die Uhr gehandelt, auch am Wochenende.</li></ul>`],
  ["Rohstoffe", `<p>Gold, Silber, Öl und Kupfer handelst du hier zum Weltmarktpreis, umgerechnet in Euro (Gold und Silber pro Unze, Öl pro Barrel).</p><p><b>Gold</b> gilt als „sicherer Hafen“: In Krisen steigt es oft, während Aktien fallen. Öl und Kupfer hängen an der Weltwirtschaft.</p>`],
  ["Anleihen", `<p>Eine <b>Anleihe</b> ist ein Kredit an einen Staat oder eine Firma, für den du Zinsen bekommst. Anleihen-ETFs schwanken sehr wenig. Im Spiel sind sie der Parkplatz für Geld, das wenig riskieren soll.</p>`],
  ["Handelszeiten", `<p>Die Kurse sind <b>echt</b>. Deshalb gelten auch echte Handelszeiten:</p><ul><li>Deutsche Aktien und ETFs: werktags ca. 9:00–17:30 Uhr</li><li>US-Aktien: werktags ca. 15:30–22:00 Uhr (deutsche Zeit)</li><li>Rohstoffe: fast rund um die Uhr an Werktagen</li><li>Krypto: immer</li></ul><p>Ist eine Börse zu, zeigt der Markt einen grauen Punkt und du kannst den Wert erst wieder handeln, wenn sie öffnet. Für die Rangliste zählt immer der letzte Kurs.</p>`],
  ["Kaufen und verkaufen", `<ul><li>Wähle einen Wert, gib einen Betrag in Euro oder eine Stückzahl ein und bestätige. Bezahlt wird mit deinem Bargeld zum aktuellen Kurs.</li><li><b>Bruchstücke</b> gehen: 0,5 Aktien oder 0,001 Bitcoin.</li><li><b>Ordergebühr:</b> Jede Order kostet die Gebühr deiner Gruppe. Wildes Hin-und-her kostet also.</li><li><b>Ø Kaufkurs:</b> Kaufst du nach, rechnet das Depot deinen Durchschnittspreis.</li><li><b>Offener Gewinn</b> steht nur auf dem Papier, zählt aber für die Rangliste genauso.</li></ul>`],
  ["Risiko und Streuung", `<p>Mehr mögliche Rendite heißt mehr Risiko. Anleihen schwanken kaum, große Aktien mittel, Krypto extrem.</p><ul><li><b>Alles auf eine Karte</b> kann dich ganz nach oben bringen oder ganz nach unten.</li><li><b>Streuen</b> über viele Werte macht dein Depot ruhiger.</li><li>Im Spiel mit Freunden gewinnt oft, wer mutig ist und trotzdem nicht alles auf einen Meme-Coin setzt.</li></ul>`],
];
const QUIZ = [
  ["Was kaufst du mit einer Aktie?", ["Einen Kredit an die Firma", "Einen Anteil an der Firma", "Ein Produkt der Firma"], 1],
  ["Was ist ein ETF?", ["Ein Korb aus vielen Wertpapieren", "Eine Kryptowährung", "Eine Bankgebühr"], 0],
  ["Was schwankt am stärksten?", ["Anleihen", "MSCI World", "Meme-Coins"], 2],
  ["Wann kannst du US-Aktien handeln?", ["Rund um die Uhr", "Werktags ca. 15:30–22:00 Uhr", "Nur am Wochenende"], 1],
  ["Wer gewinnt das Spiel?", ["Wer am meisten Orders macht", "Wer am Ende den höchsten Depotwert hat", "Wer am meisten Bargeld hat"], 1],
];
function viewLernen() {
  const done = Object.keys(S.quiz).length, right = QUIZ.filter((q, i) => S.quiz[i] === q[2]).length;
  return `<div class="hero"><span class="small muted" style="text-transform:uppercase;letter-spacing:.08em">Crashkurs · 5 Minuten</span><h2>Börse in 9 Kapiteln</h2>
  <p>Was Aktien, ETFs, Krypto, Rohstoffe und Anleihen sind, wann gehandelt wird und wie du gewinnst. Zum Schluss ein kurzes Quiz.</p></div>
  <div class="learn">${LESSONS.map(([t, b], i) => `<details ${i === 0 ? "open" : ""}><summary><span class="k">${i + 1}</span>${t}</summary><div class="body">${b}</div></details>`).join("")}
  <div class="card quiz"><h3>Quiz</h3>${QUIZ.map(([q, opts, ok], i) => `<div class="q"><b>${i + 1}. ${q}</b><div class="opts">${opts.map((o, j) => `<button data-quiz="${i}:${j}" class="${S.quiz[i] === j ? (j === ok ? "right" : "wrong") : S.quiz[i] != null && j === ok ? "right" : ""}">${o}</button>`).join("")}</div></div>`).join("")}
  ${done === QUIZ.length ? `<p style="margin:0"><b>${right} von ${QUIZ.length} richtig.</b> ${right === QUIZ.length ? "Du bist bereit für die Börse." : "Schau dir die Kapitel nochmal an."}</p>` : ""}</div></div>`;
}

/* ---------- Rendern ---------- */
function render() {
  renderHeader();
  const ae = document.activeElement, fid = ae && ae.id, sel = fid && ae.selectionStart != null ? [ae.selectionStart, ae.selectionEnd] : null;
  const keep = {};
  document.querySelectorAll("#view input, #view select").forEach((i) => i.id && i.type !== "password" && (keep[i.id] = i.value));
  const pins = {};
  document.querySelectorAll("#view input[type=password]").forEach((i) => (pins[i.id] = i.value));
  let html;
  if (!S.code) html = viewStart();
  else html = ({ markt: viewMarkt, depot: viewDepot, rangliste: viewRang, spiel: viewSpiel, lernen: viewLernen }[S.tab] || viewMarkt)();
  document.getElementById("view").innerHTML = html;
  for (const [id, val] of Object.entries({ ...keep, ...pins })) {
    const el = document.getElementById(id);
    if (el && id !== "q" && id !== "sort") el.value = val;
  }
  if (fid) {
    const el = document.getElementById(fid);
    if (el && el.closest("#view")) {
      el.focus();
      if (sel) try { el.setSelectionRange(...sel); } catch { /* nicht jedes Feld kann das */ }
    }
  }
  if (S.tab === "rangliste") drawHistory();
  updateModalLive();
}

/* ---------- Handels-Fenster ---------- */
const RANGES = [["1d", "1T"], ["5d", "1W"], ["1mo", "1M"], ["6mo", "6M"], ["1y", "1J"], ["5y", "5J"]];
function openAsset(id) {
  S.modal = { id, range: "1mo", side: "buy", unit: "eur", amount: "", busy: false, chart: null };
  renderModal();
  loadChart();
}
function closeModal() {
  S.modal = null;
  document.getElementById("modal").innerHTML = "";
}
async function loadChart() {
  const m = S.modal;
  if (!m) return;
  const key = m.id + m.range;
  m.chart = "loading";
  drawChart();
  try {
    const d = await api(`/api/chart?id=${m.id}&range=${m.range}`);
    if (S.modal && S.modal.id + S.modal.range === key) {
      S.modal.chart = d.points;
      drawChart();
    }
  } catch {
    if (S.modal && S.modal.id + S.modal.range === key) {
      S.modal.chart = "error";
      drawChart();
    }
  }
}
function renderModal() {
  const m = S.modal, el = document.getElementById("modal");
  if (!m) { el.innerHTML = ""; return; }
  const a = S.by[m.id], q = S.quotes[m.id] || {}, g = S.game, p = myPlayer(), h = p?.holdings?.[m.id];
  const canTrade = p && !ended(g) && q.open;
  el.innerHTML = `<div class="ov" id="ov"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="mtitle">
    <div class="mhead"><div><span class="cls">${CLS[a.cls].one}</span><span class="small muted">${esc(a.sector)}</span><h2 id="mtitle" style="margin-top:4px">${esc(a.name)}</h2>
      <div><span class="px" id="mpx"></span> <span id="mchg"></span></div>
      <div class="small muted"><i class="dot ${q.open ? "" : "closed"}"></i>${q.open ? "Börse offen" : "Börse gerade geschlossen"}${q.tp && !q.open && a.cls !== "krypto" ? ` · Handelszeit heute ${fmtClock(q.tp[0])}–${fmtClock(q.tp[1])} Uhr` : ""}</div></div>
      <button class="btn" id="mclose" aria-label="Schließen">✕</button></div>
    <div class="ranges">${RANGES.map(([r, l]) => `<button data-range="${r}" aria-pressed="${m.range === r}">${l}</button>`).join("")}</div>
    <canvas id="chart" height="200"></canvas>
    ${p ? `<div class="trade">
      <div class="rowf" style="justify-content:space-between;align-items:center"><div class="seg"><button data-side="buy" aria-pressed="${m.side === "buy"}">Kaufen</button><button data-side="sell" aria-pressed="${m.side === "sell"}">Verkaufen</button></div>
      <div class="seg"><button data-unit="eur" aria-pressed="${m.unit === "eur"}">in €</button><button data-unit="qty" aria-pressed="${m.unit === "qty"}">in Stück</button></div></div>
      <div class="small">Bargeld: <b class="num">${EUR.format(p.cash)}</b> · Im Depot: <b class="num">${h ? fmtQty(h.qty) : "0"}</b> Stück${h ? ` (${EUR.format(h.qty * (q.p || 0))}, Ø ${fmtPx(h.cost / h.qty)})` : ""}</div>
      <div class="rowf"><label>${m.unit === "eur" ? "Betrag in €" : "Stückzahl"}<input type="text" inputmode="decimal" id="amt" value="${esc(m.amount)}" placeholder="0"></label></div>
      <div class="quick">${[["25 %", 0.25], ["50 %", 0.5], ["Alles", 1]].map(([l, f]) => `<button data-frac="${f}">${l}</button>`).join("")}</div>
      <div class="small" id="msum"></div>
      <button class="btn primary" id="mgo" ${canTrade && !m.busy ? "" : "disabled"}>${m.busy ? "Wird ausgeführt …" : m.side === "buy" ? "Kaufen" : "Verkaufen"}</button>
      ${!canTrade ? `<span class="small muted">${ended(g) ? "Spiel beendet, Handel geschlossen." : !q.open ? "Handel möglich, sobald die Börse öffnet." : ""}</span>` : ""}
    </div>` : `<div class="trade"><span>Zum Handeln tritt einem Spiel bei.</span></div>`}
  </div></div>`;
  drawChart();
  updateModalLive();
}
function orderInfo() {
  const m = S.modal, v = num(m.amount), q = S.quotes[m.id], fee = S.game?.fee || 0;
  if (!(v > 0) || !q) return null;
  if (m.all) {
    const p = myPlayer();
    const qty = m.side === "sell" ? p.holdings[m.id]?.qty || 0 : Math.max(0, (p.cash - fee) / q.p);
    return { qty, all: true };
  }
  if (m.unit === "qty") return { qty: v };
  return { qty: m.side === "buy" ? Math.max(0, (v - fee) / q.p) : v / q.p, eur: v };
}
function updateModalLive() {
  const m = S.modal;
  if (!m) return;
  const q = S.quotes[m.id] || {};
  const mp = document.getElementById("mpx");
  if (mp) mp.textContent = fmtPx(q.p);
  const mc = document.getElementById("mchg");
  if (mc) { mc.className = "pill " + ud(q.chg); mc.textContent = fmtPct(q.chg) + (S.by[m.id]?.cls === "krypto" ? " 24 h" : " heute"); }
  const s = document.getElementById("msum");
  if (!s) return;
  const o = orderInfo(), fee = S.game?.fee || 0;
  s.innerHTML = o && o.qty > 0
    ? `ca. ${fmtQty(o.qty)} Stück × ${fmtPx(q.p)} = <b class="num">${EUR.format(o.qty * q.p)}</b> ${m.side === "buy" ? "+" : "−"} Gebühr ${EUR.format(fee)} → ${m.side === "buy" ? "Kosten" : "Erlös"} <b class="num">${EUR.format(m.side === "buy" ? o.qty * q.p + fee : o.qty * q.p - fee)}</b>`
    : `<span class="muted">Gib ein, wie viel du ${m.side === "buy" ? "kaufen" : "verkaufen"} willst.</span>`;
}
function drawChart() {
  const c = document.getElementById("chart");
  if (!c || !S.modal) return;
  const dpr = devicePixelRatio || 1, W = c.clientWidth, H = 200;
  c.width = W * dpr; c.height = H * dpr;
  const x = c.getContext("2d");
  x.scale(dpr, dpr);
  const cs = getComputedStyle(document.documentElement), col = (n) => cs.getPropertyValue(n).trim();
  x.font = "12px " + col("--f-body");
  x.fillStyle = col("--muted");
  const pts = S.modal.chart;
  if (!Array.isArray(pts) || pts.length < 2) {
    x.fillText(pts === "error" || Array.isArray(pts) ? "Für diesen Zeitraum gibt es keinen Chart." : "Lade Chart …", 8, H / 2);
    return;
  }
  const t0 = pts[0][0], t1 = pts[pts.length - 1][0];
  const up = pts[pts.length - 1][1] >= pts[0][1], line = col(up ? "--gain" : "--loss");
  const vs = pts.map((p) => p[1]);
  const lo0 = Math.min(...vs), hi0 = Math.max(...vs), pad = (hi0 - lo0) * 0.08 || hi0 * 0.01, lo = lo0 - pad, hi = hi0 + pad;
  const L = 8, R = W - 72, T = 8, B = H - 22;
  const X = (t) => L + ((t - t0) / (t1 - t0 || 1)) * (R - L), Y = (v) => B - ((v - lo) / (hi - lo)) * (B - T);
  x.font = "11px " + col("--f-mono");
  x.strokeStyle = col("--line");
  x.lineWidth = 1;
  for (let j = 0; j <= 3; j++) {
    const v = lo + ((hi - lo) * j) / 3, yy = Y(v);
    x.beginPath(); x.moveTo(L, yy); x.lineTo(R, yy); x.stroke();
    x.fillText(v >= 1000 ? Math.round(v).toLocaleString("de-DE") : fmtPx(v).replace(" €", ""), R + 6, yy + 4);
  }
  const short = S.modal.range === "1d";
  for (let j = 0; j <= 3; j++) {
    const t = t0 + ((t1 - t0) * j) / 3, d = new Date(t);
    const lbl = short ? fmtClock(t) : S.modal.range === "5y" ? d.getFullYear() : d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
    x.fillText(lbl, Math.min(X(t), R - 36), H - 5);
  }
  x.beginPath();
  pts.forEach(([t, v], j) => (j ? x.lineTo(X(t), Y(v)) : x.moveTo(X(t), Y(v))));
  x.strokeStyle = line; x.lineWidth = 1.8; x.stroke();
  x.lineTo(X(t1), B); x.lineTo(X(t0), B); x.closePath();
  x.globalAlpha = 0.12; x.fillStyle = line; x.fill(); x.globalAlpha = 1;
  x.beginPath(); x.arc(X(t1), Y(pts[pts.length - 1][1]), 3.5, 0, 7); x.fillStyle = line; x.fill();
}

async function submitTrade() {
  const m = S.modal, o = orderInfo(), s = me();
  if (!o || !(o.qty > 0)) return toast("Gib eine Menge größer 0 ein.");
  m.busy = true;
  renderModal();
  try {
    const body = { code: S.code, pid: s.pid, token: s.token, id: m.id, side: m.side };
    if (o.all) body.all = true;
    else if (o.eur != null) body.eur = o.eur;
    else body.qty = o.qty;
    const d = await api("/api/trade", { body });
    S.game = d.game;
    S.games[S.code] = d.game;
    toast(`${m.side === "buy" ? "Gekauft" : "Verkauft"}: ${fmtQty(d.trade.qty)} × ${S.by[m.id].name} zu ${fmtPx(d.trade.p)}`);
    if (S.modal) { S.modal.amount = ""; S.modal.all = false; }
  } catch (e) {
    toast(e.message);
    if (e.status === 401) { dropSession(S.code); render(); }
  }
  if (S.modal) { S.modal.busy = false; renderModal(); }
  render();
}

/* ---------- Spiel erstellen / beitreten ---------- */
async function createGame() {
  const v = (id) => document.getElementById(id).value;
  const err = document.getElementById("c-err");
  err.textContent = "";
  const end = new Date(v("c-end") + "T22:00:00").getTime();
  try {
    const d = await api("/api/game", { body: { action: "create", name: v("c-name"), startCash: num(v("c-cash")), fee: num(v("c-fee") || "0"), endAt: end, playerName: v("c-player"), pin: v("c-pin") } });
    saveSession(d.game.code, { pid: d.pid, token: d.token });
    S.games[d.game.code] = d.game;
    openGame(d.game.code);
    S.tab = "spiel";
    render();
    toast("Spiel erstellt. Jetzt Freunde einladen!");
  } catch (e) {
    err.textContent = e.message;
  }
}
async function joinGame() {
  const v = (id) => document.getElementById(id).value;
  const err = document.getElementById("j-err");
  err.textContent = "";
  const code = v("j-code").trim().toUpperCase();
  try {
    const d = await api("/api/game", { body: { action: "join", code, playerName: v("j-player"), pin: v("j-pin") } });
    saveSession(code, { pid: d.pid, token: d.token });
    S.games[code] = d.game;
    openGame(code);
    toast(`Willkommen bei „${d.game.name}“!`);
  } catch (e) {
    err.textContent = e.message;
  }
}

/* ---------- Ereignisse ---------- */
document.addEventListener("click", (e) => {
  if (e.target.id === "ov") return closeModal();
  if (e.target.closest("#home")) {
    e.preventDefault();
    S.startMode = null;
    leaveView();
    return;
  }
  const t = e.target.closest("button,[data-asset]");
  if (!t) return;
  const d = t.dataset;
  if (d.tab) { S.tab = d.tab; closeModal(); render(); scrollTo(0, 0); return; }
  if (d.asset && !t.closest("#modal")) return openAsset(d.asset);
  if (d.filter) { S.filter = d.filter; render(); return; }
  if (d.start) { S.startMode = d.start; render(); document.querySelector("#createform,#joinform,.hero")?.scrollIntoView({ behavior: "smooth" }); return; }
  if (d.opengame) return openGame(d.opengame);
  if (d.preset) {
    const end = d.preset === "silvester" ? new Date(new Date().getFullYear(), 11, 31) : new Date(Date.now() + Number(d.preset) * DAY);
    if (d.preset === "silvester" && end - Date.now() < 7 * DAY) end.setFullYear(end.getFullYear() + 1);
    document.getElementById("c-end").value = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
    return;
  }
  if (d.quiz) { const [i, j] = d.quiz.split(":").map(Number); if (S.quiz[i] == null) { S.quiz[i] = j; render(); } return; }
  if (d.copy) {
    const inp = document.getElementById("invitelink");
    navigator.clipboard?.writeText(inp.value).then(() => toast("Link kopiert."), () => { inp.select(); toast("Link markiert, jetzt kopieren."); });
    return;
  }
  if (d.share) { navigator.share({ title: "Depot Duell", text: `Spiel mit bei „${S.game.name}“!`, url: document.getElementById("invitelink").value }).catch(() => {}); return; }
  if (d.logout) { dropSession(S.code); S.startMode = null; leaveView(); toast("Auf diesem Gerät abgemeldet."); return; }
  if (d.relogin) { const c = S.code; dropSession(c); leaveView(); S.startMode = "join"; history.replaceState(null, "", `/?g=${c}`); location.reload(); return; }
  if (t.id === "mclose") return closeModal();
  if (d.range) { S.modal.range = d.range; renderModal(); loadChart(); return; }
  if (d.side) { S.modal.side = d.side; S.modal.amount = ""; S.modal.all = false; renderModal(); return; }
  if (d.unit) { S.modal.unit = d.unit; S.modal.amount = ""; S.modal.all = false; renderModal(); return; }
  if (d.frac) {
    const m = S.modal, p = myPlayer(), q = S.quotes[m.id], f = Number(d.frac), fee = S.game.fee || 0;
    if (!p || !q) return;
    let v;
    if (m.side === "buy") { const eur = f === 1 ? p.cash : p.cash * f; v = m.unit === "eur" ? eur : Math.max(0, (eur - fee) / q.p); }
    else { const qty = (p.holdings[m.id]?.qty || 0) * f; v = m.unit === "eur" ? qty * q.p : qty; }
    m.all = f === 1;
    m.amount = (m.unit === "eur" ? Math.floor(v * 100) / 100 : Math.floor(v * 1e8) / 1e8).toLocaleString("de-DE", { maximumFractionDigits: 8, useGrouping: false });
    document.getElementById("amt").value = m.amount;
    updateModalLive();
    return;
  }
  if (t.id === "mgo") return submitTrade();
});
document.addEventListener("input", (e) => {
  if (e.target.id === "q") { S.q = e.target.value; render(); }
  if (e.target.id === "amt") { S.modal.amount = e.target.value; S.modal.all = false; updateModalLive(); }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "sort") { S.sort = e.target.value; render(); }
  if (e.target.id === "gpick") {
    if (e.target.value === "__new") { S.startMode = "create"; leaveView(); }
    else openGame(e.target.value);
  }
});
document.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "createform") createGame();
  if (e.target.id === "joinform") joinGame();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && S.modal) closeModal(); });
addEventListener("resize", () => { if (S.modal) drawChart(); if (S.tab === "rangliste") drawHistory(); });

/* ---------- Start ---------- */
render();
loadQuotes();
for (const c of Object.keys(sessions())) loadGame(c);
setInterval(() => { if (!document.hidden) loadQuotes(); }, 60_000);
setInterval(() => { if (!document.hidden && S.code) loadGame(); }, 30_000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) { loadQuotes(); if (S.code) loadGame(); } });
