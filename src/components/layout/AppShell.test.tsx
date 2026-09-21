import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppShell } from './AppShell'

describe('AppShell', () => {
  it('renders its children alongside the sidebar and mobile navigation', () => {
    render(
      <MemoryRouter>
        <AppShell>
          <p>Seiteninhalt</p>
        </AppShell>
      </MemoryRouter>,
    )

    expect(screen.getByText('Seiteninhalt')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Seitenleiste einklappen' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toBeInTheDocument()
  })
})
