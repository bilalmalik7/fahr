"""Milestone 3: the training loop by hand. No library does the learning for you here.

You write logistic regression in NumPy: forward, loss, gradient, step. It is the same loop that trains
every neural network, including large language models, only smaller.
"""
from __future__ import annotations

import numpy as np


def standardize(X: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """Return (X_scaled, mean, std) where each column of X_scaled has mean 0 and std 1."""
    # >>> YOUR CODE
    mean, std = X.mean(axis=0), X.std(axis=0)
    std = np.where(std == 0, 1.0, std)
    return (X - mean) / std, mean, std
    # <<<


def sigmoid(z: np.ndarray) -> np.ndarray:
    """1 / (1 + e^-z). Turns any number into a probability between 0 and 1."""
    # >>> YOUR CODE
    return 1.0 / (1.0 + np.exp(-np.clip(z, -50, 50)))
    # <<<


def forward(X: np.ndarray, w: np.ndarray, b: float) -> np.ndarray:
    """The prediction: sigmoid(X @ w + b). One probability per row."""
    # >>> YOUR CODE
    return sigmoid(X @ w + b)
    # <<<


def loss(p: np.ndarray, y: np.ndarray) -> float:
    """Binary cross-entropy: the average of -(y*log(p) + (1-y)*log(1-p)). Clip p to [1e-9, 1-1e-9] first."""
    # >>> YOUR CODE
    p = np.clip(p, 1e-9, 1 - 1e-9)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))
    # <<<


def gradients(X: np.ndarray, p: np.ndarray, y: np.ndarray) -> tuple[np.ndarray, float]:
    """The slope of the loss: dw = X.T @ (p - y) / n   and   db = mean(p - y)."""
    # >>> YOUR CODE
    n = len(y)
    return X.T @ (p - y) / n, float(np.mean(p - y))
    # <<<


def train(X: np.ndarray, y: np.ndarray, lr: float = 0.1, epochs: int = 300) -> tuple[np.ndarray, float, list[float]]:
    """Gradient descent. Start with w = zeros and b = 0. Repeat `epochs` times:
         forward -> loss -> gradients -> w = w - lr * dw, b = b - lr * db
       Return (w, b, history) where history is the loss of every epoch.
    """
    # >>> YOUR CODE
    w, b, history = np.zeros(X.shape[1]), 0.0, []
    for _ in range(epochs):
        p = forward(X, w, b)
        history.append(loss(p, y))
        dw, db = gradients(X, p, y)
        w, b = w - lr * dw, b - lr * db
    return w, b, history
    # <<<
