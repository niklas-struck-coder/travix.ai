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

**Seit letztem Update (2026-10-16):**
- IT-Chef hat mehrere Fixes gemergt: Reise-Zusammenfassungskarte zeigt jetzt die
  konkret gewählte Flug-/Zugverbindung statt eines generischen Labels,
  `startEdit()` räumt Lade- und Suchstatus beim Feldwechsel in der
  Unterkunftssuche korrekt auf; ein weiterer Lauf fand keinen neuen sicheren Punkt
- Freigabe-Chef hat IT-Chef-Branch geprüft und gemergt; Marketing- und
  Support-Chef-Branches wurden geprüft und bestanden, der Merge-Push war
  aber blockiert
- Marketing- und Support-Chef haben neue Kandidaten/Beobachtungen notiert
  (u.a. Ladeanzeige bei überholter Suche, Transportmittel-Wechsel nach
  Flugauswahl), noch nicht final verarbeitet

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-17_
