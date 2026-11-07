/**
 * Underground, two structurally separate levels:
 *
 *  Ebene –1  Campus-Promenade (pedestrians only)
 *            central ring around the HQ · four straight axes (cross) · outer ring
 *            · access corridors ("Zugänge") to every building with foyer, access
 *            gates, elevator and stair. Bright, high-quality finish: stone floor,
 *            light ceilings, wood slats, plants, seating, coffee points, digital
 *            wayfinding. Moving walkways only on the four long axes.
 *
 *  Ebene –2  Tiefgarage (cars only) below the central area, two ramps (east and
 *            south), employee / visitor / EV / accessible bays, motorbikes and
 *            bicycles. Connected to Ebene –1 only by four elevator cores and one
 *            stair – there is no direct connection for cars or pedestrians.
 */
import { WorldBuilder } from '../engine/builder'
import { C, textTexture } from '../engine/materials'
import { world } from '../engine/registry'
import { BUILDINGS, DEG, LEVELS, UG, polar, shortName, undergroundPlan, type Corridor } from '../config/campus'
import { buildElevator, buildStair, infoPoint } from './dynamic'
import * as K from './kits'
import { rand } from './rooms'

const P = LEVELS.promenade
const G = LEVELS.parking
const PH = P.ceilY - P.floorY // 3.6 m clear height
const GH = G.ceilY - G.floorY // 3.7 m
const TAU = Math.PI * 2
const LOD = { maxDist: 1200, yMin: -40, yMax: -0.3 }
const BELT_LEN = 24
const BELT_SPEED = 2.0

const FLOOR = '#e2ded5'
const FLOOR_BAND = '#c8c2b5'
const WALL = '#f3f2ee'
const CEIL = '#f8f7f3'
const LIGHT = '#fffaf0'

const outward = (a: number) => Math.PI - a * DEG
const label = (id?: string) => {
  const b = BUILDINGS.find((x) => x.id === id)
  if (!b) return ''
  return b.kind === 'subsidiary' ? 'Big Apple ' + b.suffix : shortName(b) === 'HQ' ? 'Big Apple Groups HQ' : shortName(b)
}

export function buildUnderground(b: WorldBuilder) {
  const plan = undergroundPlan()
  b.inChunk('ug-promenade', LOD, false, () => {
    rings(b, plan)
    for (const c of plan.corridors) if (c.level === 'promenade') corridor(b, c)
    island(b)
  })
  b.inChunk('ug-parking', LOD, false, () => {
    parking(b, plan)
    for (const c of plan.corridors) if (c.kind === 'car') carTunnel(b, c)
  })
  // elevator cores (visible from the plaza where they reach it), stair, ramps
  b.inChunk('ug-access', { maxDist: 700 }, true, () => {
    for (const c of UG.cores) {
      const [x, z] = polar(c.angle, UG.coreR)
      const stops = [{ label: 'Ebene –2 · Tiefgarage', y: G.floorY }, { label: 'Ebene –1 · Promenade', y: P.floorY }]
      if (c.plaza) stops.push({ label: 'HQ-Platz', y: 0 })
      buildElevator(b, { x, z, rot: outward(c.angle), name: c.plaza ? 'Glaslift Platz · Promenade · Tiefgarage' : 'Aufzug Promenade · Tiefgarage', glass: c.plaza, stops, start: c.plaza ? 2 : 1 })
      if (c.plaza) {
        b.at(x, 0, z, outward(c.angle), () => {
          b.box(0, 3.4, 0.6, 4.2, 0.2, 4.6, C.white, 'satin')
          b.box(0, 3.35, 2.9, 4.2, 0.05, 0.06, C.green, 'emissive')
          b.sign(0, 3.85, 2.92, 3.8, 0.5, textTexture(['↓ Promenade · Tiefgarage'], { w: 640, h: 80, accent: C.green }), 0, 0.5)
        })
      }
    }
    const [sx, sz] = polar(UG.stair.angle, UG.stair.rBottom)
    buildStair(b, sx, G.floorY, sz, 3.0, P.floorY - G.floorY, { rot: outward(UG.stair.angle), color: FLOOR })
    for (const r of UG.ramps) ramp(b, r.angle, r.name)
  })
}

// =============================================================================== Ebene –1
/** draw ring-shaped corridor with walls (gaps where corridors join) */
function rings(b: WorldBuilder, plan: ReturnType<typeof undergroundPlan>) {
  for (const ring of [UG.centralRing, UG.outerRing]) {
    const r0 = ring.r - ring.w / 2
    const r1 = ring.r + ring.w / 2
    const isCentral = ring === UG.centralRing
    b.colArc(0, P.floorY - 0.3, 0, r0 - 0.2, r1 + 0.2, 0, TAU, 0.3)
    const n = Math.round((TAU * ring.r) / 3)
    const segLen = (TAU * ring.r) / n
    for (let i = 0; i < n; i++) {
      const a = (i + 0.5) * (TAU / n)
      const x = Math.cos(a) * ring.r
      const z = Math.sin(a) * ring.r
      const rot = -a // local x along the radius
      b.box(x, P.floorY - 0.3, z, ring.w + 0.4, 0.3, segLen * 1.04 * (r1 / ring.r), FLOOR, 'gloss', { rot })
      b.box(x, P.floorY + 0.002, z, 0.7, 0.01, segLen * 1.02, FLOOR_BAND, 'gloss', { rot })
      b.box(x, P.ceilY, z, ring.w + 0.4, 0.15, segLen * 1.05 * (r1 / ring.r), CEIL, 'matte', { rot })
      if (i % 2 === 0) b.box(x, P.ceilY - 0.04, z, ring.w * 0.55, 0.03, 1.2, LIGHT, 'emissive', { rot })
    }
    // walls with openings
    for (const R of [r0, r1]) {
      const gaps = plan.gaps[R] ?? []
      const inGap = (ang: number) => gaps.some(([g0, g1]) => (((ang - g0) % TAU) + TAU) % TAU <= g1 - g0)
      const m = Math.round((TAU * R) / 2.4)
      let runStart: number | null = null
      for (let i = 0; i <= m; i++) {
        const a = (i + 0.5) * (TAU / m)
        const open = i === m || inGap(a)
        if (!open) {
          const x = Math.cos(a) * (R + (R === r0 ? -0.12 : 0.12))
          const z = Math.sin(a) * (R + (R === r0 ? -0.12 : 0.12))
          const slat = i % 4 === 0
          b.box(x, P.floorY, z, 0.24, PH, (TAU * R) / m + 0.06, slat ? C.wood : WALL, 'satin', { rot: -a })
          if (i % 9 === 0) b.box(Math.cos(a) * (R + (R === r0 ? 0.02 : -0.02)), P.floorY + 0.05, Math.sin(a) * (R + (R === r0 ? 0.02 : -0.02)), 0.02, 0.05, 1.2, C.green, 'emissive', { rot: -a })
          if (runStart === null) runStart = i * (TAU / m)
        }
        if (open && runStart !== null) {
          b.colArc(0, P.floorY, 0, R - 0.25, R + 0.25, runStart, i * (TAU / m), PH)
          runStart = null
        }
      }
    }
    // seating, plants and info screens along the inner wall
    const step = isCentral ? 4 : 10
    const inner = r0 + 1.0
    const nIt = Math.round(360 / step)
    for (let i = 0; i < nIt; i++) {
      const deg = i * step + step / 2
      const a = deg * DEG
      const nearJoin = (plan.gaps[r0] ?? []).concat(plan.gaps[r1] ?? []).some(([g0, g1]) => {
        const mid = (g0 + g1) / 2
        const d = Math.abs((((a - mid) % TAU) + TAU + Math.PI) % TAU - Math.PI)
        return d * ring.r < 9
      })
      if (nearJoin) continue
      const x = Math.cos(a) * inner
      const z = Math.sin(a) * inner
      const kind = i % 3
      if (kind === 0) K.bench(b, x, P.floorY, z, -a - Math.PI / 2, 2.2)
      else if (kind === 1) K.planter(b, x, z, 2.2, 0.8, P.floorY, -a + Math.PI / 2)
      else if (!isCentral && i % 6 === 2) b.npc({ kind: 'sit', x: Math.cos(a) * (inner + 0.1), y: P.floorY, z: Math.sin(a) * (inner + 0.1), yaw: -a - Math.PI / 2 })
    }
    b.zoneSector(isCentral ? 'Promenade · Zentraler Ring' : 'Promenade · Äußerer Ring', r0, r1, 0, TAU, P.floorY, PH)
    // people walking around the ring
    for (let k = 0; k < (isCentral ? 3 : 6); k++) {
      const pts: [number, number, number][] = []
      const off = rand() * TAU
      const rr = ring.r + (k % 2 ? 1.6 : -1.6)
      const segs = isCentral ? 24 : 64
      for (let j = 0; j <= segs; j++) {
        const a = off + ((k % 2 ? 1 : -1) * j * TAU) / segs
        pts.push([Math.cos(a) * rr, P.floorY, Math.sin(a) * rr])
      }
      b.npc({ kind: 'walk', path: pts, loop: true, local: false })
    }
  }
  // ring signage at the axes
  UG.axes.forEach((deg, i) => {
    for (const R of [UG.centralRing.r, UG.outerRing.r]) {
      const [x, z] = polar(deg, R)
      b.at(x, P.floorY, z, outward(deg), () => {
        b.box(0, PH - 0.75, 0, 4.6, 0.62, 0.1, C.black, 'gloss')
        const name = UG.axisNames[i]
        b.sign(0, PH - 0.44, 0.06, 4.4, 0.52, textTexture([R < 100 ? `↑ ${name} · zum äußeren Ring` : `↓ ${name} · zum HQ`], { w: 768, h: 90, accent: C.green }), 0, 0.5)
        b.sign(0, PH - 0.44, -0.06, 4.4, 0.52, textTexture([R < 100 ? `↓ Zentraler Ring · HQ` : `↑ Äußerer Ring · Gebäude`], { w: 768, h: 90, accent: C.green }), Math.PI, 0.5)
      })
    }
  })
}

/** straight corridor (axis, access corridor, HQ connector, core vestibule, stair landing) */
function corridor(b: WorldBuilder, c: Corridor) {
  const W = c.width
  const L = c.len
  const isAxis = c.kind === 'axis'
  const isSpur = c.kind === 'spur'
  const bd = BUILDINGS.find((x) => x.id === c.building)
  // building foyer (elevator + stair + access gates) at the start of an access corridor
  const foyer = isSpur && bd ? foyerGeometry(bd) : null
  const wallStart = foyer ? foyer.depth : 0
  // coffee niche on axes (right side, near the central ring), seating niche (left side, near the outer ring)
  const coffee = isAxis ? { side: 1, z0: 6, z1: 13 } : null
  const lounge = isAxis ? { side: -1, z0: L - 22, z1: L - 12 } : null
  b.at(c.sx, P.floorY, c.sz, c.rot, () => {
    b.box(0, -0.3, L / 2, W, 0.3, L, FLOOR, 'gloss', { col: true })
    b.box(0, 0.002, L / 2, isAxis ? 1.0 : 0.6, 0.01, L, FLOOR_BAND, 'gloss')
    b.box(0, PH, L / 2, W + 0.4, 0.15, L, CEIL, 'matte')
    for (let z = 2; z < L - 1; z += 4) b.box(0, PH - 0.04, z, W * 0.55, 0.03, 1.4, LIGHT, 'emissive')
    // side walls (with openings for niches)
    for (const s of [-1, 1]) {
      const niche = coffee && coffee.side === s ? coffee : lounge && lounge.side === s ? lounge : null
      const runs: [number, number][] = niche ? [[wallStart, niche.z0], [niche.z1, L]] : [[wallStart, L]]
      for (const [z0, z1] of runs) {
        if (z1 - z0 < 0.1) continue
        b.box(s * (W / 2 + 0.12), 0, (z0 + z1) / 2, 0.24, PH, z1 - z0, WALL, 'satin', { col: true })
        for (let z = z0 + 3; z < z1 - 1; z += 6) b.box(s * (W / 2 - 0.01), 0.05, z, 0.04, PH - 0.1, 0.8, C.wood, 'satin')
        b.box(s * (W / 2 - 0.02), 0.05, (z0 + z1) / 2, 0.02, 0.04, z1 - z0, C.green, 'emissive')
      }
      if (niche) nicheRoom(b, s, W, niche.z0, niche.z1, niche === coffee ? 'coffee' : 'lounge')
    }
    if (isAxis) {
      // moving walkways (in the middle) with normal walking lanes on both sides
      const nSeg = Math.floor((L - 30) / (BELT_LEN + 4))
      const start = 16
      for (let k = 0; k < nSeg; k++) {
        const zc = start + BELT_LEN / 2 + k * (BELT_LEN + 4)
        for (const [x, dir] of [[-1.0, 1], [1.0, -1]] as const) {
          b.box(x, 0, zc, 1.2, 0.08, BELT_LEN, '#2b2d2c', 'belt', { rot: dir > 0 ? 0 : Math.PI })
          b.colBox(x, 0, zc, 1.2, 0.08, BELT_LEN)
          for (const e of [-1, 1]) b.box(x, 0, zc + e * (BELT_LEN / 2 + 0.25), 1.3, 0.09, 0.5, '#9aa09c', 'metal')
          const [dx, dz] = b.dirW(0, dir)
          world.conveyors.push({ test: b.rectTest(x, zc, 1.2, BELT_LEN + 0.6), y: P.floorY + 0.08, dx, dz, speed: BELT_SPEED })
        }
        for (const bx of [-1.66, 0, 1.66]) {
          b.box(bx, 0.08, zc, 0.04, 0.85, BELT_LEN, C.glassTint, 'glass')
          b.box(bx, 0.93, zc, 0.08, 0.05, BELT_LEN + 0.3, '#3b403d', 'satin')
          b.colBox(bx, 0.08, zc, 0.1, 0.95, BELT_LEN, 0, true)
        }
      }
      // digital wayfinding steles at both ends
      for (const [z, rot] of [[3.5, 0], [L - 3.5, Math.PI]] as const) {
        b.at(-W / 2 + 0.9, 0, z, rot, () => {
          b.box(0, 0, 0, 1.0, 2.3, 0.3, C.black, 'gloss', { col: true })
        })
        b.screen({ id: `way-${c.id}-${z}`, lx: -W / 2 + 0.9 + (rot ? 0 : 0), ly: 0.75, lz: z + (rot ? -0.17 : 0.17), w: 0.9, h: 1.4, rot, slides: [{ title: c.name, lines: destinations(c, rot !== 0), kind: 'info' }] })
      }
    }
    if (isSpur && bd) {
      // overhead sign at the ring end and on the way to the building
      b.box(0, PH - 0.8, L - 0.4, W - 0.4, 0.66, 0.08, C.black, 'gloss')
      b.sign(0, PH - 0.47, L - 0.35, W - 0.6, 0.56, textTexture([`↑ ${label(bd.id)}`, 'Aufzug · Treppe · Zugang'], { w: 768, h: 100, accent: C.green, size: 40 }), Math.PI, 0.6)
      b.sign(0, PH - 0.47, L - 0.45, W - 0.6, 0.56, textTexture([bd.radius > 140 ? '↑ Äußerer Ring' : '↑ Zentraler Ring', 'Promenade · alle Gebäude'], { w: 768, h: 100, accent: C.green, size: 40 }), 0, 0.6)
      foyerBuild(b, bd, foyer!)
      if (rand() < 0.6) b.npc({ kind: 'walk', path: [[0, 0, foyer!.depth + 1], [0, 0, L - 2]], loop: false })
    }
    if (c.kind === 'hq') {
      b.sign(0, PH - 0.45, 0.2, 4.0, 0.5, textTexture(['↑ Big Apple Groups HQ · Aufzug Lobby & Etagen'], { w: 900, h: 90, accent: C.green }), 0, 0.5)
      // access gates
      gates(b, W, 6)
      b.zone('Zugang Big Apple Groups HQ (Ebene –1)', 0, 0, L / 2, W, PH, L, { building: 'hq' })
    }
    if (isAxis) b.zone(`Promenade · ${c.name}`, 0, 0, L / 2, W, PH, L)
    if (c.kind === 'core') b.zone('Promenade · Aufzugskern', 0, 0, L / 2, W, PH, L)
    if (c.kind === 'stair') {
      b.zone('Treppenhaus Tiefgarage (Ebene –2 ↔ –1)', 0, 0, L / 2, W, PH, L)
      b.sign(0, PH - 0.45, L - 0.4, 3.0, 0.45, textTexture(['↓ Treppe · Tiefgarage Ebene –2'], { w: 640, h: 80, bg: '#1f5fa8' }), Math.PI, 0.5)
    }
    if (c.kind === 'core') b.sign(0, PH - 0.45, L - 0.4, 3.4, 0.45, textTexture(['↓ Aufzug · Tiefgarage Ebene –2'], { w: 640, h: 80, bg: '#1f5fa8' }), Math.PI, 0.5)
    if (isAxis && rand() < 0.9) b.npc({ kind: 'walk', path: [[W / 2 - 1.2, 0, 2], [W / 2 - 1.2, 0, L - 2]], loop: false })
  })
}

function destinations(c: Corridor, towardsCentre: boolean): string[] {
  if (towardsCentre) return ['↓ Zentraler Ring', '↓ Big Apple Groups HQ', 'Aufzüge zur Tiefgarage (Ebene –2)']
  const a = (((Math.atan2(Math.sin(c.rot), -Math.cos(c.rot)) / DEG) % 360) + 360) % 360
  const near = BUILDINGS.filter((b) => b.kind !== 'hq' && b.radius > 140)
    .map((b) => ({ b, d: Math.min(Math.abs(b.angle - a), 360 - Math.abs(b.angle - a)) }))
    .sort((p, q) => p.d - q.d)
    .slice(0, 3)
  return ['↑ Äußerer Ring', ...near.map(({ b }) => `→ ${label(b.id)}`)]
}

function nicheRoom(b: WorldBuilder, s: number, W: number, z0: number, z1: number, kind: 'coffee' | 'lounge') {
  const D = 5
  const xc = s * (W / 2 + D / 2)
  const len = z1 - z0
  const zc = (z0 + z1) / 2
  b.box(xc, -0.3, zc, D + 0.3, 0.3, len, kind === 'coffee' ? '#d8cfc0' : FLOOR, 'gloss', { col: true })
  b.box(xc, PH, zc, D + 0.4, 0.15, len, CEIL, 'matte')
  b.box(xc, PH - 0.04, zc, 2.4, 0.03, 1.2, LIGHT, 'emissive')
  b.box(s * (W / 2 + D + 0.12), 0, zc, 0.24, PH, len + 0.2, kind === 'coffee' ? C.wood : WALL, 'satin', { col: true })
  for (const ze of [z0, z1]) b.box(xc, 0, ze, D + 0.24, PH, 0.24, WALL, 'satin', { col: true })
  if (kind === 'coffee') {
    // glass shopfront partly closing the niche + counter
    b.box(s * (W / 2 + 0.1), 0, z0 + 1, 0.06, PH - 0.4, 2, C.glassTint, 'glass')
    b.box(s * (W / 2 + D - 1.2), 0, zc, 0.8, 1.05, len - 2.4, C.white, 'gloss', { col: true })
    b.box(s * (W / 2 + D - 1.2), 1.05, zc, 0.9, 0.05, len - 2.3, C.stone, 'gloss')
    b.box(s * (W / 2 + D - 1.6), 0.15, zc, 0.02, 0.04, len - 2.4, C.green, 'emissive')
    b.box(s * (W / 2 + D - 0.4), 1.1, zc - 1, 0.4, 0.5, 0.4, C.anthracite, 'metal')
    b.sign(s * (W / 2 + D - 0.15), 2.3, zc, 2.4, 0.5, textTexture(['Coffee Point'], { w: 512, h: 100, accent: C.green }), -s * Math.PI / 2, 0.5)
    b.npc({ kind: 'stand', x: s * (W / 2 + D - 0.6), y: 0, z: zc + 0.5, yaw: -s * Math.PI / 2 })
    for (let i = 0; i < 2; i++) {
      const tz = z0 + 1.6 + i * 2.6
      K.coffeeTable(b, s * (W / 2 + 1.6), 0, tz, 0.4)
      K.chair(b, s * (W / 2 + 1.0), 0, tz, Math.PI / 2 * s)
      if (i === 0) b.npc({ kind: 'sit', x: s * (W / 2 + 1.0), y: 0, z: tz, yaw: (Math.PI / 2) * s })
    }
    infoPoint(b, s * (W / 2 + 2), 1.2, zc, 'Coffee Point', ['Espresso, Cappuccino, Tee und kleine Snacks.', 'Geöffnet Mo–Fr 7:30–18:00 · Bezahlung mit Big Apple Pay.'], { label: 'Coffee Point', radius: 3 })
  } else {
    K.sofa(b, s * (W / 2 + D - 0.6), 0, zc, -s * Math.PI / 2, 3.2, C.fabricGreen)
    K.coffeeTable(b, s * (W / 2 + 2.6), 0, zc, 0.5)
    K.plant(b, s * (W / 2 + D - 0.6), 0, z0 + 0.7, 1.1)
    K.plant(b, s * (W / 2 + D - 0.6), 0, z1 - 0.7, 1.1)
    b.box(s * (W / 2 + D - 0.02), 1.2, zc, 0.05, 1.3, 3.2, C.black, 'gloss')
    b.screen({ id: `ug-lounge-${rand().toFixed(5)}`, lx: s * (W / 2 + D - 0.06), ly: 1.25, lz: zc, w: 3.0, h: 1.2, rot: -s * Math.PI / 2, slides: [
      { title: 'Campus-Promenade', lines: ['Alle Gebäude trocken und barrierefrei erreichbar', 'Zentraler Ring · 4 Achsen · Äußerer Ring'], kind: 'info' },
      { title: 'Monorail', lines: ['Oberirdisch: Rundkurs mit 5 Stationen', 'Abfahrten alle ca. 2 Minuten'], kind: 'info' },
    ] })
  }
}

/** turnstile-style access gates across a corridor at local z */
function gates(b: WorldBuilder, W: number, z: number) {
  const n = Math.max(2, Math.floor((W - 1) / 1.1))
  for (let i = 0; i <= n; i++) {
    const x = -W / 2 + 0.5 + (i * (W - 1)) / n
    b.box(x, 0, z, 0.22, 1.0, 1.0, '#d9d8d3', 'metal', { col: true, noSupport: true })
    b.box(x, 1.0, z, 0.24, 0.03, 1.0, C.green, 'emissive')
  }
  for (let i = 0; i < n; i++) {
    const x = -W / 2 + 0.5 + ((i + 0.5) * (W - 1)) / n
    b.box(x - 0.25, 0.3, z, 0.02, 0.7, 0.6, C.glassTint, 'glass')
  }
}

interface Foyer {
  depth: number
}
/** foyer size in the access-corridor frame (origin = elevator door, +z towards the ring) */
function foyerGeometry(bd: (typeof BUILDINGS)[number]): Foyer {
  // stair core of the generic building: lanes x ∈ [0.5, 3.55] (local building frame), front zf
  const laneW = 1.45
  const halfRise = bd.floorH / 2
  const nHalf = Math.max(2, Math.round(halfRise / 0.175))
  const run = nHalf * 0.3
  const zf = 0.35 + 1.5 + run - 3.0 // relative to the door (door at zBack + 3.0)
  return { depth: Math.max(4, zf + 2.5 + laneW * 0) }
}

/** foyer: walls around elevator + stair base, gates, sign */
function foyerBuild(b: WorldBuilder, bd: (typeof BUILDINGS)[number], f: Foyer) {
  // spur frame: x = 0 is the elevator axis (building x = -2.6); stairs at x ∈ [3.1, 6.2]
  const x0 = -3.0
  const x1 = 6.9
  const zb = -3.0 // building back + 0.0 (door is at zBack + 3)
  const z1 = f.depth
  b.box((x0 + x1) / 2, -0.3, (zb + z1) / 2, x1 - x0, 0.3, z1 - zb, FLOOR, 'gloss', { col: true })
  b.box((x0 + x1) / 2, PH, (zb + z1) / 2, x1 - x0 + 0.3, 0.15, z1 - zb, CEIL, 'matte')
  b.box(1.5, PH - 0.04, z1 / 2, 3, 0.03, 1.2, LIGHT, 'emissive')
  // walls: right side, back, front part beside the corridor, left side beside the shaft
  b.box(x1 + 0.12, 0, (zb + z1) / 2, 0.24, PH, z1 - zb, WALL, 'satin', { col: true })
  b.box((x0 + x1) / 2, 0, zb - 0.12, x1 - x0 + 0.5, PH, 0.24, WALL, 'satin', { col: true })
  b.box((3.0 + x1) / 2, 0, z1 + 0.12, x1 - 3.0, PH, 0.24, WALL, 'satin', { col: true })
  b.box(x0 - 0.12, 0, (zb + z1) / 2, 0.24, PH, z1 - zb, WALL, 'satin', { col: true })
  b.box(x0 + 0.01, 0.6, z1 - 1.2, 0.02, 1.4, 2.0, '#141615', 'gloss')
  b.sign(x0 + 0.03, 1.3, z1 - 1.2, 1.9, 1.3, textTexture([label(bd.id), 'Ebene –1 · Aufzug & Treppe', bd.kind === 'subsidiary' ? 'Zutritt mit Mitarbeiterausweis' : 'Öffentlich zugänglich'], { w: 512, h: 360, accent: C.green, size: 44 }), Math.PI / 2, 0.5)
  gates(b, 6, z1 + 1.2)
  b.zone(`${label(bd.id)} · Foyer Ebene –1`, (x0 + x1) / 2, 0, (zb + z1) / 2, x1 - x0, PH, z1 - zb, { building: bd.id })
}

/** HQ core and the island under the plaza (closed) */
function island(b: WorldBuilder) {
  for (const L of [P, G]) {
    const h = L.ceilY - L.floorY
    b.arc(0, L.floorY, 0, 7, h, Math.PI / 2 + 0.3, Math.PI / 2 - 0.3 + TAU, C.white, 'satin', true, 40)
    b.colArc(0, L.floorY, 0, 0, 7, Math.PI / 2 + 0.3, Math.PI / 2 - 0.3 + TAU, h)
  }
  // close the elevator wedge on Ebene –2 (HQ elevator only goes to Ebene –1)
  b.box(0, G.floorY, 5.4, 4.4, GH, 3.6, C.white, 'satin', { col: true })
}

// =============================================================================== Ebene –2
function parking(b: WorldBuilder, plan: ReturnType<typeof undergroundPlan>) {
  const R = UG.parkingRadius
  const y = G.floorY
  b.cyl(0, y - 0.3, 0, R + 0.6, 0.3, '#64666a', 'satin', { segs: 72 })
  b.colCyl(0, y - 0.3, 0, R + 0.6, 0.3)
  // ceiling tiles (leaving the stair opening free)
  const [stx, stz] = polar(UG.stair.angle, UG.stair.rBottom + 4)
  for (let x = -R; x <= R; x += 6)
    for (let z = -R; z <= R; z += 6) {
      if (Math.hypot(x, z) > R + 3) continue
      if (Math.hypot(x - stx, z - stz) < 7) continue
      b.box(x, G.ceilY, z, 6.02, 0.1, 6.02, '#d5d4cf', 'matte')
    }
  // outer wall with openings for the car tunnels
  const gaps = plan.parkingGaps
  const inGap = (a: number) => gaps.some(([g0, g1]) => (((a - g0) % TAU) + TAU) % TAU <= g1 - g0)
  const m = Math.round((TAU * R) / 2.5)
  for (let i = 0; i < m; i++) {
    const a = (i + 0.5) * (TAU / m)
    if (inGap(a)) continue
    b.box(Math.cos(a) * (R + 0.2), y, Math.sin(a) * (R + 0.2), 0.35, GH, (TAU * R) / m + 0.05, i % 8 === 0 ? '#1f5fa8' : '#dcdbd6', 'satin', { rot: -a, col: true })
  }
  // lanes kept free: car tunnels (radial) and the elevator cores
  const laneFree = (x: number, z: number, margin: number) => {
    for (const r of UG.ramps) {
      const a = r.angle * DEG
      const dx = Math.sin(a)
      const dz = -Math.cos(a)
      const along = x * dx + z * dz
      const lat = Math.abs(x * dz - z * dx)
      if (along > 6 && lat < UG.rampWidth / 2 + margin) return false
    }
    for (const c of UG.cores) {
      const [cx, cz] = polar(c.angle, UG.coreR)
      if (Math.hypot(x - cx, z - cz) < 5 + margin) return false
    }
    if (Math.hypot(x - stx, z - stz) < 7 + margin) return false
    if (Math.hypot(x, z) < 10) return false
    return true
  }
  // lighting
  for (let x = -60; x <= 60; x += 10)
    for (let z = -60; z <= 60; z += 7) if (Math.hypot(x, z) < R - 3) b.box(x, G.ceilY - 0.06, z, 2.4, 0.04, 0.3, '#f4fbff', 'emissive')
  // columns
  for (let x = -63; x <= 63; x += 9)
    for (let z = -63; z <= 63; z += 9) {
      if (Math.hypot(x, z) > R - 3 || !laneFree(x, z, 1)) continue
      b.box(x, y, z, 0.6, GH, 0.6, '#e6e5e0', 'satin', { col: true })
      b.box(x, y + 0.4, z, 0.62, 0.3, 0.62, '#f2d24b', 'satin')
    }
  // parking bays by zone
  const zoneOf = (x: number, z: number) => {
    const deg = (((Math.atan2(x, -z) / DEG) % 360) + 360) % 360
    const nearCore = UG.cores.some((c) => {
      const [cx, cz] = polar(c.angle, UG.coreR)
      return Math.hypot(x - cx, z - cz) < 12
    })
    if (nearCore) return 'disabled'
    if (deg > 140 && deg < 230) return 'visitor'
    if (deg > 40 && deg < 80) return 'ev'
    if (deg > 345 || deg < 20) return 'moto'
    if (deg > 285 && deg < 320) return 'bike'
    return 'staff'
  }
  const colors = ['#f4f5f2', '#1d1f1e', '#7c8a92', '#3b5f8a', C.green, '#9a2a2a']
  for (let x = -64; x <= 64; x += 2.7)
    for (const zr of [-58.5, -49.5, -40.5, -31.5, -22.5, -13.5, -4.5, 4.5, 13.5, 22.5, 31.5, 40.5, 49.5, 58.5]) {
      for (const off of [-2.6, 2.6]) {
        const z = zr + off
        if (Math.hypot(x, z) > R - 5 || !laneFree(x, z, 2.5)) continue
        const zone = zoneOf(x, z)
        const rot = off > 0 ? 0 : Math.PI
        if (zone === 'bike') {
          if ((Math.round(x / 2.7) + Math.round(zr)) % 2 === 0) K.bikeRack(b, x, z, rot + Math.PI / 2, 3, y)
          continue
        }
        if (zone === 'moto') {
          b.box(x, y + 0.004, z, 2.4, 0.01, 2.0, '#4b4f53', 'matte')
          if (rand() < 0.6) K.bike(b, x, y, z, Math.PI / 2, rand() < 0.5 ? C.black : '#9a2a2a')
          continue
        }
        const lineCol = zone === 'disabled' ? '#2f6fd1' : zone === 'ev' ? C.green : zone === 'visitor' ? '#f2d24b' : '#e8e8e8'
        b.box(x - 1.35, y + 0.003, z, 0.1, 0.01, 5, lineCol, 'matte')
        if (zone === 'disabled') b.box(x, y + 0.004, z, 2.4, 0.01, 4.8, '#2f6fd1', 'matte')
        if (zone === 'ev') K.chargingStation(b, x, z + (off > 0 ? 2.3 : -2.3), off > 0 ? Math.PI : 0, y)
        if (rand() < (zone === 'visitor' ? 0.45 : 0.62)) K.car(b, x, y, z, rot, colors[Math.floor(rand() * colors.length)])
      }
    }
  // zone signs
  const zoneSign = (deg: number, r: number, lines: string[], bg: string) => {
    const [x, z] = polar(deg, r)
    b.at(x, y, z, outward(deg), () => {
      b.box(0, GH - 0.9, 0, 3.2, 0.7, 0.08, bg, 'satin')
      b.sign(0, GH - 0.55, 0.05, 3.1, 0.65, textTexture(lines, { w: 512, h: 110, bg }), 0, 0.4, true)
    })
  }
  zoneSign(185, 50, ['Besucher', 'Parkplätze'], '#8a6d1f')
  zoneSign(60, 50, ['E-Laden', 'Mitarbeitende & Besucher'], '#2f6b28')
  zoneSign(5, 50, ['Motorräder'], '#3b403d')
  zoneSign(302, 50, ['Fahrräder & E-Bikes'], '#3b403d')
  zoneSign(250, 50, ['Mitarbeitende'], '#1f5fa8')
  zoneSign(110, 50, ['Mitarbeitende'], '#1f5fa8')
  for (const r of UG.ramps) zoneSign(r.angle + 6, 60, [`Ausfahrt ${r.name.replace('Ein-/Ausfahrt ', '')} →`], '#1f5fa8')
  for (const c of UG.cores) zoneSign(c.angle + 9, UG.coreR + 3, ['↑ Aufzug', 'Promenade Ebene –1'], '#1f5fa8')
  b.zoneSector('Tiefgarage Ebene –2', 0, R, 0, TAU, y, GH)
  b.npc({ kind: 'walk', path: [[20, y, 40], [22, y, 23]], loop: false, local: false })
  b.npc({ kind: 'walk', path: [[-30, y, 30], [-22, y, 22]], loop: false, local: false })
  infoPoint(b, 0, y + 1.2, 12, 'Tiefgarage Ebene –2', [
    'Mitarbeitende, Besucher (gelb), E-Laden (grün), barrierefreie Plätze (blau) an den Aufzügen, Motorräder (Nord), Fahrräder (Nordwest).',
    'Ein- und Ausfahrten: Ost und Süd über Rampen von der Ringstraße.',
    'Fußgänger: vier Aufzugskerne und ein Treppenhaus führen nur zur Promenade (Ebene –1) – von dort in alle Gebäude.',
  ], { label: 'Garagenplan lesen' })
}

function carTunnel(b: WorldBuilder, c: Corridor) {
  const W = c.width
  const L = c.len
  b.at(c.sx, G.floorY, c.sz, c.rot, () => {
    b.box(0, -0.3, L / 2, W, 0.3, L, '#3e4042', 'satin', { col: true })
    for (let z = 2; z < L; z += 6) b.box(0, 0.005, z, 0.15, 0.01, 3, '#e8e8e2', 'matte')
    for (const s of [-1, 1]) {
      b.box(s * (W / 2 + 0.1), 0, L / 2, 0.2, GH, L, '#e1e0db', 'satin', { col: true })
      b.box(s * (W / 2 - 0.02), 0.08, L / 2, 0.03, 0.06, L, '#f2d24b', 'emissive')
    }
    b.box(0, GH, L / 2, W + 0.4, 0.15, L, '#d5d4cf', 'matte')
    for (let z = 4; z < L; z += 9) b.box(0, GH - 0.05, z, 2.4, 0.04, 0.35, '#f4fbff', 'emissive')
    b.sign(0, GH - 0.45, L - 0.6, W - 0.6, 0.6, textTexture([`↑ ${c.name} · Ringstraße`], { w: 768, h: 96, bg: '#1f5fa8' }), 0, 0.5)
    b.zone(`Zufahrt Tiefgarage (${c.name})`, 0, 0, L / 2, W, GH, L)
  })
}

/** car ramp from the ring road down to Ebene –2 (radial, rising outwards) */
function ramp(b: WorldBuilder, angle: number, name: string) {
  const [sx, sz] = polar(angle, UG.rampBottomR)
  const len = UG.rampLen
  const W = UG.rampWidth
  const H = -G.floorY
  b.at(sx, G.floorY, sz, angle * -DEG, () => {
    const ang = Math.atan2(H, len)
    b.boxTilt(0, H / 2 - 0.2, -len / 2, W, 0.3, Math.hypot(len, H), 0, ang, '#55575a', 'satin')
    const steps = 60
    for (let i = 0; i < steps; i++) {
      const zA = -len + (i / steps) * len
      const top = H * (1 - (i + 0.5) / steps)
      b.colBox(0, 0, zA + len / steps / 2, W, Math.max(0.02, top), len / steps)
    }
    for (const s of [-1, 1]) {
      b.box(s * (W / 2 + 0.15), 0, -len / 2, 0.3, H, len, '#bdbcb7', 'satin', { col: true })
      b.box(s * (W / 2 + 0.15), H, -len / 2, 0.3, 1.1, len, C.concrete, 'satin', { col: true, noSupport: true })
      b.box(s * (W / 2 + 0.05), 0.5, -len / 2, 0.03, 0.06, len, '#f2d24b', 'emissive')
    }
    b.box(0, H, 0.15, W + 0.6, 1.1, 0.3, C.concrete, 'satin', { col: true, noSupport: true })
    b.box(0, H + 3.6, -len + 1, W + 1, 0.25, 2, C.black, 'satin')
    b.box(0, H + 3.55, -len + 0.02, W + 1, 0.05, 0.06, C.green, 'emissive')
    b.sign(0, H + 3.95, -len - 0.02, 7, 0.8, textTexture([`P  Tiefgarage · ${name}`], { w: 768, h: 96, bg: '#1f5fa8' }), Math.PI, 0.5)
    b.box(0, H + 0.01, -len - 3.5, W, 0.02, 7, '#4a4c4e', 'satin')
    world.groundHoles.push(b.rectTest(0, -len / 2, W, len))
  })
}
