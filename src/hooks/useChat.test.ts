import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useChat } from './useChat'
import { searchFlights, searchStays } from '@/lib/duffel/client'

vi.mock('@/lib/duffel/client', () => ({
  searchFlights: vi.fn(),
  searchStays: vi.fn(),
}))

vi.mock('@/lib/ai/speech', () => ({
  speak: vi.fn(),
}))

// The chat only knows how to run a real accommodation search for a curated
// list of destinations (src/types/stays.ts). Anything else must not leave
// the user hanging after the advisor announces "Ich suche jetzt nach echten
// Unterkünften ..." — this drives the chat to that exact unknown-destination
// case, from both places that can trigger an accommodation search.
const UNKNOWN_DESTINATION = 'Musterstadt'

function completeTripUpToAccommodation() {
  const { result } = renderHook(() => useChat(false))

  act(() => {
    result.current.sendMessage(UNKNOWN_DESTINATION)
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
  act(() => {
    result.current.sendMessage('Zug')
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
  act(() => {
    result.current.sendMessage('Nächstes Wochenende')
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
  act(() => {
    result.current.sendMessage('bis 500 €')
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })

  return result
}

const KNOWN_DESTINATION = 'Lissabon'

function completeTripUpToAccommodationFor(destination: string) {
  const { result } = renderHook(() => useChat(false))

  act(() => {
    result.current.sendMessage(destination)
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
  act(() => {
    result.current.sendMessage('Zug')
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
  act(() => {
    result.current.sendMessage('Nächstes Wochenende')
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
  act(() => {
    result.current.sendMessage('bis 500 €')
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })

  return result
}

describe('useChat accommodation search failure vs. real zero results', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.mocked(searchStays).mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sets a distinct error state when the search itself fails, instead of looking like zero results', async () => {
    vi.mocked(searchStays).mockRejectedValue(new Error('network down'))

    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.stayError).toBe(true)
    expect(result.current.stayOffers).toBeNull()
    expect(result.current.stayLoading).toBe(false)
  })

  it('does not set the error state when the search genuinely returns zero offers', async () => {
    vi.mocked(searchStays).mockResolvedValue({ offers: [], errors: [] })

    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.stayError).toBe(false)
    expect(result.current.stayOffers).toEqual([])
    expect(result.current.stayLoading).toBe(false)
  })

  // searchStays (src/lib/duffel/client.ts) catches its own fetch/HTTP errors
  // and resolves with a non-empty `errors` array instead of rejecting — a
  // real Duffel failure looks exactly like this, not like a rejected
  // promise. Both accommodation-search call sites must treat that the same
  // as a thrown error, or a real failure renders as "no hotels found".
  it('sets the error state when the search resolves with errors instead of throwing, in the main chat flow', async () => {
    vi.mocked(searchStays).mockResolvedValue({ offers: [], errors: [{ message: 'Duffel-Anfrage fehlgeschlagen' }] })

    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.stayError).toBe(true)
    expect(result.current.stayOffers).toBeNull()
    expect(result.current.stayLoading).toBe(false)
    expect(result.current.quickReplies).toEqual(['Neue Reise planen'])
  })

  it('sets the error state when a retry via "Bearbeiten" resolves with errors instead of throwing', async () => {
    vi.mocked(searchStays).mockResolvedValueOnce({ offers: [], errors: [] })
    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    await act(async () => {
      await Promise.resolve()
    })

    vi.mocked(searchStays).mockResolvedValueOnce({ offers: [], errors: [{ message: 'Duffel-Anfrage fehlgeschlagen' }] })
    act(() => {
      result.current.startEdit('accommodation')
    })
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.stayError).toBe(true)
    expect(result.current.quickReplies).toEqual(['Neue Reise planen'])
  })

  it('offers "Neue Reise planen" as a next step when a retry via "Bearbeiten" fails too', async () => {
    vi.mocked(searchStays).mockResolvedValueOnce({ offers: [], errors: [] })
    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    await act(async () => {
      await Promise.resolve()
    })

    vi.mocked(searchStays).mockRejectedValueOnce(new Error('network down'))
    act(() => {
      result.current.startEdit('accommodation')
    })
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.stayError).toBe(true)
    expect(result.current.quickReplies).toEqual(['Neue Reise planen'])
  })

  it('clears a previous error once "Neue Reise planen" restarts the chat', async () => {
    vi.mocked(searchStays).mockRejectedValue(new Error('network down'))
    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    await act(async () => {
      await Promise.resolve()
    })
    expect(result.current.stayError).toBe(true)

    act(() => {
      result.current.resetChat()
    })

    expect(result.current.stayError).toBe(false)
  })
})

describe('useChat accommodation search for an unknown destination', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('tells the user in the main chat flow instead of leaving the search hanging', () => {
    const result = completeTripUpToAccommodation()

    const lastMessage = result.current.messages.at(-1)
    expect(lastMessage?.role).toBe('assistant')
    expect(lastMessage?.content).toContain(UNKNOWN_DESTINATION)
    expect(lastMessage?.content).toContain('manuelle Hotelsuche')
    expect(result.current.stayOffers).toBeNull()
    expect(result.current.stayLoading).toBe(false)
  })

  it('tells the user on the "Bearbeiten" (startEdit) path too', () => {
    const result = completeTripUpToAccommodation()
    const messageCountBefore = result.current.messages.length

    act(() => {
      result.current.startEdit('accommodation')
    })

    expect(result.current.messages.length).toBe(messageCountBefore + 2)
    const lastMessage = result.current.messages.at(-1)
    expect(lastMessage?.role).toBe('assistant')
    expect(lastMessage?.content).toContain(UNKNOWN_DESTINATION)
    expect(lastMessage?.content).toContain('manuelle Hotelsuche')
    expect(result.current.stayOffers).toBeNull()
    expect(result.current.stayLoading).toBe(false)
  })
})

// Same failure-vs-zero-results distinction as the accommodation search
// above, but for the flight search triggered via the "Bearbeiten" ->
// transport mode -> IATA origin path (the only place a real flight search
// currently runs, see useChat.ts).
function switchToFlightAndEnterOrigin(result: ReturnType<typeof completeTripUpToAccommodationFor>, origin: string) {
  act(() => {
    result.current.startEdit('transportMode')
  })
  act(() => {
    result.current.sendMessage('Flug')
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
  act(() => {
    result.current.sendMessage(origin)
  })
  act(() => {
    vi.advanceTimersByTime(700)
  })
}

describe('useChat flight search failure vs. real zero results', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.mocked(searchStays).mockReset()
    vi.mocked(searchStays).mockResolvedValue({ offers: [], errors: [] })
    vi.mocked(searchFlights).mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('sets a distinct error state when the search itself fails, instead of looking like zero results', async () => {
    vi.mocked(searchFlights).mockRejectedValue(new Error('network down'))

    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    switchToFlightAndEnterOrigin(result, 'BER')
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.flightErrors.length).toBeGreaterThan(0)
    expect(result.current.flightOffers).toBeNull()
    expect(result.current.flightLoading).toBe(false)
    expect(result.current.quickReplies).toEqual(['Neue Reise planen'])
  })

  it('does not set an error when the search genuinely returns zero offers', async () => {
    vi.mocked(searchFlights).mockResolvedValue({ offers: [], errors: [] })

    const result = completeTripUpToAccommodationFor(KNOWN_DESTINATION)
    switchToFlightAndEnterOrigin(result, 'BER')
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.flightErrors).toEqual([])
    expect(result.current.flightOffers).toEqual([])
    expect(result.current.flightLoading).toBe(false)
  })
})
