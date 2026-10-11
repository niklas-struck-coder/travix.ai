import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Home } from './Home'

describe('Home', () => {
  it('renders the hero headline', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: /wohin soll deine nächste reise gehen/i })).toBeInTheDocument()
  })

  it('links each destination card to the KI-Chat, pre-filled with that destination', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )
    const link = screen.getByRole('link', { name: /reise nach lissabon mit ki planen/i })
    expect(link).toHaveAttribute('href', '/ki-chat?destination=Lissabon')
  })
})
