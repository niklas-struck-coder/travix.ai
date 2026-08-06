import type { AvatarState } from '@/components/chat/TravixAvatar'

export type TransportMode = 'flight' | 'train' | 'bus' | 'ferry' | 'car'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface TripDraft {
  destination: string | null
  transportMode: TransportMode | null
  budget: string | null
  dates: string | null
  accommodation: string | null
}

export interface AdvisorReply {
  content: string
  avatarState: AvatarState
  quickReplies: string[]
  trip: TripDraft
}
