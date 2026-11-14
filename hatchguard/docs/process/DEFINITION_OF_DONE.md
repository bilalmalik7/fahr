# Definition of done

A ticket is done when ALL of these are true. "It works on my machine" is not on the list.

- [ ] The acceptance criteria of the ticket are met, and the milestone tests pass: `uv run pytest tests/test_mXX_*.py`
- [ ] All earlier tests still pass: `uv run pytest`
- [ ] `uv run ruff check hatchguard tests` is clean
- [ ] The work is on a branch named `hg-<number>-<short-name>`, in small commits with clear messages
- [ ] A pull request is open with the template filled in, and CI is green
- [ ] You reviewed your own pull request the next day with the review checklist, as if a stranger wrote it
- [ ] If a real decision was made, there is an ADR in `docs/adr/`
- [ ] No secrets, no real data, no leftover debug prints
- [ ] The README or the runbook is updated if behaviour changed
- [ ] The numbers that matter for this ticket are written in the pull request (rows, recall, hit rate, tokens ...)

## Review checklist (use it on every pull request)

1. Does it do what the ticket asks, and nothing else?
2. What happens with empty input, null, duplicates, a very long input?
3. Can it run twice without harm?
4. Is every external call given a timeout, and every loop a limit?
5. Does any data cross a permission border? Where is that checked, in code?
6. Is anything from a user, a document or a model used as code, SQL, HTML or a file path without a check?
7. Are there tests for the failure cases, not only the happy path?
8. Could a new colleague understand it in ten minutes?
