# Support-Chef Bericht

**Datum:** 2026-09-21

## Was ist seit dem letzten Eintrag (2026-09-18) passiert?

Einiges hat sich getan, und die drei damals offenen Punkte sind
inzwischen behoben — ich hab's im aktuellen Code nachgeprüft:

- **Mobiles Menü:** Der Fokus springt nach der Menüwahl jetzt zur `<h1>`
  der neu geladenen Seite statt zum Hamburger-Knopf zurück
  (`src/components/layout/MobileNav.tsx:17-27,50-55`).
- **Duplizierte Reiseentwürfe:** aria-labels sind jetzt unterscheidbar,
  z. B. "Lissabon (Eintrag 2)" (`src/pages/Reiseentwuerfe.tsx:174-185`).
- **"Abschließen":** fragt jetzt per Bestätigungsdialog nach, bevor der
  Status endgültig gesetzt wird (`src/pages/Reiseentwuerfe.tsx:293-309`).

Schön zu sehen, dass die Punkte tatsächlich ankommen. Beim erneuten
Draufschauen sind mir aber zwei neue Reibungspunkte aufgefallen, plus
der alte Hilfe-Seiten-Punkt ist weiterhin offen.

## Meine Vorschläge

1. **Fehlermeldungen bei der Flug-/Hotelsuche werden
   Screenreader-Nutzer:innen nicht automatisch angesagt.**
   `src/components/search/FlightResults.tsx:25-36` und
   `src/components/search/HotelResults.tsx:26-37`: Schlägt die Suche
   fehl, erscheint ein rot umrandeter Fehlerblock — aber ohne
   `role="alert"` (oder `aria-live`). Der Ladehinweis direkt darüber hat
   seit heute `role="status"`, der mindestens genauso wichtige
   Fehlerfall daneben aber nicht. Wer mit Screenreader im KI-Chat nach
   Flügen sucht, merkt eine fehlgeschlagene Suche also nur, wenn sie
   zufällig zurücknavigiert. *Vorschlag:* `role="alert"` auf die beiden
   Fehler-`div`s ergänzen — genau das Gegenstück zum bereits
   vorhandenen `role="status"`. Ein passender Fix liegt dafür bereits
   als PR #22 vor, wartet aber noch auf Merge.

2. **Ein abgeschlossener Reiseentwurf lädt weiterhin genauso aktiv zum
   "Weiterplanen" ein wie ein aktiver.**
   `src/pages/Reiseentwuerfe.tsx:220-222`: Der teal hervorgehobene
   Button "Planung fortsetzen" wird für jede Karte gerendert, egal ob
   `finalized` oder nicht — anders als "Pausieren" und "Abschließen",
   die bei abgeschlossenen Entwürfen korrekt ausgeblendet werden. Wer
   gerade bewusst "Ja, abschließen" bestätigt hat (der neue Dialog sagt
   ausdrücklich "das lässt sich nicht rückgängig machen"), sieht direkt
   danach eine Karte, die optisch fast unverändert weiter zum
   Weitermachen einlädt — nur das Badge wechselt zu "Abgeschlossen", in
   derselben Farbe wie "Pausiert". *Vorschlag:* "Planung fortsetzen" bei
   `status === 'finalized'` ausblenden oder durch einen neutralen
   Button ohne Teal-Hervorhebung ersetzen (z. B. "Details ansehen").

3. **Die Hilfe-Seite (`/hilfe`) hilft weiterhin nicht wirklich.**
   `src/pages/PlaceholderPage.tsx:16` zeigt nach wie vor nur "Hilfe wird
   als Nächstes gebaut" — kein FAQ, kein Kontaktweg. Wer mit einem
   Problem dorthin klickt, geht leer aus. *Vorschlag:* bis der echte
   Inhalt kommt, reicht vorerst ein Satz mit Kontakthinweis.
