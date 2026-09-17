# Support-Chef Bericht

**Datum:** 2026-09-16

## Was ist seit dem letzten Eintrag (2026-09-15) passiert?

Guter Fortschritt: Der Fokus-Verlust nach Bestätigungsdialogen, den ich
gestern als neuen Reibungspunkt gemeldet hatte, ist jetzt zentral in
`src/components/ui/dialog.tsx` (`DialogContent`) behoben — einmal für
alle fünf betroffenen Seiten (Preisalarme, Favoriten, Angebote,
Aktivitäten, Warenkorb), statt fünf Einzellösungen. Außerdem bricht
Enter jetzt keine laufende IME-Komposition mehr ab, das heißt
Nutzer:innen mit japanischer/koreanischer/chinesischer Eingabe können im
Chat und in `EditMode.tsx` wieder problemlos tippen, ohne dass ihre Eingabe
vorzeitig abgeschickt wird. Auch technisch robuster: `formatDuration()`
zeigte bei Flug-/Zugverbindungen mit mehr als 24 Stunden Gesamtdauer
bisher einen rohen technischen Zeitstempel statt einer lesbaren Dauer an
— das ist jetzt gefixt.

Die Hilfe-Seite (`/hilfe`) und der Warenkorb als Sackgasse sind
gegenüber gestern unverändert offen geblieben.

## Meine Vorschläge

1. **Aktivität im Bearbeiten-Dialog löschen fragt nicht nach — als
   einzige Stelle mehr.** `src/components/trip/EditMode.tsx:76-83`: Der
   Papierkorb-Button entfernt eine Aktivität weiterhin sofort und
   endgültig, ohne Rückfrage. Das fällt jetzt besonders auf, weil genau
   dasselbe Löschen auf der Aktivitäten-Liste (`/aktivitaeten`)
   inzwischen mit dem bewährten Bestätigungsdialog abgesichert ist —
   im dazugehörigen Bearbeiten-Dialog für dieselben Aktivitäten aber
   nicht. *Vorschlag:* das bereits fünffach genutzte Dialog-Muster auch
   hier auf den Trash-Button anwenden, kein neuer Entwurf nötig.

2. **Laufende Spracheingabe lässt sich nicht abbrechen.**
   `src/components/chat/ChatInput.tsx:26-33`: Ein zweiter Klick auf das
   Mikrofon-Icon während der Aufnahme tut nichts — `handleMicClick()`
   bricht einfach ab, wenn schon aufgenommen wird. Wer aus Versehen
   draufklickt, muss abwarten, bis der Browser von selbst aufhört, oder
   riskiert eine ungewollt übernommene Nachricht. *Vorschlag:* den
   `recognition`-Rückgabewert von `startListening()` merken und bei
   erneutem Klick `recognition.stop()` aufrufen, damit der Button als
   echter Ein-/Ausschalter funktioniert.

3. **Die Hilfe-Seite (`/hilfe`) hilft weiterhin nicht wirklich.**
   `src/pages/PlaceholderPage.tsx` zeigt nach wie vor nur "Hilfe wird als
   Nächstes gebaut" — kein FAQ, kein Kontaktweg. Wer mit einem Problem
   dorthin klickt, geht leer aus. *Vorschlag:* bis der echte FAQ-Inhalt
   kommt, reicht vorerst schon ein Satz mit Kontakthinweis.

4. **Der Warenkorb bleibt eine Sackgasse.** `src/pages/Warenkorb.tsx`
   endet weiterhin nach der Summen-Karte, ohne Buchen-Button oder
   Buchungs-Hinweis. *Vorschlag:* solange die Grundsatzfrage zum
   Zahlungsprozess offen ist, wenigstens einen kurzen erklärenden Satz
   einblenden ("Buchung folgt in Kürze" o. Ä.).

_Letztes Update: 2026-09-16_
