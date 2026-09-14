import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Preisalarme } from './Preisalarme'

describe('Preisalarme', () => {
  it('renders a card per demo alert with route and target-reached badge where applicable', () => {
    render(
      <MemoryRouter>
        <Preisalarme />
      </MemoryRouter>,
    )

    expect(screen.getByText('Berlin → Lissabon')).toBeInTheDocument()
    expect(screen.getByText('München → Kyoto')).toBeInTheDocument()
    // München → Kyoto: currentPrice (610) <= targetPrice (650) → target reached
    expect(screen.getByText('Ziel erreicht')).toBeInTheDocument()
    // Berlin → Lissabon: previousPrice (279) !== currentPrice (249) → change note shown
    expect(screen.getByText(/Preis hat sich seit deiner letzten Ansicht geändert/)).toBeInTheDocument()
  })

  it('asks for confirmation before removing an alert, and keeps it if cancelled', () => {
    render(
      <MemoryRouter>
        <Preisalarme />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Preisalarm für Berlin → Lissabon entfernen' }))
    expect(screen.getByText('Preisalarm entfernen?')).toBeInTheDocument()
    expect(screen.getByText(/Der Preisalarm für Berlin → Lissabon wird gelöscht/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))
    expect(screen.queryByText('Preisalarm entfernen?')).not.toBeInTheDocument()
    expect(screen.getByText('Berlin → Lissabon')).toBeInTheDocument()
  })

  it('removes an alert once its removal is confirmed, and shows the empty state once none are left', () => {
    render(
      <MemoryRouter>
        <Preisalarme />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Preisalarm für Berlin → Lissabon entfernen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.queryByText('Berlin → Lissabon')).not.toBeInTheDocument()
    expect(screen.getByText('München → Kyoto')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Preisalarm für München → Kyoto entfernen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.getByText('Noch keine Preisalarme aktiv')).toBeInTheDocument()
  })
})
