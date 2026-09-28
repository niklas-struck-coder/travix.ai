# Marketing-Chef Bericht

**Datum:** 2026-09-28

## Was ist seit dem letzten Eintrag (2026-09-27) passiert?

Gute Nachricht zuerst: Der Merge-Rückstau, den ich gestern als Risiko
vermerkt hatte, ist aufgelöst. `it-chef/auto` wurde heute Nacht nach
`main` gemergt — damit sind alle drei Teile der "Klarname statt
Rohdaten"-Serie (IATA-Code-Fix, Hin-/Rückflug-Label, FlightCard/
TrainCard-Namensfallback) jetzt wirklich live und nicht mehr nur
"gefixt, aber nicht sichtbar". Passend dazu liegt bereits ein fertiger
Content-Entwurf dazu vor (`marketing/content-stueck-klarname-statt-
rohdaten.md`), der genau diese drei Fixes bündelt.

Direkt danach kam schon der nächste, verwandte Fund: `detectTransport
Mode()` erkennt zusammengesetzte Wörter wie "Flugticket", "Busticket",
"Autovermietung" und "Schifffahrt" nicht (Wortgrenzen-Lücke, PR #24,
noch nicht gemergt). Inhaltlich dieselbe Erzählung wie die Klarname-
Serie ("wir nehmen dich beim Wort"), aber noch nicht spruchreif, da
der Fix noch nicht in `main` ist.

Die Kanal-/Zielgruppen-Entscheidung (Sprint 1) ist laut Content-Plan
weiterhin explizit als "Nis bewusste Entscheidung, kein Agent trifft
sie autonom" markiert — noch offen, jetzt über sieben Wochen. Keine
neuen Nutzungs- oder Erfolgszahlen bekannt.

## Vorschläge

1. **Die "Klarname statt Rohdaten"-Story ist jetzt tatsächlich
   einsatzbereit — nicht nur gefixt, sondern live.** Der Entwurf liegt
   fertig da. Sobald die Kanal-Frage geklärt ist, ist das der
   naheliegende erste Post: zeigt an einem konkreten, nachvollziehbaren
   Beispiel, dass "Ehrlichkeit als Feature" kein Marketing-Spruch ist,
   sondern sich im Code niederschlägt.

2. **Neuen Fund (Flugticket/Busticket/Autovermietung) als möglichen
   Teil 2 der Serie vormerken, aber nicht vorziehen.** Erst posten,
   wenn PR #24 gemerged ist — sonst wird wieder aus einem "gefixt"
   fälschlich ein "live", genau das Muster, das gestern noch als
   Risiko galt. Bis dahin: nur intern notieren, nicht ausformulieren.

3. **Die Fix-Geschwindigkeit selbst ist eine kleine "Build in
   public"-Nebengeschichte wert.** Derselbe Wortgrenzen-Bug wurde
   gestern für "Zugticket" gefunden und behoben, heute für vier weitere
   Begriffe erkannt und ebenfalls direkt gefixt (PR #24) — plus eine
   Aufräumung von über zehn inzwischen redundanten alten Auto-Fix-PRs.
   Für Säule 3 (Build in public) im Content-Plan ein ehrliches Beispiel
   dafür, wie hier tatsächlich gearbeitet wird — keine Kennzahl nötig,
   nur der Ablauf selbst.

4. **Kanal-Frage bleibt der eigentliche Engpass.** Über sieben Wochen
   offen, und der Rückstau an einsatzbereitem Material wächst spürbar
   (jetzt zwei fertige Content-Stücke plus Kampagnen-Konzept plus
   Content-Plan) — reine Erinnerung, keine neue Idee dazu.

_Letztes Update: 2026-09-28_
