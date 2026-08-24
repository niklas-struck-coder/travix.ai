# Support-Chef Bericht

**Datum:** 2026-08-24

## Was ist seit dem letzten Eintrag (2026-08-23) passiert?

Gute Nachrichten zuerst: Alle drei konkreten Punkte aus meinem letzten
Bericht sind behoben — das "Empfohlen"-Badge auf der "Reise suchen"-Seite
ist jetzt sichtbar (`src/pages/ReiseSuche.tsx`), und die beiden zu
optimistischen Texte in den Einstellungen (E-Mail-Benachrichtigungen,
Maßeinheiten) wurden neutraler formuliert (`src/pages/Einstellungen.tsx`).
Punkt 4 (Formulardaten gehen beim Wegnavigieren verloren) wurde bewusst
noch nicht angefasst, dazu unten mehr. Neu dazugekommen ist eine
**Reise-Checkliste** auf der Buchungsseite (`ChecklistPanel.tsx`, sichtbar
auf `/buchung`), die ich mir aus Nutzersicht angeschaut habe.

## Meine Vorschläge

1. **Die neue Checkliste sagt "gebucht", obwohl nichts davon wirklich
   gebucht wurde.** `src/lib/trip/checklistRules.ts:16-20` hakt "Transport
   gebucht" und "Unterkunft gebucht" automatisch ab, sobald in der Chat-
   Planung irgendein Transportmodus bzw. eine Unterkunft *ausgewählt*
   wurde (`isAutoItemChecked`, Zeilen 39-54) — geprüft wird nur
   `Boolean(trip.transportMode)` bzw. `Boolean(trip.accommodation)`. Eine
   echte Buchung gibt es in der App aktuell noch gar nicht (der
   "Beim Anbieter buchen"-Button ist laut `ZEITPLAN.md` Punkt 6.2
   weiterhin offen). Wer die Checkliste durchgeht und zwei grüne Häkchen
   bei "gebucht" sieht, könnte fälschlich denken, Transport und Unterkunft
   seien bereits fix — dabei wurden sie nur in der Planung ausgewählt.
   Vorschlag: Labels auf "Transport ausgewählt" / "Unterkunft ausgewählt"
   ändern, bis eine echte Buchung existiert.

2. **Das "Formulardaten gehen beim Wegnavigieren verloren"-Muster gibt es
   jetzt an einer dritten Stelle — und dort tut es besonders weh.** Die
   manuell abgehakten Punkte der Checkliste (Reisepass, Visum,
   Versicherung, Koffer packen, …) leben nur in `useState`
   (`src/components/trip/ChecklistPanel.tsx:20`, bewusst so kommentiert,
   gleiches Muster wie Profil/Einstellungen). Anders als ein Formularfeld
   ist so eine Checkliste aber typischerweise etwas, das man über
   mehrere Tage vor der Reise immer wieder öffnet — ein Klick auf eine
   andere Seite und alle Häkchen sind wieder weg. Das ist verständlich
   bewusst zurückgestellt (hängt an der offenen Backend-/Nutzerkonten-
   Entscheidung laut `ZEITPLAN.md`), aber bei drei betroffenen Seiten
   würde ich eine gemeinsame, einfache Lösung (z. B. `localStorage`) jetzt
   priorisieren, statt weiter zu warten.

_Letztes Update: 2026-08-24_
