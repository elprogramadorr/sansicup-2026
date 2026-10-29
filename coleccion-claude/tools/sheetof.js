// Quick review sheet: node sheetof.js <out.png> <id> <id> ...
const sharp = require('sharp');
const [, , out, ...ids] = process.argv;
(async () => {
  const cell = 560, cols = 3, tiles = [];
  for (let i = 0; i < ids.length; i++) {
    tiles.push({ input: await sharp(`../revision/${ids[i]}-grande.png`).resize(cell - 20, cell - 20, { fit: 'contain', background: '#E8E4DA' }).png().toBuffer(), left: (i % cols) * cell + 10, top: Math.floor(i / cols) * cell + 10 });
  }
  await sharp({ create: { width: cols * cell, height: Math.ceil(ids.length / cols) * cell, channels: 3, background: '#E8E4DA' } }).composite(tiles).png().toFile(out);
})();
