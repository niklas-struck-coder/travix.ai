import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { NoResultsMessage } from './NoResultsMessage'

describe('NoResultsMessage', () => {
  it('renders the default honest no-results copy when no props are given', () => {
    render(<NoResultsMessage />)

    expect(screen.getByText('Keine Ergebnisse gefunden')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Für diese Suche gibt es aktuell keine echten Angebote. Versuche andere Daten oder ein anderes Reiseziel — wir erfinden nichts dazu.',
      ),
    ).toBeInTheDocument()
  })

  it('renders a custom title and message when provided', () => {
    render(<NoResultsMessage title="Keine Flüge gefunden" message="Versuch es mit anderen Flughäfen." />)

    expect(screen.getByText('Keine Flüge gefunden')).toBeInTheDocument()
    expect(screen.getByText('Versuch es mit anderen Flughäfen.')).toBeInTheDocument()
    expect(screen.queryByText('Keine Ergebnisse gefunden')).not.toBeInTheDocument()
  })
})
