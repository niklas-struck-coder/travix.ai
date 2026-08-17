import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plane, BedDouble, Train, Ticket, ShieldCheck, X, ShoppingCart, Sparkles, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { groupCartItems, calculateCartTotal, type CartItem, type CartItemType } from '@/lib/trip/cartTotals'

const TYPE_META: Record<CartItemType, { label: string; icon: LucideIcon }> = {
  flight: { label: 'Flüge', icon: Plane },
  hotel: { label: 'Unterkünfte', icon: BedDouble },
  transport: { label: 'Transport', icon: Train },
  activity: { label: 'Aktivitäten', icon: Ticket },
  insurance: { label: 'Versicherung', icon: ShieldCheck },
}

// Demo cart items across the two demo trips from MeineReisen.tsx (Lissabon,
// Kyoto) until real cart storage exists (Cart entity, per the PRD) — same
// placeholder pattern as Angebote.tsx/Preisalarme.tsx/Aktivitaeten.tsx.
const initialItems: CartItem[] = [
  { id: '1', type: 'flight', label: 'Berlin → Lissabon, Hin- und Rückflug', price: 249 },
  { id: '2', type: 'hotel', label: 'Hotel Alfama Suites, Lissabon · 5 Nächte', price: 480 },
  { id: '3', type: 'transport', label: 'Zugticket Kyoto → Osaka', price: 32 },
  { id: '4', type: 'activity', label: 'Tagesausflug nach Sintra', price: 58 },
  { id: '5', type: 'insurance', label: 'Reise-Krankenversicherung, 10 Tage', price: 24 },
]

function formatEuro(amount: number) {
  return `${amount.toLocaleString('de-DE')} €`
}

export function Warenkorb() {
  const [items, setItems] = useState(initialItems)

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Warenkorb" description="Ausgewählte Leistungen vor der Buchung" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <ShoppingCart className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch nichts im Warenkorb</p>
          <p className="max-w-sm text-sm">
            Plane eine Reise mit der KI und lege Flüge, Unterkünfte oder Aktivitäten hier ab, bevor du sie beim
            Anbieter buchst.
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

  const groups = groupCartItems(items)
  const total = calculateCartTotal(items)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Warenkorb" description="Ausgewählte Leistungen vor der Buchung" />

      <div className="flex flex-col gap-6">
        {groups.map((group) => {
          const { label, icon: Icon } = TYPE_META[group.type]

          return (
            <div key={group.type} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Icon className="size-4 text-teal" />
                  {label}
                </div>
                <span className="text-sm font-medium text-foreground">{formatEuro(group.subtotal)}</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {group.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="flex items-center justify-between gap-2 px-4 py-4">
                      <span className="text-sm text-foreground">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-navy">{formatEuro(item.price)}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8 text-muted-foreground hover:text-foreground"
                          aria-label={`${item.label} aus dem Warenkorb entfernen`}
                          title="Entfernen"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Card className="border-teal/30 bg-teal/5">
        <CardContent className="flex items-center justify-between px-4 py-4">
          <span className="font-heading font-semibold text-foreground">Gesamt</span>
          <span className="font-heading text-xl font-semibold text-navy">{formatEuro(total)}</span>
        </CardContent>
      </Card>
    </div>
  )
}
