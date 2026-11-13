// Career and craft line: market, roadmap, engineering judgement, problem solving, getting the job. Plus the glossary.
(function(){
const {py,sql,txt,sh,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;
const a=(t,u)=>'<a href="'+u+'" target="_blank" rel="noopener">'+t+'</a>';

WD.scenario.client={title:'A request arrives: "We need an AI chatbot for our data"',intro:'A department head sends you this one line. Choose what you do at each step.',steps:[
 {t:'What is your first move?',o:[
  ['Ask what decision or task should get easier, and who will use it',2,'Right. "A chatbot" is a solution. You need the problem behind it.'],
  ['Start building a RAG prototype over all company documents',0,'You may build the wrong thing very well. Nobody has said what it is for.'],
  ['Reply that chatbots hallucinate and it is a bad idea',0,'You closed the door before understanding the need.']]},
 {t:'They answer: "Sales staff spend an hour a day looking up delivery dates and prices in three systems." What now?',o:[
  ['Ask for five real example questions, and where the right answers come from today',2,'Right. Real examples turn a wish into a test set. And you learn that the answers live in tables, not in documents.'],
  ['Propose a large agent platform',0,'Far too big for a problem you have understood for one minute.'],
  ['Ask which model they prefer',0,'They cannot know, and it does not matter yet.']]},
 {t:'The examples are all look-ups of numbers: price for customer X, delivery date of order Y. What do you propose?',o:[
  ['A small tool that turns the question into a safe query on the existing tables, tested on 30 real questions',2,'Right. Numbers come from the database. The language model only translates the question. Small, testable, useful.'],
  ['RAG over PDF exports of the tables',0,'Retrieval over exports gives old and wrong numbers. Numbers belong in queries.'],
  ['Fine-tune a model on the price list',0,'Prices change. A fine-tuned model would be wrong next week.']]},
 {t:'They ask: "When is it finished, and what does it cost?"',o:[
  ['Give a range for a two-week first version on one data source, name what is not included, and offer a check after week one',2,'Right. A range, a clear scope, and an early checkpoint. This is how trust is built.'],
  ['"Hard to say."',0,'True, but useless. They cannot plan with it.'],
  ['"Three days." (to sound fast)',0,'A promise you will break. One broken date costs more trust than ten honest ranges.']]},
 {t:'After week one, 24 of 30 test questions are right. Four of the wrong ones need a system you have no access to. What do you report?',o:[
  ['"24 of 30 right. 4 need access to system Z, which was out of scope. 2 are bugs I fix this week. Decision needed: add system Z, about 3 more days?"',2,'Right. Numbers, causes, and one clear decision for them to take.'],
  ['"It works well."',0,'They will find the six wrong answers themselves, and then doubt everything.'],
  ['Quietly start integrating system Z',0,'Unasked scope growth. It may not be worth three days to them.']]}],
 end:[[9,'Excellent. You turned a vague wish into a small tested tool, and kept the other side informed with numbers. That is what "good problem solver" means in practice.'],[6,'Good. Read the feedback on the steps you missed. The pattern: problem before solution, real examples, small scope, honest numbers.'],[0,'Go through it again. The key habit: ask what should get easier, and ask for real examples, before you build anything.']]};

TRACKS.pro={c:'c',letter:'C',name:'Career and craft',goal:'Think like an experienced engineer, and get the next job',
intro:'Tools change every year. Judgement does not. This line holds what experienced engineers know that is in no tool manual: how to find a bug, how to design a system, how to check a claim, how to say what you need in three sentences, and how to turn all of this into a job offer.',
stations:[

{id:'C1',sec:'Where the jobs are',min:30,t:'The market in Germany, 2026 to 2029',sum:'What the data says, what it cannot say, and a forecast',
 body:`<p>Facts first, with sources. Then a forecast, marked as a forecast. Checked in November 2026. Job markets move, so repeat the check every six months with the method at the end.</p>
 <h4>Which skills the job ads ask for</h4>
 ${tbl(['Skill','Share of European AI engineering ads','Source'],[
  ['Python','47 % in one report, about 69 % in another','Both reports below'],
  ['Azure / AWS','about 20 % each',a('PredictLeads hiring report','https://predictleads.com/blog/ai-engineering-jobs-in-europe-hiring-report/')],
  ['CI/CD','18 %','PredictLeads'],
  ['Kubernetes','22 % (third most named)',a('Toknjobs, October 2026, 774 roles','https://www.toknjobs.com/blog/ai-job-market-europe-october-2026')],
  ['Docker','14 %','PredictLeads'],
  ['PyTorch','fourth most named','Toknjobs'],
  ['RAG','12 %','Toknjobs']])}
 <p>The two reports count differently, so read the numbers as "roughly", not as exact ranks. The stable message: <b>Python is the one constant</b>. After it come cloud, containers and delivery skills. Names of AI frameworks appear in far fewer ads than people expect. For data and platform roles, add SQL, Spark, Airflow, dbt, Terraform and Kafka, which the Data and Engineering lines cover.</p>
 <h4>Salaries: why the numbers disagree</h4>
 ${tbl(['Source','Data engineer','ML / AI / MLOps engineer'],[
  [a('StepStone salary pages','https://www.stepstone.de/gehalt/Data-Engineer.html')+' (medians, partly older data)','about 56,000 €, senior 67,000 €','about 58,000 € (ML engineer)'],
  [a('Recruiter reports 2026','https://spitzenbesetzung.com/wissen/markt/gehaltsreport-ai-data-rollen-2026'),'80,000 to 98,000 €','92,000 to 112,000 € (MLOps)'],
  [a('PaymetricLabs 2026','https://www.paymetriclabs.com/de/salaries/ai-ml-engineer'),'','median about 94,000 € (AI / ML engineer)']])}
 <p>Job-board medians include small companies and all regions. Recruiter reports describe the candidates recruiters place: senior people in large cities. Both are true for their group. A sensible reading for a career changer with a strong portfolio: a first data or AI engineering role around <b>55,000 to 75,000 €</b>, and <b>80,000 € and more</b> after two to three years of production experience, higher in Munich and in finance. Treat every single number with care.</p>
 <h4>Who hires</h4>
 <ul><li><b>Automotive and industry</b>: production data, quality inspection (computer vision), predictive maintenance.</li><li><b>Finance and insurance</b>: document processing, risk, strict governance. They pay well and want German more often.</li><li><b>Software and e-commerce</b> (Berlin, Munich, Hamburg): the most English-speaking teams, modern stacks.</li><li><b>Energy, logistics, agriculture and food</b>: fewer ads, less competition, and your domain knowledge counts.</li><li><b>Consultancies</b>: many openings and a fast way to learn, with much customer contact.</li></ul>
 <h4>If you want little customer contact</h4>
 <p>Look for <b>platform</b>, <b>MLOps</b>, <b>data platform</b> and <b>backend</b> roles in companies that build their own product. Your "customers" are the other engineers. Forward-deployed engineer and consulting roles are the opposite: they are growing very fast (one widely quoted LinkedIn analysis counted a 42-fold rise in such roles from 2023 to 2025), and they pay well, but most of the day is with customers. ${a('TechCrunch','https://techcrunch.com/2026/07/30/forward-deployed-engineers-are-the-ai-industrys-latest-talent-obsession/')} also warns that this title may not stay in fashion. The skills under it will.</p>
 <h4>Forecast for the next one to three years</h4>
 <p>This part is judgement, not data. Nobody can predict a job market exactly. These are the directions the evidence points to.</p>
 ${tbl(['Likely to grow','Why'],[
  ['<b>Evaluation and quality engineering</b> for AI','Every company now has demos. Few can prove that theirs works. People who can measure are scarce'],
  ['<b>Agent infrastructure</b>: tools, MCP servers, permissions, sandboxes','Agents need safe access to company systems. Somebody has to build it'],
  ['<b>LLMOps and cost control</b>','AI bills are becoming a board topic'],
  ['<b>Data foundations for AI</b>: clean models, metadata, access rules','Agents are only as good as the data they can reach. This is your home ground'],
  ['<b>Self-hosted and European-hosted models</b>','Data protection and sovereignty are strong topics in Germany'],
  ['<b>AI security and compliance</b>','The EU AI Act phases in through 2027, and prompt injection is unsolved'],
  ['<b>Document and vision automation</b> in industry','Invoices, delivery notes, inspection. Unexciting, funded, everywhere']])}
 ${tbl(['Likely to shrink','Why'],[
  ['Prompt-only roles','The skill became part of every engineering job'],
  ['Hand-building standard dashboards and standard pipelines','Assistants and tools produce the routine part'],
  ['Knowing one vendor tool by clicks','Tools change. Code, data modelling and operations skills move with you']])}
 <p><b>What stays valuable whatever happens:</b> Python, SQL, data modelling, cloud and containers, testing and measuring, knowing an industry, clear writing, and German for the large part of the German market that does not work in English.</p>
 <h4>Check it yourself every six months</h4>
 <ol><li>Search a job board for your target title in Germany. Note the number of ads.</li><li>Open 20 ads. Count each tool name.</li><li>Compare with last time. Add what rose to your plan.</li></ol>`,
 key:['Python is the constant. Then cloud, containers, CI/CD.','Salary sources differ by a factor of almost two. Know why.','Little customer contact: platform, MLOps and data platform roles in product companies.'],
 do:['Do the 20-ad count for "AI Engineer" or "MLOps Engineer" this week and save it with the date.','Write down your target role and three target industries.'],
 links:[['Make it in Germany (official, visas and Blue Card)','https://www.make-it-in-germany.com/en/'],['StepStone salary pages','https://www.stepstone.de/gehalt/']],
 ex:[
 {t:'mcq',q:'Which skill appears in the largest share of European AI engineering job ads?',o:['Python','LangChain','Prompt writing'],a:0,w:'Around half to two thirds of ads, depending on the count.'},
 {t:'mcq',q:'One source says a data engineer earns 56,000 €, another says 90,000 €. What is the best conclusion?',o:['They measure different groups. Find out which group you are in','One of them is lying','Take the average'],a:0,w:'All regions and company sizes against senior placements in big cities.'},
 {t:'mcq',q:'You want deep technical work with little customer contact. Which role fits best?',o:['Platform or MLOps engineer in a product company','Forward-deployed engineer','Pre-sales consultant'],a:0,w:'Your users are other engineers.'},
 {t:'mcq',q:'Which skill is most likely to keep its value through the next tool changes?',o:['Measuring whether a system is correct','Knowing the menu of one vendor tool','A specific prompt template'],a:0,w:'Judgement and measurement move with you.'}]},

{id:'C2',min:25,t:'Your twelve months',sum:'A roadmap that maps to the lines on this site',
 body:`<p>About 10 hours a week next to your job: an hour on most weekdays and a longer block at the weekend. German runs every day beside it, in small pieces.</p>
 ${tbl(['Months','Build','Stations','Proof at the end'],[
  ['<b>1 to 2</b>','Python every day. Shell, Git, tests','Engineering: Python, shell, Git, testing. AI: roles, how models work','A tested Python package on GitHub with CI'],
  ['<b>3 to 4</b>','Docker, APIs, calling models, first RAG','Engineering: Docker, FastAPI, CI/CD. AI: prompts, model calls, RAG','A RAG API that runs with one command'],
  ['<b>5 to 6</b>','RAG quality, agents, evals. Data stack','AI: RAG in code, agents, evals. Data: modelling, Spark, dbt, Airflow','<b>Portfolio project 1</b> (data platform) and <b>project 2</b> (RAG service with eval numbers)'],
  ['<b>7 to 8</b>','Cloud, Terraform, Kubernetes, observability','Engineering: cloud to observability. AI: LLMOps','Project 2 deployed in a cloud with Terraform'],
  ['<b>9 to 10</b>','Machine learning, vision, MLOps','AI: machine learning, deep learning, vision, MLOps. Data: Kafka','<b>Portfolio project 3</b> (model service with lifecycle)'],
  ['<b>11 to 12</b>','Polish, interviews, applications','Career: all stations','Applications sent every week. Mock interviews done']])}
 <h4>Security beside it</h4>
 <p>The Security line runs in parallel, about four hours a week, from month 3 or 4. It turns your data and AI skills into a specialisation: detection engineering, or AI security. Its last station has its own six-month plan and two projects.</p>
 <h4>Start applying earlier than feels comfortable</h4>
 <p>After month 6 you have two real projects. Send the first applications then. Interviews are the fastest feedback on what the market wants, and one early offer changes everything.</p>
 <h4>Use your current job</h4>
 <p>You do not have to wait for a new employer to get experience. Look for one task at work that you can solve in the new way: a Python script with tests in place of a manual step, a small internal tool with a language model, a CI check for SQL. "I introduced X at my company and it saved Y hours" is worth more in a CV than any certificate.</p>
 <h4>Rules for a year like this</h4>
 <ol><li><b>Build more than you read.</b> A station counts when its "do it" part is done.</li><li><b>Finish.</b> Three finished projects beat ten started ones.</li><li><b>In public.</b> Push to GitHub from week one. Small commits, clear messages.</li><li><b>Let AI assistants help, but type and understand everything yourself</b> in the first three months. Later, use them fully and review their work.</li><li><b>One rest day a week.</b> A plan that burns you out in month three is a bad plan.</li></ol>
 <h4>German beside it</h4>
 ${tbl(['Months','German'],[['1 to 2','A2 revision: flashcards daily, the revision stations'],['3 to 6','B1 grammar, one station every few days. Dictation. First e-mails with the coach'],['7 to 10','Exam training: reading, listening, writing, speaking. One hour of real conversation a week'],['11 to 12','Model tests with a timer. Take the B1 exam']])}`,
 key:['Six phases of two months, each with a visible proof.','Apply from month 6. Use your current job for real experience.','Finish things. Publish them.'],
 do:['Put the six phases into your calendar with end dates.','Create your GitHub account and the first repository today.','Choose the weekly rhythm: which days, which hour.'],links:[],
 ex:[
 {t:'mcq',q:'When should you send your first applications?',o:['When two portfolio projects are finished, around month 6','Only after every station is done','After two years'],a:0,w:'Interviews are feedback. Start early.'},
 {t:'mcq',q:'What counts most in a CV for a career changer?',o:['A real result: "I built X, it runs, here is the repository and the effect"','A long list of online courses','The number of tools named'],a:0,w:'Evidence over claims.'}]},

{id:'C3',min:25,t:'Three portfolio projects, and how to present them',sum:'What replaces the missing job title',
 body:`<p>Nobody has seen you do this job. A portfolio lets them see it. Three projects, each proving a different thing:</p>
 ${tbl(['Project','Proves','Where'],[
  ['<b>1. A small production data platform</b>','Python, SQL, dbt or Spark, Airflow, Docker, CI, idempotent loads','Data line, last station'],
  ['<b>2. A RAG service with eval numbers</b>','Model APIs, retrieval, FastAPI, Postgres, evaluation, tracing, cost thinking','AI line, "Build it"'],
  ['<b>3. A model service with full lifecycle</b>','Training, MLflow, Docker, Terraform, cloud deployment, monitoring','AI line, last station']])}
 <p>Use a domain you know. "Hatchery data" or "delivery notes" is better than the Titanic data set that every beginner uses. A reviewer remembers the candidate who built an egg-tray inspector.</p>
 <h4>What a reviewer checks in the first two minutes</h4>
 <ol><li><b>README</b>: what is it, a picture, how to run it. If this is missing, they close the tab.</li><li><b>One command</b> to start it.</li><li>A green <b>CI</b> tick.</li><li><b>Tests</b> exist.</li><li><b>Commit history</b>: many small commits with clear messages, not one upload of everything.</li><li><b>No secrets</b>, no data files, no notebooks with 80 unnamed cells.</li><li><b>Decisions and limits</b>: "I chose pgvector because ... It would not scale beyond ... Next I would ..."</li></ol>
 <h4>The README skeleton</h4>
 ${txt`# Egg-tray inspector
One sentence: what it does and for whom.

![architecture](docs/architecture.png)

## Run it
docker compose up        → open http://localhost:8000/docs

## Results
mAP50 0.87 on 120 held-back images.  p95 latency 140 ms on CPU.  About 9 € per month in the cloud.

## How it works          (5 to 10 lines)
## Decisions             (3 short decision records)
## Limits and next steps (honest)`}
 <p>Write a short post about each project (LinkedIn or a blog): the problem, one picture, one number, one thing that went wrong and how you fixed it. Recruiters search for exactly these words.</p>
 ${warn('Never put anything from your employer into a public repository: no code, no data, no table names, no screenshots. Rebuild ideas with invented data.')}`,
 key:['Three projects: data platform, RAG service, model service.','README, one command, CI, tests, small commits, honest limits.','A domain you know makes you memorable.'],
 do:['Create the three repositories now, each with a README that only has the first three sections.','After each project, write one short post about it.'],links:[],
 ex:[
 {t:'mcq',q:'What do reviewers look at first in a repository?',o:['The README','The licence file','The number of stars'],a:0,w:'No README, no further look.'},
 {t:'mcq',q:'Which commit history looks professional?',o:['Sixty small commits with clear messages over five weeks','One commit: "upload"','Ten commits named "fix"'],a:0,w:'It shows how you work.'},
 {t:'mcq',q:'Why write a "Limits" section?',o:['Knowing the limits of your own design is a sign of experience','To make the README longer','It is required by GitHub'],a:0,w:'Juniors hide limits. Seniors list them.'}]},

{id:'C4',sec:'Think like an engineer',min:35,t:'What three years of engineering teach',sum:'The lessons people usually pay for with mistakes',
 body:`<p>Somebody with three years in a good team knows these things without thinking. Most of them were learned by getting them wrong once. Reading them does not replace the experience, but it lets you recognise the situation when it comes.</p>
 <h4>About code</h4>
 <ol><li><b>Make it work, make it right, make it fast. In that order.</b> Most code never needs the third step.</li>
 <li><b>The simplest thing that works usually wins.</b> A cron job and a SQL script that run for five years beat an elegant platform that nobody can operate.</li>
 <li><b>Code is read ten times more often than written.</b> Write for the tired colleague at 02:00. That colleague is often you.</li>
 <li><b>Names are the documentation.</b> <code>days_since_set</code> needs no comment. <code>x2</code> needs an apology.</li>
 <li><b>Small changes.</b> A pull request of 80 lines gets a real review. One of 2,000 lines gets "looks good".</li>
 <li><b>Do not build for needs you imagine.</b> Build what is needed now, in a way that is easy to change later.</li>
 <li><b>Delete code.</b> Every line is something to read, test and maintain.</li>
 <li><b>Copy twice, abstract the third time.</b> A wrong abstraction costs more than a little repetition.</li></ol>
 <h4>About systems</h4>
 <ol start="9"><li><b>Everything fails.</b> Networks, disks, other teams' APIs. Ask "what happens when this is down?" for every arrow in your diagram.</li>
 <li><b>Make it safe to run twice.</b> Idempotent jobs turn failures into "run it again".</li>
 <li><b>Prefer boring technology.</b> Postgres, cron, a queue. Use something new only for the one part where it is clearly better.</li>
 <li><b>You cannot fix what you cannot see.</b> Logs and metrics before the first user.</li>
 <li><b>Make it easy to undo.</b> Feature switches, backups you have tested, migrations in two steps. Decisions that can be undone can be made fast. Decisions that cannot be undone deserve a day of thought.</li>
 <li><b>Measure before you optimise.</b> The slow part is almost never where you think.</li>
 <li><b>Data lives longer than code.</b> A bad schema hurts for ten years. Spend your care there.</li></ol>
 <h4>About work</h4>
 <ol start="16"><li><b>Understand the problem before the solution.</b> Half of all tickets describe a solution. Ask what should be different afterwards.</li>
 <li><b>Ask early.</b> Thirty minutes stuck is normal. Three hours stuck without asking is a waste. Say what you tried.</li>
 <li><b>Say "I do not know, I will find out."</b> It builds more trust than a guess.</li>
 <li><b>Tell bad news at once, with a plan.</b> "The load is broken, numbers are wrong since 06:00, I am rolling back, next update at 10:00."</li>
 <li><b>Write things down.</b> Decisions, how to run it, what broke. Your memory will not keep it.</li>
 <li><b>Finish.</b> Done means deployed, monitored and documented. "Works on my machine" is 60 %.</li>
 <li><b>Review kindly, be reviewed calmly.</b> Comments are about the code. "What happens with an empty list here?" is better than "this is wrong".</li>
 <li><b>Estimates are ranges.</b> "Three to five days, depending on the API" is honest. Then report as soon as you see it will be more.</li>
 <li><b>Own your mistakes.</b> Everybody breaks production once. What people remember is how you handled it.</li></ol>
 <h4>What changed with AI assistants</h4>
 <ul><li>Writing code became cheap. <b>Knowing what to build, and checking that it is right, became the job.</b></li>
 <li>Small steps and tests matter more, because code now arrives faster than you can read it.</li>
 <li>The ability to read code critically is worth more than the ability to type it.</li></ul>`,
 key:['Simple, readable, small, reversible.','Assume failure. Make jobs safe to run twice. Measure first.','Understand the problem. Ask early. Tell bad news fast, with a plan.'],
 do:['Pick the three lessons that are furthest from how you work today. Write them on a note at your desk for a month.','Look at the last thing you built. Which of the 24 points did it break?'],links:[['The Pragmatic Programmer (book)','https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/'],['A Philosophy of Software Design (book)','https://web.stanford.edu/~ouster/cgi-bin/aposd.php']],
 ex:[
 {t:'mcq',q:'You are stuck on an error for three hours. What would an experienced engineer have done?',o:['Asked a colleague after about 30 to 60 minutes, saying what was tried','Kept going silently for a day','Rewritten everything'],a:0,w:'Asking early, with context, is a strength.'},
 {t:'mcq',q:'Which pull request gets the better review?',o:['80 lines, one clear purpose','2,000 lines, five purposes'],a:0,w:'Small changes are reviewable.'},
 {t:'mcq',q:'A team wants a new database technology for a project. What is the experienced question?',o:['"What can it do that Postgres cannot, and who will run it at 02:00?"','"Is it trending?"','"Does it have a nice logo?"'],a:0,w:'Boring technology by default.'},
 {t:'mcq',q:'A query is slow. What comes first?',o:['Measure where the time goes','Rewrite it in another language','Add indexes everywhere'],a:0,w:'Measure before optimising.'},
 {t:'mcq',q:'Your nightly load has been wrong since 06:00. What do you send to the team?',o:['What is broken, since when, what you are doing, and when the next update comes','Nothing until it is fixed','"Small issue, ignore"'],a:0,w:'Fast, factual, with a plan.'},
 {t:'mcq',q:'With AI assistants writing most routine code, which skill gains the most value?',o:['Reading code critically and deciding what to build','Typing speed','Remembering syntax'],a:0,w:'Judgement over typing.'}]},

{id:'C5',min:30,t:'Debugging: a method, not a talent',sum:'How to find any bug in a bounded time',
 body:`<p>People who seem to find bugs by magic follow a method. It works for code, data, pipelines and AI systems.</p>
 <ol><li><b>Reproduce it.</b> Make the bug happen on demand, with the smallest input you can. If you cannot reproduce it, collect more facts. Do not change anything yet.</li>
 <li><b>Read the error. All of it.</b> The full message, the last line of the stack trace, the line number. Most answers are written there.</li>
 <li><b>Ask what changed.</b> It worked yesterday. New code, new data, new version, new configuration, new permissions? <code>git log</code> and the deploy history are your friends.</li>
 <li><b>Cut the problem in half.</b> Is the input to step 3 already wrong? Then the bug is in steps 1 to 2. Repeat. Ten halvings find one faulty row among a thousand.</li>
 <li><b>One guess, one test.</b> Say the guess out loud: "I think the join doubles rows because the key is not unique." Then test exactly that. Change one thing at a time.</li>
 <li><b>Fix the cause, not the symptom.</b> Then add a test that would have caught it.</li>
 <li><b>Write down what it was.</b> Two lines in the ticket. The next person, or you in a year, will thank you.</li></ol>
 <h4>Halving in practice</h4>
 ${sh`git bisect start
git bisect bad                 # the current version is broken
git bisect good v1.4.0         # this old version worked
# git checks out the middle commit. You test and answer "git bisect good" or "git bisect bad"
# after a few rounds, git names the commit that broke it`}
 ${sql`-- data version: where do the rows multiply?
SELECT 'source' AS step, COUNT(*) FROM stg.orders
UNION ALL SELECT 'after join customers', COUNT(*) FROM stg.orders o JOIN dim.customer c ON c.id = o.customer_id
UNION ALL SELECT 'after join products',  COUNT(*) FROM ...;`}
 <h4>Typical causes, by area</h4>
 ${tbl(['Area','Look for'],[
  ['Data','Duplicates in a join key, nulls, time zones, a changed source format, a late file, a filter on the wrong date'],
  ['Python','A wrong type (text "5" and number 5), a changed library version, a mutable default, a swallowed exception'],
  ['Infrastructure','Permissions, a missing environment variable, a full disk, an expired certificate or token, a wrong region'],
  ['AI systems','The right text was not retrieved, the prompt changed, the context was cut off, the model version changed, the test set does not cover the case']])}
 <h4>When you are stuck</h4>
 <ul><li><b>Explain it out loud</b> to a colleague, a rubber duck or an AI assistant, line by line. Often you hear the mistake yourself.</li>
 <li><b>Check your assumptions.</b> "The config is loaded" – print it. "This function is called" – log it. Bugs hide in what you are sure about.</li>
 <li><b>Take a break.</b> Many bugs are solved on the way to the coffee machine.</li>
 <li><b>Ask an assistant well:</b> paste the full error, the code around it, what you expected, what happened, and what you already tried.</li></ul>`,
 know:'You already debug wrong numbers in reports by tracing them back layer by layer. That is halving. The method is the same for code.',
 key:['Reproduce, read, what changed, halve, one guess at a time.','Fix the cause and add a test.','Bugs hide in what you are sure about.'],
 do:['Next bug: write the seven steps on paper and tick them as you go.','Try <code>git bisect</code> once on a toy repository with a bug you plant yourself.'],links:[],
 ex:[
 {t:'order',q:'Order the debugging steps.',items:['Reproduce the bug','Read the full error','Ask what changed','Halve the problem','Test one guess','Fix the cause and add a test'],w:'Facts first, changes last.'},
 {t:'mcq',q:'A report total is 12 % too high since Monday. What is the fastest first check?',o:['Count rows after each step and find where they multiply','Rewrite the whole pipeline','Increase the server size'],a:0,w:'Halve the pipeline with row counts.'},
 {t:'mcq',q:'It worked last week and fails today. Nobody changed the code. What do you look at?',o:['Data, library versions, configuration, permissions, expired tokens','Nothing can have changed','Only the code again'],a:0,w:'Something always changed.'},
 {t:'mcq',q:'You change four things at once and the bug is gone. What is the problem?',o:['You do not know which change fixed it, or whether one of them broke something else','Nothing','It is faster'],a:0,w:'One change at a time.'}]},

{id:'C6',min:35,t:'Problem solving: from a vague wish to a plan',sum:'Define, break down, guess, test, estimate',
 body:`<p>A good problem solver is not somebody with more ideas. It is somebody who makes the problem small and clear before working on it.</p>
 <h4>1. Define the problem in one sentence</h4>
 <p>Use this form: <b>"[Who] cannot [do what], which costs [what]. It is solved when [measurable result]."</b></p>
 <p>Bad: "We need better data quality." Good: "Planners get the hatch report at 09:00, not 07:00, on about two days per week, so the day plan is made on old numbers. It is solved when the report is ready by 06:30 on 29 of 30 days."</p>
 <h4>2. Break it down</h4>
 <p>Split the problem into parts that <b>do not overlap</b> and <b>together cover everything</b>. Consultants call this <b>MECE</b> (mutually exclusive, collectively exhaustive). Draw it as a tree.</p>
 ${txt`The report is late
├─ the source delivers late            → check arrival times of files for 30 days
├─ the load starts late                → check the schedule and dependencies
├─ the load runs too long
│   ├─ more data than before           → row counts per day
│   ├─ one slow step                   → duration per step
│   └─ waits for a lock or resource    → queue and wait times
└─ the load fails and is rerun by hand → failure log`}
 <p>Now each leaf is a small question with a check you can do in minutes.</p>
 <h4>3. Guess first, then test</h4>
 <p>Do not collect all data about everything. Make a guess about the most likely leaf, and test it. If it is wrong, cross it off and take the next. This is <b>hypothesis-driven</b> work, and it is ten times faster than "let us first analyse everything".</p>
 <h4>4. Ask "why" until you reach something you can change</h4>
 <p>The load failed. <i>Why?</i> A file had a new column. <i>Why did that break it?</i> The load reads columns by position. <i>Why?</i> Nobody decided how to handle schema changes. → Read by name, validate the schema at the door, alert on changes. Fixing only the first "why" means it comes back.</p>
 <h4>5. Choose with two questions</h4>
 <p>For each option: how much does it help, and how much does it cost? Do the high-help, low-cost things first. Say openly which options you chose <b>not</b> to do, and why.</p>
 <h4>6. Estimate honestly</h4>
 <p>A single number is always wrong. Give three: the best case, the likely case, the bad case. The calculator turns them into a range you can defend.</p>
 ${W('pert')}
 <p>Break work into pieces of at most two days before you estimate. Add time for testing, review, deployment and the things you forgot. They are usually half of the total.</p>
 <h4>7. Quick sums in your head</h4>
 <p>Before any deep analysis, estimate the size. "10 million rows a day, 200 bytes each: about 2 GB a day, 700 GB a year. One machine can handle that. We do not need a cluster." This habit, sometimes called a Fermi estimate, prevents a lot of over-engineering.</p>`,
 know:'An issue tree is a drill-down hierarchy for causes. You build such hierarchies for data every day.',
 key:['One sentence: who, cannot what, cost, done when.','Break down without overlap and without gaps. Guess, test, cross off.','Estimates are ranges from three numbers.'],
 do:['Take one open problem at work. Write the one-sentence definition and a tree with at least six leaves.','Estimate your next task with three numbers. Afterwards, compare with reality.'],links:[],
 ex:[
 {t:'mcq',q:'Which problem statement is better?',o:['"Planners get the report two hours late on two days a week. Solved when it is ready by 06:30 on 29 of 30 days."','"Reporting should be improved."'],a:0,w:'Who, what, cost, and a measurable end.'},
 {t:'mcq',q:'What does MECE mean for the branches of an issue tree?',o:['They do not overlap, and together they cover everything','They are sorted by alphabet','There are exactly three'],a:0,w:'Mutually exclusive, collectively exhaustive.'},
 {t:'mcq',q:'What is hypothesis-driven work?',o:['Guess the most likely cause, test it, then move on','Collect all data before thinking','Wait for the manager to decide'],a:0,w:'Fast because you test, not browse.'},
 {t:'mcq',q:'Best case 2 days, likely 4, bad case 12. What do you tell your lead?',o:['"About 5 days, and up to 8 if the API causes trouble"','"2 days"','"Impossible to say"'],a:0,w:'A range with the reason for the upper end.'},
 {t:'mcq',q:'5 million events a day at 1 KB each. Roughly how much per year?',o:['About 1.8 TB','About 18 GB','About 180 TB'],a:0,w:'5 GB a day × 365.'}]},

{id:'C7',min:30,t:'Critical thinking: is that true?',sum:'For numbers, for claims, and for AI output',
 body:`<p>In a world where text and code can be produced without effort, the person who can tell what is <b>true</b> is the valuable one. This is a skill you can train.</p>
 <h4>Five questions for any claim</h4>
 <ol><li><b>What exactly is claimed?</b> "AI makes developers 50 % faster" – at what, measured how, compared with what?</li>
 <li><b>How would we know?</b> Is there data, or a story?</li>
 <li><b>Compared with what?</b> A number without a baseline says nothing.</li>
 <li><b>Who says it, and what do they gain?</b> A vendor's benchmark is an advert.</li>
 <li><b>What would change my mind?</b> If nothing could, I am not thinking.</li></ol>
 <h4>Traps in numbers</h4>
 ${tbl(['Trap','Example','Check'],[
  ['<b>Correlation is not cause</b>','Hatcheries with the new software have better hatch rates. Maybe the best hatcheries bought it first','Is there a comparison group? Did anything else change at the same time?'],
  ['<b>Base rate</b>','A test for a rare problem is "95 % accurate". If the problem affects 1 in 1,000, most alarms are false','How common is the thing at all?'],
  ['<b>Survivorship</b>','"All successful projects used tool X." And the failed ones?','Who is missing from the data?'],
  ['<b>Averages hide groups</b>','The average hatch rate rose, but it fell in every hatchery. The mix changed','Split by group'],
  ['<b>Small samples</b>','"Twice as many failures this week": two, after one','How many cases?'],
  ['<b>Chosen time window</b>','"Up 30 % since March." And since January?','Look at the whole series'],
  ['<b>Unit and definition</b>','"Hatch rate" of eggs set, or of fertile eggs?','Ask for the formula']])}
 <h4>Checking AI output</h4>
 <ul><li><b>It sounds right. Is it right?</b> Fluent text is not evidence. Check one detail you can verify.</li>
 <li><b>Ask for the source</b>, then open the source. Models invent citations.</li>
 <li><b>Run the code.</b> Do not judge code by reading alone.</li>
 <li><b>Test the edges</b> yourself: empty input, nulls, duplicates.</li>
 <li><b>Ask the opposite:</b> "What is the strongest argument against this?"</li>
 <li><b>Sanity-check numbers</b> against something you know: "8 billion eggs for one hatchery? No."</li></ul>
 <h4>Thinking traps in yourself</h4>
 <ul><li><b>Confirmation bias</b>: you look for facts that support your idea. Look for the fact that would kill it.</li>
 <li><b>Sunk cost</b>: "We have put three months into it." The three months are gone either way. Would you start it today?</li>
 <li><b>Anchoring</b>: the first number in the room pulls every later one. Estimate before you hear others.</li>
 <li><b>Authority</b>: a senior person or a confident model can be wrong. Check the argument, not the title.</li></ul>
 ${job('The most useful sentence in a meeting: "How do we know that?" Said kindly, it saves projects. The second most useful: "What would we see if we were wrong?"')}`,
 key:['Claimed what, known how, compared with what, said by whom.','Split averages. Ask how common. Ask who is missing.','Fluent is not correct. Verify one detail, run the code.'],
 do:['Take one statistic from this week\'s news or a vendor page and ask the five questions.','Ask an AI assistant a factual question in your field, then verify two details from primary sources.'],links:[['Calling Bullshit (free course material)','https://callingbullshit.org/']],
 ex:[
 {t:'mcq',q:'"Teams that use tool X ship faster." What is the first critical question?',o:['Did faster teams choose tool X, or did tool X make them faster?','Is the logo nice?','How old is the tool?'],a:0,w:'Correlation or cause.'},
 {t:'mcq',q:'A detector for a fault that occurs in 1 of 1,000 trays is right 95 % of the time. It raises an alarm. How likely is a real fault?',o:['Low: about 2 %','95 %','100 %'],a:0,w:'In 1,000 trays: about 1 true alarm and about 50 false ones. Base rate matters.'},
 {t:'mcq',q:'The average hatch rate went up, but it went down in every single hatchery. How is that possible?',o:['The mix changed: more eggs now go to the better hatcheries','It is not possible','A rounding error'],a:0,w:'Always split an average by group.'},
 {t:'mcq',q:'An assistant gives you a statistic with a source link. What do you do before using it?',o:['Open the source and check that it says this','Trust it, there is a link','Ask it again'],a:0,w:'Citations can be invented or misread.'},
 {t:'mcq',q:'"We already spent three months on this approach, so we must continue." Which trap is this?',o:['Sunk cost','Base rate','Survivorship'],a:0,w:'The question is only: would we start it today?'}]},

{id:'C8',min:40,t:'System design: thinking in boxes and arrows',sum:'The interview that decides senior roles, and a habit for real work',
 body:`<p>In a system design interview you get one sentence, such as "Design a question-answering service over company documents", and 40 minutes. Nobody expects the perfect answer. They watch <b>how you think</b>. The same steps work for real projects.</p>
 <h4>The six steps</h4>
 <ol><li><b>Ask what is needed.</b> Who uses it, how many, how fast must it answer, how fresh must data be, what happens if it is wrong, what is the budget?</li>
 <li><b>Estimate the size.</b> Requests per second, data volume, cost per request. Rough numbers, out loud.</li>
 <li><b>Draw the simple version.</b> Five to seven boxes: client, API, storage, the processing in between.</li>
 <li><b>Walk one request through it</b>, from click to answer. Then walk the data through it, from source to store.</li>
 <li><b>Find the weak points.</b> What is slow? What fails? What costs the most? What grows?</li>
 <li><b>Improve only those points</b>, and name the price of each improvement.</li></ol>
 <h4>The building blocks</h4>
 ${tbl(['Block','Use it when','Price'],[
  ['<b>Cache</b>','The same answer is needed often and may be a little old','Stale data. When do you clear it?'],
  ['<b>Queue</b>','Work can be done later, or arrives in bursts','The caller does not get the result at once'],
  ['<b>Background worker</b>','A job takes longer than a web request should','You need status and retry handling'],
  ['<b>More copies</b> (horizontal scaling)','One machine is not enough, and requests do not depend on each other','The service must keep no state in memory'],
  ['<b>Read replica</b>','Many reads, few writes','Replicas lag a little'],
  ['<b>Index</b>','A query filters or sorts on a column','Slower writes, more storage'],
  ['<b>Batch job</b>','Results are needed daily, not live','Not fresh'],
  ['<b>Rate limit</b>','One user or bug could use up everything','Some requests are refused']])}
 <h4>Trade-offs you will be asked about</h4>
 <ul><li><b>Fresh or fast?</b> A cache makes it fast and a little old.</li><li><b>Simple or scalable?</b> One Postgres is simple. Start there. Say at what size you would change.</li><li><b>Now or later?</b> Answering in the request, or accepting the job and answering later.</li><li><b>Build or buy?</b> A managed service costs money and saves months.</li><li><b>Correct or available?</b> When a part is down: show an error, or show old data?</li></ul>
 <h4>Worked example: document Q&A for 2,000 employees</h4>
 ${txt`1 Needs       2,000 users, ~10 questions per user per day, answer starts within 3 s, documents change daily,
              users may only see documents of their department, wrong answers are annoying but not dangerous.
2 Size        20,000 questions/day ≈ 1 per second at peak.  200,000 chunks.  ~3,500 tokens in, 300 out per question.
3 Simple      browser → API (FastAPI, 2 copies) → Postgres + pgvector (chunks, permissions, logs) → model API
              nightly ingestion job: changed documents → chunk → embed → upsert
4 Walk        question → auth → hybrid search with permission filter → build prompt → stream answer → log trace
5 Weak        model API down or slow.  Cost.  Stale index after a document change.  Permission mistakes.
6 Improve     timeout + fallback model + clear error.  Prompt caching, small model for query rewriting.
              ingestion triggered on change, not only nightly.  Permission filter tested in CI with fake users.
              NOT needed at this size: Kubernetes, a separate vector database, a queue.`}
 <p>The last line matters most. Saying what you would <b>not</b> build, and at what size you would change your mind, is what separates experienced answers from impressive-sounding ones.</p>
 <h4>For data platforms, ask these as well</h4>
 <ul><li>What is the <b>grain</b> and the <b>key</b> of each table?</li><li>How is a failed run <b>repeated</b> safely? How is history <b>backfilled</b>?</li><li>How do schema changes in the source arrive, and who is told?</li><li>Who owns each data set, and how is its quality checked?</li></ul>`,
 key:['Needs, size, simple drawing, walk a request, weak points, targeted fixes.','Every improvement has a price. Name it.','Say what you would not build yet.'],
 do:['Design on paper, in 30 minutes: "A service that reads delivery-note photos and writes rows into a database, 500 notes per day."','Explain your drawing to somebody, or record yourself. Speaking it is the skill.'],links:[['The System Design Primer (free)','https://github.com/donnemartin/system-design-primer'],['Designing Data-Intensive Applications (book)','https://dataintensive.net/']],
 ex:[
 {t:'order',q:'Order the steps of a system design answer.',items:['Ask what is needed','Estimate the size','Draw the simple version','Walk one request through','Find the weak points','Improve those points'],w:'Requirements before boxes.'},
 {t:'mcq',q:'A report generation takes 90 seconds. Users click and wait. What is the usual design?',o:['Accept the request, do the work in a background worker, let the user fetch the result','Make the web request wait 90 seconds','Add a cache only'],a:0,w:'Queue plus worker, with a status.'},
 {t:'mcq',q:'What is the price of a cache?',o:['Answers can be out of date','It uses no memory','Nothing'],a:0,w:'Decide how old is acceptable and when to clear it.'},
 {t:'mcq',q:'For 1 request per second and 200,000 chunks, the interviewer asks about Kubernetes and a vector database cluster. What is a strong answer?',o:['"Not at this size. Two containers and one Postgres are enough. I would change at around ..."','"Yes, we need both, to be safe."','"I do not know them."'],a:0,w:'Match the design to the numbers.'},
 {t:'mcq',q:'What must be true before you run more copies of a service behind a load balancer?',o:['The service keeps no user state in its own memory','It uses more CPU','It is written in Go'],a:0,w:'State goes into a database or cache, so any copy can answer.'}]},

{id:'C9',min:30,t:'Saying it clearly: writing and talking for engineers',sum:'Few words, at the right time',
 body:`<p>Even in a role with little customer contact, your work only counts when others understand it. The good news: engineering communication is mostly <b>writing</b>, and writing follows rules you can learn.</p>
 <h4>Answer first</h4>
 <p>Put the conclusion in the first sentence. Then the reasons. Then details for those who want them. People read the first two lines of everything.</p>
 ${tbl(['Weak','Strong'],[
  ['"I looked at the logs and saw that at 02:14 the connection ... (eight more lines) ... so the load failed."','"Last night\'s load failed because the source database was restarted. It is rerun and correct since 07:50. I added retries so a short outage no longer breaks it."']])}
 <h4>A status update in four lines</h4>
 ${txt`Done:     ingestion and retrieval work. 24 of 30 test questions correct.
Next:     fix the two date bugs, add the permission filter (Thursday).
Blocked:  I need read access to system Z for four of the questions.
Decision: add system Z to the scope? About three more days.`}
 <h4>Asking a question that gets answered</h4>
 <ol><li>What you want to achieve.</li><li>What you did, with the exact command or code.</li><li>What you expected, and what happened, with the exact error.</li><li>What you already tried.</li></ol>
 <p>A question in this form often answers itself while you write it.</p>
 <h4>Saying no, with options</h4>
 <p>"No" alone stops the talk. Offer a choice and let the other person decide: "By Friday I can deliver A and B. C needs three more days. Shall I move the date, or leave C for the next version?"</p>
 <h4>The one-page design note</h4>
 ${txt`Title, author, date, status
Problem        two to three sentences. Who has it, what does it cost?
Goal           what is true when we are done? What is NOT a goal?
Proposal       a picture and ten lines.
Alternatives   two other ways, and why not.
Risks          what could go wrong, and how we would notice.
Open questions`}
 <p>Write this before any work that takes more than a week. It costs an hour and often saves the week.</p>
 <h4>In meetings</h4>
 <ul><li>Go in knowing the one thing you need from it.</li><li>If something is unclear, ask at once: "To be sure I understood: you need X by Y, correct?"</li><li>End with: who does what by when. Write it into the chat.</li></ul>
 <h4>Reviewing other people's code</h4>
 <ul><li>Ask, do not order: "What happens here when the list is empty?"</li><li>Mark what is optional: "Small thing, not blocking: ..."</li><li>Say what is good.</li><li>When your own code is reviewed: thank, fix or explain, never defend.</li></ul>`,
 know:'A status update is a small report: the number first, the breakdown after. You have built those for years.',
 key:['Conclusion first.','Done, next, blocked, decision.','No with options. End with who, what, when.'],
 do:['Rewrite your last long message so that the first sentence is the conclusion.','Send your next status update in the four-line form.','Write a one-page design note for portfolio project 2.'],links:[],
 ex:[
 {t:'mcq',q:'What belongs in the first sentence of a message to your lead?',o:['The conclusion or the decision you need','The history of the problem','A greeting of three lines'],a:0,w:'Answer first.'},
 {t:'order',q:'Order a good technical question.',items:['What I want to achieve','What I did','What I expected and what happened','What I already tried'],w:'Goal, action, result, attempts.'},
 {t:'mcq',q:'You cannot deliver everything by Friday. What do you say?',o:['"A and B by Friday. C needs three more days. Move the date, or drop C for now?"','"No."','Nothing, and deliver late'],a:0,w:'Options, and let them choose.'},
 {t:'mcq',q:'Which review comment is best?',o:['"What happens here if the file is empty?"','"This is wrong."','"Why would anyone write this?"'],a:0,w:'A question about the code, not a verdict on the person.'}]},

{id:'C10',min:25,t:'From wish to requirement: working with the people who ask',sum:'A short consulting toolkit, and a simulation',
 body:`<p>Every engineer gets requests from people who do not know the technology. The skill of turning a vague wish into something buildable is what companies mean by "consulting skills". You need it inside a company too.</p>
 ${W('scenario','client')}
 <h4>Questions that find the real need</h4>
 <ul><li>"What should be easier or different when this is done?"</li><li>"How do you do it today? Can you show me?"</li><li>"Can you give me five real examples?"</li><li>"Who will use it, and how often?"</li><li>"What happens if the answer is wrong?"</li><li>"How will we know that it works? Which number?"</li><li>"What is the most important part, if we can only do one?"</li></ul>
 <h4>Scope: write down what is in, and what is out</h4>
 ${txt`In scope:      questions about prices and delivery dates, from systems A and B, for the sales team (12 users).
Out of scope:  system Z, changing data, other departments, a mobile app.
Done when:     27 of 30 agreed test questions are answered correctly, and answers start within 5 seconds.`}
 <p>Three lines like these, agreed in writing, prevent most project conflicts. When somebody asks for more later, it is a new decision with a new estimate, not a failure of yours.</p>
 <h4>The smallest useful version</h4>
 <p>Build the smallest thing that is already useful to a real user, show it within one to two weeks, and learn from the reaction. People cannot tell you what they need. They can tell you what is wrong with what they see.</p>
 <h4>Three habits that build trust</h4>
 <ol><li><b>Write down what was agreed</b>, right after the talk, in three sentences.</li><li><b>Report early</b> when a date is at risk.</li><li><b>Show numbers</b>, also the bad ones.</li></ol>`,
 key:['Problem before solution. Ask for real examples.','In scope, out of scope, done when.','Small version early. Honest numbers.'],
 do:['Play the simulation until you reach the top score.','Write the three scope lines for something you are asked to do this week.'],links:[],
 ex:[
 {t:'mcq',q:'A manager asks for "an AI agent for the warehouse". What is the best first question?',o:['"What should be easier when it exists, and for whom?"','"Which framework do you want?"','"Is next week OK?"'],a:0,w:'Find the problem behind the solution.'},
 {t:'mcq',q:'Why ask for five real examples?',o:['They show what is really needed and become the first tests','To gain time','They are not useful'],a:0,w:'Examples turn a wish into a test set.'},
 {t:'mcq',q:'Mid-project, the requester wants a new data source added. What is right?',o:['Treat it as a new decision: effect on date and cost, then they choose','Add it silently','Refuse'],a:0,w:'Scope changes are choices, with a price.'}]},

{id:'C11',sec:'Get the job',min:35,t:'CV, GitHub and applying in Germany',sum:'How to get from "BI developer" to an interview',
 body:`<h4>Tell the story as a line, not a jump</h4>
 <p>You are not starting from zero. Write it like this: <i>"BI developer with X years of SQL, data modelling and production data pipelines, now building data and AI systems in Python."</i> Everything in the CV supports this sentence.</p>
 <h4>The CV</h4>
 <ul><li><b>Two pages.</b> In Germany a clear table form is normal: time on the left, role and results on the right. A photo is common but not required.</li>
 <li><b>Top block:</b> name, target role, three lines of profile, links to GitHub and LinkedIn.</li>
 <li><b>A "Projects" section above the work history</b>, with the three portfolio projects: one line what, one line stack, one number, link.</li>
 <li><b>Results, not duties.</b> Not "responsible for ETL". Write "Rebuilt the nightly load as incremental, runtime from 3 hours to 25 minutes".</li>
 <li><b>Translate your experience</b> into the words of the ads: SSIS → "orchestrated ETL pipelines", cube → "dimensional models and semantic layer", report server → "served 200 users".</li>
 <li><b>Skills block</b> by group: languages, data, cloud and infrastructure, AI. Only what you can discuss for ten minutes.</li>
 <li><b>Languages</b> with levels: German B1 (exam date), English C1.</li></ul>
 <h4>GitHub and LinkedIn</h4>
 <ul><li>Pin the three projects. A short profile text with your target role.</li><li>LinkedIn headline: the target, not the past. "Data &amp; AI Engineer | Python, SQL, RAG, MLOps".</li><li>Switch on "open to work" for recruiters. In Germany, also create a <b>Xing</b> profile for mid-sized companies.</li></ul>
 <h4>Where to look</h4>
 ${tbl(['Place','Good for'],[['LinkedIn, StepStone, Indeed','The broad market'],['Company career pages','Product companies you chose yourself'],['Berlin Startup Jobs, Honeypot-style platforms','English-speaking tech teams'],['Meetups and user groups (PyData, MLOps, cloud groups)','People who can refer you. A referral is the most effective way in'],['Recruiters','Useful once your profile shows the new direction']])}
 <p>Search for these titles: Data Engineer, Analytics Engineer, Data Platform Engineer, AI Engineer, Machine Learning Engineer, MLOps Engineer, AI Platform Engineer, Backend Engineer (Python). <b>Analytics Engineer</b> (SQL, dbt, modelling) is often the easiest first step for BI people, and a good bridge into the others.</p>
 <h4>The application</h4>
 <ul><li>A short cover text of five sentences: the role, why this company, your two strongest proofs with links, when you can start.</li><li>Answer the ad's must-haves in its own words.</li><li>Apply when you match about 60 % of the list. Lists are wishes.</li><li>Track every application in a table: date, company, status, next step.</li><li>Expect many refusals and silences. Ten applications a month over several months is a normal campaign.</li></ul>
 <h4>Practical points in Germany</h4>
 <ul><li><b>Notice periods</b> are long, often three months to the end of a month. Check your contract and say the date clearly.</li><li><b>Work and residence permit:</b> if your permit is tied to your employer or to a salary level, check the rules before you sign. The official site Make it in Germany and your Ausländerbehörde are the reliable sources. Salary thresholds change every year.</li><li><b>German:</b> English is enough for many tech teams in big cities. For most mid-sized companies, B1 to B2 German opens far more doors. Your German line is part of your career plan.</li><li><b>Salary:</b> they will ask for your expectation as a yearly gross figure. Prepare a range with a reason.</li></ul>`,
 key:['A line, not a jump: your past is the base of the new role.','Projects above work history. Results, not duties.','Apply at 60 % match. Track everything.'],
 do:['Rewrite your profile sentence and your last three jobs as results with numbers.','Make a list of 20 target companies.','Go to one meetup this quarter.'],links:[['Make it in Germany (official)','https://www.make-it-in-germany.com/en/'],['Europass CV (accepted format)','https://europass.europa.eu/en/create-europass-cv']],
 ex:[
 {t:'mcq',q:'Which CV line is strongest?',o:['"Rebuilt the nightly load as incremental: runtime from 3 hours to 25 minutes"','"Responsible for ETL processes"','"Team player with passion for data"'],a:0,w:'A result with a number.'},
 {t:'mcq',q:'You match 6 of 10 listed requirements. Should you apply?',o:['Yes','No'],a:0,w:'Requirement lists are wish lists.'},
 {t:'mcq',q:'Which job title is often the easiest first step out of BI?',o:['Analytics Engineer','Research Scientist','Kernel Developer'],a:0,w:'SQL, dbt and modelling, close to what you know.'}]},

{id:'C12',min:40,t:'Interviews',sum:'The five types, and how to prepare for each',
 body:`${tbl(['Type','What they test','How to prepare'],[
  ['<b>Recruiter call</b>','Motivation, language, salary, start date','Your story in 90 seconds. A salary range. Three questions about the company'],
  ['<b>Technical talk</b>','Do you understand what is in your CV?','Be able to explain every project and every tool in it, including what went wrong'],
  ['<b>Coding</b>','Can you write clean, working code and think out loud?','Python and SQL exercises, 30 minutes a day for a month'],
  ['<b>System design</b>','Structure, trade-offs','The six steps from the system design station, practised out loud'],
  ['<b>Behaviour</b>','How you work with people','Six prepared stories']])}
 <h4>Your story in 90 seconds</h4>
 <p><b>Past</b> (what you did and are good at), <b>turning point</b> (why AI and data engineering), <b>proof</b> (what you built), <b>future</b> (why this role). Practise it out loud, in English and in German.</p>
 <h4>Coding</h4>
 <ul><li><b>Say what you think.</b> Silence is the worst answer.</li><li>Repeat the task, ask about edge cases, then describe your plan before you type.</li><li>Start simple and correct. Improve afterwards.</li><li>Test with a small example at the end.</li></ul>
 ${py`# typical: "find the second-highest hatch rate per hatchery"
from collections import defaultdict
def second_best(rows: list[dict]) -> dict[str, float | None]:
    by = defaultdict(set)
    for r in rows:
        by[r["hatchery"]].add(r["rate"])
    return {h: (sorted(v)[-2] if len(v) > 1 else None) for h, v in by.items()}`}
 <p>SQL questions will feel easy to you: window functions, top N per group, gaps in dates, finding duplicates. Use that. Many candidates are weak there.</p>
 <h4>Questions you should be able to answer</h4>
 ${more('Data engineering','<ul><li>Explain a slowly changing dimension of type 2.</li><li>How do you make a load idempotent?</li><li>What is the difference between ETL and ELT?</li><li>A join returns more rows than expected. Why, and how do you find it?</li><li>Batch or streaming: how do you decide?</li><li>How do you test a data pipeline?</li><li>What is a partition, and when does partitioning hurt?</li></ul>')}
 ${more('AI engineering','<ul><li>Explain RAG to a manager, then to an engineer.</li><li>Your RAG answers are bad. How do you debug it?</li><li>How do you evaluate a system whose output is free text?</li><li>When would you fine-tune, and when not?</li><li>What is prompt injection, and how do you limit the damage?</li><li>How do you reduce the cost of an LLM feature by half?</li><li>Agent or workflow: how do you choose?</li><li>What is an embedding?</li></ul>')}
 ${more('Platform and MLOps','<ul><li>What is the difference between an image and a container?</li><li>What does a Kubernetes Deployment do? How do you debug a pod that does not start?</li><li>What is Terraform state, and where do you keep it?</li><li>Describe a CI/CD pipeline you built.</li><li>What is drift, and how do you notice it?</li><li>How do you roll out a new model safely?</li><li>Which metrics do you put on a dashboard for a model service?</li></ul>')}
 <h4>Behaviour questions: six stories in the STAR form</h4>
 <p><b>S</b>ituation, <b>T</b>ask, <b>A</b>ction (what <i>you</i> did), <b>R</b>esult (with a number, and what you learned). Prepare one story each for: a difficult bug, a mistake you made, a conflict, a deadline at risk, something you taught yourself, something you improved without being asked. Two minutes each.</p>
 <h4>The questions that worry career changers</h4>
 <ul><li><b>"You have no professional experience in this."</b> – "Correct for the job title. Here is what I built and run: ... And I bring X years of production data work, which is where most AI projects have their problems."</li>
 <li><b>"Why are you leaving BI?"</b> – Towards something, never away from something. "I want to build the systems, not only report on them."</li>
 <li><b>"Where are your gaps?"</b> – Name one real gap and what you are doing about it.</li></ul>
 <h4>Your questions to them</h4>
 <ul><li>"What does the first project for this role look like?"</li><li>"How does code get from a laptop to production here?"</li><li>"How do you measure whether your AI features work?"</li><li>"Who would I learn from?"</li></ul>
 <p>The answers also tell you whether you want to work there.</p>
 <h4>Salary</h4>
 <p>Give a range whose lower end you would accept, with a reason: "Based on the role and the market in this city, 68,000 to 75,000 €." Let them answer. The first offer is usually not the last. Ask about training budget, remote days and the review date for the next rise.</p>`,
 key:['Story in 90 seconds: past, turning point, proof, future.','Think out loud. Simple and correct first.','Six STAR stories. Towards, not away.'],
 do:['Write and record your 90-second story in English, then in German.','Answer five of the questions above out loud, and record yourself.','Write the six STAR stories as bullet points.','Do one mock interview with a friend or with the tutor.'],links:[['LeetCode: SQL and Python practice','https://leetcode.com/studyplan/'],['Exercism','https://exercism.org/']],
 ex:[
 {t:'order',q:'Order the STAR form.',items:['Situation','Task','Action','Result'],w:'And say what you learned.'},
 {t:'mcq',q:'In a coding interview you do not know the answer at once. What do you do?',o:['Think out loud: repeat the task, ask about edge cases, start with a simple version','Stay silent for five minutes','Say "I cannot do this"'],a:0,w:'They are hiring your thinking.'},
 {t:'mcq',q:'"Why do you want to leave BI?" Which answer is best?',o:['"I want to build the systems that produce and use the data, and I have started: here is what I built."','"BI is boring and my boss is bad."','"For the money."'],a:0,w:'Towards something, with proof.'},
 {t:'mcq',q:'Asked for your salary expectation, you say:',o:['A range with a reason','"Whatever you think"','An exact number far above the market'],a:0,w:'A range whose lower end you would accept.'}]},

{id:'C13',min:20,t:'Learning how to learn',sum:'So that the next new tool takes weeks, not months',
 body:`<p>The field will look different in two years. The one skill that never ages is learning fast. Science knows quite well what works.</p>
 ${tbl(['Works','Why','On this site'],[
  ['<b>Recall, not re-reading</b>','Pulling an answer out of memory makes it stay. Reading again only feels like learning','The questions in every station. The Train page'],
  ['<b>Spacing</b>','Five short sessions over two weeks beat one long session','Flashcards that come back when they are due'],
  ['<b>Doing</b>','You learn tools by using them on a real task','The "do it" lists and the projects'],
  ['<b>Explaining</b>','If you cannot explain it simply, you have not understood it yet','Tell the tutor, a colleague or your notes'],
  ['<b>Mixing</b>','Switching between topics feels harder and works better','Different lines on different days'],
  ['<b>Sleep</b>','Memory is built at night','One rest day a week']])}
 <h4>Learning a new tool in a week</h4>
 <ol><li>Read the official "getting started" page, nothing else.</li><li>Build the smallest thing that works, by hand.</li><li>Break it on purpose and read the errors.</li><li>Use it for one real task of your own.</li><li>Write half a page: what it is for, when not to use it, three commands, one trap.</li></ol>
 <h4>Learning with an AI assistant</h4>
 <ul><li>Ask it to <b>question you</b>, not to tell you: "Ask me five questions about Kubernetes deployments and correct my answers."</li><li>Ask for the <b>idea first</b>, then the detail: "Explain it as if to a SQL developer."</li><li>Ask "<b>why not</b> the other way?" It forces a comparison.</li><li>Do the exercise yourself <b>before</b> you ask for the solution.</li><li>Check what it says about fast-moving tools against the official documentation.</li></ul>
 <h4>Staying up to date without drowning</h4>
 <p>You cannot read everything. Choose two sources and one fixed hour a week. The "This week" page here gives you a few items in simple words. Go deep only on things that touch your work or your next project. Most news does not matter in six months. The basics on this site will.</p>`,
 key:['Recall and spacing beat re-reading.','New tool: start page, smallest thing, break it, real task, half a page of notes.','Let the assistant question you.'],
 do:['Use the Train page for five minutes every day.','Learn one small tool this month with the five steps, and write the half page.'],links:[['Learning How to Learn (free course)','https://www.coursera.org/learn/learning-how-to-learn']],
 ex:[
 {t:'mcq',q:'Which is the most effective way to remember a topic?',o:['Close the page and try to recall it, several times over days','Read it three times in one evening','Highlight the text'],a:0,w:'Recall plus spacing.'},
 {t:'mcq',q:'How do you use an AI assistant best for learning?',o:['Let it ask you questions and correct your answers','Let it write everything for you','Never use it'],a:0,w:'Active beats passive.'}]}
]};

// Glossary: term, plain meaning, line letter
window.GLOSS.push(
['Agent','A model that works in a loop: think, use a tool, look at the result, repeat.','K'],
['API','A door through which programs use another program, usually over HTTP with JSON.','E'],
['Batch / streaming','Process data in blocks on a schedule, or event by event all the time.','P'],
['Checkpoint (streaming)','A folder where a streaming job notes how far it has read.','P'],
['Checkpoint (model)','The saved weights of a model.','K'],
['CI / CD','Every change is built and tested automatically (CI) and delivered the same way every time (CD).','E'],
['Chunk','A piece of a document, small enough to search and to put into a prompt.','K'],
['Container','A running copy of an image: your program with everything it needs, isolated.','E'],
['Context window','How much text a model can look at in one go.','K'],
['DAG','A plan of steps where the arrows never go in a circle.','P'],
['dbt','A tool that turns SQL files into tested, documented tables in the right order.','P'],
['Delta / Iceberg','Table formats that add transactions and history to files in a data lake.','P'],
['Dimension / fact','Tables with the words you filter by, and tables with the numbers you add up.','P'],
['Docker image','A read-only package of a program and its environment.','E'],
['Drift','The live data no longer looks like the training data, so the model gets worse.','K'],
['ELT','Load raw data first, transform it inside the warehouse.','P'],
['Embedding','A list of numbers that stands for the meaning of a text or image.','K'],
['Epoch','One pass through all training data.','K'],
['Evaluation set (evals)','Fixed test questions with expected answers, run after every change.','K'],
['Fine-tuning','Training an existing model a little more on your own examples.','K'],
['Gradient descent','Improving a model step by step by moving its weights in the direction that lowers the error.','K'],
['Grain','What exactly one row of a table stands for.','P'],
['Hallucination','A model writes something that sounds right and is false.','K'],
['Hybrid search','Search by meaning and by exact words together.','K'],
['Idempotent','Running it twice gives the same result as running it once.','P'],
['Inference','Using a trained model to get a prediction or an answer.','K'],
['Infrastructure as code','Cloud resources are described in files and created by a tool.','E'],
['Kubernetes','A system that runs containers on many machines and keeps the wanted number alive.','E'],
['Latency (p95)','How long a request takes. p95: 95 % of requests are faster than this.','E'],
['LoRA','A cheap way to fine-tune: only a small add-on set of weights is trained.','K'],
['MCP','Model Context Protocol: a standard plug between assistants and tools.','K'],
['MECE','Parts that do not overlap and together cover everything.','C'],
['MERGE / upsert','One statement that updates existing rows and inserts new ones.','P'],
['MLflow','A tool that records training runs and stores versioned models.','K'],
['MLOps / LLMOps','Running machine learning models, or language model features, reliably in production.','K'],
['Overfitting','A model learned its examples by heart and fails on new data.','K'],
['Orchestration','Running steps in the right order, with schedules, retries and alerts.','P'],
['Precision / recall','Of what I flagged, how much was right. Of what was there, how much I found.','K'],
['Prompt caching','Paying less for the fixed start of a prompt when it repeats.','K'],
['Prompt injection','Instructions hidden in data that try to make a model do something else.','K'],
['Pull request','A request to merge your branch, with a review by a colleague.','E'],
['RAG','Find the right text first, then let the model answer with it.','K'],
['Reranking','A second model reorders search results by reading question and text together.','K'],
['SLO','An agreed target for a service, such as "99 % of answers within 5 seconds".','E'],
['Structured output','A model answer that is forced into a fixed data shape.','K'],
['Terraform state','Terraform\'s memory of what it created. Shared, locked, secret.','E'],
['Token','A word or a piece of a word. Models read and are billed in tokens.','K'],
['Trace','The record of one request through all steps, with timings.','E'],
['Transfer learning','Reusing a pre-trained model and retraining a small part on your data.','K'],
['Vector database','A store that finds the embeddings nearest to a query.','K'],
['Watermark','Batch: the last value you loaded. Streaming: how long to wait for late events.','P'],
['YAML','A text format with indentation, used for pipelines and configuration.','E']);
})();
