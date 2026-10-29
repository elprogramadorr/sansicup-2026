// Likeness sheet for the gallery: reference photos → character crops.
const path = require('path');
const sharp = require('sharp');
const { ROOT } = require('./lib');
const REF = path.join(ROOT, '..', 'referencias');
const H = 340, BG = '#E8E4DA', PHOTO_W = 16 + 2 * (354 + 12), SLOT = 420;
// [photo, crop {left, top, width, height}] and sticker crops as fractions of the big render
const ROWS = [
  { name: 'Perrito', photos: [['mascotas/perrito-chaqueta-original.jpg', { left: 30, top: 240, width: 540, height: 520 }], ['icpc-umss/perrito-malvado-original.png', { left: 10, top: 60, width: 140, height: 150 }]],
    stickers: [['03-sansicup-perrito', [0.2, 0.02, 0.6, 0.42]], ['08-perritos-malvados', [0.14, 0.0, 0.72, 0.5]]] },
  { name: 'Gatita', photos: [['mascotas/gatita-tricolor-original.jpg', { left: 70, top: 250, width: 440, height: 440 }]],
    stickers: [['04-sansicup-gatita', [0.06, 0.0, 0.62, 0.4]], ['11-bandida', [0.12, 0.0, 0.76, 0.56]]] },
  { name: 'Galano', photos: [['mascotas/loro-original-2.jpg', { left: 70, top: 252, width: 436, height: 436 }]],
    stickers: [['02-sansicup-galano', [0.28, 0.0, 0.62, 0.38]], ['12-bandido', [0.16, 0.0, 0.76, 0.48]]] },
  { name: 'Nico', photos: [['nico/nico-poncho-globos-original.png', { left: 240, top: 520, width: 760, height: 780 }]],
    stickers: [['14-que-waso', [0.14, 0.02, 0.72, 0.66]]] },
];
(async () => {
  const comps = [];
  let y = 16, maxW = 0;
  for (const row of ROWS) {
    let x = 16;
    for (const [file, crop] of row.photos) {
      const b = await sharp(path.join(REF, file)).extract(crop).resize({ height: H }).png().toBuffer();
      const w = (await sharp(b).metadata()).width;
      comps.push({ input: b, left: x, top: y }); x += w + 12;
    }
    x = PHOTO_W + 40;
    for (const [id, [fx, fy, fw, fh]] of row.stickers) {
      const src = path.join(ROOT, 'revision', id + '-grande.png');
      const m = await sharp(src).metadata();
      const crop = { left: Math.round(fx * m.width), top: Math.round(fy * m.height), width: Math.round(fw * m.width), height: Math.round(fh * m.height) };
      const b = await sharp(src).extract(crop).resize({ width: SLOT, height: H, fit: 'contain', background: BG }).png().toBuffer();
      comps.push({ input: b, left: x, top: y }); x += SLOT + 12;
    }
    maxW = Math.max(maxW, PHOTO_W + 40 + 2 * (SLOT + 12)); y += H + 16;
  }
  await sharp({ create: { width: maxW + 4, height: y, channels: 3, background: BG } }).composite(comps).png().toFile(path.join(ROOT, 'revision', 'parecido-fotos.png'));
  console.log('ok');
})();
