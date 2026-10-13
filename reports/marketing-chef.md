# Marketing-Chef Bericht

**Datum:** 2026-10-13

## Was ist seit dem letzten Eintrag (2026-10-12) passiert?

Zwei kleine, aber im Code bestätigte Fixes: Die Destination-Karten auf
der Startseite haben jetzt einen Hover-/Fokus-Hinweis (`Home.tsx`,
vorher nur Deko-Klasse, jetzt dasselbe Fokus-Ring-Muster wie überall
sonst in der App). Und die Chat-Bestätigung nach einer Flugauswahl zeigt
jetzt Klarnamen statt roher IATA-Codes ("Berlin → Lissabon" statt
"BER → LIS") – derselbe Fix, der vorher schon zweimal an anderer Stelle
(`FlightCard.tsx`, `summarizeFlightOffer()`) gemacht wurde, jetzt auch
in `useChat.ts`. Beides selbst im Code verifiziert, nicht nur laut
Commit-Message übernommen.

Der Flug-Bearbeiten-Fund (Formular startet beim erneuten Öffnen weiterhin
leer) ist weiterhin offen – keine Änderung seit dem 12.10. Keine neuen
Positionierungsentscheidungen, keine Kennzahlen zu berichten.

## Vorschläge

1. **Flug-Bearbeiten-Promo bleibt gesperrt, Hotel-Bearbeiten-Promo weiter
   fahren.** Unverändert zum letzten Bericht: Solange das Flugformular
   beim Bearbeiten leer startet, lieber "Bearbeite deine Reise" gezielt
   auf Unterkunft begrenzen statt pauschal zu versprechen.

2. **Content-Idee: "Dasselbe Muster, dreimal konsequent angewendet" als
   Beleg für sauberen Code statt als Behauptung.** Der IATA-Klarname-Fix
   ist jetzt das dritte Mal im selben Code-Bereich passiert – das ist
   eine ehrliche, kleine Geschichte über Konsistenz in der Produktarbeit
   ("wir flicken nicht einzeln, wir übertragen ein einmal etabliertes
   Muster"). Eignet sich gut als Randnotiz in der nächsten
   Mini-Changelog-Ausgabe, nicht als eigener Post.

3. **Accessibility als eigenes, kleines Content-Thema vormerken.** Der
   Fokus-Ring auf den Destination-Karten ist jetzt an fünf Stellen der
   App etabliert (Button, Input, Tabs, Badges, jetzt Karten). Das ist
   genug Substanz für eine kurze, ehrliche Aussage wie "wir bauen
   Tastatur-Bedienbarkeit von Anfang an mit" – aber erst, wenn der
   Tier-4-Kandidatentopf (laut Marketing-Auto-Kanal aktuell bei 5 von 8)
   für eine neue Changelog-Ausgabe voll ist. Noch nicht einzeln bewerben.

4. **Kein Grund für neue Grundsatz-Vorschläge.** Positionierung,
   Zielgruppen und die offene Urlaubsmodus/Lissabon-Datenquellen-Frage
   sind seit dem letzten Lauf unverändert – hier gibt es ehrlich nichts
   Neues zu berichten statt künstlich etwas zu erfinden.

_Letztes Update: 2026-10-13_
