# Marketing-Chef Bericht

**Datum:** 2026-08-28

## Was ist seit dem letzten Eintrag (2026-08-27) passiert?

Codeseitig kam die neue **Dashboard.tsx** (7.7) dazu: vier KPI-Kacheln
(bevorstehende Reisen, Reiseentwürfe-Fortschritt, Warenkorb-Summe,
Favoriten), jede mit Link zur vollen Seite, alle auf denselben
Demo-Daten wie die Einzelseiten statt erfundener Zahlen. Prämienpunkte
werden bewusst *nicht* als Zahl gezeigt, weil die Punkte-Regeln
produktseitig noch offen sind — stattdessen ein ehrlicher Hinweis. Dazu
ein kleiner A11y-Fix an den ChecklistPanel-Links (Stift-Icon +
Screenreader-Text), damit klickbare Links nicht mehr wie Ankreuz-Punkte
aussehen.

Die separate Marketing-Chef-Auto-Persona hat das Dashboard bereits
geprüft und bewusst kein achtes Content-Stück daraus gemacht (an
denselben Tier-2-Blocker gebunden wie der Warenkorb-Text: kein
Buchen-Button). Das übernehme ich, statt es zu wiederholen.

Die **sieben offenen PRs** aus dem letzten Bericht sind unverändert
offen, der älteste weiterhin seit dem 09.08. Die drei Freigabe-Fragen an
dich (Kanal-Start, Warenkorb-Content erst nach Buchen-Button,
wiederkehrendes Format) stehen ebenfalls unverändert seit dem 21.08. Kein
erfundener Fortschritt hier — es hat sich auf dieser Seite schlicht nichts
bewegt.

## Vorschläge

1. **Die bewusst leere Punktzahl ist dein bestes Ehrlichkeits-Beispiel
   bisher.** Eine Kachel, die eine Zahl absichtlich *nicht* zeigt, weil
   die Regeln noch nicht feststehen, ist greifbarer als jede Text-Aussage
   über "keine erfundenen Daten". Sobald ein Kanal steht: Screenshot der
   Kachel plus ein Satz dazu, was normalerweise andere Apps stattdessen
   täten (Platzhalterzahl, "Coming soon"-Blabla).

2. **Das Dashboard selbst ist ein guter Produkt-Tour-Baustein, kein
   eigener Post.** Es bündelt Reisen/Warenkorb/Favoriten erstmals an
   einer Stelle — nützlich als Screenshot für eine künftige Landingpage
   oder als zweites Bild in einem Feature-Post, sobald Tier 1 (Aktivitäten
   bearbeiten / Kartenansicht) tatsächlich raus ist. Für sich allein trägt
   es aber keine Kernaussage.

3. **PR-Stau ist jetzt ein wiederkehrendes Muster, nicht mehr nur ein
   Einzelbefund.** Zwei Berichte in Folge mit denselben sieben offenen
   Fixes, der älteste seit fast drei Wochen. Statt es ein drittes Mal zu
   wiederholen: Falls du priorisieren willst, wären #6 und #5 (12.08, seit
   über zwei Wochen offen) die naheliegendsten Kandidaten für einen
   ersten Merge-Schub, bevor ein Content-Stück auf einen "wir fixen
   schnell"-Ton setzt.

4. **Kein neuer Vorschlag zur Kanal-Frage.** Die stand letzte Woche
   schon konkret da (LinkedIn-Start mit einem einzelnen Stück, ohne feste
   Kadenz). Sie ein drittes Mal umzuformulieren bringt nichts — sie
   wartet einfach auf deine Antwort, ich lass sie liegen statt sie
   aufzublähen.

_Letztes Update: 2026-08-28_
