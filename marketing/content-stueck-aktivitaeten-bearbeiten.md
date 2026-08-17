# Content-Stück — "Deine Reise ist keine Einbahnstraße" (Entwurf)

Entwurf — von Marketing-Chef im autonomen Tageslauf vorbereitet, wartet
auf Nis Freigabe. **Kein Post daraus wurde oder wird automatisch
veröffentlicht** — zum Copy-Paste gedacht, sobald Ni die jeweiligen
Kanäle live schaltet.

Erstellt: 2026-08-17
Bezug: `ZEITPLAN.md`, Marketing-Sprint 3/4 (laufende Content-Produktion,
Säule 3 "Build in public") — folgt dem Muster aus `content-plan.md`,
Woche 3, Post A: "Einblick in einen konkreten Baustein ... nur posten,
sobald der jeweilige Stand wirklich erreicht ist." Das ist hier der Fall:
6.12 `EditMode.tsx` wurde laut `ZEITPLAN.md` am 17.08. (heute) fertig.

## Produktstand, auf dem dieses Stück beruht (im Code geprüft, 17.08.2026)

`src/components/trip/EditMode.tsx`, eingebunden in
`src/pages/Buchung.tsx` (Zeilen 33-34, 141, 242-252):

- Ein Dialog in der Buchungsseite, mit dem man Aktivitäten der geplanten
  Reise **manuell hinzufügen, entfernen und im Preis anpassen** kann —
  nicht nur ansehen.
- Leerer Zustand ist ehrlich formuliert ("Noch keine Aktivitäten
  hinzugefügt."), kein erfundener Platzhalter-Eintrag.
- Änderungen werden über die bestehende `updateStoredTrip()`-Funktion
  **echt gespeichert** (`tripStorage.ts`), nicht nur in einem
  Demo-State, der beim Neuladen verschwindet — anders als z. B. bei den
  Entfernen-Buttons auf Favoriten/Preisalarme/Angebote, die laut
  `ZEITPLAN.md` bewusst noch als reiner Demo-State markiert sind, weil
  die geteilte Backend-Speicherung dafür noch fehlt.

Das ist ein konkretes, im Code nachprüfbares Beispiel für Säule 2
("Ein Gespräch statt ein Formular") UND Säule 3 (Build in public)
zugleich: die Buchungsseite wird zunehmend zu etwas, das man wirklich
anpassen kann, statt nur eine Zusammenfassung anzuzeigen — und dieser
Fortschritt lässt sich Schritt für Schritt zeigen, ohne etwas
vorwegzunehmen, das noch nicht fertig ist (Kostenübersicht/Checkliste,
6.6-6.10, sind laut `ZEITPLAN.md` weiterhin offen und werden hier
bewusst NICHT behauptet).

## Post — "Deine Reise ist keine Einbahnstraße"

### LinkedIn

> Kleines Update aus dem Aufbau von travix.ai:
>
> Die Buchungsseite unseres Prototyps zeigte bisher nur an, was der
> KI-Chat für dich geplant hat — fertig zum Anschauen, aber nicht zum
> Anfassen. Wenn dir eine Aktivität zu viel war, oder eine fehlte, hattest
> du keine Möglichkeit, das direkt anzupassen.
>
> Das ändert sich gerade. Man kann jetzt Aktivitäten direkt in der
> Buchungsseite hinzufügen, entfernen und im Preis anpassen — und die
> Änderung bleibt tatsächlich gespeichert, nicht nur bis zum nächsten
> Neuladen.
>
> Klingt nach einem kleinen Feature. Ist für uns aber Teil eines größeren
> Prinzips: eine gute Reiseplanung ist kein Formular, das man einmal
> abschickt — sie ist ein Gespräch, das man jederzeit weiterführen kann.

*Kein Bild-Zwang bei LinkedIn (siehe `content-plan.md`) — funktioniert
auch als reiner Text. Bildoption siehe unten, falls gewünscht.*

### Instagram

**Caption:**
> Deine Reiseplanung ist fertig geplant vom Chat — aber nicht in Stein
> gemeißelt.
>
> Du kannst jetzt direkt in der Buchungsseite Aktivitäten hinzufügen,
> streichen oder den Preis anpassen. Und ja, es bleibt auch wirklich
> gespeichert. 🙂

**Bild-/Reel-Idee (Option A, sicherer Standard, sofort umsetzbar):**
Abstrakte Text-Gegenüberstellung in der bestehenden Gradient-Ästhetik
(Navy→Teal→Gold), analog zum bereits etablierten Muster aus
`content-stueck-ehrliche-kartenansicht.md` — kein echter Screenshot,
siehe Design-Brief unten für den Grund. Ein zweiter, wirkungsvollerer
echter App-Screenshot des Dialogs (Option B) wäre möglich, bleibt hier
aber aus demselben Grund wie beim letzten Content-Stück bewusst
unausgearbeitet: `MARKENDESIGN.md` markiert "echte Screenshots für
Social Content ja/nein" weiterhin als offene Grundsatzfrage, keine, die
dieser Lauf selbst entscheiden sollte.

**Hashtags (Vorschlag, nicht belegt durch Performance-Daten):**
`#buildinpublic #reiseplanung #traveltech #ki #produktentwicklung`

## Canva-Design-Brief (für Option A, sofort umsetzbar ohne offene Entscheidung)

- **Format:** Instagram Post, 1080×1080 px.
- **Farben:** Verlauf Navy (`#0A2342`) → Teal (`#00C2A8`), diagonal von
  oben-links nach unten-rechts, wie im Hero-Bereich von `Home.tsx` (Werte
  aus `src/lib/design-tokens.ts`).
- **Font:** Bestehende Produkt-Schrift (siehe `design-tokens.ts`), keine
  Skript-/Handschrift-Fonts.
- **Komposition:**
  - Obere Hälfte: "Fertig geplant vom Chat." in Weiß, normale Deckkraft.
  - Untere Hälfte, Teal-Akzent: "Aber nicht in Stein gemeißelt." in
    Weiß, mit Gold-Akzent auf "nicht".
  - Kleines Plus-/Stift-Symbol (analog zum `Plus`-Icon aus `EditMode.tsx`)
    dezent zwischen den beiden Textzeilen, keine Screenshot-Rahmen-Mockups.
  - Logo/Wortmarke klein unten rechts, wie bei bisherigen Post-Vorlagen.
- **Nicht:** kein Stockfoto, kein Handy-/Laptop-Mockup mit echtem
  Screenshot — würde Option B vorwegnehmen, bevor die
  Bildsprachen-Grundsatzfrage in `MARKENDESIGN.md` geklärt ist.

## Leitplanken (wiederholt aus `content-plan.md`, gelten weiter)

- Kein Post geht ohne Nis Freigabe raus.
- Kein CTA zu einer Warteliste, solange die nicht live ist (dieser Post
  hat ohnehin keinen CTA, bewusst reiner Fortschritts-Post).
- Keine erfundenen Kennzahlen.
- Vor dem tatsächlichen Posten: kurz im Code/`ZEITPLAN.md` prüfen, ob die
  beschriebene EditMode-Funktionalität zum Zeitpunkt des Postens noch so
  stimmt wie hier beschrieben (Stand 17.08.2026 geprüft) — insbesondere,
  dass keine Kostenübersicht (6.6/6.7) fälschlich mitbeworben wird, die
  laut `ZEITPLAN.md` weiterhin offen ist.
