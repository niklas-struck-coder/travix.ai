import { WorldBuilder } from '../engine/builder'
import { world, uid } from '../engine/registry'
import { C } from '../engine/materials'
import { player, ui, toast } from '../state/store'

/* ===========================================================================
 * Elevators
 * ======================================================================== */

export interface Stop {
  label: string
  y: number
}

export class Elevator {
  id: string
  name: string
  cx: number
  cz: number
  yaw: number
  baseY: number
  w = 2.4
  d = 2.3
  stops: Stop[]
  y: number
  index = 0
  target = 0
  state: 'idle' | 'closing' | 'moving' | 'opening' = 'idle'
  door = 1 // 0 closed .. 1 open
  holdOpen = 6
  glass: boolean

  constructor(id: string, name: string, cx: number, cz: number, yaw: number, stops: Stop[], startIndex = 0, glass = false) {
    this.id = id
    this.name = name
    this.cx = cx
    this.cz = cz
    this.yaw = yaw
    this.stops = stops
    this.index = this.target = startIndex
    this.y = stops[startIndex].y
    this.baseY = Math.min(...stops.map((s) => s.y))
    this.glass = glass
  }

  /** local coordinates of a world point relative to the cab centre */
  local(x: number, z: number): [number, number] {
    const dx = x - this.cx
    const dz = z - this.cz
    const c = Math.cos(this.yaw)
    const s = Math.sin(this.yaw)
    return [dx * c - dz * s, dx * s + dz * c]
  }

  playerInside() {
    const [lx, lz] = this.local(player.pos.x, player.pos.z)
    return Math.abs(lx) < this.w / 2 && Math.abs(lz) < this.d / 2 + 0.1 && Math.abs(player.pos.y - this.y) < 1.2
  }

  call(i: number) {
    if (i < 0 || i >= this.stops.length) return
    if (this.state === 'moving' || this.state === 'closing') {
      this.target = i
      return
    }
    if (i === this.index) {
      this.state = 'opening'
      this.holdOpen = 8
      return
    }
    this.target = i
    this.state = 'closing'
  }

  update(dt: number) {
    const inside = this.playerInside()
    switch (this.state) {
      case 'idle':
        if (this.door > 0) {
          this.holdOpen -= dt
          if (this.holdOpen <= 0 && !inside) this.door = Math.max(0, this.door - dt * 1.2)
        }
        break
      case 'opening':
        this.door = Math.min(1, this.door + dt * 1.1)
        if (this.door >= 1) {
          this.state = 'idle'
          this.holdOpen = 7
        }
        break
      case 'closing':
        this.door = Math.max(0, this.door - dt * 1.1)
        if (this.door <= 0) this.state = 'moving'
        break
      case 'moving': {
        const ty = this.stops[this.target].y
        const dist = ty - this.y
        const speed = Math.min(4.5, 0.6 + Math.abs(dist) * 0.9)
        const step = Math.sign(dist) * Math.min(Math.abs(dist), speed * dt)
        this.y += step
        if (inside) {
          player.pos.y = this.y
          player.vel.y = 0
        }
        if (Math.abs(ty - this.y) < 0.001) {
          this.y = ty
          this.index = this.target
          this.state = 'opening'
          if (inside) toast(`${this.name}: ${this.stops[this.index].label}`)
        }
        break
      }
    }
    if (inside) player.locked = this.state === 'moving'
  }

  openAt(i: number) {
    return this.index === i && this.state !== 'moving' && this.door > 0.65
  }
}

export const elevators: Elevator[] = []
export const elevatorById = (id: string) => elevators.find((e) => e.id === id)

/**
 * Builds an elevator shaft (local frame: door on +z side of the cab).
 * The caller must leave a hole in its floor slabs for x∈[-1.4,1.4], z∈[-1.3,1.3].
 */
export function buildElevator(
  b: WorldBuilder,
  o: { x: number; z: number; rot: number; name: string; stops: Stop[]; start?: number; glass?: boolean; frame?: string },
) {
  const id = uid('elev')
  let el!: Elevator
  b.at(o.x, 0, o.z, o.rot, () => {
    const [cx, , cz] = b.w(0, 0, 0)
    el = new Elevator(id, o.name, cx, cz, b.yaw, o.stops, o.start ?? 0, o.glass)
    const y0 = el.baseY - 0.3
    // shafts reaching below ground punch a hole into the ground slab
    if (el.baseY < -0.5 && Math.max(...o.stops.map((s) => s.y)) > -0.5) world.groundHoles.push(b.rectTest(0, 0, el.w + 0.8, el.d + 0.9))
    const y1 = Math.max(...o.stops.map((s) => s.y)) + 3.6
    const H = y1 - y0
    const W = el.w + 0.3
    const D = el.d + 0.3
    const wallCol = o.glass ? C.glassTint : C.offwhite
    const wallFam = o.glass ? 'glass' : 'satin'
    // back + side walls of the shaft
    b.box(0, y0, -D / 2, W + 0.3, H, 0.15, wallCol, wallFam, { col: true })
    b.box(-W / 2, y0, 0, 0.15, H, D, wallCol, wallFam, { col: true })
    b.box(W / 2, y0, 0, 0.15, H, D, wallCol, wallFam, { col: true })
    if (o.glass) {
      // structural frame posts
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) b.box((sx * W) / 2, y0, (sz * D) / 2, 0.16, H, 0.16, o.frame ?? C.anthracite, 'metal')
    }
    // front wall: posts left/right of the 1.3 m door opening and lintels above each landing
    const doorW = 1.3
    const side = (W - doorW) / 2
    b.box(-(doorW / 2 + side / 2), y0, D / 2, side, H, 0.18, wallCol, wallFam, { col: true })
    b.box(doorW / 2 + side / 2, y0, D / 2, side, H, 0.18, wallCol, wallFam, { col: true })
    const ys = [...o.stops.map((s) => s.y)].sort((a, b) => a - b)
    let cursor = y0
    for (const sy of ys) {
      if (sy - cursor > 0.05) b.box(0, cursor, D / 2, doorW, sy - cursor, 0.18, wallCol, wallFam, { col: true })
      cursor = sy + 2.3
    }
    b.box(0, cursor, D / 2, doorW, y1 - cursor, 0.18, wallCol, wallFam, { col: true })
    // roof of the shaft
    b.box(0, y1, 0, W + 0.3, 0.2, D + 0.3, C.anthracite)

    o.stops.forEach((s, i) => {
      // landing door collider (closed unless the cab is here with doors open)
      b.colBox(0, s.y, D / 2, doorW, 2.3, 0.2, 0, true, { enabled: () => !el.openAt(i) })
      // door frame + floor indicator
      b.box(0, s.y + 2.3, D / 2 + 0.1, doorW + 0.3, 0.12, 0.06, C.green, 'emissive')
      b.box(-doorW / 2 - 0.1, s.y, D / 2 + 0.1, 0.08, 2.4, 0.06, C.anthracite, 'metal')
      b.box(doorW / 2 + 0.1, s.y, D / 2 + 0.1, 0.08, 2.4, 0.06, C.anthracite, 'metal')
      // call panel
      b.box(doorW / 2 + 0.45, s.y + 1.0, D / 2 + 0.1, 0.16, 0.3, 0.04, C.black, 'gloss')
      b.box(doorW / 2 + 0.45, s.y + 1.12, D / 2 + 0.13, 0.06, 0.06, 0.02, C.green, 'emissive')
      b.interact({
        id: `${id}-call-${i}`,
        lx: 0, ly: s.y + 1.2, lz: D / 2 + 1.1,
        radius: 2.2,
        priority: 2,
        label: () => (el.openAt(i) ? `Aufzug: Etage wählen (${o.name})` : el.index === i ? 'Aufzug öffnen' : 'Aufzug rufen'),
        action: () => {
          if (el.openAt(i)) ui().set({ elevatorPanel: id })
          else el.call(i)
        },
      })
    })
    // cab floor (moves with the cab)
    b.colBox(0, -0.25, 0, el.w, 0.25, el.d, 0, false, { dynamicY: () => el.y })
    // inside panel interaction
    world.interactables.push({
      id: `${id}-cab`,
      x: cx, y: 0, z: cz, radius: 1.9, priority: 1,
      getPos: () => [cx, el.y + 1.2, cz],
      enabled: () => el.playerInside() && el.state !== 'moving',
      label: () => `Etage wählen – ${o.name}`,
      action: () => ui().set({ elevatorPanel: id }),
    })
  })
  elevators.push(el)
  return el
}

/* ===========================================================================
 * Automatic sliding doors
 * ======================================================================== */

export class SlidingDoor {
  open = 0
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public yaw: number,
    public width: number,
    public height: number,
    public frame: string,
  ) {}
  forceOpen = 0
  update(dt: number) {
    const near = Math.hypot(player.pos.x - this.x, player.pos.z - this.z) < 4 && Math.abs(player.pos.y - this.y) < 2.5
    const target = near || this.forceOpen > 0 ? 1 : 0
    this.forceOpen = Math.max(0, this.forceOpen - dt)
    this.open += Math.sign(target - this.open) * Math.min(Math.abs(target - this.open), dt * 2.2)
  }
}
export const doors: SlidingDoor[] = []

/**
 * Entrance with automatic sliding doors at local (x, y, z); doors span along local x.
 * `inside` = direction (+1/-1 on local z) that leads into the building.
 */
export function buildEntrance(
  b: WorldBuilder,
  o: { x: number; y?: number; z: number; rot?: number; width?: number; height?: number; name: string; inside?: number; frame?: string; info?: string },
) {
  const y = o.y ?? 0
  const width = o.width ?? 2.6
  const height = o.height ?? 2.7
  const inside = o.inside ?? -1
  b.at(o.x, y, o.z, o.rot ?? 0, () => {
    const [x, wy, z] = b.w(0, 0, 0)
    const d = new SlidingDoor(x, wy, z, b.yaw, width, height, o.frame ?? C.anthracite)
    doors.push(d)
    b.colBox(0, 0, 0, width, height, 0.25, 0, true, { enabled: () => d.open < 0.6 })
    // frame
    b.box(0, height, 0, width + 0.4, 0.25, 0.3, o.frame ?? C.anthracite, 'metal')
    b.box(-width / 2 - 0.1, 0, 0, 0.2, height, 0.3, o.frame ?? C.anthracite, 'metal')
    b.box(width / 2 + 0.1, 0, 0, 0.2, height, 0.3, o.frame ?? C.anthracite, 'metal')
    // entrance mat
    b.box(0, 0.005, -inside * 1.2, width, 0.02, 1.6, '#2b2b2b')
    b.box(0, 0.005, inside * 1.2, width, 0.02, 1.6, '#2b2b2b')
    // world targets are captured now (the builder stack is gone at runtime)
    const [tx, , tz] = b.w(0, 0, inside * 4.5)
    const [ox, , oz] = b.w(0, 0, -inside * 4)
    b.interact({
      id: uid('door'),
      lx: 0, ly: 1.3, lz: -inside * 1.6,
      radius: 3.2,
      priority: 3,
      label: () => `${o.name} betreten`,
      action: () => {
        d.forceOpen = 3
        player.autoWalk = { x: tx, z: tz, t: 2.5 }
      },
    })
    b.interact({
      id: uid('door-exit'),
      lx: 0, ly: 1.3, lz: inside * 1.6,
      radius: 2.6,
      priority: 3,
      label: () => 'Gebäude verlassen',
      action: () => {
        d.forceOpen = 3
        player.autoWalk = { x: ox, z: oz, t: 2.5 }
      },
    })
  })
}

/* ===========================================================================
 * Stairs: real step boxes → climbable via step-up
 * ======================================================================== */

/**
 * Straight stair rising along local +z starting at (x, y, z).
 * Returns the end z. Each step 0.3 m deep, ~0.17 m high.
 */
export function buildStair(
  b: WorldBuilder,
  x: number,
  y: number,
  z: number,
  width: number,
  rise: number,
  o: { color?: string; rot?: number; railing?: 'both' | 'left' | 'right' | 'none'; glassRail?: boolean; steps?: number } = {},
) {
  const n = o.steps ?? Math.max(2, Math.round(rise / 0.175))
  const h = rise / n
  const depth = 0.3
  b.at(x, y, z, o.rot ?? 0, () => {
    for (let i = 0; i < n; i++) {
      const top = (i + 1) * h
      // visual step: a slab with a short riser; collider: solid block to the floor (prevents walking under it)
      b.box(0, top - h, i * depth + depth / 2, width, h, depth, o.color ?? C.stone, 'satin')
      b.box(0, Math.max(0, top - 0.35), i * depth + depth / 2, width * 0.98, Math.min(0.35, top), depth, C.offwhite, 'matte')
      b.colBox(0, 0, i * depth + depth / 2, width, top, depth)
    }
    const len = n * depth
    // stringer / underside
    const ang = Math.atan2(rise, len)
    const hyp = Math.hypot(rise, len)
    b.boxTilt(0, 0, 0, width, 0.12, hyp, 0, -ang, C.offwhite, 'matte')
    const rail = o.railing ?? 'both'
    const sides = rail === 'both' ? [-1, 1] : rail === 'left' ? [-1] : rail === 'right' ? [1] : []
    for (const s of sides) {
      const rx = (s * width) / 2
      // glass balustrade along the stair + handrail
      b.boxTilt(rx, 0.15, 0, 0.03, 0.95, hyp, 0, -ang, C.glassTint, 'glass')
      b.boxTilt(rx, 1.05, 0, 0.06, 0.05, hyp, 0, -ang, C.anthracite, 'metal')
      // collider for the balustrade (follows the stair in segments)
      for (let i = 0; i < n; i += 3) b.colBox(rx, (i + 1) * h, i * depth + 0.45, 0.1, 1.1, 0.9, 0, true)
    }
  })
  return z + n * depth
}

/** Spiral stair around a column (all steps are rotated boxes) */
export function buildSpiralStair(
  b: WorldBuilder,
  x: number,
  y: number,
  z: number,
  rise: number,
  o: { rInner?: number; rOuter?: number; startAngle?: number; stepAngle?: number; color?: string } = {},
) {
  const r0 = o.rInner ?? 0.9
  const r1 = o.rOuter ?? 3.2
  const n = Math.max(4, Math.round(rise / 0.18))
  const h = rise / n
  const da = o.stepAngle ?? 0.25
  const a0 = o.startAngle ?? 0
  const rm = (r0 + r1) / 2
  const stepLen = r1 - r0
  const stepW = da * r1 + 0.05
  b.at(x, y, z, 0, () => {
    b.cyl(0, 0, 0, r0, rise + 1.2, C.white, 'satin', { col: true, segs: 24 })
    for (let i = 0; i < n; i++) {
      const a = a0 + i * da // atan2 convention
      const px = Math.cos(a) * rm
      const pz = Math.sin(a) * rm
      const rot = -a // local x of the box along the radius
      const top = (i + 1) * h
      b.box(px, top - 0.08, pz, stepLen, 0.08, stepW * 0.95, C.wood, 'satin', { rot })
      b.colBox(px, top - Math.min(top, 1.2), pz, stepLen, Math.min(top, 1.2), stepW * 0.9, rot)
      // outer balustrade post + glass
      const ox = Math.cos(a) * (r1 + 0.03)
      const oz = Math.sin(a) * (r1 + 0.03)
      b.box(ox, top, oz, 0.04, 1.0, stepW, C.glassTint, 'glass', { rot })
      b.box(ox, top + 1.0, oz, 0.07, 0.05, stepW, C.anthracite, 'metal', { rot })
      b.colBox(ox, top, oz, 0.12, 1.1, stepW, rot, true)
      // green LED strip under each tread
      b.box(Math.cos(a) * (r1 - 0.05), top - 0.1, Math.sin(a) * (r1 - 0.05), 0.04, 0.02, stepW * 0.8, C.green, 'emissive', { rot })
    }
  })
  return { n, h, endAngle: a0 + n * da }
}

/** small helper: seat interactable */
export function seat(b: WorldBuilder, x: number, y: number, z: number, rot: number, label = 'Hinsetzen') {
  const [wx, wy, wz] = b.w(x, y, z)
  const yaw = b.yaw + rot
  world.interactables.push({
    id: uid('seat'),
    x: wx, y: wy + 0.5, z: wz,
    radius: 1.4,
    priority: 5,
    label: () => label,
    action: () => {
      player.seat = { x: wx, y: wy, z: wz, yaw }
      player.mode = 'seated'
      ui().set({ seated: true })
    },
  })
}

/** info point (screen / board) that opens an info panel */
export function infoPoint(b: WorldBuilder, x: number, y: number, z: number, title: string, body: string[], o: { label?: string; subtitle?: string; suffix?: string; radius?: number } = {}) {
  b.interact({
    id: uid('info'),
    lx: x, ly: y, lz: z,
    radius: o.radius ?? 2.4,
    priority: 4,
    label: () => o.label ?? `Info: ${title}`,
    action: () => ui().set({ info: { title, subtitle: o.subtitle, body, suffix: o.suffix } }),
  })
}
