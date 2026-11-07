/**
 * In-world HUD (logo, clock, weather, minimap, location, prompts,
 * navigation arrow, monorail ride status) and modal panels (info,
 * elevator floor selection).
 */
import { useEffect, useRef, useState } from 'react'
import { useUI, ui, player, input, toast } from '../state/store'
import { BUILDINGS } from '../config/campus'
import { elevatorById } from '../world/dynamic'
import { Logo } from './Logo'
import { Minimap } from './CampusMap'

const WEATHER = { sun: '☀ Sonnig', cloudy: '☁ Bewölkt', rain: '🌧 Leichter Regen' }

function fmtTime(h: number) {
  const hh = Math.floor(h) % 24
  const mm = Math.floor((h - Math.floor(h)) * 60)
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

export function HUD() {
  const s = useUI()
  if (s.screen !== 'playing') return null
  const touch = input.touch
  return (
    <div className="hud">
      <div className="hud-tl panel slim">
        <Logo size={17} />
        <div className="hud-meta">
          <span className="clock">{fmtTime(s.hour)}</span>
          <span>{s.weather === 'sun' && (s.hour < 6.5 || s.hour > 20.8) ? '☾ Klar' : WEATHER[s.weather]}</span>
          <span className="muted">Amsterdam</span>
        </div>
      </div>
      <div className="hud-tr">
        <Minimap />
        <div className="location panel slim">{s.location || 'Campusgelände'}</div>
      </div>
      {s.ride && (
        <div className="ride panel slim">
          <b>Monorail</b> · {s.ride.status}
        </div>
      )}
      {s.toast && <div className="toast">{s.toast}</div>}
      <NavArrow />
      {s.prompt && !s.elevatorPanel && !s.info && (
        <div className="prompt" onClick={() => (input.interact = true)}>
          {touch ? <b>Aktion: </b> : <kbd>E</kbd>} {s.prompt}
        </div>
      )}
      {s.showHints && !touch && (
        <div className="hints">
          {s.cameraMode === 'architect' ? (
            <>
              <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> fliegen</span><span><kbd>Q</kbd>/<kbd>E</kbd> runter/hoch</span><span><kbd>Shift</kbd> schnell</span><span><kbd>1</kbd> zurück zu Fuß</span>
            </>
          ) : s.cameraMode === 'bird' ? (
            <>
              <span>Maus ziehen: drehen</span><span>Rechte Maustaste: verschieben</span><span>Scrollen: Zoom</span><span><kbd>1</kbd> zurück zu Fuß</span>
            </>
          ) : (
            <>
              <span><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> laufen</span><span><kbd>Shift</kbd> rennen</span><span><kbd>Leertaste</kbd> springen</span><span><kbd>E</kbd> interagieren</span><span><kbd>M</kbd> Karte</span><span><kbd>1</kbd>–<kbd>4</kbd> Kamera</span><span><kbd>T</kbd> Tageszeit</span><span><kbd>Esc</kbd> Menü</span><span><kbd>H</kbd> Hinweise aus</span>
            </>
          )}
        </div>
      )}
      {!touch && s.cameraMode !== 'bird' && <div className="crosshair" />}
      <ClickToPlay />
    </div>
  )
}

function ClickToPlay() {
  const [locked, setLocked] = useState(true)
  const mode = useUI((s) => s.cameraMode)
  const panel = useUI((s) => !!s.elevatorPanel || !!s.info)
  useEffect(() => {
    const f = () => setLocked(!!document.pointerLockElement)
    document.addEventListener('pointerlockchange', f)
    f()
    return () => document.removeEventListener('pointerlockchange', f)
  }, [])
  if (locked || input.touch || mode === 'bird' || panel) return null
  return <div className="click-hint">Klicken für Maussteuerung – oder bei gedrückter Maustaste ziehen, um dich umzusehen</div>
}

function NavArrow() {
  const nav = useUI((s) => s.navTarget)
  const ref = useRef<HTMLDivElement>(null)
  const dref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!nav) return
    let raf = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const dx = nav.x - player.pos.x
      const dz = nav.z - player.pos.z
      const d = Math.hypot(dx, dz)
      const target = Math.atan2(-dx, -dz)
      const rel = target - player.yaw
      if (ref.current) ref.current.style.transform = `rotate(${-Math.PI / 2 - rel}rad)`
      if (dref.current) dref.current.textContent = `${Math.round(d)} m`
      if (d < 7) {
        toast(`Ziel erreicht: ${nav.name}`)
        ui().set({ navTarget: null })
      }
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [nav])
  if (!nav) return null
  return (
    <div className="nav panel slim">
      <div ref={ref} className="nav-arrow">➤</div>
      <div>
        <div className="small muted">Navigation (Luftlinie)</div>
        <b>{nav.name}</b> · <span ref={dref} />
      </div>
      <button className="btn ghost small" onClick={() => ui().set({ navTarget: null })}>✕</button>
    </div>
  )
}

export function InfoPanel() {
  const info = useUI((s) => s.info)
  if (!info) return null
  const close = () => ui().set({ info: null })
  return (
    <div className="overlay dim" onClick={close}>
      <div className="panel modal" onClick={(e) => e.stopPropagation()}>
        <Logo size={18} suffix={info.suffix} />
        <h2>{info.title}</h2>
        {info.subtitle && <p className="accent">{info.subtitle}</p>}
        {info.body.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
        <button className="btn" onClick={close}>Schließen</button>
      </div>
    </div>
  )
}

export function ElevatorPanel() {
  const id = useUI((s) => s.elevatorPanel)
  const [, force] = useState(0)
  useEffect(() => {
    if (!id) return
    const t = setInterval(() => force((x) => x + 1), 250)
    return () => clearInterval(t)
  }, [id])
  if (!id) return null
  const el = elevatorById(id)
  if (!el) return null
  const close = () => ui().set({ elevatorPanel: null })
  const choose = (i: number) => {
    close()
    if (!el.playerInside()) {
      // step into the cab first, then the doors close
      player.autoWalk = { x: el.cx, z: el.cz, t: 2 }
      setTimeout(() => el.call(i), 1300)
    } else el.call(i)
  }
  return (
    <div className="overlay dim" onClick={close}>
      <div className="panel modal elevator" onClick={(e) => e.stopPropagation()}>
        <div className="small muted">{el.name}</div>
        <h2>Etage wählen</h2>
        <div className="floors">
          {[...el.stops.map((s, i) => ({ s, i }))].reverse().map(({ s, i }) => (
            <button key={i} className={'floor ' + (i === el.index ? 'current' : '')} onClick={() => choose(i)}>
              <span className="dot" /> {s.label}
              {i === el.index && <span className="muted small"> · hier</span>}
            </button>
          ))}
        </div>
        <button className="btn ghost" onClick={close}>Abbrechen</button>
      </div>
    </div>
  )
}

export function Fade() {
  return null
}

export const buildingList = BUILDINGS
