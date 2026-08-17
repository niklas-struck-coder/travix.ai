# Marketing-Chef Bericht

**Datum:** 2026-08-17

## Was ist seit dem letzten Eintrag (2026-08-16) passiert?

Diesmal hat sich einiges bewegt — anders als in den letzten Läufen. Auf
`main` ist neuer Code gelandet: `EditMode.tsx` (Aktivitäten einer
Buchung manuell hinzufügen/entfernen/im Preis anpassen, **echt
gespeichert** über `updateStoredTrip()`), eine neue Seite "Aktivitäten"
mit aggregierter Ansicht über alle Reisen, Entwurfs-Aktionen
(pausieren/duplizieren/abschließen/löschen) auf `Reiseentwuerfe.tsx`
sowie eine kleine Checkbox-Korrektur.

Mein eigener autonomer Tageslauf heute hat das bereits aufgegriffen: ein
fertiges Content-Stück ("Deine Reise ist keine Einbahnstraße", LinkedIn +
Instagram + Canva-Brief) zu `EditMode.tsx` liegt in
`marketing/content-stueck-aktivitaeten-bearbeiten.md` und wartet auf
deine Freigabe — bewusst nur zu diesem einen Baustein, weil er als
einziger der neuen Features wirklich echt gespeichert wird.

Wichtig für die Einordnung: Die neue Aktivitäten-Seite und die
Entwurfs-Aktionen (pausieren/duplizieren/…) laufen aktuell noch auf
Demo-State (`useState` mit Platzhalter-Daten, kein echtes Backend) —
genau wie Favoriten/Preisalarme/Angebote vorher schon. Für Content heißt
das: noch nicht als "live" bewerben, sonst bricht das Ehrlichkeits-
Versprechen an der ersten Neuladen-Aktion.

Unverändert offen: die vier PRs (#1, #4, #5, #6) warten weiter auf
Review, und in `marketing/` stapeln sich jetzt vier fertige, ungeprüfte
Entwürfe (Woche-1-Post A/B, Blog-Stück, Kartenansicht, jetzt plus
Aktivitäten bearbeiten).

## Vorschläge

1. **Freigabe-Stau ist jetzt das dringendste Thema.** Vier fertige
   Text-Stücke liegen in `marketing/` bereit, keins ist bislang
   freigegeben oder verworfen. Bevor mehr entsteht, lohnt sich ein
   kurzer Sichtungs-Durchgang — sonst schreiben wir munter weiter an
   einem Stapel, den niemand nutzt.
2. **"Echt gespeichert" als eigene Botschaft schärfen.** Der EditMode-
   Fund zeigt einen Unterschied, der sich als Content-Linie eignet:
   travix unterscheidet inzwischen sichtbar zwischen "das speichern wir
   wirklich" (Aktivitäten in der Buchung) und "das ist noch Demo"
   (Favoriten, Preisalarme, Entwurfs-Aktionen). Ein kurzes,
   selbstironisches Stück genau über diese Unterscheidung würde die
   "Ehrlichkeit als Feature"-Linie greifbarer machen als jedes
   einzelne Feature-Update für sich.
3. **Entwurfs-Aktionen (pausieren/duplizieren/…) als Idee vormerken,
   noch nicht schreiben.** Inhaltlich passt das gut zu "Reise-Planung
   darf unterbrechbar sein" — aber solange es Demo-State ist, wäre ein
   Post darüber ein Versprechen, das beim Neuladen bricht. Sobald echte
   Speicherung nachgezogen wird, ist das Material fertig im Kopf.
