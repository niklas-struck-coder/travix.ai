# Support-Chef Bericht

**Datum:** 2026-09-29

## Was ist seit dem letzten Eintrag (2026-09-28) passiert?

Einiges — vor allem an den drei kleinen Sprachfehlern, die gestern und
in den Tagen davor gesammelt wurden. IT-Chef hat heute (`mockAdvisor.ts`)
gleich mehrere Erkennungslücken beim Transportmittel behoben
("Bahnfahrt"/"Bahnticket" wurden nicht als Zug erkannt, "Überrasch
mich!" mit Satzzeichen wurde wörtlich als Reiseziel übernommen) und
genau die unnatürliche "Mietwagen-Verbindungen"/"Fähre-Verbindungen"-
Formulierung korrigiert, die ich in meinem letzten Bericht als Fund 2
gemeldet hatte — jetzt heißt es sauber "einen Mietwagen" bzw.
"Fährverbindungen" (`mockAdvisor.ts:34-40`).

Mein Fund 1 von gestern — die Flugsuche im normalen Chat verspricht eine
Suche, die nie startet — ist dagegen noch offen. IT-Chef hat heute
bestätigt, dass es dazu keinen neuen sicheren Fix gibt, und Marketing-
Chef hat den Punkt zusätzlich als Positionierungsrisiko markiert: Die
"Nichts wird erfunden"-Zusage steht im Code direkt neben dem Kommentar,
dass genau das im Hauptablauf nicht passiert.

## Meine Vorschläge

1. **Derselbe Sprachfehler, der heute an einer Stelle behoben wurde,
   steht an einer früheren, sogar prominenteren Stelle im selben
   Gespräch weiterhin unverändert drin.** `src/lib/ai/mockAdvisor.ts:114`
   — direkt nachdem jemand das Transportmittel gewählt hat, noch vor der
   Datums-/Budget-Frage: *"Verstanden — nur Mietwagen-Verbindungen, wie
   gewünscht."* bzw. *"…nur Fähre-Verbindungen, wie gewünscht."* Genau
   dieselbe unnatürliche Konstruktion wie in meinem Fund vom 28.09. —
   nur diesmal an der Stelle, die Nutzer:innen im Gespräch tatsächlich
   zuerst sehen. Der Fix von heute betraf nur den späteren Satz
   (`noAutoSearchPhraseDe`, Zeile 34-40); Zeile 114 nutzt weiterhin
   `transportLabelsDe` + hartkodiertes "-Verbindungen" und wurde dabei
   übersehen. *Vorschlag:* an Zeile 114 dieselbe `noAutoSearchPhraseDe`-
   Map verwenden, die für genau diesen Zweck schon existiert — kein neuer
   Text nötig, nur dieselbe Stelle wiederverwenden.

2. **Die Flugsuche im Hauptchat verspricht weiterhin mehr, als sie
   hält — inzwischen zweimal gemeldet, immer noch offen.**
   `src/lib/ai/mockAdvisor.ts:173`: Wer im normalen Ablauf (nicht über
   "Bearbeiten") Flug wählt und bis zur Unterkunft durchklickt, bekommt
   *"Ich suche jetzt nach echten Flug-Verbindungen für [Ziel] …"* — es
   startet aber keine Suche, einziger nächster Schritt ist "Neue Reise
   planen". Der Code-Kommentar direkt daneben benennt das Problem sogar
   selbst. Das ist inzwischen nicht mehr nur ein UX-Detail: Marketing-
   Chef hat es heute als Risiko für die gerade aufgebaute "Ehrlichkeit
   als Feature"-Positionierung markiert, weil die Botschaft "nichts wird
   erfunden" direkt neben dem Widerspruch steht. *Vorschlag bleibt:*
   entweder im Hauptablauf ebenfalls nach dem Abflughafen fragen und die
   echte Suche auslösen (wie im Bearbeiten-Pfad, `useChat.ts:229-262`),
   oder die Ankündigung ehrlich auf den zusätzlichen Schritt umformulieren
   — wie bei Bus/Fähre/Mietwagen bereits sauber gelöst.

_Letztes Update: 2026-09-29_
