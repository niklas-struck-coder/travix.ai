import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchFlights } from './client'

const baseParams = {
  origin: 'BER',
  destination: 'LIS',
  departureDate: '2026-09-01',
  passengers: 1,
  cabinClass: 'economy' as const,
}

describe('searchFlights error handling', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('replaces raw Duffel API error text with an honest German fallback', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          errors: [{ message: 'slices[0].origin: could not be resolved', code: 'invalid_input' }],
        }),
      }),
    )

    const result = await searchFlights(baseParams)

    expect(result.offers).toEqual([])
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).not.toMatch(/slices\[0\]/)
    expect(result.errors[0].message).toContain('Reise-Anbieter')
    expect(result.errors[0].code).toBe('invalid_input')
  })

  it('falls back to a status-based German message when Duffel returns no error details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      }),
    )

    const result = await searchFlights(baseParams)

    expect(result.errors).toEqual([
      { message: 'Duffel-Anfrage fehlgeschlagen (500) — bitte versuche es gleich noch einmal.' },
    ])
  })

  it('replaces a raw network/parse error with an honest German fallback instead of showing it verbatim', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    )

    const result = await searchFlights(baseParams)

    expect(result.offers).toEqual([])
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).not.toMatch(/Failed to fetch/)
    expect(result.errors[0].message).toContain('Reise-Anbieter')
  })
})
