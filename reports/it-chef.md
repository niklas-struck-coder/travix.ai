# IT-Chef Bericht

**Datum:** 2026-10-05

## Was ist seit dem letzten Eintrag (2026-10-03) passiert?

Der Favoriten-Ziel-Reset-Fund aus PR #27 ist inzwischen live in `main`
(Commit 698be1e, 04.10.) — der vorherige Bericht hatte das fälschlich
schon gemeldet, bevor der Fix tatsächlich gemergt war. Außerdem kamen aus
dem parallelen Autonomie-Kanal `it-chef/auto` seither drei weitere, von
Freigabe-Chef bereits geprüfte und gemergte Fixes in `main`: eine
fehlende 404-Route (`AppRoutes`/`NichtGefunden.tsx`), ein instabiler
React-Key in `TripSummaryCard` bei kollidierendem Freitext, und eine
fehlende Start=Ziel-Prüfung beim Flug-Abflughafen im Chat-Bearbeiten-Pfad
(Details siehe `it-chef-auto-log.md`, nicht hier).

**Eigene gezielte Bug-Suche in dieser Session:** Code-Stand, Branch- und
offene-PR-Liste durchgesehen, danach gezielt Kern-Dateien einzeln
gelesen statt nur gegrept — u. a. `useChat.ts`, `useConcierge.ts`,
`mockAdvisor.ts`, `mockConcierge.ts`, `duffel/client.ts`,
`tripStorage.ts`, `calendarUtils.ts`, `cartTotals.ts`,
`checklistRules.ts`, `speech.ts`, `FlightWizard.tsx`, `HotelWizard.tsx`,
`FlightCard.tsx`, `TrainCard.tsx`, `EditMode.tsx`, `KiChat.tsx`,
`Buchung.tsx`, `Warenkorb.tsx`, `Preisalarme.tsx`, `MeineReisen.tsx`,
`NichtGefunden.tsx`, `routes.tsx` — inklusive Promise-/Storage-
Fehlerbehandlung und TODO/FIXME-Suche (keine offenen Marker gefunden).

**Fund:** Keiner, der sicher genug für einen automatischen Fix wäre.
Der parallele `it-chef/auto`-Kanal hatte heute bereits drei eigene Läufe
mit genau derselben Zielsetzung und einen eigens beauftragten
Explore-Agenten auf praktisch alle übrigen Dateien angesetzt — beide
Durchgänge kommen unabhängig voneinander zum selben Ergebnis: aktuell
kein neuer, eindeutiger und risikoarmer Bug offen.

Hinweis: `npx tsc -b`, `npm run lint` und `npx vitest run` ließen sich in
dieser Session nicht ausführen — die Node-Abhängigkeiten in diesem
Container sind unvollständig (u. a. `vite`, `@eslint/js`, `@types/node`
fehlen). Da `npm install` laut Sicherheitsregeln hier nicht ausgeführt
werden darf, bleibt das unvalidiert; reine Umgebungs-Besonderheit dieses
Laufs, kein Code-Fund.

## Automatisch gefixt (PR wartet auf Review)

Keine. Kein Fund war heute sicher genug für einen eigenständigen Fix.

## Gefundene Bugs (nicht automatisch gefixt)

Keine neuen. Weiterhin bekannt, aber bewusst nicht automatisch gefixt
(Produktentscheidung, kein isolierter Kleinfix):

1. **`src/pages/MeineReisen.tsx:16-21` — Reise-Status (`upcoming`/`past`)
   ist festes Literal, nicht aus dem Reisedatum abgeleitet.** Die
   Lissabon-Demo-Reise ("15.–22. September 2026") liegt vor dem heutigen
   Datum, wird aber weiterhin als "Bevorstehend" mit aktiver
   "Urlaubsmodus aktivieren"-CTA gezeigt und fließt so in
   `Dashboard.tsx`s "Bevorstehende Reisen"-Zähler ein. Die Datei
   kommentiert selbst, dass beide Demo-Reisen bewusst je einen Zustand
   zeigen sollen, unabhängig vom Kalenderdatum — eine Ableitung aus dem
   echten Datum wäre eine Produktentscheidung über das Demo-Verhalten,
   keine reine Logikkorrektur.
2. **`src/lib/ai/mockAdvisor.ts:171-182` — Flug-Ankündigung im
   Hauptchat-Ablauf löst keine echte Suche aus.** Im Code klar als
   bewusste Grenze kommentiert (nur der separate "Bearbeiten"-Pfad in
   `useChat.ts` löst die echte Duffel-Suche aus) — offene
   Backend-Verdrahtungsfrage, kein Versehen. Unverändert seit mehreren
   Berichten.

## Weitere Vorschläge

1. **Alle offenen Auto-Fix-PRs (aktuell 21, u. a. #1–#27) können jetzt
   geschlossen werden.** Jeder Fix steckt identisch oder gleichwertig
   bereits in `main` — reine Aufräumarbeit ohne Coderisiko, aber nur Ni
   kann PRs schließen.
2. **`recharts` ist weiterhin eine ungenutzte Abhängigkeit** in
   `package.json`, kein Import in `src/`. Entfernen reduziert die
   Bundle-Größe; reine Aufräumarbeit, kein Bugfix, daher nur Vorschlag
   (Abhängigkeitsänderungen sind für diesen Kanal ausgeschlossen).
3. **`formatDuration()` steckt identisch doppelt** in `FlightCard.tsx`
   und `TrainCard.tsx` (beide Kopien korrekt und deckungsgleich, kein
   Logikfehler). Ließe sich wie `formatEuro()` zuvor nach
   `src/lib/format.ts` konsolidieren — reine Code-Hygiene.
4. **`TrainCard`/`TrainResults` bleiben unverdrahteter toter Code.**
   Unverändert seit mehreren Berichten: vollständig implementiert mit
   eigener Testabdeckung, aber keine Zugsuche-Seite, kein Nav-Eintrag,
   keine echte Datenquelle angebunden. Entweder verdrahten oder
   entfernen — Produktentscheidung.

_Letztes Update: 2026-10-05_
