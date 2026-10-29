"""Publish only the selected, verified prepress assets. Originals remain untouched."""
from pathlib import Path
import html,json,re,zipfile
from PIL import Image
root=Path(__file__).resolve().parents[1]; delivery=root/'entrega-stickers'
config=json.loads((root/'seleccion-galeria.json').read_text()); entries=config['entries']
selected=[e for e in entries if e['status']=='selected']
manifest=json.loads((delivery/'manifest.json').read_text()); by_source={r['source']:r for r in manifest}
assert set(by_source)=={e['file'] for e in selected}
for r in manifest:
 with Image.open(delivery/r['master']) as im:im.load();assert im.mode=='RGBA'
old=(root/'galeria-stickers.html').read_text(); style=re.search(r'<style>(.*?)</style>',old,re.S).group(1)
style+='\narticle img{background:#e9e7e1;object-fit:contain;padding:20px;box-sizing:border-box} .downloads{padding:0 18px 20px;font-size:14px;line-height:1.8} .notice{max-width:850px;line-height:1.6}'
esc=html.escape
parts=['<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SanSi Cup · selección</title><style>'+style+'</style></head><body><main><div class="eyebrow">Selección y acabado · Octubre 2026</div><h1>SanSi Cup & amigos.</h1><p class="notice">29 diseños con fondo transparente. Lettering elegido y las tres mascotas al frente. Cada sticker se puede descargar en 4, 6 y 8 cm a 300 ppp, con el borde blanco incluido en la medida.</p><p><a href="Seleccion-stickers.zip">Descargar todo el paquete</a> · <a href="SanSi-Cup-seleccion.zip">Solo SanSi Cup</a> · <a href="entrega-stickers/prueba-tamano-real.pdf">Prueba al 100 %</a></p><p class="notice"><a href="entrega-stickers/arte-y-corte-base.pdf">PDF base de arte y corte</a> · <a href="entrega-stickers/LEEME-IMPRENTA.txt">Instrucciones para imprenta</a><br>Base con sangrado blanco de 3 mm y tinta CutContour. Falta validar la configuración del proveedor y una prueba física. Los SVG de mascotas contienen imagen incrustada y contorno vectorial.</p>']
for group,title in config['groups'].items():
 members=[e for e in selected if e['group']==group]
 if not members:continue
 parts.append(f'<section id="{esc(group)}"><h2>{esc(title)}</h2><div class="grid">')
 for e in members:
  r=by_source[e['file']];src='entrega-stickers/'+r['master'];title=e['title'];id=r['id']
  parts.append(f'<article><a href="{esc(src)}"><img loading="lazy" src="{esc(src)}" alt="{esc(title)}"></a><h3>{esc(title)}</h3><p style="padding:0 18px;font-size:13px">Tamaño recomendado: {r["recommended_cm"]} cm</p><div class="downloads">PNG: '+ ' · '.join(f'<a download href="entrega-stickers/png-300dpi/{id}-{cm}cm.png">{cm} cm</a>' for cm in [4,6,8])+f'<br><a download href="entrega-stickers/contornos-svg/{id}.svg">Contorno SVG</a></div></article>')
 parts.append('</div></section>')
parts.append('</main></body></html>');page='\n'.join(parts)
assert all(e['file'] not in page for e in entries if e['status']!='selected')
assert len(re.findall('<article>',page))==len(selected)
(root/'galeria-stickers.html').write_text(page)
with zipfile.ZipFile(root/'Seleccion-stickers.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(delivery.rglob('*')):
  if p.is_file() and 'revision' not in p.relative_to(delivery).parts:z.write(p,p.relative_to(root))
with zipfile.ZipFile(root/'SanSi-Cup-seleccion.zip','w',zipfile.ZIP_DEFLATED) as z:
 for r in manifest:
  if r['group']!='coleccion-sansicup-v7':continue
  for folder in ['maestros-png','png-300dpi','contornos-svg','svg-con-corte']:
   for p in (delivery/folder).glob(r['id']+'*'):z.write(p,p.relative_to(delivery))
 z.write(delivery/'LEEME-IMPRENTA.txt','LEEME-COLECCION-COMPLETA.txt')
 z.writestr('CONTENIDO.txt','Subconjunto: cuatro diseños SanSi Cup. La documentación general describe el paquete completo; los PDF están en la descarga completa.\n')
for name in ['Seleccion-stickers.zip','SanSi-Cup-seleccion.zip']:
 with zipfile.ZipFile(root/name) as z:assert z.testzip() is None
print(f'Gallery: {len(selected)} selected, all transparent. Two ZIP files verified.')
