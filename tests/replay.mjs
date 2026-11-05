// Shared authored input replays: press/release/duck/brake like a player, no teleporting.
import {movingPose} from '../dist/movers.js';
export const SCRIPTS={
 traffic:[[770,'press'],[960,'release'],[1500,'duck'],[1910,'stand'],[2150,'duck'],[2390,'stand']],
 slalom:[[100,'press'],[250,'release'],[850,'duck'],[1080,'stand'],[1120,'press'],[1280,'release']],
 twins:[[140,'press'],[310,'release'],[730,'press'],[820,'release'],[1600,'duck'],[1880,'stand']],
 bridge:[[220,'press'],[430,'release'],[1930,'duck'],[2190,'stand']],
 transfer:[[220,'press'],[430,'release'],[850,'press'],[1060,'release'],[2450,'duck'],[2690,'stand']],
 duckjump:[[300,'duck'],[575,'stand'],[585,'press'],[650,'release'],[1140,'duck'],[1415,'stand'],[1420,'press'],[1490,'release']]
};
export function replay(r,{maxSeconds=400,skip=()=>false}={}){
 const inputs=r.level.sections.flatMap(s=>(s.script||SCRIPTS[s.kind]).map(([x,action])=>({x:x+s.x,action}))).filter(i=>!skip(i)).sort((a,b)=>a.x-b.x);
 let cursor=0,steps=0;const committed=new Set(),seen={grind:0,checkpoint:0,spring:0,boost:0,ring:0,airjump:0,item:0,shield:0};
 while(r.state==='playing'&&steps++<120*maxSeconds){const door=r.level.movers?.find(m=>m.type==='shutter'&&m.x-r.x<230&&r.x<m.x-30&&!committed.has(m.id));if(door){const pose=movingPose(door,r.elapsed);if(pose.open&&pose.remaining>1.4){committed.add(door.id);r.setBrake(false);}else r.setBrake(true);}else r.setBrake(false);
  while(cursor<inputs.length&&r.x>=inputs[cursor].x){const input=inputs[cursor++];if(input.action==='duck')r.setDuck(true);else if(input.action==='stand')r.setDuck(false);else r[input.action]();}
  r.step(1/120);for(const e of r.events)if(e.type in seen)seen[e.type]++;r.events=[];}
 return seen;
}
