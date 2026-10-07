# Zeitplan travix.ai

Zuletzt aktualisiert: 2026-08-09 von Lina

## Annahmen (bitte bestätigen)
- Tempo: Teilzeit, grob 10-15 Std./Woche, KI-unterstützt. Reine Annahme,
  keine bekannte Tatsache über Nis Kapazität — bei Abweichung bitte
  korrigieren, dann werden alle Daten neu gerechnet.
- Scope jetzt: **voller PRD-Funktionsumfang** (`tasks/tasks-prd-travix-platform.md`),
  nicht mehr nur MVP — auf Wunsch von Ni. Das verschiebt den vorherigen
  MVP-Vorschlag (04.10.) auf das neue Zieldatum unten.

## Release-Datum
**1. Dezember 2026** (~16 Wochen ab heute, 09.08.2026)

## Wie diese Datei zu benutzen ist
Jeder Punkt unten ist einem Bereich zugeordnet (Programmierung/IT-Chef,
Marketing/Marketing-Chef, Support & Recht/Support-Chef). Jeder Agent —
egal ob im Gespräch mit Ni oder im autonomen Tageslauf (siehe
`.claude/skills/it-chef-eigen/SKILL.md`) — kann sich in seinem Bereich den
nächsten offenen Punkt vornehmen. Aufgaben-Nummern (z.B. "5.4") verweisen
auf `tasks/tasks-prd-travix-platform.md` für die volle Detailbeschreibung.

Status-Symbole: ✅ fertig · 🟢 läuft/gestartet · 🟡 teilweise fertig ·
⚪ noch nicht gestartet · 🔴 blockiert/verzögert

---

## Programmierung (IT-Chef)

### Ist-Stand (Phase 1, 3, 4 — Details in tasks-prd-travix-platform.md)
- ✅ Phase 1 Scaffolding (Vite, Tailwind, shadcn/ui, Routing). Vom
  autonomen IT-Chef-Lauf am 07.09. (weiterer Lauf) den in
  `reports/it-chef.md` wiederholt vorgeschlagenen CI-Workflow ergänzt:
  neue `.github/workflows/ci.yml` (Job `test`, Trigger Pull Request und
  Push nach `main`) führt bei jedem PR `npm ci && npm run lint && npm run
  build && npm test` aus — bisher lief kein Auto-Fix-PR automatisch
  gegen Lint/Typecheck/Tests.
  Vom autonomen IT-Chef-Lauf am 23.09. eine weitere Testabdeckungslücke
  geschlossen: `src/lib/utils.ts` (die von shadcn/ui vorgegebene
  `cn()`-Hilfsfunktion zum Zusammenführen von Tailwind-Klassennamen,
  verwendet in über zehn Komponenten u. a. `button.tsx`, `card.tsx`,
  `dialog.tsx`) hatte bisher keine eigene Testdatei. Reine
  Testabdeckung für bestehendes, unverändertes Verhalten, kein neuer Bug
  gefunden. Neue `utils.test.ts` (5 Tests, Muster analog
  `format.test.ts`): einfaches Zusammenführen von Klassennamen, Auflösen
  widersprüchlicher Tailwind-Klassen (letzte gewinnt), Wegfallen von
  falsy-Werten (`false`/`undefined`/`null`), Unterstützung von Arrays/
  Objekten mit Bool-Werten, leerer String ohne Eingabe — jeweils gegen
  das tatsächliche Verhalten von `clsx`/`tailwind-merge` verifiziert statt
  angenommen.
- ✅ Phase 3 Layout/Navigation (inkl. Seitenübergangs-Animationen, heute
  vom autonomen IT-Chef-Lauf auf Branch `it-chef/auto` erledigt — noch
  nicht nach `main` gemerged). Vom autonomen IT-Chef-Lauf am 01.09.
  (achtzehnter Lauf) ein Barrierefreiheits-Fund behoben: Der Einklappen-
  Button in `Sidebar.tsx` hatte im eingeklappten Zustand keinen
  erreichbaren Namen mehr (nur noch das Icon, der Text "Einklappen" wird
  dann ausgeblendet) — Screenreader kündigten ihn als unbeschrifteten
  Button an. Jetzt ein `aria-label`, das sich analog zum bestehenden
  Muster in `Kalender.tsx`/`Reiseentwuerfe.tsx` mit dem Zustand ändert
  ("Seitenleiste einklappen"/"Seitenleiste ausklappen"). Neue
  `Sidebar.test.tsx` (bisher gab es dort keinen Test) prüft beide
  Zustände.
  Vom autonomen IT-Chef-Lauf am 12.09. eine weitere Testabdeckungslücke
  geschlossen: `PageHeader.tsx` (3.4, wiederverwendbarer Seitentitel mit
  optionaler Beschreibung und Aktionen, u. a. in `Dashboard.tsx`,
  `Favoriten.tsx`, `ReiseSuche.tsx`, `KiChat.tsx` verwendet) hatte bisher
  keine eigene Testdatei. Reine Testabdeckung für bestehendes,
  unverändertes Verhalten, kein neuer Bug gefunden. Neue
  `PageHeader.test.tsx` (3 Tests, Muster analog
  `NoResultsMessage.test.tsx`): Titel ohne Beschreibung/Aktionen, Anzeige
  der Beschreibung wenn übergeben, Anzeige der Aktionen wenn übergeben.
  Vom autonomen IT-Chef-Lauf am 12.09. (weiterer Lauf) eine weitere
  Testabdeckungslücke geschlossen: `PlaceholderPage.tsx` (3.5, Platzhalter
  für noch nicht gebaute Seiten wie Deal Finder/Reisebudget/Premium, über
  `routes.tsx` eingebunden) hatte bisher keine eigene Testdatei. Reine
  Testabdeckung für bestehendes, unverändertes Verhalten, kein neuer Bug
  gefunden. Neue `PlaceholderPage.test.tsx` (3 Tests, Muster analog
  `PageHeader.test.tsx`/`TravixAvatar.test.tsx`): Titel/Beschreibung über
  `PageHeader`, Hinweistext mit Seitentitel, sowie das übergebene Icon.
  Vom autonomen IT-Chef-Lauf am 12.09. (weiterer Lauf) einen von
  Support-Chef gemeldeten Befund behoben (siehe `reports/support-chef.md`,
  12.09., Vorschlag 1): Der Platzhaltertext in `PlaceholderPage.tsx`
  ("... Diese Seite ist Teil des Travix-Grundgerüsts.") nutzte einen
  internen Entwicklungsbegriff, der Nutzerinnen auf allen noch nicht
  gebauten Seiten (u. a. `/hilfe`, Deal Finder, Reisebudget, Premium,
  Rewards/Loyalty) angezeigt wurde. Satz ersatzlos entfernt, verbleibender
  Hinweis ("{title} wird als Nächstes gebaut.") bleibt ehrlich und ohne
  internen Jargon. Der weitergehende Teil des Vorschlags (Mailto-/
  Kontakthinweis speziell für `/hilfe`) bewusst nicht umgesetzt: Sprint 1
  "Support-E-Mail live" ist laut diesem Dokument noch nicht abgeschlossen,
  im Code existiert bisher keine echte Kontaktadresse — eine autonom
  erfundene Mailto-Adresse wäre keine reine Bugfix-Korrektur, sondern eine
  Annahme über nicht vorhandene Fakten. Bleibt offener Punkt für 8.11.
  `PlaceholderPage.test.tsx` entsprechend angepasst (Assertion ohne den
  entfernten Satz).
  Vom autonomen IT-Chef-Lauf am 04.10. (zweiter Lauf) einen über einen
  eigens dafür beauftragten Explore-Agenten gefundenen, eigenständigen Bug
  behoben: `src/routes.tsx` (`AppRoutes`) registrierte 19 feste Routen plus
  alle Platzhalter-Seiten aus `nav-config.ts`, aber keine
  `<Route path="*">` — eine unbekannte URL (Tippfehler, alter/kaputter
  Link) ließ React Router `null` rendern, `AppShell.tsx` setzt das
  ungeprüft in `<main>{children}</main>` ein, Nutzer:innen sahen also nur
  Sidebar/Hamburger-Header und einen komplett leeren Inhaltsbereich statt
  jeder Fehlermeldung. Live reproduzierbar unter jeder nicht registrierten
  Adresse. Fix: neue `src/pages/NichtGefunden.tsx` nach dem etablierten
  Empty-State-Muster (`Favoriten.tsx`/`Warenkorb.tsx`: Icon, ehrlicher
  Text ohne erfundenes Funktionsversprechen, `Button asChild`-Link zurück
  zu `/`), als `<Route path="*">` am Ende der Routenliste in `routes.tsx`
  ergänzt — keine neue Design-Entscheidung, reine Übernahme des
  bestehenden Musters. Neue `NichtGefunden.test.tsx` sowie neue
  `routes.test.tsx` (erster Test für `AppRoutes` überhaupt) — vor dem Fix
  durch temporäres Zurücknehmen der Routenänderung (`git stash` nur
  `routes.tsx`) reproduzierbar rot verifiziert (kein `<h1>` im Dokument
  unter `/does-not-exist`).
  Vom autonomen IT-Chef-Lauf am 06.10. einen eigenständig (über einen
  eigens beauftragten Explore-Agenten) gefundenen Hygiene-Punkt behoben:
  Die "Fokussiere die Seiten-`<h1>`"-Fallback-Logik beim Schließen eines
  Dialogs/Sheets (greift, wenn das ursprünglich fokussierte Element nicht
  mehr im DOM ist, z. B. nach einem "entfernen"-Klick auf dessen eigene
  Karte) lag byte-identisch doppelt vor: inline in `DialogContent`
  (`src/components/ui/dialog.tsx`) sowie als bereits aus `SheetContent`
  extrahierte, exportierte `focusPageHeading()`-Funktion in
  `src/components/ui/sheet.tsx` (zusätzlich von `MobileNav.tsx` genutzt)
  — laut diesem Log (18.09.) wurde der Fallback zuerst in `dialog.tsx`
  eingeführt, dann wortgleich nach `sheet.tsx` kopiert, aber nur dort
  später extrahiert. Fix: `focusPageHeading()` nach `src/lib/utils.ts`
  verschoben (beide Dateien importieren dieses Modul bereits), `sheet.tsx`
  und `dialog.tsx` nutzen jetzt dieselbe gemeinsame Funktion,
  `MobileNav.tsx`s Import entsprechend umgestellt. Keine
  Verhaltensänderung, gleiche Konsolidierungs-Kategorie wie zuvor
  `formatEuro()`/`formatOfferPrice()`/`formatDuration()`. Neue, direkte
  `focusPageHeading`-Testgruppe in `utils.test.ts` (3 Tests) — bestehender
  Verhaltenstest in `dialog.test.tsx` blieb unverändert grün.
- 🟡 Phase 4 KI-Chat — UI komplett fertig (4.4-4.14), läuft aber noch auf
  lokalem Mock-Advisor statt echter KI (4.1-4.3 offen, s.u.). Vom
  autonomen IT-Chef-Lauf am 02.09. (einundzwanzigster Lauf) ein
  eigenständig gefundener Bug in `useChat.ts` behoben: `resetChat()`
  setzte `stayLoading`/`flightLoading` nicht zurück — lief beim Klick auf
  "Neue Reise planen" noch eine Unterkunfts-/Flugsuche, blieb der frisch
  gestartete Chat im "sucht"-Zustand hängen und bekam später sogar die
  Ergebnisse/den Fehler der vorherigen Reiseplanung angezeigt. Beide
  fehlenden Resets ergänzt, zwei neue Regressionstests in
  `useChat.test.ts`. Vom autonomen IT-Chef-Lauf am 04.09.
  (dreiunddreißigster Lauf) einen von `reports/it-chef.md` (03.09.)
  gemeldeten Fund gezielt entschärft: `loadStoredChat()`
  (`tripStorage.ts`) castet den geparsten localStorage-Wert nur (`as
  StoredChatState`), ohne ihn zu prüfen — `hasTripData()` griff danach
  ungeschützt auf `activities.length` zu. Fehlt `activities` (Alt-Daten
  aus einer früheren Version, halb geschriebener Wert), wirft das einen
  `TypeError` mitten im Rendern von `KiChat.tsx`, `Buchung.tsx` und
  `Kartenansicht.tsx` — ohne ErrorBoundary bleibt die Seite dann leer.
  Nur der im Bericht selbst als klein markierte Teilfix: `hasTripData`
  prüft jetzt zusätzlich `Array.isArray(activities)`, bevor auf
  `.length` zugegriffen wird. Das von `reports/it-chef.md` ebenfalls
  vorgeschlagene "normalisierende Laden" (mehrere Stellen betroffen,
  eigene Design-Entscheidung nötig) bleibt bewusst offen für einen
  künftigen, eigenständigen Lauf. Drei neue Regressionstests in
  `tripStorage.test.ts` (fehlendes `activities`-Feld wirft nicht mehr,
  liefert `false` bzw. weiterhin `true`, wenn echte Aktivitäten
  vorhanden sind).
  Vom autonomen IT-Chef-Lauf am 06.09. (weiterer Lauf) das damals offen
  gelassene "normalisierende Laden" nachgeholt: ein bereits über einen
  offenen, aber noch nicht gemergten Auto-Fix-PR (#18,
  `it-chef-autofix/trip-activities-undefined-2026-09-05`) vollständig
  diagnostizierter Bug direkt auf `it-chef/auto` behoben.
  `loadStoredChat()` (`tripStorage.ts`) gab `trip.activities` bisher
  ungeprüft durch — der frühere Teilfix (33. Lauf) schützte nur
  `hasTripData()` selbst, nicht die eigentlichen Konsumenten. Sobald
  `hasTripData()` `true` liefert (reicht z. B. schon, wenn nur
  `destination` gesetzt ist), lasen `Buchung.tsx:255`,
  `checklistRules.ts:48` und `EditMode.tsx` weiterhin ungeschützt
  `trip.activities.length` — bei einem Alt-/korrupten Reiseplan ohne
  dieses Feld ein `TypeError`, der die Buchungsseite mitten im Rendern
  abreißen ließ. Fix: `loadStoredChat()` normalisiert `trip.activities`
  beim Laden jetzt immer auf ein Array (`Array.isArray(...) ? ... : []`),
  statt den rohen `JSON.parse`-Wert durchzureichen — behebt damit alle
  drei Konsumenten an der gemeinsamen Datenquelle, keine
  Verhaltensänderung für normale (vollständige) Trips. Neuer
  Regressionstest in `tripStorage.test.ts` (fehlendes `activities`-Feld
  im gespeicherten Zustand wird beim Laden zu `[]` normalisiert). Der
  ursprüngliche Auto-Fix-PR #18 bleibt als überholt zurück (kann bei
  nächster PR-Hygiene-Aufräumung geschlossen werden, wie in
  `reports/it-chef.md` bereits für andere Altbranches vorgeschlagen).
  Vom autonomen IT-Chef-Lauf am 07.09. (weiterer Lauf) Vorschlag 2 aus
  `reports/support-chef.md` (06.09.) behoben: Kennt travix.ai das
  genannte Reiseziel nicht für die automatische Unterkunftssuche
  (`findKnownDestination()` liefert `null`, z. B. bei "Bali"), sagte
  `getNextAdvisorStep()` (`mockAdvisor.ts`) trotzdem unbedingt "Ich suche
  jetzt nach echten Unterkünften in {Ziel}" samt Chips
  `Hotel`/`Ferienwohnung`/`Hostel` — direkt gefolgt von der gegenteiligen
  Ehrlichkeits-Meldung aus `useChat.ts` ("kenne ich noch keine
  Unterkünfte … nutze die manuelle Hotelsuche"), ohne dass die zuvor
  gezeigten, inzwischen wirkungslosen Chips zurückgenommen wurden. Fix:
  `getNextAdvisorStep()` prüft das Ziel jetzt selbst über
  `findKnownDestination()`, bevor die Antwort formuliert wird — bei
  unbekanntem Ziel eine ehrliche Zwischenantwort ohne Suchversprechen,
  `avatarState: 'thinking'` statt `'searching'`, leere `quickReplies`
  statt der drei wirkungslosen Chips (kein neuer Chip erfunden, die
  Nutzerin kann wie bei anderen Freitext-Feldern einfach weiterschreiben).
  `useChat.ts` selbst brauchte keine Änderung, da dessen Ehrlichkeits-
  Meldung weder `avatarState` noch `quickReplies` überschreibt. Zwei neue
  Regressionstests in `mockAdvisor.test.ts` (bekanntes vs. nicht
  kuratiertes Ziel).
  Vom autonomen IT-Chef-Lauf am 09.09. Vorschlag 1 aus
  `reports/support-chef.md` (09.09.) behoben: Der "Neu starten"-Knopf im
  Chat-Header (`KiChat.tsx`) war ein reines Icon ohne sichtbaren Text und
  löste `resetChat()` (kompletter Chatverlauf, Reiseplan und der
  `localStorage`-Eintrag weg) mit einem einzigen Klick sofort aus — ohne
  Rückfrage, ohne Rückgängig. Ein Fehlklick (z. B. auf dem Handy neben dem
  Lautsprecher-Icon) verliert damit unwiderruflich eine möglicherweise
  lange Planung. Fix: Der Knopf öffnet jetzt einen Bestätigungsdialog
  (bestehende `Dialog`-Komponente, gleiches Muster wie in `EditMode.tsx`/
  `Buchung.tsx`) mit exakt dem im Bericht vorgeschlagenen Hinweistext
  ("Neu starten?" / "Deine aktuelle Planung geht verloren."), erst ein
  zweiter Klick auf "Ja, neu starten" (destructive-Button) löst den
  eigentlichen Reset aus; "Abbrechen" schließt den Dialog ohne Änderung.
  Der separate "Neue Reise planen"-Quick-Reply-Chip (Textbutton, bewusste
  Aktion statt Fehlklick-Risiko) bleibt unverändert ohne Bestätigung, da
  der Bericht sich ausdrücklich nur auf den Icon-Knopf bezog. Bestehender
  Test in `KiChat.test.tsx` auf den zusätzlichen Bestätigungsklick
  angepasst, zwei neue Tests dort (Dialog erscheint vor dem Reset ohne
  ihn auszulösen; Abbrechen verwirft den Reset).
  Vom autonomen IT-Chef-Lauf am 10.09. eine fehlende Testdatei nachgezogen:
  `TravixAvatar.tsx` (4.4, 6 animierte Zustände) hatte trotz expliziter
  Erwähnung im Tests-Abschnitt von `tasks/tasks-prd-travix-platform.md`
  ("Avatar state rendering tests") bisher keine eigene Testdatei — reine
  Testabdeckungslücke, keine Verhaltensänderung nötig. Neue
  `TravixAvatar.test.tsx`: pro Zustand (idle/greeting/thinking/writing/
  searching/happy/error) wird über die von lucide-react vergebene
  CSS-Klasse (`svg.lucide-<name>`) geprüft, dass genau das richtige Icon
  gerendert wird; zusätzlich ein Test für den Puls-Ring, der nur im
  Zustand "thinking" erscheint, sowie zwei Tests für Standard- und
  explizit übergebene Größe (`sm`/`md`/`lg`).
  Vom autonomen IT-Chef-Lauf am 13.09. (weiterer Lauf) einen von
  `support-chef-auto-log.md` (10.09., Commit `a318d38`) gemeldeten und
  über mehrere Freigabe-Chef-Läufe hinweg unabhängig weiterhin bestätigten
  Fund behoben: Der "Neu starten"-Bestätigungsdialog in `KiChat.tsx` wurde
  bisher unbedingt über `DialogTrigger` geöffnet, sobald der Knopf im
  Chat-Header geklickt wurde — unabhängig vom aktuellen `trip`-Zustand.
  Direkt nach dem Laden der Seite (frischer Besuch ohne gespeicherten
  Chat) oder direkt nach einem gerade erst durchgeführten Reset ist
  `hasTripData(trip)` `false`, es gibt also nichts, was ein erneuter Klick
  tatsächlich zerstören würde — der Dialog zeigte trotzdem "Neu starten?"
  / "Deine aktuelle Planung geht verloren." an, obwohl das in diesem
  Zustand schlicht nicht stimmte, und verlangte einen unnötigen
  zusätzlichen Bestätigungsklick. Fix: exakt der im Bericht vorgeschlagene
  Ansatz — der `DialogTrigger` ist einem einfachen `onClick`-Handler
  (`handleResetClick`) gewichen, der bei `!hasTripData(trip)` direkt
  `handleReset()` aufruft und sonst wie bisher den Bestätigungsdialog
  öffnet; derselbe `hasTripData()`-Check, der in derselben Datei bereits
  an zwei anderen Stellen etabliert ist. Der separate "Neue Reise
  planen"-Quick-Reply-Chip bleibt unverändert ohne Bestätigung, wie schon
  im 09.09.-Eintrag dokumentiert. Bestehende Tests in `KiChat.test.tsx`
  auf einen Trip mit Daten (`{ ...emptyTrip, destination: 'Lissabon' }`)
  umgestellt, damit sie weiterhin den Bestätigungsdialog prüfen; ein neuer
  Test bestätigt den Direkt-Reset ohne Dialog bei `emptyTrip`.
  Vom autonomen IT-Chef-Lauf am 15.09. (fünfter Lauf) einen von
  `reports/it-chef.md` (15.09.) gemeldeten und bereits über einen offenen,
  aber noch nicht gemergten Auto-Fix-PR (#20,
  `it-chef-autofix/loadstoredchat-missing-messages-2026-09-15`)
  vollständig diagnostizierten Bug direkt auf `it-chef/auto` behoben:
  `loadStoredChat()` (`tripStorage.ts`) normalisierte bisher nur
  `trip.activities` gegen fehlende Felder in legacy/korrupten
  `localStorage`-Daten (siehe 04.09.-Eintrag oben), nicht aber `messages`
  und `quickReplies` — obwohl `useChat.ts` direkt nach dem Laden
  ungeschützt `stored.messages.length` liest und `QuickReplies.tsx`
  `options.length` auf `quickReplies` aufruft. Fehlt eines der beiden
  Felder (Alt-Daten, halb geschriebener Wert), wirft das einen
  `TypeError` beim Laden eines gespeicherten Chats. Fix: exakt dasselbe
  bereits etablierte `Array.isArray(...) ? ... : []`-Muster zusätzlich
  auf `messages` und `quickReplies` angewendet. Zwei neue
  Regressionstests in `tripStorage.test.ts` (fehlendes `messages`- bzw.
  `quickReplies`-Feld wird beim Laden zu `[]` normalisiert). Der
  ursprüngliche Auto-Fix-PR #20 bleibt als überholt zurück (kann bei
  nächster PR-Hygiene-Aufräumung geschlossen werden).
  Vom autonomen IT-Chef-Lauf am 16.09. (zweiter Lauf desselben Tages)
  einen eigenständig gefundenen Bug direkt auf `it-chef/auto` behoben:
  `ChatInput.tsx` und `EditMode.tsx` (beide Enter-Handler) sendeten die
  Nachricht bzw. legten die Aktivität schon bei jedem `keydown` mit
  `key === 'Enter'` an — auch dann, wenn dieses Enter nur eine laufende
  IME-Komposition (japanische/chinesische/koreanische Eingabemethoden)
  bestätigt hat. Das schickte den halb fertig komponierten Text
  vorzeitig ab bzw. legte eine Aktivität mit unvollständigem Namen an.
  Fix: zusätzliche Prüfung `!event.nativeEvent.isComposing` in allen
  drei betroffenen `onKeyDown`-Handlern (`ChatInput.tsx` sowie beide
  Enter-Handler in `EditMode.tsx`). Vier neue Regressionstests
  (`ChatInput.test.tsx`, `EditMode.test.tsx`), die ein `keydown` mit
  `isComposing: true` simulieren und bestätigen, dass weder gesendet
  noch eine Aktivität angelegt wird.
  Vom autonomen IT-Chef-Lauf am 16.09. (dritter Lauf desselben Tages) den
  letzten noch offenen Rest aus dem alten, bereits größtenteils
  überholten Auto-Fix-PR-Branch
  `it-chef-autofix/localstorage-write-unprotected-2026-08-12` nachgezogen:
  drei der vier ursprünglich ungeschützten `localStorage`-Zugriffe sind
  seither bereits über `saveStoredChat()` (`tripStorage.ts`) abgesichert,
  `resetChat()` (`useChat.ts`) rief `localStorage.removeItem(...)` aber
  weiterhin direkt und ungeschützt auf — bei vollem Speicher, deaktiviertem
  Storage oder in restriktiven Webviews hätte das mitten in der
  "Neu starten?"/"Neue Reise planen"-Aktion geworfen und den (an sich rein
  im Speicher stattfindenden) Reset abgebrochen. Fix: neue
  `clearStoredChat()`-Hilfsfunktion in `tripStorage.ts`, exakt nach dem
  bestehenden `saveStoredChat()`-Muster (Aufruf in `try`/`catch`, Fehler nur
  geloggt statt geworfen); `resetChat()` nutzt sie jetzt statt des rohen
  `localStorage.removeItem`-Aufrufs. Drei neue Regressionstests (zwei in
  `tripStorage.test.ts` für `clearStoredChat()` selbst, einer in
  `useChat.test.ts`, der `Storage.prototype.removeItem` werfen lässt und
  bestätigt, dass `resetChat()` trotzdem nicht wirft und den Chat auf die
  Begrüßungsnachricht zurücksetzt). Der ursprüngliche Auto-Fix-PR-Branch
  bleibt als vollständig überholt zurück (kann bei nächster
  PR-Hygiene-Aufräumung gelöscht werden).
  Vom autonomen IT-Chef-Lauf am 16.09. (fünfter Lauf desselben Tages) einen
  von `reports/support-chef.md` (16.09., Vorschlag 1) gemeldeten
  Reibungspunkt behoben: Der Papierkorb-Button in `EditMode.tsx`
  (Aktivität im Bearbeiten-Dialog löschen, erreichbar u. a. über
  `Buchung.tsx`) entfernte eine Aktivität bisher sofort und endgültig,
  ohne Rückfrage — anders als dasselbe Löschen auf der
  Aktivitäten-Übersichtsseite (`/aktivitaeten`), das bereits über das
  etablierte Bestätigungsdialog-Muster abgesichert ist (siehe
  `Aktivitaeten.tsx`). Fix: exakt dasselbe Muster übernommen — ein
  zweiter, per `pendingRemoval`-State gesteuerter Dialog
  ("Aktivität entfernen?"/"Ja, entfernen"/"Abbrechen"), kein neuer
  Entwurf. Zwei neue Regressionstests in `EditMode.test.tsx` (Klick auf
  "entfernen" öffnet die Bestätigung ohne sofortige Änderung; "Abbrechen"
  lässt die Aktivität unverändert), bestehender Entfernen-Test und der
  zugehörige Test in `Buchung.test.tsx` auf den zusätzlichen
  Bestätigungsklick umgestellt.
  Vom autonomen IT-Chef-Lauf am 21.09. eine Accessibility-Lücke
  geschlossen: Der "Travix denkt nach …"-Ladehinweis in `KiChat.tsx`
  (Zeile 171-176) und der identische, duplizierte Block in
  `Urlaubsmodus.tsx` (Zeile 52-57) hatten kein `role="status"`, obwohl
  `KiChat.tsx`s eigener `storageWarning`-Hinweis nur zehn Zeilen darüber
  (Zeile 160-164) genau dieses Muster für exakt dieselbe Art von Inhalt
  (kurzlebiger, sich dynamisch ändernder Statustext) bereits verwendet —
  ebenso `ChatInput.tsx`, `Buchung.tsx`, `Hotelsuche.tsx` und
  `Flugsuche.tsx`. Ohne `role="status"` (implizit `aria-live="polite"`)
  bekommen Screenreader-Nutzer:innen nicht automatisch mitgeteilt, dass
  Travix gerade eine Antwort vorbereitet. Fix: `role="status"` auf beide
  `isThinking`-Blöcke ergänzt, mechanische Übernahme des bereits im
  selben Code etablierten Musters, keine neue Design-Entscheidung. Zwei
  neue Regressionstests (`KiChat.test.tsx`: `getByRole('status')` zeigt
  den Ladehinweis, kein Status-Element ohne `isThinking`;
  `Urlaubsmodus.test.tsx`: bestehender Test auf `getByRole('status')`
  umgestellt) — vor dem Fix durch temporäres Zurücknehmen der beiden
  Quelländerungen (`git stash` nur der `.tsx`-Fixes) reproduzierbar rot
  verifiziert.
  Vom autonomen IT-Chef-Lauf am 21.09. (dritter Lauf desselben Tages)
  eine Textparität nachgezogen: `Flugsuche.tsx` (Zeile 82) rief
  `<NoResultsMessage />` ohne `title`-Prop auf und zeigte bei leeren
  Suchergebnissen (`offers.length === 0`, kein Fehler) deshalb den
  generischen Default-Text "Keine Ergebnisse gefunden" — während das
  strukturell identische `Hotelsuche.tsx` sowie `FlightResults.tsx`,
  `HotelResults.tsx` und `TrainResults.tsx` alle explizit einen
  produktbezogenen Titel setzen ("Keine Unterkünfte/Flüge/Verbindungen
  gefunden"). Live reproduzierbar über eine Suche ohne Treffer, kein
  Edge Case. Fix: `title="Keine Flüge gefunden"` ergänzt, mechanische
  Übernahme des bereits an vier anderen Stellen etablierten Musters,
  keine neue Design-Entscheidung. Neuer Regressionstest in
  `Flugsuche.test.tsx` — vor dem Fix durch temporäres Zurücknehmen der
  Quelländerung (`git stash` nur `Flugsuche.tsx`) reproduzierbar rot
  verifiziert.
  Vom autonomen IT-Chef-Lauf am 21.09. (vierter Lauf desselben Tages)
  den in `reports/it-chef.md` (21.09., PR #22) bereits vollständig
  diagnostizierten Fund direkt auf `it-chef/auto` behoben, statt auf
  den offenen Auto-Fix-PR zu warten: Der Fehlerzustand in
  `FlightResults.tsx` und `HotelResults.tsx` (fehlgeschlagene Flug-/
  Unterkunftssuche) hatte kein ARIA-Live-Region-Attribut, obwohl der
  direkt darüberliegende Ladezustand in denselben Komponenten bereits
  `role="status"` nutzt — Screenreader-Nutzer:innen bekamen einen
  Suchfehler nicht automatisch angekündigt. Fix: `role="alert"` auf
  beide Fehler-`<div>`s ergänzt, mechanische Attribut-Ergänzung ohne
  Verhaltensänderung für sehende Nutzer:innen. Anders als PR #22 (dort
  ausdrücklich als fehlend vermerkt, weil dieser Kanal keine Testläufe
  erlaubt) mit begleitenden Regressionstests: je ein neuer Test in
  `FlightResults.test.tsx`/`HotelResults.test.tsx`
  (`getByRole('alert')` zeigt die Fehlermeldung). Der ursprüngliche
  Auto-Fix-PR #22 bleibt als überholt zurück (kann bei nächster
  PR-Hygiene-Aufräumung geschlossen werden). Die strukturell identische
  Lücke im selben Fehler-Markup von `Flugsuche.tsx`/`Hotelsuche.tsx`
  bleibt bewusst unangetastet — das war nicht Teil des diagnostizierten
  Fundes, bleibt aber ein naheliegender Kandidat für einen künftigen,
  eigenständig neu bewerteten Lauf.
  Vom autonomen IT-Chef-Lauf am 21.09. (fünfter Lauf desselben Tages)
  genau diesen im vierten Lauf zurückgestellten Kandidaten umgesetzt: Der
  Fehlerzustand (fehlgeschlagene Suche) in den standalone Seiten
  `Flugsuche.tsx` (Zeile 44) und `Hotelsuche.tsx` (Zeile 43) hatte
  dasselbe fehlende ARIA-Live-Region-Attribut wie zuvor `FlightResults.tsx`/
  `HotelResults.tsx` — strukturell identisches Fehler-`<div>` (dieselben
  Klassen, derselbe `errors`-State), nur an einer anderen Stelle im Code
  (die Seiten rendern ihre eigene Fehlerbox statt die Ergebnis-Komponenten
  zu nutzen). Fix: `role="alert"` auf beide Fehler-`<div>`s ergänzt,
  mechanische Attribut-Ergänzung ohne Verhaltensänderung für sehende
  Nutzer:innen — 1:1 dasselbe Muster wie im vierten Lauf. Je ein neuer
  Regressionstest in `Flugsuche.test.tsx`/`Hotelsuche.test.tsx`
  (`getByRole('alert')` zeigt die Fehlermeldung) — vor dem Fix durch
  temporäres Zurücknehmen der Quelländerung (`git stash` nur
  `Flugsuche.tsx`/`Hotelsuche.tsx`) reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 26.09. (fünfter Lauf desselben Tages)
  einen bereits über den separaten Auto-Fix-Kanal vollständig
  diagnostizierten Fund (Auto-Fix-PR #23,
  `it-chef-autofix/mockadvisor-transportmode-mietwagen-2026-09-26`)
  direkt auf `it-chef/auto` übernommen, statt auf Ni's Review des PRs zu
  warten: Die Begrüßungstext-Frage in `mockAdvisor.ts:76` fragt explizit
  "Zug, Flug, Bus, Fähre oder Mietwagen?", das zugehörige
  `quickReplies`-Array (Zeile 78) enthielt aber nur die ersten vier
  Optionen — der Fallback-Zweig bei nicht erkannter Eingabe (Zeile 90)
  listet bereits korrekt alle fünf Optionen und diente als Vorlage. Fix:
  `'Mietwagen'` als fünfte Option ergänzt, mechanische Eine-Zeile-
  Korrektur ohne sonstige Verhaltensänderung. Neuer Regressionstest in
  `mockAdvisor.test.ts` (alle fünf Quick-Replies inkl. "Mietwagen" nach
  der Zieleingabe).
  Vom autonomen IT-Chef-Lauf am 27.09. einen in `reports/it-chef.md`
  (25.09./26.09.) als "theoretischer Randfall" vorgemerkten Verdacht bei
  `formatDuration()` bestätigt und behoben: Die gemeinsame, in
  `FlightCard.tsx` und `TrainCard.tsx` identisch dupliziert vorliegende
  Funktion parste ISO-8601-Dauern über
  `/P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?/` — das "T" vor dem Stunden-/
  Minuten-Teil war dabei zwingend im Muster, obwohl ISO 8601 es erlaubt,
  "T" ganz wegzulassen, wenn die Dauer keinen Stunden-/Minutenanteil hat
  (z. B. eine reine Tagesangabe wie "P1D"). Live reproduziert: Bei einer
  solchen Dauer schlug `.exec()` fehl (`match` war `null`), die Funktion
  fiel auf ihren Fallback zurück und zeigte den rohen ISO-String ("P1D")
  statt einer formatierten Dauer ("24h") an. Fix: das "T" in einer
  eigenen optionalen Gruppe (`(?:T(?:(\d+)H)?(?:(\d+)M)?)?`), sodass ein
  fehlender Zeitanteil weiterhin korrekt auf 0 Stunden/Minuten fällt,
  identische Änderung an beiden Stellen (keine Deduplizierung, gleiches
  Muster wie bei anderen Fixes dieser Funktion). Neuer Regressionstest je
  Datei (`FlightCard.test.tsx`, `TrainCard.test.tsx`) — vor dem Fix durch
  temporäres Zurücknehmen beider Quelländerungen (`git stash`) reproduzierbar
  rot verifiziert (zeigte "P1D" statt "24h").
  Vom autonomen IT-Chef-Lauf am 27.09. (dritter Lauf desselben Tages) einen
  über mehrere `reports/it-chef.md`-Einträge hinweg offen gebliebenen Fund
  behoben: `FlightCard.tsx` zeigte am Abflug-/Ankunftsort den rohen
  IATA-Code (z. B. "BER"/"LIS") statt eines Klarnamens — das strukturell
  identische `TrainCard.tsx` löst dasselbe Anzeigeproblem bereits korrekt
  über `offer.originName`/`offer.destinationName`. `FlightSlice`
  (`src/types/duffel.ts`) besitzt dieselben Felder, `callDuffelProxy()`
  (`src/lib/duffel/client.ts`) befüllt sie bereits aus der echten
  Duffel-Antwort — `FlightCard.tsx` griff nur versehentlich auf
  `slice.originIata`/`slice.destinationIata` statt der schon vorhandenen
  Namen zu. Fix: beide Stellen auf `slice.originName`/`slice.destinationName`
  umgestellt, mechanische Übernahme des bereits in `TrainCard.tsx`
  etablierten Musters, keine neue Design-Entscheidung. Bestehender Test in
  `FlightCard.test.tsx` umgestellt (prüft jetzt "Berlin"/"Lissabon" statt
  "BER"/"LIS") — vor dem Fix durch temporäres Zurücknehmen der
  Quelländerung (`git stash`) reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 27.09. (vierter Lauf desselben Tages)
  einen eigenständig gefundenen Bug in `detectTransportMode()`
  (`mockAdvisor.ts`) behoben: Das Stichwort `'flieg'` für Transportmittel
  "Flug" war als Wortstamm für Verbformen von "fliegen" gedacht, wurde
  aber wie alle Keywords mit Wortgrenzen `\bflieg\b` geprüft — die
  Wortgrenze direkt nach "flieg" existiert bei keiner echten Verbform
  ("fliegen", "fliege", "fliegt", "geflogen"), der Stamm matchte daher nie
  etwas und war faktisch tot. Antwortete eine Nutzerin im KI-Chat auf "Wie
  möchtest du anreisen?" natürlich mit z. B. "Wir fliegen dieses Jahr"
  statt mit dem Nomen "Flug", erkannte der Advisor das Transportmittel
  nicht und fragte stattdessen nach. Fix: `'flieg'` durch die tatsächlich
  vorkommenden vollständigen Verbformen ersetzt (`'fliegen'`, `'fliege'`,
  `'fliegt'`, `'geflogen'`) — gleiches Muster wie das bereits bestehende
  Extra-Keyword `'flughafen'`, keine neue Design-Entscheidung. Neuer
  Regressionstest in `mockAdvisor.test.ts` — vor dem Fix durch temporäres
  Zurücknehmen der Quelländerung (`git stash`) reproduzierbar rot
  verifiziert (alle vier Verbformen lieferten `null` statt `'flight'`).
  Vom autonomen IT-Chef-Lauf am 27.09. (fünfter Lauf desselben Tages) einen
  von Support-Chef (`support-chef-auto-log.md`, 27.09., Fund 1) sowie
  eigenständig in `reports/it-chef.md` (27.09., Fund 1) gemeldeten
  Fund behoben: Die Klarname-Anzeige für Abflug-/Ankunftsort in
  `FlightCard.tsx` (dritter Lauf desselben Tages, s.o.) und die
  strukturell identische Anzeige in `TrainCard.tsx` rendern
  `originName`/`destinationName` bisher ungeprüft — anders als
  `formatTime()`/`formatDuration()` direkt daneben, die beide explizit
  `if (!x) return '—'` haben. `mapSlice()` (`src/lib/duffel/client.ts`)
  setzt `originName`/`destinationName` bewusst optional (`?? ''`), eine
  echte Duffel-Antwort ohne Namensfeld ist also kein theoretischer Fall.
  Bei fehlendem Namen stünde seit dem dritten Lauf direkt neben der
  Uhrzeit schlicht nichts, wo vorher zuverlässig der IATA-Code stand.
  Fix: exakt der von Support-Chef vorgeschlagene Ansatz — neue
  `formatLocation()`-Hilfsfunktion in `FlightCard.tsx`
  (`name || iata || '—'`, fällt auf den weiterhin vorhandenen IATA-Code
  zurück, erst danach auf den Platzhalter-Strich) sowie eine gleichnamige,
  einfachere Variante in `TrainCard.tsx` (`name || '—'`, da `TrainOffer`
  keinen IATA-Code kennt). Zwei neue Regressionstests in
  `FlightCard.test.tsx` (Rückfall auf IATA-Code bei leerem Namen; Strich
  bei beidem leer) und ein neuer Test in `TrainCard.test.tsx` (Strich bei
  leerem Namen) — vor dem Fix durch temporäres Zurücknehmen beider
  Quelländerungen (`git stash`) reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 28.09. einen eigenständig gefundenen Bug
  in `detectTransportMode()` (`mockAdvisor.ts`) behoben, in derselben
  Funktion und Kategorie wie der Verbform-Fund vom 27.09.: Das Keyword-
  Array für Transportmittel "Flug" enthielt bisher nur `'flug'`,
  Verbformen von "fliegen" und `'flughafen'`, nicht aber `'flugzeug'`
  (das Substantiv für das Fahrzeug selbst). Wegen der Wortgrenzen-Prüfung
  `\bflug\b` matcht das Präfix "flug" nicht innerhalb des zusammengesetzten
  Worts "Flugzeug" (kein Wortübergang zwischen "flug" und "zeug"). Sagte
  eine Nutzerin im KI-Chat auf "Wie möchtest du anreisen?" z. B. "Wir
  nehmen lieber das Flugzeug", erkannte der Advisor das Transportmittel
  nicht, obwohl "Flugzeug" eine der natürlichsten deutschen Bezeichnungen
  für Flugreisen ist. Fix: `'flugzeug'` als weiteres Keyword ergänzt,
  gleiches Muster wie das bereits bestehende `'flughafen'`, keine neue
  Design-Entscheidung. Neuer Regressionstest in `mockAdvisor.test.ts` —
  vor dem Fix durch temporäres Zurücknehmen der Quelländerung (`git
  stash`) reproduzierbar rot verifiziert (lieferte `null` statt
  `'flight'`).
  Vom autonomen IT-Chef-Lauf am 28.09. (zweiter Lauf desselben Tages) einen
  eigenständig gefundenen Zeitzonen-Bug in `useChat.ts` behoben:
  `defaultStayDates()`/`defaultFlightDates()` (voreingestelltes
  30-Tage-Fenster für die automatische Unterkunfts-/Flugsuche, siehe
  Kommentar direkt darüber) berechneten das Zieldatum korrekt über lokale
  Datumskomponenten (`setDate(getDate() + 30/33)`), formatierten es aber
  über `date.toISOString().slice(0, 10)` — das rechnet zuerst auf UTC um.
  In Zeitzonen westlich von UTC (z. B. US/Kanada) verschiebt das am späten
  Abend das Datum künstlich einen Tag nach vorn: reproduziert mit
  `TZ=America/Los_Angeles` und "jetzt" = 28.09.2026 23:30 Uhr Ortszeit —
  das korrekt berechnete Check-in-/Abflugdatum (28.10.2026) wurde als
  29.10.2026 an die Duffel-Suche übergeben, weil `toISOString()` zuerst auf
  29.10.2026 06:30 UTC vorrückt. Die restliche Codebasis nutzt für exakt
  diese Umrechnung bereits durchgängig das korrekte, lokale Muster
  (`toIsoDate()` in `src/lib/trip/calendarUtils.ts`, `getTodayIso()`/
  `getNextDayIso()` in `HotelWizard.tsx`/`FlightWizard.tsx`) — nur diese
  beiden Stellen in `useChat.ts` waren die einzigen verbliebenen
  `toISOString()`-Aufrufe im gesamten `src`-Baum. Fix: beide `toIso`-Helfer
  nutzen jetzt `toIsoDate(date.getFullYear(), date.getMonth(),
  date.getDate())` (importiert aus `calendarUtils.ts`, keine dritte
  Duplizierung) statt `date.toISOString().slice(0, 10)` — mechanische
  Übernahme des bereits zweifach etablierten Musters, keine neue
  Design-Entscheidung. Zwei neue Regressionstests in `useChat.test.ts`
  (`vi.setSystemTime` auf einen UTC-Zeitpunkt, der bei `TZ=America/
  Los_Angeles` 23:30 Uhr Ortszeit entspricht, prüfen Check-in/Check-out
  bzw. Abflug-/Rückflugdatum gegen das lokale statt das UTC-verschobene
  Datum) — vor dem Fix durch temporäres Zurücknehmen der Quelländerung
  (`git stash`) reproduzierbar rot verifiziert (lieferte `2026-10-29`
  statt `2026-10-28`).
  Vom autonomen IT-Chef-Lauf am 28.09. (dritter Lauf desselben Tages) einen
  weiteren eigenständig gefundenen Bug in `detectTransportMode()`
  (`mockAdvisor.ts`) behoben, gleiche Ursache wie beim "Flugzeug"-Fund
  desselben Tages: Die Wortgrenzen-Prüfung `\bzug\b` matcht das Präfix
  "zug" nicht innerhalb des zusammengesetzten Worts "Zugticket" (kein
  Wortübergang zwischen "zug" und "ticket"). Antwortete eine Nutzerin im
  KI-Chat auf "Wie möchtest du anreisen?" z. B. "Ich brauche noch ein
  Zugticket", erkannte der Advisor kein Transportmittel — obwohl
  "Zugticket" kein beliebig gewähltes Beispiel ist, sondern von der App
  selbst als Cart-Item-Label verwendet wird (`Dashboard.tsx`,
  `Warenkorb.tsx`: "Zugticket Kyoto → Osaka"). Fix: `'zugticket'` als
  weiteres Keyword im `train`-Array ergänzt, gleiches Muster wie
  `'flugzeug'` vom selben Tag, keine neue Design-Entscheidung. Neuer
  Regressionstest in `mockAdvisor.test.ts` — vor dem Fix durch temporäres
  Zurücknehmen der Quelländerung (`git stash`) reproduzierbar rot
  verifiziert (lieferte `null` statt `'train'`).
  Vom autonomen IT-Chef-Lauf am 28.09. (vierter Lauf desselben Tages) einen
  bereits über den separaten Auto-Fix-Kanal vollständig diagnostizierten
  Fund (Auto-Fix-PR #24,
  `it-chef-autofix/transportmode-compound-keywords-2026-09-28`) direkt auf
  `it-chef/auto` übernommen, statt auf Ni's Review des PRs zu warten:
  dieselbe Wortgrenzen-Lücke wie beim "Zugticket"-Fund (dritter Lauf
  desselben Tages) betraf auch "Flugticket", "Busticket",
  "Autovermietung" und "Schifffahrt" — `\bflug\b`/`\bbus\b`/`\bauto\b`/
  `\bschiff\b` matchen das jeweilige Präfix nicht innerhalb des
  zusammengesetzten Worts. Fix: die vier Keywords in den jeweiligen
  Arrays (`flight`/`bus`/`car`/`ferry`) ergänzt, gleiches Muster wie
  `'zugticket'`/`'flugzeug'` vom selben Tag, keine neue
  Design-Entscheidung. Neuer Regressionstest in `mockAdvisor.test.ts` —
  vor dem Fix durch temporäres Zurücknehmen der Quelländerung (`git
  stash`) reproduzierbar rot verifiziert (lieferte `null` statt dem
  jeweils erwarteten Transportmittel). Der ursprüngliche Auto-Fix-PR #24
  bleibt als überholt zurück (kann bei nächster PR-Hygiene-Aufräumung
  geschlossen werden).
  Vom autonomen IT-Chef-Lauf am 28.09. (fünfter Lauf desselben Tages) einen
  von `reports/it-chef.md` (28.09., "Gefundene Bugs (nicht automatisch
  gefixt)") gemeldeten Konsistenzfund behoben: `loadStoredChat()`
  (`tripStorage.ts`) griff bisher ungeschützt auf `parsed.trip.activities`
  zu — fehlt einem gespeicherten `localStorage`-Eintrag (sehr alt oder von
  Hand editiert) das komplette `trip`-Feld, warf das eine `TypeError`
  mitten im an sich schon vorhandenen Normalisierungscode. Der umgebende
  Try/Catch fing das zwar ab (kein Absturz), verwarf dabei aber den
  gesamten gespeicherten Zustand inklusive `messages`/`quickReplies` —
  obwohl genau diese beiden Felder direkt daneben bereits einzeln gegen
  ihr eigenes Fehlen abgesichert sind (Fix vom 12.09.). Fix:
  `parsed.trip?.activities` statt `parsed.trip.activities` (identisches
  Optional-Chaining-Muster wie an den beiden anderen Stellen in derselben
  Funktion), keine neue Design-Entscheidung. Neuer Regressionstest in
  `tripStorage.test.ts` — vor dem Fix durch temporäres Zurücknehmen der
  Quelländerung (`git stash` nur auf `tripStorage.ts`) reproduzierbar rot
  verifiziert (`loadStoredChat()` lieferte `null` statt des mit leerem
  `trip.activities`-Array normalisierten Zustands samt erhaltenem
  `messages`/`quickReplies`).
  Vom autonomen IT-Chef-Lauf am 29.09. einen von
  `support-chef-auto-log.md` (28.09., Fund 2) gemeldeten Sprachfund
  behoben: Der "noch keine automatische Suche"-Satz in `mockAdvisor.ts`
  (`getNextAdvisorStep()`) bildete den Verbindungsbegriff bisher immer
  mechanisch aus `transportLabelsDe[mode]` + "-Verbindungen" — für
  Zug/Bus liest sich das natürlich, aber "Mietwagen-Verbindungen" ist
  begrifflich falsch (ein Mietwagen ist keine "Verbindung", die eine
  Fahrplan-Route impliziert) und "Fähre-Verbindungen" ist keine
  idiomatische Zusammensetzung (korrekt wäre "Fährverbindungen"). Fix:
  neue `noAutoSearchPhraseDe`-Map mit der vollständigen, grammatisch
  passenden Ergänzung pro Modus ("Zug-Verbindungen"/"Flug-Verbindungen"/
  "Bus-Verbindungen" unverändert, "Fährverbindungen" statt
  "Fähre-Verbindungen", "einen Mietwagen" statt "Mietwagen-Verbindungen"),
  ersetzt die bisherige `transportLabelsDe`-Nutzung an dieser einen
  Stelle; `transportLabelsDe` selbst bleibt für die anderen drei
  Verwendungsstellen (u. a. "nur {Label}, wie gewünscht") unverändert, da
  dort nur das reine Nomen gebraucht wird und der Bericht ausdrücklich nur
  diesen einen Satz nannte. Zwei neue Regressionstests in
  `mockAdvisor.test.ts` (ferry: enthält "Fährverbindungen", nicht
  "Fähre-Verbindungen"; car: enthält "einen Mietwagen", nicht
  "Mietwagen-Verbindungen") — vor dem Fix durch temporäres Zurücknehmen
  der Quelländerung (`git stash` nur `mockAdvisor.ts`) reproduzierbar rot
  verifiziert.
  Vom autonomen IT-Chef-Lauf am 29.09. (weiterer Lauf desselben Tages) die
  gleiche, bereits mehrfach gefixte Wortgrenzen-Lücke (`\bkeyword\b`
  matcht ein zusammengesetztes Wort wie "Zugticket" nicht, weil zwischen
  Präfix und Suffix keine Wortgrenze liegt) an einer bisher übersehenen
  Stelle nachgezogen: `bahn` (Synonym zu `zug`) bekam beim 28.09.-Fix nie
  sein eigenes Kompositum-Pendant, anders als `zug`→`zugticket`,
  `flug`→`flugticket`, `bus`→`busticket`, `auto`→`autovermietung`,
  `schiff`→`schifffahrt`. Live nachvollzogen:
  `detectTransportMode('Ich buche eine Bahnfahrt')` und
  `detectTransportMode('Ich brauche ein Bahnticket')` lieferten beide
  `null` statt `'train'`. Fix: `'bahnfahrt'`/`'bahnticket'` als weitere
  `train`-Keywords in `transportKeywords` (`mockAdvisor.ts`) ergänzt,
  gleiches Muster wie die bestehenden Komposita-Einträge. Neuer
  Regressionstest in `mockAdvisor.test.ts` — vor dem Fix durch temporäres
  Zurücknehmen der Quelländerung (`git stash` nur `mockAdvisor.ts`)
  reproduzierbar rot verifiziert (lieferte `null` statt `'train'`).
  Vom autonomen IT-Chef-Lauf am 29.09. (dritter Lauf desselben Tages) einen
  über einen eigens dafür beauftragten Explore-Agenten gefundenen,
  eigenständigen Bug in `getNextAdvisorStep()` (`mockAdvisor.ts`) behoben:
  `SURPRISE_ME_PATTERN` (`/^überrasche? mich$/i`) verlangte bisher eine
  exakte Übereinstimmung ohne jedes Satzzeichen. Der Quick-Reply-Button aus
  der Begrüßung sendet exakt "Überrasch mich" (funktionierte also immer),
  aber die erste Chat-Frage nimmt auch freien Text entgegen — tippt eine
  Nutzerin die Phrase natürlich mit Satzzeichen ("Überrasch mich!",
  "Überrasche mich."), matcht die Regex nicht mehr. Live nachvollzogen:
  `SURPRISE_ME_PATTERN.test('Überrasch mich!')` liefert `false`. Fällt der
  Match aus, wird der wörtliche, satzzeichenbehaftete Text selbst zum
  `trip.destination` (statt eines zufälligen kuratierten Ziels) — sowohl in
  der Antwort ("Überrasch mich! klingt nach einer großartigen Idee!")
  sichtbar als auch nachfolgend an `findKnownDestination()` übergeben, das
  dafür naturgemäß nie etwas findet, und derailt damit den gesamten
  Planungsablauf mit einem unauflösbaren Reiseziel. Fix: Regex um eine
  optionale Satzzeichen-Klasse am Ende ergänzt
  (`/^überrasche? mich[!.?]*$/i`), mechanische Erweiterung ohne sonstige
  Verhaltensänderung (Klick auf den Quick-Reply-Button bleibt unverändert
  erkannt). Neuer Regressionstest in `mockAdvisor.test.ts` (drei
  satzzeichenbehaftete Varianten) — vor dem Fix durch temporäres
  Zurücknehmen der Quelländerung (`git stash` nur `mockAdvisor.ts`)
  reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 29.09. (weiterer Lauf desselben Tages) den
  von Support-Chef gemeldeten Rest desselben Formulierungsfundes vom
  selben Tag nachgezogen: Die Transportmittel-Bestätigung direkt nach
  der Moduserkennung ("Verstanden — nur {Label}-Verbindungen, wie
  gewünscht.") nutzte an dieser früheren Chat-Stelle (Zeile 114) weiterhin
  `transportLabelsDe` statt der im ersten Lauf angelegten
  `noAutoSearchPhraseDe`-Map — "Mietwagen-Verbindungen"/"Fähre-
  Verbindungen" blieben dort unverändert falsch. Fix: Zeile 114 auf
  `noAutoSearchPhraseDe[mode]` umgestellt, reine Wiederverwendung des
  bereits etablierten Musters. Zwei neue Regressionstests in
  `mockAdvisor.test.ts` (Ferry-/Car-Variante) — vor dem Fix durch
  temporäres Zurücknehmen der Quelländerung (`git stash` nur
  `mockAdvisor.ts`) reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 01.10. (dritter Lauf desselben Tages) einen
  über einen eigens dafür beauftragten Explore-Agenten gefundenen,
  eigenständigen Bug in `useChat.ts` (4.10) behoben: `sendMessage()` hat an
  drei Stellen (Flughafen-Rückfrage beim Flug-Edit, Bearbeiten-Rückfrage
  für andere Felder, Haupt-Chat-Ablauf) einen 700ms-`window.setTimeout()`
  gestartet, ohne die Timeout-ID zu halten oder beim Unmount zu clearen —
  exakt dasselbe, am selben Tag bereits zweimal gefixte Muster wie in
  `ChatInput.tsx` (Spracherkennung) und `useConcierge.ts` (PR #26, noch
  nicht gemerged). Verlässt man `/ki-chat` innerhalb der 700ms-Verzögerung
  nach einer Nachricht (z. B. Klick auf eine andere Sidebar-Seite), feuert
  der Timeout trotzdem gegen die bereits unmountete Hook-Instanz und ruft
  `setMessages`/`setTrip`/`setStayOffers` usw. unnötig auf einer
  verworfenen Instanz auf, inklusive eines danach ggf. unnötig startenden
  Netzwerkaufrufs (`runFlightSearch`/`searchStays`). Fix: `replyTimeoutRef`
  (`useRef<number | null>`) hält die jeweils aktive Timeout-ID, ein neuer
  `useEffect`-Cleanup clearet sie beim Unmount — 1:1 dasselbe Muster wie
  der `useConcierge.ts`-Fix. Neuer Regressionstest in `useChat.test.ts`
  (unmounten mit ausstehendem Timeout, `clearTimeout` erwarten) — vor dem
  Fix durch temporäres Zurücknehmen der Quelländerung (`git stash` nur
  `useChat.ts`) reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 01.10. (vierter Lauf desselben Tages) den
  bereits über den separaten Auto-Fix-Kanal vollständig diagnostizierten
  und typsicher gemachten Fund (Auto-Fix-PR #26,
  `it-chef-autofix/useconcierge-timeout-cleanup-2026-10-01`) direkt auf
  `it-chef/auto` übernommen, statt auf Nis Review des PRs zu warten:
  `useConcierge()` (`src/hooks/useConcierge.ts`, Concierge-Chat in
  `Urlaubsmodus.tsx`) hielt den 600ms-`window.setTimeout()` in
  `sendMessage()` bisher nirgends und räumte ihn beim Unmount nicht ab —
  exakt dasselbe, am selben Tag bereits zweimal gefixte Muster wie in
  `ChatInput.tsx` (erster Lauf) und `useChat.ts` (dritter Lauf). Verlässt
  man `/urlaubsmodus` innerhalb der 600ms-"Denk"-Verzögerung nach einer
  Concierge-Frage, feuert der Timeout trotzdem gegen die bereits
  unmountete Hook-Instanz. Fix: identisches `replyTimeoutRef`/
  `useEffect`-Cleanup-Muster wie bei `useChat.ts`/`ChatInput.tsx`
  übernommen (inkl. des auf der Auto-Fix-PR-Branch bereits behobenen
  Typfehlers: `useRef<number | null>` statt über `ReturnType` inferiert,
  da `window.setTimeout()` sonst mit `@types/node` kollidiert). Neuer
  Regressionstest in `useConcierge.test.ts` (1:1 aus der Auto-Fix-PR-
  Branch übernommen) — vor dem Fix durch temporäres Zurücknehmen nur der
  Quelländerung (`git stash` nur `useConcierge.ts`) reproduzierbar rot
  verifiziert (Test schlug fehl: `clearTimeout` wurde nicht aufgerufen).
  Der ursprüngliche Auto-Fix-PR #26 bleibt als überholt zurück (kann bei
  nächster PR-Hygiene-Aufräumung geschlossen werden).
  Vom autonomen IT-Chef-Lauf am 05.10. einen über einen eigens dafür
  beauftragten Explore-Agenten gefundenen, eigenständigen Bug behoben:
  `TripSummaryCard.tsx` (Zusammenfassungskarte im Chat, zeigt Reiseziel/
  Transportmittel/Daten/Budget/Unterkunft) baute den React-`key` für jede
  Zeile bisher aus dem angezeigten Freitext selbst (`key={row.label}`) —
  `destination`, `dates` und `budget` sind aber alle vom Nutzer frei im
  Chat eingetippter Text (`useChat.ts`/`mockAdvisor.ts` übernehmen
  `userMessage` unverändert). Tippt jemand z. B. als Antwort auf die
  Budget-Frage denselben Text wie zuvor als Reiseziel (reproduzierbar:
  `destination: 'Lissabon', budget: 'Lissabon'`), erhalten zwei
  verschiedene Zeilen denselben Key — React protokolliert "Encountered
  two children with the same key" und kann bei späteren Re-Renders (z. B.
  wenn ein weiteres Feld hinzukommt/wegfällt) die falsche Zeile ihre
  Identität/ihr Icon "erben" lassen. Fix: `key` von `row.label` auf einen
  vom Feldinhalt unabhängigen, festen Feldnamen pro Zeile umgestellt
  (`'destination'`/`'transportMode'`/`'dates'`/`'budget'`/
  `'accommodation'`), keine neue Design-Entscheidung, keine
  Verhaltensänderung für sehende Nutzer:innen. Neuer Regressionstest in
  `TripSummaryCard.test.tsx` (`console.error`-Spy erwartet keine "same
  key"-Warnung bei `destination === budget`) — vor dem Fix durch
  temporäres Zurücknehmen der Quelländerung (`git stash` nur
  `TripSummaryCard.tsx`) reproduzierbar rot verifiziert (Spy fing die
  React-Warnung ab). Dieselbe Ursache lag identisch im Details-Dialog von
  `Reiseentwuerfe.tsx:378-394` vor (dort alle fünf Zeilen fix, nicht
  gefiltert, aber mit denselben Freitext-Feldern) — mechanisch
  gleichgezogen (`key: 'destination'` usw. statt `key={row.label}`).
  Dort aktuell nicht live reproduzierbar, weil die Seite noch feste
  Demo-Entwürfe ohne Nutzereingabe zeigt (siehe Kommentar in der Datei:
  "Demo drafts until real multi-draft storage exists") — sobald echte
  Mehrfach-Entwurf-Speicherung (Base44) kommt, gilt dort dieselbe Lücke.
  Bestehende `Reiseentwuerfe.test.tsx`-Suite bleibt unverändert grün.
  Vom autonomen IT-Chef-Lauf am 05.10. (zweiter Lauf desselben Tages)
  einen eigenständig gefundenen Bug im Flugsuche-Teilpfad des Chats
  behoben: `useChat.ts` (`sendMessage()`, Zweig "Bearbeiten" →
  Transportmittel → Flug → Abflug-IATA-Code) prüfte den eingegebenen
  Code bisher nur gegen das 3-Buchstaben-Muster, nie gegen den bereits
  bekannten Zielcode selbst. Tippte man bei einem kuratierten Ziel (z. B.
  Lissabon, `LIS`) versehentlich denselben Code als Abflughafen ein,
  kündigte der Chat anstandslos "Ich suche jetzt echte Flüge von LIS nach
  LIS" an und löste `runFlightSearch('LIS', 'LIS')` aus — eine Anfrage,
  die nur leer oder mit Fehler zurückkommen kann. Das strukturell
  identische, eigenständige `FlightWizard.tsx` schützt genau diesen Fall
  bereits über eine `sameAirport`-Prüfung ("Start und Ziel dürfen nicht
  gleich sein") — nur dieser parallele Chat-Pfad hatte das Gegenstück nie
  bekommen. Fix: dieselbe Prüfung ergänzt, bei Übereinstimmung bleibt der
  Chat im "wartet auf Abflughafen"-Zustand (wie beim ungültigen Muster)
  statt die nonsensische Suche zu starten, mechanische Übernahme des
  bereits etablierten Musters, keine neue Design-Entscheidung. Neuer
  Regressionstest in `useChat.test.ts` — vor dem Fix durch temporäres
  Zurücknehmen der Quelländerung (`git stash` nur `useChat.ts`)
  reproduzierbar rot verifiziert (`searchFlights` wurde tatsächlich mit
  `origin: 'LIS', destination: 'LIS'` aufgerufen).
- 🟡 Phase 5 Suche — Flugsuche (5.8, 5.9, 5.11) und Hotelsuche (5.1-5.3,
  5.6) fertig und mit echten Duffel-Testdaten verbunden; Zug/Bus/Fähre:
  5.4 (`TrainCard.tsx`) und 5.5 (`TrainResults.tsx`) vom autonomen
  IT-Chef-Lauf auf Branch `it-chef/auto` erledigt, aber noch nicht in
  den KI-Chat eingebunden (5.7 weiterhin offen — es gibt schlicht noch
  keine angebundene Zug-/Bus-/Fähr-Datenquelle, Duffel bietet dafür
  nichts an; welcher Anbieter das werden soll ist eine Produktentscheidung
  für Ni, kein autonom fällbarer Punkt); 5.10 (Backend-Stub)
  anders gelöst über Vite-Proxy statt Base44. Nebenbei vom autonomen
  IT-Chef-Lauf am 28.08. (vierter Lauf) ein konkreter Ehrlichkeits-Bug in
  `mockAdvisor.ts` gefunden und behoben: der letzte Chat-Schritt
  versprach für JEDEN Transportmodus "Ich suche jetzt nach echten
  X-Verbindungen", aber nur für Flug gibt es (über den
  "Bearbeiten"-Pfad in `useChat.ts`) überhaupt eine echte Suche — für
  Zug/Bus/Fähre/Mietwagen blieb das Versprechen bisher immer unerfüllt
  hängen. Jetzt bekommen diese vier Modi stattdessen eine ehrliche
  Abschlussmeldung ("noch keine automatische Suche, Reiseplan steht
  trotzdem"), Flug bleibt unverändert. Schließt 5.7 nicht ab (weiterhin
  keine echte Zug-/Bus-/Fährsuche vorhanden), behebt aber die dadurch
  entstandene Dead-End-Situation im Chat. Vom autonomen IT-Chef-Lauf am
  30.08. (neunter Lauf) ergänzt: `reports/support-chef.md` meldete am
  29.08., dass ausgerechnet der Flug-Fall (der einzige Modus mit
  "echter Suche"-Ankündigung) mit `quickReplies: []` endet, während alle
  anderen Modi seit dem 28.08.-Fix immerhin "Neue Reise planen"
  bekommen — der `TravixAvatar` bleibt dabei dauerhaft im
  "searching"-Zustand hängen, ohne jeden nächsten Schritt für die
  Nutzerin. `mockAdvisor.ts` gibt im Flug-Fall jetzt ebenfalls
  `quickReplies: ['Neue Reise planen']` mit (exakt der von Support-Chef
  vorgeschlagene Minimal-Fix). Behebt weiterhin nicht den zugrunde
  liegenden, größeren Bug, dass der Hauptchat-Ablauf die echte Flugsuche
  nie auslöst (siehe `reports/it-chef.md`, UX-Entscheidung zum
  Abflughafen nötig) — nur die daraus entstehende Sackgasse ohne jeden
  Ausweg. Vom autonomen IT-Chef-Lauf am 30.08. (zehnter Lauf) Fund 2 aus
  `reports/support-chef.md` (29.08.) behoben: ein fehlgeschlagener
  `searchStays`-Aufruf in `useChat.ts` setzte `stayOffers` bisher auf
  `[]` — optisch identisch zu einer echten Null-Treffer-Suche, sodass
  `HotelResults.tsx` in beiden Fällen dieselbe Meldung "Keine
  Unterkünfte gefunden" zeigte. Neuer `stayError`-Zustand (analog dem
  bereits bestehenden `flightErrors`/`FlightResults.tsx`-Muster für die
  Flugsuche) unterscheidet jetzt beide Fälle: bei einem echten
  Suchfehler bleibt `stayOffers` `null` und `HotelResults` zeigt eine
  eigene Fehlermeldung ("... hat gerade nicht geklappt, versuch's
  gleich nochmal"), eine echte Null-Treffer-Suche zeigt weiterhin die
  bisherige Meldung. Vom autonomen IT-Chef-Lauf am 31.08. (elfter Lauf)
  denselben Bug für die Flugsuche behoben, der im 10.-Lauf-Log als
  möglicher Fund für einen künftigen Lauf vorgemerkt war: ein
  fehlgeschlagener `searchFlights`-Aufruf in `useChat.ts` setzte
  `flightOffers` bisher auf `[]` — optisch identisch zu einer echten
  Null-Treffer-Suche. `FlightResults.tsx` hatte für genau diesen Fall
  bereits ein bestehendes `flightErrors`-Anzeigemuster, das nur nie
  befüllt wurde. `runFlightSearch()` füllt im `.catch`-Zweig jetzt
  `flightErrors` mit einer eigenen Fehlermeldung statt `flightOffers`
  auf `[]` zu setzen. Vom autonomen IT-Chef-Lauf am 31.08. (vierzehnter
  Lauf) zwei von `reports/support-chef.md` (31.08.) gemeldete
  Anschlussfehler an genau dieser Stelle behoben: Erstens blendete
  `KiChat.tsx` die neue Flug-Fehlermeldung trotz Punkt oben nie ein, weil
  die Render-Bedingung für `<FlightResults>` nur `flightLoading` und
  `flightOffers` prüfte, nicht aber `flightErrors` — bei einem
  fehlgeschlagenen `runFlightSearch()` blieb `flightOffers` `null`, die
  Bedingung war `false`, und die Nutzerin sah nach dem
  "sucht"-Avatar buchstäblich nichts mehr. Jetzt ergänzt um
  `flightErrors.length > 0`, exakt analog zur bereits korrekten
  `stayError`-Bedingung eine Zeile darüber. Zweitens ließen die beiden
  "Bearbeiten"-Suchpfade (Unterkunft in `startEdit`, Flug in
  `runFlightSearch`) nach einem Fehlschlag `quickReplies` leer, statt wie
  der Hauptchat-Ablauf `['Neue Reise planen']` anzubieten — beide
  `.catch`-Zweige setzen das jetzt zusätzlich. Vom autonomen IT-Chef-Lauf
  am 01.09. (zwanzigster Lauf) einen von `reports/support-chef.md`
  (01.09.) gemeldeten Fund auf den eigenständigen `/hotelsuche`- und
  `/flugsuche`-Seiten behoben: `handleSelect` markierte die angeklickte
  Karte über `selectedOfferId` immer sofort als "Ausgewählt" (grünes
  Häkchen, Button deaktiviert) — unabhängig davon, ob `updateStoredTrip()`
  wirklich erfolgreich war. Schlug die Übernahme fehl (keine im KI-Chat
  begonnene Reiseplanung), zeigte die Seite zwar korrekt den Warnhinweis
  darunter, die Karte selbst suggerierte aber weiterhin eine gespeicherte
  Auswahl und ließ sich nicht erneut anklicken. Beide Seiten reichen
  `selected` an `HotelCard`/`FlightCard` jetzt zusätzlich mit
  `&& selectionHasTrip` durch, sodass der Button im Fehlerfall auf
  "Auswählen" stehen und klickbar bleibt, exakt wie im Warnhinweis
  beschrieben. Neue Regressionstests in `Hotelsuche.test.tsx` sowie eine
  neue `Flugsuche.test.tsx` (bisher gab es dort noch keine Tests). Vom
  autonomen IT-Chef-Lauf am 03.09. (achtundzwanzigster Lauf) eine Lücke im
  bereits am 25.08. (zweiter Lauf) begonnenen Ehrlichkeits-Fix in
  `callDuffelProxy()` (`src/lib/duffel/client.ts`) geschlossen: der
  damalige Fix deckte nur den `!response.ok`-Zweig ab (Duffel liefert
  einen HTTP-Fehler); der separate `catch`-Block direkt darunter — für
  einen fehlgeschlagenen `fetch()` selbst (z. B. offline, "Failed to
  fetch") oder eine kaputte JSON-Antwort (`response.json()` wirft) — gab
  weiterhin `error.message` roh durch, landet ungefiltert in
  `Flugsuche.tsx`/`Hotelsuche.tsx`/`FlightResults.tsx`. Jetzt nach
  demselben Muster: roher Fehler per `console.error` geloggt, Nutzerin
  sieht eine ehrliche deutsche Meldung mit konkretem nächsten Schritt.
  Zwei neue Regressionstests in `client.test.ts` (abgelehntes
  `fetch()`-Promise, werfendes `response.json()`).
  Vom autonomen IT-Chef-Lauf am 03.09. (neunundzwanzigster Lauf) einen von
  `reports/support-chef.md` (03.09.) gemeldeten Fund in `useChat.ts`
  behoben: `callDuffelProxy()` lehnt seine Promise bei einem echten
  Duffel-Fehler nie ab, sondern löst sie mit einem `errors`-Feld auf
  (siehe Fix im siebenundzwanzigsten/zweiten Lauf oben) — die drei
  Suchaufrufe im Chat (automatische Unterkunftssuche im Hauptablauf,
  Unterkunftssuche über "Bearbeiten", `runFlightSearch`) werteten
  `result.errors` in ihrem `.then()` aber nicht (oder nicht vollständig)
  aus und verließen sich auf die dafür vorgesehenen, aber nie erreichten
  `.catch()`-Zweige. Eine echte Suchpanne sah dadurch für die Nutzerin wie
  eine ehrliche Null-Treffer-Suche aus (Unterkunft) bzw. endete ohne
  jeden klickbaren nächsten Schritt (Flug) — die manuellen Suchseiten
  `Hotelsuche.tsx`/`Flugsuche.tsx` hatten dieselbe Unterscheidung schon
  richtig. Fix: alle drei `.then()`-Zweige prüfen jetzt `result.errors`
  genau wie die manuellen Suchseiten (Unterkunft: `stayError` statt
  `stayOffers` setzen plus `quickReplies` auf "Neue Reise planen" bei der
  "Bearbeiten"-Suche; Flug: zusätzlich `quickReplies` auf "Neue Reise
  planen" setzen). Die bisherigen `.catch()`-Zweige bleiben als
  Absicherung für echte JS-Fehler unverändert bestehen. Drei neue
  Regressionstests in `useChat.test.ts`, die die Suche mit
  `mockResolvedValue({ offers: [], errors: [...] })` statt
  `mockRejectedValue` simulieren (das bisher ungetestete, tatsächlich
  auftretende Verhalten) — vor dem Fix reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 03.09. (dreißigster Lauf) einen von
  `reports/it-chef.md` (03.09.) gemeldeten Fund behoben: Hinflug
  (`FlightWizard.tsx`) und Check-in (`HotelWizard.tsx`) hatten kein
  `min`-Attribut auf das heutige Datum — nur die jeweils zweiten Felder
  (Rückflug/Check-out) waren bereits gegen das erste Datum abgesichert,
  ein Datum in der Vergangenheit ließ sich also weiterhin als Hinflug/
  Check-in wählen. Beide Dateien bekommen jetzt eine lokale
  `getTodayIso()`-Hilfsfunktion (heutiges Datum über lokale
  `Date`-Komponenten statt `toISOString()`, um Zeitzonen-Verschiebung zu
  vermeiden), als `min` auf dem jeweils ersten Datumsfeld gesetzt. Neuer
  Regressionstest pro Datei.
  Vom autonomen IT-Chef-Lauf am 04.09. (einunddreißigster Lauf) einen
  weiteren von `reports/it-chef.md` (03.09.) gemeldeten Fund behoben:
  Die Passagierzahl in `FlightWizard.tsx` klammerte mit `Math.min`/
  `Math.max` direkt um `Number(event.target.value)`, ohne
  `Number.isNaN`-Prüfung — das strukturell identische
  `Gäste`/`Zimmer`-Feld in `HotelWizard.tsx` schützt sich bereits über
  `clampGuestCount()` davor. Bei einem nicht-numerischen Wert (z. B.
  durch Einfügen von Text ins Zahlenfeld) wurde `passengers` zu `NaN`,
  das dann ungeprüft in die Flugsuche ging. Fix: neue lokale
  `clampPassengerCount()`-Hilfsfunktion in `FlightWizard.tsx`, exakt
  analog zu `clampGuestCount()` in `HotelWizard.tsx`. Zwei neue
  Regressionstests in `FlightWizard.test.tsx` (NaN-Fallback auf 1,
  Begrenzung auf 1-9), analog den bereits bestehenden Tests in
  `HotelWizard.test.tsx`.
  Vom autonomen IT-Chef-Lauf am 10.09. (weiterer Lauf) eine weitere
  Testabdeckungslücke geschlossen: `FlightCard.tsx` — trotz mehrfacher
  eigenständiger Bugfixes in der Vergangenheit (Preisformat über
  `formatOfferPrice`, `selected`-Prop, IATA-Anzeige) — hatte bisher keine
  eigene Testdatei, nur indirekte Abdeckung über `Flugsuche.test.tsx`.
  Reine Testabdeckung für bestehendes, unverändertes Verhalten, kein
  neuer Bug gefunden. Neue `FlightCard.test.tsx` (8 Tests, Muster analog
  `TrainCard.test.tsx`): Preisformatierung (deutsches Format statt
  Rohwert), Anzeige von Fluggesellschaft/IATA-Codes/Flugdauer für einen
  Direktflug, kein Zwischenstopp-Badge bei Direktflug, Singular-/
  Plural-Form des Zwischenstopp-Badges (1 vs. mehrere), kein
  "Auswählen"-Button ohne `onSelect`-Prop, `onClick` ruft `onSelect` mit
  dem Angebot auf, sowie der deaktivierte "Ausgewählt"-Zustand bei
  `selected` (kein erneuter `onSelect`-Aufruf).
  Vom autonomen IT-Chef-Lauf am 10.09. (weiterer Lauf) das
  Schwesterstück behoben: `HotelCard.tsx` hatte aus demselben Grund wie
  `FlightCard.tsx` bisher keine eigene Testdatei — nur indirekte
  Abdeckung über `Hotelsuche.test.tsx`, dort durchgängig mit
  `rating: null`, `address: ''` und `photoUrl: null`, sodass die
  bedingten Zweige (Sternebewertung, Adresse, Bild) nie geprüft wurden.
  Reine Testabdeckung für bestehendes, unverändertes Verhalten, kein
  neuer Bug gefunden. Neue `HotelCard.test.tsx` (11 Tests, Muster analog
  `FlightCard.test.tsx`): Preisformatierung (deutsches Format statt
  Rohwert), Anzeige des Hotelnamens, kein Sternebewertungs-Badge bei
  `rating: null` vs. gerundete Anzeige bei gesetztem Wert, keine Adresse
  bei leerem String vs. Anzeige bei gesetzter Adresse, kein `<img>` bei
  `photoUrl: null` vs. Bild mit Hotelnamen als Alt-Text bei gesetzter
  URL, kein "Auswählen"-Button ohne `onSelect`-Prop, `onClick` ruft
  `onSelect` mit dem Angebot auf, sowie der deaktivierte
  "Ausgewählt"-Zustand bei `selected` (kein erneuter `onSelect`-Aufruf).
  Vom autonomen IT-Chef-Lauf am 10.09. (weiterer Lauf) eine weitere
  Testabdeckungslücke geschlossen: `FlightResults.tsx` (Lade-/Fehler-/
  Leer-/Treffer-Zustände beim Rendern der Flugkarten-Liste im KI-Chat)
  hatte bisher keine eigene Testdatei und war — anders als angenommen —
  auch nicht indirekt über `KiChat.test.tsx` abgedeckt, da dort
  `useChat` komplett gemockt wird und `FlightResults` folglich nie
  wirklich gerendert wird. Reine Testabdeckung für bestehendes,
  unverändertes Verhalten, kein neuer Bug gefunden. Neue
  `FlightResults.test.tsx` (5 Tests, Muster analog
  `TrainResults.test.tsx`): Lade-Anzeige, Fehlermeldung statt
  Null-Treffer-Text bei einem echten Suchfehler, kein Rendering ohne
  Laden/Fehler/Angebote, Null-Treffer-Meldung bei leerer Angebotsliste,
  sowie eine gerenderte Karte pro Angebot. Das strukturell identische
  `HotelResults.tsx` hatte dieselbe Lücke — vom autonomen IT-Chef-Lauf am
  10.09. (weiterer Lauf) nachgeholt: neue `HotelResults.test.tsx` (5
  Tests, Muster analog `FlightResults.test.tsx`) prüft Lade-Anzeige,
  Fehlermeldung statt Null-Treffer-Text bei einem echten Suchfehler,
  kein Rendering ohne Laden/Fehler/Angebote, Null-Treffer-Meldung bei
  leerer Angebotsliste, sowie eine gerenderte Karte pro Angebot. Reine
  Testabdeckung für bestehendes, unverändertes Verhalten, kein neuer Bug
  gefunden.
  Vom autonomen IT-Chef-Lauf am 11.09. (weiterer Lauf) eine weitere
  Testabdeckungslücke geschlossen: `NoResultsMessage.tsx` (5.6, ehrliche
  Null-Treffer-Meldung, u. a. in `HotelResults`/`FlightResults`/
  `TrainResults`/`Flugsuche`/`Hotelsuche` verwendet) hatte bisher keine
  eigene Testdatei. Reine Testabdeckung für bestehendes, unverändertes
  Verhalten, kein neuer Bug gefunden. Neue `NoResultsMessage.test.tsx` (2
  Tests): Standardtitel/-text ohne Props, sowie übergebener eigener
  Titel/Text statt der Standardwerte.
  Vom autonomen IT-Chef-Lauf am 12.09. (weiterer Lauf) eine weitere
  Testabdeckungslücke geschlossen: `src/pages/KiChat.tsx` (dünner
  Seiten-Wrapper, der `PageHeader` mit dem Chat-Container aus
  `src/components/chat/KiChat.tsx` zusammensetzt) war die einzige Seite
  unter `src/pages/` ohne eigene Testdatei — der Chat-Container selbst ist
  bereits über `src/components/chat/KiChat.test.tsx` gut abgedeckt. Reine
  Testabdeckung für bestehendes, unverändertes Verhalten, kein neuer Bug
  gefunden. Neue `src/pages/KiChat.test.tsx` (2 Tests, Container-Import
  gemockt, Muster analog `PageHeader.test.tsx`): Seitentitel/-beschreibung
  über `PageHeader`, sowie Rendering des Chat-Containers.
  Vom autonomen IT-Chef-Lauf am 12.09. (weiterer Lauf) eine weitere
  Testabdeckungslücke geschlossen: `MobileNav.tsx` (3.3, Hamburger-Menü für
  die mobile Navigation) hatte bisher keine eigene Testdatei — anders als
  das strukturell ähnliche `Sidebar.tsx`, das bereits über
  `Sidebar.test.tsx` abgedeckt ist. Reine Testabdeckung für bestehendes,
  unverändertes Verhalten, kein neuer Bug gefunden. Neue
  `MobileNav.test.tsx` (3 Tests, Muster analog `Sidebar.test.tsx`): Menü ist
  vor dem Öffnen nicht sichtbar, Klick auf "Menü öffnen" zeigt alle drei
  Navigationsgruppen mit ihren Links (inkl. korrektem `href`), Klick auf
  einen Link schließt das Menü wieder.
  Vom autonomen IT-Chef-Lauf am 13.09. eine weitere Testabdeckungslücke
  geschlossen: `PageTransition.tsx` (3.1, Seitenübergangs-Wrapper um jede
  Route in `routes.tsx`) hatte bisher keine eigene Testdatei. Reine
  Testabdeckung für bestehendes, unverändertes Verhalten, kein neuer Bug
  gefunden. Von den zuvor am 12.09. verbliebenen acht ungetesteten
  Nicht-`ui/`-Dateien (`reports/it-chef.md`-Liste vom 12.09.) bleiben damit
  nur noch `AppShell.tsx`/`routes.tsx` (bräuchten Router-Mocking, größerer
  Umfang) und `App.tsx`/`main.tsx` (Einstiegspunkte, in diesem Projekt
  bewusst ohne eigene Tests) übrig. Neue `PageTransition.test.tsx` (2 Tests,
  Muster analog `ChatMessage.test.tsx`, das dieselbe `framer-motion`-Bibliothek
  bereits ohne besonderes Mocking nutzt): ein einzelnes Kind wird gerendert,
  mehrere Kinder (Überschrift + Text) werden unverändert gerendert.
  Vom autonomen IT-Chef-Lauf am 13.09. (weiterer Lauf) einen von
  Support-Chef gemeldeten und selbst gegen den Code bestätigten Fund
  behoben: der Schließen-Button in `src/components/ui/sheet.tsx` (Zeile
  80, u. a. genutzt vom mobilen Menü `MobileNav.tsx`, 3.3) und in
  `src/components/ui/dialog.tsx` (Zeile 77, u. a. genutzt vom
  "Neu starten?"-Dialog in `KiChat.tsx`) hatte als einzigen zugänglichen
  Namen fest verdrahtet `"Close"` statt Deutsch — anders als jeder sonstige
  interaktive Text der App (z. B. `aria-label="Menü öffnen"` direkt
  daneben). Beide auf `"Schließen"` geändert, analog dem bestehenden
  Muster in `Sidebar.tsx`. Zusätzlich denselben fest verdrahteten Text im
  bisher ungenutzten `DialogFooter`-Schließen-Button (`dialog.tsx` Zeile
  116, aktuell nirgends mit `showCloseButton` aufgerufen) aus Konsistenz
  mitkorrigiert. Neuer Regressionstest in `MobileNav.test.tsx` (Schließen-
  Button nach dem Öffnen hat den deutschen zugänglichen Namen; vor dem Fix
  durch temporäres Zurücknehmen der Quelländerung reproduzierbar rot
  verifiziert).
  Vom autonomen IT-Chef-Lauf am 13.09. (weiterer Lauf) den im
  vorangegangenen Lauf bewusst zurückgestellten "Fund 2" nachgeholt: einen
  von `support-chef-auto-log.md` (Branch `support-chef/auto`, Eintrag
  "Mobile Navigation & Seitenübergang") gemeldeten und von Freigabe-Chef
  bei der Branch-Prüfung unabhängig gegen den Code bestätigten
  Barrierefreiheits-Fund behoben: `PageTransition.tsx`
  (3.7, Seitenübergangs-Wrapper um jede Route) spielte die
  Opacity-/Verschiebe-Animation bei jedem Routenwechsel unbedingt ab, ohne
  die Systemeinstellung "Bewegungen reduzieren"
  (`prefers-reduced-motion`) abzufragen — für Nutzerinnen mit
  vestibulären Störungen oder Bewegungsempfindlichkeit, die diese
  Einstellung gezielt aktiviert haben, gab es keine Möglichkeit, die
  Animation abzuschalten. Fix: neuer `useReducedMotion()`-Hook aus der
  bereits genutzten `framer-motion`-Bibliothek; bei aktivierter
  Systemeinstellung werden statische Varianten (`opacity: 1`, keine
  Verschiebung) und eine Übergangsdauer von 0 verwendet statt der
  bisherigen 0,2s-Animation, bei deaktivierter Einstellung bleibt das
  Verhalten unverändert. Neuer Regressionstest in
  `PageTransition.test.tsx` (mockt `window.matchMedia` auf
  `prefers-reduced-motion: reduce`, prüft die statischen Stilwerte; vor
  dem Fix reproduzierbar rot verifiziert).
  Vom autonomen IT-Chef-Lauf am 16.09. (vierter Lauf desselben Tages) einen
  von `reports/it-chef.md` (16.09., "Automatisch gefixt", PR #21) bereits
  vollständig diagnostizierten Bug direkt auf `it-chef/auto` behoben, statt
  auf den offenen Auto-Fix-PR zu warten: `formatDuration()` in
  `FlightCard.tsx` und (wortgleich dupliziert) `TrainCard.tsx` matchte nur
  ISO-8601-Dauern der Form `PT<h>H<m>M`, nicht aber die Form mit
  Tages-Komponente (`P<n>DT<h>H<m>M`, z. B. `P1DT2H30M` für 26h30min) — bei
  jeder Flugverbindung mit ≥24h Gesamtdauer (Übernacht-/Mehrfach-
  Umstiegs-Langstrecke) erschien dadurch die rohe ISO-Zeichenkette statt
  einer lesbaren Dauer in der UI. Fix: Regex um eine optionale Tage-Gruppe
  vor dem `T` ergänzt (`P(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?`), Tage werden
  in Stunden umgerechnet (Tage × 24 + Stunden) und mit den bestehenden
  Stunden zusammengeführt. Rein additiv für den Normalfall unter 24h —
  bestehende Duffel-Antworten ohne Tages-Komponente verhalten sich
  identisch (leere Tage-Gruppe ⇒ `Number(undefined || 0) === 0`). Zwei neue
  Regressionstests (`FlightCard.test.tsx`, `TrainCard.test.tsx`), die eine
  26h30min-Dauer (`P1DT2H30M`) auf `26h 30min` statt den rohen ISO-String
  prüfen. Der ursprüngliche Auto-Fix-PR #21 bleibt als überholt zurück
  (kann bei nächster PR-Hygiene-Aufräumung geschlossen werden).
  Vom autonomen IT-Chef-Lauf am 17.09. (weiterer Lauf) die zuletzt am
  13.09. dokumentierte, verbliebene Testabdeckungslücke geschlossen:
  `AppShell.tsx` (3.2, Sidebar/MobileNav-Wrapper um jede Route) war die
  letzte Nicht-`ui/`-Datei ohne eigene Testdatei, die nicht aus einem der
  beiden dokumentierten Gründe (Router-Mocking-Umfang bei `routes.tsx`,
  bewusst ungetestete Einstiegspunkte `App.tsx`/`main.tsx`) zurückgestellt
  war — anders als vermutet, brauchte sie kein zusätzliches
  Router-Mocking: `Sidebar`/`MobileNav` rendern beide bereits eigenständig
  unter einem einfachen `MemoryRouter`-Wrapper (siehe deren jeweils
  bestehende Testdateien), `AppShell` selbst setzt beide nur nebeneinander.
  Reine Testabdeckung für bestehendes, unverändertes Verhalten, kein neuer
  Bug gefunden. Neue `AppShell.test.tsx` (1 Test, Muster analog
  `Sidebar.test.tsx`/`MobileNav.test.tsx`): rendert `children` sowie je
  einen erreichbaren Namen aus Sidebar ("Seitenleiste einklappen") und
  MobileNav ("Menü öffnen"), um zu bestätigen, dass beide tatsächlich
  eingebunden sind. `routes.tsx` bleibt aus dem am 13.09. genannten Grund
  weiterhin offen (Test würde jede eingebundene Seite mitrendern — deutlich
  größerer, nicht mehr als "ein einzelner, klar abgegrenzter Punkt"
  einzustufender Umfang).
  Vom autonomen IT-Chef-Lauf am 18.09. (vierter Lauf desselben Tages) eine
  Lücke im am 04.09. eingeführten NaN-Schutz nachgezogen: `clampGuestCount()`
  (`HotelWizard.tsx`, Felder "Zimmer"/"Gäste") und `clampPassengerCount()`
  (`FlightWizard.tsx`, Feld "Passagiere") schützten bisher nur gegen
  nicht-numerische Eingaben und Werte außerhalb 1-9, nicht aber gegen
  Nachkommazahlen — `Number('1.5')` ist kein `NaN`, also gab
  `Math.min(9, Math.max(1, parsed))` `1.5` unverändert zurück. Ein
  eingetipptes oder eingefügtes "1.5"/"2.9" blieb dadurch dauerhaft als
  Bruchzahl in Zimmer-/Gäste-/Passagierzahl stehen, obwohl `min`/`max` auf
  den Feldern sowie der Name der Hilfsfunktionen eine ganze Zahl von 1-9
  klar als beabsichtigtes Verhalten festlegen. Fix: beide Hilfsfunktionen
  runden den geparsten Wert jetzt vor dem Clamp zusätzlich mit `Math.round`,
  exakt dieselbe Stelle wie der bestehende NaN-Schutz. Zwei neue
  Regressionstests (`HotelWizard.test.tsx`, `FlightWizard.test.tsx`), die
  "1.5" auf 2 und "2.4" auf 2 gerundet prüfen — vor dem Fix reproduzierbar
  rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 21.09. (weiterer Lauf desselben Tages) das
  `role="status"`-Muster vom ersten Lauf heute (siehe `KiChat.tsx`/
  `Urlaubsmodus.tsx` oben) auf die direkt danebenliegenden Ladehinweise in
  `FlightResults.tsx`, `HotelResults.tsx` und `TrainResults.tsx` erweitert:
  Alle drei zeigen beim Laden exakt denselben "Travix sucht …"-Textblock
  mit `TravixAvatar`, aber ohne `role="status"` — obwohl `FlightResults`
  und `HotelResults` direkt in `KiChat.tsx` (Zeile 179/183) unmittelbar
  unter dem soeben reparierten `isThinking`-Block liegen und exakt dieselbe
  Art von kurzlebigem, dynamisch erscheinendem Statustext sind.
  `TrainResults.tsx` ist zwar noch nicht in eine Seite eingebunden (5.7
  weiterhin offen), aber strukturell identisch — aus Konsistenz mit
  gefixt. Fix: `role="status"` auf alle drei Ladehinweis-`div`s ergänzt,
  mechanische Übernahme desselben, im selben Lauf bereits verifizierten
  Musters, keine neue Design-Entscheidung. Drei neue Regressionstests
  (`FlightResults.test.tsx`, `HotelResults.test.tsx`,
  `TrainResults.test.tsx`: `getByRole('status')` zeigt den jeweiligen
  Ladehinweis) — vor dem Fix durch temporäres Zurücknehmen der drei
  Quelländerungen (`git stash` nur der `.tsx`-Fixes) reproduzierbar rot
  verifiziert.
  Vom autonomen IT-Chef-Lauf am 26.09. (zweiter Lauf desselben Tages)
  einen eigenständig gefundenen Bug in `HotelWizard.tsx` behoben: Das
  Check-out-Feld erlaubte über sein `min`-Attribut (bisher einfach
  `checkInDate`, also inklusiv) die Auswahl desselben Datums wie
  Check-in im nativen Datepicker — die Formularvalidierung
  (`checkOutDate > checkInDate`, bewusst strikt größer, da eine
  Hotelübernachtung nicht am selben Tag enden kann) lehnte diesen Wert
  dann aber ab, ohne jede Erklärung: der Absenden-Button blieb einfach
  deaktiviert. Das strukturell ähnliche `FlightWizard.tsx` hat für den
  vergleichbaren Fall (Start = Ziel) eine explizite Fehlermeldung
  ("Start und Ziel dürfen nicht gleich sein") — hier fehlte jedes
  Feedback. Fix: neue lokale `getNextDayIso()`-Hilfsfunktion (analog zu
  `getTodayIso()` in derselben Datei), `min` auf dem Check-out-Feld
  zeigt jetzt den Tag nach dem gewählten Check-in statt Check-in selbst
  — der Datepicker lässt das ungültige Datum dadurch erst gar nicht
  mehr zu, keine neue Fehlertext-Entscheidung nötig. Neuer
  Regressionstest in `HotelWizard.test.tsx` (Check-out-`min` ist der
  Folgetag nach einem gesetzten Check-in) — vor dem Fix durch
  temporäres Zurücknehmen der Quelländerung (`git stash` nur
  `HotelWizard.tsx`) reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 26.09. (dritter Lauf desselben Tages)
  einen eigenständig gefundenen Bug in `formatDuration()` behoben —
  identisch dupliziert in `TrainCard.tsx` und `FlightCard.tsx`: die
  Minuten-Capture-Group der Regex wurde nur auf String-Wahrheitsgehalt
  geprüft (`minutes && ...`), nicht auf ihren Zahlenwert. Bei jeder
  vollen Stunde (z. B. "PT4H0M", ein plausibler echter Wert für eine
  Bahn- oder Flugverbindung) ist die Minuten-Gruppe der String `"0"` —
  in JavaScript wahr, außer bei leerem String — wodurch zusätzlich
  "0min" angehängt wurde ("4h 0min" statt "4h"). `reports/it-chef.md`
  hatte denselben Codeabschnitt am 03.09. bereits als "theoretischen
  Randfall mit sehr niedriger Konfidenz" nur für den entarteten
  Sonderfall "PT0H0M" (Gesamtdauer null) notiert und als praktisch nicht
  vorkommend eingestuft — das war zu eng gefasst: der Fehler tritt bei
  jeder ganzstündigen Dauer auf, nicht nur bei einer Dauer von null.
  Fix: neue `totalMinutes`-Zahl statt der rohen String-Gruppe, Anzeige
  nur bei `totalMinutes > 0`, mechanisch identisch in beiden Dateien
  angewendet. Als Nebeneffekt zeigt eine Dauer von "PT0H0M" jetzt auch
  korrekt "—" statt "0min" — behebt damit den ursprünglich gemeldeten
  Randfall gleich mit. Je ein neuer Regressionstest in
  `TrainCard.test.tsx`/`FlightCard.test.tsx` (volle Stunde zeigt "4h"
  ohne "0min") — vor dem Fix durch temporäres Zurücknehmen beider
  Quelländerungen (`git stash` nur der beiden `.tsx`-Dateien)
  reproduzierbar rot verifiziert (beide Karten zeigten "4h 0min").
  Vom autonomen IT-Chef-Lauf am 02.10. (vierter Lauf desselben Tages) den
  letzten noch offenen, bereits über den separaten Auto-Fix-Kanal
  vollständig diagnostizierten Fund (Auto-Fix-PR #25,
  `it-chef-autofix/formatduration-fake-1min-2026-09-30`) direkt auf
  `it-chef/auto` übernommen, statt länger auf eine Review-/Merge-
  Entscheidung zu warten: `formatDuration()` (`TrainCard.tsx`/
  `FlightCard.tsx`, dieselbe Funktion wie beim 26.09.-Fund oben) rundete
  eine Sekunden-only-ISO-8601-Dauer (z. B. "PT45S" — in der Praxis nur bei
  kaputten Rohdaten, nie bei einer echten Verbindung) künstlich auf
  "1min" hoch, statt wie jede andere unbrauchbare Dauer den
  Platzhalter-Strich "—" zu zeigen — widersprach damit dem im selben Code
  (`formatLocation()` direkt daneben) etablierten Grundsatz "ehrlich statt
  erfunden". Fix: die Sekunden-Rundungs-Sonderbehandlung ersatzlos
  entfernt, mechanisch identisch in beiden Dateien. Bestehende Tests in
  `FlightCard.test.tsx`/`TrainCard.test.tsx` (je ein Test für "PT45S")
  entsprechend umgedreht (erwarten jetzt "—" statt "1min"). Der
  ursprüngliche Auto-Fix-PR #25 bleibt als überholt zurück (kann bei
  nächster PR-Hygiene-Aufräumung geschlossen werden).
  Vom autonomen IT-Chef-Lauf am 05.10. (fünfter Lauf desselben Tages) einen
  in `reports/it-chef.md` (05.10., "Weitere Vorschläge", Punkt 3)
  gemeldeten Hygiene-Punkt umgesetzt: `formatDuration()` lag identisch
  dupliziert in `FlightCard.tsx` und `TrainCard.tsx` vor (gleiche Ursache
  wie bei `formatEuro()`/`formatOfferPrice()` zuvor, die bereits nach
  `src/lib/format.ts` konsolidiert sind). Reine Konsolidierung, keine
  Verhaltensänderung: Funktion 1:1 nach `src/lib/format.ts` verschoben
  (gleiches Dokumentationskommentar-Muster wie die beiden dortigen
  Nachbarfunktionen), beide Kopien in `FlightCard.tsx`/`TrainCard.tsx`
  entfernt, stattdessen aus `@/lib/format` importiert (gemeinsam mit dem
  bereits bestehenden `formatOfferPrice`-Import). Neue, direkte
  `formatDuration`-Testgruppe in `format.test.ts` (7 Tests: Stunden+
  Minuten, ganze Stunde ohne "0min", Tagesanteil, reiner Tagesanteil ohne
  Zeitteil, Sekunden-only als Platzhalter-Strich, fehlende Dauer als
  Strich, unparsbare Eingabe als Rohstring) — bestehende
  `FlightCard.test.tsx`/`TrainCard.test.tsx`-Tests zur Dauer-Anzeige
  unverändert grün, da reine Verschiebung ohne Logikänderung.
- 🟡 Phase 6 Buchungsseite — Grundgerüst mit editierbaren Sektionen steht
  (6.1-6.5, 6.11, 6.13), manueller Bearbeitungsmodus für Aktivitäten
  (6.12) seit 17.08. ebenfalls fertig, aber Kostenübersicht (6.6, 6.7) und
  Checkliste (6.8-6.10) fehlen noch.
  Vom autonomen IT-Chef-Lauf am 07.09. einen bereits über einen offenen,
  aber noch nicht gemergten Auto-Fix-PR (#19,
  `it-chef-autofix/update-stored-trip-silent-save-failure-2026-09-06`, von
  `reports/it-chef.md` am 06.09. diagnostiziert) vollständig verifizierten
  Bug direkt auf `it-chef/auto` behoben: `updateStoredTrip()`
  (`tripStorage.ts`) ruft `saveStoredChat()` zwar auf, verwarf deren
  Rückgabewert (ob das Schreiben nach `localStorage` wirklich geklappt hat)
  aber und lieferte immer den gemergten Trip zurück — dieselbe Fehlerklasse,
  die für den Haupt-Chat-Ablauf in `useChat.ts` bereits durch den
  `storageWarning`-Zustand abgedeckt ist, hier für die drei
  `updateStoredTrip()`-Aufrufer (`Flugsuche.tsx`, `Hotelsuche.tsx`,
  `Buchung.tsx`) aber noch offen war. Bei vollem Speicher/privatem Modus
  zeigten diese drei Seiten weiterhin eine Erfolgsmeldung ("Flug/Unterkunft
  in deinen Reiseplan übernommen" bzw. die aktualisierte Aktivitätenliste),
  obwohl ein Neuladen die Änderung verworfen hätte. Fix:
  `updateStoredTrip()` gibt jetzt zusätzlich `saved: boolean` zurück; alle
  drei Aufrufer zeigen bei `saved === false` denselben
  `storageWarning`-Hinweistext, der im Chat schon etabliert ist (exakt
  gleicher Text, gleiches `role="status"`-Muster wie in `KiChat.tsx`/
  `ChatInput.tsx`). Vier neue Regressionstests (zwei in
  `tripStorage.test.ts` für `saved` true/false, je einer in
  `Flugsuche.test.tsx`/`Hotelsuche.test.tsx`/`Buchung.test.tsx` für die
  neue Warnung bei fehlgeschlagenem Speichern — vor dem Fix reproduzierbar
  rot verifiziert). Der ursprüngliche Auto-Fix-PR #19 bleibt als überholt
  zurück (kann bei nächster PR-Hygiene-Aufräumung geschlossen werden, wie
  in `reports/it-chef.md` bereits für andere Altbranches vorgeschlagen).
- ⚪ Phase 2 Auth/Backend — nicht begonnen, blockiert von Backend-Entscheidung
- 🟡 Phase 7 Trip-Lifecycle — Meine-Reisen mit Demo-Daten (7.5),
  `calculateProgress.ts` (7.1) und die Entwürfe-Seite (7.2) stehen;
  Kartenansicht (7.14) zeigt seit 11.08. den echten im KI-Chat geplanten
  Trip statt Demo-Koordinaten; Favoriten-Seite (7.9) seit 11.08. und
  Preisalarme-Seite (7.10) sowie Angebote-Seite (7.8) seit 12.08. mit
  Demo-Daten und funktionierendem Entfernen-Button; 7.3 (Entwurfs-Aktionen
  pausieren/duplizieren/abschließen/löschen) seit 16.08. ebenfalls fertig;
  Aktivitäten-Seite (7.13) seit 17.08. ebenfalls mit Demo-Daten und
  Entfernen-Button fertig; Kalender-Seite (7.11) seit 17.08. ebenfalls mit
  Demo-Daten fertig; Warenkorb-Seite (7.6) seit 17.08. ebenfalls mit
  Demo-Daten und gruppierten Positionen fertig; ReiseSuche-Seite (7.15)
  seit 21.08. ebenfalls fertig (auf `it-chef/auto`, noch nicht in `main`
  gemergt); Dashboard-Seite (7.7) seit 27.08. ebenfalls fertig (auf
  `it-chef/auto`, noch nicht in `main` gemergt); Rest (7.4, 7.12) komplett
  offen.
  Vom autonomen IT-Chef-Lauf am 13.09. (weiterer Lauf) einen von
  `reports/support-chef.md` (11.09., Fund 1, seit vier Freigabe-Chef-Läufen
  unabhängig als weiterhin aktuell bestätigt, siehe `freigabe-chef-log.md`)
  gemeldeten Fund behoben: Die "Ehrlich statt irreführend"-Hinweiskarte in
  `Reiseentwuerfe.tsx` ("Planung fortsetzen" öffnet bei mehreren Entwürfen
  immer denselben Chat) blendete sich über `drafts.length > 1` ein —
  `finalizeDraft()` entfernt einen abgeschlossenen Entwurf aber nicht aus
  `drafts`, nur der Status wechselt auf `finalized`. Schloss man von zwei
  Entwürfen einen ab, blieb `drafts.length` bei 2, die Karte blieb sichtbar
  und behauptete weiterhin "mehrere gleichzeitig aktive Planungen", obwohl
  nur noch eine einzige tatsächlich aktive Planung übrig war — genau die
  Karte, die laut eigenem Kommentar für Ehrlichkeit steht, wurde dadurch im
  Abschluss-Fall selbst ungenau. Fix: exakt der im Bericht vorgeschlagene
  Ansatz — Bedingung zählt jetzt nur noch nicht-finalisierte Entwürfe
  (`drafts.filter((draft) => draft.status !== 'finalized').length > 1`
  statt `drafts.length > 1`). Der zweite, im selben Bericht genannte Punkt
  (fehlender dauerhafter Dismiss-Mechanismus, analog zur
  Prämienprogramm-Karte in `Dashboard.tsx`) bleibt bewusst offen für einen
  künftigen, eigenständigen Lauf — eigene, über die reine Zähl-Korrektur
  hinausgehende Änderung (neuer `localStorage`-Mechanismus). Neuer
  Regressionstest in `Reiseentwuerfe.test.tsx` (zwei Entwürfe, einer
  abgeschlossen → Hinweis verschwindet; vor dem Fix reproduzierbar rot
  verifiziert).
  Vom autonomen IT-Chef-Lauf am 14.09. einen von `reports/support-chef.md`
  (13.09., Vorschlag 2) gemeldeten Fund für die Preisalarme-Seite (7.10)
  behoben: Der Entfernen-Button (`Preisalarme.tsx`) löschte einen
  Preisalarm bisher mit einem einzigen Klick sofort und endgültig, ohne
  Rückfrage. Der Bericht listet fünf betroffene Seiten
  (`Preisalarme.tsx`/`Favoriten.tsx`/`Angebote.tsx`/`Aktivitaeten.tsx`/
  `Warenkorb.tsx`) und schlägt vor, "einmal festlegen, dann überall gleich
  anwenden" — dieser Lauf setzt bewusst nur die Preisalarme-Seite um (ein
  einzelner, klar abgegrenzter Punkt gemäß Autonomer-Tagesmodus-Regel),
  exakt nach dem bereits etablierten Bestätigungsdialog-Muster aus dem
  "Neu starten?"-Dialog in `KiChat.tsx` (gleiche `Dialog`-Komponente,
  gleiches Abbrechen/destructive-Button-Layout), statt einen neuen,
  bisher im Code nicht existierenden Rückgängig-Toast-Mechanismus zu
  erfinden. Ein Klick auf das Papierkorb-Icon öffnet jetzt
  "Preisalarm entfernen?" mit dem betroffenen Routennamen, erst "Ja,
  entfernen" löst `removeAlert()` aus, "Abbrechen" schließt den Dialog
  ohne Änderung. Die übrigen vier Seiten aus dem Bericht bleiben bewusst
  offen für künftige Läufe, um dasselbe Muster dort ebenfalls anzuwenden.
  Bestehende Tests in `Preisalarme.test.tsx` auf den zusätzlichen
  Bestätigungsklick angepasst, ein neuer Test dort (Abbrechen verwirft die
  Löschung, Alarm bleibt sichtbar).
  Vom autonomen IT-Chef-Lauf am 14.09. (weiterer Lauf) dasselbe, am
  gleichen Tag etablierte Bestätigungsdialog-Muster auf die
  Favoriten-Seite (7.9) übertragen: Der Entfernen-Button (Herz-Icon,
  `Favoriten.tsx`) löschte einen Favoriten bisher ebenfalls mit einem
  einzigen Klick sofort und endgültig, ohne Rückfrage — derselbe, im
  obigen Preisalarme-Eintrag beschriebene Fund aus
  `reports/support-chef.md` (13.09., Vorschlag 2), hier nur die nächste
  der dort bewusst offen gelassenen vier Seiten. Exakt dasselbe Muster
  wie in `Preisalarme.tsx` (gleiche `Dialog`-Komponente, gleicher
  Abbrechen/destructive-Button-Aufbau, keine neue Design-Entscheidung
  nötig): Ein Klick auf das Herz-Icon öffnet jetzt "Aus Favoriten
  entfernen?" mit dem betroffenen Zielnamen, erst "Ja, entfernen" löst
  `removeFavorite()` aus, "Abbrechen" schließt den Dialog ohne Änderung.
  Die übrigen drei Seiten (`Angebote.tsx`, `Aktivitaeten.tsx`,
  `Warenkorb.tsx`) bleiben weiterhin bewusst offen für künftige Läufe.
  Bestehender Test in `Favoriten.test.tsx` auf den zusätzlichen
  Bestätigungsklick umgestellt, ein neuer Test dort ergänzt (Abbrechen
  verwirft die Löschung, Favorit bleibt sichtbar).
  Vom autonomen IT-Chef-Lauf am 14.09. (weiterer Lauf) dasselbe Muster auf
  die Angebote-Seite (7.8) übertragen: Der Entfernen-Button (X-Icon,
  `Angebote.tsx`) löschte ein gespeichertes Angebot bisher ebenfalls mit
  einem einzigen Klick sofort und endgültig, ohne Rückfrage — dieselbe,
  in den beiden obigen Einträgen beschriebene Fund-Quelle aus
  `reports/support-chef.md` (13.09., Vorschlag 2), hier die nächste der
  dort bewusst offen gelassenen Seiten. Exakt dasselbe Muster wie in
  `Preisalarme.tsx`/`Favoriten.tsx` (gleiche `Dialog`-Komponente, gleicher
  Abbrechen/destructive-Button-Aufbau, keine neue Design-Entscheidung
  nötig): Ein Klick auf das X-Icon öffnet jetzt "Angebot entfernen?" mit
  der betroffenen Angebotszusammenfassung, erst "Ja, entfernen" löst
  `removeOffer()` aus, "Abbrechen" schließt den Dialog ohne Änderung. Die
  übrigen zwei Seiten (`Aktivitaeten.tsx`, `Warenkorb.tsx`) bleiben
  weiterhin bewusst offen für künftige Läufe. Bestehender Test in
  `Angebote.test.tsx` auf den zusätzlichen Bestätigungsklick umgestellt,
  ein neuer Test dort ergänzt (Abbrechen verwirft die Löschung, Angebot
  bleibt sichtbar).
  Vom autonomen IT-Chef-Lauf am 14.09. (weiterer Lauf) dasselbe Muster auf
  die Aktivitäten-Seite (7.13) übertragen: Der Entfernen-Button (X-Icon,
  `Aktivitaeten.tsx`) löschte eine geplante Aktivität bisher ebenfalls mit
  einem einzigen Klick sofort und endgültig, ohne Rückfrage — dieselbe,
  in den obigen Einträgen beschriebene Fund-Quelle aus
  `reports/support-chef.md` (13.09., Vorschlag 2), hier die vorletzte der
  dort bewusst offen gelassenen Seiten. Exakt dasselbe Muster wie in
  `Preisalarme.tsx`/`Favoriten.tsx`/`Angebote.tsx` (gleiche
  `Dialog`-Komponente, gleicher Abbrechen/destructive-Button-Aufbau, keine
  neue Design-Entscheidung nötig): Ein Klick auf das X-Icon öffnet jetzt
  "Aktivität entfernen?" mit dem betroffenen Aktivitätsnamen, erst "Ja,
  entfernen" löst `removeActivity()` aus, "Abbrechen" schließt den Dialog
  ohne Änderung. Die letzte verbleibende Seite (`Warenkorb.tsx`) bleibt
  weiterhin bewusst offen für einen künftigen Lauf. Bestehender Test in
  `Aktivitaeten.test.tsx` auf den zusätzlichen Bestätigungsklick
  umgestellt, ein neuer Test dort ergänzt (Abbrechen verwirft die
  Löschung, Aktivität bleibt sichtbar).
  Vom autonomen IT-Chef-Lauf am 14.09. (weiterer Lauf) dasselbe Muster auf
  die Warenkorb-Seite (7.6) übertragen — damit ist die in
  `reports/support-chef.md` (13.09., Vorschlag 2) gemeldete Liste aller
  fünf Seiten abgearbeitet: Der Entfernen-Button (X-Icon, `Warenkorb.tsx`)
  löschte eine Position bisher ebenfalls mit einem einzigen Klick sofort
  und endgültig, ohne Rückfrage — dieselbe, in den obigen Einträgen
  beschriebene Fund-Quelle, hier die letzte der dort bewusst offen
  gelassenen Seiten. Exakt dasselbe Muster wie in
  `Preisalarme.tsx`/`Favoriten.tsx`/`Angebote.tsx`/`Aktivitaeten.tsx`
  (gleiche `Dialog`-Komponente, gleicher Abbrechen/destructive-
  Button-Aufbau, keine neue Design-Entscheidung nötig): Ein Klick auf das
  X-Icon öffnet jetzt "Aus dem Warenkorb entfernen?" mit der betroffenen
  Positionsbezeichnung, erst "Ja, entfernen" löst `removeItem()` aus,
  "Abbrechen" schließt den Dialog ohne Änderung. Bestehende Tests in
  `Warenkorb.test.tsx` auf den zusätzlichen Bestätigungsklick umgestellt,
  ein neuer Test dort ergänzt (Abbrechen verwirft die Löschung, Position
  bleibt sichtbar).
  Vom autonomen IT-Chef-Lauf am 15.09. (vierter Lauf) einen von
  `reports/support-chef.md` (15.09., Vorschlag 1) gemeldeten
  Barrierefreiheits-Fund zum eben abgeschlossenen Fünf-Seiten-Katalog
  behoben: Der Entfernen-Button pro Karte auf allen fünf Seiten
  (`Preisalarme.tsx`/`Favoriten.tsx`/`Angebote.tsx`/`Aktivitaeten.tsx`/
  `Warenkorb.tsx`) ist kein `DialogTrigger`, sondern ein normaler `Button`
  — `confirmRemoval()`/`removeAlert()`/etc. entfernt die Karte samt ihrem
  Button im selben Moment, in dem der Bestätigungsdialog schließt. Radix'
  eingebaute Fokus-Rückgabe versucht danach, genau diesen inzwischen aus
  dem DOM entfernten Button erneut zu fokussieren — das schlägt lautlos
  fehl, der Fokus landet auf `<body>`. Wer per Tastatur oder Screenreader
  mehrere Einträge hintereinander entfernen will, muss sich nach jedem
  "Ja, entfernen" unerkennbar neu durch die Seite tabben. Fix: exakt der
  im Bericht vorgeschlagene Ansatz, zentral in `src/components/ui/dialog.tsx`
  (`DialogContent`) statt fünffach dupliziert. Ein neuer `onOpenAutoFocus`
  merkt sich beim Öffnen, welches Element gerade fokussiert war (der
  angeklickte Entfernen-Button); der neue `onCloseAutoFocus` übernimmt
  beim Schließen die Fokus-Steuerung komplett selbst (`preventDefault()`)
  statt sich auf Radix' eingebautes Verhalten zu verlassen: existiert
  dieses Element beim Schließen noch (z. B. beim Abbrechen), bekommt es
  den Fokus zurück wie bisher; existiert es nicht mehr (nach einer
  bestätigten Löschung), wandert der Fokus stattdessen auf die
  Seitenüberschrift (`h1`, wie in jeder Seite über `PageHeader`
  vorhanden — vom Bericht als Ziel vorgeschlagen), mit einem temporären
  `tabindex="-1"`, der beim nächsten Fokuswechsel automatisch wieder
  entfernt wird. Betrifft automatisch alle fünf Seiten sowie jeden
  künftigen Dialog, der dasselbe Muster nutzt (z. B. den "Neu
  starten?"-Dialog in `KiChat.tsx`), ohne dort etwas ändern zu müssen.
  Neue `src/components/ui/dialog.test.tsx` (2 Tests): Bestätigen einer
  Löschung, bei der der auslösende Button verschwindet, bringt den Fokus
  auf die Seitenüberschrift; Abbrechen (auslösender Button bleibt
  bestehen) bringt den Fokus weiterhin dorthin zurück.
  Vom autonomen IT-Chef-Lauf am 17.09. (weiterer Lauf) einen von einem
  gezielt angesetzten Explore-Agenten gefundenen Barrierefreiheits-Fund
  behoben: Die "Heute"-Markierung im Kalendergitter (`Kalender.tsx`,
  7.11) war bisher rein farblich (goldener Rand plus goldene Zahl), ohne
  jede Text-Alternative für Screenreader — anders als die Trip-Badges
  direkt darunter, für die dieselbe Seite bereits eine eigene textliche
  Liste hat, "weil Kalenderzellen allein für Screenreader nicht
  zugänglich sind" (Kommentar im Code). Fix: `aria-current="date"` auf
  der betroffenen Tageszelle sowie ein `sr-only`-Zusatz "(Heute)" neben
  der Tageszahl, exakt nach dem in `ChecklistPanel.tsx` etablierten
  Muster (dortiger `sr-only`-Zusatz ", bearbeiten"). Neuer
  Regressionstest in `Kalender.test.tsx` (bei fixierter Systemzeit trägt
  genau eine Zelle `aria-current="date"` und den "(Heute)"-Text).
  Vom autonomen IT-Chef-Lauf am 02.10. (fünfter Lauf) einen von
  `reports/support-chef.md` (02.10., Vorschlag 1) gemeldeten
  Reibungspunkt behoben: Der Button "Reise mit KI planen" auf jeder
  Favoriten-Karte (7.9) verlinkte unabhängig vom angeklickten Ziel
  pauschal auf `/ki-chat` — ohne eigenen Entwurf landete man bei der
  generischen Begrüßung und musste das Ziel erneut eintippen, obwohl man
  gerade gezielt draufgeklickt hatte; lief bereits eine andere Planung,
  öffnete der Klick unverändert diese, ohne jeden Hinweis, dass er
  wirkungslos war. Fix nach dem bereits etablierten `?edit=`-Muster
  (`Buchung.tsx`/`ChecklistPanel.tsx` → `KiChat.tsx`): Jede Karte verlinkt
  jetzt auf `/ki-chat?destination={Ziel}`; ein neuer Effekt in
  `KiChat.tsx` übernimmt den Parameter als allerersten Chat-Beitrag —
  exakt wie manuelles Eintippen über `sendMessage()` — aber nur, solange
  noch kein eigener Entwurf läuft (`hasTripData(trip)` false), sonst
  bleibt die laufende Planung unberührt. Neue Tests in
  `Favoriten.test.tsx` (Linkziel je Karte) und `KiChat.test.tsx` (Param
  wird ohne Entwurf übernommen, mit laufendem Entwurf ignoriert, ohne
  Parameter passiert nichts).
  Vom autonomen IT-Chef-Lauf am 04.10. einen Folgefehler genau dieses
  Favoriten→Chat-Handoffs behoben, der bereits über den separaten
  Auto-Fix-Kanal vollständig diagnostiziert war (Auto-Fix-PR #27,
  `it-chef-autofix/stale-destination-after-reset-2026-10-03`, von
  Support-Chef am 03.10. gemeldet) — der zugehörige
  `reports/it-chef.md`-Eintrag vom 03.10. hatte den Fix fälschlich schon
  als "live" beschrieben, tatsächlich steckte er aber nur im offenen,
  noch ungemergten PR: Lief schon eine Planung, wenn jemand über eine
  Favoriten-Karte kam, wurde der `?destination=`-Parameter im Effekt in
  `KiChat.tsx` bisher nur übersprungen statt verworfen — er blieb in der
  URL stehen. Setzte man die Planung danach zurück ("Neu starten"/"Neue
  Reise planen"), feuerte derselbe Effekt erneut und schickte den alten,
  womöglich tagealten Favoriten-Klick ohne jede neue Nutzerinteraktion
  als Chat-Nachricht. Fix direkt aus dem Auto-Fix-PR übernommen statt auf
  Ni's Review zu warten, gleiches Muster wie bei mehreren früheren
  Funden: Der `hasTripData(trip)`-Check steht jetzt vor dem
  `messages.length`-Check und markiert den Parameter in diesem Fall
  sofort als erledigt (URL bereinigt), statt ihn nur zu ignorieren. Neuer
  Regressionstest in `KiChat.test.tsx` (Reset nach laufender Planung mit
  noch gesetztem Parameter sendet die veraltete Destination nicht erneut).
- 🟡 Phase 8 Urlaubsmodus & Konto — Urlaubsmodus-Grundgerüst mit
  Concierge-Chat steht (Teil von 8.1, 8.3), Rest (8.2, 8.4-8.13) offen.
  Vom autonomen IT-Chef-Lauf am 02.09. (dreiundzwanzigster Lauf) einen
  eigenständig gefundenen Bug in `findFacts()` (`src/lib/ai/mockConcierge.ts`)
  behoben: derselbe Wortgrenzen-Bug, der bereits in `findKnownDestination()`
  (`src/types/stays.ts`) gefixt wurde, steckte unabhängig davon auch in der
  Concierge-Antwortlogik — `destination.toLowerCase().includes(name)` ohne
  Wortgrenzen matchte kurze Zielnamen wie "Rom" mitten in unbeteiligten
  Wörtern (z. B. "Romantikurlaub" als Antwort auf die Zielfrage). Die
  Concierge-Antwort im Urlaubsmodus zeigte dadurch für Fragen wie "Welche
  Währung brauche ich?" still erfundene Rom-Fakten statt der ehrlichen
  Rückmeldung, dass noch kein bekanntes Reiseziel vorliegt — genau der
  "no fabricated data"-Grundsatz, den die Datei selbst im Kopfkommentar
  festhält. Fix: gleiche Wortgrenzen-Regex wie in `findKnownDestination`.
  Neue `src/lib/ai/mockConcierge.test.ts` (bisher gab es dort keine Tests).
  Vom autonomen IT-Chef-Lauf am 02.09. (vierundzwanzigster Lauf) einen von
  `reports/support-chef.md` (02.09.) gemeldeten Fund behoben: Für ein
  echtes, im KI-Chat eingetipptes Reiseziel, das einfach nicht in der
  kleinen kuratierten Liste in `mockConcierge.ts` steht (z. B. "Bali"),
  antwortete der Concierge mit demselben Satz wie ganz ohne geplante
  Reise ("Dafür brauche ich eine geplante Reise mit Reiseziel …") — fachlich
  falsch, da ja sehr wohl eine Reise geplant ist. Zusätzlich zeigten
  Begrüßung und Quick-Replies in `useConcierge.ts` in diesem Fall trotzdem
  die drei themenbezogenen Chips an, die dann bei jedem Klick dieselbe
  irreführende "kein Ziel geplant"-Antwort auslösten. Neue exportierte
  `hasKnownDestination()` in `mockConcierge.ts` (nutzt intern dieselbe
  `findFacts()`-Logik) ersetzt die bisherige reine
  Wahrheitswert-Prüfung von `destination` in `useConcierge.ts` (initiale
  Quick-Replies und nach jeder Antwort). `getConciergeReply` unterscheidet
  jetzt drei Fälle statt zwei: kein Ziel gesetzt (unverändert alter Satz),
  Ziel gesetzt aber nicht kuratiert (neuer, ehrlicher Satz "Für {Ziel}
  habe ich noch keine hinterlegten Fakten …"), Ziel bekannt (unverändert
  faktenbasierte Antworten). Der zweite, ebenfalls im selben
  Support-Chef-Bericht gemeldete Punkt (Avatar bleibt bei Ausweich-Antworten
  fälschlich `'happy'` statt eines neutraleren Zustands) bleibt für einen
  künftigen Lauf offen — hätte zusätzlich zur reinen Bugfix-Änderung hier
  eine zweite, eigenständige Änderung an `getConciergeReply`s Rückgabewert
  (Text + Match-Status) gebraucht, siehe "Einen einzigen Punkt aussuchen"
  in `.claude/skills/it-chef-eigen/SKILL.md`. Bestehender Test in
  `mockConcierge.test.ts` für den alten Zwei-Fälle-Fallback angepasst,
  zwei neue Tests dort (unbekanntes echtes Ziel, `hasKnownDestination`)
  sowie eine neue `src/hooks/useConcierge.test.ts` (bisher gab es dort
  keine Tests) für die korrigierte Quick-Replies-Logik.
  Vom autonomen IT-Chef-Lauf am 02.09. (fünfundzwanzigster Lauf) den
  zweiten, bis dahin offen gelassenen Punkt aus `reports/support-chef.md`
  (02.09.) behoben: Der Avatar sprang nach jeder Concierge-Antwort
  unbedingt auf `'happy'` — auch bei den ehrlichen Ausweich-Antworten
  (kein/unbekanntes Ziel, generische Demo-Antwort), was neben "das kann
  ich hier gerade nicht" unpassend fröhlich wirkte. `getConciergeReply`
  liefert jetzt `{ text, matched }` statt reinem `string` (`matched` ist
  `false` bei den drei Ausweich-Fällen, sonst `true`); `useConcierge.ts`
  setzt den Avatar entsprechend auf den bereits bestehenden, bisher aber
  ungenutzten `'error'`-Zustand (`TravixAvatar.tsx`) statt auf `'happy'`.
  Bestehende Tests in `mockConcierge.test.ts` auf das neue
  Rückgabeformat angepasst, neue Tests dort (matched-Flag pro Fall)
  sowie drei neue Tests in `useConcierge.test.ts` für den Avatar-Zustand
  nach Antworten mit bekanntem/unbekanntem/fehlendem Ziel.
  Vom autonomen IT-Chef-Lauf am 06.09. (weiterer Lauf) einen bereits über
  einen offenen, aber noch nicht gemergten Auto-Fix-PR
  (`it-chef-autofix/concierge-question-word-boundary-2026-09-03`)
  vollständig diagnostizierten Bug direkt auf `it-chef/auto` behoben:
  `getConciergeReply()` (`mockConcierge.ts`) erkannte die Themen
  "Währung"/"Begrüßung" per rohem `String`-Keyword-Match ohne Wortgrenzen
  bei den kurzen, vollständigen Wörtern "euro" und "hi" — dieselbe
  Fehlerklasse, die bereits in `findFacts()`, `findKnownDestination()` und
  `detectTransportMode()` gefunden und behoben wurde, hier aber
  unabhängig davon noch offen war. Dadurch beantwortete der Concierge z. B.
  "Wann fliegen wir nach Europa?" fälschlich mit einem Währungs-Fakt (Treffer
  mitten in "Europa") und "Wo finde ich gutes Sushi?" fälschlich mit der
  Begrüßungsfloskel (Treffer mitten in "Sushi") — erfundene Themenbezüge
  entgegen dem im Datei-Kopfkommentar selbst festgehaltenen
  "no fabricated data"-Grundsatz. Fix: beide Keywords jetzt mit
  `\b`-Wortgrenzen (`\beuros?\b`, `\bhi\b`), die übrigen Einträge bleiben
  bewusst unverändert, da es sich um Wortstämme handelt (z. B. "währung" soll
  weiterhin "Währungen" matchen). Zwei neue Regressionstests in
  `mockConcierge.test.ts` (Keyword nur als Teilwort löst keinen Fakt aus;
  Keyword als eigenständiges Wort funktioniert weiterhin).
  Vom autonomen IT-Chef-Lauf am 03.09. (sechsundzwanzigster Lauf) einen
  eigenständig gefundenen Bug in `FlightWizard.tsx` behoben: `isValid`
  prüfte bei "Hin- und Rückflug" nur, ob überhaupt ein Rückflugdatum
  gesetzt ist, nicht ob es nach dem Hinflugdatum liegt — anders als beim
  strukturell identischen `HotelWizard.tsx`, das `checkOutDate >
  checkInDate` bereits korrekt prüft. Der einzige Schutz war das
  `min`-Attribut am Rückflug-Feld, das nicht rückwirkend greift, wenn
  danach das Hinflugdatum auf einen späteren Zeitpunkt geändert wird:
  Rückflug erst setzen, dann Hinflug nach hinten verschieben, und der
  "Flüge suchen"-Button blieb für eine unmögliche Reise (Rückflug vor
  Hinflug) anklickbar, ohne jede Fehlermeldung. Fix: `isValid` prüft
  jetzt zusätzlich `returnDate >= departureDate` (Gleichheit erlaubt,
  anders als beim Hotel-Checkout, da ein Flug am selben Tag hin und
  zurück technisch möglich ist). Neuer Regressionstest in
  `FlightWizard.test.tsx`.
  Vom autonomen IT-Chef-Lauf am 03.09. (siebenundzwanzigster Lauf) einen
  weiteren eigenständig gefundenen Bug in `mockAdvisor.ts` behoben:
  `detectTransportMode()` erkannte Transportmittel per reinem
  `String.includes()` ohne Wortgrenzen — dasselbe Muster, das zuvor schon
  in `findFacts()`/`findKnownDestination()` gefunden und mit
  Wortgrenzen-Regex behoben wurde, hier aber noch nicht geprüft. Dadurch
  matchte z. B. "Business Class bitte" fälschlich das Bus-Keyword `bus`
  (in "Business") und "Ich hätte gern einen Zimmerservice" fälschlich das
  Zug-Keyword `ice` (in "Service") — der Bot bestätigte dann ein falsches
  Transportmittel, ohne dass die Nutzerin das korrigieren konnte, außer
  über eine neue Antwort. Fix: `detectTransportMode()` prüft jedes
  Keyword jetzt per `\b`-umrandetem Regex (Sonderzeichen escaped) statt
  per reinem Teilstring-Vergleich, analog zum bestehenden Muster in
  `mockConcierge.ts`. Zwei neue Regressionstests in
  `mockAdvisor.test.ts` (die beiden oben genannten Fälle).
  Vom autonomen IT-Chef-Lauf am 04.09. (zweiunddreißigster Lauf) einen
  weiteren von `reports/it-chef.md` (03.09.) gemeldeten Fund behoben:
  „Preise im Rohformat" — `FlightCard.tsx` und `HotelCard.tsx` rendern
  `{offer.totalAmount} {offer.totalCurrency}` unformatiert (z. B.
  "249.00 EUR") statt im deutschen Format. Inhaltlich der Nachzieher des
  nicht mehr mergebaren PR #9. Neue `formatOfferPrice()`-Hilfsfunktion in
  `src/lib/format.ts` (`Intl.NumberFormat('de-DE', { style: 'currency',
  currency })`, mit Fallback auf den Rohwert bei nicht-numerischem
  Betrag) ersetzt die rohe Konkatenation in beiden Karten. `TrainCard.tsx`
  hat denselben Bug, bleibt aber bewusst unangetastet — sie ist laut
  `reports/it-chef.md` (Vorschlag 4) toter Code, der nirgends importiert
  wird, und ihre Zukunft (anbinden oder löschen) war nicht Teil dieses
  einen, klar abgegrenzten Punkts (vom autonomen IT-Chef-Lauf am 08.09.
  nachgeholt, siehe unten). Neue `src/lib/format.test.ts`
  (bisher gab es dort keine Tests) mit vier Fällen (EUR, Beträge mit
  Cent-Anteil, andere Währung, nicht-numerischer Fallback).
  Vom autonomen IT-Chef-Lauf am 04.09. (vierunddreißigster Lauf) einen von
  `reports/it-chef.md` (04.09.) als "guter Kandidat für den nächsten Lauf"
  gemeldeten Fund behoben: Bei einem echten Suchfehler in der
  automatischen Unterkunftssuche des linearen Haupt-Chat-Ablaufs
  (`useChat.ts`, `nextField === 'accommodation'`-Zweig um Zeile 320) setzte
  der Code `stayError`, aber anders als der strukturell identische
  "Bearbeiten"-Pfad (`startEdit`, Zeile 174) keine `quickReplies` — die
  Nutzerin sah die Fehlermeldung, hatte aber keinen Chip zum Weitermachen,
  einziger Ausweg war ein kompletter Chat-Neustart. Beide betroffenen
  Zweige (`.then()` bei `result.errors.length > 0` sowie `.catch()`) setzen
  jetzt zusätzlich `setQuickReplies(['Neue Reise planen'])`, exakt analog
  zum bereits korrekten `startEdit`-Pfad. Zwei neue Regressionstests in
  `useChat.test.ts` für den Haupt-Chat-Ablauf (aufgelöster Fehler,
  abgelehntes Promise).
  Vom autonomen IT-Chef-Lauf am 04.09. (fünfunddreißigster Lauf) einen
  weiteren von `reports/it-chef.md` (04.09.) gemeldeten Fund behoben:
  `FlightWizard.tsx`s `isValid` prüfte das Von-/Nach-Feld nur auf
  `.length === 3`, ohne Buchstabenprüfung — anders als die strengere
  `IATA_CODE_PATTERN`-Prüfung (`/^[a-zA-Z]{3}$/`) für dieselbe Eingabe im
  Haupt-Chat-Ablauf (`useChat.ts`). Ziffern/Sonderzeichen wie "123" wurden
  bisher als gültiger Flughafencode akzeptiert. Neue gleichlautende lokale
  `IATA_CODE_PATTERN`-Konstante in `FlightWizard.tsx`, `isValid` prüft
  jetzt beide Felder darüber. Neuer Regressionstest in
  `FlightWizard.test.tsx`.
  Vom autonomen IT-Chef-Lauf am 05.09. (sechsunddreißigster Lauf) einen
  von `reports/support-chef.md` (04.09.) gemeldeten Fund behoben: Der
  Mikrofon-Knopf im Chat (`ChatInput.tsx`) konnte dauerhaft hängen
  bleiben, ohne dass die Nutzerin etwas davon erfährt. `startListening()`
  (`src/lib/ai/speech.ts`) rief `recognition.start()` bisher ungeschützt
  auf — wirft der Browser hier (z. B. bei verweigerter
  Mikrofonberechtigung oder einem doppelten Start), griffen weder
  `onerror` noch `onend`, `listening` blieb in `ChatInput` für immer
  `true` und die bereits vorhandene `micError`-Anzeige erschien nie.
  `recognition.start()` steht jetzt in einem `try`/`catch`, das im
  Fehlerfall dieselben `onError`/`onEnd`-Callbacks auslöst wie der
  bestehende `onerror`-Handler (`ChatInput.tsx` setzt darüber `listening`
  zurück und zeigt `micError`). Neue `src/lib/ai/speech.test.ts` (bisher
  gab es dort keine Tests): deckt den neuen Fehlerfall (Start wirft,
  `onError`/`onEnd` werden aufgerufen, Rückgabewert `null`), den
  Erfolgsfall und den Fall ohne Browser-Unterstützung ab.
  Vom autonomen IT-Chef-Lauf am 05.09. (achtunddreißigster Lauf) den in
  `reports/it-chef.md` (04.09.) gemeldeten Fund "ungeschützte
  `localStorage`-Schreibzugriffe" für den crash-verhindernden Teil behoben:
  `localStorage.setItem()` in `useChat.ts` (zwei Stellen: die Persistenz-
  Effect und der `beforeunload`-Handler) sowie in `updateStoredTrip()`
  (`tripStorage.ts`) stand bisher ungeschützt — bei vollem Speicher oder im
  privaten Modus wirft der Browser dort einen `DOMException`, der
  ungefangen aus einem `useEffect` bzw. Klick-Handler nach oben durchschlägt
  und die Seite abstürzen lassen kann (gleiche Fehlerklasse wie der bereits
  behobene `hasTripData()`-Fund). Fix: neue `saveStoredChat()`-Hilfsfunktion
  in `tripStorage.ts`, die den Schreibzugriff in ein `try`/`catch` packt und
  im Fehlerfall nur `console.error` loggt — exakt dasselbe Muster, das
  `loadStoredChat()` (Lesezugriff) und `duffel/client.ts` (Netzwerkfehler)
  bereits nutzen. Alle drei betroffenen Schreibstellen rufen jetzt diese
  Funktion statt `localStorage.setItem()` direkt auf. Der vom Bericht
  zusätzlich vorgeschlagene Teil — eine eigene, nutzersichtbare
  Fehlermeldung statt reinem Loggen — bleibt bewusst offen: die
  Persistenz-Effect läuft nach jeder Chat-Nachricht ohne bestehende
  UI-Stelle dafür, welche Meldung dort wie lange angezeigt würde ist eine
  eigene Design-Entscheidung. Fünf neue Regressionstests (drei in
  `tripStorage.test.ts` für `saveStoredChat`/`updateStoredTrip`, zwei in
  `useChat.test.ts` für die Persistenz-Effect und den
  `beforeunload`-Handler), die `Storage.prototype.setItem` mit einem
  `QuotaExceededError` mocken und prüfen, dass nichts mehr wirft.
  Vom autonomen IT-Chef-Lauf am 05.09. (weiterer Lauf) den von
  `reports/support-chef.md` (05.09., Vorschlag 3) gemeldeten Anschlussfund
  behoben: Ein fehlgeschlagenes Speichern (voller `localStorage`) blieb für
  die Nutzerin unsichtbar — jede Chat-Nachricht wirkte gespeichert, aber bei
  einem späteren Neuladen war der ganze geplante Trip stillschweigend weg.
  `saveStoredChat()` (`tripStorage.ts`) gibt jetzt zurück, ob der Schreib-
  zugriff geklappt hat, statt reinem `void`. `useChat.ts` hält das Ergebnis
  in einem neuen `storageWarning`-Zustand (nur in der Persistenz-Effect
  gesetzt, nicht im `beforeunload`-Handler — die Seite entlädt dort ohnehin
  gerade). `KiChat.tsx` zeigt bei `storageWarning` denselben, vom Bericht
  vorgeschlagenen Hinweistext unter der Chat-Kopfzeile, exakt nach dem
  bestehenden `micError`-Muster in `ChatInput.tsx` (`role="status"`,
  dezenter `text-muted-foreground`-Text). Zwei neue Tests in
  `tripStorage.test.ts` (Rückgabewert bei Erfolg/Fehlschlag), zwei neue
  Tests in `useChat.test.ts` (`storageWarning` true/false) sowie eine neue
  `KiChat.test.tsx` (bisher gab es dort keine Tests; mockt `useChat`, prüft
  Ein-/Ausblenden des Hinweistexts).
  Vom autonomen IT-Chef-Lauf am 06.09. (weiterer Lauf) einen bereits über
  einen offenen, aber noch nicht gemergten Auto-Fix-PR (#15,
  `it-chef-autofix/ueberrasch-mich-zufallsziel-2026-09-03`) vollständig
  diagnostizierten Bug direkt auf `it-chef/auto` behoben: Der Quick-Reply
  "Überrasch mich" aus der Begrüßung landete in `getNextAdvisorStep()`
  (`mockAdvisor.ts`) unverändert als `trip.destination` — die Antwort
  lautete dann "Überrasch mich klingt nach einer großartigen Idee!", und
  der Wert wanderte als nicht auflösbares "Reiseziel" weiter in
  Unterkunfts-/Flugsuche (`findKnownDestination` schlägt fehl),
  Kartenansicht und Reiseplan. Fix: Bei diesem Text (per Regex erkannt,
  deckt auch "Überrasche mich" ab) wird jetzt stattdessen zufällig eines
  der kuratierten `knownDestinations` gewählt — genau die Ziele, für die
  die automatische Unterkunfts- und Flugsuche danach auch wirklich
  funktioniert. Neuer Regressionstest in `mockAdvisor.test.ts`.
  Vom autonomen IT-Chef-Lauf am 07.09. einen von `reports/support-chef.md`
  (06.09., Vorschlag 1) gemeldeten Fund behoben: Nach einer erfolgreichen
  Unterkunfts- oder Flugsuche mit echten null Treffern blieben die Chat-
  Chips leer (`useChat.ts` setzt `quickReplies` beim Start jeder Nachricht
  auf `[]` zurück und befüllt sie bisher nur im Fehlerfall neu) — eine
  Sackgasse mitten im Chat, einziger Ausweg war ein kompletter Neustart.
  Betrifft alle drei Stellen mit echter Suche: den Haupt-Chat-Ablauf für
  Unterkunft (Zeile ~322), den "Bearbeiten"-Pfad für Unterkunft (Zeile
  ~176) und die Flugsuche (Zeile ~99). Fix: In allen drei `.then()`-Zweigen
  wird bei `result.errors.length === 0 && result.offers.length === 0`
  jetzt zusätzlich `setQuickReplies(['Neue Reise planen'])` gesetzt — exakt
  dasselbe, im ganzen Code bereits durchgängig etablierte Muster, das für
  den Fehlerfall an denselben Stellen schon existiert (keine neue,
  unbelegte Chip-Beschriftung erfunden, wie es der ebenfalls im Bericht
  vorgeschlagene zweite Chip "Andere Daten versuchen" gewesen wäre — dafür
  gibt es noch keinen Klick-Handler und keine Vorgabe, was er tun soll).
  Verhalten bei echten Treffern (Kartenliste erscheint) bleibt unverändert
  ohne Chips. Drei neue Regressionstests in `useChat.test.ts` (je einer für
  Haupt-Chat-Unterkunft, "Bearbeiten"-Unterkunft, Flug), vor dem Fix
  reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 07.09. (weiterer Lauf) den von
  `reports/support-chef.md` (07.09.) gemeldeten Anschlussfund behoben: Der
  heutige Fix der widersprüchlichen Unterkunfts-Ankündigung bei unbekanntem
  Ziel deckte nur die halbe Lücke ab. Im Hauptchat sagte
  `getNextAdvisorStep()` (`mockAdvisor.ts`) zwar bereits ehrlich "beschreib
  einfach, was für eine Unterkunft du dir vorstellst", aber `useChat.ts`
  prüfte im selben `sendMessage()`-Callback direkt danach unabhängig
  nochmal `findKnownDestination()` und hängte bei unbekanntem Ziel
  trotzdem die alte "kenne ich noch keine Unterkünfte … nutze dafür kurz
  die manuelle Hotelsuche"-Nachricht an — zwei Bot-Bubbles mit
  gegensätzlicher Handlungsaufforderung direkt hintereinander. Im
  "Bearbeiten"-Pfad (`startEdit('accommodation')`) bestand derselbe
  Widerspruch unverändert, vom heutigen Fix gar nicht berührt: die feste
  Eröffnungsnachricht "Klar, ich suche eine neue Unterkunft für dich"
  versprach weiterhin eine Suche, obwohl unmittelbar danach dieselbe
  Ehrlichkeits-Notiz folgte. Fix: neues optionales Feld
  `accommodationNoticeHandled` auf `AdvisorReply` (`types/chat.ts`), das
  `getNextAdvisorStep()` bei unbekanntem Ziel auf `true` setzt —
  `useChat.ts` hängt die zweite Notiz im Hauptchat-Ablauf jetzt nur noch
  an, wenn dieses Flag fehlt, statt den Sachverhalt ein zweites Mal selbst
  zu prüfen. `startEdit()` (`useChat.ts`) wurde für `accommodation`
  umstrukturiert: bei unbekanntem Ziel erscheint jetzt von vornherein nur
  noch die ehrliche Nachricht (kein Suchversprechen, lädt zum
  Weiterschreiben ein, exakt im Wortlaut des Hauptchat-Pendants), keine
  zweite Notiz mehr danach; bei bekanntem Ziel unverändertes Verhalten
  (Suchankündigung plus echte Suche). Zwei bestehende Tests in
  `useChat.test.ts` auf das neue Ein-Nachrichten-Verhalten angepasst (statt
  zwei Nachrichten jetzt eine, Inhalt ohne "manuelle Hotelsuche"), zwei
  neue Assertions in `mockAdvisor.test.ts` für das neue Flag — vor dem Fix
  reproduzierbar mit dem alten Verhalten (zwei Nachrichten) verifiziert.
  Vom autonomen IT-Chef-Lauf am 08.09. den beim Preisformat-Fix vom 04.09.
  bewusst zurückgestellten Teil für `TrainCard.tsx` nachgeholt: Der Preis
  wird jetzt ebenfalls über `formatOfferPrice()` angezeigt statt roh
  konkateniert ("129.00 EUR" → "129,00 €"), identisch zum bereits
  bestehenden Muster in `FlightCard.tsx`/`HotelCard.tsx`. Ändert nichts an
  der weiterhin fehlenden Einbindung von `TrainCard`/`TrainResults` in
  eine Seite (5.7 bleibt offen). Neue `TrainCard.test.tsx` (bisher gab es
  dort keinen Test), vor dem Fix reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 08.09. (weiterer Lauf) den von
  `reports/it-chef.md` (08.09.) gemeldeten Fund behoben: Ein
  fehlgeschlagener `searchStays()`-Aufruf im KI-Chat (`useChat.ts`, State
  `stayError: boolean`) verlor die konkrete Fehlermeldung —
  `HotelResults.tsx` zeigte dafür immer denselben festen Text, egal ob
  Duffel offline, überlastet oder mit einem HTTP-Fehler geantwortet
  hatte. Die Flugsuche macht es bereits richtig: `flightErrors:
  DuffelError[]` reicht die von `callDuffelProxy()` gebaute, konkrete
  deutsche Fehlermeldung durch (`FlightResults.tsx`). Fix: exakt dasselbe
  Muster auf die Unterkunftssuche übertragen — `stayError: boolean` durch
  `stayErrors: DuffelError[]` ersetzt (State, beide `searchStays`-Aufrufstellen
  in `useChat.ts` inkl. `resetChat`/`startEdit`/`sendMessage`), `KiChat.tsx`
  reicht `stayErrors` statt `stayError` durch, `HotelResults.tsx` rendert
  jetzt wie `FlightResults.tsx` alle `errors`-Meldungen statt eines festen
  Texts. Reines Fehlermeldungs-Detail, keine Verhaltensänderung bei
  Erfolg oder echter Null-Treffer-Suche. Zehn bestehende Assertions in
  `useChat.test.ts` auf das neue Array-Format angepasst (exakt analog zu
  den bestehenden `flightErrors`-Tests: `.length` bei erwartetem Fehler,
  `toEqual([])` sonst), `KiChat.test.tsx`s Mock-Rückgabewert ebenfalls
  angepasst.
  Vom autonomen IT-Chef-Lauf am 08.09. (weiterer Lauf) einen von
  `reports/support-chef.md` (08.09.) gemeldeten Ehrlichkeits-Fund behoben:
  `TrainResults.tsx:18` zeigte während `loading` den Text "Travix sucht
  echte Zug-, Bus- und Fährverbindungen …" — dieselbe Fehlerklasse, die der
  autonome IT-Chef-Lauf am 28.08. bereits in `mockAdvisor.ts` beheben
  musste: Für Zug/Bus/Fähre existiert (5.7 weiterhin offen) keine
  angebundene Datenquelle, das Wort "echte" versprach also eine Suche, die
  es noch gar nicht geben kann (anders als bei `FlightResults.tsx`/
  `HotelResults.tsx`, wo eine echte Duffel-Suche dahintersteht). Der Fund
  betrifft aktuell noch keine echte Nutzerin, da `TrainResults`/`TrainCard`
  laut Support-Chef-Bericht (per Grep bestätigt) in keine Seite eingebunden
  sind — reine Vorab-Korrektur, damit der Text beim künftigen Einbinden
  (5.7) nicht vergessen wird. Fix: "echte" aus dem Ladetext entfernt
  ("Travix sucht nach Zug-, Bus- und Fährverbindungen …"), minimale,
  mechanische Änderung ohne neue Wortwahl-Entscheidung. Neue
  `TrainResults.test.tsx` (bisher gab es dort keinen Test): prüft
  Ladetext ohne "echte", Leerzustand, Nulltreffer-Anzeige und
  Kartenrendering.
  Vom autonomen IT-Chef-Lauf am 09.09. (weiterer Lauf) eine Testlücke im
  bestehenden Urlaubsmodus-Grundgerüst (Teil von 8.1/8.3) geschlossen:
  `src/pages/Urlaubsmodus.tsx` selbst hatte bisher keine eigene Testdatei
  — die bestehenden Tests decken nur `useConcierge.ts`/`mockConcierge.ts`
  einzeln ab, nicht die Seite, die beides zusammen mit `loadStoredChat()`
  verdrahtet (Begrüßungstext, Zielbanner mit Datum, Quick-Replies je nach
  bekanntem/unbekanntem/fehlendem Ziel, Chat-Eingabe). Reine Testabdeckung
  für bestehendes, unverändertes Verhalten, kein Fund/keine Verhaltens-
  änderung. Neue `src/pages/Urlaubsmodus.test.tsx` (sieben Tests, Muster
  analog `Buchung.test.tsx`s `localStorage`-Seeding und `KiChat.test.tsx`s
  `Element.scrollTo`-Stub): Begrüßung ohne/mit Reise, Zielbanner mit/ohne
  Datum, Quick-Replies für bekanntes/unbekanntes/fehlendes Ziel, sofortige
  Anzeige der Nutzer-Nachricht plus Denk-Indikator, faktenbasierte Antwort
  nach Ablauf der simulierten Verzögerung (`vi.useFakeTimers`).
  Vom autonomen IT-Chef-Lauf am 11.09. (weiterer Lauf) eine weitere von
  `reports/it-chef.md` (10.09.) aufgelistete Testabdeckungslücke
  geschlossen: `ChatMessage.tsx` (4.5, einzelne Chat-Blase im KI-Chat,
  rendert je nach `role` mit/ohne `TravixAvatar` und formatierter Uhrzeit)
  hatte bisher keine eigene Testdatei. Reine Testabdeckung für bestehendes,
  unverändertes Verhalten, kein neuer Bug gefunden. Neue
  `ChatMessage.test.tsx` (2 Tests, Muster analog `NoResultsMessage.test.tsx`/
  `TravixAvatar.test.tsx`): Assistenten-Nachricht zeigt Text, formatierte
  Uhrzeit (`toLocaleTimeString('de-DE', …)`) und den `happy`-Avatar
  (`svg.lucide-smile`); Nutzer-Nachricht zeigt Text ohne Avatar.
  Vom autonomen IT-Chef-Lauf am 11.09. (weiterer Lauf) eine weitere
  Testabdeckungslücke geschlossen: `QuickReplies.tsx` (4.7,
  Chip-Leiste für Chat-Schnellantworten, genutzt in `KiChat.tsx` und
  `Urlaubsmodus.tsx`) hatte bisher keine eigene Testdatei. Reine
  Testabdeckung für bestehendes, unverändertes Verhalten, kein neuer Bug
  gefunden. Neue `QuickReplies.test.tsx` (3 Tests, Muster analog
  `NoResultsMessage.test.tsx`): kein Rendering bei leerer Options-Liste,
  ein Button pro Option, Klick löst `onSelect` mit dem Options-Text aus.
  Vom autonomen IT-Chef-Lauf am 11.09. (weiterer Lauf) die dort selbst
  vorgemerkte Schwesterlücke geschlossen: `TripSummaryCard.tsx` (4.8,
  kompakte Reise-Zusammenfassung im KI-Chat) hatte ebenfalls noch keine
  eigene Testdatei. Reine Testabdeckung für bestehendes, unverändertes
  Verhalten, kein neuer Bug gefunden. Neue `TripSummaryCard.test.tsx` (4
  Tests, Muster analog `ChecklistPanel.test.tsx`s `MemoryRouter`-Wrapper
  für den enthaltenen `Link`): kein Rendering ohne gesetzte Trip-Felder,
  Anzeige nur der tatsächlich gesetzten Felder, Transportmittel-Label für
  den gewählten Modus, sowie alle Felder zusammen inkl. Link zu
  `/buchung`.
  Vom autonomen IT-Chef-Lauf am 17.09. (Vorschlag 2 aus
  `reports/support-chef.md`, 16.09.) behoben: Ein zweiter Klick auf das
  Mikrofon-Icon in `ChatInput.tsx` (4.6) tat bisher nichts — `handleMicClick()`
  brach einfach ab, solange schon aufgenommen wurde, statt die laufende
  Aufnahme zu stoppen. Wer aus Versehen draufklickte, musste abwarten, bis
  der Browser von selbst aufhörte, oder riskierte eine ungewollt übernommene
  Nachricht. `startListening()` (`src/lib/ai/speech.ts`) gab die
  `SpeechRecognition`-Instanz zwar schon zurück, `ChatInput.tsx` warf sie
  aber weg. Jetzt wird sie in einem `useRef` gehalten; ein Klick während
  der Aufnahme ruft `recognition.stop()` darauf auf, das bestehende
  `onend` setzt `listening` danach wie gewohnt zurück — echtes
  Ein-/Ausschalten statt totem Button. Zwei neue Regressionstests in
  `ChatInput.test.tsx` (zweiter Klick stoppt die laufende Instanz statt
  eine neue zu starten; Zustand kehrt nach `onend` zur Ausgangslage
  zurück).
  Vom autonomen IT-Chef-Lauf am 18.09. (weiterer Lauf) eine
  Fokus-Parität nachgezogen: `DialogContent` (`src/components/ui/dialog.tsx`)
  bekam am 15.09. einen `onOpenAutoFocus`/`onCloseAutoFocus`-Fallback, der
  Fokus nach dem Schließen entweder zum ursprünglichen Auslöser oder,
  falls der inzwischen aus dem DOM entfernt wurde (z. B. eine
  Löschbestätigung, deren Karte gerade verschwindet), zur Seiten-`<h1>`
  bewegt — sonst würde der Fokus auf `<body>` landen. `SheetContent`
  (`src/components/ui/sheet.tsx`, genutzt von `MobileNav.tsx`, 3.3) ist
  strukturell identisch (dieselbe Radix-Primitive, Portal/Overlay/Content/
  Close-Button) und hatte dieselbe Lücke, bisher unbemerkt, weil
  `MobileNav.tsx` sein Trigger-Element nie entfernt. Jetzt exakt
  denselben Fallback nach `SheetContent` übertragen. Neue
  `sheet.test.tsx` (2 Tests, Muster analog `dialog.test.tsx`s
  `RemovableListHarness`): Fokus landet auf der `<h1>`, wenn Bestätigen
  das öffnende Element entfernt; Fokus kehrt bei Abbruch weiterhin zum
  Auslöser zurück.
  Vom autonomen IT-Chef-Lauf am 18.09. (weiterer Lauf) einen von
  `reports/support-chef.md` (18.09., Vorschlag 1) gemeldeten
  Anschlussfehler an genau diesem neuen Fokus-Fallback behoben: Jeder
  Menüpunkt in `MobileNav.tsx` (3.3) schließt beim Klick zusätzlich zur
  Navigation das Menü (`SheetContent`s Schließen-Vorgang) — weil der
  Hamburger-Knopf als `SheetTrigger` nach jedem Seitenwechsel im DOM
  bleibt, griff der eben ergänzte Fokus-Fallback aus `sheet.tsx` und
  schickte den Fokus beim Schließen zurück zum Knopf statt zur `<h1>` der
  neu geladenen Seite. Wer per Tastatur oder Screenreader z. B. von
  "Aktivitäten" zu "Warenkorb" wechselt, musste sich nach jedem
  Menüpunkt erneut durch Kopfzeile und Menü zur eigentlichen Seite
  vorarbeiten. Fix: exakt der im Bericht vorgeschlagene Ansatz — beim
  Klick auf einen `NavLink` wird jetzt zusätzlich ein `navigatedRef`
  gesetzt; `MobileNav.tsx` übergibt `SheetContent` ein eigenes
  `onCloseAutoFocus`, das bei gesetztem `navigatedRef` den generischen
  Trigger-Fallback per `event.preventDefault()` überspringt und
  stattdessen direkt zur Seiten-`<h1>` springt (dafür exportiert
  `sheet.tsx` die bisher interne Fokus-Hilfsfunktion jetzt als
  `focusPageHeading()`, damit sie nicht dupliziert werden muss). Reine
  Schließen-ohne-Navigation-Fälle (Escape, Overlay-Klick, X-Knopf)
  kehren unverändert zum Hamburger-Knopf zurück, da dort kein
  `navigatedRef` gesetzt wird. Zwei neue Regressionstests in
  `MobileNav.test.tsx`: Fokus landet nach einem Navigationslink auf der
  `<h1>` der neuen Seite; Fokus kehrt beim Schließen ohne Navigation
  weiterhin zum Menü-Button zurück.
  Vom autonomen IT-Chef-Lauf am 05.10. (vierter Lauf desselben Tages)
  Vorschlag 2 aus `reports/support-chef.md` (05.10.) umgesetzt: Die
  Flug-Ankündigung im Hauptchat-Ablauf (`getNextAdvisorStep()` in
  `mockAdvisor.ts`, bisher eigener `if (next.transportMode === 'flight')`-
  Zweig) versprach "Ich suche jetzt nach echten Flug-Verbindungen …
  Nichts wird erfunden" — der Hauptchat-Ablauf löst die echte Flugsuche
  aber nie aus (nur der separate "Bearbeiten"-Pfad in `useChat.ts` tut
  das, laut Code-Kommentar an derselben Stelle bewusst so). Die anderen
  vier Modi (Zug/Bus/Fähre/Mietwagen) nutzen für exakt diese Lücke bereits
  seit dem 29.09.-Fix die ehrliche `noAutoSearchPhraseDe`-Formulierung
  ("hab ich noch keine automatische Suche — dein Reiseplan steht
  trotzdem!"). Fix: reiner Text-Fix, keine Änderung an der Suchlogik
  selbst — der Flug-Sonderzweig entfernt, Flug fällt jetzt durch dieselbe
  bereits etablierte, ehrliche Formulierung wie die anderen vier Modi
  (`noAutoSearchPhraseDe.flight` existierte bereits, war aber durch den
  Sonderzweig nie erreichbar). Die dadurch komplett ungenutzte
  `transportLabelsDe`-Map (einzige Verwendung war der entfernte Zweig)
  ebenfalls entfernt, Begleitkommentar entsprechend angepasst. Bestehender
  Test in `mockAdvisor.test.ts` umgestellt (prüft jetzt dieselbe ehrliche
  Formulierung wie der Zug-Test statt des alten Suchversprechens) — vor
  dem Fix durch temporäres Zurücknehmen der Quelländerung (`git stash` nur
  `mockAdvisor.ts`) reproduzierbar rot verifiziert (alter Test erwartete
  "Ich suche jetzt nach echten Flug-Verbindungen", neuer erwartet das
  Gegenteil). Der im selben Bericht sowie in `reports/it-chef.md`
  weiterhin offen gemeldete, größere Punkt — dass die echte Flugsuche im
  Hauptchat-Ablauf überhaupt nie ausgelöst wird — bleibt bewusst
  unangetastet, das wäre eine eigene Backend-Verdrahtungsentscheidung,
  keine reine Text-/Logikkorrektur.
  Vom autonomen IT-Chef-Lauf am 07.10. einen am 06.10. (fünfter Lauf)
  bewusst zurückgestellten Kandidaten jetzt live reproduziert und behoben:
  `callDuffelProxy()` (`src/lib/duffel/client.ts`, gemeinsam genutzt von
  `searchFlights`/`searchStays`) rief bisher `response.json()` auf, noch
  bevor `!response.ok` geprüft wurde. Lieferte ein Fehler-Status (z. B.
  502/504 eines vorgeschalteten Proxys) einen Nicht-JSON-Antwortkörper
  (z. B. eine HTML-Fehlerseite), warf dieses `response.json()` einen
  `SyntaxError`, der von der äußeren Catch-Klammer aufgefangen wurde — die
  Nutzerin sah dann die generische Netzwerk-/Parse-Fehlermeldung ("bitte
  prüfe deine Internetverbindung") statt der treffenderen, Status-basierten
  Meldung ("Duffel-Anfrage fehlgeschlagen (502) …"), obwohl die echte
  Ursache ein Server-/Proxy-Fehler war, kein Netzwerkproblem auf
  Nutzerseite. Neuer Regressionstest in `client.test.ts` (Fehler-Status mit
  werfendem `response.json()`) vor dem Fix reproduzierbar rot verifiziert.
  Fix: `!response.ok`-Zweig prüft den Status jetzt zuerst und parst den
  JSON-Körper erst danach in einem eigenen `try`/`catch` — schlägt das
  Parsen fehl, bleibt `rawErrors` leer und der bestehende Status-basierte
  Fallback greift wie gewohnt; der Erfolgsfall (`response.ok`) parst JSON
  weiterhin wie zuvor (eine kaputte JSON-Antwort bei Status 200 landet
  unverändert im äußeren `catch`, siehe bereits bestehender Test dafür).
  Keine Verhaltensänderung für alle vorher schon abgedeckten Fälle (echter
  Duffel-Fehler mit JSON-Body, abgelehntes `fetch()`, kaputtes JSON bei
  Erfolg) — alle vier bestehenden Tests in `client.test.ts` blieben
  unverändert grün.
  Vom autonomen IT-Chef-Lauf am 07.10. (zweiter Lauf desselben Tages) einen
  über einen eigens beauftragten Explore-Agenten gefundenen Bug in
  `resetChat()` (`useChat.ts`) behoben: `sendMessage()` plant bei jeder
  Nutzer-Nachricht einen 700ms-`setTimeout` (`replyTimeoutRef`), der am
  Ende u. a. `setMessages`/`setTrip`/`setQuickReplies`/`setAvatarState`/
  `setIsThinking(false)` aufruft — mit dem `trip`/`content` aus dem
  Moment, als die Nachricht abgeschickt wurde. `resetChat()` setzte bisher
  weder diesen Timeout zurück (obwohl genau das bereits beim Unmount in
  Zeile 92-98 etabliert ist) noch `isThinking` selbst. Wurde "Neu starten"
  innerhalb dieser 700ms geklickt (z. B. direkt nach der ersten Nachricht,
  wo `hasTripData(trip)` noch `false` ist und der Reset ohne
  Bestätigungsdialog sofort auslöst), blieb der "Travix denkt nach …"-
  Status-Indikator fälschlich sichtbar, und der alte Timeout überschrieb
  rund 700ms später den frisch zurückgesetzten Chat erneut mit der
  veralteten Antwort samt altem `trip`/`quickReplies`. Fix: `resetChat()`
  räumt den noch laufenden `replyTimeoutRef` jetzt genauso ab wie der
  bestehende Unmount-Effekt und setzt zusätzlich `isThinking` auf `false`
  — zwei Zeilen, kein neues Verhalten, nur dieselbe bereits etablierte
  Aufräum-Logik auch beim Reset angewendet. Neuer Regressionstest in
  `useChat.test.ts` ("does not let a stale pending reply land after
  resetChat() mid-thinking") vor dem Fix reproduzierbar rot verifiziert
  (`isThinking` blieb `true`, der veraltete Reply landete nach 700ms
  trotzdem).

### Sprint 1 — Fundament (KW33-34, 11.-24. Aug)
- [ ] Backend-Entscheidung treffen: Base44 vs. Alternative (Supabase,
  eigenes Backend) — **Produktentscheidung, nicht autonom fällbar**
- [ ] 4.1 `FULL_TRIP_SCHEMA` in `src/lib/ai/schemas.ts`
- [ ] 4.2 System-Prompts in `src/lib/ai/prompts.ts`
- [ ] 4.3 Echter `invokeLLM.ts`-Wrapper — ersetzt `mockAdvisor.ts`
- [x] 5.4 `TrainCard.tsx` (Zug/Bus/Fähre-Verbindung) — Kartenkomponente steht,
  inkl. `src/types/trains.ts` (`TrainOffer`); noch nicht in KI-Chat
  eingebunden (5.7 offen). Vom autonomen IT-Chef-Lauf am 18.09. einen
  Paritäts-Fund behoben: Anders als `FlightCard`/`HotelCard` hatte
  `TrainCard` keine `selected`-Prop — der "Auswählen"-Button blieb nach
  einer Auswahl unverändert aktiv klickbar, ohne "Ausgewählt"-Zustand
  oder Check-Icon. Fix 1:1 nach demselben, in beiden anderen Karten
  bereits etablierten Muster: neue `selected?: boolean`-Prop,
  `disabled={selected}` am Button, Inhalt schaltet bedingt auf
  `<Check /> Ausgewählt` um. Betrifft aktuell noch keine echte Nutzerin
  (5.7 weiterhin offen, `TrainCard` noch nirgends live eingebunden),
  aber die Komponente selbst ist jetzt konsistent mit den anderen beiden
  und bereit für die spätere Einbindung. Neuer Regressionstest in
  `TrainCard.test.tsx` (analog zum bestehenden `FlightCard.test.tsx`-Test
  für denselben Zustand).
  Vom autonomen IT-Chef-Lauf am 25.09. eine per Explore-Agent gefundene und
  selbst gegen den Code verifizierte Lücke in der (wortgleich duplizierten)
  `formatDuration()`-Funktion behoben: Anders als die daneben stehende
  `formatTime()` hatte `formatDuration()` keinen Guard für eine leere/
  fehlende Dauer — bei `duration: ''` liefert der Regex-`.exec()` `null`,
  wodurch die Funktion auf `return isoDuration` zurückfiel und schlicht den
  leeren String zurückgab. Ergebnis: statt des sonst überall verwendeten
  `—`-Platzhalters stand neben dem Uhr-Icon nichts. Real erreichbar, weil
  `src/lib/duffel/client.ts:100` bei einer echten Duffel-Antwort ohne
  `slice.duration` genau `duration: slice.duration ?? ''` liefert. Fix in
  `FlightCard.tsx` und `TrainCard.tsx` identisch: `if (!isoDuration) return
  '—'` als erste Zeile von `formatDuration()`, exakt das bereits etablierte
  Muster aus `formatTime()`. Je ein neuer Regressionstest in
  `FlightCard.test.tsx`/`TrainCard.test.tsx` (vor dem Fix per `git stash`
  auf nur diese beiden Quelldateien reproduzierbar rot verifiziert).
  Vom autonomen IT-Chef-Lauf am 29.09. (vierter Lauf) einen bereits am
  25.09. als schwächerer Kandidat zurückgestellten Fund in derselben
  Funktion behoben: `formatDuration()` fehlte die Erfassungsgruppe für
  Sekunden im Regex — bei einer reinen Sekundenangabe wie `"PT45S"` (kein
  Tage-/Stunden-/Minuten-Anteil) lieferte die Funktion `"—"`, obwohl eine
  echte, wenn auch sehr kurze Dauer vorlag; live verifiziert
  (`formatDuration('PT45S')` → `'—'` vor dem Fix). Fix in `FlightCard.tsx`
  und `TrainCard.tsx` identisch: Regex um eine optionale `(?:(\d+)S)?`-
  Gruppe erweitert; liegt die Dauer unter einer vollen Minute (kein
  Stunden-/Minuten-Anteil, aber Sekunden vorhanden), wird auf `"1min"`
  aufgerundet statt `"—"` zu zeigen — kein neues Anzeigeformat, nur
  Wiederverwendung des bereits etablierten `Xmin`-Musters. Je ein neuer
  Regressionstest in `FlightCard.test.tsx`/`TrainCard.test.tsx` (vor dem
  Fix per `git stash` auf nur diese beiden Quelldateien reproduzierbar rot
  verifiziert).
  Vom autonomen IT-Chef-Lauf am 25.09. (weiterer Lauf) den zweiten der
  beiden neuen Funde aus `reports/support-chef.md` (25.09.) behoben: bei
  einer Hin- und Rückflug-Suche zeigte `FlightCard.tsx` beide
  Flugabschnitte optisch identisch, nur durch die Reihenfolge und eine
  dünne Trennlinie unterschieden — kein Label, kein Datum, sodass man
  raten musste, welcher Abschnitt der Hin- und welcher der Rückflug ist
  und an welchem Tag welcher Flug stattfindet. Fix: Jeder Abschnitt zeigt
  jetzt sein Abflugdatum (neue `formatDate()`, analog zur bestehenden
  `formatTime()` daneben); bei mehr als einem Abschnitt (Hin- und
  Rückflug) zusätzlich ein Label "Hinflug"/"Rückflug" nach genau dem in
  `FlightWizard.tsx` bereits etablierten Wortlaut für dieselben beiden
  Richtungen — kein neuer Begriff erfunden. Der im selben Bericht
  gemeldete erste Fund (IATA-Code statt Klarname) bleibt bewusst offen:
  anders als hier gibt es dafür keine bereits etablierte Formatvorgabe im
  Code und ein bestehender Test verankert aktuell explizit die
  Code-Anzeige — das wäre eine eigene Formatentscheidung, kein reiner
  Bugfix (Kriterium 3), zur Entscheidung an Ni. Zwei neue
  Regressionstests in `FlightCard.test.tsx` (Datum ohne Label bei
  einfacher Flugsuche; beide Labels plus je eigenes Datum bei Hin- und
  Rückflug).
- [x] 5.5 `TrainResults.tsx` — Listenansicht steht (analog zu
  `HotelResults.tsx`), noch nicht in KI-Chat eingebunden (5.7 offen)
- [x] 5.11 Flugauswahl korrekt ins Trip-Transport-Objekt integrieren —
  `FlightCard.tsx` hat jetzt einen "Auswählen"-Button (analog zu
  `HotelCard.tsx`), Auswahl auf der eigenständigen `/flugsuche`-Seite
  schreibt `transportMode: 'flight'` in den bestehenden Trip via neuer
  `updateStoredTrip()`-Funktion in `tripStorage.ts`; kein neues Datenfeld
  für Flugdetails (Route/Preis) eingeführt, das wäre über die
  Aufgabenbeschreibung hinausgegangen. Am 24.08. vom autonomen
  IT-Chef-Lauf ergänzt: In `FlightWizard.tsx` blieb der "Flüge
  suchen"-Button unter 3 Zeichen in Von/Nach ohne jede Erklärung
  deaktiviert (vom IT-Chef-Bericht 23.08. gemeldet) — jetzt mit
  Hinweistext "3-stelliger Flughafencode, z. B. BER/LIS" unter beiden
  Feldern. Vom autonomen IT-Chef-Lauf am 01.09. (sechzehnter Lauf) einen
  weiteren Fund ergänzt: `Hotelsuche.tsx` setzte `offers` vor einer neuen
  Suche anders als das strukturell identische `Flugsuche.tsx` nicht auf
  `null` zurück — eine zweite Suche zeigte dadurch bis zum Antworteintreffen
  weiterhin die alten Hotelkarten der ersten Suche an (bei einer echten
  Null-Treffer-zweiten-Suche blieben sogar dauerhaft veraltete Karten
  stehen). Jetzt setzt `handleSearch` `offers` genau wie in `Flugsuche.tsx`
  zu Beginn auf `null`. Neuer Regressionstest in `Hotelsuche.test.tsx`
  (bisher gab es dort noch keine Tests). Vom autonomen IT-Chef-Lauf am 01.09.
  (siebzehnter Lauf) einen weiteren Paritäts-Fund zwischen den beiden
  strukturell identischen Seiten behoben: Anders als `FlightCard` (über
  `Flugsuche.tsx`) bekam `HotelCard` nie mit, ob ihr Angebot gerade
  ausgewählt ist — `Hotelsuche.tsx` berechnete `selectedOfferId` zwar
  genauso wie `Flugsuche.tsx`, reichte es aber nie als Prop durch.
  Ergebnis: nach einer Hotelauswahl blieb jede Karte (auch die gewählte)
  mit aktivem "Auswählen"-Button stehen, ein erneuter Klick schrieb das
  Trip-Feld wiederholt neu. `HotelCard` hat jetzt genau wie `FlightCard`
  eine `selected`-Prop, die den Button deaktiviert und auf "Ausgewählt"
  samt Häkchen-Icon umschaltet; `Hotelsuche.tsx` reicht `selected={offer.id
  === selectedOfferId}` durch. Neuer Regressionstest in
  `Hotelsuche.test.tsx`. Vom autonomen IT-Chef-Lauf am 01.09. (neunzehnter
  Lauf) einen weiteren, strukturell verwandten Fund im Hauptchat-Ablauf
  (`useChat.ts`) behoben: `sendMessage` setzte beim Start jeder neuen
  Chat-Nachricht zwar `stayError` und (außerhalb der IATA-Code-Abfrage)
  `flightOffers` zurück, aber nie `flightErrors` — anders als beim
  bereits bestehenden `stayError`-Muster eine Zeile darüber. Nach einer
  fehlgeschlagenen Flugsuche blieb die rote Fehlerbox in
  `FlightResults`/`KiChat.tsx` (Bedingung `flightErrors.length > 0`)
  dauerhaft sichtbar, sobald die Nutzerin statt auf "Neue Reise planen"
  zu klicken einfach normal weiterschrieb — einziger Ausweg war bisher
  ein kompletter Chat-Neustart über `resetChat`. `sendMessage` löscht
  `flightErrors` jetzt zusammen mit `flightOffers` (gleiche
  `awaitingFlightOrigin`-Schutzbedingung, damit während der laufenden
  IATA-Code-Abfrage nichts vorzeitig verschwindet). Neuer Regressionstest
  in `useChat.test.ts`. Vom autonomen IT-Chef-Lauf am 02.09.
  (zweiundzwanzigster Lauf) einen eigenständig gefundenen Bug in
  `findKnownDestination()` (`src/types/stays.ts`) behoben: Der Abgleich
  des freien Zieltexts gegen die kuratierte Zielliste nutzte rohes
  `String.includes` ohne Wortgrenzen — bei kurzen/generischen Namen wie
  "Rom" oder "Paris" matchte das auch mitten in unbeteiligten Wörtern
  ("romantisch", "Romania", "comparison"). Da `trip.destination` direkt
  aus der ungeprüften Freitextantwort auf die erste Chat-Frage stammt und
  `findKnownDestination` daraus in `useChat.ts` (automatische Hotel-/
  Flugsuche) sowie `Kartenansicht.tsx` (Kartenpin) echte Koordinaten/
  IATA-Codes ableitet, konnte ein Satz wie "etwas Romantisches am Meer"
  still echte, aber falsche Hotel-/Flugergebnisse für Rom auslösen bzw.
  den Kartenpin falsch setzen — ohne dass die Nutzerin das gewählt hat
  oder es kenntlich gemacht wird. Fix: Abgleich jetzt mit Wortgrenzen-
  Regex (`\b...\b`, Name escaped) statt rohem Teilstring-Vergleich, exakte
  Ziel-Sätze wie "Ich möchte nach Lissabon" matchen weiterhin. Neue
  `src/types/stays.test.ts` (bisher gab es dort keine Tests) mit
  Regressionstests für Wortgrenzen-Fälle, vor dem Fix reproduzierbar rot
  verifiziert.
  Vom autonomen IT-Chef-Lauf am 05.09. (siebenunddreißigster Lauf) einen
  von `reports/support-chef.md` (04.09., Vorschlag 2) gemeldeten Fund
  behoben: `FlightWizard.tsx`s `isValid` prüfte Von-/Nach-Feld nur auf
  Länge und Buchstaben, nie ob beide identisch sind — ein versehentlich
  zweimal derselbe Flughafencode (z. B. "BER"/"BER") ließ den Button
  aktiv, ohne jeden Hinweis, warum die Suche danach leer/verwirrend
  aussehen würde. Neue lokale `sameAirport`-Prüfung
  (`origin.trim().toUpperCase() === destination.trim().toUpperCase()`)
  fließt jetzt zusätzlich in `isValid` ein; bei Verstoß erscheint unter
  dem "Nach"-Feld derselbe Hinweistext, den der Bericht bereits konkret
  vorschlug ("Start und Ziel dürfen nicht gleich sein"), im bestehenden
  `text-destructive`-Muster (siehe `FlightResults.tsx`/`HotelResults.tsx`).
  Anders als beim 36. Lauf (identischer Fund, damals als "braucht noch
  eine UI-Entscheidung" zurückgestellt) macht der Bericht selbst bereits
  Feld, Prüfung und exakten Hinweistext konkret — keine eigene Annahme
  darüber hinaus nötig. Neuer Regressionstest in `FlightWizard.test.tsx`.
  Vom autonomen IT-Chef-Lauf am 05.09. (weiterer Lauf) einen bereits über
  einen offenen, aber noch nicht gemergten Auto-Fix-PR (#17,
  `it-chef-autofix/currency-format-crash-2026-09-04`) vollständig
  diagnostizierten Bug direkt auf `it-chef/auto` behoben:
  `formatOfferPrice()` (`src/lib/format.ts`) übergab `currency` ungeprüft
  an `Intl.NumberFormat`, das bei einem fehlenden/ungültigen
  ISO-4217-Code (z. B. leerer String aus einer Duffel-Antwort) eine
  `RangeError` wirft und damit `FlightCard.tsx`/`HotelCard.tsx` beim
  Rendern abstürzen lässt. Fix: Aufruf jetzt in `try`/`catch`, Fallback auf
  `${amount} ${currency}` — exakt dasselbe Muster wie der bestehende
  Fallback für nicht-numerische Beträge eine Zeile darüber. Zwei neue
  Regressionstests in `format.test.ts` (leerer bzw. ungültiger
  Währungscode).
  Vom autonomen IT-Chef-Lauf am 06.09. einen eigenständig gefundenen
  Paritäts-Bug in `selectFlight()` (`src/hooks/useChat.ts`) behoben: Die
  Bestätigungsnachricht nach einer Flugauswahl im KI-Chat interpolierte
  `offer.totalAmount`/`offer.totalCurrency` roh in den Chattext (z. B.
  "für 249.00 EUR"), obwohl dieselben Angebotsfelder eine Karte vorher in
  `FlightCard.tsx`/`HotelCard.tsx` bereits über `formatOfferPrice()`
  korrekt im deutschen Format angezeigt hatten ("249,00 €") — derselbe
  Rohformat-Bug, der dort bereits am 04.09. (zweiunddreißigster Lauf)
  behoben wurde, hier aber unabhängig davon in der Chat-Bestätigung
  stehen blieb. Fix: `selectFlight()` nutzt jetzt ebenfalls
  `formatOfferPrice()` statt der rohen Feld-Interpolation. Neuer
  Regressionstest in `useChat.test.ts` (Bestätigungstext enthält das
  formatierte "249,00 €", nicht mehr das rohe "249.00 EUR").
  Vom autonomen IT-Chef-Lauf am 06.09. (weiterer Lauf) einen bereits über
  einen offenen, aber noch nicht gemergten Auto-Fix-PR (#16,
  `it-chef-autofix/sprachausgabe-stoppt-nicht-2026-09-03`) diagnostizierten
  Bug frisch gegen den aktuellen Stand umgesetzt (der PR-Branch selbst war
  seit dem 03.09. zu stark divergiert, um ihn direkt zu übernehmen — er
  hätte mehrere seither gelandete Fixes wieder rückgängig gemacht, u. a.
  `formatOfferPrice()` und die `min`-Datumsgrenzen): `stopSpeaking()`
  (`src/lib/ai/speech.ts`) existierte bereits, wurde aber im gesamten Code
  nirgends aufgerufen. Eine per Sprachausgabe vorgelesene Bot-Nachricht
  lief dadurch immer vollständig zu Ende — weder das Abschalten des
  Lautsprecher-Buttons in `KiChat.tsx`, noch "Neu starten", noch das
  Verlassen der Chat-Seite stoppten eine laufende Ansage. Fix:
  `KiChat.tsx` ruft `stopSpeaking()` jetzt an den drei Stellen auf, an
  denen eine laufende Vorlesung sonst weiterläuft, obwohl sie es nicht
  mehr sollte — beim Ausschalten der Sprachausgabe (neue
  `toggleSpeech()`), bei "Neu starten"/dem "Neue Reise
  planen"-Quick-Reply (neue `handleReset()`) und beim Verlassen der Seite
  (`useEffect`-Cleanup beim Unmount). Drei neue Regressionstests in
  `KiChat.test.tsx` (bisher gab es dort nur die beiden
  `storageWarning`-Tests), die `@/lib/ai/speech` mocken und prüfen, dass
  `stopSpeaking()` in allen drei Fällen aufgerufen wird. Der ursprüngliche
  Auto-Fix-PR #16 bleibt als überholt zurück (kann bei nächster
  PR-Hygiene-Aufräumung geschlossen werden, wie in `reports/it-chef.md`
  bereits für andere Altbranches vorgeschlagen).

### Sprint 2 — Buchungsseite vervollständigen (KW35-36, 25. Aug - 7. Sep)
- [ ] 6.2 `TripItem.tsx` mit "Beim Anbieter buchen"-Button — weiterhin offen,
  da `TripDraft` noch keine Item-/Provider-URL-Felder hat (gleiche Lücke
  wie die fehlenden Kostenfelder bei 6.6/6.7/6.12)
- [ ] 6.6 `CostBreakdown.tsx` — echte Kostenübersicht nach Kategorie
- [ ] 6.7 `calculateCosts.ts` — Neuberechnung bei Änderungen
- [x] 6.8/6.9 `ChecklistPanel.tsx` + `checklistRules.ts` — vom autonomen
  IT-Chef-Lauf am 24.08. gebaut: 13-Punkte-Checkliste in `Buchung.tsx`
  eingebunden, unterteilt in fünf automatisch aus den Trip-Feldern
  erkannte Punkte (Transport/Reisedaten/Unterkunft/Aktivitäten/Budget —
  gleiche Felder wie `calculateProgress.ts`) und acht Standard-
  Reisevorbereitungspunkte (Reisepass, Visum, Versicherung usw.), die der
  Reisende manuell abhakt. Bewusst ein einziger "Transport"-Punkt statt
  getrennter Hin-/Rückflug-Punkte, da `TripDraft` nur ein
  `transportMode`-Feld statt separater Hin-/Rückreise-Daten hat. Manuelles
  Abhaken ist reiner lokaler Demo-State ohne Persistenz über Reloads
  hinweg, gleiches Muster wie `Profil.tsx`/`Einstellungen.tsx`, bis die
  echte Nutzerkonten-/Backend-Entscheidung gefallen ist.
- [x] 6.10 Checklistenpunkte mit KI-Chat verknüpfen — vom autonomen
  IT-Chef-Lauf am 26.08. (fünfter Lauf) ergänzt: die fünf automatisch
  erkannten Zeilen in `ChecklistPanel.tsx` sind jetzt Links zu
  `/ki-chat?edit=<feld>`, exakt das Muster, das die Section-Karten in
  `Buchung.tsx` schon für Transport/Reisedaten/Budget/Unterkunft nutzen.
  `activities` hat kein eigenes `?edit=`-Feld in `useChat.ts`, verlinkt
  daher auf einen neuen Chat statt eines Edit-Parameters. Die acht
  manuellen Vorbereitungspunkte bleiben unverändert reine Ankreuz-Buttons.
  Vom autonomen IT-Chef-Lauf am 27.08. (vierter Lauf) nachgebessert: Support-
  Chef meldete am 27.08., dass die klickbaren Links und die nur-abhakbaren
  Zeilen optisch identisch aussehen, obwohl sie sehr Unterschiedliches tun
  (Link verlässt die Seite sofort). `ChecklistPanel.tsx` zeigt den
  automatischen Zeilen jetzt zusätzlich dasselbe `Pencil`-Icon, das
  `Buchung.tsx` für "Bearbeiten"-Links nutzt, plus einen `sr-only`-Zusatz
  ", bearbeiten" im Linktext für Screenreader — genau der in
  `reports/support-chef.md` vorgeschlagene kurzfristige Fix.
- [x] 6.1/6.3 `TripSection.tsx`/`EmptySection.tsx` — vom autonomen IT-Chef-Lauf
  am 18.08. (dritter Lauf) als stale Checkboxen erkannt: beides ist bereits
  als die inline `Section`-Komponente in `Buchung.tsx` vorhanden (Titel/Icon/
  Wert/Bearbeiten-Aktion plus "+ Suchen"-Button im Leerzustand, verlinkt auf
  `/ki-chat`), gleiches Divergenz-Muster wie `PlaceholderPage.tsx` bei 3.5.
  Keine Code-Änderung, nur die Checkboxen plus eine neue Test-Assertion in
  `Buchung.test.tsx`, die bisher ungeprüfte "+ Suchen"-Links für alle fünf
  leeren Sektionen abdeckt.
- [x] 6.4 `Buchung.tsx` komplett zusammengesetzt (alle Sektionen klickbar) —
  vom autonomen IT-Chef-Lauf am 18.08. (zweiter Lauf) als stale Checkbox
  erkannt: Transport/Reisedaten/Budget/Unterkunft/Aktivitäten sind bereits
  alle als eigene, bearbeitbare Sektionen vorhanden. Keine Code-Änderung,
  nur die Checkbox plus vier neue Test-Assertions in `Buchung.test.tsx`.
- [x] 6.5 Klick-zum-Bearbeiten (KI-Chat mit vorgeladenem Kontext) — ebenfalls
  vom autonomen IT-Chef-Lauf am 18.08. (zweiter Lauf) als stale Checkbox
  erkannt und verifiziert: die "Bearbeiten"-Stifte verlinken auf
  `/ki-chat?edit=<feld>`, und `KiChat.tsx`/`useChat.ts` lesen diesen
  Query-Parameter tatsächlich aus und laden den passenden Prompt vor
  (`editPrompts`). Keine Code-Änderung, nur die Checkbox plus Tests.
- [x] 6.11 "Mit Travix weiterplanen"-Button — vom autonomen IT-Chef-Lauf am
  18.08. als stale Checkbox erkannt: Button existiert bereits in
  `Buchung.tsx`s `PageHeader`-Actions (Link zu `/ki-chat`), gleiche Art
  Lücke wie bei 7.5 `MeineReisen.tsx`. Keine Code-Änderung, nur die
  Checkbox plus eine fehlende Test-Assertion in `Buchung.test.tsx` ergänzt.
- [x] 6.13 `BuchungsSeite` (`/buchung`) — ebenfalls stale Checkbox: die Seite
  (`src/pages/Buchung.tsx`) war bereits vollständig gebaut, in
  `routes.tsx` verdrahtet und lädt echte Trip-Daten über
  `loadStoredChat()`. Gleiche Korrektur wie bei 6.11 oben.
- [x] 6.12 `EditMode.tsx` — vom autonomen IT-Chef-Lauf am 17.08. umgesetzt:
  Dialog zum manuellen Hinzufügen/Entfernen von Aktivitäten und
  Preisanpassung, direkt in die "Aktivitäten"-Sektion von `Buchung.tsx`
  eingebaut. Bewusst ohne Kostenübersicht nach Kategorie (das bleiben 6.6/
  6.7) — nur der `activities`-Teil, für den `TripDraft` bereits ein
  Preisfeld hat. Änderungen werden über die bestehende
  `updateStoredTrip()`-Funktion echt gespeichert (kein Demo-State wie bei
  7.3), da für den einen aktiven Chat-Trip bereits echte Speicherung
  existiert. Vom autonomen IT-Chef-Lauf am 29.08. (achter Lauf)
  nachgebessert: Name-/Preisfeld im "Neue Aktivität"-Formular hatten
  keinen Enter-Handler und mussten per Maus über den kleinen
  Icon-Button bestätigt werden — inkonsistent zu `ChatInput.tsx`s
  etabliertem Muster (Enter löst Senden aus). Beide Felder lösen jetzt
  beim Drücken von Enter `addActivity()` aus, mit derselben
  Leer-Namen-Schutzbedingung wie der bestehende Button. Drei neue
  Tests in `EditMode.test.tsx`.
  Vom autonomen IT-Chef-Lauf am 20.09. (weiterer Lauf) einen
  eigenständig gefundenen Barrierefreiheits-Fund behoben (per
  Explore-Agent gezielt gesucht, gegen den Code verifiziert): Preis-Input
  und Entfernen-Button jeder Aktivität bildeten ihr `aria-label` nur aus
  `activity.name` — `addActivity()` prüft nicht auf Eindeutigkeit, zwei
  gleichnamige Aktivitäten (z. B. zweimal "Spaziergang") waren für
  Screenreader-Nutzer:innen nicht mehr auseinanderzuhalten. Derselbe
  Fund/dieselbe Fix-Idee wie bei den Reiseentwürfen (17.09.). Fix: analog
  `Reiseentwuerfe.tsx` bei Namensduplikaten "(Eintrag N)" an beide Labels
  angehängt, eindeutige Namen bleiben unverändert. Vor dem Fix
  reproduzierbar rot verifiziert (`git stash` nur der Quelländerung, neuer
  Test schlug fehl). Neuer Regressionstest in `EditMode.test.tsx` (zwei
  gleichnamige plus eine eindeutig benannte Aktivität, alle vier Labels
  unterscheidbar).
  Vom autonomen IT-Chef-Lauf am 02.10. (weiterer Lauf) einen von einem
  vorherigen Lauf desselben Tages per Explore-Agent gefundenen, aber
  zurückgestellten Kandidaten behoben: Der Haupt-Dialog hatte anders als
  der Lösch-Bestätigungsdialog kein `onOpenChange` — Text im "Neue
  Aktivität"-Namens-/Preisfeld blieb nach dem Schließen ohne Hinzufügen
  (z. B. über "Fertig", Escape oder Klick auf das Overlay) stehen und war
  beim nächsten Öffnen des Dialogs immer noch da, ein unfertiger Entwurf
  wirkt dann wie eine bereits hinzugefügte Aktivität. Fix: `onOpenChange`
  auf dem Haupt-Dialog setzt `name`/`price` zurück, sobald er schließt;
  keine Verhaltensänderung beim Öffnen oder beim echten Hinzufügen. Vor
  dem Fix reproduzierbar rot verifiziert (`git stash` nur der
  Quelländerung, neuer Test schlug fehl: Feld zeigte weiterhin
  "Stadtführung" statt leer). Neuer Regressionstest in
  `EditMode.test.tsx`.
- [ ] 2.x Auth & Nutzerkonten (abhängig von Backend-Entscheidung)

### Sprint 3 — Trip-Lifecycle-Seiten (KW37-39, 8.-28. Sep)
- [x] 7.1 `calculateProgress.ts` — vorgezogen vom autonomen IT-Chef-Lauf am
  10.08., da Sprint 1 an blockierten/Produktentscheidungs-Punkten hing;
  reine Berechnungsfunktion, noch nicht in eine Seite eingebunden
- [x] 7.2 `Reiseentwuerfe.tsx` (`/entwuerfe`) — Entwurfskarten mit
  Demo-Daten (analog `MeineReisen.tsx`), echtem Fortschrittsbalken über
  `calculateProgress` (7.1); 7.4 (echte Wiederaufnahme mit Chat-Historie)
  bleibt eigener offener Punkt, "Planung fortsetzen" verlinkt vorerst nur
  auf `/ki-chat`
- [x] 7.10 `Preisalarme.tsx` (`/preisalarme`) — Kartenliste mit
  Demo-Preisalarmen (analog `Favoriten.tsx`), Zielpreis-Badge und
  sachlicher Preisänderungs-Hinweis statt künstlicher Dringlichkeit,
  ermutigender Leer-Zustand nach `MARKENDESIGN.md`
- [x] 7.3 Entwurfs-Aktionen: pausieren, duplizieren, abschließen, löschen —
  vom autonomen IT-Chef-Lauf am 16.08. direkt in `Reiseentwuerfe.tsx`
  ergänzt (lokaler Demo-State, gleiches Muster wie der Entfernen-Button
  bei Favoriten/Preisalarme/Angebote). "Abschließen" setzt nur einen
  lokalen Status ("Abgeschlossen"), verschiebt den Entwurf nicht nach
  `MeineReisen.tsx` — dafür fehlt noch echte, geteilte Trip-Speicherung
  (hängt an der offenen Backend-Entscheidung).
  Vom autonomen IT-Chef-Lauf am 23.09. (fünfter Lauf desselben Tages) einen
  von `reports/support-chef.md` (23.09., Vorschlag 3) gemeldeten Fund
  behoben: Das Status-Badge für "Abgeschlossen" nutzte dieselbe graue
  `secondary`-Variante wie "Pausiert" — auf der Kartenübersicht war nicht
  auf den ersten Blick erkennbar, welche Entwürfe schon fertig und welche
  nur pausiert sind. Fix: "Abgeschlossen" bekommt jetzt einen eigenen,
  ruhigen Teal-Akzent (`outline`-Variante mit `border-teal/30 bg-teal/5
  text-teal`) statt der grauen `secondary`-Variante — derselbe gedämpfte
  Teal-Stil, der bereits bei `TripSummaryCard.tsx`/`QuickReplies.tsx` für
  ruhige (nicht knallige) Teal-Akzente verwendet wird, statt des kräftigen
  `bg-teal text-navy`-Musters, das für aktive Aktionen reserviert bleibt
  (Buttons, "Empfohlen"/"Ziel erreicht"-Badges). "Pausiert" bleibt
  unverändert bei `secondary`. Neuer Regressionstest in
  `Reiseentwuerfe.test.tsx` (Badge-Klassen von "Abgeschlossen" und
  "Pausiert" unterscheiden sich, "Abgeschlossen" trägt `text-teal`).
  Vom autonomen IT-Chef-Lauf am 24.09. einen von `reports/support-chef.md`
  (24.09., Vorschlag 1) gemeldeten Kontrast-Fund an genau diesem Fix
  behoben: `text-teal` auf `bg-teal/5` ergibt im hellen Farbschema nur rund
  2,3:1 Kontrast — unter dem WCAG-AA-Mindestwert von 4,5:1 für normalen
  Text (im dunklen Schema mit rund 7:1 unproblematisch). Fix: Badge nutzt
  jetzt `border-teal bg-teal/10 text-navy` statt `border-teal/30 bg-teal/5
  text-teal` — dasselbe etablierte Muster wie in `Einstellungen.tsx`,
  `Profil.tsx` und `QuickReplies.tsx` (Teal nur als Rahmen/Hintergrund,
  Navy für den eigentlichen Text). Denselben, vom Support-Chef als "schon
  länger bestehend" gemeldeten Fehlton in `TripSummaryCard.tsx` (Zeilen 41
  und 50, Karten-Label und "Speichern & ansehen"-Button) gleich mit auf
  `text-navy` umgestellt, da identischer Fehler und identischer Fix.
  Regressionstest in `Reiseentwuerfe.test.tsx` entsprechend angepasst
  (prüft jetzt `text-navy` statt `text-teal`).
  Vom autonomen IT-Chef-Lauf am 01.10. einen über einen Explore-Agenten
  gefundenen, eigenständigen Bug behoben: Die Lösch-/Abschließen-
  Bestätigungsdialoge in `Reiseentwuerfe.tsx` zeigten bisher immer den
  rohen `destination`-Namen ("Der Entwurf für Lissabon wird gelöscht."),
  obwohl die aria-labels derselben Buttons seit dem 17.09./20.09.-Fix bei
  duplizierten Entwürfen bereits disambiguiert sind ("Lissabon (Eintrag
  2) löschen"). Nach einem Klick auf "Duplizieren" zeigten beide
  resultierenden Lissabon-Karten im sichtbaren Dialogtext exakt denselben
  Satz — für alle Nutzer:innen (nicht nur Screenreader) nicht mehr
  erkennbar, welcher der beiden Entwürfe tatsächlich betroffen ist (die
  zugrunde liegende Aktion selbst arbeitete weiterhin korrekt über die
  jeweilige `id`). Fix: Die bereits bestehende Disambiguierungslogik
  (`hasDuplicates`/`occurrence`) in eine wiederverwendbare
  `getDraftLabel()`-Hilfsfunktion ausgelagert, von der Kartenliste UND
  beiden Dialogtexten genutzt — mechanische Wiederverwendung des bereits
  etablierten Musters, keine neue Design-Entscheidung. Zwei neue
  Regressionstests in `Reiseentwuerfe.test.tsx` (Lösch- bzw.
  Abschließen-Dialogtext zeigt "Lissabon (Eintrag N)" statt des
  mehrdeutigen "Lissabon") — vor dem Fix durch temporäres Zurücknehmen
  der Quelländerung (`git stash` nur `Reiseentwuerfe.tsx`) reproduzierbar
  rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 01.10. (zweiter Lauf) einen weiteren,
  über zwei Explore-Agenten gefundenen, eigenständigen Bug behoben:
  `ChatInput.tsx` stoppte eine laufende Spracherkennung nicht beim
  Unmount der Komponente (z. B. Navigation weg von `/ki-chat` während
  die Aufnahme läuft) — es gab kein `useEffect`-Cleanup analog zum
  bereits etablierten Muster für Sprachausgabe in `KiChat.tsx:77`
  (`useEffect(() => stopSpeaking, [])`). Fix: spiegelbildliches
  `useEffect(() => () => recognitionRef.current?.stop(), [])` ergänzt,
  keine Verhaltensänderung für den bestehenden Start/Stop-per-Klick-
  Ablauf. Neuer Regressionstest in `ChatInput.test.tsx` — vor dem Fix
  durch temporäres Zurücknehmen der Quelländerung reproduzierbar rot
  verifiziert.
- [ ] 7.4 "Planung fortsetzen" — KI-Chat mit voller Historie am
  Unterbrechungspunkt fortsetzen. Weiterhin offen — echte Wiederaufnahme
  je Entwurf bräuchte mehrere gleichzeitig gespeicherte Chat-Historien,
  `tripStorage.ts` verwaltet aber nur einen aktiven Trip; das ist eine
  eigene Datenmodell-Entscheidung, kein autonom fällbarer Punkt. Vom
  autonomen IT-Chef-Lauf am 11.09. der kurzfristige Teil aus
  `reports/support-chef.md` (10.09., Vorschlag 3) umgesetzt: Der Button
  "Planung fortsetzen" verlinkte bei jedem Entwurf identisch auf
  `/ki-chat`, ohne dass ersichtlich war, dass das immer denselben einen
  Chat öffnet statt der Details des jeweiligen Entwurfs — bei zwei
  Entwürfen (z. B. Lissabon und Kyoto) landete ein Klick bei Kyoto
  trotzdem im global gespeicherten Chat. Statt der eigentlichen Umsetzung
  (eigene Architektur-Entscheidung, s.o.) jetzt ein ehrlicher Hinweis in
  `Reiseentwuerfe.tsx`, sichtbar nur wenn mehr als ein Entwurf existiert,
  im selben Karten-Stil wie der bereits bestehende Prämienprogramm-Hinweis
  in `Dashboard.tsx` (gestrichelte Card, `Info`-Icon, gedämpfter Text).
  Zwei neue Regressionstests in `Reiseentwuerfe.test.tsx` (Hinweis
  erscheint bei mehreren Entwürfen, verschwindet, sobald nur noch einer
  übrig ist).
  Vom autonomen IT-Chef-Lauf am 17.09. (weiterer Lauf) einen eigenständig
  gefundenen Reibungspunkt behoben (per Explore-Agent gezielt gesucht,
  gegen den Code verifiziert): Der Löschen-Button in `Reiseentwuerfe.tsx`
  entfernte einen Entwurf bisher sofort und endgültig, ohne Rückfrage —
  anders als dasselbe Löschen auf `Preisalarme.tsx`/`Favoriten.tsx`/
  `Angebote.tsx`/`Aktivitaeten.tsx`/`Warenkorb.tsx`, die alle bereits über
  das etablierte Bestätigungsdialog-Muster abgesichert sind. Fix: exakt
  dasselbe Muster übernommen — `pendingRemoval`-State plus `Dialog`
  ("Entwurf löschen?"/"Ja, entfernen"/"Abbrechen"), kein neuer Entwurf.
  Bestehender Löschen-Test in `Reiseentwuerfe.test.tsx` auf den
  zusätzlichen Bestätigungsklick umgestellt, neuer Test ergänzt (Klick auf
  "löschen" öffnet die Bestätigung; "Abbrechen" lässt den Entwurf
  unverändert).
  Vom autonomen IT-Chef-Lauf am 17.09. (vierter Lauf desselben Tages) einen
  von `reports/support-chef.md` (17.09., Vorschlag 1) gemeldeten Fund
  behoben: Nach "Duplizieren" (`duplicateDraft()`) trugen Original und
  Kopie exakt dasselbe `aria-label` (bisher nur aus `draft.destination`
  gebildet, z. B. zweimal "Lissabon löschen") — für Screenreader-Nutzer:innen
  waren die beiden Karten an dieser Stelle nicht mehr auseinanderzuhalten.
  Fix: alle vier Aktions-Buttons (Pausieren/Fortsetzen, Abschließen,
  Duplizieren, Löschen) hängen jetzt bei mehreren gleichnamigen Entwürfen
  zusätzlich "(Eintrag N)" an (N = Position unter den gleichnamigen
  Einträgen), rein additiv — ohne Duplikate bleibt das Label unverändert.
  Neuer Regressionstest in `Reiseentwuerfe.test.tsx` (nach Duplizieren
  tragen beide Lissabon-Karten unterscheidbare Labels, ein nicht
  duplizierter Entwurf bleibt unverändert).
  Vom autonomen IT-Chef-Lauf am 20.09. einen von `reports/support-chef.md`
  (18.09., Vorschlag 3) gemeldeten Fund behoben: "Abschließen" setzte den
  Status einer Karte bisher sofort und endgültig, ohne Rückfrage — anders
  als "Löschen" auf derselben Karte, das seit dem 17.09.-Fix bereits über
  denselben Bestätigungsdialog abgesichert ist; die beiden Buttons stehen
  direkt nebeneinander und unterscheiden sich nur durchs Icon, ein
  Fehlklick war damit leicht möglich und nicht rückgängig zu machen. Fix:
  exakt dasselbe Muster übernommen — ein zweiter, per
  `pendingFinalize`-State gesteuerter Dialog ("Entwurf abschließen?"/
  "Ja, abschließen"/"Abbrechen"), kein neuer Entwurf. Zwei bestehende
  Tests in `Reiseentwuerfe.test.tsx` auf den zusätzlichen
  Bestätigungsklick umgestellt, ein neuer Test ergänzt (Klick auf
  "abschließen" öffnet die Bestätigung ohne sofortige Statusänderung;
  "Abbrechen" lässt den Entwurf unverändert "In Bearbeitung").
  Vom autonomen IT-Chef-Lauf am 22.09. einen von `reports/support-chef.md`
  (21.09., Vorschlag 2) gemeldeten Fund behoben: Der teal hervorgehobene
  Button "Planung fortsetzen" wurde bisher für jede Karte gerendert,
  unabhängig vom `status` — auch für einen gerade erst über den
  Bestätigungsdialog ("das lässt sich nicht rückgängig machen")
  abgeschlossenen Entwurf, der optisch fast unverändert weiter aktiv zum
  Weiterplanen einlud. Von den beiden im Bericht vorgeschlagenen
  Varianten (ausblenden oder durch einen neutralen "Details
  ansehen"-Button ersetzen) die erste umgesetzt: ein neuer "Details
  ansehen"-Button hätte eine bisher nicht existierende Detailansicht
  vorausgesetzt, wäre also keine reine mechanische Korrektur, sondern
  eine neue Design-/Funktionsentscheidung gewesen. Fix: `Button` jetzt
  hinter dieselbe `draft.status !== 'finalized'`-Bedingung gestellt, die
  im selben Card-Markup bereits für die Pausieren-/Abschließen-Buttons
  etabliert ist (kein neues Muster). Neuer Regressionstest in
  `Reiseentwuerfe.test.tsx` (Button ist für beide Demo-Entwürfe
  vorhanden, verschwindet für den jeweiligen Entwurf nach dem
  Abschließen).
  Vom autonomen IT-Chef-Lauf am 22.09. (fünfter Lauf) einen Folgefund aus
  `reports/support-chef.md` (22.09., Vorschlag 1) behoben: Nach obigem
  Fix blieben auf einer abgeschlossenen Karte nur noch "Duplizieren" und
  "Löschen" übrig — keine Aktion, die den fertigen Entwurf überhaupt
  ansehen lässt, wirkt wie eine Sackgasse direkt nach dem bewussten "Ja,
  abschließen". Genau die zuvor (22.09., oben) verworfene zweite Option
  jetzt doch umgesetzt, aber diesmal ohne eine neue Detailansicht zu
  erfinden: die Zeilen-Darstellung (Icon+Label je Feld) existierte
  bereits identisch an zwei Stellen (`TripSummaryCard.tsx`, die
  `Section`-Karten in `Buchung.tsx`) — neuer "Details ansehen"-Button
  (nur bei `finalized`) öffnet einen reinen Lese-Dialog mit denselben
  Feldern/Icons/Labels (inkl. Aktivitäten-Zählung, Wortlaut identisch zu
  `Buchung.tsx`), ohne Bearbeiten-Aktionen. Damit doch eine reine
  mechanische Zusammensetzung bestehender Muster statt einer neuen
  Design-Entscheidung — die zuvor genannte Sorge (unpassende
  "Speichern & ansehen"-Verlinkung von `TripSummaryCard.tsx` nach
  `/buchung`, die bei diesen Demo-Entwürfen auf den falschen/aktuell
  aktiven Trip zeigen würde) umgangen, indem die Zeilen direkt in
  `Reiseentwuerfe.tsx` nachgebaut statt die Komponente importiert wurde.
  Die vom selben Support-Chef-Bericht zusätzlich genannte
  Badge-Unterscheidbarkeit ("Abgeschlossen" nutzt optisch dieselbe
  `secondary`-Variante wie "Pausiert") bewusst nicht mit angefasst — dafür
  gibt es in `MARKENDESIGN.md` keine Statusfarb-Vorgabe, eine Variante zu
  wählen wäre Raten. Zwei neue Regressionstests in
  `Reiseentwuerfe.test.tsx` (kein Button für `in_progress`/`paused`; nach
  Abschließen zeigt der Dialog Transport/Daten/Budget/den
  "keine Aktivitäten"-Hinweis korrekt und lässt sich über den
  Standard-Dialog-Close wieder schließen).
  Vom autonomen IT-Chef-Lauf am 23.09. (vierter Lauf) Vorschlag 1 aus
  `reports/support-chef.md` (23.09.) behoben: Der Details-Dialog blendete
  fehlende Angaben (kein Transportmittel/Datum/Budget/Unterkunft) über
  `.filter(Boolean)` komplett aus, statt sie wie die bereits richtig
  gemachte Aktivitäten-Zeile ("Noch keine Aktivitäten geplant") explizit
  als fehlend zu kennzeichnen — für eine Nutzerin, die einen
  unvollständigen Entwurf bewusst abschließt, wirkte das wie verlorene
  Angaben. Fix: alle vier Zeilen erscheinen jetzt immer; fehlt der Wert,
  zeigen sie denselben Wortlaut, der für dieselben Felder bereits in
  `Buchung.tsx` etabliert ist ("Noch kein Transport ausgewählt", "Noch
  keine Daten gewählt", "Noch kein Budget angegeben", "Noch keine
  Unterkunft ausgewählt") — keine neue Design-Entscheidung, reine
  Wiederverwendung. Neuer Regressionstest in `Reiseentwuerfe.test.tsx`
  (Kyoto-Demo-Entwurf, bei dem nur das Datum gesetzt ist, zeigt nach dem
  Abschließen alle drei fehlenden Angaben statt sie wegzulassen) — vor
  dem Fix durch temporäres Zurücknehmen der Quelländerung (`git stash`
  nur `Reiseentwuerfe.tsx`) reproduzierbar rot verifiziert.
  Vom autonomen IT-Chef-Lauf am 02.10. Vorschlag 2 aus
  `reports/support-chef.md` (01.10.) behoben: Der "Details ansehen"-Dialog
  zeigte als Titel weiterhin den rohen `detailsDraft?.destination`, obwohl
  der Lösch- und der Abschließen-Dialog seit dem 01.10.-Fix (siehe oben,
  `getDraftLabel()`) bei duplizierten Entwürfen bereits disambiguieren.
  Zwei duplizierte, beide abgeschlossene "Lissabon"-Entwürfe zeigten beim
  Öffnen von "Details ansehen" für beide denselben Titel "Lissabon",
  obwohl der zugehörige Button per Screenreader bereits korrekt
  "Lissabon (Eintrag 2) Details ansehen" ankündigt — der Dialog selbst
  machte den Unterschied danach wieder unsichtbar. Fix: dieselbe bereits
  etablierte `getDraftLabel(detailsDraft, drafts)`-Hilfsfunktion jetzt
  auch im `DialogTitle` des Details-Dialogs verwendet, analog den beiden
  anderen Dialogen — keine neue Design-Entscheidung, nur die dritte von
  drei Stellen nachgezogen. Neuer Regressionstest in
  `Reiseentwuerfe.test.tsx` (zwei duplizierte, abgeschlossene
  Lissabon-Entwürfe, Details-Dialog für "Eintrag 2" zeigt den
  disambiguierten Titel) — vor dem Fix durch temporäres Zurücknehmen der
  Quelländerung (`git stash` nur `Reiseentwuerfe.tsx`) reproduzierbar rot
  verifiziert.
- [x] 7.6 `Warenkorb.tsx` (`/warenkorb`) — vom autonomen IT-Chef-Lauf am
  17.08. gebaut: Positionen nach Typ gruppiert (Flüge, Unterkünfte,
  Transport, Aktivitäten, Versicherung — Typen laut FR-1002), pro Gruppe
  eine Zwischensumme, unten eine Gesamtsumme; beides über reine
  Hilfsfunktionen in `src/lib/trip/cartTotals.ts` berechnet (mit
  Unit-Tests), sodass Entfernen einer Position Zwischen- und Gesamtsumme
  sofort neu berechnet ("real-time totals" laut FR-1001). Demo-Positionen
  über die zwei Demo-Reisen aus `MeineReisen.tsx` (Lissabon, Kyoto) verteilt,
  gleiches Muster wie bei Angebote/Preisalarme/Aktivitäten. Sachliche
  Preisdarstellung ohne künstliche Dringlichkeit gemäß der
  `MARKENDESIGN.md`-Vorgabe für Warenkorb/Preisalarme. Kein
  Buchungs-/Bezahl-Button (das wäre 6.2 "Beim Anbieter buchen", eigener
  offener Punkt, und ohnehin außerhalb des Scopes laut PRD NG-01). Rein
  lokaler Demo-State, noch keine echte Warenkorb-Speicherung (Cart-Entity
  hängt an der offenen Backend-Entscheidung)
- [x] 7.7 `Dashboard.tsx` (`/dashboard`) — vom autonomen IT-Chef-Lauf am 27.08.
  gebaut: vier Kennzahl-Kacheln (Bevorstehende Reisen, Reiseentwürfe-
  Fortschritt, Warenkorb-Summe, Favoriten), jede mit Link zur vollen Seite,
  auf denselben Demo-Daten/Hilfsfunktionen wie `MeineReisen.tsx`/
  `Reiseentwuerfe.tsx`/`Warenkorb.tsx`/`Favoriten.tsx` statt eines neu
  erfundenen Datensatzes. Prämienpunkte bewusst nicht als Zahl gezeigt — die
  genauen Regeln dafür sind laut PRD (OQ-04) noch offen — stattdessen ein
  ehrlicher Hinweis, dass das noch aussteht, laut der "ehrlich statt
  beschönigend"-Vorgabe in `MARKENDESIGN.md`. Keine Budget-Warnfarbe, da
  `TripDraft` weiterhin keine echten Preisfelder zum Vergleich hat (gleiche
  Lücke wie 6.6/6.7/7.12). Vom autonomen IT-Chef-Lauf am 28.08. (fünfter
  Lauf) auf zwei Hinweise aus `reports/support-chef.md` hin nachgebessert:
  die vier "Alle ansehen"-Links haben jetzt unterscheidbare `aria-label`s
  statt identischen Linktexts, und die gemittelte Reiseentwürfe-Prozentzahl
  zeigt jetzt "Ø über {Anzahl} Entwürfe" statt unmarkiert als Einzelwert zu
  wirken. Vom autonomen IT-Chef-Lauf am 29.08. (sechster Lauf) einen
  dritten, von Support-Chef gemeldeten und von Freigabe-Chef im Code
  bestätigten Befund behoben: `/dashboard` stand in `nav-config.ts` nur
  in `extraRoutes`, das weder `Sidebar.tsx` noch `MobileNav.tsx`
  rendern — der zentrale Hub war damit nur per direkter URL erreichbar,
  nicht über die reguläre Navigation. Jetzt fester Eintrag in der
  Nav-Gruppe "Meine Reise" (erster Punkt, vor "Reiseplan"), analog den
  anderen Übersichtsseiten dort. Neue `src/lib/nav-config.test.ts` sichert
  das gegen Rückfall ab. Vom autonomen IT-Chef-Lauf am 29.08. (siebter
  Lauf) denselben Fund selbst noch einmal für weitere Seiten bestätigt:
  eine Prüfung, wohin im Code tatsächlich verlinkt wird (nicht nur der
  `nav-config.ts`-Kommentar), zeigte, dass `/kalender` (7.11), `/karte`
  (7.14), `/aktivitaeten` (7.13), `/angebote` (7.8), `/favoriten` (7.9,
  bisher nur über den einen Dashboard-Link erreichbar) und `/preisalarme`
  (7.10) genau dasselbe Problem hatten wie zuvor `/dashboard` — fertig
  gebaute Seiten, die in `extraRoutes` standen, obwohl sie (anders als
  `/urlaubsmodus` und `/reise-planen`, die echte kontextuelle
  Einstiegslinks in `MeineReisen.tsx`/`Home.tsx` haben) nirgends im Code
  verlinkt sind. Alle sechs jetzt ebenfalls in die Nav-Gruppe "Meine
  Reise" verschoben, `extraRoutes`-Kommentar entsprechend korrigiert
  (enthält jetzt nur noch echte Kontext-Links plus die drei noch nicht
  gebauten Seiten Deal Finder/Reisebudget/Premium). `nav-config.test.ts`
  um eine entsprechende Regressionsprüfung für alle sechs Pfade
  erweitert.
- [x] 7.8 `Angebote.tsx` (`/angebote`) — Kartenliste mit Demo-Angeboten
  (analog `Favoriten.tsx`/`Preisalarme.tsx`), Typ-Badge (Flug/Unterkunft),
  Ziel, kurze Zusammenfassung statt vollem erfundenem Angebotsdatensatz
  (SavedOffer.offer_data ist im PRD-Schema unstrukturiert), Preis,
  Entfernen-Button, ermutigender Leer-Zustand nach `MARKENDESIGN.md`
- [x] 7.9 `Favoriten.tsx` (`/favoriten`) — vom autonomen IT-Chef-Lauf am 11.08.
  gebaut: Karten-Grid mit Ziel/Land/Notiz, Herz-Button zum Entfernen (rein
  lokaler State, noch keine echte Speicherung), ermutigender Leerzustand
  laut `MARKENDESIGN.md`, sobald alle entfernt sind. Demo-Ziele (Kapstadt,
  Reykjavik) aus dem bestehenden Inspirations-Set von `Home.tsx`
  übernommen statt neu erfunden. Echte Persistenz folgt mit dem Favorite-
  Entity, sobald die Backend-Entscheidung gefallen ist
- [x] 7.11 `Kalender.tsx` (`/kalender`) — vom autonomen IT-Chef-Lauf am 17.08.
  gebaut: Monats-Kalenderraster (`calculateProgress.ts`-artige reine
  Hilfsfunktionen in `src/lib/trip/calendarUtils.ts`, mit Unit-Tests) plus
  Monatsnavigation, dieselben zwei Demo-Reisen wie `MeineReisen.tsx`
  (Lissabon, Kyoto) jetzt zusätzlich mit strukturiertem Datumsbereich statt
  nur Anzeige-Text, damit sie sich im Raster platzieren lassen. Zellen mit
  Reise farblich markiert, zusätzlich eine textliche Liste darunter (analog
  `Kartenansicht.tsx`), da Kalenderzellen allein für Screenreader nicht
  zugänglich sind. Keine neue Abhängigkeit (kein Kalender-Package),
  ermutigender Leer-Zustand laut `MARKENDESIGN.md` als Fallback vorhanden,
  auch wenn er mit den festen Demo-Daten aktuell nicht greift. Rein
  lokaler Demo-State, noch keine echte geteilte Reise-Speicherung.
  Vom autonomen IT-Chef-Lauf am 24.09. (weiterer Lauf) nachgeschärft: die
  Monatsnavigation (`goToPreviousMonth`/`goToNextMonth`) berechnete
  Jahr und Monat über zwei getrennte `setState`-Updater, von denen einer
  aus dem Render-Closure-Wert von `month` las statt aus dem tatsächlich
  vorherigen Wert — bei zwei synchronen Aufrufen im selben Tick (Doppel-
  klick vor dem Rerender) hätte das Jahr am Dezember/Januar-Übergang
  falsch berechnet werden können. Jetzt zwei neue, reine Hilfsfunktionen
  `getPreviousMonth`/`getNextMonth` in `calendarUtils.ts` (mit
  Jahresübergang-Unit-Tests), die Jahr und Monat atomar aus demselben
  Zustand berechnen; `Kalender.tsx` setzt beide States direkt aus dem
  Ergebnis statt über getrennte Updater-Funktionen
- [ ] 7.12 Reisebudget (Recharts) — weiterhin blockiert, `TripDraft` hat
  keine echten Preisfelder für Transport/Unterkunft (gleicher Grund wie
  bei 6.6/6.7, siehe oben)
- [x] 7.14 `Kartenansicht.tsx` (`/karte`) — React-Leaflet-Karte, seit
  11.08. mit dem echten im KI-Chat geplanten Reiseziel verbunden statt
  fester Demo-Orte: zeigt den Teal-Marker für das im Chat gespeicherte
  Ziel (über dieselbe kuratierte Koordinatenliste, die auch die echte
  Duffel-Suche nutzt), sonst einen ehrlichen Leer-/Hinweiszustand statt
  erfundener Orte. Zusätzlich eine textliche Liste darunter, da
  Kartenmarker allein für Screenreader nicht zugänglich sind. Kartenbasis
  dezent/hell (CartoDB Positron) statt der bunteren Standard-OSM-Kacheln,
  gemäß Design-Vorgabe in `MARKENDESIGN.md` ("dezente, nicht zu bunte
  Kartenbasis")
- [x] 7.13 `Aktivitaeten.tsx` (`/aktivitaeten`) — vom autonomen IT-Chef-Lauf
  am 17.08. gebaut: Kartenliste mit über die zwei Demo-Reisen aus
  `MeineReisen.tsx` (Lissabon, Kyoto) aggregierten Aktivitäten,
  Ziel-Badge pro Karte, optionalem Preis (analog `TripActivity.price`),
  funktionierendem Entfernen-Button (gleiches Muster wie bei
  Angebote/Favoriten/Preisalarme), ermutigender Leer-Zustand laut
  `MARKENDESIGN.md`. Rein lokaler Demo-State, noch keine echte
  geteilte Aktivitäten-Speicherung über Trips hinweg
- [x] 7.15 `ReiseSuche.tsx` (`/reise-planen`) — vom autonomen IT-Chef-Lauf am
  21.08. gebaut: drei Karten (KI-Chat, Flugsuche, Hotelsuche) als
  Einstiegspunkt für die Reiseplanung, KI-Chat hervorgehoben als
  empfohlener Weg. Schließt eine echte Lücke — `Home.tsx`s
  "Selbst durchsuchen"-Button verlinkte bereits dorthin, zeigte bisher
  aber nur die `PlaceholderPage`. Kein Zug/Bus/Fähre-Kärtchen, da 5.7
  (Einbindung von `TrainCard`/`TrainResults`) noch offen ist und dafür
  keine eigenständige Route existiert. Reine Navigation, keine
  erfundenen Daten. Am 24.08. vom autonomen IT-Chef-Lauf korrigiert: die
  "empfohlen"-Hervorhebung der KI-Chat-Karte (`border-teal/40`) hatte
  keine sichtbare Wirkung, weil `Card` intern `ring-1` statt eines
  `border`-Utilities nutzt (vom Support-Chef am 23.08. gemeldet) — durch
  ein sichtbares "Empfohlen"-Badge ersetzt, analog dem bestehenden
  Badge-Muster in `Preisalarme.tsx`/`Buchung.tsx`.
- Vom autonomen IT-Chef-Lauf am 02.10. (dritter Lauf) aufgeräumt (betrifft
  7.6, 7.7, 7.10): `Warenkorb.tsx`, `Preisalarme.tsx` und `Dashboard.tsx`
  definierten alle drei byte-identisch eine lokale `formatEuro()`-Funktion.
  Jetzt eine einzige exportierte `formatEuro()` in `src/lib/format.ts`
  (neben `formatOfferPrice()`), von allen drei Seiten importiert. Reine
  Wiederverwendung, keine Verhaltensänderung, drei neue Unit-Tests in
  `format.test.ts`. `formatPrice()` in `Aktivitaeten.tsx`/`Angebote.tsx`
  bewusst unverändert gelassen (andere Signatur/Logik, kein echtes Duplikat).

### Sprint 4 — Urlaubsmodus & Konto (KW40-42, 29. Sep - 19. Okt)
- [ ] 8.2 Foto-Upload + Vision-Analyse
- [ ] 8.3 Vollständig kontextbezogene Antworten (Tagesitinerar, nicht nur
  Zielort — aktuell nur einfache Concierge-Fakten)
- [ ] 8.4 Quick-Action-Buttons (Restaurant finden, Schild übersetzen, Route)
- [ ] 8.5, 8.6, 8.7 Deal Finder
- [x] 8.8 `Profil.tsx` (`/profil`) — vom autonomen IT-Chef-Lauf am 20.08.
  gebaut: Reisestile (Mehrfachauswahl als Toggle-Chips, analog
  `QuickReplies.tsx`), Budgetrahmen (Select mit vier groben Stufen statt
  konkreter €-Beträge, um keine Zahlungs-/Preisentscheidung vorwegzunehmen),
  Ernährungsweise (ebenfalls Toggle-Chips, Mehrfachauswahl) und
  Heimatflughafen (IATA-Eingabe, Großschreibung + 3 Zeichen, analog dem
  `origin`-Feld in `FlightWizard.tsx`). Rein lokaler Demo-State ohne
  Persistenz über Reloads hinweg, gleiches Muster wie
  Favoriten/Preisalarme/Angebote — echte Speicherung hängt an der offenen
  Backend-/Auth-Entscheidung. 8.10 Einstellungen und 8.11 Hilfe bleiben
  eigene offene Punkte (Hilfe zusätzlich blockiert auf die FAQ-Inhalte vom
  Support-Chef).
- [x] 8.10 `Einstellungen.tsx` (`/einstellungen`) — vom autonomen IT-Chef-Lauf
  am 22.08. gebaut: Benachrichtigungs-Toggles (Preisalarme, Neue Angebote,
  Reise-Updates — Toggle-Chips analog `Profil.tsx`) und Maßeinheiten-Auswahl
  (Metrisch/Imperial). Bewusst ohne Sprachumschaltung (PRD-Frage OQ-05 ist
  noch offen) und ohne Währungsumschaltung. Rein lokaler Demo-State ohne
  Persistenz und ohne echten E-Mail-Versand (Postfach laut Support-Track noch
  nicht live), gleiches Muster wie Profil/Favoriten/Preisalarme
- [ ] 8.11 Hilfe
- [ ] 8.9 Premium, 8.12 Rewards/Loyalty

### Sprint 5 — Duffel Stays & Zahlungsprozess (KW43-44, 20. Okt - 2. Nov)
- [ ] Duffel Stays live schalten, sobald Duffel den Account freigibt
  (externe Abhängigkeit — falls bis hier nicht freigeschaltet, Platzhalter
  bleibt bestehen und wird nach Launch nachgezogen)
- [ ] Entscheidung + Umsetzung: eigener Zahlungsprozess ODER weiterhin
  Verlinkung "Beim Anbieter buchen" — **Produktentscheidung**, hat
  direkte rechtliche Folgen (Widerrufsrecht etc.), siehe Support-Track
- [ ] 8.13 Unit-Tests für calculateProgress, calculateCosts,
  checklistRules, Schema-Validierung

### Sprint 6 — Testing, Politur, Launch-Vorbereitung (KW45-47, 3.-23. Nov)
- [ ] End-to-End-Testing aller Flows (Chat → Buchungsseite → Urlaubsmodus)
- [ ] Mobile-Politur, Barrierefreiheit-Check
- [ ] Bugfixing-Durchgang
- [ ] Performance-Check (Ladezeiten, Bundle-Größe)

### Launch-Woche (24.-30. Nov) → **Release 01.12.2026**

---

## Marketing (Marketing-Chef)

### Sprint 1 (KW33, 11.-17. Aug)
- [x] Positionierung & Zielgruppen final festlegen (von Ni am 10.08.
  bestätigt, siehe `MARKENDESIGN.md`)

### Sprint 2 (KW34, 18.-24. Aug)
- [ ] Landingpage/Warteliste live (unabhängig vom Hauptprodukt umsetzbar)

### Sprint 3 (KW35-36, 25. Aug - 7. Sep)
- [x] Content-Plan erstellen (Themen, Formate, Kanäle) — vom autonomen
  Marketing-Chef-Lauf am 20.08. als stale Checkbox erkannt: der Plan
  liegt bereits seit 10.08. fertig in `marketing/content-plan.md`
  (vier Content-Säulen, Kanal-/Format-Matrix, Redaktionsplan für die
  ersten vier Wochen, Leitplanken). Keine Code-Änderung, nur die
  Checkbox korrigiert.
- [x] Erste Content-Stücke produzieren (Blog/Social) — ebenfalls stale:
  liegt bereits seit 11.08. fertig in `marketing/content-stuecke-woche1.md`
  (zwei Social-Posts für LinkedIn/Instagram plus ein Blog-Stück, alle
  als reine Entwürfe, nichts veröffentlicht). Baut direkt auf dem
  Content-Plan (Woche 1, Post A/B) auf. Keine Code-Änderung, nur die
  Checkbox korrigiert.

### Sprint 4 (KW37-40, 8. Sep - 5. Okt)
- [ ] Laufende Content-Produktion — läuft bereits vorgezogen, siehe die
  einzelnen Content-Stücke in `marketing/` (bleibt als laufender Punkt
  offen, kein einmaliger Abschluss). Neuester Zugang am 24.08.:
  `marketing/content-stueck-reise-suchen-empfohlen.md` zur neuen
  `/reise-planen`-Seite, nachdem der zuvor gemeldete "Empfohlen"-Badge-Bug
  (siehe `reports/marketing-chef.md`, 22./23.08.) heute vom IT-Chef
  behoben wurde. Neuester Zugang am 05.09.: `marketing/mini-changelog-
  konzept.md` — kein Social-Post, sondern Konzept + fertige erste
  Ausgabe für eine öffentliche "Was wurde besser"-Seite im Produkt
  selbst, wartet auf Nis Freigabe (siehe
  `marketing/freigabe-uebersicht.md`, Tier 5). Am 07.09. Ausgabe 2, am
  14.09. Ausgabe 3, am 17.09. Ausgabe 4 und am 29.09. Ausgabe 5 desselben
  Dokuments ergänzt (jeweils weitere Vorher/Nachher-Punkte aus seither
  gemergten Ehrlichkeits-/Vertrauens-Fixes, u. a. Löschbestätigung vor
  unwiderruflichem Entfernen von Preisalarm/Favorit/Angebot/Aktivität/
  Reiseentwurf, eine korrekte Tages-Anzeige bei langen Reisedauern sowie
  zuletzt mehrere zuvor nicht erkannte Transportmittel-Formulierungen im
  Chat) — weiterhin an dieselbe, noch unbeantwortete Freigabe-Frage
  gebunden.
- [ ] Community/Warteliste aufbauen

### Sprint 5 (KW41-42, 6.-19. Okt)
- [x] Kampagnen-Konzepte für Google/Meta/TikTok Ads (Performance-Teil des
  Skills nutzen — Kampagnenstruktur, Zielgruppen, Anzeigentexte) — vom
  autonomen Marketing-Chef-Lauf am 22.08. vorgezogen, da Sprint 3/4
  weiterhin an Nis Freigabe-Entscheidung bzw. der noch nicht live
  geschalteten Landingpage hängen; Entwurf in
  `marketing/kampagnen-konzept-ads.md`. Bewusst noch nicht startbereit
  (siehe Vorbedingungen dort), nur als Vorlage fertig.

### Sprint 6 (KW43-45, 20. Okt - 9. Nov)
- [ ] Test-Kampagnen mit kleinem Budget starten, Learnings sammeln

### Sprint 7 (KW46-47, 10.-23. Nov)
- [ ] Launch-Kampagne vorbereiten
- [x] Presse-/Multiplikatoren-Kontakte aufbauen — vom autonomen
  Marketing-Chef-Lauf am 23.08. vorgezogen (Sprint 3/4/6 hängen
  weiterhin an Nis Freigabe-Entscheidung bzw. der noch nicht live
  geschalteten Landingpage). Bewusst nur die Strategie/Vorlage in
  `marketing/presse-multiplikatoren-strategie.md`: Zielgruppen-Typen,
  Auswahlkriterien, Outreach-Vorlage — **keine echten Namen recherchiert
  oder kontaktiert**, das bräuchte entweder echte Web-Recherche
  (unverifizierbar in diesem Lauf) oder wäre ein Live-Vorgang. Die
  tatsächliche Kontaktliste bleibt Nis nächster Schritt, siehe
  Vorbedingungen im Dokument.

### Launch-Woche
- [ ] Kampagne live schalten

---

## Support & Rechtliches (Support-Chef)

### Sprint 1 (KW33, 11.-17. Aug)
- [ ] Support-E-Mail live (in Arbeit, iCloud-Alias-Weg)

### Sprint 2 (KW34-35, 18. Aug - 31. Aug)
- [ ] FAQ/Hilfe-Inhalte erarbeiten (Basis für 8.11 Hilfe-Seite —
  Abstimmung mit IT-Chef zu Umsetzung)

### Sprint 3 (KW36-38, 1.-21. Sep)
- [ ] Support-Triage in echtem Einsatz testen, sobald Postfach aktiv ist
- [ ] Reibungspunkt-Analyse an neuen Seiten aus Sprint 2/3 (IT)

### Sprint 4 (KW39-44, 22. Sep - 2. Nov)
- [ ] Laufende UX-Reibungspunkt-Analyse parallel zur Feature-Entwicklung
- [ ] **Rechtliches: Impressum, Datenschutzerklärung, AGB** — Pflicht vor
  Live-Schaltung in DE/EU. Kein Anwalt im Team — Ni muss das über einen
  Generator-Dienst oder echten Anwalt klären, besonders falls ein eigener
  Zahlungsprozess kommt (Widerrufsrecht bei Reiseleistungen ist
  komplexer als bei normalem E-Commerce)

### Sprint 5 (KW45-47, 3.-23. Nov)
- [ ] Playbooks für Support-Ansturm nach Launch vorbereiten
- [ ] Eskalationswege festlegen (was braucht Nis Aufmerksamkeit vs. was
  kann Support-Chef eigenständig beantworten)

---

## Offene Entscheidungen, die Ni treffen muss
Diese Punkte kann kein Agent autonom entscheiden — sie brauchen Nis
Input, bevor die jeweiligen Programmierungs-Sprints starten können:
1. Backend-Anbieter (Base44 vs. Alternative) — blockiert Sprint 1 (KI)
   und Sprint 2 (Auth)
2. Eigener Zahlungsprozess oder weiter "Beim Anbieter buchen"? —
   blockiert Sprint 5 und hat direkte rechtliche Folgen
3. Wochenstunden-Annahme (10-15 Std./Woche) bestätigen oder korrigieren
