import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChatInput } from './ChatInput'

let lastInstance: FakeSpeechRecognition | null = null
const setLastInstance = (instance: FakeSpeechRecognition) => {
  lastInstance = instance
}

class FakeSpeechRecognition {
  lang = ''
  interimResults = false
  continuous = false
  onresult: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  start = vi.fn()
  stop = vi.fn()

  constructor() {
    setLastInstance(this)
  }
}

describe('ChatInput microphone errors', () => {
  afterEach(() => {
    // @ts-expect-error test-only global cleanup
    delete window.SpeechRecognition
  })

  it('shows a hint and stops "listening" when speech recognition errors out', () => {
    // @ts-expect-error test-only global stub
    window.SpeechRecognition = FakeSpeechRecognition

    render(<ChatInput onSend={vi.fn()} />)

    fireEvent.click(screen.getByLabelText('Spracheingabe starten'))
    expect(screen.getByLabelText('Aufnahme läuft')).toBeInTheDocument()

    act(() => lastInstance?.onerror?.())

    expect(screen.getByLabelText('Spracheingabe starten')).toBeInTheDocument()
    expect(
      screen.getByText('Spracheingabe hat nicht geklappt — bitte tippe deine Nachricht stattdessen.'),
    ).toBeInTheDocument()
  })

  it('clears a previous error when a new recording starts', () => {
    // @ts-expect-error test-only global stub
    window.SpeechRecognition = FakeSpeechRecognition

    render(<ChatInput onSend={vi.fn()} />)

    fireEvent.click(screen.getByLabelText('Spracheingabe starten'))
    act(() => lastInstance?.onerror?.())
    expect(screen.getByText(/Spracheingabe hat nicht geklappt/)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Spracheingabe starten'))
    expect(screen.queryByText(/Spracheingabe hat nicht geklappt/)).not.toBeInTheDocument()
  })
})
