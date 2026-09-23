# Support-Chef Bericht

**Datum:** 2026-09-23

## Was ist seit dem letzten Eintrag (2026-09-22) passiert?

Der damals gemeldete Punkt ist behoben — hab's im aktuellen Code
nachgeprüft:

- **Abgeschlossener Reiseentwurf ohne sinnvolle Aktion:** Für
  `draft.status === 'finalized'` gibt es jetzt einen "Details
  ansehen"-Button (`src/pages/Reiseentwuerfe.tsx:279-290`), der die
  vorhandenen Trip-Daten read-only in einem Dialog zeigt
  (`Reiseentwuerfe.tsx:356-390`). Die vorherige Sackgasse (nur noch
  Duplizieren/Löschen nach bewusstem Abschließen) ist damit weg.

Der neue Dialog bringt aber selbst einen Reibungspunkt mit, dazu unten
mehr. Zwei ältere Punkte sind außerdem weiterhin offen.

## Meine Vorschläge

1. **Fehlende Angaben verschwinden im neuen "Details ansehen"-Dialog
   kommentarlos, statt als "nicht angegeben" erkennbar zu sein.**
   `src/pages/Reiseentwuerfe.tsx:362-374` baut seine Zeilen für
   Transportmittel, Datum, Budget und Unterkunft per `.filter(Boolean)`
   — ein leeres Feld wird komplett weggelassen statt angezeigt. Nur die
   Aktivitäten-Zeile (Zeile 381-386) macht es richtig und zeigt bei
   keinen Aktivitäten explizit "Noch keine Aktivitäten geplant". Für
   eine Nutzerin, die einen unvollständigen Entwurf bewusst abgeschlossen
   hat (z. B. ohne Budget/Unterkunft) und sich die Details danach ansieht,
   wirkt das leicht so, als wären beim Abschließen Angaben verloren
   gegangen. *Vorschlag:* dasselbe Muster wie bei Aktivitäten auch für
   die anderen drei Felder nutzen (z. B. "Kein Transportmittel
   gewählt") — kleine, mechanische Änderung, da das Muster im selben
   Dialog schon existiert.

2. **Die Hilfe-Seite (`/hilfe`) hilft weiterhin nicht wirklich.**
   `src/pages/PlaceholderPage.tsx:16` zeigt nach wie vor nur "Hilfe wird
   als Nächstes gebaut" — kein FAQ, kein Kontaktweg. Wer mit einem
   Problem dorthin klickt, geht leer aus. *Vorschlag:* bis der echte
   Inhalt kommt, reicht vorerst ein Satz mit Kontakthinweis.

3. **Badge für "Abgeschlossen" optisch kaum von "Pausiert" zu
   unterscheiden.** `src/pages/Reiseentwuerfe.tsx:236` nutzt für beide
   Status dieselbe `secondary`-Variante. Auf den ersten Blick ist auf der
   Übersicht nicht erkennbar, welche Karten schon fertig und welche nur
   pausiert sind. *Vorschlag:* eigene, dezente Badge-Variante für
   `finalized` (z. B. mit Teal-Akzent wie bei `in_progress`, nur
   ruhiger).
