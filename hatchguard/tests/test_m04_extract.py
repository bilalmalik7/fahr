import pytest
from conftest import mod

from hatchguard.llm import FakeLLM, text_reply

GOOD = '{"machine": "S3", "issue": "temperature", "temperature": 38.9, "action_needed": true}'
NOTE = "Machine S3 alarm at 03:10, temperature 38.9. Reset by night shift."


def test_parse_event_finds_json_in_text():
    ev = mod("extract").parse_event("Here you go:\n" + GOOD + "\nThanks")
    assert ev.machine == "S3" and ev.issue == "temperature" and ev.temperature == 38.9 and ev.action_needed


@pytest.mark.parametrize("bad", ["no json here", '{"machine": "S3"', '{"machine": "S3", "issue": "aliens", "temperature": 1, "action_needed": true}'])
def test_parse_event_rejects_bad_answers(bad):
    with pytest.raises(ValueError):
        mod("extract").parse_event(bad)


def test_extract_first_try():
    llm = FakeLLM(script=[text_reply(GOOD)])
    ev = mod("extract").extract_event(llm, NOTE)
    assert ev.machine == "S3" and len(llm.calls) == 1
    assert NOTE in str(llm.calls[0]["messages"]), "the note must be in the user message"


def test_extract_retries_with_the_error():
    llm = FakeLLM(script=[text_reply("Sure! The machine is S3."), text_reply(GOOD)])
    ev = mod("extract").extract_event(llm, NOTE)
    assert ev.issue == "temperature" and len(llm.calls) == 2
    second = llm.calls[1]["messages"]
    assert len(second) == 3 and second[1]["role"] == "assistant" and second[2]["role"] == "user"


def test_extract_gives_up():
    llm = FakeLLM(script=[text_reply("nope"), text_reply("still nope")])
    with pytest.raises(ValueError):
        mod("extract").extract_event(llm, NOTE)
    assert len(llm.calls) == 2
