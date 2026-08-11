import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Kartenansicht } from './Kartenansicht'

describe('Kartenansicht', () => {
  it('renders the accessible destination list alongside the map', () => {
    render(
      <MemoryRouter>
        <Kartenansicht />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Kartenansicht' })).toBeInTheDocument()
    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()
  })
})
