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
  | 'racing'
  | 'health'
  | 'staffhotel'

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
    angle: 180, radius: 178, w: 58, d: 34, floors: 4, floorH: 4.6,
  },
  {
    id: 'health', name: 'Big Apple Health & Recovery Center', suffix: 'Health', kind: 'subsidiary', style: 'health',
    description: 'Gesundheits- und Erholungszentrum für alle Mitarbeitenden: Physiotherapie, betriebsärztlicher Dienst, Recovery & Sauna, Massage, Meditation und Ernährungsberatung.',
    angle: 124, radius: 92, w: 36, d: 24, floors: 2, floorH: 4.2,
  },
  {
    id: 'staffhotel', name: 'Big Apple Hotels – Mitarbeiter-Residenz', suffix: 'Hotels', kind: 'hotel', style: 'staffhotel',
    description: 'Hotel für Mitarbeitende, die aus aller Welt zum Campus reisen: Apartments, Gemeinschaftsküche & Lounge, Co-Working, Waschsalon und Dachterrasse.',
    angle: 200, radius: 186, w: 28, d: 44, floors: 10, floorH: 3.4,
  },
  {
    id: 'hotel', name: 'Big Apple Hotels – Campus Hotel', suffix: 'Hotels', kind: 'hotel',
    description: 'Campus-Hotel mit Lobby, Rezeption, Restaurant, Bar, Fitness, Konferenzräumen, Gästezimmern und Dachterrasse.',
    angle: 218, radius: 182, w: 30, d: 52, floors: 9, floorH: 3.6, style: 'campushotel',
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
  hq: 'HQ', hotel: 'Campus Hotel', staffhotel: 'Mitarbeiter-Hotel', hotels: 'Hotels (Mgmt.)', racing: 'Racing (F1)', health: 'Health & Recovery',
}
/** short label for maps, signs and the location display */
export const shortName = (b: { id: string; suffix: string }) => SHORT[b.id] ?? b.suffix

export const buildingById = (id: string) => BUILDINGS.find((b) => b.id === id)!

/** Monorail stations (compass angle on the monorail ring) */
export const STATIONS = [
  { id: 's-hq', name: 'Holding HQ / Racing', angle: 180 },
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

/** underground garage (local rect in world coords) */
export const GARAGE = {
  x0: -78, x1: -18, z0: 194, z1: 232,
  floorY: -4.6,
  ramp: { x0: -76, x1: -68, z0: 202, z1: 232 }, // ramp goes down from z1 (ground) to z0
  liftX: -24, liftZ: 200,
}

export const START = { x: 0, z: 96, yaw: 0 } // in front of the HQ plaza, looking north at the tower
