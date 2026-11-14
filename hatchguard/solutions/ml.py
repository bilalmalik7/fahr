"""Milestone 2: the machine learning loop with a library. Predict which batches will hatch badly.

You practise: features and label, a split by time, a baseline, training, precision and recall, a threshold.
"""
from __future__ import annotations

import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier

FEATURES = ["egg_age_days", "flock_age_weeks", "avg_temp", "humidity"]


def to_xy(rows: list[dict]) -> tuple[np.ndarray, np.ndarray]:
    """Turn cleaned rows into X (n rows x 4 features, float) and y (n labels, 0 or 1 from the field "bad")."""
    # >>> YOUR CODE
    X = np.array([[r[f] for f in FEATURES] for r in rows], dtype=float)
    y = np.array([r["bad"] for r in rows], dtype=int)
    return X, y
    # <<<


def time_split(rows: list[dict], cutoff: str) -> tuple[list[dict], list[dict]]:
    """Rows with set_date < cutoff go to train, the rest to test. Never split time data randomly."""
    # >>> YOUR CODE
    train = [r for r in rows if r["set_date"] < cutoff]
    test = [r for r in rows if r["set_date"] >= cutoff]
    return train, test
    # <<<


def baseline_accuracy(train: list[dict], test: list[dict]) -> float:
    """Accuracy of the simplest possible model: always predict the most common label of the training data."""
    # >>> YOUR CODE
    majority = 1 if sum(r["bad"] for r in train) * 2 > len(train) else 0
    return sum(r["bad"] == majority for r in test) / len(test)
    # <<<


def train_model(train: list[dict]):
    """Fit a HistGradientBoostingClassifier (random_state=0) on the training rows and return it."""
    # >>> YOUR CODE
    X, y = to_xy(train)
    return HistGradientBoostingClassifier(random_state=0, max_iter=150).fit(X, y)
    # <<<


def evaluate(model, test: list[dict], threshold: float = 0.5) -> dict:
    """Return {"accuracy", "precision", "recall", "f1", "tp", "fp", "fn", "tn"} at the given threshold.

    A batch is flagged when the predicted probability of "bad" is >= threshold.
    If a division would be by zero, use 0.0.
    """
    # >>> YOUR CODE
    X, y = to_xy(test)
    flag = model.predict_proba(X)[:, 1] >= threshold
    tp = int(np.sum(flag & (y == 1))); fp = int(np.sum(flag & (y == 0)))
    fn = int(np.sum(~flag & (y == 1))); tn = int(np.sum(~flag & (y == 0)))
    precision = tp / (tp + fp) if tp + fp else 0.0
    recall = tp / (tp + fn) if tp + fn else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    return {"accuracy": (tp + tn) / len(y), "precision": precision, "recall": recall, "f1": f1,
            "tp": tp, "fp": fp, "fn": fn, "tn": tn}
    # <<<


def pick_threshold(model, rows: list[dict], min_recall: float = 0.8) -> float:
    """Try thresholds 0.05, 0.10, ... 0.95. Return the HIGHEST one whose recall is still >= min_recall.

    Business meaning: "catch at least 80 % of bad batches, with as few false alarms as possible".
    If none reaches min_recall, return 0.05.
    """
    # >>> YOUR CODE
    best = 0.05
    for t in [round(0.05 * i, 2) for i in range(1, 20)]:
        if evaluate(model, rows, t)["recall"] >= min_recall:
            best = t
    return best
    # <<<


def predict_risk(model, egg_age_days: float, flock_age_weeks: float, avg_temp: float, humidity: float) -> float:
    """Probability (0 to 1) that a batch with these values hatches badly."""
    # >>> YOUR CODE
    return float(model.predict_proba(np.array([[egg_age_days, flock_age_weeks, avg_temp, humidity]]))[0, 1])
    # <<<
