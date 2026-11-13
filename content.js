// Shared helpers for all lesson files. Lesson text is simple English on purpose.
// Load order: content.js, then the c-*.js files, then widgets.js, then app.js.
(function(){
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Code blocks as tagged templates: H.py`...`  (String.raw keeps backslashes as written)
const pre=l=>(s,...v)=>'<pre data-l="'+l+'"><code>'+esc(String.raw(s,...v).replace(/^\n/,'').replace(/\n\s*$/,''))+'</code></pre>';
const say=g=>'<button class="say" type="button" data-say="'+esc(g.replace(/<[^>]+>/g,''))+'" aria-label="Listen">&#9654;</button>';
window.H={
  esc,
  py:pre('py'),sql:pre('sql'),kql:pre('kql'),yaml:pre('yaml'),sh:pre('sh'),txt:pre('txt'),m:pre('txt'),
  // German sentence with a listen button and the English meaning
  D:(g,e)=>'<div class="de"><span lang="de">'+g+'</span>'+say(g)+'<span class="en">'+e+'</span></div>',
  // Widget mount point: H.W('name','argument')
  W:(n,a)=>'<div class="widget" data-w="'+n+'"'+(a?' data-a="'+a+'"':'')+'></div>',
  // Table: H.tbl(['Head','Head'],[['cell','cell'],...])
  tbl:(h,rows)=>'<div class="tbl"><table><thead><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>',
  tip:t=>'<div class="note tip"><b>Tip</b><span>'+t+'</span></div>',
  trap:t=>'<div class="note trap"><b>Exam trap</b><span>'+t+'</span></div>',
  warn:t=>'<div class="note warn"><b>Careful</b><span>'+t+'</span></div>',
  job:t=>'<div class="note job"><b>On the job</b><span>'+t+'</span></div>',
  more:(title,html)=>'<details class="reveal"><summary>'+title+'</summary><div class="stack" style="gap:10px">'+html+'</div></details>',
  yt:q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q),
  L:{
    exam:'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-700',
    guide:'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700',
    labs:'https://microsoftlearning.github.io/mslearn-fabric/',
    fabric:'https://app.fabric.microsoft.com',
    docs:'https://learn.microsoft.com/en-us/fabric/',
    dw:'https://learngerman.dw.com/',
    vhs:'https://www.vhs-lernportal.de/',
    hf:'https://huggingface.co/learn'
  }
};
window.TRACKS={};   // the five learning lines
window.WD={nodes:{},annot:{},tree:{},scenario:{},dialog:{}};  // data for interactive widgets
window.DECKS={};    // German flashcard decks
window.BANK=[];     // DP-700 exam-style question bank
window.GLOSS=[];    // glossary
})();
