import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FlightWizard } from './FlightWizard'

describe('FlightWizard', () => {
  it('explains why the search button stays disabled below 3 characters', () => {
    render(<FlightWizard onSearch={vi.fn()} loading={false} />)

    expect(screen.getByText('3-stelliger Flughafencode, z. B. BER')).toBeInTheDocument()
    expect(screen.getByText('3-stelliger Flughafencode, z. B. LIS')).toBeInTheDocument()
  })

  it('disables the search button once the departure date moves past an already-set return date', () => {
    render(<FlightWizard onSearch={vi.fn()} loading={false} />)

    fireEvent.change(screen.getByLabelText('Von (IATA)'), { target: { value: 'BER' } })
    fireEvent.change(screen.getByLabelText('Nach (IATA)'), { target: { value: 'LIS' } })
    fireEvent.change(screen.getByLabelText('Hinflug'), { target: { value: '2026-09-05' } })
    fireEvent.change(screen.getByLabelText('Rückflug'), { target: { value: '2026-09-10' } })

    expect(screen.getByRole('button', { name: /Flüge suchen/ })).toBeEnabled()

    fireEvent.change(screen.getByLabelText('Hinflug'), { target: { value: '2026-09-20' } })

    expect(screen.getByRole('button', { name: /Flüge suchen/ })).toBeDisabled()
  })

  it('does not allow picking a departure date before today', () => {
    render(<FlightWizard onSearch={vi.fn()} loading={false} />)

    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    expect(screen.getByLabelText('Hinflug')).toHaveAttribute('min', today)
  })

  it('falls back to 1 instead of NaN for a non-numeric passenger count', () => {
    render(<FlightWizard onSearch={vi.fn()} loading={false} />)

    const passengers = screen.getByLabelText('Passagiere')
    fireEvent.change(passengers, { target: { value: 'abc' } })

    expect(passengers).toHaveValue(1)
  })

  it('clamps passenger count to the 1-9 range', () => {
    render(<FlightWizard onSearch={vi.fn()} loading={false} />)

    const passengers = screen.getByLabelText('Passagiere')
    fireEvent.change(passengers, { target: { value: '20' } })
    expect(passengers).toHaveValue(9)

    fireEvent.change(passengers, { target: { value: '0' } })
    expect(passengers).toHaveValue(1)
  })
})
