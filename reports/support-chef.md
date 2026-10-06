# Support-Chef Bericht

**Datum:** 2026-10-05

## Was ist seit dem letzten Eintrag (2026-10-02) passiert?

Zwei gute Nachrichten zuerst, beide im Code gegengeprüft: Der
`formatDuration`-Fix ist live — `src/components/search/FlightCard.tsx:17-23`
zeigt bei reiner Sekundenangabe jetzt ehrlich "—" statt des erfundenen
"1min". Und der Favoriten-Fund von letztem Mal ist ebenfalls gefixt —
`src/pages/Favoriten.tsx:112-114` übergibt das angeklickte Ziel jetzt als
Query-Parameter an den Chat (`/ki-chat?destination=...`), inklusive eines
Randfall-Fixes am 04.10., falls schon ein anderer Entwurf läuft.

Daneben kamen aus dem technischen Kanal drei kleinere, für Nutzer:innen
kaum spürbare Fixes: eine fehlende 404-Seite, ein instabiler Listen-Key
in `TripSummaryCard`, und eine Prüfung im Chat, die verhindert, dass man
beim Flug "von LIS nach LIS" sucht.

Unverändert offen bleibt der Flugsuche-Fund: `src/lib/ai/mockAdvisor.ts:171-182`
kündigt im Hauptchat weiterhin eine echte Flugsuche an, die im normalen
Ablauf nie startet. Immerhin ist das jetzt im Code klar als bewusste
Grenze kommentiert statt als stilles Versehen — aber für die Person im
Chat ändert das nichts, das Versprechen steht seit über zwei Wochen so da.

## Meine Vorschläge

1. **Lösch-Warnungen sind überall gleich "endgültig" formuliert — unabhängig
   davon, wie viel dabei wirklich auf dem Spiel steht.** Die
   Entfernen-Bestätigung "Das lässt sich nicht rückgängig machen" taucht
   wortgleich in sechs Dateien auf: `Favoriten.tsx:128`, `Warenkorb.tsx:134`,
   `Preisalarme.tsx:137`, `Angebote.tsx:139`, `Aktivitaeten.tsx:118` und
   `Reiseentwuerfe.tsx:336/356`. Bei einem Reiseentwurf ist die scharfe
   Warnung berechtigt — da steckt echte Planungsarbeit drin. Bei einem
   Favoriten-Eintrag, einem Preisalarm oder einer vorgemerkten Aktivität
   ist "entfernen" aber trivial wieder rückholbar (ein Klick auf das Herz,
   eine neue Suche) — die gleich schwere Formulierung wirkt dort unnötig
   alarmierend. *Vorschlag:* für die fünf "leichten" Listen eine ruhigere
   Formulierung verwenden (z. B. "Du kannst [X] jederzeit wieder
   hinzufügen") und die scharfe "nicht rückgängig"-Warnung für
   `Reiseentwuerfe.tsx` reservieren, wo sie wirklich etwas schützt.

2. **Beim Flugsuche-Versprechen ließe sich der Text schon jetzt ehrlicher
   machen, ohne auf die Backend-Anbindung zu warten.** `mockAdvisor.ts:171`
   verspricht aktuell dieselbe "Ich suche jetzt echte Verbindungen"-Formel
   wie der tatsächlich funktionierende Flug-Bearbeiten-Pfad — nur dass im
   Hauptchat keine Suche folgt. Die anderen Modi (Zug/Bus/Fähre/Auto) haben
   dafür schon eine andere, ehrliche Formulierung ("hab ich noch keine
   automatische Suche"). Statt auf die größere Backend-Frage zu warten
   (laut IT-Chef weiterhin offen), wäre ein reiner Text-Fix an dieser einen
   Stelle — dieselbe ehrliche Formulierung wie bei den anderen Modi nutzen
   — sofort umsetzbar und würde das Versprechen schon heute einlösbar
   machen, auch ohne dass die echte Suche dahinter schon steht.

_Letztes Update: 2026-10-05_
