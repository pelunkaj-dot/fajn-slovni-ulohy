// Mapa 8. ročníku: centrum města. Závodní okruh na kopci, výšková budova s detektivní kanceláří, hasičská zbrojnice,
// cirkusový stan, dole ulice s fotoateliérem (rodinné album) a dílnou.
import { strom, lampa, mrak, nebe, cedule, okna } from './mapapom.js';

export const MISTA8 = { zavod: [84, 36], detektiv: [45, 20], hasici: [15, 47], cirkus: [79, 60], album: [17, 79], dilna: [55, 80] };

export function mapa8() {
  return `<svg viewBox="0 0 600 380" class="mapa-obr" role="img" aria-label="Centrum 8. ročníku: závodní okruh, detektivní kancelář, hasičská zbrojnice, cirkus, fotoateliér a dílna">
  ${nebe('m8-nebe')}
  ${mrak(120, 46, .9, -6)}${mrak(380, 36, .7, -30)}
  <path d="M300 250Q430 150 600 170V380H300z" class="m-kopec2"/>
  <!-- závodní okruh na kopci -->
  <g transform="translate(500 196)"><ellipse rx="86" ry="22" class="m8-trat"/><ellipse rx="64" ry="12" class="m-kopec1"/>
    <g class="m8-formule"><circle r="4" class="m-loko"/></g>${[-60, 0, 60].map(x => `<rect x="${x - 1}" y="-40" width="2" height="22" class="m-kmen"/>`).join('')}<path d="M-1-40h14v8H-1z" class="m8-vlajka"/></g>
  <path d="M0 250Q150 210 330 240T600 250V380H0z" class="m-kopec1"/>
  <!-- výšková budova s detektivní kanceláří -->
  <g transform="translate(262 300)"><rect x="-34" y="-196" width="68" height="196" class="m-budova2"/><rect x="-34" y="-196" width="68" height="10" class="m8-strecha"/>${okna(-26, -178, 4, 10, 9, 10, 15, 17)}
    <rect x="36" y="-170" width="12" height="74" rx="3" class="m8-neon-tabule"/><text x="42" y="-160" class="m8-neon-svisle">DETEKTIV</text></g>
  <!-- hasičská zbrojnice -->
  <g transform="translate(96 300)"><rect x="-66" y="-66" width="132" height="66" class="m8-cihla"/><rect x="40" y="-110" width="26" height="110" class="m8-cihla"/><path d="M36-110h34l-17-14z" class="m-strecha"/>
    ${[-56, -18].map(x => `<rect x="${x}" y="-46" width="32" height="46" rx="3" class="m8-vrata"/>${[0, 1, 2, 3].map(i => `<line x1="${x}" y1="${-38 + i * 10}" x2="${x + 32}" y2="${-38 + i * 10}" class="m8-lamela"/>`).join('')}`).join('')}${cedule(-4, -62, 60, 'HASIČI')}<circle cx="53" cy="-96" r="5" class="m8-maják"/></g>
  <!-- cirkus -->
  <g transform="translate(478 314)"><path d="M-78 0L0-96L78 0z" class="m8-stan1"/>${[-58, -30, 0, 30, 58].map((x, i) => `<path d="M0-96L${x - 10} 0h20z" class="${i % 2 ? 'm8-stan2' : 'm8-stan1'}"/>`).join('')}
    <path d="M0-96v-18l14 5-14 5" class="m8-praporek"/><path d="M-14 0a14 18 0 0 1 28 0z" class="m-cedule"/>${cedule(0, -36, 52, 'CIRKUS')}</g>
  <!-- ulice -->
  <rect x="0" y="312" width="600" height="68" class="m-zeme"/>
  <g transform="translate(100 362)"><rect x="-50" y="-48" width="100" height="48" class="m-budova"/><rect x="-36" y="-36" width="72" height="26" rx="2" class="m-okno"/><rect x="-14" y="-62" width="28" height="16" rx="3" class="m8-foto"/><circle cx="0" cy="-54" r="6" class="m-budova"/>${cedule(0, -10, 74, 'FOTOATELIÉR')}</g>
  <g transform="translate(330 362)"><path d="M-56 0V-44L0-66l56 22V0z" class="m8-dilna"/><rect x="-18" y="-34" width="36" height="34" class="m8-vrata"/><path d="M-40-52l20-6M40-52l-20-6" class="m8-lamela"/>${cedule(0, -82, 48, 'DÍLNA')}</g>
  <rect x="200" y="300" width="20" height="16" class="m-loko"/><g class="m8-hasicske"><g transform="translate(0 312)"><rect x="0" y="-18" width="46" height="16" rx="3" class="m-loko"/><rect x="34" y="-26" width="12" height="10" rx="2" class="m-okno-v"/><rect x="4" y="-24" width="26" height="4" class="m8-lamela"/><circle cx="10" cy="-2" r="4" class="m-kolo"/><circle cx="36" cy="-2" r="4" class="m-kolo"/></g></g>
  ${lampa(214)}${lampa(420)}${strom(24, 360, .9)}${strom(570, 360, 1)}${strom(216, 362, .7)}
</svg>`;
}
