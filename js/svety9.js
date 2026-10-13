// Světy 9. ročníku (barvy a ozdoby v css/svety9.css).
import { f, scZastavky, scPlneni, scDilky, znak } from './svetypom.js';

// pás s bednami: hotové bedny odjíždějí doprava
const scPas = (p, n) => { const hot = Math.round(p * n), w = 272 / n;
  return `<rect x="6" y="30" width="288" height="8" rx="4" class="sc-o"/>${Array.from({ length: 12 }, (_, k) => `<circle cx="${14 + k * 24.5}" cy="34" r="2" class="sc-v"/>`).join('')}
    ${Array.from({ length: n }, (_, k) => `<rect x="${f(12 + k * w + 2)}" y="${k < hot ? 12 : 20}" width="${f(Math.min(w - 4, 20))}" height="${k < hot ? 18 : 10}" rx="2" class="${k < hot ? 'sc-f' : 'sc-v'}"/>`).join('')}`; };
// řeka: vlnitá čára a loďka
const scReka = scZastavky('<path d="M-12-2h24l-5 8h-14z" class="sc-f"/><path d="M0-2v-12l9 9h-9" class="sc-o"/>', 'sc-l sc-vlna');
// mince, které přibývají na sloupku
const scMince = (p, n) => { const hot = Math.round(p * n), w = 284 / n;
  return Array.from({ length: n }, (_, k) => { const x = f(8 + k * w + w / 2), on = k < hot, h = on ? 2 + Math.min(k, 6) : 1;
    return Array.from({ length: h }, (_, j) => `<ellipse cx="${x}" cy="${38 - j * 4}" rx="${f(Math.min(w / 2 - 2, 11))}" ry="3" class="${on ? 'sc-f' : 'sc-v'}"/>`).join(''); }).join(''); };
// raketa letí k planetě
const scRaketa = (p, n) => scZastavky('<path d="M-10 0q10-10 20 0q-10 10-20 0z" class="sc-f"/><path d="M-10 0l-6-5v10z" class="sc-car"/><circle cx="3" cy="0" r="2.5" class="sc-o"/>', 'sc-l sc-teck')(p, n) + '<circle cx="292" cy="12" r="7" class="sc-o"/>';

export const ZNAKY9 = {
  tovarna: znak('<path d="M6 56V30l14 8v-8l14 8v-8l14 8V10h10v46z" class="z-p"/><rect x="12" y="44" width="8" height="6" class="z-k"/><rect x="26" y="44" width="8" height="6" class="z-k"/><rect x="40" y="44" width="8" height="6" class="z-k"/><circle cx="53" cy="5" r="3" class="z-d"/>'),
  laborator: znak('<path d="M24 6h16M27 6v16L12 50q-2 6 4 6h32q6 0 4-6L37 22V6" class="z-p"/><path d="M17 40h30l5 10q2 6-4 6H16q-6 0-4-6z" class="z-d"/><circle cx="28" cy="46" r="2.5" class="z-k"/><circle cx="38" cy="42" r="2" class="z-k"/>'),
  kino: znak('<rect x="6" y="18" width="52" height="34" rx="4" class="z-d"/><path d="M6 26h52M6 44h52" class="z-l"/>' + Array.from({ length: 6 }, (_, k) => `<rect x="${9 + k * 8.5}" y="20" width="4" height="4" class="z-p"/><rect x="${9 + k * 8.5}" y="46" width="4" height="4" class="z-p"/>`).join('') + '<path d="M27 29v12l10-6z" class="z-k"/>'),
  reka: znak('<path d="M4 42q7-5 14 0t14 0 14 0 14 0v14H4z" class="z-k"/><path d="M14 36h36l-6 8H20z" class="z-d"/><path d="M32 36V10l14 20H32" class="z-p"/>'),
  banka: znak('<path d="M6 24L32 8l26 16z" class="z-d"/><rect x="8" y="24" width="48" height="5" class="z-p"/>' + [14, 26, 38, 50].map(x => `<rect x="${x - 3}" y="30" width="6" height="18" class="z-p"/>`).join('') + '<rect x="6" y="48" width="52" height="8" class="z-d"/><circle cx="32" cy="17" r="3.5" class="z-k"/>'),
  vesmir: znak('<circle cx="30" cy="34" r="16" class="z-k"/><ellipse cx="30" cy="34" rx="27" ry="7" class="z-l" transform="rotate(-18 30 34)"/><path d="M14 30q16-8 32 0" class="z-l"/><circle cx="52" cy="10" r="3" class="z-d"/><circle cx="10" cy="12" r="2" class="z-p"/>'),
};

export const SVETY9 = {
  tovarna: { nazev: 'Továrna', stitek: 'Směna', scena: scPas, nastroj: 'tovarna', razitko: 'Expedováno', doklad: 'Výrobní list',
    ok: ['Linka běží.', 'Směna splněna.', 'Výroba v plánu.', 'Kontrola kvality: OK.'], chyba1: ['Linka se zasekla. Zkus to znovu.', 'Tohle by mistr nevzal.', 'Kontrola kvality nesouhlasí.'],
    chyba2: ['Mrkni na nápovědu.', 'Mistr směny radí: tady je nápověda.'], odhaleni: ['Takhle se práce rozdělí.', 'Projdi si postup.'] },
  laborator: { nazev: 'Laboratoř', stitek: 'Pokus', scena: scPlneni('M120 4h60M126 4v12L100 40h100L174 16V4'), nastroj: 'laborator', razitko: 'Ověřeno', doklad: 'Laboratorní protokol',
    ok: ['Reakce proběhla.', 'Pokus vyšel.', 'Přesně namícháno.', 'Výsledek ověřen.'], chyba1: ['Zkumavka zasyčela. Zkus to znovu.', 'Tohle se nesmísilo.', 'Měření nesedí.'],
    chyba2: ['Mrkni na nápovědu.', 'Tady je postup z laboratorního deníku.'], odhaleni: ['Takhle se směs spočítá.', 'Projdi si postup.'] },
  kino: { nazev: 'Kino', stitek: 'Představení', scena: scDilky('rect'), nastroj: 'kino', razitko: 'Vstup', doklad: 'Vstupenka',
    ok: ['Přesně podle scénáře.', 'Happy end.', 'Potlesk v sále.', 'Obě neznámé odhaleny.'], chyba1: ['Střih! Zkus to znovu.', 'Tohle ve scénáři není.', 'Zápletka nesedí.'],
    chyba2: ['Mrkni na nápovědu.', 'Tady je scénář.'], odhaleni: ['Takhle se soustava vyřeší.', 'Projdi si postup.'] },
  reka: { nazev: 'Řeka', stitek: 'Plavba', scena: scReka, nastroj: 'reka', razitko: 'V přístavu', doklad: 'Lodní deník',
    ok: ['Jsme v přístavu.', 'Proud zvládnutý.', 'Kurz sedí.', 'Přistáváme.'], chyba1: ['Proud tě strhl. Zkus to znovu.', 'Najeli jsme na mělčinu.', 'Kurz nesedí.'],
    chyba2: ['Mrkni na nápovědu.', 'Kapitán radí: tady je nápověda.'], odhaleni: ['Takhle se plavba spočítá.', 'Projdi si postup.'] },
  banka: { nazev: 'Banka', stitek: 'Transakce', scena: scMince, nastroj: 'banka', razitko: 'Zaúčtováno', doklad: 'Výpis z účtu',
    ok: ['Zaúčtováno.', 'Účet sedí.', 'Na korunu přesně.', 'Transakce schválena.'], chyba1: ['Transakce zamítnuta. Zkus to znovu.', 'Účet nesedí.', 'Tady chybí peníze.'],
    chyba2: ['Mrkni na nápovědu.', 'Bankéř radí: tady je nápověda.'], odhaleni: ['Takhle se to spočítá.', 'Projdi si výpočet.'] },
  vesmir: { nazev: 'Vesmírná stanice', stitek: 'Mise', scena: scRaketa, nastroj: 'vesmir', razitko: 'Přistáno', doklad: 'Palubní deník',
    ok: ['Přistání hladké.', 'Mise splněna.', 'Výpočet dráhy sedí.', 'Řídicí středisko souhlasí.'], chyba1: ['Houstone, máme problém. Zkus to znovu.', 'Mimo oběžnou dráhu.', 'Senzory hlásí chybu.'],
    chyba2: ['Mrkni na nápovědu.', 'Řídicí středisko posílá nápovědu.'], odhaleni: ['Takhle se objem spočítá.', 'Projdi si postup.'] },
};

const ozubene = (cx, cy, r, z, c, d = '') => `<g class="k-toc" style="transform-origin:${cx}px ${cy}px;${d}"><circle cx="${cx}" cy="${cy}" r="${r}" class="${c}"/>${Array.from({ length: z }, (_, k) => `<rect x="${cx - 4}" y="${cy - r - 7}" width="8" height="10" class="${c}" transform="rotate(${k * 360 / z} ${cx} ${cy})"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="${r * .35}" class="k-osa"/></g>`;

export const KULISY9 = {
  tovarna: () => `<svg class="k-svg k-horni" viewBox="0 0 400 120" preserveAspectRatio="xMaxYMin meet">${ozubene(330, 40, 30, 10, 'k-kolo')}${ozubene(375, 88, 18, 7, 'k-kolo2', 'animation-direction:reverse;animation-duration:5s')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 80" preserveAspectRatio="none"><rect y="44" width="400" height="14" rx="7" class="k-pas"/>${Array.from({ length: 17 }, (_, i) => `<circle cx="${12 + i * 24}" cy="51" r="4" class="k-osa"/>`).join('')}
      <g class="k-bedny">${[0, 110, 220, 330].map(x => `<rect x="${x}" y="14" width="40" height="30" rx="2" class="k-bedna"/><path d="M${x} 24h40" class="k-paska"/>`).join('')}</g><rect y="58" width="400" height="22" class="k-hazard"/></svg>`,
  laborator: () => `<svg class="k-svg k-dolni" viewBox="0 0 400 110" preserveAspectRatio="xMidYMax meet"><rect y="86" width="400" height="24" class="k-stul-l"/>
      <path d="M40 86V40h14v46z" class="k-sklo"/><rect x="40" y="62" width="14" height="24" class="k-tek1"/><path d="M80 86l14-34V30h10v22l14 34z" class="k-sklo"/><path d="M84 76l-4 10h38l-4-10z" class="k-tek2"/>
      <path d="M300 86V50h60v36z" class="k-sklo"/><rect x="300" y="64" width="60" height="22" class="k-tek3"/>${[0, 1, 2, 3, 4].map(i => `<circle cx="${312 + i * 9}" cy="80" r="2.5" class="k-bublinka" style="--d:${-i * .6}s"/>`).join('')}</svg>
    <svg class="k-svg k-horni" viewBox="0 0 400 50" preserveAspectRatio="xMinYMin meet">${Array.from({ length: 7 }, (_, i) => `<path d="M${20 + i * 26} 0v14l-8 14h16l-8-14" class="k-molekula"/><circle cx="${20 + i * 26}" cy="34" r="5" class="k-atom" style="--d:${-i * .4}s"/>`).join('')}</svg>`,
  kino: () => `<svg class="k-svg k-horni" viewBox="0 0 400 90" preserveAspectRatio="none"><path d="M0 0h400v18q-50 30-100 0q-50 30-100 0q-50 30-100 0q-50 30-100 0z" class="k-opona"/></svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 90" preserveAspectRatio="xMidYMax meet">${[0, 1].map(r => Array.from({ length: 11 }, (_, i) => `<path d="M${6 + i * 36 + r * 18} ${50 + r * 22}q0-16 14-16t14 16v18h-28z" class="k-sedadlo"/>`).join('')).join('')}
      <g class="k-popcorn"><path d="M180 90l-8-34h36l-8 34z" class="k-kornout"/>${[176, 186, 196, 204, 182, 194].map((x, i) => `<circle cx="${x}" cy="${52 - (i > 3 ? 8 : 0)}" r="6" class="k-pop"/>`).join('')}</g></svg>
    <svg class="k-svg k-levy" viewBox="0 0 80 400" preserveAspectRatio="xMinYMin meet"><path d="M0 0L80 400H0z" class="k-paprsek"/></svg>`,
  reka: () => `<svg class="k-svg k-dolni" viewBox="0 0 400 110" preserveAspectRatio="none"><g class="k-vlny">${[0, 1, 2].map(r => `<path d="M-40 ${30 + r * 26}${Array.from({ length: 12 }, () => 'q20-10 40 0').join('')}V110H-40z" class="k-voda${r}"/>`).join('')}</g></svg>
    <svg class="k-svg k-horni" viewBox="0 0 400 80" preserveAspectRatio="xMidYMin meet"><path d="M0 70q60-40 120-20t140-30 140 20V0H0z" class="k-breh"/>${[40, 90, 300, 350].map((x, i) => `<path d="M${x} ${50 - i % 2 * 8}l10-28 10 28z" class="k-smrk"/>`).join('')}</svg>
    <svg class="k-svg k-dolni k-lodka" viewBox="0 0 400 110" preserveAspectRatio="xMidYMax meet"><g class="k-houpe"><path d="M150 56h80l-12 14h-56z" class="k-lod"/><path d="M190 56V18l26 30h-26" class="k-plachta"/></g></svg>`,
  banka: () => `<svg class="k-svg k-horni" viewBox="0 0 400 120" preserveAspectRatio="xMaxYMin meet"><circle cx="340" cy="60" r="52" class="k-trezor"/><circle cx="340" cy="60" r="38" class="k-trezor2"/><g class="k-toc" style="transform-origin:340px 60px;animation-duration:14s">${Array.from({ length: 6 }, (_, k) => `<rect x="337" y="24" width="6" height="34" rx="3" class="k-osa" transform="rotate(${k * 60} 340 60)"/>`).join('')}</g><circle cx="340" cy="60" r="9" class="k-osa"/></svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 90" preserveAspectRatio="xMinYMax meet">${[[30, 7], [62, 11], [94, 5], [126, 9]].map(([x, n]) => Array.from({ length: n }, (_, j) => `<ellipse cx="${x}" cy="${84 - j * 6}" rx="14" ry="4" class="k-zlato"/>`).join('')).join('')}</svg>`,
  vesmir: () => `<svg class="k-svg k-cela" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">${Array.from({ length: 50 }, (_, i) => `<circle cx="${(i * 97) % 400}" cy="${(i * 151) % 700}" r="${1 + i % 3 * .6}" class="k-hvezda" style="--d:${-(i % 7) * .5}s"/>`).join('')}
      <circle cx="350" cy="90" r="48" class="k-planeta"/><ellipse cx="350" cy="90" rx="78" ry="14" class="k-prstenec" transform="rotate(-15 350 90)"/><circle cx="40" cy="640" r="80" class="k-mesic"/><circle cx="20" cy="610" r="12" class="k-krater"/><circle cx="70" cy="660" r="8" class="k-krater"/>
      <g class="k-raketa"><path d="M0-22q10 10 0 44q-10-34 0-44z" class="k-trup"/><path d="M-6 14l-6 10h8zM6 14l6 10h-8z" class="k-ploutev"/><circle cy="-4" r="3.5" class="k-okenko"/><path d="M-3 24l3 10 3-10z" class="k-plamen"/></g></svg>`,
};
