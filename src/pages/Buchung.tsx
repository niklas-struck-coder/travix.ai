import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, CalendarDays, Wallet, BedDouble, Ticket, Sun, MessageCircle, Pencil, Plane, Train, Bus, Ship, Car } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { loadStoredChat, isTripComplete, hasTripData } from '@/lib/trip/tripStorage'
import type { TransportMode } from '@/types/chat'

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

interface SectionProps {
  icon: typeof Plane
  title: string
  value: string | null
  emptyLabel: string
}

function Section({ icon: Icon, title, value, emptyLabel }: SectionProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2 px-5 py-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <Icon className="size-4 text-teal" />
            {title}
          </div>
          {value && (
            <Button asChild size="icon" variant="ghost" className="size-6 text-muted-foreground hover:text-foreground">
              <Link to="/ki-chat" aria-label={`${title} bearbeiten`} title={`${title} bearbeiten`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
          )}
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
  const [stored] = useState(() => loadStoredChat())
  const trip = stored?.trip ?? null

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Section
          icon={TransportIcon}
          title="Transport"
          value={trip.transportMode ? transportLabels[trip.transportMode] : null}
          emptyLabel="Noch kein Transport ausgewählt"
        />
        <Section icon={CalendarDays} title="Reisedaten" value={trip.dates} emptyLabel="Noch keine Daten gewählt" />
        <Section icon={Wallet} title="Budget" value={trip.budget} emptyLabel="Noch kein Budget angegeben" />
        <Section
          icon={BedDouble}
          title="Unterkunft"
          value={trip.accommodation}
          emptyLabel="Noch keine Unterkunft ausgewählt"
        />
        <Section icon={Ticket} title="Aktivitäten" value={null} emptyLabel="Noch keine Aktivitäten geplant" />
      </div>

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
