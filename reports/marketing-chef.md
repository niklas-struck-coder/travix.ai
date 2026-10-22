# Marketing-Chef Bericht

**Datum:** 2026-10-22

## Was ist seit dem letzten Eintrag (2026-10-20) passiert?

Ein neuer, echter Fix ist dazugekommen: Auf der MeineReisen-Demokarte
(Lissabon) führte der "Urlaubsmodus aktivieren"-Link ins Leere oder auf
eine völlig falsche Reise, weil die Zielseite ihren Trip aus einem
anderen, nicht verknüpften Speicherort zog. Jetzt übergibt die Karte Ziel
und Zeitraum direkt, der Link landet also wirklich dort, wo er
hinverspricht. Das ist bereits der fünfte Fund in derselben Reihe wie
Avatar-Warndreieck, Zug/Flug-Reset und Kalender-"Heute"-Fix: die App
merkt und behebt eigene Unstimmigkeiten, statt sie zu verstecken.

Der `formatTime()`-Fix gegen "Invalid Date" (PR #34) und der neuere
Buchungsseiten-Edit-Shortcut-Fix (PR #38) liegen weiterhin unbeansprucht
offen – dritter bzw. zweiter Bericht in Folge mit diesem Stand. Sonst war
es ein Tag mit internem Aufräumen (npm-Audit, Testdatei), ohne weitere
nutzersichtbare Änderung. Keine neuen Nutzungsdaten vorhanden, daher auch
diesmal keine Zahlen im Bericht.

## Vorschläge

1. **Sammel-Post jetzt wirklich bauen – fünf Belege sind genug.**
   Avatar-Warndreieck, Zug/Flug-Reset, Kalender-"Heute"-Fix und jetzt der
   Urlaubsmodus-Link stehen bereit, unabhängig von PR #34/#38. Weiter auf
   die vollständige Changelog-Seite zu warten kostet nur Zeit – ein
   erster "Diese Wochen in der App behoben"-Post mit diesen vier
   bestätigten Fixes lohnt sich jetzt.
2. **"Ehrlichkeit als Feature" offiziell launchen, nicht nur sammeln.**
   Fünf Belege für dasselbe Muster sind mehr als genug Material für eine
   feste, wiederkehrende Rubrik. Der Urlaubsmodus-Fix liefert sogar eine
   gute Erklär-Linie dafür: "Bevor wir ein Feature bauen, das wir nicht
   fertig fixen können, zeigen wir lieber ehrlich, was noch fehlt."
3. **Zielgruppen-Content (Solo-Reisende) endlich starten.** Unverändert
   seit mehreren Berichten offen, unabhängig vom Code-Fortschritt
   umsetzbar. Solo-Reisende als erste Zielgruppe, weil dazu bisher noch
   gar kein Content existiert.
4. **PR #34 und #38 als Blocker benennen statt weiter nur zu notieren.**
   Beide liegen jetzt schon mehrere Berichte lang unbeansprucht. Statt sie
   nur mitzuschleifen, lohnt sich eine kurze, direkte Rückfrage an Ni, was
   das Mergen blockiert – sonst bleibt der Sammel-Post (Vorschlag 1) auf
   Dauer kleiner als er sein könnte.

_Letztes Update: 2026-10-22_
