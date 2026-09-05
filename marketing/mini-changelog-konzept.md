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
