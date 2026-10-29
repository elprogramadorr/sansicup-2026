from pathlib import Path
import json, re, html, zipfile
from PIL import Image

root = Path(__file__).resolve().parents[1]
gallery = root / 'galeria-stickers.html'
page = gallery.read_text()
sections = []
reports = []
groups = [('coleccion-icpc-animales', 'icpc-animales', 'ICPC UMSS · elige tu animal', 'ICPC-UMSS-animales.zip'), ('coleccion-local-v5', 'local-v5', 'UMSS, ICPC UMSS y Cocha · propuestas locales', 'UMSS-Cocha-propuestas.zip'), ('coleccion-mascotas-v6', 'mascotas-v6', 'Sus mascotas · nueva colección', 'Mascotas-stickers-v6.zip'), ('coleccion-tom', 'tom-v1', 'Tom · Bandida, Bandido y Mucho Maestro', 'Tom-stickers.zip')]
for directory, section_id, title, zipname in groups:
    folder = root / directory
    entries = json.loads((folder / 'manifest.json').read_text())
    cards = []
    for entry in entries:
        path = folder / entry['file']
        with Image.open(path) as im:
            im.load()
            reports.append({'file': str(path.relative_to(root)), 'size': list(im.size), 'mode': im.mode})
        src = html.escape(f"{directory}/{entry['file']}")
        name = html.escape(entry['title'])
        note = html.escape(entry['status'])
        cards.append(f'<article><a href="{src}"><img loading="lazy" src="{src}" alt="{name}"></a><h3>{name}</h3><p style="padding:0 18px;font-size:13px">{note}</p></article>')
    section = f'<section id="{section_id}"><h2>{title}</h2><p>Propuestas con fondo gris. Haz clic para ver cada archivo completo. Preparación de impresión pendiente.</p><div class="grid">' + ''.join(cards) + f'</div><p><a href="{zipname}">Descargar esta colección y sus prompts</a></p></section>'
    page = re.sub(rf'<section id="{section_id}">.*?</section>', '', page, flags=re.S)
    sections.append(section)
    with zipfile.ZipFile(root / zipname, 'w', zipfile.ZIP_DEFLATED) as archive:
        for file in sorted(folder.rglob('*')):
            if file.is_file() and 'alternativas' not in file.parts and file.suffix in {'.png', '.txt', '.json'}:
                archive.write(file, file.relative_to(root))
    with zipfile.ZipFile(root / zipname) as archive:
        assert archive.testzip() is None
anchor = '<section id="merch-v4">'
assert anchor in page
page = page.replace(anchor, '\n'.join(sections) + '\n' + anchor, 1)
sources = re.findall(r'<img[^>]+src="([^"]+)"', page)
assert all((root / html.unescape(src)).is_file() for src in sources)
gallery.write_text(page)
(root / 'coleccion-mascotas-v6' / 'verification.json').write_text(json.dumps({'images': reports, 'gallery_images':len(sources), 'checks':['PNG decoded successfully','gallery image paths exist','ZIP integrity checked'], 'visual_review':'Spelling reviewed, full silhouettes visible. Cat lettering confirmed: Gatitas Bondadosas. Detailed animals best at 6–8 cm; physical print test pending.'}, ensure_ascii=False, indent=2))
print(json.dumps({'gallery_images':len(sources),'new_images':len(reports),'zip_integrity':'passed'},ensure_ascii=False))
