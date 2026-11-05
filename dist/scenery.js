// Twelve original canvas environments; shared by the course and postcard previews.
export const WORLDS=[
 {id:'coast',title:'海风，刚刚好。',mood:'17:40 · 晴朗海风',icon:'☀',accent:'#d95b35',paper:'#f6f3e9',ink:'#263e37',sky:['#f4bd8e','#ffe7b7'],ground:'#315c50',edge:'#f8d59a',places:['灯塔海湾','冲浪码头','落日沙滩'],note:'棕榈 · 帆船 · 木栈道'},
 {id:'town',title:'穿过橘子街。',mood:'16:20 · 橘子汽水',icon:'⌂',accent:'#b95f36',paper:'#faf0df',ink:'#533e32',sky:['#eeb895','#ffe3b0'],ground:'#76594e',edge:'#e9b57b',places:['面包店街角','电车广场','钟楼大道'],note:'店铺 · 电车线 · 红砖路'},
 {id:'mountain',title:'去山里，追风。',mood:'05:50 · 山间薄雾',icon:'△',accent:'#477c8e',paper:'#edf2ef',ink:'#294f57',sky:['#576e91','#c2d5d4'],ground:'#344f5c',edge:'#bacbd0',places:['松林入口','雪峰弯道','蓝调观景台'],note:'雪峰 · 松林 · 山岩'},
 {id:'roof',title:'城市，在脚下。',mood:'18:05 · 天台晚霞',icon:'▤',accent:'#c86452',paper:'#f6ece7',ink:'#523d42',sky:['#d58f92','#f8c598'],ground:'#51505d',edge:'#d3b6a0',places:['旧楼天台','水塔连廊','日落楼群'],note:'水塔 · 天线 · 楼顶平台'},
 {id:'bridge',title:'飞过这道峡谷。',mood:'09:30 · 峡谷水雾',icon:'⌁',accent:'#367d79',paper:'#eaf2eb',ink:'#285450',sky:['#9fc8c8','#dcead5'],ground:'#365c60',edge:'#c0d8bd',places:['峡谷入口','瀑布断桥','悬索终点'],note:'瀑布 · 悬索 · 桥墩'},
 {id:'neon',title:'今晚，闪亮登场。',mood:'22:10 · 霓虹小雨',icon:'✦',accent:'#ae4d8b',paper:'#eeeaf5',ink:'#423354',sky:['#22213f','#635079'],ground:'#262a43',edge:'#f08bb7',places:['街机巷口','不夜十字街','霓虹高架'],note:'招牌 · 光轨 · 雨夜街道'},
 {id:'sky',title:'把云踩在脚下。',mood:'06:15 · 云海日出',icon:'☁',accent:'#537da9',paper:'#edf3f8',ink:'#345575',sky:['#719ec1','#ebdccc'],ground:'#4f657b',edge:'#e8e6da',places:['云端起点','空中连廊','晨光塔尖'],note:'云海 · 飞艇 · 空中平台'},
 {id:'lava',title:'最后一程，沸腾。',mood:'00:00 · 熔岩警戒',icon:'♨',accent:'#cf593e',paper:'#f5e8e0',ink:'#563a3b',sky:['#382b49','#b7615d'],ground:'#3b3646',edge:'#ffa55c',places:['熔岩入口','钢铁工厂','火山终点'],note:'火山 · 熔岩 · 工业管道'},
 {id:'sakura',title:'春风，吹过河堤。',mood:'08:30 · 樱花微风',icon:'❀',accent:'#cf5f7b',paper:'#fbf1f1',ink:'#4a3a42',sky:['#f5c4cc','#fff1e2'],ground:'#56685c',edge:'#f7c6cf',places:['河堤起点','樱花步道','石桥渡口'],note:'樱花 · 河堤 · 石桥'},
 {id:'desert',title:'沙丘，一路向西。',mood:'14:00 · 热浪沙丘',icon:'☼',accent:'#c66e33',paper:'#faf0e1',ink:'#5a4030',sky:['#f0ac66','#fbe4b6'],ground:'#8a5a3c',edge:'#f3c98a',places:['沙丘入口','仙人掌公路','红岩台地'],note:'沙丘 · 仙人掌 · 红岩'},
 {id:'aurora',title:'在极光下滑翔。',mood:'23:40 · 极光冰原',icon:'✧',accent:'#2f9c8f',paper:'#ebf3f3',ink:'#24414a',sky:['#0d1a33','#2c5468'],ground:'#2c4656',edge:'#bfe7ec',places:['冰原营地','极光山口','冰川尽头'],note:'极光 · 冰山 · 雪原'},
 {id:'moon',title:'去月亮上，滑一圈。',mood:'∞ · 月面星港',icon:'☾',accent:'#6f63c9',paper:'#eeedf6',ink:'#2f2f4f',sky:['#0b0a1d','#2b2950'],ground:'#4a4a62',edge:'#d9d6f0',places:['发射台','陨石坑地带','星港终点'],note:'星港 · 陨石坑 · 地球升起'}
];
const poly=(c,p,col)=>{c.fillStyle=col;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();};
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(x,y,w,h);};
const round=(c,x,y,w,h,r,col)=>{c.fillStyle=col;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();};
const disk=(c,x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();};
const stroke=(c,p,col,w=2)=>{c.strokeStyle=col;c.lineWidth=w;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke();};
const label=(c,s,x,y,col,size=16)=>{c.fillStyle=col;c.font=`700 ${size}px sans-serif`;c.fillText(s,x,y);};
function repeat(w,cam,factor,spacing,draw){const offset=cam*factor;for(let i=Math.floor(offset/spacing)-1;i<Math.ceil((offset+w)/spacing)+1;i++)draw(i*spacing-offset,i);}
function cloud(c,x,y,s,col){c.save();c.translate(x,y);c.scale(s,s);for(let i=0;i<5;i++)disk(c,i*32,Math.sin(i*1.7)*9,26,col);c.restore();}
function tower(c,x,base,w,h,col,lights=false){rect(c,x,base-h,w,h,col);rect(c,x-3,base-h-6,w+6,6,col);for(let a=10;a<w-8;a+=18)for(let b=12;b<h-16;b+=25)rect(c,x+a,base-h+b,6,10,lights?'#f3bc9077':'#ffdfb044');}
function pine(c,x,y,s,col){rect(c,x-3*s,y-80*s,6*s,80*s,col);for(let i=0;i<3;i++)poly(c,[[x,y-(160-i*34)*s],[x-(33+i*8)*s,y-(75-i*28)*s],[x+(33+i*8)*s,y-(75-i*28)*s]],col);}
function palm(c,x,y,s){stroke(c,[[x,y],[x+12*s,y-72*s],[x,y-145*s]],'#426e5e',9*s);for(let i=0;i<7;i++){let a=Math.PI+i*Math.PI/6;poly(c,[[x,y-145*s],[x+Math.cos(a)*75*s,y-145*s+Math.sin(a)*35*s],[x+Math.cos(a)*45*s,y-166*s]],'#426e5e');}}
export function drawScenery(c,w,l,cam,t){const a=WORLDS[l.index],kind=a.id,sky=c.createLinearGradient(0,0,0,470);sky.addColorStop(0,a.sky[0]);sky.addColorStop(1,a.sky[1]);rect(c,0,0,w,650,sky);const sx=w*.72-cam*.012;
 if(kind==='moon'){disk(c,sx,170,58,'#3f78c8');poly(c,[[sx-40,150],[sx-10,128],[sx+20,140],[sx+8,170],[sx-28,180]],'#5fae74');poly(c,[[sx+18,190],[sx+44,176],[sx+40,206]],'#5fae74');disk(c,sx-18,150,16,'#e8f2ff55');}
 else disk(c,sx,180,kind==='neon'?44:kind==='aurora'?30:65,kind==='lava'?'#fca46c':kind==='aurora'?'#e8f1ef':kind==='desert'?'#fff6d8':'#fff2cd');
 if(['neon','mountain','lava','aurora','moon'].includes(kind))for(let i=0;i<34;i++)disk(c,(i*137+37)%w,35+(i*73)%185,i%3===0?1.5:1,'#fff3da88');
 if(kind==='coast'){
  rect(c,0,300,w,210,'#85b5a7');for(let i=0;i<12;i++)rect(c,sx-60-i*4,310+i*9,120+i*8,2,'#ffdfad55');
  repeat(w,cam,.12,480,(x,i)=>{poly(c,[[x,344],[x+35,344],[x+27,354],[x+8,354]],'#6b8580');poly(c,[[x+20,290],[x+20,339],[x-7,339]],'#fff2d6');});
  repeat(w,cam,.24,900,x=>{poly(c,[[x+40,420],[x+50,244],[x+78,244],[x+88,420]],'#f2d9b2');rect(c,x+48,279,33,20,'#d77754');rect(c,x+44,237,41,11,'#455f60');poly(c,[[x+42,237],[x+64,217],[x+86,237]],'#c36b50');});
  repeat(w,cam,.55,430,(x,i)=>{palm(c,x+80,452,.9);if(i%2===0)palm(c,x+132,455,.6);});
  stroke(c,[[0,447],[w,447]],'#547966',4);repeat(w,cam,.75,65,x=>rect(c,x,444,3,26,'#547966'));
 }else if(kind==='town'){
  repeat(w,cam,.16,200,(x,i)=>tower(c,x,382,95,75+Math.abs(i%3)*27,'#bd9b83'));
  repeat(w,cam,.48,235,(x,i)=>{const col=['#cf9367','#e2b282','#b97f6e'][((i%3)+3)%3];rect(c,x,295,215,167,col);poly(c,[[x-7,295],[x+108,248],[x+222,295]],'#8b685b');for(let j=0;j<4;j++){rect(c,x+16+j*49,315,27,38,'#7a8070');rect(c,x+18+j*49,317,23,3,'#ffe3a6');}rect(c,x+15,385,185,77,'#5e7268');for(let j=0;j<10;j++)rect(c,x+10+j*20,371,20,20,j%2?'#fff0ce':'#bc6f52');label(c,['BAKERY','ORANGE','COFFEE'][((i%3)+3)%3],x+28,420,'#ffe3ad',18);});
  stroke(c,[[0,242],[w,242]],'#715e5755');repeat(w,cam,.6,490,x=>{rect(c,x,225,4,245,'#6b695b');stroke(c,[[x-30,250],[x+50,250]],'#6b695b',3);});
 }else if(kind==='mountain'){
  repeat(w,cam,.1,430,x=>{poly(c,[[x-130,430],[x+160,150],[x+450,430]],'#8399ad');poly(c,[[x+160,150],[x+93,215],[x+143,202],[x+165,225],[x+190,204],[x+231,218]],'#e4e9e0');});
  repeat(w,cam,.26,230,(x,i)=>{poly(c,[[x-100,460],[x+100,265],[x+340,460]],'#547382');pine(c,x+30,450,.7,'#365d6a');});
  repeat(w,cam,.6,175,(x,i)=>pine(c,x,470,.75+Math.abs(i%3)*.12,'#294f5d'));
  for(let i=0;i<3;i++)cloud(c,w*.2+i*400-cam*.02,405+i*12,2,'#d6e7e217');
 }else if(kind==='roof'){
  repeat(w,cam,.14,130,(x,i)=>tower(c,x,432,90,120+Math.abs(i%5)*24,'#947d8c'));
  repeat(w,cam,.35,235,(x,i)=>{tower(c,x,460,170,105+Math.abs(i%3)*37,'#716678');stroke(c,[[x+70,315],[x+70,254],[x+42,275],[x+98,275]],'#6b6170',3);});
  repeat(w,cam,.6,530,x=>{stroke(c,[[x+28,460],[x+41,342],[x+92,342],[x+108,460]],'#5a5765',6);rect(c,x+27,286,80,65,'#927a73');poly(c,[[x+20,286],[x+67,265],[x+114,286]],'#5f5969');stroke(c,[[x+29,320],[x+106,320]],'#ccb09a',3);rect(c,x+240,426,64,36,'#a08a84');});
 }else if(kind==='bridge'){
  repeat(w,cam,.12,580,x=>{poly(c,[[x-70,470],[x+20,233],[x+130,223],[x+180,310],[x+290,293],[x+370,470]],'#779c94');rect(c,x+146,270,28,210,'#d0eee299');for(let j=0;j<3;j++)rect(c,x+149+j*9,280,2,190,'#f0fff299');});
  rect(c,0,445,w,205,'#6caaa6');repeat(w,cam,.35,430,x=>poly(c,[[x,470],[x+60,350],[x+180,320],[x+245,470]],'#4f7f79'));
  repeat(w,cam,.65,660,x=>{for(const dx of [0,32])rect(c,x+dx,185,9,290,'#416b6a');stroke(c,[[x-320,255],[x-160,330],[x+16,205],[x+180,330],[x+340,255]],'#466e6b',4);for(let j=-280;j<310;j+=40)stroke(c,[[x+j,300-Math.cos(j/320*Math.PI)*70],[x+j,466]],'#688e8366',2);});
 }else if(kind==='neon'){
  repeat(w,cam,.15,145,(x,i)=>tower(c,x,453,110,160+Math.abs(i%4)*38,'#36344f',true));
  repeat(w,cam,.46,280,(x,i)=>{tower(c,x,465,190,160+Math.abs(i%3)*35,'#32354b',true);const tint=i%2?'#82dcca':'#f28bbd';rect(c,x+20,320,130,43,'#22243b');stroke(c,[[x+20,320],[x+150,320],[x+150,363],[x+20,363],[x+20,320]],tint,2);label(c,i%2?'夜 滑 社':'ROLL 24H',x+32,348,tint,20);rect(c,x+176,285,30,109,'#433554');label(c,'夜',x+181,318,'#f1b3dc',19);label(c,'市',x+181,345,'#f1b3dc',19);});
  for(let i=0;i<32;i++){const x=(i*73+t*25)%(w+40)-20,y=(i*67+t*150)%460;stroke(c,[[x,y],[x-5,y+18]],'#b3c4e026');}
 }else if(kind==='sky'){
  repeat(w,cam,.08,460,x=>{cloud(c,x,290,2.7,'#f4ecdfaa');cloud(c,x+130,410,2.4,'#fff8e9aa');});
  repeat(w,cam,.24,360,(x,i)=>{tower(c,x,520,50,230+Math.abs(i%3)*55,'#869db0');poly(c,[[x-8,290],[x+25,253],[x+58,290]],'#b9c8cc');});
  const bx=((t*7-cam*.025)%(w+300)+w+300)%(w+300)-150;c.fillStyle='#dbe5e5';c.beginPath();c.ellipse(bx,178,72,23,0,0,Math.PI*2);c.fill();rect(c,bx-14,202,32,10,'#617f98');stroke(c,[[bx-25,196],[bx-14,207],[bx+18,207],[bx+32,196]],'#8ca5b4');
  repeat(w,cam,.58,600,x=>{rect(c,x,265,12,205,'#6b8297');stroke(c,[[x-100,470],[x+6,280],[x+130,470]],'#b4c8ce',3);disk(c,x+6,264,9,'#fff1ba');});
 }else if(kind==='sakura'){
  repeat(w,cam,.1,520,x=>{poly(c,[[x-80,420],[x+120,300],[x+330,420]],'#c9b0bb');poly(c,[[x+120,300],[x+90,325],[x+150,322]],'#f6eef0');});
  rect(c,0,400,w,250,'#9cc8c8');for(let i=0;i<8;i++)stroke(c,[[0,412+i*9],[w,412+i*9]],'#ffffff22',2);
  repeat(w,cam,.3,640,x=>{stroke(c,[[x,404],[x+70,370],[x+190,370],[x+260,404]],'#9d8f8a',10);for(let k=0;k<5;k++)rect(c,x+70+k*30,370,4,34,'#9d8f8a');});
  repeat(w,cam,.55,260,(x,i)=>{rect(c,x+60,330,10,130,'#6e5a5a');stroke(c,[[x+65,370],[x+30,340]],'#6e5a5a',6);stroke(c,[[x+65,360],[x+100,330]],'#6e5a5a',6);for(let k=0;k<7;k++)disk(c,x+30+((k*37)%80),300+((k*23)%50),26,k%2?'#f7bfcc':'#f3a9bb');if(i%2===0){rect(c,x+150,418,4,44,'#6e5a5a');round(c,x+140,400,24,22,4,'#e86a5b');disk(c,x+152,411,5,'#ffe7a4');}});
  for(let i=0;i<26;i++){const x=((i*97+t*40-cam*.4)%(w+40)+w+40)%(w+40)-20,y=(i*53+t*35)%470;c.save();c.translate(x,y);c.rotate(t+i);poly(c,[[0,-4],[3,0],[0,4],[-3,0]],'#ffd2dccc');c.restore();}
 }else if(kind==='desert'){
  repeat(w,cam,.08,700,x=>{poly(c,[[x,470],[x+60,300],[x+250,300],[x+300,470]],'#c9764e');rect(c,x+60,300,190,10,'#e19566');poly(c,[[x+380,470],[x+420,360],[x+520,360],[x+560,470]],'#b8694a');});
  repeat(w,cam,.22,420,x=>{c.fillStyle='#e8b477';c.beginPath();c.moveTo(x-40,470);c.quadraticCurveTo(x+170,330,x+420,470);c.fill();});
  repeat(w,cam,.5,360,(x,i)=>{const h=70+Math.abs(i%3)*25;round(c,x+40,462-h,18,h,9,'#5f8a55');round(c,x+18,462-h*.7,12,h*.35,6,'#5f8a55');round(c,x+18,462-h*.7+h*.3,30,10,5,'#5f8a55');round(c,x+62,462-h*.85,12,h*.3,6,'#5f8a55');round(c,x+50,462-h*.85+h*.25,24,10,5,'#5f8a55');if(i%2)poly(c,[[x+190,462],[x+204,448],[x+230,452],[x+238,462]],'#a77a58');});
  for(let i=0;i<6;i++){const y=430+i*7;stroke(c,[[0,y],[w,y+Math.sin(t*3+i)*2]],'#fff2d216',2);}
 }else if(kind==='aurora'){
  for(let k=0;k<3;k++){c.save();c.globalAlpha=.32-k*.07;const g=c.createLinearGradient(0,60,0,300);g.addColorStop(0,k===1?'#b48cff00':'#6effc800');g.addColorStop(.5,k===1?'#b48cff':'#6effc8');g.addColorStop(1,'#6effc800');c.fillStyle=g;c.beginPath();c.moveTo(-20,300);for(let x=-20;x<=w+20;x+=30)c.lineTo(x,120+k*35+Math.sin(x*.006+t*.4+k*2-cam*.0008)*45);c.lineTo(w+20,300);c.closePath();c.fill();c.restore();}
  repeat(w,cam,.1,600,x=>{poly(c,[[x-100,470],[x+120,230],[x+200,280],[x+260,220],[x+480,470]],'#33546a');poly(c,[[x+120,230],[x+100,262],[x+150,270],[x+200,280],[x+230,250],[x+260,220]],'#d7eef2');});
  repeat(w,cam,.32,380,x=>{poly(c,[[x,460],[x+40,360],[x+110,340],[x+150,460]],'#9fd3df');poly(c,[[x+40,360],[x+110,340],[x+90,460],[x+60,460]],'#c9ecf2');});
  repeat(w,cam,.6,520,x=>{poly(c,[[x,470],[x+30,438],[x+70,446],[x+96,470]],'#7fb3c2');poly(c,[[x+30,438],[x+70,446],[x+56,470],[x+40,470]],'#a9d6e0');});
 }else if(kind==='moon'){
  repeat(w,cam,.06,900,x=>{disk(c,x+200,80,26,'#c9c3ea');disk(c,x+208,74,6,'#a9a2d2');});
  repeat(w,cam,.15,520,x=>{c.fillStyle='#3d3b62';c.beginPath();c.ellipse(x+200,470,300,120,0,Math.PI,0);c.fill();});
  repeat(w,cam,.4,700,(x,i)=>{rect(c,x+80,250,26,212,'#5c5a86');stroke(c,[[x+40,462],[x+93,250],[x+146,462]],'#7d79aa',4);disk(c,x+93,246,8,i%2?'#ff7a7a':'#7affd1');round(c,x+300,400,150,62,30,'#6e6b99');round(c,x+330,382,90,30,15,'#8c88bb');for(let k=0;k<4;k++)disk(c,x+330+k*28,428,6,'#ffe7a4aa');});
  repeat(w,cam,.62,340,x=>{c.fillStyle='#3a3a52';c.beginPath();c.ellipse(x+100,466,46,10,0,0,Math.PI*2);c.fill();});
  const sx2=((t*30-cam*.03)%(w+400)+w+400)%(w+400)-200;stroke(c,[[sx2,120],[sx2-90,150]],'#ffffffaa',2);
 }else{
  repeat(w,cam,.12,770,x=>{poly(c,[[x-120,470],[x+140,170],[x+190,184],[x+235,166],[x+510,470]],'#6b4051');poly(c,[[x+140,170],[x+166,218],[x+190,184],[x+220,236],[x+235,166]],'#ef9166');stroke(c,[[x+190,190],[x+169,280],[x+245,346],[x+205,465]],'#db795d',11);});
  rect(c,0,415,w,235,'#e17b51');for(let i=0;i<11;i++)stroke(c,[[0,427+i*17],[w,427+i*17]],i%2?'#ffb06066':'#8a464633',3);
  repeat(w,cam,.4,390,x=>{tower(c,x,465,120,100,'#493a4a');rect(c,x+65,250,23,146,'#534151');stroke(c,[[x+67,270],[x+87,270]],'#e58b67',6);cloud(c,x+30,230,.7,'#b79b9c22');});
  repeat(w,cam,.6,500,x=>{stroke(c,[[x,466],[x,330],[x+160,330],[x+160,465]],'#775a5d',16);stroke(c,[[x,466],[x,330],[x+160,330]],'#ab7b6d',3);});
  for(let i=0;i<16;i++)disk(c,(i*139-cam*.22+w*10)%w,445-(i*41+t*27)%300,1.5,'#ffb56a88');
 }
}
export function roadTexture(c,a,b,cam,l){const aTheme=WORLDS[l.index],kind=aTheme.id;
 if(kind==='coast'||kind==='town'){for(let x=Math.floor(a/56)*56;x<b;x+=56){stroke(c,[[x-cam,481],[x-cam,650]],'#efd5ab18');if(kind==='town')for(let y=493;y<650;y+=27)stroke(c,[[x-cam+(y%2)*10,y],[x-cam+54,y]],'#efd5ab22');}}
 else if(kind==='roof'||kind==='sky'){for(let x=Math.floor(a/100)*100;x<b;x+=100){rect(c,x-cam+20,508,60,56,'#c9d6d31c');rect(c,x-cam+24,512,52,3,'#d4d8d122');}}
 else if(kind==='bridge'){for(let x=Math.floor(a/140)*140;x<b;x+=140)stroke(c,[[x-cam,488],[x-cam+70,600],[x-cam+140,488]],'#a5c2b63b',8);}
 else if(kind==='neon'){for(let x=Math.floor(a/140)*140;x<b;x+=140){rect(c,x-cam,498,75,3,'#ec86b877');rect(c,x-cam+25,525,100,2,'#6accc04d');}}
 else if(kind==='lava'){for(let x=Math.floor(a/190)*190;x<b;x+=190){stroke(c,[[x-cam,555],[x-cam+52,510],[x-cam+86,533],[x-cam+125,501]],'#f89d5733',3);for(let j=0;j<4;j++)poly(c,[[x+j*19-cam,484],[x+j*19+10-cam,484],[x+j*19-cam,496],[x+j*19-10-cam,496]],'#f7be6e77');}}
 else if(kind==='sakura'){for(let x=Math.floor(a/60)*60;x<b;x+=60)disk(c,x-cam+20,500+(x%7)*15,3,'#f7c6cf44');}
 else if(kind==='desert'){for(let x=Math.floor(a/120)*120;x<b;x+=120)stroke(c,[[x-cam,520],[x-cam+50,512],[x-cam+100,522]],'#f3c98a33',3);}
 else if(kind==='aurora'){for(let x=Math.floor(a/110)*110;x<b;x+=110){rect(c,x-cam,482,80,3,'#bfe7ec44');stroke(c,[[x-cam+20,520],[x-cam+45,545],[x-cam+30,580]],'#bfe7ec2a',2);}}
 else if(kind==='moon'){for(let x=Math.floor(a/130)*130;x<b;x+=130){c.strokeStyle='#d9d6f022';c.lineWidth=3;c.beginPath();c.ellipse(x-cam+50,540+(x%3)*20,24,7,0,0,Math.PI*2);c.stroke();}}
 else for(let x=Math.floor(a/150)*150;x<b;x+=150)poly(c,[[x-cam,515],[x-cam+35,495],[x-cam+80,530],[x-cam+60,550]],'#98adac22');
}
export function drawPostcard(c,index){c.canvas.width=640;c.canvas.height=260;c.save();c.scale(.72,.72);c.translate(0,-160);drawScenery(c,890,{index},500,0);rect(c,0,470,890,70,WORLDS[index].ground);rect(c,0,470,890,4,WORLDS[index].edge);roadTexture(c,0,890,0,{index});c.restore();}
