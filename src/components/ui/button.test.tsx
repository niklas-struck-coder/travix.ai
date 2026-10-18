import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('rendert als button mit dem übergebenen Text', () => {
    render(<Button>Suchen</Button>)
    const button = screen.getByText('Suchen')
    expect(button.tagName).toBe('BUTTON')
  })

  it('setzt data-slot="button" sowie data-variant/data-size entsprechend der Default-Werte', () => {
    render(<Button>Standard</Button>)
    const button = screen.getByText('Standard')
    expect(button.dataset.slot).toBe('button')
    expect(button.dataset.variant).toBe('default')
    expect(button.dataset.size).toBe('default')
  })

  it('übernimmt eine explizit übergebene Variante in data-variant und die zugehörigen Klassen', () => {
    render(<Button variant="destructive">Löschen</Button>)
    const button = screen.getByText('Löschen')
    expect(button.dataset.variant).toBe('destructive')
    expect(button.className).toContain('text-destructive')
  })

  it('übernimmt eine explizit übergebene Größe in data-size und die zugehörigen Klassen', () => {
    render(<Button size="lg">Groß</Button>)
    const button = screen.getByText('Groß')
    expect(button.dataset.size).toBe('lg')
    expect(button.className).toContain('h-9')
  })

  it('merged ein eigenes className mit den generierten Varianten-Klassen', () => {
    render(<Button className="mt-4">Mit Abstand</Button>)
    expect(screen.getByText('Mit Abstand').className).toContain('mt-4')
  })

  it('rendert mit asChild das übergebene Element statt eines eigenen button', () => {
    render(
      <Button asChild>
        <a href="/angebote">Zum Angebot</a>
      </Button>,
    )
    const button = screen.getByText('Zum Angebot')
    expect(button.tagName).toBe('A')
    expect(button.dataset.slot).toBe('button')
  })
})
