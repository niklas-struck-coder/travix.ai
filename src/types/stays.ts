export interface StayOffer {
  id: string
  accommodationName: string
  rating: number | null
  address: string
  totalAmount: string
  totalCurrency: string
  photoUrl: string | null
}

export interface StaySearchParams {
  latitude: number
  longitude: number
  checkInDate: string
  checkOutDate: string
  rooms: number
  guests: number
}

export interface KnownDestination {
  name: string
  latitude: number
  longitude: number
  /** Nearest major airport, so the chat can also trigger a real Duffel Flights search. */
  iataCode: string
}

// Curated list so the chat flow can trigger a real Duffel Stays/Flights
// search without needing a full place-autocomplete integration yet.
export const knownDestinations: KnownDestination[] = [
  { name: 'Lissabon', latitude: 38.7223, longitude: -9.1393, iataCode: 'LIS' },
  { name: 'Kyoto', latitude: 35.0116, longitude: 135.7681, iataCode: 'KIX' },
  { name: 'Kapstadt', latitude: -33.9249, longitude: 18.4241, iataCode: 'CPT' },
  { name: 'Reykjavik', latitude: 64.1466, longitude: -21.9426, iataCode: 'KEF' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, iataCode: 'CDG' },
  { name: 'Rom', latitude: 41.9028, longitude: 12.4964, iataCode: 'FCO' },
  { name: 'Barcelona', latitude: 41.3874, longitude: 2.1686, iataCode: 'BCN' },
  { name: 'New York', latitude: 40.7128, longitude: -74.006, iataCode: 'JFK' },
]

export function findKnownDestination(query: string): KnownDestination | null {
  const normalized = query.trim().toLowerCase()
  return (
    knownDestinations.find((d) => {
      const name = d.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`\\b${name}\\b`).test(normalized)
    }) ?? null
  )
}
