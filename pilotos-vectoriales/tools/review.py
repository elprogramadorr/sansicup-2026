from pathlib import Path
import json,subprocess,io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import landscape,A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import ImageReader
from pypdf import PdfReader,PdfWriter,Transformation
P=Path('pilotos-vectoriales');M=json.loads((P/'manifest.json').read_text());INK=str(Path('tools/apps/Inkscape.app/Contents/MacOS/inkscape').resolve())
NAMES=['Firma SanSi Cup','Galano','Perrito','Gatita']
for a in M:
 out=P/'revision'/f"{a['id']}.pdf"
 result=subprocess.run([INK,str(P/'svg'/f"{a['id']}.svg"),'--export-type=pdf',f'--export-filename={out}'],capture_output=True,text=True)
 assert result.returncode==0,result.stderr
W,H=landscape(A4);buf=io.BytesIO();c=canvas.Canvas(buf,pagesize=(W,H));c.setTitle('SanSi Cup — cuatro pilotos vectoriales');placements=[]
def text(x,y,t,size=10,bold=False):
 c.setFillColor(HexColor('#14286E'));c.setFont('Helvetica-Bold' if bold else 'Helvetica',size);c.drawString(x*mm,y*mm,t)
def bg(x,y,w,h):
 c.setFillColor(HexColor('#E8E5DF'));c.roundRect(x*mm,y*mm,w*mm,h*mm,3*mm,stroke=0,fill=1)
def ref(a,x,y,w,h):
 f=P/'referencias'/f"{a['animal']}.png";r=ImageReader(str(f));iw,ih=r.getSize();s=min(w/iw,h/ih);c.drawImage(r,(x+(w-iw*s)/2)*mm,(y+(h-ih*s)/2)*mm,iw*s*mm,ih*s*mm,mask='auto')
def ruler(y=17):
 text(16,y+8,'Imprimir al 100 % / tamaño real. Esta regla debe medir 50 mm.',9)
 c.setStrokeColor(HexColor('#14286E'));c.setLineWidth(.6);c.line(16*mm,y*mm,66*mm,y*mm)
 for j in range(11):c.line((16+j*5)*mm,y*mm,(16+j*5)*mm,(y+(3 if j%2==0 else 1.5))*mm)
 text(16,y-5,'0',7);text(60,y-5,'50 mm',7)
text(16,191,'SanSi Cup / cuatro pilotos',23,True);text(16,181,'Prueba de lectura · lado mayor de 40 mm, incluido el borde blanco de 2 mm',10)
for i,a in enumerate(M):
 x=16+i*68;text(x,166,f'{i+1:02}  {NAMES[i]}',11,True)
 ref(a,x,99,60,61);text(x,94,'Referencia',8)
 bg(x,39,60,49);sx=x+(60-a['width_mm'])/2;sy=43+(40-a['height_mm'])/2
 placements.append((0,i,sx,sy,1))
 text(x,34,f"{a['width_mm']:.1f} × {a['height_mm']:.1f} mm",8)
ruler();c.showPage()
for page,ids in enumerate([[0,1],[2,3]],1):
 text(16,191,'Comparación ampliada',23,True);text(16,181,'Pilotos para aprobar el estilo y el parecido. El tamaño de estas vistas es 8 cm.',10)
 for row,i in enumerate(ids):
  a=M[i];y=95-row*86
  text(16,y+73,f'{i+1:02}  {NAMES[i]}',13,True)
  ref(a,16,y,65,65);text(16,y-5,'Referencia fotográfica' if i else 'Lettering elegido',8)
  bg(102,y-4,90,80);sx=107+(80-a['width_mm']*2)/2;sy=y-4+(80-a['height_mm']*2)/2
  placements.append((page,i,sx,sy,2))
  text(207,y+53,'SVG editable',11,True)
  text(207,y+43,'Formas y colores planos.',9)
  text(207,y+34,'Sin imágenes incrustadas.',9)
  text(207,y+25,'Misma firma en las cuatro piezas.',9)
  if i==3:text(207,y+16,'Sin corazón.',9)
 text(207,9,f'Pilotos · revisión {page+1}/3',8)
 c.showPage()
c.save();base=PdfReader(buf);writer=PdfWriter()
for n,page in enumerate(base.pages):
 for pageid,i,x,y,s in placements:
  if n!=pageid:continue
  art=PdfReader(str(P/'revision'/f"{M[i]['id']}.pdf")).pages[0]
  expected=M[i]['width_mm']*mm
  assert abs(float(art.mediabox.width)-expected)<.03
  page.merge_transformed_page(art,Transformation().scale(s).translate(x*mm,y*mm))
 writer.add_page(page)
writer.add_metadata({'/Title':'SanSi Cup — pilotos a 4 cm y comparaciones','/Subject':'Prueba de aprobación; no es un archivo final de producción'})
with (P/'prueba-pilotos-4cm.pdf').open('wb') as f:writer.write(f)
print('PDF de revisión: 3 páginas; arte vectorial y referencias fotográficas.')
