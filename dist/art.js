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
export function skater(c,x,y,{charge=0,air=false,time=0,scale=1,crashed=false,land=0,sliding=false,grinding=false}={}){c.save();c.translate(x,y-7);c.scale(scale,scale);if(crashed)c.rotate(-.6);else c.rotate(air?Math.sin(time*4)*.1:Math.sin(time*9)*.018);const crouch=charge*18+land*6+(grinding?8:0),bob=air?0:Math.sin(time*10)*1.5;
 // Board, trucks, and rotating white wheels.
 c.save();c.translate(0,1);if(air)c.rotate(-.16);line(c,[[-31,-6],[-23,-1],[25,-1],[33,-7]],'#244335',6);line(c,[[-29,-8],[-22,-4],[24,-4],[30,-8]],'#e77642',3);for(const wx of [-19,20]){line(c,[[wx,-1],[wx,5]],'#274335',3);circle(c,wx,7,6,'#f8e9bd');circle(c,wx,7,2.5,'#29493a');line(c,[[wx,3],[wx+Math.cos(time*18)*4,7+Math.sin(time*18)*4]],'#a29e76',1);}c.restore();
 // A distinct low tuck matches the slide collision height.
 if(sliding){line(c,[[-16,-16],[-28,-30],[-3,-32],[14,-14]],'#294c4a',11);line(c,[[-9,-16],[9,-29],[23,-14]],'#385d59',10);round(c,-23,-15,20,8,3,'#fff4d8');round(c,13,-15,20,8,3,'#fff4d8');line(c,[[-14,-32],[14,-32]],'#ee643d',17);line(c,[[7,-30],[23,-19],[34,-18]],'#efb77f',6);circle(c,23,-34,10,'#f2ba82');round(c,12,-46,29,5,2,'#376c58');circle(c,28,-35,1.5,'#314536');c.restore();return;}
 // Bent legs and clean sneaker silhouettes.
 line(c,[[-8,-43+crouch],[6,-24+crouch*.3],[-13,-12]],'#294c4a',12);line(c,[[9,-43+crouch],[22,-27+crouch*.2],[21,-11]],'#385d59',12);round(c,-23,-15,22,9,3,'#fff4d8');round(c,13,-15,23,9,3,'#fff4d8');line(c,[[-23,-6],[-2,-6]],'#2a4b3a',2);line(c,[[14,-6],[36,-6]],'#2a4b3a',2);
 // Oversized coral T-shirt.
 const cy=crouch+bob;poly(c,[[-13,-82+cy],[6,-84+cy],[20,-63+cy],[13,-39+cy],[-14,-40+cy],[-20,-63+cy]],'#ee643d');poly(c,[[-14,-75+cy],[-22,-57+cy],[-12,-53+cy],[-4,-70+cy]],'#d75432');line(c,[[-15,-55+cy],[-29,-39+cy],[-40,-44+cy]],'#bd7c50',7);line(c,[[14,-69+cy],[27,-53+cy],[42,-58+cy]],'#efb77f',8);circle(c,43,-58+cy,4,'#efb77f');line(c,[[0,-50+cy],[10,-50+cy]],'#ffe6b4',2);
 // Neck, face, hair, cap.
 line(c,[[0,-83+cy],[1,-91+cy]],'#e4a672',9);circle(c,1,-100+cy,15,'#f2ba82');poly(c,[[-11,-104+cy],[-11,-89+cy],[-5,-90+cy],[-4,-103+cy]],'#374937');circle(c,13,-98+cy,4,'#f2ba82');circle(c,9,-103+cy,1.6,'#314536');c.fillStyle='#376c58';c.beginPath();c.arc(0,-105+cy,16,Math.PI,TAU);c.fill();round(c,-18,-108+cy,42,5,2,'#376c58');line(c,[[-8,-119+cy],[-4,-123+cy],[5,-121+cy]],'#427e65',2);c.restore();}
function obstacle(c,o,level,camera){const x=o.x-camera,y=470;if(o.type==='crate'){round(c,x,y-o.h,o.w,o.h,3,'#bc8050');c.strokeStyle='#f0bb78';c.lineWidth=3;c.strokeRect(x+4,y-o.h+4,o.w-8,o.h-8);line(c,[[x+5,y-5],[x+o.w-5,y-o.h+5]],'#f0bb78',3);line(c,[[x+5,y-o.h+5],[x+o.w-5,y-5]],'#f0bb78',3);}else if(o.type==='barrel'){round(c,x,y-o.h,o.w,o.h,10,'#dc8a4e');for(const yy of [y-o.h+10,y-12]){line(c,[[x+2,yy],[x+o.w-2,yy]],'#f0c384',5);}line(c,[[x+o.w/2,y-o.h+5],[x+o.w/2,y-5]],'#b46f3e',2);}else{round(c,x-5,y-6,o.w+10,7,3,'#465a43');poly(c,[[x+o.w*.38,y-o.h],[x+o.w*.62,y-o.h],[x+o.w,y-6],[x,y-6]],'#e77945');poly(c,[[x+o.w*.24,y-o.h*.65],[x+o.w*.76,y-o.h*.65],[x+o.w*.87,y-o.h*.39],[x+o.w*.13,y-o.h*.39]],'#fff0cb');}}
function gate(c,g,cam){const x=g.x-cam,w=g.w;line(c,[[x-5,470],[x-5,g.top-10],[x+w+5,g.top-10],[x+w+5,470]],'#4c6e5a88',6);
 if(g.type==='branch'){round(c,x,g.top,w,g.bottom-g.top,12,'#4d7660');for(let i=0;i<5;i++){circle(c,x+18+i*(w-36)/4,g.top+20,24,'#567f64');circle(c,x+18+i*(w-36)/4,g.bottom-16,18,'#4d7660');}line(c,[[x+5,g.bottom-22],[x+w-6,g.bottom-22]],'#6c664a',8);}
 else{round(c,x,g.top,w,g.bottom-g.top,5,'#d9ae67');c.save();c.beginPath();c.rect(x,g.bottom-21,w,21);c.clip();for(let i=-1;i<w/26+1;i++)poly(c,[[x+i*26,g.bottom],[x+i*26+16,g.bottom],[x+i*26+34,g.bottom-21],[x+i*26+18,g.bottom-21]],'#425c4a');c.restore();line(c,[[x+12,g.top+15],[x+w-12,g.top+15]],'#f2d69b',2);}
 round(c,x+w/2-46,g.bottom-79,92,37,6,'#f9ebbf');text(c,'↓ 低头滑行',x+w/2-37,g.bottom-55,13,'#375e4b','700');line(c,[[x+10,463],[x+w-10,463]],'#7ae4c5',3);}
function railArt(c,r,cam){const x=r.x-cam;for(let j=0;j<=r.w;j+=105){line(c,[[x+j,r.y+4],[x+j,468]],'#547268',5);line(c,[[x+j-13,468],[x+j+13,468]],'#3e5c4d',4);}line(c,[[x-12,r.y+12],[x,r.y],[x+r.w,r.y],[x+r.w+12,r.y+12]],'#f7edc5',9);line(c,[[x,r.y-1],[x+r.w,r.y-1]],'#69cbb4',4);round(c,x+14,r.y+22,92,23,4,'#2b5b4b');text(c,'↗ 跳上来滑杆',x+23,r.y+38,11,'#d9f2ca','700');if(r.transfer){line(c,[[x+r.w-95,r.y-1],[x+r.w,r.y-1]],'#ff996a',6);round(c,x+r.w-111,r.y-45,118,25,5,'#ed794b');text(c,'↑ 杆尾再次起跳',x+r.w-102,r.y-27,12,'#fff3d3','700');}}
export class Art {
 constructor(){this.particles=[];this.t=0;this.camera=0;this.flash=0;}
 burst(x,y,color,n=10){for(let i=0;i<n;i++)this.particles.push({x,y,vx:(Math.random()-.5)*150,vy:-Math.random()*160-25,life:.7,max:.7,color,r:Math.random()*3+2});}
 draw(c,width,height,run,dt,idle=false){this.t+=dt;const l=run.level,w=650*width/height;c.setTransform(width/w,0,0,height/650,0,0);c.clearRect(0,0,w,650);const desired=idle?700:Math.max(0,run.x-w*.23);this.camera=idle?700:this.camera+(desired-this.camera)*Math.min(1,dt*9);if(!idle&&Math.abs(desired-this.camera)>w)this.camera=desired;const cam=this.camera,t=this.t;
 const sky=c.createLinearGradient(0,0,0,430);sky.addColorStop(0,l.sky[0]);sky.addColorStop(1,l.sky[1]);c.fillStyle=sky;c.fillRect(0,0,w,650);
 // Soft sunset disc and its reflection on the sea.
 const sunX=w*.7-cam*.015,sunY=205;circle(c,sunX,sunY,83,(l.night||l.index===2)?'#f4e5bd':'#fff0ba');circle(c,sunX,sunY,100,(l.night||l.index===2)?'#e5dabb0a':'#fff0ba1b');
 c.fillStyle=l.sea;c.fillRect(0,300,w,350);for(let i=0;i<16;i++){let yy=310+i*8,xx=sunX-65-i*2+Math.sin(i*8+t*.3)*18;c.fillStyle=(l.night||l.index===2)?'#d2d4bc38':'#f7e5ad66';c.fillRect(xx,yy,130+i*5,2);}
 // Distant coast, haze, and two parallax layers.
 hill(c,w,cam,.08,335,l.far,3);c.fillStyle=l.sea;c.fillRect(0,365,w,90);for(let i=0;i<14;i++){const xx=((i*153-cam*.2)% (w+180)+w+180)%(w+180)-90;line(c,[[xx,375+(i%4)*14],[xx+45,375+(i%4)*14]],'#f4e6bd33',1);}
 if((l.urban||l.index===1)){for(let i=-1;i<Math.ceil(w/140)+2;i++){let wx=i*140+Math.floor(cam*.2/140)*140;building(c,wx-cam*.2,373,85+(i%3)*10,60+Math.abs(Math.sin(wx))*55,i%2?'#ba8b70':'#c49771');}}
 if((l.night||l.index===2))hill(c,w,cam,.16,375,'#526e77',5);
 // Birds are deliberately small against an open sky.
 for(let i=0;i<4;i++){const bx=((w*.4+i*42-cam*.06+t*2)%(w+100)+w+100)%(w+100),by=170+Math.sin(i*7)*18;line(c,[[bx-6,by-2],[bx,by+1],[bx+6,by-3]],(l.night||l.index===2)?'#f4e4c18a':'#537962aa',1.5);}
 hill(c,w,cam,.3,435,l.hill,1);
 // Palms and coastside buildings sit behind the road.
 for(let i=Math.floor(cam*.6/420)-1;i<Math.ceil((cam*.6+w)/420)+1;i++){const x=i*420-cam*.6+110;const y=454; if((l.night||l.index===2)){line(c,[[x,y],[x,y-145],[x+32,y-145]],l.dark,5);circle(c,x+32,y-144,7,'#f7dd94');circle(c,x+32,y-144,25,'#f7dd9411');}else{palm(c,x,y,.9+(i%2)*.15,l.dark,i%2?1:-1);if(i%3===1)palm(c,x+45,y,.65,l.dark);}}
 // A boardwalk fence adds depth without hiding hazards.
 c.fillStyle=l.dark+'66';c.fillRect(0,447,w,3);for(let x=-(cam*.75%64);x<w;x+=64)c.fillRect(x,444,3,21);
 // Road is split at gaps. Sample its curved ramps for a continuous ride.
 const spans=[];let start=cam-40;for(const g of l.gaps){if(g.x+g.w<cam-40||g.x>cam+w+40)continue;if(g.x>start)spans.push([start,g.x]);start=g.x+g.w;}spans.push([start,cam+w+40]);
 const groundAt=x=>{let y=470;for(const r of l.ramps)if(x>=r.x&&x<=r.x+r.w)y-=Math.sin((x-r.x)/r.w*Math.PI)*r.h;return y;};
 for(const [a,b]of spans){if(a>=b)continue;const pts=[[a-cam,650],[a-cam,groundAt(a)]];for(let x=a+8;x<b;x+=8)pts.push([x-cam,groundAt(x)]);pts.push([b-cam,groundAt(b)],[b-cam,650]);poly(c,pts,l.dark);const edge=pts.slice(1,-1);line(c,edge,'#f9dfa0',9);line(c,edge,'#b7ad72',2);c.save();c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.clip();c.strokeStyle='#fff3be0e';c.lineWidth=1;for(let y=490;y<650;y+=24){c.beginPath();c.moveTo(a-cam,y);c.lineTo(b-cam,y);c.stroke();}for(let x=Math.floor(a/90)*90;x<b;x+=90){c.fillStyle='#d5cda333';c.fillRect(x-cam,514,32,3);}c.restore();}
 if(l.hard){for(const section of l.sections){const sx=section.x-cam;if(sx>-180&&sx<w+100){const names={slalom:'连跳区',twins:'双重断崖',bridge:'断桥 · 必须滑杆',transfer:'空中换杆',duckjump:'低头 → 起跳'};round(c,sx,541,145,27,4,'#f3dbb41f');text(c,names[section.kind],sx+12,560,12,'#f3dfbb','700');}}}
 // Gap warning stripes and road signs.
 for(const g of l.gaps){const x=g.x-cam;if(x<-250||x>w+250)continue;for(let j=0;j<3;j++){line(c,[[x-65+j*15,486],[x-73+j*15,494]],'#e9bc72',4);}line(c,[[x-125,467],[x-125,408]],'#4b6751',4);round(c,x-145,390,40,31,4,'#f3cf7c');text(c,'↗',x-138,413,26,'#3c5942','700');}
 for(const cp of l.checkpoints){const x=cp-cam;if(x<-100||x>w+100)continue;line(c,[[x,470],[x,363]],'#f4e4bb',4);poly(c,[[x+2,365],[x+55,374],[x+2,398]],run.checkpoint.x>=cp?'#f5d071':'#e97b50');text(c,'✓',x+10,386,18,'#fff3d2');round(c,x-38,488,77,20,4,'#f4e6bf1c');text(c,'CHECKPOINT',x-30,502,8,'#f4e6bf');}
 const finish=l.length-cam;if(finish<w+150){for(const x of [finish,finish+110])line(c,[[x,470],[x,290]],'#f5e8be',7);for(let x=0;x<8;x++)for(let y=0;y<3;y++){c.fillStyle=(x+y)%2?'#355448':'#f4e5b5';c.fillRect(finish+x*14,292+y*14,14,14);}text(c,'FINISH',finish+23,357,19,'#fff0c2','800');}
 for(const g of l.gates)if(g.x>cam-250&&g.x<cam+w+100)gate(c,g,cam);
 for(const r of l.rails)if(r.x+r.w>cam-100&&r.x<cam+w+100)railArt(c,r,cam);
 for(const o of l.obstacles)if(o.x>cam-80&&o.x<cam+w+80)obstacle(c,o,l,cam);
 for(const s of l.stars){if(run.collected.has(s.id)||s.x<cam-80||s.x>cam+w+80)continue;const y=s.y+Math.sin(t*3+s.id)*4;circle(c,s.x-cam,y,17,'#ffdb7933');star(c,s.x-cam,y,11,'#fff0ae',Math.sin(t+s.id)*.08);circle(c,s.x-cam-2,y-3,2,'#fff7d5');}
 const px=idle?w*.65:run.x-cam,py=idle?440:run.y;const air=!run.grounded&&!run.grinding&&!idle;const shadowY=groundAt(idle?cam+px:run.x);if(!l.gaps.some(g=>run.x>=g.x&&run.x<g.x+g.w)||idle){c.save();c.globalAlpha=Math.max(.05,.18-Math.max(0,shadowY-py)*.0006);c.fillStyle='#0e332c';c.beginPath();c.ellipse(px,shadowY+6,idle?49:32,5,0,0,TAU);c.fill();c.restore();}
 if(idle){const rockX=px-95;poly(c,[[rockX,470],[rockX+20,435],[rockX+150,435],[rockX+181,470]],'#637957');line(c,[[rockX+22,435],[rockX+151,435]],'#f5d391',5);}
 skater(c,px,py,{charge:run.charge,air,time:t,scale:idle?1.45:1,crashed:run.state==='crashed',land:run.landPulse,sliding:run.sliding&&!idle,grinding:run.grinding&&!idle});
 if(!idle&&run.grinding&&run.state==='playing'){for(let i=0;i<2;i++)this.particles.push({x:run.x-15,y:run.y+4,vx:-70-Math.random()*80,vy:-Math.random()*55,life:.35,max:.35,color:'#ffdb70',r:2});}
 if(!idle&&run.sliding){for(let i=0;i<3;i++)line(c,[[px-55-i*12,py-13-i*8],[px-37-i*12,py-13-i*8]],'#d6edc477',2);}
 if(!idle&&run.grounded&&run.state==='playing'&&Math.random()<.35)this.particles.push({x:run.x-27,y:run.y+3,vx:-25,vy:-8,life:.3,max:.3,color:'#d6cf9d',r:2});
 for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.life-=dt;if(p.life<=0){this.particles.splice(i,1);continue;}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;c.globalAlpha=p.life/p.max;circle(c,p.x-cam,p.y,p.r,p.color);c.globalAlpha=1;}
 // Small handwritten location detail lives in the scenery.
 if(idle&&w>900){c.save();c.translate(w*.77,410);c.rotate(-.08);text(c,'meet me at sunset',0,0,13,'#fff0c49c');c.restore();}
 c.setTransform(1,0,0,1,0,0);
 }
}
