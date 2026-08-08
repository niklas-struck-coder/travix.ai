# Marketing-Chef-Agent — Architekturkonzept

## Ziel

Ein KI-"Marketing Chef", der eigenständig Marketing-Strategie betreibt: Konzepte schreiben, Zielgruppen analysieren, Kampagnen planen — und später operative Teilaufgaben an spezialisierte Subagenten delegiert (Social Media, Analyse, Content). Das Muster ist so gebaut, dass es sich 1:1 auf weitere Abteilungen (Sales, Support, Finance) übertragen lässt.

Konkretes Beispiel: travix.ai. Generisches Muster: für jedes Unternehmen/jede Abteilung wiederverwendbar.

---

## Grundprinzip: Orchestrator + Subagenten

Zwei Ebenen, die unterschiedliche Jobs machen:

**Orchestrator ("Marketing Chef")** — hält die Strategie, denkt in Zielgruppen, Positionierung, Kampagnenzielen. Bekommt einen Auftrag ("Plane die Sommerkampagne"), zerlegt ihn in Teilaufgaben und delegiert das Operative.

**Subagenten** — führen einen engen, klar definierten Job aus, mit eigenem Kontext und eigenen Tools. Sie kennen keine Gesamtstrategie, nur ihren Auftrag. Beispiele: Social-Media-Agent (Postings entwerfen, Kalender pflegen), Analyse-Agent (Kennzahlen auswerten, Reports schreiben), später SEO-Agent, Content-Agent, Ads-Agent.

Der Marketing Chef bleibt der einzige, der das große Bild hat. Subagenten liefern Bausteine zurück, der Chef fügt sie zusammen und trifft die Entscheidung.

```
                 ┌─────────────────────┐
                 │   Marketing Chef      │  ← Strategie, Zielgruppen,
                 │   (Orchestrator)      │    Konzepte, Freigabe
                 └──────────┬───────────┘
             delegiert Teilaufgaben, bündelt Ergebnisse
       ┌───────────────┬───────────────┬──────────────────┐
       ▼               ▼               ▼                  ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐  ┌─────────────────┐
│ Social Media │ │  Analyse    │ │  Content     │  │  ... (später)    │
│   Agent      │ │   Agent     │ │   Agent      │  │  SEO / Ads / PR  │
└─────────────┘ └─────────────┘ └─────────────┘  └─────────────────┘
```

---

## Technische Umsetzung (Claude Code / Cowork)

Zwei Bausteine, die zusammenspielen:

**Skill = Fachwissen.** Ein `SKILL.md` kapselt, wie der Marketing Chef denkt und arbeitet: Framework für Zielgruppenanalyse (Personas, Bedürfnisse, Painpoints), Template für Marketing-Konzepte (Positionierung, Botschaft, Kanäle, KPIs), Ton & Struktur der Outputs. Das ist die "Persona" des Marketing Chefs — lädt sich, sobald der Skill aufgerufen wird.

**Subagent = Ausführungseinheit.** Eigene Definition mit eigenem Systemprompt, eigenen Tools und eigenem Kontextfenster. In Claude Code werden solche Subagenten als Dateien in `.claude/agents/*.md` im Projekt definiert (dein travix.ai-Projekt hat diesen Ordner bereits). In Cowork rufe ich sie über das Agent-Tool mit präzisem Auftrag auf — fachlich dasselbe Prinzip, nur ohne feste Typ-Registrierung.

Jeder Subagent braucht klar begrenzte Tools: Social-Media-Agent z. B. Zugriff auf die jeweiligen Plattform-Connector (Meta/Instagram, LinkedIn, X — via MCP-Connector, falls verbunden), Analyse-Agent Zugriff auf Analytics-Datenquelle (GA4, Mixpanel, o. ä., ebenfalls über Connector) plus Rechenfähigkeit für Auswertungen.

---

## Phasenplan

**Phase 1 — Marketing Chef solo.** Skill mit Zielgruppen-Framework + Konzept-Template. Schreibt Konzepte, Personas, Positionierung — noch ohne Subagenten. Sofort nutzbar.

**Phase 2 — Erster Subagent: Analyse.** Marketing Chef kann Kennzahlen (Traffic, Conversion, Kampagnenperformance) auswerten lassen und Erkenntnisse in neue Konzepte einfließen lassen. Voraussetzung: eine Datenquelle ist angebunden (z. B. Analytics-Connector oder Export-Dateien).

**Phase 3 — Social-Media-Agent.** Erstellt Content-Entwürfe und Postings-Kalender auf Basis der Konzepte des Chefs. Voraussetzung: Plattform-Connector oder manueller Review-Workflow (Entwürfe → Freigabe → Posting).

**Phase 4 — Weitere Spezialisten je nach Bedarf.** SEO-Agent, Ads-Agent, PR-Agent — je nachdem, was operativ am meisten Zeit spart.

**Phase 5 — Muster auf andere Abteilungen übertragen.** Gleicher Bauplan, andere Fachlichkeit: Sales-Chef (Lead-Qualifizierung, Angebotsstrategie) mit Subagenten für CRM-Pflege und Forecast-Analyse; Support-Chef (Eskalationsstrategie, Qualitätsstandards) mit Subagenten für Ticket-Triage und Kundenzufriedenheits-Analyse; Finance-Chef (Budgetplanung, Reporting) mit Subagenten für Buchhaltungsabgleich und Forecast. Jede Abteilung bekommt ihren eigenen Orchestrator-Skill plus zugeschnittene Subagenten — die Struktur bleibt identisch, nur Fachwissen und Tools wechseln.

---

## Anwendung auf travix.ai (Beispiel)

Zielgruppe laut Produktkontext: Freizeitreisende (Paare, Familien, Solo), die Transparenz schätzen (echte Angebote, keine erfundenen Daten) und Wert auf eine stressfreie, unterbrechbare Planung legen.

Mögliche erste Aufträge an den Marketing Chef: Positionierung schärfen ("das intelligenteste digitale Reisebüro" — wie kommuniziert man das gegen klassische Buchungsportale?), Content-Linien für die drei Kernzielgruppen (Paare/Familien/Solo) getrennt entwickeln, Kampagnenkonzept für die Buchungslücke nutzen (Reiseentwürfe, die nie abgeschlossen wurden — Reaktivierungs-Kampagne), SEO-/Content-Strategie rund um "KI-Reiseplanung", "Zugreisen planen" etc.

Späterer Analyse-Agent könnte z. B. auswerten: wo Nutzer in der Buchungsstrecke abspringen (Reiseentwürfe vs. abgeschlossene Buchungen), welche Zielgruppe am meisten konvertiert.

---

## Offene Entscheidungen vor dem Bau

Bevor Phase 1 konkret gebaut wird, braucht es kurze Antworten auf:

Markenstimme — gibt es schon Tonalität/Guidelines, oder soll der Marketing Chef sie selbst entwickeln?

Datenquellen — welche Analytics-/Kampagnendaten sind überhaupt verfügbar (Connector, Exportdateien, noch nichts)?

Freigabeprozess — sollen Konzepte/Postings direkt an dich zur Freigabe gehen, oder soll der Chef eigenständiger agieren?

Erste Abteilung nach Marketing — falls das Muster als Nächstes auf eine zweite Abteilung übertragen wird, welche hat Priorität?
