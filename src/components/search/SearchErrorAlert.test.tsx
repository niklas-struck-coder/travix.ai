import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SearchErrorAlert } from './SearchErrorAlert'
import type { DuffelError } from '@/types/duffel'

describe('SearchErrorAlert', () => {
  it('announces a single search error to assistive tech via role="alert"', () => {
    const errors: DuffelError[] = [{ message: 'Die Suche hat gerade nicht geklappt.' }]
    render(<SearchErrorAlert errors={errors} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Die Suche hat gerade nicht geklappt.')
  })

  it('renders every error message when there are several', () => {
    const errors: DuffelError[] = [{ message: 'Erster Fehler.' }, { message: 'Zweiter Fehler.' }]
    render(<SearchErrorAlert errors={errors} />)

    expect(screen.getByText('Erster Fehler.')).toBeInTheDocument()
    expect(screen.getByText('Zweiter Fehler.')).toBeInTheDocument()
  })
})
