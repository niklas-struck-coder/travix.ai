import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './badge'

describe('Badge', () => {
  it('rendert als span mit dem übergebenen Text', () => {
    render(<Badge>Neu</Badge>)
    const badge = screen.getByText('Neu')
    expect(badge.tagName).toBe('SPAN')
  })

  it('setzt data-slot="badge" sowie data-variant entsprechend der Default-Variante', () => {
    render(<Badge>Standard</Badge>)
    const badge = screen.getByText('Standard')
    expect(badge.dataset.slot).toBe('badge')
    expect(badge.dataset.variant).toBe('default')
  })

  it('übernimmt eine explizit übergebene Variante in data-variant und die zugehörigen Klassen', () => {
    render(<Badge variant="destructive">Fehler</Badge>)
    const badge = screen.getByText('Fehler')
    expect(badge.dataset.variant).toBe('destructive')
    expect(badge.className).toContain('text-destructive')
  })

  it('merged ein eigenes className mit den generierten Varianten-Klassen', () => {
    render(<Badge className="mt-4">Mit Abstand</Badge>)
    expect(screen.getByText('Mit Abstand').className).toContain('mt-4')
  })

  it('rendert mit asChild das übergebene Element statt eines eigenen span', () => {
    render(
      <Badge asChild>
        <a href="/angebote">Zum Angebot</a>
      </Badge>,
    )
    const badge = screen.getByText('Zum Angebot')
    expect(badge.tagName).toBe('A')
    expect(badge.dataset.slot).toBe('badge')
  })
})
