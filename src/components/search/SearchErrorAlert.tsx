import { AlertTriangle } from 'lucide-react'
import type { DuffelError } from '@/types/duffel'

interface SearchErrorAlertProps {
  errors: DuffelError[]
}

export function SearchErrorAlert({ errors }: SearchErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
    >
      <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      <div className="flex flex-col gap-1">
        {errors.map((error, index) => (
          <span key={index}>{error.message}</span>
        ))}
      </div>
    </div>
  )
}
