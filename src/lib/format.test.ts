import { describe, expect, it } from 'vitest'
import { formatEuro, formatOfferPrice, formatDuration, summarizeFlightOffer } from '@/lib/format'
import type { FlightOffer } from '@/types/duffel'

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

describe('formatDuration', () => {
  it('formats hours and minutes', () => {
    expect(formatDuration('PT3H15M')).toBe('3h 15min')
  })

  it('omits the minutes part for a whole-hour duration instead of showing "0min"', () => {
    expect(formatDuration('PT4H0M')).toBe('4h')
  })

  it('formats a duration with a days component instead of showing the raw ISO string', () => {
    expect(formatDuration('P1DT2H30M')).toBe('26h 30min')
  })

  it('formats a duration with only a days component (no explicit time part)', () => {
    expect(formatDuration('P1D')).toBe('24h')
  })

  it('shows a placeholder dash instead of a fabricated minute for a sub-minute (seconds-only) duration', () => {
    expect(formatDuration('PT45S')).toBe('—')
  })

  it('shows a placeholder dash for a missing duration', () => {
    expect(formatDuration('')).toBe('—')
  })

  it('returns the raw string for an unparseable duration', () => {
    expect(formatDuration('not-a-duration')).toBe('not-a-duration')
  })
})

function makeOffer(overrides: Partial<FlightOffer> = {}): FlightOffer {
  return {
    id: '1',
    totalAmount: '149.00',
    totalCurrency: 'EUR',
    slices: [
      {
        originIata: 'BER',
        originName: 'Berlin',
        destinationIata: 'LIS',
        destinationName: 'Lissabon',
        duration: 'PT2H30M',
        segments: [
          {
            carrierName: 'Test Airline',
            carrierIata: 'TA',
            departingAt: '2026-01-01T10:00:00Z',
            arrivingAt: '2026-01-01T12:30:00Z',
            originIata: 'BER',
            destinationIata: 'LIS',
          },
        ],
      },
    ],
    ...overrides,
  }
}

describe('summarizeFlightOffer', () => {
  it('summarizes airline, route and price', () => {
    expect(summarizeFlightOffer(makeOffer())).toBe(`Test Airline · Berlin → Lissabon · 149,00${NBSP}€`)
  })

  it('falls back to the IATA code when the location name is missing', () => {
    const offer = makeOffer({
      slices: [
        {
          originIata: 'BER',
          originName: '',
          destinationIata: 'LIS',
          destinationName: '',
          duration: 'PT2H30M',
          segments: [
            {
              carrierName: 'Test Airline',
              carrierIata: 'TA',
              departingAt: '2026-01-01T10:00:00Z',
              arrivingAt: '2026-01-01T12:30:00Z',
              originIata: 'BER',
              destinationIata: 'LIS',
            },
          ],
        },
      ],
    })
    expect(summarizeFlightOffer(offer)).toBe(`Test Airline · BER → LIS · 149,00${NBSP}€`)
  })

  it('falls back to a generic label when the carrier name is missing', () => {
    const offer = makeOffer()
    offer.slices[0].segments[0].carrierName = ''
    expect(summarizeFlightOffer(offer)).toBe(`Fluggesellschaft unbekannt · Berlin → Lissabon · 149,00${NBSP}€`)
  })
})
