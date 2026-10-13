// Společné kreslení pro mapy ročníků (stromy, lampy, mraky, okna, obloha).
export const okna = (x, y, sl, rad, w, h, dx, dy) => Array.from({ length: sl * rad }, (_, i) => `<rect x="${x + (i % sl) * dx}" y="${y + Math.floor(i / sl) * dy}" width="${w}" height="${h}" rx="1.5" class="m-okno" style="--d:${(i * 0.37) % 3}s"/>`).join('');
export const strom = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2" y="-6" width="4" height="16" class="m-kmen"/><circle cx="0" cy="-16" r="13" class="m-koruna"/><circle cx="-7" cy="-10" r="9" class="m-koruna2"/></g>`;
export const lampa = x => `<g transform="translate(${x} 336)"><rect x="-1.2" y="0" width="2.4" height="30" class="m-kmen"/><circle cx="0" cy="0" r="4" class="m-lampa"/><circle cx="0" cy="0" r="16" class="m-zare"/></g>`;
export const mrak = (x, y, s, d) => `<g class="m-mrak" style="--d:${d}s"><g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="26" ry="11"/><circle cx="-9" cy="-7" r="11"/><circle cx="8" cy="-10" r="14"/></g></g>`;

export const hvezdy = () => Array.from({ length: 26 }, (_, i) => `<circle cx="${(i * 97) % 600}" cy="${(i * 53) % 150 + 6}" r="${i % 3 ? 1 : 1.6}" class="m-hvezda" style="--d:${(i % 5) * 0.6}s"/>`).join('');
export const nebe = id => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="m-nebe1"/><stop offset=".6" class="m-nebe2"/><stop offset="1" class="m-nebe3"/></linearGradient></defs><rect width="600" height="380" fill="url(#${id})"/><g class="m-hvezdy">${hvezdy()}</g>
  <g class="m-slunce"><circle cx="470" cy="62" r="30" class="m-slunce-k"/><circle cx="470" cy="62" r="48" class="m-slunce-z"/><circle cx="460" cy="55" r="5" class="m-krater"/><circle cx="478" cy="72" r="3.5" class="m-krater"/></g>`;
export const cedule = (x, y, w, text) => `<rect x="${x - w / 2}" y="${y}" width="${w}" height="12" rx="3" class="m-cedule"/><text x="${x}" y="${y + 9}" class="m-napis m-napis-m">${text}</text>`;
