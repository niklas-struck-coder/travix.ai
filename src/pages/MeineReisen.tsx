import { Link } from 'react-router-dom'
import { CalendarDays, Sun, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Trip {
  id: string
  destination: string
  dates: string
  gradient: string
  status: 'upcoming' | 'past'
}

// Demo trips until real bookings are wired up (Base44 entities, per the PRD).
// Urlaubsmodus is intentionally not in the sidebar — it's only reachable
// here, from an actual trip, once that trip is upcoming or active.
const trips: Trip[] = [
  { id: '1', destination: 'Lissabon', dates: '15. – 22. September 2026', gradient: 'from-teal to-navy', status: 'upcoming' },
  { id: '2', destination: 'Kyoto', dates: '3. – 10. März 2026', gradient: 'from-gold to-navy', status: 'past' },
]

export function MeineReisen() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Meine Reisen" description="Gebuchte und bestätigte Reisen" />

      <div className="grid gap-4 sm:grid-cols-2">
        {trips.map((trip) => (
          <Card key={trip.id} className="overflow-hidden py-0">
            <div className={`h-28 bg-gradient-to-br ${trip.gradient}`} />
            <CardContent className="flex flex-col gap-3 px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading font-semibold text-foreground">{trip.destination}</p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    {trip.dates}
                  </span>
                </div>
                <Badge variant={trip.status === 'upcoming' ? 'default' : 'secondary'}>
                  {trip.status === 'upcoming' ? 'Bevorstehend' : 'Abgeschlossen'}
                </Badge>
              </div>

              {trip.status === 'upcoming' ? (
                <Button asChild size="sm" className="w-fit bg-teal text-navy hover:bg-teal/90">
                  <Link to="/urlaubsmodus">
                    <Sun className="size-4" />
                    Urlaubsmodus aktivieren
                  </Link>
                </Button>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3.5" />
                  Reise abgeschlossen
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
