# Zeitplan travix.ai

Zuletzt aktualisiert: 2026-08-09 von Lina

## Annahmen (bitte bestätigen)
- Tempo: Teilzeit, grob 10-15 Std./Woche, KI-unterstützt. Reine Annahme,
  keine bekannte Tatsache über Nis Kapazität — bei Abweichung bitte
  korrigieren, dann werden alle Daten neu gerechnet.
- Scope jetzt: **voller PRD-Funktionsumfang** (`tasks/tasks-prd-travix-platform.md`),
  nicht mehr nur MVP — auf Wunsch von Ni. Das verschiebt den vorherigen
  MVP-Vorschlag (04.10.) auf das neue Zieldatum unten.

## Release-Datum
**1. Dezember 2026** (~16 Wochen ab heute, 09.08.2026)

## Wie diese Datei zu benutzen ist
Jeder Punkt unten ist einem Bereich zugeordnet (Programmierung/IT-Chef,
Marketing/Marketing-Chef, Support & Recht/Support-Chef). Jeder Agent —
egal ob im Gespräch mit Ni oder im autonomen Tageslauf (siehe
`.claude/skills/it-chef-eigen/SKILL.md`) — kann sich in seinem Bereich den
nächsten offenen Punkt vornehmen. Aufgaben-Nummern (z.B. "5.4") verweisen
auf `tasks/tasks-prd-travix-platform.md` für die volle Detailbeschreibung.

Status-Symbole: ✅ fertig · 🟢 läuft/gestartet · 🟡 teilweise fertig ·
⚪ noch nicht gestartet · 🔴 blockiert/verzögert

---

## Programmierung (IT-Chef)

### Ist-Stand (Phase 1, 3, 4 — Details in tasks-prd-travix-platform.md)
- ✅ Phase 1 Scaffolding (Vite, Tailwind, shadcn/ui, Routing)
- ✅ Phase 3 Layout/Navigation (inkl. Seitenübergangs-Animationen, heute
  vom autonomen IT-Chef-Lauf auf Branch `it-chef/auto` erledigt — noch
  nicht nach `main` gemerged)
- 🟡 Phase 4 KI-Chat — UI komplett fertig (4.4-4.14), läuft aber noch auf
  lokalem Mock-Advisor statt echter KI (4.1-4.3 offen, s.u.)
- 🟡 Phase 5 Suche — Flugsuche (5.8, 5.9, 5.11) und Hotelsuche (5.1-5.3,
  5.6) fertig und mit echten Duffel-Testdaten verbunden; Zug/Bus/Fähre:
  5.4 (`TrainCard.tsx`) und 5.5 (`TrainResults.tsx`) vom autonomen
  IT-Chef-Lauf auf Branch `it-chef/auto` erledigt, aber noch nicht in
  den KI-Chat eingebunden (5.7 offen); 5.10 (Backend-Stub)
  anders gelöst über Vite-Proxy statt Base44
- 🟡 Phase 6 Buchungsseite — Grundgerüst mit editierbaren Sektionen steht
  (6.1-6.5, 6.11, 6.13), manueller Bearbeitungsmodus für Aktivitäten
  (6.12) seit 17.08. ebenfalls fertig, aber Kostenübersicht (6.6, 6.7) und
  Checkliste (6.8-6.10) fehlen noch
- ⚪ Phase 2 Auth/Backend — nicht begonnen, blockiert von Backend-Entscheidung
- 🟡 Phase 7 Trip-Lifecycle — Meine-Reisen mit Demo-Daten (7.5),
  `calculateProgress.ts` (7.1) und die Entwürfe-Seite (7.2) stehen;
  Kartenansicht (7.14) zeigt seit 11.08. den echten im KI-Chat geplanten
  Trip statt Demo-Koordinaten; Favoriten-Seite (7.9) seit 11.08. und
  Preisalarme-Seite (7.10) sowie Angebote-Seite (7.8) seit 12.08. mit
  Demo-Daten und funktionierendem Entfernen-Button; 7.3 (Entwurfs-Aktionen
  pausieren/duplizieren/abschließen/löschen) seit 16.08. ebenfalls fertig;
  Rest (7.4, 7.6, 7.7, 7.11-7.13, 7.15) komplett offen
- 🟡 Phase 8 Urlaubsmodus & Konto — Urlaubsmodus-Grundgerüst mit
  Concierge-Chat steht (Teil von 8.1, 8.3), Rest (8.2, 8.4-8.13) offen

### Sprint 1 — Fundament (KW33-34, 11.-24. Aug)
- [ ] Backend-Entscheidung treffen: Base44 vs. Alternative (Supabase,
  eigenes Backend) — **Produktentscheidung, nicht autonom fällbar**
- [ ] 4.1 `FULL_TRIP_SCHEMA` in `src/lib/ai/schemas.ts`
- [ ] 4.2 System-Prompts in `src/lib/ai/prompts.ts`
- [ ] 4.3 Echter `invokeLLM.ts`-Wrapper — ersetzt `mockAdvisor.ts`
- [x] 5.4 `TrainCard.tsx` (Zug/Bus/Fähre-Verbindung) — Kartenkomponente steht,
  inkl. `src/types/trains.ts` (`TrainOffer`); noch nicht in KI-Chat
  eingebunden (5.7 offen)
- [x] 5.5 `TrainResults.tsx` — Listenansicht steht (analog zu
  `HotelResults.tsx`), noch nicht in KI-Chat eingebunden (5.7 offen)
- [x] 5.11 Flugauswahl korrekt ins Trip-Transport-Objekt integrieren —
  `FlightCard.tsx` hat jetzt einen "Auswählen"-Button (analog zu
  `HotelCard.tsx`), Auswahl auf der eigenständigen `/flugsuche`-Seite
  schreibt `transportMode: 'flight'` in den bestehenden Trip via neuer
  `updateStoredTrip()`-Funktion in `tripStorage.ts`; kein neues Datenfeld
  für Flugdetails (Route/Preis) eingeführt, das wäre über die
  Aufgabenbeschreibung hinausgegangen

### Sprint 2 — Buchungsseite vervollständigen (KW35-36, 25. Aug - 7. Sep)
- [ ] 6.6 `CostBreakdown.tsx` — echte Kostenübersicht nach Kategorie
- [ ] 6.7 `calculateCosts.ts` — Neuberechnung bei Änderungen
- [ ] 6.8 `ChecklistPanel.tsx` (13-Punkte-Checkliste)
- [ ] 6.9 `checklistRules.ts` — Auto-Erkennung aus Trip-Daten
- [x] 6.12 `EditMode.tsx` — vom autonomen IT-Chef-Lauf am 17.08. umgesetzt:
  Dialog zum manuellen Hinzufügen/Entfernen von Aktivitäten und
  Preisanpassung, direkt in die "Aktivitäten"-Sektion von `Buchung.tsx`
  eingebaut. Bewusst ohne Kostenübersicht nach Kategorie (das bleiben 6.6/
  6.7) — nur der `activities`-Teil, für den `TripDraft` bereits ein
  Preisfeld hat. Änderungen werden über die bestehende
  `updateStoredTrip()`-Funktion echt gespeichert (kein Demo-State wie bei
  7.3), da für den einen aktiven Chat-Trip bereits echte Speicherung
  existiert.
- [ ] 2.x Auth & Nutzerkonten (abhängig von Backend-Entscheidung)

### Sprint 3 — Trip-Lifecycle-Seiten (KW37-39, 8.-28. Sep)
- [x] 7.1 `calculateProgress.ts` — vorgezogen vom autonomen IT-Chef-Lauf am
  10.08., da Sprint 1 an blockierten/Produktentscheidungs-Punkten hing;
  reine Berechnungsfunktion, noch nicht in eine Seite eingebunden
- [x] 7.2 `Reiseentwuerfe.tsx` (`/entwuerfe`) — Entwurfskarten mit
  Demo-Daten (analog `MeineReisen.tsx`), echtem Fortschrittsbalken über
  `calculateProgress` (7.1); 7.4 (echte Wiederaufnahme mit Chat-Historie)
  bleibt eigener offener Punkt, "Planung fortsetzen" verlinkt vorerst nur
  auf `/ki-chat`
- [x] 7.10 `Preisalarme.tsx` (`/preisalarme`) — Kartenliste mit
  Demo-Preisalarmen (analog `Favoriten.tsx`), Zielpreis-Badge und
  sachlicher Preisänderungs-Hinweis statt künstlicher Dringlichkeit,
  ermutigender Leer-Zustand nach `MARKENDESIGN.md`
- [x] 7.3 Entwurfs-Aktionen: pausieren, duplizieren, abschließen, löschen —
  vom autonomen IT-Chef-Lauf am 16.08. direkt in `Reiseentwuerfe.tsx`
  ergänzt (lokaler Demo-State, gleiches Muster wie der Entfernen-Button
  bei Favoriten/Preisalarme/Angebote). "Abschließen" setzt nur einen
  lokalen Status ("Abgeschlossen"), verschiebt den Entwurf nicht nach
  `MeineReisen.tsx` — dafür fehlt noch echte, geteilte Trip-Speicherung
  (hängt an der offenen Backend-Entscheidung)
- [ ] 7.4 "Planung fortsetzen" — KI-Chat mit voller Historie am
  Unterbrechungspunkt fortsetzen
- [ ] 7.6 Warenkorb — echte Funktionalität (bisher nur Platzhalter-Route)
- [ ] 7.7 Dashboard
- [x] 7.8 `Angebote.tsx` (`/angebote`) — Kartenliste mit Demo-Angeboten
  (analog `Favoriten.tsx`/`Preisalarme.tsx`), Typ-Badge (Flug/Unterkunft),
  Ziel, kurze Zusammenfassung statt vollem erfundenem Angebotsdatensatz
  (SavedOffer.offer_data ist im PRD-Schema unstrukturiert), Preis,
  Entfernen-Button, ermutigender Leer-Zustand nach `MARKENDESIGN.md`
- [x] 7.9 `Favoriten.tsx` (`/favoriten`) — vom autonomen IT-Chef-Lauf am 11.08.
  gebaut: Karten-Grid mit Ziel/Land/Notiz, Herz-Button zum Entfernen (rein
  lokaler State, noch keine echte Speicherung), ermutigender Leerzustand
  laut `MARKENDESIGN.md`, sobald alle entfernt sind. Demo-Ziele (Kapstadt,
  Reykjavik) aus dem bestehenden Inspirations-Set von `Home.tsx`
  übernommen statt neu erfunden. Echte Persistenz folgt mit dem Favorite-
  Entity, sobald die Backend-Entscheidung gefallen ist
- [ ] 7.11 Reisekalender, 7.12 Reisebudget (Recharts)
- [x] 7.14 `Kartenansicht.tsx` (`/karte`) — React-Leaflet-Karte, seit
  11.08. mit dem echten im KI-Chat geplanten Reiseziel verbunden statt
  fester Demo-Orte: zeigt den Teal-Marker für das im Chat gespeicherte
  Ziel (über dieselbe kuratierte Koordinatenliste, die auch die echte
  Duffel-Suche nutzt), sonst einen ehrlichen Leer-/Hinweiszustand statt
  erfundener Orte. Zusätzlich eine textliche Liste darunter, da
  Kartenmarker allein für Screenreader nicht zugänglich sind. Kartenbasis
  dezent/hell (CartoDB Positron) statt der bunteren Standard-OSM-Kacheln,
  gemäß Design-Vorgabe in `MARKENDESIGN.md` ("dezente, nicht zu bunte
  Kartenbasis")
- [ ] 7.13 Aktivitäten, 7.15 ReiseSuche

### Sprint 4 — Urlaubsmodus & Konto (KW40-42, 29. Sep - 19. Okt)
- [ ] 8.2 Foto-Upload + Vision-Analyse
- [ ] 8.3 Vollständig kontextbezogene Antworten (Tagesitinerar, nicht nur
  Zielort — aktuell nur einfache Concierge-Fakten)
- [ ] 8.4 Quick-Action-Buttons (Restaurant finden, Schild übersetzen, Route)
- [ ] 8.5, 8.6, 8.7 Deal Finder
- [ ] 8.8 Profil, 8.10 Einstellungen, 8.11 Hilfe
- [ ] 8.9 Premium, 8.12 Rewards/Loyalty

### Sprint 5 — Duffel Stays & Zahlungsprozess (KW43-44, 20. Okt - 2. Nov)
- [ ] Duffel Stays live schalten, sobald Duffel den Account freigibt
  (externe Abhängigkeit — falls bis hier nicht freigeschaltet, Platzhalter
  bleibt bestehen und wird nach Launch nachgezogen)
- [ ] Entscheidung + Umsetzung: eigener Zahlungsprozess ODER weiterhin
  Verlinkung "Beim Anbieter buchen" — **Produktentscheidung**, hat
  direkte rechtliche Folgen (Widerrufsrecht etc.), siehe Support-Track
- [ ] 8.13 Unit-Tests für calculateProgress, calculateCosts,
  checklistRules, Schema-Validierung

### Sprint 6 — Testing, Politur, Launch-Vorbereitung (KW45-47, 3.-23. Nov)
- [ ] End-to-End-Testing aller Flows (Chat → Buchungsseite → Urlaubsmodus)
- [ ] Mobile-Politur, Barrierefreiheit-Check
- [ ] Bugfixing-Durchgang
- [ ] Performance-Check (Ladezeiten, Bundle-Größe)

### Launch-Woche (24.-30. Nov) → **Release 01.12.2026**

---

## Marketing (Marketing-Chef)

### Sprint 1 (KW33, 11.-17. Aug)
- [x] Positionierung & Zielgruppen final festlegen (von Ni am 10.08.
  bestätigt, siehe `MARKENDESIGN.md`)

### Sprint 2 (KW34, 18.-24. Aug)
- [ ] Landingpage/Warteliste live (unabhängig vom Hauptprodukt umsetzbar)

### Sprint 3 (KW35-36, 25. Aug - 7. Sep)
- [ ] Content-Plan erstellen (Themen, Formate, Kanäle)
- [ ] Erste Content-Stücke produzieren (Blog/Social)

### Sprint 4 (KW37-40, 8. Sep - 5. Okt)
- [ ] Laufende Content-Produktion
- [ ] Community/Warteliste aufbauen

### Sprint 5 (KW41-42, 6.-19. Okt)
- [ ] Kampagnen-Konzepte für Google/Meta/TikTok Ads (Performance-Teil des
  Skills nutzen — Kampagnenstruktur, Zielgruppen, Anzeigentexte)

### Sprint 6 (KW43-45, 20. Okt - 9. Nov)
- [ ] Test-Kampagnen mit kleinem Budget starten, Learnings sammeln

### Sprint 7 (KW46-47, 10.-23. Nov)
- [ ] Launch-Kampagne vorbereiten
- [ ] Presse-/Multiplikatoren-Kontakte aufbauen

### Launch-Woche
- [ ] Kampagne live schalten

---

## Support & Rechtliches (Support-Chef)

### Sprint 1 (KW33, 11.-17. Aug)
- [ ] Support-E-Mail live (in Arbeit, iCloud-Alias-Weg)

### Sprint 2 (KW34-35, 18. Aug - 31. Aug)
- [ ] FAQ/Hilfe-Inhalte erarbeiten (Basis für 8.11 Hilfe-Seite —
  Abstimmung mit IT-Chef zu Umsetzung)

### Sprint 3 (KW36-38, 1.-21. Sep)
- [ ] Support-Triage in echtem Einsatz testen, sobald Postfach aktiv ist
- [ ] Reibungspunkt-Analyse an neuen Seiten aus Sprint 2/3 (IT)

### Sprint 4 (KW39-44, 22. Sep - 2. Nov)
- [ ] Laufende UX-Reibungspunkt-Analyse parallel zur Feature-Entwicklung
- [ ] **Rechtliches: Impressum, Datenschutzerklärung, AGB** — Pflicht vor
  Live-Schaltung in DE/EU. Kein Anwalt im Team — Ni muss das über einen
  Generator-Dienst oder echten Anwalt klären, besonders falls ein eigener
  Zahlungsprozess kommt (Widerrufsrecht bei Reiseleistungen ist
  komplexer als bei normalem E-Commerce)

### Sprint 5 (KW45-47, 3.-23. Nov)
- [ ] Playbooks für Support-Ansturm nach Launch vorbereiten
- [ ] Eskalationswege festlegen (was braucht Nis Aufmerksamkeit vs. was
  kann Support-Chef eigenständig beantworten)

---

## Offene Entscheidungen, die Ni treffen muss
Diese Punkte kann kein Agent autonom entscheiden — sie brauchen Nis
Input, bevor die jeweiligen Programmierungs-Sprints starten können:
1. Backend-Anbieter (Base44 vs. Alternative) — blockiert Sprint 1 (KI)
   und Sprint 2 (Auth)
2. Eigener Zahlungsprozess oder weiter "Beim Anbieter buchen"? —
   blockiert Sprint 5 und hat direkte rechtliche Folgen
3. Wochenstunden-Annahme (10-15 Std./Woche) bestätigen oder korrigieren
