// The gatita, calico from the photo (referencias/gatita.png), viewer's side:
// white blaze down the center; left = black patch over the eye with orange
// above; right = black on top, orange around the eye, black stripe on the cheek
// edge; orange smudge on the nose bridge / left whisker pad; pink nose;
// yellow-green eyes. Head centered on x = 520.
const { C } = require('./lib');
const K = require('./kit');

const CX = 520;
const H = {
  head: (() => {
    const headR = [[520, 150], [586, 152], [646, 170], [694, 204], [728, 252], [748, 306], [758, 348], [764, 370], [744, 386], [716, 424], [668, 452], [600, 470], [520, 476]];
    const pts = K.sym(headR, CX);
    return K.fluff(pts, pts.map(([, y]) => (y > 330 && y < 440 ? 0.14 : 0.05)));
  })(),
  earL: 'M342,258 C318,184 302,108 308,42 C312,30 324,28 334,36 C390,72 450,122 494,176 Z',
  earInL: 'M362,226 C346,170 336,116 338,76 C382,108 428,146 462,184 Z',
  orangeTL: 'M290,110 C380,96 470,104 500,132 L498,190 C430,176 360,180 290,206 Z',
  blackL: 'M290,206 C360,180 430,176 498,190 C500,214 494,240 482,262 C474,300 452,340 418,362 C378,384 326,376 290,356 Z',
  blackTR: 'M542,132 C600,112 690,126 760,160 L760,256 C706,236 640,230 560,240 C554,204 548,170 542,132 Z',
  orangeR: 'M560,240 C640,230 706,236 760,256 L760,392 C706,392 646,372 606,338 C584,306 568,276 560,240 Z',
  stripeR: 'M716,262 C736,292 746,330 748,372 L770,372 L770,250 Z',
  spotL: 'M484,284 C494,276 506,282 506,296 C504,310 492,314 484,306 C478,298 478,290 484,284 Z',
  muzzleSpot: 'M498,328 C506,306 526,302 536,318 L540,356 C534,378 514,392 494,390 C474,386 464,368 470,352 C476,340 488,338 498,328 Z',
  padR: 'M556,364 C570,356 590,360 596,374 C592,388 574,392 560,386 Z',
  nose: 'M504,356 C512,350 528,350 536,356 C536,366 526,376 520,378 C514,376 504,366 504,356 Z',
};
H.earR = K.flipD(H.earL, CX);
H.earInR = K.flipD(H.earInL, CX);

const eyeShape = (cx) => `M${cx - 38},300 C${cx - 30},270 ${cx + 30},266 ${cx + 38},294 C${cx + 34},328 ${cx - 30},334 ${cx - 38},300 Z`;

function eyes(expr) {
  const one = (cx, side) => {
    const e = eyeShape(cx);
    if (expr === 'serene') return K.stroke(`M${cx - 30},${298} Q${cx},${318} ${cx + 30},${298}`, 9);
    if (expr === 'evil') {
      // Tom-meme look: heavy V brows, flat upper lids, pupils to the side
      return K.shape(e, C.irisGreen) +
        K.clipped(e, `<path d="M${cx - 50},${292 + side * 8} L${cx + 50},${292 - side * 8} V250 H${cx - 50} Z" fill="${side < 0 ? C.orange : C.black}"/>` +
          `<ellipse cx="${cx + 16}" cy="306" rx="8" ry="18" fill="${C.black}"/>`) +
        K.stroke(`M${cx - 44},${292 + side * 8} L${cx + 44},${292 - side * 8}`, 9) +
        K.shape(e, 'none') +
        K.stroke(`M${cx - 46 * side},${246 - 6} L${cx + 40 * side},${270}`, 14);
    }
    return K.shape(e, C.irisGreen) +
      `<ellipse cx="${cx}" cy="300" rx="9" ry="25" fill="${C.black}"/>` +
      `<circle cx="${cx + 12}" cy="288" r="7" fill="${C.white}"/>` +
      K.stroke(`M${cx - 44},${290 + side * 6} C${cx - 20},276 ${cx + 20},274 ${cx + 44},${284 - side * 6}`, K.IN + 1) +
      K.shape(e, 'none');
  };
  return one(440, 1) + one(600, -1);
}

function mouth(expr) {
  if (expr === 'evil') {
    // wide closed grin that pushes into the cheeks
    return K.stroke('M520,378 V392') +
      K.stroke('M420,372 C452,420 498,426 520,394 C542,426 588,420 620,372', 8) +
      K.stroke('M414,362 C412,376 418,386 426,392', 6) + K.stroke('M626,362 C628,376 622,386 614,392', 6);
  }
  if (expr === 'serene') return K.stroke('M520,378 V390') + K.stroke('M500,398 C510,408 518,406 520,396 C522,406 530,408 540,398');
  return K.stroke('M520,378 V394') + K.stroke('M494,400 C506,408 516,406 520,394 C524,406 534,408 546,400');
}

// expr: 'stern' | 'evil' | 'serene'
function catHead({ expr = 'stern' } = {}) {
  const whiskers = ['M380,384 C340,378 306,380 276,388', 'M382,402 C344,404 312,412 286,424', 'M660,384 C700,378 734,380 764,388', 'M658,402 C696,404 728,412 754,424'];
  const svg = `<g class="gatita-cabeza">
    ${K.shape(H.earL, C.orange)}${K.shape(H.earR, C.white)}
    ${K.clipped(H.earR, `<path d="M600,140 L720,230 L740,100 Z" fill="${C.black}"/>`)}
    ${K.shape(H.earInL, C.pink, { line: 0 })}${K.shape(H.earInR, C.pink, { line: 0 })}
    ${K.stroke('M392,170 C384,146 380,126 380,108', 6, C.white)}${K.stroke('M648,170 C656,146 660,126 660,108', 6, C.white)}
    ${K.shape(H.head, C.white)}
    ${K.clipped(H.head, [H.orangeTL, H.orangeR, H.spotL].map((d) => K.shape(d, C.orange, { line: 0 })).join('') +
      [H.blackL, H.blackTR, H.stripeR].map((d) => K.shape(d, C.black, { line: 0 })).join(''))}
    ${K.halftone(H.orangeR, C.orangeShade, { box: [560, 230, 770, 400], spacing: 16, angle: 90, from: -0.6, to: 1.2, rmax: 6 })}
    ${K.clipped(H.head, `<path d="M280,330 C300,400 380,452 470,470 L280,470 Z" fill="${C.dogShade}"/>`)}
    ${K.shape(H.muzzleSpot, C.orange, { line: 0 })}${K.shape(H.padR, C.orange, { line: 0 })}
    ${eyes(expr)}
    ${K.shape(H.nose, C.pink, { line: 5 })}
    ${mouth(expr)}
    ${whiskers.map((d) => K.stroke(d, 6)).join('')}
  </g>`;
  return { svg, outline: [H.head, H.earL, H.earR] };
}

const body = 'M396,420 C352,470 330,560 320,660 L312,800 L728,800 L720,660 C710,560 688,470 644,420 Z';
function catBody() {
  const chestFluff = K.fluff(K.sym([[520, 420], [580, 424], [630, 440], [640, 480], [620, 520], [580, 548], [520, 560]], CX), 0.3);
  return K.shape(body, C.white) +
    K.clipped(body, K.shape('M300,420 C340,470 360,560 350,800 L290,800 V420 Z', C.black, { line: 0 })) +
    K.clipped(body, K.shape('M300,560 C330,600 344,680 340,800 L290,800 Z', C.orange, { line: 0 })) +
    K.shape(chestFluff, C.white, { line: 0 }) +
    K.stroke('M500,500 C506,516 512,528 520,536', 6.5, C.dogShade) + K.stroke('M548,494 C544,510 538,522 530,532', 6.5, C.dogShade);
}

// Whole cat behind something: keyline + body + head
function cat({ expr = 'stern' } = {}) {
  const h = catHead({ expr });
  return K.silhouette([body, ...h.outline]) + catBody() + h.svg;
}

const pawD = (x, y, rx = 44, ry = 38) => K.fluff(K.arc(x, y, rx, ry, -180, 180, 9).slice(0, 8), 0.16);
const paw = (x, y, rx, ry) => K.popped([pawD(x, y, rx, ry)], C.white) +
  K.stroke(`M${x - 10},${y + 6} L${x - 8},${y + 28}`, 7.5) + K.stroke(`M${x + 10},${y + 4} L${x + 12},${y + 26}`, 7.5);

module.exports = { cat, catHead, catBody, paw, pawD, body, H };
