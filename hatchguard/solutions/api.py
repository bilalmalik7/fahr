"""Milestone 9: serve it. An API with login, rate limit and a trace of every request.

You practise: FastAPI, API keys, per-user limits, structured logs with tokens and milliseconds.
"""
from __future__ import annotations

import json
import sqlite3
import time
from pathlib import Path

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field


class Ask(BaseModel):
    question: str = Field(min_length=3, max_length=500)


def find_user(db_path: str | Path, api_key: str | None) -> dict | None:
    """Look the key up in the table `users`. Return {"user_name", "hatchery", "role"} or None."""
    # >>> YOUR CODE
    if not api_key:
        return None
    con = sqlite3.connect(db_path)
    try:
        row = con.execute("SELECT user_name, hatchery, role FROM users WHERE api_key = ?", (api_key,)).fetchone()
    finally:
        con.close()
    return dict(zip(["user_name", "hatchery", "role"], row)) if row else None
    # <<<


class RateLimiter:
    """At most `limit` requests per user in any `window` seconds."""

    def __init__(self, limit: int = 5, window: float = 60.0):
        self.limit, self.window, self.seen = limit, window, {}

    def allow(self, user_name: str, now: float | None = None) -> bool:
        """Forget timestamps older than the window. If fewer than `limit` remain, record `now` and return True."""
        # >>> YOUR CODE
        now = time.time() if now is None else now
        recent = [t for t in self.seen.get(user_name, []) if now - t < self.window]
        ok = len(recent) < self.limit
        if ok:
            recent.append(now)
        self.seen[user_name] = recent
        return ok
        # <<<


def write_trace(path: str | Path, record: dict) -> None:
    """Append the record as one JSON line (UTF-8, ensure_ascii=False)."""
    # >>> YOUR CODE
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    # <<<


def create_app(llm, db_path: str | Path, index=None, model=None, trace_path: str | Path = "traces/requests.jsonl",
               limit: int = 5) -> FastAPI:
    """Build the app.

    GET  /health   -> {"status": "ok"}
    POST /v1/ask   header X-API-Key, body {"question": "..."}
        401 when the key is unknown, 429 when the rate limit is hit.
        Otherwise: build a Guard for the user (no approver: tickets are refused), a Toolbox with that guard,
        run the agent, write one trace record
          {"user", "question", "tools": [names], "input_tokens", "output_tokens", "ms", "stopped"}
        and return {"answer", "tools": [names], "stopped"}.
    """
    from . import agent as agent_module
    from . import guard as guard_module
    from . import tools as tools_module

    app = FastAPI(title="HatchGuard")
    limiter = RateLimiter(limit=limit)

    @app.get("/health")
    def health() -> dict:
        return {"status": "ok"}

    @app.post("/v1/ask")
    def ask(body: Ask, x_api_key: str | None = Header(default=None)) -> dict:
        # >>> YOUR CODE
        user = find_user(db_path, x_api_key)
        if user is None:
            raise HTTPException(status_code=401, detail="unknown API key")
        if not limiter.allow(user["user_name"]):
            raise HTTPException(status_code=429, detail="too many requests, wait a minute")
        start = time.perf_counter()
        guard = guard_module.Guard(user)
        box = tools_module.Toolbox(db_path, index=index, model=model, user=user, guard=guard)
        result = agent_module.run_agent(llm, body.question, box)
        names = [s["tool"] for s in result.steps]
        write_trace(trace_path, {"user": user["user_name"], "question": body.question, "tools": names,
                                 "input_tokens": result.input_tokens, "output_tokens": result.output_tokens,
                                 "ms": round((time.perf_counter() - start) * 1000), "stopped": result.stopped})
        return {"answer": result.answer, "tools": names, "stopped": result.stopped}
        # <<<

    return app
