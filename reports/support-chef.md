# Support-Chef Bericht

**Datum:** 2026-09-28

## Was ist seit dem letzten Eintrag (2026-09-27) passiert?

Diesmal einiges — und größtenteils gute Nachrichten. Alle drei zuletzt
gemeldeten Punkte sind jetzt tatsächlich auf `main` gelandet und für echte
Besucher:innen spürbar:

1. **Mietwagen-Button ist da.** `src/lib/ai/mockAdvisor.ts:78` — die
   Quick-Replies beim Transportmittel enthalten jetzt `'Mietwagen'`, nicht
   mehr nur die vier anderen Optionen.
2. **Flugkarte zeigt jetzt Klarnamen.** `src/components/search/FlightCard.tsx:60,66`
   zeigt "Berlin"/"Lissabon" statt "BER"/"LIS" — inklusive Datum und
   Hinflug-/Rückflug-Kennzeichnung bei Hin- und Rückflug in einer Karte.
3. **Der Fallback ist mit drin.** Sowohl `FlightCard.tsx:28` (`name ||
   iata || '—'`) als auch `TrainCard.tsx:20` (`name || '—'`) fangen jetzt
   ein leeres Namensfeld ab, statt eine leere Stelle neben der Uhrzeit zu
   zeigen. Genau das hatte ich gestern vorsorglich vorgeschlagen, bevor der
   Klarname-Fix live geht — ist eingebaut.

Dazu ein paar Fixes, die ich nicht selbst gemeldet hatte, aber aus
Nutzersicht ebenfalls zählen: Hotelsuche lässt kein Ein-Nacht-mit-null-
Nächten-Datum mehr zu (`HotelWizard.tsx`, Check-out-Minimum ist jetzt
Check-in + 1 Tag), und die Spracherkennung für "Flugzeug"/"fliegen"/
"Zugticket" wurde nachgeschärft (`mockAdvisor.ts`).

## Meine Vorschläge

1. **Flug-Suche im Hauptchat verspricht mehr, als sie hält.**
   `src/lib/ai/mockAdvisor.ts:154-165`: Wer im normalen Chat-Ablauf (nicht
   über "Bearbeiten") Flug als Transportmittel wählt und bis zur Unterkunft
   durchklickt, bekommt die Nachricht *"Ich suche jetzt nach echten
   Flug-Verbindungen für [Ziel] — sobald ich etwas Verifiziertes gefunden
   habe, zeige ich es dir. Nichts wird erfunden."* Das klingt nach einer
   laufenden Suche — es passiert aber keine. Der Code-Kommentar direkt
   daneben sagt es selbst: *"Der Hauptchat-Ablauf löst die echte Flugsuche
   aktuell nicht aus (nur der separate 'Bearbeiten'-Pfad in useChat.ts tut
   das)."* Die einzige Stelle, die wirklich sucht, ist
   `src/hooks/useChat.ts:229-262` (`awaitingFlightOrigin`) — die aber nur
   erreichbar ist, wenn man hinterher über den "Bearbeiten"-Button beim
   Transportmittel nochmal Flug auswählt und einen Abflughafen eingibt.
   Im normalen Ablauf bleibt der Person nur "Neue Reise planen" als
   einziger Quick-Reply — keine Flüge, keine Erklärung, warum nicht. Das
   ist genau die Sorte Widerspruch, die der Satz "Nichts wird erfunden"
   eigentlich verhindern soll: Hier wird zwar nichts erfunden, aber auch
   nichts geliefert, obwohl es angekündigt wurde. *Vorschlag:* entweder im
   Hauptablauf ebenfalls nach dem Abflughafen fragen und `runFlightSearch`
   auslösen (wie im Bearbeiten-Pfad), oder die Ankündigungsnachricht so
   umformulieren, dass sie ehrlich auf den zusätzlichen Bearbeiten-Schritt
   hinweist — ähnlich wie es für Bus/Fähre/Mietwagen bereits sauber gelöst
   ist (`mockAdvisor.ts:167-174`).

2. **Hilfe-Seite (`/hilfe`) bleibt eine Sackgasse.**
   `src/pages/PlaceholderPage.tsx:16` zeigt weiterhin nur "Hilfe wird als
   Nächstes gebaut" — kein FAQ, kein Kontaktweg, keine E-Mail-Adresse im
   Code zu finden. Laut `ZEITPLAN.md` bewusst blockiert, bis Sprint 1
   "Support-E-Mail live" abgeschlossen ist. Nach wie vor der richtige
   Zeitpunkt dafür, sobald das ansteht — bis dahin unverändert.

_Letztes Update: 2026-09-28_
