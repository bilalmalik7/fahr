// Deutsch line, part 0: A2 revision (vocabulary and grammar) before the B1 stations.
(function(){
const {D,W,tbl,tip,trap,warn,L}=window.H;
const de=s=>'<span lang="de">'+s+'</span>';

DECKS.a2nomen={name:'A2 Nomen',cards:[
['die Arbeit','work','Ich gehe um acht Uhr zur Arbeit.'],['der Beruf','profession','Was sind Sie von Beruf?'],['die Firma','company','Die Firma hat 200 Mitarbeiter.'],['der Kollege / die Kollegin','colleague','Mein Kollege hilft mir.'],
['die Wohnung','flat','Die Wohnung hat drei Zimmer.'],['das Zimmer','room','Mein Zimmer ist klein.'],['die Küche','kitchen','Wir essen in der Küche.'],['der Schlüssel','key','Wo ist mein Schlüssel?'],
['die Familie','family','Meine Familie wohnt weit weg.'],['die Eltern','parents','Meine Eltern besuchen mich im Sommer.'],['das Kind','child','Das Kind spielt im Garten.'],['der Freund / die Freundin','friend','Am Samstag treffe ich einen Freund.'],
['das Frühstück','breakfast','Zum Frühstück trinke ich Tee.'],['das Mittagessen','lunch','Das Mittagessen ist um zwölf.'],['das Abendessen','dinner','Was gibt es zum Abendessen?'],['das Gemüse','vegetables','Ich esse viel Gemüse.'],
['der Zug','train','Der Zug kommt in fünf Minuten.'],['das Auto','car','Ich fahre mit dem Auto.'],['die Straße','street','In welcher Straße wohnen Sie?'],['der Supermarkt','supermarket','Der Supermarkt schließt um 20 Uhr.'],
['die Stunde','hour','Der Kurs dauert eine Stunde.'],['die Woche','week','Nächste Woche habe ich Urlaub.'],['das Wochenende','weekend','Was machst du am Wochenende?'],['der Geburtstag','birthday','Wann hast du Geburtstag?'],
['das Geld','money','Ich habe kein Geld dabei.'],['die Sprache','language','Deutsch ist eine schwere Sprache.'],['das Wort','word','Ich kenne das Wort nicht.'],['die Frage','question','Ich habe eine Frage.'],
['die Antwort','answer','Danke für die schnelle Antwort.'],['das Problem','problem','Das ist kein Problem.'],['die Idee','idea','Das ist eine gute Idee.'],['der Fehler','mistake','Ich habe einen Fehler gemacht.']]};
DECKS.a2verben={name:'A2 Verben',cards:[
['arbeiten','to work','Ich arbeite bei einer Softwarefirma.'],['wohnen','to live (reside)','Ich wohne in Osnabrück.'],['kommen','to come','Woher kommen Sie?'],['gehen','to go','Ich gehe jetzt nach Hause.'],
['fahren','to drive, go','Wir fahren morgen nach Berlin.'],['kaufen','to buy','Ich kaufe Brot und Milch.'],['bezahlen','to pay','Kann ich mit Karte bezahlen?'],['brauchen','to need','Ich brauche Hilfe.'],
['suchen','to look for','Ich suche eine Wohnung.'],['finden','to find','Ich finde meinen Schlüssel nicht.'],['fragen','to ask','Darf ich Sie etwas fragen?'],['antworten','to answer','Er antwortet nicht.'],
['verstehen','to understand','Ich verstehe das nicht.'],['sprechen','to speak','Sprechen Sie Englisch?'],['lernen','to learn','Ich lerne seit einem Jahr Deutsch.'],['helfen','to help','Können Sie mir helfen?'],
['warten','to wait','Bitte warten Sie einen Moment.'],['beginnen','to begin','Der Kurs beginnt um neun.'],['aufstehen','to get up','Ich stehe um sechs Uhr auf.'],['einkaufen','to go shopping','Ich kaufe am Samstag ein.'],
['anrufen','to call','Ich rufe dich später an.'],['besuchen','to visit','Ich besuche meine Freunde.'],['bleiben','to stay','Ich bleibe heute zu Hause.'],['vergessen','to forget','Ich habe den Termin vergessen.'],
['erklären','to explain','Können Sie das erklären?'],['öffnen','to open','Wann öffnet die Bank?'],['schließen','to close','Das Geschäft schließt um acht.'],['mitbringen','to bring along','Soll ich etwas mitbringen?'],
['zeigen','to show','Ich zeige dir die Stadt.'],['schicken','to send','Ich schicke dir die Adresse.'],['bekommen','to get, receive','Ich habe einen Brief bekommen.'],['versuchen','to try','Ich versuche es noch einmal.']]};
DECKS.a2adj={name:'A2 Adjektive und mehr',cards:[
['wichtig','important','Das ist sehr wichtig.'],['schwierig','difficult','Die Aufgabe ist schwierig.'],['einfach','easy, simple','Das ist ganz einfach.'],['möglich','possible','Ist das möglich?'],
['fertig','finished, ready','Ich bin gleich fertig.'],['pünktlich','on time','Bitte seien Sie pünktlich.'],['müde','tired','Ich bin heute sehr müde.'],['krank','ill','Mein Kollege ist krank.'],
['teuer','expensive','Die Miete ist teuer.'],['billig','cheap','Das Ticket war billig.'],['früh','early','Ich stehe früh auf.'],['spät','late','Es ist schon spät.'],
['schnell','fast','Der Zug ist schnell.'],['langsam','slow','Bitte sprechen Sie langsam.'],['richtig','right, correct','Ist das richtig?'],['falsch','wrong','Die Nummer ist falsch.'],
['immer','always','Er kommt immer zu spät.'],['oft','often','Ich koche oft.'],['manchmal','sometimes','Manchmal arbeite ich zu Hause.'],['selten','rarely','Ich fahre selten Auto.'],
['nie','never','Ich trinke nie Kaffee.'],['schon','already','Ich bin schon fertig.'],['noch','still','Ich arbeite noch.'],['vielleicht','maybe','Vielleicht komme ich später.'],
['zusammen','together','Wir essen zusammen.'],['allein','alone','Ich wohne allein.'],['natürlich','of course','Natürlich helfe ich dir.'],['gern','gladly','Ich koche gern.'],
['wirklich','really','Das ist wirklich gut.'],['genug','enough','Ich habe genug Zeit.'],['ungefähr','about, roughly','Das dauert ungefähr eine Stunde.'],['sicher','sure, safe','Bist du sicher?']]};

const N=[
{id:'D26',sec:'A2 wiederholen',min:20,t:'A2-Check: wo stehst du?',sum:'Fifteen questions that show what to revise first',
 body:`<p>Before B1, your A2 must be solid. This check shows where the holes are. Answer without looking anything up. Each question names the station that explains it.</p>
 <p>How to read your result: every question you get wrong at the first try points to a station. Do those stations first. If you get 13 or more right at the first try, go through the revision stations quickly and spend your time on the B1 grammar.</p>
 <h4>How to use the German line</h4>
 <ol><li><b>Every day, 5 minutes:</b> the flashcards that are due. The page keeps track for you.</li>
 <li><b>Three times a week, 25 minutes:</b> one grammar station with its exercises.</li>
 <li><b>Every day, 10 minutes:</b> listen to German, and say sentences out loud.</li>
 <li><b>Once a week:</b> write a short text with the writing coach, and speak with a real person.</li></ol>`,
 key:['Wrong answers show which station to do first.','Five minutes of flashcards every day.'],
 do:['Write down the numbers of the questions you missed, and do those stations this week.'],links:[],
 ex:[
 {t:'mcq',q:'1. Ich ___ in Osnabrück. (Präsens)',o:['wohne','wohnst','wohnen'],a:0,w:'ich wohne. Station: Präsens und Artikel.'},
 {t:'mcq',q:'2. ___ du heute Zeit?',o:['Hat','Hast','Habt'],a:1,w:'du hast. Station: Präsens und Artikel.'},
 {t:'mcq',q:'3. Das ist ___ Bruder. (my)',o:['mein','meine','meinen'],a:0,w:'der Bruder → mein Bruder. Station: Präsens und Artikel.'},
 {t:'mcq',q:'4. Ich habe ___ Auto.',o:['nicht','kein','keine'],a:1,w:'das Auto → kein Auto. Station: Satzbau.'},
 {t:'mcq',q:'5. Morgen ___ ich nach Berlin.',o:['fahre','ich fahre','fahren'],a:0,w:'Verb in position 2: Morgen fahre ich. Station: Satzbau.'},
 {t:'mcq',q:'6. Ich sehe ___ Mann. (der Mann)',o:['der','den','dem'],a:1,w:'sehen + Akkusativ. Station: Die vier Fälle.'},
 {t:'mcq',q:'7. Ich fahre mit ___ Bus. (der Bus)',o:['den','dem','der'],a:1,w:'mit + Dativ. Station: Präpositionen.'},
 {t:'mcq',q:'8. Ich ___ gestern einen Film gesehen.',o:['bin','habe','war'],a:1,w:'sehen uses haben. Station: Perfekt.'},
 {t:'mcq',q:'9. Wir ___ gestern nach Köln gefahren.',o:['haben','sind','waren'],a:1,w:'fahren is movement: sein. Station: Perfekt.'},
 {t:'mcq',q:'10. Ich ___ morgen arbeiten. (must)',o:['muss','musst','müssen'],a:0,w:'ich muss. Station: Modalverben.'},
 {t:'mcq',q:'11. Der Kurs beginnt ___ neun Uhr.',o:['am','um','im'],a:1,w:'Clock time: um. Station: Präpositionen.'},
 {t:'mcq',q:'12. Ich stehe jeden Tag um sechs Uhr ___ .',o:['auf','an','aus'],a:0,w:'aufstehen is separable. Station: Modalverben, trennbare Verben.'},
 {t:'mcq',q:'13. Ich lerne Deutsch, ___ ich in Deutschland arbeite.',o:['weil','denn','deshalb'],a:0,w:'Verb at the end → weil. Station: Nebensätze.'},
 {t:'mcq',q:'14. Das ist ___ als gestern. (gut)',o:['guter','besser','mehr gut'],a:1,w:'gut, besser, am besten. Station: Komparativ.'},
 {t:'mcq',q:'15. ___ Sie mir bitte helfen?',o:['Können','Kannst','Kann'],a:0,w:'Sie können. Polite: Könnten Sie. Station: Konjunktiv II.'}]},

{id:'D27',min:35,t:'Präsens, sein und haben, Artikel, Plural',sum:'The base that everything else stands on',
 body:`<h4>Präsens: regular verbs</h4>
 ${tbl(['','machen','arbeiten','Ending'],[['ich','mache','arbeite','-e'],['du','machst','arbeitest','-st'],['er / sie / es','macht','arbeitet','-t'],['wir','machen','arbeiten','-en'],['ihr','macht','arbeitet','-t'],['sie / Sie','machen','arbeiten','-en']])}
 <h4>Verbs that change their vowel (only with du and er)</h4>
 ${tbl(['Verb','du','er / sie / es'],[['fahren','fährst','fährt'],['schlafen','schläfst','schläft'],['sehen','siehst','sieht'],['lesen','liest','liest'],['sprechen','sprichst','spricht'],['nehmen','nimmst','nimmt'],['geben','gibst','gibt'],['essen','isst','isst'],['helfen','hilfst','hilft'],['treffen','triffst','trifft'],['wissen','weißt','weiß (ich weiß)']])}
 <h4>sein, haben, werden</h4>
 ${tbl(['','sein','haben','werden'],[['ich','bin','habe','werde'],['du','bist','hast','wirst'],['er / sie / es','ist','hat','wird'],['wir','sind','haben','werden'],['ihr','seid','habt','werdet'],['sie / Sie','sind','haben','werden']])}
 <h4>Artikel</h4>
 ${tbl(['','der (m)','die (f)','das (n)','Plural'],[['the','der Tisch','die Lampe','das Buch','die Bücher'],['a / an','ein Tisch','eine Lampe','ein Buch','– Bücher'],['no / not a','kein Tisch','keine Lampe','kein Buch','keine Bücher'],['my','mein Tisch','meine Lampe','mein Buch','meine Bücher']])}
 <p>The possessive words take the same endings as <b>ein</b>: mein, dein, sein (his / its), ihr (her / their), unser, euer, Ihr (your, formal).</p>
 ${D('Das ist mein Kollege, und das ist seine Frau.','This is my colleague, and this is his wife.')}${D('Ist das Ihr Auto?','Is this your car?')}${D('Unsere Kinder gehen in die Schule.','Our children go to school.')}
 <h4>Plural: the common patterns</h4>
 ${tbl(['Pattern','Examples'],[
  ['-e (many masculine)','der Tag → die Tag<b>e</b>, der Tisch → die Tische'],
  ['-e with Umlaut','der Zug → die Z<b>ü</b>g<b>e</b>, die Stadt → die Städte'],
  ['-en / -n (most feminine)','die Frage → die Frage<b>n</b>, die Wohnung → die Wohnung<b>en</b>'],
  ['-er with Umlaut (many neuter)','das Buch → die B<b>ü</b>ch<b>er</b>, das Kind → die Kinder'],
  ['no ending (-er, -el, -en words)','der Lehrer → die Lehrer, das Zimmer → die Zimmer'],
  ['-s (foreign words)','das Auto → die Auto<b>s</b>, das Büro → die Büros']])}
 <p>There is no safe rule. Learn each noun as three pieces: article, word, plural. ${de('der Zug, die Züge')}.</p>`,
 key:['Endings: -e, -st, -t, -en, -t, -en.','Vowel change only with du and er: du fährst, er fährt.','mein, dein, sein, ihr take the endings of ein.'],
 do:['Say the six forms of sein, haben, fahren, sprechen and nehmen out loud, without looking.','Do the A2 flashcard decks every day until every card is in box 3 or higher.'],links:[['DW Nicos Weg A1 to A2',L.dw]],
 ex:[
 {t:'fill',q:'Er ___ jeden Tag mit dem Bus. (fahren)',a:['fährt','faehrt'],w:'a → ä with er.'},
 {t:'fill',q:'___ du Englisch? (sprechen)',a:['sprichst'],w:'e → i with du.'},
 {t:'fill',q:'Wir ___ aus Osnabrück. (sein)',a:['sind'],w:'wir sind.'},
 {t:'fill',q:'Ihr ___ heute keine Zeit. (haben)',a:['habt'],w:'ihr habt.'},
 {t:'mcq',q:'Das ist Anna, und das ist ___ Mann. (her)',o:['sein','ihr','ihre'],a:1,w:'her = ihr. der Mann → ihr Mann.'},
 {t:'mcq',q:'Plural: das Buch → die ___',o:['Buche','Bücher','Buchs'],a:1,w:'-er with Umlaut.'},
 {t:'mcq',q:'Plural: die Wohnung → die ___',o:['Wohnunge','Wohnungen','Wohnungs'],a:1,w:'-ung words take -en.'},
 {t:'fill',q:'Was ___ du gern? (essen)',a:['isst'],w:'du isst, er isst.'},
 {t:'mcq',q:'Ich ___ das nicht. (wissen)',o:['weiß','wisse','weißt'],a:0,w:'ich weiß, du weißt, er weiß.'}]},

{id:'D28',min:30,t:'Zahlen, Uhrzeit, Datum, Fragen, Imperativ',sum:'Small things you need every day',
 body:`<h4>Zahlen</h4>
 <p>From 21 on, German says the ones first: ${de('ein<b>und</b>zwanzig')} (one-and-twenty). So 47 is ${de('siebenundvierzig')}. When you hear a number, write the second digit first.</p>
 ${D('fünfundachtzig Prozent','85 per cent')}${D('zweitausendsechsundzwanzig','2026')}${D('eintausendzweihundert Euro','1,200 euros')}
 <p>In writing, German uses a comma for decimals and a point for thousands: 1.200,50 €.</p>
 <h4>Uhrzeit</h4>
 ${tbl(['Time','Official','Everyday'],[['9:00','neun Uhr','neun'],['9:15','neun Uhr fünfzehn','Viertel nach neun'],['9:30','neun Uhr dreißig','<b>halb zehn</b>'],['9:45','neun Uhr fünfundvierzig','Viertel vor zehn'],['14:00','vierzehn Uhr','zwei (Uhr nachmittags)']])}
 ${trap(de('halb zehn')+' is 9:30, not 10:30. It means "half way to ten". This costs people appointments.')}
 <h4>Datum</h4>
 ${D('Heute ist der zwölfte November.','Today is the 12th of November.')}${D('Ich habe am dritten Mai Geburtstag.','My birthday is on the 3rd of May.')}${D('Der Termin ist am 12.11. um 14 Uhr.','The appointment is on 12 Nov at 2 pm.')}
 <p>Ordinal numbers: up to 19 add <b>-te</b> (der zweite, der vierte; special: der <b>erste</b>, der <b>dritte</b>, der <b>siebte</b>), from 20 on add <b>-ste</b> (der zwanzigste).</p>
 <h4>W-Fragen</h4>
 ${tbl(['Word','Meaning','Example'],[['wer','who',de('Wer ist das?')],['was','what',de('Was machen Sie beruflich?')],['wo','where',de('Wo wohnen Sie?')],['wohin','where to',de('Wohin fahren Sie?')],['woher','where from',de('Woher kommen Sie?')],['wann','when',de('Wann beginnt der Kurs?')],['warum','why',de('Warum lernst du Deutsch?')],['wie','how',de('Wie heißen Sie?')],['wie lange','how long',de('Wie lange dauert das?')],['wie viel / wie viele','how much / many',de('Wie viel kostet das?')],['welcher / welche / welches','which',de('Welchen Bus nehme ich?')]])}
 <h4>Imperativ: asking somebody to do something</h4>
 ${tbl(['To','Form','Example'],[['Sie (formal)','verb + Sie',de('Kommen Sie bitte herein. Warten Sie bitte.')],['du','verb stem, no ending',de('Komm bitte! Warte mal! Ruf mich an!')],['ihr','verb + t',de('Kommt bitte! Wartet!')]])}
 <p>Vowel change e → i stays: ${de('Nimm! Gib! Hilf! Lies! Sprich!')} Special: ${de('Sei ruhig! Seien Sie pünktlich!')} Add <b>bitte</b> and it is polite enough for daily life.</p>`,
 key:['47 = siebenundvierzig. Ones first.','halb zehn = 9:30.','Imperativ: Kommen Sie! Komm! Kommt!'],
 do:['Say your phone number, your date of birth and today\'s date out loud.','Read five times from your phone clock in the everyday form.'],links:[['DW Nicos Weg',L.dw]],
 ex:[
 {t:'mcq',q:'"halb acht" is:',o:['7:30','8:30','8:00'],a:0,w:'Half way to eight.'},
 {t:'mcq',q:'"dreiundsechzig" is:',o:['36','63','603'],a:1,w:'three-and-sixty.'},
 {t:'fill',q:'___ kommen Sie? – Aus Spanien.',a:['woher'],w:'woher = where from.'},
 {t:'fill',q:'___ fahren Sie? – Nach Hamburg.',a:['wohin'],w:'wohin = where to.'},
 {t:'mcq',q:'Formal request: "Please wait a moment."',o:['Warte einen Moment.','Warten Sie bitte einen Moment.','Wartet Moment.'],a:1,w:'Verb + Sie + bitte.'},
 {t:'mcq',q:'To a friend: "Help me, please!"',o:['Helf mir bitte!','Hilf mir bitte!','Helfen mir bitte!'],a:1,w:'e → i: hilf.'},
 {t:'mcq',q:'"Viertel vor drei" is:',o:['2:45','3:15','3:45'],a:0,w:'A quarter before three.'},
 {t:'mcq',q:'Heute ist der ___ Mai. (3.)',o:['dreite','dritte','dreiste'],a:1,w:'der erste, zweite, dritte.'}]}
];
const T=TRACKS.deutsch;
delete T.stations[0].sec;                       // "Fundament" moves to the first B1 foundation station again below
T.stations[0].sec='Fundament festigen';
T.stations.unshift(...N);
T.name='Deutsch: A2 festigen, dann B1';
T.goal='Make A2 solid, then pass the B1 exam';
T.intro='First you revise A2: the words and the grammar you already met, until they are automatic. Then you add the B1 grammar, one idea per station, and train for the exam. Every German sentence has a listen button. Do a little every day.';
})();
