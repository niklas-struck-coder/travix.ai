# Support-Chef Bericht

**Datum:** 2026-09-15

## Was ist seit dem letzten Eintrag (2026-09-14) passiert?

Punkt 1 von gestern ist jetzt vollständig erledigt: Auch Aktivitäten
(`src/pages/Aktivitaeten.tsx`) und Warenkorb (`src/pages/Warenkorb.tsx`)
fragen vor dem endgültigen Entfernen jetzt mit einem Bestätigungsdialog
nach — die komplette Fünf-Seiten-Liste (Preisalarme, Favoriten, Angebote,
Aktivitäten, Warenkorb) hat damit das einheitliche, sichere Muster.

Beim genaueren Hinsehen auf genau dieses neue Verhalten ist mir aber ein
neuer, echter Reibungspunkt aufgefallen (siehe Vorschlag 1) — betrifft
vermutlich alle fünf Seiten gleichermaßen, nicht nur die zwei neuesten.

Die Hilfe-Seite (Punkt 2) und der Warenkorb als Sackgasse (Punkt 3) sind
im Code unverändert gegenüber gestern.

## Meine Vorschläge

1. **Nach dem Bestätigen eines Lösch-Dialogs geht der Fokus verloren.**
   `src/pages/Aktivitaeten.tsx:98` und `src/pages/Warenkorb.tsx:111`
   (ebenso vermutlich `Preisalarme.tsx:110`, `Favoriten.tsx:104`,
   `Angebote.tsx:119`, die dasselbe Muster verwenden): Der
   Entfernen-Button pro Karte ist kein `DialogTrigger`, sondern ein
   normaler `Button`. `confirmRemoval()` entfernt die Karte samt ihrem
   Button im selben Moment, in dem der Dialog schließt — genau der
   DOM-Knoten, auf den der Fokus danach automatisch zurückspringen
   sollte, existiert dann schon nicht mehr. Wer per Tastatur oder
   Screenreader mehrere Einträge hintereinander entfernen will, landet
   nach jedem "Ja, entfernen" unerkennbar auf `<body>` und muss sich
   jedes Mal neu durch die Seite tabben. *Vorschlag:* auf
   `DialogPrimitive.Content` ein `onCloseAutoFocus` setzen, das den
   Fokus gezielt auf ein noch vorhandenes Element legt (z. B. die
   Seitenüberschrift oder die nächste verbliebene Karte) — idealerweise
   zentral in `src/components/ui/dialog.tsx`, da das Muster fünffach
   wiederholt wird.

2. **Die Hilfe-Seite (`/hilfe`) hilft immer noch nicht wirklich.**
   `src/pages/PlaceholderPage.tsx` zeigt weiterhin nur "Hilfe wird als
   Nächstes gebaut" — keine FAQ, kein Kontaktweg, kein Link. Wer mit einem
   Problem auf `/hilfe` klickt, geht leer aus. Laut `ZEITPLAN.md` ist
   echter FAQ-Inhalt für Sprint 2 vorgesehen, also bekannt und eingeplant.
   *Vorschlag:* Bis dahin würde schon ein einziger Satz mit Kontakthinweis
   reichen, damit die Seite nicht komplett ins Leere läuft.

3. **Der Warenkorb bleibt eine Sackgasse.** `src/pages/Warenkorb.tsx`
   endet weiterhin nach der Summen-Karte ohne Buchen-Button oder
   Buchungs-Hinweis. Das hängt weiterhin an der offenen Grundsatzfrage
   "eigener Zahlungsprozess vs. Buchung beim Anbieter" (siehe
   `ZEITPLAN.md`, Sprint 5). *Vorschlag:* Solange die Entscheidung
   aussteht, wenigstens einen kurzen erklärenden Satz einblenden
   ("Buchung folgt in Kürze" o.ä.), statt die Nutzerin kommentarlos vor
   der Summen-Karte stehen zu lassen.

_Letztes Update: 2026-09-15_
