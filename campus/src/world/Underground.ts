/**
 * Underground level (y = −5 m):
 *  - round car park below the HQ plaza (HQ elevator + glass lift to the plaza)
 *  - car access tunnel with ramp from the ring road
 *  - pedestrian tunnels from the car park to every building, modern look with
 *    green lighting and working moving walkways (Fahrsteige), ending at the
 *    building's elevator (basement stop "UG · Tunnel & Tiefgarage")
 */
import { WorldBuilder } from '../engine/builder'
import { C, textTexture } from '../engine/materials'
import { world } from '../engine/registry'
import { BUILDINGS, GARAGE, shortName, tunnelPaths, type TunnelPath } from '../config/campus'
import { buildElevator } from './dynamic'
import * as K from './kits'
import { rand } from './rooms'

const FY = GARAGE.floorY
const H = GARAGE.ceilY - GARAGE.floorY // clear height (3.6 m)
const R = GARAGE.radius
const BELT_LEN = 24
const BELT_SPEED = 2.2
const LOD = { maxDist: 900, yMin: -40, yMax: -0.3 }

export function buildUnderground(b: WorldBuilder) {
  const tunnels = tunnelPaths()
  b.inChunk('garage', LOD, false, () => garage(b, tunnels))
  b.inChunk('tunnels', LOD, false, () => {
    for (const t of tunnels) {
      if (t.id === 't-cars') carTunnel(b, t)
      else walkTunnel(b, t)
    }
  })
  // ramp + plaza lift are visible from the surface
  b.inChunk('garage-surface', { maxDist: 600 }, true, () => {
    const car = tunnels.find((t) => t.id === 't-cars')!
    b.at(car.sx, FY, car.sz, car.rot, () => ramp(b))
    buildElevator(b, { x: GARAGE.liftX, z: GARAGE.liftZ, rot: 0, name: 'Lift Tiefgarage ↔ HQ-Platz', glass: true, stops: [{ label: 'UG · Tiefgarage', y: FY }, { label: 'HQ-Platz', y: 0 }], start: 1 })
    b.at(GARAGE.liftX, 0, GARAGE.liftZ, 0, () => {
      b.box(0, 3.4, 0.6, 4.2, 0.2, 4.6, C.white, 'satin')
      b.box(0, 3.35, 2.9, 4.2, 0.05, 0.06, C.green, 'emissive')
      b.sign(0, 3.85, 2.92, 3.6, 0.5, textTexture(['P  Tiefgarage · Tunnel'], { w: 512, h: 72, bg: '#1f5fa8' }), 0, 0.5)
    })
  })
}

/** does point (x,z) lie close to a tunnel axis extended into the car park? */
function nearLane(tunnels: TunnelPath[], x: number, z: number, margin: number) {
  for (const t of tunnels) {
    const dx = Math.sin(t.rot)
    const dz = Math.cos(t.rot)
    const px = x - t.sx
    const pz = z - t.sz
    const along = px * dx + pz * dz
    if (along < t.len - 4) continue // only the part inside the car park
    const lat = Math.abs(px * dz - pz * dx)
    if (lat < t.width / 2 + margin) return true
  }
  return false
}

// ---------------------------------------------------------------------------- car park
function garage(b: WorldBuilder, tunnels: TunnelPath[]) {
  // floor & ceiling
  b.cyl(0, FY - 0.3, 0, R + 0.6, 0.3, '#5f615f', 'satin', { segs: 64 })
  b.colCyl(0, FY - 0.3, 0, R + 0.6, 0.3)
  b.cyl(0, GARAGE.ceilY, 0, R + 0.6, 0.06, '#cfcdc7', 'matte', { segs: 64 })
  // perimeter wall (boxes so it is visible from inside) with openings for the tunnels
  const gaps = tunnels.map((t) => t.gap).sort((p, q) => p[0] - q[0])
  const TAU = Math.PI * 2
  const inGap = (a: number) => gaps.some(([g0, g1]) => {
    const n = (v: number) => ((v % TAU) + TAU) % TAU
    const span = g1 - g0
    return n(a - g0) <= span
  })
  const segN = Math.round((TAU * R) / 2.5)
  for (let i = 0; i < segN; i++) {
    const a = (i + 0.5) * (TAU / segN)
    if (inGap(a)) continue
    const x = Math.cos(a) * (R + 0.2)
    const z = Math.sin(a) * (R + 0.2)
    b.box(x, FY, z, 0.35, H, (TAU * R) / segN + 0.05, i % 6 === 0 ? C.green : '#e9e8e3', i % 6 === 0 ? 'emissive' : 'satin', { rot: -a, col: true })
  }
  // HQ core below ground (open wedge for the elevator)
  b.arc(0, FY, 0, 7, H, Math.PI / 2 + 0.3, Math.PI / 2 - 0.3 + TAU, C.white, 'satin', true, 40)
  b.colArc(0, FY, 0, 0, 7, Math.PI / 2 + 0.3, Math.PI / 2 - 0.3 + TAU, H)
  b.sign(0, FY + 2.95, 7.06, 3.2, 0.5, textTexture(['↑ Aufzug HQ · Lobby & Etagen'], { w: 640, h: 96, accent: C.green }), 0, 0.5)
  b.curvedSign(0, FY + 1.2, 0, 7.05, 1.2, (90 + 25) * (Math.PI / 180), (90 + 95) * (Math.PI / 180), textTexture(['TIEFGARAGE HQ · P –1'], { w: 1024, h: 120, bg: '#1f5fa8' }), 0.5)
  // green light rings + white light panels on the ceiling
  for (const rr of [16, 30, 44]) {
    const n = Math.round((TAU * rr) / 2.2)
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU
      b.box(Math.cos(a) * rr, GARAGE.ceilY - 0.06, Math.sin(a) * rr, 0.14, 0.05, (TAU * rr) / n * 0.8, C.green, 'emissive', { rot: -a })
    }
  }
  for (let x = -48; x <= 48; x += 12)
    for (let z = -48; z <= 48; z += 8) {
      const r = Math.hypot(x, z)
      if (r > R - 4 || r < 10) continue
      b.box(x, GARAGE.ceilY - 0.05, z, 2.4, 0.04, 0.35, '#f4fbff', 'emissive')
    }
  // columns, parking bays and parked cars
  const colors = ['#f4f5f2', '#1d1f1e', '#7c8a92', '#3b5f8a', C.green, '#9a2a2a']
  for (let x = -54; x <= 54; x += 9)
    for (let z = -54; z <= 54; z += 9) {
      const r = Math.hypot(x, z)
      if (r > R - 3 || r < 11) continue
      if (nearLane(tunnels, x, z, 3) || Math.hypot(x - GARAGE.liftX, z - GARAGE.liftZ) < 6 || (Math.abs(x) < 5 && z > 5 && z < 16)) continue
      b.box(x, FY, z, 0.55, H, 0.55, '#d9d8d3', 'satin', { col: true })
      b.box(x, FY + 0.5, z, 0.57, 0.25, 0.57, C.green, 'satin')
    }
  for (let x = -52.5; x <= 52.5; x += 2.6)
    for (const zRow of [-40.5, -31.5, -22.5, -13.5, -4.5, 4.5, 13.5, 22.5, 31.5, 40.5]) {
      for (const off of [-2.6, 2.6]) {
        const z = zRow + off
        const r = Math.hypot(x, z)
        if (r > R - 6 || r < 13) continue
        if (nearLane(tunnels, x, z, 4) || Math.hypot(x - GARAGE.liftX, z - GARAGE.liftZ) < 7 || (Math.abs(x) < 6 && z > 4 && z < 18)) continue
        b.box(x - 1.3, FY + 0.003, z, 0.1, 0.01, 5, '#e8e8e8', 'matte')
        if (rand() < 0.6) K.car(b, x, FY, z, off > 0 ? 0 : Math.PI, colors[Math.floor(rand() * colors.length)])
        else if (rand() < 0.25) K.chargingStation(b, x, z + (off > 0 ? 2.2 : -2.2), off > 0 ? Math.PI : 0, FY)
      }
    }
  b.zoneSector('Tiefgarage HQ (P –1)', 0, R, 0, TAU, FY, H)
  b.npc({ kind: 'walk', path: [[0, FY, 9], [20, FY, 30], [36, FY, 20]], loop: false })
  b.npc({ kind: 'walk', path: [[-2, FY, 9], [GARAGE.liftX + 3, FY, GARAGE.liftZ + 4]], loop: false })
}

// ---------------------------------------------------------------------------- pedestrian tunnels
function walkTunnel(b: WorldBuilder, t: TunnelPath) {
  const bd = BUILDINGS.find((x) => 't-' + x.id === t.id)!
  const name = shortName(bd) === bd.suffix ? 'Big Apple ' + bd.suffix : shortName(bd)
  const W = t.width
  const L = t.len
  b.at(t.sx, FY, t.sz, t.rot, () => {
    // shell
    b.box(0, -0.3, L / 2, W, 0.3, L, '#d9d7d1', 'gloss', { col: true })
    for (const s of [-1, 1]) {
      b.box(s * (W / 2 + 0.1), 0, L / 2, 0.2, H, L, '#f2f2ef', 'gloss', { col: true })
      b.box(s * (W / 2 - 0.02), 0.06, L / 2, 0.03, 0.06, L, C.green, 'emissive') // floor LED line
      b.box(s * (W / 2 - 0.35), H - 0.06, L / 2, 0.14, 0.04, L, C.green, 'emissive') // ceiling cove
      for (let z = 3; z < L - 1; z += 6) b.box(s * (W / 2 - 0.01), 0.3, z, 0.02, H - 0.6, 0.06, C.green, 'emissive')
    }
    b.box(0, H, L / 2, W + 0.4, 0.15, L, '#eeede8', 'matte')
    b.box(0, H - 0.05, L / 2, 0.35, 0.03, L, '#f4fbff', 'emissive')
    // end wall around the elevator door
    for (const s of [-1, 1]) b.box(s * (W / 4 + 0.75), 0, -0.05, W / 2 - 1.5, H, 0.15, '#f2f2ef', 'gloss', { col: true })
    b.sign(0, 2.75, 0.06, 3.0, 0.45, textTexture([`↑ Aufzug ${name}`], { w: 640, h: 96, accent: C.green }), 0, 0.5)
    // moving walkways: inbound (towards the car park, +z) on the right, outbound on the left
    const nSeg = Math.floor((L - 8) / (BELT_LEN + 3))
    for (let k = 0; k < nSeg; k++) {
      const zc = 4 + BELT_LEN / 2 + k * (BELT_LEN + 3)
      for (const [x, dir] of [[-1.45, 1], [1.45, -1]] as const) {
        b.box(x, 0, zc, 1.3, 0.08, BELT_LEN, '#2b2d2c', 'belt', { rot: dir > 0 ? 0 : Math.PI })
        b.colBox(x, 0, zc, 1.3, 0.08, BELT_LEN)
        for (const e of [-1, 1]) b.box(x, 0, zc + e * (BELT_LEN / 2 + 0.25), 1.4, 0.09, 0.5, '#9aa09c', 'metal')
        for (const sd of [-1, 1]) {
          const bx = x + sd * 0.72
          b.box(bx, 0.08, zc, 0.04, 0.9, BELT_LEN, C.glassTint, 'glass')
          b.box(bx, 0.98, zc, 0.09, 0.06, BELT_LEN + 0.3, C.black, 'satin')
          b.box(bx, 0.1, zc, 0.06, 0.04, BELT_LEN, C.green, 'emissive')
          b.colBox(bx, 0.08, zc, 0.1, 1.0, BELT_LEN, 0, true)
        }
        const [dx, dz] = b.dirW(0, dir)
        world.conveyors.push({ test: b.rectTest(x, zc, 1.3, BELT_LEN + 0.6), y: FY + 0.08, dx, dz, speed: BELT_SPEED })
      }
    }
    // hanging direction signs
    for (let z = 20; z < L - 10; z += 45) {
      b.box(0, H - 0.75, z, 3.6, 0.6, 0.08, C.black, 'gloss')
      b.sign(0, H - 0.45, z + 0.05, 3.4, 0.5, textTexture([`↑ Tiefgarage HQ`], { w: 512, h: 72, accent: C.green }), 0, 0.5)
      b.sign(0, H - 0.45, z - 0.05, 3.4, 0.5, textTexture([`↑ ${name}`], { w: 512, h: 72, accent: C.green }), Math.PI, 0.5)
    }
    // sign at the car park end (facing into the car park)
    b.box(0, H - 0.8, L - 0.6, W - 0.4, 0.7, 0.08, C.black, 'gloss')
    b.sign(0, H - 0.45, L - 0.55, W - 0.6, 0.6, textTexture([`→ ${name}`, `${Math.round(L)} m · Fahrsteige`], { w: 768, h: 96, accent: C.green, size: 40 }), 0, 0.6)
    b.zone(`Tunnel · ${name}`, 0, 0, L / 2, W, H, L)
    if (rand() < 0.7) b.npc({ kind: 'walk', path: [[0, 0, 2], [0, 0, L - 3]], loop: false })
  })
}

// ---------------------------------------------------------------------------- car access
function carTunnel(b: WorldBuilder, t: TunnelPath) {
  const W = t.width
  const L = t.len
  b.at(t.sx, FY, t.sz, t.rot, () => {
    b.box(0, -0.3, L / 2, W, 0.3, L, '#3e4042', 'satin', { col: true })
    for (let z = 2; z < L; z += 6) b.box(0, 0.005, z, 0.15, 0.01, 3, '#e8e8e2', 'matte')
    for (const s of [-1, 1]) {
      b.box(s * (W / 2 + 0.1), 0, L / 2, 0.2, H, L, '#e6e5e0', 'satin', { col: true })
      b.box(s * (W / 2 - 0.02), 0.06, L / 2, 0.03, 0.06, L, C.green, 'emissive')
      b.box(s * (W / 2 - 0.4), H - 0.06, L / 2, 0.14, 0.04, L, C.green, 'emissive')
    }
    b.box(0, H, L / 2, W + 0.4, 0.15, L, '#d9d8d3', 'matte')
    for (let z = 4; z < L; z += 10) b.box(0, H - 0.05, z, 2.4, 0.04, 0.35, '#f4fbff', 'emissive')
    b.sign(0, H - 0.45, L - 0.6, W - 0.6, 0.6, textTexture(['↑ Ausfahrt · Ringstraße'], { w: 768, h: 96, bg: '#1f5fa8' }), 0, 0.5)
    b.zone('Zufahrtstunnel Tiefgarage', 0, 0, L / 2, W, H, L)
  })
}

/** car ramp in the car tunnel frame: local z ∈ [-len, 0], rising outwards to ground level (local y = 5) */
function ramp(b: WorldBuilder) {
  const { len, width: W } = GARAGE.ramp
  const G = -FY // local height of ground level
  const ang = Math.atan2(G, len)
  b.boxTilt(0, G / 2 - 0.2, -len / 2, W, 0.3, Math.hypot(len, G), 0, ang, '#55575a', 'satin')
  const steps = 40
  for (let i = 0; i < steps; i++) {
    const zA = -len + (i / steps) * len
    const top = G * (1 - (i + 0.5) / steps)
    b.colBox(0, 0, zA + len / steps / 2, W, Math.max(0.02, top), len / steps)
  }
  for (const s of [-1, 1]) {
    b.box(s * (W / 2 + 0.15), 0, -len / 2, 0.3, G, len, '#bdbcb7', 'satin', { col: true })
    b.box(s * (W / 2 + 0.15), G, -len / 2, 0.3, 1.1, len, C.concrete, 'satin', { col: true, noSupport: true })
    b.box(s * (W / 2 + 0.05), 0.5, -len / 2, 0.03, 0.06, len, C.green, 'emissive')
  }
  b.box(0, G, 0.15, W + 0.6, 1.1, 0.3, C.concrete, 'satin', { col: true, noSupport: true })
  b.box(0, G + 3.6, -len + 1, W + 1, 0.25, 2, C.black, 'satin')
  b.box(0, G + 3.55, -len + 0.02, W + 1, 0.05, 0.06, C.green, 'emissive')
  b.sign(0, G + 3.95, -len - 0.02, 6.5, 0.8, textTexture(['P  Tiefgarage HQ · Einfahrt'], { w: 768, h: 96, bg: '#1f5fa8' }), Math.PI, 0.5)
  b.box(0, G + 0.01, -len - 3.5, W, 0.02, 7, '#4a4c4e', 'satin') // connection to the ring road
  world.groundHoles.push(b.rectTest(0, -len / 2, W, len))
}

export function rampCorners(): [number, number][] {
  const t = tunnelPaths().find((x) => x.id === 't-cars')!
  const { len, width: W } = GARAGE.ramp
  const c = Math.cos(t.rot)
  const s = Math.sin(t.rot)
  return [[-W / 2, -len], [W / 2, -len], [W / 2, 0], [-W / 2, 0]].map(([lx, lz]) => [t.sx + lx * c + lz * s, t.sz - lx * s + lz * c])
}
