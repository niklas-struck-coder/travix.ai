import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TrainResults } from './TrainResults'
import type { TrainOffer } from '@/types/trains'

vi.mock('@/components/chat/TravixAvatar', () => ({
  TravixAvatar: () => null,
}))

const offer: TrainOffer = {
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

describe('TrainResults', () => {
  it('does not claim a "real" search while loading, since no train/bus/ferry data source is connected yet', () => {
    render(<TrainResults offers={null} loading onSelect={() => {}} />)

    expect(screen.queryByText(/echte/i)).not.toBeInTheDocument()
    expect(screen.getByText('Travix sucht nach Zug-, Bus- und Fährverbindungen …')).toBeInTheDocument()
  })

  it('renders nothing while not loading and no offers are set', () => {
    const { container } = render(<TrainResults offers={null} loading={false} onSelect={() => {}} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('shows a no-results message for an empty offer list', () => {
    render(<TrainResults offers={[]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText('Keine Verbindungen gefunden')).toBeInTheDocument()
  })

  it('renders a card per offer', () => {
    render(<TrainResults offers={[offer]} loading={false} onSelect={() => {}} />)

    expect(screen.getByText('Deutsche Bahn')).toBeInTheDocument()
  })
})
