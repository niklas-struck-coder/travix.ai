import 'leaflet/dist/leaflet.css'
import { DivIcon } from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { CalendarDays, MapPin } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

interface MapDestination {
  id: string
  destination: string
  dates: string
  lat: number
  lng: number
}

// Demo destinations until real trip data with coordinates exists (Base44
// entities, per the PRD) — same two demo trips as MeineReisen.tsx and
// Reiseentwuerfe.tsx, placed at their real-world coordinates.
const destinations: MapDestination[] = [
  { id: '1', destination: 'Lissabon', dates: '15. – 22. September 2026', lat: 38.7223, lng: -9.1393 },
  { id: '2', destination: 'Kyoto', dates: '3. – 10. März 2026', lat: 35.0116, lng: 135.7681 },
]

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
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Kartenansicht" description="Reiseziele auf der Karte" />

      <div className="overflow-hidden rounded-2xl border border-border">
        <MapContainer center={[20, 20]} zoom={2} scrollWheelZoom={false} style={{ height: '420px', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {destinations.map((d) => (
            <Marker key={d.id} position={[d.lat, d.lng]} icon={markerIcon}>
              <Popup>{d.destination}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Textliche Liste neben der Karte: Kartenmarker allein sind für
          Screenreader nicht zugänglich. */}
      <div className="grid gap-4 sm:grid-cols-2">
        {destinations.map((d) => (
          <Card key={d.id}>
            <CardContent className="flex items-center gap-3 px-4 py-4">
              <MapPin className="size-4 shrink-0 text-teal" />
              <div>
                <p className="font-heading font-semibold text-foreground">{d.destination}</p>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {d.dates}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
