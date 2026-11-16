import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Input } from './input'

describe('Input', () => {
  it('rendert als input mit data-slot="input"', () => {
    render(<Input placeholder="Suchbegriff" />)
    const input = screen.getByPlaceholderText('Suchbegriff')
    expect(input.tagName).toBe('INPUT')
    expect(input.dataset.slot).toBe('input')
  })

  it('übernimmt den übergebenen type', () => {
    render(<Input type="email" placeholder="E-Mail" />)
    expect(screen.getByPlaceholderText('E-Mail')).toHaveAttribute('type', 'email')
  })

  it('merged ein eigenes className mit den generierten Klassen', () => {
    render(<Input placeholder="Mit Abstand" className="mt-4" />)
    expect(screen.getByPlaceholderText('Mit Abstand').className).toContain('mt-4')
  })

  it('reicht weitere Props wie disabled und value unverändert durch', () => {
    render(<Input placeholder="Deaktiviert" disabled value="Fixwert" onChange={() => {}} />)
    const input = screen.getByPlaceholderText('Deaktiviert')
    expect(input).toBeDisabled()
    expect(input).toHaveValue('Fixwert')
  })
})
