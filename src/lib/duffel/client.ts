import type { DuffelError, FlightOffer, FlightSearchParams, FlightSegment, FlightSlice } from '@/types/duffel'
import type { StayOffer, StaySearchParams } from '@/types/stays'

/**
 * Talks only to our own /api/duffel/* dev-server proxy (see
 * vite-plugins/duffel-proxy.ts), which attaches the secret Duffel key
 * server-side. The frontend never sees the key.
 */

interface DuffelResult<T> {
  data: T | null
  errors: DuffelError[]
}

async function callDuffelProxy<T>(path: string, init?: RequestInit): Promise<DuffelResult<T>> {
  try {
    const response = await fetch(`/api/duffel${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
    const json = await response.json()

    if (!response.ok) {
      const rawErrors: { message?: string; code?: string }[] = json?.errors ?? []
      if (rawErrors.length > 0) {
        // Duffel's own error text is English API jargon, not something to show
        // travellers directly — log it for debugging, show an honest, concrete
        // German fallback instead (see MARKENDESIGN.md "Fehlermeldungen (allgemein)").
        console.error('Duffel-Anfrage fehlgeschlagen', response.status, rawErrors)
      }
      const errors: DuffelError[] =
        rawErrors.length > 0
          ? rawErrors.map((error) => ({
              message: 'Die Anfrage bei unserem Reise-Anbieter hat nicht geklappt — bitte prüfe deine Eingaben oder versuche es gleich noch einmal.',
              code: error.code,
            }))
          : [{ message: `Duffel-Anfrage fehlgeschlagen (${response.status}) — bitte versuche es gleich noch einmal.` }]
      return { data: null, errors }
    }
    return { data: json?.data ?? null, errors: [] }
  } catch (error) {
    // Same reasoning as the response.ok === false branch above: a raw
    // network/parse error (e.g. "Failed to fetch", "Unexpected end of JSON
    // input") is English engineering jargon, not something to show
    // travellers directly — log it for debugging, show an honest, concrete
    // German fallback instead (see MARKENDESIGN.md "Fehlermeldungen (allgemein)").
    console.error('Duffel-Anfrage fehlgeschlagen (Netzwerkfehler)', error)
    return {
      data: null,
      errors: [
        {
          message:
            'Die Verbindung zu unserem Reise-Anbieter ist gerade fehlgeschlagen — bitte prüfe deine Internetverbindung oder versuche es gleich noch einmal.',
        },
      ],
    }
  }
}

// Raw Duffel API shapes are only loosely typed here — see FlightOffer for
// the shape the rest of the app actually consumes.
interface RawOfferRequestResponse {
  offers?: RawOffer[]
}

interface RawOffer {
  id: string
  total_amount?: string
  total_currency?: string
  slices?: RawSlice[]
}

interface RawSlice {
  origin?: { iata_code?: string; name?: string }
  destination?: { iata_code?: string; name?: string }
  duration?: string
  segments?: RawSegment[]
}

interface RawSegment {
  operating_carrier?: { name?: string; iata_code?: string }
  departing_at?: string
  arriving_at?: string
  origin?: { iata_code?: string }
  destination?: { iata_code?: string }
}

function mapSegment(segment: RawSegment): FlightSegment {
  return {
    carrierName: segment.operating_carrier?.name ?? 'Unbekannte Fluggesellschaft',
    carrierIata: segment.operating_carrier?.iata_code ?? '—',
    departingAt: segment.departing_at ?? '',
    arrivingAt: segment.arriving_at ?? '',
    originIata: segment.origin?.iata_code ?? '',
    destinationIata: segment.destination?.iata_code ?? '',
  }
}

function mapSlice(slice: RawSlice): FlightSlice {
  return {
    originIata: slice.origin?.iata_code ?? '',
    originName: slice.origin?.name ?? '',
    destinationIata: slice.destination?.iata_code ?? '',
    destinationName: slice.destination?.name ?? '',
    duration: slice.duration ?? '',
    segments: (slice.segments ?? []).map(mapSegment),
  }
}

function mapOffer(offer: RawOffer): FlightOffer {
  return {
    id: offer.id,
    totalAmount: offer.total_amount ?? '0',
    totalCurrency: offer.total_currency ?? '',
    slices: (offer.slices ?? []).map(mapSlice),
  }
}

export async function searchFlights(
  params: FlightSearchParams,
): Promise<{ offers: FlightOffer[]; errors: DuffelError[] }> {
  const slices = [{ origin: params.origin, destination: params.destination, departure_date: params.departureDate }]
  if (params.returnDate) {
    slices.push({ origin: params.destination, destination: params.origin, departure_date: params.returnDate })
  }

  const result = await callDuffelProxy<RawOfferRequestResponse>('/air/offer_requests?return_offers=true', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        slices,
        passengers: Array.from({ length: params.passengers }, () => ({ type: 'adult' })),
        cabin_class: params.cabinClass,
      },
    }),
  })

  return {
    offers: (result.data?.offers ?? []).map(mapOffer),
    errors: result.errors,
  }
}

// Duffel Stays is a newer product than Duffel Flights and its exact response
// shape wasn't verifiable without a live key, so this parses defensively
// (optional chaining, multiple fallback field names) — worst case it shows
// "no results" rather than crashing. Revisit field names against a real
// response once a key is available.
interface RawStaySearchResponse {
  results?: RawStayResult[]
  accommodations?: RawStayResult[]
}

interface RawStayResult {
  id?: string
  accommodation?: {
    id?: string
    name?: string
    rating?: number
    location?: { address?: { line_one?: string; city_name?: string } }
    photos?: { url?: string }[]
  }
  cheapest_rate_total_amount?: string
  cheapest_rate_currency?: string
  total_amount?: string
  total_currency?: string
}

function mapStayResult(result: RawStayResult): StayOffer {
  const accommodation = result.accommodation
  const address = accommodation?.location?.address
  return {
    id: result.id ?? accommodation?.id ?? crypto.randomUUID(),
    accommodationName: accommodation?.name ?? 'Unbekannte Unterkunft',
    rating: accommodation?.rating ?? null,
    address: [address?.line_one, address?.city_name].filter(Boolean).join(', '),
    totalAmount: result.cheapest_rate_total_amount ?? result.total_amount ?? '0',
    totalCurrency: result.cheapest_rate_currency ?? result.total_currency ?? '',
    photoUrl: accommodation?.photos?.[0]?.url ?? null,
  }
}

export async function searchStays(
  params: StaySearchParams,
): Promise<{ offers: StayOffer[]; errors: DuffelError[] }> {
  const result = await callDuffelProxy<RawStaySearchResponse>('/stays/search', {
    method: 'POST',
    body: JSON.stringify({
      data: {
        check_in_date: params.checkInDate,
        check_out_date: params.checkOutDate,
        rooms: params.rooms,
        guests: Array.from({ length: params.guests }, () => ({ type: 'adult' })),
        location: {
          radius: 5,
          geographic_coordinates: { latitude: params.latitude, longitude: params.longitude },
        },
      },
    }),
  })

  const rawResults = result.data?.results ?? result.data?.accommodations ?? []
  return {
    offers: rawResults.map(mapStayResult),
    errors: result.errors,
  }
}
