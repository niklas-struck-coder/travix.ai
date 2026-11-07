/**
 * Room programmes of all campus buildings – pure data (no rendering code).
 * Used by the 3D world (furniture generators) and by the masterplan page
 * (room lists, interior concepts).
 *
 * Generic buildings: wings L / R (left / right of the central hall, seen from
 * the entrance) are split along the depth by fractions f0..f1 (0 = back,
 * 1 = front); C is the central hall in front of the core.
 */
import type { FloorSpec, RoomSpec } from '../world/GenericBuilding'
import type { RoomKind } from '../world/rooms'

const room = (name: string, kind: RoomKind, wing: 'L' | 'R' | 'C', f0?: number, f1?: number, extra: Partial<RoomSpec> = {}): RoomSpec => ({ name, kind, wing, f0, f1, ...extra })
const open: Partial<RoomSpec> = { open: true }
const flip: Partial<RoomSpec> = { flip: true }

export const PROGRAMS: Record<string, FloorSpec[]> = {
  racing: [
    { label: 'EG', rooms: [
      { name: 'Empfang & Fan-Bereich', kind: 'reception', wing: 'C' },
      { name: 'F1-Showroom', kind: 'f1showroom', wing: 'L', open: true },
      { name: 'Rennsimulatoren', kind: 'simulators', wing: 'R', f0: 0.45, f1: 1 },
      { name: 'Trophäen & Teamgeschichte', kind: 'exhibition', wing: 'R', f0: 0, f1: 0.45, open: true, ctx: { screens: [{ title: 'Big Apple Groups Racing', lines: ['Formel-1-Team · Gegründet in Amsterdam', 'Heimrennen: Zandvoort'], kind: 'event' }] } },
    ] },
    { label: '1. OG', rooms: [
      { name: 'Race Control & Telemetrie', kind: 'control', wing: 'L', open: true, ctx: { screens: [{ title: 'Telemetrie live', lines: ['Runde 42/72 · P2 · Abstand +1,8 s', 'Reifen: Medium, 18 Runden alt · Boxenstopp in 3 Runden'], kind: 'trains' }] } },
      { name: 'Aerodynamik & Windkanal', kind: 'aero', wing: 'R', f0: 0.4, f1: 1 },
      { name: 'Strategieraum', kind: 'strategy', wing: 'R', f0: 0, f1: 0.4 },
      { name: 'Fahrer-Lounge', kind: 'clientlounge', wing: 'C' },
    ] },
    { label: '2. OG', rooms: [
      { name: 'Engineering & Konstruktion', kind: 'tech', wing: 'L', open: true },
      { name: 'Fahrer-Performance', kind: 'strength', wing: 'R', f0: 0.5, f1: 1, open: true },
      { name: 'Besprechungsraum „Zandvoort“', kind: 'conference', wing: 'R', f0: 0, f1: 0.5 },
    ] },
  ],
  tech: [
    { label: 'EG', rooms: [
      room('Empfang & Lounge', 'reception', 'C'),
      room('Produktentwicklung', 'projects', 'L', 0.45, 1),
      room('Testlabore', 'devlab', 'L', 0, 0.45),
      room('Präsentationsfläche', 'presentation', 'R', 0.45, 1, { ...flip, ctx: { screens: [{ title: 'Big Apple Tech', lines: ['Produkt-Demo: Big Apple Plattform', 'Eine Plattform für alle Unternehmen der Gruppe'], kind: 'info' }] } }),
      room('Besprechungsboxen', 'conference', 'R', 0, 0.45),
    ] },
    { label: '1. OG', rooms: [
      room('Softwareentwicklung', 'tech', 'L', 0, 1, open),
      room('KI-Entwicklung', 'tech', 'R', 0.5, 1, open),
      room('UX/UI-Design', 'creative', 'R', 0.22, 0.5),
      room('Ruheraum', 'meditation', 'R', 0, 0.22),
      room('Team-Lounge', 'lounge', 'C'),
    ] },
    { label: '2. OG', rooms: [
      room('App- & Plattformentwicklung', 'tech', 'L', 0, 1, open),
      room('Cybersecurity', 'control', 'R', 0.55, 1, { ctx: { screens: [{ title: 'Security Operations', lines: ['Alle Systeme geschützt · 0 kritische Vorfälle', 'Überwachung Netzwerk, Cloud und Endgeräte'], kind: 'logistics' }] } }),
      room('IT-Infrastruktur', 'servers', 'R', 0.25, 0.55),
      room('Projektbüro', 'projects', 'R', 0, 0.25),
      room('Kreativraum', 'creative', 'C'),
    ] },
  ],
  finance: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Präsentationsraum', 'presentation', 'L', 0.5, 1, { ...flip, ctx: { screens: [{ title: 'Big Apple Finance', lines: ['Produkte: Pay · Travel Card · Green Bonds', 'Präsentation für Partner und Management'], kind: 'market' }] } }),
      room('Videokonferenzraum', 'conference', 'L', 0, 0.5),
      room('Kundenservice-Management', 'openoffice', 'R', 0.5, 1, open),
      room('Mitarbeiterlounge', 'lounge', 'R', 0, 0.5),
    ] },
    { label: '1. OG', rooms: [
      room('Investment- & Marktanalyse', 'market', 'L', 0, 1, open),
      room('Zahlungsverkehr', 'openoffice', 'R', 0.5, 1, open),
      room('Risikomanagement', 'office', 'R', 0, 0.5),
      room('Besprechungsraum', 'conference', 'C'),
    ] },
    { label: '2. OG', rooms: [
      room('Fintech-Entwicklung', 'tech', 'L', 0, 1, open),
      room('Management', 'exec', 'R', 0.6, 1),
      room('Finanzstrategie', 'strategy', 'R', 0.3, 0.6),
      room('Compliance', 'legal', 'R', 0, 0.3),
      room('Produktentwicklung', 'projects', 'C'),
    ] },
  ],
  fitness: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Standortpräsentation & Musterflächen', 'fitshowroom', 'L', 0, 1, open),
      room('Schulungsraum für Führungskräfte', 'presentation', 'R', 0.5, 1, { ...flip, ctx: { screens: [{ title: 'Leadership Training', lines: ['Club-Management · Service · Qualität'], kind: 'info' }] } }),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
    { label: '1. OG', rooms: [
      room('Club Operations', 'openoffice', 'L', 0, 1, open),
      room('Personal- & Trainerverwaltung', 'office', 'R', 0.5, 1),
      room('Qualitätsmanagement', 'office', 'R', 0, 0.5),
      room('Lounge', 'lounge', 'C'),
    ] },
    { label: '2. OG', rooms: [
      room('Standortentwicklung · Franchise & Expansion', 'strategy', 'L', 0, 1),
      room('Fitnessmanagement', 'exec', 'R', 0.5, 1),
      room('Marketing · Mitglieder- & Trainingskonzepte', 'creative', 'R', 0, 0.5),
    ] },
  ],
  health: [
    { label: 'EG', rooms: [
      room('Empfang · Lounge · Wasserstation', 'reception', 'C'),
      room('Cardio-Bereich', 'cardio', 'L', 0.5, 1, open),
      room('Gerätebereich', 'strength', 'L', 0, 0.5, open),
      room('Umkleiden & Duschen Damen', 'lockers', 'R', 0.5, 1),
      room('Umkleiden & Duschen Herren', 'lockers', 'R', 0, 0.5),
    ] },
    { label: '1. OG', rooms: [
      room('Freihantel- & Krafttraining', 'strength', 'L', 0.5, 1, open),
      room('Functional Training', 'group', 'L', 0, 0.5, open),
      room('Gruppentrainingsstudio', 'group', 'R', 0.5, 1),
      room('Personal Training', 'personal', 'R', 0, 0.5),
      room('Trainingsplanung', 'office', 'C'),
    ] },
    { label: '2. OG', rooms: [
      room('Physiotherapie & Behandlung', 'physio', 'L', 0.6, 1),
      room('Gesundheitsberatung & Körperanalyse', 'medical', 'L', 0.3, 0.6),
      room('Beweglichkeitsdiagnostik', 'physio', 'L', 0, 0.3),
      room('Massage', 'physio', 'R', 0.55, 1),
      room('Mobility & Stretching', 'group', 'R', 0.25, 0.55),
      room('Entspannung & Ruhebereich', 'meditation', 'R', 0, 0.25),
      room('Recovery-Lounge', 'recovery', 'C'),
    ] },
  ],
  holidays: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Präsentationsbereich · Digitale Reisewelt', 'digitaltravel', 'L', 0, 1, flip),
      room('Partnerschaften', 'office', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
    { label: '1. OG', rooms: [
      room('Reiseproduktentwicklung · Destination Management', 'travel', 'L', 0, 1, open),
      room('Tavium-KI-Projektteam', 'tavium', 'R', 0.5, 1, open),
      room('Digitale Produktentwicklung', 'tech', 'R', 0, 0.5),
      room('Mitarbeiterlounge', 'lounge', 'C'),
    ] },
    { label: '2. OG', rooms: [
      room('Reiseplanung · Kundenservice-Management', 'travel', 'L', 0, 1, open),
      room('Marketing', 'creative', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
  ],
  hotels: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Musterzimmer', 'sampleroom', 'L'),
      room('Material- & Designausstellung', 'exhibition', 'R', 0, 1, { ...open, ctx: { screens: [{ title: 'Hotelstandard 2027', lines: ['Materialien · Farben · Möbel · Licht'], kind: 'info' }] } }),
    ] },
    { label: '1. OG', rooms: [
      room('Hotelmanagement · Operations', 'openoffice', 'L', 0, 1, open),
      room('Revenue Management', 'market', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
    { label: '2. OG', rooms: [
      room('Standort- & Konzeptentwicklung · Immobilien', 'strategy', 'L', 0, 1),
      room('Marketing · Personal · Qualität', 'openoffice', 'R', 0.45, 1, open),
      room('Lounge', 'lounge', 'R', 0, 0.45),
    ] },
  ],
  hotel: [
    { label: 'EG', rooms: [
      room('Lobby · Rezeption · Gepäckraum', 'reception', 'C'),
      room('Restaurant & Frühstücksbereich', 'restaurant', 'L', 0.45, 1, open),
      room('Bar', 'bar', 'L', 0, 0.45),
      room('Hotel-Lounge', 'lounge', 'R', 0.6, 1, open),
      room('Backoffice', 'office', 'R', 0.3, 0.6),
      room('Housekeeping & Wäscherei', 'laundry', 'R', 0, 0.3),
    ] },
    { label: '1. OG', rooms: [
      room('Fitnessbereich', 'cardio', 'L', 0.5, 1, open),
      room('Besprechungsraum I', 'conference', 'L', 0, 0.5),
      room('Besprechungsraum II', 'conference', 'R', 0.5, 1),
      room('Business-Lounge', 'lounge', 'R', 0, 0.5),
    ] },
    { label: '2. OG Standardzimmer', rooms: [
      ...Array.from({ length: 5 }, (_, i) => room(`Standardzimmer ${201 + i}`, 'hotelroom', 'L', i / 5, (i + 1) / 5)),
      ...Array.from({ length: 5 }, (_, i) => room(`Standardzimmer ${206 + i}`, 'hotelroom', 'R', i / 5, (i + 1) / 5)),
      room('Etagenflur', 'empty', 'C'),
    ] },
    { label: '3. OG Superior & Suiten', rooms: [
      ...Array.from({ length: 4 }, (_, i) => room(`Superiorzimmer ${301 + i}`, 'hotelroom', 'L', i / 4, (i + 1) / 4)),
      room('Suite 305', 'suite', 'R', 0.5, 1),
      room('Suite 306', 'suite', 'R', 0, 0.5),
      room('Etagenflur', 'empty', 'C'),
    ] },
  ],
  logistics: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Leitstelle', 'control', 'L', 0, 1, { ...open, ctx: { screens: [{ title: 'Leitstelle', lines: ['1.284 Sendungen unterwegs · 97,8 % pünktlich', 'Rotterdam · Hamburg · Singapur · Los Angeles'], kind: 'logistics' }] } }),
      room('Disposition', 'openoffice', 'R', 0.5, 1, open),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
    { label: '1. OG', rooms: [
      room('Transportplanung · Supply Chain Management', 'openoffice', 'L', 0, 1, open),
      room('Flottenmanagement', 'control', 'R', 0.5, 1, { ctx: { screens: [{ title: 'Flotte', lines: ['412 Lkw · 38 Schiffe · 12 Charterflüge'], kind: 'logistics' }] } }),
      room('Datenanalyse', 'tech', 'R', 0, 0.5),
      room('Team-Lounge', 'lounge', 'C'),
    ] },
    { label: '2. OG', rooms: [
      room('Logistikmanagement · Internationale Koordination', 'openoffice', 'L', 0, 1, open),
      room('Management', 'exec', 'R', 0.5, 1),
      room('Projektbereich', 'projects', 'R', 0, 0.5),
    ] },
  ],
  mobility: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Fahrzeugpräsentation · E-Bike & E-Scooter', 'showroom', 'L', 0, 1, open),
      room('Kundenservice-Management', 'openoffice', 'R', 0.5, 1, open),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
    { label: '1. OG', rooms: [
      room('Flottenmanagement · Digitale Flottenübersicht', 'control', 'L', 0, 1, { ...open, ctx: { screens: [{ title: 'Flotte live', lines: ['2.430 E-Fahrzeuge aktiv · 96 % verfügbar', 'Amsterdam · Berlin · Paris · Kopenhagen'], kind: 'logistics' }] } }),
      room('Wartungsmanagement', 'office', 'R', 0.5, 1),
      room('Internationale Standortplanung', 'strategy', 'R', 0, 0.5),
    ] },
    { label: '2. OG', rooms: [
      room('Produkt- & App-Entwicklung (mit Big Apple Tech)', 'tech', 'L', 0, 1, open),
      room('Mobilitätsmanagement', 'exec', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
  ],
  trains: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Betriebsleitstelle', 'control', 'L', 0, 1, { ...open, ctx: { screens: [{ title: 'Betriebsleitstelle', lines: ['Netz NL/DE/BE: 412 Züge im Einsatz', 'Pünktlichkeit heute: 94,6 %'], kind: 'trains' }] } }),
      room('Präsentation Zugmodell', 'trainmodel', 'R', 0.45, 1, open),
      room('Zugdesign & Produktentwicklung', 'traindesign', 'R', 0, 0.45),
    ] },
    { label: '1. OG', rooms: [
      room('Betriebs- & Fahrplanplanung', 'openoffice', 'L', 0, 1, open),
      room('Streckenplanung', 'strategy', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
    { label: '2. OG', rooms: [
      room('Personalmanagement · Kundenservice', 'openoffice', 'L', 0, 1, open),
      room('Unternehmensmanagement', 'exec', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
  ],
  entertainment: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Vorführraum', 'cinema', 'L'),
      room('Kleines Studio', 'studio', 'R', 0.5, 1),
      room('Schnittplätze', 'editing', 'R', 0, 0.5, open),
    ] },
    { label: '1. OG', rooms: [
      room('Film- & Serienentwicklung · Kreativbüros', 'creative', 'L', 0, 1, open),
      room('Redaktion', 'openoffice', 'R', 0.5, 1, open),
      room('Produktionsplanung', 'projects', 'R', 0, 0.5),
      room('Lounge', 'lounge', 'C'),
    ] },
    { label: '2. OG', rooms: [
      room('Marketing', 'openoffice', 'L', 0, 1, open),
      room('Unternehmensmanagement', 'exec', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
    ] },
  ],
  media: [
    { label: 'EG', rooms: [
      room('Empfang & Technikausgabe', 'reception', 'C'),
      room('Film- & TV-Studio', 'studio', 'L', 0.5, 1),
      room('Nachrichten- & Präsentationsstudio', 'newsstudio', 'L', 0, 0.5),
      room('Regieraum', 'control', 'R', 0.6, 1, { ctx: { screens: [{ title: 'Regie', lines: ['Studio 1 · Kamera 1–4 · LIVE', 'Ton · Licht · Grafik'], kind: 'event' }] } }),
      room('Make-up & Vorbereitung', 'makeup', 'R', 0.3, 0.6),
      room('Technikraum', 'servers', 'R', 0, 0.3),
    ] },
    { label: '1. OG', rooms: [
      room('Podcaststudios', 'podcast', 'L', 0.5, 1),
      room('Tonaufnahmeräume', 'sound', 'L', 0, 0.5),
      room('Schnittplätze', 'editing', 'R', 0.6, 1, open),
      room('Fotostudio', 'photo', 'R', 0.3, 0.6),
      room('Kleiner Vorführraum', 'cinema', 'R', 0, 0.3),
      room('Produktionsarbeitsplätze', 'editing', 'C'),
    ] },
  ],
  foundation: [
    { label: 'EG', rooms: [
      room('Empfang', 'reception', 'C'),
      room('Ausstellung geförderter Projekte', 'exhibition', 'L', 0, 1, { ...open, ctx: { screens: [{ title: 'Big Apple Foundation', lines: ['Bildung · Klima · Gesundheit', '84 Projekte in 26 Ländern'], kind: 'info' }] } }),
      room('Kleiner Veranstaltungsraum', 'event', 'R', 0.45, 1, { ...flip, ctx: { screens: [{ title: 'Projektabend', lines: ['Vorstellung neuer Förderprojekte'], kind: 'event' }] } }),
      room('Beratungsraum', 'conference', 'R', 0, 0.45),
    ] },
    { label: '1. OG', rooms: [
      room('Stiftungsmanagement · Projektbüros', 'projects', 'L', 0, 1, open),
      room('Fördermittelverwaltung', 'office', 'R', 0.5, 1),
      room('Besprechungsraum', 'conference', 'R', 0, 0.5),
      room('Lounge & Gemeinschaftstische', 'lounge', 'C'),
    ] },
  ],
  // the café is built by world/Cafe.ts; this list is used for the masterplan room lists
  cafe: [
    { label: 'EG', rooms: [
      room('Barista-Theke mit Speisenvitrine', 'barista', 'C'),
      room('Café-Sitzbereich & Fensterbar', 'cafe', 'L'),
      room('Holzhütten (Sitznischen für 2–4 Personen)', 'hut', 'L'),
      room('Lounge-Ecke', 'lounge', 'R'),
      room('Freistehende Treppe ins Obergeschoss', 'empty', 'R'),
    ] },
    { label: '1. OG', rooms: [
      room('Arbeitsbereich mit Gemeinschaftstisch', 'workcafe', 'C'),
      room('Fensterplätze mit Steckdosen', 'workcafe', 'L'),
      room('Holzhütten zum konzentrierten Arbeiten', 'hut', 'L'),
      room('Lounge mit Sesseln', 'lounge', 'R'),
    ] },
  ],
  visitor: [
    { label: 'EG', rooms: [
      room('Besucherempfang · Registrierung · Information', 'reception', 'C'),
      room('Big Apple Museum', 'museum', 'L', 0, 1, open),
      room('Besucherlounge & Café', 'cafe', 'R', 0.5, 1, open),
      room('Campusausstellung', 'campusmodel', 'R', 0, 0.5, open),
    ] },
    { label: '1. OG', rooms: [
      room('Learning Center · Lernräume & digitale Lernstationen', 'learning', 'L', 0.5, 1),
      room('Bibliothek', 'library', 'L', 0, 0.5),
      room('Schulungs- & Workshopraum', 'presentation', 'R', 0.66, 1, { ...flip, ctx: { screens: [{ title: 'Workshop', lines: ['Big Apple Groups für Schulen & Studierende'], kind: 'info' }] } }),
      room('Gruppenarbeitsräume', 'projects', 'R', 0.33, 0.66),
      room('Besprechungsraum', 'conference', 'R', 0, 0.33),
      room('Informationsbereich', 'lounge', 'C'),
    ] },
  ],
}

/** HQ floors – rooms are ring sectors (atan2 degrees; 90° = south, the elevator side) */
export interface HqRoom { name: string; a0: number; a1: number; kind: RoomKind; open?: boolean }
export interface HqFloor { level: number; label: string; short: string; rooms: HqRoom[] }
export const HQ_FLOORS: HqFloor[] = [
  {
    level: 4, label: '4. OG – Group Finance & Controlling · Group Legal & Compliance', short: '4. OG Finance/Legal',
    rooms: [
      { name: 'Group Finance & Controlling', a0: 115, a1: 200, kind: 'openoffice', open: true },
      { name: 'Controlling – Besprechungsraum', a0: 200, a1: 245, kind: 'conference' },
      { name: 'Group Legal – Bibliothek', a0: 245, a1: 300, kind: 'legal' },
      { name: 'Compliance Office', a0: 300, a1: 345, kind: 'office' },
      { name: 'Group Legal & Compliance', a0: 345, a1: 425, kind: 'openoffice', open: true },
    ],
  },
  {
    level: 7, label: '7. OG – Human Resources · IT & Konzernverwaltung · Group Communications', short: '7. OG HR/IT/Comms',
    rooms: [
      { name: 'Human Resources', a0: 115, a1: 195, kind: 'openoffice', open: true },
      { name: 'HR – Gesprächsraum', a0: 195, a1: 245, kind: 'conference' },
      { name: 'IT- und Konzernverwaltung', a0: 245, a1: 300, kind: 'tech' },
      { name: 'Konzern-IT – Serverraum', a0: 300, a1: 345, kind: 'servers' },
      { name: 'Group Communications', a0: 345, a1: 425, kind: 'creative', open: true },
    ],
  },
  {
    level: 10, label: '10. OG – Group Strategy · International Business Development · M&A', short: '10. OG Strategy/M&A',
    rooms: [
      { name: 'Group Strategy', a0: 115, a1: 190, kind: 'strategy' },
      { name: 'International Business Development', a0: 190, a1: 260, kind: 'openoffice', open: true },
      { name: 'Mergers & Acquisitions', a0: 260, a1: 310, kind: 'legal' },
      { name: 'Strategischer Besprechungsraum „Amsterdam“', a0: 310, a1: 360, kind: 'conference' },
      { name: 'Strategischer Besprechungsraum „New York“', a0: 360, a1: 425, kind: 'conference' },
    ],
  },
  {
    level: 18, label: '18. OG – Chairman Office · Group Management · Vorstand & Geschäftsführung', short: '18. OG Chairman/Vorstand',
    rooms: [
      { name: 'Vorstandsvorsitz (CEO)', a0: 115, a1: 175, kind: 'exec' },
      { name: 'Finanzvorstand (CFO)', a0: 175, a1: 235, kind: 'exec' },
      { name: 'Group Management', a0: 235, a1: 290, kind: 'office' },
      { name: 'Besprechungsraum Geschäftsführung', a0: 290, a1: 325, kind: 'conference' },
      { name: 'Chairman Office', a0: 325, a1: 425, kind: 'chairman' },
    ],
  },
  {
    level: 21, label: '21. OG – Executive Lounge · Vorstandskonferenzraum · Besprechung', short: '21. OG Executive',
    rooms: [
      { name: 'Vorstandskonferenzraum', a0: 115, a1: 215, kind: 'board' },
      { name: 'Repräsentativer Besprechungsraum I', a0: 215, a1: 260, kind: 'conference' },
      { name: 'Repräsentativer Besprechungsraum II', a0: 260, a1: 305, kind: 'conference' },
      { name: 'Executive Lounge', a0: 305, a1: 425, kind: 'clientlounge', open: true },
    ],
  },
]

/** what each room type is furnished with (used for the room lists of the masterplan) */
export const FURNITURE: Partial<Record<RoomKind, string>> = {
  reception: 'Empfangstresen, Besuchersessel, Lounge, Pflanzen, Informationsbildschirm',
  office: 'Schreibtisch mit Monitor, ergonomischer Stuhl, Regal, Besprechungstisch für 2, Pflanze',
  exec: 'Großer Holzschreibtisch, Ledersessel, Sofa-Ecke, Regalwand, Teppich',
  chairman: 'Repräsentativer Schreibtisch, Lounge, Besprechungstisch, Regalwand mit Logo, Teppich',
  board: 'Ovaler Konferenztisch (14–16 Plätze), Ledersessel, große Präsentationswand',
  conference: 'Konferenztisch, Bürostühle, Präsentations-/Videokonferenzbildschirm',
  bigconference: 'Langer Konferenztisch (20+ Plätze), große LED-Wand',
  openoffice: 'Höhenverstellbare Schreibtische in Gruppen, Monitore, akustische Trennwände',
  lounge: 'Sofas, Couchtisch, Teppich, Kaffeebar, Pflanzen',
  clientlounge: 'Leder-Lounge, Kaffeebar, Pflanzen',
  strategy: 'Stehtische, Whiteboard-Wand, Präsentationsbildschirm',
  legal: 'Bücherregale, Besprechungstisch, Arbeitsplatz',
  tech: 'Entwickler-Arbeitsplätze mit Doppelmonitoren, akustische Trennwände',
  servers: 'Server-Racks, Leitstand mit 2 Arbeitsplätzen, Statusbildschirm',
  canteen: 'Tische mit Stühlen, Ausgabetheke',
  cafe: 'Bistrotische, Theke mit Vitrine',
  restaurant: 'Gedeckte Tische, Buffet-/Ausgabetheke',
  bar: 'Bartresen, Barhocker, Flaschenregal, Lounge',
  creative: 'Lounge, Werktisch mit farbigen Stühlen, Moodboard-Wand',
  presentation: 'Kleine Bühne, Rednerpult, LED-Wand, Stuhlreihen',
  event: 'Bühne, Rednerpult, Bildschirm, Stuhlreihen',
  market: 'Arbeitsplätze mit Mehrfach-Monitoren, große Marktbildschirmwand',
  cardio: 'Laufbänder und Spinning-Bikes, Sportboden',
  strength: 'Kraftstationen/Racks mit Bank, Kurzhantelregal, Spiegelwand, Sportboden',
  group: 'Trainingsmatten, Spiegelwand',
  personal: 'Kraftstation, Laufband, Matte',
  recovery: 'Ruheliegen, Sauna-Kabine, Pflanzen',
  lockers: 'Spindreihen, Sitzbänke (Duschen angrenzend)',
  control: 'Leitstand-Pulte mit Monitoren, große Übersichts-/Videowand',
  showroom: 'Präsentationspodeste mit Fahrzeug, E-Bike und E-Scooter, Infostationen',
  devlab: 'Werkbänke mit Testgeräten',
  exhibition: 'Ausstellungspodeste, Präsentationsbildschirm',
  hotelmodel: 'Podeste mit Hotelmodellen',
  sampleroom: 'Komplettes Musterzimmer: Bett, Arbeitsplatz, Sofa, Bad, TV',
  hotelroom: 'Doppelbett, Nachttische mit Leuchten, Arbeitsplatz, Sofa, Bad, TV',
  suite: 'Schlafbereich, Wohnbereich mit Lounge, Esstisch, Bad, TV',
  travel: 'Arbeitsplatzgruppen, Globus, digitale Reisekarten',
  digitaltravel: 'Immersive Bildschirmwand, Sofas',
  tavium: 'KI-Demo-Podest, Infostationen',
  cinema: 'Gestufte Kinosessel, Leinwand',
  studio: 'Greenscreen, Studioleuchten, Kamera',
  editing: 'Schnittplätze mit Doppelmonitoren',
  traindesign: 'Präsentationspodeste mit Zugköpfen',
  trainmodel: 'Modellbahn-Tisch (H0) mit Landschaft',
  projects: 'Gemeinschaftstische, Projektwand',
  physio: 'Behandlungsliegen, Trainingsmatte, Therapiegeräte, Regal',
  medical: 'Untersuchungsliege, Arbeitsplatz, Medizinschrank, Körperanalyse',
  meditation: 'Matten, Sitzkissen, Mooswand, Pflanzen',
  f1showroom: 'Drehpodest mit F1-Rennwagen, Trophäenvitrine, Helme, Reifenstapel',
  simulators: 'Profi-Rennsimulatoren mit drei Monitoren',
  aero: 'Windkanal-Modellstrecke, Ingenieursarbeitsplätze',
  fitshowroom: 'Musterflächen: ausgestellte Fitnessgeräte auf Podesten, Studiodesign-Tafeln, Standortmodelle',
  museum: 'Zeitleiste der Unternehmensgeschichte, Vitrinen der Tochterunternehmen, Medienstationen',
  learning: 'Lerntische, digitale Lernstationen, Präsentationsbildschirm',
  library: 'Bücherregale, Lesetische, Sessel',
  campusmodel: 'Großes Campusmodell, Informationsbildschirme',
  podcast: 'Podcast-Tisch mit Mikrofonen, Akustikverkleidung',
  sound: 'Aufnahmekabine, Mischpult, Akustikverkleidung',
  photo: 'Hohlkehle/Fotohintergrund, Softboxen, Kamera',
  makeup: 'Schminkplätze mit Spiegeln und Licht, Garderobe',
  newsstudio: 'Nachrichtentisch, Studiokameras, Leuchten, LED-Hintergrund',
  laundry: 'Industriewaschmaschinen, Trockner, Wäscheregale',
  barista: 'Theke aus Holz und Stein, Siebträgermaschinen, Speisenvitrine mit Gebäck, Sandwiches und Salaten, Kasse, Menütafel',
  hut: 'Kleine Holzhütten mit Satteldach, Sitzbänken, Tisch und Pendelleuchte',
  workcafe: 'Gemeinschaftstisch und Fensterbar mit Steckdosen, Leselampen, Barhocker, WLAN'
}

/** interior concepts per building */
export const CONCEPTS: Record<string, string> = {
  hq: 'Seriös und hochwertig: Naturstein in der Lobby, dunkles Holz in den Vorstandsetagen, Glas, helle Wände, grüne Akzente nur in Licht und Details.',
  tech: 'Offene Projektflächen mit höhenverstellbaren Tischen, große Monitore, kleine Besprechungsboxen, Whiteboards, Lounges und Ruheräume – modern, nicht futuristisch.',
  finance: 'Besonders seriös: dunkle Steinpfeiler, ruhige Arbeitsplätze, Marktbildschirme, diskrete Videokonferenzräume, kleine Mitarbeiterlounge.',
  fitness: 'Normales Bürogebäude ohne Trainingsflächen. Musterflächen zeigen Geräte und Studiodesigns für neue Clubs.',
  health: 'Hochwertiges Fitness- und Gesundheitszentrum: Sportboden, Spiegel, moderne Geräte, helle Behandlungsräume, ruhiger Recovery-Bereich, Umkleiden mit Duschen.',
  holidays: 'Internationale Reiseatmosphäre: große Bildschirme, Reisekarten, helles Holz, Terrassen mit Pflanzen.',
  hotels: 'Verwaltungszentrale der Hotelkette mit Musterzimmer und Material-/Designausstellung – kein Hotelbetrieb.',
  hotel: 'Mittelgroßes, eigenständiges Hotel: warme Materialien, Restaurant mit Frühstück, Bar, Terrasse, Fitness, Zimmer in drei Kategorien.',
  logistics: 'Funktionale Steuerungszentrale mit großen Lage- und Routenbildschirmen, keine Lagerhalle.',
  mobility: 'Moderne Büros mit kleiner Fahrzeug- und E-Bike-Präsentation, digitale Flottenübersicht – keine Werkstatt.',
  trains: 'Betriebszentrale mit Streckenübersichten und Zugmodell – keine Werkstatt, kein Bahnhof.',
  entertainment: 'Kreative Arbeitsplätze, Schnittplätze, kleines Studio und Vorführraum, Medienfassade.',
  media: 'Funktionales Produktionsgebäude mit hohen Studioetagen (6 m), Akustikverkleidung, Studioleuchten, Regie und Technik.',
  foundation: 'Hell, ruhig und einladend: Holz, Gemeinschaftstische, offene Ausstellung, kleiner Veranstaltungsraum.',
  visitor: 'Öffentliches Besucher- und Lerngebäude: Museum, Learning Center, Bibliothek, Café und Campusmodell – kein großes Konferenzzentrum.',
  racing: 'Motorsport-Atmosphäre in Schwarz und Apple Green: Showroom mit F1-Wagen, Simulatoren, Race Control.',
  bc1: 'Flexible Büroflächen für kleinere Unternehmen der Gruppe, gemeinsame Besprechungsräume.',
  bc2: 'Flexible Büroflächen und Coworking für neue Unternehmen der Gruppe.',
  cafe: 'Wie die Foundation: Klinker, Holzlamellen, viel Glas und Gründach. Innen warmes Holz, Pflanzen, Pendelleuchten – ein Ort zum Kaffeetrinken, Essen und Arbeiten wie in einem Coffeeshop.',
}

/** office type per tenant, so the spaces look different */
const KIND: Record<string, RoomKind> = {
  'Big Apple Pay': 'market',
  'Big Apple Insurance': 'office',
  'Big Apple Energy': 'openoffice',
  'Big Apple Real Estate': 'hotelmodel',
  'Big Apple Ventures': 'projects',
  'Big Apple Academy': 'presentation',
  'Big Apple Food & Catering': 'cafe',
  'Big Apple Security': 'control',
  'Big Apple Consulting': 'office',
  Coworking: 'openoffice',
  'Big Apple Sports': 'creative',
  'Big Apple Media Lab': 'studio',
}

export function businessProgram(tenants: [string, string, string][]): FloorSpec[] {
  const floors = [...new Set(tenants.map((t) => t[0]))]
  return floors.map((fl, k) => {
    const here = tenants.filter((t) => t[0] === fl)
    const rooms: RoomSpec[] = []
    if (k === 0) rooms.push({ name: 'Empfang & Mieterverzeichnis', kind: 'reception', wing: 'C' })
    else rooms.push({ name: 'Gemeinsame Lounge', kind: 'lounge', wing: 'C' })
    // first tenant gets the left wing, the others share the right wing
    const [first, ...rest] = here
    rooms.push({ name: first[1], kind: KIND[first[1]] ?? 'openoffice', wing: 'L', open: KIND[first[1]] === 'openoffice' })
    if (rest.length === 0) rooms.push({ name: 'Gemeinsamer Besprechungsraum', kind: 'conference', wing: 'R' })
    rest.forEach((t, i) => {
      rooms.push({ name: t[1], kind: KIND[t[1]] ?? 'office', wing: 'R', f0: 1 - (i + 1) / rest.length, f1: 1 - i / rest.length })
    })
    return { label: fl, rooms }
  })
}

