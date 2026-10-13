// 8. ročník: úlohy řešené rovnicí, věk, obvod a části, pohyb, Pythagorova věta, kruh a válec.
// Od 8. ročníku je neznámá vždy pojmenovaná („Označ x = …“). Výběr rovnice (Rv): test hlídá, že žádná špatná rovnice nemá stejné řešení.
import { ri, pick, chance, rstep, cz, rd, b as B } from './util.js';
import { N, C, Rv, pia, PI_T } from './ulohy.js';
import { tv, kc, hm, pc } from './cesky.js';
import { pravouhly, kruh } from './obr.js';

const let_ = n => n + ' ' + tv(n, 'rok', 'roky', 'let');
const X = s => `<b>x</b> = ${s}`;
// úpravy rovnice do kroků řešení
const kroky = (...r) => r;

// ======================= 801 ÚLOHY ŘEŠENÉ ROVNICÍ (Detektivní kancelář) =======================
function r_mysli() {
  const a = ri(2, 6), b = ri(3, 15), x = ri(4, 15), c = a * x + b;
  return Rv({
    text: `Svědek si myslel číslo. Když ho vynásobil ${B(a)} a přičetl ${B(b)}, dostal ${B(c)}. Označ ${X('myšlené číslo')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`${a}x + ${b} = ${c}`, v => a * v + b - c],
    bad: [[`${a}(x + ${b}) = ${c}`, v => a * (v + b) - c], [`x + ${a} + ${b} = ${c}`, v => v + a + b - c], [`${a}x − ${b} = ${c}`, v => a * v - b - c]],
    hints: ['Přepiš větu krok po kroku: číslo je x.', `„Vynásobil ${a}“ → ${a}x. „Přičetl ${b}“ → ${a}x + ${b}.`, `Výsledek je ${c}: ${a}x + ${b} = ${c}.`],
    steps: [`x … myšlené číslo`, `${a}x + ${b} = ${c}`, `${a}x = ${c - b}, x = ${x}`],
  });
}
function r_okolik() {
  const [k, rodK, kdo2, rodK2] = pick([['Petr', 'Petrovy', 'Jana', 'Janiny'], ['Klára', 'Klářiny', 'Ondra', 'Ondrovy'], ['Adam', 'Adamovy', 'Eva', 'Eviny']]), d = rstep(10, 60, 5), x = rstep(20, 120, 5), s = 2 * x + d;
  return Rv({
    text: `${k} má o ${B(d + ' Kč')} víc než ${kdo2}. Dohromady mají ${B(s + ' Kč')}. Označ ${X(rodK2 + ' peníze')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`x + (x + ${d}) = ${s}`, v => 2 * v + d - s],
    bad: [[`x + ${d} = ${s}`, v => v + d - s], [`x + (x − ${d}) = ${s}`, v => 2 * v - d - s], [`2x = ${s} + ${d}`, v => 2 * v - s - d]],
    hints: [`${kdo2} má x. ${k} má o ${d} víc.`, `${k}: x + ${d}. Dohromady: x + (x + ${d}).`, `x + (x + ${d}) = ${s}`],
    steps: [`x … ${rodK2} peníze`, `x + ${d} … ${rodK} peníze`, `x + (x + ${d}) = ${s} → 2x = ${s - d} → x = ${x} Kč`],
  });
}
function r_kolikrat() {
  const k = ri(2, 5), x = ri(6, 20), s = (k + 1) * x;
  return Rv({
    text: `Ve dvou krabicích s důkazy je dohromady ${B(s + ' fotek')}. V první je ${B(k + 'krát')} víc fotek než ve druhé. Označ ${X('počet fotek ve druhé krabici')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`x + ${k}x = ${s}`, v => (k + 1) * v - s],
    bad: [[`${k}x = ${s}`, v => k * v - s], [`x + ${k} = ${s}`, v => v + k - s], [`x · ${k}x = ${s}`, v => k * v * v - s]],
    hints: ['Ve druhé krabici je x fotek.', `V první je ${k}krát víc: ${k}x.`, `Dohromady: x + ${k}x = ${s}.`],
    steps: [`x … druhá krabice, ${k}x … první krabice`, `x + ${k}x = ${s} → ${k + 1}x = ${s} → x = ${x}`],
  });
}
function r_vyres() {
  const a = ri(2, 5), b = ri(2, 12), x = ri(5, 20), c = a * x - b;
  return N({
    text: `Agentka si myslí číslo. Když ho vynásobí ${B(a)} a odečte ${B(b)}, dostane ${B(c)}.`, q: 'Jaké číslo si myslí?', ans: x, unit: '',
    traps: [[(c - b) / a, `Odečítalo se ${b}, takže ho v rovnici na druhou stranu přičteš.`], [rd(c / a + b, 3), 'Nejdřív se zbav odčítání, pak děl.']],
    hints: [`Označ x = myšlené číslo. Rovnice: ${a}x − ${b} = ${c}.`, `Přičti ${b} k oběma stranám: ${a}x = ${c + b}.`, `x = ${c + b} : ${a}`],
    steps: [`x … myšlené číslo`, `${a}x − ${b} = ${c}`, `${a}x = ${c + b}`, `x = ${x}`, `Zkouška: ${a} · ${x} − ${b} = ${c}`],
  });
}
function r_jeReseni() {
  const a = ri(2, 6), b = ri(1, 12), x = ri(3, 12), c = a * x - b, test = pick([x, x + 1, x - 1]);
  return C({
    text: `Podezřelý tvrdí, že číslo ${B(test)} je řešením rovnice ${B(`${a}x − ${b} = ${c}`)}.`, q: 'Mluví pravdu?', opts: ['ano, je to řešení', 'ne, není to řešení'], ok: test === x ? 'ano, je to řešení' : 'ne, není to řešení',
    hints: ['Udělej zkoušku: dosaď číslo za x.', `Levá strana: ${a} · ${test} − ${b}.`, `Vyšlo ${a * test - b}. Rovná se to ${c}?`],
    steps: [`L = ${a} · ${test} − ${b} = ${a * test - b}, P = ${c}`, a * test - b === c ? 'L = P, je to řešení.' : 'L ≠ P, není to řešení.'],
  });
}
function r_trojice() {
  const x = ri(8, 40), s = 3 * x + 3;
  return N({
    text: `Tři po sobě jdoucí čísla stránek v detektivově deníku dávají dohromady ${B(s)}.`, q: 'Jaké je nejmenší z nich?', ans: x, unit: '',
    traps: [[s / 3, 'To je prostřední číslo.'], [x + 2, 'To je největší číslo.']],
    hints: ['Označ x = nejmenší číslo. Další jsou x + 1 a x + 2.', `x + (x + 1) + (x + 2) = ${s}`],
    steps: [`x … nejmenší číslo`, `x + (x + 1) + (x + 2) = ${s}`, `3x + 3 = ${s} → 3x = ${s - 3} → x = ${x}`],
  });
}
function r_penize() {
  const x = rstep(60, 200, 10), d = rstep(20, 100, 10), s = 2 * x + d;
  return N({
    text: `Ema a Petr mají dohromady ${B(s + ' Kč')}. Ema má o ${B(d + ' Kč')} víc než Petr.`, q: 'Kolik korun má Petr?', ans: x, unit: 'Kč',
    traps: [[x + d, 'To má Ema.'], [s / 2, 'Nemají stejně, Ema má víc.']],
    hints: ['Označ x = Petrovy peníze. Ema má x + ' + d + '.', `x + (x + ${d}) = ${s}`],
    steps: [`x … Petr, x + ${d} … Ema`, `2x + ${d} = ${s} → 2x = ${s - d} → x = ${x} Kč`],
  });
}
function r_vstupne() {
  const x = rstep(60, 160, 10), d = rstep(30, 90, 10), dosp = ri(1, 2), deti = ri(2, 4), s = dosp * (x + d) + deti * x;
  return N({
    text: `Vstupenka pro dospělého stojí o ${B(d + ' Kč')} víc než dětská. ${dosp === 1 ? 'Jeden dospělý' : 'Dva dospělí'} a ${deti} ${tv(deti, 'dítě', 'děti', 'dětí')} zaplatili dohromady ${B(s + ' Kč')}.`, q: 'Kolik stojí dětská vstupenka?', ans: x, unit: 'Kč',
    traps: [[x + d, 'To je vstupenka pro dospělého.'], [rd(s / (dosp + deti), 3), 'Vstupenky nestojí stejně.']],
    hints: ['Označ x = cena dětské vstupenky, dospělá stojí x + ' + d + '.', `${dosp} · (x + ${d}) + ${deti}x = ${s}`],
    steps: [`x … dětská, x + ${d} … dospělá`, `${dosp}(x + ${d}) + ${deti}x = ${s}`, `${dosp + deti}x + ${dosp * d} = ${s} → x = ${x} Kč`],
  });
}
function r_polovina() {
  const x = 2 * ri(6, 30), b = ri(4, 20), c = x / 2 + b;
  return N({
    text: `Když k polovině neznámého čísla přičteš ${B(b)}, dostaneš ${B(c)}.`, q: 'Jaké je to číslo?', ans: x, unit: '',
    traps: [[c - b, 'To je jen polovina čísla.'], [2 * c - b, 'Nejdřív odečti, pak násob dvěma.']],
    hints: ['Označ x = číslo. Polovina je x/2.', `x/2 + ${b} = ${c} → x/2 = ${c - b}`],
    steps: [`x/2 + ${b} = ${c}`, `x/2 = ${c - b}`, `x = ${x}`],
  });
}
function r_sesity() {
  const x = ri(12, 30), d = ri(3, 12), a = ri(3, 6), b = ri(2, 4), s = a * x + b * (x + d);
  return N({
    text: `Za ${a} sešitů a ${b} ${tv(b, 'blok', 'bloky', 'bloků')} se zaplatilo ${B(s + ' Kč')}. Blok je o ${B(d + ' Kč')} dražší než sešit.`, q: 'Kolik stojí jeden sešit?', ans: x, unit: 'Kč',
    traps: [[x + d, 'To je cena bloku.'], [rd(s / (a + b), 3), 'Sešit a blok nestojí stejně.']],
    hints: [`Označ x = cena sešitu, blok stojí x + ${d}.`, `${a}x + ${b}(x + ${d}) = ${s}`],
    steps: [`${a}x + ${b}(x + ${d}) = ${s}`, `${a + b}x + ${b * d} = ${s} → ${a + b}x = ${s - b * d} → x = ${x} Kč`],
  });
}
function r_brigada() {
  const x = rstep(200, 600, 50), d = rstep(50, 200, 50), s = 4 * x + d;
  return N({
    text: `Tři kamarádi si rozdělili výdělek z brigády ${cz(s)} Kč. Druhý dostal o ${d} Kč víc než první, třetí dostal dvakrát tolik co první. Pracovali 3 víkendy.`, q: 'Kolik dostal první?', ans: x, unit: 'Kč', units: true,
    traps: [[rd(s / 3, 3), 'Nedostali stejně.'], [x + d, 'To dostal druhý.']],
    hints: [`x + (x + ${d}) + 2x = ${cz(s)}. Počet víkendů se neptá.`],
    steps: [`x … první, x + ${d} … druhý, 2x … třetí`, `4x + ${d} = ${cz(s)} → x = ${x} Kč`],
  });
}
function r_mince() {
  const n = ri(20, 40), x = ri(5, n - 5), s = 2 * x + 5 * (n - x);
  return N({
    text: `V kasičce vyšetřovatele jsou jen dvoukoruny a pětikoruny, celkem ${n} mincí v hodnotě ${s} Kč. Kasička je modrá.`, q: 'Kolik je tam dvoukorun?', ans: x, unit: '',
    traps: [[n - x, 'To jsou pětikoruny.']],
    hints: [`Označ x = počet dvoukorun, pětikorun je ${n} − x. Rovnice: 2x + 5(${n} − x) = ${s}.`],
    steps: [`2x + 5(${n} − x) = ${s}`, `2x + ${5 * n} − 5x = ${s} → −3x = ${s - 5 * n} → x = ${x}`],
  });
}
function r_test() {
  const n = pick([20, 25, 30]), sp = ri(Math.ceil(n * 0.5), n - 2), plus = pick([4, 5]), minus = pick([1, 2]), s = plus * sp - minus * (n - sp);
  return N({
    text: `Test má ${n} otázek a každá je zodpovězená. Za správnou odpověď je +${plus} bodů, za špatnou −${minus} ${tv(minus, 'bod', 'body', 'bodů')}. Detektiv získal ${s} bodů za 45 minut.`, q: 'Kolik otázek měl správně?', ans: sp, unit: '',
    traps: [[n - sp, 'To jsou špatné odpovědi.'], [rd(s / plus, 3), 'Za špatné odpovědi se body odečítají.']],
    hints: [`Označ x = správné odpovědi, špatných je ${n} − x: ${plus}x − ${minus}(${n} − x) = ${s}. Čas se neptá.`],
    steps: [`${plus}x − ${minus}(${n} − x) = ${s}`, `${plus + minus}x − ${minus * n} = ${s} → x = ${sp}`],
  });
}
function r_autobus() {
  const x = 3 * ri(6, 15), n = ri(4, 12), zust = x - x / 3 + n;
  return N({
    text: `V autobusu sledovaném detektivem jela skupina lidí. Na první zastávce třetina vystoupila a nastoupilo ${n} lidí. Teď je v autobusu ${zust} lidí. Autobus jede linkou 136.`, q: 'Kolik lidí bylo v autobusu na začátku?', ans: x, unit: '',
    traps: [[zust - n, 'Odečetl se nástup, ale chybí ještě třetina, která vystoupila.'], [rd((zust - n) * 3, 3), 'Zůstaly dvě třetiny, ne jedna.']],
    hints: [`Označ x = počet na začátku: x − x/3 + ${n} = ${zust}. Číslo linky se neptá.`],
    steps: [`x − x/3 + ${n} = ${zust}`, `2x/3 = ${zust - n} → x = ${x}`],
  });
}

// ======================= 802 VĚKOVÉ ÚLOHY (Rodinné album) =======================
const RODINA = [['otec', 'otci', 'syn', 'synovi', 'syna'], ['matka', 'matce', 'dcera', 'dceři', 'dcery'], ['děda', 'dědovi', 'vnuk', 'vnukovi', 'vnuka'], ['babička', 'babičce', 'vnučka', 'vnučce', 'vnučky']];
function v_soucet() {
  const i = ri(0, 3), [A, Ad, Bn, Bd, Bg] = RODINA[i], d = i < 2 ? ri(22, 32) : ri(46, 58), x = ri(6, 16), s = 2 * x + d;
  return Rv({
    text: `${A[0].toUpperCase() + A.slice(1)} a ${Bn} mají dohromady ${B(let_(s))}. ${A[0].toUpperCase() + A.slice(1)} je o ${B(let_(d))} starší. Označ ${X('věk ' + Bg)}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`x + (x + ${d}) = ${s}`, v => 2 * v + d - s],
    bad: [[`x + ${d} = ${s}`, v => v + d - s], [`x + (x − ${d}) = ${s}`, v => 2 * v - d - s], [`2x + ${s} = ${d}`, v => 2 * v + s - d]],
    hints: [`Věk ${Bg} je x. ${A[0].toUpperCase() + A.slice(1)} je o ${d} let starší: x + ${d}.`, 'Dohromady = součet obou věků.', `x + (x + ${d}) = ${s}`],
    steps: [`x … ${Bn}, x + ${d} … ${A}`, `x + (x + ${d}) = ${s} → x = ${x}`],
  });
}
function v_zaLet() {
  const k = pick([2, 3, 4]), y = ri(4, 12), x = ri(2, 10), m = k * (y + x) - x;
  if (m < 26 || m > 60 || m - y < 20) return v_zaLet();
  const [A, Ad, Bn, Bd] = pick(RODINA.slice(0, 2));
  return Rv({
    text: `${Ad[0].toUpperCase() + Ad.slice(1)} je ${B(let_(m))}, ${Bd} ${B(let_(y))}. Za několik let bude ${A} ${B(k + 'krát')} starší než ${Bn}. Označ ${X('počet let, které uplynou')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`${m} + x = ${k} · (${y} + x)`, v => m + v - k * (y + v)],
    bad: [[`${m} = ${k} · (${y} + x)`, v => m - k * (y + v)], [`${m} + x = ${k} · ${y} + x`, v => m + v - k * y - v], [`${m} − x = ${k} · (${y} − x)`, v => m - v - k * (y - v)]],
    hints: ['Za x let bude každému o x let víc. Obě strany!', `${A}: ${m} + x, ${Bn}: ${y} + x.`, `${m} + x = ${k} · (${y} + x)`],
    steps: [`Za x let: ${A} ${m} + x, ${Bn} ${y} + x`, `${m} + x = ${k}(${y} + x)`, `x = ${x}`],
  });
}
function v_rozdilKrat() {
  const k = ri(3, 6), x = ri(6, 15), d = (k - 1) * x, [A, Ad, Bn, Bd, Bg] = pick(RODINA.slice(0, 2));
  if (d < 20 || k * x > 60) return v_rozdilKrat();
  return Rv({
    text: `${Ad[0].toUpperCase() + Ad.slice(1)} je ${B(k + 'krát')} víc let než ${Bd}. Rozdíl jejich věků je ${B(let_(d))}. Označ ${X('věk ' + Bg)}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`${k}x − x = ${d}`, v => k * v - v - d],
    bad: [[`${k}x = ${d}`, v => k * v - d], [`x − ${k}x = ${d}`, v => v - k * v - d], [`${k}x + x = ${d}`, v => k * v + v - d]],
    hints: [`${Bn}: x, ${A}: ${k}x.`, 'Rozdíl = starší − mladší.', `${k}x − x = ${d}`],
    steps: [`${k}x − x = ${d} → ${k - 1}x = ${d} → x = ${x}`],
  });
}
function v_jednoduchy() {
  const p = ri(3, 8), a = ri(6, 14), z = ri(2, 6), ans = a + p + z;
  return N({
    text: `Na fotce z doby před ${B(p + ' ' + (p === 1 ? 'rokem' : 'lety'))} bylo Evě ${B(let_(a))}.`, q: `Kolik let jí bude za ${let_(z)}?`, ans, unit: '',
    traps: [[a + z, `Fotka je ${let_(p)} stará. Nejdřív zjisti, kolik je Evě teď.`], [a + p, 'Tolik je jí teď. Ještě přičti roky do budoucna.']],
    hints: ['Krok 1: kolik je Evě dnes? Krok 2: kolik jí bude za pár let?', `Dnes: ${a} + ${p} = ${a + p}.`, `${a + p} + ${z} = ?`],
    steps: [`Dnes: ${a} + ${p} = ${a + p}`, `Za ${let_(z)}: ${a + p} + ${z} = ${ans}`],
  });
}
function v_bratr() {
  const d = ri(2, 6), s = ri(6, 12), az = s + ri(3, 7), ans = az + d;
  return N({
    text: `Bratr je o ${B(let_(d))} starší než sestra. Sestře je ${B(let_(s))}.`, q: `Kolik let bude bratrovi, až bude sestře ${az}?`, ans, unit: '',
    traps: [[s + d, 'Tolik je bratrovi teď.'], [az, 'To bude sestře. Bratr je pořád o ' + d + ' starší.']],
    hints: ['Rozdíl věků sourozenců se nikdy nemění.', `Bratr bude vždy o ${d} let starší.`, `${az} + ${d} = ?`],
    steps: [`Rozdíl věků je pořád ${d}`, `${az} + ${d} = ${ans}`],
  });
}
function v_kdyDvakrat() {
  const s = ri(5, 14), x = ri(5, 25), o = 2 * (s + x) - x;
  if (o - s < 20 || o > 60) return v_kdyDvakrat();
  return N({
    text: `Otci je ${B(let_(o))}, synovi ${B(let_(s))}.`, q: 'Za kolik let bude otec dvakrát starší než syn?', ans: x, unit: '',
    traps: [[o - 2 * s, 'Za x let přibude x let oběma, otci i synovi.'], [rd(o / 2 - s, 3), 'Sestav rovnici: ' + o + ' + x = 2(' + s + ' + x).']],
    hints: ['Označ x = počet let. Otec: ' + o + ' + x, syn: ' + s + ' + x.', `${o} + x = 2(${s} + x)`],
    steps: [`${o} + x = 2(${s} + x)`, `${o} + x = ${2 * s} + 2x → x = ${x}`, `Zkouška: ${o + x} = 2 · ${s + x}`],
  });
}
function v_predLety() {
  const k = pick([3, 4, 5]), p = ri(2, 6), d = ri(p + 2, 14), m = k * (d - p) + p, s = m + d;
  if (m - d < 20 || m > 60) return v_predLety();
  return N({
    text: `Mámě a dceři je dohromady ${B(let_(s))}. Před ${p} lety byla máma ${B(k + 'krát')} starší než dcera.`, q: 'Kolik let je dceři teď?', ans: d, unit: '',
    traps: [[d - p, `Tolik bylo dceři před ${p} lety.`], [m, 'To je věk mámy.']],
    hints: [`Označ x = věk dcery teď, máma má ${s} − x.`, `Před ${p} lety: (${s} − x − ${p}) = ${k}(x − ${p})`],
    steps: [`${s} − x − ${p} = ${k}(x − ${p})`, `${s - p} − x = ${k}x − ${k * p} → ${k + 1}x = ${s - p + k * p} → x = ${d}`],
  });
}
function v_tri() {
  const d = ri(6, 14), a = ri(22, 32), b = ri(20, 30), s = 3 * d + 2 * a + b;
  return N({
    text: `Babičce, mámě a dceři je dohromady ${B(let_(s))}. Máma je o ${B(a)} let starší než dcera, babička o ${B(b)} let starší než máma.`, q: 'Kolik let je dceři?', ans: d, unit: '',
    traps: [[rd(s / 3, 3), 'Nejsou stejně staré.'], [d + a, 'To je věk mámy.']],
    hints: [`Označ x = dcera, máma x + ${a}, babička x + ${a + b}.`, `x + (x + ${a}) + (x + ${a + b}) = ${s}`],
    steps: [`3x + ${2 * a + b} = ${s}`, `3x = ${s - 2 * a - b} → x = ${d}`],
  });
}
function v_pomer() {
  const [a, b] = pick([[3, 5], [2, 3], [4, 7], [3, 4]]), k = ri(2, 5), d = (b - a) * k;
  return N({
    text: `Věky bratra a sestry jsou v poměru ${B(a + ' : ' + b)}. Sestra je o ${B(let_(d))} starší.`, q: 'Kolik let je bratrovi?', ans: a * k, unit: '',
    traps: [[b * k, 'To je věk sestry.'], [d, 'Rozdíl odpovídá ' + (b - a) + ' dílům.']],
    hints: [`Bratr ${a}x, sestra ${b}x. Rozdíl: ${b}x − ${a}x = ${d}.`, `x = ${d} : ${b - a}`],
    steps: [`${b - a}x = ${d} → x = ${k}`, `Bratr: ${a} · ${k} = ${a * k}`],
  });
}
function v_detiDohromady() {
  const o = ri(34, 44), a = ri(8, 14), b = ri(4, a - 1), x = o - a - b;
  if (x < 5) return v_detiDohromady();
  return N({
    text: `Otci je ${o} let, synovi ${a} a dceři ${b}. Rodina má psa, kterému jsou 3 roky.`, q: 'Za kolik let bude otec stejně starý jako obě děti dohromady?', ans: x, unit: '',
    traps: [[o - a - b + 3, 'Pes se nepočítá.'], [rd((o - a - b) / 2, 3), 'Otci přibude x let, ale dětem dohromady 2x let.']],
    hints: [`${o} + x = (${a} + x) + (${b} + x). Pes se neptá.`],
    steps: [`${o} + x = ${a + b} + 2x`, `x = ${o} − ${a + b} = ${x}`],
  });
}
function v_kdyBylo() {
  const k = pick([3, 4, 5, 7]), x = ri(2, 6), s0 = ri(x + 3, 14), m = k * (s0 - x) + x;
  if (m - s0 < 20 || m > 55) return v_kdyBylo();
  return N({
    text: `Dnes je mámě ${m} let a synovi ${s0}. Fotka v albu je z doby, kdy byla máma ${k}krát starší než syn. Album má 48 stran.`, q: 'Před kolika lety fotka vznikla?', ans: x, unit: '',
    traps: [[s0 - x, 'Tolik bylo synovi na fotce.']],
    hints: [`${m} − x = ${k}(${s0} − x). Počet stran alba se neptá.`],
    steps: [`${m} − x = ${k}(${s0} − x)`, `${m} − x = ${k * s0} − ${k}x → ${k - 1}x = ${k * s0 - m} → x = ${x}`],
  });
}
function v_treti() {
  const x = 3 * ri(18, 28), s = x + x / 3;
  return N({
    text: `Když k dědovu věku přičteš jeho třetinu, dostaneš ${s}. Dědeček má 5 vnoučat.`, q: 'Kolik let je dědovi?', ans: x, unit: '',
    traps: [[rd(s * 3 / 4 * 4 / 3 - s / 4, 3), 'x + x/3 = 4x/3.'], [s - 3, 'Třetina není 3.']],
    hints: [`x + x/3 = ${s} → 4x/3 = ${s}. Počet vnoučat se neptá.`],
    steps: [`4x/3 = ${s}`, `x = ${s} · 3 : 4 = ${x}`],
  });
}
function v_sourozenci() {
  const d = ri(2, 4), x = ri(5, 12), s = 3 * x + 3 * d;
  return N({
    text: `Tři sourozenci se narodili vždy ${d} ${tv(d, 'rok', 'roky', 'let')} po sobě. Dohromady je jim ${s} let. Nejstarší chodí do 9. třídy.`, q: 'Kolik let je nejmladšímu?', ans: x, unit: '',
    traps: [[s / 3, 'To je prostřední.'], [x + 2 * d, 'To je nejstarší.']],
    hints: [`x + (x + ${d}) + (x + ${2 * d}) = ${s}. Třída se neptá.`],
    steps: [`3x + ${3 * d} = ${s} → x = ${x}`],
  });
}

// ======================= 803 OBVOD A ČÁSTI (Dílna) =======================
function o_obdelnik() {
  const d = ri(2, 9), x = ri(4, 15), o = 2 * (2 * x + d);
  return Rv({
    text: `Rám na obraz má tvar obdélníku s obvodem ${B(o + ' cm')}. Délka je o ${B(d + ' cm')} větší než šířka. Označ ${X('šířka')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`2 · (x + x + ${d}) = ${o}`, v => 2 * (2 * v + d) - o],
    bad: [[`x + (x + ${d}) = ${o}`, v => 2 * v + d - o], [`2x + ${d} = ${o}`, v => 2 * v + d - o + 0.5], [`2 · (x + ${d}) = ${o}`, v => 2 * (v + d) - o]],
    hints: ['Obvod obdélníku = 2 · (délka + šířka).', `Šířka x, délka x + ${d}.`, `2 · (x + x + ${d}) = ${o}`],
    steps: [`x … šířka, x + ${d} … délka`, `2(2x + ${d}) = ${o} → x = ${x} cm`],
  });
}
function o_rovnoramenny() {
  const d = ri(2, 6), x = ri(5, 14), o = x + 2 * (x + d);
  return Rv({
    text: `Trojúhelníková polička má tvar rovnoramenného trojúhelníku (dvě stejné strany, ramena). Rameno je o ${B(d + ' cm')} delší než základna, obvod je ${B(o + ' cm')}. Označ ${X('základna')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`x + 2 · (x + ${d}) = ${o}`, v => v + 2 * (v + d) - o],
    bad: [[`2x + (x + ${d}) = ${o}`, v => 2 * v + v + d - o], [`x + (x + ${d}) = ${o}`, v => 2 * v + d - o], [`3x = ${o}`, v => 3 * v - o]],
    hints: ['Rovnoramenný trojúhelník: základna + 2 ramena.', `Základna x, rameno x + ${d}.`, `x + 2(x + ${d}) = ${o}`],
    steps: [`x + 2(x + ${d}) = ${o} → 3x + ${2 * d} = ${o} → x = ${x} cm`],
  });
}
function o_lat() {
  const d = rstep(20, 80, 10), x = rstep(40, 120, 10), c = 2 * x + d;
  return Rv({
    text: `Lať dlouhá ${B(cz(c / 100) + ' m')} se rozřízne na dva kusy. Jeden je o ${B(d + ' cm')} delší než druhý. Označ ${X('délka kratšího kusu v cm')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`x + (x + ${d}) = ${c}`, v => 2 * v + d - c],
    bad: [[`x + ${d} = ${c}`, v => v + d - c], [`x + (x + ${d}) = ${cz(c / 100)}`, v => 2 * v + d - c / 100], [`2x = ${c} + ${d}`, v => 2 * v - c - d]],
    hints: [`Pozor na jednotky: ${cz(c / 100)} m = ${c} cm.`, `Kratší x, delší x + ${d}.`, `x + (x + ${d}) = ${c}`],
    steps: [`${cz(c / 100)} m = ${c} cm`, `2x + ${d} = ${c} → x = ${x} cm`],
  });
}
function o_tridily() {
  const d = rstep(5, 20, 5), x = rstep(30, 80, 5), c = 3 * x + 3 * d;
  return N({
    text: `Prkno dlouhé ${B(c + ' cm')} se rozřeže na tři díly. Každý další díl je o ${B(d + ' cm')} delší než předchozí.`, q: 'Jak dlouhý je nejkratší díl?', ans: x, unit: 'cm',
    traps: [[c / 3, 'To je prostřední díl.'], [x + 2 * d, 'To je nejdelší díl.']],
    hints: [`Označ x = nejkratší díl. Další: x + ${d}, x + ${2 * d}.`, `x + (x + ${d}) + (x + ${2 * d}) = ${c}`, `3x + ${3 * d} = ${c}`],
    steps: [`x + (x + ${d}) + (x + ${2 * d}) = ${c}`, `3x = ${c - 3 * d} → x = ${x} cm`],
  });
}
function o_drat() {
  const a = ri(6, 25), c = 4 * a;
  return N({
    text: `Drát dlouhý ${B(c + ' cm')} se ohne do tvaru čtverce.`, q: 'Jak dlouhá je strana čtverce?', ans: a, unit: 'cm',
    traps: [[c / 2, 'Čtverec má 4 strany.'], [c * 4, 'Strana je kratší než drát.']],
    hints: ['Délka drátu = obvod čtverce.', 'o = 4a, takže a = o : 4.', `${c} : 4 = ?`],
    steps: [`a = ${c} : 4 = ${a} cm`],
  });
}
function o_triKrat() {
  const k = ri(2, 4), x = ri(5, 16), o = 2 * (k + 1) * x;
  return N({
    text: `Obdélníková deska stolu má obvod ${B(o + ' cm')}. Délka je ${B(k + 'krát')} větší než šířka.`, q: 'Jaká je šířka desky?', ans: x, unit: 'cm',
    traps: [[k * x, 'To je délka.'], [o / (k + 1), 'Obvod obsahuje každou stranu dvakrát.']],
    hints: [`Označ x = šířka, délka ${k}x.`, `2(x + ${k}x) = ${o}`],
    steps: [`2 · ${k + 1}x = ${o} → x = ${x} cm`],
  });
}
function o_tyc() {
  const x = rstep(30, 70, 2), d = rstep(10, 30, 2), c = 5 * x - d;
  return N({
    text: `Tyč dlouhá ${B(cz(c / 100) + ' m')} se rozřeže na tři díly. Druhý je dvakrát delší než první, třetí je o ${B(d + ' cm')} kratší než druhý.`, q: 'Kolik centimetrů měří první díl?', ans: x, unit: 'cm',
    traps: [[rd(c / 3, 3), 'Díly nejsou stejné.'], [2 * x, 'To je druhý díl.']],
    hints: [`x + 2x + (2x − ${d}) = ${c} (v cm).`, `5x − ${d} = ${c}`],
    steps: [`${cz(c / 100)} m = ${c} cm`, `5x − ${d} = ${c} → x = ${x} cm`],
  });
}
function o_zahon() {
  const d = ri(1, 4), x = ri(4, 12), o = 2 * (2 * x - d);
  return N({
    text: `Plot kolem obdélníkového záhonu měří ${B(o + ' m')}. Jedna strana je o ${B(d + ' m')} kratší než druhá.`, q: 'Jak dlouhá je delší strana?', ans: x, unit: 'm',
    traps: [[x - d, 'To je kratší strana.'], [o / 4, 'Strany nejsou stejné.']],
    hints: [`Označ x = delší strana, kratší x − ${d}.`, `2(x + x − ${d}) = ${o}`],
    steps: [`2(2x − ${d}) = ${o} → 4x = ${o + 2 * d} → x = ${x} m`],
  });
}
function o_strany() {
  const x = ri(4, 12), d = ri(1, 5), o = 4 * x + d;
  return N({
    text: `Trojúhelníková deska má strany: a, b o ${B(d + ' cm')} delší než a, c dvakrát delší než a. Obvod je ${B(o + ' cm')}.`, q: 'Jak dlouhá je strana a?', ans: x, unit: 'cm',
    traps: [[2 * x, 'To je strana c.'], [rd(o / 3, 3), 'Strany nejsou stejné.']],
    hints: [`a + (a + ${d}) + 2a = ${o}`, `4a + ${d} = ${o}`],
    steps: [`4a + ${d} = ${o} → a = ${x} cm`],
  });
}
function o_ram() {
  const d = ri(6, 16), x = ri(15, 40), c = 2 * (2 * x + d);
  return N({
    text: `Na rám obrazu se spotřebovalo ${B(cz(c / 100) + ' m')} lišty. Rám je obdélník, délka je o ${B(d + ' cm')} větší než šířka.`, q: 'Jaká je šířka rámu v cm?', ans: x, unit: 'cm',
    traps: [[x + d, 'To je délka.'], [rd(c / 4, 3), 'Strany nejsou stejné.']],
    hints: [`${cz(c / 100)} m = ${c} cm. 2(x + x + ${d}) = ${c}.`, `4x + ${2 * d} = ${c}`],
    steps: [`4x + ${2 * d} = ${c} → x = ${x} cm`],
  });
}
function o_plot3() {
  const x = ri(6, 20), c = 4 * x, cena = rstep(80, 200, 10);
  return N({
    text: `Obdélníková zahrada přiléhá delší stranou k domu, plot se staví jen na zbylé tři strany. Délka zahrady je dvakrát větší než šířka. Pletiva se spotřebovalo ${c} m a metr stál ${cena} Kč.`, q: 'Jak dlouhá je zahrada (delší strana)?', ans: 2 * x, unit: 'm', units: true,
    traps: [[x, 'To je šířka.'], [c / 3, 'Strany nejsou stejné a plot je jen na třech.']],
    hints: [`Plot: délka + 2 šířky = 2x + 2x = ${c}. Cena pletiva se neptá.`],
    steps: [`Šířka x, délka 2x`, `2x + 2x = ${c} → x = ${x}`, `Délka: ${2 * x} m`],
  });
}
function o_police() {
  const x = ri(20, 40), d = rstep(20, 40, 5), c = 5 * x + 3 * d;
  return N({
    text: `Z prkna dlouhého ${cz(c / 100)} m se bez odpadu nařežou 3 police a 2 bočnice. Každá police je o ${d} cm delší než bočnice. Prkno je široké 25 cm.`, q: 'Jak dlouhá je jedna bočnice v cm?', ans: x, unit: 'cm', units: true,
    traps: [[x + d, 'To je police.'], [rd(c / 5, 3), 'Police a bočnice nejsou stejné.']],
    hints: [`3(x + ${d}) + 2x = ${c} (cm). Šířka prkna se neptá.`],
    steps: [`5x + ${3 * d} = ${c} → x = ${x} cm`],
  });
}
function o_dratObd() {
  const x = ri(5, 15), d = ri(2, 8), c = 2 * (3 * x + d);
  return N({
    text: `Z drátu dlouhého ${cz(c / 100)} m se ohne obdélník. Délka je o ${d} cm delší než dvojnásobek šířky. Drát je měděný.`, q: 'Jaká je délka obdélníku v cm?', ans: 2 * x + d, unit: 'cm', units: true,
    traps: [[x, 'To je šířka.']],
    hints: [`Šířka x, délka 2x + ${d}. 2(x + 2x + ${d}) = ${c}.`],
    steps: [`6x + ${2 * d} = ${c} → x = ${x}`, `Délka: 2 · ${x} + ${d} = ${2 * x + d} cm`],
  });
}

// ======================= 804 POHYB (Závodní okruh) =======================
function m_draha() {
  const v = pick([12, 15, 18, 20, 24, 30]), t = pick([1.5, 2, 2.5, 3, 4]), ans = rd(v * t, 2);
  return N({
    text: `Cyklista jede stálou rychlostí ${B(v + ' km/h')} po dobu ${B(cz(t) + ' h')}.`, q: 'Kolik kilometrů ujede?', ans, unit: 'km',
    traps: [[rd(v / t, 3), 'Dráha = rychlost · čas, násobí se.'], [rd(v + t, 2), 'Rychlost a čas se násobí.']],
    hints: ['Dráha = rychlost · čas (s = v · t).', `Za 1 h ujede ${v} km, za ${cz(t)} h ${cz(t)}krát víc.`, `${v} · ${cz(t)} = ?`],
    steps: ['s = v · t', `s = ${v} · ${cz(t)} = ${cz(ans)} km`],
  });
}
function m_cas() {
  const v = pick([40, 50, 60, 80, 90, 100]), t = pick([1.5, 2, 2.5, 3, 0.5]), s = v * t;
  return N({
    text: `Závodník musí ujet ${B(cz(s) + ' km')} průměrnou rychlostí ${B(v + ' km/h')}.`, q: 'Kolik hodin mu to bude trvat?', ans: t, unit: 'h',
    traps: [[s * v, 'Čas = dráha : rychlost.'], [rd(v / s, 3), 'Děl dráhu rychlostí, ne naopak.']],
    hints: ['Čas = dráha : rychlost (t = s : v).', `Kolikrát se ${v} km vejde do ${cz(s)} km?`, `${cz(s)} : ${v} = ?`],
    steps: ['t = s : v', `t = ${cz(s)} : ${v} = ${cz(t)} h`],
  });
}
function m_rychlost() {
  const t = pick([2, 3, 4, 5]), v = pick([15, 20, 45, 60, 70, 80]), s = v * t;
  return N({
    text: `Auto ujelo ${B(s + ' km')} za ${B(t + ' ' + tv(t, 'hodinu', 'hodiny', 'hodin'))}.`, q: 'Jaká byla jeho průměrná rychlost v km/h?', ans: v, unit: 'km/h',
    traps: [[s * t, 'Rychlost = dráha : čas.'], [rd(t / s, 4), 'Děl dráhu časem.']],
    hints: ['Rychlost = dráha : čas (v = s : t).', `Kolik km ujelo za 1 hodinu?`, `${s} : ${t} = ?`],
    steps: ['v = s : t', `v = ${s} : ${t} = ${v} km/h`],
  });
}
function m_setkaniRv() {
  const v1 = pick([50, 60, 70, 80]), v2 = pick([40, 60, 80, 90, 100].filter(v => v !== v1)), t = pick([1.5, 2, 2.5, 3]), s = (v1 + v2) * t;
  return Rv({
    text: `Dvě auta vyjela současně proti sobě z měst vzdálených ${B(cz(s) + ' km')}. První jede ${B(v1 + ' km/h')}, druhé ${B(v2 + ' km/h')}. Označ ${X('doba v hodinách do setkání')}.`, q: 'Která rovnice to popisuje?', x: t,
    ok: [`${v1}x + ${v2}x = ${cz(s)}`, v => (v1 + v2) * v - s],
    bad: [[`${v2}x − ${v1}x = ${cz(s)}`, v => (v2 - v1) * v - s], [`${v1}x = ${v2}x + ${cz(s)}`, v => v1 * v - v2 * v - s], [`(${v1} + ${v2}) · ${cz(s)} = x`, v => (v1 + v2) * s - v]],
    hints: ['Jedou proti sobě, obě auta jedou stejně dlouho (x hodin).', `První ujede ${v1}x, druhé ${v2}x.`, 'Dohromady ujedou celou vzdálenost.'],
    steps: [`${v1}x + ${v2}x = ${cz(s)} → ${v1 + v2}x = ${cz(s)} → x = ${cz(t)} h`],
  });
}
function m_minuty() {
  const v = pick([4, 5, 6]), s = pick([1, 2, 3, 0.5, 1.5]), ans = rd(s / v * 60, 3);
  if (!Number.isInteger(ans)) return m_minuty();
  return N({
    text: `Chodec jde rychlostí ${B(v + ' km/h')}.`, q: `Za kolik minut ujde ${cz(s)} km?`, ans, unit: 'min',
    traps: [[rd(s / v, 3), 'To jsou hodiny. Převeď na minuty.'], [rd(v / s * 60, 3), 'Čas = dráha : rychlost.']],
    hints: ['Čas = dráha : rychlost.', `${cz(s)} : ${v} = ${cz(s / v, 3)} h`, '1 h = 60 min.'],
    steps: [`t = ${cz(s)} : ${v} = ${cz(s / v, 3)} h`, `${cz(s / v, 3)} · 60 = ${ans} min`],
  });
}
function m_setkani() {
  const v1 = pick([50, 60, 70, 80, 90]), v2 = pick([40, 60, 80, 90, 110].filter(v => v !== v1)), t = pick([1.5, 2, 2.5, 3]), s = (v1 + v2) * t;
  return N({
    text: `Ze dvou měst vzdálených ${B(cz(s) + ' km')} vyjely současně proti sobě dva vozy: jeden rychlostí ${B(v1 + ' km/h')}, druhý ${B(v2 + ' km/h')}.`, q: 'Za kolik hodin se potkají?', ans: t, unit: 'h',
    traps: [[rd(s / Math.abs(v1 - v2), 3), 'Jedou proti sobě, rychlosti se sčítají.'], [rd(s / v1, 3), 'Jedou oba současně.']],
    hints: ['Označ x = čas do setkání. Za x hodin ujedou dohromady celou vzdálenost.', `${v1}x + ${v2}x = ${cz(s)}`],
    steps: [`${v1 + v2}x = ${cz(s)} → x = ${cz(t)} h`],
  });
}
function m_dohnani() {
  let v1, v2, h, t; do { v1 = pick([10, 12, 15, 20]); v2 = pick([30, 36, 40, 45, 60]); h = pick([1, 1.5, 2]); t = v1 * h / (v2 - v1); } while (!Number.isInteger(t * 4) || t <= 0);
  return N({
    text: `Cyklista vyjel rychlostí ${B(v1 + ' km/h')}. Po ${B(cz(h) + ' h')} za ním vyjela motorka rychlostí ${B(v2 + ' km/h')}.`, q: 'Za kolik hodin od svého startu motorka cyklistu dohoní?', ans: rd(t, 3), unit: 'h',
    traps: [[rd(v1 * h / (v1 + v2), 3), 'Jedou stejným směrem, rozdíl rychlostí se odčítá.'], [rd(t + h, 3), 'Ptám se na dobu od startu motorky.']],
    hints: [`Označ x = doba jízdy motorky. Cyklista jede o ${cz(h)} h déle.`, `${v2}x = ${v1}(x + ${cz(h)})`],
    steps: [`${v2}x = ${v1}x + ${cz(v1 * h)}`, `${v2 - v1}x = ${cz(v1 * h)} → x = ${cz(t, 3)} h`],
  });
}
function m_prijezd() {
  const v = pick([60, 80, 90, 100, 120]), t = pick([1.5, 2, 2.5, 3, 1.25]), s = v * t, h = ri(6, 10), m = rstep(0, 45, 15), kon = h * 60 + m + t * 60;
  const ok = hm(Math.floor(kon / 60), kon % 60), bad = [...new Set([hm(Math.floor((kon + 30) / 60), (kon + 30) % 60), hm(Math.floor((h * 60 + m + Math.round(t * 100)) / 60), (h * 60 + m + Math.round(t * 100)) % 60), hm(Math.floor((kon - 15) / 60), (kon - 15) % 60)])].filter(x => x !== ok);
  return C({
    text: `Vlak vyjel v ${B(hm(h, m))} a má ujet ${B(cz(s) + ' km')} průměrnou rychlostí ${B(v + ' km/h')}.`, q: 'V kolik hodin dorazí?', ok, bad,
    hints: [`Doba jízdy: ${cz(s)} : ${v} = ${cz(t)} h.`, `${cz(t)} h = ${t * 60} min. Přičti k ${hm(h, m)}.`],
    steps: [`t = ${cz(s)} : ${v} = ${cz(t)} h = ${t * 60} min`, `${hm(h, m)} + ${t * 60} min = ${ok}`],
  });
}
function m_prumerna() {
  const [v1, t1, v2, t2] = pick([[60, 2, 40, 3], [90, 2, 60, 1], [80, 1.5, 40, 1.5], [100, 2, 70, 2], [50, 3, 80, 1]]), s = v1 * t1 + v2 * t2, ans = rd(s / (t1 + t2), 3);
  return N({
    text: `Auto jelo ${B(cz(t1) + ' h')} rychlostí ${B(v1 + ' km/h')} a pak ${B(cz(t2) + ' h')} rychlostí ${B(v2 + ' km/h')}.`, q: 'Jaká byla průměrná rychlost celé cesty?', ans, unit: 'km/h',
    traps: [[(v1 + v2) / 2, 'Průměrná rychlost není průměr rychlostí, když jelo různě dlouho. Celá dráha : celý čas.']],
    hints: ['Průměrná rychlost = celá dráha : celý čas.', `Dráha: ${v1} · ${cz(t1)} + ${v2} · ${cz(t2)}`],
    steps: [`Dráha: ${cz(v1 * t1)} + ${cz(v2 * t2)} = ${cz(s)} km`, `Čas: ${cz(t1 + t2)} h`, `v = ${cz(s)} : ${cz(t1 + t2)} = ${cz(ans)} km/h`],
  });
}
function m_sprinter() {
  const [s, t] = pick([[100, 12.5], [100, 10], [200, 25], [400, 50], [60, 7.5]]), ms = s / t, ans = rd(ms * 3.6, 3);
  return N({
    text: `Sprinter uběhl ${B(s + ' m')} za ${B(cz(t) + ' s')}.`, q: 'Jaká byla jeho průměrná rychlost v km/h?', ans, unit: 'km/h',
    traps: [[ms, 'To je rychlost v m/s. Převeď na km/h (· 3,6).'], [rd(ms / 3.6, 3), 'Z m/s na km/h se násobí 3,6, ne dělí.']],
    hints: [`Rychlost v m/s: ${s} : ${cz(t)} = ${cz(ms)} m/s.`, '1 m/s = 3,6 km/h.'],
    steps: [`v = ${s} : ${cz(t)} = ${cz(ms)} m/s`, `${cz(ms)} · 3,6 = ${cz(ans)} km/h`],
  });
}
function m_setkaniKm() {
  const v1 = pick([15, 20, 25]), v2 = pick([50, 60, 75]), p = 1, t = pick([1, 1.5, 2]), s = v1 * (p + t) + v2 * t;
  return N({
    text: `Ze dvou míst vzdálených ${cz(s)} km vyjel v 8:00 cyklista rychlostí ${v1} km/h. V 9:00 vyjelo z druhého místa proti němu auto rychlostí ${v2} km/h. Auto je červené.`, q: 'Kolik kilometrů od místa startu cyklisty se potkají?', ans: v1 * (p + t), unit: 'km', units: true,
    traps: [[v2 * t, 'To ujelo auto. Ptám se na vzdálenost od startu cyklisty.'], [v1 * t, 'Cyklista jel o hodinu déle než auto.']],
    hints: [`Do 9:00 ujede cyklista ${v1} km. Pak se blíží rychlostí ${v1} + ${v2}. Barva auta se neptá.`],
    steps: [`Do 9:00: ${v1} km, zbývá ${cz(s - v1)} km`, `Setkání za ${cz(s - v1)} : ${v1 + v2} = ${cz(t)} h`, `Cyklista ujel ${v1} · ${cz(1 + t)} = ${cz(v1 * (1 + t))} km`],
  });
}
function m_turista() {
  const v1 = pick([4, 5, 6]), v2 = pick([16, 18, 20, 24]), h = pick([0.5, 1, 1.5]), t = v1 * h / (v2 - v1), ans = rd(t * 60, 3);
  if (!Number.isInteger(ans)) return m_turista();
  return N({
    text: `Turista vyšel rychlostí ${v1} km/h. Za ${cz(h * 60)} minut za ním vyjel cyklista rychlostí ${v2} km/h. Turista nese batoh s 2 l vody.`, q: 'Za kolik minut cyklista turistu dohoní?', ans, unit: 'min', units: true,
    traps: [[rd(t, 3), 'To jsou hodiny. Převeď na minuty.'], [rd((t + h) * 60, 3), 'Ptám se na dobu jízdy cyklisty.']],
    hints: [`${v2}x = ${v1}(x + ${cz(h)}), x v hodinách. Batoh se neptá.`],
    steps: [`${v2 - v1}x = ${cz(v1 * h)} → x = ${cz(t, 3)} h`, `${cz(t, 3)} h = ${ans} min`],
  });
}
function m_tunel() {
  const l = rstep(80, 200, 20), tun = rstep(200, 600, 50), v = pick([54, 72, 90, 108]), ms = v / 3.6, ans = rd((l + tun) / ms, 3);
  if (!Number.isInteger(ans)) return m_tunel();
  return N({
    text: `Vlak dlouhý ${l} m projíždí tunelem dlouhým ${tun} m rychlostí ${v} km/h. Tunel je pod horou vysokou 900 m.`, q: 'Kolik sekund uplyne od vjezdu lokomotivy do tunelu do chvíle, kdy z tunelu vyjede poslední vagón?', ans, unit: 's', units: true,
    traps: [[rd(tun / ms, 3), 'Vlak musí ujet tunel i svou vlastní délku.'], [rd((l + tun) / v, 3), 'Rychlost převeď na m/s (: 3,6).']],
    hints: [`Dráha = ${tun} + ${l} m, rychlost ${v} : 3,6 m/s. Výška hory se neptá.`],
    steps: [`s = ${tun} + ${l} = ${l + tun} m`, `v = ${v} : 3,6 = ${cz(ms)} m/s`, `t = ${l + tun} : ${cz(ms)} = ${ans} s`],
  });
}
function m_zacpa() {
  const v = pick([60, 80, 90]), T = pick([2, 3]), s = v * T, s1 = pick([40, 60]), v1 = pick([30, 40]), t1 = s1 / v1, zb = s - s1, tz = T - t1, ans = rd(zb / tz, 3);
  if (tz <= 0 || ans > 90 || !Number.isInteger(ans)) return m_zacpa();
  return N({
    text: `Autobus měl ujet ${s} km za ${T} h. Prvních ${s1} km ale kvůli zácpě jel jen ${v1} km/h. V autobusu sedí 34 cestujících.`, q: 'Jakou rychlostí musí jet zbytek cesty, aby dorazil včas?', ans, unit: 'km/h', units: true,
    traps: [[v, 'Ztracený čas je potřeba dohnat.'], [rd(zb / T, 3), `Na zbytek cesty zbývá jen ${cz(tz)} h.`]],
    hints: [`Zácpa trvala ${s1} : ${v1} = ${cz(t1)} h. Zbývá ${zb} km za ${cz(tz)} h. Cestující se neptají.`],
    steps: [`Zácpa: ${cz(t1)} h, zbývá ${cz(tz)} h a ${zb} km`, `v = ${zb} : ${cz(tz)} = ${cz(ans)} km/h`],
  });
}

// ======================= 805 PYTHAGOROVA VĚTA V PRAXI (Hasičská stanice) =======================
const TROJICE = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [7, 24, 25], [15, 20, 25]];
function py_zebrik() {
  const [a, b, c] = pick(TROJICE);
  return N({
    text: `Hasiči opřou žebřík o zeď. Pata žebříku je ${B(a + ' m')} od zdi a žebřík sahá do výšky ${B(b + ' m')}.`, q: 'Jak dlouhý je žebřík?', ans: c, unit: 'm', fig: pravouhly(a, b, { a: a + ' m', b: b + ' m', c: '?' }, { zebrik: 1 }),
    traps: [[a + b, 'Délky se nesčítají. Žebřík je přepona: c² = a² + b².'], [a * a + b * b, 'To je c². Ještě odmocni.']],
    hints: ['Zeď, zem a žebřík tvoří pravoúhlý trojúhelník. Žebřík je přepona (nejdelší strana naproti pravému úhlu).', 'Pythagorova věta: c² = a² + b².', `c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}, c = √${a * a + b * b}`],
    steps: [`c² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`, `c = √${a * a + b * b} = ${c} m`],
  });
}
function py_vyska() {
  const [a, b, c] = pick(TROJICE);
  return N({
    text: `Žebřík dlouhý ${B(c + ' m')} stojí patou ${B(a + ' m')} od zdi.`, q: 'Do jaké výšky na zdi sahá?', ans: b, unit: 'm', fig: pravouhly(a, b, { a: a + ' m', b: '?', c: c + ' m' }, { zebrik: 1 }),
    traps: [[c - a, 'Délky se neodčítají. Použij b² = c² − a².'], [c * c - a * a, 'To je b². Ještě odmocni.']],
    hints: ['Žebřík je přepona c, hledáš odvěsnu (stranu u pravého úhlu).', 'b² = c² − a².', `b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${c * c - a * a}`],
    steps: [`b² = ${c * c} − ${a * a} = ${c * c - a * a}`, `b = √${c * c - a * a} = ${b} m`],
  });
}
function py_prepona() {
  const [s, ok, bad] = pick([['Žebřík opřený o zeď tvoří se zdí a zemí pravoúhlý trojúhelník.', 'žebřík', ['zeď', 'zem']], ['Lano napnuté od vrcholu stožáru k zemi tvoří se stožárem a zemí pravoúhlý trojúhelník.', 'lano', ['stožár', 'zem']], ['Úhlopříčka dělí obdélníkovou plachtu na dva pravoúhlé trojúhelníky.', 'úhlopříčka', ['delší strana plachty', 'kratší strana plachty']]]);
  return C({
    text: s, q: 'Která strana je přepona (nejdelší strana, leží naproti pravému úhlu)?', ok, bad,
    hints: ['Najdi pravý úhel: kde se svírají dvě kolmé čáry?', 'Přepona leží naproti pravému úhlu, nedotýká se ho.', 'Je to vždy nejdelší strana.'],
    steps: [`Pravý úhel svírají ${bad.join(' a ')}, naproti leží ${ok}.`],
  });
}
function py_vzorec() {
  const [a, b, c] = pick(TROJICE);
  return C({
    text: `V pravoúhlém trojúhelníku je přepona ${B(c + ' m')} a jedna odvěsna ${B(a + ' m')}.`, q: 'Jak spočítáš druhou odvěsnu b?', ok: `b² = ${c}² − ${a}²`, bad: [`b² = ${c}² + ${a}²`, `b = ${c} − ${a}`, `b² = ${a}² − ${c}²`],
    hints: ['Pythagorova věta: c² = a² + b² (c je přepona).', 'Hledáš odvěsnu, tedy od c² odečítáš.', 'b² = c² − a²'],
    steps: [`b² = ${c}² − ${a}² = ${c * c - a * a}, b = ${b}`],
  });
}
function py_televize() {
  const [a, b, c] = pick([[60, 80, 100], [48, 64, 80], [36, 48, 60], [45, 60, 75], [72, 96, 120]]);
  return N({
    text: `Obrazovka v hasičské služebně měří ${B(b + ' cm')} na šířku a ${B(a + ' cm')} na výšku.`, q: 'Jak dlouhá je její úhlopříčka?', ans: c, unit: 'cm', fig: pravouhly(b, a, { a: b + ' cm', b: a + ' cm', c: '?' }),
    traps: [[a + b, 'Úhlopříčka je přepona, c² = a² + b².']],
    hints: ['Úhlopříčka rozdělí obdélník na dva pravoúhlé trojúhelníky.', 'Úhlopříčka je přepona.', `c² = ${b}² + ${a}²`],
    steps: [`c² = ${b * b} + ${a * a} = ${a * a + b * b}`, `c = ${c} cm`],
  });
}
function py_hadice() {
  const [a, b, c] = pick([[7, 24, 25], [9, 40, 41], [12, 35, 37], [20, 21, 29], [11, 60, 61]]);
  return N({
    text: `Hasiči natáhnou hadici šikmo přes obdélníkový dvůr ${B(b + ' m')} × ${B(a + ' m')} z rohu do protějšího rohu.`, q: 'Jak dlouhá hadice je potřeba?', ans: c, unit: 'm', fig: pravouhly(b, a, { a: b + ' m', b: a + ' m', c: '?' }),
    traps: [[a + b, 'Hadice vede šikmo, je to přepona.']],
    hints: ['Hadice je úhlopříčka dvora, tedy přepona.', `c² = ${b}² + ${a}² = ${a * a + b * b}`],
    steps: [`c = √${a * a + b * b} = ${c} m`],
  });
}
function py_okno() {
  const [a, b, c] = pick(TROJICE);
  return N({
    text: `Okno, ke kterému musí hasiči vylézt, je ve výšce ${B(b + ' m')}. Žebřík kvůli zahradě nesmí stát blíž než ${B(a + ' m')} od zdi.`, q: 'Jak dlouhý žebřík nejméně potřebují?', ans: c, unit: 'm', fig: pravouhly(a, b, { a: a + ' m', b: b + ' m', c: '?' }, { zebrik: 1 }),
    traps: [[b, 'Žebřík stojí šikmo, musí být delší než výška okna.'], [a + b, 'Použij Pythagorovu větu.']],
    hints: ['Žebřík je přepona.', `c² = ${a}² + ${b}²`],
    steps: [`c² = ${a * a} + ${b * b} = ${c * c}, c = ${c} m`],
  });
}
function py_desetinne() {
  const [a, b, c] = pick([[2.5, 6, 6.5], [1.5, 2, 2.5], [0.9, 1.2, 1.5], [3.5, 12, 12.5], [1.6, 3, 3.4]]);
  return N({
    text: `Pata žebříku stojí ${B(cz(a) + ' m')} od zdi, žebřík sahá do výšky ${B(cz(b) + ' m')}.`, q: 'Jak dlouhý je žebřík?', ans: c, unit: 'm', fig: pravouhly(a, b, { a: cz(a) + ' m', b: cz(b) + ' m', c: '?' }, { zebrik: 1 }),
    traps: [[rd(a + b, 2), 'Použij c² = a² + b².'], [rd(a * a + b * b, 4), 'To je c², ještě odmocni.']],
    hints: ['c² = a² + b², i s desetinnými čísly.', `c² = ${cz(a * a, 4)} + ${cz(b * b, 4)} = ${cz(c * c, 4)}`],
    steps: [`c² = ${cz(a)}² + ${cz(b)}² = ${cz(c * c, 4)}`, `c = ${cz(c)} m`],
  });
}
function py_stozar() {
  const [a, b, c] = pick([[8, 15, 17], [5, 12, 13], [9, 12, 15], [12, 16, 20], [20, 21, 29]]);
  return N({
    text: `Stožár s výstražným světlem je vysoký ${B(b + ' m')}. Lano z jeho vrcholu je ukotvené v zemi ${B(a + ' m')} od paty stožáru.`, q: 'Jak dlouhé je lano?', ans: c, unit: 'm', fig: pravouhly(a, b, { a: a + ' m', b: b + ' m', c: '?' }),
    traps: [[a + b, 'Lano je přepona.']],
    hints: ['Stožár, zem a lano tvoří pravoúhlý trojúhelník.', `c² = ${a}² + ${b}²`],
    steps: [`c² = ${a * a + b * b}, c = ${c} m`],
  });
}
function py_zaokrouhli() {
  let a, b, c; do { a = ri(2, 9); b = ri(3, 12); c = rd(Math.sqrt(a * a + b * b), 1); } while (Number.isInteger(Math.sqrt(a * a + b * b)));
  return N({
    text: `Hasiči napnou pásku přes roh obdélníkového pozemku: ${B(a + ' m')} podél jedné strany a ${B(b + ' m')} podél druhé. Pásku pak natáhnou přímo mezi oběma konci.`, q: 'Jak dlouhý kus pásky je potřeba? Zaokrouhli na desetiny metru.', ans: c, unit: 'm', dec: 1,
    traps: [[a + b, 'Páska vede šikmo.'], [rd(Math.sqrt(a * a + b * b), 0), 'Zaokrouhli na desetiny.']],
    hints: [`c² = ${a}² + ${b}² = ${a * a + b * b}`, `c = √${a * a + b * b}, zaokrouhli na jedno desetinné místo.`],
    steps: [`c² = ${a * a + b * b}`, `c = √${a * a + b * b} ≐ ${cz(c)} m`],
  });
}
function py_posun() {
  const [a, b, c] = pick([[6, 8, 10], [5, 12, 13], [9, 12, 15]]), d = pick([1, 2]), novy = Math.sqrt(c * c - (a - d) ** 2), ans = rd(novy - b, 2);
  return N({
    text: `Žebřík dlouhý ${c} m stojí patou ${a} m od zdi. Hasič posune patu o ${d} m blíž ke zdi. Hasičské auto stojí 20 m od domu.`, q: 'O kolik metrů výš teď žebřík sahá? Zaokrouhli na setiny metru.', ans, unit: 'm', units: true, dec: 2,
    traps: [[d, 'Výška se nezmění o stejný kus jako vzdálenost.'], [rd(novy, 2), 'To je nová výška. Ptám se, o kolik je vyšší.']],
    hints: [`Původní výška: √(${c}² − ${a}²) = ${b}. Nová: √(${c}² − ${a - d}²). Auto se neptá.`],
    steps: [`Původně: ${b} m`, `Nově: √(${c * c} − ${(a - d) ** 2}) = √${c * c - (a - d) ** 2} ≐ ${cz(novy, 2)} m`, `Rozdíl ≐ ${cz(ans)} m`],
  });
}
function py_strecha() {
  const [s, v, k] = pick([[12, 2.5, 6.5], [16, 6, 10], [10, 1.2, 5.14], [8, 3, 5], [24, 5, 13]]), ans = rd(Math.sqrt((s / 2) ** 2 + v * v), 2);
  return N({
    text: `Hasičská zbrojnice má sedlovou střechu. Dům je široký ${s} m a hřeben střechy je ${cz(v)} m nad stropem. Střecha je pokrytá červenými taškami.`, q: 'Jak dlouhá je krokev (šikmý trám od okraje stropu k hřebeni)? Zaokrouhli na setiny metru.', ans, unit: 'm', units: true, dec: 2,
    traps: [[rd(Math.sqrt(s * s + v * v), 2), 'Krokev vede jen přes polovinu šířky domu.']],
    hints: [`Odvěsny: polovina šířky ${s / 2} m a výška ${cz(v)} m. Barva tašek se neptá.`],
    steps: [`c² = ${s / 2}² + ${cz(v)}² = ${cz((s / 2) ** 2 + v * v, 4)}`, `c ≐ ${cz(ans)} m`],
  });
}
function py_cesta() {
  const [a, b, c] = pick([[9, 12, 15], [6, 8, 10], [5, 12, 13], [8, 15, 17]]);
  return N({
    text: `Hasičské auto jelo ${a} km na sever a pak ${b} km na východ. Cesta trvala 20 minut.`, q: 'Jak daleko je vzdušnou čarou od zbrojnice?', ans: c, unit: 'km', units: true,
    traps: [[a + b, 'Vzdušná čára je přepona.']],
    hints: ['Sever a východ jsou na sebe kolmé. Čas se neptá.'],
    steps: [`c² = ${a * a} + ${b * b} = ${c * c}, c = ${c} km`],
  });
}
function py_bedna() {
  const [a, b, c, d] = pick([[3, 4, 12, 13], [2, 3, 6, 7], [1, 2, 2, 3], [2, 6, 9, 11], [4, 4, 7, 9]]);
  return N({
    text: `Hasiči převážejí v bedně tyč. Bedna má tvar kvádru ${a} m × ${b} m × ${c} m (výška). Tyč se dá uložit šikmo z dolního rohu do protějšího horního rohu. Bedna váží 80 kg.`, q: 'Jak dlouhá může tyč nejvýš být?', ans: d, unit: 'm', units: true,
    traps: [[rd(Math.sqrt(a * a + b * b), 3), 'To je jen úhlopříčka dna. Tyč vede i do výšky.'], [a + b + c, 'Použij Pythagorovu větu dvakrát.']],
    hints: [`Nejdřív úhlopříčka dna: √(${a}² + ${b}²). Pak s výškou ${c} m znovu. Hmotnost se neptá.`],
    steps: [`Dno: u² = ${a * a} + ${b * b} = ${a * a + b * b}`, `Tyč: d² = ${a * a + b * b} + ${c * c} = ${d * d}, d = ${d} m`],
  });
}

// ======================= 806 KRUH A VÁLEC V PRAXI (Cirkus) =======================
function k_obvod() {
  const r = pick([4, 5, 6, 6.5, 7, 7.5, 8]), p = pia(x => 2 * x * r, 2);
  return N({
    text: `Cirkusová manéž je kruh s poloměrem ${B(cz(r) + ' m')} ${PI_T}.`, q: 'Jaká je délka kružnice (obvod kruhu) kolem manéže?', ...p, unit: 'm', fig: kruh(`r = ${cz(r)} m`),
    traps: [[rd(3.14 * r * r, 2), 'To je obsah (plocha). Obvod je o = 2 · π · r.'], [rd(3.14 * r, 2), 'Zapomněl se násobit dvěma: o = 2πr (nebo π · průměr).'.replace('Zapomněl se', 'Chybí')]],
    hints: ['Délka kružnice (obvod kruhu) je čára kolem dokola.', 'o = 2 · π · r (π ≐ 3,14).', `o = 2 · 3,14 · ${cz(r)}`],
    steps: ['o = 2 · π · r', `o = 2 · 3,14 · ${cz(r)} = ${cz(p.ans)} m`],
  });
}
function k_obsah() {
  const r = pick([3, 4, 5, 6, 7, 10]), p = pia(x => x * r * r, 2);
  return N({
    text: `Manéž je kruh s poloměrem ${B(r + ' m')} a pokryje se pískem ${PI_T}.`, q: 'Kolik m² má plocha manéže (obsah kruhu)?', ...p, unit: 'm²', fig: kruh(`r = ${r} m`, { uvnitr: 'S = ?' }),
    traps: [[rd(2 * 3.14 * r, 2), 'To je délka kružnice. Obsah je S = π · r².'], [rd(3.14 * 2 * r, 2), 'S = π · r · r.']],
    hints: ['Obsah kruhu říká, kolik plochy kruh zabírá.', 'S = π · r · r.', `S = 3,14 · ${r} · ${r}`],
    steps: ['S = π · r²', `S = 3,14 · ${r * r} = ${cz(p.ans)} m²`],
  });
}
function k_vzorec() {
  const [co, ok] = pick([['obsah kruhu (plochu)', 'π · r²'], ['délku kružnice (obvod kruhu)', '2 · π · r'], ['délku kružnice (obvod kruhu) z průměru d', 'π · d']]);
  return C({
    text: `Klaun potřebuje spočítat ${B(co)}.`, q: 'Který vzorec použije?', ok, bad: ['π · r²', '2 · π · r', 'π · d', 'r² : π'].filter(x => x !== ok).slice(0, 3),
    hints: ['Obsah = plocha, jednotky m². Obvod = délka, jednotky m.', 'Plocha kruhu: π krát r krát r. Délka kružnice: 2 krát π krát r.', 'Průměr d = 2r, takže 2πr = πd.'],
    steps: [`${co.replace('délku', 'délka').replace('plochu', 'plocha')}: ${ok}`],
  });
}
function k_kolo() {
  const d = pick([25, 50, 100, 150, 200]), ans = rd(3.14 * d, 2);
  return N({
    text: `Kolo jednokolky má průměr ${B(d + ' cm')} ${PI_T}.`, q: 'Kolik centimetrů ujede za jednu otáčku?', ans, alt: [rd(Math.PI * d, 2)], unit: 'cm', fig: kruh(`d = ${d} cm`, { prumer: 1 }),
    traps: [[rd(3.14 * d * d / 4, 2), 'To je obsah. Za otáčku ujede délku kružnice (obvod kruhu).'], [rd(2 * 3.14 * d, 2), 'Průměr už je dvojnásobek poloměru: o = π · d.']],
    hints: ['Za jednu otáčku se po zemi odvine celý obvod kola.', 'o = π · d.', `o = 3,14 · ${d}`],
    steps: [`o = 3,14 · ${d} = ${cz(ans)} cm`],
  });
}
function k_polomer() {
  const r = ri(2, 10), o = rd(2 * 3.14 * r, 2);
  return N({
    text: `Délka kružnice (obvod kruhu) kolem kruhové arény je ${B(cz(o) + ' m')} ${PI_T}.`, q: 'Jaký je poloměr arény?', ans: r, unit: 'm',
    traps: [[2 * r, 'To je průměr.'], [rd(o / 3.14, 2), 'Tak dostaneš průměr. Poloměr je polovina.']],
    hints: ['o = 2 · π · r, takže r = o : (2 · π).', `2 · 3,14 = 6,28.`, `${cz(o)} : 6,28 = ?`],
    steps: [`r = ${cz(o)} : 6,28 = ${r} m`],
  });
}
function k_otacky() {
  const d = pick([50, 60, 70, 80]), n = pick([100, 200, 250, 500]), s = rd(3.14 * d / 100 * n, 2);
  return N({
    text: `Kolo cirkusového vozu má průměr ${B(d + ' cm')} ${PI_T}. Vůz ujel ${B(cz(s) + ' m')}.`, q: 'Kolikrát se kolo otočilo?', ans: n, unit: '',
    traps: [[rd(s / (d / 100), 2), 'Za otáčku ujede obvod kola π · d, ne průměr.'], [rd(s * 100 / (3.14 * d) * 100, 2), 'Převeď průměr na metry.']],
    hints: [`Za 1 otáčku: 3,14 · ${cz(d / 100)} m = ${cz(3.14 * d / 100)} m.`, `${cz(s)} : ${cz(3.14 * d / 100)} = ?`],
    steps: [`o = 3,14 · ${cz(d / 100)} = ${cz(3.14 * d / 100)} m`, `${cz(s)} : ${cz(3.14 * d / 100)} = ${n}`],
  });
}
function k_valec() {
  const r = pick([2, 3, 4]), v = pick([5, 6, 8, 10]), p = pia(x => x * r * r * v, 2);
  return N({
    text: `Barel na vodu pro slony má tvar válce s poloměrem ${B(r + ' dm')} a výškou ${B(v + ' dm')} ${PI_T}.`, q: 'Kolik litrů vody pojme?', ...p, unit: 'l',
    traps: [[rd(3.14 * r * r, 2), 'To je obsah dna. Ještě vynásob výškou.'], [rd(2 * 3.14 * r * v, 2), 'To je plášť. Objem válce = obsah dna · výška.']],
    hints: ['Objem válce = obsah dna (kruhu) · výška.', `V = π · ${r}² · ${v} (v dm³ = litrech).`],
    steps: [`Dno: 3,14 · ${r * r} = ${cz(3.14 * r * r)} dm²`, `V = ${cz(3.14 * r * r)} · ${v} = ${cz(p.ans)} dm³ = ${cz(p.ans)} l`],
  });
}
function k_mezikruzi() {
  const r = pick([5, 6, 8]), w = pick([1, 2, 3]), R = r + w, p = pia(x => x * (R * R - r * r), 2);
  return N({
    text: `Kolem kruhové manéže s poloměrem ${B(r + ' m')} je pás pro diváky široký ${B(w + ' m')} ${PI_T}.`, q: 'Jaký obsah má pás pro diváky?', ...p, unit: 'm²', fig: kruh(`R = ${R} m`, { mezi: r / R }),
    traps: [[rd(3.14 * R * R, 2), 'To je celý kruh i s manéží. Odečti manéž.'], [rd(3.14 * w * w, 2), 'Pás je mezikruží: velký kruh minus manéž.']],
    hints: [`Velký kruh má poloměr ${r} + ${w} = ${R} m.`, `S = π · ${R}² − π · ${r}²`],
    steps: [`S = 3,14 · (${R * R} − ${r * r}) = 3,14 · ${R * R - r * r} = ${cz(p.ans)} m²`],
  });
}
function k_plast() {
  const d = pick([6, 8, 10, 12]), v = pick([2, 2.5, 3]), p = pia(x => x * d * v, 2);
  return N({
    text: `Malý cirkusový stan má tvar válce s průměrem ${B(d + ' m')} a výškou stěny ${B(cz(v) + ' m')} ${PI_T}.`, q: 'Kolik m² plachty je potřeba na boční stěnu (plášť, bez střechy)?', ...p, unit: 'm²',
    traps: [[rd(3.14 * (d / 2) ** 2, 2), 'To je obsah dna. Plášť = obvod · výška.'], [rd(3.14 * d * v * 2, 2), 'Obvod je π · d (s průměrem), nenásob ještě 2.']],
    hints: ['Plášť válce rozvinutý je obdélník: délka = délka kružnice (obvod kruhu), šířka = výška.', `S = 3,14 · ${d} · ${cz(v)}`],
    steps: [`Obvod: 3,14 · ${d} = ${cz(3.14 * d)} m`, `S = ${cz(3.14 * d)} · ${cz(v)} = ${cz(p.ans)} m²`],
  });
}
function k_pulkruh() {
  const d = pick([6, 8, 10, 12]), p = pia(x => x * d / 2 + d, 2);
  return N({
    text: `Pódium má tvar půlkruhu s průměrem ${B(d + ' m')}. Kolem celého okraje se má natáhnout světelný řetěz ${PI_T}.`, q: 'Jak dlouhý řetěz je potřeba?', ...p, unit: 'm',
    traps: [[rd(3.14 * d / 2, 2), 'Chybí rovná strana (průměr).'], [rd(3.14 * d + d, 2), 'Oblouk je jen polovina kružnice.']],
    hints: ['Okraj = polovina délky kružnice + průměr.', `3,14 · ${d} : 2 + ${d}`],
    steps: [`Oblouk: 3,14 · ${d} : 2 = ${cz(3.14 * d / 2)} m`, `+ průměr ${d} m = ${cz(p.ans)} m`],
  });
}
function k_stan() {
  const d = pick([20, 24, 30, 36]), v = pick([3, 4, 5]), ans = rd(3.14 * d * v, 2);
  return N({
    text: `Velký šapitó má tvar válce s průměrem ${d} m, stěna je vysoká ${v} m, nad ní je kuželová střecha. Vejde se do něj 800 diváků. ${PI_T}`, q: 'Kolik m² plachty je potřeba na boční stěnu?', ans, alt: [rd(Math.PI * d * v, 2)], unit: 'm²', units: true,
    traps: [[rd(3.14 * (d / 2) ** 2, 2), 'To je plocha země.'], [rd(2 * 3.14 * d * v, 2), 'S průměrem je obvod π · d.']],
    hints: ['Boční stěna = délka kružnice (obvod kruhu) · výška. Střecha ani diváci se neptají.'],
    steps: [`3,14 · ${d} · ${v} = ${cz(ans)} m²`],
  });
}
function k_barva() {
  const d = pick([12, 13, 14, 15]), m = pick([6, 8, 10]), S = 3.14 * (d / 2) ** 2, ans = Math.ceil(S / m - 1e-9);
  return N({
    text: `Kruhová manéž s průměrem ${d} m se natře barvou. Litr barvy vystačí na ${m} m². Barva je červená a prodává se po 1 l. ${PI_T}`, q: 'Kolik litrů barvy je potřeba koupit?', ans, unit: 'l', units: true,
    traps: [[Math.floor(S / m), 'Na zbytek plochy je potřeba ještě jeden litr. Zaokrouhli nahoru.'], [Math.ceil(3.14 * d * d / m), 'Poloměr je polovina průměru.']],
    hints: [`S = 3,14 · ${cz(d / 2)}², pak : ${m} a zaokrouhli nahoru.`],
    steps: [`S = 3,14 · ${cz((d / 2) ** 2)} = ${cz(S)} m²`, `${cz(S)} : ${m} ≐ ${cz(S / m, 2)} → ${ans} l`],
  });
}
function k_nadrz() {
  const d = pick([1, 1.2, 1.4, 2]), v = pick([1, 1.5]), z = pick([[3, 4], [1, 2], [2, 3]]), ans = rd(3.14 * (d / 2) ** 2 * v * z[0] / z[1] * 1000, 1);
  return N({
    text: `Válcová nádrž pro slony má průměr ${cz(d)} m a výšku ${cz(v)} m. Je naplněná do ${z[0]}/${z[1]} výšky. Slon vypije denně asi 150 l. ${PI_T}`, q: 'Kolik litrů vody je v nádrži? Zaokrouhli na desetiny litru.', ans, unit: 'l', units: true, dec: 1,
    traps: [[rd(3.14 * (d / 2) ** 2 * v * 1000, 1), `Nádrž není plná, jen do ${z[0]}/${z[1]}.`], [rd(3.14 * d * d * v * z[0] / z[1] * 1000, 1), 'Poloměr je polovina průměru.']],
    hints: [`V = 3,14 · ${cz(d / 2)}² · ${cz(v)} · ${z[0]}/${z[1]} (m³), 1 m³ = 1 000 l. Spotřeba slona se neptá.`],
    steps: [`V = 3,14 · ${cz((d / 2) ** 2, 4)} · ${cz(v * z[0] / z[1], 4)} = ${cz(ans / 1000, 5)} m³`, `= ${cz(ans)} l`],
  });
}
function k_draha() {
  const r = pick([5, 6, 7, 8]), n = pick([5, 8, 10, 12]), ans = rd(2 * 3.14 * r * n, 2);
  return N({
    text: `Kůň v manéži běží po kružnici s poloměrem ${r} m a oběhne ${n} kol. Kůň váží 500 kg. ${PI_T}`, q: 'Kolik metrů uběhne?', ans, alt: [rd(2 * Math.PI * r * n, 2)], unit: 'm', units: true,
    traps: [[rd(2 * 3.14 * r, 2), `To je jedno kolo. Kůň oběhne ${n} kol.`], [rd(3.14 * r * n, 2), 'Obvod je 2 · π · r.']],
    hints: ['Jedno kolo = délka kružnice (obvod kruhu). Hmotnost koně se neptá.'],
    steps: [`1 kolo: 2 · 3,14 · ${r} = ${cz(2 * 3.14 * r)} m`, `${n} kol: ${cz(ans)} m`],
  });
}

export const R8 = { rocnik: 8, temata: [
  { id: '801', nazev: 'Úlohy řešené rovnicí', ikona: 'x', popis: 'Neznámá x, sestavit rovnici, vyřešit, zkouška', strazce: 'Inspektor', svet: 'detektiv',
    vyklad: [
      { h: 'Neznámou si pojmenuj', t: 'Každá úloha začíná větou <b>Označ x = …</b> a za tečkami je přesně to, na co se úloha ptá. „x = Petrovy peníze“, „x = věk syna“. Bez toho se rovnice snadno splete.' },
      { h: 'Přepiš větu do matematiky', t: '„O 15 víc než x“ → x + 15<br>„Třikrát víc než x“ → 3x<br>„Polovina x“ → x/2<br>„Dohromady“ → sečti všechno.' },
      { h: 'Vyřeš rovnici', t: '3x + 7 = 34<br>odečti 7 na obou stranách: 3x = 27<br>vyděl 3: x = 9<br><br>Co uděláš na jedné straně, udělej i na druhé.' },
      { h: 'Zkouška', t: 'Dosaď výsledek do <b>zadání</b>, ne jen do rovnice. Když vyjde 9: „Myslím si 9, krát 3 je 27, plus 7 je 34.“ Sedí, takže je to správně.' },
    ],
    u: [[r_mysli, r_okolik, r_kolikrat, r_vyres, r_jeReseni], [r_trojice, r_penize, r_vstupne, r_polovina, r_sesity], [r_brigada, r_mince, r_test, r_autobus]],
    rychle: [r_vyres, r_trojice, r_penize, r_polovina] },
  { id: '802', nazev: 'Věkové úlohy', ikona: '⌛', popis: 'Dnes, za několik let, před lety. Rodinné album.', strazce: 'Prababička', svet: 'album',
    vyklad: [
      { h: 'Rozdíl věků se nemění', t: 'Když je bratr o 4 roky starší než sestra, bude o 4 roky starší i za 10 let i za 50 let. Každému přibývají roky stejně.' },
      { h: 'Za x let', t: 'Otci je 40, synovi 10. Za x let bude otci 40 + x a synovi 10 + x. Roky přibudou <b>oběma</b>.<br>„Otec bude dvakrát starší“: 40 + x = 2 · (10 + x).' },
      { h: 'Před x lety', t: 'Před x lety bylo otci 40 − x a synovi 10 − x. Odečítá se oběma.' },
      { h: 'Tabulka pomáhá', t: 'Udělej si tabulku: řádky jsou lidé, sloupce dnes / tehdy. Do každého políčka napiš výraz s x a teprve pak sestav rovnici.' },
    ],
    u: [[v_soucet, v_zaLet, v_rozdilKrat, v_jednoduchy, v_bratr], [v_kdyDvakrat, v_predLety, v_tri, v_pomer, v_soucet], [v_detiDohromady, v_kdyBylo, v_treti, v_sourozenci]],
    rychle: [v_jednoduchy, v_bratr, v_kdyDvakrat, v_pomer] },
  { id: '803', nazev: 'Obvod a části', ikona: '▭', popis: 'Strany o kolik delší, kolikrát větší. Rámy, latě, dráty.', strazce: 'Mistr truhlář', svet: 'dilna',
    vyklad: [
      { h: 'Strany vyjádři pomocí x', t: 'Délka o 5 cm větší než šířka: šířka x, délka x + 5.<br>Délka třikrát větší: šířka x, délka 3x.<br>Teprve pak dosaď do vzorce.' },
      { h: 'Obvod obdélníku', t: 'o = 2 · (a + b). Když a = x + 5 a b = x: 2 · (x + 5 + x) = obvod.' },
      { h: 'Rozřezání na díly', t: 'Lať 240 cm na dva kusy, jeden o 40 cm delší: x + (x + 40) = 240. Pozor na jednotky: metry převeď na centimetry dřív, než sestavíš rovnici.' },
      { h: 'Trojúhelník', t: 'Obvod = a + b + c. Rovnoramenný trojúhelník má dvě stejné strany (ramena): obvod = základna + 2 · rameno.' },
    ],
    u: [[o_obdelnik, o_rovnoramenny, o_lat, o_tridily, o_drat], [o_triKrat, o_tyc, o_zahon, o_strany, o_ram], [o_plot3, o_police, o_dratObd, o_tyc]],
    rychle: [o_tridily, o_drat, o_triKrat, o_zahon] },
  { id: '804', nazev: 'Pohyb', ikona: '⇢', popis: 'Dráha, rychlost, čas. Setkání a dohánění.', strazce: 'Pilot', svet: 'zavod',
    vyklad: [
      { h: 'Dráha, rychlost, čas', t: '<b>s = v · t</b> (dráha = rychlost · čas)<br><b>v = s : t</b>, <b>t = s : v</b><br>Jednotky musí sedět: km/h s hodinami, m/s se sekundami. 1 m/s = 3,6 km/h.' },
      { h: 'Proti sobě', t: 'Dvě auta jedou proti sobě: každou hodinu se k sobě přiblíží o <b>součet</b> rychlostí. 60 km/h a 80 km/h → o 140 km za hodinu.' },
      { h: 'Dohánění', t: 'Motorka dohání cyklistu: každou hodinu se přiblíží o <b>rozdíl</b> rychlostí. Kdo vyjel dřív, jede o tu dobu déle: 36x = 12 · (x + 2).' },
      { h: 'Průměrná rychlost', t: 'Průměrná rychlost = celá dráha : celý čas. Není to průměr rychlostí, když se jelo různě dlouho.' },
    ],
    u: [[m_draha, m_cas, m_rychlost, m_setkaniRv, m_minuty], [m_setkani, m_dohnani, m_prijezd, m_prumerna, m_sprinter], [m_setkaniKm, m_turista, m_tunel, m_zacpa]],
    rychle: [m_draha, m_cas, m_rychlost, m_minuty] },
  { id: '805', nazev: 'Pythagorova věta v praxi', ikona: '◺', popis: 'Žebříky, hadice, stožáry a úhlopříčky', strazce: 'Velitel', svet: 'hasici',
    vyklad: [
      { h: 'Pravoúhlý trojúhelník', t: 'Má jeden pravý úhel. Dvě strany u pravého úhlu jsou <b>odvěsny</b> (a, b), nejdelší strana naproti němu je <b>přepona</b> (c). Žebřík opřený o zeď je přepona.', fig: () => pravouhly(3, 4, { a: 'a', b: 'b', c: 'c' }, { zebrik: 1 }) },
      { h: 'Pythagorova věta', t: '<b>c² = a² + b²</b><br>Žebřík: pata 6 m od zdi, výška 8 m → c² = 36 + 64 = 100, c = 10 m.' },
      { h: 'Hledáš odvěsnu', t: '<b>b² = c² − a²</b><br>Žebřík 13 m, pata 5 m od zdi → b² = 169 − 25 = 144, b = 12 m.' },
      { h: 'Kde ji najít', t: 'Úhlopříčka obdélníku (televize, dvůr), lano stožáru, šikmá střecha, cesta „na sever a pak na východ“. Vždy hledej pravý úhel.' },
    ],
    u: [[py_zebrik, py_vyska, py_prepona, py_vzorec, py_televize], [py_hadice, py_okno, py_desetinne, py_stozar, py_zaokrouhli], [py_posun, py_strecha, py_cesta, py_bedna]],
    rychle: [py_televize, py_hadice, py_stozar, py_cesta] },
  { id: '806', nazev: 'Kruh a válec v praxi', ikona: '◯', popis: 'Manéž, kola, barely a stany (π ≐ 3,14)', strazce: 'Principál', svet: 'cirkus',
    vyklad: [
      { h: 'Poloměr a průměr', t: '<b>Poloměr r</b> je vzdálenost od středu ke kružnici. <b>Průměr d</b> vede přes celý kruh středem: d = 2r.', fig: () => kruh('r') },
      { h: 'Délka kružnice (obvod kruhu)', t: '<b>o = 2 · π · r = π · d</b>, kde π ≐ 3,14. Kolo s průměrem 50 cm ujede za otáčku 3,14 · 50 = 157 cm.' },
      { h: 'Obsah kruhu', t: '<b>S = π · r²</b> (π krát r krát r). Manéž s poloměrem 6 m: 3,14 · 36 = 113,04 m².' },
      { h: 'Válec', t: 'Objem = obsah dna · výška: <b>V = π · r² · v</b>. Plášť (boční stěna) = délka kružnice · výška: <b>S = 2πr · v</b>.' },
    ],
    u: [[k_obvod, k_obsah, k_vzorec, k_kolo, k_polomer], [k_otacky, k_valec, k_mezikruzi, k_plast, k_pulkruh], [k_stan, k_barva, k_nadrz, k_draha]],
    rychle: [k_obvod, k_obsah, k_kolo, k_polomer] },
] };
