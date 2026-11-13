// Deutsch line, part 1: foundation, tenses, connecting sentences.
(function(){
const {D,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;
const de=s=>'<span lang="de">'+s+'</span>';

// Sentence builder: cols = slot names, w = [text, slot index, is verb part]
WD.satz=[
 {n:'Normal',cols:['Position 1','Verb','Mitte','Ende'],w:[['Ich',0],['schreibe',1,1],['heute den Bericht.',2]],note:'The verb is always the second element. Not the second word: the second block.'},
 {n:'Time first',cols:['Position 1','Verb','Mitte','Ende'],w:[['Heute',0],['schreibe',1,1],['ich den Bericht.',2]],note:'When something else stands first, the subject moves behind the verb. The verb stays in position 2.'},
 {n:'Modal verb',cols:['Position 1','Verb','Mitte','Ende'],w:[['Ich',0],['muss',1,1],['heute den Bericht',2],['schreiben.',3,1]],note:'The modal verb takes position 2. The other verb goes to the very end as infinitive. This is the "Satzklammer" (sentence bracket).'},
 {n:'Perfekt',cols:['Position 1','Verb','Mitte','Ende'],w:[['Ich',0],['habe',1,1],['gestern den Bericht',2],['geschrieben.',3,1]],note:'haben or sein in position 2, the Partizip at the end. The same bracket.'},
 {n:'Separable verb',cols:['Position 1','Verb','Mitte','Ende'],w:[['Ich',0],['rufe',1,1],['den Kunden morgen',2],['an.',3,1]],note:'anrufen splits: the main part in position 2, the prefix at the end.'},
 {n:'Yes/no question',cols:['Verb','Subjekt','Mitte','Ende'],w:[['Hast',0,1],['du',1],['den Bericht',2],['geschrieben?',3,1]],note:'A question without a question word starts with the verb.'},
 {n:'W-question',cols:['Fragewort','Verb','Mitte','Ende'],w:[['Wann',0],['hast',1,1],['du den Bericht',2],['geschrieben?',3,1]],note:'The question word is position 1. The verb is again position 2.'},
 {n:'weil sentence',cols:['Hauptsatz','Konnektor','Mitte','Verb am Ende'],w:[['Ich komme später,',0],['weil',1],['ich einen Termin',2],['habe.',3,1]],note:'After weil, dass, wenn, obwohl the verb goes to the end of its part.'},
 {n:'Nebensatz first',cols:['Nebensatz = Position 1','Verb','Mitte','Ende'],w:[['Weil ich einen Termin habe,',0],['komme',1,1],['ich später.',2]],note:'The whole Nebensatz counts as position 1. So the main verb comes right after the comma: verb, comma, verb.'}];

TRACKS.deutsch={c:'d',letter:'D',name:'Deutsch: A2 → B1',goal:'Pass the B1 exam in about six months, then continue to B2',
intro:'One grammar idea per station, with sentences from office life and daily life in Germany. Every German sentence has a listen button. Do 30 minutes a day. A short daily habit beats one long Sunday.',
stations:[

/* ───────────── Fundament ───────────── */
{id:'D12',sec:'Fundament',min:20,t:'Aussprache: sounds that are different',sum:'Listen, repeat, be understood',
 body:`<p>Germans understand you much better when a few sounds are right. Press the listen button, then say the word out loud. Record yourself with your phone and compare.</p>
 ${tbl(['Letters','Sound','Listen'],[
  ['<b>ei</b>','like English "my"',D('mein, Arbeit, Zeit','my, work, time')],
  ['<b>ie</b>','long "ee"',D('Sie, vier, Dienstag','you, four, Tuesday')],
  ['<b>eu, äu</b>','like "oy" in "boy"',D('heute, neu, Häuser','today, new, houses')],
  ['<b>ä, ö, ü</b>','ä like "e" in "bed". ö: say "e" with round lips. ü: say "ee" with round lips',D('spät, schön, müde, Büro','late, nice, tired, office')],
  ['<b>ch</b>','soft after e, i, ä, ö, ü (ich). Hard in the throat after a, o, u (ach)',D('ich, nicht, Buch, machen','I, not, book, to make')],
  ['<b>sch, sp-, st-</b>','sch = "sh". At the start of a word, sp and st sound like "shp" and "sht"',D('Schule, sprechen, Stadt','school, to speak, city')],
  ['<b>z</b>','always "ts"',D('Zeit, zehn, Zahl','time, ten, number')],
  ['<b>w</b> and <b>v</b>','w sounds like English "v". v mostly sounds like "f"',D('Wasser, wir, Vater, viel','water, we, father, much')],
  ['<b>s</b>','before a vowel like English "z". ß and ss are a sharp "s"',D('Sonne, lesen, Straße','sun, to read, street')],
  ['<b>-ig</b>','at the end like "ich"',D('wichtig, fertig, richtig','important, finished, right')],
  ['<b>r</b>','in the throat. At the end of a word almost like "a"',D('rot, Bruder, Wasser','red, brother, water')]])}
 <h4>Long or short changes the meaning</h4>
 ${D('die Miete – die Mitte','the rent – the middle')}${D('der Staat – die Stadt','the state – the city')}${D('ich fühle – ich fülle','I feel – I fill')}
 <p>A vowel is long before <b>h</b> (zahlen) and when doubled (Boot). It is short before two consonants (kommen, Mitte).</p>
 <h4>Word stress</h4>
 <p>Most German words are stressed on the <b>first</b> part: <b>AR</b>beiten, <b>ANT</b>worten. Words with be-, ge-, er-, ver-, ent- are stressed after it: be<b>SU</b>chen, ver<b>STE</b>hen. Words from other languages often stress the end: Informa<b>TION</b>, Stu<b>DENT</b>.</p>`,
 key:['ei = "eye", ie = "ee". z = "ts". w = "v", v = "f".','Stress the first part of most words.'],
 do:['Read the three word pairs aloud five times and record yourself.','Say these out loud: zwanzig, Entschuldigung, zwischen, Geschäftsführer, Rührei.'],
 links:[['DW: German pronunciation',L.dw]],
 ex:[
 {t:'mcq',q:'How do you say "ei" in "Arbeit"?',o:['like "ee"','like "eye"','like "ay" in day'],a:1,w:'ei = eye. ie = ee.'},
 {t:'mcq',q:'How does "z" sound in "Zeit"?',o:['like English z','like "ts"','like "s"'],a:1,w:'z is always ts.'},
 {t:'mcq',q:'Which word has a LONG vowel?',o:['Mitte','Miete','Stadt'],a:1,w:'ie is always long.'},
 {t:'mcq',q:'How does "st" sound in "Stadt"?',o:['like "st" in "stop"','like "sht"','like "z"'],a:1,w:'st and sp at the start of a word get a "sh".'}]},

{id:'D13',min:30,t:'Satzbau: where the verb goes',sum:'The most important rule of German, animated',
 body:`<p>English word order is fixed: subject, verb, object. German moves things around, but the <b>verb has a fixed home</b>. Learn where the verb lives and half of German grammar is done.</p>
 <p>Choose a sentence type and press Play.</p>
 ${W('satz')}
 <h4>Three rules</h4>
 <ol><li><b>Main sentence: the verb is in position 2.</b> ${de('Heute <b>arbeite</b> ich im Büro.')}</li>
 <li><b>A second verb part goes to the end.</b> Infinitive, Partizip or prefix. ${de('Ich <b>muss</b> heute lange <b>arbeiten</b>.')}</li>
 <li><b>Nebensatz: the verb goes to the end.</b> ${de('..., weil ich heute lange <b>arbeite</b>.')}</li></ol>
 <h4>The order in the middle: time, reason, manner, place</h4>
 <p>Germans call it <b>Te-Ka-Mo-Lo</b>: temporal (when), kausal (why), modal (how), lokal (where).</p>
 ${D('Ich fahre morgen wegen des Termins mit dem Zug nach Hamburg.','I am going to Hamburg by train tomorrow because of the appointment.')}
 <h4>nicht and kein</h4>
 <ul><li><b>kein</b> negates a noun with ein or without article: ${de('Ich habe <b>keine</b> Zeit. Das ist <b>kein</b> Problem.')}</li>
 <li><b>nicht</b> negates everything else. It stands at the end of the sentence, but before the part it negates, before the second verb part, and before a place or an adjective:</li></ul>
 ${D('Ich verstehe das nicht.','I do not understand that.')}${D('Ich kann heute nicht kommen.','I cannot come today.')}${D('Das ist nicht richtig.','That is not right.')}${D('Ich arbeite nicht in Hamburg.','I do not work in Hamburg.')}`,
 know:'Think of the two verb parts as brackets, like BEGIN and END in SQL. Everything else goes between them.',
 key:['Main sentence: verb in position 2.','Second verb part: at the end.','Nebensatz: verb at the end.'],
 do:['Take five English sentences from your work day. Say them in German, each time starting with the time (Heute, Morgen, Um zehn Uhr).'],
 links:[['DW Learn German',L.dw]],
 ex:[
 {t:'order',q:'Build: "Tomorrow I have to call the customer."',items:['Morgen','muss','ich','den Kunden','anrufen.'],w:'Time in position 1, modal verb in position 2, infinitive at the end.'},
 {t:'order',q:'Build: "I did not understand the e-mail."',items:['Ich','habe','die E-Mail','nicht','verstanden.'],w:'nicht stands before the Partizip at the end.'},
 {t:'mcq',q:'Which sentence is correct?',o:['Heute ich arbeite zu Hause.','Heute arbeite ich zu Hause.','Heute zu Hause ich arbeite.'],a:1,w:'Verb in position 2, then the subject.'},
 {t:'mcq',q:'Ich habe ___ Zeit.',o:['nicht','keine','kein'],a:1,w:'die Zeit, noun without article → keine.'},
 {t:'order',q:'Build: "When does the meeting start?"',items:['Wann','fängt','die Besprechung','an?'],w:'anfangen is separable: fängt ... an.'}]},

{id:'D14',min:35,t:'Die vier Fälle: der, den, dem, des',sum:'Who does what to whom',
 body:`<p>A <b>case</b> (Fall) shows the job of a noun in the sentence. English shows it with word order. German shows it with the article. That is why German word order can be free.</p>
 ${tbl(['Case','Job','Question','Example'],[
  ['<b>Nominativ</b>','The subject: who does it',de('Wer? Was?'),de('<b>Der Kunde</b> ruft an.')],
  ['<b>Akkusativ</b>','The direct object: what is done',de('Wen? Was?'),de('Ich rufe <b>den Kunden</b> an.')],
  ['<b>Dativ</b>','The receiver: to whom, for whom',de('Wem?'),de('Ich helfe <b>dem Kunden</b>.')],
  ['<b>Genitiv</b>','The owner: whose',de('Wessen?'),de('Das ist das Büro <b>des Kunden</b>.')]])}
 <p>Click a cell to see the article and an example.</p>
 ${W('kasus')}
 <h4>What you really have to remember</h4>
 <ul><li>In the <b>Akkusativ</b> only the masculine changes: der → <b>den</b>, ein → <b>einen</b>. Everything else stays.</li>
 <li>In the <b>Dativ</b>: der/das → <b>dem</b>, die → <b>der</b>, plural → <b>den</b> + n on the noun (mit den Kolleg<b>en</b>, mit den Kinder<b>n</b>).</li></ul>
 <h4>Pronouns</h4>
 ${tbl(['Nominativ','Akkusativ','Dativ'],[['ich','mich','mir'],['du','dich','dir'],['er','ihn','ihm'],['sie','sie','ihr'],['es','es','ihm'],['wir','uns','uns'],['ihr','euch','euch'],['sie / Sie','sie / Sie','ihnen / Ihnen']])}
 <h4>Verbs that want the Dativ</h4>
 <p>Learn them as a list: <b>helfen, danken, antworten, gefallen, gehören, glauben, passen, schmecken, gratulieren, zuhören</b>.</p>
 ${D('Ich helfe dir.','I help you.')}${D('Ich danke Ihnen für die Antwort.','I thank you for the answer.')}${D('Der Vorschlag gefällt mir.','I like the suggestion.')}${D('Passt Ihnen Dienstag?','Does Tuesday suit you?')}
 <h4>Two objects: person in Dativ, thing in Akkusativ</h4>
 ${D('Ich schicke dem Kunden den Bericht.','I send the customer the report.')}${D('Kannst du mir die Datei zeigen?','Can you show me the file?')}
 <p>With two pronouns, the Akkusativ comes first: ${de('Ich schicke <b>ihn ihm</b>.')} (I send it to him.)</p>`,
 know:'A case is like a column role: the article tells you whether a noun is the "source" or the "target" of the action, wherever it stands in the sentence.',
 key:['Akkusativ: only der → den.','Dativ: dem, der, dem, den + n.','helfen, danken, gefallen, gehören take the Dativ.'],
 do:['Write five sentences with "Ich gebe/schicke/zeige/erkläre/bringe + person + thing".','Say what you like at work with "gefällt mir" / "gefallen mir".'],
 links:[['vhs-Lernportal',L.vhs]],
 ex:[
 {t:'mcq',q:'Ich rufe ___ Kunden an. (der Kunde)',o:['der','den','dem'],a:1,w:'anrufen + Akkusativ: der → den.'},
 {t:'mcq',q:'Ich helfe ___ Kollegin. (die Kollegin)',o:['die','der','den'],a:1,w:'helfen + Dativ: die → der.'},
 {t:'fill',q:'Kannst du ___ helfen? (me)',a:['mir'],w:'helfen + Dativ: mir.'},
 {t:'fill',q:'Ich habe ___ gestern gesehen. (him)',a:['ihn'],w:'sehen + Akkusativ: ihn.'},
 {t:'mcq',q:'Ich schicke ___ die Datei. (the customers, plural)',o:['die Kunden','den Kunden','der Kunden'],a:1,w:'Dativ plural: den Kunden.'},
 {t:'order',q:'Build: "I am sending the boss the report."',items:['Ich','schicke','dem Chef','den Bericht.'],w:'Person (Dativ) before thing (Akkusativ).'},
 {t:'mcq',q:'Der neue Plan gefällt ___ . (us)',o:['wir','uns','unser'],a:1,w:'gefallen + Dativ: uns.'}]},

{id:'D15',min:35,t:'Präpositionen: in, auf, mit, für',sum:'Which case comes after which word',
 body:`<p>Every preposition decides the case of the noun after it. There are three groups.</p>
 ${tbl(['Group','Prepositions','Example'],[
  ['Always <b>Akkusativ</b>','durch, für, gegen, ohne, um',de('für <b>den</b> Kunden, ohne <b>einen</b> Termin')],
  ['Always <b>Dativ</b>','aus, bei, mit, nach, seit, von, zu, gegenüber',de('mit <b>dem</b> Zug, bei <b>der</b> Arbeit, seit <b>einem</b> Jahr')],
  ['<b>Both</b> (Wechselpräpositionen)','an, auf, hinter, in, neben, über, unter, vor, zwischen','see below'],
  ['<b>Genitiv</b>','wegen, trotz, während, statt',de('wegen <b>des</b> Wetters, während <b>der</b> Besprechung')]])}
 <h4>The nine that change</h4>
 <p>Ask: is there <b>movement to a place</b> (wohin? → Akkusativ) or <b>is something already there</b> (wo? → Dativ)?</p>
 ${W('wechsel')}
 ${D('Ich gehe ins Büro.','I am going to the office. (wohin? → Akkusativ: in das = ins)')}${D('Ich bin im Büro.','I am in the office. (wo? → Dativ: in dem = im)')}
 ${D('Ich lege den Laptop auf den Tisch.','I put the laptop on the table. (Akkusativ)')}${D('Der Laptop liegt auf dem Tisch.','The laptop is on the table. (Dativ)')}
 <p>Verb pairs help: <b>legen / liegen</b>, <b>stellen / stehen</b>, <b>setzen / sitzen</b>, <b>hängen / hängen</b>. The first of each pair is an action (Akkusativ), the second a state (Dativ).</p>
 <h4>Short forms</h4>
 <p>in dem = <b>im</b>, in das = <b>ins</b>, an dem = <b>am</b>, zu dem = <b>zum</b>, zu der = <b>zur</b>, bei dem = <b>beim</b>, von dem = <b>vom</b>.</p>
 <h4>Time</h4>
 ${tbl(['Word','Use','Example'],[
  ['<b>um</b>','clock time',de('um zehn Uhr')],
  ['<b>am</b>','day, date, part of the day',de('am Montag, am 3. Mai, am Vormittag')],
  ['<b>im</b>','month, season, year with "Jahr"',de('im Mai, im Winter, im Jahr 2026')],
  ['<b>seit</b> + Dativ','started in the past, still true',de('Ich arbeite seit zwei Jahren hier.')],
  ['<b>vor</b> + Dativ','ago',de('vor einer Woche')],
  ['<b>in</b> + Dativ','in the future',de('in einer Stunde')],
  ['<b>bis</b>','until',de('bis Freitag')],
  ['<b>ab</b>','from ... on',de('ab Montag')],
  ['<b>von ... bis</b>','from ... to',de('von 9 bis 17 Uhr')]])}
 <h4>Where to and where: nach, zu, in, bei</h4>
 ${D('Ich fahre nach Berlin / nach Deutschland / nach Hause.','to cities, countries without article, home')}${D('Ich gehe zum Arzt / zur Arbeit / zu Frau Becker.','to people and places as targets')}${D('Ich bin beim Arzt / bei der Arbeit / zu Hause.','at a person, at work, at home')}`,
 key:['mit, bei, nach, seit, von, zu, aus → Dativ. für, ohne, um, durch, gegen → Akkusativ.','Wohin? → Akkusativ. Wo? → Dativ.','um 10 Uhr, am Montag, im Mai.'],
 do:['Describe where five things in your room are: "Der Monitor steht auf dem Tisch."','Then move them in your head: "Ich stelle den Monitor auf den Tisch."'],
 links:[['vhs-Lernportal',L.vhs]],
 ex:[
 {t:'mcq',q:'Ich fahre mit ___ Zug. (der Zug)',o:['den','dem','der'],a:1,w:'mit + Dativ.'},
 {t:'mcq',q:'Das Geschenk ist für ___ Chef. (der Chef)',o:['den','dem','der'],a:0,w:'für + Akkusativ.'},
 {t:'mcq',q:'Ich gehe ___ Büro. (movement)',o:['im','ins','am'],a:1,w:'wohin? → in das = ins.'},
 {t:'mcq',q:'Die Unterlagen liegen auf ___ Tisch. (der Tisch)',o:['den','dem','das'],a:1,w:'wo? → Dativ.'},
 {t:'fill',q:'Die Besprechung beginnt ___ zehn Uhr.',a:['um'],w:'Clock time: um.'},
 {t:'fill',q:'Ich arbeite ___ zwei Jahren bei dieser Firma.',a:['seit'],w:'seit + Dativ: it started in the past and is still true. German uses the present tense here.'},
 {t:'mcq',q:'Ich habe ___ Montag einen Termin.',o:['im','am','um'],a:1,w:'Days: am.'},
 {t:'mcq',q:'Morgen fahre ich ___ Hamburg.',o:['zu','nach','in'],a:1,w:'Cities: nach.'}]},

{id:'D16',min:30,t:'Modalverben, trennbare und reflexive Verben',sum:'Three verb types you use every hour',
 body:`<h4>Modalverben</h4>
 ${tbl(['Verb','Meaning','ich / er','Präteritum'],[
  ['können','can, be able to','kann','konnte'],
  ['müssen','must, have to','muss','musste'],
  ['wollen','want to','will','wollte'],
  ['sollen','should, be supposed to (someone else says so)','soll','sollte'],
  ['dürfen','may, be allowed to','darf','durfte'],
  ['mögen / möchten','like / would like','mag / möchte','mochte / wollte']])}
 ${D('Ich kann dir helfen.','I can help you.')}${D('Ich muss den Bericht bis Freitag schreiben.','I have to write the report by Friday.')}${D('Der Chef sagt, ich soll den Kunden anrufen.','The boss says I should call the customer.')}${D('Darf ich Sie etwas fragen?','May I ask you something?')}
 ${warn(de('Ich muss nicht')+' means "I do not have to". "I must not" is '+de('Ich darf nicht')+'. '+de('Ich will')+' means "I want", not "I will".')}
 <h4>Trennbare Verben</h4>
 <p>Many verbs have a prefix that splits off and goes to the end: <b>an</b>rufen, <b>auf</b>machen, <b>ein</b>laden, <b>mit</b>bringen, <b>vor</b>stellen, <b>zu</b>hören, <b>ab</b>sagen, <b>an</b>fangen, <b>teil</b>nehmen, <b>weiter</b>leiten.</p>
 ${D('Ich rufe Sie morgen an.','I will call you tomorrow.')}${D('Ich leite die E-Mail weiter.','I am forwarding the e-mail.')}${D('Ich habe den Termin abgesagt.','I cancelled the appointment. (Perfekt: ab-ge-sagt)')}${D('Ich muss den Termin absagen.','I have to cancel the appointment. (with modal: together)')}
 <p>These prefixes <b>never</b> split: be-, ge-, er-, ver-, zer-, ent-, emp-, miss-. ${de('Ich <b>bestelle</b> das. Ich habe es <b>bestellt</b>.')} (no ge-)</p>
 <h4>Reflexive Verben</h4>
 <p>The verb needs a "self" word: mich, dich, sich, uns, euch, sich.</p>
 ${D('Ich freue mich auf das Wochenende.','I am looking forward to the weekend.')}${D('Ich muss mich beeilen.','I have to hurry.')}${D('Wir treffen uns um zehn.','We meet at ten.')}${D('Ich interessiere mich für Daten.','I am interested in data.')}${D('Ich habe mich beworben.','I applied (for a job).')}${D('Darf ich mich vorstellen?','May I introduce myself?')}`,
 key:['Modal verb in position 2, the other verb at the end.','Separable prefix goes to the end. be-, ver-, er-, ent- never split.','müssen nicht = need not. dürfen nicht = must not.'],
 do:['Say five things you must do tomorrow and three you want to do at the weekend.','Write your morning with separable verbs: aufstehen, anziehen, losfahren, ankommen, anfangen.'],
 links:[['DW Learn German',L.dw]],
 ex:[
 {t:'mcq',q:'"You must not smoke here." →',o:['Sie müssen hier nicht rauchen.','Sie dürfen hier nicht rauchen.','Sie sollen hier rauchen.'],a:1,w:'must not = nicht dürfen.'},
 {t:'order',q:'Build: "I am calling you tomorrow."',items:['Ich','rufe','dich','morgen','an.'],w:'anrufen: rufe ... an.'},
 {t:'fill',q:'Ich freue ___ auf den Urlaub.',a:['mich'],w:'sich freuen: ich freue mich.'},
 {t:'mcq',q:'Perfekt of "einladen": Ich habe ihn ___.',o:['eingeladen','geeinladen','einladet'],a:0,w:'Separable: ein-ge-laden.'},
 {t:'mcq',q:'Perfekt of "bestellen": Ich habe es ___.',o:['gebestellt','bestellt','bestellen'],a:1,w:'be- never splits, and there is no ge-.'},
 {t:'fill',q:'Wir treffen ___ um zehn Uhr.',a:['uns'],w:'wir → uns.'}]},

{id:'D0',min:25,t:'Wörter: lernen, was bleibt',sum:'Flashcards with spaced repetition, and der/die/das rules',
 body:`<p>For B1 you need about 2,400 words. You know many already. The fastest way to keep new words is <b>spaced repetition</b>: you see a card again just before you forget it. The card boxes below do this for you. A word you know moves to a higher box and comes back later. A word you miss goes back to box 1.</p>
 <p>Choose a deck. Say the word and the example sentence out loud.</p>
 ${W('cards','buero')}
 <h4>der, die or das? Endings that tell you</h4>
 <p>Always learn a noun with its article. These endings give you the article for free:</p>
 ${tbl(['Article','Endings','Examples'],[
  ['<b>die</b>','-ung, -heit, -keit, -schaft, -ion, -tät, -ie, -ik, -ur, most nouns ending in -e',de('die Lösung, die Freiheit, die Möglichkeit, die Information, die Qualität, die Frage')],
  ['<b>der</b>','-er (people, tools), -ling, -ismus, -or, days, months, seasons',de('der Entwickler, der Rechner, der Montag, der Mai, der Sommer, der Monitor')],
  ['<b>das</b>','-chen, -lein, -ment, -um, -tum, verbs used as nouns, most Ge- words',de('das Mädchen, das Dokument, das Datum, das Essen, das Gespräch')]])}
 <p>In a compound noun, the <b>last</b> word decides: ${de('<b>die</b> Daten + <b>der</b> Bank → die Datenbank. <b>das</b> Projekt + <b>der</b> Leiter → der Projektleiter.')}</p>
 <p>Train it. How many can you get right in a row?</p>
 ${W('artikel')}`,
 key:['Learn every noun with its article.','-ung, -heit, -keit, -ion → die. -chen, -ment, -um → das.','In compounds the last word decides.'],
 do:['Do the due cards every day. Five minutes are enough.','Use one new word in a real message to a colleague.'],
 links:[['DW Learn German (free course Nicos Weg)',L.dw],['vhs-Lernportal (free, A1 to B2)',L.vhs],['Goethe B1 word list (PDF)','https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf']],
 ex:[
 {t:'mcq',q:'___ Besprechung',o:['der','die','das'],a:1,w:'-ung is always die.'},
 {t:'mcq',q:'___ Dokument',o:['der','die','das'],a:2,w:'-ment → das.'},
 {t:'mcq',q:'___ Möglichkeit',o:['der','die','das'],a:1,w:'-keit → die.'},
 {t:'mcq',q:'___ Datenbank (die Daten + die Bank)',o:['der','die','das'],a:1,w:'The last word decides: die Bank.'},
 {t:'mcq',q:'___ Arbeitsvertrag (die Arbeit + der Vertrag)',o:['der','die','das'],a:0,w:'The last word decides: der Vertrag.'}]},

/* ───────────── Zeiten ───────────── */
{id:'D1',sec:'Zeiten',min:35,t:'Perfekt und Präteritum',sum:'Talking about the past',
 body:`<p>When you <b>speak</b>, use the Perfekt: <b>haben</b> or <b>sein</b> + Partizip II at the end.</p>
 ${D('Ich habe den Bericht geschrieben.','I wrote the report.')}${D('Wir sind um acht Uhr ins Büro gekommen.','We came to the office at eight.')}
 <p>Use <b>sein</b> for movement from A to B and for change (gehen, kommen, fahren, fliegen, werden, aufstehen, einschlafen), and for <b>sein, bleiben, passieren</b>. Use <b>haben</b> for everything else.</p>
 <h4>How to build the Partizip II</h4>
 ${tbl(['Type','Rule','Example'],[
  ['Regular','ge- + stem + -t','machen → <b>ge</b>mach<b>t</b>, arbeiten → gearbeitet'],
  ['Irregular','ge- + (changed) stem + -en','schreiben → <b>ge</b>schrieb<b>en</b>, finden → gefunden'],
  ['Separable','ge- goes in the middle','anrufen → an<b>ge</b>rufen, einkaufen → eingekauft'],
  ['be-, ver-, er-, ent- and -ieren','no ge-','besuchen → besucht, vergessen → vergessen, telefonieren → telefoniert']])}
 <p>For <b>sein, haben</b> and modal verbs, people use the Präteritum even when speaking:</p>
 ${D('Ich war gestern krank.','I was ill yesterday.')}${D('Ich hatte keine Zeit.','I had no time.')}${D('Ich musste lange arbeiten.','I had to work late.')}${D('Ich konnte nicht kommen.','I could not come.')}
 <h4>Präteritum in writing</h4>
 <p>News, reports and stories use the Präteritum for all verbs. You must <b>recognise</b> it when reading. Regular verbs add -te: ${de('machte, arbeitete, sagte')}. Irregular verbs change the vowel and have no ending for ich and er: ${de('ging, kam, schrieb, fand, gab, sah')}.</p>
 <h4>Irregular verbs: train the three forms</h4>
 ${W('verbs')}`,
 key:['Speaking: Perfekt. But: war, hatte, musste, konnte, wollte.','sein for movement and change, haben for the rest.','No ge- with be-, ver-, er-, ent- and -ieren.'],
 do:['Tell your day in five Perfekt sentences. Say them out loud.','Train ten irregular verbs in the trainer above every day for two weeks.'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'fill',q:'Gestern ___ ich lange gearbeitet.',a:['habe'],w:'arbeiten uses haben.'},
 {t:'fill',q:'Wir ___ um acht Uhr ins Büro gekommen.',a:['sind'],w:'kommen is movement, so sein.'},
 {t:'mcq',q:'Präteritum: Ich ___ gestern nicht kommen.',o:['kann','konnte','gekonnt'],a:1,w:'können → konnte.'},
 {t:'mcq',q:'Ich ___ gestern zu Hause geblieben.',o:['habe','bin'],a:1,w:'bleiben uses sein, although there is no movement.'},
 {t:'fill',q:'Ich habe die E-Mail ___ . (vergessen)',a:['vergessen'],w:'ver- has no ge-. The Partizip looks like the infinitive.'},
 {t:'fill',q:'Hast du den Kunden ___ ? (anrufen)',a:['angerufen'],w:'Separable: an-ge-rufen.'},
 {t:'mcq',q:'Wir haben gestern drei Stunden ___ .',o:['getelefoniert','telefoniert','telefonieren'],a:1,w:'-ieren verbs have no ge-.'},
 {t:'mcq',q:'In a newspaper you read "Er ging nach Hause." Which verb is it?',o:['geben','gehen','gelingen'],a:1,w:'gehen – ging – gegangen.'}]},

{id:'D17',min:25,t:'Plusquamperfekt, Futur und das Verb "werden"',sum:'Before the past, and after now',
 body:`<h4>Plusquamperfekt: what happened before something in the past</h4>
 <p>Form: <b>hatte</b> or <b>war</b> + Partizip II. You need it most with <b>nachdem</b> (after).</p>
 ${D('Ich hatte die E-Mail schon geschickt, als er anrief.','I had already sent the e-mail when he called.')}
 ${D('Nachdem wir den Fehler gefunden hatten, lief alles wieder.','After we had found the error, everything ran again.')}
 ${D('Der Zug war schon abgefahren.','The train had already left.')}
 <h4>Futur I: werden + infinitive</h4>
 ${D('Ich werde den Bericht morgen schicken.','I will send the report tomorrow.')}
 <p>Germans often use the <b>present tense with a time word</b> for the future. It is simpler and correct:</p>
 ${D('Ich schicke den Bericht morgen.','I will send the report tomorrow.')}
 <p>Use Futur I for a <b>promise</b>, a <b>plan</b> or a <b>guess</b>:</p>
 ${D('Ich werde mich darum kümmern.','I will take care of it. (promise)')}${D('Er wird wohl noch im Stau stehen.','He is probably still in a traffic jam. (guess)')}
 <h4>werden has three jobs</h4>
 ${tbl(['Job','Form','Example'],[
  ['"to become"','werden alone',de('Ich werde Dateningenieur. Es wird spät.')],
  ['Future','werden + infinitive',de('Ich werde morgen anrufen.')],
  ['Passive','werden + Partizip II',de('Die Daten werden geladen.')]])}
 <p>Forms: ich werde, du wirst, er wird, wir werden, ihr werdet, sie werden. Past: wurde. Perfekt: ist geworden.</p>`,
 key:['Plusquamperfekt = hatte/war + Partizip. Use it with nachdem.','Future: present tense + time word is usually enough.','werden + infinitive = future. werden + Partizip = passive.'],
 do:['Write three sentences with nachdem about your morning.','Make three promises with "Ich werde ...".'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'fill',q:'Nachdem ich gegessen ___ , bin ich ins Büro gegangen.',a:['hatte'],w:'Plusquamperfekt: hatte + Partizip.'},
 {t:'mcq',q:'Which sentence is future?',o:['Die Daten werden geladen.','Ich werde die Daten laden.','Ich werde müde.'],a:1,w:'werden + infinitive.'},
 {t:'mcq',q:'"Es wird spät." What does werden mean here?',o:['will','becomes','is being'],a:1,w:'werden alone = to become, to get.'},
 {t:'fill',q:'Als ich ankam, ___ der Zug schon abgefahren.',a:['war'],w:'abfahren uses sein: war abgefahren.'}]},

/* ───────────── Sätze verbinden ───────────── */
{id:'D2',sec:'Sätze verbinden',min:30,t:'Nebensätze: weil, dass, wenn, obwohl',sum:'The verb goes to the end',
 body:`<p>After <b>weil</b> (because), <b>dass</b> (that), <b>wenn</b> (if / when) and <b>obwohl</b> (although), the verb moves to the <b>end</b>.</p>
 ${D('Ich lerne Deutsch, weil ich in Deutschland arbeite.','I learn German because I work in Germany.')}
 ${D('Ich glaube, dass der Kunde heute anruft.','I think that the customer will call today.')}
 ${D('Wenn ich Zeit habe, helfe ich dir.','If I have time, I will help you.')}
 ${D('Obwohl es spät ist, arbeite ich weiter.','Although it is late, I keep working.')}
 <p>When the sentence <b>starts</b> with the Nebensatz, the main verb comes right after the comma.</p>
 <h4>With two verb parts</h4>
 <p>The verb with the personal ending goes to the very end, behind the Partizip or infinitive. A separable verb comes together again.</p>
 ${D('..., weil ich den Bericht geschrieben habe.','... because I wrote the report.')}
 ${D('..., weil ich heute lange arbeiten muss.','... because I have to work late today.')}
 ${D('..., dass er morgen anruft.','... that he will call tomorrow.')}
 <h4>denn: the easy "because"</h4>
 <p><b>denn</b> also means because, but the word order stays normal. Good when you are tired.</p>
 ${D('Ich komme später, denn ich habe einen Termin.','I am coming later, because I have an appointment.')}
 <h4>Useful starters with dass</h4>
 ${D('Ich hoffe, dass ...','I hope that ...')}${D('Ich denke, dass ...','I think that ...')}${D('Es tut mir leid, dass ...','I am sorry that ...')}${D('Es ist wichtig, dass ...','It is important that ...')}${D('Ich habe gehört, dass ...','I heard that ...')}`,
 key:['weil, dass, wenn, obwohl → verb at the end.','Two verb parts: the conjugated verb is last.','denn = because with normal word order.'],
 do:['Write three reasons with weil: why you learn German, why you like your job, why you live in Osnabrück.','Say three sentences with "Ich hoffe, dass ...".'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'order',q:'Build the sentence: "I am coming later because I have an appointment."',items:['Ich','komme','später,','weil','ich','einen','Termin','habe.'],w:'habe goes to the end after weil.'},
 {t:'mcq',q:'Ich glaube, dass er heute im Büro ___.',o:['ist','sein','er ist'],a:0,w:'Verb at the end: ... dass er heute im Büro ist.'},
 {t:'fill',q:'___ ich Zeit habe, helfe ich dir.',a:['wenn'],w:'wenn = if / when.'},
 {t:'order',q:'Build: "... because I have to work late today."',items:['weil','ich','heute','lange','arbeiten','muss.'],w:'The modal verb is last, behind the infinitive.'},
 {t:'mcq',q:'Which is correct?',o:['Ich bleibe zu Hause, weil ich bin krank.','Ich bleibe zu Hause, weil ich krank bin.','Ich bleibe zu Hause, weil bin ich krank.'],a:1,w:'After weil the verb is at the end.'},
 {t:'mcq',q:'Ich bleibe zu Hause, ___ ich bin krank.',o:['weil','denn','dass'],a:1,w:'Normal word order (ich bin) → denn.'},
 {t:'order',q:'Build: "Although it rains, I go by bike."',items:['Obwohl','es','regnet,','fahre','ich','mit dem Rad.'],w:'Nebensatz first, then verb directly after the comma.'}]},

{id:'D18',min:35,t:'Konnektoren: deshalb, trotzdem, als, bevor',sum:'Words that join sentences, and where the verb goes with each',
 body:`<p>Connectors make your German sound like B1. There are three groups, and each group has its own word order.</p>
 ${tbl(['Group','Words','Word order','Example'],[
  ['<b>Position 0</b>','und, aber, oder, denn, sondern','Nothing changes. The connector does not count',de('Ich bin müde, <b>aber</b> ich <b>arbeite</b> weiter.')],
  ['<b>Position 1</b>','deshalb, deswegen, darum, trotzdem, außerdem, dann, danach, sonst','The connector takes position 1, so the <b>verb comes next</b>',de('Ich bin krank, <b>deshalb bleibe</b> ich zu Hause.')],
  ['<b>Nebensatz</b>','weil, dass, wenn, als, obwohl, bevor, nachdem, während, seit, bis, sobald, falls, damit, ob','Verb at the <b>end</b>',de('Ich bleibe zu Hause, <b>weil</b> ich krank <b>bin</b>.')]])}
 <h4>Reason and result</h4>
 ${D('Ich habe einen Termin, deshalb komme ich später.','I have an appointment, therefore I am coming later.')}
 ${D('Es regnet, trotzdem fahre ich mit dem Rad.','It is raining, I am going by bike anyway.')}
 ${D('Wir müssen uns beeilen, sonst verpassen wir den Zug.','We have to hurry, otherwise we will miss the train.')}
 <h4>Time</h4>
 ${D('Als ich nach Deutschland kam, konnte ich kein Deutsch.','When I came to Germany, I spoke no German.')}
 ${D('Wenn ich nach Hause komme, koche ich.','When(ever) I come home, I cook.')}
 ${D('Bevor ich gehe, schicke ich die E-Mail.','Before I leave, I send the e-mail.')}
 ${D('Nachdem ich gegessen habe, gehe ich spazieren.','After I have eaten, I go for a walk.')}
 ${D('Während ich arbeite, höre ich Musik.','While I work, I listen to music.')}
 ${D('Ich warte, bis du fertig bist.','I will wait until you are finished.')}
 ${D('Sobald ich mehr weiß, melde ich mich.','As soon as I know more, I will get in touch.')}
 ${D('Seit ich hier wohne, fahre ich Rad.','Since I have lived here, I have been cycling.')}
 ${trap('<b>als</b> or <b>wenn</b>? One time in the past → <b>als</b>. Every time, or present and future → <b>wenn</b>. '+de('Als ich ein Kind war ...')+' but '+de('Immer wenn ich ihn besuchte ...'))}
 <h4>Pairs</h4>
 ${D('Ich spreche nicht nur Englisch, sondern auch Deutsch.','I speak not only English but also German.')}
 ${D('Wir treffen uns entweder am Montag oder am Dienstag.','We will meet either on Monday or on Tuesday.')}
 ${D('Ich habe weder Zeit noch Lust.','I have neither time nor the wish.')}
 ${D('Das ist sowohl schnell als auch billig.','That is both fast and cheap.')}
 ${D('Die Wohnung ist zwar klein, aber sie ist zentral.','The flat is small, it is true, but it is central.')}
 ${D('Je mehr ich übe, desto besser spreche ich.','The more I practise, the better I speak.')}`,
 key:['und, aber, oder, denn, sondern: no change.','deshalb, trotzdem, außerdem: verb right after them.','als = once in the past. wenn = every time, or now and future.'],
 do:['Join these with deshalb, trotzdem and weil: "Ich bin müde. Ich lerne Deutsch."','Write five sentences about your life with als, bevor, nachdem, seit, sobald.'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'mcq',q:'Ich bin krank, deshalb ___ .',o:['ich bleibe zu Hause','bleibe ich zu Hause','ich zu Hause bleibe'],a:1,w:'deshalb is position 1, so the verb comes next.'},
 {t:'mcq',q:'___ ich nach Deutschland kam, war ich 26 Jahre alt.',o:['Wenn','Als','Wann'],a:1,w:'One time in the past: als.'},
 {t:'mcq',q:'Es regnet, ___ gehe ich spazieren.',o:['trotzdem','obwohl','weil'],a:0,w:'trotzdem + verb. obwohl would send the verb to the end.'},
 {t:'fill',q:'Ich habe weder Zeit ___ Geld.',a:['noch'],w:'weder ... noch = neither ... nor.'},
 {t:'order',q:'Build: "Before I go home, I write the e-mail."',items:['Bevor','ich','nach Hause','gehe,','schreibe','ich','die E-Mail.'],w:'Nebensatz first: verb, comma, verb.'},
 {t:'mcq',q:'Ich trinke keinen Kaffee, ___ Tee.',o:['aber','sondern','oder'],a:1,w:'After a negation, "but rather" is sondern.'},
 {t:'fill',q:'Je mehr ich lerne, ___ besser verstehe ich.',a:['desto','umso'],w:'je ... desto.'},
 {t:'mcq',q:'Ich rufe dich an, ___ ich angekommen bin.',o:['sobald','deshalb','außerdem'],a:0,w:'sobald = as soon as, verb at the end.'}]},

{id:'D3',min:30,t:'Relativsätze',sum:'The colleague who helped me',
 body:`<p>A Relativsatz gives more information about a noun. It starts with <b>der, die, das</b> (or den, dem ...) and the verb goes to the end.</p>
 ${D('Das ist der Kollege, der mir geholfen hat.','This is the colleague who helped me.')}
 ${D('Die Datei, die du geschickt hast, ist leer.','The file that you sent is empty.')}
 ${D('Das ist der Bericht, den ich gestern geschrieben habe.','This is the report that I wrote yesterday.')}
 <p>Two things decide the word. The <b>gender</b> comes from the noun before. The <b>case</b> comes from the job inside the Relativsatz.</p>
 ${tbl(['','der','die','das','Plural'],[
  ['Nominativ (subject)','der','die','das','die'],
  ['Akkusativ (object)','<b>den</b>','die','das','die'],
  ['Dativ','<b>dem</b>','<b>der</b>','<b>dem</b>','<b>denen</b>']])}
 ${D('Das ist die Kollegin, der ich geholfen habe.','This is the colleague whom I helped. (helfen + Dativ)')}
 ${D('Die Kunden, denen wir geschrieben haben, antworten nicht.','The customers to whom we wrote do not answer.')}
 <h4>With a preposition</h4>
 <p>The preposition goes in front of the relative word.</p>
 ${D('Das ist das Projekt, an dem ich arbeite.','This is the project that I am working on.')}
 ${D('Die Firma, für die ich arbeite, ist in Osnabrück.','The company that I work for is in Osnabrück.')}
 ${D('Der Kollege, mit dem ich gesprochen habe, heißt Jan.','The colleague I spoke with is called Jan.')}
 <h4>wo and was</h4>
 ${D('Die Stadt, wo ich wohne, ist nicht groß.','The city where I live is not big.')}
 ${D('Das ist alles, was ich weiß.','That is all that I know. (after alles, etwas, nichts, das)')}
 <p>In English you can leave out "that". In German you <b>never</b> can, and there is always a comma.</p>`,
 key:['Gender from the noun, case from the job in the Relativsatz.','Dativ: dem, der, dem, denen.','Preposition + relative word: an dem, für die, mit dem.'],
 do:['Describe three things on your desk with a Relativsatz.','Describe three colleagues: "Das ist die Kollegin, mit der ..."'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'mcq',q:'Das ist die Kollegin, ___ aus Hamburg kommt.',o:['der','die','das'],a:1,w:'die Kollegin, subject → die.'},
 {t:'mcq',q:'Das ist der Bericht, ___ ich gestern geschrieben habe.',o:['der','den','dem'],a:1,w:'der Bericht, object (Akkusativ) → den.'},
 {t:'mcq',q:'Das ist das Problem, ___ wir lösen müssen.',o:['das','den','die'],a:0,w:'das Problem → das.'},
 {t:'mcq',q:'Das ist der Kollege, mit ___ ich zusammenarbeite.',o:['den','dem','der'],a:1,w:'mit + Dativ, der Kollege → dem.'},
 {t:'mcq',q:'Das ist die Firma, für ___ ich arbeite.',o:['die','der','das'],a:0,w:'für + Akkusativ, die Firma → die.'},
 {t:'mcq',q:'Die Kollegen, ___ ich geholfen habe, sind neu.',o:['die','den','denen'],a:2,w:'helfen + Dativ, plural → denen.'},
 {t:'fill',q:'Das ist alles, ___ ich weiß.',a:['was'],w:'After alles, etwas, nichts: was.'}]},

{id:'D19',min:20,t:'Indirekte Fragen: ob, wann, wie',sum:'The polite way to ask',
 body:`<p>A direct question can sound hard. With an introduction it becomes polite. The question turns into a Nebensatz, so the <b>verb goes to the end</b>.</p>
 ${tbl(['Direct','Indirect'],[
  [de('Wann beginnt die Besprechung?'),de('Können Sie mir sagen, <b>wann</b> die Besprechung <b>beginnt</b>?')],
  [de('Wo ist der Raum?'),de('Wissen Sie, <b>wo</b> der Raum <b>ist</b>?')],
  [de('Kommt Herr Schmidt heute?'),de('Ich möchte wissen, <b>ob</b> Herr Schmidt heute <b>kommt</b>.')]])}
 <p>A question with a question word keeps the word. A yes/no question gets <b>ob</b> (whether, if).</p>
 <h4>Introductions</h4>
 ${D('Können Sie mir sagen, ...','Can you tell me ...')}${D('Wissen Sie, ...','Do you know ...')}${D('Ich möchte wissen, ...','I would like to know ...')}${D('Ich bin nicht sicher, ob ...','I am not sure whether ...')}${D('Könnten Sie mir erklären, wie ...','Could you explain to me how ...')}${D('Ich wollte fragen, ob ...','I wanted to ask whether ...')}
 ${trap(de('ob')+' and '+de('wenn')+' are both "if" in English. If you can say "whether", use '+de('ob')+'. '+de('Ich weiß nicht, <b>ob</b> er kommt.')+' but '+de('<b>Wenn</b> er kommt, fangen wir an.'))}`,
 key:['Indirect question = Nebensatz. Verb at the end.','Yes/no question → ob.'],
 do:['Turn five questions you asked at work today into indirect questions.'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'order',q:'Build: "Can you tell me when the train leaves?"',items:['Können Sie mir sagen,','wann','der Zug','abfährt?'],w:'The separable verb comes together at the end: abfährt.'},
 {t:'fill',q:'Ich weiß nicht, ___ er heute kommt. (whether)',a:['ob'],w:'Yes/no question → ob.'},
 {t:'mcq',q:'Wissen Sie, wo ___ ?',o:['ist der Bahnhof','der Bahnhof ist','der ist Bahnhof'],a:1,w:'Verb at the end.'},
 {t:'mcq',q:'___ es morgen regnet, bleiben wir zu Hause.',o:['Ob','Wenn','Wann'],a:1,w:'A condition, not "whether" → wenn.'}]},

{id:'D8',min:20,t:'zu, um ... zu, damit',sum:'Saying why you do something',
 body:`<h4>Infinitive with zu</h4>
 <p>After many verbs and expressions the second verb comes at the end with <b>zu</b>.</p>
 ${D('Ich versuche, pünktlich zu kommen.','I try to come on time.')}
 ${D('Ich habe vergessen, die E-Mail zu schicken.','I forgot to send the e-mail.')}
 ${D('Ich habe keine Zeit, das heute zu machen.','I have no time to do that today.')}
 ${D('Es ist wichtig, die Daten zu prüfen.','It is important to check the data.')}
 ${D('Ich habe vor, im Mai die Prüfung zu machen.','I plan to take the exam in May.')}
 <p>With a separable verb, zu goes in the middle: ${D('Ich habe vergessen, dich anzurufen.','I forgot to call you.')}</p>
 <p><b>No zu</b> after modal verbs, and after gehen, bleiben, lassen, sehen, hören: ${D('Ich muss arbeiten. Ich gehe einkaufen.','I have to work. I am going shopping.')}</p>
 <h4>um ... zu and damit: the goal</h4>
 <p><b>um ... zu</b> gives a goal when the person is the same:</p>
 ${D('Ich lerne Deutsch, um einen besseren Job zu finden.','I learn German to find a better job.')}
 <p><b>damit</b> gives a goal when the person is different:</p>
 ${D('Ich schreibe es auf, damit du es nicht vergisst.','I am writing it down so that you do not forget it.')}
 <h4>ohne ... zu and statt ... zu</h4>
 ${D('Er ist gegangen, ohne etwas zu sagen.','He left without saying anything.')}
 ${D('Statt zu warten, habe ich angerufen.','Instead of waiting, I called.')}`,
 key:['um ... zu: same person. damit: different person.','Separable verb: an-zu-rufen.','No zu after modal verbs.'],
 do:['Finish this sentence in three ways: "Ich lerne Fabric, um ..."','Write three sentences with "Ich habe vor, ... zu ..." about your next six months.'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'fill',q:'Ich habe vergessen, die E-Mail ___ schicken.',a:['zu'],w:'vergessen + zu + infinitive.'},
 {t:'mcq',q:'Ich lerne Fabric, ___ die Prüfung zu bestehen.',o:['um','damit','weil'],a:0,w:'Same person, goal → um ... zu.'},
 {t:'mcq',q:'Ich erkläre es langsam, ___ alle es verstehen.',o:['um','damit','dass'],a:1,w:'Different person (alle) → damit.'},
 {t:'fill',q:'Ich habe vergessen, dich ___ . (anrufen)',a:['anzurufen'],w:'zu goes between prefix and verb.'},
 {t:'mcq',q:'Which is correct?',o:['Ich muss heute zu arbeiten.','Ich muss heute arbeiten.','Ich muss heute arbeiten zu.'],a:1,w:'No zu after a modal verb.'}]}
]};
})();
