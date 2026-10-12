// Stavba úloh a vyhodnocení odpovědí (bez DOM, testovatelné v Node).
import { shuffle, cz, rd, ri, pick, chance, V } from './util.js';

// --- číselná odpověď ---
// ans, unit, dec (počet des. míst, na která se zaokrouhluje; null = přesná hodnota),
// alt (další uznávané výsledky, např. s tlačítkem π), traps [[hodnota, hláška]] = typické chyby
export function N(o) {
  const t = { kind: 'num', unit: '', dec: null, alt: [], traps: [], hints: [], steps: [], ...o };
  const h = t.dec == null ? 1e-6 : 0.5 * 10 ** -t.dec + 1e-9;
  // past, která se v tomhle zadání náhodou rovná správnému výsledku, pastí není
  t.traps = t.traps.filter(([v]) => Number.isFinite(v) && v >= 0 && [t.ans, ...t.alt].every(a => Math.abs(a - v) > h));
  return t;
}
// --- výběr z možností: ok = správná, bad = špatné; keep = neměnit pořadí (opts zadány ručně) ---
export function C(o) {
  const opts = o.opts ? o.opts : shuffle([o.ok, ...o.bad]);
  return { kind: 'choice', hints: [], steps: [], ...o, opts, ans: opts.indexOf(o.ok) };
}
// --- úhel ve stupních a minutách: ans v minutách ---
export function DM(o) { return { kind: 'dm', hints: [], steps: [], ...o }; }
// výsledek s π: hlavní s 3,14, uznává se i s přesným π
export function pia(f, dec = 1) {
  const a = rd(f(3.14), dec), b = rd(f(Math.PI), dec);
  return { ans: a, alt: a === b ? [] : [b], dec };
}
export const PI_T = '(π ≐ 3,14)';

// Text správné odpovědi pro zobrazení
export function odpoved(t) {
  if (t.kind === 'num') return cz(t.ans, t.dec ?? 3) + (t.unit ? (t.unit === '°' || t.unit === '′' ? '' : ' ') + t.unit : '');
  if (t.kind === 'choice') return t.opts[t.ans];
  if (t.kind === 'dm') { const m = t.ans % 60; return `${Math.floor(t.ans / 60)}°${m ? ' ' + m + '′' : ''}`; }
  return '';
}

// Vyhodnocení. strict = nejtěžší úroveň (přesné zaokrouhlení, kontrola jednotky).
export function check(t, inp, strict = false) {
  if (t.kind === 'choice') return { ok: inp.i === t.ans, msg: '' };
  if (t.kind === 'dm') {
    if (inp.min >= 60) return { ok: false, msg: 'Minut musí být méně než 60. Každých 60′ převeď na 1°.' };
    const x = inp.deg * 60 + inp.min, tr = (t.traps || []).find(([v]) => v === x);
    return { ok: x === t.ans, msg: tr ? tr[1] : '' };
  }
  if (t.kind === 'num') {
    const x = inp.val, acc = [t.ans, ...t.alt], h = t.dec == null ? 1e-6 : 0.5 * 10 ** -t.dec + 1e-9;
    const exact = acc.some(a => Math.abs(x - a) < 1e-9), loose = acc.some(a => Math.abs(x - a) <= h);
    let ok = strict ? exact : loose, msg = '';
    if (!ok && strict && loose) msg = `Jsi blízko, ale výsledek není přesně zaokrouhlený na ${t.dec === 0 ? 'celé číslo' : t.dec + (t.dec === 1 ? ' desetinné místo' : ' desetinná místa')}.`;
    if (!ok && !msg) { const tr = t.traps.find(([v]) => Math.abs(x - v) <= h); if (tr) msg = tr[1]; }
    if (strict && t.units && inp.unit !== t.unit) {
      msg = ok ? 'Číslo je správně, ale jednotka ne.' : (msg || '');
      ok = false;
    }
    return { ok, msg };
  }
  return { ok: false, msg: '' };
}

// Převod na rychlou úlohu se čtyřmi možnostmi (obrana města)
export function toChoice(t) {
  if (t.kind === 'choice') return t.opts.length <= 4 ? t : null;
  if (t.kind !== 'num') return null;
  const d = t.dec ?? 2, u = t.unit ? ' ' + t.unit : '', spr = cz(t.ans, d), set = new Set([spr]), bad = [];
  const kand = [...shuffle(t.traps.map(x => x[0])), ...shuffle([t.ans + 1, t.ans - 1, t.ans * 2, t.ans / 2, t.ans + 10, t.ans - 2, t.ans + 2, t.ans * 10])];
  for (const k of kand) {
    if (!(k > 0)) continue;
    const s = cz(k, d); if (set.has(s)) continue;
    set.add(s); bad.push(s + u); if (bad.length === 3) break;
  }
  if (bad.length < 3) return null;
  return C({ text: t.text, q: t.q, ok: spr + u, bad, steps: t.steps });
}

export { V };
