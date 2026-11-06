import { create } from 'zustand'
import * as THREE from 'three'

export type Screen = 'menu' | 'playing' | 'map' | 'settings' | 'help'
export type CameraMode = 'first' | 'third' | 'bird' | 'architect'
export type TimePreset = 'morning' | 'noon' | 'evening' | 'night'
export type Weather = 'sun' | 'cloudy' | 'rain'
export type Quality = 'low' | 'medium' | 'high'

export const TIME_PRESETS: Record<TimePreset, { label: string; hour: number }> = {
  morning: { label: 'Morgen', hour: 8.0 },
  noon: { label: 'Mittag', hour: 12.75 },
  evening: { label: 'Abend', hour: 19.6 },
  night: { label: 'Nacht', hour: 22.75 },
}

export interface InfoPanel {
  title: string
  subtitle?: string
  body: string[]
  suffix?: string
}

interface UIState {
  screen: Screen
  started: boolean
  cameraMode: CameraMode
  hour: number
  timeFlow: boolean
  weather: Weather
  quality: Quality
  sensitivity: number
  invertY: boolean
  fov: number
  showHints: boolean
  // HUD
  prompt: string | null
  location: string
  buildingCard: { id: string; dist: number } | null
  info: InfoPanel | null
  elevatorPanel: string | null
  navTarget: { id: string; name: string; x: number; z: number } | null
  ride: { next: string; status: string } | null
  seated: boolean
  fade: number
  toast: string | null
  set: (p: Partial<UIState>) => void
}

export const useUI = create<UIState>((set) => ({
  screen: 'menu',
  started: false,
  cameraMode: 'first',
  hour: TIME_PRESETS.noon.hour,
  timeFlow: true,
  weather: 'sun',
  quality: 'medium',
  sensitivity: 1,
  invertY: false,
  fov: 70,
  showHints: true,
  prompt: null,
  location: '',
  buildingCard: null,
  info: null,
  elevatorPanel: null,
  navTarget: null,
  ride: null,
  seated: false,
  fade: 0,
  toast: null,
  set: (p) => set(p),
}))

export const ui = () => useUI.getState()

let toastTimer: number | undefined
export function toast(msg: string, ms = 2600) {
  ui().set({ toast: msg })
  window.clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => ui().set({ toast: null }), ms)
}

// ---------------------------------------------------------------------------
// Mutable runtime state (changed every frame → kept outside React)

export type PlayerMode = 'walk' | 'seated' | 'riding'

export const player = {
  pos: new THREE.Vector3(0, 0, 96), // feet
  vel: new THREE.Vector3(),
  yaw: 0, // 0 = looking north (-z)
  pitch: 0,
  grounded: true,
  eyeY: 1.65,
  height: 1.78,
  radius: 0.32,
  mode: 'walk' as PlayerMode,
  locked: false, // movement locked (elevator travel, seated)
  autoWalk: null as null | { x: number; z: number; t: number },
  seat: null as null | { x: number; y: number; z: number; yaw: number },
  ride: null as null | { car: number; lx: number; lz: number },
  /** world camera position (updated by camera rig, used by LOD etc.) */
  cam: new THREE.Vector3(0, 2, 96),
  camDir: new THREE.Vector3(0, 0, -1),
  speed: 0,
}

export const input = {
  keys: new Set<string>(),
  lookDX: 0,
  lookDY: 0,
  joyX: 0,
  joyY: 0,
  jump: false,
  interact: false,
  run: false,
  touch: false,
}

export function isTouchDevice() {
  return typeof window !== 'undefined' && (window.matchMedia?.('(pointer: coarse)').matches || 'ontouchstart' in window)
}
