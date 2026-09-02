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

  it('sets the avatar to "error" instead of "happy" after an honest limitation reply (no destination)', () => {
    const { result } = renderHook(() => useConcierge(null))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current.avatarState).toBe('error')
  })

  it('sets the avatar to "error" instead of "happy" after an honest limitation reply (uncurated destination)', () => {
    const { result } = renderHook(() => useConcierge('Bali'))

    act(() => {
      result.current.sendMessage('Welche Währung brauche ich?')
    })
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(result.current.avatarState).toBe('error')
  })
})
