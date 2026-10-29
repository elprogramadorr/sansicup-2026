// Shared helpers: palette, lettering extraction, text-to-path, sticker border.
const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');
const sharp = require('sharp');
const potrace = require('potrace');

const ROOT = path.resolve(__dirname, '..');
const PROJECT = path.resolve(ROOT, '..');

// Paleta global del set (no se usa ningún color fuera de esta lista).
const C = {
  navy: '#14286E',
  red: '#D7192D',
  yellow: '#FFC72C',
  white: '#FFFFFF',
  ink: '#14286E',          // línea de contorno = azul marino de marca
  gold: '#FFC72C', goldShade: '#E89A1C', goldLight: '#FFE38A',
  green: '#3FA34D', greenShade: '#2C7A3B', greenLight: '#7CC45A',
  turq: '#2B9FC9', turqShade: '#1E7BA3',
  beak: '#3B3F4C', beakLight: '#6B7180',
  cream: '#FFF8EC', creamShade: '#EADBC0', creamDeep: '#D9C3A0',
  orange: '#E5843A', orangeShade: '#C4682A',
  black: '#2A2A33',
  pink: '#F29BA6', pinkShade: '#E07A88',
  irisGreen: '#B8C93A',
  gray: '#D9DEE6', grayShade: '#B9C1CE',
  eyeRing: '#EEF0F2',
  dogShade: '#E7E1D5', dogDeep: '#CEC5B4', brownEye: '#3B2A22', royal: '#2F6FD0',
  dogCream: '#F4E6C9', dogCreamDeep: '#E8D3AC', navyShade: '#0D1B4F',
  dogWhite: '#F4F1E9', dogEar: '#EEE5D3', dogPatch: '#E2D8C6', dogBeard: '#EBD9B6',
  lilac: '#B79CE8', lilacShade: '#7651C0', pinkDeep: '#C2456A',
};

// --- path utils -----------------------------------------------------------
function pathBBox(d) {
  const nums = d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
  }
  return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
}

// --- lettering (traced signature from the approved reference) -------------
// Returns { red, blue } path data in a 1000-unit-wide space, with the old
// "2026" numerals and yellow tag removed (rebuilt with a real font instead).
function loadLettering() {
  const svg = fs.readFileSync(path.join(PROJECT, 'pilotos-vectoriales/svg/01-sansicup-lettering.svg'), 'utf8');
  const get = (id) => svg.match(new RegExp(`id="${id}" d="([^"]*)"`))[1];
  const blueSubs = get('firma-01').split(/(?=M)/).filter(Boolean);
  const keepBlue = blueSubs.filter((s) => {
    const b = pathBBox(s);
    const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
    return !(cx > 300 && cy > 128); // the 2026 numerals sit bottom-right
  });
  return { red: get('firma-02'), blue: keepBlue.join(''), scale: 2 };
}

// --- text to path ---------------------------------------------------------
const fontCache = {};
function font(name) {
  if (!fontCache[name]) fontCache[name] = opentype.loadSync(path.join(ROOT, 'fuentes', name + '.ttf'));
  return fontCache[name];
}
// Text path with optional tracking; anchor: 'start' | 'middle'
function textPath(str, { fontName, size, x, y, tracking = 0, anchor = 'start' }) {
  const f = font(fontName);
  const glyphs = f.stringToGlyphs(str);
  const scale = size / f.unitsPerEm;
  let width = 0;
  glyphs.forEach((g, i) => { width += g.advanceWidth * scale + (i < glyphs.length - 1 ? tracking : 0); });
  let cx = anchor === 'middle' ? x - width / 2 : x;
  let d = '';
  glyphs.forEach((g) => {
    d += g.getPath(cx, y, size).toPathData(2);
    cx += g.advanceWidth * scale + tracking;
  });
  return { d, width };
}

// --- sticker border (die-cut) ---------------------------------------------
// Renders the art silhouette, dilates by `offset` units, closes small notches,
// and traces a single smooth outline with potrace. Returns path data in art units.
async function dieCut(artSvgInner, viewBox, offset, { smooth = 1.8 } = {}) {
  const [vx, vy, vw, vh] = viewBox;
  const pad = offset * 2.5;
  const W = 2000;
  const k = W / (vw + pad * 2);
  const H = Math.round((vh + pad * 2) * k);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${vx - pad} ${vy - pad} ${vw + pad * 2} ${vh + pad * 2}">${artSvgInner}</svg>`;
  const { Resvg } = require('@resvg/resvg-js');
  const art = new Resvg(svg, { fitTo: { mode: 'width', value: W } }).render().asPng();
  const off = offset * k;
  // sharp runs its ops in a fixed order (threshold before blur), so each step
  // is its own pass.
  const step = (buf, fn) => fn(sharp(buf)).png().toBuffer();
  const alpha = await step(art, (s) => s.extractChannel('alpha'));
  // Dilate: gaussian blur + low threshold grows the shape by ~1.87σ.
  const blurred = await step(alpha, (s) => s.blur(off / 1.87));
  const dil = await step(blurred, (s) => s.threshold(8));
  // Close/smooth: second blur + mid threshold rounds notches without moving edges.
  const smoothSigma = Math.max(0.5, off * smooth * 0.5);
  const sm = await step(dil, (s) => s.blur(smoothSigma));
  const png = await step(sm, (s) => s.threshold(128).negate({ alpha: false }));
  const traced = await new Promise((res, rej) =>
    potrace.trace(png, { turdSize: 400, optTolerance: 0.3, alphaMax: 1.25, threshold: 128 }, (e, s) => (e ? rej(e) : res(s))));
  let d = traced.match(/ d="([^"]*)"/)[1];
  // Keep the largest contour (the sticker); holes sit inside it. Any other
  // contour outside it is an island the cut would drop: warn loudly.
  const subs = d.split(/(?=M)/).map((p) => ({ p, b: pathBBox(p) }));
  subs.forEach((o) => { o.area = o.b.w * o.b.h; });
  subs.sort((a, b) => b.area - a.area);
  const main = subs[0];
  const islands = subs.slice(1).filter((o) => o.b.x0 < main.b.x0 || o.b.x1 > main.b.x1 || o.b.y0 < main.b.y0 || o.b.y1 > main.b.y1);
  if (islands.length) console.warn(`\n  ⚠ ${islands.length} elemento(s) fuera del borde de corte`);
  d = main.p;
  return { d, transform: `translate(${vx - pad} ${vy - pad}) scale(${1 / k})` };
}

module.exports = { C, ROOT, PROJECT, pathBBox, loadLettering, textPath, dieCut, font };
