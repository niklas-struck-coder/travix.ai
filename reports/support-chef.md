# Support-Chef Bericht

**Datum:** 2026-09-14

## Was ist seit dem letzten Eintrag (2026-09-13) passiert?

Guter Tag: Drei von fünf "Löschen ohne Rückfrage"-Stellen aus meinem
zweiten Vorschlag sind jetzt behoben. Preisalarme (`removeAlert`),
Favoriten (`removeFavorite`) und Angebote (`removeOffer`) fragen vor dem
endgültigen Entfernen jetzt mit einem Bestätigungsdialog nach — genau das
einheitliche Muster, das ich vorgeschlagen hatte. Zusätzlich respektiert
die Seitenübergangs-Animation jetzt die Systemeinstellung "Bewegungen
reduzieren", und Schließen-Buttons in Dialogen/Sheets sind nicht mehr
fest auf Englisch verdrahtet, auch wenn die App auf Deutsch läuft — beides
kleine, aber echte Verbesserungen für Nutzer:innen mit entsprechenden
Bedürfnissen.

Noch offen sind Aktivitäten (`removeActivity` in `src/pages/Aktivitaeten.tsx`)
und Warenkorb (`removeItem` in `src/pages/Warenkorb.tsx`) — dort löscht ein
Klick auf das X-Icon weiterhin sofort und endgültig, siehe Punkt 1. Laut
IT-Chef ist das bewusst so gelassen, weil ein anderer interner Kanal genau
diese zwei Seiten schon als nächste Kandidaten vorgemerkt hat — also
absehbar, kein Übersehen.

Die Hilfe-Seite (Punkt 2) und der Warenkorb als Sackgasse (Punkt 3) sind
im Code unverändert gegenüber gestern.

## Meine Vorschläge

1. **Löschen ohne Bestätigung bei Aktivitäten und Warenkorb.** Als letzte
   zwei von ursprünglich fünf Stellen fehlt hier weiterhin der
   Bestätigungsdialog, den es bei Preisalarmen, Favoriten und Angeboten
   jetzt schon gibt (`src/pages/Aktivitaeten.tsx`, `removeActivity`, und
   `src/pages/Warenkorb.tsx`, `removeItem`). *Vorschlag:* das gleiche,
   bereits dreifach bewährte Muster einfach auf diese zwei Seiten
   übertragen — technisch ein kleiner, risikoarmer Schritt.

2. **Die Hilfe-Seite (`/hilfe`) hilft immer noch nicht wirklich.**
   `src/pages/PlaceholderPage.tsx` zeigt weiterhin nur "Hilfe wird als
   Nächstes gebaut" — keine FAQ, kein Kontaktweg, kein Link. Wer mit einem
   Problem auf `/hilfe` klickt, geht leer aus. Laut `ZEITPLAN.md` ist
   echter FAQ-Inhalt für Sprint 2 vorgesehen, also bekannt und eingeplant.
   *Vorschlag:* Bis dahin würde schon ein einziger Satz mit Kontakthinweis
   reichen, damit die Seite nicht komplett ins Leere läuft.

3. **Der Warenkorb bleibt eine Sackgasse.** `src/pages/Warenkorb.tsx`
   endet weiterhin nach der Summen-Karte ohne Buchen-Button oder
   Buchungs-Hinweis. Das hängt vermutlich weiterhin an der offenen
   Grundsatzfrage "eigener Zahlungsprozess vs. Buchung beim Anbieter"
   (siehe "Offene Entscheidungen" in `ZEITPLAN.md`). *Vorschlag:* Solange
   die Entscheidung aussteht, wenigstens einen kurzen erklärenden Satz
   einblenden ("Buchung folgt in Kürze" o.ä.), statt die Nutzerin
   kommentarlos vor der Summen-Karte stehen zu lassen.

_Letztes Update: 2026-09-14_
