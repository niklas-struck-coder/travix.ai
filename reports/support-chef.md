# Support-Chef Bericht

**Datum:** 2026-10-16

## Was ist seit dem letzten Eintrag (2026-10-15) passiert?

Guter Tag für dich: Zwei länger bekannte Probleme sind jetzt behoben und
in `main`. Der Avatar bleibt nach einer echten Flug-/Unterkunftssuche
nicht mehr dauerhaft im "sucht"-Zustand hängen. Und die doppelten,
identischen Fehlerzeilen bei mehreren gleichzeitigen Duffel-Fehlern (mein
Fund vom 15.10.) sind mit der neuen `SearchErrorAlert`-Komponente
behoben (PR #29, gemergt).

Der Avatar-Fix selbst hat aber einen neuen, eigenständigen Reibungspunkt
sichtbar gemacht (Punkt 1 unten) — mein eigener Auto-Lauf heute Nacht hat
ihn schon entdeckt, er ist aber noch nicht behoben.

Die drei bekannten Punkte aus dem letzten Bericht (leeres
Flug-Bearbeiten-Formular, gleich dramatische Lösch-Warnungen,
Lissabon-Demokarte mit Chat-Mismatch) habe ich heute nochmal im Code
gegengeprüft — an keiner der betroffenen Dateien hat sich etwas
geändert, sie bleiben also unverändert offen.

## Meine Vorschläge

1. **Avatar zeigt ein lächelndes Smiley, auch wenn die Suche gerade
   fehlgeschlagen ist.** `src/hooks/useChat.ts` ruft an allen sechs
   Suchabschluss-Stellen unbedingt `setAvatarState('happy')` auf — auch
   in den drei `.catch()`-Blöcken (Zeilen 126, 239, 417) und dort, wo
   `result.errors.length > 0` ist (Zeilen 117, 233, 411). Direkt daneben
   zeigt `KiChat.tsx` in diesem Fall aber eine echte Fehlermeldung
   (`role="alert"`) — Nutzer sehen also im selben Moment ein glückliches
   Icon und eine Fehlerbox. `TravixAvatar.tsx` hat dafür schon einen
   eigenen `'error'`-Zustand (Warndreieck, Zittern-Animation) fertig
   gebaut, der aber im ganzen Code nirgends aufgerufen wird. *Vorschlag:*
   in den `.catch()`-Zweigen und beim `errors.length > 0`-Fall
   `setAvatarState('error')` statt `'happy'` setzen — nur der Fall "keine
   Treffer, aber kein echter Fehler" sollte bei `'happy'` bleiben.

2. **Flug "Bearbeiten" → "Manuell suchen" führt weiterhin zu einem
   komplett leeren Formular.** `src/components/search/FlightWizard.tsx:10-13`
   nimmt laut `FlightWizardProps` nach wie vor nur `onSearch` und `loading`
   entgegen — keine Möglichkeit, Startwerte zu übergeben. Wer zur
   Flugsuche zurückkehrt, tippt alles erneut ein, obwohl die zuvor
   gewählte Route im Trip schon gespeichert ist. *Vorschlag:* `FlightWizard`
   um ein optionales `initialValues`-Prop erweitern und beim Öffnen aus
   dem gespeicherten Trip befüllen.

3. **Die Lösch-Warnungen klingen überall gleich dramatisch, auch wenn es
   das nicht ist.** `Favoriten.tsx:128`, `Warenkorb.tsx:134`,
   `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118` und `EditMode.tsx:151`
   verwenden weiterhin alle wortgleich "Das lässt sich nicht rückgängig
   machen" — auch dort, wo das gar nicht zutrifft, z. B. bei einem
   Favoriten, der mit einem Klick wieder anlegbar wäre. Das verunsichert
   unnötig. *Vorschlag:* den Warnhinweis nur dort zeigen, wo etwas wirklich
   unwiderruflich ist (z. B. eine Buchung), und bei trivial
   wiederherstellbaren Aktionen eine neutralere Formulierung verwenden.

4. **Die "Urlaubsmodus aktivieren"-Karte für die Lissabon-Demoreise kann
   auf einen leeren oder falschen Chat führen.** `src/pages/MeineReisen.tsx:49`
   verlinkt von der Lissabon-Demokarte auf `/urlaubsmodus` — die Seite
   selbst (`src/pages/Urlaubsmodus.tsx:12`) lädt ihren Trip aber weiterhin
   nicht aus dieser Demoreise, sondern aus `loadStoredChat()?.trip`, also
   dem im KI-Chat gespeicherten Trip. Hat ein Nutzer noch nie mit dem
   KI-Chat eine Reise geplant, landet er beim Klick auf die Lissabon-Karte
   in einem Urlaubsmodus ohne Reisebezug — oder mit einem ganz anderen
   Ziel. *Vorschlag:* die Demokarte entweder direkt mit den
   Lissabon-Demodaten befüllen, oder so lange ausblenden/deaktivieren, bis
   echte Buchungen angebunden sind.

_Letztes Update: 2026-10-16_
