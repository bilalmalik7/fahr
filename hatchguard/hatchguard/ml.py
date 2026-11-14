"""Milestone 2: the machine learning loop with a library. Predict which batches will hatch badly.

You practise: features and label, a split by time, a baseline, training, precision and recall, a threshold.
"""
from __future__ import annotations

import numpy as np
from sklearn.ensemble import HistGradientBoostingClassifier

FEATURES = ["egg_age_days", "flock_age_weeks", "avg_temp", "humidity"]


def to_xy(rows: list[dict]) -> tuple[np.ndarray, np.ndarray]:
    """Turn cleaned rows into X (n rows x 4 features, float) and y (n labels, 0 or 1 from the field "bad")."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def time_split(rows: list[dict], cutoff: str) -> tuple[list[dict], list[dict]]:
    """Rows with set_date < cutoff go to train, the rest to test. Never split time data randomly."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def baseline_accuracy(train: list[dict], test: list[dict]) -> float:
    """Accuracy of the simplest possible model: always predict the most common label of the training data."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def train_model(train: list[dict]):
    """Fit a HistGradientBoostingClassifier (random_state=0) on the training rows and return it."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def evaluate(model, test: list[dict], threshold: float = 0.5) -> dict:
    """Return {"accuracy", "precision", "recall", "f1", "tp", "fp", "fn", "tn"} at the given threshold.

    A batch is flagged when the predicted probability of "bad" is >= threshold.
    If a division would be by zero, use 0.0.
    """
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def pick_threshold(model, rows: list[dict], min_recall: float = 0.8) -> float:
    """Try thresholds 0.05, 0.10, ... 0.95. Return the HIGHEST one whose recall is still >= min_recall.

    Business meaning: "catch at least 80 % of bad batches, with as few false alarms as possible".
    If none reaches min_recall, return 0.05.
    """
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")


def predict_risk(model, egg_age_days: float, flock_age_weeks: float, avg_temp: float, humidity: float) -> float:
    """Probability (0 to 1) that a batch with these values hatches badly."""
    # TODO: write this. Read the docstring above. Delete the next line when you start.
    raise NotImplementedError("your turn")
