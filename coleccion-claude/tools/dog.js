// The perrito, drawn from the photos (referencias/perrito*.png):
// white scruffy terrier, drop ears hanging beside the cheeks with long fringe,
// fluffy dome, cream-tinted beard and muzzle, big black nose, dark-brown eyes
// under a fur fringe. Navy varsity jacket, heather-gray sleeves, navy cuffs and
// collar with white stripes.
// Head coordinates: centered on x = 540, crown ≈ 80, beard tip ≈ 500.
const { C } = require('./lib');
const K = require('./kit');

const LINE_FUR = '#9C8F7E'; // interior fur lines: warm gray instead of navy

function headShapes() {
  const headR = [[540, 82], [590, 80], [636, 92], [676, 116], [710, 152], [734, 198], [748, 250], [752, 302], [742, 352], [722, 398], [690, 436], [646, 466], [596, 486], [540, 494]];
  const pts = K.sym(headR);
  const vary = [1, 0.75, 1.15, 0.9, 1.25, 0.8, 1.05, 0.95, 1.2, 0.85];
  const amp = pts.map(([x, y], i) => (y < 100 && Math.abs(x - 560) < 70 ? 0.4 : y < 140 ? 0.12 : y < 300 ? 0.16 : 0.34) * vary[i % vary.length]);
  const droop = pts.map(([, y], i) => (y < 120 ? 0 : y < 300 ? 0.1 : 0.16) * vary[(i + 3) % vary.length]);
  const head = K.shag(pts, amp, droop, 0.12);
  // Drop ear (viewer's left): hangs from the top-side of the head beside the cheek
  const earPts = [[436, 104], [392, 100], [346, 116], [310, 146], [286, 190], [274, 240], [272, 290], [282, 330], [302, 352], [326, 350], [344, 328], [352, 294], [358, 252], [368, 206], [388, 160], [410, 126]];
  const earAmp = [0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.2, 0.34, 0.42, 0.36, 0.16, 0.06, 0.05, 0.05, 0.04, 0.04];
  const earDroop = [0, 0, 0, 0.02, 0.04, 0.08, 0.16, 0.28, 0.3, 0.24, 0.08, 0, 0, 0, 0, 0];
  const earL = K.shag(earPts, earAmp, earDroop, 0.08);
  const earR = K.shag(K.mirror(earPts, 540), [...earAmp].reverse(), [...earDroop].reverse(), 0.08);
  const muzzle = K.shag(K.sym([[540, 330], [592, 332], [630, 352], [648, 388], [640, 424], [618, 452], [586, 474], [540, 486]]), 0.3, 0.2, 0.1);
  const nose = 'M496,344 C516,330 564,330 584,344 C602,356 600,382 584,398 C570,412 556,420 540,420 C524,420 510,412 496,398 C480,382 478,356 496,344 Z';
  return { head, earL, earR, muzzle, nose };
}

// expr: 'sweet' | 'evil' | 'happy'
function dogHead({ expr = 'sweet', tilt = -5, tear = false } = {}) {
  const { head, earL, earR, muzzle, nose } = headShapes();
  const eyeY = 268, eL = 466, eR = 614;
  const patch = (x) => K.tuft(K.arc(x, eyeY + 2, 50, 40, -180, 180, 11).slice(0, 10), 0.2, 0.06);
  const brow = (x, dir) => K.tuft([[x - 40 * dir, eyeY - 28], [x - 14 * dir, eyeY - 48], [x + 18 * dir, eyeY - 58], [x + 40 * dir, eyeY - 52], [x + 26 * dir, eyeY - 38], [x - 8 * dir, eyeY - 30]], 0.22, 0.05);

  let eyes;
  if (expr === 'happy') {
    eyes = [eL, eR].map((x) => K.stroke(`M${x - 24},${eyeY + 6} Q${x},${eyeY - 22} ${x + 24},${eyeY + 6}`, 10, C.brownEye)).join('');
  } else if (expr === 'evil') {
    // half-lidded, pupils sliding to the side, heavy V brows: plotting something
    eyes = [[eL, 1], [eR, -1]].map(([x, s]) => {
      const lid = `M${x - 34},${eyeY - 4 - 9 * s} L${x + 34},${eyeY - 4 + 9 * s} L${x + 34},${eyeY - 60} L${x - 34},${eyeY - 60} Z`;
      const ball = K.circle(x, eyeY, 25);
      return K.shape(ball, C.white, { line: 6 }) +
        K.clipped(ball, `<circle cx="${x + 12}" cy="${eyeY + 6}" r="15" fill="${C.brownEye}"/><circle cx="${x + 17}" cy="${eyeY + 1}" r="5" fill="${C.white}"/><path d="${lid}" fill="${C.dogShade}"/>`) +
        K.stroke(`M${x - 36},${eyeY - 6 - 10 * s} L${x + 36},${eyeY - 6 + 10 * s}`, 9) +
        K.stroke(`M${x - 44 * s},${eyeY - 54} L${x + 34 * s},${eyeY - 30}`, 22, C.white) +
        K.stroke(`M${x - 44 * s},${eyeY - 54} L${x + 34 * s},${eyeY - 30}`, 13);
    }).join('');
  } else {
    eyes = [eL, eR].map((x) =>
      `<circle cx="${x}" cy="${eyeY}" r="23" fill="${C.brownEye}"/>` +
      `<circle cx="${x + 8}" cy="${eyeY - 9}" r="7.5" fill="${C.white}"/>` +
      `<circle cx="${x - 8}" cy="${eyeY + 10}" r="3" fill="${C.white}"/>`).join('');
  }
  const mouth = expr === 'sad'
    ? K.stroke('M540,420 V434', 7.5) + K.stroke('M516,454 C526,440 554,440 564,454', 7.5)
    : expr === 'evil'
    ? K.stroke('M540,420 V434', 7.5) + K.shape('M556,444 L566,466 L574,440 Z', C.white, { line: 5 }) +
      K.stroke('M494,436 C520,452 556,452 588,428', 8.5) + K.stroke('M588,428 C596,422 600,414 600,404', 8)
    : expr === 'happy'
      ? K.shape('M508,434 C516,462 564,462 572,434 Z', C.pinkShade, { line: 6 }) + K.stroke('M540,420 V434', 6)
      : K.stroke('M540,420 V436', 7.5) + K.stroke('M516,444 C528,452 536,450 540,440 C544,450 552,452 564,444', 7.5);

  const shadeSide = K.shag([[372, 120], [354, 200], [350, 280], [362, 356], [392, 420], [444, 466], [516, 494], [600, 504], [600, 560], [250, 560], [250, 120]], [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0, 0, 0, 0], [0.1, 0.1, 0.12, 0.14, 0.14, 0.14, 0.1, 0, 0, 0, 0]);
  const box = [250, 60, 830, 520];
  const earShade = (ear, side) => K.clipped(ear, side < 0
    ? K.shape(K.shag([[372, 96], [356, 170], [346, 250], [340, 360], [440, 360], [440, 96]], 0.25, 0.1), C.dogShade, { line: 0 }) + K.shape(K.ellipse(298, 344, 46, 22), C.dogCream, { line: 0 })
    : K.shape(K.shag([[708, 96], [724, 170], [734, 250], [740, 360], [640, 360], [640, 96]], 0.25, 0.1), C.dogShade, { line: 0 }) + K.shape(K.ellipse(782, 344, 46, 22), C.dogCream, { line: 0 }));
  const svg = `<g class="perrito-cabeza" transform="rotate(${tilt} 540 300)">
    ${K.silhouette([head, earL, earR])}
    ${K.shape(head, C.dogWhite)}
    ${K.clipped(head, K.shape(shadeSide, C.dogShade, { line: 0 }))}
    ${K.shape(patch(eL), C.dogPatch, { line: 0 })}${K.shape(patch(eR), C.dogPatch, { line: 0 })}
    ${K.shape(muzzle, C.white, { line: 0 })}
    ${K.clipped(muzzle, K.shape(K.shag([[420, 452], [480, 440], [540, 436], [600, 440], [660, 452], [660, 520], [420, 520]], 0.3, 0.1), C.dogBeard, { line: 0 }))}
    ${['M494,428 C500,448 506,462 516,476', 'M586,428 C580,448 574,462 564,476', 'M530,452 C532,466 533,478 535,492', 'M550,452 C548,466 547,478 545,492']
      .map((d) => K.stroke(d, 6.5, LINE_FUR)).join('')}
    ${eyes}
    ${expr === 'evil' ? '' : K.shape(brow(eL, 1), C.dogDeep, { line: 0 }) + K.shape(brow(eR, -1), C.dogDeep, { line: 0 })}
    ${mouth}
    ${K.shape(nose, C.black, { line: 6 })}
    <ellipse cx="520" cy="354" rx="17" ry="9" fill="#62626E"/>
    ${K.shape(earL, C.dogEar, { line: 6, color: LINE_FUR })}${earShade(earL, -1)}
    ${K.shape(earR, C.dogEar, { line: 6, color: LINE_FUR })}${earShade(earR, 1)}
    ${tear ? K.shape('M452,296 C444,316 436,330 436,342 C436,356 446,364 456,364 C466,364 474,356 474,342 C474,330 462,314 452,296 Z', '#8FD3F4', { line: 6.5 }) +
      K.stroke('M446,338 C446,346 450,352 456,354', 5.5, C.white) : ''}
  </g>`;
  return { svg, outline: [head, earL, earR] };
}

// Varsity jacket torso (behind the head). Returns svg string.
function jacket() {
  const body = 'M368,404 C324,456 304,544 302,640 L300,790 L780,790 L778,640 C776,544 756,456 712,404 Z';
  const chest = K.tuft(K.sym([[540, 392], [596, 394], [632, 404], [622, 450], [600, 492], [572, 524], [540, 548]]), 0.3, 0.12);
  const collarL = 'M436,400 C450,472 488,534 540,562 L540,594 C472,564 422,492 404,412 Z';
  const collarR = K.flipD(collarL, 540);
  return K.silhouette([body]) + K.shape(body, C.navy) +
    K.clipped(body, K.shape('M302,470 C340,560 356,680 350,800 L290,800 V470 Z', C.navyShade, { line: 0 })) +
    K.shape(collarL, C.navy) + K.shape(collarR, C.navy) +
    K.stroke('M426,406 C442,480 482,540 540,570', 6, C.white) + K.stroke('M654,406 C638,480 598,540 540,570', 6, C.white) +
    K.shape(chest, C.cream, { line: K.IN }) +
    K.stroke('M520,470 C526,490 530,505 532,520', 6.5, LINE_FUR) + K.stroke('M566,462 C562,480 558,494 552,508', 6.5, LINE_FUR);
}

// Sleeves + cuffs reaching toward (pawL, pawR); paws drawn by caller
function sleeves() {
  const sleeveL = 'M356,446 C316,472 310,534 336,564 C354,584 384,588 408,578 L452,556 C444,520 428,484 404,456 Z';
  const cuffL = 'M404,580 L452,554 L470,584 L420,610 Z';
  const sleeveR = K.flipD(sleeveL, 540), cuffR = K.flipD(cuffL, 540);
  return K.halo([sleeveL, sleeveR, cuffL, cuffR]) + K.silhouette([sleeveL, sleeveR, cuffL, cuffR]) +
    K.shape(sleeveL, C.gray) + K.shape(sleeveR, C.gray) +
    K.clipped(sleeveL, K.shape('M300,470 C320,540 360,580 420,590 L300,620 Z', C.grayShade, { line: 0 })) +
    K.clipped(sleeveR, K.shape('M780,470 C760,540 720,580 660,590 L780,620 Z', C.grayShade, { line: 0 })) +
    K.grain(sleeveL, '#C9CFD9', { box: [300, 440, 460, 600], spacing: 16, rmin: 2.2, rmax: 3.2, seed: 3 }) +
    K.grain(sleeveR, '#C9CFD9', { box: [620, 440, 780, 600], spacing: 16, rmin: 2.2, rmax: 3.2, seed: 4 }) +
    K.shape(cuffL, C.navy) + K.shape(cuffR, C.navy) +
    K.clipped(cuffL, K.stroke('M400,596 L470,558', 6, C.white) + K.stroke('M408,610 L478,572', 6, C.white)) +
    K.clipped(cuffR, K.stroke('M680,596 L610,558', 6, C.white) + K.stroke('M672,610 L602,572', 6, C.white));
}

// Sleeve as a curved tube from the shoulder to the wrist, navy striped cuff
// at the end (stripes perpendicular to the arm direction).
function arm(p0, c1, c2, p1, w = 84) {
  const d = `M${p0} C${c1} ${c2} ${p1}`;
  const [x2, y2] = c2.split(',').map(Number), [x1, y1] = p1.split(',').map(Number);
  const len = Math.hypot(x1 - x2, y1 - y2), ux = (x1 - x2) / len, uy = (y1 - y2) / len;
  const at = (t) => [x1 - ux * t, y1 - uy * t];
  const [cx0, cy0] = at(46), [cx1, cy1] = at(0);
  const cuff = `M${cx0.toFixed(1)},${cy0.toFixed(1)} L${cx1.toFixed(1)},${cy1.toFixed(1)}`;
  const stripe = (t) => { const [sx, sy] = at(t); const h = w / 2 + 4; return K.stroke(`M${(sx - uy * h).toFixed(1)},${(sy + ux * h).toFixed(1)} L${(sx + uy * h).toFixed(1)},${(sy - ux * h).toFixed(1)}`, 6, C.white); };
  const butt = (str) => str.replace('stroke-linecap="round"', 'stroke-linecap="butt"');
  return K.limb(d, w, C.gray) +
    butt(K.stroke(cuff, w + 4 + 14, C.white)) +
    butt(K.stroke(cuff, w + 4, C.ink)) +
    butt(K.stroke(cuff, w - 10, C.navy)) +
    stripe(16) + stripe(30);
}
// Arms resting forward on a ledge (paws drawn by caller at ≈(404, 736) and (676, 736))
const sleevesDown = () =>
  arm('372,470', '340,540', '360,640', '398,704') + arm('708,470', '740,540', '720,640', '682,704');

const pawD = (x, y, rx = 46, ry = 42) => K.tuft(K.arc(x, y, rx, ry, -180, 180, 10).slice(0, 9), 0.28, 0.06);
const paw = (x, y, flip = 1) => K.popped([pawD(x, y)], C.white) +
  K.stroke(`M${x - 14 * flip},${y + 8} L${x - 10 * flip},${y + 40}`, 7.5) + K.stroke(`M${x + 14 * flip},${y + 4} L${x + 16 * flip},${y + 38}`, 7.5);

module.exports = { dogHead, jacket, sleeves, sleevesDown, paw, pawD, LINE_FUR };
