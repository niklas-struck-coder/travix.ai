import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { KiChat } from '@/pages/KiChat'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { allNavItems } from '@/lib/nav-config'

const builtRoutes = new Set(['/', '/ki-chat'])

export function AppRoutes() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ki-chat" element={<KiChat />} />
        {allNavItems
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
