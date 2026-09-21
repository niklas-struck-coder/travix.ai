import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MobileNav } from './MobileNav'

// Simulates the surrounding page: PageHeader renders each route's <h1>,
// which is exactly what the close-focus fallback in sheet.tsx/MobileNav
// looks for.
function MobileNavWithPageHeading() {
  return (
    <>
      <h1>Testseite</h1>
      <MobileNav />
    </>
  )
}

describe('MobileNav', () => {
  it('zeigt das Menü nicht, bevor der Menü-Button angeklickt wurde', () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: /KI-Chat/ })).not.toBeInTheDocument()
  })

  it('öffnet beim Klick auf den Menü-Button alle Navigationsgruppen mit ihren Links', () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }))

    expect(screen.getByText('Planen')).toBeInTheDocument()
    expect(screen.getByText('Meine Reise')).toBeInTheDocument()
    expect(screen.getByText('Konto')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /KI-Chat/ })).toHaveAttribute('href', '/ki-chat')
  })

  it('schließt das Menü beim Klick auf einen Navigationslink', () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }))
    fireEvent.click(screen.getByRole('link', { name: /KI-Chat/ }))

    expect(screen.queryByRole('link', { name: /KI-Chat/ })).not.toBeInTheDocument()
  })

  it('kündigt den Schließen-Button des geöffneten Menüs auf Deutsch an', () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }))

    expect(screen.getByRole('button', { name: 'Schließen' })).toBeInTheDocument()
  })

  it('setzt den Fokus nach einem Navigationslink auf die Überschrift der neuen Seite statt zurück auf den Menü-Button', async () => {
    render(
      <MemoryRouter>
        <MobileNavWithPageHeading />
      </MemoryRouter>,
    )

    const menuButton = screen.getByRole('button', { name: 'Menü öffnen' })
    fireEvent.click(menuButton)
    fireEvent.click(screen.getByRole('link', { name: /KI-Chat/ }))

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Testseite' }))
    })
  })

  it('kehrt beim Schließen ohne Navigation (z.B. Escape) weiterhin zum Menü-Button zurück', async () => {
    render(
      <MemoryRouter>
        <MobileNavWithPageHeading />
      </MemoryRouter>,
    )

    const menuButton = screen.getByRole('button', { name: 'Menü öffnen' })
    menuButton.focus()
    fireEvent.click(menuButton)
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }))

    await waitFor(() => {
      expect(document.activeElement).toBe(menuButton)
    })
  })
})
