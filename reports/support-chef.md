# Support-Chef Bericht

**Datum:** 2026-10-06

## Was ist seit dem letzten Eintrag (2026-10-05) passiert?

Eine gute Nachricht, im Code gegengeprüft: Mein Vorschlag 2 von letztem
Mal ist umgesetzt. `src/lib/ai/mockAdvisor.ts` verspricht beim
Flugmodus im Hauptchat jetzt dieselbe ehrliche Formulierung wie bei
Zug/Bus/Fähre/Mietwagen ("hab ich noch keine automatische Suche") statt
eines nie erfüllten Suchversprechens. Das stand seit über zwei Wochen
offen — schön, dass es jetzt steht.

Mein Vorschlag 1 (uneinheitliche Lösch-Warnungen) ist dagegen noch
unverändert offen — die scharfe "Das lässt sich nicht rückgängig
machen"-Formulierung steht weiterhin wortgleich in `Favoriten.tsx:128`,
`Warenkorb.tsx:134`, `Preisalarme.tsx:137`, `Aktivitaeten.tsx:118` und
`Reiseentwuerfe.tsx:336/356` — dazu kommt mir heute aufgefallen noch
`EditMode.tsx:147` (Aktivität aus einer Reise entfernen) als weitere
Stelle mit derselben scharfen Formulierung für eine eigentlich leicht
rückholbare Aktion.

Außerdem hat der andere, branch-basierte Support-Chef-Lauf zwei neue
Funde gemeldet (`support-chef-auto-log.md`), die ich im Code bestätigen
konnte und die noch nicht gefixt sind.

## Meine Vorschläge

1. **Fehlermeldung bei "Start = Ziel" im Flug-Chat nennt den Zielort
   nicht.** `src/hooks/useChat.ts:261` antwortet bei gleichem Abflug-
   und Zielflughafen nur mit "Start und Ziel dürfen nicht gleich sein
   — welcher Flughafen ist dein Abflugort?" Für die Nutzerin bleibt
   unklar, *welchen* Code sie da gerade nochmal eingegeben hat, der
   schon ihr Ziel ist — sie muss selbst zurückscrollen, um es
   nachzuvollziehen. *Vorschlag:* Zielname/-code in die Nachricht
   aufnehmen (die Werte `known.name`/`known.iataCode` liegen an dieser
   Stelle bereits vor), z. B. "{Ziel} ({Code}) ist bereits dein Ziel —
   Start und Ziel dürfen nicht gleich sein. Welcher Flughafen ist dein
   Abflugort?"

2. **Auf der 404-Seite bekommen Screenreader-Nutzer:innen keine
   Rückmeldung, dass sich etwas geändert hat.** `focusPageHeading()`
   (`src/lib/utils.ts:14-27`) wird bisher nur beim Schließen von
   Dialog/Sheet und beim mobilen Menü aufgerufen — nicht bei normaler
   Navigation über Sidebar/Links. Landet man z. B. über einen kaputten
   Link auf `NichtGefunden.tsx`, bleibt der Fokus einfach stehen oder
   springt kommentarlos auf `<body>`, ohne dass "Seite nicht gefunden"
   angesagt wird. *Vorschlag:* Einen zentralen `useEffect` auf
   `useLocation()`-Wechsel (z. B. in `routes.tsx`, wo `useLocation`
   bereits importiert ist), der `focusPageHeading()` aufruft — deckt
   die 404-Seite automatisch mit ab und schließt dieselbe Lücke für
   jede andere In-App-Navigation gleich mit.

3. **Lösch-Warnungen weiterhin unnötig einheitlich scharf** (siehe
   oben, jetzt inklusive `EditMode.tsx:147`). Nach wie vor mein
   Vorschlag: die scharfe "nicht rückgängig"-Warnung für
   `Reiseentwuerfe.tsx` reservieren, bei den leicht rückholbaren
   Aktionen (Favorit, Preisalarm, Aktivität merken/entfernen,
   Warenkorb) eine ruhigere Formulierung wie "Du kannst [X] jederzeit
   wieder hinzufügen" verwenden.

_Letztes Update: 2026-10-06_
