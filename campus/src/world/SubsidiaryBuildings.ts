/**
 * The ten subsidiary headquarters. Each has its own façade style, exterior
 * features and an interior program (2–3 visitable floors).
 */
import { WorldBuilder } from '../engine/builder'
import { C, canvasTex, textTexture } from '../engine/materials'
import { BUILDINGS, type BuildingInfo, type FacadeStyle } from '../config/campus'
import { buildGeneric, ring, type FloorSpec, type GenericCtx } from './GenericBuilding'
import * as K from './kits'
import { infoPoint } from './dynamic'

const MARKET = { kind: 'market' as const }

const PROGRAMS: Record<string, FloorSpec[]> = {
  racing: [
    { label: 'EG', rooms: [
      { name: 'Empfang & Fan-Bereich', kind: 'reception', wing: 'C' },
      { name: 'F1-Showroom', kind: 'f1showroom', wing: 'L', open: true },
      { name: 'Rennsimulatoren', kind: 'simulators', wing: 'R', f0: 0.45, f1: 1 },
      { name: 'Trophäen & Teamgeschichte', kind: 'exhibition', wing: 'R', f0: 0, f1: 0.45, open: true, ctx: { screens: [{ title: 'Big Apple Groups Racing', lines: ['Formel-1-Team · Gegründet in Amsterdam', 'Heimrennen: Zandvoort'], kind: 'event' }] } },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Race Control & Telemetrie', kind: 'control', wing: 'L', open: true, ctx: { screens: [{ title: 'Telemetrie live', lines: ['Runde 42/72 · P2 · Abstand +1,8 s', 'Reifen: Medium, 18 Runden alt · Boxenstopp in 3 Runden'], kind: 'trains' }] } },
      { name: 'Aerodynamik & Windkanal', kind: 'aero', wing: 'R', f0: 0.4, f1: 1 },
      { name: 'Strategieraum', kind: 'strategy', wing: 'R', f0: 0, f1: 0.4 },
      { name: 'Fahrer-Lounge', kind: 'clientlounge', wing: 'C' },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Engineering & Konstruktion', kind: 'tech', wing: 'L', open: true },
      { name: 'Fahrer-Performance', kind: 'strength', wing: 'R', f0: 0.5, f1: 1, open: true },
      { name: 'Besprechungsraum „Zandvoort“', kind: 'conference', wing: 'R', f0: 0, f1: 0.5 },
    ] },
  ],
  health: [
    { label: 'EG', rooms: [
      { name: 'Empfang Health & Recovery', kind: 'reception', wing: 'C' },
      { name: 'Physiotherapie', kind: 'physio', wing: 'L', f0: 0.5, f1: 1 },
      { name: 'Betriebsärztlicher Dienst', kind: 'medical', wing: 'L', f0: 0, f1: 0.5 },
      { name: 'Recovery & Sauna', kind: 'recovery', wing: 'R' },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Ruhe- & Meditationsraum', kind: 'meditation', wing: 'L' },
      { name: 'Massage', kind: 'physio', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Ernährungsberatung & Health-Café', kind: 'cafe', wing: 'R', f0: 0, f1: 0.5, open: true },
      { name: 'Lounge', kind: 'lounge', wing: 'C' },
    ] },
  ],
  tech: [
    { label: 'EG', rooms: [
      { name: 'Empfang & Demo-Lobby', kind: 'reception', wing: 'C' },
      { name: 'Technische Demonstrationsräume', kind: 'demo', wing: 'L', f0: 0.45, f1: 1, flip: true, ctx: { screens: [{ title: 'Live-Demo', lines: ['Big Apple Cloud Platform', 'Echtzeit-Buchungssystem für alle Tochterunternehmen'], kind: 'info' }] } },
      { name: 'Präsentationsfläche', kind: 'presentation', wing: 'L', f0: 0, f1: 0.45, ctx: { screens: [{ title: 'Tech Talk', lines: ['Roadmap 2027', 'KI · Plattform · Sicherheit'], kind: 'event' }] } },
      { name: 'Kreativbereich', kind: 'creative', wing: 'R', f0: 0.45, f1: 1, open: true },
      { name: 'Besprechungsraum „Ada“', kind: 'conference', wing: 'R', f0: 0, f1: 0.45 },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Softwareentwicklung', kind: 'tech', wing: 'L', open: true },
      { name: 'KI-Labor', kind: 'ailab', wing: 'R', f0: 0.4, f1: 1 },
      { name: 'KI-Rechenzentrum', kind: 'servers', wing: 'R', f0: 0, f1: 0.4 },
      { name: 'Team-Lounge', kind: 'lounge', wing: 'C' },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Besprechungsraum „Turing“', kind: 'conference', wing: 'L', f0: 0.5, f1: 1 },
      { name: 'Besprechungsraum „Lovelace“', kind: 'conference', wing: 'L', f0: 0, f1: 0.5 },
      { name: 'Softwareentwicklung II', kind: 'tech', wing: 'R', open: true },
      { name: 'Präsentationsfläche Produkt', kind: 'creative', wing: 'C' },
    ] },
  ],
  finance: [
    { label: 'EG', rooms: [
      { name: 'Kundenempfang', kind: 'reception', wing: 'C' },
      { name: 'Kundenlounge', kind: 'clientlounge', wing: 'L', f0: 0.45, f1: 1 },
      { name: 'Besprechungsraum Kunden', kind: 'conference', wing: 'L', f0: 0, f1: 0.45 },
      { name: 'Präsentationsraum Finanzprodukte', kind: 'presentation', wing: 'R', flip: true, ctx: { screens: [{ title: 'Finanzprodukte', lines: ['Big Apple Pay · Travel Card · Green Bonds', 'Nachhaltige Anlagen für Unternehmen'], kind: 'market' }] } },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Marktanalyse', kind: 'market', wing: 'L', open: true },
      { name: 'Finanzbüros', kind: 'openoffice', wing: 'R', f0: 0.4, f1: 1, open: true },
      { name: 'Besprechungsraum „Amstel“', kind: 'conference', wing: 'R', f0: 0, f1: 0.4 },
      { name: 'Trading-Lounge', kind: 'lounge', wing: 'C' },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Finanzbüros', kind: 'openoffice', wing: 'L', open: true },
      { name: 'Büro Geschäftsführung Finance', kind: 'exec', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Risikomanagement', kind: 'conference', wing: 'R', f0: 0, f1: 0.5 },
      { name: 'Digitale Marktbildschirme', kind: 'empty', wing: 'C', ctx: { screens: [{ title: 'Märkte', lines: [], ...MARKET }] } },
    ] },
  ],
  fitness: [
    { label: 'EG', rooms: [
      { name: 'Empfang & Shop', kind: 'reception', wing: 'C' },
      { name: 'Cardio-Bereich', kind: 'cardio', wing: 'L', open: true },
      { name: 'Umkleiden Damen', kind: 'lockers', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Umkleiden Herren', kind: 'lockers', wing: 'R', f0: 0, f1: 0.5 },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Krafttraining', kind: 'strength', wing: 'L', open: true },
      { name: 'Personal Training', kind: 'personal', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Recovery & Sauna', kind: 'recovery', wing: 'R', f0: 0, f1: 0.5 },
      { name: 'Functional Area', kind: 'group', wing: 'C' },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Gruppentrainingsraum', kind: 'group', wing: 'L' },
      { name: 'Recovery-Lounge', kind: 'recovery', wing: 'R' },
      { name: 'Smoothie-Bar', kind: 'cafe', wing: 'C' },
    ] },
  ],
  logistics: [
    { label: 'EG', rooms: [
      { name: 'Empfang', kind: 'reception', wing: 'C' },
      { name: 'Logistikleitstelle', kind: 'control', wing: 'L', open: true, ctx: { screens: [{ title: 'Logistikleitstelle', lines: ['Live: 1.284 Sendungen unterwegs', 'Rotterdam · Hamburg · Singapur · Los Angeles'], kind: 'logistics' }] } },
      { name: 'Besprechungsraum „Rotterdam“', kind: 'conference', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Lager-Technik-Demo', kind: 'devlab', wing: 'R', f0: 0, f1: 0.5 },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Planung internationaler Lieferketten', kind: 'openoffice', wing: 'L', open: true },
      { name: 'Supply-Chain-Steuerung', kind: 'control', wing: 'R', ctx: { screens: [{ title: 'Supply Chain Control Tower', lines: ['Pünktlichkeit 97,8 % · CO₂ −14 %', 'Seefracht · Luftfracht · Schiene'], kind: 'logistics' }] } },
      { name: 'Team-Lounge', kind: 'lounge', wing: 'C' },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Besprechungsraum „Hamburg“', kind: 'conference', wing: 'L', f0: 0.5, f1: 1 },
      { name: 'Besprechungsraum „Singapur“', kind: 'conference', wing: 'L', f0: 0, f1: 0.5 },
      { name: 'Logistik-Planung', kind: 'openoffice', wing: 'R', open: true },
    ] },
  ],
  mobility: [
    { label: 'EG', rooms: [
      { name: 'Empfang', kind: 'reception', wing: 'C' },
      { name: 'Fahrzeugpräsentation', kind: 'showroom', wing: 'L', open: true },
      { name: 'Showroom E-Bikes & E-Scooter', kind: 'showroom', wing: 'R', open: true },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Mobilitätsleitstelle', kind: 'control', wing: 'L', open: true, ctx: { screens: [{ title: 'Mobilitätsleitstelle', lines: ['Flotte: 2.430 E-Fahrzeuge aktiv', 'Amsterdam · Berlin · Paris · Kopenhagen'], kind: 'logistics' }] } },
      { name: 'Besprechungsraum „Velo“', kind: 'conference', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Besprechungsraum „E-Drive“', kind: 'conference', wing: 'R', f0: 0, f1: 0.5 },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Technologie & Entwicklung', kind: 'devlab', wing: 'L', open: true },
      { name: 'Software-Entwicklung Mobility', kind: 'tech', wing: 'R', open: true },
    ] },
  ],
  hotels: [
    { label: 'EG', rooms: [
      { name: 'Empfangsbereich', kind: 'reception', wing: 'C' },
      { name: 'Hotelmodell-Ausstellung', kind: 'hotelmodel', wing: 'L', open: true },
      { name: 'Musterzimmer', kind: 'sampleroom', wing: 'R' },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Hotelmanagement-Büros', kind: 'openoffice', wing: 'L', open: true },
      { name: 'Besprechungsraum', kind: 'conference', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Büro Geschäftsführung Hotels', kind: 'office', wing: 'R', f0: 0, f1: 0.5 },
    ] },
  ],
  holidays: [
    { label: 'EG', rooms: [
      { name: 'Empfang & Reisebüro', kind: 'reception', wing: 'C' },
      { name: 'Digitale Reisewelt', kind: 'digitaltravel', wing: 'L', flip: true },
      { name: 'Tavium-KI-Demonstrationsbereich', kind: 'tavium', wing: 'R', open: true },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Reiseplanung', kind: 'travel', wing: 'L', open: true },
      { name: 'Präsentationsraum', kind: 'presentation', wing: 'R', f0: 0.45, f1: 1, flip: true, ctx: { screens: [{ title: 'Reisetrends 2027', lines: ['Slow Travel · Bahnreisen · Städtetrips'], kind: 'travel' }] } },
      { name: 'Besprechungsraum „Lissabon“', kind: 'conference', wing: 'R', f0: 0, f1: 0.45 },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Reiseplanung Fernreisen', kind: 'travel', wing: 'L', open: true },
      { name: 'Team-Lounge', kind: 'lounge', wing: 'R', open: true },
    ] },
  ],
  entertainment: [
    { label: 'EG', rooms: [
      { name: 'Empfang', kind: 'reception', wing: 'C' },
      { name: 'Präsentationskino', kind: 'cinema', wing: 'L' },
      { name: 'Studio A', kind: 'studio', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Studio B (Podcast)', kind: 'studio', wing: 'R', f0: 0, f1: 0.5 },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Schnittplätze', kind: 'editing', wing: 'L', open: true },
      { name: 'Film- & Serienpräsentation', kind: 'presentation', wing: 'R', f0: 0.45, f1: 1, flip: true, ctx: { screens: [{ title: 'Neue Serien', lines: ['„Campus Nights“ · „Canal Stories“'], kind: 'event' }] } },
      { name: 'Writers Room', kind: 'conference', wing: 'R', f0: 0, f1: 0.45 },
    ] },
  ],
  trains: [
    { label: 'EG', rooms: [
      { name: 'Empfang', kind: 'reception', wing: 'C' },
      { name: 'Zugdesign-Ausstellung', kind: 'traindesign', wing: 'L', open: true },
      { name: 'Präsentation Zugmodell', kind: 'trainmodel', wing: 'R', open: true },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Betriebsleitstelle', kind: 'control', wing: 'L', open: true, ctx: { screens: [{ title: 'Betriebsleitstelle', lines: ['Netz NL/DE/BE: 412 Züge im Einsatz', 'Pünktlichkeit heute: 94,6 %'], kind: 'trains' }] } },
      { name: 'Streckenplanung', kind: 'strategy', wing: 'R', f0: 0.45, f1: 1 },
      { name: 'Besprechungsraum „Thalys“', kind: 'conference', wing: 'R', f0: 0, f1: 0.45 },
    ] },
  ],
  foundation: [
    { label: 'EG', rooms: [
      { name: 'Empfang', kind: 'reception', wing: 'C' },
      { name: 'Ausstellung „Projekte weltweit“', kind: 'exhibition', wing: 'L', open: true, ctx: { screens: [{ title: 'Big Apple Foundation', lines: ['Bildung · Klima · Gesundheit', '84 Projekte in 26 Ländern'], kind: 'info' }] } },
      { name: 'Veranstaltungsbereich', kind: 'event', wing: 'R', flip: true, ctx: { screens: [{ title: 'Charity Evening', lines: ['Spendenabend für Bildungsprojekte'], kind: 'event' }] } },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Räume für gemeinnützige Projekte', kind: 'projects', wing: 'L', open: true },
      { name: 'Besprechungsraum', kind: 'conference', wing: 'R', f0: 0.5, f1: 1 },
      { name: 'Projektwerkstatt', kind: 'projects', wing: 'R', f0: 0, f1: 0.5 },
    ] },
  ],
}

/** exterior features per style (local coords, front at +z) */
function extras(style: FacadeStyle) {
  return (b: WorldBuilder, c: GenericCtx) => {
    const { w, d, H, fh } = c
    switch (style) {
      case 'racing': {
        // F1 car on a lit plinth right next to the entrance
        b.cyl(-10, 0, d / 2 + 8, 4.2, 0.35, C.black, 'gloss', { segs: 40, col: true })
        b.arc(-10, 0.3, d / 2 + 8, 4.22, 0.06, 0, Math.PI * 2, C.green, 'emissive', true, 40)
        K.formulaCar(b, -10, 0.35, d / 2 + 8, 0.95)
        b.floorSign(-10, 0.4, d / 2 + 11.4, 4, 0.45, textTexture(['BAR-01 · Big Apple Groups Racing'], { w: 768, h: 86, bg: '#111312' }), 0)
        infoPoint(b, -10, 1.2, d / 2 + 12.8, 'BAR-01 – das Formel-1-Auto von Big Apple Groups Racing', [
          'Originalgroßes Showcar am Haupteingang des Racing-Headquarters.',
          '1,6-l-V6-Turbo-Hybrid · über 1.000 PS · 0–100 km/h in ca. 2,6 s',
          'Lackierung: Schwarz mit Apple Green und weißen Akzenten.',
          'Drinnen: F1-Showroom, Rennsimulatoren, Race Control und Windkanal.',
        ], { label: 'F1-Auto ansehen', suffix: 'Groups Racing', radius: 4.5 })
        b.npc({ kind: 'stand', x: -6.5, y: 0, z: d / 2 + 12, yaw: Math.PI + 0.8 })
        b.npc({ kind: 'stand', x: -13, y: 0, z: d / 2 + 13, yaw: Math.PI - 0.6 })
        // tyre stacks, checkered start line, team flags
        for (let i = 0; i < 3; i++) K.tyreStack(b, 8 + i * 0.75, 0, d / 2 + 6, 4 - (i % 2), [C.green, '#f2d24b', '#e05d4b'][i])
        b.floorSign(0, 0.02, d / 2 + 4.9, 6, 0.6, checker(), 0)
        for (let i = 0; i < 4; i++) K.flagPole(b, 12 + i * 3, d / 2 + 12, i % 2 ? C.green : C.black, 9)
        // racing stripe across the façade
        b.box(0, H - fh * 1.5, d / 2 + 0.2, w + 0.4, 0.5, 0.1, C.green, 'satin')
        break
      }
      case 'health': {
        // garden with recovery pool, Kneipp path and benches
        b.box(w / 2 + 7, 0, 0, 8, 0.5, 14, C.stone, 'satin', { col: true, noSupport: true })
        b.box(w / 2 + 7, 0.5, 0, 7.2, 0.02, 13.2, '#6fb3c2', 'gloss')
        b.sign(w / 2 + 7, 0.9, -7.05, 3, 0.4, textTexture(['Kneipp-Becken'], { w: 384, h: 64, accent: C.green }), Math.PI)
        for (let i = 0; i < 4; i++) K.bench(b, -w / 2 - 3, 0, -6 + i * 4, Math.PI / 2)
        for (let i = 0; i < 5; i++) K.tree(b, -w / 2 - 8, -8 + i * 4.5, 0.75, 0, i)
        b.box(0, H + 0.5, 0, w - 1, 0.25, d - 1, '#5e8a3a', 'matte') // green roof
        break
      }
      case 'tech': {
        // LED crown + solar roof
        ring(b, w + 0.6, d + 0.6, H + 1.4, 0.18, 0.1, C.green, 'emissive')
        for (let i = 0; i < 6; i++) b.boxTilt(-w / 3 + (i % 3) * (w / 3), H + 0.9, d / 6 + Math.floor(i / 3) * 4, 6, 0.08, 2.8, 0, -0.35, '#1f2a3a', 'gloss')
        // vertical LED media strip next to the entrance
        b.screen({ id: 'tech-led', lx: -w / 2 + 3.5, ly: 4.5, lz: d / 2 + 0.75, w: 4, h: H - 8, slides: [
          { title: 'TECH', lines: ['AI', 'Cloud', 'Code'], kind: 'info' },
        ], suffix: 'Tech' })
        break
      }
      case 'finance': {
        // stone plinth stairs, water basin with green light
        b.box(0, 0, d / 2 + 13, 18, 0.5, 6, C.stoneDark, 'gloss', { col: true })
        b.box(0, 0.5, d / 2 + 13, 17, 0.02, 5, C.water, 'gloss')
        b.box(0, 0.45, d / 2 + 10, 18, 0.06, 0.06, C.green, 'emissive')
        break
      }
      case 'fitness': {
        // rooftop running track
        b.box(0, H + 0.5, 0, w - 2, 0.05, d - 2, '#b4553e', 'matte')
        b.box(0, H + 0.55, 0, w - 7, 0.02, d - 7, '#5b8a3a', 'matte')
        // outdoor training area
        for (let i = 0; i < 3; i++) {
          b.box(w / 2 + 6, 0, -d / 4 + i * 6, 0.12, 2.6, 0.12, C.black, 'metal', { col: true })
          b.box(w / 2 + 8, 0, -d / 4 + i * 6, 0.12, 2.6, 0.12, C.black, 'metal', { col: true })
          b.cylX(w / 2 + 7, 2.5, -d / 4 + i * 6, 0.04, 2.2, C.green, 'metal')
        }
        b.box(w / 2 + 7, 0.01, 0, 6, 0.04, 20, '#3c4a3a', 'matte')
        b.npc({ kind: 'walk', path: [[-w / 2 - 4, 0, d / 2 + 6], [w / 2 + 4, 0, d / 2 + 6], [w / 2 + 4, 0, -d / 2 - 6], [-w / 2 - 4, 0, -d / 2 - 6]], loop: true, speed: 3.0 })
        break
      }
      case 'logistics': {
        // loading docks at the back + trucks
        for (let i = 0; i < 4; i++) {
          const x = -w / 2 + 8 + i * 12
          b.box(x, 0, -d / 2 - 0.05, 4, 4.2, 0.1, '#7d8582', 'metal')
          b.box(x, 4.2, -d / 2 - 1.5, 5, 0.25, 3, C.anthracite, 'metal')
          if (i % 2 === 0) truck(b, x, -d / 2 - 9, 0)
        }
        b.box(0, 0.01, -d / 2 - 10, w, 0.02, 18, '#4a4c4e', 'matte')
        b.sign(-w / 2 + 6, 5.6, -d / 2 - 0.2, 6, 0.8, textTexture(['Anlieferung · Dock 1–4'], { w: 512, h: 72, accent: C.green }), Math.PI)
        break
      }
      case 'mobility': {
        // cantilevered upper volume over the forecourt
        b.box(0, H - fh, d / 2 + 4, w * 0.6, fh, 8, C.white, 'satin')
        b.box(0, H - fh + 1.0, d / 2 + 8.02, w * 0.6 - 1, 2.0, 0.05, C.glassDark, 'facade')
        b.box(0, H - fh - 0.1, d / 2 + 4, w * 0.6, 0.12, 8, C.green, 'emissive')
        // mobility station
        b.at(w / 2 + 9, 0, d / 2 + 4, -Math.PI / 2, () => {
          b.box(0, 3.0, 0, 14, 0.25, 4, C.black, 'satin')
          for (const s of [-6.5, 6.5]) b.box(s, 0, -1.6, 0.15, 3.0, 0.15, C.black, 'metal', { col: true })
          b.sign(0, 3.6, 2.05, 6, 0.8, textTexture(['Mobilitätsstation', 'E-Bikes · E-Scooter · Laden'], { w: 512, h: 96, accent: C.green }))
          for (let i = 0; i < 8; i++) K.bike(b, -5.5 + i * 1.0, 0, 0, Math.PI / 2, i % 2 ? C.green : C.black, true)
          for (let i = 0; i < 4; i++) K.scooter(b, 3 + i * 0.8, 0, 1.2, Math.PI / 2)
          K.chargingStation(b, -6, 1.5, 0)
          K.chargingStation(b, 6, 1.5, 0)
        })
        infoPoint(b, w / 2 + 6, 1.3, d / 2 + 4, 'Mobilitätsstation', ['E-Bikes und E-Scooter in Apple Green und Schwarz.', 'Ausleihe per Big Apple App (in dieser Simulation nicht buchbar).', 'Ladeplätze für Mitarbeiterfahrzeuge im Parkhaus.'], { suffix: 'Mobility' })
        // presentation area with vehicles
        for (let i = 0; i < 3; i++) {
          K.displayPlinth(b, -w / 2 + 6 + i * 6, 0, d / 2 + 10, 0, 5, 2.6, 0.15)
          K.car(b, -w / 2 + 6 + i * 6, 0.15, d / 2 + 10, Math.PI / 2, i === 1 ? C.green : i === 0 ? C.white : C.black)
        }
        break
      }
      case 'hotels': {
        b.box(0, 0, d / 2 + 0.6, w - 4, 0.6, 0.8, C.anthracite, 'satin')
        for (let i = 0; i < 4; i++) K.tree(b, -w / 2 + 4 + i * ((w - 8) / 3), d / 2 + 6, 0.7, 0, i)
        break
      }
      case 'holidays': {
        // stepped terraces with planters on the front
        for (let k = 1; k < c.visitN + 2 && k < Math.round(H / fh); k++) {
          const y = k * fh
          b.box(0, y - 0.2, d / 2 + 1.5, w - 2, 0.25, 3, C.white, 'satin')
          b.box(0, y + 0.05, d / 2 + 2.9, w - 2, 0.5, 0.25, C.woodLight, 'satin')
          for (let i = 0; i < 8; i++) b.ico(-w / 2 + 3 + i * ((w - 6) / 7), y + 0.6, d / 2 + 2.6, 0.45, '#4a7d36', 'matte', 0.8)
        }
        // travel globe sculpture
        b.cyl(-w / 2 - 6, 0, d / 2 + 6, 0.5, 1.4, C.white, 'gloss', { col: true })
        b.sphere(-w / 2 - 6, 2.6, d / 2 + 6, 1.2, '#3a7fb0', 'gloss', 1, 20)
        b.cyl(-w / 2 - 6, 2.55, d / 2 + 6, 1.3, 0.06, C.green, 'emissive', { segs: 32 })
        break
      }
      case 'entertainment': {
        // giant media façade
        b.box(0, 5, d / 2 + 0.3, w - 6, H - 7, 0.2, C.black, 'gloss')
        b.screen({ id: 'ent-media', lx: 0, ly: 5.2, lz: d / 2 + 0.42, w: w - 7, h: H - 7.4, slides: [
          { title: 'BIG APPLE ENTERTAINMENT', lines: ['Neu: „Canals of Amsterdam“', 'Premiere heute 20:00 im Präsentationskino'], kind: 'event' },
          { title: 'CAMPUS NIGHTS', lines: ['Die neue Serie', 'Staffel 1 · jetzt streamen'], kind: 'event' },
          { title: 'STUDIOS', lines: ['Film · Serie · Podcast · Live'], kind: 'event' },
        ], suffix: 'Entertainment' })
        // red carpet
        b.box(0, 0.01, d / 2 + 6, 3, 0.02, 10, '#8c1d24', 'matte')
        for (const s of [-1, 1]) for (let i = 0; i < 4; i++) b.cyl(s * 2, 0, d / 2 + 2 + i * 2.6, 0.08, 1.0, '#c7a14a', 'metal', { segs: 8, col: true })
        break
      }
      case 'trains': {
        // barrel (vaulted) roof like a station hall, glass gables and a green stripe
        const r = d / 2 + 0.3
        b.barrel(0, H + 0.4, 0, r, w + 0.6, C.white, 'satin', 0, 32, 0.4)
        b.barrel(0, H + 0.42, 0, r + 0.05, 1.2, C.green, 'satin', 0, 32, 0.4)
        for (const ez of [-1, 1]) {
          for (let i = 0; i < 16; i++) {
            const z0 = -r + (i + 0.5) * ((2 * r) / 16)
            const hh = Math.sqrt(Math.max(0, r * r - z0 * z0)) * 0.4
            b.box(ez * (w / 2 + 0.2), H + 0.4, z0, 0.06, hh, (2 * r) / 16, C.glassTint, 'facade')
          }
        }
        // full-size train nose on the forecourt
        b.at(-w / 2 - 6, 0, d / 2 + 8, 0.4, () => {
          b.box(0, 0.6, 0, 3.0, 3.4, 8, C.white, 'gloss', { col: true })
          b.box(0, 1.9, 4.2, 2.9, 1.0, 0.5, C.black, 'gloss')
          b.box(0, 1.0, 0, 3.02, 0.25, 8.02, C.green, 'satin')
          b.box(0, 0, 0, 2.6, 0.6, 8, C.anthracite, 'metal')
          b.box(0, 0, 0, 5, 0.15, 12, '#6b6b66', 'matte')
        })
        infoPoint(b, -w / 2 - 3, 1.3, d / 2 + 11, 'Big Apple Trains – „Amstel“', ['Originalgroßer Kopf des neuen Hochgeschwindigkeitszugs.', 'Weiß/Schwarz mit Apple-Green-Linie.'], { suffix: 'Trains' })
        break
      }
      case 'foundation': {
        // green roof, garden
        b.box(0, H + 0.5, 0, w - 1, 0.25, d - 1, '#5e8a3a', 'matte')
        for (let i = 0; i < 6; i++) K.tree(b, -w / 2 - 5 + (i % 3) * 3, d / 2 + 4 + Math.floor(i / 3) * 6, 0.8, 0, i)
        for (let i = 0; i < 3; i++) K.bench(b, w / 2 + 3, 0, d / 2 + 4 + i * 4, -Math.PI / 2)
        break
      }
    }
  }
}

let _checker: ReturnType<typeof canvasTex> | null = null
function checker() {
  if (!_checker) {
    _checker = canvasTex(512, 52, (g) => {
      for (let x = 0; x < 20; x++) for (let y = 0; y < 2; y++) {
        g.fillStyle = (x + y) % 2 ? '#111312' : '#f4f5f2'
        g.fillRect(x * 26, y * 26, 26, 26)
      }
    })
  }
  return _checker
}

function truck(b: WorldBuilder, x: number, z: number, rot: number) {
  b.at(x, 0, z, rot, () => {
    b.box(0, 0.9, -1.5, 2.5, 3.2, 9, C.white, 'satin')
    b.sign(0, 2.5, -1.5 + 4.52, 2.3, 0.6, textTexture(['Big Apple Logistics'], { w: 512, h: 128, bg: '#ffffff' }))
    b.box(0, 0.9, 4.3, 2.4, 2.4, 2.6, C.black, 'gloss')
    b.box(0, 2.0, 5.61, 2.2, 1.0, 0.02, '#2a3a44', 'gloss')
    for (const sx of [-1.1, 1.1]) for (const sz of [-4, -2.5, 4]) b.cylX(sx, 0.5, sz, 0.5, 0.35, '#151515', 'matte')
  })
  b.colBox(x, 0, z, 2.6, 4.2, 13.5, rot)
}

export function buildSubsidiaries(b: WorldBuilder) {
  for (const info of BUILDINGS) {
    if (info.kind !== 'subsidiary' || !info.style) continue
    const visit = PROGRAMS[info.id]
    if (!visit) continue
    buildGeneric(b, {
      info: info as BuildingInfo,
      style: info.style,
      visit,
      logoSuffix: info.suffix,
      extras: extras(info.style),
      roofDeck: info.id === 'holidays' || info.id === 'tech',
    })
  }
}
