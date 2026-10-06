import { afterEach, describe, expect, it } from 'vitest'
import { cn, focusPageHeading } from '@/lib/utils'

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

describe('focusPageHeading', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('focuses the page h1, adding a temporary tabindex it removes on blur', () => {
    document.body.innerHTML = '<h1>Testseite</h1>'
    const heading = document.querySelector('h1') as HTMLElement

    focusPageHeading()

    expect(document.activeElement).toBe(heading)
    expect(heading.getAttribute('tabindex')).toBe('-1')

    heading.blur()
    expect(heading.hasAttribute('tabindex')).toBe(false)
  })

  it('leaves an existing tabindex on the heading untouched after blur', () => {
    document.body.innerHTML = '<h1 tabindex="0">Testseite</h1>'
    const heading = document.querySelector('h1') as HTMLElement

    focusPageHeading()
    heading.blur()

    expect(heading.getAttribute('tabindex')).toBe('0')
  })

  it('does nothing when the page has no h1', () => {
    document.body.innerHTML = '<p>Keine Überschrift</p>'
    expect(() => focusPageHeading()).not.toThrow()
  })
})
