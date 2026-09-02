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

---

## 2026-08-17 — Aktivitäten (`/aktivitaeten`)

**Geprüfter Bereich:** Die neue Aktivitäten-Seite, laut `ZEITPLAN.md`
heute Nacht (Aufgabe 7.13) vom autonomen IT-Chef-Lauf gebaut und bereits
nach `main` gemergt (Commit `33f5153`, gemerged in `35b2cdc`):

- `src/pages/Aktivitaeten.tsx`
- `src/pages/Aktivitaeten.test.tsx`
- `src/routes.tsx` (Route `/aktivitaeten`), `src/lib/nav-config.ts` (Navigation)

Zum Vergleich herangezogen: `src/pages/Favoriten.tsx` (etabliertes
Karten-Grid-Muster mit Handlungs-Button pro Karte) sowie
`src/components/trip/EditMode.tsx` (die andere, am selben Tag gebaute
Aktivitäten-Funktion, Aufgabe 6.12).

### Reibungspunkte

**1. Aktivitäten hier sind komplett getrennt von den echten, im
Buchungs-Editiermodus verwalteten Aktivitäten**
`src/pages/Aktivitaeten.tsx:19-24` hält seine eigene, fest im Code
stehende `initialActivities`-Liste (vier Demo-Einträge). Am selben Tag
wurde aber `src/components/trip/EditMode.tsx` gebaut (Aufgabe 6.12), mit
dem Nutzer:innen in `Buchung.tsx` echte Aktivitäten zu ihrer laufenden
Reise hinzufügen, entfernen und im Preis anpassen können — gespeichert
über `updateStoredTrip()` im tatsächlichen Trip (`TripActivity[]`, siehe
`src/types/chat.ts:12-16`). Beide Datenquellen berühren sich nirgends:
Wer in der Buchung eine Aktivität hinzufügt, sieht sie auf
`/aktivitaeten` nicht auftauchen; wer auf `/aktivitaeten` eine
Demo-Aktivität entfernt, ändert nichts an der echten Reise. Für eine
Seite, die sich laut Navigation (`src/lib/nav-config.ts:84`) als "Alle
geplanten Aktivitäten" präsentiert, ist das ein Widerspruch zwischen
Versprechen und Inhalt, der bei echten Nutzerdaten sofort auffallen
würde.

*Vorschlag:* Sobald `/aktivitaeten` an echte Trip-Daten angebunden wird,
dieselbe `TripActivity[]`-Quelle verwenden wie `EditMode.tsx`
(aggregiert über alle im `tripStorage` gespeicherten Trips), statt einer
eigenen, unabhängigen Demo-Liste.

**2. Keine Handlungsmöglichkeit pro Karte — nur Entfernen**
`src/pages/Aktivitaeten.tsx:70-83`: Jede Karte zeigt Ziel-Badge, Name und
optionalen Preis, aber die einzige Interaktion ist der Entfernen-Button
(`X`, Zeile 76-84). Anders als bei `Favoriten.tsx:96-101`, wo jede Karte
einen "Reise mit KI planen"-Button (`Link to="/ki-chat"`) hat, gibt es
hier keinen Weg, von einer Aktivität aus zur zugehörigen Reise oder zum
Weiterplanen zu kommen — dasselbe Muster, das bereits am 12.08. bei
`Angebote.tsx` aufgefallen ist und sich hier wiederholt.

*Vorschlag:* Analog zu `Favoriten.tsx` einen Button/Link pro Karte
ergänzen (z. B. zur zugehörigen Reise oder zu `/ki-chat`), solange es
noch keine eigene Detailseite pro Aktivität gibt.

**3. Ziel-Badge ist reiner Text ohne Verknüpfung zur Reise**
`src/pages/Aktivitaeten.tsx:73`: Der `Badge` mit dem Reiseziel (z. B.
"Lissabon") ist nicht klickbar — anders als der Rest der Karte keine
Möglichkeit, von der Aktivität aus zur zugehörigen Reise zu
springen. Bei aktuell zwei Zielen fällt das kaum auf, aber sobald echte
Nutzer:innen Aktivitäten über mehrere Reisen hinweg sammeln, fehlt der
naheliegendste Filter- bzw. Navigationspfad ("zeig mir die ganze
Lissabon-Reise").

*Vorschlag:* Badge als Link auf die zugehörige Reise (z. B.
`/meine-reisen` oder künftig eine Detailseite pro Reise) umsetzen,
sobald Aktivitäten wirklich einer Reise zugeordnet sind (siehe Punkt 1).

### Nicht geprüft
`EditMode.tsx` selbst (Aufgabe 6.12) wurde nur zum Vergleich
herangezogen, nicht eigenständig als UX-Fläche geprüft — das steht für
einen künftigen Lauf noch aus, ebenso wie die am selben Tag gebauten
Entwurfs-Aktionen (7.3, `Reiseentwuerfe.tsx`).

---

## 2026-08-18 — Aktivitäten-Bearbeiten-Dialog (`EditMode.tsx`)

**Geprüfter Bereich:** `src/components/trip/EditMode.tsx` (Aufgabe 6.12,
am 17.08. vom autonomen IT-Chef-Lauf gebaut), inklusive seiner Einbindung
in `src/pages/Buchung.tsx:242-252` (`handleActivitiesChange`,
`src/pages/Buchung.tsx:140-143`). Im letzten Lauf (17.08., Aktivitäten-
Seite) als noch offen vermerkt — dieser Lauf holt das nach. Zum Vergleich
herangezogen: `src/pages/Angebote.tsx:49-51` (dort bereits als
Reibungspunkt "Entfernen ist sofort und endgültig" dokumentiert, 12.08.).

### Reibungspunkte

**1. Enter-Taste im "Neue Aktivität"-Feld tut nichts**
`src/components/trip/EditMode.tsx:89-111`: Die Eingabefelder für Name und
Preis stehen in einem reinen `<div>`, nicht in einem `<form>`, und haben
keinen `onKeyDown`-Handler. Wer nach dem Ausfüllen des Namensfelds
gewohnheitsmäßig Enter drückt (das naheliegendste Verhalten bei einem
kleinen Formular in einem Dialog), löst nichts aus — `addActivity()` wird
ausschließlich durch den kleinen "+"-Icon-Button (Zeile 108-110)
angestoßen. Das fällt besonders auf, weil der Dialog selbst über Escape
schließbar ist, Enter im Eingabefeld aber keine entsprechende Wirkung hat.

*Vorschlag:* `onKeyDown`-Handler auf dem Namensfeld ergänzen, der bei
Enter `addActivity()` aufruft (analog zu vielen anderen kleinen
"Hinzufügen"-Formularen), oder die beiden Felder in ein `<form
onSubmit={...}>` mit `event.preventDefault()` einbetten.

**2. Entfernen ist sofort, endgültig und wird sofort in die echte Reise
gespeichert — ohne Bestätigung oder Rückgängig-Option**
`src/components/trip/EditMode.tsx:76-83`: Ein Klick auf den
`Trash2`-Button entfernt die Aktivität sofort aus dem `activities`-Array
und ruft über `onChange` direkt `handleActivitiesChange` in
`Buchung.tsx:140-143` auf, was wiederum `updateStoredTrip()` aufruft —
die Änderung ist augenblicklich dauerhaft im gespeicherten Trip
verankert, kein Zwischenzustand. Das gleiche grundsätzliche Muster wurde
bereits am 12.08. bei `Angebote.tsx:49-51` bemängelt, ist hier aber
gewichtiger: Bei Angeboten geht nur ein gemerkter Vorschlag verloren, den
man erneut suchen kann. Hier geht eine bereits geplante, ggf. mit Preis
versehene Aktivität der tatsächlichen Reise verloren — ein
Wiederherstellen bedeutet, sich an Name und Preis zu erinnern und beides
manuell neu einzutippen.

*Vorschlag:* Mindestens ein kurzes "Rückgängig"-Toast nach dem Entfernen
(analog zum Vorschlag bei `Angebote.tsx`), hier aber mit höherer
Priorität, da der Datenverlust für Nutzer:innen konkreter ist als bei
einer reinen Merkliste.

**3. Preisfeld ist reiner Freitext ohne Währungseinheit oder Format-Hinweis**
`src/components/trip/EditMode.tsx:69-75` und `:100-106`: Sowohl das
Preisfeld pro bestehender Aktivität als auch das Feld für eine neue
Aktivität sind einfache Text-`Input`s mit Platzhaltern ("Preis" bzw.
"optional") ohne Währungssymbol, Formatierung oder Validierung — es lässt
sich buchstäblich beliebiger Text eingeben, nicht nur Zahlen. Die
Kostenübersicht der Buchungsseite (6.6/6.7, laut `ZEITPLAN.md` noch
offen) wird auf diesen Werten aufbauen müssen; ohne ein einheitliches
Format wird eine spätere Summierung fehleranfällig.

*Vorschlag:* Zumindest `inputMode="decimal"` und ein sichtbares
Währungssymbol (z. B. "€" als Präfix/Suffix im Feld) ergänzen, auch ohne
volle Validierung — das macht die Eingabe für Nutzer:innen eindeutiger
und bereitet 6.6/6.7 vor.

### Nicht geprüft
Die Kostenübersicht selbst (6.6/6.7) existiert noch nicht und konnte
daher nicht mitgeprüft werden. `Reiseentwuerfe.tsx` (7.3) bleibt weiterhin
für einen künftigen Lauf offen.

---

## 2026-08-19 — Entwurfs-Aktionen (`Reiseentwuerfe.tsx`)

**Geprüfter Bereich:** `src/pages/Reiseentwuerfe.tsx` (`/entwuerfe`),
Aufgabe 7.3 "Entwurfs-Aktionen: pausieren, duplizieren, abschließen,
löschen" — laut `ZEITPLAN.md` am 16.08. vom autonomen IT-Chef-Lauf
gebaut und bereits nach `main` gemergt, seither in keinem früheren
Support-Chef-Lauf eigenständig geprüft (im Eintrag vom 18.08. als offen
vermerkt). Heutiger IT-Chef-Auto-Lauf (`ee32a5d`, `0be928a`) hat nur
stale Checkboxen korrigiert, keinen neuen Code gebaut — deshalb dieser
Bereich statt eines "heute neu gebauten". Zum Vergleich herangezogen:
`src/components/trip/EditMode.tsx` (bereits am 18.08. geprüft, gleiches
Muster bei sofortigem, unbestätigtem Löschen).

### Reibungspunkte

**1. Löschen ist sofort und endgültig, ohne Bestätigung oder Rückgängig**
`src/pages/Reiseentwuerfe.tsx:90-92` (`deleteDraft`) entfernt den Entwurf
direkt aus dem State, ausgelöst über den `Trash2`-Button in Zeile
191-200 — kein Bestätigungsdialog, kein Rückgängig-Toast. Anders als bei
`Angebote.tsx` (12.08. bereits bemängelt) oder `EditMode.tsx` (18.08.)
ist hier der Verlust potenziell größer: Der Lissabon-Demo-Entwurf hat
bereits Transportmittel, Budget und Reisedatum ausgefüllt (60 %
Fortschritt laut `calculateProgress`), das ist reale Planungsarbeit, die
ohne Rückfrage weg ist. Dasselbe grundsätzliche Muster wiederholt sich
damit zum dritten Mal an drei verschiedenen Stellen im Code.

*Vorschlag:* Wie bei den vorherigen Funden — mindestens ein
"Rückgängig"-Toast nach dem Löschen. Da sich das Muster jetzt an
mehreren Stellen wiederholt (Angebote, EditMode, hier), könnte sich ein
gemeinsamer kleiner Hook/Komponente (z. B. `useUndoableRemove`) lohnen,
statt es dreimal einzeln nachzurüsten.

**2. "Planung fortsetzen" bleibt auch bei abgeschlossenen Entwürfen stehen**
`src/pages/Reiseentwuerfe.tsx:154-156`: Der "Planung fortsetzen"-Button
wird unabhängig vom Status gerendert — auch nachdem `finalizeDraft`
(Zeile 74-78) den Status auf "Abgeschlossen" gesetzt hat (Badge-Label in
Zeile 23, `statusLabels.finalized`). Der Button verlinkt immer nur auf
`/ki-chat` ohne jeden Kontext zum Entwurf. Laut `ZEITPLAN.md` (Sprint 3,
7.3) verschiebt "Abschließen" den Entwurf bewusst noch nicht nach
`MeineReisen.tsx` — für Nutzer:innen sieht ein abgeschlossener Entwurf
also weiterhin wie ein aktiver aus, mit einem Button, der zur Planung
"fortsetzen" einlädt, obwohl sie laut Badge bereits fertig ist. Das
widerspricht sich sichtbar auf derselben Karte.

*Vorschlag:* Für `status === 'finalized'` den Button-Text/-Ziel anpassen
(z. B. "Reise ansehen" statt "Planung fortsetzen", sobald es eine
Zielseite dafür gibt) oder ihn zumindest deaktivieren/ausblenden, bis
abgeschlossene Entwürfe wirklich irgendwo landen.

**3. Duplizierte Karte ist von der Originalkarte nicht unterscheidbar**
`src/pages/Reiseentwuerfe.tsx:80-88` (`duplicateDraft`) übernimmt
Ziel, Farbverlauf und Trip-Daten 1:1 in die Kopie, nur die `id` ist neu.
Beide Karten zeigen danach identischen Namen ("Lissabon"), identischen
Fortschritt (60 %) und identischen Status ("In Bearbeitung") direkt
nebeneinander im Grid (Zeile 117-206) — ohne Kennzeichnung wie "Kopie"
oder Zeitstempel und ohne jede Rückmeldung (kein Toast, kein
Hervorheben, kein Scrollen zur neuen Karte), dass überhaupt etwas
passiert ist. Der zugehörige Test (`Reiseentwuerfe.test.tsx:51-61`)
bestätigt genau dieses Verhalten als Ist-Zustand. Bei zwei Karten fällt
das kaum auf, bei mehreren duplizierten Entwürfen wird schwer
erkennbar, welche Karte die neue ist und welche das Original.

*Vorschlag:* Der Kopie einen sichtbaren Zusatz geben (z. B. "Lissabon
(Kopie)") und/oder kurz zur neuen Karte scrollen bzw. sie kurz
hervorheben, damit die Aktion spürbar eine Wirkung hatte.

### Nicht geprüft
Die Vergleichsstelle `EditMode.tsx` wurde nur zum Musterabgleich
herangezogen, nicht erneut vollständig geprüft (bereits am 18.08.
behandelt). `Preisalarme.tsx` bleibt weiterhin für einen künftigen Lauf
offen (seit dem Eintrag vom 12.08. unerledigt).

---

## 2026-08-20 — Reisekalender (`/kalender`)

**Geprüfter Bereich:** Die Kalender-Seite, laut `ZEITPLAN.md` am 17.08.
vom autonomen IT-Chef-Lauf gebaut (Aufgabe 7.11) und bereits nach `main`
gemergt — bisher nur einmal kurz in `reports/support-chef.md` als
"Demo-Daten-Muster" erwähnt, aber noch nie in diesem Log mit
Dateibezug geprüft:

- `src/pages/Kalender.tsx`
- `src/lib/trip/calendarUtils.ts`

Zum Vergleich herangezogen: `src/pages/MeineReisen.tsx` und
`src/pages/Reiseentwuerfe.tsx` (etabliertes Muster: Reisekarte = auch
Einstiegspunkt in die nächste Aktion) sowie der frühere Eintrag zu
`Kartenansicht.tsx` (11.08., dasselbe fehlende Klickziel-Problem).

### Reibungspunkte

**1. Beim ersten Aufruf zeigt der Kalender eine leere Ansicht, obwohl
Reisen existieren**
`src/pages/Kalender.tsx:26-28`: Der Kalender startet immer im
*aktuellen* Monat (`today.getFullYear()`/`today.getMonth()`). Die beiden
Demo-Reisen liegen laut `:21-22` aber im September 2026 (Lissabon,
15.–22.9.) und im März 2026 (Kyoto, 3.–10.3.) — bei heutigem Datum
(20.08.2026) fällt also keiner der beiden Trips in den initial
angezeigten Monat August. Ergebnis: Wer die Seite öffnet, sieht ein
komplett leeres Gitter ohne einen einzigen hervorgehobenen Tag
(`cellTrips.length > 0`-Styling in `:109` greift nirgends), und muss
erst selbst raten und über "→" so lange weiterklicken, bis der
nächste Trip auftaucht. Nur die textliche Liste darunter (`:129-139`)
verrät überhaupt, dass es Reisen gibt — die eigentliche Kalenderfläche,
der Hauptzweck der Seite, wirkt beim Einstieg wie leer/fehlerhaft.

*Vorschlag:* Beim Laden nicht stur den heutigen Monat wählen, sondern
den Monat der nächstgelegenen (kommenden oder zuletzt aktiven) Reise
vorauswählen, falls im aktuellen Monat keine Reise liegt — z. B. über
`trips[0].startDate` bzw. den nächsten Trip mit `startDate >= todayIso`.

**2. Trip-Badges im Gitter und die Karten in der Liste darunter sind
reine Anzeige, kein Klickziel**
`src/pages/Kalender.tsx:114-118` (Badge je Tageszelle) und `:129-139`
(Karten in der Liste): Beide zeigen nur Zielname bzw. Zielname+Datum an,
ohne `Link` oder Button. Das ist dieselbe Lücke, die dieses Log bereits
am 11.08. bei `Kartenansicht.tsx` gefunden hat, und bricht mit dem
Muster, das `MeineReisen.tsx:48-53` etabliert (dort führt jede
Trip-Karte per Link weiter, z. B. zu `/urlaubsmodus`). Wer im Kalender
auf eine Reise klickt oder tippt, erwartet an dieser Stelle in einer
App mit sonst durchgängig interaktiven Reisekarten mindestens eine
Reaktion — hier passiert nichts.

*Vorschlag:* Analog zu `MeineReisen.tsx` einen Link pro Kalender-Karte
ergänzen (z. B. zu `/meine-reisen` oder künftig zur Trip-Detailseite),
solange es noch keine eigene Detailroute pro Reise gibt.

**3. Monatswechsel wird für Screenreader-Nutzer:innen nicht angekündigt**
`src/pages/Kalender.tsx:74-82` (Vor-/Zurück-Buttons) ändern den
sichtbaren Monatstitel in `:89` (`formatMonthLabel(year, month)`), aber
weder der Titel noch das umgebende `Card` haben ein `aria-live`-Attribut
oder eine `role="status"`. Für sehende Nutzer:innen ist der
Monatswechsel offensichtlich, für Screenreader-Nutzer:innen dagegen
unsichtbar — nach einem Klick auf "→" bleibt unklar, ob überhaupt etwas
passiert ist, ohne den Fokus manuell zum Titel zu bewegen. Codebase-weit
gibt es aktuell kein einziges `aria-live` (Suche über `src/` ergab
keinen Treffer), das ist also kein Einzelfall nur hier, aber am
Kalender mit seiner rein visuellen Zustandsänderung besonders spürbar.

*Vorschlag:* `aria-live="polite"` auf den Monatstitel (`:89`) setzen,
damit Screenreader die neue Monatsbezeichnung automatisch vorlesen.

### Nicht geprüft
Überlappende Reisen am selben Tag (`getTripsForDay` in
`calendarUtils.ts:69-71` erlaubt das grundsätzlich) wurden nicht
geprüft, da die beiden Demo-Reisen sich zeitlich nicht überschneiden —
dafür gibt es aktuell keinen erreichbaren Zustand.

---

## 2026-08-20 (zweiter Lauf) — Warenkorb (`/warenkorb`)

**Geprüfter Bereich:** `src/pages/Warenkorb.tsx` und
`src/lib/trip/cartTotals.ts`, laut `ZEITPLAN.md` (Aufgabe 7.6) am 17.08.
vom autonomen IT-Chef-Lauf gebaut und bereits nach `main` gemergt — der
gestrige IT-Chef-Auto-Lauf hat dort nur Testabdeckung ergänzt
(`Warenkorb.test.tsx`), keinen neuen Code gebaut; dieser Bereich war
bisher in keinem früheren Support-Chef-Lauf mit Dateibezug geprüft. Zum
Vergleich herangezogen: die bereits mehrfach dokumentierten
Löschen-ohne-Rückfrage-Fälle (`Angebote.tsx` 12.08.,
`Reiseentwuerfe.tsx` 19.08., `EditMode.tsx` 18.08.) sowie `MeineReisen.tsx`
(zwei Demo-Reisen: Lissabon, Kyoto).

### Reibungspunkte

**1. Kein Weg von der Kassenübersicht zur eigentlichen Buchung**
`src/pages/Warenkorb.tsx:109-114` zeigt die Gesamtsumme in einer
hervorgehobenen Karte an — aber weder dort noch sonst irgendwo auf der
Seite gibt es einen Button oder Link, um mit dieser Auswahl
weiterzumachen (z. B. "Weiter zur Buchung" o. Ä.). Eine Codesuche über
`src/` nach "Kasse"/"checkout"/"bezahlen" findet dazu nichts. Wer den
Warenkorb befüllt und die Summe sieht, landet an einer Sackgasse: Die
einzige klickbare Aktion auf der ganzen Seite ist das Entfernen
einzelner Positionen (`:89-98`). Das ist der eigentliche Zweck eines
Warenkorbs — von hier aus weiterzukommen — und er fehlt komplett.

*Vorschlag:* Mindestens einen (auch vorerst inaktiven oder auf
`/buchung` verweisenden) "Weiter"-Button unterhalb der Gesamtsumme
ergänzen, damit die Seite nicht wie eine Endstation wirkt.

**2. Entfernen ist sofort und endgültig, ohne Bestätigung oder Rückgängig**
`src/pages/Warenkorb.tsx:35-37` (`removeItem`), ausgelöst über den
`X`-Button in Zeile 89-98, entfernt eine Position direkt aus dem State —
kein Bestätigungsdialog, kein Rückgängig-Toast. Dasselbe Muster wurde in
diesem Log bereits bei `Angebote.tsx` (12.08.), `EditMode.tsx` (18.08.)
und `Reiseentwuerfe.tsx` (19.08.) dokumentiert; hier ist es der vierte
Fundort. Besonders hier fällt es ins Gewicht, weil eine versehentlich
entfernte Position (z. B. der Flug für 249 €) bei fehlendem
"Weiter"-Button (siehe Punkt 1) ohnehin schon keinen sichtbaren nächsten
Schritt hat, um den Fehler im Kontext zu bemerken und zu beheben.

*Vorschlag:* Wie in den vorherigen Einträgen — ein "Rückgängig"-Toast
nach dem Entfernen. Bei nun vier Fundorten lohnt sich ein gemeinsamer
`useUndoableRemove`-Hook wirklich, statt es ein fünftes Mal einzeln
nachzurüsten.

**3. Positionen aus unterschiedlichen Reisen werden ohne Kennzeichnung vermischt**
`src/pages/Warenkorb.tsx:20-26` (`initialItems`) mischt laut Kommentar in
Zeile 17-19 Demo-Positionen aus zwei verschiedenen Reisen (Lissabon,
Kyoto) — z. B. steht "Zugticket Kyoto → Osaka" (`:23`) in der Gruppe
"Transport" direkt neben Positionen, die eigentlich zur Lissabon-Reise
gehören. `groupCartItems` (`cartTotals.ts:20-25`) gruppiert ausschließlich
nach Leistungstyp, nicht nach Reise. Wer parallel zwei Reisen plant,
sieht im Warenkorb also einen einzigen unsortierten Topf ohne
Information, welche Position zu welcher Reise gehört — bei nur einer
Reise fällt das nicht auf, wird aber schnell verwirrend, sobald
mehrere Reisen gleichzeitig geplant werden (genau das Szenario, das
`MeineReisen.tsx` mit seinen zwei Demo-Reisen bereits vorsieht).

*Vorschlag:* Jeder Position sichtbar die zugehörige Reise zuordnen (z. B.
kleines Reiseziel-Label oder -Icon pro Karte) oder zusätzlich nach Reise
gruppieren/filtern lassen, sobald `CartItem` ein Trip-Feld hat.

### Nicht geprüft
Der Leerzustand (`:39-58`) selbst wurde nicht erneut geprüft — er folgt
sichtbar demselben, bereits an anderer Stelle für gut befundenen Muster
(klare Erklärung + direkter Link zu `/ki-chat`).

---

## 2026-08-21 — Profil (`/profil`)

**Geprüfter Bereich:** `src/pages/Profil.tsx` und `src/types/profile.ts`,
laut `ZEITPLAN.md` (Aufgabe 8.8) am 20.08. vom autonomen IT-Chef-Lauf
gebaut, bereits über die Sidebar unter "Konto" erreichbar
(`src/lib/nav-config.ts:67`) und noch in keinem Support-Chef-Lauf
geprüft. Zum Vergleich herangezogen: `src/pages/Favoriten.tsx` (gleiches
`useState`-Demo-Muster, aber dort werden nur vorhandene Demo-Einträge
entfernt statt aktiv Formulardaten eingegeben) und
`src/components/search/FlightWizard.tsx` (Vorbild für das
IATA-Eingabefeld laut `ZEITPLAN.md`).

### Reibungspunkte

**1. Eingegebene Präferenzen gehen schon beim Wegnavigieren verloren —
nicht erst beim Reload**
`src/pages/Profil.tsx:21` hält die Auswahl ausschließlich in lokalem
`useState(emptyPreferences)`, ohne `localStorage` oder einen
übergeordneten Store. `src/routes.tsx:44-66` rendert alle Seiten über
`<Routes location={location} key={location.pathname}>`, wodurch jede
Seite bei einem Routenwechsel vollständig neu gemountet wird. Wer auf
`/profil` mehrere Reisestile anklickt, einen Budgetrahmen wählt und
"BER" einträgt, dann kurz zu einer anderen Seite wechselt (z. B. über
die Sidebar) und zurück zu "Profil" geht, sieht wieder den
komplett leeren Ausgangszustand — ohne jede Rückfrage oder Warnung. Das
ist strenger als die in `ZEITPLAN.md` (Zeile 221-227) benannte
Einschränkung "keine Persistenz über Reloads hinweg", denn hier reicht
bereits ein einfacher Klick in der Navigation innerhalb derselben
Sitzung. Die Seitenbeschreibung "Reisepräferenzen **verwalten**"
(`Profil.tsx:43`) weckt zusätzlich die Erwartung einer echten
Kontoeinstellung, was den Verlust noch überraschender macht. Zum
Vergleich: Bei `Favoriten.tsx` betrifft derselbe fehlende Persistenz nur
das Entfernen von Demo-Einträgen (`ZEITPLAN.md` Zeile 173-179) — ein
kleinerer Verlust als hier aktiv eingegebene Formulardaten.

*Vorschlag:* Kurzfristig, ohne Backend: die Auswahl in `localStorage`
zwischenspeichern (analog zum `tripStorage.ts`-Muster für Trips), damit
sie zumindest die Sitzung über Routenwechsel hinweg übersteht. Bis dahin
zumindest einen Hinweistext ergänzen (z. B. "Deine Auswahl wird noch
nicht gespeichert"), damit die Erwartung nicht falsch gesetzt wird.

**2. Heimatflughafen-Feld ist nirgends verdrahtet und erklärt seinen Nutzen
nicht**
`src/pages/Profil.tsx:127-143`: Anders als bei Reisestilen ("die KI
berücksichtigt das bei Vorschlägen"), Budgetrahmen ("hilft der KI,
passende Angebote zu priorisieren") und Ernährungsweise ("Relevant für
Restaurant- und Verpflegungsvorschläge") fehlt beim Heimatflughafen jede
Erklärung, wofür der Wert verwendet wird — nur "IATA-Code, z. B. BER für
Berlin". Eine Codesuche nach `homeAirport` (`src/types/profile.ts`,
`src/pages/Profil.tsx`) zeigt: Der Wert wird aktuell nirgends
weiterverwendet, insbesondere nicht als Vorbelegung für das
`origin`-Feld in `FlightWizard.tsx:24,61-64`, obwohl genau das der
naheliegende Nutzen wäre. Zusätzlich gibt es — anders als bei
`FlightWizard.tsx:32` (`origin.trim().length === 3`) — keine Prüfung,
ob wirklich 3 Zeichen eingegeben wurden; auch "B" oder "BE" werden
klaglos übernommen.

*Vorschlag:* Sobald das Feld an eine echte Stelle angebunden wird (z. B.
Vorbelegung des `origin`-Feldes in der Flugsuche), das kurz im Hilfetext
erwähnen, analog zu den anderen drei Feldern. Bis dahin optional eine
dezente Validierung (z. B. Hinweistext bei 1-2 Zeichen), damit klar ist,
dass ein vollständiger 3-Buchstaben-Code erwartet wird.

### Nicht geprüft
Die Zugänglichkeit der Toggle-Chip-Gruppen (`aria-pressed`, `role="group"`
+ `aria-label`) wurde stichprobenartig mitgelesen und wirkt sauber
umgesetzt — keine vertiefte Screenreader-Prüfung durchgeführt. Fehlende
`aria-live`-Rückmeldung nach dem Ändern einzelner Felder wurde nicht
gesondert untersucht, da das Fehlen von `aria-live` codebase-weit bereits
im Eintrag vom 20.08. (Kalender) dokumentiert ist.

## 2026-08-22 — Reise suchen (`/reise-planen`)

**Geprüfter Bereich:** `src/pages/ReiseSuche.tsx` und
`src/pages/ReiseSuche.test.tsx`, laut `ZEITPLAN.md` (Aufgabe 7.15) am
21.08. vom autonomen IT-Chef-Lauf gebaut und mit dem heutigen
Freigabe-Chef-Merge (`5d688da`/`4d70bff`) erstmals in `main` gelandet —
noch in keinem Support-Chef-Lauf geprüft. `Home.tsx:46-50` verlinkt
bereits seit früherem Stand dorthin ("Selbst durchsuchen"), zeigte bis
zu diesem Merge aber nur die generische `PlaceholderPage`.

### Reibungspunkte

**1. Die als "empfohlen" markierte KI-Chat-Karte hat de facto keine
sichtbare Hervorhebung — die Border-Klasse rendert nicht**
`src/pages/ReiseSuche.tsx:49` setzt bei `option.recommended` nur die
Klasse `border-teal/40` (reine Randfarbe) auf die `Card`. Die
`Card`-Basiskomponente (`src/components/ui/card.tsx:14`) nutzt aber gar
kein `border`-Utility, sondern `ring-1 ring-foreground/10`. Der globale
Tailwind-Reset in `src/styles/globals.css:126-128`
(`* { @apply border-border outline-ring/50; }`) setzt ebenfalls nur die
Randfarbe, keine Randbreite — Tailwinds Preflight lässt `border-width`
bei allen Elementen ohne explizites `border`-Utility auf `0`. Ergebnis:
`border-teal/40` hat schlicht keine Randbreite, an der die Farbe
sichtbar würde, und rendert damit unsichtbar. Übrig bleibt als einziges
Unterscheidungsmerkmal die Button-Farbe (gefüllt Teal vs. Outline,
`ReiseSuche.tsx:58-61`) plus die Position an erster Stelle — ein
Erstnutzer, der laut `ZEITPLAN.md` (Zeile 216) über die KI-Chat-Karte
"als empfohlener Weg" geführt werden soll, bekommt davon praktisch
nichts mit, wenn er die drei Karten überfliegt. Auch ein Textlabel
("Empfohlen") fehlt komplett — eine Codesuche nach "Empfohlen" im
gesamten `src`-Ordner findet nur diese eine Datei (den Code-Kommentar
gibt es nicht einmal), obwohl `src/components/ui/badge.tsx` bereits in
acht anderen Seiten (u. a. `MeineReisen.tsx`, `Angebote.tsx`,
`FlightCard.tsx`) für genau solche Kennzeichnungen verwendet wird.

*Vorschlag:* Entweder `border` zur Klasse ergänzen (z. B.
`border border-teal/40`), damit die Randfarbe sichtbar wird, oder —
konsistenter zum Rest der App — ein `Badge` mit Text "Empfohlen" auf der
KI-Chat-Karte ergänzen, analog zum bestehenden Muster in den acht oben
genannten Dateien.

### Nicht geprüft
Die Seite ist reine Navigation ohne Formulare, Ladezustände oder
Fehlerfälle — entsprechend gab es dort nichts Weiteres zu prüfen. Die
Zielseiten `/ki-chat`, `/flugsuche` und `/hotelsuche` selbst waren nicht
Gegenstand dieses Laufs, da sie bereits in früheren Einträgen (siehe
2026-08-10, Flugsuche) behandelt wurden bzw. noch nicht geprüft sind.

## 2026-08-22 (zweiter Lauf) — kein neuer Punkt

Erneute Auslösung am selben Tag. Seit dem obigen Eintrag zu Reise suchen
(`/reise-planen`) ist laut `git log` kein neuer UI-Code nach `main`
gelandet — der IT-Chef-Lauf von heute (`175fbb6`) hat Layout-, Such- und
Chat-Komponenten durchgesehen, aber keinen neuen Auto-Fix gemergt. Damit
gibt es keine neue Seite oder Komponente, die noch nicht geprüft wäre.
Kein neuer Reibungspunkt in diesem Lauf, um keine Punkte zu erfinden, nur
damit der Bericht nicht leer aussieht.

---

## 2026-08-23 — Einstellungen (`/einstellungen`)

**Geprüfter Bereich:** `src/pages/Einstellungen.tsx`, `src/types/settings.ts`
und `src/pages/Einstellungen.test.tsx`, laut `ZEITPLAN.md` (Aufgabe 8.10)
am 22.08. vom autonomen IT-Chef-Lauf gebaut und mit dem heutigen
Freigabe-Chef-Merge (`71ef2e3`) erstmals in `main` gelandet — noch in
keinem Support-Chef-Lauf geprüft. Zum Vergleich herangezogen:
`src/pages/Profil.tsx` (21.08., gleiches lokales `useState`-Demo-Muster
ohne Persistenz) und `src/pages/Kartenansicht.tsx`/`src/pages/Kalender.tsx`
(mögliche Verwendungsstellen für Distanz-/Datumsanzeigen).

### Reibungspunkte

**1. Benachrichtigungs-Toggles versprechen "per E-Mail", ohne dass es
irgendeinen E-Mail-Versand gibt — und ohne Hinweis darauf in der UI**
`src/pages/Einstellungen.tsx:31-33`: Der Beschreibungstext unter
"Benachrichtigungen" lautet wörtlich "Worüber Travix dich **per E-Mail**
informieren soll." Laut `ZEITPLAN.md` (Support-Track, Sprint 1) ist die
Support-E-Mail-Adresse selbst noch nicht live ("Support-E-Mail live" ist
weiterhin offen, `[ ]`), und der Code-Kommentar in `Einstellungen.tsx:9-12`
bestätigt intern selbst "keine echten Benachrichtigungen (E-Mail-Versand
hängt am Support-Chef-Track 'Support-E-Mail live')". Nutzer:innen, die
hier z. B. "Preisalarme" aktivieren, gehen aber aufgrund des Texts davon
aus, künftig tatsächlich eine E-Mail zu bekommen — es gibt in der UI
selbst keinerlei Hinweis, dass dahinter aktuell nichts passiert. Anders
als bei `Profil.tsx`, wo die Formulierung ("Reisepräferenzen verwalten")
keine konkrete zukünftige Aktion verspricht, macht der Text hier ein
explizites Versprechen ("Travix informiert dich"), das nicht eingehalten
werden kann.

*Vorschlag:* Entweder den Beschreibungstext neutraler formulieren (z. B.
"Worüber Travix dich informieren soll, sobald Benachrichtigungen aktiv
sind"), oder einen kleinen Hinweis ergänzen (analog zum in
`Profil.tsx` (21.08.) vorgeschlagenen "Deine Auswahl wird noch nicht
gespeichert"), solange E-Mail-Versand technisch nicht existiert.

**2. Maßeinheiten-Auswahl hat aktuell in der gesamten App keinerlei
Wirkung — es gibt nirgends eine Distanz- oder Temperaturanzeige**
`src/pages/Einstellungen.tsx:59-61` beschreibt die Auswahl mit "Für
Distanzen und Temperaturen in Reiseplänen und Karten." Eine Codesuche
über `src/pages` und `src/components` nach Distanz-/Temperaturanzeigen
(`km`, `°C`, `distance`, `temperature`) findet außer der Einstellungen-Seite
selbst keinen einzigen Treffer — auch `Kartenansicht.tsx` (11.08.) und
`Kalender.tsx` (20.08.), die naheliegendsten Kandidaten, zeigen keine
Entfernungen oder Temperaturen an. Eine Codesuche nach `AppPreferences`/
`emptyAppPreferences`/`preferences.units` außerhalb von
`Einstellungen.tsx`/`Einstellungen.test.tsx` findet ebenfalls nichts. Die
Auswahl ist damit nicht nur unpersistiert (wie schon bei `Profil.tsx`
dokumentiert), sondern beschreibt ein Feature, das im Rest der App noch
gar nicht existiert — stärker als bei `Profil.tsx`s Heimatflughafen-Feld
(21.08.), wo zumindest ein plausibles Anbindungsziel (`FlightWizard.tsx`
`origin`) bereits vorhanden ist.

*Vorschlag:* Bis eine echte Distanz-/Temperaturanzeige existiert, entweder
den Beschreibungstext auf das Vorhandene beschränken (z. B. nur "Für
künftige Distanz- und Temperaturanzeigen") oder das Feld vorerst
ausblenden, um keine Erwartung an eine Funktion zu wecken, die aktuell
nirgends sichtbar wird.

**3. Gleiches Persistenz-Problem wie bei `Profil.tsx` (21.08.) — Auswahl
geht schon beim Wegnavigieren verloren**
`src/pages/Einstellungen.tsx:14` hält `preferences` wie `Profil.tsx`
ausschließlich in lokalem `useState(emptyAppPreferences)`, ohne
`localStorage`. Da `src/routes.tsx:44-66` jede Seite bei Routenwechsel neu
mountet, springt ein deaktiviertes Benachrichtigungs-Toggle oder ein
geändertes Einheiten-Feld beim Zurückkehren zu `/einstellungen` wieder auf
den Ausgangszustand — ohne Hinweis. Der am 21.08. für `Profil.tsx`
vorgeschlagene `localStorage`-Zwischenspeicher-Fix (bzw. der dortige
Hinweistext-Vorschlag) wurde bislang nicht umgesetzt und würde hier im
selben Zug mit gelöst.

### Nicht geprüft
Keine weiteren Formulare oder Fehlerfälle auf der Seite — sie besteht nur
aus den beiden oben genannten Feldern. Eine vertiefte Screenreader-Prüfung
der `Select`-Komponente wurde nicht durchgeführt (analog zur
Einschränkung im Profil-Eintrag vom 21.08.).

---

## 2026-08-24 — Reise-Checkliste (`ChecklistPanel.tsx`, `/buchung`)

**Geprüfter Bereich:** `src/components/trip/ChecklistPanel.tsx`,
`src/lib/trip/checklistRules.ts` und deren Einbindung in
`src/pages/Buchung.tsx`, laut `ZEITPLAN.md`/`tasks-prd-travix-platform.md`
(Aufgabe 6.8/6.9) heute vom autonomen IT-Chef-Lauf ("achter Lauf") gebaut
— noch in keinem Support-Chef-Lauf geprüft.

### Reibungspunkte

**1. Innerhalb derselben Checkliste verhalten sich die 5 automatischen
und die 8 manuellen Punkte bei Reload/Wegnavigieren widersprüchlich —
ohne dass die UI das kenntlich macht**
`ChecklistPanel.tsx:20` hält die manuell abgehakten Punkte
(`checkedManual`) ausschließlich in lokalem `useState(new Set())`. Die
fünf automatischen Punkte (`isAutoItemChecked()` in
`checklistRules.ts:39-54`) werden dagegen aus `trip` berechnet, und
`trip` kommt in `Buchung.tsx:139` aus `loadStoredChat()`
(`src/lib/trip/tripStorage.ts:11-17`), das aktiv aus `localStorage`
(Key `travix.ki-chat.draft`) liest — also *doch* persistent ist, anders
als beim bereits dokumentierten Muster von `Profil.tsx`/
`Einstellungen.tsx`, wo die komplette Seite gleichmäßig zurückspringt.
Hier springt bei einem Reload oder einem Ausflug zu einer anderen Seite
(jede Route mountet laut `src/routes.tsx:44-66` neu) nur der untere,
manuelle Teil der Liste zurück auf 0 von 8 — während der obere,
automatische Teil (z. B. "Transport gebucht", "Budget festgelegt")
unverändert stehen bleibt. Ein Reisender, der z. B. "Reisepass gültig"
und "Koffer gepackt" abgehakt hat, später zur Startseite wechselt und zu
`/buchung` zurückkehrt, sieht seinen Fortschrittsbalken ohne Vorwarnung
von z. B. 7/13 auf 5/13 zurückfallen — nur bei den beiden Punkten, die er
selbst gerade erst bearbeitet hat. Das ist verwirrender als ein
einheitlich zurückspringender Zustand, weil es innerhalb einer einzigen
Komponente inkonsistent wirkt, statt (wie bei Profil/Einstellungen)
gleichmäßig auf einer ganzen Seite.

*Vorschlag:* Kurzfristig reicht ein kleiner Hinweistext unter der
manuellen Liste (z. B. "Dein Haken bleibt nur, solange du auf dieser
Seite bleibst"), damit die Diskrepanz zu den automatischen Punkten nicht
überrascht. Mittelfristig würde sich `checkedManual` mit demselben
`localStorage`-Muster wie `tripStorage.ts` (z. B. unter einem eigenen Key
je `trip.destination` oder direkt im `StoredChatState`) genauso
persistieren lassen wie die Trip-Felder selbst — dann verhalten sich
beide Listenhälften gleich.

### Nicht geprüft
Keine Fehlerzustände oder Ladezustände auf der Checkliste selbst — sie
ist rein clientseitig aus bereits geladenen `trip`-Daten abgeleitet, ohne
eigenen Netzwerk-/Ladeaufruf. Der übrige Inhalt von `Buchung.tsx`
(Buchungs-Details, `EditMode`-Dialog für Aktivitäten) war nicht
Gegenstand dieses Laufs.

---

## 2026-08-25 — Mikrofon-Fehleranzeige im KI-Chat (`ChatInput.tsx`)

**Geprüfter Bereich:** `src/components/chat/ChatInput.tsx` und
`src/lib/ai/speech.ts`, laut `it-chef-auto-log.md` heute vom autonomen
IT-Chef-Lauf neu gebaut — bisher zeigte ein echter
Spracherkennungsfehler (z. B. verweigerte Mikrofon-Berechtigung) gar
keinen Hinweis an, jetzt erscheint ein Hinweistext unter der
Eingabezeile. Noch in keinem Support-Chef-Lauf geprüft. Zum Vergleich
herangezogen: `src/components/chat/KiChat.tsx` (einzige Einbindung von
`ChatInput` im Haupt-Chat-Ablauf, neben `src/pages/Urlaubsmodus.tsx`).

### Reibungspunkte

**1. Der Mikrofon-Fehlerhinweis verschwindet nie von selbst — er bleibt
stehen, obwohl der Nutzer dem gegebenen Rat folgt und einfach tippt**
`src/components/chat/ChatInput.tsx:17` hält `micError` in lokalem
`useState`. Er wird nur an zwei Stellen verändert: beim nächsten
Mikrofon-Versuch auf `null` zurückgesetzt (`:28`) oder bei einem neuen
Fehler neu gesetzt (`:33`). `handleSend()` (`:19-24`) — also genau die
Aktion, zu der der Hinweistext selbst rät ("bitte tippe deine Nachricht
stattdessen") — berührt `micError` nicht. Da `ChatInput` in
`KiChat.tsx:125` ohne `key`-Prop eingebunden ist und über die gesamte
Chat-Sitzung dieselbe Komponenteninstanz bleibt (auch ein Klick auf
"Neu starten", `KiChat.tsx:92-94`, setzt nur den Chat-Zustand im
`useChat`-Hook zurück, nicht diesen lokalen State), bleibt der
Fehlerhinweis unter der Eingabezeile stehen — auch nach jeder weiteren
erfolgreich getippten und gesendeten Nachricht, über beliebig viele
folgende Chat-Runden hinweg, bis der Nutzer zufällig noch einmal auf
das Mikrofon klickt. Ein Nutzer, der einmal versehentlich das
Mikrofon antippt, die Berechtigung verweigert und danach ganz normal
weiter tippt, sieht also dauerhaft eine Fehlermeldung unter einem
Gespräch, das längst reibungslos läuft.

*Vorschlag:* `micError` zusätzlich in `handleSend()` auf `null` setzen
(die Aktion, die der Hinweis selbst empfiehlt, ist das natürlichste
Signal "Problem erledigt"), oder den Hinweis nach einer kurzen Zeit
automatisch ausblenden (z. B. per `setTimeout`, analog zu einem
Toast-Muster).

**2. Der Fehlerhinweis wird nicht an Screenreader-Nutzer:innen
angekündigt und ist nicht mit dem Mikrofon-Button verknüpft**
`src/components/chat/ChatInput.tsx:74`: Das `<p>` mit dem Hinweistext
hat weder `aria-live` noch `role="status"`, noch ist es über
`aria-describedby` mit dem Mikrofon-Button (`:41-51`) verbunden. Anders
als bei den bereits dokumentierten rein visuellen Zustandswechseln
(z. B. Kalender-Monatstitel, Eintrag 2026-08-20) geht es hier um eine
echte Fehlermeldung mit einer konkreten Handlungsanweisung ("bitte
tippe deine Nachricht stattdessen") — wer den Mikrofon-Button per
Screenreader bedient, bekommt den Fehler und die Handlungsanweisung
gar nicht mit, sondern erlebt nur, dass die Aufnahme kommentarlos
endet (fast derselbe stille Zustand, den der heutige IT-Chef-Fix
eigentlich beheben sollte — nur jetzt für Screenreader-Nutzer:innen
statt für alle).

*Vorschlag:* `role="status"` (oder `aria-live="polite"`) auf das `<p>`
in Zeile 74 setzen, damit der Hinweis automatisch vorgelesen wird,
sobald er erscheint.

### Nicht geprüft
Das Verhalten von `startListening`/`recognition.onerror` selbst wurde
nur gelesen, nicht in echten Browsern mit verweigerter
Mikrofon-Berechtigung nachgestellt (dafür gibt es in diesem reinen
Analyse-Lauf keine Möglichkeit). `Urlaubsmodus.tsx` als zweite
Einbindungsstelle von `ChatInput` wurde nicht gesondert geprüft, da
`ChatInput` dort identisch verwendet wird und dieselben zwei
Reibungspunkte gelten würden.

---

## 2026-08-26 — Such-Assistenten Flug/Hotel (`FlightWizard.tsx`, `HotelWizard.tsx`, Ergebniskarten)

**Geprüfter Bereich:** Seit dem letzten Lauf (25.08.) ist laut
`ZEITPLAN.md` keine neue Seite dazugekommen — der einzige frische Stand
ist der heutige IT-Chef-Bug-Cluster rund um die Such-Assistenten
(`reports/it-chef.md`: Checklisten-Label-Fix, Duffel-Fehlermeldungen
übersetzt, PR #7 zur Passagierzahl-`NaN`-Absicherung in
`FlightWizard.tsx`, noch offen). Deshalb heute an genau diesem Bereich
weitergeprüft, statt eine beliebige alte Seite erneut anzusehen:

- `src/components/search/FlightWizard.tsx`
- `src/components/search/HotelWizard.tsx`
- `src/components/search/FlightCard.tsx`, `HotelCard.tsx`, `TrainCard.tsx`
- `src/lib/duffel/client.ts` (zum Abgleich, siehe unten)

Die drei bereits im ersten Flugsuche-Eintrag (10.08.) gemeldeten Punkte
sind inzwischen erledigt und im aktuellen Quelltext bestätigt: Der
IATA-Hinweistext steht jetzt unter beiden Feldern
(`FlightWizard.tsx:73`/`:83`), `Flugsuche.tsx:22` setzt `offers` beim
Suchstart sofort auf `null` statt alte Ergebnisse stehen zu lassen, und
`duffel/client.ts:30-34` zeigt bei einem API-Fehler jetzt einen
verständlichen deutschen Fallback-Text statt der rohen Duffel-Meldung.
Zwei neue, bisher nicht dokumentierte Punkte gefunden:

### Reibungspunkte

**1. Datum in der Vergangenheit lässt sich für Hin-/Check-in-Datum
anstandslos auswählen — der Fehler danach ist nur noch allgemein**
`FlightWizard.tsx:87-93` (Feld "Hinflug") und `HotelWizard.tsx:66-67`
(Feld "Check-in") haben kein `min`-Attribut, während das jeweils
abhängige zweite Datumsfeld es hat (`FlightWizard.tsx:104`:
`min={departureDate}` fürs Rückflugdatum; `HotelWizard.tsx:76`:
`min={checkInDate}` fürs Check-out). Ein Datumspicker lässt also für
Hinflug/Check-in problemlos ein Datum in der Vergangenheit zu — der
Button wird nicht deaktiviert (`isValid` prüft nur, ob überhaupt ein
Datum gesetzt ist, nicht ob es in der Zukunft liegt). Genau dieser Fall
landet dann bei der neu verbesserten, aber bewusst allgemein gehaltenen
Duffel-Fehlermeldung ("bitte prüfe deine Eingaben oder versuche es
gleich noch einmal", `duffel/client.ts:32`) — ein Nutzer, der sich nur
im Datum vertippt hat (z. B. 2025 statt 2026), bekommt keinen Hinweis
darauf, *welche* Eingabe das Problem ist, und muss raten.

*Vorschlag:* `min={new Date().toISOString().slice(0, 10)}` (heutiges
Datum) auf `FlightWizard.tsx:90` und `HotelWizard.tsx:67` ergänzen —
verhindert die Vergangenheits-Eingabe direkt im Picker, analog zum
bereits vorhandenen Muster bei Rückflug/Check-out.

**2. Preise erscheinen roh und ohne deutsches Zahlenformat**
`FlightCard.tsx:60`, `HotelCard.tsx:35` und `TrainCard.tsx:63` geben
`{offer.totalAmount} {offer.totalCurrency}` unverändert aus — also z. B.
"245.00 EUR" statt "245,00 €". Für eine deutschsprachige Reiseplattform,
bei der es um echtes Geld geht, wirkt ein Preis mit Punkt statt Komma
und ausgeschriebenem Währungscode statt Symbol unfertig und mindert das
Vertrauen genau an der Stelle, an der Nutzer:innen am genauesten
hinschauen. Betrifft alle drei Ergebniskarten gleichermaßen, ist also
kein Einzelfall, sondern ein wiederkehrendes Muster.

*Vorschlag:* Eine kleine gemeinsame Formatierungsfunktion (z. B.
`formatPrice(amount, currency)` mit
`new Intl.NumberFormat('de-DE', { style: 'currency', currency }).format(...)`)
in allen drei Karten statt der rohen String-Verkettung verwenden.

### Nicht geprüft
Das unter PR #7 laufende Passagierzahl-`NaN`-Fix selbst wurde nicht
erneut geprüft — das ist IT-Chefs Baustelle und noch nicht auf `main`.
`TrainCard.tsx`/`HotelWizard.tsx` wurden nur für die zwei oben
genannten Punkte angesehen, nicht vollständig auf weitere Reibungspunkte
durchgegangen.

---

## 2026-08-26 (zweiter Lauf) — Preisalarme (`/preisalarme`)

**Geprüfter Bereich:** Seit dem obigen Eintrag von heute ist laut
`ZEITPLAN.md` und `it-chef-auto-log.md` keine neue Seite dazugekommen —
die drei heutigen IT-Chef-Läufe haben ausdrücklich "keinen neuen sicheren
Punkt" umgesetzt. Die beiden oben gemeldeten offenen Punkte (fehlendes
`min`-Attribut bei Hinflug/Check-in, rohe Preisdarstellung in
`FlightCard.tsx`/`HotelCard.tsx`/`TrainCard.tsx`) sind am aktuellen
Quelltext geprüft weiterhin unverändert vorhanden — nichts Neues dazu zu
melden. Deshalb heute stattdessen `src/pages/Preisalarme.tsx` (Aufgabe
7.10) geprüft: eine der wenigen Trip-Lifecycle-Listenseiten, die bisher
noch keinen eigenen Eintrag in diesem Log hatte (anders als
`Favoriten.tsx`, `Angebote.tsx`, `Aktivitaeten.tsx`, `Warenkorb.tsx`,
`Kalender.tsx`, `Reiseentwuerfe.tsx`).

Positiv zuerst: `Preisalarme.tsx:38-40` formatiert Preise bereits korrekt
mit `toLocaleString('de-DE')` plus `€`-Symbol — genau das Muster, das bei
`FlightCard`/`HotelCard`/`TrainCard` oben als fehlend gemeldet wurde. Gute
Vorlage für die dortige Korrektur.

### Reibungspunkte

**1. Der Entfernen-Button für einen Preisalarm nutzt das `BellOff`-Icon —
das liest sich wie "Stummschalten", löscht aber unwiderruflich**
`src/pages/Preisalarme.tsx:96` zeigt als einzige Aktion pro Karte einen
Button mit `BellOff`-Icon (durchgestrichene Glocke). Dieses Icon steht in
den meisten Apps für "Benachrichtigungen für diesen Punkt stummschalten/
pausieren" — ein Nutzer würde erwarten, danach weiterhin einen (nur
stillen) Preisalarm zu sehen. Tatsächlich löst der Klick `removeAlert`
(Zeile 45-47) aus, das den Alarm komplett aus der Liste entfernt — es
gibt keine Möglichkeit, ihn wieder zu aktivieren, weder auf dieser Seite
noch sonst irgendwo (kein "Preisalarm erneut anlegen"-Weg außer erneut
über den KI-Chat zu planen). `aria-label`/`title` sagen zwar korrekt
"entfernen", aber das Icon selbst widerspricht dem und könnte zu
versehentlichem, unumkehrbarem Löschen führen, wenn jemand nur kurz Ruhe
vor der Benachrichtigung wollte.

*Vorschlag:* Entweder das Icon auf ein eindeutiges "Löschen"-Symbol (z. B.
`Trash2`, analog zum `X`-Icon bei `Angebote.tsx:105`) ändern, oder — besser
für den eigentlichen Anwendungsfall eines Preisalarms — echtes
Pausieren/Stummschalten als eigene, vom Löschen getrennte Aktion anbieten.

**2. Kein Hinweis, wie aktuell der angezeigte Preis ist**
`src/pages/Preisalarme.tsx:100-105`: Der `currentPrice` wird ohne jeden
Zeitbezug angezeigt ("610 €" o. Ä.) — anders als z. B. bei
`Preisalarme.tsx:107-112`, wo immerhin der Vergleich zum vorherigen Preis
steht. Bei einer Funktion, deren gesamter Zweck "den Preis im Blick
behalten" ist (`PageHeader`-Beschreibung, Zeile 73), fehlt die
naheliegendste Vertrauensfrage: seit wann gilt dieser Preis? Sobald echte,
sich laufend ändernde Preisdaten dahinterstehen (statt der aktuellen
Demo-Werte), könnte ein Nutzer einen veralteten Preis für aktuell halten.

*Vorschlag:* Einen kleinen Zeitstempel ("Zuletzt geprüft: heute, 14:32
Uhr" o. Ä.) pro Karte ergänzen, sobald ein echtes Preis-Update-Datenfeld
existiert — aktuell reine Beobachtung für später, kein akuter Bug, da die
Werte ohnehin statische Demo-Daten sind.

### Nicht geprüft
`Preisalarme.test.tsx` wurde nicht als Testabdeckungs-Review gelesen,
nur der Komponenten-Quelltext selbst. Keine Codeänderung in diesem Lauf,
nur dieser Bericht.

---

## 2026-08-27 — Checkliste jetzt klickbar (`ChecklistPanel.tsx`, `/buchung`)

**Geprüfter Bereich:** `src/components/trip/ChecklistPanel.tsx`, laut
`ZEITPLAN.md` (Aufgabe 6.10) am 26.08. vom autonomen IT-Chef-Lauf
("fünfter Lauf") ergänzt und seither nach `main` gemergt — die fünf
automatisch erkannten Zeilen sind jetzt Links zu `/ki-chat?edit=<feld>`.
Noch in keinem Support-Chef-Lauf geprüft (der Vorgänger-Stand der
Komponente wurde bereits am 24.08. behandelt, damals ohne die Links).
Zum Vergleich herangezogen: `src/pages/Buchung.tsx:90,117,251` (die
etablierte "Bearbeiten"-Konvention mit `Pencil`-Icon + Textlabel für
denselben `?edit=`-Sprung) und `src/hooks/useChat.ts:145-152`
(`startEdit`, bestätigt: der Sprung fügt sofort eine neue Assistenten-
Nachricht ein und wechselt in den Edit-Modus, nicht nur eine reine
Ansicht).

Positiv zuerst: Die beiden vorherigen Meldungen aus diesem Log sind seit
gestern behoben und im aktuellen Quelltext bestätigt —
`ChatInput.tsx:24` setzt `micError` jetzt beim Senden zurück und
kündigt ihn per `role="status"` an (25.08.-Meldung), `Preisalarme.tsx:96`
nutzt jetzt `Trash2` statt des irreführenden `BellOff`-Icons
(26.08.-Meldung, zweiter Lauf).

### Reibungspunkte

**1. Die fünf automatischen Checklisten-Zeilen sehen identisch aus wie
die acht manuellen darunter, lösen aber ein komplett anderes Verhalten
aus — ohne jede visuelle Kennzeichnung**
`ChecklistPanel.tsx:72-86` (automatische Zeilen, jetzt `<Link>`) und
`:90-108` (manuelle Zeilen, `<button>`) verwenden praktisch dieselben
Klassen (`flex items-center gap-2 rounded-md py-0.5 hover:bg-muted`),
dasselbe Icon-Paar (`CheckCircle2`/`Circle`) und dieselbe Typografie.
Ein Klick auf eine manuelle Zeile hakt sie nur lokal ab und bleibt auf
`/buchung`. Ein Klick auf eine automatische Zeile dagegen verlässt die
Seite komplett, springt nach `/ki-chat` und startet dort sofort
(`useChat.ts:145-152`, `startEdit`) eine neue Assistenten-Nachricht wie
"Klar, lass uns das Transportmittel ändern" — das passiert auch, wenn
der Punkt bereits erledigt ist (grüner Haken) und man eigentlich nur den
Status ansehen wollte, nicht bewusst "Ändern" angeklickt hat. Anders als
bei der bereits etablierten "Bearbeiten"-Konvention in `Buchung.tsx`
(`:90,117,251`), wo ein eigenes `Pencil`-Icon plus das Wort "Bearbeiten"
klar signalisieren "das hier navigiert weg und startet eine Änderung",
gibt es hier keinerlei Hinweis (kein Icon, kein Pfeil, kein
unterschiedlicher Stil) darauf, dass die obere Hälfte der Liste
navigiert und die untere nicht. Für Screenreader-Nutzer:innen kommt
erschwerend hinzu: Der Linkname ist exakt das Label ("Transport
ausgewählt") — das liest sich wie eine Status-Ansage, nicht wie ein
Navigationsziel oder eine Handlungsaufforderung.

*Vorschlag:* Den automatischen Zeilen ein kleines, konsistentes
Klick-Signal geben — z. B. denselben `Pencil`-Icon wie in `Buchung.tsx`
rechtsbündig ergänzen, oder zumindest einen `sr-only`-Zusatz im Linktext
("Transport ausgewählt, bearbeiten") für Screenreader. Das würde die
beiden Listenhälften visuell und akustisch klar unterscheidbar machen,
statt optisch identischer Zeilen mit gegensätzlichem Verhalten.

### Nicht geprüft
Das bereits am 24.08. gemeldete Persistenz-Problem der manuellen Haken
(`checkedManual` verliert seinen Zustand bei Routenwechsel) wurde nicht
erneut vertieft — es besteht laut Quelltext (`ChecklistPanel.tsx:35`,
weiterhin reiner `useState`) unverändert fort, aber das ist bereits
dokumentiert und nicht Gegenstand dieses Laufs. `useChat.ts`/`KiChat.tsx`
wurden nur so weit gelesen, wie nötig, um den Sprungmechanismus
(`?edit=`) zu verstehen, nicht als eigenständige UX-Fläche geprüft.

---

## 2026-08-28 — Dashboard (`/dashboard`, `Dashboard.tsx`)

**Geprüfter Bereich:** `src/pages/Dashboard.tsx` samt `Dashboard.test.tsx`,
laut `ZEITPLAN.md` (Aufgabe 7.7) heute vom autonomen IT-Chef-Lauf gebaut
und im selben Zug nach `main` gemergt (Merge-Commit `34307b1`) — noch in
keinem Support-Chef-Lauf geprüft. Zum Vergleich herangezogen:
`src/lib/nav-config.ts`, `src/components/layout/Sidebar.tsx`,
`src/components/layout/MobileNav.tsx`, `src/routes.tsx` sowie die
Demo-Datenquellen `MeineReisen.tsx`, `Reiseentwuerfe.tsx`, `Warenkorb.tsx`,
`Favoriten.tsx` (Werte stimmen überein — keine Inkonsistenz gefunden, gute
Wiederverwendung wie im Code-Kommentar `Dashboard.tsx:10-13` versprochen).

### Reibungspunkte

**1. Die fertige Dashboard-Seite ist im Produkt nirgends verlinkt —
Nutzer:innen können sie praktisch nicht finden**
`src/lib/nav-config.ts:76-88`: Der Eintrag für `/dashboard` (Zeile 80)
steht in `extraRoutes`, nicht in `navGroups` (Zeilen 45-72). Der
Kommentar direkt darüber (`nav-config.ts:40-44`) erklärt, warum
`extraRoutes`-Seiten absichtlich nicht in der Sidebar erscheinen: "entweder
weil kontextuell erreicht (Urlaubsmodus aus einer gebuchten Reise) oder
weil der KI-Chat den Job schon abdeckt (Suche, Deals, Budget, ...)". Auf
das Dashboard trifft aber keine der beiden Begründungen zu — es ist laut
eigenem Code-Kommentar (`Dashboard.tsx:10-13`) ausdrücklich ein "zentraler
Hub" über bestehende Daten, also genau die Art Seite, die man wiederholt
und bewusst aufsuchen will, nicht zufällig kontextuell trifft. Ich habe
`Sidebar.tsx` und `MobileNav.tsx` geprüft — beide rendern ausschließlich
`navGroups`, `extraRoutes` (und damit Dashboard) wird an keiner Stelle
als Link/Button dargestellt. Eine Volltextsuche über `src/` nach
"/dashboard" findet nur drei Treffer: den `extraRoutes`-Eintrag selbst,
den Routen-Import und die `<Route>`-Definition in `routes.tsx:74` — keinen
einzigen `<Link>`/`<NavLink>` von einer anderen Seite aus, der dorthin
führt. Auch `allRoutes` (`nav-config.ts:92`, in `routes.tsx:75-84`
verwendet) dient nachweislich nur dazu, für noch nicht gebaute Seiten
`PlaceholderPage`-Routen zu erzeugen, nicht als durchsuchbare Liste für
Nutzer:innen. Ergebnis: Eine vollständig gebaute, getestete Seite (129
Zeilen Code, eigene Testdatei) ist für echte Nutzer:innen nur über
manuelles Eintippen von `/dashboard` in die Adresszeile erreichbar — das
wird so gut wie niemand tun.

*Vorschlag:* `/dashboard` aus `extraRoutes` in eine der `navGroups`
verschieben (z. B. als erster Eintrag in "Meine Reise", da es genau diese
Reisedaten bündelt) — oder, falls Dashboard stattdessen der neue
Sidebar-weite Standard-Einstieg werden soll, das bei Ni/IT-Chef klären,
bevor sich hier jemand fürs "Falsche" entscheidet.

**2. Alle vier Kennzahl-Kacheln verwenden exakt denselben Linktext "Alle
ansehen" ohne unterscheidbaren Kontext im Linktext selbst**
`Dashboard.tsx:69-71` (in `StatTile`) und `:104-106` (Entwürfe-Kachel)
erzeugen vier `<Link>`-Elemente mit identischem sichtbarem und
zugänglichem Namen "Alle ansehen" (bestätigt durch den eigenen Test,
`Dashboard.test.tsx:31`: `getAllByRole('link', { name: 'Alle ansehen' })`
liefert bewusst eine Liste von vier gleichnamigen Links). Das ist ein
neues Muster nur auf dieser Seite — ich habe den Rest von `src/pages/`
nach "Alle ansehen" durchsucht und keine weiteren Treffer außer Dashboard
selbst gefunden, es ist also keine etablierte, bereits geprüfte
App-Konvention. Für Screenreader-Nutzer:innen, die typischerweise per
Tab oder über eine Liste aller Links auf der Seite navigieren, sind vier
identisch benannte Ziele ohne Unterscheidung im Linktext schwer
auseinanderzuhalten — der Linktext allein sagt nicht, ob er zu Reisen,
Entwürfen, Warenkorb oder Favoriten führt.

*Vorschlag:* Den Linktext um das jeweilige Kachel-Label ergänzen, z. B.
per `sr-only`-Zusatz ("Alle ansehen: Warenkorb") oder `aria-label`
("Warenkorb: alle ansehen") an jedem der vier Links, damit sie auch außer
Kontext eindeutig sind.

### Nicht geprüft
`calculateProgress.ts` und `cartTotals.ts` selbst wurden nicht erneut als
eigenständige Logik geprüft (nur die Werte, die sie für die Demo-Daten
liefern, stichprobenartig gegen die Quellseiten verglichen). Keine
Codeänderung in diesem Lauf, nur dieser Bericht.

---

## 2026-08-29 — Chatflow-Abschlussnachricht (`mockAdvisor.ts`) & Sidebar-Gruppe „Meine Reise“ (`nav-config.ts`)

**Geprüfter Bereich:** Zwei Stellen aus dem heutigen it-chef-Merge
(`b7a5d95`), noch in keinem Support-Chef-Lauf geprüft: die neue
Chatflow-Ehrlichkeitsmeldung für Zug/Bus/Fähre/Mietwagen in
`src/lib/ai/mockAdvisor.ts` und die sechs neu in die Sidebar
verschobenen Seiten in `src/lib/nav-config.ts`. Zum Vergleich
herangezogen: `src/components/chat/TripSummaryCard.tsx`,
`src/components/chat/KiChat.tsx`, `src/components/layout/Sidebar.tsx`,
`src/components/layout/MobileNav.tsx`.

### Reibungspunkte

**1. Chat-Text verspricht „Öffne den Reiseplan", der einzige dazu
passende Button heißt aber „Speichern & ansehen" — jetzt in vier
zusätzlichen Fällen sichtbar**
`mockAdvisor.ts:134` (neu, heutiger Ehrlichkeits-Fix für Zug/Bus/Fähre/
Mietwagen) und `mockAdvisor.ts:144` (unverändert, bestehender
Abschluss-Text für den Flug-Pfad) enden beide mit demselben Satz:
„Öffne den Reiseplan, um alles im Detail zu sehen und einzelne
Bausteine zu bearbeiten." Die einzige tatsächliche Handlungsmöglichkeit
dazu im Chat ist der Button in `TripSummaryCard.tsx:50-55`
(`<Link to="/buchung">Speichern & ansehen</Link>`), der laut
`KiChat.tsx:118` nur erscheint, wenn `hasTripData(trip)` zutrifft. Wer
nach einem Button oder Link sucht, der wörtlich zum „Öffnen" des
Reiseplans passt, muss selbst die Verbindung zu „Speichern & ansehen"
herstellen — ein Label, das eher nach einer Sicherungs- als einer
Navigationsaktion klingt. Das bestand zwar schon vorher beim
Flug-Abschluss (`:144`), betraf bis heute aber nur den einen Pfad; durch
den heutigen Fix (der Zug/Bus/Fähre/Mietwagen bewusst denselben Satz
gibt, um den vorherigen Dead-End zu vermeiden) sehen jetzt vier weitere
Nutzergruppen dieselbe Formulierungslücke.

*Vorschlag:* Entweder den Chat-Satz an den Button anpassen (z. B. „Speichere
deinen Reiseplan und sieh ihn dir an") oder den Button-Text an den
etablierten Chat-Wortlaut angleichen (z. B. „Reiseplan öffnen"), damit
Text und einzige echte Handlungsmöglichkeit zueinander passen.

**2. Sidebar-Gruppe „Meine Reise" ist heute von 4 auf 11 gleich
gewichtete Einträge gewachsen — keine visuelle Unterteilung**
`nav-config.ts:60-70`: Vor dem heutigen Merge enthielt die Gruppe vier
Einträge (Reiseplan, Reiseentwürfe, Meine Reisen, Warenkorb). Der
heutige Fix (zu Recht, siehe die berechtigten Vorgänger-Meldungen zu
Dashboard/Kalender/Karte/Aktivitäten/Angebote/Favoriten/Preisalarme)
hat sechs weitere Seiten hinzugefügt, sodass die Gruppe jetzt elf
Einträge zählt — mehr als doppelt so viele wie zuvor. `Sidebar.tsx:24-54`
und `MobileNav.tsx:33-61` rendern alle Einträge einer Gruppe als flache,
gleich gestaltete Liste ohne weitere Unterteilung (gleiche Schriftgröße,
gleicher Abstand, keine Sub-Überschriften). Auf Mobilgeräten
(`MobileNav.tsx`, Sheet-Breite 280px) bedeutet das, plus die zwei
anderen Gruppen, eine deutlich längere Scroll-Liste im Menü, bevor
„Konto" überhaupt sichtbar wird. Kein Absturz oder Darstellungsfehler
(`overflow-y-auto` ist in beiden Fällen gesetzt), aber das eigentliche
Problem von gestern (Seiten nicht auffindbar) läuft Gefahr, durch ein
neues zu ersetzen: elf ähnlich benannte, thematisch verwandte
Reise-bezogene Punkte (Warenkorb, Angebote, Preisalarme, Favoriten, Aktivitäten,
Kalender, Karte, Dashboard, Reiseplan, Reiseentwürfe, Meine Reisen) ohne
erkennbare Reihenfolge-Logik oder Zwischenüberschrift sind auf einen
Blick schwer auseinanderzuhalten.

*Vorschlag:* Keine Notwendigkeit, die Erreichbarkeit rückgängig zu
machen — aber prüfen, ob die elf Punkte innerhalb der Gruppe eine
zusätzliche visuelle Struktur vertragen (z. B. zwei Untergruppen wie
„Planung" und „Verwaltung", oder eine bewusste Reihenfolge nach
Nutzungshäufigkeit statt der aktuellen Code-Reihenfolge). Das ist ein
Vorschlag zur Feinabstimmung, kein akuter Fehler.

### Nicht geprüft
Die übrigen heutigen Änderungen aus `b7a5d95` (`EditMode.tsx`-
Enter-Handler, `Dashboard.tsx`-Ergänzungen) wurden nicht erneut geprüft,
da sie exakt den bereits im gestrigen Bericht (2026-08-28) bzw. den
vorangegangenen `it-chef-auto-log.md`-Einträgen gemeldeten Punkten
entsprechen und laut Quelltext wie beschrieben umgesetzt sind. Keine
Codeänderung in diesem Lauf, nur dieser Bericht.

---

## 2026-08-31 — Fehleranzeige bei Flug-/Unterkunftssuche im Chat (`useChat.ts`)

**Geprüfter Bereich:** Die beiden jüngsten IT-Chef-Auto-Fixes, die echte
Suchfehler von einer echten Null-Treffer-Suche unterscheidbar machen
(Commit `dc10361`, 2026-08-30, Unterkunftssuche; Commit `b9d0267`,
2026-08-31, Flugsuche) — noch in keinem Support-Chef-Lauf geprüft:

- `src/hooks/useChat.ts`
- `src/components/search/HotelResults.tsx`
- `src/components/search/FlightResults.tsx`
- `src/hooks/useChat.test.ts`

Zum Vergleich herangezogen: `src/lib/ai/mockAdvisor.ts` (der direkt davor,
am 2026-08-30, behobene „Sackgasse ohne Ausweg" beim Flug-Pfad des
Haupt-Chatflows, Commit `c2fff0b`).

### Reibungspunkte

**1. Beide neuen Fehlermeldungen können denselben Sackgasse-Typ
reproduzieren, den IT-Chef gerade erst im Hauptflow behoben hat — hier
aber im „Bearbeiten"-Suchpfad**

`useChat.ts:146-184` (`startEdit`, Zweig `accommodation`): Bevor die
Unterkunftssuche startet, wird `setQuickReplies(prompt.quickReplies)`
aufgerufen (Zeile 149) — und `editPrompts.accommodation.quickReplies`
ist laut Zeile 28-31 eine leere Liste `[]`. Schlägt die Suche fehl
(`.catch` in Zeile 173-176 setzt nur `setStayError(true)`), zeigt
`HotelResults.tsx:25-31` die Meldung „Die Unterkunftssuche hat gerade
nicht geklappt — versuch's gleich nochmal.“ — aber es gibt weder einen
Retry-Button noch irgendeinen Quick-Reply-Chip, nur ein leeres
Eingabefeld. Wer diesen Pfad über den „Bearbeiten"-Stift bei der
Unterkunfts-Sektion in `Buchung.tsx` (Aufgabe 6.10) auslöst und dann
einen Netzwerkfehler hat, sieht exakt die Art von Sackgasse, die laut
`ZEITPLAN.md` (Zeile 164-171/`mockAdvisor.ts`) erst gestern für den
Flug-Pfad des *Haupt*-Chatflows als Problem erkannt und behoben wurde
— hier ist sie nur an einer anderen Stelle noch vorhanden.

Derselbe Mechanismus betrifft den Flug-Suchpfad noch direkter, da er der
*einzige* Auslöser für eine echte Flugsuche im Chat ist (siehe
`mockAdvisor.ts:112-121`, Kommentar „Der Hauptchat-Ablauf löst die echte
Flugsuche aktuell nicht aus“): `useChat.ts:195-231` setzt
`setQuickReplies([])` (Zeile 225) unmittelbar bevor `runFlightSearch()`
aufgerufen wird (Zeile 229). Schlägt die Suche fehl (`.catch` in Zeile
98-101 von `runFlightSearch` selbst), zeigt `FlightResults.tsx:24-33`
zwar die neue, freundliche Fehlermeldung „Die Flugsuche hat gerade nicht
geklappt — versuch's gleich nochmal.“, aber auch hier bleiben die
Quick-Replies leer — keine „Neue Reise planen“-Option wie sie
`mockAdvisor.ts:126` für denselben Flug-Pfad an anderer Stelle jetzt
bewusst ergänzt.

Zum Vergleich: Der *Haupt*-Onboarding-Pfad zur Unterkunftssuche
(`useChat.ts:284-319`, ausgelöst nach dem Budget-Schritt) ist von diesem
Problem nicht betroffen, weil dort vor dem Suchstart bereits
`['Hotel', 'Ferienwohnung', 'Hostel']` als Quick-Replies gesetzt wurden
(`mockAdvisor.ts:103-108`) und bei einem Fehlschlag stehen bleiben — die
Nutzerin kann also weiterhin manuell eine Unterkunftsart wählen, auch
wenn die automatische Suche scheitert. Genau dieses Sicherheitsnetz
fehlt in den beiden „Bearbeiten“-Pfaden.

Auch die neuen Tests decken das nicht ab: `useChat.test.ts:105/129`
(Unterkunft) und `:222` (Flug) prüfen jeweils nur, dass `stayError`
bzw. `flightErrors` im Fehlerfall gesetzt werden — keiner der Tests
prüft, welchen Zustand `quickReplies` zu diesem Zeitpunkt hat.

*Vorschlag:* In beiden `.catch`-Zweigen (`useChat.ts:173-176` und
`runFlightSearch`s `.catch` in Zeile 98-101, plus dessen Aufrufstelle
in Zeile 225) zusätzlich `setQuickReplies(['Neue Reise planen'])`
setzen — exakt das Muster, das `mockAdvisor.ts:126` für den strukturell
selben Fall bereits etabliert hat. Eine Regressionsprüfung analog zu
`mockAdvisor.test.ts` (prüft dort explizit `quickReplies` nach dem
Flug-Ausweg-Fix) würde das künftig auch automatisiert abdecken.

### Nicht geprüft
Ein echter „Nochmal versuchen“-Button (statt nur eines textuellen
Hinweises „versuch's gleich nochmal“) wäre die vollständigere Lösung,
ist aber ein größerer Eingriff (müsste sich Origin/Ziel bzw.
Such-Parameter merken) — hier bewusst nur der kleinere, mit dem
gestrigen Fix konsistente Ausweg vorgeschlagen. Die eigentlichen
Fehlertexte selbst (Wortlaut, Ton) wurden nicht bemängelt — sie folgen
bereits demselben ehrlichen, undramatischen Muster wie der Rest der App.

---

## 2026-09-01 — Hotelsuche-Auswahl-Parität (`Hotelsuche.tsx`, `HotelCard.tsx`)

**Geprüfter Bereich:** Die drei jüngsten autonomen IT-Chef-Fixes von
heute (Commits `0042f68`, sechzehnter Lauf; `ce59905`, siebzehnter Lauf;
`ef5c69c`, achtzehnter Lauf — laut `ZEITPLAN.md` alle bereits über den
Freigabe-Chef nach `main` gemergt):

- `src/pages/Hotelsuche.tsx`
- `src/components/search/HotelCard.tsx`
- `src/pages/Flugsuche.tsx` (zum Vergleich, da `HotelCard`s neue
  `selected`-Prop laut ZEITPLAN.md bewusst analog zu `FlightCard`
  gebaut wurde)
- `src/lib/trip/tripStorage.ts`
- `src/components/layout/Sidebar.tsx`

Die Ergebnis-Reset-Korrektur (sechzehnter Lauf) und die Angleichung von
`ChevronsLeft`-Button-Labeling in `Sidebar.tsx` (achtzehnter Lauf) sind
sauber umgesetzt und decken sich mit dem bereits bestehenden,
funktionierenden Muster aus `Flugsuche.tsx` bzw. dem `title`-Fallback,
der die Sidebar-Links im eingeklappten Zustand schon vorher zugänglich
gehalten hat — dort kein weiterer Punkt.

### Reibungspunkte

**1. "Ausgewählt"-Häkchen bleibt stehen, obwohl die Auswahl laut
eigener Warnmeldung gerade NICHT gespeichert wurde**

`Hotelsuche.tsx:31-35` (`handleSelect`) ruft `updateStoredTrip(...)` auf
und zeigt bei `updated === null` eine eigene Warnung an
(`Hotelsuche.tsx:63-71`): "Es gibt noch keine aktive Reiseplanung, in
die ich diese Unterkunft übernehmen kann. Starte zuerst im KI-Chat,
dann kannst du hier auswählen." `updateStoredTrip` liefert laut
`tripStorage.ts:26-33` exakt dann `null`, wenn `loadStoredChat()`
nichts findet — also wenn noch nie im KI-Chat eine Reise begonnen
wurde.

Das Problem: `setSelectedOfferId(offer.id)` in Zeile 33 wird
unabhängig vom Ergebnis von `updateStoredTrip` gesetzt — also auch im
Fehlerfall. Die angeklickte `HotelCard` schaltet damit trotzdem sofort
auf den erfolgreichen Zustand um (`HotelCard.tsx:38-53`: Button
deaktiviert, Text "Ausgewählt" mit grünem Häkchen-Icon), obwohl im
selben Moment die Warnmeldung direkt darüber sagt, dass nichts
übernommen wurde. Wer die Meldung überfliegt (oder die Karte zuerst
anschaut), sieht nur ein abgehaktes "Ausgewählt" und geht vernünftigerweise
davon aus, die Unterkunft sei gespeichert — bis sie später in `/buchung`
fehlt. Der Button lässt sich wegen `disabled={selected}`
(`HotelCard.tsx:42`) auch nicht erneut anklicken, es gibt also innerhalb
derselben Kartenansicht keinen Weg, es nach dem Start einer Reise im
KI-Chat noch einmal zu versuchen — nur ein kompletter Reload/Neubesuch
der Seite setzt den lokalen State zurück.

Derselbe Mechanismus besteht identisch (und unverändert seit dem
10.08.-Bericht) in `Flugsuche.tsx:30-34`, da beide Seiten exakt dasselbe
`handleSelect`-Muster teilen — durch den heutigen Fix (siebzehnter Lauf)
ist er jetzt aber erstmals auch auf der Hotelsuche-Seite sichtbar, da
`HotelCard` vorher gar keinen visuellen "Ausgewählt"-Zustand kannte und
das Problem dort noch gar nicht auftreten konnte.

Auch die neuen Tests decken nur den Erfolgsfall ab: `Hotelsuche.test.tsx:59-81`
prüft ausschließlich, dass der Button bei einer erfolgreichen Auswahl
"Ausgewählt" wird — der Fall ohne aktive Reiseplanung (`updated === null`)
wird in keinem Test simuliert.

*Vorschlag:* `setSelectedOfferId(offer.id)` nur setzen, wenn
`updated !== null` ist — analog dazu, wie `selectionHasTrip` schon
jetzt den Erfolg abbildet. Im Fehlerfall bleibt der Button dann
weiterhin "Auswählen" und ist erneut klickbar, sobald über den
Warnhinweis eine Reise im KI-Chat begonnen wurde. Ein Regressionstest
analog zu `Hotelsuche.test.tsx:59-81`, aber mit `updateStoredTrip`
gemockt auf `null`, würde beide Fälle künftig unterscheiden. Da der
Fehler identisch in `Flugsuche.tsx` besteht, gehört derselbe Fix dort
mit dazu.

### Nicht geprüft
`HotelResults.tsx` (die Variante von `HotelCard`, die im KI-Chat selbst
statt auf der eigenständigen `/hotelsuche`-Seite verwendet wird) reicht
gar keine `selected`-Prop durch und zeigt daher nie einen
"Ausgewählt"-Zustand — das ist unverändert zum bisherigen Verhalten und
kein neuer Punkt aus dem heutigen Fix, daher hier nicht vertieft.

---

## 2026-09-02 — Urlaubsmodus-Concierge (`Urlaubsmodus.tsx`, `mockConcierge.ts`)

**Geprüfter Bereich:** Der Urlaubsmodus-Chat, laut `ZEITPLAN.md` (Phase 8,
Grundgerüst bereits länger fertig) heute Nacht vom autonomen IT-Chef-Lauf
(`e796c69`, dreiundzwanzigster Lauf) zuletzt angefasst — ein
Wortgrenzen-Bugfix in `findFacts()`, analog zum Vortags-Fix in
`findKnownDestination()` (`src/types/stays.ts`, zweiundzwanzigster Lauf).
Dieser Bereich stand bisher in keinem Support-Chef-Lauf mit Dateibezug:

- `src/pages/Urlaubsmodus.tsx`
- `src/hooks/useConcierge.ts`
- `src/lib/ai/mockConcierge.ts`
- `src/lib/ai/mockConcierge.test.ts`

Zum Vergleich herangezogen: `src/pages/Buchung.tsx` (Einstiegspunkt "Bereit
für die Reise?") und `src/pages/MeineReisen.tsx` (zweiter Einstiegspunkt
"Urlaubsmodus aktivieren").

### Reibungspunkte

**1. Ehrliche Konzierge-Antwort ist bei einem echten, aber nicht kuratierten
Reiseziel schlicht falsch**

`mockConcierge.ts:16-25` (`destinationFacts`) kennt nur acht kuratierte
Ziele (Lissabon, Kyoto, Kapstadt, Reykjavik, Paris, Rom, Barcelona, New
York). `findFacts()` (`:27-35`) liefert für jedes andere Ziel `null`, und
`getConciergeReply()` (`:44-63`) fällt dann auf denselben Satz zurück wie
im Fall ganz ohne Reiseziel: „Dafür brauche ich eine geplante Reise mit
Reiseziel — plane zuerst im KI-Chat, dann kann ich gezielter helfen."
(`:49`). Das ist bei einem Nutzer mit einer echten, im KI-Chat frei
eingetippten Reise nach z. B. „Bali" oder „Thailand" schlicht unwahr — eine
Reise mit Ziel existiert ja bereits.

Der Weg dorthin ist kein Randfall: `Buchung.tsx:273-289` zeigt die Karte
„Bereit für die Reise? … Aktiviere den Urlaubsmodus" mit dem Button
„Urlaubsmodus aktivieren" (`:286`), sobald `isTripComplete(trip)` zutrifft
— unabhängig davon, ob `trip.destination` einer der acht kuratierten Namen
ist. Das ist genau der vorgesehene, prominent beworbene Haupteinstieg in
den Urlaubsmodus für jede fertig geplante Reise, nicht nur für die
Demo-Ziele.

Verschärft wird das dadurch, dass `getConciergeGreeting()` (`:37-42`) und
die Quick-Replies in `useConcierge.ts:12` (`destination ? conciergeQuickReplies
: []`) beide nur prüfen, ob überhaupt ein `destination`-String vorhanden
ist — nicht, ob er in `destinationFacts` bekannt ist. Ein Nutzer mit Ziel
„Bali" sieht also zuerst die persönliche Begrüßung „Willkommen im
Urlaubsmodus für deine Reise nach Bali! Frag mich zu Währung,
Notrufnummern, Begrüßungsfloskeln …" inklusive der drei Quick-Reply-Chips
„Währung?"/„Notrufnummer?"/„Wie sage ich Hallo?" — und bekommt bei jedem
einzelnen Klick darauf exakt die Antwort, dass angeblich noch gar keine
Reise mit Reiseziel geplant sei. Die Begrüßung verspricht also etwas, das
die Antwortlogik im selben Atemzug dementiert.

`mockConcierge.test.ts:20-24` deckt nur den Fall „gar kein Ziel" (`null`)
mit demselben Fallback-Satz ab; ein Test für „echtes, aber nicht
kuratiertes Ziel" existiert nicht.

*Vorschlag:* Getrennte Texte für „kein Ziel geplant" und „Ziel geplant,
aber (noch) nicht in der kuratierten Liste" — z. B. für Letzteres „Für
{destination} habe ich noch keine hinterlegten Fakten, aber sobald die
echte KI-Anbindung aktiv ist, kann ich dir auch dazu helfen." Zusätzlich
`getConciergeGreeting()` und die Quick-Reply-Bedingung in
`useConcierge.ts:12`/`:26` auf `findFacts(destination) !== null` statt nur
auf `destination` selbst prüfen, damit Begrüßung und Chips nicht mehr
etwas ankündigen, das die Antwortlogik direkt danach verneint.

**2. Der Avatar wirkt bei den zwei ehrlichen Ausweich-Antworten unpassend
fröhlich**

`useConcierge.ts:25` setzt nach *jeder* Konzierge-Antwort unbedingt
`setAvatarState('happy')` — auch für die beiden Fälle in
`mockConcierge.ts`, in denen die Antwort inhaltlich eine Einschränkung
oder Ausweichung ist: den oben beschriebenen „kein/unbekanntes Ziel"-Fall
(`:49`) und die generische „Das ist eine Demo-Antwort … sobald die echte
KI-Anbindung aktiv ist" (`:62`). `TravixAvatar.tsx:5,13-14` hat mit
`'error'` bereits einen dafür passenderen, im Rest des Chats schon
etablierten Zustand (genutzt z. B. bei echten Suchfehlern in `useChat.ts`).
Der breit lächelnde „happy"-Avatar direkt neben einem Satz, der im Kern
sagt „das kann ich hier gerade nicht", wirkt inkonsistent zum sonst
ehrlichen, undramatischen Ton der App.

*Vorschlag:* In `useConcierge.ts:23-27` unterscheiden, ob `getConciergeReply`
eine der beiden Ausweich-Antworten oder eine echte Fakten-Antwort geliefert
hat (z. B. `getConciergeReply` einen kleinen `{ text, matched }`-Rückgabewert
geben lassen), und bei den Ausweich-Fällen einen neutraleren Avatar-Zustand
statt `'happy'` setzen.

### Nicht geprüft
Die Barrierefreiheit des Chat-Verlaufs (`aria-live` beim Eintreffen neuer
Nachrichten) wurde nicht gesondert untersucht — das fehlende `aria-live`
codebase-weit ist bereits seit dem Eintrag vom 20.08. (Kalender) bekannt
und kein neuer, hier eigenständiger Punkt. `ChatInput.tsx`/`ChatMessage.tsx`
selbst wurden nur als bereits an anderer Stelle geprüfte Bausteine
mitgelesen (Mikrofon-Fehleranzeige bereits am 25.08. behandelt), nicht
erneut vertieft.
