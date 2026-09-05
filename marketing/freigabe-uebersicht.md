# Freigabe-Übersicht — was liegt bereit, was blockiert (Stand 2026-09-05)

Dieses Dokument sortiert die inzwischen acht fertigen Entwürfe in
`marketing/`, damit die eigentliche Bremse (nicht neue Ideen, sondern
Freigabe/Priorisierung durch Ni) leichter zu lösen ist. Erstellt/
aktualisiert werden nur diese Übersicht bzw. neue Entwürfe, nichts wird
gepostet oder verändert.

## Update 2026-09-05: erstmals ein neuer, eigenständiger Entwurf statt nur einer Übersichts-Ergänzung — Mini-Changelog-Konzept umgesetzt, drei weitere Tier-4-Kandidaten geprüft

Statt zum elften Mal in Folge nur diese Übersicht zu ergänzen, setzt
dieser Lauf die bereits im eigenen interaktiven Bericht vom 2026-09-04
vorgeschlagene, aber noch nicht umgesetzte Idee tatsächlich um: ein
öffentlicher Mini-Changelog *im Produkt* (Footer-Seite), der die
wachsende Tier-4-Liste unten sichtbar macht, ohne die drei Fragen unten
zu berühren (kein Social-Kanal, kein Bezug zu 6.2, keine Entscheidung
zum wiederkehrenden *Social*-Format nötig — siehe Begründung im
Dokument selbst). Neuer Entwurf:
**`marketing/mini-changelog-konzept.md`** — Konzept, Design-Brief für
IT-Chef und eine vollständig ausgearbeitete erste Ausgabe (Fixes vom
25.08. bis 05.09., alle bereits in `main` gemergt, kuratiert in fünf
Themenblöcke statt einer technischen Liste).

Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`8242a53`,
04.09.) geprüft: 13 neue Commits. Fünf echte Codeänderungen einzeln per
`git show` geprüft — drei davon content-relevant und neu in die erste
Mini-Changelog-Ausgabe sowie den Tier-4-Kandidatentopf (Punkt 7)
aufgenommen:

- **`d34796f` (04.09.):** automatische Unterkunftssuche im
  Haupt-Chat-Ablauf bot nach einem echten Suchfehler keinen anklickbaren
  nächsten Schritt mehr, nur ein kompletter Neustart half — jetzt wie
  der "Bearbeiten"-Pfad mit "Neue Reise planen" als Ausweg.
- **`acc9ae8` (05.09.):** Mikrofon-Knopf im Chat konnte bei einem
  Browser-Fehler (z. B. verweigerte Berechtigung) dauerhaft im
  "Aufnahme läuft"-Zustand hängen bleiben, ohne dass die bereits
  vorhandene Fehlermeldung je erschien.
- **`add329b` (05.09.):** Speichern des Chat-Zustands in `localStorage`
  konnte bei vollem Speicher oder im privaten Modus den ganzen Chat
  abstürzen lassen — jetzt abgefangen, analog zum bereits bestehenden
  Lesezugriffs-Schutz.

Zwei weitere geprüft, aber **nicht** aufgenommen (reine
Validierungskorrekturen ohne "falsche Information ohne
Erkennbarkeit"-Erzählung, gleiche Einstufung wie z. B. `89f63c2`/
`ab7f4e6`/`4ee4b4a`):
- **`2e09258` (04.09.):** IATA-Feld im Flug-Assistenten ohne
  Buchstabenprüfung.
- **`26f7edd` (05.09.):** Flugsuche verhinderte identischen
  Start-/Zielflughafen nicht.

**Zur Sprachfunktion (weiterhin nicht bewerben):** `acc9ae8` behebt
einen der beiden Gründe, die gegen eine Bewerbung von "sprich einfach
mit Travix" genannt wurden (hängender Mikrofon-Knopf). Der zweite Grund
(PR #16, fehlender Stopp-Knopf) ist laut `git merge-base
--is-ancestor` weiterhin nicht in `main` gemergt — Zurückhaltung bleibt
unverändert, solange nicht beide behoben sind.

**Warum sicher genug für einen neuen, eigenständigen Entwurf statt nur
einer Übersichts-Ergänzung:** Ergebnis ist weiterhin ein reines
Entwurfsdokument, kein Live-Vorgang — keine Seite wurde tatsächlich
gebaut, nichts gepostet. Keine erfundenen Kennzahlen — jeder Punkt in
der ersten Ausgabe stammt aus bereits verifizierten Commits. Keine
offene Positionierungs-Grundsatzfrage: wendet nur die bestehende
Positionierung an. Berührt bewusst keine der drei unten offenen Fragen
(siehe Begründung im neuen Dokument) — die einzige neue Frage an Ni ist,
ob das Format überhaupt gebaut werden soll, was den autonomen Lauf nicht
daran hindert, den Entwurf schon jetzt bereitzustellen (gleiche Logik
wie bei `kampagnen-konzept-ads.md`/`presse-multiplikatoren-strategie.md`,
die ebenfalls vor einer Ni-Entscheidung als fertige Vorlage entstanden).

## Update 2026-09-04: zwei weitere Ehrlichkeits-/Zuverlässigkeits-Fixes geprüft (Chat-Suchfehler bei Unterkunft/Flug sahen wie Null-Treffer bzw. Sackgasse aus, TypeError bei kaputten Alt-Trip-Daten konnte Buchungs-/Chat-/Kartenseite leer lassen) — zwei weitere Tier-4-Kandidaten, drei reine Validierungs-/Formatierungs-Fixes ohne Content-Relevanz, weiterhin kein achtes Content-Stück

Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`dfb31cb`,
03.09., laut `git merge-base --is-ancestor` bereits vollständig in `main`
gemerged) geprüft: 14 neue Commits. Der größte Teil ohne Content-Relevanz
— zwei Freigabe-Chef-Merges/-Logs, ein Daily-Status-Update, ein
Support-Chef-Bericht (`caf9f4b`, dieselben Fehleranzeige-Funde wie unten,
keine neue Information), ein eigener interaktiver Marketing-Chef-Bericht
(`9050392`, nur Einordnung im Chat, rät von verfrühtem
Sprachfunktions-Marketing ab — keine neue Entscheidung von Ni) sowie zwei
IT-Chef-Berichte (`4d1ec69`, `88adaae`, beide vor diesem Auto-Lauf
entstanden, reine Einordnung im Chat).

Fünf echte Codeänderungen einzeln per `git show` geprüft:

- **`7a13a42` (03.09., neunundzwanzigster IT-Chef-Lauf):** `callDuffelProxy()`
  lehnt seine Promise bei einem echten Duffel-Fehler nicht ab, sondern löst
  sie mit einem `errors`-Feld auf — die drei Suchaufrufe in `useChat.ts`
  (automatische Unterkunftssuche, Unterkunftssuche über "Bearbeiten",
  `runFlightSearch`) werteten `result.errors` in ihrem `.then()` aber nicht
  oder nicht vollständig aus. Eine echte Suchpanne sah dadurch für die
  Nutzerin wie eine ehrliche Null-Treffer-Suche aus (Unterkunft) bzw.
  endete ohne jeden klickbaren nächsten Schritt (Flug) — die manuellen
  Suchseiten `Hotelsuche.tsx`/`Flugsuche.tsx` hatten diese Unterscheidung
  bereits richtig. Jetzt prüfen alle drei `.then()`-Zweige `result.errors`
  genau wie die manuellen Suchseiten.
- **`8e52f6f` (04.09., dreiunddreißigster IT-Chef-Lauf):** `loadStoredChat()`
  castet den geparsten localStorage-Wert nur, ohne ihn zu validieren —
  `hasTripData()` griff danach ungeschützt auf `activities.length` zu.
  Fehlt `activities` (Alt-Daten aus einer früheren Version), wirft das
  einen `TypeError` mitten im Rendern von `KiChat.tsx`, `Buchung.tsx` und
  `Kartenansicht.tsx` — ohne ErrorBoundary bleibt die Seite dann komplett
  leer, keine Fehlermeldung, kein nächster Schritt. Jetzt zusätzlich
  `Array.isArray(activities)`-Prüfung vor dem `.length`-Zugriff.
- **`f56b9a8` (04.09., zweiunddreißigster IT-Chef-Lauf):** `FlightCard.tsx`/
  `HotelCard.tsx` zeigten Preise unformatiert ("249.00 EUR") statt im
  deutschen Format. Neue `formatOfferPrice()`-Hilfsfunktion
  (`Intl.NumberFormat('de-DE', ...)`). Reine Formatierungskorrektur, keine
  vorher irreführende oder falsche Information — der Betrag selbst war
  schon richtig, nur die Darstellung unpoliert.
- **`ab7f4e6` (03.09., dreißigster IT-Chef-Lauf):** Hinflug-/Check-in-Datum
  hatten kein `min`-Attribut auf das heutige Datum, ein Datum in der
  Vergangenheit ließ sich wählen. Reine Validierungskorrektur ohne eigene
  Ehrlichkeits-Erzählung, gleiche Einstufung wie `89f63c2` (03.09.).
- **`4ee4b4a` (04.09., einunddreißigster IT-Chef-Lauf):** Passagierzahl im
  `FlightWizard.tsx` konnte bei nicht-numerischer Eingabe zu `NaN` werden,
  ungeprüft in die Flugsuche gegeben. Reine Validierungskorrektur nach
  demselben Muster wie das bereits bestehende `HotelWizard.tsx`, keine
  eigene Ehrlichkeits-Erzählung.

`7a13a42` und `8e52f6f` passen inhaltlich zum bereits skizzierten
"Ehrlichkeits-Log"-Format — beide verhindern, dass eine Nutzerin eine
falsche oder gar keine Information bekommt, ohne das erkennen zu können
(eine echte Suchpanne, die wie ein ehrliches Null-Ergebnis aussah; eine
komplett leere Seite ohne jeden Hinweis bei kaputten Alt-Daten) — und
wandern in den Tier-4-Kandidatentopf, gebunden an die weiterhin offene
Frage 3 unten. `f56b9a8`, `ab7f4e6` und `4ee4b4a` sind reine
Validierungs-/Formatierungskorrekturen ohne diese Erzählung, gleiche
Einstufung wie z. B. `89f63c2` (03.09.) und `69bcba5` (01.09.).

**Warum trotzdem kein achtes Content-Stück:** Dieselbe Prüfung wie bei
jedem bisherigen Lauf — `ZEITPLAN.md` führt 6.2 (Buchen-Button) weiterhin
als offen, kein neuer Kanal/keine Landingpage live, und `status.md`
(Stand 2026-09-03) sowie dieses Dokument enthalten keine Notiz von Ni zu
einer der drei unten offenen Fragen. Alle drei Bedingungen für ein neues,
eigenständiges Stück bleiben damit unverändert unerfüllt. Die zwei neuen
Ehrlichkeits-Kandidaten werden stattdessen unten im Tier-4-Kandidatentopf
(Punkt 7) ergänzt.

**Warum sicher genug für eine Dokument-Ergänzung:** reine
Übersichts-Aktualisierung, kein Live-Vorgang — nichts gepostet, kein
Kanal angelegt, kein bestehender Abschnitt verändert oder gelöscht (nur
diese neue Sektion und eine Ergänzung im bestehenden Tier-4-Punkt).
Keine erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage:
trägt nur bereits im Repo nachprüfbare Fakten nach (Commit-Historie,
Code-Diffs, `ZEITPLAN.md`-Stand).

## Update 2026-09-03: vier weitere Ehrlichkeits-Fixes geprüft (nicht-kuriertes Reiseziel im Concierge, Avatar-Zustand bei Ausweich-Antworten, Transportmittel-Erkennung ohne Wortgrenzen, rohe Duffel-Fehlertexte bei Netzwerk-/Parse-Fehlern) — vier weitere Tier-4-Kandidaten, ein reiner Validierungs-Fix ohne Content-Relevanz, weiterhin kein achtes Content-Stück

Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`c0a4227`,
02.09., laut `git merge-base --is-ancestor` bereits vollständig in `main`
gemerged) geprüft: 13 neue Commits. Der größte Teil ohne Content-Relevanz
— zwei Merge-Commits, ein Freigabe-Chef-Log, ein Daily-Status-Update, ein
Support-Chef-Bericht (`4dbdec6`, dieselben zwei Concierge-Funde wie unten,
keine neue Information) sowie ein eigener interaktiver
Marketing-Chef-Bericht und ein IT-Chef-Bericht (`8fa6a0a`, `f5a9046`, beide
vor diesem Auto-Lauf entstanden, reine Einordnung im Chat, keine autonome
Aktion dieses Skripts).

Fünf echte Codeänderungen einzeln per `git show` geprüft:

- **`e5f11c9` (02.09., vierundzwanzigster IT-Chef-Lauf):** Der
  Urlaubsmodus-Concierge antwortete für ein echtes, im KI-Chat geplantes
  Reiseziel außerhalb der kleinen kuratierten Liste (z. B. "Bali") bisher
  mit demselben Satz wie ganz ohne geplante Reise — fachlich falsch, da ja
  sehr wohl eine Reise geplant ist. Neue `hasKnownDestination()`
  unterscheidet jetzt drei statt zwei Fälle (kein Ziel / Ziel gesetzt aber
  nicht kuratiert / Ziel bekannt), inklusive der Quick-Replies in
  `useConcierge.ts`, die vorher trotzdem die drei themenbezogenen Chips
  zeigten und bei jedem Klick dieselbe irreführende Antwort auslösten.
- **`5127b9f` (02.09., fünfundzwanzigster IT-Chef-Lauf):** direkte
  Fortsetzung von `e5f11c9` — der Avatar sprang nach jeder
  Concierge-Antwort unbedingt auf `'happy'`, auch bei den ehrlichen
  Ausweich-Antworten (kein/unbekanntes Ziel, generische Demo-Antwort).
  `getConciergeReply()` liefert jetzt `{ text, matched }` statt reinem
  String, der Avatar wechselt bei `matched: false` auf den bereits
  bestehenden `'error'`-Zustand statt fälschlich fröhlich zu wirken.
- **`1f0641b` (03.09., siebenundzwanzigster IT-Chef-Lauf):** derselbe
  Wortgrenzen-Bug wie bei `findKnownDestination()`/`findFacts()` (siehe
  Update 2026-09-02), diesmal in `detectTransportMode()`
  (`mockAdvisor.ts`) — reiner `String.includes()`-Vergleich matchte
  Transport-Keywords auch mitten in unbeteiligten Wörtern ("Business
  Class bitte" fälschlich als Bus, "Zimmerservice" fälschlich als Zug/ICE
  erkannt). Der Bot bestätigte dadurch ein falsches Transportmittel, ohne
  dass die Nutzerin das leicht korrigieren konnte.
- **`b6bc2f3` (03.09., achtundzwanzigster IT-Chef-Lauf):** schließt eine
  Lücke im bereits am 25.08. begonnenen Duffel-Fehlermeldungs-Fix
  (`callDuffelProxy()`, `src/lib/duffel/client.ts`) — der damalige Fix
  deckte nur den `!response.ok`-Zweig ab, der separate `catch`-Block für
  einen fehlgeschlagenen `fetch()` selbst (offline, "Failed to fetch")
  oder eine kaputte JSON-Antwort gab weiterhin den rohen `error.message`
  ungefiltert durch. Jetzt nach demselben Muster eine ehrliche deutsche
  Meldung mit konkretem nächsten Schritt.
- **`89f63c2` (03.09., sechsundzwanzigster IT-Chef-Lauf):** `isValid` in
  `FlightWizard.tsx` prüfte bei "Hin- und Rückflug" bisher nur, ob
  überhaupt ein Rückflugdatum gesetzt ist, nicht ob es nach dem
  Hinflugdatum liegt — der "Flüge suchen"-Button blieb für eine
  unmögliche Reise anklickbar. Reine Validierungskorrektur ohne eigene
  Ehrlichkeits-Erzählung, gleiche Einstufung wie `69bcba5` (01.09.).

Vier der fünf (`e5f11c9`, `5127b9f`, `1f0641b`, `b6bc2f3`) passen
inhaltlich zum bereits skizzierten "Ehrlichkeits-Log"-Format — jeweils
eine Situation, in der die Nutzerin ohne den Fix falsche, irreführende
oder unpassend fröhlich wirkende Informationen präsentiert bekommen
hätte, ohne das erkennen zu können — und wandern in den
Tier-4-Kandidatentopf, gebunden an die weiterhin offene Frage 3 unten.
`89f63c2` ist wie `69bcba5` (01.09.) eine reine Validierungs-/
UI-Korrektur ohne diese Erzählung.

**Warum trotzdem kein achtes Content-Stück:** Dieselbe Prüfung wie bei
jedem bisherigen Lauf — `ZEITPLAN.md` führt 6.2 (Buchen-Button) weiterhin
als offen, kein neuer Kanal/keine Landingpage live, und `status.md`
(Stand 2026-09-02) sowie dieses Dokument enthalten keine Notiz von Ni zu
einer der drei unten offenen Fragen. Alle drei Bedingungen für ein neues,
eigenständiges Stück bleiben damit unverändert unerfüllt. Die vier neuen
Ehrlichkeits-Kandidaten werden stattdessen unten im Tier-4-Kandidatentopf
(Punkt 7) ergänzt.

**Warum sicher genug für eine Dokument-Ergänzung:** reine
Übersichts-Aktualisierung, kein Live-Vorgang — nichts gepostet, kein
Kanal angelegt, kein bestehender Abschnitt verändert oder gelöscht (nur
diese neue Sektion und eine Ergänzung im bestehenden Tier-4-Punkt).
Keine erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage:
trägt nur bereits im Repo nachprüfbare Fakten nach (Commit-Historie,
Code-Diffs, `ZEITPLAN.md`-Stand).

## Update 2026-09-02: drei weitere Ehrlichkeits-/Konsistenz-Fixes geprüft (stale Flug-Fehlermeldung, hängender Lade-Zustand nach Neustart, zwei baugleiche Wortgrenzen-Bugs bei Zielname-Erkennung) — drei weitere Tier-4-Kandidaten, ein reiner UI-Fix ohne Content-Relevanz, weiterhin kein achtes Content-Stück

Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`ac4df57`,
01.09., laut `git merge-base --is-ancestor` bereits vollständig in `main`
gemerged) geprüft: 13 neue Commits. Der größte Teil ohne Content-Relevanz
— zwei Merge-Commits (die eigene 01.09.-Ergänzung sowie den
Support-Chef-Fund derselben Runde nach `main`), zwei Freigabe-Chef-Logs,
ein Daily-Status-Update, ein Support-Chef-Auto-Log und -Bericht (gleiche
Hotelsuche-Auswahl-Situation wie im letzten Update bereits erfasst, keine
neue Information) sowie ein eigener interaktiver Marketing-Chef-Bericht
(`6634362`, nur Einordnung im Chat, keine autonome Aktion).

Fünf echte Codeänderungen einzeln per `git show` geprüft:

- **`4a8a573` (01.09., neunzehnter IT-Chef-Lauf):** direkte Fortsetzung
  der bereits erfassten Flug-Fehleranzeige-Serie — `flightErrors` wurde
  bei einer normalen Chat-Nachricht bisher nicht geleert (anders als
  `flightOffers`), sodass die rote Fehlerbox nach einer fehlgeschlagenen
  Suche stehen blieb, obwohl die Nutzerin längst normal weitergeschrieben
  hatte. Einziger bisheriger Ausweg war ein kompletter Neustart über
  "Neue Reise planen".
- **`69bcba5` (01.09., zwanzigster IT-Chef-Lauf):** Auswahl-Häkchen auf
  Hotel-/Flugkarte schaltete bisher auch dann auf "Ausgewählt" um, wenn
  das eigentliche Speichern (`updateStoredTrip`) fehlschlug — der
  Warnhinweis darunter widersprach dann dem Kartenzustand. Reine
  UI-Konsistenzkorrektur ohne eigene Ehrlichkeits-Erzählung, gleiche
  Einstufung wie der HotelCard-Paritätsfix vom 01.09. (bereits im letzten
  Update als "ohne Content-Relevanz" eingestuft).
- **`d947bf1` (02.09., einundzwanzigster IT-Chef-Lauf):** `resetChat()`
  setzte `stayLoading`/`flightLoading` bisher nicht zurück — ein Klick auf
  "Neue Reise planen" während eine Suche noch lief, ließ den neu
  gestarteten Chat im "sucht"-Zustand hängen und zeigte anschließend
  Ergebnisse/Fehler der vorherigen, eigentlich verworfenen Reiseplanung.
  Im Kern derselbe Charakter wie der bereits gelistete
  Hotelsuche-Stale-Ergebnisse-Fix vom 01.09. (`0042f68`): eine Nutzerin
  hätte Informationen gesehen, die nicht zu ihrer aktuellen, bewusst neu
  begonnenen Planung gehörten.
- **`8eca941` (02.09., zweiundzwanzigster IT-Chef-Lauf):**
  `findKnownDestination()` verglich Zielnamen bisher per rohem
  Teilstring-Vergleich ohne Wortgrenzen — kurze Namen wie "Rom" matchten
  dadurch auch mitten in unbeteiligten Wörtern ("romantisch", "Romania").
  Da diese Funktion die automatische Hotel-/Flugsuche sowie den Kartenpin
  in `Kartenansicht.tsx` steuert, konnte ein Satz wie "etwas Romantisches
  am Meer" still eine echte, aber falsche Suche für Rom auslösen — eine
  Nutzerin hätte Ergebnisse für ein Ziel bekommen, das sie nie genannt
  hat, ohne das erkennen zu können.
- **`e796c69` (02.09., dreiundzwanzigster IT-Chef-Lauf):** derselbe
  Wortgrenzen-Bug, unabhängig im Urlaubsmodus-Concierge
  (`mockConcierge.ts`) gefunden und behoben — dort noch direkter
  Ehrlichkeits-relevant, weil die Funktion laut eigenem Code-Prinzip
  keine erfundenen Fakten liefern soll: ohne den Fix hätte der Concierge
  auf eine Frage zu "Romantikurlaub" mit echten, aber falschen
  Rom-Fakten geantwortet, statt ehrlich nach dem geplanten Reiseziel zu
  fragen.

Vier der fünf (`4a8a573`, `d947bf1`, `8eca941`, `e796c69`) passen inhaltlich
zum bereits skizzierten "Ehrlichkeits-Log"-Format — jeweils eine Situation,
in der die Nutzerin ohne den Fix falsche, veraltete oder erfundene
Informationen präsentiert bekommen hätte, ohne das erkennen zu können —
und wandern in den Tier-4-Kandidatentopf, gebunden an die weiterhin offene
Frage 3 unten. `69bcba5` ist wie `ce59905` (01.09.) eine reine
UI-Konsistenzkorrektur ohne diese Erzählung.

**Warum trotzdem kein achtes Content-Stück:** Dieselbe Prüfung wie bei
jedem bisherigen Lauf — `ZEITPLAN.md` führt 6.2 (Buchen-Button) weiterhin
als offen (Zeile 249), kein neuer Kanal/keine Landingpage live (Zeile
519), und `status.md` (Stand 2026-09-01) sowie dieses Dokument enthalten
keine Notiz von Ni zu einer der drei unten offenen Fragen. Alle drei
Bedingungen für ein neues, eigenständiges Stück bleiben damit unverändert
unerfüllt. Die vier neuen Ehrlichkeits-Kandidaten werden stattdessen unten
im Tier-4-Kandidatentopf (Punkt 7) ergänzt.

**Warum sicher genug für eine Dokument-Ergänzung:** reine
Übersichts-Aktualisierung, kein Live-Vorgang — nichts gepostet, kein
Kanal angelegt, kein bestehender Abschnitt verändert oder gelöscht (nur
diese neue Sektion und eine Ergänzung im bestehenden Tier-4-Punkt).
Keine erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage:
trägt nur bereits im Repo nachprüfbare Fakten nach (Commit-Historie,
Code-Diffs, `ZEITPLAN.md`-Stand).

## Update 2026-09-01: Flug-Fehleranzeige-Nachfolgefix und Hotelsuche-Stale-Ergebnisse geprüft — zwei weitere Tier-4-Kandidaten, zwei reine UI-/A11y-Fixes ohne Content-Relevanz, weiterhin kein achtes Content-Stück

Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`b78378a`,
31.08., laut `git merge-base --is-ancestor` bereits vollständig in `main`
gemerged) geprüft: zwölf neue Commits. Der größte Teil ohne
Content-Relevanz — ein Daily-Status-Update, drei Freigabe-Chef-Merges/
-Logs, ein Support-Chef-Bericht (`c4e16a5`) und -Auto-Log (`f96ddbc`,
beide zur selben Fehleranzeige-Situation wie unten, keine eigene neue
Information für Content) sowie ein IT-Chef-Auto-Lauf ohne sicheren Punkt
(`044b289`).

Vier echte Codeänderungen einzeln per `git show` geprüft:

- **`7b65423` (31.08., vierzehnter IT-Chef-Lauf, Flug-Fehleranzeige
  tatsächlich sichtbar gemacht):** Direkte Fortsetzung des bereits am
  31.08. dokumentierten Fixes `b9d0267` (Flugsuche-Fehler jetzt in
  `flightErrors` statt `flightOffers: []`) — der Zustand wurde zwar seit
  `b9d0267` korrekt gesetzt, aber `KiChat.tsx` prüfte beim Rendern von
  `<FlightResults>` nur `flightLoading`/`flightOffers`, nicht
  `flightErrors`. Ergebnis: nach einem echten Suchfehler sah die Nutzerin
  nach dem "sucht"-Avatar buchstäblich nichts mehr — die Fehlermeldung
  aus `b9d0267` existierte im State, kam aber nie auf dem Bildschirm an.
  Zusätzlich bekamen die beiden "Bearbeiten"-Fehlerpfade (Unterkunft,
  Flug) nach einem Fehlschlag jetzt ebenfalls `['Neue Reise planen']`
  statt leerer `quickReplies`, analog dem Hauptchat-Ausweg aus `c2fff0b`.
  Schließt damit die Lücke, die der eigene Eintrag vom 31.08. noch nicht
  kennen konnte (der Fix kam erst danach).
- **`0042f68` (01.09., sechzehnter IT-Chef-Lauf, Hotelsuche zeigte
  veraltete Ergebnisse als aktuelle):** `Hotelsuche.tsx` setzte `offers`
  vor einer neuen Suche anders als das strukturell identische
  `Flugsuche.tsx` nicht auf `null` zurück — eine zweite Suche zeigte bis
  zur Antwort weiterhin die alten Hotelkarten der ersten Suche, bei einer
  echten Null-Treffer-zweiten-Suche blieben sogar dauerhaft veraltete
  Karten stehen. Im Kern derselbe Ehrlichkeits-Charakter wie die bereits
  gelisteten Fehler-/Null-Treffer-Fixes: eine Nutzerin sah Ergebnisse, die
  nicht zu ihrer aktuellen Suche gehörten, ohne das erkennen zu können.

Zwei weitere Codeänderungen geprüft, aber bewusst **nicht** in den
Tier-4-Kandidatentopf aufgenommen, da reine UI-Paritäts- bzw.
Barrierefreiheits-Korrekturen ohne "ehrlich vs. irreführend"-Erzählung
(gleiche Einstufung wie z. B. die drei A11y-Fixes vom 29.08. oder der
ChecklistPanel-Icon-Fix vom 28.08., beide damals ebenfalls als "ohne
Content-Relevanz" eingestuft):

- **`ce59905` (01.09., siebzehnter IT-Chef-Lauf):** `HotelCard` bekam nie
  mit, ob ihr Angebot ausgewählt ist (Paritätslücke zu `FlightCard`) —
  jetzt korrigiert. Kein irreführender Zustand für die Nutzerin, nur ein
  wiederholt klickbarer Button ohne visuelles Feedback.
- **`ef5c69c` (01.09., achtzehnter IT-Chef-Lauf):** Sidebar-Einklappen-
  Button hatte im eingeklappten Zustand keinen erreichbaren Namen mehr —
  reiner Barrierefreiheits-Fix, kein Content-Anlass.

**Warum trotzdem kein achtes Content-Stück:** Dieselbe Prüfung wie bei
jedem bisherigen Lauf — `ZEITPLAN.md` führt 6.2 (Buchen-Button) weiterhin
als offen (Zeile 182), kein neuer Kanal/keine Landingpage live (Zeile
452), und `status.md` (Stand 31.08.) sowie dieses Dokument enthalten
keine Notiz von Ni zu einer der drei unten offenen Fragen. Alle drei
Bedingungen für ein neues, eigenständiges Stück bleiben damit unverändert
unerfüllt. Die zwei neuen Fixes werden stattdessen unten im
Tier-4-Kandidatentopf (Punkt 7) ergänzt.

**Warum sicher genug für eine Dokument-Ergänzung:** reine
Übersichts-Aktualisierung, kein Live-Vorgang — nichts gepostet, kein
Kanal angelegt, kein bestehender Abschnitt verändert oder gelöscht (nur
diese neue Sektion und eine Ergänzung im bestehenden Tier-4-Punkt).
Keine erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage:
trägt nur bereits im Repo nachprüfbare Fakten nach (Commit-Historie,
Code-Diffs, `ZEITPLAN.md`-Stand).

## Update 2026-08-31: drei weitere Ehrlichkeits-/Fehler-Fixes geprüft — Tier-4-Kandidatentopf wächst weiter, weiterhin kein achtes Content-Stück

Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`4380852`,
29.08., bereits vollständig in `main` gemerged) geprüft: 21 neue Commits.
Der größte Teil ohne Content-Relevanz — Daily-Status-Update, mehrere
Freigabe-Chef-Merges/-Logs, ein IT-Chef-Bericht (`91b3f39`) und ein
Support-Chef-Bericht (`dd6756c`, beide rein interaktiv, keine
Codeänderung) sowie zwei IT-Chef-Auto-Läufe ohne sicheren Punkt
(`756c85b`, `d83eaf2`). Der eigene interaktive Bericht vom 29.08.
(`ab38efd`/`reports/marketing-chef.md`) wurde ebenfalls gelesen: er hatte
eine "Ehrlichkeits-Log"-Formatidee vorgeschlagen (siehe unten) und vor
verfrühter Werbung für die Chat-Flugsuche gewarnt — beides bereits
bekannt, keine neue Entscheidung von Ni darin.

Drei echte Codeänderungen einzeln per `git show` geprüft:

- **`c2fff0b` (30.08., Flug-Sackgasse behoben):** `mockAdvisor.ts` ließ den
  Chatflow für Flug bisher mit `quickReplies: []` enden — anders als die
  anderen vier Transportmodi, die seit dem 28.08.-Fix "Neue Reise planen"
  als Ausweg bekommen. Flug bekommt jetzt denselben Ausweg. Direkte Folge
  eines vom Support-Chef am 29.08. gemeldeten Fundes.
- **`dc10361` (30.08., Unterkunftssuche-Fehler unterscheidbar):** ein
  fehlgeschlagener `searchStays`-Aufruf setzte `stayOffers` bisher auf
  `[]` — optisch identisch zu einer echten Null-Treffer-Suche. Neuer
  `stayError`-State (`useChat.ts`) plus eigene Fehlermeldung in
  `HotelResults.tsx`, analog zum bereits bestehenden `flightErrors`-Muster.
- **`b9d0267` (31.08., Flugsuche-Fehler unterscheidbar):** derselbe Fix
  jetzt auch für `searchFlights` — `FlightResults.tsx` hatte das
  Anzeigemuster (`flightErrors`) bereits, es wurde im Fehlerfall nur nie
  befüllt; jetzt wird es befüllt statt `flightOffers` auf `[]` zu setzen.

Alle drei sind im selben Muster wie die bisherigen Tier-4-Kandidaten:
eine bereits verifizierte, ehrlich behobene Lücke ("wir zeigen einen
echten Fehler statt eines irreführenden 'keine Treffer'-Zustands" bzw.
"wir lassen niemanden ohne nächsten Schritt hängen"), aber jede für sich
zu klein und zu technisch, um allein ein eigenständiges Content-Stück zu
tragen — passend zur bereits im Bericht vom 29.08. vorgeschlagenen
Bündelidee ("Ehrlichkeits-Log" als wiederkehrendes Vorher/Nachher-Format).

**Warum trotzdem kein achtes Content-Stück:** Dieselbe Prüfung wie bei
jedem bisherigen Lauf — `ZEITPLAN.md` führt 6.2 (Buchen-Button) weiterhin
als offen (Zeile 139), kein neuer Kanal/keine Landingpage live (Zeile
409), und `status.md`/dieses Dokument enthalten keine Notiz von Ni zu
einer der drei unten offenen Fragen. Alle drei Bedingungen für ein neues,
eigenständiges Stück bleiben damit unverändert unerfüllt. Die drei neuen
Fixes werden stattdessen unten im Tier-4-Kandidatentopf (Punkt 7)
ergänzt.

**Warum sicher genug für eine Dokument-Ergänzung:** reine
Übersichts-Aktualisierung, kein Live-Vorgang — nichts gepostet, kein
Kanal angelegt, kein bestehender Abschnitt verändert oder gelöscht (nur
diese neue Sektion und eine Ergänzung im bestehenden Tier-4-Punkt).
Keine erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage:
trägt nur bereits im Repo nachprüfbare Fakten nach (Commit-Historie,
Code-Diffs, `ZEITPLAN.md`-Stand).

## Update 2026-08-29: Ehrlichkeitsfix in `mockAdvisor.ts` geprüft — stärkster bisheriger Tier-4-Baustein, aber weiterhin kein achtes Content-Stück

Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`2f18579`,
28.08.) geprüft: acht neue Commits. Sechs davon reine Log-/Fix-Einträge
ohne Content-Relevanz — Support-Chef-Bericht (`ec26be9`), drei
Barrierefreiheits-/Erreichbarkeits-Fixes am Dashboard und an sechs
weiteren Seiten (`85e8c22`, `9d41f15`, `af07472`: Screenreader-
Unterscheidbarkeit, fehlende Nav-Einträge — reine technische Korrekturen,
keine neue Nutzer-Geschichte), ein Enter-Tasten-Fix im
Aktivität-hinzufügen-Formular (`fbbea3b`), sowie ein Freigabe-Chef-Merge
und -Log (`b7a5d95`, `51ce071`). Keiner davon beantwortet eine der drei
unten offenen Fragen — `ZEITPLAN.md` führt 6.2 weiterhin als offen, keine
Notiz von Ni.

Der achte Commit (`ffc0ba4`, IT-Chef Auto vierter Lauf 28.08.) wurde
einzeln geprüft (`git show`, Diff + `mockAdvisor.ts` gelesen): ein
echter, im Code verifizierter Ehrlichkeits-Fix. Der letzte Schritt des
Haupt-Chatflows versprach bisher für JEDEN Transportmodus "Ich suche
jetzt nach echten X-Verbindungen" — tatsächlich läuft eine echte Suche
aber nur für Flug. Zug/Bus/Fähre/Mietwagen bekommen jetzt eine ehrliche
Abschlussmeldung statt eines Versprechens, das nie eingelöst wurde.

**Warum trotzdem kein achtes Content-Stück:** Inhaltlich der bisher
stärkste Treffer für Säule 1 ("Ehrlichkeit als Feature") — passt sogar
wörtlich zur in `content-plan.md` (Woche 4, Post A) bereits skizzierten
Idee, den Zitat-Ton aus `mockAdvisor.ts` als Vorlage für die Markenstimme
zu nutzen. Trotzdem dieselbe Einstufung wie die drei vorherigen kleinen
Ehrlichkeits-Korrekturen (25./26./27.08: übersetzte Duffel-
Fehlermeldungen, sichtbarer Mikrofon-Fehler, ChecklistPanel-Beschriftung)
angewendet, aus Konsistenzgründen: es ist eine nachträglich behobene
Lücke in einer bestehenden Funktion, kein neuer, abgeschlossener
Anfang-bis-Ende-Weg wie die drei Tier-1-Stücke (EditMode, Kartenansicht,
ReiseSuche). Anders als die einzige bisherige Ausnahme (24.08.,
Reise-suchen-Stück) löst dieser Fix auch keine zuvor explizit an ein
bestehendes Stück gebundene Bedingung ein — er ist neue Information,
kein eingelöstes Versprechen an ein wartendes Stück. Er gehört damit
weiterhin in den Tier-4-Kandidatentopf, der an die unten unverändert
offene Frage 3 gebunden bleibt — hier aber als bisher deutlichstes
Beispiel vermerkt, falls Ni Frage 3 demnächst beantwortet.

Damit bleibt die Selbstbeschränkung "kein neues Content-Stück"
unverändert bestehen.

## Update 2026-08-28: neue Dashboard-Seite (7.7) geprüft — bewusst kein achtes Content-Stück daraus, ChecklistPanel-Fund behoben

Vor der Auswahl geprüft, ob sich seit dem 27.08.-Marketing-Lauf (`590d959`)
etwas an den drei offenen Fragen unten oder an den Tier-2/Tier-4-Blockern
geändert hat. `git log` seit diesem Commit zeigt neun neue Commits, davon
sieben reine Log-Einträge (drei "kein sicherer Punkt"-IT-Chef-Läufe heute,
zwei Freigabe-Chef-Merges, ein Support-Chef- und ein Marketing-Chef-Bericht
vom 27.08. — letzterer nur ein interaktiver `reports/marketing-chef.md`-
Eintrag, keine autonome Aktion) sowie zwei echte Codeänderungen: `9e71b33`
(ChecklistPanel-Fix) und `e9e9505` (`Dashboard.tsx`, 7.7). Ergebnis:
**an keiner der drei Fragen hat sich etwas geändert** — kein Kanal live,
`ZEITPLAN.md` führt 6.2 weiterhin als offen, keine Notiz von Ni zu Frage 3.

- **`9e71b33` (ChecklistPanel-Fix):** behebt genau den am 27.08. vom
  Support-Chef gemeldeten Reibungspunkt (automatische Links optisch nicht
  von Ankreuz-Buttons unterscheidbar) — per `git show` geprüft: reine
  Anwendung des bereits bestehenden `Pencil`-Musters aus `Buchung.tsx`,
  keine neue Design-Idee. Für Content weiterhin irrelevant, da die
  Checkliste laut Code (`ChecklistPanel.tsx`, `useState`) unverändert ohne
  Persistenz über Reloads hinweg bleibt (bereits mehrfach als Grund für
  Zurückhaltung genannt, zuletzt 25.08.).
- **`e9e9505` (`Dashboard.tsx`, 7.7), neue Seite `/dashboard`:** vier
  Kennzahl-Kacheln (Bevorstehende Reisen, Reiseentwürfe-Fortschritt,
  Warenkorb-Summe, Favoriten), jeweils mit Link zur vollen Seite. Im Code
  gelesen (`src/pages/Dashboard.tsx`): nutzt ausschließlich bereits
  vorhandene Demo-Daten der vier Einzelseiten, keine neu erfundenen Werte;
  Prämienpunkte bewusst nicht gezeigt (ehrlicher Hinweis auf offene
  PRD-Frage OQ-04 statt erfundener Zahl).

  **Warum daraus trotzdem kein achtes Content-Stück wird:** Die
  Warenkorb-Kachel zeigt denselben echten €-Betrag, der Tier 2
  (`content-stueck-warenkorb-echte-summen.md`) bewusst zurückhält, weil
  ein Post über echte Summen ohne Buchungsmöglichkeit eine Sackgasse
  bewirbt (6.2 weiterhin offen). Ein Dashboard-Content-Stück müsste diese
  Kachel entweder erwähnen (dann exakt derselbe Vorbehalt wie bei Tier 2)
  oder bewusst auslassen (dann ein irreführend unvollständiges Bild einer
  Seite, die die Kachel ja tatsächlich zeigt). Anders als Tier-1-Stück 3
  (`ReiseSuche.tsx`, 24.08.), das reine Navigation ohne echte Preis-/
  Summenanzeige war, lässt sich der Warenkorb-Bezug hier nicht sauber
  ausklammern. Dashboard bleibt daher als eigener Kandidat vorgemerkt,
  sobald 6.2 (Buchen-Button) existiert — dann fällt der Tier-2-Vorbehalt
  ohnehin weg und ein gemeinsames Stück (Warenkorb + Dashboard) wird
  möglich, statt zwei einzelner.

Damit bleibt die Selbstbeschränkung "kein neues Content-Stück" unverändert
bestehen — kein achtes Stück, da der einzige neue Anlass (Dashboard) direkt
an denselben bereits bekannten Blocker (6.2) gebunden ist, keine
eigenständige, sauber abgrenzbare Ausnahme wie am 24.08.

## Update 2026-08-26: geprüft, alles unverändert — inklusive zweier neuer, noch offener Support-Chef-Funde

Vor der Auswahl geprüft, ob sich seit dem 25.08.-Lauf etwas an den drei
offenen Fragen unten oder an den beiden Tier-2/Tier-4-Blockern geändert
hat. Ergebnis: nein, an keiner Stelle.

- **Die drei offenen Fragen** (Kanal-Start? 6.2 priorisiert? Tier-4-Format
  gewollt?) sind weiterhin unbeantwortet — kein neuer Commit dazu, `git
  log` zeigt seit dem 25.08.-Marketing-Lauf nur automatisierte IT-Chef-/
  Support-Chef-/Freigabe-Chef-Läufe (`e69a523`, `b429e5f`, drei reine
  Log-Einträge ohne Codeänderung, `1fcf468`, `f71f0ec`).
- **6.2 (Buchen-Button in `Warenkorb.tsx`)** laut `ZEITPLAN.md` weiterhin
  offen — Tier 2 (`content-stueck-warenkorb-echte-summen.md`) bleibt
  zurückgehalten.
- **Checkliste (`ChecklistPanel.tsx`)** hat laut Code (Zeile 20,
  `useState`) weiterhin keine Persistenz über Reloads hinweg — bleibt
  unbeworben.
- **Neuer IT-Fix seit gestern:** `e69a523` behebt, dass die automatische
  Unterkunftssuche nach Budget-Eingabe bei unbekanntem Ziel (sieben der
  acht kuratierten Ziele ausgenommen) bisher stillschweigend hängen
  blieb — jetzt folgt ein Hinweistext auf die manuelle Hotelsuche, analog
  zum bestehenden Flugsuche-Muster. Geprüft (`src/hooks/useChat.ts`,
  Diff von `e69a523`): echte Verhaltensänderung, kein reines Label. Für
  ein eigenes Content-Stück trotzdem zu klein und zu technisch, um allein
  eine Kernaussage zu tragen — passt stattdessen zum bereits im Bericht
  vom 24./25.08. skizzierten gebündelten Format ("Was wir diese Woche
  ehrlicher gemacht haben"), das laut demselben Bericht erst sinnvoll
  ist, sobald echte Kanäle live sind. Bisher kein Kanal live, daher
  weiterhin kein eigenes Stück dazu — als weiterer Kandidat für das
  gebündelte Format vorgemerkt.
- **Zwei neue, aber noch ungefixte Reibungspunkte vom Support-Chef
  (26.08., `support-chef-auto-log.md`):** fehlendes `min`-Attribut bei
  Hinflug-/Check-in-Datum (Vergangenheitsdatum wählbar) und rohe
  Preisdarstellung ohne deutsches Zahlenformat in den drei
  Ergebniskarten. Beide sind reine Fehlerberichte, noch keine
  IT-Chef-Korrektur — für Content ohnehin nicht relevant, solange nichts
  behoben ist: ein Post über "ehrliche, saubere Preisanzeige" wäre vor
  dem Fix schlicht falsch.

Damit bleibt die Selbstbeschränkung "kein neues Content-Stück" unverändert
bestehen — kein achtes Stück, keine neue inhaltliche Priorisierung nötig,
da sich am zugrunde liegenden Stand nichts geändert hat, das eine
Neubewertung rechtfertigen würde.

## Update 2026-08-25: siebter Entwurf nachgetragen, sonst unverändert

Ursprünglich am 21.08. angelegt (sechs Entwürfe). Am 24.08. kam ein
siebtes Stück dazu (`content-stueck-reise-suchen-empfohlen.md`), aber der
damalige Lauf hat diese Übersicht bewusst nicht mit angefasst ("um nicht
zwei Dateien parallel zu verändern") und einen Hinweis für den nächsten
Blick hinterlassen. Dieser Lauf holt das nach: das siebte Stück ist unten
in Tier 1 ergänzt, die drei offenen Fragen an Ni sind seit dem 21.08.
weiterhin unbeantwortet (kein neuer Commit dazu, siehe Prüfung unten) —
der Rest des Dokuments bleibt inhaltlich, wie er war. Kein achtes
Content-Stück in diesem Lauf, aus demselben Grund wie am 21./22./23.08.:
das würde den Stapel nur weiter vergrößern, ohne den eigentlichen Engpass
(Freigabe) zu lösen.

## Warum dieses Dokument statt eines achten Content-Stücks

Der Bericht vom 2026-08-20 (`reports/marketing-chef.md`) stellte fest:
sieben bis acht fertige Entwürfe liegen unangetastet, keiner ist
veröffentlicht, und der autonome Lauf hatte selbst zur Vergrößerung des
Stapels beigetragen. Der Bericht kündigte an, den eigenen autonomen
Lauf auf "kein neues Stück" umzustellen, bis geklärt ist, was tatsächlich
rausgeht. Seit diesem Bericht hat sich am Repo-Zustand nichts geändert,
das diese Einschätzung entkräften würde (siehe Prüfung unten) — also
gilt die Selbstbeschränkung heute weiter unverändert. Statt gar nichts zu
tun oder die Selbstbeschränkung zu brechen, baut dieser Lauf die
angekündigte, aber noch nicht existierende Übersicht, die die eigentliche
Entscheidung für Ni beschleunigen soll, ohne sie ihm abzunehmen.

## Vor dem Schreiben geprüft (im Code, nicht nur alte Einträge übernommen)

- `src/pages/Warenkorb.tsx`, `src/components/trip/EditMode.tsx`,
  `src/pages/Kartenansicht.tsx`: seit den jeweiligen Content-Stücken
  (17./18./12.08.) keine neuen Commits auf diesen Dateien (`git log --
  <Datei>` geprüft) — Produktstand in den Stücken unten also weiterhin
  aktuell, nicht neu verifiziert nötig.
- Flugsuche-Chat-Bug (Werbe-Stopp-Grund): weiterhin offen laut
  `ZEITPLAN.md`/`it-chef-auto-log.md`, zuletzt vom IT-Chef ausdrücklich
  als UX-Entscheidung statt Auto-Fix eingestuft — kein Grund, den
  Werbe-Stopp heute aufzuheben.
- Alle sieben Entwürfe auf explizite Behauptungen zur Chat-Flugsuche
  durchsucht (`grep -i "flug"`/`"chat"`): keines der Stücke behauptet,
  dass die KI-Flugsuche im Chat bereits durchgängig funktioniert — der
  Werbe-Stopp betrifft also keines der unten gelisteten Stücke direkt,
  ist aber als generelle Leitplanke unverändert einzuhalten (z. B. bei
  künftigen Anpassungen der Texte).
- 8.8 Profil-Seite (Reisepräferenzen) kam am 20.08. neu dazu (IT-Chef
  Auto, vierter Lauf) — noch kein Content-Stück dazu, absichtlich nicht
  heute nachgeliefert (siehe Selbstbeschränkung oben), aber unten als
  möglicher künftiger Kandidat vermerkt.
- Reise-Checkliste (`ChecklistPanel.tsx`, `/buchung`, seit 24.08.):
  weiterhin bewusst kein eigenes Content-Stück (siehe
  `reports/marketing-chef.md`, 24.08., Vorschlag 2) — die 8 manuell
  abgehakten Punkte sind laut Code (`ChecklistPanel.tsx`, Zeile 20,
  `useState`) weiterhin reiner lokaler Demo-State ohne Persistenz über
  Reloads/Wegnavigieren hinweg. Heute vom IT-Chef nur die Beschriftung
  korrigiert ("ausgewählt" statt irreführend "gebucht", siehe
  `it-chef-auto-log.md`) — das behebt die Persistenz-Lücke nicht, also
  bleibt die Zurückhaltung unverändert bestehen.
- Drei weitere kleine ehrliche IT-Korrekturen heute (25.08.): rohe
  Duffel-Fehlermeldungen jetzt übersetzt, ein bisher stiller
  Mikrofon-Fehler im KI-Chat jetzt sichtbar gemacht, s.o. — beide
  einzeln zu klein für ein eigenes Content-Stück, passend zum bereits im
  Bericht vom 24.08. skizzierten gebündelten Format ("Was wir diese
  Woche ehrlicher gemacht haben"), das aber laut demselben Bericht erst
  sinnvoll ist, "sobald die ersten Kanäle live sind" — bisher nicht der
  Fall, daher heute kein eigenes Stück dazu.

## Die sieben Entwürfe, sortiert nach Freigabe-Reihenfolge

### Tier 1 — sofort freigabefähig, kompletter Weg im Produkt
Kein technischer Vorbehalt, zeigt jeweils einen abgeschlossenen
Anfang-bis-Ende-Weg im Code.

1. **`content-stueck-aktivitaeten-bearbeiten.md`** ("Deine Reise ist
   keine Einbahnstraße", 17.08.) — `EditMode.tsx`, vom IT-Chef beim
   gezielten Bug-Hunt (20.08.) explizit als sauber/fehlerfrei bestätigt.
   Bereits im Bericht vom 20.08. als bester Startpunkt empfohlen, falls
   ein erstes Stück rausgehen soll.
2. **`content-stueck-ehrliche-kartenansicht.md`** ("Die ehrliche
   Kartenansicht", 12.08.) — `Kartenansicht.tsx`, zeigt echte
   Leerzustände statt Fake-Daten. Kein Buchungsweg nötig, um die
   Kernaussage zu tragen (Ehrlichkeit der Anzeige, nicht ein
   Buchungsschritt).
3. **`content-stueck-reise-suchen-empfohlen.md`** ("Drei Wege, eine
   Empfehlung", 24.08.) — `ReiseSuche.tsx` (`/reise-planen`), zeigt drei
   gleichwertige Einstiegswege (KI-Chat/Flugsuche/Hotelsuche) mit
   tatsächlich sichtbarem "Empfohlen"-Badge auf dem KI-Chat. Reine
   Navigation, kein Buchungsweg nötig, damit kein Warenkorb-artiger
   Vorbehalt wie bei Tier 2.

### Tier 2 — bewusst zurückhalten, bis eine Lücke geschlossen ist
4. **`content-stueck-warenkorb-echte-summen.md`** ("Echte Zahlen, keine
   Show", 18.08.) — `Warenkorb.tsx` zeigt weiterhin keinen "Jetzt
   buchen"-Button oder Checkout-Weg (im Bericht vom 20.08. bestätigt,
   heute per Commit-Historie erneut bestätigt: `ZEITPLAN.md` führt 6.2
   weiterhin als offen). Ein Post über echte Summen ohne
   Buchungsmöglichkeit bewirbt eine Sackgasse — bleibt liegen, bis 6.2
   (Buchen-Button) existiert.

### Tier 3 — Grundlagen-Dokumente, keine einzelnen Posts
5. **`content-plan.md`** (10.08.) — Redaktionsplan-Rahmen, kein
   eigenständiger Post. Freigabe-Frage hier eher: passt die
   Kanal-/Frequenz-Empfehlung noch, sobald Ni tatsächlich Kanäle
   anlegt?
6. **`content-stuecke-woche1.md`** (11.08.) — zwei generische
   Einstiegs-Posts (Vorstellung, Reise-Planungs-Frust) plus ein
   Blog-Stück. Nicht an ein einzelnes, frisch fertiges Feature
   gebunden wie Tier 1/2, daher zeitlich weniger dringend, aber
   inhaltlich unverändert einsetzbar als Kanal-Eröffnung.

### Tier 4 — wiederkehrendes Format, eigene Entscheidung nötig
7. **`content-format-was-wird-gespeichert.md`** (19.08.) — Definition
   eines monatlichen Formats plus erste Ausgabe (August). Freigabe-Frage
   hier nicht nur "posten ja/nein", sondern ob das Format als
   wiederkehrende Rubrik überhaupt gewollt ist, bevor eine zweite Ausgabe
   sinnvoll wäre. Kandidaten-Bausteine für eine zweite Ausgabe sammeln
   sich bereits: übersetzte Duffel-Fehlermeldungen und sichtbarer
   Mikrofon-Fehler (25.08.), ChecklistPanel-Beschriftung (27.08.), der
   Zug/Bus/Fähre/Mietwagen-Ehrlichkeitsfix in `mockAdvisor.ts` (29.08.),
   sowie seit 30./31.08. drei weitere: die behobene Flug-Sackgasse ohne
   Ausweg, und die jetzt unterscheidbaren echten Suchfehler bei
   Unterkunfts- und Flugsuche statt eines irreführenden "keine
   Treffer"-Zustands (siehe Update 2026-08-31 oben), sowie seit
   31.08./01.09. zwei weitere: die jetzt tatsächlich sichtbare
   Flug-Fehlermeldung (der 31.08.-Fix hatte den Zustand nur gesetzt, nicht
   angezeigt) und die Hotelsuche, die eine zweite Suche nicht mehr mit
   veralteten Ergebnissen der ersten verwechselbar macht (siehe Update
   2026-09-01 oben), sowie seit 01./02.09. vier weitere: die
   Flug-Fehlermeldung bleibt nicht mehr fälschlich stehen, wenn die
   Nutzerin nach einem Fehler normal weiterschreibt statt neu zu starten;
   ein Neustart über "Neue Reise planen" zeigt nach einer noch laufenden
   Suche nicht mehr Ergebnisse/Fehler der eigentlich verworfenen
   vorherigen Planung; und zwei baugleiche Wortgrenzen-Bugs bei der
   Zielname-Erkennung (`findKnownDestination`, `mockConcierge.ts`), durch
   die kurze Namen wie "Rom" mitten in unbeteiligten Wörtern
   ("romantisch") matchten und so stille falsche Suchen bzw. erfundene
   Fakten für ein nie genanntes Ziel ausgelöst hätten (siehe Update
   2026-09-02 oben), sowie seit 02./03.09. vier weitere: der
   Urlaubsmodus-Concierge gibt für ein echtes, aber nicht kuratiertes
   Reiseziel jetzt eine fachlich korrekte statt einer irreführenden
   "kein Ziel geplant"-Antwort; der Avatar wirkt bei ehrlichen
   Ausweich-Antworten nicht mehr fälschlich fröhlich; derselbe
   Wortgrenzen-Bug wie bei der Zielname-Erkennung steckte unabhängig auch
   in der Transportmittel-Erkennung ("Business Class" wurde fälschlich als
   Bus erkannt); und rohe Duffel-Fehlertexte bei einem fehlgeschlagenen
   `fetch()` selbst oder kaputter JSON-Antwort sind jetzt ebenfalls durch
   die ehrliche deutsche Fallback-Meldung ersetzt (siehe Update 2026-09-03
   oben), sowie seit 03./04.09. zwei weitere: ein echter Suchfehler bei
   Unterkunft/Flug im Chat sah zuvor wie ein ehrliches Null-Treffer-
   Ergebnis bzw. eine Sackgasse ohne nächsten Schritt aus, jetzt wird die
   echte Fehlermeldung angezeigt; und kaputte Alt-Trip-Daten im
   localStorage konnten die Buchungs-/Chat-/Kartenseite bisher komplett
   leer lassen (`TypeError` ohne ErrorBoundary), jetzt fängt eine
   Array-Prüfung das ab (siehe Update 2026-09-04 oben). Der eigene Bericht
   vom 29.08. (`reports/marketing-chef.md`) hat dafür bereits einen
   konkreten Formatnamen vorgeschlagen: "Ehrlichkeits-Log", ein Satz
   Vorher/Nachher pro Fund — bleibt an Frage 3 unten gebunden.

### Tier 5 — anderer Kanal als Social, eigene Freigabe-Frage

8. **`mini-changelog-konzept.md`** (05.09.) — Konzept + fertige erste
   Ausgabe für einen öffentlichen Mini-Changelog *im Produkt* (Footer-
   Seite), nicht für Social Media gedacht. Bündelt den gesamten
   Tier-4-Kandidatentopf (Punkt 7 oben) in fünf kuratierten
   Themenblöcken. Berührt bewusst keine der drei Fragen unten — hat
   dafür eine eigene, vierte Frage (siehe unten).

## Für Ni: die eigentliche Entscheidung

Keine dieser Prioritäten ersetzt Nis Freigabe — das kann und soll der
autonome Lauf nicht vorwegnehmen. Konkret zu entscheiden bleibt
(die ersten drei unverändert seit 21.08., die vierte neu seit 05.09.):
- Sollen LinkedIn/Instagram als Kanäle jetzt angelegt werden (die drei
  Tier-1-Stücke sind dafür bereit), oder wartet das noch auf die
  Landingpage/Warteliste (Sprint 2, weiterhin offen)?
- Bleibt Warenkorb-Content zurückgehalten, bis 6.2 existiert — oder soll
  6.2 (Buchen-Button) priorisiert werden, damit der bereits geschriebene
  Text nutzbar wird?
- Ist das wiederkehrende Format (Tier 4, Social Media) grundsätzlich
  gewollt?
- **Neu:** Soll der Mini-Changelog (Tier 5, Seite im Produkt statt
  Social) gebaut werden? Unabhängig von den drei Fragen oben zu
  beantworten — braucht weder Kanal noch 6.2 noch eine Social-Format-
  Entscheidung, nur IT-Chefs Umsetzung der Footer-Seite.

## Nächster autonomer Lauf
Die Selbstbeschränkung "kein neues *Social*-Content-Stück" aus dem
Bericht vom 20.08. gilt für die ersten drei Fragen unverändert weiter
(die einzige bisherige Ausnahme war Tier-1-Stück 3, siehe
`marketing-chef-auto-log.md`, 24.08.). Der Mini-Changelog (05.09.) ist
kein Bruch dieser Regel, sondern ein bewusst anderer Kanal, der genau
deshalb heute umgesetzt wurde. Der nächste Lauf sollte zuerst prüfen,
ob Ni zwischenzeitlich eine der vier Fragen beantwortet hat (z. B. neue
Kanal-Links, ein Commit zu 6.2, eine Notiz in diesem Dokument, oder ein
Commit von IT-Chef zur Mini-Changelog-Seite) oder ob die Checkliste
inzwischen echte Persistenz hat (dann wird sie laut Bericht vom 24.08.
selbst zum nächsten Content-Kandidaten), bevor er wieder einen neuen
Social-Text schreibt. Falls weiterhin keine der vier Fragen beantwortet
ist: eine zweite Mini-Changelog-Ausgabe ist erst sinnvoll, sobald sich
seit dem 05.09. wieder genug neue, verifizierte Tier-4-Kandidaten
angesammelt haben (nicht nach jedem einzelnen neuen Fix).
