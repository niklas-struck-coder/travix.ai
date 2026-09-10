import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HotelCard } from './HotelCard'
import type { StayOffer } from '@/types/stays'

// Intl.NumberFormat separates the amount from the currency symbol with a
// non-breaking space (U+00A0), not a regular space.
const NBSP = ' '

const baseOffer: StayOffer = {
  id: '1',
  accommodationName: 'Hotel Lisboa Mar',
  rating: null,
  address: '',
  totalAmount: '180.00',
  totalCurrency: 'EUR',
  photoUrl: null,
}

describe('HotelCard', () => {
  it('formats the price in German locale instead of showing the raw amount/currency', () => {
    render(<HotelCard offer={baseOffer} />)

    expect(screen.getByText(`180,00${NBSP}€`)).toBeInTheDocument()
    expect(screen.queryByText('180.00 EUR')).not.toBeInTheDocument()
  })

  it('shows the accommodation name', () => {
    render(<HotelCard offer={baseOffer} />)

    expect(screen.getByText('Hotel Lisboa Mar')).toBeInTheDocument()
  })

  it('does not show a rating when rating is null', () => {
    render(<HotelCard offer={baseOffer} />)

    expect(screen.queryByText(/^\d\.\d$/)).not.toBeInTheDocument()
  })

  it('shows the rating rounded to one decimal when present', () => {
    render(<HotelCard offer={{ ...baseOffer, rating: 4.567 }} />)

    expect(screen.getByText('4.6')).toBeInTheDocument()
  })

  it('does not show an address when it is empty', () => {
    const { container } = render(<HotelCard offer={baseOffer} />)

    expect(container.querySelector('.lucide-map-pin')).not.toBeInTheDocument()
  })

  it('shows the address when present', () => {
    render(<HotelCard offer={{ ...baseOffer, address: 'Rua Augusta 1, Lissabon' }} />)

    expect(screen.getByText('Rua Augusta 1, Lissabon')).toBeInTheDocument()
  })

  it('does not render an image when photoUrl is null', () => {
    const { container } = render(<HotelCard offer={baseOffer} />)

    expect(container.querySelector('img')).not.toBeInTheDocument()
  })

  it('renders an image with the accommodation name as alt text when photoUrl is present', () => {
    render(<HotelCard offer={{ ...baseOffer, photoUrl: 'https://example.com/hotel.jpg' }} />)

    const img = screen.getByAltText('Hotel Lisboa Mar')
    expect(img).toHaveAttribute('src', 'https://example.com/hotel.jpg')
  })

  it('does not render a select button when onSelect is not provided', () => {
    render(<HotelCard offer={baseOffer} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onSelect with the offer when the button is clicked', () => {
    const onSelect = vi.fn()
    render(<HotelCard offer={baseOffer} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Auswählen' }))

    expect(onSelect).toHaveBeenCalledWith(baseOffer)
  })

  it('shows a disabled "Ausgewählt" state instead of the select button when selected', () => {
    const onSelect = vi.fn()
    render(<HotelCard offer={baseOffer} onSelect={onSelect} selected />)

    const button = screen.getByRole('button', { name: 'Ausgewählt' })
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
