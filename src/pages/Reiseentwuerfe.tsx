import { Link } from 'react-router-dom'
import { CalendarDays, PiggyBank } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { calculateProgress } from '@/lib/trip/calculateProgress'
import type { TripDraft } from '@/types/chat'

interface Draft {
  id: string
  destination: string
  gradient: string
  status: 'in_progress' | 'paused'
  trip: TripDraft
}

// Demo drafts until real multi-draft storage exists (Base44 entities, per
// the PRD) — `tripStorage.ts` currently only tracks a single active trip.
// Same placeholder approach as MeineReisen.tsx: gradient in place of a real
// destination image, hardcoded list instead of a persisted collection.
const drafts: Draft[] = [
  {
    id: '1',
    destination: 'Lissabon',
    gradient: 'from-teal to-navy',
    status: 'in_progress',
    trip: {
      destination: 'Lissabon',
      transportMode: 'flight',
      budget: 'bis 1.200 €',
      dates: '15. – 22. September 2026',
      accommodation: null,
      activities: [],
    },
  },
  {
    id: '2',
    destination: 'Kyoto',
    gradient: 'from-gold to-navy',
    status: 'paused',
    trip: {
      destination: 'Kyoto',
      transportMode: null,
      budget: null,
      dates: '3. – 10. März 2027',
      accommodation: null,
      activities: [],
    },
  },
]

export function Reiseentwuerfe() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reiseentwürfe" description="Gespeicherte Planungen fortsetzen" />

      <div className="grid gap-4 sm:grid-cols-2">
        {drafts.map((draft) => {
          const progress = calculateProgress(draft.trip)
          return (
            <Card key={draft.id} className="overflow-hidden py-0">
              <div className={`h-28 bg-gradient-to-br ${draft.gradient}`} />
              <CardContent className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-heading font-semibold text-foreground">{draft.destination}</p>
                    {draft.trip.dates && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3.5" />
                        {draft.trip.dates}
                      </span>
                    )}
                    {draft.trip.budget && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <PiggyBank className="size-3.5" />
                        {draft.trip.budget}
                      </span>
                    )}
                  </div>
                  <Badge variant={draft.status === 'in_progress' ? 'default' : 'secondary'}>
                    {draft.status === 'in_progress' ? 'In Bearbeitung' : 'Pausiert'}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Fortschritt</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <Button asChild size="sm" className="w-fit bg-teal text-navy hover:bg-teal/90">
                  <Link to="/ki-chat">Planung fortsetzen</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
