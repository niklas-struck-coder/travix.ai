/**
 * Big Apple Groups Headquarters – the round holding tower (22 floors, ~101 m).
 * Lobby (double height) with spiral stair to the gallery, elevator to the
 * themed floors and the roof terrace.
 */
import { WorldBuilder } from '../engine/builder'
import { C, logoTexture, textTexture } from '../engine/materials'
import { buildElevator, buildEntrance, buildSpiralStair, infoPoint } from './dynamic'
import { furnish, type RoomKind } from './rooms'
import * as K from './kits'
import { BUILDINGS } from '../config/campus'
import { ui, toast } from '../state/store'

const R = 24 // facade radius
const CORE = 7
const FH = 4.5
const FLOORS = 22
const ROOF = FLOORS * FH // 99
const TAU = Math.PI * 2
const D = Math.PI / 180
const RING = 10.6 // corridor ring wall radius
const DOOR_GAP = 0.14 // rad (~1.5 m at RING)
const ELEV_GAP = 0.3 // rad: wedge of the core used by the elevator

interface RoomDef {
  name: string
  a0: number // degrees (atan2 convention: 90 = south / entrance side)
  a1: number
  kind: RoomKind
  open?: boolean // no walls
}
interface FloorDef {
  level: number
  label: string
  short: string
  rooms: RoomDef[]
}

const FLOORS_DEF: FloorDef[] = [
  {
    level: 4, label: '4. OG – Group Finance · Legal & Compliance', short: '4. OG Finance/Legal',
    rooms: [
      { name: 'Group Finance – Open Space', a0: 115, a1: 200, kind: 'openoffice', open: true },
      { name: 'Group Finance – Controlling', a0: 200, a1: 245, kind: 'conference' },
      { name: 'Group Legal – Bibliothek', a0: 245, a1: 300, kind: 'legal' },
      { name: 'Compliance Office', a0: 300, a1: 345, kind: 'office' },
      { name: 'Group Legal & Compliance – Open Space', a0: 345, a1: 425, kind: 'openoffice', open: true },
    ],
  },
  {
    level: 7, label: '7. OG – Group Technology · Personalabteilung', short: '7. OG Technology/HR',
    rooms: [
      { name: 'Group Technology – Engineering', a0: 115, a1: 205, kind: 'tech', open: true },
      { name: 'Group Technology – NOC & Serverraum', a0: 205, a1: 250, kind: 'servers' },
      { name: 'Personalabteilung (HR)', a0: 250, a1: 300, kind: 'openoffice' },
      { name: 'HR – Interviewraum', a0: 300, a1: 345, kind: 'conference' },
      { name: 'Mitarbeiter-Lounge', a0: 345, a1: 425, kind: 'lounge', open: true },
    ],
  },
  {
    level: 10, label: '10. OG – Internationale Unternehmensentwicklung · Strategie', short: '10. OG Strategie',
    rooms: [
      { name: 'Internationale Unternehmensentwicklung', a0: 115, a1: 195, kind: 'openoffice', open: true },
      { name: 'Strategiebereich', a0: 195, a1: 245, kind: 'strategy' },
      { name: 'Besprechungsraum „Amsterdam“', a0: 245, a1: 290, kind: 'conference' },
      { name: 'Besprechungsraum „New York“', a0: 290, a1: 335, kind: 'conference' },
      { name: 'Kaffeebar & Lounge', a0: 335, a1: 425, kind: 'lounge', open: true },
    ],
  },
  {
    level: 18, label: '18. OG – Geschäftsführung · Chairman · Vorstand', short: '18. OG Geschäftsführung',
    rooms: [
      { name: 'Büro Geschäftsführung (CEO)', a0: 115, a1: 175, kind: 'exec' },
      { name: 'Büro Geschäftsführung (CFO)', a0: 175, a1: 235, kind: 'exec' },
      { name: 'Vorstandskonferenzraum', a0: 235, a1: 325, kind: 'board' },
      { name: 'Chairman-Büro', a0: 325, a1: 425, kind: 'chairman' },
    ],
  },
  {
    level: 21, label: '21. OG – Executive Lounge · Großer Konferenzraum', short: '21. OG Executive',
    rooms: [
      { name: 'Großer Konferenzraum', a0: 115, a1: 270, kind: 'bigconference' },
      { name: 'Executive Lounge', a0: 270, a1: 425, kind: 'clientlounge', open: true },
    ],
  },
]

export const HQ_INFO = { radius: R, roof: ROOF }

export function buildHQ(b: WorldBuilder) {
  const info = BUILDINGS.find((x) => x.id === 'hq')!
  b.at(info.x, 0, info.z, info.rot, () => {
    exterior(b)
    lobby(b)
    gallery(b)
    for (const f of FLOORS_DEF) floor(b, f)
    roof(b)
    // elevator (core wedge facing the entrance)
    b.inChunk('hq-core', { maxDist: 900 }, false, () => {
      buildElevator(b, {
        x: 0, z: 5.55, rot: 0, name: 'HQ-Aufzug',
        start: 1,
        stops: [
          { label: 'UG – Tiefgarage & Tunnel', y: -5 },
          { label: 'EG – Lobby', y: 0 },
          ...FLOORS_DEF.map((f) => ({ label: f.short, y: f.level * FH })),
          { label: 'Dachterrasse', y: ROOF },
        ],
      })
      // fillers between shaft and core wedge
      for (const s of [-1, 1]) b.box(s * 1.85, -5.3, 5.6, 0.9, ROOF + 9.3, 2.8, C.white, 'satin', { col: true })
    })
    b.zoneSector('Big Apple Groups HQ', 0, R, 0, TAU, 0, ROOF + 4, { building: 'hq' })
  })
}

// ---------------------------------------------------------------------------
function exterior(b: WorldBuilder) {
  b.inChunk('hq-ext', { maxDist: 5000 }, true, () => {
    const entranceA0 = 90 + 9
    const entranceA1 = 90 - 9 + 360
    // core (white concrete), with a wedge open towards the elevator
    b.arc(0, 0, 0, CORE, ROOF + 4, Math.PI / 2 + ELEV_GAP, Math.PI / 2 - ELEV_GAP + TAU, C.white, 'satin', true, 40)
    b.colArc(0, 0, 0, 0, CORE, Math.PI / 2 + ELEV_GAP, Math.PI / 2 - ELEV_GAP + TAU, ROOF + 4)
    // lobby glass (double height) with entrance gap
    b.arc(0, 0, 0, R, 9, entranceA0 * D, entranceA1 * D, C.glassTint, 'facade', true, 72)
    b.colArc(0, 0, 0, R - 0.25, R + 0.25, entranceA0 * D, entranceA1 * D, 9)
    // lobby mullions (stronger)
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * TAU
      const deg = ((a / D) % 360 + 360) % 360
      if (deg > 81 && deg < 99) continue
      b.box(Math.cos(a) * R, 0, Math.sin(a) * R, 0.35, 9, 0.18, C.anthracite, 'metal', { rot: -a + Math.PI / 2 })
    }
    // upper facade glass (one continuous curtain wall)
    b.arc(0, 9, 0, R, ROOF - 9, 0, TAU, C.glassTint, 'facade', true, 72)
    b.colArc(0, 9, 0, R - 0.25, R + 0.25, 0, TAU, ROOF - 9 + 1.2)
    // vertical mullions
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * TAU
      const green = i % 18 === 0
      b.box(Math.cos(a) * (R + 0.12), 9, Math.sin(a) * (R + 0.12), green ? 0.22 : 0.14, ROOF - 9, green ? 0.3 : 0.24, green ? C.green : C.anthracite, green ? 'satin' : 'metal', { rot: -a + Math.PI / 2 })
    }
    // floor bands: dark spandrel + white slab edge
    for (let k = 2; k <= FLOORS; k++) {
      const y = k * FH
      b.arc(0, y - 0.9, 0, R + 0.08, 0.9, 0, TAU, C.anthracite, 'satin', true, 72)
      b.arc(0, y - 0.05, 0, R + 0.22, 0.5, 0, TAU, C.white, 'satin', true, 72)
      // slab (visual, all floors)
      b.cyl(0, y - 0.4, 0, R - 0.1, 0.4, C.offwhite, 'matte', { segs: 48 })
      // night: glowing ceiling band per floor
      b.arc(0, y + FH - 0.65, 0, R - 0.6, 0.18, 0, TAU, '#fff3d6', 'nightglow', true, 48)
    }
    // green accent ring above the lobby & under the crown
    b.arc(0, 8.6, 0, R + 0.3, 0.4, 0, TAU, C.green, 'satin', true, 72)
    b.arc(0, ROOF - 1.4, 0, R + 0.3, 0.3, 0, TAU, C.green, 'satin', true, 72)
    // crown: solid white parapet band (no dome, no spire)
    b.arc(0, ROOF, 0, R + 0.3, 1.8, 0, TAU, C.white, 'satin', true, 72)
    b.cyl(0, ROOF - 0.4, 0, R - 0.1, 0.4, C.offwhite, 'matte', { segs: 48 })
    // logos on the upper facade (north & south) and the crown
    b.curvedSign(0, ROOF - 9.5, 0, R + 0.35, 6.5, (90 - 22) * D, (90 + 22) * D, logoTexture('Groups', { bg: '#ffffff', w: 2048, h: 400 }), 0.55)
    b.curvedSign(0, ROOF - 9.5, 0, R + 0.35, 6.5, (270 - 22) * D, (270 + 22) * D, logoTexture('Groups', { bg: '#ffffff', w: 2048, h: 400 }), 0.55)
    // entrance: canopy, glass side panels, doors
    const ez = Math.cos(9 * D) * R
    const halfGap = Math.sin(9 * D) * R
    b.box(0, 4.2, ez + 3.5, 13, 0.45, 7.5, C.white, 'satin')
    b.box(0, 4.1, ez + 7.2, 13, 0.12, 0.12, C.green, 'emissive')
    for (const s of [-1, 1]) b.cyl(s * 5.8, 0, ez + 6.6, 0.16, 4.2, C.anthracite, 'metal', { col: true, segs: 12 })
    b.sign(0, 4.95, ez + 7.27, 8.5, 1.2, logoTexture('Groups', { bg: '#ffffff', w: 1024, h: 150 }), 0, 0.6)
    b.box(0, 4.65, ez + 7.27, 13, 1.3, 0.02, C.white, 'satin') // fascia behind the sign
    for (const s of [-1, 1]) {
      const pw = halfGap - 1.6
      b.box(s * (1.6 + pw / 2), 0, ez, pw, 9, 0.12, C.glassTint, 'facade', { col: true })
    }
    b.box(0, 3.0, ez, 3.2, 6, 0.12, C.glassTint, 'facade')
    b.colBox(0, 3.0, ez, 3.2, 6, 0.3)
    buildEntrance(b, { x: 0, z: ez, name: 'Big Apple Groups HQ', width: 3.0, height: 3.0, inside: -1 })
    b.zone('Haupteingang HQ', 0, 0, ez + 4, 14, 5, 8, { building: 'hq' })
  })
}

// ---------------------------------------------------------------------------
function lobby(b: WorldBuilder) {
  b.inChunk('hq-lobby', { maxDist: 160, yMin: -10, yMax: 40 }, false, () => {
    // stone floor + inlays
    b.cyl(0, 0, 0, R - 0.1, 0.03, '#e3ddd2', 'gloss', { segs: 64 })
    b.arc(0, 0.031, 0, 16, 0.01, 0, TAU, C.green, 'emissive', true, 64)
    b.floorSign(0, 0.04, 17.5, 7, 1.4, logoTexture('Groups', { bg: '#e3ddd2', w: 1024, h: 200 }))
    // ceiling of the atrium (underside of 2. OG slab)
    b.cyl(0, 2 * FH - 0.42, 0, R - 0.1, 0.02, '#f6f5f0', 'matte', { segs: 48 })
    for (let i = 0; i < 3; i++) b.arc(0, 2 * FH - 0.5, 0, 12 + i * 4, 0.06, Math.PI * 0.05, Math.PI * 0.95, '#fff6e0', 'emissive', true, 48)

    // logo walls on the core
    b.curvedSign(0, 3.2, 0, CORE + 0.05, 2.6, (90 + 22) * D, (90 + 80) * D, logoTexture('Groups', { bg: '#ffffff', w: 1600, h: 320 }), 0.45)
    b.curvedSign(0, 3.2, 0, CORE + 0.05, 2.6, (90 - 80) * D, (90 - 22) * D, logoTexture('Groups', { bg: '#ffffff', w: 1600, h: 320 }), 0.45)
    // elevator sign
    b.sign(0, 3.0, CORE + 0.05, 2.4, 0.5, textTexture(['Aufzüge · Elevators', 'Etagen 4 · 7 · 10 · 18 · 21 · Dach'], { w: 512, h: 110, accent: C.green }))

    // reception
    K.receptionDesk(b, 8.5, 0, 13.5, -0.45, 6)
    b.npc({ kind: 'stand', x: 8.5 + Math.sin(-0.45) * -1.6, y: 0, z: 13.5 + Math.cos(-0.45) * -1.6, yaw: -0.45 })
    b.npc({ kind: 'stand', x: 8.5 + 0.9, y: 0, z: 13.5 - 1.3, yaw: -0.45 })
    b.sign(8.5, 1.9, 13.0, 4.2, 0.8, textTexture(['Empfang · Reception'], { w: 512, h: 96, accent: C.green }), -0.45, 0.5, true)
    infoPoint(b, 8.0, 1.2, 15.2, 'Empfang Big Apple Groups', [
      'Willkommen im Headquarter der Big Apple Groups, Amsterdam.',
      'Besucher melden sich bitte an der Besucherregistrierung (links) an.',
      'Aufzüge: hinter dem Empfang im Gebäudekern · Galerie über die Wendeltreppe.',
      'Geschäftsführung & Vorstand: 18. OG · Dachterrasse: oberste Etage',
    ], { label: 'Mit dem Empfang sprechen' })

    // visitor registration kiosks
    for (let i = 0; i < 3; i++) {
      const x = -9 + i * 1.6
      b.at(x, 0, 15.5, 0.35, () => {
        b.box(0, 0, 0, 0.5, 1.0, 0.4, C.white, 'gloss', { col: true })
        b.boxTilt(0, 1.0, 0, 0.55, 0.42, 0.06, 0, -0.5, C.black, 'gloss')
        b.boxTilt(0, 1.02, 0.03, 0.5, 0.36, 0.01, 0, -0.5, '#2a6a4c', 'emissive')
      })
    }
    b.sign(-7.5, 2.2, 14.6, 4.2, 0.6, textTexture(['Besucherregistrierung'], { w: 512, h: 72, accent: C.green }), 0.35, 0.5, true)
    let visitorNo = 1040
    b.interact({
      id: 'hq-register', lx: -7.4, ly: 1.2, lz: 16.4, radius: 2.6, priority: 2,
      label: () => 'Als Besucher registrieren',
      action: () => {
        visitorNo++
        ui().set({ info: { title: 'Besucherausweis erstellt', subtitle: `Gast Nr. ${visitorNo}`, body: [
          `Gültig heute bis 20:00 Uhr · Zugang: Lobby, Galerie, Visitor Center und alle Showrooms auf dem Campus.`,
          'Ihr Gastgeber wurde benachrichtigt (Simulation).',
          'Tipp: Mit „M“ öffnen Sie die Campuskarte und können zu jedem Gebäude navigieren.',
        ] } })
      },
    })

    // lounge seating
    K.loungeSet(b, 15.5, 0, 3.5, -1.2, C.fabricGrey)
    K.loungeSet(b, -17, 0, 10, 2.2, C.fabricGreen)
    for (let i = 0; i < 4; i++) K.sofa(b, -4 + i * 2.7, 0, 20.5, Math.PI, 2.2, i % 2 ? C.fabricGrey : C.leather)
    // indoor trees
    K.planter(b, 17, 12, 3, 3)
    K.tree(b, 17, 12, 0.9, 0.6, 0)
    K.planter(b, -16, 17, 3, 3)
    K.tree(b, -16, 17, 0.9, 0.6, 1)

    // freestanding welcome LED wall
    b.at(13.5, 0, 17.5, -0.75, () => {
      b.box(-1.9, 0, 0, 0.15, 3.6, 0.3, C.anthracite, 'metal', { col: true })
      b.box(1.9, 0, 0, 0.15, 3.6, 0.3, C.anthracite, 'metal', { col: true })
      b.box(0, 0.95, -0.05, 3.9, 2.3, 0.1, C.black, 'gloss')
      b.screen({ id: 'hq-welcome', lx: 0, ly: 1.0, lz: 0.02, w: 3.6, h: 2.1, slides: [
        { title: 'Willkommen', lines: ['Big Apple Groups · Global Campus Amsterdam', 'Heute: Big Apple Innovation Week – Auditorium im Visitor Center'], kind: 'event' },
        { title: 'Monorail', lines: ['Nächste Abfahrt Station „Holding HQ“', 'Rundkurs über 5 Stationen · alle 2 Minuten'], kind: 'info' },
        { title: 'Unternehmen', lines: ['Tech · Finance · Fitness · Logistics · Mobility', 'Hotels · Holidays · Entertainment · Trains · Racing · Health · Foundation'], kind: 'info' },
      ] })
    })
    infoPoint(b, 13.5 + 1.5, 1.4, 17.5 + 1.5, 'Digitaler Informationsbildschirm', [
      'Aktuelle Campus-Informationen: Veranstaltungen, Monorail-Abfahrten und Unternehmen.',
      'Neu im Showroom von Big Apple Groups Racing: der Formel-1-Rennwagen BAR-01.',
    ], { label: 'Informationsbildschirm ansehen' })

    // brand exhibition under the gallery (north half)
    const subs = BUILDINGS.filter((x) => x.kind === 'subsidiary' && x.id !== 'hotels')
    const step = 148 / Math.max(1, subs.length - 1)
    subs.forEach((s, i) => {
      const a = (196 + i * step) * D
      const r = 18.5
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      K.displayPlinth(b, x, 0, z, -a + Math.PI / 2, 1.3, 0.8, 1.0)
      b.at(x, 0, z, -a - Math.PI / 2, () => {
        b.box(0, 1.0, -0.2, 1.3, 1.1, 0.06, C.white, 'gloss')
        b.sign(0, 1.55, -0.16, 1.25, 0.32, logoTexture(s.suffix, { bg: '#ffffff', w: 512, h: 128 }))
      })
      infoPoint(b, Math.cos(a) * (r - 1.6), 1.2, Math.sin(a) * (r - 1.6), s.name, [s.description], { label: `Markenwelt: ${s.name}`, suffix: s.suffix })
    })
    b.zoneSector('Markenwelt-Ausstellung', CORE, R, Math.PI * 1.05, Math.PI * 1.95, 0, 4, { building: 'hq', floor: 'EG' })

    // spiral stair to the gallery
    const sp = buildSpiralStair(b, -13, 0, 3.5, FH, { rInner: 0.9, rOuter: 3.2, startAngle: (270 * D) - 25 * 0.25, stepAngle: 0.25 })
    void sp
    b.sign(-13, 2.6, 7.2, 2.4, 0.45, textTexture(['↑ Galerie · Café & Lounge'], { w: 512, h: 96, accent: C.green }), 0, 0.5, true)

    b.zoneSector('Lobby', CORE, R, 0, TAU, 0, 4, { building: 'hq', floor: 'EG' })
    b.npc({ kind: 'walk', path: [[-2, 0, 21], [-4, 0, 14], [-2, 0, 9], [3, 0, 9], [5, 0, 15], [2, 0, 21]], loop: true })
    b.npc({ kind: 'walk', path: [[14, 0, -6], [6, 0, 12], [-12, 0, 12], [-18, 0, -2]], loop: false })
    b.npc({ kind: 'stand', x: -6, y: 0, z: 16.5, yaw: 0.35 + Math.PI })
  })
}

// ---------------------------------------------------------------------------
function gallery(b: WorldBuilder) {
  const y = FH
  b.inChunk('hq-f1', { maxDist: 140, yMin: -10, yMax: 40 }, false, () => {
    // half slab (north half: atan2 angles π..2π) + landing for the spiral stair
    b.arc(0, y - 0.4, 0, R - 0.15, 0.4, Math.PI, TAU, '#e9e5dc', 'satin', false, 48)
    b.colArc(0, y - 0.4, 0, CORE, R - 0.1, Math.PI, TAU, 0.4)
    b.box(-13, y - 0.4, 1.05, 3.2, 0.4, 2.1, '#e9e5dc', 'satin', { col: true })
    // glass balustrade along the slab edge (z = 0) with gap for the stair landing
    const segs: [number, number][] = [[-23.6, -14.6], [-11.4, -7], [7, 23.6]]
    for (const [x0, x1] of segs) {
      b.box((x0 + x1) / 2, y, 0.05, x1 - x0, 1.05, 0.04, C.glassTint, 'glass', { col: true, noSupport: true })
      b.box((x0 + x1) / 2, y + 1.05, 0.05, x1 - x0, 0.05, 0.08, C.anthracite, 'metal')
      b.box((x0 + x1) / 2, y - 0.42, 0.06, x1 - x0, 0.42, 0.02, C.white, 'satin') // fascia
    }
    for (const x of [-14.6, -11.4]) {
      b.box(x, y, 1.05, 0.04, 1.05, 2.1, C.glassTint, 'glass', { col: true, noSupport: true })
    }
    // LED fascia ticker facing the atrium
    b.screen({ id: 'hq-ticker', lx: 15.3, ly: y - 0.4, lz: 0.09, w: 15.5, h: 0.38, slides: [
      { title: 'BIG APPLE GROUPS', lines: ['Tech · Finance · Fitness · Logistics · Mobility · Hotels · Holidays · Entertainment · Trains · Foundation'], kind: 'info' },
    ] })
    // café & staff restaurant (Kantine)
    b.at(-10, y, -14, 0.15, () => furnish(b, 'canteen', 13, 9))
    b.zone('Galerie – Mitarbeiterrestaurant', -10, y, -14, 14, 4, 10, { building: 'hq', floor: '1. OG' })
    // lounge
    b.at(12, y, -13, -0.6, () => furnish(b, 'lounge', 10, 8))
    b.zone('Galerie – Lounge', 12, y, -13, 12, 4, 10, { building: 'hq', floor: '1. OG' })
    // glass meeting pods
    for (let i = 0; i < 2; i++) {
      const x = 15 + i * 5
      b.at(x, y, -3.3, 0, () => {
        b.box(0, 0, -2.0, 4.4, 2.6, 0.05, C.glassTint, 'glass', { col: true })
        b.box(-2.2, 0, -0.5, 0.05, 2.6, 3.0, C.glassTint, 'glass', { col: true })
        b.box(2.2, 0, -0.5, 0.05, 2.6, 3.0, C.glassTint, 'glass', { col: true })
        b.box(0, 2.6, -0.5, 4.5, 0.06, 3.1, C.white, 'satin')
        K.meetingTable(b, 0, 0, -0.6, 0, { len: 2.0, wid: 0.9, seats: 2 })
        b.npc({ kind: 'sit', x: -0.4, y: 0, z: 0.1, yaw: Math.PI })
      })
    }
    b.sign(17.5, y + 2.75, -1.7, 4, 0.3, textTexture(['Besprechungsboxen'], { w: 512, h: 64 }), 0)
    b.zoneSector('Galerie (1. OG)', CORE, R, Math.PI, TAU, y, 4, { building: 'hq', floor: '1. OG' })
  })
}

// ---------------------------------------------------------------------------
function floor(b: WorldBuilder, f: FloorDef) {
  const y = f.level * FH
  b.inChunk(`hq-f${f.level}`, { maxDist: 70, yMin: y - 7, yMax: y + 9 }, false, () => {
    b.colArc(0, y - 0.4, 0, CORE, R - 0.1, 0, TAU, 0.4)
    b.cyl(0, y + 0.0, 0, R - 0.15, 0.02, '#cfccc5', 'satin', { segs: 64 }) // floor finish
    b.cyl(0, y, 0, RING, 0.025, '#b9b5ac', 'satin', { segs: 48 }) // corridor
    // ceiling with light rings
    b.cyl(0, y + FH - 0.45, 0, R - 0.15, 0.02, '#f6f5f0', 'matte', { segs: 48 })
    b.arc(0, y + FH - 0.5, 0, 17, 0.05, 0, TAU, '#fff6e0', 'emissive', true, 48)
    b.arc(0, y + FH - 0.5, 0, RING - 1.5, 0.05, 0, TAU, '#fff6e0', 'emissive', true, 48)
    // floor sign at the elevator
    b.sign(0, y + 2.9, CORE + 0.06, 3.6, 0.6, textTexture([f.label.split(' – ')[0], f.label.split(' – ')[1] ?? ''], { w: 768, h: 128, accent: C.green }))
    // foyer with small reception counter
    b.at(0, y, RING + 3.5, 0, () => {
      b.box(0, 0, 0, 3.2, 1.05, 0.8, C.white, 'gloss', { col: true })
      b.box(0, 0.1, 0.41, 3.2, 0.04, 0.02, C.green, 'emissive')
      b.npc({ kind: 'stand', x: 0, y: 0, z: -0.9, yaw: 0 })
    })
    K.plant(b, -4, y, RING + 2, 1.2)
    K.plant(b, 4, y, RING + 2, 1.2)
    b.zoneSector(`Foyer ${f.short}`, CORE, R, 65 * D, 115 * D, y, 4, { building: 'hq', floor: f.short })

    // rooms
    for (const r of f.rooms) {
      const a0 = r.a0 * D
      const a1 = r.a1 * D
      const am = (a0 + a1) / 2
      if (!r.open) {
        // radial walls at both ends (shared walls are drawn twice – harmless)
        for (const a of [a0, a1]) {
          const rm = (RING + R) / 2
          b.box(Math.cos(a) * rm, y, Math.sin(a) * rm, R - RING - 0.4, FH - 0.5, 0.14, C.offwhite, 'satin', { rot: -a, col: true })
        }
        // corridor wall (glass) with door gap in the middle
        const g0 = am - DOOR_GAP / 2
        const g1 = am + DOOR_GAP / 2
        b.arc(0, y, 0, RING, FH - 0.5, a0, g0, C.glassTint, 'glass', true, 24)
        b.arc(0, y, 0, RING, FH - 0.5, g1, a1, C.glassTint, 'glass', true, 24)
        b.colArc(0, y, 0, RING - 0.08, RING + 0.08, a0, g0, FH - 0.5, { noSupport: true })
        b.colArc(0, y, 0, RING - 0.08, RING + 0.08, g1, a1, FH - 0.5, { noSupport: true })
        b.arc(0, y + FH - 0.6, 0, RING + 0.02, 0.1, a0, a1, C.anthracite, 'metal', true, 24)
        // door frame + name plate
        b.at(Math.cos(am) * (RING - 0.1), y, Math.sin(am) * (RING - 0.1), Math.PI / 2 - am + Math.PI, () => {
          b.box(0, 2.3, 0, 1.6, 0.1, 0.12, C.anthracite, 'metal')
          b.sign(1.25, 1.55, -0.02, 0.9, 0.3, textTexture([r.name.length > 26 ? r.name.slice(0, 26) + '…' : r.name], { w: 512, h: 128, size: 30, accent: C.green }), 0, 0.4, true)
        })
      } else {
        // open area: name pylon
        b.at(Math.cos(am) * (RING + 1.2), y, Math.sin(am) * (RING + 1.2), Math.PI / 2 - am + Math.PI, () => {
          b.box(0, 0, 0, 0.9, 2.2, 0.12, C.white, 'satin', { col: true })
          b.sign(0, 1.6, -0.07, 0.85, 0.85, textTexture([r.name.split(' – ')[0], r.name.split(' – ')[1] ?? ''], { w: 256, h: 256, size: 26, accent: C.green }), 0, 0.4, true)
        })
      }
      // furniture in a local frame: +z outward (window), -z towards the corridor
      const rm = (RING + R) / 2 + 0.4
      const span = a1 - a0
      const wRoom = Math.min(span * (RING + 2.5), 24)
      b.at(Math.cos(am) * rm, y, Math.sin(am) * rm, Math.PI / 2 - am, () => furnish(b, r.kind, wRoom, R - RING - 1.6, { name: r.name }))
      b.zoneSector(r.name, RING, R, a0, a1, y, 4, { building: 'hq', floor: f.short })
    }
    b.zoneSector(`Flur ${f.short}`, CORE, RING, 0, TAU, y, 4, { building: 'hq', floor: f.short })
  })
}

// ---------------------------------------------------------------------------
function roof(b: WorldBuilder) {
  const y = ROOF
  b.inChunk('hq-roof', { maxDist: 160, yMin: y - 10, yMax: y + 200 }, false, () => {
    b.colArc(0, y - 0.4, 0, CORE, R, 0, TAU, 0.4)
    b.cyl(0, y, 0, R - 0.6, 0.06, '#9b7652', 'satin', { segs: 64 }) // timber deck
    b.arc(0, y + 0.06, 0, 14, 0.02, 0, TAU, C.green, 'emissive', true, 64)
    // parapet + glass balustrade
    b.colArc(0, y, 0, R - 0.7, R + 0.4, 0, TAU, 1.6, { noSupport: true })
    b.arc(0, y + 0.0, 0, R - 0.6, 1.25, 0, TAU, C.glassTint, 'glass', true, 72)
    b.arc(0, y + 1.25, 0, R - 0.6, 0.06, 0, TAU, C.anthracite, 'metal', true, 72)
    // core pavilion with green roof edge
    b.cyl(0, y + 4, 0, CORE + 0.4, 0.35, C.white, 'satin', { segs: 40 })
    b.arc(0, y + 4.05, 0, CORE + 0.42, 0.12, 0, TAU, C.green, 'emissive', true, 40)
    // planters & seating ring
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * TAU + 0.31
      const x = Math.cos(a) * 17.5
      const z = Math.sin(a) * 17.5
      if (i % 2 === 0) {
        K.planter(b, x, z, 3.2, 1.2, y, -a + Math.PI / 2)
        K.tree(b, x, z, 0.55, y + 0.6, i)
      } else {
        K.bench(b, x, y, z, -a - Math.PI / 2, 2.4)
        b.npc({ kind: 'sit', x: x - Math.cos(a) * 0.2, y, z: z - Math.sin(a) * 0.2, yaw: -a - Math.PI / 2 })
      }
    }
    K.loungeSet(b, -11, y, -11, 0.8, C.fabricGrey)
    K.loungeSet(b, 11, y, -11, -0.8, C.fabricGreen)
    // panorama telescope + info
    b.at(0, y, -21.5, 0, () => {
      b.cyl(0, 0, 0, 0.12, 1.1, C.anthracite, 'metal', { col: true, segs: 8 })
      b.cylX(0, 1.25, 0.1, 0.12, 0.7, C.green, 'gloss', Math.PI / 2, 10)
    })
    b.interact({
      id: 'hq-telescope', lx: 0, ly: y + 1.2, lz: -20, radius: 2.4, priority: 3,
      label: () => 'Panorama-Fernrohr benutzen',
      action: () => {
        ui().set({ info: { title: 'Panorama vom HQ-Dach (≈ 100 m)', subtitle: 'Big Apple Global Campus · Amsterdam', body: [
          'Norden: Big Apple Holidays, dahinter die Gracht mit Amsterdamer Grachtenhäusern. Nordosten am Platz: Big Apple Groups Racing mit F1-Auto.',
          'Nordosten: Big Apple Trains · Osten: Big Apple Tech und Finance.',
          'Süden: Big Apple Visitor Center, Campus Hotel mit Mitarbeiter-Residenz, Business Center, Haupteinfahrt.',
          'Westen: Fitness, Logistics, Campussee mit der Big Apple Foundation.',
          'Die Monorail umrundet das HQ auf 6,8 m Höhe mit fünf Stationen.',
        ] } })
        toast('Tipp: Kameramodus 3 (Vogelperspektive) zeigt den ganzen Campus.')
      },
    })
    b.zoneSector('Dachterrasse', CORE, R, 0, TAU, y, 6, { building: 'hq', floor: 'Dach' })
  })
}
