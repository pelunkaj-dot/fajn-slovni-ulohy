// Mapa 7. ročníku: údolí pod horou. Polární stanice na vrcholu, farma na kopci, stadion, silnice s čerpací stanicí,
// dole ulice s cukrárnou, restaurací a obchodním centrem. Barvy podle denní doby jako u 6. ročníku (css/vzhled.css).
import { strom, lampa, mrak, nebe, cedule, okna } from './mapapom.js';

export const MISTA7 = { polar: [83, 17], farma: [15, 44], stadion: [49, 50], benzinka: [83, 63], cukrarna: [12, 79], kuchyne: [34, 78], vyprodej: [62, 76] };

export function mapa7() {
  return `<svg viewBox="0 0 600 380" class="mapa-obr" role="img" aria-label="Údolí 7. ročníku: polární stanice, farma, stadion, čerpací stanice, cukrárna, restaurace a obchodní centrum">
  ${nebe('m7-nebe')}
  ${mrak(90, 50, 1, 0)}${mrak(320, 30, .8, -20)}
  <!-- hora s polární stanicí -->
  <path d="M330 250L500 70l120 150V380H330z" class="m-kopec2"/><path d="M466 106L500 70l36 44-14 8-12-10-14 12z" class="m7-snih"/>
  <g transform="translate(500 76)"><rect x="-14" y="-16" width="28" height="16" rx="2" class="m-budova"/><path d="M-16-16h32l-16-10z" class="m-strecha"/><rect x="18" y="-34" width="2" height="34" class="m-kmen"/><circle cx="19" cy="-36" r="3" class="m7-vitr"/></g>
  <path d="M0 240Q120 170 250 220T420 230V380H0z" class="m-kopec1"/>
  <!-- farma na kopci -->
  <g transform="translate(90 222)"><path d="M-30 0V-26L0-46l30 20V0z" class="m7-stodola"/><path d="M-34-24L0-50l34 26" class="m7-lem"/><rect x="-10" y="-20" width="20" height="20" class="m-budova"/><path d="M-10-20l20 20M10-20l-20 20" class="m7-lem"/></g>
  ${[0, 1, 2, 3].map(i => `<path d="M${140 + i * 16} ${232 - i * 4}q40-10 80 0" class="m7-brazda"/>`).join('')}
  ${strom(30, 236, .8)}${strom(150, 210, .7)}
  <!-- stadion -->
  <g transform="translate(296 250)"><ellipse cx="0" cy="0" rx="76" ry="30" class="m7-tribuna"/><ellipse cx="0" cy="-2" rx="58" ry="20" class="m7-travnik"/><path d="M0-22v40M-58-2h116" class="m7-cara"/><circle cx="0" cy="-2" r="7" class="m7-cara"/>
    ${[-80, 80].map(x => `<rect x="${x - 1.5}" y="-60" width="3" height="56" class="m-kmen"/><rect x="${x - 9}" y="-66" width="18" height="8" rx="2" class="m7-reflektor"/>`).join('')}</g>
  <!-- silnice a čerpací stanice -->
  <rect x="0" y="292" width="600" height="20" class="m7-silnice"/>${Array.from({ length: 15 }, (_, i) => `<rect x="${i * 42}" y="301" width="22" height="2.5" class="m7-pruh"/>`).join('')}
  <g transform="translate(496 290)"><rect x="-44" y="-44" width="88" height="8" rx="2" class="m7-strisa"/><rect x="-40" y="-36" width="4" height="36" class="m-kmen"/><rect x="36" y="-36" width="4" height="36" class="m-kmen"/>
    ${[-16, 12].map(x => `<rect x="${x}" y="-22" width="10" height="22" rx="2" class="m7-stojan"/><rect x="${x + 2}" y="-19" width="6" height="5" class="m-okno"/>`).join('')}${cedule(0, -60, 54, 'TANKUJ')}</g>
  <g class="m7-auto"><g transform="translate(0 292)"><rect x="0" y="-12" width="36" height="12" rx="4" class="m-loko"/><path d="M6-12l5-8h14l5 8z" class="m-loko"/><rect x="12" y="-18" width="12" height="5" rx="1" class="m-okno-v"/><circle cx="8" cy="1" r="4" class="m-kolo"/><circle cx="28" cy="1" r="4" class="m-kolo"/></g></g>
  <!-- ulice -->
  <rect x="0" y="312" width="600" height="68" class="m-zeme"/>
  <g transform="translate(70 360)"><rect x="-44" y="-52" width="88" height="52" class="m-budova"/><path d="M-48-52h96v12h-96z" class="m7-ruzova"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${-48 + i * 16} -40a8 6 0 0 0 16 0z" class="m7-ruzova"/>`).join('')}
    <rect x="-30" y="-30" width="22" height="22" rx="2" class="m-okno"/><rect x="8" y="-30" width="22" height="30" rx="2" class="m-dvere"/>${cedule(0, -68, 60, 'CUKRÁRNA')}</g>
  <g transform="translate(205 360)"><rect x="-44" y="-58" width="88" height="58" class="m-budova2"/><path d="M-48-58h96l-8-12h-80z" class="m-strecha"/><rect x="24" y="-84" width="10" height="20" class="m-budova"/>
    <path d="M29-88q-6-8 0-14t0-14" class="m7-kour"/>${okna(-34, -46, 3, 2, 14, 12, 24, 20)}${cedule(0, -82, 64, 'RESTAURACE')}</g>
  <g transform="translate(372 362)"><rect x="-70" y="-62" width="140" height="62" rx="4" class="m7-mall"/><rect x="-70" y="-62" width="140" height="14" rx="4" class="m7-mall2"/>${okna(-60, -40, 6, 2, 16, 12, 20, 18)}
    <text x="0" y="-51" class="m7-neon">VÝPRODEJ −30 %</text></g>
  ${lampa(130)}${lampa(470)}${strom(560, 360, 1)}${strom(282, 366, .8)}
</svg>`;
}
