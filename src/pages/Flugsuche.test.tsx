import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Flugsuche } from './Flugsuche'
import { searchFlights } from '@/lib/duffel/client'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'
import type { DuffelError, FlightOffer } from '@/types/duffel'

vi.mock('@/lib/duffel/client', () => ({
  searchFlights: vi.fn(),
}))

// Real FlightWizard requires picking IATA codes/dates in a multi-field form —
// none of that matters for this bug, which lives entirely in Flugsuche's own
// offer state, so it's swapped for a plain button that fires the same
// onSearch callback with fixed params.
vi.mock('@/components/search/FlightWizard', () => ({
  FlightWizard: ({ onSearch, loading }: { onSearch: (params: unknown) => void; loading: boolean }) => (
    <>
      <button
        onClick={() => onSearch({ origin: 'BER', destination: 'LIS', departureDate: '2026-01-01', passengers: 1 })}
        disabled={loading}
      >
        Flüge suchen
      </button>
      {/* Not disabled on `loading` — simulates a second search starting while the
          first one is still in flight (e.g. an overlapping request), to test
          that a slower, stale response can't overwrite a faster, newer one. */}
      <button onClick={() => onSearch({ origin: 'BER', destination: 'FCO', departureDate: '2026-01-01', passengers: 1 })}>
        Flüge suchen (zweite, überlappende Suche)
      </button>
    </>
  ),
}))

function seedStoredChat() {
  const state: StoredChatState = {
    messages: [],
    trip: { ...emptyTrip, destination: 'Lissabon' },
    quickReplies: [],
    editingField: null,
    awaitingFlightOrigin: false,
  }
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

  it('saves a readable summary (airline, route, price) of the selected flight, not just that a flight was chosen', async () => {
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
    await screen.findByRole('button', { name: 'Ausgewählt' })

    const stored = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) ?? '{}') as StoredChatState
    expect(stored.trip.transportDetail).toBe('Test Airline · Berlin → Lissabon · 100,00 €')
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

  it('shows a flight-specific no-results title instead of the generic default', async () => {
    const searchFlightsMock = vi.mocked(searchFlights)
    searchFlightsMock.mockResolvedValueOnce({ offers: [], errors: [] })

    render(
      <MemoryRouter>
        <Flugsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Flüge suchen'))

    expect(await screen.findByText('Keine Flüge gefunden')).toBeInTheDocument()
    expect(screen.queryByText('Keine Ergebnisse gefunden')).not.toBeInTheDocument()
  })

  it('discards a stale search response that resolves after a newer, overlapping one already applied its result', async () => {
    const searchFlightsMock = vi.mocked(searchFlights)
    let resolveStaleSearch: (value: { offers: FlightOffer[]; errors: DuffelError[] }) => void = () => {}
    searchFlightsMock.mockImplementationOnce(() => new Promise((resolve) => (resolveStaleSearch = resolve)))
    searchFlightsMock.mockResolvedValueOnce({ offers: [makeOffer('2')], errors: [] })

    render(
      <MemoryRouter>
        <Flugsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Flüge suchen'))
    fireEvent.click(screen.getByText('Flüge suchen (zweite, überlappende Suche)'))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Auswählen' })).toBeInTheDocument())

    resolveStaleSearch({ offers: [], errors: [{ message: 'Die Flugsuche hat gerade nicht geklappt.' }] })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Auswählen' })).toBeInTheDocument()
  })

  it('announces a search error to assistive tech via role="alert"', async () => {
    const searchFlightsMock = vi.mocked(searchFlights)
    searchFlightsMock.mockResolvedValueOnce({ offers: [], errors: [{ message: 'Duffel ist gerade nicht erreichbar.' }] })

    render(
      <MemoryRouter>
        <Flugsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Flüge suchen'))

    expect(await screen.findByRole('alert')).toHaveTextContent('Duffel ist gerade nicht erreichbar.')
  })

  describe('when localStorage is unavailable (e.g. quota exceeded)', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('warns that the selection cannot be saved instead of silently claiming success', async () => {
      seedStoredChat()
      vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new DOMException('QuotaExceededError')
      })
      const searchFlightsMock = vi.mocked(searchFlights)
      searchFlightsMock.mockResolvedValueOnce({ offers: [makeOffer('1')], errors: [] })

      render(
        <MemoryRouter>
          <Flugsuche />
        </MemoryRouter>,
      )

      fireEvent.click(screen.getByText('Flüge suchen'))
      await waitFor(() => expect(screen.getByRole('button', { name: 'Auswählen' })).toBeInTheDocument())
      fireEvent.click(screen.getByRole('button', { name: 'Auswählen' }))

      expect(
        await screen.findByText('Dein Fortschritt kann gerade nicht dauerhaft gespeichert werden — ein Neuladen würde ihn verwerfen.'),
      ).toBeInTheDocument()
    })
  })
})
