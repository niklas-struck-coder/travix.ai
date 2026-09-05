import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { KiChat } from './KiChat'
import { useChat } from '@/hooks/useChat'
import { emptyTrip } from '@/lib/ai/mockAdvisor'

vi.mock('@/hooks/useChat')

// jsdom doesn't implement Element.scrollTo — KiChat's auto-scroll effect
// calls it unconditionally on every render.
beforeAll(() => {
  Element.prototype.scrollTo = vi.fn()
})

const baseChatState = {
  messages: [],
  trip: emptyTrip,
  quickReplies: [],
  avatarState: 'idle' as const,
  isThinking: false,
  stayOffers: null,
  stayLoading: false,
  stayError: false,
  flightOffers: null,
  flightErrors: [],
  flightLoading: false,
  storageWarning: false,
  sendMessage: vi.fn(),
  selectHotel: vi.fn(),
  selectFlight: vi.fn(),
  resetChat: vi.fn(),
  startEdit: vi.fn(),
}

function renderKiChat(overrides: Partial<typeof baseChatState> = {}) {
  vi.mocked(useChat).mockReturnValue({ ...baseChatState, ...overrides })
  return render(
    <MemoryRouter>
      <KiChat />
    </MemoryRouter>,
  )
}

describe('KiChat storage warning', () => {
  it('shows a hint when the chat progress could not be saved', () => {
    renderKiChat({ storageWarning: true })

    expect(
      screen.getByText(
        'Dein Fortschritt kann gerade nicht dauerhaft gespeichert werden — ein Neuladen würde ihn verwerfen.',
      ),
    ).toBeInTheDocument()
  })

  it('shows no hint while saving works normally', () => {
    renderKiChat({ storageWarning: false })

    expect(
      screen.queryByText(
        'Dein Fortschritt kann gerade nicht dauerhaft gespeichert werden — ein Neuladen würde ihn verwerfen.',
      ),
    ).not.toBeInTheDocument()
  })
})
