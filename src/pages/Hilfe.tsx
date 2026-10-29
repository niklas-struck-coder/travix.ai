import { PageHeader } from '@/components/layout/PageHeader'
import { Card, CardContent } from '@/components/ui/card'

interface FaqItem {
  question: string
  answer: string
}

// Jede Antwort beschreibt nur, was tatsächlich im Code existiert (Duffel-
// Testdaten für Flug/Unterkunft, kein Nutzerkonto, lokale statt
// serverseitige Speicherung, noch kein freigeschalteter Support-Kontakt) —
// keine erfundenen Funktionen oder Kontaktwege, siehe MARKENDESIGN.md
// ("ehrlich statt verkäuferisch") und ZEITPLAN.md (Support-E-Mail noch
// nicht live).
const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Wie funktioniert der KI-Chat?',
    answer:
      'Du beschreibst deine Reise in eigenen Worten. Travix fragt dabei bewusst immer nur eine Sache auf einmal, statt dich mit einem langen Formular zu konfrontieren — und sagt ehrlich, wenn es etwas noch nicht weiß, statt zu raten.',
  },
  {
    question: 'Sind die angezeigten Flüge und Unterkünfte echt?',
    answer:
      'Flug- und Unterkunftssuche sind an echte Duffel-Testdaten angebunden, keine erfundenen Preise. Zug-, Bus- und Fährverbindungen sind dagegen noch nicht an eine echte Datenquelle angeschlossen.',
  },
  {
    question: 'Muss ich mich anmelden, um Travix zu nutzen?',
    answer:
      'Nein, ein Nutzerkonto gibt es aktuell noch nicht. Listen wie Favoriten, Angebote oder Preisalarme laufen deshalb mit Beispieldaten statt mit echten, dauerhaft gespeicherten eigenen Einträgen.',
  },
  {
    question: 'Bleiben meine Angaben erhalten, wenn ich die Seite neu lade?',
    answer:
      'Dein aktueller Chat- und Reiseplan-Stand wird lokal in deinem Browser gespeichert und bleibt beim Neuladen erhalten. Andere Seiten mit Beispieldaten setzen sich beim Neuladen zurück.',
  },
  {
    question: 'Wie kann ich eine Frage stellen, die hier nicht beantwortet wird?',
    answer:
      'Ein direkter Support-Kontakt ist aktuell noch nicht eingerichtet. Das kommt, sobald er steht — bis dahin gibt es dafür bewusst keinen erfundenen Kontaktweg.',
  },
]

export function Hilfe() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Hilfe" description="FAQ und Support" />
      <Card>
        <CardContent className="flex flex-col gap-6 px-5 py-5">
          <dl className="flex flex-col gap-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="flex flex-col gap-1.5">
                <dt className="font-heading text-base font-semibold text-navy">{item.question}</dt>
                <dd className="text-sm text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}
