// Team stickers. "Api con Pastel": the Bolivian breakfast as a duo — a glass
// of hot purple api (foam, cinnamon stick, cloves, steam curling into { })
// and a puffy fried pastel de queso dusted with powdered sugar.
// Same line system as the rest: navy keyline, halos, flat shade + halftone.
const { C } = require('./lib');
const K = require('./kit');
const T = require('./type');

const A = {
  api: '#7E2257', apiShade: '#5A1440', apiLight: '#B04A85', foam: '#EFE3FB', foamShade: '#D6C2F0',
  blanco: '#F2DFA6', blancoShade: '#DDBF78', surface: '#9C3570',
  glass: '#F3EEFA', glassLine: '#C9B6E8', cinnamon: '#8B4A2B', cinnamonLight: '#B86B43', clove: '#4A2A1E',
  dough: '#F1CF8C', doughShade: '#D9A85A', doughLight: '#FBE6B8', blister: '#FFF3D6', bubbleShade: '#C8914A', sugar: '#FFFFFF',
  plate: '#D9CDEF', plateShade: '#B9A6DE', cheek: '#F29BA6',
};

// Face: eyes (open or happy arcs), blush and mouth, centered at (x, y), scale s
function face(x, y, s, { eyes = 'open', mouth = 'smile' } = {}) {
  const ex = 34 * s, ey = 0;
  let out = '';
  for (const dx of [-ex, ex]) {
    out += eyes === 'happy'
      ? K.stroke(`M${x + dx - 15 * s},${y + ey + 5 * s} Q${x + dx},${y + ey - 13 * s} ${x + dx + 15 * s},${y + ey + 5 * s}`, 9 * s, C.ink)
      : `<circle cx="${x + dx}" cy="${y + ey}" r="${14 * s}" fill="${C.ink}"/><circle cx="${x + dx + 5 * s}" cy="${y + ey - 5 * s}" r="${5 * s}" fill="${C.white}"/>`;
    out += K.shape(K.ellipse(x + dx * 1.45, y + 26 * s, 17 * s, 10 * s), A.cheek, { line: 0 });
  }
  out += mouth === 'open'
    ? K.shape(`M${x - 18 * s},${y + 22 * s} Q${x},${y + 52 * s} ${x + 18 * s},${y + 22 * s} Z`, '#7A2F3A', { line: 7 * s }) +
      K.shape(`M${x - 9 * s},${y + 36 * s} Q${x},${y + 30 * s} ${x + 9 * s},${y + 36 * s} Q${x},${y + 46 * s} ${x - 9 * s},${y + 36 * s} Z`, '#E58A8A', { line: 0 })
    : K.stroke(`M${x - 16 * s},${y + 22 * s} Q${x},${y + 38 * s} ${x + 16 * s},${y + 22 * s}`, 8 * s, C.ink);
  return out;
}

// Tall glass of api mixto: api blanco (cream) at the bottom, api morado on
// top, no foam. Rim center (x, top), rim width w, height h.
function apiGlass(x, top, w, h, { expr = {} } = {}) {
  const bw = w * 0.84, r = 22;
  const glass = `M${x - w / 2},${top} L${x + w / 2},${top} L${x + bw / 2},${top + h - r} Q${x + bw / 2},${top + h} ${x + bw / 2 - r},${top + h} L${x - bw / 2 + r},${top + h} Q${x - bw / 2},${top + h} ${x - bw / 2},${top + h - r} Z`;
  const inset = 14, lvl = top + 34, slope = (w - bw) / 2 / h;
  const xi = (yy) => w / 2 - inset - (yy - top) * slope;
  const drink = `M${x - xi(lvl)},${lvl} L${x + xi(lvl)},${lvl} L${x + xi(top + h - 16)},${top + h - 30} Q${x + xi(top + h - 16)},${top + h - 16} ${x + xi(top + h - 16) - 16},${top + h - 16} L${x - xi(top + h - 16) + 16},${top + h - 16} Q${x - xi(top + h - 16)},${top + h - 16} ${x - xi(top + h - 16)},${top + h - 30} Z`;
  const split = top + h * 0.66;
  const wave = `M${x - w},${split} C${x - w * 0.25},${split - 26} ${x + w * 0.1},${split + 30} ${x + w},${split - 6} V${top + h + 10} H${x - w} Z`;
  const surface = K.ellipse(x, lvl, xi(lvl), 14);
  return K.halo([glass]) + K.silhouette([glass]) +
    K.shape(glass, A.glass) +
    K.shape(drink, A.api, { line: 0 }) +
    K.clipped(drink, K.shape(wave.replace(`${split}`, `${split - 18}`).replace(`${split - 26}`, `${split - 44}`).replace(`${split + 30}`, `${split + 12}`).replace(`${split - 6}`, `${split - 24}`), '#B9607A', { line: 0 }) +
      K.shape(wave, A.blanco, { line: 0 }) +
      K.shape(`M${x + w * 0.16},${top} L${x + w},${top} L${x + w},${top + h} L${x + w * 0.1},${top + h} Z`, A.apiShade, { line: 0, extra: '' }) +
      K.clipped(wave, K.shape(`M${x + w * 0.16},${top} L${x + w},${top} L${x + w},${top + h} L${x + w * 0.1},${top + h} Z`, A.blancoShade, { line: 0 })) +
      K.halftone(drink, A.apiShade, { box: [x - w / 2, lvl, x + w / 2, split], spacing: 16, angle: 0, from: -0.7, to: 1.1, rmax: 5 })) +
    K.shape(surface, A.surface, { line: 0 }) +
    face(x - w * 0.05, top + h * 0.38, 1.15, expr) +
    K.stroke(`M${x - w / 2 + 30},${top + 50} L${x - bw / 2 + 28},${top + h - 50}`, 16, C.white) +
    K.stroke(`M${x - w / 2 + 60},${top + 56} L${x - w / 2 + 56},${top + 120}`, 9, C.white) +
    K.shape(glass, 'none', { line: K.IN }) +
    K.stroke(`M${x - w / 2 + 6},${top + 4} L${x + w / 2 - 6},${top + 4}`, 8, C.white);
}

// Steam rising from (x, y): three soft wisps
function steam(x, y) {
  const brace = (bx, by, s, dir) => `M${bx + 18 * dir * s},${by - 60 * s} C${bx},${by - 60 * s} ${bx + 4 * dir * s},${by - 30 * s} ${bx + 2 * dir * s},${by - 12 * s} C${bx},${by - 2 * s} ${bx - 10 * dir * s},${by} ${bx - 14 * dir * s},${by} C${bx - 10 * dir * s},${by} ${bx},${by + 2 * s} ${bx + 2 * dir * s},${by + 12 * s} C${bx + 4 * dir * s},${by + 30 * s} ${bx},${by + 60 * s} ${bx + 18 * dir * s},${by + 60 * s}`;
  const curl = `M${x},${y} C${x - 22},${y - 22} ${x + 22},${y - 40} ${x},${y - 62}`;
  // three soft wisps of steam (the hot api), no braces
  const wisp = (wx, wy, k) => `M${wx},${wy} C${wx - 20 * k},${wy - 24 * k} ${wx + 20 * k},${wy - 44 * k} ${wx},${wy - 70 * k}`;
  const ds = [wisp(x - 50, y - 6, 0.85), wisp(x, y, 1.1), wisp(x + 50, y - 6, 0.85)];
  void curl; void brace;
  return ds.map((d) => K.stroke(d, 22 + 14, C.white) + K.stroke(d, 22, C.ink) + K.stroke(d, 10, A.foam)).join('');
}

// Fried pastel de queso: plump half-moon standing on its flat side, crimped
// edge (repulgue) along the arc, fried bubbles and a light dusting of
// powdered sugar. (x, y) = center of the flat base, w = width, h = height.
function pastel(x, y, w, h, { expr = {} } = {}) {
  const arcPts = (rx, ry, n) => Array.from({ length: n + 1 }, (_, i) => {
    const a = Math.PI * (1 - i / n);
    return [x + Math.cos(a) * rx, y - Math.sin(a) * ry];
  });
  const base = [[x + w * 0.5, y], [x + w * 0.3, y + h * 0.1], [x - w * 0.3, y + h * 0.1]];
  const body = K.fluff(arcPts(w / 2, h, 14).concat(base), arcPts(w / 2, h, 14).map(() => 0.12).concat([0.03, 0.03, 0.03]));
  // crimp band: scallops just outside the arc
  const outer = arcPts(w / 2 + 34, h + 34, 13), inner = arcPts(w / 2 - 6, h - 6, 13).reverse();
  const crimp = K.fluff(outer.concat(inner), outer.map(() => 0.42).concat(inner.map(() => 0.02)));
  const pleats = arcPts(w / 2 + 14, h + 14, 13).slice(1, -1).map(([px, py]) => {
    const dx = px - x, dy = py - y, L = Math.hypot(dx, dy);
    const tx = -dy / L, ty = dx / L; // tangent: slanted pleat = rope twist
    return K.stroke(`M${(px - dx / L * 12 - tx * 8).toFixed(1)},${(py - dy / L * 12 - ty * 8).toFixed(1)} L${(px + dx / L * 14 + tx * 8).toFixed(1)},${(py + dy / L * 14 + ty * 8).toFixed(1)}`, 6.5, A.doughShade);
  }).join('');
  const blisters = [[-0.3, -0.44, 26], [0.27, -0.55, 22], [-0.06, -0.78, 18], [0.34, -0.22, 20], [-0.36, -0.14, 16], [0.12, -0.12, 14], [-0.18, -0.62, 14], [0.1, -0.86, 12], [0.42, -0.44, 12]]
    .map(([dx, dy, r]) => K.shape(K.ellipse(x + dx * w + 3, y + dy * h + 5, r, r * 0.74), A.bubbleShade, { line: 0 }) +
      K.shape(K.ellipse(x + dx * w, y + dy * h, r, r * 0.74), A.blister, { line: 0 })).join('');
  const dust = K.smooth(arcPts(w * 0.42, h * 0.86, 8).concat([[x + w * 0.3, y - h * 0.52], [x, y - h * 0.62], [x - w * 0.3, y - h * 0.52]]));
  return K.halo([body, crimp]) + K.silhouette([body, crimp]) +
    K.shape(crimp, A.doughLight) + K.clipped(crimp, K.shape(K.ellipse(x + w * 0.3, y, w * 0.5, h * 1.2), A.dough, { line: 0 })) + pleats +
    K.shape(body, A.dough) +
    K.clipped(body, K.shape(`M${x + w * 0.08},${y - h * 1.2} C${x + w * 0.36},${y - h * 0.8} ${x + w * 0.4},${y - h * 0.3} ${x + w * 0.24},${y + h * 0.2} H${x + w} V${y - h * 1.2} Z`, A.doughShade, { line: 0 }) +
      K.shape(`M${x - w},${y - h * 0.12} C${x - w * 0.2},${y + h * 0.04} ${x + w * 0.2},${y + h * 0.04} ${x + w},${y - h * 0.12} V${y + h} H${x - w} Z`, A.doughShade, { line: 0 }) +
      K.halftone(body, A.doughShade, { box: [x - w / 2, y - h, x + w / 2, y + h * 0.1], spacing: 16, angle: 0, from: -1.2, to: 1.1, rmax: 5 })) +
    blisters +
    K.clipped(body, K.grain(dust, A.sugar, { box: [x - w / 2, y - h, x + w / 2, y - h * 0.3], spacing: 13, rmin: 3, rmax: 5.5, seed: 41 }) + K.grain(body, A.sugar, { box: [x - w / 2, y - h, x + w / 2, y], spacing: 26, rmin: 2.6, rmax: 4, seed: 7 })) +
    face(x - w * 0.04, y - h * 0.4, 1.05, expr) +
    K.shape(body, 'none', { line: K.IN });
}

// Small plate under the duo
const plate = (x, y, w) => {
  const d = K.ellipse(x, y, w / 2, w * 0.1);
  return K.halo([d]) + K.silhouette([d]) + K.shape(d, A.plate) + K.clipped(d, K.shape(K.ellipse(x, y + w * 0.05, w / 2, w * 0.07), A.plateShade, { line: 0 }));
};

// ---------------------------------------------------------------- Toy cansado gfe
// Tired gray guy slumped in a wooden chair (meme reference in
// referencias/equipos/toy-cansado-gfe.webp, redrawn in our style): lumpy head
// with two bulging eyes under heavy lids, eye bags, thick lips around a dark
// mouth, white tee, gray shorts, skinny limbs, black shoes.
const Z = {
  skin: '#BDB9C4', skinShade: '#9C98A6', skinDark: '#7A7686', lid: '#ACA8B5', line: '#5F5B6C',
  tee: '#F4F2F0', teeShade: '#D9D5D2', shorts: '#7D7A86', shortsShade: '#625F6B', shoe: '#33313A',
  wood: '#A86B3C', woodShade: '#86522B', woodLight: '#C98A55', wall: '#E3A3B8', wallShade: '#C9839C',
};

function tiredGuy() {
  const head = K.smooth([[290, 330], [296, 250], [330, 182], [392, 142], [432, 118], [482, 106], [528, 120], [548, 140], [584, 108], [644, 96], [704, 116], [738, 160],
    [744, 216], [738, 270], [758, 322], [754, 372], [722, 406], [672, 426], [600, 450], [520, 462], [440, 452], [370, 420], [320, 380]]);
  const ball = (cx, cy, rx, ry) => `M${cx - rx},${cy} C${cx - rx * 0.7},${cy - ry} ${cx + rx * 0.7},${cy - ry} ${cx + rx},${cy} C${cx + rx * 0.7},${cy + ry * 0.9} ${cx - rx * 0.7},${cy + ry * 0.9} ${cx - rx},${cy} Z`;
  const EL = [472, 206, 70, 52], ER = [652, 190, 74, 54];
  const eye = ([cx, cy, rx, ry]) => {
    const b = ball(cx, cy, rx, ry);
    const lid = `M${cx - rx - 10},${cy - 2} C${cx - rx * 0.3},${cy - 10} ${cx + rx * 0.4},${cy - 14} ${cx + rx + 10},${cy - 8} V${cy - ry - 20} H${cx - rx - 10} Z`;
    return K.shape(b, C.white, { line: 7 }) +
      K.clipped(b, `<ellipse cx="${cx + rx * 0.42}" cy="${cy + 10}" rx="${rx * 0.34}" ry="${ry * 0.34}" fill="#1E1C24"/><circle cx="${cx + rx * 0.5}" cy="${cy + 4}" r="5" fill="${C.white}"/>` +
        K.shape(lid, Z.lid, { line: 0 })) +
      K.stroke(`M${cx - rx - 6},${cy - 2} C${cx - rx * 0.3},${cy - 10} ${cx + rx * 0.4},${cy - 14} ${cx + rx + 6},${cy - 8}`, 11, C.ink) +
      K.stroke(`M${cx - rx + 4},${cy - ry * 0.95} C${cx - rx * 0.3},${cy - ry * 1.4} ${cx + rx * 0.5},${cy - ry * 1.4} ${cx + rx},${cy - ry * 0.85}`, 7, Z.line) +
      K.stroke(`M${cx - rx + 6},${cy + ry * 0.55} C${cx - rx * 0.2},${cy + ry * 1.25} ${cx + rx * 0.5},${cy + ry * 1.2} ${cx + rx},${cy + ry * 0.5}`, 7, Z.line) +
      K.stroke(`M${cx - rx * 0.6},${cy + ry * 1.1} C${cx - rx * 0.1},${cy + ry * 1.55} ${cx + rx * 0.5},${cy + ry * 1.5} ${cx + rx * 0.8},${cy + ry * 1.0}`, 6, Z.line);
  };
  const lips = K.smooth([[566, 336], [600, 302], [662, 292], [722, 304], [756, 334], [740, 376], [692, 396], [630, 400], [586, 382]]);
  const mouth = 'M590,346 C630,322 704,318 738,334 C726,356 692,366 656,366 C626,364 600,360 590,346 Z';
  const wr = (d) => K.stroke(d, 7, Z.line);
  const tee = K.smooth([[400, 470], [470, 446], [600, 442], [700, 460], [748, 520], [756, 610], [730, 670], [620, 690], [480, 690], [400, 670], [372, 600], [380, 520]]);
  const sleeve = 'M404,486 C372,500 350,540 350,576 L410,588 C414,552 420,516 430,498 Z';
  // shorts drawn in front of the seat, with both legs coming forward over its edge
  const shorts = K.smooth([[400, 660], [580, 676], [740, 660], [772, 720], [754, 780], [746, 812], [690, 824], [634, 812], [628, 784], [604, 770], [560, 762], [516, 770], [524, 784], [524, 812], [468, 824], [414, 812], [400, 780], [384, 712]], 0.18);
  const arm = 'M372,584 C360,634 346,684 332,724';
  const hand = K.smooth([[306, 724], [336, 716], [356, 734], [350, 758], [322, 764], [300, 750]]);
  const legL = 'M468,800 C470,860 472,894 470,922', legR = 'M690,800 C688,860 688,894 688,924';
  const shoe = (x, y = 922) => K.smooth([[x - 44, y], [x + 2, y - 12], [x + 52, y], [x + 62, y + 30], [x + 18, y + 42], [x - 48, y + 38], [x - 58, y + 20]]);
  return {
    body: K.silhouette([tee, sleeve, shorts]) +
      K.shape(shorts, Z.shorts) + K.clipped(shorts, K.shape('M360,790 C420,804 500,804 560,790 C620,804 700,804 790,790 V860 H360 Z', Z.shortsShade, { line: 0 })) + +
      wr('M560,712 C562,736 562,750 560,762') +
      K.shape(tee, Z.tee) + K.clipped(tee, K.shape('M360,610 C460,660 640,668 770,610 V720 H360 Z', Z.teeShade, { line: 0 }) +
        K.halftone(tee, Z.teeShade, { box: [370, 440, 760, 690], spacing: 16, angle: 90, from: -0.8, to: 0.9, rmax: 4.5 })) +
      wr('M500,580 C560,600 640,600 700,584') + K.shape(sleeve, Z.tee),
    arm: K.limb(arm, 30, Z.skin) + K.popped([hand], Z.skin) + wr('M320,734 L324,756') + wr('M336,730 L340,752'),
    legs: K.limb(legL, 26, Z.skin) + K.limb(legR, 26, Z.skin) + K.popped([shoe(470)], Z.shoe) + K.popped([shoe(688)], Z.shoe),
    head: K.halo([head]) + K.silhouette([head]) + K.shape(head, Z.skin) +
      K.clipped(head, K.shape('M286,240 C300,380 420,460 600,470 L270,480 Z', Z.skinShade, { line: 0 }) +
        K.halftone(head, Z.skinShade, { box: [280, 90, 770, 470], spacing: 16, angle: 0, from: 1.1, to: -0.7, rmax: 5 })) +
      eye(EL) + eye(ER) +
      wr('M318,250 C312,300 322,350 350,392') + wr('M350,268 C346,316 360,360 392,398') +
      wr('M410,330 C440,360 500,372 548,362') + wr('M470,420 C510,436 560,436 600,426') +
      K.shape(lips, Z.lid) + K.shape(mouth, '#1E1C24', { line: 0 }) +
      wr('M580,370 C570,350 572,330 584,320'),
  };
}

function chair() {
  // ladder back like the meme's chair: two posts the full width of the seat and two rails
  const post = (x) => `M${x},140 Q${x},116 ${x + 24},116 Q${x + 48},116 ${x + 48},140 V744 H${x} Z`;
  const posts = [post(238), post(800)];
  const rails = ['M270,168 H816 V236 H270 Z', 'M270,440 H816 V490 H270 Z'];
  const back = [...rails, ...posts];
  const seat = 'M250,740 H840 L866,792 H226 Z';
  const front = 'M226,792 H866 V830 H226 Z';
  const legs = [[250, 830], [814, 830]].map(([x, y]) => `M${x},${y} H${x + 30} V${y + 130} H${x} Z`);
  return {
    back: K.halo(back) + K.silhouette(back) + rails.map((d) => K.shape(d, Z.woodShade)).join('') +
      K.stroke('M284,184 H802', 6, Z.wood) + K.stroke('M284,454 H802', 6, Z.wood) +
      posts.map((d, k) => K.shape(d, Z.wood) + K.clipped(d, K.shape(`M${[268, 830][k]},100 H300 V760 H${[268, 830][k]} Z`.replace('H300', `H${[268, 830][k] + 30}`), Z.woodShade, { line: 0 }))).join(''),
    seat: K.halo([seat, front, ...legs]) + K.silhouette([seat, front, ...legs]) + legs.map((d) => K.shape(d, Z.woodShade)).join('') +
      K.shape(front, Z.woodShade) + K.shape(seat, Z.wood) + K.stroke('M270,764 C440,758 660,770 820,762', 6, Z.woodLight),
  };
}


// ---------------------------------------------------------------- Sal de mi cabeza
// Jack Russell giving the side-eye over its shoulder (meme reference in
// referencias/equipos/sal-de-mi-cabeza/), raising a paw like a stop sign, in
// front of a warning road sign and behind caution tape.
const R = {
  white: '#FBF8F2', shade: '#E2DACB', deep: '#C9BEAA', tan: '#C8763A', tanShade: '#9E5726', tanLight: '#DD9858',
  eye: '#3A2A24', pad: '#E6948A', padShade: '#C9706A', nose: '#1E1C24',
  redShade: '#A80F20', signIn: '#FFE7A3', signInShade: '#F2C65A', tapeInk: '#1E1C24',
};

// Triangle with rounded corners; inset > 0 shrinks it toward its incenter
function roundTri(pts, r, inset = 0) {
  const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const [A, B, Cc] = pts, a = d(B, Cc), b = d(A, Cc), c = d(A, B), per = a + b + c;
  const I = [(a * A[0] + b * B[0] + c * Cc[0]) / per, (a * A[1] + b * B[1] + c * Cc[1]) / per];
  const s = per / 2, rin = Math.sqrt(s * (s - a) * (s - b) * (s - c)) / s, k = (rin - inset) / rin;
  const P = pts.map(([x, y]) => [I[0] + (x - I[0]) * k, I[1] + (y - I[1]) * k]);
  const toward = (p, q, t) => [p[0] + (q[0] - p[0]) * t / d(p, q), p[1] + (q[1] - p[1]) * t / d(p, q)];
  const f = ([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`;
  let out = '';
  P.forEach((p, i) => {
    const prev = P[(i + 2) % 3], next = P[(i + 1) % 3];
    out += `${i ? ' L' : 'M'}${f(toward(p, prev, r))} Q${f(p)} ${f(toward(p, next, r))}`;
  });
  return out + ' Z';
}

function sideEyeDog() {
  // Slim white body, long neck; head tilted toward the viewer with the snout
  // pointing right, white forehead, a brown patch around the near eye and ear,
  // the far eye small up by the brow, big black nose (as in the photo).
  const body = K.smooth([[430, 430], [380, 500], [356, 620], [352, 740], [372, 840], [420, 896], [540, 904], [640, 890], [680, 820], [688, 700], [676, 590], [640, 490], [600, 440]]);
  const head = K.smooth([[372, 330], [370, 262], [396, 206], [446, 170], [510, 152], [570, 156], [618, 178], [652, 214], [690, 250], [740, 272], [780, 296], [796, 330], [786, 364], [756, 384], [712, 392], [668, 398], [630, 420], [570, 446], [500, 456], [436, 440], [394, 400]]);
  const earL = K.smooth([[388, 232], [370, 182], [394, 140], [444, 132], [460, 164], [436, 202], [408, 232]]);
  const earR = K.smooth([[556, 168], [584, 124], [632, 124], [646, 164], [616, 186]]);
  const patchL = K.smooth([[356, 250], [420, 226], [492, 224], [558, 244], [602, 286], [600, 336], [562, 368], [500, 382], [436, 374], [380, 352], [352, 310]]);
  const eye = (cx, cy, rx, ry, lidFill, lid = 0.2) => {
    const ball = `M${cx - rx},${cy} C${cx - rx * 0.6},${cy - ry * 1.15} ${cx + rx * 0.6},${cy - ry * 1.15} ${cx + rx},${cy} C${cx + rx * 0.6},${cy + ry * 1.1} ${cx - rx * 0.6},${cy + ry * 1.1} ${cx - rx},${cy} Z`;
    const top = cy - ry * (1 - lid * 2);
    const lidD = `M${cx - rx - 8},${top + ry * 0.1} L${cx + rx + 8},${top - ry * 0.05} V${cy - ry * 2} H${cx - rx - 8} Z`;
    return K.shape(ball, C.white, { line: 7 }) +
      K.clipped(ball, `<circle cx="${cx - rx * 0.3}" cy="${cy + ry * 0.08}" r="${ry * 0.86}" fill="${R.eye}"/>` +
        `<circle cx="${cx - rx * 0.12}" cy="${cy - ry * 0.22}" r="${ry * 0.24}" fill="${C.white}"/>` + K.shape(lidD, lidFill, { line: 0 })) +
      K.stroke(`M${cx - rx - 6},${top + ry * 0.1} L${cx + rx + 6},${top - ry * 0.05}`, 10, C.ink);
  };
  const paw = (x, y, r) => {
    const pad = K.smooth([[x - r * 0.42, y + r * 0.2], [x, y - r * 0.12], [x + r * 0.42, y + r * 0.2], [x + r * 0.3, y + r * 0.52], [x, y + r * 0.6], [x - r * 0.3, y + r * 0.52]]);
    const toes = [[-0.56, -0.18], [-0.22, -0.5], [0.2, -0.52], [0.54, -0.22]].map(([dx, dy]) => K.ellipse(x + dx * r, y + dy * r, r * 0.17, r * 0.2));
    return K.popped([K.circle(x, y, r)], R.white) + K.clipped(K.circle(x, y, r), K.shape(K.circle(x + r * 0.3, y + r * 0.4, r), R.shade, { line: 0 })) +
      K.shape(pad, R.pad, { line: 6 }) + toes.map((d) => K.shape(d, R.pad, { line: 6 })).join('');
  };
  return {
    body: K.halo([body]) + K.silhouette([body]) + K.shape(body, R.white) +
      K.clipped(body, K.shape('M300,520 C350,620 370,740 460,910 L300,910 Z', R.shade, { line: 0 }) +
        K.halftone(body, R.deep, { box: [340, 420, 700, 910], spacing: 16, angle: 200, from: -0.6, to: 0.9, rmax: 4.5 })) +
      K.stroke('M378,748 C410,712 470,710 500,760 C514,786 516,816 508,846', 7),
    leg: K.limb('M630,610 C700,598 772,586 830,574', 58, R.white) + paw(858, 560, 56),
    head: K.halo([head, earL, earR]) + K.silhouette([head, earL, earR]) + K.shape(earR, R.tanShade) + K.shape(head, R.white) +
      K.clipped(head, K.shape(patchL, R.tan, { line: 0 }) +
        K.shape('M360,380 C420,440 520,470 640,420 L700,400 L700,500 L360,500 Z', R.shade, { line: 0 }) +
        K.shape('M600,426 C660,398 740,398 790,370 L800,440 L600,440 Z', R.shade, { line: 0 }) +
        K.halftone(patchL, R.tanShade, { box: [350, 220, 610, 390], spacing: 16, angle: 120, from: -0.4, to: 0.9, rmax: 4.5 })) +
      K.shape(earL, R.tan) + K.clipped(earL, K.shape('M360,200 C400,170 430,160 470,140 L470,240 L360,240 Z', R.tanShade, { line: 0 })) +
      eye(498, 302, 50, 37, R.tan, 0.14) + eye(622, 214, 22, 17, R.white, 0.14) +
      K.shape(K.smooth([[728, 304], [768, 294], [798, 314], [800, 348], [774, 368], [740, 364], [722, 336]]), R.nose, { line: 0 }) +
      `<ellipse cx="762" cy="312" rx="14" ry="7" fill="#5A5866"/>` +
      K.stroke('M772,370 C770,382 758,390 740,392 C716,394 694,394 672,390', 8) +
      [[704, 352], [690, 368], [718, 372]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${R.deep}"/>`).join(''),
    collar: K.limb('M424,450 C484,490 584,492 640,452', 30, C.red) +
      K.popped([roundTri([[536, 482], [490, 560], [582, 560]], 10)], C.yellow) + K.shape('M536,508 V534', 'none', { line: 9 }) + `<circle cx="536" cy="548" r="5" fill="${C.ink}"/>`,
  };
}

module.exports = function equipos({ add, BOUNCE, LIFT }) {
  const WORD = 0.16;
  const fit = (text, width, fontName = 'BagelFatOne-Regular') => T.fit(text, { fontName, width, wordSpace: WORD });

  add('40-api-con-pastel', 'Equipo · Api con Pastel', () => {
    const apiSize = fit('API', 400);
    const api = T.line('API', { fontName: 'BagelFatOne-Regular', size: apiSize, x: 330, y: 900, bounce: BOUNCE, lift: LIFT });
    const con = T.line('con', { fontName: 'Shrikhand-Regular', size: 120, x: 690, y: 860, rotate: -8 });
    const pas = T.line('PASTEL', { fontName: 'BagelFatOne-Regular', size: fit('PASTEL', 900), x: 520, y: 1070, bounce: BOUNCE.slice(2), lift: LIFT.slice(1), wordSpace: 0 });
    return plate(560, 700, 820) +
      steam(316, 196) +
      apiGlass(320, 220, 300, 470, { expr: { eyes: 'open', mouth: 'open' } }) +
      pastel(650, 700, 560, 320, { expr: { eyes: 'happy', mouth: 'smile' } }) +
      T.chunky(api, { fill: A.apiLight, shade: A.apiShade, extrude: [0, 22] }) +
      T.chunky(con, { fill: C.white, shade: A.apiShade, extrude: [0, 10] }) +
      T.chunky(pas, { fill: '#F6D27E', shade: '#C98F3E', extrude: [0, 24] });
  }, { sizes: [4, 6, 8], note: 'La merienda cochabambina como equipo: api mixto bien caliente y un pastel con azúcar impalpable.' });

  add('41-toy-cansado-gfe', 'Equipo · Toy cansado gfe', () => {
    const G = tiredGuy(), CH = chair();
    // tired lettering: each letter sags a bit more, like it's about to fall asleep
    const t1 = 'TOY CANSADO', t2 = 'GFE';
    const sag1 = [0, 4, 9, 0, 6, 12, 16, 20, 24, 28, 34], tilt1 = [-2, 1, 3, 0, 2, 4, 5, 6, 7, 8, 9];
    const l1 = T.line(t1, { fontName: 'BagelFatOne-Regular', size: fit(t1, 920), x: 540, y: 1080, lift: sag1, bounce: tilt1, wordSpace: WORD * fit(t1, 900) });
    const l2 = T.line(t2, { fontName: 'BagelFatOne-Regular', size: fit(t2, 400), x: 600, y: 1290, lift: [0, 8, 18], bounce: [2, 6, 12] });
    const zz = (ch, x, y, s) => T.chunky(T.line(ch, { fontName: 'BagelFatOne-Regular', size: s, x, y, rotate: -14 }), { fill: C.white, shade: Z.wallShade, extrude: [0, 8] });
    const wall = K.smooth([[140, 400], [170, 200], [320, 70], [520, 30], [740, 60], [890, 190], [930, 420], [900, 700], [160, 700]]);
    return K.halo([wall]) + K.silhouette([wall]) + K.shape(wall, Z.wall) +
      K.clipped(wall, K.halftone(wall, Z.wallShade, { box: [130, 20, 940, 710], spacing: 18, angle: 45, from: -0.4, to: 1.1, rmax: 6 })) +
      CH.back + CH.seat + G.legs + G.body + G.arm + `<g transform="translate(540 470) scale(1.26) translate(-540 -470)">${G.head}</g>` +
      zz('Z', 860, 230, 130) + zz('z', 950, 110, 120) +
      T.chunky(l1, { fill: C.white, shade: Z.skinDark, extrude: [0, 20] }) +
      T.chunky(l2, { fill: Z.wall, shade: Z.wallShade, extrude: [0, 22] });
  }, { sizes: [4, 6, 8], note: 'El equipo más cansado del torneo, desparramado en su silla.' });

  add('42-sal-de-mi-cabeza', 'Equipo · Sal de mi cabeza: última advertencia', () => {
    const D = sideEyeDog();
    const tri = [[540, 30], [90, 812], [990, 812]];
    const outer = roundTri(tri, 70), inner = roundTri(tri, 46, 64);
    const sign = K.halo([outer]) + K.silhouette([outer]) + K.shape(outer, C.red) +
      K.clipped(outer, K.shape('M540,0 L1000,820 L1000,900 L700,900 Z', R.redShade, { line: 0 })) +
      K.shape(inner, R.signIn, { line: 9 }) + K.clipped(inner, K.halftone(inner, R.signInShade, { box: [180, 140, 900, 760], spacing: 18, angle: 90, from: -0.3, to: 1.1, rmax: 6 }));
    const alert = ['M330,196 L296,178', 'M344,160 L322,128', 'M376,140 L370,104'].map((d) => K.stroke(d, 38, C.white) + K.stroke(d, 12)).join('');
    // caution tape across the bottom of the sign
    const rot = (d) => K.rotD(d, -5, 540, 900);
    const band = rot('M50,846 L1030,846 L1030,954 L50,954 Z');
    const stripes = [];
    for (let x = 10; x < 1080; x += 70) if (x < 240 || x > 870) stripes.push(rot(`M${x},846 L${x + 34},846 L${x - 20},954 L${x - 54},954 Z`));
    const tSize = Math.min(86, T.fit('ÚLTIMA ADVERTENCIA', { fontName: 'BarlowCondensed-Black', width: 540 }));
    const tape = K.halo([band]) + K.silhouette([band]) + K.shape(band, C.yellow) +
      K.clipped(band, stripes.map((d) => K.shape(d, R.tapeInk, { line: 0 })).join('')) +
      T.line('ÚLTIMA ADVERTENCIA', { fontName: 'BarlowCondensed-Black', size: tSize, x: 540, y: 900 + tSize * 0.36, rotate: -5, tracking: 2 }).map((d) => K.shape(d, R.tapeInk, { line: 0 })).join('');
    const s1 = fit('SAL DE MI', 720), s2 = fit('CABEZA', 900);
    const l1 = T.line('SAL DE MI', { fontName: 'BagelFatOne-Regular', size: s1, x: 540, y: 1124, bounce: BOUNCE, lift: LIFT, wordSpace: WORD * s1 });
    const l2 = T.line('CABEZA', { fontName: 'BagelFatOne-Regular', size: s2, x: 540, y: 1324, bounce: BOUNCE.slice(1), lift: LIFT.slice(2) });
    return sign + alert + D.body + D.leg + D.collar + D.head + tape +
      T.chunky(l1, { fill: C.white, shade: R.redShade, extrude: [0, 18] }) +
      T.chunky(l2, { fill: C.red, shade: R.redShade, extrude: [0, 24] });
  }, { sizes: [4, 6, 8], note: 'Un Jack Russell que te mira de reojo con la pata en alto: última advertencia.' });
};
