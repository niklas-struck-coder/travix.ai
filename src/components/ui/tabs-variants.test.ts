import { describe, expect, it } from 'vitest'
import { tabsListVariants } from '@/components/ui/tabs-variants'

describe('tabsListVariants', () => {
  it('defaults to the "default" variant when no variant is given', () => {
    expect(tabsListVariants()).toBe(tabsListVariants({ variant: 'default' }))
  })

  it('applies a muted background for the default variant', () => {
    expect(tabsListVariants({ variant: 'default' })).toContain('bg-muted')
  })

  it('applies a transparent background with gaps for the line variant', () => {
    const classes = tabsListVariants({ variant: 'line' })
    expect(classes).toContain('bg-transparent')
    expect(classes).toContain('gap-1')
  })

  it('merges a custom className onto the generated classes', () => {
    expect(tabsListVariants({ className: 'mt-4' })).toContain('mt-4')
  })
})
