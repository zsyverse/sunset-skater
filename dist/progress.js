// Career profile: lifetime totals, achievements, unlock order and daily bests.
// Pure functions so the browser layer only loads/saves JSON.
export const LEVEL_COUNT=12;
// Season 2 (levels 9–12) opens once the basics (level 3) are cleared.
export const SEASON_TWO=8,SEASON_TWO_GATE=2;
export function emptyProfile(){return {totals:{runs:0,clears:0,jumps:0,grinds:0,stars:0,deaths:0,distance:0,springs:0,rings:0},achievements:{},daily:{}};}
export function normalizeProfile(raw){
 const base=emptyProfile();if(!raw||typeof raw!=='object'||Array.isArray(raw))return base;
 for(const k of Object.keys(base.totals))base.totals[k]=Math.max(0,Number(raw.totals?.[k])||0);
 if(raw.achievements&&typeof raw.achievements==='object')for(const [k,v] of Object.entries(raw.achievements))if(ACHIEVEMENTS.some(a=>a.id===k))base.achievements[k]=Number(v)||1;
 if(raw.daily&&typeof raw.daily==='object')for(const [k,v] of Object.entries(raw.daily))if(/^\d+$/.test(k)&&v&&typeof v==='object')base.daily[k]={distance:Math.max(0,Number(v.distance)||0),score:Math.max(0,Number(v.score)||0),stars:Math.max(0,Number(v.stars)||0)};
 return base;
}
export function unlockRequirement(index){return index===0?null:index===SEASON_TWO?SEASON_TWO_GATE:index-1;}
export function isUnlocked(records,index){const need=unlockRequirement(index);return need===null||!!records?.[need]?.completed;}
export function bestDaily(profile){return Object.values(profile.daily).reduce((m,d)=>Math.max(m,d.distance),0);}
/** Store a daily result; returns true when it beats today's best distance. */
export function recordDaily(profile,seed,{distance,score,stars}){const old=profile.daily[seed];const better=!old||distance>old.distance;profile.daily[seed]={distance:Math.max(old?.distance||0,distance),score:Math.max(old?.score||0,score),stars:Math.max(old?.stars||0,stars)};const keys=Object.keys(profile.daily).sort();while(keys.length>60)delete profile.daily[keys.shift()];return better;}
const cleared=r=>Object.keys(r||{}).filter(k=>r[k]?.completed&&Number(k)<LEVEL_COUNT).length;
const rated=r=>Object.keys(r||{}).filter(k=>Number(r[k]?.rating)>=3&&Number(k)<LEVEL_COUNT).length;
export const ACHIEVEMENTS=[
 {id:'first-clear',icon:'☀',name:'第一次追上日落',desc:'通关任意一关',check:c=>cleared(c.records)>=1},
 {id:'three-star',icon:'★',name:'完美一程',desc:'任意关卡拿到三星',check:c=>rated(c.records)>=1},
 {id:'combo-10',icon:'≈',name:'心流 ×10',desc:'单次连击达到 10',check:c=>(c.run?.maxCombo||0)>=10},
 {id:'combo-25',icon:'∞',name:'停不下来',desc:'单次连击达到 25',check:c=>(c.run?.maxCombo||0)>=25},
 {id:'grinder',icon:'═',name:'滑杆老手',desc:'累计完成 30 次滑杆',check:c=>c.profile.totals.grinds>=30},
 {id:'hard-clean',icon:'◎',name:'冷静大师',desc:'零失误通关第 4 关或之后的任意一关',check:c=>c.run?.state==='won'&&!c.run.level.daily&&c.run.level.index>=3&&c.run.deaths===0},
 {id:'halfway',icon:'◐',name:'半程风景',desc:'通关前 4 关',check:c=>[0,1,2,3].every(i=>c.records?.[i]?.completed)},
 {id:'all-clear',icon:'✈',name:'环游十二个世界',desc:'通关全部 12 关',check:c=>cleared(c.records)>=LEVEL_COUNT},
 {id:'all-stars',icon:'✦',name:'满天星',desc:'全部 12 关拿到三星',check:c=>rated(c.records)>=LEVEL_COUNT},
 {id:'season-two',icon:'❀',name:'第二季毕业',desc:'通关第二季全部 4 关',check:c=>[8,9,10,11].every(i=>c.records?.[i]?.completed)},
 {id:'spring-20',icon:'⤒',name:'弹簧飞人',desc:'累计被弹簧弹射 20 次',check:c=>c.profile.totals.springs>=20},
 {id:'ring-chain',icon:'◎',name:'空中三连',desc:'一次腾空连续空中跳 3 次',check:c=>(c.run?.maxAirChain||0)>=3},
 {id:'shield-save',icon:'⛨',name:'护盾救我',desc:'被护盾挡下一次碰撞',check:c=>(c.run?.shieldSaves||0)>=1},
 {id:'daily-1k',icon:'⌁',name:'每日一公里',desc:'每日挑战滑出 1,000 m',check:c=>bestDaily(c.profile)>=1000},
 {id:'daily-3k',icon:'⚑',name:'晨跑传说',desc:'每日挑战滑出 3,000 m',check:c=>bestDaily(c.profile)>=3000},
 {id:'collector',icon:'✧',name:'星星收藏家',desc:'累计收集 1,000 颗星星',check:c=>c.profile.totals.stars>=1000},
 {id:'marathon',icon:'⟿',name:'马拉松滑手',desc:'累计滑行 42 km',check:c=>c.profile.totals.distance>=42000},
 {id:'never-give-up',icon:'♥',name:'摔倒也是练习',desc:'累计摔倒 50 次',check:c=>c.profile.totals.deaths>=50}
];
/** Mark newly earned achievements and return them (in list order). */
export function unlockAchievements(profile,ctx,now=Date.now()){const fresh=[];for(const a of ACHIEVEMENTS){if(profile.achievements[a.id])continue;let ok=false;try{ok=a.check({...ctx,profile});}catch{}if(ok){profile.achievements[a.id]=now;fresh.push(a);}}return fresh;}
