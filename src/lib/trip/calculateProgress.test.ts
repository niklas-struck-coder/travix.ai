import { describe, expect, it } from 'vitest'
import { calculateProgress } from '@/lib/trip/calculateProgress'
import { emptyTrip } from '@/lib/ai/mockAdvisor'

describe('calculateProgress', () => {
  it('returns 0 for a completely empty trip', () => {
    expect(calculateProgress(emptyTrip)).toBe(0)
  })

  it('counts each filled planning component', () => {
    const trip = { ...emptyTrip, transportMode: 'flight' as const, dates: 'Im Sommer' }
    expect(calculateProgress(trip)).toBe(40)
  })

  it('counts a non-empty activities list as one completed component', () => {
    const trip = { ...emptyTrip, activities: [{ id: '1', name: 'Stadtführung', price: null }] }
    expect(calculateProgress(trip)).toBe(20)
  })

  it('ignores destination — it is not one of the five progress components', () => {
    const trip = { ...emptyTrip, destination: 'Lissabon' }
    expect(calculateProgress(trip)).toBe(0)
  })

  it('returns 100 when transport, dates, budget, accommodation and activities are all set', () => {
    const trip = {
      ...emptyTrip,
      transportMode: 'train' as const,
      dates: 'Im Sommer',
      budget: 'bis 1.000 €',
      accommodation: 'Hotel Lissabon',
      activities: [{ id: '1', name: 'Stadtführung', price: null }],
    }
    expect(calculateProgress(trip)).toBe(100)
  })
})
