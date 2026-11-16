import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Label } from './label'

describe('Label', () => {
  it('rendert mit dem übergebenen Text und data-slot="label"', () => {
    render(<Label>Reiseziel</Label>)
    const label = screen.getByText('Reiseziel')
    expect(label.dataset.slot).toBe('label')
  })

  it('verknüpft sich über htmlFor mit dem zugehörigen Formularfeld', () => {
    render(
      <>
        <Label htmlFor="ziel">Reiseziel</Label>
        <input id="ziel" />
      </>,
    )
    expect(screen.getByLabelText('Reiseziel')).toBeInstanceOf(HTMLInputElement)
  })

  it('merged ein eigenes className mit den generierten Klassen', () => {
    render(<Label className="mt-4">Mit Abstand</Label>)
    expect(screen.getByText('Mit Abstand').className).toContain('mt-4')
  })
})
