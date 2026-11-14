"""Milestone 1: load the raw batches, clean them, and say what was wrong.

You practise: reading from a database in Python, data quality rules, quarantine (never drop silently).
"""
from __future__ import annotations

import sqlite3
from pathlib import Path

COLUMNS = ["batch_id", "hatchery", "machine", "set_date", "egg_age_days", "flock_age_weeks",
           "avg_temp", "humidity", "eggs_set", "hatched"]


def load_batches(db_path: str | Path) -> list[dict]:
    """Return every row of the table `batches` as a dict, in the column order above."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def clean_batches(rows: list[dict]) -> tuple[list[dict], list[dict]]:
    """Split rows into (good, quarantine).

    Rules, in this order:
      1. A row that is an exact copy of an earlier row is dropped (not quarantined: it is the same fact twice).
      2. hatched is None                  -> quarantine with "_reason": "missing hatched"
      3. hatched > eggs_set               -> quarantine with "_reason": "hatched > eggs_set"
      4. Good rows get two new fields:  "rate" = hatched / eggs_set  (float)  and  "bad" = 1 if rate < 0.75 else 0
    Do not change the input rows. Work on copies.
    """
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def quality_report(rows: list[dict]) -> dict:
    """Return {"rows": n, "duplicates": n, "missing_hatched": n, "impossible": n, "good": n} for the raw rows."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")
