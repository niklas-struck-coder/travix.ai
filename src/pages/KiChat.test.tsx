import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { KiChat } from './KiChat'

vi.mock('@/components/chat/KiChat', () => ({
  KiChat: () => <div data-testid="ki-chat-container" />,
}))

describe('KiChat page', () => {
  it('shows the page title and description', () => {
    render(<KiChat />)

    expect(screen.getByRole('heading', { name: 'KI-Chat' })).toBeInTheDocument()
    expect(screen.getByText('Dein persönlicher Reiseberater')).toBeInTheDocument()
  })

  it('renders the chat container', () => {
    render(<KiChat />)

    expect(screen.getByTestId('ki-chat-container')).toBeInTheDocument()
  })
})
