import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CHAT_STORAGE_KEY, hasTripData, loadStoredChat, saveStoredChat, updateStoredTrip } from '@/lib/trip/tripStorage'
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

describe('saveStoredChat', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('does not throw when localStorage.setItem throws (e.g. quota exceeded)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    const state: StoredChatState = {
      messages: [{ id: '1', role: 'assistant', content: 'Hallo', timestamp: 0 }],
      trip: { ...emptyTrip, destination: 'Lissabon' },
      quickReplies: [],
    }

    expect(() => saveStoredChat(state)).not.toThrow()
  })

  it('returns false when localStorage.setItem throws (e.g. quota exceeded)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })
    const state: StoredChatState = {
      messages: [{ id: '1', role: 'assistant', content: 'Hallo', timestamp: 0 }],
      trip: { ...emptyTrip, destination: 'Lissabon' },
      quickReplies: [],
    }

    expect(saveStoredChat(state)).toBe(false)
  })

  it('still writes normally when localStorage works', () => {
    const state: StoredChatState = {
      messages: [{ id: '1', role: 'assistant', content: 'Hallo', timestamp: 0 }],
      trip: { ...emptyTrip, destination: 'Lissabon' },
      quickReplies: [],
    }

    saveStoredChat(state)

    expect(loadStoredChat()).toEqual(state)
  })

  it('returns true when localStorage works', () => {
    const state: StoredChatState = {
      messages: [{ id: '1', role: 'assistant', content: 'Hallo', timestamp: 0 }],
      trip: { ...emptyTrip, destination: 'Lissabon' },
      quickReplies: [],
    }

    expect(saveStoredChat(state)).toBe(true)
  })
})

describe('updateStoredTrip resilience', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('still returns the merged trip even when persisting it fails', () => {
    seedStoredChat()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    const result = updateStoredTrip({ transportMode: 'flight' })

    expect(result?.trip.transportMode).toBe('flight')
  })
})

describe('loadStoredChat', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('normalizes a missing activities field to an empty array (legacy/corrupted stored trip)', () => {
    const { activities, ...tripWithoutActivities } = { ...emptyTrip, destination: 'Lissabon' }
    void activities
    localStorage.setItem(
      CHAT_STORAGE_KEY,
      JSON.stringify({ messages: [], trip: tripWithoutActivities, quickReplies: [] }),
    )

    const loaded = loadStoredChat()

    expect(loaded?.trip.activities).toEqual([])
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
