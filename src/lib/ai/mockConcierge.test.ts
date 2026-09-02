import { describe, expect, it } from 'vitest'
import { getConciergeReply, hasKnownDestination } from '@/lib/ai/mockConcierge'

describe('getConciergeReply', () => {
  it('answers a currency question for a known destination', () => {
    expect(getConciergeReply('Rom', 'Welche Währung brauche ich?')).toContain('Euro (€)')
  })

  it('matches a known destination case-insensitively regardless of surrounding text', () => {
    expect(getConciergeReply('Meine Reise nach ROM', 'Welche Währung brauche ich?')).toContain('Euro (€)')
  })

  it('gives an honest "unknown destination" reply, not the curated destination facts, when a destination name only occurs as a substring of another word', () => {
    expect(getConciergeReply('Romantikurlaub', 'Welche Währung brauche ich?')).toBe(
      'Für Romantikurlaub habe ich noch keine hinterlegten Fakten — das funktioniert bisher nur für eine kleine Auswahl an Zielen. Frag mich gerne trotzdem, ich sag dir ehrlich, wenn ich\'s nicht weiß.',
    )
    expect(getConciergeReply('Romania', 'Welche Währung brauche ich?')).not.toContain('Euro (€)')
    expect(getConciergeReply('ein Vergleich (comparison) wäre gut', 'Welche Währung brauche ich?')).not.toContain('Euro (€)')
  })

  it('gives an honest "unknown destination" reply for a real destination that is simply not curated', () => {
    expect(getConciergeReply('Bali', 'Welche Währung brauche ich?')).toBe(
      'Für Bali habe ich noch keine hinterlegten Fakten — das funktioniert bisher nur für eine kleine Auswahl an Zielen. Frag mich gerne trotzdem, ich sag dir ehrlich, wenn ich\'s nicht weiß.',
    )
  })

  it('returns the "no destination planned" fallback only when no destination is set at all', () => {
    expect(getConciergeReply(null, 'Welche Währung brauche ich?')).toBe(
      'Dafür brauche ich eine geplante Reise mit Reiseziel — plane zuerst im KI-Chat, dann kann ich gezielter helfen.',
    )
  })
})

describe('hasKnownDestination', () => {
  it('is true for a curated destination, case-insensitively and within surrounding text', () => {
    expect(hasKnownDestination('Rom')).toBe(true)
    expect(hasKnownDestination('Meine Reise nach ROM')).toBe(true)
  })

  it('is false for no destination, an uncurated destination, or a word-boundary false match', () => {
    expect(hasKnownDestination(null)).toBe(false)
    expect(hasKnownDestination('Bali')).toBe(false)
    expect(hasKnownDestination('Romantikurlaub')).toBe(false)
  })
})
