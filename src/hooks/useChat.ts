import { useEffect, useRef, useState } from 'react'
import type { AvatarState } from '@/components/chat/TravixAvatar'
import { emptyTrip, getGreeting, getNextAdvisorStep } from '@/lib/ai/mockAdvisor'
import { speak } from '@/lib/ai/speech'
import { searchStays } from '@/lib/duffel/client'
import { findKnownDestination } from '@/types/stays'
import type { StayOffer } from '@/types/stays'
import { CHAT_STORAGE_KEY, loadStoredChat } from '@/lib/trip/tripStorage'
import type { StoredChatState } from '@/lib/trip/tripStorage'
import type { ChatMessage, TripDraft } from '@/types/chat'

// Trip dates are collected as free text ("Nächstes Wochenende"), not real
// dates, so the live hotel search uses a fixed 3-night window ~30 days out
// until real date parsing/picking is wired up.
function defaultStayDates() {
  const checkIn = new Date()
  checkIn.setDate(checkIn.getDate() + 30)
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkOut.getDate() + 3)
  const toIso = (date: Date) => date.toISOString().slice(0, 10)
  return { checkInDate: toIso(checkIn), checkOutDate: toIso(checkOut) }
}

function makeMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, timestamp: Date.now() }
}

export function useChat(speechEnabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [trip, setTrip] = useState<TripDraft>(emptyTrip)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [isThinking, setIsThinking] = useState(false)
  const [stayOffers, setStayOffers] = useState<StayOffer[] | null>(null)
  const [stayLoading, setStayLoading] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const stored = loadStoredChat()
    if (stored && stored.messages.length > 0) {
      setMessages(stored.messages)
      setTrip(stored.trip)
      setQuickReplies(stored.quickReplies)
      setAvatarState('idle')
      return
    }

    const greeting = getGreeting()
    setMessages([makeMessage('assistant', greeting.content)])
    setTrip(greeting.trip)
    setQuickReplies(greeting.quickReplies)
    setAvatarState(greeting.avatarState)
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    const state: StoredChatState = { messages, trip, quickReplies }
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
  }, [messages, trip, quickReplies])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length === 0) return
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ messages, trip, quickReplies }))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [messages, trip, quickReplies])

  const sendMessage = (content: string) => {
    setMessages((prev) => [...prev, makeMessage('user', content)])
    setQuickReplies([])
    setStayOffers(null)
    setIsThinking(true)
    setAvatarState('thinking')

    window.setTimeout(() => {
      const reply = getNextAdvisorStep(trip, content)
      setMessages((prev) => [...prev, makeMessage('assistant', reply.content)])
      setTrip(reply.trip)
      setQuickReplies(reply.quickReplies)
      setAvatarState(reply.avatarState)
      setIsThinking(false)
      if (speechEnabled) speak(reply.content)

      if (reply.nextField === 'accommodation') {
        const destination = findKnownDestination(reply.trip.destination ?? '')
        if (destination) {
          setStayLoading(true)
          const { checkInDate, checkOutDate } = defaultStayDates()
          searchStays({
            latitude: destination.latitude,
            longitude: destination.longitude,
            checkInDate,
            checkOutDate,
            rooms: 1,
            guests: 1,
          }).then((result) => {
            setStayOffers(result.offers)
            setStayLoading(false)
          })
        }
      }
    }, 700)
  }

  const selectHotel = (offer: StayOffer) => {
    sendMessage(offer.accommodationName)
  }

  const resetChat = () => {
    localStorage.removeItem(CHAT_STORAGE_KEY)
    const greeting = getGreeting()
    setMessages([makeMessage('assistant', greeting.content)])
    setTrip(greeting.trip)
    setQuickReplies(greeting.quickReplies)
    setAvatarState(greeting.avatarState)
    setStayOffers(null)
  }

  return {
    messages,
    trip,
    quickReplies,
    avatarState,
    isThinking,
    stayOffers,
    stayLoading,
    sendMessage,
    selectHotel,
    resetChat,
  }
}
