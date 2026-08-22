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
