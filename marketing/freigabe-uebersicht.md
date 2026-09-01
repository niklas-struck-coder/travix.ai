# Freigabe-Übersicht — was liegt bereit, was blockiert (Stand 2026-09-01)

Kein neuer Content-Text — dieses Dokument sortiert die weiterhin sieben
fertigen Entwürfe in `marketing/`, damit die eigentliche Bremse (nicht
neue Ideen, sondern Freigabe/Priorisierung durch Ni) leichter zu lösen
ist. Erstellt/aktualisiert werden nur diese Übersicht, nichts wird
gepostet oder verändert.

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
   2026-09-01 oben). Der eigene Bericht
   vom 29.08. (`reports/marketing-chef.md`) hat dafür bereits einen
   konkreten Formatnamen vorgeschlagen: "Ehrlichkeits-Log", ein Satz
   Vorher/Nachher pro Fund — bleibt an Frage 3 unten gebunden.

## Für Ni: die eigentliche Entscheidung

Keine dieser Prioritäten ersetzt Nis Freigabe — das kann und soll der
autonome Lauf nicht vorwegnehmen. Konkret zu entscheiden bleibt
(unverändert seit 21.08.):
- Sollen LinkedIn/Instagram als Kanäle jetzt angelegt werden (die drei
  Tier-1-Stücke sind dafür bereit), oder wartet das noch auf die
  Landingpage/Warteliste (Sprint 2, weiterhin offen)?
- Bleibt Warenkorb-Content zurückgehalten, bis 6.2 existiert — oder soll
  6.2 (Buchen-Button) priorisiert werden, damit der bereits geschriebene
  Text nutzbar wird?
- Ist das wiederkehrende Format (Tier 4) grundsätzlich gewollt?

## Nächster autonomer Lauf
Solange sich an diesen drei Punkten nichts ändert, bleibt die
Selbstbeschränkung "kein neues Content-Stück" aus dem Bericht vom
20.08. bestehen (die einzige bisherige Ausnahme war Tier-1-Stück 3,
weil es am 24.08. eine selbst gesetzte, im Code verifizierte Bedingung
einlöste — kein Bruch der Selbstbeschränkung, siehe
`marketing-chef-auto-log.md`, 24.08.). Der nächste Lauf sollte zuerst
prüfen, ob Ni zwischenzeitlich eine der drei Fragen beantwortet hat
(z. B. neue Kanal-Links, ein Commit zu 6.2, oder eine Notiz in diesem
Dokument) oder ob die Checkliste inzwischen echte Persistenz hat (dann
wird sie laut Bericht vom 24.08. selbst zum nächsten Content-Kandidaten),
bevor er wieder einen neuen Text schreibt.
