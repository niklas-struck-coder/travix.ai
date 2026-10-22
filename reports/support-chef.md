# Support-Chef Bericht

**Datum:** 2026-10-22

## Was ist seit dem letzten Eintrag (2026-10-21) passiert?

Eine gute Nachricht zuerst: Der Urlaubsmodus-Link von der Lissabon-
Demokarte (mein letzter Punkt 3) ist gefixt und ich habe es im Code
nachgeprüft – `src/pages/MeineReisen.tsx:49` übergibt jetzt Ziel und
Zeitraum direkt an `/urlaubsmodus`, die Seite zeigt die passende Demo-
Reise statt ins Leere zu laufen. Der Fix funktioniert.

Die beiden Merge-Baustellen von gestern stehen aber unverändert offen –
das habe ich heute erneut direkt im Code geprüft, nicht nur in den
Berichten:

1. **PR #34 (`formatTime()`-Fix) weiterhin nicht live.**
   `src/lib/format.ts:23` zeigt bei einem kaputten Zeitstempel weiterhin
   wörtlich "Invalid Date" statt eines Platzhalters. Der Fix liegt seit
   nunmehr vier Tagen fertig vor, ist aber noch nicht gemergt.

2. **PR #38 ("+ Suchen"-Edit-Shortcut) ebenfalls weiterhin nicht live.**
   `src/pages/Buchung.tsx:128` verlinkt ein leeres Feld (Transport,
   Reisedaten, Budget, Unterkunft) immer noch fest auf `/ki-chat`, statt
   wie der Stift-Button bei bereits gesetzten Feldern gezielt in den
   passenden Chat-Schritt zu springen. Wer heute ein leeres Feld über
   "+ Suchen" ausfüllen will, merkt von dem fertigen Fix noch nichts.

Neu aufgefallen, beim Durchsehen der Entwürfe-Seite:

3. **"Entwurf abschließen" sieht aus wie eine Löschwarnung.**
   `src/pages/Reiseentwuerfe.tsx:357` warnt beim Abschließen eines
   Reiseentwurfs mit demselben Satz wie beim Löschen ("Das lässt sich
   nicht rückgängig machen"), und der Bestätigungs-Button ("Ja,
   abschließen", Zeile 363) ist genauso rot eingefärbt (`variant=
   "destructive"`) wie der Löschen-Button direkt darüber im selben
   File. Dabei ist das Abschließen eines Entwurfs ein positiver
   Meilenstein – kein Verlust. Die rote Einfärbung und die dramatische
   Formulierung könnten Nutzer:innen unnötig zögern lassen, bevor sie
   ihre fertige Reiseplanung bestätigen.

## Meine Vorschläge

1. **PR #34 (`formatTime()`-Fix) zeitnah mergen** – der Fund ist jetzt
   seit vier Tagen bekannt und fertig vorbereitet, nur noch nicht live.
2. **PR #38 ("+ Suchen"-Edit-Shortcut) ebenfalls zeitnah mergen** –
   kleiner, klar abgegrenzter Fix mit direkter Auswirkung auf den
   Buchungsablauf.
3. **Lösch-Warnungen abstufen** je nach Reversibilität der Aktion
   (unverändert betroffen: `Favoriten.tsx:128`, `Warenkorb.tsx:134`,
   `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118`,
   `src/components/trip/EditMode.tsx:151`).
4. **"Entwurf abschließen" positiv statt destruktiv gestalten**
   (`Reiseentwuerfe.tsx:357` & `:363`) – neutraleren Text ohne
   "rückgängig machen"-Drohung und einen normalen statt roten Button
   verwenden, damit ein Abschluss sich auch wie ein Erfolg anfühlt.

_Letztes Update: 2026-10-22_
