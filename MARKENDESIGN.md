# Markendesign travix.ai

Gemeinsame Referenz für Marketing-Chef und IT-Chef, damit beide an
derselben Markenidentität arbeiten, ohne live miteinander sprechen zu
können. **Marketing-Chef pflegt diese Datei** (Markenstimme, Positionierung,
Design-Vorgaben) — **IT-Chef liest sie vor jeder UI-/Design-Arbeit** und
hält sich daran, statt eigene Stil-Entscheidungen zu treffen.

Zuletzt aktualisiert: 2026-08-09 von Marketing-Chef

## Positionierung

**Ein Satz:** travix.ai ist das digitale Reisebüro, das ehrlich bleibt,
wo andere tricksen — echte Angebote statt erfundener Countdown-Timer und
"nur noch 2 Zimmer übrig"-Panikmache, geführt von einer KI, die wie ein
guter Berater eine Frage nach der anderen stellt statt dich mit einem
Formular zu erschlagen.

**Woher das kommt:** Das ist keine erfundene Behauptung, sondern schon im
Produkt selbst eingebaut — der KI-Chat sagt aktiv Dinge wie *"Nichts wird
erfunden"* und *"sobald ich etwas Verifiziertes gefunden habe, zeige ich
es dir"* (`src/lib/ai/mockAdvisor.ts`). Das ist der eigentliche
Markenkern: **Ehrlichkeit als Feature, nicht als Kleingedrucktes.**

**Tagline (bereits im Code, `index.html`):** "Das intelligenteste
digitale Reisebüro" — als Titel-Tag schon gesetzt. Für Marketing-Zwecke
(Landingpage, Warteliste) gerne wörtlich weiterverwenden.

**Abgrenzung:** Die meisten Reiseplattformen verkaufen über künstliche
Dringlichkeit (Preisdruck, Verknappung). travix.ai macht das Gegenteil —
Transparenz und Geduld ("ich frage lieber einmal mehr nach, als etwas
Falsches anzunehmen"). Das sollte sich in JEDER Kommunikation zeigen:
keine Rabatt-Countdown-Ästhetik, keine "Nur noch heute"-Sprache, auch
nicht in Marketing-Kampagnen später.

## Zielgruppe (vorläufig, keine echten Nutzerdaten vorhanden)
Es gibt noch keine echte Nutzerforschung — travix.ai ist Pre-Launch.
Das Produkt selbst gibt aber einen Hinweis: der KI-Chat ersetzt bewusst
komplexe Multi-Filter-Suchformulare durch ein Gespräch. Das deutet auf
eine Zielgruppe, die von klassischen Reiseportalen (zu viele Filter, zu
viele Tabs offen, Preisangst durch künstliche Verknappung) genervt ist,
statt Reiseplanung als Hobby zu lieben. Vorläufige Persona: **"Die
erschöpfte Planerin"** — will eine gute Reise, keine Nebenbeschäftigung
als Reise-Rechercheurin. Sobald echte Nutzerdaten da sind, hier
korrigieren statt daran festhalten.

## Markenstimme
- **Per du**, direkt, warm — nie steif oder corporate.
- **Ehrlich statt verkäuferisch.** Lieber "das kann ich noch nicht" als
  eine vage Ausrede. Lieber "ich hab dazu keine Daten" als eine
  geschönte Antwort.
- **Ein Gedanke nach dem anderen** — Sätze und UI-Texte kurz halten,
  nicht mit Nebeninformationen überladen (spiegelt das "eine Frage nach
  der anderen"-Prinzip des KI-Chats auch textlich).
- **Kein Marketing-Sprech in der Produkt-UI selbst.** Buzzwords,
  Ausrufezeichen-Überschwang und "Jetzt buchen!!"-Dringlichkeit gehören
  in eine externe Kampagne, wenn überhaupt — niemals in die App.

## Bildsprache
Kein Stockfoto-Einsatz bisher, sondern abstrakte Gradient-Flächen (Navy →
Teal → Gold, siehe `Home.tsx` Hero-Sektion und Destination-Karten) plus
weiche, verwaschene Glow-Kreise im Hintergrund. **Das sollte das visuelle
Erkennungszeichen bleiben, nicht durch generische Reise-Stockfotos
(Strand, Kofferpacken, Flugzeugfenster) ersetzt werden** — die sehen auf
jeder zweiten Reiseseite gleich aus, unsere Gradient-Ästhetik ist bereits
unterscheidbar. Neue Seiten mit Bildbedarf (z.B. Kartenansicht) sollen
diese Sprache fortführen: Farbverläufe aus navy/teal/gold, keine
Fotografie, keine Icons-Overkill.

## Design-Vorgaben für kommende Seiten (aus ZEITPLAN.md)

**Dashboard:** Kennzahlen (Budget genutzt, Reisen geplant etc.) sollen
ruhig wirken, nicht wie ein Trading-Terminal. Teal für positive/normale
Werte, Gold für Highlights (z.B. "fast fertig geplant") — **niemals Rot
für Budget-Warnungen**, das wirkt bei einer Reiseplattform unnötig
alarmierend statt hilfreich. Bei Überschreitung lieber neutrale Formulierung
("Budget überschritten um X €") in gedecktem Grau/Navy statt Rot-Schock.

**Leere Zustände (Kalender, Budget, Aktivitäten, Favoriten, Preisalarme,
bevor Inhalte existieren):** Sollen ermutigend klingen, nicht wie eine
Fehlermeldung — Vorbild ist der bereits bestehende Empty State auf der
Reiseplan-Seite ("Noch keine Reise geplant" + Button "Reise mit KI
planen"). Muster: kurzer, freundlicher Satz + ein klarer nächster
Schritt als Button, nie ein trockenes "Keine Daten vorhanden".

**Fehlermeldungen (allgemein):** Ehrlich und konkret statt generisch —
folgt demselben Prinzip wie der KI-Chat ("Ich möchte dein Transportmittel
nicht falsch verstehen — bitte wähle eine Option aus" statt "Ungültige
Eingabe"). Sag was schiefging und was als Nächstes zu tun ist.

**Kartenansicht:** Marker/Highlights in Teal oder Gold auf einer
dezenten, nicht zu bunten Kartenbasis — Navy sollte auf der Karte selbst
nicht als Flächenfarbe dominieren, das wurde bisher nur für UI-Chrome
(Sidebar, Hero) verwendet, nicht für Inhaltsflächen.

**Warenkorb/Preisalarme:** Auch hier keine künstliche Dringlichkeit
("Preis steigt bald!") — falls ein Preis sich wirklich geändert hat,
sachlich zeigen ("Preis hat sich seit deiner letzten Ansicht geändert:
X € statt Y €"), nicht dramatisieren.

## Offen — noch zu klären, sobald relevant
- Echte Zielgruppen-Segmentierung, sobald erste Nutzerdaten/Feedback da sind
- Ob für Social-Media-Content (nicht die Produkt-UI) eine lockerere
  Bildsprache mit echten Fotos sinnvoll ist — Produkt-UI bleibt aber
  Gradient-Ästhetik

## Wie das genutzt wird
- **Marketing-Chef:** Positionierung/Zielgruppe hier aktuell halten,
  sobald neue Erkenntnisse da sind (echte Nutzerdaten, Kampagnen-Learnings).
- **IT-Chef:** Vor jeder UI-/Design-Arbeit diese Datei lesen. Bei
  Widerspruch zwischen eigener Intuition und dieser Datei: Datei gewinnt.
  Für hier nicht abgedeckte Fälle: Ton und Bildsprache oben als Leitplanke
  nehmen (ehrlich, ruhig, keine künstliche Dringlichkeit, Gradient statt
  Stockfoto), nicht neu erfinden.
