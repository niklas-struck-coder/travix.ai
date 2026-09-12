import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MobileNav } from './MobileNav'

describe('MobileNav', () => {
  it('zeigt das Menü nicht, bevor der Menü-Button angeklickt wurde', () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: /KI-Chat/ })).not.toBeInTheDocument()
  })

  it('öffnet beim Klick auf den Menü-Button alle Navigationsgruppen mit ihren Links', () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }))

    expect(screen.getByText('Planen')).toBeInTheDocument()
    expect(screen.getByText('Meine Reise')).toBeInTheDocument()
    expect(screen.getByText('Konto')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /KI-Chat/ })).toHaveAttribute('href', '/ki-chat')
  })

  it('schließt das Menü beim Klick auf einen Navigationslink', () => {
    render(
      <MemoryRouter>
        <MobileNav />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }))
    fireEvent.click(screen.getByRole('link', { name: /KI-Chat/ }))

    expect(screen.queryByRole('link', { name: /KI-Chat/ })).not.toBeInTheDocument()
  })
})
