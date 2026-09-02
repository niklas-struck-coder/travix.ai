import { useState } from 'react'
import type { AvatarState } from '@/components/chat/TravixAvatar'
import { conciergeQuickReplies, getConciergeGreeting, getConciergeReply, hasKnownDestination } from '@/lib/ai/mockConcierge'
import type { ChatMessage } from '@/types/chat'

function makeMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, timestamp: Date.now() }
}

export function useConcierge(destination: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [makeMessage('assistant', getConciergeGreeting(destination))])
  const [quickReplies, setQuickReplies] = useState<string[]>(hasKnownDestination(destination) ? conciergeQuickReplies : [])
  const [avatarState, setAvatarState] = useState<AvatarState>('greeting')
  const [isThinking, setIsThinking] = useState(false)

  const sendMessage = (content: string) => {
    setMessages((prev) => [...prev, makeMessage('user', content)])
    setQuickReplies([])
    setIsThinking(true)
    setAvatarState('thinking')

    window.setTimeout(() => {
      const reply = getConciergeReply(destination, content)
      setMessages((prev) => [...prev, makeMessage('assistant', reply.text)])
      setAvatarState(reply.matched ? 'happy' : 'error')
      setQuickReplies(hasKnownDestination(destination) ? conciergeQuickReplies : [])
      setIsThinking(false)
    }, 600)
  }

  return { messages, quickReplies, avatarState, isThinking, sendMessage }
}
