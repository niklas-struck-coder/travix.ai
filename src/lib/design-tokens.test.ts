import { describe, expect, it } from 'vitest'
import { colors, fonts, spacing } from '@/lib/design-tokens'

describe('design-tokens', () => {
  it('exposes the three brand colors as hex values', () => {
    expect(colors).toEqual({
      navy: '#0A2342',
      teal: '#00C2A8',
      gold: '#F4B400',
    })
  })

  it('exposes heading and body font stacks with system-ui fallback', () => {
    expect(fonts.heading).toBe("'Sora', system-ui, sans-serif")
    expect(fonts.body).toBe("'Inter', system-ui, sans-serif")
  })

  it('exposes a complete spacing scale from xs to 2xl', () => {
    expect(spacing).toEqual({
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    })
  })
})
