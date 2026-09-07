# Neues Format — öffentlicher Mini-Changelog im Produkt (Entwurf)

Entwurf — vom autonomen Marketing-Chef-Lauf am 2026-09-05 ausgearbeitet,
wartet auf Nis Freigabe. **Nichts davon ist live** — weder der Text noch
die vorgeschlagene Seite im Produkt. Die tatsächliche Umsetzung (Seite/
Footer-Link) müsste IT-Chef bauen, sobald Ni das Konzept freigibt.

Erstellt: 2026-09-05
Bezug: `reports/marketing-chef.md` (2026-09-04, Vorschlag 3) — dort zum
ersten Mal vorgeschlagen: *"ein nachprüfbarer Mini-Changelog im Produkt
statt reiner Social-Posts ... würde die wachsende Tier-4-Liste endlich
sichtbar machen, ganz ohne die Kanal-Frage zu berühren."* Dieser Lauf
setzt die Idee zum ersten Mal tatsächlich um, statt sie nur als Vorschlag
stehen zu lassen.

## Warum das ins Sicherheitsraster für den autonomen Modus passt

- **Ergebnis ist ein reines Entwurfsdokument, kein Live-Vorgang.** Es wird
  nichts gepostet, kein Kanal angelegt, keine Seite im Produkt gebaut —
  nur Konzept + fertiger Text für eine erste Ausgabe.
- **Keine erfundenen Kennzahlen.** Jeder Punkt unten stammt aus bereits
  verifizierten Commits (siehe `marketing/freigabe-uebersicht.md` und
  `it-chef-auto-log.md`), keine Reichweiten-/Nutzerzahlen nötig.
- **Keine offene Positionierungs-Grundsatzfrage.** Das Format wendet die
  in `MARKENDESIGN.md` festgelegte Positionierung ("Ehrlichkeit als
  Feature") nur an, entscheidet sie nicht neu.
- **Berührt bewusst keine der drei offenen Fragen an Ni**
  (`marketing/freigabe-uebersicht.md`): kein Social-Kanal nötig (Frage 1),
  kein Bezug zu 6.2/Warenkorb (Frage 2), und keine Entscheidung über das
  wiederkehrende *Social*-Format (Frage 3) — dieser Mini-Changelog ist
  ausdrücklich eine andere, eigenständige Idee (Seite im Produkt statt
  Social-Post), die im Vorschlag vom 04.09. genau deshalb vorgeschlagen
  wurde. Ob Ni das Format überhaupt bauen lassen will, ist eine neue,
  vierte Frage — siehe "Für Ni" unten, keine der drei alten wird hier
  vorweggenommen.

## Konzept

**Titel (Arbeitstitel):** "Was wurde besser" — oder falls Ni einen
anderen Ton möchte: "Ehrlichkeits-Log". Beide Varianten unten im
Design-Brief vorgesehen, Text unten unter dem ersten Titel geschrieben.

**Wo:** Ein Footer-Link im Produkt (z. B. neben einem künftigen
Impressum-Link, siehe `ZEITPLAN.md` Support-Bereich Sprint 4), der auf
eine eigene, schlichte Seite führt. Kein Social-Post, keine E-Mail —
lebt im Produkt selbst, für jede:n Besucher:in sichtbar, nicht nur für
Follower eines noch nicht existierenden Kanals.

**Rhythmus:** Keine feste Frequenz nötig wie bei einem Social-Kalender —
neue Einträge kommen, wenn genug einzelne kleine Fixes sich zu einer
Ausgabe bündeln lassen (ähnlich wie bisher in
`marketing/freigabe-uebersicht.md` Punkt 7 gesammelt). Realistisch:
alle 1-2 Wochen eine neue Ausgabe, sobald der Tier-4-Kandidatentopf
wieder genug hergibt.

**Zweck:** Die seit 25.08. laufend gesammelten kleinen
Ehrlichkeits-/Zuverlässigkeits-Fixes (siehe Tier-4-Topf in
`marketing/freigabe-uebersicht.md`) sind einzeln zu klein für einen
eigenen Post, aber in Summe ein echter Beleg für die Positionierung
"Ehrlichkeit als Feature, nicht als Kleingedrucktes". Statt auf eine
Kanal-Entscheidung zu warten, macht eine Seite im Produkt selbst das
sofort nachprüfbar — glaubwürdiger als Kampagnen-Content, weil es kein
Werbeversprechen ist, sondern eine öffentliche Liste dessen, was
tatsächlich im Code korrigiert wurde.

**Tonfall:** Alltagssprache statt Bug-Tracker-Jargon — jeder Punkt als
"Vorher hätte das passieren können / jetzt nicht mehr"-Satz, nicht als
technische Commit-Beschreibung. Kein Werturteil, keine Entschuldigung,
kein Selbstlob ("wir haben X grandios gelöst") — nur die nüchterne
Vorher/Nachher-Tatsache, im selben ehrlichen, ruhigen Ton wie die
UI-Texte selbst (`MARKENDESIGN.md`, Markenstimme).

**Leitplanken (aus `content-plan.md`/`MARKENDESIGN.md` übernommen):**
- Keine erfundenen Kennzahlen, kein "X Nutzer:innen betroffen".
- Kein CTA zu einer Warteliste oder einem Kanal, der nicht existiert.
- Jede künftige Ausgabe braucht einen frischen Code-Abgleich, nicht das
  Kopieren alter Einträge (gleiche Regel wie beim Monats-Format).
- Kein Punkt aus dem Tier-4-Topf, der noch nicht per `git show` einzeln
  verifiziert wurde (siehe Prüf-Historie in
  `marketing/freigabe-uebersicht.md`) — die Liste unten übernimmt nur
  bereits geprüfte Fixes, plus drei neue, in diesem Lauf selbst per
  `git show` geprüfte Commits (siehe Abschnitt "Neu in diesem Lauf
  geprüft" unten).

## Neu in diesem Lauf geprüft (seit dem letzten Marketing-Lauf, 8242a53, 04.09.)

`git log 8242a53..origin/main` zeigt 13 neue Commits. Davon ohne
Content-Relevanz: zwei Freigabe-Chef-Merges/-Logs, ein Daily-Status-
Update, ein Support-Chef-Bericht, ein eigener interaktiver
Marketing-Chef-Bericht (der genau die hier umgesetzte Idee vorschlägt)
und ein IT-Chef-Bericht (alle rein interaktiv/Log, keine Codeänderung).

Fünf echte Codeänderungen einzeln per `git show` geprüft:

- **`d34796f` (04.09., IT-Chef 34. Lauf):** Ein echter Suchfehler in der
  *automatischen* Unterkunftssuche im Haupt-Chat-Ablauf (`useChat.ts`)
  setzte zwar die Fehlermeldung, aber anders als der strukturell
  identische "Bearbeiten"-Pfad keine anklickbare nächste Option — einzige
  Möglichkeit war ein kompletter Neustart. Jetzt bekommt die Nutzerin
  auch hier "Neue Reise planen" als Ausweg angeboten. **Content-relevant**
  — direkte Fortsetzung der bereits gelisteten Flug-Sackgassen-Fixe
  (30./31.08.), diesmal für Unterkunft im Hauptablauf statt nur im
  Bearbeiten-Pfad.
- **`acc9ae8` (05.09., IT-Chef 36. Lauf):** Der Mikrofon-Knopf im Chat
  konnte bei einem Browser-Fehler (z. B. verweigerte
  Mikrofonberechtigung) dauerhaft im "Aufnahme läuft"-Zustand hängen
  bleiben, ohne dass die bereits vorhandene Fehlermeldung je erschien —
  einziges Signal war ein Knopf, der einfach nicht mehr reagierte.
  **Content-relevant** — passt zum bestehenden Muster "kein stiller,
  unerklärter Hänger ohne Rückmeldung".
- **`add329b` (05.09., IT-Chef 38. Lauf):** Bei vollem Browser-Speicher
  oder im privaten Modus konnte das Speichern des Chat-Zustands den
  ganzen Chat abstürzen lassen. **Content-relevant** — gleiche
  Fehlerklasse wie der bereits gelistete `hasTripData()`-Absturzfix vom
  04.09., nur beim Schreiben statt beim Lesen.
- **`2e09258` (04.09., IT-Chef 35. Lauf):** IATA-Feld im Flug-Assistenten
  ohne Buchstabenprüfung — reine Validierungskorrektur, gleiche
  Einstufung wie `89f63c2`/`ab7f4e6`/`4ee4b4a`. **Nicht** aufgenommen.
- **`26f7edd` (05.09., IT-Chef 37. Lauf):** Flugsuche verhinderte
  identischen Start-/Zielflughafen nicht. Reine Validierungskorrektur,
  keine "falsche Information ohne Erkennbarkeit"-Erzählung wie die
  anderen Punkte. **Nicht** aufgenommen.

Die drei neuen, content-relevanten Fixes sind unten in die passenden
Themenblöcke (Block A bzw. D) einsortiert.

**Zur Sprachfunktion (weiterhin nicht bewerben):** `acc9ae8` behebt den
hängenden Mikrofon-Knopf — einen der beiden Gründe, die der eigene
Bericht vom 03./04.09. gegen eine Bewerbung von "sprich einfach mit
Travix" genannt hat. Der zweite Grund (PR #16, fehlender Stopp-Knopf für
die Vorlesen-Funktion) ist laut `git merge-base --is-ancestor` weiterhin
**nicht** in `main` gemergt. Solange nur einer von zwei Gründen behoben
ist, bleibt die Zurückhaltung unverändert bestehen — hier nicht erneut
als eigener Content-Punkt behandelt, sondern nur als Randnotiz
festgehalten, falls Ni den Fortschritt sehen will.

## Erste Ausgabe — Entwurf für die Mini-Changelog-Seite

*(Stand: Fixes vom 25.08. bis 05.09.2026, alle bereits gemergt in
`main`. Ab hier reiner Vorschlags-Text für die künftige Seite — nicht
technisch, nicht in Ich-Form des Bots, sondern als kurze Markenaussage.)*

---

### Was wurde besser

*Eine ehrliche Liste dessen, was wir in den letzten Wochen an travix.ai
korrigiert haben — nicht nur, was neu dazugekommen ist. Ehrlichkeit
heißt für uns auch: zeigen, was vorher nicht gut genug war.*

**Du bekommst jetzt einen echten Fehler statt eines irreführenden
"nichts gefunden"**
- Wenn die Suche nach Flügen oder Unterkünften im Chat wirklich
  fehlschlägt, siehst du das jetzt auch so — vorher sah ein echter
  technischer Fehler manchmal aus wie eine ehrliche Suche ohne Treffer.
- Nach einem solchen Fehler gibt es jetzt immer einen klaren nächsten
  Schritt zum Anklicken, egal ob bei Flug oder Unterkunft, egal ob im
  normalen Gesprächsverlauf oder beim nachträglichen Bearbeiten — vorher
  konnte das in einer Sackgasse enden, aus der nur ein kompletter
  Neustart herausführte.
- Eine zweite Suche zeigt keine veralteten Ergebnisse der ersten mehr an
  — weder bei Unterkünften noch beim Starten einer komplett neuen Reise
  mitten in einer laufenden Suche.
- Eine Fehlermeldung nach einer gescheiterten Suche bleibt nicht mehr
  fälschlich stehen, wenn du einfach normal weiterschreibst.

**Der Chat versteht dein Reiseziel und Transportmittel genauer**
- Kurze Ortsnamen wie "Rom" wurden früher manchmal auch mitten in ganz
  anderen Wörtern erkannt (z. B. in "romantisch") — das führte zu
  stillen, falschen Suchen für ein Ziel, das du nie genannt hast. Jetzt
  nicht mehr.
- Derselbe Fehler steckte auch bei der Erkennung von Verkehrsmitteln
  ("Business Class" wurde fälschlich als "Bus" erkannt) — ebenfalls
  behoben.
- Der Urlaubs-Concierge erkennt jetzt auch echte, aber nicht auf unserer
  Liste stehende Reiseziele korrekt, statt pauschal "kein Ziel geplant"
  zu antworten.

**Fehlermeldungen sind auf Deutsch und verständlich, nicht mehr
technischer Rohtext**
- Wenn unser Reise-Anbieter im Hintergrund einen Fehler zurückgibt oder
  die Verbindung ganz abbricht, siehst du jetzt in jedem Fall eine
  ehrliche, verständliche deutsche Meldung mit einem konkreten nächsten
  Schritt — nicht mehr die rohe, englische Fehlermeldung des Anbieters.

**Kleine Robustheits-Fixes, die einen kompletten Absturz verhindern**
- Alte, gespeicherte Reisedaten in deinem Browser konnten früher in
  seltenen Fällen dazu führen, dass Buchungs-, Chat- oder Kartenseite
  komplett leer blieben. Jetzt fängt eine zusätzliche Prüfung das ab.
- Dasselbe gilt jetzt auch beim Speichern: ist der Browser-Speicher voll
  oder du bist im privaten Modus unterwegs, stürzt der Chat dadurch
  nicht mehr ab.
- Der Mikrofon-Knopf im Chat konnte bei einem Berechtigungsproblem
  früher dauerhaft hängen bleiben, ohne dass du erfahren hast, warum.
  Jetzt bekommst du in diesem Fall eine Fehlermeldung statt eines
  Knopfs, der einfach nicht mehr reagiert.

**Ehrliche Abschlussmeldungen statt eingelöster Versprechen, die es
nicht gab**
- Am Ende einer Reiseplanung im Chat wurde bisher für jedes
  Verkehrsmittel derselbe Satz gezeigt ("Ich suche jetzt nach echten
  Verbindungen") — das stimmte aber nur beim Flug. Für Zug, Bus, Fähre
  und Mietwagen bekommst du jetzt eine ehrliche Abschlussmeldung statt
  eines Versprechens, das nie eingelöst wurde.

---

*Kein einziger Punkt oben ist eine neue Funktion — jeder ist eine
Korrektur an etwas, das vorher nicht ehrlich oder nicht zuverlässig
genug war. Genau das soll diese Seite zeigen.*

## Design-Brief (für IT-Chef, falls Ni das Konzept freigibt)

- **Kein Social-Post-Format** — eine normale, ruhige Content-Seite im
  Produkt, keine Grafik/kein Bild nötig (anders als Instagram/TikTok-
  Content). Reiner Fließtext mit Zwischenüberschriften, wie oben.
- **Farben/Ton:** folgt `MARKENDESIGN.md` — kein Rot (auch nicht für die
  "was war vorher falsch"-Beschreibung, das ist kein Fehlerzustand,
  sondern bereits Behobenes), Teal für die Zwischenüberschriften-Akzente,
  Navy/Grau für Fließtext, passend zur bestehenden Gradient-Ästhetik im
  Seitenkopf.
- **Kein Trash2/Warn-Icon-Overkill** — schlichte Liste, keine
  Ampel-/Status-Icons pro Punkt, das würde nach einem Status-Dashboard
  aussehen statt nach einer ehrlichen Erzählung.
- **Platzierung:** Footer-Link (Vorschlag: "Was wurde besser" neben
  einem künftigen Impressum-Link), keine Navigation in der Haupt-Sidebar
  — das ist bewusst ein Nebenschauplatz für Interessierte, kein
  Kern-Feature.

## Für Ni: die eigentliche Entscheidung

Eine **vierte, neue** Frage, unabhängig von den drei bereits offenen
Fragen in `marketing/freigabe-uebersicht.md`:
- Soll dieses Format überhaupt gebaut werden (Footer-Seite im Produkt)?
  Falls ja, übernimmt IT-Chef die Umsetzung der Seite selbst — dieser
  Entwurf liefert nur Konzept und fertigen Text für die erste Ausgabe.
- Falls nein oder "später": Der Text oben bleibt trotzdem nutzbar als
  Rohmaterial, falls doch ein Social-Post daraus werden soll, sobald
  Frage 3 (wiederkehrendes Social-Format) von Ni beantwortet ist.

Die drei alten Fragen (Kanal-Start? 6.2 priorisiert? Tier-4-Social-Format
gewollt?) bleiben von diesem Vorschlag unberührt und weiterhin offen.

---

## Ausgabe 2 (Entwurf) — vom autonomen Marketing-Chef-Lauf am 2026-09-07

Wie Ausgabe 1: **nichts davon ist live.** Reiner Textentwurf für dieselbe,
noch nicht gebaute Footer-Seite — hängt an derselben vierten Frage unten
wie Ausgabe 1 (weiterhin unbeantwortet, siehe
`marketing/freigabe-uebersicht.md`).

### Warum jetzt eine zweite Ausgabe

Die eigene Selbstauflage aus dem 06.09.-Lauf (`marketing-chef-auto-log.md`)
war: eine zweite Ausgabe erst schreiben, wenn sich seit Ausgabe 1 (05.09.)
wieder "genug" neue, einzeln verifizierte Tier-4-Kandidaten angesammelt
haben, statt nach jedem einzelnen neuen Fix. Vor der Auswahl `git log
5299c9c..origin/main` geprüft (letzter Marketing-Lauf, 06.09., laut `git
merge-base --is-ancestor` bereits vollständig in `main` gemergt): 13 neue
Commits, davon acht content-relevante Codeänderungen seit Ausgabe 1 — doppelt
so viele wie am 06.09. (damals vier, bewusst noch als "nicht genug"
gewertet). Alle acht einzeln per `git show` geprüft, keiner davon bereits
in Ausgabe 1 enthalten (alle datieren nach deren Commit `2e28606`,
2026-09-05 04:09 UTC):

- **`404935c` (05.09.):** `formatOfferPrice()` warf bei fehlendem/ungültigem
  Währungscode eine `RangeError` und ließ Flug-/Hotelkarten abstürzen.
- **`0b28d39` (05.09.):** ein fehlgeschlagenes Speichern des Chat-Fortschritts
  (voller Speicher/privater Modus) blieb bisher unbemerkt — jetzt zeigt der
  Chat einen sichtbaren Hinweis statt eines lautlosen künftigen
  Datenverlusts.
- **`bf20ae3` (06.09.):** "euro"/"hi" ohne Wortgrenzen im Urlaubs-Concierge
  matchte fälschlich mitten in "Europa"/"Sushi" — gleiche Fehlerklasse wie
  die bereits in Ausgabe 1 gelisteten Wortgrenzen-Bugs.
- **`2483ce4` (06.09.):** ein alter/korrupter Reiseplan ohne
  "Aktivitäten"-Feld konnte Buchungs-, Checklisten- und Bearbeiten-Ansicht
  abstürzen lassen — jetzt wird das Feld beim Laden auf eine leere Liste
  normalisiert.
- **`0d4aab2` (06.09.):** der Begrüßungs-Quick-Reply "Überrasch mich" wurde
  bisher wörtlich als Reiseziel übernommen — ein Ziel, das weder
  Unterkunfts-/Flugsuche noch Kartenansicht je auflösen konnten. Jetzt wählt
  der Chat dafür eines der kuratierten Reiseziele aus.
- **`fc17297` (07.09.):** Speichern einer Auswahl auf der Flug-/
  Hotelsuche-Seite oder beim Bearbeiten der Aktivitäten zeigte "gespeichert"
  an, selbst wenn das eigentliche Schreiben in den Browser-Speicher
  fehlgeschlagen war — jetzt erscheint auch dort derselbe ehrliche Hinweis
  wie im Chat.
- **`56c8f61` (07.09.):** nach einer echten Nulltreffer-Suche (Unterkunft
  oder Flug) blieben die Chat-Chips leer — einzige Möglichkeit war bisher
  ein kompletter Neustart. Jetzt gibt es wie bei jedem anderen
  Chat-Endzustand einen Chip zum Weitermachen.
- **`b0b8d2e` (07.09.):** kannte der Chat ein genanntes Reiseziel nicht für
  die automatische Unterkunftssuche, kündigte er trotzdem "Ich suche jetzt
  nach echten Unterkünften" an, gefolgt von der gegenteiligen
  Ehrlichkeits-Meldung — dieselbe Widersprüchlichkeit, die auch schon bei
  der ehemaligen Flug-Variante bestand. Jetzt ist die erste Ankündigung
  selbst schon ehrlich, wenn das Ziel nicht bekannt ist.

Zwei der acht (`56c8f61`, `b0b8d2e`) sind genau die beiden Funde, die der
eigene Bericht vom 05.09. (`reports/marketing-chef.md`, Vorschlag 3) und
das Update vom 06.09. in diesem Dokument explizit als "guten Baustein für
die nächste Ausgabe, sobald IT-Chef entschieden hat" vorgemerkt hatten —
IT-Chef hat das seither entschieden (siehe `reports/support-chef.md`,
06.09., sowie `it-chef-auto-log.md`).

**Randnotiz, kein eigener Changelog-Punkt (siehe unten für die
Einordnung):** `ac0e188` (06.09.) behebt zusätzlich den zweiten der beiden
Gründe, die bisher gegen eine Bewerbung der Vorlesen-Funktion sprachen —
siehe Abschnitt "Wichtige Randnotiz: Sprachfunktion" unten.

### Zweite Ausgabe — Entwurf für die Mini-Changelog-Seite

*(Stand: Fixes vom 05.09. bis 07.09.2026, alle bereits gemergt in `main`.
Ergänzt die erste Ausgabe, ersetzt sie nicht — beide Ausgaben blieben auf
der künftigen Seite sichtbar, ähnlich einem Blog-Archiv.)*

---

### Was seither noch besser wurde

**Fehlgeschlagenes Speichern bleibt nicht mehr unbemerkt**
- Konnte dein Fortschritt im Chat nicht gespeichert werden (voller
  Browser-Speicher, privater Modus), bekommst du das jetzt direkt
  angezeigt — vorher hast du es erst beim nächsten Laden gemerkt, wenn er
  einfach weg war.
- Dasselbe gilt jetzt auch beim Auswählen eines Flugs, eines Hotels oder
  beim Bearbeiten deiner Aktivitäten: schlägt das Speichern fehl, siehst du
  das sofort, statt eine Bestätigung zu sehen, die ein Neuladen wieder
  verworfen hätte.

**Keine Sackgasse mehr nach einer ehrlichen Nulltreffer-Suche**
- Findet eine Flug- oder Unterkunftssuche wirklich keine Angebote, bekommst
  du jetzt wie bei jedem anderen Gesprächsende einen Chip zum Weitermachen
  angeboten — vorher half nur ein kompletter Neustart.

**Ehrlichere Ankündigungen, bevor eine Suche überhaupt losgeht**
- Kennt der Chat dein genanntes Reiseziel noch nicht für die automatische
  Unterkunftssuche, sagt er das jetzt direkt, statt erst "Ich suche
  jetzt..." zu versprechen und die Absage gleich hinterherzuschicken.
- Antwortest du auf die Begrüßung mit "Überrasch mich", bekommst du jetzt
  tatsächlich ein konkretes, echtes Reiseziel vorgeschlagen — vorher wurde
  "Überrasch mich" selbst wörtlich als dein Reiseziel übernommen, mit dem
  weder Suche noch Kartenansicht je etwas anfangen konnten.

**Weitere kleine Robustheits- und Verständnis-Korrekturen**
- Ein fehlender oder ungültiger Währungscode konnte Flug- oder
  Hotelkarten zum Absturz bringen — jetzt abgefangen.
- Ein alter, gespeicherter Reiseplan ohne Aktivitäten-Liste konnte
  Buchungs-, Checklisten- oder Bearbeiten-Ansicht leer lassen — jetzt
  ausgeschlossen.
- Der Urlaubs-Concierge verwechselte "euro" und "hi" mitten in Wörtern wie
  "Europa" oder "Sushi" mit den gleichnamigen Themen — behoben, wie schon
  bei den in Ausgabe 1 genannten Verwechslungen bei Reisezielen und
  Verkehrsmitteln.

---

*Wie in Ausgabe 1: keine neue Funktion dabei, nur Korrekturen an etwas,
das vorher nicht ehrlich oder nicht zuverlässig genug war.*

### Wichtige Randnotiz: Sprachfunktion jetzt ohne bekannten Blocker

Der eigene Bericht vom 03./04.09. hatte zwei konkrete, technische Gründe
genannt, die gegen eine Bewerbung von "sprich einfach mit Travix"
sprachen — Ausgabe 1 (05.09.) vermerkte, dass einer davon (hängender
Mikrofon-Knopf, `acc9ae8`) behoben war, der zweite (fehlender Stopp-Knopf
für die Vorlesen-Funktion, ursprünglich Auto-Fix-PR #16) aber weiterhin
offen sei.

Heute per `git show ac0e188` sowie `git merge-base --is-ancestor ac0e188
HEAD` geprüft: **auch dieser zweite Grund ist jetzt behoben und in `main`
gemergt** (06.09., direkt gegen den aktuellen Stand umgesetzt statt den
inzwischen zu stark divergierten alten PR-Branch zu übernehmen — Details
in `it-chef-auto-log.md`, 06.09. "weiterer Lauf"). Konkret: `stopSpeaking()`
wird jetzt beim Ausschalten der Sprachausgabe, bei "Neu starten"/"Neue
Reise planen" und beim Verlassen der Chat-Seite zuverlässig aufgerufen,
mit drei Regressionstests abgesichert — vorher lief eine einmal gestartete
Vorlesung in allen drei Fällen unkontrolliert bis zum Ende weiter.

**Was das für die bisherige Zurückhaltung bedeutet:** Beide ursprünglich
genannten technischen Gründe gegen eine Bewerbung der Vorlesen-Funktion
sind damit ausgeräumt. Das ist eine neue, für Ni relevante Information —
deshalb hier vermerkt und zusätzlich in
`marketing/freigabe-uebersicht.md` als Statusänderung festgehalten. Es ist
bewusst **kein** Anlass für dieses Dokument, selbst ein eigenes
Content-Stück zur Sprachfunktion zu verfassen: das wäre ein neuner
Social-Post bzw. ein neuner Changelog-Anlass mitten in derselben
unbeantworteten Kanal-/Format-Frage, an die sich der autonome Lauf seit
dem 20.08. bewusst hält (siehe `marketing-chef-auto-log.md`). Die
Vorlesen-Funktion ist damit lediglich als *bereit, sobald ein Kanal oder
eine Ausgabe dafür ansteht* vorgemerkt — z. B. als eigener Punkt in einer
dritten Mini-Changelog-Ausgabe oder als Ergänzung zu einem künftigen
Social-Post, sobald Ni eine der drei alten Fragen beantwortet.

### Für Ni: keine neue Frage, nur ein Statusupdate

Ausgabe 2 hängt an derselben vierten Frage wie Ausgabe 1 (Soll die
Footer-Seite überhaupt gebaut werden?) — keine zusätzliche Entscheidung
nötig, nur zur Kenntnis: der Kandidatentopf für künftige Ausgaben wächst
weiter, und die Sprachfunktion hat seit heute keinen bekannten technischen
Blocker mehr (bleibt aber an die drei alten Fragen gebunden, bevor daraus
eigener Content wird).
