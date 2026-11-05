import {drawCharacter} from './characters.js?v=14';
import {WORLDS,drawScenery,roadTexture} from './scenery.js?v=14';
import {movingPose} from './movers.js?v=14';
const TAU=Math.PI*2;
function poly(c,points,fill){c.fillStyle=fill;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function line(c,points,color,width=2){c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();}
function circle(c,x,y,r,fill){c.fillStyle=fill;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();}
function round(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();}
function text(c,str,x,y,size,color,weight='500'){c.font=`${weight} ${size}px "Avenir Next","PingFang SC",sans-serif`;c.fillStyle=color;c.fillText(str,x,y);}
function star(c,x,y,r,color,angle=0){const a=[];for(let i=0;i<10;i++){const rad=i%2?r*.43:r;const t=angle+i*Math.PI/5-Math.PI/2;a.push([x+Math.cos(t)*rad,y+Math.sin(t)*rad]);}poly(c,a,color);}
function palm(c,x,y,s,color,lean=1){c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=color;c.lineWidth=11;c.lineCap='round';c.beginPath();c.moveTo(0,0);c.quadraticCurveTo(15*lean,-75,3*lean,-149);c.stroke();for(let i=0;i<7;i++){let ang=-Math.PI+(i/6)*Math.PI;const ex=Math.cos(ang)*75,ey=-147+Math.sin(ang)*48+23;c.beginPath();c.moveTo(3*lean,-149);c.quadraticCurveTo(ex*.55,-200,ex,ey);c.quadraticCurveTo(ex*.55,-169,3*lean,-149);c.fillStyle=color;c.fill();}c.restore();}
function hill(c,width,camera,factor,y,color,seed){let points=[[-20,650]];for(let x=-20;x<width+40;x+=18){const wx=x+camera*factor;points.push([x,y+Math.sin(wx*.003+seed)*38+Math.sin(wx*.007+seed)*17]);}points.push([width+40,650]);poly(c,points,color);}
function building(c,x,y,w,h,color){round(c,x,y-h,w,h,2,color);c.fillStyle='#f2d49d88';for(let a=10;a<w-5;a+=19)for(let b=15;b<h-15;b+=24)c.fillRect(x+a,y-h+b,7,11);c.fillStyle='#57665966';c.fillRect(x-4,y-h-5,w+8,5);}
function obstacle(c,o,level,camera){const x=o.x-camera,y=470;if(o.type==='wall'){round(c,x,y-o.h,o.w,o.h,4,'#8a6a5c');for(let r=0;r*24<o.h;r++)for(let k=0;k<3;k++)round(c,x+3+((r%2)*11)+k*22,y-o.h+3+r*24,19,20,2,r%2?'#a47d69':'#b98b72');round(c,x-14,y-o.h-36,o.w+28,26,5,'#2d5749');text(c,'⤒ 高墙',x+o.w/2-22,y-o.h-18,12,'#ffe8bf','700');return;}if(o.type==='crate'){round(c,x,y-o.h,o.w,o.h,3,'#bc8050');c.strokeStyle='#f0bb78';c.lineWidth=3;c.strokeRect(x+4,y-o.h+4,o.w-8,o.h-8);line(c,[[x+5,y-5],[x+o.w-5,y-o.h+5]],'#f0bb78',3);line(c,[[x+5,y-o.h+5],[x+o.w-5,y-5]],'#f0bb78',3);}else if(o.type==='barrel'){round(c,x,y-o.h,o.w,o.h,10,'#dc8a4e');for(const yy of [y-o.h+10,y-12]){line(c,[[x+2,yy],[x+o.w-2,yy]],'#f0c384',5);}line(c,[[x+o.w/2,y-o.h+5],[x+o.w/2,y-5]],'#b46f3e',2);}else{round(c,x-5,y-6,o.w+10,7,3,'#465a43');poly(c,[[x+o.w*.38,y-o.h],[x+o.w*.62,y-o.h],[x+o.w,y-6],[x,y-6]],'#e77945');poly(c,[[x+o.w*.24,y-o.h*.65],[x+o.w*.76,y-o.h*.65],[x+o.w*.87,y-o.h*.39],[x+o.w*.13,y-o.h*.39]],'#fff0cb');}}
function gate(c,g,cam){const x=g.x-cam,w=g.w;line(c,[[x-5,470],[x-5,g.top-10],[x+w+5,g.top-10],[x+w+5,470]],'#4c6e5a88',6);
 if(g.type==='branch'){round(c,x,g.top,w,g.bottom-g.top,12,'#4d7660');for(let i=0;i<5;i++){circle(c,x+18+i*(w-36)/4,g.top+20,24,'#567f64');circle(c,x+18+i*(w-36)/4,g.bottom-16,18,'#4d7660');}line(c,[[x+5,g.bottom-22],[x+w-6,g.bottom-22]],'#6c664a',8);}
 else{round(c,x,g.top,w,g.bottom-g.top,5,'#d9ae67');c.save();c.beginPath();c.rect(x,g.bottom-21,w,21);c.clip();for(let i=-1;i<w/26+1;i++)poly(c,[[x+i*26,g.bottom],[x+i*26+16,g.bottom],[x+i*26+34,g.bottom-21],[x+i*26+18,g.bottom-21]],'#425c4a');c.restore();line(c,[[x+12,g.top+15],[x+w-12,g.top+15]],'#f2d69b',2);}
 round(c,x+w/2-46,g.bottom-79,92,37,6,'#f9ebbf');text(c,'↓ 低头滑行',x+w/2-37,g.bottom-55,13,'#375e4b','700');line(c,[[x+10,463],[x+w-10,463]],'#7ae4c5',3);}
function railArt(c,r,cam){const x=r.x-cam;for(let j=0;j<=r.w;j+=105){line(c,[[x+j,r.y+4],[x+j,468]],'#547268',5);line(c,[[x+j-13,468],[x+j+13,468]],'#3e5c4d',4);}line(c,[[x-12,r.y+12],[x,r.y],[x+r.w,r.y],[x+r.w+12,r.y+12]],'#f7edc5',9);line(c,[[x,r.y-1],[x+r.w,r.y-1]],'#69cbb4',4);round(c,x+14,r.y+22,92,23,4,'#2b5b4b');text(c,'↗ 跳上来滑杆',x+23,r.y+38,11,'#d9f2ca','700');if(r.transfer){line(c,[[x+r.w-95,r.y-1],[x+r.w,r.y-1]],'#ff996a',6);round(c,x+r.w-111,r.y-45,118,25,5,'#ed794b');text(c,'↑ 杆尾再次起跳',x+r.w-102,r.y-27,12,'#fff3d3','700');}}
function movingArt(c,m,time,cam){const p=movingPose(m,time),x=p.x-cam;
 if(m.type==='shutter'){
  const color=p.open?(p.remaining<.7?'#e8ae4c':'#73d2a4'):'#e56d54';
  line(c,[[x-9,470],[x-9,212],[x+p.w+9,212],[x+p.w+9,470]],'#486767',8);
  round(c,x,220,p.w,p.h,3,'#647f80');for(let y=232;y<p.bottom-8;y+=18)line(c,[[x+4,y],[x+p.w-4,y]],'#b9cbb788',2);
  round(c,x-2,p.bottom-9,p.w+4,10,2,color);round(c,x-44,163,160,36,7,'#294c45');circle(c,x-26,181,6,color);
  const label=p.open?(p.remaining<.7?'即将关闭':'绿灯 · 松开刹车'):'红灯 · 刹车等待';text(c,label,x-12,186,12,'#f7e8c5','700');
  line(c,[[x-125,482],[x-50,482]],'#edc784',4);text(c,'← A 刹车',x-126,505,12,'#f2dbad');return;
 }
 if(m.type==='tire'){c.save();c.translate(x,p.y);c.rotate(p.rotation);circle(c,0,0,p.r,'#294849');circle(c,0,0,16,'#b5b89c');circle(c,0,0,7,'#3e6360');for(let i=0;i<8;i++){const a=i*Math.PI/4;line(c,[[Math.cos(a)*20,Math.sin(a)*20],[Math.cos(a+.15)*25,Math.sin(a+.15)*25]],'#67867a',3);}c.restore();line(c,[[m.x-95-cam,479],[m.x+95-cam,479]],'#efc67577',2);text(c,'↔ 滚动轮胎',m.x-cam-44,399,12,'#2d5649','700');return;}
 line(c,[[p.pivotX-cam,190],[x,p.y]],'#efdfb9',5);circle(c,p.pivotX-cam,190,8,'#496a5e');circle(c,x,p.y,p.r,'#d99560');circle(c,x,p.y,p.r-6,'#f4c88a');line(c,[[x-9,p.y-9],[x+9,p.y+9]],'#936342',3);line(c,[[x+9,p.y-9],[x-9,p.y+9]],'#936342',3);round(c,m.x-cam-57,143,114,27,5,'#2d5749');text(c,'↓ 低头躲摆锤',m.x-cam-46,162,12,'#f5e6bc','700');
}
function gadgets(c,l,run,cam,w,t){
 for(const u of l.updrafts||[]){const x0=Math.max(u.x-cam,-20),x1=Math.min(u.x+u.w-cam,w+20);if(x1<x0)continue;const g=c.createLinearGradient(0,150,0,650);g.addColorStop(0,'#bdf4ff00');g.addColorStop(1,'#bdf4ff38');c.fillStyle=g;c.fillRect(x0,150,x1-x0,500);for(let x=Math.floor((x0+cam)/38)*38;x<x1+cam;x+=38)for(let k=0;k<2;k++){const off=((t*150+x*7.3+k*250)%480),wob=Math.sin(t*3+x)*5;c.globalAlpha=Math.min(1,off/80)*.7;circle(c,x-cam+wob,640-off,2.5,'#e9fbff');}c.globalAlpha=1;if(u.x-cam>-150&&u.x-cam<w){round(c,u.x-cam+20,170,124,26,6,'#2d5a66dd');text(c,'≋ 上升气流 · 按住',u.x-cam+30,188,12,'#e9fbff','700');}}
 for(const b of l.blocks||[]){const x=b.x-cam;if(x<-200||x>w+200)continue;const top=Math.max(b.top,120),bot=Math.min(b.bottom,650);round(c,x,top,b.w,bot-top,22,'#5d5f7add');for(let i=0;i<4;i++){circle(c,x+18+i*(b.w-36)/3,b.type==='cloud-high'?bot-6:top+6,24,'#6e7091');}const bolt=b.type==='cloud-high'?bot-30:top+40;line(c,[[x+b.w/2-8,bolt-14],[x+b.w/2+6,bolt],[x+b.w/2-4,bolt+4],[x+b.w/2+8,bolt+20]],'#ffe27a',3);}
 for(const sp of l.springs||[]){const x=sp.x-cam;if(x<-100||x>w+100)continue;const near=Math.abs(run.x-(sp.x+sp.w/2))<50&&!run.grounded&&run.vy<0,lift=near?16:0;round(c,x-4,462,sp.w+8,9,3,'#3e5b52');for(let k=0;k<4;k++)line(c,[[x+8,460-k*5-lift*k/4],[x+sp.w-8,457-k*5-lift*k/4]],'#c9d2c4',3);round(c,x,438-lift,sp.w,9,4,'#ff8f5a');text(c,'⤒',x+sp.w/2-7,430-lift,16,'#ff8f5a','800');}
 for(const pad of l.boosts||[]){const x=pad.x-cam;if(x<-200||x>w+100)continue;round(c,x,464,pad.w,9,4,'#ffd36e55');for(let k=0;k*28<pad.w-10;k++){const glow=(Math.sin(t*10-k)+1)/2;poly(c,[[x+8+k*28,464],[x+20+k*28,468.5],[x+8+k*28,473],[x+14+k*28,468.5]],glow>.5?'#ffe27a':'#ffb25c');}text(c,'» 加速',x+pad.w/2-20,500,11,'#ffe8b0','700');}
 for(const r of l.rings||[]){const x=r.x-cam;if(x<-80||x>w+80)continue;const used=run.usedRings?.has(r.id);c.save();c.globalAlpha=used?.25:1;c.strokeStyle=used?'#d9e7e0':'#ffe27a';c.lineWidth=6;c.beginPath();c.ellipse(x,r.y,22,36,0,0,TAU);c.stroke();c.strokeStyle='#fff8d8';c.lineWidth=2;c.beginPath();c.ellipse(x,r.y,15,28,0,0,TAU);c.stroke();if(!used){c.globalAlpha=.35+Math.sin(t*6+r.id)*.15;circle(c,x,r.y,42,'#ffe27a33');}c.restore();}
 for(const it of l.items||[]){if(run.taken?.has(it.id))continue;const x=it.x-cam;if(x<-60||x>w+60)continue;const y=it.y+Math.sin(t*3+it.id)*5;circle(c,x,y,21,it.type==='shield'?'#7bd2f0':'#ff8f7a');circle(c,x,y,16,'#fff8e8');if(it.type==='shield'){poly(c,[[x,y-10],[x+9,y-6],[x+7,y+5],[x,y+11],[x-7,y+5],[x-9,y-6]],'#3d9fc5');}else{c.strokeStyle='#e0574a';c.lineWidth=5;c.beginPath();c.arc(x,y-1,8,Math.PI,0,true);c.stroke();round(c,x-12,y-3,6,6,1,'#cfd6d9');round(c,x+6,y-3,6,6,1,'#cfd6d9');}}
}
export class Art {
 constructor(character='nailong'){this.character=character;this.particles=[];this.t=0;this.camera=0;this.flash=0;this.shake=0;this.popups=[];}
 popup(x,y,str,color='#fff3c4',size=22){this.popups.push({x,y,str,color,size,life:1});}
 burst(x,y,color,n=10){for(let i=0;i<n;i++)this.particles.push({x,y,vx:(Math.random()-.5)*150,vy:-Math.random()*160-25,life:.7,max:.7,color,r:Math.random()*3+2});}
 draw(c,width,height,run,dt,idle=false){this.t+=dt;const l=run.level,w=650*width/height;c.setTransform(width/w,0,0,height/650,0,0);c.clearRect(0,0,w,650);if(this.shake>0){c.translate((Math.random()-.5)*this.shake*16,(Math.random()-.5)*this.shake*10);this.shake=Math.max(0,this.shake-dt*2.8);}const desired=idle?700:Math.max(0,run.x-w*.23);this.camera=idle?700:this.camera+(desired-this.camera)*Math.min(1,dt*9);if(!idle&&Math.abs(desired-this.camera)>w)this.camera=desired;const cam=this.camera,t=this.t;
 drawScenery(c,w,l,cam,t);const world=WORLDS[l.index];
 // Road is split at gaps. Sample its curved ramps for a continuous ride.
 const spans=[];let start=cam-40;for(const g of l.gaps){if(g.x+g.w<cam-40||g.x>cam+w+40)continue;if(g.x>start)spans.push([start,g.x]);start=g.x+g.w;}spans.push([start,cam+w+40]);
 const groundAt=x=>{let y=470;for(const r of l.ramps)if(x>=r.x&&x<=r.x+r.w)y-=Math.sin((x-r.x)/r.w*Math.PI)*r.h;return y;};
 for(const [a,b]of spans){if(a>=b)continue;const pts=[[a-cam,650],[a-cam,groundAt(a)]];for(let x=a+8;x<b;x+=8)pts.push([x-cam,groundAt(x)]);pts.push([b-cam,groundAt(b)],[b-cam,650]);poly(c,pts,world.ground);const edge=pts.slice(1,-1);line(c,edge,world.edge,9);line(c,edge,world.ground+'55',2);c.save();c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();c.strokeStyle='#fff3be0e';c.lineWidth=1;for(let y=490;y<650;y+=24){c.beginPath();c.moveTo(a-cam,y);c.lineTo(b-cam,y);c.stroke();}for(let x=Math.floor(a/90)*90;x<b;x+=90){c.fillStyle='#d5cda333';c.fillRect(x-cam,514,32,3);}roadTexture(c,a,b,cam,l);c.restore();}
 // Gaps read as real drops: darken toward the bottom and shade both cliff walls.
 for(const g of l.gaps){const x=g.x-cam;if(x+g.w<-20||x>w+20)continue;const pit=c.createLinearGradient(0,474,0,650);pit.addColorStop(0,'#0e332c10');pit.addColorStop(.4,'#0e332c66');pit.addColorStop(1,'#0e332cdd');c.fillStyle=pit;c.fillRect(x,474,g.w,176);c.fillStyle='#0e332c38';c.fillRect(x,474,12,176);c.fillRect(x+g.w-12,474,12,176);}
 if(!idle){
 if(l.hard){for(const section of l.sections){const sx=section.x-cam;if(sx>-180&&sx<w+100){const names={slalom:'连跳区',twins:'双重断崖',bridge:'断桥 · 必须滑杆',transfer:'空中换杆',duckjump:'低头 → 起跳',traffic:'动态机关 · 看准时机',spring:'弹簧板 · 高墙',boost:'加速带 · 长断崖',rings:'空中跳环 · 碰环再跳',glide:'上升气流 · 按住上升'};round(c,sx,541,145,27,4,'#f3dbb41f');text(c,names[section.kind],sx+12,560,12,'#f3dfbb','700');}}}
 // Gap warning stripes and road signs.
 for(const g of l.gaps){const x=g.x-cam;if(x<-250||x>w+250)continue;for(let j=0;j<3;j++){line(c,[[x-65+j*15,486],[x-73+j*15,494]],'#e9bc72',4);}line(c,[[x-125,467],[x-125,408]],'#4b6751',4);round(c,x-145,390,40,31,4,'#f3cf7c');text(c,'↗',x-138,413,26,'#3c5942','700');}
 for(const cp of l.checkpoints){const x=cp-cam;if(x<-100||x>w+100)continue;line(c,[[x,470],[x,363]],'#f4e4bb',4);poly(c,[[x+2,365],[x+55,374],[x+2,398]],run.checkpoint.x>=cp?'#f5d071':'#e97b50');text(c,'✓',x+10,386,18,'#fff3d2');round(c,x-38,488,77,20,4,'#f4e6bf1c');text(c,'CHECKPOINT',x-30,502,8,'#f4e6bf');}
 const finish=l.length-cam;if(finish<w+150){for(const x of [finish,finish+110])line(c,[[x,470],[x,290]],'#f5e8be',7);for(let x=0;x<8;x++)for(let y=0;y<3;y++){c.fillStyle=(x+y)%2?'#355448':'#f4e5b5';c.fillRect(finish+x*14,292+y*14,14,14);}text(c,'FINISH',finish+23,357,19,'#fff0c2','800');}
 for(const g of l.gates)if(g.x>cam-250&&g.x<cam+w+100)gate(c,g,cam);
 for(const r of l.rails)if(r.x+r.w>cam-100&&r.x<cam+w+100)railArt(c,r,cam);
 for(const o of l.obstacles)if(o.x>cam-80&&o.x<cam+w+80)obstacle(c,o,l,cam);
 for(const mover of l.movers||[])if(mover.x>cam-250&&mover.x<cam+w+250)movingArt(c,mover,idle?t:run.elapsed,cam);
 gadgets(c,l,run,cam,w,t);
 for(const s of l.stars){if(run.collected.has(s.id)||s.x<cam-80||s.x>cam+w+80)continue;const y=s.y+Math.sin(t*3+s.id)*4;circle(c,s.x-cam,y,17,'#ffdb7933');star(c,s.x-cam,y,11,'#fff0ae',Math.sin(t+s.id)*.08);circle(c,s.x-cam-2,y-3,2,'#fff7d5');}
 }
 const px=idle?w*.65:run.x-cam,py=idle?440:run.y;const air=!run.grounded&&!run.grinding&&!idle;const shadowY=groundAt(idle?cam+px:run.x);if(!l.gaps.some(g=>run.x>=g.x&&run.x<g.x+g.w)||idle){c.save();c.globalAlpha=Math.max(.05,.18-Math.max(0,shadowY-py)*.0006);c.fillStyle='#0e332c';c.beginPath();c.ellipse(px,shadowY+6,idle?49:32,5,0,0,TAU);c.fill();c.restore();}
 if(idle){const rockX=px-95;poly(c,[[rockX,470],[rockX+20,435],[rockX+150,435],[rockX+181,470]],'#637957');line(c,[[rockX+22,435],[rockX+151,435]],'#f5d391',5);}
 if(!idle&&run.boost>0&&run.grounded){for(let i=0;i<5;i++)line(c,[[px-60-i*18,py-20-i*17],[px-30-i*18,py-20-i*17]],'#ffe27a99',3);}
 if(!idle&&run.invuln>0&&Math.floor(t*20)%2===0)c.globalAlpha=.45;
 drawCharacter(c,px,py,{character:this.character,holding:run.holding&&!idle,won:run.state==='won',braking:run.brakeHeld&&run.grounded&&!idle,charge:run.charge,air,time:idle?t:run.x/l.speed,scale:idle?1.45:1,crashed:run.state==='crashed',land:run.landPulse,sliding:run.sliding&&!idle,grinding:run.grinding&&!idle});
 c.globalAlpha=1;
 if(!idle&&run.shield){c.save();c.globalAlpha=.55+Math.sin(t*5)*.1;c.strokeStyle='#8fe0ff';c.lineWidth=3;c.beginPath();c.ellipse(px,py-58,52,72,0,0,TAU);c.stroke();c.globalAlpha=.12;circle(c,px,py-58,60,'#8fe0ff');c.restore();}
 if(!idle&&run.magnet>0){c.save();c.globalAlpha=.18+Math.sin(t*8)*.06;c.strokeStyle='#ff8f7a';c.lineWidth=2;c.setLineDash([6,8]);c.beginPath();c.arc(px,py-42,170,0,TAU);c.stroke();c.restore();round(c,px-34,py-178,68,20,5,'#ff8f7add');text(c,`磁铁 ${Math.ceil(run.magnet)}s`,px-26,py-164,11,'#fff','700');}
 if(!idle&&run.gliding){for(let i=0;i<3;i++)line(c,[[px-40+i*30,py+20+((t*200+i*40)%50)],[px-36+i*30,py+5+((t*200+i*40)%50)]],'#e9fbffaa',2);}
 if(!idle&&run.grinding&&run.state==='playing'){for(let i=0;i<2;i++)this.particles.push({x:run.x-15,y:run.y+4,vx:-70-Math.random()*80,vy:-Math.random()*55,life:.35,max:.35,color:'#ffdb70',r:2});}
 if(!idle&&run.sliding){for(let i=0;i<3;i++)line(c,[[px-55-i*12,py-13-i*8],[px-37-i*12,py-13-i*8]],'#d6edc477',2);}
 if(!idle&&run.brakeHeld&&run.grounded){line(c,[[px-52,py+9],[px-26,py+9]],'#f5d696',2);round(c,px-33,py-153,65,23,5,'#f4c98e');text(c,run.speed<5?'已停稳':'刹车中',px-23,py-137,11,'#5a5940','700');}
 if(!idle&&run.grounded&&run.speed>5&&run.state==='playing'&&Math.random()<.35)this.particles.push({x:run.x-27,y:run.y+3,vx:-25,vy:-8,life:.3,max:.3,color:'#d6cf9d',r:2});
 for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;if(p.life<=0){this.particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;c.globalAlpha=p.life/p.max;circle(c,p.x-cam,p.y,p.r,p.color);c.globalAlpha=1;}
 for(let i=this.popups.length-1;i>=0;i--){const p=this.popups[i];p.life-=dt*.9;if(p.life<=0){this.popups.splice(i,1);continue;}const rise=(1-p.life)*46,scale=p.life>.85?1+(p.life-.85)*2:1;c.save();c.globalAlpha=Math.min(1,p.life*2.5);c.translate(p.x-cam,p.y-rise);c.scale(scale,scale);c.font=`800 ${p.size}px "Avenir Next","PingFang SC",sans-serif`;c.textAlign='center';c.lineWidth=5;c.lineJoin='round';c.strokeStyle='#29473dcc';c.strokeText(p.str,0,0);c.fillStyle=p.color;c.fillText(p.str,0,0);c.restore();}
 // Small handwritten location detail lives in the scenery.
 if(idle&&w>900){c.save();c.translate(w*.77,410);c.rotate(-.08);text(c,world.note,0,0,13,'#fff0c49c');c.restore();}
 c.setTransform(1,0,0,1,0,0);
 }
}
