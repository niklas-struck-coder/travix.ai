import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hotelsuche } from './Hotelsuche'
import { searchStays } from '@/lib/duffel/client'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'
import type { StayOffer } from '@/types/stays'

vi.mock('@/lib/duffel/client', () => ({
  searchStays: vi.fn(),
}))

function seedStoredChat() {
  const state: StoredChatState = { messages: [], trip: { ...emptyTrip, destination: 'Lissabon' }, quickReplies: [] }
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}

// Real HotelWizard requires picking a destination from a Radix Select and
// filling two date inputs — none of that matters for this bug, which lives
// entirely in Hotelsuche's own offer state, so it's swapped for a plain
// button that fires the same onSearch callback with fixed params.
vi.mock('@/components/search/HotelWizard', () => ({
  HotelWizard: ({ onSearch, loading }: { onSearch: (params: unknown) => void; loading: boolean }) => (
    <button
      onClick={() =>
        onSearch({ latitude: 0, longitude: 0, checkInDate: '2026-01-01', checkOutDate: '2026-01-05', rooms: 1, guests: 1 })
      }
      disabled={loading}
    >
      Hotels suchen
    </button>
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
})
