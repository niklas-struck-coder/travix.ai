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
    // Legacy/corrupted stored trips can be missing `activities`, `messages`,
    // `quickReplies` or even `trip` itself entirely. useChat.ts reads
    // `stored.messages.length` right after loading, and QuickReplies renders
    // `options.length` off `quickReplies` unguarded — same reasoning as the
    // `activities` guard below (see hasTripData), so all four must always
    // come back as arrays/objects instead of throwing here and discarding
    // the whole stored state (including the otherwise-guarded messages/
    // quickReplies) in the catch below.
    return {
      ...parsed,
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      quickReplies: Array.isArray(parsed.quickReplies) ? parsed.quickReplies : [],
      trip: { ...parsed.trip, activities: Array.isArray(parsed.trip?.activities) ? parsed.trip.activities : [] },
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

// Same reasoning as saveStoredChat's try/catch above: resetChat() in useChat.ts
// must reset its in-memory state even if removeItem itself throws (private
// browsing, restrictive webviews).
export function clearStoredChat(): void {
  try {
    localStorage.removeItem(CHAT_STORAGE_KEY)
  } catch (error) {
    console.error('Lokales Löschen des Chat-Zustands fehlgeschlagen', error)
  }
}

/**
 * Merges a partial trip update (e.g. a flight selected outside the chat, on
 * the standalone Flugsuche page) into the currently stored trip. No-op if no
 * trip has been started yet — there's nothing to integrate the selection
 * into, and this function must not fabricate a new trip on its own.
 *
 * `saved` reports whether the merged trip actually made it into
 * localStorage, so callers can warn the user instead of showing a success
 * state that a reload would silently undo (same reasoning as
 * saveStoredChat's own return value above).
 */
export function updateStoredTrip(patch: Partial<TripDraft>): (StoredChatState & { saved: boolean }) | null {
  const stored = loadStoredChat()
  if (!stored) return null

  const updated: StoredChatState = { ...stored, trip: { ...stored.trip, ...patch } }
  const saved = saveStoredChat(updated)
  return { ...updated, saved }
}

// Same field catalog as calculateProgress.ts / checklistRules.ts
// (AUTO_CHECKLIST_ITEMS) — activities counts here too, so this can't say
// "vollständig" on Buchung.tsx while the checklist right below it still
// shows "Aktivitäten geplant" as an open item.
export function isTripComplete(trip: TripDraft): boolean {
  return Boolean(
    trip.destination &&
      trip.transportMode &&
      trip.dates &&
      trip.budget &&
      trip.accommodation &&
      trip.activities.length > 0,
  )
}

// `activities` is cast, not validated, when a stored trip is loaded from
// localStorage (see loadStoredChat) — legacy or corrupted data can be
// missing it entirely, so this can't assume it's always an array.
export function hasTripData(trip: TripDraft): boolean {
  const { activities, ...fields } = trip
  return Object.values(fields).some(Boolean) || (Array.isArray(activities) && activities.length > 0)
}
