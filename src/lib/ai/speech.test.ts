import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { startListening, speak, stopSpeaking, isSpeechSynthesisSupported } from './speech'

class FakeUtterance {
  text: string
  lang = ''
  constructor(text: string) {
    this.text = text
  }
}

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

describe('speech synthesis (speak/stopSpeaking/isSpeechSynthesisSupported)', () => {
  let originalSpeechSynthesis: unknown
  let originalSpeechSynthesisUtterance: unknown

  beforeEach(() => {
    originalSpeechSynthesis = (window as unknown as { speechSynthesis?: unknown }).speechSynthesis
    originalSpeechSynthesisUtterance = (window as unknown as { SpeechSynthesisUtterance?: unknown })
      .SpeechSynthesisUtterance
  })

  afterEach(() => {
    ;(window as unknown as { speechSynthesis?: unknown }).speechSynthesis = originalSpeechSynthesis
    ;(window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance =
      originalSpeechSynthesisUtterance
  })

  describe('isSpeechSynthesisSupported', () => {
    it('returns true when the browser has speechSynthesis', () => {
      ;(window as unknown as { speechSynthesis?: unknown }).speechSynthesis = { cancel: vi.fn(), speak: vi.fn() }
      expect(isSpeechSynthesisSupported()).toBe(true)
    })

    it('returns false when the browser has no speechSynthesis', () => {
      delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis
      expect(isSpeechSynthesisSupported()).toBe(false)
    })
  })

  describe('speak', () => {
    it('cancels any ongoing speech and speaks the given text in German when supported', () => {
      const cancel = vi.fn()
      const speakFn = vi.fn()
      ;(window as unknown as { speechSynthesis?: unknown }).speechSynthesis = { cancel, speak: speakFn }
      ;(window as unknown as { SpeechSynthesisUtterance?: unknown }).SpeechSynthesisUtterance = FakeUtterance

      speak('Hallo Welt')

      expect(cancel).toHaveBeenCalledTimes(1)
      expect(speakFn).toHaveBeenCalledTimes(1)
      const utterance = speakFn.mock.calls[0][0] as FakeUtterance
      expect(utterance.text).toBe('Hallo Welt')
      expect(utterance.lang).toBe('de-DE')
    })

    it('does nothing when speech synthesis is not supported', () => {
      delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis
      expect(() => speak('Hallo Welt')).not.toThrow()
    })
  })

  describe('stopSpeaking', () => {
    it('cancels ongoing speech when supported', () => {
      const cancel = vi.fn()
      ;(window as unknown as { speechSynthesis?: unknown }).speechSynthesis = { cancel, speak: vi.fn() }

      stopSpeaking()

      expect(cancel).toHaveBeenCalledTimes(1)
    })

    it('does nothing when speech synthesis is not supported', () => {
      delete (window as unknown as { speechSynthesis?: unknown }).speechSynthesis
      expect(() => stopSpeaking()).not.toThrow()
    })
  })
})
