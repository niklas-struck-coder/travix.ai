import type { AvatarState } from '@/components/chat/TravixAvatar'

export type TransportMode = 'flight' | 'train' | 'bus' | 'ferry' | 'car'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface TripActivity {
  id: string
  name: string
  price: string | null
}

export interface TripDraft {
  destination: string | null
  transportMode: TransportMode | null
  budget: string | null
  dates: string | null
  accommodation: string | null
  activities: TripActivity[]
}

/** Fields that can be revisited individually from the Reiseplan's edit buttons. */
export type EditableTripField = 'transportMode' | 'dates' | 'budget' | 'accommodation'

export interface AdvisorReply {
  content: string
  avatarState: AvatarState
  quickReplies: string[]
  trip: TripDraft
  /** Which trip field this reply is asking the user for next, if any. */
  nextField: keyof TripDraft | null
}
