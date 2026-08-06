import type { AdvisorReply, TransportMode, TripDraft } from '@/types/chat'

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

function detectTransportMode(text: string): TransportMode | null {
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
  accommodation: null,
}

export function getGreeting(): AdvisorReply {
  return {
    content:
      'Hallo, ich bin Travix! Ich plane deine Reise Schritt für Schritt — mit echten Angeboten, nie erfunden. Wohin soll es gehen?',
    avatarState: 'greeting',
    quickReplies: ['Lissabon', 'Kyoto', 'Kapstadt', 'Überrasch mich'],
    trip: emptyTrip,
  }
}

export function getNextAdvisorStep(trip: TripDraft, userMessage: string): AdvisorReply {
  const next = { ...trip }

  if (!next.destination) {
    next.destination = userMessage
    return {
      content: `${userMessage} klingt nach einer großartigen Idee! Wie möchtest du anreisen — Zug, Flug, Bus, Fähre oder Mietwagen?`,
      avatarState: 'happy',
      quickReplies: ['Zug', 'Flug', 'Bus', 'Fähre'],
      trip: next,
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
      }
    }
    next.transportMode = mode
    return {
      content: `Verstanden — nur ${transportLabelsDe[mode]}-Verbindungen, wie gewünscht. Wann soll die Reise stattfinden?`,
      avatarState: 'writing',
      quickReplies: ['Nächstes Wochenende', 'In 2 Wochen', 'Im Sommer'],
      trip: next,
    }
  }

  if (!next.dates) {
    next.dates = userMessage
    return {
      content: 'Perfekt. Wie viel Budget hast du für die Reise eingeplant (gesamt, pro Person)?',
      avatarState: 'writing',
      quickReplies: ['bis 500 €', 'bis 1.000 €', 'bis 2.000 €'],
      trip: next,
    }
  }

  if (!next.budget) {
    next.budget = userMessage
    return {
      content: 'Danke! Und wie soll die Unterkunft sein — Hotel, Ferienwohnung oder Hostel?',
      avatarState: 'writing',
      quickReplies: ['Hotel', 'Ferienwohnung', 'Hostel'],
      trip: next,
    }
  }

  if (!next.accommodation) {
    next.accommodation = userMessage
    return {
      content: `Ich suche jetzt nach echten ${transportLabelsDe[next.transportMode]}-Verbindungen und Unterkünften für ${next.destination} — sobald ich etwas Verifiziertes gefunden habe, zeige ich es dir. Nichts wird erfunden.`,
      avatarState: 'searching',
      quickReplies: [],
      trip: next,
    }
  }

  return {
    content:
      'Dein Reiseplan steht! Öffne den Reiseplan, um alles im Detail zu sehen und einzelne Bausteine zu bearbeiten.',
    avatarState: 'happy',
    quickReplies: ['Neue Reise planen'],
    trip: next,
  }
}
