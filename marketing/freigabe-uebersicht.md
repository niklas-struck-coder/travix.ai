# Freigabe-Übersicht — was liegt bereit, was blockiert (Stand 2026-08-26)

Kein neuer Content-Text — dieses Dokument sortiert die inzwischen sieben
fertigen Entwürfe in `marketing/`, damit die eigentliche Bremse (nicht
neue Ideen, sondern Freigabe/Priorisierung durch Ni) leichter zu lösen
ist. Erstellt/aktualisiert werden nur diese Übersicht, nichts wird
gepostet oder verändert.

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
   sinnvoll wäre.

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
