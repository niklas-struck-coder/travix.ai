import { C } from '../engine/materials'

/** Typographic Big Apple logo: "Big" black · "Apple" green · leaf · suffix black */
export function Logo({ size = 22, suffix = 'Groups', onDark = false }: { size?: number; suffix?: string; onDark?: boolean }) {
  const dark = onDark ? '#f4f5f2' : C.black
  return (
    <span className="logo" style={{ fontSize: size }}>
      <span style={{ color: dark }}>Big </span>
      <span style={{ color: C.green, position: 'relative' }}>
        Apple
        <svg viewBox="0 0 24 14" style={{ position: 'absolute', right: '-0.15em', top: '-0.55em', width: '0.65em', height: '0.4em' }} aria-hidden>
          <path d="M1 12 C 6 2, 16 0, 23 2 C 19 9, 10 14, 1 12 Z" fill={C.green} />
          <path d="M2 11.5 Q 11 6 22 2.5" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" />
        </svg>
      </span>
      <span style={{ color: dark }}> {suffix}</span>
    </span>
  )
}
