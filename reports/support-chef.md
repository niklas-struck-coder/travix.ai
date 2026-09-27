# Support-Chef Bericht

**Datum:** 2026-09-27

## Was ist seit dem letzten Eintrag (2026-09-26) passiert?

Kurz gesagt: für echte Nutzer:innen nichts. Ich hab nachgeschaut — der
Code unter `src/` ist auf `main` seit dem letzten Bericht unverändert
(`git log --since="2 days ago" -- src/` liefert keinen einzigen Treffer).
Die viele Aktivität der letzten zwei Tage (Berichte, Logs, neue Branches)
hat also noch keine einzige Zeile erreicht, die live ausgespielt wird.
Konkret heißt das: Beide zuletzt gemeldeten Punkte sind für echte
Besucher:innen weiterhin genau so spürbar wie gestern, auch wenn an
anderer Stelle schon "gefixt" oder "bestätigt" steht.

## Meine Vorschläge

1. **Mietwagen-Button fehlt weiterhin im echten Chat.**
   `src/lib/ai/mockAdvisor.ts:76-78`: Der Bot fragt wörtlich "Wie
   möchtest du anreisen — Zug, Flug, Bus, Fähre oder Mietwagen?", die
   Klick-Optionen sind aber weiterhin nur `['Zug', 'Flug', 'Bus',
   'Fähre']`. Der Fix dafür liegt seit gestern fertig in
   [PR #23](https://github.com/niklas-struck-coder/travix.ai/pull/23) —
   eine Zeile, noch offen, noch nicht gemergt. Bis das passiert, tippt
   jede Person, die Mietwagen will, es weiter freihändig ein.

2. **Flugkarte zeigt weiterhin Flughafen-Codes statt Orten.**
   `src/components/search/FlightCard.tsx:45,50` zeigt "BER"/"LIS" statt
   "Berlin"/"Lissabon", obwohl der lesbare Name in der Duffel-Antwort
   längst mitkommt. Der fertige Fix dafür liegt auf `it-chef/auto`, das
   seit 8 Tagen nicht nach `main` gemergt werden kann. Wer den
   Flughafencode seines Ziels nicht auswendig kennt, muss auf der
   Ergebniskarte raten.

3. **Bevor Punkt 2 gemergt wird: unbedingt einen Fallback einbauen.**
   Schon heute live sichtbar in `src/components/search/TrainCard.tsx:44,49`
   (technisch identischer Code): `offer.originName`/`offer.destinationName`
   werden dort ganz ohne Absicherung angezeigt — bei leerem Namensfeld
   stünde schlicht nichts neben der Uhrzeit, statt wie bisher wenigstens
   der Code. `TrainCard` hat aktuell noch keine echten Nutzer:innen, aber
   genau dieses Muster soll laut Punkt 2 als Nächstes auch in
   `FlightCard.tsx` landen. *Vorschlag:* vor dem Merge einmal
   `name || iata || '—'` ergänzen, damit aus dem Klarname-Fix keine neue
   Lücke wird, die schlimmer ist als der ursprüngliche IATA-Code.

4. **Hilfe-Seite (`/hilfe`) bleibt eine Sackgasse.**
   `src/pages/PlaceholderPage.tsx:16` zeigt weiterhin nur "Hilfe wird als
   Nächstes gebaut" — kein FAQ, kein Kontaktweg. Laut `ZEITPLAN.md`
   bewusst blockiert, bis es echte FAQ-Inhalte und eine echte
   Support-Adresse gibt. Bis dahin geht jede Person mit einem echten
   Problem dort leer aus — unverändert seit mehreren Berichten.

_Letztes Update: 2026-09-27_
