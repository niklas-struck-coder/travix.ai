# Big Apple Global Campus – Amsterdam (interaktive 3D-Welt)

Begehbare 3D-Welt des Hauptsitzes der Big Apple Groups. Läuft vollständig im Browser
(React + Three.js + React Three Fiber + Drei, TypeScript, Vite). Alle Gebäude, Möbel,
Fahrzeuge und Personen werden prozedural erzeugt – es werden keine externen 3D-Modelle
oder Texturen geladen.

## Starten

```bash
cd campus
npm install
npm run dev        # Entwicklungsserver, dann http://localhost:5173 öffnen
npm run build      # Produktions-Build nach campus/dist (statisch hostbar, relative Pfade)
npm run preview    # Build lokal ansehen
```

## Steuerung

| PC | Funktion |
| --- | --- |
| W A S D | laufen |
| Maus | umsehen (Klick ins Bild aktiviert die Maussteuerung) |
| Shift | rennen |
| Leertaste | springen |
| E | interagieren (Tür, Aufzug, Monorail, Sitzplatz, Bildschirm, Info) |
| M | Campuskarte |
| 1 / 2 / 3 / 4 | First Person / Third Person / Vogelperspektive / Architekturmodus |
| Q / E (Architekturmodus) | runter / hoch fliegen |
| T | Tageszeit wechseln (Morgen, Mittag, Abend, Nacht) |
| H | Steuerungshinweise ein/aus |
| Esc | Menü |

Smartphone/Tablet: Joystick links (voll ausgelenkt = rennen), rechte Bildschirmhälfte zum
Umsehen, Buttons für Aktion, Springen, Karte, Kamera und Menü. Auf Touch-Geräten wird
automatisch die Grafikqualität „Niedrig“ gewählt.

## Inhalt (Stand dieser Version)

- **Holding-Headquarter**: runder Turm, 22 Etagen (~101 m), Glasfassade mit weißen/dunklen
  Bändern und dezenten apfelgrünen Akzenten, Logo am Turm, keine Kuppel/Spitze. Lobby mit
  Empfang, Besucherregistrierung (funktioniert), Logo-Wand, Sitzbereichen, digitalen Screens,
  Markenwelt-Ausstellung; Wendeltreppe zur Galerie (Mitarbeiterrestaurant, Lounge,
  Besprechungsboxen); Aufzug zu 4. OG (Finance, Legal & Compliance), 7. OG (Technology, HR),
  10. OG (Internationale Unternehmensentwicklung, Strategie, Besprechungsräume),
  18. OG (Geschäftsführung, Chairman-Büro, Vorstandskonferenzraum), 21. OG (Executive
  Lounge, großer Konferenzraum) und Dachterrasse mit Panorama-Fernrohr.
- **Unternehmensgebäude** (Tech, Finance, Fitness, Logistics, Mobility, Hotels, Holidays,
  Entertainment, Trains, Foundation, **Groups Racing**) mit eigener Fassade, Außenelementen
  und 2–3 begehbaren Etagen (Aufzug + echtes Treppenhaus) mit den geforderten Räumen.
- **Big Apple Groups Racing** (Formel-1-Team, frei stehend am HQ-Platz wie die Foundation): F1-Auto auf
  einem beleuchteten Podest am Eingang, F1-Showroom mit Rennwagen, Trophäen und Helmen,
  Rennsimulatoren, Race Control & Telemetrie, Aerodynamik/Windkanal, Strategieraum,
  Engineering, Fahrer-Performance.
- **Big Apple Health & Recovery Center** für Mitarbeitende: Physiotherapie,
  betriebsärztlicher Dienst, Recovery & Sauna, Massage, Meditation, Health-Café,
  Kneipp-Becken im Garten.
- **Campus Hotel** (Lobby, Rezeption, Restaurant, Bar, Fitness, Konferenzräume,
  Gästezimmer, Terrasse, Dachterrasse) und **Mitarbeiter-Residenz** (Hotel für anreisende
  Mitarbeitende: Apartments, Gemeinschaftsküche, Co-Working, Waschsalon, Dachterrasse).
- **Big Apple Visitor Center** (Besucherzentrum, gegenüber dem HQ-Haupteingang):
  Besucherempfang, Unternehmensausstellung, Auditorium (Big Apple Innovation Week),
  Pressebereich, Konferenz- und Präsentationsräume. Das runde Holding-HQ ist das einzige
  Gebäude mit dem Logo „Big Apple Groups“.
- **Monorail**: erhöhter Rundkurs, 5 Stationen mit Treppe und Lift, ein 3-Wagen-Zug mit
  automatischem Halt, öffnenden Türen und Abfahrtsanzeigen. Einsteigen mit E, Fahrt aus der
  Kabine, Aussteigen mit E an der nächsten Station.
- **Infrastruktur**: Ringstraße mit Verkehr und Bussen, Haltestellen, Boulevard,
  Besucherparkplätze mit Ladestationen, Radwegring, Feuerwehrzufahrt, Anlieferungen,
  Energiezentrale, unterirdisches Parkhaus (Rampe + Glas-Aufzug), Campussee, Gracht mit
  Amsterdamer Grachtenhäusern.
- **Lebendige Welt**: Fußgänger, Radfahrer, sitzende Personen in Kantine, Meetings und
  Auditorium, Passagiere an den Stationen, automatische Schiebetüren, wechselnde
  Bildschirminhalte, Tageszeit mit Nachtbeleuchtung, Wetter (Sonne, Bewölkt, Regen).
- **UI**: Hauptmenü, HUD (Logo, Uhrzeit, Wetter, Minikarte, Standort), Gebäude-Infokarten,
  interaktive Campuskarte (Name, Beschreibung, Entfernung, Navigation, Teleport,
  Architekturansicht), Einstellungen.

## Ehrliche Grenzen

- Im HQ hält der Aufzug nur auf den ausgestalteten Etagen; die übrigen Etagen sind von außen
  sichtbar, aber nicht begehbar. Treppen gibt es im HQ zwischen Lobby und Galerie.
- Navigation zeigt Richtung und Entfernung in Luftlinie, keine Wegberechnung.
- Das Logo ist typografisch nach der Beschreibung nachgebaut (Big schwarz, Apple grün,
  Blatt, Suffix schwarz). Sobald die offizielle Logodatei vorliegt, kann sie in
  `src/engine/materials.ts` (`drawLogo`) und `src/ui/Logo.tsx` eingebunden werden.
- Fahrzeuge fahren nur auf der Ringstraße; Kennzahlen und Bildschirminhalte sind Beispiele.
- Die Tavium-KI-Demo zeigt ein Beispiel, sie stellt keine echte KI-Anfrage.

## Architektur

```
src/
  config/campus.ts            Masterplan: Gebäude, Positionen, Stationen, Garage, See
  engine/colliders.ts         Kollisionswelt (Box/Zylinder/Kreissektor, Spatial Hash, Treppen per Step-up)
  engine/builder.ts           WorldBuilder: prozedurale Geometrie → Instanced Meshes je Chunk (LOD)
  engine/materials.ts         Materialfamilien, Canvas-Texturen, Logo- und Schild-Texturen
  engine/registry.ts          Interaktionen, Zonen (Standortanzeige), NPC-Spawns, Bildschirme
  world/CampusGround.ts       Gelände, Straßen, Wege, Wasser, Bäume, Parken, Garage, Gracht
  world/HoldingHeadquarters.ts  rundes HQ inkl. Etagen und Dachterrasse
  world/GenericBuilding.ts    Gebäudegenerator (Fassadenstile, Etagen, Kern, Treppen, Räume)
  world/SubsidiaryBuildings.ts  Programme + Außenelemente der 10 Tochtergebäude
  world/Hotels.ts             Campus Hotel und Mitarbeiter-Residenz
  world/VisitorCenter.ts      Big Apple Visitor Center (Besucherzentrum)
  world/rooms.ts, kits.ts     Raumprogramme und Möbel-Kits
  world/dynamic.ts            Aufzüge, Schiebetüren, Treppen, Sitzplätze, Infopunkte
  systems/                    PlayerController, Monorail, NPCs, Verkehr, Licht/Wetter, Renderer
  ui/                         Hauptmenü, HUD, Karte/Minikarte, Panels, Touch-Steuerung
```

Neues Gebäude: Eintrag in `config/campus.ts` ergänzen und in
`world/SubsidiaryBuildings.ts` ein Etagenprogramm (`FloorSpec[]`) hinterlegen – der
Generator erzeugt Fassade, Eingang, Aufzug, Treppenhaus, Räume, Kollisionen und Zonen.
