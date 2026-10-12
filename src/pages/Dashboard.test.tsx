import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { calculateProgress } from '@/lib/trip/calculateProgress'
import { Dashboard } from './Dashboard'

vi.mock('@/lib/trip/calculateProgress', async () => {
  const actual = await vi.importActual<typeof import('@/lib/trip/calculateProgress')>(
    '@/lib/trip/calculateProgress',
  )
  return { calculateProgress: vi.fn(actual.calculateProgress) }
})

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

  it('highlights the draft-progress tile in gold once the average reaches 80% or more (MARKENDESIGN.md)', () => {
    vi.mocked(calculateProgress).mockReturnValueOnce(100).mockReturnValueOnce(60)

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    const percentage = screen.getByText('80%')
    expect(percentage).toHaveClass('text-gold')
    expect(percentage).not.toHaveClass('text-foreground')

    const icon = document.querySelector('.lucide-file-clock')
    expect(icon).toHaveClass('text-gold')
    expect(icon).not.toHaveClass('text-teal')
  })

  it('keeps the draft-progress tile teal below the 80% gold threshold', () => {
    vi.mocked(calculateProgress).mockReturnValueOnce(60).mockReturnValueOnce(60)

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    const percentage = screen.getByText('60%')
    expect(percentage).toHaveClass('text-foreground')
    expect(percentage).not.toHaveClass('text-gold')

    const icon = document.querySelector('.lucide-file-clock')
    expect(icon).toHaveClass('text-teal')
    expect(icon).not.toHaveClass('text-gold')
  })
})
