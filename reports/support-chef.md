# Support-Chef Bericht

**Datum:** 2026-08-07 (KW 32)

## Was ist seit dem letzten Eintrag passiert?

Das ist mein erster Eintrag hier, es gibt also noch keinen Vergleich. Kurzer Stand: In den letzten 14 Tagen kamen laut `git log` keine neuen Feature-Commits dazu (nur der IT-Chef-Bericht und ein Status-Snapshot für die PA-Website) — der nutzbare Flow ist weiterhin Start → KI-Chat → (toter Link zum Reiseplan). Ich habe mir die Chat-Logik, die Navigation und die Platzhalterseiten aus Nutzersicht angeschaut.

**Wichtiger Hinweis:** Es ist noch kein Analytics-Connector angebunden. Alles unten basiert auf Code/Doku-Lektüre, nicht auf echten Nutzerdaten — keine Absprungraten o.ä., die ich hier nenne, sind gemessen.

## Meine Vorschläge

1. **Das Nav-Menü verspricht mehr, als die App aktuell hält.** `src/lib/nav-config.ts` listet ~20 Menüpunkte mit sehr konkreten, verlockenden Texten ("Flüge vergleichen und buchen", "Automatische Angebotssuche", "Kostenübersicht und Auswertungen"). Klickt man drauf, landet man auf der immer gleichen `PlaceholderPage.tsx` mit dem Satz "wird als Nächstes gebaut". Für Nutzer:innen fühlt sich das nicht wie "im Aufbau", sondern wie "kaputt" an — vor allem, weil es keinen Weg zurück zum einzig funktionierenden Pfad (KI-Chat) gibt. Mein Vorschlag: entweder die Platzhalter-Menüpunkte vorerst ausblenden/als "bald verfügbar" kennzeichnen, oder die Platzhalterseite mit einem klaren CTA zurück zum Chat versehen.

2. **Der Such-Schritt im Chat wirkt wie eingefroren.** In `src/lib/ai/mockAdvisor.ts:108` sagt Travix: "Ich suche jetzt nach echten … Verbindungen und Unterkünften … sobald ich etwas Verifiziertes gefunden habe, zeige ich es dir." Das klingt nach einem laufenden, asynchronen Vorgang — real passiert aber nichts von selbst (kein Ladeindikator, kein Timer), die `quickReplies` sind leer (`src/lib/ai/mockAdvisor.ts:110`), und es geht erst weiter, wenn die Person selbst noch eine Nachricht tippt. Wer nicht weiß, dass er aktiv weitertippen muss, wartet vermutlich einfach — und denkt, die Suche hängt. Ein kurzer Hinweis ("Schreib mir kurz, wenn du bereit bist" o.ä.) oder ein automatischer Fortschritt nach ein paar Sekunden würde das auflösen.

3. **Chat-Abschluss führt aktuell in eine Sackgasse — genau im emotional wichtigsten Moment.** Nachdem jemand alle Fragen beantwortet hat, endet der Chat mit "Dein Reiseplan steht! Öffne den Reiseplan …", der Button verlinkt aber auf `/buchung`, was nur die leere `PlaceholderPage` zeigt (IT-Chef hat das technisch schon aufgenommen). Aus Support-Sicht ist das der Punkt, an dem am meisten Vertrauen verspielt wird: Leute investieren 5 Antworten in ihre Traumreise und werden dann mit einer leeren Seite "belohnt". Bis die echte Reiseplan-Seite steht, würde ich hier zumindest eine ehrliche Zwischenmeldung zeigen (z. B. "Dein Reiseplan wird gerade gebaut, wir melden uns") statt der generischen Platzhalter-Formulierung.

4. **Mikrofon-Fehler bleiben unsichtbar.** In `src/lib/ai/speech.ts:47` ist `recognition.onerror = onEnd` — verweigert jemand die Mikrofon-Berechtigung oder gibt es ein Aufnahmeproblem, verschwindet einfach nur der "Aufnahme läuft"-Zustand in `ChatInput.tsx`, ohne jede Erklärung. Wer nicht weiß, warum die Spracheingabe nichts aufgenommen hat, probiert es vermutlich mehrfach erfolglos. Eine kurze Fehlermeldung ("Mikrofon-Zugriff nicht möglich — bitte Berechtigung prüfen") würde unnötige Verwirrung und Support-Anfragen vermeiden.

_Letztes Update: 2026-08-07_
