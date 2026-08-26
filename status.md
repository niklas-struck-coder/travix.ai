# travix.ai — Projektstatus (Momentaufnahme)

_Diese Datei wird unregelmäßig manuell aktualisiert und dient Lina (der PA-Website)
als grober Kontext — keine Live-Daten, kein Ersatz für den echten Projektstand._

**Was travix.ai ist:** Eine KI-gestützte Reiseplattform mit Chat-Assistent
("KI-Concierge"), Flug-, Hotel- und Bahn/Bus/Fähre-Suche, Buchung und Reiseverwaltung.

**Aktuell in Arbeit:**
- Flugsuche & Hotelsuche über externe Buchungs-API, Zug/Bus/Fähre-Anzeige im Aufbau
- Seiten Aktivitäten, Buchung, Kalender, Warenkorb, Profil, Einstellungen,
  Kartenansicht, Reisesuche, Preisalarme, Favoriten, KI-Concierge-Chat
- Autonome Tages-Workflows für IT-, Marketing- und Support-Bereich, mit
  eigenständiger Prüfung/Merge durch einen "Freigabe-Chef"

**Seit letztem Update (2026-08-25):**
- IT-Chef: PR für Bug "FlightWizard Passagierzahl NaN" eröffnet, automatische
  Unterkunftssuche bei unbekanntem Ziel hängt nicht mehr stillschweigend;
  mehrere Auto-Läufe fanden danach keinen weiteren sicheren Punkt (Zustand stabil)
- Support-Chef: Reibungspunkte bei Preisalarmen gefunden (ungeschütztes
  Vergangenheitsdatum bei Hinflug/Check-in, Preise ohne deutsches Format)
- Marketing-Chef: ein Content-Stück als freigabefähig eingestuft, Freigabe-
  Übersicht laufend nachgeführt
- Freigabe-Chef hat die geprüften Auto-Zweige mehrfach nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-08-26_
