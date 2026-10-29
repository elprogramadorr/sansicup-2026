// Props for the exclusive set: Codeforces mark, barbell, eggplant, ice block,
// scoreboard, pennant, ticket, game cartridge, rubber stamp, speech bubble,
// headphones, sunglasses, bucket hat, whistle, clipboard, graph cycle, DP table.
// Same line system as the characters (K.OUT keyline, K.IN inner lines, halo).
const { C, textPath } = require('./lib');
const K = require('./kit');

const CF = { yellow: '#F6C343', blue: '#1E88D0', red: '#C7262E', yellowShade: '#D9A11E', blueShade: '#1668A3', redShade: '#9C1A21' };
const rrect = (x, y, w, h, r) => `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y} Z`;
const txt = (str, o) => textPath(str, o);
const fillText = (str, o, fill) => `<path d="${txt(str, o).d}" fill="${fill}"/>`;

// Codeforces-style mark: three bottom-aligned rounded bars (x, y = bottom-left)
function cfLogo(x, y, h, { line = true } = {}) {
  const w = h * 0.27, g = h * 0.07;
  const bars = [[CF.yellow, 0.62], [CF.blue, 1], [CF.red, 0.46]].map(([c, k], i) =>
    [rrect(x + i * (w + g), y - h * k, w, h * k, w * 0.28), c]);
  return (line ? K.halo(bars.map((b) => b[0])) + K.silhouette(bars.map((b) => b[0])) : '') +
    bars.map(([d, c]) => K.shape(d, c, { line: line ? K.IN : 0 })).join('');
}

// Barbell centered at (x, y), total width w; plates echo the Codeforces bars
function barbell(x, y, w) {
  const bar = rrect(x - w / 2, y - 9, w, 18, 9);
  const plate = (px, h, c) => rrect(px - 17, y - h / 2, 34, h, 12);
  const side = (dir) => [[0.36, 230, CF.blue], [0.405, 170, CF.yellow], [0.445, 120, CF.red]]
    .map(([t, h, c]) => [plate(x + dir * w * t, h), c]);
  const plates = [...side(-1), ...side(1)];
  return K.halo([bar, ...plates.map((p) => p[0])]) + K.silhouette([bar, ...plates.map((p) => p[0])]) +
    K.shape(bar, C.gray) + K.stroke(`M${x - w / 2 + 14},${y - 2} H${x + w / 2 - 14}`, 5, C.white) +
    plates.map(([d, c]) => K.shape(d, c)).join('');
}

// Eggplant: (x, y) = calyx point, length L, rotation deg
function eggplant(x, y, L, rot = 0, { face = true } = {}) {
  const k = L / 600;
  const body = K.smooth([[0, 40], [70, 70], [118, 160], [150, 300], [170, 440], [150, 560], [80, 615], [-10, 600], [-70, 520], [-90, 400], [-80, 260], [-60, 140], [-40, 60]]);
  const calyx = 'M-70,40 C-60,0 -30,-20 0,-20 C30,-20 60,0 70,40 C50,30 40,60 22,70 C14,50 6,40 0,64 C-6,40 -14,50 -22,70 C-40,60 -50,30 -70,40 Z';
  const stem = 'M-10,-14 C-14,-50 -6,-80 18,-96 L30,-84 C14,-70 10,-46 12,-14 Z';
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})">
    ${K.halo([body, calyx, stem], (K.OUT * 2 + 12) / k)}
    <g fill="${C.ink}" stroke="${C.ink}" stroke-width="${(K.OUT * 2) / k}" stroke-linejoin="round">${[body, calyx, stem].map((d) => `<path d="${d}"/>`).join('')}</g>
    ${K.shape(body, '#7B4BB7', { line: 0 })}
    ${K.clipped(body, K.shape('M60,60 C140,200 160,420 120,600 L260,600 L260,60 Z', '#55308A', { line: 0 }))}
    <path d="M-40,140 C-58,240 -60,360 -40,460" fill="none" stroke="#B394E3" stroke-width="${22}" stroke-linecap="round"/>
    ${K.shape(stem, '#3F8A3A', { line: 0 })}${K.shape(calyx, '#56A845', { line: 0 })}
    ${face ? `<circle cx="-12" cy="250" r="16" fill="${C.black}"/><circle cx="62" cy="250" r="16" fill="${C.black}"/><circle cx="-6" cy="244" r="5" fill="${C.white}"/><circle cx="68" cy="244" r="5" fill="${C.white}"/>
      <path d="M-6,300 Q26,330 58,300" fill="none" stroke="${C.ink}" stroke-width="${9}" stroke-linecap="round"/>
      <path d="M-36,224 L12,234 M88,224 L40,234" fill="none" stroke="${C.ink}" stroke-width="${10}" stroke-linecap="round"/>` : ''}
  </g>`;
}

// Ice block (rounded cube, front face) with frost and icicles; (x, y) top-left
function iceBlock(x, y, w, h, inner = '') {
  const face = rrect(x, y, w, h, 34);
  const top = `M${x + 20},${y + 6} L${x + 60},${y - 40} H${x + w + 30} L${x + w - 10},${y + 6} Z`;
  const side = `M${x + w - 6},${y + 10} L${x + w + 34},${y - 36} V${y + h - 60} L${x + w - 6},${y + h - 14} Z`;
  const icicles = [0.18, 0.34, 0.58, 0.8].map((t, i) => { const ix = x + w * t, l = [46, 30, 56, 34][i]; return `M${ix - 16},${y + h - 6} Q${ix},${y + h + l} ${ix + 16},${y + h - 6} Z`; });
  return K.halo([face, top, side, ...icicles]) + K.silhouette([face, top, side, ...icicles]) +
    K.shape(side, '#8CCBE6') + K.shape(top, '#E3F6FD') + icicles.map((d) => K.shape(d, '#BDE8F7')).join('') +
    K.shape(face, '#BDE8F7') + K.clipped(face, inner +
      K.shape(`M${x - 10},${y + h * 0.62} L${x + w + 10},${y + h * 0.3} V${y + h + 10} H${x - 10} Z`, '#A6DDF1', { line: 0, extra: '' })) +
    K.stroke(`M${x + 34},${y + 40} L${x + 34},${y + 110}`, 14, C.white) + K.stroke(`M${x + 34},${y + 136} L${x + 34},${y + 156}`, 14, C.white) +
    K.shape(face, 'none');
}

// Frozen scoreboard rows (inside the ice block): team bar + balloon cells
function scoreboard(x, y, w, rows) {
  let s = '';
  rows.forEach((cells, r) => {
    const ry = y + r * 74;
    s += `<path d="${rrect(x, ry, w * 0.28, 48, 10)}" fill="#7FB9D6"/>`;
    cells.forEach((c, i) => {
      const cx = x + w * 0.34 + i * 66;
      const col = { a: '#6FC28A', w: '#E58A8A', f: '#7FA6F0' }[c];
      s += `<path d="${rrect(cx, ry, 54, 48, 10)}" fill="${col}"/>`;
      s += c === 'f' ? `<path d="${txt('?', { fontName: 'BarlowCondensed-Black', size: 44, x: cx + 27, y: ry + 41, anchor: 'middle' }).d}" fill="#EAF3FF"/>`
        : c === 'a' ? K.stroke(`M${cx + 14},${ry + 25} L${cx + 24},${ry + 35} L${cx + 41},${ry + 14}`, 7, '#EFFFF3') : K.stroke(`M${cx + 16},${ry + 14} L${cx + 38},${ry + 34} M${cx + 38},${ry + 14} L${cx + 16},${ry + 34}`, 7, '#FFF0F0');
    });
  });
  return s;
}

// Felt pennant pointing right; (x, y) = top-left of the sleeve
function pennant(x, y, L, H, color, inner = '') {
  const flag = `M${x + 40},${y} Q${x + L * 0.55},${y + H * 0.1} ${x + L},${y + H * 0.48} Q${x + L * 0.55},${y + H * 0.92} ${x + 40},${y + H} Z`;
  const sleeve = rrect(x, y - 8, 52, H + 16, 14);
  const stitch = `M${x + 70},${y + 22} Q${x + L * 0.55},${y + H * 0.16} ${x + L - 60},${y + H * 0.48} Q${x + L * 0.55},${y + H * 0.84} ${x + 70},${y + H - 22} Z`;
  return K.halo([flag, sleeve]) + K.silhouette([flag, sleeve]) + K.shape(flag, color) +
    K.clipped(flag, K.shape(`M${x},${y + H * 0.62} Q${x + L * 0.5},${y + H * 0.7} ${x + L},${y + H * 0.48} V${y + H + 20} H${x} Z`, C.navyShade, { line: 0 })) +
    `<path d="${stitch}" fill="none" stroke="${C.white}" stroke-width="5" stroke-dasharray="14 10" stroke-linecap="round"/>` +
    inner + K.shape(sleeve, C.white) + K.stroke(`M${x + 16},${y + 6} V${y + H - 6}`, 5, C.grayShade);
}

// Event ticket with side notches and a perforated stub; (x, y) top-left
function ticket(x, y, w, h, stubW, color, inner = '') {
  const r = 34, mid = y + h / 2;
  const d = `M${x + 20},${y} H${x + w - 20} Q${x + w},${y} ${x + w},${y + 20} V${mid - r} A${r},${r} 0 0,0 ${x + w},${mid + r} V${y + h - 20} Q${x + w},${y + h} ${x + w - 20},${y + h} H${x + 20} Q${x},${y + h} ${x},${y + h - 20} V${mid + r} A${r},${r} 0 0,0 ${x},${mid - r} V${y + 20} Q${x},${y} ${x + 20},${y} Z`;
  const px = x + w - stubW;
  return K.halo([d]) + K.silhouette([d]) + K.shape(d, color) +
    K.clipped(d, K.shape(`M${px},${y - 10} H${x + w + 10} V${y + h + 10} H${px} Z`, C.yellow, { line: 0 }) +
      `<path d="M${px},${y + 8} V${y + h - 8}" stroke="${C.ink}" stroke-width="7" stroke-dasharray="4 16" stroke-linecap="round"/>`) +
    inner + K.shape(d, 'none');
}

// Retro game cartridge; (x, y) top-left
function cartridge(x, y, w, h, color, label = '') {
  const body = `M${x + 24},${y} H${x + w - 24} Q${x + w},${y} ${x + w},${y + 24} V${y + h - 60} L${x + w - 50},${y + h} H${x + 24} Q${x},${y + h} ${x},${y + h - 24} V${y + 24} Q${x},${y} ${x + 24},${y} Z`;
  const ridges = [0, 1, 2, 3].map((i) => K.stroke(`M${x + 70 + i * 34},${y + 22} V${y + 58}`, 9, '#9AA2B1')).join('');
  return K.halo([body]) + K.silhouette([body]) + K.shape(body, color) + ridges +
    K.stroke(`M${x + w * 0.62},${y + 40} H${x + w - 40}`, 9, '#9AA2B1') + label +
    K.stroke(`M${x + 40},${y + h - 30} L${x + 60},${y + h - 50} M${x + 76},${y + h - 30} L${x + 96},${y + h - 50}`, 8, '#9AA2B1');
}

// Rubber stamp: rotated rounded frame + label; (x, y) center
function stamp(x, y, label, { w = 420, h = 130, rot = -8, color = C.red, font = 'BarlowCondensed-Black', size = 92 } = {}) {
  const frame = rrect(-w / 2, -h / 2, w, h, 20);
  const t = txt(label, { fontName: font, size, x: 0, y: size * 0.35, anchor: 'middle', tracking: 4 });
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="${frame}" fill="${C.white}" stroke="${C.white}" stroke-width="40" stroke-linejoin="round"/>
    <path d="${frame}" fill="${C.white}" stroke="${color}" stroke-width="12"/>
    <path d="${rrect(-w / 2 + 16, -h / 2 + 16, w - 32, h - 32, 12)}" fill="none" stroke="${color}" stroke-width="4"/>
    <path d="${t.d}" fill="${color}"/>
  </g>`;
}

// Speech bubble (rounded rect + tail toward (tx, ty))
function bubble(x, y, w, h, tx, ty, inner = '') {
  const b = rrect(x, y, w, h, 36);
  const tail = `M${x + w * 0.22},${y + h - 4} L${tx},${ty} L${x + w * 0.42},${y + h - 4} Z`;
  return K.halo([b, tail]) + K.silhouette([b, tail]) + K.shape(tail, C.white, { line: 0 }) + K.shape(b, C.white, { line: 0 }) + inner;
}

// Sunglasses centered at (x, y), width w
function sunglasses(x, y, w, { lens = C.black } = {}) {
  const lw = w * 0.42, lh = w * 0.26;
  const L = rrect(x - w / 2, y - lh / 2, lw, lh, lh * 0.35), R = rrect(x + w / 2 - lw, y - lh / 2, lw, lh, lh * 0.35);
  return K.stroke(`M${x - w / 2 + lw - 4},${y - lh * 0.2} Q${x},${y - lh * 0.5} ${x + w / 2 - lw + 4},${y - lh * 0.2}`, 12, C.ink) +
    K.shape(L, lens, { line: 8 }) + K.shape(R, lens, { line: 8 }) +
    K.stroke(`M${x - w / 2 + lw * 0.22},${y - lh * 0.14} L${x - w / 2 + lw * 0.42},${y - lh * 0.3}`, 8, C.white) +
    K.stroke(`M${x + w / 2 - lw * 0.78},${y - lh * 0.14} L${x + w / 2 - lw * 0.58},${y - lh * 0.3}`, 8, C.white);
}

// Over-ear headphones around a head: band apex (x, y), half-width hw
function headphones(x, y, hw, cupY, color = C.red) {
  const band = `M${x - hw},${cupY} C${x - hw},${y - 40} ${x + hw},${y - 40} ${x + hw},${cupY}`;
  const cup = (cx) => rrect(cx - 34, cupY - 56, 68, 112, 30);
  return K.stroke(band, 30 + K.OUT * 2, C.ink) + K.stroke(band, 30, color) +
    K.halo([cup(x - hw), cup(x + hw)]) + K.silhouette([cup(x - hw), cup(x + hw)]) + K.shape(cup(x - hw), color) + K.shape(cup(x + hw), color) +
    K.shape(rrect(x - hw - 14, cupY - 36, 28, 72, 12), C.ink, { line: 0 }) + K.shape(rrect(x + hw - 14, cupY - 36, 28, 72, 12), C.ink, { line: 0 });
}

// Whistle on a cord; (x, y) mouth end
function whistle(x, y, s = 1) {
  const body = `M${x},${y - 22 * s} H${x + 70 * s} C${x + 110 * s},${y - 22 * s} ${x + 120 * s},${y + 40 * s} ${x + 80 * s},${y + 52 * s} C${x + 50 * s},${y + 60 * s} ${x + 30 * s},${y + 40 * s} ${x + 28 * s},${y + 22 * s} H${x} Z`;
  return K.popped([body], '#C9CED8') + `<circle cx="${x + 78 * s}" cy="${y + 16 * s}" r="${14 * s}" fill="${C.ink}"/>` + K.stroke(`M${x + 10 * s},${y - 22 * s} V${y + 22 * s}`, 6, '#8E95A3');
}

// Clipboard with a small drawn graph; (x, y) top-left
function clipboard(x, y, w, h, rot = 0) {
  const board = rrect(x, y, w, h, 18), paper = rrect(x + 22, y + 40, w - 44, h - 62, 8), clip = rrect(x + w / 2 - 60, y - 22, 120, 54, 14);
  const n = [[0.3, 0.3], [0.7, 0.26], [0.5, 0.55], [0.26, 0.78], [0.74, 0.78]].map(([a, b]) => [x + 22 + (w - 44) * a, y + 40 + (h - 62) * b]);
  const edges = [[0, 1], [0, 2], [1, 2], [2, 3], [2, 4]].map(([a, b]) => K.stroke(`M${n[a][0]},${n[a][1]} L${n[b][0]},${n[b][1]}`, 6, C.navy)).join('');
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})">` + K.popped([board], '#C98A4B') + K.shape(paper, C.white, { line: 0 }) + edges +
    n.map(([cx, cy], i) => K.shape(K.circle(cx, cy, 15), [C.red, C.yellow, C.turq, C.green, C.royal][i], { line: 5 })).join('') +
    K.shape(clip, '#9AA2B1') + '</g>';
}

// Graph cycle ring: n nodes on a circle with arrowed arcs (an Eulerian cycle)
function cycleRing(cx, cy, r, n, colors) {
  let s = '';
  const pt = (a) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * 2 * Math.PI - Math.PI / 2 + 0.2, a1 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2 - 0.2;
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    const d = `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 0,1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
    s += K.stroke(d, 34, C.white) + K.stroke(d, 22, C.ink) + K.stroke(d, 10, colors[i % colors.length]);
    const t = a1 + Math.PI / 2, hx = x1, hy = y1;
    const head = `M${(hx + Math.cos(t) * 26).toFixed(1)},${(hy + Math.sin(t) * 26).toFixed(1)} L${(hx + Math.cos(a1) * 20).toFixed(1)},${(hy + Math.sin(a1) * 20).toFixed(1)} L${(hx - Math.cos(a1) * 20).toFixed(1)},${(hy - Math.sin(a1) * 20).toFixed(1)} Z`;
    s += K.shape(head, colors[i % colors.length], { line: 7 });
  }
  for (let i = 0; i < n; i++) {
    const [x, y] = pt((i / n) * 2 * Math.PI - Math.PI / 2);
    s += K.halo([K.circle(x, y, 30)]) + K.shape(K.circle(x, y, 30), C.white, { line: 9 }) +
      `<path d="${txt(String(i + 1), { fontName: 'BarlowCondensed-Black', size: 40, x, y: y + 14, anchor: 'middle' }).d}" fill="${C.navy}"/>`;
  }
  return s;
}

// Small DP table card; (x, y) top-left; values row-major
function dpTable(x, y, cols, rows, cell, values, hi = []) {
  const W = cols * cell, H = rows * cell;
  const card = rrect(x - 18, y - 18, W + 36, H + 36, 20);
  let s = K.popped([card], C.white);
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const v = values[r * cols + c];
    const on = hi.includes(r * cols + c);
    s += `<path d="${rrect(x + c * cell + 3, y + r * cell + 3, cell - 6, cell - 6, 8)}" fill="${on ? C.yellow : '#EEF0F5'}"/>`;
    if (v !== '') s += `<path d="${txt(String(v), { fontName: 'BarlowCondensed-Black', size: cell * 0.62, x: x + c * cell + cell / 2, y: y + r * cell + cell * 0.72, anchor: 'middle' }).d}" fill="${C.navy}"/>`;
  }
  return s;
}

module.exports = { CF, rrect, fillText, cfLogo, barbell, eggplant, iceBlock, scoreboard, pennant, ticket, cartridge, stamp, bubble, sunglasses, headphones, whistle, clipboard, cycleRing, dpTable };
