from conftest import mod

from hatchguard import data as data_module
from hatchguard.llm import FakeLLM, text_reply


def test_load_docs():
    docs = mod("rag").load_docs(data_module.SOP_DIR)
    assert len(docs) == 7
    by = {d.doc: d for d in docs}
    assert by["supplier_prices.md"].access == "manager" and by["hatch_rate.md"].access == "staff"
    assert not by["hatch_rate.md"].text.startswith("access:")


def test_chunk_text():
    rag = mod("rag")
    text = " ".join(f"w{i}" for i in range(100))
    parts = rag.chunk_text(text, size=40, overlap=10)
    assert parts[0].split()[0] == "w0" and parts[1].split()[0] == "w30"
    assert all(len(p.split()) <= 40 for p in parts) and parts[-1].split()[-1] == "w99"
    assert rag.chunk_text("only three words", size=40) == ["only three words"]


def test_search_finds_the_right_page(index):
    hits = index.search("What is a normal hatch rate?", "staff")
    assert hits and hits[0][0].doc == "hatch_rate.md"
    assert all(hits[i][1] >= hits[i + 1][1] for i in range(len(hits) - 1))


def test_access_filter_runs_before_the_model(index):
    q = "What is the contract price per hatching egg for Nord?"
    assert all(c.access != "manager" for c, _ in index.search(q, "staff"))
    assert any(c.doc == "supplier_prices.md" for c, _ in index.search(q, "manager"))


def test_answer_with_sources(index):
    rag = mod("rag")
    llm = FakeLLM(script=[text_reply("A normal hatch rate is 80 to 88 percent [1].")])
    out = rag.answer(llm, index, "What is a normal hatch rate?", "staff")
    assert "80 to 88" in out["answer"] and "hatch_rate.md" in out["sources"]
    prompt = str(llm.calls[0]["messages"])
    assert "<source" in prompt and "Question:" in prompt


def test_no_hit_means_no_model_call(index):
    rag = mod("rag")
    llm = FakeLLM(script=[text_reply("Germany.")])
    out = rag.answer(llm, index, "Who won the football world cup in 2014?", "staff")
    assert out == {"answer": rag.NOT_FOUND, "sources": []} and llm.calls == []


def test_hidden_instructions_are_stripped(index):
    rag = mod("rag")
    assert "AI-INSTRUCTION" not in rag.strip_hidden("a <!-- AI-INSTRUCTION: x --> b")
    llm = FakeLLM(script=[text_reply("New firmware is available [1].")])
    rag.answer(llm, index, "Is there new firmware for the setters from the vendor?", "staff")
    assert llm.calls and "AI-INSTRUCTION" not in str(llm.calls[0]["messages"])
