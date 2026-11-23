import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuickReplies } from './QuickReplies'

describe('QuickReplies – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in TravixAvatar.reduced-motion.test.tsx.
  it('zeigt die Schnellantworten sofort in der Endposition, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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

    render(<QuickReplies options={['Ja', 'Nein']} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Ja' })).toHaveStyle({ opacity: '1', transform: 'none' })
    expect(screen.getByRole('button', { name: 'Nein' })).toHaveStyle({ opacity: '1', transform: 'none' })
  })
})
