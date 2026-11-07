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
    description: 'Holding-Zentrale der Big Apple Groups: Geschäftsführung, Vorstand, Group Finance, Legal & Compliance, Technology, HR und internationale Unternehmensentwicklung. 22 Etagen, Dachterrasse mit Blick über den Campus.',
    angle: 0, radius: 0, w: 48, d: 48, floors: 22, floorH: 4.5,
  },
  {
    id: 'racing', name: 'Big Apple Groups Racing', suffix: 'Groups Racing', kind: 'subsidiary', style: 'racing',
    description: 'Formel-1-Team der Big Apple Groups: F1-Showroom mit Rennwagen, Rennsimulatoren, Race Control & Telemetrie, Aerodynamik/Windkanal und Engineering.',
    angle: 50, radius: 92, w: 44, d: 26, floors: 3, floorH: 4.6,
  },
  {
    id: 'visitor', name: 'Big Apple Visitor Center', suffix: 'Visitor Center', kind: 'service', style: 'conference',
    description: 'Besucherzentrum des Campus: Besucherempfang, Unternehmensausstellung, Auditorium für über 400 Gäste (Big Apple Innovation Week), Konferenz- und Presseräume.',
    angle: 180, radius: 165, w: 84, d: 46, floors: 2, floorH: 7,
  },
  {
    id: 'health', name: 'Big Apple Health & Recovery Center', suffix: 'Health', kind: 'subsidiary', style: 'health',
    description: 'Gesundheits- und Erholungszentrum für alle Mitarbeitenden: Physiotherapie, betriebsärztlicher Dienst, Recovery & Sauna, Massage, Meditation und Ernährungsberatung.',
    angle: 124, radius: 92, w: 36, d: 24, floors: 2, floorH: 4.2,
  },
  {
    id: 'hotel', name: 'Big Apple Hotels – Campus Hotel & Mitarbeiter-Residenz', suffix: 'Hotels', kind: 'hotel', style: 'campushotel',
    description: 'Ein Haus für Gäste und Mitarbeitende: Lobby, Rezeption, Restaurant, Bar, Fitness, Konferenzräume, Gästezimmer (2. OG) und Mitarbeiter-Apartments mit Gemeinschaftsküche und Co-Working (1./3. OG), Dachterrasse.',
    angle: 213, radius: 184, w: 40, d: 56, floors: 10, floorH: 3.6,
  },
  {
    id: 'bc1', name: 'Big Apple Business Center I', suffix: 'Business Center', kind: 'service', style: 'business',
    description: 'Haus für Big-Apple-Unternehmen, die (noch) kein eigenes Gebäude haben. Mieterverzeichnis am Eingang und in der Lobby.',
    angle: 233, radius: 178, w: 34, d: 28, floors: 4, floorH: 4.2,
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
  {
    id: 'tech', name: 'Big Apple Tech', suffix: 'Tech', kind: 'subsidiary', style: 'tech',
    description: 'Technologie-Headquarter: Softwareentwicklung, KI-Labore, Kreativbereiche und Demo-Räume.',
    angle: 68, radius: 178, w: 54, d: 34, floors: 6, floorH: 4.2,
  },
  {
    id: 'finance', name: 'Big Apple Finance', suffix: 'Finance', kind: 'subsidiary', style: 'finance',
    description: 'Internationaler Finanz- und Technologiebereich von Big Apple Groups: Marktanalyse, Kundenempfang, Finanzprodukte.',
    angle: 106, radius: 178, w: 46, d: 32, floors: 7, floorH: 4.2,
  },
  {
    id: 'mobility', name: 'Big Apple Mobility', suffix: 'Mobility', kind: 'subsidiary', style: 'mobility',
    description: 'Mobilitäts-Headquarter mit Fahrzeugpräsentation, Mobilitätsleitstelle und E-Bike/E-Scooter-Station.',
    angle: 143, radius: 178, w: 46, d: 32, floors: 4, floorH: 4.2,
  },
  {
    id: 'fitness', name: 'Big Apple Fitness', suffix: 'Fitness', kind: 'subsidiary', style: 'fitness',
    description: 'Fitness- und Gesundheitszentrum: Cardio, Kraft, Gruppentraining, Personal Training, Recovery.',
    angle: 252, radius: 178, w: 44, d: 32, floors: 3, floorH: 4.6,
  },
  {
    id: 'logistics', name: 'Big Apple Logistics', suffix: 'Logistics', kind: 'subsidiary', style: 'logistics',
    description: 'Logistik-Leitstelle für die Planung und Steuerung internationaler Lieferketten.',
    angle: 288, radius: 182, w: 58, d: 36, floors: 3, floorH: 4.6,
  },
  {
    id: 'entertainment', name: 'Big Apple Entertainment', suffix: 'Entertainment', kind: 'subsidiary', style: 'entertainment',
    description: 'Medien- und Entertainment-Headquarter mit Präsentationskino, Studios und Schnittplätzen.',
    angle: 322, radius: 178, w: 48, d: 34, floors: 4, floorH: 4.6,
  },
  {
    id: 'holidays', name: 'Big Apple Holidays', suffix: 'Holidays', kind: 'subsidiary', style: 'holidays',
    description: 'Reiseunternehmen: Reiseplanung, digitale Reisewelt und Tavium-KI-Demonstrationsbereich.',
    angle: 356, radius: 178, w: 46, d: 32, floors: 5, floorH: 4.2,
  },
  {
    id: 'trains', name: 'Big Apple Trains', suffix: 'Trains', kind: 'subsidiary', style: 'trains',
    description: 'Eisenbahn-Headquarter: Betriebsleitstelle, Streckenplanung, Zugdesign-Ausstellung mit maßstabsgetreuem Zugmodell.',
    angle: 32, radius: 180, w: 60, d: 30, floors: 3, floorH: 4.6,
  },
  {
    id: 'hotels', name: 'Big Apple Hotels (Management)', suffix: 'Hotels', kind: 'subsidiary', style: 'hotels',
    description: 'Hotelmanagement-Headquarter mit Hotelmodell-Ausstellung, Musterzimmer und Management-Büros.',
    angle: 236, radius: 90, w: 34, d: 24, floors: 4, floorH: 4.2,
  },
  {
    id: 'foundation', name: 'Big Apple Foundation', suffix: 'Foundation', kind: 'subsidiary', style: 'foundation',
    description: 'Gemeinnützige Stiftung der Big Apple Groups: Ausstellungen, Projekträume und Veranstaltungsbereich – ruhig am Campussee gelegen.',
    angle: 308, radius: 90, w: 34, d: 24, floors: 2, floorH: 4.4,
  },
]

export const BUILDINGS: BuildingInfo[] = raw.map((b) => {
  const [x, z] = b.radius === 0 ? [0, 0] : polar(b.angle, b.radius)
  return { ...b, x, z, rot: faceCentre(b.angle) }
})

const SHORT: Record<string, string> = {
  hq: 'HQ', hotel: 'Campus Hotel', bc1: 'Business Center I', bc2: 'Business Center II', hotels: 'Hotels (Mgmt.)', racing: 'Racing (F1)', health: 'Health & Recovery', visitor: 'Visitor Center',
}
/** short label for maps, signs and the location display */
export const shortName = (b: { id: string; suffix: string }) => SHORT[b.id] ?? b.suffix

export const buildingById = (id: string) => BUILDINGS.find((b) => b.id === id)!

/** Monorail stations (compass angle on the monorail ring) */
export const STATIONS = [
  { id: 's-hq', name: 'Holding HQ / Visitor Center', angle: 180 },
  { id: 's-fin', name: 'Finance · Mobility', angle: 122 },
  { id: 's-tech', name: 'Tech · Trains', angle: 52 },
  { id: 's-hol', name: 'Holidays · Entertainment', angle: 338 },
  { id: 's-log', name: 'Logistics · Fitness · Hotel', angle: 262 },
]

/** campus lake (Campussee) */
export const LAKE = (() => {
  const [x, z] = polar(272, 92)
  return { x, z, r: 22 }
})()

/** underground car park below the HQ plaza (round) + car ramp & access tunnel from the ring road */
export const GARAGE = {
  radius: 58,
  floorY: -5,
  ceilY: -1.4,
  /** car ramp: radial at this compass angle, bottom at rBottom, rising outwards over len metres */
  ramp: { angle: 197, rBottom: 208, len: 30, width: 8.4 },
  liftX: -40, liftZ: -30, // glass lift garage ↔ plaza
}

export interface TunnelPath {
  id: string
  name: string
  /** start (world) at the building's elevator, direction towards the garage, length */
  sx: number
  sz: number
  rot: number
  len: number
  width: number
  /** angles (atan2 convention) where the tunnel cuts the garage wall */
  gap: [number, number]
}

/** circle entry of a line p + t·d (|d| = 1) with radius R: smallest t ≥ 0 */
function enter(px: number, pz: number, dx: number, dz: number, R: number) {
  const b = px * dx + pz * dz
  const c = px * px + pz * pz - R * R
  const disc = b * b - c
  if (disc < 0) return 0
  return -b - Math.sqrt(disc)
}

/** pedestrian tunnels from the garage to every building (except the HQ) and the car access tunnel */
export function tunnelPaths(): TunnelPath[] {
  const R = GARAGE.radius
  const out: TunnelPath[] = []
  const mk = (id: string, name: string, sx: number, sz: number, rot: number, width: number) => {
    const dx = Math.sin(rot)
    const dz = Math.cos(rot)
    const len = enter(sx, sz, dx, dz, R) + 1.5
    // side lines → gap angles
    const ang: number[] = []
    for (const off of [-width / 2 - 0.3, width / 2 + 0.3]) {
      const ox = sx + off * Math.cos(rot)
      const oz = sz - off * Math.sin(rot)
      const t = enter(ox, oz, dx, dz, R)
      ang.push(Math.atan2(oz + dz * t, ox + dx * t))
    }
    let [a0, a1] = ang
    if (a1 < a0) [a0, a1] = [a1, a0]
    if (a1 - a0 > Math.PI) [a0, a1] = [a1, a0 + Math.PI * 2]
    out.push({ id, name, sx, sz, rot, len, width, gap: [a0, a1] })
  }
  for (const b of BUILDINGS) {
    if (b.kind === 'hq') continue
    // elevator door of the generic building: local (-2.6, -d/2 + 3.0)
    const lx = -2.6
    const lz = -b.d / 2 + 3.0
    const sx = b.x + lx * Math.cos(b.rot) + lz * Math.sin(b.rot)
    const sz = b.z - lx * Math.sin(b.rot) + lz * Math.cos(b.rot)
    mk('t-' + b.id, b.name, sx, sz, b.rot, 6)
  }
  // car tunnel from the ramp bottom northwards (rot π → local +z = world -z)
  const r = GARAGE.ramp
  const [rx, rz] = polar(r.angle, r.rBottom)
  mk('t-cars', 'Zufahrt Tiefgarage', rx, rz, faceCentre(r.angle), r.width)
  return out
}

export const START = { x: 0, z: 96, yaw: 0 } // in front of the HQ plaza, looking north at the tower
