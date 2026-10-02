# Support-Chef Bericht

**Datum:** 2026-10-02

## Was ist seit dem letzten Eintrag (2026-10-01) passiert?

Eine gute Nachricht zuerst: Mein Fund von gestern (Vorschlag 2) ist
gefixt und live. Der "Details ansehen"-Dialog bei Reiseentwürfen
(`src/pages/Reiseentwuerfe.tsx:373`) nutzt jetzt wie Lösch- und
Abschließen-Dialog die `getDraftLabel()`-Hilfsfunktion — bei
duplizierten, abgeschlossenen Entwürfen zeigt der Dialog jetzt den
unterscheidbaren Titel statt für beide Karten denselben rohen
Zielnamen. Im Code gegengeprüft, Fix sitzt korrekt.

Der automatische Kanal hat einen neuen, echten Reibungspunkt gefunden
(Details unten, Vorschlag 1).

Zwei Dauerbrenner bleiben unverändert offen: Der `formatDuration`-Fix
(PR #25) ist weiterhin nicht gemerged — im Code-Gegencheck heute
bestätigt: `src/components/search/FlightCard.tsx:25-27` zeigt bei
reiner Sekundenangabe immer noch das erfundene "1min" statt eines
ehrlichen "—". Und die Flugsuche-Ankündigung im Hauptchat
(`src/lib/ai/mockAdvisor.ts:172`) verspricht weiterhin eine Suche, die
im normalen Ablauf nie startet — laut IT-Chef immerhin inzwischen im
Code als bewusste, dokumentierte Grenze markiert statt als stilles
Versehen.

## Meine Vorschläge

1. **Favoriten-Seite: "Reise mit KI planen" ignoriert das Ziel der
   angeklickten Karte komplett.** `src/pages/Favoriten.tsx:112-117`:
   Jede Favoriten-Karte (z. B. "Kapstadt") hat einen eigenen, pro Ziel
   beschrifteten Button "Reise mit KI planen", der aber nur pauschal
   auf `<Link to="/ki-chat">` zeigt — ohne jeden Bezug zu
   `favorite.destination`. Im Chat (`useChat.ts:124-137`) gibt es dafür
   auch keinen Mechanismus wie das bereits etablierte `?edit=`-Pattern.
   Konkret heißt das: Ohne laufenden Entwurf landet man bei der
   generischen Begrüßung und muss "Kapstadt" erneut eintippen, obwohl
   man gerade gezielt draufgeklickt hat. Läuft gerade eine Planung für
   ein anderes Ziel (z. B. Lissabon), öffnet der Kapstadt-Klick
   stattdessen unverändert die Lissabon-Konversation — ohne jeden
   Hinweis, dass der Klick wirkungslos war. *Vorschlag:* Ziel als
   Query-Parameter mitgeben (`/ki-chat?destination=Kapstadt`), der nur
   greift, wenn noch kein eigener Entwurf existiert — analog zum
   bestehenden `?edit=`-Muster.

2. **PR #25 zeitnah mergen.** `src/components/search/FlightCard.tsx`
   und `TrainCard.tsx`: Solange die Sekunden-Änderung nicht auf main
   ist, sehen Nutzer:innen bei kaputten Rohdaten weiterhin ein
   erfundenes "1min" statt eines ehrlichen "—" — genau das Muster, das
   in denselben Dateien bei `formatTime()`/`formatLocation()` schon
   korrekt gelöst ist. Kleiner, klar abgegrenzter Fix, der nur noch auf
   Merge wartet.

3. **Flugsuche im Hauptchat verspricht weiterhin mehr, als sie hält.**
   `src/lib/ai/mockAdvisor.ts:172`: Wer im normalen Ablauf (nicht über
   "Bearbeiten") Flug wählt, bekommt *"Ich suche jetzt nach echten
   Flug-Verbindungen für [Ziel] …"* — es startet aber keine Suche,
   einziger nächster Schritt ist "Neue Reise planen". *Vorschlag
   bleibt:* entweder im Hauptablauf ebenfalls nach dem Abflughafen
   fragen und die echte Suche auslösen (wie im Bearbeiten-Pfad,
   `useChat.ts:229-262`), oder die Ankündigung ehrlich auf den
   zusätzlichen Schritt umformulieren — wie bei Bus/Fähre/Mietwagen
   bereits sauber gelöst.

_Letztes Update: 2026-10-02_
