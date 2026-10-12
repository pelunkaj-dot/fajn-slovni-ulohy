// Vypíše po jedné ukázce z každého generátoru (ke kontrole textů a výpočtů).
// Použití: node tools/vzorky.mjs [ročník] [téma]
import { ROCNIKY } from '../js/obsah.js';
import { odpoved } from '../js/ulohy.js';
import { setRng, mulberry } from '../js/util.js';
const [, , roc, tem] = process.argv;
setRng(mulberry(Number(process.env.SEED || 7)));
const holy = s => String(s ?? '').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '');
for (const r of ROCNIKY) { if (roc && String(r.rocnik) !== roc) continue;
  for (const t of r.temata) { if (tem && t.id !== tem) continue;
    console.log(`\n=== ${t.id} ${t.nazev}`);
    t.u.forEach((gens, li) => gens.forEach((g, gi) => {
      const u = g(); let o = odpoved(u);
      if (u.kind === 'choice') o += '  ✗ ' + u.opts.filter((_, i) => i !== u.ans).join(' / ');
      console.log(`[${li + 1}.${gi + 1} ${u.kind}${u.fig ? ' +obr' : ''}${u.units ? ' +jedn' : ''}] ${holy(u.text)} ${holy(u.q)}\n      = ${o}${process.env.KROKY ? '\n      · ' + (u.steps || []).map(holy).join(' · ') : ''}${process.env.NAP ? '\n      ? ' + (u.hints || []).map(holy).join(' | ') : ''}`);
    }));
  } }
