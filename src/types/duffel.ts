export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first'

export interface FlightSearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
  cabinClass: CabinClass
}

export interface FlightSegment {
  carrierName: string
  carrierIata: string
  departingAt: string
  arrivingAt: string
  originIata: string
  destinationIata: string
}

export interface FlightSlice {
  originIata: string
  originName: string
  destinationIata: string
  destinationName: string
  duration: string
  segments: FlightSegment[]
}

export interface FlightOffer {
  id: string
  totalAmount: string
  totalCurrency: string
  slices: FlightSlice[]
}

export interface DuffelError {
  message: string
  code?: string
}
