import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FlightResults } from './FlightResults'
import type { FlightOffer } from '@/types/duffel'

vi.mock('@/components/chat/TravixAvatar', () => ({
  TravixAvatar: () => null,
}))

const offer: FlightOffer = {
  id: '1',
  totalAmount: '249.00',
  totalCurrency: 'EUR',
  slices: [
    {
      originIata: 'BER',
      originName: 'Berlin',
      destinationIata: 'LIS',
      destinationName: 'Lissabon',
      duration: 'PT3H15M',
      segments: [
        {
          carrierName: 'TAP Air Portugal',
          carrierIata: 'TP',
          departingAt: '2026-09-10T08:00:00Z',
          arrivingAt: '2026-09-10T11:15:00Z',
          originIata: 'BER',
          destinationIata: 'LIS',
        },
      ],
    },
  ],
}

describe('FlightResults – reduzierte Bewegung', () => {
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

    const { container } = render(<FlightResults offers={[offer]} errors={[]} loading={false} onSelect={() => {}} />)

    expect(container.firstElementChild).toHaveStyle({ opacity: '1', transform: 'none' })
  })
})
