import {
  Home,
  MessageCircle,
  Plane,
  BedDouble,
  ClipboardList,
  FileClock,
  Luggage,
  ShoppingCart,
  User,
  Settings,
  HelpCircle,
  Search,
  Sparkles,
  Sun,
  LayoutDashboard,
  Calendar,
  PiggyBank,
  Map,
  Ticket,
  Tag,
  Heart,
  Bell,
  Crown,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  path: string
  label: string
  description: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

// The sidebar on purpose only lists what you can't already reach through
// the KI-Chat conversation itself. Everything else below (extraRoutes)
// still exists as a page — just not as a permanent nav entry — either
// because it's reached contextually (Urlaubsmodus from a booked trip) or
// because the AI chat already covers that job (search, deals, budget, ...).
export const navGroups: NavGroup[] = [
  {
    label: 'Planen',
    items: [
      { path: '/', label: 'Start', description: 'Übersicht und Reiseinspiration', icon: Home },
      { path: '/ki-chat', label: 'KI-Chat', description: 'Dein persönlicher Reiseberater', icon: MessageCircle },
      { path: '/flugsuche', label: 'Flugsuche', description: 'Flüge vergleichen und buchen', icon: Plane },
      { path: '/hotelsuche', label: 'Hotelsuche', description: 'Unterkünfte vergleichen und buchen', icon: BedDouble },
    ],
  },
  {
    label: 'Meine Reise',
    items: [
      { path: '/buchung', label: 'Reiseplan', description: 'Dein interaktiver Buchungsüberblick', icon: ClipboardList },
      { path: '/entwuerfe', label: 'Reiseentwürfe', description: 'Gespeicherte Planungen fortsetzen', icon: FileClock },
      { path: '/meine-reisen', label: 'Meine Reisen', description: 'Gebuchte und bestätigte Reisen', icon: Luggage },
      { path: '/warenkorb', label: 'Warenkorb', description: 'Ausgewählte Leistungen vor der Buchung', icon: ShoppingCart },
    ],
  },
  {
    label: 'Konto',
    items: [
      { path: '/profil', label: 'Profil', description: 'Reisepräferenzen verwalten', icon: User },
      { path: '/einstellungen', label: 'Einstellungen', description: 'App- und Benachrichtigungseinstellungen', icon: Settings },
      { path: '/hilfe', label: 'Hilfe', description: 'FAQ und Support', icon: HelpCircle },
    ],
  },
]

// Still real pages, still routable — just reached contextually (a link from
// within a trip, a chat action) instead of living in the sidebar forever.
export const extraRoutes: NavItem[] = [
  { path: '/urlaubsmodus', label: 'Urlaubsmodus', description: 'KI-Unterstützung während der Reise', icon: Sun },
  { path: '/reise-planen', label: 'Reise suchen', description: 'Neue Reise starten', icon: Search },
  { path: '/deal-finder', label: 'Deal Finder', description: 'Automatische Angebotssuche', icon: Sparkles },
  { path: '/dashboard', label: 'Dashboard', description: 'Alle Reisen, Budgets und Favoriten', icon: LayoutDashboard },
  { path: '/kalender', label: 'Reisekalender', description: 'Alle Reisen im Kalender', icon: Calendar },
  { path: '/budget', label: 'Reisebudget', description: 'Kostenübersicht und Auswertungen', icon: PiggyBank },
  { path: '/karte', label: 'Kartenansicht', description: 'Reiseziele auf der Karte', icon: Map },
  { path: '/aktivitaeten', label: 'Aktivitäten', description: 'Alle geplanten Aktivitäten', icon: Ticket },
  { path: '/angebote', label: 'Angebote', description: 'Gespeicherte Reiseangebote', icon: Tag },
  { path: '/favoriten', label: 'Favoriten', description: 'Gespeicherte Reiseziele', icon: Heart },
  { path: '/preisalarme', label: 'Preisalarme', description: 'Preisänderungen im Blick behalten', icon: Bell },
  { path: '/premium', label: 'Travix Premium', description: 'Vorteile deiner Mitgliedschaft', icon: Crown },
]

export const allNavItems: NavItem[] = navGroups.flatMap((group) => group.items)
export const allRoutes: NavItem[] = [...allNavItems, ...extraRoutes]
