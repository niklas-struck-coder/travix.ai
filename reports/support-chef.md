# Support-Chef Bericht

**Datum:** 2026-09-22

## Was ist seit dem letzten Eintrag (2026-09-21) passiert?

Beide damals neu gemeldeten Punkte sind behoben — hab's im aktuellen
Code nachgeprüft:

- **role="alert" bei Flug-/Hotelsuche-Fehlern:** ist jetzt drin
  (`src/components/search/FlightResults.tsx:28` und
  `src/components/search/HotelResults.tsx:29`). Screenreader-Nutzer:innen
  bekommen einen fehlgeschlagenen Suchversuch jetzt genauso angesagt wie
  bisher schon den Ladezustand.
- **"Planung fortsetzen" bei abgeschlossenen Entwürfen:** der Button wird
  jetzt korrekt ausgeblendet, sobald `draft.status === 'finalized'`
  (`src/pages/Reiseentwuerfe.tsx:220-222`), genau wie "Pausieren" und
  "Abschließen" daneben.

Der zweite Fix bringt aber einen neuen Reibungspunkt mit sich, dazu unten
mehr. Der alte Hilfe-Seiten-Punkt ist außerdem weiterhin offen.

## Meine Vorschläge

1. **Ein abgeschlossener Reiseentwurf hat jetzt gar keine sinnvolle
   Aktion mehr.** `src/pages/Reiseentwuerfe.tsx:220-268`: Nachdem
   "Planung fortsetzen", "Pausieren" und "Abschließen" für
   `status === 'finalized'` korrekt ausgeblendet werden, bleiben auf der
   Karte nur noch "Duplizieren" (legt einen komplett neuen, wieder
   aktiven Entwurf an) und "Löschen". Wer gerade bewusst im Dialog "Ja,
   abschließen" bestätigt hat, kann sich den fertigen Entwurf danach gar
   nicht mehr ansehen — die Karte wirkt wie eine Sackgasse. Dazu kommt:
   das Badge nutzt für "Abgeschlossen" dieselbe `secondary`-Variante wie
   für "Pausiert" (`Reiseentwuerfe.tsx:206`), optisch also kaum zu
   unterscheiden. *Vorschlag:* für `finalized` mindestens einen
   neutralen, nicht-destruktiven Button ergänzen (z. B. "Details
   ansehen", öffnet die vorhandenen Trip-Daten read-only in einem
   Dialog) statt nur Duplizieren/Löschen übrig zu lassen.

2. **Die Hilfe-Seite (`/hilfe`) hilft weiterhin nicht wirklich.**
   `src/pages/PlaceholderPage.tsx:16` zeigt nach wie vor nur "Hilfe wird
   als Nächstes gebaut" — kein FAQ, kein Kontaktweg. Wer mit einem
   Problem dorthin klickt, geht leer aus. *Vorschlag:* bis der echte
   Inhalt kommt, reicht vorerst ein Satz mit Kontakthinweis.
