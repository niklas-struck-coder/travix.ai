import { describe, expect, it } from 'vitest'
import { formatOfferPrice } from '@/lib/format'

// Intl.NumberFormat separates the amount from the currency symbol with a
// non-breaking space (U+00A0), not a regular space.
const NBSP = ' '

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
})
