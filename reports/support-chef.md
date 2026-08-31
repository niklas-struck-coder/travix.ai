# Support-Chef Bericht

**Datum:** 2026-08-31

## Was ist seit dem letzten Eintrag (2026-08-29) passiert?

Beide damals gemeldeten Punkte sind behoben: Die Flug-Sackgasse im
Haupt-Chatflow bekommt jetzt einen "Neue Reise planen"-Button
(`mockAdvisor.ts`), und ein echter Suchfehler bei der
Unterkunftssuche zeigt inzwischen eine eigene Fehlermeldung statt
"Keine Unterkünfte gefunden" (`useChat.ts`, `HotelResults.tsx`).
Genau derselbe Fix wurde einen Tag später auch für die Flugsuche
nachgezogen (`flightErrors`). Gut gemacht — beim Nachprüfen dieser
frischen Fixes sind mir aber zwei neue, bisher nicht gemeldete
Reibungspunkte aufgefallen, die genau an diesen Stellen hängen.

## Meine Vorschläge

1. **Schlägt eine Flugsuche im Chat fehl, sieht die Nutzerin buchstäblich
   nichts — keine Fehlermeldung, kein Hinweis, nur Stille.**
   `src/components/chat/KiChat.tsx:115-117`: Die Bedingung, unter der
   `<FlightResults>` überhaupt gerendert wird, lautet
   `(flightLoading || flightOffers) &&`. Beim direkt darüber liegenden
   Unterkunfts-Pendant (`:111-113`) wurde beim gestrigen Fix korrekt
   `stayError` mit in die Bedingung aufgenommen. Bei der Flugsuche fehlt
   dieser Schritt: Schlägt `runFlightSearch` fehl, wird zwar
   `flightErrors` befüllt (`useChat.ts:98-101`), aber `flightOffers`
   bleibt `null` und `flightLoading` wird `false` — die Bedingung ist
   dann `false`, und die neue, extra dafür gebaute Fehlermeldung in
   `FlightResults.tsx:24-33` wird nie angezeigt. Der "sucht"-Avatar
   verschwindet einfach, ohne dass irgendetwas an seine Stelle tritt.
   *Vorschlag:* `KiChat.tsx:115` um `flightErrors.length > 0` ergänzen,
   analog zur bereits korrekten Unterkunfts-Bedingung — eine Zeile, die
   die neue Fehlermeldung erst sichtbar macht.

2. **Beide "Bearbeiten"-Suchpfade (Unterkunft/Flug) lassen nach einem
   Suchfehler keinen Quick-Reply-Button übrig, nur ein leeres
   Eingabefeld.**
   `src/hooks/useChat.ts:146-176` (Unterkunft) und `:195-230`
   (Flug-Herkunftscode → `runFlightSearch`): In beiden Fällen wird
   `quickReplies` auf `[]` gesetzt, bevor die Suche startet, und im
   Fehlerfall (`.catch`, Zeilen 173-176 bzw. 98-101) nie wieder befüllt.
   Der Haupt-Onboarding-Pfad zur Unterkunftssuche ist davon nicht
   betroffen, weil dort vorher schon `['Hotel', 'Ferienwohnung',
   'Hostel']` gesetzt wurde und bei einem Fehlschlag stehen bleibt —
   genau dieses Sicherheitsnetz fehlt in den beiden "Bearbeiten"-Pfaden,
   die man z. B. über den Bearbeiten-Stift in der Buchungs-Übersicht
   erreicht. Wer dort landet und einen Netzwerkfehler hat, sieht (sobald
   Punkt 1 behoben ist) zwar eine Fehlermeldung, aber keinen erkennbaren
   nächsten Schritt außer selbst zu tippen.
   *Vorschlag:* In beiden `.catch`-Zweigen zusätzlich
   `setQuickReplies(['Neue Reise planen'])` setzen — dasselbe Muster,
   das für den Haupt-Chatflow bereits existiert.

_Letztes Update: 2026-08-31_
