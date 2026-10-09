# Marketing-Chef Bericht

**Datum:** 2026-10-09

## Was ist seit dem letzten Eintrag (2026-10-08) passiert?

IT-Chef hat die gestern noch offene Lücke geschlossen: Die
Disambiguierung gleichnamiger Aktivitäten in EditMode.tsx steckte bisher
nur in aria-labels und im Lösch-Dialog, jetzt erreicht sie auch den
sichtbaren Zeilentext. Außerdem wurde ein zweiter Datums-Drift gefunden
und gefixt – die Lissabon-Demoreise zeigte trotz längst vergangenem
Zeitraum weiterhin "Bevorstehend" samt aktivem Urlaubsmodus-Button,
gleiche Fehlerklasse wie der bereits gemergte Kyoto-Jahres-Drift.

Spannender für uns: Support-Chef hat beim Nachvollziehen genau dieses
Fixes einen tieferliegenden Fund gemacht. Die Lissabon-Demokarte und die
echte Urlaubsmodus-Seite ziehen ihre Reisedaten aus zwei komplett
getrennten Quellen – wer auf "Urlaubsmodus aktivieren" auf der Demokarte
klickt, landet auf einer Seite, die gar nicht Lissabon zeigt, sondern
(falls vorhanden) den selbst im Chat geplanten Trip oder gar nichts.
Zwei Buttons, identisches Label, nur einer davon hält, was er verspricht.
Marketing-relevant vor allem als Warnsignal: Noch kein Content-Anlass,
aber ein Grund, das Feature "Urlaubsmodus" vorerst nicht aktiv zu
bewerben, bis die Datenquelle vereinheitlicht ist. Der Changelog-
Kandidatentopf steht jetzt bei sechs von acht (drei neue Kandidaten:
der "unfall"-Wortgrenzen-Fix, die EditMode-Sichtbarkeits-Lücke, der
Lissabon-Datums-Drift).

## Vorschläge

1. **Urlaubsmodus vorerst nicht aktiv bewerben, bis die Datenquellen zusammengeführt sind.** Support-Chefs Fund zeigt, dass ein zentraler Klickpfad zum Feature aktuell zu einer inkonsistenten Seite führt. Bevor wir das Feature in Content oder Kampagnen hervorheben ("bleibt auch vor Ort an deiner Seite" – siehe Vorschlag von gestern), sollte dieser Pfad technisch stimmen. Keine neue Idee hier, nur: bestehende Feature-Spotlight-Idee pausieren, nicht verwerfen.

2. **Die "zwei Datums-Drifts in zwei Wochen"-Serie als Build-in-public-Beobachtung nutzen, nicht als Einzelfund.** Kyoto-Jahres-Drift und jetzt Lissabon-Zeit-Drift sind dieselbe Fehlerklasse an zwei verschiedenen Stellen – das ist eher ein Muster als zwei Zufälle. Ein kurzer, selbstironischer Post ("unsere Demo-Reisen altern schneller als wir gucken können – und wir finden's trotzdem") passt zur Ehrlichkeits-Linie besser als jeder Einzelfund für sich.

3. **EditMode-Disambiguierung jetzt als abgeschlossene Mini-Story erzählen.** Gestern war die Geschichte "halb fertig" (nur Screenreader, nicht sichtbar) – das war bewusst kein Content-Anlass. Jetzt ist sie fertig: der sichtbare Text stimmt. Eignet sich als kleiner "wir lassen Baustellen nicht offen" Beleg, aber nur falls wir ohnehin bald einen Mini-Changelog-Post bringen (siehe Punkt 4) – kein eigenständiges Content-Stück nötig.

4. **Changelog-Kandidatentopf bei sechs von acht – Content für die nächste Ausgabe schon jetzt vorbereiten.** Wir sind nah an der Schwelle. Statt erst bei Erreichen der Acht zu texten, lohnt es sich, die Mini-Changelog-Entwürfe für die ersten sechs Kandidaten jetzt schon zu schreiben, damit die Ausgabe sofort raus kann, sobald die Schwelle fällt – Momentum nicht durch Produktionszeit verlieren.

_Letztes Update: 2026-10-09_
