/**
 * Big Apple Visitor Center (Besucherzentrum): visitor reception, company
 * exhibition, auditorium for the Big Apple Innovation Week, press area and
 * conference rooms. Uses the generic building generator.
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
    { name: 'Unternehmensausstellung', kind: 'exhibition', wing: 'R', f0: 0.45, f1: 1, open: true, ctx: { screens: [{ title: 'Big Apple Groups', lines: ['Alle Unternehmen · 1 Markenfamilie', 'Gegründet in Amsterdam'], kind: 'info' }] } },
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

export function buildVisitorCenter(b: WorldBuilder) {
  const conf = buildingById('visitor')
  buildGeneric(b, {
    info: conf, style: 'conference', visit: CONFERENCE, logoSuffix: 'Visitor Center', entranceWidth: 4.0,
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
      b.sign(0, 4.0, -d / 2 - 0.4, 10, 1.1, textTexture(['Big Apple Visitor Center', 'Besucherzentrum · Vorfahrt · Taxi · Parkhaus'], { w: 768, h: 128, accent: C.green }), Math.PI)
    },
  })

}
