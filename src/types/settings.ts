export const NOTIFICATION_PREFERENCES = [
  { key: 'priceAlerts', label: 'Preisalarme' },
  { key: 'newOffers', label: 'Neue Angebote' },
  { key: 'tripUpdates', label: 'Reise-Updates' },
] as const

export type NotificationPreferenceKey = (typeof NOTIFICATION_PREFERENCES)[number]['key']

export const MEASUREMENT_UNITS = [
  { value: 'metrisch', label: 'Metrisch (km, °C)' },
  { value: 'imperial', label: 'Imperial (mi, °F)' },
] as const

export type MeasurementUnit = (typeof MEASUREMENT_UNITS)[number]['value']

export interface AppPreferences {
  notifications: Record<NotificationPreferenceKey, boolean>
  units: MeasurementUnit
}

export const emptyAppPreferences: AppPreferences = {
  notifications: {
    priceAlerts: true,
    newOffers: true,
    tripUpdates: true,
  },
  units: 'metrisch',
}
