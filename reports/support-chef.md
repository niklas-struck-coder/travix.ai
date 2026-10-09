# Support-Chef Bericht

**Datum:** 2026-10-09

## Was ist seit dem letzten Eintrag (2026-10-08) passiert?

Zwei meiner länger offenen Punkte sind heute tatsächlich live gegangen.
PR #28 ist gemergt: `src/components/trip/EditMode.tsx:85` zeigt bei zwei
gleichnamigen Aktivitäten jetzt das disambiguierte Label statt des rohen
Namens — die Zweideutigkeit beim Löschen ist weg. Und IT-Chef hat die
Fehlermeldung bei "Start = Ziel" im Flug-Chat ergänzt:
`src/hooks/useChat.ts:261` nennt den Zielort jetzt im Satz, man muss
nicht mehr zurückscrollen.

Der parallele, branch-basierte Support-Chef-Lauf hat heute außerdem einen
neuen, echten Fund dokumentiert, den ich selbst im Code nachvollzogen
habe: Die Demo-Karte "Lissabon" auf `/meine-reisen`
(`src/pages/MeineReisen.tsx:19`) hat einen aktiven Button "Urlaubsmodus
aktivieren", der aber nicht zu dieser Reise führt — `Urlaubsmodus.tsx:12`
liest das Reiseziel ausschließlich aus dem im KI-Chat gespeicherten Trip
(`loadStoredChat()`), nicht aus der Demo-Liste. Ohne eigenen Chat-Trip
landet man auf einer leeren Begrüßung, mit einem anderen Chat-Trip auf
dem falschen Reiseziel. Das ist bereits im autonomen Log festgehalten,
ich greife es hier nicht erneut als eigenen Vorschlag auf, sondern
erwähne es, weil es ein echter, anklickbarer Reibungspunkt auf einer
zentralen Seite ist.

Meine beiden übrigen Vorschläge vom 08.10. (Fokus-Sprung,
Lösch-Warnungen) sind unverändert offen — gleiche Zeilen, gleicher Stand.
Bei den Lösch-Warnungen habe ich heute zusätzlich zwei weitere Stellen
gefunden, die ich bisher nicht aufgelistet hatte.

## Meine Vorschläge

1. **Lösch-Warnungen sind jetzt an sieben Stellen unnötig einheitlich
   scharf formuliert — zwei neue Fundstellen.** Zusätzlich zu
   `EditMode.tsx:151`, `Preisalarme.tsx:137`, `Warenkorb.tsx:134` und
   `Reiseentwuerfe.tsx:336/356` nutzen auch `Favoriten.tsx:128` (Favorit
   entfernen) und `Aktivitaeten.tsx:118` (Aktivität entfernen) wortgleich
   "Das lässt sich nicht rückgängig machen." Für eine Reise löschen mag
   das passen — für einen Favoriten oder eine Preisalarm-Entfernung wirkt
   es unnötig alarmierend, weil beides sich ja einfach wieder anlegen
   lässt. *Vorschlag:* die scharfe Formulierung auf `Reiseentwuerfe.tsx`
   begrenzen, bei den anderen sechs Stellen eine ruhigere Formulierung
   wie "Du kannst [X] jederzeit wieder hinzufügen" verwenden.

2. **Fokus-Sprung bei Seitenwechsel fehlt weiterhin.**
   `src/routes.tsx:54-56` springt bei jedem Routenwechsel per
   `window.scrollTo(0, 0)` an den Seitenanfang, ruft aber nicht
   zusätzlich `focusPageHeading()` (`src/lib/utils.ts:14-27`, bereits mit
   `preventScroll: true` gebaut, würde also nicht kollidieren) auf. Wer
   über die Sidebar navigiert oder einen Link direkt aufruft, bekommt per
   Screenreader weiterhin keine Ansage, dass eine neue Seite da ist.
   *Vorschlag:* unverändert — `focusPageHeading()` direkt neben
   `window.scrollTo(0, 0)` in denselben `useEffect` aufnehmen.

3. **"Urlaubsmodus aktivieren" auf der Lissabon-Demokarte führt ins
   Leere oder zum falschen Ziel.** Siehe Einordnung oben —
   `MeineReisen.tsx:19-53` verlinkt auf `/urlaubsmodus`, dessen Inhalt
   aber aus einer komplett getrennten Datenquelle kommt
   (`tripStorage.ts` statt der lokalen `trips`-Liste). Das ist der
   naheliegendste Klickpfad auf einer zentralen Seite, nicht nur ein
   Randfall. *Vorschlag:* kurzfristig entweder den Button auf der
   Demo-Karte deaktivieren, oder `MeineReisen.tsx` dieselbe Datenquelle
   nutzen lassen wie `Buchung.tsx`.

_Letztes Update: 2026-10-09_
