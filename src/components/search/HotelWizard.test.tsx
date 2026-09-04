import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HotelWizard } from './HotelWizard'

describe('HotelWizard', () => {
  it('falls back to 1 instead of NaN for a non-numeric guest count', () => {
    render(<HotelWizard onSearch={vi.fn()} loading={false} />)

    const guests = screen.getByLabelText('Gäste')
    fireEvent.change(guests, { target: { value: 'abc' } })

    expect(guests).toHaveValue(1)
  })

  it('clamps room count to the 1-9 range', () => {
    render(<HotelWizard onSearch={vi.fn()} loading={false} />)

    const rooms = screen.getByLabelText('Zimmer')
    fireEvent.change(rooms, { target: { value: '20' } })
    expect(rooms).toHaveValue(9)

    fireEvent.change(rooms, { target: { value: '0' } })
    expect(rooms).toHaveValue(1)
  })

  it('does not allow picking a check-in date before today', () => {
    render(<HotelWizard onSearch={vi.fn()} loading={false} />)

    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(screen.getByLabelText('Check-in')).toHaveAttribute('min', today)
  })
})
