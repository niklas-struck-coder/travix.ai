import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { PageTransition } from '@/components/layout/PageTransition'
import { Home } from '@/pages/Home'
import { KiChat } from '@/pages/KiChat'
import { Flugsuche } from '@/pages/Flugsuche'
import { MeineReisen } from '@/pages/MeineReisen'
import { Buchung } from '@/pages/Buchung'
import { Urlaubsmodus } from '@/pages/Urlaubsmodus'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { allRoutes } from '@/lib/nav-config'

const builtRoutes = new Set(['/', '/ki-chat', '/flugsuche', '/meine-reisen', '/buchung', '/urlaubsmodus'])

export function AppRoutes() {
  const location = useLocation()

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/ki-chat" element={<PageTransition><KiChat /></PageTransition>} />
          <Route path="/flugsuche" element={<PageTransition><Flugsuche /></PageTransition>} />
          <Route path="/meine-reisen" element={<PageTransition><MeineReisen /></PageTransition>} />
          <Route path="/buchung" element={<PageTransition><Buchung /></PageTransition>} />
          <Route path="/urlaubsmodus" element={<PageTransition><Urlaubsmodus /></PageTransition>} />
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
