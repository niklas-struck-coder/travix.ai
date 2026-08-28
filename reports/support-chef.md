# Support-Chef Bericht

**Datum:** 2026-08-28

## Was ist seit dem letzten Eintrag (2026-08-27) passiert?

Der Reibungspunkt aus dem letzten Bericht ist behoben: Die automatisch
erkannten Zeilen in der Reise-Checkliste zeigen jetzt ein `Pencil`-Icon
und einen `sr-only`-Zusatz "bearbeiten" im Linktext
(`src/components/trip/ChecklistPanel.tsx:84` und `:86`) — klickbare und
nur-abhakbare Punkte sind damit klar unterscheidbar, auch für
Screenreader-Nutzer:innen. Neu dazugekommen ist die Dashboard-Seite
(`src/pages/Dashboard.tsx`, Aufgabe 7.7): eine Kennzahl-Übersicht über
Reisen, Warenkorb und Favoriten. Beim Durchsehen sind mir dort zwei
kleinere Stolpersteine aufgefallen.

## Meine Vorschläge

1. **Vier Links heißen alle exakt "Alle ansehen" — für
   Screenreader-Nutzer:innen kaum auseinanderzuhalten.**
   `src/pages/Dashboard.tsx:69-71` (in `StatTile`, dreifach verwendet)
   und `:104-106` (Reiseentwürfe-Kachel) geben jedem der vier Links denselben
   Linktext ohne Kontext. Wer per Tastatur oder Screenreader über eine
   Linkliste springt, hört viermal hintereinander nur "Alle ansehen" und
   muss raten, welcher Link zu Reisen, Warenkorb, Favoriten oder
   Entwürfen führt. Vorschlag: pro Kachel einen `aria-label` ergänzen,
   z.B. `aria-label="Alle bevorstehenden Reisen ansehen"`.

2. **Die "Reiseentwürfe"-Kachel zeigt einen Durchschnittswert, ohne das
   zu sagen — das kann verwirren, wenn Entwürfe unterschiedlich weit
   sind.** `src/pages/Dashboard.tsx:78-80` mittelt den Fortschritt über
   alle Entwürfe (aktuell Lissabon 60 % und Kyoto 20 % → angezeigt
   werden schlicht "40 %"). Jemand, der seinen Lissabon-Trip schon fast
   fertig geplant hat, sieht auf dem Dashboard nur die niedrigere
   Mischzahl und könnte denken, die App hätte seinen Fortschritt nicht
   richtig erfasst. Vorschlag: kurzer Zusatztext wie "Ø über 2 Entwürfe"
   unter dem Prozentwert, oder den am weitesten fortgeschrittenen Entwurf
   separat nennen.

_Letztes Update: 2026-08-28_
