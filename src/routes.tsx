import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { PageTransition } from '@/components/layout/PageTransition'
import { Home } from '@/pages/Home'
import { KiChat } from '@/pages/KiChat'
import { Flugsuche } from '@/pages/Flugsuche'
import { Hotelsuche } from '@/pages/Hotelsuche'
import { MeineReisen } from '@/pages/MeineReisen'
import { Reiseentwuerfe } from '@/pages/Reiseentwuerfe'
import { Buchung } from '@/pages/Buchung'
import { Urlaubsmodus } from '@/pages/Urlaubsmodus'
import { Kartenansicht } from '@/pages/Kartenansicht'
import { Favoriten } from '@/pages/Favoriten'
import { Preisalarme } from '@/pages/Preisalarme'
import { Angebote } from '@/pages/Angebote'
import { Aktivitaeten } from '@/pages/Aktivitaeten'
import { Kalender } from '@/pages/Kalender'
import { Warenkorb } from '@/pages/Warenkorb'
import { Profil } from '@/pages/Profil'
import { Einstellungen } from '@/pages/Einstellungen'
import { ReiseSuche } from '@/pages/ReiseSuche'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { allRoutes } from '@/lib/nav-config'

const builtRoutes = new Set([
  '/',
  '/ki-chat',
  '/flugsuche',
  '/hotelsuche',
  '/meine-reisen',
  '/buchung',
  '/urlaubsmodus',
  '/entwuerfe',
  '/karte',
  '/favoriten',
  '/preisalarme',
  '/angebote',
  '/aktivitaeten',
  '/kalender',
  '/warenkorb',
  '/profil',
  '/einstellungen',
  '/reise-planen',
])

export function AppRoutes() {
  const location = useLocation()

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/ki-chat" element={<PageTransition><KiChat /></PageTransition>} />
          <Route path="/flugsuche" element={<PageTransition><Flugsuche /></PageTransition>} />
          <Route path="/hotelsuche" element={<PageTransition><Hotelsuche /></PageTransition>} />
          <Route path="/meine-reisen" element={<PageTransition><MeineReisen /></PageTransition>} />
          <Route path="/entwuerfe" element={<PageTransition><Reiseentwuerfe /></PageTransition>} />
          <Route path="/buchung" element={<PageTransition><Buchung /></PageTransition>} />
          <Route path="/urlaubsmodus" element={<PageTransition><Urlaubsmodus /></PageTransition>} />
          <Route path="/karte" element={<PageTransition><Kartenansicht /></PageTransition>} />
          <Route path="/favoriten" element={<PageTransition><Favoriten /></PageTransition>} />
          <Route path="/preisalarme" element={<PageTransition><Preisalarme /></PageTransition>} />
          <Route path="/angebote" element={<PageTransition><Angebote /></PageTransition>} />
          <Route path="/aktivitaeten" element={<PageTransition><Aktivitaeten /></PageTransition>} />
          <Route path="/kalender" element={<PageTransition><Kalender /></PageTransition>} />
          <Route path="/warenkorb" element={<PageTransition><Warenkorb /></PageTransition>} />
          <Route path="/profil" element={<PageTransition><Profil /></PageTransition>} />
          <Route path="/einstellungen" element={<PageTransition><Einstellungen /></PageTransition>} />
          <Route path="/reise-planen" element={<PageTransition><ReiseSuche /></PageTransition>} />
          {allRoutes
            .filter((item) => !builtRoutes.has(item.path))
            .map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={
                  <PageTransition>
                    <PlaceholderPage title={item.label} description={item.description} icon={item.icon} />
                  </PageTransition>
                }
              />
            ))}
        </Routes>
      </AnimatePresence>
    </AppShell>
  )
}
