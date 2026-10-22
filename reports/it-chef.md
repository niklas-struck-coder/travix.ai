# IT-Chef Bericht

**Datum:** 2026-10-22

## Was ist seit dem letzten Eintrag (2026-10-21) passiert?

Der parallele Autonomie-Kanal `it-chef/auto` lief seit gestern noch vier
Mal: ein weiterer echter Fix (toter Urlaubsmodus-Link auf der
Lissabon-Demokarte in `MeineReisen.tsx` — die Karte verlinkte auf
`/urlaubsmodus`, ohne das `?destination=`-Query-Muster zu setzen, das die
Seite zum Laden der richtigen Demoreise braucht), danach drei Läufe ohne
neuen sicheren Fund. Dabei wurde ein `npm`-Tooling-Problem bestätigt: `npm
audit fix` schlägt in diesem Sandbox-Image bei jedem Versuch, den
Abhängigkeitsbaum zu verändern, mit demselben `TypeError` in
`@npmcli/arborist` fehl — reproduzierbar über vier unabhängige Container
hinweg, `npm ci` selbst läuft dagegen durch. Kein autonom lösbarer Punkt,
aber ein konkreter Hinweis für dich: node/npm-Version im Sandbox-Image
prüfen.

Freigabe-Chef hat `marketing-chef/auto` und `support-chef/auto` heute
geprüft und gemergt. Support-Chef hat den Urlaubsmodus-Fix im Code
gegenbestätigt (korrekt); der "+ Suchen"-Edit-Shortcut-Fix (PR #38) ist
weiterhin nicht gemergt. Marketing-Chef hat den Urlaubsmodus-Fix als
neuen Tier-4-Kandidaten aufgenommen.

**Eigene gezielte Bug-Suche heute:** Tatsächlich gelesen (nicht nur
gegrept) — `pages/Dashboard.tsx`, `pages/Einstellungen.tsx`,
`pages/Profil.tsx`, `pages/Kartenansicht.tsx`, `pages/ReiseSuche.tsx`,
`components/search/FlightWizard.tsx`, `components/search/HotelWizard.tsx`,
`components/chat/ChatInput.tsx`, `components/chat/KiChat.tsx`,
`lib/nav-config.ts`, `routes.tsx`. Dazu codeweite Suche nach TODO/FIXME
(keine), `console.log`/`console.debug`/`console.warn` (keine), leeren
`catch`-Blöcken (keine neuen) und ungeschütztem `JSON.parse` (einziger
Fall weiterhin `tripStorage.ts`, bereits abgesichert). Alle Nav-Einträge
aus `nav-config.ts` haben eine passende Route in `routes.tsx` — keine
toten Links.

**Ergebnis:** Keinen neuen Bug gefunden. Die heute gelesenen Bereiche
(mehrere bisher nicht im Detail geprüfte Seiten/Formulare) sind
durchgängig sauber: Formulareingaben validiert (IATA-Codes,
Passagier-/Gästezahl gegen NaN abgesichert, Datumsreihenfolge), kein
totes/unvalidiertes State, keine fehlende Fehlerbehandlung.

## Automatisch gefixt (PR wartet auf Review)

Keiner. Heute kein neuer Bug gefunden, der sicher und klein genug für
einen automatischen Fix gewesen wäre.

[PR #38](https://github.com/niklas-struck-coder/travix.ai/pull/38)
("+ Suchen" ignoriert Edit-Shortcut) und
[PR #34](https://github.com/niklas-struck-coder/travix.ai/pull/34)
(`formatTime()` zeigt "Invalid Date") warten beide weiterhin auf Review
— beide Fixes bestehen fertig auf ihren Branches, sind aber in `main`
noch nicht wirksam.

## Gefundene Bugs (nicht automatisch gefixt)

Beide Punkte weiterhin unverändert offen, heute im Code gegengeprüft —
der Fix erfordert eine echte Produktabwägung statt eines Ein-Zeilers:

1. **Lösch-Warnungen klingen überall gleich dramatisch.**
   `Favoriten.tsx`, `Warenkorb.tsx`, `Preisalarme.tsx`, `Aktivitaeten.tsx`,
   `Angebote.tsx`, `Reiseentwuerfe.tsx` und `EditMode.tsx` verwenden
   wortgleich "Das lässt sich nicht rückgängig machen" — auch dort, wo
   eine Aktion trivial wiederherstellbar ist.
2. **Reise-Checkliste hat keine Persistenz.** Die manuell abhakbaren
   Vorbereitungspunkte in `ChecklistPanel.tsx` leben nur in `useState`,
   nicht in `tripStorage.ts`/`localStorage` — ein Reload setzt alle
   Häkchen kommentarlos zurück. Bewusst zurückgestellt, bis die
   Nutzerkonten-/Backend-Entscheidung gefallen ist (laut Kommentar im
   Code) — als reine Erweiterung kein Ein-Zeiler für diesen Kanal.

(Der dritte, bisher hier gelistete Punkt — Urlaubsmodus auf falschem/
leerem Chat — ist seit dem 10-21-Fix des `it-chef/auto`-Kanals behoben
und entfällt.)

## Weitere Vorschläge

1. **27 offene Auto-Fix-PRs** auf GitHub, Stand grob unverändert zu
   gestern. Mehrere ältere sind inhaltlich schon identisch in `main`,
   weil derselbe Fund später über `it-chef/auto` nochmal griff. Nur du
   kannst PRs schließen; eine Stichprobenprüfung vor dem Schließen lohnt
   sich weiterhin.
2. **npm/Node-Version im Sandbox-Image prüfen.** `npm audit fix` scheitert
   dort reproduzierbar (vier von vier Versuchen) an einem internen Fehler
   in `@npmcli/arborist`, sobald der Abhängigkeitsbaum verändert werden
   soll — betrifft auch andere Abhängigkeitsänderungen, nicht nur den
   Audit-Fix. Blockiert aktuell einen bekannten, kleinen vitest-Audit-Fix.
3. **`recharts` ist weiterhin eine ungenutzte Abhängigkeit** in
   `package.json` — kein Import irgendwo in `src/`. Entfernen reduziert
   die Bundle-Größe; Abhängigkeitsänderungen sind für diesen Kanal
   ausgeschlossen, daher nur Vorschlag.
4. **`TrainCard`/`TrainResults` bleiben unverdrahteter toter Code.**
   Vollständig implementiert mit eigener Testabdeckung, aber keine
   Zugsuche-Seite, kein Nav-Eintrag, keine echte Datenquelle angebunden.
   Entweder verdrahten oder entfernen — Produktentscheidung.

_Letztes Update: 2026-10-22_
