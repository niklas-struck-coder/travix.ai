import { describe, expect, it } from 'vitest'
import {
  AUTO_CHECKLIST_ITEMS,
  MANUAL_CHECKLIST_ITEMS,
  isAutoItemChecked,
} from '@/lib/trip/checklistRules'
import { emptyTrip } from '@/lib/ai/mockAdvisor'

describe('checklistRules', () => {
  it('lists 13 checklist items in total', () => {
    expect(AUTO_CHECKLIST_ITEMS.length + MANUAL_CHECKLIST_ITEMS.length).toBe(13)
  })

  it('has unique ids across auto and manual items', () => {
    const ids = [...AUTO_CHECKLIST_ITEMS, ...MANUAL_CHECKLIST_ITEMS].map((item) => item.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('marks no auto item as checked for a completely empty trip', () => {
    for (const item of AUTO_CHECKLIST_ITEMS) {
      expect(isAutoItemChecked(emptyTrip, item.id)).toBe(false)
    }
  })

  it('marks transport as checked once transportMode is set', () => {
    const trip = { ...emptyTrip, transportMode: 'train' as const }
    expect(isAutoItemChecked(trip, 'transport')).toBe(true)
  })

  it('marks activities as checked only once the list is non-empty', () => {
    expect(isAutoItemChecked(emptyTrip, 'activities')).toBe(false)
    const trip = { ...emptyTrip, activities: [{ id: '1', name: 'Stadtführung', price: null }] }
    expect(isAutoItemChecked(trip, 'activities')).toBe(true)
  })

  it('marks dates, accommodation and budget as checked once set', () => {
    const trip = { ...emptyTrip, dates: 'Im Sommer', accommodation: 'Hotel Lissabon', budget: 'bis 1.000 €' }
    expect(isAutoItemChecked(trip, 'dates')).toBe(true)
    expect(isAutoItemChecked(trip, 'accommodation')).toBe(true)
    expect(isAutoItemChecked(trip, 'budget')).toBe(true)
  })

  it('returns false for an unknown id', () => {
    expect(isAutoItemChecked(emptyTrip, 'unknown')).toBe(false)
  })
})
