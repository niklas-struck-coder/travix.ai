import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HotelResults } from './HotelResults'
import type { StayOffer } from '@/types/stays'

vi.mock('@/components/chat/TravixAvatar', () => ({
  TravixAvatar: () => null,
}))

const offer: StayOffer = {
  id: '1',
  accommodationName: 'Hotel Lissabon Mar',
  rating: 4,
  address: 'Rua da Praia 12, Lissabon',
  totalAmount: '189.00',
  totalCurrency: 'EUR',
  photoUrl: null,
}

describe('HotelResults – reduzierte Bewegung', () => {
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

    const { container } = render(<HotelResults offers={[offer]} errors={[]} loading={false} onSelect={() => {}} />)

    expect(container.firstElementChild).toHaveStyle({ opacity: '1', transform: 'none' })
  })
})
