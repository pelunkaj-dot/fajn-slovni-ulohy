# FajnSlovní úlohy

Slovní úlohy pro 2. stupeň ZŠ (6.–9. ročník) jako hra. Modul platformy fajndoucko.cz (FajnCvičebna).

- úlohy rozdělené po ročnících podle toho, co se v kterém ročníku učí (rozpis v `docs/UCIVO.md`)
- každé téma ve třech obtížnostech: **Základy**, **Procvičování**, **Jedničkář**
- školní postup: co vím → co hledám → výpočet → odpověď; cílené rady k typickým chybám
- hra: body a hodnosti, hvězdy, krystaly, stavba města, obrana města, strážci témat, denní výzva, odznaky, opakování chyb
- každé téma je jiný svět (tržnice, expedice, nádraží, stavební plán, akvárium…) s vlastním vzhledem, scénou postupu a zvuky
- tři motivy (světlý, tmavý, růžový), přehled pro rodiče

Jádro hry je převzaté z [FajnGeometrie](https://github.com/pelunkaj-dot/fajn-geometrie).

## Spuštění

Čisté HTML, CSS a JavaScript bez sestavování:

```
python3 -m http.server 8765
```

a otevřít `http://localhost:8765/`. Jednosouborový náhled (jde otevřít poklepáním): `python3 tools/nahled.py`.

## GitHub Pages

Settings → Pages → Deploy from a branch → `main`, složka `/ (root)`. Hra pak poběží na
`https://pelunkaj-dot.github.io/fajn-slovni-ulohy/`, ukázka na `…/index-demo.html`.
Plná verze (`index.html`) je chráněná `fdc-guard.js` z repozitáře `fdc-plugin` jako ostatní moduly.

## Testy

```
node --test tests/*.test.mjs       # obsah: každý generátor úloh se spustí 150× a zkontroluje
python3 -m http.server 8765 --bind 127.0.0.1 &
node tests/prohlizec.mjs           # automatický hráč projde v prohlížeči všechny úrovně
node tests/snimky.mjs /tmp/snimky  # chybové cesty, strážce, výzva, obrana, město, motivy + snímky
node tests/ux.mjs                  # ovládání a navigace na úzkém telefonu
```

Testy v prohlížeči potřebují Playwright (cesta k němu jde nastavit proměnnou `PW`).
Ke kontrole textů: `KROKY=1 NAP=1 node tools/vzorky.mjs 6` vypíše po jedné ukázce z každého typu úlohy.

## Struktura

| Soubor | Co v něm je |
|---|---|
| `js/r6.js` … `js/r9.js` | obsah ročníků: výklad, generátory úloh, strážci |
| `js/ulohy.js` | stavba úloh a vyhodnocení odpovědí |
| `js/hra.js` | série úloh, postup při chybě, nápovědy, body |
| `js/obrana.js`, `js/mesto.js`, `js/odznaky.js` | herní režimy |
| `js/app.js` | obrazovky a navigace |
| `js/rodice.js` | záznam výsledků a přehled pro rodiče |
| `js/opakovani.js` | opakování s rozestupy podle chyb |
| `docs/UCIVO.md` | rozpis učiva po ročnících a pravidla obtížností |
