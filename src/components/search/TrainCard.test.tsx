import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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

  it('formats a duration with a days component instead of showing the raw ISO string', () => {
    const offer: TrainOffer = { ...baseOffer, duration: 'P1DT2H30M' }
    render(<TrainCard offer={offer} />)

    expect(screen.getByText('26h 30min')).toBeInTheDocument()
    expect(screen.queryByText('P1DT2H30M')).not.toBeInTheDocument()
  })

  it('shows a placeholder dash instead of a blank duration when it is missing', () => {
    const offer: TrainOffer = { ...baseOffer, duration: '' }
    render(<TrainCard offer={offer} />)

    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('omits the minutes part for a whole-hour duration instead of showing "0min"', () => {
    render(<TrainCard offer={baseOffer} />)

    expect(screen.getByText('4h')).toBeInTheDocument()
    expect(screen.queryByText('4h 0min')).not.toBeInTheDocument()
  })

  it('shows a disabled "Ausgewählt" state instead of the select button when selected', () => {
    const onSelect = vi.fn()
    render(<TrainCard offer={baseOffer} onSelect={onSelect} selected />)

    const button = screen.getByRole('button', { name: 'Ausgewählt' })
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
