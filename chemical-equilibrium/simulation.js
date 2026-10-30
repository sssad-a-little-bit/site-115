/* A closed, isothermal illustrative 2D reaction model. No particles are added
   or removed: every A and B stays free or belongs to exactly one AB. */
(function(root){
  'use strict';
  class EquilibriumModel {
    constructor(seed=58){this.initialSeed=seed;this.reset();}
    random(){let t=this.seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;}
    velocity(speed=68){const a=this.random()*Math.PI*2,s=speed*(.75+this.random()*.5);return {vx:Math.cos(a)*s,vy:Math.sin(a)*s};}
    reset(){this.seed=this.initialSeed;this.time=0;this.entities=[];this.events=[];this.effects=[];this.history=[];this.sampleAt=0;this.nextId=0;this.dissociations=0;this.associations=0;
      for(let i=0;i<24;i++){const col=i%8,row=Math.floor(i/8);this.entities.push({id:this.nextId++,kind:'AB',x:65+col*101+(this.random()-.5)*30,y:76+row*142+(this.random()-.5)*35,...this.velocity(49),angle:this.random()*6.28,spin:(this.random()-.5)*2,cooldown:0});}
      this.history.push({t:0,ab:24,a:0});
    }
    counts(){let ab=0,a=0,b=0;for(const e of this.entities){if(e.kind==='AB')ab++;else if(e.kind==='A')a++;else b++;}return {ab,a,b,atoms:2*ab+a+b};}
    addEvent(type,x,y){const event={t:this.time,type,x,y};this.events.push(event);this.effects.push({...event,life:1.1});if(type==='off')this.dissociations++;else this.associations++;}
    step(dt){
      this.time+=dt;const dissociated=[];const next=[];
      for(const p of this.entities){
        p.cooldown=Math.max(0,p.cooldown-dt);p.x+=p.vx*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;
        const r=p.kind==='AB'?20:11;
        if(p.x<r){p.x=r;p.vx=Math.abs(p.vx);}if(p.x>840-r){p.x=840-r;p.vx=-Math.abs(p.vx);}if(p.y<r){p.y=r;p.vy=Math.abs(p.vy);}if(p.y>440-r){p.y=440-r;p.vy=-Math.abs(p.vy);}
        if(p.kind==='AB'&&p.cooldown<=0&&this.random()<1-Math.exp(-.105*dt)){
          const angle=p.angle,nx=Math.cos(angle),ny=Math.sin(angle),kick=48;
          for(const [kind,sign] of [['A',-1],['B',1]])dissociated.push({id:this.nextId++,kind,x:p.x+nx*sign*12,y:p.y+ny*sign*12,vx:p.vx*.45+nx*kick*sign,vy:p.vy*.45+ny*kick*sign,angle:0,spin:0,cooldown:.7});
          this.addEvent('off',p.x,p.y);
        }else next.push(p);
      }
      this.entities=next.concat(dissociated);const used=new Set(),formed=[];
      for(let i=0;i<this.entities.length;i++){
        const p=this.entities[i];if(used.has(p.id))continue;
        for(let j=i+1;j<this.entities.length;j++){
          const q=this.entities[j];if(used.has(q.id))continue;
          let dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy),r=(p.kind==='AB'?18:9)+(q.kind==='AB'?18:9);
          if(d>=r)continue;
          if(d<.01){dx=.01;dy=0;d=.01;}
          const nx=dx/d,ny=dy/d,approaching=(q.vx-p.vx)*nx+(q.vy-p.vy)*ny<0;
          if(p.kind!=='AB'&&q.kind!=='AB'&&p.kind!==q.kind&&p.cooldown<=0&&q.cooldown<=0&&approaching&&this.random()<.82){
            used.add(p.id);used.add(q.id);const x=(p.x+q.x)/2,y=(p.y+q.y)/2;
            const a=p.kind==='A'?p:q,b=p.kind==='B'?p:q;
            const v=this.velocity(48);
            formed.push({id:this.nextId++,kind:'AB',x,y,...v,angle:Math.atan2(b.y-a.y,b.x-a.x),spin:(this.random()-.5)*2,cooldown:1.0});this.addEvent('on',x,y);break;
          }
          // Nonreacting encounters rebound; not every collision creates a bond.
          const overlap=r-d+.1;p.x-=nx*overlap/2;p.y-=ny*overlap/2;q.x+=nx*overlap/2;q.y+=ny*overlap/2;
          if(approaching){const m1=p.kind==='AB'?2:1,m2=q.kind==='AB'?2:1,imp=2*((q.vx-p.vx)*nx+(q.vy-p.vy)*ny)/(m1+m2);p.vx+=imp*m2*nx;p.vy+=imp*m2*ny;q.vx-=imp*m1*nx;q.vy-=imp*m1*ny;}
        }
      }
      this.entities=this.entities.filter(p=>!used.has(p.id)).concat(formed);
      // A weak thermal bath represents the fixed temperature of the vessel.
      for(const p of this.entities){const s=Math.hypot(p.vx,p.vy),target=p.kind==='AB'?48:68,scale=1+(target/Math.max(s,.01)-1)*dt*.35;p.vx*=scale;p.vy*=scale;const r=p.kind==='AB'?20:11;p.x=Math.max(r,Math.min(840-r,p.x));p.y=Math.max(r,Math.min(440-r,p.y));}
      this.effects=this.effects.filter(e=>(e.life-=dt)>0);this.events=this.events.filter(e=>e.t>this.time-24);
      if(this.time>=this.sampleAt+.25){this.sampleAt=this.time;const c=this.counts();this.history.push({t:this.time,ab:c.ab,a:c.a});if(this.history.length>2400)this.history.shift();}
    }
    rates(){const span=Math.min(this.time,12);if(span<.1)return{off:0,on:0};const recent=this.events.filter(e=>e.t>this.time-12);return{off:recent.filter(e=>e.type==='off').length/span,on:recent.filter(e=>e.type==='on').length/span};}
    equilibrium(){if(this.time<24)return false;const h=this.history.filter(v=>v.t>this.time-20);const a=h.filter(v=>v.t<this.time-10),b=h.filter(v=>v.t>=this.time-10);if(!a.length||!b.length)return false;const mean=arr=>arr.reduce((s,x)=>s+x.ab,0)/arr.length;const rates=this.rates();return Math.abs(mean(a)-mean(b))<3.2&&rates.on>.25&&rates.off>.25;}
  }
  root.EquilibriumModel=EquilibriumModel;
  if(typeof module!=='undefined')module.exports=EquilibriumModel;
})(typeof window!=='undefined'?window:globalThis);
