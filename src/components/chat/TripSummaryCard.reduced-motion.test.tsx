import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { TripSummaryCard } from './TripSummaryCard'
import { emptyTrip } from '@/lib/ai/mockAdvisor'

describe('TripSummaryCard – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in TravixAvatar.reduced-motion.test.tsx.
  it('zeigt die Karte sofort in der Endposition, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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
        <TripSummaryCard trip={{ ...emptyTrip, destination: 'Lissabon' }} />
      </MemoryRouter>,
    )

    expect(container.firstElementChild).toHaveStyle({ opacity: '1', transform: 'none' })
  })
})
