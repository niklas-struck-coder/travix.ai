# Support-Chef Bericht

**Datum:** 2026-10-10

## Was ist seit dem letzten Eintrag (2026-10-09) passiert?

Ein schöner Tag für die Liste: Der Fokus-Sprung-Fund ist gefixt.
`src/routes.tsx:70-72` ruft jetzt bei jedem Routenwechsel per
`onExitComplete` + `requestAnimationFrame(focusPageHeading)` die neue
Überschrift auf — inklusive eines Kommentars, der genau erklärt, warum
das nicht direkt im `scrollTo`-Effekt passieren konnte (die alte Seite
wäre zu dem Zeitpunkt noch im DOM). Screenreader-Nutzer bekommen die
"neue Seite"-Ansage damit jetzt zuverlässig.

IT-Chef hat außerdem zwei Stabilitätsfixes gemergt: `resetChat()` bricht
laufende Duffel-Suchen jetzt korrekt ab, und `editingField`/
`awaitingFlightOrigin` überleben einen Seiten-Reload während der
Bearbeitung. Freigabe-Chef hat heute mehrere Auto-Branches nach `main`
gemergt.

Der parallele, branch-basierte Support-Chef-Lauf hat heute einen neuen
Fund gemacht, den ich im Code bestätigt habe: Bei der Flugauswahl gehen
alle Details verloren. Siehe Vorschlag 1.

Weiterhin offen, unverändert zum 09.10.: die Lösch-Warnungen und der
Urlaubsmodus/Lissabon-Mismatch.

## Meine Vorschläge

1. **Flugauswahl verliert alle Details — und das Bearbeiten-Formular
   startet leer.** `src/pages/Flugsuche.tsx:32` speichert bei
   `handleSelect` nur `transportMode: 'flight'` im Reiseplan. Auf
   `Buchung.tsx:217` zeigt das deshalb nur das generische Label "Flug",
   während `Hotelsuche.tsx:33` den konkreten `accommodationName`
   speichert, der auf `Buchung.tsx:239` auch so angezeigt wird — zwei
   strukturell gleiche Pfade, aber nur einer behält die Info. Wer über
   "Bearbeiten" → "Manuell suchen" zurück zur Flugsuche kommt, sieht
   zusätzlich ein komplett leeres `FlightWizard`-Formular statt der
   vorherigen Sucheingabe. *Vorschlag:* `handleSelect` in `Flugsuche.tsx`
   analog zu `Hotelsuche.tsx` die gewählte Route/Airline/Zeit im Trip
   speichern, und die letzten Sucheingaben beim erneuten Öffnen von
   `FlightWizard` vorbelegen.

2. **Lösch-Warnungen sind weiterhin an sieben Stellen unnötig einheitlich
   scharf formuliert.** `EditMode.tsx:151`, `Preisalarme.tsx:137`,
   `Warenkorb.tsx:134`, `Reiseentwuerfe.tsx:336/356`, `Favoriten.tsx:128`
   und `Aktivitaeten.tsx:118` nutzen alle wortgleich "Das lässt sich
   nicht rückgängig machen." — obwohl sich ein Favorit oder eine
   Preisalarm-Entfernung einfach wieder anlegen lässt. *Vorschlag:*
   unverändert — die scharfe Formulierung auf `Reiseentwuerfe.tsx`
   begrenzen, bei den anderen sechs Stellen eine ruhigere Formulierung
   wie "Du kannst [X] jederzeit wieder hinzufügen" verwenden.

3. **"Urlaubsmodus aktivieren" auf der Lissabon-Demokarte führt weiterhin
   ins Leere oder zum falschen Ziel.** `MeineReisen.tsx:19-53` verlinkt
   auf `/urlaubsmodus`, dessen Inhalt aber laut `Urlaubsmodus.tsx:12`
   ausschließlich aus dem im KI-Chat gespeicherten Trip kommt
   (`loadStoredChat()`), nicht aus der Demo-Liste. *Vorschlag:*
   kurzfristig entweder den Button auf der Demo-Karte deaktivieren, oder
   `MeineReisen.tsx` dieselbe Datenquelle nutzen lassen wie `Buchung.tsx`.

_Letztes Update: 2026-10-10_
