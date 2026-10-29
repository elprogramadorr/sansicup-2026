// Likeness study: render one character part big next to its reference photo.
// node study.js <module> <fn> '<json opts>' <photo> <crop x,y,w,h> <viewBox x,y,w,h> <out>
const fs = require('fs');
const sharp = require('sharp');
const { Resvg } = require('@resvg/resvg-js');
const [, , mod, fn, opts, photo, crop, vb, out] = process.argv;
(async () => {
  const part = require('./' + mod)[fn](JSON.parse(opts || '{}'));
  const svgInner = typeof part === 'string' ? part : part.svg;
  const [vx, vy, vw, vh] = vb.split(',').map(Number);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}">${svgInner}</svg>`;
  const art = new Resvg(svg, { fitTo: { mode: 'height', value: 700 }, background: '#E8E4DA' }).render().asPng();
  const [cx, cy, cw, ch] = crop.split(',').map(Number);
  const ref = await sharp(photo).extract({ left: cx, top: cy, width: cw, height: ch }).resize({ height: 700 }).png().toBuffer();
  const ra = await sharp(ref).metadata(), aa = await sharp(art).metadata();
  await sharp({ create: { width: ra.width + aa.width + 60, height: 740, channels: 3, background: '#E8E4DA' } })
    .composite([{ input: ref, left: 20, top: 20 }, { input: art, left: ra.width + 40, top: 20 }]).png().toFile(out);
})();
