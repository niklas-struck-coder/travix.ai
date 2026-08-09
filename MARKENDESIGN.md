# Markendesign travix.ai

Gemeinsame Referenz für Marketing-Chef und IT-Chef, damit beide an
derselben Markenidentität arbeiten, ohne live miteinander sprechen zu
können. **Marketing-Chef pflegt diese Datei** (Markenstimme, Positionierung,
Design-Vorgaben) — **IT-Chef liest sie vor jeder UI-/Design-Arbeit** und
hält sich daran, statt eigene Stil-Entscheidungen zu treffen.

Zuletzt aktualisiert: 2026-08-09 (Erstversion, Design-Tokens aus dem Code
übernommen — Markenstimme/Tonalität von Marketing-Chef noch zu ergänzen)

## Aktueller Stand (aus dem Code, `src/lib/design-tokens.ts`)

**Farben:**
- Navy `#0A2342` — Primärfarbe, Vertrauen/Seriosität
- Teal `#00C2A8` — Akzentfarbe, Handlungsaufforderungen (Buttons, Links)
- Gold `#F4B400` — Zweitakzent, Highlights (z.B. Urlaubsmodus)

**Schrift:**
- Überschriften: Sora
- Fließtext: Inter

**Tonalität der UI-Texte (Ist-Zustand):** Deutsch, per du, direkt und
ehrlich (z.B. "Nichts wird erfunden" im KI-Chat) — keine übertriebenen
Marketing-Floskeln in der Produkt-UI selbst.

## Offen — von Marketing-Chef auszufüllen
- Markenstimme/Tonalität (formal vs. locker, wie "du" gemeint ist)
- Positionierung in einem Satz (wie soll sich travix.ai von anderen
  Reiseplattformen unterscheiden — visuell und sprachlich)
- Zielgruppen-spezifische Design-Anpassungen, falls relevant
- Bildsprache/Illustrationsstil (falls gewünscht, über Farbverläufe hinaus)
- Konkrete Vorgaben für neue Seiten, die IT-Chef laut `ZEITPLAN.md` noch
  baut (z.B. wie soll die Dashboard-Übersicht wirken, welcher Ton für
  Fehlermeldungen/leere Zustände)

## Wie das genutzt wird
- **Marketing-Chef:** Wenn Ni nach Markenauftritt/Design-Richtung fragt,
  Ergebnisse hier eintragen — konkret genug, dass IT-Chef es direkt
  umsetzen kann (nicht nur "modern und vertrauenswürdig", sondern z.B.
  "leere Zustände sollen ermutigend klingen, nicht wie eine Fehlermeldung").
- **IT-Chef:** Vor jeder UI-/Design-Arbeit (neue Seite, Farbänderung,
  Copy-Texte) diese Datei lesen. Bei Widerspruch zwischen eigener Intuition
  und dieser Datei: Datei gewinnt. Fehlt eine Vorgabe für den konkreten
  Fall: bei den bestehenden Design-Tokens und der bisherigen Tonalität
  bleiben, nicht neu erfinden.
