import type { AdvisorReply, TransportMode, TripDraft } from '@/types/chat'
import { knownDestinations } from '@/types/stays'

/**
 * Local stand-in for the real AI engine (Base44 InvokeLLM + gemini_3_flash +
 * add_context_from_internet, per the PRD). It follows the same conversation
 * rules — one question at a time, strict transport-mode enforcement, no
 * fabricated offers — using simple keyword matching instead of a model, so
 * the chat UX works end-to-end before real credentials are wired up.
 */

const transportKeywords: Record<TransportMode, string[]> = {
  train: ['zug', 'bahn', 'ice', 'railjet'],
  flight: ['flug', 'flieg', 'flughafen'],
  bus: ['bus', 'flixbus'],
  ferry: ['fähre', 'faehre', 'schiff'],
  car: ['auto', 'mietwagen', 'roadtrip'],
}

const transportLabelsDe: Record<TransportMode, string> = {
  train: 'Zug',
  flight: 'Flug',
  bus: 'Bus',
  ferry: 'Fähre',
  car: 'Mietwagen',
}

export function detectTransportMode(text: string): TransportMode | null {
  const lower = text.toLowerCase()
  for (const [mode, keywords] of Object.entries(transportKeywords) as [TransportMode, string[]][]) {
    if (keywords.some((keyword) => lower.includes(keyword))) return mode
  }
  return null
}

export const emptyTrip: TripDraft = {
  destination: null,
  transportMode: null,
  budget: null,
  dates: null,
  activities: [],
  accommodation: null,
}

export function getGreeting(): AdvisorReply {
  return {
    content:
      'Hallo, ich bin Travix! Ich plane deine Reise Schritt für Schritt — mit echten Angeboten, nie erfunden. Wohin soll es gehen?',
    avatarState: 'greeting',
    quickReplies: ['Lissabon', 'Kyoto', 'Kapstadt', 'Überrasch mich'],
    trip: emptyTrip,
    nextField: 'destination',
  }
}

export function getNextAdvisorStep(trip: TripDraft, userMessage: string): AdvisorReply {
  const next = { ...trip }

  if (!next.destination) {
    // "Überrasch mich" is a greeting quick-reply, not a real place name — pick
    // one of the curated destinations instead of using it as literal text,
    // which would otherwise become an unmatchable "destination" downstream.
    const destination =
      userMessage === 'Überrasch mich'
        ? knownDestinations[Math.floor(Math.random() * knownDestinations.length)].name
        : userMessage
    next.destination = destination
    return {
      content: `${destination} klingt nach einer großartigen Idee! Wie möchtest du anreisen — Zug, Flug, Bus, Fähre oder Mietwagen?`,
      avatarState: 'happy',
      quickReplies: ['Zug', 'Flug', 'Bus', 'Fähre'],
      trip: next,
      nextField: 'transportMode',
    }
  }

  if (!next.transportMode) {
    const mode = detectTransportMode(userMessage)
    if (!mode) {
      return {
        content: 'Ich möchte dein Transportmittel nicht falsch verstehen — bitte wähle eine Option aus:',
        avatarState: 'thinking',
        quickReplies: ['Zug', 'Flug', 'Bus', 'Fähre', 'Mietwagen'],
        trip: next,
        nextField: 'transportMode',
      }
    }
    next.transportMode = mode
    return {
      content: `Verstanden — nur ${transportLabelsDe[mode]}-Verbindungen, wie gewünscht. Wann soll die Reise stattfinden?`,
      avatarState: 'writing',
      quickReplies: ['Nächstes Wochenende', 'In 2 Wochen', 'Im Sommer'],
      trip: next,
      nextField: 'dates',
    }
  }

  if (!next.dates) {
    next.dates = userMessage
    return {
      content: 'Perfekt. Wie viel Budget hast du für die Reise eingeplant (gesamt, pro Person)?',
      avatarState: 'writing',
      quickReplies: ['bis 500 €', 'bis 1.000 €', 'bis 2.000 €'],
      trip: next,
      nextField: 'budget',
    }
  }

  if (!next.budget) {
    next.budget = userMessage
    return {
      content: `Danke! Ich suche jetzt nach echten Unterkünften in ${next.destination} — wähle direkt eine aus, oder beschreibe, was du suchst.`,
      avatarState: 'searching',
      quickReplies: ['Hotel', 'Ferienwohnung', 'Hostel'],
      trip: next,
      nextField: 'accommodation',
    }
  }

  if (!next.accommodation) {
    next.accommodation = userMessage
    return {
      content: `Ich suche jetzt nach echten ${transportLabelsDe[next.transportMode]}-Verbindungen für ${next.destination} — sobald ich etwas Verifiziertes gefunden habe, zeige ich es dir. Nichts wird erfunden.`,
      avatarState: 'searching',
      quickReplies: [],
      trip: next,
      nextField: null,
    }
  }

  return {
    content:
      'Dein Reiseplan steht! Öffne den Reiseplan, um alles im Detail zu sehen und einzelne Bausteine zu bearbeiten.',
    avatarState: 'happy',
    quickReplies: ['Neue Reise planen'],
    trip: next,
    nextField: null,
  }
}
