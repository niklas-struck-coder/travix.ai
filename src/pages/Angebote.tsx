import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag, Plane, Hotel, X, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SavedOffer {
  id: string
  offerType: 'flight' | 'hotel'
  destination: string
  summary: string
  price: number
  currency: string
}

// Demo saved offers until real storage exists (SavedOffer entity, per the
// PRD) — same placeholder pattern as Favoriten.tsx/Preisalarme.tsx.
// offer_data is unstructured in the PRD schema, so a short human-readable
// summary is used here instead of inventing a fuller shape (e.g. full
// flight segments) that the entity doesn't actually specify.
const initialOffers: SavedOffer[] = [
  {
    id: '1',
    offerType: 'flight',
    destination: 'Lissabon',
    summary: 'Berlin → Lissabon, Hin- und Rückflug',
    price: 249,
    currency: 'EUR',
  },
  {
    id: '2',
    offerType: 'hotel',
    destination: 'Kyoto',
    summary: 'Hotel Gion Nanba, 7 Nächte',
    price: 610,
    currency: 'EUR',
  },
]

function formatPrice(price: number, currency: string) {
  return `${price.toLocaleString('de-DE')} ${currency === 'EUR' ? '€' : currency}`
}

export function Angebote() {
  const [offers, setOffers] = useState(initialOffers)

  function removeOffer(id: string) {
    setOffers((current) => current.filter((offer) => offer.id !== id))
  }

  if (offers.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Angebote" description="Gespeicherte Reiseangebote" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <Tag className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch keine Angebote gespeichert</p>
          <p className="max-w-sm text-sm">
            Finde Flüge oder Unterkünfte und speichere sie hier, um sie später wiederzufinden.
          </p>
          <Button asChild className="mt-2 bg-teal text-navy hover:bg-teal/90">
            <Link to="/ki-chat">
              <Sparkles className="size-4" />
              Reise mit KI planen
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Angebote" description="Gespeicherte Reiseangebote" />

      <div className="grid gap-4 sm:grid-cols-2">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardContent className="flex flex-col gap-3 px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="gap-1">
                      {offer.offerType === 'flight' ? (
                        <Plane className="size-3.5" />
                      ) : (
                        <Hotel className="size-3.5" />
                      )}
                      {offer.offerType === 'flight' ? 'Flug' : 'Unterkunft'}
                    </Badge>
                  </div>
                  <p className="font-heading font-semibold text-foreground">{offer.destination}</p>
                  <span className="text-sm text-muted-foreground">{offer.summary}</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  aria-label={`${offer.summary} aus gespeicherten Angeboten entfernen`}
                  title="Angebot entfernen"
                  onClick={() => removeOffer(offer.id)}
                >
                  <X className="size-4" />
                </Button>
              </div>

              <span className="font-heading text-lg font-semibold text-navy">
                {formatPrice(offer.price, offer.currency)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
