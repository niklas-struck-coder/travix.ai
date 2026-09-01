import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Flugsuche } from './Flugsuche'
import { searchFlights } from '@/lib/duffel/client'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'
import type { FlightOffer } from '@/types/duffel'

vi.mock('@/lib/duffel/client', () => ({
  searchFlights: vi.fn(),
}))

// Real FlightWizard requires picking IATA codes/dates in a multi-field form —
// none of that matters for this bug, which lives entirely in Flugsuche's own
// offer state, so it's swapped for a plain button that fires the same
// onSearch callback with fixed params.
vi.mock('@/components/search/FlightWizard', () => ({
  FlightWizard: ({ onSearch, loading }: { onSearch: (params: unknown) => void; loading: boolean }) => (
    <button
      onClick={() => onSearch({ origin: 'BER', destination: 'LIS', departureDate: '2026-01-01', passengers: 1 })}
      disabled={loading}
    >
      Flüge suchen
    </button>
  ),
}))

function seedStoredChat() {
  const state: StoredChatState = { messages: [], trip: { ...emptyTrip, destination: 'Lissabon' }, quickReplies: [] }
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}

function makeOffer(id: string): FlightOffer {
  return {
    id,
    totalAmount: '100',
    totalCurrency: 'EUR',
    slices: [
      {
        originIata: 'BER',
        originName: 'Berlin',
        destinationIata: 'LIS',
        destinationName: 'Lissabon',
        duration: 'PT2H30M',
        segments: [
          {
            carrierName: 'Test Airline',
            carrierIata: 'TA',
            departingAt: '2026-01-01T10:00:00Z',
            arrivingAt: '2026-01-01T12:30:00Z',
            originIata: 'BER',
            destinationIata: 'LIS',
          },
        ],
      },
    ],
  }
}

describe('Flugsuche', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('marks the chosen flight as selected and disables its button when an active trip exists', async () => {
    seedStoredChat()
    const searchFlightsMock = vi.mocked(searchFlights)
    searchFlightsMock.mockResolvedValueOnce({ offers: [makeOffer('1'), makeOffer('2')], errors: [] })

    render(
      <MemoryRouter>
        <Flugsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Flüge suchen'))
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Auswählen' })).toHaveLength(2))

    fireEvent.click(screen.getAllByRole('button', { name: 'Auswählen' })[0])

    expect(await screen.findByRole('button', { name: 'Ausgewählt' })).toBeDisabled()
    expect(screen.getAllByRole('button', { name: 'Auswählen' })).toHaveLength(1)
  })

  it('does not mark a flight as selected when there is no active trip to save it into, and keeps the button clickable', async () => {
    const searchFlightsMock = vi.mocked(searchFlights)
    searchFlightsMock.mockResolvedValueOnce({ offers: [makeOffer('1'), makeOffer('2')], errors: [] })

    render(
      <MemoryRouter>
        <Flugsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Flüge suchen'))
    await waitFor(() => expect(screen.getAllByRole('button', { name: 'Auswählen' })).toHaveLength(2))

    fireEvent.click(screen.getAllByRole('button', { name: 'Auswählen' })[0])

    await screen.findByText(/gibt noch keine aktive Reiseplanung/)
    expect(screen.queryByRole('button', { name: 'Ausgewählt' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Auswählen' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Auswählen' })[0]).not.toBeDisabled()
  })
})
