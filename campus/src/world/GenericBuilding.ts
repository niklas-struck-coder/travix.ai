/**
 * Generic rectangular campus building.
 *
 * Local frame: front façade (entrance) at +z, width along x, depth along z.
 * Plan per floor:
 *   left wing  x ∈ [-w/2, -4.5]   right wing x ∈ [4.5, w/2]
 *   centre     x ∈ [-4.5, 4.5]  (open hall / reception / corridor)
 *   core       at the back of the centre: elevator + switchback stair
 * Rooms are placed in wings by fractions along z ([f0, f1], 0 = back, 1 = front).
 */
import { WorldBuilder } from '../engine/builder'
import { world } from '../engine/registry'
import { C, logoTexture, textTexture, type Family } from '../engine/materials'
import { buildElevator, buildEntrance, buildStair } from './dynamic'
import { furnish, type RoomCtx, type RoomKind } from './rooms'
import type { BuildingInfo, FacadeStyle } from '../config/campus'
import * as K from './kits'

export interface RoomSpec {
  name: string
  kind: RoomKind
  wing: 'L' | 'R' | 'C'
  f0?: number
  f1?: number
  ctx?: RoomCtx
  /** turn the furniture frame 180° (e.g. stage at the façade side) */
  flip?: boolean
  /** room without partition walls */
  open?: boolean
}
export interface FloorSpec {
  label: string
  rooms: RoomSpec[]
  /** skip slab of this floor for the given wing (double-height space below) */
  voidWing?: 'L' | 'R'
}

export interface StyleSpec {
  frame: string
  glass: string
  band: string
  bandFam: Family
  accent: string
}

const STYLE: Record<FacadeStyle, StyleSpec> = {
  tech: { frame: C.white, glass: '#a9cbd6', band: C.white, bandFam: 'satin', accent: C.green },
  finance: { frame: C.anthracite, glass: '#7f98a3', band: '#2f3331', bandFam: 'gloss', accent: C.green },
  fitness: { frame: C.white, glass: '#b9d8de', band: C.white, bandFam: 'satin', accent: C.green },
  logistics: { frame: C.anthracite, glass: '#8aa6b0', band: '#3b403d', bandFam: 'metal', accent: C.green },
  mobility: { frame: C.black, glass: '#a3c3cd', band: C.white, bandFam: 'satin', accent: C.green },
  hotels: { frame: C.white, glass: '#a7c0c8', band: C.offwhite, bandFam: 'satin', accent: C.green },
  holidays: { frame: C.woodLight, glass: '#b4d3dc', band: C.white, bandFam: 'satin', accent: C.green },
  entertainment: { frame: C.black, glass: '#56666e', band: C.black, bandFam: 'gloss', accent: C.green },
  trains: { frame: C.white, glass: '#a3c3cd', band: C.white, bandFam: 'satin', accent: C.green },
  foundation: { frame: C.brick, glass: '#b4cbd1', band: '#b9a58d', bandFam: 'matte', accent: C.green },
  conference: { frame: C.white, glass: '#a9c6cf', band: C.white, bandFam: 'satin', accent: C.green },
  racing: { frame: '#111312', glass: '#4f5f66', band: '#111312', bandFam: 'gloss', accent: C.green },
  health: { frame: C.woodLight, glass: '#c3dde3', band: C.white, bandFam: 'satin', accent: C.green },
  media: { frame: '#2a2e2c', glass: '#5f6f76', band: '#2a2e2c', bandFam: 'satin', accent: C.green },
  business: { frame: '#ecebe6', glass: '#a9c6cf', band: C.white, bandFam: 'satin', accent: C.green },
  campushotel: { frame: C.offwhite, glass: '#9fb8c1', band: '#d9d3c6', bandFam: 'satin', accent: C.green },
}

export interface GenericOpts {
  info: BuildingInfo
  style: FacadeStyle
  visit: FloorSpec[]
  logoSuffix: string
  /** extra exterior decoration in local coords */
  extras?: (b: WorldBuilder, ctx: GenericCtx) => void
  roofDeck?: boolean
  entranceWidth?: number
}
export interface GenericCtx {
  w: number
  d: number
  fh: number
  H: number
  visitN: number
  style: StyleSpec
  /** front end of the stair core */
  zf: number
}

/** slab rectangle with rectangular holes, decomposed into boxes */
export function slab(b: WorldBuilder, x0: number, x1: number, z0: number, z1: number, y: number, t: number, holes: [number, number, number, number][], color: string, fam: Family = 'satin', collide = true) {
  const xs = [x0, x1, ...holes.flatMap((h) => [h[0], h[1]])].filter((v) => v >= x0 && v <= x1).sort((a, b) => a - b)
  const zs = [z0, z1, ...holes.flatMap((h) => [h[2], h[3]])].filter((v) => v >= z0 && v <= z1).sort((a, b) => a - b)
  const ux = [...new Set(xs)]
  const uz = [...new Set(zs)]
  for (let i = 0; i < ux.length - 1; i++) {
    // merge cells along z for this x column
    let start: number | null = null
    for (let j = 0; j <= uz.length - 1; j++) {
      const inHole = j < uz.length - 1 && holes.some((h) => (ux[i] + ux[i + 1]) / 2 > h[0] && (ux[i] + ux[i + 1]) / 2 < h[1] && (uz[j] + uz[j + 1]) / 2 > h[2] && (uz[j] + uz[j + 1]) / 2 < h[3])
      const end = j === uz.length - 1
      if (!inHole && !end && start === null) start = uz[j]
      if ((inHole || end) && start !== null) {
        const ze = uz[j]
        const cx = (ux[i] + ux[i + 1]) / 2
        const cz = (start + ze) / 2
        b.box(cx, y - t, cz, ux[i + 1] - ux[i], t, ze - start, color, fam, { col: collide })
        start = null
      }
    }
  }
}

export function buildGeneric(b: WorldBuilder, o: GenericOpts) {
  const { info } = o
  const w = info.w
  const d = info.d
  const fh = info.floorH
  const N = info.floors
  const H = N * fh
  const st = STYLE[o.style]
  const visitN = o.visit.length
    const id = info.id
  const ew = o.entranceWidth ?? 3.0

  // core geometry
  const zBack = -d / 2
  const elev = { x: -2.6, z: zBack + 1.65 }
  const elevHole: [number, number, number, number] = [-4.05, -1.15, zBack + 0.2, zBack + 3.1]
  const laneW = 1.45
  const sx0 = 0.5
  const laneA = sx0 + laneW / 2
  const laneB = sx0 + laneW + 0.15 + laneW / 2
  const halfRise = fh / 2
  const nHalf = Math.max(2, Math.round(halfRise / 0.175))
  const run = nHalf * 0.3
  const landD = 1.5
  const zr = zBack + 0.35
  const zf = zr + landD + run
  const stairHole: [number, number, number, number] = [sx0 - 0.1, sx0 + 2 * laneW + 0.25, zr - 0.1, zf]
  const ctx: GenericCtx = { w, d, fh, H, visitN, style: st, zf }

  b.at(info.x, 0, info.z, info.rot, () => {
    // =============================================================== exterior
    b.inChunk(`${id}-ext`, { maxDist: 5000 }, true, () => {
      envelope(b, o, ctx, ew)
      // roof & parapet
      b.box(0, H, 0, w + 0.4, 0.5, d + 0.4, st.band, st.bandFam)
      b.box(0, H + 0.5, d / 2 + 0.1, w + 0.4, 0.9, 0.2, st.band, st.bandFam)
      b.box(0, H + 0.5, -d / 2 - 0.1, w + 0.4, 0.9, 0.2, st.band, st.bandFam)
      b.box(-w / 2 - 0.1, H + 0.5, 0, 0.2, 0.9, d + 0.4, st.band, st.bandFam)
      b.box(w / 2 + 0.1, H + 0.5, 0, 0.2, 0.9, d + 0.4, st.band, st.bandFam)
      // rooftop technical equipment (HVAC units)
      for (let i = 0; i < 3; i++) b.box(-w / 4 + i * (w / 4), H + 0.5, -d / 4, 3, 1.6, 2.2, '#9da19e', 'metal')
      b.box(-2.6, H + 0.5, zBack + 1.7, 3.4, 2.6, 3.4, st.band, st.bandFam) // elevator machine room
      // logo on the front, top
      const lw = Math.min(w * 0.55, 22)
      b.box(0, H - 2.6, d / 2 + 0.25, lw + 0.6, 2.2, 0.15, C.white, 'satin')
      b.sign(0, H - 1.5, d / 2 + 0.34, lw, 1.9, logoTexture(o.logoSuffix, { bg: '#ffffff', w: 1600, h: 140 }), 0, 0.55)
      // and on the back
      b.box(0, H - 2.6, -d / 2 - 0.25, lw + 0.6, 2.2, 0.15, C.white, 'satin')
      b.sign(0, H - 1.5, -d / 2 - 0.34, lw, 1.9, logoTexture(o.logoSuffix, { bg: '#ffffff', w: 1600, h: 140 }), Math.PI, 0.55)
      // entrance canopy + logo
      b.box(0, 3.6, d / 2 + 2.2, ew + 6, 0.3, 4.4, st.frame === C.brick ? C.anthracite : st.frame, 'satin')
      b.box(0, 3.55, d / 2 + 4.35, ew + 6, 0.08, 0.08, st.accent, 'emissive')
      b.sign(0, 4.25, d / 2 + 4.42, Math.min(ew + 5.5, 9), 0.95, logoTexture(o.logoSuffix, { bg: '#ffffff', w: 1024, h: 110 }), 0, 0.5)
      b.box(0, 3.9, d / 2 + 4.41, ew + 6, 1.1, 0.02, C.white, 'satin')
      // monument stele in front
      b.at(ew / 2 + 6, 0, d / 2 + 9, -0.3, () => {
        b.box(0, 0, 0, 3.2, 1.4, 0.5, C.white, 'gloss', { col: true })
        b.sign(0, 0.7, 0.26, 3.0, 0.75, logoTexture(o.logoSuffix, { bg: '#ffffff', w: 1024, h: 256 }), 0, 0.4)
        b.box(0, 0, 0.27, 3.2, 0.06, 0.02, C.green, 'emissive')
      })
      buildEntrance(b, { x: 0, z: d / 2, name: info.name, width: ew, height: 3.0, inside: -1, frame: st.frame === C.brick ? C.anthracite : st.frame })
      b.zone(`Vorplatz ${info.name}`, 0, 0, d / 2 + 8, w, 6, 16, { building: id })
      o.extras?.(b, ctx)
    })

    // =============================================================== interior floors
    o.visit.forEach((fl, k) => {
      const y = k * fh
      const isTop = k === visitN - 1
      b.inChunk(`${id}-f${k}`, { maxDist: 75, yMin: y - 8, yMax: y + 10 }, false, () => {
        // floor finish (slab collider of floor 0 = ground)
        const holes: [number, number, number, number][] = k === 0 ? [] : [elevHole, stairHole]
        const vw = fl.voidWing
        if (vw) {
          const xL = vw === 'L' ? [-w / 2 + 0.3, -4.5] : [4.5, w / 2 - 0.3]
          holes.push([xL[0], xL[1], -d / 2 + 0.3, d / 2 - 0.3])
        }
        if (k > 0) slab(b, -w / 2 + 0.3, w / 2 - 0.3, -d / 2 + 0.3, d / 2 - 0.3, y, 0.35, holes, '#d8d4cc', 'satin')
        else {
          // ground floor finish with openings for the stair and elevator to Ebene –1
          slab(b, -w / 2 + 0.3, w / 2 - 0.3, -d / 2 + 0.3, d / 2 - 0.3, 0.02, 0.02, [elevHole, stairHole], o.style === 'finance' ? '#3a3a38' : '#d8d4cc', 'gloss', false)
          world.groundHoles.push(b.rectTest((stairHole[0] + stairHole[1]) / 2, (stairHole[2] + stairHole[3]) / 2, stairHole[1] - stairHole[0], stairHole[3] - stairHole[2]))
          // basement stair: same switchback as the upper floors, from Ebene –1 (−5 m) to the ground floor
          const bRise = 2.5
          buildStair(b, laneA, -5, zf, laneW, bRise, { rot: Math.PI, railing: 'right', color: C.stone, steps: nHalf })
          b.box(sx0 + laneW + 0.075, -bRise - 0.3, zr + landD / 2, 2 * laneW + 0.15, 0.3, landD, C.stone, 'satin', { col: true })
          buildStair(b, laneB, -bRise, zr + landD, laneW, bRise, { railing: 'left', color: C.stone, steps: nHalf })
          b.box(sx0 + laneW + 0.075, -5, (zr + landD + zf) / 2, 0.1, bRise + 0.9, zf - zr - landD, C.offwhite, 'satin', { col: true })
          b.box(sx0 + 2 * laneW + 0.3, -5, (zr + zf) / 2 - 0.1, 0.15, 5, zf - zr + 0.2, C.offwhite, 'satin', { col: true })
          b.box(sx0 - 0.15, -5, (zr + zf) / 2 - 0.1, 0.15, 5, zf - zr + 0.2, C.offwhite, 'satin', { col: true })
          b.sign(laneB, 2.6, zf + 0.05, 1.6, 0.4, textTexture(['↓ Ebene –1 · Promenade'], { w: 384, h: 64, accent: C.green }), 0, 0.4, true)
        }
        // ceiling (underside of the next slab) with light panels
        const ceilY = y + fh - 0.36
        b.box(0, ceilY, 0, w - 0.6, 0.01, d - 0.6, '#f4f3ef', 'matte')
        for (let i = -2; i <= 2; i++) b.box((i * (w - 2)) / 5, ceilY - 0.02, 0, 0.25, 0.02, d - 4, '#fff6e0', 'emissive')
        if (isTop) {
          // the last visited floor gets a closed ceiling slab collider
          b.colBox(0, y + fh - 0.35, 0, w, 0.35, d)
        }
        // core walls
        coreWalls(b, ctx, y, sx0, laneW, zr, zf, k > 0, st)
        // stair to the next visited floor
        if (!isTop) {
          // flight 1 (lane A) rises from the front towards the back
          buildStair(b, laneA, y, zf, laneW, halfRise, { rot: Math.PI, railing: 'right', color: C.stone })
          // landing at the back
          b.box(sx0 + laneW + 0.075, y + halfRise - 0.3, zr + landD / 2, 2 * laneW + 0.15, 0.3, landD, C.stone, 'satin', { col: true })
          // flight 2 (lane B) rises from the landing towards the front
          buildStair(b, laneB, y + halfRise, zr + landD, laneW, halfRise, { railing: 'left', color: C.stone })
          b.box(sx0 + laneW + 0.075, y, (zr + landD + zf) / 2, 0.1, halfRise + 0.9, zf - zr - landD, C.offwhite, 'satin', { col: true })
          b.sign(laneA, y + 2.6, zf + 0.05, 1.6, 0.4, textTexture(['↑ Treppe'], { w: 256, h: 64, accent: C.green }), 0, 0.4, true)
        } else if (k > 0) {
          // top floor: railing around the stair hole
          b.box(stairHole[0] + (stairHole[1] - stairHole[0]) / 2, y, stairHole[3] + 0.02, stairHole[1] - stairHole[0], 1.05, 0.05, C.glassTint, 'glass', { col: true, noSupport: true })
        }
        // rooms
        for (const r of fl.rooms) room(b, ctx, r, y, info)
        // floor directory sign
        b.sign(-0.5, y + 2.75, zBack + 3.25, 3.6, 0.6, textTexture([fl.label, info.name], { w: 768, h: 128, accent: C.green, size: 46 }), 0, 0.4)
        b.zone(`${info.name} · ${fl.label}`, 0, y, 0, w, fh - 0.4, d, { building: id, floor: fl.label })
        if (k === 0) {
          b.npc({ kind: 'walk', path: [[-3, 0, d / 2 - 2], [-2, 0, 0], [2, 0, -2], [3, 0, d / 2 - 3]], loop: true })
        }
      })
    })
    // elevator
    b.inChunk(`${id}-core`, { maxDist: 160 }, false, () => {
      const stops = [{ label: 'UG · Tunnel & Tiefgarage', y: -5 }, ...o.visit.map((f, k) => ({ label: f.label, y: k * fh }))]
      if (o.roofDeck) stops.push({ label: 'Dachterrasse', y: H + 0.5 })
      buildElevator(b, { x: elev.x, z: elev.z, rot: 0, name: `Aufzug ${info.kind === 'subsidiary' ? 'Big Apple ' + info.suffix : info.name}`, stops, start: 1 })
      if (o.roofDeck) roofDeck(b, ctx)
    })
    b.zone(info.name, 0, 0, 0, w, H, d, { building: id })
  })
}

function roofDeck(b: WorldBuilder, ctx: GenericCtx) {
  const { w, d, H } = ctx
  const y = H + 0.5
  b.colBox(0, H, 0, w, 0.5, d)
  b.box(0, y, 0, w - 1, 0.04, d - 1, '#9b7652', 'satin')
  // parapet colliders (visual parapet already exists)
  b.colBox(0, y, d / 2, w, 1.3, 0.3, 0, true)
  b.colBox(0, y, -d / 2, w, 1.3, 0.3, 0, true)
  b.colBox(-w / 2, y, 0, 0.3, 1.3, d, 0, true)
  b.colBox(w / 2, y, 0, 0.3, 1.3, d, 0, true)
  b.box(0, y + 0.9, d / 2 - 0.3, w - 1, 0.9, 0.04, C.glassTint, 'glass')
  for (let i = 0; i < 4; i++) {
    K.loungeSet(b, (i % 2 ? 1 : -1) * (w / 4), y, (i < 2 ? 1 : -1) * (d / 5) + 3, i * 0.7, i % 2 ? C.fabricGreen : C.fabricGrey)
  }
  for (let i = 0; i < 6; i++) K.planter(b, -w / 2 + 3 + i * ((w - 6) / 5), d / 2 - 1.6, 2.2, 0.9, y)
  b.zone('Dachterrasse', 0, y, 0, w, 5, d)
}

function coreWalls(b: WorldBuilder, ctx: GenericCtx, y: number, sx0: number, laneW: number, zr: number, zf: number, upper: boolean, st: StyleSpec) {
  const { fh } = ctx
  const h = fh - 0.36
  // wall right of the stair, wall separating stair from the elevator area
  b.box(sx0 + 2 * laneW + 0.3, y, (zr + zf) / 2 - 0.1, 0.15, h, zf - zr + 0.2, C.offwhite, 'satin', { col: true })
  b.box(sx0 - 0.15, y, (zr + zf) / 2 - 0.1, 0.15, h, zf - zr + 0.2, C.offwhite, 'satin', { col: true })
  // accent strip
  b.box(sx0 - 0.07, y + 0.05, zf - 0.05, 0.02, h - 0.1, 0.06, st.accent, 'emissive')
  void upper
}

function envelope(b: WorldBuilder, o: GenericOpts, ctx: GenericCtx, ew: number) {
  const { w, d, fh, H, style: st } = ctx
  const N = o.info.floors
  const s = o.style
  // collision walls (full height) – front split for the entrance
  const t = 0.3
  b.colBox(0, 0, -d / 2, w, H, t)
  b.colBox(-w / 2, 0, 0, t, H, d)
  b.colBox(w / 2, 0, 0, t, H, d)
  const side = (w - ew - 0.4) / 2
  b.colBox(-(ew / 2 + 0.2 + side / 2), 0, d / 2, side, H, t)
  b.colBox(ew / 2 + 0.2 + side / 2, 0, d / 2, side, H, t)
  b.colBox(0, 3.0, d / 2, ew + 0.4, H - 3.0, t)

  // curtain wall glass on all 4 sides (front with door opening)
  const glassFam: Family = 'facade'
  b.box(0, 0, -d / 2, w, H, 0.06, st.glass, glassFam)
  b.box(-w / 2, 0, 0, 0.06, H, d, st.glass, glassFam)
  b.box(w / 2, 0, 0, 0.06, H, d, st.glass, glassFam)
  b.box(-(ew / 2 + 0.2 + side / 2), 0, d / 2, side, H, 0.06, st.glass, glassFam)
  b.box(ew / 2 + 0.2 + side / 2, 0, d / 2, side, H, 0.06, st.glass, glassFam)
  b.box(0, 3.15, d / 2, ew + 0.4, H - 3.15, 0.06, st.glass, glassFam)

  // floor bands (slab edges) + night glow
  for (let k = 1; k <= N; k++) {
    const y = k * fh
    const bandH = s === 'logistics' ? fh * 0.45 : s === 'finance' ? 0.9 : 0.55
    ring(b, w, d, y - bandH * 0.6, bandH, 0.12, st.band, st.bandFam)
    if (s === 'tech' || s === 'racing') ring(b, w, d, y - 0.6, 0.08, 0.2, C.green, 'emissive')
    // interior slab for floors that are not visitable (visual only)
    if (k >= o.visit.length) b.box(0, y - 0.35, 0, w - 0.3, 0.35, d - 0.3, '#dad6ce', 'matte')
    // night glow per floor
    ring(b, w - 0.8, d - 0.8, y - 1.0, 0.25, -0.35, '#fff1d0', 'nightglow')
  }
  ring(b, w, d, 0, 0.45, 0.15, s === 'foundation' ? C.brick : C.stoneDark, 'satin') // plinth

  // style specific vertical elements
  const pitch = s === 'finance' ? 3.0 : s === 'tech' ? 1.8 : s === 'hotels' || s === 'campushotel' ? 2.4 : s === 'conference' ? 4.0 : s === 'racing' ? 2.2 : s === 'health' || s === 'business' ? 1.5 : s === 'foundation' ? 1.2 : 3.0
  const depth = s === 'tech' ? 0.7 : s === 'finance' ? 0.6 : s === 'foundation' ? 0.35 : s === 'hotels' || s === 'campushotel' ? 0.45 : s === 'conference' ? 1.2 : s === 'racing' ? 0.8 : s === 'health' || s === 'business' ? 0.35 : 0.18
  const fw = s === 'finance' ? 0.9 : s === 'tech' ? 0.18 : s === 'foundation' ? 0.12 : s === 'hotels' || s === 'campushotel' ? 0.35 : s === 'conference' ? 0.3 : s === 'racing' ? 0.25 : s === 'health' || s === 'business' ? 0.12 : 0.12
  const fam: Family = s === 'finance' ? 'gloss' : s === 'tech' || s === 'hotels' || s === 'campushotel' || s === 'conference' || s === 'health' || s === 'business' ? 'satin' : s === 'racing' ? 'gloss' : s === 'foundation' ? 'satin' : 'metal'
  const col = s === 'finance' ? '#2c2f2e' : s === 'foundation' || s === 'health' ? C.wood : st.frame
  if (s !== 'logistics' && s !== 'entertainment') {
    for (const [len, fz, dir] of [[w, d / 2, 1], [w, -d / 2, -1]] as const) {
      const n = Math.floor(len / pitch)
      for (let i = 0; i <= n; i++) {
        const x = -len / 2 + (i * len) / n
        if (dir === 1 && Math.abs(x) < ew / 2 + 1.0) continue
        b.box(x, s === 'fitness' ? fh : 0, fz + (dir * depth) / 2, fw, s === 'fitness' ? H - fh : H, depth, col, fam)
      }
    }
    for (const fx of [w / 2, -w / 2]) {
      const n = Math.floor(d / pitch)
      for (let i = 0; i <= n; i++) {
        const z = -d / 2 + (i * d) / n
        b.box(fx + (Math.sign(fx) * depth) / 2, s === 'fitness' ? fh : 0, z, depth, s === 'fitness' ? H - fh : H, fw, col, fam)
      }
    }
  }
  // finance: green light lines at base and top
  if (s === 'finance') {
    ring(b, w + 0.5, d + 0.5, H - 0.4, 0.08, 0.05, C.green, 'emissive')
    ring(b, w + 0.5, d + 0.5, 0.5, 0.06, 0.05, C.green, 'emissive')
  }
  // fitness: horizontal white louvres on upper floors
  if (s === 'fitness') {
    for (let y = fh + 0.4; y < H - 0.2; y += 0.55) ring(b, w + 0.9, d + 0.9, y, 0.06, 0.18, C.white, 'satin')
  }
  // logistics: dark cladding with ribbon windows
  if (s === 'logistics') {
    for (let k = 0; k < N; k++) {
      const y = k * fh
      ring(b, w + 0.2, d + 0.2, y + 2.6, fh - 2.6, 0.1, '#2f3432', 'satin', ew + 1)
    }
    // vertical corrugation hints
    for (let i = 0; i < Math.floor(w / 1.2); i++) b.box(-w / 2 + i * 1.2, 0, -d / 2 - 0.2, 0.08, H, 0.1, '#3b403d', 'metal')
  }
  // entertainment: dark frame, media façade
  if (s === 'entertainment') {
    for (let i = 0; i <= Math.floor(w / 2.4); i++) {
      const x = -w / 2 + i * 2.4
      if (Math.abs(x) < ew / 2 + 1) continue
      b.box(x, 0, d / 2 + 0.15, 0.2, H, 0.3, C.black, 'gloss')
      b.box(x, 0, -d / 2 - 0.15, 0.2, H, 0.3, C.black, 'gloss')
    }
  }
}

/** rectangular ring band around the building (optional front gap) */
export function ring(b: WorldBuilder, w: number, d: number, y: number, h: number, t: number, color: string, fam: Family, frontGap = 0) {
  const o = t / 2
  b.box(0, y, -d / 2 - o, w + Math.abs(t) * 2, h, Math.abs(t), color, fam)
  b.box(-w / 2 - o, y, 0, Math.abs(t), h, d, color, fam)
  b.box(w / 2 + o, y, 0, Math.abs(t), h, d, color, fam)
  if (frontGap > 0) {
    const side = (w - frontGap) / 2
    b.box(-(frontGap / 2 + side / 2), y, d / 2 + o, side + Math.abs(t), h, Math.abs(t), color, fam)
    b.box(frontGap / 2 + side / 2, y, d / 2 + o, side + Math.abs(t), h, Math.abs(t), color, fam)
  } else b.box(0, y, d / 2 + o, w + Math.abs(t) * 2, h, Math.abs(t), color, fam)
}

function room(b: WorldBuilder, ctx: GenericCtx, r: RoomSpec, y: number, info: BuildingInfo) {
  const { w, d, fh } = ctx
  const h = fh - 0.4
  const f0 = r.f0 ?? 0
  const f1 = r.f1 ?? 1
  const inner = 4.5
  if (r.wing === 'C') {
    // centre zone in front of the core
    const z0 = Math.max(-d / 2 + 6.2, ctx.zf + 0.8)
    const z1 = d / 2 - 0.4
    const zc = (z0 + z1) / 2
    b.at(0, y, zc, r.flip ? Math.PI : 0, () => furnish(b, r.kind, 2 * inner - 0.6, z1 - z0 - 3, { suffix: info.suffix, name: r.name, ...r.ctx }))
    b.zone(r.name, 0, y, zc, 2 * inner, h, z1 - z0, { building: info.id })
    return
  }
  const sgn = r.wing === 'L' ? -1 : 1
  const xIn = sgn * inner
  const xOut = sgn * (w / 2 - 0.3)
  const zA = -d / 2 + 0.3 + f0 * (d - 0.6)
  const zB = -d / 2 + 0.3 + f1 * (d - 0.6)
  const xc = (xIn + xOut) / 2
  const zc = (zA + zB) / 2
  const len = zB - zA
  const depth = Math.abs(xOut - xIn)
  if (!r.open) {
    // partition towards the centre (glass) with a door in the middle
    const door = 1.4
    const seg = (len - door) / 2
    b.box(xIn, y, zA + seg / 2, 0.08, h, seg, C.glassTint, 'glass', { col: true, noSupport: true })
    b.box(xIn, y, zB - seg / 2, 0.08, h, seg, C.glassTint, 'glass', { col: true, noSupport: true })
    b.box(xIn, y + 2.3, zc, 0.1, h - 2.3, door, C.offwhite, 'satin')
    b.box(xIn, y + h - 0.1, zc, 0.14, 0.1, len, C.anthracite, 'metal')
    // walls to neighbours (opaque)
    if (f0 > 0.001) b.box(xc, y, zA, depth, h, 0.12, C.offwhite, 'satin', { col: true })
    if (f1 < 0.999) b.box(xc, y, zB, depth, h, 0.12, C.offwhite, 'satin', { col: true })
    // name plate next to the door
    b.sign(xIn - sgn * 0.06, y + 1.6, zc + door / 2 + 0.7, 1.0, 0.32, textTexture([r.name.length > 28 ? r.name.slice(0, 28) + '…' : r.name], { w: 512, h: 128, size: 30, accent: C.green }), -sgn * Math.PI / 2, 0.4, true)
  } else {
    b.box(xIn, y, zc, 0.6, 2.2, 0.12, C.white, 'satin', { col: true })
    b.sign(xIn - sgn * 0.0, y + 1.6, zc, 0.6, 0.6, textTexture([r.name.split(' – ')[0]], { w: 256, h: 256, size: 26, accent: C.green }), -sgn * Math.PI / 2, 0.4, true)
  }
  // furniture: frame with door side (-z local) towards the centre
  const rot = sgn < 0 ? -Math.PI / 2 : Math.PI / 2
  b.at(xc, y, zc, rot + (r.flip ? Math.PI : 0), () => furnish(b, r.kind, len - 0.4, depth - 0.4, { suffix: info.suffix, name: r.name, ...r.ctx }))
  b.zone(r.name, xc, y, zc, depth, h, len, { building: info.id })
}

/** world polygons of the ground-floor openings (stair + elevator) of a generic building */
export function groundOpenings(info: BuildingInfo): [number, number][][] {
  const d = info.d
  const zBack = -d / 2
  const laneW = 1.45
  const sx0 = 0.5
  const nHalf = Math.max(2, Math.round(info.floorH / 2 / 0.175))
  const zr = zBack + 0.35
  const zf = zr + 1.5 + nHalf * 0.3
  const rects: [number, number, number, number][] = [
    [-4.05, -1.15, zBack + 0.2, zBack + 3.1],
    [sx0 - 0.1, sx0 + 2 * laneW + 0.25, zr - 0.1, zf],
  ]
  const c = Math.cos(info.rot)
  const s = Math.sin(info.rot)
  return rects.map(([x0, x1, z0, z1]) =>
    [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([lx, lz]) => [info.x + lx * c + lz * s, info.z - lx * s + lz * c] as [number, number]),
  )
}
