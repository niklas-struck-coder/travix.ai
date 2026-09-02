import { describe, expect, it } from 'vitest'
import { findKnownDestination } from '@/types/stays'

describe('findKnownDestination', () => {
  it('matches a known destination name as its own word', () => {
    expect(findKnownDestination('Ich möchte nach Lissabon')?.name).toBe('Lissabon')
  })

  it('matches case-insensitively regardless of surrounding text', () => {
    expect(findKnownDestination('  PARIS bitte  ')?.name).toBe('Paris')
  })

  it('does not match a destination name that only occurs as a substring of another word', () => {
    expect(findKnownDestination('Ich würde gerne einen romantischen Kurztrip machen')).toBeNull()
    expect(findKnownDestination('Romania')).toBeNull()
    expect(findKnownDestination('ein Vergleich (comparison) wäre gut')).toBeNull()
  })

  it('returns null when no known destination matches', () => {
    expect(findKnownDestination('irgendwo Schönes')).toBeNull()
  })
})
