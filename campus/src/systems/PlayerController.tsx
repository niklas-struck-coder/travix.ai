/**
 * First/third person player controller, bird's-eye and architecture camera,
 * keyboard / mouse / touch input and the interaction system.
 */
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { world } from '../engine/registry'
import { input, player, ui, useUI, toast, type CameraMode } from '../state/store'
import { BUILDINGS } from '../config/campus'
import { exitTrain } from './MonorailSystem'
import { Avatar } from './NPCSystem'

const WALK = 4.3
const RUN = 9.0
const GRAVITY = 22
const JUMP_V = 7.0
const STEP = 0.45

// ---------------------------------------------------------------------------- input
export function setupInput(canvas: HTMLCanvasElement) {
  const down = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.tagName === 'INPUT') return
    const u = ui()
    input.keys.add(e.code)
    if (u.screen !== 'playing') return
    if (e.code === 'KeyE' && !e.repeat) input.interact = true
    if (e.code === 'Space') {
      input.jump = true
      e.preventDefault()
    }
    if (e.code === 'KeyM') {
      document.exitPointerLock?.()
      u.set({ screen: 'map' })
    }
    if (e.code === 'KeyH') u.set({ showHints: !u.showHints })
    const modes: Record<string, CameraMode> = { Digit1: 'first', Digit2: 'third', Digit3: 'bird', Digit4: 'architect' }
    if (modes[e.code]) setCameraMode(modes[e.code])
    if (e.code === 'KeyT') {
      const order = [8, 12.75, 19.6, 22.75]
      const i = order.findIndex((h) => h > u.hour + 0.01)
      u.set({ hour: order[i === -1 ? 0 : i] })
    }
  }
  const up = (e: KeyboardEvent) => input.keys.delete(e.code)
  let skip = 0
  const move = (e: MouseEvent) => {
    if (document.pointerLockElement !== canvas) {
      // fallback when pointer lock is unavailable (e.g. embedded pages): drag to look
      const u = ui()
      if ((e.buttons & 1) && u.screen === 'playing' && u.cameraMode !== 'bird' && !u.elevatorPanel && !u.info && e.target === canvas) {
        input.lookDX += e.movementX * 1.6
        input.lookDY += e.movementY * 1.6
      }
      return
    }
    // browsers sometimes report a large jump right after the pointer gets locked
    if (skip > 0) {
      skip--
      return
    }
    if (Math.abs(e.movementX) > 250 || Math.abs(e.movementY) > 250) return
    input.lookDX += e.movementX
    input.lookDY += e.movementY
  }
  const click = () => {
    const u = ui()
    if (u.screen === 'playing' && !input.touch && u.cameraMode !== 'bird' && !u.elevatorPanel && !u.info) canvas.requestPointerLock?.()
  }
  const lockChange = () => {
    skip = 2
    const u = ui()
    if (document.pointerLockElement !== canvas && u.screen === 'playing' && !u.elevatorPanel && !u.info && u.cameraMode !== 'bird' && !input.touch) {
      // ESC releases pointer lock → open the menu
      u.set({ screen: 'menu' })
    }
  }
  const blur = () => input.keys.clear()
  window.addEventListener('keydown', down)
  window.addEventListener('keyup', up)
  window.addEventListener('mousemove', move)
  window.addEventListener('blur', blur)
  canvas.addEventListener('click', click)
  document.addEventListener('pointerlockchange', lockChange)
  return () => {
    window.removeEventListener('keydown', down)
    window.removeEventListener('keyup', up)
    window.removeEventListener('mousemove', move)
    window.removeEventListener('blur', blur)
    canvas.removeEventListener('click', click)
    document.removeEventListener('pointerlockchange', lockChange)
  }
}

export function setCameraMode(m: CameraMode) {
  const u = ui()
  if (m === 'bird') document.exitPointerLock?.()
  if (m === 'architect' || m === 'bird') {
    archCam.pos.copy(player.cam)
    if (m === 'architect' && u.cameraMode !== 'bird') archCam.pos.y += 2
    archCam.yaw = player.yaw
    archCam.pitch = -0.25
  }
  u.set({ cameraMode: m })
  toast({ first: 'Kamera: First Person', third: 'Kamera: Third Person', bird: 'Kamera: Vogelperspektive (Maus ziehen/scrollen)', architect: 'Kamera: Architekturmodus (WASD, Q/E hoch/runter)' }[m])
}

export const archCam = { pos: new THREE.Vector3(0, 60, 220), yaw: 0, pitch: -0.25 }

/** teleport the player (fast travel / navigation) */
export function teleport(x: number, z: number, yaw?: number) {
  const col = world.collision
  const y = Math.max(0, col.support(x, z, 3))
  player.pos.set(x, y === -Infinity ? 0 : y, z)
  player.vel.set(0, 0, 0)
  if (yaw !== undefined) player.yaw = yaw
  player.mode = 'walk'
  player.seat = null
  player.ride = null
  ui().set({ seated: false, ride: null })
}

// ---------------------------------------------------------------------------- interaction
let currentIt: (typeof world.interactables)[number] | null = null
let itTimer = 0
let zoneTimer = 0

function updateInteraction(dt: number) {
  const u = ui()
  itTimer -= dt
  if (itTimer <= 0) {
    itTimer = 0.1
    let best: typeof currentIt = null
    let bestScore = Infinity
    if (player.mode === 'walk' && (u.cameraMode === 'first' || u.cameraMode === 'third')) {
      const px = player.pos.x
      const py = player.pos.y + 1.2
      const pz = player.pos.z
      const fx = -Math.sin(player.yaw)
      const fz = -Math.cos(player.yaw)
      for (const it of world.interactables) {
        let x = it.x
        let y = it.y
        let z = it.z
        if (it.getPos) [x, y, z] = it.getPos()
        const dx = x - px
        const dz = z - pz
        if (Math.abs(dx) > it.radius + 1 || Math.abs(dz) > it.radius + 1) continue
        const dy = y - py
        if (Math.abs(dy) > 2.2) continue
        const d = Math.hypot(dx, dz)
        if (d > it.radius) continue
        if (it.enabled && !it.enabled()) continue
        const facing = d < 0.8 ? 1 : (dx * fx + dz * fz) / d
        if (facing < 0.1 && it.radius < 10) continue
        const score = d / it.radius + (it.priority ?? 3) * 0.15 - facing * 0.3
        if (score < bestScore) {
          bestScore = score
          best = it
        }
      }
    }
    currentIt = best
    let prompt: string | null = best ? best.label() : null
    if (player.mode === 'seated') prompt = 'Aufstehen'
    if (player.mode === 'riding') prompt = null
    if (prompt !== u.prompt) u.set({ prompt })
  }
  if (input.interact) {
    input.interact = false
    if (player.mode === 'seated') {
      player.mode = 'walk'
      if (player.seat) {
        player.pos.set(player.seat.x + Math.sin(player.seat.yaw) * 0.8, player.seat.y, player.seat.z + Math.cos(player.seat.yaw) * 0.8)
      }
      player.seat = null
      u.set({ seated: false })
    } else if (player.mode === 'riding') {
      if (!exitTrain()) toast('Aussteigen ist nur an einer Station möglich.')
    } else if (currentIt) {
      currentIt.action()
      if (u.elevatorPanel || ui().elevatorPanel || ui().info) document.exitPointerLock?.()
    }
  }
  // location + building card
  zoneTimer -= dt
  if (zoneTimer <= 0) {
    zoneTimer = 0.35
    const p = player.pos
    let room: (typeof world.zones)[number] | null = null
    let bld: (typeof world.zones)[number] | null = null
    for (const z of world.zones) {
      if (!z.test(p.x, p.y + 0.3, p.z)) continue
      if (!room || z.area < room.area) room = z
      if (z.building && (!bld || z.area > bld.area)) bld = z
    }
    const bInfo = room?.building ? BUILDINGS.find((b) => b.id === room!.building) : null
    let loc = room ? room.name : 'Campusgelände'
    if (bInfo && room && room.name !== bInfo.name && !room.name.includes(bInfo.suffix)) loc = `${bInfo.suffix === 'Groups' ? bInfo.kind === 'hq' ? 'HQ' : 'Besucherzentrum' : 'Big Apple ' + bInfo.suffix} · ${room.name}`
    if (player.mode === 'riding') loc = 'Monorail'
    if (loc !== u.location) u.set({ location: loc })
    // building card when approaching a building from outside
    let card: { id: string; dist: number } | null = null
    if (!bld && player.mode === 'walk' && p.y > -1 && p.y < 3) {
      let best = 48
      for (const b of BUILDINGS) {
        const d = b.kind === 'hq' ? Math.hypot(p.x, p.z) - b.w / 2 : Math.hypot(p.x - b.x, p.z - b.z) - Math.max(b.w, b.d) / 2
        if (d < best) {
          best = d
          card = { id: b.id, dist: Math.max(0, Math.round(d)) }
        }
      }
    }
    if (card?.id !== u.buildingCard?.id || (card && u.buildingCard && Math.abs(card.dist - u.buildingCard.dist) > 2)) u.set({ buildingCard: card })
  }
}

// ---------------------------------------------------------------------------- physics
function stepPlayer(dt: number) {
  const col = world.collision
  const u = ui()
  // look
  const sens = 0.0022 * u.sensitivity
  if (player.mode !== 'seated' || true) {
    player.yaw -= input.lookDX * sens
    player.pitch -= input.lookDY * sens * (u.invertY ? -1 : 1)
    player.pitch = Math.max(-1.45, Math.min(1.45, player.pitch))
  }
  input.lookDX = input.lookDY = 0

  if (player.mode === 'seated' && player.seat) {
    player.pos.set(player.seat.x, player.seat.y, player.seat.z)
    player.eyeY += (1.15 - player.eyeY) * Math.min(1, dt * 8)
    input.jump = false
    return
  }
  if (player.mode === 'riding') {
    player.eyeY = 1.6
    input.jump = false
    return
  }
  player.eyeY += (1.65 - player.eyeY) * Math.min(1, dt * 8)

  // desired horizontal velocity
  let fx = 0
  let fz = 0
  const k = input.keys
  if (u.screen === 'playing' && !u.elevatorPanel) {
    if (k.has('KeyW') || k.has('ArrowUp')) fz -= 1
    if (k.has('KeyS') || k.has('ArrowDown')) fz += 1
    if (k.has('KeyA') || k.has('ArrowLeft')) fx -= 1
    if (k.has('KeyD') || k.has('ArrowRight')) fx += 1
    fx += input.joyX
    fz += input.joyY
  }
  const len = Math.hypot(fx, fz)
  if (len > 1) {
    fx /= len
    fz /= len
  }
  const running = k.has('ShiftLeft') || k.has('ShiftRight') || input.run || (input.touch && len > 0.92)
  const speed = running ? RUN : WALK
  const sin = Math.sin(player.yaw)
  const cos = Math.cos(player.yaw)
  let vx = (fx * cos + fz * sin) * speed
  let vz = (-fx * sin + fz * cos) * speed
  if (player.autoWalk) {
    const a = player.autoWalk
    const dx = a.x - player.pos.x
    const dz = a.z - player.pos.z
    const d = Math.hypot(dx, dz)
    a.t -= dt
    if (d < 0.3 || a.t <= 0 || len > 0.1) player.autoWalk = null
    else {
      vx = (dx / d) * WALK
      vz = (dz / d) * WALK
    }
  }
  if (player.locked) {
    vx = vz = 0
  }
  const accel = player.grounded ? 14 : 3
  player.vel.x += (vx - player.vel.x) * Math.min(1, dt * accel)
  player.vel.z += (vz - player.vel.z) * Math.min(1, dt * accel)

  if (input.jump && player.grounded && !player.locked) {
    player.vel.y = JUMP_V
    player.grounded = false
  }
  input.jump = false

  // integrate horizontal movement in sub-steps
  const stepUp = player.grounded ? STEP : 0.12
  const total = Math.hypot(player.vel.x, player.vel.z) * dt
  const n = Math.max(1, Math.ceil(total / 0.2))
  for (let i = 0; i < n; i++) {
    let x = player.pos.x + (player.vel.x * dt) / n
    let z = player.pos.z + (player.vel.z * dt) / n
    ;[x, z] = col.resolve(x, z, player.radius, player.pos.y + stepUp, player.pos.y + player.height)
    player.pos.x = x
    player.pos.z = z
  }

  // vertical
  const wasGrounded = player.grounded
  player.vel.y -= GRAVITY * dt
  if (player.locked) player.vel.y = 0
  let y = player.pos.y + player.vel.y * dt
  const support = col.support(player.pos.x, player.pos.z, player.pos.y + stepUp)
  if (y <= support) {
    y = support
    player.vel.y = 0
    player.grounded = true
  } else if (wasGrounded && player.vel.y <= 0 && player.pos.y - support < 0.5) {
    // stick to stairs / ramps when walking down
    y = support
    player.vel.y = 0
    player.grounded = true
  } else player.grounded = false
  const ceil = col.ceiling(player.pos.x, player.pos.z, player.pos.y + player.height * 0.5)
  if (y + player.height > ceil) {
    y = Math.min(y, ceil - player.height)
    if (player.vel.y > 0) player.vel.y = 0
  }
  if (support === -Infinity && y < -30) {
    // safety net
    teleport(0, 96, 0)
    return
  }
  player.pos.y = y
  player.speed = Math.hypot(player.vel.x, player.vel.z)
}

// ---------------------------------------------------------------------------- camera rig component
const tmpV = new THREE.Vector3()
const eye = new THREE.Vector3()
let smoothEyeY = 1.65

export function PlayerController() {
  const { camera, gl } = useThree()
  const mode = useUI((s) => s.cameraMode)
  const fov = useUI((s) => s.fov)
  const screen = useUI((s) => s.screen)
  const orbit = useRef<React.ComponentRef<typeof OrbitControls>>(null)
  const avatar = useRef<THREE.Group>(null)

  useEffect(() => setupInput(gl.domElement), [gl])
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    cam.fov = fov
    cam.updateProjectionMatrix()
  }, [fov, camera])
  useEffect(() => {
    if (mode === 'bird' && orbit.current) {
      const t = orbit.current.target
      t.set(player.pos.x * 0.5, 0, player.pos.z * 0.5)
      camera.position.set(t.x + 160, 260, t.z + 260)
      orbit.current.update()
    }
  }, [mode, camera])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const u = ui()
    const active = u.screen === 'playing'
    if (mode === 'architect') {
      // free fly, no collisions
      const sens = 0.0022 * u.sensitivity
      archCam.yaw -= input.lookDX * sens
      archCam.pitch = Math.max(-1.5, Math.min(1.5, archCam.pitch - input.lookDY * sens * (u.invertY ? -1 : 1)))
      input.lookDX = input.lookDY = 0
      const k = input.keys
      let fx = input.joyX
      let fz = input.joyY
      let fy = 0
      if (active) {
        if (k.has('KeyW')) fz -= 1
        if (k.has('KeyS')) fz += 1
        if (k.has('KeyA')) fx -= 1
        if (k.has('KeyD')) fx += 1
        if (k.has('KeyE') || k.has('Space')) fy += 1
        if (k.has('KeyQ') || k.has('KeyC')) fy -= 1
      }
      input.interact = false
      input.jump = false
      const sp = (k.has('ShiftLeft') ? 90 : 26) * dt
      const cy = Math.cos(archCam.yaw)
      const sy = Math.sin(archCam.yaw)
      const cp = Math.cos(archCam.pitch)
      archCam.pos.x += (fx * cy + fz * sy * cp) * sp
      archCam.pos.z += (-fx * sy + fz * cy * cp) * sp
      archCam.pos.y += (fy - fz * Math.sin(archCam.pitch)) * sp
      archCam.pos.y = Math.max(0.5, Math.min(600, archCam.pos.y))
      camera.position.copy(archCam.pos)
      camera.rotation.set(archCam.pitch, archCam.yaw, 0, 'YXZ')
    } else if (mode === 'bird') {
      input.lookDX = input.lookDY = 0
      input.interact = false
      orbit.current?.update()
    } else {
      if (active) stepPlayer(dt)
      else input.lookDX = input.lookDY = 0
      updateInteraction(dt)
      // smooth stair steps for the eye height
      const target = player.pos.y + player.eyeY
      smoothEyeY += (target - smoothEyeY) * Math.min(1, dt * (player.mode === 'riding' ? 60 : 18))
      if (Math.abs(target - smoothEyeY) > 3) smoothEyeY = target
      eye.set(player.pos.x, smoothEyeY, player.pos.z)
      if (mode === 'first' || player.mode === 'riding') {
        camera.position.copy(eye)
        camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ')
      } else {
        // third person: behind and above, pulled in by obstacles
        const dist = 4.2
        const back = tmpV.set(Math.sin(player.yaw) * Math.cos(player.pitch), -Math.sin(player.pitch), Math.cos(player.yaw) * Math.cos(player.pitch))
        const origin = eye.clone().add(new THREE.Vector3(0, 0.2, 0))
        let d = 0.3
        while (d < dist) {
          const px = origin.x + back.x * d
          const py = origin.y + back.y * d + 0.3
          const pz = origin.z + back.z * d
          if (world.collision.solidAt(px, py, pz, 0.2)) break
          d += 0.2
        }
        camera.position.set(origin.x + back.x * (d - 0.2), origin.y + back.y * (d - 0.2) + 0.3, origin.z + back.z * (d - 0.2))
        camera.lookAt(origin.x, origin.y, origin.z)
      }
    }
    if (avatar.current) {
      avatar.current.visible = mode !== 'first' && player.mode !== 'riding'
      avatar.current.position.copy(player.pos)
      avatar.current.rotation.y = player.yaw + Math.PI
      avatar.current.userData.speed = player.speed
      avatar.current.userData.seated = player.mode === 'seated'
    }
    player.cam.copy(camera.position)
    camera.getWorldDirection(player.camDir)
  })

  return (
    <>
      {mode === 'bird' && screen === 'playing' && (
        <OrbitControls ref={orbit} makeDefault enableDamping maxPolarAngle={1.35} minDistance={25} maxDistance={900} />
      )}
      <group ref={avatar}>
        <Avatar />
      </group>
    </>
  )
}
