# Support-Chef Bericht

**Datum:** 2026-09-17

## Was ist seit dem letzten Eintrag (2026-09-16) passiert?

Beide Punkte, die ich gestern gemeldet hatte, sind jetzt behoben: In
`src/components/trip/EditMode.tsx` fragt das Entfernen einer Aktivität
jetzt per Bestätigungsdialog nach (`setPendingRemoval`), statt sofort und
endgültig zu löschen. Und in `src/components/chat/ChatInput.tsx` stoppt
ein zweiter Klick aufs Mikrofon jetzt wirklich die laufende Aufnahme
(`recognitionRef.current?.stop()`) — der Button funktioniert damit
endlich als echter Ein-/Ausschalter. Zusätzlich markiert `Kalender.tsx`
"Heute" jetzt auch für Screenreader.

Frisch dazugekommen ist `Reiseentwuerfe.tsx`: Die Seite hat inzwischen
denselben Lösch-Bestätigungsdialog wie die anderen fünf Seiten bekommen,
der zentrale Fokus-Fix in `dialog.tsx` greift hier automatisch mit. Beim
genaueren Hinschauen sind mir dabei aber zwei neue Reibungspunkte
aufgefallen (siehe unten).

Offen geblieben, unverändert gegenüber gestern: die Hilfe-Seite (`/hilfe`)
zeigt weiterhin nur einen Platzhaltertext.

## Meine Vorschläge

1. **Duplizierte Reiseentwürfe sind für Screenreader-Nutzer:innen nicht
   mehr unterscheidbar.** `src/pages/Reiseentwuerfe.tsx:209,221,232,242`:
   Alle Aktions-Buttons (Pausieren, Abschließen, Duplizieren, Löschen)
   bekommen ihr `aria-label` nur aus `draft.destination`. Nach einem Klick
   auf "Duplizieren" (`duplicateDraft()`, Zeile 100-108) tragen Original
   und Kopie exakt dasselbe Label, z. B. zweimal "Lissabon löschen" — wer
   per Screenreader navigiert, kann die beiden Karten an dieser Stelle
   nicht mehr auseinanderhalten. *Vorschlag:* die Labels um ein
   unterscheidendes Merkmal ergänzen, z. B. Reisedatum oder Kartenindex.

2. **"Abschließen" ist ohne Rückfrage endgültig — anders als "Löschen"
   auf derselben Karte.** `src/pages/Reiseentwuerfe.tsx:216-227` bzw.
   `finalizeDraft()` Zeile 94-98: Ein Klick setzt den Status sofort auf
   "finalized", danach verschwinden Pausieren- und Abschließen-Button von
   der Karte, ein Zurück gibt es nicht. Die beiden Buttons stehen
   nebeneinander und unterscheiden sich nur durchs Icon — ein Fehlklick
   ist also leicht möglich, lässt sich aber nicht rückgängig machen,
   während "Löschen" auf derselben Karte extra nachfragt. *Vorschlag:*
   entweder denselben Bestätigungsdialog auch vor "Abschließen" schalten,
   oder einen kurzen "Rückgängig"-Hinweis direkt nach dem Klick anzeigen.

3. **Die Hilfe-Seite (`/hilfe`) hilft weiterhin nicht wirklich.**
   `src/pages/PlaceholderPage.tsx:16` zeigt nach wie vor nur "Hilfe wird
   als Nächstes gebaut" — kein FAQ, kein Kontaktweg. Wer mit einem
   Problem dorthin klickt, geht leer aus. *Vorschlag:* bis der echte
   Inhalt kommt, reicht vorerst schon ein Satz mit Kontakthinweis.
