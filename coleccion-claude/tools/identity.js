// Identity pieces: official UMSS crest (traced), mini World Finals shirts,
// and a two-ink "screen print" converter for retro badges.
const fs = require('fs');
const path = require('path');
const { C, textPath } = require('./lib');
const K = require('./kit');

const ESC = JSON.parse(fs.readFileSync(path.join(__dirname, 'escudo.json'), 'utf8'));
const UMSS_NAVY = '#003975', UMSS_RED = '#ED1C24';

// UMSS crest with its top-center at (x, y) and height h.
// The emblem's hairlines are thickened (they would not print at sticker size).
const NB = (() => {
  const n = ESC.navy.match(/-?\d*\.?\d+/g).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
  return { x0, y0, x1, y1 };
})();
function crest(x, y, h) {
  const k = h / (NB.y1 - NB.y0);
  const tri = `M${NB.x0},${NB.y0} L${NB.x1},${NB.y0} L${(NB.x0 + NB.x1) / 2},${NB.y1} Z`;
  const id = K.nextId('em');
  const cx = (NB.x0 + NB.x1) / 2;
  return `<g transform="translate(${(x - cx * k).toFixed(1)} ${(y - NB.y0 * k).toFixed(1)}) scale(${k.toFixed(5)})">
    <path d="${tri}" fill="${C.white}" stroke="${C.white}" stroke-width="${(K.OUT * 2 + 14) / k}" stroke-linejoin="round"/>
    <path d="${ESC.red}" fill="${UMSS_RED}" fill-rule="evenodd"/>
    <path d="${ESC.navy}" fill="${UMSS_NAVY}" fill-rule="evenodd"/>
    <clipPath id="${id}"><rect x="${cx - 95}" y="${NB.y0 + (NB.y1 - NB.y0) * 0.34}" width="190" height="${(NB.y1 - NB.y0) * 0.42}"/></clipPath>
    <path d="${ESC.navy}" fill="none" stroke="${UMSS_NAVY}" stroke-width="5" stroke-linejoin="round" clip-path="url(#${id})"/>
  </g>`;
}

// Mini souvenir shirt. (x, y) = collar center top, w = shirt width.
function shirt(x, y, w, { fabric, fabricShade, ink, lines }) {
  const s = w / 600;
  const P = (px, py) => `${(x + px * s).toFixed(1)},${(y + py * s).toFixed(1)}`;
  const body = `M${P(-90, 0)} C${P(-60, 28)} ${P(60, 28)} ${P(90, 0)} L${P(206, 34)} L${P(300, 210)} L${P(212, 262)} L${P(186, 214)} L${P(186, 640)} C${P(186, 652)} ${P(176, 660)} ${P(164, 660)} L${P(-164, 660)} C${P(-176, 660)} ${P(-186, 652)} ${P(-186, 640)} L${P(-186, 214)} L${P(-212, 262)} L${P(-300, 210)} L${P(-206, 34)} Z`;
  const collar = `M${P(-90, 0)} C${P(-60, 28)} ${P(60, 28)} ${P(90, 0)} L${P(106, 6)} C${P(70, 52)} ${P(-70, 52)} ${P(-106, 6)} Z`;
  let print = '';
  for (const L of lines) {
    if (L.icons) {
      const iw = 76 * s, gap = 16 * s, y0 = y + L.y * s;
      const xs = [-1, 0, 1].map((i) => x + i * (iw + gap));
      print += xs.map((cx, i) => {
        const r = `M${cx - iw / 2 + 10 * s},${y0} H${cx + iw / 2 - 10 * s} Q${cx + iw / 2},${y0} ${cx + iw / 2},${y0 + 10 * s} V${y0 + iw - 10 * s} Q${cx + iw / 2},${y0 + iw} ${cx + iw / 2 - 10 * s},${y0 + iw} H${cx - iw / 2 + 10 * s} Q${cx - iw / 2},${y0 + iw} ${cx - iw / 2},${y0 + iw - 10 * s} V${y0 + 10 * s} Q${cx - iw / 2},${y0} ${cx - iw / 2 + 10 * s},${y0} Z`;
        const cy = y0 + iw / 2, u = iw / 100;
        const glyph = i === 0
          ? `<path d="M${cx - 30 * u},${cy + 6 * u} C${cx - 40 * u},${cy - 14 * u} ${cx - 18 * u},${cy - 30 * u} ${cx - 4 * u},${cy - 22 * u} C${cx + 6 * u},${cy - 36 * u} ${cx + 34 * u},${cy - 26 * u} ${cx + 30 * u},${cy - 6 * u} C${cx + 42 * u},${cy + 4 * u} ${cx + 30 * u},${cy + 22 * u} ${cx + 16 * u},${cy + 16 * u} L${cx - 20 * u},${cy + 18 * u} L${cx - 30 * u},${cy + 30 * u} Z" fill="${fabric}"/>`
          : i === 1
            ? `<path d="M${cx},${cy - 32 * u} C${cx + 20 * u},${cy - 32 * u} ${cx + 28 * u},${cy - 14 * u} ${cx + 22 * u},${cy} C${cx + 18 * u},${cy + 8 * u} ${cx + 10 * u},${cy + 12 * u} ${cx + 10 * u},${cy + 20 * u} L${cx - 10 * u},${cy + 20 * u} C${cx - 10 * u},${cy + 12 * u} ${cx - 18 * u},${cy + 8 * u} ${cx - 22 * u},${cy} C${cx - 28 * u},${cy - 14 * u} ${cx - 20 * u},${cy - 32 * u} ${cx},${cy - 32 * u} Z" fill="${fabric}"/><rect x="${cx - 9 * u}" y="${cy + 24 * u}" width="${18 * u}" height="${8 * u}" fill="${fabric}"/>`
            : `<path d="M${cx},${cy - 34 * u} C${cx + 20 * u},${cy - 34 * u} ${cx + 24 * u},${cy - 10 * u} ${cx + 14 * u},${cy + 4 * u} C${cx + 8 * u},${cy + 12 * u} ${cx + 2 * u},${cy + 14 * u} ${cx},${cy + 16 * u} C${cx - 2 * u},${cy + 14 * u} ${cx - 8 * u},${cy + 12 * u} ${cx - 14 * u},${cy + 4 * u} C${cx - 24 * u},${cy - 10 * u} ${cx - 20 * u},${cy - 34 * u} ${cx},${cy - 34 * u} Z" fill="${fabric}"/>` +
              K.stroke(`M${cx},${cy + 18 * u} C${cx - 8 * u},${cy + 26 * u} ${cx + 8 * u},${cy + 32 * u} ${cx},${cy + 40 * u}`, 5 * u, fabric);
        const extra = i === 1
          ? [-50, -25, 0, 25, 50].map((a) => { const t = (a * Math.PI) / 180; return K.stroke(`M${(cx + Math.sin(t) * 46 * u).toFixed(1)},${(y0 - 8 * u - Math.cos(t) * 2 * u).toFixed(1)} L${(cx + Math.sin(t) * 62 * u).toFixed(1)},${(y0 - 8 * u - Math.cos(t) * 20 * u).toFixed(1)}`, 5 * u, ink); }).join('')
          : i === 2 ? K.stroke(`M${cx},${y0 + 20 * u} C${cx + 10 * u},${y0 - 6 * u} ${cx - 10 * u},${y0 - 20 * u} ${cx},${y0 - 34 * u}`, 4 * u, ink) +
            `<path d="M${cx},${y0 - 96 * u} C${cx + 22 * u},${y0 - 96 * u} ${cx + 26 * u},${y0 - 70 * u} ${cx + 14 * u},${y0 - 52 * u} C${cx + 8 * u},${y0 - 42 * u} ${cx + 3 * u},${y0 - 38 * u} ${cx},${y0 - 36 * u} C${cx - 3 * u},${y0 - 38 * u} ${cx - 8 * u},${y0 - 42 * u} ${cx - 14 * u},${y0 - 52 * u} C${cx - 26 * u},${y0 - 70 * u} ${cx - 22 * u},${y0 - 96 * u} ${cx},${y0 - 96 * u} Z" fill="none" stroke="${ink}" stroke-width="${5 * u}"/>` : '';
        return `<path d="${r}" fill="${ink}"/>` + glyph + extra;
      }).join('');
    } else {
      const font = L.font || 'BarlowCondensed-Black';
      let size = L.size * s;
      const maxW = 330 * s;
      const w0 = textPath(L.text, { fontName: font, size, x: 0, y: 0, tracking: (L.tracking || 0) * s }).width;
      if (w0 > maxW) size *= maxW / w0;
      const t = textPath(L.text, { fontName: font, size, x, y: y + L.y * s, anchor: 'middle', tracking: (L.tracking || 0) * s * (size / (L.size * s)) });
      print += `<path d="${t.d}" fill="${ink}"/>`;
    }
  }
  return K.halo([body]) + K.silhouette([body]) + K.shape(body, fabric) +
    K.clipped(body, K.shape(`M${P(-186, 214)} C${P(-150, 360)} ${P(-150, 520)} ${P(-186, 660)} Z`, fabricShade, { line: 0 }) +
      K.shape(`M${P(186, 214)} C${P(160, 300)} ${P(160, 360)} ${P(186, 420)} Z`, fabricShade, { line: 0 }) +
      K.stroke(`M${P(-120, 600)} C${P(-60, 590)} ${P(-20, 610)} ${P(30, 596)}`, 7 * s, fabricShade) +
      K.stroke(`M${P(-206, 34)} L${P(-186, 214)}`, 8 * s, fabricShade) + K.stroke(`M${P(206, 34)} L${P(186, 214)}`, 8 * s, fabricShade)) +
    K.shape(collar, fabricShade) + print +
    K.stroke(`M${P(-300, 210)} L${P(-212, 262)}`, 10 * s, fabricShade) + K.stroke(`M${P(300, 210)} L${P(212, 262)}`, 10 * s, fabricShade);
}

// Two inks + halftone: dark → ink, light → paper, mid tones → explicit
// halftone dots of ink on paper (real vector dots, no SVG/PDF patterns, so
// no tile seams in viewers or print RIPs). `map` forces a class per color.
function twoInk(markup, { ink = C.navy, paper = '#F4EBD8', map = {}, spacing = 16, r = 4.6 } = {}) {
  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16), R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
    return (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255;
  };
  const cls = (hex) => map[hex.toUpperCase()] || (lum(hex) < 0.3 ? 'ink' : lum(hex) > 0.72 ? 'paper' : 'tone');
  const bbox = (d) => {
    const n = d.match(/-?\d*\.?\d+/g).map(Number);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]); }
    return [x0 - spacing, y0 - spacing, x1 + spacing, y1 + spacing];
  };
  // 1) shapes filled with a mid tone → paper fill + clipped dot screen
  let out = markup.replace(/<(path|circle)\b([^>]*?)\/>/g, (m, tag, attrs) => {
    const fm = attrs.match(/fill="(#[0-9A-Fa-f]{6})"/);
    if (!fm || cls(fm[1]) !== 'tone') return m;
    let d;
    if (tag === 'path') d = attrs.match(/ d="([^"]*)"/)[1];
    else {
      const g = (k) => +attrs.match(new RegExp(` ${k}="([^"]*)"`))[1];
      d = K.circle(g('cx'), g('cy'), g('r'));
    }
    return m.replace(fm[0], `fill="${paper}"`) +
      K.halftone(d, ink, { box: bbox(d), spacing, from: 1, to: 1, rmax: r });
  });
  // 2) every remaining color → ink or paper (tone strokes print as ink)
  out = out.replace(/(fill|stroke)="(#[0-9A-Fa-f]{6})"/g, (m, attr, hex) =>
    `${attr}="${cls(hex) === 'paper' ? paper : ink}"`);
  return out;
}

module.exports = { crest, shirt, twoInk, UMSS_NAVY, UMSS_RED };
