# Marketing-Chef Bericht

**Datum:** 2026-09-30

## Was ist seit dem letzten Eintrag (2026-09-29) passiert?

Auf der Fix-Seite: Support-Chef hat einen neuen Ehrlichkeits-Bug gefunden —
`formatDuration()` rundete reine Sekundenwerte zu einer erfundenen
"1min"-Anzeige hoch, statt ehrlich einen Platzhalter zu zeigen. IT-Chef hat
das noch am selben Tag automatisch gefixt (PR #25, gemergt). Die
Marketing-Auto-Spur (`marketing-chef/auto`) hat den Fund parallel schon als
Tier-4-Kandidat für den nächsten Mini-Changelog vorgemerkt — dieser Teil
läuft also bereits von selbst, ich muss ihn hier nicht doppelt anstoßen.

Der wichtigere Punkt von gestern bleibt unverändert offen: Die Flugsuche im
normalen Chat-Ablauf verspricht wörtlich "Ich suche jetzt nach echten
Flug-Verbindungen ... Nichts wird erfunden", löst aber laut Code-Kommentar
in `src/lib/ai/mockAdvisor.ts` (Zeile ~166) weiterhin keine echte Suche aus
— nur der separate "Bearbeiten"-Pfad tut das. Mehrere IT-Chef-Läufe seit
gestern fanden dazu keinen sicheren Automatik-Fix; es ist also bewusst noch
offen, nicht vergessen.

Die Kanal-/Zielgruppen-Entscheidung (Sprint 1) ist weiterhin offen, jetzt
über neun Wochen. Keine neuen Nutzungs- oder Erfolgszahlen bekannt.

## Vorschläge

1. **formatDuration-Fix ist fertiges Rohmaterial für den nächsten
   Mini-Changelog** — läuft schon über die Auto-Spur, hier nur als
   Bestätigung: genau das richtige kleine, ehrliche Beispiel für die
   "sagt, was es tut"-Serie, kein neuer Aufwand nötig.

2. **Bei der Flugsuche weiterhin Zurückhaltung:** Solange der
   "verspricht Suche, löst keine aus"-Fund offen ist, sollte keine
   Kommunikation aktiv mit "wir suchen ehrlich echte Flüge für dich"
   werben — das wäre nach mehreren offenen Läufen ohne Fix inzwischen
   ein Risiko, keine Randnotiz mehr. Sobald gefixt: prädestiniert für ein
   eigenes, etwas größeres Content-Stück (nicht nur Mini-Changelog-Zeile),
   weil es der bisher greifbarste Beweis für "Ehrlichkeit als Feature"
   wäre.

3. **Ehrlich gesagt: an der großen Linie hat sich seit gestern nichts
   bewegt.** Die Kanal-Frage steht seit Wochen still, während sich
   auf der Fix-Seite inzwischen ein kleines, wiederkehrendes Muster
   zeigt: Support-Chef findet einen Ehrlichkeits-Bug, IT-Chef fixt ihn
   noch am selben Tag. Das ist an sich schon eine Geschichte ("wir
   reagieren live auf unsere eigenen Fehler") — mein Vorschlag von
   gestern (ein risikoarmer Build-in-public-Kanal nur für
   Changelog-/Fix-Content) würde genau das ohne Vorgriff auf die
   Sprint-1-Entscheidung sichtbar machen. Bleibt unverändert als
   niedrigschwellige Idee im Raum stehen.

_Letztes Update: 2026-09-30_
