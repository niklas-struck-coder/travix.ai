import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuickReplies } from './QuickReplies'

describe('QuickReplies', () => {
  it('renders nothing when there are no options', () => {
    const { container } = render(<QuickReplies options={[]} onSelect={vi.fn()} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders a button for each option', () => {
    render(<QuickReplies options={['Ja', 'Nein', 'Neue Reise planen']} onSelect={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Ja' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nein' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Neue Reise planen' })).toBeInTheDocument()
  })

  it('calls onSelect with the clicked option', () => {
    const onSelect = vi.fn()
    render(<QuickReplies options={['Ja', 'Nein']} onSelect={onSelect} />)

    fireEvent.click(screen.getByRole('button', { name: 'Nein' }))

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith('Nein')
  })
})
