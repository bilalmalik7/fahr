"""Milestone 6 (part 1): the tools the agent may call.

A tool is a normal Python function plus a description for the model. The model only ASKS for a call.
Your code decides whether and how it runs. In this milestone the tools are still naive (they trust
their arguments). Milestone 8 adds the guard.
"""
from __future__ import annotations

import json
import sqlite3
from pathlib import Path

TOOL_SPECS = [
    {"name": "query_batches",
     "description": "Hatch results per machine for one hatchery since a date. Returns batches, eggs set, "
                    "chicks hatched, hatch rate in percent and average temperature per machine. "
                    "Use it for any question about numbers.",
     "input_schema": {"type": "object", "properties": {
         "hatchery": {"type": "string", "description": "Nord, Süd or West"},
         "since": {"type": "string", "description": "ISO date, e.g. 2026-09-01"}}, "required": ["hatchery"]}},
    {"name": "read_shift_notes",
     "description": "The latest shift notes of one hatchery, written by staff. Free text.",
     "input_schema": {"type": "object", "properties": {"hatchery": {"type": "string"}}, "required": ["hatchery"]}},
    {"name": "search_docs",
     "description": "Search the hatchery handbook. Use it for rules, limits and what-to-do questions.",
     "input_schema": {"type": "object", "properties": {"query": {"type": "string"}}, "required": ["query"]}},
    {"name": "predict_risk",
     "description": "Probability (0 to 1) that a batch with these values hatches below 75 percent.",
     "input_schema": {"type": "object", "properties": {
         "egg_age_days": {"type": "number"}, "flock_age_weeks": {"type": "number"},
         "avg_temp": {"type": "number"}, "humidity": {"type": "number"}},
         "required": ["egg_age_days", "flock_age_weeks", "avg_temp", "humidity"]}},
    {"name": "create_ticket",
     "description": "Create a service ticket and e-mail it. Use only when a machine needs a technician.",
     "input_schema": {"type": "object", "properties": {
         "title": {"type": "string"}, "body": {"type": "string"},
         "to": {"type": "string", "description": "e-mail address, default service@hatchery.example"}},
         "required": ["title", "body"]}},
]


class Toolbox:
    def __init__(self, db_path: str | Path, index=None, model=None, user: dict | None = None, guard=None):
        self.db_path, self.index, self.model, self.guard = db_path, index, model, guard
        self.user = user or {"user_name": "chris", "hatchery": "*", "role": "manager"}
        self.outbox: list[dict] = []          # every e-mail that was "sent"

    def query_batches(self, hatchery: str, since: str = "2026-08-01") -> list[dict]:
        """One row per machine: machine, batches, eggs_set, hatched, rate_pct (1 decimal), avg_temp (2 decimals).
        Skip rows where hatched is NULL or hatched > eggs_set. Use query parameters (?), never string building."""
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")

    def read_shift_notes(self, hatchery: str, limit: int = 5) -> list[dict]:
        """The newest `limit` notes of the hatchery as dicts with note_date, author, text."""
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")

    def search_docs(self, query: str) -> list[dict]:
        """Search the index with the ROLE OF THE USER (self.user["role"]). Return dicts with doc and text."""
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")

    def predict_risk(self, egg_age_days: float, flock_age_weeks: float, avg_temp: float, humidity: float) -> float:
        from . import ml
        return round(ml.predict_risk(self.model, egg_age_days, flock_age_weeks, avg_temp, humidity), 3)

    def create_ticket(self, title: str, body: str, to: str = "service@hatchery.example") -> str:
        self.outbox.append({"to": to, "title": title, "body": body})
        return f"ticket created and sent to {to}"

    def call(self, name: str, args: dict) -> str:
        """Run one tool and return its result as text (JSON for lists and dicts).

        1. If name is not one of the five tools, raise ValueError("unknown tool: ...").
        2. If self.guard is set: args = self.guard.check(name, args)   (it may raise PermissionError)
        3. Call the method with **args.
        4. Turn the result into text. If self.guard is set: text = self.guard.clean_result(text)
        """
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")
