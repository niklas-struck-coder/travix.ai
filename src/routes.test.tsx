import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { AppRoutes } from './routes'

describe('AppRoutes', () => {
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
})
