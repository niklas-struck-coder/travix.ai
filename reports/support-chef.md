# Support-Chef Bericht

**Datum:** 2026-10-20

## Was ist seit dem letzten Eintrag (2026-10-19) passiert?

Code-seitig war seit gestern wenig los, und nichts davon betrifft dich als
Nutzer negativ: IT-Chef hat einen Mitternachts-Bug im Kalender gefixt
(`src/pages/Kalender.tsx` – "heute" blieb auf dem alten Tag stehen, wenn
der Tab über Mitternacht offen blieb), der Rest war Testabdeckung. Das ist
ein reiner Pluspunkt, kein neuer Reibungspunkt.

Alle drei Punkte aus meinem letzten Bericht habe ich heute im Code erneut
geprüft – sie stehen unverändert:

1. **`formatTime()`-Fix immer noch nicht live.** `src/lib/format.ts:23`
   hat weiterhin keinen Schutz gegen einen kaputten Zeitstempel und würde
   bei einer fehlerhaften Angebots-Antwort wörtlich "Invalid Date" auf
   der Flug-/Zugkarte zeigen. Der fertige Fix liegt laut IT-Chef und
   Marketing-Chef weiterhin in PR #34, die noch offen ist.

2. **Lösch-Warnungen klingen überall gleich dramatisch.**
   `Favoriten.tsx:128`, `Warenkorb.tsx:134`, `Preisalarme.tsx:137`,
   `Aktivitaeten.tsx:118` und `src/components/trip/EditMode.tsx:151`
   sagen weiterhin wortgleich "Das lässt sich nicht rückgängig machen" –
   auch dort, wo ein Favorit oder eine Aktivität mit einem Klick wieder
   anlegbar wäre. *Vorschlag bleibt:* den Warnhinweis nur dort so hart
   formulieren, wo wirklich etwas Unwiderrufliches passiert.

3. **Urlaubsmodus-Link von der Lissabon-Demokarte führt ins Leere.**
   `src/pages/MeineReisen.tsx:49` verlinkt weiterhin auf `/urlaubsmodus`,
   die Seite (`src/pages/Urlaubsmodus.tsx:12`) lädt ihren Trip aber immer
   noch aus `loadStoredChat()?.trip` statt aus der Demoreise. Wer noch nie
   mit dem KI-Chat geplant hat, landet beim Klick ohne Reisebezug.
   *Vorschlag bleibt:* die Demokarte mit echten Lissabon-Daten befüllen
   oder ausblenden, bis echte Buchungen angebunden sind.

## Meine Vorschläge

1. **PR #34 (formatTime()-Fix) zeitnah mergen** – der Fund ist seit
   zwei Tagen bekannt und fertig vorbereitet, nur noch nicht live.
2. **Lösch-Warnungen abstufen** je nach Reversibilität der Aktion (siehe
   oben, fünf betroffene Dateien).
3. **Urlaubsmodus-Demo reparieren oder ausblenden**, damit die
   Lissabon-Karte nicht in einer leeren Seite endet.

_Letztes Update: 2026-10-20_
