// Traces the official UMSS crest (referencias/marcas-oficiales/umss-escudo-oficial.png)
// into two ink layers (navy, red) → escudo.json. Thin emblem lines are marked
// so the sticker can thicken them for print.
const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');
const SRC = '../../referencias/marcas-oficiales/umss-escudo-oficial.png';
const W = 1275;
const trace = (buf) => new Promise((res, rej) => potrace.trace(buf, { turdSize: 4, optTolerance: 0.2, alphaMax: 1.0, threshold: 128 }, (e, s) => (e ? rej(e) : res(s))));
(async () => {
  const { data, info } = await sharp(SRC).flatten({ background: '#ffffff' }).resize({ width: W }).raw().toBuffer({ resolveWithObject: true });
  const mask = (tr, tg, tb, tol) => {
    const out = Buffer.alloc(info.width * info.height);
    for (let i = 0, p = 0; i < data.length; i += info.channels, p++) {
      const d = Math.hypot(data[i] - tr, data[i + 1] - tg, data[i + 2] - tb);
      out[p] = d < tol ? 0 : 255;
    }
    return sharp(out, { raw: { width: info.width, height: info.height, channels: 1 } }).png().toBuffer();
  };
  const navy = (await trace(await mask(0, 57, 117, 120))).match(/ d="([^"]*)"/)[1];
  const red = (await trace(await mask(237, 28, 36, 120))).match(/ d="([^"]*)"/)[1];
  fs.writeFileSync('escudo.json', JSON.stringify({ width: info.width, height: info.height, navy, red }));
  console.log('ok', info.width, info.height, navy.length, red.length);
})();
