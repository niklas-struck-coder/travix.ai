# Support-Chef Bericht

**Datum:** 2026-08-09

## Was ist seit dem letzten Eintrag (2026-08-07) passiert?

Einiges! Seit meinem letzten Bericht ist die echte Flug- und Hotelsuche über
Duffel dazugekommen (`/flugsuche`), der Reiseplan auf `/buchung` lebt jetzt
wirklich (der tote Link von letztem Mal ist behoben), es gibt einen neuen
Urlaubsmodus mit KI-Concierge-Chat sowie eine "Meine Reisen"-Seite. Die
Navigation wurde außerdem spürbar aufgeräumt: Statt ~20 verlockenden
Menüpunkten, die alle auf dieselbe Platzhalterseite führten, zeigt die
Seitenleiste jetzt größtenteils echte, funktionierende Seiten.

## Meine Vorschläge

1. **"Meine Reisen" zeigt erfundene Reisen, ohne das zu kennzeichnen.** Auf
   `/meine-reisen` (`src/pages/MeineReisen.tsx:19-22`) erscheinen zwei fest
   einprogrammierte Trips ("Lissabon", "Kyoto") als wären es echte,
   gebuchte Reisen — inklusive Status "Bevorstehend" und Button
   "Urlaubsmodus aktivieren". Der Code selbst kommentiert das ehrlich als
   Demo-Daten, aber im UI steht nirgends ein Hinweis wie "Beispielreise".
   Für jemanden, der die App zum ersten Mal öffnet, sieht das aus wie eine
   Reise, die er selbst gebucht hat — das kann zu echter Verwirrung führen
   ("Wann habe ich das gebucht?"). Mein Vorschlag: entweder klar als
   Beispiel kennzeichnen, oder die Seite leer lassen, bis echte Buchungen
   angebunden sind.

2. **Der Weg zurück fehlt weiterhin bei den verbliebenen Platzhalterseiten.**
   Die Navigation ist deutlich besser geworden, aber `/entwuerfe`,
   `/warenkorb`, `/profil`, `/einstellungen` und `/hilfe` stehen weiterhin
   fest in der permanenten Seitenleiste (`src/lib/nav-config.ts:53-69`) und
   landen alle auf derselben `PlaceholderPage.tsx:16-18` mit "wird als
   Nächstes gebaut" — ohne Button oder Link zurück zum funktionierenden
   Chat. Das war schon mein Punkt vom letzten Mal, jetzt eben nur noch für
   5 statt 20 Menüpunkte. Ein kleiner "Zurück zum KI-Chat"-Button auf der
   Platzhalterseite würde die Sackgasse auflösen.

3. **Mikrofon-Fehler sind immer noch unsichtbar.** In `src/lib/ai/speech.ts:47`
   steht weiterhin `recognition.onerror = onEnd` — verweigert jemand die
   Mikrofon-Berechtigung, verschwindet nur stillschweigend der
   "Aufnahme läuft"-Zustand in `ChatInput.tsx`, ohne jede Erklärung. Das
   ist seit meinem letzten Bericht unverändert offen geblieben.

4. **Flugsuche verlangt IATA-Codes, ohne beim Eintippen zu helfen.** In
   `src/components/search/FlightWizard.tsx:62-82` müssen Nutzer:innen den
   3-Buchstaben-Flughafencode selbst kennen (z. B. "BER" für Berlin) — es
   gibt weder eine Autovervollständigung nach Stadtnamen noch eine
   Fehlermeldung, wenn ein ungültiger Code eingegeben wird (z. B. "Berlin"
   wird beim Tippen einfach stumm auf "Ber" abgeschnitten). Der
   "Flüge suchen"-Button bleibt dann einfach deaktiviert, ohne zu sagen,
   warum. Gerade weil die Suche jetzt echte Ergebnisse liefert, würde eine
   Orts-Autovervollständigung hier viel Frust vermeiden.

_Letztes Update: 2026-08-09_
