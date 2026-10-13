// Obrázky k úlohám: v měřítku, barvy z proměnných světa (css/svety.css). Popisky jsou hotové texty (např. „12 m“ nebo „?“).
import { cz } from './util.js';
const t = (x, y, s, q, anchor = 'middle') => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" class="${q ? 'ob-q' : 'ob-t'}">${s}</text>`;
const jeQ = s => String(s).includes('?');

// obdélník a × b; la, lb = popisky stran (dolní, pravá)
export function obdelnik(a, b, la, lb, o = {}) {
  const W = 300, H = 190, k = Math.min((W - 90) / a, (H - 60) / b), w = a * k, h = b * k, x = (W - w) / 2 - 10, y = (H - h) / 2 - 6;
  const vnitrek = o.dlazdice ? Array.from({ length: Math.round(a) - 1 }, (_, i) => `<line x1="${x + (i + 1) * k}" y1="${y}" x2="${x + (i + 1) * k}" y2="${y + h}" class="ob-h"/>`).join('') + Array.from({ length: Math.round(b) - 1 }, (_, i) => `<line x1="${x}" y1="${y + (i + 1) * k}" x2="${x + w}" y2="${y + (i + 1) * k}" class="ob-h"/>`).join('') : '';
  const okno = o.okno ? `<rect x="${x + w * 0.55}" y="${y + h * 0.18}" width="${o.okno[0] * k}" height="${o.okno[1] * k}" class="ob-z"/>${t(x + w * 0.55 + o.okno[0] * k / 2, y + h * 0.18 + o.okno[1] * k / 2 + 5, o.oknoT || '')}` : '';
  const plot = o.plot ? `<rect x="${x - 6}" y="${y - 6}" width="${w + 12}" height="${h + 12}" class="ob-k" stroke-dasharray="2 5"/>` : '';
  return `<svg viewBox="0 0 ${W} ${H}" class="ob" role="img" aria-label="obdélník">${plot}<rect x="${x}" y="${y}" width="${w}" height="${h}" class="ob-s"/>${vnitrek}${okno}
    ${la ? t(x + w / 2, y + h + 24, la, jeQ(la)) : ''}${lb ? t(x + w + 10, y + h / 2 + 5, lb, jeQ(lb), 'start') : ''}${o.uvnitr ? t(x + w / 2, y + h / 2 + 6, o.uvnitr, jeQ(o.uvnitr)) : ''}</svg>`;
}
// útvar ve tvaru L: celý obdélník a × b, z pravého horního rohu vyříznutý c × d
export function lTvar(a, b, c, d, pop) {
  const W = 300, H = 200, k = Math.min((W - 90) / a, (H - 60) / b), x = (W - a * k) / 2 - 10, y = (H - b * k) / 2 - 6, X = v => x + v * k, Y = v => y + v * k;
  const body = [[0, 0], [a - c, 0], [a - c, d], [a, d], [a, b], [0, b]].map(([u, v]) => `${X(u).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 ${W} ${H}" class="ob" role="img" aria-label="útvar ve tvaru L"><polygon points="${body}" class="ob-s"/><line x1="${X(a - c)}" y1="${Y(d)}" x2="${X(0)}" y2="${Y(d)}" class="ob-h"/>
    ${t(X(a / 2), Y(b) + 24, pop.a)}${t(X(0) - 8, Y(b / 2) + 5, pop.b, false, 'end')}${t(X(a - c / 2), Y(d) - 8, pop.c)}${t(X(a) + 8, Y(d / 2) + 5, pop.d, false, 'start')}</svg>`;
}
// kvádr a × b × c (délka, hloubka, výška) ve volném rovnoběžném promítání; hladina = výška vody (nepovinné)
export function kvadr(a, b, c, pop, o = {}) {
  const W = 300, H = 210, hl = 0.5 * Math.SQRT1_2, k = Math.min((W - 150) / (a + b * hl), (H - 60) / (c + b * hl)), dx = b * hl * k, dy = b * hl * k;
  const x = (W - a * k - dx) / 2 + 8, y = H - 34, A = [x, y], B = [x + a * k, y], C = [x + a * k, y - c * k], D = [x, y - c * k], s = (P, q = 0) => [P[0] + dx * (1 - q), P[1] - dy * (1 - q)];
  const p = P => P.map(v => v.toFixed(1)).join(',');
  const voda = o.hladina ? (() => { const v = o.hladina * k; return `<polygon points="${p(A)} ${p(B)} ${p(s(B))} ${p([s(B)[0], s(B)[1] - v])} ${p([B[0], B[1] - v])} ${p([A[0], A[1] - v])}" class="ob-v"/>`; })() : '';
  return `<svg viewBox="0 0 ${W} ${H}" class="ob" role="img" aria-label="kvádr">${voda}<polygon points="${p(A)} ${p(B)} ${p(C)} ${p(D)}" class="ob-s"/><polygon points="${p(D)} ${p(C)} ${p(s(C))} ${p(s(D))}" class="ob-s"/><polygon points="${p(B)} ${p(s(B))} ${p(s(C))} ${p(C)}" class="ob-s"/>
    <polyline points="${p(A)} ${p(s(A))} ${p(s(B))}" class="ob-h"/><line x1="${s(A)[0]}" y1="${s(A)[1]}" x2="${s(D)[0]}" y2="${s(D)[1]}" class="ob-h"/>
    ${t((A[0] + B[0]) / 2, y + 24, pop.a, jeQ(pop.a))}${t(B[0] + dx / 2 + 8, y - dy / 2 + 12, pop.b, jeQ(pop.b), 'start')}${t(x - 8, y - c * k / 2 + 5, pop.c, jeQ(pop.c), 'end')}</svg>`;
}
export { cz };
