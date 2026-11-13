// Deutsch line, part 2: B1 grammar, daily life, work, exam skills.
(function(){
const {D,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;
const de=s=>'<span lang="de">'+s+'</span>';
const lese=s=>'<div class="lesetext" lang="de">'+s+'</div>';

WD.dialog.arzt={title:'Beim Arzt',who:['Praxis','Sie'],lines:[
 [0,'Praxis Dr. Meyer, guten Tag.','Dr. Meyer\'s practice, good day.'],
 [1,'Guten Tag, hier ist Bilal Tori. Ich hätte gern einen Termin.','Good day, this is Bilal Tori. I would like an appointment.'],
 [0,'Was fehlt Ihnen denn?','What is the matter?'],
 [1,'Ich habe seit drei Tagen starke Halsschmerzen und Fieber.','I have had a bad sore throat and a fever for three days.'],
 [0,'Können Sie heute um 11 Uhr 30 kommen?','Can you come today at 11:30?'],
 [1,'Ja, das passt. Muss ich etwas mitbringen?','Yes, that suits me. Do I have to bring anything?'],
 [0,'Bitte bringen Sie Ihre Versichertenkarte mit.','Please bring your health insurance card.'],
 [1,'Ich brauche auch eine Krankschreibung für meinen Arbeitgeber.','I also need a sick note for my employer.'],
 [0,'Das besprechen Sie bitte mit dem Arzt. Bis später!','Please discuss that with the doctor. See you later!']]};
WD.dialog.amt={title:'Im Bürgeramt',who:['Mitarbeiterin','Sie'],lines:[
 [0,'Guten Tag. Was kann ich für Sie tun?','Good day. What can I do for you?'],
 [1,'Guten Tag. Ich bin umgezogen und möchte mich ummelden.','Good day. I have moved and would like to register my new address.'],
 [0,'Haben Sie einen Termin?','Do you have an appointment?'],
 [1,'Ja, um zehn Uhr. Hier ist meine Terminbestätigung.','Yes, at ten. Here is my confirmation.'],
 [0,'Ich brauche Ihren Ausweis und die Wohnungsgeberbestätigung.','I need your ID and the landlord\'s confirmation.'],
 [1,'Hier, bitte. Brauchen Sie auch den Mietvertrag?','Here you are. Do you also need the rental contract?'],
 [0,'Nein, das ist nicht nötig. Bitte füllen Sie dieses Formular aus und unterschreiben Sie hier.','No, that is not necessary. Please fill in this form and sign here.'],
 [1,'Wie lange dauert es, bis ich die Meldebescheinigung bekomme?','How long does it take until I get the registration certificate?'],
 [0,'Die bekommen Sie sofort. Einen Moment, bitte.','You get it right away. One moment, please.']]};
WD.dialog.wohnung={title:'Anruf wegen einer Wohnung',who:['Vermieter','Sie'],lines:[
 [0,'Schneider.','Schneider.'],
 [1,'Guten Tag, Herr Schneider. Ich rufe wegen der Wohnung in der Lotter Straße an. Ist sie noch frei?','Good day, Mr Schneider. I am calling about the flat in Lotter Straße. Is it still available?'],
 [0,'Ja, die ist noch frei.','Yes, it is still available.'],
 [1,'Wie hoch ist die Miete, und sind die Nebenkosten schon dabei?','How high is the rent, and are the additional costs included?'],
 [0,'Die Kaltmiete beträgt 620 Euro, dazu kommen 180 Euro Nebenkosten.','The basic rent is 620 euros, plus 180 euros additional costs.'],
 [1,'Und wie hoch ist die Kaution?','And how high is the deposit?'],
 [0,'Zwei Monatsmieten. Was machen Sie beruflich?','Two months\' rent. What do you do for a living?'],
 [1,'Ich arbeite als BI-Entwickler und habe einen unbefristeten Vertrag.','I work as a BI developer and have a permanent contract.'],
 [0,'Gut. Sie können die Wohnung am Samstag um 14 Uhr besichtigen.','Good. You can view the flat on Saturday at 2 pm.'],
 [1,'Sehr gern. Vielen Dank, bis Samstag!','With pleasure. Thank you, see you on Saturday!']]};
WD.dialog.standup={title:'Im Team: das tägliche Stand-up',who:['Teamleiterin','Sie'],lines:[
 [0,'Guten Morgen zusammen. Bilal, fängst du an?','Good morning everyone. Bilal, will you start?'],
 [1,'Gern. Gestern habe ich die neue Ladestrecke für die Brütereidaten fertiggestellt.','Sure. Yesterday I finished the new load process for the hatchery data.'],
 [0,'Gab es Probleme?','Were there any problems?'],
 [1,'Ja, die Daten vom Kunden hatten doppelte Zeilen. Ich habe das im Code abgefangen.','Yes, the customer\'s data had duplicate rows. I handled that in the code.'],
 [0,'Und was steht heute an?','And what is on for today?'],
 [1,'Heute teste ich die Auswertung und schreibe die Dokumentation.','Today I am testing the report and writing the documentation.'],
 [0,'Brauchst du Unterstützung?','Do you need support?'],
 [1,'Ich bräuchte noch den Zugang zur Testdatenbank. Könntest du das freigeben?','I would still need access to the test database. Could you approve that?'],
 [0,'Klar, das mache ich gleich nach dem Meeting.','Sure, I will do that right after the meeting.']]};

WD.hoer={
 bahn:'Achtung an Gleis drei. Der Intercity nach Hamburg, planmäßige Abfahrt 14 Uhr 12, hat heute circa 25 Minuten Verspätung. Grund dafür ist eine Störung an der Strecke. Reisende nach Bremen können den Regionalexpress um 14 Uhr 20 von Gleis fünf nehmen. Wir bitten um Entschuldigung.',
 ab:'Guten Tag, Herr Tori, hier ist Sabine Becker von der Firma Nordhof. Ich rufe an wegen unseres Termins am Donnerstag. Leider muss ich den Termin verschieben, weil ich am Donnerstag auf einer Messe bin. Passt Ihnen auch Freitag um zehn Uhr? Bitte rufen Sie mich zurück. Meine Nummer ist null fünf vier eins, sieben sieben drei, vier zwei null. Vielen Dank und auf Wiederhören.',
 radio:'Und nun das Wetter für Niedersachsen. Heute bleibt es den ganzen Tag bewölkt, am Nachmittag regnet es im Norden. Die Temperaturen liegen zwischen acht und elf Grad. Morgen wird es freundlicher: Am Vormittag scheint die Sonne, erst am Abend ziehen wieder Wolken auf. Am Wochenende wird es deutlich kälter, in der Nacht gibt es Frost.'};
WD.diktat=['Ich habe morgen einen Termin beim Arzt.','Können Sie mir bitte sagen, wo der Bahnhof ist?','Die Besprechung wurde auf Freitag verschoben.','Ich arbeite seit zwei Jahren als Entwickler.','Wenn ich Zeit habe, rufe ich Sie zurück.','Der Bericht muss bis morgen fertig sein.','Ich interessiere mich für die Stelle in Ihrer Firma.','Könnten Sie das bitte noch einmal wiederholen?','Wir haben den Fehler gestern gefunden und behoben.','Ich würde gern am Montag Urlaub nehmen.'];

TRACKS.deutsch.stations.push(

/* ───────────── B1-Grammatik ───────────── */
{id:'D4',sec:'B1-Grammatik',min:30,t:'Konjunktiv II',sum:'Polite, and "what if"',
 body:`<p>Use it to be <b>polite</b>. This is very important at work in Germany.</p>
 ${D('Könnten Sie mir bitte helfen?','Could you help me, please?')}${D('Ich hätte eine Frage.','I have a question. (polite)')}${D('Ich würde gern einen Termin machen.','I would like to make an appointment.')}${D('Wäre es möglich, den Termin zu verschieben?','Would it be possible to move the appointment?')}
 <p>Use it for things that are <b>not real</b>:</p>
 ${D('Wenn ich mehr Zeit hätte, würde ich mehr lesen.','If I had more time, I would read more.')}${D('Wenn ich du wäre, würde ich das Angebot annehmen.','If I were you, I would accept the offer.')}
 <p>Use it for <b>advice</b> and <b>wishes</b>:</p>
 ${D('Du solltest zum Arzt gehen.','You should go to the doctor.')}${D('An deiner Stelle würde ich früher anfangen.','In your place I would start earlier.')}${D('Ich wünschte, ich könnte besser Deutsch.','I wish I spoke better German.')}
 <p>Easy rule: <b>würde + infinitive</b> works for most verbs. Learn these special forms by heart:</p>
 ${tbl(['Verb','Konjunktiv II','Meaning'],[['sein','wäre','would be'],['haben','hätte','would have'],['können','könnte','could'],['müssen','müsste','would have to'],['sollen','sollte','should'],['dürfen','dürfte','would be allowed'],['werden','würde','would'],['wissen','wüsste','would know']])}
 <h4>About the past: what did not happen</h4>
 <p><b>hätte</b> or <b>wäre</b> + Partizip II.</p>
 ${D('Wenn ich das gewusst hätte, wäre ich früher gekommen.','If I had known that, I would have come earlier.')}${D('Ich hätte dich anrufen sollen.','I should have called you.')}`,
 key:['Polite: Könnten Sie ...? Ich hätte gern ... Ich würde gern ...','würde + infinitive for most verbs. wäre, hätte, könnte by heart.','Past: hätte / wäre + Partizip.'],
 do:['Rewrite three direct requests in a polite form. Example: "Schick mir die Datei." → "Könntest du mir bitte die Datei schicken?"','Finish: "Wenn ich im Lotto gewinnen würde, ..."'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'fill',q:'___ Sie mir bitte die Datei schicken? (could)',a:['könnten','koennten','würden','wuerden'],w:'Könnten Sie ...? is the standard polite request.'},
 {t:'fill',q:'Wenn ich reich ___, würde ich weniger arbeiten.',a:['wäre','waere'],w:'sein → wäre.'},
 {t:'fill',q:'Ich ___ gern einen Termin. (polite: I would like to have)',a:['hätte','haette'],w:'haben → hätte.'},
 {t:'mcq',q:'Advice: "You should sleep more."',o:['Du sollst mehr schlafen.','Du solltest mehr schlafen.','Du musst mehr schlafen.'],a:1,w:'solltest is friendly advice. sollst repeats an order from someone else.'},
 {t:'order',q:'Build: "If I had time, I would help you."',items:['Wenn','ich','Zeit','hätte,','würde','ich','dir','helfen.'],w:'Nebensatz with hätte at the end, then würde directly after the comma.'},
 {t:'mcq',q:'"If I had known that ..." →',o:['Wenn ich das wusste ...','Wenn ich das gewusst hätte ...','Wenn ich das wissen würde ...'],a:1,w:'Unreal past: hätte + Partizip.'}]},

{id:'D5',min:25,t:'Passiv',sum:'The data is loaded every night',
 body:`<p>Use the Passiv when the action is more important than the person. IT people, authorities and newspapers use it all the time.</p>
 <p>Form: <b>werden</b> + Partizip II at the end.</p>
 ${tbl(['Time','Form','Example'],[
  ['Now','wird / werden + Partizip',de('Die Daten <b>werden</b> jede Nacht <b>geladen</b>.')],
  ['Past (written and spoken)','wurde / wurden + Partizip',de('Der Fehler <b>wurde</b> gestern <b>behoben</b>.')],
  ['Perfekt','ist / sind + Partizip + worden',de('Der Server <b>ist</b> neu <b>gestartet worden</b>.')],
  ['With modal verb','modal + Partizip + werden',de('Der Bericht <b>muss</b> bis Freitag <b>geschickt werden</b>.')]])}
 ${D('Die Daten werden jede Nacht geladen.','The data is loaded every night.')}
 ${D('Der Fehler wurde gestern behoben.','The error was fixed yesterday.')}
 ${D('Der Bericht muss bis Freitag geschickt werden.','The report must be sent by Friday.')}
 ${D('Die Rechnung wurde vom Kunden bezahlt.','The invoice was paid by the customer. (von + Dativ = by)')}
 <h4>Action or result?</h4>
 <p><b>werden</b> + Partizip is the action. <b>sein</b> + Partizip is the result.</p>
 ${D('Das Büro wird um 18 Uhr geschlossen.','The office is (being) closed at 6 pm. (action)')}${D('Das Büro ist geschlossen.','The office is closed. (state)')}
 <h4>man: the easy way around the passive</h4>
 ${D('Man lädt die Daten jede Nacht.','One loads the data every night.')}${D('Hier darf man nicht parken.','You may not park here.')}`,
 know:'Technical documentation in German is full of Passiv: "Die Tabelle wird jede Nacht aktualisiert." Now you can read and write it.',
 key:['werden + Partizip. Past: wurde + Partizip.','With modal: muss gemacht werden.','wird geschlossen = action. ist geschlossen = state.'],
 do:['Describe your nightly data load in three Passiv sentences.','Find three Passiv sentences in a German e-mail or letter you received.'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'fill',q:'Die E-Mail ___ gerade geschrieben. (now)',a:['wird'],w:'Present: wird + Partizip II.'},
 {t:'fill',q:'Das Problem ___ gestern gelöst. (past)',a:['wurde'],w:'Past: wurde + Partizip II.'},
 {t:'order',q:'Build: "The report must be written by Friday."',items:['Der','Bericht','muss','bis','Freitag','geschrieben','werden.'],w:'Modal verb in position 2, Partizip + werden at the end.'},
 {t:'mcq',q:'"The shop is closed." (state, now)',o:['Das Geschäft wird geschlossen.','Das Geschäft ist geschlossen.','Das Geschäft wurde schließen.'],a:1,w:'State: sein + Partizip.'},
 {t:'mcq',q:'Die Tabellen ___ jede Nacht aktualisiert.',o:['wird','werden','worden'],a:1,w:'Plural: werden.'},
 {t:'fill',q:'Die Rechnung wurde ___ Kunden bezahlt. (by the)',a:['vom'],w:'von + dem = vom.'}]},

{id:'D6',min:30,t:'Adjektivendungen',sum:'A simple rule that covers most cases',
 body:`<p>Do not learn the full table first. Learn this:</p>
 <ul><li>After <b>ein / kein / mein</b> in the basic form, the adjective shows the gender: ein neu<b>er</b> Kollege, eine neu<b>e</b> Kollegin, ein neu<b>es</b> Projekt.</li><li>After <b>der / die / das</b> in the basic form: always <b>-e</b>. der neu<b>e</b> Kollege.</li><li>Plural with an article, and almost everything in Dativ and Genitiv: <b>-en</b>. die neu<b>en</b> Daten, mit dem neu<b>en</b> Kollegen.</li><li>Masculine Akkusativ: <b>-en</b>. Ich habe einen neu<b>en</b> Kollegen.</li></ul>
 ${D('Das ist ein guter Vorschlag.','That is a good suggestion.')}${D('Ich habe eine wichtige Frage.','I have an important question.')}${D('Wir arbeiten mit den neuen Daten.','We work with the new data.')}${D('Ich suche einen neuen Job.','I am looking for a new job.')}
 <h4>The full picture</h4>
 ${tbl(['','der','die','das','Plural'],[
  ['Nom.','der neu<b>e</b> / ein neu<b>er</b>','die / eine neu<b>e</b>','das neu<b>e</b> / ein neu<b>es</b>','die neu<b>en</b>'],
  ['Akk.','den / einen neu<b>en</b>','die / eine neu<b>e</b>','das neu<b>e</b> / ein neu<b>es</b>','die neu<b>en</b>'],
  ['Dat.','dem / einem neu<b>en</b>','der / einer neu<b>en</b>','dem / einem neu<b>en</b>','den neu<b>en</b>']])}
 <p>Without any article, the adjective takes the ending the article would have: ${de('gut<b>er</b> Kaffee, frisch<b>e</b> Milch, kalt<b>es</b> Wasser, mit freundlich<b>en</b> Grüßen')}.</p>
 <p>After the verb <b>sein</b> there is no ending: ${de('Der Kollege ist neu.')}</p>
 ${tip('When you speak and you are not sure, say -en. It is right in most cells of the table.')}`,
 key:['ein + adjective shows the gender: -er, -e, -es.','der/die/das + adjective: -e. Plural, Dativ, masculine Akkusativ: -en.','After sein: no ending.'],
 do:['Describe your team with five adjectives: "Ich habe einen netten Chef."'],links:[['vhs-Lernportal',L.vhs]],
 ex:[
 {t:'mcq',q:'Das ist ein ___ Vorschlag.',o:['gute','guter','guten'],a:1,w:'der Vorschlag → ein guter.'},
 {t:'mcq',q:'Ich habe eine ___ Frage.',o:['wichtige','wichtiger','wichtiges'],a:0,w:'die Frage → eine wichtige.'},
 {t:'mcq',q:'Ich spreche mit dem ___ Kollegen.',o:['neue','neuer','neuen'],a:2,w:'Dativ → -en.'},
 {t:'mcq',q:'Ich suche einen ___ Job.',o:['neue','neuen','neuer'],a:1,w:'Masculine Akkusativ → -en.'},
 {t:'mcq',q:'Das ist ein ___ Projekt.',o:['interessantes','interessanter','interessante'],a:0,w:'das Projekt → ein interessantes.'},
 {t:'mcq',q:'Die ___ Daten sind da.',o:['neue','neuen','neues'],a:1,w:'Plural with article → -en.'},
 {t:'mcq',q:'Mit ___ Grüßen',o:['freundliche','freundlichen','freundlicher'],a:1,w:'Dativ plural without article → -en.'}]},

{id:'D20',min:20,t:'Komparativ und Superlativ',sum:'Faster, better, the best',
 body:`${tbl(['Basic','Komparativ (-er)','Superlativ (am -sten)'],[
  ['schnell','schneller','am schnellsten'],['billig','billiger','am billigsten'],['alt','<b>ä</b>lter','am <b>ä</b>ltesten'],['groß','gr<b>ö</b>ßer','am gr<b>ö</b>ßten'],['lang','l<b>ä</b>nger','am l<b>ä</b>ngsten'],
  ['<b>gut</b>','<b>besser</b>','am <b>besten</b>'],['<b>viel</b>','<b>mehr</b>','am <b>meisten</b>'],['<b>gern</b>','<b>lieber</b>','am <b>liebsten</b>'],['<b>hoch</b>','<b>höher</b>','am <b>höchsten</b>'],['<b>teuer</b>','<b>teurer</b>','am teuersten']])}
 <p>German never uses "more" for long adjectives: ${de('interessant<b>er</b>')}, not "mehr interessant".</p>
 <h4>Compare</h4>
 ${D('Der Zug ist schneller als der Bus.','The train is faster than the bus. (different: als)')}
 ${D('Die neue Version ist genauso gut wie die alte.','The new version is just as good as the old one. (same: so ... wie)')}
 ${D('Ich fahre lieber mit dem Rad.','I prefer to go by bike.')}
 ${D('Am liebsten arbeite ich morgens.','I like working in the morning best.')}
 <h4>Before a noun</h4>
 <p>The compared form gets the normal adjective ending too: ${de('ein besser<b>er</b> Job, die schnellst<b>e</b> Lösung, mit dem neuer<b>en</b> Rechner')}.</p>
 ${D('Das ist die beste Lösung.','That is the best solution.')}${D('Wir brauchen einen schnelleren Server.','We need a faster server.')}`,
 key:['-er for all adjectives, never "mehr".','als for different, so ... wie for the same.','gut, besser, am besten. viel, mehr, am meisten. gern, lieber, am liebsten.'],
 do:['Compare two tools you know (for example SSIS and Fabric) in five sentences.'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'fill',q:'Der Zug ist schneller ___ der Bus.',a:['als'],w:'Different → als.'},
 {t:'fill',q:'gut → ___ → am besten',a:['besser'],w:'Irregular: gut, besser, am besten.'},
 {t:'mcq',q:'Ich trinke ___ Tee als Kaffee.',o:['gerner','lieber','mehr gern'],a:1,w:'gern, lieber, am liebsten.'},
 {t:'mcq',q:'Das Buch ist ___ als der Film.',o:['mehr interessant','interessanter','interessantest'],a:1,w:'Always -er.'},
 {t:'fill',q:'Er ist genauso alt ___ ich.',a:['wie'],w:'Same → so ... wie.'}]},

{id:'D7',min:30,t:'Verben mit Präpositionen',sum:'warten auf, sich kümmern um, and "darauf"',
 body:`<p>Many verbs need a fixed preposition. Learn them as one piece, with the case.</p>
 ${D('Ich warte auf deine Antwort.','I am waiting for your answer.')}
 ${D('Ich kümmere mich um das Problem.','I will take care of the problem.')}
 ${D('Ich nehme an der Besprechung teil.','I am taking part in the meeting.')}
 ${D('Ich interessiere mich für Datenanalyse.','I am interested in data analysis.')}
 ${D('Ich freue mich auf das Wochenende.','I am looking forward to the weekend.')}
 ${D('Das hängt von dem Kunden ab.','That depends on the customer.')}
 ${tbl(['With Akkusativ','With Dativ'],[
  ['warten <b>auf</b>','teilnehmen <b>an</b>'],['sich freuen <b>auf</b> (future) / <b>über</b> (now)','abhängen <b>von</b>'],['sich kümmern <b>um</b>','sprechen <b>mit</b> (person) / <b>über</b> + Akk. (topic)'],['sich interessieren <b>für</b>','fragen <b>nach</b>'],['denken <b>an</b>','sich beschäftigen <b>mit</b>'],['sich bewerben <b>um</b>','helfen <b>bei</b>'],['sich erinnern <b>an</b>','arbeiten <b>an</b>'],['sich ärgern <b>über</b>','träumen <b>von</b>'],['bitten <b>um</b>','gratulieren <b>zu</b>'],['sich entschuldigen <b>für</b>','sich treffen <b>mit</b>'],['antworten <b>auf</b>','gehören <b>zu</b>'],['achten <b>auf</b>','einladen <b>zu</b>']])}
 <h4>Questions and "it": wo(r)- and da(r)-</h4>
 <p>For <b>things</b>, the preposition joins with wo- (question) or da- (answer). If the preposition starts with a vowel, add an r.</p>
 ${D('Worauf wartest du? – Ich warte auf die E-Mail. Ich warte schon lange darauf.','What are you waiting for? – For the e-mail. I have been waiting for it for a long time.')}
 ${D('Wofür interessieren Sie sich? – Dafür interessiere ich mich auch.','What are you interested in? – I am interested in that too.')}
 ${D('Ich kümmere mich darum.','I will take care of it.')}
 <p>For <b>people</b>, keep the preposition and use a pronoun:</p>
 ${D('Auf wen wartest du? – Ich warte auf ihn.','Who are you waiting for? – I am waiting for him.')}`,
 key:['Learn verb + preposition + case as one piece.','Things: worauf? darauf. People: auf wen? auf ihn.','sich freuen auf = future, über = now or past.'],
 do:['Write one true sentence with each of the first six verbs.','Answer with da-: "Denkst du an den Termin?" "Interessierst du dich für KI?"'],links:[['DW Learn German',L.dw]],
 ex:[
 {t:'fill',q:'Ich warte ___ deine Antwort.',a:['auf'],w:'warten auf + Akkusativ.'},
 {t:'fill',q:'Ich kümmere mich ___ das Problem.',a:['um'],w:'sich kümmern um.'},
 {t:'fill',q:'Ich nehme ___ der Besprechung teil.',a:['an'],w:'teilnehmen an + Dativ.'},
 {t:'fill',q:'Ich interessiere mich ___ Datenanalyse.',a:['für','fuer'],w:'sich interessieren für.'},
 {t:'fill',q:'___ wartest du? (a thing)',a:['worauf'],w:'wo + r + auf.'},
 {t:'mcq',q:'Ich habe mich sehr ___ das Geschenk gefreut. (I already have it)',o:['auf','über','um'],a:1,w:'über for something that is here. auf for something in the future.'},
 {t:'fill',q:'Kümmerst du dich um die Rechnung? – Ja, ich kümmere mich ___ .',a:['darum'],w:'da + r + um.'},
 {t:'mcq',q:'Ich habe mich ___ die Stelle beworben.',o:['für','um','an'],a:1,w:'sich bewerben um.'}]},

{id:'D21',min:25,t:'Genitiv, n-Deklination, lassen',sum:'Three small topics that show up in B1 texts',
 body:`<h4>Genitiv: whose?</h4>
 ${tbl(['der / das','die / Plural'],[[de('des Kunden, des Projekt<b>s</b>, eines Kollege<b>n</b>'),de('der Firma, der Kollegen, einer Kollegin')]])}
 ${D('Das ist das Büro des Chefs.','That is the boss\'s office.')}${D('Die Qualität der Daten ist gut.','The quality of the data is good.')}${D('Am Ende des Monats bekomme ich mein Gehalt.','At the end of the month I get my salary.')}
 <p>Masculine and neuter nouns add <b>-s</b> or <b>-es</b>. With names, just add -s without apostrophe: ${de('Annas Laptop, Herrn Schmidts Büro')}.</p>
 <p>When speaking, many people use <b>von + Dativ</b> instead: ${de('das Büro von dem Chef')}. In writing, use the Genitiv. Four prepositions take it: <b>wegen, trotz, während, statt</b>.</p>
 ${D('Wegen des Wetters fällt das Spiel aus.','Because of the weather the match is cancelled.')}${D('Trotz der Probleme sind wir fertig geworden.','In spite of the problems we finished.')}${D('Während der Arbeit höre ich keine Musik.','During work I do not listen to music.')}
 <h4>n-Deklination</h4>
 <p>A small group of masculine nouns gets <b>-n</b> or <b>-en</b> in every case except the Nominativ singular. They are mostly people and animals: der Kunde, der Kollege, der Herr, der Student, der Name, der Mensch, der Nachbar, der Junge, der Experte, der Praktikant.</p>
 ${D('Ich rufe den Kunden an.','I am calling the customer.')}${D('Ich spreche mit Herrn Schmidt.','I am speaking with Mr Schmidt.')}${D('Kennen Sie den Namen des Kollegen?','Do you know the colleague\'s name?')}
 <h4>lassen</h4>
 ${tbl(['Meaning','Example'],[
  ['to have something done by someone',D('Ich lasse mein Auto reparieren.','I am having my car repaired.')],
  ['to allow',D('Mein Chef lässt mich von zu Hause arbeiten.','My boss lets me work from home.')],
  ['to leave',D('Ich habe meinen Laptop im Büro gelassen.','I left my laptop at the office.')],
  ['"Let us ..."',D('Lass uns anfangen!','Let\'s start!')]])}`,
 key:['Genitiv: des ...s, der. In speech: von + Dativ.','wegen, trotz, während + Genitiv.','der Kunde → den Kunden, dem Kunden, des Kunden.'],
 do:['Write three sentences with wegen, trotz, während.','Say what you have done by others: "Ich lasse ... machen."'],links:[['vhs-Lernportal',L.vhs]],
 ex:[
 {t:'mcq',q:'Das ist das Büro ___ Chefs.',o:['der','des','dem'],a:1,w:'der Chef → des Chefs.'},
 {t:'mcq',q:'___ des Regens gehen wir spazieren.',o:['Wegen','Trotz','Während'],a:1,w:'trotz = in spite of.'},
 {t:'fill',q:'Ich habe mit dem ___ gesprochen. (der Kunde)',a:['kunden'],w:'n-Deklination: dem Kunden.'},
 {t:'mcq',q:'"I am having my hair cut."',o:['Ich schneide meine Haare.','Ich lasse mir die Haare schneiden.','Ich werde Haare schneiden.'],a:1,w:'lassen + infinitive: someone else does it.'},
 {t:'fill',q:'Die Qualität ___ Daten ist wichtig. (plural)',a:['der'],w:'Genitiv plural: der.'}]},

/* ───────────── Leben und Arbeit ───────────── */
{id:'D22',sec:'Leben und Arbeit',min:35,t:'Alltag: Arzt, Amt, Wohnung',sum:'Dialogues you will really have',
 body:`<p>Listen to each dialogue line by line. Then hide the German lines of your role and speak them yourself.</p>
 ${W('dialog','arzt')}
 ${W('dialog','amt')}
 ${W('dialog','wohnung')}
 <h4>Words for German paperwork</h4>
 ${tbl(['German','Meaning'],[
  [de('die Anmeldung / sich anmelden'),'registration of your address at the Bürgeramt'],
  [de('die Meldebescheinigung'),'the paper that proves your address'],
  [de('der Aufenthaltstitel'),'residence permit'],
  [de('die Ausländerbehörde'),'immigration office'],
  [de('der Antrag / einen Antrag stellen'),'application / to apply'],
  [de('die Bescheinigung'),'certificate, written proof'],
  [de('die Frist'),'deadline'],
  [de('die Krankenkasse'),'health insurance'],
  [de('die Krankschreibung'),'sick note (officially: Arbeitsunfähigkeitsbescheinigung)'],
  [de('die Steuererklärung'),'tax return'],
  [de('die Kaltmiete / die Warmmiete'),'rent without / with additional costs'],
  [de('die Kaution'),'deposit'],
  [de('kündigen / die Kündigungsfrist'),'to give notice / notice period'],
  [de('der Rundfunkbeitrag'),'the broadcasting fee every household pays']])}
 <h4>Sentences that save you</h4>
 ${D('Entschuldigung, ich habe das nicht verstanden. Könnten Sie bitte langsamer sprechen?','Sorry, I did not understand that. Could you please speak more slowly?')}
 ${D('Was bedeutet das Wort?','What does this word mean?')}
 ${D('Könnten Sie mir das bitte aufschreiben?','Could you please write that down for me?')}
 ${D('An wen kann ich mich wenden?','Who can I turn to?')}
 ${D('Welche Unterlagen brauche ich dafür?','Which documents do I need for that?')}
 <p>Practise a free conversation. This needs the tutor (it works when you open the page inside Claude).</p>
 ${W('chat')}`,
 key:['Ich hätte gern einen Termin. Ich möchte mich ummelden. Ist die Wohnung noch frei?','Könnten Sie bitte langsamer sprechen?'],
 do:['Play each dialogue twice: first listen, then speak your role.','Call one real office or practice this month and make an appointment in German.'],
 links:[['DW Nicos Weg (daily life)',L.dw]],
 ex:[
 {t:'mcq',q:'What do you say on the phone to get a doctor\'s appointment?',o:['Ich will Doktor.','Ich hätte gern einen Termin.','Geben Sie mir Termin.'],a:1,w:'hätte gern = polite.'},
 {t:'mcq',q:'What is the "Kaltmiete"?',o:['Rent without additional costs','Rent in winter','The deposit'],a:0,w:'Kaltmiete + Nebenkosten = Warmmiete.'},
 {t:'mcq',q:'You moved to a new flat. What do you have to do at the Bürgeramt?',o:['sich ummelden','kündigen','sich bewerben'],a:0,w:'ummelden = register the new address.'},
 {t:'fill',q:'Könnten Sie bitte ___ sprechen? (more slowly)',a:['langsamer'],w:'langsam → langsamer.'}]},

{id:'D23',min:35,t:'Deutsch im IT-Beruf',sum:'Meetings, tickets, e-mails, small talk',
 body:`${W('dialog','standup')}
 <h4>In meetings</h4>
 ${D('Darf ich kurz etwas dazu sagen?','May I say something about that?')}
 ${D('Wenn ich das richtig verstehe, ...','If I understand that correctly, ...')}
 ${D('Können wir das bitte konkret machen? Wer macht was bis wann?','Can we make that concrete? Who does what by when?')}
 ${D('Ich schlage vor, dass wir zuerst die Anforderungen klären.','I suggest that we clarify the requirements first.')}
 ${D('Dazu habe ich noch eine Rückfrage.','I have one more question about that.')}
 ${D('Das kann ich bis Freitag erledigen.','I can get that done by Friday.')}
 ${D('Das schaffe ich leider nicht bis morgen. Realistisch ist Mittwoch.','Unfortunately I cannot do that by tomorrow. Wednesday is realistic.')}
 ${D('Ich fasse kurz zusammen: ...','Let me summarise briefly: ...')}
 <h4>Talking about data work</h4>
 ${tbl(['German','English'],[
  [de('die Datenquelle'),'data source'],[de('die Schnittstelle'),'interface, API'],[de('die Ladestrecke / der Ladeprozess'),'load process'],[de('die Auswertung'),'report, analysis'],[de('die Kennzahl'),'KPI, measure'],[de('die Anforderung'),'requirement'],[de('die Abnahme'),'formal acceptance by the customer'],[de('der Fehler / die Störung'),'error / outage'],[de('beheben'),'to fix'],[de('abgleichen'),'to reconcile, compare'],[de('bereitstellen'),'to deploy, provide'],[de('die Berechtigung'),'permission'],[de('der Zugriff / der Zugang'),'access'],[de('der Aufwand'),'effort (in hours or days)'],[de('die Schätzung'),'estimate'],[de('abstimmen'),'to agree, coordinate'],[de('die Rückmeldung'),'feedback'],[de('Bescheid geben'),'to let someone know']])}
 <h4>Short work messages</h4>
 ${D('Hallo Jan, kurze Frage: Hast du die Zugangsdaten für die Testdatenbank?','Hi Jan, quick question: do you have the login for the test database?')}
 ${D('Ich bin heute im Homeoffice und ab 9 Uhr erreichbar.','I am working from home today and reachable from 9.')}
 ${D('Die Daten für Oktober sind jetzt geladen. Könntest du bitte die Zahlen prüfen?','The data for October is loaded now. Could you please check the numbers?')}
 ${D('Der Fehler ist behoben. Ursache war ein geändertes Datumsformat in der Quelle.','The error is fixed. The cause was a changed date format in the source.')}
 ${D('Ich gebe dir bis morgen Mittag Bescheid.','I will let you know by noon tomorrow.')}
 <h4>du or Sie?</h4>
 <p>In IT teams most people say <b>du</b>. With customers, authorities and older people, start with <b>Sie</b> and the family name. The older or higher person offers the du: ${de('"Wollen wir uns duzen?"')}. If you are not sure, listen to how others speak to that person.</p>
 <h4>Work culture, in short</h4>
 <ul><li><b>Punctual</b> means five minutes early. If you are late, write before the meeting starts.</li>
 <li><b>Direct feedback</b> is normal and not rude. "Das funktioniert so nicht" is about the work, not about you.</li>
 <li>A <b>Termin</b> is a promise. Cancel early if you cannot come.</li>
 <li><b>Feierabend</b> and weekends are respected. Nobody expects an answer at 21:00.</li>
 <li>Small talk is short: the weather, the weekend, holidays, football. ${de('"Schönes Wochenende!" – "Danke, gleichfalls!"')}</li></ul>`,
 key:['Wer macht was bis wann?','Ich gebe dir Bescheid. Ich kümmere mich darum. Das erledige ich bis Freitag.','Colleagues: du. Customers and offices: Sie.'],
 do:['Give your next stand-up update in German, also if the team speaks English. Prepare it with the three questions: gestern, heute, Probleme.','Write one status message in German to a colleague this week.'],
 links:[['DW: Deutsch im Beruf',L.dw]],
 ex:[
 {t:'mcq',q:'How do you say politely that a deadline is not possible?',o:['Nein, geht nicht.','Das schaffe ich leider nicht bis morgen. Realistisch ist Mittwoch.','Morgen ist dumm.'],a:1,w:'Say no, and offer a date you can keep.'},
 {t:'mcq',q:'What is "die Abnahme"?',o:['The formal acceptance of the work by the customer','A weight loss','A meeting room'],a:0,w:'After the Abnahme the project part counts as delivered.'},
 {t:'fill',q:'Ich gebe dir morgen ___ . (I will let you know)',a:['bescheid'],w:'Bescheid geben.'},
 {t:'mcq',q:'You meet a customer for the first time. How do you address her?',o:['Hallo Sabine, wie geht es dir?','Guten Tag, Frau Becker.','Hey!'],a:1,w:'Sie and family name until she offers the du.'},
 {t:'mcq',q:'"der Aufwand" in a project means:',o:['the effort needed, in hours or days','the wake-up time','the salary'],a:0,w:'"Wie hoch ist der Aufwand?" = How much work is it?'}]},

/* ───────────── Prüfungstraining ───────────── */
{id:'D24',sec:'Prüfungstraining',min:30,t:'Lesen: Strategie und Übung',sum:'Read for the answer, not for every word',
 body:`<p>The reading module has five parts and 65 minutes. You do not need to understand every word. You need to find the answer.</p>
 <ol><li><b>Read the questions first.</b> Underline the key words.</li>
 <li><b>Scan the text</b> for those words or words with the same meaning.</li>
 <li><b>Read only that part carefully.</b></li>
 <li>The questions follow the order of the text.</li>
 <li><b>Watch for small words</b> that turn the meaning: nicht, kein, nur, erst, schon, aber, obwohl, früher, nie.</li>
 <li>Never leave an answer empty. A wrong answer costs nothing.</li></ol>
 <h4>Übung 1: ein Blogeintrag</h4>
 ${lese(`<p><b>Mein erstes Jahr in Osnabrück</b></p><p>Vor einem Jahr bin ich wegen meiner Arbeit nach Osnabrück gezogen. Am Anfang war vieles schwierig. Ich kannte niemanden, und die Wohnungssuche hat fast drei Monate gedauert. In dieser Zeit habe ich in einem kleinen Zimmer bei einer älteren Dame gewohnt. Sie hat mir viel geholfen, zum Beispiel bei Briefen von Behörden.</p><p>Inzwischen fühle ich mich hier wohl. Mit dem Fahrrad brauche ich nur zehn Minuten bis ins Büro. Früher bin ich jeden Tag eine Stunde mit dem Bus gefahren. Meine Kollegen sind nett, obwohl wir am Anfang wenig miteinander gesprochen haben. Das lag auch an mir: Ich hatte Angst, Fehler zu machen. Seit ich zweimal pro Woche einen Deutschkurs besuche, traue ich mich mehr.</p><p>Was mir noch fehlt, sind Freunde außerhalb der Arbeit. Deshalb habe ich mich letzten Monat in einem Sportverein angemeldet. Nächstes Jahr möchte ich die B1-Prüfung machen.</p>`)}
 <p>Richtig oder falsch? Answer the questions below under "Check yourself".</p>
 <h4>Übung 2: Anzeigen</h4>
 ${lese(`<p><b>A</b> Sprachschule am Markt: Deutschkurse B1 am Abend, montags und mittwochs 18–20 Uhr. Prüfungsvorbereitung inklusive. Start jeden Monat.</p><p><b>B</b> Fahrradwerkstatt Kolbe: Reparaturen aller Marken, auch ohne Termin. Samstags bis 14 Uhr geöffnet. Gebrauchte Räder ab 80 Euro.</p><p><b>C</b> Nachmieter gesucht: 2-Zimmer-Wohnung, 54 m², Balkon, 640 Euro warm. Frei ab 1. März. Nur an Nichtraucher.</p><p><b>D</b> Stadtbibliothek: Kostenloses Sprachcafé jeden Donnerstag um 17 Uhr. Deutsch sprechen in kleinen Gruppen. Keine Anmeldung nötig.</p>`)}`,
 key:['Questions first, then scan.','Small words change everything: nicht, nur, erst, obwohl.'],
 do:['Do the reading part of the free Goethe model test with a timer: 65 minutes.','Read one short German news text a day (for example "Nachrichten leicht" or DW "Langsam gesprochene Nachrichten").'],
 links:[['Goethe B1 model test (PDF)','https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf'],['Nachrichtenleicht','https://www.nachrichtenleicht.de/']],
 ex:[
 {t:'mcq',q:'Übung 1: Der Autor hat sofort eine Wohnung gefunden.',o:['Richtig','Falsch'],a:1,w:'"Die Wohnungssuche hat fast drei Monate gedauert."'},
 {t:'mcq',q:'Übung 1: Der Weg zur Arbeit ist heute kürzer als früher.',o:['Richtig','Falsch'],a:0,w:'Zehn Minuten mit dem Rad, früher eine Stunde mit dem Bus.'},
 {t:'mcq',q:'Übung 1: Am Anfang hat er wenig mit den Kollegen gesprochen, weil die Kollegen unfreundlich waren.',o:['Richtig','Falsch'],a:1,w:'"Das lag auch an mir: Ich hatte Angst, Fehler zu machen."'},
 {t:'mcq',q:'Übung 1: Er hat schon viele Freunde im Sportverein.',o:['Richtig','Falsch'],a:1,w:'Freunde fehlen ihm noch. Er hat sich erst letzten Monat angemeldet.'},
 {t:'mcq',q:'Übung 1: Warum traut er sich jetzt mehr?',o:['Weil er einen Deutschkurs besucht','Weil er umgezogen ist','Weil er einen neuen Chef hat'],a:0,w:'"Seit ich ... einen Deutschkurs besuche, traue ich mich mehr."'},
 {t:'mcq',q:'Übung 2: Sie möchten kostenlos Deutsch sprechen üben. Welche Anzeige passt?',o:['A','B','C','D'],a:3,w:'Das Sprachcafé in der Bibliothek ist kostenlos.'},
 {t:'mcq',q:'Übung 2: Ihr Fahrrad ist kaputt und Sie haben nur am Samstagvormittag Zeit.',o:['A','B','C','D'],a:1,w:'Die Werkstatt ist samstags bis 14 Uhr geöffnet, auch ohne Termin.'},
 {t:'mcq',q:'Übung 2: Sie suchen eine Wohnung ab Januar. Passt Anzeige C?',o:['Ja','Nein'],a:1,w:'Die Wohnung ist erst ab 1. März frei.'}]},

{id:'D25',min:30,t:'Hören: Strategie und Übung',sum:'Announcements, messages, and a dictation trainer',
 body:`<p>The listening module has four parts and takes about 40 minutes. Some texts you hear once, some twice.</p>
 <ol><li><b>Use the reading time.</b> Read the questions before the audio starts. Guess what kind of text is coming.</li>
 <li><b>Listen for numbers, days, times and names.</b> They are often the answer.</li>
 <li>The speaker often names a wrong option first and then corrects it: "nicht am Montag, sondern am Dienstag". Wait for the end.</li>
 <li>If you miss one answer, let it go. Listen for the next one.</li></ol>
 <h4>Übung 1: Durchsage am Bahnhof</h4>
 ${W('hoer','bahn')}
 <h4>Übung 2: Nachricht auf der Mailbox</h4>
 ${W('hoer','ab')}
 <h4>Übung 3: Wetterbericht</h4>
 ${W('hoer','radio')}
 <h4>Diktat: listen and type</h4>
 <p>Dictation trains your ear and your spelling at the same time. Listen as often as you like, then type the sentence.</p>
 ${W('diktat')}
 ${tip('Daily listening is the fastest way to B1. Ten minutes are enough: DW "Langsam gesprochene Nachrichten", the podcast "Easy German", or a German series with German subtitles.')}`,
 key:['Read the questions before you listen.','Numbers, days, times, names.','Wait for corrections: nicht ..., sondern ...'],
 do:['Do five dictation sentences every day for two weeks.','Listen to one slow news programme a day.'],
 links:[['DW: Langsam gesprochene Nachrichten','https://learngerman.dw.com/de/langsam-gesprochene-nachrichten/s-60040332'],['Easy German',H.yt('Easy German')]],
 ex:[
 {t:'mcq',q:'Übung 1: Wie viel Verspätung hat der Intercity nach Hamburg?',o:['12 Minuten','20 Minuten','25 Minuten'],a:2,w:'"circa 25 Minuten Verspätung".'},
 {t:'mcq',q:'Übung 1: Von welchem Gleis fährt der Regionalexpress nach Bremen?',o:['Gleis drei','Gleis fünf','Gleis zwölf'],a:1,w:'"um 14 Uhr 20 von Gleis fünf".'},
 {t:'mcq',q:'Übung 2: Warum ruft Frau Becker an?',o:['Sie möchte den Termin verschieben','Sie möchte eine Rechnung schicken','Sie sucht eine neue Stelle'],a:0,w:'Sie ist am Donnerstag auf einer Messe.'},
 {t:'mcq',q:'Übung 2: Welchen neuen Termin schlägt sie vor?',o:['Donnerstag um zehn','Freitag um zehn','Freitag um zwei'],a:1,w:'"Passt Ihnen auch Freitag um zehn Uhr?"'},
 {t:'mcq',q:'Übung 3: Wie wird das Wetter morgen Vormittag?',o:['Es regnet','Die Sonne scheint','Es gibt Frost'],a:1,w:'"Am Vormittag scheint die Sonne."'},
 {t:'mcq',q:'Übung 3: Wann gibt es Frost?',o:['Heute Nachmittag','Morgen Abend','Am Wochenende in der Nacht'],a:2,w:'"Am Wochenende wird es deutlich kälter, in der Nacht gibt es Frost."'}]},

{id:'D9',min:40,t:'Schreiben: drei Aufgaben',sum:'Templates, model answers and a writing coach',
 body:`<p>The writing module has <b>60 minutes</b> and three tasks. In all three you get points for: did you answer every point of the task, is the text connected, are words and grammar right.</p>
 ${tbl(['Task','What','Length','Tone'],[
  ['<b>Aufgabe 1</b>','A message to a friend. Three points are given, write about each','about 80 words','informal (du)'],
  ['<b>Aufgabe 2</b>','Your opinion in an online forum about a topic','about 80 words','neutral'],
  ['<b>Aufgabe 3</b>','A short message to someone you do not know well: excuse yourself, ask, cancel','about 40 words','formal (Sie)']])}
 <h4>Aufgabe 1: informal message</h4>
 <p>Start: ${de('Liebe Anna, / Lieber Jan, / Hallo Tom,')}. End: ${de('Viele Grüße / Liebe Grüße / Bis bald')} + your first name. Write two or three sentences for each of the three points, and join them with connectors.</p>
 ${more('Model answer: you moved to a new flat. Describe it, say why you moved, invite your friend',lese('<p>Liebe Anna,</p><p>wie geht es dir? Ich habe gute Nachrichten: Seit zwei Wochen wohne ich in einer neuen Wohnung! Sie hat zwei Zimmer und einen kleinen Balkon, und sie liegt direkt am Park.</p><p>Ich bin umgezogen, weil meine alte Wohnung zu laut und zu weit vom Büro entfernt war. Jetzt brauche ich nur zehn Minuten mit dem Fahrrad.</p><p>Ich würde dir die Wohnung gern zeigen. Hast du am Samstag Zeit? Wir könnten zusammen kochen. Sag mir bitte Bescheid!</p><p>Liebe Grüße<br>Bilal</p>'))}
 <h4>Aufgabe 2: your opinion</h4>
 <p>Use this skeleton. It works for every topic.</p>
 <ol><li>Opinion: ${de('Ich bin der Meinung, dass ... / Meiner Meinung nach ...')}</li>
 <li>Reason 1: ${de('Ein wichtiger Grund ist, dass ...')}</li>
 <li>Example from your life: ${de('Ich selbst ... / In meiner Firma ...')}</li>
 <li>The other side: ${de('Natürlich gibt es auch Nachteile. Zum Beispiel ...')}</li>
 <li>End: ${de('Trotzdem finde ich, dass ... / Deshalb bin ich dafür / dagegen.')}</li></ol>
 ${more('Model answer: "Should people work from home?"',lese('<p>Ich bin der Meinung, dass Homeoffice eine gute Sache ist. Ein wichtiger Grund ist, dass man viel Zeit spart, weil man nicht ins Büro fahren muss. Ich selbst arbeite zwei Tage pro Woche zu Hause und kann mich dort besser konzentrieren. Natürlich gibt es auch Nachteile. Zum Beispiel sieht man die Kollegen seltener, und manche Fragen klärt man im Büro schneller. Trotzdem finde ich, dass jeder die Möglichkeit haben sollte, teilweise von zu Hause zu arbeiten.</p>'))}
 <h4>Aufgabe 3: the formal e-mail</h4>
 <p>At work and in the exam you write short formal e-mails. Always use the same five parts.</p>
 <ol><li><b>Anrede</b>: <span lang="de">Sehr geehrte Frau Müller,</span> / <span lang="de">Sehr geehrter Herr Schmidt,</span> / <span lang="de">Guten Tag Frau Müller,</span></li>
 <li><b>Why you write</b>: <span lang="de">ich schreibe Ihnen, weil ...</span></li>
 <li><b>Details</b>: one or two sentences.</li>
 <li><b>What you want</b>: <span lang="de">Könnten Sie mir bitte ...?</span></li>
 <li><b>Schluss</b>: <span lang="de">Vielen Dank im Voraus. Mit freundlichen Grüßen</span> + your full name</li></ol>
 <p>After the Anrede comes a comma, and the next line starts with a small letter. If you do not know the name: ${de('Sehr geehrte Damen und Herren,')}</p>
 ${more('Model answer: you cannot come to your German course next week. Write to your teacher, Frau Keller',lese('<p>Sehr geehrte Frau Keller,</p><p>leider kann ich nächste Woche nicht zum Kurs kommen, weil ich beruflich nach Hamburg fahren muss. Könnten Sie mir bitte die Hausaufgaben per E-Mail schicken? In der Woche danach bin ich wieder da.</p><p>Vielen Dank für Ihr Verständnis.</p><p>Mit freundlichen Grüßen<br>Bilal Tori</p>'))}
 <h4>Phrases for formal letters</h4>
 ${D('Ich schreibe Ihnen, weil ich eine Frage zu meiner Rechnung habe.','I am writing because I have a question about my invoice.')}
 ${D('Hiermit möchte ich mich für den Kurs anmelden.','I hereby would like to register for the course.')}
 ${D('Leider muss ich den Termin am Montag absagen.','Unfortunately I have to cancel the appointment on Monday.')}
 ${D('Ich bitte um Entschuldigung für die späte Antwort.','I apologise for the late reply.')}
 ${D('Über eine schnelle Antwort würde ich mich freuen.','I would be glad about a quick reply.')}
 ${D('Für Rückfragen stehe ich Ihnen gern zur Verfügung.','I am happy to answer any questions.')}
 <h4>Check before you finish</h4>
 <ol><li>Did I write about <b>every</b> point of the task?</li><li>Verb in position 2? Verb at the end after weil, dass, wenn?</li><li>Nouns with capital letters?</li><li>du or Sie, the same all the way through?</li><li>Greeting and closing?</li></ol>
 ${W('coach')}`,
 key:['Three tasks, 60 minutes: 80 + 80 + 40 words.','Answer every point of the task.','Opinion skeleton: Meinung, Grund, Beispiel, andere Seite, Schluss.'],
 do:['Write one text a week with the coach below, changing between the three task types.','Learn the opinion skeleton by heart.'],links:[['Goethe B1 model test (PDF)','https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf']],
 ex:[
 {t:'order',q:'Put the parts of a formal e-mail in order.',items:['Sehr geehrte Frau Müller,','ich schreibe Ihnen, weil ich morgen nicht kommen kann.','Könnten wir den Termin verschieben?','Vielen Dank im Voraus.','Mit freundlichen Grüßen'],w:'Anrede, reason, request, thanks, closing.'},
 {t:'mcq',q:'You write to a man called Schmidt. Which is right?',o:['Sehr geehrte Herr Schmidt,','Sehr geehrter Herr Schmidt,','Hallo Schmidt,'],a:1,w:'geehrter for a man, geehrte for a woman.'},
 {t:'mcq',q:'How long should the text in Aufgabe 3 be?',o:['about 40 words','about 80 words','about 200 words'],a:0,w:'Aufgabe 1 and 2: about 80. Aufgabe 3: about 40.'},
 {t:'order',q:'Order the opinion text.',items:['Ich bin der Meinung, dass ...','Ein wichtiger Grund ist, dass ...','Ich selbst ...','Natürlich gibt es auch Nachteile.','Trotzdem finde ich, dass ...'],w:'Opinion, reason, example, other side, conclusion.'},
 {t:'mcq',q:'How do you end a message to a friend?',o:['Mit freundlichen Grüßen','Liebe Grüße','Hochachtungsvoll'],a:1,w:'Informal: Liebe Grüße, Viele Grüße, Bis bald.'},
 {t:'mcq',q:'The line after "Sehr geehrte Frau Keller," starts with:',o:['a capital letter','a small letter'],a:1,w:'After the comma the sentence continues: "leider kann ich ...".'}]},

{id:'D10',min:35,t:'Sprechen: planen, präsentieren, reagieren',sum:'Sentences for the three parts of the exam, and for meetings',
 body:`<p>The speaking module takes about <b>15 minutes</b> and you do it with a partner. You get 15 minutes to prepare before. It has three parts.</p>
 <h4>Teil 1: plan something together (about 3 minutes)</h4>
 <p>Example task: a colleague is leaving, plan a farewell party. Talk about: when, where, what to buy, who does what. The examiner wants a real conversation: suggest, react, agree.</p>
 ${D('Ich schlage vor, dass wir am Freitag feiern.','I suggest that we celebrate on Friday.')}
 ${D('Wie wäre es, wenn wir uns am Montag treffen?','How about meeting on Monday?')}
 ${D('Wir könnten zuerst die Daten prüfen.','We could check the data first.')}
 ${D('Was hältst du davon?','What do you think of that?')}
 ${D('Das ist eine gute Idee. Einverstanden.','That is a good idea. Agreed.')}
 ${D('Ich bin nicht sicher, ob das geht. Vielleicht sollten wir lieber ...','I am not sure that works. Maybe we should rather ...')}
 ${D('Gut, dann kaufe ich die Getränke, und du kümmerst dich um das Geschenk.','Good, then I will buy the drinks and you take care of the present.')}
 ${D('Also, dann machen wir es so: ...','So, we will do it like this: ...')}
 <h4>Teil 2: a short presentation (about 3 to 4 minutes)</h4>
 <p>You choose one of two topics and get five slides with headings. Follow them. One or two sentences per slide are enough.</p>
 ${tbl(['Slide','Phrases'],[
  ['1 Topic and structure',de('Ich möchte heute über das Thema ... sprechen. Zuerst erzähle ich von meinen Erfahrungen, dann ..., und zum Schluss sage ich meine Meinung.')],
  ['2 My experience',de('Ich persönlich ... / Als ich ... war, ...')],
  ['3 In my home country',de('In meinem Heimatland ist das anders / ähnlich. Dort ...')],
  ['4 For and against, my opinion',de('Ein Vorteil ist, dass ... Ein Nachteil ist, dass ... Ich finde, ...')],
  ['5 End',de('Das war mein Vortrag. Vielen Dank für Ihre Aufmerksamkeit. Haben Sie Fragen?')]])}
 ${more('Model presentation: "Einkaufen im Internet"',lese('<p>Ich möchte heute über das Thema „Einkaufen im Internet“ sprechen. Zuerst erzähle ich von meinen Erfahrungen, dann spreche ich über die Situation in meinem Heimatland und über Vor- und Nachteile.</p><p>Ich persönlich kaufe oft im Internet ein, vor allem Bücher und Technik. Letzten Monat habe ich zum Beispiel einen Monitor bestellt.</p><p>In meinem Heimatland kaufen viele Leute noch lieber im Geschäft, aber in den großen Städten wird Online-Shopping immer beliebter.</p><p>Ein Vorteil ist, dass man Preise leicht vergleichen kann und Zeit spart. Ein Nachteil ist, dass man die Ware nicht anfassen kann und kleine Geschäfte Kunden verlieren. Ich finde, man sollte beides nutzen.</p><p>Das war mein Vortrag. Vielen Dank für Ihre Aufmerksamkeit. Haben Sie Fragen?</p>'))}
 <h4>Teil 3: react to your partner\'s presentation (about 2 minutes)</h4>
 <p>Give short feedback and ask one question. Then answer the question about your own presentation.</p>
 ${D('Vielen Dank für deinen Vortrag. Er hat mir gut gefallen.','Thank you for your presentation. I liked it.')}
 ${D('Besonders interessant fand ich, dass ...','I found it especially interesting that ...')}
 ${D('Ich habe noch eine Frage: Wie ist das bei dir persönlich?','I have one more question: what is it like for you personally?')}
 <h4>Opinion, agreeing, disagreeing</h4>
 ${D('Meiner Meinung nach ist das eine gute Idee.','In my opinion that is a good idea.')}${D('Ich finde, dass wir mehr Zeit brauchen.','I think that we need more time.')}
 ${D('Da haben Sie recht.','You are right about that.')}${D('Das sehe ich genauso.','I see it the same way.')}${D('Das sehe ich etwas anders.','I see that a little differently.')}${D('Da bin ich anderer Meinung, weil ...','I have a different opinion, because ...')}
 <h4>When you do not understand, or need time</h4>
 ${D('Könnten Sie das bitte wiederholen?','Could you repeat that, please?')}${D('Ich habe das nicht ganz verstanden.','I did not quite understand that.')}${D('Was bedeutet das Wort?','What does that word mean?')}
 ${D('Moment, ich muss kurz überlegen.','One moment, I have to think.')}${D('Wie sagt man ... auf Deutsch?','How do you say ... in German?')}${D('Ich meine damit, dass ...','What I mean is that ...')}
 ${tip('Nobody speaks without mistakes at B1. The examiners listen for: do you keep talking, do you react to your partner, can people understand you. Speaking simply and without stopping beats perfect grammar with long pauses.')}`,
 key:['Teil 1: suggest and react. Teil 2: five slides. Teil 3: feedback and a question.','Ich schlage vor ... Was hältst du davon? Einverstanden.','Keep talking. Simple and fluent wins.'],
 do:['Use one of these sentences in your next meeting.','Record yourself for one minute: "Was machst du beruflich?"','Prepare and record one presentation with the five slides. Topic: "Sport im Alltag".'],links:[['Goethe B1 speaking example (video)','https://goethemp4s.akamaized.net/resources/files/mp473/goethe-v14.mp4'],['Video: Easy German',H.yt('Easy German B1')]],
 ex:[
 {t:'fill',q:'Meiner Meinung ___ ist das eine gute Idee.',a:['nach'],w:'meiner Meinung nach = in my opinion.'},
 {t:'mcq',q:'Which is the polite way to disagree?',o:['Das ist falsch.','Das sehe ich etwas anders.','Nein.'],a:1,w:'Soft and professional.'},
 {t:'order',q:'Order the five slides of the presentation.',items:['Thema und Aufbau vorstellen','Eigene Erfahrungen','Situation im Heimatland','Vor- und Nachteile, eigene Meinung','Abschluss und Dank'],w:'The slides in the exam always follow this order.'},
 {t:'mcq',q:'Your partner suggests Saturday, but you cannot. What do you say?',o:['Nein.','Samstag passt mir leider nicht. Wie wäre es mit Sonntag?','Samstag ist schlecht Idee.'],a:1,w:'Say no politely and make a new suggestion.'},
 {t:'fill',q:'Was hältst du ___ ? (of that)',a:['davon'],w:'halten von → davon.'},
 {t:'mcq',q:'What matters most in the speaking exam?',o:['Perfect grammar','Keeping the conversation going and being understood','Speaking very fast'],a:1,w:'Communication first.'}]},

{id:'D11',min:20,t:'Die B1-Prüfung und der Weg zu B2',sum:'How the exam works, and a plan',
 body:`<p>The <b>Goethe-Zertifikat B1</b> has four modules. Each has 100 points and you pass a module with <b>60</b>. You can take the modules one by one, and a passed module stays passed.</p>
 <div class="tbl"><table><tr><th>Module</th><th>Time</th><th>What you do</th></tr>
 <tr><td>Lesen</td><td class="num">65 min</td><td>Five parts: a blog or e-mail, two news texts, adverts, opinions of readers, rules or instructions</td></tr>
 <tr><td>Hören</td><td class="num">about 40 min</td><td>Four parts: short announcements, a talk or tour, a conversation, a radio discussion</td></tr>
 <tr><td>Schreiben</td><td class="num">60 min</td><td>Three texts: informal message, opinion, formal message</td></tr>
 <tr><td>Sprechen</td><td class="num">about 15 min</td><td>With a partner: plan something, give a short presentation, react to the partner</td></tr></table></div>
 <p>Other B1 exams with the same level: <b>telc Deutsch B1</b> and the <b>Deutsch-Test für Zuwanderer</b> (DTZ) from integration courses. For a permanent residence permit and for German citizenship, B1 is normally the level you must prove. Ask your Ausländerbehörde which certificates they accept.</p>
 <h4>Your plan on this line</h4>
 ${tbl(['Month','Grammar','Skills'],[
  ['1','Fundament: Aussprache, Satzbau, Fälle, Präpositionen, Verben','Flashcards every day. Dictation'],
  ['2','Zeiten, Nebensätze, Konnektoren','First dialogues. Slow news'],
  ['3','Relativsätze, indirekte Fragen, zu, Konjunktiv II','Formal e-mails with the coach'],
  ['4','Passiv, Adjektive, Komparativ, Verben mit Präpositionen, Genitiv','Opinion texts. Presentations'],
  ['5','Repeat weak stations','One model test part per week'],
  ['6','Only exam training','Two full model tests with a timer. Take the exam']])}
 <p><b>Realistic timing:</b> from A2 to B1 in six months is realistic with about five hours a week, if you also <b>speak</b>. A website can teach you grammar, words, reading, listening and writing. Speaking needs people. Find one fixed hour a week: a tandem partner, a Sprachcafé, a course, or colleagues at lunch.</p>
 <h4>And then B2</h4>
 <p>B2 needs about six to nine more months. The grammar is almost complete at B1. What grows is vocabulary, speed, and longer texts. The best path: read and listen a lot in German about things you like, and use German at work every day.</p>`,
 key:['Four modules, 60 of 100 points each. Modules can be taken separately.','Speaking needs people: one fixed hour a week.'],
 do:['Do the free Goethe model test once now, to see the format.','Read the B1 word list and mark the words you do not know.','Two months before the exam: one full practice test every second week.','Find a test centre near you and write down the next two exam dates.'],
 links:[['Goethe B1 practice material','https://www.goethe.de/de/spr/prf/ueb/pb1.html'],['B1 word list (PDF)','https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf'],['Practice test 2 (PDF)','https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf']],
 ex:[{t:'mcq',q:'How many points do you need to pass one module?',o:['50','60','75'],a:1,w:'60 of 100 in each module.'},
 {t:'mcq',q:'You pass Lesen, Hören and Schreiben but fail Sprechen. What happens?',o:['You repeat everything','You repeat only Sprechen','You get B1 anyway'],a:1,w:'Modules are separate.'},
 {t:'mcq',q:'Which skill can a website not fully train?',o:['Reading','Free speaking with other people','Grammar'],a:1,w:'Plan a fixed speaking hour with real people.'}]}
);
})();
