# Marketing-Chef Bericht

**Datum:** 2026-10-19

## Was ist seit dem letzten Eintrag (2026-10-18) passiert?

Zwei Punkte aus dem letzten Bericht haben sich geklärt, beide positiv:

Der "Zug mit Flugdetails"-Kandidat, den ich zuletzt nur als unklaren
Kandidaten vorgemerkt hatte, ist jetzt bestätigt gefixt – Support-Chef hat
selbst im Code nachgeschaut: Wechselt man nach einer Flugauswahl das
Transportmittel, wird die alte Flugverbindung jetzt korrekt mitgelöscht
(`useChat.ts:373`). Kein offener Kandidat mehr, sondern ein zweiter
fertiger "Ehrlichkeit als Feature"-Moment neben dem Avatar-Fix.

Dazu kam ein neuer, automatisch gefixter Bug: `formatTime()` zeigte bei
kaputten Zeitstempeln (z. B. aus einer fehlerhaften Flugdaten-Antwort) den
Text "Invalid Date" statt eines Platzhalters – jetzt zeigt es "—"
([PR #34](https://github.com/niklas-struck-coder/travix.ai/pull/34),
wartet noch auf Merge). Passt vom Prinzip her genau zum Avatar-Fix: Statt
etwas Kaputtes zu verstecken, zeigt die App ehrlich, dass etwas nicht
geklappt hat.

Der Rest der letzten Tage war reine Testabdeckung (Button, Card, Select,
Tabs) ohne für Nutzer sichtbare Änderung. Die Changelog-Grundsatzfrage aus
den letzten drei Berichten ist weiterhin ungelöst – das ist jetzt der
vierte Bericht in Folge mit demselben offenen Punkt. Keine neuen
Nutzungsdaten vorhanden, daher auch diesmal keine Zahlen im Bericht.

## Vorschläge

1. **Jetzt einen Sammel-Post bauen statt weiter einzeln zu vertagen.**
   Drei bestätigte Fixes liegen bereit: Avatar-Warndreieck, Zug/Flug-Reset
   und (sobald PR #34 gemergt ist) "—" statt "Invalid Date". Das ist genug
   Material für einen "Diese Woche in der App behoben"-Post statt auf die
   komplette Footer-Changelog-Seite zu warten. Löst damit auch die
   Changelog-Frage, die jetzt im vierten Bericht in Folge offen ist – nicht
   weiter diskutieren, sondern die Alternative einfach umsetzen.
2. **"Ehrlichkeit als Feature" als wiederkehrende Content-Linie statt
   Einzelposts etablieren.** Drei konkrete Belege in zwei Wochen (Avatar
   zeigt Fehler statt zu lächeln, kein Flugrest nach Transportwechsel,
   ehrlicher Platzhalter statt "Invalid Date") sind ein eigenes Muster:
   "Wir verstecken Fehler nicht, wir zeigen sie" als kleine Serie,
   wiederverwendbar bei jedem künftigen Fix dieser Art.
3. **Zielgruppen-Content-Linien (Paare/Familien/Solo) endlich starten.**
   Seit dem Konzeptpapier weiterhin keine Bewegung – unabhängig vom
   Code-Fortschritt umsetzbar. Vorschlag: erster Post zur
   Solo-Reisenden-Zielgruppe, da hier noch gar nichts existiert.

_Letztes Update: 2026-10-19_
