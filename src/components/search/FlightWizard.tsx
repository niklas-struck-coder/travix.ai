import { useState } from 'react'
import { Plane, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { CabinClass, FlightSearchParams } from '@/types/duffel'

interface FlightWizardProps {
  onSearch: (params: FlightSearchParams) => void
  loading: boolean
}

const cabinOptions: { value: CabinClass; label: string }[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
]

export function FlightWizard({ onSearch, loading }: FlightWizardProps) {
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('roundtrip')
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [cabinClass, setCabinClass] = useState<CabinClass>('economy')

  const isValid =
    origin.trim().length === 3 &&
    destination.trim().length === 3 &&
    departureDate &&
    (tripType === 'oneway' || (returnDate && returnDate >= departureDate))

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValid) return
    onSearch({
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      departureDate,
      returnDate: tripType === 'roundtrip' ? returnDate : undefined,
      passengers,
      cabinClass,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
      <Tabs value={tripType} onValueChange={(value) => setTripType(value as typeof tripType)}>
        <TabsList>
          <TabsTrigger value="roundtrip">Hin- und Rückflug</TabsTrigger>
          <TabsTrigger value="oneway">Nur Hinflug</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="origin">Von (IATA)</Label>
          <Input
            id="origin"
            value={origin}
            onChange={(event) => setOrigin(event.target.value.slice(0, 3))}
            placeholder="BER"
            maxLength={3}
            className="uppercase"
            required
          />
          <p className="text-xs text-muted-foreground">3-stelliger Flughafencode, z. B. BER</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="destination">Nach (IATA)</Label>
          <Input
            id="destination"
            value={destination}
            onChange={(event) => setDestination(event.target.value.slice(0, 3))}
            placeholder="LIS"
            maxLength={3}
            className="uppercase"
            required
          />
          <p className="text-xs text-muted-foreground">3-stelliger Flughafencode, z. B. LIS</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="departure">Hinflug</Label>
          <Input
            id="departure"
            type="date"
            value={departureDate}
            onChange={(event) => setDepartureDate(event.target.value)}
            required
          />
        </div>
        {tripType === 'roundtrip' && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="return">Rückflug</Label>
            <Input
              id="return"
              type="date"
              value={returnDate}
              onChange={(event) => setReturnDate(event.target.value)}
              min={departureDate || undefined}
              required
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:w-1/2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="passengers">Passagiere</Label>
          <Input
            id="passengers"
            type="number"
            min={1}
            max={9}
            value={passengers}
            onChange={(event) => setPassengers(Math.min(9, Math.max(1, Number(event.target.value))))}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cabin">Reiseklasse</Label>
          <Select value={cabinClass} onValueChange={(value) => setCabinClass(value as CabinClass)}>
            <SelectTrigger id="cabin">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {cabinOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" disabled={!isValid || loading} className="w-fit bg-teal text-navy hover:bg-teal/90">
        {loading ? <Plane className="animate-pulse" /> : <Search />}
        {loading ? 'Suche läuft …' : 'Flüge suchen'}
      </Button>
    </form>
  )
}
