import { describe, expect, it } from 'vitest'
import { formatEuro, formatOfferPrice } from '@/lib/format'

// Intl.NumberFormat separates the amount from the currency symbol with a
// non-breaking space (U+00A0), not a regular space.
const NBSP = ' '

describe('formatEuro', () => {
  it('formats a whole-number amount with the euro sign', () => {
    expect(formatEuro(249)).toBe('249 €')
  })

  it('formats a four-digit amount with the German thousands separator', () => {
    expect(formatEuro(1200)).toBe('1.200 €')
  })

  it('formats zero', () => {
    expect(formatEuro(0)).toBe('0 €')
  })
})

describe('formatOfferPrice', () => {
  it('formats a EUR amount in German locale', () => {
    expect(formatOfferPrice('249.00', 'EUR')).toBe(`249,00${NBSP}€`)
  })

  it('formats an amount with cents', () => {
    expect(formatOfferPrice('149.99', 'EUR')).toBe(`149,99${NBSP}€`)
  })

  it('formats a non-EUR currency with its symbol/code', () => {
    expect(formatOfferPrice('99.50', 'USD')).toBe(`99,50${NBSP}$`)
  })

  it('falls back to the raw amount and currency for a non-numeric amount', () => {
    expect(formatOfferPrice('n/a', 'EUR')).toBe('n/a EUR')
  })

  it('falls back to the raw amount and currency for an empty currency code instead of throwing', () => {
    expect(formatOfferPrice('249.00', '')).toBe('249.00 ')
  })

  it('falls back to the raw amount and currency for an invalid currency code instead of throwing', () => {
    expect(formatOfferPrice('249.00', 'XXXX')).toBe('249.00 XXXX')
  })
})
