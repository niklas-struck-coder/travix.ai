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
}

// Curated list so the chat flow can trigger a real Duffel Stays search
// without needing a full place-autocomplete integration yet.
export const knownDestinations: KnownDestination[] = [
  { name: 'Lissabon', latitude: 38.7223, longitude: -9.1393 },
  { name: 'Kyoto', latitude: 35.0116, longitude: 135.7681 },
  { name: 'Kapstadt', latitude: -33.9249, longitude: 18.4241 },
  { name: 'Reykjavik', latitude: 64.1466, longitude: -21.9426 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Rom', latitude: 41.9028, longitude: 12.4964 },
  { name: 'Barcelona', latitude: 41.3874, longitude: 2.1686 },
  { name: 'New York', latitude: 40.7128, longitude: -74.006 },
]

export function findKnownDestination(query: string): KnownDestination | null {
  const normalized = query.trim().toLowerCase()
  return knownDestinations.find((d) => normalized.includes(d.name.toLowerCase())) ?? null
}
