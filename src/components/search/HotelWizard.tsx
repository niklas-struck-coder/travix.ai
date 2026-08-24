import { useState } from 'react'
import type { FormEvent } from 'react'
import { BedDouble, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { findKnownDestination, knownDestinations } from '@/types/stays'
import type { StaySearchParams } from '@/types/stays'

function clampGuestCount(value: string) {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? 1 : Math.min(9, Math.max(1, parsed))
}

interface HotelWizardProps {
  onSearch: (params: StaySearchParams) => void
  loading: boolean
}

// Reiseziel kommt aus der kuratierten Liste (dieselbe wie im Chat) statt aus
// freier Texteingabe — es gibt noch keine echte Orts-Autovervollständigung,
// und wir wollen keine Koordinaten für einen unbekannten Ort erfinden.
export function HotelWizard({ onSearch, loading }: HotelWizardProps) {
  const [destinationName, setDestinationName] = useState('')
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')
  const [rooms, setRooms] = useState(1)
  const [guests, setGuests] = useState(1)

  const isValid = Boolean(destinationName && checkInDate && checkOutDate && checkOutDate > checkInDate)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const destination = findKnownDestination(destinationName)
    if (!isValid || !destination) return
    onSearch({
      latitude: destination.latitude,
      longitude: destination.longitude,
      checkInDate,
      checkOutDate,
      rooms,
      guests,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="destination">Reiseziel</Label>
          <Select value={destinationName} onValueChange={setDestinationName}>
            <SelectTrigger id="destination">
              <SelectValue placeholder="Reiseziel wählen" />
            </SelectTrigger>
            <SelectContent>
              {knownDestinations.map((destination) => (
                <SelectItem key={destination.name} value={destination.name}>
                  {destination.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkin">Check-in</Label>
          <Input id="checkin" type="date" value={checkInDate} onChange={(event) => setCheckInDate(event.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="checkout">Check-out</Label>
          <Input
            id="checkout"
            type="date"
            value={checkOutDate}
            onChange={(event) => setCheckOutDate(event.target.value)}
            min={checkInDate || undefined}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:w-1/2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rooms">Zimmer</Label>
          <Input
            id="rooms"
            type="number"
            min={1}
            max={9}
            value={rooms}
            onChange={(event) => setRooms(clampGuestCount(event.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="guests">Gäste</Label>
          <Input
            id="guests"
            type="number"
            min={1}
            max={9}
            value={guests}
            onChange={(event) => setGuests(clampGuestCount(event.target.value))}
          />
        </div>
      </div>

      <Button type="submit" disabled={!isValid || loading} className="w-fit bg-teal text-navy hover:bg-teal/90">
        {loading ? <BedDouble className="animate-pulse" /> : <Search />}
        {loading ? 'Suche läuft …' : 'Hotels suchen'}
      </Button>
    </form>
  )
}
