import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from './ErrorBoundary'

function Boom(): never {
  throw new Error('Kaputte Komponente')
}

describe('ErrorBoundary', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('renders its children normally when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>Seiteninhalt</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Seiteninhalt')).toBeInTheDocument()
  })

  it('shows an honest fallback instead of a blank page when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Diese Seite konnte nicht geladen werden')).toBeInTheDocument()
    expect(screen.queryByText('Seiteninhalt')).not.toBeInTheDocument()
  })

  it('offers a reload action that reloads the page', () => {
    const reloadSpy = vi.fn()
    vi.stubGlobal('location', { ...window.location, reload: reloadSpy })

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Seite neu laden' }))

    expect(reloadSpy).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })

  it('offers a link back to the home page', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('link', { name: 'Zur Startseite' })).toHaveAttribute('href', '/')
  })
})
