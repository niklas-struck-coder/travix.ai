# Marketing-Chef Bericht

**Datum:** 2026-09-25

## Was ist seit dem letzten Eintrag (2026-09-24) passiert?

Der Blocker von vorgestern ist weg, aber ein neuer, strukturell gleicher
ist da: Der "Details ansehen"-Dialog-Fund ist jetzt bestätigt gefixt und
als 21. Kandidat verbucht. Die Badge-Kontrastfrage von gestern (Teal-Text
auf "Abgeschlossen" nur ~2,3:1 statt der WCAG-Vorgabe 4,5:1) ist aber
weiterhin **nicht** behoben – IT-Chef hat sie sich heute zwar erneut
angeschaut, aber nicht angefasst. Die Reiseentwürfe-Konsistenz-Story
hängt damit schon den zweiten Tag am selben Punkt fest.

Neu dazugekommen: `FlightCard.tsx` zeigt nur IATA-Codes ("BER") statt der
bereits vorhandenen Klarnamen ("Berlin") – ein echter, aber bewusst nicht
automatisch gefixter Fund (Formatentscheidung + bestehender Test wären
betroffen). Passt inhaltlich in dieselbe "ehrliche, klare Angabe statt
kryptischer Code"-Erzählung wie die anderen Content-Bausteine.

Der Kandidatentopf wächst von drei auf vier – weiterhin klar unter der
Achter-Schwelle für eine neue Mini-Changelog-Ausgabe. Alle vier
Grundsatzfragen (Kanal, Mini-Changelog-Seite, Format, Start) sind jetzt
seit über fünf Wochen unbeantwortet. Keine neuen Nutzungs- oder
Erfolgszahlen bekannt.

## Vorschläge

1. **Nicht mehr alles an einem einzigen offenen Bug aufhängen.** Zwei
   Tage in Folge blockiert derselbe Kontrast-Fund die Veröffentlichung.
   In `marketing/` liegen inzwischen acht fertige Entwürfe – mindestens
   einer davon (z. B. zum Warenkorb oder zur Kartenansicht) hängt gar
   nicht an der Reiseentwürfe-Badge. Den zuerst raus, während der
   Kontrast-Fix nebenher weiterläuft. Warten auf den einen perfekten
   Moment kostet gerade mehr als es bringt.

2. **FlightCard-Klarname als Kandidat fürs nächste Mini-Changelog
   vormerken.** Sobald Ni die Formatfrage entscheidet (Name statt Code?
   Name plus Code?) und der Test angepasst ist, ist das ein sauberer
   fünfter Baustein für dieselbe "ehrliche Angabe statt Abkürzung"-Reihe
   wie die bisherigen Funde – kein neuer Aufwand, nur mitnehmen.

3. **Die Kanal-Frage jetzt wirklich einmal beantworten, nicht wieder alle
   vier auf einmal.** Fünf Wochen offen ist der eigentliche Show-Stopper,
   nicht die Bugs – selbst ein fertiger Text bleibt ohne Kanal in der
   Schublade. Reicht als kleinster möglicher Schritt: eine Antwort, kein
   ganzes Konzept.

4. **Den wiederkehrenden Kontrast-Fund selbst als Content nutzen.**
   Dass derselbe Fehlton (Teal-Text auf hellem Grund) jetzt zweimal
   hintereinander auftaucht und offen benannt wird statt überspielt zu
   werden, ist genau die "wir zeigen auch unsere eigenen Fehler"-Haltung,
   die zur Marke passt. Eine kurze Notiz dazu (sobald es einen Changelog-
   Ort dafür gibt) wäre glaubwürdiger als jede Hochglanz-Aussage über
   Barrierefreiheit.

_Letztes Update: 2026-09-25_
