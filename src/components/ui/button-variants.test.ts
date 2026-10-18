import { describe, expect, it } from 'vitest'
import { buttonVariants } from '@/components/ui/button-variants'

describe('buttonVariants', () => {
  it('defaults to the "default" variant and "default" size when neither is given', () => {
    expect(buttonVariants()).toBe(
      buttonVariants({ variant: 'default', size: 'default' }),
    )
  })

  it('applies the primary background for the default variant', () => {
    expect(buttonVariants({ variant: 'default' })).toContain('bg-primary')
  })

  it('applies a bordered background for the outline variant', () => {
    expect(buttonVariants({ variant: 'outline' })).toContain('bg-background')
  })

  it('applies the secondary background for the secondary variant', () => {
    expect(buttonVariants({ variant: 'secondary' })).toContain('bg-secondary')
  })

  it('applies hover-only styling for the ghost variant', () => {
    expect(buttonVariants({ variant: 'ghost' })).toContain('hover:bg-muted')
  })

  it('applies the destructive styling for the destructive variant', () => {
    expect(buttonVariants({ variant: 'destructive' })).toContain('text-destructive')
  })

  it('applies underline styling for the link variant', () => {
    expect(buttonVariants({ variant: 'link' })).toContain('hover:underline')
  })

  it.each([
    ['xs', 'h-6'],
    ['sm', 'h-7'],
    ['default', 'h-8'],
    ['lg', 'h-9'],
  ] as const)('applies the %s size height class', (size, expectedClass) => {
    expect(buttonVariants({ size })).toContain(expectedClass)
  })

  it.each([
    ['icon-xs', 'size-6'],
    ['icon-sm', 'size-7'],
    ['icon', 'size-8'],
    ['icon-lg', 'size-9'],
  ] as const)('applies the %s icon size class', (size, expectedClass) => {
    expect(buttonVariants({ size })).toContain(expectedClass)
  })

  it('merges a custom className onto the generated classes', () => {
    expect(buttonVariants({ className: 'mt-4' })).toContain('mt-4')
  })
})
