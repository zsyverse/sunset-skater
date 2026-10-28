import {movingPose} from '../dist/movers.js';
import test from 'node:test';import assert from 'node:assert/strict';import {Run,ROUTES,groundAt} from '../dist/engine.js';
// Authored input replays use the same press/release actions as a player; no teleporting or bypassing collisions.
const scripts={
 traffic:[[770,'press'],[960,'release'],[1500,'duck'],[1910,'stand'],[2150,'duck'],[2390,'stand']],
 slalom:[[100,'press'],[250,'release'],[850,'duck'],[1080,'stand'],[1120,'press'],[1280,'release']],
 twins:[[140,'press'],[310,'release'],[730,'press'],[820,'release'],[1600,'duck'],[1880,'stand']],
 bridge:[[220,'press'],[430,'release'],[1930,'duck'],[2190,'stand']],
 transfer:[[220,'press'],[430,'release'],[850,'press'],[1060,'release'],[2450,'duck'],[2690,'stand']],
 duckjump:[[300,'duck'],[575,'stand'],[585,'press'],[650,'release'],[1140,'duck'],[1415,'stand'],[1420,'press'],[1490,'release']]
};
for(let index=3;index<ROUTES.length;index++)test(`challenge ${index+1}: ${ROUTES[index].name} is finishable with real inputs`,()=>{
 const r=new Run(index);r.start();const inputs=r.level.sections.flatMap(s=>scripts[s.kind].map(([x,action])=>({x:x+s.x,action})));let cursor=0,steps=0,landings=0,cps=0;const committed=new Set();
 while(r.state==='playing'&&steps++<120*140){const door=r.level.movers?.find(m=>m.type==='shutter'&&m.x-r.x<230&&r.x<m.x-30&&!committed.has(m.id));if(door){const pose=movingPose(door,r.elapsed);if(pose.open&&pose.remaining>1.4){committed.add(door.id);r.setBrake(false);}else r.setBrake(true);}else r.setBrake(false);while(cursor<inputs.length&&r.x>=inputs[cursor].x){const input=inputs[cursor++];if(input.action==='duck')r.setDuck(true);else if(input.action==='stand')r.setDuck(false);else {if(input.action==='press')assert(r.grounded||r.grinding||r.coyote>0,`cannot charge at x=${r.x}, y=${r.y}`);r[input.action]();}}r.step(1/120);landings+=r.events.filter(e=>e.type==='grind').length;cps+=r.events.filter(e=>e.type==='checkpoint').length;r.events=[];}
 assert.equal(r.state,'won',`x=${r.x.toFixed(0)}, y=${r.y.toFixed(0)}: ${r.crashReason}`);assert.equal(cps,r.level.checkpoints.length);assert(landings>=r.level.rails.length);assert(r.slideCount>=6);assert(r.collected.size>30);
});
test('all challenge checkpoints are safe, reachable restart surfaces',()=>{for(let i=3;i<ROUTES.length;i++){const r=new Run(i);for(const cp of r.level.checkpoints){assert.equal(groundAt(r.level,cp),470);assert(!r.level.hazards.some(h=>cp>h.x-50&&cp<h.x+h.w+50));r.checkpoint={x:cp,stars:[]};r.retry();assert.equal(r.state,'playing');assert.equal(r.y,470);}}});
test('long bridges cannot be cleared by a normal jump and transfers have real gaps',()=>{const r=new Run(6);assert(r.level.gaps.some(g=>g.w>1400));for(const rail of r.level.rails.filter(r=>r.transfer)){const next=r.level.rails.find(n=>n.x>rail.x+rail.w);assert(next.x-(rail.x+rail.w)>=200);}assert(ROUTES[7].speed>ROUTES[2].speed);});
