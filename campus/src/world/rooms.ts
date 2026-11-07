/**
 * Interior programs. A room is furnished in a local frame: origin = room centre
 * on the floor, door side = -z, window / back side = +z, width along x.
 */
import { WorldBuilder } from '../engine/builder'
import { C, logoTexture, textTexture } from '../engine/materials'
import * as K from './kits'
import { infoPoint, seat } from './dynamic'

type B = WorldBuilder

let seed = 1337
export function rand() {
  seed = (seed + 0x6d2b79f5) | 0
  let t = seed
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function sitter(b: B, x: number, y: number, z: number, yaw: number, p = 0.5) {
  if (rand() < p) b.npc({ kind: 'sit', x, y, z, yaw })
}
function stander(b: B, x: number, y: number, z: number, yaw: number, p = 1) {
  if (rand() < p) b.npc({ kind: 'stand', x, y, z, yaw })
}

export type RoomKind =
  | 'office' | 'exec' | 'chairman' | 'board' | 'conference' | 'bigconference' | 'openoffice' | 'lounge'
  | 'strategy' | 'legal' | 'tech' | 'servers' | 'canteen' | 'cafe' | 'ailab' | 'creative' | 'demo'
  | 'presentation' | 'market' | 'clientlounge' | 'cardio' | 'strength' | 'group' | 'personal'
  | 'recovery' | 'lockers' | 'control' | 'showroom' | 'devlab' | 'hotelmodel' | 'sampleroom'
  | 'travel' | 'digitaltravel' | 'tavium' | 'cinema' | 'studio' | 'editing' | 'traindesign'
  | 'trainmodel' | 'exhibition' | 'event' | 'projects' | 'restaurant' | 'bar' | 'hotelroom'
  | 'press' | 'reception' | 'empty' | 'auditorium' | 'f1showroom' | 'simulators' | 'aero' | 'physio' | 'medical' | 'meditation'

export interface RoomCtx {
  suffix?: string
  name?: string
  y?: number // only used for screens (absolute world y comes from builder)
  screens?: { title: string; lines: string[]; kind?: 'market' | 'logistics' | 'trains' | 'travel' | 'info' | 'event' }[]
}

const P = Math.PI

export function furnish(b: B, kind: RoomKind, w: number, d: number, ctx: RoomCtx = {}) {
  const hw = w / 2 - 1.0
  const hd = d / 2 - 1.0
  const grid = (sx: number, sz: number, fn: (x: number, z: number, i: number, j: number) => void, mx = 0, mz = 0) => {
    const nx = Math.max(1, Math.floor((w - 2 * mx - 1) / sx))
    const nz = Math.max(1, Math.floor((d - 2 * mz - 1) / sz))
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) fn((i - (nx - 1) / 2) * sx, (j - (nz - 1) / 2) * sz, i, j)
  }
  const screenWall = (z: number, title: string, lines: string[], sw = Math.min(w - 2, 5), kind?: 'market' | 'logistics' | 'trains' | 'travel' | 'info' | 'event') => {
    b.screen({
      id: `scr-${title}-${rand().toFixed(5)}`,
      lx: 0, ly: 1.4, lz: z, w: sw, h: sw * 0.5, rot: 0,
      slides: ctx.screens ?? [{ title, lines, kind }],
      suffix: ctx.suffix,
    })
    b.box(0, 1.3, z - 0.06, sw + 0.12, sw * 0.5 + 0.12, 0.08, C.black, 'gloss')
    infoPoint(b, 0, 1.2, z + 1.8, title, lines, { label: `Bildschirm ansehen: ${title}`, suffix: ctx.suffix })
  }

  switch (kind) {
    case 'empty':
      break
    case 'f1showroom': {
      // the race car on a turntable plinth, tyre stacks, trophy cabinet, helmet display
      b.cyl(0, 0, 0.5, 3.6, 0.25, C.black, 'gloss', { segs: 40, col: true })
      b.arc(0, 0.2, 0.5, 3.62, 0.06, 0, Math.PI * 2, C.green, 'emissive', true, 40)
      K.formulaCar(b, 0, 0.25, 0.5, 0.6)
      K.tyreStack(b, -hw + 0.6, 0, hd - 0.6, 5)
      K.tyreStack(b, -hw + 1.4, 0, hd - 0.6, 4, '#f2d24b')
      K.tyreStack(b, hw - 0.6, 0, hd - 0.6, 5, '#e05d4b')
      // trophy cabinet
      b.box(0, 0, -hd + 0.3, Math.min(w - 4, 6), 2.2, 0.5, C.black, 'gloss', { col: true })
      for (let i = 0; i < 9; i++) {
        const tx = -2.4 + (i % 5) * 1.2 + (i > 4 ? 0.6 : 0)
        const ty = i > 4 ? 1.35 : 0.55
        b.cyl(tx, ty, -hd + 0.38, 0.12, 0.08, '#c7a14a', 'metal', { segs: 10 })
        b.cyl(tx, ty + 0.08, -hd + 0.38, 0.05, 0.22, '#c7a14a', 'metal', { segs: 8 })
        b.cyl(tx, ty + 0.3, -hd + 0.38, 0.14, 0.18, '#d9b85a', 'metal', { segs: 12 })
      }
      // helmets on stands
      for (let i = 0; i < 3; i++) {
        const hx = hw - 1.2
        const hz = -1.5 + i * 1.6
        b.box(hx, 0, hz, 0.5, 1.1, 0.5, C.white, 'gloss', { col: true })
        b.sphere(hx, 1.3, hz, 0.17, i === 1 ? C.green : C.black, 'gloss', 1, 14)
      }
      b.sign(0, 2.5, -hd + 0.06, Math.min(w - 3, 7), 0.8, logoTexture('Groups Racing', { bg: '#111312', onDark: true, w: 1024, h: 120 }), 0, 0.6)
      infoPoint(b, 2.6, 1.2, 2.8, 'BAR-01 – Formel-1-Rennwagen', [
        'Big Apple Groups Racing · Saison 2026',
        '1,6-l-V6-Turbo-Hybrid · über 1.000 PS · Mindestgewicht 798 kg',
        'Lackierung: Schwarz mit Apple Green und weißen Akzenten',
        'Heimrennen: Großer Preis der Niederlande in Zandvoort',
      ], { label: 'Rennwagen ansehen', suffix: 'Groups Racing', radius: 3 })
      stander(b, 2.4, 0, 3.4, Math.PI, 1)
      stander(b, -3, 0, -1.5, 0.8, 0.8)
      break
    }
    case 'simulators': {
      grid(2.4, 3.0, (x, z, i) => {
        K.simRig(b, x, 0, z, Math.PI)
        sitter(b, x, 0.25, z + 0.45, Math.PI, i % 2 ? 0.4 : 0.8)
      }, 0.6, 0.8)
      infoPoint(b, 0, 1.2, -hd + 1.2, 'Rennsimulatoren', ['Profi-Simulatoren mit Streckenmodellen von Zandvoort, Spa und Monza.', 'Hier trainieren Fahrer und Ingenieure Setups vor jedem Rennwochenende.', 'In dieser Campus-Version zum Anschauen – eine fahrbare Sim-Runde gibt es noch nicht.'], { label: 'Simulator-Info lesen', suffix: 'Groups Racing' })
      break
    }
    case 'aero': {
      // wind tunnel: glass test section with a 60 % model, fan housing
      b.box(0, 0, 0, Math.min(w - 3, 9), 0.5, 2.6, C.anthracite, 'metal', { col: true })
      b.box(0, 0.5, 0, Math.min(w - 3, 9), 2.0, 2.6, C.glassTint, 'glass', { col: true })
      b.at(0, 0.5, 0, Math.PI / 2, () => {
        b.at(0, 0, 0, 0, () => {
          // scaled-down model
          b.box(0, 0.05, 0, 0.45, 0.25, 1.8, '#111312', 'gloss')
          b.box(0, 0.05, 1.05, 1.1, 0.03, 0.25, C.green, 'gloss')
          b.box(0, 0.45, -1.0, 0.6, 0.04, 0.2, C.green, 'gloss')
        })
      })
      b.cylX(Math.min(w - 3, 9) / 2 + 0.8, 1.4, 0, 1.3, 1.4, C.anthracite, 'metal', 0, 20)
      b.cylX(Math.min(w - 3, 9) / 2 + 1.52, 1.4, 0, 1.0, 0.04, '#222', 'metal', 0, 20)
      K.desk(b, -1.5, 0, -hd + 1.5, 0)
      K.desk(b, 1.5, 0, -hd + 1.5, 0)
      sitter(b, -1.5, 0, -hd + 2.15, Math.PI, 0.9)
      screenWall(-hd + 0.2, 'Aerodynamik', ['Windkanal-Lauf 1.284 · 50 m/s', 'Abtrieb +3,2 % · Luftwiderstand −1,1 %'], Math.min(w - 2, 4), 'info')
      break
    }
    case 'physio': {
      grid(3.0, 3.2, (x, z, i) => {
        b.box(x, 0, z, 0.75, 0.7, 2.0, C.white, 'satin', { col: true })
        b.box(x, 0.7, z - 0.75, 0.6, 0.08, 0.35, C.fabricGreen, 'matte')
        b.box(x, 0.7, z + 0.15, 0.7, 0.02, 1.3, '#d9e2e6', 'matte')
        if (i % 2 === 0) stander(b, x + 0.75, 0, z, -Math.PI / 2, 0.8)
        seat(b, x, 0.3, z, 0, 'Auf die Liege legen')
      }, 0.8, 1.2)
      K.yogaMat(b, hw - 1, 0, -hd + 1.5, 0)
      b.cyl(hw - 1, 0, -hd + 3, 0.3, 0.6, C.green, 'satin', { segs: 16, col: true })
      K.shelf(b, -hw + 0.3, 0, -hd + 1.5, Math.PI / 2, 2, 1.8)
      K.plant(b, hw - 0.4, 0, hd - 0.4, 1.1)
      break
    }
    case 'medical': {
      b.box(-w / 4, 0, 0.5, 0.75, 0.75, 2.0, C.white, 'satin', { col: true })
      b.box(-w / 4, 0.75, -0.3, 0.7, 0.25, 0.4, C.white, 'satin')
      K.desk(b, w / 4, 0, -0.5, Math.PI)
      sitter(b, w / 4, 0, -1.15, 0, 0.9)
      b.box(-hw + 0.3, 0, -hd + 1.2, 0.6, 1.9, 1.6, C.offwhite, 'gloss', { col: true })
      b.box(-hw + 0.62, 1.2, -hd + 1.2, 0.02, 0.15, 0.15, C.green, 'emissive')
      K.chair(b, w / 4 - 0.6, 0, -1.6, 0)
      infoPoint(b, 0, 1.2, -hd + 1.5, 'Betriebsärztlicher Dienst', ['Sprechstunde Mo–Fr 8–16 Uhr · Vorsorge, Impfungen, Ergonomie-Beratung.', 'Termine über das Big Apple Mitarbeiterportal (in dieser Simulation nicht buchbar).'], { label: 'Sprechzeiten lesen', suffix: 'Health' })
      break
    }
    case 'meditation': {
      K.rug(b, 0, 0, 0, w - 2.5, d - 2.5, '#7a8a6e')
      grid(1.6, 1.6, (x, z, i) => {
        K.yogaMat(b, x, 0, z, 0, i % 3 ? '#8aa07a' : C.green)
        b.cyl(x, 0, z - 0.6, 0.25, 0.15, '#4a4d49', 'matte', { segs: 12 })
        if (i % 4 === 0) b.npc({ kind: 'sit', x, y: -0.3, z: z - 0.6, yaw: Math.PI })
      }, 1, 1)
      for (let i = 0; i < 4; i++) K.plant(b, (i % 2 ? 1 : -1) * hw, 0, (i < 2 ? 1 : -1) * hd, 1.3)
      b.box(0, 0.4, -hd + 0.1, Math.min(w - 2, 5), 2.0, 0.06, '#3f6e2f', 'matte') // moss wall
      break
    }
    case 'auditorium': {
      // stage at +z (façade side), raked seating rising towards the door side
      const sw = Math.min(w - 4, 22)
      b.box(0, 0, hd - 2, sw, 1.0, 4.5, C.anthracite, 'satin', { col: true })
      b.box(0, 1.0, hd - 4.2, sw, 0.04, 0.06, C.green, 'emissive')
      b.box(-sw / 4, 1.0, hd - 2.5, 0.7, 1.15, 0.5, C.white, 'gloss', { col: true, rot: Math.PI })
      b.sign(-sw / 4, 1.8, hd - 2.77, 0.65, 0.16, logoTexture(ctx.suffix ?? 'Groups', { bg: '#ffffff', w: 512, h: 128 }), Math.PI)
      b.box(0, 1.0, hd + 0.1, sw + 0.4, 5.4, 0.1, C.black, 'gloss')
      b.screen({ id: 'aud-main', lx: 0, ly: 1.4, lz: hd - 0.02, w: sw - 1, h: 4.6, rot: Math.PI, slides: [
        { title: 'BIG APPLE INNOVATION WEEK 2026', lines: ['Keynote: „Connected Journeys“', 'Auditorium · Amsterdam · 10:00 Uhr'], kind: 'event' },
        { title: 'PROGRAMM', lines: ['10:00 Keynote Chairman · 11:30 Tech & AI', '14:00 Mobility & Trains · 16:00 Travel & Hotels'], kind: 'event' },
        { title: 'LIVE', lines: ['Weltweit gestreamt in 42 Länder', '#BigAppleInnovationWeek'], kind: 'event' },
      ] })
      const per = Math.min(34, Math.floor((w - 5) / 0.62))
      const rows = Math.min(24, Math.floor((d - 10) / 1.0))
      K.cinemaSeats(b, 0, 0, hd - 7, rows, per, 0, 0.18, C.fabricGreen)
      for (let i = 0; i < rows * per * 0.22; i++) {
        const r = Math.floor(rand() * rows)
        const s = Math.floor(rand() * per)
        b.npc({ kind: 'sit', x: (s - (per - 1) / 2) * 0.62, y: r * 0.18, z: hd - 7 - r + 0.05, yaw: 0 })
      }
      stander(b, -sw / 4, 1.0, hd - 3.2, Math.PI, 1)
      infoPoint(b, 0, 1.2, hd - 7 - rows - 1, 'Auditorium', [`${rows * per} Sitzplätze · Bühne mit LED-Wand`, 'Heute: Big Apple Innovation Week 2026 – Keynote „Connected Journeys“', 'Simultanübersetzung: EN · NL · DE · ZH'], { label: 'Programm Innovation Week ansehen' })
      break
    }
    case 'office': {
      K.desk(b, 0, 0, hd - 1.2, P, { w: 1.8 })
      sitter(b, 0, 0, hd - 1.85, 0, 0.6)
      K.chair(b, -0.5, 0, hd - 2.4, P)
      K.chair(b, 0.5, 0, hd - 2.4, P)
      K.shelf(b, -hw + 0.3, 0, 0, P / 2, 2.2, 2)
      K.plant(b, hw - 0.3, 0, hd - 0.3, 1)
      if (d > 7) K.meetingTable(b, 0, 0, -hd + 2, 0, { len: 1.6, wid: 1, seats: 2 })
      break
    }
    case 'exec': {
      K.rug(b, 0, 0, 0, Math.min(w - 2, 6), Math.min(d - 2, 7), '#4a4d49')
      b.box(0, 0, hd - 1.6, 2.4, 0.76, 1.0, '#3a2a1e', 'gloss', { col: true })
      K.officeChair(b, 0, 0, hd - 0.7, P, C.leather)
      sitter(b, 0, 0, hd - 0.7, P, 0.7)
      b.box(0.6, 0.76, hd - 1.8, 0.62, 0.4, 0.03, C.black, 'gloss')
      K.chair(b, -0.55, 0, hd - 2.7, 0, C.leather)
      K.chair(b, 0.55, 0, hd - 2.7, 0, C.leather)
      K.sofa(b, -hw + 0.6, 0, -1, P / 2, 2.2, C.leather)
      K.coffeeTable(b, -hw + 2, 0, -1, 0.45)
      K.shelf(b, hw - 0.3, 0, 0, -P / 2, 2.6, 2.1)
      K.plant(b, hw - 0.4, 0, hd - 0.4, 1.2)
      break
    }
    case 'chairman': {
      K.rug(b, 0, 0, 0, w - 2.5, d - 2.5, '#3d403c')
      b.box(0, 0, hd - 1.8, 3.0, 0.78, 1.1, '#2b1f17', 'gloss', { col: true })
      b.box(0, 0.78, hd - 1.8, 3.1, 0.03, 1.2, C.black, 'gloss')
      K.officeChair(b, 0, 0, hd - 0.8, P, C.leather)
      sitter(b, 0, 0, hd - 0.8, P, 0.8)
      K.loungeSet(b, -hw + 2.6, 0, -hd + 3, 0, C.leather)
      K.meetingTable(b, hw - 2.6, 0, -hd + 2.8, 0, { len: 2.6, wid: 1.2, seats: 3, top: '#2b1f17' })
      K.shelf(b, 0, 0, -hd + 0.2, 0, 3.2, 2.2)
      K.plant(b, -hw + 0.5, 0, hd - 0.5, 1.4)
      K.plant(b, hw - 0.5, 0, hd - 0.5, 1.4)
      b.sign(0, 2.2, -hd + 0.45, 2.4, 0.6, logoTexture('Groups', { bg: '#ffffff' }), 0)
      break
    }
    case 'board': {
      const len = Math.min(w - 3.5, 9)
      K.meetingTable(b, 0, 0, 0.3, 0, { len, wid: 2.2, seats: Math.floor(len / 0.9), top: '#3a2a1e', chairColor: C.leather, oval: true })
      for (let i = 0; i < Math.floor(len / 0.9); i += 2) sitter(b, (i - (Math.floor(len / 0.9) - 1) / 2) * ((len - 0.6) / Math.max(1, Math.floor(len / 0.9) - 1)), 0, 0.3 + 1.45, P, 0.5)
      screenWall(-hd + 0.3, 'Vorstandssitzung', ['Q3 Konzernbericht', 'Umsatz +12,4 % ggü. Vorjahr', 'Strategie 2030: Expansion Asien & Nordamerika'], Math.min(w - 3, 5.5), 'info')
      K.plant(b, -hw + 0.4, 0, hd - 0.4, 1.3)
      K.plant(b, hw - 0.4, 0, hd - 0.4, 1.3)
      break
    }
    case 'conference': {
      const len = Math.min(w - 3, 5)
      K.meetingTable(b, 0, 0, 0.4, 0, { len, wid: 1.3, seats: Math.max(2, Math.floor(len / 0.85)) })
      sitter(b, -0.8, 0, 0.4 + 1.0, P, 0.7)
      sitter(b, 0.8, 0, 0.4 - 1.0, 0, 0.6)
      screenWall(-hd + 0.2, ctx.name ?? 'Besprechung', ['Agenda', '1. Status Projekte', '2. Budget', '3. Nächste Schritte'], Math.min(w - 2, 3.4))
      K.plant(b, hw - 0.3, 0, hd - 0.3, 0.9)
      break
    }
    case 'bigconference': {
      const len = Math.min(w - 4, 12)
      K.meetingTable(b, 0, 0, 0.5, 0, { len, wid: 2.6, seats: Math.floor(len / 0.85), top: C.white })
      for (let i = 0; i < 6; i++) sitter(b, -len / 2 + 1 + i * (len / 6), 0, 0.5 + 1.65, P, 0.6)
      screenWall(-hd + 0.3, 'Großer Konferenzraum', ['Big Apple Groups', 'Global Leadership Meeting', 'Amsterdam · New York · Singapur'], Math.min(w - 3, 7), 'event')
      break
    }
    case 'openoffice': {
      grid(4.2, 3.6, (x, z, i, j) => {
        K.deskCluster(b, x, 0, z, 0, 2)
        if ((i + j) % 2 === 0) sitter(b, x - 0.82, 0, z + 1.07, P, 0.7)
        if ((i + j) % 3 === 0) sitter(b, x + 0.82, 0, z - 1.07, 0, 0.7)
      }, 0.5, 0.8)
      K.plant(b, -hw, 0, hd, 1.1)
      K.plant(b, hw, 0, -hd, 1.1)
      break
    }
    case 'lounge':
    case 'clientlounge': {
      K.loungeSet(b, -w / 4, 0, 0, 0.3, kind === 'clientlounge' ? C.leather : C.fabricGrey)
      if (w > 9) K.loungeSet(b, w / 4, 0, 0.5, -0.3, C.fabricGreen)
      // coffee bar
      b.box(0, 0, -hd + 0.6, Math.min(w - 3, 5), 1.05, 0.7, C.wood, 'satin', { col: true })
      b.box(0, 1.05, -hd + 0.6, Math.min(w - 3, 5) + 0.1, 0.04, 0.8, C.white, 'gloss')
      b.box(-1, 1.09, -hd + 0.55, 0.4, 0.45, 0.35, C.anthracite, 'metal')
      stander(b, 0.8, 0, -hd + 1.6, P, 0.7)
      K.plant(b, hw, 0, hd, 1.3)
      K.plant(b, -hw, 0, hd, 1.1)
      break
    }
    case 'strategy': {
      for (let i = -1; i <= 1; i++) {
        b.box(i * 2.4, 0, 0, 0.9, 1.05, 0.9, C.white, 'gloss', { col: true })
        stander(b, i * 2.4, 0, 0.9, P, 0.6)
      }
      b.box(-hw + 0.1, 0.8, 0, 0.06, 1.3, Math.min(d - 3, 5), '#f7f7f5', 'gloss') // whiteboard
      for (let i = 0; i < 6; i++) b.box(-hw + 0.14, 1.0 + (i % 3) * 0.35, -1.6 + i * 0.6, 0.01, 0.2, 0.2, [C.green, '#f2d24b', '#f29b4b'][i % 3], 'matte')
      screenWall(-hd + 0.25, 'Strategie 2030', ['Wachstumsfelder', 'Mobility · Travel · Finance', 'Marktanalyse & Szenarien'], Math.min(w - 2, 4.5), 'info')
      break
    }
    case 'legal': {
      for (let i = 0; i < 3; i++) K.shelf(b, -hw + 1.5 + i * 2.4, 0, hd - 0.3, P, 2.2, 2.2)
      K.meetingTable(b, 0, 0, -0.5, 0, { len: 3.2, wid: 1.2, seats: 4, top: '#3a2a1e' })
      sitter(b, -0.5, 0, -0.5 + 0.95, P, 0.6)
      K.desk(b, hw - 1.2, 0, -hd + 1.2, P / 2)
      break
    }
    case 'tech': {
      grid(4.2, 3.6, (x, z, i, j) => {
        K.deskCluster(b, x, 0, z, 0, 2)
        b.box(x - 0.82, 0.76, z - 0.7, 0.55, 0.32, 0.03, C.black, 'gloss')
        if ((i + j) % 2 === 0) sitter(b, x - 0.82, 0, z + 1.07, P, 0.8)
        sitter(b, x + 0.82, 0, z - 1.07, 0, 0.4)
      }, 0.5, 0.8)
      break
    }
    case 'servers': {
      for (let i = 0; i < Math.floor((w - 3) / 0.62); i++) {
        K.serverRack(b, -hw + 0.8 + i * 0.62, 0, hd - 1, P)
        if (d > 6) K.serverRack(b, -hw + 0.8 + i * 0.62, 0, hd - 3.2, 0)
      }
      screenWall(-hd + 0.3, 'Network Operations Center', ['Systemstatus: alle Dienste online', 'Latenz Amsterdam ↔ New York 71 ms', 'Rechenzentren: AMS · FRA · NYC · SIN'], Math.min(w - 2, 5), 'logistics')
      K.desk(b, -1, 0, -hd + 2.6, P)
      K.desk(b, 1, 0, -hd + 2.6, P)
      sitter(b, -1, 0, -hd + 1.95, 0, 0.9)
      break
    }
    case 'canteen':
    case 'restaurant':
    case 'cafe': {
      const top = kind === 'restaurant' ? C.white : C.woodLight
      grid(3.0, 2.8, (x, z, i, j) => {
        K.meetingTable(b, x, 0, z, 0, { len: 1.6, wid: 0.9, seats: 2, top })
        sitter(b, x - 0.5, 0, z + 0.8, P, 0.55)
        sitter(b, x + 0.5, 0, z - 0.8, 0, 0.45)
        if ((i + j) % 4 === 0) K.plant(b, x + 1.3, 0, z, 0.6)
      }, 0.6, 1.4)
      // food counter
      b.box(0, 0, -hd + 0.2, Math.min(w - 2, 8), 1.0, 0.8, C.white, 'gloss', { col: true })
      b.box(0, 1.0, -hd + 0.2, Math.min(w - 2, 8), 0.4, 0.8, C.glassTint, 'glass')
      b.box(0, 0.15, -hd + 0.61, Math.min(w - 2, 8), 0.05, 0.02, C.green, 'emissive')
      stander(b, -1.5, 0, -hd - 0.7, 0, 0.8)
      stander(b, 1.2, 0, -hd + 1.3, P, 0.8)
      break
    }
    case 'bar': {
      b.box(0, 0, -hd + 1.2, Math.min(w - 2, 7), 1.1, 0.7, '#1d1f1e', 'gloss', { col: true })
      b.box(0, 1.1, -hd + 1.2, Math.min(w - 2, 7) + 0.2, 0.05, 0.9, C.wood, 'gloss')
      b.box(0, 0.1, -hd + 1.56, Math.min(w - 2, 7), 0.04, 0.02, C.green, 'emissive')
      b.box(0, 1.2, -hd + 0.15, Math.min(w - 2, 7), 1.2, 0.3, C.anthracite, 'metal')
      for (let i = 0; i < 12; i++) b.cyl(-2.5 + i * 0.45, 1.5 + (i % 2) * 0.5, -hd + 0.2, 0.05, 0.3, ['#3d6b3a', '#7a2b2b', '#c7a14a'][i % 3], 'gloss', { segs: 8 })
      for (let i = 0; i < 6; i++) {
        const x = -2.5 + i
        b.cyl(x, 0, -hd + 2.1, 0.2, 0.75, C.leather, 'satin', { segs: 10 })
        sitter(b, x, 0.3, -hd + 2.1, P, 0.4)
      }
      K.loungeSet(b, 0, 0, hd - 2.5, P, C.leather)
      break
    }
    case 'ailab': {
      for (let i = -1; i <= 1; i++) K.robotArm(b, i * 3, 0, 1.5, P)
      K.serverRack(b, hw - 0.4, 0, hd - 1, -P / 2)
      K.serverRack(b, hw - 0.4, 0, hd - 1.7, -P / 2)
      // glowing AI core sphere
      b.cyl(0, 0, -1.2, 0.7, 0.9, C.white, 'gloss', { col: true, segs: 24 })
      b.sphere(0, 1.45, -1.2, 0.5, C.green, 'emissive', 1, 20)
      screenWall(-hd + 0.2, 'KI-Labor', ['Big Apple AI Research', 'Modelle für Reisen, Mobilität & Finanzen', 'Live-Demo: Sprachassistent Tavium'], Math.min(w - 2, 4.5), 'travel')
      sitter(b, -2, 0, -hd + 2, P, 0.5)
      K.desk(b, -2, 0, -hd + 2.8, 0, { chair: true })
      break
    }
    case 'creative': {
      K.loungeSet(b, -w / 4, 0, 1, 0, C.fabricGreen)
      b.box(w / 4, 0, 0, 2.6, 0.9, 1.4, C.woodLight, 'satin', { col: true })
      for (let i = 0; i < 4; i++) K.chair(b, w / 4 - 0.9 + i * 0.6, 0, 1.1, P, ['#e05d3a', C.green, '#f2d24b', '#3a8ee0'][i])
      b.box(0, 0.6, -hd + 0.2, Math.min(w - 2, 6), 1.8, 0.05, '#f6f6f2', 'gloss')
      for (let i = 0; i < 14; i++) b.box(-2.5 + (i % 7) * 0.8, 0.9 + Math.floor(i / 7) * 0.7, -hd + 0.24, 0.5, 0.4, 0.01, ['#f2d24b', C.green, '#f29b4b', '#7fd3f2'][i % 4], 'matte')
      sitter(b, w / 4 - 0.3, 0, 1.1, P, 0.8)
      break
    }
    case 'demo':
    case 'presentation':
    case 'press':
    case 'event': {
      const rows = Math.max(2, Math.floor((d - 6) / 1.1))
      const per = Math.max(4, Math.floor((w - 3) / 0.62))
      // stage at -z
      b.box(0, 0, -hd + 1.2, Math.min(w - 2, 8), 0.4, 2.4, C.anthracite, 'satin', { col: true })
      b.box(0, 0.4, -hd + 2.35, Math.min(w - 2, 8), 0.03, 0.05, C.green, 'emissive')
      b.box(1.5, 0.4, -hd + 1.4, 0.6, 1.1, 0.5, C.white, 'gloss', { col: true }) // lectern
      b.sign(1.5, 1.15, -hd + 1.66, 0.55, 0.14, logoTexture(ctx.suffix ?? 'Groups', { bg: '#ffffff', w: 512, h: 128 }), 0)
      screenWall(-hd + 0.2, ctx.name ?? 'Präsentation', ctx.screens?.[0]?.lines ?? ['Big Apple Groups', 'Willkommen'], Math.min(w - 2, 6), 'event')
      for (let r = 0; r < rows; r++)
        for (let i = 0; i < per; i++) {
          const x = (i - (per - 1) / 2) * 0.62
          const z = -hd + 4 + r * 1.1
          K.chair(b, x, 0, z, P, kind === 'press' ? C.anthracite : C.fabricGreen)
          if (rand() < 0.25) b.npc({ kind: 'sit', x, y: 0, z, yaw: P })
        }
      break
    }
    case 'market': {
      grid(4.4, 3.6, (x, z, i, j) => {
        K.deskCluster(b, x, 0, z, 0, 2)
        for (const s of [-0.82, 0.82]) {
          b.box(x + s - 0.35, 0.76, z - 0.75, 0.5, 0.32, 0.03, C.black, 'gloss')
          b.box(x + s + 0.35, 0.76, z - 0.75, 0.5, 0.32, 0.03, C.black, 'gloss')
        }
        if ((i + j) % 2 === 0) sitter(b, x - 0.82, 0, z + 1.07, P, 0.8)
      }, 0.5, 1.5)
      screenWall(-hd + 0.25, 'Marktanalyse', ['AEX 912,4 ▲ 0,8 %', 'DAX 19.284 ▲ 0,4 %', 'EUR/USD 1,0874'], Math.min(w - 2, 6), 'market')
      break
    }
    case 'cardio': {
      grid(1.4, 3.0, (x, z, i) => {
        if (i % 2) K.treadmill(b, x, 0, z, P)
        else K.spinBike(b, x, 0, z, P)
        if (rand() < 0.4) stander(b, x, i % 2 ? 0.25 : 0.4, z, P)
      }, 0.5, 0.6)
      break
    }
    case 'strength': {
      grid(3.4, 3.2, (x, z) => K.weightRack(b, x, 0, z, 0), 0.8, 1.2)
      K.dumbbellRack(b, 0, 0, -hd + 0.3, 0)
      stander(b, 1, 0, -hd + 1.2, 0, 1)
      b.box(0, 0.4, hd - 0.05, Math.min(w - 1, 10), 2, 0.03, '#d9e2e6', 'gloss') // mirror
      break
    }
    case 'group': {
      grid(1.4, 2.4, (x, z) => {
        K.yogaMat(b, x, 0, z, 0, rand() < 0.5 ? C.green : '#3b403d')
        if (rand() < 0.35) stander(b, x, 0, z, P)
      }, 0.6, 1.2)
      b.box(0, 0.3, -hd + 0.05, Math.min(w - 1, 10), 2.4, 0.03, '#d9e2e6', 'gloss')
      break
    }
    case 'personal': {
      K.weightRack(b, -w / 4, 0, 0.5, 0)
      K.treadmill(b, w / 4, 0, 0.8, P)
      K.yogaMat(b, 0, 0, -1, P / 2)
      stander(b, 0.6, 0, -1, P / 2, 1)
      stander(b, -0.6, 0, -1, -P / 2, 1)
      break
    }
    case 'recovery': {
      for (let i = 0; i < 4; i++) {
        const x = -hw + 1 + i * 1.6
        b.box(x, 0, 1, 0.8, 0.4, 2.0, C.white, 'satin', { col: true })
        b.box(x, 0.4, 0.4, 0.75, 0.45, 0.6, C.white, 'satin')
        seat(b, x, 0, 1, 0, 'Entspannen (Liege)')
      }
      // sauna cabin
      b.box(hw - 1.6, 0, -hd + 1.6, 3, 2.3, 2.6, '#b07a4a', 'satin', { col: true })
      b.box(hw - 1.6, 0.2, -hd + 2.92, 0.9, 1.9, 0.03, C.glassTint, 'glass')
      b.sign(hw - 1.6, 2.45, -hd + 2.95, 1.2, 0.3, textTexture(['Sauna'], { bg: C.black, w: 256, h: 64 }))
      K.plant(b, -hw, 0, -hd, 1.2)
      break
    }
    case 'lockers': {
      K.lockers(b, 0, 0, hd - 0.4, P, Math.floor((w - 2) / 0.5))
      K.lockers(b, 0, 0, -hd + 0.4, 0, Math.floor((w - 4) / 0.5))
      b.sign(0, 2.2, 0, 1.6, 0.4, textTexture(['Umkleiden'], { bg: C.black, w: 256, h: 64, accent: C.green }), 0, 0.35, true)
      break
    }
    case 'control': {
      for (let r = 0; r < 2; r++) {
        const z = -0.5 + r * 2.6
        b.box(0, 0, z, Math.min(w - 3, 8), 0.75, 0.9, C.anthracite, 'satin', { col: true })
        for (let i = 0; i < Math.floor((w - 3) / 1.3); i++) {
          const x = (i - (Math.floor((w - 3) / 1.3) - 1) / 2) * 1.3
          b.box(x, 0.75, z - 0.3, 0.6, 0.38, 0.03, C.black, 'gloss')
          b.box(x, 0.79, z - 0.28, 0.56, 0.32, 0.005, '#2c5a4b', 'emissive')
          K.officeChair(b, x, 0, z + 0.75, P)
          sitter(b, x, 0, z + 0.75, P, 0.6)
        }
      }
      screenWall(-hd + 0.2, ctx.name ?? 'Leitstelle', ctx.screens?.[0]?.lines ?? ['Live-Lagebild'], Math.min(w - 1.5, 9), ctx.screens?.[0]?.kind ?? 'logistics')
      break
    }
    case 'showroom': {
      // vehicles on plinths
      K.displayPlinth(b, -w / 4, 0, 0, 0, 5.2, 2.6, 0.2)
      K.car(b, -w / 4, 0.2, 0, P / 2, C.white)
      K.displayPlinth(b, w / 4, 0, 0.5, 0, 2.2, 2.2, 0.3)
      K.bike(b, w / 4 - 0.3, 0.3, 0.5, 0.3, C.green, true)
      K.scooter(b, w / 4 + 0.6, 0.3, 0.8, -0.5)
      infoPoint(b, -w / 4, 1.2, 2.2, 'Big Apple Mobility – City EV', ['Vollelektrisches Stadtfahrzeug', 'Reichweite 420 km · Laden 10–80 % in 18 min', 'Farben: Apple Green / Schwarz / Weiß'], { suffix: 'Mobility' })
      infoPoint(b, w / 4, 1.0, 2.0, 'E-Bike & E-Scooter', ['Big Apple E-Bike: 25 km/h, 110 km Reichweite', 'E-Scooter: Sharing auf dem Campus', 'Ausleihe an der Mobilitätsstation'], { suffix: 'Mobility' })
      break
    }
    case 'devlab': {
      grid(3.6, 3.0, (x, z, i) => {
        b.box(x, 0, z, 2.4, 0.9, 1.0, C.offwhite, 'satin', { col: true })
        b.box(x - 0.6, 0.9, z, 0.6, 0.3, 0.4, C.anthracite, 'metal')
        b.box(x + 0.5, 0.9, z - 0.1, 0.7, 0.05, 0.4, C.green, 'satin')
        if (i % 2 === 0) stander(b, x, 0, z + 0.9, P, 0.7)
      }, 0.6, 0.8)
      break
    }
    case 'hotelmodel':
    case 'exhibition': {
      grid(3.4, 3.4, (x, z, i, j) => {
        K.displayPlinth(b, x, 0, z, 0, 1.4, 1.4, 0.95)
        const v = (i + j) % 3
        if (kind === 'hotelmodel') {
          b.box(x, 0.95, z, 0.9, 0.35 + v * 0.2, 0.5, C.white, 'satin')
          b.box(x, 0.95, z + 0.26, 0.9, 0.35 + v * 0.2, 0.01, C.glassDark, 'gloss')
          b.ico(x + 0.5, 1.1, z + 0.4, 0.12, '#3f6e2f')
        } else {
          b.ico(x, 1.3, z, 0.35, v === 0 ? C.green : v === 1 ? C.white : C.anthracite, 'gloss')
        }
        if (rand() < 0.3) stander(b, x, 0, z + 1.4, P)
      }, 1, 1.2)
      if (ctx.screens) screenWall(-hd + 0.2, ctx.name ?? 'Ausstellung', ctx.screens[0].lines, Math.min(w - 2, 5), ctx.screens[0].kind)
      break
    }
    case 'sampleroom':
    case 'hotelroom': {
      K.bed(b, 0, 0, hd - 1.3, P)
      K.desk(b, -hw + 0.5, 0, -0.5, P / 2, { w: 1.2, monitor: false })
      K.sofa(b, hw - 0.5, 0, -0.5, -P / 2, 1.6, C.fabricGreen)
      K.rug(b, 0, 0, 0, 2.4, 1.8, '#6b6f68')
      // bathroom box
      b.box(-hw + 1.1, 0, -hd + 1.1, 2.2, 2.6, 2.2, C.offwhite, 'satin', { col: true })
      b.box(0, 1.3, -hd + 0.1, 1.2, 0.8, 0.04, C.black, 'gloss') // TV
      if (kind === 'sampleroom') infoPoint(b, 0, 1.2, 0, 'Musterzimmer „Amsterdam Suite“', ['Big Apple Hotels Standard 2026', 'Kingsize-Bett · Arbeitsplatz · Regendusche', 'Nachhaltige Materialien, Smart-Room-Steuerung'], { suffix: 'Hotels' })
      break
    }
    case 'travel': {
      grid(4.2, 3.6, (x, z, i, j) => {
        K.deskCluster(b, x, 0, z, 0, 2)
        if ((i + j) % 2 === 0) sitter(b, x - 0.82, 0, z + 1.07, P, 0.7)
      }, 0.5, 2.2)
      // globe
      b.cyl(hw - 1, 0, -hd + 1, 0.4, 0.8, C.anthracite, 'metal', { col: true })
      b.sphere(hw - 1, 1.5, -hd + 1, 0.65, '#3a7fb0', 'gloss', 1, 20)
      break
    }
    case 'digitaltravel': {
      // immersive 3-sided screen room
      b.screen({ id: 'scr-dt-' + rand(), lx: 0, ly: 0.4, lz: -hd + 0.2, w: Math.min(w - 2, 7), h: 2.8, rot: 0, slides: [
        { title: 'Digitale Reisewelt', lines: ['Bali · Kyoto · Lissabon · Reykjavík', 'Virtuelle Rundgänge in 8K'], kind: 'travel' },
        { title: 'Amsterdam → Kyoto', lines: ['Flug, Hotel & Zug in einem Paket', 'zusammengestellt von Tavium-KI'], kind: 'travel' },
      ], suffix: 'Holidays' })
      for (let i = 0; i < 3; i++) K.sofa(b, (i - 1) * 2.6, 0, 1.8, P, 2.2, C.fabricGrey)
      sitter(b, 0, 0, 1.8, P, 1)
      break
    }
    case 'tavium': {
      b.cyl(0, 0, 0, 1.2, 0.8, C.white, 'gloss', { col: true, segs: 32 })
      b.sphere(0, 1.6, 0, 0.6, C.green, 'emissive', 1, 24)
      b.cyl(0, 0.8, 0, 1.25, 0.03, C.green, 'emissive', { segs: 32 })
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * P * 2
        b.box(Math.cos(a) * 3, 0, Math.sin(a) * 3, 0.5, 1.2, 0.5, C.white, 'gloss', { col: true })
        b.box(Math.cos(a) * 3, 1.2, Math.sin(a) * 3, 0.55, 0.35, 0.03, C.black, 'gloss', { rot: -a + P / 2 })
      }
      infoPoint(b, 0, 1.3, 1.9, 'Tavium-KI', [
        'Tavium ist der KI-Reiseassistent von Big Apple Holidays.',
        'Demo: „Plane mir 5 Tage Lissabon im Mai mit Zug-Anreise.“',
        '→ Vorschlag: TGV/IC über Paris, Boutique-Hotel in Alfama, Tram-Tour, Ausflug nach Sintra.',
        'Hinweis: In dieser Campus-Simulation ist die Demo ein Info-Beispiel, keine echte KI-Anfrage.',
      ], { label: 'Tavium-KI-Demo starten', suffix: 'Holidays', radius: 2.8 })
      stander(b, 1.6, 0, 1.6, -2.3, 1)
      break
    }
    case 'cinema': {
      const rows = Math.max(3, Math.floor((d - 5) / 1.0))
      const per = Math.max(6, Math.floor((w - 3) / 0.62))
      K.cinemaSeats(b, 0, 0, hd - 1, rows, per, P, 0.32, '#7a1f2a')
      b.screen({ id: 'scr-cin-' + rand(), lx: 0, ly: 0.9, lz: -hd + 0.15, w: Math.min(w - 1.5, 9), h: Math.min(w - 1.5, 9) * 0.42, rot: 0, slides: [
        { title: 'BIG APPLE ENTERTAINMENT', lines: ['Präsentationskino', 'Jetzt: „Canals of Amsterdam“ – Trailer'], kind: 'event' },
        { title: 'Serien-Premiere', lines: ['„Campus Nights“ · Staffel 1', 'Exklusive Vorpremiere für Mitarbeitende'], kind: 'event' },
      ], suffix: 'Entertainment' })
      for (let i = 0; i < rows * per * 0.2; i++) b.npc({ kind: 'sit', x: (Math.floor(rand() * per) - (per - 1) / 2) * 0.62, y: Math.floor(rand() * rows) * 0.32, z: hd - 1 - Math.floor(rand() * rows) * 1.0, yaw: P })
      break
    }
    case 'studio': {
      b.box(0, 0, -hd + 0.2, Math.min(w - 2, 7), 3.2, 0.1, '#34b04a', 'matte') // green screen
      b.box(0, 0, -hd + 1.4, Math.min(w - 2, 7), 0.02, 2.4, '#34b04a', 'matte')
      for (const s of [-1, 1]) {
        b.cyl(s * 2.5, 0, 0.5, 0.05, 2.2, C.black, 'metal', { segs: 6 })
        b.box(s * 2.5, 2.2, 0.5, 0.6, 0.45, 0.3, C.black, 'metal')
        b.box(s * 2.5, 2.25, 0.34, 0.5, 0.35, 0.01, '#fff6dc', 'emissive')
      }
      b.box(0, 0, 2, 0.4, 1.3, 0.4, C.black, 'metal', { col: true }) // camera
      b.box(0, 1.3, 2, 0.35, 0.3, 0.6, C.black, 'metal')
      stander(b, 0, 0, -hd + 2, 0, 1)
      stander(b, 0.6, 0, 2.6, P, 1)
      break
    }
    case 'editing': {
      grid(2.6, 2.4, (x, z) => {
        K.desk(b, x, 0, z, P, { w: 1.8 })
        b.box(x - 0.45, 0.76, z + 0.25, 0.55, 0.34, 0.03, C.black, 'gloss')
        sitter(b, x, 0, z - 0.65, 0, 0.6)
      }, 0.5, 0.8)
      break
    }
    case 'traindesign': {
      for (let i = -1; i <= 1; i++) {
        const x = i * (w / 3.4)
        K.displayPlinth(b, x, 0, 0.6, 0, 2.2, 3.6, 0.3)
        b.box(x, 0.3, 0.6, 1.4, 1.4, 3.0, C.white, 'gloss')
        b.box(x, 0.95, 2.1, 1.3, 0.5, 0.05, C.black, 'gloss')
        b.box(x, 0.45, 0.6, 1.42, 0.12, 3.02, C.green, 'satin')
      }
      infoPoint(b, 0, 1.2, -1.6, 'Zugdesign-Ausstellung', ['Big Apple Trains – Fahrzeugfamilie „Amstel“', 'Hochgeschwindigkeit 320 km/h, 100 % Ökostrom', 'Design: Weiß/Schwarz mit Apple-Green-Linie'], { suffix: 'Trains' })
      break
    }
    case 'trainmodel': {
      K.modelTrain(b, 0, 0, 0, 0, Math.min(w - 3, 8))
      infoPoint(b, 0, 1.2, 1.6, 'Maßstabsgetreues Zugmodell (1:87)', ['Streckenabschnitt Amsterdam Centraal – Schiphol', 'Zug: Big Apple Trains „Amstel“-Triebzug', 'Gleisbild, Signale und Bahnhöfe im Maßstab H0'], { suffix: 'Trains' })
      stander(b, 1.5, 0, 1.4, P, 1)
      stander(b, -2, 0, -1.4, 0, 1)
      break
    }
    case 'projects': {
      K.meetingTable(b, -w / 5, 0, 0, 0, { len: 2.4, wid: 1.2, seats: 3, top: C.woodLight })
      K.meetingTable(b, w / 5, 0, 0, 0, { len: 2.4, wid: 1.2, seats: 3, top: C.woodLight })
      sitter(b, -w / 5, 0, 0.95, P, 0.8)
      sitter(b, w / 5 + 0.6, 0, -0.95, 0, 0.8)
      b.box(0, 0.6, -hd + 0.15, Math.min(w - 2, 6), 1.6, 0.05, '#f2efe6', 'satin')
      break
    }
    case 'reception': {
      K.receptionDesk(b, 0, 0, -hd / 3, 0, Math.min(w - 4, 6))
      stander(b, 0, 0, -hd / 3 - 1.6, 0, 1)
      K.loungeSet(b, -w / 4, 0, hd / 2, P, C.fabricGrey)
      K.plant(b, hw, 0, hd, 1.4)
      break
    }
  }
}
