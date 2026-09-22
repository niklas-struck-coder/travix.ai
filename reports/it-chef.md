# IT-Chef Bericht

**Datum:** 2026-09-22

## Was ist seit dem letzten Eintrag (2026-09-21) passiert?

Auf `main` sind seit dem letzten Bericht mehrere Merges aus den
separaten Autonomiekanälen gelandet: `it-chef/auto` (role="alert" auf
den Fehlermeldungen in `Flugsuche.tsx`/`Hotelsuche.tsx` sowie
Ausblenden des "Planung fortsetzen"-Buttons bei bereits abgeschlossenen
Reiseentwürfen in `Reiseentwuerfe.tsx`), dazu Berichte von
Marketing-Chef und Support-Chef samt ihrer `/auto`-Branches. Der
Freigabe-Chef hat alle drei unabhängig geprüft und gemergt. Details zu
diesen Fixes stehen in `it-chef-auto-log.md`, nicht hier, da sie aus dem
`it-chef-eigen`-Kanal stammen und nicht aus diesem.

Eigene gezielte Bug-Suche in dieser Session: Ich habe einen
Recherche-Agenten 28 bisher in keinem Bericht im Detail gelesene
Dateien vollständig durchgehen lassen (u. a. `mockAdvisor.ts`,
`mockConcierge.ts`, `speech.ts`, `duffel/client.ts`, `calendarUtils.ts`,
`checklistRules.ts`, `cartTotals.ts`, `calculateProgress.ts`,
`format.ts`, `useConcierge.ts`, `ChatMessage.tsx`, `QuickReplies.tsx`,
`TripSummaryCard.tsx`, `ChecklistPanel.tsx`, sowie die
Demo-Daten-Seiten Dashboard, Kalender, Kartenansicht, Warenkorb,
Aktivitäten, Angebote, Favoriten, Preisalarme, Profil, Einstellungen,
ReiseSuche, MeineReisen, Sidebar, PageHeader, PageTransition) und
Aufrufstellen gegengeprüft, statt nur zu grep'en. Ergebnis: kein neuer,
tatsächlich erreichbarer Bug — die zuvor bekannten Fehler in diesen
Dateien (Sprachausgabe stoppen, Währungscode-Absturz, Wortgrenzen in
den Regex-Erkennungen u. a.) sind bereits behoben bzw. liegen als PR
vor. Zusätzlich selbst `dialog.tsx`, `sheet.tsx` und `MobileNav.tsx`
gelesen (neuere UI-Bausteine mit Fokus-Management) — sauber
implementiert, keine Auffälligkeiten.

Eine vermutete Dateninkonsistenz kurz gegengeprüft: Der Kyoto-Eintrag in
`Dashboard.tsx`/`Reiseentwuerfe.tsx` (Entwurf, "3.–10. März **2027**")
und der Kyoto-Eintrag in `MeineReisen.tsx`/`Kalender.tsx` (gebucht,
"3.–10. März **2026**", Status "vergangen") sehen auf den ersten Blick
widersprüchlich aus, sind bei genauerem Lesen aber zwei unterschiedliche
Reisen (eine bereits abgeschlossene gebuchte Reise vs. ein neuer
Entwurf für eine zukünftige Reise) — kein Fehler, daher nicht als Bug
gelistet.

## Automatisch gefixt (PR wartet auf Review)

Keine. In dieser Session wurde kein Bug gefunden, der die
Sicherheits-Kriterien (eindeutig, klein, isoliert, risikoarm) erfüllt.

## Gefundene Bugs (nicht automatisch gefixt)

Keine neuen. Weiterhin offen: 19 ältere Auto-Fix-PRs (#1, #4–#18, #20,
#21, #22) warten auf Ni's manuelle Entscheidung.

## Weitere Vorschläge

1. **PR-Aufräumung, weiterhin 19 offene Auto-Fix-PRs.**
   [#1](https://github.com/niklas-struck-coder/travix.ai/pull/1),
   [#4](https://github.com/niklas-struck-coder/travix.ai/pull/4)–[#18](https://github.com/niklas-struck-coder/travix.ai/pull/18),
   [#20](https://github.com/niklas-struck-coder/travix.ai/pull/20)–[#22](https://github.com/niklas-struck-coder/travix.ai/pull/22).
   Reine Aufräumarbeit ohne Coderisiko, aber nur Ni kann PRs mergen
   oder schließen.
2. **`recharts` ist eine ungenutzte Abhängigkeit.** In `package.json`
   gelistet, aber `grep` findet keinen einzigen Import in `src/` — im
   Gegensatz zu `leaflet`/`react-leaflet`, die in `Kartenansicht.tsx`
   tatsächlich verwendet werden. Entfernen würde die Bundle-Größe
   reduzieren; reine Aufräumarbeit, kein Bugfix, daher hier nur als
   Vorschlag und nicht automatisch umgesetzt (Abhängigkeitsänderungen
   sind für diesen Kanal ausgeschlossen).
3. **`TrainCard`/`TrainResults` weiterhin unverdrahteter toter Code.**
   Unverändert seit mehreren Berichten: keine Zugsuche-Seite, kein
   Nav-Eintrag, keine echte Datenquelle — nur in der eigenen Testdatei
   referenziert. Entweder verdrahten oder entfernen, Produktentscheidung.

_Letztes Update: 2026-09-22_
