import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TrainResults } from './TrainResults'
import type { TrainOffer } from '@/types/trains'

vi.mock('@/components/chat/TravixAvatar', () => ({
  TravixAvatar: () => null,
}))

const offer: TrainOffer = {
  id: '1',
  operator: 'Deutsche Bahn',
  originName: 'Berlin Hbf',
  destinationName: 'München Hbf',
  departureTime: '2026-09-10T08:00:00Z',
  arrivalTime: '2026-09-10T12:00:00Z',
  duration: 'PT4H0M',
  transfers: 0,
  classes: ['2. Klasse'],
  totalAmount: '129.00',
  totalCurrency: 'EUR',
}

describe('TrainResults – reduzierte Bewegung', () => {
  // Eigene Datei nötig: framer-motion prüft prefers-reduced-motion nur
  // einmal pro Prozess und cacht das Ergebnis (vitest isoliert Module pro
  // Testdatei), siehe gleiches Vorgehen in TravixAvatar.reduced-motion.test.tsx.
  it('zeigt die Ergebnisliste sofort in der Endposition, wenn die Nutzerin reduzierte Bewegung bevorzugt', () => {
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

    const { container } = render(<TrainResults offers={[offer]} loading={false} onSelect={() => {}} />)

    expect(container.firstElementChild).toHaveStyle({ opacity: '1', transform: 'none' })
  })
})
