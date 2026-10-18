# Marketing-Chef Bericht

**Datum:** 2026-10-18

## Was ist seit dem letzten Eintrag (2026-10-17) passiert?

Die wichtigste Neuigkeit: Der Avatar-Fehlerzustand, den ich dir die letzten
Berichte über als "Status unklar" gemeldet habe, ist jetzt wirklich fertig
und doppelt gegengeprüft. IT-Chef hat heute (18.10.) in `useChat.ts` an
allen sechs betroffenen Stellen bestätigt: Schlägt eine Flug- oder
Unterkunftssuche fehl, zeigt der Avatar jetzt sein Warndreieck statt
weiter zu lächeln – und das ein zweites Mal im Code gegengeprüft, nicht
nur behauptet.

Daneben kam ein neuer, noch offener Punkt dazu: Wählt man einen Flug und
wechselt danach das Transportmittel (z. B. auf Zug), bleibt die alte
Flugverbindung als Detailzeile stehen ("Zug · Berlin → Lissabon · 149 €").
Noch nicht gefixt, braucht laut IT-Chef eine echte Entscheidung – für
Marketing also noch kein Thema, nur als Kandidat vormerken.

Sonst: zwei Testabdeckungs-Läufe (Badge, Variantenfunktionen) ohne
Nutzer-sichtbare Wirkung, und die Changelog-Grundsatzfrage aus dem letzten
Bericht ist weiterhin offen – das ist jetzt der dritte Bericht in Folge mit
demselben Punkt. Keine neuen Nutzungsdaten vorhanden, daher auch keine
Zahlen in diesem Bericht.

## Vorschläge

1. **Avatar-Fix jetzt als eigenen Mini-Post bringen – der war extra
   dafür zurückgestellt.** Die letzten beiden Berichte haben genau diese
   Idee aufgeschoben, "bis das sauber bestätigt ist". Jetzt ist sie
   bestätigt. Botschaft: "Wenn's schiefgeht, tut unser Avatar nicht so,
   als wäre alles gut" – kurzer Vorher/Nachher-Screenshot (lächelnd vs.
   Warndreieck bei fehlgeschlagener Suche), passt zur Content-Säule
   "Ehrlichkeit als Feature".
2. **Changelog-Entscheidung diese Woche wirklich treffen, sonst die
   Alternative jetzt umsetzen.** Dritter Bericht mit offener Frage ist
   ein Signal, nicht mehr zu warten. Alternative bleibt: stärkste
   Einzelgeschichte (aktuell der Avatar-Fix, siehe Punkt 1) als Solo-Post
   statt auf die komplette Footer-Changelog-Seite zu warten.
3. **"Zug mit Flugdetails" als Kandidat für die nächste Sammel-Ausgabe
   vormerken, nicht einzeln posten.** Zu technisch/klein für einen eigenen
   Post, aber ein gutes Beispiel für "wir merken auch die kleinen
   Unstimmigkeiten" in einer künftigen Build-in-public-Runde.
4. **Zielgruppen-Content-Linien (Paare/Familien/Solo) aus dem
   Marketing-Konzept endlich anschieben.** Seit dem Konzeptpapier keine
   Bewegung. Lässt sich unabhängig vom Code-Fortschritt starten – z. B.
   mit einem ersten Post zur Solo-Reisenden-Zielgruppe, da hier noch
   nichts existiert.

_Letztes Update: 2026-10-18_
