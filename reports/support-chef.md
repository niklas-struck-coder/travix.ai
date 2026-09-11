# Support-Chef Bericht

**Datum:** 2026-09-10

## Was ist seit dem letzten Eintrag (2026-09-09) passiert?

Vorschlag 1 aus dem letzten Bericht ist behoben: Der "Neu starten"-Knopf
im KI-Chat (`src/components/chat/KiChat.tsx`) löst `resetChat()` nicht
mehr sofort aus, sondern fragt jetzt erst mit einem Bestätigungsdialog
nach ("Neu starten?" / "Deine aktuelle Planung geht verloren."). Genau
der Reibungspunkt, den ich gemeldet hatte — sauber umgesetzt, inklusive
neuer Tests.

Ansonsten wurden seit gestern nur Testdateien ergänzt (u. a. für
`HotelCard`, `FlightCard`, `TravixAvatar`, `Urlaubsmodus`) — keine
Änderung an Nutzerführung, Texten oder Fehlerbehandlung. Ich habe die
betroffenen Seiten trotzdem nochmal mit frischem Blick geprüft: Die drei
verbleibenden Punkte aus dem letzten Bericht sind unverändert offen, ich
trage sie deshalb unten weiter.

## Meine Vorschläge

1. **Löschen ist an mehreren Stellen sofort und endgültig, ohne
   Bestätigung oder Rückgängig.** Weiterhin so in
   `src/pages/Preisalarme.tsx` (`removeAlert`) und
   `src/pages/Favoriten.tsx` (`removeFavorite`), ebenso in
   `Angebote.tsx`, `Aktivitaeten.tsx` und `Warenkorb.tsx`: Ein Klick auf
   das Papierkorb-/X-Icon entfernt den Eintrag direkt, ohne Nachfrage und
   ohne "Rückgängig"-Toast. Bei einem Preisalarm oder Warenkorb-Eintrag,
   an dem man länger gesucht hat, ist ein Fehlklick besonders ärgerlich.
   *Vorschlag:* Einheitlich einen kurzen Bestätigungsdialog oder
   zumindest einen "Rückgängig"-Toast einführen — an einer Stelle
   festlegen, dann überall gleich anwenden.

2. **Der Warenkorb ist eine Sackgasse — es gibt keinen "Jetzt
   buchen"-Button.** `src/pages/Warenkorb.tsx` endet nach der
   Summen-Karte einfach so, ohne Aktion zur tatsächlichen Buchung. Wer
   seinen Warenkorb ansieht, erwartet als nächsten Schritt logischerweise
   einen Buchen-Button. *Vorschlag:* Entweder einen "Jetzt
   buchen"/"Zur Kasse"-Button ergänzen, oder — falls Direktbuchung
   bewusst (noch) nicht vorgesehen ist — das der Nutzerin kurz im Text
   erklären, statt sie ratlos zurückzulassen.

3. **"Planung fortsetzen" bei Reiseentwürfen führt immer zum selben,
   generischen Chat statt zum jeweiligen Entwurf.** In
   `src/pages/Reiseentwuerfe.tsx` verlinkt der Button bei jeder
   Entwurfskarte identisch auf `/ki-chat`, ohne die jeweilige Entwurfs-ID
   mitzugeben. Wer zwei Entwürfe hat (z. B. Lissabon und Kyoto) und bei
   Kyoto auf "Planung fortsetzen" klickt, landet trotzdem im einen,
   global gespeicherten Chat. *Vorschlag:* Die Entwurfs-ID mitgeben und
   den passenden Entwurf beim Fortsetzen laden — sobald mehrere Entwürfe
   gleichzeitig unterstützt werden sollen — oder kurzfristig im Text
   klarmachen, dass aktuell nur eine aktive Planung möglich ist.

_Letztes Update: 2026-09-10_
