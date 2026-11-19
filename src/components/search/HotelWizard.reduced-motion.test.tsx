import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HotelWizard } from './HotelWizard'

describe('HotelWizard – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in TravixAvatar.reduced-motion.test.tsx.
  it('lässt das Bett-Icon während der Suche nicht pulsieren, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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

    const { container } = render(<HotelWizard onSearch={vi.fn()} loading />)

    const icon = container.querySelector('svg.lucide-bed-double')
    expect(icon).toBeInTheDocument()
    expect(icon).not.toHaveClass('animate-pulse')
  })
})
