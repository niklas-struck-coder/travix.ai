/**
 * Vehicles on the ring road (two lanes, opposite directions) and two campus
 * shuttle buses that stop at the bus stops. Cars brake for the player and keep
 * distance to the vehicle ahead.
 */
import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { LAYOUT, DEG, INNER_ROAD } from '../config/campus'
import { C } from '../engine/materials'
import { player } from '../state/store'

interface Veh {
  lane: number // 0 inner (ccw), 1 outer (cw)
  a: number // angle (atan2 convention)
  v: number
  vmax: number
  bus: boolean
  wait: number
  color: THREE.Color
  stopped: boolean
}

const box = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
const wheel = new THREE.CylinderGeometry(0.34, 0.34, 0.24, 12).rotateZ(Math.PI / 2)
const mats = {
  body: new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.4 }),
  glass: new THREE.MeshStandardMaterial({ color: '#1e2a33', roughness: 0.1, metalness: 0.6 }),
  wheel: new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.9 }),
  head: new THREE.MeshBasicMaterial({ color: '#f4f8ff', toneMapped: false }),
  tail: new THREE.MeshBasicMaterial({ color: '#d0201c', toneMapped: false }),
  stripe: new THREE.MeshStandardMaterial({ color: C.green, roughness: 0.4 }),
}
const COLORS = ['#f4f5f2', '#1d1f1e', '#7c8a92', '#3b5f8a', '#9a2a2a', '#c9c3b5', C.green]
const BUS_STOPS = [171, 189].map((d) => Math.atan2(-Math.cos(d * DEG), Math.sin(d * DEG)))

export function TrafficSystem() {
  const vehs = useMemo<Veh[]>(() => {
    const out: Veh[] = []
    for (let i = 0; i < 18; i++) {
      out.push({ lane: i % 2, a: (i / 18) * Math.PI * 2 + (i % 2) * 0.1, v: 10, vmax: 11 + (i % 4), bus: false, wait: 0, color: new THREE.Color(COLORS[i % COLORS.length]), stopped: false })
    }
    // slow service vehicles on the campus ring road (lanes 2 and 3)
    for (let i = 0; i < 6; i++) out.push({ lane: 2 + (i % 2), a: (i / 6) * Math.PI * 2 + 0.4, v: 5, vmax: 5.5 + (i % 3) * 0.5, bus: false, wait: 0, color: new THREE.Color([C.white, C.green, '#d9d4c8'][i % 3]), stopped: false })
    out.push({ lane: 0, a: 1.0, v: 8, vmax: 10, bus: true, wait: 0, color: new THREE.Color(C.white), stopped: false })
    out.push({ lane: 1, a: 4.0, v: 8, vmax: 10, bus: true, wait: 0, color: new THREE.Color(C.white), stopped: false })
    return out
  }, [])

  const meshes = useMemo(() => {
    const n = vehs.length
    const mk = (g: THREE.BufferGeometry, m: THREE.Material, count = n) => {
      const im = new THREE.InstancedMesh(g, m, count)
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      im.castShadow = true
      im.frustumCulled = false
      return im
    }
    const o = { body: mk(box, mats.body), cabin: mk(box, mats.glass), wheels: mk(wheel, mats.wheel, n * 4), head: mk(box, mats.head), tail: mk(box, mats.tail), stripe: mk(box, mats.stripe) }
    vehs.forEach((v, i) => o.body.setColorAt(i, v.color))
    o.body.instanceColor!.needsUpdate = true
    return o
  }, [vehs])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    const R = LAYOUT.ringRoadRadius
    const m = new THREE.Matrix4()
    const l = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const p = new THREE.Vector3()
    const s = new THREE.Vector3()
    vehs.forEach((v, i) => {
      const r = [R - 3.2, R + 3.2, INNER_ROAD.radius - 1.75, INNER_ROAD.radius + 1.75][v.lane]
      const dir = v.lane % 2 === 0 ? 1 : -1
      // distance to vehicle ahead in the same lane
      let gap = Infinity
      for (const o of vehs) {
        if (o === v || o.lane !== v.lane) continue
        let d = (o.a - v.a) * dir
        d = ((d % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        gap = Math.min(gap, d * r)
      }
      // the player on the road ahead?
      const x = Math.cos(v.a) * r
      const z = Math.sin(v.a) * r
      const fx = -Math.sin(v.a) * dir
      const fz = Math.cos(v.a) * dir
      const px = player.pos.x - x
      const pz = player.pos.z - z
      const ahead = px * fx + pz * fz
      const lateral = Math.abs(px * fz - pz * fx)
      const playerBlock = ahead > 0 && ahead < 14 && lateral < 2.2 && player.pos.y < 2
      let target = v.vmax
      if (gap < (v.bus ? 22 : 14)) target = 0
      else if (gap < 30) target = Math.min(target, (gap - 12) * 0.6)
      if (playerBlock) target = 0
      if (v.bus) {
        if (v.wait > 0) {
          v.wait -= dt
          target = 0
        } else {
          for (const sa of BUS_STOPS) {
            let d = (sa - v.a) * dir
            d = ((d % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
            const dm = d * r
            if (dm < 25) target = Math.min(target, Math.max(0.6, dm * 0.4))
            if (dm < 0.6 && !v.stopped) {
              v.wait = 9
              v.stopped = true
            }
            if (dm > 30 && dm < 40) v.stopped = false
          }
        }
      }
      v.v += Math.sign(target - v.v) * Math.min(Math.abs(target - v.v), dt * (target < v.v ? 7 : 2.5))
      v.a += ((v.v * dt) / r) * dir
      // render
      const yaw = Math.atan2(fx, fz)
      const L = v.bus ? 12 : 4.4
      const W = v.bus ? 2.55 : 1.8
      m.makeRotationY(yaw).setPosition(x, 0, z)
      const set = (im: THREE.InstancedMesh, idx: number, lx: number, ly: number, lz: number, sx: number, sy: number, sz: number) => {
        l.compose(p.set(lx, ly, lz), q.identity(), s.set(sx, sy, sz))
        im.setMatrixAt(idx, l.premultiply(m))
      }
      if (v.bus) {
        set(meshes.body, i, 0, 0.35, 0, W, 2.9, L)
        set(meshes.cabin, i, 0, 1.35, 0.1, W + 0.02, 1.25, L - 0.6)
        set(meshes.stripe, i, 0, 0.75, 0, W + 0.04, 0.22, L + 0.02)
      } else {
        set(meshes.body, i, 0, 0.32, 0, W, 0.62, L)
        set(meshes.cabin, i, 0, 0.94, -0.2, W - 0.2, 0.5, 2.3)
        set(meshes.stripe, i, 0, 0, 0, 0, 0, 0)
      }
      set(meshes.head, i, 0, 0.6, L / 2 + 0.01, W - 0.4, 0.1, 0.02)
      set(meshes.tail, i, 0, 0.62, -L / 2 - 0.01, W - 0.3, 0.1, 0.02)
      const wz = v.bus ? [L / 2 - 1.6, -L / 2 + 2] : [1.35, -1.4]
      let k = 0
      for (const sx of [-W / 2 + 0.1, W / 2 - 0.1])
        for (const zz of wz) {
          l.compose(p.set(sx, 0.34, zz), q.identity(), s.set(1, 1, 1))
          meshes.wheels.setMatrixAt(i * 4 + k++, l.premultiply(m))
        }
    })
    for (const im of Object.values(meshes)) im.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      {Object.entries(meshes).map(([k, im]) => (
        <primitive key={k} object={im} />
      ))}
    </>
  )
}
