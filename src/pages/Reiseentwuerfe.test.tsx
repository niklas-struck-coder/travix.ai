import { fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Reiseentwuerfe } from './Reiseentwuerfe'

describe('Reiseentwuerfe', () => {
  it('renders a draft card per demo trip with progress and status', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    expect(screen.getByText('Lissabon')).toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()
    expect(screen.getByText('In Bearbeitung')).toBeInTheDocument()
    expect(screen.getByText('Pausiert')).toBeInTheDocument()
    // transportMode, budget, dates filled (3 of 5) → 60%
    expect(screen.getByText('60%')).toBeInTheDocument()
    // only dates filled → 20%
    expect(screen.getByText('20%')).toBeInTheDocument()
  })

  it('shows a hint that "Planung fortsetzen" opens the same chat for every draft while there are multiple', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    expect(screen.getByText(/öffnet aktuell bei jedem Entwurf denselben KI-Chat/)).toBeInTheDocument()
  })

  it('hides the multi-draft hint once only one draft is left', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon löschen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.queryByText(/öffnet aktuell bei jedem Entwurf denselben KI-Chat/)).not.toBeInTheDocument()
  })

  it('hides the multi-draft hint once only one draft remains active (the other finalized)', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Kyoto abschließen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, abschließen' }))
    expect(screen.queryByText(/öffnet aktuell bei jedem Entwurf denselben KI-Chat/)).not.toBeInTheDocument()
  })

  it('pauses and resumes a draft via the pause/play toggle', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon pausieren' }))
    expect(screen.getAllByText('Pausiert')).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon fortsetzen' }))
    expect(screen.getAllByText('In Bearbeitung')).toHaveLength(1)
  })

  it('finalizes a draft and hides its pause/finalize actions afterward', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon abschließen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, abschließen' }))
    expect(screen.getByText('Abgeschlossen')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Lissabon pausieren' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Lissabon abschließen' })).not.toBeInTheDocument()
  })

  it('hides the "Planung fortsetzen" button once a draft is finalized', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('link', { name: 'Planung fortsetzen' })).toHaveLength(2)

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon abschließen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, abschließen' }))

    expect(screen.getAllByRole('link', { name: 'Planung fortsetzen' })).toHaveLength(1)
  })

  it('asks for confirmation before finalizing a draft, and keeps it in progress if cancelled', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon abschließen' }))
    expect(screen.getByText('Entwurf abschließen?')).toBeInTheDocument()
    expect(screen.getByText(/Der Entwurf für Lissabon wird abgeschlossen/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))
    expect(screen.queryByText('Entwurf abschließen?')).not.toBeInTheDocument()
    expect(screen.getByText('In Bearbeitung')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lissabon abschließen' })).toBeInTheDocument()
  })

  it('duplicates a draft, inserting a second card with the same destination', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon duplizieren' }))
    expect(screen.getAllByText('Lissabon')).toHaveLength(2)
    expect(screen.getAllByText('In Bearbeitung')).toHaveLength(2)
  })

  it('gives duplicated drafts distinct aria-labels so screen reader users can tell them apart', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon duplizieren' }))

    expect(screen.getByRole('button', { name: 'Lissabon (Eintrag 1) löschen' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lissabon (Eintrag 2) löschen' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Lissabon löschen' })).not.toBeInTheDocument()
    // Ein nicht duplizierter Entwurf bleibt unverändert ohne den Zusatz.
    expect(screen.getByRole('button', { name: 'Kyoto löschen' })).toBeInTheDocument()
  })

  it('asks for confirmation before deleting a draft, and keeps it if cancelled', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon löschen' }))
    expect(screen.getByText('Entwurf löschen?')).toBeInTheDocument()
    expect(screen.getByText(/Der Entwurf für Lissabon wird gelöscht/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))
    expect(screen.queryByText('Entwurf löschen?')).not.toBeInTheDocument()
    expect(screen.getByText('Lissabon')).toBeInTheDocument()
  })

  it('offers no "Details ansehen" action for a draft that is still in progress or paused', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('button', { name: 'Lissabon Details ansehen' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Kyoto Details ansehen' })).not.toBeInTheDocument()
  })

  it('shows a read-only details dialog with the trip data for a finalized draft', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon abschließen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, abschließen' }))

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon Details ansehen' }))
    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getByText('Abgeschlossener Reiseentwurf — nur zum Ansehen.')).toBeInTheDocument()
    expect(dialog.getByText('Flug')).toBeInTheDocument()
    expect(dialog.getByText('15. – 22. September 2026')).toBeInTheDocument()
    expect(dialog.getByText('bis 1.200 €')).toBeInTheDocument()
    expect(dialog.getByText('Noch keine Aktivitäten geplant')).toBeInTheDocument()

    fireEvent.click(dialog.getByRole('button', { name: 'Schließen' }))
    expect(screen.queryByText('Abgeschlossener Reiseentwurf — nur zum Ansehen.')).not.toBeInTheDocument()
  })

  it('marks missing transport/budget/accommodation as such in the details dialog instead of hiding them', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    // Kyoto hat nur ein Reisedatum gesetzt, Transport/Budget/Unterkunft sind null.
    fireEvent.click(screen.getByRole('button', { name: 'Kyoto abschließen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, abschließen' }))

    fireEvent.click(screen.getByRole('button', { name: 'Kyoto Details ansehen' }))
    const dialog = within(screen.getByRole('dialog'))
    expect(dialog.getByText('3. – 10. März 2027')).toBeInTheDocument()
    expect(dialog.getByText('Noch kein Transport ausgewählt')).toBeInTheDocument()
    expect(dialog.getByText('Noch kein Budget angegeben')).toBeInTheDocument()
    expect(dialog.getByText('Noch keine Unterkunft ausgewählt')).toBeInTheDocument()
  })

  it('deletes a draft once its removal is confirmed, and shows the empty state once none are left', () => {
    render(
      <MemoryRouter>
        <Reiseentwuerfe />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Lissabon löschen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.queryByText('Lissabon')).not.toBeInTheDocument()
    expect(screen.getByText('Kyoto')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Kyoto löschen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))
    expect(screen.getByText('Noch keine Reiseentwürfe')).toBeInTheDocument()
  })
})
