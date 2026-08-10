import { Train, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { TrainOffer } from '@/types/trains'

function formatTime(isoString: string) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function formatDuration(isoDuration: string) {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?/.exec(isoDuration)
  if (!match) return isoDuration
  const [, hours, minutes] = match
  return [hours && `${hours}h`, minutes && `${minutes}min`].filter(Boolean).join(' ') || '—'
}

interface TrainCardProps {
  offer: TrainOffer
  onSelect?: (offer: TrainOffer) => void
}

export function TrainCard({ offer, onSelect }: TrainCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Train className="size-3.5" />
          {offer.operator}
          {offer.transfers > 0 && (
            <Badge variant="secondary">
              {offer.transfers} Umstieg{offer.transfers > 1 ? 'e' : ''}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-lg font-semibold text-foreground">
            {formatTime(offer.departureTime)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{offer.originName}</span>
          </div>
          <ArrowRight className="size-4 text-muted-foreground" />
          <div className="text-lg font-semibold text-foreground">
            {formatTime(offer.arrivalTime)}
            <span className="ml-1 text-sm font-normal text-muted-foreground">{offer.destinationName}</span>
          </div>
          <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {formatDuration(offer.duration)}
          </div>
        </div>
        {offer.classes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {offer.classes.map((trainClass) => (
              <Badge key={trainClass} variant="outline">
                {trainClass}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <span className="font-heading text-xl font-semibold text-navy">
            {offer.totalAmount} {offer.totalCurrency}
          </span>
          {onSelect && (
            <Button size="sm" onClick={() => onSelect(offer)} className="bg-teal text-navy hover:bg-teal/90">
              Auswählen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
