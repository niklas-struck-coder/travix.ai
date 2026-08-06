interface SpeechRecognitionResultLike {
  transcript: string
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>>
}

interface SpeechRecognitionLike {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export const isSpeechRecognitionSupported = () => getSpeechRecognition() !== null
export const isSpeechSynthesisSupported = () => 'speechSynthesis' in window

export function startListening(onResult: (transcript: string) => void, onEnd: () => void) {
  const Recognition = getSpeechRecognition()
  if (!Recognition) return null

  const recognition = new Recognition()
  recognition.lang = 'de-DE'
  recognition.interimResults = false
  recognition.continuous = false

  recognition.onresult = (event) => {
    const transcript = event.results[0]?.[0]?.transcript
    if (transcript) onResult(transcript)
  }
  recognition.onend = onEnd
  recognition.onerror = onEnd

  recognition.start()
  return recognition
}

export function speak(text: string) {
  if (!isSpeechSynthesisSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'de-DE'
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
