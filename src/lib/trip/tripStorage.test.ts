import { beforeEach, describe, expect, it } from 'vitest'
import { CHAT_STORAGE_KEY, hasTripData, loadStoredChat, updateStoredTrip } from '@/lib/trip/tripStorage'
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

describe('hasTripData', () => {
  it('does not throw when activities is missing (legacy/corrupted stored trip)', () => {
    const { activities, ...tripWithoutActivities } = { ...emptyTrip, destination: 'Lissabon' }
    void activities

    expect(() => hasTripData(tripWithoutActivities as unknown as typeof emptyTrip)).not.toThrow()
    expect(hasTripData(tripWithoutActivities as unknown as typeof emptyTrip)).toBe(true)
  })

  it('returns false for an empty trip with missing activities', () => {
    const { activities, ...tripWithoutActivities } = emptyTrip
    void activities

    expect(hasTripData(tripWithoutActivities as unknown as typeof emptyTrip)).toBe(false)
  })

  it('still detects activities as trip data when present', () => {
    const trip = { ...emptyTrip, activities: [{ id: '1', name: 'Museum', price: null }] }

    expect(hasTripData(trip)).toBe(true)
  })
})
