"""Embeddings. Complete: you use it in milestone 5.

HashEmbedder turns text into a vector with the "hashing trick": every word adds 1 to one of `dim` slots.
It understands no meaning, but it is free, instant and deterministic, so tests can use it.
SentenceTransformerEmbedder is a real meaning-based model (uv sync --extra embed). Swap it in and compare.
"""
from __future__ import annotations

import hashlib
import re

import numpy as np

STOP = set("a an the is are of to in on at for and or if it its be as by this that with from what how why when "
           "which who do does der die das und ist ein eine".split())


def words(text: str) -> list[str]:
    out = []
    for w in re.findall(r"[a-zäöüß0-9]+", text.lower()):
        if w in STOP:
            continue
        if len(w) > 4 and w.endswith("s"):
            w = w[:-1]
        out.append(w)
    return out


class HashEmbedder:
    def __init__(self, dim: int = 512):
        self.dim = dim

    def encode(self, texts: list[str]) -> np.ndarray:
        m = np.zeros((len(texts), self.dim), dtype=np.float32)
        for i, t in enumerate(texts):
            for w in words(t):
                h = int(hashlib.md5(w.encode()).hexdigest(), 16)
                m[i, h % self.dim] += 1.0
        norms = np.linalg.norm(m, axis=1, keepdims=True)
        return m / np.where(norms == 0, 1, norms)


class SentenceTransformerEmbedder:
    def __init__(self, name: str = "BAAI/bge-m3"):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer(name)

    def encode(self, texts: list[str]) -> np.ndarray:
        return np.asarray(self.model.encode(texts, normalize_embeddings=True), dtype=np.float32)
