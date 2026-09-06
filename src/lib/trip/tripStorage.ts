import type { ChatMessage, TripDraft } from '@/types/chat'

export const CHAT_STORAGE_KEY = 'travix.ki-chat.draft'

export interface StoredChatState {
  messages: ChatMessage[]
  trip: TripDraft
  quickReplies: string[]
}

export function loadStoredChat(): StoredChatState | null {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredChatState
    // Legacy/corrupted stored trips can be missing `activities` entirely (see
    // hasTripData below). Every consumer of the loaded trip (Buchung.tsx,
    // ChecklistPanel, EditMode) reads `trip.activities.length` unguarded, so
    // this must always come back as an array.
    return {
      ...parsed,
      trip: { ...parsed.trip, activities: Array.isArray(parsed.trip.activities) ? parsed.trip.activities : [] },
    }
  } catch {
    return null
  }
}

// Full storage (quota exceeded) or private browsing can make setItem throw.
// Same fallback approach as loadStoredChat's catch above: the chat keeps
// working from in-memory state, it just won't survive a reload this time.
// Returns whether the write succeeded, so callers can warn the user instead
// of only logging the failure silently.
export function saveStoredChat(state: StoredChatState): boolean {
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (error) {
    console.error('Lokales Speichern des Chat-Zustands fehlgeschlagen', error)
    return false
  }
}

/**
 * Merges a partial trip update (e.g. a flight selected outside the chat, on
 * the standalone Flugsuche page) into the currently stored trip. No-op if no
 * trip has been started yet — there's nothing to integrate the selection
 * into, and this function must not fabricate a new trip on its own.
 */
export function updateStoredTrip(patch: Partial<TripDraft>): StoredChatState | null {
  const stored = loadStoredChat()
  if (!stored) return null

  const updated: StoredChatState = { ...stored, trip: { ...stored.trip, ...patch } }
  saveStoredChat(updated)
  return updated
}

// activities is a list (not a slot-filling field), so it's excluded from
// the completeness/emptiness checks below — an empty array is falsy here,
// not truthy like Boolean([]) would normally treat it.
export function isTripComplete(trip: TripDraft): boolean {
  return Boolean(trip.destination && trip.transportMode && trip.dates && trip.budget && trip.accommodation)
}

// `activities` is cast, not validated, when a stored trip is loaded from
// localStorage (see loadStoredChat) — legacy or corrupted data can be
// missing it entirely, so this can't assume it's always an array.
export function hasTripData(trip: TripDraft): boolean {
  const { activities, ...fields } = trip
  return Object.values(fields).some(Boolean) || (Array.isArray(activities) && activities.length > 0)
}
