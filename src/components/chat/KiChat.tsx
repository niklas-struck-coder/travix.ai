import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { TravixAvatar } from '@/components/chat/TravixAvatar'
import { ChatMessage } from '@/components/chat/ChatMessage'
import { ChatInput } from '@/components/chat/ChatInput'
import { QuickReplies } from '@/components/chat/QuickReplies'
import { TripSummaryCard } from '@/components/chat/TripSummaryCard'
import { HotelResults } from '@/components/search/HotelResults'
import { FlightResults } from '@/components/search/FlightResults'
import { Button } from '@/components/ui/button'
import { useChat } from '@/hooks/useChat'
import { isSpeechSynthesisSupported } from '@/lib/ai/speech'
import { hasTripData } from '@/lib/trip/tripStorage'
import type { EditableTripField } from '@/types/chat'

const editableFields: EditableTripField[] = ['transportMode', 'dates', 'budget', 'accommodation']

export function KiChat() {
  const [speechEnabled, setSpeechEnabled] = useState(false)
  const {
    messages,
    trip,
    quickReplies,
    avatarState,
    isThinking,
    stayOffers,
    stayLoading,
    stayError,
    flightOffers,
    flightErrors,
    flightLoading,
    storageWarning,
    sendMessage,
    selectHotel,
    selectFlight,
    resetChat,
    startEdit,
  } = useChat(speechEnabled)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const editHandled = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isThinking, stayOffers, stayLoading, flightOffers, flightLoading])

  // Coming from a Reiseplan "Bearbeiten" button (?edit=accommodation etc.) —
  // jump straight into re-collecting that one field instead of making the
  // user click through the whole chat again. Waits for the stored trip to
  // finish loading (hasTripData is false on the very first render) before
  // firing, and only fires once per visit.
  useEffect(() => {
    const editParam = searchParams.get('edit')
    if (!editParam || editHandled.current) return
    if (!editableFields.includes(editParam as EditableTripField)) return
    if (!hasTripData(trip)) return

    editHandled.current = true
    startEdit(editParam as EditableTripField)
    setSearchParams({}, { replace: true })
  }, [searchParams, trip, startEdit, setSearchParams])

  const handleQuickReply = (option: string) => {
    if (option === 'Neue Reise planen') {
      resetChat()
      return
    }
    sendMessage(option)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card lg:h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <TravixAvatar state={avatarState} />
          <div>
            <p className="font-heading text-sm font-semibold text-foreground">Travix</p>
            <p className="text-xs text-muted-foreground">Dein persönlicher Reiseberater</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isSpeechSynthesisSupported() && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSpeechEnabled((value) => !value)}
              aria-label={speechEnabled ? 'Sprachausgabe deaktivieren' : 'Sprachausgabe aktivieren'}
              title={speechEnabled ? 'Sprachausgabe deaktivieren' : 'Sprachausgabe aktivieren'}
            >
              {speechEnabled ? <Volume2 className="text-teal" /> : <VolumeX />}
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={resetChat} aria-label="Neu starten" title="Neu starten">
            <RotateCcw />
          </Button>
        </div>
      </div>

      {storageWarning && (
        <p role="status" className="border-b border-border px-4 py-2 text-xs text-muted-foreground">
          Dein Fortschritt kann gerade nicht dauerhaft gespeichert werden — ein Neuladen würde ihn verwerfen.
        </p>
      )}

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isThinking && (
          <div className="flex items-center gap-2">
            <TravixAvatar state="thinking" size="sm" />
            <span className="text-sm text-muted-foreground">Travix denkt nach …</span>
          </div>
        )}

        {(stayLoading || stayOffers || stayError) && (
          <HotelResults offers={stayOffers} error={stayError} loading={stayLoading} onSelect={selectHotel} />
        )}

        {(flightLoading || flightOffers || flightErrors.length > 0) && (
          <FlightResults offers={flightOffers} errors={flightErrors} loading={flightLoading} onSelect={selectFlight} />
        )}

        {hasTripData(trip) && <TripSummaryCard trip={trip} />}
      </div>

      <div className="flex flex-col gap-3 px-4 pt-2">
        <QuickReplies options={quickReplies} onSelect={handleQuickReply} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isThinking} />
    </div>
  )
}
