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
    return raw ? (JSON.parse(raw) as StoredChatState) : null
  } catch {
    return null
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
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated))
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
