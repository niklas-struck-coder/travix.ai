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

// activities is a list (not a slot-filling field), so it's excluded from
// the completeness/emptiness checks below — an empty array is falsy here,
// not truthy like Boolean([]) would normally treat it.
export function isTripComplete(trip: TripDraft): boolean {
  return Boolean(trip.destination && trip.transportMode && trip.dates && trip.budget && trip.accommodation)
}

export function hasTripData(trip: TripDraft): boolean {
  const { activities, ...fields } = trip
  return Object.values(fields).some(Boolean) || activities.length > 0
}
