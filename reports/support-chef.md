# Support-Chef Bericht

**Datum:** 2026-09-12

## Was ist seit dem letzten Eintrag (2026-09-11) passiert?

An der eigentlichen Nutzerführung hat sich seit gestern nichts geändert —
die Commits seit dem letzten Bericht sind ausschließlich neue Testdateien
(u. a. für `QuickReplies`, `TripSummaryCard`, `PageHeader`, `KiChat`,
`PlaceholderPage`). Die zwei Vorschläge von gestern habe ich im Code
gegengeprüft: beide sind unverändert offen.

Dafür ist mir beim Gegenprüfen ein neuer, konkreter Reibungspunkt
aufgefallen — ausgerechnet auf der Hilfe-Seite. Den nehme ich unten mit
auf.

## Meine Vorschläge

1. **Die Hilfe-Seite (`/hilfe`) ist selbst nicht hilfreich.** Laut
   `src/lib/nav-config.ts:77` läuft "Hilfe" (Beschreibung: "FAQ und
   Support") über dieselbe generische `src/pages/PlaceholderPage.tsx` wie
   noch nicht gebaute Bereiche. Der Text dort lautet wörtlich: "Diese
   Seite ist Teil des Travix-Grundgerüsts" — ein interner Begriff, der in
   Nutzertexten nichts zu suchen hat. Es gibt außerdem keinerlei Button
   oder Link, nicht mal einen Kontaktweg. Wer auf `/hilfe` klickt, weil er
   ein Problem hat, findet keine FAQ, keinen Kontakt, nur einen
   Bau-Hinweis. *Vorschlag:* Für `/hilfe` mindestens einen Mailto-Link
   oder Kontakthinweis statt der generischen Platzhalter-Komponente
   verwenden, bis echte FAQ-Inhalte da sind.

2. **Löschen ist an mehreren Stellen sofort und endgültig, ohne
   Bestätigung oder Rückgängig.** Weiterhin so in
   `src/pages/Preisalarme.tsx` (`removeAlert`), `src/pages/Favoriten.tsx`
   (`removeFavorite`), `src/pages/Angebote.tsx` (`removeOffer`),
   `src/pages/Aktivitaeten.tsx` (`removeActivity`) und
   `src/pages/Warenkorb.tsx` (`removeItem`): ein Klick auf das
   Papierkorb-/X-Icon entfernt den Eintrag direkt, ohne Nachfrage und ohne
   "Rückgängig"-Toast. *Vorschlag:* einheitlich einen kurzen
   Bestätigungsdialog oder zumindest einen "Rückgängig"-Toast einführen —
   einmal festlegen, dann überall gleich anwenden.

3. **Der Warenkorb ist eine Sackgasse.** `src/pages/Warenkorb.tsx` endet
   nach der Summen-Karte, ohne Aktion zur eigentlichen Buchung — keinerlei
   Verweis auf "buchen" oder "Kasse" im Code. Wer seinen Warenkorb ansieht,
   erwartet als nächsten Schritt logischerweise einen Buchen-Button.
   *Vorschlag:* entweder einen "Jetzt buchen"-Button ergänzen, oder — falls
   Direktbuchung bewusst (noch) nicht vorgesehen ist — das kurz im Text
   erklären, statt die Nutzerin ratlos zurückzulassen.

_Letztes Update: 2026-09-12_
