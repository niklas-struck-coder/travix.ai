import { useUI, ui, TIME_PRESETS, input, type TimePreset, type Weather, type Quality, type CameraMode } from '../state/store'
import { Logo } from './Logo'
import { setCameraMode, teleport } from '../systems/PlayerController'
import { START } from '../config/campus'

export function MainMenu() {
  const s = useUI()
  if (s.screen !== 'menu') return null
  const enter = () => {
    if (!s.started) teleport(START.x, START.z, START.yaw)
    if (s.cameraMode === 'architect' || s.cameraMode === 'bird') ui().set({ cameraMode: s.started ? s.cameraMode : 'first' })
    ui().set({ screen: 'playing', started: true })
    if (!input.touch) setTimeout(() => (document.querySelector('canvas') as HTMLCanvasElement | null)?.requestPointerLock?.(), 50)
  }
  const free = () => {
    if (!s.started) teleport(START.x, START.z, START.yaw)
    ui().set({ screen: 'playing', started: true })
    setCameraMode('architect')
    if (!input.touch) setTimeout(() => (document.querySelector('canvas') as HTMLCanvasElement | null)?.requestPointerLock?.(), 50)
  }
  return (
    <div className="overlay menu">
      <div className="menu-card panel">
        <div className="menu-logo"><Logo size={40} /></div>
        <div className="menu-title">GLOBAL CAMPUS · AMSTERDAM</div>
        <p className="muted">Interaktive 3D-Welt des internationalen Hauptsitzes. Erkunde das runde Holding-Headquarter, die Unternehmenszentralen inklusive Big Apple Groups Racing, das Visitor Center, das Health & Recovery Center, Campus-Hotel und Mitarbeiter-Residenz, Monorail und Tiefgarage.</p>
        <div className="menu-buttons">
          <button className="btn big" onClick={enter}>{s.started ? 'Weiter erkunden' : 'Campus betreten'}</button>
          <button className="btn big ghost" onClick={free}>Freie Erkundung (Architekturmodus)</button>
          <button className="btn big ghost" onClick={() => ui().set({ screen: 'map' })}>Campuskarte</button>
          <button className="btn big ghost" onClick={() => ui().set({ screen: 'settings' })}>Einstellungen</button>
          <button className="btn big ghost" onClick={() => ui().set({ screen: 'help' })}>Steuerung & Hinweise</button>
        </div>
        <p className="small muted">{input.touch ? 'Touch: Joystick links laufen · rechte Bildschirmhälfte umsehen · Buttons für Aktion, Springen, Menü.' : 'WASD laufen · Maus umsehen · Shift rennen · Leertaste springen · E interagieren · M Karte · Esc Menü'}</p>
      </div>
    </div>
  )
}

export function Settings() {
  const s = useUI()
  if (s.screen !== 'settings') return null
  const back = () => ui().set({ screen: s.started ? 'playing' : 'menu' })
  const Opt = <T extends string>({ value, options, onPick }: { value: T; options: [T, string][]; onPick: (v: T) => void }) => (
    <div className="seg">
      {options.map(([v, l]) => (
        <button key={v} className={v === value ? 'on' : ''} onClick={() => onPick(v)}>{l}</button>
      ))}
    </div>
  )
  const preset = (Object.entries(TIME_PRESETS) as [TimePreset, { label: string; hour: number }][]).reduce((a, [k, v]) => (Math.abs(v.hour - s.hour) < Math.abs(TIME_PRESETS[a].hour - s.hour) ? k : a), 'noon' as TimePreset)
  return (
    <div className="overlay menu">
      <div className="panel settings">
        <h2>Einstellungen</h2>
        <label>Tageszeit</label>
        <Opt value={preset} options={Object.entries(TIME_PRESETS).map(([k, v]) => [k as TimePreset, v.label])} onPick={(v) => ui().set({ hour: TIME_PRESETS[v].hour })} />
        <label className="check"><input type="checkbox" checked={s.timeFlow} onChange={(e) => ui().set({ timeFlow: e.target.checked })} /> Zeit läuft weiter (1 s = 1 Minute)</label>
        <label>Wetter</label>
        <Opt<Weather> value={s.weather} options={[['sun', 'Sonnenschein'], ['cloudy', 'Bewölkt'], ['rain', 'Leichter Regen']]} onPick={(v) => ui().set({ weather: v })} />
        <label>Kamera</label>
        <Opt<CameraMode> value={s.cameraMode} options={[['first', 'First Person'], ['third', 'Third Person'], ['bird', 'Vogelperspektive'], ['architect', 'Architektur']]} onPick={(v) => setCameraMode(v)} />
        <label>Grafikqualität</label>
        <Opt<Quality> value={s.quality} options={[['low', 'Niedrig (Tablet/Handy)'], ['medium', 'Mittel'], ['high', 'Hoch']]} onPick={(v) => ui().set({ quality: v })} />
        <label>Mausempfindlichkeit: {s.sensitivity.toFixed(1)}</label>
        <input type="range" min={0.3} max={2.5} step={0.1} value={s.sensitivity} onChange={(e) => ui().set({ sensitivity: Number(e.target.value) })} />
        <label>Sichtfeld: {s.fov}°</label>
        <input type="range" min={55} max={95} step={1} value={s.fov} onChange={(e) => ui().set({ fov: Number(e.target.value) })} />
        <label className="check"><input type="checkbox" checked={s.invertY} onChange={(e) => ui().set({ invertY: e.target.checked })} /> Maus-Y invertieren</label>
        <label className="check"><input type="checkbox" checked={s.showHints} onChange={(e) => ui().set({ showHints: e.target.checked })} /> Steuerungshinweise anzeigen</label>
        <div className="row">
          <button className="btn" onClick={back}>{s.started ? 'Zurück in die Welt' : 'Zurück'}</button>
          {s.started && <button className="btn ghost" onClick={() => ui().set({ screen: 'menu' })}>Hauptmenü</button>}
        </div>
      </div>
    </div>
  )
}

export function Help() {
  const s = useUI()
  if (s.screen !== 'help') return null
  return (
    <div className="overlay menu">
      <div className="panel settings help">
        <h2>Steuerung & Hinweise</h2>
        <h3>PC</h3>
        <p>W/A/S/D laufen · Maus umsehen · Shift rennen · Leertaste springen · E interagieren · M Campuskarte · 1–4 Kameraperspektive · T Tageszeit wechseln · H Hinweise · Esc Menü</p>
        <h3>Smartphone / Tablet</h3>
        <p>Joystick links zum Laufen (ganz ausgelenkt = rennen) · rechte Bildschirmhälfte zum Umsehen · Buttons für Aktion, Springen, Karte, Kamera und Menü.</p>
        <h3>Was du tun kannst</h3>
        <ul>
          <li>HQ: Lobby mit Empfang, Besucherregistrierung, Markenwelt, Wendeltreppe zur Galerie (Kantine/Lounge), Aufzug zu 4./7./10./18./21. OG und zur Dachterrasse.</li>
          <li>Alle Unternehmensgebäude sind betretbar: Aufzug + Treppenhaus zwischen den Etagen, thematische Räume.</li>
          <li>Monorail: an einer Station auf den Bahnsteig (Treppe oder Lift), bei offenen Türen <b>E</b> zum Einsteigen, an der nächsten Station <b>E</b> zum Aussteigen.</li>
          <li>Tiefgarage: Rampe von der Ringstraße oder Glas-Aufzug hinter dem Visitor Center.</li>
          <li>Bänke, Sofas und Liegen: <b>E</b> zum Hinsetzen. Bildschirme und Infopunkte: <b>E</b> zum Lesen.</li>
        </ul>
        <h3>Ehrliche Grenzen dieser Version</h3>
        <ul>
          <li>Im HQ hält der Aufzug nur auf den ausgestalteten Etagen; die übrigen Etagen sind von außen sichtbar, aber nicht begehbar. Treppen gibt es im HQ zwischen Lobby und Galerie.</li>
          <li>Navigation zeigt die Richtung in Luftlinie (keine Wegberechnung um Hindernisse).</li>
          <li>Gebäude, Möbel und Personen sind prozedural erzeugt (keine externen 3D-Modelle); das Logo ist typografisch nach der Vorgabe nachgebaut, bis die offizielle Logodatei eingebunden wird.</li>
          <li>Fahrzeuge fahren nur auf der Ringstraße; Bildschirminhalte und Kennzahlen sind Beispielinhalte.</li>
        </ul>
        <button className="btn" onClick={() => ui().set({ screen: s.started ? 'playing' : 'menu' })}>Zurück</button>
      </div>
    </div>
  )
}
