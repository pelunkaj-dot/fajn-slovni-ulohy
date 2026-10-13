// Pomůcky pro světy dalších ročníků: obecné scény postupu (300 × 44) a skládání znaku.
export const f = (x, d = 1) => +x.toFixed(d);
// zastávky na čáře a jezdec, který po nich postupuje (jezdec = SVG kreslené kolem bodu 0,0)
export const scZastavky = (jezdec, cara = 'sc-l') => (p, n) => {
  const xs = Array.from({ length: n + 1 }, (_, k) => 14 + k * 272 / n);
  return `<line x1="10" y1="30" x2="290" y2="30" class="${cara}"/>${xs.map((v, k) => `<circle cx="${f(v)}" cy="30" r="3.5" class="${k / n <= p + 1e-9 ? 'sc-f' : 'sc-v'}"/>`).join('')}<g transform="translate(${f(14 + p * 272)} 22)" class="sc-a">${jezdec}</g>`;
};
// nádoba, která se plní (tvar = obrys cesty v rámci 300 × 44)
export const scPlneni = (obrys) => p => `<clipPath id="scp"><path d="${obrys}"/></clipPath><rect x="0" y="${f(44 - p * 40)}" width="300" height="44" clip-path="url(#scp)" class="sc-f" style="opacity:.55"/><path d="${obrys}" class="sc-l"/>`;
// řada políček, která se postupně vybarvují (jako dílky)
export const scDilky = (tvar = 'rect') => (p, n) => Array.from({ length: n }, (_, k) => { const x = 8 + k * 284 / n, w = 284 / n - 4, on = k < Math.round(p * n);
  return tvar === 'circle' ? `<circle cx="${f(x + w / 2)}" cy="24" r="${f(Math.min(w / 2, 14))}" class="${on ? 'sc-f' : 'sc-v'}"/>` : `<rect x="${f(x)}" y="12" width="${f(w)}" height="22" rx="4" class="${on ? 'sc-f' : 'sc-v'}"/>`; }).join('');
export const znak = obsah => `<svg viewBox="0 0 64 64" aria-hidden="true">${obsah}</svg>`;
export const hlasky = (ok, chyba1, chyba2, odhaleni) => ({ ok, chyba1, chyba2, odhaleni });
