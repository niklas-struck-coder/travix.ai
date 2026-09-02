import { describe, expect, it } from 'vitest'
import { getConciergeReply } from '@/lib/ai/mockConcierge'

describe('getConciergeReply', () => {
  it('answers a currency question for a known destination', () => {
    expect(getConciergeReply('Rom', 'Welche Währung brauche ich?')).toContain('Euro (€)')
  })

  it('matches a known destination case-insensitively regardless of surrounding text', () => {
    expect(getConciergeReply('Meine Reise nach ROM', 'Welche Währung brauche ich?')).toContain('Euro (€)')
  })

  it('does not match a destination name that only occurs as a substring of another word', () => {
    const noDestinationFallback = 'Dafür brauche ich eine geplante Reise mit Reiseziel — plane zuerst im KI-Chat, dann kann ich gezielter helfen.'
    expect(getConciergeReply('Romantikurlaub', 'Welche Währung brauche ich?')).toBe(noDestinationFallback)
    expect(getConciergeReply('Romania', 'Welche Währung brauche ich?')).toBe(noDestinationFallback)
    expect(getConciergeReply('ein Vergleich (comparison) wäre gut', 'Welche Währung brauche ich?')).toBe(noDestinationFallback)
  })

  it('returns the honest fallback when no destination is set', () => {
    expect(getConciergeReply(null, 'Welche Währung brauche ich?')).toBe(
      'Dafür brauche ich eine geplante Reise mit Reiseziel — plane zuerst im KI-Chat, dann kann ich gezielter helfen.',
    )
  })
})
