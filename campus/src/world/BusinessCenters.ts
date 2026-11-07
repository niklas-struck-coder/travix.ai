/**
 * Big Apple Business Centers: houses for Big Apple companies that are not (yet)
 * big enough for their own headquarters. Each has a tenant directory board at
 * the entrance and in the lobby; every tenant gets its own office space.
 */
import { WorldBuilder } from '../engine/builder'
import { C, directoryTexture, textTexture } from '../engine/materials'
import { BUILDINGS } from '../config/campus'
import { buildGeneric, type GenericCtx } from './GenericBuilding'
import { businessProgram } from '../config/programs'
import { infoPoint } from './dynamic'
import * as K from './kits'

export function buildBusinessCenters(b: WorldBuilder) {
  for (const info of BUILDINGS.filter((x) => x.tenants)) {
    const tenants = info.tenants!
    buildGeneric(b, {
      info, style: 'business', visit: businessProgram(tenants), logoSuffix: 'Business Center',
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
