import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { startListening } from './speech'

class FakeRecognition {
  lang = ''
  interimResults = false
  continuous = false
  onresult: ((event: unknown) => void) | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  start = vi.fn()
  stop = vi.fn()
}

describe('startListening', () => {
  let originalSpeechRecognition: unknown

  beforeEach(() => {
    originalSpeechRecognition = (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition
  })

  afterEach(() => {
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = originalSpeechRecognition
  })

  it('returns null and never calls start() when the browser has no speech recognition support', () => {
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = undefined
    const onResult = vi.fn()
    const onEnd = vi.fn()
    const result = startListening(onResult, onEnd)
    expect(result).toBeNull()
  })

  it('calls onError and onEnd, and returns null, when recognition.start() throws synchronously', () => {
    const instance = new FakeRecognition()
    instance.start.mockImplementation(() => {
      throw new Error('Permission denied')
    })
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = vi.fn(
      function SpeechRecognition() {
        return instance
      },
    )

    const onResult = vi.fn()
    const onEnd = vi.fn()
    const onError = vi.fn()
    const result = startListening(onResult, onEnd, onError)

    expect(result).toBeNull()
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('does not throw when recognition.start() fails and no onError callback was given', () => {
    const instance = new FakeRecognition()
    instance.start.mockImplementation(() => {
      throw new Error('Permission denied')
    })
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = vi.fn(
      function SpeechRecognition() {
        return instance
      },
    )

    const onEnd = vi.fn()
    expect(() => startListening(vi.fn(), onEnd)).not.toThrow()
    expect(onEnd).toHaveBeenCalledTimes(1)
  })

  it('returns the recognition instance and does not call onEnd when start() succeeds', () => {
    const instance = new FakeRecognition()
    ;(window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition = vi.fn(
      function SpeechRecognition() {
        return instance
      },
    )

    const onEnd = vi.fn()
    const result = startListening(vi.fn(), onEnd)

    expect(result).toBe(instance)
    expect(instance.start).toHaveBeenCalledTimes(1)
    expect(onEnd).not.toHaveBeenCalled()
  })
})
