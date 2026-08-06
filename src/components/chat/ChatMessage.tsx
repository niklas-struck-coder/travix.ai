import { motion } from 'framer-motion'
import { TravixAvatar } from '@/components/chat/TravixAvatar'
import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex items-end gap-2', isUser && 'flex-row-reverse')}
    >
      {!isUser && <TravixAvatar state="happy" size="sm" />}
      <div className={cn('flex max-w-[75%] flex-col gap-1', isUser && 'items-end')}>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line',
            isUser
              ? 'rounded-br-sm bg-navy text-white'
              : 'rounded-bl-sm border border-border bg-card text-card-foreground',
          )}
        >
          {message.content}
        </div>
        <span className="px-1 text-[11px] text-muted-foreground">{formatTime(message.timestamp)}</span>
      </div>
    </motion.div>
  )
}
