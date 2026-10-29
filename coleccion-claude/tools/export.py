"""Export print files from the SVG masters: art PDF (with white border, no
cut line), cut-line PDF, and transparent PNGs, at each size listed in
manifest.json (cm, longest side)."""
import json
import re
import sys
from pathlib import Path

import cairosvg

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "imprenta"
OUT.mkdir(exist_ok=True)


def sized(svg: str, cm: float) -> str:
    vb = [float(v) for v in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
    w, h = vb[2], vb[3]
    k = cm * 10 / max(w, h)
    svg = re.sub(r'width="[\d.]+mm" height="[\d.]+mm"', f'width="{w * k:.3f}mm" height="{h * k:.3f}mm"', svg, count=1)
    # keep the cut line at 0.25 pt whatever the size
    return re.sub(r'(stroke="#EC008C" stroke-width=")[\d.]+', lambda m: f"{m.group(1)}{0.25 * 0.3528 / k:.4f}", svg)


LAYERS = ['<g id="borde-blanco"', '<g id="arte"', '<g id="CutContour"', "</svg>"]


def strip(svg: str, layer: str) -> str:
    """Remove a top-level layer (layers contain nested groups, so cut up to the next layer)."""
    i = svg.index(f'<g id="{layer}"')
    j = min(svg.index(m, i + 1) for m in LAYERS if svg.find(m, i + 1) != -1)
    return svg[:i] + svg[j:]


def main():
    manifest = json.loads((ROOT / "manifest.json").read_text())
    for m in manifest:
        sid = m["id"]
        src = (ROOT / "svg" / f"{sid}.svg").read_text()
        d = OUT / sid
        d.mkdir(exist_ok=True)
        for old in d.glob("*"):
            old.unlink()
        for cm in m["sizes"]:
            s = sized(src, cm)
            art = strip(s, "CutContour")
            cut = strip(strip(s, "arte"), "borde-blanco")
            cairosvg.svg2pdf(bytestring=art.encode(), write_to=str(d / f"{sid}_{cm}cm.pdf"))
            cairosvg.svg2pdf(bytestring=cut.encode(), write_to=str(d / f"{sid}_{cm}cm_corte.pdf"))
            cairosvg.svg2png(bytestring=art.encode(), write_to=str(d / f"{sid}_{cm}cm_600dpi.png"), dpi=600)
        (d / f"{sid}.svg").write_text(src)
        print("ok", sid)


def export_sheets():
    """A5 kiss-cut sheets written by sheet.js: art PDF, cut PDF, 300 dpi PNG."""
    for d in sorted(OUT.glob("planilla-*")):
        name = d.name
        if not (d / f"{name}.svg").exists():
            continue
        cairosvg.svg2pdf(url=str(d / f"{name}.svg"), write_to=str(d / f"{name}.pdf"))
        cairosvg.svg2pdf(url=str(d / f"{name}_corte.svg"), write_to=str(d / f"{name}_corte.pdf"))
        cairosvg.svg2png(url=str(d / f"{name}.svg"), write_to=str(d / f"{name}_300dpi.png"), dpi=300)
        print("ok", name)


if __name__ == "__main__":
    main()
    export_sheets()
