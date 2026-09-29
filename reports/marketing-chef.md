# Marketing-Chef Bericht

**Datum:** 2026-09-29

## Was ist seit dem letzten Eintrag (2026-09-28) passiert?

Auf der Fix-Seite ging es nahtlos weiter: `main` hat seit gestern fünf
weitere IT-Chef-Läufe eingesammelt, darunter erneut die Wortgrenzen-Lücke
(diesmal "Bahnfahrt"/"Bahnticket"), einen Dead-End-Bug bei "Überrasch
mich!" mit Satzzeichen und einen TypeError beim Laden eines
unvollständigen gespeicherten Reiseplans. Die eigenständige
Marketing-Auto-Spur (`marketing-chef/auto`) hat daraus bereits die
fünfte Mini-Changelog-Ausgabe entworfen und über den Freigabe-Chef nach
`main` gemergt (`marketing/mini-changelog-konzept.md`) — dieser Teil der
Content-Pipeline läuft also bereits von selbst und muss hier nicht
doppelt vorgeschlagen werden.

Wichtiger neuer Punkt kam vom Support-Chef: Die Flugsuche im normalen
Chat-Ablauf (nicht über "Bearbeiten") verspricht dem Nutzer wörtlich
"Ich suche jetzt nach echten Flug-Verbindungen ... Nichts wird
erfunden" — löst aber laut Fund keine tatsächliche Suche aus
(`src/lib/ai/mockAdvisor.ts:154-165`). Das ist kein normaler UX-Nitpick,
sondern trifft direkt den Kern der "Ehrlichkeit als Feature"-Positionierung,
die die letzten Mini-Changelogs gerade aufgebaut haben. Laut heutigem
IT-Chef-Bericht (kein neuer Fund über ~50 Dateien) ist das noch nicht
gefixt.

Die Kanal-/Zielgruppen-Entscheidung (Sprint 1) ist weiterhin offen, jetzt
über acht Wochen. Keine neuen Nutzungs- oder Erfolgszahlen bekannt.

## Vorschläge

1. **Vor jeder Flug-bezogenen Kommunikation: den "verspricht Suche,
   löst keine aus"-Fund im Blick behalten.** Solange dieser offen ist,
   wäre jede Botschaft à la "wir suchen echte Verbindungen für dich" beim
   Flug-Flow angreifbar — genau das Gegenteil von dem, was die
   Klarname- und Mini-Changelog-Serie gerade glaubwürdig aufbaut. Kein
   Content-Vorschlag dazu, nur eine Reihenfolge-Empfehlung: erst fixen
   lassen, dann erst in Flug-Flows aktiv mit "ehrlicher Suche" werben.

2. **Sobald der Fund oben gefixt ist, ist er ein natürlicher Kandidat
   für die nächste Mini-Changelog-Ausgabe oder ein eigenes
   Content-Stück** — passt exakt ins bestehende Muster ("sagt, was es
   tut, tut, was es sagt") und bräuchte keine neue Erzählung, nur die
   bereits etablierte Vorlage.

3. **Ehrlich gesagt: strategisch hat sich seit gestern nichts bewegt.**
   Die Kanal-Frage ist der unverändert selbe Engpass wie in den letzten
   Berichten, nur zwei Wochen älter, während sich fünf Mini-Changelog-
   Ausgaben, mehrere fertige Content-Stücke und ein Kampagnen-Konzept
   stapeln. Statt das nochmal nur zu wiederholen: Eine Idee, den Stau
   zu entschärfen, ohne die finale Sprint-1-Entscheidung vorwegzunehmen
   — einen einzelnen, risikoarmen Kanal (z. B. ein "Build in
   public"-Account auf X/LinkedIn, nur Changelog- und Fix-Content, keine
   Zielgruppen-Kampagne) testweise zu bespielen. Das würde den
   wachsenden Rückstau abbauen, ohne die eigentliche
   Positionierungs-Entscheidung zu ersetzen.

_Letztes Update: 2026-09-29_
