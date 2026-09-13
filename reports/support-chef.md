# Support-Chef Bericht

**Datum:** 2026-09-13

## Was ist seit dem letzten Eintrag (2026-09-12) passiert?

Gute Nachrichten zuerst: Zwei ältere Support-Chef-Funde wurden seit
gestern tatsächlich behoben. Der Neu-starten-Dialog im KI-Chat zeigt
jetzt nicht mehr fälschlich eine "Deine Planung geht verloren"-Warnung,
wenn noch gar keine Trip-Daten existieren (`src/components/chat/KiChat.tsx`).
Und die Hinweiskarte zu geteilten Chats auf `/reiseentwuerfe` zählt
abgeschlossene Entwürfe nicht mehr fälschlich mit. Beide waren echte
Verwirrungspunkte für Nutzer:innen — schön, dass sie draußen sind.

Bei der Hilfe-Seite von gestern gab es eine Teil-Korrektur: Der interne
Begriff "Travix-Grundgerüst" wurde aus dem Platzhaltertext entfernt
(`src/pages/PlaceholderPage.tsx`). Das eigentliche Problem — keine
FAQ, kein Kontaktweg auf `/hilfe` — besteht aber weiter, siehe Punkt 1.
Laut `ZEITPLAN.md` ist echter FAQ-Inhalt für Sprint 2 vorgesehen, das ist
also bekannt und eingeplant, nicht übersehen.

Meine zwei anderen Vorschläge von gestern (Löschen ohne Bestätigung,
Warenkorb ohne Buchen-Button) habe ich im aktuellen Code gegengeprüft:
beide unverändert offen.

## Meine Vorschläge

1. **Die Hilfe-Seite (`/hilfe`) hilft immer noch nicht wirklich.** Der
   interne Jargon ist raus, aber `src/pages/PlaceholderPage.tsx` zeigt
   weiterhin nur "Hilfe wird als Nächstes gebaut" — keine FAQ, kein
   Kontaktweg, kein Link. Wer mit einem Problem auf `/hilfe` klickt,
   geht leer aus. *Vorschlag:* Bis die echten FAQ-Inhalte aus Sprint 2
   stehen, würde schon ein einziger Satz mit Kontakthinweis reichen,
   damit die Seite nicht komplett ins Leere läuft.

2. **Löschen ist an mehreren Stellen sofort und endgültig, ohne
   Bestätigung oder Rückgängig.** Weiterhin so in
   `src/pages/Preisalarme.tsx` (`removeAlert`), `src/pages/Favoriten.tsx`
   (`removeFavorite`), `src/pages/Angebote.tsx` (`removeOffer`),
   `src/pages/Aktivitaeten.tsx` (`removeActivity`) und
   `src/pages/Warenkorb.tsx` (`removeItem`): ein Klick auf das X-Icon
   entfernt den Eintrag direkt. *Vorschlag:* einheitlich einen kurzen
   Bestätigungsdialog oder einen "Rückgängig"-Toast einführen — einmal
   festlegen, dann überall gleich anwenden.

3. **Der Warenkorb bleibt eine Sackgasse.** `src/pages/Warenkorb.tsx`
   endet weiterhin nach der Summen-Karte ohne Buchen-Button oder
   Buchungs-Hinweis. Das hängt vermutlich mit der noch offenen
   Grundsatzfrage "eigener Zahlungsprozess vs. Buchung beim Anbieter"
   zusammen (siehe "Offene Entscheidungen" in `ZEITPLAN.md`) — nachvoll-
   ziehbar, dass das noch wartet. *Vorschlag:* Solange die Entscheidung
   aussteht, wenigstens einen kurzen erklärenden Satz einblenden ("Buchung
   folgt in Kürze" o.ä.), statt die Nutzerin kommentarlos vor der
   Summen-Karte stehen zu lassen.

_Letztes Update: 2026-09-13_
