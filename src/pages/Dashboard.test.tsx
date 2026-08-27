import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  it('renders stat tiles for trips, drafts, cart total, and favorites', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()

    expect(screen.getByText('Bevorstehende Reisen')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()

    expect(screen.getByText('Reiseentwürfe')).toBeInTheDocument()
    // Lissabon-Entwurf (transportMode+budget+dates = 3/5) und Kyoto-Entwurf
    // (nur dates = 1/5) ergeben im Schnitt 40% — siehe calculateProgress.ts.
    expect(screen.getByText('40%')).toBeInTheDocument()

    expect(screen.getByText('Warenkorb')).toBeInTheDocument()
    // Gleiche Demo-Positionen wie Warenkorb.tsx: 249+480+32+58+24 = 843 €
    expect(screen.getByText('843 €')).toBeInTheDocument()

    expect(screen.getByText('Favoriten')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    expect(screen.getAllByRole('link', { name: 'Alle ansehen' })).toHaveLength(4)
  })

  it('links each stat tile to its full page', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    const links = screen.getAllByRole('link', { name: 'Alle ansehen' })
    const hrefs = links.map((link) => link.getAttribute('href'))
    expect(hrefs).toEqual(['/meine-reisen', '/entwuerfe', '/warenkorb', '/favoriten'])
  })

  it('shows an honest placeholder for the still-undecided loyalty program instead of a made-up number', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    expect(screen.getByText('Prämienprogramm:', { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/noch nicht verfügbar/)).toBeInTheDocument()
  })
})
