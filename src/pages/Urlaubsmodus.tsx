import { useEffect, useRef, useState } from 'react'
import { Sun, CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { TravixAvatar } from '@/components/chat/TravixAvatar'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { QuickReplies } from '@/components/chat/QuickReplies'
import { useConcierge } from '@/hooks/useConcierge'
import { loadStoredChat } from '@/lib/trip/tripStorage'

export function Urlaubsmodus() {
  const [trip] = useState(() => loadStoredChat()?.trip ?? null)
  const { messages, quickReplies, avatarState, isThinking, sendMessage } = useConcierge(trip?.destination ?? null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking])

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Urlaubsmodus" description="KI-Unterstützung während der Reise" />

      {trip?.destination && (
        <div className="flex items-center gap-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3">
          <Sun className="size-5 text-gold" />
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">{trip.destination}</p>
            {trip.dates && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {trip.dates}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex h-[calc(100vh-14rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <TravixAvatar state={avatarState} />
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">Travix</p>
            <p className="text-xs text-muted-foreground">Fragen zu Kultur, Sprache und deiner Reise</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isThinking && (
            <div className="flex items-center gap-2">
              <TravixAvatar state="thinking" size="sm" />
              <span className="text-sm text-muted-foreground">Travix denkt nach …</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 px-4 pt-2">
          <QuickReplies options={quickReplies} onSelect={sendMessage} />
        </div>

        <ChatInput onSend={sendMessage} disabled={isThinking} placeholder="Frag mich etwas zu deiner Reise…" />
      </div>
    </div>
  )
}
