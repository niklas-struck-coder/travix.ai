# Marketing-Chef Bericht

**Datum:** 2026-09-02

## Was ist seit dem letzten Eintrag (2026-09-01) passiert?

Der IT-Kanal hat das "Ehrlichkeits-Log"-Thema von gestern munter weiter
gefüttert — diesmal direkt auf main gemergt, nicht nur als offene PR:

- Ein hängender Lade-Zustand nach Chat-Neustart ist behoben (Hotel-/
  Flugsuche blieb sonst optisch "am Laden", obwohl gar keine Suche lief).
- Zwei baugleiche Bugs gefixt: Kurze Zielnamen wie "Rom" wurden ohne
  Wortgrenze erkannt und lösten dadurch in Sätzen wie "etwas Romantisches
  am Meer" eine falsche, aber echte Suche/Kartenanzeige für Rom aus —
  einmal bei der automatischen Reiseziel-Erkennung, einmal beim
  Concierge-Chat zu laufenden Reisen.

Zusätzlich liegen zwei neue, noch **nicht gemergte** PRs (#12, #13) auf
demselben Ehrlichkeits-Kurs: #12 behebt denselben Wortgrenzen-Bug ein
drittes Mal (diesmal beim Erkennen von Zug/Flug/Auto als Verkehrsmittel),
#13 sorgt dafür, dass bei einem echten Netzwerkfehler eine ehrliche
deutsche Meldung statt rohem Englisch ("Failed to fetch") erscheint.

Kein neues Feature, keine neue Zielgruppe — dafür wächst die Beweisbasis
für "wir sagen dir ehrlich, was Sache ist" jeden Tag ein Stück weiter.

## Vorschläge

1. **"Ehrlichkeits-Log" jetzt wirklich launchen, nicht nur planen.**
   Wir reden seit zwei Berichten über dieses Format und das Materialregal
   wird eher voller als leerer. Ein erster Post muss keine acht Beispiele
   zeigen — schon 2-3 reichen für den Auftakt: "Travix hat 'Rom' irgendwo
   im Satz erkannt (auch in 'romantisch') — jetzt nur noch, wenn du
   wirklich Rom meinst." Ehrlich, technisch nachvollziehbar, kein Fake-Zahlen-Bedarf.

2. **Sobald #12/#13 gemergt sind: Fehlermeldungen als eigenes Mini-Thema.**
   "Kaputte Verbindung? Wir sagen's dir auf Deutsch, nicht mit einer
   englischen Fehlermeldung" ist ein greifbarer, sympathischer Kontrast zu
   Tools, die bei Störungen nur kryptischen Kauderwelsch zeigen. Bitte erst
   posten, wenn #13 gemerged ist — sonst stimmt die Behauptung im
   Hauptablauf noch nicht überall.

3. **Positionierung schärfen: "Der Concierge, der nachfragt statt rät."**
   Die wiederkehrende Bug-Klasse (Text wird zu leichtfertig interpretiert)
   zeigt indirekt, wie ernst das Produkt Nutzereingaben nimmt, sobald es
   sauber läuft. Das taugt als Markenkern-Satz für die nächste
   Positionierungs-Runde — nicht als Bug-Eingeständnis, sondern als
   Qualitätsversprechen ("wir erraten dein Ziel nicht, wir verstehen es").

4. **Kein Wunschdenken bei Kennzahlen.** Es gibt aktuell keine mir
   bekannten Nutzungs- oder Erfolgszahlen zu diesen Fixes — für Content
   also bei "was wurde ehrlicher/besser" bleiben, nicht bei "wie viele
   Nutzer betrifft das".

_Letztes Update: 2026-09-02_
