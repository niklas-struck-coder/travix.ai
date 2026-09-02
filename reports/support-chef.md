# Support-Chef Bericht

**Datum:** 2026-09-02

## Was ist seit dem letzten Eintrag (2026-09-01) passiert?

Der zuletzt gemeldete Punkt ist behoben: Das "Ausgewählt"-Häkchen auf der
Hotel-/Flugsuche-Seite bleibt jetzt korrekt auf "Auswählen" stehen, wenn
`updateStoredTrip` fehlschlägt (`Hotelsuche.tsx`/`Flugsuche.tsx`,
`selected` ist jetzt zusätzlich an `selectionHasTrip` geknüpft). Daneben
hat IT-Chef zwei Wortgrenzen-Bugs behoben, die kurze Zielnamen wie "Rom"
mitten in unbeteiligten Wörtern (z. B. "romantisch") matchen ließen
(`stays.ts`, `mockConcierge.ts`).

Bei der Gelegenheit wurde erstmals der bisher ungeprüfte
Urlaubsmodus-Concierge (`Urlaubsmodus.tsx`, `mockConcierge.ts`,
`useConcierge.ts`) angeschaut. Dabei sind zwei neue, noch offene
Reibungspunkte aufgefallen.

## Meine Vorschläge

1. **Der Concierge behauptet fälschlich "keine Reise geplant", wenn das
   Reiseziel echt, aber einfach nicht in der Demo-Liste ist.**
   `mockConcierge.ts:16-25` kennt nur acht kuratierte Ziele (Lissabon,
   Kyoto, Kapstadt, Reykjavik, Paris, Rom, Barcelona, New York). Für jedes
   andere echte Ziel liefert `findFacts()` `null`, und `getConciergeReply()`
   (`:49`) antwortet dann mit demselben Satz wie ganz ohne geplante Reise:
   "Dafür brauche ich eine geplante Reise mit Reiseziel …" — das ist bei
   einer Nutzerin mit einer echten, im KI-Chat eingetippten Reise nach z. B.
   "Bali" schlicht falsch. Verschärft wird das dadurch, dass die Begrüßung
   (`getConciergeGreeting`) und die Quick-Reply-Chips in `useConcierge.ts:12`
   nur prüfen, ob überhaupt ein Zielname vorhanden ist — nicht, ob er bekannt
   ist. Wer "Bali" geplant hat, sieht also erst eine persönliche Begrüßung
   samt drei Quick-Replies und bekommt bei jedem Klick darauf die Antwort,
   es sei angeblich noch gar keine Reise geplant.
   *Vorschlag:* Für "Ziel geplant, aber nicht kuratiert" einen eigenen,
   ehrlichen Text statt des "kein Ziel"-Satzes, z. B. "Für {destination}
   habe ich noch keine hinterlegten Fakten." Begrüßung und Quick-Replies in
   `useConcierge.ts` auf `findFacts(destination) !== null` statt nur auf
   `destination` prüfen.

2. **Der Avatar wirkt bei ehrlichen Ausweich-Antworten unpassend fröhlich.**
   `useConcierge.ts:25` setzt nach jeder Concierge-Antwort unbedingt
   `setAvatarState('happy')` — auch bei den beiden Fällen, in denen die
   Antwort inhaltlich eine Einschränkung ist (kein/unbekanntes Ziel, oder
   die generische Demo-Antwort in `mockConcierge.ts:62`). `TravixAvatar.tsx`
   hat mit `'error'` bereits einen dafür passenderen, an anderer Stelle
   etablierten Zustand. Ein breit lächelnder Avatar neben "das kann ich hier
   gerade nicht" wirkt inkonsistent zum sonst ehrlichen Ton der App.
   *Vorschlag:* `getConciergeReply` z. B. einen `{ text, matched }`-Rückgabewert
   geben lassen und bei den Ausweich-Fällen einen neutraleren Avatar-Zustand
   statt `'happy'` setzen.

_Letztes Update: 2026-09-02_
