import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Sidebar } from './Sidebar'

describe('Sidebar – Einklappen-Button hat einen erreichbaren Namen', () => {
  it('hat einen aria-label, wenn ausgeklappt (Text ist zusätzlich sichtbar)', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'Seitenleiste einklappen' })).toBeInTheDocument()
  })

  it('behält einen erreichbaren Namen, wenn eingeklappt und der sichtbare Text verschwindet', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Seitenleiste einklappen' }))

    expect(screen.getByRole('button', { name: 'Seitenleiste ausklappen' })).toBeInTheDocument()
  })
})
