import test from 'node:test';import assert from 'node:assert/strict';
import {Run,JUMP_BUFFER,fallReason,obstacleReason} from '../dist/engine.js';
const advance=(r,seconds)=>{for(let i=0;i<Math.round(seconds*120);i++)r.step(1/120);};
// Drop the rider from a small height on flat road; returns seconds until landing.
const falling=()=>{const r=new Run(0);r.start();r.x=300;r.y=440;r.vy=0;r.grounded=false;r.coyote=0;return r;};
const untilLanded=r=>{let n=0;r.events=[];while(!r.events.some(e=>e.type==='land')&&n++<240)r.step(1/120);return n/120;};

test('a press held through landing starts charging on touchdown, release jumps',()=>{
 const r=falling();r.press();assert.equal(r.holding,false,'cannot charge in the air');
 untilLanded(r);assert(r.holding,'charge starts on landing');advance(r,.3);assert(r.charge>.4);
 r.release();assert(r.vy<-570,'charged jump');assert.equal(r.grounded,false);
});

test('a quick tap just before landing still jumps; an early tap does not',()=>{
 const late=falling();late.vy=300;let t=0;while(late.y<466&&t++<200)late.step(1/120);
 late.press();late.release();assert.equal(late.vy>0,true,'still falling, no air jump');
 untilLanded(late);assert(late.vy<0,'buffered tap fired on landing');
 const early=falling();early.y=200;early.press();early.release();advance(early,JUMP_BUFFER+.05);
 untilLanded(early);assert.equal(early.grounded,true,'stale tap is dropped');assert.equal(early.vy,0);
});

test('a press just before touching a ring becomes the air jump',()=>{
 const r=new Run(9);r.start();const ring=r.level.rings[0];
 r.x=ring.x-70;r.y=ring.y+55;r.vy=0;r.grounded=false;r.coyote=0;r.press();
 let n=0;while(!r.usedRings.has(ring.id)&&n++<60)r.step(1/120);
 assert(r.usedRings.has(ring.id));assert(r.holding,'ring touch turns the held press into a charge');
 r.release();assert(r.vy<0);assert.equal(r.airJumps,0);
});

test('presses inside an updraft are for climbing and never queue a jump',()=>{
 const r=new Run(10);r.start();const u=r.level.updrafts[0];r.x=u.x+300;r.y=350;r.grounded=false;r.coyote=0;
 r.press();assert.equal(r.queued,false);
});

test('crash advice matches the hazard',()=>{
 const l0=new Run(0).level;assert.match(fallReason(l0,l0.gaps[0].x+20),/蓄力/);
 const bridge=new Run(4).level,long=bridge.gaps.find(g=>g.w>800);assert.match(fallReason(bridge,long.x+300),/栏杆/);
 const transfer=new Run(6).level,tg=transfer.gaps.find(g=>g.w>1400);assert.match(fallReason(transfer,tg.x+700),/杆尾/);
 const rings=new Run(9).level,rg=rings.gaps.find(g=>rings.rings.some(r=>r.x>=g.x-80&&r.x<=g.x+g.w));assert.match(fallReason(rings,rg.x+100),/光环/);
 const boost=new Run(8).level,bg=boost.gaps.find(g=>g.w===480);assert.match(fallReason(boost,bg.x+100),/加速带/);
 assert.match(obstacleReason(boost,boost.obstacles.find(o=>o.type==='wall')),/弹簧/);
 assert.match(obstacleReason(l0,l0.obstacles.find(o=>o.type==='crate'&&l0.rails.some(r=>o.x>=r.x&&o.x<=r.x+r.w))),/栏杆/);
});

test('falling into a twin gap on a hard level no longer blames the bridge rails',()=>{
 const r=new Run(3);r.start();const g=r.level.gaps[0];r.x=g.x-5;advance(r,1.5);
 assert.equal(r.state,'crashed');assert.doesNotMatch(r.crashReason,/栏杆|杆尾/);
});
