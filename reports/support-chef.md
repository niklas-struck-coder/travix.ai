# Support-Chef Bericht

**Datum:** 2026-08-18

## Was ist seit dem letzten Eintrag (2026-08-17) passiert?

Der IT-Chef hat zwei neue Seiten gebaut: `/kalender` (Reisekalender mit
Monatsraster, `Kalender.tsx`) und einen überarbeiteten `/warenkorb`
(gruppierter Warenkorb mit Echtzeit-Summen, `Warenkorb.tsx`). Die vier
länger bekannten Punkte aus den letzten Berichten habe ich erneut im Code
geprüft: alle weiterhin unverändert offen. Dazu kommen jetzt drei neue
Beobachtungen zu den beiden neuen Seiten.

## Meine Vorschläge

1. **Der Warenkorb zeigt eine Summe, aber es gibt nirgends einen Weg
   weiterzubuchen.** `src/pages/Warenkorb.tsx:109-114` rendert die
   "Gesamt"-Karte mit dem Endbetrag, aber weder dort noch sonst irgendwo im
   Code (`src/routes.tsx`, `src/lib/nav-config.ts`) existiert ein
   "Jetzt buchen"-Button oder eine Checkout-Route. Wer bis zum Warenkorb
   kommt, sieht am Ende nur eine Zahl und keinen nächsten Schritt — für eine
   Buchungsplattform ist das der kritischste Punkt in diesem Bericht, weil
   er genau an der Stelle auftritt, an der Nutzer eigentlich Geld ausgeben
   wollen.

2. **Kalender.tsx wiederholt das Demo-Daten-Problem von Aktivitaeten.tsx —
   jetzt an einer dritten Stelle.** `src/pages/Kalender.tsx:20-23` hält
   eine eigene, fest im Code stehende `trips`-Liste (Lissabon, Kyoto), die
   nichts mit echten Buchungen oder dem `EditMode`-Datenstand zu tun hat.
   Der Code kommentiert das selbst ehrlich ("Demo trips until real, shared
   trip storage exists"), aber für Nutzer bedeutet das: Der Kalender zeigt
   immer dieselben zwei Fantasiereisen, egal was tatsächlich gebucht wurde.
   Das ist strukturell dasselbe Problem wie in meinem letzten Bericht
   (Punkt 1) — nur jetzt auf einer weiteren Seite.

3. **Warenkorb-Artikel lassen sich ohne jede Rückfrage endgültig löschen.**
   `src/pages/Warenkorb.tsx:35-37`: `removeItem` entfernt den Eintrag sofort
   bei Klick auf das X, ohne Bestätigung und ohne Rückgängig-Option. Bei
   Artikeln mit spürbaren Beträgen (im Demo-Datensatz z.B. 480 € für das
   Hotel) ist ein versehentlicher Klick teuer und nicht mehr korrigierbar,
   ohne die Auswahl komplett neu zu treffen.

4. **Weiterhin offen, zur Erinnerung — unverändert seit den letzten
   Berichten:** rohe, englische Duffel-Fehlermeldungen
   (`src/lib/duffel/client.ts:24`), unsichtbare Mikrofon-Fehler
   (`src/lib/ai/speech.ts:47`) und der fehlende Handlungs-Button bei
   erreichtem Preisalarm-Ziel (`src/pages/Preisalarme.tsx:80-109`).

_Letztes Update: 2026-08-18_
