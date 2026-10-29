"""Create physical-size proof and provisional RGB + spot-cut prepress document."""
from pathlib import Path
import json,re,math
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, CMYKColorSep
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject
root=Path(__file__).resolve().parents[2]; out=root/'entrega-stickers'
rows=json.loads((out/'manifest.json').read_text())
navy=HexColor('#14286E'); muted=HexColor('#59636E')
def text(c,s,x,y,size=10,color=navy,bold=False):
 c.setFillColor(color);c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.drawString(x*mm,y*mm,s)
def art(c,r,x,y,cm):
 scale=cm*10*mm/max(r['width'],r['height']); w=r['width']*scale; h=r['height']*scale
 c.drawImage(ImageReader(str(out/r['master'])),x*mm,y*mm,width=w,height=h,mask='auto')
 return w,h
proof=out/'prueba-tamano-real.pdf'; c=canvas.Canvas(str(proof),pagesize=(210*mm,297*mm));c.setTitle('SanSi Cup - prueba de tamaños reales')
text(c,'SANSi CUP / PRUEBA DE TAMAÑO',15,280,19,bold=True)
text(c,'Imprimir al 100 %, sin ajustar a la página.',15,268,12)
text(c,'El lado mayor incluye el borde blanco. La regla debe medir 50 mm.',15,260,9,muted)
c.setStrokeColor(navy);c.setLineWidth(.6);c.line(15*mm,250*mm,65*mm,250*mm)
for i in range(6):c.line((15+i*10)*mm,248*mm,(15+i*10)*mm,252*mm)
text(c,'50 mm',70,249,9)
text(c,'Lettering',15,231,13,bold=True); text(c,'Mascota',115,231,13,bold=True)
y=225
for cm in [4,6,8]:
 art(c,rows[0],15,y-rows[0]['height']/rows[0]['width']*cm*10,cm)
 art(c,rows[2],115,y-cm*10,cm)
 text(c,f'{cm} cm',100,y-5,10,bold=True)
 y-=cm*10+10
text(c,'4 cm: lettering. 6 cm: mascotas y frases. 8 cm: poleras con texto.',15,20,9,muted)
text(c,'Prueba visual; no usar esta página como archivo de corte.',15,13,9,muted)
c.showPage()
for start in range(0,len(rows),4):
 text(c,'SELECCIÓN / TAMAÑOS RECOMENDADOS',15,281,15,bold=True)
 text(c,'Imprimir al 100 %. Cada imagen está a su tamaño final, con borde incluido.',15,271,9,muted)
 for j,r in enumerate(rows[start:start+4]):
  col=j%2; row=j//2; x=15+col*96; top=253-row*115; cm=r['recommended_cm']
  c.setFillColor(HexColor('#f2f2ef'));c.roundRect(x*mm,(top-86)*mm,88*mm,86*mm,3*mm,stroke=0,fill=1)
  aw=cm*10*r['width']/max(r['width'],r['height']);ah=cm*10*r['height']/max(r['width'],r['height'])
  art(c,r,x+(88-aw)/2,top-43-ah/2,cm)
  title=f"{start+j+1:02}. {r['title']}"
  words=title.split(); lines=['']
  for word in words:
   if len(lines[-1])+len(word)>37:lines.append('')
   lines[-1]+=(' ' if lines[-1] else '')+word
  for n,line in enumerate(lines):text(c,line,x,top-93-n*4,9,bold=True)
  text(c,f"{cm} cm / lado mayor",x,top-105,9,muted)
 text(c,f'Prueba de escala - {start//4+2} / {math.ceil(len(rows)/4)+1}',15,13,9,muted)
 c.showPage()
c.save()
# A page per sticker with 3 mm white bleed and an overprinted Separation CutContour.
base=out/'arte-y-corte-base.pdf'; c=canvas.Canvas(str(base));c.setTitle('SanSi Cup - arte RGB y corte base - validar con imprenta')
boxes=[]
for r in rows:
 size=r['recommended_cm']*10*mm; scale=size/max(r['width'],r['height']); w=r['width']*scale;h=r['height']*scale;b=3*mm
 c.setPageSize((w+2*b,h+2*b));c.setFillColor(HexColor('#ffffff'));c.rect(0,0,w+2*b,h+2*b,fill=1,stroke=0)
 c.drawImage(ImageReader(str(out/r['master'])),b,b,width=w,height=h,mask='auto')
 tokens=re.findall(r'[MCLZ]|[-+]?(?:\d*\.)?\d+',r['path']);i=0;p=c.beginPath()
 while i<len(tokens):
  if tokens[i] in {'M','L','C','Z'}:op=tokens[i];i+=1
  if op=='Z':p.close();continue
  n={'M':2,'L':2,'C':6}[op];v=list(map(float,tokens[i:i+n]));i+=n
  v=[b+val*scale if j%2==0 else b+h-val*scale for j,val in enumerate(v)]
  if op=='M':p.moveTo(*v)
  elif op=='L':p.lineTo(*v)
  else:p.curveTo(*v)
 p.close()
 c.saveState();c.setStrokeColor(CMYKColorSep(0,1,0,0,spotName='CutContour'));c.setStrokeOverprint(True);c.setLineWidth(.25);c.drawPath(p,stroke=1,fill=0);c.restoreState()
 boxes.append([b,b,b+w,b+h]);c.showPage()
c.save()
reader=PdfReader(str(base));writer=PdfWriter()
for page,box in zip(reader.pages,boxes):
 page.trimbox=RectangleObject(box);page.bleedbox=RectangleObject(page.mediabox);writer.add_page(page)
writer.add_metadata({'/Title':'SanSi Cup - base RGB + CutContour; validar requisitos de imprenta'})
with base.open('wb') as f:writer.write(f)
for p,count in [(proof,9),(base,len(rows))]:
 r=PdfReader(p);assert len(r.pages)==count,(p,len(r.pages))
assert all('/CutContour' in str(p['/Resources'].get('/ColorSpace')) for p in PdfReader(base).pages)
print(f'PDF proof: 9 pages. Print base: {len(rows)} pages, TrimBox/BleedBox + spot CutContour verified.')
