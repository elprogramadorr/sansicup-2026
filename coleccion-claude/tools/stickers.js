// The collection: each entry composes characters, props and type into one
// sticker. Coordinates: lettering/characters share a ~1000-unit-wide space.
const { C } = require('./lib');
const K = require('./kit');
const T = require('./type');
const { signature } = require('./lettering');
const { trophy, balloon, laptop, keycap, haloRing, horns } = require('./props');
const parrot = require('./parrot');
const dog = require('./dog');
const cat = require('./cat');
const { nico } = require('./nico');
const { crest, shirt, twoInk } = require('./identity');

const PET = 'translate(4 -80) scale(0.9)'; // characters standing on the signature
const LET = 'translate(30 505) scale(0.94)';
const sig = (o) => `<g transform="${LET}">${signature(o)}</g>`;

const STICKERS = [];
// sizes: printable sizes in cm (long side); fine-detail pieces skip 4 cm.
// group/note feed the gallery page.
const add = (id, title, art, { sizes = [4, 6, 8], group = '', note = '' } = {}) => STICKERS.push({ id, title, art, sizes, group, note });

// ---------------------------------------------------------------- SanSi Cup
add('01-sansicup-firma', 'SanSi Cup 2026 · firma', () =>
  signature({ drop: 12 }) +
  K.sparkle(985, 250, 30, C.yellow) + K.sparkle(1028, 300, 16, C.white) + K.sparkle(222, 92, 20, C.yellow));

add('02-sansicup-galano', 'SanSi Cup 2026 · Galano', () => `
  <g transform="${PET}">
    ${trophy(232, 470, 250, -14, { sparkles: true })}
    ${parrot.parrot({ expr: 'smug', wing: 'raised' })}
  </g>
  ${sig({ drop: 12 })}
  <g transform="${PET}">${[480, 514, 578, 612].map((x) => parrot.toe(x, 736)).join('')}</g>`);

add('03-sansicup-perrito', 'SanSi Cup 2026 · Perrito', () => `
  <g transform="${PET}">
    ${dog.jacket()}
    ${dog.dogHead({ expr: 'sweet' }).svg}
    ${dog.sleeves()}
    ${trophy(540, 772, 292, 0)}
    ${dog.paw(458, 580, 1)}${dog.paw(622, 580, -1)}
    ${K.sparkle(764, 470, 30, C.yellow)}${K.sparkle(800, 410, 16, C.white)}${K.sparkle(318, 640, 20, C.yellow)}
  </g>
  ${sig({ drop: 12 })}`);

add('04-sansicup-gatita', 'SanSi Cup 2026 · Gatita', () => `
  <g transform="${PET}">
    ${cat.cat({ expr: 'stern' })}
    ${trophy(856, 662, 272, 6)}
    ${K.limb('M640,566 C676,508 730,456 786,428', 74)}
    ${cat.paw(796, 414, 46, 38)}
    ${K.sparkle(958, 380, 30, C.yellow)}${K.sparkle(990, 330, 15, C.white)}
  </g>
  ${sig({ drop: 12 })}`);

// ---------------------------------------------------------------- ICPC UMSS
// Varsity block: arched ICPC + UMSS, characters on top
const varsity = () => {
  const icpc = T.line('ICPC', { fontName: 'Graduate-Regular', size: 330, x: 520, y: 820, arch: 44, tracking: 8 });
  const umss = T.line('UMSS', { fontName: 'Graduate-Regular', size: 156, x: 520, y: 990, tracking: 24 });
  return T.chunky(icpc, { fill: C.navy, shade: C.red, extrude: [0, 22], inline: 7 }) +
    T.chunky(umss, { fill: C.red, shade: C.navy, extrude: [0, 16], inline: 6 });
};

add('05-icpc-galano', 'ICPC UMSS · Galano (AC)', () => {
  const G = 'translate(30 -150) scale(0.9)';
  return `
  <g transform="${G}">
    ${balloon(196, 150, 92, C.red, { letter: 'A', tilt: -12, string: 'C230,330 250,380 262,414' })}
    ${balloon(352, 70, 92, C.yellow, { letter: 'C', tilt: 8, letterColor: C.navy, string: 'C320,300 290,370 268,414' })}
    ${parrot.parrot({ expr: 'happy', wing: 'raised' })}
    ${K.sparkle(500, 20, 26, C.yellow)}${K.sparkle(96, 300, 18, C.white)}
  </g>
  ${varsity()}
  <g transform="${G}">${[480, 514, 578, 612].map((x) => parrot.toe(x, 736)).join('')}</g>`;
});

add('06-icpc-perrito', 'ICPC UMSS · Perrito', () => {
  const G = 'translate(28 -96) scale(0.9)';
  return `
  <g transform="${G}">
    ${balloon(850, 250, 96, C.royal, { letter: 'B', tilt: 10, string: 'C790,470 720,560 690,700' })}
    ${dog.jacket()}
    ${dog.dogHead({ expr: 'sweet', tilt: 4 }).svg}
  </g>
  ${varsity()}
  <g transform="${G}">
    ${dog.sleevesDown()}
    ${dog.paw(404, 736, 1)}${dog.paw(676, 736, -1)}
    ${K.sparkle(950, 110, 24, C.yellow)}
  </g>`;
});

add('07-icpc-gatita', 'ICPC UMSS · Gatita', () => {
  const G = 'translate(28 -110) scale(0.9)';
  return `
  <g transform="${G}">
    ${balloon(200, 230, 92, C.green, { letter: 'C', tilt: -10, string: 'C250,420 300,560 340,720' })}
    ${cat.cat({ expr: 'stern' })}
  </g>
  ${varsity()}
  <g transform="${G}">
    ${cat.paw(368, 748, 50, 40)}${cat.paw(672, 748, 50, 40)}
    ${K.sparkle(120, 80, 22, C.yellow)}
  </g>`;
});

// ---------------------------------------------------------------- Inside jokes
const BAGEL = 'BagelFatOne-Regular';
const BOUNCE = [-4, 3, -3, 4, -2, 3, -4, 2, -3, 4];
const LIFT = [0, -8, 6, -6, 4, -6, 6, -4, 2, -6];
const WORD = 0.16; // extra word gap (× size): Bagel's space is narrow and the bounce closes it
// Phrase lines centered on x = 520 → { svg, top } where top is the first line's top edge
function phrase(lines) {
  let top = Infinity;
  const svg = lines.map(({ text, y, width, fill, shade, ex = [0, 18], bounce, lift, arch = 0, font = BAGEL, inline = 0 }, i) => {
    const size = T.fit(text, { fontName: font, width, wordSpace: WORD });
    const ds = T.line(text, { fontName: font, size, x: 520, y, bounce, lift, arch, wordSpace: WORD * size });
    if (i === 0) top = T.bounds(ds).y0;
    return T.chunky(ds, { fill, shade, extrude: ex, inline });
  }).join('');
  return { svg, top };
}
// Group transform so that native point (nx, ny) lands on canvas (cx, cy)
const place = (nx, ny, cx, cy, k = 0.9) => `translate(${(cx - k * nx).toFixed(1)} ${(cy - k * ny).toFixed(1)}) scale(${k})`;

add('08-perritos-malvados', 'Perritos Malvados', () => {
  const P = phrase([
    { text: 'PERRITOS', y: 700, width: 720, fill: C.white, shade: C.red, ex: [0, 16], bounce: BOUNCE, lift: LIFT },
    { text: 'MALVADOS', y: 890, width: 900, fill: C.red, shade: C.navyShade, ex: [0, 22], bounce: BOUNCE.slice(3), lift: LIFT.slice(2) },
  ]);
  const G = place(540, 736, 516, P.top - 18);
  return `
  <g transform="${G}">
    ${dog.jacket()}
    ${dog.dogHead({ expr: 'evil' }).svg}
    <g transform="rotate(-5 540 300)">${horns(452, 118, 628, 112, 1.35)}</g>
  </g>
  ${P.svg}
  <g transform="${G}">
    ${dog.sleevesDown()}
    ${dog.paw(404, 736, 1)}${dog.paw(676, 736, -1)}
  </g>`;
});

add('09-gatitas-bondadosas', 'Gatitas Bondadosas', () => {
  const P = phrase([
    { text: 'GATITAS', y: 712, width: 660, fill: C.pink, shade: C.pinkDeep, ex: [0, 16], bounce: BOUNCE, lift: LIFT },
    { text: 'BONDADOSAS', y: 880, width: 940, fill: C.white, shade: C.pinkDeep, ex: [0, 20], bounce: BOUNCE.slice(2), lift: LIFT.slice(1) },
  ]);
  const G = place(520, 702, 520, P.top - 22);
  return `
  <g transform="${G}">
    ${cat.cat({ expr: 'serene' })}
    ${haloRing(520, -4, 130, 30)}
  </g>
  ${P.svg}
  <g transform="${G}">${cat.paw(474, 702, 48, 38)}${cat.paw(566, 702, 48, 38)}</g>`;
});

add('10-mucho-maestro', 'Mucho Maestro', () => {
  const P = phrase([
    { text: 'MUCHO', y: 780, width: 540, fill: C.yellow, shade: C.goldShade, ex: [0, 16], bounce: BOUNCE, lift: LIFT },
    { text: 'MAESTRO', y: 950, width: 880, fill: C.white, shade: C.red, ex: [0, 22], bounce: BOUNCE.slice(1), lift: LIFT.slice(3) },
  ]);
  const top = P.top;
  const G = place(540, 760, 520, top + 40, 0.86);
  return `
  <g transform="${G}">${parrot.parrot({ expr: 'smug', wing: 'folded' })}</g>
  ${laptop(500, top + 4, 330)}
  ${K.sparkle(850, top - 330, 30, C.yellow)}${K.sparkle(892, top - 262, 15, C.white)}
  ${P.svg}`;
});

add('11-bandida', 'Bandida', () => {
  const P = phrase([{ text: 'BANDIDA', y: 860, width: 900, fill: C.lilac, shade: C.lilacShade, ex: [0, 24], bounce: BOUNCE, lift: LIFT }]);
  const G = place(520, 704, 520, P.top - 20);
  return `
  <g transform="${G}">${cat.cat({ expr: 'evil' })}</g>
  ${P.svg}
  <g transform="${G}">${cat.paw(384, 704, 50, 40)}${cat.paw(658, 704, 50, 40)}</g>`;
});

add('12-bandido', 'Bandido', () => {
  const P = phrase([{ text: 'BANDIDO', y: 860, width: 900, fill: C.lilac, shade: C.lilacShade, ex: [0, 24], bounce: BOUNCE.slice(2), lift: LIFT.slice(1) }]);
  const G = place(546, 770, 520, P.top + 22);
  return `
  <g transform="${G}">${parrot.parrot({ expr: 'bandit', wing: 'folded' })}</g>
  ${P.svg}
  <g transform="${G}">${[480, 514, 578, 612].map((x) => parrot.toe(x, 736, 36, { halo: true })).join('')}</g>`;
});

add('13-f-maestro', 'F Maestro', () => {
  const G = 'translate(30 -40) scale(0.9)';
  const P = phrase([{ text: 'MAESTRO', y: 1000, width: 820, fill: C.white, shade: C.lilacShade, ex: [0, 20], font: 'Shrikhand-Regular', bounce: [-2, 2, -1, 2, -2, 1, -1], lift: [0, -4, 2, -2, 2, -4, 0] }]);
  return `
  <g transform="${G}">${dog.dogHead({ expr: 'sad', tear: true }).svg}</g>
  ${keycap(520, 600, 300, 'F')}
  <g transform="${G}">${dog.paw(470, 560, 1)}${dog.paw(686, 560, -1)}</g>
  ${P.svg}`;
});

add('14-que-waso', 'Qué Waso · Nico', () => {
  const P = phrase([{ text: 'QUÉ WASO', y: 930, width: 900, fill: C.yellow, shade: C.red, ex: [0, 26], bounce: BOUNCE, lift: LIFT }]);
  return `
  ${balloon(170, 250, 84, C.red, { tilt: -10, string: 'C190,470 220,560 250,640' })}
  ${balloon(870, 180, 80, C.yellow, { tilt: 8, string: 'C850,400 830,500 800,600' })}
  ${balloon(930, 400, 70, C.royal, { tilt: 14, string: 'C900,560 860,620 820,660' })}
  <g transform="translate(16 -10)">${nico()}</g>
  ${P.svg}`;
});

// ---------------------------------------------------------------- Eat sleep...
// Cycle badge: two arrow arcs around a stack of words
function cycleArrows(cx, cy, r, w, color) {
  const pt = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const arcD = (a0, a1) => { const [x0, y0] = pt(a0), [x1, y1] = pt(a1); return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0,1 ${x1.toFixed(1)},${y1.toFixed(1)}`; };
  const head = (a) => {
    const [x, y] = pt(a); const t = ((a + 90) * Math.PI) / 180, n = (a * Math.PI) / 180;
    const tip = [x + Math.cos(t) * w * 1.1, y + Math.sin(t) * w * 1.1];
    const b1 = [x + Math.cos(n) * w * 0.95, y + Math.sin(n) * w * 0.95], b2 = [x - Math.cos(n) * w * 0.95, y - Math.sin(n) * w * 0.95];
    return `M${b1.map((v) => v.toFixed(1)).join(',')} L${tip.map((v) => v.toFixed(1)).join(',')} L${b2.map((v) => v.toFixed(1)).join(',')} Z`;
  };
  const arcs = [arcD(196, 330), arcD(16, 150)], heads = [head(330), head(150)];
  return arcs.map((d) => K.stroke(d, w + K.OUT * 2 + 14, C.white).replace('stroke-linecap="round"', 'stroke-linecap="butt"')).join('') +
    K.halo(heads) +
    arcs.map((d) => K.stroke(d, w + K.OUT * 2, C.ink).replace('stroke-linecap="round"', 'stroke-linecap="butt"')).join('') + K.silhouette(heads) +
    arcs.map((d) => K.stroke(d, w, color).replace('stroke-linecap="round"', 'stroke-linecap="butt"')).join('') + heads.map((d) => K.shape(d, color, { line: 0 })).join('');
}

add('15-wasearse-repeat', 'Eat, sleep, wasearse, repeat', () => {
  const P = phrase([
    { text: 'EAT,', y: 318, width: 250, fill: C.white, shade: C.red, ex: [0, 14], bounce: BOUNCE, lift: LIFT },
    { text: 'SLEEP,', y: 462, width: 420, fill: C.white, shade: C.red, ex: [0, 16], bounce: BOUNCE.slice(2), lift: LIFT.slice(1) },
    { text: 'WASEARSE,', y: 652, width: 760, fill: C.yellow, shade: C.goldShade, ex: [0, 22], bounce: BOUNCE.slice(1), lift: LIFT.slice(2) },
    { text: 'REPEAT', y: 806, width: 500, fill: C.white, shade: C.red, ex: [0, 16], bounce: BOUNCE.slice(3), lift: LIFT },
  ]);
  const G = 'translate(560 -60) scale(0.62)';
  return `
  ${cycleArrows(520, 560, 430, 74, C.turq)}
  <g transform="${G}">${(() => { const h = parrot.parrotHead({ expr: 'wink' }); return K.silhouette(h.outline) + h.svg; })()}</g>
  ${P.svg}`;
});

// ---------------------------------------------------------------- Identity
// Isometric Rubik cube with icons on some stickers (ICPC UMSS logo homage)
function rubik(cx, top, E) {
  const c = E / 3;
  const u = [0.866 * c, 0.5 * c], v = [-0.866 * c, 0.5 * c], w = [0, c];
  const add2 = (p, q, k = 1) => [p[0] + q[0] * k, p[1] + q[1] * k];
  const Tp = [cx, top];
  const body = [Tp, add2(Tp, u, 3), add2(add2(Tp, u, 3), w, 3), add2(add2(add2(Tp, u, 3), v, 3), w, 3), add2(add2(Tp, v, 3), w, 3), add2(Tp, v, 3)];
  const poly = (pts) => `M${pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' L')} Z`;
  const SH = { [C.red]: '#A80F20', [C.yellow]: '#D9A21E', [C.royal]: '#1F4FA0', [C.green]: '#2C7A3B', [C.white]: '#C9D0DB', [C.orange]: '#C4682A' };
  const SH2 = { [C.red]: '#C21426', [C.yellow]: '#EDB623', [C.royal]: '#2860BD', [C.green]: '#35903F', [C.white]: '#E3E7EE', [C.orange]: '#D57632' };
  const faces = {
    top: { o: Tp, a: u, b: v, cols: [C.yellow, C.white, C.red, C.royal, C.yellow, C.green, C.white, C.orange, C.yellow], tone: (x) => x },
    left: { o: add2(Tp, v, 3), a: u, b: w, cols: [C.red, C.royal, C.white, C.green, C.red, C.yellow, C.white, C.orange, C.royal], tone: (x) => SH2[x] || x },
    right: { o: add2(add2(Tp, u, 3), v, 3), a: [-v[0], -v[1]], b: w, cols: [C.white, C.green, C.red, C.orange, C.white, C.royal, C.yellow, C.red, C.white], tone: (x) => SH[x] || x },
  };
  const icons = { 'top-4': 'balloon:red', 'left-2': 'balloon:blue', 'right-0': 'code', 'right-4': 'balloon:yellow', 'left-6': 'braces' };
  let s = K.halo([poly(body)]) + K.silhouette([poly(body)]) + K.shape(poly(body), C.ink, { line: 0 });
  for (const [name, F] of Object.entries(faces)) {
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) {
      const o = add2(add2(F.o, F.a, i), F.b, j);
      const pad = 0.1;
      const p0 = add2(add2(o, F.a, pad), F.b, pad), p1 = add2(add2(o, F.a, 1 - pad), F.b, pad);
      const p2 = add2(add2(o, F.a, 1 - pad), F.b, 1 - pad), p3 = add2(add2(o, F.a, pad), F.b, 1 - pad);
      const idx = j * 3 + i;
      const col = F.tone(F.cols[idx]);
      s += `<path d="${poly([p0, p1, p2, p3])}" fill="${col}" stroke="${col}" stroke-width="8" stroke-linejoin="round"/>`;
      const icon = icons[`${name}-${idx}`];
      if (icon) {
        const M = `matrix(${(F.a[0] / 100).toFixed(4)} ${(F.a[1] / 100).toFixed(4)} ${(F.b[0] / 100).toFixed(4)} ${(F.b[1] / 100).toFixed(4)} ${o[0].toFixed(1)} ${o[1].toFixed(1)})`;
        const k = c / 100;
        let g = `<path d="${poly([[10, 10], [90, 10], [90, 90], [10, 90]])}" fill="${F.tone(C.white)}" stroke="${F.tone(C.white)}" stroke-width="${8 / k}" stroke-linejoin="round"/>`;
        if (icon.startsWith('balloon')) {
          const bc = { red: C.red, blue: C.royal, yellow: C.yellow }[icon.split(':')[1]];
          g += `<path d="M50,20 C70,20 74,40 68,52 C62,64 54,68 50,70 C46,68 38,64 32,52 C26,40 30,20 50,20 Z" fill="${F.tone(bc)}"/><path d="M47,70 L53,70 L50,76 Z" fill="${F.tone(bc)}"/><path d="M50,76 C46,82 54,86 50,92" fill="none" stroke="${C.ink}" stroke-width="${3 / k}"/>`;
        } else if (icon === 'code') {
          g += `<path d="M40,32 L24,50 L40,68 M60,32 L76,50 L60,68" fill="none" stroke="${C.ink}" stroke-width="${7 / k}" stroke-linecap="round" stroke-linejoin="round"/>`;
        } else {
          g += `<path d="M42,26 C32,26 34,40 34,46 C34,50 30,50 28,50 C30,50 34,50 34,54 C34,60 32,74 42,74 M58,26 C68,26 66,40 66,46 C66,50 70,50 72,50 C70,50 66,50 66,54 C66,60 68,74 58,74" fill="none" stroke="${C.ink}" stroke-width="${6 / k}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }
        s += `<g transform="${M}">${g}</g>`;
      }
    }
  }
  // gloss on the top face
  return s;
}

add('16-icpc-cubo', 'ICPC UMSS · cubo', () => {
  const icpc = T.line('ICPC UMSS', { fontName: 'Graduate-Regular', size: T.fit('ICPC UMSS', { fontName: 'Graduate-Regular', width: 900, tracking: 6 }), x: 520, y: 1046, tracking: 6 });
  return rubik(520, 20, 440) + T.chunky(icpc, { fill: C.navy, shade: C.red, extrude: [0, 18], inline: 7 });
});

add('17-umss-escudo', 'UMSS · escudo y código', () => {
  const brace = (ch, x) => T.chunky(T.line(ch, { fontName: 'JetBrainsMono-ExtraBold', size: 640, x, y: 560 }), { fill: C.red, shade: C.navyShade, extrude: [0, 18] });
  return brace('{', 150) + brace('}', 890) + crest(520, 40, 700);
});

// Retro club badge printed in two inks (navy + cream) with halftone mid tones
add('18-club-sansicup', 'SanSi Cup · club', () => {
  const PAPER = '#F4EBD8';
  const ring = K.shape(K.circle(520, 520, 470), C.navy, { line: K.OUT }) + K.shape(K.circle(520, 520, 336), PAPER, { line: 8, color: PAPER }) +
    K.stroke(K.circle(520, 520, 318), 6, C.navy) + K.stroke(K.circle(520, 520, 452), 5, PAPER);
  const top = T.ring('SANSI CUP · 2026', { fontName: 'BarlowCondensed-Black', size: 92, cx: 520, cy: 520, r: 360, side: 'top', tracking: 14 });
  const bot = T.ring('ICPC UMSS · COCHABAMBA', { fontName: 'BarlowCondensed-Black', size: 80, cx: 520, cy: 520, r: 352, side: 'bottom', tracking: 10 });
  const star = (a) => { const x = 520 + 400 * Math.cos(a), y = 520 + 400 * Math.sin(a); return K.shape(K.sparkleD(x, y, 22, 0.32), PAPER, { line: 0 }); };
  const h = parrot.parrotHead({ expr: 'smug' });
  const head = `<g transform="translate(2 262) scale(0.88)">${K.silhouette(h.outline)}${h.svg}</g>`;
  const est = T.line('EST. 2026', { fontName: 'BarlowCondensed-Black', size: 50, x: 520, y: 812, tracking: 8 });
  return ring + top.map((d) => `<path d="${d}" fill="${PAPER}"/>`).join('') + bot.map((d) => `<path d="${d}" fill="${PAPER}"/>`).join('') +
    star(Math.PI) + star(0) +
    twoInk(head, { ink: C.navy, paper: PAPER, map: {
      [C.green.toUpperCase()]: 'tone', [C.greenShade.toUpperCase()]: 'tone', [C.greenLight.toUpperCase()]: 'paper', [C.turq.toUpperCase()]: 'ink',
      [C.goldLight.toUpperCase()]: 'paper', [C.eyeRing.toUpperCase()]: 'paper', [C.orangeShade.toUpperCase()]: 'tone', [C.beak.toUpperCase()]: 'ink', [C.beakLight.toUpperCase()]: 'tone' } }) +
    est.map((d) => `<path d="${d}" fill="${C.navy}"/>`).join('');
});

// Mini World Finals shirts (the team's real shirts)
const SHIRTS = [
  ['19-polera-dhaka', 'Polera ICPC · Dhaka', { fabric: '#26262E', fabricShade: '#17171D', ink: '#F4EBD8' }, [
    { text: 'UMSS', y: 150, size: 120 }, { icons: true, y: 270 }, { text: 'ICPC', y: 486, size: 120 },
    { text: 'WORLD FINALS · DHAKA', y: 548, size: 50, tracking: 2 }]],
  ['20-polera-luxor', 'Polera ICPC · Luxor', { fabric: '#26262E', fabricShade: '#17171D', ink: '#F0674F' }, [
    { text: 'UMSS', y: 150, size: 120 }, { text: '47TH WORLD CHAMPIONSHIP', y: 206, size: 40, tracking: 2 }, { icons: true, y: 300 },
    { text: 'ICPC', y: 506, size: 110 }, { text: 'WORLD FINALS · LUXOR', y: 566, size: 50, tracking: 2 }]],
  ['21-polera-baku', 'Polera ICPC · Baku', { fabric: '#EADFC8', fabricShade: '#D3C5A8', ink: '#7A1F35' }, [
    { text: 'UMSS', y: 150, size: 120 }, { text: 'THE 49TH WORLD CHAMPIONSHIP', y: 206, size: 40, tracking: 2 }, { icons: true, y: 300 },
    { text: 'ICPC WORLD FINALS', y: 480, size: 66 }, { text: '2025 // BAKU', y: 556, size: 66 }]],
  ['22-polera-rapid-city', 'Polera ICPC · Rapid City 2017', { fabric: '#26262E', fabricShade: '#17171D', ink: '#F4F4F2' }, [
    { text: 'UMSS', y: 150, size: 120 }, { text: 'THE FORTY-FIRST ANNUAL', y: 206, size: 40, tracking: 2 }, { icons: true, y: 300 },
    { text: 'ACM ICPC', y: 486, size: 100 }, { text: 'WORLD FINALS · RAPID CITY 2017', y: 548, size: 50, tracking: 2 }]],
];
for (const [id, title, colors, lines] of SHIRTS) add(id, title, () => shirt(520, 60, 760, { ...colors, lines }));

// Exclusive set (exclusivos.js)
require('./exclusivos')({ add, phrase, place, BOUNCE, LIFT });
// Team stickers (equipos.js)
require('./equipos')({ add: (id, title, art, o) => add(id, title, art, { ...o, group: 'equipos' }), BOUNCE, LIFT });

// Gallery metadata: group, one-line rationale, printable sizes
const META = {
  '01-sansicup-firma': { group: 'sansi', note: 'La firma del evento con relieve 3D de script deportivo.' },
  '02-sansicup-galano': { group: 'sansi', note: 'Galano posado sobre la firma levanta la copa.' },
  '03-sansicup-perrito': { group: 'sansi', note: 'El perrito abraza la copa con su chaqueta varsity.' },
  '04-sansicup-gatita': { group: 'sansi', note: 'La gatita reclama la copa: «es mía».' },
  '05-icpc-galano': { group: 'icpc', note: 'Dos globos = dos problemas resueltos. Galano feliz.' },
  '06-icpc-perrito': { group: 'icpc', note: 'Asomado sobre las letras varsity, con su globo B.' },
  '07-icpc-gatita': { group: 'icpc', note: 'Seria, con el globo C y las patas sobre ICPC.' },
  '08-perritos-malvados': { group: 'chistes', note: 'El nombre del equipo, con cuernitos y mirada de plan.' },
  '09-gatitas-bondadosas': { group: 'chistes', note: 'Aureola y ojos cerrados: pura bondad (supuestamente).' },
  '10-mucho-maestro': { group: 'chistes', note: 'Galano tras la laptop con el check de AC.' },
  '11-bandida': { group: 'chistes', note: 'La sonrisa del meme de Tom, en la gatita (sin usar a Tom).' },
  '12-bandido': { group: 'chistes', note: 'Galano con antifaz de ladrón.' },
  '13-f-maestro': { group: 'chistes', note: 'Press F: el perrito llora sobre la tecla.' },
  '14-que-waso': { group: 'chistes', note: 'Nico con su poncho de la World Finals y pulgar arriba.', sizes: [5, 6, 8] },
  '15-wasearse-repeat': { group: 'chistes', note: 'El ciclo de la vida del competidor.' },
  '16-icpc-cubo': { group: 'identidad', note: 'El cubo del logo ICPC UMSS, con globos y código.' },
  '17-umss-escudo': { group: 'identidad', note: 'Escudo oficial trazado del PNG oficial, entre llaves.', sizes: [6, 8] },
  '18-club-sansicup': { group: 'identidad', note: 'Insignia retro a dos tintas con trama de puntos.' },
  '19-polera-dhaka': { group: 'identidad', note: 'La polera real de Dhaka en miniatura.', sizes: [6, 8] },
  '20-polera-luxor': { group: 'identidad', note: 'La polera real de Luxor en miniatura.', sizes: [6, 8] },
  '21-polera-baku': { group: 'identidad', note: 'La polera real de Baku en miniatura.', sizes: [6, 8] },
  '22-polera-rapid-city': { group: 'identidad', note: 'La polera de la World Finals de Rapid City, Dakota del Sur, 2017.', sizes: [6, 8] },
};
for (const st of STICKERS) Object.assign(st, META[st.id] || {});

module.exports = STICKERS;
