# Support-Chef Bericht

**Datum:** 2026-09-26

## Was ist seit dem letzten Eintrag (2026-09-25) passiert?

Einer der drei offenen Punkte ist erledigt, bei einem zweiten hat sich
die Einordnung geändert, und dazu kommt ein frischer Fund von heute.

- **Hin-/Rückflug-Labels: behoben.** `src/components/search/FlightCard.tsx:43-47`
  zeigt jetzt pro Flugabschnitt "Hinflug"/"Rückflug" samt Datum statt nur
  der nackten Uhrzeit. Damit ist klar, welcher Abschnitt was ist und an
  welchem Tag er stattfindet.
- **IATA-Code statt Klarname: bewusste Design-Entscheidung, kein
  offener Bug mehr.** `FlightCard.tsx:45,50` zeigt weiterhin "BER" statt
  "Berlin". Neu ist: `FlightCard.test.tsx:47-48` verankert diese
  IATA-Anzeige inzwischen explizit als erwartetes Verhalten. Der Punkt
  bleibt mein Vorschlag (siehe unten), ist aber keine Umsetzungslücke
  mehr, sondern eine offene Formatfrage, die eine bewusste Entscheidung
  braucht.
- **Hilfe-Seite:** unverändert offen, dazu unten mehr.

## Meine Vorschläge

1. **Neu heute: Beim ersten Chat-Schritt fehlt "Mietwagen" als
   Klick-Option, obwohl der Bot selbst danach fragt.**
   `src/lib/ai/mockAdvisor.ts:76` fragt im Begrüßungstext wörtlich "Wie
   möchtest du anreisen — Zug, Flug, Bus, Fähre oder Mietwagen?", das
   dazugehörige `quickReplies`-Array listet aber nur `['Zug', 'Flug',
   'Bus', 'Fähre']` — "Mietwagen" fehlt als Button. Nutzer:innen müssten
   es freihändig eintippen, obwohl der Bot es selbst vorschlägt. Der
   Fallback-Zweig direkt darunter (Zeile ~90) listet bereits korrekt alle
   fünf Optionen und zeigt, wie es sein sollte. IT-Chef hat das heute
   schon automatisch gefixt ([PR #23](https://github.com/niklas-struck-coder/travix.ai/pull/23),
   wartet noch auf Ni's Review) — aus Support-Sicht ein klarer Gewinn,
   sobald gemerged: eine Stolperstelle direkt am Einstieg in den
   Buchungsdialog weniger.

2. **Flugkarte zeigt Flughafen-Codes statt Klarnamen — jetzt eine
   bewusste Formatfrage statt eines Bugs.** `FlightCard.tsx:45,50` zeigt
   "08:00 BER" statt "08:00 Berlin", obwohl `originName`/`destinationName`
   in jeder echten Duffel-Antwort mitgeliefert werden
   (`src/lib/duffel/client.ts:96-99`, `src/types/duffel.ts:21-28`) und die
   strukturell fast identische `TrainCard.tsx:43,47` den Klarnamen bereits
   anzeigt. Wer den IATA-Code seines Ziels nicht kennt, muss auf der
   Ergebniskarte raten, ob "LIS" wirklich Lissabon ist. *Vorschlag:*
   Klarname zusätzlich zum Code anzeigen (z. B. "08:00 Berlin (BER)").
   Da inzwischen ein Test die reine Code-Anzeige verankert, braucht eine
   Änderung hier einmal eine bewusste Entscheidung von dir statt eines
   automatischen Fixes.

3. **Hilfe-Seite (`/hilfe`) bleibt eine Sackgasse.**
   `src/pages/PlaceholderPage.tsx:16` zeigt weiterhin nur "Hilfe wird als
   Nächstes gebaut" — kein FAQ, kein Kontaktweg. Laut `ZEITPLAN.md` ist
   das bewusst blockiert, bis echte FAQ-Inhalte und eine echte
   Support-Adresse vorliegen, also kein Versehen. Bis dahin geht aber
   jede Person, die mit einem echten Problem dort landet, leer aus.
   *Vorschlag bleibt:* sobald es eine echte Kontaktadresse gibt, reicht
   vorerst ein Satz mit dem konkreten nächsten Schritt statt der
   kompletten FAQ.
