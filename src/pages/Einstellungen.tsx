import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { MEASUREMENT_UNITS, NOTIFICATION_PREFERENCES, emptyAppPreferences } from '@/types/settings'

// Rein lokaler Demo-State, kein echtes Speichern über Reloads hinweg und keine
// echten Benachrichtigungen (E-Mail-Versand hängt am Support-Chef-Track
// "Support-E-Mail live") — gleiches Muster wie Profil.tsx/Favoriten.tsx, bis
// die echte Nutzerkonten-/Backend-Entscheidung gefallen ist (siehe ZEITPLAN.md).
// Beschreibungstexte bewusst neutral gehalten, damit sie keine Funktion
// versprechen, die aktuell nicht existiert (E-Mail-Versand, Distanz-/
// Temperaturanzeige) — siehe Support-Chef-Bericht 2026-08-23.
export function Einstellungen() {
  const [preferences, setPreferences] = useState(emptyAppPreferences)

  function toggleNotification(key: keyof typeof preferences.notifications) {
    setPreferences((current) => ({
      ...current,
      notifications: { ...current.notifications, [key]: !current.notifications[key] },
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Einstellungen" description="App- und Benachrichtigungseinstellungen" />

      <Card>
        <CardContent className="flex flex-col gap-6 px-5 py-5">
          <div className="flex flex-col gap-2">
            <Label>Benachrichtigungen</Label>
            <p className="text-sm text-muted-foreground">
              Worüber Travix dich informieren soll, sobald Benachrichtigungen aktiv sind.
            </p>
            <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="Benachrichtigungen">
              {NOTIFICATION_PREFERENCES.map(({ key, label }) => {
                const active = preferences.notifications[key]
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleNotification(key)}
                    className={cn(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'border-teal bg-teal/10 text-navy'
                        : 'border-border bg-background text-muted-foreground hover:bg-muted',
                    )}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-5">
            <Label htmlFor="units">Maßeinheiten</Label>
            <p className="text-sm text-muted-foreground">
              Für künftige Distanz- und Temperaturanzeigen.
            </p>
            <Select
              value={preferences.units}
              onValueChange={(value) =>
                setPreferences((current) => ({ ...current, units: value as typeof current.units }))
              }
            >
              <SelectTrigger id="units" className="w-full max-w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MEASUREMENT_UNITS.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
