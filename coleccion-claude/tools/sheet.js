// A5 kiss-cut sticker sheets built from the SVG masters in ../svg.
// For each sheet writes imprenta/<name>/<name>.svg (art), <name>_corte.svg
// (kiss-cut contours + sheet edge) and preview PNGs. PDFs come from export.py.
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');
const { C, ROOT } = require('./lib');

const W = 148, H = 210, M = 7;           // mm
const HEADER = 30;                        // header row height (firma sticker)
const GAP = 3;                            // ≥ 2 mm between kiss-cuts
const PAPER = '#F4EBD8';
const PT = 0.3528;                        // mm per pt
// header sticker (wide row on top) + 12 stickers in a 3 × 4 grid (≈ 4 cm each)
const SHEETS = {
  'planilla-a5': { title: 'SanSi Cup 2026 · planilla A5', header: '01-sansicup-firma', grid: [
    '02-sansicup-galano', '03-sansicup-perrito', '04-sansicup-gatita',
    '08-perritos-malvados', '09-gatitas-bondadosas', '10-mucho-maestro',
    '11-bandida', '12-bandido', '13-f-maestro',
    '14-que-waso', '15-wasearse-repeat', '16-icpc-cubo'] },
  'planilla-exclusivos': { title: 'SanSi Cup 2026 · exclusivos', header: '23-sansicup-banderin', grid: [
    '31-juki-judge', '29-gymrat', '30-dont-vibe-code',
    '26-icpc-globos', '27-icpc-1pc-3cerebros', '28-icpc-congelado',
    '32-juki-coach', '33-long-long', '34-segfault',
    '35-ac-en-mi-maquina', '36-stochastic-parrot', '37-vibe-coded'] },
};

function load(id, n) {
  let svg = fs.readFileSync(path.join(ROOT, 'svg', id + '.svg'), 'utf8');
  // namespace ids so stickers can share one document
  svg = svg.replace(/id="([^"]+)"/g, `id="s${n}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#s${n}-$1)`);
  const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const body = svg.slice(svg.indexOf('>', svg.indexOf('<svg')) + 1, svg.lastIndexOf('</svg>')).replace(/<title>[\s\S]*?<\/title>/, '');
  const cutAt = body.indexOf(`<g id="s${n}-CutContour"`);
  return { vb, art: body.slice(0, cutAt), cut: body.slice(cutAt) };
}

// Fit a sticker in a box (mm), centered; returns nested <svg> for art and cut
function place(st, bx, by, bw, bh) {
  const [vx, vy, vw, vh] = st.vb;
  const k = Math.min(bw / vw, bh / vh);
  const w = vw * k, h = vh * k, x = bx + (bw - w) / 2, y = by + (bh - h) / 2;
  const nest = (inner) => `<svg x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${w.toFixed(2)}" height="${h.toFixed(2)}" viewBox="${st.vb.join(' ')}">${inner}</svg>`;
  const cut = st.cut.replace(/stroke-width="[^"]*"/, `stroke-width="${((0.25 * PT) / k).toFixed(4)}"`);
  return { art: nest(st.art), cut: nest(cut) };
}

function buildSheet(name, { title, header, grid }) {
  const placedArt = [], placedCut = [];
  let n = 0;
  // header sticker, wide
  const firma = place(load(header, n++), M + 22, M, W - 2 * M - 44, HEADER - GAP);
  placedArt.push(firma.art); placedCut.push(firma.cut);
  const cw = (W - 2 * M) / 3, ch = (H - 2 * M - HEADER) / 4;
  grid.forEach((id, i) => {
    const c = i % 3, r = Math.floor(i / 3);
    const p = place(load(id, n++), M + c * cw + GAP / 2, M + HEADER + r * ch + GAP / 2, cw - GAP, ch - GAP);
    placedArt.push(p.art); placedCut.push(p.cut);
  });
  // backing paper: cream with a thin navy frame and small corner marks
  const frame = `<rect x="2.5" y="2.5" width="${W - 5}" height="${H - 5}" rx="3" fill="none" stroke="${C.navy}" stroke-width="0.6"/>`;
  const dots = [];
  for (let y = 6; y < H; y += 6) for (let x = (y / 6) % 2 ? 6 : 9; x < W; x += 6) dots.push(`<circle cx="${x}" cy="${y}" r="0.35"/>`);
  const bg = `<rect width="${W}" height="${H}" rx="4" fill="${PAPER}"/><g fill="#E6D9BE">${dots.join('')}</g>${frame}`;
  const doc = (inner) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="${W}mm" height="${H}mm" viewBox="0 0 ${W} ${H}">${inner}</svg>`;
  const dir = path.join(ROOT, 'imprenta', name);
  fs.mkdirSync(dir, { recursive: true });
  const art = doc(`<title>${title}</title><g id="fondo">${bg}</g><g id="stickers">${placedArt.join('')}</g>`);
  const cut = doc(`<title>${title} · corte</title>
<g id="CutContour">${placedCut.join('')}</g>
<g id="corte-hoja"><rect x="0" y="0" width="${W}" height="${H}" rx="4" fill="none" stroke="#00AEEF" stroke-width="${0.25 * PT}"/></g>`);
  fs.writeFileSync(path.join(dir, `${name}.svg`), art);
  fs.writeFileSync(path.join(dir, `${name}_corte.svg`), cut);
  const png = new Resvg(art, { fitTo: { mode: 'width', value: 1600 } }).render().asPng();
  fs.writeFileSync(path.join(ROOT, 'revision', `${name}.png`), png);
  // overlay preview: art + cut lines, to check spacing
  const both = doc(`<g>${bg}</g>${placedArt.join('')}${placedCut.join('').replace(/stroke="#EC008C" stroke-width="[^"]*"/g, 'stroke="#EC008C" stroke-width="2"')}`);
  fs.writeFileSync(path.join(ROOT, 'revision', `${name}-corte.png`), new Resvg(both, { fitTo: { mode: 'width', value: 1600 } }).render().asPng());
  console.log('ok', name, placedArt.length, 'stickers');
}

for (const [name, spec] of Object.entries(SHEETS)) buildSheet(name, spec);
