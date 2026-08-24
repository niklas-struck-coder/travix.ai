import { Link } from 'react-router-dom'
import { MessageCircle, Plane, BedDouble, ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SearchOption {
  path: string
  icon: typeof MessageCircle
  title: string
  description: string
  cta: string
  recommended?: boolean
}

const searchOptions: SearchOption[] = [
  {
    path: '/ki-chat',
    icon: MessageCircle,
    title: 'Reise mit KI planen',
    description:
      'Beschreibe deinen Traumurlaub in eigenen Worten — die KI stellt eine Frage nach der anderen und stellt Transport, Unterkunft und Aktivitäten für dich zusammen.',
    cta: 'Zum KI-Chat',
    recommended: true,
  },
  {
    path: '/flugsuche',
    icon: Plane,
    title: 'Flüge vergleichen',
    description: 'Direkt selbst nach Flügen suchen und aus echten Testangeboten auswählen.',
    cta: 'Zur Flugsuche',
  },
  {
    path: '/hotelsuche',
    icon: BedDouble,
    title: 'Unterkünfte vergleichen',
    description: 'Direkt selbst nach Unterkünften suchen und aus echten Testangeboten auswählen.',
    cta: 'Zur Hotelsuche',
  },
]

export function ReiseSuche() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reise suchen" description="Wie möchtest du deine nächste Reise starten?" />

      <div className="grid gap-4 sm:grid-cols-3">
        {searchOptions.map((option) => (
          <Card key={option.path}>
            <CardContent className="flex h-full flex-col gap-4 px-4 py-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <option.icon className="size-5" strokeWidth={1.75} />
                </div>
                {option.recommended && (
                  <Badge className="bg-teal text-navy hover:bg-teal">Empfohlen</Badge>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <p className="font-heading font-semibold text-foreground">{option.title}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              <Button
                asChild
                variant={option.recommended ? 'default' : 'outline'}
                className={option.recommended ? 'bg-teal text-navy hover:bg-teal/90' : undefined}
              >
                <Link to={option.path}>
                  {option.cta}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
