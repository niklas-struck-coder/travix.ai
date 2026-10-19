# Support-Chef Bericht

**Datum:** 2026-10-19

## Was ist seit dem letzten Eintrag (2026-10-18) passiert?

Der Zug/Flug-Punkt aus meinem letzten Bericht ist jetzt wirklich vom
Tisch: Ich hatte am 17.10. gefunden, dass nach einem Wechsel des
Transportmittels die alte Flugverbindung als Detail stehen blieb. Am
18.10. hatte ich das im Code als gefixt eingeschätzt (`useChat.ts:373`
setzt `transportDetail: null` beim Moduswechsel), und heute haben IT-Chef
und Marketing-Chef das unabhängig nochmal bestätigt. Der Punkt ist raus
aus meiner Liste.

Neuer Fund von heute: `formatTime()` in `src/lib/format.ts:23` zeigte bei
einem kaputten/unparsbaren Zeitstempel (z. B. aus einer fehlerhaften
Duffel-Antwort) wörtlich "Invalid Date" auf der Flug-/Zugkarte statt eines
Platzhalters — ein Tippfehler-Datum, das ein Nutzer nie zu sehen bekommen
sollte. Der Fix dafür liegt bereits als eigener Branch/PR vor (ergänzt den
gleichen `Number.isNaN(date.getTime())`-Check, den `formatDuration()` schon
nutzt), ist aber nach meinem letzten Check noch nicht in `main` gemerged —
lohnt sich, das zeitnah durchzuziehen, damit der Platzhalter auch live
ankommt.

Alles andere seit gestern war reine Testabdeckung (Card, Select, Tabs,
Button) sowie das Zusammenziehen von `formatTime()` aus FlightCard/
TrainCard nach `lib/format.ts` — ohne etwas, das du als Nutzer merkst.

## Meine Vorschläge

1. **`formatTime()`-Fix zeitnah mergen.** Die Korrektur gegen "Invalid
   Date" auf Flug-/Zugkarten (`src/lib/format.ts:23`) ist fertig
   vorbereitet, aber laut meinem letzten Stand noch nicht live. Bis dahin
   kann ein Nutzer bei einer fehlerhaften Angebots-Antwort diesen
   verwirrenden Text tatsächlich sehen.

2. **Lösch-Warnungen klingen überall gleich dramatisch, auch wenn es das
   nicht ist.** `Favoriten.tsx:128`, `Warenkorb.tsx:134`,
   `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118` und
   `src/components/trip/EditMode.tsx:151` sagen weiterhin wortgleich "Das
   lässt sich nicht rückgängig machen" — auch dort, wo ein Favorit oder
   eine Aktivität mit einem Klick wieder anlegbar wäre. *Vorschlag:* den
   Warnhinweis nur dort zeigen, wo wirklich etwas Unwiderrufliches
   passiert (z. B. eine Buchung), bei trivial wiederherstellbaren Aktionen
   neutraler formulieren.

3. **Die "Urlaubsmodus"-Karte für die Lissabon-Demoreise kann auf einen
   leeren oder falschen Chat führen.** `src/pages/MeineReisen.tsx:49`
   verlinkt von der Lissabon-Demokarte auf `/urlaubsmodus`, die Seite
   selbst (`src/pages/Urlaubsmodus.tsx:12`) lädt ihren Trip aber immer noch
   aus `loadStoredChat()?.trip` statt aus der Demoreise. Hat jemand noch
   nie mit dem KI-Chat eine Reise geplant, landet er beim Klick in einem
   Urlaubsmodus ohne Reisebezug oder mit einem ganz anderen Ziel.
   *Vorschlag:* die Demokarte mit echten Lissabon-Demodaten befüllen, oder
   ausblenden, bis echte Buchungen angebunden sind.

_Letztes Update: 2026-10-19_
