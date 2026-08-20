import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Warenkorb } from './Warenkorb'

describe('Warenkorb', () => {
  it('renders demo items grouped by type with subtotals and a grand total', () => {
    render(
      <MemoryRouter>
        <Warenkorb />
      </MemoryRouter>,
    )

    expect(screen.getByText('Flüge')).toBeInTheDocument()
    expect(screen.getByText('Berlin → Lissabon, Hin- und Rückflug')).toBeInTheDocument()

    expect(screen.getByText('Unterkünfte')).toBeInTheDocument()
    expect(screen.getByText('Hotel Alfama Suites, Lissabon · 5 Nächte')).toBeInTheDocument()

    expect(screen.getByText('Transport')).toBeInTheDocument()
    expect(screen.getByText('Zugticket Kyoto → Osaka')).toBeInTheDocument()

    expect(screen.getByText('Aktivitäten')).toBeInTheDocument()
    expect(screen.getByText('Tagesausflug nach Sintra')).toBeInTheDocument()

    expect(screen.getByText('Versicherung')).toBeInTheDocument()
    expect(screen.getByText('Reise-Krankenversicherung, 10 Tage')).toBeInTheDocument()

    // Every demo item is alone in its group, so each subtotal equals that
    // item's own price — appears twice per item (group subtotal + item price).
    expect(screen.getAllByText('249 €')).toHaveLength(2)

    expect(screen.getByText('Gesamt')).toBeInTheDocument()
    expect(screen.getByText('843 €')).toBeInTheDocument()
  })

  it('recalculates group subtotal and grand total when an item is removed', () => {
    render(
      <MemoryRouter>
        <Warenkorb />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Tagesausflug nach Sintra aus dem Warenkorb entfernen' }))

    expect(screen.queryByText('Tagesausflug nach Sintra')).not.toBeInTheDocument()
    expect(screen.queryByText('Aktivitäten')).not.toBeInTheDocument()
    expect(screen.getByText('785 €')).toBeInTheDocument()
  })

  it('shows an encouraging empty state with a link back to KI-Chat once all items are removed', () => {
    render(
      <MemoryRouter>
        <Warenkorb />
      </MemoryRouter>,
    )

    for (const label of [
      'Berlin → Lissabon, Hin- und Rückflug',
      'Hotel Alfama Suites, Lissabon · 5 Nächte',
      'Zugticket Kyoto → Osaka',
      'Tagesausflug nach Sintra',
      'Reise-Krankenversicherung, 10 Tage',
    ]) {
      fireEvent.click(screen.getByRole('button', { name: `${label} aus dem Warenkorb entfernen` }))
    }

    expect(screen.getByText('Noch nichts im Warenkorb')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Reise mit KI planen/ })).toHaveAttribute('href', '/ki-chat')
  })
})
