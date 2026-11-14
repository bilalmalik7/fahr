from conftest import mod


def test_time_split_has_no_leak(good):
    train, test = mod("ml").time_split(good, "2026-05-01")
    assert train and test
    assert max(r["set_date"] for r in train) < "2026-05-01" <= min(r["set_date"] for r in test)


def test_to_xy_shapes(good):
    X, y = mod("ml").to_xy(good[:10])
    assert X.shape == (10, 4) and y.shape == (10,) and set(y) <= {0, 1}


def test_model_beats_baseline_on_recall(good, model):
    ml = mod("ml")
    train, test = ml.time_split(good, "2026-05-01")
    base = ml.baseline_accuracy(train, test)
    m = ml.evaluate(model, test, 0.5)
    assert 0.5 < base < 1
    assert m["recall"] > 0.5, "the baseline finds 0 % of bad batches. Your model must find more than half"
    assert m["precision"] > 0.5
    assert m["tp"] + m["fp"] + m["fn"] + m["tn"] == len(test)


def test_threshold_trades_precision_for_recall(good, model):
    ml = mod("ml")
    _, test = ml.time_split(good, "2026-05-01")
    low, high = ml.evaluate(model, test, 0.1), ml.evaluate(model, test, 0.9)
    assert low["recall"] >= high["recall"] and low["fp"] >= high["fp"]
    t = ml.pick_threshold(model, test, min_recall=0.8)
    assert 0.05 <= t <= 0.95 and ml.evaluate(model, test, t)["recall"] >= 0.8


def test_predict_risk_reacts_to_temperature(model):
    ml = mod("ml")
    normal = ml.predict_risk(model, 6, 40, 37.8, 55)
    hot = ml.predict_risk(model, 6, 40, 38.8, 55)
    assert 0 <= normal <= 1 and hot > normal + 0.3
