/**
 * Campus site: terrain, roads, bike paths, fire lane, plazas, water, trees,
 * lighting, benches, signage, parking, bus stops, utility area, canal with
 * Amsterdam canal houses and the underground car park.
 */
import * as THREE from 'three'
import { WorldBuilder } from '../engine/builder'
import { C, logoTexture, textTexture, textures } from '../engine/materials'
import { BUILDINGS, DEG, GARAGE, LAKE, LAYOUT, STATIONS, polar } from '../config/campus'
import { slab } from './GenericBuilding'
import { buildElevator, infoPoint } from './dynamic'
import * as K from './kits'
import { rand } from './rooms'

const L = LAYOUT
const W = L.worldHalf

// ---------------------------------------------------------------------------
// helpers for placement checks
function insideBuilding(x: number, z: number, margin: number) {
  for (const b of BUILDINGS) {
    if (b.kind === 'hq') {
      if (Math.hypot(x, z) < L.plazaRadius + margin) return true
      continue
    }
    const dx = x - b.x
    const dz = z - b.z
    const c = Math.cos(b.rot)
    const s = Math.sin(b.rot)
    const lx = dx * c - dz * s
    const lz = dx * s + dz * c
    if (Math.abs(lx) < b.w / 2 + margin + 6 && lz > -b.d / 2 - margin - 12 && lz < b.d / 2 + margin + 18) return true
  }
  return false
}
function onPath(x: number, z: number) {
  const r = Math.hypot(x, z)
  const ang = ((Math.atan2(x, -z) / DEG) % 360 + 360) % 360
  for (const b of BUILDINGS) {
    if (b.kind === 'hq') continue
    let da = Math.abs(ang - b.angle)
    da = Math.min(da, 360 - da)
    if (da * DEG * r < 6 && r < b.radius) return true
  }
  if (Math.abs(r - L.monorailRadius) < 5) return true
  if (Math.abs(r - L.bikeRingRadius) < 4) return true
  if (Math.abs(r - L.fireLaneRadius) < 5) return true
  if (Math.abs(r - L.ringRoadRadius) < 12) return true
  if (Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 3) return true
  if (Math.abs(x) < 14 && z > 30 && z < 130) return true // HQ axis
  if (z > L.ringRoadRadius - 20 && Math.abs(x) < 80) return true // boulevard & parking
  if (x > GARAGE.x0 - 4 && x < GARAGE.x1 + 4 && z > GARAGE.z0 - 4 && z < GARAGE.z1 + 4) return true
  for (const s of STATIONS) {
    const [sx, sz] = polar(s.angle, L.monorailRadius + 5)
    if (Math.hypot(x - sx, z - sz) < 32) return true
  }
  return false
}

// ---------------------------------------------------------------------------
export function buildSite(b: WorldBuilder) {
  b.chunk('site', { maxDist: 5000 }, true)
  // ground collider: one big slab with holes for the garage ramp and lift shaft
  const r = GARAGE.ramp
  // (collision only – the visible ground is a separate textured mesh)
  b.inChunk('__collision', { maxDist: 0 }, false, () => {
    slab(b, -W, W, -W, W, 0, 1.0, [
      [r.x0, r.x1, r.z0, r.z1],
      [GARAGE.liftX - 1.45, GARAGE.liftX + 1.45, GARAGE.liftZ - 1.4, GARAGE.liftZ + 1.4],
    ], C.grass, 'matte', true)
  })
  // world boundary
  for (const [x, z, w, d] of [[0, -L.canalZ + 140, 2 * W, 1], [-W, 0, 1, 2 * W], [W, 0, 1, 2 * W], [0, W, 2 * W, 1]] as const) b.colBox(x, 0, z === -L.canalZ + 140 ? W : z, w, 20, d)
  b.colBox(0, 0, L.canalZ + 15.5, 2 * W, 1.2, 0.4, 0, true) // canal quay railing (north boundary)

  plaza(b)
  ringsAndRoads(b)
  walkways(b)
  greenery(b)
  lake(b)
  canal(b)
  parking(b)
  utility(b)
  garage(b)
}

// ---------------------------------------------------------------------------
function plaza(b: WorldBuilder) {
  // reflecting pools on both sides of the entrance axis
  for (const s of [-1, 1]) {
    b.at(s * 30, 0, 38, s * 0.35, () => {
      b.box(0, 0, 0, 10, 0.45, 26, C.stone, 'satin')
      b.box(0, 0.45, 0, 9.2, 0.02, 25.2, C.water, 'gloss')
      b.colBox(0, 0, 0, 10, 0.7, 26, 0, true)
      for (let i = 0; i < 5; i++) b.cyl(0, 0.45, -10 + i * 5, 0.06, 1.2 + (i % 2) * 0.8, '#e8f4f8', 'glass', { segs: 6 })
      b.box(0, 0.47, 0, 0.1, 0.02, 25, C.green, 'emissive')
    })
  }
  // circular bench ring + planters around the plaza
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2
    const deg = (a / DEG + 90) % 360 // compass
    if (BUILDINGS.some((bd) => bd.kind !== 'hq' && Math.min(Math.abs(bd.angle - deg), 360 - Math.abs(bd.angle - deg)) < 6)) continue
    if (Math.abs(deg - 180) < 10) continue
    const x = Math.cos(a) * 60
    const z = Math.sin(a) * 60
    if (i % 3 === 0) {
      K.planter(b, x, z, 4, 1.4, 0, -a + Math.PI / 2)
      K.tree(b, x, z, 0.8, 0.6, i)
    } else {
      K.bench(b, x, 0, z, -a - Math.PI / 2, 2.4)
    }
  }
  // flag row in front of the HQ
  for (let i = 0; i < 8; i++) K.flagPole(b, -14 + i * 4, 52, i % 2 ? C.green : C.white, 12)
  // brand monument on the plaza
  b.at(0, 0, 62, 0, () => {
    b.box(0, 0, 0, 9, 2.2, 1.0, C.white, 'gloss', { col: true })
    b.sign(0, 1.1, 0.51, 8.6, 1.6, logoTexture('Groups', { bg: '#ffffff', w: 1600, h: 300 }), 0, 0.5)
    b.sign(0, 1.1, -0.51, 8.6, 1.6, logoTexture('Groups', { bg: '#ffffff', w: 1600, h: 300 }), Math.PI, 0.5)
    b.box(0, 0, 0.55, 9, 0.08, 0.04, C.green, 'emissive')
  })
  infoPoint(b, 3, 1.2, 64, 'Big Apple Global Campus Amsterdam', [
    'Internationaler Hauptsitz der Big Apple Groups.',
    'Zentrum: Holding-Headquarter (rund, 22 Etagen). Umgeben von 10 Unternehmenszentralen, Besucher- & Konferenzzentrum und Campus-Hotel.',
    'Monorail-Rundkurs mit 5 Stationen · Parkhaus unter dem Besucherzentrum · Campussee mit Foundation.',
  ], { label: 'Campus-Info lesen' })
  // covered walkway from HQ entrance to the monorail station
  for (let z = 42; z <= 104; z += 6) {
    for (const s of [-1, 1]) b.cyl(s * 3.2, 0, z, 0.12, 3.6, C.anthracite, 'metal', { col: true, segs: 8 })
  }
  b.box(0, 3.6, 73, 7.6, 0.2, 64, C.white, 'satin')
  b.box(0, 3.55, 73, 0.15, 0.06, 64, C.green, 'emissive')
  b.sign(0, 2.8, 41.8, 5.5, 0.6, textTexture(['→ Monorail · Station Holding HQ'], { w: 768, h: 96, accent: C.green }), 0, 0.5, true)
  b.zone('HQ-Vorplatz', 0, 0, 40, 60, 6, 40)
}

// ---------------------------------------------------------------------------
function ringsAndRoads(b: WorldBuilder) {
  // centre line dashes on the ring road
  const R = L.ringRoadRadius
  const n = Math.floor((2 * Math.PI * R) / 9)
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    b.box(Math.cos(a) * R, 0.035, Math.sin(a) * R, 0.15, 0.01, 3.5, '#e8e8e2', 'matte', { rot: -a + Math.PI / 2 + Math.PI / 2 })
  }
  // street lamps along the ring road (inner side) + trees on both sides
  const nl = Math.floor((2 * Math.PI * R) / 32)
  for (let i = 0; i < nl; i++) {
    const a = (i / nl) * Math.PI * 2
    const deg = ((Math.atan2(Math.cos(a) * R, -Math.sin(a) * R) / DEG) % 360 + 360) % 360
    if (Math.abs(deg - 180) < 5) continue
    K.streetLamp(b, Math.cos(a) * (R - 8.5), Math.sin(a) * (R - 8.5), -a - Math.PI / 2, 0, 7)
    K.tree(b, Math.cos(a + 0.03) * (R + 11), Math.sin(a + 0.03) * (R + 11), 1.0, 0, i)
    K.tree(b, Math.cos(a + 0.06) * (R - 11.5), Math.sin(a + 0.06) * (R - 11.5), 0.9, 0, i + 1)
  }
  // fire lane signs
  for (let i = 0; i < 8; i++) {
    const [x, z] = polar(i * 45 + 20, L.fireLaneRadius + 4)
    b.at(x, 0, z, 0, () => {
      b.box(0, 0, 0, 0.08, 2.2, 0.08, C.anthracite, 'metal', { col: true })
      b.sign(0, 2.25, 0.05, 0.9, 0.6, textTexture(['Feuerwehr', 'zufahrt'], { w: 256, h: 170, bg: '#b3261e' }), 0, 0.3, true)
    })
  }
  // boulevard (south access) with tree rows and gate
  const z0 = R + 6
  for (let z = z0 + 6; z < W - 10; z += 14) {
    for (const s of [-1, 1]) {
      K.tree(b, s * 12, z, 1.1, 0, Math.floor(z))
      K.streetLamp(b, s * 10, z + 7, s > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 7)
    }
    b.box(-4, 0.035, z, 0.15, 0.01, 4, '#e8e8e2', 'matte')
    b.box(4, 0.035, z, 0.15, 0.01, 4, '#e8e8e2', 'matte')
  }
  // campus entrance monument at the boulevard
  b.at(0, 0, R + 30, 0, () => {
    for (const s of [-1, 1]) {
      b.box(s * 14, 0, 0, 6, 3.2, 1.2, C.white, 'gloss', { col: true })
      b.sign(s * 14, 1.6, 0.61, 5.6, 1.05, logoTexture('Groups', { bg: '#ffffff', w: 1024, h: 192 }), 0, 0.5)
      b.sign(s * 14, 0.45, 0.61, 5.6, 0.5, textTexture(['GLOBAL CAMPUS · AMSTERDAM'], { w: 1024, h: 96, bg: '#ffffff' }), 0, 0.4)
      b.box(s * 14, 3.2, 0, 6, 0.08, 1.2, C.green, 'emissive')
    }
  })
  // bus stops (both sides of the ring road near the boulevard)
  for (const [ang, off, rot] of [[171, 9.5, 0], [189, -9.5, Math.PI]] as const) {
    const [x, z] = polar(ang, R + off)
    const a = ang * DEG
    b.at(x, 0, z, -a + rot, () => busStop(b))
  }
  // delivery spurs to the buildings' backs
  for (const bd of BUILDINGS) {
    if (bd.kind === 'hq' || bd.radius < 120) continue
    const rBack = bd.radius + bd.d / 2
    const len = R - 6 - rBack
    const [x, z] = polar(bd.angle, rBack + len / 2)
    b.box(x, 0.01, z, 7, 0.02, len, '#4a4c4e', 'satin', { rot: bd.rot })
    const [sx, sz] = polar(bd.angle + 3, R - 9)
    b.at(sx, 0, sz, bd.rot + Math.PI, () => {
      b.box(0, 0, 0, 0.08, 2.4, 0.08, C.anthracite, 'metal', { col: true })
      b.sign(0, 2.4, 0.05, 1.6, 0.5, textTexture(['Anlieferung', bd.suffix === 'Groups' ? 'Besucherzentrum' : 'Big Apple ' + bd.suffix], { w: 384, h: 120, accent: C.green }), 0, 0.3, true)
    })
  }
}

function busStop(b: WorldBuilder) {
  b.box(0, 0, 0, 7, 0.15, 2.6, C.concrete, 'satin', { col: true })
  b.box(0, 2.6, 0, 6.6, 0.12, 2.2, C.black, 'satin')
  b.box(0, 0.15, -1.0, 6.2, 2.45, 0.04, C.glassTint, 'glass', { col: true, noSupport: true })
  for (const s of [-3.1, 3.1]) b.box(s, 0.15, -0.9, 0.1, 2.45, 0.1, C.anthracite, 'metal')
  K.bench(b, 0, 0.15, -0.6, 0, 3)
  b.box(3.6, 0, 0.8, 0.1, 3.2, 0.1, C.anthracite, 'metal')
  b.sign(3.6, 2.6, 0.86, 0.9, 0.9, textTexture(['H', 'Big Apple', 'Campus'], { w: 256, h: 256, bg: C.green }), 0, 0.4, true)
  b.sign(0, 2.75, 1.11, 4, 0.3, textTexture(['Haltestelle Big Apple Campus · Linie 15, 22, N85'], { w: 1024, h: 72 }), 0, 0.4)
  b.npc({ kind: 'stand', x: -1.5, y: 0.15, z: 0.4, yaw: 0 })
  b.npc({ kind: 'stand', x: 2.0, y: 0.15, z: 0.2, yaw: 0.4 })
  b.zone('Bushaltestelle', 0, 0, 0, 8, 4, 4)
}

// ---------------------------------------------------------------------------
function walkways(b: WorldBuilder) {
  for (const bd of BUILDINGS) {
    if (bd.kind === 'hq') continue
    const rFront = bd.radius - bd.d / 2 - 1
    const r0 = L.plazaRadius - 2
    if (rFront <= r0) continue
    const len = rFront - r0
    const [x, z] = polar(bd.angle, r0 + len / 2)
    b.box(x, 0.012, z, 6, 0.02, len, '#cdc7bb', 'satin', { rot: bd.rot })
    // bollard lights along the walkway
    for (let t = 6; t < len; t += 12) {
      for (const s of [-1, 1]) {
        const [px, pz] = polar(bd.angle + (s * 3.6) / ((r0 + t) * DEG), r0 + t)
        K.bollardLight(b, px, pz)
      }
    }
    // wayfinding pylon at the plaza edge
    const [wx, wz] = polar(bd.angle + 3.5 / (L.plazaRadius * DEG) * 1.2, L.plazaRadius + 2)
    b.at(wx, 0, wz, bd.rot + Math.PI, () => {
      b.box(0, 0, 0, 1.0, 2.6, 0.25, C.white, 'gloss', { col: true })
      b.sign(0, 1.6, 0.13, 0.95, 0.95, textTexture(['↑ ' + (bd.suffix === 'Groups' ? 'Besucherzentrum' : bd.suffix), `${Math.round(rFront - L.plazaRadius)} m`], { w: 256, h: 256, size: 40, accent: C.green }), 0, 0.4)
      b.sign(0, 1.6, -0.13, 0.95, 0.95, textTexture(['↓ HQ', 'Plaza'], { w: 256, h: 256, size: 40, accent: C.green }), Math.PI, 0.4)
      b.box(0, 2.6, 0, 1.0, 0.06, 0.25, C.green, 'emissive')
    })
    // bike racks near each building
    const [bx, bz] = polar(bd.angle + 7 / (rFront * DEG), rFront - 6)
    K.bikeRack(b, bx, bz, bd.rot, 6)
    // pedestrians walking between plaza and building
    const [ax, az] = polar(bd.angle - 0.6 / (r0 * DEG), r0 + 2)
    const [ex, ez] = polar(bd.angle - 0.6 / (rFront * DEG), rFront)
    b.npc({ kind: 'walk', path: [[ax, 0, az], [ex, 0, ez]], loop: false })
    const [ax2, az2] = polar(bd.angle + 1.2 / (r0 * DEG), r0 + 6)
    const [ex2, ez2] = polar(bd.angle + 1.2 / (rFront * DEG), rFront - 1)
    b.npc({ kind: 'walk', path: [[ex2, 0, ez2], [ax2, 0, az2]], loop: false })
  }
  // walkers on the plaza ring and cyclists on the bike ring
  for (let i = 0; i < 10; i++) {
    const pts: [number, number, number][] = []
    const off = rand() * Math.PI * 2
    const rr = 44 + rand() * 20
    for (let k = 0; k <= 24; k++) {
      const a = off + ((i % 2 ? 1 : -1) * k * Math.PI * 2) / 24
      pts.push([Math.cos(a) * rr, 0, Math.sin(a) * rr])
    }
    b.npc({ kind: 'walk', path: pts, loop: true })
  }
  for (let i = 0; i < 8; i++) {
    const pts: [number, number, number][] = []
    const off = (i / 8) * Math.PI * 2
    const rr = L.bikeRingRadius + (i % 2 ? 0.8 : -0.8)
    for (let k = 0; k <= 48; k++) {
      const a = off + ((i % 2 ? 1 : -1) * k * Math.PI * 2) / 48
      pts.push([Math.cos(a) * rr, 0, Math.sin(a) * rr])
    }
    b.npc({ kind: 'bike', path: pts, loop: true, speed: 4.5 + rand() * 1.5 })
  }
  // visitors walking from the bus stop / parking towards the conference centre
  b.npc({ kind: 'walk', path: [[-6, 0, L.ringRoadRadius + 20], [-6, 0, 236], [-30, 0, 200], [-20, 0, 150]], loop: false })
  b.npc({ kind: 'walk', path: [[6, 0, L.ringRoadRadius + 40], [6, 0, 236], [30, 0, 196], [12, 0, 142]], loop: false })
  // seated people on plaza benches
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4
    b.npc({ kind: 'stand', x: Math.cos(a) * 56, y: 0, z: Math.sin(a) * 56, yaw: -a - Math.PI / 2 })
  }
}

// ---------------------------------------------------------------------------
function greenery(b: WorldBuilder) {
  let placed = 0
  for (let i = 0; i < 2600 && placed < 260; i++) {
    const a = rand() * Math.PI * 2
    const r = 78 + rand() * 330
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    if (Math.abs(x) > W - 8 || z > W - 8 || z < L.canalZ + 20) continue
    if (insideBuilding(x, z, 3) || onPath(x, z)) continue
    K.tree(b, x, z, 0.8 + rand() * 0.6, 0, Math.floor(rand() * 9))
    placed++
  }
  // benches & lamps along the bike ring
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2 + 0.05
    const x = Math.cos(a) * (L.bikeRingRadius - 3.5)
    const z = Math.sin(a) * (L.bikeRingRadius - 3.5)
    if (onPathStrict(x, z)) continue
    if (i % 2) K.bench(b, x, 0, z, -a + Math.PI / 2, 2)
    else K.streetLamp(b, x, z, -a - Math.PI / 2, 0, 5)
    if (i % 4 === 0) K.bin(b, x + Math.cos(a + 1.5) * 1.6, z + Math.sin(a + 1.5) * 1.6)
  }
}
function onPathStrict(x: number, z: number) {
  const r = Math.hypot(x, z)
  const ang = ((Math.atan2(x, -z) / DEG) % 360 + 360) % 360
  for (const b of BUILDINGS) {
    if (b.kind === 'hq') continue
    let da = Math.abs(ang - b.angle)
    da = Math.min(da, 360 - da)
    if (da * DEG * r < 7) return true
  }
  for (const s of STATIONS) {
    let da = Math.abs(ang - s.angle)
    da = Math.min(da, 360 - da)
    if (da * DEG * r < 30) return true
  }
  return Math.hypot(x - LAKE.x, z - LAKE.z) < LAKE.r + 4
}

function lake(b: WorldBuilder) {
  b.colCyl(LAKE.x, -1, LAKE.z, LAKE.r, 2.2, { noSupport: true })
  b.arc(LAKE.x, -0.6, LAKE.z, LAKE.r + 0.6, 0.8, 0, Math.PI * 2, C.stone, 'satin', true, 64)
  b.arc(LAKE.x, 0.15, LAKE.z, LAKE.r + 0.6, 0.06, 0, Math.PI * 2, '#bdb6a8', 'satin', true, 64)
  // jetty / viewing deck
  b.at(LAKE.x, 0, LAKE.z, 0, () => {
    b.box(LAKE.r - 3, 0.1, 0, 8, 0.15, 3, '#9b7652', 'satin')
    K.bench(b, LAKE.r + 0.5, 0, 0, -Math.PI / 2, 2.4)
  })
  b.zone('Campussee', LAKE.x, -1, LAKE.z, LAKE.r * 2 + 6, 6, LAKE.r * 2 + 6)
  infoPoint(b, LAKE.x + LAKE.r + 2.5, 1.2, LAKE.z + 2, 'Campussee', ['Regenwasser-Rückhaltebecken und Biotop.', 'Die Monorail überquert den See auf ihrem Rundkurs.', 'Am Ufer: Big Apple Foundation.'])
}

function canal(b: WorldBuilder) {
  const z = L.canalZ
  // quay walls
  b.box(0, -1.4, z + 15.2, 2 * W, 1.4, 0.6, C.brick, 'satin')
  b.box(0, -1.4, z - 15.2, 2 * W, 1.4, 0.6, C.brick, 'satin')
  // railing on the campus side
  for (let x = -W + 4; x < W; x += 3) b.box(x, 0, z + 15.5, 0.06, 1.1, 0.06, C.black, 'metal')
  b.box(0, 1.05, z + 15.5, 2 * W, 0.05, 0.06, C.black, 'metal')
  // house boats
  for (let i = 0; i < 6; i++) {
    const x = -300 + i * 110
    b.at(x, -0.7, z + 9, 0, () => {
      b.box(0, 0, 0, 16, 0.9, 4.5, '#2d3b33', 'satin')
      b.box(-1, 0.9, 0, 11, 2.2, 4, i % 2 ? '#e8e2d4' : '#5b7a62', 'satin')
      b.box(-1, 3.1, 0, 11.4, 0.15, 4.4, C.black, 'satin')
      for (let k = 0; k < 4; k++) b.box(-5 + k * 2.6, 1.6, 2.02, 1.2, 0.9, 0.04, '#fff1d0', 'nightglow')
    })
  }
  // canal houses on the far side
  const colors = ['#6b3a2a', '#7d4a32', '#4b3a32', '#8c5a3c', '#3f3a36', '#5e3328', '#9a7b5c']
  let x = -W + 6
  let i = 0
  while (x < W - 6) {
    const w = 5.5 + (i % 3) * 0.8
    const h = 13 + ((i * 7) % 4) * 1.5
    const zz = z - 22
    const col = colors[i % colors.length]
    b.box(x, -0.5, zz, w, h + 0.5, 10, col, 'satin')
    // gable (stepped / bell)
    b.box(x, h, zz + 4.9, w * 0.7, 2.2, 0.2, col, 'satin')
    b.box(x, h + 2.2, zz + 4.9, w * 0.35, 1.0, 0.2, col, 'satin')
    b.boxTilt(x - w * 0.22, h - 0.6, zz, w * 0.6, 0.2, 10, 0, 0, '#2c2c2c', 'satin')
    for (let f = 0; f < 4; f++) {
      for (let k = 0; k < 2; k++) {
        const wx = x - w / 4 + k * (w / 2)
        const wy = 1 + f * 3.2
        b.box(wx, wy, zz + 5.02, 1.1, 1.8, 0.05, '#2e3a40', 'gloss')
        b.box(wx, wy + 1.8, zz + 5.03, 1.2, 0.12, 0.06, C.white, 'satin')
        if ((i + f + k) % 3 !== 0) b.box(wx, wy + 0.05, zz + 5.06, 1.0, 1.7, 0.02, '#ffd9a0', 'nightglow')
      }
    }
    x += w + 0.15
    i++
  }
}

// ---------------------------------------------------------------------------
function parking(b: WorldBuilder) {
  // visitor parking lots flanking the boulevard
  const R = L.ringRoadRadius
  for (const s of [-1, 1]) {
    const cx = s * 46
    const cz = R + 48
    // cars
    for (let row = 0; row < 4; row++) {
      for (let i = 0; i < 12; i++) {
        if (rand() < 0.3) continue
        const x = cx - 28 + i * 5 + 2
        const z = cz - 22 + row * 14 + (row % 2 ? 2.8 : -2.8)
        K.car(b, x, 0, z, row % 2 ? 0 : Math.PI, ['#f4f5f2', '#1d1f1e', '#7c8a92', '#3b5f8a', C.green, '#9a2a2a'][Math.floor(rand() * 6)])
      }
    }
    for (let i = 0; i < 6; i++) K.chargingStation(b, cx - 28 + i * 10 + 2, cz - 25.5, 0)
    K.streetLamp(b, cx - 20, cz, 0, 0, 8)
    K.streetLamp(b, cx + 20, cz, 0, 0, 8)
    b.at(cx, 0, cz - 30, s > 0 ? -0.3 : 0.3, () => {
      b.box(0, 0, 0, 0.12, 3, 0.12, C.anthracite, 'metal', { col: true })
      b.sign(0, 2.4, 0.07, 2.4, 1.2, textTexture(['P', 'Besucher'], { w: 256, h: 128, bg: '#1f5fa8' }), 0, 0.4, true)
    })
    b.zone('Besucherparkplatz', cx, 0, cz, 64, 5, 60)
  }
  // e-bike station at the boulevard
  K.bikeRack(b, -16, R + 16, Math.PI / 2, 10)
  K.bikeRack(b, 16, R + 16, Math.PI / 2, 10)
}

function utility(b: WorldBuilder) {
  // technical supply area (energy centre) outside the ring road, north-east
  const [x, z] = polar(78, L.ringRoadRadius + 46)
  b.at(x, 0, z, -78 * DEG, () => {
    b.box(0, 0, 0, 34, 7, 18, '#9aa09c', 'satin', { col: true })
    b.box(0, 7, 0, 34.4, 0.4, 18.4, C.anthracite, 'satin')
    for (let i = 0; i < 4; i++) {
      b.cyl(-12 + i * 8, 7.4, 0, 2.6, 3.2, '#c7ccc9', 'metal', { segs: 18 })
      b.cyl(-12 + i * 8, 10.6, 0, 2.4, 0.2, C.anthracite, 'metal', { segs: 18 })
    }
    for (let i = 0; i < 3; i++) b.box(-10 + i * 10, 0, 14, 4, 3, 3, '#7d8582', 'metal', { col: true })
    // fence
    b.colBox(0, 0, 18, 44, 2.4, 0.2, 0, true)
    b.colBox(-22, 0, 4, 0.2, 2.4, 28, 0, true)
    b.colBox(22, 0, 4, 0.2, 2.4, 28, 0, true)
    for (let i = 0; i <= 22; i++) b.box(-22 + i * 2, 0, 18, 0.06, 2.4, 0.06, '#8a8f8c', 'metal')
    b.box(0, 2.3, 18, 44, 0.05, 0.05, '#8a8f8c', 'metal')
    b.sign(0, 5, 9.05, 8, 1.2, textTexture(['Energiezentrale', 'Technische Versorgung · Big Apple Campus'], { w: 768, h: 128, accent: C.green }), 0, 0.4)
    // solar field
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) b.boxTilt(-15 + i * 6, 0.8, -16 - r * 4, 5, 0.06, 2.4, 0, -0.5, '#1f2a3a', 'gloss')
  })
  b.zone('Energiezentrale', x, 0, z, 46, 12, 40)
}

// ---------------------------------------------------------------------------
function garage(b: WorldBuilder) {
  const G = GARAGE
  const y0 = G.floorY
  const cx = (G.x0 + G.x1) / 2
  const cz = (G.z0 + G.z1) / 2
  const gw = G.x1 - G.x0
  const gd = G.z1 - G.z0
  b.inChunk('garage', { maxDist: 120, yMin: -30, yMax: 60 }, false, () => {
    // floor, ceiling, walls
    b.box(cx, y0 - 0.3, cz, gw, 0.3, gd, '#6d6e6c', 'satin', { col: true })
    b.box(cx, -1.05, cz, gw, 0.05, gd, '#b9b8b3', 'matte')
    const wallH = -1 - y0
    b.box(cx, y0, G.z0, gw, wallH, 0.3, '#a8a7a2', 'matte', { col: true })
    b.box(cx, y0, G.z1, gw, wallH, 0.3, '#a8a7a2', 'matte', { col: true })
    b.box(G.x0, y0, cz, 0.3, wallH, gd, '#a8a7a2', 'matte', { col: true })
    b.box(G.x1, y0, cz, 0.3, wallH, gd, '#a8a7a2', 'matte', { col: true })
    b.box(cx, y0 + 0.9, G.z0 + 0.16, gw, 0.25, 0.02, C.green, 'satin')
    // ramp (visual slope + step colliders)
    const r = G.ramp
    const rl = r.z1 - r.z0
    const ang = Math.atan2(-y0, rl)
    b.boxTilt((r.x0 + r.x1) / 2, y0 / 2 - 0.15, (r.z0 + r.z1) / 2, r.x1 - r.x0, 0.3, Math.hypot(rl, y0), 0, ang, '#5c5d5b', 'satin')
    const steps = 40
    for (let i = 0; i < steps; i++) {
      const zA = r.z0 + (i / steps) * rl
      const top = y0 + ((i + 0.5) / steps) * -y0
      b.colBox((r.x0 + r.x1) / 2, y0, zA + rl / steps / 2, r.x1 - r.x0, top - y0, rl / steps)
    }
    // ramp side walls (below ground: inner wall; above ground: low walls)
    b.box(r.x1 + 0.15, y0, (r.z0 + r.z1) / 2, 0.3, -y0, rl, '#a8a7a2', 'matte', { col: true })
    for (const x of [r.x0 - 0.15, r.x1 + 0.15]) b.box(x, 0, (r.z0 + r.z1) / 2, 0.3, 1.1, rl, C.concrete, 'satin', { col: true, noSupport: true })
    b.box((r.x0 + r.x1) / 2, 0, r.z0 - 0.15, r.x1 - r.x0 + 0.6, 1.1, 0.3, C.concrete, 'satin', { col: true, noSupport: true })
    b.box((r.x0 + r.x1) / 2, 3.6, r.z1 - 1, r.x1 - r.x0 + 1, 0.25, 2, C.black, 'satin')
    b.sign((r.x0 + r.x1) / 2, 3.95, r.z1 + 0.02, 6.5, 0.8, textTexture(['P  Parkhaus · Einfahrt'], { w: 768, h: 96, bg: '#1f5fa8' }), 0, 0.5)
    // access road from the ring road to the ramp
    b.box((r.x0 + r.x1) / 2, 0.01, r.z1 + 7, r.x1 - r.x0, 0.02, 14, '#4a4c4e', 'satin')
    // columns grid + parked cars + lights
    for (let x = G.x0 + 8; x < G.x1 - 2; x += 8) {
      for (let z = G.z0 + 9; z < G.z1 - 4; z += 10) {
        if (x < r.x1 + 2) continue
        b.box(x, y0, z, 0.5, wallH, 0.5, '#b4b3ae', 'matte', { col: true })
        b.box(x, y0 + 0.4, z, 0.52, 0.3, 0.52, C.green, 'satin')
      }
    }
    for (let x = r.x1 + 3; x < G.x1 - 2; x += 2.6) {
      for (const [z, rot] of [[G.z0 + 3, 0], [G.z1 - 3, Math.PI], [cz - 2.6, Math.PI], [cz + 2.6, 0]] as const) {
        b.box(x - 1.3, y0 + 0.002, z, 0.1, 0.01, 5, '#e8e8e8', 'matte')
        if (Math.abs(x - G.liftX) < 4 && z < cz) continue
        if (rand() < 0.62) K.car(b, x, y0, z, rot, ['#f4f5f2', '#1d1f1e', '#7c8a92', '#3b5f8a', C.green][Math.floor(rand() * 5)])
      }
    }
    for (let i = 0; i < 8; i++) K.chargingStation(b, r.x1 + 4 + i * 2.6, G.z1 - 0.4, Math.PI, y0)
    b.sign(r.x1 + 13, y0 + 2.3, G.z1 - 0.17, 6, 0.6, textTexture(['E-Ladestationen · Big Apple Mobility'], { w: 768, h: 80, accent: C.green }), Math.PI)
    for (let z = G.z0 + 4; z < G.z1; z += 6) b.box(cx, -1.12, z, gw - 4, 0.06, 0.2, '#f6fbff', 'emissive')
    b.sign(G.liftX, y0 + 2.9, G.liftZ - 1.62, 3, 0.5, textTexture(['↑ Aufzug zum Campus'], { w: 512, h: 80, accent: C.green }), Math.PI, 0.5, true)
    b.sign(cx, y0 + 2.4, G.z0 + 0.2, 6, 0.9, textTexture(['P –1', 'Parkhaus Big Apple Campus'], { w: 512, h: 128, bg: '#1f5fa8' }), 0, 0.5)
    b.zone('Tiefgarage (P –1)', cx, y0, cz, gw, 3.6, gd)
    b.npc({ kind: 'walk', path: [[r.x1 + 6, y0, cz], [G.liftX - 3, y0, cz], [G.liftX - 3, y0, G.liftZ - 3]], loop: false })
  })
  // lift (two stops) with a glass pavilion at ground level
  b.inChunk('garage-lift', { maxDist: 300 }, true, () => {
    buildElevator(b, { x: G.liftX, z: G.liftZ, rot: Math.PI, name: 'Parkhaus-Aufzug', glass: true, stops: [{ label: 'P –1 Parkhaus', y: y0 }, { label: 'Campus (EG)', y: 0 }], start: 1 })
    b.at(G.liftX, 0, G.liftZ, Math.PI, () => {
      b.box(0, 3.4, 0.6, 4.2, 0.2, 4.6, C.white, 'satin')
      b.box(0, 3.35, 2.9, 4.2, 0.05, 0.06, C.green, 'emissive')
      b.sign(0, 3.85, 2.92, 3.6, 0.5, textTexture(['P  Parkhaus –1'], { w: 512, h: 72, bg: '#1f5fa8' }), 0, 0.5)
    })
  })
}

// ---------------------------------------------------------------------------
// Textured big surfaces (not instanced)
export function buildGroundMeshes(): THREE.Object3D[] {
  const t = textures()
  const out: THREE.Object3D[] = []
  const flat = (geo: THREE.BufferGeometry, mat: THREE.Material, y: number) => {
    const m = new THREE.Mesh(geo, mat)
    m.rotation.x = -Math.PI / 2
    m.position.y = y
    m.receiveShadow = true
    m.matrixAutoUpdate = false
    m.updateMatrix()
    out.push(m)
    return m
  }
  const tex = (base: THREE.Texture, rep: number) => {
    const c = base.clone()
    c.needsUpdate = true
    c.repeat.set(rep, rep)
    return c
  }
  // grass with holes (lake, canal, ramp, garage lift shaft)
  const s = new THREE.Shape()
  s.moveTo(-W, -W)
  s.lineTo(W, -W)
  s.lineTo(W, W)
  s.lineTo(-W, W)
  s.lineTo(-W, -W)
  const hole = (x0: number, x1: number, z0: number, z1: number) => {
    // shape lives in XY with y = -z (after the -90° rotation)
    const h = new THREE.Path()
    h.moveTo(x0, -z0)
    h.lineTo(x0, -z1)
    h.lineTo(x1, -z1)
    h.lineTo(x1, -z0)
    h.lineTo(x0, -z0)
    s.holes.push(h)
  }
  const lh = new THREE.Path()
  lh.absarc(LAKE.x, -LAKE.z, LAKE.r + 0.5, 0, Math.PI * 2, false)
  s.holes.push(lh)
  hole(GARAGE.ramp.x0, GARAGE.ramp.x1, GARAGE.ramp.z0, GARAGE.ramp.z1)
  hole(GARAGE.liftX - 1.45, GARAGE.liftX + 1.45, GARAGE.liftZ - 1.4, GARAGE.liftZ + 1.4)
  // the canal is cut by shrinking the ground on the north side instead
  const gs = new THREE.Shape()
  void gs
  const grassGeo = new THREE.ShapeGeometry(s, 64)
  const grassTex = tex(t.grass, 1 / 7)
  flat(grassGeo, new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.95, color: '#c9dbb8' }), -0.01)

  // plaza
  flat(new THREE.CircleGeometry(L.plazaRadius, 96), new THREE.MeshStandardMaterial({ map: tex(t.paving, 22), roughness: 0.75 }), 0.004)
  // HQ axis to the station
  const axis = new THREE.PlaneGeometry(16, 60)
  const ax = flat(axis, new THREE.MeshStandardMaterial({ map: tex(t.paving, 6), roughness: 0.75 }), 0.006)
  ax.position.set(0, 0.006, 100)
  ax.updateMatrix()
  // rings: monorail service path, bike path, fire lane, ring road + sidewalks
  const ringMesh = (r0: number, r1: number, mat: THREE.Material, y: number) => flat(new THREE.RingGeometry(r0, r1, 256, 1), mat, y)
  ringMesh(L.bikeRingRadius - 1.8, L.bikeRingRadius + 1.8, new THREE.MeshStandardMaterial({ map: tex(t.bike, 40), roughness: 0.85 }), 0.008)
  ringMesh(L.fireLaneRadius - 3, L.fireLaneRadius + 3, new THREE.MeshStandardMaterial({ map: tex(t.paving, 60), roughness: 0.8, color: '#d8d2c6' }), 0.007)
  ringMesh(L.fireLaneRadius - 3.2, L.fireLaneRadius - 3.0, new THREE.MeshBasicMaterial({ color: '#b3261e' }), 0.012)
  ringMesh(L.fireLaneRadius + 3.0, L.fireLaneRadius + 3.2, new THREE.MeshBasicMaterial({ color: '#b3261e' }), 0.012)
  const R = L.ringRoadRadius
  const hw = L.ringRoadWidth / 2
  ringMesh(R - hw, R + hw, new THREE.MeshStandardMaterial({ map: tex(t.asphalt, 120), roughness: 0.9 }), 0.01)
  ringMesh(R - hw - 3, R - hw, new THREE.MeshStandardMaterial({ map: tex(t.paving, 120), roughness: 0.8 }), 0.012)
  ringMesh(R + hw, R + hw + 3, new THREE.MeshStandardMaterial({ map: tex(t.paving, 120), roughness: 0.8 }), 0.012)
  ringMesh(R + hw + 3, R + hw + 5.5, new THREE.MeshStandardMaterial({ map: tex(t.bike, 120), roughness: 0.85 }), 0.011)
  // boulevard
  const bl = W - R
  const blv = flat(new THREE.PlaneGeometry(16, bl), new THREE.MeshStandardMaterial({ map: tex(t.asphalt, 10), roughness: 0.9 }), 0.009)
  blv.position.set(0, 0.009, R + bl / 2)
  blv.updateMatrix()
  for (const sx of [-1, 1]) {
    const sw = flat(new THREE.PlaneGeometry(4, bl), new THREE.MeshStandardMaterial({ map: tex(t.paving, 10), roughness: 0.8 }), 0.011)
    sw.position.set(sx * 10, 0.011, R + bl / 2)
    sw.updateMatrix()
    // parking lots
    const pl = flat(new THREE.PlaneGeometry(64, 60), new THREE.MeshStandardMaterial({ map: (() => { const c = t.parking.clone(); c.needsUpdate = true; c.repeat.set(64 / 20, 60 / 20); return c })(), roughness: 0.9 }), 0.01)
    pl.position.set(sx * 46, 0.01, R + 48)
    pl.updateMatrix()
  }
  // water
  const water = new THREE.MeshStandardMaterial({ map: tex(t.water, 6), roughness: 0.08, metalness: 0.3, envMapIntensity: 1.5 })
  water.userData.animated = true
  const lakeM = flat(new THREE.CircleGeometry(LAKE.r + 0.6, 64), water, -0.55)
  lakeM.position.set(LAKE.x, -0.55, LAKE.z)
  lakeM.updateMatrix()
  const canalM = flat(new THREE.PlaneGeometry(2 * W, 30), water, -0.9)
  canalM.position.set(0, -0.9, L.canalZ)
  canalM.updateMatrix()
  // street-side ground beyond the canal (city)
  const city = flat(new THREE.PlaneGeometry(2 * W, 120), new THREE.MeshStandardMaterial({ map: tex(t.paving, 30), roughness: 0.8, color: '#bdb6aa' }), -0.4)
  city.position.set(0, -0.4, L.canalZ - 75)
  city.updateMatrix()
  // garage ramp opening edge is handled by the builder
  return out
}

export { insideBuilding }
