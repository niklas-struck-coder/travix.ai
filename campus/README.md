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

## Lokal ohne Server (Doppelklick)

```bash
npm run build:lokal
```

erzeugt im Ordner `lokal/` zwei eigenständige Dateien, die sich per Doppelklick im Browser
öffnen lassen (kein Server, keine Installation): `Big-Apple-Campus.html` (die 3D-Welt) und
`Big-Apple-Masterplan.html` (die Pläne; Schriften werden online nachgeladen, sonst Ersatzschrift).

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

## Inhalt (Masterplan 2.0)

Die Gebäudeliste, Lage, Größen und Raumprogramme stehen in `src/config/campus.ts` und
`src/config/programs.ts`. Daraus werden sowohl die 3D-Welt als auch die Masterplan-Seite
(`masterplan.html`: Lageplan, Grundrisse Ebene –1 und –2, Schnitt, Monorail, Zugänge,
Raumlisten) erzeugt.

- **Holding-HQ** (rund, 22 Etagen, ≈ 101 m): nur Unternehmensführung und Konzernverwaltung –
  Lobby, Galerie (Mitarbeiter-Café), 4. OG Finance & Controlling / Legal & Compliance,
  7. OG HR / IT & Konzernverwaltung / Communications, 10. OG Strategy / International
  Business Development / M&A, 18. OG Chairman Office / Group Management / Vorstand,
  21. OG Executive Lounge / Vorstandskonferenzraum, Dachterrasse.
- **Unternehmens-HQs**: Tech, Finance, Mobility, Holidays, Logistics, Trains, Entertainment
  und Fitness (äußerer Ring, Fitness direkt neben Health & Recovery) sowie Racing, Café, Hotels HQ und Foundation (am HQ-Platz).
  **Fitness ist reines Bürogebäude ohne Studio** (nur Musterflächen); das Fitnessstudio
  gehört zu **Big Apple Health & Recovery** (Training, Health, Recovery, Umkleiden).
- **Big Apple Hotel**: eigenständiges, mittelgroßes Hotel am Rand (Lobby, Restaurant mit
  Frühstück, Bar, Terrasse, Fitness, Besprechung, Standard-/Superiorzimmer, Suiten,
  Backoffice, Housekeeping & Wäscherei). **Big Apple Hotels HQ** ist davon getrennt.
- **Media Center**: Film-/TV-Studio, Nachrichtenstudio, Podcast, Ton, Regie, Schnitt,
  Foto, Make-up, Technik, Vorführraum.
- **Visitor Center**: Besucher- und Lernzentrum mit Museum, Learning Center, Bibliothek,
  Café und Campusmodell (kein Konferenzzentrum mehr).
- **Business Center I & II** für kleinere Unternehmen mit Mieterverzeichnis.
- **Big Apple Café** am HQ-Platz (Stil wie die Foundation): Barista-Theke mit Speisen, Sitzplätze, Holzhütten, freistehende Treppe, Obergeschoss zum Sitzen und Arbeiten.
- **Ebene –1 Campus-Promenade**: zentraler Ring um das HQ, vier Achsen (Kreuz) mit
  Fahrsteigen, äußerer Ring; jedes Gebäude mit Zugang, Foyer, Aufzug, Treppe und
  Zugangskontrolle; Coffee Points, Sitznischen, Bänke, Pflanzen, digitale Wegweiser.
- **Ebene –2 Tiefgarage**: baulich getrennt, Ein-/Ausfahrten Ost und Süd, Bereiche für
  Mitarbeitende, Besucher, E-Laden, Barrierefrei, Motorräder und Fahrräder; nur über vier
  Aufzugskerne (zwei als Glaslift bis zum HQ-Platz) und ein Treppenhaus mit Ebene –1
  verbunden.
- **Monorail**: Rundkurs mit 5 Stationen (Halt ca. 24 s, Ankunftszeit am Bahnsteig; über die Campuskarte kann man direkt zum Bahnsteig springen), keine weiteren Brücken oder Stege.
- **Campusring**: Straße innerhalb des Rings (Liefer- und Feuerwehrweg, 20 km/h) mit Zebrastreifen und vier Verbindungen zur Ringstraße.
- Weiterhin: Ringstraße mit Verkehr, Busse, Boulevard, Besucherparkplätze, Radweg,
  Feuerwehrzufahrt, Energiezentrale, Campussee, Gracht, NPCs, Tageszeiten, Wetter.

## Ehrliche Grenzen

- Im HQ hält der Aufzug nur auf den ausgestalteten Etagen; die übrigen Etagen sind von außen
  sichtbar, aber nicht begehbar. Treppen gibt es im HQ zwischen Lobby und Galerie (Ebene –1
  über den Aufzug). In den anderen Gebäuden sind 2–4 Geschosse begehbar.
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
  world/BusinessCenters.ts    Business Center mit Mieterverzeichnis
  world/Cafe.ts               Big Apple Café (2 Geschosse, Barista-Theke, Hütten, Arbeitsplätze)
  world/Underground.ts        Ebene –1 Promenade, Ebene –2 Tiefgarage, Rampen
  config/programs.ts          Raumprogramme, Einrichtung, Innenraumkonzepte
  masterplan/                 Masterplan-Seite (Pläne werden aus den Daten erzeugt)
  world/rooms.ts, kits.ts     Raumprogramme und Möbel-Kits
  world/dynamic.ts            Aufzüge, Schiebetüren, Treppen, Sitzplätze, Infopunkte
  systems/                    PlayerController, Monorail, NPCs, Verkehr, Licht/Wetter, Renderer
  ui/                         Hauptmenü, HUD, Karte/Minikarte, Panels, Touch-Steuerung
```

Neues Gebäude: Eintrag in `config/campus.ts` ergänzen und in
`world/SubsidiaryBuildings.ts` ein Etagenprogramm (`FloorSpec[]`) hinterlegen – der
Generator erzeugt Fassade, Eingang, Aufzug, Treppenhaus, Räume, Kollisionen und Zonen.
