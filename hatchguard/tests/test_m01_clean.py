from conftest import mod


def test_load_returns_dicts(rows):
    assert len(rows) == 1148
    assert set(rows[0]) == {"batch_id", "hatchery", "machine", "set_date", "egg_age_days", "flock_age_weeks",
                            "avg_temp", "humidity", "eggs_set", "hatched"}


def test_clean_splits_good_and_quarantine(rows):
    good, quarantine = mod("clean").clean_batches(rows)
    assert len(good) + len(quarantine) == 1140          # 8 exact duplicates dropped
    reasons = sorted({q["_reason"] for q in quarantine})
    assert reasons == ["hatched > eggs_set", "missing hatched"]
    assert all(0 < g["rate"] <= 1 and g["bad"] in (0, 1) for g in good)
    assert all((g["rate"] < 0.75) == (g["bad"] == 1) for g in good)


def test_clean_does_not_change_input(rows):
    before = [dict(r) for r in rows[:50]]
    mod("clean").clean_batches(rows[:50])
    assert rows[:50] == before and "rate" not in rows[0]


def test_quality_report(rows):
    rep = mod("clean").quality_report(rows)
    assert rep["rows"] == 1148 and rep["duplicates"] == 8
    assert rep["missing_hatched"] + rep["impossible"] + rep["good"] + rep["duplicates"] == rep["rows"]
    assert rep["missing_hatched"] >= 1 and rep["impossible"] >= 1
