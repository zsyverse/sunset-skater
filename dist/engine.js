export const ROUTES=[
 {name:'落日海岸',en:'SUNSET COAST',length:9000,speed:280,sky:['#f7ce9c','#fbe7b7'],sea:'#8eb9a5',far:'#8ba99a',hill:'#618b76',dark:'#2e5848'},
 {name:'橘子小镇',en:'TANGERINE TOWN',length:10500,speed:305,sky:['#eeb093','#f5d6a0'],sea:'#a2b6a0',far:'#b29b84',hill:'#897a5b',dark:'#4d6049'},
 {name:'蓝调山路',en:'BLUE HOUR',length:12000,speed:325,sky:['#546f8b','#b6b7b3'],sea:'#718e99',far:'#647e86',hill:'#496873',dark:'#263f49'}
];
export function makeLevel(index=0){const r=ROUTES[index],block=r.length/3;const gaps=[],obstacles=[],ramps=[],stars=[];for(let i=0;i<3;i++){
 const b=i*block;
 gaps.push({x:b+1350,w:135+index*25});
 for(const offset of [830,2070,block-250])obstacles.push({x:b+offset,w:38+index*6,h:42+index*7,type:offset===2070?'crate':'cone'});
 ramps.push({x:b+2300,w:350,h:65+index*12});
 const starArc=(x,w,h,n)=>{for(let j=0;j<n;j++)stars.push({id:stars.length,x:x+j*w/(n-1),y:470-h-Math.sin(j/(n-1)*Math.PI)*54});};
 starArc(b+710,260,70,4);starArc(b+1250,350,80,5);starArc(b+1950,270,80,4);
 stars.push({id:stars.length,x:b+2600,y:350},{id:stars.length+1,x:b+2700,y:335});
 }
 return {...r,index,block,gaps,obstacles,ramps,stars,checkpoints:[block,block*2]};}
export function groundAt(level,x){if(level.gaps.some(g=>x>=g.x&&x<g.x+g.w))return null;let y=470;for(const r of level.ramps){if(x>=r.x&&x<=r.x+r.w)y-=Math.sin((x-r.x)/r.w*Math.PI)*r.h;}return y;}
export class Run {
 constructor(index=0){this.level=makeLevel(index);this.reset();}
 reset(){this.x=160;this.y=470;this.vy=0;this.grounded=true;this.coyote=.1;this.charge=0;this.holding=false;this.collected=new Set();this.checkpoint={x:160,stars:[]};this.state='ready';this.events=[];this.elapsed=0;this.deaths=0;this.airTime=0;this.landPulse=0;}
 start(){this.state='playing';}
 press(){if(this.state==='playing'&&(this.grounded||this.coyote>0)){this.holding=true;this.charge=0;}}
 release(){if(this.state!=='playing')return;const canJump=this.grounded||this.coyote>0;if(this.holding&&canJump){this.vy=-(570+240*this.charge);this.grounded=false;this.coyote=0;this.airTime=0;this.events.push({type:'jump',charge:this.charge});}this.cancelInput();}
 cancelInput(){this.holding=false;this.charge=0;}
 pause(){if(this.state==='playing'){this.state='paused';this.cancelInput();}}
 resume(){if(this.state==='paused')this.state='playing';}
 retry(){this.x=this.checkpoint.x;this.y=groundAt(this.level,this.x)??470;this.vy=0;this.grounded=true;this.coyote=.1;this.cancelInput();this.collected=new Set(this.checkpoint.stars);this.state='playing';this.events=[];this.airTime=0;}
 crash(){if(this.state!=='playing')return;this.state='crashed';this.deaths++;this.cancelInput();this.events.push({type:'crash'});}
 step(dt){if(this.state!=='playing')return;this.elapsed+=dt;this.landPulse=Math.max(0,this.landPulse-dt*4);if(this.holding)this.charge=Math.min(1,this.charge+dt/.55);
 const oldX=this.x,oldY=this.y;this.x+=this.level.speed*dt;const ground=groundAt(this.level,this.x);
 if(this.grounded&&ground!==null){this.y=ground;this.coyote=.09;}else{
 if(this.grounded){this.grounded=false;this.coyote=.09;}
 this.coyote=Math.max(0,this.coyote-dt);this.vy+=1500*dt;this.y+=this.vy*dt;this.airTime+=dt;
 if(ground!==null&&this.vy>=0&&oldY<=ground+8&&this.y>=ground){this.y=ground;this.vy=0;this.grounded=true;this.airTime=0;this.landPulse=1;this.events.push({type:'land'});}
 }
 if(this.y>680){this.crash();return;}
 for(const o of this.level.obstacles){const gy=groundAt(this.level,o.x)??470;if(this.x+13>o.x&&this.x-13<o.x+o.w&&this.y>gy-o.h+5&&this.y-64<gy){this.crash();return;}}
 for(const s of this.level.stars){if(!this.collected.has(s.id)&&Math.hypot(this.x-s.x,this.y-42-s.y)<47){this.collected.add(s.id);this.events.push({type:'star',x:s.x,y:s.y});}}
 for(const cp of this.level.checkpoints){if(oldX<cp&&this.x>=cp){this.checkpoint={x:cp,stars:[...this.collected]};this.events.push({type:'checkpoint'});}}
 if(this.x>=this.level.length){this.x=this.level.length;this.state='won';this.cancelInput();this.events.push({type:'win'});}
 }
 get distance(){return Math.max(0,Math.floor((this.x-160)/10));}
 get progress(){return Math.max(0,(this.x-160)/(this.level.length-160));}
}
