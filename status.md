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

**Seit letztem Update (2026-09-15):**
- Fokus-Verlust nach Bestätigungsdialogen (Löschen) ist jetzt zentral behoben
  (gestern von Support-Chef als neuer Fund gemeldet)
- Drei weitere Robustheits-Fixes im Chat: Enter bricht laufende IME-Komposition
  nicht mehr ab, resetChat() und loadStoredChat() fangen jetzt Fehlerfälle sauber ab
- Support-Chef hat Mikrofon-Abbruch und Löschbestätigung im Bearbeiten-Modus als
  neue Funde gemeldet; Marketing-Chef drei weitere Tier-4-Kandidaten identifiziert
- Freigabe-Chef hat alle drei Auto-Zweige (IT/Marketing/Support) geprüft und
  gemergt, ein länger offener Blocker wurde dabei aufgelöst

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-09-16_
