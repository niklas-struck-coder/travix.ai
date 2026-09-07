# Support-Chef Bericht

**Datum:** 2026-09-07

## Was ist seit dem letzten Eintrag (2026-09-06) passiert?

Gute Nachrichten zuerst: Beide Vorschläge aus meinem letzten Bericht sind
umgesetzt. Die leeren Chat-Chips nach einer echten Nulltreffer-Suche
(Unterkunft/Flug) sind behoben (`useChat.ts`, Commit `56c8f61`) — es gibt
jetzt überall den Chip "Neue Reise planen" statt einer Sackgasse. Und die
widersprüchliche Unterkunfts-Ankündigung bei unbekanntem Ziel ist im
Hauptchat repariert (`mockAdvisor.ts`, Commit `b0b8d2e`) — danke fürs
schnelle Umsetzen!

Beim Nachprüfen des Zusammenspiels beider Fixes ist mir aber aufgefallen,
dass genau dieselbe Art Widerspruch an zwei Stellen weiterlebt, die der
heutige Fix nicht abgedeckt hat — einmal im Hauptchat selbst (Fix hat nur
die halbe Lücke geschlossen) und einmal komplett unberührt im
"Bearbeiten"-Pfad. Deshalb unten ein aktualisierter Vorschlag dazu, kein
neues, unabhängiges Thema.

## Meine Vorschläge

1. **Im Hauptchat folgen bei unbekanntem Ziel weiterhin zwei sich
   widersprechende Bot-Nachrichten direkt hintereinander.**
   `mockAdvisor.ts:124-132` sagt jetzt ehrlich "Danke! Für {Ziel}
   beschreib einfach, was für eine Unterkunft du dir vorstellst" — lädt
   also explizit zum Weiterschreiben im Chat ein. Aber `useChat.ts:311-345`
   prüft im selben `setTimeout`-Callback direkt danach noch einmal
   unabhängig `findKnownDestination()` und hängt bei unbekanntem Ziel
   sofort eine zweite Nachricht an: "kenne ich noch keine Unterkünfte …
   nutze dafür kurz die manuelle Hotelsuche" (Zeile 342-343). Für die
   Nutzerin erscheinen damit zwei Bot-Bubbles in einem Schwung mit
   gegensätzlicher Handlungsaufforderung — "schreib einfach hier weiter"
   sofort gefolgt von "nutze stattdessen die andere Seite". *Vorschlag:*
   Die zweite Nachricht nur zeigen, wenn die erste sie nicht schon
   vorweggenommen hat, z. B. über ein gemeinsames Flag am `AdvisorReply`,
   statt dass beide Stellen unabhängig denselben Sachverhalt prüfen und
   zwei verschiedene Formulierungen produzieren.

2. **Derselbe Widerspruch besteht unverändert im "Bearbeiten"-Pfad — vom
   heutigen Fix gar nicht berührt.** Wer eine Unterkunft über
   `startEdit('accommodation')` neu wählt, bekommt aus dem festen
   `editPrompts.accommodation` (`useChat.ts:29-32`) immer "Klar, ich
   suche eine neue Unterkunft für dich — einen Moment", unabhängig vom
   Ziel. Ist das Ziel nicht bekannt, hängt `startEdit()`
   (`useChat.ts:192-197`) synchron sofort dieselbe
   "kenne-ich-nicht/manuelle Hotelsuche"-Nachricht dahinter — exakt
   derselbe Widerspruch wie oben, nur über den anderen Einstiegspunkt.
   *Vorschlag:* Sobald Punkt 1 gelöst ist (z. B. über eine gemeinsame
   Hilfsfunktion für beide Pfade), denselben Mechanismus auch hier
   anwenden, statt zwei getrennte Textbausteine für denselben Fall zu
   pflegen.

_Letztes Update: 2026-09-07_
