import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DivIcon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { CalendarDays, MapPin, MessageCircle } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { loadStoredChat, hasTripData } from '@/lib/trip/tripStorage'
import { findKnownDestination } from '@/types/stays'

// Custom teal dot instead of Leaflet's default marker icon — matches the
// brand's teal/gold marker guidance in MARKENDESIGN.md and avoids the
// bundler-broken default marker image assets.
const markerIcon = new DivIcon({
  className: '',
  html: '<span class="block size-4 rounded-full border-2 border-white bg-teal shadow-md" />',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export function Kartenansicht() {
  const [stored] = useState(() => loadStoredChat())
  const trip = stored?.trip ?? null
  // Only known destinations (see src/types/stays.ts) carry real coordinates
  // — same curated list the chat already uses for the real Duffel Stays/
  // Flights search, so a pin here means the destination is genuinely
  // plannable, not a guess.
  const known = trip && hasTripData(trip) ? findKnownDestination(trip.destination ?? '') : null

  if (!known) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Kartenansicht" description="Reiseziele auf der Karte" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <MapPin className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">
            {trip && hasTripData(trip)
              ? 'Für dieses Ziel kenne ich noch keine Koordinaten für die Karte'
              : 'Noch keine Reise geplant'}
          </p>
          <p className="max-w-sm text-sm">Starte im KI-Chat, um dein Reiseziel auf der Karte zu sehen.</p>
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Kartenansicht" description="Reiseziele auf der Karte" />

      <div className="overflow-hidden rounded-2xl border border-border">
        <MapContainer center={[known.latitude, known.longitude]} zoom={5} scrollWheelZoom={false} style={{ height: '420px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          <Marker position={[known.latitude, known.longitude]} icon={markerIcon}>
            <Popup>{known.name}</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Textliche Liste neben der Karte: Kartenmarker allein sind für
          Screenreader nicht zugänglich. */}
      <Card>
        <CardContent className="flex items-center gap-3 px-4 py-4">
          <MapPin className="size-4 shrink-0 text-teal" />
          <div>
            <p className="font-heading font-semibold text-foreground">{known.name}</p>
            {trip?.dates && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {trip.dates}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
