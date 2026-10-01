# Support-Chef Bericht

**Datum:** 2026-10-01

## Was ist seit dem letzten Eintrag (2026-09-30) passiert?

Der formatDuration-Fix (PR #25) ist weiterhin nicht gemerged — im
Code-Gegencheck heute bestätigt: `src/components/search/FlightCard.tsx:25-27`
zeigt bei reiner Sekundenangabe immer noch das erfundene "1min" statt
eines ehrlichen "—". Auch der Marketing-Chef hat das heute per eigenem
Code-Check bestätigt. Für Nutzer:innen also weiterhin unverändert live.

Neu dazugekommen ist ein kleiner, aber echter Fund im automatischen
Kanal: Beim letzten größeren Reiseentwürfe-Fix (Disambiguierung von
Lösch-/Abschließen-Dialogen bei doppelten Zielen) wurde ein dritter,
sehr ähnlicher Dialog übersehen — siehe Vorschlag 2.

Mein Fund von vorgestern — die Flugsuche im Hauptchat verspricht eine
Suche, die nie startet — ist weiterhin unverändert offen.

## Meine Vorschläge

1. **PR #25 zeitnah mergen.** `src/components/search/FlightCard.tsx`
   und `TrainCard.tsx`: Solange die Sekunden-Änderung nicht auf main
   ist, sehen Nutzer:innen bei kaputten Rohdaten weiterhin ein
   erfundenes "1min" statt eines ehrlichen "—" — genau das Muster, das
   in denselben Dateien bei `formatTime()`/`formatLocation()` schon
   korrekt gelöst ist. Kleiner, klar abgegrenzter Fix, der nur noch auf
   Merge wartet.

2. **"Details ansehen"-Dialog bei Reiseentwürfen zeigt bei Duplikaten
   weiterhin keinen unterscheidbaren Titel.** `src/pages/Reiseentwuerfe.tsx:373`:
   `<DialogTitle>{detailsDraft?.destination}</DialogTitle>` nutzt noch
   den rohen Namen statt der neuen `getDraftLabel()`-Hilfsfunktion, die
   der Lösch- und der Abschließen-Dialog bereits korrekt verwenden. Wer
   einen Entwurf dupliziert und beide "Lissabon"-Karten abschließt, sieht
   beim Öffnen von "Details ansehen" für beide denselben Titel "Lissabon"
   — der zugehörige Button kündigt per Screenreader zwar schon korrekt
   "Lissabon (Eintrag 2) Details ansehen" an, der Dialog selbst macht den
   Unterschied danach aber wieder unsichtbar. *Vorschlag:* dieselbe schon
   etablierte Lösung übernehmen — `{detailsDraft && getDraftLabel(detailsDraft, drafts)}`
   statt `{detailsDraft?.destination}`. Keine neue Design-Entscheidung,
   nur die dritte von drei Stellen nachziehen.

3. **Flugsuche im Hauptchat verspricht weiterhin mehr, als sie hält —
   inzwischen zum vierten Mal gemeldet.** `src/lib/ai/mockAdvisor.ts:172`:
   Wer im normalen Ablauf (nicht über "Bearbeiten") Flug wählt, bekommt
   *"Ich suche jetzt nach echten Flug-Verbindungen für [Ziel] …"* — es
   startet aber keine Suche, einziger nächster Schritt ist "Neue Reise
   planen". *Vorschlag bleibt:* entweder im Hauptablauf ebenfalls nach
   dem Abflughafen fragen und die echte Suche auslösen (wie im
   Bearbeiten-Pfad, `useChat.ts:229-262`), oder die Ankündigung ehrlich
   auf den zusätzlichen Schritt umformulieren — wie bei Bus/Fähre/
   Mietwagen bereits sauber gelöst.

_Letztes Update: 2026-10-01_
