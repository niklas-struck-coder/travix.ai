import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formats a raw offer amount (e.g. "245.00") + ISO currency code as a German-locale price, e.g. "245,00 €". */
export function formatPrice(amount: string, currency: string) {
  const value = Number(amount)
  if (Number.isNaN(value)) return `${amount} ${currency}`
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(value)
}
