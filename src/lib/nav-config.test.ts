import { describe, expect, it } from 'vitest'
import { allRoutes, navGroups } from '@/lib/nav-config'

describe('nav-config', () => {
  it('lists every fully built, non-contextual page in the permanent sidebar/mobile nav', () => {
    // Sidebar.tsx and MobileNav.tsx only ever render navGroups, never
    // extraRoutes — a page that belongs here but only lives in extraRoutes
    // is unreachable through normal navigation, only via a direct URL.
    // These pages are all fully built (see tasks-prd-travix-platform.md
    // 7.8-7.11/7.13/7.14) and, unlike Urlaubsmodus/Reise suchen, have no
    // other in-app link leading to them, so they must live here.
    const navGroupPaths = new Set(navGroups.flatMap((group) => group.items.map((item) => item.path)))
    for (const path of [
      '/dashboard',
      '/kalender',
      '/karte',
      '/aktivitaeten',
      '/angebote',
      '/favoriten',
      '/preisalarme',
    ]) {
      expect(navGroupPaths.has(path)).toBe(true)
    }
  })

  it('keeps every navGroups path unique and present in allRoutes', () => {
    const navGroupPaths = navGroups.flatMap((group) => group.items.map((item) => item.path))
    expect(new Set(navGroupPaths).size).toBe(navGroupPaths.length)
    for (const path of navGroupPaths) {
      expect(allRoutes.some((route) => route.path === path)).toBe(true)
    }
  })
})
