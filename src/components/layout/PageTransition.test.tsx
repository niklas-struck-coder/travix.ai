import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageTransition } from './PageTransition'

describe('PageTransition', () => {
  it('renders its children', () => {
    render(
      <PageTransition>
        <p>Seiteninhalt</p>
      </PageTransition>,
    )

    expect(screen.getByText('Seiteninhalt')).toBeInTheDocument()
  })

  it('renders multiple children unchanged', () => {
    render(
      <PageTransition>
        <h1>Titel</h1>
        <p>Beschreibung</p>
      </PageTransition>,
    )

    expect(screen.getByRole('heading', { name: 'Titel' })).toBeInTheDocument()
    expect(screen.getByText('Beschreibung')).toBeInTheDocument()
  })
})
