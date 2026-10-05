import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TripSummaryCard } from './TripSummaryCard'
import { emptyTrip } from '@/lib/ai/mockAdvisor'

describe('TripSummaryCard', () => {
  it('renders nothing when the trip has no fields set yet', () => {
    const { container } = render(
      <MemoryRouter>
        <TripSummaryCard trip={emptyTrip} />
      </MemoryRouter>,
    )

    expect(container).toBeEmptyDOMElement()
  })

  it('renders only the fields that are set on the trip', () => {
    render(
      <MemoryRouter>
        <TripSummaryCard trip={{ ...emptyTrip, destination: 'Lissabon', budget: '1.500 €' }} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('1.500 €')).toBeInTheDocument()
    expect(screen.queryByText('Flug')).not.toBeInTheDocument()
  })

  it('renders the transport mode label for the selected mode', () => {
    render(
      <MemoryRouter>
        <TripSummaryCard trip={{ ...emptyTrip, transportMode: 'train' }} />
      </MemoryRouter>,
    )

    expect(screen.getByText('Zug')).toBeInTheDocument()
  })

  it('shows all fields together with a link to the booking page', () => {
    render(
      <MemoryRouter>
        <TripSummaryCard
          trip={{
            destination: 'Kyoto',
            transportMode: 'flight',
            budget: '2.000 €',
            dates: '12.–19. Okt.',
            accommodation: 'Hotel Kyoto',
            activities: [],
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText('Kyoto')).toBeInTheDocument()
    expect(screen.getByText('Flug')).toBeInTheDocument()
    expect(screen.getByText('2.000 €')).toBeInTheDocument()
    expect(screen.getByText('12.–19. Okt.')).toBeInTheDocument()
    expect(screen.getByText('Hotel Kyoto')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Speichern & ansehen/ })).toHaveAttribute('href', '/buchung')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not warn about duplicate keys when two free-text fields happen to have the same value', () => {
    // destination and budget are both free text typed in the chat (useChat.ts/mockAdvisor.ts) —
    // nothing stops a user from answering the budget question with the same text as the destination.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <MemoryRouter>
        <TripSummaryCard trip={{ ...emptyTrip, destination: 'Lissabon', budget: 'Lissabon' }} />
      </MemoryRouter>,
    )

    expect(errorSpy).not.toHaveBeenCalledWith(expect.stringContaining('same key'), expect.anything())
    expect(screen.getAllByText('Lissabon')).toHaveLength(2)
  })
})
