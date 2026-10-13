// Světy 7. ročníku (barvy a ozdoby v css/svety7.css).
import { f, scZastavky, scPlneni, scDilky, znak } from './svetypom.js';

// dort rozkrájený na n dílků, hotové dílky jsou vybarvené
const scDort = (p, n) => {
  const hot = Math.round(p * n), r = 19, cx = 150, cy = 22;
  const dil = k => { const a1 = -Math.PI / 2 + k * 2 * Math.PI / n, a2 = a1 + 2 * Math.PI / n, v = (2 * Math.PI / n) > Math.PI ? 1 : 0;
    return `<path d="M${cx} ${cy}L${f(cx + r * Math.cos(a1))} ${f(cy + r * Math.sin(a1))}A${r} ${r} 0 ${v} 1 ${f(cx + r * Math.cos(a2))} ${f(cy + r * Math.sin(a2))}z" class="${k < hot ? 'sc-f' : 'sc-v'}"/>`; };
  return `<line x1="20" y1="22" x2="120" y2="22" class="sc-t" style="stroke-dasharray:2 5"/><line x1="180" y1="22" x2="280" y2="22" class="sc-t" style="stroke-dasharray:2 5"/>${Array.from({ length: n }, (_, k) => dil(k)).join('')}<text x="${hot < n ? 200 : 186}" y="27" class="sc-txt">${hot}/${n}</text>`;
};
// ručička ukazatele paliva
const scPalivo = p => { const a = Math.PI * (1 - p), x = 150 + 30 * Math.cos(a), y = 40 - 30 * Math.sin(a);
  return `<path d="M120 40a30 30 0 0 1 60 0" class="sc-l"/><text x="112" y="42" class="sc-txt">E</text><text x="182" y="42" class="sc-txt">F</text><line x1="150" y1="40" x2="${f(x)}" y2="${f(y)}" class="sc-car" style="transition:all .6s"/><circle cx="150" cy="40" r="3" class="sc-f"/>`; };
// teploměr naležato
const scTeplomer = p => `<rect x="30" y="16" width="250" height="12" rx="6" class="sc-o"/><circle cx="26" cy="22" r="10" class="sc-f"/><rect x="26" y="18" width="${f(8 + p * 246)}" height="8" rx="4" class="sc-f"/>${Array.from({ length: 11 }, (_, k) => `<line x1="${44 + k * 22}" y1="32" x2="${44 + k * 22}" y2="${k % 5 ? 36 : 40}" class="sc-t"/>`).join('')}`;

export const ZNAKY7 = {
  cukrarna: znak('<ellipse cx="32" cy="44" rx="24" ry="8" class="z-k"/><path d="M8 44V28h48v16" class="z-k"/><ellipse cx="32" cy="28" rx="24" ry="8" class="z-d"/><path d="M32 28L56 28A24 8 0 0 1 44 35z" class="z-p"/><path d="M14 36q4 4 8 0t8 0 8 0 8 0 8 0" class="z-l"/><circle cx="24" cy="20" r="4" class="z-k"/>'),
  kuchyne: znak('<path d="M10 30h44v16a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8z" class="z-d"/><rect x="6" y="26" width="52" height="6" rx="3" class="z-p"/><path d="M22 20q-4-5 0-10M32 20q-4-5 0-10M42 20q-4-5 0-10" class="z-l"/><path d="M4 38h6M54 38h6" class="z-l"/>'),
  benzinka: znak('<rect x="12" y="8" width="28" height="48" rx="4" class="z-d"/><rect x="17" y="13" width="18" height="12" rx="2" class="z-p"/><path d="M40 20l8 6v20a4 4 0 0 0 8 0V22l-6-6" class="z-l"/><rect x="8" y="52" width="36" height="6" rx="2" class="z-k"/><text x="26" y="23" class="z-t" text-anchor="middle" style="font-size:8px">95</text>'),
  farma: znak('<path d="M8 56V28L32 12l24 16v28z" class="z-d"/><path d="M4 30L32 10l28 20" class="z-l"/><rect x="24" y="36" width="16" height="20" class="z-p"/><path d="M24 36l16 20M40 36L24 56" class="z-l"/><rect x="26" y="22" width="12" height="8" class="z-k"/>'),
  stadion: znak('<circle cx="32" cy="32" r="22" class="z-p"/><path d="M32 18l8 6-3 10H27l-3-10z" class="z-d"/><path d="M32 18v-8M40 24l9-3M37 34l6 8M27 34l-6 8M24 24l-9-3" class="z-l"/>'),
  vyprodej: znak('<path d="M30 6h22a4 4 0 0 1 4 4v22L30 58 6 34z" class="z-d"/><circle cx="46" cy="16" r="4" class="z-p"/><text x="30" y="40" class="z-t" text-anchor="middle" style="font-size:15px;fill:#fff">%</text>'),
  polar: znak('<rect x="27" y="6" width="10" height="38" rx="5" class="z-p"/><circle cx="32" cy="48" r="9" class="z-d"/><rect x="30" y="24" width="4" height="22" class="z-d"/><path d="M50 14v16M43 18l14 8M43 26l14-8" class="z-l"/><path d="M6 20h8M6 28h6M6 36h8" class="z-l"/>'),
};

export const SVETY7 = {
  cukrarna: { nazev: 'Cukrárna', stitek: 'Objednávka', scena: scDort, nastroj: 'cukrarna', razitko: 'Upečeno', doklad: 'Objednávka dortů',
    ok: ['Dort rozdělen přesně.', 'Každý dílek sedí.', 'Sladké a správně.', 'Cukrář souhlasí.'], chyba1: ['Dílky nesedí. Zkus to znovu.', 'Takhle by se dort rozpadl.', 'Někdo by dostal víc. Přepočítej.'],
    chyba2: ['Rozkroj to podle nápovědy.', 'Mrkni na nápovědu.'], odhaleni: ['Takhle se dort dělí správně.', 'Projdi si dílky krok za krokem.'] },
  kuchyne: { nazev: 'Kuchyně', stitek: 'Recept', scena: scPlneni('M90 6h120l-12 32H102z'), nastroj: 'kuchyne', razitko: 'Uvařeno', doklad: 'Kuchařka',
    ok: ['Poměr sedí, chutná to.', 'Recept dodržen.', 'Šéfkuchař kývá.', 'Přesně podle receptu.'], chyba1: ['Tohle by se nedalo jíst. Zkus to znovu.', 'Poměr nesedí.', 'Moc soli! Přepočítej.'],
    chyba2: ['Podívej se do receptu, tedy do nápovědy.', 'Tady je rada od šéfkuchaře.'], odhaleni: ['Takhle se recept přepočítá.', 'Projdi si postup krok za krokem.'] },
  benzinka: { nazev: 'Čerpací stanice', stitek: 'Na displeji', scena: scPalivo, nastroj: 'benzinka', razitko: 'Natankováno', doklad: 'Paragon',
    ok: ['Plná nádrž.', 'Displej souhlasí.', 'Přesně natankováno.', 'Litry i koruny sedí.'], chyba1: ['Displej ukazuje něco jiného.', 'Tolik by se nenatankovalo. Zkus to znovu.', 'Přetekla nádrž. Přepočítej.'],
    chyba2: ['Mrkni na nápovědu u stojanu.', 'Tady je rada.'], odhaleni: ['Takhle se to spočítá trojčlenkou.', 'Projdi si postup.'] },
  farma: { nazev: 'Farma', stitek: 'Úkol na farmě', scena: scZastavky('<rect x="-12" y="-4" width="16" height="10" rx="2" class="sc-f"/><rect x="2" y="-10" width="9" height="10" rx="1" class="sc-f"/><circle cx="-8" cy="8" r="5" class="sc-o"/><circle cx="7" cy="9" r="3.5" class="sc-o"/>'), nastroj: 'farma', razitko: 'Sklizeno', doklad: 'Záznam z farmy',
    ok: ['Úroda je sklizená.', 'Farmář je spokojený.', 'Práce hotová včas.', 'Přesně tak.'], chyba1: ['Tohle by na poli nevyšlo.', 'Zkus to znovu, víc lidí znamená méně dní.', 'Nesedí to. Přepočítej.'],
    chyba2: ['Mrkni na nápovědu.', 'Tady je rada od farmáře.'], odhaleni: ['Takhle se to spočítá.', 'Projdi si postup.'] },
  stadion: { nazev: 'Stadion', stitek: 'Statistika zápasu', scena: scZastavky('<circle r="7" class="sc-o"/><path d="M0-7l2 4-2 3-2-3zM-6 2l4 0M6 2l-4 0" class="sc-car"/>'), nastroj: 'stadion', razitko: 'Gól', doklad: 'Výsledková tabule',
    ok: ['Gól!', 'Trefa do šibenice.', 'Statistika sedí.', 'Tribuny šílí.'], chyba1: ['Tyčka! Zkus to znovu.', 'Vedle brány.', 'Rozhodčí to neuznal. Přepočítej.'],
    chyba2: ['Trenér radí: mrkni na nápovědu.', 'Tady je rada z lavičky.'], odhaleni: ['Takhle se to počítá.', 'Rozbor zápasu krok za krokem.'] },
  vyprodej: { nazev: 'Výprodej', stitek: 'Akce', scena: scDilky(), nastroj: 'vyprodej', razitko: 'Koupeno', doklad: 'Pokladní doklad',
    ok: ['Výhodný nákup.', 'Sleva spočítaná přesně.', 'Cenovka sedí.', 'Super cena.'], chyba1: ['Tahle cena na cenovce není.', 'Sleva nesedí. Zkus to znovu.', 'Pokladna by to nevzala.'],
    chyba2: ['Mrkni na nápovědu.', 'Tady je rada.'], odhaleni: ['Takhle se sleva počítá.', 'Projdi si to krok za krokem.'] },
  polar: { nazev: 'Polární stanice', stitek: 'Hlášení ze stanice', scena: scTeplomer, nastroj: 'polar', razitko: 'Změřeno', doklad: 'Meteozáznam',
    ok: ['Teploměr souhlasí.', 'Měření sedí.', 'Stanice hlásí správně.', 'Přesně.'], chyba1: ['Pozor na znaménko. Zkus to znovu.', 'Teploměr ukazuje jinak.', 'Pod nulou se to počítá jinak. Přepočítej.'],
    chyba2: ['Mrkni na nápovědu, ať nezmrzneš.', 'Tady je rada ze stanice.'], odhaleni: ['Takhle se to spočítá na číselné ose.', 'Projdi si postup.'] },
};

export const KULISY7 = {
  cukrarna: () => `<svg class="k-svg k-horni" viewBox="0 0 400 40" preserveAspectRatio="none">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 40} 0h40v14a20 20 0 0 1-40 0z" class="${i % 2 ? 'k-a' : 'k-b'}"/>`).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet"><rect x="0" y="80" width="400" height="20" class="k-polic"/>
      ${[[40, 1], [330, 1.2]].map(([x, s]) => `<g transform="translate(${x} 80) scale(${s})"><rect x="-26" y="-34" width="52" height="34" rx="4" class="k-b"/><rect x="-26" y="-40" width="52" height="10" rx="5" class="k-a"/><circle cx="0" cy="-46" r="5" class="k-c"/></g>`).join('')}
      ${[130, 170, 210, 250].map(x => `<g transform="translate(${x} 80)"><path d="M-10 0l-3-14h26l-3 14z" class="k-c"/><circle cx="0" cy="-18" r="10" class="k-a"/></g>`).join('')}</svg>`,
  kuchyne: () => `<svg class="k-svg k-horni" viewBox="0 0 400 90" preserveAspectRatio="xMidYMin meet"><line x1="40" y1="8" x2="360" y2="8" class="k-tyc"/>
      <g class="k-houpe"><line x1="90" y1="8" x2="90" y2="60" class="k-tyc"/><ellipse cx="90" cy="68" rx="12" ry="9" class="k-a"/></g>
      <g class="k-houpe" style="--d:-1s"><line x1="200" y1="8" x2="200" y2="70" class="k-tyc"/><path d="M190 70q10 18 20 0z" class="k-b"/></g>
      <g class="k-houpe" style="--d:-2s"><line x1="310" y1="8" x2="310" y2="50" class="k-tyc"/><ellipse cx="310" cy="66" rx="9" ry="16" class="k-c"/></g></svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 80" preserveAspectRatio="xMidYMax meet"><rect x="0" y="56" width="400" height="24" class="k-polic"/><path d="M300 56V30h70v26" class="k-a"/><rect x="292" y="24" width="86" height="8" rx="4" class="k-tyc"/><path d="M320 20q-5-8 0-14M335 20q-5-8 0-14M350 20q-5-8 0-14" class="k-para"/></svg>`,
  benzinka: () => `<svg class="k-svg k-horni" viewBox="0 0 400 50" preserveAspectRatio="none"><rect x="0" y="0" width="400" height="26" class="k-a"/><rect x="0" y="26" width="400" height="6" class="k-b"/>${[60, 200, 340].map(x => `<rect x="${x - 30}" y="32" width="60" height="5" rx="2" class="k-svetlo"/>`).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 90" preserveAspectRatio="none"><rect x="0" y="40" width="400" height="50" class="k-silnice"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${i * 56 + 6}" y="62" width="30" height="5" class="k-pruh"/>`).join('')}</svg>
    <svg class="k-svg k-pravy" viewBox="0 0 60 400" preserveAspectRatio="xMaxYMax meet"><rect x="10" y="250" width="42" height="150" rx="6" class="k-b"/><rect x="16" y="262" width="30" height="22" rx="3" class="k-displej"/><path d="M52 300q8 4 6 30" class="k-tyc"/></svg>`,
  farma: () => `<svg class="k-svg k-horni" viewBox="0 0 400 80" preserveAspectRatio="xMaxYMin meet"><circle cx="340" cy="40" r="26" class="k-slunce"/></svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 110" preserveAspectRatio="none"><path d="M0 50Q200 20 400 50V110H0z" class="k-pole1"/><path d="M0 75Q200 50 400 80V110H0z" class="k-pole2"/>
      ${Array.from({ length: 11 }, (_, i) => `<rect x="${i * 40}" y="70" width="6" height="40" class="k-plot"/>`).join('')}<rect x="0" y="80" width="400" height="5" class="k-plot"/><rect x="0" y="94" width="400" height="5" class="k-plot"/></svg>`,
  stadion: () => `<svg class="k-svg k-horni" viewBox="0 0 400 70" preserveAspectRatio="none"><rect width="400" height="70" class="k-tribuna"/>${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i * 37) % 400 + 6}" cy="${12 + (i % 4) * 14}" r="5" class="k-divak k-d${i % 3}" style="--d:${(i % 7) * .3}s"/>`).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 80" preserveAspectRatio="xMidYMax meet"><rect x="140" y="20" width="120" height="60" class="k-branka"/><path d="M140 20v60M260 20v60M140 20h120" class="k-tyc"/>${Array.from({ length: 11 }, (_, i) => `<path d="M${150 + i * 11} 22v58" class="k-sit"/>`).join('')}</svg>`,
  vyprodej: () => `<svg class="k-svg k-horni" viewBox="0 0 400 110" preserveAspectRatio="xMidYMin meet"><text x="70" y="50" class="k-neon k-n1">−30 %</text><text x="300" y="80" class="k-neon k-n2">SALE</text>
      ${[[150, 0], [230, -1.5]].map(([x, d]) => `<g class="k-houpe" style="--d:${d}s"><line x1="${x}" y1="0" x2="${x}" y2="40" class="k-tyc"/><path d="M${x - 16} 40h32v30l-16 14-16-14z" class="k-a"/><text x="${x}" y="62" class="k-cena">%</text></g>`).join('')}</svg>`,
  polar: () => `<svg class="k-svg k-horni" viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 60Q100 10 200 50T400 30" class="k-zare1"/><path d="M0 80Q120 30 220 70T400 50" class="k-zare2"/></svg>
    <svg class="k-svg k-cela" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 53) % 400}" cy="-10" r="${1.5 + i % 3}" class="k-vlocka" style="--d:${-(i * 0.7) % 9}s;--x:${(i % 5) * 8 - 16}px"/>`).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 90" preserveAspectRatio="none"><path d="M0 50l60-20 50 18 70-28 60 24 80-20 80 22V90H0z" class="k-led"/><path d="M0 70h400v20H0z" class="k-more"/></svg>`,
};
