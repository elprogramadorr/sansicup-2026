// Juki, the Juki Judge mascot (referencias/juki/juki-judge-court.jpg): an
// Andean spectacled bear ("jukumari") with slate fur, a cream band arching over
// both eyes and running down to a khaki muzzle, khaki bib on the lower face,
// blue judge robe, white collar, red tie, dark gavel. Head centered on x = 540.
const { C } = require('./lib');
const K = require('./kit');

const J = {
  fur: '#535A6E', furShade: '#3E4454', furDark: '#2B2F3B',
  band: '#ECE3BC', khaki: '#BDB685', khakiShade: '#9E9763',
  robe: '#2F6DB5', robeShade: '#24599A', robeLight: '#4F8BD0',
  tie: '#E05A5A', tieShade: '#B8403F', paw: '#4B505F', pawLine: '#7C8296',
  gavel: '#47525C', gavelLight: '#66737E',
};

const HEAD = K.smooth([[540, 70], [612, 76], [670, 104], [708, 152], [724, 212], [720, 272], [704, 330], [672, 380], [626, 414], [576, 432], [540, 436],
  [504, 432], [454, 414], [408, 380], [376, 330], [360, 272], [356, 212], [372, 152], [410, 104], [468, 76]]);
const EARS = [K.circle(424, 104, 56), K.circle(656, 104, 56)];
// pale brows arching over each eye, joined by a pale bridge down to the muzzle
const BROW_L = 'M444,232 C448,196 480,170 526,168 L536,186 C500,186 472,202 460,236 Z';
const BAND = BROW_L + ' ' + K.flipD(BROW_L, 540) + ' M518,170 C530,158 550,158 562,170 L590,256 C572,272 508,272 490,256 Z';
const MUZZLE = K.smooth([[540, 250], [582, 256], [608, 282], [614, 316], [598, 346], [566, 362], [540, 364], [514, 362], [482, 346], [466, 316], [472, 282], [498, 256]]);
const BIB = K.tuft([[384, 318], [430, 348], [476, 366], [540, 374], [604, 366], [650, 348], [696, 318], [706, 384], [684, 440], [640, 474], [540, 492], [440, 474], [396, 440], [374, 384]], 0.18, 0.06);

function jukiHead({ expr = 'smile' } = {}) {
  const eyes = expr === 'wink'
    ? `<circle cx="490" cy="232" r="15" fill="${J.furDark}"/><circle cx="495" cy="227" r="5" fill="${C.white}"/>` + K.stroke('M574,236 Q590,220 606,236', 9, J.furDark)
    : [490, 590].map((x) => `<circle cx="${x}" cy="232" r="15" fill="${J.furDark}"/><circle cx="${x + 5}" cy="227" r="5" fill="${C.white}"/>`).join('');
  const brows = expr === 'stern' ? K.stroke('M462,206 L516,220', 10, J.furDark) + K.stroke('M618,206 L564,220', 10, J.furDark) : '';
  const mouth = expr === 'open'
    ? K.stroke('M540,308 V320', 7) + K.shape('M502,320 C510,360 570,360 578,320 Z', '#7A2F3A', { line: 7 }) + K.shape('M520,336 C530,346 550,346 560,336 C552,332 528,332 520,336 Z', '#E58A8A', { line: 0 })
    : K.stroke('M540,308 V322', 7) + K.stroke('M502,320 Q540,352 578,320', 8);
  const svg = `<g class="juki-cabeza">
    ${EARS.map((d) => K.shape(d, J.fur)).join('')}
    ${K.shape(K.circle(426, 96, 30), J.furDark, { line: 0 })}${K.shape(K.circle(654, 96, 30), J.furDark, { line: 0 })}
    ${K.shape(HEAD, J.fur)}
    ${K.clipped(HEAD, K.shape('M356,170 C366,290 426,392 540,440 L340,440 Z', J.furShade, { line: 0 }))}
    ${K.clipped(HEAD, K.shape(BIB, J.khaki, { line: 0 }) + K.shape(K.shag([[540, 392], [566, 410], [604, 402], [588, 432], [612, 458], [574, 456], [556, 486], [540, 462], [524, 486], [506, 456], [468, 458], [492, 432], [476, 402], [514, 410]], 0.12, 0.04, 0.05), J.khakiShade, { line: 0 }))}
    ${K.shape(BAND, J.band, { line: 0 })}
    ${K.shape(MUZZLE, J.khaki, { line: 0 })}
    ${eyes}${brows}
    ${K.shape('M514,280 C520,264 560,264 566,280 C570,294 556,308 540,308 C524,308 510,294 514,280 Z', J.furDark, { line: 0 })}
    <ellipse cx="528" cy="278" rx="9" ry="5" fill="#8A90A3"/>
    ${mouth}
  </g>`;
  return { svg, outline: [HEAD, ...EARS] };
}

// Robe + shirt collar + tie (bust), shoulders at y ≈ 420
const ROBE = 'M332,474 C364,432 432,412 474,406 L606,406 C648,412 716,432 748,474 C790,526 806,626 812,770 L268,770 C274,626 290,526 332,474 Z';
function jukiRobe() {
  const shirt = 'M474,404 L540,520 L606,404 Z';
  const neck = K.tuft([[468, 396], [612, 396], [592, 444], [540, 478], [488, 444]], 0.14, 0.04);
  const collarL = 'M474,402 L534,476 L500,500 L452,424 Z';
  const tie = 'M528,470 L552,470 L560,490 L552,502 L564,594 L540,622 L516,594 L528,502 L520,490 Z';
  return K.shape(ROBE, J.robe) +
    K.clipped(ROBE, K.shape('M270,520 C300,600 320,690 330,780 L260,780 Z', J.robeShade, { line: 0 }) +
      K.shape('M810,520 C780,600 760,690 750,780 L820,780 Z', J.robeShade, { line: 0 }) +
      K.stroke('M392,560 C400,620 404,690 400,760', 7, J.robeShade) + K.stroke('M688,560 C680,620 676,690 680,760', 7, J.robeShade) +
      K.stroke('M470,404 C500,470 520,520 540,560', 7, J.robeShade) + K.stroke('M610,404 C580,470 560,520 540,560', 7, J.robeShade)) +
    K.shape(shirt, C.white) + K.shape(neck, J.khaki, { line: 0 }) +
    K.shape(tie, J.tie) + K.clipped(tie, K.shape('M540,468 L570,468 L570,630 L540,630 Z', J.tieShade, { line: 0 })) +
    K.shape(collarL, C.white) + K.shape(K.flipD(collarL, 540), C.white);
}

// Paw (front view) with finger lines; (x, y) center
const pawD = (x, y, r = 40) => K.smooth([[x - r, y - r * 0.2], [x - r * 0.6, y - r * 0.85], [x, y - r], [x + r * 0.6, y - r * 0.85], [x + r, y - r * 0.2], [x + r * 0.8, y + r * 0.6], [x, y + r * 0.85], [x - r * 0.8, y + r * 0.6]]);
const paw = (x, y, r = 40) => K.silhouette([pawD(x, y, r)]) + K.shape(pawD(x, y, r), J.paw) +
  [-0.35, 0, 0.35].map((t) => K.stroke(`M${x + t * r},${y - r * 0.55} L${x + t * r},${y - r * 0.15}`, 5, J.pawLine)).join('');

// Robe sleeve from shoulder to wrist
const sleeve = (d, w = 92) => K.limb(d, w, J.robe);

// Gavel, head centered at (x, y), rotated
function gavel(x, y, rot = 0, s = 1) {
  const head = `M${-70},${-26} H70 Q84,-26 84,-12 V12 Q84,26 70,26 H-70 Q-84,26 -84,12 V-12 Q-84,-26 -70,-26 Z`;
  const handle = 'M-10,24 H10 L14,190 Q14,204 0,204 Q-14,204 -14,190 Z';
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    ${K.halo([head, handle])}${K.silhouette([head, handle])}
    ${K.shape(handle, J.gavelLight)}${K.shape(head, J.gavel)}
    ${K.shape('M-44,-26 H-28 V26 H-44 Z', J.gavelLight, { line: 0 })}${K.shape('M28,-26 H44 V26 H28 Z', J.gavelLight, { line: 0 })}
    ${K.stroke('M-60,-14 H40', 6, J.gavelLight)}
  </g>`;
}

// Memphis confetti from the Juki brand: ring, triangle, squiggle, stick
function confetti(items) {
  return items.map(([kind, x, y, s = 1, rot = 0]) => {
    const g = (inner) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${inner}</g>`;
    if (kind === 'ring') return g(K.stroke(K.circle(0, 0, 26), 30, C.white) + K.stroke(K.circle(0, 0, 26), 22, C.ink) + K.stroke(K.circle(0, 0, 26), 12, '#7FA6F0'));
    if (kind === 'tri') return g(['M-24,-24 L30,0 L-24,24 Z'].map((d) => K.stroke(d, 30, C.white) + K.stroke(d, 22, C.ink) + K.stroke(d, 12, '#E86A7A')).join(''));
    if (kind === 'squig') { const d = 'M-40,10 C-28,-20 -12,-20 0,0 C12,20 28,20 40,-10'; return g(K.stroke(d, 34, C.white) + K.stroke(d, 26, C.ink) + K.stroke(d, 16, '#8A4AA6')); }
    const d = 'M-30,10 L30,-10'; return g(K.stroke(d, 34, C.white) + K.stroke(d, 26, C.ink) + K.stroke(d, 16, '#F2C46D'));
  }).join('');
}

module.exports = { jukiHead, jukiRobe, ROBE, paw, pawD, sleeve, gavel, confetti, J };
