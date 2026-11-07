/**
 * Big Apple Hotels on campus: the Campus Hotel (guests) and the
 * Mitarbeiter-Residenz (hotel for travelling employees).
 * Both reuse the generic building generator with their own programs.
 */
import { WorldBuilder } from '../engine/builder'
import { C, textTexture } from '../engine/materials'
import { buildingById } from '../config/campus'
import { buildGeneric, type FloorSpec, type GenericCtx } from './GenericBuilding'
import * as K from './kits'

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

const STAFF: FloorSpec[] = [
  { label: 'EG', rooms: [
    { name: 'Lobby & Rezeption', kind: 'reception', wing: 'C' },
    { name: 'Gemeinschaftsküche & Lounge', kind: 'canteen', wing: 'L', open: true },
    { name: 'Co-Working', kind: 'openoffice', wing: 'R', f0: 0.5, f1: 1, open: true },
    { name: 'Waschsalon & Fitnessraum', kind: 'cardio', wing: 'R', f0: 0, f1: 0.5 },
  ] },
  { label: '1. OG Apartments', rooms: [
    ...Array.from({ length: 5 }, (_, i) => ({ name: `Apartment ${101 + i}`, kind: 'hotelroom' as const, wing: 'L' as const, f0: i / 5, f1: (i + 1) / 5 })),
    ...Array.from({ length: 5 }, (_, i) => ({ name: `Apartment ${106 + i}`, kind: 'hotelroom' as const, wing: 'R' as const, f0: i / 5, f1: (i + 1) / 5 })),
    { name: 'Flur', kind: 'empty' as const, wing: 'C' as const },
  ] },
  { label: '2. OG Apartments', rooms: [
    ...Array.from({ length: 5 }, (_, i) => ({ name: `Apartment ${201 + i}`, kind: 'hotelroom' as const, wing: 'L' as const, f0: i / 5, f1: (i + 1) / 5 })),
    ...Array.from({ length: 5 }, (_, i) => ({ name: `Apartment ${206 + i}`, kind: 'hotelroom' as const, wing: 'R' as const, f0: i / 5, f1: (i + 1) / 5 })),
    { name: 'Gemeinschaftsraum', kind: 'lounge' as const, wing: 'C' as const },
  ] },
]

export function buildHotels(b: WorldBuilder) {
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

  const staff = buildingById('staffhotel')
  buildGeneric(b, {
    info: staff, style: 'staffhotel', visit: STAFF, logoSuffix: 'Hotels', roofDeck: true,
    extras: (b: WorldBuilder, c: GenericCtx) => {
      const { w, d, fh, H } = c
      // wooden balcony bands on the sides
      for (let k = 3; k < Math.round(H / fh); k++) {
        for (const s of [-1, 1]) {
          b.box(s * (w / 2 + 0.7), k * fh - 0.2, 0, 1.4, 0.2, d - 4, C.woodLight, 'satin')
          b.box(s * (w / 2 + 1.38), k * fh, 0, 0.05, 1.0, d - 4, C.glassTint, 'glass')
        }
      }
      b.sign(0, 2.9, d / 2 + 4.43, 5, 0.5, textTexture(['Mitarbeiter-Residenz · Staff Hotel'], { w: 768, h: 80, accent: C.green }), 0, 0.5)
      K.bikeRack(b, w / 2 + 4, d / 2 + 2, Math.PI / 2, 8)
      for (let i = 0; i < 3; i++) K.bench(b, -w / 2 - 3, 0, d / 2 - 4 - i * 4, Math.PI / 2)
      b.npc({ kind: 'walk', path: [[0, 0, d / 2 + 10], [0, 0, d / 2 + 30]], loop: false })
    },
  })
}
