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

**Seit letztem Update (2026-09-03):**
- Preise in Flug-/Hotelkarten werden jetzt im deutschen Zahlenformat statt roh angezeigt
- Passagierzahl im FlightWizard gegen ungültige Eingaben (NaN) abgesichert
- Robustheits-Fix: gespeicherte Reisepläne mit fehlendem activities-Feld verursachen
  keinen Absturz mehr
- Support-Chef hat die neue Preisformatierung geprüft und dabei ein Absturzrisiko
  bei leerem Währungscode gefunden
- Marketing-Chef hat zwei neue Ehrlichkeits-/Zuverlässigkeits-Fixes eingeordnet
- Freigabe-Chef hat mehrere geprüfte Änderungen (IT-, Support-, Marketing-Chef)
  nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-09-04_
