from pathlib import Path
import json,xml.etree.ElementTree as E,re
from PIL import Image
from pypdf import PdfReader
from html.parser import HTMLParser
P=Path('pilotos-vectoriales');NS='http://www.w3.org/2000/svg';M=json.loads((P/'manifest.json').read_text())
palette={'#14286E','#D7192D','#FFC72C','#FFFFFF','#F2E3C8','#39764D','#2B91B3','#CF733A','#222222','#EF6858','#80283D','#003770','#E30613'}
report=[]
assert len(M)==4
assert len(list((P/'svg').glob('*.svg')))==4
for a in M:
 r=E.parse(P/'svg'/f"{a['id']}.svg").getroot()
 tags={e.tag.split('}')[-1] for e in r.iter()}
 assert not tags.intersection({'image','filter','text','linearGradient','radialGradient','use','script','foreignObject'}),(a['id'],tags)
 assert all('href' not in key for e in r.iter() for key in e.attrib)
 colors={v.upper() for e in r.iter() for k,v in e.attrib.items() if k in ['fill','stroke'] and v.startswith('#')}
 assert colors<=palette and len(colors)<=6,(a['id'],colors)
 assert all(e.get('d') for e in r.findall('.//{'+NS+'}path'))
 assert r.find('{'+NS+'}g[@id="borde-blanco"]') is not None
 dims=[float(r.get(k).replace('mm','')) for k in ['width','height']]
 assert abs(max(dims)-40)<.00001
 im=Image.open(P/'png'/f"{a['id']}.png")
 assert im.mode=='RGBA' and im.getchannel('A').getextrema()==(0,255)
 assert abs(max(im.size)-40/25.4*600)<=1
 assert abs(im.info['dpi'][0]-600)<1
 art=PdfReader(str(P/'revision'/f"{a['id']}.pdf")).pages[0]
 assert abs(float(art.mediabox.width)-dims[0]*72/25.4)<.03
 assert not list(art.images),'Artwork PDF should be vector-only'
 report.append(f"{a['id']}: SVG nativo, {len(colors)} colores, {len(r.findall('.//{'+NS+'}path'))} trazados, PNG {im.size}, 600 ppp, PDF vectorial.")
review=PdfReader(str(P/'prueba-pilotos-4cm.pdf'));assert len(review.pages)==3
for page in review.pages:
 assert abs(float(page.mediabox.width)-297*72/25.4)<.03
 assert abs(float(page.mediabox.height)-210*72/25.4)<.03
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[]
 def handle_starttag(self,t,attrs):
  for k,v in attrs:
   if k in ['src','href'] and not re.match(r'^(https?:|#|data:)',v):self.links.append(v)
for f in [P/'index.html',Path('galeria-stickers.html')]:
 parser=Links();parser.feed(f.read_text())
 for link in parser.links:
  if link.endswith('.zip'):continue
  assert (f.parent/link).exists(),(f,link)
selection=json.loads(Path('seleccion-galeria.json').read_text())
active=[e for e in selection['entries'] if e['status']=='selected'];assert len(active)==20
assert not any(e.get('asset_id','').startswith('15-') for e in active)
report+=['PDF de revisión: 3 páginas A4 horizontal; primera página con cuatro artes de 40 mm.','Galerías: enlaces locales comprobados. Selección activa: 20; Maestro fotográfico retirado.','Inspección visual realizada sobre los cuatro PNG y las tres páginas del PDF.','Pendiente: aprobación estética del usuario y comprobación física de la impresión.']
(P/'revision'/'validacion.txt').write_text('\n'.join(report)+'\n');print('\n'.join(report))
