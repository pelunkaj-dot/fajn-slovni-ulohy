// Mapa ročníku na výpravě: ilustrovaná čtvrť, kde každé téma je místo (tržnice, nádraží, stavba, akvárium, tábor na kopci).
// Barvy podle denní doby (motiv): světlý = den, tmavý = noc, růžový = západ slunce (css/vzhled.css, proměnné --m-*).
// Místa jsou tlačítka nad obrázkem (MISTA: poloha v % šířky a výšky).

import { okna, strom, lampa, mrak } from './mapapom.js';
import { MISTA7, mapa7 } from './mapa7.js';
import { MISTA8, mapa8 } from './mapa8.js';
import { MISTA9, mapa9 } from './mapa9.js';

export const MISTA = { trh: [22, 80], nadrazi: [21, 41], plan: [51, 21], akvarium: [84, 58], expedice: [86, 33], ...MISTA7, ...MISTA8, ...MISTA9 };

export function mapaSvg(rocnik = 6) {
  if (rocnik === 7) return mapa7();
  if (rocnik === 8) return mapa8();
  if (rocnik === 9) return mapa9();
  const hvezdy = Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 97) % 600}" cy="${(i * 53) % 150 + 6}" r="${i % 3 ? 1 : 1.6}" class="m-hvezda" style="--d:${(i % 5) * 0.6}s"/>`).join('');
  const prazce = Array.from({ length: 61 }, (_, i) => `<rect x="${i * 10}" y="301" width="5" height="7" class="m-prazec"/>`).join('');
  return `<svg viewBox="0 0 600 380" class="mapa-obr" role="img" aria-label="Čtvrť 6. ročníku: tržnice, nádraží, stavba, akvárium a tábor na kopci">
  <defs>
    <linearGradient id="m-nebe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="m-nebe1"/><stop offset=".6" class="m-nebe2"/><stop offset="1" class="m-nebe3"/></linearGradient>
    <linearGradient id="m-voda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="m-voda1"/><stop offset="1" class="m-voda2"/></linearGradient>
    <clipPath id="m-kopule"><path d="M436 292a74 72 0 0 1 148 0z"/></clipPath>
  </defs>
  <rect width="600" height="380" fill="url(#m-nebe)"/>
  <g class="m-hvezdy">${hvezdy}</g>
  <g class="m-slunce"><circle cx="470" cy="62" r="30" class="m-slunce-k"/><circle cx="470" cy="62" r="48" class="m-slunce-z"/><circle cx="460" cy="55" r="5" class="m-krater"/><circle cx="478" cy="72" r="3.5" class="m-krater"/></g>
  ${mrak(80, 60, 1, 0)}${mrak(300, 40, .8, -14)}${mrak(520, 120, .7, -28)}
  <path d="M0 232Q90 186 190 214T380 196T600 206V380H0z" class="m-kopec2"/>
  <path d="M330 266Q450 120 600 158V380H330z" class="m-kopec1"/>
  <path d="M0 262Q80 236 170 250T330 252V380H0z" class="m-kopec1"/>
  <!-- tábor na kopci (Expedice) -->
  <path d="M410 262C440 240 470 222 492 214S514 198 516 190" class="m-stezka"/>
  <g transform="translate(516 186)"><path d="M-20 0L0-30L20 0z" class="m-stan"/><path d="M0 0L0-30L7 0z" class="m-stan2"/><path d="M-4 0L0-9L4 0z" class="m-stin"/>
    <rect x="30" y="-48" width="2.2" height="48" class="m-kmen"/><path d="M32 -48q9 3 16 0t0 12q-8 3-16 0z" class="m-vlajka"/></g>
  ${strom(372, 250, .9)}${strom(560, 176, .8)}
  <!-- stavba s jeřábem (Stavební plán) -->
  <g class="m-stavba">
    <rect x="250" y="190" width="84" height="102" class="m-hruba"/>
    ${[250, 278, 306, 330].map(x => `<rect x="${x}" y="190" width="4" height="102" class="m-tram"/>`).join('')}${[190, 215, 240, 265].map(y => `<rect x="250" y="${y}" width="84" height="4" class="m-tram"/>`).join('')}
    <rect x="300" y="96" width="9" height="196" class="m-jerab"/>${Array.from({ length: 13 }, (_, i) => `<path d="M300 ${100 + i * 15}l9 15" class="m-jerab-l"/>`).join('')}
    <rect x="236" y="92" width="150" height="7" class="m-jerab"/><rect x="238" y="99" width="22" height="13" class="m-tram"/><path d="M304 92l0-14l-60 14M304 78l78 14" class="m-jerab-l"/>
    <g class="m-kocka"><rect x="346" y="99" width="10" height="5" class="m-tram"/><line x1="351" y1="104" x2="351" y2="150" class="m-lano"/><rect x="341" y="150" width="20" height="12" class="m-naklad"/></g>
  </g>
  <!-- nádraží -->
  <g class="m-nadrazi">
    <rect x="34" y="214" width="176" height="80" class="m-budova"/><path d="M26 216L122 180L218 216z" class="m-strecha"/>
    <rect x="102" y="150" width="40" height="66" class="m-budova2"/><path d="M96 152L122 128L148 152z" class="m-strecha"/>
    <circle cx="122" cy="174" r="12" class="m-hodiny"/><path d="M122 174V166M122 174l6 3" class="m-ruc"/>
    ${[46, 76, 150, 180].map(x => `<path d="M${x} 280v-34a10 10 0 0 1 20 0v34z" class="m-okno" style="--d:${x % 3}s"/>`).join('')}
    <rect x="108" y="250" width="28" height="44" rx="2" class="m-dvere"/>
    <rect x="70" y="222" width="104" height="14" rx="3" class="m-cedule"/><text x="122" y="233" class="m-napis">NÁDRAŽÍ</text>
  </g>
  <!-- akvárium -->
  <g class="m-akvarium">
    <rect x="426" y="290" width="168" height="18" rx="3" class="m-budova2"/>
    <path d="M436 292a74 72 0 0 1 148 0z" class="m-sklo"/>
    <g clip-path="url(#m-kopule)"><rect x="430" y="246" width="160" height="50" fill="url(#m-voda)"/>
      <path d="M436 248q12-5 24 0t24 0 24 0 24 0 24 0 24 0" class="m-hladina"/>
      <g class="m-ryba"><path d="M0 0c7-7 18-7 23 0-5 7-16 7-23 0zM0 0l-8-6v12z" transform="translate(470 270)" class="m-ryba1"/></g>
      <g class="m-ryba m-ryba-b"><path d="M0 0c6-6 15-6 19 0-4 6-13 6-19 0zM0 0l-7-5v10z" transform="translate(530 282)" class="m-ryba2"/></g>
      <path d="M452 296c-4-12 4-18 0-30M560 296c4-10-3-16 1-26" class="m-rasa"/></g>
    <path d="M454 268a56 54 0 0 1 30-40" class="m-odlesk"/>
    <rect x="474" y="296" width="72" height="10" rx="2" class="m-cedule"/><text x="510" y="304" class="m-napis m-napis-m">AKVÁRIUM</text>
  </g>
  <!-- trať a vlak -->
  <rect x="0" y="298" width="600" height="3" class="m-kolej"/>${prazce}<rect x="0" y="306" width="600" height="3" class="m-kolej"/>
  <g class="m-vlak"><g transform="translate(0 270)">
    <rect x="0" y="6" width="58" height="24" rx="6" class="m-vagon"/><rect x="64" y="6" width="58" height="24" rx="6" class="m-vagon"/>
    <path d="M128 30V10q0-6 6-6h22q14 0 18 14v12z" class="m-loko"/>${[6, 22, 38, 70, 86, 102].map(x => `<rect x="${x}" y="11" width="11" height="9" rx="2" class="m-okno-v"/>`).join('')}<rect x="146" y="9" width="14" height="10" rx="2" class="m-okno-v"/>
    ${[10, 46, 74, 110, 138, 162].map(x => `<circle cx="${x}" cy="31" r="4" class="m-kolo"/>`).join('')}</g></g>
  <!-- tržnice -->
  <rect x="0" y="309" width="600" height="71" class="m-zeme"/>
  <g class="m-trh">
    <rect x="58" y="320" width="4" height="40" class="m-kmen"/><rect x="226" y="320" width="4" height="40" class="m-kmen"/>
    <path d="M50 300h188v18H50z" class="m-markyza-b"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${50 + i * 23.5}" y="300" width="11.75" height="18" class="m-markyza"/>`).join('')}
    <path d="M50 318${Array.from({ length: 8 }, () => 'a11.75 8 0 0 0 23.5 0').join('')}" class="m-markyza"/>
    <rect x="62" y="340" width="164" height="22" rx="2" class="m-pult"/>
    ${[[78, 'm-ovoce1'], [96, 'm-ovoce2'], [114, 'm-ovoce1'], [150, 'm-ovoce3'], [168, 'm-ovoce2'], [190, 'm-ovoce3'], [208, 'm-ovoce1']].map(([x, c]) => `<circle cx="${x}" cy="336" r="7" class="${c}"/>`).join('')}
    <rect x="118" y="286" width="52" height="13" rx="3" class="m-cedule"/><text x="144" y="296" class="m-napis m-napis-m">TRŽNICE</text>
  </g>
  ${lampa(268)}${lampa(410)}${strom(16, 352, .9)}${strom(330, 360, 1.1)}${strom(584, 356, .8)}
</svg>`;
}
