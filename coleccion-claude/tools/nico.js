// Nico, from referencias/nico/*: hood up, calm "cool" face, thin mustache and
// goatee, black Andean poncho with white woven bands (chakana motifs) edged by
// colored stripes, fringe at the hem, ICPC badge on a lanyard, thumbs up.
// Chibi proportions, centered on x = 520.
const { C, textPath } = require('./lib');
const K = require('./kit');

const SKIN = '#C98F68', SKIN_SHADE = '#A9704C', HAIR = '#1E1E26', PONCHO = '#2A2A33', PONCHO_SHADE = '#1C1C24', WOOL = '#F1ECE2';
const STRIPES = [C.red, C.orange, C.yellow, C.royal, C.green];

// Stepped Andean cross centered at (x, y), arm unit u
function chakana(x, y, u) {
  const p = [[-1, -3], [1, -3], [1, -1], [3, -1], [3, 1], [1, 1], [1, 3], [-1, 3], [-1, 1], [-3, 1], [-3, -1], [-1, -1]]
    .map(([a, b]) => `${(x + a * u).toFixed(1)},${(y + b * u).toFixed(1)}`);
  return `<path d="M${p.join(' L')} Z" fill="${PONCHO}"/><rect x="${x - u * 0.5}" y="${y - u * 0.5}" width="${u}" height="${u}" fill="${WOOL}"/>`;
}

// Stylized llama facing left, centered at (x, y), scale s
function llama(x, y, s) {
  const pts = [[-12, -26], [-9, -20], [-6, -26], [-3, -18], [-2, -4], [12, -5], [17, -1], [17, 9], [14, 9], [14, 20], [10, 20], [10, 10], [-1, 10], [-1, 20], [-5, 20], [-5, 4], [-9, -12], [-15, -12], [-15, -18]];
  return `<path d="M${pts.map(([a, b]) => `${(x + a * s).toFixed(1)},${(y + b * s).toFixed(1)}`).join(' L')} Z" fill="${PONCHO}"/>`;
}

// Vertical woven band between x0..x1 (top) and xb0..xb1 (bottom)
function band(x0, x1, xb0, xb1, y0, y1, seed) {
  const d = `M${x0},${y0} L${x1},${y0} L${xb1},${y1} L${xb0},${y1} Z`;
  let s = K.shape(d, WOOL, { line: 0 });
  // colored edge stripes
  const edge = (a, b, ab, bb, col) => `<path d="M${a},${y0} L${b},${y0} L${bb},${y1} L${ab},${y1} Z" fill="${col}"/>`;
  const w = 7;
  STRIPES.slice(0, 3).forEach((col, i) => {
    s += edge(x0 - (i + 1) * w, x0 - i * w, xb0 - (i + 1) * w, xb0 - i * w, col);
    s += edge(x1 + i * w, x1 + (i + 1) * w, xb1 + i * w, xb1 + (i + 1) * w, STRIPES[(i + seed) % STRIPES.length]);
  });
  // motifs down the band
  const n = 4;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, y = y0 + (y1 - y0) * t;
    const cx = (x0 + x1) / 2 + ((xb0 + xb1) / 2 - (x0 + x1) / 2) * t;
    s += i % 2 === 0 ? chakana(cx, y, 9) : llama(cx, y, 1.7);
  }
  return s;
}

function nico({ thumb = true } = {}) {
  const hood = 'M520,36 C618,36 690,104 704,206 C716,290 704,350 686,392 L354,392 C336,350 324,290 336,206 C350,104 422,36 520,36 Z';
  const hoodIn = 'M520,92 C596,92 648,152 652,240 C656,310 628,372 520,384 C412,372 384,310 388,240 C392,152 444,92 520,92 Z';
  const face = 'M520,118 C594,118 638,172 640,244 C642,308 614,358 564,380 C546,388 494,388 476,380 C426,358 398,308 400,244 C402,172 446,118 520,118 Z';
  const fringe = 'M404,226 C402,160 452,112 522,110 C592,112 640,158 638,222 C626,204 610,190 592,182 C574,194 548,198 520,194 C500,192 480,186 462,190 C440,198 420,212 404,226 Z';
  const poncho = 'M370,372 C306,392 226,438 196,520 C184,560 178,640 174,756 L866,756 C862,640 856,560 844,520 C814,438 734,392 670,372 C640,396 586,410 520,410 C454,410 400,396 370,372 Z';
  const neck = 'M470,360 C480,392 560,392 570,360 L574,406 C556,418 484,418 466,406 Z';
  // hand: fist + thumb up, at the viewer's right
  const fist = 'M664,560 C664,532 690,520 716,522 L752,526 C770,530 776,546 772,562 C780,572 778,588 768,594 C774,606 768,620 756,624 L700,628 C676,628 664,612 664,592 Z';
  const thumbD = 'M716,524 C712,500 714,468 726,452 C736,440 752,444 752,460 C752,480 744,504 748,526 Z';
  const lanyard = K.stroke('M462,390 C470,450 490,500 512,536', 12, C.royal) + K.stroke('M578,390 C570,450 550,500 528,536', 12, C.royal);
  const badge = 'M486,530 L554,530 C560,530 564,534 564,540 L564,616 C564,622 560,626 554,626 L486,626 C480,626 476,622 476,616 L476,540 C476,534 480,530 486,530 Z';
  const icpc = textPath('ICPC', { fontName: 'BarlowCondensed-Black', size: 30, x: 520, y: 600, anchor: 'middle' });
  // fringe at the hem: alternating colored strands
  let hem = '';
  for (let x = 184, i = 0; x <= 856; x += 16, i++) {
    hem += K.stroke(`M${x},752 L${x + (i % 2 ? 3 : -3)},${800 + (i % 3) * 6}`, 9, i % 4 === 0 ? C.red : i % 4 === 2 ? C.yellow : PONCHO);
  }
  const eyes = [470, 570].map((x, i) => {
    const almond = `M${x - 24},264 C${x - 12},252 ${x + 12},250 ${x + 24},260 C${x + 14},272 ${x - 14},274 ${x - 24},264 Z`;
    return K.shape(almond, C.white, { line: 0 }) +
      K.clipped(almond, `<circle cx="${x + 2}" cy="263" r="12" fill="${HAIR}"/><circle cx="${x + 6}" cy="259" r="4" fill="${C.white}"/>`) +
      K.stroke(`M${x - 26},${262} C${x - 12},${250} ${x + 12},${248} ${x + 26},${258}`, 8, HAIR) +
      K.stroke(`M${x - 28},${226 + (i ? 4 : 0)} C${x - 10},${220} ${x + 10},${220} ${x + 26},${226 + (i ? 0 : 4)}`, 14, HAIR);
  }).join('');
  const beard = 'M486,364 C496,384 544,384 554,364 C548,376 536,382 520,382 C504,382 492,376 486,364 Z';
  const svg = `
    ${K.silhouette([poncho, hood])}
    ${hem}
    ${K.shape(poncho, PONCHO)}
    ${K.clipped(poncho, K.shape('M196,520 C214,600 236,690 250,760 L170,760 L170,520 Z', PONCHO_SHADE, { line: 0 }))}
    ${K.clipped(poncho, band(378, 466, 300, 412, 380, 756, 1) + band(574, 662, 628, 740, 380, 756, 3))}
    ${K.shape(poncho, 'none')}
    ${K.shape(hood, PONCHO)}
    ${K.shape(hoodIn, PONCHO_SHADE, { line: 0 })}
    ${K.shape(neck, SKIN_SHADE, { line: 0 })}
    ${K.shape(face, SKIN)}
    ${K.clipped(face, K.shape('M400,200 C420,300 470,360 540,384 L400,384 Z', SKIN_SHADE, { line: 0 }))}
    ${K.shape(fringe, HAIR, { line: 0 })}
    ${eyes}
    ${K.stroke('M520,282 C514,300 512,312 522,316', 7, SKIN_SHADE)}
    ${K.shape('M490,332 C502,324 514,326 520,329 C526,326 538,324 550,332 C538,335 530,335 520,334 C510,335 502,335 490,332 Z', HAIR, { line: 0 })}
    ${K.stroke('M502,348 C514,351 528,351 540,346', 7, '#5A3A2A')}
    ${K.shape(beard, HAIR, { line: 0 })}${K.shape('M506,360 C512,372 528,372 534,360 C526,364 514,364 506,360 Z', HAIR, { line: 0 })}
    ${lanyard}
    ${K.halo([badge], K.OUT * 2 + 8)}${K.shape(badge, C.white)}
    <path d="M476,540 C476,534 480,530 486,530 L554,530 C560,530 564,534 564,540 L564,556 L476,556 Z" fill="${C.royal}"/>
    <path d="${icpc.d}" fill="${C.navy}"/>
    ${thumb ? K.popped([thumbD, fist], SKIN) + K.stroke('M676,570 L756,566', 6, SKIN_SHADE) + K.stroke('M680,596 L760,592', 6, SKIN_SHADE) : ''}
  `;
  return svg;
}

module.exports = { nico };
