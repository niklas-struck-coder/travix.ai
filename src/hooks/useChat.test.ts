import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useChat } from './useChat'

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
