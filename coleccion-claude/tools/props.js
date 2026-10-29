// Props shared by the collection: trophy, ICPC balloons, laptop, keycap,
// halo, devil horns.
const { C, textPath } = require('./lib');
const K = require('./kit');

// Trophy, base centered at (x, y), height h. White halo keeps it readable on
// dark backgrounds.
function trophy(x, y, h, rot = 0, { sparkles = false } = {}) {
  const k = h / 300;
  const cup = 'M-95,-300 H95 C95,-205 60,-150 0,-140 C-60,-150 -95,-205 -95,-300 Z';
  const handleL = 'M-88,-272 C-150,-280 -158,-200 -78,-185';
  const handleR = 'M88,-272 C150,-280 158,-200 78,-185';
  const stem = 'M-22,-146 H22 L30,-70 H-30 Z';
  const base = 'M-62,-72 H62 C70,-72 72,-66 72,-58 V-16 H-72 V-58 C-72,-66 -70,-72 -62,-72 Z';
  const plinth = 'M-88,-18 H88 V0 H-88 Z';
  const parts = [cup, stem, base, plinth];
  const u = (v) => v / k;
  const halo = u(K.OUT * 2 + 16);
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">
    <g fill="${C.white}" stroke="${C.white}" stroke-linejoin="round" stroke-linecap="round">
      ${[handleL, handleR].map((d) => `<path d="${d}" fill="none" stroke-width="${halo + u(18)}"/>`).join('')}
      ${parts.map((d) => `<path d="${d}" stroke-width="${halo}"/>`).join('')}
    </g>
    <g fill="none" stroke="${C.ink}" stroke-width="${u(K.OUT * 2 + 18)}" stroke-linecap="round">${[handleL, handleR].map((d) => `<path d="${d}"/>`).join('')}</g>
    <g fill="${C.ink}" stroke="${C.ink}" stroke-width="${u(K.OUT * 2)}" stroke-linejoin="round">${parts.map((d) => `<path d="${d}"/>`).join('')}</g>
    <g fill="none" stroke="${C.goldShade}" stroke-width="${u(18)}" stroke-linecap="round">${[handleL, handleR].map((d) => `<path d="${d}"/>`).join('')}</g>
    ${K.shape(stem, C.goldShade, { line: u(K.IN) })}
    ${K.shape(base, C.navy, { line: u(K.IN) })}
    ${K.shape(plinth, C.goldShade, { line: u(K.IN) })}
    ${K.shape(cup, C.gold, { line: u(K.IN) })}
    ${K.halftone(cup, C.goldShade, { box: [-100, -300, 100, -140], spacing: u(16), angle: 0, from: -1.2, to: 1.1, rmax: u(6.5) })}
    ${K.clipped(cup, `<path d="M40,-300 H110 V-130 H0 C46,-170 50,-240 40,-300 Z" fill="${C.goldShade}"/>`)}
    <path d="M-62,-280 C-62,-235 -48,-200 -28,-180" fill="none" stroke="${C.goldLight}" stroke-width="${u(16)}" stroke-linecap="round"/>
    <path d="M-30,-48 H30" stroke="${C.gold}" stroke-width="${u(10)}" stroke-linecap="round"/>
    ${sparkles ? K.sparkle(-150, -330, u(34), C.yellow, u(6)) + K.sparkle(150, -250, u(22), C.white, u(6)) : ''}
  </g>`;
}

// Solid shade per balloon color (no transparency in print files)
const BALLOON_SHADE = { [C.red]: '#A80F20', [C.yellow]: '#E89A1C', [C.royal]: '#1F4FA0', [C.green]: '#2C7A3B', [C.orange]: '#C4682A' };

// ICPC balloon: color + problem letter, knot, highlight. (x, y) = center.
function balloon(x, y, r, color, { letter = '', shade, string = null, tilt = 0, letterColor = C.white } = {}) {
  const body = `M${x},${y - r * 1.12} C${x + r * 0.95},${y - r * 1.12} ${x + r * 1.05},${y + r * 0.1} ${x + r * 0.2},${y + r * 0.98} C${x + r * 0.08},${y + r * 1.08} ${x - r * 0.08},${y + r * 1.08} ${x - r * 0.2},${y + r * 0.98} C${x - r * 1.05},${y + r * 0.1} ${x - r * 0.95},${y - r * 1.12} ${x},${y - r * 1.12} Z`;
  const knot = `M${x - r * 0.14},${y + r * 1.16} L${x + r * 0.14},${y + r * 1.16} L${x + r * 0.06},${y + r * 1.0} L${x - r * 0.06},${y + r * 1.0} Z`;
  const shadeC = shade || BALLOON_SHADE[color] || C.navy;
  let out = '';
  if (string) out += K.stroke(`M${x},${y + r * 1.16} ${string}`, 7.5, C.ink);
  const lt = letter ? textPath(letter, { fontName: 'BarlowCondensed-Black', size: r * 0.95, x, y: y + r * 0.34, anchor: 'middle' }) : null;
  out += `<g transform="rotate(${tilt} ${x} ${y})">
    ${K.halo([body, knot], K.OUT * 2 + 10)}
    ${K.silhouette([body, knot])}
    ${K.shape(body, color)}
    ${K.clipped(body, K.shape(`M${x + r * 0.35},${y - r * 1.2} C${x + r * 1.0},${y - r * 0.6} ${x + r * 0.9},${y + r * 0.5} ${x + r * 0.1},${y + r * 1.1} L${x + r * 1.4},${y + r * 1.2} L${x + r * 1.4},${y - r * 1.3} Z`, shadeC, { line: 0 }))}
    ${K.shape(knot, color)}
    ${lt ? `<path d="${lt.d}" fill="${letterColor}"/>` : ''}
    <path d="M${x - r * 0.5},${y - r * 0.55} C${x - r * 0.42},${y - r * 0.82} ${x - r * 0.2},${y - r * 0.92} ${x - r * 0.02},${y - r * 0.9}" fill="none" stroke="${C.white}" stroke-width="${r * 0.13}" stroke-linecap="round"/>
  </g>`;
  return out;
}

// Open laptop seen from the back-left (lid toward viewer). (x, y) = base front-center.
function laptop(x, y, w, { lidColor = '#3B4150', logo = 'check' } = {}) {
  const h = w * 0.66;
  const lid = `M${x - w / 2},${y - h} L${x + w / 2 - 10},${y - h - 8} C${x + w / 2},${y - h - 8} ${x + w / 2 + 4},${y - h} ${x + w / 2 + 4},${y - h + 12} L${x + w / 2},${y - 10} L${x - w / 2 + 8},${y - 2} C${x - w / 2},${y - 2} ${x - w / 2 - 4},${y - 8} ${x - w / 2 - 4},${y - 16} Z`;
  const base = `M${x - w / 2 - 20},${y - 6} L${x + w / 2 + 26},${y - 16} L${x + w / 2 + 34},${y + 4} L${x - w / 2 - 14},${y + 18} Z`;
  let mark = '';
  if (logo === 'check') {
    mark = K.stroke(`M${x - w * 0.12},${y - h * 0.5} L${x - w * 0.02},${y - h * 0.38} L${x + w * 0.16},${y - h * 0.64}`, w * 0.07, C.yellow);
  }
  return K.halo([lid, base]) + K.silhouette([lid, base]) + K.shape(base, C.gray) + K.shape(lid, lidColor) +
    K.clipped(lid, K.shape(`M${x + w * 0.1},${y - h - 20} L${x + w},${y - h - 20} L${x + w},${y + 10} L${x + w * 0.3},${y + 10} Z`, '#2C313D', { line: 0 })) + mark;
}

// 3D keycap with a label. (x, y) = top-face center, s = size
function keycap(x, y, s, label, { color = '#7D58B8', top = '#9573D0', side = '#5C3E91', textColor = C.white, font = 'BarlowCondensed-Black' } = {}) {
  const t = s * 0.5, b = s * 0.62;
  const topD = `M${x - t},${y - t + 14} Q${x - t},${y - t} ${x - t + 14},${y - t} L${x + t - 14},${y - t} Q${x + t},${y - t} ${x + t},${y - t + 14} L${x + t},${y + t - 14} Q${x + t},${y + t} ${x + t - 14},${y + t} L${x - t + 14},${y + t} Q${x - t},${y + t} ${x - t},${y + t - 14} Z`;
  const bodyD = `M${x - b},${y - t + 30} L${x - t},${y - t} L${x + t},${y - t} L${x + b},${y - t + 30} L${x + b},${y + b + 26} Q${x + b},${y + b + 44} ${x + b - 18},${y + b + 44} L${x - b + 18},${y + b + 44} Q${x - b},${y + b + 44} ${x - b},${y + b + 26} Z`;
  const lt = textPath(label, { fontName: font, size: s * 0.72, x, y: y + s * 0.26, anchor: 'middle' });
  return K.halo([bodyD]) + K.silhouette([bodyD]) + K.shape(bodyD, side) +
    K.shape(`M${x - b},${y + b - 10} L${x + b},${y + b - 10} L${x + b},${y + b + 30} Q${x + b},${y + b + 44} ${x + b - 18},${y + b + 44} L${x - b + 18},${y + b + 44} Q${x - b},${y + b + 44} ${x - b},${y + b + 30} Z`, color, { line: 0 }) +
    K.shape(topD, top) + `<path d="${lt.d}" fill="${textColor}"/>` +
    K.stroke(`M${x - t + 18},${y - t + 16} L${x - t + 60},${y - t + 16}`, 8, '#B9A2E4');
}

// Golden halo ring (angel) centered at (x, y)
const haloRing = (x, y, rx, ry) =>
  K.shape(K.ellipse(x, y, rx + 14, ry + 10), C.gold, { line: K.OUT }) +
  K.shape(K.ellipse(x, y, rx - 10, ry - 8), C.white, { line: K.IN }) +
  K.stroke(`M${x - rx * 0.6},${y - ry * 0.75} Q${x - rx * 0.2},${y - ry - 6} ${x + rx * 0.3},${y - ry * 0.9}`, 7, C.goldLight);

// Small devil horn pair over a head; (x1, y1), (x2, y2) = horn bases
function horns(x1, y1, x2, y2, s = 1) {
  const horn = (x, y, dir) => `M${x - 26 * s},${y} C${x - 22 * s},${y - 40 * s} ${x + dir * 8 * s},${y - 70 * s} ${x + dir * 30 * s},${y - 86 * s} C${x + dir * 22 * s},${y - 56 * s} ${x + 28 * s},${y - 30 * s} ${x + 26 * s},${y} Z`;
  const a = horn(x1, y1, -1), b = horn(x2, y2, 1);
  return K.halo([a, b]) + K.silhouette([a, b]) + K.shape(a, C.red) + K.shape(b, C.red) +
    K.stroke(`M${x1 - 12 * s},${y1 - 14 * s} C${x1 - 12 * s},${y1 - 34 * s} ${x1 - 16 * s},${y1 - 50 * s} ${x1 - 24 * s},${y1 - 62 * s}`, 6, '#F26B7B') +
    K.stroke(`M${x2 - 12 * s},${y2 - 14 * s} C${x2 - 8 * s},${y2 - 34 * s} ${x2 + 2 * s},${y2 - 50 * s} ${x2 + 14 * s},${y2 - 62 * s}`, 6, '#F26B7B');
}

module.exports = { trophy, balloon, laptop, keycap, haloRing, horns };
