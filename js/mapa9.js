// Mapa 9. ročníku: nábřeží. Na kopci hvězdárna (vesmírná stanice), vlevo továrna s komínem, uprostřed laboratoř,
// vpravo kino, dole banka a přes celou mapu řeka s plachetnicí.
import { strom, lampa, mrak, nebe, cedule, okna } from './mapapom.js';

export const MISTA9 = { vesmir: [80, 15], tovarna: [9, 42], laborator: [47, 37], kino: [80, 54], banka: [26, 62], reka: [55, 80] };

export function mapa9() {
  return `<svg viewBox="0 0 600 380" class="mapa-obr" role="img" aria-label="Nábřeží 9. ročníku: hvězdárna, továrna, laboratoř, kino, banka a řeka">
  ${nebe('m9-nebe')}<defs><linearGradient id="m9-voda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="m-voda1"/><stop offset="1" class="m-voda2"/></linearGradient></defs>
  ${mrak(150, 50, .8, -10)}${mrak(330, 30, .65, -24)}
  <path d="M330 220Q440 110 600 120V380H330z" class="m-kopec2"/>
  <!-- hvězdárna na kopci -->
  <g transform="translate(482 148)"><rect x="-30" y="-24" width="60" height="30" class="m-budova"/><path d="M-30-24a30 30 0 0 1 60 0z" class="m9-kopule"/><path d="M-4-52v26h8v-26z" class="m9-sterbina"/>
    <g class="m9-dalekohled"><rect x="-3" y="-66" width="34" height="9" rx="3" class="m-cedule"/></g>${cedule(0, -6, 52, 'HVĚZDÁRNA')}</g>
  <path d="M0 230Q160 180 340 220T600 230V380H0z" class="m-kopec1"/>
  <!-- továrna -->
  <g transform="translate(96 252)"><path d="M-64 0V-44l22 12v-12l22 12v-12l22 12v-12l22 12V0z" class="m9-hala"/><rect x="34" y="-120" width="16" height="120" class="m9-komin"/><rect x="32" y="-124" width="20" height="8" class="m-strecha"/>
    ${[0, 1, 2].map(i => `<circle cx="${42 + i * 6}" cy="${-134 - i * 14}" r="${7 + i * 3}" class="m9-kour" style="--d:${-i * 1.1}s"/>`).join('')}${okna(-56, -26, 4, 1, 12, 9, 22, 0)}${cedule(-12, -8, 58, 'TOVÁRNA')}</g>
  <!-- laboratoř -->
  <g transform="translate(286 262)"><rect x="-56" y="-86" width="112" height="86" class="m-budova2"/><rect x="-56" y="-92" width="112" height="8" class="m-strecha"/>${okna(-46, -74, 5, 3, 12, 12, 20, 22)}
    <g transform="translate(66 -28)"><path d="M-6-30h12M-4-30v12l-12 22q-2 6 4 6h24q6 0 4-6l-12-22v-12" class="m9-banka"/><path d="M-10 0h20l3 6q1 4-3 4h-20q-4 0-3-4z" class="m9-tekutina"/></g>${cedule(0, -108, 76, 'LABORATOŘ')}</g>
  <!-- kino -->
  <g transform="translate(476 290)"><rect x="-62" y="-60" width="124" height="60" class="m-budova"/><rect x="-70" y="-74" width="140" height="18" rx="3" class="m9-markyza"/>
    ${Array.from({ length: 12 }, (_, i) => `<circle cx="${-62 + i * 11.3}" cy="-56" r="2.4" class="m9-zarovka" style="--d:${(i % 3) * .3}s"/>`).join('')}<text x="0" y="-61" class="m-napis">KINO</text>
    <rect x="-16" y="-40" width="32" height="40" class="m-dvere"/><rect x="-54" y="-44" width="26" height="34" class="m9-plakat"/><rect x="28" y="-44" width="26" height="34" class="m9-plakat2"/></g>
  <!-- řeka -->
  <path d="M0 316Q150 296 300 312T600 306V380H0z" fill="url(#m9-voda)"/>
  <g class="m9-vlnky">${Array.from({ length: 9 }, (_, i) => `<path d="M${20 + i * 66} ${338 + (i % 3) * 12}q8-5 16 0t16 0" class="m9-vlnka"/>`).join('')}</g>
  <g class="m9-lod"><g transform="translate(300 330)"><path d="M-22 0h44l-8 10h-28z" class="m-pult"/><path d="M0 0v-30l18 26H0" class="m9-plachta"/><path d="M0-30l-12 26h12" class="m9-plachta2"/></g></g>
  <!-- banka u nábřeží -->
  <g transform="translate(116 300)"><path d="M-58-58L0-84l58 26z" class="m9-stit"/><rect x="-56" y="-58" width="112" height="6" class="m-budova2"/>${[-42, -21, 0, 21, 42].map(x => `<rect x="${x - 5}" y="-52" width="10" height="46" class="m-budova"/>`).join('')}<rect x="-60" y="-6" width="120" height="8" class="m-budova2"/>
    <circle cx="0" cy="-68" r="6" class="m9-mince"/>${cedule(0, -40, 40, 'BANKA')}</g>
  <path d="M0 304h214" class="m9-zabradli"/><path d="M380 300h220" class="m9-zabradli"/>
  ${lampa(230)}${lampa(372)}${strom(206, 300, .8)}${strom(580, 300, .9)}${strom(390, 296, .75)}
</svg>`;
}
