import test from 'node:test';import assert from 'node:assert/strict';import {Run,rateRun,RATING_STAR_SHARE} from '../dist/engine.js';
const finished=(stars,deaths)=>{const run=new Run(0);run.start();const need=Math.ceil(run.level.stars.length*stars);for(let i=0;i<need;i++)run.collected.add(i);run.deaths=deaths;run.state='won';return run;};
test('unfinished runs have no rating',()=>{const run=new Run(0);run.start();assert.equal(rateRun(run),0);run.crash();assert.equal(rateRun(run),0);});
test('rating rewards star share, then a clean run',()=>{assert.equal(rateRun(finished(0,0)),1);assert.equal(rateRun(finished(RATING_STAR_SHARE-.05,0)),1);assert.equal(rateRun(finished(RATING_STAR_SHARE,2)),2);assert.equal(rateRun(finished(RATING_STAR_SHARE,0)),3);assert.equal(rateRun(finished(1,0)),3);});
