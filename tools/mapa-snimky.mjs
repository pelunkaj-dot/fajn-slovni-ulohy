// Snímky výpravy ve třech denních dobách: node tools/mapa-snimky.mjs <složka> [šířka]
import { otevri, URL } from '../tests/hrac.mjs';
const [, , slozka, sir] = process.argv;
const { b, p, chyby } = await otevri({ w: +(sir || 400), h: 860 });
await p.goto(URL + 'index.html'); await p.waitForTimeout(400); await p.click('.okno-akce .hl');
for (const m of ['light', 'dark', 'girl']) {
  await p.evaluate(m => { const s = window.__fg.stav; s.motiv = m; document.documentElement.dataset.theme = m; window.__fg.kresli(); }, m);
  await p.waitForTimeout(700); await p.screenshot({ path: `${slozka}/mapa-${m}-${sir || 400}.png` }); await p.screenshot({ path: `${slozka}/cela-${m}-${sir || 400}.png`, fullPage: true });
}
console.log(chyby.length ? chyby.join('\n') : 'Bez chyb.'); await b.close();
