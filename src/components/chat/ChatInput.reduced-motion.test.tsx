import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ChatInput } from './ChatInput'

class FakeSpeechRecognition {
  lang = ''
  interimResults = false
  continuous = false
  onresult: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  start = vi.fn()
  stop = vi.fn()
}

describe('ChatInput – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in TravixAvatar.reduced-motion.test.tsx.
  afterEach(() => {
    // @ts-expect-error test-only global cleanup
    delete window.SpeechRecognition
  })

  it('lässt das Mikrofon-Icon während der Aufnahme nicht pulsieren, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })
    // @ts-expect-error test-only global stub
    window.SpeechRecognition = FakeSpeechRecognition

    const { container } = render(<ChatInput onSend={vi.fn()} />)

    fireEvent.click(screen.getByLabelText('Spracheingabe starten'))

    const icon = container.querySelector('svg.lucide-mic')
    expect(icon).toBeInTheDocument()
    expect(icon).not.toHaveClass('animate-pulse')
  })
})
