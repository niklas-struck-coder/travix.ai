import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ChatMessage } from './ChatMessage'

describe('ChatMessage – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in TravixAvatar.reduced-motion.test.tsx.
  it('zeigt neue Chat-Nachrichten sofort in der Endposition, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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

    const { container } = render(
      <ChatMessage
        message={{ id: '1', role: 'assistant', content: 'Hallo!', timestamp: Date.now() }}
      />,
    )

    expect(container.firstElementChild).toHaveStyle({ opacity: '1', transform: 'none' })
  })
})
