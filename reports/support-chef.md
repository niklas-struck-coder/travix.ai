# Support-Chef Bericht

**Datum:** 2026-09-08

## Was ist seit dem letzten Eintrag (2026-09-07) passiert?

Gute Nachrichten: Beide offenen Punkte aus meinem letzten Bericht sind
jetzt wirklich vollständig behoben, nicht nur zur Hälfte. Der Fix
`d7682d2` schließt die Lücke sauber an beiden Stellen — `mockAdvisor.ts`
teilt `useChat.ts` jetzt über ein neues Feld (`accommodationNoticeHandled`)
mit, wenn die Ehrlich-Notiz zum unbekannten Ziel schon in der Advisor-
Antwort steckt, statt dass beide Stellen unabhängig prüfen und eine
doppelte, widersprüchliche Nachricht senden. Und der "Bearbeiten"-Pfad
(`startEdit()`) prüft das Ziel jetzt vorher, statt hinterherzuschieben.
Ich habe den Code selbst nachgelesen — beide Varianten sind wirklich zu.
Danke fürs gründliche Nacharbeiten!

Beim Durchsehen der neueren Änderungen (Zugpreis-Format, Umbau der
Unterkunfts-Notiz) sind mir zwei weitere Punkte aufgefallen.

## Meine Vorschläge

1. **Fehlermeldung bei fehlgeschlagener Unterkunftssuche im KI-Chat ist
   immer gleich, egal was wirklich schiefging.** `src/hooks/useChat.ts:78`
   speichert einen fehlgeschlagenen `searchStays()`-Aufruf nur als
   `stayError: boolean`, und `HotelResults.tsx:29` zeigt dafür immer denselben
   festen Satz ("Die Unterkunftssuche hat gerade nicht geklappt — versuch's
   gleich nochmal."). Die eigenständige Hotelsuche-Seite (`Hotelsuche.tsx:15`)
   macht es dagegen richtig und zeigt die konkrete Duffel-Fehlermeldung an
   — genau wie die Flugsuche im Chat (`flightErrors: DuffelError[]`). Für
   Nutzer:innen im Chat heißt das: Ob z. B. die Daten ungültig sind oder der
   Dienst gerade nicht erreichbar ist, sieht immer gleich aus — "nochmal
   versuchen" hilft dann nicht immer weiter. *Vorschlag:* `stayError`
   analog zu `flightErrors` auf ein Array konkreter Fehlermeldungen
   umstellen, exakt nach dem bewährten Flug-Muster. (Deckt sich mit einem
   Fund aus dem heutigen IT-Chef-Bericht — aus Nutzersicht bestätige ich
   das gerne als echten Reibungspunkt.)

2. **Ladetext bei Zug/Bus/Fähre verspricht "echte" Verbindungen, obwohl
   noch keine Datenquelle angebunden ist.** `TrainResults.tsx:18` zeigt
   während der Suche "Travix sucht echte Zug-, Bus- und Fährverbindungen …"
   — genau der ehrliche Ton, den ich mir auch bei der Unterkunft wünsche,
   nur leider (noch) nicht wahr: Es gibt aktuell keine angebundene
   Zug-/Bus-/Fähr-Datenquelle. Die gute Nachricht: `TrainResults.tsx` und
   `TrainCard.tsx` sind noch in keine Seite eingebunden, aktuell sieht also
   noch keine echte Nutzerin diesen Text. *Vorschlag:* Den Text jetzt schon
   korrigieren (z. B. "Travix sucht Zug-, Bus- und Fährverbindungen …" ohne
   "echte", oder gleich ehrlich als Demo/Vorschau kennzeichnen), bevor die
   Komponente an eine Seite angebunden wird — dann ist das Risiko einer
   falschen Erwartung von Anfang an ausgeschlossen statt erst hinterher
   korrigiert zu werden.

_Letztes Update: 2026-09-08_
