// Exclusive set for SanSi Cup 2026: SanSi Cup pieces, creative ICPC, Codeforces,
// Juki Judge, programmer and vibe-coding jokes, and the reggaeton bunny.
// Called from stickers.js with its composition helpers.
const { C, textPath } = require('./lib');
const K = require('./kit');
const T = require('./type');
const { signature } = require('./lettering');
const { trophy, balloon, laptop } = require('./props');
const P2 = require('./props2');
const parrot = require('./parrot');
const dog = require('./dog');
const cat = require('./cat');
const juki = require('./juki');
const bunny = require('./bunny');

// Gallery section for each exclusive sticker (by number)
const GROUP = (n) => (n <= 25 ? 'ex-sansi' : n <= 28 ? 'ex-icpc' : n <= 32 ? 'ex-cf' : n <= 37 ? 'ex-prog' : 'ex-reggaeton');

module.exports = function exclusivos({ add: addRaw, phrase, place, BOUNCE, LIFT }) {
  const add = (id, title, art, o) => addRaw(id, title, art, { ...o, group: GROUP(+id.slice(0, 2)) });
  const G = (tf, inner) => `<g transform="${tf}">${inner}</g>`;
  const at = (cx, cy, k, nx = 540, ny = 300) => `translate(${(cx - k * nx).toFixed(1)} ${(cy - k * ny).toFixed(1)}) scale(${k})`;
  const head = (h) => K.silhouette(h.outline) + h.svg;
  const WORD = 0.16;
  const line = (text, o) => {
    const fontName = o.fontName || 'BagelFatOne-Regular';
    const size = o.size || T.fit(text, { fontName, width: o.width, wordSpace: WORD });
    return T.line(text, { fontName, ...o, size, wordSpace: WORD * size });
  };
  // x-span (canvas) from the first `from` char to the last `to` char of a
  // Bagel line fitted to `width` and centered on x = 520 → [x0, x1, size]
  const span = (text, from, to, width) => {
    const fontName = 'BagelFatOne-Regular';
    const size = T.fit(text, { fontName, width, wordSpace: WORD });
    const L = T.layout(text, { fontName, size, wordSpace: WORD * size });
    // layout skips spaces, so map glyphs back to their character index
    let n = -1;
    const idx = L.glyphs.map((g) => (n = text.indexOf(g.ch, n + 1)));
    const a = L.glyphs[idx.indexOf(text.indexOf(from))], b = L.glyphs[idx.indexOf(text.lastIndexOf(to))];
    return [520 - L.width / 2 + a.x0, 520 - L.width / 2 + b.x1, size];
  };

  const ex = (o) => ({ sizes: [4, 6, 8], ...o });

  // ------------------------------------------------------------ SanSi Cup
  add('23-sansicup-banderin', 'SanSi Cup · banderín', () => {
    const name = T.line('SANSI CUP', { fontName: 'Graduate-Regular', size: T.fit('SANSI CUP', { fontName: 'Graduate-Regular', width: 560, tracking: 6 }), x: 430, y: 380, tracking: 6 });
    const year = T.line('2026', { fontName: 'Graduate-Regular', size: 70, x: 430, y: 470, tracking: 14 });
    const inner = T.chunky(name, { fill: C.white, shade: C.red, extrude: [0, 14], inline: 0, haloW: 0 }) +
      T.chunky(year, { fill: C.yellow, shade: C.goldShade, extrude: [0, 8], haloW: 0 });
    return `<g transform="rotate(-6 520 400)">${P2.pennant(40, 170, 940, 420, C.navy, inner)}</g>` +
      trophy(120, 170, 190, -10) + K.sparkle(890, 160, 30, C.yellow) + K.sparkle(940, 220, 15, C.white);
  }, ex({ note: 'Banderín de fieltro varsity, con costura y copa.' }));

  add('24-sansicup-ticket', 'SanSi Cup · entrada', () => {
    const small = (s, x, y, size, fill, o = {}) => `<path d="${textPath(s, { fontName: 'BarlowCondensed-Black', size, x, y, anchor: 'middle', tracking: 3, ...o }).d}" fill="${fill}"/>`;
    const stubText = `<g transform="translate(905 410) rotate(-90)">${small('ROUND 01', 0, 0, 58, C.navy)}${small('Nº 0026', 0, 56, 40, C.navy)}</g>`;
    const bars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<rect x="${110 + i * 15 + (i % 3) * 4}" y="590" width="${[6, 10, 4, 8][i % 4]}" height="44" fill="${C.navy}"/>`).join('');
    const inner = small('ADMIT ONE · ADMITE UNO', 410, 250, 44, C.navy) +
      `<g transform="translate(118 268) scale(0.6)">${signature({ drop: 10 })}</g>` + bars +
      small('COCHABAMBA · BOLIVIA', 590, 630, 32, C.navy) + stubText;
    return `<g transform="rotate(-5 520 420)">${P2.ticket(30, 190, 980, 460, 220, '#F4EBD8', inner)}</g>` + K.sparkle(60, 170, 26, C.yellow);
  }, ex({ note: 'La entrada al torneo, con la firma y talón troquelado.' }));

  add('25-sansicup-cartucho', 'SanSi Cup · cartucho', () => {
    const x = 210, y = 40, w = 620, h = 780;
    const label = P2.rrect(x + 56, y + 110, w - 112, h - 250, 26);
    const title = T.line('SANSI CUP', { fontName: 'BagelFatOne-Regular', size: T.fit('SANSI CUP', { fontName: 'BagelFatOne-Regular', width: 440 }), x: x + w / 2, y: y + 230, bounce: BOUNCE, lift: LIFT });
    const heads = G(at(x + 150, y + 400, 0.33, 540, 290), head({ outline: [], svg: dog.dogHead({ expr: 'happy', tilt: 0 }).svg })) +
      G(at(x + 312, y + 375, 0.3, 547, 245), head(parrot.parrotHead({ expr: 'happy' }))) +
      G(at(x + 470, y + 400, 0.31, 520, 260), head(cat.catHead({ expr: 'stern' })));
    const t = (s, cx, cy, size, fill) => `<path d="${textPath(s, { fontName: 'BarlowCondensed-Black', size, x: cx, y: cy, anchor: 'middle', tracking: 3 }).d}" fill="${fill}"/>`;
    const badge = P2.rrect(x + w / 2 - 120, y + 512, 240, 62, 16);
    const inner = `<path d="${label}" fill="${C.navy}"/>` + K.clipped(label, K.halftone(label, '#24357F', { box: [x + 56, y + 110, x + w - 56, y + h - 140], spacing: 18, from: 1, to: 1, rmax: 4 })) +
      T.chunky(title, { fill: C.yellow, shade: C.red, extrude: [0, 12], haloW: 0 }) + heads +
      `<path d="${badge}" fill="${C.red}"/>` + t('1-3 PLAYERS', x + w / 2, y + 556, 40, C.white) +
      t('COMPETITIVE EDITION', x + w / 2, y + 622, 36, C.yellow) + t('2026', x + w / 2, y + 290, 46, C.white);
    return P2.cartridge(x, y, w, h, '#C9CED8', inner) + K.sparkle(860, 90, 30, C.yellow) + K.sparkle(170, 250, 18, C.white);
  }, ex({ note: 'Cartucho retro: equipos de 1 a 3 jugadores, como el ICPC.', sizes: [5, 6, 8] }));

  // ------------------------------------------------------------ ICPC
  add('26-icpc-globos', 'ICPC · globos', () => {
    const knot = [520, 700];
    const b = [[220, 300, C.red, 'I', -14], [415, 190, C.yellow, 'C', -5], [625, 190, C.royal, 'P', 5], [820, 300, C.green, 'C', 14]];
    const strings = b.map(([x, y]) => `C${(x + knot[0]) / 2},${y + 260} ${knot[0]},${knot[1] - 140} ${knot[0]},${knot[1]}`);
    const bow = 'M520,700 C470,660 430,690 446,724 C462,752 500,728 520,700 Z M520,700 C570,660 610,690 594,724 C578,752 540,728 520,700 Z';
    const P = phrase([{ text: 'ALL ACCEPTED', y: 880, width: 760, fill: C.white, shade: C.green, ex: [0, 16], bounce: BOUNCE, lift: LIFT }]);
    return b.map(([x, y, c, l, tl], i) => balloon(x, y, 118, c, { letter: l, tilt: tl, string: strings[i], letterColor: c === C.yellow ? C.navy : C.white })).join('') +
      K.popped([bow], C.red) + K.shape(K.circle(520, 704, 16), C.red) + P.svg + K.sparkle(110, 140, 26, C.yellow) + K.sparkle(940, 150, 22, C.yellow);
  }, ex({ note: 'ICPC deletreado con los globos de colores: todo aceptado.' }));

  add('27-icpc-1pc-3cerebros', 'ICPC · 1 PC, 3 cerebros', () => {
    const P = phrase([
      { text: '1 PC', y: 900, width: 300, fill: C.yellow, shade: C.red, ex: [0, 14], bounce: BOUNCE, lift: LIFT },
      { text: '3 CEREBROS', y: 1060, width: 860, fill: C.white, shade: C.navyShade, ex: [0, 20], bounce: BOUNCE.slice(2), lift: LIFT.slice(1) },
    ]);
    return G(at(300, 270, 0.55, 540, 300), dog.dogHead({ expr: 'sweet', tilt: 6 }).svg) +
      G(at(782, 272, 0.55, 520, 300), head(cat.catHead({ expr: 'stern' }))) +
      G(at(500, 196, 0.6, 547, 245), head(parrot.parrotHead({ expr: 'smug' }))) +
      laptop(520, 760, 620) +
      dog.paw(246, 350, 1) + dog.paw(360, 350, -1) + cat.paw(716, 350, 44, 36) + cat.paw(826, 350, 44, 36) +
      P.svg;
  }, ex({ note: 'La regla del ICPC: un computador, tres cerebros.' }));

  add('28-icpc-congelado', 'ICPC · scoreboard congelado', () => {
    const rows = [['a', 'a', 'f', 'w', 'f'], ['a', 'w', 'a', 'f', 'f'], ['f', 'a', 'a', 'a', 'f'], ['w', 'f', 'a', 'f', 'a'], ['a', 'a', 'f', 'f', 'w']];
    const P = phrase([
      { text: 'SCOREBOARD', y: 790, width: 820, fill: C.white, shade: '#4AA8D8', ex: [0, 16], bounce: BOUNCE, lift: LIFT },
      { text: 'CONGELADO', y: 950, width: 760, fill: '#BDE8F7', shade: C.navy, ex: [0, 18], bounce: BOUNCE.slice(1), lift: LIFT.slice(2) },
    ]);
    const flake = (x, y, r) => [0, 60, 120].map((a) => K.stroke(`M${x - r * Math.cos(a * Math.PI / 180)},${y - r * Math.sin(a * Math.PI / 180)} L${x + r * Math.cos(a * Math.PI / 180)},${y + r * Math.sin(a * Math.PI / 180)}`, 26, C.ink) + K.stroke(`M${x - r * Math.cos(a * Math.PI / 180)},${y - r * Math.sin(a * Math.PI / 180)} L${x + r * Math.cos(a * Math.PI / 180)},${y + r * Math.sin(a * Math.PI / 180)}`, 12, C.white)).join('');
    return P2.iceBlock(200, 120, 600, 500, P2.scoreboard(250, 180, 540, rows)) +
      G(at(800, 120, 0.42, 547, 245), head(parrot.parrotHead({ expr: 'open' }))) +
      flake(150, 200, 36) + flake(900, 520, 28) + flake(120, 560, 22) + P.svg;
  }, ex({ note: 'La última hora del ICPC: el scoreboard se congela.' }));

  // ------------------------------------------------------------ Codeforces
  add('29-gymrat', 'Gymrat · Codeforces', () => {
    const colors = [P2.CF.yellow, P2.CF.blue, P2.CF.red];
    const word = line('GYMRAT', { width: 880, x: 520, y: 980, bounce: BOUNCE, lift: LIFT });
    const tag = `<path d="${textPath('codeforces.com/gym', { fontName: 'JetBrainsMono-ExtraBold', size: 44, x: 520, y: 1068, anchor: 'middle' }).d}" fill="${C.navy}"/>`;
    const band = 'M330,150 C420,104 660,104 750,150 L744,196 C660,156 420,156 336,196 Z';
    const H = dog.dogHead({ expr: 'happy', tilt: 0 });
    const D = 'translate(0 120)';
    return G(D, dog.jacket() +
      K.limb('M392,470 C330,380 300,240 300,90', 92, C.gray) + K.limb('M688,470 C750,380 780,240 780,90', 92, C.gray) +
      H.svg + K.clipped(H.outline[0], K.shape(band, C.red, { line: 0 }) + K.stroke('M336,170 C420,130 660,130 744,170', 6, C.white)) +
      K.shape('M760,240 C772,262 772,280 760,290 C748,280 748,262 760,240 Z', '#8FD3F4', { line: 6 }) +
      K.shape('M318,280 C328,300 328,316 318,324 C308,316 308,300 318,280 Z', '#8FD3F4', { line: 6 })) +
      P2.barbell(540, 190, 960) + G(D, dog.paw(300, 70, 1) + dog.paw(780, 70, -1)) +
      T.chunky(word, { fills: colors, shade: C.navy, extrude: [0, 22] }) + tag;
  }, ex({ note: 'Para quien vive en el Gym de Codeforces. Las pesas son el logo.' }));

  add('30-dont-vibe-code', 'I don’t vibe code, I do Codeforces', () => {
    const l1 = line("I DON'T", { width: 430, x: 520, y: 660, bounce: BOUNCE, lift: LIFT });
    const l2 = line('VIBE CODE,', { width: 780, x: 520, y: 810, bounce: BOUNCE.slice(2), lift: LIFT.slice(1) });
    const l3 = line('I DO', { width: 230, x: 520, y: 950, bounce: BOUNCE, lift: LIFT });
    const l4 = line('CODEFORCES', { width: 920, x: 520, y: 1120, bounce: BOUNCE.slice(1), lift: LIFT.slice(2) });
    const top = T.bounds(l1).y0;
    const [sx0, sx1, sz] = span('VIBE CODE,', 'V', 'E', 780);
    const sy = 810 - sz * 0.36;
    const sd = `M${sx0 - 14},${sy + 12} L${sx1 + 14},${sy - 12}`;
    return G(place(520, 702, 470, top - 16, 0.82), cat.cat({ expr: 'stern' })) +
      P2.cfLogo(690, top - 30, 300) +
      T.chunky(l1, { fill: C.white, shade: C.navyShade, extrude: [0, 14] }) +
      T.chunky(l2, { fill: '#8FD3F4', shade: C.turqShade, extrude: [0, 16] }) +
      K.stroke(sd, 10 + 14, C.white) + K.stroke(sd, 10 + 8, C.ink) + K.stroke(sd, 10, C.red) +
      T.chunky(l3, { fill: C.white, shade: C.navyShade, extrude: [0, 12] }) +
      T.chunky(l4, { fills: [P2.CF.yellow, P2.CF.blue, P2.CF.red], shade: C.navy, extrude: [0, 20] });
  }, ex({ note: 'La gatita no confía en el vibe coding. Con el logo de Codeforces.' }));

  // ------------------------------------------------------------ Juki Judge
  add('31-juki-judge', 'Juki Judge · Accepted', () => {
    const H = juki.jukiHead({ expr: 'open' });
    const word = T.line('JUKI JUDGE', { fontName: 'Graduate-Regular', size: T.fit('JUKI JUDGE', { fontName: 'Graduate-Regular', width: 900, tracking: 6 }), x: 520, y: 1000, tracking: 6, arch: 26 });
    return juki.confetti([['ring', 150, 330, 1.2], ['tri', 890, 360, 1.2, -20], ['squig', 140, 600, 1], ['stick', 900, 600, 1.1], ['stick', 300, 40, 0.9, 30]]) +
      K.silhouette([juki.ROBE]) + juki.jukiRobe() +
      juki.sleeve('M372,490 C300,420 250,320 236,230') + juki.sleeve('M708,490 C780,420 830,320 844,230') +
      K.silhouette(H.outline) + H.svg +
      juki.gavel(196, 120, -28, 0.95) + trophy(850, 236, 230, 8, { sparkles: true }) +
      juki.paw(236, 214, 42) + juki.paw(844, 214, 42) +
      P2.stamp(540, 690, 'ACCEPTED', { color: '#2E9E5B', rot: -7, w: 520, h: 140, size: 100 }) +
      T.chunky(word, { fill: C.navy, shade: C.red, extrude: [0, 20], inline: 7 });
  }, ex({ note: 'El juez de Juki dicta veredicto: Accepted. Copa en una mano, martillo en la otra.' }));

  add('32-juki-coach', 'Coach Juki', () => {
    const H = juki.jukiHead({ expr: 'smile' });
    const word = line('COACH JUKI', { width: 900, x: 520, y: 1060, bounce: BOUNCE, lift: LIFT });
    const team = G(at(250, 730, 0.5, 540, 290), dog.dogHead({ expr: 'sweet', tilt: -4 }).svg) +
      G(at(800, 740, 0.5, 520, 260), head(cat.catHead({ expr: 'stern' }))) +
      G(at(530, 712, 0.52, 547, 245), head(parrot.parrotHead({ expr: 'happy' })));
    return G('translate(40 -20) scale(0.86)',
      K.silhouette([juki.ROBE]) + juki.jukiRobe() +
      juki.sleeve('M708,490 C790,430 850,330 860,240') +
      K.silhouette(H.outline) + H.svg +
      K.stroke('M478,420 C470,470 486,520 520,540', 7, C.red) + P2.whistle(512, 540, 1) +
      P2.clipboard(820, 120, 230, 290, 10) + juki.paw(864, 236, 42) +
      juki.confetti([['ring', 210, 200, 1], ['tri', 260, 470, 0.9, 10]])) +
      team + T.chunky(word, { fill: C.yellow, shade: C.navy, extrude: [0, 20] });
  }, ex({ note: 'Juki entrena al equipo: el perrito, Galano y la gatita.' }));

  // ------------------------------------------------------------ Programmer
  add('33-long-long', 'No por nada uso long long', () => {
    const P = phrase([
      { text: 'NO POR NADA', y: 790, width: 600, fill: C.white, shade: C.lilacShade, ex: [0, 14], bounce: BOUNCE, lift: LIFT },
      { text: 'USO LONG LONG', y: 960, width: 940, fill: C.lilac, shade: C.lilacShade, ex: [0, 22], bounce: BOUNCE.slice(1), lift: LIFT.slice(2) },
    ]);
    return G(place(520, 702, 360, P.top - 10, 0.66), cat.cat({ expr: 'evil' })) +
      P2.eggplant(700, 110, 560, 18) + P.svg +
      K.sparkle(860, 150, 26, C.yellow) + K.sparkle(250, 230, 18, C.yellow);
  }, ex({ note: 'Con berenjena y la gatita con cara de saber exactamente lo que dice.' }));

  add('34-segfault', 'Segmentation fault', () => {
    const P = phrase([
      { text: 'SEGMENTATION', y: 830, width: 920, fill: C.white, shade: C.red, ex: [0, 18], bounce: BOUNCE, lift: LIFT },
      { text: 'FAULT', y: 990, width: 460, fill: C.red, shade: C.navyShade, ex: [0, 20], bounce: BOUNCE.slice(2), lift: LIFT },
    ]);
    const table = P2.rrect(150, 640, 560, 46, 14);
    const motion = [0, 1, 2].map((i) => K.stroke(`M${660 + i * 30},${300 + i * 36} C${700 + i * 30},${280 + i * 36} ${740 + i * 30},${300 + i * 36} ${770 + i * 30},${330 + i * 36}`, 9, C.ink)).join('');
    const tag = `<path d="${textPath('(core dumped)', { fontName: 'JetBrainsMono-ExtraBold', size: 46, x: 520, y: 1070, anchor: 'middle' }).d}" fill="${C.navy}"/>`;
    return K.popped([table], '#C98A4B') +
      G(place(520, 800, 380, 650, 0.62), cat.cat({ expr: 'serene' })) +
      K.limb('M500,520 C560,500 620,470 660,430', 54) + cat.paw(668, 424, 34, 28) +
      `<g transform="rotate(32 830 470)">${laptop(830, 560, 260)}</g>` + motion +
      K.sparkle(930, 640, 20, C.yellow) + P.svg + tag;
  }, ex({ note: 'La gatita bota la laptop de la mesa: core dumped.' }));

  add('35-ac-en-mi-maquina', 'AC en mi máquina', () => {
    const P = phrase([
      { text: 'AC EN MI', y: 800, width: 560, fill: '#7ED39B', shade: C.navyShade, ex: [0, 10], bounce: [-3, 0, 2, -2, 2, -2, 3, -2], lift: [0, 0, -4, 4, -4, 4, 0, 2] },
      { text: 'MÁQUINA', y: 1010, width: 760, fill: C.white, shade: '#2E9E5B', ex: [0, 20], bounce: BOUNCE.slice(1), lift: LIFT.slice(2) },
    ]);
    const scr = P2.rrect(250, 300, 540, 340, 30), inner = P2.rrect(278, 328, 484, 284, 16);
    const base = 'M200,640 H840 L900,700 Q906,716 890,716 H150 Q134,716 140,700 Z';
    const screen = K.popped([scr], '#3B4150') + `<path d="${inner}" fill="#E9F7EE"/>` +
      K.stroke('M420,470 L490,540 L630,390', 34 + K.OUT * 2, C.ink) + K.stroke('M420,470 L490,540 L630,390', 34, '#2E9E5B') +
      K.popped([base], C.gray) + K.stroke('M300,676 H740', 8, C.grayShade);
    return G(at(520, 230, 0.6, 540, 300), dog.dogHead({ expr: 'sweet', tilt: 0 }).svg) + screen +
      dog.paw(330, 296, 1) + dog.paw(710, 296, -1) +
      P2.stamp(800, 230, 'WA', { color: C.red, rot: 14, w: 210, h: 130, size: 104 }) + P.svg;
  }, ex({ note: 'Pasa todos los casos locales… y el juez dice Wrong Answer.' }));

  // ------------------------------------------------------------ Vibe coding
  add('36-stochastic-parrot', 'Stochastic parrot', () => {
    const P = phrase([
      { text: 'STOCHASTIC', y: 860, width: 900, fill: C.white, shade: C.turqShade, ex: [0, 18], bounce: BOUNCE, lift: LIFT },
      { text: 'PARROT', y: 1020, width: 620, fill: C.turq, shade: C.navyShade, ex: [0, 20], bounce: BOUNCE.slice(2), lift: LIFT.slice(1) },
    ]);
    const code = [[0, 140, C.red], [1, 230, C.royal], [2, 170, C.green], [3, 90, C.lilacShade]].map(([r, w, c]) =>
      `<path d="${P2.rrect(590 + (r === 2 ? 40 : 0), 92 + r * 46, w, 26, 13)}" fill="${c}"/>`).join('') + `<rect x="${590 + 100}" y="${92 + 3 * 46}" width="14" height="30" fill="${C.ink}"/>`;
    return G(at(380, 470, 0.86, 540, 420), parrot.parrot({ expr: 'open', wing: 'folded' })) +
      P2.bubble(560, 60, 420, 250, 560, 370, code) + P.svg;
  }, ex({ note: 'El vibe coding en una imagen: un loro que completa código.' }));

  add('37-vibe-coded', 'Vibe coded · WA on test 1', () => {
    const P = phrase([{ text: 'VIBE CODED', y: 900, width: 940, fill: C.pink, shade: C.pinkDeep, ex: [0, 22], font: 'Shrikhand-Regular', bounce: [-3, 2, -2, 3, -1, 2, -3, 2, -2, 3], lift: [0, -6, 4, -4, 2, -6, 4, -2, 2, -4] }]);
    const H = dog.dogHead({ expr: 'happy', tilt: -6 });
    const D = place(540, 470, 520, P.top - 6, 0.8);
    return G(D, H.svg + `<g transform="rotate(-6 540 300)">${P2.sunglasses(540, 272, 300)}</g>`) +
      P.svg + P2.stamp(560, P.top + 250, 'WA ON TEST 1', { color: C.red, rot: -9, w: 640, h: 120, size: 86 }) +
      K.sparkle(256, P.top - 230, 30, C.yellow) + K.sparkle(790, P.top - 250, 26, C.pink) + K.sparkle(230, P.top - 120, 14, C.yellow);
  }, ex({ note: 'Con lentes y mucha confianza… WA on test 1.' }));

  // ------------------------------------------------------------ Reggaeton bunny
  const bunnyBust = () => { const h = bunny.bunnyHead({}); return bunny.bunnyTee() + h.svg + bunny.earsThroughHat(); };
  add('38-ciclo-euleriano', 'Baby, la vida es un ciclo (euleriano)', () => {
    const P = phrase([
      { text: 'BABY, LA VIDA', y: 900, width: 860, fill: C.white, shade: C.pinkDeep, ex: [0, 18], bounce: BOUNCE, lift: LIFT },
      { text: 'ES UN CICLO', y: 1060, width: 860, fill: '#B7E26A', shade: C.navyShade, ex: [0, 20], bounce: BOUNCE.slice(2), lift: LIFT.slice(1) },
    ]);
    const eu = `<g transform="rotate(-6 520 1150)">${T.chunky(T.line('(EULERIANO)', { fontName: 'Shrikhand-Regular', size: 92, x: 540, y: 1170 }), { fill: C.pink, shade: C.pinkDeep, extrude: [0, 10] })}</g>`;
    return P2.cycleRing(540, 330, 400, 6, [C.pink, '#B7E26A', C.yellow, C.turq, C.lilac, C.orange]) +
      G('translate(0 40)', bunnyBust()) + P.svg + eu;
  }, ex({ note: 'Reggaetón de grafos: un ciclo que pasa por cada arista una vez.', sizes: [5, 6, 8] }));

  add('39-no-lo-memoizo', 'Lo que no es DP no lo memoizo', () => {
    const P = phrase([
      { text: 'BABY, LA VIDA ES UN CICLO', y: 840, width: 920, fill: C.white, shade: C.pinkDeep, ex: [0, 12], bounce: BOUNCE, lift: LIFT },
      { text: 'Y LO QUE NO ES DP', y: 970, width: 840, fill: '#B7E26A', shade: C.navyShade, ex: [0, 16], bounce: BOUNCE.slice(1), lift: LIFT.slice(2) },
      { text: 'NO LO MEMOIZO', y: 1120, width: 920, fill: C.pink, shade: C.pinkDeep, ex: [0, 20], bounce: BOUNCE.slice(3), lift: LIFT.slice(1) },
    ]);
    const vals = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ''];
    return G('translate(0 -30)', bunnyBust()) + P2.dpTable(680, 420, 4, 3, 66, vals, [6, 7, 8]) +
      K.sparkle(140, 220, 28, '#B7E26A') + K.sparkle(920, 160, 24, C.pink) + P.svg;
  }, ex({ note: 'La segunda estrofa: con su tabla de Fibonacci memoizada.', sizes: [5, 6, 8] }));
};
