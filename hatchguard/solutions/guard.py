"""Milestone 8: security. Assume the model WILL be fooled, and make sure nothing bad can happen anyway.

The guard is plain code that sits between the model's wish and the real action. It enforces three things
a prompt can never guarantee: who may see which data, where data may be sent, and human approval.
"""
from __future__ import annotations

import re
from typing import Callable

HATCHERY_TOOLS = {"query_batches", "read_shift_notes"}


class Guard:
    def __init__(self, user: dict, allowed_domains: set[str] | None = None,
                 approve: Callable[[str, dict], bool] | None = None):
        """user: {"user_name", "hatchery" ("Nord", ... or "*" for all), "role"}.
        approve(tool_name, args) asks a human and returns True or False. None means: nobody can approve."""
        self.user = user
        self.allowed_domains = allowed_domains or {"hatchery.example"}
        self.approve = approve

    def check(self, name: str, args: dict) -> dict:
        """Return the (possibly corrected) arguments, or raise PermissionError with a clear message.

        Rules:
          1. Tools in HATCHERY_TOOLS: a user whose hatchery is not "*" may only ask for their own hatchery.
             The right comes from self.user, never from what the model wrote.
          2. create_ticket: if "to" is missing, set it to "service@hatchery.example".
             The domain after "@" must be in self.allowed_domains, else PermissionError.
             Then a human must approve: if self.approve is None or returns False, PermissionError.
          3. Everything else passes unchanged.
        """
        # >>> YOUR CODE
        args = dict(args)
        if name in HATCHERY_TOOLS and self.user["hatchery"] != "*" and args.get("hatchery") != self.user["hatchery"]:
            raise PermissionError(f"{self.user['user_name']} may only see hatchery {self.user['hatchery']}")
        if name == "create_ticket":
            args.setdefault("to", "service@hatchery.example")
            domain = args["to"].rsplit("@", 1)[-1].lower()
            if domain not in self.allowed_domains:
                raise PermissionError(f"recipient domain {domain} is not allowed")
            if self.approve is None or not self.approve(name, args):
                raise PermissionError("a human did not approve this ticket")
        return args
        # <<<

    def clean_result(self, text: str) -> str:
        """Remove HTML comments from tool results before the model reads them."""
        # >>> YOUR CODE
        return re.sub(r"<!--.*?-->", "", text, flags=re.S)
        # <<<


def findings_report(findings: list[dict]) -> str:
    """Turn findings into a Markdown report. Each finding has: title, severity, reproduce, impact, fix, verified.
    Sort by severity: High first, then Medium, then Low. Format per finding:

    ## 1. <title>
    - Severity: <severity>
    - Reproduce: <reproduce>
    - Impact: <impact>
    - Fix: <fix>
    - Verified: <verified>
    """
    # >>> YOUR CODE
    order = {"High": 0, "Medium": 1, "Low": 2}
    out = ["# Security findings", ""]
    for i, f in enumerate(sorted(findings, key=lambda f: order.get(f["severity"], 3)), 1):
        out += [f"## {i}. {f['title']}", f"- Severity: {f['severity']}", f"- Reproduce: {f['reproduce']}",
                f"- Impact: {f['impact']}", f"- Fix: {f['fix']}", f"- Verified: {f['verified']}", ""]
    return "\n".join(out)
    # <<<
