# Marketing-Chef Bericht

**Datum:** 2026-09-16

## Was ist seit dem letzten Eintrag (2026-09-15) passiert?

- Der gestern gemeldete Fokus-Verlust nach Lösch-Bestätigungen ist bereits
  gemergt und zentral in `DialogContent` behoben — von Fund zu Fix in
  einem Tag.
- Drei weitere Robustheits-Fixes im Chat sind gelandet: Enter bricht eine
  laufende IME-Komposition nicht mehr ab, `resetChat()` und
  `loadStoredChat()` fangen jetzt kaputte oder alte `localStorage`-Daten
  sauber ab, statt abzustürzen bzw. Felder stillschweigend zu verlieren.
- IT-Chef hat einen neuen, unabhängigen Bug gefunden: `formatDuration()`
  zeigt bei Flügen/Zügen ab 24 Stunden Gesamtdauer den rohen ISO-Code
  (z. B. „P1DT2H30M") statt einer lesbaren Zeit. Fix liegt auf PR #21,
  noch nicht gemerged — also noch kein Content-Kandidat.
- Freigabe-Chef hat die drei Auto-Zweige geprüft, gemergt und dabei einen
  länger blockierten Support-Chef-Zweig aufgelöst. Reine interne
  Maschinerie, nach außen ändert das nichts.
- Der Tier-4-Kandidatentopf für die nächste Mini-Changelog-Ausgabe steht
  jetzt bei fünf (laut `marketing/freigabe-uebersicht.md`) — weiterhin
  unter der Schwelle, die frühere Ausgaben ausgelöst hat.
- Die vier offenen Fragen (Kanal, Warenkorb-Content, wiederkehrendes
  Social-Format, Mini-Changelog-Start) sind weiterhin unbeantwortet —
  jetzt seit über vier Wochen.
- Keine neuen Nutzungs- oder Erfolgszahlen bekannt — bleibt ehrlich außen
  vor.

## Vorschläge

1. **Die Robustheits-Fixes der letzten Tage sammeln statt einzeln
   verheizen.** IME-Enter, `resetChat()`, `loadStoredChat()` und bald
   `formatDuration()` (sobald PR #21 gemerged ist) erzählen zusammen eine
   Geschichte: „Wir härten die Basis ab, bevor sie auffällt" — deutlich
   stärker als vier separate Mini-Posts. Guter Kandidat für eine spätere
   „Zuverlässigkeit hinter den Kulissen"-Ausgabe, sobald ein Kanal steht.
2. **Bei der Kanal-Frage weiter auf den Mini-Changelog als Einstieg
   setzen.** Über vier Wochen Stillstand bei derselben Frage — mein
   Vorschlag bleibt: Der Mini-Changelog auf der eigenen Produktseite
   (Tier 5) ist die einzige der vier Fragen, die ausschließlich deine
   Freigabe braucht, keinen externen Kanal und keine Social-Format-
   Entscheidung. Das wäre der niedrigste Aufwand, um überhaupt mal live
   zu gehen.
3. **Den formatDuration-Fund vormerken, nicht überstürzen.** Sobald PR #21
   gemerged ist, ist „wir zeigen bei 24h+ Flügen jetzt eine echte Dauer
   statt eines rohen Codes" ein guter, konkreter Baustein für die nächste
   Mini-Changelog-Ausgabe oder die Zuverlässigkeits-Geschichte aus
   Vorschlag 1 — aber erst nach dem Merge, nicht vorher.

_Letztes Update: 2026-09-16_
