from pathlib import Path
import sys,copy,json,re,xml.etree.ElementTree as E
sys.path.insert(0,str(Path('coleccion-v3/tools/vendor').resolve()))
from fontTools.svgLib.path import parse_path
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
P=Path('pilotos-vectoriales'); NS='http://www.w3.org/2000/svg'; INK='http://www.inkscape.org/namespaces/inkscape'
E.register_namespace('',NS); E.register_namespace('inkscape',INK)
C=dict(navy='#14286E',red='#D7192D',gold='#FFC72C',white='#FFFFFF',cream='#F2E3C8',green='#39764D',blue='#2B91B3',orange='#CF733A')
def tx(d,m):
 p=SVGPathPen(None); parse_path(d,TransformPen(p,m)); return p.getCommands()
def bounds(d):
 p=BoundsPen(None);parse_path(d,p);return p.bounds
def source(a):
 r=E.parse(P/'trabajo'/f'{a}-dibujo.svg');return [copy.deepcopy(e) for e in r.getroot().find(f'{{{NS}}}g[@id="dibujo"]')]
def shape(d,c,label,line=0):return dict(d=d,fill=C[c],label=label,line=line)
cat=source('gatita'); pupil=cat[10].get('d')
def eye(x,y,w,h):
 b=bounds(pupil);return tx(pupil,(w/(b[2]-b[0]),0,0,h/(b[3]-b[1]),x-w*b[0]/(b[2]-b[0]),y-h*b[1]/(b[3]-b[1])))
configs={
 'galano':[('green','Silueta',8),('gold','Corona',0),('blue','Frente azul',0),('navy','Pico',0),('navy','Ala exterior',0),('green','Ala interior',0),('blue','Plano del pico',0)],
 'perrito':[('navy','Chaqueta',8),('cream','Manga izquierda',5),('cream','Manga derecha',5),('cream','Oreja izquierda',7),('cream','Oreja derecha',7),('white','Cabeza',7),('cream','Hocico',0),('navy','Nariz',0),('navy','Boca',0)],
 'gatita':[('navy','Lomo',7),('white','Pecho',0),('white','Cabeza',7),('orange','Oreja izquierda',0),('orange','Oreja derecha',0),('navy','Mancha izquierda',0),('orange','Mancha derecha',0),('green','Ojo izquierdo',3),('green','Ojo derecho',3),('orange','Nariz',0),('navy','Pupila izquierda',0),('navy','Pupila derecha',0),('navy','Boca',0)]}
art={}
for a,cfg in configs.items():
 src=source(a)
 if a=='perrito' and len(src)==10: src[5]=src.pop()
 assert len(src)==len(cfg),(a,len(src),len(cfg))
 items=[shape(p.get('d'),c,l,w) for p,(c,l,w) in zip(src,cfg)]
 if a=='galano':
  items += [shape(eye(794,240,65,65),'white','Anillo del ojo'),shape(eye(815,249,34,46),'navy','Ojo')]
 if a=='perrito':
  items += [shape(eye(727,287,34,43),'navy','Ojo izquierdo'),shape(eye(865,288,34,43),'navy','Ojo derecho')]
 art[a]=items
# Lettering comes from the approved traced signature, never synthesized from a new script font.
r=E.parse(P/'trabajo'/'lettering-trazado-inicial.svg').getroot()
# Keep the characteristic sharp script terminals. Only adopt the cleaned badge curve.
clean=E.parse(P/'trabajo'/'lettering-curvas.svg').getroot()
r.find('.//{'+NS+'}path').set('d',clean.find('.//{'+NS+'}path').get('d'))
logo=[]
for g in r.findall(f'{{{NS}}}g'):
 for e in g.findall(f'{{{NS}}}path'):
  color=e.get('fill') or g.get('fill');
  if not color:
   color=re.search(r'#[0-9A-Fa-f]{6}',E.tostring(g).decode()).group()
  logo.append(dict(d=e.get('d'),fill=color.upper(),label=g.get('{'+INK+'}label','Firma'),line=0))
def bb(items):
 bs=[bounds(p['d']) for p in items];return min(b[0]-p['line']/2 for b,p in zip(bs,items)),min(b[1]-p['line']/2 for b,p in zip(bs,items)),max(b[2]+p['line']/2 for b,p in zip(bs,items)),max(b[3]+p['line']/2 for b,p in zip(bs,items))
def fit(items,x,y,w=None,h=None):
 b=bb(items);s=w/(b[2]-b[0]) if w else h/(b[3]-b[1]);return [dict(p,d=tx(p['d'],(s,0,0,s,x-b[0]*s,y-b[1]*s)),line=p['line']*s) for p in items]
logo=fit(logo,0,0,w=500)
manifest=[]
for i,a in enumerate(['lettering','galano','perrito','gatita'],1):
 items=copy.deepcopy(logo)
 if a!='lettering':
  pet=fit(art[a],0,0,h=330); b=bb(pet);pw=b[2]-b[0];pet=fit(pet,(500-pw)/2,0,h=330)
  items=pet+fit(logo,0,252,w=500)
 b=bb(items);core=max(b[2]-b[0],b[3]-b[1]);border=core/18
 vb=[b[0]-border,b[1]-border,b[2]-b[0]+2*border,b[3]-b[1]+2*border]
 wmm=40*vb[2]/max(vb[2:]);hmm=40*vb[3]/max(vb[2:])
 root=E.Element('{'+NS+'}svg',dict(width=f'{wmm:.6f}mm',height=f'{hmm:.6f}mm',viewBox=' '.join(f'{v:.6f}' for v in vb)))
 E.SubElement(root,'{'+NS+'}title').text=f'SanSi Cup 2026 — piloto {a}'
 E.SubElement(root,'{'+NS+'}desc').text='Piloto de aprobación. Mascota dibujada con Bézier en Inkscape; firma trazada desde la versión aprobada. Borde blanco de 2 mm a 4 cm. Sin imágenes incrustadas.'
 bordergroup=E.SubElement(root,'{'+NS+'}g',{'id':'borde-blanco','{'+INK+'}groupmode':'layer','{'+INK+'}label':'01 · Borde blanco 2 mm'})
 for j,p in enumerate(items):
  E.SubElement(bordergroup,'{'+NS+'}path',{'d':p['d'],'fill':'#FFFFFF','stroke':'#FFFFFF','stroke-width':str(border*2+p['line']),'stroke-linejoin':'round','stroke-linecap':'round'})
 layers={}
 for j,p in enumerate(items):
  family='firma' if j>=len(items)-len(logo) else 'mascota'
  if family not in layers:
   if family=='firma' and a!='lettering':
    separation=E.SubElement(root,'{'+NS+'}g',{'id':'reserva-firma','{'+INK+'}groupmode':'layer','{'+INK+'}label':'03 · Reserva blanca de la firma'})
    for q in items[-len(logo):]:
     E.SubElement(separation,'{'+NS+'}path',{'d':q['d'],'fill':'#FFFFFF','stroke':'#FFFFFF','stroke-width':str(border*2),'stroke-linejoin':'round','stroke-linecap':'round'})
   layers[family]=E.SubElement(root,'{'+NS+'}g',{'id':family,'{'+INK+'}groupmode':'layer','{'+INK+'}label':('04 · Firma' if family=='firma' else '02 · Mascota')})
  attrs={'id':f'{family}-{j:02}','d':p['d'],'fill':p['fill'],'fill-rule':'evenodd','{'+INK+'}label':p['label']}
  if p['line']:attrs.update({'stroke':C['navy'],'stroke-width':str(p['line']),'stroke-linejoin':'round','stroke-linecap':'round'})
  E.SubElement(layers[family],'{'+NS+'}path',attrs)
 name=f'{i:02}-sansicup-{a}'
 E.ElementTree(root).write(P/'svg'/f'{name}.svg',encoding='unicode',xml_declaration=True)
 manifest.append(dict(id=name,animal=a,width_mm=wmm,height_mm=hmm,colors=sorted(set(p['fill'] for p in items)|{'#FFFFFF'}),objects=len(items),border_mm=2))
(P/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps(manifest,indent=2))
