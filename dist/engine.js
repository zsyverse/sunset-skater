export const ROUTES=[
 {name:'落日海岸',en:'SUNSET COAST',length:9000,speed:280,sky:['#f7ce9c','#fbe7b7'],sea:'#8eb9a5',far:'#8ba99a',hill:'#618b76',dark:'#2e5848'},
 {name:'橘子小镇',en:'TANGERINE TOWN',length:10500,speed:305,sky:['#eeb093','#f5d6a0'],sea:'#a2b6a0',far:'#b29b84',hill:'#897a5b',dark:'#4d6049'},
 {name:'蓝调山路',en:'BLUE HOUR',length:12000,speed:325,sky:['#546f8b','#b6b7b3'],sea:'#718e99',far:'#647e86',hill:'#496873',dark:'#263f49'}
];
export function makeLevel(index=0){
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
export function groundAt(level,x){if(level.gaps.some(g=>x>=g.x&&x<g.x+g.w))return null;let y=470;for(const r of level.ramps)if(x>=r.x&&x<=r.x+r.w)y-=Math.sin((x-r.x)/r.w*Math.PI)*r.h;return y;}
export class Run{
 constructor(index=0){this.level=makeLevel(index);this.reset();}
 reset(){this.x=160;this.y=470;this.vy=0;this.grounded=true;this.coyote=.1;this.charge=0;this.holding=false;this.duckHeld=false;this.rail=null;this.railLock=0;this.collected=new Set();this.cleared=new Set();this.score=0;this.combo=0;this.maxCombo=0;this.grindDistance=0;this.slideCount=0;this.checkpoint={x:160,stars:[],cleared:[],score:0,grindDistance:0,slideCount:0};this.state='ready';this.events=[];this.elapsed=0;this.deaths=0;this.airTime=0;this.landPulse=0;this.crashReason='';}
 start(){this.state='playing';}
 get grinding(){return this.rail!==null;}
 get sliding(){return this.duckHeld&&this.grounded&&!this.grinding;}
 get bodyHeight(){return this.sliding?51:118;}
 press(){if(this.state==='playing'&&(this.grounded||this.grinding||this.coyote>0)){this.holding=true;this.charge=0;}}
 release(){if(this.state!=='playing')return;if(this.holding&&(this.grounded||this.grinding||this.coyote>0)){this.vy=-(570+240*this.charge);this.grounded=false;this.rail=null;this.railLock=.18;this.coyote=0;this.airTime=0;this.events.push({type:'jump',charge:this.charge});}this.cancelJump();}
 setDuck(on){this.duckHeld=this.state==='playing'&&on;}
 cancelJump(){this.holding=false;this.charge=0;}
 cancelInput(){this.cancelJump();this.duckHeld=false;}
 pause(){if(this.state==='playing'){this.state='paused';this.cancelInput();}}
 resume(){if(this.state==='paused')this.state='playing';}
 retry(){this.x=this.checkpoint.x;this.y=groundAt(this.level,this.x)??470;this.vy=0;this.grounded=true;this.coyote=.1;this.rail=null;this.railLock=0;this.cancelInput();this.collected=new Set(this.checkpoint.stars);this.cleared=new Set(this.checkpoint.cleared||[]);this.score=this.checkpoint.score||0;this.grindDistance=this.checkpoint.grindDistance||0;this.slideCount=this.checkpoint.slideCount||0;this.combo=0;this.state='playing';this.events=[];this.airTime=0;}
 crash(reason='提前跳过地面障碍；连续箱阵可以借助上方栏杆通过。'){if(this.state!=='playing')return;this.state='crashed';this.deaths++;this.combo=0;this.crashReason=reason;this.cancelInput();this.events.push({type:'crash'});}
 reward(kind,id){if(this.cleared.has(id))return;this.cleared.add(id);this.combo++;this.maxCombo=Math.max(this.maxCombo,this.combo);const points=(kind==='grind'?150:50)*Math.min(5,this.combo);this.score+=points;if(kind==='slide')this.slideCount++;this.events.push({type:'clear',kind,points,combo:this.combo});}
 step(dt){
  if(this.state!=='playing')return;this.elapsed+=dt;this.landPulse=Math.max(0,this.landPulse-dt*4);this.railLock=Math.max(0,this.railLock-dt);if(this.holding)this.charge=Math.min(1,this.charge+dt/.55);
  const oldX=this.x,oldY=this.y;this.x+=this.level.speed*dt;const ground=groundAt(this.level,this.x);
  if(this.rail){this.grindDistance+=this.x-oldX;this.y=this.rail.y;this.vy=0;if(this.x>this.rail.x+this.rail.w){this.reward('grind',`rail-${this.rail.id}`);this.rail=null;this.grounded=false;this.coyote=.09;}}
  else if(this.grounded&&ground!==null){this.y=ground;this.coyote=.09;}
  else{
   if(this.grounded){this.grounded=false;this.coyote=.09;}
   this.coyote=Math.max(0,this.coyote-dt);this.vy+=1500*dt;this.y+=this.vy*dt;this.airTime+=dt;
   if(this.vy>=0&&this.railLock===0){for(const rail of this.level.rails){if(this.x>=rail.x-8&&this.x<=rail.x+rail.w&&oldY<=rail.y+6&&this.y>=rail.y){this.y=rail.y;this.vy=0;this.rail=rail;this.grounded=false;this.events.push({type:'grind'});break;}}}
   if(!this.rail&&ground!==null&&this.vy>=0&&oldY<=ground+8&&this.y>=ground){this.y=ground;this.vy=0;this.grounded=true;this.airTime=0;this.landPulse=1;this.events.push({type:'land'});}
  }
  if(this.y>680){this.crash('断崖需要提前蓄力，松开跳跃后再越过缺口。');return;}
  for(const o of this.level.obstacles){const gy=groundAt(this.level,o.x)??470;if(this.x+13>o.x&&this.x-13<o.x+o.w&&this.y>gy-o.h+5&&this.y-this.bodyHeight<gy){this.crash();return;}}
  for(const g of this.level.gates){if(this.x+14>g.x&&this.x-14<g.x+g.w&&this.y>g.top&&this.y-this.bodyHeight<g.bottom){this.crash('横杆和低枝要下蹲通过：按住 ↓ / S 或「滑行」，完全离开再松手。');return;}}
  for(const s of this.level.stars){if(!this.collected.has(s.id)&&Math.hypot(this.x-s.x,this.y-(this.sliding?25:42)-s.y)<44){this.collected.add(s.id);this.score+=10;this.events.push({type:'star',x:s.x,y:s.y});}}
  for(const h of this.level.hazards)if(oldX<h.x+h.w+16&&this.x>=h.x+h.w+16)this.reward(h.kind,h.id);
  for(const cp of this.level.checkpoints){if(oldX<cp&&this.x>=cp){this.checkpoint={x:cp,stars:[...this.collected],cleared:[...this.cleared],score:this.score,grindDistance:this.grindDistance,slideCount:this.slideCount};this.events.push({type:'checkpoint'});}}
  if(this.x>=this.level.length){this.x=this.level.length;this.state='won';this.cancelInput();this.events.push({type:'win'});}
 }
 get nextAction(){if(this.grinding)return {kind:'grinding',distance:0};const rail=this.level.rails.find(r=>r.x>this.x+15&&r.x-this.x<470);const h=this.level.hazards.find(h=>h.x+h.w+16>this.x&&!this.cleared.has(h.id));if(rail&&(!h||rail.x<h.x))return{kind:'rail',distance:Math.max(0,Math.round((rail.x-this.x)/10))};return h?{kind:h.kind,distance:Math.max(0,Math.round((h.x-this.x)/10))}:null;}
 get distance(){return Math.max(0,Math.floor((this.x-160)/10));}
 get progress(){return Math.max(0,(this.x-160)/(this.level.length-160));}
}
