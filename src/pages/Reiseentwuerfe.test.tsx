import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Reiseentwuerfe } from './Reiseentwuerfe'

describe('Reiseentwuerfe', () => {
  it('renders a draft card per demo trip with progress and status', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()
    expect(screen.getByText('In Bearbeitung')).toBeInTheDocument()
    expect(screen.getByText('Pausiert')).toBeInTheDocument()
    // transportMode, budget, dates filled (3 of 5) → 60%
    expect(screen.getByText('60%')).toBeInTheDocument()
    // only dates filled → 20%
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('pauses and resumes a draft via the pause/play toggle', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon pausieren' }))
    expect(screen.getAllByText('Pausiert')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon fortsetzen' }))
    expect(screen.getAllByText('In Bearbeitung')).toHaveLength(1)
  })

  it('finalizes a draft and hides its pause/finalize actions afterward', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon abschließen' }))
    expect(screen.getByText('Abgeschlossen')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Lissabon pausieren' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Lissabon abschließen' })).not.toBeInTheDocument()
  })

  it('duplicates a draft, inserting a second card with the same destination', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon duplizieren' }))
    expect(screen.getAllByText('Lissabon')).toHaveLength(2)
    expect(screen.getAllByText('In Bearbeitung')).toHaveLength(2)
  })

  it('deletes a draft, and shows the empty state once none are left', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon löschen' }))
    expect(screen.queryByText('Lissabon')).not.toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Kyoto löschen' }))
    expect(screen.getByText('Noch keine Reiseentwürfe')).toBeInTheDocument()
  })
})
