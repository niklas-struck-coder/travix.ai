# Support-Chef Bericht

**Datum:** 2026-09-05

## Was ist seit dem letzten Eintrag (2026-09-04) passiert?

Alle drei zuletzt gemeldeten Punkte sind behoben: Nach einem echten
Suchfehler im Haupt-Chat-Ablauf gibt es jetzt den Chip "Neue Reise planen"
statt einer Sackgasse; die Flugsuche verhindert jetzt identische
Start-/Zielflughäfen mit einem eigenen Hinweistext; und der
Mikrofon-Knopf bleibt bei einem Fehler (z. B. verweigerter
Mikrofon-Berechtigung) nicht mehr für immer auf "Aufnahme läuft" hängen.
Danke fürs schnelle Umsetzen!

Zusätzlich ist bereits bekannt: Ist der Browser-Speicher (localStorage)
voll, crasht das Speichern des Chat-Fortschritts nicht mehr — aber die
Nutzerin bekommt weiterhin keinen Hinweis, dass ihr geplanter Trip bei
einem Reload verloren geht (siehe Vorschlag 3 unten).

## Meine Vorschläge

1. **Nach einer erfolgreichen Suche mit null Treffern bleiben die
   Chat-Chips leer.** In `useChat.ts` werden `quickReplies` nur gesetzt,
   wenn ein echter Suchfehler auftritt (`result.errors.length > 0`).
   Meldet die Suche dagegen ganz normal "keine Angebote gefunden"
   (`offers.length === 0`), zeigt zwar `NoResultsMessage` die passende
   Nachricht an, aber es gibt keinen Chip, um weiterzumachen. Betroffen:
   Flugsuche (um Zeile 93), Unterkunft im Bearbeiten-Pfad (um Zeile 172)
   und Unterkunft im Hauptablauf (um Zeile 318). *Vorschlag:* Auch im
   Nulltreffer-Fall `setQuickReplies(['Neue Reise planen', 'Andere Daten
   versuchen'])` setzen, damit für die Nutzerin klar ist, wie es
   weitergeht — konsistent mit jedem anderen Chat-Endzustand.

2. **Kennt travix.ai dein Reiseziel nicht für die automatische
   Unterkunftssuche, bleiben alte Chips stehen, und die Ankündigung davor
   war schon falsch.** `mockAdvisor.ts:108` lässt die Bestätigungsnachricht
   immer "Ich suche jetzt nach echten Unterkünften in [Ziel]" sagen —
   unabhängig davon, ob das technisch überhaupt möglich ist. Kennt
   `findKnownDestination()` das Ziel nicht (`useChat.ts:333-337`), folgt
   direkt danach eine zweite Nachricht ("kenne ich noch keine
   Unterkünfte … nutze die manuelle Hotelsuche") — die vorherigen Chips
   ("Hotel", "Ferienwohnung", "Hostel") bleiben aber anklickbar, obwohl
   ein Klick keine echte Suche auslöst, sondern nur so wirkt, als hätte
   die Nutzerin bereits eine Unterkunft ausgewählt. Für eine
   Erstnutzerin fühlt sich das wie ein Widerspruch an: erst "ich suche",
   dann "kann ich nicht" — aber die Buttons von vorher scheinen noch zu
   funktionieren. *Vorschlag:* Bei fehlendem Ziel-Match `setQuickReplies([])`
   setzen (oder direkt einen Chip zur manuellen Hotelsuche anbieten), und
   die Bestätigungsnachricht in `mockAdvisor.ts` nur dann "ich suche
   jetzt" sagen lassen, wenn das Ziel tatsächlich bekannt ist.

3. **Voller Browser-Speicher: Der geplante Trip verschwindet leise beim
   nächsten Laden.** Das Speichern crasht mittlerweile nicht mehr, wenn
   `localStorage` voll ist — aber während des Chattens merkt die
   Nutzerin nichts davon, jede Nachricht wirkt gespeichert. Schließt sie
   den Tab und kommt später wieder, ist der ganze geplante Trip weg, ohne
   jede Vorwarnung. *Vorschlag:* Nach demselben, bereits etablierten
   Muster wie beim `micError`-Hinweis in `ChatInput.tsx` (Zeile 75-79,
   dezenter `role="status"`-Text) einen kurzen, ehrlichen Hinweis
   einblenden, z. B. "Dein Fortschritt kann gerade nicht dauerhaft
   gespeichert werden — ein Neuladen würde ihn verwerfen." — platziert
   z. B. unter der Chat-Kopfzeile in `KiChat.tsx`.

_Letztes Update: 2026-09-05_
