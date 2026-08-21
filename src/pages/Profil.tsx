import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  BUDGET_RANGES,
  DIETARY_RESTRICTIONS,
  TRAVEL_STYLES,
  emptyPreferences,
  type DietaryRestriction,
  type TravelStyle,
} from '@/types/profile'

// Rein lokaler Demo-State, kein echtes Speichern über Reloads hinweg — gleiches
// Muster wie Favoriten.tsx/Preisalarme.tsx/Angebote.tsx, bis die echte
// Nutzerkonten-/Backend-Entscheidung gefallen ist (siehe ZEITPLAN.md).
export function Profil() {
  const [preferences, setPreferences] = useState(emptyPreferences)

  function toggleTravelStyle(style: TravelStyle) {
    setPreferences((current) => ({
      ...current,
      travelStyles: current.travelStyles.includes(style)
        ? current.travelStyles.filter((entry) => entry !== style)
        : [...current.travelStyles, style],
    }))
  }

  function toggleDietaryRestriction(restriction: DietaryRestriction) {
    setPreferences((current) => ({
      ...current,
      dietaryRestrictions: current.dietaryRestrictions.includes(restriction)
        ? current.dietaryRestrictions.filter((entry) => entry !== restriction)
        : [...current.dietaryRestrictions, restriction],
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Profil" description="Reisepräferenzen verwalten" />

      <Card>
        <CardContent className="flex flex-col gap-6 px-5 py-5">
          <div className="flex flex-col gap-2">
            <Label>Reisestile</Label>
            <p className="text-sm text-muted-foreground">
              Wähle aus, was zu dir passt — die KI berücksichtigt das bei Vorschlägen.
            </p>
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Reisestile">
              {TRAVEL_STYLES.map((style) => {
                const active = preferences.travelStyles.includes(style)
                return (
                  <button
                    key={style}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleTravelStyle(style)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-teal bg-teal/10 text-navy'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {style}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <Label htmlFor="budget-range">Budgetrahmen</Label>
            <p className="text-sm text-muted-foreground">
              Eine grobe Einordnung, kein festes Limit — hilft der KI, passende Angebote zu priorisieren.
            </p>
            <Select
              value={preferences.budgetRange ?? undefined}
              onValueChange={(value) =>
                setPreferences((current) => ({ ...current, budgetRange: value as typeof current.budgetRange }))
              }
            >
              <SelectTrigger id="budget-range" className="w-full max-w-64">
                <SelectValue placeholder="Noch nicht ausgewählt" />
              </SelectTrigger>
              <SelectContent>
                {BUDGET_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <Label>Ernährungsweise</Label>
            <p className="text-sm text-muted-foreground">
              Relevant für Restaurant- und Verpflegungsvorschläge. Keine Angabe ist auch okay.
            </p>
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Ernährungsweise">
              {DIETARY_RESTRICTIONS.map((restriction) => {
                const active = preferences.dietaryRestrictions.includes(restriction)
                return (
                  <button
                    key={restriction}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleDietaryRestriction(restriction)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-teal bg-teal/10 text-navy'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {restriction}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <Label htmlFor="home-airport">Heimatflughafen</Label>
            <p className="text-sm text-muted-foreground">IATA-Code, z. B. BER für Berlin.</p>
            <Input
              id="home-airport"
              value={preferences.homeAirport ?? ''}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  homeAirport: event.target.value.toUpperCase().slice(0, 3) || null,
                }))
              }
              placeholder="BER"
              maxLength={3}
              className="w-24 uppercase"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
