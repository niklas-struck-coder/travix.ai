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

  it('removes an existing activity', () => {
    const onChange = renderEditMode([{ id: '1', name: 'Museum', price: '10 €' }])

    fireEvent.click(screen.getByRole('button', { name: 'Museum entfernen' }))

    expect(onChange).toHaveBeenCalledWith([])
  })

  it('updates the price of an existing activity', () => {
    const onChange = renderEditMode([{ id: '1', name: 'Museum', price: '10 €' }])

    fireEvent.change(screen.getByLabelText('Preis für Museum'), { target: { value: '12 €' } })

    expect(onChange).toHaveBeenCalledWith([{ id: '1', name: 'Museum', price: '12 €' }])
  })
})
