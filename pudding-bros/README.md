# PUDDING BROS. – Website-Konzept

Statische, schnelle Marken-Website (HTML/CSS/Vanilla-JS, kein Build-Schritt, keine Bilddateien – alle Packungen, Silhouetten und Illustrationen sind Inline-SVG).

## Starten

```bash
cd pudding-bros
python3 -m http.server 8000   # dann http://localhost:8000
```

## Seiten

| Datei | Inhalt |
|---|---|
| `index.html` | Hero, Meet the Bros., Why Pudding Bros.?, Zubereitung, Über uns, Join the Bros., FAQ |
| `shop.html` | Produktkarten mit Warenkorb, Bros Box (Coming Soon) |
| `produkt.html?sorte=<id>` | Produktseite (Tabs: Beschreibung, Zubereitung, Zutaten, Allergene, Nährwerte) |

Sorten-IDs: `vanilla-marshmallow`, `chocolate-cookie`, `vanilla-coconut`, `strawberry-marshmallow`.

## Struktur

- `assets/site.js` – Produktdaten (`PRODUCTS`), Logo/Silhouetten, Packungs-Render (`packSVG`), Header/Footer, Warenkorb (localStorage), Tabs, Scroll-Reveal.
- `assets/styles.css` – Design-System (Schwarz/Weiß/Creme + Akzentfarbe je Sorte über `--a`).

Neue Sorte = ein Eintrag in `PRODUCTS` (Farben, Topping-Typ `marshmallow` | `cookie` | `coconut`, Texte, Nährwerte) – Karte, Packung und Produktseite entstehen automatisch.

## Hinweise

- Zutaten, Nährwerte, Bewertungen und Social-Zahlen sind **Beispielangaben** für das Konzept.
- Checkout, Impressum, Datenschutz, AGB und Widerruf sind Platzhalter.
- Animationen respektieren `prefers-reduced-motion`.
