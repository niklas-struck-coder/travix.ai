/** Formats a Duffel-style offer price ("249.00", "EUR") in German locale, e.g. "249,00 €". */
export function formatOfferPrice(amount: string, currency: string): string {
  const value = Number(amount)
  if (Number.isNaN(value)) return `${amount} ${currency}`
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(value)
}
