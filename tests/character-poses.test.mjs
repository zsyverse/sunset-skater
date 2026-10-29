import test from 'node:test';
import assert from 'node:assert/strict';
import {poseFor,POSES} from '../dist/character-poses.js';
test('game actions choose distinct facial expressions',()=>{
 const inputs=[{}, {holding:true}, {air:true}, {sliding:true}, {grinding:true}, {braking:true}, {land:1}, {crashed:true}, {won:true}];
 assert.deepEqual(inputs.map(o=>poseFor(o).id),POSES.map(p=>p.id));
});
test('result and movement priorities prevent stale expressions',()=>{
 assert.equal(poseFor({crashed:true,air:true,charge:1}).id,'crash');
 assert.equal(poseFor({won:true,air:true}).id,'win');
 assert.equal(poseFor({sliding:true,braking:true}).id,'slide');
 assert.equal(poseFor({air:true,braking:true}).id,'jump');
 assert.equal(poseFor({holding:true,grinding:true}).id,'charge');
 assert.equal(poseFor({land:.1}).id,'ride');
});
test('ducking sprite fits the existing low obstacle clearance',()=>{
 assert.ok(POSES.find(p=>p.id==='slide').height+12<=51);
 assert.ok(POSES.every(p=>p.height+12<=118));
});
