/**
 * Builds the procedural world once and renders its chunks as InstancedMeshes
 * with distance / height based level of detail.
 */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { WorldBuilder, getGeometry, type Chunk, type SignDef } from '../engine/builder'
import { families } from '../engine/materials'
import { world } from '../engine/registry'
import { buildSite, buildGroundMeshes } from '../world/CampusGround'
import { buildHQ } from '../world/HoldingHeadquarters'
import { buildSubsidiaries } from '../world/SubsidiaryBuildings'
import { buildUnderground } from '../world/Underground'
import { buildBusinessCenters } from '../world/BusinessCenters'
import { buildMonorail } from './MonorailSystem'
import { player, ui } from '../state/store'

let built: { chunks: Chunk[]; ground: THREE.Object3D[]; stats: { parts: number; colliders: number } } | null = null

export function getWorld() {
  if (built) return built
  const b = new WorldBuilder()
  buildSite(b)
  buildHQ(b)
  buildSubsidiaries(b)
  buildBusinessCenters(b)
  buildUnderground(b)
  buildMonorail(b)
  const chunks = [...b.chunks.values()].filter((c) => !c.key.startsWith('__'))
  let parts = 0
  for (const c of chunks) for (const bk of c.buckets.values()) parts += bk.colors.length / 3
  built = { chunks, ground: buildGroundMeshes(), stats: { parts, colliders: world.collision.count } }
  return built
}

/** visibility of chunks (read by NPCs and screens) */
export const chunkVisible = new Map<string, boolean>()

const planeGeo = new THREE.PlaneGeometry(1, 1)

function signMesh(s: SignDef) {
  const mat = new THREE.MeshStandardMaterial({
    map: s.tex,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: s.tex,
    emissiveIntensity: s.glow ?? 0.35,
    roughness: 0.5,
    side: s.doubleSided || s.curved ? THREE.DoubleSide : THREE.FrontSide,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  })
  let m: THREE.Mesh
  if (s.curved) {
    const g = new THREE.CylinderGeometry(s.curved.r, s.curved.r, s.h, 48, 1, true, s.curved.thetaStart, s.curved.thetaLength)
    m = new THREE.Mesh(g, mat)
    m.position.set(s.x, s.y + s.h / 2, s.z)
    // CylinderGeometry renders the texture mirrored on the inside; we want the outside → front side only
    mat.side = THREE.FrontSide
  } else {
    m = new THREE.Mesh(planeGeo, mat)
    m.position.set(s.x, s.y, s.z)
    m.scale.set(s.w, s.h, 1)
    m.rotation.set(s.pitch ?? 0, s.yaw, 0, 'YXZ')
  }
  m.matrixAutoUpdate = false
  m.updateMatrix()
  return m
}

function chunkGroup(c: Chunk) {
  const g = new THREE.Group()
  g.name = c.key
  for (const bk of c.buckets.values()) {
    const count = bk.colors.length / 3
    const im = new THREE.InstancedMesh(getGeometry(bk.geo), families[bk.fam], count)
    im.instanceMatrix.array.set(bk.matrices)
    im.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(bk.colors), 3)
    im.instanceMatrix.needsUpdate = true
    const transparent = bk.fam === 'glass' || bk.fam === 'facade' || bk.fam === 'nightglow' || bk.fam === 'lightpool'
    im.castShadow = c.castShadow && !transparent && bk.fam !== 'emissive'
    im.receiveShadow = !transparent
    im.computeBoundingSphere()
    im.computeBoundingBox()
    im.matrixAutoUpdate = false
    g.add(im)
  }
  for (const s of c.signs) g.add(signMesh(s))
  g.matrixAutoUpdate = false
  return g
}

const tmpBox = new THREE.Box3()

export function WorldRenderer() {
  const w = getWorld()
  const groups = useMemo(() => w.chunks.map((c) => ({ c, g: chunkGroup(c) })), [w])
  const root = useRef<THREE.Group>(null)
  const timer = useRef(0)
  useEffect(() => {
    const r = root.current!
    for (const { g } of groups) r.add(g)
    for (const m of w.ground) r.add(m)
    return () => {
      for (const { g } of groups) r.remove(g)
    }
  }, [groups, w])
  useFrame((_, dt) => {
    // moving walkway stripes (2.2 m/s, one stripe tile per metre)
    const belt = (families.belt as THREE.MeshStandardMaterial).map
    if (belt) belt.offset.y += dt * 2.2
    // animate water textures
    for (const m of w.ground) {
      const mat = (m as THREE.Mesh).material as THREE.MeshStandardMaterial
      if (mat.userData?.animated && mat.map) {
        mat.map.offset.x += dt * 0.004
        mat.map.offset.y += dt * 0.002
      }
    }
    timer.current -= dt
    if (timer.current > 0) return
    timer.current = 0.25
    const cam = player.cam
    const mode = ui().cameraMode
    for (const { c, g } of groups) {
      tmpBox.copy(c.bounds)
      const d = tmpBox.distanceToPoint(cam)
      let vis = d < c.lod.maxDist * (mode === 'bird' ? 0.6 : 1)
      if (vis && c.lod.yMin !== undefined) vis = cam.y >= c.lod.yMin && cam.y <= (c.lod.yMax ?? 1e9)
      g.visible = vis
      chunkVisible.set(c.key, vis)
    }
  })
  return <group ref={root} />
}
