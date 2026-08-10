import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Reiseentwuerfe } from './Reiseentwuerfe'

describe('Reiseentwuerfe', () => {
  it('renders a draft card per demo trip with progress and status', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()
    expect(screen.getByText('In Bearbeitung')).toBeInTheDocument()
    expect(screen.getByText('Pausiert')).toBeInTheDocument()
    // transportMode, budget, dates filled (3 of 5) → 60%
    expect(screen.getByText('60%')).toBeInTheDocument()
    // only dates filled → 20%
    expect(screen.getByText('20%')).toBeInTheDocument()
  })
})
