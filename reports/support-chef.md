# Support-Chef Bericht

**Datum:** 2026-09-03

## Was ist seit dem letzten Eintrag (2026-09-02) passiert?

Beide zuletzt gemeldeten Punkte sind behoben: Der Urlaubsmodus-Concierge
gibt jetzt eine ehrliche eigene Antwort, wenn eine Reise zwar geplant,
das Ziel aber nicht in der kleinen kuratierten Liste ist ("Für Bali habe
ich noch keine hinterlegten Fakten …", `mockConcierge.ts`), und Begrüßung
sowie Quick-Replies berücksichtigen das jetzt korrekt (`useConcierge.ts`).
Der Avatar zeigt bei diesen Ausweich-Antworten außerdem nicht mehr
fälschlich `'happy'`, sondern den bereits bestehenden `'error'`-Zustand.

Bei der Gelegenheit habe ich mir angeschaut, wie Suchfehler beim Duffel-
Anbieter durch die App laufen — Anlass war, dass IT-Chef dort kürzlich
rohe englische Fehlertexte durch ehrliche deutsche Meldungen ersetzt hat
(`client.ts`). Dabei sind zwei konkrete, noch offene Reibungspunkte in der
Chat-Oberfläche aufgefallen (die separaten manuellen Suchseiten sind
davon nicht betroffen).

## Meine Vorschläge

1. **Ein echter Hotelsuchfehler im Chat sieht für die Nutzerin wie "keine
   Treffer" aus, nicht wie ein Fehler.** `callDuffelProxy()` (`client.ts`)
   lehnt ihre Promise nie ab — auch bei einem echten Suchfehler liefert sie
   immer ein Ergebnisobjekt mit `errors`. Die beiden Stellen im Chat, die
   Unterkünfte suchen (`useChat.ts`, in `startEdit()` und im
   Haupt-Onboarding-Pfad), werten dieses `result.errors` in ihrem `.then()`
   aber nicht aus — nur der zugehörige `.catch()` setzt `stayError`, der
   bei einem echten Duffel-Fehler nie erreicht wird. Die Nutzerin bekommt
   also "Keine Unterkünfte gefunden" (`NoResultsMessage`) angezeigt, obwohl
   die Suche eigentlich fehlgeschlagen ist — sie erfährt nicht, dass es an
   einem technischen Problem lag, und bekommt keinen Hinweis, es einfach
   nochmal zu versuchen. Die manuellen Suchseiten `Hotelsuche.tsx` und
   `Flugsuche.tsx` machen das schon richtig (sie prüfen `errors.length`
   separat von `offers.length`).
   *Vorschlag:* In beiden `.then()`-Zweigen in `useChat.ts` `result.errors`
   auswerten und bei Fehlern `stayError` setzen, statt sich auf das nie
   erreichte `.catch()` zu verlassen.

2. **Nach einem echten Flugsuchfehler im Chat gibt es keine klickbare
   Option mehr, wie es weitergeht.** Direkt vor dem Suchaufruf setzt
   `useChat.ts` die Quick-Replies auf leer. In `runFlightSearch()` wird bei
   einem echten Suchfehler zwar korrekt die Fehlermeldung angezeigt (via
   `flightErrors`, das `.then()` wertet `result.errors` hier bereits
   richtig aus), die Quick-Replies bleiben aber leer — den hilfreichen Chip
   "Neue Reise planen" gibt es nur im (aus demselben Grund wie oben nie
   erreichten) `.catch()`. Die Nutzerin sieht also die ehrliche
   Fehlermeldung, landet danach aber in einer Sackgasse ohne Chip, mit dem
   sie im Chat weitermachen kann.
   *Vorschlag:* Im `.then()` von `runFlightSearch()` bei
   `result.errors.length > 0` ebenfalls `setQuickReplies(['Neue Reise
   planen'])` setzen.

Beide Punkte haben dieselbe Ursache: `callDuffelProxy()` löst nie eine
abgelehnte Promise aus, wodurch die dafür vorgesehenen `.catch()`-Zweige
in `useChat.ts` toter Code sind. Ein gemeinsamer Fix (z. B. `.then()` und
`.catch()` in beiden Fällen konsequent gleich behandeln) würde vermutlich
beide Stellen auf einmal lösen.

_Letztes Update: 2026-09-03_
