// 6. ročník: desetinná čísla v praxi, dělitelnost, obvod a obsah, objem kvádru.
import { ri, pick, rstep, cz, czf, rd, b as B } from './util.js';
import { N, C } from './ulohy.js';

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

export const R6 = { rocnik: 6, temata: [
  { id: '601', nazev: 'Nákupy a ceny', ikona: 'Kč', popis: 'Desetinná čísla v obchodě: kolik zaplatím, kolik zbyde, co je výhodnější', strazce: 'Pokladník',
    vyklad: [
      { h: 'Jak na slovní úlohu', t: 'Ve škole se slovní úloha řeší vždy stejně:<br><br>1. <b>Přečti</b> celé zadání, klidně dvakrát.<br>2. <b>Co vím:</b> vypiš čísla a k nim, co znamenají.<br>3. <b>Co hledám:</b> na co se úloha ptá.<br>4. <b>Výpočet:</b> rozhodni, jakým počítáním se k výsledku dostaneš.<br>5. <b>Odpověď</b> celou větou a s jednotkou. Zkontroluj, jestli dává smysl.' },
      { h: 'Sčítat, odčítat, násobit, nebo dělit?', t: '<b>Dohromady</b>, přibude → sčítám.<br><b>Zbyde</b>, ubyde, o kolik víc → odčítám.<br><b>Stejná cena několikrát</b> → násobím.<br><b>Rozdělit na stejné díly</b>, kolik stojí jeden → dělím.<br><br>Příklad: 4 rohlíky po 3,50 Kč. Platím 3,50 Kč čtyřikrát: 3,50 · 4 = 14 Kč.' },
      { h: 'Peníze a desetinná čísla', t: 'Koruna má 100 haléřů, proto se ceny píšou se <b>dvěma desetinnými místy</b>: 3,50 Kč jsou 3 koruny a 50 haléřů.<br><br>Při sčítání a odčítání pod sebou dej <b>desetinné čárky pod sebe</b>.' },
      { h: 'Odhad a zkouška', t: 'Než začneš počítat, odhadni výsledek. 4 rohlíky po 3,50 Kč budou stát kolem 14 Kč, ne 140 Kč.<br><br>Na konci ověř, že výsledek dává smysl: jeden kus musí stát méně než celé balení a zbytek nesmí být víc, než kolik máš.' },
    ],
    u: [[n_vic, n_jeden, n_dohromady, n_zbyde, n_operace], [n_dvaDruhy, n_vraceni, n_obracena, n_kila, n_vyhodnejsi], [n_vylet, n_kolikNejvic, n_zaKilo, n_akce]],
    rychle: [n_vic, n_jeden, n_dohromady, n_zbyde] },
] };
