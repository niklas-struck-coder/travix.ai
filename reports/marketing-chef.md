# Marketing-Chef Bericht

**Datum:** 2026-09-24

## Was ist seit dem letzten Eintrag (2026-09-23) passiert?

Genau der Blocker von gestern ist weg: Im "Details ansehen"-Dialog für
abgeschlossene Reiseentwürfe zeigen Transportmittel, Datum, Budget und
Unterkunft jetzt bei fehlenden Werten denselben "nicht angegeben"-Text,
den es schon bei Aktivitäten gab, statt kommentarlos zu verschwinden
(ce62376). Zusätzlich ist die "Abgeschlossen"-Badge jetzt optisch klar
von "Pausiert" unterscheidbar (eigene Teal-Variante, 647d57f) – war
Support-Chefs dritter Fund vom 23.09.

Nur: kaum gebaut, hat Support-Chef bei genau dieser neuen Teal-Badge
schon den nächsten Punkt gefunden – der Textkontrast liegt im hellen
Farbschema bei ca. 2,3:1 statt der WCAG-AA-Vorgabe von 4,5:1 (dasselbe,
bisher ungemeldete Problem steckt wohl schon länger in
TripSummaryCard.tsx, ist jetzt aber auf einer dauerhaft sichtbaren
Status-Beschriftung). Bislang nur analysiert, noch nicht gefixt. Die
Reiseentwürfe-Konsistenz-Story ist inhaltlich jetzt tatsächlich rund –
aber wieder ein frischer, noch offener Punkt bremst die Veröffentlichung.
IT-Chef hat außerdem eine Kalender-Monatsnavigation gegen einen
Race-Condition-Bug abgesichert – reine Robustheit, kein Content-Material.
Keine neuen Nutzungs- oder Erfolgszahlen bekannt.

## Vorschläge

1. **Warten auf den Kontrast-Fix, dann sofort raus – nicht nochmal
   liegen lassen.** Der Vierteiler ist inhaltlich fertig, der einzige
   Rest ist der Teal-Kontrast auf der Badge. Sobald das behoben ist
   (Muster ist wortwörtlich dasselbe Problem wie in TripSummaryCard.tsx,
   also vermutlich schnell erledigt), soll der erste Content-Entwurf
   noch am selben Tag raus – kein weiteres Zuwarten auf den nächsten
   möglichen Fund.

2. **"Wir prüfen auch auf Barrierefreiheit" als eigenes, kleines
   Ehrlichkeits-Signal.** Dass ein frischer Kontrast-Fund sofort nach dem
   Bauen auffällt und offen benannt wird, ist genau die Art
   Qualitätsarbeit, die sonst unsichtbar bleibt. Ein kurzer, sachlicher
   Satz dazu (z. B. im Changelog- oder About-Kontext, sobald der
   existiert) passt zur bestehenden Ehrlichkeits-Linie und ist ein
   glaubwürdiges Detail, kein Marketing-Sprech.

3. **Eine der vier Grundsatzfragen jetzt wirklich entscheiden.** Kanal,
   Warenkorb-Content, Social-Format, Mini-Changelog-Start stehen
   weiterhin unverändert im Raum. Reicht als erster Schritt: nur der
   Kanal für die erste Content-Ausgabe. Ohne diese eine Entscheidung
   bleibt jedes fertige Stück (wie Punkt 1) in der Schublade, egal wie
   rund es ist.

_Letztes Update: 2026-09-24_
