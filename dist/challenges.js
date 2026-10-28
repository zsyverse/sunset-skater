const SIZES={slalom:2000,twins:2200,bridge:2400,transfer:2800,duckjump:2200,traffic:2600};
const configs=[
 {name:'天台连跳',en:'ROOFTOP RUSH',speed:350,tag:'高难 · 连跳',description:'闸门、滚胎与连跳，停、跳、低头交替。',pattern:['traffic','slalom','twins','duckjump','twins','slalom','bridge'],sky:['#d88d7b','#f2c7a0'],sea:'#a49b94',far:'#aa8881',hill:'#7a7770',dark:'#424e48',urban:true},
 {name:'断桥飞跃',en:'BROKEN BRIDGES',speed:365,tag:'专家 · 断桥',description:'九十米断桥，只能借滑杆凌空穿越。',pattern:['twins','traffic','bridge','duckjump','bridge','twins','bridge'],sky:['#8bafae','#d3d9bb'],sea:'#78a4a0',far:'#759493',hill:'#4d7779',dark:'#294e54'},
 {name:'霓虹穿梭',en:'NEON GAUNTLET',speed:380,tag:'大师 · 变招',description:'先过摆锤，再接低头与起跳的连续组合。',pattern:['traffic','duckjump','slalom','twins','duckjump','bridge','duckjump','slalom'],sky:['#575379','#b1869c'],sea:'#777e99',far:'#6e7395',hill:'#515c7d',dark:'#303b58',night:true,urban:true},
 {name:'空中换杆',en:'SKYLINE TRANSFER',speed:395,tag:'疯狂 · 换杆',description:'在杆尾重新起跳，飞过两根杆间的缺口。',pattern:['bridge','traffic','transfer','twins','transfer','duckjump','transfer'],sky:['#596f87','#a8b8bc'],sea:'#6c919c',far:'#658b98',hill:'#486d7a',dark:'#274a5e',night:true,urban:true},
 {name:'极限终章',en:'NO ROOM FOR ERROR',speed:410,tag:'极限 · 全组合',description:'最快速度、长断桥与空中接力，一口气拿下。',pattern:['traffic','duckjump','twins','transfer','slalom','bridge','transfer','duckjump','twins'],sky:['#735c78','#d8948a'],sea:'#968394',far:'#8d7788',hill:'#695e7b',dark:'#403f60',night:true,urban:true}
];
export const CHALLENGES=configs.map(r=>({...r,length:r.pattern.reduce((n,k)=>n+SIZES[k],800),hard:true}));
export function buildChallenge(route,index){
 const gaps=[],obstacles=[],gates=[],rails=[],stars=[],sections=[],checkpoints=[],movers=[];
 const star=(x,y)=>stars.push({id:stars.length,x,y});
 const obstacle=(x,w=90,h=60)=>{obstacles.push({x,w,h,type:'crate'});for(let j=0;j<4;j++)star(x-90+j*70,365-Math.sin(j*Math.PI/3)*55);};
 const gate=(x,w=180)=>{gates.push({x,w,bottom:409,top:235,type:'barrier'});for(let j=20;j<w;j+=45)star(x+j,445);};
 const gap=(x,w)=>{gaps.push({x,w});if(w<400)for(let j=0;j<5;j++)star(x-70+j*(w+140)/4,355-Math.sin(j*Math.PI/4)*60);};
 const rail=(x,w,y=380,transfer=false)=>{const r={id:rails.length,x,w,y,transfer};rails.push(r);for(let j=60;j<w;j+=95)star(x+j,y-45);return r;};
 let b=400;
 route.pattern.forEach((kind,i)=>{
  sections.push({kind,x:b,w:SIZES[kind]});
  if(kind==='traffic'){movers.push({id:`move-${i}-gate`,type:'shutter',x:b+450,w:70,phase:i*.7},{id:`move-${i}-tire`,type:'tire',x:b+1100,phase:i*.9},{id:`move-${i}-swing`,type:'swing',x:b+1700,phase:i*.4});gate(b+2200,160);for(let j=0;j<4;j++)star(b+1000+j*70,355-Math.sin(j*Math.PI/3)*45);}
  if(kind==='slalom'){obstacle(b+350,105);gate(b+900,150);obstacle(b+1380,120,70);}
  if(kind==='twins'){gap(b+400,210);gap(b+880,210);gate(b+1650,200);}
  if(kind==='bridge'){gap(b+700,900);rail(b+550,1120);gate(b+1980,180);}
  if(kind==='transfer'){gap(b+650,1450);rail(b+500,600,380,true);rail(b+1340,850,350);gate(b+2500,160);}
  if(kind==='duckjump'){gate(b+350,200);obstacle(b+740,80);gate(b+1190,200);obstacle(b+1580,100);}
  b+=SIZES[kind];if((i+1)%2===0&&i<route.pattern.length-1)checkpoints.push(b);
 });
 const hazards=[...obstacles.map(o=>({...o,kind:'jump'})),...gaps.map(o=>({...o,kind:'gap'})),...gates.map(o=>({...o,kind:'slide'})),...movers.map(o=>({x:o.type==='shutter'?o.x:o.x-(o.type==='tire'?100:160),w:o.type==='shutter'?o.w:o.type==='tire'?200:320,kind:o.type,moverId:o.id}))].sort((a,b)=>a.x-b.x).map((o,id)=>({...o,id}));
 return {...route,index,block:0,gaps,obstacles,gates,rails,stars,sections,checkpoints,movers,ramps:[],hazards};
}
