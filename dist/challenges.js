// Updraft input: jump in, hold to climb over the low cloud, drift under the high one, climb again, drift down to land.
export let GLIDE_SCRIPT=[[250,'press'],[330,'release'],[400,'press'],[900,'release'],[1580,'press'],[2240,'release']];
const SIZES={slalom:2000,twins:2200,bridge:2400,transfer:2800,duckjump:2200,traffic:2600,spring:2300,boost:2400,rings:2400,glide:3000};
export const SECTION_SIZES=SIZES;
const configs=[
 {name:'天台连跳',en:'ROOFTOP RUSH',speed:350,tag:'高难 · 连跳',description:'闸门、滚胎与连跳，停、跳、低头交替。',pattern:['traffic','slalom','twins','duckjump','twins','slalom','bridge'],sky:['#d88d7b','#f2c7a0'],sea:'#a49b94',far:'#aa8881',hill:'#7a7770',dark:'#424e48',urban:true},
 {name:'断桥飞跃',en:'BROKEN BRIDGES',speed:365,tag:'专家 · 断桥',description:'九十米断桥，只能借滑杆凌空穿越。',pattern:['twins','traffic','bridge','duckjump','bridge','twins','bridge'],sky:['#8bafae','#d3d9bb'],sea:'#78a4a0',far:'#759493',hill:'#4d7779',dark:'#294e54'},
 {name:'霓虹穿梭',en:'NEON GAUNTLET',speed:380,tag:'大师 · 变招',description:'先过摆锤，再接低头与起跳的连续组合。',pattern:['traffic','duckjump','slalom','twins','duckjump','bridge','duckjump','slalom'],sky:['#575379','#b1869c'],sea:'#777e99',far:'#6e7395',hill:'#515c7d',dark:'#303b58',night:true,urban:true},
 {name:'空中换杆',en:'SKYLINE TRANSFER',speed:395,tag:'疯狂 · 换杆',description:'在杆尾重新起跳，飞过两根杆间的缺口。',pattern:['bridge','traffic','transfer','twins','transfer','duckjump','transfer'],sky:['#596f87','#a8b8bc'],sea:'#6c919c',far:'#658b98',hill:'#486d7a',dark:'#274a5e',night:true,urban:true},
 {name:'极限终章',en:'NO ROOM FOR ERROR',speed:410,tag:'极限 · 全组合',description:'最快速度、长断桥与空中接力，一口气拿下。',pattern:['traffic','duckjump','twins','transfer','slalom','bridge','transfer','duckjump','twins'],sky:['#735c78','#d8948a'],sea:'#968394',far:'#8d7788',hill:'#695e7b',dark:'#403f60',night:true,urban:true},
 {name:'樱花河堤',en:'SAKURA RIVERSIDE',speed:330,season:2,tag:'第二季 · 弹跳',description:'踩上弹簧板飞过高墙，冲上加速带跳过长断崖。',pattern:['slalom','spring','boost','duckjump','spring','boost','twins'],sky:['#f6c9cf','#fff0e0'],sea:'#9cc3c4',far:'#c9a4ae',hill:'#8d9f8b',dark:'#4c5e52'},
 {name:'沙丘公路',en:'DUNE HIGHWAY',speed:345,season:2,tag:'第二季 · 跳环',description:'碰到空中光环就能再跳一次，一环接一环飞过沙谷。',pattern:['spring','rings','slalom','boost','rings','twins','rings'],sky:['#f2b46f','#fbe3b4'],sea:'#e0b27c',far:'#c98a5c',hill:'#a86a45',dark:'#6a4532'},
 {name:'极光冰原',en:'AURORA GLIDE',speed:355,season:2,tag:'第二季 · 滑翔',description:'冰缝里吹着上升气流：按住上升、松开缓降，穿过乌云。',pattern:['glide','spring','rings','duckjump','glide','boost','glide'],sky:['#0f1f3a','#2f5a6e'],sea:'#3d6f7d',far:'#3b5f73',hill:'#2f4c5e',dark:'#1d3140',night:true},
 {name:'月面星港',en:'MOON HARBOR',speed:370,season:2,tag:'第二季 · 全装置',description:'机关、跳环、气流、弹簧和换杆，全部装置一次通关。',pattern:['traffic','rings','glide','spring','transfer','boost','rings','glide','bridge'],sky:['#0c0b1f','#2c2a52'],sea:'#3f3d66',far:'#47456b',hill:'#3a3858',dark:'#22213a',night:true}
];
export const CHALLENGES=configs.map(r=>({...r,length:r.pattern.reduce((n,k)=>n+SIZES[k],800),hard:true}));
// Mirrors Run.step for a single scripted arc so rings sit exactly where a tap lands you.
function simulateRings(speed,start){const dt=1/120,g=1500,rings=[];let x=start,y=470,vy=0,charge=0,holding=false,air=false,next=null,apexY=0,lastVy=0;const taps=[[start-10,'press'],[start,'release']];let tap=0;
 for(let i=0;i<120*6;i++){
  while(tap<taps.length&&x>=taps[tap][0]){const [,a]=taps[tap++];if(a==='press'){holding=true;charge=0;}else{if(holding){vy=-(570+240*charge);air=true;}holding=false;charge=0;}}
  if(holding)charge=Math.min(1,charge+dt/.55);x+=speed*dt;if(air){lastVy=vy;vy+=g*dt;y+=vy*dt;}
  if(air&&rings.length===0&&lastVy<0&&vy>=0){apexY=y;rings.push({x,y:y-55});taps.push([x+5,'press'],[x+15,'release']);}
  else if(air&&rings.length>0&&rings.length<3&&vy>0&&lastVy>0&&y>=apexY&&y-vy*dt<apexY&&x>rings[rings.length-1].x+40){rings.push({x,y:y-55});taps.push([x+5,'press'],[x+15,'release']);}
  if(air&&y>=470&&vy>0)return {rings,landing:x,taps};
 }
 return {rings,landing:x,taps};
}
export function buildChallenge(route,index){
 const gaps=[],obstacles=[],gates=[],rails=[],stars=[],sections=[],checkpoints=[],movers=[],springs=[],boosts=[],rings=[],updrafts=[],blocks=[],items=[],cues=[];
 const speedAt=x=>route.speedAt?route.speedAt(x):route.speed;
 const item=(x,type)=>items.push({id:items.length,x,y:415,type});
 const arcStars=(x0,vy0,speed,n,step=.18)=>{for(let j=1;j<=n;j++){const t=j*step;star(x0+speed*t,470-(vy0*t-750*t*t)-42);}};
 const star=(x,y)=>stars.push({id:stars.length,x,y});
 const obstacle=(x,w=90,h=60)=>{obstacles.push({x,w,h,type:'crate'});for(let j=0;j<4;j++)star(x-90+j*70,365-Math.sin(j*Math.PI/3)*55);};
 const gate=(x,w=180)=>{gates.push({x,w,bottom:409,top:235,type:'barrier'});for(let j=20;j<w;j+=45)star(x+j,445);};
 const gap=(x,w)=>{gaps.push({x,w});if(w<400)for(let j=0;j<5;j++)star(x-70+j*(w+140)/4,355-Math.sin(j*Math.PI/4)*60);};
 const rail=(x,w,y=380,transfer=false)=>{const r={id:rails.length,x,w,y,transfer};rails.push(r);for(let j=60;j<w;j+=95)star(x+j,y-45);return r;};
 let b=400;
 route.pattern.forEach((kind,i)=>{
  sections.push({kind,x:b,w:SIZES[kind]});
  if(kind==='traffic'){movers.push({id:`move-${i}-gate`,type:'shutter',x:b+450,w:70,phase:i*.7},{id:`move-${i}-tire`,type:'tire',x:b+1100,phase:i*.9},{id:`move-${i}-swing`,type:'swing',x:b+1700,phase:i*.4});gate(b+2200,160);for(let j=0;j<4;j++)star(b+1000+j*70,355-Math.sin(j*Math.PI/3)*45);}
  if(kind==='slalom'){obstacle(b+350,105);gate(b+900,150);obstacle(b+1380,120,70);}
  if(kind==='twins'){gap(b+400,210);gap(b+880,210);gate(b+1650,200);}
  if(kind==='bridge'){gap(b+700,900);rail(b+550,1120);gate(b+1980,180);}
  if(kind==='transfer'){gap(b+650,1450);rail(b+500,600,380,true);rail(b+1340,850,350);gate(b+2500,160);}
  if(kind==='duckjump'){gate(b+350,200);obstacle(b+740,80);gate(b+1190,200);obstacle(b+1580,100);}
  if(kind==='spring'){item(b+150,'shield');springs.push({x:b+300,w:60},{x:b+1150,w:60});cues.push({x:b+300,w:60,kind:'spring'},{x:b+1150,w:60,kind:'spring'});gap(b+430,330);obstacles.push({x:b+1400,w:70,h:190,type:'wall'});gate(b+1900,160);arcStars(b+330,1150,speedAt(b+300),6,.2);sections[sections.length-1].script=[[1850,'duck'],[2110,'stand']];}
  if(kind==='boost'){item(b+120,'magnet');boosts.push({x:b+250,w:160},{x:b+1500,w:120});cues.push({x:b+250,w:160,kind:'boost'},{x:b+1500,w:120,kind:'boost'});gaps.push({x:b+700,w:480});arcStars(b+640,810,speedAt(b)*1.6,5,.18);gate(b+1800,200);sections[sections.length-1].script=[[330,'press'],[640,'release'],[1740,'duck'],[2060,'stand']];}
  if(kind==='rings'){item(b+150,'magnet');const sim=simulateRings(speedAt(b+380),b+380);for(const r of sim.rings){rings.push({id:rings.length,...r});star(r.x+70,r.y-30);star(r.x+140,r.y-50);}gaps.push({x:b+430,w:Math.max(500,sim.landing-60-(b+430))});cues.push({x:b+430,w:sim.landing-b-430,kind:'ring'});gate(b+1950,160);sections[sections.length-1].script=[...sim.taps.map(([x,a])=>[x-b,a]),[1900,'duck'],[2160,'stand']];}
  if(kind==='glide'){item(b+150,'shield');updrafts.push({x:b+330,w:2240});gaps.push({x:b+350,w:2150});cues.push({x:b+350,w:2150,kind:'glide'});blocks.push({x:b+800,w:140,top:300,bottom:760,type:'cloud-low'},{x:b+1450,w:140,top:-300,bottom:262,type:'cloud-high'},{x:b+2100,w:140,top:300,bottom:760,type:'cloud-low'});for(const [bx,y] of [[870,190],[1170,300],[1520,385],[1820,300],[2170,190]])star(b+bx,y);sections[sections.length-1].script=GLIDE_SCRIPT;}
  b+=SIZES[kind];if((i+1)%2===0&&i<route.pattern.length-1)checkpoints.push(b);
 });
 const glideGaps=new Set(cues.filter(c=>c.kind!=='spring'&&c.kind!=='boost').map(c=>c.x));
 const hazards=[...obstacles.map(o=>({...o,kind:'jump'})),...gaps.filter(g=>!glideGaps.has(g.x)).map(o=>({...o,kind:'gap'})),...cues,...gates.map(o=>({...o,kind:'slide'})),...movers.map(o=>({x:o.type==='shutter'?o.x:o.x-(o.type==='tire'?100:160),w:o.type==='shutter'?o.w:o.type==='tire'?200:320,kind:o.type,moverId:o.id}))].sort((a,b)=>a.x-b.x).map((o,id)=>({...o,id}));
 return {...route,index,block:0,gaps,obstacles,gates,rails,stars,sections,checkpoints,movers,springs,boosts,rings,updrafts,blocks,items,ramps:[],hazards};
}

// Daily ride: one seeded course per calendar day, same for every player on that date.
export const DAILY_KINDS=['slalom','twins','bridge','transfer','duckjump','traffic','spring','boost','rings','glide'];
export function dailySeed(date=new Date()){return date.getFullYear()*10000+(date.getMonth()+1)*100+date.getDate();}
function rng(seed){let a=seed>>>0;return()=>{a=a+0x6d2b79f5>>>0;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
export function dailyPattern(seed,count=24){const rand=rng(seed),out=['slalom'];while(out.length<count){const pool=DAILY_KINDS.filter(k=>k!==out[out.length-1]&&(out.length>3||k!=='transfer'));out.push(pool[Math.floor(rand()*pool.length)]);}return out;}
export function buildDaily(seed,worlds){
 const world=seed%worlds.length,base=worlds[world],pattern=dailyPattern(seed),length=pattern.reduce((n,k)=>n+SIZES[k],800);
 const speedAt=x=>340+70*Math.min(1,Math.max(0,x)/length);
 const route={...base,speedAt,name:'每日挑战',en:'DAILY RIDE',worldName:base.name,tag:'每日 · 一条命',description:'每天一条新路线，越滑越快。摔倒即结束，挑战你的最远距离。',pattern,length,speed:340,hard:true};
 const level=buildChallenge(route,world);
 return {...level,daily:true,seed,checkpoints:[]};
}
