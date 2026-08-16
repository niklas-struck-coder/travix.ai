import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Copy, PauseCircle, PiggyBank, PlayCircle, Sparkles, Trash2, CheckCircle2 } from 'lucide-react'
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
  status: 'in_progress' | 'paused' | 'finalized'
  trip: TripDraft
}

const statusLabels: Record<Draft['status'], string> = {
  in_progress: 'In Bearbeitung',
  paused: 'Pausiert',
  finalized: 'Abgeschlossen',
}

// Demo drafts until real multi-draft storage exists (Base44 entities, per
// the PRD) — `tripStorage.ts` currently only tracks a single active trip.
// Same placeholder approach as MeineReisen.tsx: gradient in place of a real
// destination image, hardcoded list instead of a persisted collection.
const initialDrafts: Draft[] = [
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
  const [drafts, setDrafts] = useState(initialDrafts)

  function togglePause(id: string) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.id === id && draft.status !== 'finalized'
          ? { ...draft, status: draft.status === 'paused' ? 'in_progress' : 'paused' }
          : draft,
      ),
    )
  }

  function finalizeDraft(id: string) {
    setDrafts((current) =>
      current.map((draft) => (draft.id === id ? { ...draft, status: 'finalized' } : draft)),
    )
  }

  function duplicateDraft(id: string) {
    setDrafts((current) => {
      const source = current.find((draft) => draft.id === id)
      if (!source) return current
      const copy: Draft = { ...source, id: crypto.randomUUID(), status: 'in_progress' }
      const index = current.findIndex((draft) => draft.id === id)
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]
    })
  }

  function deleteDraft(id: string) {
    setDrafts((current) => current.filter((draft) => draft.id !== id))
  }

  if (drafts.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Reiseentwürfe" description="Gespeicherte Planungen fortsetzen" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <CalendarDays className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch keine Reiseentwürfe</p>
          <p className="max-w-sm text-sm">Starte im KI-Chat, um deine nächste Reise zu planen.</p>
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
                    {statusLabels[draft.status]}
                  </Badge>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Fortschritt</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" className="bg-teal text-navy hover:bg-teal/90">
                    <Link to="/ki-chat">Planung fortsetzen</Link>
                  </Button>
                  {draft.status !== 'finalized' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      aria-label={draft.status === 'paused' ? `${draft.destination} fortsetzen` : `${draft.destination} pausieren`}
                      title={draft.status === 'paused' ? 'Fortsetzen' : 'Pausieren'}
                      onClick={() => togglePause(draft.id)}
                    >
                      {draft.status === 'paused' ? <PlayCircle className="size-4" /> : <PauseCircle className="size-4" />}
                    </Button>
                  )}
                  {draft.status !== 'finalized' && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-muted-foreground hover:text-foreground"
                      aria-label={`${draft.destination} abschließen`}
                      title="Abschließen"
                      onClick={() => finalizeDraft(draft.id)}
                    >
                      <CheckCircle2 className="size-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    aria-label={`${draft.destination} duplizieren`}
                    title="Duplizieren"
                    onClick={() => duplicateDraft(draft.id)}
                  >
                    <Copy className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    aria-label={`${draft.destination} löschen`}
                    title="Löschen"
                    onClick={() => deleteDraft(draft.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
