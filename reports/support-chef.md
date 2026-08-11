# Support-Chef Bericht

**Datum:** 2026-08-11

## Was ist seit dem letzten Eintrag (2026-08-10) passiert?

Einiges: Der Ladezustand-Bug bei der Flugsuche, den ich letztes Mal gemeldet
hatte, ist behoben. Auf der Buchungsseite (`/buchung`) gibt es jetzt bei
Transport und Unterkunft einen "Bearbeiten"-Button, der dich fragen lässt,
ob du mit der KI weiterplanen oder manuell suchen möchtest — eine schöne,
klare Wahl. Dazu wurde die echte Flug- und Hotelsuche direkt in den KI-Chat
eingebaut (nicht mehr nur auf den eigenständigen Suchseiten), und die
Hotelsuche selbst hat jetzt auch einen sauberen Ladezustand. Die
Kartenansicht (`/karte`) zeigt seit heute dein echtes, im Chat geplantes
Reiseziel statt fester Demo-Orte.

## Meine Vorschläge

1. **Das Problem mit den rohen Duffel-Fehlermeldungen habe ich schon einmal
   gemeldet — jetzt ist es an zwei weiteren Stellen aufgetaucht statt
   behoben zu werden.** In `src/pages/Hotelsuche.tsx:24` und neu auch in
   `src/components/search/FlightResults.tsx:29` (dem Fehlerblock der neuen
   Flugsuche direkt im KI-Chat) wird `error.message` unverändert angezeigt —
   Duffel liefert diese Meldungen laut `src/lib/duffel/client.ts:15-24` roh
   und auf Englisch. Was letztes Mal ein einzelner Fleck war, ist jetzt ein
   Muster: Jede neue Suchoberfläche kopiert denselben unübersetzten
   Fehlertext. Eine einzige, zentrale Übersetzungsfunktion für die
   häufigsten Duffel-Fehlercodes (mit rohem Text nur als Fallback) würde das
   an allen drei Stellen auf einmal beheben, statt es ein viertes Mal
   nachzuziehen.

2. **Kartenansicht-Popup zeigt weiterhin nur den Ortsnamen, nicht das
   Reisedatum.** Auch nach der heutigen Umstellung auf echte Trip-Daten
   (`src/pages/Kartenansicht.tsx`) enthält das Popup beim Anklicken des
   Markers nur `{known.name}` — die Karte darunter zeigt das Reisedatum
   zusätzlich an. Wer über die Karte selbst navigiert, sieht also weniger
   Kontext als beim Blick auf die Liste direkt daneben. Kleine Ergänzung:
   `{trip?.dates}` mit ins Popup aufnehmen, dann zeigen beide Ansichten
   denselben Stand.

3. **Weiterhin offen aus dem letzten Bericht: Mikrofon-Fehler bleiben
   unsichtbar.** `src/lib/ai/speech.ts:47` (`recognition.onerror = onEnd`)
   ist unverändert — verweigert jemand die Mikrofon-Berechtigung, verschwindet
   die "Aufnahme läuft"-Anzeige kommentarlos, ohne Hinweis, was passiert ist.

4. **Zug/Bus/Fähre bleiben für Nutzer:innen weiterhin unsichtbar.**
   `TrainCard.tsx`/`TrainResults.tsx` existieren nach wie vor, sind aber in
   keinen erreichbaren Nutzerpfad eingebunden. Kein akuter Reibungspunkt,
   aber unverändert seit letztem Bericht — nur zur Erinnerung, falls das aus
   dem Blick gerät.

_Letztes Update: 2026-08-11_
