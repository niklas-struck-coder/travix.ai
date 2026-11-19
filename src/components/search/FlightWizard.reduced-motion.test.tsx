import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FlightWizard } from './FlightWizard'

describe('FlightWizard – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in TravixAvatar.reduced-motion.test.tsx.
  it('lässt das Flugzeug-Icon während der Suche nicht pulsieren, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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

    const { container } = render(<FlightWizard onSearch={vi.fn()} loading />)

    const icon = container.querySelector('svg.lucide-plane')
    expect(icon).toBeInTheDocument()
    expect(icon).not.toHaveClass('animate-pulse')
  })
})
