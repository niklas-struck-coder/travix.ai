import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Home } from './Home'

describe('Home – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in ChatMessage.reduced-motion.test.tsx.
  it('zeigt Hero-Sektion und Reiseziel-Karten sofort in der Endposition, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const section = container.querySelector('section')
    expect(section).toHaveStyle({ opacity: '1', transform: 'none' })

    const cards = container.querySelectorAll('.grid > div')
    expect(cards.length).toBe(4)
    cards.forEach((card) => {
      expect(card).toHaveStyle({ opacity: '1', transform: 'none' })
    })
  })
})
