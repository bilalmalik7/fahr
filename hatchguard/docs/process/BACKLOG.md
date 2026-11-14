# Backlog: six sprints of two weeks

Plan 8 to 10 hours per week. One ticket = one branch = one pull request. Tick the box when the definition of done is met.

Each sprint ends with a **review** (demo: show the numbers), a **retro** (three lines: keep, stop, try) and one **interview story** written in `docs/process/STORIES.md` (situation, task, action, result, with a number).

## Sprint 1 (weeks 1 to 2): foundations and data

Sprint goal: a repository a stranger can run, and data we can trust.

- [ ] **HG-1 Repository and first run.** Create your own private repository from this folder. `uv sync`, generate the data, run the tests once (they fail: good). Protect `main`.
  *Accept:* a fresh clone runs `uv run pytest` and shows the failing tests. README explains setup.
- [ ] **HG-2 Clean the batch data (milestone 1).** Write `clean.py`.
  *Accept:* `tests/test_m01_clean.py` green. Every raw row is in `good` or in `quarantine` with a reason. Report: 1148 rows, 8 duplicates, 5 missing, 3 impossible.
- [ ] **HG-3 CI.** Copy `deploy/github-actions-ci.yml` to `.github/workflows/ci.yml`. For now it may run only lint and tests.
  *Accept:* a pull request shows a green check. A failing test blocks the merge.
- [ ] **HG-4 ADR 0001: quarantine, not delete.** Write why bad rows are kept with a reason.
  *Accept:* ADR merged, with the price we pay.

## Sprint 2 (weeks 3 to 4): machine learning

Sprint goal: a risk model that beats the baseline on later months, and you can explain every number.

- [ ] **HG-5 Risk model (milestone 2).** Write `ml.py`: features, time split, baseline, model, evaluation, threshold.
  *Accept:* `tests/test_m02_ml.py` green. The pull request shows baseline accuracy, recall and precision at your threshold.
- [ ] **HG-6 The training loop by hand (milestone 3).** Write `loop.py` with numpy only.
  *Accept:* `tests/test_m03_loop.py` green. The loss goes down. You can draw the loop on paper.
- [ ] **HG-7 ADR 0002: the threshold.** A missed bad batch costs about 20 times a false alarm. Decide the threshold and write it down.
  *Accept:* ADR with the confusion matrix and the business reason.
- [ ] **HG-8 Model card.** One page `docs/MODEL_CARD.md`: data, split, numbers, limits, when to retrain.

## Sprint 3 (weeks 5 to 6): language models and retrieval

Sprint goal: the assistant reads notes and the handbook, and never shows a page to the wrong role.

- [ ] **HG-9 Structured extraction (milestone 4).** Write `extract.py`.
  *Accept:* `tests/test_m04_extract.py` green. Bad model output is retried once, then fails loudly.
- [ ] **HG-10 Design doc: handbook search.** Use the template before you code. Half a page is enough.
  *Accept:* the doc names the permission rule and the "not found" rule.
- [ ] **HG-11 RAG (milestone 5).** Write `rag.py`.
  *Accept:* `tests/test_m05_rag.py` green. Staff never get `supplier_prices`. Off-topic questions get "not found" and no model call.

## Sprint 4 (weeks 7 to 8): agent and evals

Sprint goal: the agent finds the hot machine with tools, and we measure quality with numbers, not feelings.

- [ ] **HG-12 Tools and the agent loop (milestone 6).** Write `tools.py` and `agent.py`.
  *Accept:* `tests/test_m06_agent.py` green. The loop stops at the step limit. Tool errors go back to the model as text.
- [ ] **HG-13 Evals (milestone 7).** Write `evals.py`. Add five eval cases of your own.
  *Accept:* `tests/test_m07_evals.py` green. Hit rate at least 85 %, 0 leaks, 0 false answers.
- [ ] **HG-13b Experiment.** Change one thing in retrieval (chunk size, k, or `min_score`). Compare before and after with `compare`.
  *Accept:* a short note in the pull request: what changed, the two numbers, keep or revert.
- [ ] **HG-13c (optional, a few cents) Real model run.** Run `cli ask` with a real model for three questions. Write tokens and cost per question.

## Sprint 5 (weeks 9 to 10): security

Sprint goal: a fooled model cannot hurt us. Proven by tests.

- [ ] **HG-14 Threat model.** Fill in `docs/process/THREAT_MODEL.md`: the picture, at least eight threats, one control each.
- [ ] **HG-15 Attack first.** Run the first test in `tests/test_m08_security.py` and read the trace: the unguarded agent sends data out. Write the finding.
- [ ] **HG-16 Guard (milestone 8).** Write `guard.py`.
  *Accept:* `tests/test_m08_security.py` green with the `GullibleLLM`.
- [ ] **HG-17 Findings report.** `docs/REPORT.md` with `findings_report`: title, severity, how to reproduce, impact, fix, retest.
  *Accept:* a manager can read page one in two minutes.

## Sprint 6 (weeks 11 to 12): ship and operate

Sprint goal: one command starts the service, CI guards it, and you can operate it.

- [ ] **HG-18 API (milestone 9).** Write `api.py`.
  *Accept:* `tests/test_m09_api.py` green: key needed, rate limit works, every request leaves a trace line.
- [ ] **HG-19 Container and pipeline (milestone 10).** `docker compose up` works. CI now also runs gitleaks, Trivy and the image build. (Optional: deploy with `deploy/main.tf`, then destroy.)
  *Accept:* CI green with all steps. The image does not run as root.
- [ ] **HG-20 Runbook and game day.** Fill in `docs/process/RUNBOOK.md`. Then break something on purpose (wrong key, poisoned note, model down) and write a postmortem.
- [ ] **HG-21 Finish.** README with a picture, the numbers and the limits. A five-minute demo you can give without notes. Six stories in `STORIES.md`.

## Parking lot (after week 12)

Real embeddings (`uv sync --extra embed`) and a second eval run. An MCP server for the tools. Model-graded answer evals. Experiment tracking with MLflow. A second model provider behind the same `LLM` interface.
