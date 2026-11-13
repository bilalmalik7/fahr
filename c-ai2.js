// AI line, part 2: the code stations, and the final order of the line.
(function(){
const {py,sql,txt,yaml,sh,W,tbl,tip,trap,warn,job,more,yt,L}=window.H;
const old={};TRACKS.ai.stations.forEach(s=>{delete s.sec;old[s.id]=s});
const sec=(s,name)=>Object.assign(s,{sec:name});

const N={
KA1:{id:'KA1',sec:'Start here',min:20,t:'The AI engineer: roles and the stack',sum:'Who does what, and where you fit',
 body:`<p>"AI job" is not one job. Read the table, then decide where you aim. Most people who move from BI succeed fastest in the first two rows, because those roles are about <b>building systems around models</b>, not about inventing models.</p>
 ${tbl(['Role','Builds','Main skills','Maths needed'],[
  ['<b>AI engineer</b> (LLM / GenAI engineer)','Products on top of ready-made models: RAG, agents, assistants, extraction','Python, APIs, prompts, retrieval, evaluation, backend','Little'],
  ['<b>MLOps / LLMOps / AI platform engineer</b>','The platform that runs models reliably: deployment, monitoring, cost, pipelines','Docker, Kubernetes, CI/CD, cloud, Terraform, observability','Little'],
  ['<b>Data engineer</b>','The pipelines that feed everything','SQL, Python, Spark, dbt, Airflow','Little'],
  ['<b>ML engineer</b>','Trains and ships own models: forecasting, recommendation, vision','Python, PyTorch or scikit-learn, data, deployment','Medium'],
  ['<b>Computer vision engineer</b>','Cameras and images: inspection, counting, OCR','PyTorch, OpenCV, labelling, edge deployment','Medium'],
  ['<b>Forward-deployed engineer</b>','Works inside a customer\'s company and makes the AI product work on their real data and processes','Everything in row one, plus talking to users and fast problem solving','Little'],
  ['<b>Data scientist / research</b>','Analyses, experiments, new methods','Statistics, experiments, papers','High']])}
 <h4>The stack of an AI product</h4>
 ${txt`user  →  application / API (FastAPI)            ← Engineering line
           │
           ├─ prompt + context building            ← this line
           ├─ retrieval: search over your data     ← this line + Data line
           ├─ tools: SQL, files, other systems
           ▼
         model  (hosted API, or an open model you run)
           │
         evaluation, tracing, cost, guardrails     ← this line
           │
         containers, CI/CD, cloud, monitoring      ← Engineering line`}
 <h4>Why your background helps</h4>
 <ul><li>Most AI projects fail on <b>data</b>: wrong, late, badly modelled, no permissions. That is your home ground.</li>
 <li>You know how to <b>check numbers</b>. Evaluation is the scarcest skill in AI engineering.</li>
 <li>You know a real industry. A model that counts eggs on a tray or answers questions about hatch data needs somebody who knows what is plausible.</li></ul>
 <h4>How to use this line</h4>
 <p>Every station ends with something to build. Do the Python stations of the Engineering line first or in parallel, because all code here is Python. After the stations, three portfolio projects prove the skills: a data platform, a RAG service, and a vision or model service.</p>`,
 key:['AI engineer = systems around ready-made models. Little maths, a lot of engineering.','Data and evaluation are where projects fail, and where you are strong.'],
 do:['Read five job ads for "AI Engineer" and five for "MLOps Engineer" in Germany. For each, write down which row of the table it is.','Write one sentence: which role you aim for first, and why.'],
 links:[],
 ex:[
 {t:'mcq',q:'Which role builds products on top of ready-made language models?',o:['AI engineer','Research scientist','Database administrator'],a:0,w:'RAG, agents, assistants.'},
 {t:'mcq',q:'Which role needs the most Docker, Kubernetes and Terraform?',o:['MLOps / AI platform engineer','Data scientist','Prompt writer'],a:0,w:'They run the platform under the models.'},
 {t:'mcq',q:'What does a forward-deployed engineer do?',o:['Makes the AI product work inside a customer\'s real environment','Writes research papers','Only sells licences'],a:0,w:'Engineering plus close work with users.'}]},

KA2:{id:'KA2',sec:'How models learn',min:40,t:'Machine learning in one station',sum:'Learn from examples, measure honestly',
 body:`<p>Normal programming: you write the rules. <b>Machine learning</b>: you give examples with the right answers, and the computer finds the rules. The result is a <b>model</b>.</p>
 ${tbl(['Word','Meaning','Example'],[
  ['<b>Features</b>','The input columns','egg age in days, average temperature, breeder flock age'],
  ['<b>Label</b> (target)','The column to predict','hatch rate, or "good batch: yes/no"'],
  ['<b>Training</b>','The model looks at examples and adjusts itself',''],
  ['<b>Inference</b>','The trained model predicts for new rows',''],
  ['<b>Regression</b>','Predict a number','hatch rate tomorrow'],
  ['<b>Classification</b>','Predict a category','cracked or not cracked'],
  ['<b>Clustering</b>','Find groups without labels','types of customers']])}
 <h4>The one rule you must never break</h4>
 <p>A model can learn its examples by heart and still be useless on new data. This is <b>overfitting</b>. So you always hold data back:</p>
 <ul><li><b>Training set</b>: the model learns from it.</li><li><b>Validation set</b>: you compare versions and settings on it.</li><li><b>Test set</b>: you touch it once, at the very end, for the honest number.</li></ul>
 <p>For data with time, split by time: train on the past, test on the future. A random split would let the model look into the future. This mistake is called <b>leakage</b>, and it is the most common reason a model looks great in a notebook and fails in production.</p>
 ${py`import polars as pl
from sklearn.model_selection import train_test_split
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import classification_report

df = pl.read_parquet("batches.parquet")
X = df.select("egg_age_days", "avg_temp", "flock_age_weeks", "humidity").to_numpy()
y = df["bad_batch"].to_numpy()                       # 1 = hatch rate below 75 %

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

model = HistGradientBoostingClassifier().fit(X_train, y_train)
print(classification_report(y_test, model.predict(X_test)))`}
 <p>For tables of numbers, <b>gradient boosting</b> (this class, or the libraries XGBoost and LightGBM) is the standard. It usually beats neural networks on tabular data and trains in seconds.</p>
 <h4>Measuring a classifier</h4>
 <p><b>Accuracy</b> (share of right answers) lies when one class is rare. If 5 % of batches are bad, a model that always says "good" is 95 % accurate and worthless. Use these:</p>
 ${tbl(['Metric','Question','Matters when'],[
  ['<b>Precision</b>','Of the batches I flagged as bad, how many really were?','False alarms are expensive'],
  ['<b>Recall</b>','Of the really bad batches, how many did I catch?','Missing one is expensive'],
  ['<b>F1</b>','One number that balances both','You need a single score']])}
 <p>The model gives a probability. You choose the <b>threshold</b>. Move it and watch precision and recall trade against each other:</p>
 ${W('confusion')}
 <p>Which threshold is right is a business question: what does a false alarm cost, and what does a missed case cost? Asking this question is what a good engineer does before tuning anything.</p>
 <p>For regression the usual metrics are <b>MAE</b> (the average error in the unit of the target, easy to explain) and <b>RMSE</b> (punishes big errors more). Always compare against a simple <b>baseline</b>, such as "the same as last week". If the model does not beat the baseline, you do not have a model.</p>`,
 know:'A model is like a very flexible CASE WHEN that was fitted to data and that nobody wrote by hand. Train/test is like developing on a copy and checking on data the developer has never seen.',
 key:['Hold data back. For time data, split by time.','Accuracy lies on rare classes. Use precision and recall.','Always beat a simple baseline first.'],
 do:['Install scikit-learn. Train the classifier above on any public table (for example the "adult" or "wine quality" data sets).','Print precision and recall. Then build the "always the majority class" baseline and compare.','Explain the result to a non-technical person in three sentences.'],
 links:[['scikit-learn: getting started','https://scikit-learn.org/stable/getting_started.html'],['Google: Machine Learning Crash Course','https://developers.google.com/machine-learning/crash-course']],
 ex:[
 {t:'mcq',q:'What is overfitting?',o:['The model learned the training examples by heart and fails on new data','The model is too small','The data has too few columns'],a:0,w:'That is why you test on held-back data.'},
 {t:'mcq',q:'You predict next week\'s hatch rate. How do you split the data?',o:['By time: train on earlier weeks, test on later weeks','Randomly','Alphabetically by hatchery'],a:0,w:'A random split leaks the future into training.'},
 {t:'mcq',q:'2 % of eggs are cracked. A model says "not cracked" for every egg. What is its accuracy, and is it useful?',o:['98 %, and useless','2 %, and useless','98 %, and excellent'],a:0,w:'Recall for cracked eggs is 0.'},
 {t:'mcq',q:'Missing a sick flock is very expensive. A false alarm costs one extra check. Which metric do you push up?',o:['Recall','Precision','Accuracy'],a:0,w:'Catch as many real cases as possible and accept more false alarms.'},
 {t:'mcq',q:'For a table with 30 numeric columns and 50,000 rows, which model type is the usual first choice?',o:['Gradient boosting','A large language model','A vision transformer'],a:0,w:'Fast, strong and easy on tabular data.'},
 {t:'mcq',q:'Your model has an error of 4.1. "Same as last week" has an error of 4.0. What do you conclude?',o:['The model adds nothing yet','Ship it','The baseline is wrong'],a:0,w:'Beat the baseline or do not ship.'}]},

KA3:{id:'KA3',min:35,t:'Neural networks and deep learning',sum:'Layers, loss, gradient descent, and a training loop you can read',
 body:`<p>A <b>neural network</b> is a long chain of simple calculations with millions of adjustable numbers called <b>weights</b> or <b>parameters</b>. Training means finding weights that give good answers.</p>
 <ol><li><b>Forward</b>: put an example in, get a prediction out.</li><li><b>Loss</b>: one number that says how wrong the prediction was.</li><li><b>Backward</b>: work out, for every weight, in which direction to change it to make the loss smaller. This is the <b>gradient</b>.</li><li><b>Step</b>: change every weight a little in that direction. How much is the <b>learning rate</b>.</li><li>Repeat with the next batch of examples. One pass through all data is an <b>epoch</b>.</li></ol>
 <p>This is <b>gradient descent</b>: walking downhill on the loss, one small step at a time. Try different learning rates:</p>
 ${W('descent')}
 <h4>The training loop in PyTorch</h4>
 <p><b>PyTorch</b> is the standard library for deep learning. Every training script, from a small classifier to a large language model, has this shape:</p>
 ${py`import torch
from torch import nn

model = nn.Sequential(nn.Linear(4, 32), nn.ReLU(), nn.Linear(32, 1))   # 4 inputs → 32 → 1 output
loss_fn = nn.BCEWithLogitsLoss()                                        # loss for yes/no
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)              # lr = learning rate

for epoch in range(20):
    model.train()
    for x, y in train_loader:              # a batch of examples
        pred = model(x)                    # 1 forward
        loss = loss_fn(pred, y)            # 2 loss
        optimizer.zero_grad()
        loss.backward()                    # 3 gradients
        optimizer.step()                   # 4 update the weights
    model.eval()
    with torch.no_grad():
        val_loss = sum(loss_fn(model(x), y).item() for x, y in val_loader)
    print(epoch, round(val_loss, 4))       # stop when this stops falling`}
 ${tbl(['Word','Meaning'],[
  ['<b>Tensor</b>','An array of numbers with any number of dimensions. An image is a tensor of height × width × 3'],
  ['<b>Layer</b>','One step of the chain. <code>Linear</code> multiplies and adds. <code>ReLU</code> cuts negative values to zero, which lets the network learn curves, not only straight lines'],
  ['<b>Batch</b>','A handful of examples processed together, for speed'],
  ['<b>GPU</b>','A chip that does thousands of these calculations at once. Deep learning needs it. <code>model.to("cuda")</code> moves the model there'],
  ['<b>Validation loss</b>','The loss on held-back data. When training loss falls and validation loss rises, the model is overfitting'],
  ['<b>Checkpoint</b>','The saved weights. A model file is only a large table of numbers'],
  ['<b>Pre-trained model</b>','Somebody already trained it on huge data. You download it and adapt it. Almost nobody trains from zero today']])}
 <h4>What "deep learning" changed</h4>
 <p>Before, people designed features by hand ("edge strength in the top left corner"). Deep networks learn the features themselves, layer by layer. That is why they win on images, sound and text. A large language model is the same idea with billions of weights and a layer type called <b>transformer</b>.</p>
 ${job('As an AI engineer you will rarely write a network from scratch. You will read training scripts, fine-tune pre-trained models, and debug them. Being able to read the loop above, and to say what a falling training loss with a rising validation loss means, is the level you need.')}`,
 key:['Forward, loss, backward, step. Repeat.','Learning rate too high: it jumps around. Too low: it crawls.','Validation loss rising while training loss falls = overfitting.'],
 do:['Install PyTorch. Run the official "Quickstart" tutorial once from top to bottom.','Change the learning rate to 10 times higher and 10 times lower and watch the loss.','In the widget above, find the largest learning rate that still reaches the bottom.'],
 links:[['PyTorch: Learn the Basics','https://pytorch.org/tutorials/beginner/basics/intro.html'],['Video: 3Blue1Brown, neural networks',yt('3Blue1Brown neural networks')],['fast.ai: Practical Deep Learning (free)','https://course.fast.ai/']],
 ex:[
 {t:'order',q:'Order the four steps of one training step.',items:['Forward: compute the prediction','Compute the loss','Backward: compute the gradients','Update the weights'],w:'Then the next batch.'},
 {t:'mcq',q:'The loss jumps up and down wildly and never settles. What is the likely cause?',o:['The learning rate is too high','The learning rate is too low','There are too few epochs'],a:0,w:'The steps overshoot the valley.'},
 {t:'mcq',q:'Training loss keeps falling, validation loss starts to rise. What is happening?',o:['Overfitting','Underfitting','The GPU is broken'],a:0,w:'Stop training, add data, or make the model simpler.'},
 {t:'mcq',q:'What is a pre-trained model?',o:['A model already trained on large data that you download and adapt','A model without weights','A model trained only on your data'],a:0,w:'The normal starting point today.'},
 {t:'fill',q:'One pass through the whole training data is called an ___',a:['epoch'],w:'Training usually runs for several epochs.'}]},

KA4:{id:'KA4',sec:'Build with language models',min:45,t:'Calling a model from code',sum:'Messages, streaming, structured output, tools',
 body:`<p>A language model is used through an API. You send a list of messages, you get a message back. Everything else in AI engineering is built on this one call. The examples use the Anthropic SDK for Python. Other providers work the same way with other names.</p>
 ${sh`uv add anthropic pydantic
export ANTHROPIC_API_KEY="..."        # from the provider's console. Never in the code`}
 ${py`import anthropic
client = anthropic.Anthropic()                      # reads the key from the environment

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1024,                                # upper limit for the answer
    system="You are an assistant for hatchery staff. Answer in two short sentences.",
    messages=[{"role": "user", "content": "What is a normal hatch rate?"}],
)
if response.stop_reason == "refusal":               # the model declined. Check before reading content
    print("declined")
else:
    print(response.content[0].text)
print(response.usage.input_tokens, response.usage.output_tokens)   # what you pay for`}
 ${tbl(['Part','Meaning'],[
  ['<b>system</b>','Standing instructions: role, rules, format. The user does not see it'],
  ['<b>messages</b>','The conversation so far, alternating user and assistant. The model has no memory: you send the whole history every time'],
  ['<b>max_tokens</b>','A hard cap on the answer length. If the answer is cut, <code>stop_reason</code> is "max_tokens"'],
  ['<b>stop_reason</b>','Why it stopped: end_turn (finished), max_tokens (cut off), tool_use (wants a tool), refusal (declined)'],
  ['<b>usage</b>','Input and output tokens. Log them for every call']])}
 <h4>Streaming: show words as they arrive</h4>
 ${py`with client.messages.stream(model="claude-opus-5-5", max_tokens=4096,
                            messages=[{"role": "user", "content": question}]) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    final = stream.get_final_message()`}
 <h4>Structured output: get data, not prose</h4>
 <p>For extraction and classification you want JSON that always has the right shape. Give the API a Pydantic model, and you get a validated object back.</p>
 ${py`from pydantic import BaseModel
from typing import Literal

class Ticket(BaseModel):
    category: Literal["delivery", "quality", "invoice", "other"]
    urgency: Literal["low", "medium", "high"]
    customer: str | None
    summary: str

response = client.messages.parse(
    model="claude-opus-5-5", max_tokens=1024,
    messages=[{"role": "user", "content": "Classify this e-mail:\n\n" + email_text}],
    output_format=Ticket,
)
ticket = response.parsed_output          # a Ticket object
print(ticket.category, ticket.urgency)`}
 <p>This pattern, text in and a typed row out, is the most common production use of language models. It turns e-mails, PDFs and notes into table rows.</p>
 <h4>Tools: let the model call your functions</h4>
 ${py`from anthropic import beta_tool

@beta_tool
def run_sql(query: str) -> str:
    """Run a read-only SQL query on the hatchery warehouse and return up to 50 rows as text.

    Args:
        query: A single SELECT statement.
    """
    return safe_readonly_query(query, limit=50)

runner = client.beta.messages.tool_runner(
    model="claude-opus-5-5", max_tokens=4096,
    tools=[run_sql],
    messages=[{"role": "user", "content": "Which hatchery had the lowest hatch rate last week?"}],
)
for message in runner:                    # the SDK runs the loop: model → tool → model → ...
    last = message
print(last.content[-1].text)`}
 <p>The description text of the tool is a prompt. The model decides from it when and how to call the function. Your code runs the function, with the permissions you gave it.</p>
 <h4>Production habits</h4>
 <ul><li><b>Retries</b>: the SDK retries temporary errors (429, 5xx) by itself. Set a timeout.</li>
 <li><b>Prompt caching</b>: mark the long fixed part of the prompt (instructions, documents) for caching. Repeated calls then pay a fraction for that part and start faster. Add <code>cache_control={"type": "ephemeral"}</code> to the call, and keep the fixed part first and the changing part last.</li>
 <li><b>Model choice</b>: providers offer sizes. Use a small, cheap model for simple high-volume steps and a large one for hard reasoning. Measure on your own test set before you choose.</li>
 <li><b>Fallback</b>: decide what happens when the provider is down or declines: a second model, a cached answer, or an honest error message.</li>
 <li><b>Batch</b>: for work that can wait until tomorrow, the batch endpoint costs about half.</li></ul>`,
 know:'The messages call is like executing a stored procedure with a text parameter. Structured output gives it a typed result set.',
 key:['One call: system + messages in, a message out. No memory between calls.','Structured output with Pydantic turns text into rows.','Tools are functions with good descriptions. Your code runs them.'],
 do:['Get an API key and make the first call from a Python file.','Build the e-mail classifier with structured output and run it on ten invented e-mails.','Give the model one tool that returns a fixed table, and ask a question that needs it.','Log tokens for each call and work out what 1,000 calls would cost.'],
 links:[['Claude API documentation','https://platform.claude.com/docs/'],['Anthropic cookbook','https://github.com/anthropics/claude-cookbooks']],
 ex:[
 {t:'mcq',q:'How does a model "remember" earlier turns of a chat?',o:['Your code sends the whole conversation again with every call','It stores them on the server for ever','It cannot hold a conversation'],a:0,w:'The API is stateless.'},
 {t:'mcq',q:'An answer ends in the middle of a sentence. What do you check?',o:['stop_reason: it is probably "max_tokens"','The temperature','The system prompt language'],a:0,w:'Raise max_tokens or ask for a shorter answer.'},
 {t:'mcq',q:'You must turn 10,000 e-mails into rows with category and urgency. Which feature fits?',o:['Structured output with a schema','Streaming','A longer system prompt only'],a:0,w:'You get validated objects, not free text to parse.'},
 {t:'mcq',q:'What decides when the model calls your tool?',o:['The tool name and description you wrote','A random number','The order of the imports'],a:0,w:'Write descriptions like instructions for a new colleague.'},
 {t:'mcq',q:'Every request starts with the same 5,000-token instructions. What saves cost and time?',o:['Prompt caching, with the fixed part first','A higher max_tokens','Sending the instructions twice'],a:0,w:'Cached input tokens are much cheaper.'}]},

KA5:{id:'KA5',min:50,t:'RAG in code: Postgres, pgvector, hybrid search',sum:'From documents to cited answers, step by step',
 body:`<p>The demo in the station before showed the idea. Here is a version you can build and put in your portfolio. It uses <b>Postgres with the pgvector extension</b>, so one normal database holds text, metadata and vectors. For up to a few million chunks this is enough, and a company that already runs Postgres needs no new system.</p>
 <h4>1. Cut documents into chunks</h4>
 ${py`def chunk(text: str, size: int = 250, overlap: int = 40) -> list[str]:
    words = text.split()
    step = size - overlap
    return [" ".join(words[i:i + size]) for i in range(0, max(len(words) - overlap, 1), step)]`}
 <p>Better: cut at headings and paragraphs first, and keep the title and section with every chunk. A chunk must make sense when read alone.</p>
 <h4>2. Embed and store</h4>
 ${sql`CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE chunks (
  id        bigserial PRIMARY KEY,
  doc       text NOT NULL,
  section   text,
  content   text NOT NULL,
  embedding vector(1024),
  tsv       tsvector GENERATED ALWAYS AS (to_tsvector('german', content)) STORED   -- for keyword search
);
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);   -- fast nearest-neighbour search
CREATE INDEX ON chunks USING gin (tsv);`}
 ${py`from sentence_transformers import SentenceTransformer
embedder = SentenceTransformer("BAAI/bge-m3")        # an open multilingual embedding model, runs locally

def add_document(conn, doc: str, section: str, text: str) -> None:
    parts = chunk(text)
    vectors = embedder.encode(parts, normalize_embeddings=True)
    with conn.cursor() as cur:
        cur.executemany("INSERT INTO chunks (doc, section, content, embedding) VALUES (%s, %s, %s, %s)",
                        [(doc, section, p, v.tolist()) for p, v in zip(parts, vectors)])`}
 <h4>3. Retrieve: meaning and exact words together</h4>
 ${sql`-- hybrid search: 20 by meaning + 20 by keywords, merged by rank (reciprocal rank fusion)
WITH sem AS (SELECT id, row_number() OVER (ORDER BY embedding <=> %(qvec)s::vector) AS r
             FROM chunks ORDER BY embedding <=> %(qvec)s::vector LIMIT 20),
     kw  AS (SELECT id, row_number() OVER (ORDER BY ts_rank(tsv, q) DESC) AS r
             FROM chunks, plainto_tsquery('german', %(qtext)s) q WHERE tsv @@ q LIMIT 20)
SELECT c.id, c.doc, c.section, c.content,
       coalesce(1.0 / (60 + sem.r), 0) + coalesce(1.0 / (60 + kw.r), 0) AS score
FROM chunks c LEFT JOIN sem USING (id) LEFT JOIN kw USING (id)
WHERE sem.id IS NOT NULL OR kw.id IS NOT NULL
ORDER BY score DESC LIMIT 5;`}
 <p><code>&lt;=&gt;</code> is the cosine distance operator of pgvector. Smaller means more similar. Because it is SQL, you can add <code>WHERE doc_type = 'manual'</code> or a permission filter like in any query. This is the part where your SQL skill is an advantage over most AI engineers.</p>
 <h4>4. Generate with sources</h4>
 ${py`SYSTEM = """Answer the question using only the numbered sources.
After each statement, name the source like [2].
If the sources do not contain the answer, say: "I cannot find this in the documents." """

def answer(question: str, rows: list[dict]) -> str:
    sources = "\n\n".join(f"[{i+1}] ({r['doc']}, {r['section']})\n{r['content']}" for i, r in enumerate(rows))
    msg = client.messages.create(
        model="claude-opus-5-5", max_tokens=1024, system=SYSTEM,
        messages=[{"role": "user", "content": f"Sources:\n{sources}\n\nQuestion: {question}"}])
    return msg.content[0].text`}
 <h4>5. Measure before you improve</h4>
 ${py`TESTS = [{"q": "How long do eggs stay in the setter?", "doc": "handbook", "must": "18 days"},
         {"q": "Who won the 2010 world cup?", "doc": None, "must": "cannot find"}]     # must refuse

def evaluate() -> None:
    hit = ok = 0
    for t in TESTS:
        rows = retrieve(t["q"])
        hit += t["doc"] is None or any(r["doc"] == t["doc"] for r in rows)     # was the right document found?
        ok  += t["must"].lower() in answer(t["q"], rows).lower()               # is the answer right?
    print(f"retrieval {hit}/{len(TESTS)}   answers {ok}/{len(TESTS)}")`}
 <p>Two numbers: did retrieval find the right document, and was the answer right. When answers are wrong, the first number tells you whether to fix the search or the prompt.</p>
 <h4>Next steps when quality is not enough</h4>
 ${tbl(['Technique','What it does'],[
  ['<b>Reranking</b>','Fetch 30 chunks, let a small reranker model read question and chunk together, keep the best 5'],
  ['<b>Query rewriting</b>','Let a model turn "and what about Süd?" into a full question, using the chat history'],
  ['<b>Contextual chunks</b>','Before embedding, add one sentence to each chunk that says what document and section it is from'],
  ['<b>Metadata filters</b>','Year, document type, product: filter in SQL before the vector search'],
  ['<b>Tables and numbers</b>','Do not embed tables. Load them into real tables and give the model a SQL tool']])}
 <p>Other vector stores you will see in ads: Qdrant, Weaviate, Milvus, Pinecone, Elasticsearch / OpenSearch, Azure AI Search. Frameworks such as LangChain and LlamaIndex wrap these steps. Learn the steps first, as above. Then a framework is a convenience and not a mystery.</p>`,
 know:'A vector index is an index for "ORDER BY similarity". Hybrid search is a UNION of two rankings. You already know how to do the rest in SQL.',
 key:['Chunk, embed, store, retrieve (hybrid), generate with sources, evaluate.','Postgres + pgvector is enough for most projects.','Two numbers: retrieval hit rate and answer correctness.'],
 do:['Start Postgres with pgvector in Docker (the Compose file is in the Engineering line).','Load 20 pages of text (your own notes or public manuals).','Build retrieve and answer, and wrap them in the FastAPI endpoint from the Engineering line.','Write 20 test questions, 3 of them without an answer in the documents. Measure both numbers.','Change one thing (chunk size, hybrid on or off) and measure again.'],
 links:[['pgvector','https://github.com/pgvector/pgvector'],['Sentence Transformers','https://sbert.net/']],
 ex:[
 {t:'mcq',q:'What does the operator <=> do in pgvector?',o:['It computes the cosine distance between two vectors','It joins two tables','It compares text case-insensitively'],a:0,w:'ORDER BY embedding <=> query LIMIT k.'},
 {t:'mcq',q:'Why keep an overlap between chunks?',o:['So a sentence at a border is not cut from its context','To make the table bigger','It is required by Postgres'],a:0,w:'Information at chunk borders would be lost.'},
 {t:'mcq',q:'Answers are wrong. Retrieval hit rate is 45 %. What do you fix first?',o:['Retrieval: chunking, hybrid search, reranking','The system prompt wording','The model size'],a:0,w:'The model cannot answer from text it never received.'},
 {t:'mcq',q:'A user may only see documents of their own department. Where do you enforce it?',o:['In the SQL filter of the retrieval query','In a polite sentence in the prompt','Nowhere'],a:0,w:'The model must never receive text the user may not see.'},
 {t:'mcq',q:'The documents contain large price tables and users ask for totals. What is the right design?',o:['Load the tables into the database and give the model a SQL tool','Embed every table row as a chunk','Increase the overlap'],a:0,w:'Retrieval looks things up. Databases calculate.'},
 {t:'mcq',q:'What is reranking?',o:['A second model reorders the retrieved chunks by reading question and chunk together','Sorting the documents by date','Deleting old chunks'],a:0,w:'Cheap first search, precise second look.'}]},

KA6:{id:'KA6',min:40,t:'Build an agent, and an MCP server',sum:'The loop in code, with guardrails',
 body:`<p>The agent station showed the loop: think, act, look, repeat. In the station "Calling a model from code" the SDK ran that loop for you. Here you see the loop itself, because understanding it is what lets you debug agents.</p>
 ${py`def run_agent(task: str, tools: dict, tool_specs: list, max_steps: int = 10) -> str:
    messages = [{"role": "user", "content": task}]
    for step in range(max_steps):                               # 1. a hard step limit
        resp = client.messages.create(model="claude-opus-5-5", max_tokens=4096,
                                      system=SYSTEM, tools=tool_specs, messages=messages)
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason != "tool_use":
            return next(b.text for b in resp.content if b.type == "text")     # finished
        results = []
        for block in resp.content:
            if block.type != "tool_use":
                continue
            if block.name in NEEDS_APPROVAL and not ask_human(block):         # 2. human gate
                out, err = "The user did not approve this action.", True
            else:
                try:
                    out, err = tools[block.name](**block.input), False        # 3. your code runs it
                except Exception as e:
                    out, err = f"Error: {e}", True                            # 4. errors go back as text
            results.append({"type": "tool_result", "tool_use_id": block.id, "content": str(out)[:4000], "is_error": err})
        messages.append({"role": "user", "content": results})                 # all results in one message
    return "Stopped: step limit reached."`}
 <p>Four safety parts are marked: a step limit, a human gate for risky tools, your own code deciding what really runs, and errors returned to the model as text so that it can correct itself. A fifth one is in the tool: return small results (here cut at 4,000 characters).</p>
 <h4>Designing tools</h4>
 <ul><li><b>Few, clear tools</b> beat many small ones. "search_orders(customer, from, to)" is better than "run any SQL" when that is all the task needs.</li>
 <li>The <b>description</b> says what the tool does, when to use it, and what it returns.</li>
 <li><b>Read-only by default.</b> Separate tools for reading and for changing, and gate the changing ones.</li>
 <li>Return <b>errors the model can act on</b>: "column hatch_date does not exist. Columns are: set_date, hatchery, ..."</li></ul>
 <h4>Workflows before agents</h4>
 <p>Many "agent" problems are better solved as a fixed <b>workflow</b>: step 1 classify, step 2 retrieve, step 3 draft, step 4 check. Each step is one model call, and your code decides the order. A workflow is cheaper, faster and testable step by step. Use a free agent loop only when the path really cannot be known in advance.</p>
 <h4>An MCP server: your tools for any assistant</h4>
 <p><b>MCP</b> (Model Context Protocol) is the standard plug between assistants and tools. If you wrap your system as an MCP server once, assistants such as Claude, coding tools and agent frameworks can all use it. Companies are now building MCP servers for their internal systems, and this is very practical work for somebody who knows data.</p>
 ${py`# server.py   (uv add "mcp[cli]")
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("hatchery")

@mcp.tool()
def hatch_rate(hatchery: str, week: str) -> dict:
    """Return eggs set, chicks hatched and hatch rate for one hatchery and ISO week (e.g. 2026-W45)."""
    return query_gold(hatchery, week)

@mcp.tool()
def list_hatcheries() -> list[str]:
    """Return the names of all hatcheries."""
    return ["Nord", "Süd", "West"]

if __name__ == "__main__":
    mcp.run()`}
 <p>Connect it to an assistant on your computer, ask "Which hatchery was best in week 45?", and watch it call your functions.</p>
 <h4>Testing agents</h4>
 <p>Test the <b>result</b>, not the path: after the run, is the right row in the table, is the right file written, is the answer right? Keep 20 such tasks and run them after every change to prompts or tools. Log every step (tool, input, output, tokens) so that you can read a failed run like a stack trace.</p>`,
 key:['The loop: call model, run requested tools, send results back, repeat.','Step limit, human gate, small results, errors as text.','Prefer a fixed workflow when the path is known. MCP makes tools reusable.'],
 do:['Write the manual loop with two tools: one that reads a small table, one that "sends" a message (only prints). Gate the second one.','Build the MCP server above over a small table and connect it to an assistant.','Write five test tasks with a checkable result.'],
 links:[['Building effective agents (Anthropic)','https://www.anthropic.com/engineering/building-effective-agents'],['MCP Python SDK','https://github.com/modelcontextprotocol/python-sdk']],
 ex:[
 {t:'mcq',q:'Why does an agent loop need a maximum number of steps?',o:['So a confused agent cannot run and spend money for ever','To make it faster','Models require it'],a:0,w:'Always bound the loop.'},
 {t:'mcq',q:'A tool throws an exception. What should the loop do?',o:['Send the error text back to the model as a tool result','Crash the whole program','Ignore it silently'],a:0,w:'The model can often correct its call.'},
 {t:'mcq',q:'The steps are always: classify, look up, draft, check. What should you build?',o:['A fixed workflow of four calls','A free agent with twenty tools','Nothing'],a:0,w:'Known path: workflow. Unknown path: agent.'},
 {t:'mcq',q:'What is the benefit of exposing your system as an MCP server?',o:['Any MCP-capable assistant or agent can use the tools without custom glue','It makes the database faster','It replaces authentication'],a:0,w:'One standard plug.'},
 {t:'mcq',q:'How do you test an agent?',o:['Check the end result of fixed tasks after every change','Read one run and hope','Count the tokens only'],a:0,w:'Outcome tests, run as a suite.'}]},

KA7:{id:'KA7',sec:'Computer vision',min:50,t:'Computer vision in practice',sum:'OpenCV, transfer learning, object detection, deployment',
 body:`<p>The station before showed how a filter slides over an image. Now the practical side: how a vision project runs from first photo to running system. Industry in Germany (automotive, food, logistics, agriculture) has steady demand here: inspection, counting, reading labels.</p>
 <h4>Step 0: try a large multimodal model first</h4>
 ${py`import base64
img = base64.standard_b64encode(open("tray.jpg", "rb").read()).decode()
resp = client.messages.create(model="claude-opus-5-5", max_tokens=500, messages=[{"role": "user", "content": [
    {"type": "image", "source": {"type": "base64", "media_type": "image/jpeg", "data": img}},
    {"type": "text", "text": "Are any eggs on this tray visibly cracked? Answer yes or no, then one sentence."}]}])`}
 <p>For reading documents, describing scenes and rough checks this is often enough, with zero training. It is too slow and too costly for 30 images per second on a conveyor, and not precise enough for counting small objects. Then you train a small special model.</p>
 <h4>OpenCV: the toolbox for images</h4>
 ${py`import cv2
img = cv2.imread("tray.jpg")                         # an array: height × width × 3 (blue, green, red)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
small = cv2.resize(img, (640, 640))
edges = cv2.Canny(gray, 100, 200)                    # edge detection
cv2.rectangle(img, (50, 40), (200, 180), (0, 255, 0), 2)    # draw a box
cv2.imwrite("out.jpg", img)

cap = cv2.VideoCapture(0)                            # a camera or a video file
ok, frame = cap.read()`}
 <h4>Classification with transfer learning</h4>
 <p>Take a network that was trained on millions of photos, keep its knowledge of edges and shapes, and retrain only the last layer on your few hundred pictures.</p>
 ${py`import torch, torchvision
from torchvision import transforms, datasets

tf = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor(),
                         transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])
train = datasets.ImageFolder("data/train", transform=tf)      # folders: data/train/ok, data/train/cracked

model = torchvision.models.resnet18(weights="DEFAULT")        # pre-trained
for p in model.parameters():
    p.requires_grad = False                                   # freeze what it already knows
model.fc = torch.nn.Linear(model.fc.in_features, 2)           # a new last layer: 2 classes
# ... then the normal training loop from the deep learning station, on model.fc only`}
 <h4>Object detection with YOLO</h4>
 <p>Detection answers "what and where": a box, a class and a confidence for each object. The <b>YOLO</b> family is the standard for fast detection.</p>
 ${py`from ultralytics import YOLO

model = YOLO("yolo11n.pt")                           # a small pre-trained model
model.train(data="eggs.yaml", epochs=50, imgsz=640)  # eggs.yaml lists image folders and class names

results = model("tray.jpg")
for box in results[0].boxes:
    x1, y1, x2, y2 = box.xyxy[0].tolist()
    print(model.names[int(box.cls)], round(float(box.conf), 2), (x1, y1, x2, y2))

model.export(format="onnx")                          # a portable file for deployment`}
 ${warn('Check the licence of every model and library before commercial use. The Ultralytics YOLO code, for example, is AGPL, and companies need a commercial licence for closed products. Asking this question early marks you as professional.')}
 <h4>The data decides, not the model</h4>
 <ul><li><b>Labelling</b>: draw boxes by hand with a tool such as Label Studio or CVAT. 200 to 500 well-labelled images are a real start. Write down the labelling rules, or two people will label differently.</li>
 <li><b>Variety</b>: other light, other camera angle, dirty lens, different egg colours. Collect the hard cases on purpose.</li>
 <li><b>Augmentation</b>: flip, rotate, change brightness automatically, to multiply your data.</li>
 <li><b>Split by time or by batch</b>, not by single image. Ten frames from the same second in train and test is leakage.</li></ul>
 <h4>Metrics</h4>
 ${tbl(['Metric','Meaning'],[
  ['<b>IoU</b> (intersection over union)','How well a predicted box covers the true box: 0 to 1'],
  ['<b>Precision / recall</b>','As in the machine learning station, counted per object'],
  ['<b>mAP</b> (mean average precision)','The standard overall score of a detector. mAP50 counts a box as right when IoU is at least 0.5'],
  ['<b>FPS</b> and latency','Images per second on the real hardware']])}
 <h4>Deployment</h4>
 <p>Export to <b>ONNX</b>, a portable model format, and run it with ONNX Runtime in a FastAPI container, or on a small device next to the camera (<b>edge</b>), for example an NVIDIA Jetson. Edge matters when the network is slow or the answer is needed in milliseconds. In production, save a sample of images with predictions every day and look at them: cameras get moved, lamps die, products change.</p>`,
 know:'A detection result is a table: image, class, confidence, x1, y1, x2, y2. From there it is the data work you know: count, group, compare with yesterday.',
 key:['Try a multimodal model first. Train a small model when speed, cost or precision demand it.','Transfer learning: reuse a pre-trained network.','Data variety and clean labels matter more than the model choice.'],
 do:['Take 40 photos of two kinds of objects on your desk with your phone. Train the transfer-learning classifier.','Label 100 images with boxes in Label Studio and train a small detector.','Export it to ONNX and serve it behind a FastAPI endpoint that returns the boxes as JSON.'],
 links:[['OpenCV tutorials','https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html'],['Label Studio','https://labelstud.io/'],['Hugging Face: Computer Vision Course',L.hf]],
 ex:[
 {t:'mcq',q:'You need to read the fields of 200 delivery notes per day. What do you try first?',o:['A large multimodal model with a prompt and structured output','Training a detector from zero','Writing pixel rules by hand'],a:0,w:'Zero training. Measure the quality on 50 examples.'},
 {t:'mcq',q:'A camera checks 20 trays per second for cracked eggs. What fits?',o:['A small trained detector running near the camera','A large hosted model called for every frame','Manual checks'],a:0,w:'Speed and cost need a small local model.'},
 {t:'mcq',q:'What is transfer learning?',o:['Reusing a pre-trained network and retraining a small part on your own images','Moving images between servers','Training with no data'],a:0,w:'Hundreds of images are enough then.'},
 {t:'mcq',q:'What does an IoU of 0.9 mean?',o:['The predicted box covers the true box almost exactly','The model is 90 % sure','90 objects were found'],a:0,w:'Intersection over union of the two boxes.'},
 {t:'mcq',q:'The detector worked for three months. After a lamp was replaced, it misses many defects. What is this, and what helps?',o:['The input data changed. Collect and label new images, retrain, and monitor samples','A bug in Python. Reinstall','Nothing can be done'],a:0,w:'This is data drift. Watching daily samples finds it early.'},
 {t:'mcq',q:'Before using an open-source model in a commercial product, what must you check?',o:['Its licence','Its logo','Its file name'],a:0,w:'Some licences require opening your own code or buying a licence.'}]},

KA8:{id:'KA8',sec:'Run it in production',min:45,t:'LLMOps: serving, tracing, cost, open models',sum:'What keeps an AI feature alive after the demo',
 body:`<p>A demo answers one question for one person. A product answers thousands, stays up, stays affordable, and gets better over time. <b>LLMOps</b> is the craft of that. It is the fastest-growing part of the job market, because many companies now have demos and need people who can run them.</p>
 <h4>The serving layer</h4>
 ${py`from fastapi import FastAPI
from fastapi.responses import StreamingResponse

@app.post("/v1/ask")
async def ask(q: Question, user=Depends(authenticate)):
    await rate_limit(user)                                   # per-user budget
    rows = await retrieve(q.text, user.permissions)

    async def stream():
        async with aclient.messages.stream(model=MODEL, max_tokens=1024, system=SYSTEM,
                                           messages=build_messages(q, rows)) as s:
            async for text in s.text_stream:
                yield text
            final = await s.get_final_message()
        log_trace(user, q, rows, final)                      # question, sources, answer, tokens, ms
    return StreamingResponse(stream(), media_type="text/plain")`}
 <h4>Tracing: see every step</h4>
 <p>One user question becomes several steps: rewrite, retrieve, rerank, generate, check. A <b>trace</b> records each step with input, output, time and tokens. Tools: Langfuse, Phoenix, LangSmith, or plain <b>OpenTelemetry</b>. Without traces you cannot answer "why was this answer wrong?".</p>
 <h4>Quality over time</h4>
 <ul><li><b>Offline evals</b>: your fixed test set, run in CI on every change to prompts, retrieval or model.</li>
 <li><b>Online signals</b>: thumbs up and down, "copy" clicks, questions repeated in other words, hand-over to a human.</li>
 <li><b>Sampling</b>: read 30 real conversations every week. This habit finds more problems than any dashboard.</li>
 <li>Every bad answer becomes a new test case.</li></ul>
 <h4>Cost and speed</h4>
 ${tbl(['Lever','Effect'],[
  ['Prompt caching for the fixed part','Large saving on input, faster first token'],
  ['Fewer and shorter chunks','Less input per call'],
  ['A small model for easy steps (routing, classification)','Often 10 times cheaper for those steps'],
  ['Limit <code>max_tokens</code> and ask for short answers','Output tokens cost the most'],
  ['Cache whole answers for frequent identical questions','Zero model cost for repeats'],
  ['Batch processing for work that can wait','About half price'],
  ['Streaming','Not cheaper, but users see the first words at once']])}
 <h4>Reliability</h4>
 <ul><li>Timeouts, retries with growing waits, and a <b>fallback</b> model or message.</li>
 <li><b>Version prompts in Git</b> and deploy them like code. A prompt change is a release.</li>
 <li><b>Pin the model version.</b> Test before moving to a new one, with your evals.</li>
 <li><b>Guardrails</b>: check inputs (size, personal data, injection patterns) and outputs (format, forbidden content) around the model call.</li></ul>
 <h4>Running open models yourself</h4>
 <p>Hosted APIs are the simplest way. Some companies must keep data inside their own walls, or want fixed costs. Then they run <b>open-weight models</b> (families such as Llama, Mistral, Qwen, Gemma).</p>
 ${tbl(['Tool','Use'],[
  ['<b>Ollama</b>','Run a model on your laptop with one command. Good for learning and prototypes'],
  ['<b>vLLM</b>','A fast inference server for GPUs, for production. It speaks the same API shape as the big providers'],
  ['<b>Hugging Face</b>','The hub where models and data sets are published'],
  ['<b>Quantization</b>','Storing weights with fewer bits. The model gets smaller and faster with a small loss in quality']])}
 ${sh`ollama run llama3.2 "Explain a watermark load in two sentences."     # a local model, no data leaves your machine`}
 <h4>Fine-tuning, in honest words</h4>
 <p><b>Fine-tuning</b> trains an existing model a little more on your examples. The cheap way is <b>LoRA</b>: only a small add-on set of weights is trained. It helps for a fixed style, a special format or a narrow classification at high volume. It does not teach the model changing facts (use RAG), and each new base model means training again. In most company projects, a better prompt, better retrieval and evals bring more than fine-tuning. Know what it is, and reach for it last.</p>`,
 know:'LLMOps is DevOps plus two new numbers on the dashboard: cost per request and answer quality.',
 key:['Trace every step. Read real conversations weekly.','Evals in CI. Prompts in Git. Model version pinned.','Cost levers: caching, small models, short outputs, batch.'],
 do:['Add tracing to your RAG service: log question, chunk IDs, answer, tokens and duration as one JSON line.','Add a per-user rate limit and a clear error message when it is hit.','Install Ollama and compare a local model with a hosted one on five of your test questions.','Add a CI step that runs your evals and fails when the score drops.'],
 links:[['Langfuse (open-source tracing)','https://langfuse.com/'],['Ollama','https://ollama.com/'],['vLLM','https://docs.vllm.ai/']],
 ex:[
 {t:'mcq',q:'A user reports a wrong answer from yesterday. What lets you find out why?',o:['A trace with the question, the retrieved chunks, the prompt and the answer','The average latency','The Git log'],a:0,w:'Without traces you are guessing.'},
 {t:'mcq',q:'You want to change the system prompt in production. What is the right process?',o:['Change it in Git, run the evals in CI, deploy like code','Edit it live and watch','Ask the model if the new prompt is better'],a:0,w:'A prompt change is a release.'},
 {t:'mcq',q:'Which step is a good candidate for a small, cheap model?',o:['Routing a question into one of five categories','Planning a complex multi-step analysis','Writing a legal contract'],a:0,w:'Simple and high-volume.'},
 {t:'mcq',q:'A company may not send documents to an external API. What is an option?',o:['Run an open-weight model on its own servers with an inference server such as vLLM','Give up on AI','Send them anyway'],a:0,w:'Self-hosting costs operations work, but data stays inside.'},
 {t:'mcq',q:'The knowledge base changes every week. Someone proposes fine-tuning weekly. What do you answer?',o:['Use RAG for changing facts. Fine-tuning is for style and format','Good idea','Fine-tune daily'],a:0,w:'Right tool for the job.'},
 {t:'mcq',q:'Which weekly habit finds the most quality problems?',o:['Reading a sample of real conversations','Looking at the CPU chart','Counting requests'],a:0,w:'Look at the data.'}]},

KA9:{id:'KA9',min:40,t:'MLOps: track, register, deploy, monitor',sum:'The life of a trained model',
 body:`<p>When you train your own models (a classifier, a detector, a forecast), a notebook is not enough. <b>MLOps</b> makes training repeatable and deployment safe. It applies your DevOps knowledge to three things that change: <b>code, data and model</b>.</p>
 ${txt`data version ─┐
code version ─┼─→ training run ─→ model + metrics ─→ registry ─→ staging ─→ production
parameters   ─┘        ▲                                              │
                       └────────── retrain when it drifts ◄── monitoring`}
 <h4>Experiment tracking with MLflow</h4>
 ${py`import mlflow
from sklearn.metrics import recall_score, precision_score

mlflow.set_experiment("bad-batch-classifier")
with mlflow.start_run():
    params = {"max_depth": 6, "learning_rate": 0.1}
    model = HistGradientBoostingClassifier(**params).fit(X_train, y_train)
    pred = model.predict(X_val)
    mlflow.log_params(params)
    mlflow.log_metric("recall", recall_score(y_val, pred))
    mlflow.log_metric("precision", precision_score(y_val, pred))
    mlflow.sklearn.log_model(model, name="model", registered_model_name="bad_batch")`}
 <p>Every run is saved with its parameters, metrics, code version and the model file. Three weeks later you can still answer "which settings gave the 0.82?". <b>MLflow</b> is the most named tool in MLOps job ads. Weights &amp; Biases does the same job.</p>
 ${tbl(['Part','Job'],[
  ['<b>Experiment tracking</b>','A record of every training run'],
  ['<b>Model registry</b>','Named, versioned models with a stage or alias: "champion", "challenger"'],
  ['<b>Feature store</b>','Shared, versioned input features, the same for training and for serving'],
  ['<b>Training pipeline</b>','Training as a scheduled, repeatable job (Airflow, a cloud pipeline), not a notebook'],
  ['<b>Serving</b>','A container with an API for live predictions, or a batch job that scores a table every night'],
  ['<b>Monitoring</b>','Inputs, predictions, and real outcomes over time']])}
 <h4>Batch or online?</h4>
 <p>If predictions are needed once a day, score a table at night and load the result like any other data. It is simpler and cheaper than a live service. Build an online API only when an answer is needed at the moment of the request.</p>
 <h4>Safe roll-out</h4>
 <ul><li><b>Shadow</b>: the new model runs next to the old one and its predictions are only logged.</li><li><b>Canary</b>: 5 % of traffic goes to the new model first.</li><li><b>A/B test</b>: compare the business result of both.</li><li>Keep the old version ready for rollback.</li></ul>
 <h4>Drift: the world changes, the model does not</h4>
 ${tbl(['Type','Meaning','Example'],[
  ['<b>Data drift</b>','The inputs look different from the training data','A new breed, a new sensor, a new camera'],
  ['<b>Concept drift</b>','The link between input and outcome changed','New feed changes how temperature affects hatch rate'],
  ['<b>Training-serving skew</b>','The feature is calculated differently in production than in training','Celsius in training, Fahrenheit in the live feed']])}
 <p>You find drift by comparing the distribution of each input, and of the predictions, with the training data, and by measuring real accuracy as soon as true outcomes arrive. Alert, then retrain on fresh data, test, and promote through the registry.</p>
 <h4>CI/CD for models</h4>
 <ol><li>Pull request: unit tests for feature code, and a quick training run on a small sample.</li><li>Merge: full training in the pipeline, metrics logged.</li><li>Gate: the new model must beat the current champion on the test set.</li><li>Deploy: build the image with the model version, roll out as canary.</li></ol>`,
 know:'A model registry is like a versioned deployment catalogue. Training-serving skew is the ML version of "the report and the source system calculate the number differently".',
 key:['Track every run: parameters, metrics, code, data, model.','Registry with champion and challenger. Shadow or canary before full roll-out.','Monitor inputs, predictions and outcomes. Retrain on drift.'],
 do:['Install MLflow, run <code>mlflow ui</code>, and log three training runs with different settings.','Register the best model and load it by name in a separate script.','Serve it from a FastAPI endpoint in a Docker image that reads the model version from an environment variable.'],
 links:[['MLflow documentation','https://mlflow.org/docs/latest/'],['MLOps Zoomcamp (free course)','https://github.com/DataTalksClub/mlops-zoomcamp']],
 ex:[
 {t:'mcq',q:'What does experiment tracking give you?',o:['A record of parameters, metrics and the model for every run','Faster GPUs','Automatic labels'],a:0,w:'Reproducibility.'},
 {t:'mcq',q:'Predictions are needed once per night for all batches. What do you build?',o:['A nightly batch scoring job','A live API with ten replicas','A streaming pipeline'],a:0,w:'Simplest thing that meets the need.'},
 {t:'mcq',q:'A new model runs next to the old one. Its predictions are logged but not used. What is this called?',o:['Shadow deployment','Canary','Rollback'],a:0,w:'Risk-free comparison on real traffic.'},
 {t:'mcq',q:'A temperature feature is in Celsius in training and in Fahrenheit in production. What is this?',o:['Training-serving skew','Concept drift','Overfitting'],a:0,w:'Same feature, calculated differently.'},
 {t:'mcq',q:'What should a CI/CD gate for models check before promotion?',o:['The new model beats the current one on the held-back test set','The file is larger','The training took longer'],a:0,w:'Champion against challenger.'}]},

KA10:{id:'KA10',sec:'Build it',min:90,t:'Project: a model service with full lifecycle',sum:'Portfolio project 3',
 body:`<p>The third portfolio project proves the platform and operations side. Choose one model: the tabular classifier from the machine learning station, or the object detector from the vision station. The model can be small. The <b>lifecycle around it</b> is what you show.</p>
 ${txt`data  →  training script (tracked with MLflow)  →  model registry
                                                      │
GitHub Actions: tests → train on sample → build image with a pinned model version
                                                      ▼
FastAPI service in Docker:  /predict   /health   structured logs, latency and prediction counts
                                                      │
Terraform: registry, container service, storage     ──┘   deployed in one cloud, destroyable with one command
                                                      │
monitoring: a small daily job compares live inputs with training data and writes a drift report`}
 <h4>What to put in the README</h4>
 <ul><li>The problem and the baseline it has to beat.</li><li>An architecture picture.</li><li>How to run it locally with one command, and how to deploy it.</li><li>The metrics, and how the threshold was chosen.</li><li>What the monthly cloud cost would be.</li><li>What you would do next with more time. Listing the limits honestly is a sign of seniority.</li></ul>`,
 key:['A small model with a complete lifecycle beats a big model in a notebook.'],
 do:['Write the README first.','Training script with MLflow tracking and a registered model.','FastAPI service in Docker with /predict and /health.','GitHub Actions: lint, tests, image build.','Terraform for one cloud, with a budget alert. Deploy, take screenshots, destroy.','A daily drift check as a small script.'],
 links:[['MLOps Zoomcamp project examples','https://github.com/DataTalksClub/mlops-zoomcamp']],ex:[]}
};

// the RAG project becomes portfolio project 2
old.K7.t='Project: a RAG service you can show';old.K7.sum='Portfolio project 2';old.K7.min=90;
old.K7.body=`<p>Build the RAG system from the code station as a complete small service. Use your own notes or public documents. Do not use company data.</p>
 ${txt`documents → ingestion script (chunk, embed) → Postgres + pgvector
                                                   │
FastAPI:  POST /v1/ask  (hybrid retrieval → generate with sources, streamed)   GET /health
                                                   │
evals:    30 questions with expected source and answer, 5 without an answer.  Runs in CI
tracing:  one JSON line per request: question, chunk IDs, tokens, milliseconds
docker compose up   starts database and API.   A small web page or the /docs page to try it`}
 <p>In the README, show the two eval numbers (retrieval hit rate and answer correctness), and one experiment: "hybrid search raised the hit rate from 71 % to 88 %". A measured improvement is the strongest thing you can show in an AI interview.</p>`;
old.K7.do=['Collect 20 to 50 pages of text.','Ingestion script: chunk, embed, store with metadata.','Hybrid retrieval and generation with sources.','FastAPI endpoint with streaming, API key and rate limit.','Eval set and a CI job that runs it.','README with picture, numbers, one measured experiment, cost per 1,000 questions.'];
old.K7.key=['Show numbers: hit rate, correctness, cost per question.','One measured improvement beats ten features.'];
old.K3.do=['Ask three questions in the demo. Find one question where the wrong chunk wins and think about why.'];
old.K9.body=old.K9.body.replace('That is why the Pro skills line on this site matters as much as the tools.','That is why the Career line on this site matters as much as the tools.');

TRACKS.ai.goal='Build, evaluate and run AI systems: language models, RAG, agents, computer vision';
TRACKS.ai.intro='This is the main line. First you see how models work, with things to click. Then you build with them in Python: API calls, RAG, agents, vision. Then you learn to run them in production. The goal is an engineer who can ship an AI system and prove that it works.';
TRACKS.ai.stations=[N.KA1,N.KA2,N.KA3,old.K1,old.K2,sec(old.K8,'Build with language models'),N.KA4,old.K3,N.KA5,old.K5,N.KA6,old.K6,sec(old.K4,'Computer vision'),N.KA7,N.KA8,N.KA9,old.K11,old.K12,old.K9,sec(old.K7,'Build it'),N.KA10];
delete N.KA4.sec;delete N.KA7.sec;delete N.KA10.sec;N.KA2.sec='How models learn';
})();
