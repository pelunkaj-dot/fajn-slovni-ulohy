// Krátké hlášky bez postav (modul je pro starší žáky). Svět tématu (js/svety.js) přidává své vlastní.
// Hráči se tyká a věty jsou bez tvarů závislých na rodu. Texty se neopakují, dokud se nevyčerpá celá skupina.
import { svet } from './svety.js';

export const HLASKY = {
  ok: ['Správně.', 'Sedí.', 'Přesně tak.', 'Čistá práce.', 'Bez chyby.', 'Trefa.', 'Jede to.', 'Tohle je ono.'],
  okPozdeji: ['Napodruhé, ale správně.', 'Teď to sedí.', 'Opravené a správně.', 'Vyplatilo se to přepočítat.'],
  chyba1: ['Tohle nesedí. Zkus to znovu.', 'Ještě ne. Přečti si zadání ještě jednou.', 'Vedle. Zkus to jinak.', 'Skoro, ale ne.'],
  chyba2: ['Tady je nápověda.', 'Mrkni na nápovědu.', 'Nápověda ti ukáže cestu.'],
  odhaleni: ['Projdi si postup.', 'Takhle se to počítá.', 'Příště to půjde.'],
  hv3: ['Tři hvězdy. Bez debaty.', 'Plný počet.', 'Lepší to být nemohlo.'],
  hv2: ['Dvě hvězdy. Třetí je na dosah.', 'Slušné. Ještě kousek.'],
  hv1: ['Jedna hvězda. Jde to i líp.', 'Základ je. Teď trénink.'],
  hv0: ['Tohle nevyšlo. Mrkni na výklad a zkus to znovu.', 'Zkus nejdřív nižší úroveň.'],
  strazceUvod: ['Tři životy, žádné nápovědy.', 'Souboj začíná. Soustřeď se.'],
  strazceVyhra: ['Strážce padl. Téma je tvoje.', 'Souboj vyhrán.'],
  strazceProhra: ['Tentokrát vyhrál strážce. Po tréninku se vrať.', 'Strážce odolal. Příště.'],
  obrana: ['Na město padají meteory. Sestřel je správnou odpovědí.', 'Poplach! Rychle a přesně.'],
  mesto: ['Město roste.', 'Další stavba stojí.', 'Tohle městu sluší.'],
  denni: ['Denní výzva splněna. Zítra zase.', 'Hotovo. Řada pokračuje.'],
  opakovani: ['Co dřív zlobilo, teď sedí.', 'Opakování splněno.', 'Staré chyby jsou pryč.'],
};
const pytle = {};
// skupina: ok, chyba1…; s = id světa (jeho hlášky se míchají s obecnými)
export function rekni(skupina, s) {
  const w = svet(s), pole = [...(HLASKY[skupina] || ['']), ...((w && w[skupina]) || []), ...((w && w[skupina]) || [])];
  const k = (s || '') + '/' + skupina;
  if (!pytle[k] || !pytle[k].length) pytle[k] = pole.sort(() => Math.random() - 0.5);
  return pytle[k].pop();
}
