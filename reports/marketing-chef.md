# Marketing-Chef Bericht

**Datum:** 2026-10-10

## Was ist seit dem letzten Eintrag (2026-10-09) passiert?

Hauptsächlich Bugfixing an der Bearbeiten-Funktion im Chat: resetChat()
verwirft jetzt laufende Flug-/Unterkunftssuchen korrekt, und ein offener
Edit-Status (z. B. "wartet auf neuen Abflugort") überlebt jetzt einen
Seiten-Reload, statt stillschweigend auf den falschen Pfad zu rutschen.
Solide Handwerks-Fixes, aber kein eigener Content-Anlass.

Spannender ist ein neuer Fund von heute: Wählt man im Flugsuche-Chat
einen Flug über "Bearbeiten → Manuell suchen" aus, speichert travix.ai
nur "es ist ein Flug", nicht Route, Preis oder Airline – und das
Such-Formular startet dabei komplett leer statt mit der vorherigen
Eingabe vorbefüllt. Noch nicht gefixt. Gleiche Kategorie wie der
Urlaubsmodus-Datenquellen-Fund von gestern: ein zentraler Klickpfad
(Flug bearbeiten) tut aktuell nicht ganz, was er verspricht.

Dazu intern schon vorbereitet, aber noch nicht veröffentlicht: der
Mini-Changelog-Kandidatentopf hat erneut die Achter-Schwelle
überschritten, eine komplett fertig getextete siebte Ausgabe liegt
bereits als Entwurf vor (`marketing/mini-changelog-konzept.md`) – reine
Ehrlichkeits-/Vertrauens-Fixes, keine erfundenen Zahlen.

## Vorschläge

1. **Flug-Bearbeiten-Fund heute: nicht bewerben, bis er behoben ist.** "Bearbeite deine Reise jederzeit" wäre aktuell ein Versprechen, das der Flug-Teil nicht hält (Details gehen verloren, Formular startet leer). Gleiche Linie wie beim Urlaubsmodus-Fund von gestern: Feature-Pfad erst sauber, dann Spotlight.

2. **Sieben fertige Mini-Changelog-Ausgaben sind ungenutztes Content-Kapital – einen Testballon starten statt weiter zu sammeln.** Statt auf die große Grundsatzentscheidung "eigene Changelog-Seite ja/nein" zu warten, lohnt sich ein kleiner Versuch: eine der bereits fertigen Ausgaben (z. B. #7) einmalig als kurzen Post auf einem bestehenden Kanal teilen. Günstiger Test der "wir zeigen unsere Fehler und wie wir sie fixen"-Tonalität, bevor Ni die größere Seiten-Frage entscheidet.

3. **Urlaubsmodus bleibt vorerst außen vor.** Keine Änderung seit gestern am Datenquellen-Mismatch – weiterhin kein aktives Feature-Spotlight dafür, bis der Klickpfad stimmt.

_Letztes Update: 2026-10-10_
