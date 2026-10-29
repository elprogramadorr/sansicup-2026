// Non-destructive prepress: use approved artwork, isolate outer white diecut,
// remove disconnected alpha debris, and export exact-size PNG + vector contours.
const fs=require('fs'),path=require('path'),assert=require('assert');
const sharp=require('/Users/valdivia/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const potrace=require('potrace');
const root=path.resolve(__dirname,'../..'), out=path.join(root,'entrega-stickers');
for(const dir of ['maestros-png','png-300dpi','contornos-svg','svg-con-corte','revision'])fs.mkdirSync(path.join(out,dir),{recursive:true});
const config=JSON.parse(fs.readFileSync(path.join(root,'seleccion-galeria.json')));
const list=Object.keys(config.groups).flatMap(g=>config.entries.filter(e=>e.status==='selected'&&e.group===g));
function flood(mask,w,h,seeds){const seen=new Uint8Array(mask.length),q=new Int32Array(mask.length);let a=0,b=0;for(const s of seeds)if(!mask[s]&&!seen[s]){seen[s]=1;q[b++]=s;}while(a<b){let i=q[a++],x=i%w;for(const n of [x?i-1:-1,x<w-1?i+1:-1,i-w,i+w])if(n>=0&&n<mask.length&&!mask[n]&&!seen[n]){seen[n]=1;q[b++]=n;}}return seen;}
function solid(mask,w,h){const seen=new Uint8Array(mask.length),q=new Int32Array(mask.length);let best=[];for(let i=0;i<mask.length;i++)if(mask[i]&&!seen[i]){let a=0,b=1;q[0]=i;seen[i]=1;while(a<b){const j=q[a++],x=j%w;for(const n of [x?j-1:-1,x<w-1?j+1:-1,j-w,j+w])if(n>=0&&n<mask.length&&mask[n]&&!seen[n]){seen[n]=1;q[b++]=n;}}if(b>best.length)best=Array.from(q.subarray(0,b));}const kept=new Uint8Array(mask.length);for(const i of best)kept[i]=255;const seeds=[];for(let x=0;x<w;x++)seeds.push(x,(h-1)*w+x);for(let y=0;y<h;y++)seeds.push(y*w,y*w+w-1);const outside=flood(kept,w,h,seeds);return Buffer.from(outside.map(x=>x?0:255));}
function bbox(mask,w,h){let l=w,t=h,r=-1,b=-1;for(let i=0;i<mask.length;i++)if(mask[i]){const x=i%w,y=(i/w)|0;l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}assert(r>=l);return{left:l,top:t,width:r-l+1,height:b-t+1};}
function trace(buffer){return new Promise((res,rej)=>potrace.trace(buffer,{threshold:128,blackOnWhite:false,turdSize:40,optTolerance:1.2},(err,svg)=>err?rej(err):res(svg.match(/<path[^>]+d="([^"]+)"/)[1].split(/(?=M )/).sort((a,b)=>b.length-a.length)[0].trim()+' Z')));}
(async()=>{const report=[];for(let k=0;k<list.length;k++){
 const e=list[k],id=String(k+1).padStart(2,'0')+'-'+path.basename(e.file).replace(/\.png$/,'').replace(/^\d+-/,'').replace('-alpha-borrador','');
 const {data,info}=await sharp(path.join(root,e.file)).ensureAlpha().raw().toBuffer({resolveWithObject:true});const w=info.width,h=info.height;
 let mask=new Uint8Array(w*h),alpha=false;for(let i=3;i<data.length;i+=4)if(data[i]<128){alpha=true;break;}
 if(alpha){for(let i=0;i<mask.length;i++)mask[i]=data[i*4+3]>220?255:0;}
 else {const barriers=new Uint8Array(w*h);for(let i=0;i<mask.length;i++){const v=[data[i*4],data[i*4+1],data[i*4+2]],lo=Math.min(...v),hi=Math.max(...v);barriers[i]=(lo>=247||hi-lo>25||hi<90)?255:0;}const seeds=[];for(let x=0;x<w;x++)seeds.push(x,(h-1)*w+x);for(let y=0;y<h;y++)seeds.push(y*w,y*w+w-1);const outside=flood(barriers,w,h,seeds);mask=Buffer.from(outside.map(x=>x?0:255));}
 mask=solid(mask,w,h);
 // Opening removes narrow bridges to stray specks; filled silhouette has no internal holes.
 mask=await sharp(mask,{raw:{width:w,height:h,channels:1}}).erode(3).dilate(3).blur(1.4).threshold(128).greyscale().raw().toBuffer();
 mask=solid(mask,w,h);const b=bbox(mask,w,h);
 assert(alpha||(b.left>0&&b.top>0&&b.left+b.width<w&&b.top+b.height<h),`Source touches edge: ${id}`);
 assert(b.width*b.height>w*h*.1,`Failed mask: ${id}`);
 const croppedMask=await sharp(mask,{raw:{width:w,height:h,channels:1}}).extract(b).png().toBuffer();const d=await trace(croppedMask);
 const W=b.width,H=b.height, shape=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><path d="${d}" fill="white"/></svg>`;
 const smoothAlpha=await sharp(Buffer.from(shape)).ensureAlpha().extractChannel(3).raw().toBuffer();
 // Composite original against white within its silhouette. No regenerating letters or faces.
 const cropped=await sharp(data,{raw:{width:w,height:h,channels:4}}).extract(b).flatten({background:'#ffffff'}).raw().toBuffer();
 const inner=await sharp(smoothAlpha,{raw:{width:W,height:H,channels:1}}).erode(4).greyscale().raw().toBuffer();
 const rgba=Buffer.alloc(W*H*4);for(let i=0;i<W*H;i++){rgba[i*4]=cropped[i*3];rgba[i*4+1]=cropped[i*3+1];rgba[i*4+2]=cropped[i*3+2];rgba[i*4+3]=smoothAlpha[i]; if(inner[i]<128){rgba[i*4]=rgba[i*4+1]=rgba[i*4+2]=255;}}
 const master=path.join(out,'maestros-png',id+'.png');await sharp(rgba,{raw:{width:W,height:H,channels:4}}).withMetadata({density:300}).png().toFile(master);
 const rec=e.group==='poleras-realistas'||e.file.includes('polera-')?8:e.file.includes('lettering')?4:6;
 const cmVariants=[4,6,8];for(const cm of cmVariants){const px=Math.round(cm/2.54*300);await sharp(master).resize(W>=H?{width:px}:{height:px}).withMetadata({density:300}).png().toFile(path.join(out,'png-300dpi',`${id}-${cm}cm.png`));}
 const mm=rec*10, mw=mm*W/Math.max(W,H),mh=mm*H/Math.max(W,H);
 const cut=`<svg xmlns="http://www.w3.org/2000/svg" width="${mw}mm" height="${mh}mm" viewBox="0 0 ${W} ${H}"><title>${e.title}</title><path id="CutContour" d="${d}" fill="none" stroke="#ff00ff" stroke-width="${.1*Math.max(W,H)/mm}"/></svg>`;
 fs.writeFileSync(path.join(out,'contornos-svg',id+'.svg'),cut);
 const img64=fs.readFileSync(master).toString('base64');
 fs.writeFileSync(path.join(out,'svg-con-corte',id+'.svg'),cut.replace('<path id="CutContour"',`<image width="${W}" height="${H}" href="data:image/png;base64,${img64}"/><path id="CutContour"`));
 report.push({id,title:e.title,source:e.file,group:e.group,master:`maestros-png/${id}.png`,width:W,height:H,recommended_cm:rec,native_ppi_8cm:Math.round(Math.max(W,H)/8*2.54),bounds:b,path:d});console.log(id,W,H);
 }fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(report,null,2));})();
