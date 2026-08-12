import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin, MessageCircle, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Favorite {
  id: string
  destination: string
  country: string
  notes: string
  gradient: string
}

// Demo favorites until real storage exists (Favorite entity, per the PRD) —
// same placeholder approach as MeineReisen.tsx and Reiseentwuerfe.tsx.
// Destinations and gradients reuse the canonical inspiration set from
// Home.tsx instead of inventing new ones.
const initialFavorites: Favorite[] = [
  {
    id: '1',
    destination: 'Kapstadt',
    country: 'Südafrika',
    notes: 'Abenteuer-Trip, evtl. mit Safari kombinieren',
    gradient: 'from-navy to-teal',
  },
  {
    id: '2',
    destination: 'Reykjavik',
    country: 'Island',
    notes: 'Nordlichter — am besten im Winter planen',
    gradient: 'from-teal to-gold',
  },
]

export function Favoriten() {
  const [favorites, setFavorites] = useState(initialFavorites)

  function removeFavorite(id: string) {
    setFavorites((current) => current.filter((favorite) => favorite.id !== id))
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Favoriten" description="Gespeicherte Reiseziele" />
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
          <Heart className="size-8 text-teal" strokeWidth={1.5} />
          <p className="font-medium text-foreground">Noch keine Favoriten gespeichert</p>
          <p className="max-w-sm text-sm">
            Entdecke Reiseziele und speichere sie hier, um sie später einfach wiederzufinden.
          </p>
          <Button asChild className="mt-2 bg-teal text-navy hover:bg-teal/90">
            <Link to="/">
              <Sparkles className="size-4" />
              Ziele entdecken
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Favoriten" description="Gespeicherte Reiseziele" />

      <div className="grid gap-4 sm:grid-cols-2">
        {favorites.map((favorite) => (
          <Card key={favorite.id} className="overflow-hidden py-0">
            <div className={`h-28 bg-gradient-to-br ${favorite.gradient}`} />
            <CardContent className="flex flex-col gap-3 px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading font-semibold text-foreground">{favorite.destination}</p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {favorite.country}
                  </span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-teal hover:text-teal/80"
                  aria-label={`${favorite.destination} aus Favoriten entfernen`}
                  title="Aus Favoriten entfernen"
                  onClick={() => removeFavorite(favorite.id)}
                >
                  <Heart className="size-4 fill-current" />
                </Button>
              </div>

              {favorite.notes && <p className="text-sm text-muted-foreground">{favorite.notes}</p>}

              <Button asChild size="sm" className="w-fit bg-teal text-navy hover:bg-teal/90">
                <Link to="/ki-chat">
                  <MessageCircle className="size-4" />
                  Reise mit KI planen
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
