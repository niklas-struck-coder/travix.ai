# Content-Stück — "Klarname statt Rohdaten" (Entwurf)

Entwurf — von Marketing-Chef im autonomen Tageslauf vorbereitet, wartet
auf Nis Freigabe. **Kein Post daraus wurde oder wird automatisch
veröffentlicht** — zum Copy-Paste gedacht, sobald Ni die jeweiligen
Kanäle live schaltet.

Erstellt: 2026-09-28
Bezug: `ZEITPLAN.md`, Marketing-Sprint 4 (laufende Content-Produktion,
Säule 1 "Ehrlichkeit als Feature") — setzt den eigenen Vorschlag aus
`reports/marketing-chef.md` (2026-09-27, Punkt 1) direkt um: *"Die
'Klarname statt Rohdaten'-Reihe als eigenes Mini-Thema bündeln [...]
Sobald die Fixes durch sind, reicht das für eine eigene kleine
Content-Einheit."* Bedingung dafür war, dass alle drei zugehörigen Fixes
durch sind — das ist heute der Fall.

## Produktstand, auf dem dieses Stück beruht (im Code geprüft, 28.09.2026)

Drei einzelne, über rund fünf Wochen gemeldete und nacheinander
behobene Funde in `FlightCard.tsx`/`TrainCard.tsx`, alle inzwischen auf
`main` gemergt:

1. **Klarname statt IATA-Code.** Bis zum 26.09. zeigte `FlightCard.tsx`
   am Abflug-/Ankunftsort den rohen IATA-Code (z.B. "FRA") statt eines
   lesbaren Ortsnamens. Fix vom 27.09. (`e3e3a40`): `formatLocation()`
   bevorzugt jetzt den Klarnamen, fällt nur auf den IATA-Code zurück,
   wenn kein Name vorliegt (`src/components/search/FlightCard.tsx`,
   Zeile 28-30: `function formatLocation(name: string, iata: string) {
   return name || iata || '—' }`).
2. **Hinflug/Rückflug klar benannt.** Fix vom 25.09. (`efda747`): jeder
   Flugabschnitt trägt jetzt sichtbar das Label "Hinflug" bzw.
   "Rückflug" statt zwei optisch gleiche Blöcke ohne Zuordnung zu zeigen
   (`FlightCard.tsx`, Zeile 50).
3. **Kein leerer Text bei fehlendem Namensfeld.** Fix vom 27.09.
   (`f06700e`): sowohl `FlightCard.tsx` als auch `TrainCard.tsx` zeigen
   jetzt "—" statt eines leeren Felds, wenn weder Klarname noch
   IATA-Code vorliegen (`TrainCard.tsx`, Zeile 23-25: `function
   formatLocation(name: string) { return name || '—' }`).

Alle drei Fixes sind unabhängig entstanden (drei separate Funde über
mehrere Tage), ergeben zusammen aber eine einzige, klare Erzählung:
travix.ai zeigt an jeder Stelle, was ein Mensch versteht, nicht was die
Buchungs-API technisch liefert — und korrigiert das öffentlich sichtbar,
sobald es das (noch) nicht tut.

## Was dieses Stück bewusst NICHT behauptet

- Keine Aussage, dass es diese Rohdaten-Anzeige "nie" gab — im Gegenteil,
  die Pointe des Posts ist gerade, dass sie es zeitweise gab und jetzt
  behoben ist. Kein Beschönigen der eigenen Historie.
- Keine erfundenen Nutzerzahlen oder Aussagen dazu, wie oft Nutzer:innen
  davon "genervt" waren — es gibt noch keine echten Nutzer:innen, die
  das gemeldet haben. Die Fixes kamen aus interner Prüfung (IT-Chef/
  Support-Chef), nicht aus Nutzer-Feedback — der Post behauptet auch
  nichts anderes.
- Kein Vergleich zu konkreten Konkurrenzprodukten.

## Post — "Klarname statt Rohdaten"

### LinkedIn

> Kleines Detail, das uns wichtig ist: Bis vor wenigen Tagen zeigte
> travix.ai bei Flug- und Zugverbindungen teils noch rohe Flughafen-Codes
> statt lesbarer Ortsnamen, und zwei Flugabschnitte ohne erkennbares
> "Hinflug"/"Rückflug"-Label.
>
> Beides ist jetzt behoben — Klarname statt Code, klar benannte
> Abschnitte, und ein sauberes "—" statt einer leeren Stelle, wenn
> wirklich mal keine Daten vorliegen.
>
> Kein großer Launch, kein Feature im klassischen Sinn. Aber genau die
> Art Detail, die uns wichtiger ist als ein weiteres Buzzword: zeig,
> was ein Mensch versteht — nicht das, was die Schnittstelle liefert.

*Kein Bild-Zwang bei LinkedIn (siehe `content-plan.md`) — funktioniert
auch als reiner Text. Bildoption siehe unten.*

### Instagram

**Caption:**
> "FRA → CDG" ist kein Ortsname. Wir haben das gerade selbst gemerkt und
> korrigiert: Flug- und Zugkarten zeigen jetzt lesbare Ortsnamen statt
> Codes, klar benannte Hin-/Rückflüge, und "—" statt leerer Felder. ✈️🚆
>
> Kleines Update, aber genau unser Stil: lieber leise nachbessern als
> laut ankündigen.

**Bild-/Reel-Idee:** Zwei-geteilte Komposition (Vorher/Nachher) in der
Gradient-Ästhetik (siehe Design-Brief unten) — links abstrakt
angedeutete Codezeichen ("FRA", kleine Monospace-Schrift, blass/
gedämpft), rechts derselbe Bereich mit einem lesbaren Ortsnamen-Platzhalter
("Frankfurt") in der normalen Produkt-Schrift, deutlich klarer/heller.
Kein Screenshot der echten Seite (siehe Hinweis unten zur offenen
Bildsprachen-Frage).

**Hashtags (Vorschlag, nicht belegt durch Performance-Daten):**
`#buildinpublic #reiseplanung #ehrlichkeit #ux #kleinedetails`

## Canva-Design-Brief (sofort umsetzbar ohne offene Entscheidung)

- **Format:** Instagram Post, 1080×1080 px.
- **Farben:** Hintergrund Verlauf Navy (`#0A2342`) → Teal (`#00C2A8`),
  Werte aus `src/lib/design-tokens.ts`, wie in bisherigen Post-Vorlagen.
- **Font:** Bestehende Produkt-Schrift (`design-tokens.ts`) rechts; links
  bewusst eine Monospace-/Code-Schrift als Kontrast-Stilmittel (einziger
  Ort, an dem eine Zweitschrift Sinn ergibt — steht hier für "Rohdaten").
- **Komposition:**
  - Vertikale Trennlinie mittig, links/rechts exakt gleich groß — keine
    Seite dominiert optisch.
  - Links: "FRA" (oder ähnlicher Platzhalter-Code) in gedämpftem
    Grau/Navy-Ton, klein, mit dezentem "Vorher"-Label darunter.
  - Rechts: "Frankfurt" (Platzhalter) in Weiß/Teal, größer, mit dezentem
    "Jetzt"-Label darunter.
  - Ein dünner Pfeil oder Gold-Akzent (`#F4B400`) zwischen beiden Seiten,
    der die Richtung Vorher→Jetzt andeutet, ohne die Fläche zu überladen.
  - Logo/Wortmarke klein unten rechts, wie bei bisherigen Post-Vorlagen.
- **Nicht:** kein Screenshot-Rahmen-Mockup der echten Flug-/Zugkarte —
  `MARKENDESIGN.md` markiert "echte Screenshots für Social Content" nach
  wie vor als offene Grundsatzfrage (Abschnitt "Offen"). Sobald Ni das
  entscheidet, lässt sich ein Screenshot-Post jederzeit nachziehen, ohne
  den Text hier zu ändern.

## Leitplanken (wiederholt aus `content-plan.md`, gelten weiter)

- Kein Post geht ohne Nis Freigabe raus.
- Kein CTA zu einer Warteliste, solange die nicht live ist (dieser Post
  hat bewusst keinen harten CTA, reiner Ehrlichkeits-/Detail-Post).
- Keine erfundenen Kennzahlen.
- Vor dem tatsächlichen Posten: kurz im Code prüfen, ob `FlightCard.tsx`/
  `TrainCard.tsx` zum Zeitpunkt des Postens noch so aussehen wie hier
  beschrieben (Stand 28.09.2026 geprüft, Commits `e3e3a40`, `efda747`,
  `f06700e`).

## Hinweis zur Freigabe-Übersicht

`marketing/freigabe-uebersicht.md` kennt dieses Stück noch nicht —
bewusst nicht aktualisiert in diesem Lauf, um keine weitere Datei
parallel zu diesem eigentlichen Content-Stück anzufassen. Einordnung für
den nächsten Blick darauf: technisch vollständig postbar (alle drei
zugrunde liegenden Fixes sind gemergt), aber wie die anderen
Content-Stücke abhängig von Nis genereller Freigabe-Entscheidung, welche
Kanäle wann angelegt werden.
