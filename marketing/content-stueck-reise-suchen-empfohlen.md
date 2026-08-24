# Content-Stück — "Drei Wege, eine Empfehlung" (Entwurf)

Entwurf — von Marketing-Chef im autonomen Tageslauf vorbereitet, wartet
auf Nis Freigabe. **Kein Post daraus wurde oder wird automatisch
veröffentlicht** — zum Copy-Paste gedacht, sobald Ni die jeweiligen
Kanäle live schaltet.

Erstellt: 2026-08-24
Bezug: `ZEITPLAN.md`, Marketing-Sprint 3/4 (laufende Content-Produktion,
Säule 2 "Ein Gespräch statt ein Formular") — setzt den eigenen Vorschlag
aus `reports/marketing-chef.md` (2026-08-22, Punkt 1) direkt um: *"Danach
ist die Seite [`/reise-planen`] ein natürlicher Kandidat für ein 'So
startest du bei uns'-Content-Stück"* — Bedingung dafür war, dass der
zuvor gemeldete Badge-Bug erst behoben wird. Laut `reports/marketing-chef.md`
(2026-08-23) war das gestern noch nicht der Fall ("weiterhin nicht
behoben"). Heute ist es das.

## Produktstand, auf dem dieses Stück beruht (im Code geprüft, 24.08.2026)

`src/pages/ReiseSuche.tsx` (`/reise-planen`), aktueller Stand auf `main`
nach dem heutigen IT-Chef-Merge:

- Drei gleichwertig aufgebaute Karten als Einstieg in die Reiseplanung:
  KI-Chat, Flugsuche, Hotelsuche — kein Weg ist technisch versteckt oder
  erzwungen.
- Die KI-Chat-Karte trägt jetzt ein **tatsächlich sichtbares** `Empfohlen`-
  Badge (`<Badge className="bg-teal text-navy ...">Empfohlen</Badge>`,
  Zeile 55 in `ReiseSuche.tsx`) — vorher war die Hervorhebung nur eine
  CSS-Randfarbe (`border-teal/40`), die durch die interne `ring-1`-Logik
  der `Card`-Komponente optisch nicht ankam. Das war der Bug, den der
  Support-Chef am 23.08. gemeldet und dieses Team seither zweimal in
  Folge als Grund genannt hat, die Seite noch nicht zu bewerben (siehe
  `reports/marketing-chef.md`, 22./23.08.).
- Flugsuche/Hotelsuche-Karten beschreiben wahrheitsgemäß "echte
  Testangebote" (Duffel-Testdaten) — keine Übertreibung, direkt aus dem
  Quelltext übernommen.

Das ist ein doppelt gutes Beispiel für die eigene Positionierung: **Ein
Gespräch statt ein Formular** (KI-Chat als empfohlener, aber nicht
einziger Weg — niemand wird in den Chat gezwungen) UND **Ehrlichkeit als
Feature** (eine Empfehlung, die auch wirklich sichtbar ist, statt nur
behauptet zu werden — der Bug-Fix selbst ist die Pointe).

## Was dieses Stück bewusst NICHT behauptet

- Keine Aussage, dass die Flugsuche im KI-Chat durchgängig funktioniert —
  der bekannte Flugsuche-Chat-Bug (`reports/it-chef.md`, weiterhin offen)
  bleibt vom aktiven Werbe-Stopp erfasst. Dieser Post bewirbt die
  **eigenständige** Flugsuche-Karte (`/flugsuche`, funktioniert laut
  IT-Chef einwandfrei) und den KI-Chat als Einstiegspunkt generell — nicht
  eine Flugsuche-Funktion innerhalb des Chats.
- Keine erfundenen Nutzerzahlen oder Kennzahlen dazu, welcher Weg beliebter
  ist — es gibt noch keine echten Nutzer:innen.

## Post — "Drei Wege, eine Empfehlung"

### LinkedIn

> Neu auf travix.ai: eine Seite, die dir drei Wege in die Reiseplanung
> zeigt, statt dich in einen zu zwingen.
>
> Du kannst mit unserem KI-Chat planen (den empfehlen wir — deshalb steht
> jetzt auch sichtbar "Empfohlen" auf der Karte), oder direkt selbst nach
> Flügen oder Unterkünften suchen. Alle drei Wege funktionieren
> eigenständig.
>
> Kleine Randnotiz, die zu uns passt: Bis heute war diese Empfehlung technisch
> unsichtbar — ein CSS-Detail sorgte dafür, dass die Hervorhebung im Code
> stand, aber niemand sie sehen konnte. Jetzt ist sie es. Wir erwähnen das,
> weil "ehrlich sichtbar machen, was wir eigentlich meinen" für uns kein
> Slogan ist, sondern etwas, das wir auch an uns selbst überprüfen.

*Kein Bild-Zwang bei LinkedIn (siehe `content-plan.md`) — funktioniert
auch als reiner Text. Bildoption siehe unten.*

### Instagram

**Caption:**
> Drei Wege, eine Reise zu planen. Wir empfehlen einen davon (das Gespräch
> mit unserem KI-Chat) — aber niemand wird da reingezwungen. 💬
>
> Kleines Ehrlichkeits-Detail: Die "Empfohlen"-Markierung war bis heute
> technisch da, aber unsichtbar. Jetzt sieht man sie auch.

**Bild-/Reel-Idee:** Abstrakte Drei-Spalten-Komposition in der
Gradient-Ästhetik (siehe Design-Brief unten) — eine Spalte hervorgehoben
mit dem Wort "Empfohlen", die anderen zwei gleichwertig daneben, keine
davon ausgegraut oder kleiner. Kein Screenshot der echten Seite (siehe
Hinweis unten zur offenen Bildsprachen-Frage).

**Hashtags (Vorschlag, nicht belegt durch Performance-Daten):**
`#buildinpublic #reiseplanung #ehrlichkeit #ki #ux`

## Canva-Design-Brief (Option A, sofort umsetzbar ohne offene Entscheidung)

- **Format:** Instagram Post, 1080×1080 px.
- **Farben:** Hintergrund Verlauf Navy (`#0A2342`) → Teal (`#00C2A8`),
  Werte aus `src/lib/design-tokens.ts`, wie in bisherigen Post-Vorlagen.
- **Font:** Bestehende Produkt-Schrift (`design-tokens.ts`), keine
  Skript-/Handschrift-Fonts.
- **Komposition:**
  - Drei schmale, vertikale Flächen/Karten nebeneinander, gleich groß —
    keine optische Hierarchie durch Größe, nur durch Farbe.
  - Mittlere oder linke Karte (entspricht KI-Chat) mit Gold-Akzentrahmen
    (`#F4B400`) und kleinem "Empfohlen"-Schriftzug oben, die anderen zwei
    in reinem Weiß/Teal-Outline ohne Badge.
  - Darunter zentriert die Headline "Drei Wege. Eine Empfehlung." in Weiß.
  - Kein Icon-Overkill — höchstens drei sehr reduzierte Symbole (Chat-
    Blase, Flugzeug, Bett), dünn/outline-Stil, keine bunten Illustrationen.
  - Logo/Wortmarke klein unten rechts, wie bei bisherigen Post-Vorlagen.
- **Nicht:** kein Screenshot-Rahmen-Mockup der echten `/reise-planen`-Seite
  — `MARKENDESIGN.md` markiert "echte Screenshots für Social Content" nach
  wie vor als offene Grundsatzfrage (Abschnitt "Offen"). Sobald Ni das
  entscheidet, lässt sich ein Screenshot-Post jederzeit nachziehen, ohne
  den Text hier zu ändern.

## Leitplanken (wiederholt aus `content-plan.md`, gelten weiter)

- Kein Post geht ohne Nis Freigabe raus.
- Kein CTA zu einer Warteliste, solange die nicht live ist (dieser Post
  hat bewusst keinen harten CTA, reiner Positionierungs-/Feature-Post).
- Keine erfundenen Kennzahlen.
- Vor dem tatsächlichen Posten: kurz im Code/`ZEITPLAN.md` prüfen, ob
  `/reise-planen` und der Badge-Zustand zum Zeitpunkt des Postens noch so
  aussehen wie hier beschrieben (Stand 24.08.2026 geprüft), und ob der
  Flugsuche-Chat-Bug (siehe `reports/it-chef.md`) inzwischen behoben ist —
  falls ja, kann der einschränkende Hinweis oben entfallen.

## Hinweis zur Freigabe-Übersicht

`marketing/freigabe-uebersicht.md` (Stand 21.08.) kennt dieses Stück noch
nicht — bewusst nicht aktualisiert in diesem Lauf, um keine weitere
Datei parallel zu diesem eigentlichen Content-Stück anzufassen. Einordnung
für den nächsten Blick darauf: technisch vollständig postbar (kein
offener Bug in den beworbenen Wegen), aber wie die anderen Tier-1-Stücke
abhängig von Nis genereller Freigabe-Entscheidung, welche Kanäle wann
angelegt werden.
