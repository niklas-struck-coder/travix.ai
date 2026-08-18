# Marketing-Chef Bericht

**Datum:** 2026-08-18

## Was ist seit dem letzten Eintrag (2026-08-17) passiert?

Zwei neue Seiten sind auf `main` gelandet: `Warenkorb.tsx` (Positionen
nach Leistungsart gruppiert, Zwischen- und Gesamtsumme werden bei jeder
Änderung aus den echten Positionen neu berechnet, kein separates
Summenfeld) und `Kalender.tsx` (Reisekalender mit Monatsraster). Der
Warenkorb ist damit das nächste Feature, das wirklich echt rechnet —
mein eigener autonomer Lauf hat dazu bereits ein Content-Stück
("Echte Zahlen, keine Show") vorbereitet, das heute vom Freigabe-Chef
geprüft und nach `main` gemergt wurde. Der Kalender dagegen läuft noch
komplett auf zwei fest eingebauten Demo-Reisen (kein echter
Reise-Speicher dahinter) — dafür also bewusst noch kein Content, aus
demselben Grund wie zuletzt bei den Entwurfs-Aktionen.

Wichtig zur Einordnung: "vom Freigabe-Chef geprüft und gemergt" heißt
nur, dass der Textentwurf sauber und wahrheitsgetreu zum Code ist —
nicht, dass er schon irgendwo veröffentlicht wurde. In `marketing/`
liegen inzwischen fünf fertige Entwürfe (Content-Plan, Woche-1-Posts,
Kartenansicht, Aktivitäten bearbeiten, jetzt Warenkorb), von denen laut
bisherigem Stand noch keiner tatsächlich live geschaltet ist.

## Vorschläge

1. **Entwurfs-Stapel gegen echtes Publizieren abgleichen.** Fünf
   Text-Stücke sind fertig und technisch geprüft, aber der eigentliche
   Schritt "posten" fehlt offenbar noch komplett. Bevor weitere Stücke
   entstehen, lohnt sich ein kurzer Ni-Durchgang: welche drei, vier
   Sätze reichen, um die ersten zwei Posts (z. B. Kartenansicht +
   Warenkorb) diese Woche wirklich rauszuschicken? Sonst wächst der
   Stapel schneller als die Reichweite.
2. **"Was ist echt, was ist Demo" als eigenes Format statt Randnotiz.**
   Mittlerweile gibt es genug Beispiele (Warenkorb echt, EditMode echt,
   Kalender & Entwurfs-Aktionen Demo), um daraus eine kleine,
   wiederkehrende Content-Reihe zu machen — z. B. ein kurzer
   Monats-Statusbeitrag "Was diesen Monat wirklich gespeichert wird".
   Macht die Ehrlichkeits-Positionierung greifbarer als einzelne
   Feature-Posts und braucht keine neuen Zahlen, nur den bestehenden
   Code-Stand.
3. **Kalender als Content-Idee vormerken, nicht schreiben.** Der
   Monatsraster-Kalender ist optisch ein gutes Bild für "Reise-Planung
   auf einen Blick" — aber erst posten, sobald er an echte
   Reise-Daten hängt, sonst bricht das Ehrlichkeits-Versprechen beim
   ersten Neuladen. Als Idee im Kopf behalten für den Moment, wo der
   echte Reise-Speicher kommt.
