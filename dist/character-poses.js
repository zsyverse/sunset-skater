export const POSES=[
 {id:'ride',name:'轻松滑行',emotion:'笑着出发',height:106},
 {id:'charge',name:'认真蓄力',emotion:'我要起飞啦',height:100},
 {id:'jump',name:'兴奋起跳',emotion:'芜湖，起飞！',height:106},
 {id:'slide',name:'搞怪低头',emotion:'嘿嘿，溜过去',height:38},
 {id:'grind',name:'得意滑杆',emotion:'这波稳了',height:102},
 {id:'brake',name:'惊讶刹车',emotion:'等一下！',height:106},
 {id:'land',name:'安心落地',emotion:'呼，稳稳落地',height:98},
 {id:'crash',name:'晕乎乎摔倒',emotion:'我是谁，我在哪',height:90},
 {id:'win',name:'开心通关',emotion:'耶！我做到了',height:106}
];
export function poseFor({crashed=false,won=false,sliding=false,air=false,holding=false,charge=0,grinding=false,braking=false,land=0}={}){
 const id=crashed?'crash':won?'win':sliding?'slide':air?'jump':holding||charge>.015?'charge':braking?'brake':grinding?'grind':land>.15?'land':'ride';
 return POSES.find(p=>p.id===id);
}
