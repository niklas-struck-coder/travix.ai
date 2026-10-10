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

**Seit letztem Update (2026-10-09):**
- IT-Chef hat mehrere Bugs behoben: resetChat() verwarf laufende Duffel-Suchen
  nicht mehr korrekt, editingField/awaitingFlightOrigin überleben jetzt einen
  Reload, fehlende Testabdeckung für Duffel-Mapping-Funktionen wurde geschlossen
- Support-Chef hat neue Fundstellen gemeldet: Flug-Auswahl verliert beim
  Bearbeiten alle Details, Flugsuche-Formular startet beim Bearbeiten leer
- Marketing-Chef hat drei weitere Verbesserungs-Kandidaten gesammelt
  (Kandidatentopf erreicht die Achter-Schwelle, siebte Mini-Changelog-Ausgabe)
- Freigabe-Chef hat die Tages-Läufe von IT-Chef, Marketing-Chef und
  Support-Chef erneut geprüft und nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-10_
