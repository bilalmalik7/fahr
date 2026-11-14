# HatchGuard

One project, twelve weeks. You build a secure AI assistant for a hatchery company, the way a team in a company builds it: tickets, branches, pull requests, tests, CI, a threat model, a runbook.

All data is invented. The code runs on a normal laptop. Every test runs **without** an API key and without cost.

The lessons for every ticket are on the website (line "Project"). This folder is the workshop.

## What you build

```
question ──> API (key, rate limit, trace) ──> agent loop (step limit)
                                                │
                     ┌──────────────┬───────────┼─────────────┬───────────────┐
               query_batches  read_shift_notes  search_docs  predict_risk  create_ticket
                 (SQLite)        (SQLite)        (RAG)        (ML model)     (outbox)
                     └──────────────┴───── guard: who may do what ─────────┘
```

| Milestone | File you write | You learn | Test |
|---|---|---|---|
| 1 | `hatchguard/clean.py` | data quality, quarantine, reports | `tests/test_m01_clean.py` |
| 2 | `hatchguard/ml.py` | baseline, time split, precision and recall, threshold | `tests/test_m02_ml.py` |
| 3 | `hatchguard/loop.py` | the training loop by hand: forward, loss, gradient, step | `tests/test_m03_loop.py` |
| 4 | `hatchguard/extract.py` | LLM calls, structured output, validation, retry | `tests/test_m04_extract.py` |
| 5 | `hatchguard/rag.py` | chunks, embeddings, search, access filter, "not found" | `tests/test_m05_rag.py` |
| 6 | `hatchguard/tools.py`, `agent.py` | tools, the agent loop, step limits | `tests/test_m06_agent.py` |
| 7 | `hatchguard/evals.py` | eval sets, hit rate, leaks, before and after | `tests/test_m07_evals.py` |
| 8 | `hatchguard/guard.py` | prompt injection, least privilege, human approval | `tests/test_m08_security.py` |
| 9 | `hatchguard/api.py` | API, keys, rate limit, traces | `tests/test_m09_api.py` |
| 10 | `Dockerfile`, CI, `deploy/` | container, pipeline, scans, runbook | CI is green |

`data.py`, `llm.py`, `embed.py` and `cli.py` are complete. Read them, do not change them.

## Setup (once)

Install [uv](https://docs.astral.sh/uv/), then:

```bash
uv sync
```

```bash
uv run python -m hatchguard.data
```

The second command creates the database `data/hatchguard.db` and the handbook pages in `docs/sop/`.

## The daily loop

1. Take the next ticket from `docs/process/BACKLOG.md`. Read the lesson on the website.
2. Make a branch: `git switch -c hg-2-clean-batches`
3. Open the file. Each function has a docstring that says what it must do, and `raise NotImplementedError("your turn")`.
4. Write the code. Run the test for the milestone:

```bash
uv run pytest tests/test_m01_clean.py
```

5. Green? Run everything and the linter:

```bash
uv run pytest
```

```bash
uv run ruff check hatchguard tests
```

6. Commit, push, open a pull request with `docs/process/PULL_REQUEST_TEMPLATE.md`. Review it the next day with the checklist in `docs/process/DEFINITION_OF_DONE.md`. Merge.

## When you are stuck

Work on it for 30 minutes first. Then open the same file in `solutions/`. Read it, close it, and write your own version from memory. Copying teaches nothing.

To check that the kit itself works, run the tests against the reference code:

```bash
HG_IMPL=solutions uv run pytest
```

## Try the finished thing

```bash
HG_IMPL=solutions uv run python -m hatchguard.cli report
```

```bash
HG_IMPL=solutions uv run python -m hatchguard.cli evals
```

With a real model (optional, costs a few cents): `uv sync --extra llm`, set `ANTHROPIC_API_KEY`, then

```bash
HG_IMPL=solutions uv run python -m hatchguard.cli ask "Why is Süd hatching badly since September?" --user ben
```

Without a key the command line and the API still start, in demo mode, but the answers are scripted. The tests never need a key: they use `FakeLLM` (answers you script) and `GullibleLLM` (a model that obeys hidden instructions, for the red-team tests).

## Rules of this project

- Never put real company data, real names or real keys in this repository. Keys live in environment variables.
- `main` is protected: nothing lands there without a pull request and green CI.
- A decision that is hard to undo gets an ADR in `docs/adr/`.

## Folder map

```
hatchguard/      your code (starter files with docstrings)
solutions/       reference code. Look only after 30 minutes of trying
tests/           one file per milestone. They are the acceptance criteria
docs/process/    charter, backlog, definition of done, templates, interview questions
docs/adr/        your decisions
docs/sop/        the invented handbook the assistant searches (two pages are poisoned on purpose)
deploy/          CI workflow and a Terraform example
```
