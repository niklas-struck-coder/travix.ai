import { motion } from 'framer-motion'
import { TrainCard } from '@/components/search/TrainCard'
import { NoResultsMessage } from '@/components/search/NoResultsMessage'
import { TravixAvatar } from '@/components/chat/TravixAvatar'
import type { TrainOffer } from '@/types/trains'

interface TrainResultsProps {
  offers: TrainOffer[] | null
  loading: boolean
  onSelect: (offer: TrainOffer) => void
}

export function TrainResults({ offers, loading, onSelect }: TrainResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 pl-1">
        <TravixAvatar state="searching" size="sm" />
        <span className="text-sm text-muted-foreground">Travix sucht echte Zug-, Bus- und Fährverbindungen …</span>
      </div>
    )
  }

  if (!offers) return null
  if (offers.length === 0) return <NoResultsMessage title="Keine Verbindungen gefunden" />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
      {offers.map((offer) => (
        <TrainCard key={offer.id} offer={offer} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}
