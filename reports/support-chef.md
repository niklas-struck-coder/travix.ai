# Support-Chef Bericht

**Datum:** 2026-08-26

## Was ist seit dem letzten Eintrag (2026-08-24) passiert?

Beide Punkte aus dem letzten Bericht haben sich bewegt: Die Checkliste
sagt jetzt ehrlich "Transport/Unterkunft ausgewählt" statt irreführend
"gebucht" (`src/lib/trip/checklistRules.ts`) — mein Vorschlag wurde vom
IT-Chef direkt übernommen. Die gemeinsame `localStorage`-Lösung gegen
Formularverlust (Profil, Einstellungen, Checkliste) steht dagegen weiter
aus, bewusst zurückgestellt bis zur Backend-/Nutzerkonten-Entscheidung.

Daneben gab es seitdem drei automatische Analyse-Läufe von mir (Mikrofon-
Fehleranzeige im KI-Chat, Such-Assistenten Flug/Hotel, Preisalarme —
alle in `support-chef-auto-log.md` dokumentiert), plus zwei daraus
entstandene IT-Chef-Fixes: [PR #8](https://github.com/niklas-struck-coder/travix.ai/pull/8)
(Vergangenheitsdatum bei Hinflug/Check-in) und
[PR #9](https://github.com/niklas-struck-coder/travix.ai/pull/9)
(deutsches Preisformat in den Ergebniskarten) — beide noch offen, warten
auf Review. Zwei Reibungspunkte aus den Auto-Läufen sind dadurch noch
nicht abgedeckt und unten neu aufgeführt.

## Meine Vorschläge

1. **Der Mikrofon-Fehlerhinweis im KI-Chat verschwindet nie von selbst —
   auch nicht, wenn man dem eigenen Rat folgt und einfach tippt.**
   `src/components/chat/ChatInput.tsx:19-24` (`handleSend`) setzt
   `micError` nirgends zurück; er wird nur bei einem neuen Mikrofon-
   Versuch gelöscht (Zeile 28). Wer einmal versehentlich das Mikrofon
   antippt, die Berechtigung verweigert und danach ganz normal
   weitertippt, sieht die Meldung "bitte tippe deine Nachricht
   stattdessen" dauerhaft unter einem längst reibungslos laufenden
   Gespräch stehen. Vorschlag: `setMicError(null)` in `handleSend`
   ergänzen — die Aktion, die der Hinweis selbst empfiehlt, ist das
   natürlichste Signal "Problem erledigt".

2. **Dieselbe Fehlermeldung wird Screenreader-Nutzer:innen gar nicht
   angekündigt.** Das `<p>` mit dem Hinweistext am Ende von
   `ChatInput.tsx` hat weder `role="status"` noch `aria-live`. Wer den
   Mikrofon-Button per Screenreader bedient, bekommt die Fehlermeldung
   und die Handlungsanweisung nicht mit — die Aufnahme endet für sie
   kommentarlos, genau der stille Zustand, den der Hinweistext eigentlich
   beheben sollte. Ein `role="status"` auf diesem `<p>` würde reichen.

3. **Der Entfernen-Button bei Preisalarmen zeigt ein "Stummschalten"-
   Icon, löscht aber unwiderruflich.** `src/pages/Preisalarme.tsx:96`
   nutzt das `BellOff`-Icon (durchgestrichene Glocke) für `removeAlert` —
   das liest sich wie Pausieren, tatsächlich ist der Alarm danach
   komplett weg, ohne Weg zurück außer neuer Planung im KI-Chat. Der
   `aria-label` sagt zwar korrekt "entfernen", das Icon selbst
   widerspricht dem und begünstigt versehentliches, endgültiges Löschen
   bei jemandem, der nur kurz Ruhe wollte. Vorschlag: eindeutiges
   Löschen-Icon (z. B. `Trash2`, analog `Angebote.tsx:105`) statt
   `BellOff`.

_Letztes Update: 2026-08-26_
