import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { FlightCard } from '@/components/search/FlightCard'
import { NoResultsMessage } from '@/components/search/NoResultsMessage'
import { TravixAvatar } from '@/components/chat/TravixAvatar'
import type { DuffelError, FlightOffer } from '@/types/duffel'

interface FlightResultsProps {
  offers: FlightOffer[] | null
  errors: DuffelError[]
  loading: boolean
  onSelect: (offer: FlightOffer) => void
}

export function FlightResults({ offers, errors, loading, onSelect }: FlightResultsProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 pl-1">
        <TravixAvatar state="searching" size="sm" />
        <span className="text-sm text-muted-foreground">Travix sucht echte Flüge …</span>
      </div>
    )
  }

  if (errors.length > 0) {
    return (
      <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
        <div className="flex flex-col gap-1">
          {errors.map((error, index) => (
            <span key={index}>{error.message}</span>
          ))}
        </div>
      </div>
    )
  }

  if (!offers) return null
  if (offers.length === 0) return <NoResultsMessage title="Keine Flüge gefunden" />

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-3 sm:grid-cols-2">
      {offers.map((offer) => (
        <FlightCard key={offer.id} offer={offer} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}
