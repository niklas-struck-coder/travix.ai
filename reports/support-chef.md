# Support-Chef Bericht

**Datum:** 2026-10-08

## Was ist seit dem letzten Eintrag (2026-10-07) passiert?

Einiges, vor allem an der Stelle, die ich am 07.10. selbst als offen
markiert hatte: Der neue Seitenwechsel-Sprung (`src/routes.tsx:54-56`,
seit 07.10. da) macht weiterhin nur `window.scrollTo(0, 0)` — der von
mir vorgeschlagene `focusPageHeading()`-Aufruf direkt daneben fehlt noch
unverändert. Gleicher Code, gleiche Lücke.

Der parallele, branch-basierte Support-Chef-Lauf hat heute den
Aktivitäten-Bearbeiten-Dialog (`EditMode.tsx`) genauer angeschaut, weil
IT-Chef dort zweimal nachgebessert hat: einmal die Disambiguierung
gleichnamiger Aktivitäten (`getActivityLabel()`) auf den
Lösch-Bestätigungsdialog ausgeweitet, einmal `isTripComplete()` so
korrigiert, dass Badge und Checkliste bei offenen Aktivitäten wieder
übereinstimmen. Dabei kam ein neuer, echter Fund heraus (siehe
Vorschlag 1) — IT-Chef hat ihn als Einzeiler bereits umgesetzt, der Fix
wartet aber noch als offener PR auf Review/Merge, ist also im Moment
live noch **nicht** sichtbar.

Meine Vorschläge 2 und 3 vom 07.10. (Zielname fehlt in "Start=Ziel"-
Meldung; uneinheitliche Lösch-Warnungen) sind unverändert offen, ich
habe sie heute im Code erneut nachgeprüft — gleiche Zeilen, gleicher
Stand.

## Meine Vorschläge

1. **Der heute gefundene Fix für mehrdeutige Aktivitätennamen ist fertig,
   aber noch nicht gemergt — lohnt sich, ihn zügig durchzuwinken.**
   `src/components/trip/EditMode.tsx:85` zeigt bei zwei gleichnamigen
   Aktivitäten (z. B. zweimal "Stadtführung") weiterhin den rohen Namen
   in der sichtbaren Zeile, obwohl das bereits berechnete, disambiguierte
   Label (`activityLabel`, Zeile 82) seit heute schon für den
   Lösch-Dialog und die `aria-label`s verwendet wird. Ich habe das
   selbst im laufenden Code nachvollzogen: Zwei Zeilen sehen optisch
   identisch aus, man erkennt erst beim Löschen, welche welche ist.
   [PR #28](https://github.com/niklas-struck-coder/travix.ai/pull/28)
   behebt genau das mit einem risikolosen Einzeiler
   (`{activity.name}` → `{activityLabel}`), ist aber noch offen (nicht
   gemergt). *Vorschlag:* PR #28 zeitnah mergen, dann ist diese Lücke
   geschlossen.

2. **Fokus-Sprung bei Seitenwechsel fehlt weiterhin — betrifft jetzt auch
   die neue Scroll-Stelle.** `src/routes.tsx:54-56` springt bei jedem
   Routenwechsel per `window.scrollTo(0, 0)` an den Seitenanfang, ruft
   aber nicht zusätzlich `focusPageHeading()`
   (`src/lib/utils.ts:14-27`, bereits mit `preventScroll: true` gebaut,
   würde also nicht kollidieren) auf. Wer über die Sidebar navigiert
   oder einen Link direkt aufruft, bekommt per Screenreader weiterhin
   keine Ansage, dass eine neue Seite da ist. *Vorschlag:* unverändert
   — `focusPageHeading()` direkt neben `window.scrollTo(0, 0)` in
   denselben `useEffect` aufnehmen.

3. **Fehlermeldung bei "Start = Ziel" im Flug-Chat nennt den Zielort
   nicht.** `src/hooks/useChat.ts:261` antwortet bei gleichem Abflug-
   und Zielflughafen weiterhin nur mit "Start und Ziel dürfen nicht
   gleich sein — welcher Flughafen ist dein Abflugort?". Die Nutzerin
   muss selbst zurückscrollen, um zu sehen, welchen Ort sie eingegeben
   hat. *Vorschlag:* Zielname/-code in die Nachricht aufnehmen.

4. **Lösch-Warnungen weiterhin unnötig einheitlich scharf.** Dieselbe
   scharfe "Das lässt sich nicht rückgängig machen"-Formulierung steht
   wortgleich in `Preisalarme.tsx:137`, `Warenkorb.tsx:134`,
   `Reiseentwuerfe.tsx:336/356` und `EditMode.tsx:151` — auch für leicht
   rückholbare Aktionen wie einen Preisalarm oder eine Warenkorb-Position
   entfernen. *Vorschlag:* die scharfe Formulierung für
   `Reiseentwuerfe.tsx` reservieren, bei den anderen eine ruhigere
   Formulierung wie "Du kannst [X] jederzeit wieder hinzufügen"
   verwenden.

_Letztes Update: 2026-10-08_
