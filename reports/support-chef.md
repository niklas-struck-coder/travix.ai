# Support-Chef Bericht

**Datum:** 2026-10-07

## Was ist seit dem letzten Eintrag (2026-10-06) passiert?

Einiges an UI-naher Stelle, aber meine beiden offenen Vorschläge vom
letzten Mal stehen noch unverändert im Code. Im Einzelnen:

IT-Chef hat heute `routes.tsx` erweitert: Bei jedem Seitenwechsel wird
jetzt per `window.scrollTo(0, 0)` zum Seitenanfang gesprungen — genau die
Stelle, die ich am 06.10. für meinen Fokus-Vorschlag vorgeschlagen hatte.
Der parallele, branch-basierte Support-Chef-Lauf hat diese neue Stelle
am selben Tag geprüft (`support-chef-auto-log.md`, Eintrag von heute) und
zwei Funde gemeldet, die ich im Code bestätigen kann — siehe Vorschlag 1
unten. Außerdem wurde `resetChat()` in `useChat.ts` robuster (räumt einen
offenen Antwort-Timeout ab und setzt den "Travix denkt..."-Zustand
zurück) und ein Duffel-Proxy-Fehler bei nicht-JSON-Antworten behoben —
beides reine Technik-Fixes ohne direkt sichtbare Text-/UX-Lücke.

Meine Vorschläge 1 (Zielname fehlt in "Start=Ziel"-Meldung) und 3
(uneinheitliche Lösch-Warnungen) vom 06.10. sind unverändert offen,
gleicher Code, gleiche Zeilen.

## Meine Vorschläge

1. **Der neue Seitenwechsel-Sprung bewegt nur den Scrollbalken, nicht den
   Fokus — und kommt einen Schritt zu früh.** `src/routes.tsx:54-56`
   ruft bei jedem Routenwechsel `window.scrollTo(0, 0)` auf, aber nicht
   `focusPageHeading()` (`src/lib/utils.ts:14-27`, bereits mit
   `preventScroll: true` gebaut, würde also nicht kollidieren).
   Screenreader-Nutzer:innen bekommen bei Navigation über die Sidebar
   oder einen direkten Linkaufruf weiterhin keine Ansage, dass eine neue
   Seite da ist — das gilt auch für die 404-Seite selbst. Zusätzlich
   reagiert der `useEffect` auf `location.pathname`, das sich schon beim
   Klick ändert — der Sprung passiert also, bevor die alte Seite ihre
   0,2s-Ausblend-Animation (`PageTransition.tsx:25`) überhaupt beginnt,
   was auf langen Seiten (z. B. `/entwuerfe`) einen kleinen visuellen
   Ruck gibt. *Vorschlag:* `focusPageHeading()` direkt neben
   `window.scrollTo(0, 0)` in denselben `useEffect` aufnehmen.

2. **Fehlermeldung bei "Start = Ziel" im Flug-Chat nennt den Zielort
   nicht.** `src/hooks/useChat.ts:261` antwortet bei gleichem Abflug-
   und Zielflughafen nur mit "Start und Ziel dürfen nicht gleich sein
   — welcher Flughafen ist dein Abflugort?" Die Nutzerin muss selbst
   zurückscrollen, um nachzuvollziehen, welchen Ort sie da gerade
   nochmal eingegeben hat. *Vorschlag:* Zielname/-code in die Nachricht
   aufnehmen (`known.name`/`known.iataCode` liegen an dieser Stelle
   bereits vor).

3. **Lösch-Warnungen weiterhin unnötig einheitlich scharf.** Dieselbe
   scharfe "Das lässt sich nicht rückgängig machen"-Formulierung steht
   wortgleich in `Favoriten.tsx:128`, `Warenkorb.tsx:134`,
   `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118`,
   `Reiseentwuerfe.tsx:336/356` und `EditMode.tsx:147` — auch für leicht
   rückholbare Aktionen wie einen Favoriten oder eine gemerkte Aktivität
   entfernen. *Vorschlag:* die scharfe Formulierung für
   `Reiseentwuerfe.tsx` reservieren, bei den anderen eine ruhigere
   Formulierung wie "Du kannst [X] jederzeit wieder hinzufügen"
   verwenden.

_Letztes Update: 2026-10-07_
