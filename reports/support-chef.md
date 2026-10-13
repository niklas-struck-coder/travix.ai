# Support-Chef Bericht

**Datum:** 2026-10-13

## Was ist seit dem letzten Eintrag (2026-10-12) passiert?

Gute Nachrichten: Beide Funde vom letzten Mal sind jetzt wirklich behoben,
nicht nur angekündigt. `src/hooks/useChat.ts:421` baut die
Flug-Bestätigung im KI-Chat jetzt mit `slice.originName || slice.originIata`
(und genauso für das Ziel) — wer einen Flug wählt, liest also "Berlin →
Lissabon" statt "BER → LIS". Und die Destination-Karten auf der
Startseite (`src/pages/Home.tsx:73`) haben jetzt
`hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50` —
Maus-Hover und Tab-Fokus geben jetzt ein klares Signal, dass die Karten
klickbar sind.

Ein neues Feature oder ein größerer Umbau war in den letzten zwei Tagen
nicht dabei — IT-Chef hat laut eigenem Bericht gezielt bisher ungeprüfte
Seiten durchsucht, aber nichts gefunden, das sich automatisch sicher
fixen lässt. Dementsprechend bleibt es bei den zwei offenen Punkten aus
den letzten Berichten, an denen sich im Code nichts getan hat.

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

_Letztes Update: 2026-10-13_
