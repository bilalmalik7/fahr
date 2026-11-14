# Threat model: HatchGuard (fill this in during Sprint 5, ticket HG-14)

## 1. What are we building?
Draw it. Boxes: user, API, agent loop, model, tools (query_batches, read_shift_notes, search_docs, predict_risk, create_ticket), database, handbook, outbox. Arrows: who sends what to whom. Mark every arrow that carries UNTRUSTED text (user messages, shift notes, vendor pages, model output).

## 2. What can go wrong?
Walk STRIDE over every arrow, then the OWASP Top 10 for LLM applications.

| # | Threat | Where | STRIDE / OWASP LLM | Likelihood | Impact | Risk |
|---|--------|-------|--------------------|-----------|--------|------|
| 1 | A shift note contains hidden instructions and the agent sends data out | read_shift_notes → model → create_ticket | Tampering / Prompt injection + Excessive agency | | | |
| 2 | Staff of Nord reads the numbers of Süd | query_batches | Information disclosure / Broken access control | | | |
| 3 | Staff reads supplier prices | search_docs | Information disclosure / Sensitive information | | | |
| 4 | ... | | | | | |

## 3. What do we do about it?
One control per threat. Prefer code over prompts. Name the test that proves it.

| # | Control | Enforced in | Test |
|---|---------|-------------|------|

## 4. Did we do a good job?
Red-team results before and after. What is still open?
