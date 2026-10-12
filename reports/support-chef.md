# Support-Chef Bericht

**Datum:** 2026-10-12

## Was ist seit dem letzten Eintrag (2026-10-10) passiert?

Eine gute Nachricht zuerst: Der Flugauswahl-Fund vom letzten Mal ist zur
Hälfte behoben. `src/pages/Flugsuche.tsx:38` speichert die gewählte
Route jetzt tatsächlich im Reiseplan (`transportDetail:
summarizeFlightOffer(offer)`), genauso wie `useChat.ts` das für den
KI-Chat-Pfad nachgezogen hat — kein Detailverlust mehr. Die zweite
Hälfte des Funds steht aber weiterhin: Das Bearbeiten-Formular bleibt
leer, siehe Vorschlag 2.

Daneben hat die automatische Tagesprüfung einen neuen, bestätigten Fund
gemacht (Vorschlag 1), und die Startseite hat ein neues Feature
bekommen, dem noch die passende Rückmeldung fehlt (Vorschlag 3).

Unverändert zum letzten Mal, seit 05.10. offen: die inkonsistenten
Lösch-Warnungen und der Urlaubsmodus/Lissabon-Mismatch — an beidem hat
sich im Code nichts getan, deshalb hier nur kurz erwähnt statt erneut
ausführlich vorgeschlagen.

## Meine Vorschläge

1. **Flugauswahl im KI-Chat bestätigt mit rohen Flughafen-Codes statt
   Klarnamen.** `src/hooks/useChat.ts:420` baut die Routen-Angabe für die
   Bestätigungsnachricht selbst aus `slice.originIata`/`destinationIata`
   — zwei Zeilen weiter unten wird aber schon `summarizeFlightOffer()`
   aufgerufen, das genau den Namen-vor-Code-Fallback mitbringt
   (`src/lib/format.ts:23-30`). Wer im Chat einen Flug wählt, liest
   "BER → LIS" statt "Berlin → Lissabon" — während der Reiseplan direkt
   danach den Klarnamen zeigt. *Vorschlag:* in `selectFlight()` dasselbe
   `summarizeFlightOffer()`-Ergebnis für die Bestätigung nutzen, das
   ohnehin schon berechnet wird.

2. **Flug "Bearbeiten" → "Manuell suchen" führt weiterhin zu einem
   komplett leeren Formular.** `src/components/search/FlightWizard.tsx`
   initialisiert Herkunft/Ziel/Datum immer mit leeren Werten — unabhängig
   davon, dass die zuvor gewählte Flugroute laut Vorschlag von letzter
   Woche jetzt im Trip gespeichert wird. Wer zur Flugsuche zurückkehrt,
   tippt alles erneut ein, obwohl die Daten eigentlich schon da wären.
   *Vorschlag:* die gespeicherten Sucheingaben/Route beim Öffnen von
   `FlightWizard` als Startwerte übergeben.

3. **Die neu klickbaren Destination-Karten auf der Startseite sehen aus
   wie reine Deko.** `src/pages/Home.tsx:70-74` macht die vier Karten in
   "Beliebte Reiseziele" per `Link` klickbar, aber weder `Link` noch
   `Card` haben eine Hover- oder Fokus-Markierung — jedes andere
   interaktive Element der App (`Button`, `Input`, `Tabs`) hat ein
   `focus-visible:ring`-Muster, nur hier fehlt es. Wer mit der Maus
   drüberfährt oder durchtabbt, bekommt kein Signal, dass hier etwas
   passiert. *Vorschlag:* `focus-visible:ring-[3px] focus-visible:ring-ring/50`
   plus einen leichten `hover:shadow-md` auf Link/Card übernehmen —
   kein neues Design, nur das bestehende Muster anwenden.

4. **Weiterhin offen, unverändert:** Die Lösch-Warnungen (sechs Stellen,
   u. a. `Favoriten.tsx:128`, `Warenkorb.tsx:134`, `Preisalarme.tsx:137`,
   `Aktivitaeten.tsx:118` — alle wortgleich "nicht rückgängig machen",
   obwohl z. B. ein Favorit trivial wieder anlegbar ist) und der
   Urlaubsmodus-Mismatch (`MeineReisen.tsx:19` verlinkt von der
   Lissabon-Demokarte auf `/urlaubsmodus`, das aber nur den im KI-Chat
   gespeicherten Trip zeigt, nicht die Demo-Reise). Beide seit dem
   05.10. bzw. 09.10. unverändert — der Vorschlag von damals steht nach
   wie vor.

_Letztes Update: 2026-10-12_
