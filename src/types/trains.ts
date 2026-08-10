export interface TrainOffer {
  id: string
  operator: string
  originName: string
  destinationName: string
  departureTime: string
  arrivalTime: string
  duration: string
  transfers: number
  classes: string[]
  totalAmount: string
  totalCurrency: string
}
