# Neues wiederkehrendes Format — "Was wird gerade wirklich gespeichert?" (Entwurf)

Entwurf — von Marketing-Chef im autonomen Tageslauf vorbereitet, wartet
auf Nis Freigabe. **Kein Post daraus wurde oder wird automatisch
veröffentlicht** — zum Copy-Paste gedacht, sobald Ni die jeweiligen
Kanäle live schaltet.

Erstellt: 2026-08-19
Bezug: `ZEITPLAN.md`, Marketing-Sprint 4 ("Laufende Content-Produktion")
sowie direkt Vorschlag 2 aus `reports/marketing-chef.md` (2026-08-18):
*"'Was ist echt, was ist Demo' als eigenes Format statt Randnotiz ...
z. B. ein kurzer Monats-Statusbeitrag 'Was diesen Monat wirklich
gespeichert wird'."* Kein einzelnes neues Feature ist seit dem 18.08.
fertig geworden (die seitherigen IT-Chef-Läufe haben nur bestehende
Checkboxen korrigiert, keinen neuen Code gebaut) — statt deshalb gar
nichts zu tun oder ein weiteres Einzel-Feature-Stück auf den ohnehin
schon wachsenden Freigabe-Stapel zu legen (siehe Warnung im selben
Bericht), setzt dieser Lauf den bereits vorgeschlagenen, andersartigen
Format-Punkt um.

## Warum das ins Sicherheitsraster für den autonomen Modus passt

- Ergebnis ist ein reines Entwurfsdokument, kein Live-Vorgang.
- Keine erfundenen Kennzahlen — das Format braucht bewusst keine
  Reichweiten-/Engagement-/Nutzerzahlen, nur den bestehenden,
  nachprüfbaren Code-Stand.
- Keine offene Positionierungs-Grundsatzfrage: Das Format wendet die in
  `MARKENDESIGN.md` festgelegte Positionierung ("Ehrlichkeit als
  Feature") nur an, entscheidet sie nicht neu. Die Bildsprachen-Frage
  (echte Screenshots ja/nein) bleibt hier wie in allen bisherigen
  Stücken bewusst offen, siehe Design-Brief unten.
- Bereits von einem früheren Marketing-Chef-Bericht vorgeschlagen, keine
  neue, ungeprüfte Idee.

## Format-Definition (Ergänzung zu `content-plan.md`)

**Titel:** "Was wird gerade wirklich gespeichert?"

**Rhythmus:** Monatlich, ca. letzte Woche des Monats — ergänzt die
laufenden Einzel-Feature-Posts aus Säule 1 ("Ehrlichkeit als Feature"),
ersetzt sie nicht.

**Zweck:** Statt bei jedem einzelnen Feature erneut zu erklären "das ist
noch Demo-Daten, das speichert schon echt", einmal im Monat einen
Gesamtüberblick geben — macht die Ehrlichkeits-Positionierung als
durchgehendes Prinzip sichtbar statt als Randnotiz in einzelnen Posts.

**Aufbau pro Ausgabe:**
1. Kurzer Einstieg: was ist neu seit letztem Monat (falls etwas neu ist).
2. Zwei einfache Listen — "speichert schon echt" vs. "läuft noch auf
   Demo-Daten" — jeweils mit einem Halbsatz Kontext, warum (meist: hängt
   an der noch offenen Backend-Entscheidung).
3. Kein Werturteil, keine Entschuldigung — die Demo-Liste ist genauso
   Teil des ehrlichen Status wie die Echt-Liste.

**Leitplanke fürs Format selbst:** Jede Ausgabe braucht vor dem Posten
einen frischen Code-Abgleich (nicht die letzte Ausgabe kopieren) — der
Stand verschiebt sich laufend, siehe `ZEITPLAN.md`.

## Ausgabe 1 — August 2026 (Produktstand im Code geprüft, 19.08.2026)

Geprüft: `src/pages/Warenkorb.tsx`, `src/lib/trip/cartTotals.ts`,
`src/components/trip/EditMode.tsx`, `src/pages/Kalender.tsx`,
`src/pages/Aktivitaeten.tsx`, `src/pages/Favoriten.tsx`,
`src/pages/Preisalarme.tsx`, `src/pages/Angebote.tsx`,
`src/pages/Reiseentwuerfe.tsx`, `src/pages/Kartenansicht.tsx`.

**Speichert schon echt:**
- **Aktivitäten in der Buchungsseite bearbeiten** (`EditMode.tsx`):
  Hinzufügen/Entfernen/Preisanpassung wird über `updateStoredTrip()`
  tatsächlich in der laufenden Reise gespeichert, nicht nur im
  Seiten-State.
- **Warenkorb-Summen** (`Warenkorb.tsx`/`cartTotals.ts`): Zwischen- und
  Gesamtsumme sind kein festes Feld, sondern werden bei jeder Änderung
  aus den aktuell vorhandenen Positionen neu berechnet.
- **Kartenansicht** (`Kartenansicht.tsx`): zeigt den echten, im KI-Chat
  geplanten Reise-Ort statt fester Demo-Koordinaten — inklusive
  ehrlichem Leerzustand, wenn (noch) kein Ziel feststeht.

**Läuft noch auf Demo-Daten:**
- **Kalender** (`Kalender.tsx`), **Aktivitäten-Übersicht**
  (`Aktivitaeten.tsx`), **Favoriten** (`Favoriten.tsx`),
  **Preisalarme** (`Preisalarme.tsx`), **Angebote** (`Angebote.tsx`),
  **Reiseentwürfe-Aktionen** (`Reiseentwuerfe.tsx`, pausieren/
  duplizieren/abschließen/löschen) — alle zeigen zwei feste
  Beispiel-Reisen bzw. reagieren nur im Browser-Speicher (`useState`),
  ohne echte, geteilte Ablage im Hintergrund.
- Der gemeinsame Grund: eine echte, geteilte Speicherung (statt lokalem
  Demo-State) hängt an der noch offenen Backend-Entscheidung (Base44 vs.
  Alternative) — Sprint-1-Punkt, laut `ZEITPLAN.md` weiterhin eine
  Produktentscheidung, keine, die technisch nachgeholt werden kann, ohne
  dass diese Entscheidung erst fällt.

**Warenkorb als Zwischenfall:** Der Warenkorb ist bewusst in keiner der
beiden Listen ganz oben gelandet, sondern erklärt sich am besten selbst:
die *Positionen* darin sind Demo-Daten (zwei feste Beispiel-Reisen), die
*Summen-Berechnung* darüber ist echt. Genau dieser Unterschied — echte
Logik über Demo-Daten — ist der Kern, den das Format zeigen soll, statt
Features pauschal in "echt" oder "Demo" zu sortieren.

## Post — "Was wird gerade wirklich gespeichert?" (August-Ausgabe)

### LinkedIn

> Build in public, Monats-Update:
>
> Bei travix.ai unterscheiden wir bewusst zwischen "läuft schon echt"
> und "ist noch Demo" — und zeigen beides, nicht nur die
> Erfolgsmeldungen.
>
> **Speichert schon echt:** Aktivitäten in der Buchungsseite bearbeiten,
> die Warenkorb-Summen (werden bei jeder Änderung neu berechnet, nicht
> nur einmal gesetzt), die Kartenansicht mit dem echten geplanten
> Reiseziel.
>
> **Läuft noch auf Demo-Daten:** Kalender, Aktivitäten-Übersicht,
> Favoriten, Preisalarme, Angebote, Entwurfs-Aktionen — alle mit zwei
> festen Beispiel-Reisen, weil die geteilte Speicherung dafür an einer
> noch offenen Backend-Entscheidung hängt.
>
> Kein Grund, das zu verstecken. Ehrlichkeit als Feature heißt für uns:
> auch zeigen, was noch nicht fertig ist — nicht nur, was schon
> funktioniert.

*Kein Bild-Zwang bei LinkedIn (siehe `content-plan.md`) — funktioniert
auch als reiner Text. Bildoption siehe unten, falls gewünscht.*

### Instagram

**Caption:**
> Monats-Check bei travix.ai: was speichert gerade wirklich, was ist
> noch Demo?
>
> ✅ Echt: Aktivitäten bearbeiten, Warenkorb-Summen, Kartenansicht mit
> echtem Reiseziel.
> 🧪 Demo: Kalender, Aktivitäten-Übersicht, Favoriten, Preisalarme,
> Angebote, Entwurfs-Aktionen — noch mit Beispiel-Reisen.
>
> Beides zeigen wir. Ehrlichkeit ist bei uns kein Sonderfall. 🙂

**Bild-/Reel-Idee (Option A, sicherer Standard, sofort umsetzbar):**
Abstrakte Zwei-Spalten-Grafik in der bestehenden Gradient-Ästhetik
(Navy→Teal→Gold), analog zum Muster aus den bisherigen Content-Stücken —
kein echter Screenshot, siehe Design-Brief unten für den Grund.

**Hashtags (Vorschlag, nicht belegt durch Performance-Daten):**
`#buildinpublic #reiseplanung #traveltech #ki #ehrlichkeit`

## Canva-Design-Brief (für Option A, sofort umsetzbar ohne offene Entscheidung)

- **Format:** Instagram Post, 1080×1080 px.
- **Farben:** Verlauf Navy (`#0A2342`) → Teal (`#00C2A8`), diagonal von
  oben-links nach unten-rechts (Werte aus `src/lib/design-tokens.ts`).
- **Font:** Sora für Headlines, Inter für Fließtext (siehe
  `design-tokens.ts`), keine Skript-/Handschrift-Fonts.
- **Komposition:**
  - Obere Zeile, zentriert: "Was wird gerade wirklich gespeichert?" in
    Weiß, als Titel des Formats.
  - Zwei Spalten darunter, klar getrennt durch eine dünne, helle
    vertikale Linie:
    - Links, Teal-Häkchen-Symbol (einfache Linienform, kein
      Emoji-Grafik-Import): "Echt" + die drei Stichpunkte (Aktivitäten
      bearbeiten, Warenkorb-Summen, Kartenansicht).
    - Rechts, Gold-Kennzeichnung (kein Rot — Fehlermeldungs-Optik
      vermeiden, siehe `MARKENDESIGN.md`): "Demo" + Kurzhinweis
      "6 Seiten, feste Beispiel-Reisen".
  - Logo/Wortmarke klein unten rechts, wie bei bisherigen
    Post-Vorlagen.
- **Nicht:** kein Stockfoto, kein Handy-/Laptop-Mockup mit echtem
  Screenshot (Bildsprachen-Grundsatzfrage in `MARKENDESIGN.md`
  weiterhin offen). Kein Rot für die Demo-Spalte — das würde wie eine
  Fehlermarkierung wirken, obwohl Demo-Status hier kein Fehler ist.

## Leitplanken (wiederholt aus `content-plan.md`, gelten weiter)

- Kein Post geht ohne Nis Freigabe raus.
- Kein CTA zu einer Warteliste, solange die nicht live ist (dieser Post
  hat ohnehin keinen CTA, bewusst reiner Status-Post).
- Keine erfundenen Kennzahlen.
- Vor dem tatsächlichen Posten jeder künftigen Monats-Ausgabe: den
  Code-Abgleich frisch wiederholen (siehe Format-Definition oben) statt
  die letzte Ausgabe unverändert zu recyceln — der Stand in
  `ZEITPLAN.md` verschiebt sich laufend.
