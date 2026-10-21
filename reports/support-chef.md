# Support-Chef Bericht

**Datum:** 2026-10-21

## Was ist seit dem letzten Eintrag (2026-10-20) passiert?

Seit gestern kam Bewegung in die Buchungsseite: Mein eigener autonomer
Hintergrund-Lauf hat dort einen neuen Bug gefunden (dazu gleich mehr),
IT-Chef hat ihn als klar genug für einen Fix eingestuft und bereits als
PR #38 vorbereitet – der ist aber noch nicht live auf `main`. Die drei
Punkte aus meinem letzten Bericht habe ich heute erneut im Code
geprüft, sie stehen weiterhin unverändert:

1. **`formatTime()`-Fix immer noch nicht live.** `src/lib/format.ts:23`
   hat weiterhin keinen Schutz gegen einen kaputten Zeitstempel und
   würde bei einer fehlerhaften Angebots-Antwort wörtlich "Invalid
   Date" auf der Flug-/Zugkarte zeigen. PR #34 liegt fertig vor, ist
   aber seit nunmehr drei Tagen nicht gemergt.

2. **Lösch-Warnungen klingen überall gleich dramatisch.**
   `Favoriten.tsx:128`, `Warenkorb.tsx:134`, `Preisalarme.tsx:137`,
   `Aktivitaeten.tsx:118` und `src/components/trip/EditMode.tsx:151`
   sagen weiterhin wortgleich "Das lässt sich nicht rückgängig machen" –
   auch dort, wo ein Favorit oder eine Aktivität mit einem Klick wieder
   anlegbar wäre.

3. **Urlaubsmodus-Link von der Lissabon-Demokarte führt ins Leere.**
   `src/pages/MeineReisen.tsx:49` verlinkt weiterhin auf `/urlaubsmodus`,
   die Seite (`src/pages/Urlaubsmodus.tsx:12`) lädt ihren Trip aber immer
   noch aus `loadStoredChat()?.trip` statt aus der Demoreise.

Neu dazugekommen, direkt bestätigt im aktuellen `Buchung.tsx`:

4. **"+ Suchen"-Button bei leeren Feldern nutzt den Edit-Shortcut nicht.**
   `src/pages/Buchung.tsx:128`: Ist ein Feld (Transport, Reisedaten,
   Budget, Unterkunft) schon gesetzt, führt der Stift-Button gezielt in
   den passenden Chat-Schritt (z. B. `/ki-chat?edit=budget`). Ist das
   Feld noch leer, verlinkt der "+ Suchen"-Button an derselben Stelle
   stattdessen fest auf `/ki-chat` – ohne jeden Hinweis, worum es im
   Chat gerade geht. Genau umgekehrt zum eigentlichen Bedarf: bei einem
   leeren Feld würde die gezielte Nachfrage am meisten Zeit sparen. PR
   #38 behebt das mit einer Zeile, wartet aber noch auf Review.

## Meine Vorschläge

1. **PR #34 (formatTime()-Fix) zeitnah mergen** – der Fund ist seit drei
   Tagen bekannt und fertig vorbereitet, nur noch nicht live.
2. **PR #38 ("+ Suchen"-Edit-Shortcut) ebenfalls zeitnah mergen** – kleiner,
   klar abgegrenzter Fix mit direkter Auswirkung auf den Buchungsablauf.
3. **Lösch-Warnungen abstufen** je nach Reversibilität der Aktion (siehe
   oben, fünf betroffene Dateien).
4. **Urlaubsmodus-Demo reparieren oder ausblenden**, damit die
   Lissabon-Karte nicht in einer leeren Seite endet.

_Letztes Update: 2026-10-21_
