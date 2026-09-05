# Marketing-Chef Bericht

**Datum:** 2026-09-05

## Was ist seit dem letzten Eintrag (2026-09-04) passiert?

Wieder überwiegend Stabilität statt neuer Positionierung, aber mit zwei
Punkten, die für dich relevant sind:

- Vier weitere Ehrlichkeits-/Zuverlässigkeits-Fixes sind gemergt: hängender
  Mikrofon-Knopf bei Fehlern, identischer Start-/Zielflughafen ohne Hinweis,
  IATA-Feld ohne Buchstabenprüfung, und Chat-/Reisedaten, die bei vollem
  Browser-Speicher unbemerkt verloren gehen konnten. Alles Kandidaten für
  den wachsenden Tier-4-Themenpool.
- **Neu gefunden, noch nicht gemerged:** PR #18 behebt einen Absturz der
  ganzen Reiseplan-Seite, wenn ein alter/korrupter Trip ohne
  "Aktivitäten"-Feld geladen wird. PR #17 (Währungscode-Absturz) und PR #16
  (Stopp-Knopf Vorlesen-Funktion) sind weiterhin offen.
- **Neu gefunden, bewusst nicht automatisch gefixt:** Eine Suche mit null
  Treffern zeigt keine "Neue Reise planen"-Chips mehr an — anders als jeder
  andere Chat-Endzustand. Kein Absturz, aber dieselbe Ehrlichkeits-Lücke
  wie die bereits gefixten Sackgassen-Bugs, nur beim Erfolgsfall übersehen.
- Über den separaten `marketing-chef-eigen`-Kanal ist inzwischen ein
  konkreter Entwurf für den öffentlichen Mini-Changelog entstanden
  (`marketing/mini-changelog-konzept.md`) — genau die Idee aus meinem
  letzten Bericht, jetzt als fertiger Text statt nur als Konzept. Das ist
  nicht mein Kanal, aber relevant für Vorschlag 2 unten.
- Die drei offenen Freigabe-Fragen an dich (Kanäle anlegen, Warenkorb-
  Content zurückhalten, Tier-4-Format ja/nein) sind seit dem 21.08.
  weiterhin unbeantwortet.

## Vorschläge

1. **Sprachfunktion weiterhin nicht bewerben.** PR #16 (Stopp-Knopf) ist
   immer noch offen. Unveränderte Empfehlung, bis das gemergt ist.

2. **Mini-Changelog-Entwurf ist jetzt entscheidungsreif — schau ihn dir an.**
   Statt weiter auf eine grundsätzliche Tier-4-Ja/Nein-Antwort zu warten:
   Der fertige Entwurf in `marketing/mini-changelog-konzept.md` bündelt
   genau die Art Fixes, die sich seit Wochen häufen (inkl. der heutigen
   Nulltreffer- und Absturz-Funde). Wenn er dir gefällt, ist das dein
   Testlauf für das Format — ohne dass ich hier eine neue Idee draufsetzen
   muss.

3. **Die Nulltreffer-Lücke als Content-Baustein vormerken, nicht extra
   bewerben.** Sobald IT-Chef entschieden hat, welcher Text/welche Chips
   bei "erfolgreiche Suche, aber nichts gefunden" erscheinen, ist das ein
   weiterer guter Eintrag für den Mini-Changelog — kein eigenes
   Kampagnen-Thema, aber ein Beleg mehr für "wir polieren die
   Kleinigkeiten, die sonst niemand zeigt".

4. **Keine erfundenen Kennzahlen.** Weiterhin keine mir bekannten Nutzungs-
   oder Erfolgszahlen — Content bleibt bei "was wurde ehrlicher/
   verlässlicher", nicht bei Reichweite oder Nutzerzahlen.

_Letztes Update: 2026-09-05_
