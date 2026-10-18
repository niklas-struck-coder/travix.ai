import { describe, expect, it } from 'vitest'
import { badgeVariants } from '@/components/ui/badge-variants'

describe('badgeVariants', () => {
  it('defaults to the "default" variant when no variant is given', () => {
    expect(badgeVariants()).toBe(badgeVariants({ variant: 'default' }))
  })

  it('applies the primary background for the default variant', () => {
    expect(badgeVariants({ variant: 'default' })).toContain('bg-primary')
  })

  it('applies the secondary background for the secondary variant', () => {
    expect(badgeVariants({ variant: 'secondary' })).toContain('bg-secondary')
  })

  it('applies the destructive styling for the destructive variant', () => {
    expect(badgeVariants({ variant: 'destructive' })).toContain('text-destructive')
  })

  it('applies a transparent border for the outline variant', () => {
    expect(badgeVariants({ variant: 'outline' })).toContain('border-border')
  })

  it('applies hover-only styling for the ghost variant', () => {
    expect(badgeVariants({ variant: 'ghost' })).toContain('hover:bg-muted')
  })

  it('applies underline styling for the link variant', () => {
    expect(badgeVariants({ variant: 'link' })).toContain('hover:underline')
  })

  it('merges a custom className onto the generated classes', () => {
    expect(badgeVariants({ className: 'mt-4' })).toContain('mt-4')
  })
})
