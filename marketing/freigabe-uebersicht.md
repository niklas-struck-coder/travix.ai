# Freigabe-Übersicht — was liegt bereit, was blockiert (Stand 2026-09-23)

Dieses Dokument sortiert die inzwischen acht fertigen Entwürfe in
`marketing/`, damit die eigentliche Bremse (nicht neue Ideen, sondern
Freigabe/Priorisierung durch Ni) leichter zu lösen ist. Erstellt/
aktualisiert werden nur diese Übersicht bzw. neue Entwürfe, nichts wird
gepostet oder verändert.

## Update 2026-09-23: zwei neue Tier-4-Kandidaten (misleading CTA nach Abschließen ausgeblendet, "Details ansehen" für abgeschlossene Reiseentwürfe), zwei role="alert"-Fixes bewusst ausgeschlossen, alle vier Fragen weiterhin offen

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`d672e8e` (22.09., reiner Übersichts-Lauf) hängengeblieben, dessen Inhalt
laut `freigabe-chef-log.md` bereits vollständig in `main` gemergt war —
der Branch war also nur noch veraltet, nicht mehr in Arbeit. `origin/main`
(`5df2b99`) per Fast-Forward-Merge in diesen Branch eingebracht, bevor der
eigentliche Lauf begann.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 22.09., keine neue
Antwort zu Kanal/6.2/Format/Mini-Changelog), `ZEITPLAN.md` (6.2, Zeile
1475, weiterhin `[ ]`) oder diesem Dokument seit dem 22.09. Keine neuen
Kanal-Links (`grep` nach `linkedin.com`/`instagram.com`/`tiktok.com` in
`src/` und `index.html` liefert weiterhin keinen Treffer), kein
`changelog`-Treffer in `src/routes.tsx`. Alle vier Fragen bleiben offen —
jetzt seit über fünf Wochen.

**`git log dc451a8..origin/main` zeigt (nach Abzug bereits als
Berichte/Logs bekannter Commits) mehrere neue Produkt-Codeänderungen, die
zum Zeitpunkt des 22.09.-Laufs auf `it-chef/auto` noch nicht in `main`
gemergt waren (der damalige Lauf hatte das für PR #22 bereits explizit
vermerkt) und erst mit dem Merge `561228a`/`8603f97` hier ankommen — jede
einzeln per `git show` geprüft:**
- `5575e5b` (IT-Chef Auto, Vorschlag 2 aus `reports/support-chef.md`,
  21.09.): Der hervorgehobene "Planung fortsetzen"-Button auf
  `/reiseentwuerfe` wurde bisher auf jeder Karte angezeigt — auch auf
  einer gerade eben über den Bestätigungsdialog abgeschlossenen. Ein
  Klick führte zurück in den Chat, obwohl es für einen abgeschlossenen
  Entwurf nichts mehr "fortzusetzen" gab — ein aktiv wirkender CTA, der
  ins Leere lief. Button steht jetzt hinter derselben
  `draft.status !== 'finalized'`-Bedingung wie Pausieren/Abschließen im
  selben Markup. **Neunzehnter Tier-4-Kandidat** — passt direkt in die
  bereits mehrfach gezählte "Reiseentwürfe-Konsistenz"-Fundgruppe
  (Löschbestätigung, Abschließen-Bestätigung): eine Karte soll nur
  Aktionen anbieten, die für ihren Status auch wirklich etwas bewirken.
- `65fb64d` (IT-Chef Auto, Support-Chef-Folgefund vom 22.09., Vorschlag 1):
  Nachdem `5575e5b` den "Planung fortsetzen"-Button für abgeschlossene
  Entwürfe ausgeblendet hatte, blieb einer finalized-Karte gar keine
  sinnvolle Aktion mehr übrig außer Löschen. Neuer "Details
  ansehen"-Button (nur bei `status=finalized`) öffnet einen read-only
  Dialog mit den vorhandenen Trip-Daten, mechanisch aus denselben Icon-/
  Label-Zeilen wie `TripSummaryCard.tsx`/`Buchung.tsx` zusammengesetzt.
  **Zwanzigster Tier-4-Kandidat** — direkte Fortsetzung derselben
  Konsistenz-Story wie `5575e5b`: aus einer Sackgasse (Karte ohne jede
  Aktion) wird eine ehrliche, tatsächlich nutzbare Aktion.
- `e484e7b` (21.09.) und `ccebd3b` (21.09., fünfter Lauf): `role="alert"`
  auf die Fehlerzustände von `FlightResults.tsx`/`HotelResults.tsx` bzw.
  `Flugsuche.tsx`/`Hotelsuche.tsx` ergänzt — Screenreader-Nutzer:innen
  bekommen einen Suchfehler jetzt automatisch angekündigt. **Bewusst
  nicht** als Tier-4-Kandidaten aufgenommen: reine
  Screenreader-Ankündigungs-Fixes ohne die "Ehrlichkeit/Vertrauen für
  sehende Nutzer:innen"-Erzählung dieses Formats — exakt dieselbe
  Begründung wie bei den bereits ausgeschlossenen `a21ae7c`/`67b9bdb`
  (`role="status"`, 21.09.) und den übrigen Accessibility-Ausschlüssen.
- `4da7308` (22.09., vierter Lauf) und `c56f725` (23.09.,
  Testabdeckung `utils.test.ts`): keine Produkt-Codeänderung — reine
  Log-Einträge bzw. reine Testabdeckung für bereits bestehendes,
  unverändertes Verhalten (per `git show --stat` verifiziert, kein
  Verhaltensunterschied). Wie bei allen früheren reinen Testdatei-
  Nachzügen nicht als Kandidat gezählt.
- `6fe4ac3`, `08540af` (23.09., zweiter/dritter Lauf): laut
  Commit-Beschreibung "kein sicherer Punkt gefunden" — per `git show
  --stat` bestätigt, dass nur `it-chef-auto-log.md` geändert wurde.

Die übrigen Commits im Bereich (mehrere Support-/Marketing-/IT-Chef-
Berichte vom 21./22.09., zwei Daily-Status-Updates, mehrere
Freigabe-Chef-Logs, Merge-Commits der drei Auto-Branches sowie der eigene
vorherige Auto-Lauf-Commit `d672e8e`) enthalten keine weitere, für dieses
Format relevante Codeänderung — jeweils per `git show --stat` geprüft
(ausschließlich `reports/*.md`, `status.md`, `*-log.md` betroffen).

**Damit wächst der Kandidatentopf von eins (Stand 22.09.) auf drei** —
weiterhin klar unter der Achter-Schwelle, die Ausgabe 2/3/4 ausgelöst hat,
und auch unter der Menge (vier), die selbst am 06.09. noch als "nicht
ausreichend" bewertet wurde. Keine fünfte Mini-Changelog-Ausgabe heute.

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang —
nichts gepostet oder verändert. Keine erfundenen Kennzahlen: beide neuen
Kandidaten stammen aus einzeln per `git show` verifizierten, bereits in
`main` gemergten Commits; die beiden Ausschlüsse (role="alert") sind
transparent mit derselben, bereits etablierten Begründung wie frühere
Accessibility-Ausschlüsse versehen. Keine offene
Positionierungs-Grundsatzfrage: dieser Lauf wendet nur die bereits
etablierte "Ehrlichkeit/Vertrauen"-Abgrenzung an, trifft keine neue
inhaltliche Entscheidung.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Eine neue eigenständige Content-/Mini-Changelog-Ausgabe — Kandidatentopf
  steht bei drei, klar unter dem etablierten Maßstab (acht).
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  weiterhin Live-Vorgänge bzw. an ungelöste Freigabe-Fragen gebunden.

**Umgesetzt:**
- `marketing/freigabe-uebersicht.md`: neues Update vom 23.09. (Prüfung der
  vier Fragen, Einordnung zweier neuer Commits als Tier-4-Kandidaten 19/20,
  zwei role="alert"-Fixes bewusst ausgeschlossen), "Nächster autonomer
  Lauf"-Abschnitt aktualisiert, Datum im Titel auf 23.09. gesetzt.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-22: keine neuen Tier-4-Kandidaten, alle vier Fragen weiterhin offen, reiner Übersichts-Lauf

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`7fe3f0c` (21.09., weiterer Lauf) hängengeblieben, dessen Inhalt laut
`freigabe-chef-log.md` ("2026-09-21 weiterer Lauf") bereits vollständig
in `main` gemergt war — der Branch war also nur noch veraltet, nicht mehr
in Arbeit. Neu von aktuellem `origin/main` (`6dae998`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 21.09.), `ZEITPLAN.md`
(6.2 in Zeile 1426 weiterhin `[ ]`) oder diesem Dokument seit dem 21.09.
Keine neuen Kanal-Links (`grep` nach `linkedin.com`/`instagram.com`/
`tiktok.com` in `src/` und `index.html` liefert weiterhin keinen
Treffer), kein `changelog`-Treffer in `src/routes.tsx`. Alle vier Fragen
bleiben offen — jetzt seit über fünf Wochen.

**`git log dc451a8..origin/main` zeigt neun neue Commits, keiner davon
content-relevant:** ein Support-Chef-Bericht (21.09., drei Fixes
bestätigt, zwei neue UX-Funde ohne eigene Codeänderung), der eigene
interaktive Marketing-Chef-Bericht vom 21.09., ein IT-Chef-Bericht
(21.09., beschreibt PR #22 — laut `git log main..origin/it-chef/auto`
weiterhin nicht in `main` gemergt, also für diesen Lauf nicht zählbar),
ein Daily-Status-Update, ein weiteres Freigabe-Chef-Log sowie zwei
Merge-Commits (Marketing-/Support-Chef-Auto-Log-Stände) und ein
Support-Chef-Auto-Log-Eintrag ohne eigene Codeänderung. Jeder Commit per
`git show --stat` geprüft: ausschließlich `reports/*.md`, `status.md`,
`freigabe-chef-log.md`, `marketing-chef-auto-log.md` und
`support-chef-auto-log.md` geändert, kein einziger Treffer unter `src/`.
Keine einzige neue, per `git show` verifizierte Produkt-Codeänderung seit
dem letzten Lauf (`dc451a8`, 21.09.), also kein neunzehnter
Tier-4-Kandidat — der Kandidatentopf bleibt bei eins (seit dem
21.09.-Update).

**Randnotiz zu `it-chef/auto`:** Auf diesem noch nicht gemergten Branch
liegen laut `git log main..origin/it-chef/auto` bereits zwei weitere,
potenziell relevante Fixes (role="alert" bei fehlgeschlagener Flug-/
Hotelsuche, "Planung fortsetzen" bei abgeschlossenen Entwürfen
ausgeblendet) — wie bisher gilt die etablierte Regel, nur bereits in
`main` gemergte Commits zu zählen (siehe frühere Updates, z. B. 21.09.
zu PR #22). Werden für einen künftigen Lauf vorgemerkt, sobald
Freigabe-Chef sie gemergt hat.

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang —
nichts gepostet oder verändert. Keine erfundenen Kennzahlen nötig, da es
keinen neuen Punkt gibt, der eine Zahl bräuchte. Keine offene
Positionierungs-Grundsatzfrage: dieser Lauf trifft keine neue inhaltliche
Entscheidung, sondern dokumentiert nur den unveränderten Stand.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Eine neue eigenständige Content-/Mini-Changelog-Ausgabe — Kandidatentopf
  steht weiterhin bei eins, klar zu wenig nach dem etablierten Maßstab
  (acht).
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  weiterhin Live-Vorgänge bzw. an ungelöste Freigabe-Fragen gebunden.

**Umgesetzt:**
- `marketing/freigabe-uebersicht.md`: neues Update vom 22.09. (Prüfung
  der vier Fragen, neun neue Commits geprüft, keiner content-relevant),
  Datum im Titel auf 22.09. gesetzt.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-21: ein neuer Tier-4-Kandidat (Reiseentwürfe-Abschließen-Bestätigung), zwei Accessibility-Fixes bewusst ausgeschlossen, alle vier Fragen weiterhin offen

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`63c255a` (18.09., reiner Übersichts-Lauf) hängengeblieben, dessen Inhalt
laut `freigabe-chef-log.md` ("2026-09-21 früher Nacht-Check") bereits
vollständig in `main` gemergt war — der Branch war also nur noch veraltet,
nicht mehr in Arbeit. Neu von aktuellem `origin/main` (`b5078f8`) aus
angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 18.09.), `ZEITPLAN.md`
(6.2 weiterhin `[ ]`) oder diesem Dokument seit dem 18.09. Keine neuen
Kanal-Links (`grep` nach `linkedin.com`/`instagram.com`/`tiktok.com` in
`src/` und `index.html` liefert weiterhin keinen Treffer), kein
`changelog`-Treffer in `src/routes.tsx`. Alle vier Fragen bleiben offen —
jetzt seit über fünf Wochen.

**`git log a924d6f..origin/main` zeigt 28 neue Commits, neun davon mit
echter Produkt-Codeänderung (allesamt vom autonomen IT-Chef-Lauf,
18.-21.09.), per `git show` einzeln geprüft:**
- `4123ccc` (21.09., früher IT-Chef-Lauf desselben Tages): Der
  "Abschließen"-Button auf `/reiseentwuerfe` setzte den Status einer
  Entwurfskarte bisher sofort und endgültig, ohne Rückfrage — anders als
  "Löschen" auf derselben Karte, das bereits über den etablierten
  Bestätigungsdialog abgesichert ist. Behebt exakt Vorschlag 3 aus
  `reports/support-chef.md` (18.09.). **Achtzehnter Tier-4-Kandidat** —
  dieselbe Fundgruppe wie die bisherigen Löschbestätigungs-Fixes
  (Preisalarme/Favoriten/Angebote/Aktivitäten/Warenkorb/Reiseentwürfe-
  Löschen/EditMode-Aktivität): ein irreversibler Klick bekommt eine
  Rückfrage, die er vorher nicht hatte.
- `6a12606` (21.09.): Behebt Vorschlag 2 aus demselben Support-Chef-
  Bericht (18.09.) — unterscheidbare `aria-label`s für gleichnamige
  Aktivitäten in `EditMode.tsx`. **Bewusst nicht** als Tier-4-Kandidat
  aufgenommen: reiner Barrierefreiheits-Fix (Screenreader-
  Unterscheidbarkeit), ohne die "Ehrlichkeit/Vertrauen"-Erzählung dieses
  Formats — gleiche Begründung wie beim strukturell identischen
  `b07e3aa` (18.09., dieselbe Art Fix für `Reiseentwuerfe.tsx`, damals
  schon nicht gezählt) und den früher ausgeschlossenen `2d0f024`/
  `2f110f7`/`538bb25`/`17b61f5`.
- `a21ae7c`, `67b9bdb` (21.09.): `role="status"` auf die Lade-/Denk-
  Hinweise in Flug-/Hotel-/Zugergebnissen, KI-Chat und Urlaubsmodus
  ergänzt. **Bewusst nicht** aufgenommen — reine
  Screenreader-Ankündigungs-Fixes, gleiche Begründung wie oben.
- `7b2cf09` (18.09.): Fokus springt nach mobiler Menü-Navigation jetzt
  zur `<h1>` der neuen Seite statt zum Hamburger-Knopf zurück — behebt
  Vorschlag 1 aus demselben Support-Chef-Bericht. **Bewusst nicht**
  aufgenommen — Fokus-Steuerung, dieselbe Ausschlussgruppe wie der
  bereits ausgeschlossene `2d0f024` (15.09., Fokus-Rückgabe nach
  Dialogen).
- `03a1e6b` (18.09.): Fokus-Fallback-Parität `sheet.tsx`/`dialog.tsx`.
  **Bewusst nicht** aufgenommen — gleiche Gruppe wie oben.
- `5e8b07e` (18.09.): `clampGuestCount()`/`clampPassengerCount()` runden
  jetzt vor dem Clamp, schützen also zusätzlich gegen Nachkommazahlen wie
  "1.5". **Bewusst nicht** aufgenommen — reine Eingabevalidierung ohne
  Ehrlichkeits-/Vertrauens-Aussage, gleiche Begründung wie frühere
  Validierungs-Ausschlüsse.
- `577c4ef` (18.09.): `TrainCard.tsx` bekommt eine `selected`-Prop analog
  zu `FlightCard`/`HotelCard`. **Bewusst nicht** aufgenommen — `TrainCard`/
  `TrainResults` sind laut `ZEITPLAN.md` (5.7) weiterhin in keine Seite
  eingebunden, also kein echter Nutzerpfad, gleiche Begründung wie beim
  am 09.09. ausgeschlossenen `b5fac18`.
- `a70a9ce` (21.09.): `Flugsuche.tsx` zeigt bei leeren Suchergebnissen
  jetzt "Keine Flüge gefunden" statt des generischen Titels, analog zu
  `Hotelsuche.tsx`/`FlightResults.tsx`. **Bewusst nicht** aufgenommen —
  reine Text-/Konsistenzkorrektur ohne falsche Aussage, die vorher
  korrigiert werden musste (der generische Text war nicht falsch, nur
  unspezifisch) — gleiche Begründung wie beim am 13./14.09.
  ausgeschlossenen `538bb25` (Sprachkonsistenz).

Die übrigen 19 Commits (mehrere Freigabe-Chef-Logs, zwei Merge-Commits,
ein Support-Chef-Bericht vom 18.09. mit den oben verarbeiteten vier
Vorschlägen, der eigene interaktive Marketing-Chef-Bericht vom 18.09.,
ein IT-Chef-Bericht ohne neuen Bug, ein Daily-Status-Update, ein
Support-Chef-Auto-Log samt Main-Merge sowie zwei IT-Chef-Auto-Log-
Einträge ohne eigenen Codepunkt) enthalten keine weitere, für dieses
Format relevante Codeänderung.

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang —
nichts gepostet oder verändert. Keine erfundenen Kennzahlen: der neue
Kandidat stammt aus einem einzeln per `git show` verifizierten, bereits
in `main` gemergten Commit; alle acht Ausschlüsse sind transparent
begründet statt stillschweigend übergangen. Keine offene
Positionierungs-Grundsatzfrage: dieser Lauf wendet nur die bereits
etablierte "Ehrlichkeit/Vertrauen"-Abgrenzung an, trifft keine neue
inhaltliche Entscheidung.

**Warum (noch) keine fünfte Mini-Changelog-Ausgabe:** Der Kandidatentopf
war seit Ausgabe 4 (17.09.) leer und steht jetzt bei **eins** — deutlich
unter der Achter-Schwelle, die Ausgabe 2/3/4 ausgelöst hat, und auch unter
der Menge (vier), die selbst am 06.09. noch als "nicht ausreichend"
bewertet wurde.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein neues eigenständiges Social-Content-Stück bzw. eine fünfte
  Mini-Changelog-Ausgabe — Kandidatentopf steht erst bei eins, klar zu
  wenig nach dem etablierten Maßstab.
- Die beiden weiterhin offenen Support-Chef-Punkte vom 18.09. (mobiles
  Menü, `/hilfe`-Seite) als Tier-4-Kandidaten zählen — der Menü-Fund
  wurde zwar behoben (`7b2cf09`), gehört aber zur ausgeschlossenen
  Fokus-Gruppe; die Hilfe-Seite ist weiterhin unverändert offen.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  weiterhin Live-Vorgänge bzw. an ungelöste Freigabe-Fragen gebunden.

**Umgesetzt:**
- `marketing/freigabe-uebersicht.md`: neues Update vom 21.09. (Prüfung
  der vier Fragen, Einordnung von neun neuen Commits, davon einer als
  achtzehnter Tier-4-Kandidat und acht bewusst ausgeschlossen), "Nächster
  autonomer Lauf"-Abschnitt aktualisiert, Datum im Titel auf 21.09.
  gesetzt.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-18: keine neuen Tier-4-Kandidaten, alle vier Fragen weiterhin offen, reiner Übersichts-Lauf

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`a924d6f` (17.09., vierte Mini-Changelog-Ausgabe) hängengeblieben, dessen
Inhalt laut `freigabe-chef-log.md` ("2026-09-17 6-Uhr-Check") bereits
vollständig in `main` gemergt war — der Branch war also nur noch
veraltet, nicht mehr in Arbeit. `origin/main` (`f84399b`) per
Fast-Forward-Merge in diesen Branch eingebracht, bevor der eigentliche
Lauf begann.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 16.09.), `ZEITPLAN.md`
(6.2 in Zeile 1285 weiterhin `[ ]`) oder diesem Dokument seit dem 17.09.
Keine neuen Kanal-Links (`grep` nach `linkedin.com`/`instagram.com`/
`tiktok.com` in `src/` und `index.html` liefert weiterhin keinen
Treffer), kein Commit zu einer IT-Chef-Umsetzung der
Mini-Changelog-Seite (kein `changelog`-Treffer in `src/routes.tsx`).
Alle vier Fragen bleiben offen — jetzt seit über fünf Wochen.

**`git log a924d6f..origin/main` zeigt acht neue Commits, keiner davon
content-relevant:** ein Support-Chef-Bericht (17.09., zwei neue
UX-Funde zu Reiseentwürfen — doppelte aria-labels, Abschließen ohne
Rückfrage — noch nicht von IT-Chef behoben, werden laut Selbstbeschränkung
dieses Dokuments erst bei tatsächlicher Behebung zu Kandidaten), der
eigene interaktive Marketing-Chef-Bericht vom 17.09., ein IT-Chef-Bericht
(17.09., kein neuer Bug im PR-Kanal), ein Daily-Status-Update, zwei
Freigabe-Chef-Logs (17.09. 6-Uhr-Check und 18.09. früher Nacht-Check) und
ein Support-Chef-Auto-Log samt zugehörigem Main-Merge (17.09.,
Reiseentwürfe-Analyse — dieselben zwei Funde wie im Bericht oben, reine
Analyse ohne Codeänderung). Jeder Commit per `git show --stat` geprüft:
ausschließlich `reports/*.md`, `status.md`, `freigabe-chef-log.md` und
`support-chef-auto-log.md` geändert, kein einziger Treffer unter `src/`.
Keine einzige neue, per `git show` verifizierte Produkt-Codeänderung seit
dem letzten Lauf, also kein achtzehnter Tier-4-Kandidat — der
Kandidatentopf bleibt bei null (seit Ausgabe 4 am 17.09. geleert).

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang —
nichts gepostet oder verändert. Keine erfundenen Kennzahlen nötig, da es
keinen neuen Punkt gibt, der eine Zahl bräuchte. Keine offene
Positionierungs-Grundsatzfrage: dieser Lauf trifft keine neue inhaltliche
Entscheidung, sondern dokumentiert nur den unveränderten Stand.

## Update 2026-09-17: vier neue Tier-4-Kandidaten (EditMode-Löschbestätigung für Aktivitäten, Mikrofon-Stopp bei zweitem Klick, Reiseentwurf-Löschbestätigung, formatDuration-Tagesanzeige), ein Screenreader-Fix bewusst ausgeschlossen — Topf erreicht mit neun die Achter-Schwelle, vierte Mini-Changelog-Ausgabe geschrieben, alle vier Fragen weiterhin offen

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`7e97458` (16.09., letzter Freigabe-Chef-Merge) hängengeblieben.
`origin/main` (`44ec538`) per Fast-Forward-Merge in diesen Branch
eingebracht, bevor der eigentliche Lauf begann — kein eigener
Merge-Commit nötig.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 16.09.), `ZEITPLAN.md`
(6.2 in Zeile 1285 weiterhin `[ ]`) oder diesem Dokument seit dem 16.09.
Keine neuen Kanal-Links (`grep` nach `linkedin.com`/`instagram.com`/
`tiktok.com` in `src/` und `index.html` liefert weiterhin keinen
Treffer), kein Commit zu einer IT-Chef-Umsetzung der
Mini-Changelog-Seite (kein `changelog`-Treffer in `src/routes.tsx`).
Alle vier Fragen bleiben offen — jetzt seit über vier Wochen.

**`git log 811302a..origin/main` zeigt elf neue Commits, fünf davon mit
echter Produkt-Codeänderung, per `git show` einzeln geprüft:**
- `e87973b` (16.09. spät): der am 16.09. bereits vorgemerkte
  `formatDuration()`-Fund (PR #21) ist jetzt gemerged — ISO-Dauern mit
  Tages-Komponente (`P1DT2H30M`) erschienen bei Flug-/Zugverbindungen ab
  24 Stunden bisher als roher Code statt einer lesbaren Zeit. **Vierzehnter
  Kandidat** — passt in dieselbe "echte statt verwirrende Angabe"-Gruppe
  wie die früheren Fehlermeldungs- und Preisformat-Funde.
- `d61cc25` (16.09. spät): der Papierkorb-Button im Bearbeiten-Dialog
  einer Reise löschte eine Aktivität bisher sofort und endgültig, anders
  als dasselbe Löschen auf `/aktivitaeten` (Kandidat 9). Übernimmt exakt
  dasselbe Bestätigungsdialog-Muster. **Fünfzehnter Kandidat** —
  dieselbe Fundgruppe wie die Löschbestätigungen auf Preisalarme-/
  Favoriten-/Angebote-/Aktivitäten-/Warenkorb-Seite.
- `f57c31c` (17.09.): ein zweiter Klick auf das Mikrofon-Symbol in
  `ChatInput.tsx` tat bisher nichts — die laufende Aufnahme lief weiter,
  weil die `SpeechRecognition`-Instanz verworfen statt gehalten wurde.
  Jetzt beendet ein zweiter Klick die Aufnahme zuverlässig. **Sechzehnter
  Kandidat** — nach Vorschlag 2 aus `reports/support-chef.md` (16.09.),
  derselbe Bug-Typ (stille Fehlaktion durch einen Bug) wie die bereits
  gezählten `resetChat()`-/IME-Enter-Funde.
- `27cdc50` (17.09.): dasselbe Bestätigungsdialog-Muster wie bei
  Preisalarme-/Favoriten-/Angebote-/Aktivitäten-/Warenkorb-Seite jetzt
  auch für Reiseentwurf-Karten auf `/reiseentwuerfe` übertragen — Löschen
  war bisher sofort und endgültig. **Siebzehnter Kandidat.**
- `17b61f5` (17.09.): die "Heute"-Zelle im Kalendergitter war bisher rein
  farblich markiert, ohne Text-Alternative für Screenreader — jetzt mit
  `aria-current="date"` und einem sr-only-Zusatz behoben. **Bewusst nicht**
  in den Tier-4-Kandidatentopf aufgenommen: echter
  Barrierefreiheits-Fix, aber ohne die "Ehrlichkeit/Vertrauen"-Erzählung
  dieses Formats — gleiche Begründung wie bei den bereits ausgeschlossenen
  `2d0f024`, `2f110f7` und `538bb25`.

**Damit reicht der Kandidatentopf von neun** (Kandidaten 9-17, davon
einer — die IME-Enter-Korrektur — weiterhin mit Vorbehalt) **die
Achter-Schwelle**, die bereits Ausgabe 2 und 3 ausgelöst hat — deutlich
über der Menge, die am 06.09. noch als "nicht ausreichend" galt. Alle
neun sind seit heute in **Ausgabe 4** des Mini-Changelogs verarbeitet
(siehe `marketing/mini-changelog-konzept.md` und Tier 5 unten) — der
Kandidatentopf ist damit wieder leer, neue Funde sammeln sich ab jetzt
für eine mögliche fünfte Ausgabe.

## Update 2026-09-16: zwei bis drei neue Tier-4-Kandidaten (loadStoredChat()-Normalisierung, resetChat()-Robustheit, mit Vorbehalt die IME-Enter-Korrektur), ein Fokus-Fix bewusst als reiner Barrierefreiheits-Fund ausgeschlossen — Topf damit bei fünf, weiterhin keine vierte Mini-Changelog-Ausgabe, alle vier Fragen weiterhin offen

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`4832eed` (15.09., zwei neue Tier-4-Kandidaten) hängengeblieben, dessen
Inhalt laut Freigabe-Chef-Log vom 16.09. bereits vollständig in `main`
gemergt war — der Branch war also nur noch veraltet, nicht mehr in
Arbeit. `origin/main` (`901993e`) per Fast-Forward-Merge in diesen Branch
eingebracht, bevor der eigentliche Lauf begann.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 15.09., keine neue
Antwort zu Kanal/Format/Start), `ZEITPLAN.md` (6.2 in Zeile 1222
weiterhin `[ ]`) oder diesem Dokument seit dem 15.09. Keine neuen
Kanal-Links (`grep` nach `linkedin.com`/`instagram.com`/`tiktok.com` in
`src/` und `index.html` liefert weiterhin keinen Treffer), kein Commit zu
einer IT-Chef-Umsetzung der Mini-Changelog-Seite (kein `changelog`-Treffer
in `src/routes.tsx`). Alle vier Fragen bleiben offen — laut dem eigenen
interaktiven Bericht vom 15.09. (`reports/marketing-chef.md`) jetzt seit
rund vier Wochen.

**`git log 4832eed..origin/main` zeigt 24 neue Commits, vier davon mit
echter Produkt-Codeänderung, per `git show` einzeln geprüft:**
- `2d0f024` (15.09. spät): Behebt Support-Chef-Vorschlag 1 vom 15.09. —
  nach dem Bestätigen eines Lösch-Dialogs (Preisalarme/Favoriten/
  Angebote/Aktivitäten/Warenkorb) landete der Fokus auf `<body>`, weil
  Radix' eingebaute Fokus-Rückgabe erfolglos versuchte, das inzwischen
  entfernte Element erneut zu fokussieren. `DialogContent` übernimmt die
  Fokus-Steuerung jetzt zentral selbst. **Bewusst nicht** in den
  Tier-4-Kandidatentopf aufgenommen: echter, wichtiger
  Barrierefreiheits-Fix, aber ohne die "Ehrlichkeit/Vertrauen"-Erzählung
  dieses Formats (falsche Information, ungeschützter Datenverlust,
  irreführende Nachrichten) — gleiche Begründung wie bei den bereits am
  13./14.09. ausgeschlossenen `2f110f7` (reduzierte Bewegung) und
  `538bb25` (Schließen-Button-Übersetzung).
- `46e586b` (15.09. spät): `loadStoredChat()` normalisierte bislang nur
  `trip.activities` gegen fehlende Felder in alten/korrupten
  `localStorage`-Daten, nicht aber `messages` und `quickReplies` — beide
  wurden ungeschützt gelesen und konnten bei fehlendem Feld einen
  `TypeError` auslösen. Gleiches, bereits etabliertes Muster jetzt auch
  auf diese zwei Felder angewendet. **Elfter Tier-4-Kandidat** — inhaltlich
  dieselbe Fundgruppe wie der bereits am 05./06.09. gezählte, in Ausgabe 2
  verarbeitete `activities`-Normalisierungs-Fix (PR #18): ein alter
  Reiseplan-Datensatz soll die App nicht zum Absturz bringen, sondern
  sauber weiterlaufen.
- `97f96ae` (16.09.): `resetChat()` rief `localStorage.removeItem(...)`
  bisher ungeschützt auf — anders als `saveStoredChat()`, das
  Schreibfehler bereits abfängt. Bei vollem Speicher, deaktiviertem
  Storage (privates Surfen) oder restriktiven Webviews hätte das den
  eigentlich rein im Speicher stattfindenden Reset mitten in der "Neu
  starten?"-Aktion abbrechen können. Neue `clearStoredChat()`-
  Hilfsfunktion nach demselben Try/Catch-Muster. **Zwölfter
  Tier-4-Kandidat** — dieselbe Fundgruppe wie der bereits in Ausgabe 2
  verarbeitete, am 05./06.09. gezählte Speicherfehler-Hinweis: ein
  einzelner Klick auf "Neu starten" soll zuverlässig funktionieren, statt
  bei bestimmten Browser-/Speicher-Konstellationen lautlos hängen zu
  bleiben.
- `5685f5c` (16.09.): `ChatInput.tsx` und `EditMode.tsx` prüften bei
  Enter bisher nur `event.key`, nicht `event.nativeEvent.isComposing`.
  Bei IME-Eingabe (z. B. Japanisch/Chinesisch/Koreanisch) löste das
  Bestätigen eines Zeichen-Kandidaten per Enter ein vorzeitiges Senden
  bzw. Anlegen mit unvollständigem Text aus. **Mit Vorbehalt als
  dreizehnter Tier-4-Kandidat eingeordnet:** anders als die übrigen
  Kandidaten geht es hier nicht um eine Ehrlichkeits-/Vertrauensaussage
  im engeren Sinn, sondern um denselben Bug-Typ wie die bereits gezählten
  Wortgrenzen-Fehler bei der Zielname-/Transportmittel-Erkennung — eine
  stille, vom Bug verursachte falsche Aktion (hier: verfrühtes Absenden
  unvollständigen Texts), die die Nutzerin nicht beabsichtigt hat. Sollte
  Ni diese Einordnung für zu weit gefasst halten, lässt sich der Punkt vor
  der nächsten Ausgabe jederzeit wieder herausnehmen, ohne dass das den
  Topf unter die Vierer-Schwelle vom 06.09. drückt.

Die restlichen 20 Commits ohne neue Content-Relevanz für dieses Format:
mehrere Freigabe-Chef-Logs (15./16.09., bestätigen nur Merge-Zustände),
ein IT-Chef-Auto-Log ("kein neuer sicherer Punkt gefunden", 16.09.), ein
Support-Chef-Bericht (15.09., bestätigt die komplette Fünf-Seiten-Liste
und meldet den oben behandelten Fokus-Fund), der eigene interaktive
Marketing-Chef-Bericht vom 15.09. (deckt sich inhaltlich mit diesem
Lauf), ein IT-Chef-Bericht (15.09., PR #20 eingeordnet), ein
Daily-Status-Update, ein zwischenzeitlich gemergter und wieder
revertierter Support-Chef-Merge (reiner Analyse-Log ohne Codeänderung,
laut `git status` nach dem Fast-Forward ohne Wirkung auf den aktuellen
Stand) sowie mehrere Support-Chef-Auto-Log-Einträge (09.-15.09., reine
UX-Analyse ohne eigene Codeänderung) und die zugehörigen
Main-Merge-Commits auf dem `support-chef/auto`-Branch.

**Warum sicher genug (für diese Übersichts-Ergänzung):** Reine
Übersichts-Ergänzung, kein Live-Vorgang — nichts gepostet oder
verändert. Keine erfundenen Kennzahlen: alle drei neuen Kandidaten
stammen aus einzeln per `git show` verifizierten, bereits in `main`
gemergten Commits, die Einordnung des dritten (IME-Fix) ist transparent
als Grenzfall gekennzeichnet statt stillschweigend gleichgesetzt. Keine
offene Positionierungs-Grundsatzfrage: wendet nur die bestehende
Positionierung ("Ehrlichkeit als Feature") an, entscheidet sie nicht neu.
Berührt keine der vier offenen Fragen an Ni.

**Warum (noch) keine vierte Mini-Changelog-Ausgabe:** Der Kandidatentopf
wächst von zwei (Stand 15.09.) auf fünf — klar unter der Menge (acht),
die Ausgabe 2 und 3 ausgelöst hat, und nur knapp über der Menge (vier),
die selbst am 06.09. noch ausdrücklich als "nicht ausreichend" bewertet
wurde. Selbst wenn der IME-Fix als zu weit gefasst wieder herausfallen
sollte, blieben es vier — weiterhin kein klarer Auslöser für eine vierte
Ausgabe nach dem etablierten Maßstab.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein elftes eigenständiges Social-Content-Stück — bleibt weiterhin an
  dieselben vier unbeantworteten Fragen gebunden.
- Eine vierte Mini-Changelog-Ausgabe schon jetzt schreiben — siehe oben,
  Kandidatentopf zu klein.
- Der Fokus-Verlust-Fix (`2d0f024`) als Tier-4-Kandidat — siehe oben,
  passt nicht zur Ehrlichkeits-/Vertrauens-Erzählung dieses Formats.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  weiterhin Live-Vorgänge bzw. an ungelöste Freigabe-Fragen gebunden.

**Umgesetzt:**
- `marketing/freigabe-uebersicht.md`: neues Update vom 16.09. (Prüfung
  der vier Fragen, Einordnung von zwei bis drei neuen Commits als
  Tier-4-Kandidaten elf bis dreizehn, ein Commit bewusst als
  Barrierefreiheits-Fund ausgeschlossen, Begründung warum noch keine
  vierte Ausgabe), "Nächster autonomer Lauf"-Abschnitt aktualisiert,
  Datum im Titel auf 16.09. gesetzt.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-15: zwei neue Tier-4-Kandidaten (Aktivitäten-/Warenkorb-Löschbestätigung, letzte zwei der Fünf-Seiten-Liste aus dem 13.09.-Support-Chef-Fund), Topf damit bei zwei — noch keine vierte Mini-Changelog-Ausgabe, alle vier Fragen weiterhin offen

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`95cfc90` (14.09., dritte Mini-Changelog-Ausgabe) hängengeblieben, dessen
Inhalt laut Freigabe-Chef-Log vom 14.09. bereits vollständig in `main`
gemergt war. Neu von aktuellem `origin/main` (`ccdf3de`) aus angelegt. Für
den Commit-Abgleich unten als Basislinie bewusst nicht `95cfc90` selbst
verwendet, sondern `66d3990` — der `origin/main`-Stand, auf dessen
Grundlage der 14.09.-Lauf seine Analyse gemacht und `567b9dc`/`0c2e802`/
`c79a5a9`/`2f110f7`/`538bb25` bereits eingeordnet hatte (drei davon als
Kandidaten 6-8 in Ausgabe 3 verarbeitet, zwei bewusst ausgeschlossen) —
so werden diese fünf nicht versehentlich ein zweites Mal gezählt, obwohl
sie technisch kein Vorfahre von `95cfc90` selbst sind (separate
`it-chef/auto`-Merge-Linie).

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 13.09. zum
Redaktionsschluss dieses Laufs, keine neue Antwort zu Kanal/Format/Start),
`ZEITPLAN.md` (6.2 weiterhin `[ ]`) oder diesem Dokument seit dem 14.09.
Keine neuen Kanal-Links (`grep` nach `linkedin.com`/`instagram.com`/
`tiktok.com` in `src/` und `index.html` liefert weiterhin keinen Treffer),
kein Commit zu einer IT-Chef-Umsetzung der Mini-Changelog-Seite (kein
`changelog`-Treffer in `src/routes.tsx`). Alle vier Fragen bleiben offen.

**`git log 66d3990..origin/main` zeigt 13 neue Commits, zwei davon mit
echter, für die Ehrlichkeits-/Vertrauens-Erzählung relevanter
Produkt-Codeänderung, per `git show` einzeln geprüft:**
- `c849a60` (14.09. spät): Überträgt das bereits am 14.09. für
  Preisalarme/Favoriten/Angebote etablierte Bestätigungsdialog-Muster
  ("… entfernen?" mit Abbrechen/destructive-Button, gleiche
  `Dialog`-Komponente wie beim "Neu starten?"-Dialog) auf die
  Aktivitäten-Seite (`removeActivity` in `Aktivitaeten.tsx`). **Neunter,
  eigenständiger Tier-4-Kandidat** seit Beginn der Zählung — eigene
  Seite, eigener Nutzerpfad, keine bloße Verfeinerung eines bereits
  gezählten Fixes. Zugehöriger Test in `Aktivitaeten.test.tsx` erweitert
  (Abbrechen verwirft die Löschung).
- `38a1f47` (14.09. spät): Überträgt dasselbe Muster auf die letzte
  verbleibende Seite aus der ursprünglichen Fünf-Seiten-Liste von
  `reports/support-chef.md` (13.09., Vorschlag 2): `Warenkorb.tsx`
  (`removeItem`). **Zehnter Tier-4-Kandidat.** Damit ist die dort
  gemeldete Liste (Preisalarme/Favoriten/Angebote/Aktivitäten/Warenkorb)
  jetzt vollständig abgearbeitet — ein sauberer Abschluss-Punkt für sich,
  unabhängig von der Kandidatenzählung.

Die restlichen 11 Commits ohne neue Content-Relevanz für dieses Format:
zwei Freigabe-Chef-Logs (14.09. Tages-Check, 15.09. früher Nacht-Check —
beide bestätigen nur Merge-Zustände, keine eigene Codeänderung), drei
IT-Chef-Auto-Log-Einträge ("kein neuer sicherer Punkt gefunden", 15.09.,
per `git show` verifiziert nur Log-Datei geändert), ein
Support-Chef-Bericht (14.09.: drei von fünf Löschbestätigungs-Fixes
bestätigt, Hilfe-Seite und Warenkorb-Sackgasse weiterhin offen — beides
keine neue Codeänderung, nur Beobachtung), der eigene interaktive
Marketing-Chef-Bericht vom 14.09. (deckt sich inhaltlich mit diesem
Lauf, siehe unten), ein IT-Chef-Bericht (14.09.: breite Prüfung, kein
neuer Bug, Löschbestätigung auf Aktivitäten/Warenkorb bewusst nicht
parallel gefixt — genau die zwei Seiten, die dieser Lauf jetzt als
umgesetzt vorfindet), ein Daily-Status-Update sowie der bereits in
Ausgabe 3 verarbeitete Merge-Commit `78f4c0b` und der eigene vorherige
Auto-Lauf-Commit `95cfc90` selbst.

**Warum sicher genug (für diese Übersichts-Ergänzung):** Reine
Übersichts-Ergänzung, kein Live-Vorgang — nichts gepostet oder
verändert. Keine erfundenen Kennzahlen: beide neuen Kandidaten stammen
aus einzeln per `git show` verifizierten, bereits in `main` gemergten
Commits. Keine offene Positionierungs-Grundsatzfrage: wendet nur die
bestehende Positionierung ("Ehrlichkeit als Feature") an, entscheidet sie
nicht neu. Berührt keine der vier offenen Fragen an Ni.

**Warum (noch) keine vierte Mini-Changelog-Ausgabe:** Der Kandidatentopf
war nach Ausgabe 3 leer (siehe Update 2026-09-14) und steht jetzt bei
zwei — klar unter der Menge (vier), die selbst am 06.09. noch als "nicht
ausreichend" bewertet wurde, und weit unter der Achter-Schwelle, die
Ausgabe 2 und 3 ausgelöst hat. Der Umstand, dass mit `38a1f47` die
komplette Fünf-Seiten-Liste aus dem 13.09.-Support-Chef-Fund
abgearbeitet ist, ist zwar ein inhaltlicher Meilenstein, aber kein Grund,
den eigenen Mengen-Maßstab aufzuweichen — sonst würde jede einzelne
neue Löschbestätigung künftig eine eigene Mini-Ausgabe auslösen, was dem
Grundgedanken ("Zusammenfassung statt Einzelmeldungen") widerspricht.

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein neuntes eigenständiges Social-Content-Stück — bleibt weiterhin an
  dieselben vier unbeantworteten Fragen gebunden.
- Eine vierte Mini-Changelog-Ausgabe schon jetzt schreiben — siehe oben,
  Kandidatentopf zu klein.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  weiterhin Live-Vorgänge bzw. an ungelöste Freigabe-Fragen gebunden.

## Update 2026-09-14: dritte Mini-Changelog-Ausgabe geschrieben (drei neue Tier-4-Kandidaten, Topf erreicht die Achter-Schwelle von Ausgabe 2), zwei Commits bewusst ausgeschlossen, alle vier Fragen weiterhin offen

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`1af1fb5` (13.09.) hängengeblieben, dessen Inhalt laut `git log
origin/main ^origin/marketing-chef/auto` bereits vollständig in `main`
gemergt war — der Branch war also nur noch veraltet, nicht mehr in Arbeit.
Neu von aktuellem `origin/main` (`66d3990`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 12.09., seit dem
letzten Lauf unverändert), `ZEITPLAN.md` (6.2 weiterhin `[ ]`) oder diesem
Dokument seit dem 13.09. Keine neuen Kanal-Links (`grep` nach
`linkedin.com`/`instagram.com`/`tiktok.com` in `src/` und `index.html`
liefert weiterhin keinen Treffer), kein Commit zu einer IT-Chef-Umsetzung
der Mini-Changelog-Seite (kein `changelog`-Treffer in `src/routes.tsx`).
Alle vier Fragen bleiben offen.

**`git log 1af1fb5..origin/main` zeigt 11 neue Commits, fünf davon mit
echter Produkt-Codeänderung, per `git show` einzeln geprüft:**
- `567b9dc` (13.09. spät): Der Entfernen-Button auf `/preisalarme`
  löschte einen Preisalarm bisher mit einem Klick sofort und endgültig,
  ohne Bestätigung oder Rückgängig. Fix nach dem bereits etablierten
  Bestätigungsdialog-Muster aus dem "Neu starten?"-Dialog im Chat (gleiche
  Dialog-Komponente statt eines neu erfundenen Rückgängig-Mechanismus).
  **Neuer, eigenständiger sechster Tier-4-Kandidat** — echter,
  angebundener Nutzerpfad, passt zur selben Vertrauens-/Sorgfalts-
  Fundgruppe wie der bereits gezählte "Neu starten"-Dialog (dritter
  Kandidat, siehe Tier 4 unten).
- `0c2e802` (14.09.): Überträgt dasselbe Bestätigungsdialog-Muster auf die
  Favoriten-Seite (`removeFavorite`). **Siebter Tier-4-Kandidat** —
  eigene Seite, eigener Nutzerpfad, keine bloße Verfeinerung des
  Preisalarm-Fixes.
- `c79a5a9` (14.09.): Überträgt dasselbe Muster auf die Angebote-Seite.
  **Achter Tier-4-Kandidat** — ebenfalls eigene Seite, eigener
  Nutzerpfad.
- `2f110f7` (13.09.): Seitenübergänge (`PageTransition.tsx`) respektieren
  jetzt `prefers-reduced-motion`. Echter, verifizierter
  Barrierefreiheits-Fix — **bewusst nicht** in den Tier-4-Kandidatentopf
  aufgenommen: die Kandidatenliste hier trägt durchgängig eine
  "Ehrlichkeit/Vertrauen"-Erzählung (falsche Information, ungeschützter
  Datenverlust, irreführende Nachrichten) — ein Barrierefreiheits-Fix zu
  Bewegungsreduktion ist ein echtes, wichtiges Thema, passt aber nicht zu
  dieser spezifischen Erzählung, gleiche Begründung wie frühere
  Formatierungs-/Validierungs-Ausschlüsse (z. B. `2daeb05`, `26f7edd`).
- `538bb25` (13.09.): Screenreader-Text der Schließen-Buttons in
  Dialog/Sheet von "Close" auf "Schließen" korrigiert. **Bewusst nicht**
  aufgenommen — reine Sprachkonsistenz-Korrektur, keine "falsche
  Information ohne Erkennbarkeit"-Erzählung.

Die restlichen sechs Commits ohne Content-Relevanz: ein Freigabe-Chef-Log
(14.09., früher Nacht-Check), ein Merge-Commit (main in it-chef/auto), ein
Support-Chef-Bericht (13.09., zwei ältere Funde bestätigt behoben,
Hilfe-Seite teilkorrigiert), der eigene interaktive Marketing-Chef-Bericht
vom 13.09. (kein neuer Content-Baustein), ein IT-Chef-Bericht (13.09.,
breite Prüfung, kein neuer Bug) und ein Daily-Status-Update.

**Warum heute eine dritte Mini-Changelog-Ausgabe statt nur einer
Übersichts-Ergänzung:** Mit den drei neuen, eigenständigen Kandidaten
(Preisalarm-, Favoriten-, Angebote-Löschbestätigung) wächst der seit
Ausgabe 2 gesammelte Tier-4-Topf von fünf auf **acht** — exakt die Menge,
die selbst am 06.09. als Auslöser für Ausgabe 2 galt, und klar über der
Menge (vier), die am selben Tag noch als "nicht ausreichend" bewertet
wurde. Die eigene Vorgabe aus dem letzten Update (die Bewegung von vier auf
fünf nicht vorschnell als "jetzt reicht's" werten, sondern explizit gegen
den 06.09.-Maßstab prüfen) ist damit sauber erfüllt, nicht nur behauptet.
Ausgabe 3 fasst alle acht Kandidaten in drei Themenblöcken zusammen (siehe
`marketing/mini-changelog-konzept.md`).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein neuntes eigenständiges Social-Content-Stück — bleibt weiterhin an
  dieselben drei unbeantworteten Fragen gebunden, unverändert seit 20.08.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  weiterhin Live-Vorgänge bzw. an ungelöste Freigabe-Fragen gebunden.

**Warum sicher genug:** Ausgabe 3 ist wie Ausgabe 1/2 ein reines
Entwurfsdokument für dieselbe, noch nicht gebaute Seite — kein Live-
Vorgang, nichts gepostet, keine Seite gebaut. Keine erfundenen Kennzahlen
— jeder der acht Punkte stammt aus einem einzeln per `git show`
verifizierten, bereits in `main` gemergten Commit. Keine offene
Positionierungs-Grundsatzfrage: wendet nur die bestehende Positionierung
("Ehrlichkeit als Feature") an, entscheidet sie nicht neu. Berührt keine
der vier offenen Fragen — hängt an derselben, bereits gestellten vierten
Frage wie Ausgabe 1/2.

**Umgesetzt:**
- `marketing/mini-changelog-konzept.md`: neuer Abschnitt "Ausgabe 3" —
  acht Vorher/Nachher-Punkte in drei Themenblöcken (Löschen mit
  Bestätigung, ehrlichere Hinweise zur Unterkunftssuche, mehr Klarheit auf
  Reiseentwürfe-/Platzhalterseiten).
- `marketing/freigabe-uebersicht.md` (dieses Dokument): neues Update vom
  14.09., Tier-4- und Tier-5-Abschnitt sowie "Nächster autonomer
  Lauf"-Abschnitt aktualisiert, Datum im Titel auf 14.09. gesetzt.

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-13: ein fünfter Tier-4-Kandidat (Jargon aus Platzhaltertext entfernt), zwei weitere Commits als Verfeinerung bestehender Kandidaten eingeordnet, alle vier Fragen weiterhin offen

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`6b6e065` (12.09.) hängengeblieben, dessen Inhalt laut `git log
main..origin/marketing-chef/auto` bereits vollständig in `main` gemergt
war (siehe `freigabe-chef-log.md`, "2026-09-12 Tages-Check") — der Branch
war also nur noch veraltet, nicht mehr in Arbeit. Neu von aktuellem
`origin/main` (`7d3f0fe`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 12.09., seit dem
letzten Lauf unverändert), `ZEITPLAN.md` (6.2 in Zeile 1009 weiterhin
`[ ]`) oder diesem Dokument seit dem 12.09. Keine neuen Kanal-Links
(`grep` nach `linkedin.com`/`instagram.com`/`tiktok.com` im gesamten
`src/` und `index.html` liefert weiterhin keinen Treffer), kein Commit zu
einer IT-Chef-Umsetzung der Mini-Changelog-Seite (kein `changelog`-Treffer
in `src/routes.tsx`/`AppShell.tsx`, keine neue Route). Alle vier Fragen
bleiben offen.

**`git log 34e43e9..origin/main` zeigt 12 neue Commits, drei davon mit
echter Produkt-Codeänderung, per `git show` einzeln geprüft:**
- `982ec4a` (13.09.): Der "Neu starten"-Bestätigungsdialog im
  KI-Chat-Header öffnete sich bisher auch dann, wenn noch gar keine
  Reisedaten existierten (frischer Chat oder direkt nach einem Reset) —
  `hasTripData(trip)` entscheidet jetzt, ob der Dialog überhaupt
  aufgeht, sonst setzt der Knopf direkt zurück statt eine falsche
  "Deine Planung geht verloren"-Warnung zu zeigen. Das ist eine
  Korrektur *am selben* Bestätigungsdialog, der bereits am 10.09. als
  dritter Tier-4-Kandidat gezählt wurde (siehe Update 2026-09-10 und
  Tier 4 unten) — kein eigenständiger fünfter Kandidat, sondern eine
  Präzisierung des dritten.
- `97ec6c8` (13.09.): Die "ehrlich statt irreführend"-Hinweiskarte zu
  "Planung fortsetzen" auf der Reiseentwürfe-Seite zählte
  `drafts.length > 1` und damit auch bereits abgeschlossene Entwürfe mit
  (`finalizeDraft()` entfernt einen Entwurf nicht aus dem Array, setzt
  nur den Status um) — blieb dadurch nach Abschluss eines von zwei
  Entwürfen fälschlich sichtbar. Fix zählt jetzt nur noch
  nicht-finalisierte Entwürfe. Das ist eine Korrektur *an derselben*
  Hinweiskarte, die bereits am 11.09. als vierter Tier-4-Kandidat gezählt
  wurde (siehe Update 2026-09-11 und Tier 4 unten) — ebenfalls keine
  eigenständige Ergänzung, sondern eine Präzisierung des vierten. Der im
  selben Support-Chef-Bericht genannte zweite Punkt (fehlender Dismiss-
  Mechanismus) bleibt laut Commit-Beschreibung bewusst offen für einen
  eigenen Lauf.
- `77c499e` (12.09.): `PlaceholderPage.tsx` zeigte auf allen noch nicht
  gebauten Seiten (u. a. `/hilfe`) den Satz "Diese Seite ist Teil des
  Travix-Grundgerüsts" — ein interner Entwicklungsbegriff in
  nutzersichtbarem Text. Satz entfernt, verbleibender Hinweis bleibt
  ehrlich ohne Jargon. Anders als die zwei oben ist das *keine*
  Verfeinerung eines bereits gezählten Punktes, sondern eine neue,
  eigenständige, verifizierte Textänderung auf einem echten (wenn auch
  noch unfertigen) Nutzerpfad — zählt als **fünfter Tier-4-Kandidat**.

Die restlichen neun Commits ohne Content-Relevanz: ein Freigabe-Chef-Log
(13.09., bestätigt reine Vorabprüfung), zwei reine Testdatei-Nachzüge
(`PageTransition`, `MobileNav`, jeweils per Commit-Beschreibung als
"kein Bugfix" verifiziert), zwei IT-Chef-Berichte (12.09., je einmal
"kein neuer Bug" bzw. Beschreibung der eigenen Fixes — reine
`reports/it-chef.md`-Änderung), ein Support-Chef-Bericht (12.09., neuer
Fund zu `/hilfe`, der in `77c499e` bereits behoben wurde), der eigene
interaktive Marketing-Chef-Bericht vom 12.09., ein Daily-Status-Update
und ein weiteres Freigabe-Chef-Log (12.09.).

**Warum heute kein neues Content-Stück und keine dritte
Mini-Changelog-Ausgabe:** Der Kandidatentopf wächst von vier auf fünf
(nur `77c499e` ist wirklich neu, die anderen zwei Commits verfeinern
bereits gezählte Kandidaten statt neue zu schaffen) — damit weiterhin
klar unter den acht, die Ausgabe 2 ausgelöst haben, und nur knapp über
der Menge, die selbst am 06.09. als "nicht ausreichend" bewertet wurde.
Ein eigenständiges neuntes Social-Content-Stück bleibt weiterhin an
dieselben drei unbeantworteten Fragen gebunden. Stattdessen heute nur
diese Übersicht aktualisiert (reiner, sicherer Übersichts-Lauf, wie z. B.
am 01.-04.09., 06.09., 08.-12.09.).

**Andere Punkte geprüft und bewusst nicht gewählt:**
- Ein neuntes eigenständiges Social-Content-Stück bzw. eine dritte
  Mini-Changelog-Ausgabe — Kandidatentopf bei fünf, weiterhin unter der
  Menge, die selbst am 06.09. als "nicht ausreichend" galt.
- "Landingpage/Warteliste live" (Sprint 2), "Community/Warteliste
  aufbauen" (Sprint 4), Testkampagnen/Launch-Kampagne (Sprint 6/7) —
  weiterhin Live-Vorgänge bzw. an ungelöste Freigabe-Fragen gebunden.

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang —
nichts gepostet oder verändert. Keine erfundenen Kennzahlen — der neue
Punkt stammt aus einem einzeln per `git show` verifizierten, bereits in
`main` gemergten Commit. Keine offene Positionierungs-Grundsatzfrage:
dieser Lauf trifft keine neue inhaltliche Entscheidung, sondern
dokumentiert nur den unveränderten Stand und ordnet drei neue Commits
sauber ein.

**Umgesetzt:** Dieses Dokument aktualisiert (dieser Abschnitt, Datum im
Titel, Tier-4-Abschnitt und "Nächster autonomer Lauf" unten).

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-12: keine neuen Tier-4-Kandidaten, alle vier Fragen weiterhin offen, reiner Übersichts-Lauf

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`4fb18e8` (11.09.) hängengeblieben, dessen Inhalt laut `git merge-base
--is-ancestor 4fb18e8 origin/main` bereits vollständig in `main` gemergt
war (Merge-Commit `34e43e9`, siehe `freigabe-chef-auto-log.md`,
"2026-09-11 Tages-Check") — der Branch war also nur noch veraltet, nicht
mehr in Arbeit. Neu von aktuellem `origin/main` (`2309d4b`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand weiterhin 09.09., seit dem
letzten Lauf unverändert), `ZEITPLAN.md` (6.2 in Zeile 841 weiterhin
`[ ]`) oder diesem Dokument seit dem 11.09. Keine neuen Kanal-Links
(`grep` nach `linkedin.com`/`instagram.com` im gesamten Repo liefert
weiterhin keinen Treffer), kein Commit zu einer IT-Chef-Umsetzung der
Mini-Changelog-Seite (`git log --all --grep="Mini-Changelog"` zeigt nur
die eigenen bisherigen Ausgaben). Alle vier Fragen bleiben offen.

**`git log 34e43e9..origin/main` zeigt 11 neue Commits, keiner davon
content-relevant:** ein Freigabe-Chef-Log (12.09., "it-chef/auto
unabhängig verifiziert und gemergt, marketing/support planmäßig
übersprungen" — bestätigt, dass dieser Branch seit dem letzten Merge
nicht angefasst wurde), fünf reine Testdatei-Nachzüge ohne
Verhaltensänderung (`QuickReplies`, `ChatMessage`/`NoResultsMessage`
waren bereits im letzten Lauf bekannt, neu: `TripSummaryCard`,
`PageHeader`, `PlaceholderPage`, `KiChat`-Seiten-Wrapper — jeweils per
Commit-Beschreibung und Diff bestätigt "kein Bugfix"/"unverändertes
Verhalten"), ein Support-Chef-Bericht (11.09., ordnet den neuen Hinweis
zu "Planung fortsetzen" als Zwischenlösung ein, zwei Vorschläge bleiben
offen — reiner Bericht, keine Codeänderung), der eigene interaktive
Marketing-Chef-Bericht vom 11.09. (kein neuer Content-Baustein, bestätigt
dieselbe Kanal-Frage als Flaschenhals), ein IT-Chef-Bericht vom 11.09.
("kein neuer Bug gefunden", per `git show df73dda --stat` verifiziert:
nur `reports/it-chef.md` geändert, kein Produkt-Code), ein
Daily-Status-Update sowie ein weiteres Freigabe-Chef-Log (11.09.). Damit
gibt es seit dem vierten Tier-4-Kandidaten vom 11.09. keinen fünften —
der Kandidatentopf bleibt bei vier.

**Warum heute kein neues Content-Stück und keine dritte
Mini-Changelog-Ausgabe:** Keine einzige neue, per `git show` verifizierte
Produkt-Codeänderung seit dem letzten Lauf, also kein neuer
Tier-4-Kandidat — der Topf bleibt bei vier (Stand 11.09.), weiterhin
exakt auf der Menge, die selbst am 06.09. als "nicht ausreichend"
bewertet wurde, und deutlich unter den acht, die Ausgabe 2 ausgelöst
haben. Ein eigenständiges neuntes Social-Content-Stück bleibt weiterhin
an dieselben drei unbeantworteten Fragen gebunden. Stattdessen heute nur
diese Übersicht aktualisiert (reiner, sicherer Übersichts-Lauf, wie z. B.
am 01.-04.09., 06.09., 08.-11.09.).

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang —
nichts gepostet oder verändert. Keine erfundenen Kennzahlen — es gibt
schlicht keinen neuen Punkt, der eine Zahl bräuchte. Keine offene
Positionierungs-Grundsatzfrage: dieser Lauf trifft keine neue inhaltliche
Entscheidung, sondern dokumentiert nur den unveränderten Stand.

**Umgesetzt:** Dieses Dokument aktualisiert (dieser Abschnitt, Datum im
Titel, "Nächster autonomer Lauf" unten).

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-11: ein weiterer Tier-4-Kandidat geprüft (Hinweis auf geteilten Chat bei "Planung fortsetzen"), weiterhin kein achtes Content-Stück und keine dritte Mini-Changelog-Ausgabe

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`5d056c2` (10.09.) hängengeblieben, dessen Inhalt laut `git merge-base
--is-ancestor 5d056c2 origin/main` bereits vollständig in `main` gemergt
war — der Branch war also nur noch veraltet, nicht mehr in Arbeit. Neu von
aktuellem `origin/main` (`c220923`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand 09.09., seither nicht
aktualisiert), `ZEITPLAN.md` (6.2 in Zeile 841 weiterhin `[ ]`) oder
diesem Dokument seit dem 10.09. Keine neuen Kanal-Links, kein Commit zu
einer IT-Chef-Umsetzung der Mini-Changelog-Seite. Alle vier Fragen bleiben
offen.

**`git log 5d056c2..origin/main` zeigt 10 neue Commits**, davon neun ohne
Content-Relevanz (ein Freigabe-Chef-Log, ein Daily-Status-Update, der
eigene interaktive Marketing-Chef-Bericht vom 10.09., ein IT-Chef-Bericht
ohne neuen Bug, ein Support-Chef-Bericht der den Reset-Bestätigungsdialog
als behoben bestätigt und drei weiterhin offene Vorschläge nennt, sowie
vier reine Testdatei-Nachzüge ohne Verhaltensänderung für `ChatMessage`,
`NoResultsMessage`, `HotelResults` und `FlightResults`). Eine echte
Codeänderung per `git show` verifiziert:

- `78c764f` (11.09., später Commit): setzt den kurzfristigen Teil von
  Vorschlag 3 aus `reports/support-chef.md` (10.09.) um — "Planung
  fortsetzen" verlinkt auf der Reiseentwürfe-Seite bei jedem Entwurf
  identisch auf `/ki-chat`, ohne erkennbar zu machen, dass das immer
  denselben einen aktiven Chat öffnet statt der Details des jeweiligen
  Entwurfs (`tripStorage.ts` speichert nur einen aktiven Trip; die echte
  Umsetzung von 7.4, eigene Chat-Historie je Entwurf, bleibt eine offene
  Datenmodell-Entscheidung). `Reiseentwuerfe.tsx` zeigt jetzt bei mehr als
  einem Entwurf einen ehrlichen Hinweis dazu, im selben Stil wie die
  bestehende Prämienprogramm-Card in `Dashboard.tsx`, mit zwei neuen
  Regressionstests abgesichert. **Content-relevant** — echter,
  angebundener Nutzerpfad (jeder mit mehr als einem gespeicherten Entwurf
  sieht den Hinweis), passt inhaltlich exakt zur selben
  Ehrlichkeits-/Vertrauens-Fundgruppe wie die bisherigen Tier-4-Kandidaten:
  eine UI-Aussage, die sonst mehr verspräche, als das Produkt aktuell
  einlösen kann, wird durch einen ehrlichen Zusatzhinweis richtiggestellt.

**Warum heute kein neues Content-Stück und keine dritte
Mini-Changelog-Ausgabe:** Nur ein einziger neuer Tier-4-Kandidat seit dem
10.09. (Topf wächst damit von drei auf vier seit Ausgabe 2) — damit exakt
auf der Menge, die selbst am 06.09. mit vier Kandidaten noch ausdrücklich
als "nicht ausreichend" bewertet wurde, und weiterhin deutlich unter den
acht, die Ausgabe 2 ausgelöst haben. Ein eigenständiges neuntes
Social-Content-Stück bleibt weiterhin an dieselben drei unbeantworteten
Fragen gebunden. Die drei am 09.09. gemeldeten Support-Chef-Punkte
(Löschen ohne Bestätigung, Warenkorb-Sackgasse, Entwurf-Fortsetzen
generisch) sind laut `ade61af` (Support-Chef-Bericht, 10.09.) weiterhin
offen — kein neuer verifizierter Commit dazu, also weiterhin kein
Tier-4-Kandidat daraus (der heutige Fund ist nur der kurzfristige,
nicht-strukturelle Teil von Vorschlag 3, nicht die vollständige Behebung).
Stattdessen heute nur diese Übersicht aktualisiert (reiner, sicherer
Übersichts-Lauf, wie z. B. am 01.-04.09., 06.09., 08.-10.09.).

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang,
nichts gepostet oder verändert. Keine erfundenen Kennzahlen — der einzige
neue Punkt stammt aus einem per `git show` einzeln verifizierten, bereits
in `main` gemergten Commit. Keine offene Positionierungs-Grundsatzfrage.

**Umgesetzt:** Dieses Dokument aktualisiert (dieser Abschnitt, Tier-4-Absatz
unten, Datum im Titel, "Nächster autonomer Lauf" unten).

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-10: ein weiterer Tier-4-Kandidat geprüft (Bestätigungsdialog vor Chat-Reset), weiterhin kein achtes Content-Stück und keine dritte Mini-Changelog-Ausgabe

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`50b6fb1` (09.09.) hängengeblieben, dessen Inhalt laut `git merge-base
--is-ancestor 50b6fb1 origin/main` bereits vollständig in `main` gemergt
war — der Branch war also nur noch veraltet, nicht mehr in Arbeit. Neu von
aktuellem `origin/main` (`9fe370e`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand 08.09., seither nicht
aktualisiert), `ZEITPLAN.md` oder diesem Dokument seit dem 09.09. 6.2
(`TripItem.tsx`-Buchen-Button) laut `ZEITPLAN.md` (Zeile 767) weiterhin
`[ ]`, keine neuen Kanal-Links, kein Commit zu einer IT-Chef-Umsetzung der
Mini-Changelog-Seite. Alle vier Fragen bleiben offen.

**`git log 50b6fb1..origin/main` zeigt 8 neue Commits**, davon sieben ohne
Content-Relevanz (ein Freigabe-Chef-Log, ein Daily-Status-Update, der
eigene interaktive Marketing-Chef-Bericht vom 09.09., ein IT-Chef-Bericht
ohne neue Bugs, ein Support-Chef-Bericht mit vier neuen, noch unbehobenen
UX-Punkten, sowie vier reine Testdatei-Nachzüge ohne Verhaltensänderung
für `HotelCard`, `FlightCard`, `TravixAvatar` und die Urlaubsmodus-Seite).
Eine echte Codeänderung per `git show` verifiziert:

- `6d7c61e` (09.09., später Commit): löst Vorschlag 1 aus
  `reports/support-chef.md` (09.09.) — der "Neu starten"-Icon-Knopf im
  Chat-Header (`KiChat.tsx`) löschte Chatverlauf, Reiseplan und
  `localStorage` bisher mit einem einzigen Klick, ohne Rückfrage und ohne
  Rückgängig. Jetzt öffnet er einen Bestätigungsdialog ("Neu starten?" /
  "Deine aktuelle Planung geht verloren.", bestehende `Dialog`-Komponente,
  gleiches Muster wie `EditMode.tsx`/`Buchung.tsx`), erst ein zweiter
  Klick auf "Ja, neu starten" löst den Reset aus; der separate "Neue Reise
  planen"-Quick-Reply-Chip bleibt bewusst unverändert. **Content-relevant**
  — echter, angebundener Nutzerpfad (jeder, der den Chat nutzt, sieht den
  Knopf), passt inhaltlich zur selben Vertrauens-/Sorgfalts-Fundgruppe wie
  die bisherigen Ehrlichkeits-Fixes: ein Fehlklick verliert nicht mehr
  unwiderruflich eine laufende Planung.

**Warum heute kein neues Content-Stück und keine dritte
Mini-Changelog-Ausgabe:** Nur ein einziger neuer Tier-4-Kandidat seit dem
09.09. (Topf wächst damit von zwei auf drei seit Ausgabe 2) — weiterhin
deutlich unter der Menge, die selbst am 06.09. mit vier Kandidaten noch
ausdrücklich als "nicht ausreichend" bewertet wurde, erst recht unter den
acht, die Ausgabe 2 ausgelöst haben. Ein eigenständiges neuntes
Social-Content-Stück bleibt weiterhin an dieselben drei unbeantworteten
Fragen gebunden. Die drei neuen Support-Chef-Punkte vom 09.09. (Löschen
ohne Bestätigung, Warenkorb-Sackgasse, Entwurf-Fortsetzen generisch) sind
laut `it-chef-auto-log.md` (09.09., weiterer Lauf) bewusst noch nicht
umgesetzt — kein verifizierter Commit, also auch kein Tier-4-Kandidat
daraus. Stattdessen heute nur diese Übersicht aktualisiert (reiner,
sicherer Übersichts-Lauf, wie z. B. am 01.-04.09., 06.09., 08.09. und
09.09.).

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang,
nichts gepostet oder verändert. Keine erfundenen Kennzahlen — der einzige
neue Punkt stammt aus einem per `git show` einzeln verifizierten, bereits
in `main` gemergten Commit. Keine offene Positionierungs-Grundsatzfrage.

**Umgesetzt:** Dieses Dokument aktualisiert (dieser Abschnitt, Tier-4-Absatz
unten, Datum im Titel, "Nächster autonomer Lauf" unten).

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-09: ein weiterer Tier-4-Kandidat geprüft (konkrete Fehlermeldung bei Unterkunftssuche), ein toter-Code-Fund bewusst ausgeschlossen, weiterhin kein achtes Content-Stück und keine dritte Mini-Changelog-Ausgabe

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`50cd675` (08.09.) hängengeblieben, dessen Inhalt laut `git merge-base
--is-ancestor 50cd675 origin/main` bereits vollständig in `main` gemergt
war — der Branch war also nur noch veraltet, nicht mehr in Arbeit. Neu von
aktuellem `origin/main` (`db61751`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md` (Stand 08.09.), `ZEITPLAN.md` oder
diesem Dokument seit dem 08.09. 6.2 (`TripItem.tsx`-Buchen-Button) laut
`ZEITPLAN.md` (Zeile 767) weiterhin `[ ]`, keine neuen Kanal-Links, kein
Commit zu einer IT-Chef-Umsetzung der Mini-Changelog-Seite. Alle vier
Fragen bleiben offen.

**`git log 50cd675..origin/main` zeigt 13 neue Commits**, davon elf ohne
Content-Relevanz (Freigabe-Chef-Logs, zwei IT-Chef-Auto-Läufe ohne
sicheren Punkt, ein Support-Chef-Bericht, der eigene interaktive
Marketing-Chef-Bericht vom 08.09., ein IT-Chef-Bericht, ein
Daily-Status-Update, ein Merge-Commit, ein Support-Chef-Auto-Log, zwei
reine npm-audit-Dependency-Fixes — alle rein interaktiv/Log/
Infrastruktur). Zwei Codeänderungen einzeln per `git show` geprüft:

- `7068653` (08.09., später Commit): löst den von `reports/it-chef.md`
  (08.09.) gemeldeten Fund — ein fehlgeschlagener `searchStays()`-Aufruf
  im KI-Chat verlor bisher die konkrete Fehlermeldung, `HotelResults.tsx`
  zeigte immer denselben festen Text, egal was Duffel konkret gemeldet
  hat. `stayError: boolean` wird durch `stayErrors: DuffelError[]`
  ersetzt, exakt nach dem bereits etablierten `flightErrors`-Vorbild.
  **Content-relevant** — gehört inhaltlich zur selben "Ehrlichkeit als
  Feature"-Fundgruppe wie die bereits verarbeiteten Fehlermeldungs-Fixes
  (echte Nutzerin sieht jetzt die tatsächliche Fehlerursache statt eines
  pauschalen Satzes, betrifft den echten, bereits angebundenen
  Unterkunfts-Suchpfad).
- `b5fac18` (08.09., später Commit): `TrainResults.tsx` versprach im
  Ladetext "echte" Zug-/Bus-/Fährverbindungen zu suchen, obwohl dafür
  weiterhin keine angebundene Datenquelle existiert (5.7 offen) —
  inhaltlich exakt dieselbe Ehrlichkeits-Fehlerklasse wie die bereits am
  28.08. in `mockAdvisor.ts` behobene. **Nicht** in den Tier-4-
  Kandidatentopf aufgenommen: laut Commit-Beschreibung selbst und
  `ZEITPLAN.md` ist `TrainResults`/`TrainCard` weiterhin in keine Seite
  eingebunden (5.7 offen) — dieselbe Begründung, mit der bereits der
  `TrainCard`-Preisformat-Fix `cafb37c` (08.09., Update 2026-09-08 oben)
  ausgeschlossen wurde: ohne sichtbaren Nutzerpfad hat aktuell keine
  echte Nutzerin die falsche Aussage je gesehen, also kein "falsche
  Information ohne Erkennbarkeit"-Fund im Sinne der bisherigen
  Aufnahmekriterien. Wandert erst in den Kandidatentopf, sobald 5.7 die
  Komponente tatsächlich in eine Seite einbindet.

**Warum heute kein neues Content-Stück und keine dritte
Mini-Changelog-Ausgabe:** Nur ein einziger neuer Tier-4-Kandidat seit dem
08.09. (Topf wächst damit von einem auf zwei seit Ausgabe 2) — weiterhin
deutlich unter der Menge, die selbst am 06.09. mit vier Kandidaten noch
ausdrücklich als "nicht ausreichend" bewertet wurde, erst recht unter den
acht, die Ausgabe 2 ausgelöst haben. Ein eigenständiges neuntes
Social-Content-Stück bleibt weiterhin an dieselben drei unbeantworteten
Fragen gebunden. Stattdessen heute nur diese Übersicht aktualisiert
(reiner, sicherer Übersichts-Lauf, wie z. B. am 01.-04.09., 06.09. und
08.09.).

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang,
nichts gepostet oder verändert. Keine erfundenen Kennzahlen — der einzige
neue Punkt stammt aus einem per `git show` einzeln verifizierten, bereits
in `main` gemergten Commit; der ausgeschlossene zweite Fund wird
transparent begründet, nicht stillschweigend fallengelassen. Keine offene
Positionierungs-Grundsatzfrage.

**Umgesetzt:** Dieses Dokument aktualisiert (dieser Abschnitt, Tier-4-Absatz
unten, Datum im Titel, "Nächster autonomer Lauf" unten).

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-08: ein weiterer Tier-4-Kandidat geprüft (Anschlussfix zur Unterkunfts-Notiz), weiterhin kein achtes Content-Stück und keine dritte Mini-Changelog-Ausgabe

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`9b6f952` (07.09.) hängengeblieben, dessen Inhalt laut `git merge-base
--is-ancestor 9b6f952 origin/main` bereits vollständig in `main` gemergt
war — der Branch war also nur noch veraltet, nicht mehr in Arbeit. Neu von
aktuellem `origin/main` (`852ead1`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md`, `ZEITPLAN.md` oder diesem Dokument seit
dem 07.09. Der eigene interaktive Bericht vom 07.09.
(`reports/marketing-chef.md`, Commit `e99289c`) bestätigt im Titel selbst
"vier Fragen weiterhin offen". 6.2 (`TripItem.tsx`-Buchen-Button) laut
`ZEITPLAN.md` weiterhin `[ ]`, keine neuen Kanal-Links, kein Commit zu
einer IT-Chef-Umsetzung der Mini-Changelog-Seite. Alle vier Fragen bleiben
offen.

**`git log 9b6f952..origin/main` zeigt 13 neue Commits**, davon neun ohne
Content-Relevanz (Freigabe-Chef-Merges/-Logs, IT-Chef-Auto-Log, ein
Support-Chef- und ein eigener Marketing-Chef-Bericht, ein Daily-Status-
Update, eine CI-Workflow-Ergänzung, ein reiner npm-audit-Dependency-Fix —
alle rein interaktiv/Log/Infrastruktur). Zwei Codeänderungen einzeln per
`git show` geprüft:

- `d7682d2` (07.09.): löst den Anschlussfund, den Support-Chef zum
  06./07.09.-Fix meldete — `useChat.ts` prüfte im Hauptchat unabhängig von
  `mockAdvisor.ts` noch einmal `findKnownDestination()` und hängte trotz
  bereits ehrlicher Advisor-Antwort eine zweite, widersprüchliche
  "nutze die manuelle Hotelsuche"-Notiz an; im "Bearbeiten"-Pfad
  (`startEdit`) bestand derselbe Widerspruch unverändert, vom
  07.09.-Vormittagsfix noch gar nicht berührt. Neues optionales
  `AdvisorReply`-Feld `accommodationNoticeHandled` lässt `mockAdvisor.ts`
  der aufrufenden Seite mitteilen, dass die Notiz bereits enthalten ist,
  statt dass beide Stellen den Sachverhalt unabhängig prüfen — im
  Bearbeiten-Pfad erscheint bei unbekanntem Ziel jetzt von vornherein nur
  noch eine einzige, ehrliche Nachricht statt zwei sich widersprechenden.
  **Content-relevant** — gehört inhaltlich zur selben "Ehrlichkeit als
  Feature"-Fundgruppe wie die bereits verarbeiteten Nulltreffer-/
  Ankündigungs-Fixes vom 07.09. (Ausgabe 2), ist aber ein eigener, erst
  danach gemergter Commit und damit noch kein Teil von Ausgabe 2.
- `cafb37c` (08.09.): `TrainCard.tsx` zeigt den Preis jetzt ebenfalls über
  `formatOfferPrice()` statt roh. **Nicht** aufgenommen — laut
  `ZEITPLAN.md` weiterhin toter Code, der in keiner Seite eingebunden ist
  (5.7 offen); ohne sichtbaren Nutzerpfad kein "falsche Information ohne
  Erkennbarkeit"-Fund wie bei den übrigen Tier-4-Kandidaten, gleiche
  Begründung wie beim bereits am 06.09. ausgeschlossenen `2daeb05`.

**Warum heute kein neues Content-Stück und keine dritte
Mini-Changelog-Ausgabe:** Nur ein einziger neuer, verifizierter
Tier-4-Kandidat seit dem 07.09. (Kandidatentopf war laut Update 2026-09-07
frisch geleert) — deutlich unter der Menge, die am 06.09. mit vier
Kandidaten noch ausdrücklich als "nicht ausreichend" bewertet wurde, erst
recht unter den acht, die Ausgabe 2 ausgelöst haben. Ein eigenständiges
neuntes Social-Content-Stück bleibt weiterhin an dieselben drei
unbeantworteten Fragen gebunden. Stattdessen heute nur diese Übersicht
aktualisiert (reiner, sicherer Übersichts-Lauf, wie z. B. am 01.-04.09.
und 06.09.).

**Warum sicher genug:** Reine Übersichts-Ergänzung, kein Live-Vorgang,
nichts gepostet oder verändert. Keine erfundenen Kennzahlen — der einzige
neue Punkt stammt aus einem per `git show` einzeln verifizierten, bereits
in `main` gemergten Commit. Keine offene Positionierungs-Grundsatzfrage.

**Umgesetzt:** Dieses Dokument aktualisiert (dieser Abschnitt, Tier-4-Absatz
unten, Datum im Titel).

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test nötig
— reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-07: zweite Mini-Changelog-Ausgabe geschrieben (acht neue Tier-4-Kandidaten seit Ausgabe 1, davon zwei explizit vorgemerkte), Sprachfunktions-Blocker vollständig ausgeräumt

**Repo-Zustand zu Beginn des Laufs:** `marketing-chef/auto` war auf
`5299c9c` (06.09.) hängengeblieben, dessen Inhalt laut `git log
origin/main ^origin/marketing-chef/auto` bereits vollständig in `main`
gemergt war — der Branch war also nur noch veraltet, nicht mehr in
Arbeit. Neu von aktuellem `origin/main` (`8dcf007`) aus angelegt.

**Erst geprüft, ob sich an den vier offenen Fragen etwas geändert hat:**
keine Notiz von Ni in `status.md`, `ZEITPLAN.md` oder diesem Dokument seit
dem 06.09. — alle vier weiterhin unbeantwortet. Der eigene interaktive
Bericht vom 06.09. (`reports/marketing-chef.md`) bestätigt das ebenfalls
und empfiehlt weiterhin, die Sprachfunktion nicht zu bewerben, allerdings
**bevor** der unten beschriebene Fund vom späten 06.09.

**`git log 5299c9c..origin/main` zeigt 13 neue Commits**, davon fünf ohne
Content-Relevanz (zwei Freigabe-Chef-Merges/-Logs, ein Daily-Status-Update,
ein eigener interaktiver Marketing-Chef-Bericht, ein IT-Chef-Bericht — alle
rein interaktiv/Log). Acht echte Codeänderungen einzeln per `git show`
geprüft, alle content-relevant und in **Ausgabe 2 des Mini-Changelogs**
(`marketing/mini-changelog-konzept.md`) verarbeitet — Details und
Vorher/Nachher-Text dort, hier nur die Einordnung:

- `404935c` (05.09.): `formatOfferPrice()` gegen ungültigen Währungscode
  abgesichert (verhinderte Kartenabsturz).
- `0b28d39` (05.09.): stiller Trip-Verlust bei vollem `localStorage` jetzt
  im Chat sichtbar.
- `bf20ae3` (06.09.): "euro"/"hi"-Wortgrenzen-Bug im Concierge behoben.
- `2483ce4` (06.09.): `trip.activities` beim Laden normalisiert (PR #18).
- `0d4aab2` (06.09.): "Überrasch mich" wird nicht mehr wörtlich als
  Reiseziel übernommen, sondern löst ein echtes kuratiertes Ziel aus.
- `fc17297` (07.09., PR #19): `updateStoredTrip()` täuschte bei
  fehlgeschlagenem Speichern bisher Erfolg vor — jetzt zeigen auch
  Flugsuche/Hotelsuche/Buchung denselben Speicher-Warnhinweis wie der Chat.
- `56c8f61` (07.09.): Chat-Chips fehlten nach einer echten
  Nulltreffer-Suche — behoben. **Löst genau den Fund, den der eigene
  Bericht vom 05.09. (Vorschlag 3) und das Update vom 06.09. unten als
  "guten Baustein für die nächste Ausgabe" vorgemerkt hatten.**
- `b0b8d2e` (07.09.): widersprüchliche Unterkunfts-Suchankündigung bei
  unbekanntem Ziel behoben — **derselbe vorgemerkte Fund wie oben**, jetzt
  ebenfalls erledigt.

Mit acht neuen, einzeln verifizierten Kandidaten (mehr als doppelt so
viele wie am 06.09., als vier bewusst noch als "nicht ausreichend"
gewertet wurden) und zwei davon exakt den Funden, die für "die nächste
Ausgabe" vorgemerkt waren, ist die eigene Gating-Bedingung aus dem
06.09.-Update jetzt erfüllt — deshalb heute die zweite Mini-Changelog-
Ausgabe statt einer weiteren reinen Übersichts-Ergänzung.

**Wichtiger zusätzlicher Fund — Sprachfunktions-Blocker jetzt vollständig
ausgeräumt:** Ein neunter Commit, `ac0e188` (06.09., separat von den acht
Tier-4-Kandidaten behandelt, da kein Changelog-Punkt, sondern ein
Statusupdate zur bestehenden Zurückhaltung), behebt `stopSpeaking()` wird
nirgends aufgerufen — der zweite von zwei Gründen, die der eigene Bericht
vom 03./04.09. gegen eine Bewerbung der Vorlesen-Funktion genannt hatte
(der erste, hängender Mikrofon-Knopf, war bereits am 05.09. behoben). Per
`git merge-base --is-ancestor ac0e188 origin/main` bestätigt: gemergt.
**Beide ursprünglich genannten technischen Gründe sind damit ausgeräumt.**
Bewusst **kein** Anlass für ein eigenes Content-Stück heute (das wäre ein
neuner Social-Anlass mitten in derselben ungeklärten Kanal-/Format-Frage,
siehe Selbstbeschränkung unten) — aber eine für Nis Entscheidung relevante
Statusänderung, deshalb hier und in `mini-changelog-konzept.md` (Ausgabe
2, Randnotiz) vermerkt. Die Vorlesen-Funktion ist ab jetzt "bereit, sobald
ein Kanal oder eine Ausgabe dafür ansteht", nicht mehr technisch
zurückgehalten.

**Warum sicher genug:** Ausgabe 2 ist wie Ausgabe 1 ein reines
Entwurfsdokument für dieselbe, noch nicht gebaute Seite — kein Live-Vorgang,
nichts gepostet. Keine erfundenen Kennzahlen — jeder Punkt stammt aus
einem einzeln per `git show` verifizierten, bereits in `main` gemergten
Commit. Keine offene Positionierungs-Grundsatzfrage: wendet nur die
bestehende Positionierung an, entscheidet sie nicht neu. Berührt keine der
vier offenen Fragen — hängt an derselben bereits gestellten vierten Frage
wie Ausgabe 1.

**Umgesetzt:** `marketing/mini-changelog-konzept.md` um Abschnitt
"Ausgabe 2" ergänzt (acht Changelog-Punkte in vier Themenblöcken plus
Sprachfunktions-Randnotiz), diese Übersicht aktualisiert (Punkt 7 unten
sowie Tier 5 unten).

**Geprüft:** Kein Produkt-Code geändert, daher kein Build/Lint/Test
nötig — reine Markdown-Ergänzung.

**Commit:** siehe Git-Historie auf `marketing-chef/auto` (dieser
Log-Eintrag ist Teil desselben Commits).

## Update 2026-09-06: vier weitere Tier-4-Kandidaten geprüft, PR #17 und #18 jetzt gemergt (waren in der ersten Mini-Changelog-Ausgabe noch "offen"), weiterhin kein achtes Content-Stück bzw. keine zweite Mini-Changelog-Ausgabe

**Erst die vier offenen Fragen aus dem Update vom 05.09. geprüft, bevor
irgendein neuer Text entsteht:** keine davon wurde seither beantwortet.
`git log` zeigt keinen Commit zu neuen Kanal-Links, zu 6.2
(Buchen-Button/Warenkorb) oder zu einer IT-Chef-Umsetzung der
Mini-Changelog-Seite selbst; `git log -- marketing/freigabe-uebersicht.md`
zeigt außerdem, dass seit dem 05.09. ausschließlich der eigene autonome
Lauf diese Datei verändert hat, keine Notiz von Ni. Die Selbstauflage aus
dem letzten Update — vor einer zweiten Mini-Changelog-Ausgabe erst wieder
"genug" neue Kandidaten sammeln statt nach jedem einzelnen Fix neu zu
schreiben — bleibt daher der Maßstab für die Entscheidung unten.

Vor der Auswahl `git log 2e28606..origin/main` geprüft (letzter
Marketing-Lauf, 05.09.): `marketing-chef/auto` war seit `2e28606`
unverändert und dessen Inhalt laut `git log origin/main
^origin/marketing-chef/auto` bereits vollständig in `main` gemergt —
Branch also nur veraltet, nicht mehr in Arbeit, neu von aktuellem
`origin/main` (`b94811d`) aus angelegt. 13 neue Commits seit `2e28606`,
davon ohne Content-Relevanz: ein Freigabe-Chef-Merge/-Log, ein
Support-Chef-Bericht, ein eigener interaktiver Marketing-Chef-Bericht
(der die erste Mini-Changelog-Ausgabe als "entscheidungsreif" einordnet
und die Nulltreffer-Lücke unten als künftigen Baustein vormerkt, aber
selbst nichts Neues umsetzt), ein IT-Chef-Bericht und ein Daily-Status-
Update.

Fünf echte Codeänderungen einzeln per `git show` geprüft:

- **`2483ce4` (06.09., IT-Chef 39. Lauf):** `loadStoredChat()` gab
  `trip.activities` bisher ungeprüft durch; `Buchung.tsx`,
  `checklistRules.ts` und `EditMode.tsx` lesen `activities.length`
  unguarded und konnten bei einem alten/korrupten Reiseplan ohne dieses
  Feld abstürzen. **Content-relevant** — löst **PR #18**, das die erste
  Mini-Changelog-Ausgabe (Stand 05.09.) noch als offen gelistet hatte
  (siehe `reports/marketing-chef.md`, 05.09.); gleiche Fehlerklasse wie
  der bereits gelistete `hasTripData()`-Fix.
- **`404935c` (05.09., IT-Chef 40. Lauf):** `formatOfferPrice()` warf bei
  fehlendem/ungültigem ISO-4217-Währungscode eine `RangeError` und ließ
  `FlightCard.tsx`/`HotelCard.tsx` abstürzen. **Content-relevant** — löst
  **PR #17**, ebenfalls in der ersten Ausgabe noch als offen notiert.
  Damit sind zwei der drei zum 05.09. noch offenen Auto-Fix-PRs jetzt
  gemergt; nur **PR #16** (Sprachausgabe-Stopp-Knopf) bleibt laut
  `git merge-base --is-ancestor` weiterhin **nicht** gemergt — die
  bestehende Zurückhaltung bei der Sprachfunktion ändert sich dadurch
  nicht.
- **`0b28d39` (05.09., IT-Chef 41. Lauf):** setzt exakt Vorschlag 3 aus
  `reports/support-chef.md` (05.09.) um — ein fehlgeschlagenes Speichern
  des Chat-Fortschritts (voller `localStorage`/privater Modus) blieb
  bisher unbemerkt, der geplante Trip verschwand beim nächsten Laden ohne
  Vorwarnung. `saveStoredChat()` meldet Erfolg/Misserfolg jetzt als
  Rückgabewert, `KiChat.tsx` zeigt bei Fehlschlag einen Hinweis, analog
  zum bestehenden `micError`-Muster. **Content-relevant** — eigene, neue
  Facette (ehrlicher Hinweis auf einen *möglichen künftigen* Datenverlust,
  nicht nur ein behobener Absturz).
- **`bf20ae3` (06.09., IT-Chef 42. Lauf):** `getConciergeReply()`
  erkannte "euro"/"hi" ohne Wortgrenzen, matchte also fälschlich mitten in
  "Europa"/"Sushi" — gleiche Fehlerklasse wie die bereits gelisteten
  Wortgrenzen-Bugs bei Zielname- und Transportmittel-Erkennung.
  **Content-relevant**, gehört zum selben Themenblock wie
  "Rom"/"romantisch" und "Business Class"/"Bus".
- **`2daeb05` (06.09.):** Die Flugauswahl-Bestätigung im Chat zeigte den
  Preis bisher roh interpoliert ("249.00 EUR") statt wie `FlightCard.tsx`/
  `HotelCard.tsx` über `formatOfferPrice()` korrekt formatiert
  ("249,00 €"). **Nicht** in den Kandidatentopf aufgenommen: reine
  Konsistenzkorrektur zwischen zwei bereits vorhandenen, beide schon
  korrekten Darstellungen — anders als bei den übrigen Punkten oben gab
  es hier keinen Moment, in dem eine Nutzerin eine falsche oder
  irreführende Information gesehen hätte (der Rohwert war numerisch
  korrekt, nur nicht lokalisiert), daher keine "falsche Information ohne
  Erkennbarkeit"-Erzählung wie bei den bereits etablierten
  Aufnahmekriterien.

**Warum trotzdem keine zweite Mini-Changelog-Ausgabe heute:** Die erste
Ausgabe (05.09.) ist erst einen Tag alt und wartet noch auf Nis
Grundsatz-Entscheidung, ob das Format überhaupt gebaut wird (Frage 4
unten) — eine zweite Ausgabe zu schreiben, bevor diese Frage überhaupt
beantwortet ist, würde an derselben Bremse vorbeiproduzieren wie ein
neuntes Social-Content-Stück vor Beantwortung der ersten drei Fragen.
Die eigene Selbstauflage aus dem letzten Update (nicht nach jedem
einzelnen neuen Fix eine neue Ausgabe) bleibt daher der Maßstab; die vier
neuen Kandidaten wandern stattdessen in den Tier-4-Kandidatentopf (Punkt 7
unten) für die nächste Ausgabe, sobald Frage 4 beantwortet ist oder sich
weiter genug ansammelt.

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
   Vorher/Nachher pro Fund — bleibt an Frage 3 unten gebunden. Seit
   05./06.09. vier weitere, noch nicht in eine Ausgabe aufgenommene
   Kandidaten (siehe Update 2026-09-06 oben): ein alter/korrupter
   Reiseplan ohne `activities`-Feld ließ Buchungs-/Checklisten-/
   Bearbeiten-Ansicht abstürzen, jetzt wird das Feld beim Laden auf ein
   leeres Array normalisiert (PR #18); ein fehlender/ungültiger
   Währungscode ließ Flug-/Hotelkarten abstürzen, jetzt fängt
   `formatOfferPrice()` das ab (PR #17); ein fehlgeschlagenes Speichern
   des Chat-Fortschritts bei vollem Speicher blieb bisher unbemerkt, jetzt
   gibt es einen sichtbaren Hinweis statt eines lautlosen künftigen
   Datenverlusts; und derselbe Wortgrenzen-Bug wie bei Zielname-/
   Transportmittel-Erkennung steckte unabhängig auch in der
   Concierge-Themenerkennung ("euro"/"hi" mitten in "Europa"/"Sushi").
   **Alle acht seit 05./06.09. gesammelten Kandidaten sind seit dem
   07.09. in Ausgabe 2 des Mini-Changelogs verarbeitet** (siehe Tier 5
   unten) — der Kandidatentopf hier ist damit vorerst wieder leer, neue
   Funde sammeln sich ab jetzt für eine mögliche dritte Ausgabe. Seit dem
   07.09. (später Commit, noch nicht Teil von Ausgabe 2) ein erster neuer
   Kandidat (siehe Update 2026-09-08 oben): der Bearbeiten-Pfad für
   Unterkunft zeigte bei unbekanntem Ziel bisher zwei sich
   widersprechende Nachrichten hintereinander (Suchversprechen, direkt
   gefolgt von der ehrlichen Absage) — jetzt erscheint von vornherein nur
   noch die ehrliche Nachricht. Seit dem 08.09. (später Commit) ein
   zweiter Kandidat (siehe Update 2026-09-09 oben): die Unterkunftssuche
   im Chat zeigt bei einem echten Suchfehler jetzt die konkrete
   Duffel-Fehlermeldung statt immer desselben festen Textes, exakt nach
   dem bei der Flugsuche bereits etablierten Muster. Seit dem 09.09.
   (später Commit) ein dritter Kandidat (siehe Update 2026-09-10 oben):
   der "Neu starten"-Knopf im Chat-Header löscht Chatverlauf, Reiseplan
   und `localStorage` nicht mehr mit einem einzigen, ungeschützten Klick,
   sondern erst nach einer Bestätigung im Dialog. Seit dem 10.09. (später
   Commit) ein vierter Kandidat (siehe Update 2026-09-11 oben): "Planung
   fortsetzen" auf der Reiseentwürfe-Seite verlinkte bisher bei jedem
   Entwurf identisch auf denselben einen aktiven Chat, ohne das erkennbar
   zu machen — jetzt zeigt die Seite bei mehr als einem Entwurf einen
   ehrlichen Hinweis darauf. Seit dem 12./13.09. ein fünfter Kandidat
   (siehe Update 2026-09-13 oben): `PlaceholderPage.tsx` zeigte auf allen
   noch nicht gebauten Seiten (u. a. `/hilfe`) den internen
   Entwicklungsbegriff "Travix-Grundgerüst" in nutzersichtbarem Text —
   jetzt entfernt, verbleibender Hinweis bleibt ehrlich ohne Jargon. Zwei
   weitere Commits im selben Zeitraum (`982ec4a`, `97ec6c8`) verfeinern
   nur den dritten bzw. vierten Kandidaten weiter (Bestätigungsdialog
   löste sich bisher fälschlich auch ohne Reisedaten aus; Hinweiskarte
   zählte bereits abgeschlossene Entwürfe fälschlich mit) und zählen
   deshalb nicht als eigene, sechste Kandidaten. Seit dem 13./14.09. drei
   weitere Kandidaten (siehe Update 2026-09-14 oben): der "Neu
   starten"-Bestätigungsdialog wurde auf die Preisalarme-, Favoriten- und
   Angebote-Seite übertragen — löschte dort bisher jeweils mit einem
   einzigen Klick sofort und endgültig, jetzt fragt derselbe
   Bestätigungsdialog vorher nach. **Alle acht seit Ausgabe 2 gesammelten
   Kandidaten sind seit dem 14.09. in Ausgabe 3 des Mini-Changelogs
   verarbeitet** (siehe Tier 5 unten) — der Kandidatentopf hier ist damit
   vorerst wieder leer, neue Funde sammeln sich ab jetzt für eine mögliche
   vierte Ausgabe. Zwei zusätzlich am 13.09. geprüfte, aber bewusst nicht
   aufgenommene Commits: `2f110f7` (Seitenübergänge respektieren jetzt
   `prefers-reduced-motion` — echter Barrierefreiheits-Fix, aber ohne die
   "Ehrlichkeit/Vertrauen"-Erzählung dieses Formats) und `538bb25`
   (Schließen-Buttons jetzt auf Deutsch — reine Sprachkonsistenz-
   Korrektur, gleiche Begründung wie frühere Formatierungsausschlüsse).
   Seit dem 14./15.09. zwei weitere Kandidaten (siehe Update 2026-09-15
   oben): das etablierte Bestätigungsdialog-Muster wurde auf die
   Aktivitäten- (**neunter Kandidat**) und die Warenkorb-Seite (**zehnter
   Kandidat**) übertragen — damit ist die komplette Fünf-Seiten-Liste aus
   dem 13.09.-Support-Chef-Fund abgearbeitet. Seit dem 15./16.09. zwei
   weitere Kandidaten (siehe Update 2026-09-16 oben): `loadStoredChat()`
   normalisiert jetzt auch `messages`/`quickReplies` gegen fehlende Felder
   in alten/korrupten `localStorage`-Daten (**elfter Kandidat**, dieselbe
   Fundgruppe wie die `activities`-Normalisierung aus Ausgabe 2), und
   `resetChat()` bricht nicht mehr ab, wenn `localStorage.removeItem`
   wirft (**zwölfter Kandidat**, dieselbe Fundgruppe wie der
   Speicherfehler-Hinweis aus Ausgabe 2). Mit Vorbehalt außerdem ein
   **dreizehnter Kandidat**: die Korrektur, dass Enter eine laufende
   IME-Komposition (Japanisch/Chinesisch/Koreanisch) in `ChatInput`/
   `EditMode` nicht mehr abbricht — anders eingeordnet als die übrigen
   Kandidaten, da hier keine Ehrlichkeits-/Vertrauensaussage im engeren
   Sinn korrigiert wird, sondern derselbe Bug-Typ wie bei den
   Wortgrenzen-Fehlern (stille, vom Bug verursachte Fehlaktion); siehe
   Update 2026-09-16 oben für die vollständige Begründung. Ein weiterer,
   am 15.09. geprüfter Commit bewusst nicht aufgenommen: `2d0f024`
   (Fokus-Rückgabe nach Bestätigungsdialogen zentral in `DialogContent`
   behoben — echter Barrierefreiheits-Fix, gleiche Ausschlussbegründung
   wie bei `2f110f7`/`538bb25`). Seit dem 16./17.09. vier weitere
   Kandidaten (siehe Update 2026-09-17 oben): der bereits vorgemerkte
   `formatDuration()`-Fund (**vierzehnter Kandidat**, PR #21 jetzt
   gemerged), das Bestätigungsdialog-Muster auf den Bearbeiten-Dialog
   einer Aktivität übertragen (**fünfzehnter Kandidat**), der jetzt
   zuverlässige Mikrofon-Stopp bei einem zweiten Klick (**sechzehnter
   Kandidat**) sowie dasselbe Bestätigungsdialog-Muster auf
   Reiseentwurf-Karten übertragen (**siebzehnter Kandidat**). Ein am
   selben Tag geprüfter Commit bewusst nicht aufgenommen: `17b61f5`
   (Kalender-„Heute"-Zelle jetzt auch für Screenreader markiert — echter
   Barrierefreiheits-Fix, gleiche Ausschlussbegründung wie bei `2d0f024`,
   `2f110f7` und `538bb25`). **Kandidatentopf damit bei neun (Kandidaten
   9-17, davon einer mit Vorbehalt) — exakt über der Achter-Schwelle von
   Ausgabe 2/3, alle neun seit dem 17.09. in Ausgabe 4 verarbeitet.** Der
   Kandidatentopf ist damit wieder leer.

### Tier 5 — anderer Kanal als Social, eigene Freigabe-Frage

8. **`mini-changelog-konzept.md`** (05.09., Ausgabe 2 am 07.09., Ausgabe 3
   am 14.09., Ausgabe 4 am 17.09. ergänzt) — Konzept + vier fertige
   Ausgaben für einen öffentlichen Mini-Changelog *im Produkt*
   (Footer-Seite), nicht für Social Media gedacht. Bündelt den gesamten
   seitherigen Tier-4-Kandidatentopf in fünfzehn kuratierten
   Themenblöcken über alle vier Ausgaben. Berührt bewusst keine der drei
   Fragen unten — hat dafür eine eigene, vierte Frage (siehe unten).

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
- **Neu seit 05.09.:** Soll der Mini-Changelog (Tier 5, Seite im Produkt
  statt Social) gebaut werden? Unabhängig von den drei Fragen oben zu
  beantworten — braucht weder Kanal noch 6.2 noch eine Social-Format-
  Entscheidung, nur IT-Chefs Umsetzung der Footer-Seite. Inzwischen vier
  fertige Ausgaben, die auf diese eine Antwort warten.
- **Kein neuer Entscheidungsbedarf, nur zur Kenntnis (seit 07.09.):** Die
  Vorlesen-Funktion im Chat hat seit heute keinen bekannten technischen
  Blocker mehr (beide ursprünglich genannten Gründe sind behoben) —
  bleibt aber an die drei alten Fragen oben gebunden, bevor daraus eigener
  Content wird (siehe Update 2026-09-07 oben).

## Nächster autonomer Lauf
Die Selbstbeschränkung "kein neues *Social*-Content-Stück" aus dem
Bericht vom 20.08. gilt für die ersten drei Fragen unverändert weiter
(die einzige bisherige Ausnahme war Tier-1-Stück 3, siehe
`marketing-chef-auto-log.md`, 24.08.). Der Mini-Changelog (05.09.,
Ausgabe 2 am 07.09.) ist kein Bruch dieser Regel, sondern ein bewusst
anderer Kanal, der genau deshalb umgesetzt wurde. Der nächste Lauf sollte
zuerst prüfen, ob Ni zwischenzeitlich eine der vier Fragen beantwortet hat
(z. B. neue Kanal-Links, ein Commit zu 6.2, eine Notiz in diesem Dokument,
oder ein Commit von IT-Chef zur Mini-Changelog-Seite) oder ob die
Checkliste inzwischen echte Persistenz hat (dann wird sie laut Bericht vom
24.08. selbst zum nächsten Content-Kandidaten), bevor er wieder einen
neuen Social-Text schreibt. Falls weiterhin keine der vier Fragen
beantwortet ist: eine dritte Mini-Changelog-Ausgabe ist erst sinnvoll,
sobald sich seit dem 07.09. wieder genug neue, verifizierte
Tier-4-Kandidaten angesammelt haben (nicht nach jedem einzelnen neuen
Fix) — Stand 09.09. sind erst zwei im Topf (siehe Update 2026-09-09
oben), also weiterhin zu wenig. Stand 09.10. ist ein dritter Kandidat
dazugekommen (siehe Update 2026-09-10 oben), damit weiterhin klar unter
der Menge, die selbst am 06.09. mit vier Kandidaten noch als "nicht
ausreichend" galt. Stand 09.11. ist ein vierter Kandidat dazugekommen
(siehe Update 2026-09-11 oben) — damit exakt auf der Menge vom 06.09.,
weiterhin deutlich unter den acht, die Ausgabe 2 ausgelöst haben; der
nächste Lauf sollte das nicht automatisch als "jetzt reicht's" werten,
sondern die eigene Konsistenz mit dem 06.09.-Maßstab explizit
gegenprüfen, bevor er eine dritte Ausgabe schreibt. Stand 09.12. ist kein
fünfter Kandidat dazugekommen — seit dem letzten Merge (`34e43e9`) gab es
keine einzige neue, per `git show` verifizierte Produkt-Codeänderung,
nur Testdatei-Nachzüge und Berichte (siehe Update 2026-09-12 oben). Der
Topf bleibt bei vier, weiterhin zu wenig für eine dritte Ausgabe. Die
drei am 09.09.
gemeldeten, noch offenen Support-Chef-Punkte (Löschen ohne Bestätigung,
Warenkorb-Sackgasse, Entwurf-Fortsetzen generisch) werden erst zu
Kandidaten, sobald IT-Chef sie tatsächlich behebt — nicht schon durch die
Meldung selbst; der 11.09.-Fund deckt nur den kurzfristigen Teil des
dritten Punkts ab (Hinweis statt echter struktureller Lösung), der Punkt
bleibt also im Kern weiterhin offen. Stand 09.13. ist ein fünfter
Kandidat dazugekommen (siehe Update 2026-09-13 oben, `77c499e`: Jargon
"Travix-Grundgerüst" aus `PlaceholderPage.tsx` entfernt) — zwei weitere
Commits desselben Tages (`982ec4a`, `97ec6c8`) verfeinern nur bereits
gezählte Kandidaten (drei und vier) und erhöhen den Topf nicht weiter.
Fünf bleibt weiterhin klar unter den acht, die Ausgabe 2 ausgelöst haben,
und nur knapp über der Menge, die am 06.09. selbst als "nicht
ausreichend" galt — der nächste Lauf sollte auch das explizit gegen den
06.09.-Maßstab prüfen, statt allein die Bewegung von vier auf fünf als
Auslöser zu werten. Stand 09.14 sind drei weitere Kandidaten
dazugekommen (Löschbestätigung auf Preisalarme-, Favoriten- und
Angebote-Seite, siehe Update 2026-09-14 oben) — der Topf erreichte damit
acht, exakt die Menge, die bereits Ausgabe 2 ausgelöst hatte, und wurde
deshalb vollständig in Ausgabe 3 verarbeitet. Der Kandidatentopf ist damit
wieder leer; der nächste Lauf sammelt neue Funde von vorn, mit demselben
06.09.-Maßstab (acht = genug, vier = eher nicht) als Richtwert für eine
vierte Ausgabe. Stand 09.15 sind zwei weitere Kandidaten dazugekommen
(Löschbestätigung auf Aktivitäten- und Warenkorb-Seite, siehe Update
2026-09-15 oben) — damit ist die komplette Fünf-Seiten-Liste aus dem
13.09.-Support-Chef-Fund abgearbeitet, aber der Topf steht erst bei zwei,
klar unter der Menge, die selbst am 06.09. noch als "nicht ausreichend"
galt. Der nächste Lauf sollte weiter sammeln, nicht allein wegen des
inhaltlichen Abschlusses der Fünf-Seiten-Liste vorzeitig eine vierte
Ausgabe schreiben. Stand 09.16 sind zwei bis drei weitere Kandidaten
dazugekommen (`loadStoredChat()`-Normalisierung und `resetChat()`-
Robustheit sicher, die IME-Enter-Korrektur mit Vorbehalt, siehe Update
2026-09-16 oben) — der Topf steht damit bei fünf, weiterhin klar unter
den acht, die Ausgabe 2 und 3 ausgelöst haben, und nur knapp über der
Menge, die am 06.09. als "nicht ausreichend" galt. Ein am selben Tag
geprüfter Fokus-Rückgabe-Fix (`2d0f024`) wurde bewusst nicht
aufgenommen (reiner Barrierefreiheits-Fund, keine Ehrlichkeits-/
Vertrauens-Erzählung). Der nächste Lauf sollte auch das wieder explizit
gegen den 06.09.-Maßstab prüfen, statt die Bewegung von zwei auf fünf
vorschnell als Auslöser zu werten, und außerdem prüfen, ob die
IME-Einordnung bei einem erneuten Blick weiterhin trägt oder eher als
reiner Korrektheits-Fix ohne diese Erzählung auszusortieren ist. Sollte Ni
zwischenzeitlich einen Kanal für
die Vorlesen-Funktion oder ein Social-Format freigeben, ist der Fix
`ac0e188` (Stopp-Knopf) plus der bereits am 05.09. behobene
Mikrofon-Hänger (`acc9ae8`) ein naheliegender erster Baustein, da beide
zusammen die Funktion erstmals durchgängig zuverlässig machen. Sobald 5.7
(Zug/Bus/Fähre-Anbindung) umgesetzt wird, wird zusätzlich der bereits
vorab korrigierte `TrainResults`-Ladetext (`b5fac18`, 08.09., siehe
Update 2026-09-09 oben) rückwirkend zum Tier-4-Kandidaten, da die
Komponente dann erstmals einen echten Nutzerpfad hat. Stand 09.16/09.17
sind vier weitere Kandidaten dazugekommen (formatDuration-Tagesanzeige,
EditMode-Löschbestätigung, Mikrofon-Stopp bei zweitem Klick,
Reiseentwurf-Löschbestätigung, siehe Update 2026-09-17 oben) — zusammen
mit den fünf seit Ausgabe 3 gesammelten Kandidaten reichte der Topf mit
neun die Achter-Schwelle, deshalb wurde heute **Ausgabe 4** geschrieben
(siehe `marketing/mini-changelog-konzept.md`). Der Kandidatentopf ist
damit wieder leer; der nächste Lauf sammelt neue Funde von vorn, mit
demselben 06.09.-Maßstab (acht = genug, vier = eher nicht) als Richtwert
für eine fünfte Ausgabe. Weiterhin unverändert: erst prüfen, ob Ni
zwischenzeitlich eine der vier Fragen beantwortet hat, bevor wieder ein
neuer *Social*-Text geschrieben wird — die Selbstbeschränkung dazu gilt
unverändert weiter. Stand 09.18 ist kein neuer Kandidat dazugekommen —
seit dem letzten Merge (`a924d6f`) gab es keine einzige neue, per
`git show` verifizierte Produkt-Codeänderung, nur Berichte, Logs und ein
Daily-Status-Update (siehe Update 2026-09-18 oben). Der Topf bleibt bei
null. Zwei von Support-Chef am 17.09. gemeldete neue UX-Funde
(doppelte aria-labels bei Reiseentwürfen, Abschließen ohne Rückfrage)
werden erst zu Kandidaten, sobald IT-Chef sie tatsächlich behebt — nicht
schon durch die Meldung selbst, gleiche Regel wie bei früheren
Support-Chef-Funden. Stand 09.21 ist genau einer dieser beiden Funde
umgesetzt und gezählt worden (`4123ccc`, Reiseentwürfe-Abschließen-
Bestätigung, siehe Update 2026-09-21 oben) — der andere (doppelte
aria-labels) wurde zwar ebenfalls behoben (`6a12606`), fällt aber wie
schon der strukturell identische `b07e3aa` vom 18.09. in die
ausgeschlossene reine Barrierefreiheits-Gruppe. Der Topf steht damit bei
eins, deutlich unter der Achter-Schwelle und auch unter der Menge (vier),
die selbst am 06.09. als "nicht ausreichend" galt — für eine fünfte
Mini-Changelog-Ausgabe muss weiter gesammelt werden. Die verbleibenden
zwei Support-Chef-Punkte vom 18.09. (mobiles Menü — inzwischen behoben,
aber Fokus-Ausschlussgruppe; `/hilfe`-Seite — weiterhin unverändert)
bleiben entsprechend außen vor. Der nächste Lauf sollte weiterhin zuerst
die vier offenen Fragen gegenprüfen, bevor er neue Inhalte erstellt, und
den Kandidatentopf (Stand 21.09: eins) gegen den etablierten
06.09.-Maßstab (acht = genug, vier = eher nicht) weiterführen. Stand 23.09.
sind zwei weitere Kandidaten dazugekommen (misleading CTA "Planung
fortsetzen" nach Abschließen ausgeblendet, "Details ansehen" für
abgeschlossene Reiseentwürfe — beide aus demselben, mit dem 22.09.-Merge
erst nach `main` gelangten `it-chef/auto`-Fund, siehe Update 2026-09-23
oben) — der Topf steht damit bei drei, weiterhin klar unter der
Achter-Schwelle und auch unter der Menge (vier), die selbst am 06.09. als
"nicht ausreichend" galt. Zwei am selben Tag geprüfte `role="alert"`-Fixes
wurden bewusst nicht aufgenommen (reine Screenreader-Ankündigung, gleiche
Ausschlussgruppe wie die bereits ausgeschlossenen `role="status"`-Fixes).
Der nächste Lauf sollte weiterhin zuerst die vier offenen Fragen
gegenprüfen und den Kandidatentopf (Stand 23.09: drei) gegen denselben
06.09.-Maßstab weiterführen.
