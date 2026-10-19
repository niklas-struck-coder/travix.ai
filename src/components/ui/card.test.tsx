import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

describe('Card', () => {
  it('setzt data-slot="card" und data-size="default", wenn size nicht übergeben wird', () => {
    render(<Card>Inhalt</Card>)
    const card = screen.getByText('Inhalt')
    expect(card.dataset.slot).toBe('card')
    expect(card.dataset.size).toBe('default')
  })

  it('übernimmt eine explizit übergebene size in data-size', () => {
    render(<Card size="sm">Inhalt</Card>)
    expect(screen.getByText('Inhalt').dataset.size).toBe('sm')
  })

  it('merged ein eigenes className mit den generierten Klassen', () => {
    render(<Card className="mt-4">Inhalt</Card>)
    expect(screen.getByText('Inhalt').className).toContain('mt-4')
  })
})

describe('CardHeader', () => {
  it('setzt data-slot="card-header" und merged ein eigenes className', () => {
    render(<CardHeader className="mt-4">Header</CardHeader>)
    const header = screen.getByText('Header')
    expect(header.dataset.slot).toBe('card-header')
    expect(header.className).toContain('mt-4')
  })
})

describe('CardTitle', () => {
  it('setzt data-slot="card-title" und merged ein eigenes className', () => {
    render(<CardTitle className="mt-4">Titel</CardTitle>)
    const title = screen.getByText('Titel')
    expect(title.dataset.slot).toBe('card-title')
    expect(title.className).toContain('mt-4')
  })
})

describe('CardDescription', () => {
  it('setzt data-slot="card-description" und merged ein eigenes className', () => {
    render(<CardDescription className="mt-4">Beschreibung</CardDescription>)
    const description = screen.getByText('Beschreibung')
    expect(description.dataset.slot).toBe('card-description')
    expect(description.className).toContain('mt-4')
  })
})

describe('CardAction', () => {
  it('setzt data-slot="card-action" und merged ein eigenes className', () => {
    render(<CardAction className="mt-4">Aktion</CardAction>)
    const action = screen.getByText('Aktion')
    expect(action.dataset.slot).toBe('card-action')
    expect(action.className).toContain('mt-4')
  })
})

describe('CardContent', () => {
  it('setzt data-slot="card-content" und merged ein eigenes className', () => {
    render(<CardContent className="mt-4">Inhalt</CardContent>)
    const content = screen.getByText('Inhalt')
    expect(content.dataset.slot).toBe('card-content')
    expect(content.className).toContain('mt-4')
  })
})

describe('CardFooter', () => {
  it('setzt data-slot="card-footer" und merged ein eigenes className', () => {
    render(<CardFooter className="mt-4">Footer</CardFooter>)
    const footer = screen.getByText('Footer')
    expect(footer.dataset.slot).toBe('card-footer')
    expect(footer.className).toContain('mt-4')
  })
})
