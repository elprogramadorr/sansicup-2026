// Galano, turquoise-fronted amazon (referencias/galano.png, loro-original-*.jpg):
// pale-yellow crown, wide turquoise band on the forehead, pale-yellow face around
// an orange iris with a bare pale eye ring, dark hooked beak, scalloped green
// chest. Chibi proportions. Head ≈ (547, 245), beak to the right.
const { C } = require('./lib');
const K = require('./kit');

const GREEN_LINE = '#1F5E33';

const P = {
  body: 'M455,380 C390,420 368,520 380,620 C390,700 440,760 520,770 C600,778 668,730 684,640 C700,540 672,430 610,385 Z',
  head: 'M545,62 C660,58 742,140 742,250 C742,345 672,420 560,425 C440,430 352,352 352,245 C352,138 432,66 545,62 Z',
  belly: 'M560,440 C640,450 676,540 664,640 C656,720 600,760 540,764 C590,690 600,540 560,440 Z',
  crown: 'M452,100 C500,62 580,50 640,66 C680,78 706,100 718,128 Q692,150 660,138 Q636,162 602,146 Q574,170 542,152 Q514,174 486,156 Q462,138 452,100 Z',
  forehead: 'M718,122 C742,156 754,206 750,258 C736,272 712,274 698,266 C690,240 674,214 652,196 C626,176 596,166 574,162 C592,142 636,126 680,118 Z',
  face: 'M572,206 C608,190 662,204 692,240 C708,268 702,302 670,316 C632,328 588,310 572,280 C560,256 562,226 572,206 Z',
  beakTop: 'M690,215 C745,200 812,225 822,300 C828,348 808,392 784,410 C790,370 782,340 758,322 C735,306 712,305 694,312 C680,280 678,240 690,215 Z',
  beakLow: 'M698,312 C725,302 760,318 770,345 C760,372 735,382 712,378 C700,360 694,335 698,312 Z',
  // open beak: lower mandible dropped, mouth visible
  beakLowOpen: 'M700,334 C734,340 774,366 778,402 C766,432 734,440 712,430 C700,404 696,366 700,334 Z',
  mouth: 'M692,290 C732,288 778,320 786,372 C778,410 744,424 712,418 C698,384 692,334 692,290 Z',
};

function parrotHead({ expr = 'smug' } = {}) {
  const ex = 610, ey = 248;
  let eye = K.shape(K.circle(ex, ey, 43), C.eyeRing) +
    `<circle cx="${ex}" cy="${ey}" r="26" fill="${C.orangeShade}"/><circle cx="${ex}" cy="${ey}" r="15" fill="${C.black}"/>` +
    `<circle cx="${ex + 9}" cy="${ey - 10}" r="8" fill="${C.white}"/>`;
  if (expr === 'smug' || expr === 'bandit') {
    eye += K.clipped(K.circle(ex, ey, 44), `<path d="M560,190 H664 V234 C640,222 584,222 560,234 Z" fill="${C.eyeRing}"/>` + K.stroke('M560,236 C584,222 640,222 664,236', K.IN));
  }
  if (expr === 'wink') {
    eye = K.shape(K.circle(ex, ey, 43), C.eyeRing) + K.stroke(`M${ex - 24},${ey + 4} Q${ex},${ey - 18} ${ex + 24},${ey + 4}`, 10, C.black);
  }
  if (expr === 'happy') {
    eye = K.shape(K.circle(ex, ey, 43), C.eyeRing) + K.stroke(`M${ex - 24},${ey + 8} Q${ex},${ey - 20} ${ex + 24},${ey + 8}`, 10, C.black);
  }
  eye += K.stroke(`M${ex},${ey} m-44,0 a44,44 0 1,0 88,0 a44,44 0 1,0 -88,0`, K.IN);
  const open = expr === 'open' || expr === 'happy';
  const topOpen = K.rotD(P.beakTop, -12, 694, 262);
  const beak = open
    ? K.shape(P.mouth, '#5B2B3A') + K.shape('M708,372 C724,356 752,356 768,372 C760,392 734,400 714,394 Z', '#7E8592', { line: 0 }) +
      K.shape(P.beakLowOpen, C.beak) + K.shape(topOpen, C.beak) +
      K.clipped(topOpen, `<path d="${K.rotD('M700,222 C740,212 790,232 806,280 C780,262 740,252 704,262 Z', -12, 694, 262)}" fill="${C.beakLight}"/>`)
    : K.shape(P.beakLow, C.beak) + K.shape(P.beakTop, C.beak);
  const mask = expr === 'bandit'
    ? K.clipped(P.head, K.shape('M440,214 C520,196 640,196 760,210 L760,286 C640,272 520,276 440,292 Z', C.navy, { line: 0 })) +
      K.shape(K.circle(ex, ey, 43), C.eyeRing) + `<circle cx="${ex}" cy="${ey}" r="26" fill="${C.orangeShade}"/><circle cx="${ex}" cy="${ey}" r="15" fill="${C.black}"/><circle cx="${ex + 9}" cy="${ey - 10}" r="8" fill="${C.white}"/>` +
      K.clipped(K.circle(ex, ey, 44), `<path d="M560,190 H664 V236 C640,224 584,224 560,236 Z" fill="${C.eyeRing}"/>` + K.stroke('M560,238 C584,224 640,224 664,238', K.IN)) +
      K.stroke(`M${ex},${ey} m-44,0 a44,44 0 1,0 88,0 a44,44 0 1,0 -88,0`, K.IN) +
      K.stroke('M444,250 C416,236 396,240 380,256', 12, C.navy) + K.stroke('M444,262 C420,268 404,282 396,300', 12, C.navy)
    : '';
  const scallop = (x, y, c = C.greenShade) => K.stroke(`M${x - 18},${y} q18,20 36,0`, 6.5, c);
  const svg = `<g class="galano-cabeza">
    ${K.shape(P.head, C.green)}
    ${K.halftone(P.head, C.greenShade, { box: [340, 50, 760, 440], spacing: 17, angle: 0, from: 1.0, to: -1.4, rmax: 7 })}
    ${K.clipped(P.head, `<path d="M352,245 C352,330 410,400 500,420 C440,380 405,320 400,240 C398,180 420,130 460,96 C400,120 352,175 352,245 Z" fill="${C.greenShade}"/>`)}
    ${K.clipped(P.head, K.shape(P.crown, C.goldLight, { line: 0 }))}
    ${K.clipped(P.head, K.shape(P.forehead, C.turq, { line: 0 }))}
    ${K.clipped(P.head, K.shape(P.face, C.goldLight, { line: 0 }))}
    ${[[470, 300], [430, 340], [490, 352]].map(([x, y]) => scallop(x, y)).join('')}
    ${eye}
    ${beak}
    ${expr === 'open' || expr === 'happy' ? '' : K.clipped(P.beakTop, `<path d="M700,222 C740,212 790,232 806,280 C780,262 740,252 704,262 Z" fill="${C.beakLight}"/>`)}
    <circle cx="716" cy="244" r="6" fill="${C.ink}"/>
    ${mask}
  </g>`;
  return { svg, outline: open ? [P.head, topOpen, P.beakLowOpen, P.mouth] : [P.head, P.beakTop, P.beakLow] };
}

function parrotBody() {
  const pts = [[560, 520], [600, 520], [640, 520], [540, 566], [580, 566], [620, 566], [660, 566], [560, 612], [600, 612], [640, 612], [580, 658], [620, 658]];
  return K.shape(P.body, C.green) +
    K.clipped(P.body, K.shape(P.belly, C.greenLight, { line: 0 })) +
    K.halftone(P.body, C.greenShade, { box: [370, 380, 690, 780], spacing: 17, angle: 0, from: 1.0, to: -1.2, rmax: 7 }) +
    K.clipped(P.body, `<path d="M380,420 C392,540 420,680 500,780 L330,780 V420 Z" fill="${C.greenShade}"/>`) +
    K.clipped(P.belly, pts.map(([x, y]) => K.stroke(`M${x - 18},${y} q18,20 36,0`, 6.5, C.green)).join(''));
}

// Wing raised toward the upper-left, feather "fingers" gripping at (≈260, 420)
function wingRaised() {
  const wing = 'M448,452 C410,428 340,408 296,404 C268,402 250,416 252,434 C256,452 276,460 300,462 C344,470 392,498 432,516 C466,530 484,488 448,452 Z';
  const feathers = ['M290,394 C266,378 238,382 234,400 C234,416 256,422 284,414 Z', 'M286,416 C260,406 234,414 234,432 C238,448 262,450 290,438 Z', 'M294,438 C270,432 250,444 254,460 C260,474 286,472 306,458 Z'];
  return K.silhouette([wing, ...feathers]) + K.shape(wing, C.green) +
    K.clipped(wing, `<path d="M250,440 C330,456 400,490 470,500 L480,560 H230 Z" fill="${C.greenShade}"/>`) +
    K.stroke('M318,436 C350,444 380,456 408,474', 6.5, C.greenShade) +
    feathers.map((f) => K.shape(f, C.greenShade)).join('');
}
// Wing folded against the body (default pose)
function wingFolded() {
  const wing = 'M420,452 C380,470 362,540 372,620 C380,676 404,716 436,736 C458,700 468,640 466,580 C464,520 452,474 420,452 Z';
  return K.shape(wing, C.green) +
    K.clipped(wing, `<path d="M360,560 C392,600 420,660 440,740 L340,740 Z" fill="${C.greenShade}"/>`) +
    K.stroke('M392,560 C404,580 420,590 440,592', 6.5, GREEN_LINE) + K.stroke('M388,620 C400,640 416,650 436,652', 6.5, GREEN_LINE);
}

function toe(x, y, w = 36, { halo = false } = {}) {
  const d = `M${x},${y} C${x - 8},${y + 28} ${x - 6},${y + 50} ${x + 6},${y + 62} C${x + 16},${y + 72} ${x + w},${y + 68} ${x + w},${y + 52} C${x + w},${y + 34} ${x + w - 2},${y + 16} ${x + w - 4},${y} Z`;
  const claw = `M${x + 4},${y + 54} C${x + 6},${y + 66} ${x + 16},${y + 76} ${x + w - 4},${y + 70} C${x + w},${y + 64} ${x + w},${y + 58} ${x + w - 1},${y + 52} Z`;
  return (halo ? K.halo([d]) : '') + K.shape(d, C.gray) + K.shape(claw, C.beak, { line: 0 });
}

// Full perched parrot (keyline + body + head), wing variant
function parrot({ expr = 'smug', wing = 'folded' } = {}) {
  const h = parrotHead({ expr });
  return K.silhouette([P.body, ...h.outline]) + parrotBody() + (wing === 'folded' ? wingFolded() : '') + h.svg +
    (wing === 'raised' ? wingRaised() : '');
}

module.exports = { parrot, parrotHead, parrotBody, wingRaised, wingFolded, toe, P, GREEN_LINE };
