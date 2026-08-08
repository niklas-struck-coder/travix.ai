import { SearchX } from 'lucide-react'

interface NoResultsMessageProps {
  title?: string
  message?: string
}

export function NoResultsMessage({
  title = 'Keine Ergebnisse gefunden',
  message = 'Für diese Suche gibt es aktuell keine echten Angebote. Versuche andere Daten oder ein anderes Reiseziel — wir erfinden nichts dazu.',
}: NoResultsMessageProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-12 text-center text-muted-foreground">
      <SearchX className="size-8 text-teal" strokeWidth={1.5} />
      <p className="font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm">{message}</p>
    </div>
  )
}
