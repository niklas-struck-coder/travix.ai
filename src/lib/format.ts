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
