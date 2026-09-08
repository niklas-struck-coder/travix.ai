import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TrainCard } from './TrainCard'
import type { TrainOffer } from '@/types/trains'

// Intl.NumberFormat separates the amount from the currency symbol with a
// non-breaking space (U+00A0), not a regular space.
const NBSP = ' '

const baseOffer: TrainOffer = {
  id: '1',
  operator: 'Deutsche Bahn',
  originName: 'Berlin Hbf',
  destinationName: 'München Hbf',
  departureTime: '2026-09-10T08:00:00Z',
  arrivalTime: '2026-09-10T12:00:00Z',
  duration: 'PT4H0M',
  transfers: 0,
  classes: ['2. Klasse'],
  totalAmount: '129.00',
  totalCurrency: 'EUR',
}

describe('TrainCard', () => {
  it('formats the price in German locale instead of showing the raw amount/currency', () => {
    render(<TrainCard offer={baseOffer} />)

    expect(screen.getByText(`129,00${NBSP}€`)).toBeInTheDocument()
    expect(screen.queryByText('129.00 EUR')).not.toBeInTheDocument()
  })
})
