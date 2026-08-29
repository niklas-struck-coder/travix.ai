# Marketing-Chef Bericht

**Datum:** 2026-08-29

## Was ist seit dem letzten Eintrag (2026-08-28) passiert?

Zwei Dinge sind aus Marketing-Sicht relevant:

**Navigation nachgerüstet.** Dashboard, Kalender, Karte, Aktivitäten,
Angebote, Favoriten und Preisalarme waren bisher nur per direkter URL
erreichbar, jetzt stehen sie in der echten Navigation. Klingt technisch,
ist aber für uns wichtig: Ein Produkt-Rundgang oder Demo-Video konnte
bisher nicht zeigen, wie man von A nach B kommt, weil man die Seiten gar
nicht hätte "entdecken" können, ohne die URL zu kennen. Das ist jetzt
kein Blocker mehr.

**Zweiter Ehrlichkeits-Fix im Chat.** `mockAdvisor.ts` hat am Ende jedes
Chatflows für Zug/Bus/Fähre/Mietwagen "Ich suche jetzt nach echten
X-Verbindungen" versprochen — obwohl das nur für Flug überhaupt passiert.
Diese vier Modi bekommen jetzt eine ehrliche Abschlussmeldung statt eines
Versprechens ins Leere. Der IT-Chef hat beim Prüfen direkt eine
Anschluss-Lücke gefunden: Auch bei Flug fragt der Haupt-Chatflow nie nach
dem Startflughafen, die "echte Suche" läuft also im Hauptfluss aktuell
gar nicht automatisch los (nur über den separaten Bearbeiten-Pfad) — noch
ungefixt.

Die sieben offenen PRs sind weiterhin unverändert offen (ältester jetzt
seit drei Wochen), keine Bewegung seit dem letzten Bericht — dazu diesmal
kein neuer Vorschlag, das Muster ist bereits benannt.

## Vorschläge

1. **Jetzt einen echten Produkt-Rundgang vorbereiten, nicht nur planen.**
   Mit der Nav-Nachrüstung kannst du zum ersten Mal einen Screen-Recording
   machen, der zeigt, wie man von der Chat-Planung zum Dashboard, zur
   Kalenderansicht und zu Preisalarmen navigiert — ohne Schnitt-Tricks
   oder URL-Adressleiste im Bild. Das ist die Grundlage für ein
   glaubwürdiges "So funktioniert Travix"-Video, sobald ein Kanal steht.

2. **"Ehrlichkeits-Log" als festes Format vorschlagen.** Das ist jetzt
   der dritte konkrete Fall (Punktzahl-Leerstelle, Zug/Bus/Fähre-Fix,
   und jetzt der Flug-Nachfolge-Fund) von "wir zeigen lieber ehrlich eine
   Lücke als ein leeres Versprechen". Statt jeden Fall einzeln als Idee
   zu bringen: das als wiederkehrendes Mini-Format vorschlagen (ein Satz
   Vorher/Nachher pro Post) — das beantwortet nebenbei auch deine offene
   Frage nach einem wiederkehrenden Format mit einem echten Beispiel
   statt einer weiteren Theorie-Runde.

3. **Vorsicht bei der Flug-Suche-Behauptung.** Falls irgendwo schon Text
   in Vorbereitung ist, der sinngemäß "im Chat direkt echte Flüge suchen"
   sagt: Laut IT-Chef-Fund passiert das im Haupt-Chatflow aktuell nicht
   automatisch (fehlender Startflughafen-Schritt). Bis das gefixt ist,
   lieber nicht als Chat-Feature bewerben, sondern höchstens als
   "im Bearbeiten-Modus verfügbar" — sonst bauen wir uns selbst den
   nächsten Ehrlichkeits-Fall.

_Letztes Update: 2026-08-29_
