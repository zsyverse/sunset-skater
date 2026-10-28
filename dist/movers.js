// One deterministic clock drives both visible motion and collision geometry.
export function movingPose(obstacle,time){
 const phase=time+(obstacle.phase||0);
 if(obstacle.type==='shutter'){
  const t=((phase%4.8)+4.8)%4.8;
  const lift=t<1.8?0:t<2.2?(t-1.8)/.4:t<4.4?1:1-(t-4.4)/.4;
  return {shape:'rect',x:obstacle.x,y:220,w:obstacle.w,h:250-lift*170,bottom:470-lift*170,open:t>=2.2&&t<4.4,remaining:t>=2.2&&t<4.4?4.4-t:0,untilOpen:t<2.2?2.2-t:7-t};
 }
 if(obstacle.type==='tire')return {shape:'circle',x:obstacle.x+Math.sin(phase*2)*70,y:444,r:26,rotation:Math.sin(phase*2)*70/26};
 const angle=Math.sin(phase*1.7)*.78;
 return {shape:'circle',x:obstacle.x+Math.sin(angle)*180,y:190+Math.cos(angle)*180,r:27,pivotX:obstacle.x,pivotY:190};
}
export function movingHit(pose,player){
 const left=player.x-13,right=player.x+13,top=player.y-player.bodyHeight,bottom=player.y;
 if(pose.shape==='rect')return right>pose.x&&left<pose.x+pose.w&&bottom>pose.y&&top<pose.bottom;
 const dx=pose.x-Math.max(left,Math.min(right,pose.x)),dy=pose.y-Math.max(top,Math.min(bottom,pose.y));
 return dx*dx+dy*dy<pose.r*pose.r;
}
