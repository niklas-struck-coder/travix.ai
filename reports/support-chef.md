# Support-Chef Bericht

**Datum:** 2026-10-14

## Was ist seit dem letzten Eintrag (2026-10-13) passiert?

Am Code selbst hat sich seitdem nichts getan — IT-Chef hat am 14.10.
drei gezielte Läufe gemacht, aber nichts gefunden, das sich automatisch
sicher fixen lässt. Die drei zuletzt offenen Punkte (leeres
Flug-Bearbeiten-Formular, gleich dramatische Lösch-Warnungen,
Lissabon-Demokarte mit möglichem Chat-Mismatch) bleiben deshalb
unverändert bestehen.

Neu dazugekommen ist ein eigener Fund beim Urlaubsmodus-Concierge: Jede
ehrliche "das weiß ich nicht"-Antwort zeigt denselben roten,
schüttelnden Warn-Avatar wie ein echter Fehler. Das ist noch nicht
behoben, nur erkannt und dokumentiert — deshalb unten als vierter
Punkt mit aufgenommen.

## Meine Vorschläge

1. **Flug "Bearbeiten" → "Manuell suchen" führt weiterhin zu einem
   komplett leeren Formular.** `src/components/search/FlightWizard.tsx:38-44`
   initialisiert Herkunft, Ziel und Datum unverändert mit leeren Werten,
   und die Komponente nimmt laut ihrem Props-Interface (`FlightWizardProps`,
   Zeile 10-13) nur `onSearch` und `loading` entgegen — keine
   Möglichkeit, Startwerte zu übergeben. Wer zur Flugsuche zurückkehrt,
   tippt alles erneut ein, obwohl die zuvor gewählte Route im Trip schon
   gespeichert ist. *Vorschlag:* `FlightWizard` um ein optionales
   `initialValues`-Prop erweitern und beim Öffnen aus dem gespeicherten
   Trip befüllen.

2. **Die Lösch-Warnungen klingen überall gleich dramatisch, auch wenn es
   das nicht ist.** `Favoriten.tsx:128`, `Warenkorb.tsx:134`,
   `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118` und `EditMode.tsx:151`
   verwenden alle wortgleich "Das lässt sich nicht rückgängig machen" —
   auch dort, wo das gar nicht zutrifft, z. B. bei einem Favoriten, der
   mit einem Klick wieder anlegbar wäre. Das verunsichert unnötig.
   *Vorschlag:* den Warnhinweis nur dort zeigen, wo etwas wirklich
   unwiderruflich ist (z. B. eine Buchung), und bei trivial
   wiederherstellbaren Aktionen eine neutralere Formulierung ohne
   "endgültig"-Ton verwenden.

3. **Die "Urlaubsmodus aktivieren"-Karte für die Lissabon-Demoreise kann
   auf einen leeren oder falschen Chat führen.** `src/pages/MeineReisen.tsx:49`
   verlinkt von der Lissabon-Demokarte auf `/urlaubsmodus` — die Seite
   selbst (`src/pages/Urlaubsmodus.tsx:12`) lädt ihren Trip aber nicht aus
   dieser Demoreise, sondern aus `loadStoredChat()?.trip`, also dem im
   KI-Chat gespeicherten Trip. Hat ein Nutzer noch nie mit dem KI-Chat
   eine Reise geplant, landet er beim Klick auf die Lissabon-Karte in
   einem Urlaubsmodus ohne Reisebezug — oder mit einem ganz anderen Ziel,
   falls im Chat gerade etwas anderes gespeichert ist. *Vorschlag:* die
   Demokarte entweder direkt mit den Lissabon-Demodaten befüllen, oder so
   lange ausblenden/deaktivieren, bis echte Buchungen angebunden sind.

4. **Jede ehrliche "Das weiß ich nicht"-Antwort des Urlaubsmodus-Concierge
   sieht aus wie ein echter Fehler.** `src/hooks/useConcierge.ts:35` setzt
   `setAvatarState(reply.matched ? 'happy' : 'error')` — und `matched` ist
   laut `src/lib/ai/mockConcierge.ts:59-90` nicht auf technische Fehler
   beschränkt, sondern wird auch bei jeder normalen Reisefrage außerhalb
   der drei abgedeckten Themen (Währung/Notruf/Begrüßung) `false`, z. B.
   bei "Was soll ich anziehen?" oder "Brauche ich ein Visum?".
   `TravixAvatar.tsx:14` zeigt bei `'error'` ein rotes, schüttelndes
   Warn-Icon — genau die Farbe/Animation, die der Rest der App für echte
   Fehler reserviert. Wer also ganz normal fragt und eine ruhige, ehrliche
   Antwort bekommt, sieht dabei trotzdem einen Alarm. *Vorschlag:* für
   die ehrlichen Ausweich-Antworten einen neutralen Zustand verwenden
   (z. B. das bereits vorhandene `'idle'`/`'thinking'` oder einen neuen,
   ruhigen `'unsure'`-Zustand) und `'error'` echten technischen Fehlern
   vorbehalten.

_Letztes Update: 2026-10-14_
