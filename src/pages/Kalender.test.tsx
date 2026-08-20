import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Kalender } from './Kalender'

// Kalender.tsx starts on the current month, so the system clock is fixed to
// a date outside both demo trips' ranges (Lissabon: 15.-22. Sept 2026,
// Kyoto: 3.-10. März 2026) — keeps the initial render's grid free of trip
// badges and the navigation assertions below deterministic.
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 7, 20))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('Kalender', () => {
  it('renders the current month and lists both demo trips regardless of the shown month', () => {
    render(
      <MemoryRouter>
        <Kalender />
      </MemoryRouter>,
    )

    expect(screen.getByText('August 2026')).toBeInTheDocument()
    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('15. – 22. September 2026')).toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()
    expect(screen.getByText('3. – 10. März 2026')).toBeInTheDocument()
  })

  it('navigates to the next month and shows the trip badge on the matching day', () => {
    render(
      <MemoryRouter>
        <Kalender />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Nächster Monat' }))
    expect(screen.getByText('September 2026')).toBeInTheDocument()

    // 15.-22. September is 8 days, each carrying a Lissabon day-cell badge,
    // plus the one entry in the textual list below the grid.
    expect(screen.getAllByText('Lissabon')).toHaveLength(9)
  })

  it('navigates to the previous month and back to today via the "Heute" button', () => {
    render(
      <MemoryRouter>
        <Kalender />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Vorheriger Monat' }))
    expect(screen.getByText('Juli 2026')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Heute' }))
    expect(screen.getByText('August 2026')).toBeInTheDocument()
  })
})
