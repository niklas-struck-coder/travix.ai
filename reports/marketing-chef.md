# Marketing-Chef Bericht

**Datum:** 2026-10-01

## Was ist seit dem letzten Eintrag (2026-09-30) passiert?

Auf der Fix-Seite war heute einiges los: Drei kleine Ehrlichkeits-/UX-Bugs
sind über die Auto-Spuren gefunden, automatisch gefixt und von Freigabe-Chef
schon in `main` gemergt — der Lösch-/Abschließen-Dialog bei doppelten
Reiseentwürfen zeigte bisher einen mehrdeutigen rohen Zielnamen statt des
disambiguierten Texts (jetzt gefixt), und `ChatInput` stoppte eine laufende
Spracherkennung nicht beim Verlassen der Seite. Ein dritter Fund
(`useConcierge`-Timeout-Cleanup) wartet noch als PR #26 auf Review.

Der gestern gemeldete `formatDuration`-Fix (PR #25, fake "1min" bei reinen
Sekundenwerten) ist weiterhin **nicht live** — ich habe das heute direkt im
Code (`FlightCard.tsx`) gegengecheckt, der alte Rundungs-Bug steht dort
unverändert drin. Das korrigiert meinen eigenen Eintrag von gestern, wo ich
den Fix schon als fertiges Material eingestuft hatte.

Der wichtigste offene Punkt bleibt unverändert: Die Flugsuche im normalen
Chat-Ablauf verspricht wörtlich "Ich suche jetzt nach echten
Flug-Verbindungen … Nichts wird erfunden", löst aber laut
`src/lib/ai/mockAdvisor.ts` weiterhin keine echte Suche aus. Jetzt seit
mehreren Tagen ohne sicheren Automatik-Fix offen.

Die Kanal-/Zielgruppen-Entscheidung (Sprint 1) steht jetzt über zehn Wochen
still. Keine neuen Nutzungs- oder Erfolgszahlen bekannt.

## Vorschläge

1. **Noch nichts an die Öffentlichkeit zu `formatDuration` oder den
   Mini-Fixes von heute** — Dialog-Disambiguierung und Voice-Cleanup sind
   zwar nette, ehrliche kleine Beispiele fürs "sagt, was es tut"-Format,
   aber `formatDuration` hängt seit zwei Tagen unmerged fest. Bevor wir
   dazu kommunizieren, sollte das erst wirklich in `main` landen — sonst
   erzählen wir eine Geschichte, die noch nicht stimmt.

2. **Bei der Flugsuche jetzt aktiv warnen statt nur beobachten:** Der Fund
   ist über mehrere Tage ungefixt geblieben. Solange das offen ist, bitte
   in keinem Kanal (Landingpage, Social, Ads) mit "wir finden dir echte
   Flüge" werben — das Risiko eines Widerspruchs zwischen Werbeversprechen
   und tatsächlichem Verhalten ist inzwischen real, nicht mehr theoretisch.

3. **Kanal-Entscheidung lösen statt weiter aussitzen:** Zehn Wochen Stillstand
   sind lang genug, dass das Warten selbst zum Problem wird. Statt auf die
   "große" Sprint-1-Entscheidung zu warten, würde ich einen minimalen,
   jederzeit rückbaubaren Zwischenschritt vorschlagen: ein einzelner,
   risikoarmer Kanal (z. B. nur ein Build-Log/Changelog-Feed auf der Seite
   selbst, kein Social-Media-Commitment) — damit wenigstens das wachsende
   Fix-Material von IT-/Support-Chef nicht länger ungenutzt liegen bleibt,
   ohne der eigentlichen Zielgruppen-Entscheidung vorzugreifen.

4. **Das wiederkehrende Muster ist selbst eine Geschichte:** Support-Chef
   findet Ehrlichkeits-Bugs, IT-Chef fixt sie oft am selben Tag — heute
   gleich drei Stück. Sobald ein echter Kanal steht (siehe Punkt 3), ist
   "wir reagieren live auf unsere eigenen Fehler" ein glaubwürdigerer
   Markenkern als jede einzelne Fix-Meldung für sich.

_Letztes Update: 2026-10-01_
