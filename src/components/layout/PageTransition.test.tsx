import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PageTransition } from './PageTransition'

describe('PageTransition', () => {
  // Must run before any other test in this file: framer-motion checks
  // prefers-reduced-motion once per process and caches the result.
  it('skips the animation and renders statically when the user prefers reduced motion', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    const { container } = render(
      <PageTransition>
        <p>Seiteninhalt</p>
      </PageTransition>,
    )

    expect(screen.getByText('Seiteninhalt')).toBeInTheDocument()
    expect(container.firstElementChild).toHaveStyle({ opacity: '1', transform: 'none' })
  })

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
