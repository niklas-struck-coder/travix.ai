import type { LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'

interface PlaceholderPageProps {
  title: string
  description: string
  icon: LucideIcon
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-24 text-center text-muted-foreground">
        <Icon className="size-10 text-teal" strokeWidth={1.5} />
        <p className="max-w-sm text-sm">
          {title} wird als Nächstes gebaut. Diese Seite ist Teil des Travix-Grundgerüsts.
        </p>
      </div>
    </div>
  )
}
