# Marketing-Chef Auto-Log

Log der täglichen autonomen Cloud-Läufe auf Branch `marketing-chef/auto`.
Jeder Eintrag: Datum, was entworfen wurde, warum dieser Punkt, ggf. warum
nichts gemacht wurde.

## 2026-09-01

**Ausgewählter Punkt:** Kein neues Content-Stück. Stattdessen:
`marketing/freigabe-uebersicht.md` (zuletzt 31.08.) um eine neue Prüfung
vom 01.09. ergänzt — ordnet zwei seit dem letzten Marketing-Lauf neu
hinzugekommene Ehrlichkeits-Fixes (Flug-Fehlermeldung jetzt tatsächlich
sichtbar statt nur intern gesetzt; Hotelsuche zeigt bei einer zweiten
Suche keine veralteten Ergebnisse der ersten mehr) in den bestehenden
Tier-4-Kandidatentopf ein. Zwei weitere geprüfte Fixes (HotelCard-
Auswahlanzeige, Sidebar-Barrierefreiheit) bewusst nicht aufgenommen, da
reine UI-Paritäts- bzw. A11y-Korrekturen ohne Ehrlichkeits-/
Irreführungs-Erzählung.

**Warum dieser Punkt statt eines achten Content-Stücks oder gar nichts:**
Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`b78378a`,
31.08.) geprüft: 12 neue Commits. Der Großteil ohne Content-Relevanz —
ein Daily-Status-Update, drei Freigabe-Chef-Merges/-Logs, ein
Support-Chef-Bericht (`c4e16a5`) sowie -Auto-Log (`f96ddbc`, beide zur
selben Fehleranzeige-Situation wie unten, keine eigene neue Information)
und ein IT-Chef-Auto-Lauf ohne sicheren Punkt (`044b289`). `ZEITPLAN.md`,
`status.md` und `marketing/freigabe-uebersicht.md` bestätigen: alle drei
offenen Fragen an Ni (Kanal-Start? 6.2 priorisiert? Tier-4-Format
gewollt?) weiterhin unbeantwortet seit 21.08. — 6.2 weiterhin offen, kein
neuer Kanal/keine Landingpage live, keine Notiz von Ni in `status.md`
(Stand 31.08.) oder sonstwo im Repo.

Vier echte Codeänderungen wurden einzeln geprüft (`git show`, Diffs
gelesen), bevor über Content entschieden wurde:
- `7b65423` (31.08., vierzehnter IT-Chef-Lauf): direkte Fortsetzung des
  bereits am 31.08. dokumentierten Fixes `b9d0267` — der dortige
  `flightErrors`-Zustand wurde zwar korrekt gesetzt, aber `KiChat.tsx`
  prüfte beim Rendern von `<FlightResults>` diesen Zustand nie, sodass
  die Nutzerin nach einem echten Suchfehler buchstäblich nichts mehr sah.
  Zusätzlich bekommen die beiden "Bearbeiten"-Fehlerpfade jetzt ebenfalls
  `['Neue Reise planen']` statt leerer `quickReplies`.
- `0042f68` (01.09., sechzehnter IT-Chef-Lauf): `Hotelsuche.tsx` setzte
  `offers` vor einer neuen Suche bisher nicht auf `null` zurück — eine
  zweite Suche zeigte bis zur Antwort weiterhin die alten Hotelkarten der
  ersten, bei einer echten Null-Treffer-zweiten-Suche blieben sogar
  dauerhaft veraltete Karten stehen.
- `ce59905` (01.09., siebzehnter IT-Chef-Lauf): `HotelCard` bekam nie mit,
  ob ihr Angebot ausgewählt ist (Paritätslücke zu `FlightCard`) — reine
  UI-Korrektur, keine irreführende Aussage gegenüber der Nutzerin.
- `ef5c69c` (01.09., achtzehnter IT-Chef-Lauf): Sidebar-Einklappen-Button
  ohne erreichbaren Namen im eingeklappten Zustand — reiner
  Barrierefreiheits-Fix.

Die ersten beiden passen inhaltlich zum bereits skizzierten
"Ehrlichkeits-Log"-Format (echte Fehleranzeige bzw. keine veralteten
Ergebnisse als aktuelle ausgeben) und wandern in den Tier-4-
Kandidatentopf, gebunden an die weiterhin offene Frage 3 — dieselbe
Einstufung wie alle bisherigen kleinen Ehrlichkeits-Korrekturen. Die
letzten beiden sind reine UI-Paritäts-/A11y-Fixes ohne diese Erzählung,
gleiche Einstufung wie z. B. die A11y-Fixes vom 29.08. oder der
ChecklistPanel-Icon-Fix vom 28.08. (beide damals ebenfalls "ohne
Content-Relevanz").

**Warum sicher genug:** Ergebnis ist eine reine Dokument-Ergänzung
(Freigabe-Übersicht für Ni), kein Live-Vorgang — nichts wird gepostet,
kein Kanal angelegt, kein bestehender Text verändert oder gelöscht (nur
eine neue Sektion sowie eine Ergänzung im bestehenden Tier-4-Punkt
hinzugefügt, ältere Abschnitte unverändert belassen). Keine erfundenen
Kennzahlen. Keine offene Positionierungs-Grundsatzfrage: die Ergänzung
entscheidet nichts neu, sondern trägt nur bereits im Repo nachprüfbare
Fakten nach (Commit-Historie, Code-Diffs, `ZEITPLAN.md`- und
`reports/marketing-chef.md`-Stand).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein neuntes, eigenständiges Content-Stück zu einem der beiden
  Ehrlichkeits-Fixes — siehe Begründung oben, gleiche Einstufung wie alle
  bisherigen kleinen Ehrlichkeits-Korrekturen, aus Konsistenzgründen in
  den Tier-4-Topf statt ein eigenes Stück.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  gleiche Blocker wie in allen bisherigen Läufen (Live-Vorgang bzw.
  ungelöste Freigabe-Fragen).

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand `b78378a`, 31.08.) war laut `git merge-base
--is-ancestor` bereits vollständig in `main` gemerged. Branch daher per
`git merge --ff-only origin/main` auf den aktuellen `origin/main`-Stand
(`5864c0d`, inkl. IT-/Support-/Freigabe-Chef-Läufen bis 01.09. früh)
gebracht — reiner Fast-Forward, keine eigenen Commits gingen dabei
verloren.

**Geprüft:** Kein Produkt-Code geändert, nur eine bestehende
Markdown-Datei (`marketing/freigabe-uebersicht.md`) ergänzt und dieser
Log-Eintrag — kein Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-31

**Ausgewählter Punkt:** Kein neues Content-Stück. Stattdessen:
`marketing/freigabe-uebersicht.md` (zuletzt 29.08.) um eine neue Prüfung
vom 31.08. ergänzt — ordnet drei seit dem letzten Marketing-Lauf neu
hinzugekommene Ehrlichkeits-/Fehler-Fixes (Flug-Sackgasse ohne Ausweg
behoben, Unterkunfts- und Flugsuche-Fehler jetzt von echter
Null-Treffer-Suche unterscheidbar) in den bestehenden Tier-4-
Kandidatentopf ein.

**Warum dieser Punkt statt eines achten Content-Stücks oder gar nichts:**
Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`4380852`,
29.08.) geprüft: 21 neue Commits. Der Großteil ohne Content-Relevanz —
ein Daily-Status-Update, mehrere Freigabe-Chef-Merges/-Logs, ein
IT-Chef-Bericht (`91b3f39`) und ein Support-Chef-Bericht (`dd6756c`,
beide rein interaktiv), sowie zwei IT-Chef-Auto-Läufe ohne sicheren
Punkt (`756c85b`, `d83eaf2`). Der eigene interaktive Bericht vom 29.08.
(`ab38efd`) wurde gelesen: schlägt ein "Ehrlichkeits-Log"-Format vor
(Vorher/Nachher pro Fund) und warnt vor verfrühter Werbung für die
Chat-Flugsuche — beides bereits bekannt, keine neue Entscheidung von Ni
darin. `ZEITPLAN.md` und `marketing/freigabe-uebersicht.md` bestätigen:
alle drei offenen Fragen an Ni (Kanal-Start? 6.2 priorisiert?
Tier-4-Format gewollt?) weiterhin unbeantwortet seit 21.08. — 6.2
(`ZEITPLAN.md` Zeile 139) weiterhin offen, kein neuer Kanal/keine
Landingpage live (Zeile 409), keine Notiz von Ni in `status.md` oder
sonstwo im Repo.

Drei echte Codeänderungen wurden einzeln geprüft (`git show`, Diffs
gelesen), bevor über Content entschieden wurde:
- `c2fff0b` (30.08.): `mockAdvisor.ts` ließ den Flug-Chatflow bisher mit
  `quickReplies: []` enden, während die anderen vier Transportmodi seit
  dem 28.08.-Fix "Neue Reise planen" als Ausweg bekommen — jetzt auch
  Flug. Direkte Folge eines Support-Chef-Fundes vom 29.08.
- `dc10361` (30.08.): ein fehlgeschlagener `searchStays`-Aufruf setzte
  `stayOffers` bisher auf `[]`, optisch identisch zu einer echten
  Null-Treffer-Suche. Neuer `stayError`-State plus eigene Fehlermeldung
  in `HotelResults.tsx`, analog zum bestehenden `flightErrors`-Muster.
- `b9d0267` (31.08.): derselbe Fix jetzt auch für die Flugsuche —
  `FlightResults.tsx` hatte das Anzeigemuster bereits, es wurde im
  Fehlerfall nur nie befüllt.

Alle drei passen inhaltlich zum bereits skizzierten "Ehrlichkeits-Log"-
Format (ehrlicher Fehler statt irreführendem "keine Treffer"- bzw.
Sackgassen-Zustand), sind aber jede für sich zu klein und zu technisch
für ein eigenständiges Content-Stück — gleiche Einstufung wie alle
bisherigen kleinen Ehrlichkeits-Korrekturen seit 25.08. Sie bleiben daher
im Tier-4-Kandidatentopf, gebunden an die weiterhin offene Frage 3
(Tier-4-Format grundsätzlich gewollt?), statt ein eigenes achtes Stück zu
werden — dieselbe Konsistenzbegründung wie am 29.08. beim
Zug/Bus/Fähre-Fix.

**Warum sicher genug:** Ergebnis ist eine reine Dokument-Ergänzung
(Freigabe-Übersicht für Ni), kein Live-Vorgang — nichts wird gepostet,
kein Kanal angelegt, kein bestehender Text verändert oder gelöscht (nur
eine neue Sektion sowie eine Ergänzung im bestehenden Tier-4-Punkt
hinzugefügt, ältere Abschnitte unverändert belassen). Keine erfundenen
Kennzahlen. Keine offene Positionierungs-Grundsatzfrage: die Ergänzung
entscheidet nichts neu, sondern trägt nur bereits im Repo nachprüfbare
Fakten nach (Commit-Historie, Code-Diffs, `ZEITPLAN.md`- und
`reports/marketing-chef.md`-Stand).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein achtes, eigenständiges Content-Stück zu einem der drei Fixes — siehe
  Begründung oben, gleiche Einstufung wie alle bisherigen kleinen
  Ehrlichkeits-Korrekturen, aus Konsistenzgründen in den Tier-4-Topf statt
  ein eigenes Stück.
- Weitere `MARKENDESIGN.md`-Ergänzung zu den drei Fixes — geprüft: alle
  drei wenden nur das bereits bestehende Fehlermeldungs-Muster
  (`flightErrors`/`FlightResults.tsx`) bzw. das bestehende
  Quick-Reply-Muster an, kein neues Prinzip nötig.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  gleiche Blocker wie in allen bisherigen Läufen (Live-Vorgang bzw.
  ungelöste Freigabe-Fragen).

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand `4380852`, 29.08.) war laut `git merge-base
--is-ancestor` bereits vollständig in `main` gemerged. Branch daher neu
von aktuellem `origin/main` (`1eda933`, inkl. der drei geprüften Fixes
sowie IT-/Support-/Freigabe-Chef-Läufen bis 31.08. früh) angelegt,
gleiches Vorgehen wie bei allen bisherigen Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine bestehende
Markdown-Datei (`marketing/freigabe-uebersicht.md`) ergänzt und dieser
Log-Eintrag — kein Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-29

**Ausgewählter Punkt:** Kein neues Content-Stück. Stattdessen:
`marketing/freigabe-uebersicht.md` (zuletzt 28.08.) um eine neue Prüfung
vom 29.08. ergänzt — ordnet den seit dem letzten Marketing-Lauf
hinzugekommenen Ehrlichkeitsfix in `src/lib/ai/mockAdvisor.ts`
(Zug/Bus/Fähre/Mietwagen bekommen jetzt eine ehrliche Abschlussmeldung
statt eines nie eingelösten "Ich suche jetzt nach echten
X-Verbindungen"-Versprechens) sowie mehrere technische a11y-/
Erreichbarkeits-Fixes in den bestehenden Rahmen ein.

**Warum dieser Punkt statt eines achten Content-Stücks oder gar nichts:**
Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`2f18579`,
28.08.) geprüft: acht neue Commits. Sechs davon ohne Content-Relevanz —
ein Support-Chef-Bericht (`ec26be9`), drei Barrierefreiheits-/
Erreichbarkeits-Fixes (`85e8c22` Dashboard-Links per Screenreader
unterscheidbar + Entwürfe-Durchschnitt markiert, `9d41f15` Dashboard über
Navigation statt nur direkter URL erreichbar, `af07472` dasselbe für
Kalender/Karte/Aktivitäten/Angebote/Favoriten/Preisalarme), ein
Enter-Tasten-Fix im Aktivität-hinzufügen-Formular (`fbbea3b`), sowie ein
Freigabe-Chef-Merge und -Log (`b7a5d95`, `51ce071`). `ZEITPLAN.md` und
`marketing/freigabe-uebersicht.md` bestätigen: alle drei offenen Fragen
an Ni (Kanal-Start? 6.2 priorisiert? Tier-4-Format gewollt?) weiterhin
unbeantwortet seit 21.08.

Der achte Commit (`ffc0ba4`, IT-Chef Auto vierter Lauf 28.08.) wurde
einzeln geprüft (`git show`, Diff sowie `src/lib/ai/mockAdvisor.ts`
gelesen): ein echter, im Code verifizierter Ehrlichkeits-Fix. Der letzte
Schritt des Haupt-Chatflows versprach bisher für jeden Transportmodus
"Ich suche jetzt nach echten X-Verbindungen" — tatsächlich läuft eine
echte Suche aber nur für Flug (über den separaten Bearbeiten-Pfad). Für
Zug/Bus/Fähre/Mietwagen blieb das Versprechen bisher immer unerfüllt
hängen; jetzt bekommen diese vier Modi eine ehrliche Abschlussmeldung.

Inhaltlich der bisher stärkste Treffer für Säule 1 ("Ehrlichkeit als
Feature") — passt sogar wörtlich zur in `marketing/content-plan.md`
(Woche 4, Post A) bereits skizzierten Idee, den Zitat-Ton aus
`mockAdvisor.ts` als Vorlage für die Markenstimme zu nutzen. Trotzdem
bewusst dieselbe Einstufung wie die drei vorherigen kleinen
Ehrlichkeits-Korrekturen (25./26./27.08.) angewendet, aus
Konsistenzgründen: es ist eine nachträglich behobene Lücke in einer
bestehenden Funktion, kein neuer, abgeschlossener Anfang-bis-Ende-Weg wie
die drei Tier-1-Stücke. Anders als die einzige bisherige Ausnahme
(24.08., Reise-suchen-Stück) löst dieser Fix auch keine zuvor explizit
an ein bestehendes, wartendes Stück gebundene Bedingung ein — er ist
neue Information, kein eingelöstes Versprechen. Er bleibt daher im
Tier-4-Kandidatentopf, gebunden an die weiterhin offene Frage 3, statt
ein eigenes achtes Stück zu werden. Ein zweites achtes Content-Stück zum
Thema wäre damit eine Inkonsistenz gegenüber der eigenen Begründung vom
25./26./27.08. gewesen, ohne dass sich an der zugrunde liegenden
Freigabe-Blockade etwas geändert hätte.

Die drei a11y-/Erreichbarkeits-Fixes und der Enter-Tasten-Fix wurden
ebenfalls geprüft: reine technische Korrekturen (Screenreader-Text,
Navigations-Links, Tastatur-Bedienung), keine neue Nutzer-Geschichte und
kein neues Design-Prinzip, das `MARKENDESIGN.md` fehlen würde — passendes
bestehendes Muster (Fehlermeldungen/Barrierefreiheit) deckt das bereits
ab.

**Warum sicher genug:** Ergebnis ist eine reine Dokument-Ergänzung
(Freigabe-Übersicht für Ni), kein Live-Vorgang — nichts wird gepostet,
kein Kanal angelegt, kein bestehender Text verändert oder gelöscht (nur
neue Sektionen hinzugefügt, ältere unverändert belassen). Keine
erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage: die
Ergänzung entscheidet nichts neu, sondern trägt nur bereits im Repo
nachprüfbare Fakten nach (Commit-Historie, Code-Diff, `ZEITPLAN.md`- und
`content-plan.md`-Stand).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein achtes, eigenständiges Content-Stück zum mockAdvisor-Ehrlichkeitsfix
  — siehe Begründung oben, gleiche Einstufung wie die drei vorherigen
  kleinen Ehrlichkeits-Korrekturen, aus Konsistenzgründen in den
  Tier-4-Topf statt ein eigenes Stück.
- Weitere `MARKENDESIGN.md`-Ergänzung zu den a11y-/Erreichbarkeits-Fixes
  — geprüft, bestehende Abschnitte decken die angewendeten Muster bereits
  ab, kein neues Prinzip nötig.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  gleiche Blocker wie in allen bisherigen Läufen (Live-Vorgang bzw.
  ungelöste Freigabe-Fragen).

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand `2f18579`, 28.08.) war laut `git merge-base
--is-ancestor` bereits vollständig in `main` gemerged (per
Freigabe-Chef-Log vom 29.08. früh bestätigt: it-chef/auto geprüft und
gemergt, `51ce071`). Branch daher neu von aktuellem `origin/main`
(`51ce071`, inkl. mockAdvisor-Ehrlichkeitsfix und den a11y-/
Erreichbarkeits-Fixes) angelegt, gleiches Vorgehen wie bei allen
bisherigen Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine bestehende
Markdown-Datei (`marketing/freigabe-uebersicht.md`) ergänzt und dieser
Log-Eintrag — kein Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-28

**Ausgewählter Punkt:** Kein neues Content-Stück. Stattdessen:
`marketing/freigabe-uebersicht.md` (zuletzt 26.08.) um eine neue Prüfung
vom 28.08. ergänzt — ordnet die seit dem letzten Marketing-Lauf neu
hinzugekommene `Dashboard.tsx`-Seite (7.7) und den behobenen
ChecklistPanel-Reibungspunkt in den bestehenden Freigabe-Rahmen ein.

**Warum dieser Punkt statt eines achten Content-Stücks oder gar nichts:**
Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`590d959`,
27.08., 04:07 UTC) geprüft: neun neue Commits. Sieben davon reine
Log-/Bericht-Einträge ohne Codeänderung (drei IT-Chef-Läufe heute mit
"kein sicherer Punkt", zwei Freigabe-Chef-Merges, ein Support-Chef- und
ein Marketing-Chef-Bericht vom 27.08. — letzterer der interaktive
`reports/marketing-chef.md`-Eintrag, keine autonome Aktion dieses
Skripts). Zwei echte Codeänderungen: `9e71b33` (ChecklistPanel: Pencil-
Icon + `sr-only`-Zusatz für die automatischen Links, behebt den vom
Support-Chef am 27.08. gemeldeten Fund) und `e9e9505` (`Dashboard.tsx`,
Aufgabe 7.7, neue Seite `/dashboard`). `ZEITPLAN.md` und
`marketing/freigabe-uebersicht.md` bestätigen: alle drei offenen Fragen
an Ni (Kanal-Start? 6.2 priorisiert? Tier-4-Format gewollt?) weiterhin
unbeantwortet seit 21.08.

Beide Codeänderungen einzeln geprüft, bevor über Content entschieden
wurde:
- `9e71b33` (`git show`, Diff gelesen): reine Anwendung des bereits
  bestehenden `Pencil`-Bearbeiten-Musters aus `Buchung.tsx` auf
  `ChecklistPanel.tsx`, keine neue Design-Idee — daher keine
  `MARKENDESIGN.md`-Ergänzung nötig (anders als beim Preisalarme-
  Icon-Fund am 26./27.08., der ein neues Prinzip brauchte). Für Content
  weiterhin irrelevant, da die Checkliste laut Code unverändert ohne
  Persistenz über Reloads bleibt.
- `e9e9505` (`src/pages/Dashboard.tsx` vollständig gelesen): vier
  Kennzahl-Kacheln (Bevorstehende Reisen, Reiseentwürfe-Fortschritt,
  Warenkorb-Summe, Favoriten) auf bereits vorhandenen Demo-Daten, keine
  neu erfundenen Werte, Prämienpunkte ehrlich als "noch offen" markiert
  statt einer erfundenen Zahl (OQ-04). Grundsätzlich ein möglicher
  Content-Kandidat nach demselben Muster wie Tier-1-Stück 3
  (`content-stueck-reise-suchen-empfohlen.md`, 24.08.: neues, im Code
  verifiziertes Feature löst die Selbstbeschränkung punktuell ein). Hier
  aber bewusst dagegen entschieden: die Warenkorb-Kachel zeigt denselben
  echten €-Betrag, den Tier 2 (`content-stueck-warenkorb-echte-summen.md`)
  ausdrücklich zurückhält, weil ein Post über echte Summen ohne
  Buchungsmöglichkeit (6.2 weiterhin offen) eine Sackgasse bewirbt. Ein
  Dashboard-Stück müsste die Kachel entweder erwähnen (dann derselbe
  Vorbehalt wie Tier 2) oder auslassen (dann ein unvollständiges Bild
  einer Seite, die sie tatsächlich zeigt) — anders als bei Stück 3, das
  ohne jede Preis-/Summenanzeige auskam und sich daher sauber vom
  Tier-2-Vorbehalt trennen ließ. Kein neuer, sauber abgrenzbarer Anlass
  also, sondern derselbe bekannte Blocker (6.2) in neuer Verpackung.

**Warum sicher genug:** Ergebnis ist eine reine Dokument-Ergänzung
(Freigabe-Übersicht für Ni), kein Live-Vorgang — nichts wird gepostet,
kein Kanal angelegt, kein bestehender Text verändert oder gelöscht (nur
eine neue Sektion hinzugefügt, ältere Sektionen unverändert belassen).
Keine erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage:
die Ergänzung entscheidet nichts neu (insbesondere nicht, was tatsächlich
veröffentlicht wird), sondern trägt nur bereits im Repo nachprüfbare
Fakten nach (Commit-Historie, Code-Diffs, `ZEITPLAN.md`-Stand).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein achtes Content-Stück zu `Dashboard.tsx` — siehe Begründung oben,
  Warenkorb-Kachel bindet es an denselben ungelösten Tier-2-Blocker (6.2).
- Ein Content-Stück im Bündel-/Tier-4-Format ("Was wir diese Woche
  ehrlicher gemacht haben") zum ChecklistPanel-Fix — laut eigenem Bericht
  vom 26./27.08. ausdrücklich an die noch offene Tier-4-Grundsatzfrage
  (Frage 3) gebunden, die weiterhin unbeantwortet ist.
- Weitere `MARKENDESIGN.md`-Ergänzung zum ChecklistPanel-Fix — geprüft,
  der Fix wendet nur das bereits bestehende `Pencil`-Bearbeiten-Muster an,
  kein neues Prinzip nötig.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  gleiche Blocker wie in allen bisherigen Läufen (Live-Vorgang bzw.
  ungelöste Freigabe-Fragen).

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand `590d959`, 27.08.) war laut `git merge-base --is-ancestor`
bereits vollständig in `main` gemerged (per Freigabe-Chef-Log vom 28.08.
früh bestätigt: "0 neue Commits gegenüber main"). Branch daher neu von
aktuellem `origin/main` (`7b48746`, inkl. Dashboard 7.7 und
ChecklistPanel-Fix) angelegt, gleiches Vorgehen wie bei allen bisherigen
Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine bestehende
Markdown-Datei (`marketing/freigabe-uebersicht.md`) ergänzt und dieser
Log-Eintrag — kein Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-27

**Ausgewählter Punkt:** Kein neues Content-Stück. Stattdessen: konkrete
neue Design-Vorgabe in `MARKENDESIGN.md` ergänzt — Abschnitt "Icons für
destruktive Aktionen", abgeleitet aus dem am 26.08. von IT-Chef
gefixten `Preisalarme.tsx`-Icon (`BellOff` → `Trash2` für den
Entfernen-Button, ursprünglich vom Support-Chef gemeldet, im eigenen
Bericht vom 26.08. als künftiger Content-Kandidat vorgemerkt).

**Warum dieser Punkt statt eines neuen Content-Stücks oder gar nichts:**
Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`93bb408`,
26.08.) geprüft: acht neue Commits, davon fünf reine IT-Chef-/
Freigabe-Chef-Log-Einträge ohne Codeänderung ("kein sicherer Punkt" x3
am 27.08., zwei automatisierte Merges) sowie ein echter IT-Fix
(`20eb54d`: Mikrofon-Fehleranzeige im KI-Chat + Preisalarme-Icon
behoben) und ein zweiter (`fe52024`: Checklistenpunkte jetzt mit
KI-Chat verlinkt, 6.10). `ZEITPLAN.md` und `marketing/freigabe-uebersicht.md`
bestätigt: alle drei offenen Fragen an Ni (Kanal-Start? 6.2 priorisiert?
Tier-4-Format gewollt?) weiterhin unbeantwortet seit 21.08. — die
Selbstbeschränkung "kein neues Content-Stück" aus dem Bericht vom
20.08. gilt damit unverändert weiter, ein neuntes Stück hätte den dort
kritisierten Entwurfsstapel nur vergrößert.

Der Preisalarme-Icon-Fix wurde einzeln geprüft (`git show 20eb54d --
src/pages/Preisalarme.tsx`): `BellOff` (Glocke aus) wurde für einen
unwiderruflichen Löschvorgang verwendet, jetzt `Trash2` — genau der
Fall, den der eigene Bericht vom 26.08. als "Baustein fürs noch
unentschiedene Tier-4-Format, nicht heute schon ein eigener Post"
vorgemerkt hatte. Da Frage 3 (Tier-4-Format grundsätzlich gewollt?)
weiterhin offen ist, bleibt auch das dabei — kein eigener Post, keine
neue Tier-4-Ausgabe. Statt den Fund liegen zu lassen, aber genutzt: die
Lücke, die den Bug erst ermöglicht hat (kein Prinzip in
`MARKENDESIGN.md` dazu, dass Icons bei destruktiven Aktionen nicht
mildernd wirken dürfen), tatsächlich geschlossen — das ist die
Zusammenarbeit mit IT-Chef über `MARKENDESIGN.md`, die der Skill
ausdrücklich vorsieht, und verhindert denselben Fehler künftig bei
Favoriten/Angebote/Aktivitäten/Warenkorb. Vor dem Schreiben geprüft, ob
dort schon dasselbe Problem besteht (`grep` auf die vier Seiten): alle
vier nutzen bereits ehrliche Icons (`X` bzw. gefüllte `Heart` als
Favoriten-Toggle) — kein akuter zweiter Fall, die neue Vorgabe ist
vorbeugend für künftige Entfernen-Buttons gedacht.

**Warum sicher genug:** Ergebnis ist eine reine Dokument-Ergänzung
(Design-Vorgabe für IT-Chef), kein Live-Vorgang — nichts wird gepostet,
kein Kanal angelegt, kein bestehender Produkt-Code geändert. Keine
erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage: die
Vorgabe entscheidet nichts, was eigentlich Ni entscheiden müsste (sie
leitet nur ein bereits im Code sichtbares, konkretes Prinzip ab, analog
zu den bestehenden Abschnitten "Fehlermeldungen (allgemein)" und "Leere
Zustände").

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein neuntes Content-Stück — siehe Begründung oben, Selbstbeschränkung
  gilt unverändert, keine der drei Fragen wurde beantwortet.
- Eigener Post oder erste Tier-4-Ausgabe zum Preisalarme-Icon-Fix — laut
  eigenem Bericht vom 26.08. ausdrücklich an die noch offene
  Tier-4-Grundsatzfrage gebunden, nicht heute schon fällig.
- `marketing/freigabe-uebersicht.md` erneut nur mit "nichts geändert"
  nachführen (wie 25./26.08.) — diesmal bewusst stattdessen die konkrete
  `MARKENDESIGN.md`-Ergänzung gewählt, da sie tatsächlich etwas Neues für
  IT-Chef beiträgt statt nur denselben Status ein drittes Mal zu
  wiederholen. Freigabe-Übersicht bleibt inhaltlich beim Stand vom
  26.08. — dort weiterhin korrekt, da sich an den drei Fragen nichts
  geändert hat.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  gleiche Blocker wie in allen bisherigen Läufen (Live-Vorgang bzw.
  ungelöste Freigabe-Fragen).

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand `93bb408`, 26.08.) war bereits vollständig in `main`
gemerged (`git merge-base --is-ancestor` bestätigt). Branch daher neu
von aktuellem `origin/main` (`4c17900`, inkl. IT-Chef-Läufen bis
27.08. früh) angelegt, gleiches Vorgehen wie bei allen bisherigen
Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur `MARKENDESIGN.md` ergänzt
und dieser Log-Eintrag — kein Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-26

**Ausgewählter Punkt:** Kein neues Content-Stück. Stattdessen:
`marketing/freigabe-uebersicht.md` (zuletzt 25.08.) um eine kurze
Prüf-Notiz vom 26.08. ergänzt — dokumentiert, dass sich seit dem letzten
Marketing-Lauf nichts an den drei offenen Freigabe-Fragen, an Tier 2
(Warenkorb/6.2) oder an der Checklisten-Persistenz geändert hat, und
ordnet den neuen IT-Fix sowie zwei neue, noch ungefixte Support-Chef-
Funde ein.

**Warum dieser Punkt statt eines neuen Content-Stücks oder gar nichts:**
Vor der Auswahl `git log` seit dem letzten Marketing-Lauf (`5843cc6`,
25.08.) geprüft: fünf neue Commits, davon drei reine IT-Chef-Log-
Einträge ohne Codeänderung ("kein neuer sicherer Punkt"), ein echter
IT-Fix (`e69a523`, automatische Unterkunftssuche bei unbekanntem Ziel
nicht mehr stillschweigend hängend) und ein Support-Chef-Bericht
(`b429e5f`, zwei neue Reibungspunkte bei Datum/Preisformat, beide noch
nicht behoben). `ZEITPLAN.md` bestätigt: 6.2 weiterhin offen, kein neuer
Kanal live, keine Notiz von Ni zu einer der drei Fragen. Ein achtes
Content-Stück hätte damit erneut nur den in `reports/marketing-chef.md`
(20.08.) kritisierten, unangetasteten Entwurfsstapel vergrößert, ohne
neuen, im Code verifizierten "gerade passiert"-Anlass, der groß genug für
ein eigenständiges Stück ist (siehe Prüfung des IT-Fixes unten). Statt
gar nichts zu tun, wurde die Freigabe-Übersicht um den heutigen
Prüfstand ergänzt — echte, im Code nachvollzogene Information, kein
bloßes Wiederholen des Vortags.

`e69a523` einzeln geprüft (`src/hooks/useChat.ts`, Diff gelesen): echte
Verhaltensänderung (Hinweistext auf manuelle Hotelsuche statt
stillschweigendem Hängenbleiben bei sieben der acht kuratierten Ziele),
aber für ein eigenes Content-Stück zu klein und zu technisch, um allein
eine Kernaussage zu tragen — gleiche Einstufung wie die drei kleinen
IT-Korrekturen vom 25.08. (`reports/marketing-chef.md`, Vorschlag 2):
passt zum skizzierten gebündelten Format ("Was wir diese Woche ehrlicher
gemacht haben"), das laut demselben Bericht erst sinnvoll ist, sobald
echte Kanäle live sind — weiterhin nicht der Fall.

`b429e5f` (Support-Chef, zwei neue Funde: fehlendes `min`-Attribut bei
Hinflug-/Check-in-Datum, rohe Preisdarstellung ohne deutsches
Zahlenformat) ist reiner Fehlerbericht ohne Code-Fix — für Content nicht
relevant, solange nichts behoben ist: ein Post über saubere Preisanzeige
wäre vor dem Fix schlicht falsch. In der Übersicht vermerkt, nicht zu
Content verarbeitet.

**Warum sicher genug:** Ergebnis ist eine reine Dokument-Ergänzung, kein
Live-Vorgang — nichts wird gepostet, kein Kanal angelegt, kein
bestehender Text verändert oder gelöscht (nur eine neue Sektion
hinzugefügt). Keine erfundenen Kennzahlen. Keine offene
Positionierungs-Grundsatzfrage: die Ergänzung entscheidet nichts neu
(insbesondere nicht, was tatsächlich veröffentlicht wird — das bleibt
ausdrücklich Nis Entscheidung), sondern trägt nur bereits im Repo
nachprüfbare Fakten nach (Commit-Historie, Code-Diff, ZEITPLAN.md-Stand).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein achtes Content-Stück — siehe Begründung oben, kein neuer, groß
  genug verifizierter "gerade passiert"-Anlass; hätte den kritisierten
  Entwurfsstapel nur vergrößert.
- Gebündeltes "Was wir diese Woche ehrlicher gemacht haben"-Stück zu
  `e69a523` bzw. den drei IT-Korrekturen vom 25.08. — laut eigenem
  Bericht vom 24.08. explizit an "sobald die ersten Kanäle live sind"
  gebunden; noch kein Kanal live.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- "Community/Warteliste aufbauen" (Sprint 4) — hängt weiterhin an der
  noch nicht live geschalteten Warteliste (Sprint 2).
- "Test-Kampagnen mit kleinem Budget starten" (Sprint 6) und
  "Launch-Kampagne vorbereiten" (Sprint 7) — beide weiterhin entweder
  ausdrücklich ein Live-Vorgang oder an denselben ungelösten Blockern
  (keine Landingpage, offene Freigabe-Fragen) hängend wie in den
  bisherigen Läufen.
- Weitere `MARKENDESIGN.md`-Ergänzungen für IT-Chef — geprüft, ob
  `e69a523` (Chat-Hinweistext) eine neue Design-Vorgabe bräuchte:
  `MARKENDESIGN.md`, Abschnitt "Fehlermeldungen (allgemein)", deckt
  dieses Muster (ehrlich/konkret statt generisch, analog zum bestehenden
  Flugsuche-Hinweis) bereits ab — kein neuer Design-Bedarf.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand, entspricht dem Lauf vom 25.08., bestätigt durch
Freigabe-Chef-Log vom 26.08. früh: "0 Commits ggü. main — bereits
vollständig gemerged") war bereits vollständig in `main` gemerged. Branch
daher neu von aktuellem `origin/main` (`f71f0ec`, inkl. der IT-Chef-/
Support-Chef-/Freigabe-Chef-Läufe vom 25./26.08.) angelegt, gleiches
Vorgehen wie bei allen bisherigen Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine bestehende
Markdown-Datei aktualisiert und dieser Log-Eintrag — kein
Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-25

**Ausgewählter Punkt:** Kein neues Content-Stück. Stattdessen:
`marketing/freigabe-uebersicht.md` (zuletzt 21.08.) nachgeführt — das
siebte, am 24.08. entstandene Stück (`content-stueck-reise-suchen-empfohlen.md`)
war dort noch nicht eingetragen; der 24.08.-Lauf hatte das bewusst
zurückgestellt, um nicht zwei Dateien parallel anzufassen, und einen
Hinweis für den nächsten Blick hinterlassen.

**Warum dieser Punkt statt eines neuen Content-Stücks oder gar nichts:**
Vor der Auswahl geprüft, ob sich seit dem 24.08. etwas an den drei
offenen Freigabe-Fragen (Kanal-Start? 6.2 priorisiert? Tier-4-Format
gewollt?) geändert hat: `git log` zeigt seit dem letzten Marketing-Lauf
keine Commits außer automatisierten IT-Chef-/Support-Chef-/Freigabe-Chef-
Läufen (`8fca186`, `011876b`, `4d72bae`, `da97a8a`) — keine Ni-Entscheidung
dazwischen. `ZEITPLAN.md` bestätigt 6.2 weiterhin offen. Damit gilt die
Selbstbeschränkung "kein neues Content-Stück" unverändert weiter (kein
neuer, im Code verifizierter Anlass wie am 24.08.). Statt gar nichts zu
tun, wurde die seit 24.08. angekündigte, aber noch nicht erledigte
Nacharbeit an der Freigabe-Übersicht gemacht — das behebt eine echte,
bereits selbst benannte Lücke, statt den unangetasteten Entwurfsstapel zu
vergrößern oder die Übersicht unverändert zu lassen.

Die drei heutigen IT-Chef-Commits wurden einzeln geprüft und bewusst
nicht zu Content verarbeitet:
- `8fca186` (Checkliste "ausgewählt" statt "gebucht"): behebt nur die
  irreführende Beschriftung, nicht die am 24.08. vom Marketing-Bericht
  genannte eigentliche Werbe-Sperre (die 8 manuellen Punkte bleiben ohne
  Persistenz über Reloads hinweg, `ChecklistPanel.tsx` Zeile 20 im Code
  geprüft) — Checkliste bleibt damit weiterhin bewusst unbeworben.
- `011876b` (Duffel-Fehlermeldungen übersetzt) und `4d72bae`
  (Mikrofon-Fehler sichtbar gemacht): beide wenden nur die bereits
  bestehende `MARKENDESIGN.md`-Vorgabe "Fehlermeldungen (allgemein)" an,
  kein neuer Design-Bedarf für `MARKENDESIGN.md`. Beide einzeln zu klein
  für ein eigenes Content-Stück; passend zum im Bericht vom 24.08. selbst
  skizzierten gebündelten Format ("Was wir diese Woche ehrlicher gemacht
  haben"), das aber laut demselben Bericht erst sinnvoll ist, sobald
  echte Kanäle live sind — bisher nicht der Fall.

**Warum sicher genug:** Ergebnis ist eine reine Übersichts-/
Dokumentaktualisierung, kein Live-Vorgang — nichts wird gepostet, kein
Kanal angelegt, kein bestehender Text verändert oder gelöscht. Keine
erfundenen Kennzahlen. Keine offene Positionierungs-Grundsatzfrage: die
Aktualisierung entscheidet nichts neu (insbesondere nicht, was
tatsächlich veröffentlicht wird — das bleibt ausdrücklich Nis
Entscheidung), sondern trägt nur bereits im Repo nachprüfbare Fakten
nach (siebtes Stück, Checklisten-Persistenz-Status, drei kleine
IT-Korrekturen).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein achtes Content-Stück — hätte den von `reports/marketing-chef.md`
  (20.08.) kritisierten, unangetasteten Entwurfsstapel weiter vergrößert,
  ohne neuen, im Code verifizierten "gerade passiert"-Anlass (anders als
  am 24.08. bei der Empfohlen-Badge-Bedingung).
- Gebündeltes "Was wir diese Woche ehrlicher gemacht haben"-Stück zu den
  drei heutigen IT-Korrekturen — laut eigenem Bericht vom 24.08. explizit
  an "sobald die ersten Kanäle live sind" gebunden; noch kein Kanal live.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- "Community/Warteliste aufbauen" (Sprint 4) — hängt weiterhin an der
  noch nicht live geschalteten Warteliste (Sprint 2).
- "Test-Kampagnen mit kleinem Budget starten" (Sprint 6) und
  "Launch-Kampagne vorbereiten" (Sprint 7) — beide weiterhin entweder
  ausdrücklich ein Live-Vorgang oder an denselben ungelösten Blockern
  (keine Landingpage, offene Freigabe-Fragen) hängend wie in den
  bisherigen Läufen.
- Weitere `MARKENDESIGN.md`-Ergänzungen für IT-Chef — die heutigen
  IT-Fixes wenden bereits bestehende Vorgaben an, kein neuer,
  konkreter Design-Bedarf erkennbar.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand, entspricht dem Lauf vom 24.08.) war laut
`git merge-base --is-ancestor` bereits vollständig in `main` gemerged
(vom Freigabe-Chef am 24.08. bestätigt, siehe `freigabe-chef-log.md`).
Branch daher neu von aktuellem `origin/main` (`da97a8a`, inkl. der drei
IT-Chef-Commits vom 25.08.) angelegt, gleiches Vorgehen wie bei allen
bisherigen Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine bestehende
Markdown-Datei aktualisiert und dieser Log-Eintrag — kein
Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-24

**Ausgewählter Punkt:** Sprint 4 aus `ZEITPLAN.md`, Marketing-Bereich —
"Laufende Content-Produktion". Neue Datei
`marketing/content-stueck-reise-suchen-empfohlen.md`: Post in LinkedIn-
und Instagram-Fassung (Säule 2 "Ein Gespräch statt ein Formular" plus
Säule 1 "Ehrlichkeit als Feature") zur neuen `/reise-planen`-Seite, plus
Canva-Design-Brief für eine sofort umsetzbare, abstrakte Drei-Spalten-
Grafik (Option A).

**Warum genau jetzt und warum kein Verstoß gegen die eigene
Zurückhaltung:** Der letzte Marketing-Bericht (`reports/marketing-chef.md`,
22.08., Vorschlag 1) hatte selbst festgehalten: Sobald der gemeldete
"Empfohlen"-Badge-Bug auf `/reise-planen` behoben ist, ist die Seite "ein
natürlicher Kandidat für ein 'So startest du bei uns'-Content-Stück". Am
23.08. bestätigte derselbe Bericht: "weiterhin nicht behoben". Vor dem
heutigen Lauf `origin/main` in `marketing-chef/auto` gemergt und
`src/pages/ReiseSuche.tsx` direkt im Code geprüft: Der Badge ist jetzt ein
echtes, sichtbares `<Badge>`-Element (`ZEITPLAN.md` bestätigt den Fix als
Teil des IT-Chef-Laufs vom 24.08.). Anders als bei den bisherigen
"kein neues Content-Stück"-Entscheidungen (22./23.08., siehe dortige
Begründungen) gab es hier also echte, neue, im Code verifizierte
Information — kein weiteres Stück auf denselben unveränderten Stapel,
sondern die Einlösung einer selbst gesetzten Bedingung.

**Warum sicher genug:** Ergebnis ist ein reines Entwurfsdokument, kein
Live-Vorgang — nichts wird gepostet, kein Kanal angelegt. Keine erfundenen
Kennzahlen (keine Nutzer-/Reichweitenzahlen). Keine offene
Positionierungs-Grundsatzfrage: Säulen/Markenstimme kommen unverändert aus
`content-plan.md`/`MARKENDESIGN.md`. Ausdrücklich geprüft und im Dokument
selbst berücksichtigt: der laut `reports/it-chef.md` (Stand 23.08.)
weiterhin offene Flugsuche-Chat-Bug — der Post bewirbt die eigenständige
Flugsuche-Seite und den KI-Chat allgemein, keine Aussage zur
Flugsuche-Funktion innerhalb des Chats. Die offene Bildsprachen-Frage
(echte Screenshots ja/nein, `MARKENDESIGN.md`, Abschnitt "Offen") wurde
nicht selbst entschieden — der Design-Brief nutzt bewusst nur die
unstrittige abstrakte Gradient-Option A, analog zum Vorgehen bei
`content-stueck-ehrliche-kartenansicht.md`.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- "Community/Warteliste aufbauen" (Sprint 4) — hängt weiterhin an der
  noch nicht live geschalteten Warteliste (Sprint 2).
- "Test-Kampagnen mit kleinem Budget starten" (Sprint 6) — ausdrücklich
  ein Live-Vorgang, fällt unter das Verbot.
- "Launch-Kampagne vorbereiten" (Sprint 7) — weiterhin an denselben
  ungelösten Blockern (keine Landingpage, offene Freigabe-Fragen zum
  bisherigen Content) hängend wie am 23.08. eingeschätzt; keine neue
  Information seit gestern, die das ändern würde.
- Eine erneute/aktualisierte `marketing/freigabe-uebersicht.md` — bewusst
  nicht in diesem Lauf mit angefasst, um nicht zwei Dateien parallel zu
  verändern; das heutige Stück selbst enthält einen kurzen Hinweis dazu
  für den nächsten Blick auf die Übersicht.
- Presse-/Kampagnen-Vorlagen — beide Sprint-5/7-Punkte sind bereits erledigt
  (`kampagnen-konzept-ads.md` 22.08., `presse-multiplikatoren-strategie.md`
  23.08.), keine Wiederholung sinnvoll.
- Weitere `MARKENDESIGN.md`-Ergänzungen für IT-Chef — kein neuer,
  konkreter Design-Bedarf erkennbar seit dem letzten Lauf.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` (Remote-Stand,
Commit `ffd87ff`, entspricht dem Lauf vom 23.08.) war bereits vollständig
in `main` gemerged. `origin/main` (`a3e3699`, inkl. IT-Chef-Merge vom
24.08. mit Badge-Fix, Reise-Checkliste 6.8/6.9, IATA-Hinweistexten) per
Fast-Forward-Merge in den Branch eingebracht, bevor der eigentliche Lauf
begann, damit der Produktstand-Abgleich im Content-Stück auf dem
tatsächlich aktuellen Code beruht.

**Geprüft:** Kein Produkt-Code geändert, nur eine neue Markdown-Datei,
eine Notiz in `ZEITPLAN.md` und dieser Log-Eintrag — kein
Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-23

**Ausgewählter Punkt:** Sprint 7 aus `ZEITPLAN.md`, Marketing-Bereich —
"Presse-/Multiplikatoren-Kontakte aufbauen". Neue Datei
`marketing/presse-multiplikatoren-strategie.md`: Zielgruppen-Typen
(Tech-/Startup-Presse, KI/LLM-Newsletter, Reise-Content-Creator mit
Planungs-Frust-Fokus, Build-in-public-Communities), Auswahlkriterien,
generische Outreach-Vorlage mit Pflicht-Platzhaltern, sowie Vorbedingungen
und eine offene Frage für Ni.

**Warum dieser Punkt statt eines weiteren Content-Stücks, einer erneuten
Freigabe-Übersicht oder eines weiteren Kampagnen-Konzepts:** Geprüft:
`marketing/freigabe-uebersicht.md` (21.08.) und der letzte
`reports/marketing-chef.md`-Eintrag (22.08.) — die drei dort offenen
Fragen (Kanal-Start mit Tier-1-Stücken? 6.2 priorisieren? Monats-Format
gewollt?) sind weiterhin unbeantwortet, kein neuer Commit dazu (`git log
-- src/pages/Warenkorb.tsx` zeigt seit 18.08. keine Änderung, `6.2` in
`ZEITPLAN.md` weiterhin `[ ]`). Ein siebtes/achtes Content-Stück hätte
damit erneut nur den kritisierten, unangetasteten Stapel vergrößert; eine
erneute Freigabe-Übersicht hätte keinen neuen Inhalt gehabt. Ein weiteres
Kampagnen-Konzept (Sprint 5, bereits am 22.08. erledigt) wäre reine
Wiederholung gewesen. Presse-/Multiplikatoren-Kontakte (Sprint 7) ist
dagegen ein eigenständiger, bisher nie bearbeiteter Marketing-Punkt
(geprüft: `grep -rniE "presse|multiplikator"` über `marketing/`,
`reports/marketing-chef.md` und dieses Log ergab vor diesem Lauf keinen
Treffer) — echter neuer Fortschritt statt Wiederholung des blockierten
Content-Stapels.

**Warum sicher genug:** Ergebnis ist ein reines Strategie-/
Vorlagendokument, kein Live-Vorgang — keine tatsächliche
Presseanfrage wird versendet, kein Kontakt wird hergestellt. Bewusst
KEINE echten Namen von Journalist:innen, Blogger:innen oder Redaktionen
recherchiert oder genannt — das hätte entweder unverifizierte
(möglicherweise falsche) Personen erfunden, was diesem Skill ausdrücklich
untersagt ist (keine erfundenen Kennzahlen/Behauptungen), oder eine echte
Web-Recherche vorausgesetzt, die dieser Lauf nicht durchführt. Keine
erfundenen Reichweiten-/Abo-Zahlen zu Publikationen. Keine offene
Positionierungs-Grundsatzfrage: Zielgruppen-Typen und Markenstimme sind
direkt aus dem bereits von Ni bestätigten `MARKENDESIGN.md` abgeleitet
(Leitbild-Persona "die erschöpfte Planerin", Ehrlichkeit als Feature),
nicht neu entschieden. Die Outreach-Vorlage macht explizit, dass echte
Traktion/Dringlichkeit nicht vorgetäuscht werden darf, passend zum
Pre-Launch-Grundsatz des Skills.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein weiteres Content-Stück oder eine erneute Freigabe-Übersicht —
  siehe Begründung oben, keine neue Information seit dem 22.08.-Lauf.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- "Community/Warteliste aufbauen" (Sprint 4) — hängt weiterhin an der
  noch nicht live geschalteten Warteliste (Sprint 2).
- "Test-Kampagnen mit kleinem Budget starten" (Sprint 6) — ausdrücklich
  ein Live-Vorgang (echtes Budget/echte Kampagne), fällt unter das
  Verbot, unabhängig von der Sprint-Reihenfolge.
- "Launch-Kampagne vorbereiten" (ebenfalls Sprint 7) — hängt inhaltlich
  an denselben ungelösten Blockern (kein freigegebener Content, keine
  Landingpage) wie die bisherigen Content-/Kampagnen-Läufe und hätte zu
  diesem frühen Zeitpunkt vor allem erfundene Annahmen über eine
  Launch-Story gebraucht, die es so noch nicht gibt — Presse-Strategie
  kam ohne diese Annahmen aus.
- Weitere `MARKENDESIGN.md`-Ergänzungen für IT-Chef — kein neuer,
  konkreter Design-Bedarf erkennbar seit dem letzten Lauf.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` (Remote-Stand,
Commit `1d1ebd3`, entspricht dem Lauf vom 22.08.) war bereits vollständig
in `main` gemerged (`git merge-base` gegen `origin/main` bestätigte den
Branch-Tip als Vorfahren). Branch daher neu von aktuellem `origin/main`
(`62d7f55`) angelegt, gleiches Vorgehen wie bei allen bisherigen Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine neue Markdown-Datei,
eine `ZEITPLAN.md`-Checkbox und dieser Log-Eintrag — kein
Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-22

**Ausgewählter Punkt:** Sprint 5 aus `ZEITPLAN.md`, Marketing-Bereich —
"Kampagnen-Konzepte für Google/Meta/TikTok Ads". Neue Datei
`marketing/kampagnen-konzept-ads.md`: Kanal-Rollen (Meta/TikTok
Inspiration, Google Search bewusst zurückgestellt bzw. nur als reine
Marken-Suchkampagne skizziert), Zielgruppen-Definition aus
`MARKENDESIGN.md`, je 2-3 Anzeigentext-Varianten pro Kanal,
Gebotsstrategie- und Testbudget-Empfehlung (Größenordnung, keine
Prognose), sowie eine explizite Liste offener Punkte für Ni.

**Warum dieser Punkt statt eines weiteren Content-Stücks oder einer
erneuten Freigabe-Übersicht:** Seit dem letzten Lauf (21.08.,
`marketing/freigabe-uebersicht.md`) hat sich am Repo-Zustand nichts
geändert, das die dortige Selbstbeschränkung ("kein neues Content-Stück,
bis Ni entschieden hat, was von den sechs fertigen Entwürfen live geht")
entkräften würde — geprüft: `reports/marketing-chef.md` (21.08., letzter
Eintrag) und die drei dort offen gelassenen Fragen (Kanal-Start mit
Tier-1-Stücken? 6.2 priorisieren? Monats-Format gewollt?) sind
unbeantwortet, kein neuer Commit dazu. Ein siebtes Content-Stück hätte
also den kritisierten Stapel weiter vergrößert; eine erneute
Freigabe-Übersicht hätte nur denselben Stand wiederholt, ohne neuen
Inhalt. "Community/Warteliste aufbauen" (ebenfalls Sprint 4) hängt
weiterhin an der nicht live geschalteten Landingpage (Sprint 2) und fällt
damit unter das Live-Verbot. Kampagnen-Konzepte sind dagegen ein
eigenständiger, bisher nie bearbeiteter Marketing-Punkt, der ohne Live-
Kanal und ohne die blockierten Content-Fragen auskommt — echter neuer
Fortschritt statt Wiederholung.

**Warum sicher genug:** Reines Entwurfsdokument (Vorlage zum manuellen
Eintragen in den jeweiligen Ads Manager), kein Live-Vorgang — kein Konto
angelegt, kein Budget freigegeben, keine Kampagne geschaltet. Keine
erfundenen Kennzahlen (kein CAC/ROAS/CTR/CPC — das Dokument sagt explizit,
dass es noch keine echten Kampagnendaten gibt, Budget-Empfehlungen sind
Größenordnungen, keine Prognosen). Keine offene Positionierungs-
Grundsatzfrage: Zielgruppe/Markenstimme kommen unverändert aus
`MARKENDESIGN.md`, hier nur angewendet. Zusätzlich explizit geprüft und
im Dokument selbst berücksichtigt: der laut `reports/it-chef.md` (Stand
21.08.) weiterhin offene Flugsuche-Bug im Haupt-Chat, den Marketing- und
Support-Chef unabhängig als Werbe-Stopp für dieses Feature einstufen —
keine der Anzeigentext-Vorlagen bewirbt eine im Chat durchgängig
funktionierende KI-Flugsuche, Google-Search-Leistungs-Keywords sind
deshalb bewusst zurückgestellt (nur Marken-Suchkampagne als Option
skizziert).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein siebtes Content-Stück oder eine erneute Freigabe-Übersicht — siehe
  Begründung oben, keine neue Information seit dem 21.08.-Lauf.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- "Community/Warteliste aufbauen" (Sprint 4) — hängt weiterhin an der
  noch nicht live geschalteten Warteliste (Sprint 2).
- Weitere `MARKENDESIGN.md`-Ergänzungen für IT-Chef — kein neuer,
  konkreter Design-Bedarf erkennbar seit dem letzten Lauf (keine neue
  Seite ohne bereits gedeckte Design-Vorgabe im aktuellen
  `it-chef-auto-log.md`-Stand).

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` (Remote-Stand,
Commit `d8937c7`, entspricht dem Lauf vom 21.08.) war bereits vollständig
in `main` gemerged (`git merge-base --is-ancestor`, gegen `origin/main`
nach vollem Fetch bestätigt). Branch daher neu von aktuellem
`origin/main` (`5d688da`) angelegt, gleiches Vorgehen wie bei allen
bisherigen Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine neue Markdown-Datei,
eine `ZEITPLAN.md`-Checkbox und dieser Log-Eintrag — kein
Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-21

**Ausgewählter Punkt:** Kein neues Content-Stück aus Sprint 3/4. Stattdessen:
neue Datei `marketing/freigabe-uebersicht.md` — eine Priorisierungs-Übersicht
über die sechs bereits fertigen, unveröffentlichten Entwürfe in `marketing/`.

**Warum dieser Punkt statt eines siebten Content-Stücks:** Der Bericht vom
19.08. (`reports/marketing-chef.md`) hatte explizit angekündigt, den
eigenen autonomen Lauf auf "kein neues Stück" umzustellen, bis mit Ni
geklärt ist, welche der bereits fertigen Texte tatsächlich rausgehen —
der Stapel war trotz einer früheren Warnung weitergewachsen. Vor diesem
Lauf geprüft, ob sich seither etwas an dieser Einschätzung geändert hat:
kein neuer Commit auf `Warenkorb.tsx`, `EditMode.tsx` oder
`Kartenansicht.tsx` seit den jeweiligen Content-Stücken, Flugsuche-Bug
laut `ZEITPLAN.md`/`it-chef-auto-log.md` weiterhin offen und explizit als
UX-Entscheidung (kein Auto-Fix) markiert, kein neuer Kanal/keine
Warteliste live. Die Selbstbeschränkung gilt also unverändert weiter —
ein siebtes Stück hätte genau das wiederholt, wovor der Bericht warnte.
Statt gar nichts zu tun, wurde die im selben Bericht faktisch schon
begonnene, aber nie als eigenes Dokument fertiggestellte Priorisierung
der sechs vorhandenen Stücke ausgearbeitet — das adressiert direkt den
im Bericht benannten Engpass (Freigabe/Priorisierung, nicht neue Ideen),
statt ihn zu vergrößern.

**Warum sicher genug:** Reines Entwurfs-/Übersichtsdokument, kein
Live-Vorgang — nichts wird gepostet, kein Kanal angelegt, kein Text
verändert oder gelöscht. Keine erfundenen Kennzahlen (Follower,
Reichweite o.ä. kommen im Dokument nicht vor). Keine offene
Positionierungs-Grundsatzfrage: die Übersicht entscheidet nichts neu
(insbesondere nicht "was wird veröffentlicht" — das bleibt ausdrücklich
Nis Entscheidung, siehe letzter Abschnitt des Dokuments), sondern
organisiert nur den bereits im Repo nachprüfbaren Stand nach
Freigabe-Reihenfolge.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein siebtes Content-Stück (z. B. zur neuen Profil-Seite/8.8
  Reisepräferenzen, IT-Chef Auto vom 20.08.) — würde die im Bericht vom
  19.08. kritisierte, ohnehin schon gewachsene Ansammlung
  unveröffentlichter Texte weiter vergrößern, ohne den eigentlichen
  Engpass zu lösen. Als möglicher Kandidat für einen späteren Lauf in
  `freigabe-uebersicht.md` vermerkt, nicht ausgearbeitet.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- Kampagnen-Konzepte für Ads (Sprint 5) — laut `ZEITPLAN.md` weiterhin
  zeitlich nicht dran.
- "Community/Warteliste aufbauen" (Sprint 4) — hängt weiterhin an der
  noch nicht live geschalteten Warteliste (Sprint 2).
- Weitere `MARKENDESIGN.md`-Ergänzungen für IT-Chef — kein neuer,
  konkreter Design-Bedarf erkennbar (die neue Profil-Seite nutzt laut
  IT-Chef-Log bereits bestehende Design-Tokens), daher nichts Sinnvolles
  ohne Erfinden einer Vorgabe zu ergänzen.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` (Remote-Stand,
Commit `9fa3a7a`, entspricht dem Lauf vom 20.08.) war bereits vollständig
in `main` gemerged (`git merge-base --is-ancestor`, gegen `origin/main`
nach vollem Fetch bestätigt). Branch daher neu von aktuellem
`origin/main` (`f450fd1`) angelegt, gleiches Vorgehen wie bei allen
bisherigen Läufen.

**Geprüft:** Kein Produkt-Code geändert, nur eine neue Markdown-Datei und
dieser Log-Eintrag — kein Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-20

**Ausgewählter Punkt:** Sprint 3 aus `ZEITPLAN.md`, Marketing-Bereich —
"Content-Plan erstellen (Themen, Formate, Kanäle)" und "Erste
Content-Stücke produzieren (Blog/Social)". Bei der Prüfung im Repo (nicht
nur `ZEITPLAN.md`-Prosa übernommen) zeigte sich: beide Punkte sind
inhaltlich bereits fertig — `marketing/content-plan.md` (erstellt
10.08.) und `marketing/content-stuecke-woche1.md` (erstellt 11.08.)
liegen vollständig ausgearbeitet vor, nur die Checkboxen in `ZEITPLAN.md`
waren nie aktualisiert worden. Gleiches Stale-Checkbox-Muster wie bei den
autonomen IT-Chef-Läufen (z. B. 6.1/6.3, 6.4/6.5, 6.11/6.13).

**Warum dieser Punkt statt eines neuen Content-Stücks:** Der Bericht vom
19.08. (`reports/marketing-chef.md`) warnt ausdrücklich davor, den
Entwurfs-Stapel (sechs fertige, unveröffentlichte Stücke) durch ein
weiteres Stück noch größer zu machen, solange nicht klar ist, was davon
tatsächlich veröffentlicht wird — das kann dieser autonome Lauf nicht
entscheiden, das ist Nis Freigabe. Die stale Checkboxen dagegen zu
korrigieren macht den tatsächlichen Stand sichtbarer, ohne den Stapel zu
vergrößern, und ist eine reine Dokumentationskorrektur.

**Warum sicher genug:** Reine `ZEITPLAN.md`-Korrektur, kein neues
Content-Stück und kein Live-Vorgang — nichts wird gepostet, kein Kanal
angelegt. Keine erfundenen Kennzahlen (betrifft die Korrektur ohnehin
nicht). Keine offene Positionierungs-Grundsatzfrage: die Checkbox bildet
nur den vorhandenen, im Repo nachprüfbaren Stand ab, entscheidet nichts
neu.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- Ein weiteres Content-Stück nach dem bisherigen Muster (Sprint 4,
  "Laufende Content-Produktion") — würde laut Bericht vom 19.08. den
  bereits kritisierten, wachsenden Freigabe-Stapel weiter vergrößern,
  ohne das eigentliche Problem (Veröffentlichung) zu lösen.
- Kampagnen-Konzepte für Ads (Sprint 5) — laut `ZEITPLAN.md` laufen
  Sprint 3/4 zeitlich davor, also weiterhin nicht dran.
- "Community/Warteliste aufbauen" (Sprint 4) — hängt an der noch nicht
  live geschalteten Warteliste (Sprint 2), also aktuell nicht sinnvoll
  bearbeitbar.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto`
(Remote-Stand, Commit `d72d141`) war bereits vollständig in `main`
gemerged (`git merge-base --is-ancestor`, bestätigt gegen `origin/main`
nach vollem Fetch — der anfängliche Shallow-Clone zeigte `origin/main`
zunächst fälschlich auf einem älteren Stand vom 12.08.). Branch daher neu
von aktuellem `origin/main` (`f03360e`) angelegt, gleiches Vorgehen wie
beim Lauf vom 19.08.

**Geprüft:** Kein Produkt-Code geändert, nur `ZEITPLAN.md` und dieser
Log-Eintrag — kein Build/Lint/Test nötig.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-19

**Ausgewählter Punkt:** Sprint 4 aus `ZEITPLAN.md`, Marketing-Bereich —
"Laufende Content-Produktion" — konkret Vorschlag 2 aus
`reports/marketing-chef.md` (2026-08-18): das eigene, wiederkehrende
Format "Was ist echt, was ist Demo" statt eines weiteren
Einzel-Feature-Posts.

**Warum dieser Punkt statt eines neuen Einzel-Feature-Stücks:** Seit dem
letzten Lauf (18.08.) ist auf `main` kein neues Feature fertig geworden
— die IT-Chef-Läufe vom 19.08. (siehe `it-chef-auto-log.md`/Git-Historie)
haben ausschließlich bereits vorhandene Funktionalität als stale
Checkboxen korrigiert (3.0, 5.10), keinen neuen Code gebaut. Es gab also
keinen "gerade passiert"-Anlass für ein weiteres Feature-Stück nach dem
bisherigen Muster. Gleichzeitig warnte der Bericht vom 18.08. ausdrücklich
davor, den Entwurfs-Stapel (fünf fertige, noch unveröffentlichte Stücke)
einfach weiter wachsen zu lassen, und schlug stattdessen konkret ein
neues, andersartiges Format vor: einen monatlichen Status-Post "Was
diesen Monat wirklich gespeichert wird". Das trifft beide Punkte: kein
sechstes Einzel-Feature-Stück, sondern die Umsetzung eines bereits
geprüften, eigenständigen Vorschlags.

**Warum sicher genug:** Reines Entwurfsdokument (Format-Definition +
erste Ausgabe), kein Live-Vorgang — kein Post geht raus, kein Kanal wird
angelegt. Keine erfundenen Kennzahlen — das Format braucht bewusst keine
Reichweiten-/Nutzerzahlen, nur den nachprüfbaren Code-Stand. Keine offene
Positionierungs-Grundsatzfrage: wendet die in `MARKENDESIGN.md`
festgelegte Positionierung nur an, entscheidet sie nicht neu; die
Bildsprachen-Frage bleibt wie in allen bisherigen Stücken bewusst offen.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein weiteres Einzel-Feature-Content-Stück nach altem Muster — kein
  neues Feature seit 18.08. fertig (siehe oben), daher kein
  "gerade passiert"-Anlass; hätte den vom Bericht explizit kritisierten
  wachsenden Freigabe-Stapel nur vergrößert.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- Kampagnen-Konzepte für Ads (Sprint 5) — zeitlich weiterhin nicht dran,
  Sprint 3/4 laufen laut `ZEITPLAN.md` vor Sprint 5.
- Vorschlag 1 aus demselben Bericht (Entwurfs-Stapel gegen echtes
  Publizieren abgleichen, Ni-Durchgang) — das ist explizit Nis
  Freigabe-Entscheidung, keine, die der autonome Lauf selbst treffen
  oder vorwegnehmen kann.
- Vorschlag 3 (Kalender-Content) — laut Bericht bewusst zurückgestellt,
  bis der Kalender an echte Reise-Daten hängt; unverändert seit 18.08.,
  also weiterhin nicht fällig.

**Vor dem Schreiben geprüft (im Code, nicht nur behauptet):** Real-vs-
Demo-Status für alle acht in der Ausgabe genannten Seiten frisch im Code
gegengeprüft (`grep` auf `updateStoredTrip`/`useState` in
`Warenkorb.tsx`, `EditMode.tsx`, `Kalender.tsx`, `Aktivitaeten.tsx`,
`Favoriten.tsx`, `Preisalarme.tsx`, `Angebote.tsx`,
`Reiseentwuerfe.tsx`) statt nur `ZEITPLAN.md`-Prosa zu übernehmen —
bestätigt: `EditMode.tsx` speichert echt über `updateStoredTrip()`, alle
sechs "Demo"-Seiten haben ausschließlich lokalen `useState`-Demo-State
ohne Aufruf einer Persistenz-Funktion. `Kartenansicht.tsx`- und
Warenkorb-Summen-Status aus vorherigen Läufen (11.08./18.08., bereits im
Code geprüft) unverändert übernommen, da seither kein Code an diesen
Stellen geändert wurde. Farbwerte erneut gegen
`src/lib/design-tokens.ts` abgeglichen.

**Umgesetzt:**
- Neue Datei `marketing/content-format-was-wird-gespeichert.md` —
  Definition eines neuen, monatlich wiederkehrenden Formats plus erste
  Ausgabe (August 2026) mit LinkedIn- und Instagram-Fassung sowie
  Canva-Design-Brief für eine sofort umsetzbare, abstrakte
  Zwei-Spalten-Grafik (Option A). Kein echter Screenshot, aus demselben
  Grund wie bei allen bisherigen Stücken: `MARKENDESIGN.md` markiert die
  Bildsprachen-Grundsatzfrage weiterhin als offen.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` (Remote-Stand,
Commit `b331888`) war bereits vollständig in `main` gemerged (laut
`git merge-base --is-ancestor`) — laut Regel für bereits gemergte
Branches neu von aktuellem `origin/main` (`3d4eb4b`) aus angelegt, statt
auf dem alten Stand weiterzuarbeiten.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-18

**Ausgewählter Punkt:** Sprint 3/4 aus `ZEITPLAN.md`, Marketing-Bereich —
"laufende Content-Produktion", Säule 1 (Ehrlichkeit als Feature), nach
dem Redaktionsplan-Muster aus `content-plan.md` Woche 3 Post A ("Einblick
in einen konkreten Baustein ... nur posten, sobald der jeweilige Stand
wirklich erreicht ist"). Konkreter Anlass: 7.6 `Warenkorb.tsx`
(gruppierter Warenkorb mit bei jeder Änderung echt neu berechneten
Zwischen-/Gesamtsummen) wurde laut `ZEITPLAN.md` am 17.08. fertig.

**Warum sicher genug:** Reines Entwurfsdokument, kein Live-Vorgang — kein
Post geht raus, kein Kanal wird angelegt. Keine erfundenen Kennzahlen.
Klar genug beschrieben: die zugrunde liegende Funktionalität ist im Code
nachprüfbar (siehe unten), keine offene Positionierungs-Grundsatzfrage —
Positionierung und Markenstimme kommen unverändert aus `MARKENDESIGN.md`,
das für Warenkorb/Preisalarme sogar eine wörtlich passende Design-Vorgabe
enthält (keine künstliche Dringlichkeit, Preise sachlich zeigen).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- 7.11 `Kalender.tsx` (Monatskalender mit Demo-Reisen) — laut
  `ZEITPLAN.md` ebenfalls seit 17.08. fertig und grundsätzlich genauso
  sicher genug, aber bewusst nicht zusätzlich ausgearbeitet, um bei "ein
  einziger sicherer Punkt" zu bleiben (siehe Abwägung im 17.08.-Eintrag
  unten). Warenkorb gewählt, weil `MARKENDESIGN.md` dafür eine explizite,
  bisher noch nie in einem Content-Stück verwendete Design-Vorgabe
  enthält (Warenkorb/Preisalarme-Abschnitt) — Kalender bleibt als
  Kandidat für einen der nächsten Läufe vorgemerkt.
- 6.1/6.3/6.4/6.5/6.11/6.13 (stale Checkbox-Korrekturen vom 18.08.,
  IT-Chef dritter/zweiter Lauf) — kein "gerade passiert"-Charakter, da
  dabei kein neuer Code entstanden ist, nur bereits vorhandene
  Funktionalität als fertig markiert wurde. Passt nicht zu
  Build-in-public-Content, der echten Fortschritt zeigen soll.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- Kampagnen-Konzepte für Ads (Sprint 5) — zeitlich weiterhin nicht dran,
  Sprint 3/4 laufen laut `ZEITPLAN.md` vor Sprint 5.
- Freigabe der drei liegenden, bereits fertigen Text-Stücke — kein Punkt,
  den der autonome Lauf selbst entscheiden kann (das ist Nis Freigabe,
  siehe `reports/marketing-chef.md` vom 16.08.), taucht hier nur als
  Kontext auf, nicht als gewählter Punkt.

**Vor dem Schreiben geprüft (im Code, nicht nur behauptet):**
`src/pages/Warenkorb.tsx` und `src/lib/trip/cartTotals.ts` vollständig
gelesen — echte Neuberechnung von Zwischen-/Gesamtsumme aus den aktuell
vorhandenen Positionen bestätigt (`groupCartItems`, `calculateCartTotal`,
mit Unit-Tests in `cartTotals.test.ts`), kein separates, potenziell
veraltetes Summenfeld. Bestätigt: kein Buchungs-/Bezahl-Button vorhanden
(6.2 bleibt offen), daher im Post nicht fälschlich mitbeworben.
`MARKENDESIGN.md` erneut auf die Warenkorb/Preisalarme-Design-Vorgabe
sowie Farbwerte in `src/lib/design-tokens.ts` abgeglichen.

**Umgesetzt:**
- Neue Datei `marketing/content-stueck-warenkorb-echte-summen.md` — Post
  in LinkedIn- und Instagram-Fassung (Säule 1), plus Canva-Design-Brief
  für eine sofort umsetzbare, abstrakte Text-Grafik (Option A, gleiches
  Muster wie bei den letzten Content-Stücken). Echter Screenshot
  (Option B) bewusst nicht ausgearbeitet, aus demselben Grund wie bei
  den vorherigen Stücken: `MARKENDESIGN.md` markiert die
  Bildsprachen-Grundsatzfrage weiterhin als offen.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` (Remote-Stand,
Commit `38462fe`) war bereits vollständig in `main` gemerged (13 Commits
Rückstand gegenüber `origin/main`) — laut Regel für bereits gemergte
Branches neu von aktuellem `origin/main` (`cdf8ba8`) aus angelegt, statt
auf dem alten Stand weiterzuarbeiten.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-17

**Ausgewählter Punkt:** Sprint 3/4 aus `ZEITPLAN.md`, Marketing-Bereich —
"laufende Content-Produktion", Säule 3 (Build in public), nach dem
Redaktionsplan-Muster aus `content-plan.md` Woche 3 Post A ("Einblick in
einen konkreten Baustein ... nur posten, sobald der jeweilige Stand
wirklich erreicht ist"). Konkreter Anlass: 6.12 `EditMode.tsx`
(Aktivitäten in der Buchungsseite manuell hinzufügen/entfernen,
Preisanpassung, echt gespeichert über `updateStoredTrip()`) wurde laut
`ZEITPLAN.md` heute (17.08.) fertig.

**Warum sicher genug:** Reines Entwurfsdokument, kein Live-Vorgang — kein
Post geht raus, kein Kanal wird angelegt. Keine erfundenen Kennzahlen.
Klar genug beschrieben: die zugrunde liegende Funktionalität ist im Code
nachprüfbar (siehe unten), keine offene Positionierungs-Grundsatzfrage —
Positionierung und Markenstimme kommen unverändert aus `MARKENDESIGN.md`.

**Abwägung vor der Auswahl:** `reports/marketing-chef.md` (2026-08-16)
empfahl explizit, erstmal die drei bereits fertigen, unangetasteten
Text-Stücke sichten/freigeben zu lassen statt weiterzuschreiben ("Der
Engpass ist unverändert: Freigabe, nicht neue Ideen"). Dieser Rat bleibt
grundsätzlich richtig — aber seit diesem Bericht ist am 17.08. echter
neuer Produktfortschritt dazugekommen (6.12 EditMode, 7.3
Entwurfs-Aktionen, 7.13 Aktivitäten-Seite), den `content-plan.md`
ausdrücklich als zeitkritisch behandelt: Build-in-public-Content soll
nah am tatsächlichen Fortschritt gepostet werden, nicht verzögert
nachgeholt werden, sonst verliert er seinen "gerade passiert"-Charakter.
Deshalb hier bewusst EIN einzelnes, klar abgegrenztes neues Stück
(EditMode) statt gar nichts — nicht als Widerspruch zum Rat vom 16.08.,
sondern als der eine Punkt, bei dem "jetzt schreiben" sich klar
begründen lässt. Die grundsätzliche Freigabe-Empfehlung für die
bestehenden Stücke gilt unverändert und wird hier nicht wiederholt
erledigt.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- 7.3 (Entwurfs-Aktionen) und 7.13 (Aktivitäten-Seite) als eigene
  Content-Stücke — beide grundsätzlich ebenfalls sicher genug, aber
  bewusst nicht zusätzlich ausgearbeitet, um bei "ein einziger sicherer
  Punkt" zu bleiben und nicht noch mehr unbenutzte Entwürfe zu stapeln,
  siehe Abwägung oben. Bleiben als Kandidaten für einen der nächsten
  Läufe vorgemerkt, falls sie bis dahin noch nicht durch andere Content-
  Stücke abgedeckt sind.
- Kampagnen-Konzepte für Ads (Sprint 5) — zeitlich weiterhin nicht dran,
  Sprint 3/4 laufen laut `ZEITPLAN.md` vor Sprint 5.

**Vor dem Schreiben geprüft (im Code, nicht nur behauptet):**
`src/components/trip/EditMode.tsx` vollständig gelesen sowie die
Einbindung in `src/pages/Buchung.tsx` (Import, `updateStoredTrip`-Aufruf,
JSX-Einbindung) — echte Speicherung über `updateStoredTrip()` bestätigt,
nicht bloß Demo-State wie bei anderen kürzlich gebauten Seiten (Favoriten/
Preisalarme/Angebote). Farbwerte erneut gegen `src/lib/design-tokens.ts`
abgeglichen.

**Umgesetzt:**
- Neue Datei `marketing/content-stueck-aktivitaeten-bearbeiten.md` — Post
  in LinkedIn- und Instagram-Fassung (Säule 2+3), plus Canva-Design-Brief
  für eine sofort umsetzbare, abstrakte Text-Grafik (Option A, gleiches
  Muster wie beim letzten Content-Stück). Echter Screenshot (Option B)
  bewusst nicht ausgearbeitet, aus demselben Grund wie beim
  Kartenansicht-Stück: `MARKENDESIGN.md` markiert die
  Bildsprachen-Grundsatzfrage weiterhin als offen.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` (Remote-Stand)
war bereits vollständig in `main` gemerged (Freigabe-Chef-Log vom 17.08.
bestätigt das) — laut Regel für bereits gemergte Branches neu von
aktuellem `origin/main` (`35b2cdc`) aus angelegt, statt auf dem alten
Stand weiterzuarbeiten.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-12

**Ausgewählter Punkt:** Kein neuer Sprint-Punkt aus `ZEITPLAN.md`, sondern
der eigene, bisher offene Vorschlag Nr. 2 aus `reports/marketing-chef.md`
(2026-08-11): ein eigenständiger Post zur ehrlichen Kartenansicht
(`/karte`), der die Positionierung "Ehrlichkeit als Feature" konkret statt
behauptet zeigt. Fällt inhaltlich unter Marketing-Sprint 3/4 ("laufende
Content-Produktion", Säule 1).

**Warum sicher genug:** Reines Entwurfsdokument, kein Live-Vorgang — kein
Post geht raus, kein Kanal wird angelegt. Keine erfundenen Kennzahlen.
Klar genug beschrieben, keine offene Positionierungs-Grundsatzfrage: die
Kernpositionierung ist in `MARKENDESIGN.md` festgehalten, hier nur
angewendet.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot.
- Einfach weitere generische Content-Stücke für "Woche 2" nach
  `content-plan.md` produzieren — bewusst nicht gewählt, weil Nis eigener
  Bericht vom 11.08. (`reports/marketing-chef.md`) explizit empfahl, die
  bereits fertigen Woche-1-Stücke zuerst zu Ni zu bringen statt ungefragt
  weiterzuproduzieren ("Der nächste sinnvolle Schritt ist nicht 'noch mehr
  schreiben'"). Der konkrete, im selben Bericht bereits vorgeschlagene
  Einzelpost (Kartenansicht-Ehrlichkeit) passte dagegen klar in "ein
  einziger sicherer Punkt", ohne diese Empfehlung zu verletzen.
- "Kampagnen-Konzepte für Google/Meta/TikTok Ads" (Sprint 5) — technisch
  ebenfalls ein reines Entwurfsdokument und damit grundsätzlich sicher
  genug, aber zeitlich noch nicht dran (Sprint 3/4 laufen laut
  `ZEITPLAN.md` vor Sprint 5) und ohne live geschaltete Kanäle/Warteliste
  aktuell weniger dringend als das direkt umsetzbare Positionierungs-Stück
  oben.

**Vor dem Schreiben geprüft (im Code, nicht nur behauptet):**
`src/pages/Kartenansicht.tsx` frisch gelesen (nach dem Merge von `main` in
diesen Branch) — Teal-Marker-Logik, ehrliche Leerzustände ("Noch keine
Reise geplant" / "Für dieses Ziel kenne ich noch keine Koordinaten für die
Karte") und Farbverlaufs-Werte in `src/lib/design-tokens.ts`
(`#0A2342`/`#00C2A8`) exakt gegen den Post- und Design-Brief-Text
abgeglichen, keine erfundenen Details.

**Umgesetzt:**
- Neue Datei `marketing/content-stueck-ehrliche-kartenansicht.md` — Post
  in LinkedIn- und Instagram-Fassung (Säule 1, Ehrlichkeit als Feature),
  plus Canva-Design-Brief für eine sofort umsetzbare, abstrakte
  Text-Grafik (Option A). Eine zweite, wirkungsvollere Bildoption (echter
  App-Screenshot) wird als Option B benannt, aber bewusst nicht als Brief
  ausgearbeitet, da `MARKENDESIGN.md` die Frage "echte Screenshots für
  Social Content ja/nein" noch explizit als offen markiert — das ist eine
  Grundsatzfrage, die Ni entscheiden sollte, nicht der autonome Lauf.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war 1 Commit
vor `main` (Skill-Update vom 11.08., `30ba2f5`), aber `main` war seitdem
deutlich weiter (u. a. 7.8 Angebote, 7.9 Favoriten, 7.10 Preisalarme).
`origin/main` per Merge-Commit in diesen Branch eingebracht, bevor der
eigentliche Lauf begann, damit der Kartenansicht-Abgleich auf dem
tatsächlich aktuellen Code-Stand beruht.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-11

**Ausgewählter Punkt:** Sprint 3 aus `ZEITPLAN.md`, Marketing-Bereich —
"Erste Content-Stücke produzieren (Blog/Social)", der zweite,
zurückgestellte Punkt aus dem gestrigen Content-Plan-Lauf.

**Warum sicher genug:** Ergebnis ist ein reines Entwurfsdokument mit
Post-/Blog-Texten, kein Live-Vorgang — nichts wird gepostet, kein Kanal
angelegt, kein Link auf eine nicht existierende Warteliste. Keine
erfundenen Kennzahlen (keine Follower-/Reichweitenzahlen, keine
Ersparnis-Angaben). Klar genug beschrieben und direkt auf
`marketing/content-plan.md` (Woche 1, Post A + Post B) aufbauend, keine
offene Positionierungs-Grundsatzfrage — Positionierung, Zielgruppe und
Markenstimme sind bereits in `MARKENDESIGN.md` festgehalten und wurden
hier nur angewendet, nicht neu entschieden.

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
Stand `ffc7d62` (Content-Plan vom 10.08.) hängengeblieben, dessen Inhalt
laut `origin/main`-Historie (`ca5b107`) bereits nach `main` gemerged
wurde — der Branch war also nur noch veraltet, nicht mehr in Arbeit.
Neu von aktuellem `origin/main` (`4c253a9`, inkl. der neuesten IT-Chef-
Arbeit zu 7.1/7.2/7.14) aus angelegt, wie in den Session-Regeln für
bereits gemergte Branches vorgesehen.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- "Landingpage/Warteliste live" (Sprint 2, weiterhin offen laut
  `ZEITPLAN.md`) — ausdrücklich ein Live-Vorgang, fällt unter das Verbot.

**Umgesetzt:**
- Neue Datei `marketing/content-stuecke-woche1.md` — konkrete,
  copy-paste-fertige Entwürfe für Woche 1 aus dem Redaktionsplan: Post A
  (Vorstellung/Build-in-public) und Post B (Reise-Planungs-Frust), je in
  LinkedIn- und Instagram-Fassung (Bild-/Reel-Idee + Hashtags), plus ein
  Blog-Stück (~350 Wörter, "Warum wir keine Countdown-Timer bauen") zu
  Säule 1 (Ehrlichkeit als Feature) mit einem wörtlichen Zitat aus
  `src/lib/ai/mockAdvisor.ts` (Zeile 115, vorher im Code geprüft) statt
  einer erfundenen Markenaussage.

**Geprüft:** Kein Code geändert, daher kein Build/Lint/Test nötig — reine
Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## 2026-08-10

**Ausgewählter Punkt:** Sprint 3 aus `ZEITPLAN.md`, Marketing-Bereich —
"Content-Plan erstellen (Themen, Formate, Kanäle)".

**Warum sicher genug:** Ergebnis ist ein reines Entwurfsdokument, kein
Live-Vorgang — kein Kanal wird angelegt, kein Post veröffentlicht. Keine
erfundenen Kennzahlen nötig (der Plan ist bewusst so gebaut, dass er ohne
Reichweiten-/Engagement-Annahmen auskommt). Klar genug beschrieben in
`ZEITPLAN.md`, keine offene Positionierungs-Grundsatzfrage — die
Zielgruppen-Arbeitshypothese aus `MARKENDESIGN.md`/`Marketing-Chef-Konzept.md`
wurde übernommen und explizit als "noch nicht final von Ni bestätigt"
gekennzeichnet, statt sie stillschweigend festzuschreiben.

**Andere Sprint-1/2-Punkte geprüft und bewusst nicht gewählt:**
- "Positionierung & Zielgruppen final festlegen" (Sprint 1) — das ist
  laut `ZEITPLAN.md` explizit eine Entscheidung, die Ni treffen muss,
  keine, die autonom gefällt werden sollte.
- "Landingpage/Warteliste live" (Sprint 2) — ausdrücklich ein
  Live-Vorgang, fällt unter das Verbot für den autonomen Modus.

**Umgesetzt:**
- Neue Datei `marketing/content-plan.md` — vier Content-Säulen aus der
  echten Positionierung abgeleitet (Ehrlichkeit als Feature, Gespräch
  statt Formular, Build in public, Reise-Planungs-Frust), Kanal-/Format-
  Aufteilung (Instagram, LinkedIn, TikTok, X), realistische Frequenz
  (2×/Woche, Start mit LinkedIn+Instagram), Redaktionsplan-Vorlage für
  die ersten 4 Wochen, Leitplanken (keine erfundenen Zahlen, keine
  künstliche Dringlichkeit, keine Werbung für unfertige Features).

**Hinweis zum Repo-Zustand bei diesem Lauf (rein informativ, keine
Aktion nötig):** Beim Start dieses Laufs zeigte ein `git fetch origin
main` zunächst einen veralteten Stand von `origin/main` (nur 2 Commits,
ohne `ZEITPLAN.md`/`MARKENDESIGN.md`/Skills) — nach erneutem Fetch war
der korrekte, aktuelle `origin/main`-Stand (Commit `788d0e4`, inkl. aller
bisherigen IT-Chef-/Freigabe-Chef-Arbeit) sichtbar. Sah kurzzeitig nach
möglichem Datenverlust aus, war aber offenbar nur ein einmaliger,
veralteter Fetch/Cache-Effekt — `git ls-remote origin` zeigte den
richtigen Stand direkt. `marketing-chef/auto` wurde korrekt von diesem
richtigen `main`-Stand aus angelegt.

**Geprüft:** Kein Code geändert, daher kein Build/Lint/Test nötig — reine
Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).
