// Světy témat: každé téma má vlastní vzhled úlohy, scénu postupu, znak, hlášky a zvukový nástroj,
// aby bylo na první pohled poznat, že se změnilo téma. Barvy světa jsou v css/style.css ([data-svet]).
import { SVETY7, ZNAKY7, KULISY7 } from './svety7.js';
import { SVETY8, ZNAKY8, KULISY8 } from './svety8.js';
import { SVETY9, ZNAKY9, KULISY9 } from './svety9.js';
const f = (x, d = 1) => +x.toFixed(d);

// Scény postupu: p = podíl hotových úloh (0–1), n = počet úloh v sérii. Kreslí se do 300 × 44.
const scTrh = (p, n) => {
  const xs = Array.from({ length: n }, (_, k) => 24 + k * 252 / Math.max(n - 1, 1)), hot = Math.round(p * n), x = 8 + p * 262;
  return `<line x1="4" y1="40" x2="296" y2="40" class="sc-l"/>${xs.map((v, k) => k < hot ? '' : `<rect x="${f(v - 5)}" y="${k % 2 ? 28 : 25}" width="10" height="${k % 2 ? 12 : 15}" rx="2" class="sc-v"/>`).join('')}
    <g transform="translate(${f(x)} 14)" class="sc-a"><path d="M0 4h6l5 16h17l4-12H9" class="sc-car"/>${Array.from({ length: Math.min(hot, 6) }, (_, k) => `<rect x="${12 + (k % 3) * 6}" y="${k < 3 ? 2 : -4}" width="5" height="6" rx="1" class="sc-f"/>`).join('')}<circle cx="15" cy="24" r="2.6" class="sc-f"/><circle cx="26" cy="24" r="2.6" class="sc-f"/></g>`;
};
const scNadrazi = (p, n) => {
  const x = 6 + p * 250, st = Array.from({ length: n + 1 }, (_, k) => 14 + k * 270 / n);
  return `<line x1="0" y1="36" x2="300" y2="36" class="sc-l"/>${Array.from({ length: 30 }, (_, k) => `<line x1="${k * 10 + 3}" y1="33" x2="${k * 10 + 3}" y2="39" class="sc-t"/>`).join('')}
    ${st.map((v, k) => `<circle cx="${f(v)}" cy="16" r="3" class="${k / n <= p + 1e-9 ? 'sc-f' : 'sc-v'}"/>`).join('')}
    <g transform="translate(${f(x)} 20)" class="sc-a"><rect x="0" y="0" width="38" height="14" rx="5" class="sc-f"/><rect x="5" y="3" width="7" height="5" rx="1" class="sc-o"/><rect x="15" y="3" width="7" height="5" rx="1" class="sc-o"/><rect x="25" y="3" width="7" height="5" rx="1" class="sc-o"/></g>`;
};
const DUM = 'M40 40V18L80 4l40 14v22zM60 40V26h14v14M88 22h18v10H88M150 40V10h60v30zM150 24h60M180 10v30M232 40V16h52v24zM232 16l26-12 26 12';
const scPlan = p => `<path d="${DUM}" class="sc-t" style="stroke-dasharray:3 3"/><path d="${DUM}" pathLength="1" class="sc-l sc-cara" style="stroke-dashoffset:${f(1 - p, 3)}"/>
    <path d="M8 42h284" class="sc-t"/>${Array.from({ length: 29 }, (_, k) => `<line x1="${8 + k * 10}" y1="42" x2="${8 + k * 10}" y2="${k % 5 ? 39 : 36}" class="sc-t"/>`).join('')}`;
const scAkvarium = (p, n, i = 0) => {
  const h = 4 + p * 32;
  return `<rect x="6" y="${f(40 - h)}" width="288" height="${f(h)}" class="sc-v"/><path d="M6 ${f(40 - h)} q12 -3 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" class="sc-l"/>
    <rect x="4" y="2" width="292" height="40" rx="6" class="sc-o"/>
    <g transform="translate(${f(30 + p * 220)} ${f(Math.max(40 - h / 2, 14))})" class="sc-a"><path d="M0 0c6-6 16-6 20 0-4 6-14 6-20 0zM-1 0l-7-5v10z" class="sc-f"/><circle cx="14" cy="-1" r="1.4" class="sc-o"/></g>
    ${[0, 1, 2].map(k => `<circle cx="${60 + ((i * 53 + k * 97) % 200)}" cy="${30 - k * 7}" r="${2 + k * 0.6}" class="sc-b sc-b${k}"/>`).join('')}`;
};
const scExpedice = p => {
  const bod = t => [10 + t * 270, 26 + 9 * Math.sin(t * Math.PI * 3)], d = Array.from({ length: 41 }, (_, k) => bod(k / 40).map(v => f(v)).join(',')).join(' '), [x, y] = bod(p);
  return `<polyline points="${d}" class="sc-t" style="stroke-dasharray:3 4"/><polyline points="${Array.from({ length: Math.round(p * 40) + 1 }, (_, k) => bod(k / 40).map(v => f(v)).join(',')).join(' ')}" class="sc-l"/>
    <path d="M282 34V10l12 5-12 5" class="sc-f"/><g transform="translate(${f(x)} ${f(y)})" class="sc-a"><circle r="6" class="sc-f"/><path d="M0-3v6M-3 0h6" class="sc-o"/></g>`;
};

// Znaky (do karty tématu a úvodu série)
const Z = {
  trh: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M14 6h36v52l-6-4-6 4-6-4-6 4-6-4-6 4z" class="z-p"/><path d="M20 16h24M20 24h16M20 32h24M20 42h3M25 42h1M28 42h3M33 42h1M36 42h2M40 42h4M20 46h24" class="z-l"/><text x="44" y="30" class="z-t" text-anchor="end">Kč</text></svg>',
  nadrazi: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" rx="5" class="z-d"/><rect x="11" y="20" width="9" height="13" rx="1.5" class="z-k"/><rect x="22" y="20" width="9" height="13" rx="1.5" class="z-k"/><rect x="34" y="20" width="9" height="13" rx="1.5" class="z-k"/><rect x="45" y="20" width="9" height="13" rx="1.5" class="z-k"/><path d="M11 26.5h43" class="z-s"/><path d="M12 40h40" class="z-l"/><path d="M26 6l6 8 6-8" class="z-l"/></svg>',
  plan: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="4" y="4" width="56" height="56" rx="4" class="z-d"/><path d="M4 18h56M4 32h56M4 46h56M18 4v56M32 4v56M46 4v56" class="z-s"/><path d="M14 50V30l18-14 18 14v20zM27 50V38h10v12" class="z-l"/></svg>',
  akvarium: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="10" width="54" height="44" rx="6" class="z-p"/><path d="M5 24q7-4 14 0t14 0 14 0 12 0V48a6 6 0 0 1-6 6H11a6 6 0 0 1-6-6z" class="z-d"/><path d="M22 38c6-7 17-7 21 0-4 7-15 7-21 0zM21 38l-8-6v12z" class="z-k"/><circle cx="38" cy="37" r="1.6" class="z-p"/><circle cx="48" cy="18" r="2.5" class="z-l"/><circle cx="44" cy="12" r="1.6" class="z-l"/></svg>',
  expedice: '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" class="z-p"/><circle cx="32" cy="32" r="20" class="z-l"/><path d="M32 12l6 20-6 20-6-20z" class="z-d"/><path d="M32 12l6 20h-12z" class="z-k"/><circle cx="32" cy="32" r="3" class="z-p"/></svg>',
};

export const SVETY = {
  trh: { nazev: 'Tržnice', stitek: 'Pokladna se ptá', scena: scTrh, nastroj: 'trh', razitko: 'Zaplaceno', doklad: 'Účtenka',
    ok: ['Účtenka sedí.', 'Pokladna souhlasí.', 'Ani haléř vedle.', 'Zaplaceno přesně.', 'Kasa cinká.', 'Tohle by prošlo každou kontrolou.'],
    chyba1: ['Pokladna hlásí chybu. Přepočítej to.', 'Tahle částka nesedí.', 'Na účtence je něco jinak. Zkus to znovu.', 'Takhle by to prodavač nevrátil.'],
    chyba2: ['Mrkni na nápovědu a pak znovu k pokladně.', 'Účtenka pořád nesedí. Tady je rada.'],
    odhaleni: ['Takhle se to vyúčtuje správně.', 'Projdi si účtenku krok za krokem.'] },
  expedice: { nazev: 'Expedice', stitek: 'Zápis do deníku', scena: scExpedice, nastroj: 'expedice', razitko: 'Zapsáno', doklad: 'Deník výpravy',
    ok: ['Kurz je správný.', 'Zápis do deníku sedí.', 'Na trase.', 'Přesně změřeno.', 'Výprava pokračuje.'],
    chyba1: ['Odbočka špatným směrem. Zkus to znovu.', 'Tudy cesta nevede.', 'Mapa říká něco jiného. Přepočítej.'],
    chyba2: ['Zastav a podívej se do nápovědy.', 'Kompas ukazuje jinam. Tady je rada.'],
    odhaleni: ['Takhle vede správná trasa.', 'Projdi si cestu krok za krokem.'] },
  nadrazi: { nazev: 'Nádraží', stitek: 'Hlášení', scena: scNadrazi, nastroj: 'nadrazi', razitko: 'Odjezd', doklad: 'Jízdní řád',
    ok: ['Spoj odjíždí načas.', 'Přesně podle jízdního řádu.', 'Výhybka přehozena správně.', 'Všechno navazuje.', 'Nástup dokončen.'],
    chyba1: ['Tenhle spoj nejede. Zkus to znovu.', 'Zpoždění! Přepočítej to.', 'Jízdní řád říká něco jiného.'],
    chyba2: ['Pozor, hlášení: nápověda na nástupišti.', 'Ještě jednou podle nápovědy.'],
    odhaleni: ['Správný jízdní řád vypadá takhle.', 'Projdi si to krok za krokem.'] },
  plan: { nazev: 'Stavební plán', stitek: 'Úkol stavby', scena: scPlan, nastroj: 'plan', razitko: 'Schváleno', doklad: 'Protokol stavby',
    ok: ['Rozměry sedí.', 'Výkres schválen.', 'Měřeno přesně.', 'Stavba může začít.', 'Na milimetr.'],
    chyba1: ['Na plánu to nevychází. Změř znovu.', 'Stavbyvedoucí nesouhlasí.', 'Tenhle rozměr nesedí.'],
    chyba2: ['Mrkni na nápovědu a narýsuj si to.', 'Pořád to nesedí. Tady je rada.'],
    odhaleni: ['Takhle vypadá správný výpočet.', 'Projdi si plán krok za krokem.'] },
  akvarium: { nazev: 'Akvárium', stitek: 'Otázka z hlubin', scena: scAkvarium, nastroj: 'akvarium', razitko: 'Přesně', doklad: 'Záznam z hlubin',
    ok: ['Hladina sedí.', 'Ryby jsou spokojené.', 'Přesně po okraj.', 'Ani kapka navíc.', 'Bublinky souhlasí.'],
    chyba1: ['Přeteklo to. Zkus to znovu.', 'Hladina nesedí.', 'Tolik vody tam není.'],
    chyba2: ['Ponoř se do nápovědy.', 'Pořád to nesedí. Tady je rada.'],
    odhaleni: ['Takhle se to spočítá.', 'Projdi si to krok za krokem.'] },
};
Object.assign(SVETY, SVETY7, SVETY8, SVETY9);
export const svet = id => SVETY[id] || null;
export const znak = id => Z[id] || '';
export function scenaSvg(id, p, n, i) {
  const s = SVETY[id]; if (!s) return '';
  return `<svg viewBox="0 0 300 44" class="scena sc-${id}" aria-hidden="true">${s.scena(p, n, i)}</svg>`;
}

// Kulisa světa za úlohou (celá obrazovka série). Jen ozdoba: pointer-events none, pod obsahem.
const ovoce = (x, y) => [0, 1, 2, 3].map(k => `<circle cx="${x + 12 + k * 18}" cy="${y - 4 - (k % 2) * 5}" r="9" class="k-o${k % 3}"/>`).join('');
const KULISY = {
  trh: () => `<svg class="k-svg k-horni" viewBox="0 0 400 60" preserveAspectRatio="none"><path d="M0 10 Q100 40 200 14 T400 10" class="k-snura"/>${Array.from({ length: 9 }, (_, i) => { const x = 18 + i * 45, y = 14 + 14 * Math.sin((i + .5) / 9 * Math.PI); return `<path d="M${x - 9} ${y}h18l-9 16z" class="k-pr${i % 3}"/>`; }).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 90" preserveAspectRatio="xMidYMax meet"><rect x="0" y="40" width="100" height="50" rx="4" class="k-bedna"/><path d="M0 58h100M0 74h100" class="k-lat"/>${ovoce(0, 40)}<rect x="300" y="46" width="100" height="44" rx="4" class="k-bedna"/><path d="M300 62h100M300 77h100" class="k-lat"/>${ovoce(300, 46)}</svg>`,
  nadrazi: () => `<svg class="k-svg k-horni" viewBox="0 0 400 140" preserveAspectRatio="xMidYMin slice">${[30, 150, 270].map(x => `<path d="M${x} 140V60a50 50 0 0 1 100 0v80z" class="k-okno"/><path d="M${x + 50} 10v130M${x} 90h100" class="k-mriz"/>`).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 70" preserveAspectRatio="none"><rect x="0" y="40" width="400" height="30" class="k-nastupiste"/><rect x="0" y="40" width="400" height="5" class="k-hrana"/>
      <g class="k-vlak"><rect x="0" y="6" width="150" height="30" rx="8" class="k-vagon"/><rect x="156" y="6" width="150" height="30" rx="8" class="k-vagon"/>${[10, 40, 70, 100, 166, 196, 226, 256].map(x => `<rect x="${x}" y="12" width="22" height="12" rx="2" class="k-okenko"/>`).join('')}</g></svg>`,
  plan: () => `<svg class="k-svg k-levy" viewBox="0 0 60 400" preserveAspectRatio="xMinYMid meet"><rect x="14" y="20" width="26" height="360" rx="3" class="k-pravitko"/>${Array.from({ length: 36 }, (_, i) => `<line x1="14" y1="${30 + i * 10}" x2="${i % 5 ? 22 : 28}" y2="${30 + i * 10}" class="k-ryska"/>`).join('')}</svg>
    <svg class="k-svg k-pravy" viewBox="0 0 60 400" preserveAspectRatio="xMaxYMax meet"><g transform="rotate(-12 30 300)"><rect x="22" y="150" width="14" height="210" class="k-tuzka"/><path d="M22 360h14l-7 22z" class="k-hrot"/><rect x="22" y="140" width="14" height="12" class="k-guma"/></g></svg>`,
  akvarium: () => `<svg class="k-svg k-cela" viewBox="0 0 400 700" preserveAspectRatio="xMidYMax slice">
      ${[[60, 560, 0], [320, 420, -4], [200, 300, -9]].map(([x, y, d]) => `<g class="k-ryba" style="--d:${d}s;--y:${y}px"><path d="M0 0c12-12 30-12 38 0-8 12-26 12-38 0zM0 0l-13-9v18z" class="k-rybka"/><circle cx="28" cy="-2" r="2" class="k-oko"/></g>`).join('')}
      ${Array.from({ length: 8 }, (_, i) => `<circle cx="${30 + i * 48}" cy="700" r="${3 + i % 3 * 2}" class="k-bub" style="--d:${-i * 1.3}s"/>`).join('')}
      ${[20, 70, 340, 380].map((x, i) => `<path d="M${x} 700c-10-40 10-60 0-${100 + i * 20}" class="k-rasa" style="--d:${-i}s"/>`).join('')}</svg>`,
  expedice: () => `<svg class="k-svg k-dolni" viewBox="0 0 400 120" preserveAspectRatio="none"><path d="M0 120L70 40l40 40 60-70 80 80 50-40 100 70z" class="k-hora"/><path d="M150 34l20-24 22 26-10-4-12 8z" class="k-snih"/></svg>
    <svg class="k-svg k-horni k-kompas" viewBox="0 0 120 120" preserveAspectRatio="xMaxYMin meet"><circle cx="60" cy="60" r="50" class="k-kruh"/><path d="M60 14l8 46-8 46-8-46z" class="k-strelka"/><text x="60" y="10" class="k-sever">S</text></svg>`,
};
export const kulisa = id => KULISY[id] ? `<div class="kulisa" data-svet="${id}" aria-hidden="true">${KULISY[id]()}</div>` : '';
Object.assign(Z, ZNAKY7, ZNAKY8, ZNAKY9);
Object.assign(KULISY, KULISY7, KULISY8, KULISY9);
