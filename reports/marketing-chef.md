# Marketing-Chef Bericht

**Datum:** 2026-10-16

## Was ist seit dem letzten Eintrag (2026-10-15) passiert?

Einiges – sowohl im Code als auch in der Marketing-Vorbereitung selbst.

- **Der Duffel-Dedup-Fix (PR #29) ist jetzt gemergt.** Mehrere
  gleichzeitige Fehler bei Flug-/Hotelsuche zeigen nicht mehr dieselbe
  Zeile doppelt an.
- **Drei weitere, frische Fixes in `useChat.ts`:** Der Avatar bleibt
  nach einer abgeschlossenen Suche nicht mehr dauerhaft im
  "Sucht..."-Zustand hängen, eine über den Chat begonnene, aber auf der
  Such-Seite abgeschlossene Bearbeitung verwechselt deine nächste
  Chat-Nachricht nicht mehr mit einer Antwort darauf, und eine durch
  Freitext überholte Hintergrundsuche taucht nicht mehr widersprüchlich
  später auf.
- **Neuer, noch offener Fund von heute:** Der Avatar zeigt nach einer
  fehlgeschlagenen Suche fälschlich den fröhlichen statt des eigens
  dafür gebauten Fehlerzustands (Warndreieck) – Fix liegt als PR #30 vor,
  wartet noch auf Review.
- **Marketing-Chef Auto hat die achte Mini-Changelog-Ausgabe
  geschrieben** (`marketing/mini-changelog-konzept.md`) – reiner
  Entwurf, nichts live. Der Kandidaten-Topf ist damit wieder leer, aber
  die Grundfrage ("Soll die Footer-Changelog-Seite überhaupt gebaut
  werden?") steht seit Ausgabe 1 unbeantwortet im Raum – acht Ausgaben
  guter, ehrlicher Content liegen bereit und gehen nirgendwo raus.

## Vorschläge

1. **Die Changelog-Entscheidung nicht länger offenlassen – notfalls mit
   einer kleinen Alternative statt der ganzen Seite.** Acht Ausgaben
   Wartezeit sind viel. Wenn die Footer-Seite zu groß als nächster
   Schritt wirkt: schlag Ni vor, einfach die stärkste Geschichte aus
   Ausgabe 8 (siehe Punkt 2) als einzelnen Social-Post zu bringen – klein
   anfangen statt weiter zu warten.
2. **"Die Figur lügt nicht" als eigener Mini-Post, sobald PR #30 gemerged
   ist.** Der Avatar zeigte bisher fröhlich an, wo eigentlich ein Fehler
   war – jetzt zeigt er ehrlich das Warndreieck. Genau das Gegenteil von
   "Fake-Positivität", die man aus vielen Apps kennt. Passt direkt in die
   Content-Säule "Ehrlichkeit als Feature" und braucht keine Zahlen,
   nur die Geschichte.
3. **"Ein Klick tut, was er verspricht" als Kurzclip/GIF.** Die vier
   Reiseziel-Karten auf der Startseite waren bisher optisch klickbar,
   aber funktionslos – jetzt springen sie wirklich in den KI-Chat mit
   dem jeweiligen Ziel. Ein 5-Sekunden-Screen-Recording davon (Karte
   klicken → Chat startet direkt mit Kontext) ist greifbarer als jeder
   Text und zeigt nebenbei das Kernprodukt.
4. **"Bearbeite deine Reise"-Promo jetzt auf Flug UND Unterkunft
   ausweiten.** Die Gründe für die bisherige Beschränkung auf
   Unterkunft (veraltete Flugsuchergebnisse, verwechselte
   Chat-Antworten nach Bearbeitung außerhalb des Chats) sind laut
   IT-Chef jetzt alle behoben. Eine gemeinsame Formulierung für beides
   wirkt überzeugender als zwei separate, zeitlich versetzte Promos.

_Letztes Update: 2026-10-16_
