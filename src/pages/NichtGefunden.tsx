import { Link } from 'react-router-dom'
import { Compass, Home as HomeIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'

export function NichtGefunden() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Seite nicht gefunden" description="Diese Adresse gibt es bei Travix nicht" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
        <Compass className="size-10 text-teal" strokeWidth={1.5} />
        <p className="max-w-sm text-sm">Diese Seite gibt es nicht — vielleicht ein Tippfehler in der Adresse.</p>
        <Button asChild className="mt-2 bg-teal text-navy hover:bg-teal/90">
          <Link to="/">
            <HomeIcon className="size-4" />
            Zur Startseite
          </Link>
        </Button>
      </div>
    </div>
  )
}
