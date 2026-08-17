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
