import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FlightWizard } from './FlightWizard'

describe('FlightWizard', () => {
  it('explains why the search button stays disabled below 3 characters', () => {
    render(<FlightWizard onSearch={vi.fn()} loading={false} />)

    expect(screen.getByText('3-stelliger Flughafencode, z. B. BER')).toBeInTheDocument()
    expect(screen.getByText('3-stelliger Flughafencode, z. B. LIS')).toBeInTheDocument()
  })
})
