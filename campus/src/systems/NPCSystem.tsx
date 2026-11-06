/**
 * NPCs: simple stylised people (instanced body parts) that walk along paths,
 * sit in meeting rooms / canteens / auditoriums, stand at receptions and ride
 * bicycles on the bike ring. Very cheap: ~10 instanced meshes in total.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { world, type NpcSpawn } from '../engine/registry'
import { chunkVisible } from './WorldRenderer'
import { player, useUI } from '../state/store'
import { C } from '../engine/materials'

const SHIRTS = [C.white, C.black, '#2f4a6b', C.green, '#8a8d8b', '#d9d4c8', '#5a6e7a', '#7a2b2b', '#e8e2d4']
const PANTS = ['#1d1f1e', '#2c3440', '#4a4d49', '#6b5a48', '#22303f']
const SKIN = ['#f1c9a5', '#d7a57c', '#a8764f', '#7a5236', '#f5d6bd', '#c58c5f']
const HAIR = ['#1b1714', '#3b2a1d', '#6b4a2a', '#b08a52', '#2a2a2a', '#8c8c8c']

// unit geometries; limbs pivot at their top
const limb = new THREE.BoxGeometry(1, 1, 1).translate(0, -0.5, 0)
const torsoG = new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0)
const headG = new THREE.SphereGeometry(1, 10, 8)
const wheelG = new THREE.TorusGeometry(0.33, 0.035, 5, 16)
const mat = new THREE.MeshStandardMaterial({ roughness: 0.8 })

type Part = 'torso' | 'head' | 'hair' | 'armL' | 'armR' | 'thighL' | 'thighR' | 'shinL' | 'shinR' | 'bikeFrame' | 'wheelF' | 'wheelB'
const PARTS: Part[] = ['torso', 'head', 'hair', 'armL', 'armR', 'thighL', 'thighR', 'shinL', 'shinR', 'bikeFrame', 'wheelF', 'wheelB']

interface Npc {
  s: NpcSpawn
  x: number
  y: number
  z: number
  yaw: number
  seg: number
  dir: number
  phase: number
  speed: number
  colors: THREE.Color[]
  wait: number
}

const m4 = new THREE.Matrix4()
const base = new THREE.Matrix4()
const tmp = new THREE.Matrix4()
const q = new THREE.Quaternion()
const e = new THREE.Euler()
const v = new THREE.Vector3()
const sc = new THREE.Vector3()
const ZERO = new THREE.Matrix4().makeScale(0, 0, 0)

function local(x: number, y: number, z: number, rx: number, sx: number, sy: number, sz: number, rz = 0) {
  e.set(rx, 0, rz)
  q.setFromEuler(e)
  return tmp.compose(v.set(x, y, z), q, sc.set(sx, sy, sz))
}

/** writes the matrices for one person (+ bike) into the instanced meshes */
function pose(meshes: Record<Part, THREE.InstancedMesh>, i: number, x: number, y: number, z: number, yaw: number, kind: string, phase: number, moving: number) {
  base.makeRotationY(yaw).setPosition(x, y, z)
  const sit = kind === 'sit'
  const bike = kind === 'bike'
  const hip = sit ? 0.47 : bike ? 0.95 : 0.92
  const swing = bike ? 0 : Math.sin(phase) * 0.55 * moving
  const set = (p: Part, l: THREE.Matrix4) => meshes[p].setMatrixAt(i, m4.multiplyMatrices(base, l))
  set('torso', local(0, hip, 0, bike ? 0.35 : 0, 0.42, 0.6, 0.24))
  const headY = hip + 0.6 + 0.16
  const lean = bike ? 0.22 : 0
  set('head', local(0, headY - lean * 0.2, lean, 0, 0.12, 0.14, 0.13))
  set('hair', local(0, headY + 0.04 - lean * 0.2, lean - 0.02, 0, 0.125, 0.1, 0.13))
  const armRx = bike ? -1.0 : sit ? -0.5 : -swing * 0.8
  set('armL', local(-0.27, hip + 0.56, bike ? 0.12 : 0, armRx, 0.1, 0.6, 0.1))
  set('armR', local(0.27, hip + 0.56, bike ? 0.12 : 0, bike ? -1.0 : sit ? -0.5 : swing * 0.8, 0.1, 0.6, 0.1))
  if (sit) {
    set('thighL', local(-0.11, hip, 0, -Math.PI / 2, 0.15, 0.45, 0.16))
    set('thighR', local(0.11, hip, 0, -Math.PI / 2, 0.15, 0.45, 0.16))
    set('shinL', local(-0.11, hip, 0.45, 0, 0.14, 0.45, 0.15))
    set('shinR', local(0.11, hip, 0.45, 0, 0.14, 0.45, 0.15))
  } else if (bike) {
    const pa = Math.sin(phase) * 0.6
    set('thighL', local(-0.11, hip, 0, -1.0 + pa, 0.15, 0.45, 0.16))
    set('thighR', local(0.11, hip, 0, -1.0 - pa, 0.15, 0.45, 0.16))
    set('shinL', local(-0.11, hip - 0.2, 0.35, 0.3 - pa, 0.14, 0.45, 0.15))
    set('shinR', local(0.11, hip - 0.2, 0.35, 0.3 + pa, 0.14, 0.45, 0.15))
  } else {
    set('thighL', local(-0.11, hip, 0, swing, 0.15, 0.46, 0.16))
    set('thighR', local(0.11, hip, 0, -swing, 0.15, 0.46, 0.16))
    const kneeL = Math.max(0, -swing) * 0.6
    const kneeR = Math.max(0, swing) * 0.6
    set('shinL', local(-0.11, hip - Math.cos(swing) * 0.46, -Math.sin(swing) * 0.46, swing - kneeL, 0.14, 0.46, 0.15))
    set('shinR', local(0.11, hip - Math.cos(swing) * 0.46, Math.sin(swing) * 0.46, -swing - kneeR, 0.14, 0.46, 0.15))
  }
  if (bike) {
    set('bikeFrame', local(0, 0.55, 0.1, 0, 0.06, 0.06, 1.05))
    set('wheelF', local(0, 0.34, 0.6, 0, 1, 1, 1, 0).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2)))
    set('wheelB', local(0, 0.34, -0.45, 0, 1, 1, 1, 0).multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2)))
  } else {
    meshes.bikeFrame.setMatrixAt(i, ZERO)
    meshes.wheelF.setMatrixAt(i, ZERO)
    meshes.wheelB.setMatrixAt(i, ZERO)
  }
}

function hide(meshes: Record<Part, THREE.InstancedMesh>, i: number) {
  for (const p of PARTS) meshes[p].setMatrixAt(i, ZERO)
}

export function NPCSystem() {
  const quality = useUI((s) => s.quality)
  const npcs = useMemo<Npc[]>(() => {
    const max = quality === 'low' ? 140 : quality === 'medium' ? 380 : 900
    const all = world.npcs
    // keep every walker / cyclist, thin out seated & standing people if needed
    const movers = all.filter((s) => s.kind === 'walk' || s.kind === 'bike')
    const statics = all.filter((s) => s.kind === 'sit' || s.kind === 'stand')
    const keep = Math.max(0, max - movers.length)
    const step = statics.length > keep ? statics.length / keep : 1
    const chosen = [...movers]
    for (let i = 0; i < statics.length && chosen.length < max; i += step) chosen.push(statics[Math.floor(i)])
    let seed = 7
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    return chosen.map((s) => {
      const p0 = s.path?.[0]
      const shirt = new THREE.Color(SHIRTS[Math.floor(r() * SHIRTS.length)])
      return {
        s,
        x: p0 ? p0[0] : s.x ?? 0,
        y: p0 ? p0[1] : s.y ?? 0,
        z: p0 ? p0[2] : s.z ?? 0,
        yaw: s.yaw ?? 0,
        seg: 0,
        dir: 1,
        phase: r() * 6,
        speed: s.speed ?? 1.2 + r() * 0.4,
        wait: 0,
        colors: [
          shirt,
          new THREE.Color(SKIN[Math.floor(r() * SKIN.length)]),
          new THREE.Color(HAIR[Math.floor(r() * HAIR.length)]),
          shirt,
          new THREE.Color(PANTS[Math.floor(r() * PANTS.length)]),
          new THREE.Color(s.kind === 'bike' ? (r() < 0.5 ? C.green : C.black) : '#000'),
          new THREE.Color('#151515'),
        ],
      }
    })
  }, [quality])

  const meshes = useMemo(() => {
    const n = Math.max(1, npcs.length)
    const mk = (g: THREE.BufferGeometry) => {
      const im = new THREE.InstancedMesh(g, mat, n)
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      im.castShadow = true
      im.frustumCulled = false
      return im
    }
    const o = {
      torso: mk(torsoG), head: mk(headG), hair: mk(headG), armL: mk(limb), armR: mk(limb),
      thighL: mk(limb), thighR: mk(limb), shinL: mk(limb), shinR: mk(limb),
      bikeFrame: mk(limb), wheelF: mk(wheelG), wheelB: mk(wheelG),
    } as Record<Part, THREE.InstancedMesh>
    const ci: Record<Part, number> = { torso: 0, head: 1, hair: 2, armL: 3, armR: 3, thighL: 4, thighR: 4, shinL: 4, shinR: 4, bikeFrame: 5, wheelF: 6, wheelB: 6 }
    npcs.forEach((p, i) => {
      for (const part of PARTS) o[part].setColorAt(i, p.colors[ci[part]])
    })
    for (const part of PARTS) if (o[part].instanceColor) o[part].instanceColor!.needsUpdate = true
    return o
  }, [npcs])

  const staticTimer = useRef(0)
  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1)
    staticTimer.current -= dt
    const doStatics = staticTimer.current <= 0
    if (doStatics) staticTimer.current = 0.5
    const cam = player.cam
    npcs.forEach((n, i) => {
      const moving = n.s.kind === 'walk' || n.s.kind === 'bike'
      if (!moving && !doStatics) return
      const visible = (!n.s.chunk || chunkVisible.get(n.s.chunk) !== false) && Math.abs(n.x - cam.x) < 220 && Math.abs(n.z - cam.z) < 220
      if (moving && n.s.path && n.s.path.length > 1) {
        const path = n.s.path
        if (n.wait > 0) n.wait -= dt
        else {
          const nextIdx = n.seg + n.dir
          const t = path[nextIdx]
          const dx = t[0] - n.x
          const dz = t[2] - n.z
          const d = Math.hypot(dx, dz)
          // politely stop for the player
          const pd = Math.hypot(player.pos.x - n.x, player.pos.z - n.z)
          const blocked = pd < 1.1 && Math.abs(player.pos.y - n.y) < 1.5
          if (!blocked) {
            const step = n.speed * dt
            if (d <= step) {
              n.x = t[0]
              n.y = t[1]
              n.z = t[2]
              n.seg = nextIdx
              if (n.seg === path.length - 1 || n.seg === 0) {
                if (n.s.loop && n.seg === path.length - 1) {
                  n.seg = 0
                  const p0 = path[0]
                  n.x = p0[0]
                  n.y = p0[1]
                  n.z = p0[2]
                } else if (!n.s.loop) {
                  n.dir = n.seg === 0 ? 1 : -1
                  n.wait = 2 + Math.random() * 4
                }
              }
            } else {
              n.x += (dx / d) * step
              n.z += (dz / d) * step
              n.y += (t[1] - n.y) * Math.min(1, step / Math.max(d, 0.01))
              const ty = Math.atan2(dx, dz)
              let dy = ty - n.yaw
              while (dy > Math.PI) dy -= Math.PI * 2
              while (dy < -Math.PI) dy += Math.PI * 2
              n.yaw += dy * Math.min(1, dt * 6)
              n.phase += step * (n.s.kind === 'bike' ? 1.6 : 4.2)
            }
          }
        }
      }
      if (!visible) hide(meshes, i)
      else pose(meshes, i, n.x, n.y, n.z, n.yaw, n.s.kind, n.phase, moving && n.wait <= 0 ? 1 : 0)
    })
    for (const p of PARTS) meshes[p].instanceMatrix.needsUpdate = true
  })

  return (
    <>
      {PARTS.map((p) => (
        <primitive key={p + npcs.length} object={meshes[p]} />
      ))}
    </>
  )
}

/** The player's own figure for the third-person camera */
export function Avatar() {
  const g = useRef<THREE.Group>(null)
  const phase = useRef(0)
  const legs = useRef<THREE.Mesh[]>([])
  const arms = useRef<THREE.Mesh[]>([])
  useFrame((_, dt) => {
    const sp = (g.current?.parent?.userData.speed as number) ?? 0
    const seated = g.current?.parent?.userData.seated
    phase.current += sp * dt * 2.2
    const sw = Math.sin(phase.current) * Math.min(1, sp / 4) * 0.6
    legs.current.forEach((m, k) => {
      if (!m) return
      m.rotation.x = seated ? -Math.PI / 2 : k ? sw : -sw
      m.position.y = seated ? 0.47 : 0.92
    })
    arms.current.forEach((m, k) => m && (m.rotation.x = k ? -sw * 0.8 : sw * 0.8))
    if (g.current) g.current.position.y = 0
  })
  const shirt = useMemo(() => new THREE.MeshStandardMaterial({ color: C.green, roughness: 0.7 }), [])
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1d1f1e', roughness: 0.8 }), [])
  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d7a57c', roughness: 0.8 }), [])
  return (
    <group ref={g}>
      <mesh geometry={torsoG} material={shirt} position={[0, 0.92, 0]} scale={[0.42, 0.6, 0.24]} castShadow />
      <mesh geometry={headG} material={skin} position={[0, 1.68, 0]} scale={[0.12, 0.14, 0.13]} castShadow />
      <mesh geometry={headG} material={dark} position={[0, 1.72, -0.02]} scale={[0.125, 0.1, 0.13]} />
      {[-0.11, 0.11].map((x, k) => (
        <mesh key={x} ref={(m) => { if (m) legs.current[k] = m }} geometry={limb} material={dark} position={[x, 0.92, 0]} scale={[0.15, 0.9, 0.16]} castShadow />
      ))}
      {[-0.27, 0.27].map((x, k) => (
        <mesh key={x} ref={(m) => { if (m) arms.current[k] = m }} geometry={limb} material={shirt} position={[x, 1.48, 0]} scale={[0.1, 0.6, 0.1]} castShadow />
      ))}
    </group>
  )
}
