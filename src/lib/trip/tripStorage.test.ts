import { beforeEach, describe, expect, it } from 'vitest'
import { CHAT_STORAGE_KEY, loadStoredChat, updateStoredTrip } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'

function seedStoredChat(overrides: Partial<StoredChatState> = {}) {
  const state: StoredChatState = {
    messages: [{ id: '1', role: 'assistant', content: 'Hallo', timestamp: 0 }],
    trip: { ...emptyTrip, destination: 'Lissabon' },
    quickReplies: [],
    ...overrides,
  }
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
  return state
}

describe('updateStoredTrip', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null and writes nothing when no trip has been started yet', () => {
    const result = updateStoredTrip({ transportMode: 'flight' })
    expect(result).toBeNull()
    expect(loadStoredChat()).toBeNull()
  })

  it('merges the patch into the existing trip without touching other fields', () => {
    seedStoredChat()

    const result = updateStoredTrip({ transportMode: 'flight' })

    expect(result?.trip.transportMode).toBe('flight')
    expect(result?.trip.destination).toBe('Lissabon')
    expect(loadStoredChat()?.trip.transportMode).toBe('flight')
  })

  it('leaves messages and quickReplies untouched', () => {
    const seeded = seedStoredChat({ quickReplies: ['Zug', 'Flug'] })

    const result = updateStoredTrip({ transportMode: 'flight' })

    expect(result?.messages).toEqual(seeded.messages)
    expect(result?.quickReplies).toEqual(seeded.quickReplies)
  })
})
