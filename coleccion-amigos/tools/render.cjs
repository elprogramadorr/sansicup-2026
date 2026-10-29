const fs=require('fs'),path=require('path');
const sharp=require('/Users/valdivia/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const report=[];
 for(const f of fs.readdirSync(path.join(root,'svg')).filter(x=>x.endsWith('.svg'))){
  let svg=fs.readFileSync(path.join(root,'svg',f),'utf8');
  const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let x0=1000,y0=1000,x1=0,y1=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
  if(x0<=0||y0<=0||x1>=999||y1>=999)throw Error('Clipping: '+f);
  const w=x1-x0+1,h=y1-y0+1;
  svg=svg.replace('width="1000" height="1000"',`width="${w}" height="${h}"`).replace('viewBox="0 0 1000 1000"',`viewBox="${x0} ${y0} ${w} ${h}"`);
  fs.writeFileSync(path.join(root,'svg',f),svg);
  for(const cm of [4,6,8]){
   const px=Math.round(cm/2.54*300);
   await sharp(Buffer.from(svg),{density:300}).resize(w>=h?{width:px}:{height:px}).withMetadata({density:300}).png().toFile(path.join(root,'png',f.replace('.svg',`-${cm}cm.png`)));
  }
  await sharp(Buffer.from(svg),{density:192}).resize({width:1200,height:1200,fit:'inside'}).png().toFile(path.join(root,'stickers',f.replace('.svg','.png')));
  report.push({file:f,bounds:[x0,y0,w,h]});
 }
 fs.writeFileSync(path.join(root,'verificacion.json'),JSON.stringify(report,null,2));
 console.log(report.length+' SVG + '+report.length*3+' PNG at 300 DPI');
})().catch(e=>{console.error(e);process.exit(1)});
