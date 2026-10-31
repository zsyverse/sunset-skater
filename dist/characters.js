import {POSES,poseFor} from './character-poses.js?v=9';
export {POSES,poseFor};
export const CHARACTERS=[
 {id:'nailong',name:'奶龙',tag:'圆肚皮 · 快乐出发',src:'assets/characters/nailong.png',sheet:'assets/characters/nailong-expressions.png',board:'#ea7942'},
 {id:'naiwa',name:'奶蛙',tag:'绿眼圈 · 魔性大笑',sheet:'assets/characters/naiwa-expressions-v2.png',board:'#81b778',grid:{width:1278,height:1230,x:[0,426,852,1278],y:[0,410,810,1230]}}
];
export function characterFor(id){return CHARACTERS.find(c=>c.id===id)||CHARACTERS[0];}
const pictures=new Map();
// Locate each sprite in its atlas cell. Only the large connected silhouette defines
// its bounds, so transparent padding or isolated antialias specks cannot shift its feet.
function frameBounds(img,grid={width:1254,height:1254,x:[0,430,840,1254],y:[0,425,820,1254]}){
 const canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0);const {data}=ctx.getImageData(0,0,img.width,img.height);
 const xs=grid.x.map(x=>Math.round(x*img.width/grid.width)),ys=grid.y.map(y=>Math.round(y*img.height/grid.height));
 return POSES.map((pose,index)=>{const col=index%3,row=Math.floor(index/3),x0=xs[col],y0=ys[row],w=xs[col+1]-x0,h=ys[row+1]-y0,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let best=null;
  for(let py=0;py<h;py++)for(let px=0;px<w;px++){const start=py*w+px;if(seen[start]||data[((py+y0)*img.width+px+x0)*4+3]<96)continue;let head=0,tail=1,minX=px,maxX=px,minY=py,maxY=py;queue[0]=start;seen[start]=1;
   while(head<tail){const at=queue[head++],x=at%w,y=Math.floor(at/w);minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);for(const [nx,ny]of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]){if(nx<0||nx>=w||ny<0||ny>=h)continue;const next=ny*w+nx;if(!seen[next]&&data[((ny+y0)*img.width+nx+x0)*4+3]>=96){seen[next]=1;queue[tail++]=next;}}}
   if(!best||tail>best.count)best={count:tail,minX,maxX,minY,maxY};
  }
  if(!best||best.count<300)throw new Error(`Missing expression: ${pose.id}`);const sx=Math.max(0,best.minX-2),sy=Math.max(0,best.minY-2),right=Math.min(w,best.maxX+3),bottom=Math.min(h,best.maxY+3);return [x0+sx,y0+sy,right-sx,bottom-sy];
 });
}
export async function loadCharacters(){await Promise.all(CHARACTERS.map(character=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{try{pictures.set(character.id,{img,frames:frameBounds(img,character.grid)});resolve();}catch(error){reject(error);}};img.onerror=()=>reject(new Error(`${character.name}表情加载失败`));img.src=character.sheet;})));}
export function drawCharacter(c,x,y,options={}){
 const {character='nailong',charge=0,air=false,time=0,scale=1,crashed=false,land=0,sliding=false,grinding=false,board=true}=options;
 const config=characterFor(character),picture=pictures.get(config.id);if(!picture)return;
 const pose=poseFor(options),[sx,sy,sw,sh]=picture.frames[POSES.indexOf(pose)];
 c.save();c.translate(x,y-7);c.scale(scale,scale);
 if(air&&!crashed)c.rotate(-.05+Math.sin(time*4)*.04);else if(grinding&&!crashed)c.rotate(.015*Math.sin(time*14));
 if(board){c.strokeStyle='#294b42';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(-35,-6);c.quadraticCurveTo(-28,1,0,0);c.quadraticCurveTo(28,1,35,-6);c.stroke();c.strokeStyle=config.board;c.lineWidth=3;c.stroke();
  for(const wx of [-22,22]){c.fillStyle='#fff0ce';c.beginPath();c.arc(wx,7,6,0,Math.PI*2);c.fill();c.strokeStyle='#375348';c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(wx,7);c.lineTo(wx+Math.cos(time*18)*4,7+Math.sin(time*18)*4);c.stroke();}}
 const bob=air||crashed?0:Math.sin(time*7)*.7,h=pose.height,w=h*sw/sh;
 c.translate(sliding?5:0,-5+bob);c.drawImage(picture.img,sx,sy,sw,sh,-w/2,-h,w,h);c.restore();
}
export function paintPortrait(canvas,character,poseId){const ctx=canvas.getContext('2d'),pose=POSES.find(p=>p.id===poseId)||POSES[0];canvas.width=220;canvas.height=190;ctx.clearRect(0,0,220,190);const flags={ride:{},charge:{holding:true},jump:{air:true},slide:{sliding:true},grind:{grinding:true},brake:{braking:true},land:{land:1},crash:{crashed:true},win:{won:true}};drawCharacter(ctx,110,174,{character,...flags[pose.id],scale:pose.id==='slide'?2.4:1.35,board:false});}
