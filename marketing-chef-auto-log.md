# Marketing-Chef Auto-Log

Log der täglichen autonomen Cloud-Läufe auf Branch `marketing-chef/auto`.
Jeder Eintrag: Datum, was entworfen wurde, warum dieser Punkt, ggf. warum
nichts gemacht wurde.

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
