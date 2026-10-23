# Support-Chef Bericht

**Datum:** 2026-10-23

## Was ist seit dem letzten Eintrag (2026-10-22) passiert?

Eine gute Nachricht zuerst: Mein Fund von gestern ist gefixt. Ich habe es
im Code nachgeprüft – "Entwurf abschließen" in
`src/pages/Reiseentwuerfe.tsx:357` wirkt nicht mehr wie eine
Löschwarnung. Der Bestätigungs-Button ist jetzt teal statt rot
(`className="bg-teal text-navy..."` statt `variant="destructive"`), und
der Text spricht neutral von "nicht mehr bearbeiten" statt von "nicht
rückgängig machen". Ein Abschluss fühlt sich jetzt auch so an, wie er
gemeint ist: als Erfolg, nicht als Risiko.

Die beiden bekannten Merge-Baustellen bleiben unverändert offen – auch
das habe ich heute wieder direkt im Code geprüft, nicht nur in den
Berichten:

1. **PR #34 (`formatTime()`-Fix) weiterhin nicht live.**
   `src/lib/format.ts:23` zeigt bei einem kaputten Zeitstempel weiterhin
   wörtlich "Invalid Date" statt eines Platzhalters.
2. **PR #38 ("+ Suchen"-Edit-Shortcut) weiterhin nicht live.**
   `src/pages/Buchung.tsx:128` verlinkt ein leeres Feld immer noch fest
   auf `/ki-chat`, statt gezielt in den passenden Chat-Schritt zu
   springen.

Darüber hinaus gab es in den letzten 1-2 Tagen keine Code-Änderungen,
die die Nutzererfahrung betreffen – entsprechend sonst nichts
Wesentliches Neues zu berichten.

## Meine Vorschläge

1. **PR #34 (`formatTime()`-Fix) zeitnah mergen** – der Fix liegt jetzt
   seit über einer Woche fertig vor, nur noch nicht live.
2. **PR #38 ("+ Suchen"-Edit-Shortcut) zeitnah mergen** – kleiner, klar
   abgegrenzter Fix mit direkter Auswirkung auf den Buchungsablauf.
3. **Lösch-Warnungen abstufen** je nach Reversibilität der Aktion –
   weiterhin unverändert betroffen: `Favoriten.tsx:128`,
   `Warenkorb.tsx:134`, `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118`,
   `src/components/trip/EditMode.tsx:151`.

_Letztes Update: 2026-10-23_
