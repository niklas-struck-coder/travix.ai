# Support-Chef Bericht

**Datum:** 2026-08-21

## Was ist seit dem letzten Eintrag (2026-08-19) passiert?

Am Code selbst hat sich für Nutzer:innen wenig verändert: Der IT-Chef hat
seitdem nur Testabdeckung ergänzt (Kalender, Warenkorb, mockAdvisor) und
neu die Profil-Seite gebaut — die vier zuvor gemeldeten Kernprobleme
(Flugsuche-Chat-Bug, Warenkorb ohne Checkout-Weg, Löschen ohne Rückfrage,
nicht unterscheidbarer duplizierter Reiseentwurf) sind alle weiterhin
unverändert im Code, mehrfach durch erneute Bug-Hunts bestätigt. Ich habe
diesmal tiefer in den Kalender, den Warenkorb und die neue Profil-Seite
geschaut und dabei neue, bisher nicht gemeldete Reibungspunkte gefunden.

## Meine Vorschläge

1. **Auf der neuen Profil-Seite gehen eingegebene Präferenzen schon beim
   Wegklicken verloren — nicht erst beim Neuladen.** `src/pages/Profil.tsx:21`
   hält die Auswahl nur in lokalem `useState`, ohne `localStorage` oder
   Speicherung. Weil jede Seite bei Routenwechsel komplett neu gemountet
   wird (`src/routes.tsx:44-66`), reicht schon ein Klick zu einer anderen
   Seite und zurück, um Reisestile, Budgetrahmen und Heimatflughafen
   wieder auf leer zu setzen — ganz ohne Warnung. Die Überschrift
   "Reisepräferenzen **verwalten**" weckt dabei die Erwartung einer
   echten Kontoeinstellung, was den Verlust noch unangenehmer macht. Ich
   würde hier kurzfristig zumindest einen Hinweistext ergänzen ("wird
   noch nicht gespeichert"), mittelfristig `localStorage` nutzen.

2. **Das Heimatflughafen-Feld im Profil ist an nichts angebunden und
   erklärt nicht, wofür es gut ist.** Anders als die drei anderen Felder
   auf `src/pages/Profil.tsx:127-143` fehlt hier jeder Hinweis, wofür der
   Wert verwendet wird — und eine Codesuche zeigt: aktuell nirgends,
   insbesondere nicht als Vorbelegung in der Flugsuche
   (`FlightWizard.tsx`), wo das der naheliegende Nutzen wäre. Es fehlt
   zudem jede Prüfung auf drei Zeichen, wie sie die Flugsuche selbst
   längst hat. Sobald das Feld angebunden wird, würde ich das kurz im
   Hilfetext erwähnen, wie bei den anderen Feldern.

3. **Der Kalender zeigt beim ersten Öffnen oft eine leere Ansicht, obwohl
   Reisen existieren.** `src/pages/Kalender.tsx:26-28` startet immer im
   aktuellen Kalendermonat statt im Monat der nächsten Reise. Bei den
   beiden Demo-Reisen (September, März) fällt am heutigen Datum keine in
   den angezeigten August — Nutzer:innen sehen ein leeres Gitter und
   müssen selbst raten, in welche Richtung sie weiterklicken müssen, um
   überhaupt eine Reise zu sehen. Vorschlag: beim Laden den Monat der
   nächstgelegenen Reise vorauswählen, falls im aktuellen Monat keine
   liegt.

4. **Im Warenkorb werden Positionen aus verschiedenen Reisen ohne jede
   Kennzeichnung vermischt.** `src/pages/Warenkorb.tsx:20-26` zeigt Demo-
   Positionen aus zwei Reisen (Lissabon, Kyoto) nebeneinander in derselben
   Gruppe — `groupCartItems` (`cartTotals.ts:20-25`) gruppiert nur nach
   Leistungstyp, nicht nach Reise. Wer mehrere Reisen parallel plant,
   sieht einen unsortierten Topf ohne Information, was zu welcher Reise
   gehört. Ein sichtbares Reiseziel-Label pro Position würde hier schon
   viel klarer machen, was zusammengehört.

_Letztes Update: 2026-08-21_
