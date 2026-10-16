---
agent: agent
description: Use a test-first workflow for a bug fix or behavior change
---

# Test-Driven Workflow

Use a focused RED -> GREEN -> IMPROVE loop when the project has a suitable test setup.

## Cycle

1. **RED**: Add or update a test that describes the expected behavior, then run it and confirm it fails for the expected reason.
2. **GREEN**: Make the smallest implementation change that passes the test, then rerun it.
3. **IMPROVE**: Simplify the change without altering behavior and rerun the relevant checks.

Use descriptive behavior-based test names and cover important edge cases. First inspect the repository's existing test tools and conventions; do not introduce a new framework solely to satisfy this workflow. If no automated test setup is available, use the closest practical verification and state the limitation clearly.