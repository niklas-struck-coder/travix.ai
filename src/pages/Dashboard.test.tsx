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

    expect(screen.getAllByText('Alle ansehen')).toHaveLength(4)
  })

  it('gives each stat tile link a distinct accessible name instead of four identical "Alle ansehen" links', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Alle bevorstehenden Reisen ansehen' })).toHaveAttribute(
      'href',
      '/meine-reisen',
    )
    expect(screen.getByRole('link', { name: 'Alle Reiseentwürfe ansehen' })).toHaveAttribute('href', '/entwuerfe')
    expect(screen.getByRole('link', { name: 'Kompletten Warenkorb ansehen' })).toHaveAttribute('href', '/warenkorb')
    expect(screen.getByRole('link', { name: 'Alle Favoriten ansehen' })).toHaveAttribute('href', '/favoriten')
  })

  it('labels the averaged draft progress so it is not mistaken for a single trip\'s progress', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('Ø über 2 Entwürfe')).toBeInTheDocument()
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
