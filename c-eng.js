// Engineering core line: Python, shell, Git, Docker, APIs, CI/CD, cloud, Terraform, Kubernetes, observability.
// Reuses the Git and CI/CD stations from c-devops.js.
(function(){
const {py,sql,txt,yaml,sh,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;
const old={};TRACKS.devops.stations.forEach(s=>{delete s.sec;old[s.id]=s});delete TRACKS.devops;
const sec=(s,name)=>Object.assign(s,{sec:name});

WD.annot.docker={l:'sh',title:'A Dockerfile, line by line',lines:[
 ['FROM python:3.12-slim','Start from a ready image: a small Linux with Python 3.12. Always pin a version, never "latest".'],
 ['WORKDIR /app','All following commands run in this folder inside the image.'],
 ['COPY requirements.txt .','Copy only the list of packages first.'],
 ['RUN pip install --no-cache-dir -r requirements.txt','Install the packages. Docker saves the result as a layer. If requirements.txt did not change, the next build reuses this layer and takes seconds, not minutes.'],
 ['COPY src/ ./src/','Now copy your code. Code changes often, so it comes after the slow step.'],
 ['USER 1000','Do not run as root. If someone breaks into the container, they have fewer rights.'],
 ['EXPOSE 8000','Documentation: the app listens on port 8000.'],
 ['CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]','The command that runs when a container starts from this image.']]};

WD.scenario.incident={title:'07:30. The dashboard shows yesterday\'s numbers',intro:'You are the engineer on call. Choose what you do at each step.',steps:[
 {t:'A manager writes: "The numbers are a day old. I need them at 08:00." What do you do first?',o:[
  ['Open the orchestrator and look for failed runs of last night',2,'Right. Look at facts first: which run, which task, what status.'],
  ['Start the whole nightly job again at once',0,'Risky. You do not know what failed. A blind rerun can fail again or double rows.'],
  ['Reload the dashboard a few times',0,'The dashboard only shows what is in the tables. The problem is further back.']]},
 {t:'The run failed at 02:14 in the task "extract_orders". Log: "connection refused: db-prod:5432". What does it tell you?',o:[
  ['A connection problem to the source database. Not a data or code problem',2,'Right. Reading the exact error text saves an hour of guessing.'],
  ['The disk is full',0,'The message names a connection, not storage.'],
  ['The transformation has a bug',0,'The transformation never ran. The step before it failed.']]},
 {t:'You learn that the database was restarted for maintenance at 02:00 and is back. How do you continue?',o:[
  ['Rerun only the failed task and what depends on it',2,'Right. Earlier tasks succeeded. Because your tasks are idempotent, rerunning is safe.'],
  ['Rerun everything from the start',1,'It works when tasks are idempotent, but it takes longer than needed.'],
  ['Wait for tonight\'s run',0,'Then the numbers are wrong for a full day.']]},
 {t:'08:00, the numbers are right. What do you do so that it does not happen again?',o:[
  ['Add retries with a wait, an alert on failure, and agree on a maintenance window with the database team',2,'Right. Tolerate short outages, make failures visible, and remove the cause.'],
  ['Nothing. It works again',0,'It will happen at the next maintenance, and again a manager finds it before you do.'],
  ['Run the job twice every night to be safe',0,'Twice the cost, and both runs can hit the same outage.']]},
 {t:'What do you write down afterwards?',o:[
  ['A short blameless note: what happened, the timeline, the cause, what we changed',2,'Right. This is a postmortem. It is about the system, not about who is guilty. Teams that write them have fewer repeats.'],
  ['Who restarted the database, with their name in bold',0,'Blame makes people hide problems next time.'],
  ['Nothing',0,'Then the next person on call starts from zero.']]}],
 end:[[9,'Excellent. Facts first, smallest fix, then prevention, then a note. That is senior behaviour.'],[6,'Good. Read the feedback of the steps you missed. The order matters: look, understand, fix, prevent.'],[0,'Go through it again. The key habit: read the exact error before you touch anything.']]};

const N={
EN1:{id:'EN1',sec:'Python',min:45,t:'Python for engineers: from script to module',sum:'The language of every AI and data job ad',
 body:`<p>Python appears in more AI and data job ads than any other skill. You do not need to know all of it. You need to write code that another person can read, test and run. That is the difference between a notebook user and an engineer.</p>
 <h4>The basics, with the SQL idea next to it</h4>
 ${py`rows = [{"hatchery": "Nord", "eggs": 1000, "hatched": 850},
        {"hatchery": "Süd",  "eggs": 1200, "hatched": 0}]        # a list of dicts = a small table

good = [r for r in rows if r["hatched"] > 0]                     # WHERE
rates = {r["hatchery"]: r["hatched"] / r["eggs"] for r in good}  # SELECT key, expr
total = sum(r["eggs"] for r in rows)                             # SUM
best = max(rows, key=lambda r: r["hatched"])                     # ORDER BY ... LIMIT 1
names = sorted({r["hatchery"] for r in rows})                    # DISTINCT + ORDER BY`}
 <h4>Functions with type hints</h4>
 ${py`def hatch_rate(hatched: int, eggs_set: int) -> float | None:
    """Return the hatch rate in percent, or None when no eggs were set."""
    if eggs_set <= 0:
        return None
    return round(hatched * 100 / eggs_set, 1)`}
 <p><b>Type hints</b> (<code>: int</code>, <code>-> float</code>) do not change how the code runs. They tell readers and tools what goes in and out. An editor then finds many mistakes before you run anything. Professional Python is typed.</p>
 <h4>Data classes: a row with a shape</h4>
 ${py`from dataclasses import dataclass
from datetime import date

@dataclass(frozen=True)
class Setting:
    hatchery: str
    set_date: date
    eggs_set: int
    hatched: int

    @property
    def rate(self) -> float | None:
        return hatch_rate(self.hatched, self.eggs_set)`}
 <h4>Errors: fail loudly, in the right place</h4>
 ${py`import logging
log = logging.getLogger(__name__)

def load(path: str) -> list[Setting]:
    try:
        with open(path, encoding="utf-8") as f:      # "with" closes the file, also on errors
            return parse(f)
    except FileNotFoundError:
        log.error("input file missing: %s", path)
        raise                                        # do not hide the error. Let the job fail`}
 ${warn('The most damaging habit in data code is <code>except: pass</code>. It hides the error, the job turns green, and the numbers are wrong. Catch only the error you expect, log it, and raise it again unless you can really handle it.')}
 <h4>A project, not a file</h4>
 ${txt`hatchery/
  pyproject.toml        ← name, Python version, dependencies
  src/hatchery/
    __init__.py
    transform.py        ← pure functions: data in, data out
    io.py               ← reading and writing
    cli.py              ← the entry point
  tests/
    test_transform.py
  README.md`}
 ${sh`uv init hatchery && cd hatchery     # uv is the fast modern tool for Python projects
uv add polars pydantic              # adds the package and locks the exact version
uv add --dev pytest ruff
uv run pytest                       # run tests inside the project environment
uv run ruff check .                 # lint: find style problems and simple bugs`}
 <p>Each project has its own <b>virtual environment</b> with its own packages, so two projects never fight over versions. A <b>lock file</b> records the exact versions, so the code runs the same on your laptop, in CI and in production. You will also meet the older tools <code>pip</code> and <code>venv</code>. They do the same job.</p>`,
 know:'A function with type hints is like a stored procedure with typed parameters. A virtual environment is like a separate database per application: nothing leaks between them.',
 key:['Typed functions, small and pure: data in, data out.','Never hide errors. Log and raise.','One project = pyproject.toml, src, tests, lock file.'],
 do:['Install Python 3.12 and uv. Create the project layout above.','Write <code>hatch_rate</code> and two tests for it.','Rewrite one of your SQL transformations as a typed Python function over a list of dicts.','Do 20 minutes of Python every day for the first month. Small and daily beats long and rare.'],
 links:[['Official Python tutorial','https://docs.python.org/3/tutorial/'],['uv documentation','https://docs.astral.sh/uv/'],['Exercism: Python track (free practice)','https://exercism.org/tracks/python']],
 ex:[
 {t:'mcq',q:'What does [r for r in rows if r["hatched"] > 0] do?',o:['Builds a new list with only the rows where hatched is above 0','Deletes rows from the list','Sorts the rows'],a:0,w:'A list comprehension with a condition is a WHERE.'},
 {t:'mcq',q:'What do type hints do?',o:['They document inputs and outputs and let tools find mistakes','They make the code run faster','They convert values automatically'],a:0,w:'Python does not enforce them at run time.'},
 {t:'mcq',q:'Why is "except: pass" dangerous in a data job?',o:['The error disappears, the job looks successful, and the data is wrong','It is slow','It uses too much memory'],a:0,w:'Silent failure is worse than a crash.'},
 {t:'mcq',q:'What is a lock file for?',o:['It records exact package versions so the code runs the same everywhere','It locks the database','It stores passwords'],a:0,w:'Reproducible builds.'},
 {t:'fill',q:'Complete: def rate(hatched: int, eggs: int) ___ float:',a:['->'],w:'-> gives the return type.'}]},

EN2:{id:'EN2',min:45,t:'Python that touches the world: files, APIs, data, tests',sum:'JSON, HTTP, Pydantic, Polars, pytest',
 body:`<h4>JSON and HTTP</h4>
 ${py`import httpx

def fetch_prices(day: str) -> list[dict]:
    resp = httpx.get("https://api.example.com/prices", params={"date": day}, timeout=10)
    resp.raise_for_status()            # 4xx and 5xx become exceptions
    return resp.json()["items"]`}
 <p>Three habits for every call to another system: set a <b>timeout</b>, check the <b>status</b>, and <b>retry</b> with a growing wait when the error is temporary (a 429 "too many requests" or a 503).</p>
 <h4>Pydantic: check data at the door</h4>
 ${py`from pydantic import BaseModel, Field
from datetime import date

class Price(BaseModel):
    day: date
    region: str
    eur_mwh: float = Field(ge=-500, le=5000)     # a range check

prices = [Price.model_validate(item) for item in fetch_prices("2026-11-12")]`}
 <p><b>Pydantic</b> turns loose JSON into typed objects and raises a clear error when a field is missing or has the wrong type. It is used everywhere in AI engineering: for API inputs, for configuration, and for the structured output of language models.</p>
 <h4>Tables in Python: pandas and Polars</h4>
 ${py`import polars as pl

df = pl.read_csv("hatch.csv", try_parse_dates=True)
weekly = (df.filter(pl.col("eggs_set") > 0)
            .with_columns((pl.col("hatched") * 100 / pl.col("eggs_set")).round(1).alias("rate"))
            .group_by("hatchery")
            .agg(pl.col("eggs_set").sum(), pl.col("hatched").sum()))
weekly.write_parquet("weekly.parquet")`}
 <p><b>pandas</b> is the classic library, and you must be able to read it. <b>Polars</b> is newer, much faster, and its syntax looks like PySpark. <b>DuckDB</b> lets you run SQL directly on CSV and Parquet files on your laptop. For data that fits on one machine, these three replace a Spark cluster.</p>
 <h4>Tests with pytest</h4>
 ${py`# tests/test_transform.py
import pytest
from hatchery.transform import hatch_rate

def test_normal():
    assert hatch_rate(850, 1000) == 85.0

def test_zero_eggs_gives_none():
    assert hatch_rate(0, 0) is None

@pytest.mark.parametrize("hatched, eggs, expected", [(1, 3, 33.3), (2, 3, 66.7)])
def test_rounding(hatched, eggs, expected):
    assert hatch_rate(hatched, eggs) == expected`}
 <p>A test is a small function whose name starts with <code>test_</code> and that contains <code>assert</code>. Test the edges: zero, null, empty list, duplicate, a date at midnight. Bugs live at the edges.</p>
 <h4>Configuration and secrets</h4>
 ${py`import os
DB_URL = os.environ["DB_URL"]          # read from the environment. Fails early if it is missing`}
 <p>Settings that differ between your laptop and production come from <b>environment variables</b>, never from the code. Secrets are never committed to Git.</p>
 <h4>Async in one paragraph</h4>
 <p>Calling a language model takes seconds, and most of that time your program only waits. With <code>async</code> and <code>await</code>, Python can wait for 50 calls at the same time on one thread. You will see it in every AI backend. Learn to read it now. Write it when you need it.</p>
 ${py`async def summarise_all(texts: list[str]) -> list[str]:
    return await asyncio.gather(*(summarise(t) for t in texts))    # all calls run concurrently`}`,
 key:['Every external call: timeout, status check, retry.','Pydantic validates data at the border of your program.','Polars or DuckDB for one machine. Spark for clusters.','Test the edges.'],
 do:['Fetch data from a free public API, validate it with a Pydantic model, and save it as Parquet.','Write five pytest tests, including two edge cases.','Query your Parquet file with DuckDB: <code>duckdb.sql("select * from \'weekly.parquet\'")</code>.'],
 links:[['Pydantic documentation','https://docs.pydantic.dev/'],['Polars user guide','https://docs.pola.rs/'],['pytest documentation','https://docs.pytest.org/']],
 ex:[
 {t:'mcq',q:'Which three habits belong to every HTTP call?',o:['Timeout, status check, retry on temporary errors','Print, sleep, exit','Loop, break, continue'],a:0,w:'Networks fail. Plan for it.'},
 {t:'mcq',q:'What is Pydantic used for?',o:['Validating data and turning it into typed objects','Drawing charts','Scheduling jobs'],a:0,w:'It checks data at the border.'},
 {t:'mcq',q:'Your data is 2 GB of Parquet on a laptop. Which tool is a sensible choice?',o:['Polars or DuckDB','A 20-node Spark cluster','Excel'],a:0,w:'One machine is enough. Simpler and cheaper.'},
 {t:'mcq',q:'Where does a database password belong?',o:['In an environment variable or a secret store','In the Python file','In the README'],a:0,w:'Never in Git.'},
 {t:'mcq',q:'Which inputs find the most bugs in tests?',o:['Edge cases: zero, null, empty, duplicate','The same normal value ten times','Only very large numbers'],a:0,w:'Bugs live at the edges.'}]},

EN3:{id:'EN3',sec:'Tools of the trade',min:30,t:'Linux and the shell',sum:'Almost every server and container runs Linux',
 body:`<p>Servers, containers and CI machines run Linux and have no screen. You work with them through text commands in a <b>shell</b>. On Windows, install <b>WSL</b> (Windows Subsystem for Linux). It gives you a real Linux inside Windows.</p>
 ${sh`pwd                       # where am I?
ls -la                    # list files, with details and hidden ones
cd projects/hatchery      # change folder
mkdir -p data/raw         # make folders
cp a.csv data/raw/        # copy.  mv = move or rename.  rm = delete (no recycle bin!)
cat file.txt              # print a file.  less file.txt = page through it
head -n 5 data.csv        # first 5 lines.  tail -f app.log = follow a growing log
grep -rn "ERROR" logs/    # search text in files
wc -l data.csv            # count lines
which python              # which program runs when I type "python"?
chmod +x run.sh           # make a script executable
export DB_URL="postgres://..."      # set an environment variable for this session
ssh user@server           # open a shell on another machine
curl -s https://api.example.com/health   # make an HTTP request`}
 <h4>Pipes: small tools joined together</h4>
 <p>The sign <code>|</code> sends the output of one command into the next. It is the same idea as chaining DataFrame methods.</p>
 ${sh`cat access.log | grep " 500 " | wc -l                 # how many server errors?
cut -d, -f2 data.csv | sort | uniq -c | sort -rn | head    # top values of column 2`}
 <p><code>&gt;</code> writes output to a file, <code>&gt;&gt;</code> appends. <code>&amp;&amp;</code> runs the next command only if the first one worked. Every command returns an <b>exit code</b>: 0 means success, anything else means failure. CI pipelines and orchestrators decide green or red from this number.</p>
 <h4>What to remember</h4>
 <ul><li>Paths use <code>/</code>. Names are case-sensitive.</li><li>A file starting with a dot is hidden: <code>.env</code>, <code>.gitignore</code>.</li><li><code>Ctrl+C</code> stops a running command. <code>Tab</code> completes names. The up arrow brings back old commands.</li><li><code>man grep</code> or <code>grep --help</code> shows the manual. Asking an AI assistant "what does this command do?" before you run it is a good habit.</li></ul>`,
 key:['ls, cd, cat, grep, head, tail are 80 % of daily use.','Pipes join small tools. Exit code 0 = success.','Use WSL on Windows.'],
 do:['Install WSL with Ubuntu.','In the shell, create a folder, a CSV with ten lines, and count the lines that contain a word.','Find the five most frequent values in one column of a CSV with cut, sort and uniq.'],
 links:[['The Missing Semester (MIT, free)','https://missing.csail.mit.edu/']],
 ex:[
 {t:'mcq',q:'What does the pipe sign | do?',o:['Sends the output of one command into the next','Deletes a file','Runs a command as admin'],a:0,w:'Small tools, joined.'},
 {t:'mcq',q:'A command returns exit code 1. What does that mean?',o:['It failed','It succeeded','It is still running'],a:0,w:'0 is success. Everything else is failure.'},
 {t:'fill',q:'The command to search for text inside files is ___',a:['grep'],w:'grep -rn "text" folder/'},
 {t:'mcq',q:'How do you follow a log file while a program writes to it?',o:['tail -f app.log','head app.log','rm app.log'],a:0,w:'-f = follow.'}]},

EN4:{id:'EN4',min:40,t:'Docker: it runs the same everywhere',sum:'Images, containers, Compose',
 body:`<p>"It works on my machine" is the oldest problem in software. <b>Docker</b> solves it by packing your program together with everything it needs: the Python version, the libraries, the system tools. The package is an <b>image</b>. A running copy of an image is a <b>container</b>.</p>
 ${tbl(['Word','Meaning','Like'],[
  ['<b>Image</b>','A read-only package: files plus the start command','A class, or an installer'],
  ['<b>Container</b>','A running instance of an image, isolated from the rest of the machine','An object, or a running program'],
  ['<b>Dockerfile</b>','The recipe that builds an image','A build script'],
  ['<b>Registry</b>','A store for images: Docker Hub, GitHub, Azure, AWS','A package server'],
  ['<b>Volume</b>','A folder that lives outside the container, so data survives when the container is deleted','A mounted disk'],
  ['<b>Port mapping</b>','<code>-p 8000:8000</code> connects a port of your machine to a port in the container','Port forwarding']])}
 ${W('annot','docker')}
 ${sh`docker build -t hatchery-api:0.1 .          # build an image from the Dockerfile in this folder
docker run --rm -p 8000:8000 -e DB_URL=... hatchery-api:0.1     # start a container
docker ps                                   # what is running?
docker logs -f <container>                  # follow the output
docker exec -it <container> bash            # open a shell inside it
docker images                               # local images`}
 <h4>Compose: several containers that belong together</h4>
 ${yaml`# compose.yaml
services:
  api:
    build: .
    ports: ["8000:8000"]
    environment:
      DB_URL: postgresql://app:app@db:5432/app     # "db" is the service name below
    depends_on: [db]
  db:
    image: pgvector/pgvector:pg17                  # Postgres with vector search
    environment: { POSTGRES_USER: app, POSTGRES_PASSWORD: app, POSTGRES_DB: app }
    volumes: ["pgdata:/var/lib/postgresql/data"]   # keep the data
volumes:
  pgdata:`}
 ${sh`docker compose up -d      # start everything in the background
docker compose logs -f api
docker compose down       # stop and remove the containers (the volume stays)`}
 <p>With one <code>compose.yaml</code> in the repository, anybody can start your whole project with one command. Every portfolio project on this site ends this way.</p>
 <h4>Good habits</h4>
 <ul><li>One process per container.</li><li>Small base images (<code>-slim</code>). Pin versions.</li><li>No secrets in the image. Pass them at start as environment variables.</li><li>Containers are throwaway. Anything that must survive goes into a volume or a database.</li><li>Add a <code>.dockerignore</code> so that data files and <code>.git</code> are not copied into the image.</li></ul>`,
 know:'A container is lighter than a virtual machine: it shares the kernel of the host and starts in a second. Think of an image as a database backup you can restore anywhere in exactly the same state.',
 key:['Image = package. Container = running copy.','Order the Dockerfile from rarely changed to often changed.','Compose starts a whole project with one command.'],
 do:['Install Docker Desktop (with WSL on Windows).','Write a Dockerfile for a small Python script and run it.','Start Postgres with Compose and connect to it from your script.','Change the code, rebuild, and notice that the package layer is reused.'],
 links:[['Docker: getting started','https://docs.docker.com/get-started/']],
 ex:[
 {t:'mcq',q:'What is the difference between an image and a container?',o:['The image is the package. The container is a running copy of it','They are the same','The container is bigger'],a:0,w:'One image, many containers.'},
 {t:'mcq',q:'Why copy requirements.txt and install packages BEFORE copying the code?',o:['So the slow install layer is reused when only the code changes','It is required by Python','To make the image bigger'],a:0,w:'Layers are cached top to bottom.'},
 {t:'mcq',q:'A database runs in a container. The container is deleted. What keeps the data?',o:['A volume','The image','Nothing can'],a:0,w:'Volumes live outside the container.'},
 {t:'mcq',q:'Where should an API key go?',o:['Passed as an environment variable at start','Written into the Dockerfile','Copied into the image as a file'],a:0,w:'Images get shared. Secrets must not be inside.'},
 {t:'fill',q:'The command that starts all services of a compose file in the background: docker compose ___ -d',a:['up'],w:'docker compose up -d'}]},

EN5:{id:'EN5',min:40,t:'APIs with FastAPI',sum:'How programs talk to each other, and how you build one',
 body:`<p>An <b>API</b> is a door through which other programs use your program. AI engineers build APIs all the time: a RAG system, an agent or a vision model becomes useful when another system can call it. Almost all of them speak <b>HTTP</b> and <b>JSON</b>.</p>
 ${tbl(['Method','Meaning','Example'],[
  ['<b>GET</b>','Read','GET /documents/42'],
  ['<b>POST</b>','Create, or run an action','POST /ask with a question in the body'],
  ['<b>PUT / PATCH</b>','Replace / change','PATCH /documents/42'],
  ['<b>DELETE</b>','Remove','DELETE /documents/42']])}
 ${tbl(['Status','Meaning'],[
  ['<b>200, 201</b>','OK, created'],['<b>400, 422</b>','Your request is wrong (bad input)'],['<b>401, 403</b>','Not logged in / not allowed'],['<b>404</b>','Not found'],['<b>429</b>','Too many requests. Wait and retry'],['<b>500, 503</b>','The server failed / is overloaded']])}
 <h4>A complete small API</h4>
 ${py`from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="Hatchery assistant")

class Question(BaseModel):
    text: str = Field(min_length=3, max_length=500)
    top_k: int = Field(default=3, ge=1, le=10)

class Answer(BaseModel):
    answer: str
    sources: list[str]

@app.get("/health")
def health() -> dict:
    return {"status": "ok"}

@app.post("/ask", response_model=Answer)
async def ask(q: Question) -> Answer:
    chunks = await retrieve(q.text, q.top_k)
    if not chunks:
        raise HTTPException(status_code=404, detail="No matching source found")
    return Answer(answer=await generate(q.text, chunks), sources=[c.id for c in chunks])`}
 ${sh`uv run uvicorn src.main:app --reload     # start it. Open http://localhost:8000/docs
curl -X POST localhost:8000/ask -H "Content-Type: application/json" -d '{"text": "What is a normal hatch rate?"}'`}
 <p><b>FastAPI</b> reads the Pydantic models. It checks every request for you, returns a clear 422 error for bad input, and builds an interactive documentation page at <code>/docs</code>. This page is the fastest way to show somebody your work.</p>
 <h4>What makes an API production-grade</h4>
 <ul><li><b>Validation</b> of all input. Limits on length and size.</li><li><b>Authentication</b>: an API key or a token in a header. Never an open endpoint in front of a paid model.</li><li><b>Timeouts and rate limits</b>, so one user cannot use up your budget.</li><li>A <b>/health</b> endpoint for the platform to check.</li><li><b>Structured logs</b> with a request ID, duration and status.</li><li><b>Streaming</b> for language model answers, so the user sees words at once.</li><li><b>Versioning</b>: <code>/v1/ask</code>. Do not break existing callers.</li></ul>`,
 know:'An API endpoint is like a stored procedure that other systems call over the network: named, with typed parameters, a typed result, and permissions.',
 key:['GET reads, POST acts. 4xx = caller\'s fault, 5xx = server\'s fault.','FastAPI + Pydantic = validated, documented endpoints.','Auth, limits, timeouts, health, logs.'],
 do:['Build the API above with a fake <code>retrieve</code> and <code>generate</code>.','Open <code>/docs</code> and call your endpoint from the browser.','Send a too-short question and read the 422 error.','Put the API into a Docker image.'],
 links:[['FastAPI tutorial','https://fastapi.tiangolo.com/tutorial/']],
 ex:[
 {t:'mcq',q:'Which status code means "the request body was invalid"?',o:['422','200','503'],a:0,w:'4xx codes are the caller\'s fault.'},
 {t:'mcq',q:'A client gets 429 from a model provider. What should it do?',o:['Wait and retry with a growing delay','Retry at once in a tight loop','Give up for ever'],a:0,w:'429 = too many requests. Back off.'},
 {t:'mcq',q:'What does FastAPI build from your Pydantic models?',o:['Input validation and a documentation page','A database','A Dockerfile'],a:0,w:'Open /docs to see it.'},
 {t:'mcq',q:'Your API calls a paid language model. What must not be missing?',o:['Authentication and rate limits','A dark theme','A second database'],a:0,w:'An open endpoint is an open wallet.'}]},

EN6:{id:'EN6',sec:'Cloud and infrastructure',min:35,t:'Cloud basics',sum:'Four building blocks, three providers, one bill',
 body:`<p>A cloud provider rents out computers, storage and ready-made services by the minute. All of them offer the same four building blocks under different names.</p>
 ${tbl(['Block','What it is','AWS','Azure','Google Cloud'],[
  ['<b>Compute</b>','Machines and containers that run code','EC2, ECS, Lambda','Virtual Machines, Container Apps, Functions','Compute Engine, Cloud Run'],
  ['<b>Object storage</b>','Cheap storage for files of any size','S3','Blob Storage / ADLS','Cloud Storage'],
  ['<b>Database</b>','Managed Postgres and others','RDS','Azure Database for PostgreSQL','Cloud SQL'],
  ['<b>Identity (IAM)</b>','Who may do what','IAM','Entra ID, RBAC','IAM'],
  ['<b>Network</b>','Private networks, firewalls','VPC','VNet','VPC'],
  ['<b>Kubernetes</b>','Managed clusters','EKS','AKS','GKE'],
  ['<b>AI models</b>','Language models as a service','Bedrock','Azure AI Foundry','Vertex AI']])}
 <h4>Ideas that matter more than service names</h4>
 <ul><li><b>Regions</b>: where the data centre is. German companies often require an EU region, for data protection.</li>
 <li><b>Least privilege</b>: every person and every program gets only the rights it needs. Programs use a <b>role</b> or <b>managed identity</b>, not a password in a file.</li>
 <li><b>Managed services first</b>: a managed database costs more per hour than your own server, and far less of your time.</li>
 <li><b>Serverless</b>: you give the provider a container or a function, and it runs it when needed and scales to zero when idle. Good for APIs with uneven load.</li>
 <li><b>Cost</b>: you pay for what is switched on, not for what you use. Set a <b>budget alert</b> on day one. Stop or delete what you do not need. A forgotten GPU machine can cost hundreds of euros in a week.</li>
 <li><b>Everything as code</b>: nothing important is created by clicking. The next station shows how.</li></ul>
 <h4>Which cloud to learn?</h4>
 <p>In European AI job ads, Azure and AWS appear about equally often, each in roughly a fifth of ads, and Google Cloud less. With your Microsoft background, <b>Azure</b> is the shortest way, and German mid-sized companies use it widely. Start-ups and SaaS companies lean towards AWS. Learn one well. The second one is mostly new names.</p>
 ${warn('Use the free tier and a budget alert. Never commit cloud keys to Git: automated scanners find leaked keys within minutes and people use them to run expensive machines on your bill.')}`,
 key:['Compute, storage, database, identity. The rest is built from these.','Least privilege. Roles, not passwords.','Budget alert on day one.'],
 do:['Open a free account in one cloud and set a budget alert of 10 euros.','Create a storage bucket, upload a file from the command line, and delete it again.','Deploy your FastAPI container to a serverless container service (Azure Container Apps or Cloud Run) and call it from your browser. Then delete it.'],
 links:[['Azure fundamentals (free)','https://learn.microsoft.com/en-us/training/paths/azure-fundamentals/'],['AWS free tier','https://aws.amazon.com/free/']],
 ex:[
 {t:'mcq',q:'Where do you put files of any size cheaply in the cloud?',o:['Object storage (S3, Blob Storage)','A virtual machine\'s desktop','A relational database'],a:0,w:'Object storage is the base of every data lake.'},
 {t:'mcq',q:'How should a program in the cloud get access to a storage bucket?',o:['Through a role or managed identity with only the needed rights','With the admin password in a config file','Public access for everybody'],a:0,w:'Least privilege, no stored passwords.'},
 {t:'mcq',q:'What should you set up on the first day of a cloud account?',o:['A budget alert','A GPU cluster','Ten regions'],a:0,w:'Forgotten resources are the usual cause of surprise bills.'},
 {t:'mcq',q:'An API gets requests only a few times per hour. Which model keeps the cost low?',o:['Serverless containers that scale to zero','A large machine running all day','A Kubernetes cluster with ten nodes'],a:0,w:'You pay only while it runs.'}]},

EN7:{id:'EN7',min:35,t:'Terraform: infrastructure as code',sum:'Describe the cloud in files, review it, apply it',
 body:`<p>Clicking in a cloud portal is not repeatable, and nobody remembers what was clicked. With <b>Terraform</b> you describe the infrastructure you want in text files. Terraform compares the files with reality and makes the needed changes. The files live in Git, so infrastructure gets history and review like code. Terraform appears in a large share of platform and MLOps job ads. (<b>OpenTofu</b> is the open-source twin with the same language.)</p>
 ${txt`# main.tf
terraform {
  required_providers {
    azurerm = { source = "hashicorp/azurerm", version = "~> 4.0" }
  }
}

variable "env" { type = string }                       # dev, test or prod

resource "azurerm_resource_group" "rg" {
  name     = "rg-hatchery-${'$'}{var.env}"
  location = "germanywestcentral"
}

resource "azurerm_storage_account" "lake" {
  name                     = "sthatchery${'$'}{var.env}"
  resource_group_name      = azurerm_resource_group.rg.name      # a reference creates the order
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  is_hns_enabled           = true                                 # data lake storage
}

output "lake_name" { value = azurerm_storage_account.lake.name }`}
 ${sh`terraform init                 # download the provider
terraform plan -var env=dev    # show what WOULD change. Read it every time
terraform apply -var env=dev   # make the changes
terraform destroy -var env=dev # remove everything again`}
 ${tbl(['Word','Meaning'],[
  ['<b>Provider</b>','The plug-in for one platform: Azure, AWS, Kubernetes, Databricks, Snowflake'],
  ['<b>Resource</b>','One thing to create: a storage account, a database, a role assignment'],
  ['<b>State</b>','Terraform\'s memory of what it created. Stored in a shared, locked place (a storage bucket), never on a laptop, never in Git. It can contain secrets'],
  ['<b>Plan</b>','The list of changes before they happen: + create, ~ change, - destroy'],
  ['<b>Module</b>','A reusable group of resources with inputs and outputs. "Our standard data lake" as one block'],
  ['<b>Drift</b>','Somebody changed a resource by hand, so reality and code differ. The next plan shows it']])}
 <h4>How teams use it</h4>
 <ol><li>A change is a pull request. CI runs <code>terraform plan</code> and posts the result.</li><li>A colleague reviews the plan. A line with "destroy" on a database gets extra attention.</li><li>After the merge, a pipeline runs <code>terraform apply</code>. Nobody applies from a laptop.</li><li>Dev, test and prod use the same code with different variables.</li></ol>`,
 know:'Terraform is a database project with schema compare, but for cloud resources: the files say what should exist, the plan is the diff script, and apply runs it.',
 key:['Write the wanted state. plan shows the diff. apply makes it real.','State is shared, locked, and secret.','Infrastructure changes go through pull requests.'],
 do:['Install Terraform. Create a storage account or bucket with the code above.','Change one setting and read the plan before applying.','Run <code>terraform destroy</code> at the end.','Put the files into the repository of your portfolio project.'],
 links:[['Terraform tutorials','https://developer.hashicorp.com/terraform/tutorials']],
 ex:[
 {t:'mcq',q:'What does "terraform plan" do?',o:['Shows the changes that would be made, without making them','Creates the resources','Deletes the state'],a:0,w:'Always read the plan.'},
 {t:'mcq',q:'Where does the Terraform state of a team belong?',o:['In shared, locked remote storage','In Git','On one developer\'s laptop'],a:0,w:'It can hold secrets, and two people must not apply at once.'},
 {t:'mcq',q:'A colleague changed a firewall rule by hand in the portal. What is this called?',o:['Drift','A module','A provider'],a:0,w:'Reality no longer matches the code. The next plan shows it.'},
 {t:'mcq',q:'In a plan you read "- destroy" next to the production database. What do you do?',o:['Stop and find out why before anything is applied','Apply quickly','Ignore it'],a:0,w:'Some resources are replaced when a setting changes. Destroying a database destroys data.'}]},

EN8:{id:'EN8',min:35,t:'Kubernetes: enough to work with it',sum:'Pods, deployments, services. And when you do not need it',
 body:`<p>Docker runs containers on one machine. <b>Kubernetes</b> (short: K8s) runs containers on many machines. You tell it what you want, for example "three copies of my API, always", and it keeps that true: it restarts crashed containers, moves them when a machine dies, and adds copies under load. It is in about a fifth of European AI job ads and in most platform ads.</p>
 ${tbl(['Object','Meaning'],[
  ['<b>Pod</b>','The smallest unit: one or a few containers that run together'],
  ['<b>Deployment</b>','"Keep N copies of this pod running, and roll out new versions one by one"'],
  ['<b>Service</b>','A stable name and address in front of the pods, with load balancing'],
  ['<b>Ingress</b>','The door from the internet to services, with host names and TLS'],
  ['<b>ConfigMap / Secret</b>','Settings and secrets, given to pods as environment variables or files'],
  ['<b>Namespace</b>','A folder that separates teams or environments'],
  ['<b>Job / CronJob</b>','Run something once, or on a schedule'],
  ['<b>Helm chart</b>','A package of YAML files with variables. The usual way to install software on a cluster']])}
 ${yaml`apiVersion: apps/v1
kind: Deployment
metadata: { name: hatchery-api }
spec:
  replicas: 3
  selector: { matchLabels: { app: hatchery-api } }
  template:
    metadata: { labels: { app: hatchery-api } }
    spec:
      containers:
      - name: api
        image: ghcr.io/tori/hatchery-api:0.3.1          # a fixed version, never "latest"
        ports: [{ containerPort: 8000 }]
        envFrom: [{ secretRef: { name: hatchery-secrets } }]
        resources:
          requests: { cpu: "250m", memory: "256Mi" }    # what it needs
          limits:   { memory: "512Mi" }                 # where it is stopped
        readinessProbe:
          httpGet: { path: /health, port: 8000 }        # traffic only when this answers`}
 ${sh`kubectl apply -f deployment.yaml      # send the wanted state to the cluster
kubectl get pods                      # what is running?
kubectl describe pod <name>           # why is it not starting? Read "Events" at the bottom
kubectl logs -f <name>                # the output
kubectl rollout undo deployment/hatchery-api    # go back to the version before`}
 <h4>Reading problems</h4>
 ${tbl(['Status','Usual cause'],[
  ['<b>ImagePullBackOff</b>','Wrong image name or tag, or no permission to the registry'],
  ['<b>CrashLoopBackOff</b>','The program starts and exits with an error. Read the logs'],
  ['<b>Pending</b>','No machine has enough free CPU, memory or GPU'],
  ['<b>OOMKilled</b>','The container used more memory than its limit']])}
 <h4>When not to use it</h4>
 <p>Kubernetes is heavy. For one API or a small project, a serverless container service is simpler and cheaper. Large companies use Kubernetes because one platform team can serve hundreds of developers with it. So: know the objects, be able to read YAML and debug a pod, and deploy something once. You do not have to be a cluster administrator.</p>`,
 know:'Kubernetes is declarative like SQL: you say what should be true, not how to get there. It keeps checking and repairs.',
 key:['Deployment keeps N pods. Service gives them one address.','kubectl get, describe, logs solve most problems.','Small project: serverless containers. Big organisation: Kubernetes.'],
 do:['Install <code>kind</code> or use the Kubernetes of Docker Desktop.','Deploy your API with the YAML above and a Service.','Delete a pod and watch Kubernetes start a new one.','Break the image name on purpose and find the error with <code>kubectl describe</code>.'],
 links:[['Kubernetes basics (interactive)','https://kubernetes.io/docs/tutorials/kubernetes-basics/']],
 ex:[
 {t:'mcq',q:'What does a Deployment do?',o:['Keeps a set number of pod copies running and rolls out new versions','Stores secrets','Opens the cluster to the internet'],a:0,w:'Wanted state: N replicas.'},
 {t:'mcq',q:'A pod shows CrashLoopBackOff. What is your first command?',o:['kubectl logs','kubectl delete namespace','terraform destroy'],a:0,w:'The program exits with an error. The log says why.'},
 {t:'mcq',q:'A pod is "Pending" and needs a GPU. What is the likely reason?',o:['No node has a free GPU','The image name is wrong','The code has a bug'],a:0,w:'Pending means the scheduler finds no place for it.'},
 {t:'mcq',q:'You have one small API with little traffic. What is the sensible choice?',o:['A serverless container service','Your own Kubernetes cluster','Three clusters in three regions'],a:0,w:'Match the tool to the size of the problem.'}]},

EN9:{id:'EN9',min:35,t:'Observability and being on call',sum:'Logs, metrics, traces, and what to do at 02:00',
 body:`<p>You cannot fix what you cannot see. <b>Observability</b> means your system tells you what it is doing.</p>
 ${tbl(['Signal','What it is','Question it answers','Tools'],[
  ['<b>Logs</b>','Lines of text or JSON about single events','What exactly happened in this request?','Loki, Elastic, cloud logging'],
  ['<b>Metrics</b>','Numbers over time','How many, how fast, how full?','Prometheus, Grafana, cloud monitoring'],
  ['<b>Traces</b>','The path of one request through all services, with timings','Where is the time going?','OpenTelemetry, Jaeger, Langfuse for LLM calls']])}
 <h4>Good logs</h4>
 ${py`log.info("ask finished", extra={"request_id": rid, "user": uid, "chunks": 4,
                                 "tokens_in": 3120, "tokens_out": 280, "ms": 1840, "status": "ok"})`}
 <p>Log as <b>structured</b> data (JSON), with a request ID that appears in every line of that request. Never log passwords or personal data.</p>
 <h4>The four numbers of every service</h4>
 <p><b>Latency</b> (how long), <b>traffic</b> (how many), <b>errors</b> (how many fail), <b>saturation</b> (how full). For AI services add two more: <b>cost</b> (tokens per request) and <b>quality</b> (share of good answers).</p>
 <p>Look at <b>percentiles</b>, not averages. "p95 = 4 seconds" means 95 % of requests are faster than 4 seconds. An average of 1 second can hide that every twentieth user waits 20 seconds.</p>
 <h4>SLO: how good is good enough?</h4>
 <p>An <b>SLO</b> (service level objective) is a target you agree on, for example "99 % of questions answered in under 5 seconds" or "the nightly data is ready by 06:00 on 29 of 30 days". It turns "it feels slow" into a number, and it tells you when to stop polishing.</p>
 <h4>Alerts</h4>
 <ul><li>Alert on <b>symptoms users feel</b> (errors, slow answers, late data), not on every CPU spike.</li><li>Every alert needs an action. An alert that nobody acts on is noise, and noise makes people ignore the real one.</li><li>A job that did not run sends no error. Alert on <b>missing</b> success too ("no successful run since 03:00").</li></ul>
 <h4>An incident, step by step</h4>
 ${W('scenario','incident')}
 <ol><li><b>Stop the bleeding first.</b> Roll back, switch off the new feature, rerun. Find the deep cause later.</li><li><b>Say what you know</b> in the team channel every 30 minutes, also when nothing changed.</li><li><b>One change at a time.</b> Write down what you tried.</li><li>Afterwards, a short <b>blameless postmortem</b>: timeline, cause, what we change.</li></ol>`,
 know:'You already read SQL Agent history and SSIS logs after a failure. Observability is the same instinct, built in before the failure.',
 key:['Logs = what happened. Metrics = how much. Traces = where the time goes.','Percentiles, not averages. Agree on an SLO.','Stop the bleeding, communicate, one change at a time, postmortem.'],
 do:['Add structured logging with a request ID and duration to your API.','Play the incident until you reach the top score.','Write an SLO for your portfolio project in one sentence.'],
 links:[['Google SRE book (free)','https://sre.google/sre-book/table-of-contents/']],
 ex:[
 {t:'mcq',q:'Which signal shows where one slow request spends its time across services?',o:['A trace','A metric','A sensitivity label'],a:0,w:'Traces follow one request end to end.'},
 {t:'mcq',q:'"p95 latency = 4 s" means:',o:['95 % of requests finish within 4 seconds','The average is 4 seconds','5 % of requests fail'],a:0,w:'Percentiles show what slow users feel.'},
 {t:'mcq',q:'The nightly job did not start at all, so there is no error message. Which alert catches it?',o:['"No successful run since 03:00"','"CPU above 80 %"','"Error in the log"'],a:0,w:'Alert on missing success, not only on failure.'},
 {t:'mcq',q:'During an incident, what comes first?',o:['Restore service: roll back or rerun','Find the perfect root cause','Write the postmortem'],a:0,w:'Stop the bleeding, then investigate.'},
 {t:'mcq',q:'What is a blameless postmortem?',o:['A short report about what the system allowed to go wrong and what will change','A list of who made mistakes','A legal document'],a:0,w:'Blame makes people hide things. Learning needs honesty.'}]}
};

// small updates to the reused stations
old.O2.t='How teams work: boards, repositories, reviews';old.O2.sum='Azure DevOps and GitHub do the same job';
old.O2.body=old.O2.body.replace('<p>Azure DevOps is a set of tools for a team. You get them all in one <b>project</b>.</p>','<p>Teams plan work, store code and run pipelines on one platform. The two you will meet most are <b>Azure DevOps</b> and <b>GitHub</b> (GitLab is the third). The parts have different names but do the same job. Below are the Azure DevOps names. On GitHub they are Issues and Projects, repositories, and Actions.</p>');
old.O3.body+=`<h4>The same in GitHub Actions</h4>
 <p>Most public projects, and your portfolio, use <b>GitHub Actions</b>. The file lives in <code>.github/workflows/</code>.</p>
 ${yaml`name: ci
on:
  pull_request:
  push: { branches: [main] }
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v5
      - run: uv sync --dev
      - run: uv run ruff check .          # lint
      - run: uv run pytest                # tests
      - run: docker build -t app:ci .     # does the image still build?`}
 <p>A green tick next to every commit of your repository tells a reviewer in one second that you work like an engineer.</p>`;
old.O8.body=old.O8.body.replace(/<h4>Infrastructure as code<\/h4>[\s\S]*?<h4>Documentation that people read<\/h4>/,'<h4>Documentation that people read</h4>');
old.O8.t='Documentation that people read';old.O8.sum='README, one picture, decision records, a runbook';
old.O8.key=['README, one picture, decision records, runbook.','Write the decision record on the day you decide.'];
old.O8.links=[];old.O8.ex=old.O8.ex.slice(1);
old.O8.body=old.O8.body.replace('ADR 004: Gold layer in a warehouse','ADR 004: Vector search in Postgres').replace('Context:   The reporting team writes T-SQL only. Loads need multi-table transactions.','Context:   We need vector search for about 200,000 chunks. The team already runs Postgres.').replace('Options:   (a) Gold as lakehouse tables   (b) Gold in a warehouse','Options:   (a) pgvector in the existing Postgres   (b) a separate vector database').replace('Decision:  (b)','Decision:  (a)').replace('Reasons:   Stored procedures and transactions. Team skills. Direct Lake works on both.','Reasons:   One system less to run. Filters and joins with normal SQL. Fast enough at this size.').replace('Cost:      Two engines to operate. Spark people cannot write Gold directly.','Cost:      We must revisit this above a few million chunks.');
old.O8.do=['Write a README for your portfolio project.','Write one decision record for a choice you made.','Write a five-step runbook for "the nightly load failed".'];
old.O6.body=old.O6.body.replace('python deploy.py --workspace "$(workspaceName)"','python deploy.py --target "$(targetName)"');

TRACKS.eng={c:'o',letter:'E',name:'Engineering core',goal:'Write, test, package, deploy and operate software like a professional',
intro:'These are the skills that turn a BI developer into an engineer, and they are the ones job ads ask for most: Python, Git, Docker, CI/CD, cloud, Terraform, Kubernetes. They do not go out of date when the next AI model arrives.',
stations:[N.EN1,N.EN2,sec(N.EN3,'Tools of the trade'),old.O1,old.O5,N.EN4,N.EN5,sec(old.O7,'Quality and delivery'),old.O2,old.O3,old.O6,N.EN6,N.EN7,N.EN8,sec(N.EN9,'Operate it'),old.O8]};
})();
