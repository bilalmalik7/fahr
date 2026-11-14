import json

from conftest import USERS, mod

from hatchguard.llm import FakeLLM, text_reply, tool_reply


def box(db, index, model, user="chris", guard=None):
    return mod("tools").Toolbox(db, index=index, model=model, user=USERS[user], guard=guard)


def test_query_batches_shows_the_hot_machine(db, index, model):
    rows = box(db, index, model).query_batches("Süd", "2026-08-24")
    by = {r["machine"]: r for r in rows}
    assert set(by) == {"S1", "S2", "S3", "S4"}
    assert by["S3"]["rate_pct"] < by["S1"]["rate_pct"] - 10 and by["S3"]["avg_temp"] > 38.3


def test_call_returns_text_and_rejects_unknown_tools(db, index, model):
    b = box(db, index, model)
    out = b.call("read_shift_notes", {"hatchery": "Süd"})
    assert isinstance(out, str) and len(json.loads(out)) == 4
    try:
        b.call("drop_database", {})
        assert False, "unknown tools must raise ValueError"
    except ValueError:
        pass


def test_agent_runs_tools_and_answers(db, index, model):
    llm = FakeLLM(script=[
        tool_reply("query_batches", {"hatchery": "Süd", "since": "2026-08-24"}, "c1"),
        tool_reply("search_docs", {"query": "temperature damages embryos"}, "c2"),
        text_reply("S3 runs at 38.7 degrees and hatches far below the other machines."),
    ])
    res = mod("agent").run_agent(llm, "Why is Süd hatching badly?", box(db, index, model))
    assert res.stopped == "done" and "S3" in res.answer
    assert [s["tool"] for s in res.steps] == ["query_batches", "search_docs"]
    assert res.input_tokens > 0 and res.output_tokens > 0
    # the third request must contain both earlier tool results
    last = llm.calls[2]["messages"]
    assert [m["role"] for m in last] == ["user", "assistant", "user", "assistant", "user"]
    assert last[2]["content"][0]["type"] == "tool_result" and last[2]["content"][0]["tool_use_id"] == "c1"
    assert llm.calls[0]["tools"], "the tool list must be sent to the model"


def test_tool_errors_go_back_to_the_model(db, index, model):
    llm = FakeLLM(script=[tool_reply("query_batches", {"wrong_arg": 1}, "c1"), text_reply("Sorry, that failed.")])
    res = mod("agent").run_agent(llm, "x", box(db, index, model))
    assert res.steps[0]["error"] and res.steps[0]["result"].startswith("Error:")
    assert llm.calls[1]["messages"][2]["content"][0]["is_error"] is True


def test_step_limit(db, index, model):
    llm = FakeLLM(script=[tool_reply("read_shift_notes", {"hatchery": "Nord"}, f"c{i}") for i in range(20)])
    res = mod("agent").run_agent(llm, "loop for ever", box(db, index, model), max_steps=3)
    assert res.stopped == "step_limit" and len(res.steps) == 3 and len(llm.calls) == 3
