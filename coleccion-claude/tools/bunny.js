// "Conejo malo": the reggaeton bunny for the Bad Bunny–style jokes. A cartoon
// rabbit (not the artist's likeness): bucket hat with the ears through it,
// sunglasses, cocky grin with buck teeth, gold chain, oversized tee.
// Head centered on x = 540, y ≈ 300.
const { C } = require('./lib');
const K = require('./kit');
const P2 = require('./props2');

const B = { fur: '#F1ECF6', furShade: '#D8CDE6', ear: '#F4A7B9', hat: '#B7E26A', hatShade: '#8CBF3F', tee: '#1E2235', teeShade: '#141726', chain: '#F2C14E', chainShade: '#C8952A' };

const HEAD = K.smooth([[540, 170], [620, 178], [682, 216], [712, 280], [706, 346], [668, 400], [606, 432], [540, 440], [474, 432], [412, 400], [374, 346], [368, 280], [398, 216], [460, 178]]);
// one ear straight, one ear folded over
const EAR_L = 'M470,196 C440,120 430,40 452,-24 C468,-62 506,-58 514,-18 C524,40 520,120 512,190 Z';
const EAR_R = 'M572,190 C590,120 616,60 660,30 C696,8 740,22 734,58 C728,92 690,108 664,130 C640,150 620,176 608,200 Z';
const EAR_L_IN = 'M482,170 C462,110 458,46 470,0 C478,-24 498,-20 500,4 C504,52 502,114 498,170 Z';
const EAR_R_IN = 'M588,176 C604,124 624,84 656,58 C680,40 708,44 706,62 C702,82 676,94 654,112 C632,130 616,152 604,178 Z';
const HAT_CROWN = 'M410,226 C416,150 470,118 540,118 C610,118 664,150 670,226 Z';
const HAT_BRIM = 'M354,236 C380,206 460,198 540,198 C620,198 700,206 726,236 C740,262 650,272 540,272 C430,272 340,262 354,236 Z';

function bunnyHead({ expr = 'cocky' } = {}) {
  const mouth = expr === 'cocky'
    ? K.stroke('M492,372 C516,392 572,392 600,360', 9) + K.shape('M528,386 L528,412 Q540,418 552,412 L552,388 Z', C.white, { line: 6 }) + K.stroke('M540,388 V414', 4)
    : K.stroke('M500,372 Q540,402 580,372', 9) + K.shape('M528,384 L528,410 Q540,416 552,410 L552,386 Z', C.white, { line: 6 });
  const svg = `<g class="conejo-cabeza">
    ${K.silhouette([EAR_L, EAR_R])}
    ${K.shape(EAR_L, B.fur)}${K.shape(EAR_R, B.fur)}
    ${K.shape(EAR_L_IN, B.ear, { line: 0 })}${K.shape(EAR_R_IN, B.ear, { line: 0 })}
    ${K.silhouette([HEAD])}
    ${K.shape(HEAD, B.fur)}
    ${K.clipped(HEAD, K.shape('M366,250 C380,350 440,420 540,446 L360,446 Z', B.furShade, { line: 0 }))}
    ${K.shape(K.ellipse(540, 362, 74, 48), C.white, { line: 0 })}
    ${K.shape(K.ellipse(452, 360, 26, 16), '#F7B8C8', { line: 0 })}${K.shape(K.ellipse(628, 360, 26, 16), '#F7B8C8', { line: 0 })}
    ${P2.sunglasses(540, 300, 270)}
    ${K.shape('M526,340 L554,340 Q552,356 540,360 Q528,356 526,340 Z', B.ear, { line: 6 })}
    ${mouth}
    ${['M470,352 L404,342', 'M470,366 L406,372', 'M610,352 L676,342', 'M610,366 L674,372'].map((d) => K.stroke(d, 6)).join('')}
    ${K.silhouette([HAT_CROWN, HAT_BRIM])}
    ${K.shape(HAT_CROWN, B.hat)}${K.clipped(HAT_CROWN, K.shape('M600,110 C650,140 680,190 680,240 L700,240 V100 Z', B.hatShade, { line: 0 }))}
    ${K.stroke('M414,206 C470,192 610,192 666,206', 14, B.hatShade)}
    ${K.shape(HAT_BRIM, B.hat)}${K.clipped(HAT_BRIM, K.shape('M340,250 C440,266 640,266 740,250 V280 H340 Z', B.hatShade, { line: 0 }))}
  </g>`;
  return { svg, outline: [HEAD, EAR_L, EAR_R, HAT_CROWN, HAT_BRIM] };
}

// Ears poking out through the hat: draw these after the hat
function earsThroughHat() {
  const cut = 'M300,-120 H800 V150 C700,140 600,128 540,128 C480,128 380,140 300,150 Z';
  return K.clipped(cut, K.shape(EAR_L, B.fur) + K.shape(EAR_L_IN, B.ear, { line: 0 }) + K.shape(EAR_R, B.fur) + K.shape(EAR_R_IN, B.ear, { line: 0 }));
}

// Oversized tee + gold chain (bust), shoulders at y ≈ 450
const TEE = 'M352,486 C382,452 444,436 486,432 L594,432 C636,436 698,452 728,486 C768,536 782,636 786,770 L294,770 C298,636 312,536 352,486 Z';
function bunnyTee() {
  const links = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, x = 470 + 140 * t, y = 448 + 70 * Math.sin(Math.PI * t);
    links.push(K.shape(K.ellipse(x, y, 13, 9), B.chain, { line: 5 }));
  }
  const medal = K.shape(K.circle(540, 548, 34), B.chain, { line: 7 }) + K.shape(K.circle(540, 548, 20), B.chainShade, { line: 0 }) +
    `<path d="M528,540 L540,530 L552,540 L548,558 L532,558 Z" fill="${B.chain}"/>`;
  return K.silhouette([TEE]) + K.shape(TEE, B.tee) +
    K.clipped(TEE, K.shape('M296,520 C330,600 344,690 340,780 L290,780 Z', B.teeShade, { line: 0 }) +
      K.shape('M784,520 C750,600 736,690 740,780 L790,780 Z', B.teeShade, { line: 0 })) +
    K.stroke('M486,432 C500,466 580,466 594,432', 9, '#33384F') + links.join('') + medal;
}

module.exports = { bunnyHead, earsThroughHat, bunnyTee, TEE, B };
