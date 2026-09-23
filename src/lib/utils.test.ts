import { describe, expect, it } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges plain class name strings', () => {
    expect(cn('flex', 'items-center')).toBe('flex items-center')
  })

  it('resolves conflicting Tailwind classes, keeping the last one', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  it('drops falsy values (false, undefined, null)', () => {
    const isHidden = false
    expect(cn('text-red-500', isHidden && 'hidden', undefined, null, 'font-bold')).toBe(
      'text-red-500 font-bold',
    )
  })

  it('supports arrays and objects with boolean values', () => {
    expect(cn(['flex', 'items-center'], { 'gap-2': true, 'gap-4': false })).toBe(
      'flex items-center gap-2',
    )
  })

  it('returns an empty string when given no usable input', () => {
    expect(cn()).toBe('')
  })
})
