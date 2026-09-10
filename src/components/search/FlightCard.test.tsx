import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FlightCard } from './FlightCard'
import type { FlightOffer } from '@/types/duffel'

// Intl.NumberFormat separates the amount from the currency symbol with a
// non-breaking space (U+00A0), not a regular space.
const NBSP = ' '

const directSlice = {
  originIata: 'BER',
  originName: 'Berlin',
  destinationIata: 'LIS',
  destinationName: 'Lissabon',
  duration: 'PT3H15M',
  segments: [
    {
      carrierName: 'TAP Air Portugal',
      carrierIata: 'TP',
      departingAt: '2026-09-10T08:00:00Z',
      arrivingAt: '2026-09-10T11:15:00Z',
      originIata: 'BER',
      destinationIata: 'LIS',
    },
  ],
}

const baseOffer: FlightOffer = {
  id: '1',
  totalAmount: '249.00',
  totalCurrency: 'EUR',
  slices: [directSlice],
}

describe('FlightCard', () => {
  it('formats the price in German locale instead of showing the raw amount/currency', () => {
    render(<FlightCard offer={baseOffer} />)

    expect(screen.getByText(`249,00${NBSP}€`)).toBeInTheDocument()
    expect(screen.queryByText('249.00 EUR')).not.toBeInTheDocument()
  })

  it('shows the carrier, origin/destination codes and formatted duration for a direct flight', () => {
    render(<FlightCard offer={baseOffer} />)

    expect(screen.getByText('TAP Air Portugal')).toBeInTheDocument()
    expect(screen.getByText('BER')).toBeInTheDocument()
    expect(screen.getByText('LIS')).toBeInTheDocument()
    expect(screen.getByText('3h 15min')).toBeInTheDocument()
  })

  it('does not show a stops badge for a direct flight', () => {
    render(<FlightCard offer={baseOffer} />)

    expect(screen.queryByText(/Zwischenstopp/)).not.toBeInTheDocument()
  })

  it('shows a singular stops badge for one stop', () => {
    const offer: FlightOffer = {
      ...baseOffer,
      slices: [
        {
          ...directSlice,
          segments: [
            directSlice.segments[0],
            { ...directSlice.segments[0], originIata: 'MAD', destinationIata: 'LIS' },
          ],
        },
      ],
    }
    render(<FlightCard offer={offer} />)

    expect(screen.getByText('1 Zwischenstopp')).toBeInTheDocument()
  })

  it('shows a plural stops badge for more than one stop', () => {
    const offer: FlightOffer = {
      ...baseOffer,
      slices: [
        {
          ...directSlice,
          segments: [directSlice.segments[0], directSlice.segments[0], directSlice.segments[0]],
        },
      ],
    }
    render(<FlightCard offer={offer} />)

    expect(screen.getByText('2 Zwischenstopps')).toBeInTheDocument()
  })

  it('does not render a select button when onSelect is not provided', () => {
    render(<FlightCard offer={baseOffer} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onSelect with the offer when the button is clicked', () => {
    const onSelect = vi.fn()
    render(<FlightCard offer={baseOffer} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Auswählen' }))

    expect(onSelect).toHaveBeenCalledWith(baseOffer)
  })

  it('shows a disabled "Ausgewählt" state instead of the select button when selected', () => {
    const onSelect = vi.fn()
    render(<FlightCard offer={baseOffer} onSelect={onSelect} selected />)

    const button = screen.getByRole('button', { name: 'Ausgewählt' })
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
