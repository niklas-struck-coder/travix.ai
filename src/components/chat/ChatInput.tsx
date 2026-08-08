import { useState } from 'react'
import { Mic, MicOff, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { isSpeechRecognitionSupported, startListening } from '@/lib/ai/speech'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({ onSend, disabled, placeholder = 'Beschreibe deine Traumreise…' }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [listening, setListening] = useState(false)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  const handleMicClick = () => {
    if (!isSpeechRecognitionSupported() || listening) return
    setListening(true)
    startListening(
      (transcript) => setValue((prev) => (prev ? `${prev} ${transcript}` : transcript)),
      () => setListening(false),
    )
  }

  return (
    <div className="flex items-center gap-2 border-t border-border bg-background p-3">
      {isSpeechRecognitionSupported() && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleMicClick}
          disabled={disabled}
          className={cn(listening && 'border-teal text-teal')}
          aria-label={listening ? 'Aufnahme läuft' : 'Spracheingabe starten'}
        >
          {listening ? <Mic className="animate-pulse" /> : <MicOff />}
        </Button>
      )}
      <Input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') handleSend()
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="bg-teal text-navy hover:bg-teal/90"
        aria-label="Senden"
      >
        <Send />
      </Button>
    </div>
  )
}
