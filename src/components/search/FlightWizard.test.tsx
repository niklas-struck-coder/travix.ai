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
})
