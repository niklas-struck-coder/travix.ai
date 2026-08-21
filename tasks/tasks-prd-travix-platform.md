# Tasks: Travix Platform

Based on PRD: [`prd-travix-platform.md`](prd-travix-platform.md)

## Relevant Files

### Project Config & Scaffolding
- `package.json` - Project dependencies (React, Vite, Tailwind, shadcn/ui, Framer Motion, Recharts, React-Leaflet).
- `vite.config.ts` - Vite build configuration with path aliases.
- `tailwind.config.ts` - Tailwind theme with Travix design tokens (navy, teal, gold).
- `tsconfig.json` - TypeScript configuration.
- `index.html` - HTML entry point with font imports (Sora, Inter).
- `src/main.tsx` - React app entry point.
- `src/App.tsx` - Root component with router provider.
- `src/routes.tsx` - Route definitions for all 20+ pages.
- `src/styles/globals.css` - Global styles, CSS variables, glassmorphism utilities.

### Design System & Layout
- `src/components/ui/` - shadcn/ui components (Button, Card, Input, Dialog, Badge, Progress, etc.).
- `src/components/layout/Sidebar.tsx` - Collapsible sidebar navigation.
- `src/components/layout/MobileNav.tsx` - Mobile bottom/hamburger navigation.
- `src/components/layout/AppShell.tsx` - Main layout wrapper with sidebar + content area.
- `src/components/layout/PageHeader.tsx` - Reusable page header component.
- `src/lib/design-tokens.ts` - Color palette, font, and spacing constants.

### Base44 & Data Layer
- `src/lib/base44/client.ts` - Base44 SDK client initialization.
- `src/lib/base44/auth.ts` - Auth helpers (signIn, signUp, signOut, getCurrentUser).
- `src/lib/base44/entities/trip.ts` - Trip entity CRUD operations.
- `src/lib/base44/entities/cart.ts` - Cart entity CRUD operations.
- `src/lib/base44/entities/savedOffer.ts` - SavedOffer entity CRUD operations.
- `src/lib/base44/entities/priceAlert.ts` - PriceAlert entity CRUD operations.
- `src/lib/base44/entities/favorite.ts` - Favorite entity CRUD operations.
- `src/types/trip.ts` - TypeScript types for Trip, offers, checklist, chat history.
- `src/types/entities.ts` - TypeScript types for Cart, SavedOffer, PriceAlert, Favorite.
- `src/types/ai.ts` - TypeScript types for FULL_TRIP_SCHEMA response.

### AI Engine
- `src/lib/ai/invokeLLM.ts` - InvokeLLM wrapper with gemini_3_flash + add_context_from_internet.
- `src/lib/ai/schemas.ts` - FULL_TRIP_SCHEMA JSON schema definition.
- `src/lib/ai/prompts.ts` - System prompts enforcing transport mode, no fabrication, one-question flow.
- `src/lib/ai/speech.ts` - GenerateSpeech, TranscribeAudio, and browser SpeechSynthesis wrappers.

### Chat Components
- `src/components/chat/KiChat.tsx` - Main chat container component.
- `src/components/chat/ChatMessage.tsx` - Individual message bubble (user/assistant).
- `src/components/chat/ChatInput.tsx` - Text input with voice button and send.
- `src/components/chat/TravixAvatar.tsx` - Animated avatar with 6 states.
- `src/components/chat/QuickReplies.tsx` - Context-aware suggestion chips.
- `src/components/chat/TripSummaryCard.tsx` - Inline trip summary with save & view action.
- `src/hooks/useChat.ts` - Chat state management, message sending, AI response parsing.
- `src/hooks/useAutoSave.ts` - Auto-save chat history and trip data on unmount/navigation.

### Search Components
- `src/components/search/HotelCard.tsx` - Comparable hotel selection card.
- `src/components/search/HotelResults.tsx` - Grid of hotel cards (min 3).
- `src/components/search/TrainCard.tsx` - Train/bus/ferry connection card.
- `src/components/search/TrainResults.tsx` - List of connection cards.
- `src/components/search/FlightWizard.tsx` - Flight search wizard (IATA, passengers, cabin).
- `src/components/search/NoResultsMessage.tsx` - Honest no-results message with alternatives.

### Trip Plan Components
- `src/components/trip/TripPlanPage.tsx` - Interactive BuchungsSeite layout.
- `src/components/trip/TripSection.tsx` - Section wrapper (Flights, Trains, Hotels, etc.).
- `src/components/trip/TripItem.tsx` - Individual trip item with book-at-provider button.
- `src/components/trip/EmptySection.tsx` - Placeholder with "+ Suchen" button.
- `src/components/trip/CostBreakdown.tsx` - Real-time cost breakdown by category.
- `src/components/trip/ChecklistPanel.tsx` - 13-point interactive checklist.
- `src/components/trip/EditMode.tsx` - Manual edit mode for activities and prices.
- `src/lib/trip/calculateProgress.ts` - Progress percentage calculation from trip data.
- `src/lib/trip/calculateCosts.ts` - Real-time cost recalculation logic.
- `src/lib/trip/checklistRules.ts` - Auto-detect checklist completion from trip data.

### Pages
- `src/pages/Home.tsx` - Landing page with hero, chat entry, destinations.
- `src/pages/KiChat.tsx` - AI travel advisor page.
- `src/pages/ReiseSuche.tsx` - Trip planning search page.
- `src/pages/Flugsuche.tsx` - Flight search page.
- `src/pages/BuchungsSeite.tsx` - Interactive trip plan page.
- `src/pages/Urlaubsmodus.tsx` - Holiday mode on-trip support.
- `src/pages/Dashboard.tsx` - Overview dashboard.
- `src/pages/Reiseentwuerfe.tsx` - Draft trips page.
- `src/pages/MeineReisen.tsx` - Booked trips page.
- `src/pages/Warenkorb.tsx` - Booking cart page.
- `src/pages/Angebote.tsx` - Saved offers page.
- `src/pages/Favoriten.tsx` - Favorites page.
- `src/pages/Preisalarme.tsx` - Price alerts page.
- `src/pages/Reisekalender.tsx` - Trip calendar page.
- `src/pages/Reisebudget.tsx` - Budget charts page.
- `src/pages/Aktivitaeten.tsx` - Aggregated activities page.
- `src/pages/Kartenansicht.tsx` - Interactive map page.
- `src/pages/DealFinderChat.tsx` - Deal finder agent page.
- `src/pages/Premium.tsx` - Subscription tier page.
- `src/pages/Profil.tsx` - User profile page.
- `src/pages/Einstellungen.tsx` - Settings page.
- `src/pages/Hilfe.tsx` - Help/FAQ page.

### Hooks
- `src/hooks/useTrip.ts` - Trip entity load/save/update hook.
- `src/hooks/useDrafts.ts` - Draft trips listing and management.
- `src/hooks/useCart.ts` - Cart operations hook.
- `src/hooks/useFavorites.ts` - Favorites CRUD hook.
- `src/hooks/usePriceAlerts.ts` - Price alerts CRUD hook.

### Tests
- `src/lib/trip/calculateProgress.test.ts` - Unit tests for progress calculation.
- `src/lib/trip/calculateCosts.test.ts` - Unit tests for cost recalculation.
- `src/lib/trip/checklistRules.test.ts` - Unit tests for checklist auto-detection.
- `src/lib/ai/schemas.test.ts` - Unit tests for FULL_TRIP_SCHEMA validation.
- `src/components/chat/TravixAvatar.test.tsx` - Avatar state rendering tests.
- `src/components/trip/CostBreakdown.test.tsx` - Cost breakdown display tests.

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx vitest [optional/path/to/test/file]` to run tests. Vite projects typically use Vitest instead of Jest.
- Base44 entity schemas and RLS policies are configured in the Base44 dashboard, not in code files.
- The Duffel flight API backend function is a stub until Builder+ subscription is available.

---

## Tasks

- [x] 1.0 Project scaffolding — Vite + React + Tailwind + shadcn/ui + routing + design tokens
  - [x] 1.1 Initialize Vite + React + TypeScript project with `npm create vite@latest`
  - [x] 1.2 Install and configure Tailwind CSS with Travix design tokens (navy `#0A2342`, teal `#00C2A8`, gold `#F4B400`)
  - [x] 1.3 Install and initialize shadcn/ui component library (Button, Card, Input, Dialog, Badge, Progress, Tabs, Sheet)
  - [x] 1.4 Install dependencies: Framer Motion, Recharts, React-Leaflet, lucide-react, React Router
  - [x] 1.5 Configure Google Fonts (Sora for headings, Inter for body) in `index.html`
  - [x] 1.6 Create `src/styles/globals.css` with CSS variables, glassmorphism utilities, and base styles
  - [x] 1.7 Create `src/lib/design-tokens.ts` with color palette, font, and spacing constants
  - [x] 1.8 Set up React Router in `src/routes.tsx` with placeholder routes for all 20+ pages
  - [x] 1.9 Create `src/App.tsx` and `src/main.tsx` entry points with router provider
  - [x] 1.10 Configure Vitest for unit testing

- [ ] 2.0 Base44 setup — Auth, entities, RLS policies
  - [ ] 2.1 Initialize Base44 SDK client in `src/lib/base44/client.ts`
  - [ ] 2.2 Implement auth helpers in `src/lib/base44/auth.ts` (signIn, signUp, signOut, getCurrentUser)
  - [ ] 2.3 Define Trip entity schema in Base44 dashboard with all fields from PRD data model
  - [ ] 2.4 Define Cart, SavedOffer, PriceAlert, Favorite entity schemas in Base44 dashboard
  - [ ] 2.5 Configure RLS policies on all entities: `created_by_id: {{user.id}}` on CRUD
  - [ ] 2.6 Create TypeScript types in `src/types/trip.ts`, `src/types/entities.ts`, `src/types/ai.ts`
  - [ ] 2.7 Implement Trip CRUD in `src/lib/base44/entities/trip.ts`
  - [ ] 2.8 Implement Cart, SavedOffer, PriceAlert, Favorite CRUD in respective entity files
  - [ ] 2.9 Create auth context/provider for app-wide user state
  - [ ] 2.10 Add protected route wrapper that redirects unauthenticated users

- [x] 3.0 Core layout & navigation — Sidebar, route shells, responsive shell
  - [x] 3.1 Create `AppShell.tsx` layout wrapper with sidebar + main content area
  - [x] 3.2 Create `Sidebar.tsx` with navigation links for all 20+ routes and collapsible behavior
  - [x] 3.3 Create `MobileNav.tsx` with hamburger menu / bottom nav for mobile
  - [x] 3.4 Create `PageHeader.tsx` reusable component with title, breadcrumbs, and actions
  - [x] 3.5 Create placeholder page components for all routes (empty shells with page title) — shared `PlaceholderPage.tsx` driven by `nav-config.ts`, not one file per route
  - [x] 3.6 Implement responsive breakpoints: sidebar visible on desktop, mobile nav on small screens
  - [x] 3.7 Add Framer Motion page transition animations between routes
  - [x] 3.8 Build Home page (`/`) with hero section, chat planner entry point, and featured destinations grid

- [ ] 4.0 KI-Chat & AI engine — Chat UI, avatar, InvokeLLM, FULL_TRIP_SCHEMA, auto-save
  - [ ] 4.1 Create `FULL_TRIP_SCHEMA` JSON schema in `src/lib/ai/schemas.ts` — blocked on Base44/Gemini credentials
  - [ ] 4.2 Write system prompts in `src/lib/ai/prompts.ts` enforcing transport mode, no fabrication, one-question flow — blocked on Base44/Gemini credentials
  - [ ] 4.3 Implement `invokeLLM.ts` wrapper with gemini_3_flash model and add_context_from_internet — blocked on Base44/Gemini credentials; `src/lib/ai/mockAdvisor.ts` stands in for now with the same conversation rules, keyword-matched instead of model-driven
  - [x] 4.4 Build `TravixAvatar.tsx` with 6 animated states (greeting, thinking, writing, searching, happy, error)
  - [x] 4.5 Build `ChatMessage.tsx` for user and assistant message bubbles with timestamps
  - [x] 4.6 Build `ChatInput.tsx` with text input, voice button, and send action
  - [x] 4.7 Build `QuickReplies.tsx` with context-aware suggestion chips
  - [x] 4.8 Build `TripSummaryCard.tsx` with inline trip summary and "save & view" action
  - [x] 4.9 Assemble `KiChat.tsx` main chat container integrating all chat components
  - [x] 4.10 Implement `useChat.ts` hook for message state, sending, and AI response parsing — parses against mock advisor for now, drop-in swap once 4.3 is real
  - [x] 4.11 Implement voice input via browser speech recognition in `src/lib/ai/speech.ts` — browser SpeechRecognition API used instead of Base44 TranscribeAudio (no backend yet)
  - [x] 4.12 Implement text-to-speech output via browser SpeechSynthesis — used instead of Base44 GenerateSpeech (no backend yet)
  - [x] 4.13 Persist chat history and trip data on page leave and reload — implemented inline in `useChat.ts` (localStorage) rather than a separate `useAutoSave.ts` hook
  - [x] 4.14 Wire KiChat page (`/ki-chat`) with trip creation on first message and trip loading for resume

- [ ] 5.0 Real search modules — Hotel cards, train/bus/ferry search, Duffel flight wizard stub
  - [x] 5.1 Build `HotelCard.tsx` displaying all required fields (name, stars, rating, price, amenities, images, booking URL) — implemented with the fields the real Duffel Stays test data actually provides (name, guest rating, address, price, image); no `stars`/`amenities`/booking-URL fields exist on `StayOffer` (`src/types/stays.ts`), so none were added — same "don't fabricate data" rule already applied to `TrainCard`/`FlightCard`
  - [x] 5.2 Build `HotelResults.tsx` grid showing minimum 3 comparable hotel cards — grid component built and used for inline results inside `KiChat.tsx`; the standalone `/hotelsuche` page renders its own equivalent grid directly (see 5.9-analog note in `Flugsuche.tsx`)
  - [x] 5.3 Implement hotel selection flow — selecting a card auto-integrates into trip accommodation — `selectHotel` in `useChat.ts` (chat flow) and `updateStoredTrip` in `Hotelsuche.tsx` (standalone page) both wired
  - [x] 5.4 Build `TrainCard.tsx` with departure/arrival, times, duration, transfers, operator, price, classes
  - [x] 5.5 Build `TrainResults.tsx` list view for train/bus/ferry connections
  - [x] 5.6 Build `NoResultsMessage.tsx` with honest messaging and alternative suggestions — used in `HotelResults`, `FlightResults`, `TrainResults`, `Flugsuche.tsx`, `Hotelsuche.tsx`
  - [ ] 5.7 Integrate hotel and train search results into KI-Chat response rendering
  - [x] 5.8 Build `FlightWizard.tsx` with IATA code inputs, passenger details, cabin class, one-way/round-trip toggle
  - [x] 5.9 Create Flugsuche page (`/flugsuche`) hosting the flight wizard
  - [x] 5.10 Implement Duffel API backend function stub (ready for Builder+ deployment) — solved differently than specified: no Base44/Builder+ function, instead a dev-server middleware (`vite-plugins/duffel-proxy.ts`, wired in `vite.config.ts`) that attaches the secret `DUFFEL_API_KEY` server-side and forwards `/api/duffel/*` requests to `api.duffel.com`, so the key never reaches the browser — `src/lib/duffel/client.ts` already calls only this proxy. `ZEITPLAN.md`'s Ist-Stand paragraph already documented this as "anders gelöst über Vite-Proxy statt Base44"; only the checkbox here was stale, same pattern as 3.0/6.1/6.4/6.5/6.11/6.13/7.5.
  - [x] 5.11 Wire flight selection to auto-integrate into trip transport section

- [ ] 6.0 Interactive trip plan — BuchungsSeite, checklist, cost breakdown, provider links
  - [x] 6.1 Build `TripSection.tsx` wrapper for Flights, Trains, Hotels, Car Rentals, Activities sections — implemented as the inline `Section` component in `src/pages/Buchung.tsx` (not a separate `src/components/trip/TripSection.tsx` file), same divergence pattern as `PlaceholderPage.tsx` in 3.5; wraps Transport/Reisedaten/Budget/Unterkunft/Aktivitäten with icon, title, value, and edit action, matching the functional intent since `TripDraft` models transport as one `transportMode` field rather than separate Flight/Train sections. Checkbox was stale, no code change needed — only the checkbox plus a new test assertion (see 6.3) were added
  - [ ] 6.2 Build `TripItem.tsx` with item details and "Beim Anbieter buchen" button (opens provider URL) — still open: `TripDraft` has no per-item/provider-URL fields yet (same gap noted at 6.12 for cost fields), so this needs real item-level data first, not just a checkbox correction
  - [x] 6.3 Build `EmptySection.tsx` with placeholder text and "+ Suchen" button linking to KI-Chat with context — same inline `Section` component as 6.1: renders `emptyLabel` plus a "+ Suchen" button linking to `/ki-chat` whenever a section has no value. Checkbox was stale; only the checkbox plus a new test in `Buchung.test.tsx` asserting all five "+ Suchen" links were added (previously only the Aktivitäten empty-state text was covered, not the link itself)
  - [x] 6.4 Assemble `TripPlanPage.tsx` (BuchungsSeite) with all sections, making every component clickable — `src/pages/Buchung.tsx` already assembles Transport/Reisedaten/Budget/Unterkunft/Aktivitäten sections, each with a "Bearbeiten" pencil; checkbox was stale, same kind of gap as 7.5/6.11/6.13, no code change needed
  - [x] 6.5 Implement click-to-edit — clicking any trip item opens KI-Chat with pre-loaded context — each section's edit control links to `/ki-chat?edit=<field>` (or, for Transport/Unterkunft, a dialog offering that link alongside the manual search page), and `KiChat.tsx`/`useChat.ts` genuinely read the `edit` query param and pre-load the matching prompt (`editPrompts`); checkbox was stale, no code change needed
  - [ ] 6.6 Build `CostBreakdown.tsx` with real-time totals by category (transport, accommodation, activities, car)
  - [ ] 6.7 Implement `calculateCosts.ts` logic for real-time recalculation on item add/remove
  - [ ] 6.8 Build `ChecklistPanel.tsx` with 13 checklist items (outbound/return flight, accommodation, activities, etc.)
  - [ ] 6.9 Implement `checklistRules.ts` for auto-detecting completion from trip data
  - [ ] 6.10 Wire checklist items to open KI-Chat for planning that specific component
  - [x] 6.11 Add "Mit Travix weiterplanen" button for full trip editing via chat — already present in `Buchung.tsx`'s `PageHeader` actions, linking to `/ki-chat`; checkbox was stale (same kind of gap as 7.5 `MeineReisen`), only the checkbox plus a missing test assertion were added
  - [x] 6.12 Build `EditMode.tsx` for manual add/remove activities and price adjustments — dialog in `src/components/trip/EditMode.tsx`, wired into the "Aktivitäten" section on `Buchung.tsx`; add/remove/price-edit persist via the existing `updateStoredTrip()` (`tripStorage.ts`), no new data field needed since `TripActivity` already has `name`/`price`. Scoped to activities only, without a category cost summary — that's 6.6/6.7 (`CostBreakdown.tsx`/`calculateCosts.ts`), still blocked because `TripDraft` has no price field for transport/accommodation yet
  - [x] 6.13 Create BuchungsSeite page (`/buchung`) wired to active trip data — `src/pages/Buchung.tsx` was already built and wired into `routes.tsx` (`/buchung`), loading the real trip via `loadStoredChat()`; checkbox was stale, same kind of gap as 7.5 `MeineReisen`, no code change needed

- [ ] 7.0 Trip lifecycle pages — Drafts, booked trips, cart, dashboard, calendar, budget, map, favorites, alerts
  - [x] 7.1 Implement `calculateProgress.ts` for draft progress percentage based on completed components — counts the 5 sections shown on the Reiseplan (transport, dates, budget, accommodation, activities); not yet used by any page (7.2 draft cards are the first consumer, still open)
  - [x] 7.2 Build Reiseentwuerfe page (`/entwuerfe`) with draft cards showing destination, image, budget, dates, progress bar, status badges — demo data (gradient placeholder, 2 drafts) analog zu `MeineReisen.tsx`, Fortschritt über `calculateProgress` (7.1); "Planung fortsetzen" verlinkt auf `/ki-chat` (7.4, echte Wiederaufnahme mit Chat-Historie, bleibt eigener offener Punkt), pause/duplicate/finalize/delete (7.3) ebenfalls eigener offener Punkt
  - [x] 7.3 Implement draft actions: pause, duplicate, finalize, delete — added directly to `Reiseentwuerfe.tsx`'s local demo-draft state (pause/resume toggle, duplicate inserts a copy, finalize sets an "Abgeschlossen" status, delete removes the card); no separate action component, same inline pattern as the card itself. "Finalize" only changes the local status badge — there's no shared trip storage yet to move a draft into `MeineReisen.tsx`, so it doesn't attempt that (would be real persistence work tied to the still-open Backend-Entscheidung)
  - [ ] 7.4 Implement "Planung fortsetzen" — resume KI-Chat with full history at interruption point
  - [x] 7.5 Build MeineReisen page (`/meine-reisen`) for booked/confirmed trips — `src/pages/MeineReisen.tsx` was already fully built and wired into `routes.tsx`/`nav-config.ts` (checkbox was simply stale, same kind of gap as the 5.1-5.3/5.6/5.8/5.9 correction on 2026-08-12); demo trips (upcoming/past) with destination, dates, status badge, "Urlaubsmodus aktivieren" only for upcoming trips — no code change, only the checkbox plus a missing test file were added
  - [x] 7.6 Build Warenkorb page (`/warenkorb`) with grouped cart items and real-time totals
  - [ ] 7.7 Build Dashboard page (`/dashboard`) with trips overview, budgets, favorites, loyalty points
  - [x] 7.8 Build Angebote page (`/angebote`) for saved travel offers (SavedOffer entity) — demo data (`initialOffers` in `Angebote.tsx`) until the real SavedOffer entity exists, same placeholder pattern as `Favoriten.tsx`/`Preisalarme.tsx`; `offer_data` is unstructured in the PRD schema, so a short summary string is used per offer instead of inventing a fuller shape (e.g. full flight segments); encouraging empty state per `MARKENDESIGN.md`
  - [x] 7.9 Build Favoriten page (`/favoriten`) for saved destinations (Favorite entity) — demo data (`initialFavorites` in `Favoriten.tsx`) until the real Favorite entity exists, same placeholder pattern as `MeineReisen.tsx`/`Reiseentwuerfe.tsx`; encouraging empty state per `MARKENDESIGN.md`
  - [x] 7.10 Build Preisalarme page (`/preisalarme`) for price monitoring alerts (PriceAlert entity) — demo data (`initialAlerts` in `Preisalarme.tsx`) until the real PriceAlert entity exists, same placeholder pattern as `Favoriten.tsx`; price-change wording and empty state follow `MARKENDESIGN.md` ("sachlich" statt Dringlichkeit)
  - [x] 7.11 Build Reisekalender page (`/kalender`) with calendar view of all trips
  - [ ] 7.12 Build Reisebudget page (`/budget`) with Recharts cost breakdown charts
  - [x] 7.13 Build Aktivitaeten page (`/aktivitaeten`) with aggregated activities across all trips — demo data (`initialActivities` in `Aktivitaeten.tsx`) aggregated from the two demo trips in `MeineReisen.tsx` (Lissabon, Kyoto), same placeholder pattern as `Angebote.tsx`/`Preisalarme.tsx`; destination badge per activity, optional price (mirrors `TripActivity.price`), working remove button, encouraging empty state per `MARKENDESIGN.md`
  - [x] 7.14 Build Kartenansicht page (`/karte`) with React-Leaflet map and trip destination markers
  - [x] 7.15 Build ReiseSuche page (`/reise-planen`) as trip planning search entry point — vom autonomen IT-Chef-Lauf am 21.08. gebaut: `src/pages/ReiseSuche.tsx`, drei Karten (KI-Chat empfohlen/hervorgehoben, Flugsuche, Hotelsuche), jede mit kurzer Beschreibung und Link-Button. Schließt eine echte Lücke: `Home.tsx`s "Selbst durchsuchen"-Button verlinkte bereits auf `/reise-planen`, das bisher nur die `PlaceholderPage` zeigte. Kein Zug/Bus/Fähre-Kärtchen, da dafür noch keine eigenständige Route existiert (5.7 offen, `TrainCard`/`TrainResults` sind bisher nur in den KI-Chat-Flow eingebunden). Keine erfundenen Daten, reine Navigation zu bereits bestehenden Seiten.

- [ ] 8.0 Holiday mode, deal finder, account — Urlaubsmodus, DealFinderChat, profile, Premium, settings
  - [ ] 8.1 Build Urlaubsmodus page (`/urlaubsmodus`) tied to active/booked trip with daily itinerary display
  - [ ] 8.2 Implement photo upload and InvokeLLM vision analysis (menus, landmarks, signs)
  - [ ] 8.3 Implement context-aware AI responses based on active trip destination, dates, and itinerary
  - [ ] 8.4 Add quick action buttons (find restaurant, translate sign, get directions)
  - [ ] 8.5 Build DealFinderChat page (`/deal-finder`) with autonomous AI agent and web search
  - [ ] 8.6 Implement deal results display for flights, hotels, and packages
  - [ ] 8.7 Create WhatsApp/Telegram channel integration architecture stub
  - [x] 8.8 Build Profil page (`/profil`) with travel preferences (styles, budget, dietary, home airport) — `src/pages/Profil.tsx`: travel styles and dietary restrictions as multi-select toggle chips, budget as a four-tier `Select` (sparsam/mittelklasse/komfortabel/luxus, no invented € amounts), home airport as an uppercase 3-letter IATA input matching `FlightWizard.tsx`'s `origin` field. Local demo state only (no persistence across reloads), same placeholder-data pattern as `Favoriten.tsx`/`Preisalarme.tsx`/`Angebote.tsx` — real storage depends on the still-open Backend-Entscheidung
  - [ ] 8.9 Build Premium page (`/premium`) with subscription tier benefits
  - [ ] 8.10 Build Einstellungen page (`/einstellungen`) for app preferences
  - [ ] 8.11 Build Hilfe page (`/hilfe`) with FAQ and support information
  - [ ] 8.12 Implement rewards/loyalty program display in profile or dashboard
  - [ ] 8.13 Write unit tests for calculateProgress, calculateCosts, checklistRules, and schema validation
