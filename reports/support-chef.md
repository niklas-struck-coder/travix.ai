# Support-Chef Bericht

**Datum:** 2026-09-24

## Was ist seit dem letzten Eintrag (2026-09-23) passiert?

Zwei der drei damals gemeldeten Punkte sind behoben — hab's im
aktuellen Code nachgeprüft:

- **Fehlende Angaben im "Details ansehen"-Dialog:** Transportmittel,
  Datum, Budget und Unterkunft zeigen jetzt bei fehlendem Wert einen
  Fallback-Text (z. B. "Noch kein Transport ausgewählt",
  `src/pages/Reiseentwuerfe.tsx:373-393`) statt die Zeile stillschweigend
  wegzulassen. Wortgleich mit dem etablierten Muster aus `Buchung.tsx`.
- **Badge "Abgeschlossen" vs. "Pausiert":** nutzt jetzt eine eigene
  `outline`-Variante mit Teal-Einfärbung statt derselben `secondary`-
  Variante wie "Pausiert" (`Reiseentwuerfe.tsx:236-247`) — auf der
  Übersicht klar unterscheidbar.

Der Badge-Fix bringt aber selbst einen neuen Punkt mit, dazu unten mehr.
Der dritte alte Punkt (Hilfe-Seite) ist weiterhin offen.

## Meine Vorschläge

1. **Text der neuen "Abgeschlossen"-Badge hat im hellen Farbschema zu
   wenig Kontrast.** `src/pages/Reiseentwuerfe.tsx:244` färbt den
   Badge-Text mit `text-teal` auf fast weißem Hintergrund (`bg-teal/5`).
   Teal (`#00c2a8`, `src/styles/globals.css:10`) gegen Weiß ergibt nur
   rund 2,3:1 Kontrast — deutlich unter den WCAG-AA-Mindestwert von 4,5:1
   für normalen Text. Im dunklen Farbschema ist es mit rund 7:1 dagegen
   gut lesbar, das Problem betrifft also gezielt den vermutlich meist-
   genutzten hellen Modus. Derselbe Fehlton steckt übrigens schon länger
   in `TripSummaryCard.tsx:41` und `:50`. *Vorschlag:* für Text auf
   hellem Grund einen dunkleren, kontrastreicheren Teal-Ton verwenden
   (Teal nur als Rahmen/Hintergrund, wie es `QuickReplies.tsx:20` mit
   `border-teal/40 bg-teal/10 text-navy` bereits vormacht) — am besten
   als gemeinsamer Design-Token, damit `TripSummaryCard.tsx` gleich
   mitprofitiert.

2. **Die Hilfe-Seite (`/hilfe`) hilft weiterhin nicht wirklich.**
   `src/pages/PlaceholderPage.tsx:16` zeigt nach wie vor nur "Hilfe wird
   als Nächstes gebaut" — kein FAQ, kein Kontaktweg. Wer mit einem
   Problem dorthin klickt, geht leer aus. *Vorschlag:* bis der echte
   Inhalt kommt, reicht vorerst ein Satz mit Kontakthinweis.

3. **Rohe, englische Fehlermeldungen der Flugsuche landen unverändert im
   UI.** `src/lib/duffel/client.ts:15-33` reicht `json?.errors` von der
   Duffel-API größtenteils unverändert durch, `src/pages/Flugsuche.tsx`
   zeigt `error.message` dann 1:1 an. Für eine deutschsprachige Nutzerin
   ohne technischen Hintergrund wirkt das verwirrend, gerade weil der
   Rest der App durchgängig freundliche deutsche Texte verwendet (z. B.
   `NoResultsMessage`). *Vorschlag:* häufige Duffel-Fehlercodes auf
   verständliche deutsche Meldungen abbilden, rohen Text nur als
   Fallback für unbekannte Fälle.
