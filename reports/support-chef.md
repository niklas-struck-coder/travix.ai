# Support-Chef Bericht

**Datum:** 2026-09-06

## Was ist seit dem letzten Eintrag (2026-09-05) passiert?

Der Speicher-Warnhinweis, den ich zuletzt vorgeschlagen hatte, ist jetzt
live: Läuft der Browser-Speicher voll, zeigt `KiChat.tsx` (Zeile 100-104)
direkt unter der Chat-Kopfzeile den Hinweis "Dein Fortschritt kann gerade
nicht dauerhaft gespeichert werden — ein Neuladen würde ihn verwerfen."
Genau das ehrliche Signal, das vorher gefehlt hat — danke fürs Umsetzen!

Beim Nachprüfen ist mir aufgefallen, dass derselbe Speicherfehler noch an
anderer Stelle unentdeckt durchschlägt: Wählst du auf der Flug- oder
Hotelsuche-Seite ein Angebot aus, oder bearbeitest du in `Buchung.tsx`
deine Aktivitäten, läuft das über `updateStoredTrip()`
(`tripStorage.ts:50-57`) — und die zeigt "ausgewählt"/"gespeichert" an,
auch wenn das eigentliche Schreiben in den Speicher fehlgeschlagen ist.
Das ist bereits gefunden und eingeordnet (IT-Chef hat dafür PR #19
eröffnet), hier also keine neue Baustelle von mir, nur zur Einordnung.

Meine zwei Vorschläge von letztem Mal (Nulltreffer-Chips in `useChat.ts`
und die widersprüchliche Ziel-Ankündigung in `mockAdvisor.ts`) sind nach
Code-Check unverändert noch offen — deshalb bleiben sie unten stehen,
diesmal ohne neue Punkte dazu.

## Meine Vorschläge

1. **Nach einer erfolgreichen Suche mit null Treffern bleiben die
   Chat-Chips leer.** In `useChat.ts` wird `quickReplies` nur gesetzt,
   wenn ein echter Suchfehler auftritt (`result.errors.length > 0`,
   z. B. Zeile 99 und 322). Kommen dagegen einfach null Angebote zurück,
   bekommt die Nutzerin zwar die richtige "keine Angebote"-Nachricht,
   aber keinen Chip, um weiterzumachen — eine kleine Sackgasse mitten im
   sonst so flüssigen Chat. *Vorschlag:* Auch im Nulltreffer-Fall
   `setQuickReplies(['Neue Reise planen', 'Andere Daten versuchen'])`
   setzen, konsistent mit jedem anderen Chat-Endzustand.

2. **Kennt travix.ai dein Reiseziel nicht für die automatische
   Unterkunftssuche, wirkt die Chat-Antwort widersprüchlich.**
   `mockAdvisor.ts:108` lässt die Bestätigungsnachricht immer "Ich suche
   jetzt nach echten Unterkünften in [Ziel]" sagen — unabhängig davon,
   ob `findKnownDestination()` das Ziel überhaupt kennt. Ist das nicht
   der Fall, folgt in `useChat.ts` (um Zeile 336) sofort eine zweite
   Nachricht ("kenne ich noch keine Unterkünfte … nutze die manuelle
   Hotelsuche"), aber die alten Hotel-Chips davor bleiben anklickbar,
   obwohl ein Klick keine echte Suche mehr auslöst. Für eine
   Erstnutzerin liest sich das wie "ich suche" gefolgt von "ich kann
   nicht" — bei scheinbar weiter aktiven Buttons. *Vorschlag:* Bei
   fehlendem Ziel-Match direkt `setQuickReplies([])` setzen (oder einen
   Chip zur manuellen Hotelsuche anbieten), und die Ankündigung in
   `mockAdvisor.ts` nur dann "ich suche jetzt" sagen lassen, wenn das
   Ziel wirklich bekannt ist.

_Letztes Update: 2026-09-06_
