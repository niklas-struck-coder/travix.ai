# Support-Chef Bericht

**Datum:** 2026-08-16

## Was ist seit dem letzten Eintrag (2026-08-12) passiert?

Ehrlich gesagt: nichts Neues am Code. Der IT-Chef hat es in seinem
eigenen Bericht vom 16.08. bereits bestätigt, und ich habe es hier
nochmal selbst nachgeprüft — seit dem 12.08. gab es keinen einzigen
Commit, der etwas an `src/` verändert hat. Ich habe die vier Punkte aus
dem letzten Bericht noch einmal einzeln im Code angeschaut, statt einfach
zu wiederholen — alle vier bestehen unverändert weiter. Es macht daher
keinen Sinn, neue Reibungspunkte zu erfinden, nur damit die Liste anders
aussieht. Stattdessen hier die wichtigsten weiterhin offenen Punkte, zur
Erinnerung:

## Meine Vorschläge

1. **Automatische Unterkunftssuche bleibt bei unbekanntem Ziel unsichtbar
   hängen.** `src/hooks/useChat.ts:151-176`: Der Avatar wird beim
   Bearbeiten der Unterkunft auf "sucht" gesetzt, aber die eigentliche
   Suche startet nur, wenn `findKnownDestination` das Ziel erkennt
   (weiterhin nur eine Handvoll kuratierte Städte). Bei jedem anderen Ziel
   bleibt die Nutzerin auf eine Antwort warten, die nie kommt. Der
   Flug-Zweig direkt daneben (`:204-213`) zeigt bereits die richtige
   Lösung — ein kurzer Hinweistext bei unbekanntem Ziel. Denselben Zweig
   für die Unterkunftssuche zu ergänzen, wäre eine kleine, klar
   abgegrenzte Änderung.

2. **Bei Preisalarmen fehlt genau dann ein Handlungs-Button, wenn das
   Ziel erreicht ist.** `src/pages/Preisalarme.tsx:80-109`: Die Karte
   zeigt das Abzeichen "Ziel erreicht", bietet aber außer dem
   Entfernen-Button keine Möglichkeit weiterzumachen — obwohl die
   Nutzerin genau in diesem Moment am ehesten buchen will.
   `Favoriten.tsx` löst das für dieselbe Karten-Struktur bereits mit
   einem "Reise mit KI planen"-Button — dasselbe Muster würde hier
   naheliegend passen.

3. **Weiterhin offen: rohe, englische Duffel-Fehlermeldungen im UI.**
   `src/lib/duffel/client.ts:24,30` reicht Fehlermeldungen unverändert
   unübersetzt durch. Bleibt aus meiner Sicht der größte einzelne
   Vertrauens-Reibungspunkt in der App.

4. **Weiterhin offen: Mikrofon-Fehler bleiben unsichtbar.**
   `src/lib/ai/speech.ts:47`: Eine verweigerte Mikrofon-Berechtigung wird
   weiterhin wie ein normales Aufnahmeende behandelt — die
   "Aufnahme läuft"-Anzeige verschwindet kommentarlos, ohne dass die
   Nutzerin erfährt, warum nichts passiert ist.

_Letztes Update: 2026-08-16_
