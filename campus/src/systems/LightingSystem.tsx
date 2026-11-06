/**
 * Sun / moon, sky, fog, reflections (generated environment map), time of day,
 * weather (sun, clouds, light rain) and the night look of the campus.
 */
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { applyNightFactor } from '../engine/materials'
import { player, ui, useUI } from '../state/store'

export function sunState(hour: number) {
  // simple model for Amsterdam (≈ 52° N): sunrise ~6:30, sunset ~20:30
  const dayFrac = (hour - 6.5) / 14
  const elev = Math.sin(Math.PI * dayFrac) * 52 // degrees, negative at night
  const az = (dayFrac * 180 + 90) * (Math.PI / 180) // east → south → west
  const el = (Math.max(-20, elev) * Math.PI) / 180
  const dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el))
  const night = THREE.MathUtils.clamp((4 - elev) / 10, 0, 1)
  return { elev, dir, night }
}

export function LightingSystem() {
  const hour = useUI((s) => s.hour)
  const weather = useUI((s) => s.weather)
  const quality = useUI((s) => s.quality)
  const sun = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const { scene, gl } = useThree()
  const st = useMemo(() => sunState(hour), [hour])
  const clock = useRef(0)

  const look = useMemo(() => {
    const cloudy = weather !== 'sun'
    const rain = weather === 'rain'
    const n = st.night
    const low = THREE.MathUtils.clamp(1 - st.elev / 25, 0, 1) * (1 - n)
    const sunColor = new THREE.Color('#fff4e2').lerp(new THREE.Color('#ffb070'), low)
    const fogDay = new THREE.Color(cloudy ? '#b9c0c4' : '#cfdbe4').lerp(new THREE.Color('#e9c3a0'), low * 0.6)
    const fog = fogDay.lerp(new THREE.Color('#0b1220'), n)
    return {
      sunColor,
      sunI: (rain ? 0.45 : cloudy ? 0.9 : 3.0) * (1 - n) + n * 0.25,
      hemiI: (cloudy ? 1.2 : 0.85) * (1 - n) + n * 0.32,
      fog,
      fogFar: rain ? 520 : cloudy ? 900 : 1500,
      exposure: n > 0.5 ? 1.05 : rain ? 0.85 : 1.0,
      turbidity: cloudy ? 14 : 6,
      rayleigh: cloudy ? 0.6 : low > 0.3 ? 3 : 1.2,
      envKey: `${Math.round(n * 4)}-${weather}-${Math.round(low * 3)}`,
      night: n,
      low,
    }
  }, [st, weather])

  useEffect(() => {
    applyNightFactor(look.night)
    scene.fog = new THREE.Fog(look.fog, 60, look.fogFar)
    gl.toneMappingExposure = look.exposure
  }, [look, scene, gl])

  useEffect(() => {
    if (!sun.current) return
    const size = quality === 'high' ? 4096 : quality === 'medium' ? 2048 : 1024
    sun.current.shadow.mapSize.set(size, size)
    sun.current.shadow.map?.dispose()
    sun.current.shadow.map = null as unknown as THREE.WebGLRenderTarget
  }, [quality])

  useFrame((_, dt) => {
    // time flow: 1 real second = 1 game minute
    const u = ui()
    if (u.timeFlow && u.screen === 'playing') {
      clock.current += dt
      if (clock.current > 2) {
        u.set({ hour: (u.hour + clock.current / 60) % 24 })
        clock.current = 0
      }
    }
    // shadow camera follows the viewer
    const s = sun.current
    if (s) {
      const c = player.cam
      const d = st.night > 0.5 ? new THREE.Vector3(0.3, 1, 0.4).normalize() : st.dir
      const range = c.y > 60 ? 260 : 110
      s.position.set(c.x + d.x * 300, c.y + d.y * 300, c.z + d.z * 300)
      s.target.position.set(c.x, c.y > 60 ? 0 : c.y, c.z)
      s.target.updateMatrixWorld()
      const cam = s.shadow.camera
      if (cam.right !== range) {
        cam.left = -range
        cam.right = range
        cam.top = range
        cam.bottom = -range
        cam.updateProjectionMatrix()
      }
    }
  })

  return (
    <>
      <Sky distance={4000} sunPosition={st.night > 0.9 ? [0, -1, 0] : st.dir.clone().multiplyScalar(100).toArray()} turbidity={look.turbidity} rayleigh={look.rayleigh} mieCoefficient={0.005} mieDirectionalG={0.8} />
      {look.night > 0.3 && <Stars radius={1500} depth={60} count={2500} factor={6} fade speed={0.3} />}
      <directionalLight
        ref={sun}
        castShadow={quality !== 'low'}
        intensity={look.sunI}
        color={st.night > 0.5 ? '#9fb4ff' : look.sunColor}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-near={10}
        shadow-camera-far={700}
      />
      <hemisphereLight ref={hemi} args={[look.night > 0.5 ? '#3a4a70' : '#dfeaf5', look.night > 0.5 ? '#3a3830' : '#b3ae9f', look.hemiI]} />
      <ambientLight intensity={look.night > 0.5 ? 0.35 : 0.22} />
      <Environment key={look.envKey} frames={1} resolution={128} background={false}>
        <color attach="background" args={[look.fog.clone().lerp(new THREE.Color('#88a7c4'), (1 - look.night) * 0.5)]} />
        <Lightformer form="rect" intensity={look.night > 0.5 ? 0.3 : 2.2} color={look.sunColor} position={[0, 30, -40]} scale={[80, 20, 1]} />
        <Lightformer form="rect" intensity={look.night > 0.5 ? 0.1 : 0.8} color="#ffffff" position={[50, 10, 30]} rotation={[0, -Math.PI / 2, 0]} scale={[60, 10, 1]} />
        <Lightformer form="ring" intensity={look.night > 0.5 ? 1.2 : 0.4} color="#7cc242" position={[-40, 5, 20]} scale={8} />
        <mesh position={[0, -30, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={300}>
          <planeGeometry />
          <meshBasicMaterial color={look.night > 0.5 ? '#0a0a0a' : '#55584f'} />
        </mesh>
      </Environment>
      {weather === 'rain' && <Rain />}
    </>
  )
}

/** light rain: line streaks around the camera, animated in the vertex shader */
function Rain() {
  const obj = useMemo(() => {
    const N = 3500
    const pos = new Float32Array(N * 6)
    const off = new Float32Array(N * 2)
    for (let i = 0; i < N; i++) {
      const x = (Math.random() - 0.5) * 80
      const y = Math.random() * 40
      const z = (Math.random() - 0.5) * 80
      pos.set([x, y, z, x, y, z], i * 6)
      off.set([0, -0.55], i * 2)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aOff', new THREE.BufferAttribute(off, 1))
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 }, uCam: { value: new THREE.Vector3() } },
      vertexShader: `uniform float uTime; uniform vec3 uCam; attribute float aOff;
        void main(){ vec3 p = position; p.y = mod(p.y - uTime*16.0, 40.0) - 12.0 + aOff;
        p.x = mod(p.x - uCam.x + 40.0, 80.0) - 40.0; p.z = mod(p.z - uCam.z + 40.0, 80.0) - 40.0;
        vec4 mv = modelViewMatrix * vec4(p + vec3(uCam.x, uCam.y, uCam.z), 1.0); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `void main(){ gl_FragColor = vec4(0.75,0.8,0.9,0.35); }`,
    })
    const l = new THREE.LineSegments(g, m)
    l.frustumCulled = false
    return l
  }, [])
  useFrame((_, dt) => {
    const m = obj.material as THREE.ShaderMaterial
    m.uniforms.uTime.value += dt
    m.uniforms.uCam.value.copy(player.cam)
  })
  return <primitive object={obj} />
}
