# Support-Chef Bericht

**Datum:** 2026-10-15

## Was ist seit dem letzten Eintrag (2026-10-14) passiert?

Einiges, und das Meiste davon gute Nachrichten. IT-Chef hat seit gestern
vier Auto-Läufe gemacht, alle schon von Freigabe-Chef geprüft und in
`main` gemergt. Der wichtigste für dich: Der Avatar-Fund von gestern
(ehrliche "weiß ich nicht"-Antworten des Urlaubsmodus-Concierge sahen aus
wie ein echter Fehler) ist behoben — `useConcierge.ts` setzt jetzt den
ruhigen `idle`-Zustand statt `error`. Punkt 4 von gestern fällt damit weg.

Außerdem wurde die Fehleranzeige bei Flug-/Hotelsuche vereinheitlicht
(neue `SearchErrorAlert`-Komponente) und ein alter Bug behoben, bei dem
nach einem Feldwechsel im Bearbeiten-Modus noch veraltete Flugergebnisse
stehen blieben. Dabei ist mir selbst (auf dem Auto-Kanal) aufgefallen,
dass die neue Fehleranzeige bei mehreren gleichzeitigen Duffel-Fehlern
(z. B. ungültiges Datum *und* ungültige Passagierzahl) denselben Satz
mehrfach identisch untereinander zeigt — wirkt wie ein Darstellungsfehler.
IT-Chef hat dafür schon einen Fix vorbereitet (PR #29), der aber noch auf
Review wartet, also noch nicht in `main` ist. Kein neuer Punkt von mir
hier nötig, das ist schon erkannt und in Arbeit.

Die drei übrigen, schon länger bekannten Punkte (leeres
Flug-Bearbeiten-Formular, gleich dramatische Lösch-Warnungen,
Lissabon-Demokarte mit möglichem Chat-Mismatch) habe ich heute im Code
nochmal gegengeprüft — an keiner der betroffenen Dateien hat sich etwas
geändert, sie bleiben also unverändert offen.

## Meine Vorschläge

1. **Flug "Bearbeiten" → "Manuell suchen" führt weiterhin zu einem
   komplett leeren Formular.** `src/components/search/FlightWizard.tsx:10-13`
   nimmt laut `FlightWizardProps` nach wie vor nur `onSearch` und `loading`
   entgegen — keine Möglichkeit, Startwerte zu übergeben. Wer zur
   Flugsuche zurückkehrt, tippt alles erneut ein, obwohl die zuvor
   gewählte Route im Trip schon gespeichert ist. *Vorschlag:* `FlightWizard`
   um ein optionales `initialValues`-Prop erweitern und beim Öffnen aus
   dem gespeicherten Trip befüllen.

2. **Die Lösch-Warnungen klingen überall gleich dramatisch, auch wenn es
   das nicht ist.** `Favoriten.tsx:128`, `Warenkorb.tsx:134`,
   `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118` und `EditMode.tsx:151`
   verwenden weiterhin alle wortgleich "Das lässt sich nicht rückgängig
   machen" — auch dort, wo das gar nicht zutrifft, z. B. bei einem
   Favoriten, der mit einem Klick wieder anlegbar wäre. Das verunsichert
   unnötig. *Vorschlag:* den Warnhinweis nur dort zeigen, wo etwas wirklich
   unwiderruflich ist (z. B. eine Buchung), und bei trivial
   wiederherstellbaren Aktionen eine neutralere Formulierung ohne
   "endgültig"-Ton verwenden.

3. **Die "Urlaubsmodus aktivieren"-Karte für die Lissabon-Demoreise kann
   auf einen leeren oder falschen Chat führen.** `src/pages/MeineReisen.tsx:49`
   verlinkt von der Lissabon-Demokarte auf `/urlaubsmodus` — die Seite
   selbst (`src/pages/Urlaubsmodus.tsx:12`) lädt ihren Trip aber weiterhin
   nicht aus dieser Demoreise, sondern aus `loadStoredChat()?.trip`, also
   dem im KI-Chat gespeicherten Trip. Hat ein Nutzer noch nie mit dem
   KI-Chat eine Reise geplant, landet er beim Klick auf die Lissabon-Karte
   in einem Urlaubsmodus ohne Reisebezug — oder mit einem ganz anderen
   Ziel, falls im Chat gerade etwas anderes gespeichert ist. *Vorschlag:*
   die Demokarte entweder direkt mit den Lissabon-Demodaten befüllen, oder
   so lange ausblenden/deaktivieren, bis echte Buchungen angebunden sind.

_Letztes Update: 2026-10-15_
