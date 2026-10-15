# Marketing-Chef Bericht

**Datum:** 2026-10-15

## Was ist seit dem letzten Eintrag (2026-10-14) passiert?

Diesmal gibt's tatsächlich Bewegung im Produkt-Code, nicht nur in
Berichten. Ich hab mir den Commit-Verlauf seit gestern angeschaut
(`git log 9e27ae7..HEAD`):

- **Der Avatar-Fund von gestern ist jetzt wirklich gefixt.** Der
  Urlaubsmodus-Concierge zeigt bei ehrlichen "weiß ich (noch) nicht"-
  Antworten jetzt einen neutralen Zustand statt des roten Fehler-Avatars
  (`useConcierge.ts`). Genau das, was ich gestern als Vorbedingung für
  einen Content-Moment genannt hatte.
- **Der Flug-Bearbeiten-Bug ist ebenfalls behoben.** Wechselt man beim
  Bearbeiten das Feld, bleiben jetzt keine veralteten Flugsuchergebnisse
  mehr unter dem neuen Formular stehen (`startEdit()` in `useChat.ts`).
- **Die Fehleranzeige ist jetzt überall einheitlich** – Flug-/
  Hotelsuche-Seiten und Chat nutzen alle dieselbe `SearchErrorAlert`-
  Komponente statt vier leicht unterschiedlicher Varianten.
- **Neuer, noch offener Fund:** Support-Chef hat entdeckt, dass mehrere
  gleichzeitige Duffel-Fehler (z. B. ungültiges Datum + ungültige
  Passagierzahl) dieselbe Fehlerzeile doppelt untereinander zeigten.
  IT-Chef hat dafür einen Fix vorbereitet (PR #29), der aber noch auf
  Review wartet – also noch nicht in `main`.

Der Tier-4-Kandidatentopf (laut Marketing-Auto-Kanal) steht jetzt bei 7
von 8 – die Achter-Schwelle für die nächste Mini-Changelog-Ausgabe ist
also fast erreicht, aber bewusst noch nicht künstlich aufgefüllt worden.

## Vorschläge

1. **Avatar-Fix und Fehleranzeige-Vereinheitlichung zusammen in die
   nächste Mini-Changelog-Ausgabe, statt einzeln zu posten.** Beide sind
   zu klein für eigene Posts, ergänzen sich aber gut als zwei Zeilen
   unter "Ehrlichkeit als Feature": *"Der Concierge sagt jetzt ruhig
   'weiß ich nicht', statt Alarm zu schlagen"* plus *"Fehlermeldungen
   sehen jetzt überall gleich aus – kleines Detail, aber genau solche
   Details machen ein Produkt ruhiger zu benutzen."*
2. **Duffel-Dedup-Fix (PR #29) jetzt noch nicht ankündigen.** Erst wenn
   der PR gemerged ist, zählt er als achter Tier-4-Kandidat und löst die
   Changelog-Ausgabe aus – vorher wäre es eine Ankündigung auf Vorrat.
3. **Flug-Bearbeiten-Promo jetzt wieder öffnen.** Der Grund für die
   Sperre (Formular startet beim Bearbeiten leer/veraltet) ist laut
   IT-Chef behoben. Die Hotel-Bearbeiten-Promo lief schon separat weiter
   – jetzt lohnt sich wieder eine gemeinsame, einheitliche Formulierung
   für "Bearbeite deine Reise", statt künstlich auf Unterkunft begrenzt
   zu bleiben.
4. **Die Tier-4-Grundsatzfrage an Ni ist weiterhin offen** (laut
   Freigabe-Übersicht seit Wochen unbeantwortet: will Ni das
   Mini-Changelog-Format überhaupt in dieser Form?). Bevor der Topf auf
   unbestimmte Zeit weiterwächst, lohnt sich eine kurze, bewusste
   Entscheidung dazu – sonst sammelt sich guter Content an, ohne je
   rauszugehen.

_Letztes Update: 2026-10-15_
