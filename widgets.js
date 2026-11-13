// Interactive widgets for the engineering, data, AI and career lines. German widgets are in widgets-de.js.
// Each widget is WIDGETS.name(mountElement, argument). Helpers come from window.APP (set by app.js).
(function(){
'use strict';
const W=window.WIDGETS={};
const A=()=>window.APP;
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const card=(title,inner)=>'<div class="card stack wcard" style="gap:12px">'+(title?'<h4>'+title+'</h4>':'')+inner+'</div>';

/* ---------- generic: annotated code ---------- */
W.annot=function(m,arg){
  const d=WD.annot[arg];if(!d)return;let cur=0,timer=null;
  m.innerHTML=card(d.title,'<div class="acode">'+d.lines.map((l,i)=>'<button type="button" class="aline" data-i="'+i+'">'+A().hl(l[0],d.l)+'</button>').join('')+'</div>'
   +'<p class="out anote" aria-live="polite"></p><div class="row"><button class="btn ghost" type="button" data-play>Walk through it</button><span class="muted small" data-pos></span></div>');
  function show(i){cur=i;$$('.aline',m).forEach((b,j)=>b.classList.toggle('on',j===i));$('.anote',m).textContent=d.lines[i][1];$('[data-pos]',m).textContent='Line '+(i+1)+' of '+d.lines.length}
  m.addEventListener('click',e=>{const b=e.target.closest('.aline');if(b){clearInterval(timer);timer=null;show(+b.dataset.i)}
    if(e.target.closest('[data-play]')){clearInterval(timer);show(0);if(A().reduce)return;timer=setInterval(()=>{if(cur>=d.lines.length-1){clearInterval(timer);timer=null}else show(cur+1)},2600)}});
  show(0);
};

/* ---------- generic: decision tree ---------- */
W.tree=function(m,arg){
  const root=WD.tree[arg];if(!root)return;let path=[];
  function node(){let n=root;path.forEach(i=>n=n.a[i][1]);return n}
  function paint(){const n=node();let crumbs='',x=root;path.forEach(i=>{crumbs+='<span class="chip">'+esc(x.a[i][0])+'</span>';x=x.a[i][1]});
    m.innerHTML=card('Find the right choice',(crumbs?'<div class="chips">'+crumbs+'</div>':'')
     +(n.r?'<div class="result pop"><span class="muted small">Recommended</span><b>'+esc(n.r)+'</b><p>'+esc(n.why)+'</p></div>'
          :'<p class="q">'+esc(n.q)+'</p><div class="opts">'+n.a.map((o,i)=>'<button type="button" class="opt2" data-i="'+i+'">'+esc(o[0])+'</button>').join('')+'</div>')
     +(path.length?'<div class="row"><button class="btn ghost" type="button" data-back>Back</button><button class="btn ghost" type="button" data-again>Start again</button></div>':''))}
  m.addEventListener('click',e=>{const b=e.target.closest('.opt2');if(b){path.push(+b.dataset.i);paint()}if(e.target.closest('[data-back]')){path.pop();paint()}if(e.target.closest('[data-again]')){path=[];paint()}});
  paint();
};

/* ---------- generic: scenario with scored choices ---------- */
W.scenario=function(m,arg){
  const d=WD.scenario[arg];if(!d)return;let i=0,score=0,picked=null;const max=d.steps.length*2;
  function paint(){
    if(i>=d.steps.length){const v=d.end.find(x=>score>=x[0]);m.innerHTML=card(d.title,'<div class="result pop"><span class="muted small">Your score</span><b>'+score+' of '+max+'</b><p>'+esc(v[1])+'</p></div><div class="row"><button class="btn line" type="button" data-again>Play again</button></div>');if(score===max)A().cheer();return}
    const s=d.steps[i];
    m.innerHTML=card(d.title,(i===0&&picked===null?'<p class="muted">'+esc(d.intro)+'</p>':'')+'<div class="bar"><i style="width:'+Math.round(i/d.steps.length*100)+'%"></i></div><p class="q">'+esc(s.t)+'</p><div class="opts">'
     +s.o.map((o,j)=>'<button type="button" class="opt2'+(picked===j?(o[1]===2?' right':o[1]===1?' mid':' wrong'):'')+'" data-j="'+j+'"'+(picked!==null?' disabled':'')+'>'+esc(o[0])+'</button>').join('')+'</div>'
     +(picked!==null?'<p class="fb '+(s.o[picked][1]===2?'good':'no')+'">'+esc(s.o[picked][2])+'</p><div class="row"><button class="btn line" type="button" data-next>'+(i===d.steps.length-1?'See the result':'Next')+'</button></div>':''));
  }
  m.addEventListener('click',e=>{const b=e.target.closest('.opt2');if(b&&picked===null){picked=+b.dataset.j;score+=d.steps[i].o[picked][1];paint()}
    if(e.target.closest('[data-next]')){i++;picked=null;paint()}if(e.target.closest('[data-again]')){i=0;score=0;picked=null;paint()}});
  paint();
};

/* ---------- SQL next to PySpark ---------- */
W.rosetta=function(m){
  const R=WD.rosetta;let cur=0;
  function paint(){m.innerHTML=card('The same operation in two languages','<div class="chips">'+R.map((r,i)=>'<button type="button" class="chipb'+(i===cur?' on':'')+'" data-i="'+i+'">'+esc(r[0])+'</button>').join('')+'</div>'
    +'<div class="grid g2"><div><p class="small muted">SQL</p><pre data-l="sql"><code>'+A().hl(R[cur][1],'sql')+'</code></pre></div><div><p class="small muted">PySpark</p><pre data-l="py"><code>'+A().hl(R[cur][2],'py')+'</code></pre></div></div>')}
  m.addEventListener('click',e=>{const b=e.target.closest('.chipb');if(b){cur=+b.dataset.i;paint()}});paint();
};

/* ---------- Delta log simulator ---------- */
W.delta=function(m){
  let files,vers,view;
  function reset(){files=[{id:1,rows:3,gone:false}];vers=[{op:'CREATE TABLE + INSERT 3 rows',add:[1],rem:[]}];view=0;paint()}
  function activeAt(v){const s=new Set();for(let i=0;i<=v;i++){vers[i].add.forEach(x=>s.add(x));vers[i].rem.forEach(x=>s.delete(x))}return s}
  function commit(op,add,rem){vers.push({op,add,rem});view=vers.length-1;paint()}
  function nf(rows){const f={id:files.length+1,rows,gone:false};files.push(f);return f.id}
  function paint(msg){
    const last=vers.length-1,act=activeAt(view),need=[...act].some(id=>files[id-1].gone);
    const rows=need?'?':[...act].reduce((a,id)=>a+files[id-1].rows,0);
    m.innerHTML=card('A Delta table: files and log','<div class="row"><button class="btn" type="button" data-a="ins">INSERT 2 rows</button><button class="btn" type="button" data-a="upd">UPDATE 1 row</button><button class="btn" type="button" data-a="del">DELETE 1 row</button><button class="btn line" type="button" data-a="opt">OPTIMIZE</button><button class="btn line" type="button" data-a="vac">VACUUM</button><button class="btn ghost" type="button" data-a="reset">Reset</button></div>'
     +'<div class="grid g2"><div><p class="small muted">Parquet files on disk</p><div class="files">'+files.map(f=>'<span class="file '+(f.gone?'gone':act.has(f.id)?'act':'old')+'" title="'+(f.gone?'deleted by VACUUM':act.has(f.id)?'part of this version':'on disk, not part of this version')+'">part-'+String(f.id).padStart(3,'0')+'<small>'+f.rows+' rows</small></span>').join('')+'</div>'
     +'<p class="small muted" style="margin-top:8px">solid = in this version · dashed = old, still on disk · faded = deleted</p></div>'
     +'<div><p class="small muted">_delta_log</p><ol class="dlog">'+vers.map((v,i)=>'<li class="'+(i===view?'on':'')+'"><button type="button" data-v="'+i+'">v'+i+' · '+esc(v.op)+'</button></li>').join('')+'</ol></div></div>'
     +'<label class="small" for="tt-'+m.dataset.uid+'">Time travel: read version <b>'+view+'</b>'+(view===last?' (newest)':'')+'</label><input id="tt-'+m.dataset.uid+'" type="range" min="0" max="'+last+'" value="'+view+'" data-tt>'
     +'<p class="out">'+(need?'Version '+view+' cannot be read any more. VACUUM deleted files it needs. This is the price of VACUUM.':(msg||'')+' SELECT COUNT(*) ... VERSION AS OF '+view+' → <b>'+rows+' rows</b> from '+act.size+' file'+(act.size===1?'':'s')+'.')+'</p>');
  }
  m.dataset.uid=Math.random().toString(36).slice(2,7);
  m.addEventListener('input',e=>{if(e.target.matches('[data-tt]')){view=+e.target.value;paint()}});
  m.addEventListener('click',e=>{const v=e.target.dataset.v;if(v!==undefined){view=+v;return paint()}
    const a=e.target.dataset.a;if(!a)return;if(a==='reset')return reset();
    const act=[...activeAt(vers.length-1)];
    if(a==='ins')return commit('INSERT 2 rows: add 1 file',[nf(2)],[]);
    if(a==='upd'){const f=files[act[0]-1];return commit('UPDATE: rewrite part-'+String(f.id).padStart(3,'0'),[nf(f.rows)],[f.id])}
    if(a==='del'){const f=files[act[act.length-1]-1];return commit('DELETE 1 row: rewrite part-'+String(f.id).padStart(3,'0'),f.rows>1?[nf(f.rows-1)]:[],[f.id])}
    if(a==='opt'){if(act.length<2){view=vers.length-1;return paint('Only one file. Nothing to compact.')}const sum=act.reduce((s,id)=>s+files[id-1].rows,0);return commit('OPTIMIZE: '+act.length+' files → 1',[nf(sum)],act)}
    if(a==='vac'){const keep=new Set(act);let n=0;files.forEach(f=>{if(!keep.has(f.id)&&!f.gone){f.gone=true;n++}});view=vers.length-1;return paint('VACUUM deleted '+n+' old file'+(n===1?'':'s')+'. Now move the slider back.')}
  });
  reset();
};

/* ---------- Spark lazy evaluation ---------- */
W.lazy=function(m){
  const T=[['read','spark.read.parquet("hatch/")','Read 4 columns of 20'],['filter','.filter(col("year") == 2026)','Skip files of other years'],['select','.select("hatchery", "hatched")','Keep 2 columns'],['groupBy','.groupBy("hatchery").sum("hatched")','Shuffle rows by hatchery']];
  let plan=[0],busy=false;
  function paint(msg,run){m.innerHTML=card('Lazy evaluation','<div class="row">'+T.slice(1).map((t,i)=>'<button class="btn ghost" type="button" data-t="'+(i+1)+'"'+(plan.includes(i+1)||busy?' disabled':'')+'>+ '+t[0]+'</button>').join('')+'<button class="btn line" type="button" data-run'+(busy?' disabled':'')+'>Action: .count()</button><button class="btn ghost" type="button" data-reset>Reset</button></div>'
    +'<div class="plan">'+plan.map((i,k)=>'<div class="pstep'+(run!==undefined&&k<=run?' done':'')+(run===k?' now':'')+'"><code>'+esc(T[i][1])+'</code>'+(run!==undefined&&k<=run?'<small>'+T[i][2]+'</small>':'<small>planned, not run</small>')+'</div>').join('')+'</div><p class="out" aria-live="polite">'+msg+'</p>')}
  m.addEventListener('click',async e=>{if(busy)return;const t=e.target.dataset.t;
    if(t){plan.push(+t);plan.sort();return paint('Step added to the plan. Nothing has run. No file was read.')}
    if(e.target.closest('[data-reset]')){plan=[0];return paint('The plan has one step. Add transformations, then run an action.')}
    if(e.target.closest('[data-run]')){busy=true;for(let k=0;k<plan.length;k++){paint('Running ...',k);await A().sleep(650)}busy=false;
      paint('Done. Spark saw the whole plan first'+(plan.includes(1)?', so it pushed the filter into the read and never opened the other files':'')+(plan.includes(2)?', and read only the columns that are needed':'')+'.',plan.length-1)}});
  paint('The plan has one step. Add transformations, then run an action.');
};

/* ---------- medallion cleaning ---------- */
W.medallion=function(m){
  const RAW=[['Nord','2026-11-02','1000','850'],['Nord','2026-11-02','1000','850'],['Süd','02.11.2026','1200',''],['süd ','2026-11-03','1100','968'],['West','2026-11-03','abc','700'],['Nord','2026-11-03','900','774']];
  const STEPS=[['names','Clean the names','df = df.withColumn("hatchery", initcap(trim("hatchery")))'],['dates','Use one date format','df = df.withColumn("date", coalesce(to_date("date","yyyy-MM-dd"), to_date("date","dd.MM.yyyy")))'],['nums','Turn text into numbers','df = df.withColumn("eggs_set", col("eggs_set").cast("int")).withColumn("hatched", col("hatched").cast("int"))'],['dedupe','Remove duplicate rows','df = df.dropDuplicates()'],['nulls','Remove rows with missing numbers','df = df.dropna(subset=["eggs_set","hatched"])']];
  const on={};
  m.innerHTML=card('Bronze to Silver to Gold','<div class="row">'+STEPS.map(s=>'<label class="chk" style="font-size:.98rem"><input type="checkbox" data-step="'+s[0]+'">'+s[1]+'</label>').join('')+'</div><div class="tbl" data-t></div><pre data-l="py"><code data-code></code></pre><p class="out" data-msg></p><div class="row"><button class="btn line" type="button" data-gold disabled>Build the Gold table</button></div><div data-g></div>');
  const num=v=>/^\d+$/.test(v);
  function compute(){let rows=RAW.map(r=>r.slice());
    if(on.names)rows.forEach(r=>{const s=r[0].trim();r[0]=s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()});
    if(on.dates)rows.forEach(r=>{const x=r[1].match(/^(\d\d)\.(\d\d)\.(\d{4})$/);if(x)r[1]=x[3]+'-'+x[2]+'-'+x[1]});
    if(on.nums)rows.forEach(r=>{[2,3].forEach(c=>{if(!num(r[c]))r[c]='null'})});
    if(on.dedupe){const seen={};rows=rows.filter(r=>{const k=r.join('|');if(seen[k])return false;seen[k]=1;return true})}
    if(on.nulls)rows=rows.filter(r=>r[2]!=='null'&&r[3]!=='null'&&r[2]!==''&&r[3]!=='');return rows}
  function paint(){const rows=compute(),seen={};let bad=0;
    const body=rows.map(r=>{const k=r.join('|'),dup=seen[k];seen[k]=1;const f=[dup||r[0]!==r[0].trim()||r[0].charAt(0)!==r[0].charAt(0).toUpperCase(),dup||!/^\d{4}-\d\d-\d\d$/.test(r[1]),dup||!num(r[2]),dup||!num(r[3])];
      return '<tr>'+r.map((c,i)=>{if(f[i])bad++;return '<td class="'+(f[i]?'bad ':'')+(i>1?'num':'')+'">'+(c===''?'(empty)':esc(c))+'</td>'}).join('')+'</tr>'}).join('');
    $('[data-t]',m).innerHTML='<table><tr><th>hatchery</th><th>date</th><th>eggs_set</th><th>hatched</th></tr>'+body+'</table>';
    $('[data-code]',m).innerHTML=A().hl(STEPS.filter(s=>on[s[0]]).map(s=>s[2]).join('\n')||'# your notebook code appears here','py');
    const any=STEPS.some(s=>on[s[0]]);
    $('[data-msg]',m).textContent=bad===0?'Silver is clean: '+rows.length+' good rows. Now build Gold.':(any?bad+' problem cells left. Which step fixes them?':'This is Bronze: raw data with '+bad+' problem cells. Switch on a step.');
    $('[data-gold]',m).disabled=bad!==0;if(bad!==0)$('[data-g]',m).innerHTML=''}
  m.addEventListener('change',e=>{const s=e.target.dataset.step;if(s){on[s]=e.target.checked;paint()}});
  $('[data-gold]',m).addEventListener('click',()=>{const g={};compute().forEach(r=>{g[r[0]]=g[r[0]]||[0,0];g[r[0]][0]+=+r[2];g[r[0]][1]+=+r[3]});
    $('[data-g]',m).innerHTML='<div class="tbl pop"><table><tr><th>hatchery</th><th>eggs_set</th><th>hatched</th><th>hatch rate</th></tr>'+Object.keys(g).map(k=>'<tr><td>'+esc(k)+'</td><td class="num">'+g[k][0]+'</td><td class="num">'+g[k][1]+'</td><td class="num">'+(g[k][1]/g[k][0]*100).toFixed(1)+' %</td></tr>').join('')+'</table></div>'});
  paint();
};

/* ---------- full vs incremental ---------- */
W.incremental=function(m){
  let src,day,wm,target,moved;
  function reset(){src=[{id:1,d:1},{id:2,d:1},{id:3,d:1},{id:4,d:1}];day=1;wm=0;target=0;moved=0;paint('The source has 4 rows. The target is empty.')}
  function paint(msg){m.innerHTML=card('Full load or incremental load?','<div class="stats"><span>Source rows <b>'+src.length+'</b></span><span>Target rows <b>'+target+'</b></span><span>Watermark <b>day '+wm+'</b></span><span>Rows moved in total <b>'+moved+'</b></span></div>'
    +'<div class="chips">'+src.map(r=>'<span class="chip'+(r.d>wm?' hot':'')+'">row '+r.id+' · day '+r.d+'</span>').join('')+'</div>'
    +'<div class="row"><button class="btn ghost" type="button" data-a="new">Next day: 2 new rows arrive</button><button class="btn" type="button" data-a="full">Run full load</button><button class="btn line" type="button" data-a="inc">Run incremental load</button><button class="btn ghost" type="button" data-a="reset">Reset</button></div><p class="out">'+msg+'</p>')}
  m.addEventListener('click',e=>{const a=e.target.dataset.a;if(!a)return;if(a==='reset')return reset();
    if(a==='new'){day++;src.push({id:src.length+1,d:day},{id:src.length+2,d:day});return paint('Day '+day+': 2 new rows are in the source. They are marked because they are newer than the watermark.')}
    if(a==='full'){moved+=src.length;target=src.length;wm=day;return paint('Full load copied all '+src.length+' rows again. Simple, but slow when the table is big.')}
    if(a==='inc'){const n=src.filter(r=>r.d>wm).length;moved+=n;target+=n;wm=day;return paint(n?'Incremental load copied only '+n+' new rows and moved the watermark to day '+day+'.':'Nothing newer than the watermark. 0 rows copied.')}});
  reset();
};

/* ---------- slowly changing dimension ---------- */
W.scd=function(m){
  let dim,facts,mode;
  function reset(){dim=[{k:1,name:'Nord',mgr:'Anna',from:'2024-01-01',to:'9999-12-31',cur:1}];facts=[{d:'2025-03',k:1,eggs:1000}];mode=null;paint('Hatchery Nord has the manager Anna. One fact row from March 2025 points to key 1.')}
  function paint(msg){const rep={};facts.forEach(f=>{const d=dim.find(x=>x.k===f.k);rep[d.mgr]=(rep[d.mgr]||0)+f.eggs});
    m.innerHTML=card('The manager of Nord changes to Ben in June 2026','<div class="row"><button class="btn" type="button" data-a="1"'+(mode?' disabled':'')+'>Apply as type 1 (overwrite)</button><button class="btn line" type="button" data-a="2"'+(mode?' disabled':'')+'>Apply as type 2 (keep history)</button><button class="btn ghost" type="button" data-a="r">Reset</button></div>'
     +'<div class="grid g2"><div><p class="small muted">dim_hatchery</p><div class="tbl"><table><tr><th>key</th><th>name</th><th>manager</th><th>valid_from</th><th>valid_to</th><th>current</th></tr>'+dim.map(d=>'<tr'+(d.fresh?' class="pop"':'')+'><td class="num">'+d.k+'</td><td>'+d.name+'</td><td>'+d.mgr+'</td><td class="num">'+d.from+'</td><td class="num">'+d.to+'</td><td>'+(d.cur?'yes':'no')+'</td></tr>').join('')+'</table></div></div>'
     +'<div><p class="small muted">fact_hatch</p><div class="tbl"><table><tr><th>month</th><th>hatchery_key</th><th>eggs_set</th></tr>'+facts.map(f=>'<tr><td class="num">'+f.d+'</td><td class="num">'+f.k+'</td><td class="num">'+f.eggs+'</td></tr>').join('')+'</table></div></div></div>'
     +'<p class="small muted">Report: eggs set by manager</p><div class="chips">'+Object.keys(rep).map(k=>'<span class="chip">'+k+': '+rep[k]+'</span>').join('')+'</div><p class="out">'+msg+'</p>')}
  m.addEventListener('click',e=>{const a=e.target.dataset.a;if(!a)return;if(a==='r')return reset();mode=a;
    if(a==='1'){dim[0].mgr='Ben';facts.push({d:'2026-10',k:1,eggs:1200});return paint('Type 1 overwrote the manager. A new fact from October 2026 arrived. The report now gives Ben all 2,200 eggs, also the 1,000 from Anna\'s time. History is lost.')}
    dim[0].to='2026-06-01';dim[0].cur=0;dim.push({k:2,name:'Nord',mgr:'Ben',from:'2026-06-01',to:'9999-12-31',cur:1,fresh:1});facts.push({d:'2026-10',k:2,eggs:1200});
    paint('Type 2 closed the old row and added a new row with key 2. The new fact from October 2026 points to key 2. The old fact still points to key 1. The report shows each manager with their own eggs.')});
  reset();
};

/* ---------- streaming windows ---------- */
W.windows=function(m){
  const EV=[3,7,8,15,22,24,25,31,40,41,43,52,58];let type='tumbling';
  const INFO={tumbling:'Tumbling, 10 seconds. Fixed pieces without overlap. Every event is counted exactly once.',hopping:'Hopping, size 10 seconds, hop 5 seconds. The windows overlap, so most events are counted twice.',sliding:'Sliding, 10 seconds. A window is produced for each event: "how many events in the 10 seconds up to now?"',session:'Session, gap 6 seconds. Events close together form a group. Silence longer than 6 seconds ends it.'};
  function wins(){const w=[];
    if(type==='tumbling')for(let s=0;s<60;s+=10)w.push([s,s+10]);
    if(type==='hopping')for(let s=0;s<=50;s+=5)w.push([s,s+10]);
    if(type==='sliding')EV.forEach(e=>w.push([Math.max(0,e-10),e]));
    if(type==='session'){let s=EV[0],p=EV[0];EV.slice(1).forEach(e=>{if(e-p>6){w.push([s,p+1]);s=e}p=e});w.push([s,p+1])}
    return w}
  function paint(){const w=wins(),X=t=>20+t*11,rows=type==='tumbling'||type==='session'?1:type==='hopping'?2:4;
    let s='<svg viewBox="0 0 700 '+(70+rows*26)+'" role="img" aria-label="Events on a time line with windows"><line x1="20" y1="30" x2="680" y2="30" stroke="var(--rule)" stroke-width="2"/>';
    for(let t=0;t<=60;t+=10)s+='<text x="'+X(t)+'" y="16" text-anchor="middle" font-size="11" fill="var(--muted)">'+t+'s</text><line x1="'+X(t)+'" y1="24" x2="'+X(t)+'" y2="36" stroke="var(--rule)"/>';
    EV.forEach((e,i)=>s+='<circle class="evt" style="animation-delay:'+(i*40)+'ms" cx="'+X(e)+'" cy="30" r="5" fill="var(--c)"/>');
    w.forEach((x,i)=>{const n=EV.filter(e=>type==='sliding'?(e>x[1]-10&&e<=x[1]):(e>=x[0]&&e<x[1])).length,y=50+(i%rows)*26;
      s+='<g class="win" style="animation-delay:'+(i*70)+'ms"><rect x="'+X(x[0])+'" y="'+y+'" width="'+Math.max(8,X(x[1])-X(x[0])-2)+'" height="20" rx="5" fill="color-mix(in srgb,var(--c) 22%,var(--surface))" stroke="var(--c)" stroke-width="1.5"/><text x="'+(X(x[0])+Math.max(8,X(x[1])-X(x[0]))/2)+'" y="'+(y+14)+'" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">'+n+'</text></g>'});
    m.innerHTML=card('Windows over a stream of 13 events','<div class="chips">'+Object.keys(INFO).map(k=>'<button type="button" class="chipb'+(k===type?' on':'')+'" data-k="'+k+'">'+k+'</button>').join('')+'</div><div class="svgbox">'+s+'</svg></div><p class="out">'+INFO[type]+' The number in each window is the count of events.</p>')}
  m.addEventListener('click',e=>{const b=e.target.closest('.chipb');if(b){type=b.dataset.k;paint()}});paint();
};

/* ---------- git graph ---------- */
W.gitgraph=function(m){
  let commits,tips,head,msg,n;
  function reset(){commits=[{id:'c1',b:'main',p:[]}];tips={main:'c1'};head='main';n=1;msg='A new repository with one commit on main.';paint()}
  function add(b,p){n++;const c={id:'c'+n,b,p};commits.push(c);tips[b]=c.id;return c}
  function paint(){const X=i=>30+i*52,Y=b=>b==='main'?36:92,pos={};commits.forEach((c,i)=>pos[c.id]=[X(i),Y(c.b)]);
    let s='<svg viewBox="0 0 '+Math.max(700,X(commits.length)+40)+' 130" role="img" aria-label="Git commit graph">';
    commits.forEach(c=>c.p.forEach(p=>s+='<path d="M'+pos[p][0]+' '+pos[p][1]+' C'+(pos[p][0]+26)+' '+pos[p][1]+' '+(pos[c.id][0]-26)+' '+pos[c.id][1]+' '+pos[c.id][0]+' '+pos[c.id][1]+'" fill="none" stroke="'+(c.b==='main'&&c.p.length<2?'var(--ink)':'var(--c)')+'" stroke-width="3"/>'));
    commits.forEach((c,i)=>s+='<circle'+(i===commits.length-1?' class="pop"':'')+' cx="'+pos[c.id][0]+'" cy="'+pos[c.id][1]+'" r="11" fill="'+(c.b==='main'?'var(--ink)':'var(--c)')+'" stroke="var(--surface)" stroke-width="3"/><text x="'+pos[c.id][0]+'" y="'+(pos[c.id][1]+4)+'" text-anchor="middle" font-size="9" fill="var(--bg)" font-weight="700">'+c.id+'</text>');
    Object.keys(tips).forEach(b=>{const p=pos[tips[b]];s+='<text x="'+p[0]+'" y="'+(b==='main'?p[1]-18:p[1]+28)+'" text-anchor="middle" font-size="12" font-weight="700" fill="var(--ink)">'+b+(head===b?' ← you':'')+'</text>'});
    const hasF=!!tips.feature,ahead=hasF&&commits.find(c=>c.id===tips.feature).b==='feature'&&!commits.some(c=>c.p.includes(tips.feature)&&c.b==='main');
    m.innerHTML=card('Git simulator','<div class="row"><button class="btn" type="button" data-a="commit">git commit</button><button class="btn ghost" type="button" data-a="branch"'+(hasF?' disabled':'')+'>git switch -c feature</button><button class="btn ghost" type="button" data-a="switch"'+(hasF?'':' disabled')+'>git switch '+(head==='main'?'feature':'main')+'</button><button class="btn line" type="button" data-a="merge"'+(head==='main'&&ahead?'':' disabled')+'>git merge feature</button><button class="btn ghost" type="button" data-a="reset">Reset</button></div><div class="svgbox">'+s+'</svg></div><p class="out" aria-live="polite">'+msg+'</p>')}
  m.addEventListener('click',e=>{const a=e.target.dataset.a;if(!a||e.target.disabled)return;if(a==='reset')return reset();
    if(a==='commit'){add(head,[tips[head]]);msg='New commit on '+head+'. The branch name moved forward to it.'}
    if(a==='branch'){tips.feature=tips[head];head='feature';msg='A new branch "feature" starts at the same commit. You are on it now. Commit to see the lines split.'}
    if(a==='switch'){head=head==='main'?'feature':'main';msg='You are now on '+head+'. Your files look like the last commit of this branch.'}
    if(a==='merge'){add('main',[tips.main,tips.feature]);msg='Merge commit: main now contains the work of feature. In a team this happens through a pull request.'}
    paint()});
  reset();
};

/* ---------- CI/CD pipeline ---------- */
W.cicd=function(m){
  const S=[['Commit','You save a change'],['Pull request','A colleague reviews'],['Build and test','Automatic checks'],['Dev','First deploy'],['Test','Users try it'],['Production','Customers use it']];
  m.innerHTML=card('',' <div class="stages">'+S.map((s,i)=>'<div class="stage" data-s="'+i+'">'+s[0]+'<small>'+s[1]+'</small></div>').join('')+'</div><div class="row"><button class="btn line" type="button" data-go>Push a change</button><label class="chk" style="font-size:.98rem"><input type="checkbox" data-bug>Put a bug in the code</label><button class="btn" type="button" data-ok hidden>Approve for Production</button></div><p class="out" aria-live="polite">Press the button and watch the change travel.</p>');
  const st=$$('.stage',m),out=$('.out',m),go=$('[data-go]',m),ok=$('[data-ok]',m);let approve;
  go.addEventListener('click',async()=>{go.disabled=true;ok.hidden=true;st.forEach(x=>x.className='stage');const bug=$('[data-bug]',m).checked;
    for(let i=0;i<S.length;i++){
      if(i===5){out.textContent='Test passed. A human must approve the last step.';ok.hidden=false;await new Promise(r=>approve=r);ok.hidden=true}
      st[i].classList.add('run');out.textContent=S[i][0]+' is running ...';await A().sleep(700);st[i].classList.remove('run');
      if(i===2&&bug){st[i].classList.add('fail');out.textContent='A test failed. The pipeline stopped. Production was never touched. Fix the bug and push again.';go.disabled=false;return}
      st[i].classList.add('pass')}
    out.textContent='Done. The same steps run for every change, so releases are boring and safe.';go.disabled=false});
  ok.addEventListener('click',()=>approve&&approve());
};

/* ---------- tokens and cost ---------- */
W.tokens=function(m){
  const uid=Math.random().toString(36).slice(2,7);
  m.innerHTML=card('Text into tokens','<label class="small" for="tk-'+uid+'">Type a sentence</label><textarea id="tk-'+uid+'" style="min-height:64px">The incubator temperature was unusually high yesterday.</textarea><div class="chips" data-out></div><p class="out" data-sum></p>'
   +'<div class="row"><label class="small" for="tp-'+uid+'">Price per million input tokens (€)</label><input id="tp-'+uid+'" type="number" value="2" min="0" step="0.1" style="width:90px"><label class="small" for="tr-'+uid+'">Requests per day</label><input id="tr-'+uid+'" type="number" value="2000" min="0" step="100" style="width:110px"></div><p class="small muted">This demo cuts words by simple rules. A real tokenizer learned its pieces from data and cuts differently, but the idea is the same.</p>');
  const ta=$('textarea',m);
  function tok(t){const out=[];(t.match(/[A-Za-zÀ-ÿ]+|\d+|[^\sA-Za-zÀ-ÿ\d]/g)||[]).forEach(w=>{if(w.length<=5||!/[A-Za-zÀ-ÿ]/.test(w))out.push(w);else{let i=0;while(i<w.length){const n=w.length-i<=5?w.length-i:4;out.push(w.slice(i,i+n));i+=n}}});return out}
  function paint(){const t=tok(ta.value),p=+$('#tp-'+uid,m).value||0,r=+$('#tr-'+uid,m).value||0;
    $('[data-out]',m).innerHTML=t.map((x,i)=>'<span class="tokc t'+(i%5)+'" style="animation-delay:'+Math.min(i*25,900)+'ms">'+esc(x)+'</span>').join('');
    const perDay=t.length*r*p/1e6;$('[data-sum]',m).innerHTML='<b>'+t.length+'</b> tokens from '+(ta.value.trim().split(/\s+/).filter(Boolean).length)+' words. As the input of every request: about <b>'+(perDay<0.01?perDay.toFixed(4):perDay.toFixed(2))+' €</b> a day, <b>'+(perDay*30).toFixed(2)+' €</b> a month. A real prompt with documents has thousands of tokens.'}
  m.addEventListener('input',paint);paint();
};

/* ---------- next token and temperature ---------- */
W.nexttok=function(m){
  const P=[['The hen laid an',[['egg',5.2],['enormous',2.6],['extra',2.1],['unusual',1.8],['apple',0.2]]],['SELECT * FROM',[['table',3.4],['dbo',3.1],['customers',2.9],['orders',2.8],['the',0.9]]],['Guten Morgen, wie geht es',[['Ihnen',4.6],['dir',4.3],['euch',2.4],['uns',1.0],['mir',0.4]]]];
  let cur=0,T=1,tally={};const uid=Math.random().toString(36).slice(2,7);
  function probs(){const z=P[cur][1].map(c=>Math.exp(c[1]/T)),s=z.reduce((a,b)=>a+b,0);return z.map(x=>x/s)}
  function paint(){const pr=probs();
    m.innerHTML=card('Which token comes next?','<div class="chips">'+P.map((p,i)=>'<button type="button" class="chipb'+(i===cur?' on':'')+'" data-i="'+i+'">'+esc(p[0])+' …</button>').join('')+'</div>'
     +'<div class="bars">'+P[cur][1].map((c,i)=>'<div class="brow"><span>'+esc(c[0])+'</span><span class="bbar"><i style="width:'+(pr[i]*100).toFixed(1)+'%"></i></span><span class="num">'+(pr[i]*100).toFixed(0)+' %</span><span class="num muted">'+(tally[i]?'×'+tally[i]:'')+'</span></div>').join('')+'</div>'
     +'<label class="small" for="nt-'+uid+'">Temperature <b>'+T.toFixed(1)+'</b></label><input id="nt-'+uid+'" type="range" min="0.1" max="2" step="0.1" value="'+T+'" data-t><div class="row"><button class="btn line" type="button" data-s>Pick 20 times</button></div>'
     +'<p class="out">'+(T<=0.3?'Low temperature: almost always the top token. Predictable.':T>=1.5?'High temperature: unlikely tokens get a real chance. Creative, and more often wrong.':'Medium temperature: mostly the likely tokens, sometimes a surprise.')+'</p>')}
  m.addEventListener('input',e=>{if(e.target.matches('[data-t]')){T=+e.target.value;tally={};paint();const r=$('[data-t]',m);r&&r.focus()}});
  m.addEventListener('click',e=>{const b=e.target.closest('.chipb');if(b){cur=+b.dataset.i;tally={};paint()}
    if(e.target.closest('[data-s]')){const pr=probs();tally={};for(let k=0;k<20;k++){let r=Math.random(),i=0;while(r>pr[i]&&i<pr.length-1){r-=pr[i];i++}tally[i]=(tally[i]||0)+1}paint()}});
  paint();
};

/* ---------- embeddings map ---------- */
W.embed=function(m){
  const PT=[['hen',120,70,0],['chick',150,95,0],['egg',175,60,0],['rooster',95,105,0],['incubator',215,110,0],['invoice',520,80,1],['payment',560,115,1],['customer',480,125,1],['price',585,65,1],['pipeline',330,230,2],['database',380,255,2],['query',300,265,2],['server',420,220,2],['temperature',260,150,0]];
  let sel=1;
  function paint(){const a=PT[sel],d=PT.map((p,i)=>({i,d:Math.hypot(p[1]-a[1],p[2]-a[2])})).filter(x=>x.i!==sel).sort((x,y)=>x.d-y.d),near=d.slice(0,3);
    let s='<svg viewBox="0 0 700 300" role="img" aria-label="Words as points. Similar words are close together">';
    near.forEach(x=>{const p=PT[x.i];s+='<line class="win" x1="'+a[1]+'" y1="'+a[2]+'" x2="'+p[1]+'" y2="'+p[2]+'" stroke="var(--c)" stroke-width="2" stroke-dasharray="4 4"/>'});
    PT.forEach((p,i)=>s+='<g class="pt" data-i="'+i+'" tabindex="0" role="button" aria-label="'+p[0]+'"><circle cx="'+p[1]+'" cy="'+p[2]+'" r="'+(i===sel?9:6)+'" fill="'+(i===sel?'var(--c)':['var(--ld)','var(--lo)','var(--lf)'][p[3]])+'" stroke="var(--surface)" stroke-width="2"/><text x="'+(p[1]+11)+'" y="'+(p[2]+4)+'" font-size="13" font-weight="'+(i===sel?700:500)+'" fill="var(--ink)">'+p[0]+'</text></g>');
    m.innerHTML=card('A map of meaning','<div class="svgbox">'+s+'</svg></div><p class="out">Nearest to <b>'+a[0]+'</b>: '+near.map(x=>PT[x.i][0]+' (similarity '+(1-x.d/520).toFixed(2)+')').join(', ')+'. Farthest: '+PT[d[d.length-1].i][0]+'.</p>')}
  m.addEventListener('click',e=>{const g=e.target.closest('.pt');if(g){sel=+g.dataset.i;paint()}});
  m.addEventListener('keydown',e=>{const g=e.target.closest('.pt');if(g&&(e.key==='Enter'||e.key===' ')){e.preventDefault();sel=+g.dataset.i;paint()}});
  paint();
};

/* ---------- prompt builder ---------- */
W.prompt=function(m){
  const PARTS=[['Context','I am a BI developer. Our customers are hatcheries. The data is in a SQL Server warehouse.'],['Task','Write a T-SQL query that returns the hatch rate per hatchery and ISO week for 2026.'],['Material','Table fact_hatch(date_key int, hatchery_key int, eggs_set int, hatched int). Table dim_hatchery(hatchery_key int, name varchar(50)). Table dim_date(date_key int, date date, iso_week int, year int).'],['Rules','Exclude rows where eggs_set = 0. Hatch rate = sum(hatched) / sum(eggs_set), as a percentage with one decimal.'],['Format','Return only the query in one code block, then two sentences on how you handled division by zero.'],['Example','Expected output row: Nord | 45 | 85.3']];
  const on=PARTS.map(()=>false);
  function paint(){const n=on.filter(Boolean).length,text=PARTS.filter((p,i)=>on[i]).map(p=>p[1]).join('\n\n')||'Write a query for hatch rate.';
    m.innerHTML=card('Build a prompt','<div class="row">'+PARTS.map((p,i)=>'<label class="chk" style="font-size:.98rem"><input type="checkbox" data-i="'+i+'"'+(on[i]?' checked':'')+'>'+p[0]+'</label>').join('')+'</div><pre style="white-space:pre-wrap"><code>'+esc(text)+'</code></pre>'
     +'<div class="bar"><i style="width:'+Math.round(n/6*100)+'%"></i></div><p class="out">'+(n===0?'This is the weak prompt. The model has to guess the tables, the definition and the format. Switch on the parts.':n<4?'Better. What would a new colleague still have to ask you?':n<6?'Good. One or two parts are missing.':'Complete. A colleague could do the task from this text alone. That is the test.')+'</p>'
     +'<div class="row needs-ai"><button class="btn" type="button" data-run>Run this prompt</button></div><div class="out" data-o aria-live="polite"></div>')}
  m.addEventListener('change',e=>{const i=e.target.dataset.i;if(i!==undefined){on[+i]=e.target.checked;paint()}});
  m.addEventListener('click',e=>{if(e.target.closest('[data-run]'))A().askAI($('pre code',m).textContent+'\n\nPlain text only.',$('[data-o]',m))});
  paint();
};

/* ---------- RAG demo ---------- */
const DOCS=['Hatch rate is the number of hatched chicks divided by the eggs set, times 100. A normal hatch rate is 80 to 88 percent.','Eggs stay in the setter for 18 days at 37.8 degrees Celsius. Then they move to the hatcher for 3 days.','If the hatch rate falls below 75 percent, check the temperature log and the age of the eggs first.','The nightly pipeline loads data from the ERP system into the lakehouse at 02:00. If it fails, the report shows old data.','Eggs older than 10 days have a lower hatch rate. Store eggs at 16 to 18 degrees before setting.','To give a new user access to the reports, add the user to the Viewer role in the workspace.'];
const STOP='a an the is are of to in on at for and or if it its my our your i we you they then from with into have has do does how what why when which who be as by this that not no than before first them long many much'.split(' ');
function toks(s){return s.toLowerCase().replace(/[^a-z0-9äöüß ]/g,' ').split(/\s+/).filter(w=>w&&STOP.indexOf(w)<0).map(w=>w.length>3?w.replace(/(ing|ed|es|s)$/,''):w)}
function vec(s){const v={};toks(s).forEach(w=>v[w]=(v[w]||0)+1);return v}
function cos(a,b){let d=0,na=0,nb=0;for(const k in a){na+=a[k]*a[k];if(b[k])d+=a[k]*b[k]}for(const k in b)nb+=b[k]*b[k];return na&&nb?d/Math.sqrt(na*nb):0}
W.rag=function(m){
  const QS=['What is a normal hatch rate?','Why does my report show old data?','How long do eggs stay in the setter?','How do I give a new colleague access?'];const uid=Math.random().toString(36).slice(2,7);
  m.innerHTML=card('','<label for="rq-'+uid+'"><b>Your question</b></label><div class="fill"><input id="rq-'+uid+'" style="flex:1 1 260px" value="'+QS[0]+'"><button class="btn line" type="button" data-run>Search</button></div><div class="row">'+QS.map(q=>'<button class="btn ghost small" type="button" data-q="'+esc(q)+'">'+esc(q)+'</button>').join('')+'</div>'
   +'<div class="steps"><div><h3>The question becomes numbers</h3><p class="small muted">Real systems use an embedding model. This demo simply counts the important words.</p><div class="chips" data-v></div></div><div><h3>Search: compare with every chunk</h3><div class="stack" style="gap:8px" data-c></div></div><div><h3>Build the prompt</h3><pre data-p style="white-space:pre-wrap"></pre></div>'
   +'<div><h3>The model answers</h3><p class="no-ai small muted">The model would now answer using only the two chunks above, and name them as sources. Open this page inside Claude to see a live answer here.</p><div class="row needs-ai"><button class="btn" type="button" data-ans>Ask the model with these chunks</button></div><div class="out" data-a aria-live="polite"></div></div></div>');
  let prompt='';const inp=$('input',m);
  function run(){const q=inp.value.trim();if(!q)return;const qv=vec(q);
    $('[data-v]',m).innerHTML=Object.keys(qv).map(w=>'<span class="chip">'+esc(w)+': '+qv[w]+'</span>').join('')||'<span class="muted small">No important words found. Try a longer question.</span>';
    const sc=DOCS.map((d,i)=>({i,s:cos(qv,vec(d))})).sort((a,b)=>b.s-a.s),top=sc.filter(x=>x.s>0).slice(0,2);
    $('[data-c]',m).innerHTML=sc.map(x=>'<div class="chunk'+(top.indexOf(x)>-1?' top':'')+'"><span>'+(top.indexOf(x)>-1?'<b>Chosen. </b>':'')+'Chunk '+(x.i+1)+': '+esc(DOCS[x.i])+'</span><span class="sc">'+x.s.toFixed(2)+'</span><span class="sbar"><i style="width:'+Math.round(x.s*100)+'%"></i></span></div>').join('');
    prompt=top.length?'Answer the question using only the sources. If the sources do not contain the answer, say you do not know. Name the source number.\n\n'+top.map(x=>'Source '+(x.i+1)+': '+DOCS[x.i]).join('\n')+'\n\nQuestion: '+q:'';
    $('[data-p]',m).textContent=prompt||'No chunk matched. A good RAG system now says: "I do not know."';$('[data-a]',m).textContent=''}
  m.addEventListener('click',e=>{if(e.target.dataset.q){inp.value=e.target.dataset.q;run()}if(e.target.closest('[data-run]'))run();
    if(e.target.closest('[data-ans]')){if(!prompt){$('[data-a]',m).textContent='I do not know. No source matched the question.';return}A().askAI(prompt+'\n\nAnswer in two or three short sentences of simple English. Plain text only.',$('[data-a]',m))}});
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')run()});run();
};

/* ---------- convolution ---------- */
W.conv=function(m){
  const N=14,O=12,K={'Vertical edges':[-1,0,1,-2,0,2,-1,0,1],'Horizontal edges':[-1,-2,-1,0,0,0,1,2,1],'Blur':[1,1,1,1,1,1,1,1,1].map(x=>x/9),'Sharpen':[0,-1,0,-1,5,-1,0,-1,0]};const uid=Math.random().toString(36).slice(2,7);
  m.innerHTML=card('','<div class="row"><label for="kn-'+uid+'"><b>Filter</b></label><select id="kn-'+uid+'">'+Object.keys(K).map(k=>'<option>'+k+'</option>').join('')+'</select><button class="btn line" type="button" data-play>Play</button><button class="btn ghost" type="button" data-shape>Square</button><button class="btn ghost" type="button" data-clear>Clear</button></div>'
   +'<div class="row" style="align-items:flex-start"><div><p class="small muted">Image (click to draw)</p><canvas width="224" height="224" data-in aria-label="Input image, click to draw"></canvas></div><div><p class="small muted">What the filter sees</p><canvas width="224" height="224" data-out aria-label="Filter output"></canvas></div></div><p class="out small" data-calc></p>');
  const ci=$('[data-in]',m),co=$('[data-out]',m),xi=ci.getContext('2d'),xo=co.getContext('2d'),sel=$('select',m);let img,pos=O*O,timer=null;
  function square(){img=new Array(N*N).fill(0);for(let y=4;y<10;y++)for(let x=4;x<10;x++)img[y*N+x]=1}
  function val(p){const k=K[sel.value],oy=Math.floor(p/O),ox=p%O;let s=0;for(let y=0;y<3;y++)for(let x=0;x<3;x++)s+=img[(oy+y)*N+ox+x]*k[y*3+x];return s}
  function draw(){const cs=224/N;for(let i=0;i<N*N;i++){xi.fillStyle=img[i]?'#f2f2f2':'#1b1b1b';xi.fillRect((i%N)*cs,Math.floor(i/N)*cs,cs-1,cs-1)}
    const os=224/O,edge=sel.selectedIndex<2;xo.fillStyle='#000';xo.fillRect(0,0,224,224);
    for(let p=0;p<Math.min(pos,O*O);p++){const v=val(p),b=Math.max(0,Math.min(1,edge?Math.abs(v)/4:v)),g=Math.round(27+b*215);xo.fillStyle='rgb('+g+','+g+','+g+')';xo.fillRect((p%O)*os,Math.floor(p/O)*os,os-1,os-1)}
    if(pos<O*O){const ox=pos%O,oy=Math.floor(pos/O);xi.strokeStyle='#ff5a7a';xi.lineWidth=3;xi.strokeRect(ox*cs+1,oy*cs+1,cs*3-3,cs*3-3);$('[data-calc]',m).textContent='Window at column '+(ox+1)+', row '+(oy+1)+': multiply 9 pixels by the 9 filter numbers and add them = '+val(pos).toFixed(2)}
    else $('[data-calc]',m).textContent='Bright output pixels are places where the filter found its pattern.'}
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function play(){stop();if(A().reduce){pos=O*O;draw();return}pos=0;draw();timer=setInterval(()=>{pos++;draw();if(pos>=O*O)stop()},22)}
  ci.addEventListener('click',e=>{const r=ci.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*N),y=Math.floor((e.clientY-r.top)/r.height*N);if(x<0||y<0||x>=N||y>=N)return;stop();img[y*N+x]=img[y*N+x]?0:1;pos=O*O;draw()});
  $('[data-play]',m).addEventListener('click',play);$('[data-shape]',m).addEventListener('click',()=>{stop();square();pos=O*O;draw()});
  $('[data-clear]',m).addEventListener('click',()=>{stop();img=new Array(N*N).fill(0);pos=O*O;draw()});sel.addEventListener('change',()=>{stop();pos=O*O;draw()});
  square();draw();
};

/* ---------- agent trace ---------- */
W.agent=function(m){
  const A1=[['goal','Why did the hatch rate at hatchery Süd drop last week?'],['think','I need to see which tables exist before I query anything.'],['act','list_tables()'],['obs','fact_hatch, dim_hatchery, dim_date, sensor_log'],['think','First confirm the drop: hatch rate per week for Süd.'],['act','run_sql("SELECT week, SUM(hatched)*100.0/SUM(eggs_set) FROM fact_hatch ... WHERE hatchery = \'Süd\' GROUP BY week")'],['obs','week 44: 84.1 %   week 45: 71.3 %'],['think','Confirmed: minus 13 points. The handbook says to check temperature first.'],['act','run_sql("SELECT machine, AVG(temp), MAX(temp) FROM sensor_log WHERE hatchery = \'Süd\' AND week = 45 GROUP BY machine")'],['obs','S1: avg 37.8 max 38.0   S2: avg 37.8 max 38.1   S3: avg 38.9 max 40.2'],['think','Machine S3 ran too hot. I could mark its batches as "under review" in the table.'],['gate','update_table("fact_hatch", set status = \'review\' where machine = \'S3\' and week = 45)']];
  const YES=[['obs','3 rows updated.'],['answer','The hatch rate at Süd fell from 84.1 % to 71.3 %. Machine S3 ran at up to 40.2 °C in week 45, well above the normal 37.8 °C. I marked the three S3 batches as "under review". Please have the machine checked.']];
  const NO=[['obs','The user did not approve this action.'],['answer','The hatch rate at Süd fell from 84.1 % to 71.3 %. Machine S3 ran at up to 40.2 °C in week 45, well above the normal 37.8 °C. I did not change any data. I recommend checking machine S3 and reviewing its three batches.']];
  const LAB={goal:'Goal',think:'Think',act:'Act: call a tool',obs:'Look: tool result',gate:'Wants to change data',answer:'Answer'};
  let steps,i,wait;
  function reset(){steps=A1.slice();i=1;wait=false;paint()}
  function paint(){const cur=steps[i-1][0],ph=cur==='think'?0:cur==='act'||cur==='gate'?1:cur==='obs'?2:-1;
    m.innerHTML=card('Watch an agent work','<div class="loop">'+['Think','Act','Look'].map((x,k)=>'<span class="lnode'+(k===ph?' on':'')+'">'+x+'</span>').join('<span class="larr" aria-hidden="true">→</span>')+'<span class="larr" aria-hidden="true">↺</span></div>'
     +'<ol class="trace">'+steps.slice(0,i).map((s,k)=>'<li class="t-'+s[0]+(k===i-1?' pop':'')+'"><b>'+LAB[s[0]]+'</b><span>'+esc(s[1])+'</span></li>').join('')+'</ol>'
     +(wait?'<p class="fb no">This tool changes data. The program around the model stops and asks a human.</p><div class="row"><button class="btn" type="button" data-a="yes">Approve</button><button class="btn line" type="button" data-a="no">Do not approve</button></div>'
       :i<steps.length?'<div class="row"><button class="btn line" type="button" data-a="next">Next step</button><button class="btn ghost" type="button" data-a="reset">Start again</button></div>'
       :'<p class="out">Finished in '+steps.filter(s=>s[0]==='act'||s[0]==='gate').length+' tool calls. Notice: the model never touched the database itself. It asked, and the program ran the calls with the permissions it was given.</p><div class="row"><button class="btn ghost" type="button" data-a="reset">Start again</button></div>'))}
  m.addEventListener('click',e=>{const a=e.target.dataset.a;if(!a)return;if(a==='reset')return reset();
    if(a==='next'){i++;if(steps[i-1][0]==='gate')wait=true;return paint()}
    if(a==='yes'||a==='no'){steps=steps.concat(a==='yes'?YES:NO);wait=false;i++;paint()}});
  reset();
};

/* ---------- precision and recall ---------- */
W.confusion=function(m){
  const S=[];let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  for(let k=0;k<60;k++){const bad=k<18;S.push({bad,s:Math.max(0.02,Math.min(0.98,(bad?0.68:0.3)+(rnd()-0.5)*0.6))})}
  let th=0.5;const uid=Math.random().toString(36).slice(2,7);
  function paint(){let tp=0,fp=0,fn=0,tn=0;S.forEach(x=>{const f=x.s>=th;if(f&&x.bad)tp++;else if(f)fp++;else if(x.bad)fn++;else tn++});
    const p=tp+fp?tp/(tp+fp):0,r=tp/(tp+fn),f1=p+r?2*p*r/(p+r):0;
    m.innerHTML=card('60 batches, 18 of them really bad','<div class="strip">'+S.slice().sort((a,b)=>a.s-b.s).map(x=>'<span class="dot '+(x.bad?'isbad':'isok')+(x.s>=th?' flag':'')+'" style="left:'+(x.s*100)+'%" title="score '+x.s.toFixed(2)+'"></span>').join('')+'<span class="thr" style="left:'+(th*100)+'%"></span></div>'
     +'<p class="small muted">Each dot is a batch, placed by the model\'s score. Red = really bad. Everything right of the line is flagged.</p><label class="small" for="cf-'+uid+'">Threshold <b>'+th.toFixed(2)+'</b></label><input id="cf-'+uid+'" type="range" min="0.05" max="0.95" step="0.01" value="'+th+'" data-t>'
     +'<div class="grid g4c"><div class="cm good"><b>'+tp+'</b>bad, flagged</div><div class="cm warnc"><b>'+fp+'</b>good, flagged (false alarm)</div><div class="cm badc"><b>'+fn+'</b>bad, missed</div><div class="cm"><b>'+tn+'</b>good, not flagged</div></div>'
     +'<div class="stats"><span>Precision <b>'+(p*100).toFixed(0)+' %</b></span><span>Recall <b>'+(r*100).toFixed(0)+' %</b></span><span>F1 <b>'+(f1*100).toFixed(0)+' %</b></span><span>Accuracy <b>'+((tp+tn)/60*100).toFixed(0)+' %</b></span></div>'
     +'<p class="out">'+(th<0.3?'Low threshold: you catch almost every bad batch, and raise many false alarms.':th>0.7?'High threshold: few false alarms, but many bad batches slip through.':'In the middle. Which side to lean to depends on what a miss costs and what a false alarm costs.')+'</p>')}
  m.addEventListener('input',e=>{if(e.target.matches('[data-t]')){th=+e.target.value;paint();const r=$('[data-t]',m);r&&r.focus()}});paint();
};

/* ---------- gradient descent ---------- */
W.descent=function(m){
  let x=-2.6,lr=0.1,hist=[x],timer=null;const uid=Math.random().toString(36).slice(2,7),f=v=>v*v,X=v=>350+v*105,Y=v=>250-Math.min(f(v),9.5)*24;
  function paint(msg){let path='';for(let v=-3.1;v<=3.1;v+=0.1)path+=(path?'L':'M')+X(v).toFixed(1)+' '+Y(v).toFixed(1);
    let tr='';hist.forEach((h,i)=>{if(i)tr+='<line x1="'+X(hist[i-1])+'" y1="'+Y(hist[i-1])+'" x2="'+X(h)+'" y2="'+Y(h)+'" stroke="var(--c)" stroke-width="1.5" opacity=".5"/>'});
    m.innerHTML=card('Walk downhill on the loss','<div class="svgbox"><svg viewBox="0 0 700 270" role="img" aria-label="A loss curve with a ball that moves downhill"><path d="'+path+'" fill="none" stroke="var(--ink)" stroke-width="2.5"/><text x="350" y="266" text-anchor="middle" font-size="12" fill="var(--muted)">weight</text><text x="14" y="20" font-size="12" fill="var(--muted)">loss</text>'+tr+'<circle class="ball" cx="'+X(Math.max(-3.2,Math.min(3.2,x)))+'" cy="'+Y(x)+'" r="10" fill="var(--c)" stroke="var(--surface)" stroke-width="2"/></svg></div>'
     +'<label class="small" for="gd-'+uid+'">Learning rate <b>'+lr.toFixed(2)+'</b></label><input id="gd-'+uid+'" type="range" min="0.02" max="1.1" step="0.02" value="'+lr+'" data-l><div class="row"><button class="btn" type="button" data-a="step">One step</button><button class="btn line" type="button" data-a="run">Run 25 steps</button><button class="btn ghost" type="button" data-a="reset">Reset</button></div>'
     +'<div class="stats"><span>Steps <b>'+(hist.length-1)+'</b></span><span>Loss <b>'+(f(x)>999?'huge':f(x).toFixed(3))+'</b></span></div><p class="out">'+(msg||'Each step moves the weight against the slope: new = old − learning rate × slope.')+'</p>')}
  function step(){x=x-lr*2*x;hist.push(x)}
  function verdict(){return Math.abs(x)>3.2?'It jumped out of the valley. The learning rate is too high: every step overshoots more than the last.':f(x)<0.001?'It reached the bottom in '+(hist.length-1)+' steps.':lr<0.06?'It crawls. The learning rate is too low: it would need many more steps.':lr>0.9?'It jumps from side to side and gets down only slowly.':'It is getting close.'}
  m.addEventListener('input',e=>{if(e.target.matches('[data-l]')){lr=+e.target.value;paint();const r=$('[data-l]',m);r&&r.focus()}});
  m.addEventListener('click',e=>{const a=e.target.dataset.a;if(!a)return;clearInterval(timer);
    if(a==='reset'){x=-2.6;hist=[x];return paint()}
    if(a==='step'){step();return paint(verdict())}
    if(a==='run'){if(A().reduce){for(let k=0;k<25;k++)step();return paint(verdict())}let k=0;timer=setInterval(()=>{step();k++;paint(verdict());if(k>=25||Math.abs(x)>50)clearInterval(timer)},130)}});
  paint();
};

/* ---------- three-point estimate ---------- */
W.pert=function(m){
  const uid=Math.random().toString(36).slice(2,7);
  m.innerHTML=card('Three-point estimate','<div class="row"><label class="small" for="pa-'+uid+'">Best case (days)</label><input id="pa-'+uid+'" type="number" value="2" min="0" step="0.5" style="width:80px"><label class="small" for="pb-'+uid+'">Likely</label><input id="pb-'+uid+'" type="number" value="4" min="0" step="0.5" style="width:80px"><label class="small" for="pc-'+uid+'">Bad case</label><input id="pc-'+uid+'" type="number" value="12" min="0" step="0.5" style="width:80px"></div><div class="pertbar"><i data-b></i><span data-e></span></div><p class="out" data-o></p>');
  function paint(){const o=+$('#pa-'+uid,m).value||0,l=+$('#pb-'+uid,m).value||0,p=+$('#pc-'+uid,m).value||0;
    if(!(o<=l&&l<=p)||p===0){$('[data-o]',m).textContent='Best case ≤ likely ≤ bad case, please.';return}
    const e=(o+4*l+p)/6,sd=(p-o)/6,hi=e+2*sd,pc=v=>(v-o)/(p-o||1)*100;
    $('[data-b]',m).style.cssText='left:'+pc(Math.max(o,e-sd))+'%;width:'+(pc(Math.min(p,e+sd))-pc(Math.max(o,e-sd)))+'%';$('[data-e]',m).style.left=pc(e)+'%';
    $('[data-o]',m).innerHTML='Expected: <b>'+e.toFixed(1)+' days</b>. Say: "about '+Math.round(e)+' days, and up to '+Math.ceil(Math.min(p,hi))+' if things go badly." '+(p-l>2*(l-o)?'The bad case is far from the likely case. Name the risk that causes it, and check that risk first.':'')}
  m.addEventListener('input',paint);paint();
};
})();
