// Render a region of a sticker SVG at high zoom: node zoom.js <svg> <x> <y> <w> <h> <out>
const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');
const [, , file, x, y, w, h, out] = process.argv;
let svg = fs.readFileSync(file, 'utf8').replace(/viewBox="[^"]*"/, `viewBox="${x} ${y} ${w} ${h}"`).replace(/width="[^"]*mm" height="[^"]*mm"/, '');
svg = svg.replace(/<g id="CutContour"[\s\S]*?<\/g>/, '');
fs.writeFileSync(out, new Resvg(svg, { fitTo: { mode: 'width', value: 900 }, background: '#E8E4DA' }).render().asPng());
