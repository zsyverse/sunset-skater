export const CHARACTERS=[
 {id:'nailong',name:'奶龙',tag:'圆肚皮 · 快乐出发',src:'assets/characters/nailong.png',crop:[90,59,315,429],board:'#ea7942'},
 {id:'naiwa',name:'奶蛙',tag:'大眼睛 · 一起撒野',src:'assets/characters/naiwa.png',crop:[150,60,1015,1135],board:'#81b778'}
];
export function characterFor(id){return CHARACTERS.find(c=>c.id===id)||CHARACTERS[0];}
const pictures=new Map();
export async function loadCharacters(){await Promise.all(CHARACTERS.map(character=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{pictures.set(character.id,img);resolve();};img.onerror=()=>reject(new Error(`${character.name}素材加载失败`));img.src=character.src;})));}
export function drawCharacter(c,x,y,{character='nailong',charge=0,air=false,time=0,scale=1,crashed=false,land=0,sliding=false,grinding=false}={}){
 const config=characterFor(character),img=pictures.get(config.id);if(!img)return;
 c.save();c.translate(x,y-7);c.scale(scale,scale);
 if(crashed)c.rotate(-.65);else if(air)c.rotate(-.12+Math.sin(time*4)*.07);else if(grinding)c.rotate(.025*Math.sin(time*14));
 // Board remains a stable point of contact during crouch and squash animations.
 c.strokeStyle='#294b42';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(-35,-6);c.quadraticCurveTo(-28,1,0,0);c.quadraticCurveTo(28,1,35,-6);c.stroke();c.strokeStyle=config.board;c.lineWidth=3;c.stroke();
 for(const wx of [-22,22]){c.fillStyle='#fff0ce';c.beginPath();c.arc(wx,7,6,0,Math.PI*2);c.fill();c.strokeStyle='#375348';c.lineWidth=2;c.stroke();c.beginPath();c.moveTo(wx,7);c.lineTo(wx+Math.cos(time*18)*4,7+Math.sin(time*18)*4);c.stroke();}
 const bob=air?0:Math.sin(time*7)*1.1,compression=sliding?.36:Math.max(.72,1-charge*.19-land*.055-(grinding?.08:0));
 c.translate(sliding?8:0,-5+bob);c.scale(sliding?1.12:1+charge*.06,compression);
 const [sx,sy,sw,sh]=config.crop,h=106,w=h*sw/sh;c.drawImage(img,sx,sy,sw,sh,-w/2,-h,w,h);
 c.restore();
}
