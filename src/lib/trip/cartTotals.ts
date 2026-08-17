export type CartItemType = 'flight' | 'hotel' | 'transport' | 'activity' | 'insurance'

export interface CartItem {
  id: string
  type: CartItemType
  label: string
  price: number
}

export interface CartGroup {
  type: CartItemType
  items: CartItem[]
  subtotal: number
}

/** Display order for grouped cart sections — matches FR-1002's type list. */
const TYPE_ORDER: CartItemType[] = ['flight', 'hotel', 'transport', 'activity', 'insurance']

/** Groups cart items by type in a fixed display order, omitting empty groups. */
export function groupCartItems(items: CartItem[]): CartGroup[] {
  return TYPE_ORDER.map((type) => {
    const groupItems = items.filter((item) => item.type === type)
    return { type, items: groupItems, subtotal: calculateCartTotal(groupItems) }
  }).filter((group) => group.items.length > 0)
}

/** Sum of all item prices — recalculated from current items, so always up to date. */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0)
}
