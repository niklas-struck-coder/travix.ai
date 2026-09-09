# Support-Chef Bericht

**Datum:** 2026-09-09

## Was ist seit dem letzten Eintrag (2026-09-08) passiert?

Gute Nachrichten zuerst: Beide Vorschläge aus meinem letzten Bericht sind
jetzt wirklich behoben. Die Unterkunftssuche im Chat zeigt jetzt die
konkrete Duffel-Fehlermeldung statt immer desselben Satzes
(`useChat.ts` nutzt jetzt `stayErrors: DuffelError[]` statt eines reinen
Booleans, `HotelResults.tsx` zeigt sie an — genau nach dem Flug-Vorbild).
Und der Ladetext bei Zug/Bus/Fähre verspricht keine "echte" Suche mehr,
solange keine Datenquelle angebunden ist. Ich habe beides im Code
nachgelesen — beide Fälle sind sauber zu.

Für diesen Bericht habe ich bewusst nicht nochmal nach technischen Bugs
gesucht (das hat IT-Chef gerade erst sehr gründlich für viele Seiten
gemacht, ohne Fund) — sondern gezielt aus reiner Nutzersicht auf
Bestätigungen, Sackgassen und Rückmeldungen geschaut. Dabei sind mir vier
neue Reibungspunkte aufgefallen.

## Meine Vorschläge

1. **"Neu starten" im KI-Chat löscht die ganze Reiseplanung sofort, ohne
   Rückfrage.** `src/components/chat/KiChat.tsx:74–77, 109` löst mit
   einem einzigen Klick auf ein reines Icon (kein Text, kein
   Bestätigungsdialog) `resetChat()` aus — das räumt Chatverlauf, Reiseplan
   und den localStorage-Eintrag komplett weg. Wer aus Versehen daneben
   tippt (z. B. auf dem Handy neben dem Lautsprecher-Icon), verliert eine
   möglicherweise lange Planung unwiderruflich, ohne Chance auf Rückgängig.
   *Vorschlag:* Kurze Bestätigung ("Wirklich neu starten? Deine aktuelle
   Planung geht verloren.") vor dem eigentlichen Reset.

2. **Löschen ist an mehreren Stellen sofort und endgültig, ohne
   Bestätigung oder Rückgängig.** Gleiches Muster in
   `src/pages/Preisalarme.tsx:45,94` (`removeAlert`) und
   `src/pages/Favoriten.tsx:40,88` (`removeFavorite`), ebenso in
   `Angebote.tsx`, `Aktivitaeten.tsx` und `Warenkorb.tsx`: Ein Klick auf
   das Papierkorb-/X-Icon entfernt den Eintrag direkt aus dem State, ohne
   Nachfrage und ohne "Rückgängig"-Toast. Bei einem Preisalarm oder einem
   Warenkorb-Eintrag, an dem man länger gesucht hat, ist ein Fehlklick
   besonders ärgerlich. *Vorschlag:* Einheitlich einen kurzen
   Bestätigungsdialog oder zumindest einen "Rückgängig"-Toast nach dem
   Entfernen einführen — an einer Stelle lösen, dann überall gleich
   anwenden.

3. **Der Warenkorb ist eine Sackgasse — es gibt keinen "Jetzt
   buchen"-Button.** `src/pages/Warenkorb.tsx` endet nach der
   Summen-Karte (Zeile 109–117) einfach so; es gibt keine Aktion, um von
   "ausgewählte Leistungen" tatsächlich zur Buchung zu kommen. Wer seinen
   Warenkorb ansieht, erwartet als nächsten Schritt logischerweise einen
   Buchen-Button — der fehlt komplett. *Vorschlag:* Entweder einen
   "Jetzt buchen"/"Zur Kasse"-Button ergänzen, oder — falls das bewusst
   (noch) nicht vorgesehen ist, weil Direktbuchung laut IT-Chef-Bericht
   ohnehin nur ein Redirect zum Anbieter ist — der Nutzerin das im Text
   auf der Seite kurz erklären, statt sie ratlos zurückzulassen.

4. **"Planung fortsetzen" bei Reiseentwürfen führt immer zum selben,
   generischen Chat statt zum jeweiligen Entwurf.** In
   `src/pages/Reiseentwuerfe.tsx:155` verlinkt der Button bei jeder
   Entwurfskarte identisch auf `/ki-chat`, ohne die jeweilige Entwurfs-ID
   mitzugeben. Wer zwei Entwürfe sieht (z. B. Lissabon und Kyoto) und bei
   Kyoto auf "Planung fortsetzen" klickt, landet trotzdem im einen,
   global gespeicherten Chat — nicht zwingend beim richtigen Entwurf. Das
   kann zu Verwirrung führen ("wo ist meine Kyoto-Planung hin?").
   *Vorschlag:* Die Entwurfs-ID als Parameter mitgeben und den Chat beim
   Fortsetzen den passenden Entwurf laden lassen, sobald mehrere Entwürfe
   gleichzeitig unterstützt werden sollen — oder, als Kurzfristlösung,
   den Nutzerinnen im Text klarmachen, dass aktuell nur eine aktive
   Planung gleichzeitig möglich ist.

_Letztes Update: 2026-09-09_
