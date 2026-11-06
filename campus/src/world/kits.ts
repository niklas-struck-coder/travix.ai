/**
 * Furniture & street furniture kits. All kits are drawn in a local frame whose
 * origin is on the floor; "front" is local +z.
 */
import { WorldBuilder } from '../engine/builder'
import { C } from '../engine/materials'
import { seat } from './dynamic'

type B = WorldBuilder

export function officeChair(b: B, x: number, y: number, z: number, rot = 0, color = C.black) {
  b.at(x, y, z, rot, () => {
    b.cyl(0, 0, 0, 0.28, 0.04, C.anthracite, 'metal', { segs: 8 })
    b.cyl(0, 0.04, 0, 0.03, 0.4, C.anthracite, 'metal', { segs: 6 })
    b.box(0, 0.44, 0, 0.48, 0.07, 0.46, color, 'satin')
    b.box(0, 0.5, -0.22, 0.46, 0.55, 0.06, color, 'satin')
  })
}

export function chair(b: B, x: number, y: number, z: number, rot = 0, color = C.anthracite) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0.43, 0, 0.45, 0.05, 0.45, color, 'satin')
    b.box(0, 0.48, -0.21, 0.45, 0.42, 0.04, color, 'satin')
    for (const sx of [-0.19, 0.19]) for (const sz of [-0.19, 0.19]) b.box(sx, 0, sz, 0.03, 0.43, 0.03, C.anthracite, 'metal')
  })
}

export function desk(b: B, x: number, y: number, z: number, rot = 0, o: { w?: number; monitor?: boolean; chair?: boolean; top?: string } = {}) {
  const w = o.w ?? 1.6
  b.at(x, y, z, rot, () => {
    b.box(0, 0.72, 0, w, 0.04, 0.8, o.top ?? C.white, 'satin')
    b.box(-w / 2 + 0.04, 0, 0, 0.05, 0.72, 0.7, C.anthracite, 'metal')
    b.box(w / 2 - 0.04, 0, 0, 0.05, 0.72, 0.7, C.anthracite, 'metal')
    if (o.monitor !== false) {
      b.box(0, 0.76, -0.25, 0.08, 0.3, 0.04, C.anthracite, 'metal')
      b.box(0, 0.95, -0.27, 0.62, 0.38, 0.03, C.black, 'gloss')
      b.box(0, 0.98, -0.25, 0.58, 0.33, 0.005, '#3d6b5a', 'emissive')
      b.box(0, 0.76, 0.05, 0.42, 0.015, 0.14, C.anthracite, 'satin')
    }
    if (o.chair !== false) officeChair(b, 0, 0, 0.65, Math.PI)
  })
  b.colBox(x, y, z, w, 0.76, 0.8, rot)
}

/** 4 or 6 desks back-to-back */
export function deskCluster(b: B, x: number, y: number, z: number, rot = 0, n = 2) {
  b.at(x, y, z, rot, () => {
    for (let i = 0; i < n; i++) {
      const px = (i - (n - 1) / 2) * 1.65
      desk(b, px, 0, -0.42, 0)
      desk(b, px, 0, 0.42, Math.PI)
    }
    b.box(0, 0.76, 0, n * 1.65, 0.38, 0.03, C.fabricGreen, 'matte') // acoustic divider
  })
}

export function plant(b: B, x: number, y: number, z: number, s = 1) {
  b.cyl(x, y, z, 0.28 * s, 0.5 * s, C.anthracite, 'satin', { segs: 12, col: true })
  b.ico(x, y + 0.9 * s, z, 0.45 * s, '#3f7a35', 'matte', 1.3)
  b.ico(x + 0.15 * s, y + 1.35 * s, z - 0.1 * s, 0.3 * s, '#4f8f3e', 'matte')
}

export function sofa(b: B, x: number, y: number, z: number, rot = 0, len = 2.2, color = C.fabricGrey, sittable = true) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0.1, 0, len, 0.32, 0.9, color, 'matte')
    b.box(0, 0.1, -0.38, len, 0.75, 0.18, color, 'matte')
    b.box(-len / 2 + 0.1, 0.1, 0, 0.2, 0.55, 0.9, color, 'matte')
    b.box(len / 2 - 0.1, 0.1, 0, 0.2, 0.55, 0.9, color, 'matte')
    b.box(0, 0, 0, len - 0.1, 0.1, 0.8, C.black, 'metal')
    if (sittable) seat(b, 0, 0, 0.1, 0, 'Hinsetzen (Sofa)')
  })
  b.colBox(x, y, z, len, 0.5, 0.9, rot)
}

export function coffeeTable(b: B, x: number, y: number, z: number, r = 0.5) {
  b.cyl(x, y + 0.36, z, r, 0.04, C.wood, 'satin', { segs: 20 })
  b.cyl(x, y, z, 0.05, 0.36, C.anthracite, 'metal', { segs: 6 })
  b.colCyl(x, y, z, r, 0.4)
}

export function rug(b: B, x: number, y: number, z: number, w: number, d: number, color = '#6f726c', rot = 0) {
  b.box(x, y + 0.002, z, w, 0.012, d, color, 'matte', { rot })
}

export function loungeSet(b: B, x: number, y: number, z: number, rot = 0, color = C.fabricGrey) {
  b.at(x, y, z, rot, () => {
    rug(b, 0, 0, 0, 4.4, 3.6, '#5d615c')
    sofa(b, 0, 0, -1.2, 0, 2.4, color)
    sofa(b, -1.7, 0, 0.3, Math.PI / 2, 1.6, C.fabricGreen)
    sofa(b, 1.7, 0, 0.3, -Math.PI / 2, 1.6, C.fabricGreen)
    coffeeTable(b, 0, 0, 0.2, 0.55)
    plant(b, 2.0, 0, -1.4, 1)
  })
}

export function meetingTable(b: B, x: number, y: number, z: number, rot = 0, o: { len?: number; wid?: number; seats?: number; top?: string; screen?: boolean; chairColor?: string; oval?: boolean } = {}) {
  const len = o.len ?? 3.2
  const wid = o.wid ?? 1.2
  const seats = o.seats ?? Math.max(2, Math.floor(len / 0.8))
  b.at(x, y, z, rot, () => {
    if (o.oval) {
      b.cyl(0, 0.72, 0, len / 2, 0.05, o.top ?? C.wood, 'gloss', { segs: 40, rz: wid / 2 })
      b.box(0, 0, 0, len * 0.5, 0.72, 0.4, C.anthracite, 'metal')
    } else {
      b.box(0, 0.72, 0, len, 0.05, wid, o.top ?? C.wood, 'gloss')
      b.box(-len / 2 + 0.3, 0, 0, 0.12, 0.72, wid * 0.6, C.anthracite, 'metal')
      b.box(len / 2 - 0.3, 0, 0, 0.12, 0.72, wid * 0.6, C.anthracite, 'metal')
    }
    for (let i = 0; i < seats; i++) {
      const px = (i - (seats - 1) / 2) * ((len - 0.6) / Math.max(1, seats - 1))
      officeChair(b, px, 0, wid / 2 + 0.35, Math.PI, o.chairColor ?? C.black)
      officeChair(b, px, 0, -wid / 2 - 0.35, 0, o.chairColor ?? C.black)
    }
    if (o.screen) {
      b.box(len / 2 + 1.3, 0.9, 0, 0.06, 1.1, 1.9, C.black, 'gloss', { rot: 0 })
      b.box(len / 2 + 1.26, 0.95, 0, 0.01, 1.0, 1.8, '#244d3c', 'emissive')
    }
  })
  b.colBox(x, y, z, len, 0.78, wid, rot)
}

export function shelf(b: B, x: number, y: number, z: number, rot = 0, w = 2, h = 2) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, w, h, 0.4, C.offwhite, 'satin')
    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 6; j++) {
        const c = ['#4f6b5a', '#b88c5a', '#d9d4c8', C.green, '#38403c'][(i * 7 + j * 3) % 5]
        b.box(-w / 2 + 0.2 + j * (w - 0.4) / 6, (i * h) / 4 + 0.02, 0.21, 0.18, 0.3, 0.02, c, 'satin')
      }
    }
  })
  b.colBox(x, y, z, w, h, 0.4, rot)
}

export function tvWall(b: B, x: number, y: number, z: number, rot = 0, w = 3, h = 1.7, glow = '#21483a') {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, w + 0.1, h + 0.1, 0.08, C.black, 'gloss')
    b.box(0, 0.05, 0.045, w, h, 0.01, glow, 'emissive')
  })
}

export function receptionDesk(b: B, x: number, y: number, z: number, rot = 0, len = 5) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, len, 1.1, 0.9, C.white, 'gloss')
    b.box(0, 1.1, 0.1, len + 0.1, 0.05, 1.1, C.stone, 'gloss')
    b.box(0, 0.12, 0.46, len, 0.05, 0.02, C.green, 'emissive')
    b.box(0, 0, -0.9, len, 0.75, 0.6, C.white, 'satin')
    for (let i = 0; i < Math.floor(len / 1.6); i++) {
      const px = (i - (Math.floor(len / 1.6) - 1) / 2) * 1.6
      b.box(px, 0.75, -0.95, 0.5, 0.32, 0.03, C.black, 'gloss')
      officeChair(b, px, 0, -1.6, 0)
    }
  })
  b.colBox(x, y, z, len, 1.15, 1.0, rot)
  b.colBox(x, y, z, len, 0.78, 2.0, rot)
}

export function bench(b: B, x: number, y: number, z: number, rot = 0, len = 2.0, sittable = true) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0.42, 0, len, 0.06, 0.5, C.woodLight, 'satin')
    b.box(0, 0.48, -0.22, len, 0.4, 0.05, C.woodLight, 'satin')
    b.box(-len / 2 + 0.15, 0, 0, 0.08, 0.42, 0.45, C.anthracite, 'metal')
    b.box(len / 2 - 0.15, 0, 0, 0.08, 0.42, 0.45, C.anthracite, 'metal')
    if (sittable) seat(b, 0, 0, 0.1, 0, 'Hinsetzen (Bank)')
  })
  b.colBox(x, y, z, len, 0.5, 0.5, rot)
}

export function tree(b: B, x: number, z: number, s = 1, y = 0, variant = 0) {
  b.cyl(x, y, z, 0.18 * s, 3.2 * s, '#5a4634', 'matte', { segs: 7 })
  const greens = ['#3f6e2f', '#4a7d36', '#5a8a3c', '#3a6a3a']
  const g = greens[variant % greens.length]
  if (variant % 3 === 2) {
    // conical (conifer-like) tree
    b.cone(x, y + 1.6 * s, z, 1.6 * s, 4.8 * s, '#355e33', 'matte', 9)
  } else {
    b.ico(x, y + 3.9 * s, z, 1.9 * s, g, 'matte', 1.05)
    b.ico(x + 0.8 * s, y + 3.3 * s, z + 0.5 * s, 1.2 * s, greens[(variant + 1) % 4], 'matte')
    b.ico(x - 0.7 * s, y + 4.5 * s, z - 0.4 * s, 1.1 * s, greens[(variant + 2) % 4], 'matte')
  }
  b.colCyl(x, y, z, 0.3 * s, 3)
}

export function streetLamp(b: B, x: number, z: number, rot = 0, y = 0, h = 5.5) {
  b.at(x, y, z, rot, () => {
    b.cyl(0, 0, 0, 0.09, h, C.anthracite, 'metal', { segs: 8 })
    b.box(0, h - 0.1, 0.45, 0.18, 0.1, 1.0, C.anthracite, 'metal')
    b.box(0, h - 0.14, 0.8, 0.14, 0.04, 0.5, '#fff6da', 'nightglow')
    b.box(0, h - 0.2, 0.0, 0.2, 0.06, 0.2, C.green, 'emissive')
    b.cyl(0, 0.02, 0.8, 3.2, 0.02, '#ffd9a0', 'lightpool', { segs: 20 })
  })
  b.colCyl(x, y, z, 0.15, h)
}

export function bollardLight(b: B, x: number, z: number, y = 0) {
  b.cyl(x, y, z, 0.1, 0.8, C.anthracite, 'metal', { segs: 8 })
  b.cyl(x, y + 0.62, z, 0.105, 0.12, '#fff1cc', 'nightglow', { segs: 8 })
}

export function flagPole(b: B, x: number, z: number, color: string, h = 10, y = 0) {
  b.cyl(x, y, z, 0.07, h, C.white, 'metal', { segs: 8, col: true })
  b.box(x + 0.85, y + h - 2.1, z, 1.7, 1.1, 0.02, color, 'satin')
}

export function bikeRack(b: B, x: number, z: number, rot = 0, n = 6, y = 0, withBikes = true) {
  b.at(x, y, z, rot, () => {
    for (let i = 0; i < n; i++) {
      const px = (i - (n - 1) / 2) * 0.9
      b.box(px, 0, 0, 0.05, 0.75, 0.7, C.anthracite, 'metal')
      if (withBikes && (i * 7) % 3 !== 0) bike(b, px + 0.15, 0, 0, Math.PI / 2, i % 2 ? C.green : C.black)
    }
  })
  b.colBox(x, y, z, n * 0.9, 1, 1.6, rot, true)
}

export function bike(b: B, x: number, y: number, z: number, rot = 0, color = C.black, electric = false) {
  b.at(x, y, z, rot, () => {
    b.cylX(-0.52, 0.34, 0, 0.34, 0.05, '#1a1a1a', 'matte', Math.PI / 2, 14)
    b.cylX(0.52, 0.34, 0, 0.34, 0.05, '#1a1a1a', 'matte', Math.PI / 2, 14)
    b.boxTilt(0, 0.45, 0, 1.0, 0.06, 0.06, 0, 0, color, 'gloss')
    b.boxTilt(-0.1, 0.4, 0, 0.06, 0.55, 0.06, 0, 0, color, 'gloss')
    b.box(-0.15, 0.95, 0, 0.25, 0.06, 0.12, C.black, 'satin')
    b.box(0.45, 0.4, 0, 0.05, 0.62, 0.05, color, 'gloss')
    b.box(0.45, 1.02, 0, 0.05, 0.04, 0.55, C.anthracite, 'metal')
    if (electric) b.box(0.05, 0.5, 0, 0.42, 0.13, 0.1, C.green, 'gloss')
  })
}

export function scooter(b: B, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0.1, 0, 0.9, 0.06, 0.18, C.black, 'satin')
    b.cylX(-0.42, 0.1, 0, 0.1, 0.06, '#111', 'matte', Math.PI / 2, 10)
    b.cylX(0.42, 0.1, 0, 0.1, 0.06, '#111', 'matte', Math.PI / 2, 10)
    b.box(0.42, 0.1, 0, 0.05, 1.0, 0.05, C.green, 'gloss')
    b.box(0.42, 1.1, 0, 0.05, 0.04, 0.5, C.black, 'metal')
  })
}

export function car(b: B, x: number, y: number, z: number, rot = 0, color = C.white) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0.32, 0, 1.8, 0.62, 4.4, color, 'gloss')
    b.box(0, 0.94, -0.2, 1.6, 0.5, 2.3, '#24313a', 'gloss')
    for (const sx of [-0.82, 0.82]) for (const sz of [-1.4, 1.35]) b.cylX(sx, 0.34, sz, 0.34, 0.24, '#151515', 'matte', 0, 12)
    b.box(0, 0.6, 2.2, 1.4, 0.08, 0.02, '#e9f1ff', 'emissive')
    b.box(0, 0.62, -2.2, 1.5, 0.08, 0.02, '#c21d1d', 'emissive')
  })
  b.colBox(x, y, z, 1.8, 1.4, 4.4, rot)
}

export function chargingStation(b: B, x: number, z: number, rot = 0, y = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, 0.5, 1.6, 0.3, C.white, 'gloss')
    b.box(0, 1.2, 0.16, 0.3, 0.2, 0.01, C.green, 'emissive')
    b.box(0, 1.6, 0, 0.55, 0.06, 0.35, C.green, 'satin')
  })
  b.colBox(x, y, z, 0.5, 1.6, 0.3, rot)
}

export function bin(b: B, x: number, z: number, y = 0) {
  b.cyl(x, y, z, 0.25, 0.9, C.anthracite, 'metal', { segs: 10, col: true })
  b.cyl(x, y + 0.9, z, 0.27, 0.05, C.green, 'satin', { segs: 10 })
}

export function planter(b: B, x: number, z: number, w: number, d: number, y = 0, rot = 0) {
  b.box(x, y, z, w, 0.6, d, C.anthracite, 'satin', { rot, col: true })
  b.box(x, y + 0.6, z, w - 0.2, 0.08, d - 0.2, '#3f2f22', 'matte', { rot })
  b.at(x, y + 0.6, z, rot, () => {
    const n = Math.max(1, Math.round(w / 1.2))
    for (let i = 0; i < n; i++) b.ico((i - (n - 1) / 2) * (w / n), 0.35, 0, Math.min(0.55, d * 0.35), i % 2 ? '#4c7f3a' : '#3c6c32', 'matte', 0.8)
  })
}

/** Gym equipment */
export function treadmill(b: B, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, 0.85, 0.22, 2.0, C.black, 'satin')
    b.box(0, 0.22, 0, 0.6, 0.02, 1.7, '#222', 'matte')
    b.box(-0.38, 0.2, 0.8, 0.06, 1.1, 0.06, C.anthracite, 'metal')
    b.box(0.38, 0.2, 0.8, 0.06, 1.1, 0.06, C.anthracite, 'metal')
    b.box(0, 1.25, 0.85, 0.8, 0.35, 0.12, C.black, 'gloss')
    b.box(0, 1.3, 0.78, 0.5, 0.25, 0.01, C.green, 'emissive')
  })
  b.colBox(x, y, z, 0.9, 1.3, 2.0, rot)
}
export function spinBike(b: B, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, 0.5, 0.06, 1.1, C.black, 'metal')
    b.cylX(0, 0.45, 0.3, 0.3, 0.08, C.anthracite, 'metal', Math.PI / 2, 16)
    b.box(0, 0.1, -0.15, 0.08, 0.85, 0.08, C.green, 'gloss')
    b.box(0, 0.95, -0.2, 0.22, 0.06, 0.3, C.black, 'satin')
    b.box(0, 0.4, 0.45, 0.06, 0.8, 0.06, C.green, 'gloss')
    b.box(0, 1.2, 0.45, 0.5, 0.04, 0.12, C.black, 'metal')
  })
  b.colBox(x, y, z, 0.55, 1.2, 1.1, rot)
}
export function weightRack(b: B, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    for (const sx of [-1.1, 1.1]) for (const sz of [-0.6, 0.6]) b.box(sx, 0, sz, 0.08, 2.3, 0.08, C.black, 'metal')
    b.box(0, 2.25, -0.6, 2.3, 0.08, 0.08, C.black, 'metal')
    b.box(0, 2.25, 0.6, 2.3, 0.08, 0.08, C.black, 'metal')
    b.cylX(0, 1.45, 0, 0.025, 2.4, '#bbb', 'metal', 0, 8)
    for (const sx of [-1.0, 1.0]) b.cylX(sx, 1.45, 0, 0.23, 0.08, C.black, 'satin', 0, 18)
    b.box(0, 0, 0, 1.6, 0.42, 0.55, C.black, 'satin') // bench
    b.box(0, 0.0, 0, 2.8, 0.02, 2.2, '#2a2a2a', 'matte') // rubber floor
  })
  b.colBox(x, y, z, 2.4, 2.3, 1.4, rot)
}
export function dumbbellRack(b: B, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, 2.4, 0.75, 0.6, C.black, 'metal')
    for (let i = 0; i < 8; i++) {
      const px = -1.05 + i * 0.3
      b.cylX(px, 0.82, 0, 0.07 + i * 0.006, 0.28, i % 2 ? C.anthracite : C.green, 'satin', Math.PI / 2, 10)
    }
  })
  b.colBox(x, y, z, 2.4, 0.9, 0.6, rot)
}
export function yogaMat(b: B, x: number, y: number, z: number, rot = 0, color = C.green) {
  b.box(x, y + 0.002, z, 0.65, 0.012, 1.8, color, 'matte', { rot })
}
export function lockers(b: B, x: number, y: number, z: number, rot = 0, n = 8) {
  b.at(x, y, z, rot, () => {
    for (let i = 0; i < n; i++) {
      const px = (i - (n - 1) / 2) * 0.5
      b.box(px, 0, 0, 0.48, 1.9, 0.5, i % 2 ? '#e8e8e4' : '#dededa', 'satin')
      b.box(px + 0.15, 1.0, 0.255, 0.04, 0.12, 0.01, C.green, 'emissive')
    }
    b.box(0, 0, 0.75, n * 0.5, 0.45, 0.35, C.wood, 'satin')
  })
  b.colBox(x, y, z, n * 0.5, 1.9, 0.5, rot)
}

export function bed(b: B, x: number, y: number, z: number, rot = 0, w = 1.8) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, w, 0.35, 2.1, C.anthracite, 'satin')
    b.box(0, 0.35, 0, w - 0.05, 0.22, 2.0, '#f2f0ea', 'matte')
    b.box(0, 0.57, 0.35, w - 0.05, 0.05, 1.3, C.fabricGreen, 'matte')
    b.box(-w / 4, 0.57, -0.75, w / 2 - 0.1, 0.14, 0.4, '#ffffff', 'matte')
    b.box(w / 4, 0.57, -0.75, w / 2 - 0.1, 0.14, 0.4, '#ffffff', 'matte')
    b.box(0, 0, -1.08, w + 0.4, 1.2, 0.08, C.wood, 'satin')
    for (const s of [-1, 1]) {
      b.box(s * (w / 2 + 0.35), 0, -0.8, 0.5, 0.5, 0.45, C.wood, 'satin')
      b.cyl(s * (w / 2 + 0.35), 0.5, -0.8, 0.12, 0.35, '#fff1d0', 'nightglow', { segs: 10 })
    }
  })
  b.colBox(x, y, z, w, 0.6, 2.1, rot)
}

export function serverRack(b: B, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, 0.6, 2.1, 1.0, '#1b1d1c', 'metal')
    for (let i = 0; i < 8; i++) b.box(0, 0.2 + i * 0.23, 0.505, 0.5, 0.03, 0.005, i % 3 ? '#3fae5a' : '#5ad1ff', 'emissive')
  })
  b.colBox(x, y, z, 0.6, 2.1, 1.0, rot)
}

export function cinemaSeats(b: B, x: number, y: number, z: number, rows: number, perRow: number, rot = 0, rise = 0.35, color = '#7a1f2a') {
  b.at(x, y, z, rot, () => {
    for (let r = 0; r < rows; r++) {
      const ry = r * rise
      const rz = -r * 1.0
      b.box(0, 0, rz, perRow * 0.62 + 1.2, ry, 1.0, C.anthracite, 'matte')
      b.colBox(0, 0, rz, perRow * 0.62 + 1.2, ry, 1.0)
      for (let i = 0; i < perRow; i++) {
        const px = (i - (perRow - 1) / 2) * 0.62
        b.box(px, ry + 0.25, rz + 0.1, 0.56, 0.18, 0.5, color, 'matte')
        b.box(px, ry + 0.43, rz - 0.18, 0.56, 0.6, 0.12, color, 'matte')
      }
    }
  })
}

export function robotArm(b: B, x: number, y: number, z: number, rot = 0) {
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, 1.2, 0.85, 0.8, C.white, 'satin')
    b.cyl(0, 0.85, 0, 0.18, 0.2, C.anthracite, 'metal', { segs: 12 })
    b.boxTilt(0, 1.0, 0.15, 0.14, 0.7, 0.14, 0, 0.5, C.green, 'gloss')
    b.boxTilt(0, 1.55, 0.45, 0.1, 0.55, 0.1, 0, 1.3, C.white, 'gloss')
    b.sphere(0, 1.65, 0.9, 0.08, C.anthracite, 'metal')
  })
  b.colBox(x, y, z, 1.2, 1.0, 0.8, rot)
}

export function displayPlinth(b: B, x: number, y: number, z: number, rot = 0, w = 1.2, d = 1.2, h = 0.9) {
  b.box(x, y, z, w, h, d, C.white, 'gloss', { rot, col: true })
  b.box(x, y + h, z, w + 0.04, 0.02, d + 0.04, C.green, 'emissive', { rot })
}

export function modelTrain(b: B, x: number, y: number, z: number, rot = 0, len = 6) {
  // landscape model table with track and a scale train in Big Apple livery
  b.at(x, y, z, rot, () => {
    b.box(0, 0, 0, len + 0.6, 0.85, 2.0, C.anthracite, 'satin')
    b.box(0, 0.85, 0, len + 0.4, 0.06, 1.8, '#6c8f4c', 'matte')
    b.box(0, 0.91, 0.2, len + 0.2, 0.02, 0.3, '#8a8378', 'matte')
    for (const s of [-0.06, 0.06]) b.box(0, 0.93, 0.2 + s, len + 0.2, 0.015, 0.015, '#bbb', 'metal')
    for (let i = 0; i < 4; i++) {
      const px = -len / 2 + 0.8 + i * 1.05
      b.box(px, 0.95, 0.2, 1.0, 0.22, 0.2, C.white, 'gloss')
      b.box(px, 1.05, 0.2, 1.0, 0.07, 0.205, C.black, 'gloss')
      b.box(px, 0.98, 0.2, 1.0, 0.025, 0.206, C.green, 'satin')
    }
    // small buildings & trees on the model
    for (let i = 0; i < 6; i++) b.box(-len / 2 + 0.5 + i * 1.0, 0.91, -0.5, 0.4, 0.2 + (i % 3) * 0.12, 0.35, i % 2 ? C.white : '#c9c4b8', 'matte')
    for (let i = 0; i < 8; i++) b.ico(-len / 2 + 0.3 + i * 0.8, 1.0, 0.7, 0.12, '#3f6e2f', 'matte')
  })
  b.colBox(x, y, z, len + 0.6, 1.1, 2.0, rot)
}
