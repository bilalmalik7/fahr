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
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


class RateLimiter:
    """At most `limit` requests per user in any `window` seconds."""

    def __init__(self, limit: int = 5, window: float = 60.0):
        self.limit, self.window, self.seen = limit, window, {}

    def allow(self, user_name: str, now: float | None = None) -> bool:
        """Forget timestamps older than the window. If fewer than `limit` remain, record `now` and return True."""
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")


def write_trace(path: str | Path, record: dict) -> None:
    """Append the record as one JSON line (UTF-8, ensure_ascii=False)."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


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
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")

    return app
