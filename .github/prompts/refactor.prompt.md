---
agent: agent
description: Simplify code structure without changing externally observable behavior
---

# Refactor and Cleanup

Improve the selected code's structure while preserving its behavior.

## Before Starting

- Identify the requested scope and inspect its callers and nearby tests.
- Run a relevant baseline check when one is available.

## Targets

- Remove demonstrably unused code and duplicated logic.
- Improve names that do not reflect behavior.
- Extract a helper only when it makes existing duplication or complexity clearer.
- Follow the surrounding PHP, HTML, CSS, and JavaScript conventions.

## Constraints

- Keep behavior changes out of a structural refactor.
- Make one coherent change at a time and preserve unrelated user changes.
- Rerun relevant checks after editing; state when automated coverage is unavailable.

## Report

Summarize what changed and which checks were run.