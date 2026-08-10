import { Plane, ArrowRight, Clock, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { FlightOffer } from '@/types/duffel'

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

interface FlightCardProps {
  offer: FlightOffer
  onSelect?: (offer: FlightOffer) => void
  selected?: boolean
}

export function FlightCard({ offer, onSelect, selected }: FlightCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 px-5 py-4">
        {offer.slices.map((slice, index) => {
          const firstSegment = slice.segments[0]
          const stops = slice.segments.length - 1
          return (
            <div key={index} className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Plane className="size-3.5" />
                {firstSegment?.carrierName ?? 'Fluggesellschaft unbekannt'}
                {stops > 0 && <Badge variant="secondary">{stops} Zwischenstopp{stops > 1 ? 's' : ''}</Badge>}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-lg font-semibold text-foreground">
                  {formatTime(firstSegment?.departingAt ?? '')}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{slice.originIata}</span>
                </div>
                <ArrowRight className="size-4 text-muted-foreground" />
                <div className="text-lg font-semibold text-foreground">
                  {formatTime(slice.segments[slice.segments.length - 1]?.arrivingAt ?? '')}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">{slice.destinationIata}</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {formatDuration(slice.duration)}
                </div>
              </div>
            </div>
          )
        })}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">Gesamtpreis</span>
          <span className="font-heading text-xl font-semibold text-navy">
            {offer.totalAmount} {offer.totalCurrency}
          </span>
        </div>
        {onSelect && (
          <Button
            size="sm"
            onClick={() => onSelect(offer)}
            disabled={selected}
            className="w-fit self-end bg-teal text-navy hover:bg-teal/90"
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
      </CardContent>
    </Card>
  )
}
