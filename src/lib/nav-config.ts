import {
  Home,
  MessageCircle,
  Search,
  Plane,
  Sparkles,
  ClipboardList,
  FileClock,
  Luggage,
  ShoppingCart,
  Sun,
  LayoutDashboard,
  Calendar,
  PiggyBank,
  Map,
  Ticket,
  Tag,
  Heart,
  Bell,
  User,
  Crown,
  Settings,
  HelpCircle,
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

export const navGroups: NavGroup[] = [
  {
    label: 'Planen',
    items: [
      { path: '/', label: 'Start', description: 'Übersicht und Reiseinspiration', icon: Home },
      { path: '/ki-chat', label: 'KI-Chat', description: 'Dein persönlicher Reiseberater', icon: MessageCircle },
      { path: '/reise-planen', label: 'Reise suchen', description: 'Neue Reise starten', icon: Search },
      { path: '/flugsuche', label: 'Flugsuche', description: 'Flüge vergleichen und buchen', icon: Plane },
      { path: '/deal-finder', label: 'Deal Finder', description: 'Automatische Angebotssuche', icon: Sparkles },
    ],
  },
  {
    label: 'Meine Reise',
    items: [
      { path: '/buchung', label: 'Reiseplan', description: 'Dein interaktiver Buchungsüberblick', icon: ClipboardList },
      { path: '/entwuerfe', label: 'Reiseentwürfe', description: 'Gespeicherte Planungen fortsetzen', icon: FileClock },
      { path: '/meine-reisen', label: 'Meine Reisen', description: 'Gebuchte und bestätigte Reisen', icon: Luggage },
      { path: '/warenkorb', label: 'Warenkorb', description: 'Ausgewählte Leistungen vor der Buchung', icon: ShoppingCart },
      { path: '/urlaubsmodus', label: 'Urlaubsmodus', description: 'KI-Unterstützung während der Reise', icon: Sun },
    ],
  },
  {
    label: 'Übersicht',
    items: [
      { path: '/dashboard', label: 'Dashboard', description: 'Alle Reisen, Budgets und Favoriten', icon: LayoutDashboard },
      { path: '/kalender', label: 'Reisekalender', description: 'Alle Reisen im Kalender', icon: Calendar },
      { path: '/budget', label: 'Reisebudget', description: 'Kostenübersicht und Auswertungen', icon: PiggyBank },
      { path: '/karte', label: 'Kartenansicht', description: 'Reiseziele auf der Karte', icon: Map },
      { path: '/aktivitaeten', label: 'Aktivitäten', description: 'Alle geplanten Aktivitäten', icon: Ticket },
    ],
  },
  {
    label: 'Sparen',
    items: [
      { path: '/angebote', label: 'Angebote', description: 'Gespeicherte Reiseangebote', icon: Tag },
      { path: '/favoriten', label: 'Favoriten', description: 'Gespeicherte Reiseziele', icon: Heart },
      { path: '/preisalarme', label: 'Preisalarme', description: 'Preisänderungen im Blick behalten', icon: Bell },
    ],
  },
  {
    label: 'Konto',
    items: [
      { path: '/profil', label: 'Profil', description: 'Reisepräferenzen verwalten', icon: User },
      { path: '/premium', label: 'Travix Premium', description: 'Vorteile deiner Mitgliedschaft', icon: Crown },
      { path: '/einstellungen', label: 'Einstellungen', description: 'App- und Benachrichtigungseinstellungen', icon: Settings },
      { path: '/hilfe', label: 'Hilfe', description: 'FAQ und Support', icon: HelpCircle },
    ],
  },
]

export const allNavItems: NavItem[] = navGroups.flatMap((group) => group.items)
