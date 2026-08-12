# Content-Stück — "Die ehrliche Kartenansicht" (Entwurf)

Entwurf — von Marketing-Chef im autonomen Tageslauf vorbereitet, wartet
auf Nis Freigabe. **Kein Post daraus wurde oder wird automatisch
veröffentlicht** — zum Copy-Paste gedacht, sobald Ni die jeweiligen
Kanäle live schaltet.

Erstellt: 2026-08-12
Bezug: `ZEITPLAN.md`, Marketing-Sprint 3/4 (laufende Content-Produktion,
Säule 1 "Ehrlichkeit als Feature") — setzt den eigenen Vorschlag aus
`reports/marketing-chef.md` (2026-08-11, Punkt 2) um: "Ein echter
Screenshot-Vergleich ... würde die Positionierung konkret statt
behauptet zeigen. Eigener kurzer Post, zusätzlich zu den schon
entworfenen Stücken."

## Produktstand, auf dem dieses Stück beruht (im Code geprüft, 12.08.2026)

`src/pages/Kartenansicht.tsx` (`/karte`), bereits nach `main` gemerged
(laut `ZEITPLAN.md` seit 11.08.):

- Zeigt einen Teal-Marker für das **echte, im KI-Chat geplante Reiseziel**
  (`known.name`, aus derselben kuratierten Koordinatenliste, die auch die
  echte Duffel-Suche nutzt) — kein fest verdrahteter Demo-Ort mehr.
- Ist noch nichts geplant oder ist das Ziel nicht in der Koordinatenliste,
  zeigt die Seite einen **ehrlichen Hinweis statt einer erfundenen
  Stadt**: "Noch keine Reise geplant" bzw. "Für dieses Ziel kenne ich noch
  keine Koordinaten für die Karte" — mit einem klaren nächsten Schritt
  ("Reise mit KI planen").
- Dezente Kartenbasis (CartoDB Positron, hell) statt bunter
  Standard-Kacheln, gemäß `MARKENDESIGN.md`.

Das ist ein konkretes, im Code nachprüfbares Beispiel für die
Positionierung "Ehrlichkeit als Feature" — kein Werbetext-Versprechen,
sondern eine tatsächliche Produktentscheidung (ehrlicher Leerzustand statt
Fantasie-Ort).

## Post — "Wir haben uns entschieden, keine Fantasie-Städte zu zeigen"

### LinkedIn

> Ein kleines, aber für uns wichtiges Detail aus dem Aufbau von travix.ai:
>
> Die Kartenansicht in unserem Prototyp zeigte lange einen festen
> Demo-Ort — unabhängig davon, was im Chat eigentlich geplant war. Sah gut
> aus in jeder Demo. War aber nicht ehrlich.
>
> Wir haben das geändert. Die Karte zeigt jetzt entweder das Ziel, das
> wirklich im Chat geplant wurde — oder, wenn noch nichts geplant ist,
> einen klaren Hinweis: "Noch keine Reise geplant." Kein erfundener Ort
> nur damit die Seite voll aussieht.
>
> Für uns ist das kein Nebendetail. Es ist dieselbe Entscheidung, die
> unseren KI-Chat sagen lässt "ich habe dazu noch keine Daten", statt eine
> Antwort zu erfinden — nur diesmal auf der Karte statt im Gespräch.

*Kein Bild-Zwang bei LinkedIn (siehe `content-plan.md`) — funktioniert
auch als reiner Text. Bildoption siehe unten, falls gewünscht.*

### Instagram

**Caption:**
> Ehrlich gesagt: unsere Kartenansicht hat lange eine Fantasie-Stadt
> gezeigt. Sah hübsch aus. War aber nicht echt.
>
> Jetzt zeigt sie dein wirklich geplantes Ziel — oder ehrlich gesagt: noch
> nichts. Kein erfundener Ort, nur damit die Seite voll wirkt.

**Bild-/Reel-Idee — zwei Optionen, siehe Design-Brief unten für Details:**
- **Option A (sicherer Standard, sofort umsetzbar):** Abstrakte
  Text-Gegenüberstellung in der bestehenden Gradient-Ästhetik
  (Navy→Teal→Gold) — kein echter Screenshot, zwei Textzeilen
  nebeneinander/übereinander: "Vorher: ein fester Fantasie-Ort" /
  "Jetzt: dein echtes Ziel — oder ehrlich: noch keins."
- **Option B (echter App-Screenshot):** Tatsächlicher Screenshot der
  Kartenansicht mit echtem Ziel-Marker, ggf. daneben der ehrliche
  Leerzustand. Wirkungsvoller, weil es das Produkt zeigt statt es nur zu
  behaupten — **aber:** `MARKENDESIGN.md` markiert "lockerere Bildsprache
  mit echten Screenshots für Social Content" noch als offene Frage
  (Abschnitt "Offen"), die bisher nicht entschieden ist. Empfehlung: Ni
  entscheidet das einmal grundsätzlich (nicht nur für diesen einen Post),
  dann lässt sich Option B jederzeit nachziehen, ohne den Text zu ändern.

**Hashtags (Vorschlag, nicht belegt durch Performance-Daten):**
`#buildinpublic #reiseplanung #traveltech #ehrlichkeit #ki`

## Canva-Design-Brief (für Option A, sofort umsetzbar ohne offene Entscheidung)

- **Format:** Instagram Post, 1080×1080 px.
- **Farben:** Verlauf Navy (`#0A2342`) → Teal (`#00C2A8`), diagonal von
  oben-links nach unten-rechts, wie im Hero-Bereich von `Home.tsx` (Werte
  aus `src/lib/design-tokens.ts`).
- **Font:** Bestehende Produkt-Schrift (siehe `design-tokens.ts`), keine
  Skript-/Handschrift-Fonts — passt nicht zum sachlichen Markenton.
- **Komposition:**
  - Obere Hälfte, durchgestrichen/gedimmt (z. B. 50% Deckkraft, dünne
    horizontale Linie darüber): "Vorher: ein fester Fantasie-Ort" in Weiß.
  - Untere Hälfte, voll sichtbar, Teal-Akzent: "Jetzt: dein echtes Ziel —
    oder ehrlich: noch keins." in Weiß/Gold-Akzent auf dem Wort "echtes".
  - Kein Kartensymbol/Pin-Icon nötig — reiner Text auf Verlauf, konsistent
    mit dem bereits etablierten "Im Aufbau."-Postmotiv aus
    `content-stuecke-woche1.md`.
  - Logo/Wortmarke klein unten rechts, wie bei bisherigen Post-Vorlagen.
- **Nicht:** kein Stockfoto, kein Screenshot-Rahmen-Mockup (Handy/Laptop),
  das würde Option B vorwegnehmen, bevor die Bildsprachen-Frage geklärt
  ist.

## Leitplanken (wiederholt aus `content-plan.md`, gelten weiter)

- Kein Post geht ohne Nis Freigabe raus.
- Kein CTA zu einer Warteliste, solange die nicht live ist (dieser Post
  hat ohnehin keinen CTA, bewusst reiner Beweis-/Positionierungs-Post).
- Keine erfundenen Kennzahlen.
- Vor dem tatsächlichen Posten: kurz im Code/`ZEITPLAN.md` prüfen, ob die
  beschriebene Kartenansicht-Funktionalität zum Zeitpunkt des Postens noch
  so stimmt wie hier beschrieben (Stand 12.08.2026 geprüft).
