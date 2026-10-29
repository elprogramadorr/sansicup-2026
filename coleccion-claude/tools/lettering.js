// SanSi Cup signature: traced script + rebuilt 2026 tag, with a sports-style
// layered outline (fill / white inline / navy keyline).
const { C, loadLettering, textPath } = require('./lib');

const L = loadLettering();
const GAP = 7;   // white inline
const KEY = 11;  // navy keyline

// Tag "2026": rounded, slanted, sitting on the swash.
function tag() {
  const t = textPath('2026', { fontName: 'BarlowCondensed-BlackItalic', size: 118, x: 0, y: 0, tracking: 2, anchor: 'middle' });
  const w = t.width + 64, h = 104;
  const rect = `M${-w / 2 + 14},${-h / 2} H${w / 2 - 14} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 14} V${h / 2 - 14} Q${w / 2},${h / 2} ${w / 2 - 14},${h / 2} H${-w / 2 + 14} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - 14} V${-h / 2 + 14} Q${-w / 2},${-h / 2} ${-w / 2 + 14},${-h / 2} Z`;
  const tf = 'translate(812 330) rotate(-7) skewX(-12)';
  return { rect, digits: t.d, tf, digitTf: 'translate(812 330) rotate(-7) translate(4 41)' };
}

// Returns SVG markup of the signature in a 1000-wide box (approx 0..1000 x 0..520).
// drop: depth (units) of a solid navy extrusion under each layer (3D sports script)
function signature({ drop = 0 } = {}) {
  const s = `scale(${L.scale})`;
  const T = tag();
  const dropLayer = (d, tf) => (drop ? [0.5, 1].map((t) =>
    `<path d="${d}" transform="translate(0 ${drop * t}) ${tf}" fill="${C.ink}" stroke="${C.ink}" stroke-width="${(GAP + KEY) * 2 / (tf.includes('scale') ? L.scale : 1)}" stroke-linejoin="round"/>`).join('') : '');
  const layer = (d, fill, tf) => `${dropLayer(d, tf)}
    <path d="${d}" transform="${tf}" fill="${C.ink}" stroke="${C.ink}" stroke-width="${(GAP + KEY) * 2 / (tf.includes('scale') ? L.scale : 1)}" stroke-linejoin="round"/>
    <path d="${d}" transform="${tf}" fill="${C.white}" stroke="${C.white}" stroke-width="${GAP * 2 / (tf.includes('scale') ? L.scale : 1)}" stroke-linejoin="round"/>
    <path d="${d}" transform="${tf}" fill="${fill}" fill-rule="evenodd"/>`;
  return `<g id="firma">
    <g id="firma-cup">${layer(L.red, C.red, s)}</g>
    <g id="firma-2026">
      ${dropLayer(T.rect, T.tf)}
      <path d="${T.rect}" transform="${T.tf}" fill="${C.ink}" stroke="${C.ink}" stroke-width="${(GAP + KEY) * 2}" stroke-linejoin="round"/>
      <path d="${T.rect}" transform="${T.tf}" fill="${C.white}" stroke="${C.white}" stroke-width="${GAP * 2}" stroke-linejoin="round"/>
      <path d="${T.rect}" transform="${T.tf}" fill="${C.yellow}"/>
      <path d="${T.digits}" transform="${T.digitTf}" fill="${C.navy}"/>
    </g>
    <g id="firma-sansi">${layer(L.blue, C.navy, s)}</g>
  </g>`;
}

module.exports = { signature };
