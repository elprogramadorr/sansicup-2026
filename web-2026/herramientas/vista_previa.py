"""Renderiza la página de inicio sin Grav, para revisarla en el navegador.

    python herramientas/vista_previa.py   ->  vista-previa/index.html

Las plantillas usan solo la parte de Twig que Jinja entiende igual; las funciones de Grav
(url, assets, home_url) se imitan abajo.
"""
from pathlib import Path

import jinja2
import markdown
import yaml

RAIZ = Path(__file__).resolve().parent.parent
TEMA = RAIZ / 'tema/sansicup'
SALIDA = RAIZ / 'vista-previa'


class Pagina:
    def __init__(self, ruta):
        texto = ruta.read_text()
        _, cabecera, cuerpo = texto.split('---', 2)
        self.header = yaml.safe_load(cabecera)
        self.title = self.header['title']
        self.home = True
        self.content = markdown.markdown(cuerpo)


class Assets:
    css = js = staticmethod(lambda: '')


def url(ruta, absoluta=False):
    return '../tema/sansicup/' + ruta.removeprefix('theme://')


env = jinja2.Environment(loader=jinja2.FileSystemLoader(TEMA / 'templates'), autoescape=True)
env.filters['raw'] = jinja2.filters.do_mark_safe
html = env.get_template('evento.html.twig').render(
    page=Pagina(RAIZ / 'pagina/inicio.md'), url=url, assets=Assets, home_url='index.html')
SALIDA.mkdir(exist_ok=True)
(SALIDA / 'index.html').write_text(html)
print(SALIDA / 'index.html')
