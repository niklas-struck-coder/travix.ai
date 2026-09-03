# Marketing-Chef Bericht

**Datum:** 2026-09-03

## Was ist seit dem letzten Eintrag (2026-09-02) passiert?

Der Ehrlichkeits-Kurs läuft weiter, diesmal komplett auf main gemergt:

- Der Urlaubsmodus-Concierge erkennt jetzt echte, aber nicht kuratierte
  Reiseziele korrekt (vorher: pauschales "kein Ziel geplant"), und der
  Avatar wirkt bei ehrlichen Ausweich-Antworten nicht mehr fälschlich
  fröhlich.
- Rückflug vor Hinflug ist im Flug-Assistenten jetzt technisch
  unmöglich statt nur optisch falsch.
- Derselbe Wortgrenzen-Bug wie bei der Zielname-Erkennung steckte auch
  in der Verkehrsmittel-Erkennung ("Business Class" wurde als Bus
  gelesen) — behoben.
- Rohe, englische Fehlertexte bei Netzwerk-/Verbindungsproblemen zeigen
  jetzt ebenfalls die ehrliche deutsche Fallback-Meldung.

Neu und **noch nicht gemergt**: PR #14/#15 (zwei weitere Wortgrenzen-/
Ehrlichkeits-Fixes im Concierge) sowie PR #16 — dort kam ans Licht, dass
die Sprachausgabe-Funktion (Vorlesen) keinen "Stopp"-Befehl hatte,
`stopSpeaking()` wurde im Code nie aufgerufen. Der IT-Chef-Bericht von
heute nennt außerdem zwei noch offene, nicht automatisch gefixte
Reibungspunkte: ein hängender Mikrofon-Knopf und ein IATA-Eingabefeld
ohne Buchstabenprüfung.

Kein neues Content-Stück heute — die drei offenen Freigabe-Fragen an Ni
(Kanäle anlegen, Warenkorb-Content zurückhalten, Tier-4-Format ja/nein)
sind weiterhin unbeantwortet, siehe `marketing/freigabe-uebersicht.md`.

## Vorschläge

1. **Sprachfunktion jetzt noch nicht bewerben.** Bevor PR #16
   (Stopp-Knopf für Vorlesen) gemergt ist und der hängende Mikrofon-Knopf
   behoben ist, wäre ein Post über "sprich einfach mit Travix" riskant —
   genau das Gegenteil vom Ehrlichkeits-Versprechen, wenn Nutzer:innen
   die Funktion antesten und sie hakt. Erst nach beiden Fixes als
   Content-Kandidat aufnehmen.

2. **Konkretes Beispiel für den ersten Ehrlichkeits-Log-Post: der
   Concierge-Fix.** "Du hast Bali als Ziel geplant, aber unser
   Reise-Concierge hat trotzdem 'kein Ziel geplant' gesagt? Jetzt nicht
   mehr." Greifbarer, nutzernaher Aufhänger als ein reiner Bugfix-Satz —
   zeigt das Markenversprechen "wir verstehen dein Ziel, statt zu raten"
   an einem echten Fall. Bleibt aber an die offene Tier-4-Frage gebunden.

3. **Positionierung erneut bestätigt: "Der Concierge, der nachfragt statt
   rät."** Der Vorschlag aus dem 02.09.-Bericht bekommt mit dem
   Concierge-Fix jetzt einen zweiten, unabhängigen Beleg (Wortgrenzen-Bug
   bei Zielnamen UND bei Verkehrsmitteln, beide auf dieselbe Ursache
   zurückgeführt und behoben). Für die nächste Positionierungs-Runde ein
   stärkeres Argument als noch letzte Woche.

4. **Kein Wunschdenken bei Kennzahlen.** Weiterhin keine mir bekannten
   Nutzungs- oder Erfolgszahlen zu diesen Fixes — Content bei "was wurde
   ehrlicher/verlässlicher" halten, nicht bei Reichweiten- oder
   Nutzerzahlen, die ich nicht kenne.

_Letztes Update: 2026-09-03_
