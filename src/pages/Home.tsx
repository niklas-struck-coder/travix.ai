import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const destinations = [
  { name: 'Lissabon', tag: 'Städtetrip', gradient: 'from-teal to-navy' },
  { name: 'Kyoto', tag: 'Kultur & Natur', gradient: 'from-gold to-navy' },
  { name: 'Kapstadt', tag: 'Abenteuer', gradient: 'from-navy to-teal' },
  { name: 'Reykjavik', tag: 'Nordlichter', gradient: 'from-teal to-gold' },
]

export function Home() {
  return (
    <div className="flex flex-col gap-12">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-white sm:px-10 sm:py-20"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-teal/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-teal">
            <Sparkles className="size-3.5" />
            Dein KI-Reiseberater
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-5xl">
            Wohin soll deine nächste Reise gehen?
          </h1>
          <p className="mt-4 text-balance text-white/70 sm:text-lg">
            Beschreibe deinen Traumurlaub in eigenen Worten — Travix plant Transport, Unterkunft und
            Aktivitäten mit echten, geprüften Angeboten.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-teal text-navy hover:bg-teal/90">
              <Link to="/ki-chat">
                <MessageCircle className="size-4" />
                Reise mit KI planen
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
              <Link to="/reise-planen">
                Selbst durchsuchen
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-foreground">Beliebte Reiseziele</h2>
            <p className="text-sm text-muted-foreground">Inspiration für deine nächste Reise</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.05, ease: 'easeOut' }}
            >
              <Card className="overflow-hidden py-0">
                <div className={`h-28 bg-gradient-to-br ${destination.gradient}`} />
                <CardContent className="px-4 py-3">
                  <p className="font-heading font-semibold text-foreground">{destination.name}</p>
                  <p className="text-xs text-muted-foreground">{destination.tag}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
