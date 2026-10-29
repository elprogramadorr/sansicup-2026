// Side-by-side: reference photo | sticker, for likeness review.
const sharp = require('sharp');
const path = require('path');
const [, , ref, png, out] = process.argv;
(async () => {
  const H = 700;
  const a = await sharp(ref).resize({ height: H, width: 600, fit: 'contain', background: '#E8E4DA' }).png().toBuffer();
  const b = await sharp(png).resize({ height: H, width: 700, fit: 'contain', background: '#E8E4DA' }).png().toBuffer();
  await sharp({ create: { width: 1340, height: H + 40, channels: 3, background: '#E8E4DA' } })
    .composite([{ input: a, left: 20, top: 20 }, { input: b, left: 620, top: 20 }]).png().toFile(out);
})();
