# Support-Chef Bericht

**Datum:** 2026-08-17

## Was ist seit dem letzten Eintrag (2026-08-16) passiert?

Nach ein paar ruhigen Tagen ist wieder Code dazugekommen: Der IT-Chef hat
den Bearbeiten-Modus für Trip-Aktivitäten gebaut (`EditMode.tsx`, Nutzer
können Aktivitäten zu ihrer laufenden Reise hinzufügen, entfernen und im
Preis anpassen) sowie eine neue Übersichtsseite `/aktivitaeten`. Beim
Durchschauen ist mir dabei aufgefallen, dass die neue Übersichtsseite und
der neue Bearbeiten-Modus zwei getrennte Welten sind — mehr dazu in
Punkt 1. Die vier länger bekannten Punkte aus den letzten Berichten habe
ich im Code erneut nachgeprüft: alle weiterhin unverändert offen.

## Meine Vorschläge

1. **Neue Aktivitäten-Seite zeigt Demo-Daten, die mit den echten
   Trip-Aktivitäten nichts zu tun haben.** `src/pages/Aktivitaeten.tsx:19-24`
   hält eine eigene, fest im Code stehende Liste. Der am selben Tag gebaute
   Bearbeiten-Modus (`src/components/trip/EditMode.tsx`) speichert echte
   Aktivitäten dagegen direkt an der Reise (`updateStoredTrip`). Wer in der
   Buchung eine Aktivität hinzufügt, sieht sie auf `/aktivitaeten` nicht —
   und umgekehrt. Die Seite nennt sich in der Navigation "Alle geplanten
   Aktivitäten", zeigt davon aber aktuell keine einzige echte. Das würde bei
   echten Nutzerdaten sofort aus Vertrauen Verwirrung machen.

2. **Aktivitäten- und Angebote-Karten haben nur einen Entfernen-Button,
   sonst keine Handlungsmöglichkeit.** `src/pages/Aktivitaeten.tsx:70-83`
   und schon vorher `src/pages/Angebote.tsx:80-113`: Beide Kartenlisten
   lassen sich nur löschen, nicht weiterverfolgen. `Favoriten.tsx:96-101`
   macht es mit einem "Reise mit KI planen"-Button besser vor — dasselbe
   Muster fehlt jetzt an zwei Stellen und wiederholt sich, statt behoben zu
   werden.

3. **Weiterhin offen: rohe, englische Duffel-Fehlermeldungen im UI.**
   `src/lib/duffel/client.ts:24`: Fehler von der Flug-/Hotel-API werden
   unübersetzt durchgereicht. Bleibt aus meiner Sicht der größte einzelne
   Vertrauens-Reibungspunkt der App und ist mittlerweile der am längsten
   offene Punkt in diesem Bericht.

4. **Weiterhin offen, zur Erinnerung:** Mikrofon-Fehler bleiben unsichtbar
   (`src/lib/ai/speech.ts:47` — eine verweigerte Berechtigung sieht für die
   Nutzerin aus wie ein normales Aufnahmeende), und bei Preisalarmen fehlt
   ausgerechnet bei erreichtem Ziel ein Handlungs-Button
   (`src/pages/Preisalarme.tsx:80-109`).

_Letztes Update: 2026-08-17_
