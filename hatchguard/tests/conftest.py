"""Shared test setup. By default the tests check YOUR code in hatchguard/.
Run them against the reference code with:  HG_IMPL=solutions uv run pytest
"""
import importlib
import os
import shutil
from pathlib import Path

import pytest

from hatchguard import data as data_module
from hatchguard.embed import HashEmbedder

IMPL = os.environ.get("HG_IMPL", "hatchguard")
ROOT = Path(__file__).resolve().parent.parent


def mod(name: str):
    return importlib.import_module(f"{IMPL}.{name}")


@pytest.fixture(scope="session")
def db(tmp_path_factory) -> Path:
    if not data_module.DB_PATH.exists():
        data_module.main()
    target = tmp_path_factory.mktemp("db") / "hatchguard.db"
    shutil.copy(data_module.DB_PATH, target)
    return target


@pytest.fixture(scope="session")
def rows(db):
    return mod("clean").load_batches(db)


@pytest.fixture(scope="session")
def good(rows):
    return mod("clean").clean_batches(rows)[0]


@pytest.fixture(scope="session")
def model(good):
    ml = mod("ml")
    train, _ = ml.time_split(good, "2026-05-01")
    return ml.train_model(train)


@pytest.fixture(scope="session")
def index():
    rag = mod("rag")
    return rag.Index(rag.load_docs(data_module.SOP_DIR), HashEmbedder())


USERS = {"anna": {"user_name": "anna", "hatchery": "Nord", "role": "staff"},
         "ben": {"user_name": "ben", "hatchery": "Süd", "role": "staff"},
         "chris": {"user_name": "chris", "hatchery": "*", "role": "manager"}}
