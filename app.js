// App shell: routing, progress, exercises, spaced repetition, sound, tutor, start page, train page, news.
(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduce=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const sleep=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));
const T=window.TRACKS, ORDER=['build','ai','eng','data','sec','deutsch','pro'].filter(k=>T[k]);
const VIEWS=['start'].concat(ORDER,['train','news']);
const today=()=>Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000);
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

/* ---------- progress (this browser only) ---------- */
const KEY='fahrplan-v1';let P={};
try{P=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){P={}}
if(!P._||typeof P._!=='object')P._={};
const M=P._;M.srs=M.srs||{};M.notes=M.notes||{};M.xp=M.xp||0;
function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}paintProgress()}
function touchStreak(){const d=today();if(M.day===d)return;M.streak=M.day===d-1?(M.streak||0)+1:1;M.day=d}
function addXP(n){M.xp+=n;touchStreak();save()}
function totals(k){let done=0,all=0;T[k].stations.forEach(s=>{all++;if(P[s.id])done++;(s.ex||[]).forEach((_,i)=>{all++;if(P[s.id+':'+i])done++})});return{done,all,pct:all?Math.round(done/all*100):0}}
function stationsDone(){let n=0,a=0;ORDER.forEach(k=>T[k].stations.forEach(s=>{a++;if(P[s.id])n++}));return[n,a]}
function paintProgress(){
  ORDER.forEach(k=>{const t=totals(k);$$('[data-pct="'+k+'"]').forEach(e=>e.textContent=t.pct+'%');$$('[data-bar="'+k+'"]').forEach(e=>e.style.width=t.pct+'%');$$('[data-cnt="'+k+'"]').forEach(e=>e.textContent=t.done+' of '+t.all+' steps done');
    $$('[data-ring="'+k+'"]').forEach(e=>e.style.strokeDashoffset=String(126-126*t.pct/100))});
  $$('details.st').forEach(d=>d.classList.toggle('done',!!P[d.dataset.id]));
  const sd=stationsDone();$$('[data-stat="xp"]').forEach(e=>e.textContent=M.xp);$$('[data-stat="level"]').forEach(e=>e.textContent=Math.floor(M.xp/250)+1);
  $$('[data-stat="streak"]').forEach(e=>e.textContent=(M.day>=today()-1?M.streak||0:0));$$('[data-stat="done"]').forEach(e=>e.textContent=sd[0]+' / '+sd[1]);
}

/* ---------- spaced repetition (Leitner boxes) ---------- */
const GAP=[0,1,3,7,16,35];
const srs={box:k=>(M.srs[k]||[0])[0],due:k=>{const v=M.srs[k];return !v||v[1]<=today()},
  grade(k,ok){const b=ok?Math.min(5,srs.box(k)+1):1;M.srs[k]=[b,today()+GAP[b]];touchStreak();save()}};
function dueCards(){let n=0;Object.keys(window.DECKS).forEach(k=>window.DECKS[k].cards.forEach((c,i)=>{if(srs.box(k+':'+i)>0&&srs.due(k+':'+i))n++}));return n}

/* ---------- syntax colours ---------- */
const KW={py:'def return if elif else for while in not and or import from as with try except raise class lambda None True False await async yield pass break continue is',
 sql:'select from where group by order join left right inner outer full on as and or not null is in insert into values update set delete create table view procedure begin end commit transaction merge using when matched then with over partition distinct top limit union all case else having desc asc index extension primary key generated always stored exists if',
 yaml:'true false null',sh:'export cd echo if then fi for do done',txt:''};
function hl(code,lang){
  const kw=new Set((KW[lang]||'').split(' ')),sqlish=lang==='sql';
  const re=lang==='sql'?/(--[^\n]*)|('(?:[^'\n]|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g
    :lang==='txt'?/(\u0000)|(\u0000)|(\u0000)|(\u0000)/g
    :/(#[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
  let out='',last=0,mt;
  while((mt=re.exec(code))){out+=esc(code.slice(last,mt.index));last=re.lastIndex;
    if(mt[1])out+='<i class="c">'+esc(mt[1])+'</i>';else if(mt[2])out+='<i class="s">'+esc(mt[2])+'</i>';else if(mt[3])out+='<i class="n">'+mt[3]+'</i>';
    else{const w=mt[4];out+=kw.has(sqlish?w.toLowerCase():w)?'<i class="k">'+w+'</i>':(code[last]==='('&&lang==='py'?'<i class="f">'+w+'</i>':w)}}
  return out+esc(code.slice(last));
}
function paintCode(root){$$('pre[data-l]',root).forEach(p=>{if(p.dataset.hl)return;p.dataset.hl=1;const c=$('code',p);if(c&&!c.children.length)c.innerHTML=hl(c.textContent,p.dataset.l)})}

/* ---------- mascot, toast, confetti ---------- */
function mascot(mood){
  const mouth={idle:'M22 41 Q30 45 38 41',happy:'M20 39 Q30 50 40 39',cheer:'M20 38 Q30 53 40 38 Z',think:'M24 43 H36',sad:'M22 45 Q30 39 38 45'}[mood||'idle'];
  return '<svg class="mascot m-'+(mood||'idle')+'" viewBox="0 0 60 64" aria-hidden="true"><rect x="18" y="2" width="24" height="7" rx="3" fill="var(--ink)"/><rect x="8" y="8" width="44" height="46" rx="12" fill="var(--c,var(--lk))"/><rect x="13" y="14" width="34" height="18" rx="6" fill="var(--surface)"/>'
   +'<g class="eyes"><circle cx="23" cy="23" r="3.4" fill="var(--ink)"/><circle cx="37" cy="23" r="3.4" fill="var(--ink)"/></g><path d="'+mouth+'" fill="'+(mood==='cheer'?'var(--surface)':'none')+'" stroke="var(--surface)" stroke-width="2.6" stroke-linecap="round"/><circle cx="15" cy="48" r="2.6" fill="var(--ld)"/><circle cx="45" cy="48" r="2.6" fill="var(--ld)"/><rect x="14" y="56" width="10" height="6" rx="3" fill="var(--ink)"/><rect x="36" y="56" width="10" height="6" rx="3" fill="var(--ink)"/></svg>';
}
let toastT;
function toast(mood,text){const t=$('#toast');if(!t)return;t.innerHTML=mascot(mood)+'<span>'+esc(text)+'</span>';t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('on'),2400)}
function cheer(){if(reduce)return;const c=$('#confetti'),x=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;c.hidden=false;
  const col=['#0B8A78','#6A48D0','#B97F00','#CE3558','#2F6FB2'],ps=Array.from({length:90},()=>({x:innerWidth/2,y:innerHeight*0.6,vx:(Math.random()-0.5)*14,vy:-Math.random()*15-4,s:4+Math.random()*5,c:col[Math.floor(Math.random()*5)],r:Math.random()*6}));
  let f=0;(function step(){x.clearRect(0,0,c.width,c.height);ps.forEach(p=>{p.vy+=0.45;p.x+=p.vx;p.y+=p.vy;p.r+=0.2;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*0.6);x.restore()});if(++f<90)requestAnimationFrame(step);else c.hidden=true})()}
const GOOD=['Richtig!','Genau!','Sehr gut!','Stark!','Perfekt!'],TRY=['Not yet. Try again.','Almost. Look again.','Nicht ganz. One more try.'];

/* ---------- exercises ---------- */
let RV=[];
function exHTML(sid,ex,i,rv){
  const id=rv?'R:'+i:sid+':'+i,was=!rv&&P[id];let inner='';
  if(ex.t==='mcq'){const idx=ex.o.map((_,j)=>j),ord=ex.o.some(o=>o.length>14)?shuffle(idx):idx;inner='<div class="opts">'+ord.map(j=>'<button type="button" class="opt" data-j="'+j+'">'+esc(ex.o[j])+'</button>').join('')+'</div>'}
  if(ex.t==='fill')inner='<div class="fill"><label class="small muted" for="in-'+id+'">Your answer</label><input id="in-'+id+'" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="button" class="btn" data-check>Check</button></div>';
  if(ex.t==='order')inner='<div class="tiles ans" aria-label="Your answer"></div><div class="tiles pool"></div><div class="row"><button type="button" class="btn ghost" data-reset>Start again</button></div>';
  return '<div class="ex'+(was?' ok':'')+'" data-ex="'+id+'"'+(rv?' data-rv="'+i+'"':' data-sid="'+sid+'" data-i="'+i+'"')+'><p class="q">'+esc(ex.q)+'</p>'+(ex.c||'')+inner+'<p class="fb'+(was?' good':'')+'" aria-live="polite">'+(was?'Done. '+esc(ex.w):'')+'</p></div>';
}
function stationById(id){for(const k of ORDER){const s=T[k].stations.find(s=>s.id===id);if(s)return s}}
function trackOf(id){return ORDER.find(k=>T[k].stations.some(s=>s.id===id))}
function findEx(el){const box=el.closest('.ex');if(box.dataset.rv!==undefined)return{box,ex:RV[+box.dataset.rv].ex,id:null};return{box,ex:stationById(box.dataset.sid).ex[+box.dataset.i],id:box.dataset.ex}}
function right(box,id,ex){const first=!box.classList.contains('ok');box.classList.add('ok','pulse');setTimeout(()=>box.classList.remove('pulse'),600);const fb=$('.fb',box);fb.className='fb good';fb.textContent='Correct. '+ex.w;
  if(id){if(!P[id]){P[id]=1;addXP(10)}}else if(first){M.xp+=4;touchStreak();save();reviewScore()}
  if(first)toast('happy',GOOD[Math.floor(Math.random()*GOOD.length)])}
function wrong(box,msg){const fb=$('.fb',box);fb.className='fb no';fb.textContent=msg||TRY[Math.floor(Math.random()*TRY.length)];box.classList.add('shake');setTimeout(()=>box.classList.remove('shake'),450);if(box.dataset.rv!==undefined)box.dataset.miss=1}
function setupOrder(box,ex){const pool=$('.pool',box),ans=$('.ans',box);ans.innerHTML='';pool.innerHTML=shuffle(ex.items.map((t,i)=>i)).map(i=>'<button type="button" class="tile" data-k="'+i+'">'+esc(ex.items[i])+'</button>').join('')}
document.addEventListener('click',e=>{
  const opt=e.target.closest('.opt');
  if(opt){const {box,ex,id}=findEx(opt);$$('.opt',box).forEach(b=>b.classList.remove('wrong','right'));
    if(+opt.dataset.j===ex.a){opt.classList.add('right');right(box,id,ex)}else{opt.classList.add('wrong');wrong(box)}return}
  if(e.target.closest('[data-check]')){const {box,ex,id}=findEx(e.target);const v=$('input',box).value.trim().toLowerCase().replace(/[."?!]/g,'');
    if(!v){wrong(box,'Type an answer first.');return}
    if(ex.a.indexOf(v)>-1)right(box,id,ex);else wrong(box,'Not yet. Read the text above again and try once more.');return}
  const tile=e.target.closest('.tile');
  if(tile){const {box,ex,id}=findEx(tile);const pool=$('.pool',box),ans=$('.ans',box);(tile.parentNode===pool?ans:pool).appendChild(tile);
    if(!pool.children.length){const ok=$$('.tile',ans).every((t,i)=>ex.items[+t.dataset.k]===ex.items[i]);if(ok)right(box,id,ex);else wrong(box,'The order is not right yet. Click a tile to move it back.')}return}
  if(e.target.closest('[data-reset]')){const {box,ex}=findEx(e.target);setupOrder(box,ex);$('.fb',box).textContent='';return}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.ex .fill input')){e.preventDefault();$('[data-check]',e.target.parentNode).click()}});
document.addEventListener('change',e=>{if(e.target.matches('[data-done]')){const id=e.target.dataset.done;if(e.target.checked){if(!P[id]){P[id]=1;addXP(30);toast('cheer','Station done!');cheer()}}else{delete P[id];save()}}});
document.addEventListener('input',e=>{if(e.target.matches('[data-note]')){M.notes[e.target.dataset.note]=e.target.value;try{localStorage.setItem(KEY,JSON.stringify(P))}catch(_){}}});

/* ---------- track view ---------- */
function label(k,i){return T[k].letter+(i+1)}
function stationInner(k,s){
  return '<div class="explain">'+s.body+'</div>'
   +(s.know?'<div class="know"><b>You already know this: </b>'+s.know+'</div>':'')
   +(s.widget?'<div class="widget" data-w="'+s.widget+'"></div>':'')
   +(s.after?'<div class="explain">'+s.after+'</div>':'')
   +(s.key&&s.key.length?'<div class="keys"><h4>Remember</h4><ul>'+s.key.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>':'')
   +(s.ex&&s.ex.length?'<div><h4>Check yourself</h4></div><div class="exs">'+s.ex.map((x,i)=>exHTML(s.id,x,i)).join('')+'</div>':'')
   +'<div class="do"><h4>'+(s.do&&s.do.length?'Now do it for real':'Finished?')+'</h4>'+(s.do&&s.do.length?'<ol>'+s.do.map(d=>'<li>'+d+'</li>').join('')+'</ol>':'')+'<label class="chk"><input type="checkbox" data-done="'+s.id+'"'+(P[s.id]?' checked':'')+'>'+(s.do&&s.do.length?'I did this':'I understood this')+'</label></div>'
   +'<details class="reveal"><summary>My notes</summary><label class="small muted" for="note-'+s.id+'">Saved in this browser</label><textarea id="note-'+s.id+'" data-note="'+s.id+'" placeholder="Write what you want to remember, in your own words.">'+esc(M.notes[s.id]||'')+'</textarea></details>'
   +(s.links&&s.links.length?'<div class="links"><span class="muted small">Go deeper:</span>'+s.links.map(l=>'<a href="'+l[1]+'" target="_blank" rel="noopener">'+esc(l[0])+' &#8599;</a>').join('')+'</div>':'');
}
function mountWidgets(root){$$('.widget',root).forEach(m=>{if(m.dataset.on)return;m.dataset.on=1;const f=window.WIDGETS[m.dataset.w];if(f){try{f(m,m.dataset.a)}catch(err){m.textContent='This interactive part could not start.';console.error(err)}}});
  $$('.lesetext',root).forEach(l=>{if(l.dataset.on||l.closest('.widget'))return;l.dataset.on=1;const b=document.createElement('button');b.className='say';b.type='button';b.setAttribute('aria-label','Listen');b.dataset.say=l.textContent;b.innerHTML='&#9654;';l.prepend(b)});
  paintCode(root)}
function openStation(d){if(d.dataset.built)return;d.dataset.built=1;const k=d.dataset.k,s=stationById(d.dataset.id),b=$('.stb',d);b.innerHTML=stationInner(k,s);
  $$('.ex',b).forEach(box=>{const ex=s.ex[+box.dataset.i];if(ex.t==='order')setupOrder(box,ex)});mountWidgets(b)}
const built={};
function renderTrack(k){
  if(built[k])return;built[k]=1;const tr=T[k],v=$('#v-'+k);let html='',mins=0;
  tr.stations.forEach((s,i)=>{mins+=s.min||20;
    if(s.sec)html+='<h3 class="chapter"><span>'+esc(s.sec)+'</span></h3>';
    html+='<details class="st" id="st-'+s.id+'" data-id="'+s.id+'" data-k="'+k+'"><summary><span class="no">'+label(k,i)+'</span><span class="stt">'+esc(s.t)+'</span><span class="sum">'+esc(s.sum)+(s.min?' · '+s.min+' min':'')+'</span></summary><div class="stb"></div></details>'});
  v.innerHTML='<div class="stack c-'+tr.c+'"><div class="linehead"><span class="badge c-'+tr.c+'">'+tr.letter+'</span><div><h1>'+esc(tr.name)+'</h1><p class="muted">'+esc(tr.goal)+'</p></div></div><p class="lead">'+esc(tr.intro)+'</p>'
   +'<div class="card prog c-'+tr.c+'"><div class="row" style="justify-content:space-between"><span class="pct" data-pct="'+k+'">0%</span><span class="muted small"><span data-cnt="'+k+'"></span> · '+tr.stations.length+' stations · about '+Math.round(mins/60)+' hours of reading and practice</span></div><div class="bar"><i data-bar="'+k+'"></i></div><div class="row"><button class="btn line" type="button" data-next="'+k+'">Go to my next station</button></div></div>'
   +'<div class="line">'+html+'</div></div>';
  $$('details.st',v).forEach(d=>d.addEventListener('toggle',()=>{if(d.open)openStation(d)}));
  paintProgress();
}
function goStation(k,id){renderTrack(k);const d=$('#st-'+id);if(d){d.open=true;openStation(d);setTimeout(()=>d.scrollIntoView({block:'start',behavior:reduce?'auto':'smooth'}),40)}}
function nextStation(k){const s=T[k].stations.find(s=>!P[s.id])||T[k].stations[0];location.hash=k+'-'+s.id}
document.addEventListener('click',e=>{const b=e.target.closest('[data-next]');if(b&&T[b.dataset.next])nextStation(b.dataset.next)});

/* ---------- Claude features: tutor, voice ---------- */
let AI=null,TTS=null;
async function askAI(prompt,out,cb){
  if(!AI){out.textContent='The tutor is not available in this view.';return}
  out.textContent='Thinking ...';
  try{const r=await AI(prompt,{cache:false,onText:x=>{if(x&&x.text&&!cb)out.textContent=x.text}});const t=r&&r.text||'';if(cb)cb(t);else if(t)out.textContent=t}
  catch(e){if(e&&e.code==='not_granted'){document.body.classList.remove('has-ai');out.textContent='The tutor is switched off for this page.'}
    else out.textContent=e&&e.code==='rate_limited'?'Too many questions right now. Wait a minute and try again.':'The tutor could not answer. Try again in a moment.'}
}
const synth=window.speechSynthesis;let deVoice=null;
function pickVoice(){try{const v=synth.getVoices();deVoice=v.find(x=>/^de[-_]DE/i.test(x.lang))||v.find(x=>/^de/i.test(x.lang))||null;if(deVoice&&!TTS)document.body.classList.add('has-tts')}catch(e){}}
function speak(text,o){o=o||{};text=String(text).replace(/\s+/g,' ').slice(0,1900);
  if(TTS)return TTS.speak(text,{language:'de',rate:o.rate||0.9,voice:o.voice}).catch(err=>{if(err&&err.code==='not_granted'){TTS=null;document.body.classList.remove('has-tts');pickVoice()}throw err});
  return new Promise((res,rej)=>{if(!synth||!deVoice)return rej(new Error('no voice'));synth.cancel();const u=new SpeechSynthesisUtterance(text);u.voice=deVoice;u.lang=deVoice.lang;u.rate=o.rate||0.9;u.onend=()=>res();u.onerror=()=>rej(new Error('speech'));synth.speak(u)})}
function stopSpeak(){try{if(TTS)TTS.stop();else if(synth)synth.cancel()}catch(e){}}
function initClaude(){
  if(synth){pickVoice();try{synth.onvoiceschanged=pickVoice}catch(e){}}
  if(!(window.claude&&typeof window.claude.use==='function'))return;
  window.claude.use('sample').then(s=>{if(s){AI=s;document.body.classList.add('has-ai')}}).catch(()=>{});
  window.claude.use('tts').then(t=>{if(t){TTS=t;document.body.classList.add('has-tts')}}).catch(()=>{});
}
document.addEventListener('click',e=>{const b=e.target.closest('.say');if(b){e.stopPropagation();e.preventDefault();b.classList.add('on');speak(b.dataset.say).catch(()=>{}).then(()=>b.classList.remove('on'))}});
function initTutor(){
  const box=$('#tutor'),out=$('#tutorOut');
  $('#tutorBtn').addEventListener('click',()=>{box.classList.add('on');$('#tutorQ').focus()});
  $('#tutorClose').addEventListener('click',()=>box.classList.remove('on'));
  $('#tutorAsk').addEventListener('click',()=>{const q=$('#tutorQ').value.trim();if(!q){out.textContent='Type a question first.';return}
    const v=(location.hash||'').replace('#','').split('-'),st=v[1]&&stationById(v[1]);
    askAI('You are a patient tutor on a learning site with five lines: AI engineering (LLMs, RAG, agents, computer vision, MLOps), engineering core (Python, Docker, CI/CD, cloud, Terraform, Kubernetes), data platform engineering (Spark, Delta, dbt, Airflow, Kafka), security (detection engineering, AI security, cloud and web security), German (A2 to B1), and career. The learner is a BI developer who knows SQL Server, SSIS and data modelling well and is moving into AI and data engineering. English is not his first language: use very simple English, short sentences, and one small example. When it helps, compare with SQL or BI work. Maximum 170 words. Plain text only, no markdown.'+(st?'\n\nThe learner is reading the station: '+st.t+'.':'')+'\n\nQuestion: '+q,out)});
}

/* ---------- start view ---------- */
const PLAN=[['build','pro'],['build','deutsch'],['build','deutsch'],['build','deutsch'],['build','deutsch'],['build','deutsch'],['build','deutsch']];   // Sunday first
function nextOf(k){const i=T[k].stations.findIndex(s=>!P[s.id]);const j=i<0?0:i;return{s:T[k].stations[j],lab:label(k,j)}}
function mapSVG(){
  const ys=[24,60,96,132,168,204,240],col={build:'var(--lb)',ai:'var(--lk)',eng:'var(--lo)',data:'var(--lf)',sec:'var(--lx)',deutsch:'var(--ld)',pro:'var(--lc)'};
  let s='<svg viewBox="0 0 720 272" role="img" aria-label="Map with seven learning lines that meet at one destination">';
  ORDER.forEach((k,i)=>{const y=ys[i],c2=Math.abs(i-3),d='M28 '+y+' H'+(300-c2*16)+' Q'+(360-c2*9)+' '+y+' '+(410-c2*5)+' '+(y+(132-y)*0.55)+' L460 132 H650',t=totals(k);
    s+='<path id="ln'+i+'" d="'+d+'" fill="none" stroke="'+col[k]+'" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" class="draw" style="animation-delay:'+(i*120)+'ms"/>';
    for(let n=0;n<6;n++){const x=70+n*38;s+='<circle cx="'+x+'" cy="'+y+'" r="6" fill="'+((n+1)/6<=t.pct/100+0.001?col[k]:'var(--surface)')+'" stroke="'+col[k]+'" stroke-width="3"/>'}
    s+='<text x="28" y="'+(y-11)+'" font-size="13.5">'+esc(T[k].name)+'</text><circle r="7" fill="'+col[k]+'" stroke="var(--surface)" stroke-width="2" class="train"><animateMotion dur="'+(8+i*1.1)+'s" repeatCount="indefinite" begin="'+(i*0.7)+'s"><mpath href="#ln'+i+'"/></animateMotion></circle>'});
  return s+'<circle cx="650" cy="132" r="15" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><circle cx="650" cy="132" r="5" fill="var(--ink)" class="pulse2"/><text x="650" y="168" text-anchor="middle" font-size="17">Ziel</text><text x="650" y="186" text-anchor="middle" class="lbl">AI engineer · B1</text><text x="555" y="120" text-anchor="middle" class="lbl">12 months</text></svg>';
}
function renderStart(){
  const h=new Date().getHours(),greet=h<11?'Guten Morgen':h<18?'Guten Tag':'Guten Abend',plan=PLAN[new Date().getDay()],due=dueCards(),sd=stationsDone();
  const todayRows=plan.map(k=>{const n=nextOf(k);return '<a class="trow c-'+T[k].c+'" href="#'+k+'-'+n.s.id+'"><span class="badge c-'+T[k].c+'">'+T[k].letter+'</span><span><b>'+esc(n.s.t)+'</b><small>'+n.lab+' · '+esc(T[k].name)+' · '+(n.s.min||20)+' min</small></span></a>'}).join('')
    +'<a class="trow c-d" href="#train"><span class="badge c-d">5</span><span><b>'+(due?due+' German cards are due':'Five minutes of German cards')+'</b><small>Flashcards with spaced repetition</small></span></a>';
  $('#v-start').innerHTML='<div class="stack"><div class="hero"><div class="hello c-k">'+mascot(sd[0]?'happy':'idle')+'<div><p class="bubble">'+greet+'! '+(M.streak>1&&M.day>=today()-1?'Day '+M.streak+' in a row. Keep the train moving.':sd[0]?'Good to see you again. One station today is enough.':'Welcome on board. Start with the first station of the Project line.')+'</p><h1>Tori\'s Fahrplan</h1></div></div>'
   +'<p class="lead">One project, six reference lines, one destination: an engineer who can build, test, run and secure AI systems, works like a professional, and speaks German at B1. The Project line is your main path. The other lines explain each topic in depth when you need it.</p><div class="map">'+mapSVG()+'</div></div>'
   +'<div class="grid g2"><div class="card stack" style="gap:10px"><h2>Today</h2>'+todayRows+'</div>'
   +'<div class="card stack" style="gap:12px"><h2>Your numbers</h2><div class="nums"><div><b data-stat="streak">0</b><span>days in a row</span></div><div><b data-stat="xp">0</b><span>points</span></div><div><b data-stat="level">1</b><span>level</span></div><div><b data-stat="done">0</b><span>stations done</span></div></div><p class="small muted">A correct answer gives 10 points, a finished station 30. Any practice keeps the streak alive.</p></div></div>'
   +'<div class="grid g5">'+ORDER.map(k=>{const t=T[k];return '<a class="card linecard c-'+t.c+'" href="#'+k+'"><svg viewBox="0 0 48 48" class="ring" aria-hidden="true"><circle cx="24" cy="24" r="20" fill="none" stroke="var(--soft)" stroke-width="6"/><circle cx="24" cy="24" r="20" fill="none" stroke="var(--c)" stroke-width="6" stroke-linecap="round" stroke-dasharray="126" stroke-dashoffset="126" transform="rotate(-90 24 24)" data-ring="'+k+'"/><text x="24" y="29" text-anchor="middle" font-size="15" font-weight="700" fill="var(--ink)">'+t.letter+'</text></svg><h3>'+esc(t.name)+'</h3><span class="pct" data-pct="'+k+'">0%</span><span class="muted small">'+t.stations.length+' stations</span></a>'}).join('')+'</div>'
   +'<div class="card stack" style="gap:12px"><h2>Your twelve months</h2><p class="muted">About 10 hours a week next to your job. Each phase ends with something you can show.</p><div class="tbl"><table><tr><th>Months</th><th>Build</th><th>Proof</th></tr>'
   +[['1 to 2','Python every day. Shell, Git, tests. How models work','A tested Python package on GitHub'],['3 to 4','Docker, APIs, calling models, first RAG','A RAG API that starts with one command'],['5 to 6','RAG quality, agents, evals. dbt, Spark, Airflow','Portfolio projects 1 and 2'],['7 to 8','Cloud, Terraform, Kubernetes, LLMOps','Project 2 deployed in a cloud'],['9 to 10','Machine learning, vision, MLOps','Portfolio project 3'],['11 to 12','Interviews and applications. B1 exam','Applications every week']].map(r=>'<tr><td class="num"><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('')
   +'</table></div><div class="row"><a class="btn" href="#pro-C2" style="text-decoration:none">Open the full roadmap</a><a class="btn ghost" href="#pro-C1" style="text-decoration:none">See the job market data</a></div></div>'
   +'<div class="grid g2"><div class="card stack" style="gap:12px"><h2>Three rules</h2><ol class="plain"><li><b>Build more than you read.</b> A station counts when you tick "I did this".</li><li><b>German every day.</b> Five minutes of cards daily beat two hours on Sunday.</li><li><b>Finish and publish.</b> Three finished projects on GitHub open more doors than any certificate.</li></ol></div>'
   +'<div class="card news stack" style="gap:8px"><h2>New this week</h2><p>'+esc((window.WEEKLY&&window.WEEKLY.items[0]&&window.WEEKLY.items[0].title)||'')+'</p><div class="row"><a class="btn" href="#news" style="text-decoration:none">Read this week\'s AI news</a></div></div></div>'
   +'<details class="card reveal"><summary>Settings and backup</summary><div class="stack" style="gap:12px;margin-top:12px"><div class="row"><span>Colours</span><button class="btn ghost" type="button" data-theme="light">Light</button><button class="btn ghost" type="button" data-theme="dark">Dark</button><button class="btn ghost" type="button" data-theme="">Like my device</button></div>'
   +'<p class="small muted">Your progress is saved in this browser only. To move it to another device, copy the text below and paste it there.</p><label class="small" for="bk">Backup text</label><textarea id="bk" spellcheck="false" style="min-height:70px"></textarea><div class="row"><button class="btn ghost" type="button" data-bk="out">Show my backup</button><button class="btn ghost" type="button" data-bk="copy">Copy</button><button class="btn" type="button" data-bk="in">Load the text above</button></div><p class="fb" data-bkmsg aria-live="polite"></p></div></details></div>';
  paintProgress();
}
document.addEventListener('click',e=>{
  const th=e.target.closest('[data-theme]');if(th){const v=th.dataset.theme;if(v)document.documentElement.setAttribute('data-theme',v);else document.documentElement.removeAttribute('data-theme');M.theme=v;save();return}
  const bk=e.target.closest('[data-bk]');if(!bk)return;const ta=$('#bk'),msg=$('[data-bkmsg]');
  if(bk.dataset.bk==='out'){ta.value=JSON.stringify(P);ta.select();msg.textContent='Copy this text and keep it.'}
  if(bk.dataset.bk==='copy'){ta.value=ta.value||JSON.stringify(P);ta.select();(navigator.clipboard?navigator.clipboard.writeText(ta.value):Promise.reject()).then(()=>msg.textContent='Copied.',()=>msg.textContent='Select the text and copy it by hand.')}
  if(bk.dataset.bk==='in'){try{const o=JSON.parse(ta.value);if(!o||typeof o!=='object')throw 0;localStorage.setItem(KEY,JSON.stringify(o));msg.textContent='Loaded. The page restarts now.';setTimeout(()=>location.reload(),700)}catch(_){msg.className='fb no';msg.textContent='This is not a valid backup text.'}}
});

/* ---------- train view ---------- */
let trainTab='review';
function reviewScore(){const boxes=$$('#v-train .ex[data-rv]');if(!boxes.length)return;const ok=boxes.filter(b=>b.classList.contains('ok')),clean=ok.filter(b=>!b.dataset.miss).length,el=$('[data-rvscore]');
  if(el)el.textContent=ok.length+' of '+boxes.length+' answered · '+clean+' right at the first try';
  if(ok.length===boxes.length&&!el.dataset.fin){el.dataset.fin=1;toast(clean>=boxes.length*0.8?'cheer':'happy',clean+' of '+boxes.length+' at the first try');if(clean>=boxes.length*0.8)cheer()}}
function newReview(){const on=$$('#v-train [data-rvline]:checked').map(x=>x.value),pool=[];
  ORDER.filter(k=>on.includes(k)).forEach(k=>T[k].stations.forEach(s=>{const seen=P[s.id]||(s.ex||[]).some((_,i)=>P[s.id+':'+i]);(s.ex||[]).forEach(ex=>pool.push({ex,s,k,seen}))}));
  const seen=pool.filter(p=>p.seen);RV=shuffle(seen.length>=10?seen:pool).slice(0,10);
  $('[data-rvlist]').innerHTML=RV.length?'<p class="muted small" data-rvscore></p>'+RV.map((r,i)=>'<div class="c-'+T[r.k].c+'"><a class="small rvsrc" href="#'+r.k+'-'+r.s.id+'">'+esc(T[r.k].name)+' · '+esc(r.s.t)+'</a>'+exHTML('',r.ex,i,true)+'</div>').join(''):'<p class="muted">Choose at least one line.</p>';
  $$('#v-train .ex[data-rv]').forEach(box=>{const ex=RV[+box.dataset.rv].ex;if(ex.t==='order')setupOrder(box,ex)});paintCode($('#v-train'));reviewScore()}
function renderTrain(){
  const tabs=[['review','Mixed review'],['cards','Flashcards'],['verbs','Verbs'],['artikel','der die das'],['gloss','Glossary'],['search','Search']];
  let body='';
  if(trainTab==='review')body='<div class="card stack" style="gap:12px"><h2>Ten questions, mixed</h2><p class="muted">Pulling answers out of memory is what makes them stay. The questions come from stations you have started. If you have not started yet, from all stations.</p><div class="row">'+ORDER.map(k=>'<label class="chk" style="font-size:.98rem"><input type="checkbox" data-rvline value="'+k+'" checked>'+esc(T[k].name)+'</label>').join('')+'</div><div class="row"><button class="btn line" type="button" data-rvnew>New round</button></div></div><div class="exs" data-rvlist></div>';
  if(trainTab==='cards')body='<div class="c-d"><h2>German flashcards</h2><p class="muted">'+Object.keys(window.DECKS).length+' decks. A card you know moves up a box and comes back later: after 1, 3, 7, 16 and 35 days.</p><div class="widget" data-w="cards"></div></div>';
  if(trainTab==='verbs')body='<div class="c-d"><h2>Irregular verbs</h2><p class="muted">'+window.VERBS.length+' verbs. Type the Präteritum and the Perfekt.</p><div class="widget" data-w="verbs"></div><h2 style="margin-top:22px">Dictation</h2><div class="widget" data-w="diktat"></div></div>';
  if(trainTab==='artikel')body='<div class="c-d"><h2>der, die oder das?</h2><p class="muted">Nouns from all decks. How many in a row?</p><div class="widget" data-w="artikel"></div></div>';
  if(trainTab==='gloss')body='<div class="card stack" style="gap:12px"><h2>Glossary</h2><label class="small" for="gq">Find a word</label><input id="gq" class="wide" autocomplete="off" placeholder="for example: idempotent"><dl class="gloss" data-gl></dl></div>';
  if(trainTab==='search')body='<div class="card stack" style="gap:12px"><h2>Search all stations</h2><label class="small" for="sq">Search for</label><input id="sq" class="wide" autocomplete="off" placeholder="for example: watermark, Docker, Konjunktiv"><div class="stack" style="gap:8px" data-sr></div></div>';
  $('#v-train').innerHTML='<div class="stack c-n"><div class="linehead"><span class="badge c-n">T</span><div><h1>Train</h1><p class="muted">Short practice that makes things stay. Five to ten minutes a day.</p></div></div><div class="tabs" role="tablist">'+tabs.map(t=>'<button type="button" role="tab" aria-selected="'+(t[0]===trainTab)+'" class="tab'+(t[0]===trainTab?' on':'')+'" data-tab="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>'+body+'</div>';
  mountWidgets($('#v-train'));
  if(trainTab==='review')newReview();
  if(trainTab==='gloss')paintGloss('');
}
function paintGloss(q){q=q.toLowerCase();const L={B:'b',K:'k',E:'o',P:'f',S:'x',C:'c',D:'d'};$('[data-gl]').innerHTML=window.GLOSS.slice().sort((a,b)=>a[0].localeCompare(b[0])).filter(g=>!q||(g[0]+' '+g[1]).toLowerCase().includes(q)).map(g=>'<div class="c-'+(L[g[2]]||'n')+'"><dt><span class="badge c-'+(L[g[2]]||'n')+'">'+g[2]+'</span>'+esc(g[0])+'</dt><dd>'+esc(g[1])+'</dd></div>').join('')||'<p class="muted">Nothing found.</p>'}
let IDX=null;
function search(q){q=q.trim().toLowerCase();const out=$('[data-sr]');if(q.length<3){out.innerHTML='<p class="muted small">Type at least three letters.</p>';return}
  if(!IDX){IDX=[];ORDER.forEach(k=>T[k].stations.forEach((s,i)=>IDX.push({k,s,lab:label(k,i),txt:(s.t+' '+s.sum+' '+(s.body+(s.after||'')).replace(/<[^>]+>/g,' ')).replace(/&[a-z]+;/g,' ')})))}
  const hits=IDX.map(x=>{const l=x.txt.toLowerCase(),p=l.indexOf(q);return p<0?null:{x,p,title:(x.s.t+' '+x.s.sum).toLowerCase().includes(q)}}).filter(Boolean).sort((a,b)=>b.title-a.title).slice(0,25);
  out.innerHTML=hits.map(h=>{const a=Math.max(0,h.p-60),sn=h.x.txt.slice(a,h.p+q.length+90);return '<a class="trow c-'+T[h.x.k].c+'" href="#'+h.x.k+'-'+h.x.s.id+'"><span class="badge c-'+T[h.x.k].c+'">'+T[h.x.k].letter+'</span><span><b>'+esc(h.x.s.t)+'</b><small>'+h.x.lab+' · …'+esc(sn)+'…</small></span></a>'}).join('')||'<p class="muted">Nothing found.</p>'}
document.addEventListener('click',e=>{const t=e.target.closest('[data-tab]');if(t){trainTab=t.dataset.tab;renderTrain()}if(e.target.closest('[data-rvnew]'))newReview()});
document.addEventListener('input',e=>{if(e.target.id==='gq')paintGloss(e.target.value);if(e.target.id==='sq')search(e.target.value)});

/* ---------- news view ---------- */
function newsCard(n){return '<article class="card news stack" style="gap:10px"><h3>'+esc(n.title)+'</h3><dl><dt>What happened</dt><dd>'+esc(n.what)+'</dd><dt>Why you care</dt><dd>'+esc(n.why)+'</dd><dt>Try it</dt><dd>'+esc(n.tryit)+'</dd></dl>'+(n.url?'<div class="links"><a href="'+esc(n.url)+'" target="_blank" rel="noopener">Source: '+esc(n.source||'link')+' &#8599;</a></div>':'')+'</article>'}
function renderNews(){
  const Wk=window.WEEKLY||{items:[],archive:[]};
  $('#v-news').innerHTML='<div class="stack c-n"><div class="linehead"><span class="badge c-n">N</span><div><h1>This week in AI</h1><p class="muted">Updated '+esc(Wk.updated||'')+'. New items arrive every Monday.</p></div></div>'
   +'<p class="lead">A few news items, each explained in simple words, with one small thing to try. News sites wrote the reports; the numbers in them are their claims.</p>'+(Wk.items||[]).map(newsCard).join('')
   +((Wk.archive||[]).length?'<h2>Earlier weeks</h2>'+Wk.archive.map(a=>'<details class="card"><summary><b>'+esc(a.updated||'')+'</b></summary><div class="stack" style="margin-top:12px">'+(a.items||[]).map(newsCard).join('')+'</div></details>').join(''):'')+'</div>';
}

/* ---------- routing ---------- */
let curView='';
function route(){
  const parts=(location.hash||'').replace('#','').split('-');let v=parts[0];if(VIEWS.indexOf(v)<0)v='start';
  if(ORDER.includes(v))renderTrack(v);if(v==='start')renderStart();if(v==='train'&&v!==curView)renderTrain();
  VIEWS.forEach(x=>$('#v-'+x).classList.toggle('on',x===v));
  $$('.nav a').forEach(a=>{if(a.getAttribute('href')==='#'+v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  if(parts[1]&&ORDER.includes(v))goStation(v,parts[1]);else if(v!==curView)window.scrollTo(0,0);
  curView=v;const tb=$('#tutorBtn');if(tb)tb.dataset.v=v;
}
window.APP={$,$$,esc,hl,sleep,reduce,askAI,speak,stopSpeak,srs,addXP,cheer,toast,save,today,meta:M};
if(M.theme)document.documentElement.setAttribute('data-theme',M.theme);
$('.nav').innerHTML='<a href="#start"><span class="badge c-s" aria-hidden="true"><svg viewBox="0 0 16 16" width="14" height="14"><path d="M8 2 2 7.5V14h4v-4h4v4h4V7.5z" fill="currentColor"/></svg></span>Start</a>'+ORDER.map(k=>'<a href="#'+k+'"><span class="badge c-'+T[k].c+'">'+T[k].letter+'</span>'+esc({build:'Project',ai:'AI',eng:'Engineering',data:'Data',sec:'Security',deutsch:'Deutsch',pro:'Career'}[k])+'</a>').join('')+'<a href="#train"><span class="badge c-n">T</span>Train</a><a href="#news"><span class="badge c-n">N</span>This week</a>';
renderNews();route();
window.addEventListener('hashchange',route);
if(reduce)$$('animateMotion').forEach(a=>a.remove());
initTutor();initClaude();
})();
