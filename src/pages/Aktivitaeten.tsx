import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, X, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PlannedActivity {
  id: string
  destination: string
  name: string
  price: number | null
}

// Demo activities aggregated across the demo trips from MeineReisen.tsx
// (Lissabon, Kyoto) until real cross-trip activity storage exists — same
// placeholder pattern as Angebote.tsx/Preisalarme.tsx. Price stays optional
// (null) since not every activity has a fixed cost, same as TripActivity.
const initialActivities: PlannedActivity[] = [
  { id: '1', destination: 'Lissabon', name: 'Fado-Abend in Alfama', price: 35 },
  { id: '2', destination: 'Lissabon', name: 'Tagesausflug nach Sintra', price: 58 },
  { id: '3', destination: 'Kyoto', name: 'Bambuswald Arashiyama', price: null },
  { id: '4', destination: 'Kyoto', name: 'Teezeremonie im Gion-Viertel', price: 42 },
]

function formatPrice(price: number | null) {
  if (price === null) return null
  return `${price.toLocaleString('de-DE')} €`
}

export function Aktivitaeten() {
  const [activities, setActivities] = useState(initialActivities)

  function removeActivity(id: string) {
    setActivities((current) => current.filter((activity) => activity.id !== id))
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Aktivitäten" description="Alle geplanten Aktivitäten" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <Ticket className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch keine Aktivitäten geplant</p>
          <p className="max-w-sm text-sm">
            Plane eine Reise mit der KI und füge Aktivitäten hinzu — hier findest du sie alle auf einen Blick.
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
      <PageHeader title="Aktivitäten" description="Alle geplanten Aktivitäten" />

      <div className="grid gap-4 sm:grid-cols-2">
        {activities.map((activity) => {
          const price = formatPrice(activity.price)

          return (
            <Card key={activity.id}>
              <CardContent className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary">{activity.destination}</Badge>
                    <p className="font-heading font-semibold text-foreground">{activity.name}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    aria-label={`${activity.name} aus geplanten Aktivitäten entfernen`}
                    title="Aktivität entfernen"
                    onClick={() => removeActivity(activity.id)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                {price !== null && (
                  <span className="font-heading text-lg font-semibold text-navy">{price}</span>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
