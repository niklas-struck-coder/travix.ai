/**
 * Masterplan 2.0 – plans and room lists generated from the same data as the
 * 3D world (src/config/campus.ts, src/config/programs.ts).
 */
import './masterplan.css'
import {
  BUILDINGS, LAKE, LAYOUT, LEVELS, STATIONS, UG, DEG, polar, rampCorners, shortName, undergroundPlan, monorailControlPoints,
  type BuildingInfo, type Corridor,
} from '../config/campus'
import { PROGRAMS, HQ_FLOORS, FURNITURE, CONCEPTS, businessProgram } from '../config/programs'

// ------------------------------------------------------------------ helpers
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const f1 = (v: number) => v.toFixed(0)
const plan = undergroundPlan()

/** building order & numbers: HQ first, then by compass angle (outer ring), then inner ring */
const ORDER = [
  BUILDINGS.find((b) => b.kind === 'hq')!,
  ...BUILDINGS.filter((b) => b.kind !== 'hq' && b.radius > 140).sort((a, b) => a.angle - b.angle),
  ...BUILDINGS.filter((b) => b.kind !== 'hq' && b.radius <= 140).sort((a, b) => a.angle - b.angle),
]
const NUM = new Map(ORDER.map((b, i) => [b.id, i + 1]))
const nameOf = (b: BuildingInfo) => b.name

function rectPts(cx: number, cz: number, rot: number, x0: number, x1: number, z0: number, z1: number) {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  return [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([lx, lz]) => [cx + lx * c + lz * s, cz - lx * s + lz * c])
}
const poly = (pts: number[][], cls: string, extra = '') => `<polygon class="${cls}" points="${pts.map((p) => p.map((v) => v.toFixed(2)).join(',')).join(' ')}" ${extra}/>`
const bldPoly = (b: BuildingInfo, cls = 'bld') =>
  b.kind === 'hq' ? `<circle class="${cls}" cx="0" cy="0" r="${b.w / 2}"/>` : poly(rectPts(b.x, b.z, b.rot, -b.w / 2, b.w / 2, -b.d / 2, b.d / 2), cls)
const corridorPts = (c: Corridor) => rectPts(c.sx, c.sz, c.rot, -c.width / 2, c.width / 2, 0, c.len)
const label = (x: number, z: number, t: string, cls = 'lbl') => `<text class="${cls}" x="${x.toFixed(1)}" y="${z.toFixed(1)}">${esc(t)}</text>`
const numTag = (b: BuildingInfo, r = 6.5) => {
  const x = b.x
  const z = b.z
  return `<g class="tag"><circle cx="${x}" cy="${z}" r="${r}"/><text x="${x}" y="${z + r * 0.38}">${NUM.get(b.id)}</text></g>`
}
const arcPath = (r: number) => `<circle cx="0" cy="0" r="${r}"/>`

/** centripetal Catmull-Rom (closed), same curve family as the 3D monorail */
function catmullRom(pts: [number, number][], samplesPerSeg = 24): [number, number][] {
  const out: [number, number][] = []
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const d = (a: number[], b: number[]) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-4
    const t0 = 0
    const t1 = t0 + d(p0, p1)
    const t2 = t1 + d(p1, p2)
    const t3 = t2 + d(p2, p3)
    for (let k = 0; k < samplesPerSeg; k++) {
      const t = t1 + ((t2 - t1) * k) / samplesPerSeg
      const lerp = (a: number[], b: number[], ta: number, tb: number) => [((tb - t) / (tb - ta)) * a[0] + ((t - ta) / (tb - ta)) * b[0], ((tb - t) / (tb - ta)) * a[1] + ((t - ta) / (tb - ta)) * b[1]]
      const A1 = lerp(p0, p1, t0, t1)
      const A2 = lerp(p1, p2, t1, t2)
      const A3 = lerp(p2, p3, t2, t3)
      const B1 = lerp(A1, A2, t0, t2)
      const B2 = lerp(A2, A3, t1, t3)
      const Cc = lerp(B1, B2, t1, t2)
      out.push([Cc[0], Cc[1]])
    }
  }
  return out
}
const track = catmullRom(monorailControlPoints())
const stationPos = (deg: number) => polar(deg, LAYOUT.monorailRadius + 4)

const ns = (body: string, vb: string, title: string, cls = '') => `<svg class="plan ${cls}" viewBox="${vb}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title>${body}</svg>`
const northArrow = (x: number, y: number, s = 14) => `<g class="north" transform="translate(${x},${y})"><path d="M0 ${-s} L${s * 0.45} ${s * 0.6} L0 ${s * 0.25} L${-s * 0.45} ${s * 0.6} Z"/><text x="0" y="${-s - 4}">N</text></g>`
const scaleBar = (x: number, y: number, m = 100) => `<g class="scalebar" transform="translate(${x},${y})"><rect x="0" y="0" width="${m / 2}" height="3"/><rect class="w" x="${m / 2}" y="0" width="${m / 2}" height="3"/><text x="0" y="12">0</text><text x="${m}" y="12">${m} m</text></g>`

// ------------------------------------------------------------------ 1 · site plan
function sitePlan() {
  const R = LAYOUT.ringRoadRadius
  let g = ''
  g += `<rect class="grass" x="-270" y="-270" width="540" height="540"/>`
  g += `<g class="road">${arcPath(R)}</g>`
  g += `<g class="fire">${arcPath(LAYOUT.fireLaneRadius)}</g>`
  g += `<g class="bike">${arcPath(LAYOUT.bikeRingRadius)}</g>`
  g += `<circle class="plaza" cx="0" cy="0" r="${LAYOUT.plazaRadius}"/>`
  g += `<circle class="water" cx="${LAKE.x}" cy="${LAKE.z}" r="${LAKE.r}"/>`
  // walkways
  for (const b of BUILDINGS) {
    if (b.kind === 'hq') continue
    const [x0, z0] = polar(b.angle, LAYOUT.plazaRadius)
    const [x1, z1] = polar(b.angle, b.radius - b.d / 2)
    if (b.radius > 100) g += `<line class="walk" x1="${x0}" y1="${z0}" x2="${x1}" y2="${z1}"/>`
  }
  g += `<rect class="road-fill" x="-8" y="${R + 6}" width="16" height="30"/>`
  for (const r of UG.ramps) g += poly(rampCorners(r.angle), 'ramp')
  g += `<polyline class="mono" points="${track.map((p) => p.join(',')).join(' ')} ${track[0].join(',')}"/>`
  for (const s of STATIONS) {
    const [x, z] = stationPos(s.angle)
    g += `<rect class="station" x="${x - 4}" y="${z - 4}" width="8" height="8" transform="rotate(${s.angle} ${x} ${z})"/>`
  }
  for (const b of ORDER) g += bldPoly(b, b.kind === 'hq' ? 'bld hq' : 'bld')
  for (const b of ORDER) g += numTag(b)
  for (const c of UG.cores.filter((c) => c.plaza)) {
    const [x, z] = polar(c.angle, UG.coreR)
    g += `<rect class="lift" x="${x - 1.8}" y="${z - 1.8}" width="3.6" height="3.6"/>`
  }
  g += label(0, R + 44, 'Haupteinfahrt / Boulevard', 'lbl small mid')
  g += label(LAKE.x, LAKE.z + 3, 'Campussee', 'lbl small mid w')
  g += northArrow(240, -235)
  g += scaleBar(-255, 250)
  return ns(g, '-270 -270 540 540', 'Gesamt-Lageplan von oben')
}

// ------------------------------------------------------------------ 4 · level −1
function levelMinus1() {
  let g = `<rect class="earth" x="-235" y="-235" width="470" height="470"/>`
  for (const b of ORDER) g += bldPoly(b, 'bld ghost')
  const C = UG.centralRing
  const O = UG.outerRing
  g += `<g class="corr-ring" style="stroke-width:${C.w}">${arcPath(C.r)}</g>`
  g += `<g class="corr-ring" style="stroke-width:${O.w}">${arcPath(O.r)}</g>`
  g += `<g class="ring-edge">${[C.r - C.w / 2, C.r + C.w / 2, O.r - O.w / 2, O.r + O.w / 2].map(arcPath).join('')}</g>`
  for (const c of plan.corridors) {
    if (c.level !== 'promenade') continue
    g += poly(corridorPts(c), `corr corr-${c.kind}`)
    if (c.kind === 'axis') {
      const nSeg = Math.floor((c.len - 30) / 28)
      for (let k = 0; k < nSeg; k++) {
        const z0 = 16 + k * 28
        for (const x of [-1, 1]) g += poly(rectPts(c.sx, c.sz, c.rot, x - 0.6, x + 0.6, z0, z0 + 24), 'belt')
      }
      g += poly(rectPts(c.sx, c.sz, c.rot, c.width / 2, c.width / 2 + 5, 6, 13), 'coffee')
      g += poly(rectPts(c.sx, c.sz, c.rot, -c.width / 2 - 5, -c.width / 2, c.len - 22, c.len - 12), 'lounge')
    }
    if (c.kind === 'spur') {
      const b = BUILDINGS.find((x) => x.id === c.building)!
      const depth = Math.max(4, 0.35 + 1.5 + Math.round(b.floorH / 2 / 0.175) * 0.3 - 3 + 2.5)
      g += poly(rectPts(c.sx, c.sz, c.rot, -3, 6.9, -3, depth), 'foyer')
      g += poly(rectPts(c.sx, c.sz, c.rot, -1.4, 1.4, -2.7, 0), 'elev')
      const [tx, tz] = [c.sx + Math.sin(c.rot) * (c.len - 6), c.sz + Math.cos(c.rot) * (c.len - 6)]
      g += `<g class="tag small"><circle cx="${tx}" cy="${tz}" r="4.6"/><text x="${tx}" y="${tz + 1.7}">${NUM.get(b.id)}</text></g>`
    }
  }
  // HQ elevator, cores, stair
  g += `<rect class="elev" x="-1.4" y="4.25" width="2.8" height="2.6"/>`
  g += `<circle class="core" cx="0" cy="0" r="7"/>`
  for (const c of UG.cores) {
    const [x, z] = polar(c.angle, UG.coreR)
    g += `<rect class="elev ${c.plaza ? 'plaza' : ''}" x="${x - 1.5}" y="${z - 1.5}" width="3" height="3"/>`
  }
  {
    const rot = Math.PI - UG.stair.angle * DEG
    const [sx, sz] = polar(UG.stair.angle, UG.stair.rBottom)
    g += poly(rectPts(sx, sz, rot, -1.5, 1.5, 0, 7.8), 'stair')
  }
  UG.axes.forEach((a, i) => {
    const [x, z] = polar(a, 90)
    g += label(x + (a === 90 || a === 270 ? 0 : 9), z + (a === 0 || a === 180 ? 0 : -8), UG.axisNames[i], 'lbl small mid')
  })
  g += label(0, -C.r + 1.5, 'Zentraler Ring', 'lbl tiny mid')
  g += label(O.r * 0.74 + 4, -O.r * 0.68 + 14, 'Äußerer Ring', 'lbl small')
  g += northArrow(212, -208)
  g += scaleBar(-225, 220)
  return ns(g, '-235 -235 470 470', 'Grundriss Ebene –1 Campus-Promenade')
}

// ------------------------------------------------------------------ 5 · level −2
const STAIR_BOTTOM = polar(UG.stair.angle, UG.stair.rBottom + 4)
function laneFree(x: number, z: number, margin: number) {
  for (const r of UG.ramps) {
    const a = r.angle * DEG
    const dx = Math.sin(a)
    const dz = -Math.cos(a)
    if (x * dx + z * dz > 6 && Math.abs(x * dz - z * dx) < UG.rampWidth / 2 + margin) return false
  }
  for (const c of UG.cores) {
    const [cx, cz] = polar(c.angle, UG.coreR)
    if (Math.hypot(x - cx, z - cz) < 5 + margin) return false
  }
  if (Math.hypot(x - STAIR_BOTTOM[0], z - STAIR_BOTTOM[1]) < 7 + margin) return false
  return Math.hypot(x, z) >= 10
}
function zoneOf(x: number, z: number) {
  const deg = (((Math.atan2(x, -z) / DEG) % 360) + 360) % 360
  if (UG.cores.some((c) => { const [cx, cz] = polar(c.angle, UG.coreR); return Math.hypot(x - cx, z - cz) < 12 })) return 'disabled'
  if (deg > 140 && deg < 230) return 'visitor'
  if (deg > 40 && deg < 80) return 'ev'
  if (deg > 345 || deg < 20) return 'moto'
  if (deg > 285 && deg < 320) return 'bike'
  return 'staff'
}
const bays: { x: number; z: number; zone: string }[] = []
for (let x = -64; x <= 64; x += 2.7)
  for (const zr of [-58.5, -49.5, -40.5, -31.5, -22.5, -13.5, -4.5, 4.5, 13.5, 22.5, 31.5, 40.5, 49.5, 58.5])
    for (const off of [-2.6, 2.6]) {
      const z = zr + off
      if (Math.hypot(x, z) > UG.parkingRadius - 5 || !laneFree(x, z, 2.5)) continue
      bays.push({ x, z, zone: zoneOf(x, z) })
    }
const zoneCount = (zn: string) => bays.filter((b) => b.zone === zn).length
const ZONES: [string, string, string][] = [
  ['staff', 'Mitarbeitende', 'z-staff'],
  ['visitor', 'Besucher', 'z-visitor'],
  ['ev', 'E-Laden', 'z-ev'],
  ['disabled', 'Barrierefrei', 'z-dis'],
  ['moto', 'Motorräder', 'z-moto'],
  ['bike', 'Fahrräder', 'z-bike'],
]
function levelMinus2() {
  let g = `<rect class="earth" x="-235" y="-235" width="470" height="470"/>`
  for (const b of ORDER) g += bldPoly(b, 'bld ghost faint')
  g += `<circle class="park" cx="0" cy="0" r="${UG.parkingRadius}"/>`
  for (const b of bays) {
    const cls = ZONES.find((z) => z[0] === b.zone)![2]
    g += `<rect class="bay ${cls}" x="${b.x - 1.2}" y="${b.z - 2.3}" width="2.4" height="4.6"/>`
  }
  for (const c of plan.corridors) if (c.kind === 'car') g += poly(corridorPts(c), 'corr-car')
  for (const r of UG.ramps) {
    g += poly(rampCorners(r.angle), 'ramp')
    const [x, z] = polar(r.angle, UG.rampBottomR + UG.rampLen + 10)
    g += label(x, z, r.name, 'lbl small mid')
  }
  g += `<circle class="core" cx="0" cy="0" r="7"/>`
  for (const c of UG.cores) {
    const [x, z] = polar(c.angle, UG.coreR)
    g += `<rect class="elev ${c.plaza ? 'plaza' : ''}" x="${x - 1.5}" y="${z - 1.5}" width="3" height="3"/>`
  }
  {
    const rot = Math.PI - UG.stair.angle * DEG
    const [sx, sz] = polar(UG.stair.angle, UG.stair.rBottom)
    g += poly(rectPts(sx, sz, rot, -1.5, 1.5, 0, 7.8), 'stair')
  }
  g += `<g class="corr-ring ghostring" style="stroke-width:${UG.centralRing.w}">${arcPath(UG.centralRing.r)}</g>`
  g += northArrow(212, -208)
  g += scaleBar(-225, 220)
  return ns(g, '-235 -235 470 470', 'Grundriss Ebene –2 Tiefgarage')
}

// ------------------------------------------------------------------ 6 · network schematic
function schematic() {
  let g = ''
  g += `<g class="sch-ring">${arcPath(140)}</g><g class="sch-ring c">${arcPath(40)}</g>`
  for (const a of UG.axes) {
    const [x0, z0] = polar(a, 44)
    const [x1, z1] = polar(a, 136)
    g += `<line class="sch-axis" x1="${x0}" y1="${z0}" x2="${x1}" y2="${z1}"/>`
  }
  for (const c of plan.corridors) {
    if (c.kind !== 'spur') continue
    g += `<line class="sch-spur" x1="${c.sx}" y1="${c.sz}" x2="${c.sx + Math.sin(c.rot) * c.len}" y2="${c.sz + Math.cos(c.rot) * c.len}"/>`
    const b = BUILDINGS.find((x) => x.id === c.building)!
    g += `<g class="tag small"><circle cx="${c.sx}" cy="${c.sz}" r="5.5"/><text x="${c.sx}" y="${c.sz + 2}">${NUM.get(b.id)}</text></g>`
  }
  g += `<g class="tag"><circle cx="0" cy="0" r="9"/><text x="0" y="3.4">1</text></g>`
  return ns(g, '-215 -215 430 430', 'Schema der Gangstruktur: zentraler Ring, Kreuz, äußerer Ring', 'small')
}

// ------------------------------------------------------------------ 8 · monorail
function monorailPlan() {
  let g = `<rect class="grass" x="-200" y="-200" width="400" height="400"/>`
  g += `<circle class="plaza" cx="0" cy="0" r="${LAYOUT.plazaRadius}"/>`
  for (const b of ORDER) g += bldPoly(b, 'bld ghost')
  g += `<polyline class="mono big" points="${track.map((p) => p.join(',')).join(' ')} ${track[0].join(',')}"/>`
  for (const s of STATIONS) {
    const [x, z] = stationPos(s.angle)
    const [lx, lz] = polar(s.angle, LAYOUT.monorailRadius + 30)
    g += `<rect class="station big" x="${x - 6}" y="${z - 6}" width="12" height="12" transform="rotate(${s.angle} ${x} ${z})"/>`
    g += label(lx, lz, s.name, 'lbl small mid')
  }
  for (const b of ORDER) g += numTag(b, 6)
  g += northArrow(180, -175)
  return ns(g, '-200 -200 400 400', 'Monorail-Strecke mit Stationen')
}

// ------------------------------------------------------------------ 11 · section
function section() {
  // north (left) → south (right) along x = 0; vertical exaggeration 2×, HQ broken at 50 m
  const X0 = -215
  const X1 = 215
  const V = 2
  const Y = (y: number) => -y * V
  let g = ''
  g += `<rect class="earth" x="${X0}" y="${Y(0)}" width="${X1 - X0}" height="${Y(-14)}"/>`
  g += `<rect class="sky" x="${X0}" y="${Y(55)}" width="${X1 - X0}" height="${-Y(55) + Y(0)}"/>`
  const box = (z0: number, z1: number, y0: number, y1: number, cls: string) => `<rect class="${cls}" x="${Math.min(z0, z1)}" y="${Y(y1)}" width="${Math.abs(z1 - z0)}" height="${(y1 - y0) * V}"/>`
  // level –2 car park
  g += box(-UG.parkingRadius, UG.parkingRadius, LEVELS.parking.floorY, LEVELS.parking.ceilY, 'sec-park')
  // level –1 promenade pieces along the line
  const P = LEVELS.promenade
  const C = UG.centralRing
  const O = UG.outerRing
  for (const s of [-1, 1]) {
    g += box(s * (C.r - C.w / 2), s * (C.r + C.w / 2), P.floorY, P.ceilY, 'sec-prom')
    g += box(s * (C.r + C.w / 2), s * (O.r - O.w / 2), P.floorY, P.ceilY, 'sec-prom axis')
    g += box(s * (O.r - O.w / 2), s * (O.r + O.w / 2), P.floorY, P.ceilY, 'sec-prom')
  }
  g += box(6.85, C.r - C.w / 2, P.floorY, P.ceilY, 'sec-prom')
  // buildings on the section line: HQ, Holidays (north), Visitor Center (south)
  const hol = BUILDINGS.find((b) => b.id === 'holidays')!
  const vis = BUILDINGS.find((b) => b.id === 'visitor')!
  g += box(-24, 24, 0, 50, 'sec-bld hq')
  g += `<path class="break" d="M-26 ${Y(47)} L-8 ${Y(49.5)} L8 ${Y(46.5)} L26 ${Y(49)}"/>`
  g += label(0, Y(52), 'HQ · 22 Geschosse · ≈ 101 m (gekürzt)', 'lbl small mid')
  g += box(-7, 7, LEVELS.parking.floorY, 50, 'sec-core')
  g += box(hol.z - hol.d / 2, hol.z + hol.d / 2, 0, hol.floors * hol.floorH, 'sec-bld')
  g += label(hol.z, Y(hol.floors * hol.floorH + 2), 'Holidays', 'lbl small mid')
  g += box(vis.z - vis.d / 2, vis.z + vis.d / 2, 0, vis.floors * vis.floorH, 'sec-bld')
  g += label(vis.z, Y(vis.floors * vis.floorH + 2), 'Visitor Center', 'lbl small mid')
  // access corridors under the buildings
  for (const b of [hol, vis]) {
    const s = Math.sign(b.z)
    g += box(s * (O.r + O.w / 2), b.z - s * (b.d / 2 - 3), P.floorY, P.ceilY, 'sec-prom')
    g += box(b.z - s * (b.d / 2 - 3) - 1.5, b.z - s * (b.d / 2 - 3) + 1.5, P.floorY, b.floors * b.floorH, 'sec-lift')
  }
  // monorail (beam at 6 m) and stations
  for (const s of [-1, 1]) {
    g += box(s * 112 - 0.6, s * 112 + 0.6, 0, 4.7, 'sec-pylon')
    g += box(s * 112 - 14, s * 112 + 14, 4.7, 6, 'sec-beam')
    g += box(s * 112 - 9, s * 112 + 9, 6.2, 9.6, 'sec-train')
  }
  g += `<line class="ground" x1="${X0}" y1="0" x2="${X1}" y2="0"/>`
  // level labels
  g += label(X0 + 3, Y(P.floorY + 1.2), 'Ebene –1 Promenade (−5,0 m)', 'lbl tiny')
  g += label(X0 + 3, Y(LEVELS.parking.floorY + 1.2), 'Ebene –2 Tiefgarage (−9,5 m)', 'lbl tiny')
  g += label(X0 + 3, Y(1.5), '± 0,00 Gelände', 'lbl tiny')
  g += label(-112, Y(11.5), 'Monorail', 'lbl tiny mid')
  g += label(112, Y(11.5), 'Monorail', 'lbl tiny mid')
  g += label(-90, Y(-3.6), 'Achse Nord', 'lbl tiny mid')
  g += label(90, Y(-3.6), 'Achse Süd', 'lbl tiny mid')
  g += label(X0 + 3, Y(54), 'Nord', 'lbl small')
  g += label(X1 - 22, Y(54), 'Süd', 'lbl small')
  return ns(g, `${X0} ${Y(56)} ${X1 - X0} ${Y(-14) - Y(56)}`, 'Schematischer Schnitt Nord–Süd durch den Campus (Höhen 2-fach überhöht)', 'wide')
}

// ------------------------------------------------------------------ tables
const floorsOf = (b: BuildingInfo) => {
  if (b.kind === 'hq') return null
  if (b.tenants) return businessProgram(b.tenants)
  return PROGRAMS[b.id] ?? null
}
function useLabel(b: BuildingInfo) {
  return b.kind === 'hq' ? 'Holding' : b.kind === 'hotel' ? 'Hotel' : b.id === 'cafe' ? 'Café' : b.id === 'visitor' ? 'Besucher & Lernen' : b.id === 'media' ? 'Produktion' : b.tenants ? 'Mietflächen' : 'Unternehmens-HQ'
}
function arrangementTable() {
  const rows = ORDER.map((b) => {
    const h = b.kind === 'hq' ? 101 : b.floors * b.floorH
    const where = b.kind === 'hq' ? 'Zentrum' : `${f1(b.angle)}° · ${f1(b.radius)} m ${b.radius > 140 ? '(äußerer Ring)' : '(am HQ-Platz)'}`
    return `<tr><td class="num">${NUM.get(b.id)}</td><td>${esc(nameOf(b))}</td><td>${useLabel(b)}</td><td class="mono">${where}</td><td class="mono r">${b.kind === 'hq' ? 'Ø 48' : `${b.w} × ${b.d}`}</td><td class="mono r">${b.floors}</td><td class="mono r">${f1(h)} m</td></tr>`
  }).join('')
  return `<div class="tablewrap"><table><thead><tr><th>Nr.</th><th>Gebäude</th><th>Nutzung</th><th>Lage (Kompass · Abstand HQ)</th><th class="r">Grundfläche m</th><th class="r">Geschosse</th><th class="r">Höhe</th></tr></thead><tbody>${rows}</tbody></table></div>`
}
function functionCards() {
  return `<div class="cards">${ORDER.map((b) => `<article class="card"><header><span class="badge">${NUM.get(b.id)}</span><h3>${esc(nameOf(b))}</h3></header><p>${esc(b.description)}</p></article>`).join('')}</div>`
}
function accessTable() {
  const spurs = plan.corridors.filter((c) => c.kind === 'spur' || c.kind === 'hq')
  const rows = ORDER.map((b) => {
    const c = spurs.find((s) => s.building === b.id)
    const fl = floorsOf(b)
    const stops = b.surfaceOnly ? ['EG', '1. OG (Treppe)'] : b.kind === 'hq' ? ['UG', 'EG', ...HQ_FLOORS.map((f) => `${f.level}. OG`), 'Dach'] : ['UG', ...(fl ?? []).map((f) => f.label.split(' ').slice(0, f.label.startsWith('EG') ? 1 : 2).join(' '))]
    const ring = b.surfaceOnly ? 'nur oberirdisch (HQ-Platz)' : b.kind === 'hq' ? 'Zentraler Ring (Süd)' : b.radius > 140 ? 'Äußerer Ring' : 'Zentraler Ring'
    const control = b.kind === 'subsidiary' || b.kind === 'hq' ? 'Drehsperren · Mitarbeiterausweis / Besucherausweis' : b.kind === 'hotel' ? 'Hotelgäste & Mitarbeitende' : 'Öffentlich zugänglich'
    return `<tr><td class="num">${NUM.get(b.id)}</td><td>${esc(shortName(b) === b.suffix ? 'Big Apple ' + b.suffix : shortName(b))}</td><td>${ring}</td><td class="mono r">${c ? f1(c.len) + ' m' : '–'}</td><td class="mono">${stops.join(' · ')}</td><td>${b.surfaceOnly ? 'Freistehende Treppe' : b.kind === 'hq' ? 'Aufzug (Treppe Lobby ↔ Galerie)' : 'Aufzug + Treppenhaus'}</td><td>${control}</td></tr>`
  }).join('')
  const cores = UG.cores.map((c) => `<tr><td class="num">K${UG.cores.indexOf(c) + 1}</td><td>Aufzugskern ${f1(c.angle)}°</td><td>Zentraler Ring</td><td class="mono r">–</td><td class="mono">${c.plaza ? '–2 · –1 · HQ-Platz' : '–2 · –1'}</td><td>${c.plaza ? 'Glaslift' : 'Aufzug'}</td><td>Öffentlich</td></tr>`).join('')
  const stair = `<tr><td class="num">T</td><td>Treppenhaus ${UG.stair.angle}°</td><td>Zentraler Ring</td><td class="mono r">–</td><td class="mono">–2 · –1</td><td>Treppe</td><td>Öffentlich</td></tr>`
  return `<div class="tablewrap"><table><thead><tr><th>Nr.</th><th>Gebäude / Kern</th><th>Anschluss</th><th class="r">Zugang</th><th>Aufzug-Halte</th><th>Vertikal</th><th>Zugangskontrolle</th></tr></thead><tbody>${rows}${cores}${stair}</tbody></table></div>`
}
function stationTable() {
  const rows = [...STATIONS].sort((a, b) => a.angle - b.angle).map((s) => {
    const [x, z] = stationPos(s.angle)
    const near = BUILDINGS.filter((b) => b.kind !== 'hq').map((b) => ({ b, d: Math.hypot(b.x - x, b.z - z) })).sort((p, q) => p.d - q.d).slice(0, 3)
    return `<tr><td>${esc(s.name)}</td><td class="mono r">${s.angle}°</td><td>${near.map(({ b, d }) => `${esc(shortName(b) === b.suffix ? b.suffix : shortName(b))} <span class="mono">${f1(d)} m</span>`).join(' · ')}</td></tr>`
  }).join('')
  const len = track.reduce((acc, p, i) => acc + Math.hypot(p[0] - track[(i + 1) % track.length][0], p[1] - track[(i + 1) % track.length][1]), 0)
  return `<p class="note">Rundkurs ≈ ${f1(len)} m auf ${LAYOUT.monorailRadius} m Radius, Fahrbahn auf 6 m Höhe, 3-Wagen-Zug, Halt ca. 16 s, Umlauf ca. 2 Minuten. Keine Brücken oder Stege zwischen den Gebäuden – nur die Monorail-Trasse und die Stationen.</p>
  <div class="tablewrap"><table><thead><tr><th>Station</th><th class="r">Lage</th><th>Nächste Gebäude (Luftlinie)</th></tr></thead><tbody>${rows}</tbody></table></div>`
}
function roomLists() {
  return ORDER.map((b) => {
    let floors = ''
    if (b.kind === 'hq') {
      const fixed = [
        ['EG – Lobby', ['Empfang & Empfangstresen', 'Big Apple Groups Logowand', 'Besucherregistrierung', 'Sitzbereiche', 'Informationsbildschirme', 'Aufzüge & Wendeltreppe', 'Zugang Ebene –1 (Aufzug)']],
        ['1. OG – Galerie', ['Mitarbeiter-Café', 'Lounge', 'Besprechungsboxen']],
      ] as const
      floors += fixed.map(([fl, rs]) => `<div class="floor"><h4>${fl}</h4><ul>${rs.map((r) => `<li><span>${r}</span></li>`).join('')}</ul></div>`).join('')
      floors += HQ_FLOORS.map((f) => `<div class="floor"><h4>${esc(f.label)}</h4><ul>${f.rooms.map((r) => `<li><span>${esc(r.name)}</span><em>${esc(FURNITURE[r.kind] ?? '')}</em></li>`).join('')}</ul></div>`).join('')
      floors += `<div class="floor"><h4>Dach</h4><ul><li><span>Dachterrasse</span><em>Holzdeck, Pflanzinseln, Lounges, Bänke, Panorama-Fernrohr</em></li></ul></div>`
    } else {
      const fl = floorsOf(b) ?? []
      floors = fl.map((f) => `<div class="floor"><h4>${esc(f.label)}</h4><ul>${f.rooms.filter((r) => r.kind !== 'empty').map((r) => `<li><span>${esc(r.name)}</span><em>${esc(FURNITURE[r.kind] ?? '')}</em></li>`).join('')}</ul></div>`).join('')
      if (!b.surfaceOnly) floors += `<div class="floor ug"><h4>Ebene –1</h4><ul><li><span>Foyer mit Aufzug, Treppe und Zugangskontrolle</span><em>Anschluss an die Campus-Promenade</em></li></ul></div>`
      if (b.floors > fl.length) floors += `<p class="note">Weitere ${b.floors - fl.length} Obergeschosse: Büroflächen (in der 3D-Welt nur von außen sichtbar).</p>`
    }
    return `<details class="bld-rooms" ${b.kind === 'hq' ? 'open' : ''}><summary><span class="badge">${NUM.get(b.id)}</span>${esc(nameOf(b))}</summary><p class="concept">${esc(CONCEPTS[b.id] ?? '')}</p><div class="floors">${floors}</div></details>`
  }).join('')
}

// ------------------------------------------------------------------ figures
const totals = (() => {
  const prom = plan.corridors.filter((c) => c.level === 'promenade')
  const ringLen = 2 * Math.PI * (UG.centralRing.r + UG.outerRing.r)
  const axisLen = prom.filter((c) => c.kind === 'axis').reduce((a, c) => a + c.len, 0)
  const spurLen = prom.filter((c) => c.kind === 'spur' || c.kind === 'hq').reduce((a, c) => a + c.len, 0)
  const beltLen = prom.filter((c) => c.kind === 'axis').reduce((a, c) => a + Math.floor((c.len - 30) / 28) * 24 * 2, 0)
  return { ringLen, axisLen, spurLen, beltLen, bays: bays.length }
})()

const legend = (items: [string, string][]) => `<ul class="legend">${items.map(([cls, t]) => `<li><i class="${cls}"></i>${esc(t)}</li>`).join('')}</ul>`

// ------------------------------------------------------------------ page
const app = document.getElementById('app')!
app.innerHTML = `
<header class="top">
  <div class="brand"><span class="b">Big</span> <span class="a">Apple</span> <span class="b">Groups</span></div>
  <div class="titles">
    <p class="eyebrow">Global Campus Amsterdam · überarbeiteter Masterplan</p>
    <h1>Campus Masterplan 2.0</h1>
    <p class="lead">Gebäudeaufteilung, Innenarchitektur und unterirdisches Verbindungssystem. Alle Pläne werden direkt aus denselben Daten erzeugt wie die begehbare 3D-Welt – Lage, Maße, Räume und Wege stimmen überein.</p>
  </div>
  <dl class="kpis">
    <div><dt>Gebäude</dt><dd>${ORDER.length}</dd></div>
    <div><dt>Ringe Ebene –1</dt><dd>${f1(totals.ringLen)} m</dd></div>
    <div><dt>Achsen + Zugänge</dt><dd>${f1(totals.axisLen + totals.spurLen)} m</dd></div>
    <div><dt>Fahrsteige</dt><dd>${f1(totals.beltLen)} m</dd></div>
    <div><dt>Stellplätze Ebene –2</dt><dd>≈ ${totals.bays}</dd></div>
  </dl>
  <nav class="toc">
    <a href="#lageplan">1 Lageplan</a><a href="#anordnung">2 Gebäudeanordnung</a><a href="#funktionen">3 Funktionen</a><a href="#ebene1">4 Ebene –1</a><a href="#ebene2">5 Ebene –2</a><a href="#struktur">6 Gangstruktur</a><a href="#zugaenge">7 Zugänge & Aufzüge</a><a href="#monorail">8 Monorail</a><a href="#innen">9 Innenraumkonzepte & 10 Raumlisten</a><a href="#schnitt">Schnitt</a>
  </nav>
</header>
<main>
  <section id="lageplan"><h2><span>1</span>Gesamt-Lageplan</h2>
    <div class="figure two"><div>${sitePlan()}</div><div class="side">
      <p>Das runde Holding-HQ (1) steht im Zentrum auf dem HQ-Platz. Die Unternehmensgebäude liegen auf einem äußeren Ring (≈ 178 m) zwischen Feuerwehrzufahrt und Ringstraße; kleinere Häuser (Racing, Café, Hotels HQ, Foundation) stehen frei am HQ-Platz. Health & Recovery Center (${NUM.get('health')}) und Fitness HQ (${NUM.get('fitness')}) liegen nebeneinander auf dem äußeren Ring. Das Big Apple Hotel (${NUM.get('hotel')}) liegt am Rand nahe der Haupteinfahrt.</p>
      ${legend([['l-bld', 'Gebäude'], ['l-hq', 'Holding-HQ'], ['l-mono', 'Monorail & Stationen'], ['l-road', 'Ringstraße'], ['l-fire', 'Feuerwehrzufahrt'], ['l-bike', 'Radweg'], ['l-ramp', 'Garagenrampen'], ['l-water', 'Campussee']])}
    </div></div>
  </section>
  <section id="anordnung"><h2><span>2</span>Gebäudeanordnung</h2>${arrangementTable()}</section>
  <section id="funktionen"><h2><span>3</span>Gebäude und Funktionen</h2>${functionCards()}
    <p class="note strong">Big Apple Fitness (${NUM.get('fitness')}) ist reines Unternehmens-Headquarter ohne Fitnessstudio. Das Fitnessstudio, Gesundheits- und Recovery-Angebot liegt ausschließlich in Big Apple Health & Recovery (${NUM.get('health')}). Big Apple Hotels hat ein eigenes Headquarter (${NUM.get('hotels')}) und zusätzlich das eigenständige Big Apple Hotel (${NUM.get('hotel')}).</p>
  </section>
  <section id="ebene1"><h2><span>4</span>Grundriss Ebene –1 · Campus-Promenade</h2>
    <div class="figure two"><div>${levelMinus1()}</div><div class="side">
      <p>Breite, helle Fußgängerebene auf −5,0 m (lichte Höhe 3,6 m): zentraler Ring (8 m) um das HQ, vier gerade Achsen (10 m) in Kreuzform, äußerer Ring (8 m) einmal um den Campus. Jedes Gebäude hat einen Zugang (6 m) mit Foyer, Aufzug, Treppe und – bei Unternehmensgebäuden – Drehsperren.</p>
      <p>Fahrsteige nur auf den vier Achsen (je 2 × 2 Segmente à 24 m, gegenläufig), normale Gehwege bleiben daneben. An jeder Achse ein Coffee Point (grün) und eine Sitznische (hell); entlang der Ringe Bänke, Pflanzen und digitale Wegweiser. Ausstattung: Natursteinboden, helle Decken, Holzlamellen, dezente Lichtlinien, Glasfronten an den Coffee Points.</p>
      ${legend([['l-corr', 'Promenade (Ringe, Achsen)'], ['l-spur', 'Zugänge zu den Gebäuden'], ['l-foyer', 'Gebäudefoyer Ebene –1'], ['l-belt', 'Fahrsteige'], ['l-coffee', 'Coffee Point'], ['l-lounge', 'Sitznische'], ['l-elev', 'Aufzug'], ['l-stair', 'Treppe zur Tiefgarage']])}
    </div></div>
  </section>
  <section id="ebene2"><h2><span>5</span>Grundriss Ebene –2 · Tiefgarage</h2>
    <div class="figure two"><div>${levelMinus2()}</div><div class="side">
      <p>Runde Tiefgarage auf −9,5 m unter dem Zentralbereich (Radius ${UG.parkingRadius} m), baulich getrennt von der Promenade. Zwei Ein- und Ausfahrten (Ost und Süd) über Rampen von der Ringstraße und Zufahrtstunnel. Fußgänger erreichen die Promenade nur über vier Aufzugskerne und ein Treppenhaus; zwei Kerne fahren als Glaslift weiter bis auf den HQ-Platz.</p>
      <div class="tablewrap"><table class="compact"><thead><tr><th>Bereich</th><th class="r">Stellplätze</th></tr></thead><tbody>
      ${ZONES.map(([z, n, cls]) => `<tr><td><i class="sw ${cls}"></i>${n}</td><td class="mono r">${zoneCount(z)}</td></tr>`).join('')}
      <tr class="sum"><td>Summe Stellflächen</td><td class="mono r">${bays.length}</td></tr></tbody></table></div>
      <p class="note">E-Laden: Ladesäulen an jedem Stellplatz des grünen Bereichs. Barrierefreie Plätze direkt an den Aufzugskernen. Beschilderung, Beleuchtung und Sicherheits­system über die gesamte Fläche.</p>
    </div></div>
  </section>
  <section id="struktur"><h2><span>6</span>Kreisförmige und kreuzförmige Gangstruktur</h2>
    <div class="figure two"><div>${schematic()}</div><div class="side">
      <ol class="steps">
        <li><b>Zentraler Ring</b> um das HQ (Ø ${UG.centralRing.r * 2} m, ${f1(2 * Math.PI * UG.centralRing.r)} m Umfang) – direkter Anschluss des HQ-Aufzugs.</li>
        <li><b>Vier Achsen</b> nach Nord, Ost, Süd und West (je ${f1(plan.corridors.find((c) => c.kind === 'axis')!.len)} m) – Hauptwege mit Fahrsteigen.</li>
        <li><b>Äußerer Ring</b> (Ø ${UG.outerRing.r * 2} m, ${f1(2 * Math.PI * UG.outerRing.r)} m) – einmal um den gesamten Campus.</li>
        <li><b>Zugänge</b> zu jedem Gebäude: vom äußeren Ring zu den Gebäuden am Rand, vom zentralen Ring zu den Häusern am HQ-Platz.</li>
      </ol>
      <p class="note">Weg vom HQ zum entferntesten Gebäude: ca. 4–5 Minuten zu Fuß, mit Fahrsteig rund 1 Minute schneller.</p>
    </div></div>
  </section>
  <section id="zugaenge"><h2><span>7</span>Zugänge und Aufzüge</h2>${accessTable()}</section>
  <section id="monorail"><h2><span>8</span>Monorail-Strecke</h2>
    <div class="figure two"><div>${monorailPlan()}</div><div class="side">${stationTable()}</div></div>
  </section>
  <section id="innen"><h2><span>9·10</span>Innenraumkonzepte, Räume und Einrichtung</h2>
    <p class="note">Gemeinsames Designsystem: Glas, Naturstein, Holz und Metall; Schwarz, Weiß, Grau mit Apple Green als Akzent; moderne Schreibtische, ergonomische Stühle, integrierte Bildschirme, Lounges, Pflanzen und akustische Trennwände. Jedes Gebäude hat eine eigene Atmosphäre und bleibt erkennbar Teil der Big-Apple-Markenfamilie.</p>
    ${roomLists()}
  </section>
  <section id="schnitt"><h2><span>⟂</span>Schematischer Schnitt</h2>
    <div class="figure">${section()}</div>
    <p class="note">Übereinander: Gebäude und Monorail (oberirdisch) · Campus-Promenade Ebene –1 (−5,0 bis −1,4 m) · Tiefgarage Ebene –2 (−9,5 bis −5,8 m). Höhen 2-fach überhöht, HQ gekürzt dargestellt.</p>
  </section>
</main>
<footer class="foot">Big Apple Global Campus Amsterdam · Masterplan 2.0 · erzeugt aus den Daten der 3D-Welt</footer>
`
