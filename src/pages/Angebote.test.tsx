import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Angebote } from './Angebote'

describe('Angebote', () => {
  it('renders a card per demo saved offer with type badge, destination and price', () => {
    render(
      <MemoryRouter>
        <Angebote />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('Berlin → Lissabon, Hin- und Rückflug')).toBeInTheDocument()
    expect(screen.getByText('249 €')).toBeInTheDocument()
    expect(screen.getByText('Flug')).toBeInTheDocument()

    expect(screen.getByText('Kyoto')).toBeInTheDocument()
    expect(screen.getByText('Hotel Gion Nanba, 7 Nächte')).toBeInTheDocument()
    expect(screen.getByText('610 €')).toBeInTheDocument()
    expect(screen.getByText('Unterkunft')).toBeInTheDocument()
  })

  it('removes an offer when its remove button is clicked, and shows the empty state once none are left', () => {
    render(
      <MemoryRouter>
        <Angebote />
      </MemoryRouter>,
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Berlin → Lissabon, Hin- und Rückflug aus gespeicherten Angeboten entfernen' }),
    )
    expect(screen.queryByText('Lissabon')).not.toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Hotel Gion Nanba, 7 Nächte aus gespeicherten Angeboten entfernen' }),
    )
    expect(screen.getByText('Noch keine Angebote gespeichert')).toBeInTheDocument()
  })
})
