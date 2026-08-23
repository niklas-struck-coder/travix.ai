# Support-Chef Bericht

**Datum:** 2026-08-23

## Was ist seit dem letzten Eintrag (2026-08-21) passiert?

Zwei neue Seiten sind seitdem dazugekommen: **Reise suchen** (`/reise-planen`,
Einstiegspunkt für die Reiseplanung) und **Einstellungen** (`/einstellungen`).
Die vier zuvor gemeldeten Kernprobleme (Flugsuche-Chat-Bug, Warenkorb ohne
Checkout-Weg, Löschen ohne Rückfrage, nicht unterscheidbarer duplizierter
Reiseentwurf) habe ich diesmal nicht erneut geprüft, da mein Fokus auf den
beiden neuen Seiten lag. Ich habe mir beide aus Nutzersicht angeschaut und
dabei ein paar konkrete Punkte gefunden, die ich Ni mitgeben möchte.

## Meine Vorschläge

1. **Die als "empfohlen" markierte Karte auf der neuen "Reise suchen"-Seite
   ist optisch nicht als solche zu erkennen.** `src/pages/ReiseSuche.tsx:49`
   soll die KI-Chat-Karte per `border-teal/40` hervorheben. Die
   `Card`-Komponente (`src/components/ui/card.tsx:14`) nutzt aber gar kein
   `border`-Utility, sondern `ring-1`, und der globale Tailwind-Reweset in
   `src/styles/globals.css:126-128` setzt Randbreite standardmäßig auf 0 —
   die Farbe hat also nichts, an dem sie sichtbar würde. Ein Textlabel wie
   "Empfohlen" fehlt ebenfalls, obwohl genau dafür an acht anderen Stellen
   in der App schon ein `Badge`-Baustein existiert. Für Erstnutzer:innen,
   die eigentlich zum KI-Chat geführt werden sollen, sehen alle drei Karten
   gleichwertig aus. Vorschlag: entweder `border` zur Klasse ergänzen oder
   ein `Badge` "Empfohlen" auf der Karte ergänzen.

2. **Auf der neuen Einstellungen-Seite verspricht der Text mehr, als die App
   aktuell einlöst.** `src/pages/Einstellungen.tsx:32` sagt wörtlich
   "Worüber Travix dich **per E-Mail** informieren soll." — dabei ist der
   Support-E-Mail-Versand laut `ZEITPLAN.md` noch gar nicht live. Wer hier
   z. B. "Preisalarme" aktiviert, geht davon aus, künftig wirklich eine
   Mail zu bekommen; ein Hinweis, dass dahinter aktuell nichts passiert,
   fehlt komplett. Vorschlag: Text neutraler formulieren (z. B. "sobald
   Benachrichtigungen aktiv sind") oder kurz vermerken, dass das noch nicht
   scharf geschaltet ist.

3. **Die Maßeinheiten-Auswahl in den Einstellungen hat aktuell in der
   gesamten App keine Wirkung.** `src/pages/Einstellungen.tsx:59-61` wirbt
   mit "Für Distanzen und Temperaturen in Reiseplänen und Karten" — eine
   Codesuche zeigt aber, dass nirgends in der App (auch nicht in Kalender
   oder Kartenansicht) überhaupt eine Distanz oder Temperatur angezeigt
   wird. Die Auswahl beschreibt damit ein Feature, das schlicht noch nicht
   existiert. Vorschlag: Text vorerst auf "für künftige Distanz-/
   Temperaturanzeigen" reduzieren oder das Feld noch ausblenden.

4. **Die Einstellungen gehen wie schon bei der Profil-Seite beim
   Wegnavigieren verloren, nicht erst beim Neuladen.**
   `src/pages/Einstellungen.tsx:14` hält die Auswahl nur in lokalem
   `useState`, ohne Speicherung — genau das Muster, das ich am 21.08. schon
   für die Profil-Seite gemeldet hatte. Jetzt taucht es auf einer zweiten
   Seite auf, was zeigt: Das ist kein Einzelfall mehr, sondern ein
   wiederkehrendes Muster, das sich lohnt, einmal grundsätzlich zu lösen
   (z. B. gemeinsamer `localStorage`-Zwischenspeicher für beide Seiten),
   statt es Seite für Seite einzeln nachzuziehen.

_Letztes Update: 2026-08-23_
