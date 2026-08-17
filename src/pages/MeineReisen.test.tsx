import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MeineReisen } from './MeineReisen'

describe('MeineReisen', () => {
  it('renders a card per demo trip with destination, dates and status badge', () => {
    render(
      <MemoryRouter>
        <MeineReisen />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('15. – 22. September 2026')).toBeInTheDocument()
    expect(screen.getByText('Bevorstehend')).toBeInTheDocument()

    expect(screen.getByText('Kyoto')).toBeInTheDocument()
    expect(screen.getByText('3. – 10. März 2026')).toBeInTheDocument()
    expect(screen.getByText('Abgeschlossen')).toBeInTheDocument()
  })

  it('offers Urlaubsmodus only for the upcoming trip, not the past one', () => {
    render(
      <MemoryRouter>
        <MeineReisen />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Urlaubsmodus aktivieren/i })).toBeInTheDocument()
    expect(screen.getByText('Reise abgeschlossen')).toBeInTheDocument()
  })
})
