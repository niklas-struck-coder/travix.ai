/**
 * Elevated monorail: closed loop track, five stations, one 3-car train with
 * automatic stop / door / departure cycle. The player can board at a station
 * and ride inside the car (first-person view from the cabin).
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WorldBuilder } from '../engine/builder'
import { C, logoTexture, textTexture } from '../engine/materials'
import { world } from '../engine/registry'
import { DEG, LAYOUT, STATIONS, monorailControlPoints, polar } from '../config/campus'
import { buildElevator, buildStair } from '../world/dynamic'
import * as K from '../world/kits'
import { player, toast, ui } from '../state/store'

export const PLATFORM_Y = 6.8
const BEAM_TOP = 6.0
const CAR_LEN = 11.6
const CAR_GAP = 0.8
const N_CARS = 3

// --------------------------------------------------------------------------- track
const ordered = [...STATIONS].sort((a, b) => a.angle - b.angle)

function buildCurve() {
  const pts = monorailControlPoints().map(([x, z]) => new THREE.Vector3(x, 0, z))
  return new THREE.CatmullRomCurve3(pts, true, 'centripetal')
}

class Track {
  curve = buildCurve()
  samples: THREE.Vector3[] = []
  cum: number[] = []
  length = 0
  stationS: number[] = []
  constructor() {
    const N = 4000
    let acc = 0
    for (let i = 0; i <= N; i++) {
      const p = this.curve.getPoint(i / N)
      if (i > 0) acc += p.distanceTo(this.samples[i - 1])
      this.samples.push(p)
      this.cum.push(acc)
    }
    this.length = acc
    for (const st of ordered) {
      const [cx, cz] = polar(st.angle, LAYOUT.monorailRadius)
      let best = 0
      let bd = Infinity
      this.samples.forEach((p, i) => {
        const d = (p.x - cx) ** 2 + (p.z - cz) ** 2
        if (d < bd) {
          bd = d
          best = i
        }
      })
      this.stationS.push(this.cum[best])
    }
  }
  /** position & tangent at arc length s */
  at(s: number, outP: THREE.Vector3, outT: THREE.Vector3) {
    s = ((s % this.length) + this.length) % this.length
    let lo = 0
    let hi = this.cum.length - 1
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1
      if (this.cum[m] < s) lo = m
      else hi = m
    }
    const f = (s - this.cum[lo]) / Math.max(1e-6, this.cum[hi] - this.cum[lo])
    outP.lerpVectors(this.samples[lo], this.samples[hi], f)
    outT.subVectors(this.samples[hi], this.samples[lo]).normalize()
  }
}

export const track = new Track()

// --------------------------------------------------------------------------- train state
export const train = {
  s: track.stationS[0],
  v: 0,
  state: 'dwell' as 'dwell' | 'run',
  dwell: 10,
  target: 0, // index into ordered (current / next station)
  doors: 0,
  update(dt: number) {
    const DWELL = 24
    if (this.state === 'dwell') {
      this.dwell -= dt
      const t = DWELL - this.dwell
      const open = t > 1.0 && this.dwell > 2.2
      this.doors += (open ? 1 : -1) * dt * 1.2
      this.doors = Math.max(0, Math.min(1, this.doors))
      if (this.dwell <= 0 && this.doors <= 0) {
        this.target = (this.target + 1) % ordered.length
        this.state = 'run'
      }
    } else {
      const ts = track.stationS[this.target]
      const dist = (ts - this.s + track.length) % track.length
      const a = 1.1
      const vmax = 15
      this.v = Math.min(vmax, this.v + a * dt, Math.sqrt(2 * a * dist) + 0.05)
      const step = this.v * dt
      if (step >= dist || dist < 0.02) {
        this.s = ts
        this.v = 0
        this.state = 'dwell'
        this.dwell = DWELL
        if (player.mode === 'riding') toast(`Station ${ordered[this.target].name}`)
      } else this.s = (this.s + step) % track.length
    }
  },
  /** seconds until the train arrives at station i (rough estimate) */
  eta(i: number) {
    if (this.state === 'dwell' && this.target === i) return 0
    let t = this.state === 'dwell' ? this.dwell : 0
    let s = this.s
    let idx = this.state === 'dwell' ? (this.target + 1) % ordered.length : this.target
    for (let k = 0; k < ordered.length + 1; k++) {
      const d = (track.stationS[idx] - s + track.length) % track.length
      t += d / 11 + 4
      if (idx === i) return t
      t += 24
      s = track.stationS[idx]
      idx = (idx + 1) % ordered.length
    }
    return t
  },
  dwellingAt(i: number) {
    return this.state === 'dwell' && this.target === i && this.doors > 0.7
  },
}

const _p = new THREE.Vector3()
const _t = new THREE.Vector3()
/** world transform of car i: position (floor centre at track height) and yaw */
export function carPose(i: number) {
  const offset = (1 - i) * (CAR_LEN + CAR_GAP) // car 0 leads
  track.at(train.s + offset, _p, _t)
  const yaw = Math.atan2(-_t.z, _t.x)
  return { x: _p.x, z: _p.z, yaw }
}

export function stationName(i: number) {
  return ordered[i].name
}
export const stationCount = ordered.length

// --------------------------------------------------------------------------- static build
export function buildMonorail(b: WorldBuilder) {
  b.inChunk('monorail-track', { maxDist: 5000 }, true, () => {
    // beam segments
    const seg = 3
    const n = Math.floor(track.length / seg)
    for (let i = 0; i < n; i++) {
      track.at(i * seg + seg / 2, _p, _t)
      const yaw = Math.atan2(-_t.z, _t.x)
      b.box(_p.x, BEAM_TOP - 1.3, _p.z, seg + 0.05, 1.3, 0.9, '#d9d8d3', 'satin', { rot: yaw })
      b.box(_p.x, BEAM_TOP - 0.7, _p.z, seg + 0.05, 0.08, 0.92, C.green, 'satin', { rot: yaw })
    }
    // pylons
    const pn = Math.floor(track.length / 24)
    for (let i = 0; i < pn; i++) {
      track.at(i * 24, _p, _t)
      const yaw = Math.atan2(-_t.z, _t.x)
      b.cyl(_p.x, -1, _p.z, 0.55, BEAM_TOP - 1.3 + 1, '#cfcdc7', 'satin', { segs: 14 })
      b.box(_p.x, BEAM_TOP - 1.8, _p.z, 1.4, 0.5, 2.4, '#cfcdc7', 'satin', { rot: yaw + Math.PI / 2 })
      b.colCyl(_p.x, -1, _p.z, 0.6, BEAM_TOP)
    }
  })

  ordered.forEach((st, i) => {
    const a = st.angle * DEG
    const [cx, cz] = polar(st.angle, LAYOUT.monorailRadius)
    // station frame: local x along travel (tangent), local -z outward → rot so that local +x = tangent
    const tx = Math.cos(a)
    const tz = Math.sin(a)
    const rot = Math.atan2(-tz, tx)
    b.inChunk(`station-${st.id}`, { maxDist: 900 }, true, () => {
      b.at(cx, 0, cz, rot, () => station(b, i, st.name))
    })
  })
}

function station(b: WorldBuilder, i: number, name: string) {
  const Y = PLATFORM_Y
  // platform on the outward side (local -z)
  const pz = -3.2
  b.box(0, Y - 0.45, pz, 44, 0.45, 3.2, '#d6d2c8', 'satin', { col: true })
  b.box(0, Y + 0.002, pz + 1.45, 44, 0.01, 0.25, '#f2d24b', 'matte') // tactile edge
  // columns under the platform
  for (let x = -18; x <= 18; x += 9) b.cyl(x, 0, pz, 0.3, Y - 0.45, '#cfcdc7', 'satin', { col: true, segs: 12 })
  // outer railing (glass) except at stair / lift openings
  for (const [x0, x1] of [[-22, -3.0], [2.2, 9.6], [14.4, 22]] as const) {
    b.box((x0 + x1) / 2, Y, pz - 1.6, x1 - x0, 1.1, 0.05, C.glassTint, 'glass', { col: true, noSupport: true })
    b.box((x0 + x1) / 2, Y + 1.1, pz - 1.6, x1 - x0, 0.05, 0.08, C.anthracite, 'metal')
  }
  for (const x of [-22, 22]) b.box(x, Y, pz, 0.05, 1.1, 3.2, C.glassTint, 'glass', { col: true, noSupport: true })
  // canopy
  b.box(0, Y + 3.6, pz + 0.3, 40, 0.25, 5.2, C.white, 'satin')
  b.box(0, Y + 3.55, pz + 2.85, 40, 0.06, 0.06, C.green, 'emissive')
  for (let x = -16; x <= 16; x += 8) b.box(x, Y, pz - 1.3, 0.16, 3.6, 0.16, C.anthracite, 'metal', { col: true })
  b.sign(0, Y + 3.95, pz - 2.25, 12, 0.7, textTexture([`Monorail · ${name}`], { w: 1024, h: 72, accent: C.green }), Math.PI, 0.5)
  b.sign(0, Y + 3.95, pz + 2.95, 12, 0.7, textTexture([`Monorail · ${name}`], { w: 1024, h: 72, accent: C.green }), 0, 0.5)
  b.sign(-8, Y + 2.4, pz - 1.4, 3.6, 0.9, logoTexture('Groups', { bg: '#ffffff', w: 512, h: 128 }), 0, 0.4)
  K.bench(b, -12, Y, pz - 1.0, 0, 2.4)
  K.bench(b, 6, Y, pz - 1.0, 0, 2.4)
  b.npc({ kind: 'stand', x: -4, y: Y, z: pz - 0.3, yaw: 0 })
  b.npc({ kind: 'stand', x: 1, y: Y, z: pz - 0.6, yaw: 0.3 })
  if (i % 2 === 0) b.npc({ kind: 'sit', x: -12, y: Y, z: pz - 0.9, yaw: 0 })
  // departure board (dynamic)
  b.screen({ id: `mono-board-${i}`, lx: 10, ly: Y + 2.2, lz: pz - 1.3, w: 2.4, h: 0.9, slides: [{ title: 'MONORAIL', lines: [], kind: 'info' }] })
  b.box(10, Y + 2.15, pz - 1.38, 2.5, 1.0, 0.08, C.black, 'gloss')
  // stair (outside, rising along +x) + landing
  b.box(-0.4, Y - 0.4, pz - 2.5, 5, 0.4, 1.8, '#d6d2c8', 'satin', { col: true })
  b.box(-0.4, Y, pz - 3.42, 5, 1.1, 0.05, C.glassTint, 'glass', { col: true, noSupport: true })
  b.box(2.1, Y, pz - 2.5, 0.05, 1.1, 1.8, C.glassTint, 'glass', { col: true, noSupport: true })
  buildStair(b, -14.6, 0, pz - 2.5, 1.7, Y, { rot: Math.PI / 2, color: '#d6d2c8' })
  // lift (door towards the platform / under the platform at ground)
  b.box(12, Y - 0.4, pz - 2.0, 2.8, 0.4, 0.9, '#d6d2c8', 'satin', { col: true })
  buildElevator(b, { x: 12, z: pz - 3.75, rot: 0, name: `Lift ${name}`, glass: true, stops: [{ label: 'Straße', y: 0 }, { label: 'Bahnsteig', y: Y }], start: 0 })
  b.sign(-10, 2.8, pz - 3.5, 4, 0.5, textTexture(['↑ Monorail ' + name], { w: 768, h: 80, accent: C.green }), Math.PI, 0.5, true)

  // boarding
  const [wx, wy, wz] = b.w(0, Y + 1.2, pz + 0.4)
  world.interactables.push({
    id: `board-${i}`,
    x: wx, y: wy, z: wz,
    radius: 22,
    priority: 0,
    enabled: () => player.mode === 'walk' && Math.abs(player.pos.y - Y) < 1.2,
    label: () => {
      if (train.dwellingAt(i)) return `Monorail einsteigen (nächster Halt: ${ordered[(i + 1) % ordered.length].name})`
      const eta = Math.max(1, Math.round(train.eta(i)))
      return eta <= 3 ? 'Monorail fährt ein …' : `Monorail: nächster Zug in ${eta} s – hier warten`
    },
    action: () => {
      if (!train.dwellingAt(i)) {
        toast(`Der Zug kommt in ca. ${Math.max(1, Math.round(train.eta(i)))} s. Bleib auf dem Bahnsteig und drücke dann E.`)
        return
      }
      player.mode = 'riding'
      player.ride = { car: 1, lx: 2.0, lz: 0.6 }
      ui().set({ ride: { next: ordered[(i + 1) % ordered.length].name, status: 'Türen schließen…' } })
      toast('Willkommen an Bord der Big Apple Monorail')
    },
  })
  b.zone(`Monorail-Station ${name}`, 0, Y - 0.5, pz, 44, 5, 4)
  b.zone(`Monorail-Station ${name}`, 0, 0, pz - 3, 30, 4, 8)
  stationExits[i] = { x: b.w(2, 0, pz)[0], z: b.w(2, 0, pz)[2] }
}

const stationExits: { x: number; z: number }[] = []

/** platform point (world) and station index for a station id – used by the campus map */
export function platformOf(id: string) {
  const i = ordered.findIndex((s) => s.id === id)
  return { i, x: stationExits[i]?.x ?? 0, z: stationExits[i]?.z ?? 0, y: PLATFORM_Y + 0.05 }
}

/** leave the train at the current station */
export function exitTrain() {
  if (train.state !== 'dwell' || train.doors < 0.6) return false
  const e = stationExits[train.target]
  player.mode = 'walk'
  player.ride = null
  player.pos.set(e.x, PLATFORM_Y + 0.05, e.z)
  player.vel.set(0, 0, 0)
  ui().set({ ride: null })
  toast(`Ausgestiegen: ${ordered[train.target].name}`)
  return true
}

// --------------------------------------------------------------------------- train rendering
const mat = {
  body: new THREE.MeshStandardMaterial({ color: C.white, roughness: 0.25, metalness: 0.2, side: THREE.DoubleSide }),
  dark: new THREE.MeshStandardMaterial({ color: C.black, roughness: 0.4, side: THREE.DoubleSide }),
  green: new THREE.MeshStandardMaterial({ color: C.green, roughness: 0.4, side: THREE.DoubleSide }),
  glass: new THREE.MeshStandardMaterial({ color: '#7a9aa6', roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.32, side: THREE.DoubleSide, depthWrite: false }),
  floor: new THREE.MeshStandardMaterial({ color: '#4a4f4c', roughness: 0.8 }),
  seat: new THREE.MeshStandardMaterial({ color: '#2f3a33', roughness: 0.7 }),
  light: new THREE.MeshBasicMaterial({ color: '#f4fff0', toneMapped: false }),
  pole: new THREE.MeshStandardMaterial({ color: '#cfd3d1', roughness: 0.3, metalness: 0.9 }),
}
const box = new THREE.BoxGeometry(1, 1, 1)

function CarMesh({ index, doorRefs }: { index: number; doorRefs: React.MutableRefObject<THREE.Object3D[]> }) {
  const lead = index === 0
  const tail = index === N_CARS - 1
  const L = CAR_LEN
  const Wd = 2.9
  const y0 = 0.25 // body bottom relative to beam top
  const floorY = PLATFORM_Y - BEAM_TOP
  const parts = useMemo(() => {
    const p: { pos: [number, number, number]; scale: [number, number, number]; m: THREE.Material; rot?: [number, number, number] }[] = []
    const add = (x: number, y: number, z: number, sx: number, sy: number, sz: number, m: THREE.Material) => p.push({ pos: [x, y + sy / 2, z], scale: [sx, sy, sz], m })
    // bogie skirt around the beam
    add(0, -0.9, 0, L - 1, 1.15, 1.3, mat.dark)
    // underframe + floor
    add(0, y0, 0, L, floorY - y0, Wd, mat.body)
    add(0, floorY - 0.02, 0, L - 0.2, 0.04, Wd - 0.2, mat.floor)
    // side walls: lower panel, window band (glass), upper panel; door openings on -z side
    for (const side of [1, -1]) {
      const z = (side * Wd) / 2
      add(0, floorY, z, L, 0.9, 0.08, mat.body)
      add(0, floorY + 0.9, z, L, 1.45, 0.06, mat.glass)
      add(0, floorY + 2.35, z, L, 0.55, 0.08, mat.body)
      add(0, floorY + 0.8, z * 1.005, L, 0.12, 0.09, mat.green)
    }
    // roof
    add(0, floorY + 2.9, 0, L, 0.2, Wd, mat.body)
    add(0, floorY + 3.1, 0, L - 2, 0.25, Wd - 0.8, mat.dark)
    // end walls (towards neighbour cars: gangway)
    for (const e of [1, -1]) {
      const x = (e * L) / 2
      const isNose = (e === 1 && lead) || (e === -1 && tail)
      if (isNose) {
        add(x + e * 0.6, y0, 0, 1.2, floorY + 2.9 - y0, Wd - 0.3, mat.body)
        add(x + e * 1.21, floorY + 0.9, 0, 0.04, 1.5, Wd - 0.6, mat.glass)
        add(x + e * 1.22, floorY + 0.3, 0, 0.05, 0.12, Wd - 0.8, mat.green)
      } else {
        add(x, floorY, Wd / 2 - 0.5, 0.08, 2.9, 0.9, mat.body)
        add(x, floorY, -Wd / 2 + 0.5, 0.08, 2.9, 0.9, mat.body)
      }
    }
    // seats along the inner (+z) side and poles
    for (let i = 0; i < 5; i++) {
      const x = -L / 2 + 1.4 + i * 2.2
      add(x, floorY, Wd / 2 - 0.45, 1.6, 0.45, 0.6, mat.seat)
      add(x, floorY + 0.45, Wd / 2 - 0.12, 1.6, 0.55, 0.12, mat.seat)
      add(x + 1.1, floorY, 0, 0.05, 2.9, 0.05, mat.pole)
    }
    add(0, floorY + 2.85, 0, L - 1, 0.03, 0.4, mat.light)
    return p
  }, [lead, tail, L, floorY])
  return (
    <group>
      {parts.map((q, k) => (
        <mesh key={k} geometry={box} material={q.m} position={q.pos} scale={q.scale} castShadow={q.m !== mat.glass && q.m !== mat.light} />
      ))}
      {/* doors on the outward (-z) side: two leaves per door, two doors per car */}
      {[-L / 4, L / 4].map((dx) =>
        [-1, 1].map((leaf) => (
          <mesh
            key={`${dx}${leaf}`}
            ref={(m) => {
              if (m) {
                m.userData.leaf = leaf
                m.userData.baseX = dx + leaf * 0.38
                doorRefs.current.push(m)
              }
            }}
            geometry={box}
            material={mat.glass}
            position={[dx + leaf * 0.38, floorY + 1.15, -Wd / 2 - 0.05]}
            scale={[0.76, 2.3, 0.05]}
          />
        )),
      )}
      {[-L / 4, L / 4].map((dx) => (
        <mesh key={'f' + dx} geometry={box} material={mat.green} position={[dx, floorY + 2.35, -Wd / 2 - 0.06]} scale={[1.6, 0.08, 0.04]} />
      ))}
    </group>
  )
}

export function MonorailTrain() {
  const groups = useRef<(THREE.Group | null)[]>([])
  const doors = useRef<THREE.Object3D[]>([])
  const lastYaw = useRef<number | null>(null)
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1)
    train.update(d)
    for (let i = 0; i < N_CARS; i++) {
      const g = groups.current[i]
      if (!g) continue
      const p = carPose(i)
      g.position.set(p.x, BEAM_TOP, p.z)
      g.rotation.y = p.yaw
    }
    for (const m of doors.current) m.position.x = m.userData.baseX + m.userData.leaf * train.doors * 0.74
    // carry a riding player
    if (player.mode === 'riding' && player.ride) {
      const p = carPose(player.ride.car)
      if (lastYaw.current !== null) {
        let dy = p.yaw - lastYaw.current
        if (dy > Math.PI) dy -= Math.PI * 2
        if (dy < -Math.PI) dy += Math.PI * 2
        player.yaw += dy
      }
      lastYaw.current = p.yaw
      const c = Math.cos(p.yaw)
      const s = Math.sin(p.yaw)
      const { lx, lz } = player.ride
      player.pos.set(p.x + lx * c + lz * s, PLATFORM_Y, p.z - lx * s + lz * c)
      player.vel.set(0, 0, 0)
      const u = ui()
      const next = stationName(train.target)
      const status = train.state === 'dwell' ? (train.doors > 0.6 ? `Halt: ${next} – [E] Aussteigen` : `Halt: ${next}`) : `${Math.round(train.v * 3.6)} km/h · Nächster Halt: ${next}`
      if (!u.ride || u.ride.status !== status) u.set({ ride: { next, status } })
    } else lastYaw.current = null
  })
  return (
    <group>
      {Array.from({ length: N_CARS }, (_, i) => (
        <group key={i} ref={(g) => { groups.current[i] = g }}>
          <CarMesh index={i} doorRefs={doors} />
        </group>
      ))}
    </group>
  )
}
