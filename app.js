(function(){
'use strict';
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep=ms=>new Promise(r=>setTimeout(r,reduce?0:ms));
const T=window.TRACKS, ORDER=['fabric','devops','deutsch','ai'];
const VIEWS=['start','fabric','devops','deutsch','ai','news'];

/* ---------- progress (this browser only) ---------- */
const KEY='fahrplan-v1'; let P={};
try{P=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){P={}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){} paintProgress()}
function totals(k){let done=0,all=0;T[k].stations.forEach(s=>{all++;if(P[s.id])done++;s.ex.forEach((_,i)=>{all++;if(P[s.id+':'+i])done++})});return{done,all,pct:all?Math.round(done/all*100):0}}
function paintProgress(){ORDER.forEach(k=>{const t=totals(k);$$('[data-pct="'+k+'"]').forEach(e=>e.textContent=t.pct+'%');$$('[data-bar="'+k+'"]').forEach(e=>e.style.width=t.pct+'%');$$('[data-cnt="'+k+'"]').forEach(e=>e.textContent=t.done+' of '+t.all+' steps done')});
  $$('details.st').forEach(d=>d.classList.toggle('done',!!P[d.dataset.id]))}

/* ---------- exercises ---------- */
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function exHTML(sid,ex,i){
  const id=sid+':'+i, head='<p class="q">'+esc(ex.q)+'</p>';
  let inner='';
  if(ex.t==='mcq') inner='<div class="opts">'+ex.o.map((o,j)=>'<button type="button" class="opt" data-j="'+j+'">'+esc(o)+'</button>').join('')+'</div>';
  if(ex.t==='fill') inner='<div class="fill"><label class="small muted" for="in-'+id+'">Your answer</label><input id="in-'+id+'" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="button" class="btn" data-check>Check</button></div>';
  if(ex.t==='order') inner='<div class="tiles ans" aria-label="Your answer"></div><div class="tiles pool"></div><div class="row"><button type="button" class="btn ghost" data-reset>Start again</button></div>';
  return '<div class="ex'+(P[id]?' ok':'')+'" data-ex="'+id+'" data-sid="'+sid+'" data-i="'+i+'">'+head+inner+'<p class="fb'+(P[id]?' good':'')+'" aria-live="polite">'+(P[id]?'Done. '+esc(ex.w):'')+'</p></div>';
}
function findEx(el){const box=el.closest('.ex');const st=stationById(box.dataset.sid);return{box,ex:st.ex[+box.dataset.i],id:box.dataset.ex}}
function stationById(id){for(const k of ORDER){const s=T[k].stations.find(s=>s.id===id);if(s)return s}}
function right(box,id,ex){box.classList.add('ok');const fb=$('.fb',box);fb.className='fb good';fb.textContent='Correct. '+ex.w;P[id]=1;save()}
function wrong(box,msg){const fb=$('.fb',box);fb.className='fb no';fb.textContent=msg}
function setupOrder(box,ex){const pool=$('.pool',box),ans=$('.ans',box);ans.innerHTML='';pool.innerHTML=shuffle(ex.items.map((t,i)=>i)).map(i=>'<button type="button" class="tile" data-k="'+i+'">'+esc(ex.items[i])+'</button>').join('')}
document.addEventListener('click',e=>{
  const opt=e.target.closest('.opt');
  if(opt){const {box,ex,id}=findEx(opt);$$('.opt',box).forEach(b=>b.classList.remove('wrong','right'));
    if(+opt.dataset.j===ex.a){opt.classList.add('right');right(box,id,ex)}else{opt.classList.add('wrong');wrong(box,'Not this one. Try again.')}return}
  if(e.target.closest('[data-check]')){const {box,ex,id}=findEx(e.target);const v=$('input',box).value.trim().toLowerCase().replace(/[."]/g,'');
    if(!v){wrong(box,'Type an answer first.');return}
    if(ex.a.indexOf(v)>-1)right(box,id,ex);else wrong(box,'Not yet. Read the text above again and try once more.');return}
  const tile=e.target.closest('.tile');
  if(tile){const {box,ex,id}=findEx(tile);const pool=$('.pool',box),ans=$('.ans',box);
    (tile.parentNode===pool?ans:pool).appendChild(tile);
    if(!pool.children.length){const ok=$$('.tile',ans).every((t,i)=>ex.items[+t.dataset.k]===ex.items[i]);if(ok)right(box,id,ex);else wrong(box,'The order is not right yet. Click a tile to move it back.')}
    return}
  if(e.target.closest('[data-reset]')){const {box,ex}=findEx(e.target);setupOrder(box,ex);$('.fb',box).textContent='';return}
});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.fill input')){e.preventDefault();$('[data-check]',e.target.parentNode).click()}});
document.addEventListener('change',e=>{if(e.target.matches('[data-done]')){if(e.target.checked)P[e.target.dataset.done]=1;else delete P[e.target.dataset.done];save()}});

/* ---------- track view ---------- */
function stationHTML(k,s){
  const tr=T[k];
  return '<details class="st" id="st-'+s.id+'" data-id="'+s.id+'"><summary><span class="no">'+s.id+'</span><span class="stt">'+esc(s.t)+'</span><span class="sum">'+esc(s.sum)+'</span></summary><div class="stb">'
   +'<div class="explain">'+s.body+'</div>'
   +(s.know?'<div class="know"><b>'+(k==='ai'?'In your world: ':'You already know this: ')+'</b>'+s.know+'</div>':'')
   +(s.widget?'<div class="widget" data-w="'+s.widget+'"></div>':'')
   +(s.ex.length?'<div><h4>Check yourself</h4></div><div class="exs">'+s.ex.map((x,i)=>exHTML(s.id,x,i)).join('')+'</div>':'')
   +(s.do&&s.do.length?'<div class="do"><h4>Now do it for real</h4><ol>'+s.do.map(d=>'<li>'+d+'</li>').join('')+'</ol><label class="chk"><input type="checkbox" data-done="'+s.id+'"'+(P[s.id]?' checked':'')+'>I did this</label></div>':'')
   +(s.links&&s.links.length?'<div class="links">'+s.links.map(l=>'<a href="'+l[1]+'" target="_blank" rel="noopener">'+esc(l[0])+' &#8599;</a>').join('')+'</div>':'')
   +'</div></details>';
}
function renderTrack(k){
  const tr=T[k], v=$('#v-'+k);
  v.innerHTML='<div class="stack c-'+tr.c+'"><div class="linehead"><span class="badge c-'+tr.c+'">'+tr.letter+'</span><div><h1>'+esc(tr.name)+'</h1><p class="muted">'+esc(tr.goal)+'</p></div></div>'
   +'<p class="lead">'+esc(tr.intro)+'</p>'
   +'<div class="card prog c-'+tr.c+'"><div class="row" style="justify-content:space-between"><span class="pct" data-pct="'+k+'">0%</span><span class="muted small" data-cnt="'+k+'"></span></div><div class="bar"><i data-bar="'+k+'"></i></div><div class="row"><button class="btn line" type="button" data-next="'+k+'">Go to my next station</button></div></div>'
   +'<div class="line">'+tr.stations.map(s=>stationHTML(k,s)).join('')+'</div></div>';
  $$('.ex',v).forEach(box=>{const st=stationById(box.dataset.sid),ex=st.ex[+box.dataset.i];if(ex.t==='order')setupOrder(box,ex)});
  $$('.widget',v).forEach(m=>{const f=WIDGETS[m.dataset.w];if(f)f(m)});
}
function nextStation(k){const s=T[k].stations.find(s=>!P[s.id])||T[k].stations[0];if(location.hash!=='#'+k)location.hash=k;setTimeout(()=>{const d=$('#st-'+s.id);if(d){d.open=true;d.scrollIntoView({block:'start'})}},60)}
document.addEventListener('click',e=>{const b=e.target.closest('[data-next]');if(b)nextStation(b.dataset.next)});

/* ---------- widgets ---------- */
const WIDGETS={};

WIDGETS.flow=function(m){
  const N=[['Sources','ERP, files, sensors','Where data is born. For you: Business Central, SQL databases, CSV files from customers.'],
   ['Ingest','Pipeline, Dataflow, Eventstream','Brings data in. A pipeline copies on a schedule. A dataflow cleans with clicks. An eventstream catches live events.'],
   ['Store','OneLake: Lakehouse, Warehouse','Everything is saved in OneLake as Delta tables. Bronze is raw, Silver is clean, Gold is ready for reports.'],
   ['Transform','Notebook, T-SQL, KQL','Clean, join and sum the data. Spark notebooks for big data, T-SQL in the warehouse, KQL for live data.'],
   ['Serve','Semantic model, Power BI','The model defines measures like hatch rate. Reports read from it. This is what the customer sees.']];
  m.innerHTML='<div class="flow">'+N.map((n,i)=>(i?'<span class="pipe" aria-hidden="true"></span>':'')+'<button type="button" class="node" data-n="'+i+'" aria-pressed="'+(i===0)+'"><b>'+n[0]+'</b><span>'+n[1]+'</span></button>').join('')+'</div><p class="out" style="margin-top:10px">'+N[0][2]+'</p>';
  m.addEventListener('click',e=>{const b=e.target.closest('.node');if(!b)return;$$('.node',m).forEach(x=>x.setAttribute('aria-pressed',x===b));$('.out',m).textContent=N[+b.dataset.n][2]});
};

WIDGETS.medallion=function(m){
  const RAW=[['Nord','2026-11-02','1000','850'],['Nord','2026-11-02','1000','850'],['Süd','02.11.2026','1200',''],['süd ','2026-11-03','1100','968'],['West','2026-11-03','abc','700'],['Nord','2026-11-03','900','774']];
  const STEPS=[['names','Clean the names','df = df.withColumn("hatchery", initcap(trim("hatchery")))'],
   ['dates','Use one date format','df = df.withColumn("date", coalesce(to_date("date","yyyy-MM-dd"), to_date("date","dd.MM.yyyy")))'],
   ['nums','Turn text into numbers','df = df.withColumn("eggs_set", col("eggs_set").cast("int")).withColumn("hatched", col("hatched").cast("int"))'],
   ['dedupe','Remove duplicate rows','df = df.dropDuplicates()'],
   ['nulls','Remove rows with missing numbers','df = df.dropna(subset=["eggs_set","hatched"])']];
  const on={};
  m.innerHTML='<div class="stack" style="gap:12px"><div class="row">'+STEPS.map(s=>'<label class="chk" style="font-size:.98rem"><input type="checkbox" data-step="'+s[0]+'">'+s[1]+'</label>').join('')+'</div>'
   +'<div class="tbl" data-t></div><pre data-code><code># your notebook code appears here</code></pre><p class="out" data-msg></p>'
   +'<div class="row"><button class="btn line" type="button" data-gold disabled>Build the Gold table</button></div><div class="tbl" data-g></div></div>';
  const num=v=>/^\d+$/.test(v);
  function compute(){
    let rows=RAW.map(r=>r.slice());
    if(on.names)rows.forEach(r=>{const s=r[0].trim();r[0]=s.charAt(0).toUpperCase()+s.slice(1).toLowerCase()});
    if(on.dates)rows.forEach(r=>{const x=r[1].match(/^(\d\d)\.(\d\d)\.(\d{4})$/);if(x)r[1]=x[3]+'-'+x[2]+'-'+x[1]});
    if(on.nums)rows.forEach(r=>{[2,3].forEach(c=>{if(!num(r[c]))r[c]='null'})});
    if(on.dedupe){const seen={};rows=rows.filter(r=>{const k=r.join('|');if(seen[k])return false;seen[k]=1;return true})}
    if(on.nulls)rows=rows.filter(r=>r[2]!=='null'&&r[3]!=='null'&&r[2]!==''&&r[3]!=='');
    return rows;
  }
  function paint(){
    const rows=compute(),seen={};let bad=0;
    const body=rows.map(r=>{const k=r.join('|'),dup=seen[k];seen[k]=1;
      const flags=[dup||r[0]!==r[0].trim()||r[0].charAt(0)!==r[0].charAt(0).toUpperCase(),dup||!/^\d{4}-\d\d-\d\d$/.test(r[1]),dup||!num(r[2]),dup||!num(r[3])];
      return '<tr>'+r.map((c,i)=>{if(flags[i])bad++;return '<td class="'+(flags[i]?'bad ':'')+(i>1?'num':'')+'">'+(c===''?'(empty)':esc(c))+'</td>'}).join('')+'</tr>'}).join('');
    $('[data-t]',m).innerHTML='<table><tr><th>hatchery</th><th>date</th><th>eggs_set</th><th>hatched</th></tr>'+body+'</table>';
    const code=STEPS.filter(s=>on[s[0]]).map(s=>s[2]).join('\n');
    $('[data-code] code',m).textContent=code||'# your notebook code appears here';
    const any=STEPS.some(s=>on[s[0]]);
    $('[data-msg]',m).textContent=bad===0?'Silver is clean: '+rows.length+' good rows. Now build Gold.':(any?bad+' problem cells left. Which step fixes them?':'This is Bronze: raw data with '+bad+' problem cells. Switch on a step.');
    $('[data-gold]',m).disabled=bad!==0;if(bad!==0)$('[data-g]',m).innerHTML='';
  }
  m.addEventListener('change',e=>{const s=e.target.dataset.step;if(s){on[s]=e.target.checked;paint()}});
  $('[data-gold]',m).addEventListener('click',()=>{const g={};compute().forEach(r=>{g[r[0]]=g[r[0]]||[0,0];g[r[0]][0]+=+r[2];g[r[0]][1]+=+r[3]});
    $('[data-g]',m).innerHTML='<table><tr><th>hatchery</th><th>eggs_set</th><th>hatched</th><th>hatch rate</th></tr>'+Object.keys(g).map(k=>'<tr><td>'+esc(k)+'</td><td class="num">'+g[k][0]+'</td><td class="num">'+g[k][1]+'</td><td class="num">'+(g[k][1]/g[k][0]*100).toFixed(1)+' %</td></tr>').join('')+'</table><pre><code>gold = df.groupBy("hatchery").agg(sum("eggs_set"), sum("hatched"))</code></pre>'});
  paint();
};

WIDGETS.incremental=function(m){
  let src,day,wm,target,moved;
  function reset(){src=[{id:1,d:1},{id:2,d:1},{id:3,d:1},{id:4,d:1}];day=1;wm=0;target=0;moved=0;paint('The source has 4 rows. The target is empty.')}
  function paint(msg){
    m.innerHTML='<div class="card stack" style="gap:12px"><h4>Full load or incremental load?</h4>'
     +'<div class="row"><span>Source rows: <b>'+src.length+'</b></span><span>Target rows: <b>'+target+'</b></span><span>Watermark: <b>day '+wm+'</b></span><span>Rows moved in total: <b>'+moved+'</b></span></div>'
     +'<div class="chips">'+src.map(r=>'<span class="chip"'+(r.d>wm?' style="outline:2px solid var(--c)"':'')+'>row '+r.id+' · day '+r.d+'</span>').join('')+'</div>'
     +'<div class="row"><button class="btn ghost" type="button" data-a="new">Next day: 2 new rows arrive</button><button class="btn" type="button" data-a="full">Run full load</button><button class="btn line" type="button" data-a="inc">Run incremental load</button><button class="btn ghost" type="button" data-a="reset">Reset</button></div>'
     +'<p class="out">'+msg+'</p></div>';
  }
  m.addEventListener('click',e=>{const a=e.target.dataset.a;if(!a)return;
    if(a==='reset')return reset();
    if(a==='new'){day++;src.push({id:src.length+1,d:day},{id:src.length+2,d:day});return paint('Day '+day+': 2 new rows are in the source. They have a frame because they are newer than the watermark.')}
    if(a==='full'){moved+=src.length;target=src.length;wm=day;return paint('Full load copied all '+src.length+' rows again. Simple, but slow when the table is big.')}
    if(a==='inc'){const n=src.filter(r=>r.d>wm).length;moved+=n;target+=n;wm=day;return paint(n?'Incremental load copied only '+n+' new rows and moved the watermark to day '+day+'.':'Nothing newer than the watermark. 0 rows copied.')}
  });
  reset();
};

WIDGETS.cicd=function(m){
  const S=[['Commit','You save a change'],['Pull request','A colleague reviews'],['Build and test','Automatic checks'],['Dev','First deploy'],['Test','Users try it'],['Production','Customers use it']];
  m.innerHTML='<div class="card stack" style="gap:12px"><div class="stages">'+S.map((s,i)=>'<div class="stage" data-s="'+i+'">'+s[0]+'<small>'+s[1]+'</small></div>').join('')+'</div>'
   +'<div class="row"><button class="btn line" type="button" data-go>Push a change</button><label class="chk" style="font-size:.98rem"><input type="checkbox" data-bug>Put a bug in the code</label><button class="btn" type="button" data-ok hidden>Approve for Production</button></div><p class="out" aria-live="polite">Press the button and watch the change travel.</p></div>';
  const st=$$('.stage',m),out=$('.out',m),go=$('[data-go]',m),ok=$('[data-ok]',m);let approve;
  go.addEventListener('click',async()=>{
    go.disabled=true;ok.hidden=true;st.forEach(x=>x.className='stage');const bug=$('[data-bug]',m).checked;
    for(let i=0;i<S.length;i++){
      if(i===5){out.textContent='Test passed. A human must approve the last step.';ok.hidden=false;await new Promise(r=>approve=r);ok.hidden=true}
      st[i].classList.add('run');out.textContent=S[i][0]+' is running ...';await sleep(700);st[i].classList.remove('run');
      if(i===2&&bug){st[i].classList.add('fail');out.textContent='A test failed. The pipeline stopped. Production was never touched. Fix the bug and push again.';go.disabled=false;return}
      st[i].classList.add('pass');
    }
    out.textContent='Done. The same steps run for every change, so releases are boring and safe.';go.disabled=false;
  });
  ok.addEventListener('click',()=>approve&&approve());
};

/* tiny search engine for the RAG demo */
const DOCS=['Hatch rate is the number of hatched chicks divided by the eggs set, times 100. A normal hatch rate is 80 to 88 percent.',
 'Eggs stay in the setter for 18 days at 37.8 degrees Celsius. Then they move to the hatcher for 3 days.',
 'If the hatch rate falls below 75 percent, check the temperature log and the age of the eggs first.',
 'The nightly pipeline loads data from the ERP system into the lakehouse at 02:00. If it fails, the report shows old data.',
 'Eggs older than 10 days have a lower hatch rate. Store eggs at 16 to 18 degrees before setting.',
 'To give a new user access to the reports, add the user to the Viewer role in the workspace.'];
const STOP='a an the is are of to in on at for and or if it its my our your i we you they then from with into have has do does how what why when which who be as by this that not no than before first then them long many much'.split(' ');
function toks(s){return s.toLowerCase().replace(/[^a-z0-9äöüß ]/g,' ').split(/\s+/).filter(w=>w&&STOP.indexOf(w)<0).map(w=>w.length>3?w.replace(/(ing|ed|es|s)$/,''):w)}
function vec(s){const v={};toks(s).forEach(w=>v[w]=(v[w]||0)+1);return v}
function cos(a,b){let d=0,na=0,nb=0;for(const k in a){na+=a[k]*a[k];if(b[k])d+=a[k]*b[k]}for(const k in b)nb+=b[k]*b[k];return na&&nb?d/Math.sqrt(na*nb):0}
WIDGETS.rag=function(m){
  const QS=['What is a normal hatch rate?','Why does my report show old data?','How long do eggs stay in the setter?','How do I give a new colleague access?'];
  m.innerHTML='<div class="card stack" style="gap:14px"><label for="ragq"><b>Your question</b></label><div class="fill"><input id="ragq" style="flex:1 1 260px" value="'+QS[0]+'"><button class="btn line" type="button" data-run>Search</button></div>'
   +'<div class="row">'+QS.map(q=>'<button class="btn ghost small" type="button" data-q="'+esc(q)+'">'+esc(q)+'</button>').join('')+'</div>'
   +'<div class="steps"><div><h3>The question becomes numbers</h3><p class="small muted">Real systems use an embedding model. This demo simply counts the important words.</p><div class="chips" data-v></div></div>'
   +'<div><h3>Search: compare with every chunk</h3><div class="stack" style="gap:8px" data-c></div></div>'
   +'<div><h3>Build the prompt</h3><pre data-p style="white-space:pre-wrap"></pre></div>'
   +'<div><h3>The model answers</h3><p class="no-ai small muted">The model would now answer using only the two chunks above, and name them as sources. Open this page inside Claude to see a live answer here.</p><div class="row needs-ai"><button class="btn" type="button" data-ans>Ask the model with these chunks</button></div><div class="out" data-a aria-live="polite"></div></div></div></div>';
  let prompt='';
  function run(){
    const q=$('#ragq',m).value.trim();if(!q)return;const qv=vec(q);
    $('[data-v]',m).innerHTML=Object.keys(qv).map(w=>'<span class="chip">'+esc(w)+': '+qv[w]+'</span>').join('')||'<span class="muted small">No important words found. Try a longer question.</span>';
    const sc=DOCS.map((d,i)=>({i,s:cos(qv,vec(d))})).sort((a,b)=>b.s-a.s);const top=sc.filter(x=>x.s>0).slice(0,2);
    $('[data-c]',m).innerHTML=sc.map(x=>'<div class="chunk'+(top.indexOf(x)>-1?' top':'')+'"><span>'+(top.indexOf(x)>-1?'<b>Chosen. </b>':'')+'Chunk '+(x.i+1)+': '+esc(DOCS[x.i])+'</span><span class="sc">'+x.s.toFixed(2)+'</span><span class="sbar"><i style="width:'+Math.round(x.s*100)+'%"></i></span></div>').join('');
    prompt=top.length?'Answer the question using only the sources. If the sources do not contain the answer, say you do not know. Name the source number.\n\n'+top.map(x=>'Source '+(x.i+1)+': '+DOCS[x.i]).join('\n')+'\n\nQuestion: '+q:'';
    $('[data-p]',m).textContent=prompt||'No chunk matched. A good RAG system now says: "I do not know."';
    $('[data-a]',m).textContent='';
  }
  m.addEventListener('click',e=>{if(e.target.dataset.q){$('#ragq',m).value=e.target.dataset.q;run()}if(e.target.closest('[data-run]'))run();
    if(e.target.closest('[data-ans]')){if(!prompt){$('[data-a]',m).textContent='I do not know. No source matched the question.';return}askAI(prompt+'\n\nAnswer in two or three short sentences of simple English. Plain text only.',$('[data-a]',m))}});
  $('#ragq',m).addEventListener('keydown',e=>{if(e.key==='Enter')run()});
  run();
};

WIDGETS.conv=function(m){
  const N=14,O=12,K={'Vertical edges':[-1,0,1,-2,0,2,-1,0,1],'Horizontal edges':[-1,-2,-1,0,0,0,1,2,1],'Blur':[1,1,1,1,1,1,1,1,1].map(x=>x/9),'Sharpen':[0,-1,0,-1,5,-1,0,-1,0]};
  m.innerHTML='<div class="card stack" style="gap:12px"><div class="row"><label for="kern"><b>Filter</b></label><select id="kern">'+Object.keys(K).map(k=>'<option>'+k+'</option>').join('')+'</select><button class="btn line" type="button" data-play>Play</button><button class="btn ghost" type="button" data-shape>Square</button><button class="btn ghost" type="button" data-clear>Clear</button></div>'
   +'<div class="row" style="align-items:flex-start"><div><p class="small muted">Image (click to draw)</p><canvas width="224" height="224" data-in aria-label="Input image, click to draw"></canvas></div><div><p class="small muted">What the filter sees</p><canvas width="224" height="224" data-out aria-label="Filter output"></canvas></div></div><p class="out small" data-calc></p></div>';
  const ci=$('[data-in]',m),co=$('[data-out]',m),xi=ci.getContext('2d'),xo=co.getContext('2d');let img,pos=O*O,timer=null;
  function square(){img=new Array(N*N).fill(0);for(let y=4;y<10;y++)for(let x=4;x<10;x++)img[y*N+x]=1}
  function kern(){return K[$('#kern',m).value]}
  function val(p){const k=kern(),oy=Math.floor(p/O),ox=p%O;let s=0;for(let y=0;y<3;y++)for(let x=0;x<3;x++)s+=img[(oy+y)*N+ox+x]*k[y*3+x];return s}
  function draw(){
    const cs=224/N;for(let i=0;i<N*N;i++){xi.fillStyle=img[i]?'#f2f2f2':'#1b1b1b';xi.fillRect((i%N)*cs,Math.floor(i/N)*cs,cs-1,cs-1)}
    const os=224/O,edge=$('#kern',m).selectedIndex<2;xo.fillStyle='#000';xo.fillRect(0,0,224,224);
    for(let p=0;p<Math.min(pos,O*O);p++){const v=val(p),b=Math.max(0,Math.min(1,edge?Math.abs(v)/4:v));const g=Math.round(27+b*215);xo.fillStyle='rgb('+g+','+g+','+g+')';xo.fillRect((p%O)*os,Math.floor(p/O)*os,os-1,os-1)}
    if(pos<O*O){const ox=pos%O,oy=Math.floor(pos/O);xi.strokeStyle='#ff5a7a';xi.lineWidth=3;xi.strokeRect(ox*cs+1,oy*cs+1,cs*3-3,cs*3-3);$('[data-calc]',m).textContent='Window at column '+(ox+1)+', row '+(oy+1)+': multiply 9 pixels by the 9 filter numbers and add them = '+val(pos).toFixed(2)}
    else $('[data-calc]',m).textContent='Bright output pixels are places where the filter found its pattern.';
  }
  function stop(){if(timer){clearInterval(timer);timer=null}}
  function play(){stop();if(reduce){pos=O*O;draw();return}pos=0;draw();timer=setInterval(()=>{pos++;draw();if(pos>=O*O)stop()},22)}
  ci.addEventListener('click',e=>{const r=ci.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*N),y=Math.floor((e.clientY-r.top)/r.height*N);if(x<0||y<0||x>=N||y>=N)return;stop();img[y*N+x]=img[y*N+x]?0:1;pos=O*O;draw()});
  $('[data-play]',m).addEventListener('click',play);
  $('[data-shape]',m).addEventListener('click',()=>{stop();square();pos=O*O;draw()});
  $('[data-clear]',m).addEventListener('click',()=>{stop();img=new Array(N*N).fill(0);pos=O*O;draw()});
  $('#kern',m).addEventListener('change',()=>{stop();pos=O*O;draw()});
  square();draw();
};

WIDGETS.flash=function(m){
  const F=window.FLASH;let i=0,back=false;
  function paint(){const c=F[i];m.innerHTML='<div class="stack" style="gap:10px"><button type="button" class="flash" data-flip><span class="w" lang="de">'+esc(back?c[1]:c[0])+'</span>'+(back?'<span lang="de">'+esc(c[2])+'</span>':'<span class="muted small">Click to see the meaning</span>')+'</button>'
   +'<div class="row"><button class="btn ghost" type="button" data-prev>Back</button><button class="btn line" type="button" data-nx>Next card</button><button class="say" type="button" data-say="'+esc(c[0]+'. '+c[2])+'" aria-label="Listen">&#9654;</button><span class="muted small">Card '+(i+1)+' of '+F.length+'</span></div></div>'}
  m.addEventListener('click',e=>{if(e.target.closest('[data-flip]')){back=!back;paint()}else if(e.target.closest('[data-nx]')){i=(i+1)%F.length;back=false;paint()}else if(e.target.closest('[data-prev]')){i=(i+F.length-1)%F.length;back=false;paint()}});
  paint();
};

WIDGETS.coach=function(m){
  const TASKS=['You are ill and cannot come to work tomorrow. Write to your team lead, Frau Becker.','You want to move a meeting with a customer, Herr Schmidt, from Monday to Wednesday.','You need access to a database. Ask the IT department politely.','A colleague helped you with a difficult problem. Thank him and offer your help in return.'];
  m.innerHTML='<div class="card stack" style="gap:10px"><h4>Writing coach</h4><label for="ctask">Choose a task</label><select id="ctask">'+TASKS.map(t=>'<option>'+esc(t)+'</option>').join('')+'</select>'
   +'<label for="ctext">Write about 60 words in German</label><textarea id="ctext" lang="de" spellcheck="false" placeholder="Sehr geehrte Frau Becker, ..."></textarea>'
   +'<div class="row needs-ai"><button class="btn line" type="button" data-chk>Check my German</button></div>'
   +'<div class="no-ai small muted">Check it yourself: 1. Anrede with a comma? 2. Is the verb in position 2? 3. In weil/dass sentences, is the verb at the end? 4. Polite form (Könnten Sie ...)? 5. Closing line? Open this page inside Claude to get corrections here.</div>'
   +'<div class="out" data-o aria-live="polite"></div></div>';
  $('[data-chk]',m).addEventListener('click',()=>{const t=$('#ctext',m).value.trim(),o=$('[data-o]',m);if(t.length<15){o.textContent='Write a few sentences first.';return}
    askAI('You are a kind German teacher. The learner is at level A2 and wants to reach B1. The learner reads English at a simple level, so explain in very simple English with short sentences. Plain text only, no markdown.\n\nTask: '+$('#ctask',m).value+'\n\nLearner text:\n'+t+'\n\nAnswer in this form:\nCORRECTED TEXT: (the full text in correct German)\nYOUR 3 MOST IMPORTANT MISTAKES: (for each: wrong -> right, and one short reason)\nWHAT YOU DID WELL: (one sentence)\nLEVEL OF THIS TEXT: (A2, A2+, B1 or B1+)',o)});
};

/* ---------- Claude features: tutor, voice ---------- */
let AI=null,TTS=null;
async function askAI(prompt,out){
  if(!AI){out.textContent='The tutor is not available in this view.';return}
  out.textContent='Thinking ...';
  try{const r=await AI(prompt,{cache:false,onText:x=>{if(x&&x.text)out.textContent=x.text}});if(r&&r.text)out.textContent=r.text}
  catch(e){if(e&&e.code==='not_granted'){document.body.classList.remove('has-ai');out.textContent='The tutor is switched off for this page.'}
    else out.textContent=e&&e.code==='rate_limited'?'Too many questions right now. Wait a minute and try again.':'The tutor could not answer. Try again in a moment.'}
}
function initClaude(){
  if(!(window.claude&&typeof window.claude.use==='function'))return;
  window.claude.use('sample').then(s=>{if(s){AI=s;document.body.classList.add('has-ai')}}).catch(()=>{});
  window.claude.use('tts').then(t=>{if(t){TTS=t;document.body.classList.add('has-tts')}}).catch(()=>{});
}
document.addEventListener('click',e=>{const b=e.target.closest('.say');if(b&&TTS){e.stopPropagation();TTS.speak(b.dataset.say,{language:'de',rate:0.9}).catch(err=>{if(err&&err.code==='not_granted')document.body.classList.remove('has-tts')})}});
function initTutor(){
  const box=$('#tutor'),out=$('#tutorOut');
  $('#tutorBtn').addEventListener('click',()=>{box.classList.add('on');$('#tutorQ').focus()});
  $('#tutorClose').addEventListener('click',()=>box.classList.remove('on'));
  $('#tutorAsk').addEventListener('click',()=>{const q=$('#tutorQ').value.trim();if(!q){out.textContent='Type a question first.';return}
    askAI('You are a patient tutor on a learning site about Microsoft Fabric (DP-700), Azure DevOps, German (A2 to B1) and AI basics. The learner is a BI developer who knows SQL Server, SSIS and SSAS well. English is not his first language: use very simple English, short sentences, and one small example. When it helps, compare with SQL Server, SSIS or SSAS. Maximum 150 words. Plain text only, no markdown.\n\nQuestion: '+q,out)});
}

/* ---------- start view ---------- */
function renderStart(){
  const plan=[['1','Fabric basics, lakehouse, first pipeline (F1–F3)','Git basics (O1)','Office words, Perfekt (D0–D1)','How an LLM works (K1)'],
   ['2','Dataflows, notebooks, PySpark (F4–F5)','Azure DevOps tour (O2)','Nebensätze, Relativsätze (D2–D3)','Embeddings (K2)'],
   ['3','Medallion, loading patterns, warehouse (F6–F7)','CI/CD pipelines (O3)','Konjunktiv II, Passiv (D4–D5)','RAG (K3)'],
   ['4','Real-time, security, monitoring (F8–F10)','CI/CD in Fabric (O4)','Adjectives, prepositions, zu (D6–D8)','Computer vision (K4)'],
   ['5','Project and practice tests (F11–F12). Take DP-700','Use Git for your project','Writing and speaking (D9–D10)','Agents (K5)'],
   ['6','Keep the project alive, add streaming','Deployment pipeline for the project','Mock exams (D11). Take B1','Testing, RAG project (K6–K7)']];
  const week=[['Mon','Fabric: read one station, do the questions','45 min'],['Tue','German: one grammar station, 5 flashcards','30 min'],['Wed','Fabric: hands-on in your trial workspace','60 min'],['Thu','German: writing coach or speaking','30 min'],['Fri','German: 5 flashcards, one video','20 min'],['Sat','Fabric or DevOps lab, long session','120 min'],['Sun','AI: one station, then "This week"','45 min']];
  $('#v-start').innerHTML='<div class="stack"><div class="hero"><div><h1>Tori\'s Fahrplan</h1><p class="lead" style="margin-top:10px">Four lines, one destination: a certified Fabric data engineer who speaks German at B1 and can build AI systems. Ride each line one station at a time.</p></div>'
   +'<div class="map">'+mapSVG()+'</div></div>'
   +'<div class="grid g4">'+ORDER.map(k=>{const t=T[k];return '<div class="card prog c-'+t.c+'"><div class="row"><span class="badge c-'+t.c+'">'+t.letter+'</span><h3>'+esc(t.name)+'</h3></div><span class="pct" data-pct="'+k+'">0%</span><div class="bar"><i data-bar="'+k+'"></i></div><span class="muted small" data-cnt="'+k+'"></span><button class="btn line" type="button" data-next="'+k+'">Next station</button></div>'}).join('')+'</div>'
   +'<div class="card stack" style="gap:12px"><h2>Your six months</h2><p class="muted">About 6 hours a week next to your job. Every station has three parts: understand it, check yourself, do it for real.</p><div class="tbl"><table><tr><th>Month</th><th><span class="tag c-f">Fabric</span></th><th><span class="tag c-o">DevOps</span></th><th><span class="tag c-d">Deutsch</span></th><th><span class="tag c-k">AI</span></th></tr>'
   +plan.map(r=>'<tr><td class="num"><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td></tr>').join('')+'</table></div></div>'
   +'<div class="grid g2"><div class="card stack" style="gap:12px"><h2>Your week</h2><div class="tbl"><table>'+week.map(r=>'<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td class="num muted">'+r[2]+'</td></tr>').join('')+'</table></div></div>'
   +'<div class="card stack" style="gap:12px"><h2>Three honest rules</h2><ol style="margin:0;padding-left:22px;display:flex;flex-direction:column;gap:8px"><li><b>Doing beats watching.</b> A station counts only when you tick "I did this".</li><li><b>German every day.</b> Twenty minutes daily is better than two hours on Sunday. B1 in six months is realistic. B2 comes after that.</li><li><b>One exam at a time.</b> DP-700 in month 5, B1 in month 6. Book the date early so you have a deadline.</li></ol></div></div>'
   +'<div class="card news stack" style="gap:8px"><h2>New this week</h2><p>'+esc((window.WEEKLY&&window.WEEKLY.items[0]&&window.WEEKLY.items[0].title)||'')+'</p><div class="row"><a class="btn" href="#news" style="text-decoration:none">Read this week\'s AI news</a></div></div></div>';
}
function mapSVG(){
  const lines=[['f','M30 40 H300 Q360 40 400 75 L440 110 H650','Fabric'],['o','M30 86 H250 Q310 86 350 100 L380 110 H650','DevOps'],['d','M30 134 H250 Q310 134 350 120 L380 110 H650','Deutsch'],['k','M30 180 H300 Q360 180 400 145 L440 110 H650','AI']];
  const col={f:'var(--lf)',o:'var(--lo)',d:'var(--ld)',k:'var(--lk)'};
  let s='<svg viewBox="0 0 720 220" role="img" aria-label="Map with four learning lines that meet at one destination">';
  lines.forEach((l,i)=>{s+='<path id="ln'+i+'" d="'+l[1]+'" fill="none" stroke="'+col[l[0]]+'" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
    const y=[40,86,134,180][i];[70,130,190,250].forEach(x=>{s+='<circle cx="'+x+'" cy="'+y+'" r="6" fill="var(--surface)" stroke="'+col[l[0]]+'" stroke-width="3"/>'});
    s+='<text x="30" y="'+(y-12)+'" font-size="15">'+l[2]+'</text>';
    s+='<circle r="7" fill="'+col[l[0]]+'" stroke="var(--surface)" stroke-width="2" class="train"><animateMotion dur="'+(7+i*1.3)+'s" repeatCount="indefinite" begin="'+(i*0.8)+'s"><mpath href="#ln'+i+'"/></animateMotion></circle>'});
  s+='<circle cx="650" cy="110" r="15" fill="var(--surface)" stroke="var(--ink)" stroke-width="5"/><text x="650" y="150" text-anchor="middle" font-size="17">Ziel</text><text x="650" y="168" text-anchor="middle" class="lbl">DP-700 · B1 · AI</text><text x="545" y="98" text-anchor="middle" class="lbl">6 months</text></svg>';
  return s;
}

/* ---------- news view ---------- */
function newsCard(n){return '<article class="card news stack" style="gap:10px"><h3>'+esc(n.title)+'</h3><dl><dt>What happened</dt><dd>'+esc(n.what)+'</dd><dt>Why you care</dt><dd>'+esc(n.why)+'</dd><dt>Try it</dt><dd>'+esc(n.tryit)+'</dd></dl>'+(n.url?'<div class="links"><a href="'+esc(n.url)+'" target="_blank" rel="noopener">Source: '+esc(n.source||'link')+' &#8599;</a></div>':'')+'</article>'}
function renderNews(){
  const W=window.WEEKLY||{items:[],archive:[]};
  $('#v-news').innerHTML='<div class="stack c-n"><div class="linehead"><span class="badge c-n">N</span><div><h1>This week in AI</h1><p class="muted">Updated '+esc(W.updated||'')+'. New items arrive every Monday.</p></div></div>'
   +'<p class="lead">A few news items, each explained in simple words, with one small thing to try. News sites wrote the reports; the numbers in them are their claims.</p>'
   +(W.items||[]).map(newsCard).join('')
   +((W.archive||[]).length?'<h2>Earlier weeks</h2>'+W.archive.map(a=>'<details class="card"><summary><b>'+esc(a.updated||'')+'</b></summary><div class="stack" style="margin-top:12px">'+(a.items||[]).map(newsCard).join('')+'</div></details>').join(''):'')
   +'</div>';
}

/* ---------- routing ---------- */
function route(){
  let v=(location.hash||'').replace('#','');if(VIEWS.indexOf(v)<0)v='start';
  VIEWS.forEach(x=>$('#v-'+x).classList.toggle('on',x===v));
  $$('.nav a').forEach(a=>{if(a.getAttribute('href')==='#'+v)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}
renderStart();ORDER.forEach(renderTrack);renderNews();paintProgress();route();
window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0)});
if(reduce)$$('animateMotion').forEach(a=>a.remove());
initTutor();initClaude();
})();
