import { useEffect, useRef, useState } from 'react'
import type { AvatarState } from '@/components/chat/TravixAvatar'
import { emptyTrip, getGreeting, getNextAdvisorStep } from '@/lib/ai/mockAdvisor'
import { speak } from '@/lib/ai/speech'
import type { ChatMessage, TripDraft } from '@/types/chat'

const STORAGE_KEY = 'travix.ki-chat.draft'

interface StoredChatState {
  messages: ChatMessage[]
  trip: TripDraft
  quickReplies: string[]
}

function loadStoredState(): StoredChatState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredChatState) : null
  } catch {
    return null
  }
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
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const stored = loadStoredState()
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [messages, trip, quickReplies])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length === 0) return
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, trip, quickReplies }))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [messages, trip, quickReplies])

  const sendMessage = (content: string) => {
    setMessages((prev) => [...prev, makeMessage('user', content)])
    setQuickReplies([])
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
    }, 700)
  }

  const resetChat = () => {
    localStorage.removeItem(STORAGE_KEY)
    const greeting = getGreeting()
    setMessages([makeMessage('assistant', greeting.content)])
    setTrip(greeting.trip)
    setQuickReplies(greeting.quickReplies)
    setAvatarState(greeting.avatarState)
  }

  return { messages, trip, quickReplies, avatarState, isThinking, sendMessage, resetChat }
}
