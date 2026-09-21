import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EditMode } from './EditMode'
import type { TripActivity } from '@/types/chat'

function renderEditMode(activities: TripActivity[], onChange = vi.fn()) {
  render(
    <EditMode activities={activities} onChange={onChange}>
      <button type="button">Aktivitäten bearbeiten</button>
    </EditMode>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Aktivitäten bearbeiten' }))
  return onChange
}

describe('EditMode', () => {
  it('shows an empty message when there are no activities yet', () => {
    renderEditMode([])
    expect(screen.getByText('Noch keine Aktivitäten hinzugefügt.')).toBeInTheDocument()
  })

  it('adds a new activity with name and price', () => {
    const onChange = renderEditMode([])

    fireEvent.change(screen.getByLabelText('Neue Aktivität'), { target: { value: 'Stadtführung' } })
    fireEvent.change(screen.getByLabelText('Preis'), { target: { value: '25 €' } })
    fireEvent.click(screen.getByRole('button', { name: 'Aktivität hinzufügen' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    const [added] = onChange.mock.calls[0][0] as TripActivity[]
    expect(added).toMatchObject({ name: 'Stadtführung', price: '25 €' })
  })

  it('does not add an activity with an empty name', () => {
    const onChange = renderEditMode([])
    expect(screen.getByRole('button', { name: 'Aktivität hinzufügen' })).toBeDisabled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('adds a new activity when pressing Enter in the name field', () => {
    const onChange = renderEditMode([])

    fireEvent.change(screen.getByLabelText('Neue Aktivität'), { target: { value: 'Stadtführung' } })
    fireEvent.keyDown(screen.getByLabelText('Neue Aktivität'), { key: 'Enter' })

    expect(onChange).toHaveBeenCalledTimes(1)
    const [added] = onChange.mock.calls[0][0] as TripActivity[]
    expect(added).toMatchObject({ name: 'Stadtführung', price: null })
  })

  it('adds a new activity when pressing Enter in the price field', () => {
    const onChange = renderEditMode([])

    fireEvent.change(screen.getByLabelText('Neue Aktivität'), { target: { value: 'Stadtführung' } })
    fireEvent.change(screen.getByLabelText('Preis'), { target: { value: '25 €' } })
    fireEvent.keyDown(screen.getByLabelText('Preis'), { key: 'Enter' })

    expect(onChange).toHaveBeenCalledTimes(1)
    const [added] = onChange.mock.calls[0][0] as TripActivity[]
    expect(added).toMatchObject({ name: 'Stadtführung', price: '25 €' })
  })

  it('does not add an activity when pressing Enter with an empty name', () => {
    const onChange = renderEditMode([])

    fireEvent.keyDown(screen.getByLabelText('Neue Aktivität'), { key: 'Enter' })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not add an activity when Enter confirms an IME composition in the name field', () => {
    const onChange = renderEditMode([])

    fireEvent.change(screen.getByLabelText('Neue Aktivität'), { target: { value: 'すし' } })
    fireEvent.keyDown(screen.getByLabelText('Neue Aktivität'), { key: 'Enter', isComposing: true })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not add an activity when Enter confirms an IME composition in the price field', () => {
    const onChange = renderEditMode([])

    fireEvent.change(screen.getByLabelText('Neue Aktivität'), { target: { value: 'Stadtführung' } })
    fireEvent.change(screen.getByLabelText('Preis'), { target: { value: '25' } })
    fireEvent.keyDown(screen.getByLabelText('Preis'), { key: 'Enter', isComposing: true })

    expect(onChange).not.toHaveBeenCalled()
  })

  it('asks for confirmation before removing an activity', () => {
    const onChange = renderEditMode([{ id: '1', name: 'Museum', price: '10 €' }])

    fireEvent.click(screen.getByRole('button', { name: 'Museum entfernen' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.getByText('Aktivität entfernen?')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Ja, entfernen' }))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('keeps the activity when the removal confirmation is cancelled', () => {
    const onChange = renderEditMode([{ id: '1', name: 'Museum', price: '10 €' }])

    fireEvent.click(screen.getByRole('button', { name: 'Museum entfernen' }))
    fireEvent.click(screen.getByRole('button', { name: 'Abbrechen' }))

    expect(onChange).not.toHaveBeenCalled()
    expect(screen.queryByText('Aktivität entfernen?')).not.toBeInTheDocument()
  })

  it('updates the price of an existing activity', () => {
    const onChange = renderEditMode([{ id: '1', name: 'Museum', price: '10 €' }])

    fireEvent.change(screen.getByLabelText('Preis für Museum'), { target: { value: '12 €' } })

    expect(onChange).toHaveBeenCalledWith([{ id: '1', name: 'Museum', price: '12 €' }])
  })

  it('gives same-named activities distinguishable labels', () => {
    renderEditMode([
      { id: '1', name: 'Spaziergang', price: null },
      { id: '2', name: 'Spaziergang', price: null },
      { id: '3', name: 'Museum', price: null },
    ])

    expect(screen.getByLabelText('Preis für Spaziergang (Eintrag 1)')).toBeInTheDocument()
    expect(screen.getByLabelText('Preis für Spaziergang (Eintrag 2)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spaziergang (Eintrag 1) entfernen' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Spaziergang (Eintrag 2) entfernen' })).toBeInTheDocument()

    expect(screen.getByLabelText('Preis für Museum')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Museum entfernen' })).toBeInTheDocument()
  })
})
