# Support-Chef Bericht

**Datum:** 2026-09-18

## Was ist seit dem letzten Eintrag (2026-09-17) passiert?

Am Code selbst hat sich seit gestern nichts Neues getan — IT-Chef hat
heute gezielt nach Bugs gesucht und keinen gefunden. Die beiden Punkte
aus meinem letzten Bericht (`Reiseentwuerfe.tsx`: doppelte aria-labels
nach dem Duplizieren, "Abschließen" ohne Rückfrage) sind weiterhin
unverändert offen, ebenso die Hilfe-Seite (`/hilfe`) mit ihrem
Platzhaltertext.

Neu ist ein Fund aus der parallelen Auto-Analyse von heute: Der neue
Fokus-Fallback in `src/components/ui/sheet.tsx` (analog zum
Dialog-Fokus-Fix vom 15.09.) wurde am mobilen Hauptmenü geprüft — dabei
zeigt sich ein Reibungspunkt beim Navigieren über das Menü, siehe unten.

## Meine Vorschläge

1. **Nach der Menüwahl im mobilen Hauptmenü landet der Fokus wieder auf
   dem Hamburger-Knopf statt auf der neuen Seite.**
   `src/components/layout/MobileNav.tsx:20-28,45`: Jeder Menüpunkt
   schließt beim Klick zusätzlich zur Navigation das Menü
   (`onClick={() => setOpen(false)}`). Weil der Hamburger-Knopf als
   `SheetTrigger` bei jedem Seitenwechsel im DOM bleibt, greift der neue
   Fokus-Fallback aus `sheet.tsx:86-89` und schickt den Fokus beim
   Schließen zurück zum Knopf — die neu geladene Seite (und ihre `<h1>`)
   wird nie erreicht. Wer per Tastatur oder Screenreader z. B. von
   "Aktivitäten" zu "Warenkorb" wechselt, muss sich nach jedem
   Menüpunkt erneut durch Kopfzeile und Menü zur eigentlichen Seite
   vorarbeiten. *Vorschlag:* Beim Klick auf einen `NavLink` nach dem
   Schließen gezielt zur `<h1>` der neuen Seite springen, statt sich auf
   den generischen Trigger-Fallback zu verlassen — reine
   Schließen-ohne-Navigation-Fälle (Escape, Overlay-Klick, X-Knopf)
   sollen weiterhin zum Hamburger-Knopf zurückkehren.

2. **Duplizierte Reiseentwürfe sind für Screenreader-Nutzer:innen nicht
   mehr unterscheidbar.** `src/pages/Reiseentwuerfe.tsx:209,221,232,242`:
   Alle Aktions-Buttons einer Karte bekommen ihr `aria-label` nur aus
   `draft.destination`. Nach "Duplizieren" (`duplicateDraft()`, Zeile
   100-108) tragen Original und Kopie exakt dasselbe Label, z. B.
   zweimal "Lissabon löschen". *Vorschlag:* Labels um ein
   unterscheidendes Merkmal ergänzen, z. B. Reisedatum oder Kartenindex.

3. **"Abschließen" ist ohne Rückfrage endgültig — anders als "Löschen"
   auf derselben Karte.** `src/pages/Reiseentwuerfe.tsx:216-227` bzw.
   `finalizeDraft()` Zeile 94-98: Ein Klick setzt den Status sofort und
   dauerhaft auf "finalized", ein Zurück gibt es nicht. Der Button steht
   direkt neben "Pausieren" und unterscheidet sich nur durchs Icon — ein
   Fehlklick ist leicht möglich. *Vorschlag:* denselben
   Bestätigungsdialog wie beim Löschen auch vor "Abschließen" schalten,
   oder zumindest kurz einen "Rückgängig"-Hinweis nach dem Klick zeigen.

4. **Die Hilfe-Seite (`/hilfe`) hilft weiterhin nicht wirklich.**
   `src/pages/PlaceholderPage.tsx:16` zeigt nach wie vor nur "Hilfe wird
   als Nächstes gebaut" — kein FAQ, kein Kontaktweg. Wer mit einem
   Problem dorthin klickt, geht leer aus. *Vorschlag:* bis der echte
   Inhalt kommt, reicht vorerst ein Satz mit Kontakthinweis.
