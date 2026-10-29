"""Genera los adornos SVG estáticos del tema (mismos trazos que afiche-clasificatoria/afiche.html).

    python3 herramientas/adornos.py   ->  tema/sansicup/templates/partials/{adornos,colina}.html.twig
"""
from pathlib import Path

PARTIALS = Path(__file__).resolve().parent.parent / 'tema/sansicup/templates/partials'
ORO, ORO_HONDO, CREMA = '#D9B15C', '#B68A34', '#F6EEDF'


def chispa(x, y, r, k=.22):
    """Estrella de cuatro puntas, la misma de la colección de stickers."""
    a, b = k * r, k * r
    return (f'M{x},{y - r} C{x + a},{y - b} {x + a},{y - b} {x + r},{y} '
            f'C{x + a},{y + b} {x + a},{y + b} {x},{y + r} '
            f'C{x - a},{y + b} {x - a},{y + b} {x - r},{y} '
            f'C{x - a},{y - b} {x - a},{y - b} {x},{y - r} Z')


oid = 0


def globo(x, largo, r, color, oscuro, letra, color_letra='#FFF6E6'):
    """Globo de ICPC vestido de esfera navideña, con la letra del problema."""
    global oid
    oid += 1
    i = f'g{oid}'
    cw, ch = r * .5, r * .26
    cy0 = largo + 7
    cy = cy0 + ch + r - r * .1
    f = lambda v: f'{v:.1f}'
    return f'''<g class="globo-{letra.lower()}">
  <line x1="{x}" y1="0" x2="{x}" y2="{largo}" stroke="{ORO}" stroke-width="1.6" opacity=".85"/>
  <circle cx="{x}" cy="{largo + 3}" r="4.5" fill="none" stroke="{ORO}" stroke-width="2"/>
  <clipPath id="{i}"><circle cx="{x}" cy="{f(cy)}" r="{r}"/></clipPath>
  <g clip-path="url(#{i})">
    <circle cx="{x}" cy="{f(cy)}" r="{r}" fill="{oscuro}"/>
    <circle cx="{f(x - r * .16)}" cy="{f(cy - r * .16)}" r="{f(r * .97)}" fill="{color}"/>
    <ellipse cx="{x}" cy="{f(cy)}" rx="{r}" ry="{f(r * .2)}" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="{f(r * .07)}"/>
  </g>
  <ellipse cx="{f(x - r * .45)}" cy="{f(cy - r * .42)}" rx="{f(r * .13)}" ry="{f(r * .24)}" transform="rotate(38 {f(x - r * .45)} {f(cy - r * .42)})" fill="#fff" opacity=".55"/>
  <rect x="{f(x - cw / 2)}" y="{f(cy0)}" width="{f(cw)}" height="{f(ch)}" rx="2.5" fill="{ORO}"/>
  <rect x="{f(x - cw / 2)}" y="{f(cy0 + ch * .45)}" width="{f(cw)}" height="{f(max(1.5, ch * .14))}" fill="{ORO_HONDO}"/>
  <text x="{f(x + r * .02)}" y="{f(cy + r * .34)}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-weight="560" font-size="{f(r * .98)}" fill="{color_letra}">{letra}</text></g>'''


def cristo(x, y, h, fill):
    """Cristo de la Concordia; x = centro, y = suelo; dibujado sobre una caja de 200 x 220."""
    k = h / 220
    T = lambda px, py: f'{x + (px - 100) * k:.1f},{y + (py - 220) * k:.1f}'
    P = lambda pts: 'M' + ' L'.join(T(*p) for p in pts) + ' Z'
    return f'''<g fill="{fill}">
    <path d="{P([(56, 220), (144, 220), (140, 206), (60, 206)])}"/>
    <path d="{P([(68, 206), (132, 206), (129, 195), (71, 195)])}"/>
    <path d="M{T(85, 196)} C{T(86, 160)} {T(87, 122)} {T(86, 92)} L{T(84, 64)} L{T(116, 64)} L{T(114, 92)} C{T(113, 122)} {T(114, 160)} {T(115, 196)} Z"/>
    <path d="{P([(88, 60), (34, 55), (26, 55), (26, 61), (34, 63), (50, 65), (60, 74), (74, 86), (88, 92)])}"/>
    <path d="{P([(112, 60), (166, 55), (174, 55), (174, 61), (166, 63), (150, 65), (140, 74), (126, 86), (112, 92)])}"/>
    <path d="{P([(94, 66), (95, 52), (105, 52), (106, 66)])}"/>
    <ellipse cx="{x}" cy="{y + (42 - 220) * k:.1f}" rx="{8.5 * k:.1f}" ry="{11 * k:.1f}"/>
  </g>'''


aviso = '{# Generado por herramientas/adornos.py; editar allí. #}\n'

# Globos: problemas A–E, colgando de las esquinas del cielo
izq = (globo(70, 96, 46, '#D7192D', '#A80F20', 'A') +
       globo(158, 36, 28, '#3FA34D', '#2C7A3B', 'B'))
der = (globo(150, 56, 40, '#FFC72C', '#E89A1C', 'C', '#14286E') +
       globo(62, 150, 33, '#2F6FD0', '#1F4FA0', 'D') +
       globo(196, 196, 21, '#D7192D', '#A80F20', 'E'))

chispas = [  # estrellas sueltas del cielo: (izquierda %, arriba px, radio, color)
    (21, 140, 9, ORO), (84, 300, 8, CREMA), (9, 420, 7, ORO), (91, 520, 6, ORO),
    (4, 600, 5, CREMA), (79, 110, 5, CREMA), (95, 690, 6, CREMA),
]
chispas_html = '\n'.join(
    f'  <svg class="chispa" style="left:{l}%;top:{t}px" width="{2 * r}" height="{2 * r}" viewBox="0 0 {2 * r} {2 * r}" aria-hidden="true">'
    f'<path d="{chispa(r, r, r)}" fill="{c}"/></svg>'
    for l, t, r, c in chispas)

(PARTIALS / 'adornos.html.twig').write_text(aviso + f'''<div class="adornos" aria-hidden="true">
  <svg class="globos globos-izq" viewBox="0 0 220 260" width="220" height="260">{izq}
  </svg>
  <svg class="globos globos-der" viewBox="0 0 230 280" width="230" height="280">{der}
  </svg>
{chispas_html}
</div>
''')

# Colina: cerro de fondo con el Cristo iluminado y el borde crema que abre el contenido
CERRO = 'M0,60 C20,52 44,48 64,48 C88,48 114,58 150,76 C200,98 250,106 300,110 L300,140 L0,140 Z'
BORDE = 'M0,70 C240,38 480,30 720,44 C960,58 1200,52 1440,24 L1440,120 L0,120 Z'
(PARTIALS / 'colina.html.twig').write_text(aviso + f'''<div class="colina" aria-hidden="true">
  <svg class="cerro" viewBox="0 -60 300 200" width="300" height="200">
    <defs><radialGradient id="halo"><stop offset="0" stop-color="{CREMA}" stop-opacity=".22"/><stop offset="1" stop-color="{CREMA}" stop-opacity="0"/></radialGradient></defs>
    <circle cx="64" cy="10" r="62" fill="url(#halo)"/>
    <path d="{CERRO}" fill="#192D77"/>
    {cristo(64, 50, 70, '#F3E9D6')}
  </svg>
  <svg class="borde" viewBox="0 0 1440 120" preserveAspectRatio="none">
    <path d="{BORDE}" fill="var(--crema)"/>
    <path d="{BORDE.split(' L1440')[0]}" fill="none" stroke="var(--oro)" stroke-width="2" vector-effect="non-scaling-stroke"/>
  </svg>
</div>
''')
print('ok')
