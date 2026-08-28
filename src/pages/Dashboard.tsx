import { Link } from 'react-router-dom'
import { Luggage, FileClock, ShoppingCart, Heart, Crown, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { calculateProgress } from '@/lib/trip/calculateProgress'
import { calculateCartTotal, type CartItem } from '@/lib/trip/cartTotals'
import type { TripDraft } from '@/types/chat'

// Same demo "world" as the other trip-lifecycle pages (MeineReisen.tsx,
// Reiseentwuerfe.tsx, Warenkorb.tsx, Favoriten.tsx), not a separate invented
// dataset — this page is a central hub over data that already exists
// elsewhere (FR-903), so it reuses those exact demo values.
const upcomingTripsCount = 1 // Lissabon, siehe MeineReisen.tsx

const draftTrips: TripDraft[] = [
  {
    destination: 'Lissabon',
    transportMode: 'flight',
    budget: 'bis 1.200 €',
    dates: '15. – 22. September 2026',
    accommodation: null,
    activities: [],
  },
  {
    destination: 'Kyoto',
    transportMode: null,
    budget: null,
    dates: '3. – 10. März 2027',
    accommodation: null,
    activities: [],
  },
]

const cartItems: CartItem[] = [
  { id: '1', type: 'flight', label: 'Berlin → Lissabon, Hin- und Rückflug', price: 249 },
  { id: '2', type: 'hotel', label: 'Hotel Alfama Suites, Lissabon · 5 Nächte', price: 480 },
  { id: '3', type: 'transport', label: 'Zugticket Kyoto → Osaka', price: 32 },
  { id: '4', type: 'activity', label: 'Tagesausflug nach Sintra', price: 58 },
  { id: '5', type: 'insurance', label: 'Reise-Krankenversicherung, 10 Tage', price: 24 },
]

const favoritesCount = 2 // Kapstadt, Reykjavik — siehe Favoriten.tsx

function formatEuro(amount: number) {
  return `${amount.toLocaleString('de-DE')} €`
}

interface StatTileProps {
  icon: LucideIcon
  label: string
  value: string
  href: string
}

// Ruhige Kennzahl-Kachel laut MARKENDESIGN.md ("Dashboard"-Vorgabe): Teal für
// normale Werte, kein Rot für Warnungen — hier gibt es ohnehin keine
// Budget-Warnung, da TripDraft keine echten Preisfelder für einen Vergleich
// hat (gleiche Lücke wie bei CostBreakdown/Reisebudget, 6.6/6.7/7.12).
function StatTile({ icon: Icon, label, value, href }: StatTileProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-4 text-teal" />
          {label}
        </div>
        <span className="font-heading text-2xl font-semibold text-foreground">{value}</span>
        <Link to={href} className="text-xs font-medium text-teal hover:underline">
          Alle ansehen
        </Link>
      </CardContent>
    </Card>
  )
}

export function Dashboard() {
  const avgDraftProgress = Math.round(
    draftTrips.reduce((sum, trip) => sum + calculateProgress(trip), 0) / draftTrips.length,
  )
  // Gold für Highlights laut MARKENDESIGN.md ("z.B. fast fertig geplant").
  const almostDone = avgDraftProgress >= 80
  const cartTotal = calculateCartTotal(cartItems)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" description="Alle Reisen, Budgets und Favoriten im Überblick" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={Luggage} label="Bevorstehende Reisen" value={String(upcomingTripsCount)} href="/meine-reisen" />

        <Card>
          <CardContent className="flex flex-col gap-2 px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileClock className={almostDone ? 'size-4 text-gold' : 'size-4 text-teal'} />
              Reiseentwürfe
            </div>
            <div className="flex flex-col gap-1.5">
              <span className={`font-heading text-2xl font-semibold ${almostDone ? 'text-gold' : 'text-foreground'}`}>
                {avgDraftProgress}%
              </span>
              <Progress value={avgDraftProgress} aria-label="Durchschnittlicher Planungsfortschritt" />
            </div>
            <Link to="/entwuerfe" className="text-xs font-medium text-teal hover:underline">
              Alle ansehen
            </Link>
          </CardContent>
        </Card>

        <StatTile icon={ShoppingCart} label="Warenkorb" value={formatEuro(cartTotal)} href="/warenkorb" />
        <StatTile icon={Heart} label="Favoriten" value={String(favoritesCount)} href="/favoriten" />
      </div>

      {/* Ehrlich statt erfunden (MARKENDESIGN.md): die genauen Regeln fürs
          Prämienprogramm sind laut PRD (OQ-04) noch offen — deshalb hier
          keine erfundene Punktzahl, sondern ein klarer Hinweis. */}
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 px-4 py-4 text-sm text-muted-foreground">
          <Crown className="mt-0.5 size-5 shrink-0 text-teal" />
          <p>
            <span className="font-medium text-foreground">Prämienprogramm: </span>
            noch nicht verfügbar — wie genau Punkte gesammelt und eingelöst werden, ist noch nicht final
            entschieden. Sobald das steht, zeigen wir hier deinen echten Stand statt erfundener Zahlen.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
