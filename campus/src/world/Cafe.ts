/**
 * Big Apple Café – small two-storey coffee house at the HQ plaza, in the style
 * of the Foundation building (brick piers, wooden fins, lots of glass, green roof).
 *
 *  EG   barista counter with food display, menu boards, café tables, window bar,
 *       little wooden huts to sit in, lounge corner, free-standing stair
 *  1. OG  work café: communal table with laptops & lamps, window counter with
 *       sockets, huts for calls / focus work, lounge with armchairs
 *
 * Local frame: front (entrance, terrace) at +z, facing the HQ plaza.
 */
import { WorldBuilder } from '../engine/builder'
import { C, logoTexture, textTexture } from '../engine/materials'
import { buildingById } from '../config/campus'
import { buildEntrance, buildStair, infoPoint, seat } from './dynamic'
import { slab } from './GenericBuilding'
import * as K from './kits'
import { toast } from '../state/store'

const W = 26
const D = 18
const FH = 4.2
const H = 2 * FH
const WOOD = '#b07a4a'
const WOOD_LIGHT = '#caa274'
const FLOOR = '#c7a77f'
const STONE = '#e7e2d8'

const MENU: [string, string][] = [
  ['Espresso', '2,40 €'], ['Cappuccino', '3,60 €'], ['Flat White', '3,90 €'], ['Latte Macchiato', '3,80 €'],
  ['Matcha Latte', '4,20 €'], ['Chai Latte', '4,00 €'], ['Croissant', '2,50 €'], ['Zimtschnecke', '3,20 €'],
  ['Bagel mit Avocado', '5,90 €'], ['Tagessuppe', '5,50 €'], ['Bowl des Tages', '8,90 €'], ['Apple Crumble', '3,90 €'],
]

export function buildCafe(b: WorldBuilder) {
  const info = buildingById('cafe')
  b.at(info.x, 0, info.z, info.rot, () => {
    b.inChunk('cafe-ext', { maxDist: 5000 }, true, () => exterior(b))
    b.inChunk('cafe-in', { maxDist: 110, yMin: -5, yMax: 30 }, false, () => {
      groundFloor(b)
      upperFloor(b)
    })
    b.zone('Big Apple Café', 0, 0, 0, W, H, D, { building: 'cafe' })
  })
}

// ---------------------------------------------------------------------------- shell
function exterior(b: WorldBuilder) {
  const door = 2.6
  const side = (W - door - 0.6) / 2
  // collision walls
  b.colBox(0, 0, -D / 2, W, H, 0.3)
  b.colBox(-W / 2, 0, 0, 0.3, H, D)
  b.colBox(W / 2, 0, 0, 0.3, H, D)
  b.colBox(-(door / 2 + 0.3 + side / 2), 0, D / 2, side, H, 0.3)
  b.colBox(door / 2 + 0.3 + side / 2, 0, D / 2, side, H, 0.3)
  b.colBox(0, 3.0, D / 2, door + 0.6, H - 3, 0.3)
  // glass skin
  b.box(0, 0, -D / 2, W, H, 0.06, '#b4cbd1', 'facade')
  b.box(-W / 2, 0, 0, 0.06, H, D, '#b4cbd1', 'facade')
  b.box(W / 2, 0, 0, 0.06, H, D, '#b4cbd1', 'facade')
  b.box(-(door / 2 + 0.3 + side / 2), 0, D / 2, side, H, 0.06, '#b4cbd1', 'facade')
  b.box(door / 2 + 0.3 + side / 2, 0, D / 2, side, H, 0.06, '#b4cbd1', 'facade')
  b.box(0, 3.1, D / 2, door + 0.6, H - 3.1, 0.06, '#b4cbd1', 'facade')
  // brick piers, plinth, slab band, roof
  const piers = (len: number, fixed: number, alongX: boolean, out: number) => {
    const n = Math.round(len / 4.3)
    for (let i = 0; i <= n; i++) {
      const t = -len / 2 + (i * len) / n
      if (alongX && out > 0 && Math.abs(t) < door / 2 + 0.6) continue
      if (alongX) b.box(t, 0, fixed + out * 0.3, 0.6, H + 0.6, 0.6, C.brick, 'satin')
      else b.box(fixed + out * 0.3, 0, t, 0.6, H + 0.6, 0.6, C.brick, 'satin')
    }
  }
  piers(W, D / 2, true, 1)
  piers(W, -D / 2, true, -1)
  piers(D, W / 2, false, 1)
  piers(D, -W / 2, false, -1)
  for (const [x, z, w, d] of [[0, D / 2 + 0.3, W + 1.2, 0.6], [0, -D / 2 - 0.3, W + 1.2, 0.6], [W / 2 + 0.3, 0, 0.6, D], [-W / 2 - 0.3, 0, 0.6, D]] as const) {
    b.box(x, 0, z, w, 0.45, d, C.brick, 'satin')
    b.box(x, FH - 0.35, z, w, 0.5, d, WOOD, 'satin')
    b.box(x, H, z, w, 0.6, d, C.brick, 'satin')
  }
  // wooden fins on the upper floor (like the Foundation)
  for (let x = -W / 2 + 0.6; x < W / 2; x += 0.9) {
    b.box(x, FH + 0.15, D / 2 + 0.25, 0.09, FH - 0.2, 0.35, WOOD, 'satin')
    b.box(x, FH + 0.15, -D / 2 - 0.25, 0.09, FH - 0.2, 0.35, WOOD, 'satin')
  }
  for (let z = -D / 2 + 0.6; z < D / 2; z += 0.9) {
    b.box(W / 2 + 0.25, FH + 0.15, z, 0.35, FH - 0.2, 0.09, WOOD, 'satin')
    b.box(-W / 2 - 0.25, FH + 0.15, z, 0.35, FH - 0.2, 0.09, WOOD, 'satin')
  }
  b.box(0, H, 0, W + 0.6, 0.4, D + 0.6, C.anthracite, 'satin')
  b.box(0, H + 0.4, 0, W - 0.4, 0.25, D - 0.4, '#5e8a3a', 'matte') // green roof
  for (let i = 0; i < 10; i++) b.ico(-W / 2 + 2 + i * 2.4, H + 0.65, (i % 2 ? 1 : -1) * 3, 0.5, '#4c7f3a', 'matte', 0.6)
  // night glow of the two floors
  b.box(0, FH - 0.9, 0, W - 0.8, 0.2, D - 0.8, '#fff1d0', 'nightglow')
  b.box(0, H - 0.9, 0, W - 0.8, 0.2, D - 0.8, '#fff1d0', 'nightglow')
  // logo on the wood band and over the entrance
  b.box(0, FH - 0.2, D / 2 + 0.62, 9.4, 1.0, 0.08, C.white, 'satin')
  b.sign(0, FH + 0.3, D / 2 + 0.67, 9, 0.9, logoTexture('Café', { bg: '#ffffff', w: 1024, h: 102 }), 0, 0.6)
  b.box(0, 3.0, D / 2 + 1.4, door + 3, 0.18, 2.4, WOOD, 'satin')
  buildEntrance(b, { x: 0, z: D / 2, name: 'Big Apple Café', width: door, height: 3.0, inside: -1, frame: C.anthracite })
  // terrace with tables and parasols
  b.box(0, 0, D / 2 + 6.5, W - 2, 0.12, 9, '#9b7652', 'satin', { col: true })
  for (let i = 0; i < 6; i++) {
    const x = -9 + (i % 3) * 7.5 + (i % 3 === 1 ? 0 : 0)
    const z = D / 2 + 4 + Math.floor(i / 3) * 4.5
    if (Math.abs(x) < 2.5) continue
    K.coffeeTable(b, x, 0.12, z, 0.45)
    K.chair(b, x - 0.75, 0.12, z, Math.PI / 2, C.anthracite)
    K.chair(b, x + 0.75, 0.12, z, -Math.PI / 2, C.anthracite)
    b.cyl(x, 0.12, z, 0.04, 2.4, C.anthracite, 'metal', { segs: 6 })
    b.cone(x, 2.2, z, 1.7, 0.6, i % 2 ? C.white : C.green, 'satin', 8)
    if (i % 2 === 0) b.npc({ kind: 'sit', x: x - 0.75, y: 0.12, z, yaw: Math.PI / 2 })
  }
  for (const s of [-1, 1]) K.planter(b, s * (W / 2 - 1.5), D / 2 + 10.5, 3, 0.9, 0.12)
  // menu stand at the door
  b.at(3, 0.12, D / 2 + 2.5, -0.3, () => {
    b.boxTilt(0, 0, 0, 0.7, 1.1, 0.05, 0, -0.15, C.black, 'satin')
    b.sign(0, 0.62, 0.05, 0.6, 0.9, textTexture(['Heute', 'Flat White 3,90', 'Bowl 8,90', 'WLAN gratis'], { w: 256, h: 384, size: 40, accent: C.green }), 0, 0.3)
  })
  K.bikeRack(b, -W / 2 - 3, D / 2 - 2, Math.PI / 2, 6)
}

// ---------------------------------------------------------------------------- props
function stool(b: WorldBuilder, x: number, y: number, z: number) {
  b.cyl(x, y, z, 0.03, 0.72, C.anthracite, 'metal', { segs: 6 })
  b.cyl(x, y + 0.72, z, 0.2, 0.06, WOOD, 'satin', { segs: 12 })
  b.cyl(x, y, z, 0.2, 0.02, C.anthracite, 'metal', { segs: 12 })
}
function laptop(b: WorldBuilder, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, 0.34, 0.02, 0.24, '#8a8f8c', 'metal')
    b.boxTilt(0, 0.01, -0.12, 0.34, 0.22, 0.012, 0, 0.25, '#8a8f8c', 'metal')
    b.boxTilt(0, 0.02, -0.112, 0.31, 0.19, 0.003, 0, 0.25, '#2f5a4b', 'emissive')
  })
}
function cup(b: WorldBuilder, x: number, y: number, z: number) {
  b.cyl(x, y, z, 0.045, 0.1, C.white, 'satin', { segs: 10 })
}
function pendant(b: WorldBuilder, x: number, y: number, z: number, ceiling: number) {
  b.cyl(x, y, z, 0.006, ceiling - y, C.black, 'matte', { segs: 4 })
  b.cone(x, y - 0.25, z, 0.22, 0.25, C.black, 'satin', 12)
  b.sphere(x, y - 0.24, z, 0.1, '#fff1d0', 'emissive', 1, 10)
}

/** small wooden hut with gable roof; opening towards local +z */
function hut(b: WorldBuilder, x: number, y: number, z: number, rot: number, occupied: boolean, label: string) {
  const w = 2.6
  const d = 2.3
  const h = 2.3
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, w, 0.06, d, WOOD_LIGHT, 'satin')
    b.box(0, 0, -d / 2 + 0.05, w, h, 0.1, WOOD, 'satin', { col: true })
    for (const s of [-1, 1]) {
      b.box(s * (w / 2 - 0.05), 0, 0, 0.1, h, d, WOOD, 'satin', { col: true })
      // little window in the side walls
      b.box(s * (w / 2 - 0.04), 1.1, -0.1, 0.11, 0.6, 0.8, '#3a3027', 'satin')
    }
    // gable roof (ridge from front to back) + front gable trim
    b.at(0, h, 0, Math.PI / 2, () => {
      b.boxTilt(0, 0, 0.7, d + 0.5, 0.08, 1.65, 0, 0.62, C.anthracite, 'satin')
      b.boxTilt(0, 0, -0.7, d + 0.5, 0.08, 1.65, 0, -0.62, C.anthracite, 'satin')
    })
    b.box(0, h, -d / 2 + 0.05, w * 0.7, 0.45, 0.1, WOOD, 'satin')
    b.box(0, h + 0.45, -d / 2 + 0.05, w * 0.35, 0.3, 0.1, WOOD, 'satin')
    // benches facing each other + table + lamp
    for (const s of [-1, 1]) {
      b.box(s * 0.85, 0, -0.1, 0.55, 0.45, d - 0.4, '#3d5f3a', 'matte', { col: true })
      b.box(s * 1.08, 0.45, -0.1, 0.1, 0.5, d - 0.4, '#3d5f3a', 'matte')
    }
    b.box(0, 0, -0.1, 0.12, 0.74, 0.12, C.anthracite, 'metal')
    b.box(0, 0.74, -0.1, 0.9, 0.04, 1.4, WOOD_LIGHT, 'satin', { col: true })
    pendant(b, 0, 2.05, -0.1, 2.6)
    cup(b, -0.2, 0.78, 0.1)
    if (occupied) {
      b.npc({ kind: 'sit', x: -0.85, y: 0, z: -0.1, yaw: Math.PI / 2 })
      laptop(b, -0.2, 0.78, -0.3, Math.PI / 2)
    }
    seat(b, 0.85, 0, -0.1, -Math.PI / 2, label)
  })
}

// ---------------------------------------------------------------------------- ground floor
function groundFloor(b: WorldBuilder) {
  b.box(0, 0, 0, W - 0.6, 0.02, D - 0.6, FLOOR, 'satin')
  // upper slab with the stair opening (its underside is the ceiling)
  const hole: [number, number, number, number] = [6.05, 7.95, -1.25, 6.05]
  slab(b, -W / 2 + 0.3, W / 2 - 0.3, -D / 2 + 0.3, D / 2 - 0.3, FH, 0.35, [hole], '#e9e2d4', 'satin')
  for (let x = -9; x <= 9; x += 6) for (let z = -6; z <= 6; z += 6) if (!(x > 4 && z > -3)) b.box(x, FH - 0.38, z, 1.6, 0.02, 0.3, '#fff6e0', 'emissive')

  // barista counter (customer side +z) with food display
  b.at(-2, 0, -5.2, 0, () => {
    b.box(0, 0, 0, 10, 1.02, 0.8, WOOD, 'satin', { col: true })
    for (let i = 0; i < 20; i++) b.box(-4.9 + i * 0.52, 0.05, 0.41, 0.04, 0.92, 0.02, '#8a5c34', 'satin')
    b.box(0, 1.02, 0.05, 10.1, 0.05, 0.95, STONE, 'gloss')
    b.box(0, 0.1, 0.43, 10, 0.03, 0.02, C.green, 'emissive')
    // food display case
    b.box(-3, 1.07, 0.1, 3.6, 0.55, 0.7, C.glassTint, 'glass')
    b.box(-3, 1.07, 0.1, 3.5, 0.02, 0.65, C.white, 'satin')
    b.box(-3, 1.33, 0.1, 3.5, 0.02, 0.65, C.white, 'satin')
    const foods = ['#d9a556', '#b9783f', '#e8d3a1', '#7d9a52', '#c45a3c', '#f0e2c0', '#a8653a', '#6f8f3e']
    for (let i = 0; i < 8; i++) {
      const fx = -4.5 + (i % 4) * 1.0
      const fy = i < 4 ? 1.1 : 1.36
      if (i % 3 === 0) b.sphere(fx, fy + 0.07, 0.15, 0.08, foods[i], 'satin', 0.7)
      else b.box(fx, fy, 0.15, 0.3, 0.08, 0.18, foods[i], 'satin')
      b.box(fx + 0.3, fy, 0.15, 0.25, 0.06, 0.15, foods[(i + 3) % 8], 'satin')
    }
    b.sign(-3, 0.75, 0.42, 3.2, 0.25, textTexture(['Frisch: Gebäck · Sandwiches · Bowls · Kuchen'], { w: 768, h: 60, size: 30, bg: '#3a2a1e' }), 0, 0.3)
    // cash register + cups
    b.box(1.3, 1.07, 0.15, 0.4, 0.25, 0.35, C.black, 'gloss')
    b.boxTilt(1.3, 1.32, 0.1, 0.35, 0.22, 0.02, 0, -0.4, '#2f5a4b', 'emissive')
    for (let i = 0; i < 4; i++) cup(b, 2.5 + i * 0.2, 1.07, 0.2)
    // back bar with espresso machines, grinders and shelves
    b.box(0, 0, -2.95, 11, 0.92, 0.65, C.anthracite, 'satin', { col: true })
    b.box(0, 0.92, -2.95, 11, 0.04, 0.7, STONE, 'gloss')
    for (const mx of [-1.6, 0.6]) {
      b.box(mx, 0.96, -3.0, 1.1, 0.48, 0.5, '#c9ccc9', 'metal')
      b.box(mx, 1.44, -3.0, 1.1, 0.06, 0.5, C.green, 'satin')
      for (const g of [-0.3, 0.3]) b.box(mx + g, 1.05, -2.72, 0.06, 0.12, 0.06, C.black, 'metal')
    }
    for (const gx of [2.2, 2.8]) {
      b.cyl(gx, 0.96, -3.0, 0.12, 0.35, C.black, 'metal', { segs: 10 })
      b.cone(gx, 1.31, -3.0, 0.12, 0.22, '#5a3a22', 'glass', 10)
    }
    for (let r = 0; r < 2; r++) {
      b.box(0, 1.9 + r * 0.55, -3.15, 10, 0.04, 0.32, WOOD, 'satin')
      for (let i = 0; i < 16; i++) cup(b, -4.5 + i * 0.6, 1.94 + r * 0.55, -3.1)
    }
    // menu boards
    const half = MENU.length / 2
    for (let k = 0; k < 2; k++) {
      const lines = MENU.slice(k * half, (k + 1) * half).map(([n, p]) => `${n}  ${p}`)
      b.box(-2.6 + k * 5.2, 2.9, -3.24, 4.8, 1.1, 0.06, '#1d1f1e', 'satin')
      b.sign(-2.6 + k * 5.2, 3.45, -3.2, 4.6, 1.0, textTexture([k ? 'Essen' : 'Kaffee & Tee', ...lines], { w: 768, h: 168, size: 34, bg: '#1d1f1e', align: 'left' }), 0, 0.4)
    }
    b.npc({ kind: 'stand', x: -1, y: 0, z: -1.5, yaw: 0 })
    b.npc({ kind: 'stand', x: 1.8, y: 0, z: -1.6, yaw: 0.3 })
    b.npc({ kind: 'stand', x: -0.6, y: 0, z: 1.4, yaw: Math.PI })
    b.npc({ kind: 'stand', x: -0.4, y: 0, z: 2.4, yaw: Math.PI })
  })
  let orders = 0
  b.interact({
    id: 'cafe-order', lx: -1.5, ly: 1.2, lz: -3.6, radius: 2.6, priority: 1,
    label: () => 'Bestellen (Barista)',
    action: () => {
      const [name, price] = MENU[(orders++ * 5 + 3) % MENU.length]
      toast(`Bestellt: ${name} · ${price} – wird gleich an der Theke ausgegeben`)
    },
  })
  infoPoint(b, -5, 1.2, -3.6, 'Big Apple Café – Speisekarte', [
    ...MENU.map(([n, p]) => `${n} · ${p}`),
    'Bezahlung mit Big Apple Pay oder Karte · Hafermilch ohne Aufpreis',
  ], { label: 'Speisekarte lesen', suffix: 'Café' })

  // huts along the left wall (openings face the room)
  hut(b, -11.4, 0, -6.6, Math.PI / 2, true, 'In der Hütte sitzen')
  hut(b, -11.4, 0, -3.4, Math.PI / 2, false, 'In der Hütte sitzen')
  hut(b, -11.4, 0, -0.2, Math.PI / 2, true, 'In der Hütte sitzen')
  // café tables
  const tables: [number, number][] = [[-7, 1.5], [-4, 1.5], [-7, 4.6], [-4, 4.6], [3.3, 0.5], [3.3, 3.6]]
  tables.forEach(([x, z], i) => {
    K.coffeeTable(b, x, 0, z, 0.42)
    K.chair(b, x - 0.75, 0, z, Math.PI / 2, i % 2 ? WOOD : C.anthracite)
    K.chair(b, x + 0.75, 0, z, -Math.PI / 2, i % 2 ? C.anthracite : WOOD)
    cup(b, x - 0.15, 0.4, z)
    pendant(b, x, 2.5, z, FH - 0.35)
    if (i % 2 === 0) b.npc({ kind: 'sit', x: x - 0.75, y: 0, z, yaw: Math.PI / 2 })
    seat(b, x + 0.75, 0, z, -Math.PI / 2, 'Hinsetzen')
  })
  // window bar along the front glass
  b.box(-7.5, 0, D / 2 - 0.65, 9, 1.05, 0.5, WOOD_LIGHT, 'satin', { col: true })
  for (let i = 0; i < 8; i++) {
    const x = -11.4 + i * 1.1
    stool(b, x, 0, D / 2 - 1.3)
    if (i % 3 === 0) b.npc({ kind: 'sit', x, y: 0.28, z: D / 2 - 1.3, yaw: 0 })
    if (i % 3 === 1) cup(b, x, 1.05, D / 2 - 0.6)
  }
  // lounge corner (front right, beside the stair)
  K.sofa(b, 11, 0, 4.5, -Math.PI / 2, 2.2, C.fabricGreen)
  K.sofa(b, 10.2, 0, 7.6, Math.PI, 1.6, C.leather)
  K.coffeeTable(b, 9.8, 0, 5.3, 0.5)
  K.plant(b, 12, 0, 8, 1.2)
  K.plant(b, 12, 0, -2, 1.3)
  K.plant(b, -1.8, 0, 7.6, 1.0)
  K.rug(b, 10.2, 0, 5.6, 3.6, 4, '#6b5b47')

  // free-standing feature stair (wood treads, glass balustrade) rising towards the back
  buildStair(b, 7, 0, 6.0, 1.7, FH, { rot: Math.PI, color: WOOD_LIGHT })
  b.box(7, 0.05, 6.4, 1.8, 0.02, 0.5, C.green, 'emissive')
  b.sign(7, 2.6, 6.6, 2.0, 0.4, textTexture(['↑ Obergeschoss · Arbeiten & Sitzen'], { w: 640, h: 80, accent: C.green }), 0, 0.5, true)
  b.zone('Big Apple Café · EG – Barista-Bar & Café', 0, 0, 0, W, FH - 0.4, D, { building: 'cafe' })
}

// ---------------------------------------------------------------------------- upper floor
function upperFloor(b: WorldBuilder) {
  const y = FH
  b.box(0, H - 0.32, 0, W - 0.6, 0.02, D - 0.6, '#f1ece2', 'matte') // ceiling
  b.colBox(0, H - 0.3, 0, W, 0.3, D)
  // glass railing around the stair opening (open towards the back where the stair arrives)
  for (const x of [6.0, 8.0]) b.box(x, y, 2.4, 0.05, 1.05, 7.3, C.glassTint, 'glass', { col: true, noSupport: true })
  b.box(7, y, 6.1, 2.05, 1.05, 0.05, C.glassTint, 'glass', { col: true, noSupport: true })
  for (const x of [6.0, 8.0]) b.box(x, y + 1.05, 2.4, 0.06, 0.05, 7.4, C.anthracite, 'metal')
  b.box(7, y + 1.05, 6.1, 2.06, 0.05, 0.06, C.anthracite, 'metal')

  // communal work table with laptops and lamps
  b.at(-2, y, -1.6, 0, () => {
    K.meetingTable(b, 0, 0, 0, 0, { len: 8, wid: 1.4, seats: 8, top: WOOD_LIGHT, chairColor: C.anthracite })
    for (let i = 0; i < 4; i++) {
      const x = -3 + i * 2
      b.cyl(x, 0.76, 0, 0.02, 0.45, C.black, 'metal', { segs: 6 })
      b.box(x, 1.2, 0, 0.5, 0.05, 0.12, '#fff1d0', 'emissive')
      b.box(x, 0.76, 0, 0.12, 0.06, 0.08, C.anthracite, 'metal') // power socket box
    }
    for (let i = 0; i < 8; i++) {
      const x = -3.5 + i * 1.0
      const s = i % 2 ? 1 : -1
      if (i % 3 !== 2) laptop(b, x, 0.77, s * 0.35, s > 0 ? Math.PI : 0)
      if (i % 3 === 0) b.npc({ kind: 'sit', x, y: 0, z: s * 1.05, yaw: s > 0 ? Math.PI : 0 })
    }
  })
  // window counter with stools (front)
  b.box(-4.5, y, D / 2 - 0.65, 15, 1.05, 0.5, WOOD_LIGHT, 'satin', { col: true })
  for (let i = 0; i < 13; i++) {
    const x = -11.4 + i * 1.15
    stool(b, x, y, D / 2 - 1.3)
    if (i % 2 === 0) b.box(x, y + 1.05, D / 2 - 0.45, 0.1, 0.05, 0.06, C.anthracite, 'metal') // socket
    if (i % 4 === 1) {
      b.npc({ kind: 'sit', x, y: y + 0.28, z: D / 2 - 1.3, yaw: 0 })
      laptop(b, x, y + 1.05, D / 2 - 0.65, Math.PI)
    }
    if (i % 4 === 3) seat(b, x, y + 0.28, D / 2 - 1.3, 0, 'Hinsetzen (Arbeitsplatz)')
  }
  // huts for calls and focus work
  hut(b, -11.4, y, -6.6, Math.PI / 2, true, 'In der Hütte arbeiten')
  hut(b, -11.4, y, -3.4, Math.PI / 2, false, 'In der Hütte arbeiten')
  // lounge with armchairs and a bookshelf (back right)
  K.rug(b, 6.5, y, -6, 6, 3.6, '#5d615c')
  K.sofa(b, 6.5, y, -7.6, 0, 2.6, C.fabricGrey)
  K.sofa(b, 3.6, y, -5.8, Math.PI / 2, 1.4, C.fabricGreen)
  K.sofa(b, 9.4, y, -5.8, -Math.PI / 2, 1.4, C.fabricGreen)
  K.coffeeTable(b, 6.5, y, -5.8, 0.55)
  b.npc({ kind: 'sit', x: 6, y, z: -7.5, yaw: 0 })
  K.shelf(b, 11.8, y, -6, -Math.PI / 2, 3, 2.1)
  for (const [px, pz] of [[12, 2], [12, 7.5], [-12, 3.5], [1, 7.6]] as const) K.plant(b, px, y, pz, 1.2)
  for (let x = -8; x <= 8; x += 4) pendant(b, x, y + 3.0, 4.5, H - 0.32)
  infoPoint(b, -2, y + 1.2, 2, 'Arbeiten im Big Apple Café', [
    'WLAN „BigApple-Guest“ – frei für Mitarbeitende und Gäste.',
    'Steckdosen an der Fensterbar und am Gemeinschaftstisch.',
    'Hütten für Telefonate und konzentriertes Arbeiten – bitte nach 2 Stunden für andere freigeben.',
    'Kaffee wird an der Theke im Erdgeschoss bestellt.',
  ], { label: 'Infos zum Arbeiten im Café', suffix: 'Café' })
  b.zone('Big Apple Café · OG – Sitzen & Arbeiten', 0, y, 0, W, FH - 0.4, D, { building: 'cafe' })
}
