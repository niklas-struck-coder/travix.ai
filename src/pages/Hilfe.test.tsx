import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hilfe } from './Hilfe'

describe('Hilfe', () => {
  it('renders the page title and description via PageHeader', () => {
    render(<Hilfe />)

    expect(screen.getByRole('heading', { name: 'Hilfe' })).toBeInTheDocument()
    expect(screen.getByText('FAQ und Support')).toBeInTheDocument()
  })

  it('renders every FAQ question and its answer', () => {
    render(<Hilfe />)

    expect(screen.getByText('Wie funktioniert der KI-Chat?')).toBeInTheDocument()
    expect(screen.getByText('Muss ich mich anmelden, um Travix zu nutzen?')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Nein, ein Nutzerkonto gibt es aktuell noch nicht. Listen wie Favoriten, Angebote oder Preisalarme laufen deshalb mit Beispieldaten statt mit echten, dauerhaft gespeicherten eigenen Einträgen.',
      ),
    ).toBeInTheDocument()
  })

  it('does not promise a support contact that is not live yet', () => {
    render(<Hilfe />)

    expect(screen.queryByText(/support@/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/mailto:/i)).not.toBeInTheDocument()
    expect(
      screen.getByText('Ein direkter Support-Kontakt ist aktuell noch nicht eingerichtet. Das kommt, sobald er steht — bis dahin gibt es dafür bewusst keinen erfundenen Kontaktweg.'),
    ).toBeInTheDocument()
  })

  it('is honest that flight/hotel data is real test data while train/bus/ferry is not connected', () => {
    render(<Hilfe />)

    expect(
      screen.getByText(
        'Flug- und Unterkunftssuche sind an echte Duffel-Testdaten angebunden, keine erfundenen Preise. Zug-, Bus- und Fährverbindungen sind dagegen noch nicht an eine echte Datenquelle angeschlossen.',
      ),
    ).toBeInTheDocument()
  })
})
