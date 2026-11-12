// All lesson content. Simple English on purpose.
(function(){
const D=(g,e)=>`<div class="de"><span lang="de">${g}</span><button class="say" type="button" data-say="${g.replace(/"/g,'&quot;')}" aria-label="Listen">&#9654;</button><span class="en">${e}</span></div>`;
const yt=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q);
const L={
  exam:'https://learn.microsoft.com/en-us/credentials/certifications/exams/dp-700',
  guide:'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700',
  labs:'https://microsoftlearning.github.io/mslearn-fabric/',
  fabric:'https://app.fabric.microsoft.com',
  docs:'https://learn.microsoft.com/en-us/fabric/'
};

window.TRACKS={
fabric:{c:'f',letter:'F',name:'Microsoft Fabric',goal:'Build real data pipelines in Fabric and pass DP-700',
intro:'Fabric is Microsoft\'s one platform for data. You already know the old tools (SQL Server, SSIS, SSAS). Here you learn the new names for the same jobs, then you build them.',
stations:[
{id:'F1',t:'What is Fabric? OneLake and workspaces',sum:'The big picture in 10 minutes',widget:'flow',
 body:`<p>Fabric is one website where your whole data work lives: loading data, storing it, cleaning it, and showing it in reports.</p>
 <p><b>OneLake</b> is the storage under everything. Think of it as one big hard disk for the whole company. Every team saves its data there, so nobody copies files around.</p>
 <p>A <b>workspace</b> is a folder for one team or one project. Inside a workspace you create <b>items</b>: a lakehouse, a pipeline, a notebook, a report.</p>
 <p>A <b>capacity</b> is the computing power you pay for. More capacity means more work at the same time.</p>
 <p>Click each box below to see what it does.</p>`,
 know:'Imagine SQL Server, SSIS, SSAS and the report server in one building with one login. That is Fabric.',
 do:['Open Fabric and start the free trial. Start it only when you are ready for labs, because the trial has a time limit.','Create a workspace called <code>tori-lab</code>.','Create a lakehouse called <code>hatchery</code> inside it.','Look at the two folders it has: Files and Tables.'],
 links:[['Open Fabric',L.fabric],['Fabric documentation',L.docs],['Free hands-on labs',L.labs],['Video: Fabric for beginners',yt('Microsoft Fabric Tutorial for Beginners full course')]],
 ex:[
 {t:'mcq',q:'What is OneLake?',o:['One storage place for all Fabric data in the company','A tool to draw reports','A programming language'],a:0,w:'OneLake is the single storage layer. Every lakehouse and warehouse saves its data there.'},
 {t:'mcq',q:'What is a workspace?',o:['A virtual machine','A container for items such as lakehouses, pipelines and reports','A type of table'],a:1,w:'A workspace holds the items of one team or project and controls who can see them.'}]},

{id:'F2',t:'Lakehouse and Delta tables',sum:'Files and tables in one place',
 body:`<p>A <b>lakehouse</b> stores data in two ways. The <b>Files</b> folder holds raw files like CSV or JSON. The <b>Tables</b> folder holds tables you can query with SQL.</p>
 <p>The tables use the <b>Delta</b> format. A Delta table is a set of Parquet files plus a small log. The log remembers every change. Because of the log you can undo mistakes and look at old versions. This is called <b>time travel</b>.</p>
 <p>Every lakehouse also gets a <b>SQL analytics endpoint</b>. With it you read the tables using normal T-SQL. It is read-only.</p>`,
 know:'A lakehouse is like a database where the tables are files in a data lake. The SQL endpoint feels like SSMS on a read-only database.',
 do:['Upload a small CSV file to the Files folder.','Right-click the file and choose "Load to Tables".','Open the SQL analytics endpoint and run <code>SELECT TOP 10 * FROM your_table</code>.','In a notebook run <code>DESCRIBE HISTORY your_table</code> and read the log.'],
 links:[['Docs: Data engineering in Fabric','https://learn.microsoft.com/en-us/fabric/data-engineering/'],['Labs',L.labs]],
 ex:[
 {t:'mcq',q:'What is a Delta table made of?',o:['One big CSV file','Parquet files plus a transaction log','An Excel workbook'],a:1,w:'The log is what gives Delta its safety and time travel.'},
 {t:'fill',q:'In a lakehouse, the ___ folder holds raw files such as CSV.',a:['files'],w:'Files = raw files. Tables = Delta tables.'},
 {t:'mcq',q:'You need to change rows with UPDATE through the lakehouse SQL analytics endpoint. Does it work?',o:['Yes','No, the endpoint is read-only'],a:1,w:'Use Spark or a warehouse when you need to write.'}]},

{id:'F3',t:'Pipelines: move data on a schedule',sum:'The new SSIS control flow',
 body:`<p>A <b>pipeline</b> is a list of steps that run in order. Each step is an <b>activity</b>. The most used one is <b>Copy data</b>: take data from a source and put it in a destination.</p>
 <p>Other activities start a notebook, start a dataflow, or run a stored procedure. You can add <b>parameters</b> so one pipeline works for many tables. You can run a pipeline on a <b>schedule</b> or when an <b>event</b> happens, for example when a new file arrives.</p>`,
 know:'A pipeline is the SSIS control flow plus the SQL Agent schedule. Copy data is your data flow task for simple copies.',
 do:['Create a pipeline in your workspace.','Add a Copy data activity. Source: a sample dataset. Destination: your lakehouse table.','Run it and watch the output tab.','Add a schedule: every day at 02:00.'],
 links:[['Docs: Data Factory in Fabric','https://learn.microsoft.com/en-us/fabric/data-factory/'],['Labs',L.labs]],
 ex:[
 {t:'order',q:'Put the steps in the right order to build a copy pipeline.',items:['Create the pipeline','Add a Copy data activity','Choose the source','Choose the destination','Run and check the result','Add a schedule'],w:'First build and test by hand. Schedule only when it works.'},
 {t:'mcq',q:'One pipeline should load 30 different tables. What do you use?',o:['30 copies of the pipeline','Parameters and a loop (ForEach)','A bigger capacity'],a:1,w:'Parameters keep one pipeline reusable.'}]},

{id:'F4',t:'Dataflow Gen2: clean data without code',sum:'Power Query in the cloud',
 body:`<p>A <b>Dataflow Gen2</b> uses Power Query, the same tool as in Excel and Power BI. You click to filter rows, rename columns and join tables. No code needed.</p>
 <p>Fabric gives you three ways to transform data. Pick by the person and the size:</p>
 <ul><li><b>Dataflow Gen2</b>: small or medium data, people who like clicking.</li><li><b>Notebook (Spark)</b>: big data or complex logic, people who write Python.</li><li><b>T-SQL</b>: data already in a warehouse, people who write SQL.</li></ul>`,
 know:'Dataflow Gen2 is like the SSIS data flow, but you build it in Power Query.',
 do:['Create a Dataflow Gen2.','Load a CSV, remove empty rows, change a column type.','Set the destination to a lakehouse table and publish.'],
 links:[['Docs: Data Factory in Fabric','https://learn.microsoft.com/en-us/fabric/data-factory/']],
 ex:[
 {t:'mcq',q:'An analyst who knows Excel must clean a small file every week. Best tool?',o:['Dataflow Gen2','Spark notebook','KQL queryset'],a:0,w:'Low code and small data: Dataflow Gen2.'},
 {t:'mcq',q:'200 million rows and complex Python logic. Best tool?',o:['Dataflow Gen2','Spark notebook','Excel'],a:1,w:'Spark spreads the work over many machines.'}]},

{id:'F5',t:'Notebooks and PySpark',sum:'Transform big data with code',
 body:`<p>A <b>notebook</b> is a page with code cells. You run a cell and see the result under it. The engine is <b>Spark</b>, which splits big work across many machines.</p>
 <p>In PySpark you work with a <b>DataFrame</b>. It is a table in memory. The pattern is always the same: <b>read, change, write</b>.</p>
 <pre><code># read
df = spark.read.format("csv").option("header","true").load("Files/raw/hatch.csv")

# change
from pyspark.sql.functions import col
df = df.dropDuplicates().filter(col("eggs_set") > 0)

# write as a Delta table
df.write.mode("overwrite").saveAsTable("hatch_silver")</code></pre>
 <p>The same idea in three languages. You need to read all three for the exam and for real work:</p>
 <pre><code>-- T-SQL
SELECT hatchery, SUM(hatched) AS hatched FROM hatch_silver GROUP BY hatchery;

# PySpark
df.groupBy("hatchery").sum("hatched")

// KQL
hatch_silver | summarize hatched = sum(hatched) by hatchery</code></pre>`,
 know:'A notebook does the job of an SSIS script task and a stored procedure, but on much bigger data.',
 do:['Create a notebook and attach your lakehouse.','Read your CSV into a DataFrame and run <code>display(df)</code>.','Remove duplicates, then save it as the table <code>hatch_silver</code>.','Write the GROUP BY above in PySpark and in SQL (<code>%%sql</code> cell). Compare.'],
 links:[['Labs',L.labs],['Video: DP-700 full course (Learn Microsoft Fabric with Will)',yt('DP-700 Exam Full Course 6 hours Microsoft Fabric Data Engineer')]],
 ex:[
 {t:'fill',q:'Complete: df = spark.read.format("___").load("Files/raw/hatch.csv")',a:['csv'],w:'The format tells Spark how to read the file.'},
 {t:'fill',q:'Complete to replace the whole table: df.write.mode("___").saveAsTable("hatch_silver")',a:['overwrite'],w:'overwrite replaces. append adds rows.'},
 {t:'mcq',q:'What does df.dropDuplicates() do?',o:['Deletes the table','Removes rows that are exactly the same','Sorts the rows'],a:1,w:'It keeps one copy of each identical row.'}]},

{id:'F6',t:'Bronze, Silver, Gold and loading patterns',sum:'Try it with real rows',widget:'medallion',
 body:`<p>Good data platforms keep data in three layers. This is the <b>medallion</b> pattern.</p>
 <ul><li><b>Bronze</b>: raw data, exactly as it arrived. Never change it.</li><li><b>Silver</b>: cleaned data. No duplicates, right types, same formats.</li><li><b>Gold</b>: numbers ready for reports, summed per day or per customer.</li></ul>
 <p>Below is a small hatchery table with typical problems. Switch on the cleaning steps and watch the rows change. Red cells are problems.</p>`,
 know:'Bronze, Silver, Gold is your staging area, your cleaned tables and your data mart.',
 do:['In your lakehouse, build three tables: <code>hatch_bronze</code>, <code>hatch_silver</code>, <code>hatch_gold</code>.','Write one notebook per step.','Call both notebooks from one pipeline.'],
 links:[['Labs',L.labs]],
 ex:[
 {t:'mcq',q:'Which layer do report builders use?',o:['Bronze','Silver','Gold'],a:2,w:'Gold is business-ready.'},
 {t:'mcq',q:'What is a watermark in an incremental load?',o:['A logo on a report','The last loaded value, for example the newest change date, so the next run takes only newer rows','A type of index'],a:1,w:'Save the watermark after each run. Next run: load rows greater than it.'},
 {t:'mcq',q:'A row arrives two days late with an old date. What must your load handle?',o:['Late-arriving data','Dynamic data masking','A deployment rule'],a:0,w:'Late data is normal. A load by change date, not by business date, catches it.'}]},

{id:'F7',t:'Warehouse and T-SQL',sum:'Your SQL skills still count',
 body:`<p>A <b>warehouse</b> in Fabric is a full SQL database. You can INSERT, UPDATE and DELETE with T-SQL, and you can use transactions over several tables.</p>
 <p>Lakehouse or warehouse? Use a <b>lakehouse</b> when the team writes Spark or the data is files. Use a <b>warehouse</b> when the team writes SQL and needs full write access with T-SQL.</p>
 <p>Reports like a <b>star schema</b>. A <b>fact</b> table holds numbers you add up, such as eggs set. <b>Dimension</b> tables hold the words you filter by, such as hatchery or date.</p>`,
 know:'This is the closest thing to your SQL Server data warehouse. The semantic model on top is the new SSAS model.',
 do:['Create a warehouse.','Create <code>dim_hatchery</code> and <code>fact_hatch</code> with CREATE TABLE.','Load them from your gold table with INSERT ... SELECT.','Write a query that joins fact and dimension.'],
 links:[['Docs: Data warehouse in Fabric','https://learn.microsoft.com/en-us/fabric/data-warehouse/']],
 ex:[
 {t:'mcq',q:'You need multi-table transactions and UPDATE with T-SQL. What do you choose?',o:['Lakehouse SQL analytics endpoint','Warehouse','Eventstream'],a:1,w:'Only the warehouse gives full T-SQL write access.'},
 {t:'fill',q:'In a star schema, the ___ table holds the numbers you add up.',a:['fact'],w:'Fact = numbers. Dimension = descriptions.'}]},

{id:'F8',t:'Real-time data: Eventstream, Eventhouse, KQL',sum:'Data that never stops',
 body:`<p>Some data comes all the time, for example a temperature sensor in an incubator. This is <b>streaming</b> data.</p>
 <ul><li><b>Eventstream</b> catches the events and sends them on. No code.</li><li><b>Eventhouse</b> stores them in a KQL database, which is very fast for time data.</li><li><b>KQL</b> is the query language. You read it left to right with the pipe sign.</li></ul>
 <pre><code>SensorData
| where Temp > 38.2
| summarize avg(Temp) by Hatchery, bin(Timestamp, 5m)</code></pre>
 <p>A <b>window</b> cuts the stream into time pieces. A <b>tumbling</b> window has fixed pieces with no overlap, like every 5 minutes. A <b>hopping</b> window overlaps. A <b>sliding</b> window moves with each event.</p>`,
 know:'This part is new compared with SSIS. Batch loads run at night; streams run all day.',
 do:['Create an Eventstream with the built-in sample data.','Send it to a new Eventhouse.','Write a KQL query with <code>where</code> and <code>summarize</code>.'],
 links:[['Docs: Real-Time Intelligence','https://learn.microsoft.com/en-us/fabric/real-time-intelligence/'],['Labs',L.labs]],
 ex:[
 {t:'fill',q:'Complete the KQL: SensorData | where Temp > 38 | ___ count() by Hatchery',a:['summarize'],w:'summarize is the GROUP BY of KQL.'},
 {t:'mcq',q:'Which window has fixed pieces that do not overlap?',o:['Tumbling','Hopping','Sliding'],a:0,w:'Tumbling: 10:00-10:05, 10:05-10:10, and so on.'},
 {t:'mcq',q:'Where do you store sensor events for fast time queries?',o:['Eventhouse (KQL database)','Dataflow Gen2','Deployment pipeline'],a:0,w:'Eventhouse is built for events and time series.'}]},

{id:'F9',t:'Security and governance',sum:'Who can see what',
 body:`<p>Security has layers, from big to small.</p>
 <ul><li><b>Workspace roles</b>: Admin, Member, Contributor, Viewer. Viewer can only look.</li><li><b>Item permissions</b>: share one lakehouse or one report with one person.</li><li><b>Row-level security</b>: a person sees only some rows, for example only their region.</li><li><b>Column-level security</b>: hide a whole column, for example salary.</li><li><b>Dynamic data masking</b>: show a value partly hidden, for example aXXX@XXXX.com.</li></ul>
 <p>Governance means keeping order. A <b>sensitivity label</b> marks data as Confidential. <b>Endorsement</b> marks an item as Promoted or Certified so people know they can trust it.</p>`,
 know:'Workspace roles are like server roles. Row-level security works like roles in an SSAS model.',
 do:['Add a second account (or a colleague) as Viewer and check what they can do.','In your warehouse, create a security policy that filters rows by hatchery.','Add a mask to one column and query it as the Viewer.'],
 links:[['Docs: Security in Fabric','https://learn.microsoft.com/en-us/fabric/security/']],
 ex:[
 {t:'mcq',q:'Which role can only view items?',o:['Admin','Contributor','Viewer'],a:2,w:'Give the smallest role that is enough.'},
 {t:'mcq',q:'Each sales person may see only the rows of their own region. What do you use?',o:['Row-level security','Sensitivity label','Endorsement'],a:0,w:'Row-level security filters rows per user.'},
 {t:'mcq',q:'Support staff should see e-mail addresses as aXXX@XXXX.com. What do you use?',o:['Column-level security','Dynamic data masking','A deployment rule'],a:1,w:'Masking shows a hidden form; the real data stays in the table.'}]},

{id:'F10',t:'Monitor, fix and make it fast',sum:'When things break at 02:00',widget:'incremental',
 body:`<p>A third of the exam, and a big part of the real job, is finding problems.</p>
 <ul><li>The <b>Monitor hub</b> lists all runs of pipelines, notebooks and dataflows. Start here when a report shows old data.</li><li><b>Activator</b> sends an alert when something happens, for example a failed run.</li><li>Many small files make a Delta table slow. <code>OPTIMIZE</code> joins them into bigger files. <code>VACUUM</code> deletes old files that are no longer needed.</li><li><b>V-Order</b> writes files in a way that Power BI reads faster.</li><li>Load only new rows (incremental load) and the pipeline gets faster and cheaper. Try it below.</li></ul>`,
 know:'The Monitor hub is your SSIS catalog report and SQL Agent history. OPTIMIZE is like an index rebuild.',
 do:['Break your pipeline on purpose (wrong table name). Find the error in the Monitor hub.','Run <code>OPTIMIZE hatch_silver</code> in a notebook.','Create an alert for failed pipeline runs.'],
 links:[['Docs: Fabric',L.docs],['Labs',L.labs]],
 ex:[
 {t:'mcq',q:'A lakehouse table has 50,000 tiny files and queries are slow. What helps?',o:['OPTIMIZE','More sensitivity labels','A new workspace'],a:0,w:'OPTIMIZE compacts small files.'},
 {t:'fill',q:'The command ___ removes old files that a Delta table no longer needs.',a:['vacuum'],w:'VACUUM frees storage. After it, very old versions are gone.'},
 {t:'mcq',q:'A report shows yesterday\'s data. Where do you look first?',o:['Monitor hub','Sensitivity labels','Workspace icon'],a:0,w:'Check whether last night\'s run failed.'}]},

{id:'F11',t:'Project: build the hatchery platform',sum:'Something real to show in an interview',
 body:`<p>Knowing the words is not enough. Build one complete small platform with <b>made-up data</b>. Take screenshots. This is your proof in a job interview.</p>`,
 do:['Create three CSV files with invented hatchery data (eggs set, hatched, date, hatchery).','Bronze: load them with a pipeline, every day.','Silver: clean them in a notebook (duplicates, types, dates).','Gold: one table with hatch rate per hatchery and week.','Add an incremental load with a watermark.','Add a Viewer user and row-level security.','Write one page: what you built, one diagram, one problem you solved.'],
 links:[['Labs for ideas',L.labs]],ex:[]},

{id:'F12',t:'The DP-700 exam',sum:'Facts, links and a check',
 body:`<p>The exam has three parts, each about a third: <b>implement and manage</b> (workspaces, security, CI/CD, orchestration), <b>ingest and transform</b> (batch and streaming), and <b>monitor and optimize</b>.</p>
 <p>You pass with <b>700 of 1000</b> points. You need to read SQL, PySpark and KQL. The certificate is renewed every year with a free online test.</p>
 <p>Book the exam when you score above 80% in the practice assessment twice. Check the exam page for the price in Germany and the languages.</p>`,
 do:['Read the official study guide and tick every skill you can explain.','Take the free practice assessment.','Try the exam sandbox once so the screen is not new on exam day.','Book the exam.'],
 links:[['Exam page and learning paths',L.exam],['Official study guide',L.guide],['Free practice assessment','https://aka.ms/DP700-PA'],['Exam sandbox','https://aka.ms/examdemo'],['Video course: Aleksi Partanen Tech',yt('DP-700 Exam Full Course Microsoft Fabric Data Engineer Associate Aleksi Partanen')]],
 ex:[
 {t:'mcq',q:'You must choose between a pipeline and a notebook to call five notebooks in order, with retry. Which one?',o:['Pipeline','One more notebook only','Dataflow Gen2'],a:0,w:'Pipelines orchestrate: order, retry, schedule.'},
 {t:'mcq',q:'You want data from another lakehouse to appear in yours without copying it. What do you create?',o:['A shortcut','A dataflow','A mask'],a:0,w:'A shortcut points to data that stays where it is.'},
 {t:'mcq',q:'You want an operational database copied into Fabric and kept up to date with little setup. What do you use?',o:['Mirroring','VACUUM','Endorsement'],a:0,w:'Mirroring replicates a source database into OneLake.'}]}
]},

devops:{c:'o',letter:'O',name:'Azure DevOps and CI/CD',goal:'Work like a team: versions, reviews and safe releases',
intro:'DevOps means: every change is saved, checked and delivered in the same safe way. Data engineers are expected to know this.',
stations:[
{id:'O1',t:'Git in plain words',sum:'Save points for your work',
 body:`<p><b>Git</b> saves the history of your files. Each save point is a <b>commit</b>. You can always go back.</p>
 <p>A <b>branch</b> is your own copy to work on, so you do not break the main version. When you finish, you open a <b>pull request</b>. A colleague reads your change and then it is <b>merged</b> into main.</p>`,
 do:['Play the first four levels of Learn Git Branching.','Create a repo, add a file, commit, create a branch, merge it.'],
 links:[['Learn Git Branching (interactive)','https://learngitbranching.js.org/'],['Pro Git book (free)','https://git-scm.com/book/en/v2']],
 ex:[
 {t:'order',q:'Put the normal team workflow in order.',items:['Create a branch','Change the files','Commit','Push','Open a pull request','Colleague reviews','Merge into main'],w:'Nothing goes into main without a review.'},
 {t:'mcq',q:'Why do you work on a branch?',o:['It is faster','To keep the main version safe while you work','Git needs it to start'],a:1,w:'Main always stays in a working state.'}]},
{id:'O2',t:'What is inside Azure DevOps',sum:'Boards, Repos, Pipelines',
 body:`<p>Azure DevOps is a set of tools for a team.</p>
 <ul><li><b>Boards</b>: tasks and bugs as work items.</li><li><b>Repos</b>: Git repositories for the code.</li><li><b>Pipelines</b>: automatic build, test and release.</li><li><b>Test Plans</b> and <b>Artifacts</b>: tests and packages.</li></ul>
 <p>A good habit: every commit names the work item it belongs to. Then anybody can see why a change was made.</p>`,
 do:['Create a free Azure DevOps organisation and a project.','Create three work items for your hatchery project.','Push your project files to Repos.'],
 links:[['Azure DevOps documentation','https://learn.microsoft.com/en-us/azure/devops/']],
 ex:[
 {t:'mcq',q:'Where do you record a bug so the team can plan it?',o:['Boards','Artifacts','Pipelines'],a:0,w:'Boards holds work items.'},
 {t:'mcq',q:'Where does the automatic release run?',o:['Repos','Pipelines','Boards'],a:1,w:'Pipelines build, test and deploy.'}]},
{id:'O3',t:'CI/CD pipelines',sum:'Run the simulator',widget:'cicd',
 body:`<p><b>CI</b> (continuous integration): every change is built and tested automatically. <b>CD</b> (continuous delivery): a tested change moves to Dev, then Test, then Production in the same way every time.</p>
 <p>A pipeline is written in a YAML file. Read it from top to bottom:</p>
 <pre><code>trigger:            # when does it start?
  branches:
    include: [ main ]
pool:               # which machine runs it?
  vmImage: ubuntu-latest
stages:             # big phases
- stage: Build
  jobs:
  - job: Validate
    steps:          # single commands
    - script: pip install -r requirements.txt
    - script: pytest tests/
- stage: DeployTest
  dependsOn: Build</code></pre>
 <p>Stages contain jobs. Jobs contain steps. If one step fails, the pipeline stops and Production stays safe. Try it:</p>`,
 do:['Create a pipeline in Azure DevOps from the starter template.','Add one script step that prints a message.','Make it fail on purpose (<code>exit 1</code>) and read the log.'],
 links:[['Azure DevOps documentation','https://learn.microsoft.com/en-us/azure/devops/']],
 ex:[
 {t:'fill',q:'In the YAML file, the ___ section says which branch starts the pipeline.',a:['trigger'],w:'trigger = when to run.'},
 {t:'order',q:'Order from biggest to smallest.',items:['Pipeline','Stage','Job','Step'],w:'A pipeline has stages, a stage has jobs, a job has steps.'},
 {t:'mcq',q:'The tests fail in the Build stage. What happens to Production?',o:['It gets the broken code','Nothing. The pipeline stops before deploying','It is deleted'],a:1,w:'That is the whole point of CI/CD.'}]},
{id:'O4',t:'CI/CD inside Fabric',sum:'Git integration and deployment pipelines',
 body:`<p>Fabric has two tools for this, and both are in the exam.</p>
 <ul><li><b>Git integration</b>: connect a workspace to a branch in Azure DevOps or GitHub. Your notebooks and pipelines are saved as files with history.</li><li><b>Deployment pipelines</b>: copy items from a Dev workspace to Test and then to Production with a click. <b>Deployment rules</b> change settings per stage, for example the database connection.</li></ul>
 <p>For a warehouse you can keep the tables as code in a <b>database project</b>.</p>`,
 know:'Today you may deploy SSIS packages by hand. Deployment pipelines replace that with a repeatable click.',
 do:['Connect your <code>tori-lab</code> workspace to an Azure DevOps repo and commit.','Change a notebook, see the change under Source control, commit it.','Create a deployment pipeline with Dev and Test. Deploy.'],
 links:[['Docs: CI/CD in Fabric','https://learn.microsoft.com/en-us/fabric/cicd/']],
 ex:[
 {t:'mcq',q:'You want history for notebook changes and work in branches. Which feature?',o:['Git integration','Dynamic data masking','Eventstream'],a:0,w:'Git integration links the workspace to a repo.'},
 {t:'mcq',q:'Test must use a different database connection than Dev. What do you set?',o:['A deployment rule','A sensitivity label','A watermark'],a:0,w:'Deployment rules change values per stage.'}]}
]},

deutsch:{c:'d',letter:'D',name:'Deutsch: A2 → B1',goal:'Pass the B1 exam in about six months, then continue to B2',
intro:'One grammar idea per station, with sentences from office life. Do 30 minutes a day. A short daily habit beats one long Sunday.',
stations:[
{id:'D0',t:'Wörter für das Büro',sum:'Flashcards you can use tomorrow',widget:'flash',
 body:`<p>Start with words you hear at work every day. Click the card to turn it. Say the sentence out loud.</p>`,
 do:['Learn 5 cards a day.','Use one new word in a real message to a colleague.'],
 links:[['DW Learn German (free course Nicos Weg)','https://learngerman.dw.com/'],['vhs-Lernportal (free, A1 to B2)','https://www.vhs-lernportal.de/']],ex:[]},
{id:'D1',t:'Perfekt und Präteritum',sum:'Talking about the past',
 body:`<p>When you <b>speak</b>, use the Perfekt: <b>haben</b> or <b>sein</b> + Partizip II at the end.</p>
 ${D('Ich habe den Bericht geschrieben.','I wrote the report.')}${D('Wir sind um acht Uhr ins Büro gekommen.','We came to the office at eight.')}
 <p>Use <b>sein</b> for movement and change (gehen, kommen, fahren, werden). Use <b>haben</b> for almost everything else.</p>
 <p>For <b>sein, haben</b> and modal verbs, people use the Präteritum even when speaking:</p>
 ${D('Ich war gestern krank.','I was ill yesterday.')}${D('Ich musste lange arbeiten.','I had to work late.')}${D('Ich konnte nicht kommen.','I could not come.')}`,
 do:['Tell your day in five Perfekt sentences. Say them out loud.'],links:[['DW Learn German','https://learngerman.dw.com/']],
 ex:[
 {t:'fill',q:'Gestern ___ ich lange gearbeitet.',a:['habe'],w:'arbeiten uses haben.'},
 {t:'fill',q:'Wir ___ um acht Uhr ins Büro gekommen.',a:['sind'],w:'kommen is movement, so sein.'},
 {t:'mcq',q:'Präteritum: Ich ___ gestern nicht kommen.',o:['kann','konnte','gekonnt'],a:1,w:'können → konnte.'}]},
{id:'D2',t:'Nebensätze: weil, dass, wenn, obwohl',sum:'The verb goes to the end',
 body:`<p>After <b>weil</b> (because), <b>dass</b> (that), <b>wenn</b> (if / when) and <b>obwohl</b> (although), the verb moves to the <b>end</b>.</p>
 ${D('Ich lerne Deutsch, weil ich in Deutschland arbeite.','I learn German because I work in Germany.')}
 ${D('Ich glaube, dass der Kunde heute anruft.','I think that the customer will call today.')}
 ${D('Wenn ich Zeit habe, helfe ich dir.','If I have time, I will help you.')}
 ${D('Obwohl es spät ist, arbeite ich weiter.','Although it is late, I keep working.')}
 <p>When the sentence <b>starts</b> with the Nebensatz, the main verb comes right after the comma.</p>`,
 do:['Write three reasons with weil: why you learn German, why you like your job, why you live in Osnabrück.'],links:[['DW Learn German','https://learngerman.dw.com/']],
 ex:[
 {t:'order',q:'Build the sentence: "I am coming later because I have an appointment."',items:['Ich','komme','später,','weil','ich','einen','Termin','habe.'],w:'habe goes to the end after weil.'},
 {t:'mcq',q:'Ich glaube, dass er heute im Büro ___.',o:['ist','sein','er ist'],a:0,w:'Verb at the end: ... dass er heute im Büro ist.'},
 {t:'fill',q:'___ ich Zeit habe, helfe ich dir.',a:['wenn'],w:'wenn = if / when.'}]},
{id:'D3',t:'Relativsätze',sum:'The colleague who helped me',
 body:`<p>A Relativsatz gives more information about a noun. It starts with <b>der, die, das</b> (or den, dem ...) and the verb goes to the end.</p>
 ${D('Das ist der Kollege, der mir geholfen hat.','This is the colleague who helped me.')}
 ${D('Die Datei, die du geschickt hast, ist leer.','The file that you sent is empty.')}
 ${D('Das ist der Bericht, den ich gestern geschrieben habe.','This is the report that I wrote yesterday.')}
 <p>The word depends on the noun (der, die, das) and on its job in the small sentence. Subject: der / die / das. Object (Akkusativ): <b>den</b> / die / das.</p>`,
 do:['Describe three things on your desk with a Relativsatz.'],links:[['DW Learn German','https://learngerman.dw.com/']],
 ex:[
 {t:'mcq',q:'Das ist die Kollegin, ___ aus Hamburg kommt.',o:['der','die','das'],a:1,w:'die Kollegin, subject → die.'},
 {t:'mcq',q:'Das ist der Bericht, ___ ich gestern geschrieben habe.',o:['der','den','dem'],a:1,w:'der Bericht, object (Akkusativ) → den.'},
 {t:'mcq',q:'Das ist das Problem, ___ wir lösen müssen.',o:['das','den','die'],a:0,w:'das Problem → das.'}]},
{id:'D4',t:'Konjunktiv II',sum:'Polite and "what if"',
 body:`<p>Use it to be <b>polite</b>. This is very important at work in Germany.</p>
 ${D('Könnten Sie mir bitte helfen?','Could you help me, please?')}${D('Ich hätte eine Frage.','I have a question. (polite)')}${D('Ich würde gern einen Termin machen.','I would like to make an appointment.')}
 <p>Use it for things that are <b>not real</b>:</p>
 ${D('Wenn ich mehr Zeit hätte, würde ich mehr lesen.','If I had more time, I would read more.')}
 <p>Easy rule: <b>würde + infinitive</b> works for most verbs. Learn four special forms by heart: wäre, hätte, könnte, müsste.</p>`,
 do:['Rewrite three direct requests in a polite form. Example: "Schick mir die Datei." → "Könntest du mir bitte die Datei schicken?"'],links:[['DW Learn German','https://learngerman.dw.com/']],
 ex:[
 {t:'fill',q:'___ Sie mir bitte die Datei schicken? (could)',a:['könnten','koennten','würden','wuerden'],w:'Könnten Sie ...? is the standard polite request.'},
 {t:'fill',q:'Wenn ich reich ___, würde ich weniger arbeiten.',a:['wäre','waere'],w:'sein → wäre.'},
 {t:'fill',q:'Ich ___ gern einen Termin. (polite: I would like to have)',a:['hätte','haette'],w:'haben → hätte.'}]},
{id:'D5',t:'Passiv',sum:'The data is loaded every night',
 body:`<p>Use the Passiv when the action is more important than the person. IT people use it all the time.</p>
 <p>Form: <b>werden</b> + Partizip II at the end.</p>
 ${D('Die Daten werden jede Nacht geladen.','The data is loaded every night.')}
 ${D('Der Fehler wurde gestern behoben.','The error was fixed yesterday.')}
 ${D('Der Bericht muss bis Freitag geschickt werden.','The report must be sent by Friday.')}`,
 do:['Describe your nightly data load in three Passiv sentences.'],links:[['DW Learn German','https://learngerman.dw.com/']],
 ex:[
 {t:'fill',q:'Die E-Mail ___ gerade geschrieben. (now)',a:['wird'],w:'Present: wird + Partizip II.'},
 {t:'fill',q:'Das Problem ___ gestern gelöst. (past)',a:['wurde'],w:'Past: wurde + Partizip II.'},
 {t:'order',q:'Build: "The report must be written by Friday."',items:['Der','Bericht','muss','bis','Freitag','geschrieben','werden.'],w:'Modal verb in position 2, Partizip + werden at the end.'}]},
{id:'D6',t:'Adjektivendungen',sum:'A simple rule that covers most cases',
 body:`<p>Do not learn the full table first. Learn this:</p>
 <ul><li>After <b>ein / kein / mein</b> in the basic form, the adjective shows the gender: ein neu<b>er</b> Kollege, eine neu<b>e</b> Kollegin, ein neu<b>es</b> Projekt.</li><li>After <b>der / die / das</b> in the basic form: always <b>-e</b>. der neu<b>e</b> Kollege.</li><li>Plural with an article, and almost everything in Dativ: <b>-en</b>. die neu<b>en</b> Daten, mit dem neu<b>en</b> Kollegen.</li></ul>
 ${D('Das ist ein guter Vorschlag.','That is a good suggestion.')}${D('Ich habe eine wichtige Frage.','I have an important question.')}${D('Wir arbeiten mit den neuen Daten.','We work with the new data.')}`,
 do:['Describe your team with five adjectives: "Ich habe einen netten Chef."'],links:[['vhs-Lernportal','https://www.vhs-lernportal.de/']],
 ex:[
 {t:'mcq',q:'Das ist ein ___ Vorschlag.',o:['gute','guter','guten'],a:1,w:'der Vorschlag → ein guter.'},
 {t:'mcq',q:'Ich habe eine ___ Frage.',o:['wichtige','wichtiger','wichtiges'],a:0,w:'die Frage → eine wichtige.'},
 {t:'mcq',q:'Ich spreche mit dem ___ Kollegen.',o:['neue','neuer','neuen'],a:2,w:'Dativ → -en.'}]},
{id:'D7',t:'Verben mit Präpositionen',sum:'warten auf, sich kümmern um',
 body:`<p>Many verbs need a fixed preposition. Learn them as one piece.</p>
 ${D('Ich warte auf deine Antwort.','I am waiting for your answer.')}
 ${D('Ich kümmere mich um das Problem.','I will take care of the problem.')}
 ${D('Ich nehme an der Besprechung teil.','I am taking part in the meeting.')}
 ${D('Ich interessiere mich für Datenanalyse.','I am interested in data analysis.')}
 ${D('Ich freue mich auf das Wochenende.','I am looking forward to the weekend.')}
 ${D('Das hängt von dem Kunden ab.','That depends on the customer.')}
 <p>Questions use <b>wo(r)</b> + preposition: <span lang="de">Worauf wartest du?</span></p>`,
 do:['Write one true sentence with each of the six verbs.'],links:[['DW Learn German','https://learngerman.dw.com/']],
 ex:[
 {t:'fill',q:'Ich warte ___ deine Antwort.',a:['auf'],w:'warten auf + Akkusativ.'},
 {t:'fill',q:'Ich kümmere mich ___ das Problem.',a:['um'],w:'sich kümmern um.'},
 {t:'fill',q:'Ich nehme ___ der Besprechung teil.',a:['an'],w:'teilnehmen an + Dativ.'},
 {t:'fill',q:'Ich interessiere mich ___ Datenanalyse.',a:['für','fuer'],w:'sich interessieren für.'}]},
{id:'D8',t:'zu, um ... zu, damit',sum:'Saying why you do something',
 body:`${D('Ich versuche, pünktlich zu kommen.','I try to come on time.')}
 ${D('Ich habe vergessen, die E-Mail zu schicken.','I forgot to send the e-mail.')}
 <p><b>um ... zu</b> gives a goal when the person is the same:</p>
 ${D('Ich lerne Deutsch, um einen besseren Job zu finden.','I learn German to find a better job.')}
 <p><b>damit</b> gives a goal when the person is different:</p>
 ${D('Ich schreibe es auf, damit du es nicht vergisst.','I am writing it down so that you do not forget it.')}`,
 do:['Finish this sentence in three ways: "Ich lerne Fabric, um ..."'],links:[['DW Learn German','https://learngerman.dw.com/']],
 ex:[
 {t:'fill',q:'Ich habe vergessen, die E-Mail ___ schicken.',a:['zu'],w:'vergessen + zu + infinitive.'},
 {t:'mcq',q:'Ich lerne Fabric, ___ die Prüfung zu bestehen.',o:['um','damit','weil'],a:0,w:'Same person, goal → um ... zu.'},
 {t:'mcq',q:'Ich erkläre es langsam, ___ alle es verstehen.',o:['um','damit','dass'],a:1,w:'Different person (alle) → damit.'}]},
{id:'D9',t:'Schreiben: die formelle E-Mail',sum:'With a writing coach',widget:'coach',
 body:`<p>In the B1 exam and at work you write short formal e-mails. Always use the same five parts.</p>
 <ol><li><b>Anrede</b>: <span lang="de">Sehr geehrte Frau Müller,</span> / <span lang="de">Sehr geehrter Herr Schmidt,</span> / <span lang="de">Guten Tag Frau Müller,</span></li>
 <li><b>Why you write</b>: <span lang="de">ich schreibe Ihnen, weil ...</span></li>
 <li><b>Details</b>: two or three sentences.</li>
 <li><b>What you want</b>: <span lang="de">Könnten Sie mir bitte ...?</span></li>
 <li><b>Schluss</b>: <span lang="de">Vielen Dank im Voraus. Mit freundlichen Grüßen</span> + your name</li></ol>
 <p>After the Anrede comes a comma, and the next line starts with a small letter.</p>`,
 do:['Write one e-mail a week with the coach below.'],links:[['Goethe B1 model test (PDF)','https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf']],
 ex:[
 {t:'order',q:'Put the parts of a formal e-mail in order.',items:['Sehr geehrte Frau Müller,','ich schreibe Ihnen, weil ich morgen nicht kommen kann.','Könnten wir den Termin verschieben?','Vielen Dank im Voraus.','Mit freundlichen Grüßen'],w:'Anrede, reason, request, thanks, closing.'},
 {t:'mcq',q:'You write to a man called Schmidt. Which is right?',o:['Sehr geehrte Herr Schmidt,','Sehr geehrter Herr Schmidt,','Hallo Schmidt,'],a:1,w:'geehrter for a man, geehrte for a woman.'}]},
{id:'D10',t:'Sprechen: Meinung, Vorschlag, Nachfragen',sum:'Sentences for meetings and for the exam',
 body:`<h4>Give your opinion</h4>${D('Meiner Meinung nach ist das eine gute Idee.','In my opinion that is a good idea.')}${D('Ich finde, dass wir mehr Zeit brauchen.','I think that we need more time.')}
 <h4>Agree and disagree politely</h4>${D('Da haben Sie recht.','You are right about that.')}${D('Das sehe ich etwas anders.','I see that a little differently.')}
 <h4>Suggest</h4>${D('Wie wäre es, wenn wir uns am Montag treffen?','How about meeting on Monday?')}${D('Wir könnten zuerst die Daten prüfen.','We could check the data first.')}
 <h4>When you do not understand</h4>${D('Könnten Sie das bitte wiederholen?','Could you repeat that, please?')}${D('Ich habe das nicht ganz verstanden.','I did not quite understand that.')}${D('Was bedeutet das Wort?','What does that word mean?')}`,
 do:['Use one of these sentences in your next meeting.','Record yourself for one minute: "Was machst du beruflich?"'],links:[['Goethe B1 speaking example (video)','https://goethemp4s.akamaized.net/resources/files/mp473/goethe-v14.mp4'],['Video: Easy German',yt('Easy German B1')]],
 ex:[
 {t:'fill',q:'Meiner Meinung ___ ist das eine gute Idee.',a:['nach'],w:'meiner Meinung nach = in my opinion.'},
 {t:'mcq',q:'Which is the polite way to disagree?',o:['Das ist falsch.','Das sehe ich etwas anders.','Nein.'],a:1,w:'Soft and professional.'}]},
{id:'D11',t:'Die B1-Prüfung und der Weg zu B2',sum:'How the exam works',
 body:`<p>The <b>Goethe-Zertifikat B1</b> has four modules. Each has 100 points and you pass a module with <b>60</b>. You can take the modules one by one.</p>
 <div class="tbl"><table><tr><th>Module</th><th>Time</th><th>What you do</th></tr>
 <tr><td>Lesen</td><td class="num">65 min</td><td>Read blog posts, adverts, short articles and answer questions</td></tr>
 <tr><td>Hören</td><td class="num">about 40 min</td><td>Listen to announcements and talks</td></tr>
 <tr><td>Schreiben</td><td class="num">60 min</td><td>Write two short messages and one opinion text</td></tr>
 <tr><td>Sprechen</td><td class="num">about 15 min</td><td>Plan something with a partner and give a short talk</td></tr></table></div>
 <p><b>Honest timing:</b> from A2 to B1 in six months is realistic with about five hours a week. B2 needs about six to nine more months after that. Check dates and prices at a test centre near you.</p>`,
 do:['Do the free Goethe model test once now, to see the format.','Read the B1 word list and mark the words you do not know.','Two months before the exam: one full practice test every second week.'],
 links:[['Goethe B1 practice material','https://www.goethe.de/ins/us/en/m/spr/prf/ueb/pb1.html'],['About the B1 exam','https://www.goethe.de/ins/us/en/m/spr/prf/gzb1.cfm'],['B1 word list (PDF)','https://www.goethe.de/pro/relaunch/prf/de/Goethe-Zertifikat_B1_Wortliste.pdf'],['Practice test 2 (PDF)','https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf']],
 ex:[{t:'mcq',q:'How many points do you need to pass one module?',o:['50','60','75'],a:1,w:'60 of 100 in each module.'}]}
]},

ai:{c:'k',letter:'K',name:'AI you can build',goal:'Understand how the main AI systems work and build a small one',
intro:'Every station has something to click. First see how it works, then build a small version yourself.',
stations:[
{id:'K1',t:'How a language model works',sum:'It guesses the next piece of text',
 body:`<p>A <b>large language model (LLM)</b> has read a huge amount of text. It learned one skill: guess what comes next.</p>
 <p>Text is cut into <b>tokens</b>. A token is a word or a part of a word. The model reads your tokens and picks the next token, again and again, until the answer is finished.</p>
 <p>The <b>context window</b> is how much text the model can look at in one go. Everything outside it does not exist for the model.</p>
 <p>The model does not look facts up. It writes what is likely. So it can sound sure and still be wrong. This is called a <b>hallucination</b>. The fix is to give the model the right documents. That is RAG, two stations ahead.</p>`,
 do:['Ask an AI assistant a question about your own company that it cannot know. Watch how it answers.','Ask again and paste the facts first. Compare.'],
 links:[['Hugging Face: free LLM course','https://huggingface.co/learn'],['Video: 3Blue1Brown on neural networks',yt('3Blue1Brown but what is a GPT')]],
 ex:[
 {t:'mcq',q:'What is a token?',o:['A password','A word or a piece of a word','A kind of database'],a:1,w:'Models count and pay in tokens.'},
 {t:'mcq',q:'Why can an LLM give a wrong answer with confidence?',o:['It writes the most likely text; it does not check facts','It is broken','It wants to trick you'],a:0,w:'Likely is not the same as true.'}]},
{id:'K2',t:'Embeddings',sum:'Meaning turned into numbers',
 body:`<p>An <b>embedding</b> is a list of numbers that stands for the meaning of a text. Texts with a similar meaning get similar numbers.</p>
 <p>So "chick" and "hen" are close together. "chick" and "invoice" are far apart. The usual way to measure how close two texts are is <b>cosine similarity</b>: 1 means same direction, 0 means nothing in common.</p>
 <p>A <b>vector database</b> stores many embeddings and finds the nearest ones fast. This is how search by meaning works.</p>`,
 do:['In the RAG demo (next station), look at the score next to each chunk. That is a similarity score.'],
 links:[['Hugging Face Learn','https://huggingface.co/learn']],
 ex:[
 {t:'mcq',q:'Which pair is closest in meaning, so closest as embeddings?',o:['chick and hen','chick and invoice','hen and pipeline'],a:0,w:'Similar meaning, similar numbers.'},
 {t:'mcq',q:'What does a vector database do?',o:['Stores embeddings and finds the nearest ones','Draws charts','Trains models'],a:0,w:'It is the memory of a RAG system.'}]},
{id:'K3',t:'RAG: answer from your own documents',sum:'A working demo',widget:'rag',
 body:`<p><b>RAG</b> means retrieval-augmented generation. In plain words: first <b>find</b> the right text, then let the model <b>answer using that text</b>.</p>
 <p>Why? The model does not know your company. With RAG it reads your documents at the moment you ask, and it can show where the answer came from.</p>
 <p>Below is a tiny RAG system over a made-up hatchery handbook. Ask a question and follow the four steps.</p>`,
 do:['Ask three questions in the demo. Find one question where the wrong chunk wins and think about why.'],
 links:[['DeepLearning.AI short courses (RAG)','https://www.deeplearning.ai/short-courses/'],['Hugging Face Learn','https://huggingface.co/learn']],
 ex:[
 {t:'order',q:'Put the RAG steps in order.',items:['Cut documents into chunks','Make embeddings and store them','The user asks a question','Find the most similar chunks','Put chunks and question into the prompt','The model answers and names its sources'],w:'The first two steps happen once. The rest happens for every question.'},
 {t:'mcq',q:'Company documents change every week. What fits better?',o:['RAG','Train a new model every week'],a:0,w:'With RAG you only update the documents.'}]},
{id:'K4',t:'Computer vision',sum:'How a machine sees edges',widget:'conv',
 body:`<p>For a computer an image is a grid of numbers. Each number is how bright one pixel is.</p>
 <p>A <b>filter</b> (or kernel) is a tiny grid of numbers, often 3 by 3. It slides over the image. At each place it multiplies and adds. The result is a new image that shows one feature, for example vertical edges. This sliding is called <b>convolution</b>.</p>
 <p>A <b>CNN</b> learns thousands of such filters by itself. Early layers find edges. Later layers find shapes, then whole objects. Newer models called <b>vision transformers</b> cut the image into small patches and read them like words.</p>
 <p>Three common jobs: <b>classification</b> (what is in the picture?), <b>object detection</b> (where is each thing? boxes), <b>segmentation</b> (which pixels belong to it?).</p>
 <p>Draw on the left image by clicking pixels. Then press Play.</p>`,
 know:'A poultry example: a camera over a conveyor finds cracked eggs. That is object detection.',
 do:['Draw a vertical line. Which filter makes it bright? Which one makes it disappear?','Open the Hugging Face computer vision course and run the first notebook.'],
 links:[['Hugging Face: Community Computer Vision Course','https://huggingface.co/learn']],
 ex:[
 {t:'mcq',q:'You must count the eggs on a tray and mark where each one is. Which job is that?',o:['Classification','Object detection','Translation'],a:1,w:'Detection gives a box for each object.'},
 {t:'mcq',q:'What is a filter (kernel)?',o:['A small grid of numbers that slides over the image','A camera lens','A type of file'],a:0,w:'Different numbers find different features.'}]},
{id:'K5',t:'Agents and tools',sum:'AI that takes steps',
 body:`<p>A chatbot answers once. An <b>agent</b> works in a loop: <b>think</b> about the goal, <b>act</b> by using a tool, <b>look</b> at the result, and repeat until the job is done.</p>
 <p>Tools are things like "run this SQL", "read this file", "send this message". A common standard for connecting tools is <b>MCP</b> (Model Context Protocol).</p>
 <p>Agents are powerful and can do damage. Two rules: give the agent the <b>smallest permissions</b> that are enough, and ask a human before anything that cannot be undone.</p>`,
 know:'An agent that reads a support ticket, runs a query on the customer data and drafts the answer is a real use case in your work.',
 do:['Write the loop for one of your tasks: goal, tools needed, which step needs a human yes.'],
 links:[['Hugging Face: Agents course','https://huggingface.co/learn'],['DeepLearning.AI short courses','https://www.deeplearning.ai/short-courses/']],
 ex:[
 {t:'mcq',q:'What makes an agent different from a chatbot?',o:['It uses tools and takes several steps on its own','It has a nicer voice','It is always right'],a:0,w:'Tools plus a loop.'},
 {t:'mcq',q:'An agent can delete tables. What is the safest design?',o:['Give it admin rights so it never fails','Smallest permissions, and a human approves deletes','Let it try and see'],a:1,w:'Treat an agent like a new colleague on day one.'}]},
{id:'K6',t:'Test it and ship it',sum:'What separates a demo from a product',
 body:`<p>A demo that works once is easy. A system people trust needs four more things.</p>
 <ul><li><b>Evaluation</b>: keep a list of 30 real questions with the right answers. Run it after every change. Now you know if you made things better or worse.</li><li><b>Guardrails</b>: say "I do not know" when no good chunk is found.</li><li><b>Cost and speed</b>: count tokens per request.</li><li><b>Privacy</b>: never paste customer data into a public tool. In the EU, the AI Act and GDPR set rules for this.</li></ul>`,
 do:['Write 10 test questions for the hatchery handbook in the RAG demo, with the answer you expect.'],
 links:[['DeepLearning.AI short courses','https://www.deeplearning.ai/short-courses/']],
 ex:[
 {t:'mcq',q:'You changed the chunk size in your RAG system. How do you know it is better?',o:['It feels better','Run the same test questions before and after and compare','Ask the model if it is better'],a:1,w:'Measure. Do not guess.'}]},
{id:'K7',t:'Project: RAG over your own notes',sum:'Build one small real thing',
 body:`<p>Use your own study notes or public documentation. Do not use company data.</p>`,
 do:['Collect 10 to 20 pages of text (for example your Fabric notes).','Cut them into chunks of about 200 words.','Create embeddings and store them (a Fabric notebook works).','Write the retrieve step: top 3 chunks for a question.','Send question and chunks to a model, and show the sources.','Write 10 test questions and measure how many answers are right.'],
 links:[['Hugging Face Learn','https://huggingface.co/learn']],ex:[]}
]}
};

window.FLASH=[
['die Besprechung','meeting','Die Besprechung beginnt um zehn Uhr.'],
['der Termin','appointment','Ich habe morgen einen Termin beim Kunden.'],
['die Frist','deadline','Die Frist ist am Freitag.'],
['die Aufgabe','task','Ich habe heute drei Aufgaben.'],
['der Vorschlag','suggestion','Ich habe einen Vorschlag.'],
['die Rückmeldung','feedback','Vielen Dank für Ihre Rückmeldung.'],
['die Auswertung','analysis, report','Die Auswertung ist fertig.'],
['die Datenquelle','data source','Welche Datenquelle benutzen wir?'],
['die Schnittstelle','interface, API','Die Schnittstelle funktioniert nicht.'],
['der Fehler','error','Ich habe den Fehler gefunden.'],
['die Anforderung','requirement','Der Kunde hat neue Anforderungen.'],
['die Lösung','solution','Wir suchen eine Lösung.'],
['Bescheid geben','to let someone know','Ich gebe Ihnen morgen Bescheid.'],
['sich kümmern um','to take care of','Ich kümmere mich darum.'],
['erledigen','to get something done','Ich erledige das heute.'],
['verschieben','to postpone','Können wir den Termin verschieben?']
];
})();
