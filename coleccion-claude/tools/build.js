// Builds every sticker in stickers.js: SVG master (white border + art +
// CutContour), PNG preview, large review render and a contact sheet.
// Usage: node build.js [id-substring]
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');
const { C, ROOT, dieCut } = require('./lib');
const STICKERS = require('./stickers');

const OUT = { svg: path.join(ROOT, 'svg'), png: path.join(ROOT, 'png'), rev: path.join(ROOT, 'revision') };
Object.values(OUT).forEach((d) => fs.mkdirSync(d, { recursive: true }));
const BG = '#E8E4DA';

// Bounding box of the rendered art, in art units
async function autoBox(art) {
  const V = [-800, -800, 2800, 2800], px = 1400, k = px / V[2];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${V.join(' ')}">${art}</svg>`;
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: px } }).render().asPng();
  const { info } = await sharp(png).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true });
  const x = V[0] - info.trimOffsetLeft / k, y = V[1] - info.trimOffsetTop / k;
  const m = 6;
  return [x - m, y - m, info.width / k + 2 * m, info.height / k + 2 * m];
}

async function buildOne(s) {
  const art = s.art();
  const box = s.box || await autoBox(art);
  const [bx, by, bw, bh] = box;
  const offset = Math.max(bw, bh) * 0.052; // ≈2 mm when the long side is 40 mm
  const cut = await dieCut(art, box, offset);
  const pad = offset * 1.2;
  const vb = [bx - pad, by - pad, bw + pad * 2, bh + pad * 2];
  const k = 40 / Math.max(vb[2], vb[3]); // mm per unit at 40 mm
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="${(vb[2] * k).toFixed(2)}mm" height="${(vb[3] * k).toFixed(2)}mm" viewBox="${vb.map((v) => v.toFixed(2)).join(' ')}">
<title>${s.title}</title>
<g id="borde-blanco" inkscape:groupmode="layer" inkscape:label="Borde blanco">
  <path d="${cut.d}" transform="${cut.transform}" fill="${C.white}"/>
</g>
<g id="arte" inkscape:groupmode="layer" inkscape:label="Arte">${art}</g>
<g id="CutContour" inkscape:groupmode="layer" inkscape:label="CutContour">
  <path d="${cut.d}" transform="${cut.transform}" fill="none" stroke="#EC008C" stroke-width="${(0.25 * 0.3528 / k).toFixed(3)}"/>
</g>
</svg>`;
  fs.writeFileSync(path.join(OUT.svg, s.id + '.svg'), svg);
  const preview = svg.slice(0, svg.indexOf('<g id="CutContour"')) + '</svg>';
  const px = Math.round((40 / 25.4) * 600);
  const png = new Resvg(preview, { fitTo: { mode: vb[2] >= vb[3] ? 'width' : 'height', value: px } }).render().asPng();
  fs.writeFileSync(path.join(OUT.png, s.id + '.png'), png);
  const big = new Resvg(preview, { fitTo: { mode: vb[2] >= vb[3] ? 'width' : 'height', value: 1400 }, background: BG }).render().asPng();
  fs.writeFileSync(path.join(OUT.rev, s.id + '-grande.png'), big);
  return { id: s.id, png };
}

async function contactSheet(results, file, cols = 4, cell = 480) {
  const tiles = [];
  for (let i = 0; i < results.length; i++) {
    const t = await sharp(results[i].png).resize(cell - 40, cell - 40, { fit: 'contain', background: BG }).png().toBuffer();
    tiles.push({ input: t, left: (i % cols) * cell + 20, top: Math.floor(i / cols) * cell + 20 });
  }
  const rows = Math.ceil(results.length / cols);
  await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: BG } }).composite(tiles).png().toFile(file);
}

(async () => {
  const only = process.argv[2];
  // filter: id substring, or a numeric range like 23-39
  const range = only && only.match(/^(\d+)-(\d+)$/);
  const list = STICKERS.filter((s) => !only || (range ? +s.id.slice(0, 2) >= +range[1] && +s.id.slice(0, 2) <= +range[2] : s.id.includes(only)));
  const results = [];
  for (const s of list) {
    results.push(await buildOne(s));
    process.stdout.write(`${s.id} `);
  }
  if (!only) {
    await contactSheet(results, path.join(OUT.rev, 'contacto.png'));
    const manifest = STICKERS.map(({ id, title, sizes, group, note }) => ({ id, title, sizes, group, note }));
    fs.writeFileSync(path.join(ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  }
  console.log('\nbuilt', results.length);
})();
