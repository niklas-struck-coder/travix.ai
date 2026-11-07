import { CollisionWorld } from './colliders'

/** Something the player can use with E / the action button. */
export interface Interactable {
  id: string
  x: number
  y: number
  z: number
  radius: number
  label: () => string
  action: () => void
  enabled?: () => boolean
  /** smaller numbers win when several are in range */
  priority?: number
  /** for moving interactables (elevator cab, monorail) */
  getPos?: () => [number, number, number]
}

/** Named area used for "current location" in the HUD */
export interface Zone {
  name: string
  building?: string
  floor?: string
  test: (x: number, y: number, z: number) => boolean
  area: number
}

export type NpcKind = 'walk' | 'sit' | 'stand' | 'bike'
export interface NpcSpawn {
  kind: NpcKind
  path?: [number, number, number][] // world points (x,y,z) for walkers/bikes
  loop?: boolean
  x?: number
  y?: number
  z?: number
  yaw?: number
  chunk?: string // visibility follows this chunk
  speed?: number
}

/** Dynamic display screen: rendered with a cycling canvas texture */
export interface ScreenDef {
  id: string
  x: number
  y: number
  z: number
  w: number
  h: number
  yaw: number
  slides: { title: string; lines: string[]; kind?: 'market' | 'logistics' | 'trains' | 'travel' | 'info' | 'event' }[]
  chunk?: string
  suffix?: string
}

/** moving walkway: carries the player along (dx, dz) while standing on it */
export interface Conveyor {
  test: (x: number, z: number) => boolean
  y: number
  dx: number
  dz: number
  speed: number
}

export const world = {
  collision: new CollisionWorld(),
  interactables: [] as Interactable[],
  zones: [] as Zone[],
  npcs: [] as NpcSpawn[],
  screens: [] as ScreenDef[],
  conveyors: [] as Conveyor[],
  /** openings in the ground slab (elevator shafts, ramps) */
  groundHoles: [] as ((x: number, z: number) => boolean)[],
}

let idc = 0
export const uid = (p = 'id') => `${p}-${++idc}`
