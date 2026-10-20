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

**Seit letztem Update (2026-10-19):**
- IT-Chef hat einen Bug in Kalender.tsx behoben: die "Heute"-Markierung
  fror sich beim Mount ein; mehrere weitere Auto-Läufe fanden danach
  keinen neuen sicheren Punkt mehr
- Support-Chef hat den Fix nachkontrolliert (reine Analyse, keine
  Codeänderung); drei ältere offene Punkte (leerer Erstaufruf, fehlende
  Klickziele, kein aria-live) bleiben weiterhin unverändert offen
- Marketing-Chef hat den Kalender-Fix als Tier-4-Kandidat eingestuft
  (reine Markdown-Pflege), Kandidatentopf bleibt bei sechs, alle vier
  offenen Fragen weiterhin ungeklärt
- Freigabe-Chef hat IT-, Marketing- und Support-Chef-Branches mehrfach
  geprüft und erfolgreich nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-20_
