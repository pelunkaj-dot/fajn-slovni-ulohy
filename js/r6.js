// 6. ročník: desetinná čísla v praxi, dělitelnost, obvod a obsah, objem kvádru.
import { ri, pick, chance, rstep, cz, czf, rd, b as B } from './util.js';
import { N, C } from './ulohy.js';
import { obdelnik, lTvar, kvadr } from './obr.js';

// Částka v Kč: celé koruny bez desetin, jinak vždy dvě desetinná místa (3,50 Kč).
const kc = x => (Number.isInteger(rd(x, 2)) ? cz(x, 0) : czf(x, 2)) + ' Kč';
const kc0 = x => Number.isInteger(rd(x, 2)) ? cz(x, 0) : czf(x, 2); // totéž bez „Kč“ (ve výpočtu)
const ks = n => n === 1 ? 'kus' : n <= 4 ? 'kusy' : 'kusů';
const cena = (od, doo) => ri(od, doo) + pick([0, 0, 0.5, 0.9, 0.4]); // ceny jako v obchodě: 13 · 13,50 · 13,90

// [1. pád j. č., 4. pád j. č., 1./4. pád mn. č. (2–4), 2. pád mn. č. (5+), rozsah ceny]
const ZBOZI = [
  ['rohlík', 'rohlík', 'rohlíky', 'rohlíků', [2, 5]], ['jogurt', 'jogurt', 'jogurty', 'jogurtů', [9, 19]], ['sešit', 'sešit', 'sešity', 'sešitů', [12, 35]],
  ['tužka', 'tužku', 'tužky', 'tužek', [6, 18]], ['čokoláda', 'čokoládu', 'čokolády', 'čokolád', [19, 39]], ['limonáda', 'limonádu', 'limonády', 'limonád', [15, 35]],
  ['pohlednice', 'pohlednici', 'pohlednice', 'pohlednic', [8, 20]], ['koláč', 'koláč', 'koláče', 'koláčů', [12, 25]],
];
function zbozi(krome) {
  let z; do z = pick(ZBOZI); while (krome && z[0] === krome.j);
  return { j: z[0], akuz: z[1], mn: n => n === 1 ? z[1] : n <= 4 ? z[2] : z[3], c: cena(...z[4]) };
}
const velke = s => s[0].toUpperCase() + s.slice(1);

// ======================= 601 NÁKUPY A CENY =======================
// --- úroveň 1: jeden krok ---
function n_vic() {
  const z = zbozi(), n = ri(3, 8), ans = rd(z.c * n, 2);
  return N({
    text: `${velke(z.j)} stojí ${B(kc(z.c))}.`, q: `Kolik zaplatíš za ${n} ${z.mn(n)}?`, ans, unit: 'Kč',
    traps: [[rd(z.c + n, 2), 'Cenu a počet kusů nesčítej. Stejnou cenu platíš tolikrát, kolik je kusů, takže násob.'], [z.c, 'To je cena jen za jeden kus.']],
    hints: [`Víš, kolik stojí ${B('jeden kus')} (${kc(z.c)}). Hledáš, kolik stojí ${B(n + ' ' + ks(n))}.`,
      `Za každý kus zaplatíš ${kc(z.c)}. Kusů je ${n}, takže cenu jednoho kusu ${B('vynásob')} počtem kusů.`, `${kc0(z.c)} · ${n} = ?`],
    steps: [`Vím: 1 kus … ${kc(z.c)}, kusů je ${n}.`, `Výpočet: ${kc0(z.c)} · ${n} = ${kc0(ans)}`, `Odpověď: Za ${n} ${z.mn(n)} zaplatíš ${kc(ans)}.`],
  });
}
function n_jeden() {
  const z = zbozi(), n = pick([2, 4, 5, 10]), c = rd(z.c, 1), cel = rd(c * n, 2);
  return N({
    text: `${n} ${z.mn(n)} stojí dohromady ${B(kc(cel))}. Všechny kusy stojí stejně.`, q: 'Kolik stojí jeden kus?', ans: c, unit: 'Kč',
    traps: [[rd(cel * n, 2), 'Jeden kus musí stát méně než všechny dohromady. Celkovou cenu rozděl na stejné díly, takže děl.'], [rd(cel - n, 2), 'Počet kusů od ceny neodčítej. Cenu rozděl mezi všechny kusy.']],
    hints: [`Víš, kolik stojí ${B(n + ' ' + ks(n))} dohromady. Hledáš cenu ${B('jednoho kusu')}.`,
      `Celková cena se rozdělí na ${n} ${n <= 4 ? 'stejné díly' : 'stejných dílů'}. Proto ${B('děl')} počtem kusů.`, `${kc0(cel)} : ${n} = ?`],
    steps: [`Vím: ${n} ${ks(n)} … ${kc(cel)}`, `Výpočet: ${kc0(cel)} : ${n} = ${kc0(c)}`, `Odpověď: Jeden kus stojí ${kc(c)}.`],
  });
}
function n_dohromady() {
  const a = zbozi(), z2 = zbozi(a), ans = rd(a.c + z2.c, 2);
  return N({
    text: `Koupíš ${B(a.akuz)} za ${B(kc(a.c))} a ${B(z2.akuz)} za ${B(kc(z2.c))}.`, q: 'Kolik zaplatíš dohromady?', ans, unit: 'Kč',
    traps: [[rd(Math.abs(a.c - z2.c), 2), 'Hledáš, kolik zaplatíš za obě věci dohromady, takže ceny sečti. Odčítá se, když hledáš rozdíl.']],
    hints: ['Víš cenu dvou různých věcí. Hledáš, kolik zaplatíš za obě.', `${B('Dohromady')} znamená sečíst. Při počítání pod sebou dej desetinné čárky pod sebe.`, `${kc0(a.c)} + ${kc0(z2.c)} = ?`],
    steps: [`${kc0(a.c)} + ${kc0(z2.c)} = ${kc0(ans)}`, `Odpověď: Dohromady zaplatíš ${kc(ans)}.`],
  });
}
function n_zbyde() {
  const z = zbozi(), mam = pick([50, 100, 200]), c = z.c < mam ? z.c : rd(mam - 12.5, 2), ans = rd(mam - c, 2);
  return N({
    text: `Máš ${B(mam + ' Kč')}. Koupíš ${z.akuz} za ${B(kc(c))}.`, q: 'Kolik korun ti zbyde?', ans, unit: 'Kč',
    traps: [[rd(mam + c, 2), 'Když platíš, peněz ubývá. Cenu od svých peněz odečti.']],
    hints: [`Víš, kolik máš peněz a kolik utratíš. Hledáš, kolik ${B('zbyde')}.`, 'Co utratíš, už nemáš. Proto od svých peněz cenu odečti.', `${mam} − ${kc0(c)} = ?`],
    steps: [`${mam} − ${kc0(c)} = ${kc0(ans)}`, `Odpověď: Zbyde ti ${kc(ans)}.`],
  });
}
function n_operace() {
  const z = zbozi(), n = ri(3, 6), c = kc0(z.c), cel = rd(z.c * n + ri(5, 30), 2), cl = kc0(cel);
  const zad = pick([
    [`Jeden kus stojí ${kc(z.c)}. Kolik zaplatíš za ${n} ${ks(n)}?`, `${c} · ${n}`, 'Stejnou cenu platíš několikrát, proto násobíš.'],
    [`${n} stejných kusů stojí ${kc(cel)}. Kolik stojí jeden kus?`, `${cl} : ${n}`, 'Celkovou cenu rozděluješ na stejné díly, proto dělíš.'],
    [`Máš ${kc(cel)} a dostaneš ještě ${kc(z.c)}. Kolik máš teď?`, `${cl} + ${c}`, 'Peněz přibývá, proto sčítáš.'],
    [`Máš ${kc(cel)} a utratíš ${kc(z.c)}. Kolik ti zbyde?`, `${cl} − ${c}`, 'Peněz ubývá, proto odčítáš.'],
  ]);
  const vsechny = [`${c} · ${n}`, `${cl} : ${n}`, `${cl} + ${c}`, `${cl} − ${c}`];
  return C({
    text: zad[0], q: 'Kterým výpočtem to zjistíš? Nemusíš počítat.', ok: zad[1], bad: vsechny.filter(x => x !== zad[1]),
    hints: ['Nepočítej, jen rozhodni, co se s penězi děje.', 'Přibývá → sčítám. Ubývá → odčítám. Stejná cena několikrát → násobím. Dělí se na stejné díly → dělím.', zad[2]],
    steps: [zad[2], `Výpočet: ${zad[1]}`],
  });
}

// --- úroveň 2: dva kroky, obrácené úlohy ---
function n_dvaDruhy() {
  const a = zbozi(), z2 = zbozi(a), n1 = ri(2, 5), n2 = ri(2, 4), c1 = rd(a.c * n1, 2), c2 = rd(z2.c * n2, 2), ans = rd(c1 + c2, 2);
  return N({
    text: `Koupíš ${B(n1 + ' ' + a.mn(n1))} po ${kc(a.c)} a ${B(n2 + ' ' + z2.mn(n2))} po ${kc(z2.c)}.`, q: 'Kolik zaplatíš celkem?', ans, unit: 'Kč',
    traps: [[rd(a.c + z2.c, 2), 'To je cena jen za jeden kus od každého. Každou cenu vynásob počtem kusů.'], [rd((a.c + z2.c) * (n1 + n2), 2), 'Každé zboží má jiný počet kusů. Spočítej každé zvlášť a pak sečti.']],
    hints: ['Spočítej zvlášť, kolik stojí jedno zboží a kolik druhé. Pak obě částky sečti.', `${kc0(a.c)} · ${n1} + ${kc0(z2.c)} · ${n2}`],
    steps: [`${kc0(a.c)} · ${n1} = ${kc0(c1)}`, `${kc0(z2.c)} · ${n2} = ${kc0(c2)}`, `${kc0(c1)} + ${kc0(c2)} = ${kc0(ans)}`, `Odpověď: Celkem zaplatíš ${kc(ans)}.`],
  });
}
function n_vraceni() {
  const z = zbozi(), n = ri(2, 5), cel = rd(z.c * n, 2), plat = [100, 200, 500].find(p => p > cel + 5), ans = rd(plat - cel, 2);
  return N({
    text: `Kupuješ ${B(n + ' ' + z.mn(n))} po ${kc(z.c)}. Platíš bankovkou ${B(plat + ' Kč')}.`, q: 'Kolik ti prodavač vrátí?', ans, unit: 'Kč',
    traps: [[rd(plat - z.c, 2), `Kupuješ ${n} ${ks(n)}, ne jeden. Nejdřív spočítej, kolik stojí všechny.`], [cel, 'To je, kolik zaplatíš. Vrátí ti rozdíl mezi bankovkou a cenou nákupu.']],
    hints: ['Nejdřív zjisti, kolik stojí celý nákup. Pak ho odečti od bankovky.', `${plat} − ${kc0(z.c)} · ${n}`],
    steps: [`Nákup: ${kc0(z.c)} · ${n} = ${kc0(cel)}`, `Vrátí: ${plat} − ${kc0(cel)} = ${kc0(ans)}`, `Odpověď: Prodavač vrátí ${kc(ans)}.`],
  });
}
function n_obracena() {
  const z = zbozi({ j: 'sešit' }), n = pick([2, 3, 4]), c = rd(z.c, 1), dalsi = pick([12, 15, 20, 25, 30]), bez = rd(c * n, 2), cel = rd(bez + dalsi, 2);
  return N({
    text: `Za ${B(n + ' ' + z.mn(n))} a jeden sešit za ${B(dalsi + ' Kč')} zaplatíš celkem ${B(kc(cel))}.`, q: 'Kolik stojí jeden kus?', ans: c, unit: 'Kč',
    traps: [[rd(cel / n, 2), `Celková cena obsahuje i sešit za ${dalsi} Kč. Ten nejdřív odečti.`], [bez, `Tolik stojí ${n} ${ks(n)} dohromady. Ještě děl počtem kusů.`]],
    hints: [`Nejdřív odečti cenu sešitu. Co zbyde, zaplatíš za ${n} stejné ${ks(n)}.`, `(${kc0(cel)} − ${dalsi}) : ${n}`],
    steps: [`${kc0(cel)} − ${dalsi} = ${kc0(bez)}`, `${kc0(bez)} : ${n} = ${kc0(c)}`, `Zkouška: ${kc0(c)} · ${n} + ${dalsi} = ${kc0(cel)}`],
  });
}
function n_kila() {
  const [co, od, doo] = pick([['jablek', 25, 45], ['brambor', 12, 25], ['banánů', 29, 39], ['mrkve', 15, 29]]), c = cena(od, doo);
  const kg = pick([0.5, 1.5, 2, 2.5, 3]), ans = rd(c * kg, 2);
  return N({
    text: `Kilogram ${co} stojí ${B(kc(c))}.`, q: `Kolik zaplatíš za ${cz(kg)} kg?`, ans, unit: 'Kč',
    traps: [[rd(c + kg, 2), 'Cenu a hmotnost nesčítej. Cenu jednoho kila platíš tolikrát, kolik kil kupuješ.'], ...(kg < 1 ? [[rd(c / kg, 2), 'Půl kila musí stát méně než celé kilo. Vyděl dvěma.']] : [])],
    hints: [`Cenu za 1 kg násob počtem kilogramů, i když je to desetinné číslo.${kg === 0.5 ? ' Půl kila stojí polovinu.' : ''}`, `${kc0(c)} · ${cz(kg)} = ?`],
    steps: [`${kc0(c)} · ${cz(kg)} = ${cz(ans)}`, `Odpověď: Zaplatíš ${kc(ans)}.`],
  });
}
function n_vyhodnejsi() {
  const z = zbozi(), velky = pick([4, 6, 8]), cm = rd(z.c, 1), pojed = rd(cm * velky, 2);
  const cv = rd(pojed + pick([-1, 1]) * rstep(2, 8, 1), 2), baleni = cv < pojed;
  const A = `po jednom kuse za ${kc(cm)}`, Bb = `balení ${velky} ks za ${kc(cv)}`;
  return C({
    text: `${velke(z.mn(5))} prodávají po jednom kuse za ${B(kc(cm))}, nebo v balení ${B(velky + ' ks za ' + kc(cv))}.`, q: 'Co je výhodnější?',
    opts: [A, Bb, 'obojí stojí stejně'], ok: baleni ? Bb : A,
    hints: ['Porovnej cenu za stejné množství, třeba za celé balení.', `${velky} kusů po jednom: ${kc0(cm)} · ${velky} = ${kc(pojed)}. Porovnej s cenou balení.`],
    steps: [`${velky} ks po jednom: ${kc0(cm)} · ${velky} = ${kc(pojed)}`, `Balení: ${kc(cv)}`, `Výhodnější je ${baleni ? 'balení' : 'kupovat po jednom'}.`],
  });
}

// --- úroveň 3: Jedničkář (víc kroků, zbytečný údaj, volba jednotky) ---
function n_vylet() {
  const jede = pick([20, 24, 25]), trida = jede + ri(2, 5), bus = jede * rstep(80, 160, 10), vst = rstep(60, 150, 5), ans = bus / jede + vst;
  return N({
    text: `Třída má ${trida} žáků, na výlet jich jede ${jede}. Autobus stojí ${cz(bus)} Kč a cena se rozdělí rovným dílem mezi ty, kdo jedou. Vstupné do muzea je ${vst} Kč na osobu.`,
    q: 'Kolik zaplatí za výlet jeden žák?', ans, unit: 'Kč', units: true,
    traps: [[rd(bus / trida + vst, 2), `Za autobus platí jen ti, kdo jedou (${jede}), ne celá třída.`], [bus / jede, 'Chybí vstupné. Připočti ho.'], [rd(bus / jede * vst, 2), 'Cenu za autobus a vstupné sečti, nenásob.']],
    hints: [`Autobus: ${cz(bus)} : ${jede}. K tomu připočti vstupné.`],
    steps: [`Autobus na žáka: ${cz(bus)} : ${jede} = ${cz(bus / jede)} Kč`, `Se vstupným: ${cz(bus / jede)} + ${vst} = ${kc(ans)}`, `Počet žáků ve třídě (${trida}) je zbytečný údaj.`],
  });
}
function n_kolikNejvic() {
  const z = zbozi({ j: 'rohlík' }), mam = pick([100, 150, 200, 250].filter(m => m / z.c >= 3.5));
  let c = z.c; while (mam / c - Math.floor(mam / c) < 0.1) c = rd(c - 0.6, 2); // ať nevyjde skoro celé číslo
  const ans = Math.floor(mam / c);
  return N({
    text: `Máš ${mam} Kč. ${velke(z.j)} stojí ${kc(c)}.`, q: 'Kolik kusů nejvýš koupíš?', ans, unit: 'ks',
    traps: [[ans + 1, `Na ${ans + 1}. kus už peníze nestačí: ${kc0(c)} · ${ans + 1} = ${kc(rd(c * (ans + 1), 2))}. Zaokrouhli dolů.`]],
    hints: [`${mam} : ${kc0(c)} vyjde desetinné číslo. Kus se nedá koupit jen zčásti, takže vezmi jen celé kusy.`],
    steps: [`${mam} : ${kc0(c)} ≐ ${cz(mam / c, 2)}`, `Koupit jde jen celé kusy a peníze nesmí chybět: ${ans} ks`, `Zkouška: ${kc0(c)} · ${ans} = ${kc(rd(c * ans, 2))}, to je méně než ${mam} Kč.`],
  });
}
function n_zaKilo() {
  const g = pick([100, 125, 200, 250, 500]), kg = rstep(120, 480, 5), c = rd(kg * g / 1000, 2), co = pick(['sýra', 'šunky', 'salámu', 'kávy', 'oříšků']);
  return N({
    text: `${g} g ${co} stojí ${kc(c)}.`, q: `Kolik stojí 1 kg ${co}?`, ans: kg, unit: 'Kč', units: true,
    traps: [[rd(c * 10, 2), `1 kg = 1 000 g. To je ${1000 / g}× víc než ${g} g.`], [rd(c * g, 2), `Násob tím, kolikrát se ${g} g vejde do 1 000 g.`]],
    hints: [`Kolikrát se ${g} g vejde do 1 kg (1 000 g)? Tolikrát víc stojí kilogram.`],
    steps: [`1 kg = 1 000 g, 1 000 : ${g} = ${1000 / g}`, `${kc0(c)} · ${1000 / g} = ${kc(kg)}`],
  });
}
function n_akce() {
  const z = zbozi(), c = rd(z.c, 1), k = pick([3, 4]), n = k * ri(2, 3), plati = n - n / k, ans = rd(c * plati, 2);
  return N({
    text: `V akci „${k - 1} + 1 zdarma“ dostaneš ke každým ${k === 3 ? 'dvěma' : 'třem'} kusům ještě jeden kus zdarma. Jeden kus stojí ${kc(c)}. Odnášíš celkem ${n} kusů.`,
    q: 'Kolik zaplatíš?', ans, unit: 'Kč', units: true,
    traps: [[rd(c * n, 2), `Zdarma je každý ${k}. kus. Kolik kusů z ${n} opravdu platíš?`], [rd(c * (n - 1), 2), `Zdarma není jen jeden kus, ale jeden z každých ${k} kusů.`]],
    hints: [`Z každých ${k === 3 ? 'tří' : 'čtyř'} kusů platíš jen ${k - 1}. Kolik takových skupin je v ${n} kusech?`],
    steps: [`Skupin je ${n} : ${k} = ${n / k}, z každé je jeden kus zdarma.`, `Platíš ${plati} ${ks(plati)}: ${kc0(c)} · ${plati} = ${kc(ans)}`],
  });
}

// tvar podle počtu: 1 / 2–4 / 5 a víc (jen pro celá čísla)
const tv = (n, a, b, c) => n === 1 ? a : Number.isInteger(n) && n >= 2 && n <= 4 ? b : c;
const hm = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => a / gcd(a, b) * b;
const nasobky = (a, kolik) => Array.from({ length: kolik }, (_, k) => a * (k + 1)).join(', ');
const kazdych = n => n >= 2 && n <= 4 ? `každé ${n} minuty` : `každých ${n} minut`;
const delitele = n => Array.from({ length: n }, (_, k) => k + 1).filter(d => n % d === 0).join(', ');

// ======================= 602 JEDNOTKY V PRAXI (svět Expedice) =======================
const DELKY = [ // [z, na, kolikrát, hodnoty, začátky vět]
  ['km', 'm', 1000, [1.2, 2, 3, 4.5, 6, 12], ['Trasa výpravy měří', 'Cesta k jezeru měří', 'Okruh kolem rybníka měří']],
  ['m', 'cm', 100, [1.8, 2.5, 3, 5, 12], ['Lano ke stanu měří', 'Most přes potok měří', 'Dřevěná lavice u ohniště měří']],
  ['cm', 'mm', 10, [2.2, 3, 4.5, 7], ['Brouk na kmeni měří', 'Šiška měří', 'Ptačí pírko měří']],
];
const NAZ_J = { m: 'metrů', cm: 'centimetrů', mm: 'milimetrů', g: 'gramů', kg: 'kilogramů', min: 'minut', h: 'hodin', ml: 'mililitrů', l: 'litrů' };
function prevod(v, z, na, k, vic, text) { // vic: na menší jednotku (násobí se)
  const ans = rd(vic ? v * k : v / k, 4);
  return N({
    text, q: `Kolik je to ${NAZ_J[na]}?`, ans, unit: na,
    traps: [[rd(vic ? v / k : v * k, 6), vic ? `Převádíš na menší jednotku, takže číslo musí vyjít větší. Násob ${cz(k)}.` : `Převádíš na větší jednotku, takže číslo musí vyjít menší. Děl ${cz(k)}.`],
      [rd(vic ? v * k / 10 : v / k * 10, 6), `1 ${vic ? z : na} = ${cz(k)} ${vic ? na : z}. Zkontroluj, kolik nul přidáváš nebo ubíráš.`], ...(k === 60 ? [[rd(vic ? v * 100 : v / 100, 4), 'Hodina má 60 minut, ne 100.']] : [])],
    hints: [`Víš údaj v jednotkách ${z}. Hledáš ho v jednotkách ${na}.`, `${vic ? `1 ${z} = ${cz(k)} ${na}` : `1 ${na} = ${cz(k)} ${z}`}. ${vic ? 'Na menší jednotku se násobí, číslo vyjde větší.' : 'Na větší jednotku se dělí, číslo vyjde menší.'}`, `${cz(v)} ${vic ? '·' : ':'} ${cz(k)} = ?`],
    steps: [vic ? `1 ${z} = ${cz(k)} ${na}` : `1 ${na} = ${cz(k)} ${z}`, `${cz(v)} ${vic ? '·' : ':'} ${cz(k)} = ${cz(ans, 4)}`, `Odpověď: ${cz(v)} ${z} = ${cz(ans, 4)} ${na}.`],
  });
}
function j_delka() { const [z, na, k, hod, vety] = pick(DELKY), v = pick(hod); return prevod(v, z, na, k, true, `${pick(vety)} ${B(cz(v) + ' ' + z)}.`); }
function j_hmotnost() {
  if (chance(0.5)) { const [co, v] = pick([['Batoh', pick([6, 8, 9.5, 11])], ['Stan', pick([2, 2.5, 3.2])], ['Spacák', pick([1.2, 1.5, 2])]]); return prevod(v, 'kg', 'g', 1000, true, `${co} váží ${B(cz(v) + ' kg')}.`); }
  const [co, v] = pick([['Balíček rýže', pick([500, 1000])], ['Pytlík oříšků', pick([200, 250])], ['Konzerva fazolí', 400], ['Bochník chleba', pick([800, 1200])]]);
  return prevod(v, 'g', 'kg', 1000, false, `${co} váží ${B(v + ' g')}.`);
}
function j_cas() {
  if (chance(0.5)) { const v = pick([2, 3, 4, 1.5, 2.5]); return prevod(v, 'h', 'min', 60, true, `${pick(['Pochod k jezeru trval', 'Stavba tábora trvala', 'Cesta na rozhlednu trvala'])} ${B(cz(v) + ' h')}.`); }
  const v = pick([90, 150, 30, 45, 120, 180]); return prevod(v, 'min', 'h', 60, false, `${pick(['Cesta vlakem trvala', 'Plavba na lodi trvala', 'Výstup na kopec trval'])} ${B(v + ' minut')}.`);
}
function j_objem() {
  if (chance(0.5)) { const [co, v] = pick([['Láhev', pick([1.5, 0.75, 1])], ['Termoska', pick([0.5, 0.75, 1])], ['Kanystr', pick([5, 10])]]); return prevod(v, 'l', 'ml', 1000, true, `${co} má objem ${B(cz(v) + ' l')}.`); }
  const [co, v] = pick([['Ešus', pick([750, 1500])], ['Hrnek', pick([250, 300])], ['Plechovka', 330]]); return prevod(v, 'ml', 'l', 1000, false, `${co} pojme ${B(v + ' ml')}.`);
}
function j_jednotka() {
  const [veliciny, jedn] = pick([
    [[['délka mravence', 'mm'], ['délka tužky', 'cm'], ['výška stromu', 'm'], ['vzdálenost mezi dvěma městy', 'km']], ['mm', 'cm', 'm', 'km']],
    [[['hmotnost jedné tablety', 'mg'], ['hmotnost dopisu', 'g'], ['hmotnost batohu', 'kg'], ['hmotnost nákladního auta', 't']], ['mg', 'g', 'kg', 't']],
    [[['délka mrknutí oka', 's'], ['délka přestávky ve škole', 'min'], ['délka cesty vlakem z Prahy do Brna', 'h'], ['délka letních prázdnin', 'dny']], ['s', 'min', 'h', 'dny']],
    [[['objem lžičky', 'ml'], ['objem kbelíku', 'l'], ['objem bazénu', 'm³'], ['objem sudu na dešťovou vodu', 'hl']], ['ml', 'l', 'hl', 'm³']],
  ]);
  const [co, ok] = pick(veliciny);
  return C({
    text: `Na výpravě se měří všechno možné.`, q: `Jakou jednotkou se nejlépe udává ${co}?`, opts: jedn, ok,
    hints: ['Představ si, jak velké to je. Malé věci se měří malými jednotkami, velké velkými.', `Jednotky od nejmenší: ${jedn.join(' < ')}.`, `Vyber jednotku, ve které vyjde rozumné číslo, ne obrovské ani maličké.`],
    steps: [`${co[0].toUpperCase() + co.slice(1)} se udává v jednotkách ${ok}.`],
  });
}
function j_soucet() {
  const a = rd(ri(12, 35) / 10, 1), b = rstep(350, 950, 50), ans = rd(a * 1000 + b, 3);
  return N({
    text: `První úsek trasy měří ${B(cz(a) + ' km')}, druhý ${B(b + ' m')}.`, q: 'Kolik metrů měří oba úseky dohromady?', ans, unit: 'm',
    traps: [[rd(a + b, 3), 'Kilometry a metry nejde sečíst přímo. Nejdřív převeď kilometry na metry.'], [rd(a * 100 + b, 3), '1 km = 1 000 m, ne 100 m.']],
    hints: ['Nejdřív převeď obě délky na metry, pak je sečti.', `${cz(a)} km = ${cz(a * 1000)} m`],
    steps: [`${cz(a)} km = ${cz(a * 1000)} m`, `${cz(a * 1000)} + ${b} = ${cz(ans)}`, `Odpověď: Oba úseky měří ${cz(ans)} m.`],
  });
}
function j_lahve() {
  const n = ri(3, 8), s = pick([500, 750, 1500, 250]), ans = rd(n * s / 1000, 3);
  return N({
    text: `Do tábora se nese ${B(n + ' ' + tv(n, 'láhev', 'lahve', 'lahví'))} vody, v každé je ${B(s + ' ml')}.`, q: 'Kolik litrů vody to je?', ans, unit: 'l',
    traps: [[n * s, 'To jsou mililitry. Převeď je na litry.'], [rd(n * s / 100, 3), '1 l = 1 000 ml, ne 100 ml.']],
    hints: ['Spočítej, kolik mililitrů je ve všech lahvích, a pak to převeď na litry.', `${n} · ${s} ml = ${n * s} ml, 1 l = 1 000 ml`],
    steps: [`${n} · ${s} = ${n * s} ml`, `${n * s} ml = ${cz(ans)} l`, `Odpověď: Je to ${cz(ans)} l vody.`],
  });
}
function j_doba() {
  const h1 = ri(7, 9), m1 = rstep(15, 55, 5), d = ri(95, 200), kon = h1 * 60 + m1 + d, h2 = Math.floor(kon / 60), m2 = kon % 60;
  const spatne = (h2 * 100 + m2) - (h1 * 100 + m1);
  return N({
    text: `Výprava vyrazila v ${B(hm(h1, m1))} a do cíle dorazila v ${B(hm(h2, m2))}.`, q: 'Kolik minut byla na cestě?', ans: d, unit: 'min',
    traps: [[spatne, 'Časy nejde odečíst jako obyčejná čísla, hodina má 60 minut, ne 100. Počítej po částech.'], [rd(d / 60, 2), 'Odpověď má být v minutách.']],
    hints: [`Počítej po částech: z ${hm(h1, m1)} do ${hm(h1 + 1, 0)}, pak celé hodiny, pak zbytek.`, `Do ${hm(h1 + 1, 0)} je to ${60 - m1} min.`],
    steps: [`${hm(h1, m1)} → ${hm(h1 + 1, 0)}: ${60 - m1} min`, `${hm(h1 + 1, 0)} → ${hm(h2, 0)}: ${(h2 - h1 - 1) * 60} min`, `${hm(h2, 0)} → ${hm(h2, m2)}: ${m2} min`, `Celkem: ${60 - m1} + ${(h2 - h1 - 1) * 60} + ${m2} = ${d} min`],
  });
}
function j_misky() {
  let V, s; do { V = pick([2, 2.5, 3, 4, 5]); s = pick([200, 250, 500]); } while ((V * 1000) % s);
  const ans = V * 1000 / s;
  return N({
    text: `V kotlíku je ${B(cz(V) + ' l')} polévky. Do jedné misky se nalije ${B(s + ' ml')}.`, q: 'Kolik misek se naplní?', ans, unit: '',
    traps: [[V * 1000, 'To je, kolik mililitrů je v kotlíku. Ještě děl obsahem jedné misky.'], [rd(V * 100 / s, 3), '1 l = 1 000 ml, ne 100 ml.']],
    hints: ['Převeď litry na mililitry. Pak zjisti, kolikrát se miska vejde do kotlíku.', `${cz(V)} l = ${V * 1000} ml, ${V * 1000} : ${s} = ?`],
    steps: [`${cz(V)} l = ${V * 1000} ml`, `${V * 1000} : ${s} = ${ans}`, `Odpověď: Naplní se ${ans} ${tv(ans, 'miska', 'misky', 'misek')}.`],
  });
}
function j_kroky() {
  const s = pick([50, 55, 60, 65, 70, 75]), n = pick([200, 400, 500, 800, 1000]), ans = s * n / 100;
  return N({
    text: `Jeden krok měří ${B(s + ' cm')}.`, q: `Kolik metrů ujdeš za ${n} kroků?`, ans, unit: 'm',
    traps: [[s * n, 'To jsou centimetry. Převeď je na metry.'], [s * n / 1000, '1 m = 100 cm, ne 1 000 cm.']],
    hints: ['Spočítej celou vzdálenost v centimetrech a převeď ji na metry.', `${s} · ${n} = ${s * n} cm, 1 m = 100 cm`],
    steps: [`${s} · ${n} = ${s * n} cm`, `${s * n} cm = ${cz(ans)} m`, `Odpověď: Ujdeš ${cz(ans)} m.`],
  });
}
function j_trasa() {
  let T, d1, d2, ans; do { T = ri(16, 24); d1 = rd(ri(50, 80) / 10, 1); d2 = rstep(5200, 7800, 100); ans = rd(T - d1 - d2 / 1000, 3); } while (ans < 2);
  const bat = ri(8, 13);
  return N({
    text: `Výprava má za tři dny ujít ${T} km. První den ušla ${cz(d1)} km, druhý den ${cz(d2)} m. Batoh každého účastníka váží ${bat} kg.`, q: 'Kolik kilometrů zbývá ujít třetí den?', ans, unit: 'km', units: true,
    traps: [[rd(d1 + d2 / 1000, 3), 'Tolik už výprava ušla. Odečti to od celé trasy.'], [rd(T - d1 - d2 / 100, 3), '1 km = 1 000 m.']],
    hints: [`Převeď ${cz(d2)} m na kilometry a obě ušlé vzdálenosti odečti od ${T} km. Hmotnost batohu k ničemu nepotřebuješ.`],
    steps: [`${cz(d2)} m = ${cz(d2 / 1000)} km`, `${T} − ${cz(d1)} − ${cz(d2 / 1000)} = ${cz(ans)} km`, `Hmotnost batohu je zbytečný údaj.`],
  });
}
function j_voda() {
  const p = ri(5, 8), l = pick([1.5, 2, 2.5]), d = ri(2, 5), ans = rd(p * l * d, 2), kan = pick([10, 20]);
  return N({
    text: `Na výpravu jde ${p} lidí. Každý vypije za den ${cz(l)} l vody. Výprava trvá ${d} ${tv(d, 'den', 'dny', 'dní')} a voda se veze v kanystrech po ${kan} l.`, q: 'Kolik litrů vody je potřeba na celou výpravu?', ans, unit: 'l', units: true,
    traps: [[rd(p * l, 2), 'To je spotřeba jen na jeden den.'], [rd(l * d, 2), 'To vypije jen jeden člověk.'], [rd(p * l * d * 1000, 2), 'Odpověď má být v litrech.']],
    hints: ['Kolik vypijí všichni za jeden den? A kolik za celou výpravu? Velikost kanystru se neptá.'],
    steps: [`Za den: ${p} · ${cz(l)} = ${cz(p * l)} l`, `Za ${d} ${tv(d, 'den', 'dny', 'dní')}: ${cz(p * l)} · ${d} = ${cz(ans)} l`],
  });
}
function j_vlak() {
  const h1 = ri(6, 9), m1 = rstep(20, 55, 1), d = ri(125, 230), kon = h1 * 60 + m1 + d, h2 = Math.floor(kon / 60), m2 = kon % 60, vag = ri(4, 8);
  return N({
    text: `Vlak na start výpravy odjíždí v ${hm(h1, m1)} a do cílové stanice přijíždí v ${hm(h2, m2)}. Má ${vag} vagónů.`, q: 'Jak dlouho jede? Odpověz v minutách.', ans: d, unit: 'min', units: true,
    traps: [[(h2 * 100 + m2) - (h1 * 100 + m1), 'Hodina má 60 minut, časy nejde odečíst jako obyčejná čísla.'], [rd(d / 60, 2), 'Odpověď má být v minutách.']],
    hints: [`Počítej po částech: do ${hm(h1 + 1, 0)}, pak celé hodiny, pak zbytek. Počet vagónů nepotřebuješ.`],
    steps: [`${hm(h1, m1)} → ${hm(h1 + 1, 0)}: ${60 - m1} min`, `${hm(h1 + 1, 0)} → ${hm(h2, m2)}: ${(h2 - h1 - 1) * 60 + m2} min`, `Celkem ${d} min`],
  });
}
function j_vlocky() {
  const g = pick([60, 70, 80, 90]), p = ri(8, 15), b = ri(2, 4), ans = rd(g * p * b / 1000, 3);
  return N({
    text: `Na jednu porci ovesné kaše je potřeba ${g} g vloček. Na výpravu jede ${p} lidí a kaše bude ke snídani ${b}krát. Vločky se prodávají v balíčcích po 500 g.`, q: 'Kolik kilogramů vloček je potřeba?', ans, unit: 'kg', units: true,
    traps: [[g * p * b, 'To jsou gramy. Převeď je na kilogramy.'], [rd(g * p / 1000, 3), `Kaše bude ${b}krát, ne jen jednou.`]],
    hints: ['Spočítej počet všech porcí, pak gramy a nakonec kilogramy. Velikost balíčku se neptá.'],
    steps: [`Porcí: ${p} · ${b} = ${p * b}`, `${p * b} · ${g} = ${g * p * b} g`, `${g * p * b} g = ${cz(ans)} kg`],
  });
}

// ======================= 603 DĚLITELNOST V PRAXI (svět Nádraží) =======================
const LINKY = () => { const a = ri(2, 9), b = ri(10, 25); return [a, b]; };
function d_spolu() {
  const [a, b] = pick([[4, 6], [6, 8], [6, 9], [8, 12], [10, 15], [12, 18], [9, 12], [6, 10], [4, 10]]), [l1, l2] = LINKY(), ans = lcm(a, b);
  return N({
    text: `Autobus linky ${l1} odjíždí ze zastávky ${B(kazdych(a))}, autobus linky ${l2} ${B(kazdych(b))}. Právě teď odjely oba současně.`, q: 'Za kolik minut odjedou zase současně?', ans, unit: 'min',
    traps: [[a * b, `Součin ${a} · ${b} je společný násobek, ale ne nejmenší. Oba autobusy se potkají dřív.`], [a + b, 'Intervaly se nesčítají. Hledej číslo, které je násobkem obou.']],
    hints: ['Hledáš první okamžik, kdy odjíždějí oba. To je nejmenší společný násobek (nejmenší číslo, které je násobkem obou intervalů).', `Odjezdy linky ${l1}: ${nasobky(a, 6)}… Odjezdy linky ${l2}: ${nasobky(b, 4)}…`, 'Najdi první číslo, které je v obou řadách.'],
    steps: [`Násobky ${a}: ${nasobky(a, ans / a)}`, `Násobky ${b}: ${nasobky(b, ans / b)}`, `Nejmenší společný násobek: ${ans}`, `Odpověď: Za ${ans} minut odjedou zase současně.`],
  });
}
function d_balicky() {
  const [x, y] = pick([[12, 18], [24, 36], [16, 24], [20, 30], [18, 27], [30, 45], [28, 42], [15, 25]]), g = gcd(x, y);
  const [a, b] = pick([['jablek', 'hrušek'], ['sušenek', 'bonbonů'], ['rohlíků', 'jogurtů']]);
  return N({
    text: `Na cestu se chystají svačiny. Je k dispozici ${B(x + ' ' + a)} a ${B(y + ' ' + b)}. Ze všeho se má udělat co nejvíc stejných balíčků a nic nesmí zbýt.`, q: 'Kolik balíčků se dá udělat?', ans: g, unit: '',
    traps: [[lcm(x, y), 'To je společný násobek. Tady se dělí, hledáš společného dělitele.'], [x + y, 'Tolik je všeho dohromady. Hledáš počet balíčků.']],
    hints: ['Počet balíčků musí dělit obě čísla beze zbytku. Hledáš největší společný dělitel (největší číslo, kterým jdou obě čísla vydělit).', `Dělitelé ${x}: ${delitele(x)}. Dělitelé ${y}: ${delitele(y)}.`, 'Vyber největší číslo, které je v obou seznamech.'],
    steps: [`Dělitelé ${x}: ${delitele(x)}`, `Dělitelé ${y}: ${delitele(y)}`, `Největší společný dělitel: ${g}`, `Každý balíček: ${x} : ${g} = ${x / g} a ${y} : ${g} = ${y / g}`],
  });
}
function d_vagony() {
  let P, s; do { P = ri(60, 190); s = pick([24, 36, 40, 48, 54]); } while (P % s === 0 || P < s * 2);
  const ans = Math.ceil(P / s);
  return N({
    text: `Na nástupišti čeká ${B(P + ' cestujících')}. Do jednoho vagónu se vejde ${B(s + ' lidí')}.`, q: 'Kolik vagónů musí vlak mít, aby se všichni vešli?', ans, unit: '',
    traps: [[Math.floor(P / s), `Do ${Math.floor(P / s)} ${tv(Math.floor(P / s), 'vagónu', 'vagónů', 'vagónů')} se vejde jen ${Math.floor(P / s) * s} lidí. Pro zbytek je potřeba ještě jeden vagón.`]],
    hints: ['Vyděl počet cestujících počtem míst ve vagónu.', `${P} : ${s} = ${Math.floor(P / s)}, zbytek ${P % s}. Co s těmi, kdo zbyli?`, 'I pro zbylé cestující musí být vagón, takže výsledek zaokrouhli nahoru.'],
    steps: [`${P} : ${s} = ${Math.floor(P / s)} (zbytek ${P % s})`, `Zbylí cestující potřebují další vagón: ${ans}`, `Odpověď: Vlak musí mít ${ans} ${tv(ans, 'vagón', 'vagóny', 'vagónů')}.`],
  });
}
const PRAVIDLA = { 2: 'Číslo je dělitelné 2, když je sudé (končí 0, 2, 4, 6, 8).', 3: 'Číslo je dělitelné 3, když je jeho ciferný součet (součet číslic) dělitelný 3.', 4: 'Číslo je dělitelné 4, když je jeho poslední dvojčíslí dělitelné 4.', 5: 'Číslo je dělitelné 5, když končí 0 nebo 5.', 6: 'Číslo je dělitelné 6, když je sudé a zároveň dělitelné 3.', 9: 'Číslo je dělitelné 9, když je jeho ciferný součet dělitelný 9.', 10: 'Číslo je dělitelné 10, když končí nulou.' };
function d_delitelne() {
  const k = pick([3, 4, 5, 6, 9]), ok = k * ri(8, 22), bad = new Set();
  while (bad.size < 3) { const v = ok + ri(-15, 15); if (v % k && v > 20) bad.add(v); }
  return C({
    text: `Průvodčí rozděluje cestující do skupin po ${k} tak, aby nikdo nezbyl.`, q: 'U kterého počtu cestujících to jde?', ok: String(ok), bad: [...bad].map(String),
    hints: [`Hledáš číslo, které jde vydělit ${k} beze zbytku.`, PRAVIDLA[k], 'Vyzkoušej pravidlo na každé nabídnuté číslo.'],
    steps: [PRAVIDLA[k], `${ok} : ${k} = ${ok / k}, beze zbytku`],
  });
}
function d_odjezdy() {
  const i = pick([10, 12, 15, 20, 30]), H = ri(7, 9), ans = 60 * (H - 6) / i + 1;
  return N({
    text: `První vlak odjíždí v ${B('6:00')}, další vždy po ${B(i + ' minutách')}.`, q: `Kolik vlaků odjede od 6:00 do ${H}:00 včetně?`, ans, unit: '',
    traps: [[ans - 1, 'Nezapomeň na vlak, který jede přesně v 6:00. Ten se počítá taky.']],
    hints: [`Za hodinu odjede ${60 / i} ${tv(60 / i, 'vlak', 'vlaky', 'vlaků')}, ale pozor na začátek i konec.`, `${H - 6} h = ${60 * (H - 6)} min, ${60 * (H - 6)} : ${i} = ${ans - 1} mezer mezi vlaky.`, 'Vlaků je o jeden víc než mezer mezi nimi.'],
    steps: [`${60 * (H - 6)} : ${i} = ${ans - 1} ${tv(ans - 1, 'mezera', 'mezery', 'mezer')} mezi vlaky`, `Vlaků je o jeden víc: ${ans}`],
  });
}
function d_tri() {
  const [a, b, c] = pick([[4, 6, 10], [6, 8, 12], [4, 5, 6], [6, 9, 12], [10, 12, 15], [3, 4, 6], [8, 10, 20]]), ans = lcm(lcm(a, b), c);
  return N({
    text: `Ze stanice odjíždějí tři linky: první ${B(kazdych(a))}, druhá ${B(kazdych(b))}, třetí ${B(kazdych(c))}. Teď odjely všechny současně.`, q: 'Za kolik minut odjedou zase všechny tři současně?', ans, unit: 'min',
    traps: [[a * b * c, 'Součin je společný násobek, ale ne nejmenší.'], [lcm(a, b), `Za ${lcm(a, b)} minut se potkají jen první dvě linky.`]],
    hints: ['Hledáš nejmenší společný násobek všech tří čísel.', `Najdi společný násobek prvních dvou (${lcm(a, b)}) a pak ho zkus s třetím.`],
    steps: [`n(${a}, ${b}) = ${lcm(a, b)}`, `n(${lcm(a, b)}, ${c}) = ${ans}`, `Odpověď: Za ${ans} minut.`],
  });
}
function d_kdy() {
  const [a, b] = pick([[12, 18], [8, 12], [10, 15], [6, 9], [15, 20], [6, 8]]), h = ri(6, 8), m = rstep(0, 30, 5), L = lcm(a, b);
  const cas = d => { const t = h * 60 + m + d; return hm(Math.floor(t / 60), t % 60); };
  const ok = cas(L), bad = [...new Set([cas(a * b), cas(a + b), cas(L + a), cas(L / 2)])].filter(x => x !== ok).slice(0, 3);
  return C({
    text: `Dva rychlíky odjely z nádraží společně v ${hm(h, m)}. První jezdí každých ${a} minut, druhý každých ${b} minut.`, q: 'V kolik hodin odjedou zase společně?', ok, bad,
    hints: ['Nejdřív zjisti, za kolik minut se odjezdy znovu sejdou (nejmenší společný násobek).', `n(${a}, ${b}) = ${L} min. Přičti to k ${hm(h, m)}.`],
    steps: [`n(${a}, ${b}) = ${L}`, `${hm(h, m)} + ${L} min = ${ok}`],
  });
}
function d_dlazdice() {
  const [a, b] = pick([[360, 240], [300, 180], [420, 280], [480, 360], [250, 150], [270, 180]]), g = gcd(a, b);
  return N({
    text: `Podlaha čekárny měří ${B(a + ' cm')} a ${B(b + ' cm')}. Má se vydláždit stejnými čtvercovými dlaždicemi, co největšími, a žádná se nesmí řezat.`, q: 'Jak dlouhá bude strana jedné dlaždice?', ans: g, unit: 'cm',
    traps: [[lcm(a, b), 'Dlaždice se musí do podlahy vejít, hledáš dělitele, ne násobek.'], [g / 2, 'Taková dlaždice se vejde, ale jde to i s větší.']],
    hints: ['Strana dlaždice musí beze zbytku dělit obě délky. Hledáš největší společný dělitel.', `Zkus velká čísla, která dělí ${a} i ${b}.`],
    steps: [`D(${a}, ${b}) = ${g}`, `Dlaždice ${g} cm × ${g} cm, jich bude ${a / g} · ${b / g} = ${a / g * b / g}`],
  });
}
function d_druzstva() {
  const [x, y] = pick([[12, 18], [16, 20], [15, 25], [18, 24], [14, 21], [20, 30]]), g = gcd(x, y), ans = (x + y) / g;
  return N({
    text: `Na školním výletě je ${B(x + ' kluků')} a ${B(y + ' holek')}. Mají se rozdělit do co největšího počtu družstev tak, aby v každém byl stejný počet kluků i stejný počet holek.`, q: 'Kolik dětí bude v jednom družstvu?', ans, unit: '',
    traps: [[g, `${g} je počet družstev. Ptám se, kolik dětí bude v jednom.`], [x / g, 'To jsou jen kluci v jednom družstvu. Přidej holky.']],
    hints: ['Nejdřív zjisti počet družstev: největší společný dělitel počtu kluků a holek.', `Družstev je ${g}. Kolik kluků a kolik holek připadne na jedno?`],
    steps: [`D(${x}, ${y}) = ${g} družstev`, `V družstvu: ${x} : ${g} = ${x / g} a ${y} : ${g} = ${y / g}, celkem ${ans} dětí`],
  });
}
function d_skupiny() {
  let g, s, c; do { g = ri(4, 8); s = ri(18, 28); c = pick([40, 48, 54, 64]); } while ((g * s) % c === 0);
  const ans = Math.ceil(g * s / c);
  return N({
    text: `Na nádraží ${g <= 4 ? 'přišly' : 'přišlo'} ${B(g + ' ' + tv(g, 'třída', 'třídy', 'tříd'))} po ${B(s + ' žácích')}. Jeden vagón má ${B(c + ' míst')}.`, q: 'Kolik vagónů je potřeba?', ans, unit: '',
    traps: [[Math.floor(g * s / c), 'Někdo by se nevešel. Zaokrouhli nahoru.'], [g, 'Třídy se mohou v jednom vagónu promíchat. Počítej všechny žáky.']],
    hints: ['Spočítej všechny žáky a vyděl počtem míst ve vagónu.', `${g} · ${s} = ${g * s}, ${g * s} : ${c} = ? Zbytek také potřebuje vagón.`],
    steps: [`Žáků: ${g} · ${s} = ${g * s}`, `${g * s} : ${c} = ${Math.floor(g * s / c)}, zbytek ${(g * s) % c}`, `Vagónů: ${ans}`],
  });
}
function d_triVlaky() {
  const [a, b, c] = pick([[20, 30, 45], [12, 18, 30], [15, 20, 25], [16, 24, 40]]), L = lcm(lcm(a, b), c), h = ri(5, 6), m = rstep(10, 50, 10), nast = ri(4, 7);
  return N({
    text: `Na nádraží se ${nast} nástupišti odjíždějí tři linky: po ${a}, po ${b} a po ${c} minutách. Všechny tři odjely současně v ${hm(h, m)}.`, q: `Za kolik minut po ${hm(h, m)} odjedou zase všechny současně?`, ans: L, unit: 'min', units: true,
    traps: [[a * b * c, 'Součin je společný násobek, ale ne nejmenší.'], [lcm(a, b), 'Tak se potkají jen první dvě linky.']],
    hints: ['Nejmenší společný násobek tří čísel. Počet nástupišť nehraje roli.'],
    steps: [`n(${a}, ${b}) = ${lcm(a, b)}`, `n(${lcm(a, b)}, ${c}) = ${L}`, `Počet nástupišť je zbytečný údaj.`],
  });
}
function d_kytice() {
  const [x, y] = pick([[84, 126], [48, 72], [60, 90], [36, 54], [64, 96]]), g = gcd(x, y), cena = pick([12, 15, 18]);
  return N({
    text: `Květinářství u nádraží má ${x} tulipánů a ${y} narcisů. Chce z nich uvázat co nejvíc stejných kytic a použít všechny květiny. Jeden tulipán stojí ${cena} Kč.`, q: 'Kolik tulipánů bude v jedné kytici?', ans: x / g, unit: '',
    traps: [[g, `${g} je počet kytic. Kolik tulipánů připadne na jednu?`], [y / g, 'To jsou narcisy.']],
    hints: ['Počet kytic je největší společný dělitel. Cena tulipánu se neptá.'],
    steps: [`D(${x}, ${y}) = ${g} kytic`, `Tulipánů v kytici: ${x} : ${g} = ${x / g}`],
  });
}
function d_kola() {
  const [a, b] = pick([[24, 36], [12, 18], [16, 24], [20, 30], [18, 24], [15, 40]]), L = lcm(a, b);
  return N({
    text: `V převodovce hodin na nádražní věži do sebe zapadají dvě ozubená kola. Menší má ${a} zubů, větší ${b} zubů. Na obou je značka, která teď stojí proti sobě.`, q: 'Kolikrát se otočí menší kolo, než se značky poprvé znovu setkají?', ans: L / a, unit: '',
    traps: [[L, `${L} je počet zubů, které projdou. Kolik je to otáček menšího kola?`], [L / b, 'To je počet otáček většího kola.']],
    hints: [`Obě kola musí projít stejný počet zubů, který je násobkem ${a} i ${b}.`],
    steps: [`n(${a}, ${b}) = ${L} zubů`, `Menší kolo: ${L} : ${a} = ${L / a} ${tv(L / a, 'otáčka', 'otáčky', 'otáček')}`],
  });
}
function d_skrinky() {
  const [p, q] = pick([[4, 6], [6, 9], [4, 10], [6, 8], [10, 15]]), Nn = rstep(100, 300, 10), L = lcm(p, q), rady = ri(3, 6);
  return N({
    text: `Ve skladu na nádraží je ${Nn} skříněk očíslovaných od 1 do ${Nn} v ${rady} řadách. Zelenou nálepku dostane každá skříňka s číslem dělitelným ${p}, modrou každá s číslem dělitelným ${q}.`, q: 'Kolik skříněk dostane obě nálepky?', ans: Math.floor(Nn / L), unit: '',
    traps: [[Math.floor(Nn / (p * q)), `Obě nálepky má číslo dělitelné nejmenším společným násobkem ${L}, ne součinem ${p * q}.`], [Math.floor(Nn / p) + Math.floor(Nn / q), 'Tolik je nálepek celkem. Hledáš skříňky, které mají obě.']],
    hints: [`Obě nálepky mají čísla dělitelná ${p} i ${q}, tedy násobky jejich nejmenšího společného násobku. Počet řad nehraje roli.`],
    steps: [`n(${p}, ${q}) = ${L}`, `Násobků ${L} do ${Nn}: ${Nn} : ${L} = ${Math.floor(Nn / L)} (zbytek se nepočítá)`],
  });
}

// ======================= 604 OBVOD A OBSAH V PRAXI (svět Stavební plán) =======================
function o_plot() {
  const a = ri(8, 20), b = ri(5, Math.min(12, a - 1)), ans = 2 * (a + b);
  return N({
    text: `Zahrada má tvar obdélníku o rozměrech ${B(a + ' m')} a ${B(b + ' m')}. Kolem dokola se postaví plot.`, q: 'Kolik metrů pletiva je potřeba?', ans, unit: 'm', fig: obdelnik(a, b, a + ' m', b + ' m', { plot: true }),
    traps: [[a * b, 'To je obsah (velikost plochy zahrady). Plot vede kolem, potřebuješ obvod.'], [a + b, 'To jsou jen dvě strany. Obdélník má čtyři.']],
    hints: ['Plot vede kolem celé zahrady. Potřebuješ obvod (součet délek všech stran).', 'Obdélník má dvě dlouhé a dvě krátké strany: o = 2 · (a + b).', `2 · (${a} + ${b}) = ?`],
    steps: [`o = 2 · (a + b)`, `o = 2 · (${a} + ${b}) = ${ans} m`, `Odpověď: Je potřeba ${ans} m pletiva.`],
  });
}
function o_travnik() {
  const a = ri(6, 15), b = ri(3, Math.min(9, a - 1)), ans = a * b;
  return N({
    text: `Trávník má tvar obdélníku ${B(a + ' m')} × ${B(b + ' m')}.`, q: 'Kolik m² (čtverečních metrů) trávníku se poseká?', ans, unit: 'm²', fig: obdelnik(a, b, a + ' m', b + ' m', { uvnitr: 'S = ?' }),
    traps: [[2 * (a + b), 'To je obvod (délka kolem dokola). Sekáš celou plochu, potřebuješ obsah.'], [a + b, 'Strany se pro obsah násobí, ne sčítají.']],
    hints: ['Sekáš celou plochu trávníku. Potřebuješ obsah (kolik čtverečků 1 m × 1 m se na trávník vejde).', 'Obsah obdélníku: S = a · b.', `${a} · ${b} = ?`],
    steps: [`S = a · b`, `S = ${a} · ${b} = ${ans} m²`, `Odpověď: Poseká se ${ans} m² trávníku.`],
  });
}
function o_strana() {
  const a = ri(3, 12), O = 4 * a;
  return N({
    text: `Čtvercový záhon má obvod ${B(O + ' m')}.`, q: 'Jak dlouhá je jedna strana záhonu?', ans: a, unit: 'm', fig: obdelnik(1, 1, 'a = ?', '', { uvnitr: `o = ${O} m` }),
    traps: [[O / 2, 'Čtverec má čtyři stejné strany, ne dvě. Děl čtyřmi.'], [O * 4, 'Strana musí být kratší než obvod. Děl, nenásob.']],
    hints: ['Obvod je součet všech čtyř stran. Strany čtverce jsou stejně dlouhé.', 'o = 4 · a, takže a = o : 4.', `${O} : 4 = ?`],
    steps: [`o = 4 · a`, `a = ${O} : 4 = ${a} m`, `Odpověď: Strana záhonu měří ${a} m.`],
  });
}
function o_dlazdice() {
  const a = ri(3, 8), b = ri(2, Math.min(6, a)), ans = a * b;
  return N({
    text: `Terasa měří ${B(a + ' m')} × ${B(b + ' m')}. Pokládají se na ni čtvercové dlaždice ${B('1 m × 1 m')}.`, q: 'Kolik dlaždic je potřeba?', ans, unit: '', fig: obdelnik(a, b, a + ' m', b + ' m', { dlazdice: true }),
    traps: [[2 * (a + b), 'To je obvod. Dlaždice pokrývají celou plochu, počítáš obsah.'], [a + b, `Do každé řady se vejde ${a} ${tv(a, 'dlaždice', 'dlaždice', 'dlaždic')} a řad je ${b}. Násob.`]],
    hints: ['Dlaždice pokryjí celou plochu terasy. Každá má 1 m².', `V jedné řadě je ${a} ${tv(a, 'dlaždice', 'dlaždice', 'dlaždic')}. Kolik je řad?`, `${a} · ${b} = ?`],
    steps: [`Řad: ${b}, v každé ${a} ${tv(a, 'dlaždice', 'dlaždice', 'dlaždic')}`, `${a} · ${b} = ${ans}`, `Odpověď: Je potřeba ${ans} ${tv(ans, 'dlaždice', 'dlaždice', 'dlaždic')}.`],
  });
}
function o_co() {
  const [sit, ok] = pick([['Natírá se plot kolem hřiště.', 'obvod'], ['Pokládá se koberec do pokoje.', 'obsah'], ['Ubrus se obšívá krajkou kolem dokola.', 'obvod'], ['Na zahradě se seje tráva.', 'obsah'], ['Kolem podlahy se lepí lišta.', 'obvod'], ['Kupuje se barva na strop.', 'obsah'], ['Kolem záhonu se zatlouká obrubník.', 'obvod'], ['Střecha se pokrývá taškami.', 'obsah']]);
  const O = 'obvod (délka kolem dokola)', S = 'obsah (velikost plochy)';
  return C({
    text: sit, q: 'Co je potřeba spočítat?', opts: [O, S], ok: ok === 'obvod' ? O : S,
    hints: ['Zeptej se: jde o čáru kolem okraje, nebo o celou plochu uvnitř?', 'Co vede kolem dokola (plot, lišta, krajka), je obvod. Co pokrývá plochu (koberec, barva, tráva), je obsah.', ok === 'obvod' ? 'Tady jde o okraj.' : 'Tady jde o celou plochu.'],
    steps: [ok === 'obvod' ? 'Jde o délku kolem okraje, tedy obvod.' : 'Jde o celou plochu, tedy obsah.'],
  });
}
function o_stena() {
  const a = pick([3, 3.5, 4, 4.5, 5]), b = pick([2.5, 2.6, 2.8]), c = pick([1, 1.2, 1.5]), d = pick([1, 1.2]), ans = rd(a * b - c * d, 2);
  return N({
    text: `Stěna pokoje je ${B(cz(a) + ' m')} dlouhá a ${B(cz(b) + ' m')} vysoká. Je v ní okno ${B(cz(c) + ' m')} × ${B(cz(d) + ' m')}, které se nemaluje.`, q: 'Kolik m² stěny se bude malovat?', ans, unit: 'm²', fig: obdelnik(a, b, cz(a) + ' m', cz(b) + ' m', { okno: [c, d], oknoT: 'okno' }),
    traps: [[rd(a * b, 2), 'Okno se nemaluje. Jeho obsah odečti.'], [rd(2 * (a + b) - 2 * (c + d), 2), 'Malování pokrývá plochu, počítej obsah, ne obvod.']],
    hints: ['Spočítej obsah celé stěny a odečti obsah okna.', `${cz(a)} · ${cz(b)} − ${cz(c)} · ${cz(d)}`],
    steps: [`Stěna: ${cz(a)} · ${cz(b)} = ${cz(a * b)} m²`, `Okno: ${cz(c)} · ${cz(d)} = ${cz(c * d)} m²`, `${cz(a * b)} − ${cz(c * d)} = ${cz(ans)} m²`],
  });
}
function o_branka() {
  const a = ri(12, 25), b = ri(8, a - 2), g = pick([1, 1.5, 3]), ans = rd(2 * (a + b) - g, 2);
  return N({
    text: `Pozemek ${B(a + ' m')} × ${B(b + ' m')} se oplotí. V plotě bude branka široká ${B(cz(g) + ' m')}, ta se dělá zvlášť.`, q: 'Kolik metrů pletiva je potřeba?', ans, unit: 'm', fig: obdelnik(a, b, a + ' m', b + ' m', { plot: true }),
    traps: [[2 * (a + b), 'Na branku se pletivo nepoužije. Odečti její šířku.'], [a * b - g, 'Plot vede kolem, počítej obvod.']],
    hints: ['Spočítej obvod pozemku a odečti šířku branky.', `2 · (${a} + ${b}) − ${cz(g)}`],
    steps: [`o = 2 · (${a} + ${b}) = ${2 * (a + b)} m`, `${2 * (a + b)} − ${cz(g)} = ${cz(ans)} m`],
  });
}
function o_druha() {
  const a = pick([2.5, 3.5, 4.5, 5, 6]), b = ri(3, 6), S = rd(a * b, 2);
  return N({
    text: `Pokoj má obsah podlahy ${B(cz(S) + ' m²')}. Jedna stěna je dlouhá ${B(cz(a) + ' m')}.`, q: 'Jak dlouhá je druhá stěna?', ans: b, unit: 'm', fig: obdelnik(a, b, cz(a) + ' m', '?', { uvnitr: `${cz(S)} m²` }),
    traps: [[rd(S - a, 2), 'Obsah vzniká násobením stran, takže druhou stranu zjistíš dělením.'], [rd(S / 2, 2), `Děl délkou známé stěny (${cz(a)}), ne dvěma.`]],
    hints: ['S = a · b, takže b = S : a.', `${cz(S)} : ${cz(a)} = ?`],
    steps: [`b = S : a`, `b = ${cz(S)} : ${cz(a)} = ${b} m`, `Zkouška: ${cz(a)} · ${b} = ${cz(S)} m²`],
  });
}
function o_lko() {
  const a = ri(8, 14), b = ri(6, 10), c = ri(2, a - 4), d = ri(2, b - 3), ans = a * b - c * d;
  return N({
    text: `Půdorys chaty má tvar písmene L. Je to obdélník ${B(a + ' m')} × ${B(b + ' m')}, ze kterého v rohu chybí obdélník ${B(c + ' m')} × ${B(d + ' m')}.`, q: 'Jaký obsah má půdorys chaty?', ans, unit: 'm²', fig: lTvar(a, b, c, d, { a: a + ' m', b: b + ' m', c: c + ' m', d: d + ' m' }),
    traps: [[a * b, 'Chybějící roh je potřeba odečíst.'], [a * b + c * d, 'Roh chybí, jeho obsah se odečítá, ne přičítá.']],
    hints: ['Spočítej obsah celého obdélníku a odečti chybějící roh.', `${a} · ${b} − ${c} · ${d}`],
    steps: [`Celý obdélník: ${a} · ${b} = ${a * b} m²`, `Chybějící roh: ${c} · ${d} = ${c * d} m²`, `${a * b} − ${c * d} = ${ans} m²`],
  });
}
function o_cena() {
  const a = pick([3, 4, 5]), b = pick([2.5, 3, 3.5, 4]), p = pick([180, 220, 250, 320]), S = rd(a * b, 2), ans = rd(S * p, 2);
  return N({
    text: `Koberec stojí ${B(p + ' Kč za 1 m²')}. Má se položit do pokoje ${B(a + ' m')} × ${B(cz(b) + ' m')}.`, q: 'Kolik bude koberec stát?', ans, unit: 'Kč', fig: obdelnik(a, b, a + ' m', cz(b) + ' m'),
    traps: [[rd(2 * (a + b) * p, 2), 'Koberec pokrývá plochu. Násob cenou obsah, ne obvod.'], [S, 'To je obsah v m². Ještě vynásob cenou.']],
    hints: ['Nejdřív spočítej obsah podlahy, pak ho vynásob cenou za 1 m².', `${a} · ${cz(b)} = ${cz(S)} m²`],
    steps: [`S = ${a} · ${cz(b)} = ${cz(S)} m²`, `${cz(S)} · ${p} = ${cz(ans)} Kč`],
  });
}
function o_ary() {
  const a = rstep(60, 150, 5), b = rstep(40, 90, 5), ans = rd(a * b / 100, 2), cesta = ri(2, 4);
  return N({
    text: `Pole má tvar obdélníku ${a} m × ${b} m. Na pole vede polní cesta široká ${cesta} m.`, q: 'Kolik arů má pole?', ans, unit: 'a', units: true,
    traps: [[a * b, 'To jsou m². 1 ar = 100 m².'], [rd(a * b / 10000, 4), 'To jsou hektary. 1 a = 100 m², 1 ha = 10 000 m².']],
    hints: ['Spočítej obsah v m² a převeď: 1 a = 100 m². Šířka cesty se neptá.'],
    steps: [`S = ${a} · ${b} = ${a * b} m²`, `${a * b} m² = ${cz(ans)} a`],
  });
}
function o_listy() {
  let a, b, kusy; do { a = rd(ri(32, 56) / 10, 1); b = rd(ri(26, 42) / 10, 1); kusy = Math.ceil((2 * (a + b) - 0.9) / 2.5 - 1e-9); } while (Math.abs((2 * (a + b) - 0.9) / 2.5 - Math.round((2 * (a + b) - 0.9) / 2.5)) < 0.15);
  const del = rd(2 * (a + b) - 0.9, 2);
  return N({
    text: `Kolem podlahy pokoje ${cz(a)} m × ${cz(b)} m se budou lepit lišty. Ve dveřích široké 0,9 m lišta nebude. Lišty se prodávají po 2,5 m a stojí 89 Kč za kus.`, q: 'Kolik kusů lišt je potřeba koupit?', ans: kusy, unit: '',
    traps: [[Math.floor(del / 2.5), 'Na zbytek obvodu je potřeba ještě jedna lišta. Zaokrouhli nahoru.'], [Math.ceil(2 * (a + b) / 2.5 - 1e-9), 'Ve dveřích lišta není, jejich šířku odečti.']],
    hints: ['Obvod pokoje bez dveří vyděl délkou jedné lišty a zaokrouhli nahoru. Cena se neptá.'],
    steps: [`o = 2 · (${cz(a)} + ${cz(b)}) = ${cz(2 * (a + b))} m`, `Bez dveří: ${cz(2 * (a + b))} − 0,9 = ${cz(del)} m`, `${cz(del)} : 2,5 ≐ ${cz(del / 2.5, 2)} → ${kusy} kusů`],
  });
}
function o_obklad() {
  let a, b, s; do { a = rd(ri(15, 30) / 10, 1); b = rd(ri(12, 24) / 10, 1); s = pick([15, 20, 25, 30]); } while (Math.round(a * 100) % s || Math.round(b * 100) % s);
  const ans = Math.round(a * 100 / s) * Math.round(b * 100 / s);
  return N({
    text: `Podlaha koupelny měří ${cz(a)} m × ${cz(b)} m. Pokryje se čtvercovými dlaždicemi o straně ${s} cm.`, q: 'Kolik dlaždic je potřeba?', ans, unit: '',
    traps: [[rd(a * b / (s * s), 6), 'Metry a centimetry nejde dělit přímo. Převeď rozměry podlahy na centimetry.'], [rd(a * b * 100 / s, 4), '1 m = 100 cm, převeď obě strany.']],
    hints: [`Převeď rozměry na cm a zjisti, kolik dlaždic se vejde podél každé strany.`],
    steps: [`${cz(a)} m = ${Math.round(a * 100)} cm → ${Math.round(a * 100)} : ${s} = ${Math.round(a * 100 / s)} ${tv(Math.round(a * 100 / s), 'dlaždice', 'dlaždice', 'dlaždic')}`, `${cz(b)} m = ${Math.round(b * 100)} cm → ${Math.round(b * 100)} : ${s} = ${Math.round(b * 100 / s)} ${tv(Math.round(b * 100 / s), 'dlaždice', 'dlaždice', 'dlaždic')}`, `${Math.round(a * 100 / s)} · ${Math.round(b * 100 / s)} = ${ans}`],
  });
}
function o_ctverecS() {
  const a = pick([3.5, 4.5, 5.5, 2.5, 6.5]), O = 4 * a, ans = rd(a * a, 3);
  return N({
    text: `Čtvercový záhon má obvod ${cz(O)} m.`, q: 'Jaký je obsah záhonu?', ans, unit: 'm²', units: true,
    traps: [[a, 'To je jen délka strany. Obsah je strana krát strana.'], [rd(O * O, 2), 'Obvod se nenásobí sám sebou. Nejdřív zjisti stranu.']],
    hints: ['Nejdřív zjisti stranu (obvod : 4), pak obsah čtverce (a · a).'],
    steps: [`a = ${cz(O)} : 4 = ${cz(a)} m`, `S = ${cz(a)} · ${cz(a)} = ${cz(ans)} m²`],
  });
}

// ======================= 605 KRYCHLE A KVÁDR V PRAXI (svět Akvárium) =======================
function k_objem() {
  const a = pick([30, 40, 50, 60]), b = pick([20, 25, 30]), c = pick([20, 25, 30, 40]), ans = a * b * c;
  return N({
    text: `Akvárium má tvar kvádru o rozměrech ${B(a + ' cm')}, ${B(b + ' cm')} a ${B(c + ' cm')}.`, q: 'Jaký je objem akvária v cm³ (krychlových centimetrech)?', ans, unit: 'cm³', fig: kvadr(a, b, c, { a: a + ' cm', b: b + ' cm', c: c + ' cm' }),
    traps: [[a + b + c, 'Rozměry se pro objem násobí, ne sčítají.'], [a * b, 'To je jen obsah dna. Vynásob ještě výškou.'], [2 * (a * b + a * c + b * c), 'To je povrch (plocha všech stěn). Objem je a · b · c.']],
    hints: ['Objem říká, kolik se toho do tělesa vejde.', 'Objem kvádru: V = a · b · c (vynásob všechny tři rozměry).', `${a} · ${b} · ${c} = ?`],
    steps: ['V = a · b · c', `V = ${a} · ${b} · ${c} = ${ans} cm³`, `Odpověď: Objem akvária je ${ans} cm³.`],
  });
}
function k_litry() {
  const [z, na, v, co] = pick([['dm³', 'l', pick([3, 5, 12, 20]), 'Kanystr'], ['cm³', 'ml', pick([250, 330, 500]), 'Kelímek'], ['dm³', 'l', pick([54, 60, 112]), 'Akvárium']]);
  return N({
    text: `${co} má objem ${B(v + ' ' + z)}.`, q: `Kolik ${na === 'l' ? 'litrů' : 'mililitrů'} vody se do něj vejde?`, ans: v, unit: na,
    traps: [[v * 1000, `1 ${z} je přesně 1 ${na}, nic se nenásobí.`], [v / 1000, `1 ${z} je přesně 1 ${na}, nic se nedělí.`]],
    hints: ['Litry a krychlové jednotky spolu souvisí.', na === 'l' ? '1 dm³ = 1 l (krychle s hranou 10 cm pojme přesně litr).' : '1 cm³ = 1 ml (kostička s hranou 1 cm pojme mililitr).', `${v} ${z} = ? ${na}`],
    steps: [na === 'l' ? '1 dm³ = 1 l' : '1 cm³ = 1 ml', `${v} ${z} = ${v} ${na}`],
  });
}
function k_krychle() {
  const a = ri(2, 9), ans = a ** 3, co = pick(['Krabička na šperky', 'Kostka do hry', 'Dřevěná kostka', 'Krabice na čaj']);
  return N({
    text: `${co} má tvar krychle s hranou ${B(a + ' cm')}.`, q: 'Jaký má objem?', ans, unit: 'cm³', fig: kvadr(a, a, a, { a: a + ' cm', b: '', c: '' }),
    traps: [[a * a, 'To je obsah jedné stěny. Objem krychle je a · a · a.'], [3 * a, 'Hrany se nesčítají, násobí se.'], [6 * a * a, 'To je povrch krychle.']],
    hints: ['Krychle je kvádr, který má všechny hrany stejně dlouhé.', 'Objem krychle: V = a · a · a.', `${a} · ${a} · ${a} = ?`],
    steps: [`V = a · a · a`, `V = ${a} · ${a} · ${a} = ${ans} cm³`],
  });
}
function k_kostky() {
  const a = ri(3, 6), b = ri(2, 5), c = ri(2, 4), ans = a * b * c;
  return N({
    text: `Krabice má vnitřní rozměry ${B(a + ' cm')}, ${B(b + ' cm')} a ${B(c + ' cm')}. Plní se kostičkami o hraně 1 cm.`, q: 'Kolik kostiček se do krabice vejde?', ans, unit: '', fig: kvadr(a, b, c, { a: a + ' cm', b: b + ' cm', c: c + ' cm' }),
    traps: [[a * b, 'To je jen jedna vrstva na dně. Kolik je vrstev?'], [a + b + c, 'Rozměry se násobí.']],
    hints: [`Na dno se vejde ${a} · ${b} kostiček.`, `Vrstev je ${c}.`, `${a} · ${b} · ${c} = ?`],
    steps: [`Jedna vrstva: ${a} · ${b} = ${a * b}`, `Vrstev: ${c}`, `${a * b} · ${c} = ${ans} kostiček`],
  });
}
function k_volba() {
  const [sit, ok] = pick([['Kolik vody se vejde do akvária?', 'objem'], ['Kolik skla je potřeba na stěny akvária?', 'povrch'], ['Kolik papíru je potřeba na polepení krabice?', 'povrch'], ['Kolik písku se vejde do pískoviště?', 'objem'], ['Kolik barvy je potřeba na natření bedny?', 'povrch'], ['Kolik hlíny se vejde do truhlíku?', 'objem']]);
  const V = 'objem (kolik se vejde dovnitř)', S = 'povrch (plocha všech stěn)';
  return C({
    text: sit, q: 'Co je potřeba spočítat?', opts: [V, S], ok: ok === 'objem' ? V : S,
    hints: ['Jde o to, co je uvnitř, nebo o to, co pokrývá stěny zvenku?', 'Voda, písek, hlína uvnitř → objem. Sklo, papír, barva na stěnách → povrch.', ok === 'objem' ? 'Tady jde o to, kolik se vejde dovnitř.' : 'Tady jde o stěny.'],
    steps: [ok === 'objem' ? 'Jde o to, kolik se vejde dovnitř, tedy objem.' : 'Jde o plochu stěn, tedy povrch.'],
  });
}
function k_akvLitry() {
  const a = pick([40, 50, 60, 80]), b = pick([25, 30, 35]), c = pick([30, 35, 40, 45]), V = a * b * c, ans = V / 1000;
  return N({
    text: `Akvárium má rozměry ${B(a + ' cm')} × ${B(b + ' cm')} × ${B(c + ' cm')}.`, q: 'Kolik litrů vody pojme, když je plné po okraj?', ans, unit: 'l', fig: kvadr(a, b, c, { a: a + ' cm', b: b + ' cm', c: c + ' cm' }),
    traps: [[V, 'To jsou cm³. 1 l = 1 000 cm³.'], [V / 100, '1 l = 1 dm³ = 1 000 cm³, ne 100.']],
    hints: ['Spočítej objem v cm³ a převeď na litry.', `${a} · ${b} · ${c} = ${V} cm³, 1 l = 1 000 cm³`],
    steps: [`V = ${a} · ${b} · ${c} = ${V} cm³`, `${V} cm³ = ${cz(ans)} l`],
  });
}
function k_hladina() {
  const a = pick([40, 50, 60]), b = pick([25, 30, 40]), h = ri(12, 30), c = h + ri(5, 15), V = rd(a * b * h / 1000, 3);
  return N({
    text: `Dno akvária měří ${B(a + ' cm')} × ${B(b + ' cm')}, akvárium je ${c} cm vysoké. Nalije se do něj ${B(cz(V) + ' l')} vody.`, q: 'Do jaké výšky (v cm) sahá voda?', ans: h, unit: 'cm', fig: kvadr(a, b, c, { a: a + ' cm', b: b + ' cm', c: c + ' cm' }, { hladina: h }),
    traps: [[rd(V / (a * b), 6), 'Nejdřív převeď litry na cm³ (1 l = 1 000 cm³).'], [c, 'Akvárium není plné. Výška vody vyjde z objemu vody.']],
    hints: ['Objem vody = obsah dna · výška vody. Výšku zjistíš dělením.', `${cz(V)} l = ${cz(V * 1000)} cm³, obsah dna ${a} · ${b} = ${a * b} cm²`],
    steps: [`${cz(V)} l = ${cz(V * 1000)} cm³`, `Dno: ${a} · ${b} = ${a * b} cm²`, `${cz(V * 1000)} : ${a * b} = ${h} cm`],
  });
}
function k_bezVika() {
  const a = pick([30, 40, 50]), b = pick([20, 25, 30].filter(x => x < a)), c = pick([10, 15, 20]), ans = a * b + 2 * a * c + 2 * b * c;
  return N({
    text: `Krabice bez víka má rozměry ${B(a + ' cm')} × ${B(b + ' cm')} a výšku ${B(c + ' cm')}. Zvenku se celá polepí papírem.`, q: 'Kolik cm² papíru je potřeba?', ans, unit: 'cm²', fig: kvadr(a, b, c, { a: a + ' cm', b: b + ' cm', c: c + ' cm' }),
    traps: [[2 * (a * b + a * c + b * c), 'Krabice nemá víko. Horní stěnu nepočítej.'], [a * b * c, 'To je objem. Papír pokrývá stěny, počítej povrch.']],
    hints: ['Sečti dno a čtyři boční stěny (dvě a · c a dvě b · c). Víko chybí.', `${a} · ${b} + 2 · ${a} · ${c} + 2 · ${b} · ${c}`],
    steps: [`Dno: ${a} · ${b} = ${a * b}`, `Boky: 2 · ${a} · ${c} + 2 · ${b} · ${c} = ${2 * a * c + 2 * b * c}`, `Celkem ${ans} cm²`],
  });
}
function k_hrana() {
  const a = ri(2, 10), V = a ** 3;
  return N({
    text: `Kostka ledu má tvar krychle a objem ${B(V + ' cm³')}.`, q: 'Jak dlouhá je její hrana?', ans: a, unit: 'cm', fig: kvadr(a, a, a, { a: '?', b: '', c: '' }),
    traps: [[rd(V / 3, 4), 'Objem krychle není 3 · a, ale a · a · a.'], [rd(V / 6, 4), 'Objem krychle je a · a · a.']],
    hints: ['Hledáš číslo, které vynásobené samo se sebou třikrát dá objem.', `Zkoušej: 2 · 2 · 2 = 8, 3 · 3 · 3 = 27, 4 · 4 · 4 = 64…`],
    steps: [`${a} · ${a} · ${a} = ${V}`, `Hrana měří ${a} cm.`],
  });
}
function k_bazen() {
  const a = ri(6, 12), b = ri(3, 5), h = pick([1, 1.2, 1.5, 2]), V = rd(a * b * h, 3), ans = rd(V * 10, 2);
  return N({
    text: `Zahradní bazén má tvar kvádru ${B(a + ' m')} × ${B(b + ' m')} a hloubku ${B(cz(h) + ' m')}.`, q: 'Kolik hektolitrů vody pojme?', ans, unit: 'hl', fig: kvadr(a, b, h, { a: a + ' m', b: b + ' m', c: cz(h) + ' m' }),
    traps: [[V, 'To jsou m³. 1 m³ = 10 hl.'], [rd(V * 1000, 2), 'To jsou litry. 1 hl = 100 l.']],
    hints: ['Spočítej objem v m³ a převeď: 1 m³ = 1 000 l = 10 hl.', `${a} · ${b} · ${cz(h)} = ${cz(V)} m³`],
    steps: [`V = ${a} · ${b} · ${cz(h)} = ${cz(V)} m³`, `${cz(V)} m³ = ${cz(V * 1000)} l = ${cz(ans)} hl`],
  });
}
function k_napousteni() {
  let a, b, h, r, min; do { a = ri(8, 12); b = ri(4, 6); h = pick([1.2, 1.4, 1.5]); r = pick([20, 25, 40, 50]); min = a * b * h * 1000 / r; } while (Math.abs(min / 60 - Math.round(min / 60)) > 1e-9);
  const H = rd(h + pick([0.2, 0.3]), 1);
  return N({
    text: `Bazén ${a} m × ${b} m je hluboký ${cz(H)} m. Napouští se do výšky ${cz(h)} m hadicí, která za minutu pustí ${r} l vody.`, q: 'Jak dlouho bude napouštění trvat?', ans: rd(min / 60, 3), unit: 'h', units: true,
    traps: [[min, 'To jsou minuty. Převeď na hodiny.'], [rd(a * b * H * 1000 / r / 60, 3), `Napouští se jen do výšky ${cz(h)} m, ne po okraj.`]],
    hints: [`Objem vody počítej s výškou ${cz(h)} m, převeď na litry a vyděl ${r} l za minutu.`],
    steps: [`V = ${a} · ${b} · ${cz(h)} = ${cz(a * b * h)} m³ = ${cz(a * b * h * 1000)} l`, `${cz(a * b * h * 1000)} : ${r} = ${cz(min)} min`, `${cz(min)} min = ${cz(min / 60)} h`],
  });
}
function k_pisek() {
  const a = pick([60, 80, 100]), b = pick([30, 35, 40]), c = pick([40, 45, 50]), s = pick([4, 5, 6]), w = pick([3, 5]), v = c - s - w, ans = rd(a * b * v / 1000, 3);
  return N({
    text: `Akvárium ${a} cm × ${b} cm je vysoké ${c} cm. Na dně je ${s} cm písku a voda sahá ${w} cm pod horní okraj. Ve vodě plave 12 rybek.`, q: 'Kolik litrů vody je v akváriu?', ans, unit: 'l', units: true,
    traps: [[rd(a * b * c / 1000, 3), 'Voda nesahá od dna po okraj. Odečti písek i volné místo nahoře.'], [rd(a * b * (c - s) / 1000, 3), `Voda je ${w} cm pod okrajem.`], [a * b * v, 'To jsou cm³. Převeď na litry.']],
    hints: [`Výška vody = ${c} − ${s} − ${w}. Rybky se neptají.`],
    steps: [`Výška vody: ${c} − ${s} − ${w} = ${v} cm`, `V = ${a} · ${b} · ${v} = ${a * b * v} cm³`, `${a * b * v} cm³ = ${cz(ans)} l`],
  });
}
function k_plech() {
  const a = pick([1.2, 1.5, 2]), b = pick([0.6, 0.8, 1]), c = pick([0.5, 0.4, 0.6]), m2 = rd(a * b + 2 * a * c + 2 * b * c, 4), ans = rd(m2 * 100, 2);
  return N({
    text: `Nádrž na vodu bez víka má tvar kvádru ${cz(a)} m × ${cz(b)} m a je ${cz(c)} m vysoká. Svaří se z plechu.`, q: 'Kolik dm² plechu je potřeba?', ans, unit: 'dm²', units: true,
    traps: [[m2, 'To jsou m². 1 m² = 100 dm².'], [rd((2 * (a * b + a * c + b * c)) * 100, 2), 'Nádrž nemá víko.']],
    hints: ['Povrch bez víka: dno a čtyři boky. Výsledek převeď na dm² (1 m² = 100 dm²).'],
    steps: [`${cz(a)} · ${cz(b)} + 2 · ${cz(a)} · ${cz(c)} + 2 · ${cz(b)} · ${cz(c)} = ${cz(m2)} m²`, `${cz(m2)} m² = ${cz(ans)} dm²`],
  });
}
function k_kostkyHrana() {
  let A, B2, Cc, e, ans, obj; do { e = pick([2, 3, 4]); A = ri(10, 20); B2 = ri(8, 16); Cc = ri(6, 12); ans = Math.floor(A / e) * Math.floor(B2 / e) * Math.floor(Cc / e); obj = Math.floor(A * B2 * Cc / e ** 3); } while (ans === obj);
  return N({
    text: `Do krabice s vnitřními rozměry ${A} cm × ${B2} cm × ${Cc} cm se skládají krychle s hranou ${e} cm. Krychle se nesmí řezat.`, q: 'Kolik krychlí se do krabice vejde nejvíc?', ans, unit: '',
    traps: [[obj, 'Objem nestačí vydělit: krychle se nesmí řezat, takže u každé strany zbude kus místa. Počítej po stranách.']],
    hints: [`Kolik krychlí se vejde podél každé strany? (${A} : ${e}, ${B2} : ${e}, ${Cc} : ${e}, jen celé.)`],
    steps: [`${A} : ${e} → ${Math.floor(A / e)}, ${B2} : ${e} → ${Math.floor(B2 / e)}, ${Cc} : ${e} → ${Math.floor(Cc / e)}`, `${Math.floor(A / e)} · ${Math.floor(B2 / e)} · ${Math.floor(Cc / e)} = ${ans}`],
  });
}

export const R6 = { rocnik: 6, temata: [
  { id: '601', nazev: 'Nákupy a ceny', ikona: 'Kč', popis: 'Desetinná čísla v obchodě: kolik zaplatím, kolik zbyde, co je výhodnější', strazce: 'Pokladník', svet: 'trh',
    vyklad: [
      { h: 'Jak na slovní úlohu', t: 'Ve škole se slovní úloha řeší vždy stejně:<br><br>1. <b>Přečti</b> celé zadání, klidně dvakrát.<br>2. <b>Co vím:</b> vypiš čísla a k nim, co znamenají.<br>3. <b>Co hledám:</b> na co se úloha ptá.<br>4. <b>Výpočet:</b> rozhodni, jakým počítáním se k výsledku dostaneš.<br>5. <b>Odpověď</b> celou větou a s jednotkou. Zkontroluj, jestli dává smysl.' },
      { h: 'Sčítat, odčítat, násobit, nebo dělit?', t: '<b>Dohromady</b>, přibude → sčítám.<br><b>Zbyde</b>, ubyde, o kolik víc → odčítám.<br><b>Stejná cena několikrát</b> → násobím.<br><b>Rozdělit na stejné díly</b>, kolik stojí jeden → dělím.<br><br>Příklad: 4 rohlíky po 3,50 Kč. Platím 3,50 Kč čtyřikrát: 3,50 · 4 = 14 Kč.' },
      { h: 'Peníze a desetinná čísla', t: 'Koruna má 100 haléřů, proto se ceny píšou se <b>dvěma desetinnými místy</b>: 3,50 Kč jsou 3 koruny a 50 haléřů.<br><br>Při sčítání a odčítání pod sebou dej <b>desetinné čárky pod sebe</b>.' },
      { h: 'Odhad a zkouška', t: 'Než začneš počítat, odhadni výsledek. 4 rohlíky po 3,50 Kč budou stát kolem 14 Kč, ne 140 Kč.<br><br>Na konci ověř, že výsledek dává smysl: jeden kus musí stát méně než celé balení a zbytek nesmí být víc, než kolik máš.' },
    ],
    u: [[n_vic, n_jeden, n_dohromady, n_zbyde, n_operace], [n_dvaDruhy, n_vraceni, n_obracena, n_kila, n_vyhodnejsi], [n_vylet, n_kolikNejvic, n_zaKilo, n_akce]],
    rychle: [n_vic, n_jeden, n_dohromady, n_zbyde] },
  { id: '602', nazev: 'Jednotky v praxi', ikona: 'm', popis: 'Délka, hmotnost, objem a čas na výpravě: převody a výpočty', strazce: 'Navigátor', svet: 'expedice',
    vyklad: [
      { h: 'Proč převádět', t: 'Na výpravě se měří všechno: délka trasy, hmotnost batohu, voda v láhvi, čas pochodu. Údaje bývají v různých jednotkách a <b>sčítat nebo porovnávat jde jen stejné jednotky</b>. Proto se nejdřív převádí.' },
      { h: 'Menší jednotka = větší číslo', t: '1 km = 1 000 m, 1 m = 100 cm, 1 cm = 10 mm.<br>1 kg = 1 000 g, 1 l = 1 000 ml.<br><br>Na <b>menší</b> jednotku se <b>násobí</b> (3 km = 3 000 m), na <b>větší</b> se <b>dělí</b> (500 g = 0,5 kg).' },
      { h: 'Čas je jiný', t: 'Hodina nemá 100 minut, ale <b>60</b>. Proto 1,5 h = 90 min a 2 h 30 min = 150 min.<br><br>Délku cesty od 8:45 do 11:20 počítej po částech: 8:45 → 9:00 je 15 min, 9:00 → 11:00 jsou 2 h, 11:00 → 11:20 je 20 min. Celkem 155 min.' },
      { h: 'Kontrola rozumem', t: 'Po převodu se zeptej: dává to smysl? Batoh nemůže vážit 8 000 kg a trasa nemůže měřit 0,003 m. Když vyjde nesmysl, nejspíš se místo dělení násobilo (nebo naopak).' },
    ],
    u: [[j_delka, j_hmotnost, j_cas, j_objem, j_jednotka], [j_soucet, j_lahve, j_doba, j_misky, j_kroky], [j_trasa, j_voda, j_vlak, j_vlocky]],
    rychle: [j_delka, j_hmotnost, j_cas, j_objem] },
  { id: '603', nazev: 'Dělitelnost v praxi', ikona: '÷', popis: 'Kdy se spoje zase potkají, jak rozdělit beze zbytku, kolik vagónů je potřeba', strazce: 'Výpravčí', svet: 'nadrazi',
    vyklad: [
      { h: 'Násobek a dělitel', t: '<b>Násobky</b> čísla 6 jsou 6, 12, 18, 24… (6 · 1, 6 · 2, 6 · 3…).<br><b>Dělitelé</b> čísla 12 jsou čísla, kterými jde 12 vydělit beze zbytku: 1, 2, 3, 4, 6, 12.' },
      { h: 'Kdy se spoje potkají', t: 'Autobus A jezdí každých 6 minut, autobus B každých 8 minut. Odjezdy A: 6, 12, 18, <b>24</b>… Odjezdy B: 8, 16, <b>24</b>… Poprvé se potkají za <b>24 minut</b>. To je <b>nejmenší společný násobek</b>, píše se n(6, 8) = 24.' },
      { h: 'Rozdělit beze zbytku', t: 'Je 12 jablek a 18 hrušek a má se udělat co nejvíc stejných balíčků. Počet balíčků musí dělit 12 i 18. Společní dělitelé: 1, 2, 3, <b>6</b>. Nejvíc je <b>6 balíčků</b> (v každém 2 jablka a 3 hrušky). To je <b>největší společný dělitel</b>, píše se D(12, 18) = 6.' },
      { h: 'Zbytek: nahoru, nebo dolů?', t: '50 lidí, do vagónu se vejde 12: 50 : 12 = 4, zbytek 2. Ti dva musí také jet, takže vagóny jsou <b>5</b> (nahoru). Ale celých balíčků po 12 kusech je z 50 kusů jen <b>4</b> (dolů). Vždy se ptej, co dává smysl.' },
    ],
    u: [[d_spolu, d_balicky, d_vagony, d_delitelne, d_odjezdy], [d_tri, d_kdy, d_dlazdice, d_druzstva, d_skupiny], [d_triVlaky, d_kytice, d_kola, d_skrinky]],
    rychle: [d_spolu, d_balicky, d_vagony, d_odjezdy] },
  { id: '604', nazev: 'Obvod a obsah v praxi', ikona: '▭', popis: 'Plot, trávník, dlaždice, koberec: kdy obvod a kdy obsah', strazce: 'Stavbyvedoucí', svet: 'plan',
    vyklad: [
      { h: 'Obvod: kolem dokola', t: '<b>Obvod</b> je délka čáry kolem celého útvaru. Počítá se, když se něco táhne podél okraje: plot, lišta, obrubník.<br><br>Obdélník: <b>o = 2 · (a + b)</b>. Čtverec: <b>o = 4 · a</b>.', fig: () => obdelnik(6, 4, '6 m', '4 m', { plot: true }) },
      { h: 'Obsah: celá plocha', t: '<b>Obsah</b> říká, kolik čtverečků 1 × 1 se vejde dovnitř. Počítá se, když se něco pokrývá: koberec, tráva, dlaždice, barva.<br><br>Obdélník: <b>S = a · b</b>. Čtverec: <b>S = a · a</b>. Jednotky: m², cm².', fig: () => obdelnik(5, 3, '5 m', '3 m', { dlazdice: true }) },
      { h: 'Složené útvary', t: 'Útvar ve tvaru L spočítáš jako velký obdélník, od kterého se odečte chybějící roh. Okno ve stěně, která se maluje, se také odečítá.', fig: () => lTvar(8, 6, 3, 2, { a: '8 m', b: '6 m', c: '3 m', d: '2 m' }) },
      { h: 'Jednotky obsahu', t: '1 m² = 100 dm² = 10 000 cm².<br>1 a (ar) = 100 m², 1 ha (hektar) = 10 000 m².<br><br>Když jsou rozměry v různých jednotkách (m a cm), nejdřív je převeď na stejnou jednotku.' },
    ],
    u: [[o_plot, o_travnik, o_strana, o_dlazdice, o_co], [o_stena, o_branka, o_druha, o_lko, o_cena], [o_ary, o_listy, o_obklad, o_ctverecS]],
    rychle: [o_plot, o_travnik, o_strana, o_dlazdice] },
  { id: '605', nazev: 'Krychle a kvádr v praxi', ikona: '▣', popis: 'Akvárium, bazén, krabice: objem, litry a povrch', strazce: 'Vodník', svet: 'akvarium',
    vyklad: [
      { h: 'Objem: kolik se vejde dovnitř', t: 'Objem kvádru: <b>V = a · b · c</b> (délka · šířka · výška). Objem krychle: <b>V = a · a · a</b>.<br>Objem se měří v krychlových jednotkách: cm³, dm³, m³.', fig: () => kvadr(5, 3, 2, { a: 'a', b: 'b', c: 'c' }) },
      { h: 'Litry a krychlové jednotky', t: '<b>1 dm³ = 1 l</b> (krychle s hranou 10 cm pojme přesně litr).<br><b>1 cm³ = 1 ml</b>, <b>1 m³ = 1 000 l = 10 hl</b>.<br><br>Akvárium 50 cm × 30 cm × 40 cm má objem 60 000 cm³ = 60 dm³ = 60 l.' },
      { h: 'Povrch: plocha všech stěn', t: 'Kvádr má 6 stěn, vždy dvě stejné. Povrch: <b>S = 2 · (ab + ac + bc)</b>.<br>Krabice bez víka má jen 5 stěn: dno a čtyři boky.' },
      { h: 'Výška hladiny', t: 'Když znáš objem vody a dno nádoby, výšku hladiny zjistíš dělením: výška = objem : obsah dna. Pozor na jednotky: litry nejdřív převeď na cm³ (1 l = 1 000 cm³).', fig: () => kvadr(5, 3, 4, { a: '50 cm', b: '30 cm', c: '40 cm' }, { hladina: 2.5 }) },
    ],
    u: [[k_objem, k_litry, k_krychle, k_kostky, k_volba], [k_akvLitry, k_hladina, k_bezVika, k_hrana, k_bazen], [k_napousteni, k_pisek, k_plech, k_kostkyHrana]],
    rychle: [k_objem, k_litry, k_krychle, k_kostky] },
] };
