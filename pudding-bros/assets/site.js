/* PUDDING BROS. — shared data, brand graphics, layout, cart & motion.
   No dependencies. Every page includes this file once (defer). */

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const PRODUCTS = [
  {
    id: 'vanilla-marshmallow',
    title: 'Vanilla Marshmallow',
    lines: ['VANILLA', 'MARSHMALLOW'],
    short: 'Cremige Vanille + Marshmallow',
    claim: 'Cremiger Vanillepudding mit einer besonderen Marshmallow-Note.',
    badge: 'BESTSELLER',
    loaded: 'MARSHMALLOWS',
    accent: '#F6C945', dark: '#D8A51E', soft: '#FFF1C4', pudding: '#F8DE96', ink: '#0E0E0E',
    topping: 'marshmallow', pieceColors: ['#FFFFFF', '#FFF6E0'],
    price: 2.99, rating: 4.9, reviews: 128,
    description: [
      'Unser Original. Echte Bourbon-Vanille, extra cremig aufgekocht – und dann kommt der Loaded-Beutel: weiche Mini-Marshmallows, die oben drauf langsam schmelzen.',
      'Funktioniert warm direkt aus dem Topf, kalt aus dem Kühlschrank und ehrlich gesagt auch um 23 Uhr im Stehen.',
    ],
    ingredients: 'Puddingpulver: Zucker, modifizierte Maisstärke, Süßmolkenpulver, Bourbon-Vanilleextrakt (0,5 %), Salz, Farbstoff: Carotin. Loaded-Beutel: Mini-Marshmallows (Zucker, Glukosesirup, Wasser, Gelatine (Rind), Maisstärke, Aroma).',
    allergens: ['Milch (Süßmolkenpulver)'],
    traces: 'Kann Spuren von Gluten, Soja und Schalenfrüchten enthalten.',
    nutrition: { kj: 548, kcal: 130, fat: 3.5, sat: 2.2, carbs: 20.6, sugar: 15.4, protein: 3.6, salt: 0.14 },
  },
  {
    id: 'chocolate-cookie',
    title: 'Chocolate Cookie',
    lines: ['CHOCOLATE', 'COOKIE'],
    short: 'Schokolade + Cookie-Stückchen',
    claim: 'Dunkler Schokoladenpudding mit knusprigen Cookie-Stückchen.',
    badge: null,
    loaded: 'COOKIE CHUNKS',
    accent: '#5B3A29', dark: '#3D2518', soft: '#EBDCCD', pudding: '#6E4431', ink: '#FFF8EC',
    topping: 'cookie', pieceColors: ['#A9703F', '#8A5A33'],
    price: 2.99, rating: 4.8, reviews: 96,
    description: [
      'Für alle, die Schokolade ernst nehmen: kräftiger Kakao, samtige Textur, dazu grobe Cookie-Chunks, die auch nach dem Unterheben noch knacken.',
      'Tipp der Bros.: Eine Hälfte vom Topping direkt rein, die andere Hälfte erst kurz vorm Essen drüber.',
    ],
    ingredients: 'Puddingpulver: Zucker, modifizierte Maisstärke, fettarmer Kakao (14 %), Süßmolkenpulver, Salz, Aroma. Loaded-Beutel: Cookie-Stückchen (Weizenmehl, Zucker, Palmfett, Schokolade (Zucker, Kakaomasse, Kakaobutter, Emulgator: Sojalecithine), Backtriebmittel: Natriumcarbonate, Salz).',
    allergens: ['Gluten (Weizen)', 'Milch (Süßmolkenpulver)', 'Soja'],
    traces: 'Kann Spuren von Ei und Schalenfrüchten enthalten.',
    nutrition: { kj: 590, kcal: 140, fat: 4.4, sat: 2.6, carbs: 21.0, sugar: 15.2, protein: 3.9, salt: 0.18 },
  },
  {
    id: 'vanilla-coconut',
    title: 'Vanilla Coconut',
    lines: ['VANILLA', 'COCONUT'],
    short: 'Vanille + Kokos',
    claim: 'Heller Vanillepudding mit gerösteten Kokos-Chips.',
    badge: null,
    loaded: 'COCO CHIPS',
    accent: '#8EDBD2', dark: '#5DBDB2', soft: '#DFF6F3', pudding: '#FAEFD2', ink: '#0E0E0E',
    topping: 'coconut', pieceColors: ['#FFFFFF', '#F3E6CC'],
    price: 2.99, rating: 4.8, reviews: 74,
    description: [
      'Urlaub, aber im Topf. Milde Vanille trifft auf leicht geröstete Kokos-Chips – frisch, leicht und überraschend erwachsen.',
      'Schmeckt besonders gut kalt, mit ein paar frischen Mangowürfeln oder einfach pur.',
    ],
    ingredients: 'Puddingpulver: Zucker, modifizierte Maisstärke, Süßmolkenpulver, Kokosmilchpulver (6 %) (Kokosnuss, Maltodextrin, Milcheiweiß), Vanilleextrakt, Salz, Farbstoff: Carotin. Loaded-Beutel: geröstete Kokos-Chips (Kokosnuss, Zucker).',
    allergens: ['Milch (Süßmolkenpulver, Milcheiweiß)'],
    traces: 'Kann Spuren von Gluten, Soja und Schalenfrüchten enthalten.',
    nutrition: { kj: 573, kcal: 137, fat: 4.6, sat: 3.4, carbs: 19.8, sugar: 14.9, protein: 3.5, salt: 0.13 },
  },
  {
    id: 'strawberry-marshmallow',
    title: 'Strawberry Marshmallow',
    lines: ['STRAWBERRY', 'MARSHMALLOW'],
    short: 'Erdbeere + Marshmallow',
    claim: 'Fruchtiger Erdbeerpudding mit pinken & weißen Marshmallows.',
    badge: 'NEU',
    loaded: 'MARSHMALLOWS',
    accent: '#EC3B5C', dark: '#C21F41', soft: '#FFDCE3', pudding: '#F5A3B3', ink: '#FFF8EC',
    topping: 'marshmallow', pieceColors: ['#FFFFFF', '#FFC2CF'],
    price: 3.29, rating: 4.7, reviews: 41,
    description: [
      'Der Neue im Team. Fruchtige Erdbeere mit echtem Erdbeerpulver, dazu pinke und weiße Marshmallows. Laut, pink, aber nicht kitschig.',
      'Am besten gut gekühlt – und wenn du willst, mit frischen Erdbeeren obendrauf.',
    ],
    ingredients: 'Puddingpulver: Zucker, modifizierte Maisstärke, Süßmolkenpulver, Erdbeerpulver (4 %), Säuerungsmittel: Citronensäure, Aroma, Salz, Farbstoff: Rote-Bete-Saft-Konzentrat. Loaded-Beutel: Mini-Marshmallows (Zucker, Glukosesirup, Wasser, Gelatine (Rind), Maisstärke, Aroma, färbendes Lebensmittel: Rote-Bete-Konzentrat).',
    allergens: ['Milch (Süßmolkenpulver)'],
    traces: 'Kann Spuren von Gluten, Soja und Schalenfrüchten enthalten.',
    nutrition: { kj: 556, kcal: 132, fat: 3.4, sat: 2.2, carbs: 21.3, sugar: 16.1, protein: 3.5, salt: 0.12 },
  },
];

const BOX = { id: 'bros-box', title: 'Bros Box', price: 10.99 };

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const euro = (n) => n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

/* ------------------------------------------------------------------ */
/* Brand graphics (inline SVG — crisp, tiny, no image requests)        */
/* ------------------------------------------------------------------ */

let uid = 0;

/* The two founders. Left bro: quiff. Right bro: beanie.
   The left one gets a halo in the background colour so the overlap reads. */
function brosShapes(fill, gap) {
  const right = `
    <ellipse cx="78" cy="31" rx="14" ry="16.5"/>
    <path d="M63.4 29 C62.6 14 69.6 8.5 78 8.5 C86.4 8.5 93.4 14 92.6 29 Z"/>
    <circle cx="78" cy="7" r="4"/>
    <rect x="72" y="42" width="12" height="12"/>
    <path d="M48 84 C48 62 61 51.5 78 51.5 C95 51.5 108 62 108 84 Z"/>`;
  const left = `
    <ellipse cx="44" cy="35" rx="14" ry="16.5"/>
    <path d="M30.4 31 C28.6 17 37.6 11.4 47 12.2 C56.4 13 61.4 17.6 59.6 26 C55.6 21 49.6 20.2 44 22 C38 23.6 33.2 26.6 30.4 31 Z"/>
    <rect x="38" y="46" width="12" height="12"/>
    <path d="M14 84 C14 64 27 55 44 55 C61 55 74 64 74 84 Z"/>`;
  return `
    <g fill="${fill}">${right}</g>
    <g fill="${gap}" stroke="${gap}" stroke-width="6" stroke-linejoin="round">${left}</g>
    <g fill="${fill}">${left}</g>`;
}

function brosMark({ fill = 'currentColor', gap = 'var(--gap, #fff)', cls = '' } = {}) {
  return `<svg class="bros ${cls}" viewBox="0 0 120 84" aria-hidden="true" focusable="false">${brosShapes(fill, gap)}</svg>`;
}

function logo({ dark = false } = {}) {
  return `<span class="logo__mark">${brosMark({ gap: dark ? '#0E0E0E' : 'var(--gap, #fff)' })}</span><span class="logo__type">PUDDING BROS.</span>`;
}

/* Pieces on top of the pudding / floating in the hero */
function piece(p, x, y, rot, s = 1, i = 0) {
  const c = p.pieceColors[i % p.pieceColors.length];
  const t = `transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"`;
  if (p.topping === 'cookie') {
    return `<g ${t}><path d="M-8 -5 L2 -8 L9 -2 L7 6 L-3 8 L-9 2 Z" fill="${c}"/><circle cx="-2" cy="-1" r="1.8" fill="#2B170D"/><circle cx="4" cy="3" r="1.5" fill="#2B170D"/><circle cx="3" cy="-4" r="1.1" fill="#2B170D"/></g>`;
  }
  if (p.topping === 'coconut') {
    return `<g ${t}><path d="M-9 0 C-6 -5 6 -5 9 0 C6 -2 -6 -2 -9 0 Z" fill="${c}" stroke="#E6D6B4" stroke-width=".6"/></g>`;
  }
  return `<g ${t}><rect x="-7" y="-6" width="14" height="12" rx="3.4" fill="${c}"/><rect x="-7" y="-6" width="14" height="4" rx="2" fill="#fff" opacity=".7"/><rect x="-7" y="-6" width="14" height="12" rx="3.4" fill="none" stroke="#000" stroke-opacity=".08"/></g>`;
}

const DOME_PIECES = [
  [96, 292, -14, 1, 0], [118, 283, 10, 1.05, 1], [140, 279, -6, 1.1, 0], [162, 284, 18, 1, 1],
  [180, 293, -10, .95, 0], [108, 297, 24, .9, 1], [152, 295, -20, .95, 0], [130, 294, 4, .9, 1],
];

function bowl(p, { pieces = true } = {}) {
  return `
    <path d="M62 300 H208 C208 346 177 370 135 370 C93 370 62 346 62 300 Z" fill="#FFFFFF"/>
    <path d="M62 300 H90 C90 340 108 362 135 370 C93 370 62 346 62 300 Z" fill="#000" opacity=".05"/>
    <ellipse cx="135" cy="300" rx="73" ry="11" fill="#F4F0E8"/>
    <path d="M70 301 C76 268 194 268 200 301 C180 307 90 307 70 301 Z" fill="${p.pudding}"/>
    <path d="M86 288 C100 276 120 273 134 274" stroke="#fff" stroke-opacity=".45" stroke-width="4" fill="none" stroke-linecap="round"/>
    ${pieces ? DOME_PIECES.map(([x, y, r, s, i]) => piece(p, x, y, r, s, i)).join('') : ''}`;
}

function fitSize(text, max, width) {
  return Math.min(max, width / (text.length * 0.86)).toFixed(1);
}

/* Product packaging render — a standing folding box, front + side + lid */
function packSVG(p, { cls = '' } = {}) {
  const id = `pk${++uid}`;
  const [l1, l2] = p.lines;
  const drips = [[40, 22], [70, 12], [104, 30], [150, 16], [186, 26], [222, 14]]
    .map(([x, h]) => `<rect x="${x}" y="146" width="13" height="${h + 8}" rx="6.5" fill="#FFF8EC"/>`).join('');
  return `
  <svg class="pack ${cls}" viewBox="0 0 300 420" role="img" aria-label="Packung Pudding Bros. ${p.title}">
    <defs>
      <linearGradient id="${id}g" x1="0" x2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".16" stop-color="#fff" stop-opacity=".32"/>
        <stop offset=".3" stop-color="#fff" stop-opacity="0"/>
        <stop offset=".82" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".14"/>
      </linearGradient>
      <radialGradient id="${id}s"><stop offset="0" stop-color="#000" stop-opacity=".32"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
      <clipPath id="${id}c"><rect x="20" y="30" width="230" height="360" rx="5"/></clipPath>
    </defs>
    <ellipse class="pack__shadow" cx="150" cy="398" rx="138" ry="13" fill="url(#${id}s)"/>
    <path d="M250 30 L279 15 L279 375 L250 390 Z" fill="${p.dark}"/>
    <path d="M250 30 L279 15 L279 145 L250 160 Z" fill="#E7D9BE"/>
    <path d="M20 30 L49 15 L279 15 L250 30 Z" fill="#F3E8D2"/>
    <g clip-path="url(#${id}c)">
      <rect x="20" y="30" width="230" height="360" fill="#FFF8EC"/>
      <rect x="20" y="150" width="230" height="240" fill="${p.accent}"/>
      <rect x="20" y="140" width="230" height="12" fill="#FFF8EC"/>
      ${drips}
      <g transform="translate(97 42) scale(.64)">${brosShapes('#0E0E0E', '#FFF8EC')}</g>
      <text x="135" y="120" text-anchor="middle" class="pk-logo" font-size="22" fill="#0E0E0E">PUDDING BROS.</text>
      <text x="135" y="135" text-anchor="middle" class="pk-small" font-size="6.6" fill="#0E0E0E" letter-spacing="2">PUDDINGPULVER ZUM AUFKOCHEN</text>
      <text x="135" y="214" text-anchor="middle" class="pk-name" font-size="${fitSize(l1, 38, 205)}" fill="${p.ink}">${l1}</text>
      <text x="135" y="240" text-anchor="middle" class="pk-name" font-size="${fitSize(l2, 22, 175)}" fill="${p.ink}">${l2}</text>
      <g transform="translate(0 6)">${bowl(p)}</g>
      <g transform="translate(222 290) rotate(-12)">
        <circle r="23" fill="#0E0E0E"/>
        <text y="-2" text-anchor="middle" class="pk-name" font-size="8.6" fill="#fff">LOADED</text>
        <text y="8" text-anchor="middle" class="pk-small" font-size="4.6" fill="${p.accent === '#5B3A29' ? '#E5B98E' : p.accent}">${p.loaded}</text>
      </g>
      <text x="30" y="380" class="pk-small" font-size="7" fill="${p.ink}" opacity=".85">90 g ℮</text>
      <text x="240" y="380" text-anchor="end" class="pk-small" font-size="7" fill="${p.ink}" opacity=".85">FÜR 500 ML MILCH</text>
    </g>
    <rect x="20" y="30" width="230" height="360" rx="5" fill="url(#${id}g)" pointer-events="none"/>
  </svg>`;
}

/* A plain bowl of pudding, used in social tiles & steps */
function bowlSVG(p, cls = '') {
  return `<svg class="${cls}" viewBox="50 250 170 130" aria-hidden="true">${bowl(p)}</svg>`;
}

function floatingPiece(p, i) {
  return `<svg viewBox="-12 -12 24 24" aria-hidden="true">${piece(p, 0, 0, 0, 1, i)}</svg>`;
}

const ICONS = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M14 3c.4 2.8 2.3 4.6 5 4.8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="currentColor"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor"/></svg>',
  milk: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M22 22 28 12h10l6 10v32a2 2 0 0 1-2 2H24a2 2 0 0 1-2-2V22Z" fill="#fff" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M22 22h22M28 12l-2 10" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M22 36h22v8H22z" fill="var(--a)"/></svg>',
  powder: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M16 14l4-3 4 3 4-3 4 3 4-3 4 3 4-3v42a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V14Z" fill="#fff" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M16 30h32v12H16z" fill="var(--a)"/><circle cx="52" cy="50" r="2" fill="currentColor"/><circle cx="56" cy="44" r="1.4" fill="currentColor"/><circle cx="50" cy="42" r="1.2" fill="currentColor"/></svg>',
  cook: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M24 14c-2 3 2 5 0 8M32 12c-2 3 2 5 0 8M40 14c-2 3 2 5 0 8" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M12 30h40v16a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8V30Z" fill="#fff" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M12 34H5M52 34h7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M14.6 30h34.8v6H14.6z" fill="var(--a)"/></svg>',
  enjoy: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M44 8 34 30" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M10 32h44a22 20 0 0 1-44 0Z" fill="#fff" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M14 32c2-9 34-9 36 0Z" fill="var(--a)" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><rect x="22" y="23" width="6" height="5" rx="1.5" fill="#fff" stroke="currentColor" stroke-width="1.6"/><rect x="33" y="22" width="6" height="5" rx="1.5" fill="#fff" stroke="currentColor" stroke-width="1.6"/></svg>',
};

/* ------------------------------------------------------------------ */
/* Shared layout: header, mobile menu, cart drawer, footer             */
/* ------------------------------------------------------------------ */

function headerHTML() {
  return `
  <a class="skip" href="#main">Zum Inhalt springen</a>
  <header class="nav" id="nav">
    <div class="nav__inner wrap">
      <a href="index.html" class="logo" aria-label="Pudding Bros. Startseite">${logo()}</a>
      <nav class="nav__links" aria-label="Hauptnavigation">
        <a href="shop.html">Shop</a>
        <a href="index.html#sorten">Sorten</a>
        <a href="index.html#about">Über uns</a>
        <a href="index.html#faq">FAQ</a>
      </nav>
      <div class="nav__actions">
        <button class="icon-btn cart-open" type="button" aria-label="Warenkorb öffnen">
          ${ICONS.bag}<span class="cart-count" data-cart-count hidden>0</span>
        </button>
        <a class="btn btn--accent btn--sm nav__cta" href="shop.html">Pudding holen <span class="btn__arrow">${ICONS.arrow}</span></a>
        <button class="burger" type="button" aria-label="Menü öffnen" aria-expanded="false" aria-controls="menu"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="menu" id="menu" hidden>
    <nav class="menu__links wrap" aria-label="Mobile Navigation">
      <a href="shop.html">Shop</a>
      <a href="index.html#sorten">Sorten</a>
      <a href="index.html#about">Über uns</a>
      <a href="index.html#faq">FAQ</a>
      <a class="btn btn--accent btn--lg" href="shop.html">Pudding holen <span class="btn__arrow">${ICONS.arrow}</span></a>
    </nav>
    <div class="menu__bros">${brosMark({ gap: '#FBF4E6' })}</div>
  </div>
  <div class="drawer-scrim" data-cart-close hidden></div>
  <aside class="drawer" id="cart" aria-label="Warenkorb" aria-hidden="true">
    <div class="drawer__head">
      <h2>Dein Warenkorb</h2>
      <button class="icon-btn" type="button" data-cart-close aria-label="Warenkorb schließen">${ICONS.close}</button>
    </div>
    <div class="drawer__ship" data-ship></div>
    <ul class="drawer__items" data-cart-items></ul>
    <div class="drawer__foot">
      <div class="drawer__sum"><span>Zwischensumme</span><strong data-cart-total>0,00 €</strong></div>
      <p class="muted small">inkl. MwSt., zzgl. Versand</p>
      <button class="btn btn--dark btn--block" type="button" data-checkout>Zur Kasse <span class="btn__arrow">${ICONS.arrow}</span></button>
    </div>
  </aside>
  <div class="toast" role="status" aria-live="polite" data-toast></div>`;
}

function footerHTML() {
  return `
  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <a href="index.html" class="logo logo--light" aria-label="Pudding Bros. Startseite">${logo({ dark: true })}</a>
        <p class="footer__claim">Pudding, aber nicht langweilig.</p>
      </div>
      <div class="footer__cols">
        <nav aria-label="Footer Navigation">
          <h3>Pudding Bros.</h3>
          <a href="shop.html">Shop</a>
          <a href="index.html#sorten">Sorten</a>
          <a href="index.html#about">Über uns</a>
          <a href="index.html#faq">FAQ</a>
          <a href="mailto:hallo@puddingbros.de">Kontakt</a>
        </nav>
        <nav aria-label="Social Media">
          <h3>Follow</h3>
          <a href="https://instagram.com/puddingbros" rel="noopener">Instagram</a>
          <a href="https://tiktok.com/@puddingbros" rel="noopener">TikTok</a>
        </nav>
        <nav aria-label="Rechtliches">
          <h3>Rechtliches</h3>
          <a href="#">Impressum</a>
          <a href="#">Datenschutz</a>
          <a href="#">AGB</a>
          <a href="#">Widerruf</a>
        </nav>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} Pudding Bros.</span>
        <span>Made by two Bros. in Germany</span>
      </div>
    </div>
  </footer>`;
}

/* ------------------------------------------------------------------ */
/* Cart (per-browser convenience — localStorage, guarded)              */
/* ------------------------------------------------------------------ */

const CART_KEY = 'pb-cart-v1';
const FREE_SHIPPING = 25;
let cart = [];

function loadCart() {
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { cart = []; }
  cart = cart.filter((l) => findProduct(l.id) && l.qty > 0);
}
function saveCart() {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* private mode */ }
}
function cartTotal() {
  return cart.reduce((s, l) => s + findProduct(l.id).price * l.qty, 0);
}

function addToCart(id, qty = 1) {
  const line = cart.find((l) => l.id === id);
  if (line) line.qty += qty; else cart.push({ id, qty });
  saveCart();
  renderCart();
  const p = findProduct(id);
  toast(`<strong>${p.title}</strong> liegt im Warenkorb.`, p.accent);
  const count = document.querySelector('[data-cart-count]');
  count?.classList.remove('bump'); void count?.offsetWidth; count?.classList.add('bump');
}

function setQty(id, qty) {
  cart = cart.map((l) => (l.id === id ? { ...l, qty } : l)).filter((l) => l.qty > 0);
  saveCart();
  renderCart();
}

function renderCart() {
  const n = cart.reduce((s, l) => s + l.qty, 0);
  const count = document.querySelector('[data-cart-count]');
  if (count) { count.textContent = n; count.hidden = n === 0; }

  const list = document.querySelector('[data-cart-items]');
  if (!list) return;
  list.innerHTML = cart.length
    ? cart.map((l) => {
      const p = findProduct(l.id);
      return `<li class="line" style="--a:${p.accent};--soft:${p.soft}">
        <a class="line__img" href="produkt.html#${p.id}">${packSVG(p)}</a>
        <div class="line__info">
          <a href="produkt.html#${p.id}"><strong>${p.title}</strong></a>
          <span class="muted small">90 g · ${euro(p.price)}</span>
          <div class="qty qty--sm">
            <button type="button" data-qty="${p.id}" data-d="-1" aria-label="Weniger">−</button>
            <span>${l.qty}</span>
            <button type="button" data-qty="${p.id}" data-d="1" aria-label="Mehr">+</button>
          </div>
        </div>
        <strong class="line__price">${euro(p.price * l.qty)}</strong>
      </li>`;
    }).join('')
    : `<li class="drawer__empty">${brosMark()}<p><strong>Noch leer hier.</strong><br>Die Bros. warten auf dich.</p><a class="btn btn--dark btn--sm" href="shop.html">Zum Shop <span class="btn__arrow">${ICONS.arrow}</span></a></li>`;

  const total = cartTotal();
  document.querySelector('[data-cart-total]').textContent = euro(total);
  const rest = FREE_SHIPPING - total;
  const pct = Math.min(100, (total / FREE_SHIPPING) * 100);
  document.querySelector('[data-ship]').innerHTML = `
    <p>${rest > 0 ? `Noch <strong>${euro(rest)}</strong> bis zum kostenlosen Versand` : '<strong>Kostenloser Versand</strong> – nice, Bro.'}</p>
    <div class="bar"><span style="width:${pct}%"></span></div>`;
}

function openCart() {
  document.body.classList.add('cart-is-open');
  document.getElementById('cart').setAttribute('aria-hidden', 'false');
  document.querySelector('.drawer-scrim').hidden = false;
  document.querySelector('#cart [data-cart-close]').focus();
}
function closeCart() {
  document.body.classList.remove('cart-is-open');
  document.getElementById('cart').setAttribute('aria-hidden', 'true');
  document.querySelector('.drawer-scrim').hidden = true;
}

let toastTimer;
function toast(html, color = '#F6C945') {
  const t = document.querySelector('[data-toast]');
  t.innerHTML = `<span class="toast__dot" style="background:${color}"></span><span>${html}</span><button type="button" class="toast__link">Ansehen</button>`;
  t.classList.add('show');
  t.querySelector('.toast__link').onclick = () => { t.classList.remove('show'); openCart(); };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ------------------------------------------------------------------ */
/* Reusable product components                                         */
/* ------------------------------------------------------------------ */

function productVars(p) {
  return `--a:${p.accent};--a-dark:${p.dark};--soft:${p.soft};--ink:${p.ink};--ink-on-a:${p.ink}`;
}

/* "Meet the Bros." flavour card on the home page */
function flavourCard(p) {
  return `
  <a class="fcard reveal" href="produkt.html#${p.id}" style="${productVars(p)}">
    ${p.badge ? `<span class="tag">${p.badge}</span>` : ''}
    <div class="fcard__media">${packSVG(p)}</div>
    <div class="fcard__body">
      <h3>${p.lines.join('<br>')}</h3>
      <p>${p.short}</p>
      <span class="fcard__cta">Entdecken <span class="btn__arrow">${ICONS.arrow}</span></span>
    </div>
  </a>`;
}

/* Shop card with price + add to cart */
function shopCard(p) {
  return `
  <article class="scard reveal" style="${productVars(p)}">
    <a class="scard__media" href="produkt.html#${p.id}" aria-label="${p.title} ansehen">
      ${p.badge ? `<span class="tag">${p.badge}</span>` : ''}
      ${packSVG(p)}
    </a>
    <div class="scard__body">
      <div>
        <h3><a href="produkt.html#${p.id}">${p.title}</a></h3>
        <p class="muted">${p.short}</p>
      </div>
      <div class="scard__row">
        <span class="price">${euro(p.price)}<small>90 g · ${euro(p.price / 0.09)}/kg</small></span>
        <button class="btn btn--dark btn--sm" type="button" data-add="${p.id}">In den Warenkorb</button>
      </div>
    </div>
  </article>`;
}

function stars(r) {
  return `<span class="stars" role="img" aria-label="${r.toString().replace('.', ',')} von 5 Sternen">★★★★★</span>`;
}

/* ------------------------------------------------------------------ */
/* Page renderers                                                      */
/* ------------------------------------------------------------------ */

function renderHome() {
  const hero = PRODUCTS[0];
  const heroPack = document.querySelector('[data-hero-pack]');
  if (heroPack) {
    heroPack.innerHTML = packSVG(hero, { cls: 'pack--hero' });
    const spots = [
      ['8%', '18%', 1.5, -18, 0], ['84%', '10%', 1.1, 22, 1], ['90%', '58%', 1.7, 8, 0],
      ['2%', '64%', 1.2, 30, 1], ['70%', '86%', 1, -12, 0], ['22%', '90%', .8, 14, 1],
    ];
    document.querySelector('[data-hero-pieces]').innerHTML = spots.map(([l, t, s, r, i], n) =>
      `<span class="float-piece" style="left:${l};top:${t};--s:${s};--r:${r}deg;--d:${(n * 0.7).toFixed(1)}s">${floatingPiece(hero, i)}</span>`).join('')
      + `<span class="float-piece float-piece--flower" style="left:78%;top:30%;--s:1.6;--r:0deg;--d:.4s">${vanillaFlower()}</span>`
      + `<span class="float-piece float-piece--pod" style="left:-2%;top:36%;--s:1.4;--r:-30deg;--d:1.2s">${vanillaPod()}</span>`;
  }

  const flav = document.querySelector('[data-flavours]');
  if (flav) flav.innerHTML = PRODUCTS.map(flavourCard).join('');

  const social = document.querySelector('[data-social]');
  if (social) {
    const posts = [
      { p: PRODUCTS[0], net: 'tiktok', text: 'POV: Es ist 23 Uhr und du kochst einfach Pudding.', stat: '412K' },
      { p: PRODUCTS[1], net: 'instagram', text: 'Cookie-Chunks: Hälfte rein, Hälfte drauf. Trust the Bros.', stat: '38,2K' },
      { p: PRODUCTS[3], net: 'tiktok', text: 'Blind-Test: Welche Sorte ist der neue Bro?', stat: '1,1M' },
      { p: PRODUCTS[2], net: 'instagram', text: 'Vanilla Coconut + Mango. Sommer, aber im Glas.', stat: '24,6K' },
    ];
    social.innerHTML = posts.map(({ p, net, text, stat }, i) => `
      <a class="post reveal" href="${net === 'tiktok' ? 'https://tiktok.com/@puddingbros' : 'https://instagram.com/puddingbros'}" rel="noopener" style="${productVars(p)};--i:${i}">
        <div class="post__art">
          ${i % 2 ? bowlSVG(p, 'post__bowl') : packSVG(p, { cls: 'post__pack' })}
          ${net === 'tiktok' ? `<span class="post__play">${ICONS.play}</span>` : ''}
        </div>
        <div class="post__meta">
          <span class="post__net">${ICONS[net]} @puddingbros</span>
          <p>${text}</p>
          <span class="post__stat">${net === 'tiktok' ? ICONS.play : ICONS.heart} ${stat}</span>
        </div>
      </a>`).join('');
  }
}

function vanillaFlower() {
  const petals = [0, 72, 144, 216, 288].map((r) =>
    `<ellipse cx="0" cy="-9" rx="5.2" ry="9" transform="rotate(${r})" fill="#FFF8EC" stroke="#E9D9B4" stroke-width=".8"/>`).join('');
  return `<svg viewBox="-20 -20 40 40" aria-hidden="true">${petals}<circle r="4" fill="#F6C945"/></svg>`;
}
function vanillaPod() {
  return `<svg viewBox="0 0 80 20" aria-hidden="true"><path d="M4 12 C20 2 50 2 76 8 C52 10 22 14 4 12 Z" fill="#3B2416"/><path d="M10 10 C28 5 50 5 70 8" stroke="#6B4630" stroke-width="1" fill="none"/></svg>`;
}

function renderShop() {
  const grid = document.querySelector('[data-shop]');
  if (grid) grid.innerHTML = PRODUCTS.map(shopCard).join('');
  const box = document.querySelector('[data-box-packs]');
  if (box) box.innerHTML = PRODUCTS.map((p, i) => `<div class="box__pack" style="--i:${i}">${packSVG(p)}</div>`).join('');
}

function renderProduct() {
  const root = document.querySelector('[data-product]');
  if (!root) return;
  const id = location.hash.slice(1) || new URLSearchParams(location.search).get('sorte');
  window.addEventListener('hashchange', () => location.reload(), { once: true });
  const p = findProduct(id) || PRODUCTS[0];
  const n = p.nutrition;
  const num = (v) => v.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  document.title = `${p.title} – Pudding Bros.`;
  document.querySelector('meta[name="description"]').setAttribute('content', `Pudding Bros. ${p.title}: ${p.claim}`);
  document.documentElement.style.setProperty('--page-a', p.accent);
  root.setAttribute('style', productVars(p));

  root.innerHTML = `
  <section class="pdp wrap">
    <nav class="crumbs" aria-label="Brotkrumen"><a href="index.html">Home</a><span>/</span><a href="shop.html">Shop</a><span>/</span><span aria-current="page">${p.title}</span></nav>
    <div class="pdp__grid">
      <div class="pdp__stage">
        ${p.badge ? `<span class="tag tag--lg">${p.badge}</span>` : ''}
        <div class="pdp__pieces" aria-hidden="true">${[['10%', '14%', 1.6, 0], ['82%', '20%', 1.2, 1], ['86%', '72%', 1.8, 0], ['8%', '76%', 1.1, 1]]
    .map(([l, t, s, i], k) => `<span class="float-piece" style="left:${l};top:${t};--s:${s};--r:${k * 17}deg;--d:${k * .6}s">${floatingPiece(p, i)}</span>`).join('')}</div>
        ${packSVG(p, { cls: 'pack--pdp' })}
      </div>
      <div class="pdp__info">
        <p class="eyebrow">Puddingpulver zum Aufkochen · 90 g</p>
        <h1><span>PUDDING BROS.</span>${p.lines.join(' ')}</h1>
        <div class="rating">${stars(p.rating)}<span>${p.rating.toString().replace('.', ',')} · ${p.reviews} Bewertungen</span></div>
        <p class="pdp__claim">${p.claim}</p>
        <div class="pdp__buy">
          <div class="price price--lg">${euro(p.price)}<small>inkl. MwSt. · ${euro(p.price / 0.09)}/kg</small></div>
          <div class="pdp__actions">
            <div class="qty" data-qty-picker>
              <button type="button" data-step="-1" aria-label="Menge verringern">−</button>
              <input type="number" min="1" max="24" value="1" aria-label="Menge" data-qty-input>
              <button type="button" data-step="1" aria-label="Menge erhöhen">+</button>
            </div>
            <button class="btn btn--dark btn--lg btn--grow" type="button" data-add-qty="${p.id}">In den Warenkorb <span class="btn__arrow">${ICONS.arrow}</span></button>
          </div>
          <ul class="perks">
            <li>Versand in 1–2 Werktagen</li>
            <li>Ab ${euro(FREE_SHIPPING)} versandkostenfrei</li>
            <li>Mit separatem Loaded-Beutel</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="pdp-tabs wrap">
    <div class="tabs" role="tablist" aria-label="Produktinformationen">
      ${['Produktbeschreibung', 'Zubereitung', 'Zutaten', 'Allergene', 'Nährwerte'].map((t, i) =>
    `<button role="tab" id="tab-${i}" aria-controls="panel-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t}</button>`).join('')}
    </div>
    <div class="panels">
      <div role="tabpanel" id="panel-0" aria-labelledby="tab-0" class="panel">
        <div class="panel__cols">
          <div>${p.description.map((d) => `<p>${d}</p>`).join('')}</div>
          <dl class="facts">
            <div><dt>Inhalt</dt><dd>90 g (75 g Pulver + 15 g Loaded-Beutel)</dd></div>
            <div><dt>Ergibt</dt><dd>4 Portionen à 125 g</dd></div>
            <div><dt>Du brauchst</dt><dd>500 ml Milch</dd></div>
            <div><dt>Topping</dt><dd>${p.loaded.toLowerCase().replace(/^./, (c) => c.toUpperCase())}</dd></div>
          </dl>
        </div>
      </div>
      <div role="tabpanel" id="panel-1" aria-labelledby="tab-1" class="panel" hidden>
        <ol class="mini-steps">
          <li><span>01</span><div><strong>Milch</strong>100 ml von 500 ml Milch abnehmen und das Pulver darin glatt rühren.</div></li>
          <li><span>02</span><div><strong>Pulver</strong>Restliche 400 ml Milch im Topf aufkochen, vom Herd nehmen und angerührtes Pulver einrühren.</div></li>
          <li><span>03</span><div><strong>Kochen</strong>Unter Rühren noch einmal ca. 1 Minute aufkochen lassen.</div></li>
          <li><span>04</span><div><strong>Enjoy</strong>In Schälchen füllen, abkühlen lassen, Loaded-Beutel drüber – fertig.</div></li>
        </ol>
      </div>
      <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" class="panel" hidden><p>${p.ingredients}</p></div>
      <div role="tabpanel" id="panel-3" aria-labelledby="tab-3" class="panel" hidden>
        <p><strong>Enthält:</strong></p>
        <ul class="chips">${p.allergens.map((a) => `<li>${a}</li>`).join('')}</ul>
        <p class="muted">${p.traces}</p>
      </div>
      <div role="tabpanel" id="panel-4" aria-labelledby="tab-4" class="panel" hidden>
        <table class="nutri">
          <caption>Durchschnittliche Nährwerte pro 100 g zubereitet (mit Milch 1,5 % Fett, inkl. Topping)</caption>
          <tbody>
            <tr><th>Energie</th><td>${n.kj} kJ / ${n.kcal} kcal</td></tr>
            <tr><th>Fett</th><td>${num(n.fat)} g</td></tr>
            <tr class="sub"><th>davon gesättigte Fettsäuren</th><td>${num(n.sat)} g</td></tr>
            <tr><th>Kohlenhydrate</th><td>${num(n.carbs)} g</td></tr>
            <tr class="sub"><th>davon Zucker</th><td>${num(n.sugar)} g</td></tr>
            <tr><th>Eiweiß</th><td>${num(n.protein)} g</td></tr>
            <tr><th>Salz</th><td>${n.salt.toLocaleString('de-DE', { minimumFractionDigits: 2 })} g</td></tr>
          </tbody>
        </table>
      </div>
    </div>
    <p class="muted small disclaimer">Konzept-Website: Zutaten, Nährwerte und Bewertungen sind Beispielangaben.</p>
  </section>

  <section class="section more">
    <div class="wrap">
      <div class="section__head"><h2 class="h2">MORE BROS.</h2><a class="link" href="shop.html">Alle Sorten <span class="btn__arrow">${ICONS.arrow}</span></a></div>
      <div class="grid-3">${PRODUCTS.filter((x) => x.id !== p.id).map(flavourCard).join('')}</div>
    </div>
  </section>`;

  /* sticky mobile buy bar */
  const bar = document.querySelector('[data-buybar]');
  if (bar) {
    bar.setAttribute('style', productVars(p));
    bar.innerHTML = `<div><strong>${p.title}</strong><span>${euro(p.price)}</span></div><button class="btn btn--dark btn--sm" type="button" data-add="${p.id}">In den Warenkorb</button>`;
    const target = root.querySelector('.pdp__buy');
    new IntersectionObserver(([e]) => bar.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0))
      .observe(target);
  }
}

/* ------------------------------------------------------------------ */
/* Behaviour                                                           */
/* ------------------------------------------------------------------ */

function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.querySelector('.burger');
  const menu = document.getElementById('menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    document.body.classList.toggle('menu-is-open', open);
    if (open) menu.hidden = false;
    else setTimeout(() => { if (!document.body.classList.contains('menu-is-open')) menu.hidden = true; }, 350);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeCart();
    setMenu(false);
  });
}

function initClicks() {
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.cart-open')) return openCart();
    if (t.closest('[data-cart-close]')) return closeCart();
    const add = t.closest('[data-add]');
    if (add) return addToCart(add.dataset.add);
    const addQty = t.closest('[data-add-qty]');
    if (addQty) {
      const input = document.querySelector('[data-qty-input]');
      return addToCart(addQty.dataset.addQty, Math.max(1, parseInt(input.value, 10) || 1));
    }
    const q = t.closest('[data-qty]');
    if (q) {
      const line = cart.find((l) => l.id === q.dataset.qty);
      return setQty(q.dataset.qty, (line?.qty || 0) + Number(q.dataset.d));
    }
    const step = t.closest('[data-step]');
    if (step) {
      const input = document.querySelector('[data-qty-input]');
      input.value = Math.min(24, Math.max(1, (parseInt(input.value, 10) || 1) + Number(step.dataset.step)));
      return;
    }
    if (t.closest('[data-checkout]')) {
      return toast(cart.length ? 'Demo-Shop: Der Checkout wird beim Launch angebunden.' : 'Dein Warenkorb ist noch leer.');
    }
    if (t.closest('[data-notify]')) {
      e.preventDefault();
      return toast('Notiert! Wir melden uns, sobald die <strong>Bros Box</strong> da ist.', '#0E0E0E');
    }
  });
}

function initTabs() {
  const list = document.querySelector('[role="tablist"]');
  if (!list) return;
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  list.addEventListener('click', (e) => { const t = e.target.closest('[role="tab"]'); if (t) select(t); });
  list.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = null;
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') n = 0;
    if (e.key === 'End') n = tabs.length - 1;
    if (n !== null) { e.preventDefault(); tabs[n].focus(); select(tabs[n]); }
  });
}

function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const siblings = [...e.target.parentElement.children].filter((c) => c.classList.contains('reveal'));
      e.target.style.transitionDelay = `${Math.max(0, siblings.indexOf(e.target)) * 70}ms`;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach((el) => io.observe(el));
}

/* gentle parallax on the hero pack (pointer devices only) */
function initHeroTilt() {
  const stage = document.querySelector('.hero__stage');
  if (!stage || !matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
  stage.addEventListener('pointermove', (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    stage.style.setProperty('--tx', `${x * 14}px`);
    stage.style.setProperty('--ty', `${y * 10}px`);
  });
  stage.addEventListener('pointerleave', () => { stage.style.setProperty('--tx', '0px'); stage.style.setProperty('--ty', '0px'); });
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

document.querySelector('[data-header]')?.insertAdjacentHTML('afterend', headerHTML());
document.querySelector('[data-header]')?.remove();
document.querySelector('[data-footer]')?.insertAdjacentHTML('afterend', footerHTML());
document.querySelector('[data-footer]')?.remove();
document.querySelectorAll('[data-bros]').forEach((el) => { el.innerHTML = brosMark(); });
document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ''; });

renderHome();
renderShop();
renderProduct();

loadCart();
renderCart();
initNav();
initClicks();
initTabs();
initReveal();
initHeroTilt();
requestAnimationFrame(() => document.body.classList.add('is-ready'));
