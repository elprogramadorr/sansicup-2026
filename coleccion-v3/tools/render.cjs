const fs=require('fs');
const path=require('path');
const sharp=require('/Users/valdivia/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const list=fs.readdirSync(path.join(root,'svg')).filter(f=>f.endsWith('.svg')&&!f.includes('editable'));
 const report=[];
 for(const f of list){
   const source=fs.readFileSync(path.join(root,'svg',f));
   const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
   let minX=info.width,minY=info.height,maxX=-1,maxY=-1;
   for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>0){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
   if(minX<=0||minY<=0||maxX>=999||maxY>=999)throw Error(f+' clipped');
   const w=maxX-minX+1,h=maxY-minY+1;
   const view=`viewBox="${minX} ${minY} ${w} ${h}"`;
   let clean=source.toString().replace('viewBox="0 0 1000 1000"',view).replace('width="1000" height="1000"',`width="${w}" height="${h}"`);
   fs.writeFileSync(path.join(root,'svg',f),clean);
   const ef=path.join(root,'svg',f.replace('.svg','-texto-editable.svg'));
   fs.writeFileSync(ef,fs.readFileSync(ef,'utf8').replace('viewBox="0 0 1000 1000"',view).replace('width="1000" height="1000"',`width="${w}" height="${h}"`));
   // Render the vector source separately at each requested physical resolution.
   for(const cm of [4,6,8]){
      const px=Math.round(cm/2.54*300);
      const dimensions=w>=h?{width:px}:{height:px};
      await sharp(Buffer.from(clean),{density:300}).resize(dimensions).withMetadata({density:300}).png().toFile(path.join(root,'png',f.replace('.svg',`-${cm}cm.png`)));
   }
   await sharp(Buffer.from(clean),{density:192}).resize({width:1200,height:1200,fit:'inside'}).png().toFile(path.join(root,'originales',f.replace('.svg','.png')));
   report.push({file:f,bounds:[minX,minY,w,h],largestCM:8});
 }
 fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({masters:report.length,png:report.length*3,clipping:'none'}));
})().catch(e=>{console.error(e);process.exit(1)});
