# Runbook: HatchGuard (write during Sprint 6, ticket HG-20)

## What this service does (2 lines)

## How to see if it is healthy
- `GET /health`
- Traces: `traces/requests.jsonl` (one line per request: user, tools, tokens, ms, stopped)
- Numbers to watch: error rate, p95 milliseconds, tokens per request, share of `stopped = step_limit`

## Alerts and what to do
| Symptom | Likely cause | First action |
|---------|--------------|--------------|
| Many 5xx answers | model provider down, bad deploy | check provider status, roll back to the previous image |
| Many 429 | one user in a loop, limit too low | look at the trace for that user |
| Tokens per request doubled | a prompt or tool result grew | compare traces of today and last week |
| Many `step_limit` | the model is confused by a tool error | read three such traces |
| A ticket to an unknown address was blocked | prompt injection attempt | keep the trace, find the poisoned document, report it |

## How to roll back
## How to rotate the API key
## Who to call
