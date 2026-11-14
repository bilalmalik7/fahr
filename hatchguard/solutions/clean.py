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
    # >>> YOUR CODE
    con = sqlite3.connect(db_path)
    try:
        rows = con.execute(f"SELECT {', '.join(COLUMNS)} FROM batches ORDER BY set_date, batch_id").fetchall()
    finally:
        con.close()
    return [dict(zip(COLUMNS, r)) for r in rows]
    # <<<


def clean_batches(rows: list[dict]) -> tuple[list[dict], list[dict]]:
    """Split rows into (good, quarantine).

    Rules, in this order:
      1. A row that is an exact copy of an earlier row is dropped (not quarantined: it is the same fact twice).
      2. hatched is None                  -> quarantine with "_reason": "missing hatched"
      3. hatched > eggs_set               -> quarantine with "_reason": "hatched > eggs_set"
      4. Good rows get two new fields:  "rate" = hatched / eggs_set  (float)  and  "bad" = 1 if rate < 0.75 else 0
    Do not change the input rows. Work on copies.
    """
    # >>> YOUR CODE
    good, quarantine, seen = [], [], set()
    for row in rows:
        key = tuple(row[c] for c in COLUMNS)
        if key in seen:
            continue
        seen.add(key)
        r = dict(row)
        if r["hatched"] is None:
            quarantine.append({**r, "_reason": "missing hatched"})
        elif r["hatched"] > r["eggs_set"]:
            quarantine.append({**r, "_reason": "hatched > eggs_set"})
        else:
            r["rate"] = r["hatched"] / r["eggs_set"]
            r["bad"] = 1 if r["rate"] < 0.75 else 0
            good.append(r)
    return good, quarantine
    # <<<


def quality_report(rows: list[dict]) -> dict:
    """Return {"rows": n, "duplicates": n, "missing_hatched": n, "impossible": n, "good": n} for the raw rows."""
    # >>> YOUR CODE
    good, quarantine = clean_batches(rows)
    return {
        "rows": len(rows),
        "duplicates": len(rows) - len(good) - len(quarantine),
        "missing_hatched": sum(q["_reason"] == "missing hatched" for q in quarantine),
        "impossible": sum(q["_reason"] == "hatched > eggs_set" for q in quarantine),
        "good": len(good),
    }
    # <<<
