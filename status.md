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

**Seit letztem Update (2026-10-18):**
- IT-Chef hat mehrere Testabdeckungslücken geschlossen (Card-, Select-,
  Tabs-Komponente) und formatTime() aus FlightCard/TrainCard in eine
  gemeinsame lib/format.ts konsolidiert
- Support-Chef hat einen neuen Fund gemeldet: formatTime() zeigt bei
  kaputten Zeitstempeln "Invalid Date" an; drei ältere offene Punkte
  erneut unverändert bestätigt
- Marketing-Chef hat vier neue Commits reine Testabdeckung/Konsolidierung
  ohne Verhaltensänderung eingestuft, Kandidatentopf bleibt bei fünf
- Freigabe-Chef hat IT-, Marketing- und Support-Chef-Branches geprüft und
  erfolgreich nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-19_
