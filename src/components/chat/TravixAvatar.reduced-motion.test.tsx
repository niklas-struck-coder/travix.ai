import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TravixAvatar } from './TravixAvatar'

describe('TravixAvatar – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in PageTransition.test.tsx.
  it('stoppt den Denk-Puls-Ring, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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

    const { container } = render(<TravixAvatar state="thinking" />)

    expect(container.querySelector('.border-teal\\/40')).not.toBeInTheDocument()
    expect(container.querySelector('svg.lucide-loader-circle')).toBeInTheDocument()
  })
})
