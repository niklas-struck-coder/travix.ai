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

**Seit letztem Update (2026-10-21):**
- IT-Chef: mehrere Auto-Läufe ohne neuen sicheren Fund, ein hartnäckiger
  npm-Tooling-Bug wurde dabei mehrfach reproduziert (blockiert u.a. einen
  vitest-Audit-Fix); ein toter Urlaubsmodus-Link auf der MeineReisen-Demokarte
  wurde gefixt
- Support-Chef hat den Urlaubsmodus-Link-Fix bestätigt; der
  "+ Suchen"-Edit-Shortcut-Fix (PR #38) ist weiterhin nicht gemergt
- Marketing-Chef hat den gefixten Urlaubsmodus-Link als neuen
  Tier-4-Kandidaten aufgenommen
- Freigabe-Chef hat marketing-chef/auto und support-chef/auto geprüft und
  nach main gemergt, inkl. nachgetragener Einträge vom 10-21

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-22_
