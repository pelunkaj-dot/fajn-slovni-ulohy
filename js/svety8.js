// Světy 8. ročníku (barvy a ozdoby v css/svety8.css).
import { f, scZastavky, scDilky, znak } from './svetypom.js';

// filmový pás: políčka se postupně vyvolávají
const scFilm = (p, n) => { const hot = Math.round(p * n), w = 280 / n;
  return `<rect x="8" y="6" width="284" height="32" rx="3" class="sc-o"/>${Array.from({ length: 28 }, (_, k) => `<rect x="${11 + k * 10.2}" y="8" width="5" height="3" class="sc-f"/><rect x="${11 + k * 10.2}" y="33" width="5" height="3" class="sc-f"/>`).join('')}
    ${Array.from({ length: n }, (_, k) => `<rect x="${f(10 + k * w + 1)}" y="13" width="${f(w - 3)}" height="18" rx="1" class="${k < hot ? 'sc-f' : 'sc-v'}"/>`).join('')}`; };
// žebřík: příčky se postupně zdolávají
const scZebrik = (p, n) => { const hot = Math.round(p * n);
  return `<line x1="10" y1="12" x2="290" y2="12" class="sc-l"/><line x1="10" y1="34" x2="290" y2="34" class="sc-l"/>${Array.from({ length: n }, (_, k) => `<line x1="${f(20 + k * 260 / Math.max(n - 1, 1))}" y1="12" x2="${f(20 + k * 260 / Math.max(n - 1, 1))}" y2="34" class="${k < hot ? 'sc-l' : 'sc-t'}" style="stroke-width:${k < hot ? 4 : 2}"/>`).join('')}`; };

export const ZNAKY8 = {
  detektiv: znak('<circle cx="26" cy="26" r="16" class="z-p"/><circle cx="26" cy="26" r="11" class="z-k"/><path d="M38 38l16 16" class="z-l" style="stroke-width:7"/><path d="M20 22q6-6 12 0" class="z-l"/>'),
  album: znak('<rect x="6" y="18" width="52" height="36" rx="5" class="z-d"/><rect x="20" y="10" width="16" height="10" rx="2" class="z-d"/><circle cx="32" cy="36" r="12" class="z-p"/><circle cx="32" cy="36" r="6" class="z-k"/><circle cx="49" cy="25" r="2.5" class="z-p"/>'),
  dilna: znak('<rect x="6" y="38" width="52" height="10" rx="2" class="z-k"/><path d="M14 38l20-28 6 4-20 28z" class="z-d"/><path d="M36 10l10 7" class="z-l"/><path d="M10 52h44" class="z-l"/>' + Array.from({ length: 6 }, (_, k) => `<path d="M${10 + k * 8} 38v4" class="z-l"/>`).join('')),
  zavod: znak('<path d="M8 50V12" class="z-l"/>' + Array.from({ length: 12 }, (_, k) => `<rect x="${10 + (k % 4) * 11}" y="${12 + Math.floor(k / 4) * 9}" width="11" height="9" class="${(k + Math.floor(k / 4)) % 2 ? 'z-p' : 'z-d'}"/>`).join('') + '<path d="M10 39q22 6 44 0" class="z-l"/>'),
  hasici: znak('<path d="M8 40a24 24 0 0 1 48 0z" class="z-d"/><rect x="4" y="40" width="56" height="8" rx="4" class="z-d"/><rect x="26" y="14" width="12" height="20" rx="3" class="z-k"/><path d="M32 18v12" class="z-l"/>'),
  cirkus: znak('<path d="M8 52L32 10l24 42z" class="z-p"/><path d="M32 10L20 52M32 10l12 42M32 10v42" class="z-l"/><path d="M14 42L32 10l-8 42zM40 52L32 10l18 32z" class="z-d"/><path d="M32 10V2l8 3-8 3" class="z-k"/><path d="M8 52h48" class="z-l"/>'),
};

export const SVETY8 = {
  detektiv: { nazev: 'Detektivní kancelář', stitek: 'Případ', scena: scZastavky('<circle r="7" class="sc-o"/><path d="M5 5l7 7" class="sc-car"/>'), nastroj: 'detektiv', razitko: 'Vyřešeno', doklad: 'Spis případu',
    ok: ['Případ uzavřen.', 'Stopa sedí.', 'Elementární.', 'Pachatel je usvědčen.', 'Rovnice nelže.'], chyba1: ['Falešná stopa. Zkus to znovu.', 'Tohle alibi nesedí.', 'Důkazy říkají něco jiného.'],
    chyba2: ['Prohlédni si spis, tedy nápovědu.', 'Tady je stopa.'], odhaleni: ['Takhle se případ vyřeší.', 'Projdi si vyšetřování krok za krokem.'] },
  album: { nazev: 'Rodinné album', stitek: 'Vzpomínka', scena: scFilm, nastroj: 'album', razitko: 'Vyvoláno', doklad: 'Rodokmen',
    ok: ['Fotka sedí.', 'Přesně tak to bylo.', 'Rodina souhlasí.', 'Vzpomínka zapsaná.'], chyba1: ['Na fotce je to jinak. Zkus to znovu.', 'Tolik let to nebylo.', 'Babička by tě opravila.'],
    chyba2: ['Mrkni na nápovědu.', 'Tady je rada z alba.'], odhaleni: ['Takhle se věk spočítá.', 'Projdi si to krok za krokem.'] },
  dilna: { nazev: 'Dílna', stitek: 'Zakázka', scena: scZastavky('<path d="M-12 4h20l4-8h-24z" class="sc-f"/><path d="M-12 4l2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3" class="sc-car"/>'), nastroj: 'dilna', razitko: 'Hotovo', doklad: 'Zakázkový list',
    ok: ['Řez sedí.', 'Dvakrát měř, jednou řež.', 'Přesně na míru.', 'Mistr spokojen.'], chyba1: ['Tohle by se nevešlo. Zkus to znovu.', 'Řez je vedle.', 'Přeměř to.'],
    chyba2: ['Mrkni na nápovědu.', 'Tady je rada od mistra.'], odhaleni: ['Takhle se to spočítá.', 'Projdi si postup.'] },
  zavod: { nazev: 'Závodní okruh', stitek: 'Časomíra', scena: scZastavky('<rect x="-12" y="-4" width="22" height="8" rx="3" class="sc-f"/><path d="M-4-4l3-5h6l3 5" class="sc-f"/><circle cx="-7" cy="5" r="3.5" class="sc-o"/><circle cx="6" cy="5" r="3.5" class="sc-o"/>'), nastroj: 'zavod', razitko: 'Cíl', doklad: 'Časomíra',
    ok: ['Nejrychlejší kolo.', 'Projeto cílem.', 'Časomíra souhlasí.', 'Na stupních vítězů.'], chyba1: ['Smyk! Zkus to znovu.', 'Mimo trať.', 'Časomíra ukazuje jinak.'],
    chyba2: ['Zastav v boxech a mrkni na nápovědu.', 'Tady je rada z boxů.'], odhaleni: ['Takhle se to počítá: dráha = rychlost · čas.', 'Projdi si postup.'] },
  hasici: { nazev: 'Hasičská stanice', stitek: 'Výjezd', scena: scZebrik, nastroj: 'hasici', razitko: 'Uhašeno', doklad: 'Hlášení zásahu',
    ok: ['Žebřík dosáhne.', 'Zásah úspěšný.', 'Přesně změřeno.', 'Výjezd zvládnutý.'], chyba1: ['Žebřík nedosáhne. Zkus to znovu.', 'Tohle nesedí.', 'Přepočítej to, jde o čas.'],
    chyba2: ['Mrkni na nápovědu.', 'Velitel radí: tady je nápověda.'], odhaleni: ['Takhle se to spočítá Pythagorovou větou.', 'Projdi si postup.'] },
  cirkus: { nazev: 'Cirkus', stitek: 'Číslo večera', scena: scDilky('circle'), nastroj: 'cirkus', razitko: 'Bravo', doklad: 'Program večera',
    ok: ['Bravo!', 'Potlesk!', 'Číslo se povedlo.', 'Manéž je tvoje.'], chyba1: ['Spadl kužel. Zkus to znovu.', 'Tohle číslo nevyšlo.', 'Zkus to ještě jednou.'],
    chyba2: ['Mrkni na nápovědu.', 'Tady je rada od principála.'], odhaleni: ['Takhle se to spočítá (π ≐ 3,14).', 'Projdi si postup.'] },
};

export const KULISY8 = {
  detektiv: () => `<svg class="k-svg k-horni" viewBox="0 0 400 130" preserveAspectRatio="xMidYMin meet"><rect x="10" y="4" width="380" height="120" rx="6" class="k-korek"/>
      ${[[40, 20, -6], [150, 30, 4], [270, 16, -3], [320, 70, 7], [90, 75, 3]].map(([x, y, r]) => `<g transform="rotate(${r} ${x + 30} ${y + 18})"><rect x="${x}" y="${y}" width="60" height="38" class="k-papir"/><circle cx="${x + 30}" cy="${y + 4}" r="4" class="k-spendlik"/></g>`).join('')}
      <path d="M70 24L180 34L300 20L350 74L120 79Z" class="k-nit"/></svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 90" preserveAspectRatio="xMaxYMax meet"><path d="M330 90l20-60h30l20 60z" class="k-svetlo"/><rect x="345" y="20" width="40" height="14" rx="6" class="k-lampa"/></svg>`,
  album: () => `<svg class="k-svg k-cela" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice">
      ${[[20, 80, -12], [300, 140, 9], [40, 520, 8], [290, 560, -7], [160, 640, 3]].map(([x, y, r]) => `<g transform="rotate(${r} ${x + 40} ${y + 45})"><rect x="${x}" y="${y}" width="80" height="94" class="k-polaroid"/><rect x="${x + 7}" y="${y + 7}" width="66" height="62" class="k-foto"/></g>`).join('')}</svg>`,
  dilna: () => `<svg class="k-svg k-horni" viewBox="0 0 400 110" preserveAspectRatio="xMidYMin meet">
      <g class="k-houpe"><rect x="60" y="20" width="10" height="60" rx="3" class="k-drevo"/><rect x="44" y="12" width="42" height="16" rx="3" class="k-kov"/></g>
      <g class="k-houpe" style="--d:-1.5s"><path d="M180 18h80l-6 16h-74z" class="k-kov"/><path d="M180 34l3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5 3 5 3-5" class="k-zuby"/><rect x="258" y="12" width="28" height="22" rx="6" class="k-drevo"/></g>
      <g class="k-houpe" style="--d:-3s"><rect x="320" y="14" width="8" height="70" rx="2" class="k-kov"/><path d="M312 14h24v10h-24z" class="k-drevo"/></g></svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 70" preserveAspectRatio="none"><rect y="30" width="400" height="40" class="k-stul"/><path d="M0 30h400" class="k-hrana-d"/>${Array.from({ length: 14 }, (_, i) => `<circle cx="${20 + i * 28}" cy="${50 + (i % 3) * 5}" r="${1.5 + i % 2}" class="k-piliny"/>`).join('')}</svg>`,
  zavod: () => `<svg class="k-svg k-dolni" viewBox="0 0 400 120" preserveAspectRatio="none"><rect y="30" width="400" height="90" class="k-asfalt"/>${Array.from({ length: 20 }, (_, i) => `<rect x="${i * 20}" y="30" width="20" height="10" class="${i % 2 ? 'k-obrubnik-b' : 'k-obrubnik-c'}"/>`).join('')}
      <g class="k-auto"><rect x="0" y="66" width="70" height="20" rx="8" class="k-formule"/><rect x="18" y="56" width="22" height="12" rx="5" class="k-formule"/><circle cx="14" cy="88" r="9" class="k-pneu"/><circle cx="58" cy="88" r="9" class="k-pneu"/></g></svg>
    <svg class="k-svg k-horni" viewBox="0 0 400 40" preserveAspectRatio="none">${Array.from({ length: 40 }, (_, i) => `<rect x="${(i % 20) * 20}" y="${Math.floor(i / 20) * 10}" width="10" height="10" class="k-sachy"/><rect x="${(i % 20) * 20 + 10}" y="${Math.floor(i / 20) * 10 + 10}" width="10" height="10" class="k-sachy"/>`).join('')}</svg>`,
  hasici: () => `<svg class="k-svg k-horni" viewBox="0 0 400 60" preserveAspectRatio="xMaxYMin meet"><rect x="340" y="6" width="44" height="18" rx="9" class="k-majak"/><rect x="340" y="6" width="22" height="18" rx="9" class="k-majak2"/></svg>
    <svg class="k-svg k-levy" viewBox="0 0 60 400" preserveAspectRatio="xMinYMid meet"><path d="M10 400L40 0M40 400L70 0" class="k-zebr"/>${Array.from({ length: 13 }, (_, i) => `<path d="M${12 + i * 2.2} ${380 - i * 30}h30" class="k-zebr"/>`).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 80" preserveAspectRatio="xMidYMax meet"><path d="M260 80V40q0-10 10-10h90q30 0 40 30v20z" class="k-auto-h"/><rect x="270" y="38" width="30" height="18" rx="3" class="k-okno-h"/><circle cx="290" cy="80" r="11" class="k-pneu"/><circle cx="370" cy="80" r="11" class="k-pneu"/></svg>`,
  cirkus: () => `<svg class="k-svg k-horni" viewBox="0 0 400 70" preserveAspectRatio="none">${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 40} 0h40v26a20 14 0 0 1-40 0z" class="${i % 2 ? 'k-a' : 'k-b'}"/>`).join('')}</svg>
    <svg class="k-svg k-cela" viewBox="0 0 400 700" preserveAspectRatio="xMidYMid slice"><path d="M80 0L-40 700h240z" class="k-kuzel"/><path d="M320 0L200 700h240z" class="k-kuzel" style="animation-delay:-3s"/>
      ${Array.from({ length: 14 }, (_, i) => `<path d="M${(i * 71) % 400} ${(i * 113) % 640 + 30}l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" class="k-hvezdicka" style="--d:${(i % 5) * .5}s"/>`).join('')}</svg>
    <svg class="k-svg k-dolni" viewBox="0 0 400 80" preserveAspectRatio="xMidYMax meet"><ellipse cx="200" cy="80" rx="190" ry="34" class="k-manez"/><ellipse cx="200" cy="80" rx="160" ry="24" class="k-pisek"/></svg>`,
};
