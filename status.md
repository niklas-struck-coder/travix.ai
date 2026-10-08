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

**Seit letztem Update (2026-10-07):**
- IT-Chef hat mehrere kleinere Bugs behoben: Wortgrenzen-Fehler beim
  Notfall-Keyword "hilfe" im Urlaubsmodus, mehrdeutige Namen im Lösch-Dialog
  (EditMode.tsx), falscher Aktivitäten-Zähler in isTripComplete() und ein
  falsches Jahr (2027 statt 2026) im Kyoto-Demo-Reiseentwurf
- Support-Chef hat gemeldet, dass die Disambiguierung im Lösch-Dialog die
  sichtbare Aktivitätenliste noch nicht erreicht, nur Screenreader-Labels
- Marketing-Chef hat drei weitere kleinere Verbesserungs-Kandidaten gesammelt
- Freigabe-Chef hat die Tages-Läufe von IT-Chef, Marketing-Chef und
  Support-Chef geprüft und nach main gemergt

**Status:** Frühe Entwicklungsphase, vieles ist noch aktiv in Arbeit und unfertig.

_Letztes Update: 2026-10-08_
