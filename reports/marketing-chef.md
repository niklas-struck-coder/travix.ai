# Marketing-Chef Bericht

**Datum:** 2026-08-20

## Was ist seit dem letzten Eintrag (2026-08-19) passiert?

Der IT-Chef hat heute gezielt alle neuen Seiten durchgeprüft (Kalender,
Warenkorb, Aktivitäten, EditMode, erweiterte Reiseentwürfe) — keine neuen
Bugs, aber auch: der Flugsuche-Bug aus dem letzten Bericht ist unverändert
offen, weiterhin ohne Fix. Das bleibt also weiter ein Werbe-Stopp-Thema,
jetzt den dritten Tag in Folge.

Wichtiger für diesen Bericht: Der eigene autonome Lauf hat seit gestern
**zwei weitere** Content-Stücke geschrieben (zu Warenkorb-Summen und zu
Aktivitäten-Bearbeitung) — genau die Richtung, vor der ich gestern gewarnt
habe. Der Entwurfs-Stapel in `marketing/` ist damit auf sieben bis acht
fertige Stücke gewachsen, und nach allem, was im Repo sichtbar ist, ist
weiterhin keines davon veröffentlicht. Ich habe außerdem `Warenkorb.tsx`
selbst geprüft: einen "Jetzt buchen"-Button oder Checkout-Weg gibt es dort
nach wie vor nicht.

## Vorschläge

1. **Kein neues Content-Stück mehr, bis geklärt ist, was live geht.** Das
   ist jetzt der vierte Bericht in Folge mit diesem Befund, und der
   Stapel ist trotz meiner eigenen Warnung gestern weiter gewachsen statt
   geschrumpft. Ich stelle den eigenen autonomen Lauf auf "kein neues
   Stück" um, bis mit dir geklärt ist, welche der acht Texte diese Woche
   tatsächlich rausgehen — sonst schreibe ich mir selbst am eigentlichen
   Ziel vorbei.

2. **Wenn ein erstes Stück raus soll: Aktivitäten-Bearbeitung statt
   Warenkorb.** Die Aktivitäten-Bearbeitung (`EditMode.tsx`) wurde vom
   IT-Chef heute als sauber und fehlerfrei bestätigt und ist ein
   abgeschlossener Funktionsweg — im Gegensatz zum Warenkorb, der
   weiterhin ohne Buchen-Möglichkeit endet. Ehrliche Content-Regel: erst
   posten, was einen echten Anfang-bis-Ende-Weg hat.

3. **Flugsuche-Bug: Werbe-Stopp bleibt bestehen.** Unverändert seit dem
   letzten Bericht — solange die KI im Haupt-Chat eine echte Flugsuche
   ankündigt, die nie startet, keine Aussagen, die suggerieren, die
   KI-Flugsuche funktioniere im Chat bereits durchgängig.

4. **Warenkorb-Content weiterhin zurückhalten.** Bestätigt durch eigenen
   Code-Check heute: `Warenkorb.tsx` zeigt nur die Endsumme, kein
   "Jetzt buchen". Das bereits fertige Warenkorb-Stück bleibt liegen, bis
   dieser Weg existiert — sonst bewirbt der Post eine Sackgasse.
