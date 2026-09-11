import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FlightResults } from './FlightResults'
import type { DuffelError, FlightOffer } from '@/types/duffel'

vi.mock('@/components/chat/TravixAvatar', () => ({
  TravixAvatar: () => null,
}))

const offer: FlightOffer = {
  id: '1',
  totalAmount: '249.00',
  totalCurrency: 'EUR',
  slices: [
    {
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
    },
  ],
}

const error: DuffelError = { message: 'Die Flugsuche hat gerade nicht geklappt, versuch’s gleich nochmal.' }

describe('FlightResults', () => {
  it('shows a loading state while searching', () => {
    render(<FlightResults offers={null} errors={[]} loading onSelect={() => {}} />)

    expect(screen.getByText('Travix sucht echte Flüge …')).toBeInTheDocument()
  })

  it('shows the error message instead of a no-results message when the search failed', () => {
    render(<FlightResults offers={null} errors={[error]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText(error.message)).toBeInTheDocument()
    expect(screen.queryByText('Keine Flüge gefunden')).not.toBeInTheDocument()
  })

  it('renders nothing while not loading, no error, and no offers are set', () => {
    const { container } = render(<FlightResults offers={null} errors={[]} loading={false} onSelect={() => {}} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('shows a no-results message for an empty offer list', () => {
    render(<FlightResults offers={[]} errors={[]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText('Keine Flüge gefunden')).toBeInTheDocument()
  })

  it('renders a card per offer', () => {
    render(<FlightResults offers={[offer]} errors={[]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText('TAP Air Portugal')).toBeInTheDocument()
  })
})
