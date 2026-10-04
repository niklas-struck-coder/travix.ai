import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { NichtGefunden } from './NichtGefunden'

describe('NichtGefunden', () => {
  it('renders an honest not-found message and a link back to the home page', () => {
    render(
      <MemoryRouter>
        <NichtGefunden />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Seite nicht gefunden' })).toBeInTheDocument()
    expect(screen.getByText(/Diese Seite gibt es nicht/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Zur Startseite/ })).toHaveAttribute('href', '/')
  })
})
