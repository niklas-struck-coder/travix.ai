/**
 * Master plan of the Big Apple Global Campus (Amsterdam).
 * Units: metres. x = east, z = south, y = up. Origin = centre of the HQ tower.
 * Compass angles: 0° = north (-z), 90° = east (+x), clockwise.
 */

export const DEG = Math.PI / 180

export const LAYOUT = {
  hqRadius: 24,
  plazaRadius: 72,
  monorailRadius: 112,
  bikeRingRadius: 128,
  fireLaneRadius: 138,
  buildingRingRadius: 178,
  ringRoadRadius: 250,
  ringRoadWidth: 13,
  worldHalf: 430,
  canalZ: -300, // canal (gracht) along the north edge
  boulevardHalf: 8,
}

/** compass angle → position on a circle */
export function polar(angleDeg: number, r: number): [number, number] {
  const a = angleDeg * DEG
  return [Math.sin(a) * r, -Math.cos(a) * r]
}
/** rotation (around Y) for an object at compass angle whose local +z should face the centre */
export function faceCentre(angleDeg: number) {
  return -angleDeg * DEG
}

export type FacadeStyle =
  | 'tech'
  | 'finance'
  | 'fitness'
  | 'logistics'
  | 'mobility'
  | 'hotels'
  | 'holidays'
  | 'entertainment'
  | 'trains'
  | 'foundation'
  | 'campushotel'
  | 'conference'
  | 'racing'
  | 'health'
  | 'business'
  | 'media'

export interface BuildingInfo {
  id: string
  name: string
  suffix: string // word replacing "Groups" in the logo
  description: string
  angle: number // compass angle on the building ring
  radius: number
  w: number // width (along facade)
  d: number // depth
  floors: number // total floors (visual)
  floorH: number
  style?: FacadeStyle
  kind: 'hq' | 'subsidiary' | 'hotel' | 'service'
  /** small companies housed in a business center: [floor, name, field] */
  tenants?: [string, string, string][]
  // computed
  x: number
  z: number
  rot: number
}

type Raw = Omit<BuildingInfo, 'x' | 'z' | 'rot'>

const raw: Raw[] = [
  {
    id: 'hq', name: 'Big Apple Groups Headquarters', suffix: 'Groups', kind: 'hq',
    description: 'Holding-Zentrale: ausschließlich Unternehmensführung und gruppenweite Verwaltung – Chairman Office, Group Management, Vorstand, Strategy, Finance & Controlling, Legal & Compliance, HR, International Business Development, M&A, Communications, IT- und Konzernverwaltung. 22 Etagen, Dachterrasse.',
    angle: 0, radius: 0, w: 48, d: 48, floors: 22, floorH: 4.5,
  },
  // ---- outer building ring (r ≈ 178)
  {
    id: 'holidays', name: 'Big Apple Holidays', suffix: 'Holidays', kind: 'subsidiary', style: 'holidays',
    description: 'Zentrale des Reisegeschäfts: Reiseproduktentwicklung, Destination Management, Partnerschaften, Marketing, Kundenservice-Management, Reiseplanung, Tavium-KI-Projektteam und digitale Produktentwicklung.',
    angle: 2, radius: 178, w: 46, d: 30, floors: 5, floorH: 4.2,
  },
  {
    id: 'trains', name: 'Big Apple Trains', suffix: 'Trains', kind: 'subsidiary', style: 'trains',
    description: 'Verwaltungs- und Betriebszentrale des Eisenbahnunternehmens: Betriebsleitstelle, Betriebs- und Fahrplanplanung, Streckenplanung, Zugdesign. Keine Werkstatt, kein Bahnhof.',
    angle: 32, radius: 178, w: 54, d: 28, floors: 3, floorH: 4.6,
  },
  {
    id: 'tech', name: 'Big Apple Tech', suffix: 'Tech', kind: 'subsidiary', style: 'tech',
    description: 'Technologie- und Entwicklungszentrale der Gruppe: Software-, KI-, Produkt- und Plattformentwicklung, UX/UI-Design, IT-Infrastruktur, Cybersecurity, Testlabore.',
    angle: 68, radius: 178, w: 62, d: 36, floors: 6, floorH: 4.2,
  },
  {
    id: 'finance', name: 'Big Apple Finance', suffix: 'Finance', kind: 'subsidiary', style: 'finance',
    description: 'Unternehmenszentrale von Big Apple Finance (keine Bankfiliale): Finanzstrategie, Fintech, Zahlungsverkehr, Investment- und Marktanalyse, Risikomanagement, Compliance.',
    angle: 106, radius: 178, w: 46, d: 32, floors: 7, floorH: 4.2,
  },
  {
    id: 'mobility', name: 'Big Apple Mobility', suffix: 'Mobility', kind: 'subsidiary', style: 'mobility',
    description: 'Verwaltungs- und Produktzentrale der Mobilitätssparte: Flottenmanagement, Produkt- und App-Entwicklung, Wartungsmanagement, Standortplanung. Kleine Fahrzeugpräsentation, keine Werkstatt.',
    angle: 143, radius: 178, w: 44, d: 30, floors: 4, floorH: 4.2,
  },
  {
    id: 'visitor', name: 'Big Apple Visitor Center', suffix: 'Visitor Center', kind: 'service', style: 'conference',
    description: 'Besucher- und Lernzentrum: Besucherempfang, Big Apple Museum, Learning Center mit Lern- und Schulungsräumen, Bibliothek, Café und Campusausstellung. Nur wenige kleine Besprechungsräume.',
    angle: 180, radius: 170, w: 70, d: 40, floors: 2, floorH: 5,
  },
  {
    id: 'hotel', name: 'Big Apple Hotel', suffix: 'Hotel', kind: 'hotel', style: 'campushotel',
    description: 'Eigenständiges, mittelgroßes Hotel am Rand des Campus: Lobby mit Rezeption, Restaurant mit Frühstücksbereich, Bar, Terrasse, Fitness, Besprechungsräume, Standard- und Superiorzimmer, wenige Suiten.',
    angle: 208, radius: 206, w: 34, d: 44, floors: 7, floorH: 3.4,
  },
  {
    id: 'health', name: 'Big Apple Health & Recovery', suffix: 'Health & Recovery', kind: 'subsidiary', style: 'health',
    description: 'Gesundheits-, Fitness- und Regenerationszentrum für alle Mitarbeitenden: Fitnessstudio (Kraft, Cardio, Functional, Freihantel, Geräte, Personal Training, Gruppenkurse), Health-Bereich mit Physiotherapie und Recovery mit Massage, Mobility und Ruhebereich.',
    angle: 256, radius: 178, w: 56, d: 36, floors: 3, floorH: 4.6,
  },
  {
    id: 'logistics', name: 'Big Apple Logistics', suffix: 'Logistics', kind: 'subsidiary', style: 'logistics',
    description: 'Verwaltungs- und Steuerungszentrale: Leitstelle, Transport- und Supply-Chain-Planung, Flottenmanagement, Disposition, Datenanalyse. Keine Lagerhalle auf dem Campus.',
    angle: 290, radius: 180, w: 52, d: 34, floors: 3, floorH: 4.6,
  },
  {
    id: 'entertainment', name: 'Big Apple Entertainment', suffix: 'Entertainment', kind: 'subsidiary', style: 'entertainment',
    description: 'Zentrale für Film, Serien und Unterhaltung: Film- und Serienentwicklung, Produktionsplanung, Redaktion, Marketing, Schnittplätze, kleine Studios, Vorführraum.',
    angle: 320, radius: 178, w: 44, d: 32, floors: 4, floorH: 4.6,
  },
  {
    id: 'media', name: 'Big Apple Media Center', suffix: 'Media Center', kind: 'service', style: 'media',
    description: 'Professionelles Medien- und Produktionszentrum: Film- und TV-Studio, Nachrichtenstudio, Podcast- und Tonstudios, Regieräume, Schnittplätze, Fotostudio, Make-up, Technik und kleine Vorführräume.',
    angle: 341, radius: 180, w: 44, d: 30, floors: 2, floorH: 6,
  },
  {
    id: 'bc1', name: 'Big Apple Business Center I', suffix: 'Business Center', kind: 'service', style: 'business',
    description: 'Haus für Big-Apple-Unternehmen, die (noch) kein eigenes Gebäude haben. Mieterverzeichnis am Eingang und in der Lobby.',
    angle: 232, radius: 178, w: 34, d: 28, floors: 4, floorH: 4.2,
    tenants: [
      ['EG', 'Big Apple Pay', 'Bezahldienste & Wallet'],
      ['EG', 'Big Apple Insurance', 'Versicherungen'],
      ['1. OG', 'Big Apple Energy', 'Grüne Energie & Ladeinfrastruktur'],
      ['1. OG', 'Big Apple Real Estate', 'Immobilien & Campus-Entwicklung'],
      ['1. OG', 'Big Apple Ventures', 'Beteiligungen & Start-ups'],
      ['2. OG', 'Big Apple Academy', 'Weiterbildung & Trainee-Programme'],
      ['2. OG', 'Big Apple Food & Catering', 'Gastronomie & Kantinen'],
    ],
  },
  {
    id: 'bc2', name: 'Big Apple Business Center II', suffix: 'Business Center', kind: 'service', style: 'business',
    description: 'Zweites Haus für kleinere Big-Apple-Unternehmen und neue Gründungen, mit Coworking-Fläche. Mieterverzeichnis am Eingang und in der Lobby.',
    angle: 160, radius: 180, w: 28, d: 26, floors: 3, floorH: 4.2,
    tenants: [
      ['EG', 'Big Apple Security', 'Sicherheit & Gebäudetechnik'],
      ['EG', 'Big Apple Consulting', 'Beratung'],
      ['EG', 'Coworking', 'Fläche für neue Unternehmen'],
      ['1. OG', 'Big Apple Sports', 'Sport & Events'],
      ['1. OG', 'Big Apple Media Lab', 'Content & Social Media'],
    ],
  },
  // ---- inner ring around the HQ plaza (r ≈ 90)
  {
    id: 'racing', name: 'Big Apple Groups Racing', suffix: 'Groups Racing', kind: 'subsidiary', style: 'racing',
    description: 'Formel-1-Team der Big Apple Groups: F1-Showroom mit Rennwagen, Rennsimulatoren, Race Control & Telemetrie, Aerodynamik und Engineering.',
    angle: 50, radius: 90, w: 44, d: 26, floors: 3, floorH: 4.6,
  },
  {
    id: 'fitness', name: 'Big Apple Fitness', suffix: 'Fitness', kind: 'subsidiary', style: 'fitness',
    description: 'Unternehmens-Headquarter der internationalen Fitnesskette – reines Bürogebäude ohne Fitnessstudio: Club Operations, Standortentwicklung, Trainer- und Personalverwaltung, Marketing, Qualitätsmanagement, Franchise & Expansion.',
    angle: 124, radius: 90, w: 36, d: 24, floors: 3, floorH: 4.2,
  },
  {
    id: 'hotels', name: 'Big Apple Hotels Headquarters', suffix: 'Hotels', kind: 'subsidiary', style: 'hotels',
    description: 'Verwaltungszentrale der Hotelkette (nicht das Hotel): Hotelmanagement, Operations, Revenue Management, Standort- und Konzeptentwicklung, Musterzimmer und Material- & Designausstellung.',
    angle: 222, radius: 90, w: 34, d: 24, floors: 4, floorH: 4.2,
  },
  {
    id: 'foundation', name: 'Big Apple Foundation', suffix: 'Foundation', kind: 'subsidiary', style: 'foundation',
    description: 'Ruhiges, offenes Stiftungsgebäude am Campussee: Stiftungsmanagement, Projektbüros, Fördermittelverwaltung, Beratung, kleiner Veranstaltungsraum und Projektausstellung.',
    angle: 308, radius: 90, w: 34, d: 24, floors: 2, floorH: 4.4,
  },
]

export const BUILDINGS: BuildingInfo[] = raw.map((b) => {
  const [x, z] = b.radius === 0 ? [0, 0] : polar(b.angle, b.radius)
  return { ...b, x, z, rot: faceCentre(b.angle) }
})

const SHORT: Record<string, string> = {
  hq: 'HQ', hotel: 'Big Apple Hotel', bc1: 'Business Center I', bc2: 'Business Center II', hotels: 'Hotels HQ', racing: 'Racing (F1)', health: 'Health & Recovery', visitor: 'Visitor Center', media: 'Media Center',
}
/** short label for maps, signs and the location display */
export const shortName = (b: { id: string; suffix: string }) => SHORT[b.id] ?? b.suffix

export const buildingById = (id: string) => BUILDINGS.find((b) => b.id === id)!

/** Monorail stations (compass angle on the monorail ring) */
export const STATIONS = [
  { id: 's-hq', name: 'Holding HQ / Visitor Center', angle: 180 },
  { id: 's-fin', name: 'Finance · Mobility', angle: 122 },
  { id: 's-tech', name: 'Tech · Trains', angle: 52 },
  { id: 's-hol', name: 'Holidays · Media Center · Entertainment', angle: 338 },
  { id: 's-log', name: 'Logistics · Health & Recovery · Hotel', angle: 262 },
]

/** campus lake (Campussee) */
export const LAKE = (() => {
  const [x, z] = polar(272, 92)
  return { x, z, r: 22 }
})()

/* ===========================================================================
 * Underground (two separated levels)
 *   Ebene –1  Campus-Promenade (pedestrians): central ring around the HQ, four
 *             straight axes in a cross (N/E/S/W), outer ring; every building has
 *             a short access corridor ("Zugang") to one of the rings.
 *   Ebene –2  Tiefgarage (cars) below the central area, two ramps; connected to
 *             Ebene –1 only by elevator cores and one stair – no mixing.
 * ======================================================================== */

export const LEVELS = {
  promenade: { floorY: -5, ceilY: -1.4, label: 'Ebene –1 · Campus-Promenade' },
  parking: { floorY: -9.5, ceilY: -5.8, label: 'Ebene –2 · Tiefgarage' },
}

export const UG = {
  centralRing: { r: 40, w: 8 }, // walls at r 36 / 44
  outerRing: { r: 140, w: 8 }, // walls at r 136 / 144
  axes: [0, 90, 180, 270],
  axisNames: ['Achse Nord', 'Achse Ost', 'Achse Süd', 'Achse West'],
  axisWidth: 10,
  spurWidth: 6,
  parkingRadius: 68,
  coreR: 31.5,
  cores: [
    { angle: 45, plaza: true },
    { angle: 135, plaza: false },
    { angle: 225, plaza: true },
    { angle: 315, plaza: false },
  ],
  stair: { angle: 330, rBottom: 12 },
  ramps: [
    { id: 'east', name: 'Ein-/Ausfahrt Ost', angle: 88 },
    { id: 'south', name: 'Ein-/Ausfahrt Süd', angle: 197 },
  ],
  rampBottomR: 186,
  rampLen: 60,
  rampWidth: 8.4,
}

export type CorridorKind = 'axis' | 'spur' | 'hq' | 'core' | 'stair' | 'car'
export interface Corridor {
  id: string
  name: string
  kind: CorridorKind
  /** start point (world), direction = (sin rot, cos rot), length */
  sx: number
  sz: number
  rot: number
  len: number
  width: number
  level: 'promenade' | 'parking'
  /** building id for access corridors */
  building?: string
}

/** largest t with |p + t·d| = R (leaving the circle) or smallest (entering) */
function circleT(px: number, pz: number, dx: number, dz: number, R: number): [number, number] | null {
  const b = px * dx + pz * dz
  const c = px * px + pz * pz - R * R
  const disc = b * b - c
  if (disc < 0) return null
  const s = Math.sqrt(disc)
  return [-b - s, -b + s]
}

/** door of the generic building elevator (local -2.6, -d/2 + 3) in world coordinates */
export function elevatorDoor(b: BuildingInfo): [number, number] {
  const lx = -2.6
  const lz = -b.d / 2 + 3.0
  return [b.x + lx * Math.cos(b.rot) + lz * Math.sin(b.rot), b.z - lx * Math.sin(b.rot) + lz * Math.cos(b.rot)]
}

let _plan: ReturnType<typeof makePlan> | null = null
export function undergroundPlan() {
  if (!_plan) _plan = makePlan()
  return _plan
}

function makePlan() {
  const C = UG.centralRing
  const O = UG.outerRing
  const out: Corridor[] = []
  const outward = (a: number) => Math.PI - a * DEG // rot whose direction points away from the centre
  // cross axes from the central ring to the outer ring
  UG.axes.forEach((a, i) => {
    const r0 = C.r + C.w / 2 - 0.5
    const r1 = O.r - O.w / 2 + 0.5
    const [sx, sz] = polar(a, r0)
    out.push({ id: `axis-${a}`, name: UG.axisNames[i], kind: 'axis', sx, sz, rot: outward(a), len: r1 - r0, width: UG.axisWidth, level: 'promenade' })
  })
  // HQ connector: from the HQ elevator door southwards to the central ring
  {
    const sx = 0
    const sz = 6.85
    const t = circleT(sx, sz, 0, 1, C.r - C.w / 2)!
    out.push({ id: 'hq', name: 'Zugang Big Apple Groups HQ', kind: 'hq', sx, sz, rot: 0, len: t[1] + 0.6, width: 7, level: 'promenade', building: 'hq' })
  }
  // access corridors ("Zugänge") from every building elevator to the nearest ring
  for (const b of BUILDINGS) {
    if (b.kind === 'hq') continue
    const [sx, sz] = elevatorDoor(b)
    const dx = Math.sin(b.rot)
    const dz = Math.cos(b.rot)
    const wallR = b.radius > O.r ? O.r + O.w / 2 : C.r + C.w / 2
    const t = circleT(sx, sz, dx, dz, wallR)!
    out.push({ id: `spur-${b.id}`, name: `Zugang ${b.name}`, kind: 'spur', sx, sz, rot: b.rot, len: t[0] + 0.6, width: UG.spurWidth, level: 'promenade', building: b.id })
  }
  // vestibules of the elevator cores (Ebene –2 ↔ –1, two of them also to the plaza)
  for (const c of UG.cores) {
    const [sx, sz] = polar(c.angle, UG.coreR + 1.3)
    out.push({ id: `core-${c.angle}`, name: 'Aufzugskern', kind: 'core', sx, sz, rot: outward(c.angle), len: C.r - C.w / 2 - (UG.coreR + 1.3) + 0.6, width: 3.6, level: 'promenade' })
  }
  // stair landing (stair rises outwards from rBottom, 26 steps á 0.3 m)
  {
    const rTop = UG.stair.rBottom + Math.round((LEVELS.promenade.floorY - LEVELS.parking.floorY) / 0.175) * 0.3
    const [sx, sz] = polar(UG.stair.angle, rTop)
    out.push({ id: 'stair', name: 'Treppenhaus Tiefgarage', kind: 'stair', sx, sz, rot: outward(UG.stair.angle), len: C.r - C.w / 2 - rTop + 0.6, width: 3.2, level: 'promenade' })
  }
  // car tunnels on Ebene –2 from the ramp bottoms to the car park
  for (const r of UG.ramps) {
    const [sx, sz] = polar(r.angle, UG.rampBottomR)
    out.push({ id: `car-${r.id}`, name: r.name, kind: 'car', sx, sz, rot: faceCentre(r.angle), len: UG.rampBottomR - UG.parkingRadius + 1, width: UG.rampWidth, level: 'parking' })
  }

  // openings in the ring walls where corridors join
  const walls = [C.r - C.w / 2, C.r + C.w / 2, O.r - O.w / 2, O.r + O.w / 2]
  const gaps: Record<number, [number, number][]> = {}
  const parkingGaps: [number, number][] = []
  const addGap = (list: [number, number][], c: Corridor, R: number) => {
    const dx = Math.sin(c.rot)
    const dz = Math.cos(c.rot)
    const ang: number[] = []
    for (const off of [-c.width / 2 - 0.2, c.width / 2 + 0.2]) {
      const ox = c.sx + off * Math.cos(c.rot)
      const oz = c.sz - off * Math.sin(c.rot)
      const ts = circleT(ox, oz, dx, dz, R)
      if (!ts) return
      const t = ts.find((v) => v > -1 && v < c.len + 1)
      if (t === undefined) return
      ang.push(Math.atan2(oz + dz * t, ox + dx * t))
    }
    let [a0, a1] = ang
    if (a1 < a0) [a0, a1] = [a1, a0]
    if (a1 - a0 > Math.PI) [a0, a1] = [a1, a0 + Math.PI * 2]
    list.push([a0, a1])
  }
  for (const R of walls) {
    gaps[R] = []
    for (const c of out) if (c.level === 'promenade') addGap(gaps[R], c, R)
  }
  for (const c of out) if (c.level === 'parking') addGap(parkingGaps, c, UG.parkingRadius)
  return { corridors: out, walls, gaps, parkingGaps }
}

/** ramp rectangle (world corners) of a car ramp, rising outwards from rampBottomR */
export function rampCorners(angle: number): [number, number][] {
  const rot = faceCentre(angle)
  const [sx, sz] = polar(angle, UG.rampBottomR)
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const W = UG.rampWidth
  const L = UG.rampLen
  return [[-W / 2, -L], [W / 2, -L], [W / 2, 0], [-W / 2, 0]].map(([lx, lz]) => [sx + lx * c + lz * s, sz - lx * s + lz * c])
}

/** control points of the monorail loop (closed, centripetal Catmull-Rom through them) */
export function monorailControlPoints(): [number, number][] {
  const R = LAYOUT.monorailRadius
  const ordered = [...STATIONS].sort((a, b) => a.angle - b.angle)
  const pts: [number, number][] = []
  ordered.forEach((st, i) => {
    const a = st.angle * DEG
    const [cx, cz] = polar(st.angle, R)
    const tx = Math.cos(a)
    const tz = Math.sin(a)
    for (const off of [-26, 0, 26]) pts.push([cx + tx * off, cz + tz * off])
    const next = ordered[(i + 1) % ordered.length]
    let span = next.angle - st.angle
    if (span <= 0) span += 360
    const mid = st.angle + span / 2
    pts.push(polar(mid, R + (i % 2 ? 9 : -4)))
  })
  return pts
}

export const START = { x: 0, z: 96, yaw: 0 } // in front of the HQ plaza, looking north at the tower
