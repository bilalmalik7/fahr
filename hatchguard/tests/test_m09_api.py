import json

from conftest import mod
from fastapi.testclient import TestClient

from hatchguard.llm import FakeLLM, text_reply, tool_reply


def client(db, index, model, tmp_path, script, limit=5):
    app = mod("api").create_app(FakeLLM(script=script), db, index=index, model=model,
                                trace_path=tmp_path / "t.jsonl", limit=limit)
    return TestClient(app)


def test_health_and_auth(db, index, model, tmp_path):
    c = client(db, index, model, tmp_path, [])
    assert c.get("/health").json() == {"status": "ok"}
    assert c.post("/v1/ask", json={"question": "hello there"}).status_code == 401
    assert c.post("/v1/ask", json={"question": "hello there"}, headers={"X-API-Key": "wrong"}).status_code == 401
    assert c.post("/v1/ask", json={"question": "x"}, headers={"X-API-Key": "key-anna"}).status_code == 422


def test_ask_runs_the_agent_and_writes_a_trace(db, index, model, tmp_path):
    c = client(db, index, model, tmp_path, [tool_reply("query_batches", {"hatchery": "Nord"}, "c1"),
                                             text_reply("Nord is fine.")])
    r = c.post("/v1/ask", json={"question": "How is Nord doing?"}, headers={"X-API-Key": "key-anna"})
    assert r.status_code == 200 and r.json() == {"answer": "Nord is fine.", "tools": ["query_batches"], "stopped": "done"}
    rec = json.loads((tmp_path / "t.jsonl").read_text(encoding="utf-8").splitlines()[0])
    assert rec["user"] == "anna" and rec["tools"] == ["query_batches"] and rec["input_tokens"] > 0 and rec["ms"] >= 0


def test_the_api_enforces_the_guard(db, index, model, tmp_path):
    c = client(db, index, model, tmp_path, [tool_reply("query_batches", {"hatchery": "Süd"}, "c1"),
                                             text_reply("I am not allowed to see Süd.")])
    r = c.post("/v1/ask", json={"question": "Show me the numbers of Süd"}, headers={"X-API-Key": "key-anna"})
    assert r.status_code == 200 and "S3" not in r.text


def test_rate_limit(db, index, model, tmp_path):
    c = client(db, index, model, tmp_path, [text_reply("ok")] * 10, limit=2)
    codes = [c.post("/v1/ask", json={"question": "hello there"}, headers={"X-API-Key": "key-ben"}).status_code for _ in range(3)]
    assert codes == [200, 200, 429]
    assert c.post("/v1/ask", json={"question": "hello there"}, headers={"X-API-Key": "key-anna"}).status_code == 200


def test_rate_limiter_window():
    rl = mod("api").RateLimiter(limit=2, window=60)
    assert rl.allow("a", now=0) and rl.allow("a", now=1) and not rl.allow("a", now=2)
    assert rl.allow("a", now=61.5)
