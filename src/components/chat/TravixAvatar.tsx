import { motion, type TargetAndTransition } from 'framer-motion'
import { Hand, Loader2, PenLine, Search, Smile, AlertTriangle, Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AvatarState = 'idle' | 'greeting' | 'thinking' | 'writing' | 'searching' | 'happy' | 'error'

const stateConfig: Record<AvatarState, { icon: typeof Compass; ring: string; glow: string }> = {
  idle: { icon: Compass, ring: 'from-navy to-teal', glow: 'shadow-navy/20' },
  greeting: { icon: Hand, ring: 'from-teal to-gold', glow: 'shadow-teal/30' },
  thinking: { icon: Loader2, ring: 'from-navy to-teal', glow: 'shadow-navy/20' },
  writing: { icon: PenLine, ring: 'from-teal to-navy', glow: 'shadow-teal/20' },
  searching: { icon: Search, ring: 'from-navy via-teal to-gold', glow: 'shadow-teal/30' },
  happy: { icon: Smile, ring: 'from-teal to-gold', glow: 'shadow-gold/30' },
  error: { icon: AlertTriangle, ring: 'from-destructive to-navy', glow: 'shadow-destructive/20' },
}

const iconAnimation: Record<AvatarState, TargetAndTransition> = {
  idle: {},
  greeting: { rotate: [0, -15, 12, -8, 0] },
  thinking: { rotate: 360 },
  writing: { y: [0, -1, 1, 0] },
  searching: { scale: [1, 1.12, 1] },
  happy: { scale: [1, 1.15, 1] },
  error: { x: [0, -3, 3, -3, 0] },
}

interface TravixAvatarProps {
  state: AvatarState
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'size-8',
  md: 'size-11',
  lg: 'size-16',
}

const iconSizeClasses = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-7',
}

export function TravixAvatar({ state, size = 'md' }: TravixAvatarProps) {
  const { icon: Icon, ring, glow } = stateConfig[state]

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br shadow-lg',
        ring,
        glow,
        sizeClasses[size],
      )}
    >
      {state === 'thinking' && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-teal/40"
          animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      <motion.div
        animate={iconAnimation[state]}
        transition={
          state === 'thinking'
            ? { duration: 1, repeat: Infinity, ease: 'linear' }
            : { duration: 0.6, repeat: state === 'idle' ? 0 : Infinity, repeatDelay: 1.2, ease: 'easeInOut' }
        }
      >
        <Icon className={cn('text-white', iconSizeClasses[size])} strokeWidth={2} />
      </motion.div>
    </div>
  )
}
