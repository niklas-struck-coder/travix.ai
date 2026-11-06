import * as THREE from 'three'

/**
 * Material "families". Every instanced part picks a family and a per-instance
 * colour, which keeps the number of materials (and draw calls) small.
 */
export type Family =
  | 'matte'
  | 'satin'
  | 'gloss'
  | 'metal'
  | 'glass'
  | 'facade'
  | 'emissive'
  | 'nightglow'
  | 'lightpool'

export const families: Record<Family, THREE.Material> = {
  matte: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.88, metalness: 0 }),
  satin: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.05 }),
  gloss: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.16, metalness: 0.1 }),
  metal: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.85 }),
  glass: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.04,
    metalness: 0.5,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    side: THREE.DoubleSide,
    envMapIntensity: 1.6,
  }),
  facade: new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0.75,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    side: THREE.DoubleSide,
    envMapIntensity: 2.0,
  }),
  emissive: new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }),
  nightglow: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }),
  lightpool: new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  }),
}

/** Called by the lighting system whenever the time of day changes. */
export function applyNightFactor(night: number) {
  const e = families.emissive as THREE.MeshBasicMaterial
  e.color.setScalar(0.62 + 0.38 * night)
  const g = families.nightglow as THREE.MeshBasicMaterial
  g.opacity = night * 0.92
  g.visible = night > 0.02
  const p = families.lightpool as THREE.MeshBasicMaterial
  p.opacity = night * 0.32
  p.visible = night > 0.02
}

// ---------------------------------------------------------------------------
// Brand colours
export const C = {
  green: '#7cc242',
  greenDark: '#4f8f22',
  black: '#141615',
  anthracite: '#2a2e2c',
  graphite: '#3b403d',
  white: '#f4f5f2',
  offwhite: '#e6e4de',
  stone: '#cfc9bd',
  stoneDark: '#5a5650',
  wood: '#a87b52',
  woodLight: '#c79f72',
  glassTint: '#bcd8e0',
  glassDark: '#5d7480',
  grass: '#5e8a3a',
  concrete: '#a7a59f',
  asphalt: '#3a3c3e',
  bikeRed: '#9b4a3e',
  water: '#2f5c6e',
  carpet: '#56605c',
  leather: '#2b2724',
  fabricGreen: '#5f8f3a',
  fabricGrey: '#8a8d8b',
  brick: '#8a4a32',
  screen: '#0e1412',
}

// ---------------------------------------------------------------------------
// Canvas textures (generated → no external downloads, fast loading)

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, repeat = 1) {
  const cv = document.createElement('canvas')
  cv.width = w
  cv.height = h
  const g = cv.getContext('2d')!
  draw(g)
  const t = new THREE.CanvasTexture(cv)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.anisotropy = 8
  return t
}

function noise(g: CanvasRenderingContext2D, w: number, h: number, n: number, alpha: number, light = false) {
  for (let i = 0; i < n; i++) {
    const v = light ? 255 : 0
    g.fillStyle = `rgba(${v},${v},${v},${Math.random() * alpha})`
    g.fillRect(Math.random() * w, Math.random() * h, 2, 2)
  }
}

let _tex: ReturnType<typeof makeTextures> | null = null
export function textures() {
  if (!_tex) _tex = makeTextures()
  return _tex
}

function makeTextures() {
  const grass = canvasTex(256, 256, (g) => {
    g.fillStyle = '#5b8738'
    g.fillRect(0, 0, 256, 256)
    for (let i = 0; i < 5000; i++) {
      const s = Math.random()
      g.fillStyle = s > 0.5 ? 'rgba(120,160,70,0.35)' : 'rgba(40,70,25,0.3)'
      g.fillRect(Math.random() * 256, Math.random() * 256, 1, 3)
    }
  })
  const paving = canvasTex(256, 256, (g) => {
    g.fillStyle = '#c9c4b8'
    g.fillRect(0, 0, 256, 256)
    noise(g, 256, 256, 3000, 0.08)
    g.strokeStyle = 'rgba(90,85,78,0.35)'
    g.lineWidth = 2
    for (let i = 0; i <= 4; i++) {
      g.beginPath(); g.moveTo(0, i * 64); g.lineTo(256, i * 64); g.stroke()
      for (let j = 0; j < 2; j++) {
        const off = (i % 2) * 64
        g.beginPath(); g.moveTo(off + j * 128, i * 64); g.lineTo(off + j * 128, i * 64 + 64); g.stroke()
      }
    }
  })
  const asphalt = canvasTex(256, 256, (g) => {
    g.fillStyle = '#3b3d3f'
    g.fillRect(0, 0, 256, 256)
    noise(g, 256, 256, 6000, 0.25, true)
    noise(g, 256, 256, 6000, 0.25)
  })
  const bike = canvasTex(128, 128, (g) => {
    g.fillStyle = '#93473b'
    g.fillRect(0, 0, 128, 128)
    noise(g, 128, 128, 2000, 0.2)
  })
  const stoneFloor = canvasTex(512, 512, (g) => {
    g.fillStyle = '#d9d4ca'
    g.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 30; i++) {
      g.strokeStyle = `rgba(150,140,128,${Math.random() * 0.15})`
      g.lineWidth = Math.random() * 3
      g.beginPath()
      g.moveTo(Math.random() * 512, Math.random() * 512)
      g.bezierCurveTo(Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512)
      g.stroke()
    }
    g.strokeStyle = 'rgba(120,112,100,0.5)'
    g.lineWidth = 2
    g.strokeRect(0, 0, 256, 512)
    g.strokeRect(256, 0, 256, 512)
  })
  const water = canvasTex(256, 256, (g) => {
    const gr = g.createLinearGradient(0, 0, 256, 256)
    gr.addColorStop(0, '#2c5a6b')
    gr.addColorStop(1, '#244d5d')
    g.fillStyle = gr
    g.fillRect(0, 0, 256, 256)
    g.strokeStyle = 'rgba(255,255,255,0.08)'
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * 256
      const y = Math.random() * 256
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 8, y - 3, x + 16, y); g.stroke()
    }
  })
  const parking = canvasTex(256, 256, (g) => {
    g.fillStyle = '#56585a'
    g.fillRect(0, 0, 256, 256)
    noise(g, 256, 256, 3000, 0.15, true)
    g.fillStyle = '#e8e8e8'
    for (let i = 0; i < 4; i++) g.fillRect(i * 64, 0, 4, 120)
    for (let i = 0; i < 4; i++) g.fillRect(i * 64, 136, 4, 120)
  })
  return { grass, paving, asphalt, bike, stoneFloor, water, parking }
}

// ---------------------------------------------------------------------------
// Sign & logo textures

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif'

/** Draws the Big Apple leaf (a simple, clean leaf shape) */
function drawLeaf(g: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  g.save()
  g.translate(x, y)
  g.rotate(-0.55)
  g.fillStyle = color
  g.beginPath()
  g.moveTo(0, 0)
  g.bezierCurveTo(s * 0.35, -s * 0.55, s * 0.95, -s * 0.5, s * 1.1, 0)
  g.bezierCurveTo(s * 0.9, s * 0.45, s * 0.35, s * 0.5, 0, 0)
  g.fill()
  g.strokeStyle = 'rgba(255,255,255,0.55)'
  g.lineWidth = Math.max(1, s * 0.05)
  g.beginPath()
  g.moveTo(s * 0.08, 0)
  g.quadraticCurveTo(s * 0.55, -s * 0.06, s * 1.0, 0)
  g.stroke()
  g.restore()
}

/**
 * Brand logo: "Big" black · "Apple" apple-green · green leaf · "<Suffix>" black.
 * For subsidiaries only the last word changes (Groups → Tech, Finance, …).
 */
export function drawLogo(
  g: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  suffix = 'Groups',
  onDark = false,
) {
  g.save()
  g.font = `700 ${size}px ${FONT}`
  g.textBaseline = 'alphabetic'
  const big = 'Big '
  const apple = 'Apple'
  const suf = ' ' + suffix
  const wBig = g.measureText(big).width
  const wApple = g.measureText(apple).width
  const wSuf = g.measureText(suf).width
  const total = wBig + wApple + wSuf
  let x = cx - total / 2
  const y = cy + size * 0.36
  const dark = onDark ? '#f4f5f2' : C.black
  g.fillStyle = dark
  g.fillText(big, x, y)
  x += wBig
  g.fillStyle = C.green
  g.fillText(apple, x, y)
  // leaf sits on top of the "A" of Apple
  drawLeaf(g, x + wApple * 0.86, y - size * 0.86, size * 0.42, C.green)
  x += wApple
  g.fillStyle = dark
  g.fillText(suf, x, y)
  g.restore()
  return total
}

const signCache = new Map<string, THREE.Texture>()

export function logoTexture(suffix = 'Groups', opts: { w?: number; h?: number; bg?: string; onDark?: boolean } = {}) {
  const w = opts.w ?? 1024
  const h = opts.h ?? 256
  const key = `logo|${suffix}|${w}|${h}|${opts.bg}|${opts.onDark}`
  const hit = signCache.get(key)
  if (hit) return hit
  const t = canvasTex(w, h, (g) => {
    if (opts.bg) {
      g.fillStyle = opts.bg
      g.fillRect(0, 0, w, h)
    } else g.clearRect(0, 0, w, h)
    let size = h * 0.46
    g.font = `700 ${size}px ${FONT}`
    const width = g.measureText(`Big Apple ${suffix}`).width
    if (width > w * 0.88) size *= (w * 0.88) / width
    drawLogo(g, w / 2, h / 2, size, suffix, opts.onDark)
  })
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  signCache.set(key, t)
  return t
}

export function textTexture(
  lines: string[],
  opts: { w?: number; h?: number; bg?: string; fg?: string; accent?: string; size?: number; align?: CanvasTextAlign } = {},
) {
  const w = opts.w ?? 512
  const h = opts.h ?? 128
  const key = `txt|${lines.join('/')}|${w}|${h}|${opts.bg}|${opts.fg}|${opts.size}|${opts.align}`
  const hit = signCache.get(key)
  if (hit) return hit
  const t = canvasTex(w, h, (g) => {
    g.fillStyle = opts.bg ?? C.black
    g.fillRect(0, 0, w, h)
    if (opts.accent) {
      g.fillStyle = opts.accent
      g.fillRect(0, h - h * 0.06, w, h * 0.06)
    }
    const size = opts.size ?? h * 0.34
    const align = opts.align ?? 'center'
    g.textAlign = align
    g.textBaseline = 'middle'
    const x = align === 'center' ? w / 2 : align === 'left' ? w * 0.05 : w * 0.95
    lines.forEach((ln, i) => {
      const s = i === 0 ? size : size * 0.62
      g.font = `${i === 0 ? 700 : 400} ${s}px ${FONT}`
      g.fillStyle = i === 0 ? (opts.fg ?? '#ffffff') : 'rgba(255,255,255,0.75)'
      if (opts.bg === '#ffffff' || opts.bg === C.white) g.fillStyle = i === 0 ? C.black : '#555'
      const total = lines.length
      const y = h / 2 + (i - (total - 1) / 2) * size * 1.05
      g.fillText(ln, x, y)
    })
  })
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  signCache.set(key, t)
  return t
}

export { canvasTex, FONT }
