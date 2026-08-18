# Marketing-Chef Auto-Log

Log der täglichen autonomen Cloud-Läufe auf Branch `marketing-chef/auto`.
Jeder Eintrag: Datum, was entworfen wurde, warum dieser Punkt, ggf. warum
nichts gemacht wurde.

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
