export const TRAVEL_STYLES = [
  'Strand & Erholung',
  'Städtereisen',
  'Abenteuer & Aktiv',
  'Kultur & Geschichte',
  'Familienurlaub',
  'Luxus',
  'Budget & Backpacking',
  'Natur & Wandern',
] as const

export type TravelStyle = (typeof TRAVEL_STYLES)[number]

export const BUDGET_RANGES = [
  { value: 'sparsam', label: 'Sparsam' },
  { value: 'mittelklasse', label: 'Mittelklasse' },
  { value: 'komfortabel', label: 'Komfortabel' },
  { value: 'luxus', label: 'Luxus' },
] as const

export type BudgetRange = (typeof BUDGET_RANGES)[number]['value']

export const DIETARY_RESTRICTIONS = [
  'Vegetarisch',
  'Vegan',
  'Glutenfrei',
  'Laktosefrei',
  'Halal',
  'Koscher',
] as const

export type DietaryRestriction = (typeof DIETARY_RESTRICTIONS)[number]

export interface TravelPreferences {
  travelStyles: TravelStyle[]
  budgetRange: BudgetRange | null
  dietaryRestrictions: DietaryRestriction[]
  homeAirport: string | null
}

export const emptyPreferences: TravelPreferences = {
  travelStyles: [],
  budgetRange: null,
  dietaryRestrictions: [],
  homeAirport: null,
}
