import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders the title without a description or actions when only the title is given', () => {
    render(<PageHeader title="Meine Reisen" />)

    expect(screen.getByRole('heading', { name: 'Meine Reisen' })).toBeInTheDocument()
    expect(screen.queryByText(/./, { selector: 'p' })).not.toBeInTheDocument()
  })

  it('renders the description when provided', () => {
    render(<PageHeader title="Meine Reisen" description="Alle deine geplanten Trips im Überblick" />)

    expect(screen.getByText('Alle deine geplanten Trips im Überblick')).toBeInTheDocument()
  })

  it('renders the actions when provided', () => {
    render(<PageHeader title="Meine Reisen" actions={<button type="button">Neue Reise</button>} />)

    expect(screen.getByRole('button', { name: 'Neue Reise' })).toBeInTheDocument()
  })
})
