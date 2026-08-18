import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { Buchung } from './Buchung'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'

function seedStoredChat(overrides: Partial<StoredChatState['trip']> = {}) {
  const state: StoredChatState = {
    messages: [],
    trip: { ...emptyTrip, destination: 'Lissabon', ...overrides },
    quickReplies: [],
  }
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}

describe('Buchung – Grundgerüst', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the "Mit Travix weiterplanen" button linking to /ki-chat for an active trip', () => {
    seedStoredChat()
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    const link = screen.getByRole('link', { name: /Mit Travix weiterplanen/ })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/ki-chat')
  })

  it('renders every trip section (Transport, Reisedaten, Budget, Unterkunft, Aktivitäten) for a filled trip', () => {
    seedStoredChat({
      transportMode: 'train',
      dates: '12.–19. Sept.',
      budget: '1.500 €',
      accommodation: 'Hotel Lissabon',
      activities: [{ id: '1', name: 'Museum', price: '10 €' }],
    })
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    expect(screen.getByText('Transport')).toBeInTheDocument()
    expect(screen.getByText('Zug')).toBeInTheDocument()
    expect(screen.getByText('Reisedaten')).toBeInTheDocument()
    expect(screen.getByText('12.–19. Sept.')).toBeInTheDocument()
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByText('1.500 €')).toBeInTheDocument()
    expect(screen.getByText('Unterkunft')).toBeInTheDocument()
    expect(screen.getByText('Hotel Lissabon')).toBeInTheDocument()
    expect(screen.getByText('Aktivitäten')).toBeInTheDocument()
    expect(screen.getByText('1 Aktivität geplant')).toBeInTheDocument()
  })

  it('click-to-edit: Bearbeiten on Reisedaten/Budget links straight to KI-Chat with the field pre-loaded via ?edit=', () => {
    seedStoredChat({ dates: '12.–19. Sept.', budget: '1.500 €' })
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Reisedaten bearbeiten' })).toHaveAttribute(
      'href',
      '/ki-chat?edit=dates',
    )
    expect(screen.getByRole('link', { name: 'Budget bearbeiten' })).toHaveAttribute(
      'href',
      '/ki-chat?edit=budget',
    )
  })

  it('click-to-edit: Bearbeiten on Transport links straight to KI-Chat when there is no dedicated search page for the mode', () => {
    seedStoredChat({ transportMode: 'train' })
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Transport bearbeiten' })).toHaveAttribute(
      'href',
      '/ki-chat?edit=transportMode',
    )
  })

  it('click-to-edit: Bearbeiten on Unterkunft offers "Mit KI planen", which pre-loads the accommodation context in KI-Chat', () => {
    seedStoredChat({ accommodation: 'Hotel Lissabon' })
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Unterkunft bearbeiten' }))
    expect(screen.getByRole('link', { name: /Mit KI planen/ })).toHaveAttribute(
      'href',
      '/ki-chat?edit=accommodation',
    )
  })
})

describe('Buchung – Aktivitäten', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the empty state when no activities are planned yet', () => {
    seedStoredChat()
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    expect(screen.getByText('Noch keine Aktivitäten geplant')).toBeInTheDocument()
  })

  it('adds an activity via EditMode and reflects it in the section and localStorage', () => {
    seedStoredChat()
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Aktivitäten bearbeiten' }))
    fireEvent.change(screen.getByLabelText('Neue Aktivität'), { target: { value: 'Stadtführung' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aktivität hinzufügen' }))

    expect(screen.getByText('1 Aktivität geplant')).toBeInTheDocument()
    const stored = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) ?? '{}') as StoredChatState
    expect(stored.trip.activities).toMatchObject([{ name: 'Stadtführung' }])
  })

  it('removes an activity via EditMode and falls back to the empty state', () => {
    seedStoredChat({ activities: [{ id: '1', name: 'Museum', price: '10 €' }] })
    render(
      <MemoryRouter>
        <Buchung />
      </MemoryRouter>,
    )

    expect(screen.getByText('1 Aktivität geplant')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Aktivitäten bearbeiten' }))
    fireEvent.click(screen.getByRole('button', { name: 'Museum entfernen' }))

    expect(screen.getByText('Noch keine Aktivitäten geplant')).toBeInTheDocument()
  })
})
