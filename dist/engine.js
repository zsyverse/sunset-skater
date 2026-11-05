import {movingPose,movingHit} from './movers.js?v=14';
import {CHALLENGES,buildChallenge} from './challenges.js?v=14';
export const ROUTES=[
 {name:'落日海岸',en:'SUNSET COAST',length:9000,speed:280,sky:['#f7ce9c','#fbe7b7'],sea:'#8eb9a5',far:'#8ba99a',hill:'#618b76',dark:'#2e5848'},
 {name:'橘子小镇',en:'TANGERINE TOWN',length:10500,speed:305,sky:['#eeb093','#f5d6a0'],sea:'#a2b6a0',far:'#b29b84',hill:'#897a5b',dark:'#4d6049'},
 {name:'蓝调山路',en:'BLUE HOUR',length:12000,speed:325,sky:['#546f8b','#b6b7b3'],sea:'#718e99',far:'#647e86',hill:'#496873',dark:'#263f49'},
 ...CHALLENGES
];
export function makeLevel(index=0){
 if(index>=3)return buildChallenge(ROUTES[index],index);
 const r=ROUTES[index],block=r.length/3,gaps=[],obstacles=[],ramps=[],stars=[],gates=[],rails=[];
 const addStar=(x,y)=>stars.push({id:stars.length,x,y});
 const arc=(x,w,h,n)=>{for(let j=0;j<n;j++)addStar(x+j*w/(n-1),470-h-Math.sin(j/(n-1)*Math.PI)*54);};
 for(let i=0;i<3;i++){
  const b=i*block,cone=b+650+(i%2)*55,gap=b+1570+(i%2)*45;
  obstacles.push({x:cone,w:40,h:44,type:'cone'});
  if(index>0)obstacles.push({x:cone+80,w:40,h:44,type:'cone'});
  gates.push({x:b+1080,w:185+index*15,bottom:410,top:245,type:i%2?'branch':'barrier'});
  gaps.push({x:gap,w:140+index*20});
  ramps.push({x:b+1810,w:190,h:32});
  const rail={id:i,x:b+2080,w:490+index*35,y:380};rails.push(rail);
  for(let j=0;j<3;j++)obstacles.push({x:b+2200+j*125,w:45,h:50,type:j%2?'crate':'barrel'});
  gates.push({x:b+2780,w:135,bottom:410,top:245,type:'branch'});
  if(index>0)obstacles.push({x:b+3190,w:65,h:58,type:'crate'});
  if(index===2){gates.push({x:b+3590,w:180,bottom:410,top:245,type:'barrier'});}
  arc(cone-110,index>0?320:250,70,4);arc(gap-100,330,80,5);
  for(let j=0;j<4;j++)addStar(b+1110+j*40,445);
  arc(rail.x-120,230,100,4);for(let j=0;j<5;j++)addStar(rail.x+125+j*75,rail.y-45);
  for(let j=0;j<3;j++)addStar(b+2800+j*40,444);
 }
 const hazards=[...obstacles.map(o=>({...o,kind:'jump'})),...gaps.map(o=>({...o,kind:'gap'})),...gates.map(o=>({...o,kind:'slide'}))].sort((a,b)=>a.x-b.x).map((o,id)=>({...o,id}));
 return {...r,index,block,gaps,obstacles,ramps,stars,gates,rails,hazards,checkpoints:[block,block*2]};
}
export const JUMP_BUFFER=.15;
export const SPRING=1150,BOOST=1.6,BOOST_TIME=1.6,GLIDE_RISE=-300,GLIDE_FALL=240,GLIDE_RESPONSE=6,GLIDE_CEILING=150,RING_BODY=55,RING_REACH=52,MAGNET_TIME=8,MAGNET_REACH=170;
// Crash advice that matches what actually went wrong.
export function fallReason(level,x){
 const gap=level.gaps.find(g=>x>=g.x-60&&x<g.x+g.w+60)||level.gaps.filter(g=>g.x<=x).pop();
 if(!gap)return '断崖需要提前蓄力，松开跳跃后再越过缺口。';
 const over=level.rails.filter(r=>r.x<gap.x+gap.w&&r.x+r.w>gap.x);
 if(over.some(r=>r.transfer))return '断桥分两段：先跳上栏杆，在橙色杆尾再起跳一次，接到下一根杆。';
 if(over.length)return '这段断桥太长，直接跳不过去：起跳落到薄荷绿栏杆上，滑过去。';
 if((level.rings||[]).some(r=>r.x>=gap.x-80&&r.x<=gap.x+gap.w))return '碰到光环后再轻点一次跳跃，一环接一环飞过沙谷。';
 if((level.boosts||[]).some(b=>b.x+b.w<=gap.x&&gap.x-(b.x+b.w)<500))return '先冲上加速带，趁加速时长按蓄力，在断崖边松开。';
 if((level.springs||[]).some(s=>s.x+s.w<=gap.x&&gap.x-(s.x+s.w)<200))return '踩上橙色弹簧板会自动弹起，不要在弹簧前刹车或起跳。';
 return gap.w>=200?'断崖很宽：提前按住蓄力，到边缘再松开，跳得更远。':'断崖需要提前蓄力，松开跳跃后再越过缺口。';
}
export function obstacleReason(level,o){
 if(o.type==='wall')return '高墙跳不过去：踩上墙前的橙色弹簧板，自动弹过去。';
 if(level.index<3&&level.rails.some(r=>o.x>=r.x&&o.x<=r.x+r.w))return '连续箱阵要借助上方栏杆：提前起跳，落到薄荷绿栏杆上滑过去。';
 return o.h>=70?'这个箱子更高：长按蓄力再松开，跳得更高。':'提前一点起跳，越过地面障碍。轻点小跳，长按跳得更高。';
}
export function groundAt(level,x){if(level.gaps.some(g=>x>=g.x&&x<g.x+g.w))return null;let y=470;for(const r of level.ramps)if(x>=r.x&&x<=r.x+r.w)y-=Math.sin((x-r.x)/r.w*Math.PI)*r.h;return y;}
export class Run{
 constructor(index=0){this.level=typeof index==='object'?index:makeLevel(index);this.reset();}
 get baseSpeed(){return this.level.speedAt?this.level.speedAt(this.x):this.level.speed;}
 reset(){this.x=160;this.y=470;this.speed=this.baseSpeed;this.brakeHeld=false;this.vy=0;this.grounded=true;this.coyote=.1;this.charge=0;this.holding=false;this.duckHeld=false;this.rail=null;this.railLock=0;this.collected=new Set();this.cleared=new Set();this.score=0;this.combo=0;this.maxCombo=0;this.grindDistance=0;this.slideCount=0;this.checkpoint={x:160,stars:[],cleared:[],score:0,grindDistance:0,slideCount:0};this.state='ready';this.events=[];this.elapsed=0;this.deaths=0;this.airTime=0;this.landPulse=0;this.crashReason='';this.jumpHeld=false;this.airJumps=0;this.airChain=0;this.maxAirChain=0;this.boost=0;this.shield=false;this.invuln=0;this.magnet=0;this.shieldSaves=0;this.taken=new Set();this.usedRings=new Set();this.queued=false;this.queueAge=0;}
 start(){this.state='playing';}
 get grinding(){return this.rail!==null;}
 get sliding(){return this.duckHeld&&this.grounded&&!this.grinding;}
 get bodyHeight(){return this.sliding?51:118;}
 get gliding(){return !this.grounded&&!this.grinding&&!!this.updraft;}
 get updraft(){return (this.level.updrafts||[]).find(u=>this.x>=u.x&&this.x<u.x+u.w)||null;}
 get canJump(){return this.grounded||this.grinding||this.coyote>0||this.airJumps>0;}
 press(){if(this.state!=='playing')return;this.jumpHeld=true;if(this.canJump){this.holding=true;this.charge=0;}else if(!this.updraft){this.queued=true;this.queueAge=0;}}
 release(){this.jumpHeld=false;if(this.state!=='playing')return;if(this.holding&&this.canJump){if(!this.grounded&&!this.grinding&&this.coyote<=0){this.airJumps--;this.airChain++;this.maxAirChain=Math.max(this.maxAirChain,this.airChain);this.events.push({type:'airjump'});}this.vy=-(570+240*this.charge);this.grounded=false;this.rail=null;this.railLock=.18;this.coyote=0;this.airTime=0;this.events.push({type:'jump',charge:this.charge});}this.holding=false;this.charge=0;this.jumpHeld=false;}
 // Jump buffer: a press made shortly before landing, catching a rail or touching a ring is not lost.
 useQueue(){if(!this.queued||this.state!=='playing')return;this.queued=false;if(this.jumpHeld){this.holding=true;this.charge=0;}else if(this.queueAge<=JUMP_BUFFER){this.holding=true;this.charge=0;this.release();}}
 setBrake(on){this.brakeHeld=this.state==='playing'&&on;}
 setDuck(on){this.duckHeld=this.state==='playing'&&on;}
 cancelJump(){this.holding=false;this.charge=0;this.jumpHeld=false;this.queued=false;}
 cancelJumpCharge(){this.holding=false;this.charge=0;}
 cancelInput(){this.cancelJump();this.duckHeld=false;this.brakeHeld=false;}
 pause(){if(this.state==='playing'){this.state='paused';this.cancelInput();}}
 resume(){if(this.state==='paused')this.state='playing';}
 retry(){this.x=this.checkpoint.x;this.speed=this.baseSpeed;this.elapsed=this.checkpoint.elapsed||0;this.y=groundAt(this.level,this.x)??470;this.vy=0;this.grounded=true;this.coyote=.1;this.rail=null;this.railLock=0;this.cancelInput();this.collected=new Set(this.checkpoint.stars);this.cleared=new Set(this.checkpoint.cleared||[]);this.score=this.checkpoint.score||0;this.grindDistance=this.checkpoint.grindDistance||0;this.slideCount=this.checkpoint.slideCount||0;this.combo=0;this.state='playing';this.events=[];this.airTime=0;this.airJumps=0;this.airChain=0;this.boost=0;this.invuln=0;this.magnet=0;this.shield=!!this.checkpoint.shield;this.taken=new Set(this.checkpoint.taken||[]);this.usedRings=new Set();}
 crash(reason='提前跳过地面障碍；连续箱阵可以借助上方栏杆通过。'){if(this.state!=='playing')return;this.state='crashed';this.deaths++;this.combo=0;this.crashReason=reason;this.cancelInput();this.events.push({type:'crash'});}
 hit(reason){if(this.shield){this.shield=false;this.invuln=1.1;this.shieldSaves++;this.events.push({type:'shield'});return false;}this.crash(reason);return true;}
 reward(kind,id){if(this.cleared.has(id))return;this.cleared.add(id);this.combo++;this.maxCombo=Math.max(this.maxCombo,this.combo);const points=(kind==='grind'?150:50)*Math.min(5,this.combo);this.score+=points;if(kind==='slide')this.slideCount++;this.events.push({type:'clear',kind,points,combo:this.combo});}
 step(dt){
  if(this.state!=='playing')return;this.elapsed+=dt;this.landPulse=Math.max(0,this.landPulse-dt*4);this.railLock=Math.max(0,this.railLock-dt);this.boost=Math.max(0,this.boost-dt);this.invuln=Math.max(0,this.invuln-dt);this.magnet=Math.max(0,this.magnet-dt);if(this.holding)this.charge=Math.min(1,this.charge+dt/.55);if(this.queued){this.queueAge+=dt;if(!this.jumpHeld&&this.queueAge>JUMP_BUFFER)this.queued=false;}
  const oldX=this.x,oldY=this.y;if(this.grounded){const target=this.brakeHeld?0:this.baseSpeed*(this.boost>0?BOOST:1);this.speed+=Math.sign(target-this.speed)*Math.min(Math.abs(target-this.speed),2000*dt);}this.x+=this.speed*dt;const ground=groundAt(this.level,this.x);
  if(this.rail){this.grindDistance+=this.x-oldX;this.y=this.rail.y;this.vy=0;if(this.x>this.rail.x+this.rail.w){this.reward('grind',`rail-${this.rail.id}`);this.rail=null;this.grounded=false;this.coyote=.09;}}
  else if(this.grounded&&ground!==null){this.y=ground;this.coyote=.09;this.airJumps=0;this.airChain=0;
   for(const pad of this.level.boosts||[])if(this.x>=pad.x&&this.x<=pad.x+pad.w){if(this.boost<BOOST_TIME-.2)this.events.push({type:'boost'});this.boost=BOOST_TIME;}
   for(const sp of this.level.springs||[])if(this.x>=sp.x&&this.x<=sp.x+sp.w){this.vy=-SPRING;this.grounded=false;this.coyote=0;this.railLock=.18;this.airTime=0;this.cancelJumpCharge();this.events.push({type:'spring',x:sp.x+sp.w/2});break;}}
  else{
   if(this.grounded){this.grounded=false;this.coyote=.09;}
   this.coyote=Math.max(0,this.coyote-dt);const draft=this.updraft;if(draft){this.queued=false;const goal=this.jumpHeld&&!this.holding?GLIDE_RISE:GLIDE_FALL;this.vy+=(goal-this.vy)*Math.min(1,dt*GLIDE_RESPONSE);}else this.vy+=1500*dt;this.y+=this.vy*dt;if(draft&&this.y<GLIDE_CEILING){this.y=GLIDE_CEILING;this.vy=Math.max(0,this.vy);}this.airTime+=dt;
   for(const ring of this.level.rings||[])if(!this.usedRings.has(ring.id)&&Math.hypot(this.x-ring.x,this.y-RING_BODY-ring.y)<RING_REACH){this.usedRings.add(ring.id);this.airJumps=1;this.events.push({type:'ring',x:ring.x,y:ring.y});this.useQueue();}
   if(this.vy>=0&&this.railLock===0){for(const rail of this.level.rails){if(this.x>=rail.x-8&&this.x<=rail.x+rail.w&&oldY<=rail.y+6&&this.y>=rail.y){this.y=rail.y;this.vy=0;this.rail=rail;this.grounded=false;this.events.push({type:'grind'});this.useQueue();break;}}}
   if(!this.rail&&ground!==null&&this.vy>=0&&oldY<=ground+8&&this.y>=ground){this.y=ground;this.vy=0;this.grounded=true;this.airTime=0;this.landPulse=1;this.airJumps=0;this.airChain=0;this.events.push({type:'land'});this.useQueue();}
  }
  if(this.y>680){this.crash(this.updraft?'掉进气流底部了：在气流里按住跳跃就能上升。':fallReason(this.level,this.x));return;}
  if(this.invuln<=0)collide:{
  for(const o of this.level.obstacles){const gy=groundAt(this.level,o.x)??470;if(this.x+13>o.x&&this.x-13<o.x+o.w&&this.y>gy-o.h+5&&this.y-this.bodyHeight<gy){if(this.hit(obstacleReason(this.level,o)))return;break collide;}}
  for(const g of this.level.gates){if(this.x+14>g.x&&this.x-14<g.x+g.w&&this.y>g.top&&this.y-this.bodyHeight<g.bottom){if(this.hit('横杆和低枝要下蹲通过：按住 ↓ / S 或「滑行」，完全离开再松手。'))return;break collide;}}
  for(const b of this.level.blocks||[]){if(this.x+13>b.x&&this.x-13<b.x+b.w&&this.y>b.top&&this.y-this.bodyHeight<b.bottom){if(this.hit('气流里按住跳跃上升、松开缓降，从乌云的空隙穿过去。'))return;break collide;}}
  for(const m of this.level.movers||[]){if(movingHit(movingPose(m,this.elapsed),this)){if(this.hit({shutter:'闸门红灯时按住 ← / A 刹车，等绿灯再松开通过。不要在门下起跳。',tire:'滚动轮胎会来回移动，提前观察位置，再起跳越过。',swing:'摆锤会扫过站立高度，按住 ↓ / S 低头滑过，或刹车等它摆开。'}[m.type]))return;break collide;}}
 }
  for(const it of this.level.items||[]){if(!this.taken.has(it.id)&&Math.hypot(this.x-it.x,this.y-50-it.y)<46){this.taken.add(it.id);if(it.type==='shield')this.shield=true;else this.magnet=MAGNET_TIME;this.events.push({type:'item',item:it.type,x:it.x,y:it.y});}}
  for(const s of this.level.stars){if(!this.collected.has(s.id)&&Math.hypot(this.x-s.x,this.y-(this.sliding?25:42)-s.y)<(this.magnet>0?MAGNET_REACH:44)){this.collected.add(s.id);this.score+=10;this.events.push({type:'star',x:s.x,y:s.y});}}
  for(const h of this.level.hazards)if(oldX<h.x+h.w+16&&this.x>=h.x+h.w+16)this.reward(h.kind,h.id);
  for(const cp of this.level.checkpoints){if(oldX<cp&&this.x>=cp){this.checkpoint={x:cp,elapsed:this.elapsed,shield:this.shield,taken:[...this.taken],stars:[...this.collected],cleared:[...this.cleared],score:this.score,grindDistance:this.grindDistance,slideCount:this.slideCount};this.events.push({type:'checkpoint'});}}
  if(this.x>=this.level.length){this.x=this.level.length;this.state='won';this.cancelInput();this.events.push({type:'win'});}
 }
 get nextAction(){if(this.grinding)return this.rail.transfer?{kind:'transfer',distance:Math.max(0,Math.round((this.rail.x+this.rail.w-this.x)/10))}:{kind:'grinding',distance:0};const rail=this.level.rails.find(r=>r.x>this.x+15&&r.x-this.x<470);const h=this.level.hazards.find(h=>h.x+h.w+16>this.x&&!this.cleared.has(h.id));if(rail&&(!h||rail.x<h.x))return{kind:'rail',distance:Math.max(0,Math.round((rail.x-this.x)/10))};if(h?.moverId){const mover=this.level.movers.find(m=>m.id===h.moverId),pose=movingPose(mover,this.elapsed);return{kind:h.kind,distance:Math.max(0,Math.round((pose.x-this.x)/10)),open:pose.open,remaining:pose.remaining};}return h?{kind:h.kind,distance:Math.max(0,Math.round((h.x-this.x)/10))}:null;}
 get distance(){return Math.max(0,Math.floor((this.x-160)/10));}
 get progress(){return Math.max(0,(this.x-160)/(this.level.length-160));}
}
// Clear rating: 1 = finished, 2 = 70%+ stars, 3 = 70%+ stars with no falls.
export const RATING_STAR_SHARE=.7;
export function rateRun(run){if(run.state!=='won')return 0;const share=run.collected.size/Math.max(1,run.level.stars.length);if(share<RATING_STAR_SHARE)return 1;return run.deaths===0?3:2;}
