// German widgets: sentence builder, cases, prepositions, flashcards, article game, verb trainer, dialogues, listening, dictation, chat, writing coach.
(function(){
'use strict';
const W=window.WIDGETS;
const A=()=>window.APP;
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>Array.from((r||document).querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const card=(title,inner)=>'<div class="card stack wcard" style="gap:12px">'+(title?'<h4>'+title+'</h4>':'')+inner+'</div>';
const say=t=>'<button class="say" type="button" data-say="'+esc(t)+'" aria-label="Listen">&#9654;</button>';
const norm=s=>s.toLowerCase().trim().replace(/\s+/g,' ').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[.,!?;:"„“]/g,'');

/* ---------- sentence builder ---------- */
W.satz=function(m){
  const S=WD.satz;let cur=0,shown=99;
  function paint(){const s=S[cur];
    m.innerHTML=card('Where does the verb go?','<div class="chips">'+S.map((x,i)=>'<button type="button" class="chipb'+(i===cur?' on':'')+'" data-i="'+i+'">'+esc(x.n)+'</button>').join('')+'</div>'
     +'<div class="slots" lang="de">'+s.cols.map((c,ci)=>'<div class="slot'+(/Verb/.test(c)?' vslot':'')+'"><small lang="en">'+esc(c)+'</small>'+s.w.map((w,wi)=>w[1]===ci?'<span class="word'+(w[2]?' verb':'')+(wi<shown?' in':'')+'" style="transition-delay:'+(wi*60)+'ms">'+esc(w[0])+'</span>':'').join('')+'</div>').join('')+'</div>'
     +'<div class="row"><button class="btn line" type="button" data-play>Play</button>'+say(s.w.map(w=>w[0]).join(' '))+'</div><p class="out">'+esc(s.note)+'</p>')}
  async function play(){shown=0;paint();for(let i=1;i<=S[cur].w.length;i++){await A().sleep(520);shown=i;const ws=$$('.word',m);if(ws[i-1])ws[i-1].classList.add('in')}shown=99}
  m.addEventListener('click',e=>{const b=e.target.closest('.chipb');if(b){cur=+b.dataset.i;shown=99;paint();play()}if(e.target.closest('[data-play]'))play()});
  paint();
};

/* ---------- case table ---------- */
W.kasus=function(m){
  const G=['der','die','das','Plural'],C=['Nominativ','Akkusativ','Dativ','Genitiv'];
  const F=[[['der','ein'],['die','eine'],['das','ein'],['die','–']],[['den','einen'],['die','eine'],['das','ein'],['die','–']],[['dem','einem'],['der','einer'],['dem','einem'],['den …n','–']],[['des …s','eines …s'],['der','einer'],['des …s','eines …s'],['der','–']]];
  const X=[[['Der Kollege ist neu.','The colleague is new.'],['Die Datei ist leer.','The file is empty.'],['Das Projekt läuft gut.','The project is going well.'],['Die Daten sind da.','The data is here.']],
   [['Ich frage den Kollegen.','I ask the colleague.'],['Ich öffne die Datei.','I open the file.'],['Ich plane das Projekt.','I plan the project.'],['Ich prüfe die Daten.','I check the data.']],
   [['Ich helfe dem Kollegen.','I help the colleague.'],['Ich arbeite mit der Datei.','I work with the file.'],['Ich arbeite an dem Projekt.','I work on the project.'],['Ich arbeite mit den Daten.','I work with the data.']],
   [['Das ist der Platz des Kollegen.','That is the colleague\'s place.'],['Der Name der Datei ist falsch.','The name of the file is wrong.'],['Das Ziel des Projekts ist klar.','The goal of the project is clear.'],['Die Qualität der Daten ist gut.','The quality of the data is good.']]];
  let r=1,c=0;
  function paint(){m.innerHTML=card('Articles in the four cases','<div class="tbl"><table class="ktab"><tr><th></th>'+G.map(g=>'<th>'+g+'</th>').join('')+'</tr>'+C.map((n,i)=>'<tr><th>'+n+'</th>'+G.map((g,j)=>'<td><button type="button" class="kcell'+(i===r&&j===c?' on':'')+((i>0&&F[i][j][0]!==F[0][j][0])?' chg':'')+'" data-r="'+i+'" data-c="'+j+'" lang="de">'+F[i][j][0]+'<small>'+F[i][j][1]+'</small></button></td>').join('')+'</tr>').join('')+'</table></div>'
    +'<p class="small muted">Marked cells are the ones that change from the Nominativ.</p><div class="de"><span lang="de">'+esc(X[r][c][0])+'</span>'+say(X[r][c][0])+'<span class="en">'+esc(X[r][c][1])+'</span></div>')}
  m.addEventListener('click',e=>{const b=e.target.closest('.kcell');if(b){r=+b.dataset.r;c=+b.dataset.c;paint()}});paint();
};

/* ---------- Wechselpräpositionen ---------- */
W.wechsel=function(m){
  const P={auf:[330,96],unter:[330,196],neben:[470,150],vor:[300,170],'hinter':[360,70],über:[330,40]};let prep='auf',mode='wohin';
  function paint(move){const p=P[prep],start=[90,180];
    const sent=mode==='wohin'?'Ich stelle die Kiste '+prep+' den Tisch.':'Die Kiste steht '+prep+' dem Tisch.';
    m.innerHTML=card('Wohin? or Wo?','<div class="chips">'+Object.keys(P).map(k=>'<button type="button" class="chipb'+(k===prep?' on':'')+'" data-p="'+k+'" lang="de">'+k+'</button>').join('')+'</div><div class="row"><button class="btn'+(mode==='wohin'?' line':' ghost')+'" type="button" data-m="wohin" lang="de">Wohin? (movement)</button><button class="btn'+(mode==='wo'?' line':' ghost')+'" type="button" data-m="wo" lang="de">Wo? (position)</button></div>'
     +'<div class="svgbox"><svg viewBox="0 0 640 250" role="img" aria-label="A box and a table"><line x1="20" y1="230" x2="620" y2="230" stroke="var(--rule)" stroke-width="3"/><rect x="250" y="130" width="200" height="14" rx="3" fill="var(--ink)"/><rect x="266" y="144" width="12" height="86" fill="var(--ink)"/><rect x="422" y="144" width="12" height="86" fill="var(--ink)"/>'
     +'<g class="kiste" style="transform:translate('+(move?start[0]:p[0])+'px,'+(move?start[1]:p[1])+'px)" data-x="'+p[0]+'" data-y="'+p[1]+'"><rect x="-22" y="-34" width="44" height="34" rx="4" fill="var(--c)" stroke="var(--surface)" stroke-width="2"'+(prep==='hinter'?' opacity=".55"':'')+'/></g>'
     +(mode==='wohin'?'<text x="60" y="30" font-size="14" fill="var(--muted)">movement → Akkusativ</text>':'<text x="60" y="30" font-size="14" fill="var(--muted)">no movement → Dativ</text>')+'</svg></div>'
     +'<div class="de"><span lang="de">'+sent.replace(/(den Tisch|dem Tisch)/,'<mark>$1</mark>')+'</span>'+say(sent)+'<span class="en">'+(mode==='wohin'?'I put the box '+({auf:'onto',unter:'under',neben:'next to',vor:'in front of',hinter:'behind',über:'above'})[prep]+' the table. (der Tisch → den Tisch)':'The box is '+({auf:'on',unter:'under',neben:'next to',vor:'in front of',hinter:'behind',über:'above'})[prep]+' the table. (der Tisch → dem Tisch)')+'</span></div>');
    if(move)requestAnimationFrame(()=>requestAnimationFrame(()=>{const g=$('.kiste',m);if(g)g.style.transform='translate('+p[0]+'px,'+p[1]+'px)'}))}
  m.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(b){prep=b.dataset.p;paint(mode==='wohin')}const x=e.target.closest('[data-m]');if(x){mode=x.dataset.m;paint(mode==='wohin')}});
  paint(true);
};

/* ---------- flashcards with spaced repetition ---------- */
W.cards=function(m,arg){
  let deck=arg&&DECKS[arg]?arg:Object.keys(DECKS)[0],idx=null,back=false,done=0;
  const due=k=>DECKS[k].cards.map((c,i)=>i).filter(i=>A().srs.due(k+':'+i));
  function next(){const d=due(deck);idx=d.length?d[Math.floor(Math.random()*Math.min(d.length,6))]:null;back=false}
  function paint(){const D=DECKS[deck],d=due(deck),boxes=[0,0,0,0,0,0];D.cards.forEach((c,i)=>boxes[A().srs.box(deck+':'+i)]++);
    let inner='<div class="row"><label class="small" for="dk-'+m.dataset.uid+'">Deck</label><select id="dk-'+m.dataset.uid+'" data-deck>'+Object.keys(DECKS).map(k=>'<option value="'+k+'"'+(k===deck?' selected':'')+'>'+esc(DECKS[k].name)+' ('+due(k).length+' due)</option>').join('')+'</select><span class="muted small">'+d.length+' of '+D.cards.length+' due</span></div>'
     +'<div class="boxes" aria-label="Cards per box">'+boxes.map((n,i)=>'<span class="box" title="'+(i===0?'new':'box '+i)+'"><i style="height:'+Math.round(n/D.cards.length*100)+'%"></i><small>'+(i===0?'new':i)+'</small></span>').join('')+'</div>';
    if(idx===null)inner+='<div class="result pop"><b>Nothing due in this deck.</b><p>'+(done?'You did '+done+' cards. ':'')+'Come back tomorrow, or choose another deck. Cards return after 1, 3, 7, 16 and 35 days.</p></div><div class="row"><button class="btn ghost" type="button" data-all>Practise all cards anyway</button></div>';
    else{const c=D.cards[idx];inner+='<button type="button" class="flash'+(back?' back':'')+'" data-flip><span class="w" lang="de">'+esc(c[0])+'</span>'+(back?'<span class="mean">'+esc(c[1])+'</span><span lang="de" class="exs">'+esc(c[2])+'</span>':'<span class="muted small">Say the meaning, then click to check</span>')+'</button>'
      +'<div class="row">'+(back?'<button class="btn" type="button" data-g="0">Not yet</button><button class="btn line" type="button" data-g="1">I knew it</button>':'<button class="btn line" type="button" data-flip>Show</button>')+say(c[0]+'. '+c[2])+'</div>'}
    m.innerHTML=card('',inner)}
  m.dataset.uid=Math.random().toString(36).slice(2,7);
  m.addEventListener('change',e=>{if(e.target.matches('[data-deck]')){deck=e.target.value;done=0;next();paint()}});
  m.addEventListener('click',e=>{if(e.target.closest('.say'))return;
    if(e.target.closest('[data-flip]')){back=true;return paint()}
    const g=e.target.closest('[data-g]');if(g){A().srs.grade(deck+':'+idx,g.dataset.g==='1');done++;if(g.dataset.g==='1')A().addXP(2);next();return paint()}
    if(e.target.closest('[data-all]')){idx=Math.floor(Math.random()*DECKS[deck].cards.length);back=false;paint()}});
  next();paint();
};

/* ---------- der / die / das game ---------- */
W.artikel=function(m){
  const N=[];Object.keys(DECKS).forEach(k=>DECKS[k].cards.forEach(c=>{const x=c[0].match(/^(der|die|das) ([A-ZÄÖÜ][^\s\/]+)$/);if(x&&!/^(Eltern|Kenntnisse|Unterlagen|Nebenkosten|Schmerzen|Lebensmittel|Verwandten|Überstunden)$/.test(x[2]))N.push([x[1],x[2],c[1]])}));
  let cur,streak=0,best=A().meta.art||0,fb='';
  function pick(){cur=N[Math.floor(Math.random()*N.length)]}
  function paint(cls){m.innerHTML=card('der, die oder das?','<div class="stats"><span>In a row <b>'+streak+'</b></span><span>Your best <b>'+best+'</b></span></div><div class="noun'+(cls?' '+cls:'')+'"><span lang="de">'+esc(cur[1])+'</span><small>'+esc(cur[2])+'</small></div><div class="row artbtn">'+['der','die','das'].map(a=>'<button class="btn" type="button" data-a="'+a+'" lang="de">'+a+'</button>').join('')+'</div><p class="fb" aria-live="polite">'+fb+'</p>')}
  m.addEventListener('click',e=>{const a=e.target.dataset.a;if(!a)return;
    if(a===cur[0]){streak++;if(streak>best){best=streak;A().meta.art=best;A().save()}fb='<span class="good">Right: '+cur[0]+' '+esc(cur[1])+'</span>';if(streak%10===0)A().cheer();pick();paint('yes')}
    else{fb='<span class="no">It is <b>'+cur[0]+' '+esc(cur[1])+'</b>. '+(/(ung|heit|keit|ion|schaft|tät)$/.test(cur[1])?'Words with this ending are always die.':/(chen|ment|um)$/.test(cur[1])?'Words with this ending are das.':'')+'</span>';streak=0;pick();paint('nope')}});
  pick();paint();
};

/* ---------- irregular verbs ---------- */
W.verbs=function(m){
  const V=window.VERBS;let i=Math.floor(Math.random()*V.length),ok=0,shown=false;const uid=Math.random().toString(36).slice(2,7);
  function paint(msg){const v=V[i];m.innerHTML=card('Irregular verbs','<div class="noun"><span lang="de">'+esc(v[0])+'</span><small>'+esc(v[3])+'</small></div><div class="fill"><label class="small" for="v1-'+uid+'">Präteritum (er ...)</label><input id="v1-'+uid+'" lang="de" autocomplete="off" autocapitalize="off" spellcheck="false"><label class="small" for="v2-'+uid+'">Perfekt (er ...)</label><input id="v2-'+uid+'" lang="de" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="hat ... / ist ..."></div>'
    +'<div class="row"><button class="btn line" type="button" data-chk>Check</button><button class="btn ghost" type="button" data-show>Show me</button><button class="btn ghost" type="button" data-next>Next verb</button><span class="muted small">Right today: '+ok+'</span></div><p class="fb" aria-live="polite">'+(msg||'')+'</p>')}
  function chk(){const v=V[i],a=norm($('#v1-'+uid,m).value),b=norm($('#v2-'+uid,m).value);if(!a&&!b)return paint('<span class="no">Type both forms first.</span>');
    const r1=a===norm(v[1]),r2=b===norm(v[2])||b===norm(v[2].replace(/^(hat|ist) /,''));
    if(r1&&r2){if(!shown){ok++;A().addXP(3)}const t=v[0]+', '+v[1]+', '+v[2];i=(i+1+Math.floor(Math.random()*5))%V.length;shown=false;paint('<span class="good">Correct: '+esc(t)+'</span>');$('#v1-'+uid,m).focus()}
    else paint('<span class="no">'+(r1?'Präteritum is right. ':'Präteritum is not right. ')+(r2?'Perfekt is right.':'Perfekt is not right. Did you choose hat or ist correctly?')+'</span>')}
  m.addEventListener('click',e=>{if(e.target.closest('[data-chk]'))chk();
    if(e.target.closest('[data-show]')){shown=true;const v=V[i];paint('<span lang="de"><b>'+esc(v[0])+' – '+esc(v[1])+' – '+esc(v[2])+'</b></span> Say it three times, then type it.')}
    if(e.target.closest('[data-next]')){i=(i+1)%V.length;shown=false;paint()}});
  m.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();chk()}});
  paint();
};

/* ---------- dialogue ---------- */
W.dialog=function(m,arg){
  const d=WD.dialog[arg];if(!d)return;let hide=false,tr=true,playing=false;
  function paint(){m.innerHTML=card(d.title,'<div class="row"><button class="btn line needs-tts" type="button" data-play>'+(playing?'Stop':'Play the dialogue')+'</button><label class="chk" style="font-size:.95rem"><input type="checkbox" data-hide'+(hide?' checked':'')+'>Hide my lines (speak them yourself)</label><label class="chk" style="font-size:.95rem"><input type="checkbox" data-tr'+(tr?' checked':'')+'>English</label></div>'
    +'<div class="dlg">'+d.lines.map((l,i)=>'<div class="dl '+(l[0]?'me':'them')+'" data-i="'+i+'"><small>'+esc(d.who[l[0]])+'</small><div class="bub"><span lang="de" class="'+(hide&&l[0]?'blur':'')+'" data-reveal>'+esc(l[1])+'</span>'+say(l[1])+(tr?'<span class="en">'+esc(l[2])+'</span>':'')+'</div></div>').join('')+'</div>')}
  m.addEventListener('change',e=>{if(e.target.matches('[data-hide]')){hide=e.target.checked;paint()}if(e.target.matches('[data-tr]')){tr=e.target.checked;paint()}});
  m.addEventListener('click',async e=>{const r=e.target.closest('[data-reveal]');if(r)r.classList.remove('blur');
    if(e.target.closest('[data-play]')){if(playing){playing=false;A().stopSpeak();return paint()}playing=true;paint();
      for(let i=0;i<d.lines.length&&playing;i++){const el=$('.dl[data-i="'+i+'"]',m);if(el){el.classList.add('now');el.scrollIntoView({block:'nearest',behavior:A().reduce?'auto':'smooth'})}
        try{await A().speak(d.lines[i][1],{voice:d.lines[i][0]?'airy':'buttery'})}catch(_){playing=false}
        if(el)el.classList.remove('now');await A().sleep(350)}
      playing=false;paint()}});
  paint();
};

/* ---------- listening ---------- */
W.hoer=function(m,arg){
  const t=WD.hoer[arg];if(!t)return;
  m.innerHTML=card('','<div class="row needs-tts"><button class="btn line" type="button" data-p="1">Listen</button><button class="btn ghost" type="button" data-p="0.8">Listen slowly</button><span class="muted small">Listen twice, answer the questions below, then check the text.</span></div><p class="no-tts small muted">Sound is not available in this view. Read the text once, cover it, and answer from memory.</p><details class="reveal"><summary>Show the text</summary><p lang="de" class="lesetext">'+esc(t)+'</p></details>');
  m.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(b)A().speak(t,{rate:+b.dataset.p}).catch(()=>{})});
};

/* ---------- dictation ---------- */
W.diktat=function(m){
  const S=WD.diktat;let i=Math.floor(Math.random()*S.length),ok=0;const uid=Math.random().toString(36).slice(2,7);
  function paint(res){m.innerHTML=card('Diktat','<div class="row needs-tts"><button class="btn line" type="button" data-p="1">Listen</button><button class="btn ghost" type="button" data-p="0.75">Slowly</button><span class="muted small">Sentence '+(i+1)+' of '+S.length+' · right: '+ok+'</span></div><p class="no-tts small muted">Sound is not available in this view. Open the page in a browser with speech, or inside Claude.</p>'
    +'<label class="small" for="dk-'+uid+'">Type what you hear</label><input id="dk-'+uid+'" class="wide" lang="de" autocomplete="off" spellcheck="false"><div class="row"><button class="btn" type="button" data-chk>Check</button><button class="btn ghost" type="button" data-next>Next sentence</button></div><p class="fb" aria-live="polite">'+(res||'')+'</p>')}
  function chk(){const a=$('input',m).value.trim();if(!a)return;const want=S[i].split(' '),got=a.split(/\s+/);let good=0;
    const html=want.map((w,k)=>{const r=got[k]&&norm(got[k])===norm(w);if(r)good++;return '<span class="'+(r?'good':'no')+'">'+esc(w)+'</span>'}).join(' ');
    if(good===want.length&&got.length===want.length){ok++;A().addXP(3);paint('<span class="good">Perfect.</span> <span lang="de">'+esc(S[i])+'</span>')}
    else paint('The sentence was: <span lang="de">'+html+'</span><br><span class="muted small">Green words were right. Listen again and compare.</span>')}
  m.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(b)A().speak(S[i],{rate:+b.dataset.p}).catch(()=>{});
    if(e.target.closest('[data-chk]'))chk();if(e.target.closest('[data-next]')){i=(i+1)%S.length;paint();const x=$('input',m);x&&x.focus()}});
  m.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('input')){e.preventDefault();chk()}});
  paint();
};

/* ---------- conversation partner (needs the tutor) ---------- */
W.chat=function(m){
  const SC=[['Beim Arzt','You are the receptionist at a doctor\'s practice. The learner calls to make an appointment.'],['Im Büro','You are a friendly German colleague. Talk about the current project and the weekend.'],['Wohnungssuche','You are a landlord. The learner calls about a flat.'],['Vorstellungsgespräch','You are an interviewer for a data engineer job. Ask about experience, strengths and motivation.'],['B1 Sprechen Teil 1','You are the exam partner. Together you plan a farewell party for a colleague: when, where, food, present.']];
  let hist=[];const uid=Math.random().toString(36).slice(2,7);
  m.innerHTML=card('Sprechpartner','<div class="no-ai small muted">This practice partner needs the tutor, which works when the page is opened inside Claude. Without it: play the dialogues above and speak your role aloud.</div><div class="needs-ai stack" style="gap:10px;flex-direction:column"><div class="row"><label class="small" for="cs-'+uid+'">Situation</label><select id="cs-'+uid+'">'+SC.map((s,i)=>'<option value="'+i+'">'+esc(s[0])+'</option>').join('')+'</select><button class="btn ghost" type="button" data-new>Start again</button></div><div class="dlg" data-log></div><label class="small" for="ci-'+uid+'">Your answer in German</label><textarea id="ci-'+uid+'" lang="de" spellcheck="false" style="min-height:64px" placeholder="Guten Tag, ..."></textarea><div class="row"><button class="btn line" type="button" data-send>Send</button></div><div class="out" data-o aria-live="polite"></div></div>');
  const log=$('[data-log]',m),out=$('[data-o]',m);
  function paint(){log.innerHTML=hist.map(h=>'<div class="dl '+(h[0]?'me':'them')+'"><div class="bub"><span lang="de">'+esc(h[1])+'</span>'+(h[0]?'':say(h[1]))+(h[2]?'<span class="en">'+esc(h[2])+'</span>':'')+'</div></div>').join('')}
  m.addEventListener('click',e=>{if(e.target.closest('[data-new]')){hist=[];paint();out.textContent=''}
    if(e.target.closest('[data-send]')){const ta=$('textarea',m),t=ta.value.trim();if(!t)return;hist.push([1,t]);ta.value='';paint();
      const s=SC[+$('select',m).value];
      A().askAI('Role play for a German learner at level A2 to B1. '+s[1]+' Speak only simple German, two short sentences, and end with a question so the talk continues.\n\nConversation so far:\n'+hist.map(h=>(h[0]?'Learner: ':'You: ')+h[1]).join('\n')+'\n\nAnswer in exactly this form, plain text:\nREPLY: (your next line in German)\nFIX: (one short English sentence that corrects the most important mistake in the learner\'s last line, with the corrected German. If it was correct, write: Correct.)',out,txt=>{
        const r=(txt.match(/REPLY:\s*([\s\S]*?)(?:\nFIX:|$)/)||[])[1],f=(txt.match(/FIX:\s*([\s\S]*)$/)||[])[1];
        if(r){hist[hist.length-1][2]=f?f.trim():'';hist.push([0,r.trim()]);paint();out.textContent=''}})}});
};

/* ---------- writing coach ---------- */
W.coach=function(m){
  const TASKS=[['Aufgabe 1 (informal, about 80 words): You moved to a new city. Write to a friend: describe the city, say what you like, invite your friend.','informal'],['Aufgabe 1 (informal, about 80 words): You were at a colleague\'s birthday party. Write to a friend who could not come: how was it, what did you give, suggest meeting.','informal'],['Aufgabe 2 (opinion, about 80 words): Forum topic "Should children get a smartphone at age 10?" Write your opinion.','opinion'],['Aufgabe 2 (opinion, about 80 words): Forum topic "Is working from home better than the office?" Write your opinion.','opinion'],['Aufgabe 3 (formal, about 40 words): You are ill and cannot come to work tomorrow. Write to your team lead, Frau Becker.','formal'],['Aufgabe 3 (formal, about 40 words): You want to move a meeting with a customer, Herr Schmidt, from Monday to Wednesday.','formal'],['Work e-mail (formal, about 60 words): You need access to a database. Ask the IT department politely.','formal']];
  const uid=Math.random().toString(36).slice(2,7);
  m.innerHTML=card('Writing coach','<label for="ct-'+uid+'">Choose a task</label><select id="ct-'+uid+'">'+TASKS.map(t=>'<option>'+esc(t[0])+'</option>').join('')+'</select><label for="cx-'+uid+'">Your text in German</label><textarea id="cx-'+uid+'" lang="de" spellcheck="false" placeholder="Liebe Anna, ..."></textarea><p class="small muted" data-n>0 words</p>'
   +'<div class="row needs-ai"><button class="btn line" type="button" data-chk>Check my German</button></div><div class="no-ai small muted">Check it yourself: 1. Did you write about every point of the task? 2. Is the verb in position 2? 3. In weil/dass sentences, is the verb at the end? 4. du or Sie, the same all the way? 5. Greeting and closing? Open this page inside Claude to get corrections here.</div><div class="out" data-o aria-live="polite"></div>');
  const ta=$('textarea',m);
  ta.addEventListener('input',()=>{$('[data-n]',m).textContent=ta.value.trim().split(/\s+/).filter(Boolean).length+' words'});
  $('[data-chk]',m).addEventListener('click',()=>{const t=ta.value.trim(),o=$('[data-o]',m);if(t.length<15){o.textContent='Write a few sentences first.';return}
    A().askAI('You are a kind German teacher and Goethe B1 examiner. The learner is at level A2 and wants to reach B1. Explain in very simple English with short sentences. Plain text only, no markdown.\n\nTask: '+$('select',m).value+'\n\nLearner text:\n'+t+'\n\nAnswer in this form:\nCORRECTED TEXT: (the full text in correct German, keeping the learner\'s ideas)\nYOUR 3 MOST IMPORTANT MISTAKES: (for each: wrong -> right, and one short reason)\nTASK: (did the text cover every point of the task? one sentence)\nWHAT YOU DID WELL: (one sentence)\nLEVEL OF THIS TEXT: (A2, A2+, B1 or B1+)',o)});
};
})();
