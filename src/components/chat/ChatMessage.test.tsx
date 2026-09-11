import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChatMessage } from './ChatMessage'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

function makeMessage(overrides: Partial<ChatMessageType> = {}): ChatMessageType {
  return {
    id: '1',
    role: 'assistant',
    content: 'Hallo, wie kann ich dir helfen?',
    timestamp: new Date('2026-09-11T14:30:00').getTime(),
    ...overrides,
  }
}

describe('ChatMessage', () => {
  it('renders an assistant message with the avatar and formatted time', () => {
    render(<ChatMessage message={makeMessage()} />)

    expect(screen.getByText('Hallo, wie kann ich dir helfen?')).toBeInTheDocument()
    expect(screen.getByText('14:30')).toBeInTheDocument()
    expect(document.querySelector('svg.lucide-smile')).toBeInTheDocument()
  })

  it('renders a user message without the avatar', () => {
    render(<ChatMessage message={makeMessage({ role: 'user', content: 'Ich möchte nach Rom.' })} />)

    expect(screen.getByText('Ich möchte nach Rom.')).toBeInTheDocument()
    expect(document.querySelector('svg.lucide-smile')).not.toBeInTheDocument()
  })
})
