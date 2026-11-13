// Data engineering line: Spark, Delta, loading patterns, modelling. Platform-neutral.
(function(){
const {py,sql,kql,txt,yaml,sh,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;

WD.annot.pyread={l:'py',title:'Read, change, write. Click a line',lines:[
 ['from pyspark.sql.functions import col, trim, initcap, to_date','Bring in the functions you need. They work on columns, not on single values.'],
 ['df = (spark.read.format("csv")','Start a reader. Nothing is read yet. Spark only notes the plan.'],
 ['        .option("header", "true")','The first line of the file holds the column names.'],
 ['        .load("Files/raw/hatch/*.csv"))','The path. The star reads every CSV in the folder as one table. The path can be a local folder or cloud storage.'],
 ['clean = (df.withColumn("hatchery", initcap(trim(col("hatchery"))))','withColumn adds or replaces a column. Here: cut spaces, then make "süd " into "Süd".'],
 ['           .withColumn("eggs_set", col("eggs_set").cast("int"))','Text to number. A value like "abc" becomes null. It does not raise an error.'],
 ['           .withColumn("date", to_date(col("date"), "yyyy-MM-dd"))','Text to a real date with the given pattern.'],
 ['           .dropDuplicates()','Remove rows that are the same in every column.'],
 ['           .filter(col("eggs_set") > 0))','Keep only the rows where the condition is true. Rows with null are dropped too, because null > 0 is not true.'],
 ['clean.write.mode("overwrite").saveAsTable("hatch_silver")','This is the action. Only now Spark reads the files, runs all steps and writes a Delta table.']]};

WD.rosetta=[
 ['Choose columns','SELECT hatchery, hatched\nFROM hatch','df.select("hatchery", "hatched")','hatch\n| project hatchery, hatched'],
 ['Filter rows','SELECT * FROM hatch\nWHERE eggs_set > 1000','df.filter(col("eggs_set") > 1000)','hatch\n| where eggs_set > 1000'],
 ['New column','SELECT *, hatched * 100.0 / eggs_set AS rate\nFROM hatch','df.withColumn("rate",\n  col("hatched") * 100 / col("eggs_set"))','hatch\n| extend rate = hatched * 100.0 / eggs_set'],
 ['Group and sum','SELECT hatchery, SUM(hatched) AS hatched\nFROM hatch\nGROUP BY hatchery','df.groupBy("hatchery")\n  .agg(sum("hatched").alias("hatched"))','hatch\n| summarize hatched = sum(hatched) by hatchery'],
 ['Count rows','SELECT COUNT(*) FROM hatch','df.count()','hatch\n| count'],
 ['Sort, top 5','SELECT TOP 5 * FROM hatch\nORDER BY hatched DESC','df.orderBy(col("hatched").desc()).limit(5)','hatch\n| top 5 by hatched desc'],
 ['Distinct values','SELECT DISTINCT hatchery FROM hatch','df.select("hatchery").distinct()','hatch\n| distinct hatchery'],
 ['Join','SELECT h.*, d.region\nFROM hatch h\nJOIN dim_hatchery d\n  ON d.hatchery = h.hatchery','df.join(dim, "hatchery", "inner")','hatch\n| join kind=inner dim_hatchery on hatchery'],
 ['Keep newest row per key','SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY id ORDER BY modified DESC) AS rn\n  FROM hatch) x\nWHERE rn = 1','w = Window.partitionBy("id").orderBy(col("modified").desc())\ndf.withColumn("rn", row_number().over(w))\n  .filter("rn = 1").drop("rn")','hatch\n| summarize arg_max(modified, *) by id'],
 ['Replace missing values','SELECT COALESCE(hatched, 0) AS hatched\nFROM hatch','df.fillna({"hatched": 0})','hatch\n| extend hatched = coalesce(hatched, 0)'],
 ['Group by time','SELECT DATETRUNC(hour, ts) AS h, AVG(temp)\nFROM sensor\nGROUP BY DATETRUNC(hour, ts)','df.groupBy(window("ts", "1 hour"))\n  .agg(avg("temp"))','sensor\n| summarize avg(temp) by bin(ts, 1h)'],
 ['Text contains','SELECT * FROM log\nWHERE msg LIKE \'%timeout%\'','df.filter(col("msg").contains("timeout"))','log\n| where msg has "timeout"'],
 ['Insert or update (upsert)','MERGE INTO target t USING src s ON t.id = s.id\nWHEN MATCHED THEN UPDATE SET t.val = s.val\nWHEN NOT MATCHED THEN INSERT (id, val)\n  VALUES (s.id, s.val);','(DeltaTable.forName(spark, "target").alias("t")\n  .merge(src.alias("s"), "t.id = s.id")\n  .whenMatchedUpdateAll()\n  .whenNotMatchedInsertAll()\n  .execute())','// no MERGE in KQL.\n// keep all versions and read the newest:\n| summarize arg_max(ts, *) by id']];


const S=[
{id:'F2',min:35,t:'Lakehouse and Delta tables',sum:'Files and tables in one place, and the log that makes them safe',
 body:`<p>A <b>lakehouse</b> is cheap file storage (a data lake) with real tables on top. Raw files of any kind sit next to tables you can query with SQL. Databricks, Microsoft Fabric and open-source stacks all work this way. The table format most of them use is <b>Delta</b>. Apache <b>Iceberg</b> is the other big format, and the ideas are the same.</p>
 <h4>What a Delta table really is</h4>
 <p>A Delta table is a folder. Inside are <b>Parquet</b> files with the data, and a small folder called <code>_delta_log</code>. The log is a list of numbered JSON files. Each one says: "this commit added these files and removed those files".</p>
 ${txt`Tables/hatch_silver/
  part-0001.parquet        ← data, stored column by column, compressed
  part-0002.parquet
  _delta_log/
    00000000000000000000.json   ← version 0: added part-0001
    00000000000000000001.json   ← version 1: added part-0002`}
 <p><b>Parquet</b> stores data by column, not by row. A query that needs two columns reads only those two. Each file also knows the smallest and largest value of every column, so the engine can skip whole files. That is why it is fast.</p>
 <p>An important idea: Parquet files are <b>never changed</b>. When you UPDATE one row, Delta writes a new file with the changed rows and marks the old file as removed in the log. The old file stays on disk for a while. Because of this you get three things:</p>
 <ul><li><b>ACID transactions</b>: a reader sees the table before or after a commit, never half.</li>
 <li><b>Time travel</b>: you can read an old version.</li>
 <li><b>Undo</b>: you can restore the table to an old version.</li></ul>
 <p>Try it. Run commands and watch the files and the log.</p>
 ${W('delta')}
 ${sql`-- look at the history
DESCRIBE HISTORY hatch_silver;

-- read an old version (Spark SQL)
SELECT * FROM hatch_silver VERSION AS OF 3;
SELECT * FROM hatch_silver TIMESTAMP AS OF '2026-11-10';

-- undo a mistake
RESTORE TABLE hatch_silver TO VERSION AS OF 3;`}
 <h4>Schema rules</h4>
 <p>Delta checks the columns when you write. If your DataFrame has a column the table does not know, the write fails. This is <b>schema enforcement</b>, and it protects you. If the new column is wanted, allow it:</p>
 ${py`df.write.mode("append").option("mergeSchema", "true").saveAsTable("hatch_silver")      # add new columns
df.write.mode("overwrite").option("overwriteSchema", "true").saveAsTable("hatch_silver") # replace the schema`}
 <h4>Managed and external tables</h4>
 ${tbl(['','Managed table','External table'],[
  ['How you create it','<code>df.write.saveAsTable("t")</code>','Save files to a path you choose, then register the path as a table'],
  ['Where the files are','Where the platform decides','A path you choose'],
  ['DROP TABLE','Deletes the data too','Deletes only the table name. Files stay']])}`,
 know:'A lakehouse is like a database where the tables are files in a data lake. The Delta log is the transaction log, but you are allowed to read it and travel back in it.',
 key:['Delta = Parquet files + _delta_log. Files are never changed, only added and marked as removed.','Time travel: VERSION AS OF / TIMESTAMP AS OF. Undo: RESTORE.','Schema enforcement blocks wrong columns. mergeSchema allows new ones.'],
 do:['Set up a place to practise: the free edition of Databricks, or PySpark with the delta-spark package on your own computer.','Read a small CSV and save it as a Delta table.','Update one row with SQL, then run <code>DESCRIBE HISTORY</code> and read version 0 again with <code>VERSION AS OF 0</code>.','Look into the table folder and open one JSON file in <code>_delta_log</code>.'],
 links:[['Delta Lake documentation','https://docs.delta.io/latest/index.html']],
 ex:[
 {t:'mcq',q:'What is a Delta table made of?',o:['One big CSV file','Parquet files plus a transaction log','An Excel workbook'],a:1,w:'The log is what gives Delta its safety and time travel.'},
 {t:'mcq',q:'You run UPDATE on one row of a Delta table. What happens to the Parquet file that held the row?',o:['It is edited in place','A new file is written and the old one is marked as removed in the log','The whole table is rewritten as CSV'],a:1,w:'Parquet files are never edited. That is why old versions still exist.'},
 {t:'mcq',q:'A colleague deleted rows by mistake an hour ago. What is the fastest fix?',o:['RESTORE TABLE ... TO VERSION AS OF the version before the delete','Reload everything from the source','VACUUM the table'],a:0,w:'DESCRIBE HISTORY shows the version number. RESTORE brings it back. VACUUM would make it worse.'},
 {t:'mcq',q:'An append fails with a schema mismatch because the source has a new column that you want to keep. What do you add?',o:['.option("mergeSchema","true")','.mode("ignore")','.repartition(1)'],a:0,w:'mergeSchema adds the new column to the table. Old rows get null in it.'},
 {t:'mcq',q:'You DROP a managed table. What happens to its data files?',o:['They stay','They are deleted too'],a:1,w:'Managed: the platform owns the files. External: only the name is removed.'}]},

{id:'F5',min:40,t:'Notebooks and PySpark',sum:'How Spark thinks, and the pattern read, change, write',
 body:`<p>A <b>notebook</b> is a page with code cells. You run a cell and see the result under it. Databricks, Fabric and Jupyter all use notebooks.</p>
 <p>The default language is <b>PySpark</b> (Python for Spark). A cell that starts with <code>%%sql</code> runs Spark SQL. So you can mix both in one notebook.</p>
 <h4>How Spark works</h4>
 <p>Spark splits a big table into pieces called <b>partitions</b> and works on many pieces at the same time. One process, the <b>driver</b>, makes the plan. Many <b>executors</b> do the work.</p>
 <p>Spark is <b>lazy</b>. When you write <code>filter</code> or <code>select</code>, nothing runs. Spark only writes the step into a plan. These steps are <b>transformations</b>. The plan runs when you ask for a result: <code>display</code>, <code>count</code>, <code>write</code>. These are <b>actions</b>. Because Spark sees the whole plan first, it can make it faster, for example by reading only the columns you need.</p>
 ${W('lazy')}
 <h4>The pattern is always: read, change, write</h4>
 <p>A <b>DataFrame</b> is a table in Spark. Click the lines to see what each one does.</p>
 ${W('annot','pyread')}
 <h4>Reading</h4>
 ${py`df = spark.read.table("hatch_silver")                       # a Delta table
df = spark.read.parquet("Files/raw/2026/11/*.parquet")      # parquet files
df = spark.read.option("multiline", "true").json("Files/raw/api/")   # JSON
df = spark.sql("SELECT * FROM hatch_silver WHERE eggs_set > 0")      # SQL gives a DataFrame too`}
 <p>For CSV, give Spark the schema. Then it does not have to guess the types, and bad data is found early:</p>
 ${py`from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DateType
schema = StructType([
    StructField("hatchery", StringType()),
    StructField("date",     DateType()),
    StructField("eggs_set", IntegerType()),
    StructField("hatched",  IntegerType())])
df = spark.read.schema(schema).option("header", "true").csv("Files/raw/hatch/")`}
 <h4>Writing</h4>
 ${tbl(['Mode','What happens'],[
  ['<code>overwrite</code>','Replace the whole table'],
  ['<code>append</code>','Add rows to the table'],
  ['<code>error</code> (default)','Fail if the table exists'],
  ['<code>ignore</code>','Do nothing if the table exists']])}
 ${py`df.write.mode("append").saveAsTable("hatch_silver")                       # managed Delta table
df.write.mode("overwrite").partitionBy("year").saveAsTable("hatch_silver")   # one folder per year
df.write.format("delta").mode("overwrite").save("Files/exports/hatch")       # Delta files at a path`}
 <h4>Use SQL when you like</h4>
 ${py`df.createOrReplaceTempView("v_hatch")      # give the DataFrame a name for SQL`}
 ${sql`%%sql
SELECT hatchery, SUM(hatched) AS hatched FROM v_hatch GROUP BY hatchery`}
 ${tip('<code>display(df)</code> shows a table with a chart button. <code>df.printSchema()</code> shows columns and types. <code>df.show(5)</code> prints five rows as text. Use them after every step while you learn.')}`,
 know:'A notebook does the job of an SSIS script task and a stored procedure, but on much bigger data. A DataFrame is a result set that is not yet run, like a view definition.',
 key:['Transformations are lazy. Actions (display, count, write) start the work.','Read → change → write. mode("overwrite") replaces, mode("append") adds.','saveAsTable makes a managed Delta table.'],
 do:['Create a notebook in your practice environment.','Read your CSV into a DataFrame and run <code>display(df)</code> and <code>df.printSchema()</code>.','Remove duplicates, then save it as the table <code>hatch_silver</code>.','Write a GROUP BY in PySpark and in a <code>%%sql</code> cell. Compare the results.'],
 links:[['PySpark documentation','https://spark.apache.org/docs/latest/api/python/index.html']],
 ex:[
 {t:'fill',q:'Complete: df = spark.read.format("___").load("Files/raw/hatch.csv")',a:['csv'],w:'The format tells Spark how to read the file.'},
 {t:'fill',q:'Complete to replace the whole table: df.write.mode("___").saveAsTable("hatch_silver")',a:['overwrite'],w:'overwrite replaces. append adds rows.'},
 {t:'mcq',q:'What does df.dropDuplicates() do?',o:['Deletes the table','Removes rows that are exactly the same','Sorts the rows'],a:1,w:'It keeps one copy of each identical row.'},
 {t:'mcq',q:'You write df2 = df.filter(col("eggs_set") > 0). What does Spark do at this moment?',o:['It reads all files and filters them','Nothing yet. It adds the step to the plan','It writes a table'],a:1,w:'filter is a transformation. Work starts with an action.'},
 {t:'mcq',q:'Which of these is an action?',o:['select','withColumn','count'],a:2,w:'count must return a number, so Spark has to run the plan.'},
 {t:'mcq',q:'A cell in a PySpark notebook should run Spark SQL. How does the cell start?',o:['%%sql','#sql','EXEC'],a:0,w:'%% is a "magic" that changes the language of one cell.'},
 {t:'mcq',q:'col("eggs_set").cast("int") meets the value "abc". What is the result?',o:['The job fails','null','0'],a:1,w:'A failed cast gives null. Count nulls after casting to find bad data.'}]},

{id:'F17',min:45,t:'The PySpark toolbox, with SQL side by side',sum:'Joins, groups, windows, duplicates, missing values, JSON',
 body:`<p>You already think in SQL. Almost every PySpark step has a SQL twin. Choose an operation and compare:</p>
 ${W('rosetta')}
 <h4>Columns and conditions</h4>
 ${py`from pyspark.sql.functions import col, when, lit, upper, concat_ws, round

df = (df.withColumn("rate", round(col("hatched") * 100 / col("eggs_set"), 1))
        .withColumn("quality", when(col("rate") >= 85, "good")
                              .when(col("rate") >= 75, "ok")
                              .otherwise("check"))          # like CASE WHEN
        .withColumnRenamed("eggs_set", "eggs")
        .drop("comment"))`}
 <h4>Group and aggregate</h4>
 ${py`from pyspark.sql.functions import sum, avg, count, countDistinct, max

gold = (df.groupBy("hatchery", "week")
          .agg(sum("eggs").alias("eggs"),
               sum("hatched").alias("hatched"),
               countDistinct("flock_id").alias("flocks")))`}
 <h4>Joins</h4>
 ${py`fact = hatch.join(dim_hatchery, on="hatchery_id", how="left")`}
 ${tbl(['how','Rows you get'],[
  ['<code>inner</code>','Only rows with a match on both sides'],
  ['<code>left</code>','All rows from the left table, null where the right has no match'],
  ['<code>full</code>','All rows from both'],
  ['<code>left_anti</code>','Left rows that have <b>no</b> match. Very useful: "which facts have no dimension row?"'],
  ['<code>left_semi</code>','Left rows that have a match, without the right columns']])}
 <p>When one table is small (a dimension), tell Spark to send a copy of it to every executor. Then the big table does not have to be moved. This is a <b>broadcast join</b>:</p>
 ${py`from pyspark.sql.functions import broadcast
fact = hatch.join(broadcast(dim_hatchery), "hatchery_id")`}
 <h4>Window functions</h4>
 <p>A window function looks at other rows of the same group without collapsing them. The same idea as OVER (PARTITION BY ...) in T-SQL.</p>
 ${py`from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, lag, sum

w = Window.partitionBy("hatchery").orderBy("date")
df = (df.withColumn("prev_rate", lag("rate").over(w))                 # value of the row before
        .withColumn("running_hatched", sum("hatched").over(w)))       # running total`}
 <h4>Duplicates</h4>
 ${py`df.dropDuplicates()                           # same in every column
df.dropDuplicates(["hatchery", "date"])       # same key. Keeps any one of them

# keep the NEWEST row per key: the safe way
w = Window.partitionBy("hatchery", "date").orderBy(col("modified_at").desc())
latest = df.withColumn("rn", row_number().over(w)).filter(col("rn") == 1).drop("rn")`}
 <h4>Missing values</h4>
 ${py`df.dropna(subset=["eggs", "hatched"])         # drop rows where these are null
df.fillna({"hatched": 0, "hatchery": "Unknown"})
df.filter(col("eggs").isNull()).count()        # how many are missing?`}
 <h4>Flatten JSON (denormalize)</h4>
 <p>APIs send nested data: one order with a list of lines. <code>explode</code> makes one row per list element. A dot reaches into a struct.</p>
 ${py`from pyspark.sql.functions import explode
flat = (orders.withColumn("line", explode("lines"))
              .select("order_id", "customer.name", "line.product", "line.qty"))`}
 ${tbl(['Job','T-SQL','PySpark'],[
  ['One row per array element','<code>CROSS APPLY OPENJSON()</code>','<code>explode()</code>']])}
 <p><b>Denormalize</b> also means: join dimension columns into one wide table, so that reports need fewer joins.</p>
 <h4>Stack tables</h4>
 ${py`all_years = df2025.unionByName(df2026, allowMissingColumns=True)    # match columns by name`}`,
 know:'Almost every PySpark function has a T-SQL twin you already know: when/otherwise = CASE, groupBy.agg = GROUP BY, Window = OVER, left_anti = NOT EXISTS.',
 key:['dropDuplicates(keys) keeps any row. row_number over a window keeps the newest.','left_anti finds rows without a match.','broadcast() for small dimension tables. explode() for arrays.'],
 do:['In your notebook, add a <code>rate</code> column and a <code>quality</code> column with <code>when</code>.','Build a small dimension DataFrame and left-join it.','Find the rows without a dimension match with <code>left_anti</code>.','Add two rows with the same key and different dates. Keep only the newest with <code>row_number</code>.'],
 links:[['PySpark function reference','https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/functions.html']],
 ex:[
 {t:'mcq',q:'Which join returns the fact rows that have NO matching dimension row?',o:['inner','left_anti','left_semi'],a:1,w:'left_anti = NOT EXISTS.'},
 {t:'mcq',q:'The source sends several versions of the same order. You must keep only the newest per order_id. What is correct?',o:['df.dropDuplicates()','df.dropDuplicates(["order_id"])','row_number() over a window partitioned by order_id, ordered by modified date descending, keep rn = 1'],a:2,w:'dropDuplicates(["order_id"]) keeps an arbitrary version. The window keeps the newest.'},
 {t:'mcq',q:'A 5-billion-row fact table is joined to a 200-row dimension. Which hint avoids moving the big table around?',o:['broadcast(dim)','repartition(1)','cache()'],a:0,w:'The small table is copied to every executor.'},
 {t:'mcq',q:'A JSON column holds an array of order lines. You need one row per line. Which function?',o:['explode','concat','lag'],a:0,w:'explode in PySpark, OPENJSON in T-SQL.'},
 {t:'mcq',q:'What does lag("rate").over(w) return?',o:['The rate of the previous row in the window','The average rate','The row number'],a:0,w:'lag looks back, lead looks forward.'},
 {t:'mcq',q:'Which PySpark code is the same as SQL "CASE WHEN rate >= 85 THEN \'good\' ELSE \'check\' END"?',o:['when(col("rate") >= 85, "good").otherwise("check")','filter(col("rate") >= 85)','coalesce("rate", "good")'],a:0,w:'when ... otherwise is CASE WHEN ... ELSE.'}]},

{id:'F6',min:30,t:'Bronze, Silver, Gold',sum:'The medallion pattern. Try it with real rows',
 body:`<p>Good data platforms keep data in three layers. This is the <b>medallion</b> pattern.</p>
 ${tbl(['Layer','What is in it','Rules'],[
  ['<b>Bronze</b>','Raw data, exactly as it arrived. Often plus load time and source file name.','Never change it. Append only. If something goes wrong later, you can build everything again from here.'],
  ['<b>Silver</b>','Cleaned data. No duplicates, right types, one date format, checked keys.','One row means one real thing. Still detailed, not summed.'],
  ['<b>Gold</b>','Data shaped for reports: star schema, sums per day or per customer.','Named in business words. This is what report builders see.']])}
 <p>Below is a small hatchery table with typical problems. Switch on the cleaning steps and watch the rows change. Red cells are problems.</p>
 ${W('medallion')}
 <h4>How to build it</h4>
 <p>You can keep the three layers as three schemas in one catalog, or in separate storage areas. Separate areas are better for security, because you can give report builders access to Gold only.</p>
 <p>Add technical columns in Bronze. They cost nothing and save you later:</p>
 ${py`from pyspark.sql.functions import current_timestamp, input_file_name
bronze = (raw.withColumn("_loaded_at", current_timestamp())
             .withColumn("_source_file", input_file_name()))
bronze.write.mode("append").saveAsTable("hatch_bronze")`}
 <h4>Data quality: decide what happens to bad rows</h4>
 <p>Do not delete bad rows silently. A professional pipeline sends them to a <b>quarantine</b> table with the reason, and counts them. Then somebody can fix the source.</p>
 ${py`bad  = df.filter(col("eggs_set").isNull() | (col("hatched") > col("eggs_set")))
good = df.subtract(bad)
bad.withColumn("_reason", lit("missing or impossible numbers")).write.mode("append").saveAsTable("hatch_quarantine")
good.write.mode("overwrite").saveAsTable("hatch_silver")`}`,
 know:'Bronze, Silver, Gold is your staging area, your cleaned tables and your data mart. The new part is the rule "never change Bronze".',
 key:['Bronze = raw, append only. Silver = clean and detailed. Gold = business-ready.','Quarantine bad rows. Do not drop them silently.','Give report builders access to Gold only.'],
 do:['Build three tables: <code>hatch_bronze</code>, <code>hatch_silver</code>, <code>hatch_gold</code>.','Write one notebook per step.','Run both notebooks one after the other from one job.','Add a quarantine table for rows where hatched is larger than eggs_set.'],
 links:[['Databricks: medallion architecture','https://docs.databricks.com/aws/en/lakehouse/medallion']],
 ex:[
 {t:'mcq',q:'Which layer do report builders use?',o:['Bronze','Silver','Gold'],a:2,w:'Gold is business-ready.'},
 {t:'mcq',q:'What is a watermark in an incremental load?',o:['A logo on a report','The last loaded value, for example the newest change date, so the next run takes only newer rows','A type of index'],a:1,w:'Save the watermark after each run. Next run: load rows greater than it.'},
 {t:'mcq',q:'A row arrives two days late with an old date. What must your load handle?',o:['Late-arriving data','Dynamic data masking','A deployment rule'],a:0,w:'Late data is normal. A load by change date, not by business date, catches it.'},
 {t:'mcq',q:'A cleaning rule had a bug for two months. Which layer lets you rebuild everything correctly?',o:['Bronze, because it holds the raw data unchanged','Gold','None'],a:0,w:'That is the reason for the rule "never change Bronze".'},
 {t:'mcq',q:'Where do duplicates and wrong data types get fixed?',o:['Between Bronze and Silver','Between Silver and Gold','In the report'],a:0,w:'Silver is the clean layer. Gold only reshapes and sums.'}]},

{id:'F19',min:40,t:'Full and incremental loads, MERGE, late data',sum:'Load only what changed, and survive reruns',
 body:`<p>A <b>full load</b> copies everything every time. It is simple and always correct, but slow and expensive for big tables. An <b>incremental load</b> copies only rows that are new or changed since the last run.</p>
 ${W('incremental')}
 <h4>The watermark pattern, step by step</h4>
 <p>You need a column in the source that grows, usually a "last modified" date or a rising ID. The last value you loaded is the <b>watermark</b>. You keep it in a small control table.</p>
 ${txt`1  read the old watermark     SELECT wm FROM ctl.watermark WHERE table_name = 'hatch'
2  read the new maximum       SELECT MAX(modified_at) FROM src.hatch
3  copy the rows between      SELECT * FROM src.hatch WHERE modified_at > :old AND modified_at <= :new
4  save the new watermark     UPDATE ctl.watermark SET wm = :new WHERE table_name = 'hatch'`}
 <p>Step 4 runs only when step 3 succeeded. If the copy fails, the watermark stays, and the next run takes the same rows again. Nothing is lost.</p>
 <h4>Upsert with MERGE</h4>
 <p>New rows must be inserted. Changed rows must be updated. Doing both in one statement is called an <b>upsert</b>. In Delta you use MERGE.</p>
 ${py`from delta.tables import DeltaTable

target = DeltaTable.forName(spark, "hatch_silver")
(target.alias("t")
   .merge(changes.alias("s"), "t.hatch_id = s.hatch_id")
   .whenMatchedUpdateAll()          # row exists: update it
   .whenNotMatchedInsertAll()       # row is new: insert it
   .execute())`}
 ${sql`-- the same in SQL (Spark SQL. Most warehouses have the same statement)
MERGE INTO hatch_silver AS t
USING changes AS s ON t.hatch_id = s.hatch_id
WHEN MATCHED THEN UPDATE SET t.hatched = s.hatched, t.modified_at = s.modified_at
WHEN NOT MATCHED THEN INSERT (hatch_id, hatched, modified_at) VALUES (s.hatch_id, s.hatched, s.modified_at);`}
 ${warn('MERGE fails or gives wrong results when the source has two rows for the same key. First reduce the changes to one row per key (the newest), then merge.')}
 <h4>Idempotent: safe to run twice</h4>
 <p>A load is <b>idempotent</b> when running it twice gives the same result as running it once. This matters because jobs fail and get restarted. Append is not idempotent: a rerun doubles the rows. MERGE is. "Delete the day, then insert the day" is too.</p>
 <h4>What about deleted rows?</h4>
 <p>A watermark does not see rows that were deleted in the source. Three answers: the source marks rows as deleted instead of removing them (soft delete), or you use <b>change data capture</b> (CDC), where the database gives you a list of all inserts, updates and deletes, or you do a full comparison from time to time.</p>
 <h4>Late-arriving data</h4>
 <p>A row for Monday arrives on Wednesday. If you load "all rows with business date = yesterday", you miss it. Rules:</p>
 <ul><li>Filter by <b>change date</b> or load time, not by business date.</li>
 <li>Or reload a moving window, for example always the last 7 days, with MERGE.</li>
 <li>In a star schema, a fact can arrive before its dimension row. Then give the fact the key of the "Unknown" member (for example -1) and fix it later, or create an empty dimension row for the new key.</li></ul>`,
 know:'You have done this in SSIS with a control table and a MAX(ModifiedDate). The pattern is the same. Only the activities have new names.',
 key:['Watermark: old value, new value, copy between, then save the new value.','MERGE = update when matched, insert when not matched. One row per key in the source.','Idempotent loads survive reruns. Append does not.'],
 do:['Add a <code>modified_at</code> column to your sample data.','Build the four steps in a notebook, with a small control table.','Change two rows and add one. Run again. Check that exactly three rows moved.','Run the notebook with MERGE twice and check that the row count does not grow.'],
 links:[['Delta MERGE','https://docs.delta.io/latest/delta-update.html']],
 ex:[
 {t:'order',q:'Order the steps of a watermark load.',items:['Read the old watermark','Read the new maximum from the source','Copy rows between old and new','Save the new watermark'],w:'Save the watermark last, and only on success.'},
 {t:'mcq',q:'The nightly job loads changed rows. Existing rows must be updated and new rows inserted. Which statement?',o:['MERGE','TRUNCATE','VACUUM'],a:0,w:'MERGE is the upsert.'},
 {t:'mcq',q:'A load with mode("append") is restarted after a failure. What can happen?',o:['Duplicates','Nothing, append is idempotent','The table is dropped'],a:0,w:'Append adds the same rows again. Use MERGE or delete-then-insert.'},
 {t:'mcq',q:'Your watermark load never removes rows that were deleted in the source. What solves this?',o:['Change data capture, or soft deletes in the source','A bigger capacity','OPTIMIZE'],a:0,w:'A watermark sees only rows that still exist.'},
 {t:'mcq',q:'A fact row arrives, but its hatchery is not yet in the dimension. What is a correct way to load it?',o:['Drop the row','Use the key of the "Unknown" member and correct it later','Stop all loads'],a:1,w:'Never lose facts. The unknown member keeps totals right.'},
 {t:'mcq',q:'MERGE reports that several source rows match the same target row. What do you do first?',o:['Deduplicate the source to one row per key','Run VACUUM','Switch to append'],a:0,w:'Keep the newest per key with row_number, then merge.'}]},

{id:'F7',min:45,t:'The dimensional model',sum:'Star schema and slowly changing dimensions. Your BI years are an advantage here',
 body:`<p>Whatever the engine is (Snowflake, Databricks SQL, BigQuery, Fabric, Postgres), data for reporting is shaped the same way. This is where your BI years give you an advantage over most engineers who come from software.</p>
 <h4>The star schema</h4>
 <p>Reports like a <b>star schema</b>. A <b>fact</b> table holds events with numbers you add up, such as eggs set. <b>Dimension</b> tables hold the words you filter and group by, such as hatchery, flock or date.</p>
 ${txt`             dim_date                dim_hatchery
          (date_key, date,        (hatchery_key, name,
           week, month, year)      region, manager)
                 \                    /
                  \                  /
                    fact_hatch
          (date_key, hatchery_key, flock_key,
           eggs_set, hatched)                ← numbers
                  /
                 /
             dim_flock
          (flock_key, breed, age_weeks)`}
 <p>Four decisions make a good model:</p>
 <ol><li><b>Grain</b>: what is one row of the fact? "One setting of eggs per hatchery, machine and day." Decide this first and write it down.</li>
 <li><b>Surrogate keys</b>: each dimension row gets its own simple number as key. Do not use the key from the source system. Sources change and merge.</li>
 <li><b>Load order</b>: dimensions first, then facts. A fact needs the keys of its dimensions.</li>
 <li><b>Unknown member</b>: a row with key -1 in every dimension. Facts without a match point to it. Then no fact is lost and totals stay right.</li></ol>
 <h4>Slowly changing dimensions (SCD)</h4>
 <p>Hatchery Nord gets a new manager. What happens to old facts?</p>
 ${tbl(['Type','What you do','Result'],[
  ['<b>Type 1</b>','Overwrite the value','History is lost. Old facts now show the new manager.'],
  ['<b>Type 2</b>','Close the old row and add a new row with a new surrogate key','History is kept. Old facts keep the old manager.']])}
 ${W('scd')}
 ${sql`-- Type 2, step 1: close the current row when something changed
UPDATE d SET d.valid_to = s.change_date, d.is_current = 0
FROM   dbo.dim_hatchery AS d
JOIN   stg.hatchery AS s ON s.hatchery_id = d.hatchery_id
WHERE  d.is_current = 1 AND d.manager <> s.manager;

-- step 2: insert a new current row for changed and for new hatcheries
INSERT INTO dbo.dim_hatchery (hatchery_id, name, manager, valid_from, valid_to, is_current)
SELECT s.hatchery_id, s.name, s.manager, s.change_date, '9999-12-31', 1
FROM   stg.hatchery AS s
LEFT JOIN dbo.dim_hatchery AS d ON d.hatchery_id = s.hatchery_id AND d.is_current = 1
WHERE  d.hatchery_id IS NULL;`}
 <p>When you load facts, you look up the dimension row that was valid <b>on the date of the fact</b>: <code>fact.date >= valid_from AND fact.date < valid_to</code>.</p>`,
 know:'Kimball still applies. Only the engines changed.',
 key:['Grain first. Surrogate keys. Dimensions before facts. Unknown member -1.','SCD 1 overwrites. SCD 2 adds a row with valid_from, valid_to, is_current.','Look up the dimension row that was valid on the date of the fact.'],
 do:['Create <code>dim_hatchery</code> and <code>fact_hatch</code> with CREATE TABLE.','Load them from your gold table with INSERT ... SELECT.','Change the manager of one hatchery in the staging data and run the two Type 2 statements.','Write a query that joins fact and dimension.'],
 links:[['Kimball dimensional modeling techniques','https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/']],
 ex:[
 {t:'fill',q:'In a star schema, the ___ table holds the numbers you add up.',a:['fact'],w:'Fact = numbers. Dimension = descriptions.'},
 {t:'mcq',q:'A customer moves to another city. Old sales must still show under the old city. Which SCD type?',o:['Type 1','Type 2'],a:1,w:'Type 2 keeps history with a new row.'},
 {t:'order',q:'Order the nightly load of a star schema.',items:['Load staging tables','Load dimensions','Load facts with dimension key lookup','Refresh the semantic model'],w:'Facts need dimension keys. Reports come last.'},
 {t:'mcq',q:'What is the "grain" of a fact table?',o:['The file size','What exactly one row stands for','The number of columns'],a:1,w:'Example: one row per hatchery, machine and day.'},
 {t:'mcq',q:'Why use surrogate keys in dimensions?',o:['They are independent of source systems and make Type 2 history possible','They are required by Parquet','They make text shorter'],a:0,w:'Two versions of one hatchery need two different keys.'}]},

{id:'F23',min:40,t:'Make Delta tables and Spark fast',sum:'Small files, OPTIMIZE, Z-Order, partitions, and Spark tuning',
 body:`<h4>The small file problem</h4>
 <p>Every write adds new Parquet files. A stream or a job that appends every few minutes creates thousands of tiny files. To answer a query, the engine must open all of them. That is slow. The cure is to write fewer, bigger files.</p>
 ${tbl(['Tool','What it does','Remember'],[
  ['<b>OPTIMIZE</b>','Joins many small files into fewer big ones (compaction)','Run it regularly on tables with many small writes'],
  ['<b>Z-Order</b>','<code>OPTIMIZE t ZORDER BY (col)</code> puts rows with similar values of that column into the same files','Queries that filter on that column can skip most files'],
  ['<b>Optimize write</b>','Makes each write produce fewer, bigger files from the start','Good for tables with many small appends'],
  ['<b>VACUUM</b>','Deletes files that the table no longer uses and that are older than the retention time (default 7 days)','Frees storage. Time travel beyond the retention time is gone'],
  ['<b>Partitioning</b>','<code>partitionBy("year")</code> writes one folder per value','Only for columns with few values, like year or month. Too many partitions create small files again']])}
 ${sql`OPTIMIZE hatch_silver;                          -- compact
OPTIMIZE hatch_silver ZORDER BY (hatchery);     -- compact and cluster by a filter column
VACUUM hatch_silver;                            -- remove unused files older than 7 days
VACUUM hatch_silver RETAIN 168 HOURS;           -- the same, written out`}
 ${trap('OPTIMIZE and VACUUM do different jobs. OPTIMIZE makes reading faster and leaves the old small files on disk. VACUUM removes old files and saves storage, but does not make queries faster. Typical order: OPTIMIZE, later VACUUM. And: a very short VACUUM retention can break readers and time travel.')}
 <h4>Spark tuning: the short list</h4>
 ${tbl(['Problem','What to do'],[
  ['Reading too much','Filter early. Select only needed columns. Then Spark skips files and columns (predicate pushdown, column pruning)'],
  ['Joins are slow','Broadcast the small table. Join on numbers, not on long text'],
  ['Skew','Let <b>adaptive query execution</b> split the big partition. It is on by default. Or handle the heavy key separately'],
  ['Python UDF is slow','Use built-in functions. A UDF runs row by row in Python'],
  ['The same DataFrame is computed many times','<code>df.cache()</code>, and <code>unpersist()</code> when you are done'],
  ['Too many or too few partitions','<code>repartition(n)</code> makes more (with a shuffle). <code>coalesce(n)</code> makes fewer (no full shuffle)']])}
 <p>A <b>shuffle</b> is when Spark must move rows between executors, for example for a join or a groupBy. It is the most expensive thing Spark does. Most tuning is avoiding or shrinking shuffles.</p>
 ${py`spark.conf.set("spark.sql.shuffle.partitions", "64")      # default 200. Fewer for small data
display(df.groupBy("hatchery").count().orderBy("count", ascending=False))   # look for skew
df.explain()                                               # show the plan Spark will run`}`,
 know:'OPTIMIZE is like an index rebuild. Z-Order is the nearest thing to a clustered index. VACUUM is like cleaning up old log backups. Partitioning is the table partitioning you know, with the same warning about too many partitions.',
 key:['Many small files = slow. OPTIMIZE compacts.','Z-Order = file skipping on a filter column.','VACUUM removes old files and ends time travel for them.'],
 do:['Append to a table ten times in a loop. Look at the number of files in the Tables folder.','Run <code>OPTIMIZE</code> and look at <code>DESCRIBE HISTORY</code>.','Run <code>df.explain()</code> on a join with and without <code>broadcast()</code>.'],
 links:[['Delta: optimizations','https://docs.delta.io/latest/optimizations-oss.html']],
 ex:[
 {t:'mcq',q:'A streaming job appends to a table every minute. After a month, queries are slow. What is the cause and the fix?',o:['Many small files. Run OPTIMIZE regularly','Too few files. Run VACUUM','The table has no primary key'],a:0,w:'Compaction solves the small file problem.'},
 {t:'mcq',q:'Most queries filter on hatchery. Which command lets the engine skip files?',o:['OPTIMIZE t ZORDER BY (hatchery)','VACUUM t','DESCRIBE HISTORY t'],a:0,w:'Z-Order puts similar values together, so min/max statistics exclude files.'},
 {t:'mcq',q:'After VACUUM with the default retention, which statement is true?',o:['Versions older than 7 days can no longer be read with time travel','The table is faster','All history is kept'],a:0,w:'The old files are gone.'},
 {t:'mcq',q:'You partition a 2 GB table by customer_id with 100,000 customers. What happens?',o:['Queries become very fast','You get a huge number of tiny files and it becomes slow','Nothing changes'],a:1,w:'Partition only by columns with few values.'},
 {t:'mcq',q:'What is a shuffle?',o:['Spark moves rows between executors, for example for a join or group','Random sorting of the result','A type of file'],a:0,w:'Shuffles are the main cost in Spark.'},
 {t:'mcq',q:'A notebook uses a Python UDF to upper-case a column on 500 million rows. What is the best improvement?',o:['Use the built-in function upper()','Add more comments','Use collect()'],a:0,w:'Built-in functions run inside the engine. UDFs go row by row through Python.'},
 {t:'mcq',q:'You must reduce 400 partitions to 8 before writing, without a full shuffle. Which method?',o:['coalesce(8)','repartition(8)','cache()'],a:0,w:'coalesce merges partitions. repartition shuffles everything.'}]}
];
window.DATA_OLD=S;
})();
