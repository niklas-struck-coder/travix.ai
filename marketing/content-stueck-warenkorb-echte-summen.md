# Content-Stück — "Echte Zahlen, keine Show" (Entwurf)

Entwurf — von Marketing-Chef im autonomen Tageslauf vorbereitet, wartet
auf Nis Freigabe. **Kein Post daraus wurde oder wird automatisch
veröffentlicht** — zum Copy-Paste gedacht, sobald Ni die jeweiligen
Kanäle live schaltet.

Erstellt: 2026-08-18
Bezug: `ZEITPLAN.md`, Marketing-Sprint 3/4 (laufende Content-Produktion,
Säule 1 "Ehrlichkeit als Feature") — folgt dem Muster aus
`content-plan.md`, Woche 3, Post A: "Einblick in einen konkreten
Baustein ... nur posten, sobald der jeweilige Stand wirklich erreicht
ist." Das ist hier der Fall: 7.6 `Warenkorb.tsx` wurde laut
`ZEITPLAN.md` am 17.08. fertig.

## Produktstand, auf dem dieses Stück beruht (im Code geprüft, 18.08.2026)

`src/pages/Warenkorb.tsx` und `src/lib/trip/cartTotals.ts`:

- Der Warenkorb gruppiert ausgewählte Leistungen nach Typ (Flüge,
  Unterkünfte, Transport, Aktivitäten, Versicherung), zeigt pro Gruppe
  eine Zwischensumme und unten eine Gesamtsumme.
- Beide Summen werden über reine Hilfsfunktionen (`groupCartItems`,
  `calculateCartTotal`) **direkt aus den aktuell vorhandenen Positionen
  neu berechnet** — nicht aus einem separat gepflegten, potenziell
  veralteten Summenfeld. Entfernt man eine Position (`removeItem` in
  `Warenkorb.tsx`, Zeile 35-37), aktualisieren sich Zwischen- und
  Gesamtsumme im selben Render, mit Unit-Tests in `cartTotals.test.ts`
  abgesichert.
- Der leere Zustand ist ehrlich formuliert ("Noch nichts im Warenkorb")
  mit einem klaren nächsten Schritt (Button "Reise mit KI planen"),
  keine erfundene Beispiel-Position.
- Kein Buchungs-/Bezahl-Button vorhanden — das bleibt bewusst
  `TripItem.tsx`/6.2 ("Beim Anbieter buchen"), ein eigener, weiterhin
  offener Punkt. Dieser Post bewirbt also nur das, was heute wirklich
  da ist: Übersicht und echte Summen, kein Checkout.
- Rein lokaler Demo-State (Cart-Entity fehlt noch, hängt an der offenen
  Backend-Entscheidung) — das Feature selbst (Gruppierung + echte
  Neuberechnung) funktioniert aber bereits vollständig im Prototyp.

Das trifft genau die Design-Vorgabe, die `MARKENDESIGN.md` explizit für
diese Seite festhält: *"Warenkorb/Preisalarme: Auch hier keine
künstliche Dringlichkeit ... falls ein Preis sich wirklich geändert
hat, sachlich zeigen ... nicht dramatisieren."* Der Warenkorb zeigt
also nicht nur nüchterne Zahlen an, sondern rechnet sie bei jeder
Änderung wirklich neu — kein Preisdruck, keine Show, nur der aktuelle
Stand.

## Post — "Echte Zahlen, keine Show"

### LinkedIn

> Kleines Update aus dem Aufbau von travix.ai:
>
> Der Warenkorb unseres Prototyps zeigt jetzt Flüge, Unterkünfte,
> Transport, Aktivitäten und Versicherung gruppiert nach Typ an — mit
> Zwischensumme pro Gruppe und einer Gesamtsumme unten.
>
> Klingt nach Standard-E-Commerce. Der Unterschied steckt im Detail: die
> Summen sind keine Zahl, die irgendwo einmal berechnet und dann
> angezeigt wird. Sie werden bei jeder Änderung — z. B. wenn man eine
> Position entfernt — direkt aus den aktuell vorhandenen Positionen neu
> gerechnet. Kein "Preis steigt bald"-Countdown, keine künstliche
> Dringlichkeit. Nur die Zahl, die gerade wirklich stimmt.
>
> Für uns ist das keine Kleinigkeit, sondern gelebte Positionierung:
> ehrliche Zahlen statt Verkaufsdruck, auch an einer Stelle, an der
> andere Portale gerne mit Countdown-Timern arbeiten.

*Kein Bild-Zwang bei LinkedIn (siehe `content-plan.md`) — funktioniert
auch als reiner Text. Bildoption siehe unten, falls gewünscht.*

### Instagram

**Caption:**
> Dein Warenkorb bei travix.ai zeigt Flüge, Unterkünfte, Transport,
> Aktivitäten und Versicherung sauber gruppiert — mit Zwischensummen
> und einer Gesamtsumme.
>
> Und die Summen sind echt: Entfernst du eine Position, wird sofort neu
> gerechnet. Kein "nur noch kurze Zeit zu diesem Preis" — nur der
> aktuelle Stand. 🙂

**Bild-/Reel-Idee (Option A, sicherer Standard, sofort umsetzbar):**
Abstrakte Text-Gegenüberstellung in der bestehenden Gradient-Ästhetik
(Navy→Teal→Gold), analog zum bereits etablierten Muster aus
`content-stueck-ehrliche-kartenansicht.md` und
`content-stueck-aktivitaeten-bearbeiten.md` — kein echter Screenshot,
siehe Design-Brief unten für den Grund. Ein zweiter, wirkungsvollerer
echter App-Screenshot des gruppierten Warenkorbs (Option B) wäre
möglich, bleibt hier aber aus demselben Grund wie bei den letzten
Content-Stücken bewusst unausgearbeitet: `MARKENDESIGN.md` markiert
"echte Screenshots für Social Content ja/nein" weiterhin als offene
Grundsatzfrage, keine, die dieser Lauf selbst entscheiden sollte.

**Hashtags (Vorschlag, nicht belegt durch Performance-Daten):**
`#buildinpublic #reiseplanung #traveltech #ki #ehrlichkeit`

## Canva-Design-Brief (für Option A, sofort umsetzbar ohne offene Entscheidung)

- **Format:** Instagram Post, 1080×1080 px.
- **Farben:** Verlauf Navy (`#0A2342`) → Teal (`#00C2A8`), diagonal von
  oben-links nach unten-rechts, wie im Hero-Bereich von `Home.tsx` (Werte
  aus `src/lib/design-tokens.ts`).
- **Font:** Bestehende Produkt-Schrift (Sora für Headlines, Inter für
  Fließtext, siehe `design-tokens.ts`), keine Skript-/Handschrift-Fonts.
- **Komposition:**
  - Obere Hälfte: "Kein Countdown." in Weiß, normale Deckkraft, mit
    einem dezenten durchgestrichenen Uhr-Symbol als kleines Icon
    darüber (keine reale Uhr-Grafik, nur eine simple Linienform).
  - Untere Hälfte, Teal-Akzent: "Nur die echte Summe." in Weiß, mit
    Gold-Akzent auf "echte".
  - Kleines Warenkorb-Symbol (analog zum `ShoppingCart`-Icon aus
    `Warenkorb.tsx`) dezent zwischen den beiden Textzeilen, keine
    Screenshot-Rahmen-Mockups.
  - Logo/Wortmarke klein unten rechts, wie bei bisherigen
    Post-Vorlagen.
- **Nicht:** kein Stockfoto, kein Handy-/Laptop-Mockup mit echtem
  Screenshot — würde Option B vorwegnehmen, bevor die
  Bildsprachen-Grundsatzfrage in `MARKENDESIGN.md` geklärt ist. Auch
  keine echte Uhr-/Countdown-Grafik in Rot oder Orange, das würde genau
  der Aussage widersprechen, die der Post macht.

## Leitplanken (wiederholt aus `content-plan.md`, gelten weiter)

- Kein Post geht ohne Nis Freigabe raus.
- Kein CTA zu einer Warteliste, solange die nicht live ist (dieser Post
  hat ohnehin keinen CTA, bewusst reiner Fortschritts-Post).
- Keine erfundenen Kennzahlen.
- Vor dem tatsächlichen Posten: kurz im Code/`ZEITPLAN.md` prüfen, ob die
  beschriebene Warenkorb-Funktionalität zum Zeitpunkt des Postens noch so
  stimmt wie hier beschrieben (Stand 18.08.2026 geprüft) — insbesondere,
  dass weiterhin kein Buchungs-/Bezahl-Button (6.2) fälschlich
  mitbeworben wird.
