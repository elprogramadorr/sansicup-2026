"""Derive a smooth, continuous white backing from vector geometry, not pixels."""
import sys,re,math,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT/'tools/vendor'))
from shapely.geometry import Polygon,LineString,Point
from shapely.ops import unary_union
from shapely.affinity import affine_transform
from fontTools.svgLib.path import parse_path
from fontTools.pens.basePen import BasePen
from fontTools.misc.transform import Transform
class Flatten(BasePen):
    def __init__(self): super().__init__(None); self.rings=[]; self.points=[]
    def _moveTo(self,p):
        if self.points:self._endPath()
        self.points=[p]
    def _lineTo(self,p):self.points.append(p)
    def _curveToOne(self,a,b,c):
        p=self.points[-1]
        for i in range(1,33):
            t=i/32;u=1-t
            self.points.append(tuple(u*u*u*p[k]+3*u*u*t*a[k]+3*u*t*t*b[k]+t*t*t*c[k] for k in (0,1)))
    def _qCurveToOne(self,a,b):
        p=self.points[-1]
        for i in range(1,25):
            t=i/24;u=1-t
            self.points.append(tuple(u*u*p[k]+2*u*t*a[k]+t*t*b[k] for k in (0,1)))
    def _closePath(self):self.rings.append((self.points,True));self.points=[]
    def _endPath(self):self.rings.append((self.points,False));self.points=[]
def matrix(s):
    t=Transform()
    for name,args in re.findall(r'(translate|scale|rotate)\(([^)]*)\)',s):
        a=[float(x) for x in re.split(r'[ ,]+',args.strip())]
        if name=='translate':t=t.translate(a[0],a[1] if len(a)>1 else 0)
        elif name=='scale':t=t.scale(a[0],a[1] if len(a)>1 else a[0])
        else:
            if len(a)==3:t=t.translate(a[1],a[2]).rotate(math.radians(a[0])).translate(-a[1],-a[2])
            else:t=t.rotate(math.radians(a[0]))
    return t
def geometry(el,parent=Transform()):
    t=parent.transform(matrix(el.get('transform','')));tag=el.tag.split('}')[-1]
    if tag in ['g','svg']:
        return [g for child in el for g in geometry(child,t)]
    pieces=[];rings=[]
    if tag=='path':
        p=Flatten();parse_path(el.get('d'),p)
        if p.points:p._endPath()
        rings=p.rings
    elif tag=='rect':
        x,y,w,h=[float(el.get(k)) for k in ['x','y','width','height']];r=float(el.get('rx',0))
        if r:pieces=[Polygon([(x+r,y+r),(x+w-r,y+r),(x+w-r,y+h-r),(x+r,y+h-r)]).buffer(r)]
        else:pieces=[Polygon([(x,y),(x+w,y),(x+w,y+h),(x,y+h)])]
    elif tag=='ellipse':
        x,y,rx,ry=[float(el.get(k)) for k in ['cx','cy','rx','ry']]
        rings=[([(x+rx*math.cos(i*math.pi/64),y+ry*math.sin(i*math.pi/64)) for i in range(128)],True)]
    else:return []
    sw=float(el.get('stroke-width',0)) if el.get('stroke','none')!='none' else 0
    for pts,closed in rings:
        if len(pts)<2:continue
        if el.get('fill','black')!='none' and len(pts)>2:
            shape=Polygon(pts).buffer(0)
            if sw:shape=shape.buffer(sw/2)
            pieces.append(shape)
        elif sw:pieces.append(LineString(pts+([pts[0]] if closed else [])).buffer(sw/2))
    if tag=='rect' and sw:pieces=[p.buffer(sw/2) for p in pieces]
    return [affine_transform(g,[t.xx,t.yx,t.xy,t.yy,t.dx,t.dy]) for g in pieces]
for file in sorted((ROOT/'svg').glob('*.svg')):
    if 'editable' in file.name:continue
    root=ET.parse(file).getroot();group=list(root)[1];art=list(group)[1]
    # Flatten transforms on the outer art group while deriving the silhouette.
    wrapper=ET.Element('g',{'transform':group.get('transform','')});wrapper.append(art)
    union=unary_union(geometry(wrapper)).buffer(32,quad_segs=12)
    radius=55 if file.name.startswith(('01','06')) else 18
    union=union.buffer(radius,quad_segs=12).buffer(-radius,quad_segs=12)
    if union.geom_type!='Polygon':
        # Connect close islands through white backing; artwork remains untouched.
        union=union.buffer(14).buffer(-14)
    if union.geom_type!='Polygon':raise ValueError(f'{file.name}: disconnected silhouette')
    outer=Polygon(union.exterior).simplify(.25,preserve_topology=True)
    coords=list(outer.exterior.coords)
    d='M '+' L '.join(f'{x:.2f} {y:.2f}' for x,y in coords)+' Z'
    for target in [file,file.with_name(file.stem+'-texto-editable.svg')]:
        raw=target.read_text()
        # Move backing outside rotated art group; derived coordinates already include rotation.
        raw=re.sub(r'<g id="borde-blanco">.*?</g>','',raw)
        marker=raw.index('</title>')+len('</title>')
        raw=raw[:marker]+f'<path id="borde-blanco" d="{d}" fill="#FFFFFF"/>'+raw[marker:]
        target.write_text(raw)
    print(file.name,'continuous white contour')
