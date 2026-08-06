# PRD: Travix Platform

## 1. Introduction / Overview

Travix is an AI-powered travel platform that acts as a personal travel advisor — from initial inspiration through end-to-end booking. The platform combines conversational AI planning, real-time offer search, interactive trip management, and on-trip support into a single cohesive experience.

**Problem:** Travel planning today is fragmented across dozens of websites, apps, and services. Travelers manually compare flights, trains, hotels, activities, and car rentals — often losing track of options, budgets, and preferences. Existing tools focus on a single booking category or lack the intelligence to adapt to a traveler's real wishes.

**Goal:** Build a greenfield web application where users can plan, manage, and book entire trips through a single AI assistant that respects their preferences strictly, uses only real data, and never loses their work.

**Target audience:**
- Leisure travelers (couples, families, solo) seeking a personalized, stress-free planning experience
- Users who value transparency (real offers, no fabricated data)
- Travelers who want to resume interrupted planning sessions at any time

**Core principles (must be enforced across all features):**
1. **User wishes are sacred** — Transport mode, budget, dates, and accommodation type are never overridden.
2. **No fabricated data** — All offers come from live internet search; if no results exist, Travix says so honestly.
3. **Conversational, step-by-step** — The AI asks one question at a time.
4. **Never lose work** — Interrupted sessions auto-save as drafts with full chat history.
5. **Everything is interactive** — Every trip component is clickable and editable through the AI chat.

---

## 2. Goals

| # | Goal | Success Indicator |
|---|------|-------------------|
| G1 | Users can plan a complete trip through conversational AI | User completes trip plan with transport, accommodation, and at least one activity |
| G2 | Transport mode preferences are always respected | 100% compliance — train requests never show flights |
| G3 | All search results are real and verifiable | Zero fabricated offers; all items link to provider URLs |
| G4 | Interrupted sessions are fully recoverable | Draft resume restores exact chat history and trip state |
| G5 | Users can view and edit trip components interactively | Every section on BuchungsSeite is clickable and opens contextual KI-Chat |
| G6 | On-trip support is available via Holiday Mode | Active trip users can get AI assistance and analyze photos |
| G7 | Users can manage full trip lifecycle | Drafts, booked trips, cart, favorites, and price alerts all functional |
| G8 | Platform is responsive on mobile and desktop | All 20+ pages render correctly on both form factors |

---

## 3. User Stories

### Planning & AI Chat
- **US-01:** As a leisure traveler, I want to describe my trip in natural language so that I don't have to fill out complex forms.
- **US-02:** As a train traveler, I want Travix to show only train connections when I say "train to Paris" so that my transport preference is respected.
- **US-03:** As a planner, I want the AI to ask one question at a time so that I'm not overwhelmed.
- **US-04:** As a user, I want to use voice input and hear spoken responses so that I can plan hands-free.
- **US-05:** As a user, I want quick reply suggestions so that I can respond faster to common questions.
- **US-06:** As a user, I want to see a trip summary card during chat so that I can save and view my plan at any point.

### Search & Offers
- **US-07:** As a user, I want to compare at least 3 real hotels with full details so that I can make an informed choice.
- **US-08:** As a user, I want to see real train/bus/ferry connections with times, prices, and operators so that I can plan ground transport.
- **US-09:** As a user, I want to search flights via a wizard with IATA codes so that I can add flights to my trip.
- **US-10:** As a user, I want honest feedback when no results are found so that I'm not misled by fake data.

### Trip Plan & Checklist
- **US-11:** As a user, I want an interactive trip plan page where every component is clickable so that I can edit any part via chat.
- **US-12:** As a user, I want a 13-point checklist that auto-detects completion so that I know what's left to plan.
- **US-13:** As a user, I want a real-time cost breakdown so that I can track my budget as I add items.
- **US-14:** As a user, I want "Beim Anbieter buchen" buttons so that I can complete bookings on provider sites.

### Drafts & Persistence
- **US-15:** As a user, I want my chat and trip data auto-saved when I leave so that I never lose progress.
- **US-16:** As a user, I want to see all my drafts with progress bars and status badges so that I can prioritize planning.
- **US-17:** As a user, I want to resume a draft exactly where I left off so that I don't repeat questions.

### On-Trip & Deals
- **US-18:** As a traveler on vacation, I want AI support based on my active trip so that I get context-aware help.
- **US-19:** As a traveler, I want to upload photos (menus, signs) for AI analysis so that I understand my surroundings.
- **US-20:** As a deal hunter, I want an autonomous agent to find flight/hotel deals so that I save money.

### Trip Management & Account
- **US-21:** As a user, I want a dashboard overview of trips, budgets, and favorites so that I have a central hub.
- **US-22:** As a user, I want a booking cart with grouped summaries so that I can track all items before booking.
- **US-23:** As a user, I want to save favorite destinations and set price alerts so that I can monitor deals.
- **US-24:** As a user, I want to set travel preferences in my profile so that the AI personalizes recommendations.

---

## 4. Functional Requirements

### FR-1xx: Authentication & User Profile

- **FR-101:** The system must authenticate users via Base44 built-in auth (sign up, sign in, sign out).
- **FR-102:** The system must provide a profile page (`/profil`) where users can view and edit travel preferences: travel styles, budget range, dietary restrictions, and home airport.
- **FR-103:** The system must provide a settings page (`/einstellungen`) for app preferences and notification settings.
- **FR-104:** The system must provide a help page (`/hilfe`) with FAQ and support information.
- **FR-105:** The system must enforce row-level security (RLS) on all user-specific entities using `created_by_id: {{user.id}}` on create, read, update, and delete operations.
- **FR-106:** The system must support a Travix Premium subscription tier page (`/premium`) with tier benefits displayed.
- **FR-107:** The system must display a rewards/loyalty program section within the user profile or dashboard.

### FR-2xx: KI-Chat & AI Engine

- **FR-201:** The system must provide a messenger-style chat interface at `/ki-chat` with message bubbles, timestamps, and scroll-to-bottom behavior.
- **FR-202:** The system must display an animated Travix avatar with states: greeting, thinking, writing, searching, happy, and error.
- **FR-203:** The AI must ask exactly one question at a time during trip planning dialogue.
- **FR-204:** The AI must strictly enforce transport mode: if the user requests train, only train connections are shown; same for flight, bus, ferry, and car rental.
- **FR-205:** The AI must use `InvokeLLM` with model `gemini_3_flash` and `add_context_from_internet` for all offer searches.
- **FR-206:** The AI must never fabricate offers, hotels, train connections, or prices. If no results exist, it must communicate this honestly and suggest alternatives.
- **FR-207:** The system must support voice input via browser speech recognition and `TranscribeAudio`.
- **FR-208:** The system must support text-to-speech output via `GenerateSpeech` and browser SpeechSynthesis API.
- **FR-209:** The system must display context-aware quick reply suggestion chips below the chat input.
- **FR-210:** The system must display a trip summary card inline during chat with a "save & view" action that navigates to the trip plan.
- **FR-211:** The AI response must conform to `FULL_TRIP_SCHEMA` JSON structure containing: reply text, trip object (offers, transport, accommodation, itinerary, total_cost, pre_trip), and optional flight_search parameters.
- **FR-212:** The system must persist chat history to the Trip entity on component unmount via refs and cleanup useEffect (auto-save).
- **FR-213:** The system must trigger auto-save on page leave, tab close, and navigation away from the chat.

### FR-3xx: Real Search (Hotels, Trains, Flights)

- **FR-301:** The system must search and display a minimum of 3 real hotels per search with: name, star rating, user rating, review count, price per night, total price, location, distance to station/airport, room categories, breakfast included, amenities, cancellation policy, multiple images (Unsplash), and direct booking URL.
- **FR-302:** Hotels must be displayed as comparable selection cards; selecting one auto-integrates it into the trip's accommodation.
- **FR-303:** The system must search real train/bus/ferry connections with: departure/arrival stations, times, duration, transfers, operator, price, available classes, and baggage info.
- **FR-304:** When no train/bus/ferry connection is found, the system must display an honest message and suggest alternatives (different dates, nearby stations, alternative transport modes if user permits).
- **FR-305:** The system must provide a flight search wizard at `/flugsuche` and within the KI-Chat flow with: IATA code resolution for origin/destination, passenger details (ages), cabin class selection, and one-way/round-trip toggle.
- **FR-306:** Selected flights must auto-integrate into the trip plan's transport section.
- **FR-307:** The Duffel flight API backend integration must be implemented as a stub/function ready for deployment when Builder+ subscription is available.

### FR-4xx: Interactive Trip Plan (BuchungsSeite)

- **FR-401:** The system must provide an interactive trip plan page at `/buchung` that is dynamic, not static.
- **FR-402:** The trip plan must display sections for: Flights, Trains, Hotels, Car Rentals, and Activities — each with appropriate icons.
- **FR-403:** Empty sections must show placeholder text (e.g., "Noch kein Hotel ausgewählt") with a "+ Suchen" button that opens KI-Chat with pre-loaded context for that component.
- **FR-404:** Each trip item must have a "Beim Anbieter buchen" button that opens the provider's booking URL in a new tab.
- **FR-405:** The system must support manual edit mode: add/remove activities, adjust prices.
- **FR-406:** The system must display a total cost breakdown by category: transport, accommodation, activities, car rental.
- **FR-407:** Cost totals must recalculate in real time when items are added or removed.
- **FR-408:** Clicking any trip component must open KI-Chat with context about that specific item for editing.

### FR-5xx: Trip Checklist

- **FR-501:** The system must provide a 13-point interactive checklist covering: outbound flight, return flight, accommodation, activities, car rental, restaurants, insurance, travel documents, packing, airport transfer, and additional planning items.
- **FR-502:** Checklist items must auto-detect completion status from trip data (e.g., hotel exists → accommodation marked done).
- **FR-503:** Each checklist item must be clickable and open KI-Chat to plan that specific component.
- **FR-504:** The checklist must include a "Mit Travix weiterplanen" button for full trip editing via chat.

### FR-6xx: Auto-Save & Drafts (Reiseentwürfe)

- **FR-601:** The system must auto-save chat history and trip data to the Trip entity on session interruption.
- **FR-602:** The drafts page at `/entwuerfe` must display: trip destination, image, budget, dates, progress bar (%), and status badges (e.g., "🚆 Zug ✓ / 🏨 Hotel offen / 🎟️ Aktivitäten offen").
- **FR-603:** Progress percentage must be calculated based on completed planning components (transport, accommodation, activities, etc.).
- **FR-604:** Each draft must have a "Planung fortsetzen" button that resumes KI-Chat with full history at the exact point of interruption.
- **FR-605:** Users must be able to pause, duplicate, finalize, or delete drafts.
- **FR-606:** Trip status must support values: `draft`, `paused`, `planned`, `booked`.

### FR-7xx: Holiday Mode (Urlaubsmodus)

- **FR-701:** The system must provide an on-trip AI support page at `/urlaubsmodus` tied to the user's active/booked trip.
- **FR-702:** The system must support photo/image upload for AI analysis using InvokeLLM vision (e.g., restaurant menus, landmarks, signs).
- **FR-703:** AI responses in Holiday Mode must be context-aware based on the active trip's destination, dates, and itinerary.
- **FR-704:** The page must display the daily itinerary and provide quick action buttons (e.g., find restaurant, translate sign, get directions).

### FR-8xx: Deal Finder Agent

- **FR-801:** The system must provide a deal finder chat at `/deal-finder` powered by an autonomous AI agent with web search capabilities.
- **FR-802:** The agent must find deals on flights, hotels, and travel packages.
- **FR-803:** The system must support WhatsApp/Telegram channel integration for deal notifications (architecture stub; full integration depends on third-party API setup).

### FR-9xx: Trip Management Pages

- **FR-901:** The system must provide a home/landing page at `/` with hero section, chat planner entry, featured destinations, and offers.
- **FR-902:** The system must provide a trip planning search page at `/reise-planen`.
- **FR-903:** The system must provide a dashboard at `/dashboard` showing overview of trips, budgets, favorites, and loyalty points.
- **FR-904:** The system must provide a booked trips page at `/meine-reisen` for confirmed trips.
- **FR-905:** The system must provide a saved offers page at `/angebote`.
- **FR-906:** The system must provide a favorites page at `/favoriten` for saved destinations.
- **FR-907:** The system must provide a price alerts page at `/preisalarme` for destination price monitoring.
- **FR-908:** The system must provide a trip calendar at `/kalender` showing all trips on a calendar view.
- **FR-909:** The system must provide a budget page at `/budget` with cost breakdown charts (Recharts).
- **FR-910:** The system must provide an activities page at `/aktivitaeten` with aggregated activities across all trips.
- **FR-911:** The system must provide an interactive map at `/karte` using React-Leaflet with trip destination markers.

### FR-10xx: Cart, Favorites & Price Alerts

- **FR-1001:** The system must provide a booking cart at `/warenkorb` with grouped item summaries and real-time totals.
- **FR-1002:** Cart items must support types: flight, hotel, activity, transport, insurance.
- **FR-1003:** The system must allow users to save travel offers to the SavedOffer entity.
- **FR-1004:** The system must allow users to create price alerts on the PriceAlert entity with destination and target price.
- **FR-1005:** The system must allow users to save destinations to the Favorite entity.

---

## 5. Non-Goals (Out of Scope)

- **NG-01:** Direct in-app booking/payment processing — users are redirected to provider websites.
- **NG-02:** Fabricated or placeholder offer data — all results must come from real search.
- **NG-03:** Multi-question chat bursts — AI must always ask one question at a time.
- **NG-04:** Push notifications (v1) — in-app notification on reopen is the alternative.
- **NG-05:** Background processing for long-running searches without Builder+ backend functions.
- **NG-06:** Full Duffel API deployment without Builder+ subscription (stub only).
- **NG-07:** Native mobile apps — web-only (responsive) for v1.
- **NG-08:** Multi-language support beyond German UI text (v1 is German-first).

---

## 6. Design Considerations

### Color Palette
- Navy: `#0A2342` (primary background, headers)
- Teal: `#00C2A8` (accent, CTAs, success states)
- Gold: `#F4B400` (highlights, premium badges)
- Slate neutrals for text and borders

### Typography
- **Sora** — headings and display text
- **Inter** — body text

### UI Style
- Clean, modern, premium travel aesthetic
- Glassmorphism accents on cards and overlays
- Rounded corners, soft shadows
- shadcn/ui component library as base
- Framer Motion for page transitions and avatar animations
- lucide-react for icons

### Layout
- Collapsible sidebar navigation on desktop
- Bottom navigation or hamburger menu on mobile
- Full responsive support for all 20+ pages

### Avatar States
The Travix avatar must visually indicate: greeting (wave), thinking (dots/spinner), writing (typing), searching (magnifier), happy (smile), error (concerned).

---

## 7. Technical Considerations

### Frontend Stack
- React 18+ with Vite
- Tailwind CSS for styling
- shadcn/ui for components
- React Router for routing (20+ routes)
- Framer Motion for animations
- Recharts for budget charts
- React-Leaflet for maps

### Backend (Base44 BaaS)
- Auth: Base44 built-in user authentication
- Database entities: Trip, Cart, SavedOffer, PriceAlert, Favorite, User (built-in)
- RLS: All entities enforce `created_by_id: {{user.id}}`

### AI Integration
- `InvokeLLM` with `gemini_3_flash` model
- `add_context_from_internet` for real-time web search
- `FULL_TRIP_SCHEMA` JSON schema for structured AI responses
- InvokeLLM vision for Holiday Mode photo analysis

### File & Media APIs
- `UploadFile`, `UploadPrivateFile`, `CreateFileSignedUrl` for image uploads
- Unsplash for hotel images in search results

### Speech APIs
- `GenerateSpeech` and `TranscribeAudio` (Base44)
- Browser SpeechSynthesis API as fallback for TTS

### Data Model: Trip Entity (Core)

```
title, destination, country, summary, image_url
budget, currency, duration_days, travelers, start_month, start_date, end_date
highlights[], transport[], accommodation{}, itinerary[]
offers{} — flights, hotels, trains, buses, ferries, car_rentals, activities, departure, reasoning
total_cost{}, pre_trip{}
checklist{} — enabled[], completed[]
chat_history[] — full conversation for session resume
status — draft | paused | planned | booked
created_by_id (RLS)
```

### Other Entities
- **Cart** — type, item_data, price, trip_id, created_by_id
- **SavedOffer** — offer_type, offer_data, destination, created_by_id
- **PriceAlert** — destination, target_price, currency, active, created_by_id
- **Favorite** — destination, country, image_url, notes, created_by_id

### Route Map

| Route | Page Component | Purpose |
|-------|---------------|---------|
| `/` | Home | Landing page |
| `/ki-chat` | KiChat | AI travel advisor |
| `/reise-planen` | ReiseSuche | Trip planning search |
| `/flugsuche` | Flugsuche | Flight search |
| `/buchung` | BuchungsSeite | Interactive trip plan |
| `/urlaubsmodus` | Urlaubsmodus | On-trip AI support |
| `/dashboard` | Dashboard | Overview |
| `/entwuerfe` | Reiseentwuerfe | Draft trips |
| `/meine-reisen` | MeineReisen | Booked trips |
| `/warenkorb` | Warenkorb | Cart |
| `/angebote` | Angebote | Saved offers |
| `/favoriten` | Favoriten | Favorites |
| `/preisalarme` | Preisalarme | Price alerts |
| `/kalender` | Reisekalender | Calendar |
| `/budget` | Reisebudget | Budget charts |
| `/aktivitaeten` | Aktivitaeten | Activities |
| `/karte` | Kartenansicht | Map |
| `/deal-finder` | DealFinderChat | Deal finder |
| `/premium` | Premium | Subscription |
| `/profil` | Profil | Profile |
| `/einstellungen` | Einstellungen | Settings |
| `/hilfe` | Hilfe | Help |

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Draft resume rate | > 60% of drafts resumed | Drafts opened via "Planung fortsetzen" / total drafts |
| Planning completion rate | > 40% of started trips reach "planned" status | Trips with status `planned` / total trips created |
| Transport mode compliance | 100% | Manual QA + automated prompt testing |
| Real data accuracy | 100% of offers link to valid provider URLs | Automated link validation |
| Auto-save reliability | 100% of interrupted sessions preserved | QA: close tab mid-chat, reopen draft |
| Page load performance | < 3s on 3G for core pages | Lighthouse performance score |
| Mobile usability | All pages functional on mobile | Responsive testing on iOS/Android |

---

## 9. Open Questions

| # | Question | Impact |
|---|----------|--------|
| OQ-01 | When will Builder+ subscription be available for Duffel backend deployment? | Blocks full flight search integration |
| OQ-02 | What is the scope of WhatsApp/Telegram integration for Deal Finder — notification only or full chat? | Affects FR-803 implementation depth |
| OQ-03 | What specific features and pricing define Travix Premium tier? | Affects FR-106 and Premium page content |
| OQ-04 | What are the exact rules for loyalty points accrual and redemption? | Affects FR-107 implementation |
| OQ-05 | Should the UI be German-only or support English from v1? | Affects i18n architecture decision |
| OQ-06 | What third-party map tile provider should Leaflet use (OpenStreetMap, Mapbox)? | Affects map page setup |
| OQ-07 | Are there specific insurance providers to integrate for checklist item "insurance"? | Affects checklist → booking flow |

---

*Document version: 1.0 | Created: 2026-08-06 | Source: Travix md product spec*
