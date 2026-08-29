# travix.ai — Projektstatus (Momentaufnahme)

_Diese Datei wird unregelmäßig manuell aktualisiert und dient Lina (der PA-Website)
als grober Kontext — keine Live-Daten, kein Ersatz für den echten Projektstand._

**Was travix.ai ist:** Eine KI-gestützte Reiseplattform mit Chat-Assistent
("KI-Concierge"), Flug-, Hotel- und Bahn/Bus/Fähre-Suche, Buchung und Reiseverwaltung.

**Aktuell in Arbeit:**
- Flugsuche & Hotelsuche über externe Buchungs-API, Zug/Bus/Fähre-Anzeige im Aufbau
- Seiten Aktivitäten, Buchung, Kalender, Dashboard, Warenkorb, Profil, Einstellungen,
  Kartenansicht, Reisesuche, Preisalarme, Favoriten, KI-Concierge-Chat
- Autonome Tages-Workflows für IT-, Marketing- und Support-Bereich, mit
  eigenständiger Prüfung/Merge durch einen "Freigabe-Chef"

**Seit letztem Update (2026-08-28):**
- Navigation gefixt: Dashboard, Kalender, Karte, Aktivitäten, Angebote, Favoriten
  und Preisalarme waren bisher nur per direkter URL erreichbar, nicht über die Navi
- Chat-Ehrlichkeit: Zug/Bus/Fähre/Mietwagen versprachen eine echte Verbindungssuche,
  die es noch nicht gab - Formulierung korrigiert
- Dashboard-A11y-Fixes (unterscheidbare Links per Screenreader, markierter
  Durchschnittswert) sowie Enter-Handler-Bug im "Aktivität hinzufügen"-Formular behoben
- Support-Chef: Chatflow-Text und Sidebar-Gruppe "Meine Reise" geprüft, Reibungspunkte
  übernommen
- Marketing-Chef: Ehrlichkeits-Fix am mockAdvisor geprüft
- Freigabe-Chef hat alle genannten Auto-Zweige mehrfach nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-08-29_
