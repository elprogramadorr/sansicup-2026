// Drawing kit shared by every sticker: line system, shading, texture,
// path generators and small decorations.
//
// Line system (whole collection):
// - OUT: thick navy keyline around each character/prop silhouette
// - IN:  thinner interior lines; may take the dark of the local color
// - halo: white ring that separates overlapping parts (lettering style)
const { C } = require('./lib');

const OUT = 14;
const IN = 9;

let uid = 0;
const nextId = (p = 'k') => `${p}${++uid}`;

const shape = (d, fill, { line = IN, color = C.ink, extra = '' } = {}) =>
  `<path d="${d}" fill="${fill}" stroke="${line ? color : 'none'}" stroke-width="${line}" stroke-linejoin="round" stroke-linecap="round" ${extra}/>`;
const stroke = (d, w = IN, color = C.ink, extra = '') =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
function clipped(baseD, inner) {
  const id = nextId('c');
  return `<clipPath id="${id}"><path d="${baseD}"/></clipPath><g clip-path="url(#${id})">${inner}</g>`;
}
const silhouette = (ds, w = OUT, color = C.ink) =>
  `<g fill="${color}" stroke="${color}" stroke-width="${w * 2}" stroke-linejoin="round" stroke-linecap="round">${ds.map((d) => `<path d="${d}"/>`).join('')}</g>`;
const halo = (ds, w = OUT * 2 + 12) =>
  `<g fill="${C.white}" stroke="${C.white}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round">${ds.map((d) => `<path d="${d}"/>`).join('')}</g>`;
// Halo + keyline + fill for a group of shapes that must read in front of others
const popped = (ds, fill) => halo(ds) + silhouette(ds) + ds.map((d) => shape(d, fill)).join('');

const circle = (cx, cy, r) => `M${cx - r},${cy} a${r},${r} 0 1,0 ${r * 2},0 a${r},${r} 0 1,0 ${-r * 2},0 Z`;
const ellipse = (cx, cy, rx, ry) => `M${cx - rx},${cy} a${rx},${ry} 0 1,0 ${rx * 2},0 a${rx},${ry} 0 1,0 ${-rx * 2},0 Z`;

// --- texture ---------------------------------------------------------------
// Deterministic PRNG so every build produces the same dots
function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
// Stipple grain clipped to a shape: printed-texture feel in the shadows.
// Dots stay ≥ 0.12 mm at 4 cm (r ≥ 2.2 units).
function grain(d, color, { box, spacing = 15, rmin = 2.2, rmax = 4.2, seed = 7 } = {}) {
  const [x0, y0, x1, y1] = box;
  const r = rng(seed);
  let dots = '';
  for (let y = y0; y < y1; y += spacing) {
    for (let x = x0; x < x1; x += spacing) {
      const jx = x + (r() - 0.5) * spacing * 0.9, jy = y + (r() - 0.5) * spacing * 0.9;
      dots += `<circle cx="${jx.toFixed(1)}" cy="${jy.toFixed(1)}" r="${(rmin + r() * (rmax - rmin)).toFixed(1)}"/>`;
    }
  }
  return clipped(d, `<g fill="${color}">${dots}</g>`);
}
// Halftone that fades along a direction (retro print shading)
function halftone(d, color, { box, spacing = 18, angle = 45, from = 0, to = 1, rmax = 6.5 } = {}) {
  const [x0, y0, x1, y1] = box;
  const a = (angle * Math.PI) / 180, ux = Math.cos(a), uy = Math.sin(a);
  const proj = (x, y) => x * ux + y * uy;
  const ps = [proj(x0, y0), proj(x1, y0), proj(x0, y1), proj(x1, y1)];
  const pmin = Math.min(...ps), pmax = Math.max(...ps);
  let dots = '';
  let row = 0;
  for (let y = y0; y < y1; y += spacing * 0.866, row++) {
    for (let x = x0 + (row % 2) * spacing / 2; x < x1; x += spacing) {
      const t = (proj(x, y) - pmin) / (pmax - pmin);
      const k = from + (to - from) * t;
      if (k <= 0.05) continue;
      dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rmax * Math.min(1, k)).toFixed(1)}"/>`;
    }
  }
  return clipped(d, `<g fill="${color}">${dots}</g>`);
}

// --- decorations -------------------------------------------------------------
// 4-point sparkle with concave sides
function sparkleD(x, y, r, k = 0.28) {
  const q = r * k;
  return `M${x},${y - r} Q${x + q},${y - q} ${x + r},${y} Q${x + q},${y + q} ${x},${y + r} Q${x - q},${y + q} ${x - r},${y} Q${x - q},${y - q} ${x},${y - r} Z`;
}
const sparkle = (x, y, r, fill = C.yellow, line = 7) => shape(sparkleD(x, y, r), fill, { line });
const dot = (x, y, r, fill = C.yellow, line = 7) => shape(circle(x, y, r), fill, { line });

// --- path generators -------------------------------------------------------
const centroid = (pts) => [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length];
const outward = (x0, y0, x1, y1, cx, cy) => {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
  let nx = y1 - y0, ny = x0 - x1;
  const len = Math.hypot(nx, ny) || 1; nx /= len; ny /= len;
  if ((mx - cx) * nx + (my - cy) * ny < 0) { nx = -nx; ny = -ny; }
  return { mx, my, nx, ny, len };
};
const pick = (v, i) => (Array.isArray(v) ? v[i % v.length] : v);
const f1 = (v) => v.toFixed(1);

// Round bumps between points (fluffy/cloud edge)
function fluff(pts, amp = 0.32) {
  const [cx, cy] = centroid(pts);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const { mx, my, nx, ny, len } = outward(x0, y0, x1, y1, cx, cy);
    const a = pick(amp, i) * len;
    d += ` Q${f1(mx + nx * a)},${f1(my + ny * a)} ${x1},${y1}`;
  });
  return d + ' Z';
}
// Bumps that droop downward (fur flow)
function tuft(pts, amp = 0.28, droop = 0.12) {
  const [cx, cy] = centroid(pts);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const { mx, my, nx, ny, len } = outward(x0, y0, x1, y1, cx, cy);
    const a = pick(amp, i) * len;
    d += ` Q${f1(mx + nx * a)},${f1(my + ny * a + pick(droop, i) * len)} ${x1},${y1}`;
  });
  return d + ' Z';
}
// Pointed hair locks (outward + droop + lean along the segment)
function shag(pts, amp = 0.4, droop = 0.15, lean = 0.18) {
  const [cx, cy] = centroid(pts);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    const { mx, my, nx, ny, len } = outward(x0, y0, x1, y1, cx, cy);
    const a = pick(amp, i) * len, dr = pick(droop, i) * len;
    const tx = mx + nx * a + (x1 - x0) * pick(lean, i), ty = my + ny * a + dr;
    d += ` Q${f1(x0 + (tx - x0) * 0.45 + nx * a * 0.55)},${f1(y0 + (ty - y0) * 0.45 + ny * a * 0.55)} ${f1(tx)},${f1(ty)}`;
    d += ` Q${f1(tx + (x1 - tx) * 0.6 + nx * a * 0.1)},${f1(ty + (y1 - ty) * 0.6 + ny * a * 0.1)} ${x1},${y1}`;
  });
  return d + ' Z';
}
// Smooth closed curve through points (Catmull-Rom → cubic Bézier)
function smooth(pts, tension = 0.5, closed = true) {
  const n = pts.length;
  const P = (i) => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const t = tension / 3;
    const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
    const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
    d += ` C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${f1(p2[0])},${f1(p2[1])}`;
  }
  return d + (closed ? ' Z' : '');
}
const arc = (cx, cy, rx, ry, a0, a1, n) => Array.from({ length: n }, (_, i) => {
  const a = ((a0 + (a1 - a0) * i / (n - 1)) * Math.PI) / 180;
  return [+(cx + rx * Math.cos(a)).toFixed(1), +(cy + ry * Math.sin(a)).toFixed(1)];
});
const mirror = (pts, ax) => pts.map(([x, y]) => [+(2 * ax - x).toFixed(1), y]).reverse();
const sym = (half, ax = 540) => half.concat(mirror(half, ax).slice(1, -1));
// Mirror an absolute-coordinate path horizontally around x = ax
const flipD = (d, ax) => d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m, x, y) => `${f1(2 * ax - +x)},${y}`);

// Rotate an absolute-coordinate path around (cx, cy)
const rotD = (d, deg, cx, cy) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (m, x, y) => {
    const dx = +x - cx, dy = +y - cy;
    return `${f1(cx + dx * c - dy * s)},${f1(cy + dx * s + dy * c)}`;
  });
};

// Tube limb: halo, keyline, fill (round caps)
const limb = (d, w, fill = C.white, { haloW = 12 } = {}) =>
  stroke(d, w + OUT * 2 + haloW, C.white) + stroke(d, w + OUT * 2, C.ink) + stroke(d, w, fill);

module.exports = {
  OUT, IN, nextId, shape, stroke, clipped, silhouette, halo, popped, circle, ellipse,
  rng, grain, halftone, sparkleD, sparkle, dot,
  fluff, tuft, shag, smooth, arc, mirror, sym, flipD, rotD, limb,
};
