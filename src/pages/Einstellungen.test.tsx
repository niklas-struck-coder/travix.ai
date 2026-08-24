import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Einstellungen } from './Einstellungen'

describe('Einstellungen', () => {
  it('renders all notification toggles active by default', () => {
    render(<Einstellungen />)

    const preisalarme = screen.getByRole('button', { name: 'Preisalarme' })
    const angebote = screen.getByRole('button', { name: 'Neue Angebote' })
    const updates = screen.getByRole('button', { name: 'Reise-Updates' })

    expect(preisalarme).toHaveAttribute('aria-pressed', 'true')
    expect(angebote).toHaveAttribute('aria-pressed', 'true')
    expect(updates).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles a notification preference off and on when clicked', () => {
    render(<Einstellungen />)

    const preisalarme = screen.getByRole('button', { name: 'Preisalarme' })
    fireEvent.click(preisalarme)
    expect(preisalarme).toHaveAttribute('aria-pressed', 'false')

    fireEvent.click(preisalarme)
    expect(preisalarme).toHaveAttribute('aria-pressed', 'true')
  })

  it('toggles other notification preferences independently', () => {
    render(<Einstellungen />)

    const angebote = screen.getByRole('button', { name: 'Neue Angebote' })
    const updates = screen.getByRole('button', { name: 'Reise-Updates' })

    fireEvent.click(angebote)
    expect(angebote).toHaveAttribute('aria-pressed', 'false')
    expect(updates).toHaveAttribute('aria-pressed', 'true')
  })

  it('defaults measurement units to metrisch', () => {
    render(<Einstellungen />)

    expect(screen.getByText('Metrisch (km, °C)')).toBeInTheDocument()
  })

  it('does not promise notification delivery that is not yet implemented', () => {
    render(<Einstellungen />)

    expect(screen.queryByText('Worüber Travix dich per E-Mail informieren soll.')).not.toBeInTheDocument()
    expect(
      screen.getByText('Worüber Travix dich informieren soll, sobald Benachrichtigungen aktiv sind.'),
    ).toBeInTheDocument()
  })

  it('does not promise a distance/temperature display that does not exist yet', () => {
    render(<Einstellungen />)

    expect(
      screen.queryByText('Für Distanzen und Temperaturen in Reiseplänen und Karten.'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('Für künftige Distanz- und Temperaturanzeigen.')).toBeInTheDocument()
  })
})
