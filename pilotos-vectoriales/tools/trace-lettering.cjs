const fs=require('fs'),path=require('path');
const sharp=require('/Users/valdivia/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const potrace=require('../../tools/prepress/node_modules/potrace');
const root=path.resolve(__dirname,'..');
const trace=(buf)=>new Promise((ok,no)=>potrace.trace(buf,{threshold:128,blackOnWhite:false,turdSize:18,alphaMax:1,optTolerance:.65},(err,s)=>err?no(err):ok(s.match(/<path[^>]+d="([^"]+)"/)[1])));
(async()=>{
 const {data,info}=await sharp(path.resolve(root,'../coleccion-sansicup-v7/stickers/01-sansicup-lettering.png')).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const groups=[];const settings=[['amarillo','#FFC72C',(r,g,b)=>r>180&&g>100&&b<130],['azul','#14286E',(r,g,b)=>b>r*1.4&&b>g*1.15&&g<145],['rojo','#D7192D',(r,g,b)=>r>100&&r>g*1.7&&r>b*1.5]];
 for(const[id,color,test]of settings){let mask=Buffer.alloc(info.width*info.height);for(let i=0;i<mask.length;i++)mask[i]=test(...data.subarray(i*3,i*3+3))?255:0;let png=await sharp(mask,{raw:{width:info.width,height:info.height,channels:1}}).median(3).png().toBuffer();let d=await trace(png);groups.push(`<g inkscape:groupmode="layer" inkscape:label="Lettering · ${id}" id="lettering-${id}"><path fill-rule="evenodd" fill="${color}" d="${d}"/></g>`);}
 const doc=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="1400" height="800" viewBox="0 0 1427 1102"><title>SanSi Cup · trazado del lettering aprobado</title>${groups.join('\n')}</svg>`;
 fs.writeFileSync(path.join(root,'trabajo/lettering-trazado-inicial.svg'),doc.replace('http://www.inkscape.org/namespaces/inkscape','http://www.inkscape.org/namespaces/inkscape'));
 fs.writeFileSync(path.join(root,'tools/lettering-paths.json'),JSON.stringify({width:info.width,height:info.height,groups},null,2));
 await sharp(Buffer.from(doc)).png().toFile(path.join(root,'revision/lettering-trazado-inicial.png'));
})();
