import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConcierge } from './useConcierge'
import { conciergeQuickReplies } from '@/lib/ai/mockConcierge'

describe('useConcierge', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('offers quick replies for a curated destination', () => {
    const { result } = renderHook(() => useConcierge('Rom'))
    expect(result.current.quickReplies).toEqual(conciergeQuickReplies)
  })

  it('offers no quick replies when no destination is set', () => {
    const { result } = renderHook(() => useConcierge(null))
    expect(result.current.quickReplies).toEqual([])
  })

  it('offers no quick replies for a real destination that is simply not curated', () => {
    const { result } = renderHook(() => useConcierge('Bali'))
    expect(result.current.quickReplies).toEqual([])
  })

  it('keeps quick replies hidden after a reply for an uncurated destination', () => {
    const { result } = renderHook(() => useConcierge('Bali'))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current.quickReplies).toEqual([])
    expect(result.current.messages.at(-1)?.content).toContain('Für Bali habe ich noch keine hinterlegten Fakten')
  })

  it('shows quick replies again after a reply for a curated destination', () => {
    const { result } = renderHook(() => useConcierge('Rom'))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current.quickReplies).toEqual(conciergeQuickReplies)
  })

  it('sets the avatar to "happy" after a real, fact-based answer', () => {
    const { result } = renderHook(() => useConcierge('Rom'))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current.avatarState).toBe('happy')
  })

  it('sets the avatar to "idle" instead of "happy" or "error" after an honest limitation reply (no destination)', () => {
    const { result } = renderHook(() => useConcierge(null))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current.avatarState).toBe('idle')
  })

  it('sets the avatar to "idle" instead of "happy" or "error" after an honest limitation reply (uncurated destination)', () => {
    const { result } = renderHook(() => useConcierge('Bali'))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current.avatarState).toBe('idle')
  })

  it('clears the pending reply timeout on unmount so it cannot fire against a stale instance', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    const { result, unmount } = renderHook(() => useConcierge('Rom'))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('cancels an earlier still-pending reply when sendMessage is called again before it fires', () => {
    const { result } = renderHook(() => useConcierge('Rom'))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      result.current.sendMessage('Wie ist die Notrufnummer?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    const assistantReplies = result.current.messages.filter((message) => message.role === 'assistant')
    // Greeting + exactly one reply — the first call's reply must not land
    // alongside the second's once both timeouts would otherwise have fired.
    expect(assistantReplies).toHaveLength(2)
    expect(assistantReplies[1]?.content).toContain('Notrufnummer')
    expect(result.current.isThinking).toBe(false)
  })
})
