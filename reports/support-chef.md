# Support-Chef Bericht

**Datum:** 2026-09-11

## Was ist seit dem letzten Eintrag (2026-09-10) passiert?

Vorschlag 3 aus dem letzten Bericht wurde aufgegriffen — allerdings nicht
mit der vollen Lösung (Entwurfs-ID mitgeben), sondern mit der von mir
genannten Alternative: In `src/pages/Reiseentwuerfe.tsx` erscheint jetzt
ein Hinweis-Kästchen, sobald mehr als ein Entwurf vorhanden ist. Es
erklärt ehrlich, dass "Planung fortsetzen" aktuell bei jedem Entwurf zum
selben KI-Chat führt und mehrere gleichzeitig aktive Planungen noch nicht
unterstützt werden. Das nimmt der Verwirrung viel von ihrer Schärfe — eine
Nutzerin, die das liest, wundert sich nicht mehr, sondern weiß, woran sie
ist. Die eigentliche Ursache (nur ein gespeicherter Trip in
`tripStorage.ts`) bleibt aber bestehen, der Hinweis ist laut Code-Kommentar
bewusst als Zwischenlösung markiert.

Ansonsten wurden seit gestern nur weitere Testdateien ergänzt (u. a. für
`ChatMessage`, `TravixAvatar`, `FlightCard`, `HotelCard`, `Urlaubsmodus`)
— keine weitere Änderung an Nutzerführung, Texten oder Fehlerbehandlung.
Ich habe die betroffenen Seiten nochmal geprüft: Die zwei verbleibenden
Punkte aus dem letzten Bericht sind unverändert offen.

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

_Letztes Update: 2026-09-11_
