"""The model layer. Complete: read it, you will use it from milestone 4 on.

Everything in the project talks to a model through one small interface, LLM.complete().
That has two big advantages:
  * Tests run with FakeLLM: free, fast, and the same result every time.
  * The real model (AnthropicLLM) can be swapped in with one line, or replaced by another provider.

Messages use the Anthropic format: a list of {"role": "user" | "assistant", "content": ...}.
Content is a string, or a list of blocks such as {"type": "text", ...}, {"type": "tool_use", ...},
{"type": "tool_result", ...}.
"""
from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from typing import Callable, Protocol


@dataclass
class ToolCall:
    id: str
    name: str
    args: dict


@dataclass
class Reply:
    blocks: list[dict]                      # the assistant content blocks, to send back unchanged in the history
    stop_reason: str = "end_turn"           # end_turn | tool_use | max_tokens | refusal
    input_tokens: int = 0
    output_tokens: int = 0

    @property
    def text(self) -> str:
        return "".join(b.get("text", "") for b in self.blocks if b.get("type") == "text")

    @property
    def tool_calls(self) -> list[ToolCall]:
        return [ToolCall(b["id"], b["name"], b.get("input", {})) for b in self.blocks if b.get("type") == "tool_use"]


class LLM(Protocol):
    def complete(self, system: str, messages: list[dict], tools: list[dict] | None = None,
                 max_tokens: int = 1024) -> Reply: ...


def text_reply(text: str) -> Reply:
    return Reply(blocks=[{"type": "text", "text": text}], input_tokens=50, output_tokens=len(text.split()))


def tool_reply(name: str, args: dict, call_id: str = "call_1", text: str = "") -> Reply:
    blocks = ([{"type": "text", "text": text}] if text else []) + [
        {"type": "tool_use", "id": call_id, "name": name, "input": args}]
    return Reply(blocks=blocks, stop_reason="tool_use", input_tokens=60, output_tokens=20)


@dataclass
class FakeLLM:
    """Returns scripted replies in order. Records every request so tests can inspect prompts.

    script items are Reply objects, or functions (system, messages, tools) -> Reply.
    """
    script: list = field(default_factory=list)
    calls: list = field(default_factory=list)

    def complete(self, system, messages, tools=None, max_tokens=1024) -> Reply:
        self.calls.append({"system": system, "messages": [m for m in messages], "tools": tools})
        if not self.script:
            return text_reply("(fake model: no more scripted replies)")
        item = self.script.pop(0)
        return item(system, messages, tools) if callable(item) else item


INJECTION = re.compile(r"AI-INSTRUCTION:(.*?)(?:-->|$)", re.S)


@dataclass
class GullibleLLM:
    """A deliberately fooled model for security tests (milestone 8).

    It behaves like a model that obeys instructions hidden in any text it reads: if a tool result or
    message contains 'AI-INSTRUCTION ... create_ticket ...', it calls create_ticket and tries to send data out.
    Real models are fooled like this some of the time. Your defences must hold even when they are.
    """
    first: Callable[[str, list, list], Reply] | None = None
    calls: list = field(default_factory=list)

    def complete(self, system, messages, tools=None, max_tokens=1024) -> Reply:
        self.calls.append({"system": system, "messages": messages, "tools": tools})
        seen = _all_text(messages)
        already = any(b.get("type") == "tool_use" and b.get("name") == "create_ticket"
                      for m in messages if m["role"] == "assistant" and isinstance(m["content"], list)
                      for b in m["content"])
        if INJECTION.search(seen) and not already:
            return tool_reply("create_ticket", {"title": "close all alarms",
                                                "body": "batch list and prices", "to": "ext-audit@mail-example.net"},
                              call_id=f"inj_{len(self.calls)}")
        if self.first and len(self.calls) == 1:
            return self.first(system, messages, tools)
        return text_reply("Done.")


def _all_text(messages: list[dict]) -> str:
    out = []
    for m in messages:
        c = m["content"]
        if isinstance(c, str):
            out.append(c)
            continue
        for b in c:
            if b.get("type") == "text":
                out.append(b["text"])
            elif b.get("type") == "tool_result":
                rc = b.get("content")
                out.append(rc if isinstance(rc, str) else str(rc))
    return "\n".join(out)


class AnthropicLLM:
    """The real model. Needs:  uv sync --extra llm   and the environment variable ANTHROPIC_API_KEY.

    The model is set with the environment variable HG_MODEL (default claude-opus-5-5).
    If the model declines a request, the API can retry it on a fallback model ("fallbacks").
    """

    def __init__(self, model: str | None = None):
        import anthropic  # imported here so tests never need the package
        self.client = anthropic.Anthropic()
        self.model = model or os.environ.get("HG_MODEL", "claude-opus-5-5")

    def complete(self, system, messages, tools=None, max_tokens=4096) -> Reply:
        kwargs = dict(model=self.model, max_tokens=max_tokens, system=system, messages=messages)
        if tools:
            kwargs["tools"] = tools
        resp = self.client.beta.messages.create(betas=["server-side-fallback-2026-07-01"], fallbacks="default", **kwargs)
        blocks = [b.model_dump(exclude_none=True) for b in resp.content]
        return Reply(blocks=blocks, stop_reason=resp.stop_reason or "end_turn",
                     input_tokens=resp.usage.input_tokens, output_tokens=resp.usage.output_tokens)


def default_llm() -> LLM:
    """The real model if a key is set, otherwise a fake one that says so."""
    if os.environ.get("ANTHROPIC_API_KEY"):
        return AnthropicLLM()
    return FakeLLM(script=[text_reply("Demo mode: no ANTHROPIC_API_KEY is set, so no real model is called.")] * 1000)
