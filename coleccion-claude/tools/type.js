// Lettering for phrases and badges: glyphs become paths whose points can be
// warped (per-letter bounce, arched baselines, text around a circle) and then
// rendered as chunky sticker type: white halo, navy keyline, 3D extrusion, face.
const { C, font } = require('./lib');
const K = require('./kit');

const f1 = (v) => v.toFixed(1);

// Absolute path commands → path data, passing every point through fn
function cmdsToD(cmds, fn) {
  let d = '';
  for (const c of cmds) {
    if (c.type === 'M' || c.type === 'L') { const [x, y] = fn(c.x, c.y); d += `${c.type}${f1(x)},${f1(y)} `; }
    else if (c.type === 'Q') { const [x1, y1] = fn(c.x1, c.y1), [x, y] = fn(c.x, c.y); d += `Q${f1(x1)},${f1(y1)} ${f1(x)},${f1(y)} `; }
    else if (c.type === 'C') { const [x1, y1] = fn(c.x1, c.y1), [x2, y2] = fn(c.x2, c.y2), [x, y] = fn(c.x, c.y); d += `C${f1(x1)},${f1(y1)} ${f1(x2)},${f1(y2)} ${f1(x)},${f1(y)} `; }
    else if (c.type === 'Z') d += 'Z ';
  }
  return d.trim();
}

// Lay out text on a straight baseline at y = 0 starting at x = 0.
// Returns glyph records { cmds, x0, x1 } and the total width.
function layout(text, { fontName, size, tracking = 0, wordSpace = 0 }) {
  const f = font(fontName);
  const gs = f.stringToGlyphs(text);
  const scale = size / f.unitsPerEm;
  let x = 0;
  const out = [];
  gs.forEach((g, i) => {
    const p = g.getPath(x, 0, size);
    const adv = g.advanceWidth * scale;
    if (p.commands.length) out.push({ cmds: p.commands, x0: x, x1: x + adv, ch: text[i] });
    const kern = i < gs.length - 1 ? f.getKerningValue(g, gs[i + 1]) * scale : 0;
    x += adv + kern + tracking + (text[i] === ' ' ? wordSpace : 0);
  });
  return { glyphs: out, width: x - tracking };
}

// One line of text → array of glyph path data, centered on (x, y) baseline.
// opts.bounce: per-letter rotations in degrees; opts.lift: per-letter y offsets;
// opts.arch: baseline bend (positive = arched upward in the middle).
function line(text, { fontName, size, x = 0, y = 0, tracking = 0, wordSpace = 0, bounce = null, lift = null, arch = 0, rotate = 0, skew = 0 }) {
  const L = layout(text, { fontName, size, tracking, wordSpace });
  const W = L.width;
  const rot = (rotate * Math.PI) / 180;
  const sk = Math.tan((skew * Math.PI) / 180);
  return L.glyphs.map((g, i) => {
    const gcx = (g.x0 + g.x1) / 2, gcy = -size * 0.35;
    const a = ((bounce ? bounce[i % bounce.length] : 0) * Math.PI) / 180;
    const ly = lift ? lift[i % lift.length] : 0;
    const fn = (px, py) => {
      // per-letter rotation about the glyph center
      let qx = gcx + (px - gcx) * Math.cos(a) - (py - gcy) * Math.sin(a);
      let qy = gcy + (px - gcx) * Math.sin(a) + (py - gcy) * Math.cos(a) + ly;
      qx += -qy * sk;
      // arch: parabola over the line width
      const t = (qx - W / 2) / (W / 2);
      qy -= arch * (1 - t * t);
      // center, rotate whole line, move to (x, y)
      const cx = qx - W / 2, cy = qy;
      return [x + cx * Math.cos(rot) - cy * Math.sin(rot), y + cx * Math.sin(rot) + cy * Math.cos(rot)];
    };
    return cmdsToD(g.cmds, fn);
  });
}

// Text around a circle centered on (cx, cy). side 'top' reads clockwise over
// the top; 'bottom' reads left-to-right under the circle with letters upright.
function ring(text, { fontName, size, cx, cy, r, side = 'top', tracking = 0, center = 0 }) {
  const L = layout(text, { fontName, size, tracking });
  const W = L.width;
  const mid = ((side === 'top' ? -90 : 90) + center) * Math.PI / 180;
  return L.glyphs.map((g) => cmdsToD(g.cmds, (px, py) => {
    if (side === 'top') {
      const a = mid + (px - W / 2) / r, rr = r - py;
      return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
    }
    const a = mid - (px - W / 2) / r, rr = r + py + size * 0.72;
    return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)];
  }));
}

// Chunky sticker type from glyph paths.
// extrude: [dx, dy] solid 3D depth in `shade`; fills: per-letter face colors.
function chunky(ds, { fill = C.yellow, fills = null, shade = C.navy, extrude = [0, 14], steps = 8, outline = K.OUT, haloW = K.OUT * 2 + 14, inline = 0, inlineColor = C.white } = {}) {
  const [ex, ey] = extrude;
  const stepsArr = Array.from({ length: steps }, (_, i) => [ex * (i + 1) / steps, ey * (i + 1) / steps]);
  const all = (fnD) => ds.map(fnD).join('');
  const shifted = (d, dx, dy) => `<path d="${d}" transform="translate(${f1(dx)} ${f1(dy)})"/>`;
  let s = '';
  if (haloW) {
    s += `<g fill="${C.white}" stroke="${C.white}" stroke-width="${haloW}" stroke-linejoin="round">`;
    s += all((d) => `<path d="${d}"/>` + stepsArr.map(([dx, dy]) => shifted(d, dx, dy)).join(''));
    s += '</g>';
  }
  s += `<g fill="${C.ink}" stroke="${C.ink}" stroke-width="${outline * 2}" stroke-linejoin="round">`;
  s += all((d) => `<path d="${d}"/>` + stepsArr.map(([dx, dy]) => shifted(d, dx, dy)).join(''));
  s += '</g>';
  if (ex || ey) s += `<g fill="${shade}">` + all((d) => stepsArr.map(([dx, dy]) => shifted(d, dx, dy)).join('')) + '</g>';
  if (inline) s += `<g fill="${inlineColor}" stroke="${inlineColor}" stroke-width="${inline * 2}" stroke-linejoin="round">` + all((d) => `<path d="${d}"/>`) + '</g>';
  s += ds.map((d, i) => `<path d="${d}" fill="${fills ? fills[i % fills.length] : fill}"/>`).join('');
  return s;
}

// Font size that makes `text` exactly `width` wide (capped at maxSize)
function fit(text, { fontName, width, maxSize = 400, tracking = 0, wordSpace = 0 }) {
  const w1 = layout(text, { fontName, size: 100, tracking, wordSpace: wordSpace * 100 }).width;
  return Math.min(maxSize, (100 * width) / w1);
}

// Bounding box of glyph paths (control points included: slight overestimate)
function bounds(ds) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const d of ds) {
    const n = d.match(/-?\d*\.?\d+/g).map(Number);
    for (let i = 0; i + 1 < n.length; i += 2) {
      x0 = Math.min(x0, n[i]); x1 = Math.max(x1, n[i]); y0 = Math.min(y0, n[i + 1]); y1 = Math.max(y1, n[i + 1]);
    }
  }
  return { x0, y0, x1, y1 };
}

module.exports = { layout, line, ring, chunky, cmdsToD, fit, bounds };
