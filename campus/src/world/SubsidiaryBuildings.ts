/**
 * The ten subsidiary headquarters. Each has its own façade style, exterior
 * features and an interior program (2–3 visitable floors).
 */
import { WorldBuilder } from '../engine/builder'
import { C, canvasTex, textTexture } from '../engine/materials'
import { BUILDINGS, type BuildingInfo, type FacadeStyle } from '../config/campus'
import { buildGeneric, ring, type GenericCtx } from './GenericBuilding'
import { PROGRAMS } from '../config/programs'
import * as K from './kits'
import { infoPoint } from './dynamic'

/** exterior features per style (local coords, front at +z) */
function extras(style: FacadeStyle) {
  return (b: WorldBuilder, c: GenericCtx) => {
    const { w, d, H, fh } = c
    switch (style) {
      case 'racing': {
        // F1 car on a lit plinth right next to the entrance
        b.cyl(-10, 0, d / 2 + 8, 4.2, 0.35, C.black, 'gloss', { segs: 40, col: true })
        b.arc(-10, 0.3, d / 2 + 8, 4.22, 0.06, 0, Math.PI * 2, C.green, 'emissive', true, 40)
        K.formulaCar(b, -10, 0.35, d / 2 + 8, 0.95)
        b.floorSign(-10, 0.4, d / 2 + 11.4, 4, 0.45, textTexture(['BAR-01 · Big Apple Groups Racing'], { w: 768, h: 86, bg: '#111312' }), 0)
        infoPoint(b, -10, 1.2, d / 2 + 12.8, 'BAR-01 – das Formel-1-Auto von Big Apple Groups Racing', [
          'Originalgroßes Showcar am Haupteingang des Racing-Headquarters.',
          '1,6-l-V6-Turbo-Hybrid · über 1.000 PS · 0–100 km/h in ca. 2,6 s',
          'Lackierung: Schwarz mit Apple Green und weißen Akzenten.',
          'Drinnen: F1-Showroom, Rennsimulatoren, Race Control und Windkanal.',
        ], { label: 'F1-Auto ansehen', suffix: 'Groups Racing', radius: 4.5 })
        b.npc({ kind: 'stand', x: -6.5, y: 0, z: d / 2 + 12, yaw: Math.PI + 0.8 })
        b.npc({ kind: 'stand', x: -13, y: 0, z: d / 2 + 13, yaw: Math.PI - 0.6 })
        // tyre stacks, checkered start line, team flags
        for (let i = 0; i < 3; i++) K.tyreStack(b, 8 + i * 0.75, 0, d / 2 + 6, 4 - (i % 2), [C.green, '#f2d24b', '#e05d4b'][i])
        b.floorSign(0, 0.02, d / 2 + 4.9, 6, 0.6, checker(), 0)
        for (let i = 0; i < 4; i++) K.flagPole(b, 12 + i * 3, d / 2 + 12, i % 2 ? C.green : C.black, 9)
        // racing stripe across the façade
        b.box(0, H - fh * 1.5, d / 2 + 0.2, w + 0.4, 0.5, 0.1, C.green, 'satin')
        break
      }
      case 'health': {
        // garden with recovery pool, Kneipp path and benches
        b.box(w / 2 + 7, 0, 0, 8, 0.5, 14, C.stone, 'satin', { col: true, noSupport: true })
        b.box(w / 2 + 7, 0.5, 0, 7.2, 0.02, 13.2, '#6fb3c2', 'gloss')
        b.sign(w / 2 + 7, 0.9, -7.05, 3, 0.4, textTexture(['Kneipp-Becken'], { w: 384, h: 64, accent: C.green }), Math.PI)
        for (let i = 0; i < 4; i++) K.bench(b, -w / 2 - 3, 0, -6 + i * 4, Math.PI / 2)
        for (let i = 0; i < 5; i++) K.tree(b, -w / 2 - 8, -8 + i * 4.5, 0.75, 0, i)
        b.box(0, H + 0.5, 0, w - 1, 0.25, d - 1, '#5e8a3a', 'matte') // green roof
        break
      }
      case 'tech': {
        // LED crown + solar roof
        ring(b, w + 0.6, d + 0.6, H + 1.4, 0.18, 0.1, C.green, 'emissive')
        for (let i = 0; i < 6; i++) b.boxTilt(-w / 3 + (i % 3) * (w / 3), H + 0.9, d / 6 + Math.floor(i / 3) * 4, 6, 0.08, 2.8, 0, -0.35, '#1f2a3a', 'gloss')
        // vertical LED media strip next to the entrance
        b.screen({ id: 'tech-led', lx: -w / 2 + 3.5, ly: 4.5, lz: d / 2 + 0.75, w: 4, h: H - 8, slides: [
          { title: 'TECH', lines: ['AI', 'Cloud', 'Code'], kind: 'info' },
        ], suffix: 'Tech' })
        break
      }
      case 'finance': {
        // stone plinth stairs, water basin with green light
        b.box(0, 0, d / 2 + 13, 18, 0.5, 6, C.stoneDark, 'gloss', { col: true })
        b.box(0, 0.5, d / 2 + 13, 17, 0.02, 5, C.water, 'gloss')
        b.box(0, 0.45, d / 2 + 10, 18, 0.06, 0.06, C.green, 'emissive')
        break
      }
      case 'fitness': {
        // office HQ – no training facilities; flags with the club brand at the forecourt
        for (let i = 0; i < 3; i++) K.flagPole(b, w / 2 + 3, d / 2 + 2 + i * 3, i % 2 ? C.green : C.white, 8)
        K.planter(b, -w / 2 - 3, d / 2 - 4, 5, 1.2)
        break
      }
      case 'logistics': {
        // pure office / control centre – the warehouses are elsewhere; small delivery bay only
        b.box(-w / 2 + 6, 0, -d / 2 - 0.05, 4, 3.2, 0.1, '#7d8582', 'metal')
        b.sign(-w / 2 + 6, 4.0, -d / 2 - 0.2, 4.5, 0.6, textTexture(['Anlieferung Post & Büro'], { w: 512, h: 72, accent: C.green }), Math.PI)
        break
      }
      case 'mobility': {
        // cantilevered upper volume over the forecourt
        b.box(0, H - fh, d / 2 + 2.5, w * 0.6, fh, 5, C.white, 'satin')
        b.box(0, H - fh + 1.0, d / 2 + 5.02, w * 0.6 - 1, 2.0, 0.05, C.glassDark, 'facade')
        b.box(0, H - fh - 0.1, d / 2 + 2.5, w * 0.6, 0.12, 5, C.green, 'emissive')
        // mobility station
        b.at(w / 2 + 9, 0, d / 2 + 4, -Math.PI / 2, () => {
          b.box(0, 3.0, 0, 14, 0.25, 4, C.black, 'satin')
          for (const s of [-6.5, 6.5]) b.box(s, 0, -1.6, 0.15, 3.0, 0.15, C.black, 'metal', { col: true })
          b.sign(0, 3.6, 2.05, 6, 0.8, textTexture(['Mobilitätsstation', 'E-Bikes · E-Scooter · Laden'], { w: 512, h: 96, accent: C.green }))
          for (let i = 0; i < 8; i++) K.bike(b, -5.5 + i * 1.0, 0, 0, Math.PI / 2, i % 2 ? C.green : C.black, true)
          for (let i = 0; i < 4; i++) K.scooter(b, 3 + i * 0.8, 0, 1.2, Math.PI / 2)
          K.chargingStation(b, -6, 1.5, 0)
          K.chargingStation(b, 6, 1.5, 0)
        })
        infoPoint(b, w / 2 + 6, 1.3, d / 2 + 4, 'Mobilitätsstation', ['E-Bikes und E-Scooter in Apple Green und Schwarz.', 'Ausleihe per Big Apple App (in dieser Simulation nicht buchbar).', 'Ladeplätze für Mitarbeiterfahrzeuge im Parkhaus.'], { suffix: 'Mobility' })
        // small vehicle presentation
        K.displayPlinth(b, -w / 2 + 7, 0, d / 2 + 9, 0, 5, 2.6, 0.15)
        K.car(b, -w / 2 + 7, 0.15, d / 2 + 9, Math.PI / 2, C.green)
        break
      }
      case 'hotels': {
        b.box(0, 0, d / 2 + 0.6, w - 4, 0.6, 0.8, C.anthracite, 'satin')
        for (let i = 0; i < 4; i++) K.tree(b, -w / 2 + 4 + i * ((w - 8) / 3), d / 2 + 6, 0.7, 0, i)
        break
      }
      case 'holidays': {
        // stepped terraces with planters on the front
        for (let k = 1; k < c.visitN + 2 && k < Math.round(H / fh); k++) {
          const y = k * fh
          b.box(0, y - 0.2, d / 2 + 1.5, w - 2, 0.25, 3, C.white, 'satin')
          b.box(0, y + 0.05, d / 2 + 2.9, w - 2, 0.5, 0.25, C.woodLight, 'satin')
          for (let i = 0; i < 8; i++) b.ico(-w / 2 + 3 + i * ((w - 6) / 7), y + 0.6, d / 2 + 2.6, 0.45, '#4a7d36', 'matte', 0.8)
        }
        // travel globe sculpture
        b.cyl(-w / 2 - 6, 0, d / 2 + 6, 0.5, 1.4, C.white, 'gloss', { col: true })
        b.sphere(-w / 2 - 6, 2.6, d / 2 + 6, 1.2, '#3a7fb0', 'gloss', 1, 20)
        b.cyl(-w / 2 - 6, 2.55, d / 2 + 6, 1.3, 0.06, C.green, 'emissive', { segs: 32 })
        break
      }
      case 'entertainment': {
        // giant media façade
        b.box(0, 5, d / 2 + 0.3, w - 6, H - 7, 0.2, C.black, 'gloss')
        b.screen({ id: 'ent-media', lx: 0, ly: 5.2, lz: d / 2 + 0.42, w: w - 7, h: H - 7.4, slides: [
          { title: 'BIG APPLE ENTERTAINMENT', lines: ['Neu: „Canals of Amsterdam“', 'Premiere heute 20:00 im Präsentationskino'], kind: 'event' },
          { title: 'CAMPUS NIGHTS', lines: ['Die neue Serie', 'Staffel 1 · jetzt streamen'], kind: 'event' },
          { title: 'STUDIOS', lines: ['Film · Serie · Podcast · Live'], kind: 'event' },
        ], suffix: 'Entertainment' })
        // red carpet
        b.box(0, 0.01, d / 2 + 6, 3, 0.02, 10, '#8c1d24', 'matte')
        for (const s of [-1, 1]) for (let i = 0; i < 4; i++) b.cyl(s * 2, 0, d / 2 + 2 + i * 2.6, 0.08, 1.0, '#c7a14a', 'metal', { segs: 8, col: true })
        break
      }
      case 'trains': {
        // barrel (vaulted) roof like a station hall, glass gables and a green stripe
        const r = d / 2 + 0.3
        b.barrel(0, H + 0.4, 0, r, w + 0.6, C.white, 'satin', 0, 32, 0.4)
        b.barrel(0, H + 0.42, 0, r + 0.05, 1.2, C.green, 'satin', 0, 32, 0.4)
        for (const ez of [-1, 1]) {
          for (let i = 0; i < 16; i++) {
            const z0 = -r + (i + 0.5) * ((2 * r) / 16)
            const hh = Math.sqrt(Math.max(0, r * r - z0 * z0)) * 0.4
            b.box(ez * (w / 2 + 0.2), H + 0.4, z0, 0.06, hh, (2 * r) / 16, C.glassTint, 'facade')
          }
        }
        // full-size train nose on the forecourt
        b.at(-w / 2 - 6, 0, d / 2 + 8, 0.4, () => {
          b.box(0, 0.6, 0, 3.0, 3.4, 8, C.white, 'gloss', { col: true })
          b.box(0, 1.9, 4.2, 2.9, 1.0, 0.5, C.black, 'gloss')
          b.box(0, 1.0, 0, 3.02, 0.25, 8.02, C.green, 'satin')
          b.box(0, 0, 0, 2.6, 0.6, 8, C.anthracite, 'metal')
          b.box(0, 0, 0, 5, 0.15, 12, '#6b6b66', 'matte')
        })
        infoPoint(b, -w / 2 - 3, 1.3, d / 2 + 11, 'Big Apple Trains – „Amstel“', ['Originalgroßer Kopf des neuen Hochgeschwindigkeitszugs.', 'Weiß/Schwarz mit Apple-Green-Linie.'], { suffix: 'Trains' })
        break
      }
      case 'foundation': {
        // green roof, garden
        b.box(0, H + 0.5, 0, w - 1, 0.25, d - 1, '#5e8a3a', 'matte')
        for (let i = 0; i < 6; i++) K.tree(b, -w / 2 - 5 + (i % 3) * 3, d / 2 + 4 + Math.floor(i / 3) * 6, 0.8, 0, i)
        for (let i = 0; i < 3; i++) K.bench(b, w / 2 + 3, 0, d / 2 + 4 + i * 4, -Math.PI / 2)
        break
      }
    }
  }
}

let _checker: ReturnType<typeof canvasTex> | null = null
function checker() {
  if (!_checker) {
    _checker = canvasTex(512, 52, (g) => {
      for (let x = 0; x < 20; x++) for (let y = 0; y < 2; y++) {
        g.fillStyle = (x + y) % 2 ? '#111312' : '#f4f5f2'
        g.fillRect(x * 26, y * 26, 26, 26)
      }
    })
  }
  return _checker
}


/** exterior features of the non-subsidiary generic buildings */
const EXTRAS: Record<string, (b: WorldBuilder, c: GenericCtx) => void> = {
  visitor: (b, c) => {
    const { w, d, H } = c
    // light canopy over the forecourt, flags, banner "Museum · Learning Center"
    b.box(0, H - 0.5, d / 2 + 5, w * 0.6, 0.5, 10, C.white, 'satin')
    b.box(0, H - 0.55, d / 2 + 10, w * 0.6, 0.08, 0.1, C.green, 'emissive')
    for (let i = 0; i < 4; i++) b.cyl(-w * 0.28 + i * ((w * 0.56) / 3), 0, d / 2 + 9.5, 0.2, H - 0.5, C.white, 'satin', { col: true, segs: 12 })
    b.box(w / 4, 3.6, d / 2 + 0.35, 13, 4.2, 0.1, C.black, 'gloss')
    b.sign(w / 4, 3.7, d / 2 + 0.42, 12.6, 4.0, textTexture(['MUSEUM · LEARNING CENTER', 'Big Apple Groups kennenlernen – Eintritt frei'], { w: 1024, h: 320, accent: C.green, size: 70 }), 0, 0.7)
    for (let i = 0; i < 5; i++) K.flagPole(b, -w / 2 + 5 + i * 3, d / 2 + 14, i % 2 ? C.green : C.white, 9)
    for (let i = 0; i < 4; i++) K.bench(b, -w / 4 + i * 4, 0, d / 2 + 16, Math.PI)
    K.bikeRack(b, w / 2 + 4, d / 2 + 4, Math.PI / 2, 8)
  },
  hotel: (b, c) => {
      const { w, d } = c
      // balconies on upper floors (sides)
      for (let k = 3; k < 7; k++) {
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
      b.sign(0, 2.9, d / 2 + 4.43, 6, 0.5, textTexture(['Big Apple Hotel · Amsterdam Campus'], { w: 768, h: 80, accent: C.green }), 0, 0.5)
      b.zone('Hotelterrasse', -w / 2 - 8, 0, d / 4, 12, 4, 18, { building: 'hotel' })
  },
  media: (b, c) => {
    const { w, d, H } = c
    // functional production building: dark cladding, roof technology, OB van, "ON AIR" light
    for (let i = 0; i < 3; i++) b.box(-w / 3 + i * (w / 3), H + 0.5, 0, 4, 2.2, 3, '#9da19e', 'metal')
    b.box(w / 2 - 5, H + 0.5, -d / 4, 0.3, 6, 0.3, '#9da19e', 'metal')
    b.cyl(w / 2 - 5, H + 6.5, -d / 4, 0.9, 0.2, C.white, 'satin', { segs: 16 })
    b.box(-w / 4, H - 2.2, d / 2 + 0.3, 6, 1.0, 0.15, '#b3261e', 'emissive')
    b.sign(-w / 4, H - 1.7, d / 2 + 0.39, 5.6, 0.9, textTexture(['ON AIR'], { w: 512, h: 96, bg: '#b3261e' }), 0, 0.9)
    b.at(w / 2 + 6, 0, d / 2 - 4, Math.PI / 2, () => {
      b.box(0, 0.5, 0, 2.5, 3.2, 9, C.white, 'satin', { col: true })
      b.box(0, 3.7, 1, 1.2, 0.9, 1.2, C.anthracite, 'metal')
      b.sign(0, 2.2, 4.52, 2.3, 0.5, textTexture(['Big Apple Media Center'], { w: 512, h: 100, bg: '#ffffff' }))
      for (const sx of [-1.1, 1.1]) for (const sz of [-3, 3]) b.cylX(sx, 0.5, sz, 0.5, 0.35, '#151515', 'matte')
    })
  },
}

export function buildSubsidiaries(b: WorldBuilder) {
  for (const info of BUILDINGS) {
    const visit = PROGRAMS[info.id]
    if (!visit || !info.style || info.surfaceOnly) continue
    buildGeneric(b, {
      info: info as BuildingInfo,
      style: info.style,
      visit,
      logoSuffix: info.suffix,
      extras: EXTRAS[info.id] ?? extras(info.style),
      roofDeck: info.id === 'holidays' || info.id === 'tech' || info.id === 'hotel',
      entranceWidth: info.id === 'visitor' ? 4 : undefined,
    })
  }
}
