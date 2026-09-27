# Marketing-Chef Bericht

**Datum:** 2026-09-27

## Was ist seit dem letzten Eintrag (2026-09-26) passiert?

Der Mietwagen-Fix (PR #23) ist bestätigt gelandet – Support-Chef hat ihn
gegengeprüft. Direkt danach kam aber schon der nächste kleine Fund in
derselben Ecke: FlightCard und TrainCard zeigen keinen Klarname-Fallback,
wenn das Namensfeld fehlt (z.B. Rohdaten wie IATA-Codes statt eines
lesbaren Namens). IT-Chef hat den Punkt heute nur vermerkt, noch nicht
gefixt – also weiterhin ein offener Kandidat, keine fertige Story.

Der eigentliche Trend bleibt aber woanders: Der Merge-Rückstau bei
it-chef/auto wächst weiter (jetzt 8 Tage in Folge blockiert). Das ist
kein Marketing-Thema per se, aber ein Risiko für die "wir schaffen,
was wir versprechen"-Erzählung, sobald echte Nutzer:innen drauf
schauen – ungemergte, aber grün geprüfte Fixes sind für Außenstehende
nicht von "kein Fix vorhanden" zu unterscheiden.

Die vier Grundsatzfragen (Kanal, Mini-Changelog-Seite, Format, Start)
sind weiterhin unbeantwortet – jetzt über sechs Wochen. Keine neuen
Nutzungs- oder Erfolgszahlen bekannt.

## Vorschläge

1. **Die "Klarname statt Rohdaten"-Reihe als eigenes Mini-Thema
   bündeln.** IATA-Code-Funde, fehlende Hin-/Rückflug-Labels und jetzt
   der fehlende Namensfallback gehören alle zur selben Erzählung:
   "Wir zeigen dir, was du verstehst, nicht was die API liefert." Sobald
   die Fixes durch sind, reicht das für eine eigene kleine
   Content-Einheit – unabhängig von der Kanal-Frage schon mal
   vorformulieren.

2. **Merge-Rückstau intern ansprechen, bevor er nach außen sichtbar
   wird.** Acht Tage blockierte, aber geprüfte Fixes sind noch kein
   Marketing-Problem – solange niemand von außen den Unterschied
   zwischen "gefixt" und "gemergt" sieht. Das kippt, sobald ein Fix
   öffentlich sichtbar sein müsste (z.B. für genau die Klarname-Story
   oben). Kurzer Hinweis an Ni: Diesen Rückstau auflösen, bevor daraus
   ein Veröffentlichungs-Blocker wird.

3. **Kanal-Frage bleibt die eine Sache, die wirklich zählt.** Nach
   sechs Wochen ist der Punkt nicht mehr "keine Zeit gehabt", sondern
   strukturell der Flaschenhals für alles, was hier an Content-Ideen
   entsteht. Ohne neue Idee dazu – nur die Erinnerung, dass jede Woche
   Wartezeit real fertigen Content ungenutzt liegen lässt.

_Letztes Update: 2026-09-27_
