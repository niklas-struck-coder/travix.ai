/**
 * Big Apple Business Centers: houses for Big Apple companies that are not (yet)
 * big enough for their own headquarters. Each has a tenant directory board at
 * the entrance and in the lobby; every tenant gets its own office space.
 */
import { WorldBuilder } from '../engine/builder'
import { C, directoryTexture, textTexture } from '../engine/materials'
import { BUILDINGS } from '../config/campus'
import { buildGeneric, type FloorSpec, type GenericCtx, type RoomSpec } from './GenericBuilding'
import { infoPoint } from './dynamic'
import * as K from './kits'
import type { RoomKind } from './rooms'

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

function program(tenants: [string, string, string][]): FloorSpec[] {
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

export function buildBusinessCenters(b: WorldBuilder) {
  for (const info of BUILDINGS.filter((x) => x.tenants)) {
    const tenants = info.tenants!
    buildGeneric(b, {
      info, style: 'business', visit: program(tenants), logoSuffix: 'Business Center',
      extras: (b: WorldBuilder, c: GenericCtx) => {
        const { d } = c
        const title = info.name.replace('Big Apple ', '')
        const tex = directoryTexture(`Mieterverzeichnis · ${title}`, tenants)
        // free-standing directory board ("Tafel") next to the entrance
        b.at(-7.5, 0, d / 2 + 6, 0.25, () => {
          b.box(0, 0, 0, 2.6, 3.6, 0.3, C.anthracite, 'metal', { col: true })
          b.sign(0, 1.85, 0.16, 2.3, 3.2, tex, 0, 0.55)
          b.box(0, 3.6, 0, 2.7, 0.08, 0.32, C.green, 'emissive')
        })
        infoPoint(b, -7.2, 1.3, d / 2 + 7.6, `Mieterverzeichnis – ${info.name}`, tenants.map(([fl, n, f]) => `${fl} · ${n} – ${f}`), { label: 'Mieterverzeichnis lesen', suffix: 'Business Center', radius: 3 })
        // second board inside the lobby, next to the elevator
        b.box(-6.2, 0, -d / 2 + 3.2, 1.8, 2.5, 0.12, C.anthracite, 'metal', { col: true })
        b.sign(-6.2, 1.25, -d / 2 + 3.27, 1.6, 2.2, tex, 0, 0.5)
        infoPoint(b, -6.2, 1.3, -d / 2 + 5.0, `Mieterverzeichnis – ${info.name}`, tenants.map(([fl, n, f]) => `${fl} · ${n} – ${f}`), { label: 'Mieterverzeichnis lesen', suffix: 'Business Center' })
        b.sign(0, 2.9, d / 2 + 4.43, 5.5, 0.5, textTexture(['Haus für junge Big-Apple-Unternehmen'], { w: 768, h: 80, accent: C.green }), 0, 0.5)
        K.bikeRack(b, 9, d / 2 + 5, 0, 6)
      },
    })
  }
}
