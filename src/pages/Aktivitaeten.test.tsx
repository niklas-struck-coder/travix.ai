import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Aktivitaeten } from './Aktivitaeten'

describe('Aktivitaeten', () => {
  it('renders a card per demo activity with destination badge, name and price', () => {
    render(
      <MemoryRouter>
        <Aktivitaeten />
      </MemoryRouter>,
    )

    expect(screen.getByText('Fado-Abend in Alfama')).toBeInTheDocument()
    expect(screen.getByText('35 €')).toBeInTheDocument()
    expect(screen.getAllByText('Lissabon')).toHaveLength(2)

    expect(screen.getByText('Bambuswald Arashiyama')).toBeInTheDocument()
    expect(screen.getAllByText('Kyoto')).toHaveLength(2)
  })

  it('asks for confirmation before removing an activity, and keeps it if cancelled', () => {
    render(
      <MemoryRouter>
        <Aktivitaeten />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Fado-Abend in Alfama aus geplanten Aktivitäten entfernen' }))
    expect(screen.getByText('Aktivität entfernen?')).toBeInTheDocument()
    expect(
      screen.getByText(/Fado-Abend in Alfama wird aus deinen geplanten Aktivitäten entfernt/),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))
    expect(screen.queryByText('Aktivität entfernen?')).not.toBeInTheDocument()
    expect(screen.getByText('Fado-Abend in Alfama')).toBeInTheDocument()
  })

  it('removes an activity once its removal is confirmed, and shows the empty state once none are left', () => {
    render(
      <MemoryRouter>
        <Aktivitaeten />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Fado-Abend in Alfama aus geplanten Aktivitäten entfernen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))

    fireEvent.click(
      screen.getByRole('button', { name: 'Tagesausflug nach Sintra aus geplanten Aktivitäten entfernen' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))

    fireEvent.click(
      screen.getByRole('button', { name: 'Bambuswald Arashiyama aus geplanten Aktivitäten entfernen' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.getByText('Teezeremonie im Gion-Viertel')).toBeInTheDocument()

    fireEvent.click(
      screen.getByRole('button', { name: 'Teezeremonie im Gion-Viertel aus geplanten Aktivitäten entfernen' }),
    )
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.getByText('Noch keine Aktivitäten geplant')).toBeInTheDocument()
  })
})
