// Společné pomůcky pro obsah ročníků: tvary podle počtu, částky, časy, zlomky, dělitelnost.
import { cz, czf, rd } from './util.js';
// tvar podle počtu: 1 / 2–4 / 5 a víc (jen celá čísla; desetinná čísla mají tvar c)
export const tv = (n, a, b, c) => n === 1 ? a : Number.isInteger(n) && n >= 2 && n <= 4 ? b : c;
export const kc = x => (Number.isInteger(rd(x, 2)) ? cz(x, 0) : czf(x, 2)) + '\u00a0Kč'; // nezlomitelná mezera
export const kc0 = x => Number.isInteger(rd(x, 2)) ? cz(x, 0) : czf(x, 2);
export const hm = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
export const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
export const lcm = (a, b) => a / gcd(a, b) * b;
// zlomek nad sebou (v textu i v možnostech)
export const zl = (a, b) => `<span class="zl"><span>${cz(a)}</span><span>${cz(b)}</span></span>`;
export const zlk = (a, b) => { const g = gcd(a, b); return zl(a / g, b / g); }; // v základním tvaru
export const pc = n => `${cz(n)}\u00a0%`;
// celé číslo se znaménkem (−5, ne -5)
export const zn = n => (n < 0 ? '−' : '') + cz(Math.abs(n));
export const st = n => `${zn(n)}\u00a0°C`;
