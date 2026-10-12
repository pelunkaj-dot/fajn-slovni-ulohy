// Automatický hráč pro testy v prohlížeči: umí správně vyřešit každý druh úlohy přes skutečné rozhraní.
import { createRequire } from 'module';
const require = createRequire(process.env.PW || '/opt/npm-tools/node_modules/');
const { chromium } = require('playwright');
export const URL = process.env.URL || 'http://127.0.0.1:8765/';

export async function otevri(o = {}) {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  const p = await b.newPage({ viewport: { width: o.w || 420, height: o.h || 860 } });
  await p.route('**/fdc-plugin/fdc-guard.js', r => r.fulfill({ contentType: 'text/javascript', body: '' })); // jako s platným přístupem z fajndoucko.cz
  const chyby = []; p.on('console', m => { if (m.type() === 'error') chyby.push(m.text()); }); p.on('pageerror', e => chyby.push('PAGEERROR ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 4).join('\n')));
  const ok = (c, m) => { if (!c) { chyby.push('SELHALO: ' + m); console.log('  ✗ ' + m); } };
  const shot = async (n, plna) => { if (o.shots) await p.screenshot({ path: `${o.shots}/${n}.png`, fullPage: !!plna }); };
  const U = () => p.evaluate(() => { const t = window.__fgUloha && window.__fgUloha(); return t ? { u: JSON.parse(JSON.stringify(t.u)), lvl: t.lvl, hotovo: t.hotovo, strict: t.strict } : null; });
  async function odpovez(t, spravne = true) {
  const u = t.u;
  if (u.kind === 'num') {
    if (t.strict && u.units) await p.click(`.jednotky .chip[data-j="${u.unit}"]`);
    await p.fill('#u-in', String(spravne ? u.ans : u.ans + 7).replace('.', ',')); await p.click('#u-ok');
  } else if (u.kind === 'dm') { const v = spravne ? u.ans : u.ans + 61; await p.fill('#u-in', String(Math.floor(v / 60))); await p.fill('#u-in2', String(v % 60)); await p.click('#u-ok'); }
  else if (u.kind === 'choice') { if (spravne) await p.click(`#u-odp .volba[data-i="${u.ans}"]`); else await p.locator(`#u-odp .volba:not([disabled]):not([data-i="${u.ans}"])`).first().click(); } // špatně: pokaždé jiná dosud nezkoušená možnost
}
  async function serie(popis, o = {}) {
  let n = 0;
  for (;;) {
    if (await p.$('.vysl')) break;
    const t = await U(); if (!t) break;
    if (!t.hotovo) { try { await odpovez(t); } catch (e) { chyby.push(`${popis} úloha ${n + 1} (${t.u.kind}): ${e.message.split('\n')[0]}\n   ${String(t.u.text).replace(/<[^>]+>/g, '').slice(0, 90)}`); break; } }
    const t2 = await U(); ok(t2 && t2.hotovo, `${popis}: úloha ${n + 1} (${t.u.kind}) není po správné odpovědi hotová: ${(await p.textContent('#u-zv').catch(() => '')) || ''}`);
    if (!t2 || !t2.hotovo) break;
    if (o.snimek && n === o.snimek[0]) await shot(o.snimek[1]);
    n++; await p.click('#u-dal');
  }
  return n;
}
  const domu = async () => { const z = p.locator('.vysl-akce button', { hasText: /Zpět/ }); if (await z.count()) await z.first().click(); };
  const vyklad = async () => { while (await p.$('.okno-pozadi')) { await p.click('.okno-akce .hl'); await p.waitForTimeout(30); } };

  return { b, p, chyby, ok, shot, U, odpovez, serie, domu, vyklad };
}
