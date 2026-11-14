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
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")

    def clean_result(self, text: str) -> str:
        """Remove HTML comments from tool results before the model reads them."""
        # TODO: write this. Read the docstring above. Delete the next line when you start.
        raise NotImplementedError("your turn")


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
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")
