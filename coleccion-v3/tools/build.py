"""Construct original vector artwork; real font outlines, no embedded raster images."""
from pathlib import Path
import sys, json, html
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT/'tools/vendor'))
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
N, R, Y, W = '#14286E', '#D7192D', '#FFC72C', '#FFFFFF'
FONTS = {k:TTFont(ROOT/'fonts'/v) for k,v in [('brand','BarlowCondensed-ExtraBold.ttf'),('mono','IBMPlexMono-Bold.ttf')]}
def path(d, fill, stroke=N, sw=12):
    return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>'
def rect(x,y,w,h,fill,r=20,stroke=N,sw=12):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def ellipse(cx,cy,rx,ry,fill,stroke=N,sw=12):
    return f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def text(s,x,y,w,h,fill=N,font='brand',editable=False):
    f=FONTS[font]; gs=f.getGlyphSet(); cmap=f.getBestCmap(); pen=SVGPathPen(gs); bounds=BoundsPen(gs); advance=0
    for c in s:
        name=cmap[ord(c)]; g=gs[name]
        g.draw(TransformPen(pen,(1,0,0,1,advance,0)))
        g.draw(TransformPen(bounds,(1,0,0,1,advance,0)))
        advance+=f['hmtx'][name][0]
    xmin,ymin,xmax,ymax=bounds.bounds
    scale=min(w/(xmax-xmin),h/(ymax-ymin)); tx=x+(w-(xmax-xmin)*scale)/2-xmin*scale; ty=y+(h-(ymax-ymin)*scale)/2+ymax*scale
    if editable:
        family='Barlow Condensed' if font=='brand' else 'IBM Plex Mono'
        return f'<text x="{tx}" y="{ty}" font-family="{family}" font-weight="{800 if font=="brand" else 700}" font-size="{f["head"].unitsPerEm*scale}" fill="{fill}">{html.escape(s)}</text>'
    return f'<path d="{pen.getCommands()}" transform="translate({tx:.4f} {ty:.4f}) scale({scale:.6f} {-scale:.6f})" fill="{fill}"/>'
def brace(x,y,w,h,left=True):
    d='M 100 0 H 68 Q 38 0 38 30 V 68 Q 38 93 0 100 Q 38 107 38 132 V 170 Q 38 200 68 200 H 100'
    # A single substantial red stroke; no doubled decorative outline.
    return f'<g transform="translate({x} {y}) scale({w/100 if left else -w/100} {h/200})">'+path(d,'none',R,22)+'</g>'
def make(kind,edit=False):
    t=lambda s,x,y,w,h,fill=N,font='brand': text(s,x,y,w,h,fill,font,edit)
    if kind==1:
        silhouette='M 210 230 H 790 Q 890 230 890 330 V 670 Q 890 770 790 770 H 210 Q 110 770 110 670 V 330 Q 110 230 210 230 Z'
        art=brace(150,290,90,420)+brace(850,290,90,420,False)
        art+=t('SanSi',260,280,480,245)+t('Cup',265,535,235,175,R)
        art+=rect(515,560,215,135,Y,24,N,12)+t('2026',534,580,177,93)
    elif kind==2:
        silhouette='M 340 120 Q 340 75 400 75 H 640 Q 690 75 730 120 L 810 180 Q 870 180 870 245 V 475 Q 870 570 730 570 L 610 680 V 710 H 725 Q 790 710 790 770 V 845 H 210 V 770 Q 210 710 275 710 H 390 V 680 L 270 570 Q 130 570 130 475 V 245 Q 130 180 190 180 H 340 Z'
        art=brace(160,240,120,310)+brace(840,240,120,310,False)
        art+=path('M 435 550 H 565 V 665 Q 565 705 650 720 H 350 Q 435 705 435 665 Z',Y)
        art+=path('M 270 205 H 730 L 705 405 Q 685 580 500 610 Q 315 580 295 405 Z',Y)
        art+=rect(235,720,530,125,N,24)+t('SanSi Cup',270,737,460,88,W)
        art+=path('M 565 155 Q 615 55 685 105 L 750 178 L 688 165 L 664 130 L 650 178 Z',R)
        art+=rect(550,151,143,48,W,20)+ellipse(750,179,26,26,W)
    elif kind==3:
        silhouette='M 275 130 H 750 Q 805 130 805 185 V 805 Q 805 860 750 860 H 190 Q 135 860 135 805 V 675 Q 135 620 190 620 H 220 V 185 Q 220 130 275 130 Z'
        art=path(silhouette,R)
        art+=t('ONE',270,210,480,125,W,'mono')+t('MORE',270,365,480,125,W,'mono')+t('SUBMIT',260,520,500,105,W,'mono')
        art+=path('M 680 680 V 755 H 370 M 420 710 L 370 755 L 420 800','none',Y,36)
        # The whole key rotates as a single flat silhouette.
        return silhouette,art,'rotate(-6 500 500)'
    elif kind==4:
        silhouette='M 200 635 L 200 555 Q 180 300 440 275 Q 650 255 710 445 Q 810 380 860 450 Q 905 530 805 560 L 770 660 Q 805 690 805 750 V 820 H 195 V 750 Q 195 680 230 660 Z'
        art=path('M 245 560 L 215 640 H 310 L 345 560 M 580 560 L 620 640 H 715 L 690 560',Y)
        art+=path('M 635 470 Q 740 380 815 430 Q 885 475 830 530 Q 800 555 740 535 L 695 585 H 280 Q 235 585 225 540 L 190 510 L 245 475 Z',Y)
        art+=path('M 250 510 Q 230 285 455 285 Q 650 285 700 510 Z',N)
        art+=path('M 390 335 H 560 V 365 L 505 410 L 560 455 V 485 H 390 V 455 L 445 410 L 390 365 Z',W,W,0)
        art+=path('M 414 355 H 536 L 475 397 Z',R,R,0)+path('M 475 435 L 522 469 H 428 Z',R,R,0)
        art+=ellipse(805,465,9,9,N,N,0)
        art+=rect(230,660,540,160,N,24)+t('TLE',300,680,400,120,W,'mono')
    elif kind==5:
        silhouette='M 125 300 Q 85 110 280 110 Q 330 45 500 45 Q 655 45 720 110 Q 915 110 875 300 Q 850 430 745 470 L 650 650 L 705 695 Q 750 720 750 770 V 850 H 250 V 770 Q 250 720 295 695 L 350 650 L 255 470 Q 150 430 125 300 Z'
        art=path('M 280 430 Q 290 565 500 710 M 720 430 Q 710 565 500 710 M 500 400 V 710','none',N,14)
        art+=ellipse(290,295,150,180,R)+ellipse(710,295,150,180,N)
        art+=path('M 278 470 L 270 490 H 306 L 295 470 Z',R)+path('M 708 470 L 695 490 H 730 L 720 470 Z',N)
        art+=ellipse(500,240,160,190,Y)+path('M 493 429 L 478 452 H 522 L 507 429 Z',Y)
        art+=rect(265,710,470,140,N,25)+t('ICPC',300,730,400,100,W)
    else:
        silhouette='M 190 290 H 810 Q 900 290 900 385 V 620 Q 900 710 810 710 H 190 Q 100 710 100 620 V 385 Q 100 290 190 290 Z'
        art=brace(150,335,85,290)+brace(850,335,85,290,False)
        art+=t('UMSS',265,340,470,265)+rect(330,645,340,24,Y,12,Y,0)
    return silhouette,art,''
names=['01-sansicup-2026','02-copa','03-one-more-submit','04-tle','05-icpc','06-umss']
for i,name in enumerate(names,1):
    for edit in [False,True]:
        sil,art,transform=make(i,edit)
        svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000"><title>{name}</title><g transform="{transform}"><g id="borde-blanco">{path(sil,W,W,60)}</g><g id="arte">{art}</g></g></svg>'
        (ROOT/'svg'/f'{name}{"-texto-editable" if edit else ""}.svg').write_text(svg)
print(json.dumps({'svg':12,'colors':[N,R,Y,W],'fonts':list(FONTS)}))
