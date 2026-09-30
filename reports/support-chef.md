# Support-Chef Bericht

**Datum:** 2026-09-30

## Was ist seit dem letzten Eintrag (2026-09-29) passiert?

Gute Nachricht zuerst: Mein Fund 1 von gestern ist behoben.
`src/lib/ai/mockAdvisor.ts:114` sagt nach der Transportmittel-Wahl jetzt
sauber "nur einen Mietwagen" bzw. "nur Fährverbindungen" — genau die
`noAutoSearchPhraseDe`-Map wiederverwendet, die ich vorgeschlagen hatte.

Neu dazugekommen ist ein echter kleiner Bug, den der automatische
Kanal heute gefunden hat: `formatDuration()` in `FlightCard.tsx` und
`TrainCard.tsx` zeigt bei einer reinen Sekundenangabe (z. B. defekte
Rohdaten von der Fluglinie) erfunden "1min" an, statt wie überall sonst
in denselben Dateien ehrlich "—". Der Fix dafür liegt bereits als PR #25
bereit, ist aber noch nicht auf main gemerged — für Nutzer:innen also
heute noch live.

Mein Fund 2 von gestern — die Flugsuche im Hauptchat verspricht eine
Suche, die nie startet — ist weiterhin unverändert offen.

## Meine Vorschläge

1. **PR #25 zeitnah mergen.** `src/components/search/FlightCard.tsx`
   und `TrainCard.tsx`: Solange die Sekunden-Änderung nicht auf main
   ist, sehen Nutzer:innen bei kaputten Rohdaten weiterhin ein
   erfundenes "1min" statt eines ehrlichen "—" — genau das Muster, das
   in denselben Dateien bei `formatTime()`/`formatLocation()` schon
   korrekt gelöst ist. Kleiner, klar abgegrenzter Fix, der nur noch auf
   Merge wartet.

2. **Flugsuche im Hauptchat verspricht weiterhin mehr, als sie hält —
   inzwischen zum dritten Mal gemeldet.** `src/lib/ai/mockAdvisor.ts:172`:
   Wer im normalen Ablauf (nicht über "Bearbeiten") Flug wählt, bekommt
   *"Ich suche jetzt nach echten Flug-Verbindungen für [Ziel] …"* — es
   startet aber keine Suche, einziger nächster Schritt ist "Neue Reise
   planen". Der Code-Kommentar direkt daneben erklärt den Kompromiss,
   löst das Grundproblem für Nutzer:innen aber nicht. *Vorschlag bleibt:*
   entweder im Hauptablauf ebenfalls nach dem Abflughafen fragen und die
   echte Suche auslösen (wie im Bearbeiten-Pfad, `useChat.ts:229-262`),
   oder die Ankündigung ehrlich auf den zusätzlichen Schritt umformulieren
   — wie bei Bus/Fähre/Mietwagen bereits sauber gelöst.

_Letztes Update: 2026-09-30_
