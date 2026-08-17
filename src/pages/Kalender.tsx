import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, CalendarRange, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  formatMonthLabel,
  getMonthGridDays,
  getTripsForDay,
  toIsoDate,
  WEEKDAY_LABELS_DE,
  type CalendarTripRange,
} from '@/lib/trip/calendarUtils'

// Demo trips until real, shared trip storage exists — same destinations
// and display dates as MeineReisen.tsx, with an added structured date
// range so this page can actually place them on the calendar grid.
const trips: (CalendarTripRange & { dates: string })[] = [
  { id: '1', destination: 'Lissabon', startDate: '2026-09-15', endDate: '2026-09-22', dates: '15. – 22. September 2026' },
  { id: '2', destination: 'Kyoto', startDate: '2026-03-03', endDate: '2026-03-10', dates: '3. – 10. März 2026' },
]

export function Kalender() {
  const today = useMemo(() => new Date(), [])
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const grid = useMemo(() => getMonthGridDays(year, month), [year, month])
  const todayIso = useMemo(() => toIsoDate(today.getFullYear(), today.getMonth(), today.getDate()), [today])

  function goToPreviousMonth() {
    setYear((currentYear) => (month === 0 ? currentYear - 1 : currentYear))
    setMonth((currentMonth) => (currentMonth === 0 ? 11 : currentMonth - 1))
  }

  function goToNextMonth() {
    setYear((currentYear) => (month === 11 ? currentYear + 1 : currentYear))
    setMonth((currentMonth) => (currentMonth === 11 ? 0 : currentMonth + 1))
  }

  function goToToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  if (trips.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Reisekalender" description="Alle Reisen im Kalender" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <CalendarRange className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch keine Reise geplant</p>
          <p className="max-w-sm text-sm">Starte im KI-Chat, um deine erste Reise im Kalender zu sehen.</p>
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
      <PageHeader
        title="Reisekalender"
        description="Alle Reisen im Kalender"
        actions={
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" aria-label="Vorheriger Monat" onClick={goToPreviousMonth}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Heute
            </Button>
            <Button size="icon" variant="ghost" aria-label="Nächster Monat" onClick={goToNextMonth}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="flex flex-col gap-3 px-4 py-4">
          <p className="font-heading text-lg font-semibold text-foreground">{formatMonthLabel(year, month)}</p>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
            {WEEKDAY_LABELS_DE.map((label) => (
              <span key={label} className="py-1">
                {label}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {grid.map((cell) => {
              const cellTrips = getTripsForDay(trips, cell.date)
              const isToday = cell.date === todayIso
              return (
                <div
                  key={cell.date}
                  className={cn(
                    'flex min-h-16 flex-col items-start gap-1 rounded-lg border border-transparent p-1.5 text-xs',
                    cell.inCurrentMonth ? 'text-foreground' : 'text-muted-foreground/40',
                    cellTrips.length > 0 && 'border-teal/30 bg-teal/10',
                    isToday && 'border-gold',
                  )}
                >
                  <span className={cn('font-medium', isToday && 'text-gold')}>{cell.day}</span>
                  {cellTrips.map((trip) => (
                    <span key={trip.id} className="truncate rounded-full bg-teal/20 px-1.5 py-0.5 text-[10px] font-medium text-navy">
                      {trip.destination}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Textliche Liste unter dem Kalender: Farbige Zellen allein sind für
          Screenreader nicht zugänglich (analog Kartenansicht.tsx). */}
      <div className="grid gap-4 sm:grid-cols-2">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardContent className="flex items-center gap-3 px-4 py-4">
              <CalendarDays className="size-4 shrink-0 text-teal" />
              <div>
                <p className="font-heading font-semibold text-foreground">{trip.destination}</p>
                <span className="text-xs text-muted-foreground">{trip.dates}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
