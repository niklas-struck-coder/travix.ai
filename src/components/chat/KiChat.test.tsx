import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { KiChat } from './KiChat'
import { useChat } from '@/hooks/useChat'
import { emptyTrip } from '@/lib/ai/mockAdvisor'
import { stopSpeaking } from '@/lib/ai/speech'
import type { ChatMessage } from '@/types/chat'

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
  messages: [] as ChatMessage[],
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

function renderKiChat(overrides: Partial<typeof baseChatState> = {}, initialEntries = ['/ki-chat']) {
  vi.mocked(useChat).mockReturnValue({ ...baseChatState, ...overrides })
  return render(
    <MemoryRouter initialEntries={initialEntries}>
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

describe('KiChat thinking indicator', () => {
  it('announces the thinking state to assistive tech via role="status"', () => {
    renderKiChat({ isThinking: true })

    expect(screen.getByRole('status')).toHaveTextContent('Travix denkt nach …')
  })

  it('shows no status role while not thinking', () => {
    renderKiChat({ isThinking: false })

    expect(screen.queryByText('Travix denkt nach …')).not.toBeInTheDocument()
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
    renderKiChat({ resetChat, trip: { ...emptyTrip, destination: 'Lissabon' } })

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

describe('KiChat destination query param', () => {
  const greetingMessage = { id: '1', role: 'assistant' as const, content: 'Hallo!', timestamp: 0 }

  it('sends the destination from a Favoriten-Karte as the first chat message when there is no trip yet', () => {
    const sendMessage = vi.fn()
    renderKiChat({ sendMessage, messages: [greetingMessage], trip: emptyTrip }, ['/ki-chat?destination=Kapstadt'])

    expect(sendMessage).toHaveBeenCalledWith('Kapstadt')
  })

  it('ignores the destination param once a trip is already in progress, so it never overwrites it', () => {
    const sendMessage = vi.fn()
    renderKiChat(
      { sendMessage, messages: [greetingMessage], trip: { ...emptyTrip, destination: 'Lissabon' } },
      ['/ki-chat?destination=Kapstadt'],
    )

    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('does nothing without a destination param', () => {
    const sendMessage = vi.fn()
    renderKiChat({ sendMessage, messages: [greetingMessage], trip: emptyTrip })

    expect(sendMessage).not.toHaveBeenCalled()
  })
})

describe('KiChat reset confirmation', () => {
  it('does not reset immediately, but asks for confirmation first when there is a trip to lose', () => {
    const resetChat = vi.fn()
    renderKiChat({ resetChat, trip: { ...emptyTrip, destination: 'Lissabon' } })

    fireEvent.click(screen.getByRole('button', { name: 'Neu starten' }))

    expect(screen.getByText('Deine aktuelle Planung geht verloren.')).toBeInTheDocument()
    expect(resetChat).not.toHaveBeenCalled()
  })

  it('keeps the chat when the confirmation is cancelled', () => {
    const resetChat = vi.fn()
    renderKiChat({ resetChat, trip: { ...emptyTrip, destination: 'Lissabon' } })

    fireEvent.click(screen.getByRole('button', { name: 'Neu starten' }))
    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))

    expect(resetChat).not.toHaveBeenCalled()
  })

  it('resets immediately without a confirmation dialog when there is no trip data yet', () => {
    const resetChat = vi.fn()
    renderKiChat({ resetChat, trip: emptyTrip })

    fireEvent.click(screen.getByRole('button', { name: 'Neu starten' }))

    expect(resetChat).toHaveBeenCalled()
    expect(screen.queryByText('Deine aktuelle Planung geht verloren.')).not.toBeInTheDocument()
  })
})
