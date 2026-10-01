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

**Seit letztem Update (2026-09-30):**
- IT-Chef hat einen Fund behoben: ChatInput stoppt die Spracherkennung jetzt
  korrekt beim Unmount
- Support-Chef fand uneindeutige Dialogtitel bei doppelten Reiseentwürfen;
  IT-Chef hat die Dialogtexte daraufhin disambiguiert, von Freigabe-Chef geprüft
  und gemergt
- npm audit fix: vier Dev-Dependency-Schwachstellen behoben
- Marketing-Chef hat einen Kandidaten zurückgezogen (eigener Fix hätte eine
  Zeitangabe erfunden) und einen neuen Kandidaten vorgeschlagen
- Freigabe-Chef hat die Tagesänderungen wie gewohnt eigenständig geprüft und
  nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-01_
