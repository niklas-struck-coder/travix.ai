import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, Plane, Train, Bus, Ship, Car, Wallet, CalendarDays, BedDouble, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { TripDraft, TransportMode } from '@/types/chat'

const transportIcons: Record<TransportMode, typeof Plane> = {
  flight: Plane,
  train: Train,
  bus: Bus,
  ferry: Ship,
  car: Car,
}

const transportLabels: Record<TransportMode, string> = {
  flight: 'Flug',
  train: 'Zug',
  bus: 'Bus',
  ferry: 'Fähre',
  car: 'Mietwagen',
}

export function TripSummaryCard({ trip }: { trip: TripDraft }) {
  const TransportIcon = trip.transportMode ? transportIcons[trip.transportMode] : MapPin

  const rows = [
    trip.destination && { icon: MapPin, label: trip.destination },
    trip.transportMode && { icon: TransportIcon, label: transportLabels[trip.transportMode] },
    trip.dates && { icon: CalendarDays, label: trip.dates },
    trip.budget && { icon: Wallet, label: trip.budget },
    trip.accommodation && { icon: BedDouble, label: trip.accommodation },
  ].filter(Boolean) as { icon: typeof Plane; label: string }[]

  if (rows.length === 0) return null

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="border-teal/30 bg-teal/5">
        <CardContent className="flex flex-col gap-3 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal">Deine Reise bisher</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {rows.map((row) => (
              <div key={row.label} className="flex items-center gap-1.5 text-sm text-foreground">
                <row.icon className="size-4 text-navy" />
                {row.label}
              </div>
            ))}
          </div>
          <Button asChild size="sm" variant="ghost" className="w-fit self-end text-teal hover:text-teal">
            <Link to="/buchung">
              Speichern &amp; ansehen
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
