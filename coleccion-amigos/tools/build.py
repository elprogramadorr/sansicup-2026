from pathlib import Path
import sys,html,json
ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT.parent/'coleccion-v3/tools/vendor'))
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
F={k:TTFont(ROOT/'fonts'/v) for k,v in [('bold','BarlowCondensed-ExtraBold.ttf'),('mono','IBMPlexMono-Bold.ttf')]}
def path(d,c,stroke='none',sw=0):return f'<path d="{d}" fill="{c}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"/>'
def rect(x,y,w,h,c,r=24,stroke='none',sw=0):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{c}" stroke="{stroke}" stroke-width="{sw}"/>'
def circle(x,y,r,c):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>'
def text(s,x,y,w,h,c,font='bold'):
    f=F[font];gs=f.getGlyphSet();cmap=f.getBestCmap();p=SVGPathPen(gs);b=BoundsPen(gs);a=0
    for char in s:
        name=cmap[ord(char)];g=gs[name];tr=(1,0,0,1,a,0)
        g.draw(TransformPen(p,tr));g.draw(TransformPen(b,tr));a+=f['hmtx'][name][0]
    x0,y0,x1,y1=b.bounds;scale=min(w/(x1-x0),h/(y1-y0));tx=x+(w-(x1-x0)*scale)/2-x0*scale;ty=y+(h-(y1-y0)*scale)/2+y1*scale
    return f'<g aria-label="{html.escape(s,quote=True)}"><path d="{p.getCommands()}" fill="{c}" transform="translate({tx} {ty}) scale({scale} {-scale})"/></g>'
def save(name,art,back,transform=''):
    doc=f'<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000"><title>{name}</title><g transform="{transform}"><g id="borde-blanco">{path(back,"#FFFFFF","#FFFFFF",48)}</g><g id="arte">{art}</g></g></svg>'
    (ROOT/'svg'/f'{name}.svg').write_text(doc)
ink='#20202A';cream='#FFF5DE';lav='#B9A1F7';lime='#D9F56B';orange='#F26B38';purple='#44235E'
dogback='M 300 220 Q 315 140 440 145 Q 520 90 630 160 Q 730 155 760 250 Q 880 330 800 570 L 735 655 L 810 690 V 885 H 190 V 690 L 265 655 Q 140 485 210 330 Z'
fur='#F5EAD4';taupe='#B9A184';charcoal='#2D2925';rust='#B85C40'
dog=path('M 325 245 Q 225 230 215 390 Q 165 470 250 590 Q 320 570 355 450 Z',taupe,charcoal,12)
dog+=path('M 680 235 Q 790 245 795 370 Q 855 470 760 590 Q 690 565 650 445 Z',taupe,charcoal,12)
dog+=path('M 290 320 Q 280 230 365 205 L 345 180 L 420 190 L 435 150 L 490 175 L 540 135 L 565 175 Q 685 165 710 290 L 738 330 L 720 365 Q 750 495 675 555 L 680 595 L 625 580 Q 505 675 385 585 L 345 600 L 345 565 Q 255 510 278 390 L 255 365 Z',fur,charcoal,12)
dog+=path('M 320 345 Q 355 285 415 320 L 400 365 Z',taupe)+path('M 580 330 Q 640 285 685 350 L 600 370 Z',taupe)
dog+=circle(397,365,21,charcoal)+circle(610,370,21,charcoal)
dog+=path('M 355 480 Q 375 410 500 405 Q 625 410 655 480 Q 645 585 510 600 Q 365 580 355 480 Z',fur)
dog+=path('M 435 440 Q 500 405 565 440 Q 590 485 520 515 Q 495 525 475 510 Q 415 490 435 440 Z',charcoal)
dog+=path('M 505 510 V 540 Q 478 570 450 547 M 505 540 Q 530 565 555 545','none',charcoal,10)
dog+=path('M 375 600 Q 510 650 635 600 L 625 650 Q 500 700 385 650 Z',rust,charcoal,12)
dog+=rect(215,680,570,205,charcoal,40)+text('Perritos',250,699,500,72,fur)+text('Malvados',250,795,500,72,fur)
dog+=path('M 270 675 Q 265 625 310 625 Q 370 625 375 680 Q 365 725 325 708 Q 290 730 270 675 Z',fur,charcoal,10)
dog+=path('M 630 680 Q 625 630 675 625 Q 725 625 730 680 Q 710 725 680 708 Q 650 725 630 680 Z',fur,charcoal,10)
save('01-perritos-malvados',dog,dogback)
key='M 280 140 H 720 Q 785 140 785 205 V 670 H 820 Q 865 670 865 715 V 820 Q 865 865 820 865 H 180 Q 135 865 135 820 V 715 Q 135 670 180 670 H 215 V 205 Q 215 140 280 140 Z'
art=path(key,lav,ink,14)+rect(265,190,470,440,ink,40)+text('F',310,230,380,355,cream,'mono')+text('Maestro',200,705,600,115,ink)
save('02-f-maestro',art,key,'rotate(-4 500 500)')
bubble='M 190 250 H 810 Q 880 250 880 320 V 650 Q 880 720 810 720 H 405 L 290 810 V 720 H 190 Q 120 720 120 650 V 320 Q 120 250 190 250 Z'
art=path(bubble,'#F7D867',purple,14)+text('Maestro',175,390,490,190,purple)+text('?',675,350,155,270,purple)
save('03-maestro-pregunta',art,bubble)
burst='M 215 260 L 410 280 L 465 180 L 560 275 L 780 235 L 760 420 L 850 500 L 775 590 L 805 765 L 585 735 L 505 820 L 410 735 L 195 770 L 220 585 L 145 500 L 225 415 Z'
art=path(burst,orange,purple,14)+text('Qué',270,325,460,170,cream)+text('Waso',245,535,510,170,cream)
save('04-que-waso',art,burst,'rotate(-4 500 500)')
ticket='M 180 230 H 820 V 420 Q 745 420 745 500 Q 745 580 820 580 V 770 H 180 V 580 Q 255 580 255 500 Q 255 420 180 420 Z'
art=path(ticket,'#123D37',ink,14)+text('Que',300,290,400,145,lime)+text('Perdió',290,525,420,145,cream)
art+=path('M 350 475 H 650','none',lime,10)
save('05-que-perdio',art,ticket,'rotate(4 500 500)')
terminal='M 160 250 H 840 Q 885 250 885 295 V 750 Q 885 795 840 795 H 160 Q 115 795 115 750 V 295 Q 115 250 160 250 Z'
art=path(terminal,ink,ink,14)+circle(175,302,12,'#F17878')+circle(215,302,12,'#FFD36B')+circle(255,302,12,'#7ED8B4')
art+=text('team.',175,370,300,85,'#C5A9FA','mono')+text('getAnotherName',175,505,650,80,'#99E6CD','mono')+text('()',175,635,150,80,'#FFD36B','mono')
save('06-team-getanothername',art,terminal)
shirt='M 350 155 Q 500 225 650 155 L 775 215 L 885 410 L 750 485 L 705 410 V 855 H 295 V 410 L 250 485 L 115 410 L 225 215 Z'
def emblems(color,bg):
    result=''
    for x in [337,450,563]:result+=rect(x,415,100,100,color,15)
    # Interpretations of the three panels: thought, trophy, balloon.
    result+=path('M 355 480 Q 343 468 357 455 Q 354 438 370 442 Q 380 430 390 441 Q 405 433 410 448 Q 426 452 418 470 Q 425 485 408 489 H 365 L 352 500 Z','none',bg,5)
    result+=path('M 480 440 H 520 L 515 465 Q 500 486 485 465 Z',bg)+path('M 500 478 V 490 M 487 493 H 513 M 480 445 H 472 Q 469 461 486 463 M 520 445 H 528 Q 531 461 514 463','none',bg,5)
    result+=f'<ellipse cx="613" cy="446" rx="17" ry="22" fill="none" stroke="{bg}" stroke-width="5"/>'+path('M 612 470 Q 628 481 606 500','none',bg,5)
    return result
for name,cloth,printc,city,year in [
    ('07-polera-dhaka','#222222','#FAF6EB','DHAKA',''),
    ('08-polera-luxor','#242020','#F06B54','LUXOR','2023'),
    ('09-polera-baku','#F6E4C8','#7B263B','BAKU','2025')]:
    art=path(shirt,cloth,ink,12)
    art+=path('M 365 170 Q 500 252 635 170','none',printc,7)
    art+=text('UMSS',355,280,290,95,printc)+emblems(printc,cloth)
    art+=text('ICPC',355,550,290,95,printc)+text('World Finals',330,670,340,48,printc)
    art+=text((year+' / '+city) if year else city,330,750,340,52,printc)
    save(name,art,shirt)
print('9 vector designs written')
