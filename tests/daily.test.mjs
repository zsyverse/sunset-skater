import test from 'node:test';import assert from 'node:assert/strict';import {Run,ROUTES} from '../dist/engine.js';import {buildDaily,dailyPattern,dailySeed} from '../dist/challenges.js';import {movingPose} from '../dist/movers.js';
import {replay} from './replay.mjs';
test('daily seed is the calendar date and the pattern is deterministic',()=>{assert.equal(dailySeed(new Date(2026,10,4)),20261104);assert.deepEqual(dailyPattern(20261104),dailyPattern(20261104));assert.notDeepEqual(dailyPattern(20261104),dailyPattern(20261105));const p=dailyPattern(7);assert.equal(p[0],'slalom');for(let i=1;i<p.length;i++)assert.notEqual(p[i],p[i-1]);});
test('daily level has no checkpoints, speeds up and uses a real world',()=>{const l=buildDaily(20261104,ROUTES);assert.equal(l.daily,true);assert.deepEqual(l.checkpoints,[]);assert(l.index>=0&&l.index<8);assert(l.speedAt(l.length)>l.speedAt(0));const r=new Run(l);assert.equal(r.level,l);assert.equal(r.speed,l.speedAt(160));});
for(const seed of [20261104,20261231,20270101,20270615,20280229,1234567,20261108,20261111,20261117,20261203,20270330,20270909])test(`daily ${seed} is finishable with real inputs`,()=>{
 const r=new Run(buildDaily(seed,ROUTES));r.start();replay(r);
 assert.equal(r.state,'won',`x=${r.x.toFixed(0)} ${r.crashReason}`);
});
