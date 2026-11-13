// Data engineering line: new stations, and the final order of the line.
(function(){
const {py,sql,txt,yaml,sh,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;
const old={};window.DATA_OLD.forEach(s=>old[s.id]=s);delete window.DATA_OLD;
const sec=(id,name)=>Object.assign(old[id],{sec:name});

const NEW={
DA1:{id:'DA1',sec:'The map',min:25,t:'The data platform landscape',sum:'What the tools in job ads are, and how your BI world maps to them',
 body:`<p>Job ads list many tool names. Behind them are only a few jobs that every data platform has to do. Learn the jobs, and each new tool becomes "another one for job X".</p>
 ${tbl(['Job','What it means','Tools you will see in ads','You know it as'],[
  ['<b>Ingest</b>','Bring data in from databases, APIs, files, streams','Airbyte, Fivetran, Kafka Connect, Azure Data Factory','SSIS'],
  ['<b>Store</b>','Keep it cheap, safe and queryable','Cloud storage (S3, ADLS) with Delta or Iceberg tables. Warehouses: Snowflake, BigQuery, Databricks SQL','SQL Server'],
  ['<b>Transform</b>','Clean, join, model','dbt (SQL), Spark / PySpark, Polars','Stored procedures'],
  ['<b>Orchestrate</b>','Run steps in order, retry, alert','Airflow, Dagster, Prefect','SQL Agent'],
  ['<b>Stream</b>','Move events as they happen','Kafka, Flink, Spark Structured Streaming','(new)'],
  ['<b>Quality and catalog</b>','Tests, lineage, who owns what','dbt tests, Great Expectations, Soda, Unity Catalog, DataHub','(mostly manual)'],
  ['<b>Serve</b>','Reports, APIs, features for ML','Power BI, Tableau, APIs, feature stores, vector stores','SSAS, TARGIT']])}
 <h4>Words that come up in every interview</h4>
 <ul><li><b>OLTP</b> and <b>OLAP</b>: a database for an application writes single rows fast (OLTP). An analytics system reads millions of rows for sums (OLAP). They are built differently: row storage against column storage.</li>
 <li><b>ETL</b> and <b>ELT</b>: transform before loading (ETL, the SSIS way) or load raw data first and transform inside the warehouse (ELT, the modern way, because storage and compute are cheap).</li>
 <li><b>Batch</b> and <b>streaming</b>: every night, or all the time.</li>
 <li><b>Warehouse</b>, <b>data lake</b>, <b>lakehouse</b>: tables only; files only; files with real tables on top.</li>
 <li><b>Data mesh</b>: each business area owns and publishes its own data as a product, on a shared platform.</li>
 <li><b>Platform engineering</b>: you do not build each pipeline. You build the paved road (templates, infrastructure, guardrails) that lets other teams build theirs safely.</li></ul>
 <h4>The big platforms in German job ads</h4>
 ${tbl(['Platform','In one line','Where you meet it'],[
  ['<b>Databricks</b>','Spark, Delta and ML on one platform. Strong in engineering and AI','Automotive, industry, larger tech teams'],
  ['<b>Snowflake</b>','A cloud warehouse that is easy to run. SQL first','Retail, finance, SaaS'],
  ['<b>Azure</b> (Synapse, Fabric, Data Factory)','Microsoft\'s stack. Your SQL Server history fits here','Mid-sized German companies, public sector'],
  ['<b>AWS</b> (S3, Glue, Redshift, Athena)','Many building blocks','Start-ups, SaaS'],
  ['<b>Google BigQuery</b>','A serverless warehouse','Media, e-commerce']])}
 ${job('Do not try to learn all of them. Pick one cloud and one stack, go deep, and finish a project. The second platform takes weeks, not months, because the ideas are the same. Python, SQL, Spark, dbt, Airflow, Docker and Terraform move with you to every employer.')}`,
 know:'You already do ingest, store, transform, orchestrate and serve every day, with SSIS, SQL Server, Agent and a cube. The jobs are the same. The tools are newer and they are code.',
 key:['Seven jobs: ingest, store, transform, orchestrate, stream, quality, serve.','ELT: load raw, transform in the warehouse.','One stack deep beats five stacks shallow.'],
 do:['Open ten job ads for "Data Engineer" in Germany. Mark every tool name with the job it does from the table above.','Count which five tools appear most often. Compare with the Career line.'],
 links:[['The Data Engineering Zoomcamp (free course)','https://github.com/DataTalksClub/data-engineering-zoomcamp']],
 ex:[
 {t:'mcq',q:'What does ELT mean?',o:['Load raw data first, then transform it inside the warehouse','Transform on a separate server before loading','Extract only the last table'],a:0,w:'Extract, load, transform.'},
 {t:'mcq',q:'Which tool orchestrates?',o:['Airflow','dbt','Kafka'],a:0,w:'Airflow runs tasks in order, retries and alerts. dbt transforms. Kafka streams.'},
 {t:'mcq',q:'Which tool transforms data with SQL files, tests and documentation?',o:['dbt','Terraform','Docker'],a:0,w:'dbt = data build tool.'},
 {t:'mcq',q:'An application that books single orders all day is:',o:['OLTP','OLAP'],a:0,w:'Transactions: OLTP. Analytics: OLAP.'},
 {t:'mcq',q:'What does a platform engineer build?',o:['Every report for every team','Shared infrastructure, templates and guardrails so that teams can build safely themselves','Only dashboards'],a:1,w:'The paved road.'}]},

DA2:{id:'DA2',sec:'The modern stack',min:35,t:'dbt: transformations as code',sum:'SQL you already write, with tests, versions and documentation',
 body:`<p><b>dbt</b> (data build tool) is the most requested transformation tool in data engineering ads, and it is made for people who think in SQL. You write SELECT statements. dbt turns them into tables and views, in the right order, and tests them.</p>
 <h4>A model is one SELECT in one file</h4>
 ${sql`-- models/silver/stg_hatch.sql
select
    cast(hatch_id as int)            as hatch_id,
    initcap(trim(hatchery))          as hatchery,
    cast(set_date as date)           as set_date,
    cast(eggs_set as int)            as eggs_set,
    cast(hatched as int)             as hatched
from {{ source('erp', 'hatch_raw') }}
where eggs_set > 0`}
 ${sql`-- models/gold/fct_hatch_weekly.sql
select hatchery, date_trunc('week', set_date) as week_start,
       sum(eggs_set) as eggs_set, sum(hatched) as hatched
from {{ ref('stg_hatch') }}
group by 1, 2`}
 <p>The part in double braces is <b>Jinja</b>, a template language. <code>ref('stg_hatch')</code> means "the table that the model stg_hatch creates". From these references dbt builds the dependency graph. You never write the load order by hand.</p>
 <h4>Tests and documentation live next to the model</h4>
 ${yaml`# models/silver/schema.yml
models:
  - name: stg_hatch
    description: One row per setting of eggs, cleaned.
    columns:
      - name: hatch_id
        description: Key from the ERP system.
        tests: [unique, not_null]
      - name: hatchery
        tests:
          - accepted_values:
              values: ['Nord', 'Süd', 'West']`}
 ${sh`dbt run                    # build all models
dbt test                   # run all tests
dbt build                  # run + test, in dependency order
dbt run --select stg_hatch+     # this model and everything after it
dbt docs generate          # a website with lineage and descriptions`}
 <h4>Things to know for interviews</h4>
 ${tbl(['Word','Meaning'],[
  ['<b>Materialization</b>','How a model is stored: view, table, <b>incremental</b> (only new rows are processed) or ephemeral (inlined)'],
  ['<b>Incremental model</b>','dbt\'s watermark pattern. You write the filter inside <code>{% if is_incremental() %}</code>'],
  ['<b>Snapshot</b>','dbt\'s slowly changing dimension type 2. It adds valid-from and valid-to for you'],
  ['<b>Source</b>','A raw table that dbt does not create. You can test its freshness'],
  ['<b>Seed</b>','A small CSV in the repo that becomes a table, for example a mapping list'],
  ['<b>Macro</b>','A reusable piece of SQL, like a function'],
  ['<b>Contract</b>','Fixed column names and types for a model. The build fails if they change']])}
 ${sql`-- an incremental model
{{ config(materialized='incremental', unique_key='hatch_id') }}
select * from {{ source('erp', 'hatch_raw') }}
{% if is_incremental() %}
where modified_at > (select max(modified_at) from {{ this }})
{% endif %}`}`,
 know:'dbt is your folder of stored procedures and views, but each object is one file in Git, the order is worked out automatically, and tests run on every build.',
 key:['Model = one SELECT. ref() builds the dependency graph.','Tests in YAML: unique, not_null, accepted_values, relationships.','Incremental model = watermark. Snapshot = SCD type 2.'],
 do:['Install dbt Core with the DuckDB adapter (<code>pip install dbt-duckdb</code>). It needs no server.','Build two models and four tests on a small CSV.','Run <code>dbt docs generate</code> and <code>dbt docs serve</code>, and look at the lineage graph.','Push the project to GitHub. This is already a small portfolio piece.'],
 links:[['dbt documentation','https://docs.getdbt.com/'],['dbt Fundamentals (free course)','https://learn.getdbt.com/']],
 ex:[
 {t:'mcq',q:'What does {{ ref(\'stg_hatch\') }} do?',o:['It points to the table built by the model stg_hatch and creates a dependency','It deletes the model','It is a comment'],a:0,w:'dbt uses ref() to work out the build order.'},
 {t:'mcq',q:'Which test checks that every fact row has a matching dimension row?',o:['relationships','unique','accepted_values'],a:0,w:'relationships is the foreign key test.'},
 {t:'mcq',q:'A model has 500 million rows and only today\'s rows change. Which materialization?',o:['incremental','view','ephemeral'],a:0,w:'Only new or changed rows are processed.'},
 {t:'mcq',q:'What is a dbt snapshot for?',o:['Keeping history of changing rows (SCD type 2)','A backup of the database','A screenshot of the lineage'],a:0,w:'It adds validity columns automatically.'},
 {t:'fill',q:'The command that runs models and tests together in dependency order is: dbt ___',a:['build'],w:'dbt build = run + test (+ seeds and snapshots).'}]},

DA3:{id:'DA3',min:35,t:'Airflow: orchestration as code',sum:'DAGs, retries, backfills',
 body:`<p><b>Apache Airflow</b> is the most common orchestrator. You describe a workflow in Python as a <b>DAG</b>: a set of tasks with arrows that never go in a circle. Airflow starts the tasks on schedule, in the right order, retries failures and shows everything in a web page.</p>
 ${py`from datetime import datetime, timedelta
from airflow.decorators import dag, task

@dag(schedule="0 2 * * *",                    # every day at 02:00 (cron syntax)
     start_date=datetime(2026, 1, 1),
     catchup=False,
     default_args={"retries": 2, "retry_delay": timedelta(minutes=5)})
def hatchery_nightly():

    @task
    def extract(ds=None):                     # ds = the logical date of this run, e.g. "2026-11-12"
        return load_from_erp(day=ds)          # returns a file path

    @task
    def transform(path: str):
        return clean_and_write(path)

    @task
    def check(rows: int):
        if rows == 0:
            raise ValueError("no rows loaded")   # a failed task stops what depends on it

    check(transform(extract()))               # this line defines the order

hatchery_nightly()`}
 ${tbl(['Word','Meaning'],[
  ['<b>DAG</b>','The whole workflow'],
  ['<b>Task / operator</b>','One step. Operators are ready-made task types: run Bash, run SQL, start a Databricks job, run dbt'],
  ['<b>Schedule</b>','When it runs. Written in <b>cron</b> syntax: minute, hour, day, month, weekday'],
  ['<b>Logical date</b>','The day a run is <b>for</b>, not the moment it runs. The run for Monday\'s data may execute on Tuesday at 02:00'],
  ['<b>Backfill</b>','Run the DAG again for past dates, for example after a bug fix'],
  ['<b>Sensor</b>','A task that waits for something: a file, a partition, another DAG'],
  ['<b>XCom</b>','Small values passed between tasks. Pass paths and counts, never whole tables'],
  ['<b>Idempotent task</b>','Running it twice for the same date gives the same result. Without this, retries and backfills corrupt data']])}
 <h4>Rules that senior engineers follow</h4>
 <ol><li><b>Airflow orchestrates. It does not process.</b> The heavy work runs in Spark, dbt or the warehouse. The Airflow task only starts it and waits.</li>
 <li><b>Every task is idempotent</b> and works on one date partition: "delete the day, write the day" or MERGE.</li>
 <li><b>Use the logical date</b>, never "today", inside tasks. Then backfills work.</li>
 <li><b>Fail loudly.</b> Zero rows is a failure, not a success.</li>
 <li><b>Alert on failure</b> and on tasks that take much longer than usual.</li></ol>
 <p>Other orchestrators you will hear: <b>Dagster</b> (thinks in data assets, strong typing), <b>Prefect</b> (lightweight Python), and the cloud ones (Azure Data Factory, AWS Step Functions). The ideas above carry over.</p>`,
 know:'Airflow is SQL Agent plus the SSIS control flow, written in Python and stored in Git. The logical date is the new idea: each run knows which day it belongs to.',
 key:['DAG = tasks + dependencies. Schedule in cron.','Tasks must be idempotent and use the logical date.','Airflow starts the work. Spark, dbt and the warehouse do the work.'],
 do:['Start Airflow locally with the official Docker Compose file (see the Engineering line for Docker).','Write the three-task DAG above with small Python functions.','Make the second task fail once and watch the retry.','Run a backfill for the last three days.'],
 links:[['Airflow documentation','https://airflow.apache.org/docs/'],['Astronomer: Airflow guides','https://www.astronomer.io/docs/learn/']],
 ex:[
 {t:'mcq',q:'What does the cron expression "0 2 * * *" mean?',o:['Every day at 02:00','Every 2 minutes','On the 2nd of each month'],a:0,w:'minute 0, hour 2, every day, every month, every weekday.'},
 {t:'mcq',q:'Why must tasks be idempotent?',o:['Because retries and backfills run them again for the same date','Because Python needs it','To save disk space'],a:0,w:'A second run must not double the data.'},
 {t:'mcq',q:'A task processes 50 GB with pandas inside the Airflow worker. What is wrong?',o:['Airflow should start the job in Spark or the warehouse, not do the heavy work itself','Nothing','It should use XCom for the 50 GB'],a:0,w:'Orchestrate, do not process.'},
 {t:'mcq',q:'What is a backfill?',o:['Running the DAG for past dates','Filling null values','A type of sensor'],a:0,w:'For example after fixing a bug in the transformation.'},
 {t:'mcq',q:'Inside a task you need "the day this run is for". What do you use?',o:['The logical date that Airflow passes in','datetime.now()','The server clock'],a:0,w:'now() breaks retries after midnight and all backfills.'}]},

DA4:{id:'DA4',min:35,t:'Streaming and Kafka',sum:'Events that never stop, and windows to cut them',
 body:`<p>Batch moves data at night. <b>Streaming</b> moves each event when it happens: a sensor value, a click, an order. <b>Apache Kafka</b> is the standard tool to transport events.</p>
 <h4>Kafka in six words</h4>
 ${tbl(['Word','Meaning'],[
  ['<b>Topic</b>','A named stream of events, like a table that only gets appends'],
  ['<b>Producer</b>','A program that writes events to a topic'],
  ['<b>Consumer</b>','A program that reads them'],
  ['<b>Partition</b>','A topic is split into partitions for speed. Order is guaranteed only inside one partition. Events with the same key go to the same partition'],
  ['<b>Offset</b>','The position of a consumer in a partition. It is how Kafka remembers what you have read'],
  ['<b>Consumer group</b>','Several consumers that share the work of one topic. Each event goes to one of them']])}
 <p>Kafka keeps events for a set time, for example seven days. A new consumer can start from the beginning. So one stream can feed many systems, and a broken consumer can catch up.</p>
 <h4>Delivery promises</h4>
 <ul><li><b>At most once</b>: events can be lost.</li><li><b>At least once</b>: events can arrive twice. This is the normal case. Your consumer must be idempotent: use MERGE on an event ID.</li><li><b>Exactly once</b>: possible, with more effort and limits.</li></ul>
 <h4>Windows: cutting a stream into pieces</h4>
 <p>A stream has no end, so you cannot ask for "the sum of all". You sum inside a <b>window</b> of time. Change the type and watch which events fall into which window.</p>
 ${W('windows')}
 ${tbl(['Window','How it cuts','Use it for'],[
  ['<b>Tumbling</b>','Fixed size, no overlap. Each event is in exactly one window','"Average per 5 minutes"'],
  ['<b>Hopping</b>','Fixed size, starts again after a shorter step, so windows overlap','"Every minute, the average of the last 5 minutes"'],
  ['<b>Sliding</b>','A result only when an event enters or leaves','"More than 3 errors within any 10 minutes"'],
  ['<b>Session</b>','Events close together form a group. A gap of silence ends it','"One visit of a user"']])}
 <h4>Processing a stream with Spark</h4>
 ${py`from pyspark.sql.functions import window, avg, col, from_json

raw = (spark.readStream.format("kafka")
         .option("kafka.bootstrap.servers", "broker:9092")
         .option("subscribe", "sensor-readings")
         .load())

events = raw.select(from_json(col("value").cast("string"), schema).alias("e")).select("e.*")

agg = (events
   .withWatermark("ts", "10 minutes")                          # accept events up to 10 minutes late
   .groupBy(window(col("ts"), "5 minutes"), col("machine"))    # tumbling window
   .agg(avg("temp").alias("avg_temp")))

(agg.writeStream.outputMode("append")
    .option("checkpointLocation", "/chk/sensor_silver")         # remembers the offsets
    .toTable("sensor_silver"))`}
 <p>The <b>checkpoint</b> stores how far the job has read. After a restart it continues there. The streaming <b>watermark</b> says how long to wait for late events before a window is closed.</p>
 ${job('Ask before you build streaming: "What decision gets better if the data is one minute old and not one hour old?" Often the honest answer is "none", and a batch every 15 minutes is ten times cheaper to run.')}`,
 know:'A Kafka topic is like a transaction log that many readers can replay. A tumbling window is GROUP BY on a rounded timestamp.',
 key:['Topic, partition, offset, consumer group.','At-least-once is normal, so consumers must be idempotent.','Checkpoint = progress. Watermark = how long to wait for late events.'],
 do:['Start Kafka locally with Docker (one container is enough with the KRaft image).','Write a small Python producer that sends a fake sensor value every second, and a consumer that prints it.','Stop the consumer for a minute, start it again, and see that it continues at its offset.'],
 links:[['Kafka quickstart','https://kafka.apache.org/quickstart'],['Spark Structured Streaming guide','https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html']],
 ex:[
 {t:'mcq',q:'What is an offset in Kafka?',o:['The position of a consumer in a partition','The size of a message','A type of topic'],a:0,w:'It marks what has been read.'},
 {t:'mcq',q:'Events for the same machine must be processed in order. What do you do?',o:['Use the machine ID as the message key, so they land in the same partition','Use more partitions without keys','Nothing, Kafka orders everything'],a:0,w:'Order is guaranteed only inside a partition.'},
 {t:'mcq',q:'With at-least-once delivery, an event can arrive twice. How does the consumer stay correct?',o:['Idempotent writes, for example MERGE on the event ID','Ignore it','Restart Kafka'],a:0,w:'Design for duplicates.'},
 {t:'mcq',q:'Which window has fixed pieces that do not overlap?',o:['Tumbling','Hopping','Sliding'],a:0,w:'Each event falls into exactly one window.'},
 {t:'mcq',q:'Every 1 minute you want the average of the last 10 minutes. Which window?',o:['Hopping','Tumbling','Session'],a:0,w:'Size 10 minutes, hop 1 minute.'},
 {t:'mcq',q:'What does the checkpoint location do in Spark Structured Streaming?',o:['It stores the progress so a restart continues correctly','It stores passwords','It makes queries faster'],a:0,w:'One checkpoint folder per stream.'}]},

DA5:{id:'DA5',sec:'Build it',min:90,t:'Project: a small production data platform',sum:'Portfolio project 1. Everything in one repository',
 body:`<p>This is the first of three portfolio projects (the Career line lists all three). The goal is not size. The goal is that a stranger can clone the repository, run one command, and see a working, tested, scheduled pipeline. That proves more than any job title.</p>
 ${txt`sources:  a public API (for example weather or energy prices) + CSV files
   │   Python ingestion, typed and tested
   ▼
bronze    raw files, partitioned by date
   │   dbt (on DuckDB or Postgres) or PySpark + Delta
   ▼
silver    cleaned, deduplicated, with dbt tests
   ▼
gold      a small star schema: one fact, two dimensions
   +  Airflow DAG: daily, idempotent, with retries and a row-count check
   +  Docker Compose: one command starts everything
   +  GitHub Actions: lint, unit tests and dbt build on every push
   +  README: architecture picture, how to run, decisions, what you would do next`}
 <h4>What reviewers look for</h4>
 <ol><li>Does it run with one command?</li><li>Are there tests, and do they run in CI?</li><li>Is the load idempotent? Can it backfill a date?</li><li>Are secrets kept out of the repository?</li><li>Does the README explain <b>why</b> you chose each tool, and what the limits are?</li></ol>`,
 key:['One command to run. Tests in CI. Idempotent loads. A README with decisions.'],
 do:['Create the repository and write the README first: goal, picture, tools.','Build the ingestion in Python with unit tests.','Add the dbt models and tests.','Add the Airflow DAG and Docker Compose.','Add the GitHub Actions workflow.','Ask an AI assistant to review the repository like a strict senior engineer. Fix what is right.'],
 links:[['Data Engineering Zoomcamp projects for ideas','https://github.com/DataTalksClub/data-engineering-zoomcamp']],ex:[]}
};

TRACKS.data={c:'f',letter:'P',name:'Data platform engineering',goal:'Build tested, scheduled, cloud-ready data pipelines',
intro:'AI systems run on data. The engineers who can move, clean and model data reliably are the ones who get AI into production. You bring years of SQL and modelling. This line adds the modern tools around it: Spark, Delta, dbt, Airflow and Kafka.',
stations:[NEW.DA1,sec('F7','What you already know, sharpened'),sec('F2','Lakehouse and Spark'),old.F5,old.F17,old.F6,old.F19,old.F23,NEW.DA2,NEW.DA3,NEW.DA4,NEW.DA5]};
})();
