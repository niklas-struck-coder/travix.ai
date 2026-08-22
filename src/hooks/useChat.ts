import { useEffect, useRef, useState } from 'react'
import type { AvatarState } from '@/components/chat/TravixAvatar'
import { detectTransportMode, emptyTrip, getGreeting, getNextAdvisorStep } from '@/lib/ai/mockAdvisor'
import { speak } from '@/lib/ai/speech'
import { searchFlights, searchStays } from '@/lib/duffel/client'
import { findKnownDestination } from '@/types/stays'
import type { StayOffer } from '@/types/stays'
import type { DuffelError, FlightOffer } from '@/types/duffel'
import { CHAT_STORAGE_KEY, loadStoredChat } from '@/lib/trip/tripStorage'
import type { StoredChatState } from '@/lib/trip/tripStorage'
import type { ChatMessage, EditableTripField, TripDraft } from '@/types/chat'

const IATA_CODE_PATTERN = /^[a-zA-Z]{3}$/

const editPrompts: Record<EditableTripField, { content: string; quickReplies: string[] }> = {
  transportMode: {
    content: 'Klar, lass uns das Transportmittel ändern — wie möchtest du stattdessen anreisen?',
    quickReplies: ['Zug', 'Flug', 'Bus', 'Fähre', 'Mietwagen'],
  },
  dates: {
    content: 'Klar, wann soll die Reise stattdessen stattfinden?',
    quickReplies: ['Nächstes Wochenende', 'In 2 Wochen', 'Im Sommer'],
  },
  budget: {
    content: 'Klar, welches Budget soll ich stattdessen einplanen?',
    quickReplies: ['bis 500 €', 'bis 1.000 €', 'bis 2.000 €'],
  },
  accommodation: {
    content: 'Klar, ich suche eine neue Unterkunft für dich — einen Moment.',
    quickReplies: [],
  },
}

const editFieldLabelsDe: Record<EditableTripField, string> = {
  transportMode: 'das Transportmittel',
  dates: 'die Reisedaten',
  budget: 'das Budget',
  accommodation: 'die Unterkunft',
}

// Trip dates are collected as free text ("Nächstes Wochenende"), not real
// dates, so the live hotel search uses a fixed 3-night window ~30 days out
// until real date parsing/picking is wired up.
function defaultStayDates() {
  const checkIn = new Date()
  checkIn.setDate(checkIn.getDate() + 30)
  const checkOut = new Date(checkIn)
  checkOut.setDate(checkOut.getDate() + 3)
  const toIso = (date: Date) => date.toISOString().slice(0, 10)
  return { checkInDate: toIso(checkIn), checkOutDate: toIso(checkOut) }
}

// Same 30-days-out window as defaultStayDates, so an auto-suggested flight
// lines up with the auto-suggested hotel stay (fly out on check-in day, back
// on check-out day) instead of picking an unrelated date at random.
function defaultFlightDates() {
  const departureDate = new Date()
  departureDate.setDate(departureDate.getDate() + 30)
  const returnDate = new Date(departureDate)
  returnDate.setDate(returnDate.getDate() + 3)
  const toIso = (date: Date) => date.toISOString().slice(0, 10)
  return { departureDate: toIso(departureDate), returnDate: toIso(returnDate) }
}

function makeMessage(role: ChatMessage['role'], content: string): ChatMessage {
  return { id: crypto.randomUUID(), role, content, timestamp: Date.now() }
}

export function useChat(speechEnabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [trip, setTrip] = useState<TripDraft>(emptyTrip)
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [avatarState, setAvatarState] = useState<AvatarState>('idle')
  const [isThinking, setIsThinking] = useState(false)
  const [stayOffers, setStayOffers] = useState<StayOffer[] | null>(null)
  const [stayLoading, setStayLoading] = useState(false)
  const [editingField, setEditingField] = useState<EditableTripField | null>(null)
  const [flightOffers, setFlightOffers] = useState<FlightOffer[] | null>(null)
  const [flightErrors, setFlightErrors] = useState<DuffelError[]>([])
  const [flightLoading, setFlightLoading] = useState(false)
  // Set once the user has picked "Flug" while editing the transport mode —
  // the next message is then treated as the departure airport, not as a
  // fresh transport-mode answer, so a real Duffel search can run.
  const [awaitingFlightOrigin, setAwaitingFlightOrigin] = useState(false)
  const initialized = useRef(false)

  const runFlightSearch = (origin: string, destinationIata: string) => {
    setFlightLoading(true)
    setFlightErrors([])
    const { departureDate, returnDate } = defaultFlightDates()
    searchFlights({ origin, destination: destinationIata, departureDate, returnDate, passengers: 1, cabinClass: 'economy' })
      .then((result) => {
        setFlightOffers(result.offers)
        setFlightErrors(result.errors)
        setFlightLoading(false)
      })
      .catch(() => {
        setFlightOffers([])
        setFlightLoading(false)
      })
  }

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const stored = loadStoredChat()
    if (stored && stored.messages.length > 0) {
      setMessages(stored.messages)
      setTrip(stored.trip)
      setQuickReplies(stored.quickReplies)
      setAvatarState('idle')
      return
    }

    const greeting = getGreeting()
    setMessages([makeMessage('assistant', greeting.content)])
    setTrip(greeting.trip)
    setQuickReplies(greeting.quickReplies)
    setAvatarState(greeting.avatarState)
  }, [])

  useEffect(() => {
    if (messages.length === 0) return
    const state: StoredChatState = { messages, trip, quickReplies }
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage full/disabled — chat still works, just without persistence.
    }
  }, [messages, trip, quickReplies])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (messages.length === 0) return
      try {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ messages, trip, quickReplies }))
      } catch {
        // Storage full/disabled — nothing to persist on unload.
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [messages, trip, quickReplies])

  /**
   * Jumps straight into re-collecting a single already-filled trip field
   * (triggered from the Reiseplan's "Bearbeiten" buttons via `?edit=`),
   * bypassing getNextAdvisorStep's linear fill order — that state machine
   * only ever asks for the next *empty* field, so it can't be used to
   * revisit a field that's already set.
   */
  const startEdit = (field: EditableTripField) => {
    const prompt = editPrompts[field]
    setMessages((prev) => [...prev, makeMessage('assistant', prompt.content)])
    setQuickReplies(prompt.quickReplies)
    setStayOffers(null)
    setEditingField(field)
    setAvatarState(field === 'accommodation' ? 'searching' : 'thinking')
    if (speechEnabled) speak(prompt.content)

    if (field === 'accommodation') {
      const destination = findKnownDestination(trip.destination ?? '')
      if (destination) {
        setStayLoading(true)
        const { checkInDate, checkOutDate } = defaultStayDates()
        searchStays({
          latitude: destination.latitude,
          longitude: destination.longitude,
          checkInDate,
          checkOutDate,
          rooms: 1,
          guests: 1,
        })
          .then((result) => {
            setStayOffers(result.offers)
            setStayLoading(false)
          })
          .catch(() => {
            setStayOffers([])
            setStayLoading(false)
          })
      }
    }
  }

  const sendMessage = (content: string) => {
    setMessages((prev) => [...prev, makeMessage('user', content)])
    setQuickReplies([])
    setStayOffers(null)
    if (!awaitingFlightOrigin) setFlightOffers(null)
    setIsThinking(true)
    setAvatarState('thinking')

    if (editingField === 'transportMode' && awaitingFlightOrigin) {
      const origin = content.trim().toUpperCase()
      window.setTimeout(() => {
        if (!IATA_CODE_PATTERN.test(origin)) {
          setMessages((prev) => [
            ...prev,
            makeMessage('assistant', 'Das sieht nicht nach einem 3-stelligen Flughafencode aus — magst du es nochmal versuchen? (z. B. BER für Berlin)'),
          ])
          setAvatarState('thinking')
          setIsThinking(false)
          return
        }

        setAwaitingFlightOrigin(false)
        setEditingField(null)
        setTrip((prev) => ({ ...prev, transportMode: 'flight' }))

        const known = findKnownDestination(trip.destination ?? '')
        if (!known) {
          const notice = `Danke! Für ${trip.destination ?? 'dein Ziel'} kenne ich noch keinen Flughafen für die automatische Suche — nutze dafür kurz die manuelle Flugsuche. Das Transportmittel hab ich trotzdem auf Flug gesetzt.`
          setMessages((prev) => [...prev, makeMessage('assistant', notice)])
          setQuickReplies(['Neue Reise planen'])
          setAvatarState('happy')
          setIsThinking(false)
          if (speechEnabled) speak(notice)
          return
        }

        const searching = `Danke! Ich suche jetzt echte Flüge von ${origin} nach ${known.iataCode} (${known.name}) für dich — einen Moment.`
        setMessages((prev) => [...prev, makeMessage('assistant', searching)])
        setQuickReplies([])
        setAvatarState('searching')
        setIsThinking(false)
        if (speechEnabled) speak(searching)
        runFlightSearch(origin, known.iataCode)
      }, 700)
      return
    }

    if (editingField) {
      const field = editingField
      window.setTimeout(() => {
        // transportMode is a fixed union ('flight'|'train'|...), not free
        // text — unlike dates/budget/accommodation it can't just take the
        // raw quick-reply label ("Zug"), that has to be mapped to the
        // internal mode ("train") first, same as the initial chat flow does.
        if (field === 'transportMode') {
          const mode = detectTransportMode(content)
          if (!mode) {
            setMessages((prev) => [
              ...prev,
              makeMessage('assistant', 'Ich möchte dein Transportmittel nicht falsch verstehen — bitte wähle eine Option aus:'),
            ])
            setQuickReplies(editPrompts.transportMode.quickReplies)
            setAvatarState('thinking')
            setIsThinking(false)
            return
          }

          // Flug ist der einzige Modus mit echter Suche — statt sofort zu
          // bestätigen, erst nach dem Startflughafen fragen (den kann ich
          // nicht raten) und den Edit-Zustand für diesen einen Zwischenschritt
          // offen lassen.
          if (mode === 'flight') {
            const askOrigin = 'Klasse, Flug! Von welchem Flughafen möchtest du starten? (3-stelliger IATA-Code, z. B. BER für Berlin)'
            setMessages((prev) => [...prev, makeMessage('assistant', askOrigin)])
            setQuickReplies([])
            setAvatarState('thinking')
            setIsThinking(false)
            setAwaitingFlightOrigin(true)
            if (speechEnabled) speak(askOrigin)
            return
          }

          setTrip((prev) => ({ ...prev, transportMode: mode }))
        } else {
          setTrip((prev) => ({ ...prev, [field]: content }))
        }
        setEditingField(null)
        const confirmation = `Alles klar, ich hab ${editFieldLabelsDe[field]} aktualisiert. Dein Reiseplan steht weiterhin.`
        setMessages((prev) => [...prev, makeMessage('assistant', confirmation)])
        setQuickReplies(['Neue Reise planen'])
        setAvatarState('happy')
        setIsThinking(false)
        if (speechEnabled) speak(confirmation)
      }, 700)
      return
    }

    window.setTimeout(() => {
      const reply = getNextAdvisorStep(trip, content)
      setMessages((prev) => [...prev, makeMessage('assistant', reply.content)])
      setTrip(reply.trip)
      setQuickReplies(reply.quickReplies)
      setAvatarState(reply.avatarState)
      setIsThinking(false)
      if (speechEnabled) speak(reply.content)

      if (reply.nextField === 'accommodation') {
        const destination = findKnownDestination(reply.trip.destination ?? '')
        if (destination) {
          setStayLoading(true)
          const { checkInDate, checkOutDate } = defaultStayDates()
          searchStays({
            latitude: destination.latitude,
            longitude: destination.longitude,
            checkInDate,
            checkOutDate,
            rooms: 1,
            guests: 1,
          })
            .then((result) => {
              setStayOffers(result.offers)
              setStayLoading(false)
            })
            .catch(() => {
              setStayOffers([])
              setStayLoading(false)
            })
        }
      }
    }, 700)
  }

  const selectHotel = (offer: StayOffer) => {
    sendMessage(offer.accommodationName)
  }

  const selectFlight = (offer: FlightOffer) => {
    const slice = offer.slices[0]
    const route = slice ? `${slice.originIata} → ${slice.destinationIata}` : trip.destination
    const confirmation = `Alles klar, ich hab den Flug ${route} für ${offer.totalAmount} ${offer.totalCurrency} für dich vorgemerkt. Dein Reiseplan steht weiterhin.`
    setFlightOffers(null)
    setMessages((prev) => [...prev, makeMessage('assistant', confirmation)])
    setQuickReplies(['Neue Reise planen'])
    setAvatarState('happy')
    if (speechEnabled) speak(confirmation)
  }

  const resetChat = () => {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY)
    } catch {
      // Storage disabled — reset the in-memory chat state regardless.
    }
    const greeting = getGreeting()
    setMessages([makeMessage('assistant', greeting.content)])
    setTrip(greeting.trip)
    setQuickReplies(greeting.quickReplies)
    setAvatarState(greeting.avatarState)
    setStayOffers(null)
    setEditingField(null)
    setFlightOffers(null)
    setFlightErrors([])
    setAwaitingFlightOrigin(false)
  }

  return {
    messages,
    trip,
    quickReplies,
    avatarState,
    isThinking,
    stayOffers,
    stayLoading,
    flightOffers,
    flightErrors,
    flightLoading,
    sendMessage,
    selectHotel,
    selectFlight,
    resetChat,
    startEdit,
  }
}
