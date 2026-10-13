// Snímky světů ke kontrole vzhledu: node tools/svety-snimky.mjs <složka> [téma …] (server na 8765)
import { otevri, URL } from '../tests/hrac.mjs';
const [, , slozka, ...temata] = process.argv;
const { b, p, chyby, U, odpovez, vyklad } = await otevri({ shots: slozka, w: 400, h: 860 });
await p.goto(URL + 'index.html'); await p.waitForTimeout(500); await p.screenshot({ path: `${slozka}/00-uvitani.png` });
await p.click('.okno-akce .hl');
const ids = temata.length ? temata : await p.$$eval('.tema', x => x.map(e => e.dataset.id));
await p.screenshot({ path: `${slozka}/01-vyprava.png`, fullPage: true });
for (const id of ids) {
  await p.evaluate(r => { window.__fg.stav.rocnik = r; window.__fg.stav.vyklad = {}; window.__fg.kresli(); }, +id[0]);
  for (const l of [1, 2, 3]) {
    await p.click(`.tema[data-id="${id}"] [data-l="${l}"]`);
    if (l === 1) { await p.waitForTimeout(400); await p.screenshot({ path: `${slozka}/${id}-vyklad.png` }); }
    await vyklad();
    if (l === 1) { await p.waitForTimeout(450); await p.screenshot({ path: `${slozka}/${id}-uvod.png` }); }
    await p.waitForTimeout(1500);
    const t = await U(); await p.screenshot({ path: `${slozka}/${id}-${l}a.png` });
    await odpovez(t, false); if (!(await U()).hotovo) await odpovez(t, false); await p.waitForTimeout(300); await p.screenshot({ path: `${slozka}/${id}-${l}b-chyba.png`, fullPage: true });
    if (!(await U()).hotovo) await odpovez(t); await p.waitForTimeout(250); await p.screenshot({ path: `${slozka}/${id}-${l}c-ok.png`, fullPage: true });
    await p.click('#h-zpet'); const u = p.locator('.okno-akce button', { hasText: 'Ukončit' }); if (await u.count()) await u.click();
  }
}
console.log(chyby.length ? chyby.join('\n') : 'Bez chyb.'); await b.close();
