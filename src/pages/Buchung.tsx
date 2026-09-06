import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  CalendarDays,
  Wallet,
  BedDouble,
  Ticket,
  Sun,
  MessageCircle,
  Pencil,
  Plane,
  Train,
  Bus,
  Ship,
  Car,
  Sparkles,
  SquarePen,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EditMode } from '@/components/trip/EditMode'
import { ChecklistPanel } from '@/components/trip/ChecklistPanel'
import { loadStoredChat, updateStoredTrip, isTripComplete, hasTripData } from '@/lib/trip/tripStorage'
import type { TransportMode, TripActivity } from '@/types/chat'

const transportIcons: Record<TransportMode, typeof Plane> = {
  flight: Plane,
  train: Train,
  bus: Bus,
  ferry: Ship,
  car: Car,
}

const transportLabels: Record<TransportMode, string> = {
  flight: 'Flug',
  train: 'Zug',
  bus: 'Bus',
  ferry: 'Fähre',
  car: 'Mietwagen',
}

interface EditChoice {
  aiHref: string
  manualHref: string
  manualLabel: string
}

interface SectionProps {
  icon: typeof Plane
  title: string
  value: string | null
  emptyLabel: string
  editHref: string
  /** When set, "Bearbeiten" opens a dialog to pick KI-Chat vs. the manual search page, instead of linking straight to editHref. */
  editChoice?: EditChoice
}

function Section({ icon: Icon, title, value, emptyLabel, editHref, editChoice }: SectionProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Icon className="size-4 text-teal" />
            {title}
          </div>
          {value &&
            (editChoice ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-6 text-muted-foreground hover:text-foreground"
                    aria-label={`${title} bearbeiten`}
                    title={`${title} bearbeiten`}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{title} bearbeiten</DialogTitle>
                    <DialogDescription>Wie möchtest du weitermachen?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button asChild variant="outline">
                      <Link to={editChoice.manualHref}>
                        <SquarePen className="size-4" />
                        {editChoice.manualLabel}
                      </Link>
                    </Button>
                    <Button asChild className="bg-teal text-navy hover:bg-teal/90">
                      <Link to={editChoice.aiHref}>
                        <Sparkles className="size-4" />
                        Mit KI planen
                      </Link>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button asChild size="icon" variant="ghost" className="size-6 text-muted-foreground hover:text-foreground">
                <Link to={editHref} aria-label={`${title} bearbeiten`} title={`${title} bearbeiten`}>
                  <Pencil className="size-3.5" />
                </Link>
              </Button>
            ))}
        </div>
        {value ? (
          <p className="font-heading text-lg font-semibold text-foreground">{value}</p>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">{emptyLabel}</p>
            <Button asChild size="sm" variant="outline">
              <Link to="/ki-chat">+ Suchen</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Buchung() {
  const [stored, setStored] = useState(() => loadStoredChat())
  const [storageWarning, setStorageWarning] = useState(false)
  const trip = stored?.trip ?? null

  function handleActivitiesChange(activities: TripActivity[]) {
    const updated = updateStoredTrip({ activities })
    if (updated) {
      setStored(updated)
      setStorageWarning(!updated.saved)
    }
  }

  if (!trip || !hasTripData(trip)) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Reiseplan" description="Dein interaktiver Buchungsüberblick" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <MapPin className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch keine Reise geplant</p>
          <p className="max-w-sm text-sm">Starte im KI-Chat, um deine erste Reise zu planen.</p>
          <Button asChild className="mt-2 bg-teal text-navy hover:bg-teal/90">
            <Link to="/ki-chat">
              <MessageCircle className="size-4" />
              Reise mit KI planen
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const complete = isTripComplete(trip)
  const TransportIcon = trip.transportMode ? transportIcons[trip.transportMode] : Plane
  // Flug ist der einzige Transportmodus mit eigener Such-/Auswahlseite — dort
  // lässt "Bearbeiten" zwischen KI-Chat und manueller Suche wählen. Die
  // anderen Modi (Zug/Bus/Fähre/Auto) haben noch keine eigene Suchseite,
  // dafür geht "Bearbeiten" direkt in den Chat.
  const transportEditHref = '/ki-chat?edit=transportMode'
  const transportEditChoice =
    trip.transportMode === 'flight'
      ? { aiHref: '/ki-chat?edit=transportMode', manualHref: '/flugsuche', manualLabel: 'Manuell suchen' }
      : undefined
  const accommodationEditChoice = {
    aiHref: '/ki-chat?edit=accommodation',
    manualHref: '/hotelsuche',
    manualLabel: 'Manuell suchen',
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={trip.destination ?? 'Deine Reise'}
        description="Dein interaktiver Buchungsüberblick"
        actions={
          <Button asChild variant="outline">
            <Link to="/ki-chat">
              <MessageCircle className="size-4" />
              Mit Travix weiterplanen
            </Link>
          </Button>
        }
      />

      <div className="flex items-center gap-2">
        <Badge className="bg-teal text-navy hover:bg-teal">
          <MapPin className="size-3.5" />
          {trip.destination}
        </Badge>
        <Badge variant={complete ? 'default' : 'secondary'}>{complete ? 'Reiseplan vollständig' : 'In Planung'}</Badge>
      </div>

      {storageWarning && (
        <p role="status" className="rounded-xl border border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          Dein Fortschritt kann gerade nicht dauerhaft gespeichert werden — ein Neuladen würde ihn verwerfen.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Section
          icon={TransportIcon}
          title="Transport"
          value={trip.transportMode ? transportLabels[trip.transportMode] : null}
          emptyLabel="Noch kein Transport ausgewählt"
          editHref={transportEditHref}
          editChoice={transportEditChoice}
        />
        <Section
          icon={CalendarDays}
          title="Reisedaten"
          value={trip.dates}
          emptyLabel="Noch keine Daten gewählt"
          editHref="/ki-chat?edit=dates"
        />
        <Section
          icon={Wallet}
          title="Budget"
          value={trip.budget}
          emptyLabel="Noch kein Budget angegeben"
          editHref="/ki-chat?edit=budget"
        />
        <Section
          icon={BedDouble}
          title="Unterkunft"
          value={trip.accommodation}
          emptyLabel="Noch keine Unterkunft ausgewählt"
          editHref="/ki-chat?edit=accommodation"
          editChoice={accommodationEditChoice}
        />
        <Card>
          <CardContent className="flex flex-col gap-2 px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Ticket className="size-4 text-teal" />
                Aktivitäten
              </div>
              <EditMode activities={trip.activities} onChange={handleActivitiesChange}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-6 text-muted-foreground hover:text-foreground"
                  aria-label="Aktivitäten bearbeiten"
                  title="Aktivitäten bearbeiten"
                >
                  <Pencil className="size-3.5" />
                </Button>
              </EditMode>
            </div>
            {trip.activities.length > 0 ? (
              <p className="font-heading text-lg font-semibold text-foreground">
                {trip.activities.length} {trip.activities.length === 1 ? 'Aktivität geplant' : 'Aktivitäten geplant'}
              </p>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">Noch keine Aktivitäten geplant</p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/ki-chat">+ Suchen</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ChecklistPanel trip={trip} />

      {complete && (
        <Card className="border-teal/30 bg-teal/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <Sun className="size-6 text-gold" />
              <div>
                <p className="font-heading font-semibold text-foreground">Bereit für die Reise?</p>
                <p className="text-sm text-muted-foreground">
                  Aktiviere den Urlaubsmodus für KI-Unterstützung rund um Kultur, Orte und Fragen vor Ort.
                </p>
              </div>
            </div>
            <Button asChild className="bg-gold text-navy hover:bg-gold/90">
              <Link to="/urlaubsmodus">Urlaubsmodus aktivieren</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
