// Writes ../index.html (the collection gallery) from manifest.json.
const fs = require('fs');
const path = require('path');
const { ROOT, C } = require('./lib');

const man = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
const GROUPS = [
  ['sansi', 'SanSi Cup 2026', 'La firma del evento y las tres mascotas, cada una con su propia relación con la copa.'],
  ['icpc', 'ICPC UMSS', 'Letras varsity y los globos de colores: cada globo es un problema resuelto.'],
  ['chistes', 'Del grupo', 'Los chistes internos son lo que hace que un sticker se guarde. Un chiste por sticker, legible a 4 cm.'],
  ['identidad', 'Identidad', 'Piezas para quienes quieren el escudo, el cubo, la insignia o la polera de su World Finals.'],
];
// Exclusive set: shown first, under its own heading
const EX_GROUPS = [
  ['ex-sansi', 'SanSi Cup', 'Objetos del torneo: banderín de fieltro, la entrada y un cartucho retro de 1 a 3 jugadores.'],
  ['ex-icpc', 'ICPC', 'Lo que solo entiende quien compitió: los globos, una sola PC para tres y el scoreboard congelado.'],
  ['ex-cf', 'Codeforces y Juki', 'El Gym de Codeforces, la gatita anti vibe coding y Juki, el oso juez de Juki Judge, de juez y de coach.'],
  ['ex-prog', 'Programador y vibe coding', 'long long, segfault, «AC en mi máquina» y el loro estocástico.'],
  ['ex-reggaeton', 'Perreo algorítmico', 'El conejo malo canta teoría de grafos y programación dinámica.'],
  ['equipos', 'Equipos', 'Stickers para los equipos que compiten, con su nombre y su identidad.'],
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const card = (m) => {
  const big = Math.max(...m.sizes);
  const dir = `imprenta/${m.id}`;
  const pdfs = m.sizes.map((cm) => `<a href="${dir}/${m.id}_${cm}cm.pdf">PDF ${cm} cm</a>`).join('');
  return `<article class="card">
    <div class="art"><img src="png/${m.id}.png" alt="${esc(m.title)}" loading="lazy"></div>
    <div class="info">
      <h3>${esc(m.title)}</h3>
      <p>${esc(m.note)}</p>
      <div class="sizes">${m.sizes.map((s) => `<span>${s} cm</span>`).join('')}</div>
      <div class="dl">
        <a class="primary" href="${dir}/${m.id}.svg" download>SVG</a>${pdfs}
        <a href="${dir}/${m.id}_${big}cm_600dpi.png" download>PNG</a>
        <a href="${dir}/${m.id}_${big}cm_corte.pdf">Corte</a>
      </div>
    </div>
  </article>`;
};

const swatches = [
  ['Azul marino', C.navy, 'línea y marca'], ['Rojo', C.red, 'marca'], ['Amarillo', C.yellow, 'marca'],
  ['Turquesa', C.turq, 'Galano'], ['Verde', C.green, 'Galano'], ['Naranja', C.orange, 'gatita'],
  ['Crema', C.dogWhite, 'perrito'], ['Lila', C.lilac, 'bandidos'], ['Papel', '#F4EBD8', 'insignia'],
];

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SanSi Cup 2026 · stickers</title>
<style>
  :root { --navy:${C.navy}; --red:${C.red}; --yellow:${C.yellow}; --bg:#EEEAE1; --card:#FFFFFF; --muted:#4A5468; --line:#DCD6C8; color-scheme: light; }
  * { box-sizing: border-box }
  body { margin: 0; background: var(--bg); color: var(--navy); font: 16px/1.55 system-ui, -apple-system, "Segoe UI", sans-serif }
  main { max-width: 1240px; margin: auto; padding: 44px 20px 90px }
  a { color: inherit }
  .eyebrow { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--muted) }
  h1 { font-size: clamp(36px, 6vw, 68px); line-height: 1; letter-spacing: -.03em; margin: 12px 0 18px }
  h1 span { color: var(--red) }
  .intro { max-width: 760px; color: var(--muted); font-size: 18px }
  .hero { display: grid; grid-template-columns: 1.1fr .9fr; gap: 36px; align-items: center }
  .hero img { width: 100%; border-radius: 18px; background: #E8E4DA }
  .actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 26px }
  .btn { padding: 11px 18px; border-radius: 999px; text-decoration: none; border: 2px solid var(--navy); font-weight: 600; font-size: 14px }
  .btn.primary { background: var(--navy); color: #fff }
  section { margin-top: 70px }
  section > h2 { font-size: 30px; margin: 0 0 6px; letter-spacing: -.01em }
  section > h2.big { font-size: clamp(32px, 5vw, 52px); line-height: 1.05 }
  .ex-intro { margin-top: 80px; padding-top: 30px; border-top: 2px solid var(--navy) }
  section > p.lead { color: var(--muted); margin: 0 0 22px; max-width: 760px }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 18px }
  .card { background: var(--card); border-radius: 18px; overflow: hidden; display: flex; flex-direction: column }
  .art { background: #E8E4DA; height: 280px; display: flex; align-items: center; justify-content: center; padding: 22px }
  .art img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 6px 10px rgba(20,40,110,.16)) }
  .info { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1 }
  .info h3 { margin: 0; font-size: 17px }
  .info p { margin: 0; color: var(--muted); font-size: 14px; flex: 1 }
  .sizes { display: flex; gap: 6px }
  .sizes span { font-size: 12px; background: #F1EDE4; border-radius: 6px; padding: 2px 8px; color: var(--muted) }
  .dl { display: flex; flex-wrap: wrap; gap: 6px }
  .dl a { font-size: 12.5px; text-decoration: none; border: 1.5px solid var(--navy); border-radius: 999px; padding: 3px 10px }
  .dl a.primary { background: var(--navy); color: #fff }
  .wide { width: 100%; display: block; border-radius: 16px; background: #E8E4DA }
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start }
  .panel { background: var(--card); border-radius: 18px; padding: 22px 24px }
  .panel h3 { margin: 0 0 10px }
  .panel ul { margin: 0; padding-left: 18px; color: var(--muted) }
  .panel li { margin: 7px 0 }
  .panel b { color: var(--navy) }
  .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px }
  .sw { border-radius: 12px; overflow: hidden; background: #fff; border: 1px solid var(--line) }
  .sw div { height: 54px }
  .sw p { margin: 0; padding: 8px 10px; font-size: 12.5px; color: var(--muted) }
  .sw b { display: block; color: var(--navy); font-size: 13px }
  code { font-size: 13px; background: #F1EDE4; padding: 1px 6px; border-radius: 5px }
  @media (max-width: 820px) { .hero, .split { grid-template-columns: 1fr } .art { height: 240px } }
</style>
</head>
<body>
<main>
  <div class="hero">
    <div>
      <div class="eyebrow">ICPC UMSS · Cochabamba · 2026</div>
      <h1>SanSi Cup 2026.<br><span>${man.length} stickers.</span></h1>
      <p class="intro">Dibujados en vector desde cero, mirando las fotos de Galano, el perrito, la gatita y Nico. Un solo sistema de línea, color y letras para toda la colección, más una planilla A5 con troquel listo para imprenta.</p>
      <div class="actions">
        <a class="btn primary" href="imprenta/planilla-exclusivos/planilla-exclusivos.pdf">Planilla exclusivos · PDF</a>
        <a class="btn" href="imprenta/planilla-a5/planilla-a5.pdf">Planilla A5 · PDF</a>
        <a class="btn" href="revision/prueba-tamano-real-300dpi.png">Prueba a tamaño real</a>
        <a class="btn" href="#imprenta">Notas para imprenta</a>
      </div>
    </div>
    <img src="revision/planilla-exclusivos.png" alt="Planilla A5 con los stickers exclusivos">
  </div>

  <section class="ex-intro">
    <div class="eyebrow">Edición exclusiva · ${man.filter((m) => m.group.startsWith('ex-')).length} stickers</div>
    <h2 class="big">Exclusivos SanSi Cup 2026</h2>
    <p class="lead">Sin «ICPC UMSS» en grande: piezas para coleccionar en el torneo, con los mismos personajes, línea y colores que el resto.</p>
  </section>
  ${EX_GROUPS.map(([g, title, lead]) => `<section>
    <h2>${title}</h2><p class="lead">${lead}</p>
    <div class="grid">${man.filter((m) => m.group === g).map(card).join('')}</div>
  </section>`).join('')}

  <section class="ex-intro">
    <div class="eyebrow">Colección base</div>
    <h2 class="big">Del grupo e identidad</h2>
  </section>
  ${GROUPS.map(([g, title, lead]) => `<section>
    <h2>${title}</h2><p class="lead">${lead}</p>
    <div class="grid">${man.filter((m) => m.group === g).map(card).join('')}</div>
  </section>`).join('')}

  <section>
    <h2>Planilla A5 · exclusivos</h2>
    <p class="lead">El banderín arriba y 12 exclusivos de unos 4 cm, con su corte.</p>
    <div class="split">
      <img class="wide" src="revision/planilla-exclusivos-corte.png" alt="Planilla A5 de exclusivos con sus cortes">
      <div class="panel">
        <h3>Archivos</h3>
        <ul>
          <li><a href="imprenta/planilla-exclusivos/planilla-exclusivos.pdf"><b>planilla-exclusivos.pdf</b></a>: arte para imprimir.</li>
          <li><a href="imprenta/planilla-exclusivos/planilla-exclusivos_corte.pdf"><b>planilla-exclusivos_corte.pdf</b></a>: corte de cada sticker (magenta) y borde de la hoja (cian).</li>
          <li><a href="imprenta/planilla-exclusivos/planilla-exclusivos.svg"><b>planilla-exclusivos.svg</b></a>: maestro editable.</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <h2>Planilla A5</h2>
    <p class="lead">13 stickers de unos 4 cm en una hoja de 148 × 210 mm. Cada uno tiene su corte (kiss-cut) a 3 mm del siguiente; el borde de la hoja va en otra línea de corte.</p>
    <div class="split">
      <img class="wide" src="revision/planilla-a5-corte.png" alt="Planilla A5 con las líneas de corte">
      <div class="panel">
        <h3>Archivos</h3>
        <ul>
          <li><a href="imprenta/planilla-a5/planilla-a5.pdf"><b>planilla-a5.pdf</b></a>: arte para imprimir.</li>
          <li><a href="imprenta/planilla-a5/planilla-a5_corte.pdf"><b>planilla-a5_corte.pdf</b></a>: corte de cada sticker (magenta) y borde de la hoja (cian).</li>
          <li><a href="imprenta/planilla-a5/planilla-a5.svg"><b>planilla-a5.svg</b></a>: maestro editable.</li>
        </ul>
      </div>
    </div>
  </section>

  <section>
    <h2>Parecido con las fotos</h2>
    <p class="lead">Cada personaje se dibujó y corrigió mirando su foto. El perrito tiene dos referencias: orejas caídas a los lados, pelo desordenado arriba, ojos oscuros con el pelo más oscuro alrededor, nariz grande y barba color crema.</p>
    <img class="wide" src="revision/parecido-fotos.png" alt="Fotos de referencia junto a cada personaje">
  </section>

  <section>
    <h2>Sistema de diseño</h2>
    <p class="lead">Las reglas que hacen que los ${man.length} parezcan del mismo diseñador.</p>
    <div class="swatches">${swatches.map(([n, hex, use]) => `<div class="sw"><div style="background:${hex}"></div><p><b>${n}</b>${hex} · ${use}</p></div>`).join('')}</div>
    <div class="split" style="margin-top:18px">
      <div class="panel">
        <h3>Reglas</h3>
        <ul>
          <li><b>Línea:</b> contorno exterior azul marino grueso y líneas interiores más finas; nunca menos de 0,35 mm a 4 cm.</li>
          <li><b>Halo blanco</b> entre piezas que se superponen (copa, patas, globos), como en las letras deportivas.</li>
          <li><b>Sombras planas</b> con un solo tono más oscuro; textura de trama de puntos solo en sombras, como en una impresión retro.</li>
          <li><b>Letras reales</b> convertidas a curvas: Bagel Fat One (frases), Graduate (varsity), Barlow Condensed (datos), JetBrains Mono (código). Todas con licencia OFL.</li>
          <li><b>Un chiste por sticker</b>, máximo tres palabras grandes, y que se lea a 4 cm.</li>
        </ul>
      </div>
      <div class="panel">
        <h3>Lo que dice la investigación</h3>
        <ul>
          <li>Los programadores guardan stickers que cuentan una historia: eventos, equipos, chistes internos. Los logos de empresa se descartan. <a href="https://hamatti.org/posts/stickers-tell-stories/">hamatti.org</a> · <a href="https://opensource.com/article/22/11/laptop-stickers">opensource.com</a></li>
          <li>Las series de personajes funcionan mejor que un solo logo: GitHub tiene más de 140 Octocats y la gente colecciona sets completos. <a href="https://dev.to/sparkpost/the-sticking-power-of-the-sparkpost-flame">dev.to</a></li>
          <li>Los stickers pequeños gustan: curl llevó a FOSDEM 2026 desde círculos de 2,5 cm. <a href="https://daniel.haxx.se/blog/">daniel.haxx.se</a></li>
          <li>En retratos de mascotas, lo que más se elogia es el parecido y la personalidad (la mirada). <a href="https://www.huffpost.com/entry/pet-portrait-painting-etsy_l_631753c3e4b0eac9f4d05e66">HuffPost</a></li>
          <li>Lo deportivo y varsity es tendencia en 2026 (búsquedas de stickers del Mundial +283 %). <a href="https://newsroom.pinterest.com/news/summer-trend-report-2026/">Pinterest</a></li>
        </ul>
      </div>
    </div>
  </section>

  <section id="imprenta">
    <h2>Notas para imprenta</h2>
    <div class="split">
      <div class="panel">
        <h3>Lo que va en cada carpeta <code>imprenta/</code></h3>
        <ul>
          <li><b>PDF por tamaño</b> (lado mayor): arte con su borde blanco de 2 mm. Sin fuentes ni imágenes dentro, todo vector.</li>
          <li><b>PDF _corte</b>: la línea de corte sola, magenta 0,25 pt. En el SVG está en la capa <code>CutContour</code>.</li>
          <li><b>PNG 600 ppp</b> con fondo transparente, para servicios que piden imagen.</li>
          <li>Tamaños: la mayoría a 4, 6 y 8 cm. El escudo y las poleras, desde 6 cm (tienen texto pequeño); Nico desde 5 cm.</li>
        </ul>
      </div>
      <div class="panel">
        <h3>Antes del tiraje</h3>
        <ul>
          <li><b>Pide una prueba física.</b> Los colores están en RGB; en CMYK el turquesa y el verde pueden apagarse un poco.</li>
          <li>Si la imprenta pide la línea de corte como tinta directa, que asigne el magenta a su <code>CutContour</code>.</li>
          <li>Sticker Mule y StickerApp aceptan estos PDF y generan su propio corte si lo prefieren.</li>
          <li><b>Derechos:</b> el escudo UMSS y los diseños de las poleras de la World Finals son de sus dueños. Para uso del grupo está bien; para vender, confirma con la universidad e ICPC.</li>
          <li><b>Juki y Codeforces:</b> Juki es la mascota de Juki Judge y las barras de colores remiten al logo de Codeforces. Para regalar en el torneo está bien; para venderlos, conviene pedir permiso a Juki y a Codeforces.</li>
          <li><b>El conejo</b> es un personaje propio que hace guiño al reggaetón; no usa la cara ni el nombre de ningún artista.</li>
        </ul>
      </div>
    </div>
  </section>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(ROOT, 'index.html'), html);
console.log('ok index.html');
