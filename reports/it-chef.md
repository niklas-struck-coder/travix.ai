# IT-Chef Bericht

**Datum:** 2026-10-03

## Was ist seit dem letzten Eintrag (2026-10-02) passiert?

Der parallele Autonomie-Kanal `it-chef/auto` war seit dem letzten Eintrag
mehrfach aktiv und hat fünf eigenständig gefixte Punkte eingebracht
(Details in `it-chef-auto-log.md`, nicht hier) — alle von Freigabe-Chef
geprüft und bereits in `main`: Details-Dialog bei Reiseentwürfen
disambiguiert Titel bei Duplikaten, das "Neue Aktivität"-Formular im
Bearbeiten-Dialog setzt seinen Entwurf beim Schließen zurück, die
dreifach duplizierte `formatEuro()` wurde in `src/lib/format.ts`
zusammengeführt, `formatDuration()` zeigt bei Sekunden-only-Dauer jetzt
ehrlich "—" statt erfundener "1min", und der Favoriten-Button "Reise mit
KI planen" übergibt das angeklickte Ziel an den Chat statt es zu
ignorieren.

**Eigene gezielte Bug-Suche in dieser Session:** Code-Stand, Branch- und
PR-Historie durchgesehen, anschließend gezielt die zuletzt geänderten
Kern-Dateien gelesen (`KiChat.tsx`, `useChat.ts`, `tripStorage.ts`,
`duffel/client.ts`, `mockAdvisor.ts`) sowie Promise-/Storage-Fehler-
behandlung und offene TODO/FIXME-Marker im gesamten `src/` geprüft.

**Fund:** Der zuletzt gebaute Favoriten→Chat-Ziel-Handoff
(`src/components/chat/KiChat.tsx`, Commit 94b0194) hatte einen echten
Folgefehler, den Support-Chef heute bereits als Analyse gemeldet hatte
(Commit 2b3c51d): Lief schon eine Planung, wenn jemand über eine
Favoriten-Karte kam, wurde der `?destination=`-Parameter nur übersprungen
statt verworfen — er blieb in der URL stehen. Setzte man die Planung
danach zurück ("Neu starten" / "Neue Reise planen"), feuerte derselbe
Effekt erneut und schickte den alten, womöglich tagealten Favoriten-Klick
ohne jede neue Nutzerinteraktion als Chat-Nachricht. Mit Regressionstest
reproduziert (schlägt gegen den alten Code fehl) und gefixt — siehe unten.

## Automatisch gefixt (PR wartet auf Review)

1. **[PR #27](https://github.com/niklas-struck-coder/travix.ai/pull/27)
   — Branch `it-chef-autofix/stale-destination-after-reset-2026-10-03`.**
   `KiChat.tsx`: Der `destination`-Query-Parameter aus einer Favoriten-
   Karte wird jetzt auch dann sofort verworfen (URL bereinigt, als
   "erledigt" markiert), wenn schon eine Planung läuft — vorher blieb er
   stehen und konnte nach einem späteren Reset unbemerkt erneut gesendet
   werden. Kleine, isolierte Änderung an einem einzelnen Effect, plus
   Regressionstest. Volle Test-Suite (397 Tests), Lint und Typecheck
   laufen fehlerfrei durch.

## Gefundene Bugs (nicht automatisch gefixt)

Keine neuen, die nicht sicher genug für einen automatischen Fix wären.
Weiterhin bekannt, aber bewusst nicht automatisch gefixt
(architekturell/produktseitig, kein isolierter Kleinfix):

1. **`src/lib/ai/mockAdvisor.ts:171-182` — Flug-Ankündigung im
   Hauptchat-Ablauf löst keine echte Suche aus.** Im Code klar als
   bewusste Grenze kommentiert (nur der separate "Bearbeiten"-Pfad in
   `useChat.ts` löst die echte Duffel-Suche aus) — offene
   Backend-Verdrahtungsfrage, kein Versehen. Unverändert seit mehreren
   Berichten.

## Weitere Vorschläge

1. **Alle 21 offenen alten Auto-Fix-PRs können jetzt geschlossen
   werden** (#1, #4–#18 ohne #2/#3/#19, #20–#22, #25, #26). Mit der
   heutigen Landung von PR #25 (`formatDuration`) im `main`-Code ist jetzt
   auch der letzte zuvor noch offene Fix eingetroffen — jeder Fix steckt
   inzwischen identisch oder gleichwertig in `main`. Reine Aufräumarbeit
   ohne Coderisiko, aber nur Ni kann PRs schließen.
2. **`recharts` ist weiterhin eine ungenutzte Abhängigkeit** in
   `package.json`, kein Import in `src/`. Entfernen reduziert die
   Bundle-Größe; reine Aufräumarbeit, kein Bugfix, daher hier nur als
   Vorschlag (Abhängigkeitsänderungen sind für diesen Kanal
   ausgeschlossen).
3. **`TrainCard`/`TrainResults` bleiben unverdrahteter toter Code.**
   Unverändert seit mehreren Berichten: vollständig implementiert mit
   eigener Testabdeckung, aber keine Zugsuche-Seite, kein Nav-Eintrag,
   keine echte Datenquelle angebunden — nur in der eigenen Testdatei
   referenziert. Entweder verdrahten oder entfernen — Produktentscheidung.

_Letztes Update: 2026-10-03_
