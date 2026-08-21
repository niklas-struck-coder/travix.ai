import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Profil } from './Profil'

describe('Profil', () => {
  it('renders every travel style and dietary option unselected by default', () => {
    render(<Profil />)

    const strand = screen.getByRole('button', { name: 'Strand & Erholung' })
    expect(strand).toHaveAttribute('aria-pressed', 'false')

    const vegan = screen.getByRole('button', { name: 'Vegan' })
    expect(vegan).toHaveAttribute('aria-pressed', 'false')

    expect(screen.getByLabelText('Heimatflughafen')).toHaveValue('')
  })

  it('toggles a travel style on and off when clicked', () => {
    render(<Profil />)

    const abenteuer = screen.getByRole('button', { name: 'Abenteuer & Aktiv' })
    fireEvent.click(abenteuer)
    expect(abenteuer).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(abenteuer)
    expect(abenteuer).toHaveAttribute('aria-pressed', 'false')
  })

  it('allows selecting more than one dietary restriction independently', () => {
    render(<Profil />)

    const vegetarisch = screen.getByRole('button', { name: 'Vegetarisch' })
    const glutenfrei = screen.getByRole('button', { name: 'Glutenfrei' })

    fireEvent.click(vegetarisch)
    fireEvent.click(glutenfrei)

    expect(vegetarisch).toHaveAttribute('aria-pressed', 'true')
    expect(glutenfrei).toHaveAttribute('aria-pressed', 'true')
  })

  it('uppercases and truncates the home airport input to 3 characters', () => {
    render(<Profil />)

    const input = screen.getByLabelText('Heimatflughafen')
    fireEvent.change(input, { target: { value: 'berx' } })

    expect(input).toHaveValue('BER')
  })
})
