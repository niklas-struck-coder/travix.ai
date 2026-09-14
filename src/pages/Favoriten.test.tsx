import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Favoriten } from './Favoriten'

describe('Favoriten', () => {
  it('renders a card per demo favorite with destination and country', () => {
    render(
      <MemoryRouter>
        <Favoriten />
      </MemoryRouter>,
    )

    expect(screen.getByText('Kapstadt')).toBeInTheDocument()
    expect(screen.getByText('Südafrika')).toBeInTheDocument()
    expect(screen.getByText('Reykjavik')).toBeInTheDocument()
    expect(screen.getByText('Island')).toBeInTheDocument()
  })

  it('asks for confirmation before removing a favorite, and keeps it if cancelled', () => {
    render(
      <MemoryRouter>
        <Favoriten />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Kapstadt aus Favoriten entfernen' }))
    expect(screen.getByText('Aus Favoriten entfernen?')).toBeInTheDocument()
    expect(screen.getByText(/Kapstadt wird aus deinen Favoriten entfernt/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))
    expect(screen.queryByText('Aus Favoriten entfernen?')).not.toBeInTheDocument()
    expect(screen.getByText('Kapstadt')).toBeInTheDocument()
  })

  it('removes a favorite once its removal is confirmed, and shows the empty state once none are left', () => {
    render(
      <MemoryRouter>
        <Favoriten />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Kapstadt aus Favoriten entfernen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.queryByText('Kapstadt')).not.toBeInTheDocument()
    expect(screen.getByText('Reykjavik')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reykjavik aus Favoriten entfernen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.getByText('Noch keine Favoriten gespeichert')).toBeInTheDocument()
  })
})
