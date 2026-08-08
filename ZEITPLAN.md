# Zeitplan travix.ai

Zuletzt aktualisiert: 2026-08-09 von Lina

## Wichtige Annahme (bitte bestätigen)
Die Zieldaten unten gehen von einem **Teilzeit-Tempo** aus (grob 10-15
Std./Woche, KI-unterstützt). Das ist eine Annahme, keine bekannte Tatsache
über Nis tatsächliche Kapazität — bitte korrigieren, falls das nicht
stimmt (mehr oder weniger Zeit verfügbar), dann passe ich alle Daten an.

## Release-Scope: MVP statt Vollausbau
Das komplette PRD (`tasks/tasks-prd-travix-platform.md`) beschreibt 20+
Seiten inkl. eigenem Buchungs-/Zahlungsprozess. Das als Ganzes zu bauen UND
launch-fertig zu machen (inkl. Reiserecht: Widerrufsrecht, AGB) dauert
deutlich länger als ein fokussierter Erstlaunch. Deshalb schlägt dieser
Zeitplan einen **MVP-Release** vor:
- Nutzer planen per KI-Chat, sehen echte Flugangebote (Duffel), landen für
  die eigentliche Buchung beim Anbieter (kein eigener Zahlungsprozess).
- Rest aus dem PRD (Dashboard, Kalender, Budget, Karte, Preisalarme,
  Premium, eigener Zahlungsprozess, Duffel Stays) kommt **nach** dem
  MVP-Launch dazu.

Falls Ni von Anfang an den vollen Funktionsumfang inkl. eigenem
Buchungsprozess will, verschiebt sich das Release-Datum deutlich (eher
Monate als Wochen) — sag Bescheid, dann rechne ich das neu.

## Ist-Stand (aus Repo + dieser Session, Stand 2026-08-09)
- ✅ Phase 1 Scaffolding — fertig (Vite, Tailwind, shadcn/ui, Routing)
- 🟡 Phase 3 Layout/Navigation — 7/8, nur Seitenübergangs-Animationen offen
- 🟡 Phase 4 KI-Chat — UI komplett fertig, läuft aber noch auf einem
  lokalen Mock-Advisor statt echter KI (Base44/Gemini fehlt noch)
- 🟢 Duffel Flugsuche — läuft **live** mit echten Testdaten
- 🔴 Duffel Hotels (Stays) — Code fertig, aber von Duffel selbst noch nicht
  freigeschaltet (externe Abhängigkeit, kein Einfluss von uns auf Tempo)
- 🟡 Reiseplan- und Urlaubsmodus-Seiten — gebaut, laufen auf Mock-Daten
- ⚪ Phase 2 Auth/Backend — noch nicht begonnen (Backend-Entscheidung
  offen: Base44 oder Alternative)
- ⚪ Restliche Übersichtsseiten (Warenkorb, Reiseentwürfe, Dashboard,
  Kalender, Budget, Karte, Aktivitäten, Angebote, Favoriten,
  Preisalarme, Premium) — noch nicht begonnen
- 🟡 Support — E-Mail-Adresse gerade in Einrichtung, Triage-Skill fertig
- ⚪ Marketing — noch nicht begonnen
- ⚠️ Aktueller Code-Stand ist noch nicht committed/gepusht

## Meilensteine

### Programmierung
| Meilenstein | Zieldatum | Status | Notiz |
|---|---|---|---|
| Aktuellen Stand committen & pushen | 2026-08-10 | 🟡 knapp | Reine Aufräumarbeit, sollte nicht warten |
| Backend-Entscheidung (Base44 vs. Alternative) | 2026-08-16 | ⚪ noch nicht gestartet | Blockiert echte KI-Anbindung UND Auth |
| Echte KI-Anbindung (ersetzt Mock-Advisor) | 2026-08-30 | ⚪ noch nicht gestartet | Größter Einzelposten |
| Auth & Nutzerkonten | 2026-09-06 | ⚪ noch nicht gestartet | Kann teilweise parallel zur KI-Anbindung laufen |
| Warenkorb & Reiseentwürfe (Resume-Funktion) | 2026-09-13 | ⚪ noch nicht gestartet | MVP-relevant |
| Testing, Bugfixing, Mobile-Politur | 2026-09-20 | ⚪ noch nicht gestartet | |
| Duffel Stays freigeschaltet | offen | 🔴 verzögert | Liegt bei Duffel, nicht planbar — MVP läuft auch ohne |

### Marketing
| Meilenstein | Zieldatum | Status | Notiz |
|---|---|---|---|
| Positionierung & Zielgruppen fest | 2026-08-16 | ⚪ noch nicht gestartet | Kann sofort starten, unabhängig vom Code |
| Landingpage/Warteliste live | 2026-08-23 | ⚪ noch nicht gestartet | Guter früher Schritt vor dem eigentlichen Launch |
| Erste Content-Stücke (Social, Blog o.ä.) | 2026-09-13 | ⚪ noch nicht gestartet | |
| Test-Kampagnen (kleines Budget) vorbereitet | 2026-09-27 | ⚪ noch nicht gestartet | Erst kurz vor Launch sinnvoll |

### Support & Rechtliches
| Meilenstein | Zieldatum | Status | Notiz |
|---|---|---|---|
| Support-E-Mail live | 2026-08-12 | 🟡 knapp | Gerade in Arbeit (iCloud-Alias-Weg) |
| FAQ/Hilfe-Inhalte | 2026-09-13 | ⚪ noch nicht gestartet | |
| Impressum, Datenschutzerklärung, AGB | 2026-09-13 | ⚪ noch nicht gestartet | **Pflicht** vor Live-Schaltung in DE/EU, unabhängig vom Funktionsumfang — kein Anwalt hier im Team, Ni muss das selbst klären oder einen Generator/Anwalt nutzen |

## Empfohlenes Release-Datum
**MVP Soft-Launch: 2026-10-04** (~8 Wochen ab heute)

Das ist ein Vorschlag auf Basis der Teilzeit-Annahme oben, nicht final.
Bitte bestätigen oder anpassen — insbesondere die Wochenstunden-Annahme
und ob der MVP-Scope (kein eigener Zahlungsprozess) so passt.
