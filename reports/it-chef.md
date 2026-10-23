# IT-Chef Bericht

**Datum:** 2026-10-23

## Was ist seit dem letzten Eintrag (2026-10-22) passiert?

Der parallele Autonomie-Kanal `it-chef/auto` lief seit gestern noch
mehrmals (inzwischen Lauf 14 bis 18) — nach dem Fix vom vierzehnten Lauf
(Entwurf-abschließen-Dialog von destruktivem Rot auf Teal/ehrlichen Text
umgestellt) ausschließlich ohne neuen sicheren Fund, trotz wechselnder
Suchschwerpunkte (Event-Listener-Leaks, `aria-label` an Icon-Buttons,
`dangerouslySetInnerHTML`, Locale-Formatierung, `parseInt`-Radix,
`<img>`-Alt-Texte, `href="#"`-Platzhalter — durchgehend sauber). Der
bekannte `npm`-Tooling-Bug (`npm audit fix` scheitert im Sandbox-Image
reproduzierbar an einem `TypeError` in `@npmcli/arborist`) besteht
unverändert fort.

Support-Chef hat den Entwurf-abschließen-Dialog-Fix im Code
gegenbestätigt (korrekt umgesetzt). Marketing-Chef hat ihn als
Tier-4-Kandidaten Nr. 64 aufgenommen und damit die Achter-Schwelle für
die nächste Mini-Changelog-Ausgabe erreicht. Freigabe-Chef hat
`marketing-chef/auto` und `support-chef/auto` seitdem zweimal geprüft und
nach `main` gemergt.

**Eigene gezielte Bug-Suche heute:** Tatsächlich gelesen (nicht nur
gegrept) — `lib/format.ts`, `lib/trip/cartTotals.ts`,
`lib/trip/calculateProgress.ts`, `lib/trip/calendarUtils.ts`,
`lib/trip/checklistRules.ts`, `lib/ai/mockAdvisor.ts`,
`lib/ai/mockConcierge.ts`, `lib/ai/speech.ts`, `lib/duffel/client.ts`,
`hooks/useChat.ts`, `hooks/useConcierge.ts`, `pages/Home.tsx`,
`components/chat/ChatInput.tsx`, `components/chat/QuickReplies.tsx`,
`components/chat/KiChat.tsx` (Edit-/Destination-Query-Param-Handling),
`components/search/NoResultsMessage.tsx`,
`components/search/SearchErrorAlert.tsx`. Dazu codeweite Suche nach
TODO/FIXME/XXX/HACK (keine), `console.log`/`console.debug` (keine),
leeren `catch`-Blöcken (keine). Alle fünf Stellen mit `catch` im Code
(`useChat.ts`, `speech.ts`, `tripStorage.ts`, `format.ts`,
`duffel/client.ts`) einzeln geprüft — jede fängt einen echten, konkreten
Fehlerfall ab und zeigt eine ehrliche deutsche Meldung statt des rohen
Fehlers.

**Ergebnis:** Keinen neuen Bug gefunden. `useChat.ts`/`useConcierge.ts`
räumen ihre `setTimeout`-Refs beim Unmount korrekt ab, Stale-Search-
Schutz (`searchGenerationRef`) ist für Flug- und Unterkunftssuche
durchgängig verdrahtet, die `?destination=`/`?edit=`-Query-Param-Logik in
`KiChat.tsx` ist gegen Race Conditions (Begrüßung noch nicht da, Trip
schon vorhanden) abgesichert. Die beiden offenen Funde aus dem letzten
Bericht (siehe unten) heute im Code gegengeprüft — beide weiterhin
unverändert vorhanden.

## Automatisch gefixt (PR wartet auf Review)

Keine. Heute kein neuer Bug gefunden, der sicher und klein genug für
einen automatischen Fix gewesen wäre.

[PR #38](https://github.com/niklas-struck-coder/travix.ai/pull/38)
("+ Suchen" ignoriert Edit-Shortcut) und
[PR #34](https://github.com/niklas-struck-coder/travix.ai/pull/34)
(`formatTime()` zeigt "Invalid Date") warten weiterhin auf Review —
beide Fixes bestehen fertig auf ihren Branches, sind aber in `main`
noch nicht wirksam.

## Gefundene Bugs (nicht automatisch gefixt)

Beide Punkte heute im Code gegengeprüft, unverändert offen — der Fix
erfordert eine echte Produktabwägung statt eines Ein-Zeilers:

1. **Lösch-Warnungen klingen überall gleich dramatisch.**
   `Favoriten.tsx`, `Warenkorb.tsx`, `Preisalarme.tsx`,
   `Aktivitaeten.tsx`, `Angebote.tsx`, `Reiseentwuerfe.tsx` und
   `EditMode.tsx` verwenden wortgleich "Das lässt sich nicht rückgängig
   machen" — auch dort, wo eine Aktion trivial wiederherstellbar ist.
2. **Reise-Checkliste hat keine Persistenz.** Die manuell abhakbaren
   Vorbereitungspunkte in `ChecklistPanel.tsx` leben nur in `useState`
   (bestätigt: kein `tripStorage.ts`/`localStorage`-Zugriff im Code) —
   ein Reload setzt alle Häkchen kommentarlos zurück. Bewusst
   zurückgestellt, bis die Nutzerkonten-/Backend-Entscheidung gefallen
   ist — als reine Erweiterung kein Ein-Zeiler für diesen Kanal.

## Weitere Vorschläge

1. **27 offene Auto-Fix-PRs** auf GitHub, Stand unverändert zu gestern.
   Mehrere ältere sind inhaltlich schon identisch in `main`, weil
   derselbe Fund später über `it-chef/auto` nochmal griff. Nur du kannst
   PRs schließen; eine Stichprobenprüfung vor dem Schließen lohnt sich
   weiterhin.
2. **npm/Node-Version im Sandbox-Image prüfen.** `npm audit fix`
   scheitert dort weiterhin reproduzierbar an einem internen Fehler in
   `@npmcli/arborist`, sobald der Abhängigkeitsbaum verändert werden
   soll. Blockiert aktuell einen bekannten, kleinen vitest-Audit-Fix.
3. **`recharts` ist weiterhin eine ungenutzte Abhängigkeit** in
   `package.json` — kein Import irgendwo in `src/`. Entfernen reduziert
   die Bundle-Größe; Abhängigkeitsänderungen sind für diesen Kanal
   ausgeschlossen, daher nur Vorschlag.
4. **`TrainCard`/`TrainResults` bleiben unverdrahteter toter Code.**
   Vollständig implementiert mit eigener Testabdeckung, aber keine
   Zugsuche-Seite, kein Nav-Eintrag, keine echte Datenquelle angebunden.
   Entweder verdrahten oder entfernen — Produktentscheidung.

_Letztes Update: 2026-10-23_
