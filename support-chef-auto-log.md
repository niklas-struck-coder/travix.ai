# Support-Chef Auto-Log

Automatisch geschriebener Bericht aus dem täglichen autonomen
Support-Chef-Lauf (`.claude/skills/support-chef-eigen/SKILL.md`,
Abschnitt "Autonomer Tagesmodus"). Reine Analyse — kein Code wird von
diesem Lauf geändert.

---

## 2026-08-10 — Flugsuche (`/flugsuche`)

**Geprüfter Bereich:** Die Flugsuche-Seite und die zugehörigen
Komponenten, die laut `ZEITPLAN.md` zuletzt vom autonomen IT-Chef-Lauf
gebaut und heute (Commit `788d0e4`) nach `main` gemergt wurden — Aufgabe
5.11 "Flugauswahl in Trip-Transport-Sektion integrieren":

- `src/pages/Flugsuche.tsx`
- `src/components/search/FlightWizard.tsx`
- `src/components/search/FlightCard.tsx`
- `src/lib/duffel/client.ts`
- `src/lib/trip/tripStorage.ts`

### Reibungspunkte

**1. Kein Ladezustand in der Ergebnisliste während der Suche**
`src/pages/Flugsuche.tsx:19-27` und `:75-81`: Beim Klick auf "Flüge
suchen" wird `loading` zwar gesetzt und der Such-Button zeigt "Suche
läuft …" (`FlightWizard.tsx:138-141`), aber die vorherigen `offers`
werden dabei nicht zurückgesetzt (`setOffers` wird erst nach Rückkehr des
Requests aufgerufen). Solange die Anfrage läuft, sieht die Seite für
Nutzer:innen unverändert aus — alte Ergebniskarten bleiben stehen, ohne
sichtbaren Hinweis, dass gerade eine neue Suche läuft. Das ist
inkonsistent zur Zugsuche: `TrainResults.tsx:14-20` zeigt während der
Suche explizit einen freundlichen Ladezustand mit Avatar ("Travix sucht
echte Zug-, Bus- und Fährverbindungen …"). Nutzer:innen könnten bei der
Flugsuche denken, ihr Klick hat nicht funktioniert, und nochmal klicken.

*Vorschlag:* `setOffers(null)` (oder eine eigene `searching`-Anzeige
analog zu `TrainResults`) beim Start von `handleSearch` ergänzen, damit
die Ergebnisfläche während des Ladens erkennbar "sucht" statt
stillzustehen.

**2. Rohe/technische Fehlermeldungen der Duffel-API direkt angezeigt**
`src/lib/duffel/client.ts:15-33`: Bei einem Fehler von der Duffel-API
wird `json?.errors` unverändert durchgereicht (nur der generische
Fallback-Fall auf Zeile 24 ist deutscher Text). `Flugsuche.tsx:40-49`
zeigt `error.message` dann 1:1 im UI an. Duffel-Fehlermeldungen sind auf
Englisch und oft auf API-Feldnamen bezogen (z. B. Validierungsfehler zu
`slices` oder `passengers`) — für eine deutschsprachige Nutzerin ohne
technischen Hintergrund wirkt das verwirrend statt hilfreich,
insbesondere weil der Rest der App durchgängig deutsche, freundliche
Texte verwendet (vgl. `NoResultsMessage`, `TrainResults`).

*Vorschlag:* Häufige Duffel-Fehlercodes auf verständliche deutsche
Meldungen abbilden (z. B. "Bitte prüfe Datum und Flughafencode"), mit dem
rohen `error.message` nur als Fallback für unbekannte Fälle.

**3. Flughafen-Eingabe verlangt exakten 3-stelligen IATA-Code ohne Hilfe**
`src/components/search/FlightWizard.tsx:60-83`: "Von"/"Nach" sind reine
Textfelder mit Placeholder `BER`/`LIS` — es gibt keine Autovervollständigung
oder Städtenamen-Suche. Wer den IATA-Code seines Wunschziels nicht
auswendig kennt, muss ihn selbst nachschlagen. Der Such-Button bleibt bei
weniger als 3 Zeichen einfach deaktiviert (`isValid`, Zeile 31-35), ohne
jede Erklärung, warum — kein Hinweistext wie "Bitte 3-stelligen
Flughafencode eingeben". Das ist ein stiller Stolperstein: Nutzer:innen
sehen nur einen Button, der nicht reagiert, statt einen Hinweis, was
fehlt.

*Vorschlag:* Kurzfristig zumindest einen kleinen Hinweistext unter den
Feldern ergänzen ("3-Buchstaben-Flughafencode, z. B. BER für Berlin").
Mittelfristig wäre eine Autovervollständigung mit Städtenamen (wie es
vermutlich für die Hotelsuche bereits existiert) der größere Gewinn,
aber das ist über den Rahmen dieses reinen Analyse-Laufs hinaus — kein
Codevorschlag hierfür in diesem Log.

### Nicht geprüft
Die neuen Zug/Bus/Fähre-Komponenten (`TrainCard.tsx`, `TrainResults.tsx`,
Aufgaben 5.4/5.5) sind laut `ZEITPLAN.md` zwar gebaut und gemergt, aber
noch in keine Seite eingebunden (5.7 offen) — es gibt aktuell keinen
erreichbaren Nutzerpfad dorthin, daher keine UX-Prüfung möglich, bis sie
angebunden sind.

---

## 2026-08-11 — Kartenansicht (`/karte`)

**Geprüfter Bereich:** Die Kartenansicht-Seite, laut `ZEITPLAN.md` heute
(Aufgabe 7.14) vom autonomen IT-Chef-Lauf gebaut und bereits nach `main`
gemergt (Commit `14dd7f6`, gemerged in `4c253a9`):

- `src/pages/Kartenansicht.tsx`
- `src/lib/nav-config.ts` (Einbindung in die Navigation)
- `src/routes.tsx` (Route `/karte`)

Zum Vergleich herangezogen: `src/pages/MeineReisen.tsx` (etablichtes
Karten-Muster auf anderen Trip-Lifecycle-Seiten).

### Reibungspunkte

**1. Karten in der Liste unter der Karte sind reine Anzeige, kein Klickziel**
`src/pages/Kartenansicht.tsx:56-69`: Jede `Card` zeigt Reiseziel und Datum,
aber anders als bei `MeineReisen.tsx:30-61` — wo jede Trip-Karte einen
"Urlaubsmodus aktivieren"-Button (`Link to="/urlaubsmodus"`) bzw. bei
abgeschlossenen Reisen einen Status-Hinweis hat — gibt es hier weder
Link noch Button. Nutzer:innen sehen ihr Reiseziel auf der Karte, können
aber nicht weiterklicken, um die Reise zu öffnen oder etwas damit zu tun.
Das bricht mit dem Muster, das die anderen Trip-Lifecycle-Seiten
(`MeineReisen.tsx`, laut `ZEITPLAN.md` auch `Reiseentwuerfe.tsx` mit
"Planung fortsetzen") bereits etabliert haben: eine Karte mit
Reisedaten ist überall sonst gleichzeitig ein Einstiegspunkt in die
nächste Aktion.

*Vorschlag:* Analog zu `MeineReisen.tsx:48-53` zumindest einen Link auf
`/meine-reisen` oder — bei bevorstehenden Reisen — auf `/urlaubsmodus`
ergänzen, solange es noch keine eigene Detailseite pro Reise gibt.

**2. Anfangsansicht der Karte ist nicht auf die tatsächlichen Marker
zentriert**
`src/pages/Kartenansicht.tsx:40`: `MapContainer` startet fest bei
`center={[20, 20]}` und `zoom={2}` statt die Sicht anhand der
`destinations`-Koordinaten zu berechnen (z. B. mit Leaflet
`fitBounds`). Bei den aktuellen Demo-Zielen Lissabon (38.7, -9.1) und
Kyoto (35.0, 135.8) — nahezu gegenüberliegende Seiten des Globus — sind
beide Marker bei diesem Zoomlevel nur winzige Punkte auf der
Weltkarte; Nutzer:innen müssen erst selbst manuell zoomen/pannen, um zu
erkennen, wo ihre Reiseziele überhaupt liegen. Der feste Mittelpunkt
`[20, 20]` steht in keinem Bezug zu den Zielen selbst.

*Vorschlag:* Kartenausschnitt beim Laden automatisch auf die
Marker-Bounds setzen (`map.fitBounds(...)` bzw. die entsprechende
react-leaflet-API), statt eines festen, ortsunabhängigen
Start-Zooms.

**3. Popup auf der Karte zeigt weniger Information als die Liste darunter**
`src/pages/Kartenansicht.tsx:47`: Der `Popup`-Inhalt beim Anklicken
eines Markers ist nur `{d.destination}` — ohne das Reisedatum, das die
Karte darunter (`:62-65`) direkt anzeigt. Wer über die Karte selbst
navigiert (statt über die Liste), bekommt beim Klick auf einen Marker
also weniger Kontext als jemand, der nur die Liste liest.

*Vorschlag:* Datum im Popup ergänzen (`{d.destination}` +
`{d.dates}`), damit beide Ansichten denselben Informationsstand zeigen.

### Nicht geprüft
Da `destinations` aktuell fest im Code steht (zwei Demo-Ziele, siehe
`:19-22`) und nie leer ist, wurde ein Leerzustand ("keine Reiseziele")
nicht geprüft — dafür gibt es aktuell keinen erreichbaren Zustand.

---

## 2026-08-12 — Angebote (`/angebote`)

**Geprüfter Bereich:** Die Angebote-Seite, laut `ZEITPLAN.md` heute Nacht
(Aufgabe 7.8) vom autonomen IT-Chef-Lauf gebaut und bereits nach `main`
gemergt (Commit `de79e51`, gemerged in `8c08b04`):

- `src/pages/Angebote.tsx`
- `src/pages/Angebote.test.tsx`
- `src/routes.tsx` (Route `/angebote`), `src/lib/nav-config.ts` (Navigation)

Zum Vergleich herangezogen: `src/pages/Favoriten.tsx` und
`src/pages/Preisalarme.tsx` — beide laut `ZEITPLAN.md` nach demselben
Karten-Grid-Muster gebaut wie `Angebote.tsx`.

### Reibungspunkte

**1. Angebots-Karten haben keinen Handlungs-Button — nur Entfernen**
`src/pages/Angebote.tsx:80-113`: Jede Karte zeigt Typ, Ziel, Zusammenfassung
und Preis, aber die einzige Interaktion ist der Entfernen-Button (`X`,
Zeile 97-106). Anders als bei `Favoriten.tsx:96-101`, wo jede Karte einen
"Reise mit KI planen"-Button (`Link to="/ki-chat"`) hat, gibt es hier
keinen Weg, ein gespeichertes Angebot weiterzuverfolgen — nur wieder zu
löschen. Für eine Seite, deren Zweck laut Leerzustand
(`Angebote.tsx:60-62`: "Finde Flüge oder Unterkünfte und speichere sie
hier, um sie später wiederzufinden") gerade das Wiederfinden und
Weiterverfolgen ist, fehlt der naheliegendste nächste Schritt. Das bricht
mit dem Muster, das `Favoriten.tsx` für dieselbe Karten-Grid-Struktur
bereits etabliert hat.

*Vorschlag:* Analog zu `Favoriten.tsx:96-101` einen Button/Link pro
Karte ergänzen (z. B. "Weiter planen" → `/ki-chat`, oder je nach
`offerType` gezielt zu `/flugsuche` bzw. einer künftigen Hotelsuche-Seite),
solange es noch keine eigene Detail-/Buchungsseite pro Angebot gibt.

**2. `formatPrice` zeigt bei anderen Währungen als EUR nur den rohen
Code statt eines Symbols**
`src/pages/Angebote.tsx:42-44`: Die Funktion prüft nur explizit auf
`'EUR'` (`€`) und gibt für jede andere Währung den rohen ISO-Code
zurück, z. B. `"610 USD"` statt `"$610"` oder `"610 US$"`. Mit den
aktuellen zwei Demo-Angeboten (beide EUR) fällt das nicht auf, aber
sobald echte Duffel-Angebote in Fremdwährung gespeichert werden (wie es
laut `ZEITPLAN.md` bei der echten Flug-/Hotelsuche bereits vorkommt),
wirkt die Preisanzeige technischer und weniger vertrauenswürdig als der
Rest der App.

*Vorschlag:* Auf eine kleine Währungs-Symbol-Tabelle erweitern (EUR,
USD, GBP als nächstwahrscheinlichste) oder — robuster — `Intl.NumberFormat`
mit `style: 'currency'` verwenden, das Locale und Symbol automatisch
korrekt kombiniert.

**3. Entfernen ist sofort und endgültig, ohne Rückfrage oder Rückgängig-Option**
`src/pages/Angebote.tsx:49-51`: Ein Klick auf den `X`-Button entfernt das
Angebot sofort aus dem State — kein Bestätigungsdialog, kein
"Rückgängig"-Hinweis (z. B. per Toast). Dasselbe Muster gibt es zwar
auch bei `Favoriten.tsx` und `Preisalarme.tsx`, aber bei gespeicherten
Angeboten mit konkretem Preis ist ein versehentlicher Klick (gerade auf
Mobilgeräten, wo Karten dichter beieinander liegen) potenziell teurer
rückgängig zu machen — die Nutzerin muss das Angebot erneut suchen und
den ursprünglichen Preis unter Umständen nicht mehr finden.

*Vorschlag:* Kurzfristig zumindest ein kurzes "Rückgängig"-Toast nach
dem Entfernen (z. B. 5 Sekunden Zeitfenster), das den State
zurücksetzt — kein vollständiger Bestätigungsdialog nötig, der bei einer
reinen Merkliste eher Reibung erzeugen würde.

### Nicht geprüft
`Preisalarme.tsx` wurde nur zum Mustervergleich herangezogen, nicht
eigenständig neu geprüft — es war laut Log bereits Teil des Vergleichs
in einem früheren Durchlauf nicht enthalten, aber selbst kein heute neu
gebauter Bereich (gebaut am 12.08., aber vor `Angebote.tsx`, siehe
Commit-Zeitstempel `db7fb94` vs. `de79e51`). Eine eigene Prüfung von
`Preisalarme.tsx` steht für einen künftigen Lauf noch aus.
