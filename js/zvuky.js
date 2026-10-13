// Zvuky se skládají za běhu přes Web Audio (žádné soubory). Každý svět tématu má vlastní nástroj a znělku,
// melodie se náhodně střídají (vzorec, rytmus, ladění) a s řadou správných odpovědí stoupají. Vše měkké, bez pípání.
let ctx = null, ven = null, dozvuk = null, zap = true, sum = null;
export function nastavZvuk(z) { zap = !!z; }
export function odemkni() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  try {
    ctx = new AC(); ven = ctx.createGain(); ven.gain.value = 0.3; ven.connect(ctx.destination);
    // jemný dozvuk z doznívajícího šumu, aby tóny nezněly suše
    const n = ctx.sampleRate * 1.2, ir = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n) ** 3; }
    const conv = ctx.createConvolver(); conv.buffer = ir; dozvuk = ctx.createGain(); dozvuk.gain.value = 0.16; dozvuk.connect(conv); conv.connect(ven);
    sum = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate); const s = sum.getChannelData(0); for (let i = 0; i < s.length; i++) s[i] = Math.random() * 2 - 1;
  } catch (e) { ctx = null; }
}
const hz = m => 440 * 2 ** ((m - 69) / 12);
const nah = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const hraje = () => ctx && zap;
function vystup(g) { g.connect(ven); if (dozvuk) g.connect(dozvuk); }
function obal(g, t, utok, hlas, dur) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(hlas, t + utok); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); }
function osc(m, t, dur, typ, hlas, o = {}) {
  const os = ctx.createOscillator(), g = ctx.createGain(); let uzel = os;
  os.type = typ; os.frequency.setValueAtTime(hz(m), t); os.detune.value = nah(-8, 8);
  if (o.glide) os.frequency.exponentialRampToValueAtTime(hz(m + o.glide), t + (o.glideT || dur));
  if (o.filtr) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.Q.value = o.q || 1; fl.frequency.setValueAtTime(o.filtr[0], t); fl.frequency.exponentialRampToValueAtTime(o.filtr[1], t + dur); os.connect(fl); uzel = fl; }
  uzel.connect(g); obal(g, t, o.utok || 0.008, hlas, dur); vystup(g); os.start(t); os.stop(t + dur + 0.05);
}
function sumik(t, dur, hlas, freq, typ = 'bandpass') {
  if (!sum) return;
  const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = sum; fl.type = typ; fl.frequency.value = freq; fl.Q.value = 1.2; s.connect(fl); fl.connect(g); obal(g, t, 0.003, hlas, dur); vystup(g); s.start(t); s.stop(t + dur + 0.02);
}
// nástroje: (výška v MIDI, za kolik sekund, síla 0–1)
const N = {
  piano(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 0.5, 'triangle', 0.4 * v); osc(m + 12, t, 0.25, 'sine', 0.12 * v); },
  kov(m, k, v) { const t = ctx.currentTime + k; [[0, 1, 1.1], [16.6, 0.35, 0.6], [29.2, 0.15, 0.3]].forEach(([d, a, dur]) => osc(m + d, t, dur, 'sine', 0.32 * a * v, { utok: 0.003 })); },
  marimba(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 0.45, 'sine', 0.5 * v, { utok: 0.004 }); osc(m + 24, t, 0.07, 'sine', 0.18 * v, { utok: 0.002 }); sumik(t, 0.02, 0.05 * v, 2400); },
  pluck(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 0.42, 'sawtooth', 0.22 * v, { utok: 0.003, filtr: [hz(m) * 9, hz(m) * 1.2], q: 2 }); osc(m - 12, t, 0.3, 'sine', 0.12 * v); },
  bublina(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 0.16, 'sine', 0.42 * v, { glide: nah(7, 12), glideT: 0.1, utok: 0.004 }); },
  celesta(m, k, v) { const t = ctx.currentTime + k; osc(m + 12, t, 0.7, 'sine', 0.3 * v, { utok: 0.002 }); osc(m + 24, t, 0.25, 'sine', 0.1 * v, { utok: 0.002 }); },
  synth(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 0.32, 'sawtooth', 0.14 * v, { filtr: [hz(m) * 6, hz(m) * 1.5], q: 4 }); osc(m + 0.08, t, 0.32, 'square', 0.05 * v, { filtr: [hz(m) * 4, hz(m)] }); },
  vibrafon(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 0.9, 'sine', 0.4 * v, { utok: 0.004 }); osc(m + 12.02, t, 0.5, 'sine', 0.08 * v, { utok: 0.004 }); },
  pizz(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 0.18, 'triangle', 0.45 * v, { utok: 0.002 }); osc(m + 19, t, 0.06, 'sine', 0.1 * v, { utok: 0.002 }); },
  gong(m, k, v) { const t = ctx.currentTime + k; osc(m, t, 1.4, 'sine', 0.35 * v, { utok: 0.01 }); osc(m + 12, t, 0.7, 'sine', 0.1 * v); osc(m + 19.02, t, 0.4, 'sine', 0.05 * v); },
};
const SVET = { // nástroj, základní tón, stupnice (pět tónů)
  trh: { n: 'kov', z: 79, st: [0, 2, 4, 7, 9] },
  expedice: { n: 'marimba', z: 67, st: [0, 2, 4, 7, 9] },
  nadrazi: { n: 'gong', z: 67, st: [0, 4, 7, 9, 11] },
  plan: { n: 'pluck', z: 62, st: [0, 2, 5, 7, 9] },
  akvarium: { n: 'bublina', z: 72, st: [0, 3, 5, 7, 10] },
  cukrarna: { n: 'celesta', z: 72, st: [0, 2, 4, 7, 9] }, kuchyne: { n: 'vibrafon', z: 64, st: [0, 2, 4, 7, 11] }, benzinka: { n: 'synth', z: 60, st: [0, 3, 5, 7, 10] },
  farma: { n: 'pizz', z: 67, st: [0, 2, 4, 7, 9] }, stadion: { n: 'kov', z: 72, st: [0, 4, 7, 9, 12] }, vyprodej: { n: 'synth', z: 67, st: [0, 2, 4, 7, 9] }, polar: { n: 'celesta', z: 79, st: [0, 2, 5, 7, 9] },
  detektiv: { n: 'vibrafon', z: 57, st: [0, 3, 5, 6, 10] }, album: { n: 'piano', z: 64, st: [0, 2, 4, 7, 9] }, dilna: { n: 'marimba', z: 60, st: [0, 2, 5, 7, 9] },
  zavod: { n: 'synth', z: 62, st: [0, 2, 4, 7, 9] }, hasici: { n: 'kov', z: 67, st: [0, 4, 7, 9, 12] }, cirkus: { n: 'pizz', z: 72, st: [0, 2, 4, 5, 7] },
  tovarna: { n: 'marimba', z: 55, st: [0, 3, 5, 7, 10] }, laborator: { n: 'bublina', z: 67, st: [0, 2, 3, 7, 8] }, kino: { n: 'vibrafon', z: 60, st: [0, 2, 4, 7, 9] },
  reka: { n: 'pluck', z: 64, st: [0, 2, 4, 7, 9] }, banka: { n: 'kov', z: 74, st: [0, 2, 4, 7, 9] }, vesmir: { n: 'celesta', z: 67, st: [0, 2, 6, 7, 11] },
};
const VYCH = { n: 'piano', z: 67, st: [0, 2, 4, 7, 9] };
const VZORCE = [[0, 1, 2], [0, 2, 4], [2, 1, 3], [0, 2, 1, 4], [4, 2, 5], [0, 4, 2, 5], [1, 2, 4], [2, 4, 7], [0, 3, 5], [3, 2, 4, 6]];
const ton = (S, stupen) => S.z + S.st[((stupen % 5) + 5) % 5] + 12 * Math.floor(stupen / 5);
let poslVz = -1, poslSvet = null;
function hraj(s, stupne, krok, sila = 1, posun = 0) { const S = SVET[s] || VYCH; stupne.forEach((d, k) => N[S.n](ton(S, d + posun), k * krok, sila * nah(0.8, 1))); }

export const zvuk = {
  // správně: náhodný motiv ve stupnici světa; s řadou bez chyby stoupá
  ok(combo = 0, s) {
    if (!hraje()) return;
    let i; do { i = Math.floor(Math.random() * VZORCE.length); } while (i === poslVz); poslVz = i;
    hraj(s, VZORCE[i], pick([0.07, 0.09, 0.11]), 1, Math.min(combo, 7));
    if (s === 'trh' && Math.random() < 0.5) { N.kov(98, 0.32, 0.5); N.kov(103, 0.4, 0.4); } // cinknutí mincí
    if (s === 'akvarium') for (let k = 0; k < 3; k++) N.bublina(nah(80, 90), 0.25 + k * 0.07, 0.5);
  },
  chyba(s) {
    if (!hraje()) return; const t = ctx.currentTime;
    if (s === 'trh') { osc(46, t, 0.18, 'square', 0.06, { filtr: [900, 300] }); osc(46, t + 0.2, 0.22, 'square', 0.06, { filtr: [900, 300] }); }
    else if (s === 'nadrazi') { N.gong(64, 0, 0.6); N.gong(59, 0.22, 0.6); }
    else if (s === 'plan') { osc(43, t, 0.12, 'sine', 0.5, { glide: -5 }); sumik(t, 0.05, 0.15, 900); osc(43, t + 0.15, 0.14, 'sine', 0.4, { glide: -5 }); }
    else if (s === 'akvarium') { osc(60, t, 0.25, 'sine', 0.4, { glide: -12 }); osc(55, t + 0.16, 0.3, 'sine', 0.35, { glide: -12 }); }
    else if (s === 'expedice') { N.marimba(57, 0, 0.8); N.marimba(53, 0.14, 0.7); }
    else { osc(52, t, 0.22, 'sine', 0.45, { glide: -4 }); osc(47, t + 0.1, 0.26, 'sine', 0.35, { glide: -3 }); }
  },
  klik(s) { if (!hraje()) return; if (s === 'nadrazi') sumik(ctx.currentTime, 0.03, 0.2, 3000, 'highpass'); else N.marimba(84 + Math.floor(nah(0, 3)), 0, 0.35); },
  napoveda(s) { if (hraje()) hraj(s, [4, 2], 0.12, 0.55); },
  odhaleni(s) { if (hraje()) hraj(s, [4, 3, 2, 0], 0.16, 0.5, -5); },
  krok(s) { if (hraje()) hraj(s, [pick([0, 2, 4])], 0.1, 0.4, 5); },
  // znělka světa na začátku série, aby bylo slyšet, že se změnilo téma
  start(s) {
    poslSvet = s; if (!hraje()) return; const t = ctx.currentTime;
    if (s === 'trh') { sumik(t, 0.06, 0.35, 2500); sumik(t + 0.07, 0.05, 0.3, 1800); N.kov(91, 0.14, 0.8); N.kov(96, 0.2, 0.7); }
    else if (s === 'nadrazi') [67, 72, 76, 72].forEach((m, k) => N.gong(m, k * 0.28, 0.75));
    else if (s === 'plan') [62, 64, 67, 69].forEach((m, k) => N.pluck(m, k * 0.08, 0.8));
    else if (s === 'akvarium') for (let k = 0; k < 7; k++) N.bublina(nah(70, 88), k * 0.06, 0.6);
    else if (s === 'expedice') [67, 71, 69, 74].forEach((m, k) => N.marimba(m, k * 0.12, 0.8));
    else hraj(s, [0, 2, 4], 0.09, 0.7);
  },
  hotovo(hv = 1, s) { if (!hraje()) return; const w = s || poslSvet; hraj(w, [0, 2, 4, 5, 7].slice(0, 2 + hv), 0.12); if (hv >= 3) hraj(w, [7, 9, 10], 0.1, 0.7); },
  neuspech(s) { if (hraje()) hraj(s || poslSvet, [4, 2, 0], 0.18, 0.6, -5); },
  zasah() { if (!hraje()) return; const t = ctx.currentTime; sumik(t, 0.12, 0.3, 1600); osc(pick([76, 79, 81]), t + 0.02, 0.2, 'triangle', 0.35, { glide: 12 }); },
  dopad() { if (!hraje()) return; const t = ctx.currentTime; sumik(t, 0.35, 0.4, 200, 'lowpass'); osc(40, t, 0.35, 'sine', 0.4, { glide: -12 }); },
  stavba() { if (hraje()) [55, 62, 67, 74].forEach((m, k) => N.marimba(m, k * 0.07, 0.8)); },
  odznak() { if (hraje()) [72, 76, 79, 84, 88].forEach((m, k) => N.kov(m, k * 0.08, 0.6)); },
};
