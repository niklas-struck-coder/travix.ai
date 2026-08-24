import type { TripDraft } from '@/types/chat'

export interface ChecklistItem {
  id: string
  label: string
}

/**
 * Auto-detected straight from the trip data — same underlying fields as
 * `calculateProgress.ts`, just surfaced as individual checklist rows here.
 * TripDraft only tracks a single `transportMode`/`dates` pair rather than
 * separate outbound/return legs, so "Transport" covers both directions
 * instead of two separate rows.
 */
export const AUTO_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'transport', label: 'Transport gebucht' },
  { id: 'dates', label: 'Reisedaten festgelegt' },
  { id: 'accommodation', label: 'Unterkunft gebucht' },
  { id: 'activities', label: 'Aktivitäten geplant' },
  { id: 'budget', label: 'Budget festgelegt' },
]

/**
 * Standard trip-prep items with no equivalent field in TripDraft — the
 * traveler checks these off manually (see ChecklistPanel.tsx).
 */
export const MANUAL_CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'passport', label: 'Reisepass/Ausweis gültig' },
  { id: 'visa', label: 'Visum geprüft (falls nötig)' },
  { id: 'insurance', label: 'Reiseversicherung abgeschlossen' },
  { id: 'health', label: 'Gesundheitsvorkehrungen geprüft' },
  { id: 'documents', label: 'Wichtige Dokumente digital gesichert' },
  { id: 'payment', label: 'Zahlungsmittel fürs Ausland vorbereitet' },
  { id: 'home', label: 'Zuhause organisiert (Wohnung, Haustier, Post)' },
  { id: 'packing', label: 'Koffer gepackt' },
]

/** Whether an auto-detected checklist item is complete, based on the trip data. */
export function isAutoItemChecked(trip: TripDraft, id: string): boolean {
  switch (id) {
    case 'transport':
      return Boolean(trip.transportMode)
    case 'dates':
      return Boolean(trip.dates)
    case 'accommodation':
      return Boolean(trip.accommodation)
    case 'activities':
      return trip.activities.length > 0
    case 'budget':
      return Boolean(trip.budget)
    default:
      return false
  }
}
