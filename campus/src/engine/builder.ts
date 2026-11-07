import * as THREE from 'three'
import type { Family } from './materials'
import type { Collider, ColliderShape } from './colliders'
import { world, type Interactable, type NpcSpawn, type ScreenDef } from './registry'

/**
 * WorldBuilder – procedural geometry DSL.
 *
 * Building code describes parts in *local* coordinates (metres, y = up,
 * boxes are specified by their bottom centre). The builder keeps a transform
 * stack, records instanced parts per chunk and registers colliders, zones and
 * interactables in world space. A chunk is later rendered as a handful of
 * InstancedMeshes (one per geometry × material family).
 */

export interface ChunkLod {
  /** hide when the camera is farther away than this (m) */
  maxDist: number
  /** optionally only show when the camera height is within [yMin, yMax] */
  yMin?: number
  yMax?: number
}

export interface SignDef {
  x: number
  y: number
  z: number
  w: number
  h: number
  yaw: number
  pitch?: number
  tex: THREE.Texture
  glow?: number
  curved?: { r: number; thetaStart: number; thetaLength: number }
  doubleSided?: boolean
}

interface PartBucket {
  geo: string
  fam: Family
  matrices: number[]
  colors: number[]
}

export interface Chunk {
  key: string
  lod: ChunkLod
  castShadow: boolean
  buckets: Map<string, PartBucket>
  signs: SignDef[]
  bounds: THREE.Box3
}

// ---------------------------------------------------------------------------
// geometry registry (unit geometries; boxes & cylinders have their base at y=0)

const geoCache = new Map<string, THREE.BufferGeometry>()
export function getGeometry(key: string): THREE.BufferGeometry {
  let g = geoCache.get(key)
  if (g) return g
  const [type, ...args] = key.split('|')
  switch (type) {
    case 'box':
      g = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
      break
    case 'cyl': {
      const segs = Number(args[0] ?? 16)
      const ts = Number(args[1] ?? 0)
      const tl = Number(args[2] ?? Math.PI * 2)
      const open = args[3] === 'o'
      g = new THREE.CylinderGeometry(1, 1, 1, segs, 1, open, ts, tl).translate(0, 0.5, 0)
      break
    }
    case 'cone':
      g = new THREE.CylinderGeometry(0, 1, 1, Number(args[0] ?? 12), 1).translate(0, 0.5, 0)
      break
    case 'frustum':
      g = new THREE.CylinderGeometry(Number(args[0]), 1, 1, Number(args[1] ?? 16), 1).translate(0, 0.5, 0)
      break
    case 'sphere':
      g = new THREE.SphereGeometry(1, Number(args[0] ?? 12), Number(args[1] ?? 8))
      break
    case 'ico':
      g = new THREE.IcosahedronGeometry(1, Number(args[0] ?? 1))
      break
    case 'torus':
      g = new THREE.TorusGeometry(1, Number(args[0] ?? 0.1), 6, Number(args[1] ?? 20))
      break
    default:
      throw new Error('unknown geometry ' + key)
  }
  geoCache.set(key, g)
  return g
}

const colorCache = new Map<string, THREE.Color>()
function col(c: string) {
  let v = colorCache.get(c)
  if (!v) colorCache.set(c, (v = new THREE.Color(c)))
  return v
}

export interface PartOpts {
  rot?: number
  /** add a collider for this part */
  col?: boolean
  /** collider only blocks, does not support */
  noSupport?: boolean
}

const tmpM = new THREE.Matrix4()
const tmpQ = new THREE.Quaternion()
const tmpE = new THREE.Euler()
const tmpV = new THREE.Vector3()
const tmpS = new THREE.Vector3()

export class WorldBuilder {
  chunks = new Map<string, Chunk>()
  private cur!: Chunk
  private stack: { m: THREE.Matrix4; yaw: number }[] = [{ m: new THREE.Matrix4(), yaw: 0 }]

  constructor() {
    this.chunk('site', { maxDist: 5000 }, true)
  }

  get chunkKey() {
    return this.cur.key
  }

  chunk(key: string, lod: ChunkLod = { maxDist: 5000 }, castShadow = true) {
    let c = this.chunks.get(key)
    if (!c) {
      c = { key, lod, castShadow, buckets: new Map(), signs: [], bounds: new THREE.Box3() }
      this.chunks.set(key, c)
    }
    this.cur = c
    return this
  }

  /** run fn inside a temporary chunk */
  inChunk(key: string, lod: ChunkLod, castShadow: boolean, fn: () => void) {
    const prev = this.cur.key
    this.chunk(key, lod, castShadow)
    fn()
    this.cur = this.chunks.get(prev)!
  }

  private get top() {
    return this.stack[this.stack.length - 1]
  }

  /** push a local frame translated to (x,y,z) and rotated by rotY */
  at(x: number, y: number, z: number, rotY: number, fn: () => void) {
    const t = this.top
    const m = t.m.clone().multiply(new THREE.Matrix4().makeRotationY(rotY).setPosition(x, y, z))
    // makeRotationY().setPosition gives T*R
    this.stack.push({ m, yaw: t.yaw + rotY })
    fn()
    this.stack.pop()
  }

  /** local point -> world */
  w(x: number, y: number, z: number): [number, number, number] {
    tmpV.set(x, y, z).applyMatrix4(this.top.m)
    return [tmpV.x, tmpV.y, tmpV.z]
  }
  get yaw() {
    return this.top.yaw
  }

  // ---------------------------------------------------------------- parts
  part(geo: string, local: THREE.Matrix4, color: string, fam: Family) {
    const m = tmpM.multiplyMatrices(this.top.m, local)
    const k = geo + '#' + fam
    let b = this.cur.buckets.get(k)
    if (!b) this.cur.buckets.set(k, (b = { geo, fam, matrices: [], colors: [] }))
    const e = m.elements
    for (let i = 0; i < 16; i++) b.matrices.push(e[i])
    const c = col(color)
    b.colors.push(c.r, c.g, c.b)
    // bounds (approximate with the transformed origin + scale)
    tmpV.setFromMatrixPosition(m)
    tmpS.setFromMatrixScale(m)
    const r = Math.max(tmpS.x, tmpS.y, tmpS.z)
    this.cur.bounds.expandByPoint(tmpV.clone().addScalar(r))
    this.cur.bounds.expandByPoint(tmpV.clone().addScalar(-r))
  }

  private compose(x: number, y: number, z: number, sx: number, sy: number, sz: number, rot = 0, rx = 0, rz = 0) {
    tmpE.set(rx, rot, rz, 'YXZ')
    tmpQ.setFromEuler(tmpE)
    return new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), tmpQ, new THREE.Vector3(sx, sy, sz))
  }

  /** box with bottom-centre at (x,y0,z) */
  box(x: number, y0: number, z: number, w: number, h: number, d: number, color: string, fam: Family = 'matte', o: PartOpts = {}) {
    this.part('box', this.compose(x, y0, z, w, h, d, o.rot ?? 0), color, fam)
    if (o.col) this.colBox(x, y0, z, w, h, d, o.rot ?? 0, o.noSupport)
    return this
  }

  /** tilted box (pitch around local X, after yaw) – visual only */
  boxTilt(x: number, y0: number, z: number, w: number, h: number, d: number, rot: number, pitch: number, color: string, fam: Family = 'matte') {
    this.part('box', this.compose(x, y0, z, w, h, d, rot, pitch), color, fam)
  }

  cyl(x: number, y0: number, z: number, r: number, h: number, color: string, fam: Family = 'matte', o: PartOpts & { segs?: number; rz?: number } = {}) {
    const segs = o.segs ?? 16
    this.part('cyl|' + segs, this.compose(x, y0, z, r, h, o.rz ?? r, o.rot ?? 0), color, fam)
    if (o.col) this.colCyl(x, y0, z, Math.max(r, o.rz ?? r), h)
    return this
  }

  /** horizontal cylinder along local X (wheels, rails, pipes) */
  cylX(x: number, y: number, z: number, r: number, len: number, color: string, fam: Family = 'matte', rot = 0, segs = 12) {
    // rotate a Y cylinder by 90° around Z, centre it
    tmpE.set(0, rot, Math.PI / 2, 'YXZ')
    tmpQ.setFromEuler(tmpE)
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), tmpQ, new THREE.Vector3(r, len, r))
    m.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0))
    this.part('cyl|' + segs, m, color, fam)
  }

  /**
   * Curved surface / sector. Angles use atan2(z, x) convention (a0 → a1 CCW
   * when looking from above in maths orientation).
   */
  arc(x: number, y0: number, z: number, r: number, h: number, a0: number, a1: number, color: string, fam: Family = 'matte', open = true, segs = 48) {
    const ts = +(Math.PI / 2 - a1).toFixed(4)
    const tl = +(a1 - a0).toFixed(4)
    this.part(`cyl|${segs}|${ts}|${tl}|${open ? 'o' : 'c'}`, this.compose(x, y0, z, r, h, r), color, fam)
  }

  /** half cylinder lying along local x (vaulted roofs) */
  barrel(x: number, y: number, z: number, r: number, len: number, color: string, fam: Family = 'matte', rot = 0, segs = 24, sy = 1) {
    tmpE.set(0, rot, Math.PI / 2, 'YXZ')
    tmpQ.setFromEuler(tmpE)
    const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), tmpQ, new THREE.Vector3(r * sy, len, r))
    m.multiply(new THREE.Matrix4().makeTranslation(0, -0.5, 0))
    this.part(`cyl|${segs}|0|3.1416|o`, m, color, fam)
  }

  sphere(x: number, y: number, z: number, r: number, color: string, fam: Family = 'matte', sy = 1, segs = 12) {
    this.part(`sphere|${segs}|${Math.max(6, segs >> 1)}`, this.compose(x, y, z, r, r * sy, r), color, fam)
  }

  ico(x: number, y: number, z: number, r: number, color: string, fam: Family = 'matte', sy = 1) {
    this.part('ico|1', this.compose(x, y, z, r, r * sy, r), color, fam)
  }

  cone(x: number, y0: number, z: number, r: number, h: number, color: string, fam: Family = 'matte', segs = 10) {
    this.part('cone|' + segs, this.compose(x, y0, z, r, h, r), color, fam)
  }

  // ---------------------------------------------------------------- signs
  sign(x: number, y: number, z: number, w: number, h: number, tex: THREE.Texture, rot = 0, glow = 0.35, doubleSided = false) {
    const [wx, wy, wz] = this.w(x, y, z)
    this.cur.signs.push({ x: wx, y: wy, z: wz, w, h, yaw: this.yaw + rot, tex, glow, doubleSided })
  }
  /** Sign lying flat on the ground / floor */
  floorSign(x: number, y: number, z: number, w: number, h: number, tex: THREE.Texture, rot = 0) {
    const [wx, wy, wz] = this.w(x, y, z)
    this.cur.signs.push({ x: wx, y: wy, z: wz, w, h, yaw: this.yaw + rot, pitch: -Math.PI / 2, tex, glow: 0 })
  }
  curvedSign(x: number, y: number, z: number, r: number, h: number, a0: number, a1: number, tex: THREE.Texture, glow = 0.4) {
    const [wx, wy, wz] = this.w(x, y, z)
    // convert angle convention: a(world) = a(local) - yaw
    const A0 = a0 - this.yaw
    const A1 = a1 - this.yaw
    this.cur.signs.push({
      x: wx, y: wy, z: wz, w: r, h, yaw: 0, tex, glow,
      curved: { r, thetaStart: Math.PI / 2 - A1, thetaLength: A1 - A0 },
    })
  }

  // ---------------------------------------------------------------- colliders
  private addCol(shape: ColliderShape, y0: number, y1: number, extra: Partial<Collider> = {}) {
    world.collision.add({ ...shape, y0, y1, ...extra } as Collider)
  }
  colBox(x: number, y0: number, z: number, w: number, h: number, d: number, rot = 0, noSupport = false, extra: Partial<Collider> = {}) {
    const [wx, wy, wz] = this.w(x, y0, z)
    this.addCol({ kind: 'box', cx: wx, cz: wz, hx: w / 2, hz: d / 2, rot: this.yaw + rot }, wy, wy + h, { noSupport, ...extra })
  }
  colCyl(x: number, y0: number, z: number, r: number, h: number, extra: Partial<Collider> = {}) {
    const [wx, wy, wz] = this.w(x, y0, z)
    this.addCol({ kind: 'cyl', cx: wx, cz: wz, r }, wy, wy + h, extra)
  }
  colArc(x: number, y0: number, z: number, r0: number, r1: number, a0: number, a1: number, h: number, extra: Partial<Collider> = {}) {
    const [wx, wy, wz] = this.w(x, y0, z)
    this.addCol({ kind: 'arc', cx: wx, cz: wz, r0, r1, a0: a0 - this.yaw, a1: a1 - this.yaw }, wy, wy + h, extra)
  }

  /** world-space test for a local rectangle (centre x,z, size w×d) – used for openings & conveyors */
  rectTest(x: number, z: number, w: number, d: number): (px: number, pz: number) => boolean {
    const [cx, , cz] = this.w(x, 0, z)
    const c = Math.cos(this.yaw)
    const s = Math.sin(this.yaw)
    return (px, pz) => {
      const dx = px - cx
      const dz = pz - cz
      const lx = dx * c - dz * s
      const lz = dx * s + dz * c
      return Math.abs(lx) <= w / 2 && Math.abs(lz) <= d / 2
    }
  }
  /** local direction → world direction (unit) */
  dirW(lx: number, lz: number): [number, number] {
    const c = Math.cos(this.yaw)
    const s = Math.sin(this.yaw)
    return [lx * c + lz * s, -lx * s + lz * c]
  }

  // ---------------------------------------------------------------- registries
  zone(name: string, x: number, y0: number, z: number, w: number, h: number, d: number, meta: { building?: string; floor?: string } = {}) {
    const [cx, cy, cz] = this.w(x, y0, z)
    const yaw = this.yaw
    const cos = Math.cos(yaw)
    const sin = Math.sin(yaw)
    world.zones.push({
      name,
      ...meta,
      area: w * d,
      test: (px, py, pz) => {
        if (py < cy - 0.5 || py > cy + h) return false
        const dx = px - cx
        const dz = pz - cz
        const lx = dx * cos - dz * sin
        const lz = dx * sin + dz * cos
        return Math.abs(lx) <= w / 2 && Math.abs(lz) <= d / 2
      },
    })
  }
  zoneSector(name: string, r0: number, r1: number, a0: number, a1: number, y0: number, h: number, meta: { building?: string; floor?: string } = {}) {
    const [cx, cy, cz] = this.w(0, y0, 0)
    const A0 = a0 - this.yaw
    const span = a1 - a0
    world.zones.push({
      name,
      ...meta,
      area: 0.5 * span * (r1 * r1 - r0 * r0),
      test: (px, py, pz) => {
        if (py < cy - 0.5 || py > cy + h) return false
        const d = Math.hypot(px - cx, pz - cz)
        if (d < r0 || d > r1) return false
        let a = Math.atan2(pz - cz, px - cx) - A0
        a = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        return a <= span
      },
    })
  }

  interact(def: Omit<Interactable, 'x' | 'y' | 'z'> & { lx: number; ly: number; lz: number }) {
    const [x, y, z] = this.w(def.lx, def.ly, def.lz)
    const { lx: _a, ly: _b, lz: _c, ...rest } = def
    void _a; void _b; void _c
    const it: Interactable = { ...rest, x, y, z }
    world.interactables.push(it)
    return it
  }

  npc(spawn: NpcSpawn & { local?: boolean }) {
    const s = { ...spawn, chunk: spawn.chunk ?? this.cur.key }
    if (spawn.local !== false) {
      if (s.path) s.path = s.path.map(([x, y, z]) => this.w(x, y, z))
      if (s.x !== undefined) {
        const [x, y, z] = this.w(s.x, s.y ?? 0, s.z ?? 0)
        s.x = x; s.y = y; s.z = z
        s.yaw = (s.yaw ?? 0) + this.yaw
      }
    }
    world.npcs.push(s)
  }

  screen(def: Omit<ScreenDef, 'x' | 'y' | 'z' | 'yaw'> & { lx: number; ly: number; lz: number; rot?: number }) {
    const [x, y, z] = this.w(def.lx, def.ly, def.lz)
    const s: ScreenDef = { id: def.id, w: def.w, h: def.h, slides: def.slides, x, y, z, yaw: this.yaw + (def.rot ?? 0), chunk: def.chunk ?? this.cur.key, suffix: def.suffix }
    world.screens.push(s)
    return s
  }
}
