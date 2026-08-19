# Marketing-Chef Bericht

**Datum:** 2026-08-19

## Was ist seit dem letzten Eintrag (2026-08-18) passiert?

Kein neues Feature im `src/`-Code seit gestern — die IT-Chef-Auto-Läufe
haben nur veraltete Checkboxen in der Aufgabenliste korrigiert. Mein
eigener autonomer Lauf hat dafür die im letzten Bericht vorgeschlagene
Idee umgesetzt: ein neues, wiederkehrendes Content-Format "Was wird
gerade wirklich gespeichert?" (August-Ausgabe) liegt jetzt fertig und
geprüft in `marketing/`. Der Entwurfs-Stapel ist damit auf sechs fertige
Stücke gewachsen — weiterhin ist laut bisherigem Stand keines davon
tatsächlich veröffentlicht.

Wichtiger als das neue Content-Stück ist ein Fund des IT-Chefs von heute:
Im normalen Chat-Einstieg kündigt die KI wörtlich an, jetzt nach "echten
Flug-Verbindungen" zu suchen — die Suche startet aber technisch nie
(`useChat.ts`/`mockAdvisor.ts`, `nextField: null` wird nicht behandelt).
Kein Ladezustand, kein Fehler, einfach Stille, bis der Bot beim nächsten
Klick direkt zu "Dein Reiseplan steht!" springt. Das ist kein Marketing-
Thema im Sinne von "Content dazu schreiben", sondern eine Warnung: genau
an dieser Stelle würde jede Werbeaussage über "echte KI-Flugsuche" gerade
nicht stimmen.

## Vorschläge

1. **Veröffentlichen jetzt wirklich anschieben, nicht noch ein Stück
   schreiben.** Sechs fertige, geprüfte Texte liegen in `marketing/`,
   keiner ist live — das ist jetzt der dritte Bericht in Folge mit
   diesem Befund. Konkret: derzeit keine neuen Content-Stücke in
   Auftrag geben, sondern mit dir klären, welche zwei der sechs
   (Vorschlag: Kartenansicht + Warenkorb, weil beide an echte Daten
   angebunden sind) diese Woche tatsächlich rausgehen — sonst wird der
   Stapel zur Karteileiche.

2. **Flugsuche-Chat-Bug: bis zum Fix keine Werbeaussagen dazu.** Sobald
   dieser Bug (siehe oben) durch den IT-Chef behoben ist, wäre er
   selbst eine gute, ehrliche Content-Idee für das neue "Was wird
   gerade wirklich gespeichert"-Format — als Beispiel dafür, dass
   still hängende KI-Antworten aktiv gesucht und gefixt werden. Bis
   dahin: kein Post, keine Aussage, die suggeriert, die KI-Flugsuche im
   Chat funktioniere bereits durchgängig.

3. **Warenkorb-Content zurückhalten, bis "Jetzt buchen" existiert.**
   Laut Support-Chef-Befund von gestern endet der Warenkorb aktuell in
   einer reinen Summenanzeige ohne Weiterbuchen-Möglichkeit. Bevor ein
   Warenkorb-Post rausgeht (siehe Vorschlag 1), lohnt sich ein Blick,
   ob dieser fehlende nächste Schritt bis dahin geschlossen ist — sonst
   bewirbt der Post eine Sackgasse.
