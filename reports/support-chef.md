# Support-Chef Bericht

**Datum:** 2026-08-29

## Was ist seit dem letzten Eintrag (2026-08-28) passiert?

Einiges: Die beiden Dashboard-Punkte aus dem letzten Bericht sind
behoben (`src/pages/Dashboard.tsx` hat jetzt eigene `aria-label`s pro
Kachel und einen Hinweis "Ø über 2 Entwürfe"). Dazu kamen ein
Ehrlichkeits-Fix im Chat (Zug/Bus/Fähre/Mietwagen versprechen keine
Verbindungssuche mehr, die es nicht gibt), fehlende Enter-Unterstützung
im Aktivität-hinzufügen-Formular wurde ergänzt, und sechs bisher nur per
direkter URL erreichbare Seiten (Kalender, Karte, Aktivitäten, Angebote,
Favoriten, Preisalarme) sind jetzt über die Navigation auffindbar. Der
Chatflow-Text/Sidebar-Fund von gestern (Auto-Log) ist bereits an anderer
Stelle dokumentiert, deshalb hier nicht wiederholt. Beim Durchsehen des
heutigen Flug-Pfads und der Fehlerbehandlung bei der Unterkunftssuche
sind mir zwei eigene, bisher nicht gemeldete Reibungspunkte aufgefallen.

## Meine Vorschläge

1. **Wer im Chat "Flug" wählt, landet in einer Sackgasse ohne jeden
   Ausweg — nicht mal ein Button bleibt übrig.**
   `src/lib/ai/mockAdvisor.ts:122-130`: Sobald die Unterkunft gewählt ist
   und der Modus Flug ist, kündigt der Chat eine echte Flugsuche an
   ("Ich suche jetzt nach echten Flug-Verbindungen ... Nichts wird
   erfunden."), setzt dabei aber `quickReplies: []`. Anders als beim
   Nicht-Flug-Fall direkt darunter (`:132-139`, dort gibt es immerhin
   "Neue Reise planen" als Button) bekommt die Flug-Nutzerin gar keine
   Schaltfläche mehr angezeigt. Da `useChat.ts` die echte Flugsuche im
   Hauptablauf nie auslöst (nur über den separaten "Bearbeiten"-Pfad,
   das hat IT-Chef heute technisch schon gemeldet), bleibt der
   `TravixAvatar` dauerhaft im "searching"-Zustand hängen, ohne
   Fehlermeldung und ohne Knopf, um weiterzumachen. Aus Support-Sicht
   der schlimmere Teil des Problems: selbst wenn die Suche nie startet,
   sollte niemand ohne jeden nächsten Schritt dastehen.
   *Vorschlag:* Bis die Suche technisch nachgerüstet ist, wenigstens
   `quickReplies: ['Neue Reise planen']` auch im Flug-Fall mitgeben —
   eine Zeile Aufwand, verhindert aber, dass Nutzer:innen sich fragen,
   ob die App abgestürzt ist.

2. **Ein Suchfehler bei der Unterkunftssuche sieht für Nutzer:innen
   genauso aus wie "keine Unterkünfte gefunden" — beides zeigt dieselbe
   Meldung.**
   `src/hooks/useChat.ts:307-309`: Schlägt `searchStays(...)` fehl (z. B.
   Netzwerkfehler, API down), wird `stayOffers` einfach auf ein leeres
   Array gesetzt — genau wie bei einer echten Null-Treffer-Suche. In
   `src/components/search/HotelResults.tsx:24` führt das in beiden
   Fällen zur identischen Meldung "Keine Unterkünfte gefunden". Wer
   Lissabon plant und diese Meldung sieht, geht davon aus, dass es dort
   wirklich keine Unterkünfte gibt — dabei kann genauso gut nur die
   Suche gerade nicht erreichbar gewesen sein. Das untergräbt leise das
   Vertrauen in die "nichts wird erfunden"-Zusage aus der Begrüßung,
   weil ein technischer Fehler wie ein echtes (falsches) Ergebnis
   aussieht.
   *Vorschlag:* Im `.catch`-Zweig einen eigenen Fehlerzustand setzen
   (z. B. `stayOffers: null` plus eine separate Fehlermeldung à la
   "Die Unterkunftssuche hat gerade nicht geklappt, versuch's gleich
   nochmal"), statt ihn wie ein leeres Ergebnis zu behandeln.

_Letztes Update: 2026-08-29_
