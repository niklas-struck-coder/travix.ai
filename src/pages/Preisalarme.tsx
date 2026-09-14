import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Sparkles, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface PriceAlert {
  id: string
  route: string
  targetPrice: number
  currentPrice: number
  previousPrice: number | null
}

// Demo alerts until real storage exists (PriceAlert entity, per the PRD) —
// same placeholder pattern as Favoriten.tsx/MeineReisen.tsx. Price wording
// follows MARKENDESIGN.md ("Preis hat sich seit deiner letzten Ansicht
// geändert: X € statt Y €") — sachlich, keine künstliche Dringlichkeit.
const initialAlerts: PriceAlert[] = [
  {
    id: '1',
    route: 'Berlin → Lissabon',
    targetPrice: 220,
    currentPrice: 249,
    previousPrice: 279,
  },
  {
    id: '2',
    route: 'München → Kyoto',
    targetPrice: 650,
    currentPrice: 610,
    previousPrice: 610,
  },
]

function formatEuro(amount: number) {
  return `${amount.toLocaleString('de-DE')} €`
}

export function Preisalarme() {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [pendingRemoval, setPendingRemoval] = useState<PriceAlert | null>(null)

  function removeAlert(id: string) {
    setAlerts((current) => current.filter((alert) => alert.id !== id))
  }

  function confirmRemoval() {
    if (!pendingRemoval) return
    removeAlert(pendingRemoval.id)
    setPendingRemoval(null)
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Preisalarme" description="Preisänderungen im Blick behalten" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <Bell className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch keine Preisalarme aktiv</p>
          <p className="max-w-sm text-sm">
            Plane eine Reise und behalte den Preis im Blick — wir sagen dir sachlich Bescheid, wenn sich etwas
            ändert.
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
      <PageHeader title="Preisalarme" description="Preisänderungen im Blick behalten" />

      <div className="grid gap-4 sm:grid-cols-2">
        {alerts.map((alert) => {
          const targetReached = alert.currentPrice <= alert.targetPrice
          const priceChanged = alert.previousPrice !== null && alert.previousPrice !== alert.currentPrice

          return (
            <Card key={alert.id}>
              <CardContent className="flex flex-col gap-3 px-4 py-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-heading font-semibold text-foreground">{alert.route}</p>
                    <span className="text-xs text-muted-foreground">Zielpreis: {formatEuro(alert.targetPrice)}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    aria-label={`Preisalarm für ${alert.route} entfernen`}
                    title="Preisalarm entfernen"
                    onClick={() => setPendingRemoval(alert)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg font-semibold text-foreground">
                    {formatEuro(alert.currentPrice)}
                  </span>
                  {targetReached && <Badge className="bg-teal text-navy hover:bg-teal">Ziel erreicht</Badge>}
                </div>

                {priceChanged && (
                  <p className="text-sm text-muted-foreground">
                    Preis hat sich seit deiner letzten Ansicht geändert: {formatEuro(alert.currentPrice)} statt{' '}
                    {formatEuro(alert.previousPrice as number)}
                  </p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={pendingRemoval !== null} onOpenChange={(open) => !open && setPendingRemoval(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preisalarm entfernen?</DialogTitle>
            <DialogDescription>
              Der Preisalarm für {pendingRemoval?.route} wird gelöscht. Das lässt sich nicht rückgängig machen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Abbrechen</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmRemoval}>
              Ja, entfernen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
