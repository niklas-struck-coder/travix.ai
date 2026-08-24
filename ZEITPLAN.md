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
  Aktivitäten-Seite (7.13) seit 17.08. ebenfalls mit Demo-Daten und
  Entfernen-Button fertig; Kalender-Seite (7.11) seit 17.08. ebenfalls mit
  Demo-Daten fertig; Warenkorb-Seite (7.6) seit 17.08. ebenfalls mit
  Demo-Daten und gruppierten Positionen fertig; ReiseSuche-Seite (7.15)
  seit 21.08. ebenfalls fertig (auf `it-chef/auto`, noch nicht in `main`
  gemergt); Rest (7.4, 7.7, 7.12) komplett offen
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
  Aufgabenbeschreibung hinausgegangen. Am 24.08. vom autonomen
  IT-Chef-Lauf ergänzt: In `FlightWizard.tsx` blieb der "Flüge
  suchen"-Button unter 3 Zeichen in Von/Nach ohne jede Erklärung
  deaktiviert (vom IT-Chef-Bericht 23.08. gemeldet) — jetzt mit
  Hinweistext "3-stelliger Flughafencode, z. B. BER/LIS" unter beiden
  Feldern.

### Sprint 2 — Buchungsseite vervollständigen (KW35-36, 25. Aug - 7. Sep)
- [ ] 6.2 `TripItem.tsx` mit "Beim Anbieter buchen"-Button — weiterhin offen,
  da `TripDraft` noch keine Item-/Provider-URL-Felder hat (gleiche Lücke
  wie die fehlenden Kostenfelder bei 6.6/6.7/6.12)
- [ ] 6.6 `CostBreakdown.tsx` — echte Kostenübersicht nach Kategorie
- [ ] 6.7 `calculateCosts.ts` — Neuberechnung bei Änderungen
- [x] 6.8/6.9 `ChecklistPanel.tsx` + `checklistRules.ts` — vom autonomen
  IT-Chef-Lauf am 24.08. gebaut: 13-Punkte-Checkliste in `Buchung.tsx`
  eingebunden, unterteilt in fünf automatisch aus den Trip-Feldern
  erkannte Punkte (Transport/Reisedaten/Unterkunft/Aktivitäten/Budget —
  gleiche Felder wie `calculateProgress.ts`) und acht Standard-
  Reisevorbereitungspunkte (Reisepass, Visum, Versicherung usw.), die der
  Reisende manuell abhakt. Bewusst ein einziger "Transport"-Punkt statt
  getrennter Hin-/Rückflug-Punkte, da `TripDraft` nur ein
  `transportMode`-Feld statt separater Hin-/Rückreise-Daten hat. Manuelles
  Abhaken ist reiner lokaler Demo-State ohne Persistenz über Reloads
  hinweg, gleiches Muster wie `Profil.tsx`/`Einstellungen.tsx`, bis die
  echte Nutzerkonten-/Backend-Entscheidung gefallen ist.
- [x] 6.1/6.3 `TripSection.tsx`/`EmptySection.tsx` — vom autonomen IT-Chef-Lauf
  am 18.08. (dritter Lauf) als stale Checkboxen erkannt: beides ist bereits
  als die inline `Section`-Komponente in `Buchung.tsx` vorhanden (Titel/Icon/
  Wert/Bearbeiten-Aktion plus "+ Suchen"-Button im Leerzustand, verlinkt auf
  `/ki-chat`), gleiches Divergenz-Muster wie `PlaceholderPage.tsx` bei 3.5.
  Keine Code-Änderung, nur die Checkboxen plus eine neue Test-Assertion in
  `Buchung.test.tsx`, die bisher ungeprüfte "+ Suchen"-Links für alle fünf
  leeren Sektionen abdeckt.
- [x] 6.4 `Buchung.tsx` komplett zusammengesetzt (alle Sektionen klickbar) —
  vom autonomen IT-Chef-Lauf am 18.08. (zweiter Lauf) als stale Checkbox
  erkannt: Transport/Reisedaten/Budget/Unterkunft/Aktivitäten sind bereits
  alle als eigene, bearbeitbare Sektionen vorhanden. Keine Code-Änderung,
  nur die Checkbox plus vier neue Test-Assertions in `Buchung.test.tsx`.
- [x] 6.5 Klick-zum-Bearbeiten (KI-Chat mit vorgeladenem Kontext) — ebenfalls
  vom autonomen IT-Chef-Lauf am 18.08. (zweiter Lauf) als stale Checkbox
  erkannt und verifiziert: die "Bearbeiten"-Stifte verlinken auf
  `/ki-chat?edit=<feld>`, und `KiChat.tsx`/`useChat.ts` lesen diesen
  Query-Parameter tatsächlich aus und laden den passenden Prompt vor
  (`editPrompts`). Keine Code-Änderung, nur die Checkbox plus Tests.
- [x] 6.11 "Mit Travix weiterplanen"-Button — vom autonomen IT-Chef-Lauf am
  18.08. als stale Checkbox erkannt: Button existiert bereits in
  `Buchung.tsx`s `PageHeader`-Actions (Link zu `/ki-chat`), gleiche Art
  Lücke wie bei 7.5 `MeineReisen.tsx`. Keine Code-Änderung, nur die
  Checkbox plus eine fehlende Test-Assertion in `Buchung.test.tsx` ergänzt.
- [x] 6.13 `BuchungsSeite` (`/buchung`) — ebenfalls stale Checkbox: die Seite
  (`src/pages/Buchung.tsx`) war bereits vollständig gebaut, in
  `routes.tsx` verdrahtet und lädt echte Trip-Daten über
  `loadStoredChat()`. Gleiche Korrektur wie bei 6.11 oben.
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
- [x] 7.6 `Warenkorb.tsx` (`/warenkorb`) — vom autonomen IT-Chef-Lauf am
  17.08. gebaut: Positionen nach Typ gruppiert (Flüge, Unterkünfte,
  Transport, Aktivitäten, Versicherung — Typen laut FR-1002), pro Gruppe
  eine Zwischensumme, unten eine Gesamtsumme; beides über reine
  Hilfsfunktionen in `src/lib/trip/cartTotals.ts` berechnet (mit
  Unit-Tests), sodass Entfernen einer Position Zwischen- und Gesamtsumme
  sofort neu berechnet ("real-time totals" laut FR-1001). Demo-Positionen
  über die zwei Demo-Reisen aus `MeineReisen.tsx` (Lissabon, Kyoto) verteilt,
  gleiches Muster wie bei Angebote/Preisalarme/Aktivitäten. Sachliche
  Preisdarstellung ohne künstliche Dringlichkeit gemäß der
  `MARKENDESIGN.md`-Vorgabe für Warenkorb/Preisalarme. Kein
  Buchungs-/Bezahl-Button (das wäre 6.2 "Beim Anbieter buchen", eigener
  offener Punkt, und ohnehin außerhalb des Scopes laut PRD NG-01). Rein
  lokaler Demo-State, noch keine echte Warenkorb-Speicherung (Cart-Entity
  hängt an der offenen Backend-Entscheidung)
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
- [x] 7.11 `Kalender.tsx` (`/kalender`) — vom autonomen IT-Chef-Lauf am 17.08.
  gebaut: Monats-Kalenderraster (`calculateProgress.ts`-artige reine
  Hilfsfunktionen in `src/lib/trip/calendarUtils.ts`, mit Unit-Tests) plus
  Monatsnavigation, dieselben zwei Demo-Reisen wie `MeineReisen.tsx`
  (Lissabon, Kyoto) jetzt zusätzlich mit strukturiertem Datumsbereich statt
  nur Anzeige-Text, damit sie sich im Raster platzieren lassen. Zellen mit
  Reise farblich markiert, zusätzlich eine textliche Liste darunter (analog
  `Kartenansicht.tsx`), da Kalenderzellen allein für Screenreader nicht
  zugänglich sind. Keine neue Abhängigkeit (kein Kalender-Package),
  ermutigender Leer-Zustand laut `MARKENDESIGN.md` als Fallback vorhanden,
  auch wenn er mit den festen Demo-Daten aktuell nicht greift. Rein
  lokaler Demo-State, noch keine echte geteilte Reise-Speicherung
- [ ] 7.12 Reisebudget (Recharts) — weiterhin blockiert, `TripDraft` hat
  keine echten Preisfelder für Transport/Unterkunft (gleicher Grund wie
  bei 6.6/6.7, siehe oben)
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
- [x] 7.13 `Aktivitaeten.tsx` (`/aktivitaeten`) — vom autonomen IT-Chef-Lauf
  am 17.08. gebaut: Kartenliste mit über die zwei Demo-Reisen aus
  `MeineReisen.tsx` (Lissabon, Kyoto) aggregierten Aktivitäten,
  Ziel-Badge pro Karte, optionalem Preis (analog `TripActivity.price`),
  funktionierendem Entfernen-Button (gleiches Muster wie bei
  Angebote/Favoriten/Preisalarme), ermutigender Leer-Zustand laut
  `MARKENDESIGN.md`. Rein lokaler Demo-State, noch keine echte
  geteilte Aktivitäten-Speicherung über Trips hinweg
- [x] 7.15 `ReiseSuche.tsx` (`/reise-planen`) — vom autonomen IT-Chef-Lauf am
  21.08. gebaut: drei Karten (KI-Chat, Flugsuche, Hotelsuche) als
  Einstiegspunkt für die Reiseplanung, KI-Chat hervorgehoben als
  empfohlener Weg. Schließt eine echte Lücke — `Home.tsx`s
  "Selbst durchsuchen"-Button verlinkte bereits dorthin, zeigte bisher
  aber nur die `PlaceholderPage`. Kein Zug/Bus/Fähre-Kärtchen, da 5.7
  (Einbindung von `TrainCard`/`TrainResults`) noch offen ist und dafür
  keine eigenständige Route existiert. Reine Navigation, keine
  erfundenen Daten. Am 24.08. vom autonomen IT-Chef-Lauf korrigiert: die
  "empfohlen"-Hervorhebung der KI-Chat-Karte (`border-teal/40`) hatte
  keine sichtbare Wirkung, weil `Card` intern `ring-1` statt eines
  `border`-Utilities nutzt (vom Support-Chef am 23.08. gemeldet) — durch
  ein sichtbares "Empfohlen"-Badge ersetzt, analog dem bestehenden
  Badge-Muster in `Preisalarme.tsx`/`Buchung.tsx`.

### Sprint 4 — Urlaubsmodus & Konto (KW40-42, 29. Sep - 19. Okt)
- [ ] 8.2 Foto-Upload + Vision-Analyse
- [ ] 8.3 Vollständig kontextbezogene Antworten (Tagesitinerar, nicht nur
  Zielort — aktuell nur einfache Concierge-Fakten)
- [ ] 8.4 Quick-Action-Buttons (Restaurant finden, Schild übersetzen, Route)
- [ ] 8.5, 8.6, 8.7 Deal Finder
- [x] 8.8 `Profil.tsx` (`/profil`) — vom autonomen IT-Chef-Lauf am 20.08.
  gebaut: Reisestile (Mehrfachauswahl als Toggle-Chips, analog
  `QuickReplies.tsx`), Budgetrahmen (Select mit vier groben Stufen statt
  konkreter €-Beträge, um keine Zahlungs-/Preisentscheidung vorwegzunehmen),
  Ernährungsweise (ebenfalls Toggle-Chips, Mehrfachauswahl) und
  Heimatflughafen (IATA-Eingabe, Großschreibung + 3 Zeichen, analog dem
  `origin`-Feld in `FlightWizard.tsx`). Rein lokaler Demo-State ohne
  Persistenz über Reloads hinweg, gleiches Muster wie
  Favoriten/Preisalarme/Angebote — echte Speicherung hängt an der offenen
  Backend-/Auth-Entscheidung. 8.10 Einstellungen und 8.11 Hilfe bleiben
  eigene offene Punkte (Hilfe zusätzlich blockiert auf die FAQ-Inhalte vom
  Support-Chef).
- [x] 8.10 `Einstellungen.tsx` (`/einstellungen`) — vom autonomen IT-Chef-Lauf
  am 22.08. gebaut: Benachrichtigungs-Toggles (Preisalarme, Neue Angebote,
  Reise-Updates — Toggle-Chips analog `Profil.tsx`) und Maßeinheiten-Auswahl
  (Metrisch/Imperial). Bewusst ohne Sprachumschaltung (PRD-Frage OQ-05 ist
  noch offen) und ohne Währungsumschaltung. Rein lokaler Demo-State ohne
  Persistenz und ohne echten E-Mail-Versand (Postfach laut Support-Track noch
  nicht live), gleiches Muster wie Profil/Favoriten/Preisalarme
- [ ] 8.11 Hilfe
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
- [x] Content-Plan erstellen (Themen, Formate, Kanäle) — vom autonomen
  Marketing-Chef-Lauf am 20.08. als stale Checkbox erkannt: der Plan
  liegt bereits seit 10.08. fertig in `marketing/content-plan.md`
  (vier Content-Säulen, Kanal-/Format-Matrix, Redaktionsplan für die
  ersten vier Wochen, Leitplanken). Keine Code-Änderung, nur die
  Checkbox korrigiert.
- [x] Erste Content-Stücke produzieren (Blog/Social) — ebenfalls stale:
  liegt bereits seit 11.08. fertig in `marketing/content-stuecke-woche1.md`
  (zwei Social-Posts für LinkedIn/Instagram plus ein Blog-Stück, alle
  als reine Entwürfe, nichts veröffentlicht). Baut direkt auf dem
  Content-Plan (Woche 1, Post A/B) auf. Keine Code-Änderung, nur die
  Checkbox korrigiert.

### Sprint 4 (KW37-40, 8. Sep - 5. Okt)
- [ ] Laufende Content-Produktion — läuft bereits vorgezogen, siehe die
  einzelnen Content-Stücke in `marketing/` (bleibt als laufender Punkt
  offen, kein einmaliger Abschluss). Neuester Zugang am 24.08.:
  `marketing/content-stueck-reise-suchen-empfohlen.md` zur neuen
  `/reise-planen`-Seite, nachdem der zuvor gemeldete "Empfohlen"-Badge-Bug
  (siehe `reports/marketing-chef.md`, 22./23.08.) heute vom IT-Chef
  behoben wurde.
- [ ] Community/Warteliste aufbauen

### Sprint 5 (KW41-42, 6.-19. Okt)
- [x] Kampagnen-Konzepte für Google/Meta/TikTok Ads (Performance-Teil des
  Skills nutzen — Kampagnenstruktur, Zielgruppen, Anzeigentexte) — vom
  autonomen Marketing-Chef-Lauf am 22.08. vorgezogen, da Sprint 3/4
  weiterhin an Nis Freigabe-Entscheidung bzw. der noch nicht live
  geschalteten Landingpage hängen; Entwurf in
  `marketing/kampagnen-konzept-ads.md`. Bewusst noch nicht startbereit
  (siehe Vorbedingungen dort), nur als Vorlage fertig.

### Sprint 6 (KW43-45, 20. Okt - 9. Nov)
- [ ] Test-Kampagnen mit kleinem Budget starten, Learnings sammeln

### Sprint 7 (KW46-47, 10.-23. Nov)
- [ ] Launch-Kampagne vorbereiten
- [x] Presse-/Multiplikatoren-Kontakte aufbauen — vom autonomen
  Marketing-Chef-Lauf am 23.08. vorgezogen (Sprint 3/4/6 hängen
  weiterhin an Nis Freigabe-Entscheidung bzw. der noch nicht live
  geschalteten Landingpage). Bewusst nur die Strategie/Vorlage in
  `marketing/presse-multiplikatoren-strategie.md`: Zielgruppen-Typen,
  Auswahlkriterien, Outreach-Vorlage — **keine echten Namen recherchiert
  oder kontaktiert**, das bräuchte entweder echte Web-Recherche
  (unverifizierbar in diesem Lauf) oder wäre ein Live-Vorgang. Die
  tatsächliche Kontaktliste bleibt Nis nächster Schritt, siehe
  Vorbedingungen im Dokument.

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
