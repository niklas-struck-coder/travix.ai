# Freigabe-Übersicht — was liegt bereit, was blockiert (Stand 2026-08-21)

Kein neuer Content-Text — dieses Dokument sortiert die sechs bereits
fertigen Entwürfe in `marketing/`, damit die eigentliche Bremse (nicht
neue Ideen, sondern Freigabe/Priorisierung durch Ni) leichter zu lösen
ist. Erstellt/aktualisiert werden nur diese Übersicht, nichts wird
gepostet oder verändert.

## Warum dieses Dokument statt eines siebten Content-Stücks

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
- Alle sechs Entwürfe auf explizite Behauptungen zur Chat-Flugsuche
  durchsucht (`grep -i "flug"`/`"chat"`): keines der Stücke behauptet,
  dass die KI-Flugsuche im Chat bereits durchgängig funktioniert — der
  Werbe-Stopp betrifft also keines der unten gelisteten Stücke direkt,
  ist aber als generelle Leitplanke unverändert einzuhalten (z. B. bei
  künftigen Anpassungen der Texte).
- 8.8 Profil-Seite (Reisepräferenzen) kam am 20.08. neu dazu (IT-Chef
  Auto, vierter Lauf) — noch kein Content-Stück dazu, absichtlich nicht
  heute nachgeliefert (siehe Selbstbeschränkung oben), aber unten als
  möglicher künftiger Kandidat vermerkt.

## Die sechs Entwürfe, sortiert nach Freigabe-Reihenfolge

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

### Tier 2 — bewusst zurückhalten, bis eine Lücke geschlossen ist
3. **`content-stueck-warenkorb-echte-summen.md`** ("Echte Zahlen, keine
   Show", 18.08.) — `Warenkorb.tsx` zeigt weiterhin keinen "Jetzt
   buchen"-Button oder Checkout-Weg (im Bericht vom 20.08. bestätigt,
   heute per Commit-Historie erneut bestätigt: keine Änderung seit
   18.08.). Ein Post über echte Summen ohne Buchungsmöglichkeit bewirbt
   eine Sackgasse — bleibt liegen, bis 6.2 (Buchen-Button) existiert.

### Tier 3 — Grundlagen-Dokumente, keine einzelnen Posts
4. **`content-plan.md`** (10.08.) — Redaktionsplan-Rahmen, kein
   eigenständiger Post. Freigabe-Frage hier eher: passt die
   Kanal-/Frequenz-Empfehlung noch, sobald Ni tatsächlich Kanäle
   anlegt?
5. **`content-stuecke-woche1.md`** (11.08.) — zwei generische
   Einstiegs-Posts (Vorstellung, Reise-Planungs-Frust) plus ein
   Blog-Stück. Nicht an ein einzelnes, frisch fertiges Feature
   gebunden wie Tier 1/2, daher zeitlich weniger dringend, aber
   inhaltlich unverändert einsetzbar als Kanal-Eröffnung.

### Tier 4 — wiederkehrendes Format, eigene Entscheidung nötig
6. **`content-format-was-wird-gespeichert.md`** (19.08.) — Definition
   eines monatlichen Formats plus erste Ausgabe (August). Freigabe-Frage
   hier nicht nur "posten ja/nein", sondern ob das Format als
   wiederkehrende Rubrik überhaupt gewollt ist, bevor eine zweite Ausgabe
   sinnvoll wäre.

## Für Ni: die eigentliche Entscheidung

Keine dieser Prioritäten ersetzt Nis Freigabe — das kann und soll der
autonome Lauf nicht vorwegnehmen. Konkret zu entscheiden bleibt:
- Sollen LinkedIn/Instagram als Kanäle jetzt angelegt werden (Tier
  1-Stücke sind dafür bereit), oder wartet das noch auf die
  Landingpage/Warteliste (Sprint 2, weiterhin offen)?
- Bleibt Warenkorb-Content zurückgehalten, bis 6.2 existiert — oder soll
  6.2 (Buchen-Button) priorisiert werden, damit der bereits geschriebene
  Text nutzbar wird?
- Ist das wiederkehrende Format (Tier 4) grundsätzlich gewollt?

## Nächster autonomer Lauf
Solange sich an diesen drei Punkten nichts ändert, bleibt die
Selbstbeschränkung "kein neues Content-Stück" aus dem Bericht vom
20.08. bestehen — der nächste Lauf sollte zuerst prüfen, ob Ni
zwischenzeitlich eine der drei Fragen beantwortet hat (z. B. neue
Kanal-Links, ein Commit zu 6.2, oder eine Notiz in diesem Dokument),
bevor er wieder einen neuen Text schreibt.
