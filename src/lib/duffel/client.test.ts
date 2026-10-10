import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchFlights, searchStays } from './client'

const baseParams = {
  origin: 'BER',
  destination: 'LIS',
  departureDate: '2026-09-01',
  passengers: 1,
  cabinClass: 'economy' as const,
}

const baseStayParams = {
  latitude: 38.7223,
  longitude: -9.1393,
  checkInDate: '2026-09-01',
  checkOutDate: '2026-09-08',
  rooms: 1,
  guests: 1,
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

  it('replaces a raw fetch failure (e.g. offline) with an honest German fallback', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new TypeError('Failed to fetch')),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await searchFlights(baseParams)

    expect(result.offers).toEqual([])
    expect(result.errors).toEqual([
      {
        message:
          'Die Anfrage bei unserem Reise-Anbieter hat gerade nicht geklappt — bitte prüfe deine Internetverbindung oder versuche es gleich noch einmal.',
      },
    ])
  })

  it('falls back to a status-based German message when an error response has no JSON body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => {
          throw new SyntaxError('Unexpected token < in JSON at position 0')
        },
      }),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await searchFlights(baseParams)

    expect(result.offers).toEqual([])
    expect(result.errors).toEqual([
      { message: 'Duffel-Anfrage fehlgeschlagen (502) — bitte versuche es gleich noch einmal.' },
    ])
  })

  it('replaces a broken JSON response with an honest German fallback', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token < in JSON at position 0')
        },
      }),
    )
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await searchFlights(baseParams)

    expect(result.offers).toEqual([])
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).not.toMatch(/JSON/)
    expect(result.errors[0].message).toContain('Reise-Anbieter')
  })
})

describe('searchFlights mapping', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps a full Duffel offer to the FlightOffer shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            offers: [
              {
                id: 'off_1',
                total_amount: '199.00',
                total_currency: 'EUR',
                slices: [
                  {
                    origin: { iata_code: 'BER', name: 'Berlin' },
                    destination: { iata_code: 'LIS', name: 'Lissabon' },
                    duration: 'PT3H',
                    segments: [
                      {
                        operating_carrier: { name: 'Lufthansa', iata_code: 'LH' },
                        departing_at: '2026-09-01T08:00:00',
                        arriving_at: '2026-09-01T11:00:00',
                        origin: { iata_code: 'BER' },
                        destination: { iata_code: 'LIS' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        }),
      }),
    )

    const result = await searchFlights(baseParams)

    expect(result.errors).toEqual([])
    expect(result.offers).toEqual([
      {
        id: 'off_1',
        totalAmount: '199.00',
        totalCurrency: 'EUR',
        slices: [
          {
            originIata: 'BER',
            originName: 'Berlin',
            destinationIata: 'LIS',
            destinationName: 'Lissabon',
            duration: 'PT3H',
            segments: [
              {
                carrierName: 'Lufthansa',
                carrierIata: 'LH',
                departingAt: '2026-09-01T08:00:00',
                arrivingAt: '2026-09-01T11:00:00',
                originIata: 'BER',
                destinationIata: 'LIS',
              },
            ],
          },
        ],
      },
    ])
  })

  it('falls back to honest placeholder values for missing offer/slice/segment fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            offers: [
              {
                id: 'off_2',
                slices: [{ segments: [{}] }],
              },
            ],
          },
        }),
      }),
    )

    const result = await searchFlights(baseParams)

    expect(result.offers).toEqual([
      {
        id: 'off_2',
        totalAmount: '0',
        totalCurrency: '',
        slices: [
          {
            originIata: '',
            originName: '',
            destinationIata: '',
            destinationName: '',
            duration: '',
            segments: [
              {
                carrierName: 'Unbekannte Fluggesellschaft',
                carrierIata: '—',
                departingAt: '',
                arrivingAt: '',
                originIata: '',
                destinationIata: '',
              },
            ],
          },
        ],
      },
    ])
  })

  it('returns an empty offer list when the response has no offers at all', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: {} }),
      }),
    )

    const result = await searchFlights(baseParams)

    expect(result.offers).toEqual([])
  })
})

describe('searchStays mapping', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('maps a full Duffel stay result to the StayOffer shape', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: {
            results: [
              {
                id: 'res_1',
                accommodation: {
                  id: 'acc_1',
                  name: 'Hotel Lissabon',
                  rating: 4.5,
                  location: { address: { line_one: 'Rua A', city_name: 'Lissabon' } },
                  photos: [{ url: 'https://example.com/photo.jpg' }],
                },
                cheapest_rate_total_amount: '120.00',
                cheapest_rate_currency: 'EUR',
              },
            ],
          },
        }),
      }),
    )

    const result = await searchStays(baseStayParams)

    expect(result.errors).toEqual([])
    expect(result.offers).toEqual([
      {
        id: 'res_1',
        accommodationName: 'Hotel Lissabon',
        rating: 4.5,
        address: 'Rua A, Lissabon',
        totalAmount: '120.00',
        totalCurrency: 'EUR',
        photoUrl: 'https://example.com/photo.jpg',
      },
    ])
  })

  it('falls back to honest placeholder values for missing result/accommodation fields', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: { results: [{}] },
        }),
      }),
    )

    const result = await searchStays(baseStayParams)

    expect(result.offers[0].accommodationName).toBe('Unbekannte Unterkunft')
    expect(result.offers[0].rating).toBeNull()
    expect(result.offers[0].address).toBe('')
    expect(result.offers[0].totalAmount).toBe('0')
    expect(result.offers[0].totalCurrency).toBe('')
    expect(result.offers[0].photoUrl).toBeNull()
    expect(typeof result.offers[0].id).toBe('string')
    expect(result.offers[0].id.length).toBeGreaterThan(0)
  })

  it('falls back to the top-level total_amount/currency when no cheapest-rate fields are present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: { results: [{ id: 'res_2', total_amount: '80.00', total_currency: 'USD' }] },
        }),
      }),
    )

    const result = await searchStays(baseStayParams)

    expect(result.offers[0].totalAmount).toBe('80.00')
    expect(result.offers[0].totalCurrency).toBe('USD')
  })

  it('falls back to the accommodations field when results is absent', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          data: { accommodations: [{ id: 'res_3', accommodation: { name: 'Hostel Kyoto' } }] },
        }),
      }),
    )

    const result = await searchStays(baseStayParams)

    expect(result.offers).toHaveLength(1)
    expect(result.offers[0].accommodationName).toBe('Hostel Kyoto')
  })
})
