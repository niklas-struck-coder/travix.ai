import { useRef } from 'react'
import { input, ui, useUI } from '../state/store'
import { setCameraMode } from '../systems/PlayerController'

/** Virtual joystick (left), look area (right half) and action buttons */
export function TouchControls() {
  const screen = useUI((s) => s.screen)
  const mode = useUI((s) => s.cameraMode)
  const prompt = useUI((s) => s.prompt)
  const seated = useUI((s) => s.seated)
  const ride = useUI((s) => s.ride)
  const knob = useRef<HTMLDivElement>(null)
  const joy = useRef<{ id: number; x: number; y: number } | null>(null)
  const look = useRef<{ id: number; x: number; y: number } | null>(null)
  if (!input.touch || screen !== 'playing') return null

  const R = 55
  const onJoyStart = (e: React.PointerEvent) => {
    joy.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onJoyMove = (e: React.PointerEvent) => {
    if (!joy.current || joy.current.id !== e.pointerId) return
    let dx = e.clientX - joy.current.x
    let dy = e.clientY - joy.current.y
    const l = Math.hypot(dx, dy)
    if (l > R) {
      dx *= R / l
      dy *= R / l
    }
    input.joyX = dx / R
    input.joyY = dy / R
    if (knob.current) knob.current.style.transform = `translate(${dx}px, ${dy}px)`
  }
  const onJoyEnd = () => {
    joy.current = null
    input.joyX = input.joyY = 0
    if (knob.current) knob.current.style.transform = ''
  }
  const onLookStart = (e: React.PointerEvent) => {
    look.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onLookMove = (e: React.PointerEvent) => {
    if (!look.current || look.current.id !== e.pointerId) return
    input.lookDX += (e.clientX - look.current.x) * 2.2
    input.lookDY += (e.clientY - look.current.y) * 2.2
    look.current.x = e.clientX
    look.current.y = e.clientY
  }
  const btn = (label: string, fn: () => void, cls = '') => (
    <button className={'tbtn ' + cls} onPointerDown={(e) => { e.preventDefault(); fn() }}>{label}</button>
  )
  const modes = ['first', 'third', 'bird', 'architect'] as const
  return (
    <div className="touch">
      {mode !== 'bird' && (
        <>
          <div className="look-area" onPointerDown={onLookStart} onPointerMove={onLookMove} onPointerUp={() => (look.current = null)} onPointerCancel={() => (look.current = null)} />
          <div className="joy" onPointerDown={onJoyStart} onPointerMove={onJoyMove} onPointerUp={onJoyEnd} onPointerCancel={onJoyEnd}>
            <div ref={knob} className="knob" />
          </div>
        </>
      )}
      <div className="tbuttons">
        {(prompt || seated || ride) && btn('Aktion', () => (input.interact = true), 'primary')}
        {mode !== 'architect' && mode !== 'bird' && btn('Springen', () => (input.jump = true))}
        {mode === 'architect' && btn('Hoch', () => { input.keys.add('KeyE'); setTimeout(() => input.keys.delete('KeyE'), 400) })}
        {mode === 'architect' && btn('Runter', () => { input.keys.add('KeyQ'); setTimeout(() => input.keys.delete('KeyQ'), 400) })}
      </div>
      <div className="ttop">
        {btn('Karte', () => ui().set({ screen: 'map' }))}
        {btn('Kamera', () => setCameraMode(modes[(modes.indexOf(mode) + 1) % 4]))}
        {btn('Menü', () => ui().set({ screen: 'menu' }))}
      </div>
    </div>
  )
}
