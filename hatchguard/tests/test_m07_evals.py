from conftest import mod

from hatchguard.embed import HashEmbedder


def test_retrieval_eval_numbers(index):
    out = mod("evals").retrieval_eval(index)
    assert out["hit_rate"] >= 0.85, out["misses"]
    assert out["leaks"] == 0 and out["false_answers"] == 0


def test_eval_catches_a_broken_index(index):
    ev, rag = mod("evals"), mod("rag")

    class Leaky(rag.Index):                    # a bug: the access filter is gone, and nothing is ever refused
        def search(self, query, role, k=3, min_score=0.12):
            return super().search(query, "manager", k, min_score=-1)

    broken = Leaky(index.chunks, HashEmbedder())
    out = ev.retrieval_eval(broken)
    assert out["leaks"] >= 1 and out["false_answers"] >= 1


def test_answer_eval():
    ev = mod("evals")
    fake = lambda q, role: {"answer": "It is 80 to 88 percent." if "normal" in q else "No idea.", "sources": []}
    out = ev.answer_eval(fake, [{"q": "What is a normal hatch rate?", "role": "staff", "must": "80 to 88"},
                                {"q": "How many days in the setter?", "role": "staff", "must": "18"}])
    assert out["correct"] == 1 and out["total"] == 2 and out["score"] == 0.5
    assert out["failed"] == ["How many days in the setter?"]


def test_compare():
    ev = mod("evals")
    assert ev.compare({"hit_rate": 0.71}, {"hit_rate": 0.88}) == "better (+0.17)"
    assert ev.compare({"hit_rate": 0.9}, {"hit_rate": 0.82}) == "worse (-0.08)"
    assert ev.compare({"hit_rate": 0.9}, {"hit_rate": 0.9}) == "same"
