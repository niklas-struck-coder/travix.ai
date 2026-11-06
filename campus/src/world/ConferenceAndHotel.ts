/**
 * Besucher- & Konferenzzentrum and the Big Apple Hotels campus hotel.
 * Both reuse the generic building generator with their own programs.
 */
import { WorldBuilder } from '../engine/builder'
import { C, textTexture } from '../engine/materials'
import { buildingById } from '../config/campus'
import { buildGeneric, type FloorSpec, type GenericCtx } from './GenericBuilding'
import * as K from './kits'

const CONFERENCE: FloorSpec[] = [
  { label: 'EG', rooms: [
    { name: 'Besucherempfang & Lobby', kind: 'reception', wing: 'C' },
    { name: 'Auditorium', kind: 'auditorium', wing: 'L' },
    { name: 'Unternehmensausstellung', kind: 'exhibition', wing: 'R', f0: 0.45, f1: 1, open: true, ctx: { screens: [{ title: 'Big Apple Groups', lines: ['10 Unternehmen · 1 Markenfamilie', 'Gegründet in Amsterdam'], kind: 'info' }] } },
    { name: 'Pressebereich', kind: 'press', wing: 'R', f0: 0, f1: 0.45, flip: true, ctx: { screens: [{ title: 'Pressekonferenz', lines: ['Big Apple Innovation Week 2026', 'Q&A mit der Geschäftsführung'], kind: 'event' }] } },
  ] },
  { label: '1. OG', rooms: [
    { name: 'Foyer Obergeschoss', kind: 'lounge', wing: 'C' },
    { name: 'Internationale Veranstaltungsfläche', kind: 'event', wing: 'L', flip: true, ctx: { screens: [{ title: 'Global Partner Summit', lines: ['Amsterdam · Dubai · Singapur · New York'], kind: 'event' }] } },
    { name: 'Konferenzraum „Europa“', kind: 'conference', wing: 'R', f0: 0.66, f1: 1 },
    { name: 'Konferenzraum „Asien“', kind: 'conference', wing: 'R', f0: 0.33, f1: 0.66 },
    { name: 'Präsentationsraum', kind: 'presentation', wing: 'R', f0: 0, f1: 0.33, flip: true, ctx: { screens: [{ title: 'Innovation Showcase', lines: ['Start-ups aus dem Big Apple Accelerator'], kind: 'event' }] } },
  ] },
]

const HOTEL: FloorSpec[] = [
  { label: 'EG', rooms: [
    { name: 'Lobby & Rezeption', kind: 'reception', wing: 'C' },
    { name: 'Restaurant „De Appel“', kind: 'restaurant', wing: 'L', f0: 0.45, f1: 1, open: true },
    { name: 'Bar „Green Leaf“', kind: 'bar', wing: 'L', f0: 0, f1: 0.45 },
    { name: 'Hotel-Lounge', kind: 'lounge', wing: 'R', f0: 0.5, f1: 1, open: true },
    { name: 'Konferenzraum „Keizersgracht“', kind: 'conference', wing: 'R', f0: 0, f1: 0.5 },
  ] },
  { label: '1. OG', rooms: [
    { name: 'Hotel-Fitness Cardio', kind: 'cardio', wing: 'L', f0: 0.5, f1: 1, open: true },
    { name: 'Hotel-Fitness Kraft', kind: 'strength', wing: 'L', f0: 0, f1: 0.5, open: true },
    { name: 'Konferenzraum „Herengracht“', kind: 'conference', wing: 'R', f0: 0.5, f1: 1 },
    { name: 'Konferenzraum „Prinsengracht“', kind: 'conference', wing: 'R', f0: 0, f1: 0.5 },
    { name: 'Business-Lounge', kind: 'lounge', wing: 'C' },
  ] },
  { label: '2. OG Zimmer', rooms: [
    ...Array.from({ length: 6 }, (_, i) => ({ name: `Gästezimmer ${201 + i}`, kind: 'hotelroom' as const, wing: 'L' as const, f0: i / 6, f1: (i + 1) / 6 })),
    ...Array.from({ length: 6 }, (_, i) => ({ name: `Gästezimmer ${207 + i}`, kind: 'hotelroom' as const, wing: 'R' as const, f0: i / 6, f1: (i + 1) / 6 })),
    { name: 'Hotelflur', kind: 'empty' as const, wing: 'C' as const },
  ] },
]

export function buildConferenceAndHotel(b: WorldBuilder) {
  const conf = buildingById('conference')
  buildGeneric(b, {
    info: conf, style: 'conference', visit: CONFERENCE, logoSuffix: 'Groups', entranceWidth: 4.0,
    extras: (b: WorldBuilder, c: GenericCtx) => {
      const { w, d, H } = c
      // large cantilevered roof over the forecourt
      b.box(0, H - 0.6, d / 2 + 6, w * 0.7, 0.6, 12, C.white, 'satin')
      b.box(0, H - 0.65, d / 2 + 12, w * 0.7, 0.08, 0.1, C.green, 'emissive')
      for (let i = 0; i < 6; i++) b.cyl(-w * 0.33 + i * ((w * 0.66) / 5), 0, d / 2 + 11, 0.22, H - 0.6, C.white, 'satin', { col: true, segs: 12 })
      // banner Innovation Week
      b.box(w / 4, 4.5, d / 2 + 0.35, 16, 6, 0.1, C.black, 'gloss')
      b.sign(w / 4, 4.6, d / 2 + 0.42, 15.6, 5.8, textTexture(['INNOVATION WEEK 2026', 'Big Apple Groups · Auditorium · Amsterdam'], { w: 1024, h: 384, accent: C.green, size: 90 }), 0, 0.7)
      // flags
      for (let i = 0; i < 6; i++) K.flagPole(b, -w / 2 + 6 + i * 3, d / 2 + 16, i % 2 ? C.green : C.white, 10)
      // second (rear) entrance sign towards the drop-off
      b.sign(0, 4.0, -d / 2 - 0.4, 10, 1.1, textTexture(['Besucher- & Konferenzzentrum', 'Vorfahrt · Taxi · Parkhaus'], { w: 768, h: 128, accent: C.green }), Math.PI)
    },
  })

  const hotel = buildingById('hotel')
  buildGeneric(b, {
    info: hotel, style: 'campushotel', visit: HOTEL, logoSuffix: 'Hotels', roofDeck: true,
    extras: (b: WorldBuilder, c: GenericCtx) => {
      const { w, d } = c
      // balconies on upper floors (sides)
      for (let k = 3; k < 9; k++) {
        const y = k * 3.6
        for (const s of [-1, 1]) {
          for (let i = 0; i < 5; i++) {
            const z = -d / 2 + 6 + i * ((d - 12) / 4)
            b.box(s * (w / 2 + 0.8), y - 0.2, z, 1.6, 0.2, 3.2, C.offwhite, 'satin')
            b.box(s * (w / 2 + 1.55), y, z, 0.05, 1.0, 3.2, C.glassTint, 'glass')
          }
        }
      }
      // restaurant terrace with parasols
      b.at(-w / 2 - 8, 0, d / 4, 0, () => {
        b.box(0, 0, 0, 12, 0.3, 18, '#9b7652', 'satin', { col: true })
        for (let i = 0; i < 6; i++) {
          const x = -3 + (i % 2) * 6
          const z = -6 + Math.floor(i / 2) * 6
          K.meetingTable(b, x, 0.3, z, 0, { len: 1.2, wid: 1.2, seats: 1, top: C.white })
          b.cyl(x, 0.3, z, 0.04, 2.4, C.anthracite, 'metal', { segs: 6 })
          b.cone(x, 2.2, z, 1.6, 0.6, i % 2 ? C.white : C.green, 'satin', 8)
          if (i % 2 === 0) b.npc({ kind: 'sit', x: x, y: 0.3, z: z + 0.95, yaw: Math.PI })
        }
        b.sign(0, 0.35, 9.05, 4, 0.5, textTexture(['Terrasse „De Appel“'], { w: 512, h: 64 }), 0)
      })
      // taxi drop-off
      b.box(w / 2 + 6, 0.005, 0, 6, 0.02, d, '#4a4c4e', 'matte')
      K.car(b, w / 2 + 6, 0, 2, 0, '#f2c12e')
      b.zone('Hotelterrasse', -w / 2 - 8, 0, d / 4, 12, 4, 18, { building: 'hotel' })
    },
  })
}
