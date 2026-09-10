import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TravixAvatar, type AvatarState } from './TravixAvatar'

const iconClassByState: Record<AvatarState, string> = {
  idle: 'lucide-compass',
  greeting: 'lucide-hand',
  thinking: 'lucide-loader-circle',
  writing: 'lucide-pen-line',
  searching: 'lucide-search',
  happy: 'lucide-smile',
  error: 'lucide-triangle-alert',
}

describe('TravixAvatar – Icon je Zustand', () => {
  for (const [state, iconClass] of Object.entries(iconClassByState) as [AvatarState, string][]) {
    it(`zeigt das richtige Icon für Zustand "${state}"`, () => {
      const { container } = render(<TravixAvatar state={state} />)

      expect(container.querySelector(`svg.${iconClass}`)).toBeInTheDocument()
      expect(container.querySelectorAll('svg')).toHaveLength(1)
    })
  }
})

describe('TravixAvatar – Denk-Puls-Ring', () => {
  it('zeigt den zusätzlichen Puls-Ring nur im Zustand "thinking"', () => {
    const { container: thinking } = render(<TravixAvatar state="thinking" />)
    expect(thinking.querySelector('.border-teal\\/40')).toBeInTheDocument()

    const { container: idle } = render(<TravixAvatar state="idle" />)
    expect(idle.querySelector('.border-teal\\/40')).not.toBeInTheDocument()
  })
})

describe('TravixAvatar – Größen', () => {
  it('verwendet standardmäßig Größe "md", wenn keine Größe übergeben wird', () => {
    const { container } = render(<TravixAvatar state="idle" />)
    expect(container.querySelector('.size-11')).toBeInTheDocument()
  })

  it('übernimmt eine explizit übergebene Größe', () => {
    const { container: small } = render(<TravixAvatar state="idle" size="sm" />)
    expect(small.querySelector('.size-8')).toBeInTheDocument()

    const { container: large } = render(<TravixAvatar state="idle" size="lg" />)
    expect(large.querySelector('.size-16')).toBeInTheDocument()
  })
})
