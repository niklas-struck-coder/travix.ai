import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { Urlaubsmodus } from './Urlaubsmodus'
import { CHAT_STORAGE_KEY } from '@/lib/trip/tripStorage'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import type { StoredChatState } from '@/lib/trip/tripStorage'

// jsdom doesn't implement Element.scrollTo — Urlaubsmodus's auto-scroll
// effect calls it unconditionally on every render.
beforeAll(() => {
  Element.prototype.scrollTo = vi.fn()
})

function seedStoredChat(overrides: Partial<StoredChatState['trip']> = {}) {
  const state: StoredChatState = {
    messages: [],
    trip: { ...emptyTrip, ...overrides },
    quickReplies: [],
  }
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
}

function renderUrlaubsmodus() {
  return render(
    <MemoryRouter>
      <Urlaubsmodus />
    </MemoryRouter>,
  )
}

describe('Urlaubsmodus – ohne geplante Reise', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('greets with the generic message and no quick replies', () => {
    renderUrlaubsmodus()

    expect(
      screen.getByText(
        'Willkommen im Urlaubsmodus! Sobald eine Reise geplant ist, helfe ich dir hier mit Fragen rund um Kultur, Sprache und deinen Trip.',
      ),
    ).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Währung?' })).not.toBeInTheDocument()
  })
})

describe('Urlaubsmodus – mit geplanter Reise', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the destination banner with dates for a known destination', () => {
    seedStoredChat({ destination: 'Lissabon', dates: '12.–19. Sept.' })
    renderUrlaubsmodus()

    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('12.–19. Sept.')).toBeInTheDocument()
  })

  it('greets by destination name and offers quick replies for a curated destination', () => {
    seedStoredChat({ destination: 'Lissabon' })
    renderUrlaubsmodus()

    expect(
      screen.getByText('Willkommen im Urlaubsmodus für deine Reise nach Lissabon! Frag mich zu Währung, Notrufnummern, Begrüßungsfloskeln oder anderen Fragen rund um deinen Trip.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Währung?' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Notrufnummer?' })).toBeInTheDocument()
  })

  it('shows the banner without a dates line when no dates are set', () => {
    seedStoredChat({ destination: 'Kyoto', dates: undefined })
    renderUrlaubsmodus()

    expect(screen.getByText('Kyoto')).toBeInTheDocument()
  })

  it('offers no quick replies for a real but uncurated destination', () => {
    seedStoredChat({ destination: 'Bali' })
    renderUrlaubsmodus()

    expect(screen.queryByRole('button', { name: 'Währung?' })).not.toBeInTheDocument()
  })
})

describe('Urlaubsmodus – Chat-Interaktion', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('adds the typed message immediately and shows the thinking indicator', () => {
    seedStoredChat({ destination: 'Lissabon' })
    renderUrlaubsmodus()

    fireEvent.change(screen.getByPlaceholderText('Frag mich etwas zu deiner Reise…'), {
      target: { value: 'Welche Währung brauche ich?' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Senden' }))

    expect(screen.getByText('Welche Währung brauche ich?')).toBeInTheDocument()
    expect(screen.getByText('Travix denkt nach …')).toBeInTheDocument()
  })

  it('shows the fact-based reply after the delay for a curated destination', () => {
    seedStoredChat({ destination: 'Lissabon' })
    renderUrlaubsmodus()

    fireEvent.click(screen.getByRole('button', { name: 'Währung?' }))
    act(() => {
      vi.advanceTimersByTime(700)
    })

    expect(screen.getByText('Vor Ort zahlst du in Euro (€). Am besten mit Karte oder etwas Bargeld für Kleinigkeiten.')).toBeInTheDocument()
  })
})
