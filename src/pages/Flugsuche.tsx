import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { FlightWizard } from '@/components/search/FlightWizard'
import { FlightCard } from '@/components/search/FlightCard'
import { NoResultsMessage } from '@/components/search/NoResultsMessage'
import { searchFlights } from '@/lib/duffel/client'
import type { DuffelError, FlightOffer, FlightSearchParams } from '@/types/duffel'

export function Flugsuche() {
  const [offers, setOffers] = useState<FlightOffer[] | null>(null)
  const [errors, setErrors] = useState<DuffelError[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (params: FlightSearchParams) => {
    setLoading(true)
    setErrors([])
    const result = await searchFlights(params)
    setOffers(result.offers)
    setErrors(result.errors)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Flugsuche" description="Echte Testangebote von Duffel — keine erfundenen Preise" />
      <FlightWizard onSearch={handleSearch} loading={loading} />

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

      {offers && offers.length === 0 && errors.length === 0 && <NoResultsMessage />}

      {offers && offers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {offers.map((offer) => (
            <FlightCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  )
}
