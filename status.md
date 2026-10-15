# travix.ai — Projektstatus (Momentaufnahme)

_Diese Datei wird automatisch täglich aktualisiert und dient Lina (der PA-Website)
als grober Kontext — keine Live-Daten, kein Ersatz für den echten Projektstand._

**Was travix.ai ist:** Eine KI-gestützte Reiseplattform mit Chat-Assistent
("KI-Concierge"), Flug-, Hotel- und Bahn/Bus/Fähre-Suche, Buchung und Reiseverwaltung.

**Aktuell in Arbeit:**
- Flugsuche & Hotelsuche über externe Buchungs-API, Zug/Bus/Fähre-Anzeige im Aufbau
- Seiten Aktivitäten, Buchung, Kalender, Dashboard, Warenkorb, Profil, Einstellungen,
  Kartenansicht, Reisesuche, Preisalarme, Favoriten, KI-Concierge-Chat, Urlaubsmodus
- Autonome Tages-Workflows für IT-, Marketing- und Support-Bereich, mit
  eigenständiger Prüfung/Merge durch einen "Freigabe-Chef"

**Seit letztem Update (2026-10-14):**
- IT-Chef hat mehrere Fixes gemergt: stale Flugsuchergebnisse/-fehler beim
  Bearbeiten werden jetzt zurückgesetzt, Fehler-Anzeige in Flug- und
  Hotelsuche vereinheitlicht (SearchErrorAlert), und ein doppeltes
  Hilfsmodul (escapeRegExp) konsolidiert
- Support-Chef hat eine identische Fehlerzeile bei mehreren verschiedenen
  Duffel-API-Fehlern in Flug-/Hotelsuche gemeldet
- Marketing-Chef hat zwei neue Kandidaten aufgenommen (Concierge-Avatar-Fix,
  stale Flugergebnisse), Kandidatentopf jetzt bei sieben
- Freigabe-Chef hat Tages- und Nacht-Checks durchgeführt und die Branches
  von IT-, Marketing- und Support-Chef unabhängig geprüft und gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-15_
