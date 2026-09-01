import { Star, MapPin, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { StayOffer } from '@/types/stays'

interface HotelCardProps {
  offer: StayOffer
  onSelect?: (offer: StayOffer) => void
  selected?: boolean
}

export function HotelCard({ offer, onSelect, selected }: HotelCardProps) {
  return (
    <Card className="overflow-hidden py-0">
      {offer.photoUrl && (
        <img src={offer.photoUrl} alt={offer.accommodationName} className="h-32 w-full object-cover" />
      )}
      <CardContent className="flex flex-col gap-2 px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-heading font-semibold text-foreground">{offer.accommodationName}</p>
          {offer.rating !== null && (
            <span className="flex shrink-0 items-center gap-0.5 text-xs font-medium text-gold">
              <Star className="size-3.5 fill-gold" />
              {offer.rating.toFixed(1)}
            </span>
          )}
        </div>
        {offer.address && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            {offer.address}
          </span>
        )}
        <div className="mt-1 flex items-center justify-between">
          <span className="font-heading text-lg font-semibold text-navy">
            {offer.totalAmount} {offer.totalCurrency}
          </span>
          {onSelect && (
            <Button
              size="sm"
              onClick={() => onSelect(offer)}
              disabled={selected}
              className="bg-teal text-navy hover:bg-teal/90"
            >
              {selected ? (
                <>
                  <Check /> Ausgewählt
                </>
              ) : (
                'Auswählen'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
