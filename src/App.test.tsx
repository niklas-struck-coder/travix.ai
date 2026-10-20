import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('wires BrowserRouter and AppRoutes together, rendering the Home page at the root URL', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /wohin soll deine nächste reise gehen/i })).toBeInTheDocument()
  })
})
