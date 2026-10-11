import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Hotelsuche } from './Hotelsuche'
import { searchStays } from '@/lib/duffel/client'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'
import type { StayOffer } from '@/types/stays'
import type { DuffelError } from '@/types/duffel'

vi.mock('@/lib/duffel/client', () => ({
  searchStays: vi.fn(),
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

// Real HotelWizard requires picking a destination from a Radix Select and
// filling two date inputs — none of that matters for this bug, which lives
// entirely in Hotelsuche's own offer state, so it's swapped for a plain
// button that fires the same onSearch callback with fixed params.
vi.mock('@/components/search/HotelWizard', () => ({
  HotelWizard: ({ onSearch, loading }: { onSearch: (params: unknown) => void; loading: boolean }) => (
    <>
      <button
        onClick={() =>
          onSearch({ latitude: 0, longitude: 0, checkInDate: '2026-01-01', checkOutDate: '2026-01-05', rooms: 1, guests: 1 })
        }
        disabled={loading}
      >
        Hotels suchen
      </button>
      {/* Not disabled on `loading` — simulates a second search starting while the
          first one is still in flight (e.g. an overlapping request), to test
          that a slower, stale response can't overwrite a faster, newer one. */}
      <button
        onClick={() =>
          onSearch({ latitude: 1, longitude: 1, checkInDate: '2026-02-01', checkOutDate: '2026-02-05', rooms: 1, guests: 1 })
        }
      >
        Hotels suchen (zweite, überlappende Suche)
      </button>
    </>
  ),
}))

function makeOffer(id: string, name: string): StayOffer {
  return { id, accommodationName: name, rating: null, address: '', totalAmount: '100', totalCurrency: 'EUR', photoUrl: null }
}

describe('Hotelsuche', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('clears previous offers as soon as a new search starts, instead of leaving them visible during loading', async () => {
    const searchStaysMock = vi.mocked(searchStays)
    let resolveSecondSearch: (value: { offers: StayOffer[]; errors: never[] }) => void = () => {}

    searchStaysMock.mockResolvedValueOnce({ offers: [makeOffer('1', 'Hotel Alfama Suites')], errors: [] })
    searchStaysMock.mockImplementationOnce(
      () => new Promise((resolve) => (resolveSecondSearch = resolve)),
    )

    render(
      <MemoryRouter>
        <Hotelsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Hotels suchen'))
    await waitFor(() => expect(screen.getByText('Hotel Alfama Suites')).toBeInTheDocument())

    fireEvent.click(screen.getByText('Hotels suchen'))
    expect(screen.queryByText('Hotel Alfama Suites')).not.toBeInTheDocument()

    resolveSecondSearch({ offers: [makeOffer('2', 'Ryokan Kyoto')], errors: [] })
    await waitFor(() => expect(screen.getByText('Ryokan Kyoto')).toBeInTheDocument())
  })

  it('marks the chosen hotel as selected and disables its button, leaving the other cards untouched', async () => {
    seedStoredChat()
    const searchStaysMock = vi.mocked(searchStays)
    searchStaysMock.mockResolvedValueOnce({
      offers: [makeOffer('1', 'Hotel Alfama Suites'), makeOffer('2', 'Ryokan Kyoto')],
      errors: [],
    })

    render(
      <MemoryRouter>
        <Hotelsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Hotels suchen'))
    await waitFor(() => expect(screen.getByText('Hotel Alfama Suites')).toBeInTheDocument())

    const selectButtons = screen.getAllByRole('button', { name: 'Auswählen' })
    expect(selectButtons).toHaveLength(2)
    fireEvent.click(selectButtons[0])

    expect(await screen.findByRole('button', { name: 'Ausgewählt' })).toBeDisabled()
    expect(screen.getAllByRole('button', { name: 'Auswählen' })).toHaveLength(1)
  })

  it('does not mark a hotel as selected when there is no active trip to save it into, and keeps the button clickable', async () => {
    const searchStaysMock = vi.mocked(searchStays)
    searchStaysMock.mockResolvedValueOnce({
      offers: [makeOffer('1', 'Hotel Alfama Suites'), makeOffer('2', 'Ryokan Kyoto')],
      errors: [],
    })

    render(
      <MemoryRouter>
        <Hotelsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Hotels suchen'))
    await waitFor(() => expect(screen.getByText('Hotel Alfama Suites')).toBeInTheDocument())

    fireEvent.click(screen.getAllByRole('button', { name: 'Auswählen' })[0])

    await screen.findByText(/gibt noch keine aktive Reiseplanung/)
    expect(screen.queryByRole('button', { name: 'Ausgewählt' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Auswählen' })).toHaveLength(2)
    expect(screen.getAllByRole('button', { name: 'Auswählen' })[0]).not.toBeDisabled()
  })

  it('discards a stale search response that resolves after a newer, overlapping one already applied its result', async () => {
    const searchStaysMock = vi.mocked(searchStays)
    let resolveStaleSearch: (value: { offers: StayOffer[]; errors: DuffelError[] }) => void = () => {}
    searchStaysMock.mockImplementationOnce(() => new Promise((resolve) => (resolveStaleSearch = resolve)))
    searchStaysMock.mockResolvedValueOnce({ offers: [makeOffer('2', 'Ryokan Kyoto')], errors: [] })

    render(
      <MemoryRouter>
        <Hotelsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Hotels suchen'))
    fireEvent.click(screen.getByText('Hotels suchen (zweite, überlappende Suche)'))

    await waitFor(() => expect(screen.getByText('Ryokan Kyoto')).toBeInTheDocument())

    resolveStaleSearch({ offers: [], errors: [{ message: 'Die Unterkunftssuche hat gerade nicht geklappt.' }] })
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByText('Ryokan Kyoto')).toBeInTheDocument()
  })

  it('announces a search error to assistive tech via role="alert"', async () => {
    const searchStaysMock = vi.mocked(searchStays)
    searchStaysMock.mockResolvedValueOnce({ offers: [], errors: [{ message: 'Duffel ist gerade nicht erreichbar.' }] })

    render(
      <MemoryRouter>
        <Hotelsuche />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByText('Hotels suchen'))

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
      const searchStaysMock = vi.mocked(searchStays)
      searchStaysMock.mockResolvedValueOnce({ offers: [makeOffer('1', 'Hotel Alfama Suites')], errors: [] })

      render(
        <MemoryRouter>
          <Hotelsuche />
        </MemoryRouter>,
      )

      fireEvent.click(screen.getByText('Hotels suchen'))
      await waitFor(() => expect(screen.getByRole('button', { name: 'Auswählen' })).toBeInTheDocument())
      fireEvent.click(screen.getByRole('button', { name: 'Auswählen' }))

      expect(
        await screen.findByText('Dein Fortschritt kann gerade nicht dauerhaft gespeichert werden — ein Neuladen würde ihn verwerfen.'),
      ).toBeInTheDocument()
    })
  })
})
