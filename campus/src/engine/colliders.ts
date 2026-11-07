/**
 * Lightweight collision world.
 *
 * Everything solid in the campus is described by three primitive shapes that
 * all have a vertical extent [y0, y1]:
 *  - box : oriented rectangle in XZ (rotation around Y)
 *  - cyl : vertical cylinder
 *  - arc : annular sector (used for round walls / round floor slabs of the HQ)
 *
 * The player is a vertical capsule approximated by a circle in XZ plus a height.
 * - Floors / stairs / slabs are simply the top faces of the shapes (support).
 * - Walls are shapes whose vertical range intersects the body above the
 *   step height → they push the circle out horizontally.
 * - Ceilings are bottom faces above the head.
 * Stairs therefore work automatically: every step is a box whose top is less
 * than the step height above the previous one.
 */

export type ColliderShape =
  | { kind: 'box'; cx: number; cz: number; hx: number; hz: number; rot: number }
  | { kind: 'cyl'; cx: number; cz: number; r: number }
  | { kind: 'arc'; cx: number; cz: number; r0: number; r1: number; a0: number; a1: number }

export type Collider = ColliderShape & {
  y0: number
  y1: number
  /** Dynamic colliders (doors, elevator cabs) can switch themselves off / move. */
  enabled?: () => boolean
  dynamicY?: () => number // if set, the shape is shifted by this vertical offset
  /** Only blocks, never supports (e.g. invisible boundaries / railings) */
  noSupport?: boolean
  /** the collider does not exist at these points (openings, e.g. elevator shafts in the ground) */
  except?: (x: number, z: number) => boolean
}

const CELL = 24
const TAU = Math.PI * 2

function normAngle(a: number) {
  a = a % TAU
  return a < 0 ? a + TAU : a
}
/** is angle a within the CCW interval [a0, a1] (a1 may wrap) */
function angleIn(a: number, a0: number, a1: number) {
  const span = normAngle(a1 - a0)
  if (a1 - a0 >= TAU - 1e-6) return true
  return normAngle(a - a0) <= span
}

function aabbOf(c: Collider): [number, number, number, number] {
  switch (c.kind) {
    case 'box': {
      const cos = Math.abs(Math.cos(c.rot))
      const sin = Math.abs(Math.sin(c.rot))
      const ex = c.hx * cos + c.hz * sin
      const ez = c.hx * sin + c.hz * cos
      return [c.cx - ex, c.cz - ez, c.cx + ex, c.cz + ez]
    }
    case 'cyl':
      return [c.cx - c.r, c.cz - c.r, c.cx + c.r, c.cz + c.r]
    case 'arc':
      return [c.cx - c.r1, c.cz - c.r1, c.cx + c.r1, c.cz + c.r1]
  }
}

/** Closest point of the shape footprint to (x,z). Returns [px, pz, inside] */
function closest(c: Collider, x: number, z: number): [number, number, boolean] {
  switch (c.kind) {
    case 'box': {
      const dx = x - c.cx
      const dz = z - c.cz
      const cos = Math.cos(c.rot)
      const sin = Math.sin(c.rot)
      // world -> local (rotation around Y by -rot)
      const lx = dx * cos - dz * sin
      const lz = dx * sin + dz * cos
      const inside = Math.abs(lx) <= c.hx && Math.abs(lz) <= c.hz
      let qx = Math.max(-c.hx, Math.min(c.hx, lx))
      let qz = Math.max(-c.hz, Math.min(c.hz, lz))
      if (inside) {
        // push to nearest edge
        const px = c.hx - Math.abs(lx)
        const pz = c.hz - Math.abs(lz)
        if (px < pz) qx = Math.sign(lx || 1) * c.hx
        else qz = Math.sign(lz || 1) * c.hz
      }
      // local -> world
      const wx = qx * cos + qz * sin
      const wz = -qx * sin + qz * cos
      return [c.cx + wx, c.cz + wz, inside]
    }
    case 'cyl': {
      const dx = x - c.cx
      const dz = z - c.cz
      const d = Math.hypot(dx, dz) || 1e-6
      const inside = d <= c.r
      return [c.cx + (dx / d) * c.r, c.cz + (dz / d) * c.r, inside]
    }
    case 'arc': {
      const dx = x - c.cx
      const dz = z - c.cz
      const d = Math.hypot(dx, dz) || 1e-6
      const a = Math.atan2(dz, dx)
      const inAng = angleIn(a, c.a0, c.a1)
      const inRad = d >= c.r0 && d <= c.r1
      if (inAng && inRad) {
        // push to nearest of radial boundaries or angular boundaries
        const toR0 = d - c.r0
        const toR1 = c.r1 - d
        const toA0 = normAngle(a - c.a0) * d
        const toA1 = normAngle(c.a1 - a) * d
        const m = Math.min(toR0, toR1, toA0, toA1)
        if (m === toR0 && c.r0 > 0.01) return [c.cx + (dx / d) * c.r0, c.cz + (dz / d) * c.r0, true]
        if (m === toR1 || c.r0 <= 0.01) return [c.cx + (dx / d) * c.r1, c.cz + (dz / d) * c.r1, true]
        const edgeA = m === toA0 ? c.a0 : c.a1
        return [c.cx + Math.cos(edgeA) * d, c.cz + Math.sin(edgeA) * d, true]
      }
      let ca = a
      if (!inAng) {
        // clamp to nearer angular end
        const d0 = Math.min(normAngle(a - c.a0), normAngle(c.a0 - a))
        const d1 = Math.min(normAngle(a - c.a1), normAngle(c.a1 - a))
        ca = d0 < d1 ? c.a0 : c.a1
      }
      const cr = Math.max(c.r0, Math.min(c.r1, d))
      return [c.cx + Math.cos(ca) * cr, c.cz + Math.sin(ca) * cr, false]
    }
  }
}

function overlapsCircle(c: Collider, x: number, z: number, r: number) {
  const [px, pz, inside] = closest(c, x, z)
  if (inside) return true
  return (px - x) ** 2 + (pz - z) ** 2 < r * r
}

export class CollisionWorld {
  private grid = new Map<string, Collider[]>()
  dynamic: Collider[] = []
  count = 0

  add(c: Collider) {
    this.count++
    if (c.enabled || c.dynamicY) {
      this.dynamic.push(c)
      return
    }
    const [x0, z0, x1, z1] = aabbOf(c)
    for (let gx = Math.floor(x0 / CELL); gx <= Math.floor(x1 / CELL); gx++)
      for (let gz = Math.floor(z0 / CELL); gz <= Math.floor(z1 / CELL); gz++) {
        const k = gx + ',' + gz
        let arr = this.grid.get(k)
        if (!arr) this.grid.set(k, (arr = []))
        arr.push(c)
      }
  }

  private seen = new Set<Collider>()
  private out: Collider[] = []
  /** colliders near a circle */
  query(x: number, z: number, r: number): Collider[] {
    this.seen.clear()
    this.out.length = 0
    for (let gx = Math.floor((x - r) / CELL); gx <= Math.floor((x + r) / CELL); gx++)
      for (let gz = Math.floor((z - r) / CELL); gz <= Math.floor((z + r) / CELL); gz++) {
        const arr = this.grid.get(gx + ',' + gz)
        if (!arr) continue
        for (const c of arr)
          if (!this.seen.has(c)) {
            this.seen.add(c)
            this.out.push(c)
          }
      }
    for (const c of this.dynamic) if (!c.enabled || c.enabled()) this.out.push(c)
    return this.out
  }

  private ys(c: Collider): [number, number] {
    const o = c.dynamicY ? c.dynamicY() : 0
    return [c.y0 + o, c.y1 + o]
  }

  /** Highest surface whose top is <= maxY under the (small) circle. */
  support(x: number, z: number, maxY: number, r = 0.12): number {
    let best = -Infinity
    for (const c of this.query(x, z, r + 0.1)) {
      if (c.noSupport) continue
      if (c.except && c.except(x, z)) continue
      const [, y1] = this.ys(c)
      if (y1 > maxY || y1 <= best) continue
      if (overlapsCircle(c, x, z, r)) best = y1
    }
    return best
  }

  /** Lowest bottom face above minY under the circle. */
  ceiling(x: number, z: number, minY: number, r = 0.25): number {
    let best = Infinity
    for (const c of this.query(x, z, r + 0.1)) {
      if (c.except && c.except(x, z)) continue
      const [y0] = this.ys(c)
      if (y0 < minY || y0 >= best) continue
      if (overlapsCircle(c, x, z, r)) best = y0
    }
    return best
  }

  /**
   * Push a circle (x,z,r) living between yLow and yHigh out of all walls.
   * Returns corrected position.
   */
  resolve(x: number, z: number, r: number, yLow: number, yHigh: number): [number, number] {
    for (let iter = 0; iter < 3; iter++) {
      let moved = false
      for (const c of this.query(x, z, r + 0.2)) {
        if (c.except && c.except(x, z)) continue
        const [y0, y1] = this.ys(c)
        if (y1 <= yLow || y0 >= yHigh) continue
        const [px, pz, inside] = closest(c, x, z)
        let dx = x - px
        let dz = z - pz
        let d = Math.hypot(dx, dz)
        if (inside) {
          // we are inside the footprint: move to the boundary point then out by r
          if (d < 1e-6) {
            dx = 1
            dz = 0
            d = 1
          }
          x = px - (dx / d) * r
          z = pz - (dz / d) * r
          moved = true
        } else if (d < r) {
          if (d < 1e-6) continue
          x = px + (dx / d) * r
          z = pz + (dz / d) * r
          moved = true
        }
      }
      if (!moved) break
    }
    return [x, z]
  }

  /** Is the point inside any solid? (used for camera ray marching) */
  solidAt(x: number, y: number, z: number, r = 0.15): boolean {
    for (const c of this.query(x, z, r + 0.1)) {
      if (c.except && c.except(x, z)) continue
      const [y0, y1] = this.ys(c)
      if (y < y0 - r || y > y1 + r) continue
      if (overlapsCircle(c, x, z, r)) return true
    }
    return false
  }
}
