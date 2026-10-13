// Světy témat: každé téma má vlastní vzhled úlohy, scénu postupu, znak, hlášky a zvukový nástroj,
// aby bylo na první pohled poznat, že se změnilo téma. Barvy světa jsou v css/style.css ([data-svet]).
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
  trh: { nazev: 'Tržnice', stitek: 'Pokladna se ptá', scena: scTrh, nastroj: 'trh',
    ok: ['Účtenka sedí.', 'Pokladna souhlasí.', 'Ani haléř vedle.', 'Zaplaceno přesně.', 'Kasa cinká.', 'Tohle by prošlo každou kontrolou.'],
    chyba1: ['Pokladna hlásí chybu. Přepočítej to.', 'Tahle částka nesedí.', 'Na účtence je něco jinak. Zkus to znovu.', 'Takhle by to prodavač nevrátil.'],
    chyba2: ['Mrkni na nápovědu a pak znovu k pokladně.', 'Účtenka pořád nesedí. Tady je rada.'],
    odhaleni: ['Takhle se to vyúčtuje správně.', 'Projdi si účtenku krok za krokem.'] },
  expedice: { nazev: 'Expedice', stitek: 'Zápis do deníku', scena: scExpedice, nastroj: 'expedice',
    ok: ['Kurz je správný.', 'Zápis do deníku sedí.', 'Na trase.', 'Přesně změřeno.', 'Výprava pokračuje.'],
    chyba1: ['Odbočka špatným směrem. Zkus to znovu.', 'Tudy cesta nevede.', 'Mapa říká něco jiného. Přepočítej.'],
    chyba2: ['Zastav a podívej se do nápovědy.', 'Kompas ukazuje jinam. Tady je rada.'],
    odhaleni: ['Takhle vede správná trasa.', 'Projdi si cestu krok za krokem.'] },
  nadrazi: { nazev: 'Nádraží', stitek: 'Hlášení', scena: scNadrazi, nastroj: 'nadrazi',
    ok: ['Spoj odjíždí načas.', 'Přesně podle jízdního řádu.', 'Výhybka přehozena správně.', 'Všechno navazuje.', 'Nástup dokončen.'],
    chyba1: ['Tenhle spoj nejede. Zkus to znovu.', 'Zpoždění! Přepočítej to.', 'Jízdní řád říká něco jiného.'],
    chyba2: ['Pozor, hlášení: nápověda na nástupišti.', 'Ještě jednou podle nápovědy.'],
    odhaleni: ['Správný jízdní řád vypadá takhle.', 'Projdi si to krok za krokem.'] },
  plan: { nazev: 'Stavební plán', stitek: 'Úkol stavby', scena: scPlan, nastroj: 'plan',
    ok: ['Rozměry sedí.', 'Výkres schválen.', 'Měřeno přesně.', 'Stavba může začít.', 'Na milimetr.'],
    chyba1: ['Na plánu to nevychází. Změř znovu.', 'Stavbyvedoucí nesouhlasí.', 'Tenhle rozměr nesedí.'],
    chyba2: ['Mrkni na nápovědu a narýsuj si to.', 'Pořád to nesedí. Tady je rada.'],
    odhaleni: ['Takhle vypadá správný výpočet.', 'Projdi si plán krok za krokem.'] },
  akvarium: { nazev: 'Akvárium', stitek: 'Otázka z hlubin', scena: scAkvarium, nastroj: 'akvarium',
    ok: ['Hladina sedí.', 'Ryby jsou spokojené.', 'Přesně po okraj.', 'Ani kapka navíc.', 'Bublinky souhlasí.'],
    chyba1: ['Přeteklo to. Zkus to znovu.', 'Hladina nesedí.', 'Tolik vody tam není.'],
    chyba2: ['Ponoř se do nápovědy.', 'Pořád to nesedí. Tady je rada.'],
    odhaleni: ['Takhle se to spočítá.', 'Projdi si to krok za krokem.'] },
};
export const svet = id => SVETY[id] || null;
export const znak = id => Z[id] || '';
export function scenaSvg(id, p, n, i) {
  const s = SVETY[id]; if (!s) return '';
  return `<svg viewBox="0 0 300 44" class="scena sc-${id}" aria-hidden="true">${s.scena(p, n, i)}</svg>`;
}
