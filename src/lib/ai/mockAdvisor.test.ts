import { describe, expect, it } from 'vitest'
import { detectTransportMode, emptyTrip, getGreeting, getNextAdvisorStep } from '@/lib/ai/mockAdvisor'

describe('detectTransportMode', () => {
  it('detects each transport mode from its German keywords, case-insensitively', () => {
    expect(detectTransportMode('Ich nehme den Zug')).toBe('train')
    expect(detectTransportMode('ICE ist am schnellsten')).toBe('train')
    expect(detectTransportMode('lieber FLUG')).toBe('flight')
    expect(detectTransportMode('Ab zum Flughafen')).toBe('flight')
    expect(detectTransportMode('Flixbus nehmen')).toBe('bus')
    expect(detectTransportMode('mit der Fähre')).toBe('ferry')
    expect(detectTransportMode('faehre bitte')).toBe('ferry')
    expect(detectTransportMode('Mietwagen wäre gut')).toBe('car')
    expect(detectTransportMode('ein Roadtrip')).toBe('car')
  })

  it('returns null when no keyword matches', () => {
    expect(detectTransportMode('Ich weiß noch nicht')).toBeNull()
  })

  it('does not match a keyword that only occurs as a substring of an unrelated word', () => {
    expect(detectTransportMode('Ich möchte einen Ausflug machen')).toBeNull()
    expect(detectTransportMode('Kein Zugriff auf meine Unterlagen')).toBeNull()
    expect(detectTransportMode('Das geht automatisch, oder?')).toBeNull()
  })
})

describe('getGreeting', () => {
  it('returns an opening reply asking for the destination on an empty trip', () => {
    const reply = getGreeting()
    expect(reply.nextField).toBe('destination')
    expect(reply.trip).toEqual(emptyTrip)
    expect(reply.avatarState).toBe('greeting')
    expect(reply.quickReplies.length).toBeGreaterThan(0)
  })
})

describe('getNextAdvisorStep', () => {
  it('sets the destination from the first user message and asks for transport mode next', () => {
    const reply = getNextAdvisorStep(emptyTrip, 'Lissabon')
    expect(reply.trip.destination).toBe('Lissabon')
    expect(reply.nextField).toBe('transportMode')
  })

  it('re-asks for transport mode without advancing when the message has no recognizable mode', () => {
    const trip = { ...emptyTrip, destination: 'Lissabon' }
    const reply = getNextAdvisorStep(trip, 'irgendwie halt')
    expect(reply.trip.transportMode).toBeNull()
    expect(reply.nextField).toBe('transportMode')
  })

  it('sets the transport mode once recognized and asks for dates next', () => {
    const trip = { ...emptyTrip, destination: 'Lissabon' }
    const reply = getNextAdvisorStep(trip, 'Zug bitte')
    expect(reply.trip.transportMode).toBe('train')
    expect(reply.nextField).toBe('dates')
  })

  it('sets dates and asks for budget next', () => {
    const trip = { ...emptyTrip, destination: 'Lissabon', transportMode: 'train' as const }
    const reply = getNextAdvisorStep(trip, 'Im Sommer')
    expect(reply.trip.dates).toBe('Im Sommer')
    expect(reply.nextField).toBe('budget')
  })

  it('sets budget and asks for accommodation next', () => {
    const trip = {
      ...emptyTrip,
      destination: 'Lissabon',
      transportMode: 'train' as const,
      dates: 'Im Sommer',
    }
    const reply = getNextAdvisorStep(trip, 'bis 1.000 €')
    expect(reply.trip.budget).toBe('bis 1.000 €')
    expect(reply.nextField).toBe('accommodation')
  })

  it('sets accommodation and signals no further field is being asked for', () => {
    const trip = {
      ...emptyTrip,
      destination: 'Lissabon',
      transportMode: 'train' as const,
      dates: 'Im Sommer',
      budget: 'bis 1.000 €',
    }
    const reply = getNextAdvisorStep(trip, 'Hotel Lissabon')
    expect(reply.trip.accommodation).toBe('Hotel Lissabon')
    expect(reply.nextField).toBeNull()
  })

  it('promises a real search when the final step completes a flight trip, since flights are actually searched', () => {
    const trip = {
      ...emptyTrip,
      destination: 'Lissabon',
      transportMode: 'flight' as const,
      dates: 'Im Sommer',
      budget: 'bis 1.000 €',
    }
    const reply = getNextAdvisorStep(trip, 'Hotel Lissabon')
    expect(reply.content).toContain('Ich suche jetzt nach echten Flug-Verbindungen')
    expect(reply.avatarState).toBe('searching')
    // Der Hauptchat-Ablauf löst die echte Flugsuche nicht aus, also braucht
    // es hier einen Ausweg statt einer leeren Quick-Reply-Liste (siehe
    // reports/support-chef.md, 2026-08-29, Fund 1).
    expect(reply.quickReplies).toEqual(['Neue Reise planen'])
  })

  it('does not promise a search it cannot deliver for train/bus/ferry/car — there is no connection search for those yet', () => {
    const trip = {
      ...emptyTrip,
      destination: 'Lissabon',
      transportMode: 'train' as const,
      dates: 'Im Sommer',
      budget: 'bis 1.000 €',
    }
    const reply = getNextAdvisorStep(trip, 'Hotel Lissabon')
    expect(reply.content).not.toContain('Ich suche jetzt')
    expect(reply.content).toContain('Zug-Verbindungen')
    expect(reply.content).toContain('Reiseplan steht')
    expect(reply.avatarState).toBe('happy')
    expect(reply.quickReplies).toEqual(['Neue Reise planen'])
  })

  it('announces the finished plan once every field is already filled', () => {
    const trip = {
      ...emptyTrip,
      destination: 'Lissabon',
      transportMode: 'train' as const,
      dates: 'Im Sommer',
      budget: 'bis 1.000 €',
      accommodation: 'Hotel Lissabon',
    }
    const reply = getNextAdvisorStep(trip, 'egal was jetzt kommt')
    expect(reply.nextField).toBeNull()
    expect(reply.content).toContain('Reiseplan steht')
    expect(reply.trip).toEqual(trip)
  })

  it('does not mutate the trip object passed in', () => {
    const trip = { ...emptyTrip, destination: 'Lissabon' }
    const frozen = { ...trip }
    getNextAdvisorStep(trip, 'Zug')
    expect(trip).toEqual(frozen)
  })
})
