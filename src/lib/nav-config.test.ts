import { describe, expect, it } from 'vitest'
import { allRoutes, navGroups } from '@/lib/nav-config'

describe('nav-config', () => {
  it('lists the Dashboard hub page in the permanent sidebar/mobile nav, not just as a contextual route', () => {
    // Sidebar.tsx and MobileNav.tsx only ever render navGroups, never
    // extraRoutes — a page that belongs here but only lives in extraRoutes
    // is unreachable through normal navigation, only via a direct URL.
    const dashboardInNavGroups = navGroups.some((group) => group.items.some((item) => item.path === '/dashboard'))
    expect(dashboardInNavGroups).toBe(true)
  })

  it('keeps every navGroups path unique and present in allRoutes', () => {
    const navGroupPaths = navGroups.flatMap((group) => group.items.map((item) => item.path))
    expect(new Set(navGroupPaths).size).toBe(navGroupPaths.length)
    for (const path of navGroupPaths) {
      expect(allRoutes.some((route) => route.path === path)).toBe(true)
    }
  })
})
