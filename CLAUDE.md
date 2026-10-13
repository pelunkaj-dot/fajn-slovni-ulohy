# FajnSlovní úlohy – zadání projektu

Komunikuj se mnou česky. Šetři tokeny: neopakuj celé soubory, měň jen to, co je potřeba. Po každé změně spusť testy a chyby oprav sám.

## O mně a platformě
Jan, učitel a doučovatel, vývojář platformy fajndoucko.cz (sekce FajnCvičebna).
- Moduly jsou statické stránky na GitHub Pages. Tři motivy vždy: světlý (výchozí), tmavý, „dívčí“ (růžový). Nikdy se neřídí systémovým tmavým režimem.
- Postup při chybě: 1. chyba → znovu (nápověda na tlačítku), 2. chyba → nápověda se ukáže sama, 3. chyba → řešení.
- Skládání souborů z částí Pythonem, nikdy `sed`.
- **Bez postaviček** (Matýsek a Terezka sem nepatří, modul není pro malé děti). Hlášky v `js/hlasky.js` a ve světech jsou krátké, věcné, bez tvarů závislých na rodu hráče.
- Český jazykový obsah kontroluju sám.
- Jádro (hra, body, opakování, rodiče, motivy, město) je převzaté z FajnGeometrie (`pelunkaj-dot/fajn-geometrie`). Opravu v jádru udělej v obou repozitářích, dokud jádro nebude sdílené.

## Cíl
Slovní úlohy pro 2. stupeň ZŠ **po ročnících (6–9) podle toho, co se v kterém ročníku učí** (rozpis v `docs/UCIVO.md`). Rozpis je orientační, každá škola postupuje trochu jinak, proto nic není zamčené. Každé téma má tři obtížnosti:
1. **Základy** – jako kdyby žák o tématu nikdy neslyšel. Výklad před první sérií, jeden krok, malá a „hezká“ čísla. Tři stupně nápovědy podle školního postupu: **Co vím a co hledám → Jak na to → Výpočet**. Cílená zpráva k typické chybě (sečtení místo násobení, výsledek jen za jeden kus, odečtení obráceně…). Úlohy typu „Kterým výpočtem to zjistíš?“ učí volbu početní operace bez počítání.
2. **Procvičování** – dva kroky, obrácené úlohy, jeden převod jednotek.
3. **Jedničkář** – delší zadání se **zbytečným údajem**, více kroků, žák volí jednotku (`units: true`), odpověď musí být přesná, nápověda stojí body. Bez obrázku.

Nejsou to ukázky: hotový rozsáhlý modul, hra má děti bavit. Starý `fdc-plugin/slovni.html` po dokončení tohoto modulu zanikne (rozhodl Jan) a odkaz na webu povede sem.

**Pro koho:** modul vyhledávají hlavně slabší a průměrní žáci. Odborný pojem proto na úrovních Základy a Procvičování vysvětli v závorce, např. „koncentrace (kolik procent roztoku tvoří sůl)“. Jedničkář pojmy zná. Vysvětlení nesmí prozradit výsledek.

## Světy témat (vzhled a zvuk)
Každé téma má vlastní **svět** (`svet` v tématu, definice v `js/svety.js`, vzhled v `css/svety.css`), aby dítě podle vzhledu i zvuku poznalo, že se změnilo téma. Žádná jednotná šablona:
- jiná karta úlohy (účtenka se zubatým okrajem, odjezdová tabule, modrotisk výkresu, akvárium s bublinkami, deník s metrem), jiná tlačítka, políčko odpovědi, nápověda i pozadí;
- jiná scéna postupu v liště (vozík v obchodě, vlak po trati, kreslený plán, stoupající hladina, cesta na mapě);
- úvodní titulek světa se znělkou na začátku série, karta tématu na výpravě i okno výkladu v barvách světa;
- vlastní hlášky (`ok`, `chyba1`, `chyba2`, `odhaleni`) a vlastní nástroj (`js/zvuky.js`: kov, marimba, gong, drnkání, bublinky); melodie se náhodně střídají a s řadou stoupají.
Nové téma dostane nový svět (nebo výjimečně sdílí svět s příbuzným tématem ve stejném ročníku). Světy fungují ve všech třech motivech.
Hotové světy: `trh` (601), `expedice` (602), `nadrazi` (603), `plan` (604), `akvarium` (605). Ke kontrole vzhledu: `node tools/svety-snimky.mjs <složka> [téma…]`.

## Pravidla pro slovní úlohy (poučení ze starého modulu)
- **Zadání musí odpovídat výpočtu.** Každé číslo v zadání má jasný význam a co se počítá, musí jít ze zadání vyčíst. Žádná nemožná zadání (trojúhelník, který neexistuje; 1 500 žáků ve třídě; 0% alkohol).
- **Realistická čísla:** ceny jako v obchodě (13,90 Kč), věky, rychlosti a množství, jaké dítě zná. Výsledek „hezký“ (na Základech celé číslo nebo částka v Kč), nikdy tiše zaokrouhlený. Když se zaokrouhluje, zadání to říká (`dec`).
- **Proměnná je vždy pojmenovaná** („Označ x = věk Pavla“) od 8. ročníku, kdy se úlohy řeší rovnicí. Nabídka rovnic nesmí obsahovat rovnici, která je se správnou rovnocenná (test to musí hlídat dosazením).
- **Postup = školní zápis:** `steps` začínají „Vím: … / Hledám: …“ (kde to dává smysl), pak výpočet, nakonec **odpověď celou větou** nebo zkouška.
- **Pasti (`traps`)** u každé typické chyby operace, s vysvětlením, proč je špatně. Past, která se náhodou rovná výsledku, `N()` sama vyřadí.
- **Čeština v generátorech:** tvary podstatných jmen se nesestavují lepením koncovek. Každé slovo má v datech vypsané pády a tvary podle počtu (1 / 2–4 / 5 a víc), viz `ZBOZI` v `js/r6.js`. U postav v úloze se rodové tvary (Jana by zvládla × Pavel by zvládl) berou z dat, nikdy se nehádají. Žákovi se tyká a bez rodu („zaplatíš“, ne „zaplatil jsi“).

## Architektura
Vanilla JS, ES moduly, bez build kroku. Přehled souborů je v README.md.
- **Úloha** je obyčejný objekt z generátoru (`N` číslo, `C` výběr, `DM` stupně a minuty – viz `js/ulohy.js`). Pole: `text`, `q`, `fig`, `ans`, `unit`, `dec`, `alt`, `traps` (typické chyby se zprávou), `hints`, `steps`, `units` (na úrovni 3 volí jednotku žák; nabídky jednotek jsou v `unitChoices` v `js/util.js`).
- **Téma** (`js/rN.js`): `{ id, nazev, ikona, popis, strazce, vyklad: [{h, t, fig}], u: [[úroveň 1], [2], [3]], rychle: [...] }`. `rychle` jsou úlohy pro Obranu města (krátké, bez obrázku). Id tématu = ročník + pořadí (`601`, `702`…).
- Ročník bez hotového tématu se neukazuje (`js/obsah.js`).
- **Čísla**: vždy přes `cz()` (desetinná čárka); částky v Kč s haléři vždy na dvě místa (`kc()` v `js/r6.js`). Indexy v textu `<sub>`.
- **Obrázky** (až budou, např. úsečkový model nebo schéma pohybu) jsou v měřítku a barvy berou z CSS proměnných (`fg-*`), takže fungují ve všech motivech.
- **Body a hodnocení** (jako na celé platformě, `podilBodu` v `js/hra.js`): napoprvé 100 %, napodruhé 60 %, po nápovědě 35 % (i když se ukázala sama), s ukázaným řešením 0. Řada (combo) jen za odpovědi napoprvé bez nápovědy. Hvězdy ★ ≥ 60 %, ★★ ≥ 80 %, ★★★ ≥ 95 % bez ukázaného řešení.
- **Chyby se v kole vracejí**: na konci série (ne u strážce) přijdou nové úlohy stejného typu jako nejvýš 2 úlohy s chybou; do hodnocení série se nepočítají.
- **Opakování**: jednotkou je typ úlohy `'téma|úroveň|pořadí generátoru'` (`stav.opak`). Pořadí generátorů v `u` měnit opatrně – změna přeřadí naplánovaná opakování.
- **Hra**: body → hodnosti, hvězdy/strážci/výzva/obrana → krystaly → stavby ve městě. Strážce tématu se odemkne po 3 hvězdách v tématu (8 úloh, 3 životy, bez nápověd).
- **Ovládání**: odevšad musí vést cesta pryč. Každé okno (`modal` v `js/ui.js`) má křížek a zavře ho i Esc, ťuknutí vedle a Zpět v prohlížeči; výjimka je jen uvítání. Zpět nikdy neopustí rozehranou hru. Nevratná akce se ptá. Kontrola prázdné odpovědi nestojí pokus. Vypínač zvuku je v liště na každé obrazovce.
- Stav hráče: `localStorage`, klíč `fajnslovni_v1` (`js/stav.js`). Objekt `stav` se nikdy nepřiřazuje znovu, jen mění.
- Ochrana: `fdc-guard.js` je první prvek `<head>` v `index.html`; `index-demo.html` je bez ochrany.

## Testy (spouštěj po každé změně)
- `node --test tests/*.test.mjs` – každý generátor 150×: texty, desetinné čárky, správná odpověď projde, špatná ne, pasti se neshodují s výsledkem, výklad, rychlé úlohy.
- `node tests/prohlizec.mjs [ročník]` – automatický hráč projde všechny úrovně přes skutečné rozhraní (server na portu 8765).
- `node tests/ux.mjs [složka]` – ovládání na šířce 360.
- `node tests/snimky.mjs <složka>` – chybové cesty, strážce, výzva, obrana, město, motivy, ukázka.
- `KROKY=1 NAP=1 node tools/vzorky.mjs 6` – výpis ukázek ke čtení.

## Stav (říjen 2026)
Hotovo: jádro převzaté z FajnGeometrie (bez konstrukcí, čtvercové sítě a postav), světy témat se zvuky, celý 6. ročník: 601–605 (5 témat × 3 úrovně, 70 typů úloh), obrázky pro plán a tělesa (`js/obr.js`).
Čeká: 7.–9. ročník podle `docs/UCIVO.md`, jazyková kontrola textů (Jan), zapnutí GitHub Pages, odkaz z fajndoucko.cz a zrušení `fdc-plugin/slovni.html`.
