import { motion } from 'framer-motion'
import { HotelCard } from '@/components/search/HotelCard'
import { NoResultsMessage } from '@/components/search/NoResultsMessage'
import { SearchErrorAlert } from '@/components/search/SearchErrorAlert'
import { TravixAvatar } from '@/components/chat/TravixAvatar'
import type { StayOffer } from '@/types/stays'
import type { DuffelError } from '@/types/duffel'

interface HotelResultsProps {
  offers: StayOffer[] | null
  errors: DuffelError[]
  loading: boolean
  onSelect: (offer: StayOffer) => void
}

export function HotelResults({ offers, errors, loading, onSelect }: HotelResultsProps) {
  if (loading) {
    return (
      <div role="status" className="flex items-center gap-2 pl-1">
        <TravixAvatar state="searching" size="sm" />
        <span className="text-sm text-muted-foreground">Travix sucht echte Unterkünfte …</span>
      </div>
    )
  }

  if (errors.length > 0) {
    return <SearchErrorAlert errors={errors} />
  }

  if (!offers) return null
  if (offers.length === 0) return <NoResultsMessage title="Keine Unterkünfte gefunden" />

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid gap-3 sm:grid-cols-2"
    >
      {offers.map((offer) => (
        <HotelCard key={offer.id} offer={offer} onSelect={onSelect} />
      ))}
    </motion.div>
  )
}
