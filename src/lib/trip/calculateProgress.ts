import type { TripDraft } from '@/types/chat'

/**
 * Matches the sections shown on the Reiseplan (Buchung.tsx): Transport,
 * Reisedaten, Budget, Unterkunft, Aktivitäten. Destination isn't counted —
 * it's shown as the page title there, not a separate section to complete.
 */
const PROGRESS_COMPONENTS = ['transportMode', 'dates', 'budget', 'accommodation', 'activities'] as const

/** Percentage (0-100) of planning components that are filled in. */
export function calculateProgress(trip: TripDraft): number {
  const completed = PROGRESS_COMPONENTS.filter((field) =>
    field === 'activities' ? trip.activities.length > 0 : Boolean(trip[field]),
  ).length
  return Math.round((completed / PROGRESS_COMPONENTS.length) * 100)
}
