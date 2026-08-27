import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ChecklistPanel } from './ChecklistPanel'
import { emptyTrip } from '@/lib/ai/mockAdvisor'

describe('ChecklistPanel – Klick zum Weiterplanen (6.10)', () => {
  it('links every auto-detected item to the matching KI-Chat edit field when still open', () => {
    render(
      <MemoryRouter>
        <ChecklistPanel trip={emptyTrip} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Transport ausgewählt/ })).toHaveAttribute(
      'href',
      '/ki-chat?edit=transportMode',
    )
    expect(screen.getByRole('link', { name: /Reisedaten festgelegt/ })).toHaveAttribute('href', '/ki-chat?edit=dates')
    expect(screen.getByRole('link', { name: /Unterkunft ausgewählt/ })).toHaveAttribute(
      'href',
      '/ki-chat?edit=accommodation',
    )
    expect(screen.getByRole('link', { name: /Aktivitäten geplant/ })).toHaveAttribute('href', '/ki-chat')
    expect(screen.getByRole('link', { name: /Budget festgelegt/ })).toHaveAttribute('href', '/ki-chat?edit=budget')
  })

  it('keeps the same edit links once an item is already filled in, so it can be revisited', () => {
    render(
      <MemoryRouter>
        <ChecklistPanel
          trip={{
            ...emptyTrip,
            transportMode: 'train',
            dates: '12.–19. Sept.',
            budget: '1.500 €',
            accommodation: 'Hotel Lissabon',
            activities: [{ id: '1', name: 'Museum', price: '10 €' }],
          }}
        />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Transport ausgewählt/ })).toHaveAttribute(
      'href',
      '/ki-chat?edit=transportMode',
    )
    expect(screen.getByRole('link', { name: /Unterkunft ausgewählt/ })).toHaveAttribute(
      'href',
      '/ki-chat?edit=accommodation',
    )
  })
})
