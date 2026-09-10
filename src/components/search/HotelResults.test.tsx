import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HotelResults } from './HotelResults'
import type { StayOffer } from '@/types/stays'
import type { DuffelError } from '@/types/duffel'

vi.mock('@/components/chat/TravixAvatar', () => ({
  TravixAvatar: () => null,
}))

const offer: StayOffer = {
  id: '1',
  accommodationName: 'Hotel Lissabon Mar',
  rating: 4,
  address: 'Rua da Praia 12, Lissabon',
  totalAmount: '189.00',
  totalCurrency: 'EUR',
  photoUrl: null,
}

const error: DuffelError = { message: 'Die Unterkunftssuche hat gerade nicht geklappt, versuch’s gleich nochmal.' }

describe('HotelResults', () => {
  it('shows a loading state while searching', () => {
    render(<HotelResults offers={null} errors={[]} loading onSelect={() => {}} />)

    expect(screen.getByText('Travix sucht echte Unterkünfte …')).toBeInTheDocument()
  })

  it('shows the error message instead of a no-results message when the search failed', () => {
    render(<HotelResults offers={null} errors={[error]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText(error.message)).toBeInTheDocument()
    expect(screen.queryByText('Keine Unterkünfte gefunden')).not.toBeInTheDocument()
  })

  it('renders nothing while not loading, no error, and no offers are set', () => {
    const { container } = render(<HotelResults offers={null} errors={[]} loading={false} onSelect={() => {}} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('shows a no-results message for an empty offer list', () => {
    render(<HotelResults offers={[]} errors={[]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText('Keine Unterkünfte gefunden')).toBeInTheDocument()
  })

  it('renders a card per offer', () => {
    render(<HotelResults offers={[offer]} errors={[]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText('Hotel Lissabon Mar')).toBeInTheDocument()
  })
})
