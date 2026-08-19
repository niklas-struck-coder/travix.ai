# Support-Chef Bericht

**Datum:** 2026-08-19

## Was ist seit dem letzten Eintrag (2026-08-18) passiert?

Der IT-Chef hat beim gezielten Bug-Hunt einen neuen, bestätigten Fehler im
zentralen Chat-Ablauf gefunden (dazu unten mehr) — das ist aus
Nutzersicht der wichtigste Fund seit meinem letzten Bericht. Daneben lief
der automatische Support-Chef-Check weiter und hat `Reiseentwuerfe.tsx`
geprüft: Löschen ohne Rückfrage taucht dort jetzt zum dritten Mal an einer
neuen Stelle auf, und eine duplizierte Reisekarte ist von der Originalkarte
nicht zu unterscheiden. Die vier zuvor gemeldeten Punkte (Warenkorb ohne
Checkout, Kalender-Demo-Daten, rohe Duffel-Fehler, Mikrofon-Fehler,
fehlender Preisalarm-Button) sind alle weiterhin unverändert im Code.

## Meine Vorschläge

1. **Die KI kündigt eine Flugsuche an, die im normalen Chat-Ablauf nie
   startet.** Sobald man im Haupt-Chat (Ziel → Verkehrsmittel → Termine →
   Budget → Unterkunft) die letzte Frage beantwortet, sagt der Bot
   wörtlich, er suche jetzt nach echten Verbindungen — aber
   `src/hooks/useChat.ts:285` reagiert nur auf `nextField ===
   'accommodation'`, nicht auf den `null`-Zustand, den
   `src/lib/ai/mockAdvisor.ts:112-120` an dieser Stelle zurückgibt. Die
   echte Suche existiert nur über den "Bearbeiten"-Pfad auf der
   Buchungsseite. Für Nutzer:innen heißt das: keine Ladeanzeige, kein
   Ergebnis, kein Fehler — einfach nichts, bis der Bot beim nächsten
   Klick plötzlich "Dein Reiseplan steht!" sagt. Das ist der zentrale
   Verkaufspfad der App, deshalb würde ich das ganz oben einordnen.

2. **Der Warenkorb hat weiterhin keinen Weg zum Buchen.**
   `src/pages/Warenkorb.tsx:109-114` zeigt die Endsumme, aber es gibt
   nirgends (auch nicht in `src/routes.tsx`) einen "Jetzt buchen"-Button
   oder eine Checkout-Route. Das ist seit meinem letzten Bericht
   unverändert und bleibt für mich der zweitwichtigste Punkt, weil er
   genau dort auftritt, wo Nutzer eigentlich abschließen wollen.

3. **Löschen ohne Rückfrage wiederholt sich jetzt zum dritten Mal.**
   `src/pages/Reiseentwuerfe.tsx:90-92` (`deleteDraft`) entfernt einen
   Reiseentwurf sofort und endgültig per Klick — kein Bestätigungsdialog,
   kein Rückgängig. Dasselbe Muster steht schon bei `Angebote.tsx` und
   `EditMode.tsx`. Bei einem Entwurf mit 60 % Fortschritt (Transportmittel,
   Budget, Datum bereits ausgefüllt) ist das echte Planungsarbeit, die
   ohne Warnung weg ist. Weil sich das jetzt dreimal wiederholt, würde
   sich ein gemeinsamer, wiederverwendbarer Bestätigungs-/Rückgängig-Baustein
   lohnen, statt es dreimal einzeln nachzurüsten.

4. **Ein duplizierter Reiseentwurf ist von der Originalkarte nicht zu
   unterscheiden.** `src/pages/Reiseentwuerfe.tsx:80-88`
   (`duplicateDraft`) übernimmt Ziel, Fortschritt und Status 1:1 — beide
   Karten sehen danach identisch aus, ohne "Kopie"-Hinweis oder
   Rückmeldung, dass etwas passiert ist. Bei mehreren duplizierten
   Entwürfen wird kaum noch erkennbar, welche Karte neu und welche das
   Original ist.

_Letztes Update: 2026-08-19_
