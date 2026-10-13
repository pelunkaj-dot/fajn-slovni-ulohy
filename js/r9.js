// 9. ročník: společná práce, směsi a roztoky, soustavy rovnic, pohyb po proudu a proti proudu, finance, tělesa.
import { ri, pick, cz, rd, b as B } from './util.js';
import { N, C, Rv, pia, PI_T } from './ulohy.js';
import { tv, kc, gcd, pc } from './cesky.js';
import { teleso } from './obr.js';

const X = s => `<b>x</b> = ${s}`;
const zlomek = (a, b) => { const g = gcd(a, b); return b / g === 1 ? `${a / g}` : `${a / g}/${b / g}`; };
const hledej = (gen, ok) => { for (let i = 0; i < 400; i++) { const v = gen(); if (ok(v)) return v; } return null; };
const pul = v => Math.abs(v * 2 - Math.round(v * 2)) < 1e-9;
const cele = v => Math.abs(v - Math.round(v)) < 1e-9;
const kg = n => `${cz(n)} kg`;

// ======================= 901 SPOLEČNÁ PRÁCE (Továrna) =======================
// dvojice dob (a, b) se „hezkou“ společnou dobou ab/(a + b)
const DVOJICE = [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [6, 3], [12, 4], [2, 6], [6, 6], [4, 4], [8, 24], [5, 20], [15, 30], [3, 3]];
const spol = (a, b) => a * b / (a + b);
function s_zaklad() {
  const [a, b] = pick(DVOJICE), T = spol(a, b);
  return N({
    text: `Starší stroj vyrobí celou zakázku za ${B(a + ' h')}, nový stroj za ${B(b + ' h')}.`, q: 'Za kolik hodin ji vyrobí, když pracují oba současně?', ans: T, unit: 'h',
    traps: [[a + b, 'Když pracují spolu, je to rychlejší než každý zvlášť, ne pomalejší.'], [(a + b) / 2, 'Průměr dob nestačí: spolu to musí být rychlejší než i ten rychlejší stroj.']],
    hints: ['Zjisti, jakou část zakázky udělá každý stroj za 1 hodinu.', `Za 1 h: starší 1/${a}, nový 1/${b} zakázky. Spolu ${zlomek(a + b, a * b)} zakázky za hodinu.`, `Celá zakázka = 1. Čas = 1 : ${zlomek(a + b, a * b)} = ${cz(T)} h.`],
    steps: [`Za 1 h: 1/${a} + 1/${b} = ${zlomek(a + b, a * b)} zakázky`, `Čas: 1 : ${zlomek(a + b, a * b)} = ${cz(T)} h`],
  });
}
function s_zaHodinu() {
  const [a, b] = pick(DVOJICE.filter(([a, b]) => a !== b)), ok = zlomek(a + b, a * b);
  const bad = [...new Set([zlomek(1, a + b), zlomek(2, a + b), zlomek(Math.abs(b - a), a * b)])].filter(x => x !== ok && x !== '0');
  return C({
    text: `Jedna linka zabalí všechno zboží za ${B(a + ' h')}, druhá za ${B(b + ' h')}.`, q: 'Jakou část zboží zabalí obě linky spolu za 1 hodinu?', ok, bad: bad.slice(0, 3),
    hints: ['Kolik zabalí každá linka za 1 hodinu?', `První: 1/${a}, druhá: 1/${b}.`, `Sečti zlomky: 1/${a} + 1/${b}.`],
    steps: [`1/${a} + 1/${b} = ${ok}`],
  });
}
function s_rovnice() {
  const [a, b] = pick(DVOJICE.filter(([a, b]) => a !== b)), T = spol(a, b);
  return Rv({
    text: `Jedno čerpadlo vyčerpá nádrž za ${B(a + ' h')}, druhé za ${B(b + ' h')}. Označ ${X('počet hodin, za které ji vyčerpají spolu')}.`, q: 'Která rovnice to popisuje?', x: T,
    ok: [`x/${a} + x/${b} = 1`, v => v / a + v / b - 1],
    bad: [[`x = ${a} + ${b}`, v => v - a - b], [`x/${a} − x/${b} = 1`, v => v / a - v / b - 1], [`x = (${a} + ${b}) : 2`, v => v - (a + b) / 2]],
    hints: ['Za x hodin udělá první čerpadlo x/' + a + ' práce.', `Druhé za x hodin: x/${b}.`, 'Spolu udělají celou práci, tedy 1.'],
    steps: [`x/${a} + x/${b} = 1`, `x = ${cz(T)} h`],
  });
}
function s_stejni() {
  const n = pick([2, 3, 4, 5, 6]), t = n * pick([2, 3, 4, 5, 6]);
  return N({
    text: `Jeden dělník smontuje dávku výrobků za ${B(t + ' h')}.`, q: `Za kolik hodin ji smontuje ${n} stejně rychlých dělníků?`, ans: t / n, unit: 'h',
    traps: [[t * n, 'Víc dělníků to zvládne rychleji, ne pomaleji.'], [t - n, 'Čas se dělí počtem dělníků.']],
    hints: ['Víc lidí = kratší čas.', `${n} dělníci udělají za hodinu ${n}krát víc práce.`, `${t} : ${n} = ?`],
    steps: [`${t} : ${n} = ${cz(t / n)} h`],
  });
}
function s_cerpadla() {
  const [a, b] = pick([[30, 60], [20, 30], [40, 120], [15, 30], [60, 90], [36, 45], [24, 72]]), T = spol(a, b);
  return N({
    text: `Hasičské čerpadlo napustí nádrž za ${B(a + ' minut')}, menší čerpadlo za ${B(b + ' minut')}.`, q: 'Za kolik minut ji napustí obě čerpadla spolu?', ans: T, unit: 'min',
    traps: [[a + b, 'Spolu je to rychlejší, ne pomalejší.'], [(a + b) / 2, 'Průměr dob nestačí.']],
    hints: ['Jakou část nádrže napustí každé čerpadlo za 1 minutu?', `1/${a} + 1/${b} = ${zlomek(a + b, a * b)} nádrže za minutu.`, `1 : ${zlomek(a + b, a * b)} = ?`],
    steps: [`1/${a} + 1/${b} = ${zlomek(a + b, a * b)}`, `${cz(T)} min`],
  });
}
function s_nejdriv() {
  const v = hledej(() => { const [a, b] = pick(DVOJICE.filter(([a, b]) => a !== b)), t = ri(1, a - 1), T = (1 - t / a) * spol(a, b); return [a, b, t, T]; }, ([, , , T]) => T > 0 && pul(T));
  const [a, b, t, T] = v;
  return N({
    text: `Stroj A vyrobí zakázku za ${B(a + ' h')}, stroj B za ${B(b + ' h')}. Nejdřív ${t} ${tv(t, 'hodinu', 'hodiny', 'hodin')} pracuje jen stroj A, pak se přidá B.`, q: 'Kolik hodin pak pracují spolu, než je zakázka hotová?', ans: rd(T, 3), unit: 'h',
    traps: [[rd(spol(a, b), 3), `To je čas pro celou zakázku. Část už stroj A udělal sám.`], [rd(spol(a, b) - t, 3), 'Hodinu práce jednoho stroje nelze jen odečíst od společného času.']],
    hints: [`Stroj A za ${t} h udělá ${zlomek(t, a)} zakázky. Zbývá ${zlomek(a - t, a)}.`, `Spolu udělají za hodinu 1/${a} + 1/${b} = ${zlomek(a + b, a * b)}. Zbytek : rychlost = čas.`],
    steps: [`A sám: ${zlomek(t, a)}, zbývá ${zlomek(a - t, a)}`, `Spolu za 1 h: ${zlomek(a + b, a * b)}`, `${zlomek(a - t, a)} : ${zlomek(a + b, a * b)} = ${cz(T)} h`],
  });
}
function s_druhy() {
  const [a, b] = pick(DVOJICE.filter(([a, b]) => a !== b)), T = spol(a, b);
  if (!pul(T)) return s_druhy();
  return N({
    text: `Dvě balicí linky spolu zabalí zásilku za ${B(cz(T) + ' h')}. První linka sama by to zvládla za ${B(a + ' h')}.`, q: 'Za kolik hodin by to zvládla druhá linka sama?', ans: b, unit: 'h',
    traps: [[rd(a - T, 3), 'Doby se neodčítají. Odečítají se části práce za hodinu.'], [rd(a + T, 3), 'Odečti části práce za 1 hodinu.']],
    hints: [`Za 1 h spolu: 1 : ${cz(T)} = ${zlomek(2, Math.round(2 * T))} zásilky. První: 1/${a}.`, `Druhá: ${zlomek(2, Math.round(2 * T))} − 1/${a} = 1/${b} zásilky za hodinu.`],
    steps: [`Spolu za 1 h: ${zlomek(2, Math.round(2 * T))}`, `Druhá: ${zlomek(2, Math.round(2 * T))} − 1/${a} = 1/${b}`, `Sama za ${b} h`],
  });
}
function s_pritokOdtok() {
  const [a, b] = pick([[3, 6], [4, 12], [2, 6], [6, 12], [3, 12], [4, 6], [2, 3], [6, 18]]), T = a * b / (b - a);
  return N({
    text: `Přítok napustí chladicí nádrž v továrně za ${B(a + ' h')}. Výpust ji vypustí za ${B(b + ' h')}. Omylem jsou otevřené obě.`, q: 'Za kolik hodin se prázdná nádrž naplní?', ans: T, unit: 'h',
    traps: [[spol(a, b), 'Výpust vodu odebírá, rychlosti se odčítají.'], [b - a, 'Odčítají se části nádrže za hodinu, ne doby.']],
    hints: [`Za hodinu přiteče 1/${a} nádrže a odteče 1/${b}.`, `1/${a} − 1/${b} = ${zlomek(b - a, a * b)} nádrže za hodinu.`],
    steps: [`1/${a} − 1/${b} = ${zlomek(b - a, a * b)}`, `1 : ${zlomek(b - a, a * b)} = ${T} h`],
  });
}
function s_tri() {
  const [a, b, c, T] = pick([[2, 3, 6, 1], [4, 6, 12, 2], [6, 10, 15, 3], [4, 12, 6, 2], [10, 15, 30, 5], [6, 9, 18, 3], [8, 12, 24, 4], [3, 6, 6, 1.5]]);
  return N({
    text: `Tři roboti by zakázku zvládli každý sám za ${B(a + ' h')}, ${B(b + ' h')} a ${B(c + ' h')}.`, q: 'Za kolik hodin ji zvládnou všichni tři spolu?', ans: T, unit: 'h',
    traps: [[a + b + c, 'Spolu je to rychlejší, ne pomalejší.'], [rd((a + b + c) / 3, 3), 'Průměr dob nestačí.']],
    hints: [`Za 1 h: 1/${a} + 1/${b} + 1/${c}.`, `Celá práce : práce za hodinu = čas.`],
    steps: [`1/${a} + 1/${b} + 1/${c} = ${zlomek(2, Math.round(2 * T))} zakázky za hodinu`, `Čas: 1 : ${zlomek(2, Math.round(2 * T))} = ${cz(T)} h`],
  });
}
function s_procent() {
  const [a, b, t, p] = hledej(() => { const [a, b] = pick(DVOJICE), t = ri(1, 3), p = t * (a + b) / (a * b) * 100; return [a, b, t, p]; }, ([, , , p]) => p < 100 && cele(p));
  return N({
    text: `Dva jeřáby by vyložily loď každý sám za ${B(a + ' h')} a ${B(b + ' h')}. Pracují spolu ${B(t + ' ' + tv(t, 'hodinu', 'hodiny', 'hodin'))}.`, q: 'Kolik procent nákladu za tu dobu vyloží?', ans: p, unit: '%',
    traps: [[rd(t / a * 100, 3), 'To je jen první jeřáb.'], [rd(t / (a + b) * 100, 3), 'Sečti části práce obou jeřábů za hodinu.']],
    hints: [`Za 1 h: 1/${a} + 1/${b} = ${zlomek(a + b, a * b)} nákladu.`, `Za ${t} h ${t}krát víc, pak převeď na procenta.`],
    steps: [`Za ${t} h: ${t} · ${zlomek(a + b, a * b)} = ${zlomek(t * (a + b), a * b)}`, `= ${p} %`],
  });
}
function s_minuty() {
  const [a, b] = pick([[2, 3], [1, 4], [3, 6], [1, 1.5], [1.5, 3], [2, 6], [1, 3], [4, 4]]), T = rd(spol(a, b) * 60, 3);
  const V = pick([60, 80, 120, 150]);
  return N({
    text: `Bazén v areálu továrny má objem ${V} m³. Jedno čerpadlo ho napustí za ${cz(a)} h, druhé za ${cz(b)} h.`, q: 'Za kolik minut ho napustí obě čerpadla spolu?', ans: T, unit: 'min', units: true,
    traps: [[rd(spol(a, b), 3), 'To jsou hodiny. Převeď na minuty.'], [rd((a + b) * 60, 3), 'Spolu je to rychlejší.']],
    hints: [`1/${cz(a)} + 1/${cz(b)} nádrže za hodinu, výsledek v hodinách převeď na minuty. Objem bazénu se neptá.`],
    steps: [`Spolu: ${cz(spol(a, b), 3)} h`, `· 60 = ${cz(T)} min`],
  });
}
function s_odejde() {
  const [a, b, t, z] = hledej(() => { const [a, b] = pick(DVOJICE.filter(([a, b]) => a !== b)), t = ri(1, 4), r = 1 - t * (a + b) / (a * b), z = r * b; return [a, b, t, z]; }, ([, , , z]) => z > 0 && pul(z));
  return N({
    text: `Dva zedníci by halu omítli každý sám za ${a} a ${b} dní. Pracovali spolu ${t} ${tv(t, 'den', 'dny', 'dní')}, pak první odešel na jinou stavbu a druhý dokončil práci sám. Spotřebovali 40 pytlů omítky.`, q: 'Kolik dní pracoval druhý zedník sám?', ans: rd(z, 3), unit: 'dní',
    traps: [[rd(b - t, 3), 'Za společné dny udělali víc, než by udělal druhý sám.']],
    hints: [`Za ${t} ${tv(t, 'den', 'dny', 'dní')} spolu: ${t} · (1/${a} + 1/${b}). Zbytek dělá druhý rychlostí 1/${b} za den. Pytle se neptají.`],
    steps: [`Spolu: ${zlomek(t * (a + b), a * b)} práce`, `Zbývá ${zlomek(a * b - t * (a + b), a * b)}`, `Druhý: ${zlomek(a * b - t * (a + b), a * b)} · ${b} = ${cz(z)} dne`],
  });
}
function s_kratRychlejsi() {
  const k = pick([2, 3, 4]), T = pick([2, 3, 4, 6]), B_ = (k + 1) * T, A = B_ / k;
  if (!pul(A)) return s_kratRychlejsi();
  return N({
    text: `Nový robot pracuje ${k}krát rychleji než starý. Spolu zvládnou dávku za ${T} h. Starý robot má za sebou 12 let provozu.`, q: 'Za kolik hodin by dávku zvládl nový robot sám?', ans: rd(A, 3), unit: 'h', units: true,
    traps: [[B_, 'To je starý robot.'], [rd(T / k, 3), 'Nový robot sám to zvládne pomaleji, než když pomáhá starý.']],
    hints: [`Starý: x hodin, nový: x/${k}. Za hodinu spolu ${k + 1}/x = 1/${T}. Stáří robota se neptá.`],
    steps: [`Starý sám: ${k + 1} · ${T} = ${B_} h`, `Nový: ${B_} : ${k} = ${cz(A)} h`],
  });
}
function s_tiskarny() {
  const [r1, r2] = pick([[30, 20], [40, 10], [25, 15], [50, 30], [12, 8]]), S = pick([600, 900, 1200, 1500]), T = S / (r1 + r2);
  if (!cele(T)) return s_tiskarny();
  const n = pick([300, 600]);
  return N({
    text: `Tiskárna A vytiskne ${n} stran za ${cz(n / r1)} minut, tiskárna B ${n} stran za ${cz(n / r2)} minut. Papír stojí 30 haléřů za list.`, q: `Za kolik minut vytisknou spolu ${cz(S)} stran?`, ans: T, unit: 'min', units: true,
    traps: [[rd(S / r1, 3), 'Tiskne i tiskárna B.'], [rd(S / ((r1 + r2) / 2), 3), 'Rychlosti se sčítají.']],
    hints: [`A: ${r1} stran za minutu, B: ${r2}. Spolu ${r1 + r2}. Cena papíru se neptá.`],
    steps: [`${r1} + ${r2} = ${r1 + r2} stran/min`, `${cz(S)} : ${r1 + r2} = ${T} min`],
  });
}

// ======================= 902 SMĚSI A ROZTOKY (Laboratoř) =======================
const KONC = 'koncentrace (kolik procent roztoku tvoří rozpuštěná látka)';
function m_kolikSoli() {
  const m = pick([100, 200, 250, 400, 500, 800]), p = pick([2, 4, 5, 10, 15, 20, 25]), s = m * p / 100;
  return N({
    text: `V kádince je ${B(m + ' g')} solného roztoku, jeho ${KONC} je ${B(p + ' %')}.`, q: 'Kolik gramů soli je v roztoku?', ans: s, unit: 'g',
    traps: [[m - s, 'To je voda. Sůl je jen ' + p + ' %.'], [rd(m / p, 3), 'Procenta: ' + p + ' % z ' + m + ' = ' + m + ' · ' + p + ' : 100.']],
    hints: [`${p} % roztoku je sůl.`, `1 % z ${m} g je ${cz(m / 100)} g.`, `${cz(m / 100)} · ${p} = ?`],
    steps: [`${p} % z ${m} g = ${m} · ${p} : 100 = ${cz(s)} g soli`],
  });
}
function m_koncentrace() {
  const m = pick([100, 200, 250, 400, 500]), p = pick([2, 4, 5, 8, 10, 20, 25]), s = m * p / 100, w = m - s;
  return N({
    text: `Laborant rozpustil ${B(cz(s) + ' g')} soli ve ${B(cz(w) + ' g')} vody.`, q: 'Jaká je koncentrace roztoku (kolik procent roztoku tvoří sůl)?', ans: p, unit: '%',
    traps: [[rd(s / w * 100, 2), 'Počítej z celého roztoku (sůl + voda), ne jen z vody.']],
    hints: [`Roztok váží sůl + voda = ${cz(s)} + ${cz(w)} g.`, `Sůl : roztok · 100 = koncentrace v %.`, `${cz(s)} : ${m} · 100 = ?`],
    steps: [`Roztok: ${cz(s)} + ${cz(w)} = ${m} g`, `${cz(s)} : ${m} = ${cz(p / 100)} = ${p} %`],
  });
}
function m_cenaSmesi() {
  const [a, c1, b, c2] = hledej(() => [ri(1, 5), pick([180, 200, 240, 260, 300, 320, 360]), ri(1, 5), pick([400, 450, 480, 500, 600])], ([a, c1, b, c2]) => cele((a * c1 + b * c2) / (a + b)));
  const c = (a * c1 + b * c2) / (a + b);
  return N({
    text: `Do směsi ořechů se smíchá ${B(kg(a))} arašídů po ${B(c1 + ' Kč')} za kilogram a ${B(kg(b))} kešu po ${B(c2 + ' Kč')} za kilogram.`, q: 'Kolik korun bude stát 1 kg směsi?', ans: c, unit: 'Kč',
    traps: [[(c1 + c2) / 2, 'Každého druhu je jiné množství, průměr cen nestačí.'], [a * c1 + b * c2, 'To je cena celé směsi. Vyděl ji počtem kilogramů.']],
    hints: ['Spočítej cenu celé směsi a vyděl ji hmotností.', `Cena: ${a} · ${c1} + ${b} · ${c2} = ${a * c1 + b * c2} Kč.`, `${a * c1 + b * c2} : ${a + b} = ?`],
    steps: [`${a} · ${c1} + ${b} · ${c2} = ${a * c1 + b * c2} Kč za ${a + b} kg`, `${a * c1 + b * c2} : ${a + b} = ${c} Kč/kg`],
  });
}
function m_rovniceVoda() {
  const [m, p1, p2] = hledej(() => [pick([100, 200, 300, 400, 500]), pick([10, 12, 15, 20, 25]), pick([4, 5, 6, 8, 10, 12])], ([m, p1, p2]) => p2 < p1 && cele(m * p1 / p2));
  const s = m * p1 / 100, x = m * p1 / p2 - m;
  return Rv({
    text: `Máme ${B(m + ' g')} roztoku s koncentrací ${B(p1 + ' %')} (tolik procent tvoří sůl). Přilitím vody chceme koncentraci ${B(p2 + ' %')}. Označ ${X('kolik gramů vody přilijeme')}.`, q: 'Která rovnice to popisuje?', x,
    ok: [`${cz(s)} = ${cz(p2 / 100)} · (${m} + x)`, v => s - p2 / 100 * (m + v)],
    bad: [[`${cz(s)} = ${cz(p2 / 100)} · x`, v => s - p2 / 100 * v], [`${cz(s)} + x = ${cz(p2 / 100)} · ${m}`, v => s + v - p2 / 100 * m], [`${cz(p1 / 100)} · x = ${cz(p2 / 100)} · ${m}`, v => p1 / 100 * v - p2 / 100 * m]],
    hints: [`Sůl v roztoku: ${p1} % z ${m} g = ${cz(s)} g. Voda sůl nepřidá, soli zůstane pořád ${cz(s)} g.`, `Nový roztok váží ${m} + x gramů a sůl je ${p2} % z něj.`, `${cz(s)} = ${cz(p2 / 100)} · (${m} + x)`],
    steps: [`Sůl: ${cz(s)} g`, `${cz(s)} = ${cz(p2 / 100)}(${m} + x) → x = ${cz(x)} g`],
  });
}
function m_coSeStane() {
  const [co, ok] = pick([['přilijeme čistou vodu', 'klesne'], ['přisypeme další sůl', 'stoupne'], ['přilijeme roztok se stejnou koncentrací', 'nezmění se'], ['část vody se odpaří', 'stoupne']]);
  return C({
    text: `Do solného roztoku ${co}.`, q: 'Co se stane s koncentrací (kolik procent roztoku tvoří sůl)?', ok, bad: ['klesne', 'stoupne', 'nezmění se'].filter(x => x !== ok),
    hints: ['Koncentrace = sůl : celý roztok.', 'Zvětší se víc sůl, nebo celý roztok?', 'Víc soli ve stejném roztoku = silnější. Víc vody = slabší.'],
    steps: [`Když ${co}, koncentrace ${ok}.`],
  });
}
function m_redeni() {
  const [m, p1, p2] = hledej(() => [pick([100, 200, 250, 300, 400, 500]), pick([10, 12, 15, 20, 30]), pick([2, 3, 4, 5, 6, 8, 10])], ([m, p1, p2]) => p2 < p1 && cele(m * p1 / p2));
  const w = m * p1 / p2 - m;
  return N({
    text: `Ke ${B(m + ' g')} roztoku s koncentrací ${B(p1 + ' %')} (tolik procent tvoří sůl) se přilévá voda, dokud nebude mít koncentraci ${B(p2 + ' %')}.`, q: 'Kolik gramů vody je potřeba přilít?', ans: w, unit: 'g',
    traps: [[m * p1 / p2, 'To je hmotnost celého nového roztoku. Odečti původní roztok.'], [rd(m * (p1 - p2) / 100, 3), 'Sůl se nemění. Spočítej, kolik musí vážit nový roztok.']],
    hints: [`Soli je ${cz(m * p1 / 100)} g a zůstane jí stejně.`, `${cz(m * p1 / 100)} g má být ${p2} % nového roztoku → roztok váží ${cz(m * p1 / 100)} : ${cz(p2 / 100)}.`],
    steps: [`Sůl: ${cz(m * p1 / 100)} g`, `Nový roztok: ${cz(m * p1 / 100)} : ${cz(p2 / 100)} = ${cz(m * p1 / p2)} g`, `Voda: ${cz(m * p1 / p2)} − ${m} = ${cz(w)} g`],
  });
}
function m_dvaRoztoky() {
  const [a, p1, b, p2] = hledej(() => [pick([100, 200, 300, 400]), pick([5, 10, 15, 20]), pick([100, 200, 300, 400]), pick([20, 25, 30, 40])], ([a, p1, b, p2]) => p1 < p2 && cele((a * p1 + b * p2) / (a + b)));
  const p = (a * p1 + b * p2) / (a + b);
  return N({
    text: `Smícháme ${B(a + ' g')} roztoku s koncentrací ${B(p1 + ' %')} a ${B(b + ' g')} roztoku s koncentrací ${B(p2 + ' %')} (koncentrace = kolik procent tvoří sůl).`, q: 'Jakou koncentraci bude mít směs?', ans: p, unit: '%',
    traps: [[(p1 + p2) / 2, 'Roztoků je různé množství, průměr procent nestačí.'], [p1 + p2, 'Procenta se nesčítají.']],
    hints: [`Sůl: ${p1} % z ${a} g + ${p2} % z ${b} g.`, `Sůl celkem : ${a + b} g · 100.`],
    steps: [`Sůl: ${cz(a * p1 / 100)} + ${cz(b * p2 / 100)} = ${cz((a * p1 + b * p2) / 100)} g`, `${cz((a * p1 + b * p2) / 100)} : ${a + b} = ${cz(p)} %`],
  });
}
function m_pridatSul() {
  const [m, p1, p2, x] = hledej(() => { const m = pick([90, 180, 190, 200, 270, 360, 450, 475]), p1 = pick([5, 10, 15]), p2 = pick([10, 20, 25, 28]), x = m * (p2 - p1) / (100 - p2); return [m, p1, p2, x]; }, ([, p1, p2, x]) => p2 > p1 && x > 0 && cele(x));
  return N({
    text: `Ve ${B(m + ' g')} roztoku s koncentrací ${B(p1 + ' %')} (tolik procent tvoří sůl) se rozpustí další sůl, až má roztok koncentraci ${B(p2 + ' %')}.`, q: 'Kolik gramů soli se přidalo?', ans: x, unit: 'g',
    traps: [[rd(m * (p2 - p1) / 100, 3), 'Přidaná sůl zvětší i hmotnost celého roztoku.']],
    hints: [`Označ x = přidaná sůl. Sůl: ${cz(m * p1 / 100)} + x, roztok: ${m} + x.`, `${cz(m * p1 / 100)} + x = ${cz(p2 / 100)} · (${m} + x)`],
    steps: [`${cz(m * p1 / 100)} + x = ${cz(p2 / 100)}(${m} + x)`, `x = ${x} g`],
  });
}
function m_kolikLevnejsi() {
  const [c1, c2, M, a] = hledej(() => [pick([200, 240, 280, 300]), pick([400, 450, 500, 600]), pick([5, 10, 12, 20]), ri(1, 19)], ([c1, c2, M, a]) => a < M && cele((a * c1 + (M - a) * c2) / M));
  const c = (a * c1 + (M - a) * c2) / M;
  return N({
    text: `Pražírna míchá kávu po ${B(c1 + ' Kč')} za kilogram s kávou po ${B(c2 + ' Kč')} za kilogram. Má vzniknout ${B(kg(M))} směsi po ${B(c + ' Kč')} za kilogram.`, q: 'Kolik kilogramů levnější kávy použije?', ans: a, unit: 'kg',
    traps: [[M - a, 'To je dražší káva.'], [M / 2, 'Druhů nemusí být stejně.']],
    hints: [`Označ x = levnější káva, dražší je ${M} − x.`, `${c1}x + ${c2}(${M} − x) = ${M} · ${c}`],
    steps: [`${c1}x + ${c2}(${M} − x) = ${M * c}`, `${c1 - c2}x = ${M * c - M * c2} → x = ${a} kg`],
  });
}
function m_odpareni() {
  const [m, p1, p2] = hledej(() => [pick([200, 300, 400, 500, 600]), pick([4, 5, 6, 8, 10]), pick([8, 10, 12, 15, 20, 25])], ([m, p1, p2]) => p2 > p1 && cele(m * p1 / p2));
  const e = m - m * p1 / p2;
  return N({
    text: `Z ${B(m + ' g')} roztoku s koncentrací ${B(p1 + ' %')} (tolik procent tvoří sůl) se část vody odpaří. Koncentrace stoupne na ${B(p2 + ' %')}.`, q: 'Kolik gramů vody se odpařilo?', ans: e, unit: 'g',
    traps: [[m * p1 / p2, 'To je hmotnost zbylého roztoku.']],
    hints: [`Soli je ${cz(m * p1 / 100)} g a neodpaří se.`, `Nový roztok: ${cz(m * p1 / 100)} : ${cz(p2 / 100)} g. Rozdíl je odpařená voda.`],
    steps: [`Sůl ${cz(m * p1 / 100)} g, nový roztok ${cz(m * p1 / p2)} g`, `Odpařeno: ${m} − ${cz(m * p1 / p2)} = ${cz(e)} g`],
  });
}
function m_kolikPridat() {
  const [a, p1, p2, p3, x] = hledej(() => { const a = pick([100, 200, 300, 400, 600]), p1 = pick([30, 40, 50]), p2 = pick([5, 10, 15]), p3 = pick([20, 25, 30, 35]), x = a * (p3 - p2) / (p1 - p3); return [a, p1, p2, p3, x]; }, ([, p1, p2, p3, x]) => p2 < p3 && p3 < p1 && x > 0 && cele(x));
  return N({
    text: `K ${a} g octa s koncentrací ${p2} % se přilévá ocet s koncentrací ${p1} %, aby vznikl ocet s koncentrací ${p3} %. Láhev má objem 1 l.`, q: `Kolik gramů ${p1}% octa je potřeba?`, ans: x, unit: 'g', units: true,
    traps: [[a, 'Množství obou roztoků nemusí být stejné.']],
    hints: [`${cz(p2 / 100)} · ${a} + ${cz(p1 / 100)}x = ${cz(p3 / 100)}(${a} + x). Objem láhve se neptá.`],
    steps: [`${cz(a * p2 / 100)} + ${cz(p1 / 100)}x = ${cz(a * p3 / 100)} + ${cz(p3 / 100)}x`, `${cz((p1 - p3) / 100)}x = ${cz(a * (p3 - p2) / 100)} → x = ${x} g`],
  });
}
function m_suseni() {
  const [M, w1, w2] = hledej(() => [pick([10, 20, 24, 30, 40, 50, 60]), pick([80, 85, 90]), pick([10, 20, 25, 40])], ([M, w1, w2]) => cele(M * (100 - w1) / (100 - w2) * 10));
  const D = rd(M * (100 - w1) / (100 - w2), 3);
  return N({
    text: `Čerstvá jablka obsahují ${w1} % vody, sušená jablka ${w2} % vody. Z ${M} kg čerstvých jablek se usuší křížaly. Jablka se sbírala 3 dny.`, q: 'Kolik kilogramů křížal vznikne?', ans: D, unit: 'kg', units: true,
    traps: [[rd(M * (100 - w1) / 100, 3), `To je jen sušina. Křížaly ještě obsahují ${w2} % vody.`], [rd(M * (100 - w1 + w2) / 100, 3), 'Sušina tvoří ' + (100 - w2) + ' % křížal.']],
    hints: [`Sušina (bez vody) se nemění: ${100 - w1} % z ${M} kg = ${cz(M * (100 - w1) / 100)} kg. Ta tvoří ${100 - w2} % křížal.`],
    steps: [`Sušina: ${cz(M * (100 - w1) / 100)} kg`, `Křížaly: ${cz(M * (100 - w1) / 100)} : ${cz((100 - w2) / 100)} = ${cz(D)} kg`],
  });
}
function m_slitina() {
  const [a, p1, b, p2] = hledej(() => [pick([20, 30, 40, 50, 60]), pick([50, 58, 60, 75]), pick([20, 30, 40, 50]), pick([75, 80, 90, 100])], ([a, p1, b, p2]) => p1 < p2 && cele((a * p1 + b * p2) / (a + b) * 10));
  const p = rd((a * p1 + b * p2) / (a + b), 1);
  return N({
    text: `Zlatník slije ${a} g slitiny s ${p1} % zlata a ${b} g slitiny s ${p2} % zlata. Z nové slitiny vyrobí 5 prstenů.`, q: 'Kolik procent zlata obsahuje nová slitina? Zaokrouhli na desetiny procenta.', ans: p, unit: '%', dec: 1,
    traps: [[(p1 + p2) / 2, 'Slitin je různé množství, průměr procent nestačí.']],
    hints: [`Zlato: ${cz(a * p1 / 100)} + ${cz(b * p2 / 100)} g, celkem ${a + b} g. Počet prstenů se neptá.`],
    steps: [`Zlato: ${cz((a * p1 + b * p2) / 100)} g z ${a + b} g`, `${cz((a * p1 + b * p2) / 100)} : ${a + b} ≐ ${cz(p)} %`],
  });
}

// ======================= 903 SOUSTAVY ROVNIC (Kino) =======================
function k_soustava() {
  const a = pick([120, 150, 180, 200]), b = pick([80, 90, 100, 110]), x = ri(2, 9), y = ri(2, 9);
  if (x === y) return k_soustava();
  const n = x + y, s = a * x + b * y;
  return C({
    text: `Rodina koupila ${B(n)} vstupenek do kina a zaplatila ${B(s + ' Kč')}. Dospělá stojí ${B(a + ' Kč')}, dětská ${B(b + ' Kč')}. Označ <b>x</b> = počet dospělých vstupenek, <b>y</b> = počet dětských.`, q: 'Která soustava to popisuje?',
    ok: `x + y = ${n}; ${a}x + ${b}y = ${s}`, bad: [`x + y = ${s}; ${a}x + ${b}y = ${n}`, `x + y = ${n}; ${b}x + ${a}y = ${s}`, `${a}x + ${b}y = ${n}; x + y = ${s}`],
    hints: ['První rovnice: kolik je vstupenek dohromady.', `Druhá rovnice: kolik se zaplatilo. Dospělé stojí ${a} Kč, tedy ${a}x.`, `x + y = ${n}; ${a}x + ${b}y = ${s}`],
    steps: [`Počet: x + y = ${n}`, `Cena: ${a}x + ${b}y = ${s}`, `Řešení: x = ${x}, y = ${y}`],
  });
}
function k_vstupenky() {
  const a = pick([150, 180, 200, 220]), b = pick([90, 100, 110, 120]), x = ri(2, 12), y = ri(2, 12), n = x + y, s = a * x + b * y;
  return N({
    text: `Do kina přišla skupina ${B(n + ' lidí')}. Dospělá vstupenka stojí ${B(a + ' Kč')}, studentská ${B(b + ' Kč')}. Dohromady zaplatili ${B(s + ' Kč')}.`, q: 'Kolik bylo dospělých?', ans: x, unit: '',
    traps: [[y, 'To jsou studenti.'], [rd(s / a, 3), 'Ne všichni platili dospělou vstupenku.']],
    hints: ['Označ x = dospělí, y = studenti. x + y = ' + n + ', ' + a + 'x + ' + b + 'y = ' + s + '.', `Z první rovnice y = ${n} − x, dosaď do druhé.`, `${a}x + ${b}(${n} − x) = ${s}`],
    steps: [`y = ${n} − x`, `${a}x + ${b}(${n} − x) = ${s}`, `${a - b}x = ${s - b * n} → x = ${x}`, `Zkouška: ${x} · ${a} + ${y} · ${b} = ${s}`],
  });
}
function k_soucetRozdil() {
  const y = ri(20, 120), d = ri(5, 60), x = y + d, s = x + y;
  return N({
    text: `Ve dvou sálech kina sedí dohromady ${B(s)} diváků. Ve velkém sále jich je o ${B(d)} víc než v malém.`, q: 'Kolik diváků sedí ve velkém sále?', ans: x, unit: '',
    traps: [[y, 'To je malý sál.'], [s / 2, 'V sálech není stejně.']],
    hints: ['Označ x = velký sál, y = malý sál.', `x + y = ${s}, x − y = ${d}.`, `Sečti obě rovnice: 2x = ${s + d}.`],
    steps: [`x + y = ${s}`, `x − y = ${d}`, `2x = ${s + d} → x = ${x}`],
  });
}
function k_popcorn() {
  const v = pick([89, 99, 109, 119, 129]), m = pick([59, 65, 69, 75]), s1 = 2 * v + m, s2 = v + m;
  return N({
    text: `Dva velké popcorny a jeden malý stojí ${B(s1 + ' Kč')}. Jeden velký a jeden malý stojí ${B(s2 + ' Kč')}.`, q: 'Kolik stojí velký popcorn?', ans: v, unit: 'Kč',
    traps: [[m, 'To je malý popcorn.'], [rd(s1 / 3, 3), 'Popcorny nestojí stejně.']],
    hints: ['Porovnej oba nákupy: v čem se liší?', 'První nákup má navíc jen jeden velký popcorn.', `${s1} − ${s2} = ?`],
    steps: [`2v + m = ${s1}`, `v + m = ${s2}`, `Odečtu: v = ${s1} − ${s2} = ${v} Kč`],
  });
}
function k_jeReseni() {
  const x = ri(1, 9), y = ri(1, 9), a = ri(2, 5), b = ri(2, 5), s1 = x + y, s2 = a * x - b * y, [tx, ty] = pick([[x, y], [y, x], [x + 1, y - 1]]);
  const je = tx + ty === s1 && a * tx - b * ty === s2;
  return C({
    text: `Promítač tvrdí, že <b>x = ${tx}</b>, <b>y = ${ty}</b> je řešením soustavy<br>x + y = ${s1}<br>${a}x − ${b}y = ${s2 < 0 ? '−' + Math.abs(s2) : s2}`, q: 'Má pravdu?', ok: je ? 'ano, splňuje obě rovnice' : 'ne, nesplňuje obě rovnice', bad: [je ? 'ne, nesplňuje obě rovnice' : 'ano, splňuje obě rovnice'],
    hints: ['Dosaď čísla do obou rovnic.', 'Řešení soustavy musí platit v obou rovnicích najednou.', `${tx} + ${ty} = ${tx + ty}; ${a} · ${tx} − ${b} · ${ty} = ${a * tx - b * ty}`],
    steps: [`1. rovnice: ${tx} + ${ty} = ${tx + ty} ${tx + ty === s1 ? '✓' : '✗'}`, `2. rovnice: ${a * tx - b * ty} ${a * tx - b * ty === s2 ? '✓' : '✗'}`],
  });
}
function k_slepice() {
  const s = ri(5, 20), k = ri(3, 15), H = s + k, N_ = 2 * s + 4 * k;
  return N({
    text: `Ve filmu o statku je ve výběhu slepice a králíci. Mají dohromady ${B(H)} hlav a ${B(N_)} nohou.`, q: 'Kolik je tam králíků?', ans: k, unit: '',
    traps: [[s, 'To jsou slepice.'], [rd(N_ / 4, 3), 'Slepice mají jen 2 nohy.']],
    hints: [`Označ x = slepice, y = králíci: x + y = ${H}, 2x + 4y = ${N_}.`, `Kdyby všichni byli slepice, měli by ${2 * H} nohou. Každý králík přidá 2 nohy navíc.`],
    steps: [`x + y = ${H}, 2x + 4y = ${N_}`, `${N_} − ${2 * H} = ${N_ - 2 * H} nohou navíc`, `králíků: ${N_ - 2 * H} : 2 = ${k}`],
  });
}
function k_dveCeny() {
  const c = pick([39, 45, 49, 55]), p = pick([69, 79, 85, 95]), [a1, b1, a2, b2] = pick([[3, 2, 2, 3], [2, 1, 1, 3], [4, 1, 1, 2], [3, 1, 1, 2]]), s1 = a1 * c + b1 * p, s2 = a2 * c + b2 * p;
  return N({
    text: `Třída v kině koupila ${a1} ${tv(a1, 'limonádu', 'limonády', 'limonád')} a ${b1} ${tv(b1, 'popcorn', 'popcorny', 'popcornů')} za ${B(s1 + ' Kč')}. Druhá skupina koupila ${a2} ${tv(a2, 'limonádu', 'limonády', 'limonád')} a ${b2} ${tv(b2, 'popcorn', 'popcorny', 'popcornů')} za ${B(s2 + ' Kč')}.`, q: 'Kolik stojí jeden popcorn?', ans: p, unit: 'Kč',
    traps: [[c, 'To je limonáda.']],
    hints: [`${a1}l + ${b1}p = ${s1}, ${a2}l + ${b2}p = ${s2}.`, 'Vynásob rovnice tak, aby se po odečtení limonády vyrušily.'],
    steps: [`${a1}l + ${b1}p = ${s1}`, `${a2}l + ${b2}p = ${s2}`, `p = ${p} Kč, l = ${c} Kč`],
  });
}
function k_rady() {
  const [m, n] = pick([[12, 15], [10, 14], [16, 20], [18, 22]]), x = ri(3, 10), y = ri(3, 10), R = x + y, S = m * x + n * y;
  return N({
    text: `Sál má ${B(R)} řad a ${B(S)} sedadel. Některé řady mají ${m} sedadel, ostatní ${n}.`, q: `Kolik řad má ${n} sedadel?`, ans: y, unit: '',
    traps: [[x, `To jsou řady po ${m}.`]],
    hints: [`Označ x = řady po ${m}, y = řady po ${n}: x + y = ${R}, ${m}x + ${n}y = ${S}.`, `Dosaď x = ${R} − y.`],
    steps: [`${m}(${R} − y) + ${n}y = ${S}`, `${n - m}y = ${S - m * R} → y = ${y}`],
  });
}
function k_mince() {
  const x = ri(3, 20), y = ri(3, 20), n = x + y, s = 10 * x + 20 * y;
  return N({
    text: `V pokladně kina je ${B(n)} mincí, jen desetikoruny a dvacetikoruny, v hodnotě ${B(s + ' Kč')}.`, q: 'Kolik je tam dvacetikorun?', ans: y, unit: '',
    traps: [[x, 'To jsou desetikoruny.']],
    hints: [`x + y = ${n}, 10x + 20y = ${s}.`, `Kdyby všechny byly desetikoruny: ${10 * n} Kč. Každá dvacetikoruna přidá 10 Kč.`],
    steps: [`${s} − ${10 * n} = ${s - 10 * n}`, `${s - 10 * n} : 10 = ${y}`],
  });
}
function k_presun() {
  const k = ri(3, 20), m = ri(30, 80), N_ = 2 * m + 2 * k;
  return N({
    text: `Ve dvou sálech je dohromady ${B(N_)} diváků. Kdyby z prvního sálu přešlo ${B(k)} diváků do druhého, bylo by v obou stejně.`, q: 'Kolik diváků je v prvním sále?', ans: m + 2 * k, unit: '',
    traps: [[N_ / 2, 'To by bylo až po přesunu.'], [m + k, 'Přesunem se rozdíl zmenší o dvojnásobek.'], [m, 'To je druhý sál.']],
    hints: [`x + y = ${N_}, x − ${k} = y + ${k}.`, `Z druhé rovnice: x − y = ${2 * k}.`],
    steps: [`x + y = ${N_}, x − y = ${2 * k}`, `2x = ${N_ + 2 * k} → x = ${m + 2 * k}`],
  });
}
function k_trzba() {
  const a = pick([180, 200, 220, 240]), b = pick([100, 120, 140]), x = ri(20, 80), y = ri(10, 60), n = x + y, s = a * x + b * y;
  return N({
    text: `Na premiéru se prodalo ${n} vstupenek: plné po ${a} Kč a zlevněné po ${b} Kč. Tržba byla ${cz(s)} Kč. Film trval 2 hodiny 15 minut.`, q: 'Kolik se prodalo zlevněných vstupenek?', ans: y, unit: '',
    traps: [[x, 'To jsou plné vstupenky.']],
    hints: [`x + y = ${n}; ${a}x + ${b}y = ${cz(s)}. Délka filmu se neptá.`],
    steps: [`${a}(${n} − y) + ${b}y = ${cz(s)}`, `${a - b}y = ${cz(a * n - s)} → y = ${y}`],
  });
}
function k_cislo() {
  const a = ri(1, 8), b = ri(a + 1, 9), S = a + b, d = 9 * (b - a);
  return N({
    text: `Číslo sálu je dvouciferné, ciferný součet je ${S}. Když se cifry prohodí, vznikne číslo o ${d} větší. Sál má 120 míst.`, q: 'Jaké je číslo sálu?', ans: 10 * a + b, unit: '',
    traps: [[10 * b + a, 'To je číslo po prohození.']],
    hints: [`Číslo = 10x + y. x + y = ${S}; (10y + x) − (10x + y) = ${d}, tedy y − x = ${b - a}. Počet míst se neptá.`],
    steps: [`x + y = ${S}, y − x = ${b - a}`, `y = ${b}, x = ${a}`, `Číslo ${10 * a + b}`],
  });
}
function k_zaci() {
  const n = ri(14, 30), c1 = pick([100, 110, 120, 130]), c2 = c1 + pick([10, 20, 30]), chybi = ri(2, 12) * 10, s = c1 * n + chybi, zbude = c2 * n - s;
  if (zbude <= 0) return k_zaci();
  return N({
    text: `Třída jede do kina. Když každý žák zaplatí ${c1} Kč, bude chybět ${chybi} Kč. Když zaplatí ${c2} Kč, zbude ${zbude} Kč. Kino je 3 km od školy.`, q: 'Kolik je ve třídě žáků?', ans: n, unit: '',
    traps: [[rd((chybi + zbude) / c1, 3), 'Rozdíl peněz odpovídá rozdílu ' + (c2 - c1) + ' Kč na žáka.']],
    hints: [`Označ x = počet žáků: ${c1}x + ${chybi} = ${c2}x − ${zbude}. Vzdálenost se neptá.`],
    steps: [`${c1}x + ${chybi} = ${c2}x − ${zbude}`, `${c2 - c1}x = ${chybi + zbude} → x = ${n}`],
  });
}
function k_bankovky() {
  const x = ri(3, 25), y = ri(3, 25), n = x + y, s = 200 * x + 500 * y;
  return N({
    text: `Pokladní v kině měla na konci dne jen dvousetkorunové a pětisetkorunové bankovky, celkem ${n} kusů v hodnotě ${cz(s)} Kč. V kase bylo také 40 mincí.`, q: 'Kolik bylo pětisetkorun?', ans: y, unit: '',
    traps: [[x, 'To jsou dvousetkoruny.']],
    hints: [`x + y = ${n}; 200x + 500y = ${cz(s)}. Mince se do bankovek nepočítají.`],
    steps: [`200(${n} − y) + 500y = ${cz(s)}`, `300y = ${cz(s - 200 * n)} → y = ${y}`],
  });
}

// ======================= 904 POHYB PO PROUDU A PROTI PROUDU (Řeka) =======================
const PO = 'po proudu (proud loď nese, rychlosti se sčítají)', PROTI = 'proti proudu (proud loď brzdí, rychlosti se odčítají)';
function r_po() {
  const v = pick([8, 10, 12, 15, 18, 20]), p = pick([2, 3, 4, 5]);
  return N({
    text: `Motorový člun jede na klidné vodě rychlostí ${B(v + ' km/h')}. Řeka teče rychlostí ${B(p + ' km/h')}.`, q: `Jakou rychlostí pojede ${PO}?`, ans: v + p, unit: 'km/h',
    traps: [[v - p, 'Po proudu voda pomáhá, rychlosti se sčítají.'], [v, 'Proud člun ještě zrychlí.']],
    hints: ['Proud nese člun stejným směrem.', 'Rychlost člunu + rychlost proudu.', `${v} + ${p} = ?`],
    steps: [`${v} + ${p} = ${v + p} km/h`],
  });
}
function r_proti() {
  const v = pick([8, 10, 12, 15, 18, 20]), p = pick([2, 3, 4, 5]);
  return N({
    text: `Kajak jede na klidné vodě rychlostí ${B(v + ' km/h')}. Řeka teče rychlostí ${B(p + ' km/h')}.`, q: `Jakou rychlostí pojede ${PROTI}?`, ans: v - p, unit: 'km/h',
    traps: [[v + p, 'Proti proudu voda brzdí, rychlosti se odčítají.'], [v, 'Proud kajak zpomalí.']],
    hints: ['Proud tlačí kajak opačným směrem.', 'Rychlost kajaku − rychlost proudu.', `${v} − ${p} = ?`],
    steps: [`${v} − ${p} = ${v - p} km/h`],
  });
}
function r_casPo() {
  const v = pick([10, 12, 15, 16, 18]), p = pick([2, 3, 4]), t = pick([1, 1.5, 2, 2.5, 3]), s = (v + p) * t;
  return N({
    text: `Loď pluje na klidné vodě rychlostí ${B(v + ' km/h')}, proud má rychlost ${B(p + ' km/h')}. Do přístavu ${PO.replace(/ \(.*/, '')} je to ${B(cz(s) + ' km')}.`, q: 'Za kolik hodin tam dopluje? (Po proudu se rychlosti sčítají.)', ans: t, unit: 'h',
    traps: [[rd(s / v, 3), 'Proud loď nese, započítej ho.'], [rd(s / (v - p), 3), 'Po proudu se rychlosti sčítají.']],
    hints: [`Rychlost po proudu: ${v} + ${p} = ${v + p} km/h.`, 'Čas = dráha : rychlost.', `${cz(s)} : ${v + p} = ?`],
    steps: [`v = ${v + p} km/h`, `t = ${cz(s)} : ${v + p} = ${cz(t)} h`],
  });
}
function r_rychlejsi() {
  const v = pick([10, 12, 15]), p = pick([2, 3, 4]);
  return C({
    text: `Parník jede na klidné vodě rychlostí ${B(v + ' km/h')}, řeka teče rychlostí ${B(p + ' km/h')}. Pluje mezi dvěma přístavy tam po proudu a zpátky proti proudu.`, q: 'Která cesta trvá déle?', ok: 'zpátky proti proudu', bad: ['tam po proudu', 'obě stejně dlouho'],
    hints: ['Po proudu je rychlost ' + (v + p) + ' km/h, proti proudu ' + (v - p) + ' km/h.', 'Stejnou vzdálenost pomalejší loď pluje déle.', 'Která rychlost je menší?'],
    steps: [`Po proudu ${v + p} km/h, proti ${v - p} km/h → proti proudu je pomalejší, trvá déle.`],
  });
}
function r_kopec() {
  const [v1, v2] = pick([[12, 24], [10, 30], [8, 24], [15, 30], [9, 18]]), t1 = pick([1, 1.5, 2, 3]), s = v1 * t1, t2 = s / v2;
  return N({
    text: `Cyklista jel k vodopádu do kopce ${B(cz(t1) + ' h')} rychlostí ${B(v1 + ' km/h')}. Zpátky stejnou cestou z kopce jel ${B(v2 + ' km/h')}.`, q: 'Kolik hodin jel zpátky?', ans: rd(t2, 3), unit: 'h',
    traps: [[t1, 'Zpátky jel rychleji, bude to kratší.'], [rd(v2 / v1 * t1, 3), 'Rychleji = kratší čas.']],
    hints: ['Nejdřív zjisti délku cesty.', `Cesta: ${v1} · ${cz(t1)} = ${cz(s)} km.`, `Zpátky: ${cz(s)} : ${v2}.`],
    steps: [`s = ${v1} · ${cz(t1)} = ${cz(s)} km`, `t = ${cz(s)} : ${v2} = ${cz(t2)} h`],
  });
}
function r_tamZpet() {
  const [v, p, s] = hledej(() => [pick([8, 10, 12, 14, 15, 16, 18, 20]), pick([2, 3, 4, 5, 6]), pick([12, 18, 24, 30, 36, 40, 42, 48, 60])], ([v, p, s]) => v > p && pul(s / (v + p)) && pul(s / (v - p)));
  const T = s / (v + p) + s / (v - p);
  return N({
    text: `Výletní loď (na klidné vodě ${B(v + ' km/h')}) pluje ${B(s + ' km')} po proudu a pak stejnou trasu zpátky proti proudu. Proud má ${B(p + ' km/h')}.`, q: 'Kolik hodin trvá celá plavba?', ans: rd(T, 3), unit: 'h',
    traps: [[rd(2 * s / v, 3), 'Proud není jedno: po proudu je loď rychlejší, proti proudu pomalejší.']],
    hints: [`Tam: ${s} : ${v + p} h. Zpátky: ${s} : ${v - p} h.`, 'Sečti oba časy.'],
    steps: [`Tam: ${s} : ${v + p} = ${cz(s / (v + p))} h`, `Zpátky: ${s} : ${v - p} = ${cz(s / (v - p))} h`, `Celkem ${cz(T)} h`],
  });
}
function r_prumer() {
  const [v1, v2, p] = pick([[30, 60, 40], [40, 60, 48], [12, 24, 16], [20, 30, 24], [60, 90, 72], [10, 15, 12], [6, 12, 8]]), sc = v1 * v2 / gcd(v1, v2);
  return N({
    text: `${v2 <= 15 ? 'Cyklista jel' : 'Auto jelo'} na chatu rychlostí ${B(v1 + ' km/h')} a stejnou cestou zpátky rychlostí ${B(v2 + ' km/h')}.`, q: 'Jaká byla průměrná rychlost celé cesty?', ans: p, unit: 'km/h',
    traps: [[(v1 + v2) / 2, 'Pomalejší jízda trvala déle, průměr rychlostí nestačí.']],
    hints: [`Zvol si délku cesty, třeba ${sc} km, a spočítej oba časy.`, 'Průměrná rychlost = celá dráha : celý čas.', `Tam ${sc} : ${v1} = ${cz(sc / v1)} h, zpátky ${sc} : ${v2} = ${cz(sc / v2)} h.`],
    steps: [`Cesta ${sc} km: tam ${cz(sc / v1)} h, zpět ${cz(sc / v2)} h`, `v = ${2 * sc} : ${cz(sc / v1 + sc / v2)} = ${p} km/h`],
  });
}
function r_proud() {
  const v = pick([10, 12, 14, 16, 18]), p = pick([2, 3, 4, 5]);
  return N({
    text: `Člun jede po proudu rychlostí ${B((v + p) + ' km/h')} a proti proudu rychlostí ${B((v - p) + ' km/h')}.`, q: 'Jakou rychlost má proud řeky?', ans: p, unit: 'km/h',
    traps: [[2 * p, 'Rozdíl obou rychlostí je dvojnásobek proudu.'], [v, 'To je rychlost člunu na klidné vodě.']],
    hints: [`Po proudu: v + p = ${v + p}, proti: v − p = ${v - p}.`, `Odečti: 2p = ${2 * p}.`],
    steps: [`(v + p) − (v − p) = 2p = ${2 * p}`, `p = ${p} km/h`],
  });
}
function r_lod() {
  const [v, p, s] = hledej(() => [pick([10, 12, 15, 18, 20]), pick([2, 3, 5]), pick([30, 36, 40, 45, 60, 90])], ([v, p, s]) => cele(s / (v + p) * 2) && cele(s / (v - p) * 2));
  return N({
    text: `Loď urazí ${B(s + ' km')} po proudu za ${B(cz(s / (v + p)) + ' h')} a stejnou trasu proti proudu za ${B(cz(s / (v - p)) + ' h')}.`, q: 'Jakou rychlost má loď na klidné vodě?', ans: v, unit: 'km/h',
    traps: [[p, 'To je rychlost proudu.'], [v + p, 'To je rychlost po proudu.']],
    hints: [`Po proudu: ${s} : ${cz(s / (v + p))} = ${v + p} km/h, proti: ${v - p} km/h.`, `Rychlost lodi je přesně uprostřed: (${v + p} + ${v - p}) : 2.`],
    steps: [`v + p = ${v + p}, v − p = ${v - p}`, `v = ${v} km/h`],
  });
}
function r_vzdalenost() {
  const [v1, v2, T] = hledej(() => [pick([10, 12, 15, 20, 30]), pick([20, 30, 40, 45, 60]), pick([1, 1.5, 2, 3, 4, 5])], ([v1, v2, T]) => v1 < v2 && cele(T * v1 * v2 / (v1 + v2)));
  const s = T * v1 * v2 / (v1 + v2);
  return N({
    text: `Kurýr jel do skladu rychlostí ${B(v1 + ' km/h')} a zpátky ${B(v2 + ' km/h')}. Cesta tam a zpět trvala ${B(cz(T) + ' h')}.`, q: 'Jak daleko je sklad?', ans: s, unit: 'km',
    traps: [[rd(T * (v1 + v2) / 2, 3), 'To by byla celá cesta tam i zpět s průměrem rychlostí.'], [2 * s, 'To je cesta tam i zpět.']],
    hints: ['Označ x = vzdálenost.', `x/${v1} + x/${v2} = ${cz(T)}`],
    steps: [`x/${v1} + x/${v2} = ${cz(T)}`, `x = ${s} km`],
  });
}
function r_vor() {
  const p = pick([2, 3, 4, 5]), t = pick([3, 4, 5, 6, 8]), s = p * t, d = pick([3, 4, 5]);
  return N({
    text: `Vor nemá motor ani vesla, nese ho jen proud řeky rychlostí ${p} km/h. Na voru ${d < 5 ? 'jsou' : 'je'} ${d} ${tv(d, 'vodák', 'vodáci', 'vodáků')} a vor pluje do kempu vzdáleného ${s} km.`, q: 'Za kolik hodin tam dopluje?', ans: t, unit: 'h', units: true,
    traps: [[rd(s / (p * d), 3), 'Počet vodáků rychlost voru nemění.']],
    hints: ['Vor má rychlost proudu.'],
    steps: [`${s} : ${p} = ${t} h`],
  });
}
function r_celaPlavba() {
  const [v, p, T] = hledej(() => [pick([10, 12, 15, 18, 20, 24]), pick([2, 3, 4, 5, 6]), pick([2, 3, 4, 5, 6, 8])], ([v, p, T]) => v > p && cele(T * (v * v - p * p) / (2 * v)));
  const s = T * (v * v - p * p) / (2 * v);
  return N({
    text: `Motorový člun jede na klidné vodě ${v} km/h, proud řeky má ${p} km/h. Člun vyplul po proudu a vrátil se zpátky. Celá plavba trvala ${T} h. Nádrž má 40 litrů.`, q: 'Jak daleko od přístavu se člun otočil?', ans: s, unit: 'km', units: true,
    traps: [[rd(T * v / 2, 3), 'Proud nelze zanedbat: tam je člun rychlejší, zpátky pomalejší.']],
    hints: [`x/${v + p} + x/${v - p} = ${T}. Nádrž se neptá.`],
    steps: [`x/${v + p} + x/${v - p} = ${T}`, `x = ${s} km`],
  });
}
function r_kajak() {
  const [v, p, s] = hledej(() => [pick([6, 7, 8, 9, 10]), pick([1, 2, 3]), pick([2, 3, 4, 5, 6, 8])], ([v, p, s]) => v > p && cele((s / (v + p) + s / (v - p)) * 60));
  const T = rd((s / (v + p) + s / (v - p)) * 60, 3);
  return N({
    text: `Kajakář pádluje na klidné vodě rychlostí ${v} km/h. Proti proudu (${p} km/h) jede ${s} km k jezu a zpátky po proudu. Kajak váží 22 kg.`, q: 'Kolik minut trvá cesta tam a zpět?', ans: T, unit: 'min', units: true,
    traps: [[rd(2 * s / v * 60, 3), 'Proud mění rychlost tam i zpátky.'], [rd(T / 60, 3), 'To jsou hodiny. Převeď na minuty.']],
    hints: [`${s} : ${v - p} + ${s} : ${v + p} hodin, pak · 60. Hmotnost kajaku se neptá.`],
    steps: [`Tam: ${cz(s / (v - p), 3)} h, zpět: ${cz(s / (v + p), 3)} h`, `Celkem ${cz(T)} min`],
  });
}
function r_bezec() {
  const [v1, v2, T] = hledej(() => [pick([8, 9, 10, 12]), pick([4, 5, 6]), pick([40, 45, 50, 60, 75, 90])], ([v1, v2, T]) => cele(T / 60 * v1 * v2 / (v1 + v2) * 10));
  const s = rd(T / 60 * v1 * v2 / (v1 + v2), 1);
  return N({
    text: `Běžec běžel k řece rychlostí ${v1} km/h a zpátky šel pěšky ${v2} km/h. Celá cesta trvala ${T} minut. Spálil přitom 400 kcal.`, q: 'Jak daleko je to k řece?', ans: s, unit: 'km', units: true,
    traps: [[rd(T * v1 * v2 / (v1 + v2), 3), 'Čas převeď na hodiny.']],
    hints: [`${T} min = ${cz(T / 60, 3)} h. x/${v1} + x/${v2} = ${cz(T / 60, 3)}. Kalorie se neptají.`],
    steps: [`x/${v1} + x/${v2} = ${cz(T / 60, 3)}`, `x = ${cz(s)} km`],
  });
}

// ======================= 905 FINANČNÍ MATEMATIKA (Banka) =======================
const UROK = 'úrok (peníze, které ti banka přidá za uložení)';
function f_urok() {
  const V = pick([5000, 10000, 20000, 25000, 40000, 50000]), p = pick([1, 2, 3, 4, 5, 2.5, 1.5]), u = V * p / 100;
  return N({
    text: `Na spořicí účet uložíš ${B(kc(V))}. Banka dává ročně ${B(pc(p))}.`, q: `Kolik korun činí ${UROK} za rok?`, ans: u, unit: 'Kč',
    traps: [[V + u, 'To je celý stav účtu. Ptám se jen na úrok.'], [rd(V / p, 3), `${p} % z ${V} = ${V} · ${cz(p)} : 100.`]],
    hints: ['Úrok je určité procento z vkladu.', `1 % z ${cz(V)} Kč je ${cz(V / 100)} Kč.`, `${cz(V / 100)} · ${cz(p)} = ?`],
    steps: [`${cz(p)} % z ${cz(V)} = ${cz(V)} · ${cz(p)} : 100 = ${cz(u)} Kč`],
  });
}
function f_dan() {
  const u = pick([200, 400, 600, 800, 1000, 1200, 1500, 2000]), d = u * 0.15;
  return N({
    text: `Za rok ti banka připíše úrok ${B(kc(u))}. Z úroku se ale platí daň ${B('15 %')} (část, kterou si vezme stát).`, q: 'Kolik korun ti z úroku skutečně zůstane?', ans: u - d, unit: 'Kč',
    traps: [[d, 'To je daň. Ptám se, kolik zůstane tobě.'], [u - 15, 'Daň je 15 procent, ne 15 korun.']],
    hints: ['Spočítej daň a odečti ji.', `15 % z ${cz(u)} = ${cz(d)} Kč.`, `${cz(u)} − ${cz(d)} = ?`],
    steps: [`Daň: 15 % z ${cz(u)} = ${cz(d)} Kč`, `Zůstane: ${cz(u - d)} Kč (= 85 % úroku)`],
  });
}
function f_stav() {
  const V = pick([8000, 10000, 12000, 15000, 20000, 30000]), p = pick([2, 3, 4, 5]), S = V * (1 + p / 100);
  return N({
    text: `Babička ti na účet uložila ${B(kc(V))}. Banka připisuje ročně ${B(pc(p))} (o daň se nestarej).`, q: 'Kolik korun bude na účtu za rok?', ans: S, unit: 'Kč',
    traps: [[V * p / 100, 'To je jen úrok. Přičti ho k vkladu.'], [V + p, 'Úrok je v procentech, ne v korunách.']],
    hints: ['Stav = vklad + úrok.', `Úrok: ${p} % z ${cz(V)} = ${cz(V * p / 100)} Kč.`, `${cz(V)} + ${cz(V * p / 100)} = ?`],
    steps: [`Úrok: ${cz(V * p / 100)} Kč`, `Stav: ${cz(S)} Kč`],
  });
}
function f_splatky() {
  const P = pick([12990, 15990, 19990, 24990]), a = pick([2000, 3000, 5000]), n = pick([10, 12, 18, 24]), s = Math.ceil((P - a) * pick([1.1, 1.15, 1.2]) / n / 10) * 10, celk = a + n * s;
  return N({
    text: `Mobil stojí ${B(kc(P))}. Na splátky se zaplatí nejdřív ${B(kc(a))} a pak ${B(n + ' splátek')} po ${B(kc(s))}.`, q: 'O kolik korun víc zaplatíš na splátky než při placení najednou?', ans: celk - P, unit: 'Kč',
    traps: [[celk, 'To je celá částka na splátky. Ptám se, o kolik je to víc.'], [n * s - P, 'Nezapomeň na první platbu ' + cz(a) + ' Kč.']],
    hints: ['Spočítej, kolik zaplatíš na splátky celkem.', `${cz(a)} + ${n} · ${cz(s)} = ${cz(celk)} Kč.`, `Odečti cenu mobilu: ${cz(celk)} − ${cz(P)}.`],
    steps: [`Na splátky: ${cz(a)} + ${n} · ${cz(s)} = ${cz(celk)} Kč`, `Navíc: ${cz(celk)} − ${cz(P)} = ${cz(celk - P)} Kč`],
  });
}
function f_lepsi() {
  const [V1, p1, V2, p2] = hledej(() => [pick([10000, 20000, 30000, 40000]), pick([2, 3, 4, 5]), pick([10000, 20000, 30000, 40000]), pick([2, 3, 4, 5])], ([V1, p1, V2, p2]) => V1 !== V2 && p1 !== p2 && V1 * p1 !== V2 * p2);
  const u1 = V1 * p1 / 100, u2 = V2 * p2 / 100, ok = u1 > u2 ? 'Petra' : 'Tomáš';
  return C({
    text: `Petra má na účtu ${B(kc(V1))} s úrokem ${B(pc(p1))} ročně. Tomáš má ${B(kc(V2))} s úrokem ${B(pc(p2))} ročně.`, q: 'Kdo dostane za rok větší úrok (víc korun)?', ok, bad: [ok === 'Petra' ? 'Tomáš' : 'Petra', 'oba stejně'],
    hints: ['Spočítej úrok každého v korunách.', `Petra: ${p1} % z ${cz(V1)}.`, `Tomáš: ${p2} % z ${cz(V2)}.`],
    steps: [`Petra: ${cz(u1)} Kč`, `Tomáš: ${cz(u2)} Kč`, `Víc dostane ${ok}.`],
  });
}
function f_poDani() {
  const V = pick([10000, 20000, 40000, 50000, 100000]), p = pick([2, 3, 4, 5]), u = V * p / 100, S = V + u * 0.85;
  return N({
    text: `Na termínovaný vklad (peníze uložené na pevnou dobu) se uloží ${B(kc(V))} s úrokem ${B(pc(p))} ročně. Z úroku se platí daň ${B('15 %')}.`, q: 'Kolik korun bude na účtu po roce?', ans: S, unit: 'Kč',
    traps: [[V + u, 'Nezapomeň na daň z úroku.'], [V * 0.85 + u, 'Daň se platí jen z úroku, ne z celého vkladu.']],
    hints: [`Úrok: ${cz(u)} Kč. Zůstane z něj 85 %.`, `${cz(V)} + 0,85 · ${cz(u)}`],
    steps: [`Úrok ${cz(u)} Kč, po dani ${cz(u * 0.85)} Kč`, `Stav: ${cz(S)} Kč`],
  });
}
function f_dvaRoky() {
  const V = pick([10000, 20000, 50000]), p = pick([2, 4, 5, 10]), S = rd(V * (1 + p / 100) ** 2, 2);
  return N({
    text: `Uložíš ${B(kc(V))} na 2 roky s úrokem ${B(pc(p))} ročně. Úrok se po prvním roce přičte k vkladu a ve druhém roce se úročí i on (daň neřeš).`, q: 'Kolik korun bude na účtu po 2 letech?', ans: S, unit: 'Kč',
    traps: [[V * (1 + 2 * p / 100), 'Ve druhém roce se úročí i úrok z prvního roku.'], [rd(V * (1 + p / 100), 2), 'To je stav po prvním roce.']],
    hints: [`Po 1. roce: ${cz(V)} · ${cz(1 + p / 100)} = ${cz(V * (1 + p / 100))} Kč.`, `Po 2. roce: ${cz(V * (1 + p / 100))} · ${cz(1 + p / 100)}.`],
    steps: [`1. rok: ${cz(V * (1 + p / 100))} Kč`, `2. rok: ${cz(S)} Kč`],
  });
}
function f_sazba() {
  const V = pick([10000, 20000, 25000, 40000, 50000]), p = pick([1, 2, 3, 4, 5, 1.5, 2.5]), u = V * p / 100;
  return N({
    text: `Za rok ti z vkladu ${B(kc(V))} banka připsala úrok ${B(kc(u))}.`, q: 'Kolik procent ročně banka dává (úroková sazba)?', ans: p, unit: '%',
    traps: [[rd(V / u, 3), 'Úrok : vklad · 100.'], [rd(u / 100, 3), 'Vyděl úrok vkladem.']],
    hints: ['Jakou část vkladu tvoří úrok?', `${cz(u)} : ${cz(V)} · 100 = ?`],
    steps: [`${cz(u)} : ${cz(V)} = ${cz(p / 100, 4)} = ${cz(p)} %`],
  });
}
function f_inflace() {
  const P = pick([40, 50, 80, 120, 250, 1000, 25000]), i = pick([2, 3, 5, 8, 10, 15]), N_ = rd(P * (1 + i / 100), 2);
  return N({
    text: `Inflace (o kolik procent celkově zdraží zboží za rok) byla ${B(pc(i))}. Rohlíky, nákup i kolo zdražily přesně o tolik. Věc stála ${B(kc(P))}.`, q: 'Kolik stojí po roce?', ans: N_, unit: 'Kč',
    traps: [[rd(P * i / 100, 2), 'To je jen zdražení. Přičti ho k ceně.'], [P + i, 'Zdražení je v procentech.']],
    hints: [`Zdražení: ${i} % z ${cz(P)}.`, `${cz(P)} · ${cz(1 + i / 100)} = ?`],
    steps: [`${cz(P)} · ${cz(1 + i / 100)} = ${cz(N_)} Kč`],
  });
}
function f_preplatek() {
  const U = pick([10000, 20000, 50000, 100000]), n = pick([12, 24, 36]), pr = pick([10, 12, 15, 20, 25]), s = U * (1 + pr / 100) / n;
  if (!cele(s * 100)) return f_preplatek();
  return N({
    text: `Půjčka (úvěr) ${B(kc(U))} se splácí ${B(n + ' měsíců')} po ${B(kc(s))}.`, q: 'O kolik procent víc se vrátí, než se půjčilo?', ans: pr, unit: '%',
    traps: [[rd(U * pr / 100, 2), 'To je přeplatek v korunách. Ptám se v procentech.']],
    hints: [`Vrátí se ${n} · ${cz(s)} = ${cz(n * s)} Kč.`, `Přeplatek ${cz(n * s - U)} Kč : ${cz(U)} · 100.`],
    steps: [`Celkem ${cz(n * s)} Kč, přeplatek ${cz(n * s - U)} Kč`, `${cz(n * s - U)} : ${cz(U)} = ${pr} %`],
  });
}
function f_jakyVklad() {
  const p = pick([2, 4, 5]), V = pick([20000, 40000, 50000, 100000, 200000]), X_ = V * p / 100 * 0.85;
  return N({
    text: `Chceš za rok dostat úrok po zdanění (daň 15 %) přesně ${cz(X_)} Kč. Banka dává ${p} % ročně. Účet je zdarma, ale výběr z bankomatu stojí 25 Kč.`, q: 'Kolik korun musíš uložit?', ans: V, unit: 'Kč', units: true,
    traps: [[rd(X_ / (p / 100), 2), 'Nezapomeň na daň: zůstane jen 85 % úroku.']],
    hints: [`Úrok před zdaněním: ${cz(X_)} : 0,85 = ${cz(V * p / 100)} Kč. To je ${p} % vkladu. Poplatek za výběr se neptá.`],
    steps: [`Úrok před daní: ${cz(V * p / 100)} Kč`, `Vklad: ${cz(V * p / 100)} : ${cz(p / 100)} = ${cz(V)} Kč`],
  });
}
function f_dvaRokyDan() {
  const V = pick([10000, 20000, 50000, 80000]), p = pick([2, 3, 4, 5]), q = 1 + p / 100 * 0.85, S = rd(V * q * q, 2);
  return N({
    text: `Uložíš ${cz(V)} Kč na 2 roky s úrokem ${p} % ročně. Na konci každého roku se z úroku strhne daň 15 % a zbytek se přičte k vkladu. Banka sídlí v Praze.`, q: 'Kolik korun bude na účtu po 2 letech? Zaokrouhli na haléře.', ans: S, unit: 'Kč', units: true, dec: 2,
    traps: [[rd(V * (1 + p / 100) ** 2, 2), 'Nezapomeň na daň.'], [rd(V * (1 + 2 * p / 100 * 0.85), 2), 'Ve druhém roce se úročí i úrok z prvního roku.']],
    hints: [`Každý rok se stav vynásobí ${cz(q, 4)} (vklad + 85 % úroku). Sídlo banky se neptá.`],
    steps: [`1. rok: ${cz(V)} · ${cz(q, 4)} = ${cz(V * q, 2)} Kč`, `2. rok: ${cz(V * q, 2)} · ${cz(q, 4)} ≐ ${cz(S)} Kč`],
  });
}
function f_karta() {
  const D = pick([5000, 8000, 10000, 15000]), p = pick([2, 2.5, 3]), S = rd(D * (1 + p / 100) ** 3, 2);
  return N({
    text: `Dluh na kreditní kartě ${cz(D)} Kč se úročí ${cz(p)} % měsíčně a úrok se každý měsíc přičte k dluhu. Karta je zlatá a nic se nesplácí.`, q: 'Kolik korun bude dluh činit po 3 měsících? Zaokrouhli na haléře.', ans: S, unit: 'Kč', units: true, dec: 2,
    traps: [[rd(D * (1 + 3 * p / 100), 2), 'Úrok se každý měsíc počítá i z předchozích úroků.']],
    hints: [`Každý měsíc dluh · ${cz(1 + p / 100, 3)}. Barva karty se neptá.`],
    steps: [`${cz(D)} · ${cz(1 + p / 100, 3)}³ ≐ ${cz(S)} Kč`],
  });
}
function f_mzda() {
  const M = pick([30000, 36000, 40000, 45000]), z = pick([3, 5, 6, 8]), i = pick([2, 4, 5, 10]), cena = pick([20000, 30000]);
  const novaM = M * (1 + z / 100), novaC = cena * (1 + i / 100), r = rd(novaM - M, 2);
  return N({
    text: `Mamince zvedli plat ${cz(M)} Kč o ${z} %. Inflace (zdražení) byla ${i} %. Měsíční nákupy rodiny stály ${cz(cena)} Kč a zdražily přesně o inflaci.`, q: 'O kolik korun víc jí měsíčně zbude po nákupech než předtím? (Záporný výsledek zapiš se znaménkem minus.)', ans: rd(novaM - novaC - (M - cena), 2), unit: 'Kč', units: true, zap: true,
    traps: [[r, 'Nákupy taky zdražily.'], [rd(M * (z - i) / 100, 2), 'Inflace zdražila nákupy, ne celý plat.']],
    hints: [`Nový plat: ${cz(M)} · ${cz(1 + z / 100)}; nové nákupy: ${cz(cena)} · ${cz(1 + i / 100)}. Porovnej, kolik zbude teď a předtím.`],
    steps: [`Předtím zbylo ${cz(M - cena)} Kč`, `Teď: ${cz(novaM)} − ${cz(novaC)} = ${cz(novaM - novaC)} Kč`, `Rozdíl: ${cz(rd(novaM - novaC - (M - cena), 2))} Kč`],
  });
}

// ======================= 906 TĚLESA V PRAXI (Vesmírná stanice) =======================
function t_kuzel() {
  const r = pick([3, 5, 6]), v = pick([3, 6, 9, 12]), p = pia(x => x * r * r * v / 3, 2);
  return N({
    text: `Špička rakety má tvar kužele s poloměrem podstavy ${B(r + ' dm')} a výškou ${B(v + ' dm')} ${PI_T}.`, q: 'Jaký je její objem v dm³?', ...p, unit: 'dm³', fig: teleso('kuzel', { r: `r = ${r} dm`, v: `v = ${v} dm` }),
    traps: [[rd(3.14 * r * r * v, 2), 'To je objem válce. Kužel má jen třetinu.'], [rd(3.14 * r * v / 3, 2), 'Poloměr se násobí dvakrát (r²).']],
    hints: ['Kužel je jako válec, ale vejde se do něj jen třetina.', 'V = π · r² · v : 3.', `V = 3,14 · ${r * r} · ${v} : 3`],
    steps: ['V = π · r² · v : 3', `V = 3,14 · ${r * r} · ${v} : 3 = ${cz(p.ans)} dm³`],
  });
}
function t_jehlan() {
  const a = pick([3, 4, 6, 9]), v = a % 3 ? pick([3, 6, 9, 12]) : pick([4, 5, 7, 8, 10]);
  return N({
    text: `Přistávací modul má tvar jehlanu se čtvercovou podstavou (dno je čtverec, stěny se sbíhají do špičky). Strana podstavy je ${B(a + ' m')}, výška ${B(v + ' m')}.`, q: 'Jaký je jeho objem?', ans: a * a * v / 3, unit: 'm³', fig: teleso('jehlan', { a: `a = ${a} m`, v: `v = ${v} m` }),
    traps: [[a * a * v, 'To je objem kvádru. Jehlan má jen třetinu.'], [rd(a * v / 3, 3), 'Obsah podstavy je a · a.']],
    hints: ['Jehlan je třetina hranolu se stejnou podstavou a výškou.', 'V = a · a · v : 3.', `${a} · ${a} · ${v} : 3`],
    steps: [`Podstava: ${a} · ${a} = ${a * a} m²`, `V = ${a * a} · ${v} : 3 = ${a * a * v / 3} m³`],
  });
}
function t_koule() {
  const r = pick([1, 2, 3, 6]), p = pia(x => 4 / 3 * x * r ** 3, 2);
  return N({
    text: `Palivová nádrž má tvar koule s poloměrem ${B(r + ' m')} ${PI_T}.`, q: 'Jaký je její objem?', ...p, unit: 'm³', fig: teleso('koule', { r: `r = ${r} m` }),
    traps: [[rd(4 * 3.14 * r * r, 2), 'To je povrch koule. Objem je 4/3 · π · r³.'], [rd(3.14 * r ** 3, 2), 'Chybí 4/3.']],
    hints: ['Objem koule: V = 4/3 · π · r³.', `r³ = ${r} · ${r} · ${r} = ${r ** 3}.`, `V = 4 · 3,14 · ${r ** 3} : 3`],
    steps: [`V = 4/3 · 3,14 · ${r ** 3} = ${cz(p.ans)} m³`],
  });
}
function t_vzorec() {
  const [co, ok] = pick([['objem kužele', 'π · r² · v : 3'], ['objem koule', '4/3 · π · r³'], ['objem jehlanu', 'S<sub>p</sub> · v : 3'], ['povrch koule', '4 · π · r²']]);
  return C({
    text: `Inženýrka na stanici potřebuje spočítat ${B(co)}.`, q: 'Který vzorec použije?', ok, bad: ['π · r² · v : 3', '4/3 · π · r³', 'S<sub>p</sub> · v : 3', '4 · π · r²', 'π · r² · v'].filter(x => x !== ok).slice(0, 3),
    hints: ['Kužel a jehlan mají třetinu objemu válce nebo hranolu.', 'Koule: objem má r³ (tři rozměry), povrch r² (plocha).', 'S<sub>p</sub> je obsah podstavy.'],
    steps: [`${co}: ${ok}`],
  });
}
function t_povrchKoule() {
  const r = pick([1, 2, 3, 5, 10]), p = pia(x => 4 * x * r * r, 2);
  return N({
    text: `Kulový satelit má poloměr ${B(r + ' m')} a celý se pokryje ochrannou fólií ${PI_T}.`, q: 'Kolik m² fólie je potřeba (povrch koule)?', ...p, unit: 'm²', fig: teleso('koule', { r: `r = ${r} m` }),
    traps: [[rd(4 / 3 * 3.14 * r ** 3, 2), 'To je objem. Povrch je S = 4 · π · r².'], [rd(3.14 * r * r, 2), 'Povrch koule je čtyřikrát víc než obsah kruhu.']],
    hints: ['Povrch koule je čtyřikrát obsah kruhu se stejným poloměrem.', 'S = 4 · π · r².', `S = 4 · 3,14 · ${r * r}`],
    steps: [`S = 4 · 3,14 · ${r * r} = ${cz(p.ans)} m²`],
  });
}
function t_povrchKuzel() {
  const [r, s] = pick([[3, 5], [6, 10], [5, 13], [8, 17], [4, 5], [9, 15]]), p = pia(x => x * r * (r + s), 2);
  return N({
    text: `Kuželová špička antény má poloměr podstavy ${B(r + ' cm')} a stranu (vzdálenost od špičky k okraji podstavy) ${B(s + ' cm')} ${PI_T}.`, q: 'Jaký je povrch kužele (podstava + plášť)?', ...p, unit: 'cm²', fig: teleso('kuzel', { r: `r = ${r} cm`, s: `s = ${s} cm` }),
    traps: [[rd(3.14 * r * s, 2), 'To je jen plášť. Přičti podstavu.'], [rd(3.14 * r * r, 2), 'To je jen podstava.']],
    hints: ['Povrch = podstava (kruh) + plášť.', `Podstava π · r², plášť π · r · s.`, `3,14 · ${r} · (${r} + ${s})`],
    steps: [`Podstava: 3,14 · ${r * r} = ${cz(3.14 * r * r)} cm²`, `Plášť: 3,14 · ${r} · ${s} = ${cz(3.14 * r * s)} cm²`, `Povrch: ${cz(p.ans)} cm²`],
  });
}
function t_stena() {
  const [h, a, w] = pick([[4, 6, 5], [12, 10, 13], [4, 16, 10], [12, 18, 15], [8, 12, 10]]), S = 4 * a * w / 2;
  return N({
    text: `Střecha observatoře má tvar pravidelného čtyřbokého jehlanu (čtvercová podstava, čtyři stejné trojúhelníkové stěny). Strana podstavy je ${B(a + ' m')}, výška jehlanu ${B(h + ' m')}.`, q: 'Kolik m² plechu je potřeba na čtyři stěny?', ans: S, unit: 'm²', fig: teleso('jehlan', { a: `a = ${a} m`, v: `v = ${h} m` }),
    traps: [[4 * a * h / 2, 'Výška stěny (trojúhelníku) není výška jehlanu. Použij Pythagorovu větu.'], [a * a + S, 'Podstava se neplechuje.']],
    hints: [`Výška stěny w: pravoúhlý trojúhelník s odvěsnami ${h} m (výška) a ${a / 2} m (polovina strany).`, `w = √(${h}² + ${a / 2}²) = ${w} m. Jedna stěna: ${a} · ${w} : 2.`],
    steps: [`w = √(${h * h} + ${a * a / 4}) = ${w} m`, `Stěna: ${a} · ${w} : 2 = ${a * w / 2} m²`, `4 stěny: ${S} m²`],
  });
}
function t_litry() {
  const r = pick([5, 10, 15, 20]), p = pia(x => 4 / 3 * x * (r / 10) ** 3, 2);
  return N({
    text: `Kulová nádrž na vodu pro astronauty má poloměr ${B(r + ' cm')} ${PI_T}.`, q: 'Kolik litrů vody pojme? (1 l = 1 dm³)', ...p, unit: 'l',
    traps: [[rd(4 / 3 * 3.14 * r ** 3, 2), 'To jsou cm³. Převeď na litry (dm³).'], [rd(4 * 3.14 * (r / 10) ** 2, 2), 'To je povrch.']],
    hints: [`Převeď poloměr na dm: ${r} cm = ${cz(r / 10)} dm.`, `V = 4/3 · 3,14 · ${cz(r / 10)}³.`],
    steps: [`r = ${cz(r / 10)} dm`, `V = 4/3 · 3,14 · ${cz((r / 10) ** 3, 4)} = ${cz(p.ans)} dm³ = ${cz(p.ans)} l`],
  });
}
function t_kuzelD() {
  const d = pick([2, 4, 6, 10]), v = pick([3, 6, 9]), p = pia(x => x * (d / 2) ** 2 * v / 3, 2);
  return N({
    text: `Hromada měsíčního prachu má tvar kužele s průměrem podstavy ${B(d + ' m')} a výškou ${B(v + ' m')} ${PI_T}.`, q: 'Jaký je objem hromady?', ...p, unit: 'm³',
    traps: [[rd(3.14 * d * d * v / 3, 2), 'Do vzorce patří poloměr, polovina průměru.'], [rd(3.14 * (d / 2) ** 2 * v, 2), 'Kužel má třetinu objemu válce.']],
    hints: [`Poloměr = ${d} : 2 = ${d / 2} m.`, `V = 3,14 · ${d / 2}² · ${v} : 3.`],
    steps: [`r = ${d / 2} m`, `V = 3,14 · ${(d / 2) ** 2} · ${v} : 3 = ${cz(p.ans)} m³`],
  });
}
function t_hmotnost() {
  const r = pick([1, 2, 3, 5]), [mat, h] = pick([['oceli', 7.8], ['hliníku', 2.7], ['olova', 11.3]]), V = 4 / 3 * 3.14 * r ** 3, m = rd(V * h, 1);
  return N({
    text: `Kulička z ${mat} má poloměr ${B(r + ' cm')}. Hustota (kolik gramů váží 1 cm³) je ${B(cz(h) + ' g/cm³')} ${PI_T}.`, q: 'Kolik gramů kulička váží? Zaokrouhli na desetiny gramu.', ans: m, alt: [rd(4 / 3 * Math.PI * r ** 3 * h, 1)], unit: 'g', dec: 1,
    traps: [[rd(V, 1), 'To je objem. Vynásob ho hustotou.']],
    hints: [`Objem: 4/3 · 3,14 · ${r ** 3} = ${cz(V, 2)} cm³.`, `Hmotnost = objem · hustota.`],
    steps: [`V ≐ ${cz(V, 2)} cm³`, `m = ${cz(V, 2)} · ${cz(h)} ≐ ${cz(m)} g`],
  });
}
function t_zmrzlina() {
  const r = pick([2, 3]), v = pick([8, 10, 12]), Vk = 3.14 * r * r * v / 3, Vp = 2 / 3 * 3.14 * r ** 3, ans = rd(Vk + Vp, 2);
  return N({
    text: `Astronauti dostali zmrzlinu: kornout tvaru kužele (poloměr ${r} cm, výška ${v} cm) je plný a navrchu je polokoule zmrzliny se stejným poloměrem. Kornout váží 15 g. ${PI_T}`, q: 'Kolik cm³ zmrzliny dostal každý astronaut?', ans, alt: [rd(Math.PI * r * r * v / 3 + 2 / 3 * Math.PI * r ** 3, 2)], unit: 'cm³', units: true, dec: 2,
    traps: [[rd(Vk, 2), 'Přičti i polokouli navrchu.'], [rd(Vk + 2 * Vp, 2), 'Navrchu je jen polovina koule.']],
    hints: [`Kužel: π · r² · v : 3, polokoule: 2/3 · π · r³. Hmotnost kornoutu se neptá.`],
    steps: [`Kužel: ${cz(Vk, 2)} cm³`, `Polokoule: ${cz(Vp, 2)} cm³`, `Celkem ${cz(ans)} cm³`],
  });
}
function t_pyramida() {
  const a = pick([10, 20, 30]), v = pick([6, 9, 12, 15]), h = pick([2, 2.5]), V = a * a * v / 3, m = rd(V * h, 1);
  return N({
    text: `Model egyptské pyramidy v kajutě velitelky je jehlan se čtvercovou podstavou o straně ${a} cm a výškou ${v} cm. Je z pískovce s hustotou ${cz(h)} g/cm³. Stojí na podstavci vysokém 80 cm.`, q: 'Kolik kilogramů model váží?', ans: rd(m / 1000, 3), unit: 'kg', units: true,
    traps: [[rd(m, 3), 'To jsou gramy. Převeď na kilogramy.'], [rd(a * a * v * h / 1000, 3), 'Jehlan má třetinu objemu kvádru.']],
    hints: [`V = ${a}² · ${v} : 3 cm³, pak · ${cz(h)} g a převeď na kg. Podstavec se neptá.`],
    steps: [`V = ${a * a} · ${v} : 3 = ${cz(V)} cm³`, `m = ${cz(V)} · ${cz(h)} = ${cz(m)} g = ${cz(m / 1000)} kg`],
  });
}
function t_kouleVeValci() {
  const r = pick([5, 6, 8, 10]), Vv = 3.14 * r * r * 2 * r, Vk = 4 / 3 * 3.14 * r ** 3, ans = rd((Vv - Vk) / 1000, 3);
  return N({
    text: `Do válcové nádoby s poloměrem ${r} cm a výškou ${2 * r} cm se vloží koule s poloměrem ${r} cm (přesně se do ní vejde) a zbytek se dolije vodou. Nádoba je ze skla. ${PI_T}`, q: 'Kolik litrů vody se dolije? Zaokrouhli na tisíciny litru.', ans, alt: [rd((Math.PI * 2 * r ** 3 - 4 / 3 * Math.PI * r ** 3) / 1000, 3)], unit: 'l', units: true, dec: 3,
    traps: [[rd(Vv / 1000, 3), 'Koule část nádoby zabere.'], [rd((Vv - Vk), 3), 'To jsou cm³. Převeď na litry.']],
    hints: [`Válec: π · ${r}² · ${2 * r}, koule: 4/3 · π · ${r}³. Rozdíl převeď na litry (1 000 cm³ = 1 l).`],
    steps: [`Válec ${cz(Vv, 2)} cm³, koule ${cz(Vk, 2)} cm³`, `Voda: ${cz(Vv - Vk, 2)} cm³ ≐ ${cz(ans)} l`],
  });
}
function t_kuzelPyth() {
  const [r, s, v] = pick([[3, 5, 4], [6, 10, 8], [5, 13, 12], [9, 15, 12], [8, 17, 15]]), p = pia(x => x * r * r * v / 3, 2);
  return N({
    text: `Kuželový štít rakety má poloměr podstavy ${r} dm a stranu ${s} dm. Štít je natřený stříbrnou barvou. ${PI_T}`, q: 'Jaký je jeho objem v dm³?', ...p, unit: 'dm³', units: true,
    traps: [[rd(3.14 * r * r * s / 3, 2), 'Strana není výška. Výšku spočítej Pythagorovou větou.']],
    hints: [`Výška: v = √(${s}² − ${r}²) = ${v} dm. Barva se neptá.`],
    steps: [`v = √(${s * s} − ${r * r}) = ${v} dm`, `V = 3,14 · ${r * r} · ${v} : 3 = ${cz(p.ans)} dm³`],
  });
}

export const R9 = { rocnik: 9, temata: [
  { id: '901', nazev: 'Společná práce', ikona: '⚙', popis: 'Dva stroje, čerpadla, přítok a výpust', strazce: 'Ředitel', svet: 'tovarna',
    vyklad: [
      { h: 'Počítej část práce za hodinu', t: 'Stroj, který zakázku udělá za 6 hodin, udělá za 1 hodinu <b>1/6</b> zakázky. Druhý stroj, který to zvládne za 3 hodiny, udělá za hodinu <b>1/3</b>.' },
      { h: 'Spolu se části sčítají', t: '1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 zakázky za hodinu. Celou zakázku proto zvládnou za <b>2 hodiny</b>.<br>Rovnice: x/6 + x/3 = 1 (celá práce = 1).' },
      { h: 'Kontrola selským rozumem', t: 'Spolu to musí být <b>rychlejší</b> než i ten rychlejší stroj sám. Když vyjde víc než 3 hodiny, je to špatně. Doby se nikdy nesčítají ani nepočítá se jejich průměr.' },
      { h: 'Přítok a výpust', t: 'Když jedno čerpadlo napouští a druhé vypouští, části za hodinu se <b>odčítají</b>: 1/3 − 1/6 = 1/6 nádrže za hodinu, nádrž se naplní za 6 hodin.' },
    ],
    u: [[s_zaklad, s_zaHodinu, s_rovnice, s_stejni, s_cerpadla], [s_nejdriv, s_druhy, s_pritokOdtok, s_tri, s_procent], [s_minuty, s_odejde, s_kratRychlejsi, s_tiskarny]],
    rychle: [s_zaklad, s_stejni, s_cerpadla, s_pritokOdtok] },
  { id: '902', nazev: 'Směsi a roztoky', ikona: '⚗', popis: 'Koncentrace, ředění, míchání, cena směsi', strazce: 'Profesorka', svet: 'laborator',
    vyklad: [
      { h: 'Koncentrace', t: 'Koncentrace říká, kolik procent roztoku tvoří rozpuštěná látka. 200 g roztoku s koncentrací 5 % obsahuje 5 % z 200 g = <b>10 g soli</b> a 190 g vody.' },
      { h: 'Sůl se nikam neztratí', t: 'Když přiliješ vodu nebo se voda odpaří, množství soli zůstane <b>stejné</b>. Změní se jen hmotnost roztoku. Proto vždy začni otázkou: kolik je tam soli?' },
      { h: 'Míchání dvou roztoků', t: 'Sečti sůl z obou roztoků a vyděl ji hmotností celé směsi. 100 g 10% a 300 g 30% roztoku: sůl 10 + 90 = 100 g, směs 400 g → 25 %. Průměr procent (20 %) by byl špatně.' },
      { h: 'Cena směsi', t: 'Stejně se počítá cena: 2 kg po 200 Kč a 3 kg po 300 Kč stojí 400 + 900 = 1 300 Kč za 5 kg, tedy 260 Kč za kilogram.' },
    ],
    u: [[m_kolikSoli, m_koncentrace, m_cenaSmesi, m_rovniceVoda, m_coSeStane], [m_redeni, m_dvaRoztoky, m_pridatSul, m_kolikLevnejsi, m_odpareni], [m_kolikPridat, m_suseni, m_slitina, m_kolikLevnejsi]],
    rychle: [m_kolikSoli, m_koncentrace, m_cenaSmesi, m_dvaRoztoky] },
  { id: '903', nazev: 'Soustavy rovnic', ikona: '⧉', popis: 'Dvě neznámé: vstupenky, popcorn, slepice a králíci', strazce: 'Režisérka', svet: 'kino',
    vyklad: [
      { h: 'Dvě neznámé, dvě rovnice', t: 'Když neznáš dvě věci (počet dospělých i dětí), označ je <b>x</b> a <b>y</b>. Ze zadání pak vyčti dvě věty: jedna říká, kolik jich je, druhá, kolik se zaplatilo.' },
      { h: 'Dosazovací metoda', t: 'x + y = 10, 150x + 100y = 1 200<br>Z první: y = 10 − x. Dosaď do druhé: 150x + 100(10 − x) = 1 200 → 50x = 200 → x = 4, y = 6.' },
      { h: 'Sčítací metoda', t: 'x + y = 50, x − y = 10<br>Sečti rovnice: 2x = 60 → x = 30, y = 20.<br>Někdy je potřeba rovnici nejdřív něčím vynásobit, aby se jedna neznámá vyrušila.' },
      { h: 'Zkouška', t: 'Dosaď x i y do <b>obou</b> rovnic. Řešení soustavy musí platit v obou najednou.' },
    ],
    u: [[k_soustava, k_vstupenky, k_soucetRozdil, k_popcorn, k_jeReseni], [k_slepice, k_dveCeny, k_rady, k_mince, k_presun], [k_trzba, k_cislo, k_zaci, k_bankovky]],
    rychle: [k_soucetRozdil, k_popcorn, k_slepice, k_mince] },
  { id: '904', nazev: 'Pohyb po proudu a tam a zpět', ikona: '≈', popis: 'Proud řeky, cesta tam a zpátky, průměrná rychlost', strazce: 'Kapitán', svet: 'reka',
    vyklad: [
      { h: 'Po proudu', t: 'Proud loď nese, rychlosti se <b>sčítají</b>. Člun 12 km/h na řece s proudem 3 km/h jede po proudu 15 km/h.' },
      { h: 'Proti proudu', t: 'Proud loď brzdí, rychlosti se <b>odčítají</b>: 12 − 3 = 9 km/h. Vor bez motoru pluje přesně rychlostí proudu.' },
      { h: 'Tam a zpátky', t: 'Spočítej čas každé cesty zvlášť (t = s : v) a sečti je. Délka cesty je tam i zpátky stejná, liší se rychlost a čas.' },
      { h: 'Průměrná rychlost', t: 'Celá dráha : celý čas. Tam 30 km/h a zpátky 60 km/h po 60 km: 2 h + 1 h = 3 h na 120 km → <b>40 km/h</b>, ne 45.' },
    ],
    u: [[r_po, r_proti, r_casPo, r_rychlejsi, r_kopec], [r_tamZpet, r_prumer, r_proud, r_lod, r_vzdalenost], [r_vor, r_celaPlavba, r_kajak, r_bezec]],
    rychle: [r_po, r_proti, r_proud, r_kopec] },
  { id: '905', nazev: 'Finanční matematika', ikona: '¤', popis: 'Úrok, daň, splátky, inflace', strazce: 'Bankéř', svet: 'banka',
    vyklad: [
      { h: 'Úrok', t: 'Úrok jsou peníze, které ti banka přidá za to, že u ní máš uložené peníze. Je to procento z vkladu: 3 % z 20 000 Kč = <b>600 Kč</b> za rok.' },
      { h: 'Daň z úroku', t: 'Z úroku se platí daň 15 %, zůstane ti 85 %. Z 600 Kč úroku je daň 90 Kč a dostaneš 510 Kč.' },
      { h: 'Úrok z úroku', t: 'Když peníze necháš v bance dál, druhý rok se úročí i loňský úrok. 10 000 Kč s 10 %: po roce 11 000 Kč, po dvou letech 12 100 Kč (ne 12 000).' },
      { h: 'Splátky a inflace', t: 'Na splátky obvykle zaplatíš víc, než je cena: rozdíl je přeplatek. Inflace je zdražení, o kolik procent celkově stoupnou ceny za rok.' },
    ],
    u: [[f_urok, f_dan, f_stav, f_splatky, f_lepsi], [f_poDani, f_dvaRoky, f_sazba, f_inflace, f_preplatek], [f_jakyVklad, f_dvaRokyDan, f_karta, f_mzda]],
    rychle: [f_urok, f_dan, f_stav, f_sazba] },
  { id: '906', nazev: 'Tělesa v praxi', ikona: '△', popis: 'Kužel, jehlan, koule: objem, povrch, hmotnost (π ≐ 3,14)', strazce: 'Velitelka mise', svet: 'vesmir',
    vyklad: [
      { h: 'Kužel a jehlan', t: 'Kužel se vejde do válce, jehlan do hranolu se stejnou podstavou a výškou. Mají <b>třetinu</b> jejich objemu:<br>kužel V = π · r² · v : 3<br>jehlan V = S<sub>p</sub> · v : 3', fig: () => teleso('kuzel', { r: 'r', v: 'v', s: 's' }) },
      { h: 'Koule', t: 'Objem koule V = 4/3 · π · r³, povrch S = 4 · π · r² (čtyři kruhy se stejným poloměrem).', fig: () => teleso('koule', { r: 'r' }) },
      { h: 'Pythagorova věta v tělesech', t: 'U kužele tvoří výška, poloměr a strana pravoúhlý trojúhelník: s² = r² + v². U jehlanu tvoří výška, polovina strany podstavy a výška stěny také pravoúhlý trojúhelník.' },
      { h: 'Jednotky', t: '1 dm³ = 1 l, 1 000 cm³ = 1 l. Hmotnost = objem · hustota (kolik váží 1 cm³ nebo 1 m³ látky).' },
    ],
    u: [[t_kuzel, t_jehlan, t_koule, t_vzorec, t_povrchKoule], [t_povrchKuzel, t_stena, t_litry, t_kuzelD, t_hmotnost], [t_zmrzlina, t_pyramida, t_kouleVeValci, t_kuzelPyth]],
    rychle: [t_jehlan, t_kuzelD, t_litry, t_stena] },
] };
