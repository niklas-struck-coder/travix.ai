import { describe, expect, it } from 'vitest'
import {
  formatMonthLabel,
  getMonthGridDays,
  getNextMonth,
  getPreviousMonth,
  getTripsForDay,
} from '@/lib/trip/calendarUtils'

describe('getMonthGridDays', () => {
  it('returns a full 42-day grid', () => {
    expect(getMonthGridDays(2026, 8)).toHaveLength(42)
  })

  it('starts on the Monday on/before the 1st of the month', () => {
    const grid = getMonthGridDays(2026, 8) // September 2026 starts on a Tuesday
    expect(grid[0]).toEqual({ date: '2026-08-31', day: 31, inCurrentMonth: false })
    expect(grid[1]).toEqual({ date: '2026-09-01', day: 1, inCurrentMonth: true })
  })

  it('ends on the Sunday on/after the last day of the month', () => {
    const grid = getMonthGridDays(2026, 8)
    expect(grid[41]).toEqual({ date: '2026-10-11', day: 11, inCurrentMonth: false })
  })

  it('marks exactly the days belonging to the target month', () => {
    const grid = getMonthGridDays(2026, 8)
    expect(grid.filter((cell) => cell.inCurrentMonth)).toHaveLength(30)
  })
})

describe('getTripsForDay', () => {
  const trips = [{ id: '1', destination: 'Lissabon', startDate: '2026-09-15', endDate: '2026-09-22' }]

  it('includes a trip on its start and end date (inclusive range)', () => {
    expect(getTripsForDay(trips, '2026-09-15')).toEqual(trips)
    expect(getTripsForDay(trips, '2026-09-22')).toEqual(trips)
  })

  it('excludes days just outside the range', () => {
    expect(getTripsForDay(trips, '2026-09-14')).toEqual([])
    expect(getTripsForDay(trips, '2026-09-23')).toEqual([])
  })
})

describe('formatMonthLabel', () => {
  it('formats German month names with the year', () => {
    expect(formatMonthLabel(2026, 8)).toBe('September 2026')
    expect(formatMonthLabel(2026, 2)).toBe('März 2026')
  })
})

describe('getPreviousMonth', () => {
  it('steps back within the same year', () => {
    expect(getPreviousMonth(2026, 8)).toEqual({ year: 2026, month: 7 })
  })

  it('rolls over to December of the previous year from January', () => {
    expect(getPreviousMonth(2026, 0)).toEqual({ year: 2025, month: 11 })
  })
})

describe('getNextMonth', () => {
  it('steps forward within the same year', () => {
    expect(getNextMonth(2026, 8)).toEqual({ year: 2026, month: 9 })
  })

  it('rolls over to January of the next year from December', () => {
    expect(getNextMonth(2026, 11)).toEqual({ year: 2027, month: 0 })
  })
})
