// 7. ročník: zlomky, poměr, přímá a nepřímá úměrnost, procenta, procenta v obchodě, celá čísla.
import { ri, pick, chance, rstep, cz, rd, b as B } from './util.js';
import { N, C } from './ulohy.js';
import { tv, kc, kc0, hm, gcd, lcm, zl, zlk, pc, zn, st } from './cesky.js';

const SLOVA = { // [1, 2–4, 5+]
  dilek: ['dílek', 'dílky', 'dílků'], kolac: ['koláč', 'koláče', 'koláčů'], vetrnik: ['větrník', 'větrníky', 'větrníků'], kobliha: ['kobliha', 'koblihy', 'koblih'],
  bonbon: ['bonbon', 'bonbony', 'bonbonů'], venecek: ['věneček', 'věnečky', 'věnečků'], dort: ['dort', 'dorty', 'dortů'], muffin: ['muffin', 'muffiny', 'muffinů'],
};
const sl = (n, k) => n + ' ' + tv(n, ...SLOVA[k]);
// sloveso podle čitatele: prodala se 1/2, prodaly se 2/3, prodalo se 5/6
const prod = (a, kap) => (kap ? 'P' : 'p') + (a === 1 ? 'rodala' : a <= 4 ? 'rodaly' : 'rodalo');
const ZLOMKY = [[1, 2, 'polovina'], [1, 3, 'třetina'], [1, 4, 'čtvrtina'], [2, 3, null], [3, 4, null], [2, 5, null], [3, 5, null], [3, 8, null], [5, 6, null]];

// ======================= 701 ZLOMKY V PŘÍBĚHU (Cukrárna) =======================
function z_cast() {
  const [a, b] = pick(ZLOMKY), k = pick(['dilek', 'kolac', 'vetrnik', 'muffin']), n = b * ri(2, 6), ans = n / b * a;
  return N({
    text: `V cukrárně je ${B(sl(n, k))}. ${prod(a, 1)} se ${B(zl(a, b))} z nich.`, q: 'Kolik kusů se prodalo?', ans, unit: '',
    traps: [[n * a, `Nejdřív zjisti jeden díl: ${n} : ${b}. Pak vynásob ${a}.`], [n / b, `To je jen ${zl(1, b)}. Prodaly se ${zl(a, b)}, tedy ${a} takové díly.`], [n - ans, 'Tolik kusů zbylo. Ptám se, kolik se prodalo.']],
    hints: [`Víš, kolik je všech kusů (${n}). Hledáš ${zl(a, b)} z nich.`, `Jmenovatel ${b} říká, na kolik stejných dílů se celek rozdělí. Čitatel ${a} říká, kolik dílů vezmeš.`, `${n} : ${b} = ${n / b}, pak ${n / b} · ${a} = ?`],
    steps: [`Jeden díl (${zl(1, b)}): ${n} : ${b} = ${n / b}`, `${zl(a, b)}: ${n / b} · ${a} = ${ans}`, `Odpověď: Prodalo se ${ans} kusů.`.replace(`${ans} kusů`, `${ans} ${tv(ans, 'kus', 'kusy', 'kusů')}`)],
  });
}
function z_zbytek() {
  const [a, b] = pick(ZLOMKY.filter(z => z[0] < z[1])), k = pick(['kobliha', 'kolac', 'venecek']), n = b * ri(3, 8), snez = n / b * a, ans = n - snez;
  return N({
    text: `Ráno bylo na pultu ${B(sl(n, k))}. Do poledne se ${prod(a)} ${B(zl(a, b))} z nich.`, q: 'Kolik kusů zbylo?', ans, unit: '',
    traps: [[snez, 'Tolik se prodalo. Ptám se, kolik zbylo.'], [n - a, `Neodčítej čitatel. Nejdřív spočítej, kolik je ${zl(a, b)} z ${n}.`]],
    hints: ['Nejdřív zjisti, kolik kusů se prodalo, a pak je odečti od všech.', `${zl(a, b)} z ${n}: ${n} : ${b} · ${a}`, `${n} − ${snez} = ?`],
    steps: [`Prodalo se: ${n} : ${b} · ${a} = ${snez}`, `Zbylo: ${n} − ${snez} = ${ans}`, `Jinak: zbyly ${zl(b - a, b)}, ${n} : ${b} · ${b - a} = ${ans}`],
  });
}
function z_celek() {
  const [a, b] = pick(ZLOMKY.filter(z => z[0] > 1 || z[1] > 2)), dil = ri(2, 6), cast = dil * a, ans = dil * b;
  return N({
    text: `${B(zl(a, b))} dortu je ${B(sl(cast, 'dilek'))}. Všechny dílky jsou stejně velké.`, q: 'Kolik dílků má celý dort?', ans, unit: '',
    traps: [[cast * b, `Nejdřív zjisti, kolik dílků je ${zl(1, b)}: ${cast} : ${a}.`], [cast / a, `To je ${zl(1, b)} dortu. Celý dort má ${b} takové díly.`]],
    hints: [`Víš, kolik dílků je ${zl(a, b)} dortu. Hledáš celý dort, to je ${zl(b, b)}.`, `Když ${a} díly jsou ${cast} dílků, jeden díl (${zl(1, b)}) je ${cast} : ${a}.`, `${cast} : ${a} = ${dil}, celý dort: ${dil} · ${b} = ?`],
    steps: [`${zl(1, b)} dortu: ${cast} : ${a} = ${dil}`, `Celý dort: ${dil} · ${b} = ${ans}`, `Odpověď: Celý dort má ${ans} dílků.`],
  });
}
function z_jakaCast() {
  const n = pick([6, 8, 10, 12]), s = ri(1, n - 1), ok = zlk(s, n), bad = [zlk(n - s, n), zl(s, n - s), zl(n, s)].filter(x => x !== ok);
  return C({
    text: `Dort je rozkrájený na ${B(sl(n, 'dilek'))}. Snědlo se ${B(sl(s, 'dilek'))}.`, q: 'Jaká část dortu se snědla?', ok, bad: [...new Set(bad)],
    hints: ['Zlomek: dole (jmenovatel) je, na kolik dílů je celek rozdělený, nahoře (čitatel) kolik dílů se vzalo.', `Celek má ${n} dílů, vzalo se ${s}.`, gcd(s, n) > 1 ? `${zl(s, n)} jde zkrátit číslem ${gcd(s, n)}.` : `Zlomek je ${zl(s, n)}.`],
    steps: [`Snědlo se ${s} z ${n} dílků: ${zl(s, n)}`, ...(gcd(s, n) > 1 ? [`Po zkrácení: ${ok}`] : [])],
  });
}
function z_kdoVic() {
  const [[j1, s1], [j2, s2]] = [pick([['Ema', 'snědla'], ['Klára', 'snědla'], ['Petra', 'snědla']]), pick([['Tomáš', 'snědl'], ['Ondra', 'snědl'], ['Jakub', 'snědl']])];
  let a, b, c, d; do { b = pick([4, 5, 6, 8, 10]); d = pick([2, 3, 4, 5, 6, 8, 10, 12].filter(x => x !== b)); a = ri(1, b - 1); c = ri(1, d - 1); } while (a * d === b * c || gcd(a, b) > 1 || gcd(c, d) > 1);
  const ok = a * d > b * c ? j1 : j2;
  return C({
    text: `Ze dvou stejných pizz ${s1} ${j1} ${B(zl(a, b))} jedné pizzy a ${j2} ${s2} ${B(zl(c, d))} druhé pizzy.`, q: 'Kdo snědl víc?', opts: [j1, j2, 'oba stejně'], ok,
    hints: ['Zlomky porovnáš, když je převedeš na stejného jmenovatele.', `Společný jmenovatel ${lcm(b, d)}: ${zl(a, b)} = ${zl(a * lcm(b, d) / b, lcm(b, d))}, ${zl(c, d)} = ${zl(c * lcm(b, d) / d, lcm(b, d))}.`, 'Větší čitatel = větší část.'],
    steps: [`${zl(a, b)} = ${zl(a * lcm(b, d) / b, lcm(b, d))}`, `${zl(c, d)} = ${zl(c * lcm(b, d) / d, lcm(b, d))}`, `Víc snědl${ok === j1 ? 'a' : ''} ${ok}.`],
  });
}
function z_dvaKroky() {
  const n = pick([24, 30, 36, 48, 60]), [a, b] = pick([[1, 3], [1, 4], [1, 2], [2, 3]].filter(([x, y]) => n % y === 0)), zb = n - n / b * a, [c, d] = pick([[1, 2], [1, 3], [1, 4], [3, 4]].filter(([x, y]) => zb % y === 0)), ans = zb - zb / d * c;
  return N({
    text: `Na pultu bylo ${B(sl(n, 'kolac'))}. Ráno se ${prod(a)} ${B(zl(a, b))} všech koláčů, odpoledne ${B(zl(c, d))} zbytku.`, q: 'Kolik koláčů zbylo večer?', ans, unit: '',
    traps: [[n - n / b * a - n / d * c, `Odpoledne se prodávalo ze zbytku (${zb}), ne ze všech ${n} koláčů.`], [zb, 'Tolik zbylo po ránu. Ještě odečti odpolední prodej.']],
    hints: ['Nejdřív spočítej, kolik zbylo po ránu. Odpolední zlomek se počítá z tohoto zbytku.', `Po ránu: ${n} − ${n / b * a} = ${zb}. Odpoledne: ${zl(c, d)} z ${zb}.`],
    steps: [`Ráno: ${zl(a, b)} z ${n} = ${n / b * a}, zbylo ${zb}`, `Odpoledne: ${zl(c, d)} z ${zb} = ${zb / d * c}`, `Večer zbylo: ${zb} − ${zb / d * c} = ${ans}`],
  });
}
function z_soucet() {
  const [[a, b], [c, d]] = pick([[[1, 4], [1, 3]], [[1, 2], [1, 3]], [[1, 3], [1, 6]], [[1, 4], [1, 6]], [[2, 5], [1, 4]], [[1, 2], [1, 5]]]), m = lcm(b, d), s = a * m / b + c * m / d, z = m - s;
  const ok = zlk(z, m), bad = [...new Set([zlk(s, m), zl(b + d - a - c, b + d), zl(a + c, b + d), zlk(Math.abs(z - 1), m)])].filter(x => x !== ok).slice(0, 3);
  return C({
    text: `Ráno se snědla ${B(zl(a, b))} dortu, odpoledne ${B(zl(c, d))} dortu.`, q: 'Jaká část dortu zbyla?', ok, bad,
    hints: [`Zlomky sečti přes společného jmenovatele ${m}. Celý dort je ${zl(m, m)}.`, `${zl(a, b)} + ${zl(c, d)} = ${zl(a * m / b, m)} + ${zl(c * m / d, m)} = ${zl(s, m)}`],
    steps: [`Snědlo se: ${zl(a * m / b, m)} + ${zl(c * m / d, m)} = ${zl(s, m)}`, `Zbylo: ${zl(m, m)} − ${zl(s, m)} = ${zl(z, m)}${gcd(z, m) > 1 ? ` = ${ok}` : ''}`],
  });
}
function z_cena() {
  const [a, b] = pick([[3, 8], [1, 4], [3, 4], [2, 3], [5, 6], [1, 6]]), cena = b * rstep(40, 120, 5), ans = cena / b * a;
  return N({
    text: `Celý dort stojí ${B(kc(cena))}. Prodává se i po částech.`, q: `Kolik stojí ${zl(a, b)} dortu?`, ans, unit: 'Kč',
    traps: [[cena * a, `Nejdřív spočítej cenu ${zl(1, b)} dortu: ${cena} : ${b}.`], [cena / b, `To je cena jen ${zl(1, b)}. Kupuješ ${a} takové díly.`]],
    hints: [`Cena ${zl(1, b)} dortu je ${cena} : ${b}.`, `${cena} : ${b} · ${a} = ?`],
    steps: [`${zl(1, b)}: ${cena} : ${b} = ${kc0(cena / b)}`, `${zl(a, b)}: ${kc0(cena / b)} · ${a} = ${kc(ans)}`],
  });
}
function z_celekZbytek() {
  const [a, b] = pick([[3, 5], [2, 3], [3, 4], [5, 8], [2, 5]]), dil = ri(2, 7), zb = dil * (b - a), ans = dil * b;
  return N({
    text: `Po prodeji ${B(zl(a, b))} všech věnečků zbylo v cukrárně ${B(sl(zb, 'venecek'))}.`, q: 'Kolik věnečků bylo na začátku?', ans, unit: '',
    traps: [[zb * b / a, `Zbytek není ${zl(a, b)}, ale ${zl(b - a, b)} všech věnečků.`], [zb + a, 'Ke zbytku nepřičítej čitatel. Zjisti, jakou část tvoří zbytek.']],
    hints: [`Zbylo ${zl(b - a, b)} všech věnečků (${zl(b, b)} − ${zl(a, b)}).`, `${zl(b - a, b)} je ${zb}, takže ${zl(1, b)} je ${zb} : ${b - a}.`],
    steps: [`Zbylo ${zl(b - a, b)} všech věnečků = ${zb}`, `${zl(1, b)}: ${zb} : ${b - a} = ${dil}`, `Všechny: ${dil} · ${b} = ${ans}`],
  });
}
function z_kolikDilku() {
  const d = pick([6, 8, 10, 12]), cele = ri(1, 3), pul = chance(0.5), ans = cele * d + (pul ? d / 2 : 0);
  return N({
    text: `Dort se krájí na stejné dílky, každý je ${B(zl(1, d))} dortu. Na stole ${pul ? 'je' : cele === 1 ? 'je' : 'jsou'} ${B(pul ? cele + ' a půl dortu' : cele + ' ' + tv(cele, 'dort', 'dorty', 'dortů'))}.`, q: 'Kolik dílků z toho bude?', ans, unit: '',
    traps: [[cele * d, pul ? 'Nezapomeň na půlku dortu.' : 'Zkontroluj násobení.'], [cele + d, 'Počet dortů a dílků v jednom dortu se násobí.']],
    hints: [`Jeden dort má ${d} dílků${pul ? `, půlka dortu ${d / 2}` : ''}.`, `${cele} · ${d}${pul ? ` + ${d / 2}` : ''} = ?`],
    steps: [`${cele} · ${d} = ${cele * d}`, ...(pul ? [`+ půlka: ${d / 2}`] : []), `Celkem ${ans} dílků`],
  });
}
function z_koblihy() {
  const n = pick([120, 160, 200, 240]), [a, b] = pick([[2, 5], [3, 8], [1, 4], [3, 10]].filter(([x, y]) => n % y === 0)), zb = n - n / b * a, moz = [[3, 4], [2, 3], [1, 2], [5, 6]].filter(([x, y]) => zb % y === 0);
  if (!moz.length) return z_koblihy();
  const [c, d] = pick(moz), ans = zb - zb / d * c;
  return N({
    text: `Pekárna upekla ${n} koblih. Dopoledne prodala ${zl(a, b)} z nich, odpoledne ${zl(c, d)} zbytku. Jedna kobliha stojí 14 Kč.`, q: 'Kolik koblih zbylo na večer?', ans, unit: '',
    traps: [[n - n / b * a - n / d * c, 'Odpoledne se prodávalo ze zbytku, ne ze všech koblih.'], [zb, 'Ještě odečti odpolední prodej.']],
    hints: ['Krok za krokem: zbytek po dopoledni, z něj odpolední prodej. Cena koblihy se neptá.'],
    steps: [`Dopoledne: ${n} : ${b} · ${a} = ${n / b * a}, zbylo ${zb}`, `Odpoledne: ${zb} : ${d} · ${c} = ${zb / d * c}`, `Večer: ${zb} − ${zb / d * c} = ${ans}`, 'Cena koblihy je zbytečný údaj.'],
  });
}
function z_rozpocet() {
  const [[a, b], [c, d]] = pick([[[3, 8], [1, 4]], [[1, 3], [1, 4]], [[2, 5], [1, 4]], [[1, 2], [1, 6]], [[1, 4], [1, 3]]]), m = lcm(b, d), zb = m - a * m / b - c * m / d, ans = pick([600, 900, 1200, 1500, 1800, 2400]) * m / zb;
  if (!Number.isInteger(ans)) return z_rozpocet();
  const zbytek = ans * zb / m;
  return N({
    text: `Z měsíčního rozpočtu cukrárny šly ${zl(a, b)} na mouku a ${zl(c, d)} na cukr. Zbylo ${cz(zbytek)} Kč.`, q: 'Jaký byl celý rozpočet?', ans, unit: 'Kč', units: true,
    traps: [[zbytek * b / a, 'Zbytek není část na mouku. Nejdřív zjisti, jaká část rozpočtu zbyla.'], [zbytek * 2, 'Spočítej přesně, jaká část rozpočtu zbyla.']],
    hints: [`Zbylo ${zl(m, m)} − ${zl(a * m / b, m)} − ${zl(c * m / d, m)} = ${zl(zb, m)} rozpočtu.`],
    steps: [`Utraceno: ${zl(a * m / b, m)} + ${zl(c * m / d, m)} = ${zl(m - zb, m)}`, `Zbylo ${zl(zb, m)} = ${cz(zbytek)} Kč`, `${zl(1, m)} = ${cz(zbytek / zb)} Kč, celý rozpočet = ${cz(ans)} Kč`],
  });
}
function z_hoste() {
  const d = pick([6, 8, 10, 12]), h = ri(15, 40), ans = Math.ceil(h / d);
  if (h % d === 0) return z_hoste();
  return N({
    text: `Na oslavu přijde ${h} hostů a každý dostane ${zl(1, d)} dortu. Jeden dort stojí ${rstep(350, 650, 10)} Kč.`, q: 'Kolik dortů je potřeba nejméně objednat?', ans, unit: '',
    traps: [[Math.floor(h / d), 'Na některé hosty by nezbyl dílek. Zaokrouhli nahoru.']],
    hints: [`Jeden dort stačí pro ${d} hostů. Cena se neptá.`],
    steps: [`${h} : ${d} = ${Math.floor(h / d)}, zbytek ${h % d}`, `Pro zbylé hosty je potřeba ještě jeden dort: ${ans}`],
  });
}

// ======================= 702 POMĚR (Kuchyně) =======================
const pm = (a, b, c) => [a, b, c].filter(x => x != null).join(' : ');
function p_redeni() {
  const a = 1, b = pick([3, 4, 5, 6, 7]), s = rstep(50, 250, 50), ans = s * b;
  return N({
    text: `Sirup se ředí vodou v poměru ${B(pm(a, b))} (1 díl sirupu na ${b} dílů vody). Do džbánu se nalije ${B(s + ' ml')} sirupu.`, q: 'Kolik ml vody je potřeba?', ans, unit: 'ml',
    traps: [[s / b, 'Vody je víc než sirupu. Násob.'], [s * (b + 1), 'Tolik bude celého nápoje. Ptám se jen na vodu.']],
    hints: [`Poměr ${pm(a, b)} znamená: na každý díl sirupu přijde ${b} dílů vody.`, `Jeden díl je ${s} ml.`, `${s} · ${b} = ?`],
    steps: [`1 díl = ${s} ml`, `Voda: ${b} dílů = ${s} · ${b} = ${ans} ml`],
  });
}
function p_rozdel() {
  const [a, b] = pick([[2, 1], [3, 1], [3, 2], [4, 1], [5, 3], [2, 3]]), d = rstep(50, 150, 25), cel = d * (a + b), ans = d * Math.max(a, b);
  return N({
    text: `Kuchař rozdělí ${B(cel + ' g')} těsta na dva bochníky v poměru ${B(pm(a, b))}.`, q: 'Kolik gramů bude mít větší bochník?', ans, unit: 'g',
    traps: [[cel / 2, 'Poměr není 1 : 1, bochníky nejsou stejné.'], [d * Math.min(a, b), 'To je menší bochník.'], [cel / Math.max(a, b), `Celek má ${a + b} dílů, ne ${Math.max(a, b)}.`]],
    hints: [`Poměr ${pm(a, b)} znamená, že se těsto rozdělí na ${a} + ${b} = ${a + b} stejných dílů.`, `Jeden díl: ${cel} : ${a + b}.`, `${cel} : ${a + b} = ${d}, větší bochník má ${Math.max(a, b)} díly: ${d} · ${Math.max(a, b)} = ?`],
    steps: [`Dílů: ${a} + ${b} = ${a + b}`, `1 díl: ${cel} : ${a + b} = ${d} g`, `Větší bochník: ${d} · ${Math.max(a, b)} = ${ans} g`],
  });
}
function p_porce() {
  const p1 = pick([2, 4]), k = pick([2, 3]), p2 = p1 * k, m = pick([['rýže', 'g', 75], ['těstovin', 'g', 100], ['mléka', 'ml', 150]]), q1 = m[2] * p1, ans = q1 * k;
  return N({
    text: `Recept na ${B(p1 + ' porce')} potřebuje ${B(q1 + ' ' + m[1])} ${m[0]}.`.replace('2 porce', '2 porce'), q: `Kolik ${m[1]} ${m[0]} je potřeba na ${p2} porcí?`, ans, unit: m[1],
    traps: [[q1 + p2 - p1, 'Porcí je víckrát víc, ne o pár víc. Násob.'], [q1 / k, 'Porcí je víc, surovin musí být víc.']],
    hints: [`Porcí bude ${k}krát víc (${p2} : ${p1} = ${k}).`, `Surovin musí být taky ${k}krát víc. Recept se zvětší v poměru ${pm(p2, p1)}.`, `${q1} · ${k} = ?`],
    steps: [`${p2} : ${p1} = ${k}`, `${q1} · ${k} = ${ans} ${m[1]}`],
  });
}
function p_mapa() {
  const m = pick([[50000, 0.5], [100000, 1], [200000, 2]]), d = ri(2, 9), ans = rd(d * m[1], 2);
  return N({
    text: `Mapa má měřítko ${B('1 : ' + cz(m[0]))}. Cesta k farmě měří na mapě ${B(d + ' cm')}.`, q: 'Kolik kilometrů měří cesta ve skutečnosti?', ans, unit: 'km',
    traps: [[d * m[0], 'To jsou centimetry. Převeď na kilometry: 1 km = 100 000 cm.'], [rd(d * m[0] / 100, 2), 'To jsou metry. Převeď na kilometry.']],
    hints: [`Měřítko 1 : ${cz(m[0])} znamená, že 1 cm na mapě je ${cz(m[0])} cm ve skutečnosti.`, `1 cm na mapě = ${cz(m[0])} cm = ${cz(m[1])} km.`, `${d} · ${cz(m[1])} km = ?`],
    steps: [`1 cm na mapě = ${cz(m[0])} cm = ${cz(m[1])} km`, `${d} cm na mapě = ${d} · ${cz(m[1])} = ${cz(ans)} km`],
  });
}
function p_zakladni() {
  const [x, y] = pick([[2, 3], [3, 4], [1, 3], [3, 5], [2, 5], [4, 3]]), k = ri(2, 4), a = x * k, b = y * k;
  const ok = pm(x, y), bad = [...new Set([pm(y, x), pm(a - x, b - y), pm(x, y + 1), pm(1, Math.round(b / a))])].filter(v => v !== ok && v !== pm(a, b)).slice(0, 3);
  return C({
    text: `Na sirup se dá ${B(a + ' lžic')} cukru a ${B(b + ' lžic')} vody.`, q: 'Jaký je poměr cukru a vody v základním tvaru (zkrácený)?', ok, bad,
    hints: ['Poměr zapisuj ve stejném pořadí, v jakém jsou věci v otázce: nejdřív cukr, pak voda.', `Poměr ${pm(a, b)} zkrať: vyděl obě čísla stejným číslem.`, `${a} i ${b} jsou dělitelné ${k}.`],
    steps: [`${pm(a, b)} = ${a} : ${k} : ${b} : ${k}`.replace(`${a} : ${k} : ${b} : ${k}`, `(${a} : ${k}) : (${b} : ${k})`), `= ${ok}`],
  });
}
function p_tri() {
  const [a, b, c] = pick([[2, 3, 4], [1, 2, 3], [3, 4, 5], [2, 3, 5], [1, 3, 4]]), d = rstep(50, 200, 50), cel = d * (a + b + c), ans = d * c;
  return N({
    text: `Tři kuchaři si rozdělí ${B(cz(cel) + ' Kč')} spropitného v poměru ${B(pm(a, b, c))} podle odpracovaných hodin.`, q: 'Kolik dostane ten, kdo pracoval nejdéle?', ans, unit: 'Kč',
    traps: [[cel / 3, 'Poměr není 1 : 1 : 1. Dílů je víc.'], [cel / c, `Celek má ${a + b + c} dílů.`]],
    hints: [`Dílů je ${a} + ${b} + ${c} = ${a + b + c}.`, `1 díl = ${cz(cel)} : ${a + b + c}, nejvíc dostane ${c} díly.`],
    steps: [`Dílů: ${a + b + c}`, `1 díl: ${cz(cel)} : ${a + b + c} = ${d} Kč`, `${c} díly: ${d} · ${c} = ${ans} Kč`],
  });
}
function p_obraceny() {
  const [a, b] = pick([[5, 2], [3, 2], [4, 3], [7, 3], [5, 4]]), d = rstep(40, 120, 20), napl = d * b, ans = d * a;
  return N({
    text: `Těsto a náplň jsou v koláči v poměru ${B(pm(a, b))}. Náplně je ${B(napl + ' g')}.`, q: 'Kolik gramů je těsta?', ans, unit: 'g',
    traps: [[napl * b / a, 'Těsta je víc než náplně. Zkontroluj, které číslo patří k čemu.'], [napl + a - b, 'Poměr říká počet dílů, ne o kolik gramů.']],
    hints: [`Náplň jsou ${b} díly, takže 1 díl = ${napl} : ${b}.`, `Těsto je ${a} dílů: ${napl} : ${b} · ${a}`],
    steps: [`1 díl: ${napl} : ${b} = ${d} g`, `Těsto: ${d} · ${a} = ${ans} g`],
  });
}
function p_rozdil() {
  const [a, b] = pick([[3, 1], [5, 2], [4, 1], [5, 3], [7, 4]]), d = rstep(50, 150, 25), rozdil = d * (a - b), ans = d * b;
  return N({
    text: `Mouky a cukru je v těstě v poměru ${B(pm(a, b))}. Mouky je o ${B(rozdil + ' g')} víc než cukru.`, q: 'Kolik gramů je cukru?', ans, unit: 'g',
    traps: [[d * a, 'To je mouka. Ptám se na cukr.'], [rozdil, `Rozdíl odpovídá ${a - b} dílům, ne cukru.`]],
    hints: [`Rozdíl ${rozdil} g je ${a} − ${b} = ${a - b} ${tv(a - b, 'díl', 'díly', 'dílů')}.`, `1 díl = ${rozdil} : ${a - b}, cukr je ${b} ${tv(b, 'díl', 'díly', 'dílů')}.`],
    steps: [`${a} − ${b} = ${a - b} ${tv(a - b, 'díl', 'díly', 'dílů')} = ${rozdil} g`, `1 díl = ${d} g`, `Cukr: ${d} · ${b} = ${ans} g`],
  });
}
function p_mapa2() {
  const m = pick([[100000, 1], [200000, 2], [50000, 0.5], [25000, 0.25]]), cm = ri(2, 8), km = rd(cm * m[1], 2);
  return N({
    text: `Mezi dvěma vesnicemi je ve skutečnosti ${B(cz(km) + ' km')}. Kreslí se na mapu s měřítkem ${B('1 : ' + cz(m[0]))}.`, q: 'Kolik centimetrů bude vzdálenost na mapě?', ans: cm, unit: 'cm',
    traps: [[km * m[0], 'Na mapě je vzdálenost menší. Děl měřítkem.'], [rd(km * 100000 / m[0] * 100, 2), 'Pozor na převod: 1 km = 100 000 cm.']],
    hints: [`Převeď ${cz(km)} km na centimetry a vyděl ${cz(m[0])}.`, `${cz(km)} km = ${cz(km * 100000)} cm`],
    steps: [`${cz(km)} km = ${cz(km * 100000)} cm`, `${cz(km * 100000)} : ${cz(m[0])} = ${cm} cm`],
  });
}
function p_zmensi() {
  const [p1, p2] = pick([[6, 4], [8, 6], [10, 4], [12, 8], [9, 6]]), na1 = rstep(30, 90, 15), q1 = na1 * p1, ans = na1 * p2;
  return N({
    text: `Recept na ${B(p1 + ' porcí')} potřebuje ${B(q1 + ' g')} masa. Vaří se ale jen pro ${B(p2 + ' ' + tv(p2, 'osobu', 'osoby', 'osob'))}.`, q: 'Kolik gramů masa je potřeba?', ans, unit: 'g',
    traps: [[q1 - (p1 - p2), 'Nestačí odečíst rozdíl porcí. Recept se zmenší v poměru.'], [q1 * p1 / p2, 'Porcí je méně, masa musí být méně.']],
    hints: [`Spočítej, kolik masa připadá na 1 porci.`, `${q1} : ${p1} = ${na1} g na porci, pak · ${p2}`],
    steps: [`1 porce: ${q1} : ${p1} = ${na1} g`, `${p2} porce: ${na1} · ${p2} = ${ans} g`.replace(`${p2} porce`, `${p2} ${tv(p2, 'porce', 'porce', 'porcí')}`), `Recept se zmenšil v poměru ${pm(p2 / gcd(p1, p2), p1 / gcd(p1, p2))}`],
  });
}
function p_trasa() {
  const m = pick([25000, 50000]), cm = pick([12, 14, 16, 18, 20, 22]), km = rd(cm * m / 100000, 2), v = ri(3, 5);
  return N({
    text: `Na turistické mapě s měřítkem 1 : ${cz(m)} měří trasa ${cm} cm. Turisté chodí rychlostí ${v} km/h a vyrážejí v 8:30.`, q: 'Jak dlouhá je trasa ve skutečnosti?', ans: km, unit: 'km', units: true,
    traps: [[cm * m, 'To jsou centimetry, převeď je.'], [rd(cm * m / 100, 2), 'To jsou metry.']],
    hints: ['1 cm na mapě = ' + cz(m) + ' cm ve skutečnosti. Rychlost a čas odchodu se neptají.'],
    steps: [`${cm} · ${cz(m)} = ${cz(cm * m)} cm`, `${cz(cm * m)} cm = ${cz(km)} km`, 'Rychlost a čas odchodu jsou zbytečné údaje.'],
  });
}
function p_malta() {
  const [a, b, c] = pick([[1, 4, 1], [1, 3, 1], [2, 5, 1], [1, 5, 2]]), d = ri(6, 15), cel = d * (a + b + c), ans = d * b;
  return N({
    text: `Malta se míchá z cementu, písku a vody v poměru ${pm(a, b, c)} (podle hmotnosti). Namíchá se ${cel} kg malty. Pytel cementu váží 25 kg.`, q: 'Kolik kilogramů písku je potřeba?', ans, unit: 'kg', units: true,
    traps: [[cel / 3, 'Díly nejsou stejně velké.'], [cel / b, `Celek má ${a + b + c} dílů.`]],
    hints: [`Dílů je ${a + b + c}. Hmotnost pytle cementu se neptá.`],
    steps: [`1 díl: ${cel} : ${a + b + c} = ${d} kg`, `Písek: ${d} · ${b} = ${ans} kg`, 'Hmotnost pytle je zbytečný údaj.'],
  });
}
function p_palacinky() {
  const zak = 12, ml = 500, n = pick([18, 24, 30, 36]), ans = ml * n / zak;
  return N({
    text: `Recept na ${zak} palačinek: 250 g mouky, ${ml} ml mléka, 2 vejce a špetka soli. Na chatě se má usmažit ${n} palačinek.`, q: 'Kolik mléka je potřeba?', ans, unit: 'ml', units: true,
    traps: [[ml + n - zak, 'Recept se zvětší v poměru, nestačí přičíst rozdíl.'], [ans / 1000, 'Odpověď je v ml, ne v litrech.']],
    hints: [`Palačinek je ${n} : ${zak} = ${cz(n / zak)}krát víc.`],
    steps: [`${n} : ${zak} = ${cz(n / zak)}`, `${ml} · ${cz(n / zak)} = ${cz(ans)} ml`],
  });
}
function p_trida() {
  const [a, b] = pick([[4, 5], [2, 3], [5, 4], [3, 4], [6, 5]]), d = ri(2, 5), h = d * b, ans = d * (a + b);
  return N({
    text: `Na kurz vaření chodí kluci a holky v poměru ${pm(a, b)}. Holek je ${h}. Kurz stojí 1 200 Kč za pololetí.`, q: 'Kolik dětí chodí na kurz celkem?', ans, unit: '',
    traps: [[d * a, 'To jsou jen kluci. Přičti holky.'], [h * a / b, 'To jsou kluci.']],
    hints: [`Holky jsou ${b} ${tv(b, 'díl', 'díly', 'dílů')}. Cena kurzu se neptá.`],
    steps: [`1 díl: ${h} : ${b} = ${d}`, `Kluci: ${d} · ${a} = ${d * a}`, `Celkem: ${d * a} + ${h} = ${ans}`],
  });
}

// ======================= 703 PŘÍMÁ ÚMĚRNOST (Čerpací stanice) =======================
const PALIVO = () => rd(ri(355, 419) / 10 + pick([0, 0.09]), 2);
function u_litry() {
  const c = PALIVO(), l = pick([10, 20, 25, 30, 40, 50]), ans = rd(c * l, 2);
  return N({
    text: `Litr benzínu stojí ${B(kc(c))}.`, q: `Kolik zaplatíš za ${l} litrů?`, ans, unit: 'Kč',
    traps: [[rd(c + l, 2), 'Cena a litry se násobí.'], [rd(c / l, 4), 'Více litrů stojí víc. Násob.']],
    hints: ['Kolikrát víc litrů, tolikrát víc korun. To je přímá úměrnost.', `1 l stojí ${kc(c)}, ${l} l stojí ${l}krát víc.`, `${kc0(c)} · ${l} = ?`],
    steps: [`1 l … ${kc(c)}`, `${l} l … ${kc0(c)} · ${l} = ${kc(ans)}`],
  });
}
function u_trojclenka() {
  const c = ri(36, 42), l1 = pick([2, 4, 5, 10]), l2 = pick([3, 6, 8, 12, 15].filter(x => x !== l1)), p1 = c * l1, ans = c * l2;
  return N({
    text: `Za ${B(l1 + ' l')} nafty se zaplatí ${B(p1 + ' Kč')}.`, q: `Kolik se zaplatí za ${l2} l?`, ans, unit: 'Kč',
    traps: [[p1 * l2, `Nejdřív zjisti cenu 1 litru: ${p1} : ${l1}.`], [p1 + l2 - l1, 'Přímá úměrnost: počítej přes cenu 1 litru, ne přičítáním.']],
    hints: ['Trojčlenka: nejdřív zjisti cenu jednoho litru.', `${l1} l … ${p1} Kč, 1 l … ${p1} : ${l1} Kč`, `${p1} : ${l1} = ${c}, ${l2} l … ${c} · ${l2}`],
    steps: [`${l1} l … ${p1} Kč`, `1 l … ${p1} : ${l1} = ${c} Kč`, `${l2} l … ${c} · ${l2} = ${ans} Kč`],
  });
}
function u_spotreba() {
  const s = pick([5, 6, 7, 8]), km = pick([150, 200, 250, 300, 350, 400]), ans = rd(s * km / 100, 2);
  return N({
    text: `Auto spotřebuje ${B(s + ' l')} benzínu na ${B('100 km')}.`, q: `Kolik litrů spotřebuje na ${km} km?`, ans, unit: 'l',
    traps: [[s * km, 'Spotřeba je na 100 km, ne na 1 km.'], [rd(km / s, 2), 'Litry počítej z kilometrů: kolikrát 100 km ujede?']],
    hints: ['Kolikrát delší cesta, tolikrát víc benzínu.', `${km} km je ${cz(km / 100)}krát 100 km.`, `${s} · ${cz(km / 100)} = ?`],
    steps: [`${km} : 100 = ${cz(km / 100)}`, `${s} · ${cz(km / 100)} = ${cz(ans)} l`],
  });
}
function u_cas() {
  const l1 = pick([10, 20]), s1 = pick([12, 15, 20]), l2 = l1 * ri(2, 5), ans = s1 * l2 / l1;
  return N({
    text: `Stojan načerpá ${B(l1 + ' l')} za ${B(s1 + ' sekund')}.`, q: `Za kolik sekund načerpá ${l2} l?`, ans, unit: 's',
    traps: [[s1 + l2 - l1, 'Kolikrát víc litrů, tolikrát víc sekund. Násob.'], [rd(s1 * l1 / l2, 3), 'Víc litrů trvá déle, ne kratší dobu.']],
    hints: [`${l2} l je ${l2 / l1}krát víc než ${l1} l.`, 'Čas se zvětší stejněkrát.', `${s1} · ${l2 / l1} = ?`],
    steps: [`${l2} : ${l1} = ${l2 / l1}`, `${s1} · ${l2 / l1} = ${ans} s`],
  });
}
const UMERY = [['počet litrů benzínu a cena za ně', 'přímá úměrnost'], ['počet kilogramů jablek a cena za ně', 'přímá úměrnost'], ['ujetá vzdálenost a spotřebovaný benzín', 'přímá úměrnost'],
  ['počet pracovníků a doba, za kterou práci dokončí', 'nepřímá úměrnost'], ['rychlost auta a doba jízdy na stejnou vzdálenost', 'nepřímá úměrnost'], ['počet krav a počet dní, na které vystačí seno', 'nepřímá úměrnost'],
  ['věk člověka a jeho výška', 'ani jedno'], ['číslo bot a výška člověka', 'ani jedno']];
function u_poznej() {
  const [co, ok] = pick(UMERY);
  return C({
    text: `Mezi dvěma veličinami: ${B(co)}.`, q: 'O jakou závislost jde?', opts: ['přímá úměrnost', 'nepřímá úměrnost', 'ani jedno'], ok,
    hints: ['Zkus jednu veličinu zdvojnásobit. Co se stane s druhou?', 'Přímá úměrnost: dvakrát víc → dvakrát víc. Nepřímá: dvakrát víc → dvakrát méně.', 'Když se to nedá říct přesně (u lidí to tak nefunguje), není to úměrnost.'],
    steps: [ok === 'přímá úměrnost' ? 'Dvakrát víc jednoho znamená dvakrát víc druhého: přímá úměrnost.' : ok === 'nepřímá úměrnost' ? 'Dvakrát víc jednoho znamená dvakrát méně druhého: nepřímá úměrnost.' : 'Nejde o pravidelnou závislost, není to úměrnost.'],
  });
}
function u_zaPenize() {
  const c = rd(ri(360, 420) / 10, 1), l1 = pick([8, 10, 12, 15]), l2 = pick([20, 25, 30, 40]), p1 = rd(c * l1, 2), p2 = rd(c * l2, 2);
  return N({
    text: `Za ${B(l1 + ' l')} se zaplatí ${B(kc(p1))}.`, q: `Kolik litrů se natankuje za ${kc(p2)}?`, ans: l2, unit: 'l',
    traps: [[rd(p2 / l1, 3), `Nejdřív zjisti cenu 1 litru: ${kc0(p1)} : ${l1}.`], [rd(p2 * l1 / p1 / 10, 3), 'Zkontroluj dělení.']],
    hints: ['Zjisti cenu 1 litru a pak, kolikrát se vejde do částky.', `1 l = ${kc0(p1)} : ${l1} = ${kc(c)}`],
    steps: [`1 l … ${kc0(p1)} : ${l1} = ${kc(c)}`, `${kc0(p2)} : ${kc0(c)} = ${l2} l`],
  });
}
function u_spotreba100() {
  const s = pick([5.5, 6, 6.5, 7, 7.5, 8]), km = pick([200, 250, 300, 350, 400, 450]), l = rd(s * km / 100, 2);
  return N({
    text: `Na cestu dlouhou ${B(km + ' km')} auto spotřebovalo ${B(cz(l) + ' l')} benzínu.`, q: 'Jaká je spotřeba na 100 km?', ans: s, unit: 'l',
    traps: [[rd(l / km, 4), 'Spotřeba se udává na 100 km, ne na 1 km.'], [rd(l * 100 / km * 10, 3), 'Zkontroluj, kolikrát se 100 km vejde do trasy.']],
    hints: [`${km} km je ${cz(km / 100)}krát 100 km.`, `${cz(l)} : ${cz(km / 100)} = ?`],
    steps: [`${km} : 100 = ${cz(km / 100)}`, `${cz(l)} : ${cz(km / 100)} = ${cz(s)} l na 100 km`],
  });
}
function u_brigada() {
  const h1 = pick([4, 5, 6, 8]), mzda = pick([120, 130, 140, 150, 160]), h2 = pick([10, 12, 14, 15, 20]), ans = mzda * h2;
  return N({
    text: `Brigádník na čerpací stanici dostane za ${B(h1 + ' hodin' + (h1 <= 4 ? 'y' : ''))} ${B(kc(mzda * h1))}.`.replace('hodiny', 'hodiny'), q: `Kolik dostane za ${h2} hodin?`, ans, unit: 'Kč',
    traps: [[mzda * h1 * h2, 'Nejdřív zjisti hodinovou mzdu.'], [mzda * h1 + h2 - h1, 'Počítej přes 1 hodinu.']],
    hints: [`Za 1 hodinu: ${mzda * h1} : ${h1}.`, `${mzda} · ${h2} = ?`],
    steps: [`1 h … ${mzda * h1} : ${h1} = ${mzda} Kč`, `${h2} h … ${mzda} · ${h2} = ${ans} Kč`],
  });
}
function u_tabulka() {
  const k = pick([3, 3.5, 4, 5, 7]), x1 = pick([2, 4]), x2 = pick([6, 8, 10, 12]), ans = rd(k * x2, 2);
  return N({
    text: `V tabulce je přímá úměrnost: k ${B(x1 + ' l')} patří ${B(cz(k * x1) + ' km')} na rezervu, k ${B(x2 + ' l')} patří neznámé číslo.`, q: `Kolik km patří k ${x2} l?`, ans, unit: 'km',
    traps: [[rd(k * x1 + x2 - x1, 2), 'Přímá úměrnost se nepočítá přičítáním.'], [rd(k * x1 * x2, 2), `Nejdřív zjisti, kolik km připadá na 1 l.`]],
    hints: [`Na 1 l připadá ${cz(k * x1)} : ${x1} km.`, `${cz(k)} · ${x2} = ?`],
    steps: [`1 l … ${cz(k * x1)} : ${x1} = ${cz(k)} km`, `${x2} l … ${cz(k)} · ${x2} = ${cz(ans)} km`],
  });
}
function u_rychlost() {
  const v = pick([60, 72, 90, 120]), t1 = pick([10, 20, 30]), t2 = pick([40, 50, 70, 80]), d1 = v * t1 / 60, ans = v * t2 / 60;
  return N({
    text: `Auto jede stálou rychlostí. Za ${B(t1 + ' minut')} ujede ${B(cz(d1) + ' km')}.`, q: `Kolik km ujede za ${t2} minut?`, ans, unit: 'km',
    traps: [[rd(d1 * t2, 2), 'Nejdřív zjisti, kolik ujede za 1 minutu (nebo za 10 minut).'], [rd(d1 + t2 - t1, 2), 'Počítej přes stejný úsek času.']],
    hints: [`Za 10 minut ujede ${cz(d1)} : ${t1 / 10} = ${cz(d1 / (t1 / 10))} km.`, `${t2} minut je ${t2 / 10}krát 10 minut.`],
    steps: [`10 min … ${cz(d1 * 10 / t1)} km`, `${t2} min … ${cz(d1 * 10 / t1)} · ${t2 / 10} = ${cz(ans)} km`],
  });
}
function u_dotankovat() {
  const V = pick([45, 50, 55, 60]), z = ri(5, 15), c = PALIVO(), ans = rd((V - z) * c, 2);
  return N({
    text: `Nádrž auta má objem ${V} l a ukazatel hlásí, že v ní zbývá ${z} l. Litr benzínu stojí ${kc(c)}. Auto ujelo od posledního tankování 520 km.`, q: 'Kolik zaplatíš za natankování plné nádrže?', ans, unit: 'Kč', units: true,
    traps: [[rd(V * c, 2), `V nádrži už ${z} l je. Tankuje se jen ${V - z} l.`], [V - z, 'To jsou litry. Ještě vynásob cenou.']],
    hints: [`Natankuje se ${V} − ${z} litrů. Ujeté kilometry se neptají.`],
    steps: [`${V} − ${z} = ${V - z} l`, `${V - z} · ${kc0(c)} = ${kc(ans)}`, 'Ujetá vzdálenost je zbytečný údaj.'],
  });
}
function u_cestaCena() {
  const s = pick([5.5, 6, 6.5, 7]), km = pick([180, 240, 320, 360, 420]), c = ri(36, 41), l = rd(s * km / 100, 3), ans = rd(l * c, 2);
  return N({
    text: `Auto má spotřebu ${cz(s)} l na 100 km. Rodina jede na chatu vzdálenou ${km} km a zpět. Litr benzínu stojí ${c} Kč. Na chatě zůstane 5 dní.`, q: 'Kolik bude stát benzín na cestu tam i zpět?', ans: rd(ans * 2, 2), unit: 'Kč', units: true,
    traps: [[ans, 'Jede se tam i zpět, vzdálenost je dvojnásobná.'], [rd(s * km * 2 * c, 2), 'Spotřeba je na 100 km.']],
    hints: [`Celá cesta: 2 · ${km} km. Počet dní na chatě se neptá.`],
    steps: [`Cesta: 2 · ${km} = ${2 * km} km`, `Benzín: ${cz(s)} · ${cz(2 * km / 100)} = ${cz(l * 2)} l`, `Cena: ${cz(l * 2)} · ${c} = ${kc(ans * 2)}`],
  });
}
function u_dojezd() {
  const s = pick([6, 6.4, 7.2, 8, 7.5]), km = pick([300, 400, 450, 500, 600]), l = rd(s * km / 100, 2);
  return N({
    text: `V nádrži je ${cz(l)} l nafty. Auto spotřebuje ${cz(s)} l na 100 km. Nádrž má objem 55 l.`, q: 'Kolik kilometrů auto ujede, než nádrž vyprázdní?', ans: km, unit: 'km', units: true,
    traps: [[rd(l * s, 2), 'Litry se nenásobí spotřebou. Zjisti, kolikrát se spotřeba vejde do nádrže.'], [rd(55 / s * 100, 2), `V nádrži je jen ${cz(l)} l, ne plná nádrž.`]],
    hints: [`${cz(l)} : ${cz(s)} = kolikrát 100 km. Objem nádrže se neptá.`],
    steps: [`${cz(l)} : ${cz(s)} = ${cz(km / 100)}`, `${cz(km / 100)} · 100 = ${km} km`, 'Objem nádrže je zbytečný údaj.'],
  });
}
function u_cerpadlo() {
  const l1 = pick([30, 40]), s1 = pick([80, 90, 100, 120]), t2 = pick([180, 240, 300]), ans = rd(l1 * t2 / s1, 2);
  return N({
    text: `Rychlé čerpadlo natankuje ${l1} l za ${Math.floor(s1 / 60)} min ${s1 % 60 ? s1 % 60 + ' s' : ''}`.trim() + `. Kamion stojí u stojanu ${t2 / 60} min a celou dobu se tankuje. Je to 3. kamion v pořadí.`, q: 'Kolik litrů natankuje?', ans, unit: 'l', units: true,
    traps: [[rd(l1 * t2 / 60, 2), 'Převeď oba časy na sekundy.'], [rd(l1 * t2 / s1 / 2, 2), 'Zkontroluj poměr časů.']],
    hints: [`Převeď časy na sekundy: ${s1} s a ${t2} s. Pořadí kamionu se neptá.`],
    steps: [`${t2} : ${s1} = ${cz(t2 / s1)}`, `${l1} · ${cz(t2 / s1)} = ${cz(ans)} l`],
  });
}

// ======================= 704 NEPŘÍMÁ ÚMĚRNOST (Farma) =======================
const lidi = n => n + ' ' + tv(n, 'člověk', 'lidé', 'lidí');
const dny = n => n + ' ' + tv(n, 'den', 'dny', 'dní');
function n_sberaci() {
  let a, d, b; do { a = pick([2, 3, 4, 6]); d = pick([6, 8, 10, 12]); b = pick([3, 4, 6, 8, 12].filter(x => x !== a)); } while ((a * d) % b);
  const ans = a * d / b;
  return N({
    text: `${B(a + ' ' + tv(a, 'sběrač', 'sběrači', 'sběračů'))} by ${a <= 4 ? 'očesali' : 'očesalo'} sad za ${B(dny(d))}.`, q: `Za kolik dní by sad ${b <= 4 ? 'očesali' : 'očesalo'} ${b} ${tv(b, 'sběrač', 'sběrači', 'sběračů')}?`, ans, unit: '',
    traps: [[rd(d * b / a, 3), 'Víc lidí udělá práci rychleji, ne pomaleji. To je nepřímá úměrnost.'], [d + a - b, 'Nepřímá úměrnost se nepočítá odčítáním.']],
    hints: [`Víc sběračů, méně dní. Kolikrát víc lidí, tolikrát méně dní.`, `Celá práce je ${a} · ${d} = ${a * d} „sběračodní“ (kolik dní by to trvalo jednomu sběrači).`, `${a * d} : ${b} = ?`],
    steps: [`Jeden sběrač: ${a} · ${d} = ${a * d} dní`, `${b} ${tv(b, 'sběrač', 'sběrači', 'sběračů')}: ${a * d} : ${b} = ${ans} dní`.replace(`= ${ans} dní`, `= ${dny(ans)}`)],
  });
}
function n_krmivo() {
  let k1, d1, k2; do { k1 = pick([10, 12, 15, 20, 24]); d1 = pick([10, 12, 15, 20, 30]); k2 = pick([8, 10, 12, 15, 16, 20, 24, 25, 30].filter(x => x !== k1)); } while ((k1 * d1) % k2);
  const ans = k1 * d1 / k2;
  return N({
    text: `Seno na farmě vystačí ${B(k1 + ' kravám')} na ${B(dny(d1))}.`, q: `Na kolik dní vystačí ${k2} kravám?`, ans, unit: '',
    traps: [[rd(d1 * k2 / k1, 3), `${k2 > k1 ? 'Víc krav sní seno rychleji, vystačí na méně dní.' : 'Méně krav, seno vystačí déle.'} Je to nepřímá úměrnost.`]],
    hints: [`Kolikrát víc krav, tolikrát méně dní.`, `Kdyby bylo jen 1 kráva: seno vystačí na ${k1} · ${d1} dní.`, `${k1 * d1} : ${k2} = ?`],
    steps: [`1 kráva: ${k1} · ${d1} = ${k1 * d1} dní`, `${k2} krav: ${k1 * d1} : ${k2} = ${ans} dní`.replace(`${ans} dní`, dny(ans))],
  });
}
function n_rychlost() {
  let v1, t1, v2; do { v1 = pick([10, 15, 20, 25, 30]); t1 = pick([2, 3, 4, 6]); v2 = pick([10, 15, 20, 30, 40, 60].filter(x => x !== v1)); } while ((v1 * t1) % v2);
  const ans = v1 * t1 / v2;
  return N({
    text: `Traktor jede na pole rychlostí ${B(v1 + ' km/h')} a cesta mu trvá ${B(t1 + ' h')}.`, q: `Jak dlouho by cesta trvala rychlostí ${v2} km/h?`, ans, unit: 'h',
    traps: [[rd(t1 * v2 / v1, 3), 'Rychlejší jízda trvá kratší dobu, ne delší.']],
    hints: ['Vzdálenost je stejná. Kolikrát rychleji, tolikrát kratší doba.', `Vzdálenost: ${v1} · ${t1} = ${v1 * t1} km.`, `${v1 * t1} : ${v2} = ?`],
    steps: [`Vzdálenost: ${v1} · ${t1} = ${v1 * t1} km`, `Doba: ${v1 * t1} : ${v2} = ${cz(ans)} h`],
  });
}
function n_poznej() {
  const [co, ok] = pick([['počet traktorů a doba, za kterou zorají pole', 'nepřímá úměrnost'], ['počet ovcí a počet dní, na které vystačí seno', 'nepřímá úměrnost'], ['rychlost traktoru a doba cesty na pole', 'nepřímá úměrnost'],
    ['počet kilogramů brambor a jejich cena', 'přímá úměrnost'], ['počet beden jablek a jejich hmotnost', 'přímá úměrnost'], ['velikost bedny a počet beden na stejnou úrodu', 'nepřímá úměrnost'], ['stáří stromu a počet jablek na něm', 'ani jedno']]);
  return C({
    text: `Na farmě: ${B(co)}.`, q: 'O jakou závislost jde?', opts: ['přímá úměrnost', 'nepřímá úměrnost', 'ani jedno'], ok,
    hints: ['Zkus jednu veličinu zdvojnásobit. Co se stane s druhou?', 'Přímá: dvakrát víc → dvakrát víc. Nepřímá: dvakrát víc → dvakrát méně.', 'Když se to nedá říct přesně, není to úměrnost.'],
    steps: [ok === 'nepřímá úměrnost' ? 'Dvakrát víc jednoho znamená dvakrát méně druhého: nepřímá úměrnost.' : ok === 'přímá úměrnost' ? 'Dvakrát víc jednoho znamená dvakrát víc druhého: přímá úměrnost.' : 'Není to pravidelná závislost.'],
  });
}
function n_bedny() {
  let b1, kg1, kg2; do { b1 = pick([20, 24, 30, 36, 40]); kg1 = pick([10, 12, 15, 18, 20]); kg2 = pick([8, 10, 12, 15, 20, 24, 25].filter(x => x !== kg1)); } while ((b1 * kg1) % kg2);
  const ans = b1 * kg1 / kg2;
  return N({
    text: `Úroda jablek se vešla do ${B(b1 + ' beden')} po ${B(kg1 + ' kg')}.`, q: `Kolik beden by bylo potřeba, kdyby se do každé dávalo ${kg2} kg?`, ans, unit: '',
    traps: [[rd(b1 * kg2 / kg1, 3), 'Do větší bedny se vejde víc, beden bude méně. Je to nepřímá úměrnost.']],
    hints: ['Celkem je jablek pořád stejně.', `Celkem: ${b1} · ${kg1} = ${b1 * kg1} kg.`, `${b1 * kg1} : ${kg2} = ?`],
    steps: [`Úroda: ${b1} · ${kg1} = ${b1 * kg1} kg`, `${b1 * kg1} : ${kg2} = ${ans} beden`],
  });
}
function n_kolikLidi() {
  let a, d1, d2; do { a = pick([4, 6, 8, 9, 12]); d1 = pick([6, 8, 9, 10, 12]); d2 = pick([2, 3, 4, 6, 8].filter(x => x < d1)); } while ((a * d1) % d2);
  const ans = a * d1 / d2;
  return N({
    text: `${B(a + ' ' + tv(a, 'sekáč', 'sekáči', 'sekáčů'))} by ${a <= 4 ? 'posekali' : 'posekalo'} louku za ${B(d1 + ' ' + tv(d1, 'hodinu', 'hodiny', 'hodin'))}.`, q: `Kolik sekáčů je potřeba, aby louka byla posekaná za ${d2} ${tv(d2, 'hodinu', 'hodiny', 'hodin')}?`, ans, unit: '',
    traps: [[rd(a * d2 / d1, 3), 'Za kratší dobu je potřeba víc lidí, ne méně.']],
    hints: [`Celá práce: ${a} · ${d1} = ${a * d1} hodin pro jednoho sekáče.`, `${a * d1} : ${d2} = ?`],
    steps: [`Práce: ${a} · ${d1} = ${a * d1} h pro jednoho`, `${a * d1} : ${d2} = ${ans} sekáčů`],
  });
}
function n_cerpadla() {
  const [c1, t1, c2] = pick([[5, 4.5, 3], [4, 6, 3], [6, 2.5, 5], [3, 5, 2], [4, 7.5, 5]]), ans = rd(c1 * t1 / c2, 3);
  return N({
    text: `${B(c1 + ' ' + tv(c1, 'čerpadlo', 'čerpadla', 'čerpadel'))} ${c1 <= 4 ? 'vyčerpají' : 'vyčerpá'} vodu ze zatopeného sklepa stodoly za ${B(cz(t1) + ' h')}.`, q: `Za jak dlouho by vodu ${c2 <= 4 ? 'vyčerpala' : 'vyčerpalo'} ${c2} ${tv(c2, 'čerpadlo', 'čerpadla', 'čerpadel')}?`, ans, unit: 'h',
    traps: [[rd(t1 * c2 / c1, 3), 'Méně čerpadel bude čerpat déle.']],
    hints: [`Jedno čerpadlo by to vyčerpalo za ${c1} · ${cz(t1)} h.`, `${cz(c1 * t1)} : ${c2} = ?`],
    steps: [`Jedno čerpadlo: ${c1} · ${cz(t1)} = ${cz(c1 * t1)} h`, `${c2} čerpadla: ${cz(c1 * t1)} : ${c2} = ${cz(ans)} h`],
  });
}
function n_prodej() {
  let o, d, p; do { o = pick([16, 18, 20, 24, 30]); d = pick([20, 24, 30, 36, 40]); p = ri(2, 8); } while ((o * d) % (o - p));
  const ans = o * d / (o - p);
  return N({
    text: `Seno vystačí ${B(o + ' ovcím')} na ${B(dny(d))}. Farmář pak ${B(p + ' ' + tv(p, 'ovci', 'ovce', 'ovcí'))} prodá.`, q: 'Na kolik dní vystačí seno zbylým ovcím?', ans, unit: '',
    traps: [[rd(d * (o - p) / o, 3), 'Méně ovcí sní seno pomaleji, vystačí déle.'], [d + p, 'Nepřímá úměrnost se nepočítá přičítáním.']],
    hints: [`Zbude ${o} − ${p} = ${o - p} ovcí.`, `Jedné ovci by seno vystačilo na ${o} · ${d} = ${o * d} dní. Pak děl ${o - p}.`],
    steps: [`Zbylo ovcí: ${o - p}`, `1 ovce: ${o} · ${d} = ${o * d} dní`, `${o * d} : ${o - p} = ${dny(ans)}`],
  });
}
function n_jizdy() {
  let j1, d1, d2; do { j1 = pick([3, 4, 5, 6]); d1 = pick([10, 12, 15, 20]); d2 = pick([6, 8, 10, 12].filter(x => x < d1)); } while ((j1 * d1) % d2);
  const ans = j1 * d1 / d2;
  return N({
    text: `Když traktor udělá ${B(j1 + ' jízd' + (j1 <= 4 ? 'y' : ''))} denně, odveze obilí z pole za ${B(dny(d1))}.`, q: `Kolik jízd denně musí udělat, aby obilí odvezl za ${dny(d2)}?`, ans, unit: '',
    traps: [[rd(j1 * d2 / d1, 3), 'Za méně dní je potřeba víc jízd denně.']],
    hints: [`Všech jízd je ${j1} · ${d1} = ${j1 * d1}.`, `${j1 * d1} : ${d2} = ?`],
    steps: [`Všech jízd: ${j1} · ${d1} = ${j1 * d1}`, `Denně: ${j1 * d1} : ${d2} = ${ans}`],
  });
}
function n_pridani() {
  let l, d, po, pr; do { l = pick([6, 8, 10, 12]); d = pick([12, 15, 18, 20]); po = ri(2, 6); pr = ri(2, 4); } while ((l * (d - po)) % (l + pr));
  const zb = l * (d - po) / (l + pr), ans = po + zb;
  return N({
    text: `${l} lidí by sklidilo úrodu za ${d} dní. Po ${po} dnech práce ${pr <= 4 ? `přišli na pomoc ${pr} další lidé` : `přišlo na pomoc ${pr} dalších lidí`}. Na farmě je 14 krav a 30 slepic.`, q: 'Za kolik dní od začátku byla úroda sklizená?', ans, unit: '',
    traps: [[zb, `To je jen zbytek práce po příchodu pomocníků. Přičti prvních ${po} dní.`], [d, 'S pomocníky to bylo rychlejší.']],
    hints: [`Zbývající práce: ${l} lidí by ji dělalo ještě ${d - po} dní. Zvířata se neptají.`],
    steps: [`Zbývá: ${l} · ${d - po} = ${l * (d - po)} „člověkodní“`, `S pomocníky: ${l * (d - po)} : ${l + pr} = ${zb} dní`, `Celkem: ${po} + ${zb} = ${ans} dní`],
  });
}
function n_krmivo2() {
  let k, d, po, pr; do { k = pick([20, 24, 30, 36]); d = pick([30, 35, 40, 45]); po = pick([5, 10, 15]); pr = ri(2, 6); } while ((k * (d - po)) % (k - pr));
  const ans = k * (d - po) / (k - pr);
  return N({
    text: `Krmivo vystačí ${k} kravám na ${d} dní. Po ${po} dnech se ${pr} ${tv(pr, 'kráva prodala', 'krávy prodaly', 'krav prodalo')}. Jedna kráva dá denně asi 25 l mléka.`, q: 'Na kolik dní ještě vystačí zbylé krmivo?', ans, unit: '',
    traps: [[d - po, 'Krav je teď méně, krmivo vystačí déle.'], [rd((d - po) * (k - pr) / k, 3), 'Méně krav sní krmivo pomaleji.']],
    hints: [`Zbylé krmivo by ${k} kravám vystačilo na ${d - po} dní. Mléko se neptá.`],
    steps: [`Zbylé krmivo: ${k} · ${d - po} = ${k * (d - po)} „kravodní“`, `${k - pr} krav: ${k * (d - po)} : ${k - pr} = ${ans} dní`],
  });
}
function n_nadrz() {
  const c1 = pick([2, 3, 4, 6]), t1 = pick([80, 120, 160, 180, 240]), c2 = pick([3, 4, 5, 6, 8].filter(x => x !== c1 && (c1 * t1) % x === 0));
  if (!c2) return n_nadrz();
  const ans = c1 * t1 / c2, hh = Math.floor(t1 / 60), mm = t1 % 60;
  return N({
    text: `Nádrž na zalévání naplní ${c1} ${tv(c1, 'čerpadlo', 'stejná čerpadla', 'stejných čerpadel')} za ${hh} h${mm ? ` ${mm} min` : ''}. Nádrž má objem 12 000 l.`, q: `Za kolik minut ji naplní ${c2} ${tv(c2, 'čerpadlo', 'čerpadla', 'čerpadel')}?`, ans, unit: 'min', units: true,
    traps: [[rd(t1 * c2 / c1, 3), 'Víc čerpadel naplní nádrž rychleji.'], [rd(c1 * (hh + mm / 60) / c2, 3), 'Odpověď má být v minutách.']],
    hints: [`Převeď čas na minuty: ${t1} min. Objem nádrže nepotřebuješ.`],
    steps: [`${hh} h${mm ? ` ${mm} min` : ''} = ${t1} min`, `Jedno čerpadlo: ${c1} · ${t1} = ${c1 * t1} min`, `${c2}: ${c1 * t1} : ${c2} = ${ans} min`],
  });
}
function n_porucha() {
  let t, d, po; do { t = pick([3, 4, 5]); d = pick([6, 8, 9, 10, 12]); po = ri(1, 4); } while ((t * (d - po)) % (t - 1) || po >= d);
  const zb = t * (d - po) / (t - 1), ans = po + zb;
  return N({
    text: `${t} ${t <= 4 ? 'traktory by pole zoraly' : 'traktorů by pole zoralo'} za ${d} dní. Po ${po} ${tv(po, 'dni', 'dnech', 'dnech')} se jeden traktor porouchal a zbytek práce ${t - 1 <= 4 ? 'dodělaly ostatní' : 'dodělalo ostatních'}. Pole má 48 ha.`, q: 'Za kolik dní od začátku bylo pole zorané?', ans, unit: '',
    traps: [[zb, `Přičti prvních ${po} ${tv(po, 'den', 'dny', 'dní')}.`], [d, 'Po poruše šla práce pomaleji.']],
    hints: [`Zbývající práce pro ${t} traktory: ${d - po} dní. Rozloha pole se neptá.`],
    steps: [`Zbývá: ${t} · ${d - po} = ${t * (d - po)} „traktorodní“`, `${t - 1} traktory: ${t * (d - po)} : ${t - 1} = ${zb} dní`, `Celkem: ${po} + ${zb} = ${ans} dní`],
  });
}

// ======================= 705 PROCENTA (Stadion) =======================
function pc_cast() {
  const z = pick([800, 1200, 2000, 2500, 4000, 5000]), p = pick([10, 20, 25, 30, 40, 50, 60, 75]), ans = z * p / 100;
  return N({
    text: `Na zápas přišlo ${B(cz(z) + ' diváků')}. ${B(pc(p))} z nich fandí hostům.`, q: 'Kolik diváků fandí hostům?', ans, unit: '',
    traps: [[z - ans, 'Tolik diváků fandí domácím. Ptám se na hosty.'], [z / p, 'Nejdřív zjisti 1 % (děl 100), pak násob procenty.'], [z * p, '1 % je setina celku. Děl stem.']],
    hints: ['Procento je setina: 1 % = jedna setina celku.', `1 % z ${cz(z)} je ${cz(z)} : 100 = ${cz(z / 100)}.`, `${cz(z / 100)} · ${p} = ?`],
    steps: [`1 % … ${cz(z)} : 100 = ${cz(z / 100)}`, `${p} % … ${cz(z / 100)} · ${p} = ${cz(ans)}`, `Odpověď: Hostům fandí ${cz(ans)} diváků.`],
  });
}
function pc_kolikProc() {
  const [c, z] = pick([[5, 20], [8, 10], [9, 12], [6, 24], [12, 16], [15, 20], [7, 25], [3, 12]]), ans = c / z * 100;
  return N({
    text: `Útočník vystřelil v sezóně ${B(z + ' ' + tv(z, 'pokutový kop', 'pokutové kopy', 'pokutových kopů'))} a proměnil ${B(c)}.`, q: 'Kolik procent kopů proměnil?', ans, unit: '%',
    traps: [[c, 'To je počet, ne procenta. Zjisti, jakou část tvoří.'], [rd(z / c * 100, 3), 'Část (proměněné) děl celkem (všechny kopy), ne naopak.']],
    hints: ['Procenta = část : celek · 100.', `Část je ${c}, celek ${z}.`, `${c} : ${z} · 100 = ?`],
    steps: [`${c} : ${z} = ${cz(c / z)}`, `${cz(c / z)} · 100 = ${cz(ans)} %`],
  });
}
function pc_zaklad() {
  const p = pick([10, 15, 20, 25, 30, 40]), z = pick([1200, 2000, 3000, 4000, 6000]), c = z * p / 100;
  return N({
    text: `${B(pc(p))} diváků přijelo autobusem. Bylo jich ${B(cz(c))}.`, q: 'Kolik diváků přišlo na zápas celkem?', ans: z, unit: '',
    traps: [[c * p / 100, 'Hledáš celek (100 %), ne část z části.'], [c + p, 'Procenta se nepřičítají k počtu.']],
    hints: [`${p} % je ${cz(c)} diváků. Kolik je 1 %?`, `1 % = ${cz(c)} : ${p} = ${cz(c / p)}.`, `100 % = ${cz(c / p)} · 100`],
    steps: [`${p} % … ${cz(c)}`, `1 % … ${cz(c)} : ${p} = ${cz(c / p)}`, `100 % … ${cz(c / p)} · 100 = ${cz(z)}`],
  });
}
function pc_volba() {
  const [p, ok] = pick([[50, 'polovina'], [25, 'čtvrtina'], [10, 'desetina'], [20, 'pětina'], [75, 'tři čtvrtiny']]);
  return C({
    text: `Na stadionu je obsazeno ${B(pc(p))} míst.`, q: 'Jaká část míst je obsazená?', opts: ['polovina', 'čtvrtina', 'desetina', 'pětina', 'tři čtvrtiny'], ok,
    hints: ['Celek je 100 %.', '50 % je polovina ze 100 %, 25 % je čtvrtina…', `${p} % = ${p}/100 a to zkrať.`],
    steps: [`${p} % = ${p} ze 100 = ${ok}`],
  });
}
function pc_zbytek() {
  const z = pick([400, 800, 1000, 1500, 2000]), p = pick([60, 75, 80, 90, 85]), ans = z * (100 - p) / 100;
  return N({
    text: `K zápasu bylo připraveno ${B(cz(z) + ' vstupenek')}. Prodalo se ${B(pc(p))} z nich.`, q: 'Kolik vstupenek zbylo?', ans, unit: '',
    traps: [[z * p / 100, 'Tolik se jich prodalo. Ptám se, kolik zbylo.']],
    hints: [`Zbylo ${100} − ${p} = ${100 - p} % vstupenek.`, `1 % je ${cz(z / 100)}.`, `${cz(z / 100)} · ${100 - p} = ?`],
    steps: [`Zbylo: 100 − ${p} = ${100 - p} %`, `${cz(z / 100)} · ${100 - p} = ${cz(ans)}`],
  });
}
function pc_dvaKluby() {
  const k = pick([8000, 10000, 12000, 15000]), d = pick([40, 45, 50, 55]), h = pick([10, 15, 20]), ans = k * (100 - d - h) / 100;
  return N({
    text: `Stadion má ${B(cz(k) + ' míst')}. Domácí fanoušci obsadili ${B(pc(d))} míst, hosté ${B(pc(h))}.`, q: 'Kolik míst zůstalo prázdných?', ans, unit: '',
    traps: [[k * (d + h) / 100, 'Tolik míst je obsazeno. Ptám se na prázdná.'], [k * (100 - d) / 100, 'Odečti i hosty.']],
    hints: [`Prázdných je 100 − ${d} − ${h} procent.`, `1 % = ${cz(k / 100)} míst.`],
    steps: [`Prázdné: 100 − ${d} − ${h} = ${100 - d - h} %`, `${cz(k / 100)} · ${100 - d - h} = ${cz(ans)}`],
  });
}
function pc_narust() {
  const z = pick([4000, 5000, 6000, 8000]), p = pick([5, 10, 12, 15, 20]), ans = z * (100 + p) / 100;
  return N({
    text: `Loni chodilo na zápasy průměrně ${B(cz(z) + ' diváků')}. Letos jich chodí o ${B(pc(p))} víc.`, q: 'Kolik diváků chodí letos?', ans, unit: '',
    traps: [[z * p / 100, 'To je jen přírůstek. Přičti ho k loňskému počtu.'], [z + p, 'Přičítá se ' + p + ' % z ' + cz(z) + ', ne ' + p + ' diváků.']],
    hints: [`Letos je to ${100 + p} % loňského počtu.`, `1 % = ${cz(z / 100)}.`],
    steps: [`Přírůstek: ${cz(z / 100)} · ${p} = ${cz(z * p / 100)}`, `${cz(z)} + ${cz(z * p / 100)} = ${cz(ans)}`],
  });
}
function pc_vyhry() {
  const [v, z] = pick([[18, 24], [12, 20], [21, 28], [9, 15], [16, 20], [14, 35]]), ans = v / z * 100;
  return N({
    text: `Tým odehrál v sezóně ${B(z + ' zápasů')} a ${B(v)} z nich vyhrál.`, q: 'Kolik procent zápasů vyhrál?', ans, unit: '%',
    traps: [[rd(z / v * 100, 3), 'Výhry (část) děl počtem zápasů (celek).'], [z - v, 'To je počet zápasů bez výhry.']],
    hints: ['Část : celek · 100.', `${v} : ${z} · 100 = ?`],
    steps: [`${v} : ${z} = ${cz(v / z)}`, `${cz(v / z)} · 100 = ${cz(ans)} %`],
  });
}
function pc_brankar() {
  const p = pick([75, 80, 85, 90]), z = pick([20, 40, 60, 80]), c = z * p / 100;
  if (!Number.isInteger(c)) return pc_brankar();
  return N({
    text: `Brankář chytil ${B(pc(p))} střel na branku. Chytil jich ${B(c)}.`, q: 'Kolik střel šlo na branku?', ans: z, unit: '',
    traps: [[rd(c * p / 100, 3), 'Hledáš celek (100 %).'], [z - c, 'Tolik střel prošlo. Ptám se na všechny.']],
    hints: [`${p} % je ${c}. Kolik je 1 %?`, `${c} : ${p} · 100 = ?`],
    steps: [`1 % = ${c} : ${p} = ${cz(c / p)}`, `100 % = ${cz(c / p)} · 100 = ${z}`],
  });
}
function pc_desetin() {
  const z = pick([2000, 4000, 6000, 8000]), p = pick([2.5, 1.5, 0.5, 3.5]), ans = z * p / 100;
  return N({
    text: `Ze ${B(cz(z) + ' vstupenek')} je ${B(pc(p))} vyhrazeno pro novináře.`, q: 'Kolik vstupenek dostanou novináři?', ans, unit: '',
    traps: [[z * p, '1 % je setina, děl 100.'], [z / 100, `To je jen 1 %. Vynásob ${cz(p)}.`]],
    hints: [`1 % = ${cz(z)} : 100 = ${cz(z / 100)}.`, `${cz(z / 100)} · ${cz(p)} = ?`],
    steps: [`1 % = ${cz(z / 100)}`, `${cz(p)} % = ${cz(z / 100)} · ${cz(p)} = ${cz(ans)}`],
  });
}
function pc_permanentky() {
  const k = pick([12000, 15000, 18000, 20000]), o = pick([80, 90, 95]), pp = pick([30, 40, 45]), ans = k * o / 100 * pp / 100;
  return N({
    text: `Stadion má kapacitu ${cz(k)} diváků. Na derby byl zaplněný z ${o} %. ${pp} % přítomných diváků mělo permanentku. Vstupenka stála 250 Kč.`, q: 'Kolik diváků mělo permanentku?', ans, unit: '',
    traps: [[k * pp / 100, `${pp} % se počítá z přítomných diváků, ne z kapacity.`], [k * o / 100, 'To jsou všichni přítomní.']],
    hints: ['Nejdřív zjisti počet diváků, z nich pak procenta s permanentkou. Cena vstupenky se neptá.'],
    steps: [`Diváků: ${cz(k)} · ${o} : 100 = ${cz(k * o / 100)}`, `S permanentkou: ${cz(k * o / 100)} · ${pp} : 100 = ${cz(ans)}`],
  });
}
function pc_goly() {
  const [d, o] = pick([[42, 28], [36, 24], [45, 15], [30, 20], [48, 32], [27, 18]]), ans = d / (d + o) * 100;
  return N({
    text: `Tým za sezónu vstřelil ${d} gólů a ${o} gólů dostal. Odehrál 30 zápasů.`, q: 'Kolik procent všech gólů v jeho zápasech vstřelil?', ans, unit: '%',
    traps: [[rd(d / o * 100, 3), 'Celek jsou všechny góly v zápasech: vstřelené i obdržené.'], [rd(d / 30 * 100, 3), 'Počet zápasů je zbytečný údaj.']],
    hints: ['Celek = vstřelené + obdržené góly. Počet zápasů se neptá.'],
    steps: [`Celkem gólů: ${d} + ${o} = ${d + o}`, `${d} : ${d + o} · 100 = ${cz(ans)} %`],
  });
}
function pc_rust() {
  const [z, n] = pick([[6400, 8000], [5000, 6000], [8000, 9200], [4000, 5000], [12000, 13800]]), ans = (n - z) / z * 100;
  return N({
    text: `Průměrná návštěvnost vzrostla z ${cz(z)} na ${cz(n)} diváků. Lístek zdražil o 20 Kč.`, q: 'O kolik procent vzrostla návštěvnost?', ans, unit: '%',
    traps: [[rd((n - z) / n * 100, 3), 'Procenta se počítají z původní hodnoty.'], [n - z, 'To je přírůstek v divácích, ne v procentech.']],
    hints: ['Přírůstek vyděl původním počtem a vynásob 100. Zdražení lístku se neptá.'],
    steps: [`Přírůstek: ${cz(n)} − ${cz(z)} = ${cz(n - z)}`, `${cz(n - z)} : ${cz(z)} · 100 = ${cz(ans)} %`],
  });
}
function pc_tamZpet() {
  const z = pick([8000, 10000, 6000, 12000]), p = pick([10, 15, 20, 25]), ans = rd(z * (100 - p) / 100 * (100 + p) / 100, 2);
  return N({
    text: `Návštěvnost byla ${cz(z)} diváků. Po sérii proher klesla o ${p} %, pak po výhrách vzrostla o ${p} %.`, q: 'Kolik diváků chodí teď?', ans, unit: '',
    traps: [[z, `Nárůst o ${p} % se počítá z nižšího čísla, takže se nevrátíš na původní hodnotu.`]],
    hints: [`Nejdřív o ${p} % méně, pak z nového čísla o ${p} % víc.`],
    steps: [`Pokles: ${cz(z)} · ${cz((100 - p) / 100)} = ${cz(z * (100 - p) / 100)}`, `Nárůst: ${cz(z * (100 - p) / 100)} · ${cz((100 + p) / 100)} = ${cz(ans)}`],
  });
}

// ======================= 706 PROCENTA V OBCHODĚ (Výprodej) =======================
// [1. pád, 4. pád, je/jsou, stál/stála/stály, zdražil/zdražila/zdražily]
const VECI = [['Mikina', 'mikinu', 'je', 'stála', 'zdražila'], ['Bunda', 'bundu', 'je', 'stála', 'zdražila'], ['Boty', 'boty', 'jsou', 'stály', 'zdražily'], ['Batoh', 'batoh', 'je', 'stál', 'zdražil'],
  ['Sluchátka', 'sluchátka', 'jsou', 'stála', 'zdražila'], ['Hra', 'hru', 'je', 'stála', 'zdražila'], ['Skateboard', 'skateboard', 'je', 'stál', 'zdražil'], ['Hodinky', 'hodinky', 'jsou', 'stály', 'zdražily']];
function ob_usetris() {
  const [v] = pick(VECI), c = pick([400, 600, 800, 1000, 1200, 1500, 2000]), p = pick([10, 20, 25, 30, 40, 50]), ans = c * p / 100;
  return N({
    text: `${v} stojí ${B(kc(c))}. Ve výprodeji je sleva ${B(pc(p))}.`, q: 'Kolik korun ušetříš?', ans, unit: 'Kč',
    traps: [[c - ans, 'Tolik zaplatíš. Ptám se, kolik ušetříš.'], [p, 'Sleva v procentech není sleva v korunách. Spočítej ' + p + ' % z ceny.']],
    hints: ['Ušetříš právě tolik, kolik je sleva.', `1 % z ${c} je ${cz(c / 100)} Kč.`, `${cz(c / 100)} · ${p} = ?`],
    steps: [`1 % = ${cz(c / 100)} Kč`, `Sleva ${p} % = ${cz(c / 100)} · ${p} = ${kc(ans)}`],
  });
}
function ob_poSleve() {
  const [v, akuz, je] = pick(VECI), c = pick([500, 800, 1000, 1200, 1500, 2000, 2500]), p = pick([10, 20, 25, 30, 40]), ans = c * (100 - p) / 100;
  return N({
    text: `${v} stojí ${B(kc(c))}, ve výprodeji ${je} o ${B(pc(p))} levnější.`, q: `Kolik zaplatíš za ${akuz}?`, ans, unit: 'Kč',
    traps: [[c * p / 100, 'To je sleva. Ptám se, kolik zaplatíš.'], [c - p, `Neodčítej ${p} korun, ale ${p} % z ceny.`]],
    hints: [`Zaplatíš ${100 - p} % původní ceny.`, `1 % = ${cz(c / 100)} Kč.`, `${cz(c / 100)} · ${100 - p} = ?`],
    steps: [`Platíš 100 − ${p} = ${100 - p} %`, `${cz(c / 100)} · ${100 - p} = ${kc(ans)}`],
  });
}
function ob_zdrazeni() {
  const [v, , , stal, zdrazil] = pick(VECI), c = pick([200, 400, 500, 800, 1000]), p = pick([5, 10, 15, 20, 25]), ans = c * (100 + p) / 100;
  return N({
    text: `${v} ${stal} ${B(kc(c))}. Po Vánocích ${zdrazil} o ${B(pc(p))}.`, q: 'Kolik stojí teď?', ans, unit: 'Kč',
    traps: [[c * p / 100, 'To je jen zdražení. Přičti ho k původní ceně.'], [c + p, `Přičítá se ${p} % z ceny, ne ${p} Kč.`]],
    hints: [`Nová cena je ${100 + p} % původní.`, `1 % = ${cz(c / 100)} Kč.`, `${cz(c)} + ${cz(c / 100)} · ${p} = ?`],
    steps: [`Zdražení: ${cz(c / 100)} · ${p} = ${kc(c * p / 100)}`, `${cz(c)} + ${cz(c * p / 100)} = ${kc(ans)}`],
  });
}
function ob_kolikProc() {
  const c = pick([400, 500, 800, 1000, 2000]), p = pick([10, 20, 25, 30, 40, 50]), n = c * (100 - p) / 100;
  return N({
    text: `Bunda stála ${B(kc(c))}, teď ji prodávají za ${B(kc(n))}.`, q: 'O kolik procent je levnější?', ans: p, unit: '%',
    traps: [[c - n, 'To je sleva v korunách. Ptám se na procenta.'], [100 - p, 'Tolik procent původní ceny zaplatíš. Sleva je zbytek do 100 %.']],
    hints: ['Spočítej slevu v korunách a zjisti, kolik je to procent z původní ceny.', `Sleva: ${c} − ${n} = ${c - n} Kč.`, `${c - n} : ${c} · 100 = ?`],
    steps: [`Sleva: ${c - n} Kč`, `${c - n} : ${c} · 100 = ${p} %`],
  });
}
function ob_levnejsi() {
  let c1, p1, c2, p2, a, b; do { c1 = pick([400, 500, 600, 800]); p1 = pick([20, 25, 30, 40]); c2 = pick([350, 400, 450, 500, 600]); p2 = pick([5, 10, 15, 20]); a = c1 * (100 - p1) / 100; b = c2 * (100 - p2) / 100; } while (a === b || c1 === c2);
  const A = `tričko za ${kc(c1)} se slevou ${p1} %`, Bb = `tričko za ${kc(c2)} se slevou ${p2} %`;
  return C({
    text: `Ve dvou obchodech prodávají podobná trička: ${A}, nebo ${Bb}.`, q: 'Které vyjde levněji?', opts: [A, Bb, 'obě stejně'], ok: a < b ? A : Bb,
    hints: ['Spočítej, kolik zaplatíš za každé po slevě.', `První: ${cz(c1 / 100)} · ${100 - p1}, druhé: ${cz(c2 / 100)} · ${100 - p2}.`, 'Porovnej výsledky.'],
    steps: [`První: ${kc(a)}`, `Druhé: ${kc(b)}`, `Levněji vyjde ${a < b ? 'první' : 'druhé'}.`],
  });
}
function ob_puvodni() {
  const c = pick([500, 600, 800, 1000, 1200, 1500]), p = pick([10, 20, 25, 40]), n = c * (100 - p) / 100;
  return N({
    text: `Po slevě ${B(pc(p))} stojí batoh ${B(kc(n))}.`, q: 'Kolik stál před slevou?', ans: c, unit: 'Kč',
    traps: [[rd(n * (100 + p) / 100, 2), `Sleva se počítala z původní ceny. ${kc(n)} je ${100 - p} % původní ceny, nepřičítej ${p} % z nové.`], [n + p, 'Procenta se nepřičítají jako koruny.']],
    hints: [`${kc(n)} je ${100 - p} % původní ceny.`, `1 % = ${cz(n)} : ${100 - p}, celá cena = 1 % · 100.`],
    steps: [`${100 - p} % … ${kc(n)}`, `1 % … ${cz(n)} : ${100 - p} = ${cz(c / 100)} Kč`, `100 % … ${kc(c)}`],
  });
}
function ob_dph() {
  const c = pick([100, 200, 500, 1000, 1500, 2000]), ans = c * 121 / 100;
  return N({
    text: `Cena sluchátek bez DPH (daň, kterou obchod přičítá k ceně) je ${B(kc(c))}. DPH je ${B('21 %')}.`, q: 'Kolik stojí sluchátka s DPH?', ans, unit: 'Kč',
    traps: [[c * 21 / 100, 'To je jen daň. Přičti ji k ceně.'], [c + 21, 'Přičítá se 21 % z ceny, ne 21 Kč.']],
    hints: ['Cena s DPH = cena + 21 % z ceny = 121 % ceny.', `${cz(c)} · 1,21 = ?`],
    steps: [`DPH: ${cz(c / 100)} · 21 = ${kc(c * 0.21)}`, `${cz(c)} + ${cz(c * 0.21)} = ${kc(ans)}`],
  });
}
function ob_dveSlevy() {
  const c = pick([1000, 2000, 1500, 800, 500]), p = pick([20, 10, 25]), q = pick([10, 20]), ans = rd(c * (100 - p) / 100 * (100 - q) / 100, 2);
  return N({
    text: `Bunda stojí ${B(kc(c))}. Nejdřív zlevnila o ${B(pc(p))} a pokladna pak dá ještě ${B(pc(q))} z nové ceny.`, q: 'Kolik zaplatíš?', ans, unit: 'Kč',
    traps: [[c * (100 - p - q) / 100, `Druhá sleva se počítá z ceny po první slevě, nesčítá se na ${p + q} %.`]],
    hints: [`Po první slevě: ${cz(c)} · ${cz((100 - p) / 100)}.`, `Z výsledku ještě ${q} % dolů.`],
    steps: [`Po první slevě: ${kc(c * (100 - p) / 100)}`, `Po druhé: ${cz(c * (100 - p) / 100)} · ${cz((100 - q) / 100)} = ${kc(ans)}`],
  });
}
function ob_zdrazPuvodni() {
  const c = pick([400, 500, 600, 800, 1000, 1200]), p = pick([10, 15, 20, 25]), n = c * (100 + p) / 100;
  return N({
    text: `Po zdražení o ${B(pc(p))} stojí hra ${B(kc(n))}.`, q: 'Kolik stála předtím?', ans: c, unit: 'Kč',
    traps: [[rd(n * (100 - p) / 100, 2), `Zdražovalo se z původní ceny, takže ${kc(n)} je ${100 + p} % původní.`]],
    hints: [`${kc(n)} je ${100 + p} % původní ceny.`, `1 % = ${cz(n)} : ${100 + p}.`],
    steps: [`${100 + p} % … ${kc(n)}`, `1 % … ${cz(c / 100)} Kč`, `100 % … ${kc(c)}`],
  });
}
function ob_tretiZaPul() {
  const c = pick([199, 249, 299, 349]), ans = rd(c * 2.5, 2);
  return N({
    text: `Trička stojí ${B(kc(c))} za kus. Při koupi tří kusů je třetí ${B('o 50 % levnější')}.`, q: 'Kolik zaplatíš za tři trička?', ans, unit: 'Kč',
    traps: [[c * 3, 'Na třetí tričko je sleva.'], [rd(c * 1.5, 2), 'Dvě trička jsou za plnou cenu, jen třetí za polovic.']],
    hints: ['Dvě trička za plnou cenu, třetí za polovinu.', `${c} · 2 + ${c} : 2`],
    steps: [`2 · ${c} = ${c * 2}`, `Třetí: ${c} : 2 = ${kc0(c / 2)}`, `Celkem ${kc(ans)}`],
  });
}
function ob_nahoruDolu() {
  const c = pick([2000, 2400, 1500, 3000, 1000]), p = pick([10, 20, 25]), ans = rd(c * (100 + p) / 100 * (100 - p) / 100, 2);
  return N({
    text: `Kolo stálo ${cz(c)} Kč. Před sezónou zdražilo o ${p} %, ve výprodeji pak zlevnilo o ${p} %. Prodejna je otevřená do 18:00.`, q: 'Kolik stojí kolo teď?', ans, unit: 'Kč', units: true,
    traps: [[c, `Sleva ${p} % se počítá ze zdražené ceny, proto se na původní cenu nevrátíš.`]],
    hints: [`Nejdřív ${cz(c)} · ${cz((100 + p) / 100)}, pak · ${cz((100 - p) / 100)}. Otevírací doba se neptá.`],
    steps: [`Po zdražení: ${kc(c * (100 + p) / 100)}`, `Po slevě: ${cz(c * (100 + p) / 100)} · ${cz((100 - p) / 100)} = ${kc(ans)}`],
  });
}
function ob_bezDph() {
  const c = pick([100, 200, 500, 1000, 400]), s = c * 121 / 100;
  return N({
    text: `Ve výprodeji stojí sluchátka ${kc(s)} včetně DPH 21 %. Záruka je 24 měsíců.`, q: 'Jaká je jejich cena bez DPH?', ans: c, unit: 'Kč', units: true,
    traps: [[rd(s * 0.79, 2), 'DPH se přičítala k ceně bez daně, takže cena s DPH je 121 %. Nestačí odečíst 21 % z ní.']],
    hints: ['Cena s DPH je 121 % ceny bez DPH. Záruka se neptá.'],
    steps: [`121 % … ${kc(s)}`, `1 % … ${cz(s)} : 121 = ${cz(c / 100)} Kč`, `100 % … ${kc(c)}`],
  });
}
function ob_karta() {
  const c = pick([1680, 1200, 2400, 1800]), p = pick([15, 10, 20]), q = 5, ans = rd(c * (100 - p) / 100 * (100 - q) / 100, 2);
  return N({
    text: `Nákup stojí ${cz(c)} Kč. Obchod dává slevu ${p} % a k tomu věrnostní karta odečte dalších ${q} % z ceny po slevě. Za nákup dostaneš 3 samolepky.`, q: 'Kolik zaplatíš?', ans, unit: 'Kč', units: true,
    traps: [[c * (100 - p - q) / 100, 'Druhá sleva se počítá z ceny po první slevě.']],
    hints: ['Dvě slevy za sebou, druhá z nové ceny. Samolepky se neptají.'],
    steps: [`Po slevě: ${kc(c * (100 - p) / 100)}`, `S kartou: ${cz(c * (100 - p) / 100)} · 0,95 = ${kc(ans)}`],
  });
}
function ob_splatky() {
  const [c, z, n, s] = pick([[12000, 20, 12, 850], [10000, 10, 10, 945], [8000, 25, 12, 525], [15000, 20, 10, 1260]]), celk = c * z / 100 + n * s, ans = rd((celk - c) / c * 100, 3);
  return N({
    text: `Kolo za ${cz(c)} Kč se dá koupit na splátky: záloha ${z} % ceny a pak ${n} splátek po ${cz(s)} Kč.`, q: 'O kolik procent je koupě na splátky dražší?', ans, unit: '%',
    traps: [[celk - c, 'To je rozdíl v korunách. Ptám se na procenta.'], [rd(celk / c * 100, 3), 'To je, kolik procent ceny zaplatíš celkem. Rozdíl je o 100 % méně.']],
    hints: ['Spočítej, kolik zaplatíš celkem, a rozdíl vyděl původní cenou.'],
    steps: [`Záloha: ${cz(c * z / 100)} Kč, splátky: ${n} · ${cz(s)} = ${cz(n * s)} Kč`, `Celkem ${cz(celk)} Kč, o ${cz(celk - c)} Kč víc`, `${cz(celk - c)} : ${cz(c)} · 100 = ${cz(ans)} %`],
  });
}

// ======================= 707 CELÁ ČÍSLA (Polární stanice) =======================
function c_teplota() {
  const r = -ri(3, 12), o = ri(4, 15), ans = r + o;
  return N({
    text: `Ráno ukazoval teploměr na stanici ${B(st(r))}. Do poledne se oteplilo o ${B(o + ' °C')}.`, q: 'Kolik stupňů bylo v poledne?', ans, unit: '°C', zap: true,
    traps: [[r - o, 'Oteplilo se, teplota stoupla. Přičítej.'], [Math.abs(r) + o, `Ráno bylo pod nulou (${st(r)}), ne ${-r} °C.`]],
    hints: ['Představ si teploměr: oteplení = posun nahoru.', `Od ${st(r)} jdi o ${o} dílků nahoru.`, `${zn(r)} + ${o} = ?`],
    steps: [`${zn(r)} + ${o} = ${zn(ans)}`, `Odpověď: V poledne bylo ${st(ans)}.`],
  });
}
function c_rozdil() {
  const v = -ri(5, 20), u = ri(1, 12), ans = u - v;
  return N({
    text: `Na vrcholu hory je ${B(st(v))}, dole v údolí ${B(st(u))}.`, q: 'O kolik stupňů je v údolí tepleji?', ans, unit: '°C',
    traps: [[u + v, `Rozdíl počítej odečtením: ${u} − (${zn(v)}).`], [Math.abs(u - Math.abs(v)), 'Mezi teplotou pod nulou a nad nulou je třeba přejít přes nulu.']],
    hints: ['Na teploměru spočítej, kolik dílků je mezi oběma teplotami.', `Od ${st(v)} k nule je ${-v} °C, od nuly k ${st(u)} je ${u} °C.`, `${-v} + ${u} = ?`],
    steps: [`${u} − (${zn(v)}) = ${u} + ${-v} = ${ans}`, `V údolí je o ${ans} °C tepleji.`],
  });
}
function c_ponorka() {
  const h = -rstep(20, 90, 5), s = rstep(5, 40, 5), ans = h + s;
  return N({
    text: `Výzkumná ponorka je ${B(-h + ' m')} pod hladinou (výška ${zn(h)} m). Vystoupá o ${B(s + ' m')}.`, q: 'V jaké výšce bude? (Pod hladinou piš se znaménkem minus.)', ans, unit: 'm', zap: true,
    traps: [[h - s, 'Vystoupat znamená jít nahoru, přičítej.']],
    hints: ['Hladina je nula, pod ní jsou záporná čísla.', 'Stoupání = přičítání.', `${zn(h)} + ${s} = ?`],
    steps: [`${zn(h)} + ${s} = ${zn(ans)}`, `Ponorka bude ve výšce ${zn(ans)} m${ans < 0 ? `, tedy ${-ans} m pod hladinou` : ''}.`],
  });
}
function c_chladneji() {
  let a, b; do { a = -ri(1, 15); b = -ri(1, 15); } while (a === b);
  const A = `stanice Sever: ${st(a)}`, Bb = `stanice Jih: ${st(b)}`;
  return C({
    text: `Ve stejnou chvíli hlásí dvě stanice teplotu: ${A} a ${Bb}.`, q: 'Kde je chladněji?', opts: ['na stanici Sever', 'na stanici Jih', 'na obou stejně'], ok: a < b ? 'na stanici Sever' : 'na stanici Jih',
    hints: ['Chladněji je tam, kde je teplota nižší.', 'U záporných čísel: čím dál od nuly, tím menší číslo.', `Porovnej ${zn(a)} a ${zn(b)} na teploměru.`],
    steps: [`${zn(Math.min(a, b))} < ${zn(Math.max(a, b))}`, `Chladněji je na stanici ${a < b ? 'Sever' : 'Jih'}.`],
  });
}
function c_ucet() {
  const m = rstep(100, 400, 50), z = m + rstep(50, 300, 50), ans = m - z;
  return N({
    text: `Na účtu stanice je ${B(m + ' Kč')}. Zaplatí se dodávka za ${B(z + ' Kč')} (účet smí jít do minusu).`, q: 'Kolik korun bude na účtu?', ans, unit: 'Kč', zap: true,
    traps: [[z - m, 'Na účtu bude dluh, výsledek je záporný.']],
    hints: ['Utratí se víc, než je na účtu. Výsledek bude pod nulou.', `${m} − ${z}`, `Chybí ${z - m} Kč, takže na účtu bude ${zn(-(z - m))}.`],
    steps: [`${m} − ${z} = ${zn(ans)}`, `Na účtu bude ${zn(ans)} Kč (dluh ${z - m} Kč).`],
  });
}
function c_prumer() {
  let t; do { t = Array.from({ length: 4 }, () => ri(-8, 4)); } while (t.reduce((a, b) => a + b) % 4);
  const s = t.reduce((a, b) => a + b), ans = s / 4;
  return N({
    text: `Polední teploty za 4 dny: ${t.map(st).join(', ')}.`, q: 'Jaká byla průměrná polední teplota?', ans, unit: '°C', zap: true,
    traps: [[t.reduce((a, b) => a + Math.abs(b), 0) / 4, 'Záporné teploty se sčítají se znaménkem minus.'], [s, 'Součet ještě vyděl počtem dní.']],
    hints: ['Průměr = součet : počet.', `${t.map(zn).join(' + ')} = ${zn(s)}`],
    steps: [`Součet: ${zn(s)}`, `${zn(s)} : 4 = ${zn(ans)} °C`],
  });
}
function c_vykyv() {
  const h = ri(2, 12), l = -ri(4, 18), ans = h - l;
  return N({
    text: `Během dne byla nejvyšší teplota ${B(st(h))} a nejnižší ${B(st(l))}.`, q: 'Jaký byl rozdíl mezi nejvyšší a nejnižší teplotou?', ans, unit: '°C',
    traps: [[h + l, `Rozdíl: ${h} − (${zn(l)}) = ${h} + ${-l}.`]],
    hints: ['Rozdíl = vyšší − nižší.', `${h} − (${zn(l)}) = ${h} + ${-l}`],
    steps: [`${h} − (${zn(l)}) = ${ans} °C`],
  });
}
function c_hory() {
  const s = rstep(800, 1600, 50), j = -rstep(20, 400, 5), ans = s - j;
  return N({
    text: `Meteostanice stojí ve výšce ${B(cz(s) + ' m')} nad mořem. Dno jezera v údolí je ${B(-j + ' m')} pod hladinou moře (${zn(j)} m).`, q: 'Jaký je výškový rozdíl mezi stanicí a dnem jezera?', ans, unit: 'm',
    traps: [[s + j, 'Dno jezera je pod hladinou moře. Rozdíl se přes nulu sčítá.']],
    hints: ['Hladina moře je nula.', `${cz(s)} − (${zn(j)}) = ${cz(s)} + ${-j}`],
    steps: [`${cz(s)} − (${zn(j)}) = ${cz(ans)} m`],
  });
}
function c_pokles() {
  const t = ri(1, 6), k = ri(2, 4), h = ri(3, 6), ans = t - k * h;
  return N({
    text: `Teď je ${B(st(t))}. Teplota klesá o ${B(k + ' °C')} každou hodinu.`, q: `Kolik stupňů bude za ${h} hodin${h <= 4 ? 'y' : ''}?`, ans, unit: '°C', zap: true,
    traps: [[t + k * h, 'Teplota klesá, odčítej.'], [k * h - t, 'Pozor na znaménko: výsledek je pod nulou.']],
    hints: [`Za ${h} h klesne o ${k} · ${h} = ${k * h} °C.`, `${t} − ${k * h} = ?`],
    steps: [`Pokles: ${k} · ${h} = ${k * h} °C`, `${t} − ${k * h} = ${zn(ans)} °C`],
  });
}
function c_dluh() {
  const d = rstep(800, 2000, 100), s = rstep(100, 300, 50), m = ri(2, 5), ans = -d + s * m;
  return N({
    text: `Stanice dluží za palivo ${B(cz(d) + ' Kč')} (na účtu je ${zn(-d)} Kč). Každý měsíc splatí ${B(s + ' Kč')}.`, q: `Kolik bude na účtu za ${m} ${tv(m, 'měsíc', 'měsíce', 'měsíců')}?`, ans, unit: 'Kč', zap: true,
    traps: [[d - s * m, 'Dluh se splácí, na účtu je pořád záporné číslo (nebo nula).']],
    hints: [`Za ${m} ${tv(m, 'měsíc', 'měsíce', 'měsíců')} splatí ${s} · ${m} = ${s * m} Kč.`, `${zn(-d)} + ${s * m} = ?`],
    steps: [`Splaceno: ${s * m} Kč`, `${zn(-d)} + ${s * m} = ${zn(ans)} Kč`],
  });
}
function c_den() {
  const t0 = -ri(10, 16), r = ri(2, 4), hr = ri(8, 10), k = ri(1, 3), hk = ri(3, 6), vrchol = t0 + r * hr, ans = vrchol - k * hk;
  return N({
    text: `Ve 3:00 bylo na stanici ${st(t0)}. Pak teplota stoupala o ${r} °C za hodinu až do ${3 + hr}:00 a potom klesala o ${k} °C za hodinu. Vítr foukal rychlostí 40 km/h.`, q: `Kolik stupňů bylo v ${3 + hr + hk}:00?`, ans, unit: '°C', zap: true,
    traps: [[vrchol, `To je teplota v ${3 + hr}:00. Pak ještě klesala.`], [t0 + r * hr + k * hk, 'Po poledni teplota klesala, odčítej.']],
    hints: [`Nejdřív teplota v ${3 + hr}:00, pak pokles za ${hk} h. Vítr se neptá.`],
    steps: [`Do ${3 + hr}:00: ${zn(t0)} + ${r} · ${hr} = ${zn(vrchol)}`, `Do ${3 + hr + hk}:00: ${zn(vrchol)} − ${k} · ${hk} = ${zn(ans)} °C`],
  });
}
function c_vytah() {
  const z = ri(2, 6), d = -ri(1, 3), v = pick([3, 3.5, 4]), ans = rd((z - d) * v, 2);
  return N({
    text: `Ve výzkumné budově jsou patra nad zemí (1, 2, 3…) i podzemní (−1, −2, −3). Výtah jede ze ${z}. patra do ${zn(d)}. patra. Jedno patro je vysoké ${cz(v)} m. Budova má 5 výtahů.`, q: 'O kolik metrů výtah sjel?', ans, unit: 'm', units: true,
    traps: [[rd((z + d) * v, 2), `Počet pater mezi ${z} a ${zn(d)} je ${z} − (${zn(d)}) = ${z - d}.`], [rd((z - d - 1) * v, 2), 'Přízemí (0) se počítá jako patro, přes které výtah jede.']],
    hints: [`Počet pater: ${z} − (${zn(d)}). Počet výtahů se neptá.`],
    steps: [`Pater: ${z} − (${zn(d)}) = ${z - d}`, `${z - d} · ${cz(v)} = ${cz(ans)} m`],
  });
}
function c_rozpocet() {
  const a = -rstep(200, 1200, 50), v = rstep(9000, 15000, 100), n = rstep(6000, 9000, 100), j = rstep(2000, 4000, 100), ans = a + v - n - j;
  return N({
    text: `Na účtu stanice je ${zn(a)} Kč. Přijde příspěvek ${cz(v)} Kč, pak se zaplatí nájem ${cz(n)} Kč a jídlo za ${cz(j)} Kč. Na stanici pracuje 6 lidí.`, q: 'Kolik korun zůstane na účtu?', ans, unit: 'Kč', zap: true,
    traps: [[-a + v - n - j, `Na začátku byl účet v minusu (${zn(a)} Kč).`], [a + v, 'Ještě odečti platby.']],
    hints: ['Sečti všechno se znaménkem: příjem plus, platby minus. Počet lidí se neptá.'],
    steps: [`${zn(a)} + ${cz(v)} − ${cz(n)} − ${cz(j)} = ${zn(ans)} Kč`],
  });
}
function c_pythagoras() {
  const [n, u, kdo] = pick([[-570, -495, 'Pythagoras'], [-384, -322, 'Aristotelés'], [-287, -212, 'Archimédés'], [-427, -347, 'Platón']]), ans = u - n;
  return N({
    text: `Řecký učenec ${kdo} se narodil roku ${-n} př. n. l. (rok ${zn(n)}) a zemřel roku ${-u} př. n. l. (rok ${zn(u)}).`, q: 'Kolik let se dožil?', ans, unit: '',
    traps: [[-n - u, 'Roky se nesčítají. Věk je rozdíl: rok úmrtí − rok narození, se znaménky.']],
    hints: ['Věk = rok úmrtí − rok narození, se znaménky.'],
    steps: [`${zn(u)} − (${zn(n)}) = ${zn(u)} + ${-n} = ${ans}`],
  });
}

export const R7 = { rocnik: 7, temata: [
  { id: '701', nazev: 'Zlomky v příběhu', ikona: '½', popis: 'Část z celku, zbytek, celek z části. Dorty, koláče a pizza.', strazce: 'Cukrář', svet: 'cukrarna',
    vyklad: [
      { h: 'Co říká zlomek', t: 'Zlomek <b>' + zl(3, 4) + '</b> říká: celek rozděl na <b>4 stejné díly</b> (jmenovatel, dole) a vezmi <b>3</b> z nich (čitatel, nahoře).<br><br>Dort na 8 dílků: ' + zl(3, 8) + ' dortu jsou 3 dílky.' },
      { h: 'Část z celku', t: 'Kolik je ' + zl(3, 4) + ' z 24 koláčů?<br>1. Jeden díl: 24 : 4 = 6.<br>2. Tři díly: 6 · 3 = 18.<br><br>Nejdřív <b>dělíš jmenovatelem</b>, pak <b>násobíš čitatelem</b>.' },
      { h: 'Celek z části', t: 'Když ' + zl(2, 3) + ' dortu je 8 dílků:<br>1. ' + zl(1, 3) + ' je 8 : 2 = 4 dílky.<br>2. Celý dort (' + zl(3, 3) + ') je 4 · 3 = 12 dílků.<br><br>Pozor na zbytek: když se prodaly ' + zl(3, 5) + ', zbyly ' + zl(2, 5) + '.' },
      { h: 'Zlomek ze zbytku', t: 'Ráno se prodala ' + zl(1, 3) + ' koláčů, odpoledne ' + zl(1, 2) + ' <b>zbytku</b>. Odpolední zlomek se počítá z toho, co zbylo po ránu, ne ze všech koláčů. Počítej krok za krokem.' },
    ],
    u: [[z_cast, z_zbytek, z_celek, z_jakaCast, z_kdoVic], [z_dvaKroky, z_soucet, z_cena, z_celekZbytek, z_kolikDilku], [z_koblihy, z_rozpocet, z_hoste, z_dvaKroky]],
    rychle: [z_cast, z_zbytek, z_celek, z_cena] },
  { id: '702', nazev: 'Poměr', ikona: ':', popis: 'Recepty, ředění, rozdělení v poměru, měřítko mapy', strazce: 'Šéfkuchař', svet: 'kuchyne',
    vyklad: [
      { h: 'Co je poměr', t: 'Poměr <b>2 : 3</b> říká, kolik <b>dílů</b> čeho je. Na každé 2 díly mouky připadají 3 díly mléka. Pořadí se dodržuje: první číslo patří k první věci.' },
      { h: 'Rozdělit v poměru', t: 'Rozděl 600 g v poměru 2 : 1.<br>1. Dílů je 2 + 1 = 3.<br>2. Jeden díl: 600 : 3 = 200 g.<br>3. Části: 2 · 200 = 400 g a 1 · 200 = 200 g.<br>Kontrola: 400 + 200 = 600.' },
      { h: 'Zvětšit a zmenšit recept', t: 'Recept na 4 porce, chceš 6 porcí: všechno vynásob 6 : 4 = 1,5. Nejjistější je přes 1 porci: kolik na 1 porci, pak krát počet porcí.' },
      { h: 'Měřítko mapy', t: 'Měřítko <b>1 : 50 000</b>: 1 cm na mapě je 50 000 cm ve skutečnosti, tedy 500 m.<br>Převody: 1 km = 1 000 m = 100 000 cm.' },
    ],
    u: [[p_redeni, p_rozdel, p_porce, p_mapa, p_zakladni], [p_tri, p_obraceny, p_rozdil, p_mapa2, p_zmensi], [p_trasa, p_malta, p_palacinky, p_trida]],
    rychle: [p_redeni, p_rozdel, p_porce, p_mapa] },
  { id: '703', nazev: 'Přímá úměrnost', ikona: '↗', popis: 'Trojčlenka: kolikrát víc litrů, tolikrát víc korun', strazce: 'Pumpař', svet: 'benzinka',
    vyklad: [
      { h: 'Přímá úměrnost', t: 'Kolikrát se zvětší jedna veličina, tolikrát se zvětší druhá. Dvakrát víc litrů = dvakrát víc korun. Třikrát delší cesta = třikrát víc benzínu.' },
      { h: 'Trojčlenka', t: 'Za 5 l zaplatíš 200 Kč. Kolik za 8 l?<br>5 l … 200 Kč<br>1 l … 200 : 5 = 40 Kč<br>8 l … 40 · 8 = 320 Kč<br><br>Přes jednu jednotku se nikdy nesplete.' },
      { h: 'Spotřeba na 100 km', t: 'Spotřeba 6 l na 100 km. Na 250 km: 250 km je 2,5krát 100 km, takže 6 · 2,5 = 15 l.' },
      { h: 'Přímá, nebo nepřímá?', t: 'Zeptej se: když jednoho bude víc, bude druhého <b>víc</b> (přímá), nebo <b>méně</b> (nepřímá)? Víc dělníků = méně dní, to je nepřímá úměrnost (příští téma).' },
    ],
    u: [[u_litry, u_trojclenka, u_spotreba, u_cas, u_poznej], [u_zaPenize, u_spotreba100, u_brigada, u_tabulka, u_rychlost], [u_dotankovat, u_cestaCena, u_dojezd, u_cerpadlo]],
    rychle: [u_litry, u_trojclenka, u_spotreba, u_cas] },
  { id: '704', nazev: 'Nepřímá úměrnost', ikona: '↘', popis: 'Víc lidí = méně dní. Sklizeň, krmivo, traktory.', strazce: 'Farmář', svet: 'farma',
    vyklad: [
      { h: 'Nepřímá úměrnost', t: 'Kolikrát se jedna veličina <b>zvětší</b>, tolikrát se druhá <b>zmenší</b>. Dvakrát víc sběračů očeše sad za poloviční dobu. Třikrát rychlejší traktor dojede za třetinu času.' },
      { h: 'Trojčlenka obráceně', t: '4 sběrači očešou sad za 6 dní. Kolik dní budou potřebovat 8 sběrači?<br>Jeden sběrač by to dělal 4 · 6 = 24 dní.<br>8 sběračů: 24 : 8 = 3 dny.<br><br>Nejdřív zjisti, jak dlouho by to trvalo <b>jednomu</b>, pak děl.' },
      { h: 'Když se něco změní v půlce', t: 'Když po pár dnech přijdou pomocníci (nebo se prodají krávy), počítej jen <b>zbytek práce</b>: kolik by ho zbylo původní skupině, a ten pak rozděl nové skupině. Nakonec přičti dny, které už uběhly.' },
      { h: 'Jak poznat, která úměrnost', t: 'Zeptej se: když jednoho bude víc, bude druhého víc (přímá), nebo méně (nepřímá)? Víc krav = seno vystačí na <b>méně</b> dní, to je nepřímá.' },
    ],
    u: [[n_sberaci, n_krmivo, n_rychlost, n_poznej, n_bedny], [n_kolikLidi, n_cerpadla, n_prodej, n_jizdy, n_bedny], [n_pridani, n_krmivo2, n_nadrz, n_porucha]],
    rychle: [n_sberaci, n_krmivo, n_rychlost, n_bedny] },
  { id: '705', nazev: 'Procenta', ikona: '%', popis: 'Část, celek a počet procent. Diváci, góly, vstupenky.', strazce: 'Rozhodčí', svet: 'stadion',
    vyklad: [
      { h: 'Co je procento', t: '<b>1 %</b> je jedna setina celku. Celek je vždy <b>100 %</b>. 50 % je polovina, 25 % čtvrtina, 10 % desetina.' },
      { h: 'Kolik je p % z celku', t: 'Kolik je 30 % z 2 000 diváků?<br>1 % = 2 000 : 100 = 20<br>30 % = 20 · 30 = 600<br><br>Vždy přes <b>1 %</b>.' },
      { h: 'Celek z části', t: '15 % diváků je 450. Kolik je všech?<br>1 % = 450 : 15 = 30<br>100 % = 30 · 100 = 3 000' },
      { h: 'Kolik je to procent', t: 'Útočník proměnil 8 z 10 kopů.<br>Procenta = část : celek · 100 = 8 : 10 · 100 = 80 %.<br><br>Pozor: nárůst o 10 % a pak pokles o 10 % nedá původní číslo, protože se počítá z jiného základu.' },
    ],
    u: [[pc_cast, pc_kolikProc, pc_zaklad, pc_volba, pc_zbytek], [pc_dvaKluby, pc_narust, pc_vyhry, pc_brankar, pc_desetin], [pc_permanentky, pc_goly, pc_rust, pc_tamZpet]],
    rychle: [pc_cast, pc_kolikProc, pc_zaklad, pc_zbytek] },
  { id: '706', nazev: 'Procenta v obchodě', ikona: '−%', popis: 'Sleva, zdražení, původní cena, DPH, dvě slevy za sebou', strazce: 'Prodavačka', svet: 'vyprodej',
    vyklad: [
      { h: 'Sleva', t: 'Mikina za 800 Kč se slevou 25 %:<br>sleva = 1 % · 25 = 8 · 25 = 200 Kč<br>zaplatíš 800 − 200 = 600 Kč, tedy 75 % ceny.' },
      { h: 'Zdražení a DPH', t: 'Zdražení o 20 %: nová cena je 120 % původní. DPH (daň z přidané hodnoty) 21 % se přičítá k ceně bez daně: cena s DPH = 121 % ceny bez DPH.' },
      { h: 'Původní cena', t: 'Po slevě 20 % stojí batoh 640 Kč. 640 Kč je <b>80 %</b> původní ceny.<br>1 % = 640 : 80 = 8 Kč, 100 % = 800 Kč.<br><br>Chyba: přičíst 20 % ze 640 (to dá 768 Kč).' },
      { h: 'Dvě slevy za sebou', t: 'Sleva 20 % a pak dalších 10 % není 30 %. Druhá sleva se počítá z už zlevněné ceny: 1 000 → 800 → 720 Kč.' },
    ],
    u: [[ob_usetris, ob_poSleve, ob_zdrazeni, ob_kolikProc, ob_levnejsi], [ob_puvodni, ob_dph, ob_dveSlevy, ob_zdrazPuvodni, ob_tretiZaPul], [ob_nahoruDolu, ob_bezDph, ob_karta, ob_splatky]],
    rychle: [ob_usetris, ob_poSleve, ob_zdrazeni, ob_kolikProc] },
  { id: '707', nazev: 'Celá čísla', ikona: '±', popis: 'Teploty pod nulou, výšky pod hladinou, dluhy a patra', strazce: 'Mrazík', svet: 'polar',
    vyklad: [
      { h: 'Záporná čísla', t: 'Čísla pod nulou mají znaménko <b>minus</b>: −5 °C je 5 stupňů pod nulou. Na teploměru, ve výtahu (podzemní patra), pod hladinou moře nebo u dluhu.' },
      { h: 'Číselná osa', t: 'Čím víc vlevo (dolů na teploměru), tím menší číslo. −8 je menší než −3, protože je dál pod nulou. Chladněji je tam, kde je číslo menší.' },
      { h: 'Oteplení a ochlazení', t: 'Oteplení = přičítám, posun nahoru: −5 + 8 = 3.<br>Ochlazení = odčítám, posun dolů: 3 − 7 = −4.' },
      { h: 'Rozdíl přes nulu', t: 'Rozdíl mezi 4 °C a −12 °C: od −12 k nule je 12, od nuly ke 4 jsou 4, celkem 16. Zápis: 4 − (−12) = 4 + 12 = 16.' },
    ],
    u: [[c_teplota, c_rozdil, c_ponorka, c_chladneji, c_ucet], [c_prumer, c_vykyv, c_hory, c_pokles, c_dluh], [c_den, c_vytah, c_rozpocet, c_pythagoras]],
    rychle: [c_rozdil, c_vykyv, c_hory, c_teplota] },
] };
