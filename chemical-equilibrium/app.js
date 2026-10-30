(()=>{'use strict';
const $=id=>document.getElementById(id),model=new EquilibriumModel(),canvas=$('particles'),ctx=canvas.getContext('2d'),chart=$('chart'),gc=chart.getContext('2d');
let paused=false,speed=1,showEvents=true,last=0,accumulator=0,uiTick=0,equilibriumSeen=false;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const colors={A:'#5cdbc2',B:'#f4bf70'};
function size(c){const rect=c.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);if(c.width!==Math.round(rect.width*dpr)||c.height!==Math.round(rect.height*dpr)){c.width=Math.round(rect.width*dpr);c.height=Math.round(rect.height*dpr);}return {w:rect.width,h:rect.height,dpr};}
function dot(x,y,r,color,label){ctx.beginPath();ctx.arc(x,y,r+4,0,Math.PI*2);ctx.fillStyle=color+'0b';ctx.fill();const g=ctx.createRadialGradient(x-r*.3,y-r*.35,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,color+'c9');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(x-r*.25,y-r*.3,r*.19,0,Math.PI*2);ctx.fillStyle='#ffffff55';ctx.fill();}
function renderParticles(){const{w,h,dpr}=size(canvas);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  // Uniform scaling keeps dots circular on every screen.
  const s=Math.min(w/840,h/440),ox=(w-840*s)/2,oy=(h-440*s)/2;ctx.translate(ox,oy);ctx.scale(s,s);
  ctx.fillStyle='#a9c9b910';for(let x=20;x<840;x+=30)for(let y=10;y<440;y+=30){ctx.beginPath();ctx.arc(x,y,.7,0,7);ctx.fill();}
  ctx.strokeStyle='#7caaa51b';ctx.lineWidth=1;ctx.strokeRect(3,3,834,434);
  for(const p of model.entities){if(p.kind==='AB'){const nx=Math.cos(p.angle)*10,ny=Math.sin(p.angle)*10;ctx.lineWidth=4;ctx.strokeStyle='#afc7ab80';ctx.beginPath();ctx.moveTo(p.x-nx,p.y-ny);ctx.lineTo(p.x+nx,p.y+ny);ctx.stroke();dot(p.x-nx,p.y-ny,8.5,colors.A);dot(p.x+nx,p.y+ny,8.5,colors.B);}else dot(p.x,p.y,8.5,colors[p.kind]);}
  if(showEvents)for(const e of model.effects){const age=1.1-e.life,alpha=e.life/1.1,color=e.type==='off'?'#f4bf70':'#5cdbc2';ctx.globalAlpha=alpha*.75;ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(e.x,e.y,16+age*28,0,7);ctx.stroke();ctx.globalAlpha=alpha;ctx.font='10px Arial';ctx.textAlign='center';ctx.fillStyle=color;ctx.fillText(e.type==='off'?'распад':'соединение',e.x,Math.max(15,e.y-24-age*12));ctx.globalAlpha=1;}
}
function renderChart(){const{w,h,dpr}=size(chart);gc.setTransform(dpr,0,0,dpr,0,0);gc.clearRect(0,0,w,h);const left=29,right=13,top=16,bottom=24,pw=w-left-right,ph=h-top-bottom;const end=Math.max(40,Math.ceil(model.time/20)*20),start=Math.max(0,end-120),range=end-start;
  gc.font='8px Arial';gc.textAlign='right';gc.textBaseline='middle';for(const y of [0,8,16,24]){const py=top+ph*(1-y/24);gc.strokeStyle='#dfe3d7';gc.lineWidth=.6;gc.beginPath();gc.moveTo(left,py);gc.lineTo(w-right,py);gc.stroke();gc.fillStyle='#9aa390';gc.fillText(String(y),left-9,py);}
  gc.textAlign='center';gc.fillStyle='#9aa390';const tick=range/4;for(let i=0;i<=4;i++){const t=start+tick*i;gc.fillText(String(Math.round(t)),left+pw*i/4,h-9);}gc.textAlign='right';gc.fillText('с',w-1,h-9);
  const points=model.history.filter(p=>p.t>=start);for(const[key,color]of[['ab','#64846a'],['a','#d2a05b']]){gc.strokeStyle=color;gc.lineWidth=1.9;gc.lineJoin='round';gc.beginPath();points.forEach((p,i)=>{const x=left+pw*(p.t-start)/range,y=top+ph*(1-p[key]/24);i?gc.lineTo(x,y):gc.moveTo(x,y);});gc.stroke();const lastPoint=points.at(-1);if(lastPoint){gc.beginPath();gc.arc(left+pw*(lastPoint.t-start)/range,top+ph*(1-lastPoint[key]/24),3,0,7);gc.fillStyle=color;gc.fill();}}
  if(model.time<.2){gc.textAlign='center';gc.font='10px Arial';gc.fillStyle='#a2ab97';gc.fillText('Наблюдайте, как меняется состав',left+pw*.55,top+ph*.5);}
}
const format=n=>n.toFixed(1).replace('.',',');
function updateUI(){const c=model.counts(),r=model.rates();$('countAB').textContent=c.ab;$('countA').textContent=c.a;$('countB').textContent=c.b;$('totalAtoms').innerHTML=c.atoms+' <span>· всегда</span>';$('time').textContent=format(model.time);$('offRate').textContent=format(r.off);$('onRate').textContent=format(r.on);$('offBar').style.width=Math.min(100,r.off/4*100)+'%';$('onBar').style.width=Math.min(100,r.on/4*100)+'%';
  if(model.equilibrium())equilibriumSeen=true;
  const stage=equilibriumSeen?2:(model.dissociations>0?1:0);for(let i=0;i<3;i++)$('stage'+i).classList.toggle('active',i===stage);$('status').classList.toggle('equilibrium',stage===2);
  if(stage===0){$('statusKicker').textContent='НАЧАЛЬНОЕ СОСТОЯНИЕ';$('statusTitle').innerHTML='Всё начинается<br>с молекул';$('statusText').textContent='24 пары A–B. Свободных атомов пока нет. Следите за первым распадом.';}
  else if(stage===1){$('statusKicker').textContent='ПЕРЕХОД К РАВНОВЕСИЮ';$('statusTitle').innerHTML='Пары распадаются<br>и образуются снова';$('statusText').textContent='Распад даёт A и B. При подходящем столкновении свободные A и B снова соединяются.';}
  else{$('statusKicker').textContent='ДИНАМИЧЕСКОЕ РАВНОВЕСИЕ';$('statusTitle').innerHTML='Состав устойчив. <br>Движение продолжается.';$('statusText').textContent='Оба процесса продолжаются. Число частиц колеблется около устойчивого уровня, а средние скорости сближаются.';}
  const latest=model.events.at(-1);if(model.dissociations===0){$('eventText').textContent='Сначала — 24 молекулы A–B';$('eventToast').style.opacity=1;}else if(showEvents&&latest&&model.time-latest.t<1.6){$('eventText').textContent=latest.type==='off'?'A–B → A + B · одна пара распалась':'A + B → A–B · появилась новая пара';$('eventToast').style.opacity=1;}else $('eventToast').style.opacity=0;
  renderChart();
}
function setPaused(value){paused=value;$('playText').textContent=paused?'Продолжить':'Пауза';$('play').setAttribute('aria-label',paused?'Продолжить анимацию':'Приостановить анимацию');$('playIcon').innerHTML=paused?'<path d="M3 1l10 7-10 7z"/>':'<path d="M2 2h3v12H2zM9 2h3v12H9z"/>';$('liveLabel').textContent=paused?'НА ПАУЗЕ':'АНИМАЦИЯ ИДЁТ';accumulator=0;}
$('play').addEventListener('click',()=>setPaused(!paused));$('reset').addEventListener('click',()=>{model.reset();equilibriumSeen=false;accumulator=0;updateUI();renderParticles();});
document.querySelectorAll('[data-speed]').forEach(b=>b.addEventListener('click',()=>{speed=+b.dataset.speed;document.querySelectorAll('[data-speed]').forEach(el=>{const selected=el===b;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));});}));
$('showEvents').addEventListener('change',e=>{showEvents=e.target.checked;updateUI();renderParticles();});
function frame(timestamp){const elapsed=last?Math.min((timestamp-last)/1000,.1):0;last=timestamp;if(!paused&&!document.hidden){accumulator+=elapsed*speed;while(accumulator>=1/120){model.step(1/120);accumulator-=1/120;}}renderParticles();uiTick+=elapsed;if(uiTick>.12){updateUI();uiTick=0;}requestAnimationFrame(frame);}
window.addEventListener('resize',()=>{renderParticles();renderChart();});
document.addEventListener('visibilitychange',()=>{last=0;accumulator=0;});
// Read-only state and explicit stepping make this illustration inspectable.
window.equilibriumDemo={model,get paused(){return paused;},setPaused,advance(seconds){for(let t=0;t<seconds;t+=1/120)model.step(Math.min(1/120,seconds-t));updateUI();renderParticles();},reset(){model.reset();equilibriumSeen=false;updateUI();renderParticles();}};
if(reducedMotion)setPaused(true);updateUI();renderParticles();requestAnimationFrame(frame);
})();
