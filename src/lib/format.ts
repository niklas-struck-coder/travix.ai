/** Formats a plain EUR amount in German locale, e.g. "1.200 €". */
export function formatEuro(amount: number): string {
  return `${amount.toLocaleString('de-DE')} €`
}

/** Formats a Duffel-style offer price ("249.00", "EUR") in German locale, e.g. "249,00 €". */
export function formatOfferPrice(amount: string, currency: string): string {
  const value = Number(amount)
  if (Number.isNaN(value)) return `${amount} ${currency}`
  try {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(value)
  } catch {
    // Intl.NumberFormat throws a RangeError for a missing/invalid ISO-4217
    // currency code (e.g. an empty string from a Duffel response without
    // one) — fall back to the raw values instead of crashing the render.
    return `${amount} ${currency}`
  }
}

/** Formats an ISO-8601 duration ("PT3H15M", "P1D") as "3h 15min"/"24h", e.g. for flight/train offers. */
export function formatDuration(isoDuration: string): string {
  if (!isoDuration) return '—'
  const match = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?/.exec(isoDuration)
  if (!match) return isoDuration
  const [, days, hours, minutes] = match
  const totalHours = Number(days || 0) * 24 + Number(hours || 0)
  const totalMinutes = Number(minutes || 0)
  return [totalHours && `${totalHours}h`, totalMinutes > 0 && `${totalMinutes}min`].filter(Boolean).join(' ') || '—'
}
