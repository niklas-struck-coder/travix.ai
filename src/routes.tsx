import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
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
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ki-chat" element={<KiChat />} />
        <Route path="/flugsuche" element={<Flugsuche />} />
        <Route path="/meine-reisen" element={<MeineReisen />} />
        <Route path="/buchung" element={<Buchung />} />
        <Route path="/urlaubsmodus" element={<Urlaubsmodus />} />
        {allRoutes
          .filter((item) => !builtRoutes.has(item.path))
          .map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<PlaceholderPage title={item.label} description={item.description} icon={item.icon} />}
            />
          ))}
      </Routes>
    </AppShell>
  )
}
