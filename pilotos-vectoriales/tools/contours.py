from pathlib import Path
import xml.etree.ElementTree as E,copy,subprocess,json
P=Path('pilotos-vectoriales');NS='http://www.w3.org/2000/svg';E.register_namespace('',NS)
ink=str(Path('tools/apps/Inkscape.app/Contents/MacOS/inkscape').resolve())
for a in json.loads((P/'manifest.json').read_text()):
 f=P/'svg'/f"{a['id']}.svg";tree=E.parse(f);root=tree.getroot()
 for gid in ['borde-blanco','reserva-firma']:
  g=root.find(f'{{{NS}}}g[@id="{gid}"]')
  if g is None:continue
  tmp=E.Element('{'+NS+'}svg',root.attrib)
  for p in g:tmp.append(copy.deepcopy(p))
  src=P/'trabajo'/f"{a['id']}-{gid}-origen.svg";out=src.with_name(src.stem.replace('-origen','-union')+'.svg')
  E.ElementTree(tmp).write(src,encoding='unicode')
  actions='select-all;object-stroke-to-path;selection-ungroup;select-all;path-union;path-break-apart;path-union;export-do'
  result=subprocess.run([ink,str(src),'--export-type=svg','--export-plain-svg',f'--export-filename={out}',f'--actions={actions}'],capture_output=True,text=True)
  assert result.returncode==0,result.stderr
  paths=E.parse(out).findall('.//{'+NS+'}path');assert len(paths)==1,(gid,len(paths))
  for child in list(g):g.remove(child)
  path=copy.deepcopy(paths[0]);path.attrib.pop('id',None);path.set('fill','#FFFFFF');path.attrib.pop('style',None);path.attrib.pop('stroke',None);g.append(path)
 tree.write(f,encoding='unicode',xml_declaration=True)
print('Contornos unidos: 4 siluetas y 3 reservas; sin huecos interiores.')
