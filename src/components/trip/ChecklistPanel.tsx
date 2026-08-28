import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Circle, ListChecks, Pencil } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { AUTO_CHECKLIST_ITEMS, MANUAL_CHECKLIST_ITEMS, isAutoItemChecked } from '@/lib/trip/checklistRules'
import type { TripDraft } from '@/types/chat'

interface ChecklistPanelProps {
  trip: TripDraft
}

/**
 * Where each auto-detected item's row links to for planning that component —
 * same `/ki-chat?edit=<field>` pattern the Section cards in `Buchung.tsx`
 * already use. `activities` has no dedicated `?edit=` field in `useChat.ts`
 * (see `editableFields` there), so it opens a plain new chat instead.
 */
const AUTO_ITEM_HREF: Record<string, string> = {
  transport: '/ki-chat?edit=transportMode',
  dates: '/ki-chat?edit=dates',
  accommodation: '/ki-chat?edit=accommodation',
  budget: '/ki-chat?edit=budget',
  activities: '/ki-chat',
}

/**
 * Rein lokaler Demo-State für die manuell abgehakten Punkte — kein
 * persistentes Speichern über Reloads hinweg, gleiches Muster wie
 * Profil.tsx/Einstellungen.tsx, bis die echte Nutzerkonten-/Backend-
 * Entscheidung gefallen ist.
 */
export function ChecklistPanel({ trip }: ChecklistPanelProps) {
  const [checkedManual, setCheckedManual] = useState<Set<string>>(new Set())

  function toggleManual(id: string) {
    setCheckedManual((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const autoCheckedCount = AUTO_CHECKLIST_ITEMS.filter((item) => isAutoItemChecked(trip, item.id)).length
  const totalCount = AUTO_CHECKLIST_ITEMS.length + MANUAL_CHECKLIST_ITEMS.length
  const checkedCount = autoCheckedCount + checkedManual.size
  const progress = Math.round((checkedCount / totalCount) * 100)

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <ListChecks className="size-4 text-teal" />
            Reise-Checkliste
          </div>
          <span className="text-xs text-muted-foreground">
            {checkedCount}/{totalCount} erledigt
          </span>
        </div>
        <Progress value={progress} aria-label="Checklisten-Fortschritt" />

        <ul className="flex flex-col gap-1.5" aria-label="Automatisch erkannte Punkte">
          {AUTO_CHECKLIST_ITEMS.map((item) => {
            const checked = isAutoItemChecked(trip, item.id)
            return (
              <li key={item.id} className="text-sm">
                <Link
                  to={AUTO_ITEM_HREF[item.id] ?? '/ki-chat'}
                  className="flex items-center gap-2 rounded-md py-0.5 hover:bg-muted"
                >
                  {checked ? (
                    <CheckCircle2 className="size-4 shrink-0 text-teal" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={cn(checked ? 'text-foreground' : 'text-muted-foreground')}>
                    {item.label}
                    <span className="sr-only">, bearbeiten</span>
                  </span>
                  <Pencil className="ml-auto size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex flex-col gap-1.5 border-t border-border pt-3" role="group" aria-label="Selbst abzuhaken">
          {MANUAL_CHECKLIST_ITEMS.map((item) => {
            const checked = checkedManual.has(item.id)
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleManual(item.id)}
                className="flex items-center gap-2 rounded-md py-0.5 text-left text-sm hover:bg-muted"
              >
                {checked ? (
                  <CheckCircle2 className="size-4 shrink-0 text-teal" />
                ) : (
                  <Circle className="size-4 shrink-0 text-muted-foreground" />
                )}
                <span className={cn(checked ? 'text-foreground' : 'text-muted-foreground')}>{item.label}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
