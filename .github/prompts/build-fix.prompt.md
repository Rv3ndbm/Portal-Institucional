---
agent: agent
description: Diagnose and fix a build, lint, runtime, or test failure systematically
---

# Build and Error Resolution

Fix the root cause of the reported failure without suppressing useful checks.

## Process

1. Capture the complete error, command, and affected file or line.
2. Reproduce it with the narrowest relevant command, if available.
3. Categorize the cause: syntax, runtime, dependency, environment, test, or configuration.
4. Inspect the owning code path and make the smallest root-cause fix.
5. Rerun the same check, then run one nearby regression check if appropriate.

Use the repository's existing tools. For example, PHP files can be checked with `php -l`; do not assume a Node, Python, or other build pipeline exists. Do not hide failures by disabling checks or deleting lock/configuration files without evidence.