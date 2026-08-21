import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ReiseSuche } from './ReiseSuche'

describe('ReiseSuche', () => {
  it('renders links to KI-Chat, Flugsuche and Hotelsuche', () => {
    render(
      <MemoryRouter>
        <ReiseSuche />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Zum KI-Chat/ })).toHaveAttribute('href', '/ki-chat')
    expect(screen.getByRole('link', { name: /Zur Flugsuche/ })).toHaveAttribute('href', '/flugsuche')
    expect(screen.getByRole('link', { name: /Zur Hotelsuche/ })).toHaveAttribute('href', '/hotelsuche')
  })
})
