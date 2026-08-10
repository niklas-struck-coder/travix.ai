import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { HotelWizard } from '@/components/search/HotelWizard'
import { HotelCard } from '@/components/search/HotelCard'
import { NoResultsMessage } from '@/components/search/NoResultsMessage'
import { searchStays } from '@/lib/duffel/client'
import { updateStoredTrip } from '@/lib/trip/tripStorage'
import type { DuffelError } from '@/types/duffel'
import type { StayOffer, StaySearchParams } from '@/types/stays'

export function Hotelsuche() {
  const [offers, setOffers] = useState<StayOffer[] | null>(null)
  const [errors, setErrors] = useState<DuffelError[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null)
  const [selectionHasTrip, setSelectionHasTrip] = useState(true)

  const handleSearch = async (params: StaySearchParams) => {
    setLoading(true)
    setErrors([])
    setSelectedOfferId(null)
    const result = await searchStays(params)
    setOffers(result.offers)
    setErrors(result.errors)
    setLoading(false)
  }

  const handleSelect = (offer: StayOffer) => {
    const updated = updateStoredTrip({ accommodation: offer.accommodationName })
    setSelectedOfferId(offer.id)
    setSelectionHasTrip(updated !== null)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Hotelsuche" description="Echte Testangebote von Duffel — keine erfundenen Preise" />
      <HotelWizard onSearch={handleSearch} loading={loading} />

      {errors.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div className="flex flex-col gap-1">
            {errors.map((error, index) => (
              <span key={index}>{error.message}</span>
            ))}
          </div>
        </div>
      )}

      {selectedOfferId && (
        <div className="flex items-start gap-2 rounded-xl border border-teal/30 bg-teal/5 p-4 text-sm text-foreground">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" />
          {selectionHasTrip ? (
            <span>
              Unterkunft in deinen Reiseplan übernommen.{' '}
              <Link to="/buchung" className="font-medium underline underline-offset-2">
                Reiseplan ansehen
              </Link>
            </span>
          ) : (
            <span>
              Es gibt noch keine aktive Reiseplanung, in die ich diese Unterkunft übernehmen kann. Starte zuerst im{' '}
              <Link to="/ki-chat" className="font-medium underline underline-offset-2">
                KI-Chat
              </Link>
              , dann kannst du hier auswählen.
            </span>
          )}
        </div>
      )}

      {offers && offers.length === 0 && errors.length === 0 && <NoResultsMessage title="Keine Unterkünfte gefunden" />}

      {offers && offers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {offers.map((offer) => (
            <HotelCard key={offer.id} offer={offer} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  )
}
