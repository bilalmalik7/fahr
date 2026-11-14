"""Small command line for the project. Complete.

  uv run python -m hatchguard.cli report          data quality and model numbers
  uv run python -m hatchguard.cli evals           retrieval eval
  uv run python -m hatchguard.cli ask "Why is Süd hatching badly?" --user ben
  uv run python -m hatchguard.cli serve           start the API on port 8000

`ask` and `serve` use the real model when ANTHROPIC_API_KEY is set (and `uv sync --extra llm` was run).
Set HG_IMPL=solutions to run the reference code instead of yours.
"""
from __future__ import annotations

import argparse
import importlib
import json
import os

from . import data as data_module
from .embed import HashEmbedder
from .llm import default_llm

IMPL = os.environ.get("HG_IMPL", "hatchguard")
m = lambda name: importlib.import_module(f"{IMPL}.{name}")  # noqa: E731

USERS = {"anna": {"user_name": "anna", "hatchery": "Nord", "role": "staff"},
         "ben": {"user_name": "ben", "hatchery": "Süd", "role": "staff"},
         "chris": {"user_name": "chris", "hatchery": "*", "role": "manager"}}


def build():
    if not data_module.DB_PATH.exists():
        data_module.main()
    good, _ = m("clean").clean_batches(m("clean").load_batches(data_module.DB_PATH))
    train, test = m("ml").time_split(good, "2026-05-01")
    model = m("ml").train_model(train)
    index = m("rag").Index(m("rag").load_docs(data_module.SOP_DIR), HashEmbedder())
    return good, train, test, model, index


def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("command", choices=["report", "evals", "ask", "serve"])
    p.add_argument("question", nargs="?")
    p.add_argument("--user", default="chris", choices=list(USERS))
    a = p.parse_args()
    good, train, test, model, index = build()
    if a.command == "report":
        print(json.dumps(m("clean").quality_report(m("clean").load_batches(data_module.DB_PATH)), indent=2))
        t = m("ml").pick_threshold(model, test, 0.8)
        print("baseline accuracy:", round(m("ml").baseline_accuracy(train, test), 3))
        print(f"model at threshold {t}:", {k: round(v, 3) for k, v in m("ml").evaluate(model, test, t).items()})
    elif a.command == "evals":
        print(json.dumps(m("evals").retrieval_eval(index), indent=2, ensure_ascii=False))
    elif a.command == "ask":
        user = USERS[a.user]
        guard = m("guard").Guard(user, approve=lambda name, args: input(f"Approve {name} {args}? [y/N] ").lower() == "y")
        box = m("tools").Toolbox(data_module.DB_PATH, index=index, model=model, user=user, guard=guard)
        res = m("agent").run_agent(default_llm(), a.question or "How are we doing?", box)
        for s in res.steps:
            print(f"  tool {s['tool']} {s['args']} -> {s['result'][:120]}")
        print(res.answer, f"\n[{res.input_tokens} tokens in, {res.output_tokens} out]")
    else:
        import uvicorn
        uvicorn.run(m("api").create_app(default_llm(), data_module.DB_PATH, index=index, model=model), host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
