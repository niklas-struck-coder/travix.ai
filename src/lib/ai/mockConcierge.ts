/**
 * Local stand-in for the real on-trip AI (Base44 InvokeLLM + vision, per the
 * PRD's Urlaubsmodus spec). Answers a few common on-trip questions with
 * real, verifiable general knowledge (currency, emergency numbers, a
 * greeting) per destination — never invented specifics like restaurant
 * recommendations or live event info, since that would violate the
 * "no fabricated data" principle without a real search backend.
 */

interface DestinationFacts {
  currency: string
  emergencyNumber: string
  greeting: string
}

const destinationFacts: Record<string, DestinationFacts> = {
  Lissabon: { currency: 'Euro (€)', emergencyNumber: '112', greeting: '"Olá" heißt Hallo auf Portugiesisch.' },
  Kyoto: { currency: 'Japanischer Yen (¥)', emergencyNumber: '110 (Polizei) / 119 (Feuer & Rettung)', greeting: '"Konnichiwa" heißt Hallo auf Japanisch.' },
  Kapstadt: { currency: 'Südafrikanischer Rand (ZAR)', emergencyNumber: '112 oder 10111', greeting: '"Molo" heißt Hallo auf Xhosa.' },
  Reykjavik: { currency: 'Isländische Krone (ISK)', emergencyNumber: '112', greeting: '"Halló" heißt Hallo auf Isländisch.' },
  Paris: { currency: 'Euro (€)', emergencyNumber: '112', greeting: '"Bonjour" heißt Hallo auf Französisch.' },
  Rom: { currency: 'Euro (€)', emergencyNumber: '112', greeting: '"Ciao" oder "Buongiorno" heißt Hallo auf Italienisch.' },
  Barcelona: { currency: 'Euro (€)', emergencyNumber: '112', greeting: '"Hola" heißt Hallo auf Spanisch.' },
  'New York': { currency: 'US-Dollar ($)', emergencyNumber: '911', greeting: '"Hello" oder "Hi" reicht völlig.' },
}

function findFacts(destination: string | null): DestinationFacts | null {
  if (!destination) return null
  const match = Object.keys(destinationFacts).find((name) => destination.toLowerCase().includes(name.toLowerCase()))
  return match ? destinationFacts[match] : null
}

export function getConciergeGreeting(destination: string | null): string {
  if (!destination) {
    return 'Willkommen im Urlaubsmodus! Sobald eine Reise geplant ist, helfe ich dir hier mit Fragen rund um Kultur, Sprache und deinen Trip.'
  }
  return `Willkommen im Urlaubsmodus für deine Reise nach ${destination}! Frag mich zu Währung, Notrufnummern, Begrüßungsfloskeln oder anderen Fragen rund um deinen Trip.`
}

export function getConciergeReply(destination: string | null, userMessage: string): string {
  const facts = findFacts(destination)
  const lower = userMessage.toLowerCase()

  if (!facts) {
    return 'Dafür brauche ich eine geplante Reise mit Reiseziel — plane zuerst im KI-Chat, dann kann ich gezielter helfen.'
  }

  if (/währung|geld|bezahl|euro|preis/.test(lower)) {
    return `Vor Ort zahlst du in ${facts.currency}. Am besten mit Karte oder etwas Bargeld für Kleinigkeiten.`
  }
  if (/notruf|notfall|polizei|hilfe|unfall/.test(lower)) {
    return `Die Notrufnummer lautet: ${facts.emergencyNumber}.`
  }
  if (/sprache|begrüß|hallo|hi\b/.test(lower)) {
    return facts.greeting
  }

  return 'Das ist eine Demo-Antwort im Urlaubsmodus — sobald die echte KI-Anbindung aktiv ist, bekommst du hier fundierte, aktuelle Antworten. Frag mich gerne nach Währung, Notrufnummer oder einer Begrüßungsfloskel.'
}

export const conciergeQuickReplies = ['Währung?', 'Notrufnummer?', 'Wie sage ich Hallo?']
