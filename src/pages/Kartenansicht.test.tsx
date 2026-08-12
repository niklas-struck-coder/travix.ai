import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { Kartenansicht } from './Kartenansicht'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'

function seedStoredTrip(patch: Partial<StoredChatState['trip']>) {
  const state: StoredChatState = {
    messages: [{ id: '1', role: 'assistant', content: 'Hallo', timestamp: 0 }],
    trip: { ...emptyTrip, ...patch },
    quickReplies: [],
  }
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}

describe('Kartenansicht', () => {
  afterEach(() => {
    localStorage.removeItem(CHAT_STORAGE_KEY)
  })

  it('shows an empty state instead of fabricated destinations when nothing is planned yet', () => {
    render(
      <MemoryRouter>
        <Kartenansicht />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Kartenansicht' })).toBeInTheDocument()
    expect(screen.getByText('Noch keine Reise geplant')).toBeInTheDocument()
  })

  it('shows the actual planned destination and dates from the chat trip once one exists', () => {
    seedStoredTrip({ destination: 'Lissabon', dates: '15. – 22. September 2026' })

    render(
      <MemoryRouter>
        <Kartenansicht />
      </MemoryRouter>,
    )

    expect(screen.getAllByText('Lissabon').length).toBeGreaterThan(0)
    expect(screen.getByText('15. – 22. September 2026')).toBeInTheDocument()
  })

  it('shows a dedicated notice for destinations without known coordinates instead of guessing', () => {
    seedStoredTrip({ destination: 'Nirgendwo' })

    render(
      <MemoryRouter>
        <Kartenansicht />
      </MemoryRouter>,
    )

    expect(screen.getByText('Für dieses Ziel kenne ich noch keine Koordinaten für die Karte')).toBeInTheDocument()
  })
})
