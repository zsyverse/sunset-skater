import {movingPose} from '../dist/movers.js';
import test from 'node:test';import assert from 'node:assert/strict';import {Run,ROUTES,groundAt} from '../dist/engine.js';
// Authored input replays use the same press/release actions as a player; no teleporting or bypassing collisions.
import {replay} from './replay.mjs';
for(let index=3;index<8;index++)test(`challenge ${index+1}: ${ROUTES[index].name} is finishable with real inputs`,()=>{
 const r=new Run(index);r.start();const seen=replay(r),landings=seen.grind,cps=seen.checkpoint;
 assert.equal(r.state,'won',`x=${r.x.toFixed(0)}, y=${r.y.toFixed(0)}: ${r.crashReason}`);assert.equal(cps,r.level.checkpoints.length);assert(landings>=r.level.rails.length);assert(r.slideCount>=6);assert(r.collected.size>30);
});
test('all challenge checkpoints are safe, reachable restart surfaces',()=>{for(let i=3;i<ROUTES.length;i++){const r=new Run(i);for(const cp of r.level.checkpoints){assert.equal(groundAt(r.level,cp),470);assert(!r.level.hazards.some(h=>cp>h.x-50&&cp<h.x+h.w+50));r.checkpoint={x:cp,stars:[]};r.retry();assert.equal(r.state,'playing');assert.equal(r.y,470);}}});
test('long bridges cannot be cleared by a normal jump and transfers have real gaps',()=>{const r=new Run(6);assert(r.level.gaps.some(g=>g.w>1400));for(const rail of r.level.rails.filter(r=>r.transfer)){const next=r.level.rails.find(n=>n.x>rail.x+rail.w);assert(next.x-(rail.x+rail.w)>=200);}assert(ROUTES[7].speed>ROUTES[2].speed);});
