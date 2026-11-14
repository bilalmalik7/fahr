# Project charter: HatchGuard

**Problem.** Shift leads at three hatcheries find out about a bad hatch days later, from a report. Finding the cause means asking three people and opening four systems. A machine that ran too warm for six weeks cost about 13 hatch-rate points before anyone connected the alarm notes with the numbers.

**Goal.** An assistant that answers operations questions from the batch data, the handbook and the shift notes, warns about risky batches, and can open a service ticket, safely.

**Done when** (measurable):
1. Data quality: every raw row is either clean or quarantined with a reason. No silent drops.
2. The risk model catches at least 80 % of bad batches on unseen later months, and beats the baseline.
3. Retrieval hit rate of at least 85 % on the eval set, 0 leaks of manager-only pages, 0 answers to off-topic questions.
4. The red-team suite passes: a poisoned note or document cannot make the agent send data out or read another hatchery, even when the model is fooled.
5. The service runs with one command, has CI, traces every request, and has a runbook.

**Not goals.** A chat user interface. Fine-tuning. Real customer data (all data is invented).

**Users.** Shift leads (staff, one hatchery each), the operations manager (all hatcheries, sees prices).

**Risks.** Wrong numbers that look right. Data leaks across hatcheries or roles. Prompt injection through notes and vendor pages. Cost of model calls. Each has a ticket in the backlog.

**Team roles (you play all of them, one at a time).** Product owner: decides what is in scope. Engineer: builds. Reviewer: reads every pull request with the checklist before merging. Security: owns the threat model and the red-team suite. On call: owns the runbook.
