import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useUI, ui, input, isTouchDevice } from './state/store'
import { WorldRenderer } from './systems/WorldRenderer'
import { DynamicObjects } from './systems/DynamicObjects'
import { MonorailTrain } from './systems/MonorailSystem'
import { NPCSystem } from './systems/NPCSystem'
import { TrafficSystem } from './systems/TrafficSystem'
import { LightingSystem } from './systems/LightingSystem'
import { PlayerController } from './systems/PlayerController'
import { HUD, InfoPanel, ElevatorPanel } from './ui/UserInterface'
import { MainMenu, Settings, Help } from './ui/MainMenu'
import { CampusMap } from './ui/CampusMap'
import { TouchControls } from './ui/TouchControls'
import { C } from './engine/materials'

/** pulsing green beacon at the navigation target */
function NavBeacon() {
  const nav = useUI((s) => s.navTarget)
  const ref = useRef<THREE.Mesh>(null)
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0.35, depthWrite: false, toneMapped: false }), [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.x = ref.current.scale.z = 1 + Math.sin(clock.elapsedTime * 3) * 0.15
  })
  if (!nav) return null
  return (
    <mesh ref={ref} position={[nav.x, 30, nav.z]} material={mat}>
      <cylinderGeometry args={[1.2, 1.2, 60, 16, 1, true]} />
    </mesh>
  )
}

/** exposes renderer statistics for diagnostics (window.__campus.stats) */
function StatsProbe() {
  const gl = useThree((s) => s.gl)
  useFrame(() => {
    const c = (window as unknown as { __campus?: Record<string, unknown> }).__campus
    if (c) c.stats = { calls: gl.info.render.calls, triangles: gl.info.render.triangles, geometries: gl.info.memory.geometries }
  })
  return null
}

export default function App() {
  const quality = useUI((s) => s.quality)
  const screen = useUI((s) => s.screen)
  useEffect(() => {
    input.touch = isTouchDevice()
    if (input.touch) ui().set({ quality: 'low' })
    const esc = (e: KeyboardEvent) => {
      const u = ui()
      if (e.code !== 'Escape') return
      if (u.info) return u.set({ info: null })
      if (u.elevatorPanel) return u.set({ elevatorPanel: null })
      if (u.screen === 'map' || u.screen === 'settings' || u.screen === 'help') u.set({ screen: u.started ? 'playing' : 'menu' })
      else if (u.screen === 'playing' && (input.touch || u.cameraMode === 'bird' || !document.pointerLockElement)) u.set({ screen: 'menu' })
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])
  const dpr: [number, number] = quality === 'high' ? [1, 2] : quality === 'medium' ? [1, 1.5] : [0.75, 1]
  return (
    <>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={dpr}
        gl={{ antialias: quality !== 'low', powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ fov: 70, near: 0.15, far: 3200, position: [0, 2, 96] }}
        className={screen === 'playing' ? 'playing' : ''}
      >
        <LightingSystem />
        <WorldRenderer />
        <DynamicObjects />
        <MonorailTrain />
        <NPCSystem />
        <TrafficSystem />
        <PlayerController />
        <NavBeacon />
        <StatsProbe />
      </Canvas>
      <HUD />
      <TouchControls />
      <MainMenu />
      <Settings />
      <Help />
      {screen === 'map' && <CampusMap />}
      <InfoPanel />
      <ElevatorPanel />
    </>
  )
}
