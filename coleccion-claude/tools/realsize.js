// Real-size proof: every sticker at its smallest printable size, 300 dpi,
// on a light sheet (one image, rows of 7). Check with zoom = 100% on screen
// ≈ 1.2× real size on most laptops.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');
const { ROOT } = require('./lib');
const DPI = 300, mm = (v) => Math.round((v / 25.4) * DPI);
(async () => {
  const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
  const pad = mm(5);
  const tiles = [];
  // shelf layout: each sticker takes its own width at real size
  let x = pad, y = pad, rowH = 0;
  const W = mm(400);
  for (let i = 0; i < man.length; i++) {
    const m = man[i];
    let svg = fs.readFileSync(path.join(ROOT, 'svg', m.id + '.svg'), 'utf8');
    svg = svg.slice(0, svg.indexOf('<g id="CutContour"')) + '</svg>';
    const vb = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const long = mm(m.sizes[0] * 10);
    const fit = vb[2] >= vb[3] ? { mode: 'width', value: long } : { mode: 'height', value: long };
    const png = new Resvg(svg, { fitTo: fit }).render().asPng();
    const meta = await sharp(png).metadata();
    if (x + meta.width > W) { x = pad; y += rowH + pad; rowH = 0; }
    tiles.push({ input: png, left: x, top: y });
    x += meta.width + pad; rowH = Math.max(rowH, meta.height);
  }
  await sharp({ create: { width: W, height: y + rowH + pad, channels: 3, background: '#D9D4C8' } })
    .composite(tiles).withMetadata({ density: DPI }).png().toFile(path.join(ROOT, 'revision', 'prueba-tamano-real-300dpi.png'));
  console.log('ok');
})();
