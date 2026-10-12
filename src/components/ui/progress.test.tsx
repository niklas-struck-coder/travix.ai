import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Progress } from './progress'

function getIndicator(container: HTMLElement) {
  return container.querySelector('[data-slot="progress-indicator"]') as HTMLElement
}

describe('Progress – Fortschrittsbalken', () => {
  it('verschiebt den Indikator entsprechend dem übergebenen Wert', () => {
    const { container } = render(<Progress value={30} />)
    expect(getIndicator(container).style.transform).toBe('translateX(-70%)')
  })

  it('zeigt den Indikator vollständig gefüllt bei 100', () => {
    const { container } = render(<Progress value={100} />)
    expect(getIndicator(container).style.transform).toBe('translateX(-0%)')
  })

  it('zeigt den Indikator vollständig leer bei 0', () => {
    const { container } = render(<Progress value={0} />)
    expect(getIndicator(container).style.transform).toBe('translateX(-100%)')
  })

  it('fällt ohne übergebenen Wert auf 0 zurück (leerer Balken statt NaN)', () => {
    const { container } = render(<Progress />)
    expect(getIndicator(container).style.transform).toBe('translateX(-100%)')
  })
})
