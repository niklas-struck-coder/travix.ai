import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './routes'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'

function seedStoredTrip(destination: string) {
  const state: StoredChatState = {
    messages: [],
    trip: { ...emptyTrip, destination },
    quickReplies: [],
    editingField: null,
    awaitingFlightOrigin: false,
  }
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}

describe('AppRoutes', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('shows an honest not-found page instead of a blank screen for an unknown URL', () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Seite nicht gefunden' })).toBeInTheDocument()
  })

  it('scrolls back to the top when navigating to a new route', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>,
    )
    scrollToSpy.mockClear()

    fireEvent.click(screen.getAllByRole('link', { name: 'Profil' })[0])

    expect(scrollToSpy).toHaveBeenCalledWith(0, 0)
    scrollToSpy.mockRestore()
  })

  it('announces the new page to screen readers by focusing its heading after navigating', async () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getAllByRole('link', { name: 'Profil' })[0])

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Profil' }))
    })
  })

  it('sets a page-specific browser tab title that updates when navigating', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AppRoutes />
      </MemoryRouter>,
    )
    expect(document.title).toBe('Dashboard – Travix')

    fireEvent.click(screen.getAllByRole('link', { name: 'Profil' })[0])

    expect(document.title).toBe('Profil – Travix')
  })

  it('gives the honest not-found page its own tab title instead of the generic default', () => {
    render(
      <MemoryRouter initialEntries={['/does-not-exist']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(document.title).toBe('Seite nicht gefunden – Travix')
  })

  it('uses the trip destination as the /buchung tab title, matching its own <h1>, instead of the generic "Reiseplan" label', () => {
    seedStoredTrip('Lissabon')
    render(
      <MemoryRouter initialEntries={['/buchung']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Lissabon' })).toBeInTheDocument()
    expect(document.title).toBe('Lissabon – Travix')
  })

  it('falls back to the generic /buchung tab title when there is no stored trip yet', () => {
    render(
      <MemoryRouter initialEntries={['/buchung']}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(document.title).toBe('Reiseplan – Travix')
  })
})
