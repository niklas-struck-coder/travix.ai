# Marketing-Chef Bericht

**Datum:** 2026-10-02

## Was ist seit dem letzten Eintrag (2026-10-01) passiert?

Auf der Fix-Seite war viel Bewegung, aber eher im Kleinen: Der von mir
gestern noch offen gemeldete dritte Disambiguierungs-Dialog bei
doppelten Reiseentwürfen ("Details ansehen" zeigte bei Duplikaten noch
den rohen Zielnamen) ist jetzt gefixt und gemergt — damit ist dieses
konkrete Ehrlichkeits-Thema (Lösch-, Abschließen- und Details-Dialog)
komplett durchgezogen. Dazu kamen ein Formular-Reset-Fix und eine reine
Code-Aufräumarbeit (dreifach duplizierte `formatEuro()`
zusammengeführt) — beides ohne direkte Nutzer-Sichtbarkeit.

Neu gefunden, aber noch **nicht** gefixt: Auf der Favoriten-Seite führt
der zielspezifisch beschriftete Button "Reise mit KI planen mit
Kapstadt" (o. ä.) faktisch immer zum selben zielunabhängigen Chat-Start
— die Nutzerin muss ihr gerade angeklicktes Ziel erneut eintippen, oder
landet sogar in einer ganz anderen laufenden Planung. Das ist genau die
Art Lücke zwischen Versprechen (pro-Ziel-Button) und Verhalten
(generischer Link), vor der ich in den letzten Berichten schon beim
Flugsuche-Fund gewarnt habe.

Zwei Dauerbrenner bleiben unverändert offen: Der `formatDuration`-Fix
(PR #25, erfundenes "1min" bei reinen Sekundenwerten) ist auch heute im
Code gegengecheckt immer noch **nicht** live. Und die
Flugsuche-Ankündigung im Hauptchat ("Ich suche jetzt nach echten
Flug-Verbindungen") löst weiterhin keine echte Suche aus — im Code
jetzt immerhin als bewusste, dokumentierte Grenze kommentiert statt als
stilles Versehen. Die Kanal-Entscheidung aus Sprint 1 steht weiterhin
still, jetzt über zehn Wochen.

## Vorschläge

1. **Favoriten-Button jetzt auf die Nicht-fix-Liste setzen.** Bevor
   irgendein Marketing-Text die Favoriten-Seite als "dein Ziel, ein
   Klick weiter geplant" bewirbt: Der Button hält dieses Versprechen
   aktuell nicht ein. Gleiche Regel wie beim Flugsuche-Fund — nicht
   kommunizieren, solange der Code es nicht einlöst.

2. **Flugsuche weiterhin nicht bewerben — jetzt mit Nachdruck.** Der
   Fund ist inzwischen seit mehreren Tagen offen und im Code selbst als
   bekannte Lücke markiert. Für Landingpage/Ads/Social bleibt "wir
   finden dir echte Flüge" tabu, bis das wirklich stimmt.

3. **Die abgeschlossene Dialog-Serie ist ein gutes Mini-Beispiel fürs
   Portfolio, sobald ein Kanal steht:** Drei zusammengehörige
   Ehrlichkeits-Lücken (Löschen, Abschließen, Details) über mehrere Tage
   gefunden und nacheinander geschlossen — ein kleines, aber
   nachvollziehbares "wir räumen unsere eigenen Ecken auf"-Beispiel.
   Noch nicht einzeln kommunizieren, aber als Baustein für Vorschlag 4
   aus dem letzten Bericht vormerken.

4. **Kanal-Entscheidung bleibt der eigentliche Engpass.** Zehn Wochen
   Stillstand bedeuten: Fix-Material sammelt sich weiter an (jetzt auch
   die Dialog-Serie), ohne dass es irgendwo ankommt. Ändert sich an der
   Empfehlung aus dem letzten Bericht nichts — ein einzelner,
   risikoarmer Kanal (z. B. reiner Changelog-Feed auf der Seite selbst)
   wäre immer noch besser als weiteres Warten auf die große
   Zielgruppen-Entscheidung.

_Letztes Update: 2026-10-02_
