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

**Seit letztem Update (2026-09-26):**
- IT-Chef hat den Mietwagen-Quick-Reply-Fund automatisch gefixt (PR #23)
- Support-Chef hat den Fix bestätigt und einen neuen kleineren Fund gemeldet:
  FlightCard/TrainCard zeigen bei fehlendem Namensfeld keinen Klarname-Fallback
- Marketing-Chef: keine neuen Kandidaten, verweist aber auf einen wachsenden
  Rückstau bei it-chef/auto (mehrere geprüfte Fixes warten weiter auf Merge)
- Freigabe-Chef hat marketing-chef/auto und support-chef/auto nach main gemergt;
  it-chef/auto bleibt trotz grüner Prüfung weiterhin durch eine Merge-Restriktion
  blockiert (mittlerweile zum achten Mal in Folge)

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-09-27_
