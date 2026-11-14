import numpy as np
from conftest import mod


def test_sigmoid_and_loss():
    lp = mod("loop")
    assert abs(lp.sigmoid(np.array([0.0]))[0] - 0.5) < 1e-9
    assert lp.sigmoid(np.array([100.0]))[0] > 0.99 and lp.sigmoid(np.array([-100.0]))[0] < 0.01
    y = np.array([1, 0])
    assert lp.loss(np.array([0.9, 0.1]), y) < lp.loss(np.array([0.5, 0.5]), y) < lp.loss(np.array([0.1, 0.9]), y)


def test_standardize():
    Xs, mean, std = mod("loop").standardize(np.array([[1.0, 10.0], [3.0, 30.0]]))
    assert np.allclose(Xs.mean(axis=0), 0) and np.allclose(Xs.std(axis=0), 1)
    assert np.allclose(mean, [2, 20])


def test_gradients_point_downhill():
    lp = mod("loop")
    X, y = np.array([[1.0], [-1.0]]), np.array([1, 0])
    w, b = np.zeros(1), 0.0
    dw, db = lp.gradients(X, lp.forward(X, w, b), y)
    assert dw[0] < 0 and abs(db) < 1e-9          # raising w lowers the loss


def test_training_learns(good):
    lp, ml = mod("loop"), mod("ml")
    train, test = ml.time_split(good, "2026-05-01")
    X, y = ml.to_xy(train)
    # the effect of temperature is "distance from 37.8", so give the model that feature
    feats = lambda X: np.column_stack([X[:, 0], np.abs(X[:, 1] - 40), np.abs(X[:, 2] - 37.8), np.abs(X[:, 3] - 55)])
    Xs, mean, std = lp.standardize(feats(X))
    w, b, history = lp.train(Xs, y, lr=0.3, epochs=400)
    assert len(history) == 400 and history[-1] < history[0] * 0.75
    assert all(history[i + 1] <= history[i] + 1e-6 for i in range(len(history) - 1)), "loss must fall every epoch"
    Xt, yt = ml.to_xy(test)
    pred = lp.forward((feats(Xt) - mean) / std, w, b) >= 0.5
    assert (pred == yt).mean() > 0.8
