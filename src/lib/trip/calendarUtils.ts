export interface CalendarTripRange {
  id: string
  destination: string
  /** ISO date (YYYY-MM-DD), inclusive. */
  startDate: string
  /** ISO date (YYYY-MM-DD), inclusive. */
  endDate: string
}

export interface CalendarDay {
  /** ISO date (YYYY-MM-DD). */
  date: string
  day: number
  inCurrentMonth: boolean
}

export const WEEKDAY_LABELS_DE = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as const

export const MONTH_NAMES_DE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
] as const

export function toIsoDate(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, '0')
  const m = String(month + 1).padStart(2, '0')
  const d = String(day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Monday-first weekday index (0 = Monday ... 6 = Sunday) for a given date. */
function mondayFirstWeekday(date: Date): number {
  return (date.getDay() + 6) % 7
}

/**
 * Full 6-week (42-day) grid for the given month (0-indexed), starting on
 * the Monday on/before the 1st and ending on the Sunday on/after the last
 * day — so the grid always fills complete weeks, German week-start
 * convention (Monday first).
 */
export function getMonthGridDays(year: number, month: number): CalendarDay[] {
  const firstOfMonth = new Date(year, month, 1)
  const startOffset = mondayFirstWeekday(firstOfMonth)
  const gridStart = new Date(year, month, 1 - startOffset)

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart)
    cellDate.setDate(gridStart.getDate() + index)
    return {
      date: toIsoDate(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate()),
      day: cellDate.getDate(),
      inCurrentMonth: cellDate.getMonth() === month,
    }
  })
}

/** Trips whose [startDate, endDate] range includes the given ISO date. */
export function getTripsForDay(trips: CalendarTripRange[], date: string): CalendarTripRange[] {
  return trips.filter((trip) => trip.startDate <= date && date <= trip.endDate)
}

export function formatMonthLabel(year: number, month: number): string {
  return `${MONTH_NAMES_DE[month]} ${year}`
}
