import { Compass } from 'lucide-react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PlaceholderPage } from './PlaceholderPage'

describe('PlaceholderPage', () => {
  it('renders the title and description via PageHeader', () => {
    render(<PlaceholderPage title="Deal Finder" description="Findet die besten Angebote" icon={Compass} />)

    expect(screen.getByRole('heading', { name: 'Deal Finder' })).toBeInTheDocument()
    expect(screen.getByText('Findet die besten Angebote')).toBeInTheDocument()
  })

  it('shows a build-in-progress notice mentioning the page title', () => {
    render(<PlaceholderPage title="Deal Finder" description="Findet die besten Angebote" icon={Compass} />)

    expect(screen.getByText('Deal Finder wird als Nächstes gebaut. Diese Seite ist Teil des Travix-Grundgerüsts.')).toBeInTheDocument()
  })

  it('renders the given icon', () => {
    const { container } = render(
      <PlaceholderPage title="Deal Finder" description="Findet die besten Angebote" icon={Compass} />,
    )

    expect(container.querySelector('svg.lucide-compass')).toBeInTheDocument()
  })
})
