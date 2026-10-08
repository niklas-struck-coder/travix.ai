# Marketing-Chef Bericht

**Datum:** 2026-10-08

## Was ist seit dem letzten Eintrag (2026-10-07) passiert?

Seit gestern ist vor allem IT-Chef unterwegs gewesen: Der Lösch-Dialog in
EditMode.tsx disambiguiert jetzt gleichnamige Aktivitäten (laut
Support-Chef aber bisher nur in Screenreader-Label und Dialog, nicht in
der sichtbaren Liste – also noch nicht fertig), die Reisecheckliste und
`isTripComplete()` widersprachen sich bei der Vollständigkeits-Anzeige
und wurden synchronisiert, und ein Demo-Datensatz (Kyoto-Reise) hatte
versehentlich Jahr 2027 statt 2026. Alles solide Qualitätsarbeit, aber
reine Politur ohne neuen Positionierungs-Anlass.

Ein Fund passt dagegen gut in unsere "Ehrlichkeit als Feature"-Linie:
Der Urlaubsmodus-Concierge hat Notruf-Fragen bisher über das Stichwort
"hilfe" ohne Wortgrenze erkannt – wer "Hilfestellung" oder "mithilfe"
schrieb, bekam ungefragt die Notrufnummer vorgesetzt. Jetzt erkennt er
nur noch echte Hilferufe. Klein, aber ein weiterer Beleg dafür, dass wir
bei Details genau hinschauen statt grob drüberzugehen.

## Vorschläge

1. **Den Concierge-Fix als eigenen kleinen Content-Baustein nutzen, nicht nur als Fußnote.** Anders als der Fehlermeldungs-Fix von gestern hat dieser hier einen eigenen, leicht erzählbaren Haken ("unser Assistent verwechselt 'Hilfestellung' nicht mit einem Notruf") – gut geeignet als kurzer, humorvoller Social-Post oder Mini-Changelog-Eintrag zur Präzisions-Säule, unabhängig von gestriger Idee.

2. **Den Urlaubsmodus-Concierge selbst als Feature-Spotlight vorschlagen.** Der Bug zeigt nebenbei ein Feature, das bisher kaum beworben wurde: Ein KI-Begleiter, der auch *während* der Reise hilft (Währung, Sprache, Notfallnummer) – nicht nur bei der Planung davor. Das ist ein Differenzierungspunkt gegenüber reinen Reiseplaner-Apps und würde sich für ein eigenständiges Content-Stück lohnen ("travix.ai bleibt auch vor Ort an deiner Seite").

3. **Keinen neuen Positionierungs-Claim formulieren.** EditMode-Disambiguierung, Checklisten-Fix und Jahreszahl-Korrektur sind interne Konsistenzarbeit ohne direkten Nutzer-Story-Wert. Bestehende Claim-Texte und Content-Pläne aus früheren Berichten unverändert lassen, statt wegen kleiner Fixes neue Texte zu produzieren.

4. **Changelog-Kandidatentopf (separater Auto-Tracker) steht seit mehreren Tagen bei 3 von 8 – Schwelle ggf. überdenken.** Wenn der Topf wochenlang nicht die Achter-Schwelle erreicht, verschwinden kleine, sympathische Funde (wie der Concierge-Fix) im Nirgendwo. Vorschlag: Schwelle senken (z.B. auf 5) oder feste zeitliche Taktung statt reiner Stückzahl-Schwelle, damit Momentum nach außen sichtbar bleibt.

_Letztes Update: 2026-10-08_
