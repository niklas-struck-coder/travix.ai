import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { KiChat } from './KiChat'
import { useChat } from '@/hooks/useChat'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import { stopSpeaking } from '@/lib/ai/speech'

vi.mock('@/hooks/useChat')
vi.mock('@/lib/ai/speech', () => ({
  isSpeechSynthesisSupported: () => true,
  isSpeechRecognitionSupported: () => false,
  stopSpeaking: vi.fn(),
}))

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
  stayErrors: [],
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

describe('KiChat speech synthesis stop', () => {
  it('stops speaking when turning speech output off', () => {
    vi.mocked(stopSpeaking).mockClear()
    renderKiChat()

    fireEvent.click(screen.getByRole('button', { name: 'Sprachausgabe aktivieren' }))
    vi.mocked(stopSpeaking).mockClear()
    fireEvent.click(screen.getByRole('button', { name: 'Sprachausgabe deaktivieren' }))

    expect(stopSpeaking).toHaveBeenCalled()
  })

  it('stops speaking when the chat is reset', () => {
    vi.mocked(stopSpeaking).mockClear()
    const resetChat = vi.fn()
    renderKiChat({ resetChat })

    fireEvent.click(screen.getByRole('button', { name: 'Neu starten' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, neu starten' }))

    expect(stopSpeaking).toHaveBeenCalled()
    expect(resetChat).toHaveBeenCalled()
  })

  it('stops speaking when leaving the chat (unmount)', () => {
    vi.mocked(stopSpeaking).mockClear()
    const { unmount } = renderKiChat()
    vi.mocked(stopSpeaking).mockClear()

    unmount()

    expect(stopSpeaking).toHaveBeenCalled()
  })
})

describe('KiChat reset confirmation', () => {
  it('does not reset immediately, but asks for confirmation first', () => {
    const resetChat = vi.fn()
    renderKiChat({ resetChat })

    fireEvent.click(screen.getByRole('button', { name: 'Neu starten' }))

    expect(screen.getByText('Deine aktuelle Planung geht verloren.')).toBeInTheDocument()
    expect(resetChat).not.toHaveBeenCalled()
  })

  it('keeps the chat when the confirmation is cancelled', () => {
    const resetChat = vi.fn()
    renderKiChat({ resetChat })

    fireEvent.click(screen.getByRole('button', { name: 'Neu starten' }))
    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))

    expect(resetChat).not.toHaveBeenCalled()
  })
})
