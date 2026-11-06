/**
 * Elevators (cabs + landing doors), automatic sliding doors and dynamic
 * display screens with cycling canvas content.
 */
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { elevators, doors, type Elevator } from '../world/dynamic'
import { world, type ScreenDef } from '../engine/registry'
import { C, drawLogo, FONT } from '../engine/materials'
import { chunkVisible } from './WorldRenderer'
import { train, stationName, stationCount } from './MonorailSystem'
import { player } from '../state/store'

const box = new THREE.BoxGeometry(1, 1, 1)
const M = {
  cab: new THREE.MeshStandardMaterial({ color: '#d9dcd9', roughness: 0.3, metalness: 0.7, side: THREE.DoubleSide }),
  cabFloor: new THREE.MeshStandardMaterial({ color: '#3a3d3b', roughness: 0.6 }),
  door: new THREE.MeshStandardMaterial({ color: '#b9bfbd', roughness: 0.25, metalness: 0.85 }),
  glassDoor: new THREE.MeshStandardMaterial({ color: '#cfe4ea', roughness: 0.05, metalness: 0.5, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide }),
  light: new THREE.MeshBasicMaterial({ color: '#fffaf0', toneMapped: false }),
  green: new THREE.MeshBasicMaterial({ color: C.green, toneMapped: false }),
  panel: new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.2 }),
}

function ElevatorMesh({ el }: { el: Elevator }) {
  const cab = useRef<THREE.Group>(null)
  const cabDoors = useRef<THREE.Mesh[]>([])
  const landing = useRef<THREE.Mesh[][]>([])
  const D = el.d + 0.3
  useFrame(() => {
    if (cab.current) cab.current.position.y = el.y
    const open = el.state === 'moving' ? 0 : el.door
    cabDoors.current.forEach((m, k) => (m.position.x = (k ? 1 : -1) * (0.33 + open * 0.62)))
    landing.current.forEach((pair, i) => {
      const o = el.index === i && el.state !== 'moving' ? el.door : 0
      pair.forEach((m, k) => m && (m.position.x = (k ? 1 : -1) * (0.33 + o * 0.62)))
    })
  })
  const wallMat = el.glass ? M.glassDoor : M.cab
  return (
    <group position={[el.cx, 0, el.cz]} rotation={[0, el.yaw, 0]}>
      <group ref={cab}>
        <mesh geometry={box} material={M.cabFloor} position={[0, -0.05, 0]} scale={[el.w, 0.1, el.d]} />
        <mesh geometry={box} material={wallMat} position={[0, 1.25, -el.d / 2]} scale={[el.w, 2.5, 0.05]} />
        <mesh geometry={box} material={wallMat} position={[-el.w / 2, 1.25, 0]} scale={[0.05, 2.5, el.d]} />
        <mesh geometry={box} material={wallMat} position={[el.w / 2, 1.25, 0]} scale={[0.05, 2.5, el.d]} />
        <mesh geometry={box} material={M.cab} position={[0, 2.5, 0]} scale={[el.w, 0.06, el.d]} />
        <mesh geometry={box} material={M.light} position={[0, 2.46, 0]} scale={[el.w * 0.6, 0.02, el.d * 0.6]} />
        <mesh geometry={box} material={M.panel} position={[el.w / 2 - 0.05, 1.2, el.d / 2 - 0.4]} scale={[0.03, 0.5, 0.25]} />
        <mesh geometry={box} material={M.green} position={[el.w / 2 - 0.07, 1.35, el.d / 2 - 0.4]} scale={[0.01, 0.06, 0.15]} />
        <mesh geometry={box} material={M.cab} position={[0, 0.05, -el.d / 2 + 0.15]} scale={[el.w - 0.2, 0.04, 0.04]} />
        {[0, 1].map((k) => (
          <mesh key={k} ref={(m) => { if (m) cabDoors.current[k] = m }} geometry={box} material={M.door} position={[0, 1.15, el.d / 2]} scale={[0.66, 2.3, 0.04]} />
        ))}
      </group>
      {el.stops.map((s, i) => (
        <group key={i} position={[0, s.y, D / 2 + 0.12]}>
          {[0, 1].map((k) => (
            <mesh key={k} ref={(m) => { if (!landing.current[i]) landing.current[i] = []; if (m) landing.current[i][k] = m }} geometry={box} material={M.door} position={[0, 1.15, 0]} scale={[0.66, 2.3, 0.04]} />
          ))}
        </group>
      ))}
    </group>
  )
}

function SlidingDoors() {
  const refs = useRef<THREE.Mesh[]>([])
  useFrame(() => {
    doors.forEach((d, i) => {
      const a = refs.current[i * 2]
      const b = refs.current[i * 2 + 1]
      const off = d.width / 4 + d.open * (d.width / 2 - 0.05)
      if (a) a.position.x = -off
      if (b) b.position.x = off
    })
  })
  return (
    <>
      {doors.map((d, i) => (
        <group key={i} position={[d.x, d.y, d.z]} rotation={[0, d.yaw, 0]}>
          {[0, 1].map((k) => (
            <mesh key={k} ref={(m) => { if (m) refs.current[i * 2 + k] = m }} geometry={box} material={M.glassDoor} position={[0, d.height / 2, 0]} scale={[d.width / 2, d.height, 0.04]} />
          ))}
        </group>
      ))}
    </>
  )
}

// --------------------------------------------------------------------------- screens
const KIND_BG: Record<string, [string, string]> = {
  market: ['#07120d', '#0f2a1d'],
  logistics: ['#081014', '#0f2330'],
  trains: ['#0c0f14', '#1a2433'],
  travel: ['#0b1a22', '#13394a'],
  event: ['#0a0a0a', '#1c2a14'],
  info: ['#0d100f', '#1f2623'],
}

function drawSlide(g: CanvasRenderingContext2D, W: number, H: number, s: ScreenDef, slideIdx: number, t: number) {
  const sl = s.slides[slideIdx % s.slides.length]
  const [c0, c1] = KIND_BG[sl.kind ?? 'info'] ?? KIND_BG.info
  const gr = g.createLinearGradient(0, 0, W, H)
  gr.addColorStop(0, c0)
  gr.addColorStop(1, c1)
  g.fillStyle = gr
  g.fillRect(0, 0, W, H)
  const thin = H / W < 0.12
  if (s.id.startsWith('mono-board')) {
    const i = Number(s.id.split('-').pop())
    g.fillStyle = C.green
    g.font = `700 ${H * 0.16}px ${FONT}`
    g.fillText('MONORAIL · Abfahrten', W * 0.05, H * 0.2)
    g.fillStyle = '#fff'
    g.font = `400 ${H * 0.14}px ${FONT}`
    const eta = train.eta(i)
    const next = stationName((i + 1) % stationCount)
    g.fillText(`Richtung ${next}`, W * 0.05, H * 0.48)
    g.fillStyle = eta < 1 ? C.green : '#ffd36b'
    g.font = `700 ${H * 0.2}px ${FONT}`
    g.fillText(eta < 1 ? 'Zug am Bahnsteig' : `in ${Math.max(1, Math.round(eta / 60))} min (${Math.round(eta)} s)`, W * 0.05, H * 0.8)
    return
  }
  if (thin) {
    // ticker band
    g.fillStyle = '#fff'
    g.font = `600 ${H * 0.6}px ${FONT}`
    const txt = `${sl.title}   ·   ${sl.lines.join('   ·   ')}   ·   `
    const tw = g.measureText(txt).width
    const off = -((t * 120) % tw)
    g.fillText(txt + txt + txt, off, H * 0.72)
    return
  }
  if (sl.kind === 'market') {
    // ticker + chart
    g.strokeStyle = C.green
    g.lineWidth = Math.max(2, H / 120)
    g.beginPath()
    let v = 0.5
    for (let x = 0; x <= 60; x++) {
      v += Math.sin(x * 0.7 + t * 0.3 + slideIdx) * 0.03 + Math.sin(x * 0.13 + t * 0.05) * 0.02
      const px = W * 0.05 + (x / 60) * W * 0.9
      const py = H * (0.9 - v * 0.6)
      if (x === 0) g.moveTo(px, py)
      else g.lineTo(px, py)
    }
    g.stroke()
    const rows = [['AEX', 912.4, 0.8], ['DAX', 19284, 0.4], ['S&P 500', 5871, -0.2], ['EUR/USD', 1.0874, 0.1], ['BA-Group', 148.2, 1.6]]
    g.font = `600 ${H * 0.07}px ${FONT}`
    rows.forEach((r, k) => {
      const ch = (r[2] as number) + Math.sin(t * 0.2 + k) * 0.3
      g.fillStyle = '#fff'
      g.fillText(String(r[0]), W * 0.05, H * (0.12 + k * 0.08))
      g.fillStyle = ch >= 0 ? C.green : '#e05d4b'
      g.fillText(`${(r[1] as number).toLocaleString('de-DE')}  ${ch >= 0 ? '▲' : '▼'} ${Math.abs(ch).toFixed(2)} %`, W * 0.3, H * (0.12 + k * 0.08))
    })
    return
  }
  if (sl.kind === 'logistics' || sl.kind === 'trains') {
    // stylised network map with moving dots
    g.strokeStyle = 'rgba(124,194,66,0.5)'
    g.lineWidth = 2
    const nodes = Array.from({ length: 9 }, (_, k) => [W * (0.1 + ((k * 37) % 80) / 100), H * (0.35 + ((k * 53) % 55) / 100)])
    for (let k = 0; k < nodes.length - 1; k++) {
      g.beginPath()
      g.moveTo(nodes[k][0], nodes[k][1])
      g.lineTo(nodes[k + 1][0], nodes[k + 1][1])
      g.stroke()
      const f = (t * 0.15 + k * 0.3) % 1
      g.fillStyle = sl.kind === 'trains' ? '#fff' : C.green
      g.beginPath()
      g.arc(nodes[k][0] + (nodes[k + 1][0] - nodes[k][0]) * f, nodes[k][1] + (nodes[k + 1][1] - nodes[k][1]) * f, H * 0.015, 0, Math.PI * 2)
      g.fill()
    }
    for (const n of nodes) {
      g.fillStyle = '#fff'
      g.fillRect(n[0] - 3, n[1] - 3, 6, 6)
    }
  }
  if (sl.kind === 'travel') {
    const hue = (slideIdx * 70 + t * 4) % 360
    const gr2 = g.createLinearGradient(0, H * 0.4, 0, H)
    gr2.addColorStop(0, `hsla(${hue},60%,55%,0.0)`)
    gr2.addColorStop(1, `hsla(${hue},60%,45%,0.6)`)
    g.fillStyle = gr2
    g.fillRect(0, H * 0.4, W, H * 0.6)
    g.fillStyle = 'rgba(255,255,255,0.8)'
    g.beginPath()
    g.arc(W * 0.8, H * 0.35, H * 0.12, 0, Math.PI * 2)
    g.fill()
  }
  // header logo line
  if (s.suffix !== undefined || sl.kind === 'event' || sl.kind === 'info') {
    g.fillStyle = 'rgba(255,255,255,0.92)'
    g.fillRect(W * 0.04, H * 0.06, W * 0.42, H * 0.13)
    drawLogo(g, W * 0.25, H * 0.125, H * 0.07, s.suffix ?? 'Groups')
  }
  g.fillStyle = '#fff'
  g.font = `700 ${H * 0.12}px ${FONT}`
  g.fillText(sl.title, W * 0.05, H * 0.42, W * 0.9)
  g.font = `400 ${H * 0.075}px ${FONT}`
  g.fillStyle = 'rgba(255,255,255,0.85)'
  sl.lines.forEach((ln, k) => g.fillText(ln, W * 0.05, H * (0.58 + k * 0.11), W * 0.9))
  g.fillStyle = C.green
  g.fillRect(0, H - H * 0.03, W * (((t / 6) % 1) * 1), H * 0.03)
}

function Screens() {
  const items = useMemo(
    () =>
      world.screens.map((s) => {
        const aspect = s.w / s.h
        const W = aspect > 1 ? 512 : Math.round(512 * aspect)
        const H = aspect > 1 ? Math.max(32, Math.round(512 / aspect)) : 512
        const cv = document.createElement('canvas')
        cv.width = W
        cv.height = H
        const tex = new THREE.CanvasTexture(cv)
        tex.colorSpace = THREE.SRGBColorSpace
        const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
        return { s, cv, tex, mat, W, H, slide: 0, next: 0 }
      }),
    [],
  )
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const acc = useRef(0)
  const time = useRef(0)
  useFrame((_, dt) => {
    time.current += dt
    acc.current -= dt
    if (acc.current > 0) return
    acc.current = 0.2
    const t = time.current
    items.forEach((it, i) => {
      const m = meshes.current[i]
      const vis = it.s.chunk ? chunkVisible.get(it.s.chunk) !== false : true
      if (m) m.visible = vis
      if (!vis) return
      const d = Math.hypot(player.cam.x - it.s.x, player.cam.z - it.s.z)
      const animated = it.H / it.W < 0.12 || it.s.slides.some((x) => x.kind === 'market' || x.kind === 'logistics' || x.kind === 'trains')
      if (t < it.next && !(animated && d < 40)) return
      if (t >= it.next) {
        it.slide++
        it.next = t + (it.s.id.startsWith('mono-board') ? 1 : 6)
      }
      if (d > 220 && it.next > t + 0.5) return
      const g = it.cv.getContext('2d')!
      drawSlide(g, it.W, it.H, it.s, it.slide, t)
      it.tex.needsUpdate = true
    })
  })
  return (
    <>
      {items.map((it, i) => (
        <mesh
          key={it.s.id + i}
          ref={(m) => { meshes.current[i] = m }}
          material={it.mat}
          position={[it.s.x + Math.sin(it.s.yaw) * 0.02, it.s.y + it.s.h / 2, it.s.z + Math.cos(it.s.yaw) * 0.02]}
          rotation={[0, it.s.yaw, 0]}
          scale={[it.s.w, it.s.h, 1]}
        >
          <planeGeometry />
        </mesh>
      ))}
    </>
  )
}

export function DynamicObjects() {
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1)
    for (const e of elevators) e.update(d)
    for (const dr of doors) dr.update(d)
  })
  return (
    <>
      {elevators.map((e) => (
        <ElevatorMesh key={e.id} el={e} />
      ))}
      <SlidingDoors />
      <Screens />
    </>
  )
}
