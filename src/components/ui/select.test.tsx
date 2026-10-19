import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select'

describe('Select', () => {
  it('setzt data-slot="select-trigger" sowie data-size="default", wenn keine size übergeben wird', () => {
    render(
      <Select value="economy" onValueChange={() => {}}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
      </Select>,
    )
    const trigger = screen.getByRole('combobox')
    expect(trigger.dataset.slot).toBe('select-trigger')
    expect(trigger.dataset.size).toBe('default')
  })

  it('übernimmt eine explizit übergebene size in data-size', () => {
    render(
      <Select value="economy" onValueChange={() => {}}>
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
      </Select>,
    )
    expect(screen.getByRole('combobox').dataset.size).toBe('sm')
  })

  it('merged ein eigenes className auf dem SelectTrigger mit den generierten Klassen', () => {
    render(
      <Select value="economy" onValueChange={() => {}}>
        <SelectTrigger className="w-full max-w-64">
          <SelectValue />
        </SelectTrigger>
      </Select>,
    )
    expect(screen.getByRole('combobox').className).toContain('w-full')
  })

  it('zeigt den Platzhalter, solange kein Wert ausgewählt ist', () => {
    render(
      <Select onValueChange={() => {}}>
        <SelectTrigger>
          <SelectValue placeholder="Noch nicht ausgewählt" />
        </SelectTrigger>
      </Select>,
    )
    expect(screen.getByText('Noch nicht ausgewählt')).toBeInTheDocument()
  })

  it('setzt data-slot an SelectContent, SelectItem, SelectLabel und SelectSeparator, wenn das Menü offen ist', () => {
    render(
      <Select value="economy" onValueChange={() => {}} open>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Reiseklasse</SelectLabel>
            <SelectItem value="economy">Economy</SelectItem>
            <SelectSeparator />
            <SelectItem value="business">Business</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    )
    expect(document.querySelector('[data-slot="select-content"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="select-label"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="select-separator"]')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.getAllByRole('option')[0].dataset.slot).toBe('select-item')
  })
})
