# Marketing-Chef Bericht

**Datum:** 2026-10-03

## Was ist seit dem letzten Eintrag (2026-10-02) passiert?

Beide gestern gemeldeten Nicht-fix-Punkte sind jetzt tatsächlich live:
Der `formatDuration`-Fix zeigt bei reinen Sekundenwerten ehrlich "—"
statt des erfundenen "1min", und der Favoriten-Button "Reise mit KI
planen" übergibt jetzt wirklich das angeklickte Ziel an den Chat statt
ihn stillschweigend zu ignorieren. Beides lief über Nacht durch
IT-Chef, wurde unabhängig verifiziert und gemergt.

Direkt danach kam der nächste Haken: Support-Chef fand, dass genau
dieser neue Favoriten-Effekt ein Problem hat, wenn schon eine andere
Reiseplanung läuft — über "Neu starten" oder die häufige Quick-Reply
"Neue Reise planen" konnte ein tagealter Favoriten-Klick ungefragt als
neues Ziel einschleichen. Dieser Fund wurde noch am selben Tag per PR
#27 automatisch gefixt. Ein kompletter Fund-zu-Fix-Zyklus innerhalb
eines Tages — genau die Art Tempo, die als Vertrauenssignal taugt,
aber erst zählt, wenn sie mehrfach nachweisbar ist.

Die Flugsuche-Ankündigung im Hauptchat ("Ich suche jetzt nach echten
Flug-Verbindungen") löst weiterhin keine echte Suche aus — unverändert
offen. Die Kanal-Entscheidung aus Sprint 1 steht jetzt über elf Wochen
still.

## Vorschläge

1. **Favoriten-Button jetzt von der Nicht-fix-Liste streichen — aber
   noch nicht lauthals bewerben.** Die Grundfunktion und der
   Reset-Rand­fall sind beide gefixt. Für einen konkreten Produkttext
   ("dein Ziel, ein Klick weiter geplant") reicht das jetzt inhaltlich;
   ich würde trotzdem eine ruhige Woche ohne neuen Fund in diesem
   Bereich abwarten, bevor es in einen Kanal geht.

2. **Flugsuche bleibt tabu — unverändert.** Seit Ende September offen,
   jetzt auch über mehrere Tage ohne Fortschritt. Für Landingpage/Ads/
   Social gilt weiterhin: "wir finden dir echte Flüge" erst, wenn es
   stimmt.

3. **Der Fund-zu-Fix-Zyklus von heute ist das bessere Changelog-Motiv
   als jeder Einzelfix.** Statt "Button X gefixt" wäre eine Zeile wie
   "wir haben gestern einen Bug *selbst* gefunden und noch am selben
   Tag behoben" greifbarer für Vertrauen — aber auch das erst, sobald
   ein Kanal steht und sich das Muster wiederholt, nicht nach einem
   einzelnen Vorfall.

4. **Kanal-Entscheidung bleibt der eigentliche Engpass.** Elf Wochen
   Stillstand, während sich jetzt sogar ein echtes kleines
   Erfolgsnarrativ (Dialog-Serie + heutiger Fund-zu-Fix-Zyklus)
   anstaut. Unveränderte Empfehlung: ein einzelner, risikoarmer Kanal
   (z. B. reiner Changelog-Feed auf der Seite selbst) wäre besser als
   weiteres Warten auf die große Zielgruppen-Entscheidung.

_Letztes Update: 2026-10-03_
