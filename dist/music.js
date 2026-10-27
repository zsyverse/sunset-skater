// Original 16-bar composition: soft electric piano, slow chords and a quiet bass.
// Scheduled against the audio clock, independently of render FPS.
export const TEMPO=78;
const CHORDS=[[48,52,55,59],[45,48,52,55],[41,45,48,52],[43,47,50,55],[48,52,55,59],[40,43,47,50],[41,45,48,52],[43,47,50,53],
 [45,48,52,55],[41,45,48,52],[48,52,55,59],[43,47,50,55],[41,45,48,52],[43,47,50,55],[48,52,55,59],[48,52,55,59]];
const MELODY=[[76,null,79,null,74,null,72,null],[72,null,76,79,null,76,72,null],[69,null,72,null,76,null,74,null],[71,null,74,76,null,74,67,null],
 [76,null,79,null,83,null,79,76],[74,null,71,null,67,null,71,null],[69,null,72,76,null,74,72,null],[71,null,74,null,77,76,74,null],
 [76,null,72,null,69,null,72,76],[77,null,76,null,72,null,69,null],[79,null,76,null,74,72,null,null],[74,null,71,null,67,null,71,74],
 [72,null,69,null,76,null,74,null],[71,null,74,null,79,null,77,74],[76,null,79,null,74,null,72,null],[72,null,null,null,null,null,null,null]];
export class GentleMusic{
 constructor({contextFactory=()=>new(globalThis.AudioContext||globalThis.webkitAudioContext)(),setTimer=(fn,ms)=>globalThis.setInterval(fn,ms),clearTimer=id=>globalThis.clearInterval(id),onStatus=()=>{}}={}){
  this.contextFactory=contextFactory;this.setTimer=setTimer;this.clearTimer=clearTimer;this.onStatus=onStatus;this.enabled=true;this.volume=.24;this.context=null;this.timer=null;this.step=0;this.nextTime=0;this.generation=0;this.requested=false;this.voices=new Set();this.status='ready';
 }
 notify(status){this.status=status;this.onStatus(status);}
 init(){if(this.context)return;const c=this.contextFactory();this.context=c;this.master=c.createGain();this.master.gain.value=0;this.master.connect(c.destination);this.filter=c.createBiquadFilter();this.filter.type='lowpass';this.filter.frequency.value=2400;this.filter.Q.value=.4;this.filter.connect(this.master);
  this.delay=c.createDelay(1);this.delay.delayTime.value=.29;this.feedback=c.createGain();this.feedback.gain.value=.18;this.wet=c.createGain();this.wet.gain.value=.15;this.filter.connect(this.delay);this.delay.connect(this.feedback);this.feedback.connect(this.delay);this.delay.connect(this.wet);this.wet.connect(this.master);
 }
 async play(){this.requested=true;if(!this.enabled)return false;if(this.timer!==null)return true;const ticket=++this.generation;try{this.init();await this.context.resume();if(ticket!==this.generation||!this.requested||!this.enabled)return false;this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.12);this.nextTime=this.context.currentTime+.05;this.schedule();this.timer=this.setTimer(()=>this.schedule(),40);this.notify('playing');return true;}catch(error){this.pause();console.warn('Background music unavailable:',error);this.notify('unavailable');return false;}}
 pause(){this.requested=false;this.generation++;if(this.timer!==null){this.clearTimer(this.timer);this.timer=null;}if(this.context){this.master.gain.setTargetAtTime(0,this.context.currentTime,.025);for(const voice of this.voices){try{voice.stop(this.context.currentTime+.05);}catch{}}}this.notify(this.enabled?'paused':'off');}
 setEnabled(value){this.enabled=!!value;if(!this.enabled)this.pause();else this.notify('ready');}
 setVolume(value){const v=Number(value);this.volume=Number.isFinite(v)?Math.min(.6,Math.max(0,v)):0;if(this.context&&this.timer!==null)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.08);}
 note(midi,time,duration,volume,pad=false){const c=this.context;const frequency=440*2**((midi-69)/12);for(const [multiple,level]of(pad?[[1,1],[2,.12]]:[[1,1],[2,.23],[3,.055]])){
  const osc=c.createOscillator(),env=c.createGain();osc.type='sine';osc.frequency.setValueAtTime(frequency*multiple,time);env.gain.setValueAtTime(.0001,time);env.gain.exponentialRampToValueAtTime(Math.max(.0002,volume*level),time+(pad?.35:.012));env.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(env);env.connect(this.filter);this.voices.add(osc);osc.onended=()=>{this.voices.delete(osc);osc.disconnect();env.disconnect();};osc.start(time);osc.stop(time+duration+.03);
 }}
 schedule(){if(!this.context||!this.requested||!this.enabled)return;const now=this.context.currentTime;if(this.nextTime<now-.5)this.nextTime=now+.03;let guard=0;while(this.nextTime<now+.25&&guard++<16){const pos=this.step%8,bar=Math.floor(this.step/8)%16,chord=CHORDS[bar],time=this.nextTime;
  if(pos===0)for(const note of chord)this.note(note,time,2.85,.023,true);
  if(pos===0||pos===4)this.note(chord[0]-12,time,1.25,.085);
  if(pos!==7)this.note(chord[[0,2,1,3,2,1,3,0][pos]]+12,time,1.55,pos%2?.035:.055);
  const melody=MELODY[bar][pos];if(melody!==null)this.note(melody,time,1.8,.075);
  this.step=(this.step+1)%128;this.nextTime+=60/TEMPO/2;
 }}
 destroy(){this.pause();for(const voice of this.voices){try{voice.disconnect();}catch{}}this.voices.clear();this.context?.close();}
}
