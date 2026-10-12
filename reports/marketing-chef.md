# Marketing-Chef Bericht

**Datum:** 2026-10-12

## Was ist seit dem letzten Eintrag (2026-10-10) passiert?

Der Flug-Bearbeiten-Fund vom 10.10. ist jetzt zur Hälfte behoben: Die
Flugauswahl speichert jetzt Route, Airline und Preis statt nur "es ist
ein Flug" (`Flugsuche.tsx` und `useChat.ts`, von IT-Chef gemergt und
unabhängig vom parallelen Marketing-Auto-Kanal im Code bestätigt). Das
Such-Formular selbst startet beim erneuten Öffnen über "Bearbeiten"
aber weiterhin komplett leer statt vorbefüllt – selbst in
`FlightWizard.tsx` geprüft: alle Felder laufen noch auf leere
Startwerte. Halber Fix, also vorerst weiterhin halber Promo-Stopp.

Dazu ein neuer, kleiner Fund-und-Fix in dieser Woche: Die
Destination-Karten auf der Startseite sahen klickbar aus, taten aber
nichts – jetzt verlinken sie zum KI-Chat, und Support-Chef hat zusätzlich
einen fehlenden Hover-/Fokus-Hinweis gefunden und fixen lassen. Genau
die "sieht nach Button aus, ist aber nur Deko"-Kategorie, die sonst im
Mini-Changelog landet. Der Tier-4-Kandidatentopf der parallelen
Marketing-Auto-Spur steht dafür jetzt bei vier von acht – noch keine
neue Changelog-Ausgabe fällig.

Der Urlaubsmodus/Lissabon-Datenquellen-Mismatch ist seit dem 10.10.
unverändert offen, keine neuen Positionierungsentscheidungen, keine
Kennzahlen zu berichten.

## Vorschläge

1. **Flug-Bearbeiten-Promo bleibt gesperrt, Hotel-Bearbeiten-Promo kannst
   du dagegen schon fahren.** "Bearbeite deine Reise jederzeit" stimmt für
   den Flug-Teil erst, wenn auch das Formular vorbefüllt startet. Die
   Hotelsuche speichert laut Code aber von Anfang an korrekt – lohnt sich,
   das Versprechen vorerst gezielt auf Unterkunft zu begrenzen statt
   pauschal "jede Buchung" zu versprechen.

2. **Destination-Karten-Fix als Changelog-Kandidat vormerken, nicht
   einzeln bewerben.** Der Kandidatentopf steht bei vier von acht, also
   noch zu früh für eine eigene Mini-Changelog-Ausgabe. Aber die
   Geschichte selbst ist griffig für Nutzer ("sah aus wie ein Button, war
   nur Deko – jetzt führt er zum KI-Chat") – gute Kandidatin für die
   nächste Ausgabe, wenn der Topf voll ist.

3. **Kleine, glaubwürdige Content-Idee: doppelte Verifizierung als
   Beleg, nicht als Behauptung.** Heute haben IT-Chef und der separate
   Marketing-Auto-Kanal unabhängig voneinander im Code nachgeprüft, dass
   die drei am 10.10. gemeldeten Bugs wirklich behoben sind – nicht nur
   laut Commit-Message. Das ist ein kleiner, aber echter Baustein für die
   "wir behaupten nichts, wir zeigen es"-Tonalität. Eher als Randnotiz in
   einer größeren Mini-Changelog-Ausgabe nutzen, nicht als eigenen Post.

_Letztes Update: 2026-10-12_
