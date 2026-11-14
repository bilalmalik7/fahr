"""Milestone 7: evals. Measure the system with fixed test cases, so every change gives a number.

You practise: an evaluation set, retrieval hit rate, checking that the system refuses when it should,
checking that restricted documents do not leak, and comparing two versions.
"""
from __future__ import annotations

# role: who asks.  doc: the handbook page that must be found.
# doc None + "off": True  = an off-topic question: the search must return nothing.
# doc None without "off"   = a leak check only: staff asks for something only managers may read.
EVAL_SET = [
    {"q": "What is a normal hatch rate?", "role": "staff", "doc": "hatch_rate.md"},
    {"q": "Below which hatch rate is a batch bad?", "role": "staff", "doc": "hatch_rate.md"},
    {"q": "How many days do eggs stay in the setter?", "role": "staff", "doc": "setter_settings.md"},
    {"q": "Which temperature damages embryos?", "role": "staff", "doc": "setter_settings.md"},
    {"q": "What should I check when the hatch rate falls?", "role": "staff", "doc": "low_hatch_checklist.md"},
    {"q": "At what temperature do we store eggs before setting?", "role": "staff", "doc": "egg_storage.md"},
    {"q": "How much hatch rate do old eggs lose per day?", "role": "staff", "doc": "egg_storage.md"},
    {"q": "When does the nightly load copy data from the ERP?", "role": "staff", "doc": "data_pipeline.md"},
    {"q": "What is the contract price per hatching egg for Nord?", "role": "manager", "doc": "supplier_prices.md"},
    {"q": "What is the contract price per hatching egg for Nord?", "role": "staff", "doc": None},   # must not leak
    {"q": "Who won the football world cup in 2014?", "role": "staff", "doc": None, "off": True},
    {"q": "What is the capital of Australia?", "role": "manager", "doc": None, "off": True},
]


def retrieval_eval(index, cases: list[dict] = EVAL_SET, k: int = 3) -> dict:
    """Run index.search for every case and return:
      "hit_rate":      share of cases WITH a doc where that doc is among the results (0.0 to 1.0)
      "leaks":         number of cases where a staff user got a chunk with access "manager"
      "false_answers": number of off-topic cases ("off": True) where the search still returned something
      "misses":        list of the questions that were not found
    """
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def answer_eval(answer_fn, cases: list[dict]) -> dict:
    """answer_fn(question, role) -> {"answer": str, "sources": [...]}.
    Each case has "q", "role" and "must": a text that has to appear in the answer (compare in lower case).
    Return {"correct": n, "total": n, "score": correct / total, "failed": [questions]}."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def compare(before: dict, after: dict, key: str = "hit_rate") -> str:
    """A one-line verdict: "better (+0.17)", "worse (-0.08)" or "same". Round the difference to 2 decimals."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")
