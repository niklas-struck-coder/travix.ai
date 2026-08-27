# Support-Chef Bericht

**Datum:** 2026-08-27

## Was ist seit dem letzten Eintrag (2026-08-26) passiert?

Beide Punkte aus dem letzten Bericht sind behoben und im aktuellen Code
bestätigt: Der Mikrofon-Fehlerhinweis im KI-Chat verschwindet jetzt beim
Weitertippen (`src/components/chat/ChatInput.tsx:76`, `role="status"` für
Screenreader ergänzt), und der Preisalarme-Entfernen-Button zeigt jetzt ein
eindeutiges Löschen-Icon statt des irreführenden "Stummschalten"-Symbols
(`src/pages/Preisalarme.tsx:96`, `Trash2` statt `BellOff`). Danach wurde
die Reise-Checkliste (`ChecklistPanel.tsx`, Aufgabe 6.10) um Links zum
KI-Chat ergänzt, damit man automatisch erkannte Punkte direkt bearbeiten
kann — dabei ist ein neuer Reibungspunkt entstanden, den ich unten melde.

## Meine Vorschläge

1. **In der Reise-Checkliste sehen die klickbaren und die
   nur-abhakbaren Zeilen komplett gleich aus, tun aber sehr
   Unterschiedliches.** `src/components/trip/ChecklistPanel.tsx:68-87`
   (automatisch erkannte Punkte, jetzt `<Link>` zu `/ki-chat?edit=...`)
   und `:89-109` (manuelle Punkte, `<button>` zum lokalen Abhaken)
   verwenden dieselben Klassen, dieselben Icons und denselben Text-Stil.
   Ein Klick oben verlässt die Seite sofort und startet im KI-Chat eine
   neue Bearbeiten-Nachricht — auch wenn der Punkt schon grün abgehakt
   ist und man eigentlich nur nachsehen wollte. Ein Klick unten bleibt
   einfach auf der Seite. Es gibt kein Icon, keinen Pfeil, keinen
   Hinweis, der die beiden Verhaltensweisen unterscheidbar macht — für
   Screenreader-Nutzer:innen liest sich der Linktext ("Transport
   ausgewählt") zudem wie eine reine Status-Ansage, nicht wie ein
   Sprung zu einer neuen Seite. Kurzfristiger Vorschlag: den
   automatischen Zeilen dasselbe `Pencil`-Icon geben, das
   `Buchung.tsx` für "Bearbeiten"-Links bereits nutzt, plus einen
   `sr-only`-Zusatz im Linktext wie "Transport ausgewählt, bearbeiten".

_Letztes Update: 2026-08-27_
