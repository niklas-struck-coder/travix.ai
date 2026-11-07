/**
 * Interactive campus map (full screen) and the rotating minimap.
 * Both share one static map drawing.
 */
import { useEffect, useRef, useState } from 'react'
import { BUILDINGS, INNER_ROAD, LAKE, LAYOUT, STATIONS, UG, polar, buildingById, shortName, undergroundPlan, type BuildingInfo } from '../config/campus'
import { C } from '../engine/materials'
import { track } from '../systems/MonorailSystem'
import { player, ui, useUI, toast } from '../state/store'
import { archCam, setCameraMode, teleport } from '../systems/PlayerController'
import { train, platformOf } from '../systems/MonorailSystem'
import { Logo } from './Logo'

const W = LAYOUT.worldHalf

/** entrance point (world) of a building */
export function entranceOf(b: BuildingInfo): [number, number] {
  if (b.kind === 'hq') return [0, 34]
  const lz = b.d / 2 + 7
  return [b.x + Math.sin(b.rot) * lz, b.z + Math.cos(b.rot) * lz]
}

function drawStatic(g: CanvasRenderingContext2D, size: number) {
  const s = size / (2 * W)
  g.save()
  g.scale(s, s)
  g.translate(W, W)
  g.fillStyle = '#6f9450'
  g.fillRect(-W, -W, 2 * W, 2 * W)
  // canal + city
  g.fillStyle = '#b8b1a5'
  g.fillRect(-W, -W, 2 * W, LAYOUT.canalZ + W - 15)
  g.fillStyle = '#3d7187'
  g.fillRect(-W, LAYOUT.canalZ - 15, 2 * W, 30)
  const ring = (r: number, w: number, col: string) => {
    g.strokeStyle = col
    g.lineWidth = w
    g.beginPath()
    g.arc(0, 0, r, 0, Math.PI * 2)
    g.stroke()
  }
  // boulevard + parking
  g.fillStyle = '#55585a'
  g.fillRect(-8, LAYOUT.ringRoadRadius, 16, W)
  g.fillStyle = '#7d8083'
  g.fillRect(-78, LAYOUT.ringRoadRadius + 18, 64, 60)
  g.fillRect(14, LAYOUT.ringRoadRadius + 18, 64, 60)
  ring(LAYOUT.ringRoadRadius, LAYOUT.ringRoadWidth, '#55585a')
  ring(LAYOUT.fireLaneRadius, 7, '#55585a')
  g.strokeStyle = '#55585a'
  g.lineWidth = 7
  for (const ang of INNER_ROAD.links) {
    const [x0, z0] = polar(ang, LAYOUT.fireLaneRadius)
    const [x1, z1] = polar(ang, LAYOUT.ringRoadRadius)
    g.beginPath()
    g.moveTo(x0, z0)
    g.lineTo(x1, z1)
    g.stroke()
  }
  ring(LAYOUT.bikeRingRadius, 3.6, '#a5564a')
  // plaza
  g.fillStyle = '#d9d3c7'
  g.beginPath()
  g.arc(0, 0, LAYOUT.plazaRadius, 0, Math.PI * 2)
  g.fill()
  // walkways
  g.strokeStyle = '#d9d3c7'
  g.lineWidth = 6
  for (const b of BUILDINGS) {
    if (b.kind === 'hq') continue
    const [x0, z0] = polar(b.angle, LAYOUT.plazaRadius)
    const [x1, z1] = polar(b.angle, b.radius - b.d / 2)
    g.beginPath()
    g.moveTo(x0, z0)
    g.lineTo(x1, z1)
    g.stroke()
  }
  // lake
  g.fillStyle = '#3d7187'
  g.beginPath()
  g.arc(LAKE.x, LAKE.z, LAKE.r, 0, Math.PI * 2)
  g.fill()
  // garage
  g.setLineDash([4, 3])
  g.strokeStyle = '#1f5fa8'
  g.lineWidth = 2
  g.beginPath()
  g.arc(0, 0, UG.parkingRadius, 0, Math.PI * 2)
  g.stroke()
  // underground promenade (Ebene –1): rings, axes and access corridors
  g.strokeStyle = 'rgba(124,194,66,0.9)'
  g.setLineDash([3, 3])
  for (const ring of [UG.centralRing, UG.outerRing]) {
    g.lineWidth = 3
    g.beginPath()
    g.arc(0, 0, ring.r, 0, Math.PI * 2)
    g.stroke()
  }
  for (const c of undergroundPlan().corridors) {
    if (c.level !== 'promenade' || c.kind === 'core' || c.kind === 'stair') continue
    g.lineWidth = c.kind === 'axis' ? 3.5 : 2
    g.beginPath()
    g.moveTo(c.sx, c.sz)
    g.lineTo(c.sx + Math.sin(c.rot) * c.len, c.sz + Math.cos(c.rot) * c.len)
    g.stroke()
  }
  g.setLineDash([])
  // monorail
  g.strokeStyle = C.green
  g.lineWidth = 3
  g.beginPath()
  track.samples.forEach((p, i) => (i ? g.lineTo(p.x, p.z) : g.moveTo(p.x, p.z)))
  g.closePath()
  g.stroke()
  // buildings
  for (const b of BUILDINGS) {
    g.fillStyle = b.kind === 'hq' ? '#ffffff' : b.kind === 'subsidiary' ? '#f1f0ec' : '#e3e7e9'
    g.strokeStyle = '#1d1f1e'
    g.lineWidth = 1.5
    if (b.kind === 'hq') {
      g.beginPath()
      g.arc(0, 0, b.w / 2, 0, Math.PI * 2)
      g.fill()
      g.stroke()
      g.strokeStyle = C.green
      g.lineWidth = 3
      g.stroke()
      continue
    }
    g.save()
    g.translate(b.x, b.z)
    g.rotate(-b.rot)
    g.fillRect(-b.w / 2, -b.d / 2, b.w, b.d)
    g.strokeRect(-b.w / 2, -b.d / 2, b.w, b.d)
    g.fillStyle = C.green
    g.fillRect(-3, b.d / 2 - 1, 6, 2)
    g.restore()
  }
  // stations
  for (const st of STATIONS) {
    const [x, z] = polar(st.angle, LAYOUT.monorailRadius + 3)
    g.fillStyle = '#1d1f1e'
    g.beginPath()
    g.arc(x, z, 4.5, 0, Math.PI * 2)
    g.fill()
    g.fillStyle = C.green
    g.beginPath()
    g.arc(x, z, 2.5, 0, Math.PI * 2)
    g.fill()
  }
  g.restore()
}

let staticCanvas: HTMLCanvasElement | null = null
function getStatic() {
  if (!staticCanvas) {
    staticCanvas = document.createElement('canvas')
    staticCanvas.width = staticCanvas.height = 1600
    drawStatic(staticCanvas.getContext('2d')!, 1600)
  }
  return staticCanvas
}

// ---------------------------------------------------------------------------- minimap
export function Minimap() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    let raf = 0
    let last = 0
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop)
      if (t - last < 66) return
      last = t
      const cv = ref.current
      if (!cv) return
      const g = cv.getContext('2d')!
      const S = cv.width
      const st = getStatic()
      const zoom = 3.0 // canvas px per metre at 1600px static = 1600/860
      const mpp = (2 * W) / st.width // metres per static pixel
      g.save()
      g.clearRect(0, 0, S, S)
      g.beginPath()
      g.arc(S / 2, S / 2, S / 2 - 2, 0, Math.PI * 2)
      g.clip()
      g.fillStyle = '#6f9450'
      g.fillRect(0, 0, S, S)
      g.translate(S / 2, S / 2)
      g.rotate(player.yaw)
      const sc = zoom * mpp
      g.scale(sc, sc)
      g.drawImage(st, -(player.pos.x + W) / mpp, -(player.pos.z + W) / mpp)
      g.restore()
      // nav target
      const nav = ui().navTarget
      if (nav) {
        const dx = nav.x - player.pos.x
        const dz = nav.z - player.pos.z
        const c = Math.cos(player.yaw)
        const s = Math.sin(player.yaw)
        let rx = (dx * c - dz * s) * zoom
        let rz = (dx * s + dz * c) * zoom
        const len = Math.hypot(rx, rz)
        const max = S / 2 - 10
        if (len > max) {
          rx *= max / len
          rz *= max / len
        }
        g.fillStyle = C.green
        g.strokeStyle = '#fff'
        g.lineWidth = 2
        g.beginPath()
        g.arc(S / 2 + rx, S / 2 + rz, 6, 0, Math.PI * 2)
        g.fill()
        g.stroke()
      }
      // player arrow
      g.fillStyle = '#fff'
      g.strokeStyle = '#141615'
      g.lineWidth = 2
      g.beginPath()
      g.moveTo(S / 2, S / 2 - 9)
      g.lineTo(S / 2 + 6, S / 2 + 7)
      g.lineTo(S / 2, S / 2 + 3)
      g.lineTo(S / 2 - 6, S / 2 + 7)
      g.closePath()
      g.fill()
      g.stroke()
      // north marker
      const na = player.yaw
      g.fillStyle = '#fff'
      g.font = '700 12px sans-serif'
      g.textAlign = 'center'
      g.fillText('N', S / 2 + Math.sin(na) * (S / 2 - 12) * -1 * -1, S / 2 - Math.cos(na) * (S / 2 - 12) + 4)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return <canvas ref={ref} width={170} height={170} className="minimap" onClick={() => { document.exitPointerLock?.(); ui().set({ screen: 'map' }) }} />
}

// ---------------------------------------------------------------------------- full map
export function CampusMap() {
  const ref = useRef<HTMLCanvasElement>(null)
  const [sel, setSel] = useState<string | null>(null)
  const nav = useUI((s) => s.navTarget)
  const started = useUI((s) => s.started)
  useEffect(() => {
    const cv = ref.current!
    const draw = () => {
      const r = cv.getBoundingClientRect()
      cv.width = r.width * devicePixelRatio
      cv.height = r.height * devicePixelRatio
      const g = cv.getContext('2d')!
      const S = Math.min(cv.width, cv.height)
      const ox = (cv.width - S) / 2
      const oy = (cv.height - S) / 2
      g.fillStyle = '#0f1211'
      g.fillRect(0, 0, cv.width, cv.height)
      g.drawImage(getStatic(), ox, oy, S, S)
      const k = S / (2 * W)
      const P = (x: number, z: number) => [ox + (x + W) * k, oy + (z + W) * k] as const
      g.textAlign = 'center'
      g.font = `600 ${Math.max(10, 11 * devicePixelRatio)}px "Helvetica Neue", Arial, sans-serif`
      // labels: shift vertically until they no longer overlap already placed labels
      const placed: [number, number, number, number][] = []
      const lh = 18 * devicePixelRatio
      for (const b of [...BUILDINGS].sort((p, q) => p.radius - q.radius)) {
        const [x, y0] = P(b.x, b.z)
        const label = shortName(b)
        const tw = g.measureText(label).width + 10
        let y = y0
        const hits = (yy: number) => placed.some(([px, py, pw, ph]) => Math.abs(px - x) < (pw + tw) / 2 + 2 && Math.abs(py - yy) < (ph + lh) / 2 + 1)
        for (let k = 1; k < 12 && hits(y); k++) y = y0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (lh + 2)
        placed.push([x, y, tw, lh])
        g.fillStyle = sel === b.id ? C.green : 'rgba(20,22,21,0.82)'
        g.fillRect(x - tw / 2, y - lh / 2, tw, lh)
        g.fillStyle = '#fff'
        g.fillText(label, x, y + 4 * devicePixelRatio)
      }
      if (nav) {
        const [x, y] = P(nav.x, nav.z)
        g.strokeStyle = C.green
        g.lineWidth = 3 * devicePixelRatio
        g.setLineDash([8, 6])
        const [px, py] = P(player.pos.x, player.pos.z)
        g.beginPath()
        g.moveTo(px, py)
        g.lineTo(x, y)
        g.stroke()
        g.setLineDash([])
      }
      if (started) {
        const [px, py] = P(player.pos.x, player.pos.z)
        g.save()
        g.translate(px, py)
        g.rotate(-player.yaw)
        g.fillStyle = '#fff'
        g.strokeStyle = '#000'
        g.lineWidth = 2
        g.beginPath()
        g.moveTo(0, -12)
        g.lineTo(8, 9)
        g.lineTo(0, 4)
        g.lineTo(-8, 9)
        g.closePath()
        g.fill()
        g.stroke()
        g.restore()
      }
    }
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [sel, nav, started])

  const onClick = (e: React.MouseEvent) => {
    const cv = ref.current!
    const r = cv.getBoundingClientRect()
    const S = Math.min(r.width, r.height)
    const ox = (r.width - S) / 2
    const oy = (r.height - S) / 2
    const x = ((e.clientX - r.left - ox) / S) * 2 * W - W
    const z = ((e.clientY - r.top - oy) / S) * 2 * W - W
    let best: string | null = null
    let bd = 40
    for (const b of BUILDINGS) {
      const d = Math.hypot(b.x - x, b.z - z)
      if (d < bd) {
        bd = d
        best = b.id
      }
    }
    // monorail stations win when clicked close to them
    for (const st of STATIONS) {
      const [sx, sz] = polar(st.angle, LAYOUT.monorailRadius + 3)
      const d = Math.hypot(sx - x, sz - z)
      if (d < 16 && d < bd + 6) {
        bd = d
        best = st.id
      }
    }
    setSel(best)
  }

  const st = sel ? STATIONS.find((s) => s.id === sel) : undefined
  const b = sel && !st ? buildingById(sel) : null
  const dist = b ? Math.round(Math.hypot(entranceOf(b)[0] - player.pos.x, entranceOf(b)[1] - player.pos.z)) : 0
  const close = () => ui().set({ screen: started ? 'playing' : 'menu' })
  return (
    <div className="overlay map-screen">
      <canvas ref={ref} className="map-canvas" onClick={onClick} />
      <div className="map-head">
        <Logo size={20} />
        <span className="map-title">Campuskarte · Amsterdam</span>
        <button className="btn ghost" onClick={close}>Schließen (Esc)</button>
      </div>
      <div className="map-legend">
        <span><i style={{ background: C.green }} /> Monorail & Stationen</span>
        <span><i style={{ background: '#a5564a' }} /> Radweg</span>
        <span><i style={{ background: '#55585a' }} /> Straßen & Campusring</span>
        <span><i style={{ border: '2px dashed #1f5fa8' }} /> Tiefgarage (Ebene –2)</span>
        <span><i style={{ border: '2px dashed #7cc242' }} /> Promenade (Ebene –1)</span>
        <span>Gebäude anklicken für Details</span>
      </div>
      {st && (
        <div className="panel map-panel">
          <div className="small muted">Monorail-Station</div>
          <h2>{st.name}</h2>
          <p>Rundkurs mit 5 Stationen. Der Zug hält ca. 24 s, die Türen öffnen zur Bahnsteigseite. Auf dem Bahnsteig <b>E</b> drücken zum Einsteigen, an der nächsten Station <b>E</b> zum Aussteigen.</p>
          <p className="muted">Nächster Zug in ca. {Math.max(0, Math.round(train.eta(platformOf(st.id).i)))} s</p>
          <div className="row">
            <button className="btn" onClick={() => {
              const p = platformOf(st.id)
              teleport(p.x, p.z)
              player.pos.set(p.x, p.y, p.z)
              if (ui().cameraMode === 'bird' || ui().cameraMode === 'architect') ui().set({ cameraMode: 'first' })
              ui().set({ screen: 'playing', started: true })
              toast('Du stehst auf dem Bahnsteig – warte auf den Zug und drücke E.')
            }}>Zum Bahnsteig teleportieren</button>
          </div>
        </div>
      )}
      {b && (
        <div className="panel map-panel">
          <Logo size={18} suffix={b.suffix} />
          <h2>{b.name}</h2>
          <p>{b.description}</p>
          <p className="muted">{started ? `Entfernung zum Eingang: ${dist} m (Luftlinie)` : 'Starte den Rundgang, um die Entfernung zu sehen.'}</p>
          <div className="row">
            <button className="btn" onClick={() => {
              const [x, z] = entranceOf(b)
              ui().set({ navTarget: { id: b.id, name: b.name, x, z }, screen: 'playing', started: true })
              if (ui().cameraMode === 'bird' || ui().cameraMode === 'architect') setCameraMode('first')
              toast(`Navigation zu ${b.name} gestartet (Richtungspfeil folgen)`)
            }}>Navigation starten</button>
            <button className="btn ghost" onClick={() => {
              const [x, z] = entranceOf(b)
              teleport(x, z, Math.atan2(x - b.x, z - b.z))
              if (ui().cameraMode === 'bird' || ui().cameraMode === 'architect') ui().set({ cameraMode: 'first' })
              ui().set({ screen: 'playing', started: true })
            }}>Hierhin teleportieren</button>
            <button className="btn ghost" onClick={() => {
              const [ex, ez] = entranceOf(b)
              archCam.pos.set(ex + (ex - b.x) * 2.2, b.floors * b.floorH * 0.8 + 25, ez + (ez - b.z) * 2.2)
              archCam.yaw = Math.atan2(archCam.pos.x - b.x, archCam.pos.z - b.z)
              archCam.pitch = -0.35
              ui().set({ cameraMode: 'architect', screen: 'playing', started: true })
            }}>Architekturansicht</button>
          </div>
          {nav?.id === b.id && <button className="btn ghost small" onClick={() => ui().set({ navTarget: null })}>Navigation beenden</button>}
        </div>
      )}
    </div>
  )
}
