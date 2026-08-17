import { describe, expect, it } from 'vitest'
import { calculateCartTotal, groupCartItems, type CartItem } from '@/lib/trip/cartTotals'

const items: CartItem[] = [
  { id: '1', type: 'flight', label: 'Berlin → Lissabon', price: 249 },
  { id: '2', type: 'hotel', label: 'Hotel Alfama Suites', price: 480 },
  { id: '3', type: 'activity', label: 'Tagesausflug nach Sintra', price: 58 },
  { id: '4', type: 'transport', label: 'Zugticket Kyoto → Osaka', price: 32 },
  { id: '5', type: 'insurance', label: 'Reise-Krankenversicherung', price: 24 },
]

describe('calculateCartTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateCartTotal([])).toBe(0)
  })

  it('sums the price of all items regardless of type', () => {
    expect(calculateCartTotal(items)).toBe(843)
  })
})

describe('groupCartItems', () => {
  it('returns no groups for an empty cart', () => {
    expect(groupCartItems([])).toEqual([])
  })

  it('groups items by type with a correct subtotal per group', () => {
    const groups = groupCartItems(items)
    expect(groups).toHaveLength(5)
    expect(groups.find((g) => g.type === 'hotel')?.subtotal).toBe(480)
  })

  it('orders groups flight, hotel, transport, activity, insurance', () => {
    const groups = groupCartItems(items)
    expect(groups.map((g) => g.type)).toEqual(['flight', 'hotel', 'transport', 'activity', 'insurance'])
  })

  it('omits types with no items instead of returning an empty group', () => {
    const groups = groupCartItems(items.filter((item) => item.type !== 'insurance'))
    expect(groups.some((g) => g.type === 'insurance')).toBe(false)
  })

  it('puts multiple items of the same type into one group and sums their subtotal', () => {
    const twoFlights: CartItem[] = [
      { id: '1', type: 'flight', label: 'Hinflug', price: 120 },
      { id: '2', type: 'flight', label: 'Rückflug', price: 129 },
    ]
    const groups = groupCartItems(twoFlights)
    expect(groups).toHaveLength(1)
    expect(groups[0].items).toHaveLength(2)
    expect(groups[0].subtotal).toBe(249)
  })
})
